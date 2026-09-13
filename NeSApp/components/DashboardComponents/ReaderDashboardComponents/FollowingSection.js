import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { Users, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';

import { colors } from '../../../constants/colors';
import { fonts } from '../../../constants/fonts';

export default function FollowingSection() {
    const router = useRouter();

    const handlePress = () => {
        router.push(
            '/(protected)/(reader-tabs)/following'
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.sectionHeader}>
                Following
            </Text>

            <TouchableOpacity
                style={styles.card}
                activeOpacity={0.8}
                onPress={handlePress}
            >
                <View style={styles.iconContainer}>
                    <Users
                        size={30}
                        color={colors.primary}
                    />
                </View>

                <View style={styles.textContainer}>
                    <Text style={styles.title}>
                        Authors You Follow
                    </Text>

                    <Text style={styles.description}>
                        View the authors you follow and visit
                        their profiles.
                    </Text>
                </View>

                <ChevronRight
                    size={24}
                    color={colors.secondary}
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingVertical: 16,
    },

    sectionHeader: {
        color: colors.headerText,
        fontFamily: fonts.fredericka,
        fontSize: 26,
        marginBottom: 16,
    },

    card: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',

        backgroundColor:
            'rgba(255, 255, 255, 0.04)',

        borderWidth: 1,
        borderColor:
            'rgba(255, 255, 255, 0.08)',

        borderRadius: 16,

        paddingVertical: 18,
        paddingHorizontal: 16,
    },

    iconContainer: {
        width: 48,
        height: 48,

        alignItems: 'center',
        justifyContent: 'center',

        marginRight: 14,
    },

    textContainer: {
        flex: 1,
    },

    title: {
        color: colors.secondary,
        fontFamily: fonts.meriendaBold,
        fontSize: 16,
    },

    description: {
        color: colors.altfaded,
        fontFamily: fonts.meriendaRegular,
        fontSize: 12,
        lineHeight: 18,
        marginTop: 3,
    },
});