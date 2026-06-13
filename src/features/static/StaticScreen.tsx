import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, View } from 'react-native';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { AppText } from '@/components/ui/AppText';
import { GradientHeader } from '@/components/ui/GradientHeader';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useResponsive } from '@/utils/responsive';
import { staticContent } from './staticContent';

export function StaticScreen({ slug }: { slug: keyof typeof staticContent }) {
  const theme = useAppTheme(); const responsive = useResponsive(); const content = staticContent[slug];
  return <ScreenWrapper><ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.screen}><View style={[styles.content, { maxWidth: responsive.contentWidth }]}><GradientHeader eyebrow="FaceShape" title={content.title} description={content.description} icon="document-text-outline" />{content.sections.map((section, index) => <AnimatedCard key={section.heading} delay={index * 55}><AppText variant="h3">{section.heading}</AppText>{section.body.map((item) => <View key={item} style={styles.row}><Ionicons name="checkmark-circle" size={15} color={theme.primary} /><AppText muted style={styles.copy}>{item}</AppText></View>)}</AnimatedCard>)}</View></ScrollView></ScreenWrapper>;
}
const styles = StyleSheet.create({ screen: { padding: spacing.md, paddingBottom: 40 }, content: { width: '100%', alignSelf: 'center', gap: spacing.md }, row: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md }, copy: { flex: 1 } });
