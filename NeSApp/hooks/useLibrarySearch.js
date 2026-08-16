// hooks/useLibrarySearch.js
import { useState, useEffect } from 'react';
import { ENDPOINTS } from '../utils/api';

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

export default function useLibrarySearch() {
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

    useEffect(() => {
        fetchReferenceData();
        fetchResults(1, '', EMPTY_BOOK_FILTERS, 'books', 'newest');
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const openFilterModal = () => {
        setPendingFilters({ ...activeFilters });
        setFilterModalVisible(true);
    };

    const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;
    const orderOptions = view === 'authors' ? AUTHOR_ORDER_OPTIONS : BOOK_ORDER_OPTIONS;
    const currentOrderLabel = orderOptions.find((o) => o.value === order)?.label ?? '';

    return {
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
    };
}