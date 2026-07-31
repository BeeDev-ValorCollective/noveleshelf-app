// app/(protected)/(reader-tabs)/search.js
import { useState, useEffect } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableOpacity,
  StyleSheet, Image, Modal, ScrollView, ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { Search as SearchIcon, SlidersHorizontal, X, Check, ChevronDown } from 'lucide-react-native';
import { colors } from '../../../constants/colors';
import { fonts } from '../../../constants/fonts';
import { ENDPOINTS } from '../../../utils/api';
import { getMediaUrl } from '../../../utils/mediaUrl';

const EMPTY_BOOK_FILTERS = {
  genre: null,
  content_rating: null,
  relationship_tag: null,
  keyword: null,
  is_new: false,
  is_complete: false,
  is_featured: false,
};

const EMPTY_AUTHOR_FILTERS = {
  is_featured: false,
  is_founding_author: false,
};

const DEFAULT_ORDER = {
  books: 'newest',
  authors: 'az',
};

const BOOK_ORDER_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'az', label: 'A – Z' },
  { value: 'za', label: 'Z – A' },
  { value: 'featured', label: 'Featured first' },
];

const AUTHOR_ORDER_OPTIONS = [
  { value: 'az', label: 'A – Z' },
  { value: 'za', label: 'Z – A' },
  { value: 'featured', label: 'Featured first' },
];

export default function Library() {

  const router = useRouter();

  // View / sort state
  const [view, setView] = useState('books');
  const [order, setOrder] = useState('newest');
  const [orderModalVisible, setOrderModalVisible] = useState(false);

  // Data state
  const [results, setResults] = useState([]);
  const [referenceData, setReferenceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState({ ...EMPTY_BOOK_FILTERS });
  const [pendingFilters, setPendingFilters] = useState({ ...EMPTY_BOOK_FILTERS });

  // Load reference data on mount
  useEffect(() => {
    fetchReferenceData();
    fetchResults(1, '', EMPTY_BOOK_FILTERS, 'books', 'newest');
  }, []);

  const fetchReferenceData = async () => {
    try {
      const response = await fetch(ENDPOINTS.books.referenceData);
      const data = await response.json();
      setReferenceData(data);
    } catch (err) {
      console.error('Reference data error:', err);
    }
  };

  const buildQueryString = (pageNum, query, filters, currentView, currentOrder) => {
    const params = new URLSearchParams();
    params.append('page', pageNum);
    if (currentView === 'authors') params.append('view', 'authors');
    if (currentOrder) params.append('order', currentOrder);
    if (query) params.append('search', query);

    if (currentView === 'books') {
      if (filters.genre) params.append('genre', filters.genre);
      if (filters.content_rating) params.append('content_rating', filters.content_rating);
      if (filters.relationship_tag) params.append('relationship_tag', filters.relationship_tag);
      if (filters.keyword) params.append('keyword', filters.keyword);
      if (filters.is_new) params.append('is_new', 'true');
      if (filters.is_complete) params.append('is_complete', 'true');
      if (filters.is_featured) params.append('is_featured', 'true');
    } else {
      if (filters.is_featured) params.append('is_featured', 'true');
      if (filters.is_founding_author) params.append('is_founding_author', 'true');
    }

    return params.toString();
  };

  const fetchResults = async (pageNum, query, filters, currentView, currentOrder, append = false) => {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      const qs = buildQueryString(pageNum, query, filters, currentView, currentOrder);
      const response = await fetch(`${ENDPOINTS.books.public}?${qs}`);
      const data = await response.json();
      setResults((prev) => (append ? [...prev, ...data.results] : data.results));
      setTotalPages(data.total_pages);
      setPage(pageNum);
    } catch (err) {
      console.error('Results fetch error:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleViewChange = (newView) => {
    if (newView === view) return;
    const emptyFilters = newView === 'books' ? { ...EMPTY_BOOK_FILTERS } : { ...EMPTY_AUTHOR_FILTERS };
    const newOrder = DEFAULT_ORDER[newView];
    setResults([]);
    setView(newView);
    setOrder(newOrder);
    setSearchQuery('');
    setActiveFilters(emptyFilters);
    setPendingFilters(emptyFilters);
    setFilterModalVisible(false);
    setOrderModalVisible(false);
    fetchResults(1, '', emptyFilters, newView, newOrder);
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    fetchResults(1, text, activeFilters, view, order);
  };

  const handleOrderChange = (newOrder) => {
    setOrder(newOrder);
    setOrderModalVisible(false);
    fetchResults(1, searchQuery, activeFilters, view, newOrder);
  };

  const handleApplyFilters = () => {
    setActiveFilters(pendingFilters);
    setFilterModalVisible(false);
    fetchResults(1, searchQuery, pendingFilters, view, order);
  };

  const handleClearFilters = () => {
    const cleared = view === 'books' ? { ...EMPTY_BOOK_FILTERS } : { ...EMPTY_AUTHOR_FILTERS };
    setPendingFilters(cleared);
    setActiveFilters(cleared);
    setFilterModalVisible(false);
    fetchResults(1, searchQuery, cleared, view, order);
  };

  const handleLoadMore = () => {
    if (page < totalPages && !loadingMore) {
      fetchResults(page + 1, searchQuery, activeFilters, view, order, true);
    }
  };

  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;
  const orderOptions = view === 'authors' ? AUTHOR_ORDER_OPTIONS : BOOK_ORDER_OPTIONS;
  const currentOrderLabel = orderOptions.find((o) => o.value === order)?.label ?? '';

  const renderBook = ({ item }) => {
    return (
      <TouchableOpacity style={styles.bookCard} onPress={() => router.navigate(`/(protected)/book/${item.id}`)}>
        <Image
          source={{ uri: getMediaUrl(item.cover_image) }}
          style={styles.coverImage}
          resizeMode="cover"
        />
        <View style={styles.bookInfo}>
          <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.bookAuthor}>by {item.author.display_name}</Text>
          <View style={styles.bookMeta}>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>{item.content_rating.code}</Text>
            </View>
            <Text style={styles.metaText}>{item.published_chapter_count} chapters</Text>
            {item.is_new && <Text style={styles.newBadge}>NEW</Text>}
            {item.is_complete && <Text style={styles.completeBadge}>COMPLETE</Text>}
          </View>
          {item.genres.length > 0 && (
            <Text style={styles.genres} numberOfLines={1}>
              {item.genres.map(g => g.name).join(' · ')}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderAuthor = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.authorCard}
        onPress={() => router.push(`/(protected)/(reader-tabs)/author/${item.username}`)}
      >
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
            <Text style={styles.authorName} numberOfLines={1}>{item.display_name}</Text>
            {item.is_founding_author && (
              <Text style={styles.foundingBadge}>FOUNDING</Text>
            )}
          </View>
          {item.bio ? (
            <Text style={styles.authorBio} numberOfLines={2}>{item.bio}</Text>
          ) : null}
          <Text style={styles.authorBookCount}>
            {item.book_count} {item.book_count === 1 ? 'book' : 'books'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFilterSection = (title, items, filterKey, labelKey = 'name') => (
    <View style={styles.filterSection}>
      <Text style={styles.filterSectionTitle}>{title}</Text>
      <View style={styles.filterChips}>
        {items?.map((item) => {
          const isSelected = pendingFilters[filterKey] === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.filterChip, isSelected && styles.filterChipActive]}
              onPress={() => setPendingFilters(prev => ({
                ...prev,
                [filterKey]: isSelected ? null : item.id,
              }))}
            >
              <Text style={[styles.filterChipText, isSelected && styles.filterChipTextActive]}>
                {item[labelKey]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const renderToggleFilter = (label, filterKey) => (
    <TouchableOpacity
      style={styles.toggleRow}
      onPress={() => setPendingFilters(prev => ({ ...prev, [filterKey]: !prev[filterKey] }))}
    >
      <Text style={styles.toggleLabel}>{label}</Text>
      <View style={[styles.toggleBox, pendingFilters[filterKey] && styles.toggleBoxActive]}>
        {pendingFilters[filterKey] && <Check color={colors.background} size={14} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Browse our Library</Text>
      </View>

      {/* Books / Authors toggle */}
      <View style={styles.viewToggleRow}>
        <TouchableOpacity
          style={[styles.viewToggleBtn, view === 'books' && styles.viewToggleBtnActive]}
          onPress={() => handleViewChange('books')}
        >
          <Text style={[styles.viewToggleText, view === 'books' && styles.viewToggleTextActive]}>
            Books
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.viewToggleBtn, view === 'authors' && styles.viewToggleBtnActive]}
          onPress={() => handleViewChange('authors')}
        >
          <Text style={[styles.viewToggleText, view === 'authors' && styles.viewToggleTextActive]}>
            Authors
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <SearchIcon color={colors.secondary} size={18} />
          <TextInput
            style={styles.searchInput}
            placeholder={view === 'authors' ? 'Search authors...' : 'Search books, authors...'}
            placeholderTextColor={colors.secondary}
            value={searchQuery}
            onChangeText={handleSearch}
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <X color={colors.secondary} size={16} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.orderButton} onPress={() => setOrderModalVisible(true)}>
          <Text style={styles.orderButtonText} numberOfLines={1}>{currentOrderLabel}</Text>
          <ChevronDown color={colors.primary} size={16} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, activeFilterCount > 0 && styles.filterButtonActive]}
          onPress={() => {
            setPendingFilters({ ...activeFilters });
            setFilterModalVisible(true);
          }}
        >
          <SlidersHorizontal color={activeFilterCount > 0 ? colors.background : colors.primary} size={20} />
          {activeFilterCount > 0 && (
            <Text style={styles.filterCount}>{activeFilterCount}</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Results List */}
      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => view === 'books' ? item.id.toString() : `${item.author_type}-${item.id}`}
          renderItem={view === 'books' ? renderBook : renderAuthor}
          contentContainerStyle={styles.list}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loadingMore ? <ActivityIndicator color={colors.primary} style={{ padding: 16 }} /> : null}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No {view === 'books' ? 'books' : 'authors'} found.</Text>
          }
        />
      )}

      {/* Order Modal */}
      <Modal
        visible={orderModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setOrderModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.orderModalOverlay}
          activeOpacity={1}
          onPress={() => setOrderModalVisible(false)}
        >
          <View style={styles.orderModalContent}>
            {orderOptions.map((opt) => {
              const isSelected = order === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.orderOption, isSelected && styles.orderOptionActive]}
                  onPress={() => handleOrderChange(opt.value)}
                >
                  <Text style={[styles.orderOptionText, isSelected && styles.orderOptionTextActive]}>
                    {opt.label}
                  </Text>
                  {isSelected && <Check color={colors.primary} size={16} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Filter Modal */}
      <Modal
        visible={filterModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter {view === 'books' ? 'Books' : 'Authors'}</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <X color={colors.white} size={22} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {view === 'books' ? (
                <>
                  {renderFilterSection('Genre', referenceData?.genres, 'genre')}
                  {renderFilterSection('Content Rating', referenceData?.content_ratings, 'content_rating', 'code')}
                  {renderFilterSection('Relationship', referenceData?.relationship_tags, 'relationship_tag')}
                  {renderFilterSection('Keywords', referenceData?.keywords, 'keyword')}

                  <View style={styles.filterSection}>
                    <Text style={styles.filterSectionTitle}>Status</Text>
                    {renderToggleFilter('New Releases', 'is_new')}
                    {renderToggleFilter('Complete', 'is_complete')}
                    {renderToggleFilter('Featured', 'is_featured')}
                  </View>
                </>
              ) : (
                <View style={styles.filterSection}>
                  <Text style={styles.filterSectionTitle}>Status</Text>
                  {renderToggleFilter('Featured', 'is_featured')}
                  {renderToggleFilter('Founding Author', 'is_founding_author')}
                </View>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.clearButton} onPress={handleClearFilters}>
                <Text style={styles.clearButtonText}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyButton} onPress={handleApplyFilters}>
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
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
  header: {
    display: 'flex',
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  headerText: {
    color: colors.white,
    fontSize: 24,
    fontFamily: fonts.meriendaRegular,
  },
  viewToggleRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  viewToggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.secondary,
    alignItems: 'center',
  },
  viewToggleBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  viewToggleText: {
    color: colors.secondary,
    fontFamily: fonts.meriendaBold,
    fontSize: 13,
  },
  viewToggleTextActive: {
    color: colors.background,
  },
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 10,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1c2e',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.secondary,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: colors.white,
    fontFamily: fonts.meriendaRegular,
    fontSize: 14,
  },
  orderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1c2e',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.secondary,
    gap: 4,
    maxWidth: 110,
  },
  orderButtonText: {
    color: colors.white,
    fontFamily: fonts.meriendaRegular,
    fontSize: 12,
    flexShrink: 1,
  },
  filterButton: {
    backgroundColor: '#1a1c2e',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterCount: {
    color: colors.background,
    fontFamily: fonts.meriendaBold,
    fontSize: 12,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  bookCard: {
    flexDirection: 'row',
    backgroundColor: '#1a1c2e',
    borderRadius: 10,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2a2c3e',
  },
  coverImage: {
    width: 80,
    height: 110,
  },
  bookInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
    gap: 4,
  },
  bookTitle: {
    color: colors.white,
    fontFamily: fonts.fredericka,
    fontSize: 15,
  },
  bookAuthor: {
    color: colors.secondary,
    fontFamily: fonts.meriendaRegular,
    fontSize: 12,
  },
  bookMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  ratingBadge: {
    backgroundColor: '#2a2c3e',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ratingText: {
    color: colors.primary,
    fontFamily: fonts.meriendaBold,
    fontSize: 11,
  },
  metaText: {
    color: colors.secondary,
    fontFamily: fonts.meriendaRegular,
    fontSize: 11,
  },
  newBadge: {
    color: colors.background,
    backgroundColor: colors.primary,
    fontFamily: fonts.meriendaBold,
    fontSize: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  completeBadge: {
    color: colors.background,
    backgroundColor: '#7ec8a0',
    fontFamily: fonts.meriendaBold,
    fontSize: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  genres: {
    color: colors.secondary,
    fontFamily: fonts.meriendaRegular,
    fontSize: 11,
    marginTop: 2,
  },
  // Author cards
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
  emptyText: {
    color: colors.secondary,
    fontFamily: fonts.meriendaRegular,
    textAlign: 'center',
    marginTop: 40,
  },
  // Order dropdown modal
  orderModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 160,
    paddingRight: 16,
  },
  orderModalContent: {
    backgroundColor: '#1a1c2e',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2a2c3e',
    paddingVertical: 6,
    minWidth: 160,
  },
  orderOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  orderOptionActive: {
    backgroundColor: '#2a2c3e',
  },
  orderOptionText: {
    color: colors.secondary,
    fontFamily: fonts.meriendaRegular,
    fontSize: 13,
  },
  orderOptionTextActive: {
    color: colors.white,
    fontFamily: fonts.meriendaBold,
  },
  // Filter modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1a1c2e',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    color: colors.white,
    fontFamily: fonts.fredericka,
    fontSize: 20,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterSectionTitle: {
    color: colors.primary,
    fontFamily: fonts.meriendaBold,
    fontSize: 13,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  filterChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    color: colors.secondary,
    fontFamily: fonts.meriendaRegular,
    fontSize: 13,
  },
  filterChipTextActive: {
    color: colors.background,
    fontFamily: fonts.meriendaBold,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2c3e',
  },
  toggleLabel: {
    color: colors.white,
    fontFamily: fonts.meriendaRegular,
    fontSize: 14,
  },
  toggleBox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleBoxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  clearButton: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.secondary,
    alignItems: 'center',
  },
  clearButtonText: {
    color: colors.secondary,
    fontFamily: fonts.meriendaBold,
  },
  applyButton: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  applyButtonText: {
    color: colors.background,
    fontFamily: fonts.meriendaBold,
  },
});