import { Modal, TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';

export default function OrderModal({ visible, onClose, options, selectedValue, onSelect }) {
    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.orderModalOverlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <View style={styles.orderModalContent}>
                    {options.map((opt) => {
                        const isSelected = selectedValue === opt.value;
                        return (
                            <TouchableOpacity
                                key={opt.value}
                                style={[
                                    styles.orderOption,
                                    isSelected && styles.orderOptionActive,
                                ]}
                                onPress={() => onSelect(opt.value)}
                            >
                                <Text
                                    style={[
                                        styles.orderOptionText,
                                        isSelected && styles.orderOptionTextActive,
                                    ]}
                                >
                                    {opt.label}
                                </Text>
                                {isSelected && (
                                    <Check color={colors.primary} size={16} />
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </TouchableOpacity>
        </Modal>
    );
}

const styles = StyleSheet.create({
    orderModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        paddingTop: 160,
        paddingRight: 16,
    },
    orderModalContent: {
        backgroundColor: '#1a1c2e',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#2a2c3e',
        paddingVertical: 6,
        minWidth: 160,
    },
    orderOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    orderOptionActive: {
        backgroundColor: '#2a2c3e',
    },
    orderOptionText: {
        color: colors.secondary,
        fontFamily: fonts.meriendaRegular,
        fontSize: 13,
    },
    orderOptionTextActive: {
        color: colors.white,
        fontFamily: fonts.meriendaBold,
    },
});