import React from 'react';

// Port of Barcelona mark: a light bar over a blue wave, tilted 45°. Paths are drawn level in a
// 32×32 box and rotated by BARCELONA_MARK_TRANSFORM, so the splash screen can reuse them.
export const BARCELONA_MARK_BAR = 'M5,6.5L27,6.5L27,13.5L5,13.5Z';
export const BARCELONA_MARK_WAVE = 'M5,18C11,14 19,20.5 27,16L27,24C21,28.5 13,22 5,26.5Z';
export const BARCELONA_MARK_TRANSFORM = 'rotate(-45 16 16)';
export const BARCELONA_MARK_BLUE = '#3b82f6';

interface BarcelonaLogoProps {
  size?: number;
  // Colour of the bar — white on dark backgrounds, slate on light ones
  barColor?: string;
}

export const BarcelonaLogo: React.FC<BarcelonaLogoProps> = ({ size = 28, barColor = '#ffffff' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 32 32" aria-label="Port of Barcelona" role="img">
    <g transform={BARCELONA_MARK_TRANSFORM}>
      <path d={BARCELONA_MARK_BAR} fill={barColor} />
      <path d={BARCELONA_MARK_WAVE} fill={BARCELONA_MARK_BLUE} />
    </g>
  </svg>
);

// Standalone SVG for the browser tab icon
export const barcelonaFaviconHref = () =>
  'data:image/svg+xml,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><g transform="${BARCELONA_MARK_TRANSFORM}">` +
    `<path d="${BARCELONA_MARK_BAR}" fill="#1e293b"/><path d="${BARCELONA_MARK_WAVE}" fill="${BARCELONA_MARK_BLUE}"/></g></svg>`
  );
