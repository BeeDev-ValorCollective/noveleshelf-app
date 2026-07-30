
import { View, Text, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router'
import useAuthStore from '../../../store/authStore';
import { colors } from '../../../constants/colors';
import { fonts } from '../../../constants/fonts';
import GradientButton from '../../GradientButton';

export default function WalletSection() {
  const router = useRouter()
  const wallet = useAuthStore((state) => state.user?.wallet);
  


  return (
    <View style={styles.container}>
      <Text style={styles.sectionLabelHeader}>Your Wallet</Text>
      <Text style={styles.sectionLabel}>Currencies are used to unlock chapters</Text>
      <View style={styles.balanceRow}>
        <View style={styles.balanceItem}>
          <Image source={require('../../../assets/images/blackink.png')} style={styles.dropIcon} />
          <View>
            <Text style={styles.balanceValue}>{wallet?.black_ink_balance ?? 0}</Text>
            <Text style={styles.balanceLabel}>Black Ink</Text>
            <Text style={styles.balanceInfo}>Earned Daily</Text>
          </View>
        </View>
        <View style={styles.balanceItem}>
          <Image source={require('../../../assets/images/goldink.png')} style={styles.dropIcon} />
          <View>
            <Text style={styles.balanceValue}>{wallet?.gold_ink_balance ?? 0}</Text>
            <Text style={styles.balanceLabel}>Gold Ink</Text>
            <Text style={styles.balanceInfo}>Coming Soon</Text>
          </View>
        </View>
        <View style={styles.balanceItem}>
          <Image source={require('../../../assets/images/quill.png')} style={styles.quillIcon} />
          <View>
            <Text style={styles.balanceValue}>{wallet?.quill_balance ?? 0}</Text>
            <Text style={styles.balanceLabel}>Quills</Text>
            <Text style={styles.balanceInfo}>Purchased</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 16,
  },
  sectionLabelHeader: {
    color: colors.headerText,
    fontFamily: fonts.fredericka,
    fontSize: 26,
    marginBottom: 10,
  },
  sectionLabel: {
    color: colors.secondary,
    fontFamily: fonts.meriendaRegular,
    fontSize: 18,
    marginBottom: 10,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balanceItem: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: 8,
  },
  dropIcon: {
    height: 64,
    width: 64 * (148 / 265),
    resizeMode: 'contain',
  },
  quillIcon: {
    height: 64,
    width: 64 * (394 / 881),
    resizeMode: 'contain',
  },
  balanceValue: {
    color: colors.white,
    // fontFamily: fonts.fredericka,
    fontSize: 22,
    textAlign: 'center',
  },
  balanceLabel: {
    color: colors.secondary,
    fontFamily: fonts.meriendaRegular,
    fontSize: 18,
    marginTop: 2,
    textAlign: 'center',
  },
  balanceInfo: {
    color: colors.tertiary,
    fontSize: 16,
    textAlign: 'center',
  },
});