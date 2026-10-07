import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

import useAuthStore from '../../../store/authStore';
import { ENDPOINTS, getMediaUrl } from '../../../utils/api';
import { colors } from '../../../constants/colors';
import { fonts } from '../../../constants/fonts';

export default function FollowingScreen() {
    const router = useRouter();

    const accessToken = useAuthStore(
        (state) => state.accessToken
    );

    const [following, setFollowing] = useState([]);
    const [loading, setLoading] = useState(true);
    const [unfollowingId, setUnfollowingId] = useState(null);

    const fetchFollowing = async () => {
        if (!accessToken) {
            setFollowing([]);
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(
                ENDPOINTS.follow.list,
                {
                    headers: {
                        Authorization:
                            `Bearer ${accessToken}`,
                    },
                }
            );

            const data = await response
                .json()
                .catch(() => []);

            if (!response.ok) {
                console.error(
                    'Unable to load followed authors:',
                    data
                );

                setFollowing([]);
                return;
            }

            setFollowing(
                Array.isArray(data) ? data : []
            );
        } catch (error) {
            console.error(
                'Following request failed:',
                error
            );

            setFollowing([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFollowing();
    }, [accessToken]);

    const handleAuthorPress = (author) => {
        if (!author.author_username) {
            return;
        }

        router.push(
            `/(protected)/(reader-tabs)/author/${author.author_username}`
        );
    };

    const unfollowAuthor = async (author) => {
        if (
            !accessToken ||
            !author?.follow_id ||
            unfollowingId
        ) {
            return;
        }

        setUnfollowingId(author.follow_id);

        try {
            const response = await fetch(
                ENDPOINTS.follow.unfollow(
                    author.follow_id
                ),
                {
                    method: 'DELETE',
                    headers: {
                        Authorization:
                            `Bearer ${accessToken}`,
                    },
                }
            );

            if (!response.ok) {
                const data = await response
                    .json()
                    .catch(() => ({}));

                console.error(
                    'Unable to unfollow author:',
                    data
                );

                Alert.alert(
                    'Unable to Unfollow',
                    'Something went wrong while unfollowing this author.'
                );

                return;
            }

            setFollowing((current) =>
                current.filter(
                    (item) =>
                        item.follow_id !==
                        author.follow_id
                )
            );
        } catch (error) {
            console.error(
                'Unfollow request failed:',
                error
            );

            Alert.alert(
                'Unable to Unfollow',
                'Something went wrong while unfollowing this author.'
            );
        } finally {
            setUnfollowingId(null);
        }
    };

    const renderAuthor = ({ item }) => {
        const displayName =
            item.pen_name ||
            item.author_username ||
            'Unknown Author';

        const avatarSource = item.avatar_url
            ? {
                uri: getMediaUrl(item.avatar_url),
            }
            : null;

        const isUnfollowing =
            unfollowingId === item.follow_id;

        return (
            <View style={styles.authorCard}>
                <TouchableOpacity
                    style={styles.authorMain}
                    activeOpacity={0.85}
                    onPress={() =>
                        handleAuthorPress(item)
                    }
                >
                    {avatarSource ? (
                        <Image
                            source={avatarSource}
                            style={styles.avatar}
                        />
                    ) : (
                        <View
                            style={[
                                styles.avatar,
                                styles.avatarFallback,
                            ]}
                        >
                            <Text
                                style={
                                    styles.avatarFallbackText
                                }
                            >
                                {displayName
                                    .charAt(0)
                                    .toUpperCase()}
                            </Text>
                        </View>
                    )}

                    <View style={styles.authorInfo}>
                        <Text
                            style={styles.authorName}
                            numberOfLines={1}
                        >
                            {displayName}
                        </Text>

                        {item.author_username && (
                            <Text
                                style={styles.username}
                                numberOfLines={1}
                            >
                                @{item.author_username}
                            </Text>
                        )}

                        {item.bio ? (
                            <Text
                                style={styles.bio}
                                numberOfLines={2}
                            >
                                {item.bio}
                            </Text>
                        ) : null}
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.unfollowButton}
                    onPress={() =>
                        unfollowAuthor(item)
                    }
                    disabled={isUnfollowing}
                >
                    {isUnfollowing ? (
                        <ActivityIndicator
                            size="small"
                            color={colors.primary}
                        />
                    ) : (
                        <Text
                            style={
                                styles.unfollowButtonText
                            }
                        >
                            Unfollow
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator
                    size="large"
                    color={colors.primary}
                />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    Following
                </Text>

                <Text style={styles.subtitle}>
                    Authors you follow
                </Text>
            </View>

            <FlatList
                data={following}
                keyExtractor={(item) =>
                    String(item.follow_id)
                }
                renderItem={renderAuthor}
                contentContainerStyle={
                    following.length === 0
                        ? styles.emptyList
                        : styles.list
                }
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text
                            style={styles.emptyTitle}
                        >
                            No followed authors yet
                        </Text>

                        <Text
                            style={styles.emptyText}
                        >
                            Follow authors from their
                            books and they will appear
                            here.
                        </Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    centered: {
        flex: 1,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
    },

    header: {
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 16,
    },

    title: {
        color: colors.primary,
        fontFamily: fonts.fredericka,
        fontSize: 32,
    },

    subtitle: {
        color: colors.secondary,
        fontFamily: fonts.meriendaRegular,
        fontSize: 13,
        marginTop: 4,
    },

    list: {
        paddingHorizontal: 16,
        paddingBottom: 30,
        gap: 12,
    },

    authorCard: {
        backgroundColor:
            'rgba(255, 255, 255, 0.04)',
        borderWidth: 1,
        borderColor:
            'rgba(255, 255, 255, 0.08)',
        borderRadius: 16,
        padding: 14,
        gap: 12,
    },

    authorMain: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },

    avatar: {
        width: 58,
        height: 58,
        borderRadius: 29,
    },

    avatarFallback: {
        backgroundColor:
            'rgba(255, 255, 255, 0.08)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    avatarFallbackText: {
        color: colors.primary,
        fontFamily: fonts.fredericka,
        fontSize: 24,
    },

    authorInfo: {
        flex: 1,
    },

    authorName: {
        color: colors.primary,
        fontFamily: fonts.meriendaBold,
        fontSize: 16,
    },

    username: {
        color: colors.primary,
        fontFamily: fonts.meriendaRegular,
        fontSize: 12,
        marginTop: 2,
    },

    bio: {
        color: colors.secondary,
        fontFamily: fonts.meriendaRegular,
        fontSize: 12,
        lineHeight: 18,
        marginTop: 6,
    },

    unfollowButton: {
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: colors.primary,
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 6,
        minWidth: 90,
        alignItems: 'center',
    },

    unfollowButtonText: {
        color: colors.primary,
        fontFamily: fonts.meriendaRegular,
        fontSize: 12,
    },

    emptyList: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },

    emptyState: {
        alignItems: 'center',
    },

    emptyTitle: {
        color: colors.primary,
        fontFamily: fonts.meriendaBold,
        fontSize: 18,
    },

    emptyText: {
        color: colors.secondary,
        fontFamily: fonts.meriendaRegular,
        textAlign: 'center',
        fontSize: 13,
        lineHeight: 20,
        marginTop: 8,
    },
});