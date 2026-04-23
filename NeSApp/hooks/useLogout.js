// hooks/useLogout.js
import { useRouter } from 'expo-router';
import useAuthStore from '../store/authStore';

const DB_API = process.env.EXPO_PUBLIC_DB_API;

export default function useLogout() {
    const router = useRouter();
    const { refreshToken, clearAuth } = useAuthStore();

    const logout = async () => {
        try {
            await fetch(DB_API + 'auth/logout/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${useAuthStore.getState().accessToken}`
                },
                body: JSON.stringify({
                    refresh: refreshToken
                })
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            clearAuth();
            router.replace('/auth/login');
        }
    };

    return { logout };
}