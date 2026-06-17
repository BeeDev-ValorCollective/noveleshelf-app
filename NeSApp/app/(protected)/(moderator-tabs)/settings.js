// app/(protected)/(moderator-tabs)/settings.js
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../constants/colors';
import AccountSection from '../../../components/SettingsComponents/AccountSection';

export default function ModeratorSettings() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Moderator Settings</Text>
      <AccountSection />
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
});