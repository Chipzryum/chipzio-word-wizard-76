
import { PuzzleGrid } from "@/utils/wordSearchUtils";
import { CrosswordGrid } from "@/utils/crosswordUtils";

export interface PageSettings {
  title: string;
  subtitle: string;
  instruction: string;
  showTitle: boolean;
  showSubtitle: boolean;
  showInstruction: boolean;
  showGrid: boolean;
  showWordList: boolean;
  titleOffset: number;
  subtitleOffset: number;
  instructionOffset: number;
  gridOffset: number;
  wordListOffset: number;
  letterSizeMultiplier: number;
  titleSizeMultiplier: number;
  subtitleSizeMultiplier: number;
  instructionSizeMultiplier: number;
  wordListSizeMultiplier: number;
  cellSizeMultiplier: number;
}

export type CombinedPuzzleGrid = (PuzzleGrid | CrosswordGrid) & {
  isAnswer?: boolean;
  isQuestion?: boolean;
  pageSettings?: PageSettings;
};

export type PageSize = "A3" | "A4" | "LETTER" | "LEGAL" | "TABLOID" | "Custom";
export type Unit = "Points" | "Inches" | "Millimeters" | "Centimeters";

export interface FontSizes {
  titleSize: number;
  subtitleSize: number;
  instructionSize: number;
  wordListSize: number;
}
