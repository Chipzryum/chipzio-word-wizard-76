
import { PuzzleGrid } from "@/utils/wordSearchUtils";
import { CrosswordGrid } from "@/utils/crosswordUtils";

export type CombinedPuzzleGrid = PuzzleGrid | CrosswordGrid;

export type PageSize = "A3" | "A4" | "LETTER" | "LEGAL" | "TABLOID" | "Custom";
export type Unit = "Points" | "Inches" | "Millimeters" | "Centimeters";

export interface FontSizes {
  titleSize: number;
  subtitleSize: number;
  instructionSize: number;
  wordListSize: number;
}
