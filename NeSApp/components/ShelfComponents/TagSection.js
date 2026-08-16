import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';

export default function TagSection({ title, items }) {
    if (!items?.length) {
        return null;
    }

    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <View style={styles.tagRow}>
                {items.map((item) => (
                    <View key={item.id} style={styles.tag}>
                        <Text style={styles.tagText}>{item.name}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    section: { marginBottom: 24 },
    sectionTitle: {
        color: colors.primary,
        fontFamily: fonts.meriendaBold,
        fontSize: 13,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 10,
    },
    tagRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tag: {
        borderWidth: 1,
        borderColor: colors.secondary,
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 5,
    },
    tagText: {
        color: colors.secondary,
        fontFamily: fonts.meriendaRegular,
        fontSize: 13,
    },
});