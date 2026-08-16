import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';

export default function FilterChipSection({
    title,
    items,
    selectedId,
    onToggle,
    labelKey = 'name',
}) {
    return (
        <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>{title}</Text>
            <View style={styles.filterChips}>
                {items?.map((item) => {
                    const isSelected = selectedId === item.id;
                    return (
                        <TouchableOpacity
                            key={item.id}
                            style={[
                                styles.filterChip,
                                isSelected && styles.filterChipActive,
                            ]}
                            onPress={() => onToggle(item.id)}
                        >
                            <Text
                                style={[
                                    styles.filterChipText,
                                    isSelected && styles.filterChipTextActive,
                                ]}
                            >
                                {item[labelKey]}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    filterSection: {
        marginBottom: 20,
    },
    filterSectionTitle: {
        color: colors.primary,
        fontFamily: fonts.meriendaBold,
        fontSize: 13,
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    filterChips: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    filterChip: {
        borderWidth: 1,
        borderColor: colors.secondary,
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    filterChipActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    filterChipText: {
        color: colors.secondary,
        fontFamily: fonts.meriendaRegular,
        fontSize: 13,
    },
    filterChipTextActive: {
        color: colors.background,
        fontFamily: fonts.meriendaBold,
    },
});