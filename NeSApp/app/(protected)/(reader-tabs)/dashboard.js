// app/dashboard.js
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../../../constants/colors';
import { fonts } from '../../../constants/fonts';
import ProfileSection from '../../../components/DashboardComponents/ProfileSection';
import WalletSection from '../../../components/DashboardComponents/ReaderDashboardComponents/WalletSection'
import StreakSection from '../../../components/DashboardComponents/ReaderDashboardComponents/StreakSection';
import HeroComponent from '../../../components/HeroComponent';
import { useState } from 'react';

export default function Dashboard() {

  const [loginBonusBadge, setLoginBonusBadge] = useState(null);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <HeroComponent title="Your Dashboard" />
      <ProfileSection loginBonusBadge={loginBonusBadge}/>
      <StreakSection onBonusBadgeChange={setLoginBonusBadge}/>
      <WalletSection/>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    // width: '100%',
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
});