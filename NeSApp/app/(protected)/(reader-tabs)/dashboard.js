// app/dashboard.js
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../../../constants/colors';
import { fonts } from '../../../constants/fonts';
import ProfileSection from '../../../components/DashboardComponents/ProfileSection';
import WalletSection from '../../../components/DashboardComponents/ReaderDashboardComponents/WalletSection'
import HeroComponent from '../../../components/HeroComponent';

export default function Dashboard() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
    <View style={styles.contentContainer}>
      <HeroComponent title="Your Dashboard" />
      <ProfileSection/>
      <WalletSection/>
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    width: '100%',
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
});