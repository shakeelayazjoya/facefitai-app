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
}

export const lightTheme: AppPalette = {
  background: '#F4F7F5', backgroundElevated: '#EDF7F1', surface: '#FFFFFF', surfaceAlt: '#F0F7F3', surfaceGlass: 'rgba(255,255,255,0.88)',
  text: '#334155', textStrong: '#0B1F16', mutedText: '#64748B', primary: '#16A34A', primaryDark: '#0D7A36', primarySoft: '#DCFCE7',
  secondary: '#0F766E', accent: '#7C3AED', border: '#DDE8E1', borderStrong: '#BDD4C5', danger: '#DC2626', dangerSoft: '#FEE2E2',
  warning: '#D97706', warningSoft: '#FEF3C7', success: '#16A34A', successSoft: '#DCFCE7', info: '#0284C7', white: '#FFFFFF', black: '#020617',
  overlay: 'rgba(2,6,23,0.52)', shadow: 'rgba(15,23,42,0.14)',
};

export const darkTheme: AppPalette = {
  background: '#06100B', backgroundElevated: '#0A1810', surface: '#0F2016', surfaceAlt: '#142B1D', surfaceGlass: 'rgba(15,32,22,0.9)',
  text: '#D8E5DC', textStrong: '#F8FAFC', mutedText: '#91A79A', primary: '#35D06F', primaryDark: '#20A953', primarySoft: '#123D23',
  secondary: '#2DD4BF', accent: '#A78BFA', border: '#23442E', borderStrong: '#356344', danger: '#FB7185', dangerSoft: '#4A1822',
  warning: '#FBBF24', warningSoft: '#4A3510', success: '#35D06F', successSoft: '#123D23', info: '#38BDF8', white: '#FFFFFF', black: '#020617',
  overlay: 'rgba(2,6,23,0.72)', shadow: 'rgba(0,0,0,0.42)',
};

export const spacing = { xxs: 2, xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32, huge: 40 } as const;
export const radii = { sm: 10, md: 14, lg: 18, xl: 24, xxl: 30, hero: 36, pill: 999 } as const;
export const typography = { hero: 33, h1: 27, h2: 22, h3: 17, body: 14, small: 12, caption: 10 } as const;
export const layout = { maxContentWidth: 760, screenPadding: 18, tabBarHeight: 68, safeTop: 56 } as const;
