
// PDF size and unit constants
export const PAGE_SIZES = {
  'A3': { width: 841.89, height: 1190.55 },
  'A4': { width: 595.28, height: 841.89 },
  'A5': { width: 419.53, height: 595.28 },
  'A6': { width: 297.64, height: 419.53 },
  'Letter': { width: 612, height: 792 },
  'Legal': { width: 612, height: 1008 },
  'Custom': { width: 595.28, height: 841.89 },
};

export const UNITS = {
  'Points': 1,
  'Millimeters': 2.83465,
  'Inches': 72,
};

export type PageSize = keyof typeof PAGE_SIZES;
export type Unit = keyof typeof UNITS;

// Constants for PDF layout
export const PDF_MARGIN = 40;
export const BORDER_WIDTH = 2;
export const BASE_PADDING = 20;
export const MAX_OFFSET = 5;

// Default font size multipliers
export const DEFAULT_TITLE_MULTIPLIER = 1.0;
export const DEFAULT_SUBTITLE_MULTIPLIER = 1.0;
export const DEFAULT_INSTRUCTION_MULTIPLIER = 1.0;
export const DEFAULT_CELL_MULTIPLIER = 1.0;
export const DEFAULT_LETTER_SIZE_MULTIPLIER = 1.0;
export const DEFAULT_WORDLIST_MULTIPLIER = 1.0;

export const convertFromPoints = (points: number, unit: Unit): string => {
  return (points / UNITS[unit]).toFixed(2);
};

// Calculate vertical position offset with improved boundary checking
export const getVerticalOffset = (offset: number, contentHeight: number): number => {
  // Each unit is 10 points, limit to prevent going off page
  const maxAllowedOffset = Math.min(MAX_OFFSET, (contentHeight / 6) / 10);
  return Math.max(-maxAllowedOffset, Math.min(offset * 10, maxAllowedOffset * 10));
};

// Format slider value for display
export const formatSliderValue = (value: number): string => {
  return `${(value * 100).toFixed(0)}%`;
};
