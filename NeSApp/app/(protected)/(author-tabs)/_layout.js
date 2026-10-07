import { Tabs } from 'expo-router';
import { Home, Settings } from 'lucide-react-native';
import { colors } from '../../../constants/colors';
import useTabBarStyle from '../../../hooks/useTabBarStyle';

export default function AuthorTabsLayout() {
  const tabBarStyle = useTabBarStyle()

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.white,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="author-dashboard"
        options={{
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="author-settings"
        options={{
          tabBarIcon: ({ color, size }) => <Settings color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}