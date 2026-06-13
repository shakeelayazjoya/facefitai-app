import { ScrollView, StyleSheet, Text } from 'react-native';
import { Card } from '@/components/ui/Card';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { useAppTheme } from '@/hooks/useAppTheme';
import { staticContent } from './staticContent';
export function StaticScreen({ slug }: { slug: keyof typeof staticContent }) { const theme = useAppTheme(); const content = staticContent[slug]; return <ScreenWrapper><ScrollView contentContainerStyle={styles.content}><Text style={[styles.title, { color: theme.text }]}>{content.title}</Text><Text style={[styles.description, { color: theme.mutedText }]}>{content.description}</Text>{content.sections.map((section) => <Card key={section.heading}><Text style={[styles.heading, { color: theme.text }]}>{section.heading}</Text>{section.body.map((item) => <Text key={item} style={[styles.body, { color: theme.mutedText }]}>• {item}</Text>)}</Card>)}</ScrollView></ScreenWrapper>; }
const styles = StyleSheet.create({ content: { padding: 18, gap: 16, paddingBottom: 40 }, title: { fontSize: 30, fontWeight: '900' }, description: { lineHeight: 23 }, heading: { fontSize: 18, fontWeight: '900', marginBottom: 8 }, body: { lineHeight: 24, marginTop: 6 } });
