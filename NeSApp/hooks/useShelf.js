// hooks/useShelf.js
import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { ENDPOINTS } from '../utils/api';
import useAuthStore from '../store/authStore';

export default function useShelf() {
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
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [accessToken])
    );

    const handleRefresh = () => {
        setRefreshing(true);
        fetchShelf();
    };

    return {
        books,
        loading,
        refreshing,
        handleRefresh,
    };
}