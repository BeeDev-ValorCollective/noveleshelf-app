import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import { getMediaUrl } from '../../utils/mediaUrl';

export default function ShelfBookRow({ item, onPress }) {
    const progress = parseFloat(item.completion_percentage) || 0;

    return (
        <TouchableOpacity style={styles.row} onPress={onPress}>
            <Image
                source={{ uri: getMediaUrl(item.book.cover_image) }}
                style={styles.cover}
                resizeMode="cover"
            />
            <View style={styles.info}>
                <Text style={styles.title} numberOfLines={2}>
                    {item.book.title}
                </Text>

                {item.book.author && (
                    <Text style={styles.author} numberOfLines={1}>
                        {item.book.author.pen_name || item.book.author.author_username}
                    </Text>
                )}

                <View style={styles.progressTrack}>
                    <View
                        style={[
                            styles.progressFill,
                            { width: `${Math.min(progress, 100)}%` },
                        ]}
                    />
                </View>
                <Text style={styles.progressText}>
                    {item.is_completed ? 'Completed' : `${progress.toFixed(0)}% read`}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        gap: 14,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#2a2c3e',
    },
    cover: {
        width: 70,
        height: 100,
        borderRadius: 6,
        backgroundColor: '#1a1c2e',
    },
    info: {
        flex: 1,
        justifyContent: 'center',
        gap: 4,
    },
    title: {
        color: colors.white,
        fontFamily: fonts.meriendaBold,
        fontSize: 15,
        lineHeight: 20,
    },
    author: {
        color: colors.secondary,
        fontFamily: fonts.meriendaRegular,
        fontSize: 12,
        marginBottom: 6,
    },
    progressTrack: {
        height: 5,
        backgroundColor: '#2a2c3e',
        borderRadius: 3,
        overflow: 'hidden',
        marginTop: 2,
    },
    progressFill: {
        height: '100%',
        backgroundColor: colors.primary,
        borderRadius: 3,
    },
    progressText: {
        color: colors.secondary,
        fontFamily: fonts.meriendaRegular,
        fontSize: 11,
        marginTop: 4,
    },
});