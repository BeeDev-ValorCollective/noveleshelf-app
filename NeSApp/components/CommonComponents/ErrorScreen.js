import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';

/*
 * Covers both flavors seen across the app:
 *  - plain centered message (most detail screens): default props
 *  - message + tappable action (e.g. handoff.js "Return to login"):
 *    pass actionLabel + onAction
 *
 * textColor/fontSize are overridable since existing screens aren't all
 * styled identically yet (e.g. handoff.js uses white/15px, others use
 * the default secondary/unsized look) -- safe to standardize later.
 */
export default function ErrorScreen({
    message,
    actionLabel,
    onAction,
    textColor = colors.secondary,
    fontSize,
}) {
    return (
        <View style={styles.container}>
            <Text style={[styles.errorText, { color: textColor, fontSize }]}>
                {message}
            </Text>

            {actionLabel && onAction && (
                <Text style={styles.actionText} onPress={onAction}>
                    {actionLabel}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    errorText: {
        fontFamily: fonts.meriendaRegular,
        textAlign: 'center',
        marginBottom: 12,
    },
    actionText: {
        color: colors.primary,
        fontFamily: fonts.meriendaBold,
        fontSize: 14,
    },
});