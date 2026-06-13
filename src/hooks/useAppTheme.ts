import { useColorScheme } from 'react-native';
import { darkTheme, lightTheme, type AppPalette } from '@/constants/theme';
import { useThemeStore } from '@/store/themeStore';

export function useAppTheme(): AppPalette {
  const systemScheme = useColorScheme();
  const mode = useThemeStore((state) => state.mode);
  const dark = mode === 'dark' || (mode === 'system' && systemScheme === 'dark');
  return dark ? darkTheme : lightTheme;
}

export function useResolvedTheme(): 'light' | 'dark' {
  const systemScheme = useColorScheme();
  const mode = useThemeStore((state) => state.mode);
  return mode === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : mode;
}
