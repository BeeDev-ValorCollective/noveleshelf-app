import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';

export default function EmptyShelfState({ onBrowseLibrary }) {
    return (
        <View style={styles.centerContainer}>
            <Text style={styles.emptyTitle}>Nothing to read yet</Text>

            <Text style={styles.emptyText}>
                Add a book to your shelf from the Library to get started.
            </Text>

            <TouchableOpacity style={styles.emptyButton} onPress={onBrowseLibrary}>
                <Text style={styles.emptyButtonText}>Browse Library</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    centerContainer: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    emptyTitle: {
        color: colors.white,
        fontFamily: fonts.fredericka,
        fontSize: 20,
        marginBottom: 10,
    },
    emptyText: {
        color: colors.secondary,
        fontFamily: fonts.meriendaRegular,
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 24,
    },
    emptyButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
    },
    emptyButtonText: {
        color: colors.background,
        fontFamily: fonts.meriendaBold,
        fontSize: 15,
    },
});