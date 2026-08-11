// hooks/useReadingSession.js
import { useState, useEffect } from 'react';
import { ENDPOINTS } from '../utils/api';
import { sendToVite } from '../utils/authHandoff';

/*
 * Encapsulates the reading screen's state machine:
 *   phase: 'loading' | 'picker' | 'empty' | 'reading' | 'error'
 *
 * chapterState is keyed by chapter ID:
 *   { status: 'idle' | 'loading' | 'ready' | 'locked' | 'unlocking', content?, lockedData? }
 *
 * unlockModal:        { chapterItem, cost, askAutoUnlock } | null
 * insufficientModal:  { cost, wallet } | null
 */
export default function useReadingSession({ bookIdParam, chapterIdParam, accessToken }) {
    const [phase, setPhase] = useState('loading');
    const [pickerBooks, setPickerBooks] = useState([]);
    const [book, setBook] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [chapterState, setChapterState] = useState({});
    const [unlockModal, setUnlockModal] = useState(null);
    const [insufficientModal, setInsufficientModal] = useState(null);

    const authHeaders = () => ({
        Authorization: `Bearer ${accessToken}`,
    });

    useEffect(() => {
        if (bookIdParam) {
            loadBook(bookIdParam);
        } else {
            resumeMostRecent();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bookIdParam, chapterIdParam]);

    const resumeMostRecent = async () => {
        setPhase('loading');

        try {
            const response = await fetch(ENDPOINTS.reader.readerShelf, {
                headers: authHeaders(),
            });

            const data = await response.json();
            const shelfBooks = Array.isArray(data) ? data : [];

            const candidate = shelfBooks.find(
                (userBook) => userBook.last_read_at && !userBook.is_completed
            );

            if (candidate) {
                loadBook(candidate.book.id);
            } else {
                setPickerBooks(shelfBooks);
                setPhase(shelfBooks.length > 0 ? 'picker' : 'empty');
            }
        } catch (error) {
            console.error('Resume fetch error:', error);
            setPhase('error');
        }
    };

    const loadBook = async (id) => {
        setPhase('loading');

        try {
            const response = await fetch(ENDPOINTS.reader.bookDetail(id), {
                headers: authHeaders(),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('Book detail request failed:', {
                    status: response.status,
                    data,
                });
                setPhase('error');
                return;
            }

            const readingSequence = Array.isArray(data.reading_sequence)
                ? data.reading_sequence
                : [];

            setBook({ ...data, reading_sequence: readingSequence });
            setChapterState({});

            let startingIndex = data.resume_index || 0;

            /*
             * When a chapter ID is supplied from a chapter list,
             * open that chapter instead of the saved resume position.
             */
            if (chapterIdParam) {
                const selectedChapterIndex = readingSequence.findIndex(
                    (item) =>
                        item.type === 'chapter' &&
                        String(item.id) === String(chapterIdParam)
                );

                if (selectedChapterIndex !== -1) {
                    startingIndex = selectedChapterIndex;
                }
            }

            const clampedIndex = Math.min(
                Math.max(startingIndex, 0),
                Math.max(readingSequence.length - 1, 0)
            );

            setCurrentIndex(clampedIndex);
            setPhase('reading');
        } catch (error) {
            console.error('Book detail fetch error:', error);
            setPhase('error');
        }
    };

    /*
     * Whenever the current reading-sequence item is a chapter
     * that has not been fetched yet, request its content.
     */
    useEffect(() => {
        if (phase !== 'reading' || !book) {
            return;
        }

        const item = book.reading_sequence?.[currentIndex];

        if (!item || item.type !== 'chapter') {
            return;
        }

        const state = chapterState[item.id];

        if (!state || state.status === 'idle') {
            fetchChapter(item);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentIndex, phase, book]);

    const setChapterStatus = (chapterId, patch) => {
        setChapterState((previous) => ({
            ...previous,
            [chapterId]: {
                ...(previous[chapterId] || {}),
                ...patch,
            },
        }));
    };

    const fetchChapter = async (chapterItem) => {
        setChapterStatus(chapterItem.id, { status: 'loading' });

        try {
            const response = await fetch(
                ENDPOINTS.reader.chapterRead(chapterItem.id),
                { headers: authHeaders() }
            );

            const data = await response.json();

            if (response.status === 402) {
                setChapterStatus(chapterItem.id, {
                    status: 'locked',
                    lockedData: data,
                });
                handleLockedChapter(chapterItem, data);
                return;
            }

            if (!response.ok) {
                console.error('Chapter request failed:', {
                    status: response.status,
                    data,
                });
                setChapterStatus(chapterItem.id, { status: 'idle' });
                return;
            }

            setChapterStatus(chapterItem.id, {
                status: 'ready',
                content: data.content,
            });
        } catch (error) {
            console.error('Chapter fetch error:', error);
            setChapterStatus(chapterItem.id, { status: 'idle' });
        }
    };

    const handleLockedChapter = (chapterItem, lockedData) => {
        const cost = lockedData?.chapter?.unlock_cost ?? 0;

        const wallet = lockedData?.wallet ?? {
            black_ink_balance: 0,
            gold_ink_balance: 0,
            quill_balance: 0,
        };

        const totalAvailable =
            (wallet.black_ink_balance ?? 0) +
            (wallet.gold_ink_balance ?? 0) +
            (wallet.quill_balance ?? 0);

        const prompted = book?.progress?.auto_unlock_prompted;
        const autoEnabled = book?.progress?.auto_unlock_chapters;

        if (totalAvailable < cost) {
            setInsufficientModal({ cost, wallet });
            return;
        }

        if (prompted && autoEnabled) {
            performUnlock(chapterItem);
            return;
        }

        setUnlockModal({
            chapterItem,
            cost,
            askAutoUnlock: !prompted,
        });
    };

    const performUnlock = async (chapterItem) => {
        setChapterStatus(chapterItem.id, { status: 'unlocking' });

        try {
            const response = await fetch(
                ENDPOINTS.reader.chapterUnlock(chapterItem.id),
                { method: 'POST', headers: authHeaders() }
            );

            const data = await response.json();

            if (response.status === 402) {
                setInsufficientModal({ cost: data.cost, wallet: data.wallet });
                setChapterStatus(chapterItem.id, { status: 'locked' });
                return;
            }

            if (!response.ok) {
                console.error('Unlock request failed:', {
                    status: response.status,
                    data,
                });
                setChapterStatus(chapterItem.id, { status: 'locked' });
                return;
            }

            /*
             * The chapter is unlocked. Fetch it again so the server
             * returns the content and records it as read.
             */
            fetchChapter(chapterItem);
        } catch (error) {
            console.error('Unlock error:', error);
            setChapterStatus(chapterItem.id, { status: 'locked' });
        }
    };

    const confirmUnlock = async (enableAutoUnlock) => {
        if (!unlockModal) {
            return;
        }

        const { chapterItem, askAutoUnlock } = unlockModal;
        setUnlockModal(null);

        if (askAutoUnlock) {
            try {
                const response = await fetch(
                    ENDPOINTS.reader.setAutoUnlock(book.id),
                    {
                        method: 'POST',
                        headers: {
                            ...authHeaders(),
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ enabled: enableAutoUnlock }),
                    }
                );

                if (!response.ok) {
                    const data = await response.json().catch(() => ({}));
                    console.error('Set auto-unlock preference failed:', data);
                } else {
                    setBook((previous) => ({
                        ...previous,
                        progress: {
                            ...previous.progress,
                            auto_unlock_prompted: true,
                            auto_unlock_chapters: enableAutoUnlock,
                        },
                    }));
                }
            } catch (error) {
                console.error('Set auto-unlock preference error:', error);
            }
        }

        performUnlock(chapterItem);
    };

    const goNext = () => {
        if (!book) {
            return;
        }
        if (currentIndex < book.reading_sequence.length - 1) {
            setCurrentIndex((previousIndex) => previousIndex + 1);
        }
    };

    const goPrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex((previousIndex) => previousIndex - 1);
        }
    };

    const handleOffsitePurchase = () => {
        setInsufficientModal(null);
        const returnPath = `(protected)/(reader-tabs)/reading?bookId=${book.id}`;
        sendToVite('/purchase-quills', returnPath);
    };

    return {
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
        closeUnlockModal: () => setUnlockModal(null),
        closeInsufficientModal: () => setInsufficientModal(null),
    };
}