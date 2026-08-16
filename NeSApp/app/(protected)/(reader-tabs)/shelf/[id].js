import { useState, useEffect } from 'react';
import {
    View,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Text,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

import { colors } from '../../../../constants/colors';
import { fonts } from '../../../../constants/fonts';
import { ENDPOINTS } from '../../../../utils/api';
import useAuthStore from '../../../../store/authStore';

import BookHero from '../../../../components/ShelfComponents/BookHero';
import BookAbout from '../../../../components/ShelfComponents/BookAbout';
import TagSection from '../../../../components/ShelfComponents/TagSection';
import ContinueReadingButton from '../../../../components/ShelfComponents/ContinueReadingButton';
import ChapterList from '../../../../components/ShelfComponents/ChapterList';

export default function ShelfBookDetail() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const accessToken = useAuthStore((state) => state.accessToken);

    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id || !accessToken) {
            return;
        }
        fetchBook();
    }, [id, accessToken]);

    const fetchBook = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(ENDPOINTS.reader.bookDetail(id), {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                console.error('Shelf book detail request failed:', {
                    status: response.status,
                    data,
                });
                setBook(null);
                setError(
                    data?.detail ||
                        data?.error ||
                        `Unable to load book details (${response.status}).`
                );
                return;
            }

            setBook(data);
        } catch (err) {
            console.error('Book fetch error:', err);
            setBook(null);
            setError('Unable to connect to the server.');
        } finally {
            setLoading(false);
        }
    };

    const handleChapterPress = (chapter) => {
        router.push({
            pathname: '/(protected)/(reader-tabs)/reading',
            params: {
                bookId: String(book.id),
                chapterId: String(chapter.id),
            },
        });
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator color={colors.primary} size="large" />
            </View>
        );
    }

    if (error || !book) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.errorText}>
                    {error || 'Book not found.'}
                </Text>
            </View>
        );
    }

    const genres = Array.isArray(book.genres) ? book.genres : [];
    const relationshipTags = Array.isArray(book.relationship_tags)
        ? book.relationship_tags
        : [];
    const keywords = Array.isArray(book.keywords) ? book.keywords : [];
    const chapters = Array.isArray(book.chapters) ? book.chapters : [];

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() =>
                    router.push('/(protected)/(reader-tabs)/shelf')
                }
            >
                <ArrowLeft color={colors.white} size={22} />
            </TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false}>
                <BookHero book={book} chapterCount={chapters.length} />

                <View style={styles.content}>
                    <ContinueReadingButton
                        progress={book.progress}
                        onPress={() =>
                            router.push({
                                pathname:
                                    '/(protected)/(reader-tabs)/reading',
                                params: { bookId: String(id) },
                            })
                        }
                    />

                    <BookAbout description={book.description} />
                    <TagSection title="Genres" items={genres} />
                    <TagSection
                        title="Relationship"
                        items={relationshipTags}
                    />
                    <TagSection title="Tags" items={keywords} />

                    <ChapterList
                        chapters={chapters}
                        onChapterPress={handleChapterPress}
                    />

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
        paddingHorizontal: 24,
    },
    errorText: {
        color: colors.secondary,
        fontFamily: fonts.meriendaRegular,
        textAlign: 'center',
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
    content: {
        padding: 20,
    },
});