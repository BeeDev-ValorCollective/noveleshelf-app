import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import useAuthStore from '../store/authStore';
import { FrederickatheGreat_400Regular } from '@expo-google-fonts/fredericka-the-great';
import { Merienda_400Regular, Merienda_700Bold } from '@expo-google-fonts/merienda';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

// Tag every outgoing fetch with which Expo runtime made it, so the backend
// can tell Expo-web / Expo-native apart from Vite in DailyActivity/Event logs.
// Patched once here at module scope so it applies before any screen fetches.
const originalFetch = global.fetch;
global.fetch = (url, options = {}) => {
    return originalFetch(url, {
        ...options,
        headers: {
            ...options.headers,
            'X-Client-Platform': Platform.OS === 'web' ? 'expo_web' : 'expo_native',
        },
    });
};

export default function RootLayout() {
    const [isAuthReady, setIsAuthReady] = useState(false);

    const [fontsLoaded, fontError] = useFonts({
        FrederickatheGreat_400Regular,
        Merienda_400Regular,
        Merienda_700Bold,
    });

    useEffect(() => {
        const loadAuth = async () => {
            const accessToken = await AsyncStorage.getItem('access_token');
            const refreshToken = await AsyncStorage.getItem('refresh_token');
            const userJson = await AsyncStorage.getItem('user');
            console.log('loadAuth - accessToken:', !!accessToken, 'userJson:', !!userJson);
            if (accessToken && userJson) {
                const user = JSON.parse(userJson);
                await useAuthStore.getState().setAuth(user, accessToken, refreshToken);
            } else {
                useAuthStore.getState().setAuthReady();
            }
            setIsAuthReady(true);
        };
        loadAuth();
    }, []);

    useEffect(() => {
        if ((fontsLoaded || fontError) && isAuthReady) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontError, isAuthReady]);

    if (!fontsLoaded && !fontError) return null;

    return (
        <Stack
            screenOptions={{
                headerStyle: { backgroundColor: colors.background },
                headerTintColor: colors.white,
                headerTitleStyle: { fontFamily: fonts.fredericka },
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
    );
}