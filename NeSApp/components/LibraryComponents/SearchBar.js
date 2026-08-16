import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Search as SearchIcon, X } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';

export default function SearchBar({ value, onChangeText, placeholder }) {
    return (
        <View style={styles.searchBar}>
            <SearchIcon color={colors.secondary} size={18} />

            <TextInput
                style={styles.searchInput}
                placeholder={placeholder}
                placeholderTextColor={colors.secondary}
                value={value}
                onChangeText={onChangeText}
                autoCapitalize="none"
            />

            {value.length > 0 && (
                <TouchableOpacity onPress={() => onChangeText('')}>
                    <X color={colors.secondary} size={16} />
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
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
});