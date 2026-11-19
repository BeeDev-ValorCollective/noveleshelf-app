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

## Native Test Builds (EAS)

Run from `NeSApp`. EAS uploads the local working tree (respecting `.gitignore`), so the gitignored `.env` and `/android` / `/ios` folders are not used; each profile in `eas.json` sets the live `EXPO_PUBLIC_*` values itself.

| Profile | Platform | Distribution | Channel |
|---------|----------|--------------|---------|
| `preview` | Android tester APK | internal | `preview` |
| `testflight` | iOS TestFlight (extends `production`) | store | `preview` |
| `production` | store release | store | `production` |

```bash
npx eas-cli@latest build -p android --profile preview
npx eas-cli@latest build -p ios --profile testflight
npx eas-cli@latest submit -p ios --latest
```

- Both tester builds share the `preview` channel, so a JS-only `eas update --channel preview` reaches Android and iOS testers together. `eas update` bundles locally and reads the local `.env`, not `eas.json`, so pass the live `EXPO_PUBLIC_*` values on the command line.
- Android APKs on expo.dev expire, so the tester APK is hosted on Google Drive; replace it via Drive's Manage versions to keep the same link. Tester guide: `misc/androidTestGuide.md`.
- iOS: bundle ID `com.noveleshelf.app`, built and submitted to TestFlight with the `testflight` profile. The `expo-image-picker` plugin in `app.json` sets the iOS photo library permission message (`photosPermission`); without it, opening the photo picker crashes on iOS.

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
`default_login_role` from the login/`/me/` response drives which tab group the user lands in, and the role switcher in Settings (`AccountSection`) changes `currentRole` in the auth store. Each role has its own tab group under `app/(protected)/`, mapped by `getTabGroupForRole()` in `utils/roleHelpers.js`:
- `(reader-tabs)` — the primary experience, available to everyone
- `(author-tabs)`, `(free-author-tabs)`, `(moderator-tabs)`, `(admin-tabs)` — light functionality (dashboard + settings) for non-reader roles

This is a change from the original plan (app always logs in as reader only, full author/admin/mod kept strictly to web) — light in-app functionality for those roles was added since, while heavy management tools (book/chapter editing, approval queues, user management) remain Vite-only.

### Profile update
`app/(protected)/profile-update.js` is a single route shared by every role, registered on the `(protected)` Stack rather than inside a tab group, so `router.back()` returns to whichever dashboard opened it. It renders the form for `currentRole` from `components/SettingsComponents/ProfileUpdateComponents/`:

| Role | Form | Endpoint | Editable fields |
|------|------|----------|-----------------|
| reader | `UpdateReaderProfile` | `profile/update/` | username, first/last name, bio, avatar |
| admin | `UpdateAdminProfile` | `admin-profile/update/` | admin username, avatar |
| moderator | `UpdateModeratorProfile` | `moderator-profile/update/` | mod username, avatar |
| author | `UpdateAuthorProfile` | `author-profile/update/` | author username, pen name, bio, show real name, avatar |
| free_author | `UpdateFreeAuthorProfile` | `free-author-profile/update/` | author username, pen name, first/last name, bio, show real name, publicly visible, avatar |

Authors can't edit first/last name by design — it's tied to their contract. On save, each form calls `updateUser({ ...user, <role>_profile })`, which keeps `currentRole` and refreshes `currentProfile`.

### Image uploads
Use `appendImage(formData, field, asset)` from `utils/imageUpload.js` with the full expo-image-picker asset. On web it appends the asset's `File`; on native it appends `{ uri, name, type }`. Appending `{ uri, name, type }` on web sends the string `"[object Object]"`, which the server currently accepts and saves.

### Auth persistence
Access tokens last 1 day and refresh tokens 30 days; refresh tokens rotate on every use. Session logic lives in `utils/session.js`.

On startup, `app/_layout.js` calls `restoreSession()`, which reads the stored tokens and user from AsyncStorage and validates the access token with `/me/`:
- **200** — `setAuth` with the fresh user from `/me/` (so balances and profiles are current)
- **401** — refreshes via `auth/refresh/` and saves both returned tokens. If the refresh token is rejected (400/401), `clearAuth()`, so `app/index.js` shows the start screen
- **5xx / network failure** — keeps the cached session so offline or a server hiccup doesn't log the user out
- The saved `current_role` is restored after `setAuth`

Because it calls `/me/`, the daily login reward fires on app open, same as Vite (see Known gaps for the expired-token case).

**Mid-session:** `installAuthenticatedFetch()` (called at module scope in `app/_layout.js`) wraps `global.fetch`. Every request gets `X-Client-Platform` (`expo_ios`, `expo_android` or `expo_web`, stored as `DailyActivity`/`Event.platform`). When a `Bearer` request gets a 401, it refreshes once (concurrent 401s share one refresh) and retries; auth endpoints are skipped. `hooks/useShelf.js` still calls `clearAuth()` if a 401 makes it through.

**Expo → Vite handoff:** `sendToVite()` in `utils/authHandoff.js` adds `&role=<currentRole>` so Vite opens in the role the user was using here (Vite falls back to the default role if the user lacks that profile).

Whenever auth is cleared while on a protected route (expired token, logged-out deep link on web), `app/(protected)/_layout.js` redirects to the start screen (`/`). The logout button navigates to `/auth/login` itself.

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

**Token refresh (access token expires in 1 day; the app does this in `utils/session.js` — save the returned `refresh` too, the old one is blacklisted):**
```javascript
const refreshToken = await SecureStore.getItemAsync('refresh_token');

const response = await fetch('http://localhost:8000/api/auth/refresh/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh: refreshToken })
});

const data = await response.json();
await SecureStore.setItemAsync('access_token', data.access);
await SecureStore.setItemAsync('refresh_token', data.refresh);
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
- Scope of "light" author/admin/mod functionality in-app hasn't been finalized.
- **Expired token at startup skips `/me/`.** When the stored access token has expired, `restoreSession()` refreshes but doesn't call `/me/` again, so that launch uses the cached user and doesn't trigger the daily login reward or the `login` `DailyActivity` row (both only fire from `/me/`).
- **Notifications screen** (`(reader-tabs)/notifications.js`, opened from the reader dashboard bell) lists in-app notifications, but book/chapter publish events only send a push and don't create in-app rows, and the list has no `book_id`, so tapping an item doesn't navigate. Pull-to-refresh doesn't work (`ScrollView` needs a `RefreshControl`), only the newest 20 load, and the bell is only on the reader dashboard. Tapping a *push* notification does open the book (`NotificationNavigation` in `app/_layout.js`, native only).
- **Silent fetch failures in the library.** `hooks/useLibrarySearch.js` doesn't surface errors, so a failed request shows an empty list instead of an error. (The shelf now shows "Unable to load your shelf" / "Unable to connect".)
- **Moderator username key.** `getProfileForRole()` normalizes moderators with `moderator_username`, but the serializer field is `mod_username`, so `currentProfile.username` is `null` for moderators. `ProfileSection` reads `mod_username` directly, so it isn't visible yet.

---

[← Back to Repository README](../README.md)