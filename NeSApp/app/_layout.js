
import {
    Stack,
    useRouter,
    useRootNavigationState,
} from 'expo-router';

import { useFonts } from 'expo-font';
import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import * as NavigationBar from 'expo-navigation-bar';

import { StatusBar } from 'expo-status-bar';

import { FrederickatheGreat_400Regular } from '@expo-google-fonts/fredericka-the-great';

import {
    Merienda_400Regular,
    Merienda_700Bold,
} from '@expo-google-fonts/merienda';

import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';

import useAuthStore from '../store/authStore';

import {
    installAuthenticatedFetch,
    restoreSession,
} from '../utils/session';

SplashScreen.preventAutoHideAsync();

// Install the shared authenticated fetch handler.
// This preserves:
// - X-Client-Platform tracking
// - Automatic access-token refresh
// - Retrying authenticated requests after refresh
installAuthenticatedFetch();


// --------------------------------------------------
// NOTIFICATION HELPERS
// --------------------------------------------------

function getBookIdFromNotification(response) {
    const data =
        response?.notification?.request?.content?.data;

    if (!data) {
        return null;
    }

    const supportedTypes = [
        'book_published',
        'chapter_published',
    ];

    if (!supportedTypes.includes(data.type)) {
        return null;
    }

    const bookId = data.book_id;

    if (
        typeof bookId !== 'string' &&
        typeof bookId !== 'number'
    ) {
        return null;
    }

    const normalizedId = String(bookId).trim();

    return normalizedId || null;
}


// --------------------------------------------------
// NOTIFICATION NAVIGATION
// --------------------------------------------------

function NotificationNavigation({ isAuthReady }) {
    const router = useRouter();
    const navigationState = useRootNavigationState();

    const isAuthenticated = useAuthStore(
        (state) => state.isAuthenticated
    );

    const isLoading = useAuthStore(
        (state) => state.isLoading
    );

    const [pendingBookId, setPendingBookId] =
        useState(null);

    const handledResponses = useRef(new Set());

    const isReady =
        isAuthReady &&
        !isLoading &&
        !!navigationState?.key;


    // -----------------------------------------------
    // LISTEN FOR NOTIFICATION TAPS
    // -----------------------------------------------

    useEffect(() => {
        if (Platform.OS === 'web') {
            return;
        }

        let active = true;

        const handleResponse = (response) => {
            if (!active || !response) {
                return;
            }

            const bookId =
                getBookIdFromNotification(response);

            if (!bookId) {
                return;
            }

            const notificationId =
                response.notification?.request?.identifier;

            if (
                notificationId &&
                handledResponses.current.has(notificationId)
            ) {
                return;
            }

            if (notificationId) {
                handledResponses.current.add(notificationId);
            }

            console.log(
                '[PUSH] Notification tapped for book:',
                bookId
            );

            setPendingBookId(bookId);
        };

        // Handles notification taps while the app
        // is running or in the background.
        const subscription =
            Notifications.addNotificationResponseReceivedListener(
                handleResponse
            );

        // Handles notifications that launch the app
        // from a completely closed state.
        Notifications.getLastNotificationResponseAsync()
            .then(handleResponse)
            .catch((error) => {
                console.error(
                    '[PUSH] Could not read launch notification:',
                    error
                );
            });

        return () => {
            active = false;
            subscription.remove();
        };
    }, []);


    // -----------------------------------------------
    // NAVIGATE AFTER AUTHENTICATION
    // -----------------------------------------------

    useEffect(() => {
        if (!pendingBookId || !isReady) {
            return;
        }

        // Wait for authentication before navigating.
        if (!isAuthenticated) {
            console.log(
                '[PUSH] Waiting for user authentication.'
            );

            return;
        }

        const bookId = pendingBookId;

        console.log(
            '[PUSH] Opening book details:',
            bookId
        );

        setPendingBookId(null);

        router.push({
            pathname:
                '/(protected)/(reader-tabs)/book/[id]',
            params: {
                id: bookId,
            },
        });

        // Prevent the same notification from
        // reopening after the next app launch.
        if (Platform.OS !== 'web') {
            Notifications.clearLastNotificationResponseAsync()
                .catch((error) => {
                    console.warn(
                        '[PUSH] Could not clear last response:',
                        error
                    );
                });
        }

    }, [
        pendingBookId,
        isReady,
        isAuthenticated,
        router,
    ]);

    return null;
}


// --------------------------------------------------
// ROOT LAYOUT
// --------------------------------------------------

export default function RootLayout() {
    const [isAuthReady, setIsAuthReady] =
        useState(false);

    const [fontsLoaded, fontError] = useFonts({
        FrederickatheGreat_400Regular,
        Merienda_400Regular,
        Merienda_700Bold,
    });


    // -----------------------------------------------
    // ANDROID NAVIGATION BAR
    // -----------------------------------------------

    useEffect(() => {
        if (Platform.OS !== 'android') {
            return;
        }

        NavigationBar.setButtonStyleAsync('light');
    }, []);


    // -----------------------------------------------
    // RESTORE AUTHENTICATION
    // -----------------------------------------------

    useEffect(() => {
        let active = true;

        const loadAuth = async () => {
            try {
                console.log(
                    '[AUTH] Restoring saved session...'
                );

                // Validates the session through /auth/me/.
                // If the access token has expired, the session
                // utility attempts to refresh it.
                //
                // The /auth/me/ request also preserves the
                // daily login activity behavior from dev.
                await restoreSession();

            } catch (error) {
                console.error(
                    '[AUTH] Unexpected restoration error:',
                    error
                );

            } finally {
                if (active) {
                    setIsAuthReady(true);
                }
            }
        };

        loadAuth();

        return () => {
            active = false;
        };
    }, []);


    // -----------------------------------------------
    // HIDE SPLASH SCREEN
    // -----------------------------------------------

    useEffect(() => {
        if (
            (fontsLoaded || fontError) &&
            isAuthReady
        ) {
            SplashScreen.hideAsync();
        }
    }, [
        fontsLoaded,
        fontError,
        isAuthReady,
    ]);


    // -----------------------------------------------
    // WAIT FOR INITIALIZATION
    // -----------------------------------------------

    if (
        (!fontsLoaded && !fontError) ||
        !isAuthReady
    ) {
        return null;
    }


    // -----------------------------------------------
    // APP NAVIGATION
    // -----------------------------------------------

    return (
        <>
            <StatusBar style="light" />

            <Stack
                screenOptions={{
                    headerStyle: {
                        backgroundColor: colors.background,
                    },
                    headerTintColor: colors.white,
                    headerTitleStyle: {
                        fontFamily: fonts.fredericka,
                    },
                    headerBackTitle: '',
                }}
            >
                <Stack.Screen
                    name="index"
                    options={{ headerShown: false }}
                />

                <Stack.Screen
                    name="auth/login"
                    options={{ headerShown: false }}
                />

                <Stack.Screen
                    name="auth/register"
                    options={{ headerShown: false }}
                />

                <Stack.Screen
                    name="(protected)"
                    options={{ headerShown: false }}
                />
            </Stack>

            <NotificationNavigation
                isAuthReady={isAuthReady}
            />
        </>
    );
}
