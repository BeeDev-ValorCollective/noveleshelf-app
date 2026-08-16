import { View, Text, Image, StyleSheet } from 'react-native';
import useAuthStore from '../../../store/authStore';
import { colors } from '../../../constants/colors';
import { fonts } from '../../../constants/fonts';
import CollapsibleSection from '../../CommonComponents/CollapsibleSection';
import PurchaseQuillsButton from './PurchaseQuillsButton';
import PromoCodeRedeem from './PromoCodeRedeem';
import ReferralCodeCard from './ReferralCodeCard';

export default function WalletSection() {
    const wallet = useAuthStore((state) => state.user?.wallet);

    return (
        <CollapsibleSection title="Your Wallet" variant="primary" defaultOpen>
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

            <PurchaseQuillsButton />

            <CollapsibleSection title="Promo Code" variant="secondary">
                <PromoCodeRedeem />
            </CollapsibleSection>

            <CollapsibleSection title="Referral Code" variant="secondary">
                <ReferralCodeCard />
            </CollapsibleSection>
        </CollapsibleSection>
    );
}

const styles = StyleSheet.create({
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