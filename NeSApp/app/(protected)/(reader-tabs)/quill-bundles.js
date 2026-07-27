// app/(protected)/(reader-tabs)/quillBundles.js
import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { ENDPOINTS } from '../../../utils/api';
import { sendToVite } from '../../../utils/authHandoff';
import useAuthStore from '../../../store/authStore';
import { colors } from '../../../constants/colors';
import { fonts } from '../../../constants/fonts';

export default function QuillBundles() {
  const accessToken = useAuthStore((state) => state.accessToken);

  const [bundles, setBundles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBundles = async () => {
      try {
        const res = await fetch(ENDPOINTS.currency.listQuillBundles, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await res.json();
        if (res.ok) {
          setBundles(data);
        } else {
          setError('Could not load Quill bundles.');
        }
      } catch {
        setError('Unable to connect. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBundles();
  }, [accessToken]);

  const handlePurchase = () => {
    // Return here (not the dashboard) once the reader finishes on Vite.
    sendToVite('/purchase-quills', '(protected)/(reader-tabs)/dashboard');
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.heading}>Get More Quills</Text>
      <Text style={styles.subheading}>
        Choose a bundle to unlock more chapters and support the authors you love.
      </Text>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <View style={styles.bundleList}>
        {bundles.map((bundle) => (
          <View key={bundle.id} style={styles.bundleCard}>
            {bundle.bonus_percent && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>+{bundle.bonus_percent}% Bonus</Text>
              </View>
            )}
            <Text style={styles.bundleName}>{bundle.name}</Text>
            <Text style={styles.bundleQuills}>{bundle.quills.toLocaleString()} Quills</Text>
            <Text style={styles.bundlePrice}>${(bundle.price_cents / 100).toFixed(2)}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.purchaseButton} onPress={handlePurchase}>
        <Text style={styles.purchaseButtonText}>Purchase on Website</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    color: colors.white,
    fontFamily: fonts.fredericka,
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  subheading: {
    color: colors.secondary,
    fontFamily: fonts.meriendaRegular,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  errorText: {
    color: colors.primary,
    fontFamily: fonts.meriendaRegular,
    marginBottom: 16,
    textAlign: 'center',
  },
  bundleList: {
    width: '100%',
    gap: 14,
  },
  bundleCard: {
    position: 'relative',
    backgroundColor: '#1a1c2e',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(224, 85, 85, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  badgeText: {
    color: colors.primary,
    fontFamily: fonts.meriendaBold,
    fontSize: 11,
  },
  bundleName: {
    color: colors.white,
    fontFamily: fonts.fredericka,
    fontSize: 17,
    marginBottom: 4,
  },
  bundleQuills: {
    color: colors.primary,
    fontFamily: fonts.meriendaBold,
    fontSize: 20,
    marginBottom: 2,
  },
  bundlePrice: {
    color: colors.secondary,
    fontFamily: fonts.meriendaRegular,
    fontSize: 14,
  },
  purchaseButton: {
    marginTop: 24,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  purchaseButtonText: {
    color: colors.background,
    fontFamily: fonts.meriendaBold,
    fontSize: 15,
  },
});