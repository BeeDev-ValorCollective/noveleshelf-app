// app/(protected)/(tabs)/shelf.js
import { View, FlatList, ActivityIndicator, RefreshControl, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../../constants/colors';
import HeroComponent from '../../../components/HeroComponent';
import useShelf from '../../../hooks/useShelf';

import ShelfBookRow from '../../../components/ShelfComponents/ShelfBookRow';
import EmptyShelf from '../../../components/ShelfComponents/EmptyShelf';

export default function Shelf() {
    const router = useRouter();
    const { books, loading, refreshing, handleRefresh } = useShelf();

    const handlePressBook = (bookId) => {
        router.push(`/(protected)/(reader-tabs)/shelf/${bookId}`);
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
            <HeroComponent title="Your Shelf" />

            {books.length === 0 ? (
                <EmptyShelf />
            ) : (
                <FlatList
                    data={books}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) => (
                        <ShelfBookRow
                            item={item}
                            onPress={() => handlePressBook(item.book.id)}
                        />
                    )}
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
    list: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
});