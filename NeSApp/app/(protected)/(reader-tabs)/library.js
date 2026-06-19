// app/(protected)/(reader-tabs)/search.js
import { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableOpacity,
  StyleSheet, Image, Modal, ScrollView, ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { Search as SearchIcon, SlidersHorizontal, X, Check } from 'lucide-react-native';
import { colors } from '../../../constants/colors';
import { fonts } from '../../../constants/fonts';
import { ENDPOINTS } from '../../../utils/api';
import { getMediaUrl } from '../../../utils/mediaUrl';

export default function Library() {

  const router = useRouter();
  // Data state
  const [books, setBooks] = useState([]);
  const [referenceData, setReferenceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    genre: null,
    content_rating: null,
    relationship_tag: null,
    keyword: null,
    is_new: false,
    is_complete: false,
    is_featured: false,
  });
  const [pendingFilters, setPendingFilters] = useState({ ...activeFilters });

  // Load reference data on mount
  useEffect(() => {
    fetchReferenceData();
    fetchBooks(1, '', activeFilters);
  }, []);

  const fetchReferenceData = async () => {
    try {
      console.log('Reference data URL:', ENDPOINTS.books.referenceData)
      const response = await fetch(ENDPOINTS.books.referenceData);
      console.log('Reference data status:', response.status)
      const data = await response.json();
      setReferenceData(data);
    } catch (err) {
      console.error('Reference data error:', err);
    }
  };

  const buildQueryString = (pageNum, query, filters) => {
    const params = new URLSearchParams();
    params.append('page', pageNum);
    if (query) params.append('search', query);
    if (filters.genre) params.append('genre', filters.genre);
    if (filters.content_rating) params.append('content_rating', filters.content_rating);
    if (filters.relationship_tag) params.append('relationship_tag', filters.relationship_tag);
    if (filters.keyword) params.append('keyword', filters.keyword);
    if (filters.is_new) params.append('is_new', 'true');
    if (filters.is_complete) params.append('is_complete', 'true');
    if (filters.is_featured) params.append('is_featured', 'true');
    return params.toString();
  };

  const fetchBooks = async (pageNum, query, filters, append = false) => {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      const qs = buildQueryString(pageNum, query, filters);
      const response = await fetch(`${ENDPOINTS.books.public}?${qs}`);
      const data = await response.json();
      setBooks(append ? (prev) => [...prev, ...data.results] : data.results);
      setTotalPages(data.total_pages);
      setPage(pageNum);
    } catch (err) {
      console.error('Books fetch error:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    fetchBooks(1, text, activeFilters);
  };

  const handleApplyFilters = () => {
    setActiveFilters(pendingFilters);
    setFilterModalVisible(false);
    fetchBooks(1, searchQuery, pendingFilters);
  };

  const handleClearFilters = () => {
    const cleared = {
      genre: null,
      content_rating: null,
      relationship_tag: null,
      keyword: null,
      is_new: false,
      is_complete: false,
      is_featured: false,
    };
    setPendingFilters(cleared);
    setActiveFilters(cleared);
    setFilterModalVisible(false);
    fetchBooks(1, searchQuery, cleared);
  };

  const handleLoadMore = () => {
    if (page < totalPages && !loadingMore) {
      fetchBooks(page + 1, searchQuery, activeFilters, true);
    }
  };

  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;

  const renderBook = ({ item }) => {
    console.log('Cover URL:', getMediaUrl(item.cover_image));
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


      {/* Search Bar */}
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <SearchIcon color={colors.secondary} size={18} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search books, authors..."
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

      {/* Book List */}
      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderBook}
          contentContainerStyle={styles.list}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loadingMore ? <ActivityIndicator color={colors.primary} style={{ padding: 16 }} /> : null}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No books found.</Text>
          }
        />
      )}

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
              <Text style={styles.modalTitle}>Filter Books</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <X color={colors.white} size={22} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
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
  emptyText: {
    color: colors.secondary,
    fontFamily: fonts.meriendaRegular,
    textAlign: 'center',
    marginTop: 40,
  },
  // Modal
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