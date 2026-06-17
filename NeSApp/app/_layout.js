import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAuthStore from '../store/authStore';
import { FrederickatheGreat_400Regular } from '@expo-google-fonts/fredericka-the-great';
import { Merienda_400Regular, Merienda_700Bold } from '@expo-google-fonts/merienda';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

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