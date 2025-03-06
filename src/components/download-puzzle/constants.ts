
// Page size definitions (width × height in points)
export const PAGE_SIZES = {
  A3: { width: 841.89, height: 1190.55 },
  A4: { width: 595.28, height: 841.89 },
  LETTER: { width: 612, height: 792 },
  LEGAL: { width: 612, height: 1008 },
  TABLOID: { width: 792, height: 1224 },
};

// Unit conversion factors
export const UNITS = {
  Points: 1,
  Inches: 72,
  Millimeters: 2.83465,
  Centimeters: 28.3465,
};

// PDF document constants
export const PDF_MARGIN = 40;
export const BORDER_WIDTH = 1;
export const BASE_PADDING = 20;
export const MAX_OFFSET = 5;

// Default values for controlling the PDF layout
export const DEFAULT_VALUES = {
  title: "WORD SEARCH",
  subtitle: "Find the hidden words",
  instruction: "Circle all the words from the list below",
  letterSizeMultiplier: 1,
  titleSizeMultiplier: 1,
  subtitleSizeMultiplier: 1,
  instructionSizeMultiplier: 1,
  wordListSizeMultiplier: 1,
  titleOffset: 0,
  subtitleOffset: 0,
  instructionOffset: 0,
  gridOffset: 0,
  wordListOffset: 0,
};

// Default multiplier values
export const DEFAULT_TITLE_MULTIPLIER = 1;
export const DEFAULT_SUBTITLE_MULTIPLIER = 1;
export const DEFAULT_INSTRUCTION_MULTIPLIER = 1;
export const DEFAULT_CELL_MULTIPLIER = 1;
export const DEFAULT_LETTER_SIZE_MULTIPLIER = 1;
export const DEFAULT_WORDLIST_MULTIPLIER = 1;
export const MAX_LETTER_SIZE = 1.3;

// Standard page size options for UI dropdowns
export const PAGE_SIZE_OPTIONS = [
  { label: "A3", value: "A3" },
  { label: "A4", value: "A4" },
  { label: "Letter", value: "LETTER" },
  { label: "Legal", value: "LEGAL" },
  { label: "Tabloid", value: "TABLOID" },
  { label: "Custom", value: "Custom" },
];

// Maximum multiplier values to prevent text from disappearing
export const MAX_MULTIPLIERS = {
  letter: 1.3,
  title: 1.5,
  subtitle: 1.5,
  instruction: 1.5,
  wordList: 1.5,
};

// TypeScript types
export type PageSize = keyof typeof PAGE_SIZES | "Custom";
export type Unit = keyof typeof UNITS;
