
// Page size options
export const PAGE_SIZE_OPTIONS = [
  { value: "a4", label: "A4", width: 595.28, height: 841.89 },
  { value: "letter", label: "Letter", width: 612, height: 792 },
  { value: "legal", label: "Legal", width: 612, height: 1008 },
];

// Maximum multiplier for letter size
export const MAX_LETTER_SIZE = 1.3;

// Page sizes
export const PAGE_SIZES = {
  a4: { width: 595.28, height: 841.89 },
  letter: { width: 612, height: 792 },
  legal: { width: 612, height: 1008 },
};

// Default values for the control panel
export const DEFAULT_VALUES = {
  letterSizeMultiplier: 1,
  titleSizeMultiplier: 1.2,
  subtitleSizeMultiplier: 1,
  instructionSizeMultiplier: 0.9,
  wordListSizeMultiplier: 0.8,
  cellSizeMultiplier: 1,
  imageOpacity: 0.3,
};

// Maximum multipliers for different elements
export const MAX_MULTIPLIERS = {
  letter: MAX_LETTER_SIZE,
  title: 1.5,
  subtitle: 1.3,
  instruction: 1.2,
  wordList: 1.2,
  cell: 1.3,
};

// Design angle limits
export const MIN_DESIGN_ANGLE = 0;
export const MAX_DESIGN_ANGLE = 360;

// Design size limits (as multipliers)
export const MIN_DESIGN_SIZE = 0.2;
export const MAX_DESIGN_SIZE = 2.0;

// Design spacing limits (as multipliers)
export const MIN_DESIGN_SPACING = 0.5;
export const MAX_DESIGN_SPACING = 3.0;

// Unit type for measurements
export type Unit = "Points" | "Inches" | "Millimeters" | "Centimeters";
