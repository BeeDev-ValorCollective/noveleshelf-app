// app/auth/login.js
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import useAuthStore from '../../store/authStore';
import GradientButton from '../../components/GradientButton';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';

const DB_API = process.env.EXPO_PUBLIC_DB_API;

export default function Login() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');

    try {
      const response = await fetch(DB_API + 'auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setAuth(data.user, data.tokens.access, data.tokens.refresh);

        if (data.user.admin_profile || data.user.author_profile || data.user.moderator_profile) {
          router.replace('/(protected)/dashboard');
        } else {
          router.replace('/(protected)/dashboard');
        }
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Continue your reading journey</Text>

      <TextInput
        style={styles.input}
        placeholder="reader@example.com"
        placeholderTextColor={colors.secondary}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="••••••••"
        placeholderTextColor={colors.secondary}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <GradientButton title="Sign In" onPress={handleSubmit} />

      <TouchableOpacity onPress={() => router.push('/auth/reset-password')}>
        <Text style={styles.forgot}>Forgot password?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/auth/register')}>
        <Text style={styles.signup}>
          Don't have an account? <Text style={styles.signupLink}>Sign up</Text>
        </Text>
      </TouchableOpacity>

      <Text style={styles.divider}>or continue with</Text>

      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <Text style={styles.socialText}>Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Text style={styles.socialText}>Apple</Text>
        </TouchableOpacity>
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
    padding: 24,
  },
  title: {
    color: colors.white,
    fontSize: 28,
    fontFamily: fonts.fredericka,
    marginBottom: 8,
  },
  subtitle: {
    color: colors.secondary,
    fontSize: 16,
    fontFamily: fonts.meriendaRegular,
    fontStyle: 'italic',
    marginBottom: 32,
  },
  input: {
    width: '100%',
    backgroundColor: '#1a1c2e',
    color: colors.white,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontFamily: fonts.meriendaRegular,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  error: {
    color: colors.primary,
    marginBottom: 16,
    fontFamily: fonts.meriendaRegular,
  },
  forgot: {
    color: colors.secondary,
    marginTop: 16,
    fontFamily: fonts.meriendaRegular,
  },
  signup: {
    color: colors.white,
    marginTop: 16,
    fontFamily: fonts.meriendaRegular,
  },
  signupLink: {
    color: colors.primary,
    fontFamily: fonts.meriendaRegular,
  },
  divider: {
    color: colors.secondary,
    marginTop: 24,
    marginBottom: 16,
    fontFamily: fonts.meriendaRegular,
  },
  socialContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    backgroundColor: '#1a1c2e',
    padding: 12,
    borderRadius: 8,
    width: 120,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  socialText: {
    color: colors.white,
    fontFamily: fonts.meriendaRegular,
  },
});