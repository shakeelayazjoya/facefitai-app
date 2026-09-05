import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { radii, spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useResponsive } from '@/utils/responsive';
import { useToast } from '@/hooks/useToast';

const goldenRatioImg = require('@/assets/images/tools/golden_ratio.jpg');
const ageDetectorImg = require('@/assets/images/tools/age_detector.jpg');
const colorAnalysisImg = require('@/assets/images/tools/color_analysis.jpg');
const skinToneImg = require('@/assets/images/tools/skin_tone.jpg');
const bodyShapeImg = require('@/assets/images/tools/body_shape.jpg');
const bodyTypeImg = require('@/assets/images/tools/body_type.jpg');
const kibbeGuideImg = require('@/assets/images/tools/kibbe_guide.jpg');
const kibbeTestImg = require('@/assets/images/tools/kibbe_test.jpg');
const celebrityMatchImg = require('@/assets/images/tools/celebrity_match.jpg');

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
              <AppText variant="h1" weight="black" style={styles.headerTitle}>
                Tools
              </AppText>
              <AppText muted style={styles.headerSubtitle}>
                Smart biometric analysis & personal styling
              </AppText>
            </View>

            <Pressable
              onPress={handleHowItWorks}
              style={({ pressed }) => [
                styles.howBtn,
                { backgroundColor: theme.surface, borderColor: theme.border, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Ionicons name="help-circle-outline" size={17} color={theme.textStrong} />
              <AppText style={styles.howBtnText}>How it works</AppText>
            </Pressable>
          </View>

          {/* Section 1: Face Tools */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleGroup}>
                <View style={[styles.sectionIconBadge, { backgroundColor: theme.primarySoft }]}>
                  <Ionicons name="scan-outline" size={18} color={theme.primary} />
                </View>
                <AppText variant="h3" weight="black" style={styles.sectionTitleText}>
                  Face Tools
                </AppText>
              </View>
              <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/(tabs)')}>
                <AppText style={{ color: theme.primary, fontSize: 13, fontWeight: '700' }}>
                  View all
                </AppText>
              </TouchableOpacity>
            </View>

            {/* 2 Banner Cards Grid */}
            <View style={styles.bannerGrid}>
              {/* Golden Ratio Card */}
              <View style={styles.bannerCol}>
                <TouchableOpacity
                  activeOpacity={0.82}
                  onPress={() => router.push('/tools/golden-ratio')}
                  style={[styles.bannerCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
                >
                  <View style={styles.bannerImgWrap}>
                    <Image source={goldenRatioImg} style={styles.bannerImg} resizeMode="cover" />
                    <View style={[styles.arrowCircle, { backgroundColor: theme.primary }]}>
                      <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
                    </View>
                  </View>
                  <View style={styles.bannerContent}>
                    <AppText weight="black" style={styles.bannerTitle}>
                      Golden Ratio
                    </AppText>
                    <AppText muted style={styles.bannerSub}>
                      Facial proportion score
                    </AppText>
                  </View>
                </TouchableOpacity>
              </View>

              {/* AI Age Detector Card */}
              <View style={styles.bannerCol}>
                <TouchableOpacity
                  activeOpacity={0.82}
                  onPress={() => router.push('/(tabs)/age')}
                  style={[styles.bannerCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
                >
                  <View style={styles.bannerImgWrap}>
                    <Image source={ageDetectorImg} style={styles.bannerImg} resizeMode="cover" />
                    <View style={[styles.arrowCircle, { backgroundColor: theme.primary }]}>
                      <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
                    </View>
                  </View>
                  <View style={styles.bannerContent}>
                    <AppText weight="black" style={styles.bannerTitle}>
                      AI Age Detector
                    </AppText>
                    <AppText muted style={styles.bannerSub}>
                      Estimate facial age
                    </AppText>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Section 2: Body & Style */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleGroup}>
                <View style={[styles.sectionIconBadge, { backgroundColor: theme.primarySoft }]}>
                  <Ionicons name="body-outline" size={18} color={theme.primary} />
                </View>
                <AppText variant="h3" weight="black" style={styles.sectionTitleText}>
                  Body & Style
                </AppText>
              </View>
              <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/tools/kibbe-types')}>
                <AppText style={{ color: theme.primary, fontSize: 13, fontWeight: '700' }}>
                  View all
                </AppText>
              </TouchableOpacity>
            </View>

            {/* 3-Column Square Cards Grid */}
            <View style={styles.squareGrid}>
              {/* Color Analysis */}
              <View style={styles.squareCol}>
                <TouchableOpacity
                  activeOpacity={0.82}
                  onPress={() => router.push('/tools/color-analysis')}
                  style={[styles.squareCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
                >
                  <View style={[styles.squareImgBox, { borderColor: theme.border }]}>
                    <Image source={colorAnalysisImg} style={styles.squareImg} resizeMode="cover" />
                  </View>
                  <AppText weight="bold" align="center" style={styles.squareTitle}>
                    Color Analysis
                  </AppText>
                  <AppText muted align="center" style={styles.squareSub}>
                    Best colors
                  </AppText>
                </TouchableOpacity>
              </View>

              {/* Skin Tone */}
              <View style={styles.squareCol}>
                <TouchableOpacity
                  activeOpacity={0.82}
                  onPress={() => router.push('/tools/skin-tone')}
                  style={[styles.squareCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
                >
                  <View style={[styles.squareImgBox, { borderColor: theme.border }]}>
                    <Image source={skinToneImg} style={styles.squareImg} resizeMode="cover" />
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
                  activeOpacity={0.82}
                  onPress={() => router.push('/tools/body-shape')}
                  style={[styles.squareCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
                >
                  <View style={[styles.squareImgBox, { borderColor: theme.border }]}>
                    <Image source={bodyShapeImg} style={styles.squareImg} resizeMode="cover" />
                    <View style={[styles.checkBadge, { backgroundColor: theme.primary }]}>
                      <Ionicons name="checkmark" size={10} color="#FFFFFF" />
                    </View>
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
                  activeOpacity={0.82}
                  onPress={() => router.push('/tools/body-type')}
                  style={[styles.squareCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
                >
                  <View style={[styles.squareImgBox, { borderColor: theme.border }]}>
                    <Image source={bodyTypeImg} style={styles.squareImg} resizeMode="cover" />
                  </View>
                  <AppText weight="bold" align="center" style={styles.squareTitle}>
                    Body Type
                  </AppText>
                  <AppText muted align="center" style={styles.squareSub}>
                    Proportions
                  </AppText>
                </TouchableOpacity>
              </View>

              {/* Kibbe Guide */}
              <View style={styles.squareCol}>
                <TouchableOpacity
                  activeOpacity={0.82}
                  onPress={() => router.push('/tools/kibbe-types')}
                  style={[styles.squareCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
                >
                  <View style={[styles.squareImgBox, { borderColor: theme.border }]}>
                    <Image source={kibbeGuideImg} style={styles.squareImg} resizeMode="cover" />
                  </View>
                  <AppText weight="bold" align="center" style={styles.squareTitle}>
                    Kibbe Guide
                  </AppText>
                  <AppText muted align="center" style={styles.squareSub}>
                    Find your type
                  </AppText>
                </TouchableOpacity>
              </View>

              {/* Kibbe Test */}
              <View style={styles.squareCol}>
                <TouchableOpacity
                  activeOpacity={0.82}
                  onPress={() => router.push('/tools/kibbe-test')}
                  style={[styles.squareCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
                >
                  <View style={[styles.squareImgBox, { borderColor: theme.border }]}>
                    <Image source={kibbeTestImg} style={styles.squareImg} resizeMode="cover" />
                  </View>
                  <AppText weight="bold" align="center" style={styles.squareTitle}>
                    Kibbe Test
                  </AppText>
                  <AppText muted align="center" style={styles.squareSub}>
                    Style quiz
                  </AppText>
                </TouchableOpacity>
              </View>

              {/* Celebrity Match */}
              <View style={styles.squareCol}>
                <TouchableOpacity
                  activeOpacity={0.82}
                  onPress={() => router.push('/tools/similar-faces')}
                  style={[styles.squareCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
                >
                  <View style={[styles.squareImgBox, { borderColor: theme.border }]}>
                    <Image source={celebrityMatchImg} style={styles.squareImg} resizeMode="cover" />
                  </View>
                  <AppText weight="bold" align="center" style={styles.squareTitle}>
                    Celebrity Match
                  </AppText>
                  <AppText muted align="center" style={styles.squareSub}>
                    Find lookalike
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
  sectionIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  bannerCol: { width: '48.5%' },
  bannerCard: {
    height: 184,
    padding: 10,
    borderRadius: radii.xl,
    borderWidth: 1,
    boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
  },
  bannerImgWrap: {
    width: '100%',
    height: 112,
    borderRadius: radii.lg,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#0F172A',
  },
  bannerImg: { width: '100%', height: '100%' },
  arrowCircle: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  },
  bannerContent: { paddingTop: 8, paddingHorizontal: 4 },
  bannerTitle: { fontSize: 15, lineHeight: 18, letterSpacing: -0.2 },
  bannerSub: { fontSize: 12, marginTop: 2, lineHeight: 15 },
  squareGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', gap: 10 },
  squareCol: { width: '31.2%' },
  squareCard: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 146,
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: radii.xl,
    borderWidth: 1,
    boxShadow: '0 6px 18px rgba(0,0,0,0.03)',
  },
  squareImgBox: {
    width: 58,
    height: 58,
    borderRadius: radii.lg,
    overflow: 'hidden',
    marginBottom: 8,
    borderWidth: 1,
    position: 'relative',
  },
  squareImg: { width: '100%', height: '100%' },
  checkBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 17,
    height: 17,
    borderRadius: 8.5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  squareTitle: { fontSize: 12.5, textAlign: 'center', lineHeight: 15, marginBottom: 2 },
  squareSub: { fontSize: 10.5, textAlign: 'center', lineHeight: 13 },
});
