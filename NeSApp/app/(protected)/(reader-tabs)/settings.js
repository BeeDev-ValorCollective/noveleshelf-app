// app/(protected)/(reader-tabs)/settings.js
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../../../constants/colors';
import AccountSection from '../../../components/SettingsComponents/AccountSection';
import ContactSection from '../../../components/SettingsComponents/ContactSection';
import WalletSection from '../../../components/DashboardComponents/ReaderDashboardComponents/WalletSection';
import WalletButtons from '../../../components/SettingsComponents/WalletPurchase'
import GradientButton from '../../../components/GradientButton';
import useLogout from '../../../hooks/useLogout';

export default function Settings() {
  const { logout } = useLogout();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.heading}>Reader Settings</Text>
      <AccountSection />
      <WalletSection />
      <WalletButtons />
      <ContactSection />
      <View style={styles.logoutBlock}>
        <GradientButton title="Logout" onPress={logout} />
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