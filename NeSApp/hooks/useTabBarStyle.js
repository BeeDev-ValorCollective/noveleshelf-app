import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../constants/colors';

// Shared tab bar style for every role's tab layout.
// insets.bottom = height of the device's system nav bar (0 on web),
// so the tabs always sit just above it.
export default function useTabBarStyle() {
    const insets = useSafeAreaInsets();

    return {
        backgroundColor: colors.background,
        borderTopColor: colors.secondary,
        borderTopWidth: 1,
        height: 60 + insets.bottom,
        paddingBottom: 8 + insets.bottom,
    };
}