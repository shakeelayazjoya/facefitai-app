import * as ImagePicker from 'expo-image-picker';
import * as Device from 'expo-device';
import { useEffect, useState } from 'react';
import { Alert, Linking, StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { strings } from '@/constants/strings';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useToast } from '@/hooks/useToast';
import type { ImageAsset } from '@/utils/formData';

interface Props {
  onPick: (asset: ImageAsset) => void;
  disabled?: boolean;
  title?: string;
  description?: string;
  uploadAction?: string;
  cameraAction?: string;
  filePrefix?: string;
}

const maxImageBytes = 12 * 1024 * 1024;

function normalizeAsset(asset: ImagePicker.ImagePickerAsset, filePrefix: string): ImageAsset {
  return {
    uri: asset.uri,
    fileName: asset.fileName ?? `${filePrefix}-${Date.now()}.jpg`,
    mimeType: asset.mimeType ?? 'image/jpeg',
    fileSize: asset.fileSize ?? null,
    width: asset.width,
    height: asset.height,
  };
}

export function ImagePickerPanel({
  onPick,
  disabled,
  title = strings.faceAnalysisScan,
  description = strings.uploadHelper,
  uploadAction = strings.uploadSelfie,
  cameraAction = strings.cameraImage,
  filePrefix = 'face-scan',
}: Props) {
  const theme = useAppTheme();
  const { showToast } = useToast();
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  useEffect(() => {
    void ImagePicker.getPendingResultAsync().then((pendingResult) => {
      if (pendingResult && !('code' in pendingResult) && !pendingResult.canceled && pendingResult.assets?.[0]) {
        handleAsset(pendingResult.assets[0]);
      }
    }).catch(() => undefined);
  }, []);

  function handleAsset(asset: ImagePicker.ImagePickerAsset): void {
    if (asset.fileSize && asset.fileSize > maxImageBytes) {
      showToast(strings.imageTooLarge);
      return;
    }
    onPick(normalizeAsset(asset, filePrefix));
  }

  async function fromLibrary(): Promise<void> {
    if (isPickerOpen) return;
    setIsPickerOpen(true);
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        showToast(strings.galleryPermission);
        if (!permission.canAskAgain) void Linking.openSettings();
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.9, allowsEditing: false });
      if (!result.canceled && result.assets?.[0]) handleAsset(result.assets[0]);
    } catch {
      showToast(strings.galleryUnavailable);
    } finally {
      setIsPickerOpen(false);
    }
  }

  async function fromCamera(): Promise<void> {
    if (isPickerOpen) return;
    if (process.env.EXPO_OS === 'ios' && !Device.isDevice) {
      Alert.alert(
        'Camera unavailable in Simulator',
        strings.cameraSimulatorUnavailable,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Choose Photo', onPress: () => void fromLibrary() },
        ],
      );
      return;
    }
    setIsPickerOpen(true);
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        showToast(strings.cameraPermission);
        if (!permission.canAskAgain) void Linking.openSettings();
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        cameraType: ImagePicker.CameraType.front,
        quality: 0.9,
        allowsEditing: false,
      });
      if (!result.canceled && result.assets?.[0]) handleAsset(result.assets[0]);
    } catch {
      showToast(strings.cameraUnavailable);
    } finally {
      setIsPickerOpen(false);
    }
  }

  return (
    <Card>
      <View style={[styles.icon, { backgroundColor: theme.primary }]}>
        <Text style={[styles.iconText, { color: theme.white }]}>＋</Text>
      </View>
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.desc, { color: theme.mutedText }]}>{description}</Text>
      <View style={styles.actions}>
        <Button disabled={disabled || isPickerOpen} title={uploadAction} onPress={() => void fromLibrary()} />
        <Button disabled={disabled || isPickerOpen} title={cameraAction} variant="secondary" onPress={() => void fromCamera()} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  icon: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' },
  iconText: { fontSize: 30, lineHeight: 32 },
  title: { marginTop: 14, textAlign: 'center', fontSize: 20, fontWeight: '900' },
  desc: { marginTop: 8, textAlign: 'center', lineHeight: 21 },
  actions: { gap: 12, marginTop: 18 },
});
