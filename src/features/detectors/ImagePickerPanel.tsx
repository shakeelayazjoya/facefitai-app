import { Ionicons } from '@expo/vector-icons';
import * as Device from 'expo-device';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { Alert, Linking, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { AppButton } from '@/components/ui/Button';
import { AppCard } from '@/components/ui/Card';
import { radii, spacing } from '@/constants/theme';
import { strings } from '@/constants/strings';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useToast } from '@/hooks/useToast';
import type { ImageAsset } from '@/utils/formData';
import { AnalysisLoader } from '@/components/ui/AnalysisLoader';
import { FeatureArtwork } from './FeatureArtwork';
import type { DetectorKind } from '@/types/api';

interface Props { onPick: (asset: ImageAsset) => void; kind?: DetectorKind; artworkSource?: any; disabled?: boolean; processing?: boolean; loadingLabel?: string; title?: string; description?: string; uploadAction?: string; cameraAction?: string; filePrefix?: string }
const maxBytes = 12 * 1024 * 1024;
const normalize = (asset: ImagePicker.ImagePickerAsset, prefix: string): ImageAsset => ({ uri: asset.uri, fileName: asset.fileName ?? `${prefix}-${Date.now()}.jpg`, mimeType: asset.mimeType ?? 'image/jpeg', fileSize: asset.fileSize ?? null, width: asset.width, height: asset.height });

export function ImagePickerPanel({ onPick, kind = 'face', artworkSource, disabled, processing, loadingLabel = 'Analyzing your photo', title = strings.faceAnalysisScan, description = strings.uploadHelper, uploadAction = strings.uploadSelfie, cameraAction = strings.cameraImage, filePrefix = 'face-scan' }: Props) {
  const theme = useAppTheme(); const { showToast } = useToast(); const [busy, setBusy] = useState(false);
  const handle = (asset: ImagePicker.ImagePickerAsset) => { if (asset.fileSize && asset.fileSize > maxBytes) { showToast(strings.imageTooLarge); return; } onPick(normalize(asset, filePrefix)); };
  useEffect(() => { void ImagePicker.getPendingResultAsync().then((result) => { if (result && !('code' in result) && !result.canceled && result.assets?.[0]) handle(result.assets[0]); }).catch(() => undefined); }, []);
  const library = async () => { if (busy) return; setBusy(true); try { const permission = await ImagePicker.requestMediaLibraryPermissionsAsync(); if (!permission.granted) { showToast(strings.galleryPermission); if (!permission.canAskAgain) void Linking.openSettings(); return; } const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.82 }); if (!result.canceled && result.assets?.[0]) handle(result.assets[0]); } catch { showToast(strings.galleryUnavailable); } finally { setBusy(false); } };
  const camera = async () => { if (busy) return; if (process.env.EXPO_OS === 'ios' && !Device.isDevice) { Alert.alert('Camera unavailable in Simulator', strings.cameraSimulatorUnavailable, [{ text: 'Cancel', style: 'cancel' }, { text: 'Choose Photo', onPress: () => void library() }]); return; } setBusy(true); try { const permission = await ImagePicker.requestCameraPermissionsAsync(); if (!permission.granted) { showToast(strings.cameraPermission); if (!permission.canAskAgain) void Linking.openSettings(); return; } const result = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], cameraType: ImagePicker.CameraType.front, quality: 0.82 }); if (!result.canceled && result.assets?.[0]) handle(result.assets[0]); } catch { showToast(strings.cameraUnavailable); } finally { setBusy(false); } };
  return (
    <AppCard style={styles.card}>
      {processing || busy ? (
        <AnalysisLoader label={processing ? loadingLabel : 'Preparing photo'} />
      ) : (
        <>
          <FeatureArtwork kind={kind} artworkSource={artworkSource} />
          <AppText variant="h2" weight="black" align="center" style={styles.titleText}>
            {title}
          </AppText>
          <AppText variant="body" weight="medium" color={theme.text} align="center" style={styles.descText}>
            {description}
          </AppText>
          <View style={[styles.tips, { backgroundColor: theme.primarySoft }]}>
            <Ionicons name="sunny-outline" color={theme.primary} size={15} />
            <AppText variant="body" weight="bold" color={theme.primary} style={styles.tipText}>
              Even light • Front-facing • No filters
            </AppText>
          </View>
          <View style={styles.actions}>
            <AppButton disabled={disabled || busy} size="lg" icon="images-outline" title={uploadAction} onPress={() => void library()} />
            <AppButton disabled={disabled || busy} size="lg" icon="camera-outline" title={cameraAction} variant="secondary" onPress={() => void camera()} />
          </View>
        </>
      )}
    </AppCard>
  );
}
const styles = StyleSheet.create({
  card: { padding: spacing.md, alignItems: 'center', gap: spacing.sm },
  titleText: { marginTop: spacing.xs, fontSize: 18, letterSpacing: -0.2 },
  descText: { fontSize: 14, lineHeight: 20 },
  tips: { width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: spacing.xs, marginTop: spacing.xs, paddingVertical: 8, paddingHorizontal: 12, borderRadius: radii.pill },
  tipText: { fontSize: 12, letterSpacing: 0.2 },
  actions: { width: '100%', gap: spacing.sm, marginTop: spacing.sm },
});
