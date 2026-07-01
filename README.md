# noveleshelf-app (NeSApp)

This repo is the reading portion of the Novel eShelf project — web or phone based reading. Minimal author, moderator, and admin functionality also lives here; the full versions of those roles live in the Vite client (`noveleshelf-client`) instead. The web-based version of this app is served via `app.noveleshelf.com`.

---

## Tech Stack
- **Framework:** Expo / React Native
- **Routing:** expo-router (file-based — filename = route, `[id].js` = dynamic route)
- **State:** Zustand, mirroring the Vite client's `authStore` shape
- **Persistence:** AsyncStorage (not `sessionStorage` — that's a web-only API)
- **Icons:** lucide-react-native
- **API calls:** plain `fetch`, using a shared `ENDPOINTS` object (`utils/api.js`) and `EXPO_PUBLIC_DB_API` base URL — see `utils/api.js` for the current list of endpoints wired up

---

## iFast Deployment:
- change env to live links
- run build
```
npx expo export --platform web --clear
```
be sure to upload entire contents of dist folder - folder for folder.

## Local Development

```bash
npm install
npx expo start
```

Scan the QR code and open the Expo Go app on a device to view realtime updates on phone/device. Type `w` in the terminal while the server is running to open the web version in a browser.

### Web preview dimensions
To preview at phone browser dimensions, use **418×824** (matches Melissa's iPhone) in browser dev tools' responsive mode.

### Phone connectivity for local backend testing
When testing against a local Django server from a physical device (not the web preview), Django needs to run on `0.0.0.0:8000` with the device's local network IP added to `ALLOWED_HOSTS` (IP only — no protocol, no port).

---

## Vite ↔ Expo Translation Reference

The backend calls (fetches, Zustand logic, business rules) translate directly — copy/paste. The UI/JSX layer needs translating to React Native equivalents:

| Vite | Expo/React Native |
|------|---------------------|
| `<div>` | `<View>` |
| `<p>, <h1>` | `<Text>` |
| `<img>` | `<Image>` |
| `<input>` | `<TextInput>` |
| CSS files | `StyleSheet` |
| react-router | expo-router |

---

## Architecture

### Role-based navigation
`default_login_role` from the login/`/me/` response drives which tab group the user lands in:
- `(reader-tabs)` — the primary experience, available to everyone
- `(author-tabs)` — placeholder/light functionality for non-reader roles (author, admin, moderator)

This is a change from the original plan (app always logs in as reader only, full author/admin/mod kept strictly to web) — light in-app functionality for those roles was added since, while heavy management tools (book/chapter editing, approval queues, user management) remain Vite-only.

### Auth persistence
A persistent `isLoading` flag plus a `setAuthReady()` action in the auth store, combined with an auth check + redirect in `app/index.js`, prevents a logout-on-reload bug that occurred when the app briefly rendered the landing page before AsyncStorage had finished rehydrating the token.

### Screens built so far
- Public book search (`(reader-tabs)/search.js`) — search bar, paginated list, filter modal (genres, content ratings, relationship tags, keywords, status toggles)
- Book detail (`(reader-tabs)/book/[id].js`) — hero section, cover image, badges, description, tags, chapter list

---

## Currently wired up (`utils/api.js` `ENDPOINTS`)

As of this writing, only a subset of the server's available endpoints are referenced in the Expo `ENDPOINTS` object:
```javascript
auth: { login, register, logout, refresh, me }
books: { public, single, referenceData }
```

**Not yet wired up here, even though the server endpoints exist and are documented:**
- Reader library (`/api/books/reader/library/`)
- Chapter read/unlock (`/api/books/reader/chapters/<id>/read|unlock/`)
- Follow/unfollow (`/api/follow/following/`)
- Wallet balance is already included in every `/me/` response, just not yet surfaced anywhere in the UI

This list will go stale fast — when adding a new screen, check `noveleshelf-server`'s README for what's available before assuming something needs to be built server-side first.

---

## Token Handling Reference

**Login (capture tokens from response):**
```javascript
const response = await fetch('http://localhost:8000/api/auth/login/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
});

const data = await response.json();
const accessToken = data.tokens.access;
const refreshToken = data.tokens.refresh;
```

**Store tokens (Expo — AsyncStorage/SecureStore):**
```javascript
import * as SecureStore from 'expo-secure-store';

await SecureStore.setItemAsync('access_token', accessToken);
await SecureStore.setItemAsync('refresh_token', refreshToken);
```

**Authenticated API call:**
```javascript
const accessToken = await SecureStore.getItemAsync('access_token');

const response = await fetch('http://localhost:8000/api/auth/me/', {
    headers: {
        'Authorization': `Bearer ${accessToken}`
    }
});
```

**Token refresh (access token expires in 60 min):**
```javascript
const refreshToken = await SecureStore.getItemAsync('refresh_token');

const response = await fetch('http://localhost:8000/api/auth/refresh/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh: refreshToken })
});

const data = await response.json();
await SecureStore.setItemAsync('access_token', data.access);
```

**Logout:**
```javascript
await SecureStore.deleteItemAsync('access_token');
await SecureStore.deleteItemAsync('refresh_token');
```

> **Note:** the actual app uses Zustand + AsyncStorage for the auth store (see Tech Stack above), not raw `SecureStore` calls scattered through components. The snippets above are kept as a quick reference for the underlying token mechanics, not a description of exactly how the code is organized — check `store/authStore.js` for the real implementation pattern.

---

## Known gaps / not yet decided

- Reader library, chapter read/unlock, and follow system are built server-side but not yet wired into this app's `ENDPOINTS` or any screen.
- Wallet balance display — data is available on every `/me/` call, no UI surfaces it yet.
- `(author-tabs)` is currently a placeholder — scope of "light" author/admin/mod functionality in-app hasn't been finalized.

---

[← Back to Repository README](../README.md)