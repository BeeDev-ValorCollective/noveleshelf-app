// hooks/useShelf.js
import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { ENDPOINTS } from '../utils/api';
import useAuthStore from '../store/authStore';

export default function useShelf() {
    const accessToken = useAuthStore((state) => state.accessToken);
    const clearAuth = useAuthStore((state) => state.clearAuth);

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    const fetchShelf = async () => {
        setError(null);
        try {
            const response = await fetch(ENDPOINTS.reader.readerShelf, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (response.status === 401) {
                // Token expired mid-session -- ProtectedLayout redirects once auth clears
                await clearAuth();
                return;
            }

            const data = await response.json().catch(() => null);

            if (!response.ok || !Array.isArray(data)) {
                console.error('Shelf fetch failed:', { status: response.status, data });
                setError('Unable to load your shelf.');
                return;
            }

            setBooks(data);
        } catch (err) {
            console.error('Shelf fetch error:', err);
            setError('Unable to connect. Please try again.');
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
        error,
        handleRefresh,
    };
}