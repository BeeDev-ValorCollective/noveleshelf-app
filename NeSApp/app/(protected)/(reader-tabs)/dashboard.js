// app/dashboard.js
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../../../constants/colors';
import { fonts } from '../../../constants/fonts';
import ProfileSection from '../../../components/DashboardComponents/ProfileSection';
import WalletSection from '../../../components/DashboardComponents/ReaderDashboardComponents/WalletSection'
import StreakSection from '../../../components/DashboardComponents/ReaderDashboardComponents/StreakSection';
// import { sendToVite } from '../../../utils/authHandoff'; // adjust path to match the screen's location

export default function Dashboard() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
    <View style={styles.contentContainer}>
      <ProfileSection/>
      <StreakSection/>
      <WalletSection/>

      {/* <TouchableOpacity onPress={() => sendToVite()}>
        <Text style={styles.text}>Open on Website</Text>
      </TouchableOpacity> */}
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