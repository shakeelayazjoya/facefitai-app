import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { AppButton } from '@/components/ui/Button';
import { AppText } from '@/components/ui/AppText';
import { spacing } from '@/constants/theme';
import { strings } from '@/constants/strings';
import { useToast } from '@/hooks/useToast';
import type { DetectorKind } from '@/types/api';
import { availableFormats, exportAnalysisReport, type DetectorResult, type ExportFormat } from './reportExport';

interface Props { kind: DetectorKind; result: DetectorResult; scanId?: string; delay?: number }

export function ExportReportActions({ kind, result, scanId, delay = 0 }: Props) {
  const { showToast } = useToast();
  const [busy, setBusy] = useState<ExportFormat | null>(null);
  const formats = availableFormats({ kind, result, scanId });

  const runExport = async (format: ExportFormat) => {
    setBusy(format);
    try {
      await exportAnalysisReport({ kind, result, scanId }, format);
      showToast(strings.reportExportReady);
    } catch (error) {
      showToast(error instanceof Error ? error.message : strings.reportExportFailed);
    } finally {
      setBusy(null);
    }
  };

  return <AnimatedCard delay={delay}><View style={styles.wrap}><AppText variant="h3">Export report</AppText><AppText muted>Choose a format.</AppText><View style={styles.actions}>{formats.map((format) => <AppButton key={format} size="sm" title={format.toUpperCase()} icon={format === 'pdf' ? 'document-outline' : format === 'json' ? 'code-slash-outline' : 'document-text-outline'} variant={format === 'pdf' ? 'primary' : 'secondary'} loading={busy === format} disabled={Boolean(busy)} onPress={() => void runExport(format)} />)}</View></View></AnimatedCard>;
}

const styles = StyleSheet.create({ wrap: { gap: spacing.sm }, actions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm } });
