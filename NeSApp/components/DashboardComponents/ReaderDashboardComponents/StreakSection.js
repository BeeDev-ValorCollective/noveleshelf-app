import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Flame, BookOpen } from 'lucide-react-native';
import { useFocusEffect } from 'expo-router';

import useAuthStore from '../../../store/authStore';
import { ENDPOINTS } from '../../../utils/api';
import { colors } from '../../../constants/colors';
import { fonts } from '../../../constants/fonts';

const LOGIN_BONUS_BADGES = {
  91: {
    title: '91-Day Bonus',
    reward: 25,
  },
  182: {
    title: '182-Day Bonus',
    reward: 50,
  },
  273: {
    title: '273-Day Bonus',
    reward: 75,
  },
  365: {
    title: 'Yearly Login Bonus',
    reward: 100,
  },
};

const getLoginPatternDay = (streakDay) => {
  if (!streakDay || streakDay < 1) {
    return null;
  }

  return ((streakDay - 1) % 365) + 1;
};

export default function StreakSection({ onBonusBadgeChange }) {
  const accessToken = useAuthStore((state) => state.accessToken);

  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(ENDPOINTS.reader.stats, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        console.error('Reader stats request failed:', {
          status: response.status,
          data,
        });

        setError(
          data?.detail ||
          data?.error ||
          'Unable to load your streaks.'
        );

        return;
      }

      setStats(data);

      // ─── Login Bonus Badge ─────────────────────
      const loginStreak = data?.login_streak ?? 0;

      const patternDay =
        getLoginPatternDay(loginStreak);

      const badge =
        LOGIN_BONUS_BADGES[patternDay] ?? null;

      onBonusBadgeChange?.(badge);
      // ─── End Login Bonus Badge ─────────────────

    } catch (err) {
      console.error('Failed to load reader stats:', err);
      setError('Unable to connect to the server.');
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, onBonusBadgeChange]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  /*
   * Refresh the streak values whenever the reader returns
   * to the dashboard.
   */
  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [fetchStats])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeader}>Your Streaks</Text>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="small"
            color={colors.primary}
          />
        </View>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <View style={styles.streakRow}>
          <View style={styles.streakItem}>
            <View style={styles.iconContainer}>
              <Flame
                size={30}
                color={colors.primary}
              />
            </View>

            <Text style={styles.streakValue}>
              {stats?.login_streak ?? 0}
            </Text>

            <Text style={styles.streakLabel}>
              Login Streak
            </Text>

            <Text style={styles.streakUnit}>
              {(stats?.login_streak ?? 0) === 1
                ? 'day'
                : 'days'}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.streakItem}>
            <View style={styles.iconContainer}>
              <BookOpen
                size={30}
                color={colors.tertiary}
              />
            </View>

            <Text style={styles.streakValue}>
              {stats?.reading_streak ?? 0}
            </Text>

            <Text style={styles.streakLabel}>
              Reading Streak
            </Text>

            <Text style={styles.streakUnit}>
              {(stats?.reading_streak ?? 0) === 1
                ? 'day'
                : 'days'}
            </Text>
          </View>
        </View>
      )}
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

  loadingContainer: {
    minHeight: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },

  errorText: {
    color: colors.secondary,
    fontFamily: fonts.meriendaRegular,
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 20,
  },

  streakRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 12,
  },

  streakItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },

  iconContainer: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },

  streakValue: {
    color: colors.white,
    fontFamily: fonts.fredericka,
    fontSize: 34,
    lineHeight: 40,
  },

  streakLabel: {
    color: colors.secondary,
    fontFamily: fonts.meriendaBold,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 2,
  },

  streakUnit: {
    color: colors.altfaded,
    fontFamily: fonts.meriendaRegular,
    fontSize: 12,
    marginTop: 2,
  },

  divider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 4,
  },
});