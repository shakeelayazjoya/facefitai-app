export interface AppPalette {
  background: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  mutedText: string;
  primary: string;
  primaryDark: string;
  primarySoft: string;
  border: string;
  danger: string;
  warning: string;
  success: string;
  white: string;
  black: string;
}
export const lightTheme: AppPalette = {
  background: '#F7F5F0', surface: '#FFFFFF', surfaceAlt: '#EEF8EF', text: '#0F172A', mutedText: '#64748B', primary: '#16A34A', primaryDark: '#15803D', primarySoft: '#DCFCE7', border: '#E2E8F0', danger: '#DC2626', warning: '#D97706', success: '#16A34A', white: '#FFFFFF', black: '#020617',
};
export const darkTheme: AppPalette = {
  background: '#07130B', surface: '#0F1F15', surfaceAlt: '#112A19', text: '#F8FAFC', mutedText: '#A8B5AA', primary: '#22C55E', primaryDark: '#16A34A', primarySoft: '#143D22', border: '#24462E', danger: '#F87171', warning: '#FBBF24', success: '#22C55E', white: '#FFFFFF', black: '#020617',
};
export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
export const radii = { sm: 10, md: 14, lg: 20, xl: 28, pill: 999 } as const;
