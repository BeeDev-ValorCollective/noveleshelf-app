// app/(protected)/(free-author-tabs)/settings.js
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../constants/colors';
import ProfileSection from '../../../components/SettingsComponents/ProfileSection';
import AccountSection from '../../../components/SettingsComponents/AccountSection';
import GradientButton from '../../../components/GradientButton';
import useLogout from '../../../hooks/useLogout';

export default function FreeAuthorSettings() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Free Author Settings</Text>
      <ProfileSection />
      <AccountSection />
      <View style={styles.logoutBlock}>
        <GradientButton title="Logout" onPress={logout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
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