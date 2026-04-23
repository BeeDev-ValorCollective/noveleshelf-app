import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAuthStore from '../store/authStore';
import { FrederickatheGreat_400Regular } from '@expo-google-fonts/fredericka-the-great';
import { Merienda_400Regular, Merienda_700Bold } from '@expo-google-fonts/merienda';
import { View, Text } from 'react-native';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';

export default function RootLayout() {

    const [fontsLoaded, fontError] = useFonts({
        FrederickatheGreat_400Regular,
        Merienda_400Regular,
        Merienda_700Bold,
    });

    useEffect(() => {
    const loadAuth = async () => {
        const accessToken = await AsyncStorage.getItem('access_token');
        const refreshToken = await AsyncStorage.getItem('refresh_token');
        if (accessToken) {
        useAuthStore.getState().updateAccessToken(accessToken);
        }
    };
    loadAuth();
    }, []);

    if (fontError) console.error('Font error:', fontError);

    if (!fontsLoaded) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Loading...</Text>
            </View>
        );
    }

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
                options={{ title: 'Novel eShelf' }} 
            />
            <Stack.Screen 
                name="auth/login" 
                options={{ title: 'Sign In' }} 
            />
            <Stack.Screen 
                name="(protected)" 
                options={{ headerShown: false }} 
            />
        </Stack>
    );
}