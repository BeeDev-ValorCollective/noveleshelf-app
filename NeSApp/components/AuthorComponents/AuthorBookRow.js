import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import { getMediaUrl } from '../../utils/mediaUrl';

export default function AuthorBookRow({ book, onPress }) {
    return (
        <TouchableOpacity style={styles.bookRow} onPress={onPress}>
            <Image
                source={{ uri: getMediaUrl(book.cover_image) }}
                style={styles.bookCover}
                resizeMode="cover"
            />
            <View style={styles.bookRowInfo}>
                <Text style={styles.bookRowTitle} numberOfLines={2}>
                    {book.title}
                </Text>
                <View style={styles.bookRowMeta}>
                    <View style={styles.ratingBadge}>
                        <Text style={styles.ratingText}>
                            {book.content_rating.code}
                        </Text>
                    </View>
                    <Text style={styles.metaText}>
                        {book.published_chapter_count} chapters
                    </Text>
                    {book.is_complete && (
                        <Text style={styles.completeBadge}>COMPLETE</Text>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    bookRow: {
        flexDirection: 'row',
        backgroundColor: '#1a1c2e',
        borderRadius: 10,
        marginBottom: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#2a2c3e',
    },
    bookCover: {
        width: 70,
        height: 96,
    },
    bookRowInfo: {
        flex: 1,
        padding: 12,
        justifyContent: 'center',
        gap: 6,
    },
    bookRowTitle: {
        color: colors.white,
        fontFamily: fonts.fredericka,
        fontSize: 15,
    },
    bookRowMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap',
    },
    ratingBadge: {
        backgroundColor: '#2a2c3e',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    ratingText: {
        color: colors.primary,
        fontFamily: fonts.meriendaBold,
        fontSize: 11,
    },
    metaText: {
        color: colors.secondary,
        fontFamily: fonts.meriendaRegular,
        fontSize: 11,
    },
    completeBadge: {
        color: colors.background,
        backgroundColor: '#7ec8a0',
        fontFamily: fonts.meriendaBold,
        fontSize: 10,
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: 4,
    },
});