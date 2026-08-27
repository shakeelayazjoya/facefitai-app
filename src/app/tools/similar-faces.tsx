import { useState } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { AppText } from '@/components/ui/AppText';
import { AppButton } from '@/components/ui/Button';
import { GradientHeader } from '@/components/ui/GradientHeader';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { spacing, radii } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { ImagePickerPanel } from '@/features/detectors/ImagePickerPanel';
import type { ImageAsset } from '@/utils/formData';
import { useResponsive } from '@/utils/responsive';

const CELEB_MATCHES = [
  { name: 'Anne Hathaway', similarity: 94.8, shape: 'Oval Face', traits: ['High Cheekbones', 'Expressive Eyes', 'Soft Curved Jawline'] },
  { name: 'Ryan Gosling', similarity: 91.2, shape: 'Oblong / Oval', traits: ['Defined Jawline', 'Balanced Symmetry', 'Straight Nose Bridge'] },
  { name: 'Zendaya Coleman', similarity: 89.5, shape: 'Diamond Face', traits: ['Prominent Cheekbones', 'Slender Jawline', 'High Forehead'] },
];

export default function SimilarFacesScreen() {
  const theme = useAppTheme();
  const responsive = useResponsive();
  const [asset, setAsset] = useState<ImageAsset | null>(null);
  const [loading, setLoading] = useState(false);

  const analyze = (image: ImageAsset) => {
    setAsset(image);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1200);
  };

  const reset = () => setAsset(null);

  return (
    <ScreenWrapper>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.screen}>
        <View style={[styles.content, { maxWidth: responsive.contentWidth }]}>
          <GradientHeader
            showBack={true}
            eyebrow="Celebrity Twin Match"
            title="Celebrity Look Alike"
            description="Find your top celebrity face shape twins & facial ratio matches using landmark vector comparison."
            icon="people-outline"
          />

          {!asset ? (
            <ImagePickerPanel
              kind="face"
              disabled={loading}
              title="Celebrity Match Scan"
              description="Upload a clear selfie to match your facial features against celebrity profiles."
              uploadAction="Upload selfie"
              cameraAction="Take photo"
              filePrefix="similar-faces"
              onPick={analyze}
            />
          ) : (
            <View style={styles.imgWrap}>
              <Image source={{ uri: asset.uri }} style={styles.img} resizeMode="cover" />
            </View>
          )}

          {loading ? (
            <AnimatedCard>
              <AppText variant="h3" align="center">
                Comparing Facial Vectors...
              </AppText>
              <AppText muted align="center" style={{ marginTop: 4 }}>
                Scanning 1,000+ celebrity face landmark profiles.
              </AppText>
            </AnimatedCard>
          ) : null}

          {asset && !loading ? (
            <View style={{ gap: spacing.md }}>
              <AppText variant="h3">Top Celebrity Facial Twins</AppText>

              {CELEB_MATCHES.map((celeb, idx) => (
                <AnimatedCard key={celeb.name} delay={idx * 60}>
                  <View style={{ gap: spacing.xs }}>
                    <View style={styles.headerRow}>
                      <View>
                        <AppText variant="h2">{celeb.name}</AppText>
                        <AppText muted style={{ fontSize: 12 }}>{celeb.shape}</AppText>
                      </View>
                      <View style={[styles.matchBadge, { backgroundColor: theme.primarySoft }]}>
                        <AppText style={{ color: theme.primary, fontWeight: '700', fontSize: 13 }}>
                          {celeb.similarity}% Match
                        </AppText>
                      </View>
                    </View>

                    <View style={styles.traitWrap}>
                      {celeb.traits.map((t) => (
                        <View key={t} style={[styles.traitChip, { borderColor: theme.border }]}>
                          <AppText muted style={{ fontSize: 11 }}>{t}</AppText>
                        </View>
                      ))}
                    </View>
                  </View>
                </AnimatedCard>
              ))}

              <AppButton title="Scan Another Selfie" variant="secondary" onPress={reset} style={{ marginTop: spacing.xs }} />
            </View>
          ) : null}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  screen: { padding: spacing.md, paddingBottom: 44 },
  content: { width: '100%', alignSelf: 'center', gap: spacing.md },
  imgWrap: { height: 220, width: '100%', borderRadius: radii.lg, overflow: 'hidden' },
  img: { width: '100%', height: '100%' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  matchBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: radii.md },
  traitWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 },
  traitChip: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: radii.sm, borderWidth: 1 },
});
