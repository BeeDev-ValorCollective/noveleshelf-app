import { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, LayoutAnimation, Platform, UIManager } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

// variant='primary' -> large Fredericka header, for a top-level section
//   like "Your Wallet"
// variant='secondary' -> smaller bold header, for a toggle nested inside
//   a primary section, like "Promo Code" / "Referral Code" inside Wallet
export default function CollapsibleSection({
    title,
    children,
    defaultOpen = false,
    variant = 'primary',
}) {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const rotation = useRef(new Animated.Value(defaultOpen ? 1 : 0)).current;

    const toggle = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        Animated.timing(rotation, {
            toValue: isOpen ? 0 : 1,
            duration: 200,
            useNativeDriver: true,
        }).start();
        setIsOpen((prev) => !prev);
    };

    const chevronRotation = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    return (
        <View style={variant === 'primary' ? styles.primaryContainer : styles.secondaryContainer}>
            <TouchableOpacity
                style={styles.header}
                onPress={toggle}
                activeOpacity={0.7}
            >
                <Text style={variant === 'primary' ? styles.primaryTitle : styles.secondaryTitle}>
                    {title}
                </Text>
                <Animated.View style={{ transform: [{ rotate: chevronRotation }] }}>
                    <ChevronDown
                        color={variant === 'primary' ? colors.primary : colors.secondary}
                        size={variant === 'primary' ? 22 : 18}
                    />
                </Animated.View>
            </TouchableOpacity>

            {isOpen && <View style={styles.content}>{children}</View>}
        </View>
    );
}

const styles = StyleSheet.create({
    primaryContainer: {
        width: '100%',
        paddingVertical: 12,
    },
    secondaryContainer: {
        width: '100%',
        marginTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#2a2c3e',
        paddingTop: 12,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    primaryTitle: {
        color: colors.headerText,
        fontFamily: fonts.fredericka,
        fontSize: 26,
    },
    secondaryTitle: {
        color: colors.white,
        fontFamily: fonts.meriendaBold,
        fontSize: 15,
    },
    content: {
        marginTop: 12,
        width: '100%',
    },
});