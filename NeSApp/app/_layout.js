import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { FrederickatheGreat_400Regular } from '@expo-google-fonts/fredericka-the-great';
import { Merienda_400Regular, Merienda_700Bold } from '@expo-google-fonts/merienda';
import { View, Text } from 'react-native';

export default function RootLayout() {

    const [fontsLoaded, fontError] = useFonts({
        FrederickatheGreat_400Regular,
        Merienda_400Regular,
        Merienda_700Bold,
    });

    if (fontError) {
        console.error('Font error:', fontError);
    }

    if (!fontsLoaded) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Loading...</Text>
            </View>
        );
    }

  return (
    <Stack
        screenOptions={{
            headerStyle: { backgroundColor: '#0d0f1a' },
            headerTintColor: '#ffffff',
            headerTitleStyle: { fontFamily: 'FrederickatheGreat_400Regular' },
        }}
    >
      <Stack.Screen 
        name="index" 
        options={{ title: 'Novel eShelf' }} 
      />
    </Stack>
//     <Stack.Screen 
//   name="index" 
//   options={{ headerShown: false }} />
  );
}