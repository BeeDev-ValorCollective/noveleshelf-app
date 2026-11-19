
import { useCallback, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';

import { useFocusEffect, useRouter } from 'expo-router';
import { Bell, CheckCheck, Circle, ArrowLeft } from 'lucide-react-native';

import { colors } from '../../../constants/colors';
import { ENDPOINTS } from '../../../utils/api';
import useAuthStore from '../../../store/authStore';

export default function NotificationsScreen() {
    const router = useRouter();
    const accessToken = useAuthStore(state => state.accessToken);

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadNotifications = useCallback(async () => {
        if (!accessToken) return;

        setLoading(true);
        setError('');

        try {
            const response = await fetch(ENDPOINTS.notifications.list, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            const items = Array.isArray(data)
                ? data
                : data.results ?? data.notifications ?? [];

            setNotifications(items);
            setUnreadCount(
                data.unread_count ??
                items.filter(item => !item.is_read).length
            );
        } catch (err) {
            console.error('[NOTIFICATIONS] Load failed:', err);
            setError('Unable to load notifications.');
        } finally {
            setLoading(false);
        }
    }, [accessToken]);

    useFocusEffect(
        useCallback(() => {
            loadNotifications();
        }, [loadNotifications])
    );

    async function openNotification(item) {
        try {
            if (!item.is_read) {
                const response = await fetch(
                    ENDPOINTS.notifications.markRead,
                    {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            notification_id: item.id,
                        }),
                    }
                );

                if (!response.ok) {
                    throw new Error('Could not mark notification as read');
                }

                setNotifications(current =>
                    current.map(entry =>
                        entry.id === item.id
                            ? { ...entry, is_read: true }
                            : entry
                    )
                );

                setUnreadCount(current => Math.max(0, current - 1));
            }

            if (item.book_id != null) {
                router.push({
                    pathname: '/(protected)/(reader-tabs)/book/[id]',
                    params: {
                        id: String(item.book_id),
                    },
                });
            }
        } catch (err) {
            console.error('[NOTIFICATIONS] Open failed:', err);
            setError('Unable to open notification.');
        }
    }

    async function markAllRead() {
        try {
            const response = await fetch(
                ENDPOINTS.notifications.markAllRead,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (!response.ok) throw new Error('Request failed');

            setNotifications(current =>
                current.map(item => ({
                    ...item,
                    is_read: true,
                }))
            );

            setUnreadCount(0);
        } catch (err) {
            console.error('[NOTIFICATIONS] Mark all failed:', err);
            setError('Unable to mark all notifications as read.');
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.heading}>
                    <TouchableOpacity
                        onPress={() => {
                            if (router.canGoBack()) {
                                router.back();
                            } else {
                                router.replace('/(protected)/(reader-tabs)/dashboard');
                            }
                        }}
                        style={styles.backButton}
                        accessibilityLabel="Go back"
                    >
                        <ArrowLeft color={colors.white} size={26} />
                    </TouchableOpacity>

                    <Bell color={colors.primary} size={26} />
                    <Text style={styles.title}>Notifications</Text>
                </View>

                <Text style={styles.count}>
                    {unreadCount} unread
                </Text>
            </View>

            <TouchableOpacity
                style={styles.markAllButton}
                onPress={markAllRead}
                disabled={unreadCount === 0}
            >
                <CheckCheck
                    size={18}
                    color={
                        unreadCount > 0
                            ? colors.primary
                            : colors.altfaded
                    }
                />
                <Text style={styles.markAllText}>
                    Mark all as read
                </Text>
            </TouchableOpacity>

            {error ? (
                <Text style={styles.error}>{error}</Text>
            ) : null}

            {loading ? (
                <ActivityIndicator
                    color={colors.primary}
                    size="large"
                    style={{ marginTop: 40 }}
                />
            ) : (
                <ScrollView
                    contentContainerStyle={styles.list}
                    onRefresh={loadNotifications}
                    refreshing={loading}
                >
                    {notifications.length === 0 && (
                        <Text style={styles.empty}>
                            You don't have any notifications yet.
                        </Text>
                    )}

                    {notifications.map(item => (
                        <TouchableOpacity
                            key={item.id}
                            onPress={() => openNotification(item)}
                            style={[
                                styles.notification,
                                !item.is_read && styles.unread,
                            ]}
                        >
                            <View style={styles.notificationHeading}>
                                <Text style={styles.notificationTitle}>
                                    {item.title ||
                                        item.notification_type?.label ||
                                        'Notification'}
                                </Text>

                                {!item.is_read && (
                                    <Circle
                                        size={10}
                                        fill={colors.tertiary}
                                        color={colors.tertiary}
                                    />
                                )}
                            </View>

                            <Text style={styles.message}>
                                {item.message}
                            </Text>

                            <Text style={styles.date}>
                                {new Date(item.created_at).toLocaleString()}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: 50,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    heading: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    title: {
        color: colors.white,
        fontSize: 24,
        fontWeight: 'bold',
    },
    count: {
        color: colors.faded,
    },
    markAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        alignSelf: 'flex-end',
        marginBottom: 20,
    },
    markAllText: {
        color: colors.primary,
    },
    list: {
        paddingBottom: 40,
        gap: 12,
    },
    notification: {
        padding: 16,
        borderRadius: 12,
        backgroundColor: '#1a1d2e',
        borderWidth: 1,
        borderColor: '#ffffff18',
    },
    unread: {
        backgroundColor: '#163035',
        borderColor: colors.tertiary,
    },
    notificationHeading: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
        gap: 10,
    },
    notificationTitle: {
        color: colors.white,
        fontSize: 17,
        fontWeight: 'bold',
        flex: 1,
    },
    message: {
        color: colors.faded,
        fontSize: 14,
        lineHeight: 21,
    },
    date: {
        color: colors.altfaded,
        fontSize: 12,
        marginTop: 10,
    },
    empty: {
        color: colors.faded,
        textAlign: 'center',
        marginTop: 50,
    },
    error: {
        color: colors.secondary,
        marginBottom: 15,
    },
    backButton: {
        padding: 6,
        marginRight: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
