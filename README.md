# noveleshelf-app

This repo is the reading portion of the project, web or phone based reading.  Very minimal author, moderator, and admin parts will be inside this and it's web based parts will be via app.noveleshelf.com

To view what it would look like via phone browser dimensions to set are 418X824 (that is to melissa's iphone)

npm i on download,
npx expo start to run.  
Scan QR code and open the Expo Go app on device to view realtime updates on phone/device.  type w in terminal when server is running to open the web version.

|Vite|Expo/React Native|
|---|---|
|`<div>`|`<View>`|
|`<p>, <h1>`|`<Text>`|
|`<img>`|`<Image>`|
|`<input>`|`<TextInput>`|
|CSS files|StyleSheet|
|react-router|expo-router|

So the logic and backend calls = copy paste. The UI/JSX = needs translating.

Token codes
React/Expo front (web)
```
const response = await fetch('http://localhost:8000/api/auth/login/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
});

const data = await response.json();

// Capture tokens immediately from response
const accessToken = data.tokens.access;
const refreshToken = data.tokens.refresh;

// Store them
```
Expo Mobile
```
import * as SecureStore from 'expo-secure-store';

await SecureStore.setItemAsync('access_token', accessToken);
await SecureStore.setItemAsync('refresh_token', refreshToken);
```

API call example
```
const accessToken = await SecureStore.getItemAsync('access_token');

const response = await fetch('http://localhost:8000/api/auth/me/', {
    headers: {
        'Authorization': `Bearer ${accessToken}`
    }
});
```
Token refresh (60 min)
```
const refreshToken = await SecureStore.getItemAsync('refresh_token');

const response = await fetch('http://localhost:8000/api/auth/refresh/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh: refreshToken })
});

const data = await response.json();
// Store the new access token
await SecureStore.setItemAsync('access_token', data.access);
```
Token logout
```
await SecureStore.deleteItemAsync('access_token');
await SecureStore.deleteItemAsync('refresh_token');
```