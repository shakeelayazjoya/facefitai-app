import { useColorScheme } from 'react-native';
import { darkTheme, lightTheme, type AppPalette } from '@/constants/theme';
export function useAppTheme(): AppPalette { return useColorScheme() === 'dark' ? darkTheme : lightTheme; }
