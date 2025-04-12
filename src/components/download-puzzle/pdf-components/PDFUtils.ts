
// Utility functions for PDF generation

/**
 * Calculate font sizes based on page dimensions and multipliers
 */
export function calculateFontSizes(
  currentWidth: number,
  currentHeight: number,
  multipliers: {
    titleSizeMultiplier: number;
    subtitleSizeMultiplier: number;
    instructionSizeMultiplier: number;
    wordListSizeMultiplier: number;
  }
) {
  const a4Width = 595.28;
  const a4Height = 841.89;
  const sizeRatio = Math.sqrt((currentWidth * currentHeight) / (a4Width * a4Height));
  
  return {
    titleSize: Math.max(20, Math.min(48, Math.floor(36 * sizeRatio * multipliers.titleSizeMultiplier))),
    subtitleSize: Math.max(14, Math.min(36, Math.floor(24 * sizeRatio * multipliers.subtitleSizeMultiplier))),
    instructionSize: Math.max(8, Math.min(24, Math.floor(14 * sizeRatio * multipliers.instructionSizeMultiplier))),
    wordListSize: Math.max(6, Math.min(28, Math.floor(12 * sizeRatio * multipliers.wordListSizeMultiplier))),
  };
}

/**
 * Calculate vertical offsets for page elements
 */
export function getVerticalOffset(offset: number, contentHeight: number) {
  const maxAllowedOffset = Math.min(5, (contentHeight / 6) / 10);
  return Math.max(-maxAllowedOffset, Math.min(offset * 10, maxAllowedOffset * 10));
}
