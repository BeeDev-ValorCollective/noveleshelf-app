import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../constants/colors';
import { fonts } from '../../../constants/fonts';
import ProfileSection from '../../../components/DashboardComponents/ProfileSection';

export default function AdminDashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to your Admin Dashboard!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: colors.white,
    fontFamily: fonts.fredericka,
    fontSize: 24,
  },
});