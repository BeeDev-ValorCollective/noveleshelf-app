import { useState } from 'react'
import { useRouter } from 'expo-router'
import { View, Text, TextInput, StyleSheet, ActivityIndicator } from 'react-native';

import useAuthStore from '../../store/authStore'
import { ENDPOINTS } from '../../utils/api'
import GradientButton from '../GradientButton'
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';

export default function WalletPurchase() {
    const router = useRouter()

    const [code, setCode] = useState('')
    const [status, setStatus] = useState('idle') // idle | loading | success | error
    const [message, setMessage] = useState('')

    const handlePurchaseQuills = () => {
        router.push('/(protected)/(reader-tabs)/quill-bundles');
    };

    const handleRedeem = async () => {
        const trimmed = code.trim()
        if (!trimmed) return

        setStatus('loading')
        setMessage('')

        try {
            const { accessToken } = useAuthStore.getState()

            const response = await fetch(ENDPOINTS.currency.redeemPromoCode, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ code: trimmed }),
            })

            const data = await response.json()

            if (!response.ok) {
                setStatus('error')
                // Backend already returns a human-readable message, e.g.
                // "Invalid code.", "This code has expired.", "You've already redeemed this code."
                setMessage(data.error || 'That code didn\'t work.')
                return
            }

            // Refresh /me/ so the wallet balance shown elsewhere in Settings updates immediately
            const meRes = await fetch(ENDPOINTS.auth.me, {
                headers: { Authorization: `Bearer ${accessToken}` },
            })
            if (meRes.ok) {
                const freshUser = await meRes.json()
                useAuthStore.getState().updateUser(freshUser)
            }

            setStatus('success')
            setMessage(`+${data.amount} ${formatCurrencyLabel(data.currency_type)} added to your wallet!`)
            setCode('')
        } catch (err) {
            setStatus('error')
            setMessage('Something went wrong. Please try again.')
        }
    }

    return (
        <View style={styles.container}>
            <GradientButton title="Purchase Quills" onPress={handlePurchaseQuills} />
            <View style={styles.promoSection}>
                <Text style={styles.label}>Promo Code</Text>
                <View style={styles.row}>
                    <TextInput
                        style={styles.input}
                        value={code}
                        onChangeText={setCode}
                        placeholder="Enter code"
                        autoCapitalize="characters"
                        autoCorrect={false}
                        editable={status !== 'loading'}
                    />
                    <GradientButton
                        title={status === 'loading' ? '...' : 'Redeem'}
                        onPress={handleRedeem}
                        disabled={status === 'loading' || !code.trim()}
                    />
                </View>
                {status === 'loading' && <ActivityIndicator style={styles.spinner} />}
                {message ? (
                    <Text style={status === 'error' ? styles.errorText : styles.successText}>
                        {message}
                    </Text>
                ) : null}
            </View>

            
        </View>
    )
}

function formatCurrencyLabel(currencyType) {
    const map = {
        black_ink: 'Black Ink',
        gold_ink: 'Gold Ink',
        quills: 'Quills',
    }
    return map[currencyType] || currencyType
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingVertical: 16,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.secondary,
    },
    promoSection: {
        flexGrow: 1,
        flexBasis: 260,
        minWidth: 250,
    },
    purchaseSection: {
        flexBasis: 200,
        alignItems: 'center',
    },
    label: {
        marginBottom: 8,
        fontWeight: '600',
        color: '#fff',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        color: '#fff',
    },
    spinner: {
        marginTop: 8,
    },
    errorText: {
        marginTop: 8,
        color: '#c0392b',
    },
    successText: {
        marginTop: 8,
        color: '#27ae60',
    },
})