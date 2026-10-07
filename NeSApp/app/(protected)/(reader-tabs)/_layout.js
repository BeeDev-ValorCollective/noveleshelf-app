// app/(protected)/(reader-tabs)/_layout.js
import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Home, Library, BookOpen, Search, Settings } from 'lucide-react-native';
import { colors } from '../../../constants/colors';
import useTabBarStyle from '../../../hooks/useTabBarStyle';

export default function ReaderTabsLayout() {
  const tabBarStyle = useTabBarStyle();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        // Hide the tab bar while reading; ReadingHeader's back button is the way out
        tabBarStyle: route.name === 'reading' ? { display: 'none' } : tabBarStyle,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.white,
        tabBarShowLabel: false,
      })}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="shelf"
        options={{
          tabBarIcon: ({ color, size }) => <Library color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="reading"
        options={{
          tabBarIcon: ({ color, size }) => (
            <View style={styles.readingButton}>
              <BookOpen color={colors.background} size={26} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          tabBarIcon: ({ color, size }) => <Search color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ color, size }) => <Settings color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="following"
        options={{ href: null, headerShown: false }}
      />
      <Tabs.Screen
        name="book/[id]"
        options={{ href: null, headerShown: false }}
      />
      <Tabs.Screen
        name="shelf/[id]"
        options={{ href: null, headerShown: false }}
      />
      <Tabs.Screen
        name="author/[username]"
        options={{ href: null, headerShown: false }}
      />
      <Tabs.Screen
        name="profile-update"
        options={{ href: null, headerShown: false }}
      />
      <Tabs.Screen
        name="quill-bundles"
        options={{ href: null, headerShown: false }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  readingButton: {
    backgroundColor: colors.primary,
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
});