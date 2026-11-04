
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ENDPOINTS } from './api';
import useAuthStore from '../store/authStore';

const nativeFetch = global.fetch.bind(global);

let refreshPromise = null;
let installed = false;

function getHeader(headers, name) {
    return new Headers(headers || {}).get(name);
}

function withHeaders(options, changes) {
    const headers = new Headers(options?.headers || {});

    Object.entries(changes).forEach(([key, value]) => {
        headers.set(key, value);
    });

    return { ...options, headers };
}

function isAuthEndpoint(url) {
    const path = String(url);

    return [
        ENDPOINTS.auth.login,
        ENDPOINTS.auth.register,
        ENDPOINTS.auth.refresh,
        ENDPOINTS.auth.logout,
    ].some((endpoint) => path.startsWith(endpoint));
}

async function requestTokenRefresh(refreshToken) {
    const response = await nativeFetch(
        ENDPOINTS.auth.refresh,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Client-Platform':
                    Platform.OS === 'web'
                        ? 'expo_web'
                        : 'expo_native',
            },
            body: JSON.stringify({
                refresh: refreshToken,
            }),
        }
    );

    if (response.status === 400 || response.status === 401) {
        return { status: 'invalid' };
    }

    if (!response.ok) {
        throw new Error(
            `Token refresh failed: HTTP ${response.status}`
        );
    }

    const data = await response.json();

    if (!data.access) {
        throw new Error('Refresh response has no access token.');
    }

    return {
        status: 'success',
        access: data.access,
        refresh: data.refresh || refreshToken,
    };
}

export async function refreshSession() {
    if (refreshPromise) {
        return refreshPromise;
    }

    refreshPromise = (async () => {
        const state = useAuthStore.getState();

        const refreshToken =
            state.refreshToken ||
            await AsyncStorage.getItem('refresh_token');

        if (!refreshToken) {
            await useAuthStore.getState().clearAuth();
            return null;
        }

        const result = await requestTokenRefresh(refreshToken);

        if (result.status === 'invalid') {
            await useAuthStore.getState().clearAuth();
            return null;
        }

        // If a different account logged in or the user
        // logged out while refresh was running, discard it.
        const latestRefresh =
            await AsyncStorage.getItem('refresh_token');

        if (latestRefresh !== refreshToken) {
            return null;
        }

        await useAuthStore.getState().updateTokens(
            result.access,
            result.refresh
        );

        return result.access;
    })();

    try {
        return await refreshPromise;
    } finally {
        refreshPromise = null;
    }
}

export async function restoreSession() {
    const state = useAuthStore.getState();

    try {
        const values = await AsyncStorage.multiGet([
            'access_token',
            'refresh_token',
            'user',
            'current_role',
        ]);

        const saved = Object.fromEntries(values);

        if (!saved.user || !saved.refresh_token) {
            await state.clearAuth();
            return;
        }

        const user = JSON.parse(saved.user);

        let accessToken = saved.access_token;

        if (accessToken) {
            const response = await nativeFetch(
                ENDPOINTS.auth.me,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'X-Client-Platform':
                            Platform.OS === 'web'
                                ? 'expo_web'
                                : 'expo_native',
                    },
                }
            );

            if (response.status === 401) {
                accessToken = null;
            } else if (!response.ok) {
                throw new Error(
                    `Session validation failed: ${response.status}`
                );
            }
        }

        if (!accessToken) {
            const result = await requestTokenRefresh(
                saved.refresh_token
            );

            if (result.status === 'invalid') {
                await state.clearAuth();
                return;
            }

            accessToken = result.access;
            saved.refresh_token = result.refresh;
        }

        await state.setAuth(
            user,
            accessToken,
            saved.refresh_token
        );

        if (
            saved.current_role &&
            saved.current_role !== user.default_login_role
        ) {
            await useAuthStore.getState().setCurrentRole(
                saved.current_role
            );
        }

        console.log('[AUTH] Session restored successfully.');
    } catch (error) {
        console.warn(
            '[AUTH] Session could not be restored:',
            error?.message
        );

        // A network error should not delete saved tokens.
        // The user stays unauthenticated for this launch,
        // and the app can retry on its next launch.
        useAuthStore.getState().setAuthReady();
    }
}

export function installAuthenticatedFetch() {
    if (installed) return;
    installed = true;

    global.fetch = async (input, options = {}) => {
        const url =
            typeof input === 'string'
                ? input
                : input?.url || '';

        const taggedOptions = withHeaders(options, {
            'X-Client-Platform':
                Platform.OS === 'web'
                    ? 'expo_web'
                    : 'expo_native',
        });

        const authorization = getHeader(
            taggedOptions.headers,
            'Authorization'
        );

        const isBearer =
            authorization?.startsWith('Bearer ');

        // Public endpoints do not require token refresh.
        if (!isBearer || isAuthEndpoint(url)) {
            return nativeFetch(input, taggedOptions);
        }

        const store = useAuthStore.getState();

        const requestToken = authorization.slice(7);

        // Use the current token if a refresh has already
        // happened since this request was prepared.
        let accessToken = store.accessToken;

        if (
            accessToken &&
            requestToken !== accessToken
        ) {
            taggedOptions.headers.set(
                'Authorization',
                `Bearer ${accessToken}`
            );
        }

        let response = await nativeFetch(
            input,
            taggedOptions
        );

        if (response.status !== 401) {
            return response;
        }

        console.log(
            '[AUTH] Access token rejected. Refreshing...'
        );

        try {
            const latestToken =
                useAuthStore.getState().accessToken;

            if (
                latestToken &&
                latestToken !==
                taggedOptions.headers
                    .get('Authorization')
                    ?.slice(7)
            ) {
                accessToken = latestToken;
            } else {
                accessToken = await refreshSession();
            }

            if (!accessToken) {
                return response;
            }

            const retryOptions = withHeaders(
                taggedOptions,
                {
                    Authorization: `Bearer ${accessToken}`,
                }
            );

            response = await nativeFetch(
                input,
                retryOptions
            );

            if (response.status === 401) {
                await useAuthStore.getState().clearAuth();
            }

            return response;
        } catch (error) {
            console.warn(
                '[AUTH] Token refresh unavailable:',
                error?.message
            );

            return response;
        }
    };
}
