// app/(protected)/(author-tabs)/settings.js
import { View, Text } from 'react-native';
import { colors } from '../../../constants/colors';

export default function AuthorSettings() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: colors.white }}>Settings</Text>
    </View>
  );
}