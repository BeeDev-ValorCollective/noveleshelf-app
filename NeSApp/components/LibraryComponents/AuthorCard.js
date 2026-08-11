import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import { getMediaUrl } from '../../utils/mediaUrl';

export default function AuthorCard({ item, onPress }) {
    return (
        <TouchableOpacity style={styles.authorCard} onPress={onPress}>
            <View style={styles.authorAvatar}>
                {item.avatar_url ? (
                    <Image
                        source={{ uri: getMediaUrl(item.avatar_url) }}
                        style={styles.authorAvatarImage}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={styles.authorAvatarPlaceholder}>
                        <Text style={styles.authorAvatarPlaceholderText}>
                            {item.display_name?.[0] ?? '?'}
                        </Text>
                    </View>
                )}
            </View>

            <View style={styles.authorInfo}>
                <View style={styles.authorNameRow}>
                    <Text style={styles.authorName} numberOfLines={1}>
                        {item.display_name}
                    </Text>
                    {item.is_founding_author && (
                        <Text style={styles.foundingBadge}>FOUNDING</Text>
                    )}
                </View>

                {item.bio ? (
                    <Text style={styles.authorBio} numberOfLines={2}>
                        {item.bio}
                    </Text>
                ) : null}

                <Text style={styles.authorBookCount}>
                    {item.book_count} {item.book_count === 1 ? 'book' : 'books'}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    authorCard: {
        flexDirection: 'row',
        backgroundColor: '#1a1c2e',
        borderRadius: 10,
        marginBottom: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: '#2a2c3e',
        gap: 12,
        alignItems: 'center',
    },
    authorAvatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        overflow: 'hidden',
    },
    authorAvatarImage: {
        width: '100%',
        height: '100%',
    },
    authorAvatarPlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: '#2a2c3e',
        justifyContent: 'center',
        alignItems: 'center',
    },
    authorAvatarPlaceholderText: {
        color: colors.primary,
        fontFamily: fonts.meriendaBold,
        fontSize: 20,
    },
    authorInfo: {
        flex: 1,
        gap: 4,
    },
    authorNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    authorName: {
        color: colors.white,
        fontFamily: fonts.fredericka,
        fontSize: 15,
        flexShrink: 1,
    },
    foundingBadge: {
        color: colors.background,
        backgroundColor: '#ffd900',
        fontFamily: fonts.meriendaBold,
        fontSize: 9,
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: 4,
    },
    authorBio: {
        color: colors.secondary,
        fontFamily: fonts.meriendaRegular,
        fontSize: 12,
    },
    authorBookCount: {
        color: colors.secondary,
        fontFamily: fonts.meriendaRegular,
        fontSize: 11,
    },
});