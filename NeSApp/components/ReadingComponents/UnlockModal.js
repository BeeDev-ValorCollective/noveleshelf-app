import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';

export default function UnlockModal({ visible, cost, askAutoUnlock, onCancel, onConfirm }) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Unlock this chapter?</Text>

                    <Text style={styles.modalBody}>
                        This chapter costs {cost} to unlock.
                    </Text>

                    {askAutoUnlock && (
                        <Text style={styles.modalBody}>
                            Want future chapters in this book to unlock
                            automatically whenever you have enough funds?
                        </Text>
                    )}

                    <View style={styles.modalActions}>
                        <TouchableOpacity
                            style={styles.modalCancelButton}
                            onPress={onCancel}
                        >
                            <Text style={styles.modalCancelText}>Cancel</Text>
                        </TouchableOpacity>

                        {askAutoUnlock ? (
                            <>
                                <TouchableOpacity
                                    style={styles.modalConfirmButton}
                                    onPress={() => onConfirm(false)}
                                >
                                    <Text style={styles.modalConfirmText}>
                                        Just This One
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.modalConfirmButton}
                                    onPress={() => onConfirm(true)}
                                >
                                    <Text style={styles.modalConfirmText}>
                                        Always Auto-Unlock
                                    </Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <TouchableOpacity
                                style={styles.modalConfirmButton}
                                onPress={() => onConfirm(false)}
                            >
                                <Text style={styles.modalConfirmText}>
                                    Unlock
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
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
    modalActions: {
        gap: 10,
        marginTop: 8,
    },
    modalCancelButton: {
        padding: 14,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.secondary,
        alignItems: 'center',
    },
    modalCancelText: {
        color: colors.secondary,
        fontFamily: fonts.meriendaBold,
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