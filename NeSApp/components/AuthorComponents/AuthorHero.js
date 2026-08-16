import { View, Text, Image, StyleSheet } from 'react-native';
import { Star, UserStar, BookOpen } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import { getMediaUrl } from '../../utils/mediaUrl';

export default function AuthorHero({ author }) {
    return (
        <View style={styles.hero}>
            <Image
                source={require('../../assets/images/logo.png')}
                style={styles.watermark}
                resizeMode="contain"
            />

            <View style={styles.avatarWrap}>
                {author.avatar_url ? (
                    <Image
                        source={{ uri: getMediaUrl(author.avatar_url) }}
                        style={styles.avatarImage}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarPlaceholderText}>
                            {author.display_name?.[0] ?? '?'}
                        </Text>
                    </View>
                )}
            </View>

            <View style={styles.heroInfo}>
                <Text style={styles.name}>{author.display_name}</Text>
                {author.pen_name ? (
                    <Text style={styles.penName}>
                        writing as {author.pen_name}
                    </Text>
                ) : null}

                <View style={styles.badgeRow}>
                    {author.is_founding_author && (
                        <View style={styles.foundingBadge}>
                            <UserStar color={colors.background} size={12} />
                            <Text style={styles.foundingBadgeText}>
                                FOUNDING AUTHOR
                            </Text>
                        </View>
                    )}

                    {author.is_featured && (
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
                            {author.book_count}{' '}
                            {author.book_count === 1 ? 'book' : 'books'}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    hero: {
        minHeight: 260,
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
    avatarWrap: {
        width: 140,
        height: 140,
        borderRadius: 70,
        overflow: 'hidden',
        marginLeft: 20,
        marginTop: 30,
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    avatarPlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: '#2a2c3e',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarPlaceholderText: {
        color: colors.primary,
        fontFamily: fonts.meriendaBold,
        fontSize: 40,
    },
    heroInfo: {
        flex: 1,
        padding: 16,
        paddingTop: 30,
        paddingLeft: 20,
        justifyContent: 'center',
        gap: 10,
    },
    name: {
        color: colors.white,
        fontFamily: fonts.fredericka,
        fontSize: 18,
        lineHeight: 24,
    },
    penName: {
        color: colors.secondary,
        fontFamily: fonts.meriendaRegular,
        fontSize: 12,
    },
    badgeRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    foundingBadge: {
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
        fontSize: 10,
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