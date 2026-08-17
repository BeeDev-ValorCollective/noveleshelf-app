import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
    Platform,
} from 'react-native';

import useAuthStore from '../../../store/authStore';

import { ENDPOINTS } from '../../../utils/api';

import { colors } from '../../../constants/colors';
import { fonts } from '../../../constants/fonts';


export default function PromoCodeCreateSection() {
    const accessToken = useAuthStore(
        (state) => state.accessToken
    );

    const [code, setCode] = useState('');
    const [amount, setAmount] = useState('');

    const [maxRedemptions, setMaxRedemptions] =
        useState('');

    /*
     * Keeping expiration as text avoids adding another
     * Expo date/time picker dependency.
     *
     * Expected format:
     * YYYY-MM-DD
     *
     * Blank = never expires.
     */
    const [expirationDate, setExpirationDate] =
        useState('');

    const [submitting, setSubmitting] =
        useState(false);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');


    const handleCreate = () => {
        setError('');
        setSuccess('');

        const cleanCode =
            code.trim().toUpperCase();

        const parsedAmount =
            Number.parseInt(amount, 10);


        if (!cleanCode) {
            setError(
                'Please enter a promo code.'
            );

            return;
        }


        if (
            !Number.isInteger(parsedAmount) ||
            parsedAmount <= 0
        ) {
            setError(
                'Black Ink amount must be a positive whole number.'
            );

            return;
        }


        let parsedMaxRedemptions = null;

        if (maxRedemptions.trim()) {
            parsedMaxRedemptions =
                Number.parseInt(
                    maxRedemptions,
                    10
                );

            if (
                !Number.isInteger(
                    parsedMaxRedemptions
                ) ||
                parsedMaxRedemptions <= 0
            ) {
                setError(
                    'Maximum redemptions must be a positive whole number.'
                );

                return;
            }
        }


        let expirationIso = null;

        if (expirationDate.trim()) {
            const dateRegex =
                /^\d{4}-\d{2}-\d{2}$/;

            if (
                !dateRegex.test(
                    expirationDate.trim()
                )
            ) {
                setError(
                    'Expiration date must use YYYY-MM-DD.'
                );

                return;
            }


            /*
             * Expire at the end of the selected day,
             * rather than the beginning.
             */
            const expiration =
                new Date(
                    `${expirationDate.trim()}T23:59:59`
                );


            if (
                Number.isNaN(
                    expiration.getTime()
                )
            ) {
                setError(
                    'Please enter a valid expiration date.'
                );

                return;
            }


            expirationIso =
                expiration.toISOString();
        }


        const message =
            `Create promo code ${cleanCode} ` +
            `for ${parsedAmount} Black Ink?`;


        /*
         * Expo Web
         */
        if (Platform.OS === 'web') {
            const confirmed =
                window.confirm(message);

            if (confirmed) {
                submitPromoCode({
                    cleanCode,
                    parsedAmount,
                    parsedMaxRedemptions,
                    expirationIso,
                });
            }

            return;
        }


        /*
         * Native iOS / Android
         */
        Alert.alert(
            'Create Promo Code',
            message,
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },

                {
                    text: 'Create',

                    onPress: () =>
                        submitPromoCode({
                            cleanCode,
                            parsedAmount,
                            parsedMaxRedemptions,
                            expirationIso,
                        }),
                },
            ]
        );
    };


    const submitPromoCode = async ({
        cleanCode,
        parsedAmount,
        parsedMaxRedemptions,
        expirationIso,
    }) => {
        setSubmitting(true);
        setError('');
        setSuccess('');


        try {
            const response = await fetch(
                ENDPOINTS.currency
                    .adminCreatePromoCode,
                {
                    method: 'POST',

                    headers: {
                        Authorization:
                            `Bearer ${accessToken}`,

                        'Content-Type':
                            'application/json',
                    },

                    body: JSON.stringify({
                        code: cleanCode,

                        currency_type:
                            'black_ink',

                        amount:
                            parsedAmount,

                        max_redemptions:
                            parsedMaxRedemptions,

                        expires_at:
                            expirationIso,
                    }),
                }
            );


            const data = await response
                .json()
                .catch(() => ({}));


            if (!response.ok) {
                const detail =
                    data?.detail ||
                    data?.error;


                if (
                    detail &&
                    typeof detail === 'object'
                ) {
                    setError(
                        Object.values(detail)
                            .flat()
                            .join(' ')
                    );
                } else {
                    setError(
                        detail ||
                        'Unable to create promo code.'
                    );
                }

                return;
            }


            setSuccess(
                `Promo code ${data.code ?? cleanCode} created successfully.`
            );


            /*
             * Clear form after success.
             */
            setCode('');
            setAmount('');
            setMaxRedemptions('');
            setExpirationDate('');

        } catch (err) {
            console.error(
                'Promo code creation error:',
                err
            );

            setError(
                'Unable to connect to the server.'
            );

        } finally {
            setSubmitting(false);
        }
    };


    return (
        <View style={styles.container}>

            <Text style={styles.heading}>
                Create Promo Code
            </Text>


            <Text style={styles.description}>
                Create a Black Ink promo code
                for readers to redeem.
            </Text>


            {/* Code */}

            <View style={styles.field}>
                <Text style={styles.label}>
                    Promo Code
                </Text>

                <TextInput
                    style={styles.input}

                    value={code}

                    onChangeText={(value) =>
                        setCode(
                            value.toUpperCase()
                        )
                    }

                    placeholder="BOOKFAIR26"

                    placeholderTextColor={
                        colors.secondary
                    }

                    autoCapitalize="characters"

                    autoCorrect={false}

                    editable={!submitting}
                />
            </View>


            {/* Ink Amount */}

            <View style={styles.field}>
                <Text style={styles.label}>
                    Black Ink
                </Text>

                <TextInput
                    style={styles.input}

                    value={amount}

                    onChangeText={setAmount}

                    placeholder="25"

                    placeholderTextColor={
                        colors.secondary
                    }

                    keyboardType="number-pad"

                    editable={!submitting}
                />
            </View>


            {/* Max Redemptions */}

            <View style={styles.field}>
                <Text style={styles.label}>
                    Maximum Redemptions
                </Text>

                <TextInput
                    style={styles.input}

                    value={maxRedemptions}

                    onChangeText={
                        setMaxRedemptions
                    }

                    placeholder="Leave blank for unlimited"

                    placeholderTextColor={
                        colors.secondary
                    }

                    keyboardType="number-pad"

                    editable={!submitting}
                />

                <Text style={styles.helperText}>
                    Leave blank if the code can be
                    redeemed by an unlimited number
                    of readers.
                </Text>
            </View>


            {/* Expiration */}

            <View style={styles.field}>
                <Text style={styles.label}>
                    Expiration Date
                </Text>

                <TextInput
                    style={styles.input}

                    value={expirationDate}

                    onChangeText={
                        setExpirationDate
                    }

                    placeholder="YYYY-MM-DD"

                    placeholderTextColor={
                        colors.secondary
                    }

                    keyboardType="numbers-and-punctuation"

                    editable={!submitting}
                />

                <Text style={styles.helperText}>
                    Leave blank if the code should
                    never expire.
                </Text>
            </View>


            {/* Feedback */}

            {error ? (
                <Text style={styles.error}>
                    {error}
                </Text>
            ) : null}


            {success ? (
                <Text style={styles.success}>
                    {success}
                </Text>
            ) : null}


            {/* Create */}

            <TouchableOpacity
                style={[
                    styles.createButton,

                    (
                        submitting ||
                        !code.trim() ||
                        !amount
                    ) &&
                    styles.buttonDisabled,
                ]}

                onPress={handleCreate}

                disabled={
                    submitting ||
                    !code.trim() ||
                    !amount
                }
            >

                {submitting ? (
                    <ActivityIndicator
                        size="small"

                        color={
                            colors.background
                        }
                    />

                ) : (

                    <Text
                        style={
                            styles.createButtonText
                        }
                    >
                        Create Promo Code
                    </Text>

                )}

            </TouchableOpacity>

        </View>
    );
}


const styles = StyleSheet.create({

    container: {
        width: '100%',

        marginTop: 20,
        marginBottom: 20,

        padding: 18,

        backgroundColor:
            'rgba(255,255,255,0.04)',

        borderWidth: 1,

        borderColor:
            'rgba(255,255,255,0.08)',

        borderRadius: 16,
    },


    heading: {
        color: colors.white,

        fontFamily:
            fonts.fredericka,

        fontSize: 24,
    },


    description: {
        color: colors.secondary,

        fontFamily:
            fonts.meriendaRegular,

        fontSize: 13,

        marginTop: 5,
        marginBottom: 18,
    },


    field: {
        width: '100%',

        marginBottom: 15,
    },


    label: {
        color: colors.secondary,

        fontFamily:
            fonts.meriendaRegular,

        fontSize: 13,

        marginBottom: 6,
    },


    input: {
        width: '100%',

        minHeight: 48,

        paddingHorizontal: 14,
        paddingVertical: 10,

        color: colors.white,

        backgroundColor:
            'rgba(255,255,255,0.05)',

        borderWidth: 1,

        borderColor:
            'rgba(255,255,255,0.12)',

        borderRadius: 8,

        fontFamily:
            fonts.meriendaRegular,

        fontSize: 14,
    },


    helperText: {
        color: colors.secondary,

        fontFamily:
            fonts.meriendaRegular,

        fontSize: 10,

        marginTop: 5,

        opacity: 0.75,
    },


    error: {
        color: '#dd7a7a',

        fontFamily:
            fonts.meriendaRegular,

        fontSize: 13,

        marginBottom: 12,
    },


    success: {
        color: '#7ec8a0',

        fontFamily:
            fonts.meriendaRegular,

        fontSize: 13,

        marginBottom: 12,
    },


    createButton: {
        minHeight: 48,

        alignItems: 'center',
        justifyContent: 'center',

        paddingHorizontal: 20,

        backgroundColor:
            colors.primary,

        borderRadius: 10,
    },


    buttonDisabled: {
        opacity: 0.5,
    },


    createButtonText: {
        color: colors.background,

        fontFamily:
            fonts.meriendaBold,

        fontSize: 15,
    },

});