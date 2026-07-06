import { Stack, useRouter } from 'expo-router'
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import { View, Text, StyleSheet } from 'react-native'
import GradientButton from '../components/GradientButton';

export default function NotFound() {
    const router = useRouter()

    return (
        <>
        <Stack.Screen options={{ title: 'Page Not Found' }} />
        <View style={styles.container}>
            <Text style={styles.code}>404</Text>
            <Text style={styles.title}>Page Not Found</Text>
            <Text style={styles.message}>The page you're looking for doesn't exist.</Text>
            <GradientButton title="Go Home" onPress={() => router.push('/')} reverse={true} />
        </View>
        </>
        
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
        gap: 16,
        backgroundColor: colors.background,
    },
    code: {
        fontFamily: fonts.fredericka,
        fontSize: 80,
        fontWeight: '700',
        color: colors.headerText,
        lineHeight: 88,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: colors.faded,
        textAlign: 'center',
    },
    message: {
        fontSize: 15,
        color: colors.altfaded,
        textAlign: 'center',
        lineHeight: 22,
        maxWidth: 300,
    },
})