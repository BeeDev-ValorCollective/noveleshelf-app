import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import GradientButton from '../../GradientButton';

export default function PurchaseQuillsButton() {
    const router = useRouter();

    const handlePurchaseQuills = () => {
        router.push('/(protected)/(reader-tabs)/quill-bundles');
    };

    return (
        <View style={styles.container}>
            <GradientButton title="Purchase Quills" onPress={handlePurchaseQuills} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 12,
    },
});