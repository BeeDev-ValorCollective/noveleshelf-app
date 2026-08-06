// components/HeroComponent.js
import { View, Text, StyleSheet } from 'react-native';
import { fonts } from '../constants/fonts';
import { colors } from '../constants/colors'

export default function HeroComponent({title, description}) {
    return (
        <View style={styles.container}>
            <View style={styles.hero}>
                <Text style={styles.hero_text}>{title}</Text>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    hero: {
        display: 'flex',
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    hero_text: {
        color: colors.white,
        fontSize: 24,
        fontFamily: fonts.meriendaRegular,
    }
})