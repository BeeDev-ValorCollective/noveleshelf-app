import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import { getMediaUrl } from '../../utils/mediaUrl';

export default function BookCard({ item, onPress }) {
    return (
        <TouchableOpacity style={styles.bookCard} onPress={onPress}>
            <Image
                source={{ uri: getMediaUrl(item.cover_image) }}
                style={styles.coverImage}
                resizeMode="cover"
            />
            <View style={styles.bookInfo}>
                <Text style={styles.bookTitle} numberOfLines={2}>
                    {item.title}
                </Text>
                <Text style={styles.bookAuthor}>
                    by {item.author.display_name}
                </Text>

                <View style={styles.bookMeta}>
                    <View style={styles.ratingBadge}>
                        <Text style={styles.ratingText}>
                            {item.content_rating.code}
                        </Text>
                    </View>
                    <Text style={styles.metaText}>
                        {item.published_chapter_count} chapters
                    </Text>
                    {item.is_new && <Text style={styles.newBadge}>NEW</Text>}
                    {item.is_complete && (
                        <Text style={styles.completeBadge}>COMPLETE</Text>
                    )}
                </View>

                {item.genres.length > 0 && (
                    <Text style={styles.genres} numberOfLines={1}>
                        {item.genres.map((g) => g.name).join(' · ')}
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    bookCard: {
        flexDirection: 'row',
        backgroundColor: '#1a1c2e',
        borderRadius: 10,
        marginBottom: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#2a2c3e',
    },
    coverImage: {
        width: 80,
        height: 110,
    },
    bookInfo: {
        flex: 1,
        padding: 12,
        justifyContent: 'center',
        gap: 4,
    },
    bookTitle: {
        color: colors.white,
        fontFamily: fonts.fredericka,
        fontSize: 15,
    },
    bookAuthor: {
        color: colors.secondary,
        fontFamily: fonts.meriendaRegular,
        fontSize: 12,
    },
    bookMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 4,
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
    newBadge: {
        color: colors.background,
        backgroundColor: colors.primary,
        fontFamily: fonts.meriendaBold,
        fontSize: 10,
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: 4,
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
    genres: {
        color: colors.secondary,
        fontFamily: fonts.meriendaRegular,
        fontSize: 11,
        marginTop: 2,
    },
});