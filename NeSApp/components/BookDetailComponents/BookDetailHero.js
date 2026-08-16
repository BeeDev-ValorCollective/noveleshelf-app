import { View, Text, Image, StyleSheet } from 'react-native';
import { CheckCircle, Star, UserStar, BookOpen } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import { getMediaUrl } from '../../utils/mediaUrl';

export default function BookDetailHero({ book }) {
    return (
        <View style={styles.hero}>
            <Image
                source={require('../../assets/images/logo.png')}
                style={styles.watermark}
                resizeMode="contain"
            />
            <Image
                source={{ uri: getMediaUrl(book.cover_image) }}
                style={styles.coverImage}
                resizeMode="cover"
            />

            <View style={styles.heroInfo}>
                <Text style={styles.title}>{book.title}</Text>

                <View style={styles.authorRow}>
                    <Text style={styles.authorName}>
                        {book.author.display_name}
                    </Text>
                </View>

                {book.is_founding_eligible && (
                    <View style={styles.foundingBadge}>
                        <UserStar color={colors.background} size={13} />
                        <Text style={styles.foundingBadgeText}>
                            Founding Author Book
                        </Text>
                    </View>
                )}

                <View style={styles.badgeRow}>
                    <View style={styles.ratingBadge}>
                        <Text style={styles.ratingText}>
                            {book.content_rating.code}
                        </Text>
                    </View>

                    {book.is_new && (
                        <View style={styles.newBadge}>
                            <Text style={styles.badgeText}>NEW</Text>
                        </View>
                    )}

                    {book.is_complete && (
                        <View style={styles.completeBadge}>
                            <CheckCircle color={colors.background} size={12} />
                            <Text style={styles.completeBadgeText}>
                                COMPLETE
                            </Text>
                        </View>
                    )}

                    {book.is_featured && (
                        <View style={styles.featuredBadge}>
                            <Star color={colors.background} size={12} />
                            <Text style={styles.featuredBadgeText}>
                                FEATURED
                            </Text>
                        </View>
                    )}
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.stat}>
                        <BookOpen color={colors.primary} size={16} />
                        <Text style={styles.statText}>
                            {book.published_chapter_count} chapters
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    hero: {
        height: 320,
        flexDirection: 'row',
        backgroundColor: '#1a1c2e',
        overflow: 'hidden',
        paddingTop: 50,
    },
    watermark: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0.04,
    },
    coverImage: {
        width: 180,
        height: 280,
        paddingLeft: 10,
    },
    heroInfo: {
        flex: 1,
        padding: 16,
        paddingTop: 30,
        paddingLeft: 50,
        justifyContent: 'center',
        gap: 10,
    },
    title: {
        color: colors.white,
        fontFamily: fonts.fredericka,
        fontSize: 18,
        lineHeight: 24,
    },
    authorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    authorName: {
        color: colors.secondary,
        fontFamily: fonts.meriendaRegular,
        fontSize: 13,
    },
    foundingBadge: {
        alignSelf: 'flex-start',
        backgroundColor: '#ffd900',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    foundingBadgeText: {
        color: colors.background,
        fontFamily: fonts.meriendaBold,
        fontSize: 11,
    },
    badgeRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    ratingBadge: {
        backgroundColor: '#2a2c3e',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
    },
    ratingText: {
        color: colors.primary,
        fontFamily: fonts.meriendaBold,
        fontSize: 11,
    },
    newBadge: {
        backgroundColor: colors.primary,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
    },
    badgeText: {
        color: colors.background,
        fontFamily: fonts.meriendaBold,
        fontSize: 11,
    },
    completeBadge: {
        backgroundColor: '#7ec8a0',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    completeBadgeText: {
        color: colors.background,
        fontFamily: fonts.meriendaBold,
        fontSize: 11,
    },
    featuredBadge: {
        backgroundColor: '#f0c040',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    featuredBadgeText: {
        color: colors.background,
        fontFamily: fonts.meriendaBold,
        fontSize: 11,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 16,
    },
    stat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statText: {
        color: colors.secondary,
        fontFamily: fonts.meriendaRegular,
        fontSize: 12,
    },
});