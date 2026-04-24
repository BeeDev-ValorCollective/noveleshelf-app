# noveleshelf-app — Tracker

> Part of the Novel eShelf project · [Master Status](https://github.com/BeeDev-ValorCollective/noveleshelf-server/blob/main/PROJECT_STATUS.md)
> **Stack:** Expo · React Native · Expo Router · Zustand · Tamagui
> **Deployed at:** `app.noveleshelf.com`
> **Last updated:** 4/24/26

---

## App Purpose & Scope

This app is the **reader experience** for Novel eShelf. All reading happens here — web and native share the same Expo codebase.

```
app.noveleshelf.com     → web (Expo web build)
iOS App Store           → native (future)
Google Play Store       → native (future)
```

**What lives here:** Reading, discovery, reader library, reading progress, currency/purchases (future)
**What does NOT live here:** Author tools, admin tools, mod tools — those are all `noveleshelf.com` (client repo)

> **Note on author functionality in app:** A user always logs into the app as their reader self, even if they also hold an author/admin/mod role. Role-switching is a future consideration if author stats on mobile become a priority.

---

## Route Structure (Planned)

```
app/
  _layout.js              → root layout, auth gate
  index.js                → home / discovery
  discover.js             → browse books
  library.js              → reader's saved/unlocked books
  profile.js              → reader profile + settings
  auth/
    login.js              → /auth/login
    register.js           → /auth/register
  book/
    [id].js               → /book/:id — book detail page
  read/
    [id].js               → /read/:id — reading view
```

---

## Auth Gate Levels (Planned)

```
Not logged in            → auth screens only (login/register)
Logged in, unverified    → limited access + verification reminder banner
Logged in, verified      → full reader experience
Free author (reader+)    → reader experience (no special app features yet)
Paid author (reader+)    → reader experience (no special app features yet)
Moderator                → reader experience (no special app features yet)
Admin                    → reader experience (no special app features yet)
```

---

## ✅ Completed

### Project Setup
- [x] Expo project initialized
- [x] Expo Router installed (`"main": "expo-router/entry"` in `package.json`)
- [x] Zustand installed
- [x] Tamagui selected as UI library
- [x] `.env` set up — variables use `EXPO_PUBLIC_` prefix (e.g. `EXPO_PUBLIC_DB_API`)
- [x] `.env` in `.gitignore`

### Auth Store (`store/authStore.js`)
- [x] `user`, `accessToken`, `refreshToken`, `isAuthenticated` state
- [x] `setAuth(user, accessToken, refreshToken)`
- [x] `clearAuth()`
- [ ] Persistent storage (AsyncStorage) — tokens need to survive app close/reopen

---

## 🔄 In Progress

### Auth Flow
- [ ] Login screen — API call, Zustand store, redirect
- [ ] Register screen — API call, Zustand store, redirect
- [ ] Root layout auth gate (`_layout.js`) — redirect unauthenticated users
- [ ] Unverified user gate — banner or interstitial, limited access
- [ ] Persistent auth — wire Zustand to AsyncStorage so tokens survive app restart
- [ ] `useUser` hook (Expo version) — token rehydration on app load
- [ ] `useLogout` hook (Expo version)

---

## 🔲 Up Next Queue

*Ordered by priority — work top to bottom.*

1. **Persistent auth (AsyncStorage)** — users shouldn't be logged out every time the app closes
2. **Login + Register screens** — core auth, copy/adapt from Vite client (same API, same Zustand shape)
3. **Root layout auth gate** — unauthenticated → redirect to login
4. **Unverified user gate** — show banner/block until email is verified
5. **Home / Discovery screen** — blocked until server booksApp endpoints ready (see 🚫 below)
6. **Book detail page** — blocked on server
7. **Reader view (reading experience)** — core product, design TBD; blocked on server
8. **Reader library screen** — user's saved/unlocked books; blocked on server
9. **Reader profile + settings** — change password, change email, account management
10. **Reading progress sync** — UserReadingProgress; blocked on server
11. **Currency display** — Quills, Black Ink, Gold Ink balances (future currencyApp)
12. **iOS / Android store builds** — after web version is stable

---

## 🔗 Ready to Hand Off / Already Connected

| Feature | Status | Notes |
|---------|--------|-------|
| All userApp auth endpoints | ✅ Server ready | Login, signup, verify email, reset password etc. |
| Free author endpoints | ✅ Server ready | Not needed in app right now |

---

## 🚫 Blocked / Waiting On

| Blocked Feature | Waiting On | Notes |
|-----------------|-----------|-------|
| Book discovery / home screen | Server — booksApp endpoints | |
| Book detail page | Server — booksApp endpoints | |
| Reader view / reading experience | Server — booksApp endpoints | |
| Reader library | Server — booksApp endpoints | |
| Reading progress | Server — booksApp endpoints | |

---

## 🗒️ Notes

- API calls use `process.env.EXPO_PUBLIC_DB_API` (not `import.meta.env.VITE_DB_API` — Expo difference)
- Zustand authStore shape mirrors the Vite client — but no `sessionStorage`; use AsyncStorage instead
- Tamagui for all UI components — consistent with cross-platform goal
- `useWindowDimensions` from React Native for responsive layouts (mobile → 1 col, tablet/desktop → multi-col)
- Key responsive areas to handle: book grid, reader view column width, navigation (bottom tabs mobile / sidebar desktop)
- Expo Router is file-based routing (like Next.js) — filename = route, `[id].js` = dynamic route