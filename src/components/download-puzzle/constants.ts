
// Page size definitions (width × height in points)
export const PAGE_SIZES = {
  A4: { width: 595.28, height: 841.89 },
  LETTER: { width: 612, height: 792 },
  LEGAL: { width: 612, height: 1008 },
  TABLOID: { width: 792, height: 1224 },
};

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

// Standard page size options for UI dropdowns
export const PAGE_SIZE_OPTIONS = [
  { label: "A4", value: "A4" },
  { label: "Letter", value: "LETTER" },
  { label: "Legal", value: "LEGAL" },
  { label: "Tabloid", value: "TABLOID" },
];

// Maximum multiplier values to prevent text from disappearing
export const MAX_MULTIPLIERS = {
  letter: 1.3,
  title: 1.5,
  subtitle: 1.5,
  instruction: 1.5,
  wordList: 1.5,
};
