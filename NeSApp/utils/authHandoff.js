// utils/authHandoff.js
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { ENDPOINTS } from './api';
import useAuthStore from '../store/authStore';

const VITE_BASE_URL = process.env.EXPO_PUBLIC_VITE_URL;

/**
 * Sends the current user from Expo -> Vite, opening the destination
 * page in the system browser already logged in.
 *
 * @param {string} destinationPath - path on the Vite site to land on
 *   after auth, e.g. '/purchase-quills' (defaults to root)
 */
export async function sendToVite(destinationPath = '/dashboard') {
  const { accessToken } = useAuthStore.getState();

  try {
    const res = await fetch(ENDPOINTS.auth.createHandoffToken, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await res.json();

    if (!res.ok) {
      console.error('Failed to create handoff token:', data.error);
      return false;
    }

    const url = `${VITE_BASE_URL}${destinationPath}?handoff=${data.handoff_token}`;
    await WebBrowser.openBrowserAsync(url);
    return true;
  } catch (err) {
    console.error('sendToVite error:', err);
    return false;
  }
}

/**
 * Exchanges an incoming handoff token for real auth tokens and logs
 * the user in. Call this once a `noveleshelf://handoff?token=...`
 * deep link has been received and parsed.
 */
export async function receiveFromVite(token) {
  if (!token) return false;

  try {
    const res = await fetch(ENDPOINTS.auth.exchangeHandoffToken, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    const data = await res.json();

    if (!res.ok) {
      console.error('Failed to exchange handoff token:', data.error);
      return false;
    }

    await useAuthStore.getState().setAuth(data.user, data.tokens.access, data.tokens.refresh);
    return true;
  } catch (err) {
    console.error('receiveFromVite error:', err);
    return false;
  }
}

/** Pulls the handoff token out of an incoming deep link URL, if present. */
export function parseHandoffToken(url) {
  if (!url) return null;
  const parsed = Linking.parse(url);
  return parsed.queryParams?.token ?? null;
}