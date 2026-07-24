// app/(protected)/(reader-tabs)/reading.js
import { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  ActivityIndicator, Modal, Image, Linking, useWindowDimensions
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import RenderHTML from 'react-native-render-html';
import { ChevronLeft, ChevronRight, ArrowLeft, Lock, X } from 'lucide-react-native';
import { colors } from '../../../constants/colors';
import { fonts } from '../../../constants/fonts';
import { ENDPOINTS } from '../../../utils/api';
import { getMediaUrl } from '../../../utils/mediaUrl';
import useAuthStore from '../../../store/authStore';
import { sendToVite } from '../../../utils/authHandoff';

// // TODO: replace with the real currency purchase page once it exists.
// // For now this just proves out the "send them off-site to buy more" flow.
// const OFFSITE_PURCHASE_URL = 'https://www.google.com';

export default function Reading() {
  const { bookId: bookIdParam } = useLocalSearchParams();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const accessToken = useAuthStore((state) => state.accessToken);

  // 'loading' | 'picker' | 'empty' | 'reading' | 'error'
  const [phase, setPhase] = useState('loading');
  const [pickerBooks, setPickerBooks] = useState([]);
  const [book, setBook] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Per-chapter state, keyed by chapter id:
  // { status: 'idle' | 'loading' | 'ready' | 'locked' | 'unlocking', content?, lockedData? }
  const [chapterState, setChapterState] = useState({});

  const [unlockModal, setUnlockModal] = useState(null); // { chapterItem, cost, askAutoUnlock }
  const [insufficientModal, setInsufficientModal] = useState(null); // { cost, wallet }

  const authHeaders = () => ({ Authorization: `Bearer ${accessToken}` });

  useEffect(() => {
    if (bookIdParam) {
      loadBook(bookIdParam);
    } else {
      resumeMostRecent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookIdParam]);

  const resumeMostRecent = async () => {
    setPhase('loading');
    try {
      const res = await fetch(ENDPOINTS.reader.readerShelf, { headers: authHeaders() });
      const data = await res.json();
      const candidate = data.find((ub) => ub.last_read_at && !ub.is_completed);
      if (candidate) {
        loadBook(candidate.book.id);
      } else {
        setPickerBooks(data);
        setPhase(data.length > 0 ? 'picker' : 'empty');
      }
    } catch (err) {
      console.error('Resume fetch error:', err);
      setPhase('error');
    }
  };

  const loadBook = async (id) => {
    setPhase('loading');
    try {
      const res = await fetch(ENDPOINTS.reader.bookDetail(id), { headers: authHeaders() });
      const data = await res.json();
      setBook(data);
      setChapterState({});
      const sequenceLength = data.reading_sequence?.length || 0;
      const clampedIndex = Math.min(Math.max(data.resume_index || 0, 0), Math.max(sequenceLength - 1, 0));
      setCurrentIndex(clampedIndex);
      setPhase('reading');
    } catch (err) {
      console.error('Book detail fetch error:', err);
      setPhase('error');
    }
  };

  // Whenever the current item is a chapter we haven't touched yet, fetch it.
  useEffect(() => {
    if (phase !== 'reading' || !book) return;
    const item = book.reading_sequence[currentIndex];
    if (!item || item.type !== 'chapter') return;

    const state = chapterState[item.id];
    if (!state || state.status === 'idle') {
      fetchChapter(item);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, phase, book]);

  const setChapterStatus = (chapterId, patch) => {
    setChapterState((prev) => ({
      ...prev,
      [chapterId]: { ...(prev[chapterId] || {}), ...patch },
    }));
  };

  const fetchChapter = async (chapterItem) => {
    setChapterStatus(chapterItem.id, { status: 'loading' });
    try {
      const res = await fetch(ENDPOINTS.reader.chapterRead(chapterItem.id), { headers: authHeaders() });
      const data = await res.json();

      if (res.status === 402) {
        setChapterStatus(chapterItem.id, { status: 'locked', lockedData: data });
        handleLockedChapter(chapterItem, data);
        return;
      }

      setChapterStatus(chapterItem.id, { status: 'ready', content: data.content });
    } catch (err) {
      console.error('Chapter fetch error:', err);
      setChapterStatus(chapterItem.id, { status: 'idle' });
    }
  };

  const handleLockedChapter = (chapterItem, lockedData) => {
    const cost = lockedData.chapter.unlock_cost;
    const wallet = lockedData.wallet;
    const totalAvailable = wallet.black_ink_balance + wallet.gold_ink_balance + wallet.quill_balance;

    const prompted = book.progress?.auto_unlock_prompted;
    const autoEnabled = book.progress?.auto_unlock_chapters;

    if (totalAvailable < cost) {
      setInsufficientModal({ cost, wallet });
      return;
    }

    if (prompted && autoEnabled) {
      performUnlock(chapterItem);
      return;
    }

    setUnlockModal({ chapterItem, cost, askAutoUnlock: !prompted });
  };

  const performUnlock = async (chapterItem) => {
    setChapterStatus(chapterItem.id, { status: 'unlocking' });
    try {
      const res = await fetch(ENDPOINTS.reader.chapterUnlock(chapterItem.id), {
        method: 'POST',
        headers: authHeaders(),
      });
      const data = await res.json();

      if (res.status === 402) {
        setInsufficientModal({ cost: data.cost, wallet: data.wallet });
        setChapterStatus(chapterItem.id, { status: 'locked' });
        return;
      }

      // Unlocked — now actually fetch the content (and mark it read).
      fetchChapter(chapterItem);
    } catch (err) {
      console.error('Unlock error:', err);
      setChapterStatus(chapterItem.id, { status: 'locked' });
    }
  };

  const confirmUnlock = async (enableAutoUnlock) => {
    const { chapterItem, askAutoUnlock } = unlockModal;
    setUnlockModal(null);

    if (askAutoUnlock) {
      try {
        await fetch(ENDPOINTS.reader.setAutoUnlock(book.id), {
          method: 'POST',
          headers: { ...authHeaders(), 'Content-Type': 'application/json' },
          body: JSON.stringify({ enabled: enableAutoUnlock }),
        });
        setBook((prev) => ({
          ...prev,
          progress: {
            ...prev.progress,
            auto_unlock_prompted: true,
            auto_unlock_chapters: enableAutoUnlock,
          },
        }));
      } catch (err) {
        console.error('Set auto-unlock preference error:', err);
      }
    }

    performUnlock(chapterItem);
  };

  const goNext = () => {
    if (!book) return;
    if (currentIndex < book.reading_sequence.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  };

  const handleOffsitePurchase = () => {
    setInsufficientModal(null);
    sendToVite('/purchase-quills');
  };

  // ─── Loading / empty / picker / error states ─────────────────────────────

  if (phase === 'loading') {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (phase === 'error') {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Something went wrong loading your book.</Text>
      </View>
    );
  }

  if (phase === 'empty') {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyTitle}>Nothing to read yet</Text>
        <Text style={styles.emptyText}>Add a book to your shelf from the Library to get started.</Text>
        <TouchableOpacity
          style={styles.emptyButton}
          onPress={() => router.push('/(protected)/(reader-tabs)/library')}
        >
          <Text style={styles.emptyButtonText}>Browse Library</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (phase === 'picker') {
    return (
      <View style={styles.container}>
        <Text style={styles.pickerHeading}>Choose a book to read</Text>
        <ScrollView contentContainerStyle={styles.pickerList}>
          {pickerBooks.map((ub) => (
            <TouchableOpacity
              key={ub.id}
              style={styles.pickerCard}
              onPress={() => loadBook(ub.book.id)}
            >
              <Image
                source={{ uri: getMediaUrl(ub.book.cover_image) }}
                style={styles.pickerCover}
                resizeMode="cover"
              />
              <Text style={styles.pickerTitle} numberOfLines={2}>{ub.book.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }

  // ─── Reading ───────────────────────────────────────────────────────────

  const item = book.reading_sequence?.[currentIndex];

  if (!item) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>This book doesn't have any readable content yet.</Text>
      </View>
    );
  }

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === book.reading_sequence.length - 1;

  const chState = item.type === 'chapter' ? (chapterState[item.id] || { status: 'idle' }) : null;
  const isBusy = item.type === 'chapter' && ['idle', 'loading', 'unlocking'].includes(chState.status);
  const isLocked = item.type === 'chapter' && chState.status === 'locked';
  const content = item.type === 'page' ? item.content : chState?.content;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(protected)/(reader-tabs)/shelf')}>
          <ArrowLeft color={colors.white} size={22} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{book.title}</Text>
        <Text style={styles.headerPosition}>{currentIndex + 1}/{book.reading_sequence.length}</Text>
      </View>

      <ScrollView style={styles.contentScroll} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.itemTitle}>
          {item.type === 'page' ? item.title : item.display_title}
        </Text>

        {isBusy ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} />
        ) : isLocked ? (
          <View style={styles.lockedState}>
            <Lock color={colors.secondary} size={32} />
            <Text style={styles.lockedText}>This chapter is locked.</Text>
          </View>
        ) : (
          <RenderHTML
            contentWidth={width - 40}
            source={{ html: content || '' }}
            baseStyle={styles.htmlBase}
          />
        )}
      </ScrollView>

      <View style={styles.navRow}>
        <TouchableOpacity
          style={[styles.navButton, isFirst && styles.navButtonDisabled]}
          onPress={goPrev}
          disabled={isFirst}
        >
          <ChevronLeft color={isFirst ? colors.secondary : colors.white} size={22} />
          <Text style={[styles.navButtonText, isFirst && styles.navButtonTextDisabled]}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navButton, isLast && styles.navButtonDisabled]}
          onPress={goNext}
          disabled={isLast}
        >
          <Text style={[styles.navButtonText, isLast && styles.navButtonTextDisabled]}>Next</Text>
          <ChevronRight color={isLast ? colors.secondary : colors.white} size={22} />
        </TouchableOpacity>
      </View>

      {/* Unlock confirm modal */}
      <Modal visible={!!unlockModal} transparent animationType="fade" onRequestClose={() => setUnlockModal(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Unlock this chapter?</Text>
            <Text style={styles.modalBody}>This chapter costs {unlockModal?.cost} to unlock.</Text>

            {unlockModal?.askAutoUnlock && (
              <Text style={styles.modalBody}>
                Want future chapters in this book to unlock automatically whenever you have enough funds?
              </Text>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancelButton} onPress={() => setUnlockModal(null)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>

              {unlockModal?.askAutoUnlock ? (
                <>
                  <TouchableOpacity style={styles.modalConfirmButton} onPress={() => confirmUnlock(false)}>
                    <Text style={styles.modalConfirmText}>Just This One</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.modalConfirmButton} onPress={() => confirmUnlock(true)}>
                    <Text style={styles.modalConfirmText}>Always Auto-Unlock</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity style={styles.modalConfirmButton} onPress={() => confirmUnlock(false)}>
                  <Text style={styles.modalConfirmText}>Unlock</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>

      {/* Insufficient funds modal */}
      <Modal visible={!!insufficientModal} transparent animationType="fade" onRequestClose={() => setInsufficientModal(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalCloseX} onPress={() => setInsufficientModal(null)}>
              <X color={colors.white} size={20} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Not Enough Funds</Text>
            <Text style={styles.modalBody}>
              You need {insufficientModal?.cost} to unlock this chapter, but don't have enough in your wallet right now.
            </Text>
            <TouchableOpacity style={styles.modalConfirmButton} onPress={handleOffsitePurchase}>
              <Text style={styles.modalConfirmText}>Get More Ink Drops</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 60,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    color: colors.secondary,
    fontFamily: fonts.meriendaRegular,
    textAlign: 'center',
  },
  emptyTitle: {
    color: colors.white,
    fontFamily: fonts.fredericka,
    fontSize: 20,
    marginBottom: 10,
  },
  emptyText: {
    color: colors.secondary,
    fontFamily: fonts.meriendaRegular,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: colors.background,
    fontFamily: fonts.meriendaBold,
    fontSize: 15,
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
    color: colors.white,
    fontFamily: fonts.fredericka,
    fontSize: 16,
    textAlign: 'center',
  },
  headerPosition: {
    color: colors.secondary,
    fontFamily: fonts.meriendaRegular,
    fontSize: 12,
  },
  contentScroll: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  itemTitle: {
    color: colors.primary,
    fontFamily: fonts.fredericka,
    fontSize: 20,
    marginBottom: 16,
  },
  htmlBase: {
    color: colors.white,
    fontFamily: fonts.meriendaRegular,
    fontSize: 15,
    lineHeight: 24,
  },
  lockedState: {
    alignItems: 'center',
    marginTop: 60,
    gap: 12,
  },
  lockedText: {
    color: colors.secondary,
    fontFamily: fonts.meriendaRegular,
    fontSize: 14,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: colors.secondary,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  navButtonDisabled: {
    opacity: 0.4,
  },
  navButtonText: {
    color: colors.white,
    fontFamily: fonts.meriendaBold,
    fontSize: 14,
  },
  navButtonTextDisabled: {
    color: colors.secondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#1a1c2e',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 380,
  },
  modalCloseX: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  modalTitle: {
    color: colors.white,
    fontFamily: fonts.fredericka,
    fontSize: 18,
    marginBottom: 12,
  },
  modalBody: {
    color: colors.secondary,
    fontFamily: fonts.meriendaRegular,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 14,
  },
  modalActions: {
    gap: 10,
    marginTop: 8,
  },
  modalCancelButton: {
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.secondary,
    alignItems: 'center',
  },
  modalCancelText: {
    color: colors.secondary,
    fontFamily: fonts.meriendaBold,
  },
  modalConfirmButton: {
    padding: 14,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  modalConfirmText: {
    color: colors.background,
    fontFamily: fonts.meriendaBold,
  },
});