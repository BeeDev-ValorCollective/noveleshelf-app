import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';

import { Users } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import useAuthStore from '../../../store/authStore';
import { ENDPOINTS } from '../../../utils/api';
import { colors } from '../../../constants/colors';
import { fonts } from '../../../constants/fonts';

export default function FollowerSection({
    profileType,
}) {
    const accessToken = useAuthStore(
        (state) => state.accessToken
    );

    const [followerCount, setFollowerCount] =
        useState(0);

    const [loading, setLoading] =
        useState(true);

    const fetchFollowerCount = async () => {
        if (!accessToken || !profileType) {
            setFollowerCount(0);
            setLoading(false);
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                ENDPOINTS.author.stats(profileType),
                {
                    headers: {
                        Authorization:
                            `Bearer ${accessToken}`,
                    },
                }
            );

            const data = await response
                .json()
                .catch(() => ({}));

            console.log(
                'Follower stats response:',
                response.status,
                profileType,
                data
            );

            if (!response.ok) {
                console.error(
                    'Unable to load author follower count:',
                    data
                );

                setFollowerCount(0);
                return;
            }

            setFollowerCount(
                Number(data.follower_count ?? 0)
            );
        } catch (error) {
            console.error(
                'Follower count request failed:',
                error
            );

            setFollowerCount(0);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchFollowerCount();
        }, [accessToken, profileType])
    );

    return (
        <View style={styles.container}>
            <Text style={styles.sectionHeader}>
                Your Audience
            </Text>

            <View style={styles.card}>
                <View style={styles.iconContainer}>
                    <Users
                        size={34}
                        color={colors.primary}
                    />
                </View>

                {loading ? (
                    <ActivityIndicator
                        size="large"
                        color={colors.primary}
                    />
                ) : (
                    <>
                        <Text style={styles.count}>
                            {followerCount}
                        </Text>

                        <Text style={styles.label}>
                            {followerCount === 1
                                ? 'Follower'
                                : 'Followers'}
                        </Text>
                    </>
                )}

                <Text style={styles.description}>
                    Readers currently following your
                    author profile.
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingVertical: 16,
    },

    sectionHeader: {
        color: colors.headerText,
        fontFamily: fonts.fredericka,
        fontSize: 26,
        marginBottom: 16,
    },

    card: {
        width: '100%',
        alignItems: 'center',

        backgroundColor:
            'rgba(255, 255, 255, 0.04)',

        borderWidth: 1,
        borderColor:
            'rgba(255, 255, 255, 0.08)',

        borderRadius: 16,

        paddingVertical: 24,
        paddingHorizontal: 20,
    },

    iconContainer: {
        width: 58,
        height: 58,

        borderRadius: 29,

        alignItems: 'center',
        justifyContent: 'center',

        backgroundColor:
            'rgba(255, 255, 255, 0.05)',

        marginBottom: 10,
    },

    count: {
        color: colors.primary,
        fontFamily: fonts.fredericka,
        fontSize: 42,
    },

    label: {
        color: colors.secondary,
        fontFamily: fonts.meriendaBold,
        fontSize: 16,
        marginTop: -2,
    },

    description: {
        color: colors.altfaded,
        fontFamily: fonts.meriendaRegular,
        fontSize: 12,
        textAlign: 'center',
        lineHeight: 18,
        marginTop: 8,
    },
});