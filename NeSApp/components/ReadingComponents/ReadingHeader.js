import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';

export default function ReadingHeader({ title, position, onBack }) {
    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={onBack}>
                <ArrowLeft color={colors.white} size={22} />
            </TouchableOpacity>

            <Text style={styles.headerTitle} numberOfLines={1}>
                {title}
            </Text>

            <Text style={styles.headerPosition}>{position}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 12,
        gap: 12,
    },
    headerTitle: {
        flex: 1,
        color: colors.headerText,
        fontFamily: fonts.fredericka,
        fontSize: 20,
        textAlign: 'center',
    },
    headerPosition: {
        color: colors.tertiary,
        fontFamily: fonts.meriendaRegular,
        fontSize: 14,
    },
});