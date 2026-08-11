import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { SlidersHorizontal } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';

export default function FilterButton({ activeCount, onPress }) {
    return (
        <TouchableOpacity
            style={[styles.filterButton, activeCount > 0 && styles.filterButtonActive]}
            onPress={onPress}
        >
            <SlidersHorizontal
                color={activeCount > 0 ? colors.background : colors.primary}
                size={20}
            />
            {activeCount > 0 && (
                <Text style={styles.filterCount}>{activeCount}</Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    filterButton: {
        backgroundColor: '#1a1c2e',
        borderRadius: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: colors.secondary,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    filterButtonActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    filterCount: {
        color: colors.background,
        fontFamily: fonts.meriendaBold,
        fontSize: 12,
    },
});