import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';

export default function ViewToggle({ view, onChange }) {
    return (
        <View style={styles.viewToggleRow}>
            <TouchableOpacity
                style={[
                    styles.viewToggleBtn,
                    view === 'books' && styles.viewToggleBtnActive,
                ]}
                onPress={() => onChange('books')}
            >
                <Text
                    style={[
                        styles.viewToggleText,
                        view === 'books' && styles.viewToggleTextActive,
                    ]}
                >
                    Books
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                    styles.viewToggleBtn,
                    view === 'authors' && styles.viewToggleBtnActive,
                ]}
                onPress={() => onChange('authors')}
            >
                <Text
                    style={[
                        styles.viewToggleText,
                        view === 'authors' && styles.viewToggleTextActive,
                    ]}
                >
                    Authors
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    viewToggleRow: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginBottom: 12,
        gap: 8,
    },
    viewToggleBtn: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.secondary,
        alignItems: 'center',
    },
    viewToggleBtnActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    viewToggleText: {
        color: colors.secondary,
        fontFamily: fonts.meriendaBold,
        fontSize: 13,
    },
    viewToggleTextActive: {
        color: colors.background,
    },
});