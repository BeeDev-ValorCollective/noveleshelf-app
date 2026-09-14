import { useEffect } from 'react';
import { useRouter, Stack } from 'expo-router';

import useAuthStore from '../../store/authStore';
import {
  registerForPushNotifications,
} from '../../utils/notifications';


export default function ProtectedLayout() {
  console.log('ProtectedLayout rendering');

  const router = useRouter();

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  const isLoading = useAuthStore(
    (state) => state.isLoading
  );

  const accessToken = useAuthStore(
    (state) => state.accessToken
  );

  useEffect(() => {
    console.log(
      'isLoading:',
      isLoading,
      'isAuthenticated:',
      isAuthenticated
    );

    if (!isLoading && !isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [
    isLoading,
    isAuthenticated,
    router,
  ]);

  useEffect(() => {
    if (
      isLoading
      || !isAuthenticated
      || !accessToken
    ) {
      return;
    }

    registerForPushNotifications(
      accessToken
    );
  }, [
    isLoading,
    isAuthenticated,
    accessToken,
  ]);

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(reader-tabs)" />
      <Stack.Screen name="(author-tabs)" />
      <Stack.Screen name="(free-author-tabs)" />
      <Stack.Screen name="(admin-tabs)" />
      <Stack.Screen name="(moderator-tabs)" />
    </Stack>
  );
}