// app/(protected)/(reader-tabs)/book/[id].js
import { useState, useEffect } from 'react';
import {
    View, Text, Image, ScrollView, TouchableOpacity,
    StyleSheet, ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, BookOpen, CheckCircle, Star, Users } from 'lucide-react-native';
import { colors } from '../../../../constants/colors';
import { fonts } from '../../../../constants/fonts';
import { ENDPOINTS } from '../../../../utils/api';
import { getMediaUrl } from '../../../../utils/mediaUrl';

export default function BookDetail() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBook();
    }, [id]);

    const fetchBook = async () => {
        try {
            const response = await fetch(ENDPOINTS.books.single(id));
            const data = await response.json();
            setBook(data);
        } catch (err) {
            console.error('Book fetch error:', err);
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

    if (!book) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.errorText}>Book not found.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => router.push('/(protected)/(reader-tabs)/search')}>
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
                    <Image
                        source={{ uri: getMediaUrl(book.cover_image) }}
                        style={styles.coverImage}
                        resizeMode="cover"
                    />
                    <View style={styles.heroInfo}>
                        <Text style={styles.title}>{book.title}</Text>

                        {/* Author */}
                        <View style={styles.authorRow}>
                            <Text style={styles.authorName}>{book.author.display_name}</Text>
                        </View>

                        {/* Badges */}
                        <View style={styles.badgeRow}>
                            <View style={styles.ratingBadge}>
                                <Text style={styles.ratingText}>{book.content_rating.code}</Text>
                            </View>
                            {book.is_new && (
                                <View style={styles.newBadge}>
                                    <Text style={styles.badgeText}>NEW</Text>
                                </View>
                            )}
                            {book.is_complete && (
                                <View style={styles.completeBadge}>
                                    <CheckCircle color={colors.background} size={12} />
                                    <Text style={styles.completeBadgeText}>COMPLETE</Text>
                                </View>
                            )}
                            {book.is_featured && (
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
                                <Text style={styles.statText}>{book.published_chapter_count} chapters</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Content */}
                <View style={styles.content}>

                    {/* Description */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>About</Text>
                        <Text style={styles.description}>{book.description}</Text>
                    </View>

                    {/* Genres */}
                    {book.genres.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Genres</Text>
                            <View style={styles.tagRow}>
                                {book.genres.map((g) => (
                                    <View key={g.id} style={styles.tag}>
                                        <Text style={styles.tagText}>{g.name}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Relationship Tags */}
                    {book.relationship_tags.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Relationship</Text>
                            <View style={styles.tagRow}>
                                {book.relationship_tags.map((t) => (
                                    <View key={t.id} style={styles.tag}>
                                        <Text style={styles.tagText}>{t.name}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Keywords */}
                    {book.keywords.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Tags</Text>
                            <View style={styles.tagRow}>
                                {book.keywords.map((k) => (
                                    <View key={k.id} style={styles.tag}>
                                        <Text style={styles.tagText}>{k.name}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Chapters */}
                    {book.chapters.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Chapters</Text>
                            {book.chapters.map((chapter) => (
                                <TouchableOpacity key={chapter.id} style={styles.chapterRow}>
                                    <Text style={styles.chapterNumber}>Ch. {chapter.chapter_number}</Text>
                                    <Text style={styles.chapterTitle} numberOfLines={1}>{chapter.title}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {/* Add to Library Button */}
                    <TouchableOpacity style={styles.libraryButton} disabled>
                        <BookOpen color={colors.background} size={18} />
                        <Text style={styles.libraryButtonText}>Add to Library</Text>
                    </TouchableOpacity>

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
    tagRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tag: {
        borderWidth: 1,
        borderColor: colors.secondary,
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 5,
    },
    tagText: {
        color: colors.secondary,
        fontFamily: fonts.meriendaRegular,
        fontSize: 13,
    },
    chapterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#2a2c3e',
        gap: 12,
    },
    chapterNumber: {
        color: colors.primary,
        fontFamily: fonts.meriendaBold,
        fontSize: 12,
        width: 40,
    },
    chapterTitle: {
        flex: 1,
        color: colors.white,
        fontFamily: fonts.meriendaRegular,
        fontSize: 14,
    },
    libraryButton: {
        backgroundColor: colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        gap: 10,
        marginTop: 8,
        opacity: 0.5,
    },
    libraryButtonText: {
        color: colors.background,
        fontFamily: fonts.meriendaBold,
        fontSize: 16,
    },
});