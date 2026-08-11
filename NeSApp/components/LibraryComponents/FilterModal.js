import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { X } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import FilterChipSection from './FilterChipSection';
import ToggleFilterRow from './ToggleFilterRow';

export default function FilterModal({
    visible,
    view,
    referenceData,
    pendingFilters,
    setPendingFilters,
    onClose,
    onApply,
    onClear,
}) {
    const toggleChip = (filterKey, id) => {
        setPendingFilters((prev) => ({
            ...prev,
            [filterKey]: prev[filterKey] === id ? null : id,
        }));
    };

    const toggleBoolean = (filterKey) => {
        setPendingFilters((prev) => ({
            ...prev,
            [filterKey]: !prev[filterKey],
        }));
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>
                            Filter {view === 'books' ? 'Books' : 'Authors'}
                        </Text>
                        <TouchableOpacity onPress={onClose}>
                            <X color={colors.white} size={22} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {view === 'books' ? (
                            <>
                                <FilterChipSection
                                    title="Genre"
                                    items={referenceData?.genres}
                                    selectedId={pendingFilters.genre}
                                    onToggle={(id) => toggleChip('genre', id)}
                                />
                                <FilterChipSection
                                    title="Content Rating"
                                    items={referenceData?.content_ratings}
                                    selectedId={pendingFilters.content_rating}
                                    onToggle={(id) =>
                                        toggleChip('content_rating', id)
                                    }
                                    labelKey="code"
                                />
                                <FilterChipSection
                                    title="Relationship"
                                    items={referenceData?.relationship_tags}
                                    selectedId={pendingFilters.relationship_tag}
                                    onToggle={(id) =>
                                        toggleChip('relationship_tag', id)
                                    }
                                />
                                <FilterChipSection
                                    title="Keywords"
                                    items={referenceData?.keywords}
                                    selectedId={pendingFilters.keyword}
                                    onToggle={(id) => toggleChip('keyword', id)}
                                />

                                <View style={styles.filterSection}>
                                    <Text style={styles.filterSectionTitle}>
                                        Status
                                    </Text>
                                    <ToggleFilterRow
                                        label="New Releases"
                                        value={pendingFilters.is_new}
                                        onToggle={() => toggleBoolean('is_new')}
                                    />
                                    <ToggleFilterRow
                                        label="Complete"
                                        value={pendingFilters.is_complete}
                                        onToggle={() =>
                                            toggleBoolean('is_complete')
                                        }
                                    />
                                    <ToggleFilterRow
                                        label="Featured"
                                        value={pendingFilters.is_featured}
                                        onToggle={() =>
                                            toggleBoolean('is_featured')
                                        }
                                    />
                                </View>
                            </>
                        ) : (
                            <View style={styles.filterSection}>
                                <Text style={styles.filterSectionTitle}>
                                    Status
                                </Text>
                                <ToggleFilterRow
                                    label="Featured"
                                    value={pendingFilters.is_featured}
                                    onToggle={() => toggleBoolean('is_featured')}
                                />
                                <ToggleFilterRow
                                    label="Founding Author"
                                    value={pendingFilters.is_founding_author}
                                    onToggle={() =>
                                        toggleBoolean('is_founding_author')
                                    }
                                />
                            </View>
                        )}
                    </ScrollView>

                    <View style={styles.modalFooter}>
                        <TouchableOpacity
                            style={styles.clearButton}
                            onPress={onClear}
                        >
                            <Text style={styles.clearButtonText}>
                                Clear All
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.applyButton}
                            onPress={onApply}
                        >
                            <Text style={styles.applyButtonText}>
                                Apply Filters
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
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
    // used directly here for the "Status" toggle group heading
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