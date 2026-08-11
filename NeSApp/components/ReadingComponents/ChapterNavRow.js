import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';

export default function ChapterNavRow({ isFirst, isLast, onPrev, onNext }) {
    return (
        <View style={styles.navRow}>
            <TouchableOpacity
                style={[styles.navButton, isFirst && styles.navButtonDisabled]}
                onPress={onPrev}
                disabled={isFirst}
            >
                <ChevronLeft
                    color={isFirst ? colors.secondary : colors.white}
                    size={22}
                />
                <Text
                    style={[
                        styles.navButtonText,
                        isFirst && styles.navButtonTextDisabled,
                    ]}
                >
                    Previous
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.navButton, isLast && styles.navButtonDisabled]}
                onPress={onNext}
                disabled={isLast}
            >
                <Text
                    style={[
                        styles.navButtonText,
                        isLast && styles.navButtonTextDisabled,
                    ]}
                >
                    Next
                </Text>
                <ChevronRight
                    color={isLast ? colors.secondary : colors.white}
                    size={22}
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    navRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderTopWidth: 1,
        borderTopColor: colors.secondary,
    },
    navButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    navButtonDisabled: {
        opacity: 0.4,
    },
    navButtonText: {
        color: colors.white,
        fontFamily: fonts.meriendaBold,
        fontSize: 14,
    },
    navButtonTextDisabled: {
        color: colors.secondary,
    },
});