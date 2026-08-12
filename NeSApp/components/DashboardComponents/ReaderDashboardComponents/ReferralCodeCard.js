import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Copy, Check } from 'lucide-react-native';

import useAuthStore from '../../../store/authStore';
import { ENDPOINTS } from '../../../utils/api';
import GradientButton from '../../GradientButton';
import { colors } from '../../../constants/colors';
import { fonts } from '../../../constants/fonts';

export default function ReferralCodeCard() {
    const referralCode = useAuthStore((state) => state.user?.referral_code?.code);

    const [copied, setCopied] = useState(false);
    const [enteredCode, setEnteredCode] = useState('');
    const [status, setStatus] = useState('idle'); // idle | loading | success | error
    const [message, setMessage] = useState('');

    const handleCopy = async () => {
        if (!referralCode) return;
        await Clipboard.setStringAsync(referralCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleRedeem = async () => {
        const trimmed = enteredCode.trim();
        if (!trimmed) return;

        setStatus('loading');
        setMessage('');

        try {
            const { accessToken } = useAuthStore.getState();

            const response = await fetch(ENDPOINTS.currency.redeemReferralCode, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ code: trimmed }),
            });

            const data = await response.json();

            if (!response.ok) {
                setStatus('error');
                setMessage(data.error || "That code didn't work.");
                return;
            }

            setStatus('success');
            setMessage(
                data.rewarded_immediately
                    ? "You're in! Black Ink has been added to your wallet."
                    : "Code saved! You'll both get Black Ink once your email is verified."
            );
            setEnteredCode('');

            if (data.rewarded_immediately) {
                // Refresh /me/ so the new balance shows immediately
                const meRes = await fetch(ENDPOINTS.auth.me, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                if (meRes.ok) {
                    const freshUser = await meRes.json();
                    useAuthStore.getState().updateUser(freshUser);
                }
            }
        } catch (err) {
            setStatus('error');
            setMessage('Something went wrong. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Your Code</Text>
            <View style={styles.codeRow}>
                <View style={styles.codeBox}>
                    <Text style={styles.codeText}>{referralCode || '—'}</Text>
                </View>
                <TouchableOpacity
                    style={styles.copyButton}
                    onPress={handleCopy}
                    disabled={!referralCode}
                >
                    {copied ? (
                        <Check color={colors.tertiary} size={18} />
                    ) : (
                        <Copy color={colors.secondary} size={18} />
                    )}
                </TouchableOpacity>
            </View>

            <Text style={[styles.label, styles.enterLabel]}>Have a Friend's Code?</Text>
            <View style={styles.row}>
                <TextInput
                    style={styles.input}
                    value={enteredCode}
                    onChangeText={setEnteredCode}
                    placeholder="Enter code"
                    placeholderTextColor={colors.secondary}
                    autoCapitalize="characters"
                    autoCorrect={false}
                    editable={status !== 'loading'}
                />
                <GradientButton
                    title={status === 'loading' ? '...' : 'Redeem'}
                    onPress={handleRedeem}
                    disabled={status === 'loading' || !enteredCode.trim()}
                />
            </View>
            {status === 'loading' && <ActivityIndicator style={styles.spinner} />}
            {message ? (
                <Text style={status === 'error' ? styles.errorText : styles.successText}>
                    {message}
                </Text>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    label: {
        color: colors.secondary,
        fontFamily: fonts.meriendaBold,
        fontSize: 13,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
    },
    enterLabel: {
        marginTop: 16,
    },
    codeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    codeBox: {
        flex: 1,
        borderWidth: 1,
        borderColor: colors.secondary,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: '#1a1c2e',
    },
    codeText: {
        color: colors.white,
        fontFamily: fonts.meriendaBold,
        fontSize: 16,
        letterSpacing: 2,
        textAlign: 'center',
    },
    copyButton: {
        borderWidth: 1,
        borderColor: colors.secondary,
        borderRadius: 8,
        padding: 12,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: colors.secondary,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        color: colors.white,
        fontFamily: fonts.meriendaRegular,
    },
    spinner: {
        marginTop: 8,
    },
    errorText: {
        marginTop: 8,
        color: '#c0392b',
        fontFamily: fonts.meriendaRegular,
        fontSize: 13,
    },
    successText: {
        marginTop: 8,
        color: '#27ae60',
        fontFamily: fonts.meriendaRegular,
        fontSize: 13,
    },
});