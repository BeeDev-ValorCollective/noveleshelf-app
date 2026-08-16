import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import { getMediaUrl } from '../../utils/mediaUrl';

export default function BookPicker({ books, onSelectBook }) {
    return (
        <View style={styles.container}>
            <Text style={styles.pickerHeading}>Choose a book to read</Text>

            <ScrollView contentContainerStyle={styles.pickerList}>
                {books.map((userBook) => (
                    <TouchableOpacity
                        key={userBook.id}
                        style={styles.pickerCard}
                        onPress={() => onSelectBook(userBook.book.id)}
                    >
                        <Image
                            source={{ uri: getMediaUrl(userBook.book.cover_image) }}
                            style={styles.pickerCover}
                            resizeMode="cover"
                        />
                        <Text style={styles.pickerTitle} numberOfLines={2}>
                            {userBook.book.title}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: 60,
    },
    pickerHeading: {
        color: colors.white,
        fontFamily: fonts.fredericka,
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 16,
    },
    pickerList: {
        paddingHorizontal: 16,
        paddingBottom: 24,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        justifyContent: 'center',
    },
    pickerCard: {
        width: 110,
        alignItems: 'center',
    },
    pickerCover: {
        width: 100,
        height: 140,
        borderRadius: 8,
        marginBottom: 6,
    },
    pickerTitle: {
        color: colors.white,
        fontFamily: fonts.meriendaRegular,
        fontSize: 12,
        textAlign: 'center',
    },
});