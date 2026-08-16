// app/(protected)/(reader-tabs)/author/[username].js
import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

import { colors } from '../../../../constants/colors';
import { fonts } from '../../../../constants/fonts';
import { ENDPOINTS } from '../../../../utils/api';

import AuthorHero from '../../../../components/AuthorComponents/AuthorHero';
import AuthorBookRow from '../../../../components/AuthorComponents/AuthorBookRow';

export default function AuthorDetail() {
    const { username } = useLocalSearchParams();
    const router = useRouter();
    const [author, setAuthor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAuthor();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.push('/(protected)/(reader-tabs)/library')}
            >
                <ArrowLeft color={colors.white} size={22} />
            </TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false}>
                <AuthorHero author={author} />

                <View style={styles.content}>
                    {author.bio ? (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>About</Text>
                            <Text style={styles.description}>{author.bio}</Text>
                        </View>
                    ) : null}

                    {author.books?.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Books</Text>
                            {author.books.map((book) => (
                                <AuthorBookRow
                                    key={book.id}
                                    book={book}
                                    onPress={() =>
                                        router.push(
                                            `/(protected)/(reader-tabs)/book/${book.id}`
                                        )
                                    }
                                />
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
});