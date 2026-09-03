import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { View, StyleSheet } from 'react-native';

interface BrandLogoProps {
  size?: number;
}

export function BrandLogo({ size = 44 }: BrandLogoProps) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 120 120" fill="none">
        <Defs>
          <LinearGradient id="logoPurpleGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#8B5CF6" />
            <Stop offset="100%" stopColor="#6D28D9" />
          </LinearGradient>
          <LinearGradient id="logoTealGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#34D399" />
            <Stop offset="100%" stopColor="#059669" />
          </LinearGradient>
        </Defs>

        {/* Halftone Outer Dots Matrix Left (Purple) */}
        {[
          [35, 25, 2.8], [25, 32, 3.2], [38, 38, 3.6], [18, 42, 2.5], [30, 48, 4.2],
          [14, 54, 2.2], [26, 58, 4.5], [38, 56, 4.0], [16, 68, 2.5], [28, 70, 4.5],
          [20, 80, 3.2], [34, 82, 3.6], [26, 90, 2.8], [36, 92, 2.5]
        ].map(([cx, cy, r], i) => (
          <Circle key={`p-dot-${i}`} cx={cx} cy={cy} r={r} fill="url(#logoPurpleGrad)" />
        ))}

        {/* Halftone Outer Dots Matrix Right (Teal) */}
        {[
          [85, 25, 2.8], [95, 32, 3.2], [82, 38, 3.6], [102, 42, 2.5], [90, 48, 4.2],
          [106, 54, 2.2], [94, 58, 4.5], [82, 56, 4.0], [104, 68, 2.5], [92, 70, 4.5],
          [100, 80, 3.2], [86, 82, 3.6], [94, 90, 2.8], [84, 92, 2.5]
        ].map(([cx, cy, r], i) => (
          <Circle key={`t-dot-${i}`} cx={cx} cy={cy} r={r} fill="url(#logoTealGrad)" />
        ))}

        {/* Left Profile Silhouette (Purple) */}
        <Path
          d="M 54,16 C 52,20 46,24 45,30 C 44,35 48,39 46,45 C 44,49 39,52 40,57 C 41,61 47,64 46,70 C 45,75 41,79 44,85 C 47,91 52,95 53,99 C 60,91 58,79 56,73 C 54,67 48,61 49,55 C 50,49 56,43 55,37 C 54,31 56,23 54,16 Z"
          fill="url(#logoPurpleGrad)"
        />

        {/* Right Profile Silhouette (Teal) */}
        <Path
          d="M 66,16 C 68,20 74,24 75,30 C 76,35 72,39 74,45 C 76,49 81,52 80,57 C 79,61 73,64 74,70 C 75,75 79,79 76,85 C 73,91 68,95 67,99 C 60,91 62,79 64,73 C 66,67 72,61 71,55 C 70,49 64,43 65,37 C 66,31 64,23 66,16 Z"
          fill="url(#logoTealGrad)"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
