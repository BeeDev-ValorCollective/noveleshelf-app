// components/SettingsComponents/WalletSection.js
import { View, Text, Image, StyleSheet } from 'react-native';
import useAuthStore from '../../store/authStore';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';

export default function WalletSection() {
  const wallet = useAuthStore((state) => state.user?.wallet);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionLabel}>Wallet</Text>
      <View style={styles.balanceRow}>
        <View style={styles.balanceItem}>
          <Image source={require('../../assets/images/blackink.png')} style={styles.dropIcon} />
          <View>
            <Text style={styles.balanceValue}>{wallet?.black_ink_balance ?? 0}</Text>
            <Text style={styles.balanceLabel}>Black Ink</Text>
          </View>
        </View>
        <View style={styles.balanceItem}>
          <Image source={require('../../assets/images/goldink.png')} style={styles.dropIcon} />
          <View>
            <Text style={styles.balanceValue}>{wallet?.gold_ink_balance ?? 0}</Text>
            <Text style={styles.balanceLabel}>Gold Ink</Text>
          </View>
        </View>
        <View style={styles.balanceItem}>
          <Image source={require('../../assets/images/quill.png')} style={styles.quillIcon} />
          <View>
            <Text style={styles.balanceValue}>{wallet?.quill_balance ?? 0}</Text>
            <Text style={styles.balanceLabel}>Quills</Text>
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
  sectionLabel: {
    color: colors.secondary,
    fontFamily: fonts.meriendaRegular,
    fontSize: 14,
    marginBottom: 10,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontFamily: fonts.fredericka,
    fontSize: 20,
  },
  balanceLabel: {
    color: colors.secondary,
    fontFamily: fonts.meriendaRegular,
    fontSize: 12,
    marginTop: 2,
  },
});