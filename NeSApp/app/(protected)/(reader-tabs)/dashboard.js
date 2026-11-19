
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Bell } from 'lucide-react-native';

import { colors } from '../../../constants/colors';
import { fonts } from '../../../constants/fonts';

import ProfileSection from '../../../components/DashboardComponents/ProfileSection';
import WalletSection from '../../../components/DashboardComponents/ReaderDashboardComponents/WalletSection';
import StreakSection from '../../../components/DashboardComponents/ReaderDashboardComponents/StreakSection';
import FollowingSection from '../../../components/DashboardComponents/ReaderDashboardComponents/FollowingSection';
import HeroComponent from '../../../components/HeroComponent';

export default function Dashboard() {
  const router = useRouter();

  const [loginBonusBadge, setLoginBonusBadge] = useState(null);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <HeroComponent title="Your Dashboard" />

      <TouchableOpacity
        style={styles.notificationButton}
        onPress={() =>
          router.push('/(protected)/(reader-tabs)/notifications')
        }
      >
        <Bell size={22} color={colors.primary} />
        <Text style={styles.notificationText}>
          Notifications
        </Text>
      </TouchableOpacity>

      <ProfileSection loginBonusBadge={loginBonusBadge} />
      <StreakSection onBonusBadgeChange={setLoginBonusBadge} />
      <FollowingSection />
      <WalletSection />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  notificationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    gap: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#1a1d2e',
    borderRadius: 10,
  },
  notificationText: {
    color: colors.white,
    fontSize: 16,
  },
});
