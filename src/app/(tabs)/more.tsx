import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import {
  BodyShapeSvg,
  BodyTypeSvg,
  CelebrityStarSvg,
  ColorPaletteSvg,
  FaceAgeSvg,
  FaceIllustrationSvg,
  KibbeDressSvg,
  KibbeTestSvg,
  SkinToneSvg,
} from '@/components/ui/ToolIcons';
import { radii, spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useResponsive } from '@/utils/responsive';
import { useToast } from '@/hooks/useToast';

export default function MoreScreen() {
  const theme = useAppTheme();
  const responsive = useResponsive();
  const router = useRouter();
  const { showToast } = useToast();

  const handleHowItWorks = () => {
    showToast('Upload a selfie or enter body metrics to receive AI styling & proportion recommendations.');
  };

  return (
    <ScreenWrapper>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.screen}>
        <View style={[styles.content, { maxWidth: responsive.contentWidth }]}>
          {/* Top Header Section */}
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <AppText variant="h1" editorial weight="bold" style={styles.headerTitle}>
                Tools
              </AppText>
              <AppText muted style={styles.headerSubtitle}>
                Smart analysis for your best look
              </AppText>
            </View>

            <Pressable
              onPress={handleHowItWorks}
              style={({ pressed }) => [
                styles.howBtn,
                { backgroundColor: theme.surface, borderColor: theme.border, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Ionicons name="help-circle-outline" size={18} color={theme.textStrong} />
              <AppText style={styles.howBtnText}>How it works</AppText>
            </Pressable>
          </View>

          {/* Section 1: Face Tools */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleGroup}>
                <Ionicons name="scan-outline" size={20} color={theme.textStrong} />
                <AppText variant="h3" weight="bold" style={styles.sectionTitleText}>
                  Face Tools
                </AppText>
              </View>
              <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/(tabs)')}>
                <AppText style={{ color: theme.primary, fontSize: 13, fontWeight: '600' }}>
                  View all
                </AppText>
              </TouchableOpacity>
            </View>

            {/* 2 Banner Cards Grid */}
            <View style={styles.bannerGrid}>
              {/* Golden Ratio Card */}
              <View style={styles.bannerCol}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => router.push('/tools/golden-ratio')}
                  style={[styles.bannerCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
                >
                  <View style={styles.bannerLeftCol}>
                    <View>
                      <AppText weight="bold" style={styles.bannerTitle}>
                        Golden Ratio
                      </AppText>
                      <AppText muted style={styles.bannerSub}>
                        Check your face proportions
                      </AppText>
                    </View>

                    <View style={[styles.arrowCircle, { backgroundColor: theme.primary }]}>
                      <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                    </View>
                  </View>

                  <View style={styles.bannerGraphic}>
                    <FaceIllustrationSvg width={82} height={92} color={theme.primary} />
                  </View>
                </TouchableOpacity>
              </View>

              {/* AI Age Detector Card */}
              <View style={styles.bannerCol}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => router.push('/(tabs)/age')}
                  style={[styles.bannerCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
                >
                  <View style={styles.bannerLeftCol}>
                    <View>
                      <AppText weight="bold" style={styles.bannerTitle}>
                        AI Age Detector
                      </AppText>
                      <AppText muted style={styles.bannerSub}>
                        Estimate your facial age
                      </AppText>
                    </View>

                    <View style={[styles.arrowCircle, { backgroundColor: theme.primary }]}>
                      <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                    </View>
                  </View>

                  <View style={styles.bannerGraphic}>
                    <FaceAgeSvg width={82} height={92} color={theme.primary} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Section 2: Body & Style */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleGroup}>
                <Ionicons name="body-outline" size={20} color={theme.textStrong} />
                <AppText variant="h3" weight="bold" style={styles.sectionTitleText}>
                  Body & Style
                </AppText>
              </View>
              <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/tools/kibbe-types')}>
                <AppText style={{ color: theme.primary, fontSize: 13, fontWeight: '600' }}>
                  View all
                </AppText>
              </TouchableOpacity>
            </View>

            {/* 3-Column Square Cards Grid */}
            <View style={styles.squareGrid}>
              {/* Color Analysis */}
              <View style={styles.squareCol}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => router.push('/tools/color-analysis')}
                  style={[styles.squareCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
                >
                  <View style={[styles.squareIconBox, { backgroundColor: theme.primarySoft }]}>
                    <ColorPaletteSvg size={36} color={theme.primary} />
                  </View>
                  <AppText weight="bold" align="center" style={styles.squareTitle}>
                    Color Analysis
                  </AppText>
                  <AppText muted align="center" style={styles.squareSub}>
                    Find your best colors
                  </AppText>
                </TouchableOpacity>
              </View>

              {/* Skin Tone */}
              <View style={styles.squareCol}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => router.push('/tools/skin-tone')}
                  style={[styles.squareCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
                >
                  <View style={[styles.squareIconBox, { backgroundColor: theme.primarySoft }]}>
                    <SkinToneSvg size={36} color={theme.primary} />
                    <View style={[styles.checkBadge, { backgroundColor: theme.primary }]}>
                      <Ionicons name="checkmark" size={10} color="#FFFFFF" />
                    </View>
                  </View>
                  <AppText weight="bold" align="center" style={styles.squareTitle}>
                    Skin Tone
                  </AppText>
                  <AppText align="center" style={[styles.squareSub, { color: theme.primary, fontWeight: '700' }]}>
                    Calibrated
                  </AppText>
                </TouchableOpacity>
              </View>

              {/* Body Shape */}
              <View style={styles.squareCol}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => router.push('/tools/body-shape')}
                  style={[styles.squareCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
                >
                  <View style={[styles.squareIconBox, { backgroundColor: theme.primarySoft }]}>
                    <BodyShapeSvg size={38} color={theme.primary} />
                  </View>
                  <AppText weight="bold" align="center" style={styles.squareTitle}>
                    Body Shape
                  </AppText>
                  <AppText align="center" style={[styles.squareSub, { color: theme.primary, fontWeight: '700' }]}>
                    Calibrated
                  </AppText>
                </TouchableOpacity>
              </View>

              {/* Body Type */}
              <View style={styles.squareCol}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => router.push('/tools/body-type')}
                  style={[styles.squareCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
                >
                  <View style={[styles.squareIconBox, { backgroundColor: theme.primarySoft }]}>
                    <BodyTypeSvg size={36} color={theme.primary} />
                  </View>
                  <AppText weight="bold" align="center" style={styles.squareTitle}>
                    Body Type
                  </AppText>
                  <AppText muted align="center" style={styles.squareSub}>
                    Identify your body type
                  </AppText>
                </TouchableOpacity>
              </View>

              {/* Kibbe Guide */}
              <View style={styles.squareCol}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => router.push('/tools/kibbe-types')}
                  style={[styles.squareCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
                >
                  <View style={[styles.squareIconBox, { backgroundColor: theme.primarySoft }]}>
                    <KibbeDressSvg size={36} color={theme.primary} />
                  </View>
                  <AppText weight="bold" align="center" style={styles.squareTitle}>
                    Kibbe Guide
                  </AppText>
                  <AppText muted align="center" style={styles.squareSub}>
                    Find your Kibbe type
                  </AppText>
                </TouchableOpacity>
              </View>

              {/* Kibbe Test */}
              <View style={styles.squareCol}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => router.push('/tools/kibbe-test')}
                  style={[styles.squareCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
                >
                  <View style={[styles.squareIconBox, { backgroundColor: theme.primarySoft }]}>
                    <KibbeTestSvg size={36} color={theme.primary} />
                  </View>
                  <AppText weight="bold" align="center" style={styles.squareTitle}>
                    Kibbe Test
                  </AppText>
                  <AppText muted align="center" style={styles.squareSub}>
                    Take the Kibbe test
                  </AppText>
                </TouchableOpacity>
              </View>

              {/* Celebrity Match */}
              <View style={styles.squareCol}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => router.push('/tools/similar-faces')}
                  style={[styles.squareCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
                >
                  <View style={[styles.squareIconBox, { backgroundColor: theme.primarySoft }]}>
                    <CelebrityStarSvg size={36} color={theme.primary} />
                  </View>
                  <AppText weight="bold" align="center" style={styles.squareTitle}>
                    Celebrity Match
                  </AppText>
                  <AppText muted align="center" style={styles.squareSub}>
                    Find your celebrity lookalike
                  </AppText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  screen: { padding: spacing.md, paddingBottom: 50 },
  content: { width: '100%', alignSelf: 'center', gap: spacing.lg },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginTop: spacing.xs },
  headerTitle: { fontSize: 34, letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 13, marginTop: 2 },
  howBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 38,
    paddingHorizontal: 14,
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  howBtnText: { fontSize: 12, fontWeight: '600' },
  section: { gap: spacing.xs },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  sectionTitleGroup: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitleText: { fontSize: 17 },
  bannerGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  bannerCol: { width: '48.5%' },
  bannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 138,
    padding: 14,
    borderRadius: radii.xl,
    borderWidth: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  bannerLeftCol: { flex: 1, height: '100%', justifyContent: 'space-between', zIndex: 2 },
  bannerTitle: { fontSize: 15, lineHeight: 18 },
  bannerSub: { fontSize: 11, marginTop: 4, lineHeight: 14 },
  arrowCircle: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  bannerGraphic: { position: 'absolute', right: -4, bottom: -4, opacity: 0.95 },
  squareGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', gap: 10 },
  squareCol: { width: '31%' },
  squareCard: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 135,
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: radii.xl,
    borderWidth: 1,
  },
  squareIconBox: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', marginBottom: 8, position: 'relative' },
  checkBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  squareTitle: { fontSize: 12, textAlign: 'center', lineHeight: 15, marginBottom: 2 },
  squareSub: { fontSize: 10, textAlign: 'center', lineHeight: 13 },
});
