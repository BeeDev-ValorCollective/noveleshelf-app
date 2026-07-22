// app/dashboard.js
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../../../constants/colors';
import { fonts } from '../../../constants/fonts';
import ProfileSection from '../../../components/DashboardComponents/ProfileSection';
import WalletSection from '../../../components/DashboardComponents/ReaderDashboardComponents/WalletSection'

export default function Dashboard() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
    <View style={styles.container}>
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
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  heading: {
    color: colors.white,
    fontSize: 20,
    marginBottom: 20,
  },
  logoutBlock: {
    marginTop: 12,
    alignItems: 'center',
  },
});