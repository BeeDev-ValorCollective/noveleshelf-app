// app/(protected)/_layout.js
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import useAuthStore from '../../store/authStore';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';

export default function ProtectedLayout() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  return (
    <Stack
    screenOptions={{
      headerStyle: { backgroundColor: colors.background },
      headerTintColor: colors.white,
      headerTitleStyle: { fontFamily: fonts.fredericka },
    }}
  >
    <Stack.Screen 
      name="dashboard" 
      options={{ title: 'Dashboard' }} 
    />
  </Stack>
  );
}