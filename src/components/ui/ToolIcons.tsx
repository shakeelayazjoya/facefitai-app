import Svg, { Circle, G, Path, Rect } from 'react-native-svg';

// Face Illustration SVG graphic for Golden Ratio banner card
export function FaceIllustrationSvg({ width = 90, height = 100, color = '#0F7662' }: { width?: number; height?: number; color?: string }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 100 110" fill="none">
      {/* Face Contour Fill */}
      <Path
        d="M50 8C28 8 16 26 16 54C16 82 30 98 50 98C70 98 84 82 84 54C84 26 72 8 50 8Z"
        fill={color}
        fillOpacity="0.08"
      />
      {/* Outer Face Contour Line */}
      <Path
        d="M50 8C28 8 16 26 16 54C16 82 30 98 50 98C70 98 84 82 84 54C84 26 72 8 50 8Z"
        stroke={color}
        strokeWidth="2.2"
        strokeOpacity="0.6"
      />
      {/* Hairline arc */}
      <Path d="M22 32C32 20 68 20 78 32" stroke={color} strokeWidth="2" strokeOpacity="0.5" strokeLinecap="round" />
      {/* Eyebrows */}
      <Path d="M30 38C36 35 42 36 45 39" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <Path d="M70 38C64 35 58 36 55 39" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      {/* Eyes */}
      <Path d="M29 46C34 43 41 45 44 48C41 51 34 51 29 46Z" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.25" />
      <Path d="M71 46C66 43 59 45 56 48C59 51 66 51 71 46Z" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.25" />
      <Circle cx="36" cy="47" r="2" fill={color} />
      <Circle cx="64" cy="47" r="2" fill={color} />
      {/* Nose */}
      <Path d="M50 46V64C47 65 45 67 48 69H52C55 67 53 65 50 64" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Lips */}
      <Path d="M36 80C44 78 56 78 64 80C56 86 44 86 36 80Z" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.25" />
      {/* Ears */}
      <Path d="M16 46C12 50 12 58 16 62" stroke={color} strokeWidth="2" strokeOpacity="0.5" />
      <Path d="M84 46C88 50 88 58 84 62" stroke={color} strokeWidth="2" strokeOpacity="0.5" />
      {/* Neck */}
      <Path d="M34 94V106" stroke={color} strokeWidth="2" strokeOpacity="0.4" />
      <Path d="M66 94V106" stroke={color} strokeWidth="2" strokeOpacity="0.4" />
    </Svg>
  );
}

// Face Age Illustration SVG graphic with clock badge
export function FaceAgeSvg({ width = 90, height = 100, color = '#0F7662' }: { width?: number; height?: number; color?: string }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 100 110" fill="none">
      {/* Face Contour */}
      <Path
        d="M44 8C24 8 13 26 13 54C13 82 26 98 44 98C62 98 75 82 75 54C75 26 64 8 44 8Z"
        stroke={color}
        strokeWidth="2.2"
        strokeOpacity="0.6"
        fill={color}
        fillOpacity="0.08"
      />
      {/* Hairline */}
      <Path d="M19 32C28 20 60 20 69 32" stroke={color} strokeWidth="2" strokeOpacity="0.5" strokeLinecap="round" />
      {/* Eyebrows */}
      <Path d="M26 38C32 35 37 36 40 39" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Path d="M62 38C56 35 51 36 48 39" stroke={color} strokeWidth="2" strokeLinecap="round" />
      {/* Eyes */}
      <Circle cx="33" cy="46" r="3.5" fill={color} />
      <Circle cx="55" cy="46" r="3.5" fill={color} />
      {/* Smile */}
      <Path d="M30 74C38 80 50 80 58 74" stroke={color} strokeWidth="2.2" strokeLinecap="round" />

      {/* Clock Badge Overlay */}
      <G transform="translate(52, 48)">
        <Circle cx="20" cy="20" r="17" fill="#FFFFFF" stroke={color} strokeWidth="2.5" />
        <Path d="M20 10V20L27 24" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </G>
    </Svg>
  );
}

// Color Analysis Palette SVG Icon (Increased size & stroke width)
export function ColorPaletteSvg({ size = 38, color = '#0F7662' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <Path
        d="M18 4C10.27 4 4 10.27 4 18C4 25.73 10.27 32 18 32C19.84 32 21.33 30.51 21.33 28.67C21.33 27.83 20.97 27.08 20.43 26.5C19.91 25.95 19.59 25.21 19.59 24.42C19.59 22.75 20.94 21.4 22.61 21.4H25.3C28.97 21.4 32 18.37 32 14.7C32 8.8 25.73 4 18 4Z"
        stroke={color}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="12" cy="13" r="2.5" fill={color} />
      <Circle cx="18" cy="10" r="2.5" fill={color} />
      <Circle cx="24" cy="12" r="2.5" fill={color} />
      <Circle cx="12" cy="20" r="2.5" fill={color} />
    </Svg>
  );
}

// Skin Tone Pipette / Dropper SVG Icon (Increased size & stroke width)
export function SkinToneSvg({ size = 38, color = '#0F7662' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <Path d="M22 5L29 12" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
      <Path d="M19 8L26 15" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
      <Path d="M10 17L18 9L24 15L16 23L10 17Z" stroke={color} strokeWidth="2.6" strokeLinejoin="round" />
      <Path d="M10 17L6 24L8 26L16 23" stroke={color} strokeWidth="2.6" strokeLinejoin="round" />
      {/* Color swatches */}
      <Rect x="7" y="27" width="5.5" height="5.5" rx="1.5" fill="#E5C1A2" />
      <Rect x="14" y="27" width="5.5" height="5.5" rx="1.5" fill="#C68A5C" />
      <Rect x="21" y="27" width="5.5" height="5.5" rx="1.5" fill="#8D5524" />
    </Svg>
  );
}

// Body Shape Silhouette SVG Icon (Increased size & dashed circle)
export function BodyShapeSvg({ size = 40, color = '#0F7662' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <Circle cx="18" cy="7" r="3" stroke={color} strokeWidth="2.2" />
      <Path
        d="M13 14C13 14 16 16 18 16C20 16 23 14 23 14C25 18 21 22 21 25C22 29 23 32 23 32H13C13 32 14 29 15 25C15 22 11 18 13 14Z"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Dotted circle guidelines */}
      <Circle cx="18" cy="19.5" r="13" stroke={color} strokeWidth="1.4" strokeDasharray="3 3" strokeOpacity="0.45" />
    </Svg>
  );
}

// Body Type Swimsuit / Bikini Silhouette SVG Icon (Increased size & bold lines)
export function BodyTypeSvg({ size = 38, color = '#0F7662' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <Path
        d="M11 8C11 8 14.5 16 18 16C21.5 16 25 8 25 8M11 8H25M12 20C14.5 22.5 18 23.5 18 23.5C18 23.5 21.5 22.5 24 20M10 25H26C26 25 22.5 33 18 33C13.5 33 10 25 10 25Z"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Kibbe Dress SVG Icon (Increased size & green tint)
export function KibbeDressSvg({ size = 38, color = '#0F7662' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <Path
        d="M14 6L11 12L15 17.5L10 32H26L21 17.5L25 12L22 6H14Z"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={color}
        fillOpacity="0.25"
      />
      <Path d="M14 6C14 8.5 22 8.5 22 6" stroke={color} strokeWidth="2.2" />
    </Svg>
  );
}

// Kibbe Checklist / Clipboard SVG Icon (Increased size & bold checkmark)
export function KibbeTestSvg({ size = 38, color = '#0F7662' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <Rect x="8" y="6" width="20" height="25" rx="4" stroke={color} strokeWidth="2.5" />
      <Path d="M12.5 4H23.5V8.5H12.5V4Z" fill={color} />
      <Path d="M12 14L15 17L20.5 11.5" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M13 21H23" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <Path d="M13 26H21" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    </Svg>
  );
}

// Celebrity Star SVG Icon (Increased size & bold star outline)
export function CelebrityStarSvg({ size = 38, color = '#0F7662' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <Path
        d="M18 5L21.9 13L30.5 14.25L24.25 20.3L25.7 28.85L18 24.8L10.3 28.85L11.75 20.3L5.5 14.25L14.1 13L18 5Z"
        stroke={color}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
