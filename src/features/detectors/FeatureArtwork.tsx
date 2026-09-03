import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, View } from 'react-native';
import type { DetectorKind } from '@/types/api';
import { radii } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';

const faceArtwork = require('@/assets/images/face_scanner_artwork.jpg');
const eyeArtwork = require('@/assets/images/eye_scanner_artwork.jpg');

export function FeatureArtwork({ kind = 'face' }: { kind?: DetectorKind }) {
  const theme = useAppTheme();
  const imageSource = kind === 'eye' ? eyeArtwork : faceArtwork;

  return (
    <View style={[styles.wrap, { borderColor: theme.border, backgroundColor: theme.surfaceAlt }]}>
      <Image source={imageSource} style={styles.image} resizeMode="cover" />
      <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.15)' }]} />
      <View style={[styles.ai, { backgroundColor: theme.surfaceGlass, borderColor: theme.border }]}>
        <Ionicons name="sparkles" size={13} color={theme.primary} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', height: 160, borderRadius: radii.lg, borderWidth: 1, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  image: { width: '100%', height: '100%' },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  ai: { position: 'absolute', right: 10, top: 10, width: 28, height: 28, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
});
