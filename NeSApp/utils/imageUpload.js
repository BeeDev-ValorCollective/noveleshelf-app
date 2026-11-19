// utils/imageUpload.js
import { Platform } from 'react-native';

// Appends an expo-image-picker asset to FormData for upload.
// Web needs the real File object -- the { uri, name, type } shape only works
// with React Native's native FormData, and the browser would send it as the
// string "[object Object]".
export const appendImage = (formData, field, asset) => {
    if (Platform.OS === 'web') {
        formData.append(field, asset.file, asset.fileName || 'avatar.jpg');
        return;
    }

    const name = asset.fileName || asset.uri.split('/').pop();
    const match = /\.(\w+)$/.exec(name);
    const type = asset.mimeType || (match ? `image/${match[1]}` : 'image/jpeg');
    formData.append(field, { uri: asset.uri, name, type });
};
