import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

import { ENDPOINTS } from './api';


export async function registerForPushNotifications(
    accessToken
) {
    if (!accessToken) {
        return null;
    }

    try {
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync(
                'default',
                {
                    name: 'NovelShelf Notifications',
                    importance:
                        Notifications.AndroidImportance.HIGH,
                }
            );
        }

        const existingPermissions =
            await Notifications.getPermissionsAsync();

        let finalStatus =
            existingPermissions.status;

        if (finalStatus !== 'granted') {
            const requestedPermissions =
                await Notifications.requestPermissionsAsync();

            finalStatus =
                requestedPermissions.status;
        }

        if (finalStatus !== 'granted') {
            console.log(
                'Push notification permission not granted.'
            );

            return null;
        }

        const projectId =
            Constants?.expoConfig?.extra?.eas?.projectId
            ?? Constants?.easConfig?.projectId;

        if (!projectId) {
            console.error(
                'Expo EAS project ID was not found.'
            );

            return null;
        }

        const expoPushToken =
            await Notifications.getExpoPushTokenAsync({
                projectId,
            });

        const token = expoPushToken.data;

        const response = await fetch(
            ENDPOINTS.pushNotifications.token,
            {
                method: 'POST',
                headers: {
                    Authorization:
                        `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token,
                    platform: Platform.OS,
                }),
            }
        );

        const data = await response
            .json()
            .catch(() => ({}));

        if (!response.ok) {
            console.error(
                'Unable to register push token:',
                data
            );

            return null;
        }

        console.log(
            'Push token registered successfully.'
        );

        return token;

    } catch (error) {
        console.error(
            'Push notification registration failed:',
            error
        );

        return null;
    }
}