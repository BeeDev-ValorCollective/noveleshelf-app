import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { X } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';

export default function InsufficientFundsModal({ visible, cost, onClose, onGetMore }) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <TouchableOpacity style={styles.modalCloseX} onPress={onClose}>
                        <X color={colors.white} size={20} />
                    </TouchableOpacity>

                    <Text style={styles.modalTitle}>Not Enough Funds</Text>

                    <Text style={styles.modalBody}>
                        You need {cost} to unlock this chapter, but you do not
                        have enough in your wallet right now.
                    </Text>

                    <TouchableOpacity
                        style={styles.modalConfirmButton}
                        onPress={onGetMore}
                    >
                        <Text style={styles.modalConfirmText}>
                            Get More Ink Drops
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalContent: {
        backgroundColor: '#1a1c2e',
        borderRadius: 16,
        padding: 24,
        width: '100%',
        maxWidth: 380,
    },
    modalCloseX: {
        position: 'absolute',
        top: 16,
        right: 16,
    },
    modalTitle: {
        color: colors.white,
        fontFamily: fonts.fredericka,
        fontSize: 18,
        marginBottom: 12,
    },
    modalBody: {
        color: colors.secondary,
        fontFamily: fonts.meriendaRegular,
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 14,
    },
    modalConfirmButton: {
        padding: 14,
        borderRadius: 10,
        backgroundColor: colors.primary,
        alignItems: 'center',
    },
    modalConfirmText: {
        color: colors.background,
        fontFamily: fonts.meriendaBold,
    },
});