export type ThemeMode = 'system' | 'light' | 'dark';

export interface AppPalette {
  background: string;
  backgroundElevated: string;
  surface: string;
  surfaceAlt: string;
  surfaceGlass: string;
  text: string;
  textStrong: string;
  mutedText: string;
  primary: string;
  primaryDark: string;
  primarySoft: string;
  secondary: string;
  accent: string;
  border: string;
  borderStrong: string;
  danger: string;
  dangerSoft: string;
  warning: string;
  warningSoft: string;
  success: string;
  successSoft: string;
  info: string;
  white: string;
  black: string;
  overlay: string;
  shadow: string;
  gold: string;
  goldSoft: string;
  gradientStart: string;
  gradientEnd: string;
  glow: string;
}

export const lightTheme: AppPalette = {
  background: '#F8FAFC', backgroundElevated: '#FFFFFF', surface: '#FFFFFF', surfaceAlt: '#F1F5F9', surfaceGlass: 'rgba(255,255,255,0.85)',
  text: '#334155', textStrong: '#0F172A', mutedText: '#64748B', primary: '#7C3AED', primaryDark: '#5B21B6', primarySoft: '#EDE9FE',
  secondary: '#10B981', accent: '#8B5CF6', border: '#E2E8F0', borderStrong: '#CBD5E1', danger: '#EF4444', dangerSoft: '#FEE2E2',
  warning: '#F59E0B', warningSoft: '#FEF3C7', success: '#10B981', successSoft: '#D1FAE5', info: '#3B82F6', white: '#FFFFFF', black: '#0F172A',
  overlay: 'rgba(15,23,42,0.55)', shadow: 'rgba(124,58,237,0.14)', gold: '#7C3AED', goldSoft: '#EDE9FE', gradientStart: '#7C3AED', gradientEnd: '#10B981', glow: 'rgba(124,58,237,0.2)',
};

export const darkTheme: AppPalette = {
  background: '#0B0F19', backgroundElevated: '#111827', surface: '#1E293B', surfaceAlt: '#334155', surfaceGlass: 'rgba(30,41,59,0.82)',
  text: '#E2E8F0', textStrong: '#F8FAFC', mutedText: '#94A3B8', primary: '#A78BFA', primaryDark: '#7C3AED', primarySoft: '#2E1065',
  secondary: '#34D399', accent: '#C4B5FD', border: '#334155', borderStrong: '#475569', danger: '#F87171', dangerSoft: '#451A1A',
  warning: '#FBBF24', warningSoft: '#45300B', success: '#34D399', successSoft: '#064E3B', info: '#60A5FA', white: '#FFFFFF', black: '#020617',
  overlay: 'rgba(2,6,23,0.78)', shadow: 'rgba(0,0,0,0.5)', gold: '#A78BFA', goldSoft: '#2E1065', gradientStart: '#7C3AED', gradientEnd: '#10B981', glow: 'rgba(167,139,250,0.22)',
};

export const spacing = { xxs: 2, xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32, huge: 40 } as const;
export const radii = { sm: 10, md: 14, lg: 18, xl: 24, xxl: 30, hero: 36, pill: 999 } as const;
export const typography = { hero: 30, h1: 24, h2: 20, h3: 16, body: 13, small: 11, caption: 9 } as const;
export const layout = { maxContentWidth: 760, screenPadding: 18, tabBarHeight: 56, safeTop: 56 } as const;
