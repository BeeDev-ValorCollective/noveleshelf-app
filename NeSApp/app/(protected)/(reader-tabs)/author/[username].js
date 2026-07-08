// app/(protected)/(reader-tabs)/author/[username].js
import { useState, useEffect } from 'react';
import {
    View, Text, Image, ScrollView, TouchableOpacity,
    StyleSheet, ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Star, UserStar, BookOpen } from 'lucide-react-native';
import { colors } from '../../../../constants/colors';
import { fonts } from '../../../../constants/fonts';
import { ENDPOINTS } from '../../../../utils/api';
import { getMediaUrl } from '../../../../utils/mediaUrl';

export default function AuthorDetail() {
    const { username } = useLocalSearchParams();
    const router = useRouter();
    const [author, setAuthor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAuthor();
    }, [username]);

    const fetchAuthor = async () => {
        setLoading(true);
        try {
            const response = await fetch(ENDPOINTS.books.authorDetail(username));
            const data = await response.json();
            setAuthor(data);
        } catch (err) {
            console.error('Author fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator color={colors.primary} size="large" />
            </View>
        );
    }

    if (!author) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.errorText}>Author not found.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => router.push('/(protected)/(reader-tabs)/library')}>
                <ArrowLeft color={colors.white} size={22} />
            </TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Hero Section */}
                <View style={styles.hero}>
                    <Image
                        source={require('../../../../assets/images/logo.png')}
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
                            <Text style={styles.penName}>writing as {author.pen_name}</Text>
                        ) : null}

                        {/* Badges */}
                        <View style={styles.badgeRow}>
                            {author.is_founding_author && (
                                <View style={styles.foundingBadge}>
                                    <UserStar color={colors.background} size={12} />
                                    <Text style={styles.foundingBadgeText}>FOUNDING AUTHOR</Text>
                                </View>
                            )}
                            {author.is_featured && (
                                <View style={styles.featuredBadge}>
                                    <Star color={colors.background} size={12} />
                                    <Text style={styles.featuredBadgeText}>FEATURED</Text>
                                </View>
                            )}
                        </View>

                        {/* Stats */}
                        <View style={styles.statsRow}>
                            <View style={styles.stat}>
                                <BookOpen color={colors.primary} size={16} />
                                <Text style={styles.statText}>
                                    {author.book_count} {author.book_count === 1 ? 'book' : 'books'}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Content */}
                <View style={styles.content}>

                    {/* Bio */}
                    {author.bio ? (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>About</Text>
                            <Text style={styles.description}>{author.bio}</Text>
                        </View>
                    ) : null}

                    {/* Books */}
                    {author.books?.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Books</Text>
                            {author.books.map((book) => (
                                <TouchableOpacity
                                    key={book.id}
                                    style={styles.bookRow}
                                    onPress={() => router.push(`/(protected)/(reader-tabs)/book/${book.id}`)}
                                >
                                    <Image
                                        source={{ uri: getMediaUrl(book.cover_image) }}
                                        style={styles.bookCover}
                                        resizeMode="cover"
                                    />
                                    <View style={styles.bookRowInfo}>
                                        <Text style={styles.bookRowTitle} numberOfLines={2}>{book.title}</Text>
                                        <View style={styles.bookRowMeta}>
                                            <View style={styles.ratingBadge}>
                                                <Text style={styles.ratingText}>{book.content_rating.code}</Text>
                                            </View>
                                            <Text style={styles.metaText}>{book.published_chapter_count} chapters</Text>
                                            {book.is_complete && <Text style={styles.completeBadge}>COMPLETE</Text>}
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    <View style={{ height: 40 }} />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: 60,
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: colors.secondary,
        fontFamily: fonts.meriendaRegular,
    },
    backButton: {
        position: 'absolute',
        top: 60,
        left: 16,
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: 20,
        padding: 8,
    },
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
    content: {
        padding: 20,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        color: colors.primary,
        fontFamily: fonts.meriendaBold,
        fontSize: 13,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 10,
    },
    description: {
        color: colors.white,
        fontFamily: fonts.meriendaRegular,
        fontSize: 14,
        lineHeight: 22,
    },
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