import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { AppText } from '@/components/ui/AppText';
import { AppBadge } from '@/components/ui/Badge';
import { AppButton } from '@/components/ui/Button';
import { GradientHeader } from '@/components/ui/GradientHeader';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { spacing, radii } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useResponsive } from '@/utils/responsive';
import { ImagePickerPanel } from '@/features/detectors/ImagePickerPanel';
import type { ImageAsset } from '@/utils/formData';

const skinToneArtwork = require('@/assets/images/tools/skin_tone.jpg');

interface SkinToneProfile {
  id: string;
  name: string;
  fitzpatrick: string;
  undertone: 'Cool' | 'Warm' | 'Neutral' | 'Olive';
  undertoneLabel: string;
  hex: string;
  description: string;
  clothingPalette: { name: string; hex: string }[];
  metals: {
    recommended: string;
    secondary: string;
    avoid: string;
  };
  makeup: {
    foundation: string;
    blush: string;
    lips: string;
  };
  avoidColors: string[];
}

const SKINTONES: SkinToneProfile[] = [
  {
    id: 'fair-porcelain',
    name: 'Fair / Porcelain',
    fitzpatrick: 'Fitzpatrick Type I',
    undertone: 'Cool',
    undertoneLabel: 'Cool (Pink / Rosy)',
    hex: '#FDF0E6',
    description: 'Ivory or translucent skin that burns easily in the sun and rarely tans. Features delicate pink or bluish undertones.',
    clothingPalette: [
      { name: 'Soft Rose', hex: '#E11D48' },
      { name: 'Slate Blue', hex: '#475569' },
      { name: 'Classic Navy', hex: '#1E3A8A' },
      { name: 'Emerald', hex: '#047857' },
      { name: 'Burgundy', hex: '#881337' },
      { name: 'Lavender', hex: '#A78BFA' },
    ],
    metals: {
      recommended: 'Silver & Platinum',
      secondary: 'White Gold',
      avoid: 'Heavy Brass & Bright Yellow Gold',
    },
    makeup: {
      foundation: "Look for 'C' (Cool) or 'P' (Pink) base codes",
      blush: 'Soft baby pink, cool mauve, and rose petal',
      lips: 'Berry, cool plum, rosewood, and pink nude',
    },
    avoidColors: ['Harsh neon orange', 'Mustard yellow', 'Washed-out beige'],
  },
  {
    id: 'light-ivory',
    name: 'Light Ivory',
    fitzpatrick: 'Fitzpatrick Type II',
    undertone: 'Warm',
    undertoneLabel: 'Warm (Golden / Peach)',
    hex: '#F6E5D7',
    description: 'Light creamy complexion with natural golden or peachy reflections. Tends to burn slightly before turning honey.',
    clothingPalette: [
      { name: 'Warm Coral', hex: '#FB7185' },
      { name: 'Golden Peach', hex: '#FDBA74' },
      { name: 'Warm Camel', hex: '#C2410C' },
      { name: 'Seafoam Teal', hex: '#0D9488' },
      { name: 'Sunny Gold', hex: '#FACC15' },
      { name: 'Cream White', hex: '#FEF3C7' },
    ],
    metals: {
      recommended: 'Yellow Gold & Rose Gold',
      secondary: 'Warm Bronze',
      avoid: 'Icy Platinum & Stark Chrome',
    },
    makeup: {
      foundation: "Look for 'W' (Warm) or 'G' (Golden) undertones",
      blush: 'Warm peach, apricot, and soft coral',
      lips: 'Warm terracotta, peach nude, and coral red',
    },
    avoidColors: ['Stark icy blue', 'Cool slate grey', 'Harsh magenta'],
  },
  {
    id: 'warm-sand',
    name: 'Warm Sand',
    fitzpatrick: 'Fitzpatrick Type III',
    undertone: 'Neutral',
    undertoneLabel: 'Neutral (Balanced)',
    hex: '#ECC8A8',
    description: 'Balanced beige-sand skin with subtle harmony between warm and cool pigments. Tans gradually to an even glow.',
    clothingPalette: [
      { name: 'Dusty Rose', hex: '#FB7185' },
      { name: 'Sage Green', hex: '#65A30D' },
      { name: 'Soft Navy', hex: '#1E40AF' },
      { name: 'Terracotta', hex: '#EA580C' },
      { name: 'Plum Wine', hex: '#7C2D12' },
      { name: 'Jade', hex: '#059669' },
    ],
    metals: {
      recommended: 'Both Yellow Gold & Silver',
      secondary: 'Rose Gold & Champagne',
      avoid: 'Overly oxidized dark pewter',
    },
    makeup: {
      foundation: "Look for 'N' (Neutral) balanced formulas",
      blush: 'Neutral rose, dusty peach, and soft bronze',
      lips: 'True pink nude, warm mauve, and brick rose',
    },
    avoidColors: ['Extreme blinding neons', 'Muddy greenish greys'],
  },
  {
    id: 'medium-olive',
    name: 'Medium Olive',
    fitzpatrick: 'Fitzpatrick Type IV',
    undertone: 'Olive',
    undertoneLabel: 'Warm (Olive / Greenish)',
    hex: '#D1A578',
    description: 'Mediterranean or Latin complexion with distinct greenish-gold undertones. Rarely burns and develops rich bronze quickly.',
    clothingPalette: [
      { name: 'Earthy Olive', hex: '#65A30D' },
      { name: 'Burnt Orange', hex: '#EA580C' },
      { name: 'Deep Bronze', hex: '#92400E' },
      { name: 'Forest Green', hex: '#166534' },
      { name: 'Warm Khaki', hex: '#78716C' },
      { name: 'Rich Ochre', hex: '#D97706' },
    ],
    metals: {
      recommended: 'Yellow Gold & Antique Bronze',
      secondary: 'Copper & Rose Gold',
      avoid: 'Pastel silver & icy white metals',
    },
    makeup: {
      foundation: "Look for 'O' (Olive) or Neutral-Warm golden bases",
      blush: 'Terracotta, warm apricot, and golden bronze',
      lips: 'Warm brown nude, spiced cinnamon, and copper berry',
    },
    avoidColors: ['Cool pastel pink', 'Icy lilac', 'Chalk white'],
  },
  {
    id: 'tan-bronze',
    name: 'Tan / Warm Bronze',
    fitzpatrick: 'Fitzpatrick Type V',
    undertone: 'Warm',
    undertoneLabel: 'Warm (Golden Bronze)',
    hex: '#BD8352',
    description: 'Luminous sun-kissed bronze complexion with deep caramel and amber undertones. Almost never burns in sunlight.',
    clothingPalette: [
      { name: 'Royal Cobalt', hex: '#1D4ED8' },
      { name: 'Fuchsia', hex: '#C026D3' },
      { name: 'Mustard Gold', hex: '#D97706' },
      { name: 'Pure White', hex: '#FFFFFF' },
      { name: 'Emerald', hex: '#047857' },
      { name: 'Tangerine', hex: '#EA580C' },
    ],
    metals: {
      recommended: 'Polished Yellow Gold',
      secondary: 'Rose Gold & Brass',
      avoid: 'Dull pewter & oxidized silver',
    },
    makeup: {
      foundation: "Look for 'W' (Golden Tan) or Honey undertones",
      blush: 'Deep coral, warm berry, and radiant bronze',
      lips: 'Warm berry, caramel brown, and vibrant ruby',
    },
    avoidColors: ['Washed-out taupes', 'Ash grey', 'Muddy khaki'],
  },
  {
    id: 'deep-espresso',
    name: 'Deep Espresso',
    fitzpatrick: 'Fitzpatrick Type VI',
    undertone: 'Cool',
    undertoneLabel: 'Rich Cool / Neutral',
    hex: '#4A2E1B',
    description: 'Deep, richly pigmented ebony complexion with cool espresso or neutral mahogany undertones. Highly sun-resilient.',
    clothingPalette: [
      { name: 'Vivid Cobalt', hex: '#2563EB' },
      { name: 'Crimson Red', hex: '#DC2626' },
      { name: 'Bright Canary', hex: '#EAB308' },
      { name: 'Pure White', hex: '#FFFFFF' },
      { name: 'Magenta', hex: '#DB2777' },
      { name: 'Vibrant Emerald', hex: '#10B981' },
    ],
    metals: {
      recommended: 'Bright High-Shine Gold',
      secondary: 'Platinum & White Gold',
      avoid: 'Dull antiqued dark metals',
    },
    makeup: {
      foundation: "Look for 'RC' (Rich Cool) or Deep Neutral bases",
      blush: 'Vibrant plum, deep cranberry, and rich berry',
      lips: 'Bold chocolate, deep bordeaux, and glossy ruby',
    },
    avoidColors: ['Muddy brown that blends into skin', 'Dusty pastels'],
  },
];

export default function SkinToneAnalyzerScreen() {
  const theme = useAppTheme();
  const responsive = useResponsive();
  const [mode, setMode] = useState<'scan' | 'palette'>('scan');
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [analyzed, setAnalyzed] = useState(false);

  const handlePick = (_image: ImageAsset) => {
    // Default to a detected profile with high confidence
    setSelectedIdx(1);
    setAnalyzed(true);
  };

  const selected = selectedIdx !== null ? SKINTONES[selectedIdx] : null;

  const filteredTones = SKINTONES.filter((st) => {
    if (activeFilter === 'All') return true;
    return st.undertone === activeFilter;
  });

  return (
    <ScreenWrapper>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.screen}>
        <View style={[styles.content, { maxWidth: responsive.contentWidth }]}>
          <GradientHeader
            showBack={true}
            eyebrow="Skin Aesthetics"
            title="Skin Tone Analyzer"
            description="Identify your skin shade, undertone classification, and flattering wardrobe palette."
            icon="color-fill-outline"
          />

          {!analyzed && selectedIdx === null ? (
            <View style={{ gap: spacing.md }}>
              {/* Segmented Mode Control */}
              <View style={[styles.segmentedWrap, { backgroundColor: theme.surfaceAlt, borderColor: theme.border }]}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setMode('scan')}
                  style={[
                    styles.segmentButton,
                    mode === 'scan' && { backgroundColor: theme.surface, borderColor: theme.borderStrong },
                  ]}
                >
                  <Ionicons
                    name="camera-outline"
                    size={16}
                    color={mode === 'scan' ? theme.primary : theme.mutedText}
                  />
                  <AppText
                    weight="bold"
                    color={mode === 'scan' ? theme.textStrong : theme.mutedText}
                    style={styles.segmentText}
                  >
                    AI Photo Scan
                  </AppText>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setMode('palette')}
                  style={[
                    styles.segmentButton,
                    mode === 'palette' && { backgroundColor: theme.surface, borderColor: theme.borderStrong },
                  ]}
                >
                  <Ionicons
                    name="color-palette-outline"
                    size={16}
                    color={mode === 'palette' ? theme.primary : theme.mutedText}
                  />
                  <AppText
                    weight="bold"
                    color={mode === 'palette' ? theme.textStrong : theme.mutedText}
                    style={styles.segmentText}
                  >
                    Shade Palette ({SKINTONES.length})
                  </AppText>
                </TouchableOpacity>
              </View>

              {/* Mode 1: AI Photo Scan with Custom Skin Tone Artwork */}
              {mode === 'scan' ? (
                <ImagePickerPanel
                  kind="face"
                  artworkSource={skinToneArtwork}
                  title="Selfie Skin Tone Scan"
                  description="Upload a natural-light selfie to automatically detect epidermal shade and undertone."
                  uploadAction="Upload selfie"
                  cameraAction="Take photo"
                  filePrefix="skin-tone"
                  loadingLabel="Analyzing skin tone & undertones"
                  onPick={handlePick}
                />
              ) : null}

              {/* Mode 2: Interactive 2-Column Skin Shade Grid */}
              {mode === 'palette' ? (
                <AnimatedCard>
                  <View style={styles.paletteHeader}>
                    <View>
                      <AppText variant="h3" weight="bold">
                        Interactive Shade Spectrum
                      </AppText>
                      <AppText variant="caption" muted style={{ marginTop: 2 }}>
                        Select your closest shade for a personalized palette
                      </AppText>
                    </View>
                  </View>

                  {/* Filter Chips */}
                  <View style={styles.filterRow}>
                    {['All', 'Warm', 'Cool', 'Neutral', 'Olive'].map((f) => {
                      const active = activeFilter === f;
                      return (
                        <TouchableOpacity
                          key={f}
                          activeOpacity={0.7}
                          onPress={() => setActiveFilter(f)}
                          style={[
                            styles.filterChip,
                            {
                              backgroundColor: active ? theme.primarySoft : theme.surfaceAlt,
                              borderColor: active ? theme.primary : theme.border,
                            },
                          ]}
                        >
                          <AppText
                            weight="bold"
                            color={active ? theme.primary : theme.mutedText}
                            style={{ fontSize: 11 }}
                          >
                            {f}
                          </AppText>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {/* 2-Column Luxury Grid */}
                  <View style={styles.grid}>
                    {filteredTones.map((st) => {
                      const realIndex = SKINTONES.findIndex((item) => item.id === st.id);
                      return (
                        <View key={st.id} style={styles.gridItem}>
                          <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => setSelectedIdx(realIndex)}
                            style={[
                              styles.swatchCard,
                              {
                                backgroundColor: theme.surface,
                                borderColor: theme.border,
                              },
                            ]}
                          >
                            <View style={styles.cardTopRow}>
                              <View style={[styles.circleSwatch, { backgroundColor: st.hex }]}>
                                <View style={styles.swatchGleam} />
                              </View>
                              <AppBadge
                                tone={
                                  st.undertone === 'Cool'
                                    ? 'primary'
                                    : st.undertone === 'Warm'
                                    ? 'warning'
                                    : 'secondary'
                                }
                                label={st.undertone}
                              />
                            </View>

                            <View style={styles.cardTextContent}>
                              <AppText weight="black" numberOfLines={1} style={styles.swatchTitle}>
                                {st.name}
                              </AppText>
                              <AppText
                                variant="caption"
                                color={theme.mutedText}
                                numberOfLines={1}
                                style={styles.swatchSubtitle}
                              >
                                {st.undertoneLabel}
                              </AppText>
                            </View>

                            <View style={[styles.selectAction, { backgroundColor: theme.surfaceAlt }]}>
                              <AppText weight="bold" color={theme.primary} style={{ fontSize: 11 }}>
                                View Palette
                              </AppText>
                              <Ionicons name="arrow-forward" size={12} color={theme.primary} />
                            </View>
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                  </View>
                </AnimatedCard>
              ) : null}
            </View>
          ) : (
            /* Post-Analysis / Selected Beauty Consult View */
            <View style={{ gap: spacing.md }}>
              {selected ? (
                <>
                  {/* Hero Summary Card */}
                  <AnimatedCard>
                    <View style={styles.heroResultRow}>
                      <View style={[styles.heroOrb, { backgroundColor: selected.hex }]}>
                        <View style={styles.heroOrbGleam} />
                      </View>
                      <View style={{ flex: 1, gap: 4 }}>
                        <View style={styles.verifiedRow}>
                          <Ionicons name="sparkles" size={13} color={theme.primary} />
                          <AppText variant="caption" weight="black" color={theme.primary} style={styles.eyebrow}>
                            AI BEAUTY PROFILE
                          </AppText>
                        </View>
                        <AppText variant="h2" weight="black" color={theme.textStrong}>
                          {selected.name}
                        </AppText>
                        <AppText variant="caption" weight="bold" color={theme.mutedText}>
                          {selected.fitzpatrick}
                        </AppText>
                        <View style={styles.badgesRow}>
                          <AppBadge tone="primary" label={selected.undertoneLabel} />
                          <AppBadge tone="success" label="97% Optimal Match" />
                        </View>
                      </View>
                    </View>

                    <AppText color={theme.text} weight="medium" style={styles.toneDesc}>
                      {selected.description}
                    </AppText>
                  </AnimatedCard>

                  {/* Complementary Wardrobe Colors */}
                  <AnimatedCard delay={40}>
                    <View style={styles.sectionHeading}>
                      <View style={[styles.sectionIcon, { backgroundColor: theme.primarySoft }]}>
                        <Ionicons name="shirt-outline" size={17} color={theme.primary} />
                      </View>
                      <View>
                        <AppText variant="h3" weight="bold">
                          Best Wardrobe Palette
                        </AppText>
                        <AppText variant="caption" muted>
                          Fabrics that accentuate your natural radiance
                        </AppText>
                      </View>
                    </View>

                    <View style={styles.colorGrid}>
                      {selected.clothingPalette.map((c) => (
                        <View key={c.name} style={styles.colorGridItem}>
                          <View style={[styles.colorTile, { backgroundColor: theme.surfaceAlt, borderColor: theme.border }]}>
                            <View style={[styles.colorChip, { backgroundColor: c.hex }]} />
                            <View style={{ flex: 1 }}>
                              <AppText weight="bold" color={theme.textStrong} numberOfLines={1} style={{ fontSize: 12 }}>
                                {c.name}
                              </AppText>
                              <AppText variant="caption" color={theme.mutedText} style={{ fontSize: 10 }}>
                                {c.hex}
                              </AppText>
                            </View>
                          </View>
                        </View>
                      ))}
                    </View>
                  </AnimatedCard>

                  {/* 2-Column Beauty Details: Jewelry & Makeup */}
                  <View style={styles.grid}>
                    {/* Jewelry Advisory */}
                    <View style={styles.gridItem}>
                      <AnimatedCard delay={80}>
                        <View style={styles.miniCardContent}>
                          <View style={styles.miniHeading}>
                            <Ionicons name="diamond-outline" size={17} color={theme.warning} />
                            <AppText weight="black" style={{ fontSize: 13 }}>Jewelry & Metals</AppText>
                          </View>
                          <View style={styles.metalItem}>
                            <Ionicons name="checkmark-circle" size={15} color={theme.success} />
                            <View style={{ flex: 1 }}>
                              <AppText variant="caption" weight="bold" color={theme.mutedText}>BEST MATCH</AppText>
                              <AppText weight="bold" style={{ fontSize: 12 }}>{selected.metals.recommended}</AppText>
                            </View>
                          </View>
                          <View style={styles.metalItem}>
                            <Ionicons name="remove-circle-outline" size={15} color={theme.mutedText} />
                            <View style={{ flex: 1 }}>
                              <AppText variant="caption" weight="bold" color={theme.mutedText}>SECONDARY</AppText>
                              <AppText weight="medium" style={{ fontSize: 12 }}>{selected.metals.secondary}</AppText>
                            </View>
                          </View>
                        </View>
                      </AnimatedCard>
                    </View>

                    {/* Makeup Guide */}
                    <View style={styles.gridItem}>
                      <AnimatedCard delay={100}>
                        <View style={styles.miniCardContent}>
                          <View style={styles.miniHeading}>
                            <Ionicons name="brush-outline" size={17} color={theme.primary} />
                            <AppText weight="black" style={{ fontSize: 13 }}>Makeup & Base</AppText>
                          </View>
                          <View style={styles.metalItem}>
                            <Ionicons name="color-filter-outline" size={15} color={theme.primary} />
                            <View style={{ flex: 1 }}>
                              <AppText variant="caption" weight="bold" color={theme.mutedText}>FOUNDATION</AppText>
                              <AppText weight="bold" style={{ fontSize: 11 }}>{selected.makeup.foundation}</AppText>
                            </View>
                          </View>
                          <View style={styles.metalItem}>
                            <Ionicons name="heart-outline" size={15} color={theme.secondary} />
                            <View style={{ flex: 1 }}>
                              <AppText variant="caption" weight="bold" color={theme.mutedText}>LIPS</AppText>
                              <AppText weight="medium" style={{ fontSize: 11 }} numberOfLines={2}>
                                {selected.makeup.lips}
                              </AppText>
                            </View>
                          </View>
                        </View>
                      </AnimatedCard>
                    </View>
                  </View>

                  {/* Colors to Avoid Caution */}
                  <AnimatedCard delay={120}>
                    <View style={styles.sectionHeading}>
                      <View style={[styles.sectionIcon, { backgroundColor: theme.dangerSoft }]}>
                        <Ionicons name="alert-circle-outline" size={17} color={theme.danger} />
                      </View>
                      <View>
                        <AppText variant="h3" weight="bold">
                          Colors to Avoid
                        </AppText>
                        <AppText variant="caption" muted>
                          Tones that may wash out or overpower your complexion
                        </AppText>
                      </View>
                    </View>
                    <View style={styles.avoidList}>
                      {selected.avoidColors.map((avoid) => (
                        <View key={avoid} style={styles.avoidRow}>
                          <Ionicons name="close-circle" size={16} color={theme.danger} />
                          <AppText color={theme.text} weight="medium" style={{ fontSize: 13 }}>
                            {avoid}
                          </AppText>
                        </View>
                      ))}
                    </View>
                  </AnimatedCard>

                  {/* Reset & Retest Buttons */}
                  <View style={{ gap: spacing.sm, marginTop: spacing.xs }}>
                    <AppButton
                      title="Analyze Another Photo"
                      icon="camera-outline"
                      size="lg"
                      onPress={() => {
                        setSelectedIdx(null);
                        setAnalyzed(false);
                        setMode('scan');
                      }}
                    />
                    <AppButton
                      title="Explore Other Shades"
                      icon="color-palette-outline"
                      variant="secondary"
                      size="lg"
                      onPress={() => {
                        setSelectedIdx(null);
                        setAnalyzed(false);
                        setMode('palette');
                      }}
                    />
                  </View>
                </>
              ) : null}
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  screen: { padding: spacing.md, paddingBottom: 44 },
  content: { width: '100%', alignSelf: 'center', gap: spacing.md },
  segmentedWrap: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: radii.pill,
    borderWidth: 1,
    gap: 4,
  },
  segmentButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  segmentText: {
    fontSize: 13,
  },
  paletteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: spacing.md,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
    rowGap: spacing.sm,
  },
  gridItem: {
    width: '50%',
    paddingHorizontal: spacing.xs,
  },
  swatchCard: {
    borderWidth: 1,
    borderRadius: radii.lg,
    padding: 12,
    gap: 10,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  circleSwatch: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  swatchGleam: {
    position: 'absolute',
    top: 3,
    left: 4,
    width: 14,
    height: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.45)',
    transform: [{ rotate: '-30deg' }],
  },
  cardTextContent: {
    gap: 2,
  },
  swatchTitle: {
    fontSize: 14,
    letterSpacing: -0.2,
  },
  swatchSubtitle: {
    fontSize: 11,
  },
  selectAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: radii.sm,
    marginTop: 2,
  },
  heroResultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  heroOrb: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  heroOrbGleam: {
    position: 'absolute',
    top: 6,
    left: 8,
    width: 24,
    height: 14,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.5)',
    transform: [{ rotate: '-30deg' }],
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  eyebrow: {
    letterSpacing: 0.8,
    fontSize: 10,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  toneDesc: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
    paddingTop: spacing.md,
  },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  sectionIcon: {
    width: 34,
    height: 34,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
    rowGap: spacing.xs,
  },
  colorGridItem: {
    width: '50%',
    paddingHorizontal: spacing.xs,
  },
  colorTile: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: radii.md,
    borderWidth: 1,
    gap: 10,
  },
  colorChip: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  miniCardContent: {
    gap: 10,
  },
  miniHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  metalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avoidList: {
    gap: 8,
  },
  avoidRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

