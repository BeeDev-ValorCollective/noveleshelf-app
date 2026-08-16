import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { BookOpen, Check } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';

export default function AddToShelfButton({ inShelf, adding, onPress }) {
    return (
        <TouchableOpacity
            style={[styles.libraryButton, inShelf && styles.libraryButtonSuccess]}
            onPress={onPress}
            disabled={adding || inShelf}
        >
            {adding ? (
                <ActivityIndicator color={colors.background} size="small" />
            ) : inShelf ? (
                <>
                    <Check color={colors.background} size={18} />
                    <Text style={styles.libraryButtonText}>In Your Shelf</Text>
                </>
            ) : (
                <>
                    <BookOpen color={colors.background} size={18} />
                    <Text style={styles.libraryButtonText}>Add to Shelf</Text>
                </>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    libraryButton: {
        backgroundColor: colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        gap: 10,
        marginTop: 8,
        marginBottom: 24,
    },
    libraryButtonSuccess: {
        backgroundColor: '#7ec8a0',
    },
    libraryButtonText: {
        color: colors.background,
        fontFamily: fonts.meriendaBold,
        fontSize: 16,
    },
});