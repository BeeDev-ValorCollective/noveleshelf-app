// components/GradientButton.js
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { fonts } from '../constants/fonts';
import { colors } from '../constants/colors'

export default function GradientButton({ title, onPress, reverse = false }) {
  const gradientColors = reverse 
    ? [colors.primary, colors.secondary, colors.background]
    : [colors.background, colors.secondary, colors.primary];

  return (
    <TouchableOpacity onPress={onPress}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={styles.button}
      >
        <Text style={styles.buttonText}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: 120,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: fonts.fredericka,
  }
});