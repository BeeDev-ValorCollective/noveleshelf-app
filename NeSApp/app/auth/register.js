// app/auth/register.js
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import useAuthStore from '../../store/authStore';
import GradientButton from '../../components/GradientButton';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';

const DB_API = process.env.EXPO_PUBLIC_DB_API;

export default function Register() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [form, setForm] = useState({
    email: '',
    password: '',
    confirm_password: '',
    date_of_birth: '',
  });

  const [error, setError] = useState('');

  const handleChange = (name, value) => {
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    setError('');

    if (form.password !== form.confirm_password) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch(DB_API + 'auth/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          confirm_password: form.confirm_password,
          date_of_birth: form.date_of_birth,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setAuth(data.user, data.tokens.access, data.tokens.refresh);
        router.replace('/(protected)/dashboard');
      } else {
        console.error('Registration failed:', data);
        setError(data.email?.[0] || data.confirm_password?.[0] || 'Registration failed');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Your Account</Text>
      <Text style={styles.subtitle}>Join a premium digital reading experience</Text>

      <TextInput
        style={styles.input}
        placeholder="reader@example.com"
        placeholderTextColor={colors.secondary}
        value={form.email}
        onChangeText={(value) => handleChange('email', value)}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="••••••••"
        placeholderTextColor={colors.secondary}
        value={form.password}
        onChangeText={(value) => handleChange('password', value)}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="••••••••"
        placeholderTextColor={colors.secondary}
        value={form.confirm_password}
        onChangeText={(value) => handleChange('confirm_password', value)}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD"
        placeholderTextColor={colors.secondary}
        value={form.date_of_birth}
        onChangeText={(value) => handleChange('date_of_birth', value)}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <GradientButton title="Create Account" onPress={handleSubmit} />

      <TouchableOpacity onPress={() => router.push('/auth/login')}>
        <Text style={styles.login}>
          Already have an account? <Text style={styles.loginLink}>Sign in</Text>
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
  login: {
    color: colors.white,
    marginTop: 16,
    fontFamily: fonts.meriendaRegular,
  },
  loginLink: {
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