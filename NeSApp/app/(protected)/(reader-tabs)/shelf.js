// app/(protected)/(tabs)/library.js
import { useState, useEffect, useCallback } from 'react';
import {
    View, Text, FlatList, Image, TouchableOpacity,
    StyleSheet, ActivityIndicator, RefreshControl
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { BookOpen } from 'lucide-react-native';
import { colors } from '../../../constants/colors';
import { fonts } from '../../../constants/fonts';
import { ENDPOINTS } from '../../../utils/api';
import { getMediaUrl } from '../../../utils/mediaUrl';
import useAuthStore from '../../../store/authStore';

export default function Shelf() {
    const router = useRouter();
    const accessToken = useAuthStore((state) => state.accessToken);
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchShelf = async () => {
        try {
            const response = await fetch(ENDPOINTS.reader.readerShelf, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const data = await response.json();
            setBooks(data);
        } catch (err) {
            console.error('Shelf fetch error:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Refetch every time the tab comes into focus, so a book added
    // from detail shows up without needing a manual app restart
    useFocusEffect(
        useCallback(() => {
            if (accessToken) {
                fetchShelf();
            }
        }, [accessToken])
    );

    const handleRefresh = () => {
        setRefreshing(true);
        fetchShelf();
    };

    const handlePressBook = (bookId) => {
        router.push(`/(protected)/(reader-tabs)/shelf/${bookId}`);
    };

    const renderItem = ({ item }) => {
        const progress = parseFloat(item.completion_percentage) || 0;

        return (
            <TouchableOpacity
                style={styles.row}
                onPress={() => handlePressBook(item.book.id)}
            >
                <Image
                    source={{ uri: getMediaUrl(item.book.cover_image) }}
                    style={styles.cover}
                    resizeMode="cover"
                />
                <View style={styles.info}>
                    <Text style={styles.title} numberOfLines={2}>{item.book.title}</Text>
                    {item.book.author && (
                        <Text style={styles.author} numberOfLines={1}>
                            {item.book.author.pen_name || item.book.author.author_username}
                        </Text>
                    )}

                    <View style={styles.progressTrack}>
                        <View style={[styles.progressFill, { width: `${Math.min(progress, 100)}%` }]} />
                    </View>
                    <Text style={styles.progressText}>
                        {item.is_completed ? 'Completed' : `${progress.toFixed(0)}% read`}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator color={colors.primary} size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>My Shelf</Text>

            {books.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <BookOpen color={colors.secondary} size={48} />
                    <Text style={styles.emptyTitle}>Your shelf is empty</Text>
                    <Text style={styles.emptySubtitle}>
                        Browse the library to add your first book.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={books}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            tintColor={colors.primary}
                        />
                    }
                />
            )}
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
    header: {
        color: colors.white,
        fontFamily: fonts.fredericka,
        fontSize: 22,
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    list: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    row: {
        flexDirection: 'row',
        gap: 14,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#2a2c3e',
    },
    cover: {
        width: 70,
        height: 100,
        borderRadius: 6,
        backgroundColor: '#1a1c2e',
    },
    info: {
        flex: 1,
        justifyContent: 'center',
        gap: 4,
    },
    title: {
        color: colors.white,
        fontFamily: fonts.meriendaBold,
        fontSize: 15,
        lineHeight: 20,
    },
    author: {
        color: colors.secondary,
        fontFamily: fonts.meriendaRegular,
        fontSize: 12,
        marginBottom: 6,
    },
    progressTrack: {
        height: 5,
        backgroundColor: '#2a2c3e',
        borderRadius: 3,
        overflow: 'hidden',
        marginTop: 2,
    },
    progressFill: {
        height: '100%',
        backgroundColor: colors.primary,
        borderRadius: 3,
    },
    progressText: {
        color: colors.secondary,
        fontFamily: fonts.meriendaRegular,
        fontSize: 11,
        marginTop: 4,
    },
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