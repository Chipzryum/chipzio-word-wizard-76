
// Page size definitions in points
export const PAGE_SIZES = {
  'A3': { width: 841.89, height: 1190.55 },
  'A4': { width: 595.28, height: 841.89 },
  'A5': { width: 419.53, height: 595.28 },
  'A6': { width: 297.64, height: 419.53 },
  'Letter': { width: 612, height: 792 },
  'Legal': { width: 612, height: 1008 },
  'Custom': { width: 595.28, height: 841.89 },
};

// Unit conversion factors
export const UNITS = {
  'Points': 1,
  'Millimeters': 2.83465,
  'Inches': 72,
};

// Constants for PDF layout
export const PDF_MARGIN = 40;
export const BORDER_WIDTH = 1;
export const BASE_PADDING = 20;
export const MAX_OFFSET = 5;

// Default font size multipliers
export const DEFAULT_TITLE_MULTIPLIER = 1.0;
export const DEFAULT_SUBTITLE_MULTIPLIER = 1.0;
export const DEFAULT_INSTRUCTION_MULTIPLIER = 1.0;
export const DEFAULT_CELL_MULTIPLIER = 1.0;
export const DEFAULT_LETTER_SIZE_MULTIPLIER = 1.0;
export const DEFAULT_WORDLIST_MULTIPLIER = 1.0;

// Maximum letter size to prevent disappearing text
export const MAX_LETTER_SIZE = 1.3;

export type PageSize = keyof typeof PAGE_SIZES;
export type Unit = keyof typeof UNITS;
