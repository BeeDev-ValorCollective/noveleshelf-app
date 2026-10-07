import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../constants/colors';
import { fonts } from '../../../constants/fonts';
import ProfileSection from '../../../components/DashboardComponents/ProfileSection';
import FollowerSection from '../../../components/DashboardComponents/AuthorDashboardComponents/FollowerSection';

export default function FreeAuthorDashboard() {
  return (
    <View style={styles.container}>
          <ProfileSection/>
          <FollowerSection profileType="free_author" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: colors.white,
    fontFamily: fonts.fredericka,
    fontSize: 24,
  },
});