import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Linking,
} from 'react-native';
import { Mail } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';

export default function ContactSection() {
  const email = process.env.EXPO_PUBLIC_INFO_EMAIL;

  const handleEmailPress = () => {
    Linking.openURL(`mailto:${email}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionLabel}>Contact</Text>

      <Pressable
        style={styles.contactMethod}
        onPress={handleEmailPress}
      >
        <Mail
          size={24}
          color={colors.secondary}
        />

        <View>
          <Text style={styles.contactTitle}>Email Us</Text>
          <Text style={styles.email}>{email}</Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 16,
  },
  sectionLabel: {
    color: colors.secondary,
    fontFamily: fonts.meriendaRegular,
    fontSize: 14,
    marginBottom: 12,
  },
  contactMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  contactTitle: {
    color: colors.white,
    fontFamily: fonts.fredericka,
    fontSize: 20,
    marginBottom: 4,
  },
  email: {
    color: colors.secondary,
    fontFamily: fonts.meriendaRegular,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});