import { useMutation } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { AppText } from '@/components/ui/AppText';
import { AppButton } from '@/components/ui/Button';
import { AppInput } from '@/components/ui/Input';
import { GradientHeader } from '@/components/ui/GradientHeader';
import { ProtectedRoute } from '@/components/ui/ProtectedRoute';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { ImagePickerPanel } from '@/features/detectors/ImagePickerPanel';
import { radii, spacing } from '@/constants/theme';
import { facefitApi } from '@/services/facefitApi';
import { useToast } from '@/hooks/useToast';
import type { ApiError } from '@/services/apiClient';
import type { StyleEditRegion } from '@/types/api';
import type { ImageAsset } from '@/utils/formData';
import { useResponsive } from '@/utils/responsive';

const regions: StyleEditRegion[] = ['hair', 'glasses', 'beard', 'lips', 'nose'];
export function StyleEditScreen() {
  const { showToast } = useToast(); const responsive = useResponsive(); const [asset, setAsset] = useState<ImageAsset | null>(null); const [region, setRegion] = useState<StyleEditRegion>('hair'); const [instruction, setInstruction] = useState('Natural and realistic');
  const mutation = useMutation({ mutationFn: () => facefitApi.generateStyleEdit({ asset: asset as ImageAsset, region, instruction }), onError: (error: ApiError) => showToast(error.message) });
  const imageUri = mutation.data ? `data:${mutation.data.mime_type};base64,${mutation.data.image_base64}` : asset?.uri;
  return <ProtectedRoute><ScreenWrapper><ScrollView contentContainerStyle={styles.screen}><View style={[styles.content, { maxWidth: responsive.contentWidth }]}><GradientHeader eyebrow="AI preview" title="Style studio" description="Try a new look." icon="color-wand-outline" /><ImagePickerPanel title="Source photo" description="Use a clear selfie." processing={mutation.isPending} loadingLabel="Creating preview" disabled={mutation.isPending} onPick={setAsset} />{imageUri ? <Image source={{ uri: imageUri }} style={styles.preview} contentFit="cover" cachePolicy="memory-disk" transition={180} /> : null}<AnimatedCard><AppText variant="h3">Edit area</AppText><View style={styles.regions}>{regions.map((item) => <AppButton key={item} size="sm" title={item} variant={item === region ? 'primary' : 'secondary'} onPress={() => setRegion(item)} />)}</View><AppInput label="Direction" multiline value={instruction} onChangeText={setInstruction} /><AppButton loading={mutation.isPending} disabled={!asset} title="Generate" icon="sparkles-outline" onPress={() => mutation.mutate()} /></AnimatedCard></View></ScrollView></ScreenWrapper></ProtectedRoute>;
}
const styles = StyleSheet.create({ screen: { padding: spacing.md, paddingBottom: 40 }, content: { width: '100%', alignSelf: 'center', gap: spacing.md }, preview: { width: '100%', aspectRatio: 1, maxHeight: 420, borderRadius: radii.xl }, regions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginVertical: spacing.md } });
