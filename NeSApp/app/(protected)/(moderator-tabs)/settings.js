// app/(protected)/(moderator-tabs)/settings.js
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../../../constants/colors';
import ProfileSection from '../../../components/SettingsComponents/ProfileSection';
import AccountSection from '../../../components/SettingsComponents/AccountSection';
import GradientButton from '../../../components/GradientButton';
import useLogout from '../../../hooks/useLogout';

export default function ModeratorSettings() {
  const { logout } = useLogout();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.heading}>Moderator Settings</Text>
      <ProfileSection />
      <AccountSection />
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
  },
  heading: {
    color: colors.white,
    fontSize: 20,
    marginBottom: 20,
  },
});