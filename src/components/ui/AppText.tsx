import { Text, type TextProps, type TextStyle } from 'react-native';
import { typography } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
type Variant = 'display' | 'hero' | 'title' | 'h1' | 'h2' | 'h3' | 'body' | 'small' | 'caption';
type Weight = 'regular' | 'medium' | 'bold' | 'black';
interface Props extends TextProps { variant?: Variant; muted?: boolean; color?: string; align?: TextStyle['textAlign']; weight?: Weight }
const sizes: Record<Variant, number> = { ...typography, display: typography.hero, title: typography.h2 };
const weights: Record<Weight, TextStyle['fontWeight']> = { regular: '400', medium: '500', bold: '700', black: '900' };
export function AppText({ variant = 'body', muted, color, align, weight, style, ...props }: Props) { const theme = useAppTheme(); const heading = ['display', 'hero', 'title', 'h1', 'h2', 'h3'].includes(variant); return <Text style={[{ color: color ?? (muted ? theme.mutedText : heading ? theme.textStrong : theme.text), textAlign: align, fontSize: sizes[variant], lineHeight: sizes[variant] * (heading ? 1.12 : 1.45), fontWeight: weight ? weights[weight] : heading ? '900' : variant === 'caption' ? '700' : '500' }, style]} {...props} />; }
