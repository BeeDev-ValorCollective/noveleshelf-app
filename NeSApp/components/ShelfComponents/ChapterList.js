import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import { formatPublishedDate } from '../../utils/formatDate';

// Shared between shelf/[id] (already-on-shelf reading list) and book/[id]
// (pre-shelf browsing). `disabled` covers the book/[id] case where the
// reader isn't logged in or hasn't added the book to their shelf yet —
// rows render with the same badges/cost but don't navigate.
export default function ChapterList({ chapters, onChapterPress, disabled = false }) {
    if (!chapters?.length) {
        return null;
    }

    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Chapters</Text>

            {chapters.map((chapter) => (
                <TouchableOpacity
                    key={chapter.id}
                    style={[styles.chapterRow, disabled && styles.chapterRowDisabled]}
                    onPress={() => onChapterPress(chapter)}
                    disabled={disabled}
                >
                    <Text style={styles.chapterNumber}>
                        Ch. {chapter.chapter_number}
                    </Text>

                    <View style={styles.chapterInfo}>
                        <Text style={styles.chapterTitle} numberOfLines={1}>
                            {chapter.display_title ??
                                chapter.title ??
                                `Chapter ${chapter.chapter_number}`}
                        </Text>

                        <View style={styles.metaRow}>
                            {chapter.word_count > 0 && (
                                <Text style={styles.metaText}>
                                    {chapter.word_count.toLocaleString()} words
                                </Text>
                            )}

                            {chapter.is_free && (
                                <View style={[styles.badge, styles.badgeFree]}>
                                    <Text
                                        style={[
                                            styles.badgeText,
                                            styles.badgeTextFree,
                                        ]}
                                    >
                                        Free
                                    </Text>
                                </View>
                            )}

                            {chapter.is_new && (
                                <View style={[styles.badge, styles.badgeNew]}>
                                    <Text
                                        style={[
                                            styles.badgeText,
                                            styles.badgeTextNew,
                                        ]}
                                    >
                                        New
                                    </Text>
                                </View>
                            )}

                            {chapter.is_final && (
                                <View
                                    style={[styles.badge, styles.badgeFinal]}
                                >
                                    <Text
                                        style={[
                                            styles.badgeText,
                                            styles.badgeTextFinal,
                                        ]}
                                    >
                                        Final
                                    </Text>
                                </View>
                            )}
                        </View>

                        {chapter.published_at && (
                            <Text style={styles.chapterPublishedDate}>
                                Published{' '}
                                {formatPublishedDate(chapter.published_at)}
                            </Text>
                        )}
                    </View>

                    {!chapter.is_free && chapter.unlock_cost > 0 && (
                        <Text style={styles.chapterCost}>
                            {chapter.unlock_cost} 🪶
                        </Text>
                    )}
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        color: colors.primary,
        fontFamily: fonts.meriendaBold,
        fontSize: 13,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 10,
    },
    chapterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#2a2c3e',
        gap: 12,
    },
    chapterRowDisabled: {
        opacity: 0.55,
    },
    chapterNumber: {
        color: colors.primary,
        fontFamily: fonts.meriendaBold,
        fontSize: 12,
        width: 40,
    },
    chapterInfo: {
        flex: 1,
    },
    chapterTitle: {
        color: colors.white,
        fontFamily: fonts.meriendaRegular,
        fontSize: 14,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 4,
        flexWrap: 'wrap',
    },
    metaText: {
        color: colors.secondary,
        fontFamily: fonts.meriendaRegular,
        fontSize: 11,
    },
    badge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    badgeFree: {
        backgroundColor: colors.chapterFree,
    },
    badgeNew: {
        backgroundColor: colors.chapterNew,
    },
    badgeFinal: {
        backgroundColor: colors.chapterFinal,
    },
    badgeText: {
        fontFamily: fonts.meriendaBold,
        fontSize: 9,
        textTransform: 'uppercase',
    },
    badgeTextFree: {
        color: colors.tertiary,
    },
    badgeTextNew: {
        color: colors.altTertiary,
    },
    badgeTextFinal: {
        color: colors.secondary,
    },
    chapterPublishedDate: {
        color: colors.primary,
        fontFamily: fonts.meriendaRegular,
        fontSize: 11,
        marginTop: 2,
    },
    chapterCost: {
        color: colors.primary,
        fontFamily: fonts.meriendaBold,
        fontSize: 13,
    },
});