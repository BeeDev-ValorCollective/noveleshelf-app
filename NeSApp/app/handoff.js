// app/handoff.js
import { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { receiveFromVite } from '../utils/authHandoff';
import { ENDPOINTS } from '../utils/api';
import useAuthStore from '../store/authStore';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';

export default function Handoff() {
  const { token, next } = useLocalSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState('loading'); // 'loading' | 'error'

  useEffect(() => {
    (async () => {
      const success = await receiveFromVite(token);

      if (!success) {
        setStatus('error');
        return;
      }

      const destination = Array.isArray(next)
    ? next[0]
    : next

if (
    destination?.includes(
        '(reader-tabs)'
    )
) {
    await useAuthStore
        .getState()
        .setCurrentRole('reader')
}

      // Refresh /me/ so any state changes that happened while the reader
      // was away (e.g. a Quill purchase crediting their wallet) are
      // reflected immediately, rather than relying solely on the handoff's
      // user snapshot -- which was captured at exchange time, potentially
      // before the Stripe webhook had finished crediting anything.
      try {
        const { accessToken } = useAuthStore.getState();
        const res = await fetch(ENDPOINTS.auth.me, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const freshUser = await res.json();
        if (res.ok) {
          useAuthStore.getState().updateUser(freshUser);
        }
      } catch (err) {
        console.error('Post-handoff /me/ refresh error:', err);
        // Non-fatal -- proceed with whatever data setAuth already provided
      }

      router.replace(destination ? `/${destination}` : '/(protected)/(reader-tabs)/dashboard');
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (status === 'error') {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>This link has expired or already been used.</Text>
        <Text style={styles.subText} onPress={() => router.replace('/login')}>
          Return to login
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator color={colors.primary} size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: 24 },
  errorText: { color: colors.white, fontFamily: fonts.meriendaRegular, fontSize: 15, textAlign: 'center', marginBottom: 12 },
  subText: { color: colors.primary, fontFamily: fonts.meriendaBold, fontSize: 14 },
});