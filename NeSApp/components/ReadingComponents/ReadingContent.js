import { View, Text, ScrollView, ActivityIndicator, StyleSheet, useWindowDimensions } from 'react-native';
import RenderHTML from 'react-native-render-html';
import { Lock } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';

export default function ReadingContent({
    title,
    isBusy,
    isLocked,
    content,
    themeColors,
    fontSize,
}) {
    const { width } = useWindowDimensions();

    return (
        <ScrollView
            style={[styles.contentScroll, { backgroundColor: themeColors.background }]}
            contentContainerStyle={styles.contentContainer}
        >
            <Text style={[styles.itemTitle, { color: themeColors.text }]}>
                {title}
            </Text>

            {isBusy ? (
                <ActivityIndicator
                    color={colors.primary}
                    style={{ marginTop: 40 }}
                />
            ) : isLocked ? (
                <View style={styles.lockedState}>
                    <Lock color={colors.secondary} size={32} />
                    <Text style={styles.lockedText}>This chapter is locked.</Text>
                </View>
            ) : (
                <RenderHTML
                    contentWidth={width - 40}
                    source={{ html: content || '' }}
                    baseStyle={{
                        ...styles.htmlBase,
                        color: themeColors.text,
                        fontSize,
                    }}
                    ignoredStyles={['color', 'backgroundColor']}
                />
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    contentScroll: {
        flex: 1,
    },
    contentContainer: {
        padding: 20,
        paddingBottom: 40,
    },
    itemTitle: {
        color: colors.headerText,
        fontFamily: fonts.fredericka,
        fontSize: 20,
        marginBottom: 16,
    },
    htmlBase: {
        color: colors.headerText,
        fontFamily: fonts.meriendaRegular,
        fontSize: 18,
        lineHeight: 26,
    },
    lockedState: {
        alignItems: 'center',
        marginTop: 60,
        gap: 12,
    },
    lockedText: {
        color: colors.secondary,
        fontFamily: fonts.meriendaRegular,
        fontSize: 14,
    },
});