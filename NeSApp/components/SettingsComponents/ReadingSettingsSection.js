// components/SettingsComponents/ReadingSettingsSection.js
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import useAuthStore from '../../store/authStore';
import useReadingSettingsStore, { THEMES } from '../../store/readingSettingsStore';

const THEME_OPTIONS = [
  { key: 'light', label: 'Light' },
  { key: 'dark', label: 'Dark' },
  { key: 'sepia', label: 'Sepia' },
  { key: 'amoled', label: 'AMOLED' },
];

export default function ReadingSettingsSection() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const profile = useAuthStore((state) => state.user?.profile);

  const theme = useReadingSettingsStore((state) => state.theme);
  const fontSize = useReadingSettingsStore((state) => state.fontSize);
  const hydrateFromProfile = useReadingSettingsStore((state) => state.hydrateFromProfile);
  const setTheme = useReadingSettingsStore((state) => state.setTheme);
  const setFontSize = useReadingSettingsStore((state) => state.setFontSize);

  const [sliderValue, setSliderValue] = useState(fontSize);

  useEffect(() => {
    hydrateFromProfile(profile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  useEffect(() => {
    setSliderValue(fontSize);
  }, [fontSize]);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Reading Settings</Text>

      <Text style={styles.label}>Theme</Text>
      <View style={styles.swatchRow}>
        {THEME_OPTIONS.map((option) => {
          const swatchColors = THEMES[option.key];
          const isSelected = theme === option.key;

          return (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.swatch,
                { backgroundColor: swatchColors.background },
                isSelected && styles.swatchSelected,
              ]}
              onPress={() => setTheme(option.key, accessToken)}
            >
              <Text style={[styles.swatchLabel, { color: swatchColors.text }]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.label}>Font size: {Math.round(sliderValue)}pt</Text>
      <Slider
        style={styles.slider}
        minimumValue={12}
        maximumValue={32}
        step={1}
        value={fontSize}
        minimumTrackTintColor={colors.primary}
        maximumTrackTintColor={colors.secondary}
        thumbTintColor={colors.primary}
        onValueChange={setSliderValue}
        onSlidingComplete={(value) => setFontSize(value, accessToken)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 24,
  },
  sectionTitle: {
    color: colors.white,
    fontFamily: fonts.fredericka,
    fontSize: 18,
    marginBottom: 12,
  },
  label: {
    color: colors.secondary,
    fontFamily: fonts.meriendaRegular,
    fontSize: 13,
    marginBottom: 8,
    marginTop: 12,
  },
  swatchRow: {
    flexDirection: 'row',
    gap: 10,
  },
  swatch: {
    width: 70,
    height: 56,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatchSelected: {
    borderWidth: 4,
    borderColor: colors.tertiary,
  },
  swatchLabel: {
    fontFamily: fonts.meriendaRegular,
    fontSize: 11,
  },
  slider: {
    width: '100%',
    height: 40,
  },
});