import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';

export default function OrderButton({ label, onPress }) {
    return (
        <TouchableOpacity style={styles.orderButton} onPress={onPress}>
            <Text style={styles.orderButtonText} numberOfLines={1}>
                {label}
            </Text>
            <ChevronDown color={colors.primary} size={16} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    orderButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1a1c2e',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: colors.secondary,
        gap: 4,
        maxWidth: 110,
    },
    orderButtonText: {
        color: colors.white,
        fontFamily: fonts.meriendaRegular,
        fontSize: 12,
        flexShrink: 1,
    },
});