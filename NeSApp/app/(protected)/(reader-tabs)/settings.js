// app/(protected)/(reader-tabs)/settings.js
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../../../constants/colors';
import AccountSection from '../../../components/SettingsComponents/AccountSection';
import ContactSection from '../../../components/SettingsComponents/ContactSection';
import GradientButton from '../../../components/GradientButton';
import useLogout from '../../../hooks/useLogout';
import HeroComponent from '../../../components/HeroComponent';
import ReadingSettingsSection from '../../../components/SettingsComponents/ReadingSettingsSection';

export default function Settings() {
  const { logout } = useLogout();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <HeroComponent title="Your Settings" />
      <AccountSection />
      <ReadingSettingsSection />
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
  logoutBlock: {
    marginTop: 12,
    alignItems: 'center',
  },
});