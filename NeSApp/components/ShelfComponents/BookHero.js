import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { CheckCircle, Star } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import { getMediaUrl } from '../../utils/mediaUrl';

export default function BookHero({ book, chapterCount, isFollowingAuthor, isFollowLoading, onAuthorFollow, isOwnBook }) {
    return (
        <View style={styles.hero}>
            <Image
                source={{ uri: getMediaUrl(book.cover_image) }}
                style={styles.coverImage}
                resizeMode="cover"
            />

            <View style={styles.heroInfo}>
                <Text style={styles.title}>
                    {book.title ?? 'Untitled Book'}
                </Text>

                <View style={styles.authorRow}>
                    <Text style={styles.authorName}>
                        {book.author?.display_name ?? 'Unknown Author'}
                    </Text>

                    {!isOwnBook && (
                        <TouchableOpacity
                            style={[
                                styles.followButton,
                                isFollowingAuthor &&
                                styles.followButtonActive,
                            ]}
                            onPress={onAuthorFollow}
                            disabled={isFollowLoading}
                        >
                            {isFollowLoading ? (
                                <ActivityIndicator
                                    size="small"
                                    color={
                                        isFollowingAuthor
                                            ? colors.background
                                            : colors.primary
                                    }
                                />
                            ) : (
                                <Text
                                    style={[
                                        styles.followButtonText,
                                        isFollowingAuthor &&
                                        styles.followButtonTextActive,
                                    ]}
                                >
                                    {isFollowingAuthor
                                        ? 'Following'
                                        : 'Follow'}
                                </Text>
                            )}
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.badgeRow}>
                    <View style={styles.ratingBadge}>
                        <Text style={styles.ratingText}>
                            {book.content_rating?.code ?? 'NR'}
                        </Text>
                    </View>

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
                        <Text style={styles.statText}>
                            {book.published_chapter_count ?? chapterCount}{' '}
                            chapters
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
    followButton: {
        borderWidth: 1,
        borderColor: colors.primary,
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 4,
        minWidth: 72,
        alignItems: 'center',
        justifyContent: 'center',
    },

    followButtonActive: {
        backgroundColor: colors.primary,
    },

    followButtonText: {
        color: colors.primary,
        fontFamily: fonts.meriendaRegular,
        fontSize: 11,
    },

    followButtonTextActive: {
        color: colors.background,
    },
});