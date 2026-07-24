// app/dashboard.js
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../../constants/colors';
import { fonts } from '../../../constants/fonts';
// import { sendToVite } from '../../../utils/authHandoff'; // adjust path to match the screen's location

export default function Dashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to your Dashboard!</Text>

      {/* <TouchableOpacity onPress={() => sendToVite()}>
        <Text style={styles.text}>Open on Website</Text>
      </TouchableOpacity> */}
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