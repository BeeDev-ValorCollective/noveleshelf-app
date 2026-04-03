import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router'
import Logo from './images/logo.png'
import { LinearGradient } from 'expo-linear-gradient';

export default function Home() {
  return (
    <View style={styles.container}>
        <Text style={styles.text}>Your Personal Library, Reimagined</Text>
        <Image source={Logo} style={{ width: 350, height: 350 }}/>
        <Text style={styles.subtext}>Discover, read, and publish literary works in a premium digital environment designed for book lovers and authors alike.</Text>
        <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => console.log('Sign In!')}>
                <LinearGradient
                    colors={['#0d0f1a', '#dd7a7a', '#ff9f8a']}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Sign In</Text>
                </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => console.log('Sign up!')}>
                <LinearGradient
                    colors={['#ff9f8a', '#dd7a7a', '#0d0f1a']}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Sign Up</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0f1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    alignItems: 'center',
    textAlign: 'center',
    color: 'white',
    fontSize: 35,
    padding: 10,
    marginTop: -80,
    paddingBottom: 20,
  },
  subtext: {
    alignItems: 'center',
    textAlign: 'center',
    fontFamily: 'Merienda_400Regular',
    fontSize: 18,
    color: '#DD7a7a',
    fontStyle: 'italic',
    padding: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 20,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  }
});