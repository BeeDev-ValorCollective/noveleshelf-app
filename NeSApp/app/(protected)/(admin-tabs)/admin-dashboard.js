import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';

import { colors } from '../../../constants/colors';
import { fonts } from '../../../constants/fonts';

import ProfileSection from '../../../components/DashboardComponents/ProfileSection';
import GiftInkSection from '../../../components/DashboardComponents/AdminDashboardComponents/GiftInkSection';
import PromoCodeCreateSection from '../../../components/DashboardComponents/AdminDashboardComponents/PromoCodeCreateSection';

export default function AdminDashboard() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={
        styles.contentContainer
      }
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.heading}>
        Admin Dashboard
      </Text>

      <View style={styles.dashboardContent}>
        <ProfileSection />
        <GiftInkSection />
        <PromoCodeCreateSection />
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  contentContainer: {
    flexGrow: 1,

    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  dashboardContent: {
    width: '100%',
  },

  heading: {
    color: colors.white,
    fontFamily: fonts.fredericka,
    fontSize: 28,
    marginBottom: 20,
  },
});