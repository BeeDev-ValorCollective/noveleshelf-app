import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';

export default function ToggleFilterRow({ label, value, onToggle }) {
    return (
        <TouchableOpacity style={styles.toggleRow} onPress={onToggle}>
            <Text style={styles.toggleLabel}>{label}</Text>
            <View style={[styles.toggleBox, value && styles.toggleBoxActive]}>
                {value && <Check color={colors.background} size={14} />}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    toggleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#2a2c3e',
    },
    toggleLabel: {
        color: colors.white,
        fontFamily: fonts.meriendaRegular,
        fontSize: 14,
    },
    toggleBox: {
        width: 22,
        height: 22,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: colors.secondary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    toggleBoxActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
});