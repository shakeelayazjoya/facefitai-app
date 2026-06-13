import { Text, type TextProps, type TextStyle } from 'react-native';
import { typography } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
type Variant = 'display' | 'hero' | 'title' | 'h1' | 'h2' | 'h3' | 'body' | 'small' | 'caption';
type Weight = 'regular' | 'medium' | 'bold' | 'black';
interface Props extends TextProps { variant?: Variant; muted?: boolean; color?: string; align?: TextStyle['textAlign']; weight?: Weight; editorial?: boolean }
const sizes: Record<Variant, number> = { ...typography, display: typography.hero, title: typography.h2 };
const weights: Record<Weight, TextStyle['fontWeight']> = { regular: '400', medium: '500', bold: '700', black: '900' };
export function AppText({ variant = 'body', muted, color, align, weight, editorial, style, ...props }: Props) { const theme = useAppTheme(); const heading = ['display', 'hero', 'title', 'h1', 'h2', 'h3'].includes(variant); const displayFace = editorial ?? ['display', 'hero', 'title', 'h1'].includes(variant); return <Text style={[{ color: color ?? (muted ? theme.mutedText : heading ? theme.textStrong : theme.text), textAlign: align, fontSize: sizes[variant], lineHeight: sizes[variant] * (heading ? 1.08 : 1.45), fontWeight: displayFace ? undefined : weight ? weights[weight] : heading ? '900' : variant === 'caption' ? '700' : '500', fontFamily: displayFace ? (weight === 'black' || weight === 'bold' ? 'CormorantGaramond_700Bold' : 'CormorantGaramond_600SemiBold') : undefined }, style]} {...props} />; }
