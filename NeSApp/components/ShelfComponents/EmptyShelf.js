import { View, Text, StyleSheet } from 'react-native';
import { BookOpen } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';

export default function EmptyShelf() {
    return (
        <View style={styles.emptyContainer}>
            <BookOpen color={colors.secondary} size={48} />
            <Text style={styles.emptyTitle}>Your shelf is empty</Text>
            <Text style={styles.emptySubtitle}>
                Browse the library to add your first book.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        gap: 8,
    },
    emptyTitle: {
        color: colors.white,
        fontFamily: fonts.meriendaBold,
        fontSize: 16,
        marginTop: 8,
    },
    emptySubtitle: {
        color: colors.secondary,
        fontFamily: fonts.meriendaRegular,
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 18,
    },
});