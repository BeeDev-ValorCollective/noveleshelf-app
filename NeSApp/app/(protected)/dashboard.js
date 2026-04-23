// app/dashboard.js
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import useLogout from '../../hooks/useLogout';
import GradientButton from '../../components/GradientButton';

export default function Dashboard() {
  const { logout } = useLogout();


  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to your Dashboard!</Text>
      <GradientButton title="Logout" onPress={logout} />
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