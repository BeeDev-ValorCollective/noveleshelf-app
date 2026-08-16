import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';

// Covers the 'loading' phase (spinner only) and the 'error' phase (message only)
export default function CenterStatus({ loading, message }) {
    return (
        <View style={styles.centerContainer}>
            {loading ? (
                <ActivityIndicator color={colors.primary} size="large" />
            ) : (
                <Text style={styles.errorText}>{message}</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    centerContainer: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    errorText: {
        color: colors.secondary,
        fontFamily: fonts.meriendaRegular,
        textAlign: 'center',
    },
});