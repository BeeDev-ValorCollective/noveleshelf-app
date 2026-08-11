// app/(protected)/(reader-tabs)/reading.js
import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { colors } from '../../../constants/colors';
import useAuthStore from '../../../store/authStore';
import useReadingSettingsStore from '../../../store/readingSettingsStore';
import useReadingSession from '../../../hooks/useReadingSession';

import CenterStatus from '../../../components/ReadingComponents/CenterStatus';
import EmptyShelfState from '../../../components/ReadingComponents/EmptyShelfState';
import BookPicker from '../../../components/ReadingComponents/BookPicker';
import ReadingHeader from '../../../components/ReadingComponents/ReadingHeader';
import ReadingContent from '../../../components/ReadingComponents/ReadingContent';
import ChapterNavRow from '../../../components/ReadingComponents/ChapterNavRow';
import UnlockModal from '../../../components/ReadingComponents/UnlockModal';
import InsufficientFundsModal from '../../../components/ReadingComponents/InsufficientFundsModal';

export default function Reading() {
    const { bookId: bookIdParam, chapterId: chapterIdParam } = useLocalSearchParams();
    const router = useRouter();

    const accessToken = useAuthStore((state) => state.accessToken);
    const user = useAuthStore((state) => state.user);

    const theme = useReadingSettingsStore((state) => state.theme);
    const fontSize = useReadingSettingsStore((state) => state.fontSize);
    const getThemeColors = useReadingSettingsStore((state) => state.getThemeColors);
    const hydrateFromProfile = useReadingSettingsStore((state) => state.hydrateFromProfile);

    useEffect(() => {
        hydrateFromProfile(user?.profile);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const themeColors = getThemeColors();

    const {
        phase,
        pickerBooks,
        book,
        currentIndex,
        chapterState,
        unlockModal,
        insufficientModal,
        loadBook,
        goNext,
        goPrev,
        confirmUnlock,
        handleOffsitePurchase,
        closeUnlockModal,
        closeInsufficientModal,
    } = useReadingSession({ bookIdParam, chapterIdParam, accessToken });

    if (phase === 'loading') {
        return <CenterStatus loading />;
    }

    if (phase === 'error') {
        return (
            <CenterStatus message="Something went wrong loading your book." />
        );
    }

    if (phase === 'empty') {
        return (
            <EmptyShelfState
                onBrowseLibrary={() =>
                    router.push('/(protected)/(reader-tabs)/library')
                }
            />
        );
    }

    if (phase === 'picker') {
        return <BookPicker books={pickerBooks} onSelectBook={loadBook} />;
    }

    const readingSequence = book?.reading_sequence ?? [];
    const item = readingSequence[currentIndex];

    if (!item) {
        return (
            <CenterStatus message="This book does not have any readable content yet." />
        );
    }

    const isFirst = currentIndex === 0;
    const isLast = currentIndex === readingSequence.length - 1;

    const currentChapterState =
        item.type === 'chapter'
            ? chapterState[item.id] || { status: 'idle' }
            : null;

    const isBusy =
        item.type === 'chapter' &&
        ['idle', 'loading', 'unlocking'].includes(currentChapterState.status);

    const isLocked =
        item.type === 'chapter' && currentChapterState.status === 'locked';

    const content =
        item.type === 'page' ? item.content : currentChapterState?.content;

    return (
        <View style={styles.container}>
            <ReadingHeader
                title={book.title}
                position={`${currentIndex + 1}/${readingSequence.length}`}
                onBack={() => router.push('/(protected)/(reader-tabs)/shelf')}
            />

            <ReadingContent
                title={item.type === 'page' ? item.title : item.display_title}
                isBusy={isBusy}
                isLocked={isLocked}
                content={content}
                themeColors={themeColors}
                fontSize={fontSize}
            />

            <ChapterNavRow
                isFirst={isFirst}
                isLast={isLast}
                onPrev={goPrev}
                onNext={goNext}
            />

            <UnlockModal
                visible={Boolean(unlockModal)}
                cost={unlockModal?.cost}
                askAutoUnlock={unlockModal?.askAutoUnlock}
                onCancel={closeUnlockModal}
                onConfirm={confirmUnlock}
            />

            <InsufficientFundsModal
                visible={Boolean(insufficientModal)}
                cost={insufficientModal?.cost}
                onClose={closeInsufficientModal}
                onGetMore={handleOffsitePurchase}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: 60,
    },
});