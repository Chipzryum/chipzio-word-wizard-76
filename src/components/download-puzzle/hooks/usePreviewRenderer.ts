
import { useMemo } from "react";
import { VisualPreview } from "../VisualPreview";
import { CrosswordVisualPreview } from "../CrosswordVisualPreview";
import { CombinedPuzzleGrid } from "../types";

interface UsePreviewRendererProps {
  puzzles: CombinedPuzzleGrid[];
  activePuzzleIndex: number;
  displayPages: any[];
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
  showLivePreview: boolean;
  isPDFReady: boolean;
  currentWidth: number;
  currentHeight: number;
  contentWidth: number;
  contentHeight: number;
  cellSize: number;
  letterSize: number;
  letterSizeMultiplier: number;
  titleSizeMultiplier: number;
  subtitleSizeMultiplier: number;
  instructionSizeMultiplier: number;
  wordListSizeMultiplier: number;
  fontSizes: {
    titleSize: number;
    subtitleSize: number;
    instructionSize: number;
    wordListSize: number;
  };
  getVerticalOffset: (offset: number) => number;
  includeSolution: boolean;
  visualPreviewComponent?: "wordsearch" | "crossword";
}

export const usePreviewRenderer = ({
  puzzles,
  activePuzzleIndex,
  displayPages,
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
  showLivePreview,
  isPDFReady,
  currentWidth,
  currentHeight,
  contentWidth,
  contentHeight,
  cellSize,
  letterSize,
  letterSizeMultiplier,
  titleSizeMultiplier,
  subtitleSizeMultiplier,
  instructionSizeMultiplier,
  wordListSizeMultiplier,
  fontSizes,
  getVerticalOffset,
  includeSolution,
  visualPreviewComponent = "wordsearch"
}: UsePreviewRendererProps) => {
  const previewScaleFactor = 0.3;
  
  const renderPreview = useMemo(() => {
    return () => {
      if (displayPages.length === 0) return null;
  
      const currentPage = activePuzzleIndex < displayPages.length ? displayPages[activePuzzleIndex] : null;
      if (!currentPage) return null;
  
      const { puzzle, isAnswer, pageNumber } = currentPage;
      const PreviewComponent = visualPreviewComponent === "crossword" ? CrosswordVisualPreview : VisualPreview;
  
      return (
        <PreviewComponent
          puzzle={puzzle}
          showLivePreview={showLivePreview}
          isPDFReady={isPDFReady}
          title={title}
          subtitle={subtitle}
          instruction={instruction}
          showTitle={showTitle}
          showSubtitle={showSubtitle}
          showInstruction={!isAnswer && showInstruction}
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
          letterSize={letterSize}
          letterSizeMultiplier={letterSizeMultiplier}
          titleSizeMultiplier={titleSizeMultiplier}
          subtitleSizeMultiplier={subtitleSizeMultiplier}
          instructionSizeMultiplier={instructionSizeMultiplier}
          wordListSizeMultiplier={wordListSizeMultiplier}
          previewScaleFactor={previewScaleFactor}
          fontSizes={fontSizes}
          getVerticalOffset={getVerticalOffset}
          showSolution={isAnswer}
          includeSolution={includeSolution}
          isAnswer={isAnswer}
          pageNumber={pageNumber}
        />
      );
    };
  }, [
    displayPages,
    activePuzzleIndex,
    showLivePreview,
    isPDFReady,
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
    letterSize,
    letterSizeMultiplier,
    titleSizeMultiplier,
    subtitleSizeMultiplier,
    instructionSizeMultiplier,
    wordListSizeMultiplier,
    fontSizes,
    getVerticalOffset,
    includeSolution,
    visualPreviewComponent
  ]);

  return { renderPreview };
};
