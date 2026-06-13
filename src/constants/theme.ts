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
  background: '#E7EFE9', backgroundElevated: '#DCE9E1', surface: '#F5F8F4', surfaceAlt: '#E0EBE4', surfaceGlass: 'rgba(244,248,245,0.78)',
  text: '#334A42', textStrong: '#102D26', mutedText: '#657D75', primary: '#0A6B58', primaryDark: '#064D40', primarySoft: '#CDE5DA',
  secondary: '#167B68', accent: '#A77833', border: '#BBD0C6', borderStrong: '#8FAEA0', danger: '#A83D3D', dangerSoft: '#F0D7D4',
  warning: '#A77833', warningSoft: '#EDE0C7', success: '#0A6B58', successSoft: '#CDE5DA', info: '#34766F', white: '#FFFFFF', black: '#071814',
  overlay: 'rgba(7,24,20,0.56)', shadow: 'rgba(7,35,29,0.18)', gold: '#A77833', goldSoft: '#EDE0C7', gradientStart: '#EAF2ED', gradientEnd: '#D6E5DD', glow: 'rgba(16,121,98,0.16)',
};

export const darkTheme: AppPalette = {
  background: '#062D29', backgroundElevated: '#0A3A34', surface: '#123F39', surfaceAlt: '#174A43', surfaceGlass: 'rgba(18,63,57,0.76)',
  text: '#D4E2DC', textStrong: '#F7F3E8', mutedText: '#9DB5AC', primary: '#39B88D', primaryDark: '#168064', primarySoft: '#174F45',
  secondary: '#0F8A73', accent: '#D4B06A', border: '#3D655C', borderStrong: '#66877E', danger: '#EF8A8A', dangerSoft: '#5A2828',
  warning: '#D4B06A', warningSoft: '#55482B', success: '#58C9A0', successSoft: '#174F45', info: '#75B7AC', white: '#FFFFFF', black: '#031411',
  overlay: 'rgba(2,18,15,0.78)', shadow: 'rgba(0,0,0,0.46)', gold: '#D4B06A', goldSoft: '#55482B', gradientStart: '#073832', gradientEnd: '#031F1C', glow: 'rgba(69,205,161,0.18)',
};

export const spacing = { xxs: 2, xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32, huge: 40 } as const;
export const radii = { sm: 10, md: 14, lg: 18, xl: 24, xxl: 30, hero: 36, pill: 999 } as const;
export const typography = { hero: 30, h1: 24, h2: 20, h3: 16, body: 13, small: 11, caption: 9 } as const;
export const layout = { maxContentWidth: 760, screenPadding: 18, tabBarHeight: 68, safeTop: 56 } as const;
