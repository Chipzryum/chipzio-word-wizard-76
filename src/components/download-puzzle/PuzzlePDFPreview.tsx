
import { Document } from "@react-pdf/renderer";
import { PuzzleGrid } from "@/utils/wordSearchUtils";
import { CombinedPuzzleGrid, PageSettings } from "./types";
import { PDFDocument } from "./pdf-components/PDFDocument";
import { calculateFontSizes, getVerticalOffset } from "./pdf-components/PDFUtils";

interface PuzzlePDFPreviewProps {
  puzzle: CombinedPuzzleGrid | null;
  allPuzzles?: (CombinedPuzzleGrid & { pageSettings?: PageSettings })[];
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
  currentWidth: number;
  currentHeight: number;
  contentWidth: number;
  contentHeight: number;
  cellSize: number;
  letterSizeMultiplier: number;
  titleSizeMultiplier: number;
  subtitleSizeMultiplier: number;
  instructionSizeMultiplier: number;
  wordListSizeMultiplier: number;
  includeSolution?: boolean;
  showSolution?: boolean;
}

export const PuzzlePDFPreview = ({
  puzzle,
  allPuzzles = [],
  title,
  subtitle,
  instruction,
  showTitle,
  showSubtitle,
  showInstruction,
  showGrid,
  showWordList,
  titleOffset,
  subtitleOffset,
  instructionOffset,
  gridOffset,
  wordListOffset,
  currentWidth,
  currentHeight,
  contentWidth,
  contentHeight,
  cellSize,
  letterSizeMultiplier,
  titleSizeMultiplier,
  subtitleSizeMultiplier,
  instructionSizeMultiplier,
  wordListSizeMultiplier,
  includeSolution = true,
  showSolution = false,
}: PuzzlePDFPreviewProps) => {
  if (!puzzle) return null;
  
  // Determine which puzzles to render
  const puzzlesToRender = allPuzzles && allPuzzles.length > 0 ? allPuzzles : [puzzle];
  
  // Calculate font sizes for the PDF
  const fontSizes = calculateFontSizes(currentWidth, currentHeight, {
    titleSizeMultiplier,
    subtitleSizeMultiplier,
    instructionSizeMultiplier,
    wordListSizeMultiplier
  });
  
  // Create an offset calculator function
  const offsetCalculator = (offset: number) => getVerticalOffset(offset, contentHeight);
  
  // Process each puzzle's settings
  const processedPuzzles = puzzlesToRender.map(puzzleItem => {
    // If the puzzle has custom page settings, use those
    const pageSettings = puzzleItem.pageSettings || {
      title,
      subtitle,
      instruction,
      showTitle,
      showSubtitle,
      showInstruction,
      showGrid,
      showWordList,
      titleOffset,
      subtitleOffset,
      instructionOffset,
      gridOffset,
      wordListOffset,
      letterSizeMultiplier,
      titleSizeMultiplier,
      subtitleSizeMultiplier,
      instructionSizeMultiplier,
      wordListSizeMultiplier,
      cellSizeMultiplier: 1.0
    };
    
    return {
      ...puzzleItem,
      pageSettings
    };
  });
  
  // Render the PDF document
  return (
    <PDFDocument
      puzzlesToRender={processedPuzzles}
      title={title}
      subtitle={subtitle}
      instruction={instruction}
      showTitle={showTitle}
      showSubtitle={showSubtitle}
      showInstruction={showInstruction}
      showGrid={showGrid}
      showWordList={showWordList}
      titleOffset={titleOffset}
      subtitleOffset={subtitleOffset}
      instructionOffset={instructionOffset}
      gridOffset={gridOffset}
      wordListOffset={wordListOffset}
      currentWidth={currentWidth}
      currentHeight={currentHeight}
      contentWidth={contentWidth}
      contentHeight={contentHeight}
      cellSize={cellSize}
      letterSizeMultiplier={letterSizeMultiplier}
      titleSizeMultiplier={titleSizeMultiplier}
      subtitleSizeMultiplier={subtitleSizeMultiplier}
      instructionSizeMultiplier={instructionSizeMultiplier}
      wordListSizeMultiplier={wordListSizeMultiplier}
      includeSolution={includeSolution}
    />
  );
};
