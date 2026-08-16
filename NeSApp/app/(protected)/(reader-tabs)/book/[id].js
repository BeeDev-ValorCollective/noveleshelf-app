// app/(protected)/(reader-tabs)/book/[id].js
import { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

import { colors } from '../../../../constants/colors';
import { fonts } from '../../../../constants/fonts';
import { ENDPOINTS } from '../../../../utils/api';
import useAuthStore from '../../../../store/authStore';

import BookDetailHero from '../../../../components/BookDetailComponents/BookDetailHero';
import AddToShelfButton from '../../../../components/BookDetailComponents/AddToShelfButton';
import BookAbout from '../../../../components/ShelfComponents/BookAbout';
import TagSection from '../../../../components/ShelfComponents/TagSection';
import ChapterList from '../../../../components/ShelfComponents/ChapterList';

export default function BookDetail() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const accessToken = useAuthStore((state) => state.accessToken);

    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [addingToShelf, setAddingToShelf] = useState(false);
    const [inShelf, setInShelf] = useState(false);

    useEffect(() => {
        fetchBook();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchBook = async () => {
        try {
            const response = await fetch(ENDPOINTS.reader.bookDetail(id), {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const data = await response.json();
            setBook(data);
            setInShelf(!!data.in_shelf);
        } catch (err) {
            console.error('Book fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToShelf = async () => {
        if (!accessToken) {
            router.push('/(auth)/login');
            return;
        }

        setAddingToShelf(true);
        try {
            const response = await fetch(ENDPOINTS.reader.addBook, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ book_id: id }),
            });

            if (response.ok) {
                // 201 = newly added, 200 = already in shelf — both are success
                setInShelf(true);
            } else {
                const errData = await response.json().catch(() => ({}));
                console.error('Add to shelf error:', errData);
            }
        } catch (err) {
            console.error('Add to shelf request failed:', err);
        } finally {
            setAddingToShelf(false);
        }
    };

    const handleChapterPress = (chapter) => {
        if (!accessToken || !inShelf) {
            return;
        }

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

    if (!book) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.errorText}>Book not found.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.push('/(protected)/(reader-tabs)/library')}
            >
                <ArrowLeft color={colors.white} size={22} />
            </TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false}>
                <BookDetailHero book={book} />

                <View style={styles.content}>
                    <AddToShelfButton
                        inShelf={inShelf}
                        adding={addingToShelf}
                        onPress={handleAddToShelf}
                    />

                    <BookAbout description={book.description} />

                    {book.genres.length > 0 && (
                        <TagSection title="Genres" items={book.genres} />
                    )}

                    {book.relationship_tags.length > 0 && (
                        <TagSection
                            title="Relationship"
                            items={book.relationship_tags}
                        />
                    )}

                    {book.keywords.length > 0 && (
                        <TagSection title="Tags" items={book.keywords} />
                    )}

                    <ChapterList
                        chapters={book.chapters}
                        onChapterPress={handleChapterPress}
                        disabled={!accessToken || !inShelf}
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
    content: {
        padding: 20,
    },
});