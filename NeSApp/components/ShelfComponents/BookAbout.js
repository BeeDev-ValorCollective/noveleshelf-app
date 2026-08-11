import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';

export default function BookAbout({ description }) {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>
                {description ?? 'No description is available.'}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    section: { marginBottom: 24 },
    sectionTitle: {
        color: colors.primary,
        fontFamily: fonts.meriendaBold,
        fontSize: 13,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 10,
    },
    description: {
        color: colors.white,
        fontFamily: fonts.meriendaRegular,
        fontSize: 14,
        lineHeight: 22,
    },
});