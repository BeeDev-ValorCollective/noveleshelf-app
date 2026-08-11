import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { BookOpen } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';

export default function ContinueReadingButton({ progress, onPress }) {
    const label = progress?.is_completed
        ? 'Read Again'
        : progress && parseFloat(progress.completion_percentage) > 0
        ? 'Continue Reading'
        : 'Read';

    return (
        <TouchableOpacity style={styles.continueButton} onPress={onPress}>
            <BookOpen color={colors.background} size={18} />
            <Text style={styles.continueButtonText}>{label}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    continueButton: {
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
    continueButtonText: {
        color: colors.background,
        fontFamily: fonts.meriendaBold,
        fontSize: 16,
    },
});