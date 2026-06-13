import { useWindowDimensions } from 'react-native';
import { layout } from '@/constants/theme';

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function useResponsive() {
  const { width, height, fontScale } = useWindowDimensions();
  const compact = width <= 380;
  const tablet = width >= 768;
  const contentWidth = Math.min(width, layout.maxContentWidth);
  const gutter = tablet ? 28 : compact ? 14 : layout.screenPadding;
  const scale = clamp(width / 390, 0.9, 1.18);
  const font = (size: number) => clamp(size * scale, size * 0.92, size * 1.16) / Math.max(fontScale, 1);
  return { width, height, compact, tablet, contentWidth, gutter, scale, font };
}
