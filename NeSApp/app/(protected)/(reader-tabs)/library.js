// app/(protected)/(reader-tabs)/library.js
import { View, FlatList, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../../constants/colors';
import { fonts } from '../../../constants/fonts';
import HeroComponent from '../../../components/HeroComponent';
import useLibrarySearch from '../../../hooks/useLibrarySearch';

import ViewToggle from '../../../components/LibraryComponents/ViewToggle';
import SearchBar from '../../../components/LibraryComponents/SearchBar';
import OrderButton from '../../../components/LibraryComponents/OrderButton';
import OrderModal from '../../../components/LibraryComponents/OrderModal';
import FilterButton from '../../../components/LibraryComponents/FilterButton';
import FilterModal from '../../../components/LibraryComponents/FilterModal';
import BookCard from '../../../components/LibraryComponents/BookCard';
import AuthorCard from '../../../components/LibraryComponents/AuthorCard';

export default function Library() {
  const router = useRouter();

  const {
    view,
    order,
    orderModalVisible,
    setOrderModalVisible,
    results,
    referenceData,
    loading,
    loadingMore,
    searchQuery,
    filterModalVisible,
    setFilterModalVisible,
    pendingFilters,
    setPendingFilters,
    activeFilterCount,
    orderOptions,
    currentOrderLabel,
    handleViewChange,
    handleSearch,
    handleOrderChange,
    handleApplyFilters,
    handleClearFilters,
    handleLoadMore,
    openFilterModal,
  } = useLibrarySearch();

  return (
    <View style={styles.container}>
      <HeroComponent title="Browse Our Library" />

      <ViewToggle view={view} onChange={handleViewChange} />

      <View style={styles.searchRow}>
        <SearchBar
          value={searchQuery}
          onChangeText={handleSearch}
          placeholder={view === 'authors' ? 'Search authors...' : 'Search books, authors...'}
        />

        <OrderButton
          label={currentOrderLabel}
          onPress={() => setOrderModalVisible(true)}
        />

        <FilterButton
          activeCount={activeFilterCount}
          onPress={openFilterModal}
        />
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) =>
            view === 'books' ? item.id.toString() : `${item.author_type}-${item.id}`
          }
          renderItem={({ item }) =>
            view === 'books' ? (
              <BookCard
                item={item}
                onPress={() => router.navigate(`/(protected)/book/${item.id}`)}
              />
            ) : (
              <AuthorCard
                item={item}
                onPress={() =>
                  router.push(`/(protected)/(reader-tabs)/author/${item.username}`)
                }
              />
            )
          }
          contentContainerStyle={styles.list}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator color={colors.primary} style={{ padding: 16 }} />
            ) : null
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No {view === 'books' ? 'books' : 'authors'} found.
            </Text>
          }
        />
      )}

      <OrderModal
        visible={orderModalVisible}
        onClose={() => setOrderModalVisible(false)}
        options={orderOptions}
        selectedValue={order}
        onSelect={handleOrderChange}
      />

      <FilterModal
        visible={filterModalVisible}
        view={view}
        referenceData={referenceData}
        pendingFilters={pendingFilters}
        setPendingFilters={setPendingFilters}
        onClose={() => setFilterModalVisible(false)}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
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
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 10,
    alignItems: 'center',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  emptyText: {
    color: colors.secondary,
    fontFamily: fonts.meriendaRegular,
    textAlign: 'center',
    marginTop: 40,
  },
});