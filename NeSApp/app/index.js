import { StyleSheet, View, Text, Image } from 'react-native';
import Logo from '../assets/images/logo.png';
import GradientButton from '../components/GradientButton';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import { useRouter } from 'expo-router';




export default function Home() {

  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Your Personal Library, Reimagined</Text>
      <Image source={Logo} style={{ width: 350, height: 350 }}/>
      <Text style={styles.subtext}>Discover, read, and publish literary works in a premium digital environment designed for book lovers and authors alike.</Text>
      <View style={styles.buttonContainer}>
        <GradientButton title="Sign In" onPress={() => router.push('/auth/login')} />
        <GradientButton title="Sign Up" onPress={() => console.log('Sign up!')} reverse={true} />
      </View>
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
    textAlign: 'center',
    color: '#ffffff',
    fontFamily: fonts.fredericka,
    fontSize: 35,
    padding: 10,
    marginTop: -80,
    paddingBottom: 20,
  },
  subtext: {
    textAlign: 'center',
    fontFamily: fonts.meriendaRegular,
    fontSize: 18,
    color: colors.secondary,
    fontStyle: 'italic',
    padding: 10,
},
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 20,
  },
});