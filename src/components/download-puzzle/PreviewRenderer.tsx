
import { CombinedPuzzleGrid } from "./types";
import { VisualPreview } from "./VisualPreview";
import { CrosswordVisualPreview } from "./CrosswordVisualPreview";
import { CrosswordGrid } from "@/utils/crosswordUtils";
import { PuzzleGrid } from "@/utils/wordSearchUtils";

interface PreviewRendererProps {
  displayPages: any[];
  activePuzzleIndex: number;
  visualPreviewComponent: "wordsearch" | "crossword";
  showLivePreview: boolean;
  isPDFReady: boolean;
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
  letterSize: number;
  letterSizeMultiplier: number;
  titleSizeMultiplier: number;
  subtitleSizeMultiplier: number;
  instructionSizeMultiplier: number;
  wordListSizeMultiplier: number;
  previewScaleFactor: number;
  fontSizes: {
    titleSize: number;
    subtitleSize: number;
    instructionSize: number;
    wordListSize: number;
  };
  getVerticalOffset: (offset: number) => number;
  includeSolution: boolean;
}

export const PreviewRenderer = ({
  displayPages,
  activePuzzleIndex,
  visualPreviewComponent,
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
  previewScaleFactor,
  fontSizes,
  getVerticalOffset,
  includeSolution,
}: PreviewRendererProps) => {
  if (displayPages.length === 0) return null;
  
  const currentPage = displayPages[activePuzzleIndex];
  const currentPuzzle = currentPage.puzzle;
  const isAnswerPage = currentPage.isAnswer;
  const pageNumber = currentPage.pageNumber;
  
  if (visualPreviewComponent === "crossword") {
    return (
      <CrosswordVisualPreview 
        puzzle={currentPuzzle as CrosswordGrid}
        showLivePreview={showLivePreview}
        isPDFReady={isPDFReady}
        title={title}
        subtitle={subtitle}
        instruction={instruction}
        showTitle={showTitle}
        showSubtitle={showSubtitle}
        showInstruction={isAnswerPage ? false : showInstruction}
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
        showSolution={isAnswerPage}
        includeSolution={includeSolution}
        isAnswer={isAnswerPage}
        pageNumber={pageNumber}
      />
    );
  } else {
    return (
      <VisualPreview 
        puzzle={currentPuzzle as PuzzleGrid}
        showLivePreview={showLivePreview}
        isPDFReady={isPDFReady}
        title={title}
        subtitle={subtitle}
        instruction={instruction}
        showTitle={showTitle}
        showSubtitle={showSubtitle}
        showInstruction={isAnswerPage ? false : showInstruction}
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
        includeSolution={includeSolution}
        isAnswer={isAnswerPage}
        pageNumber={pageNumber}
      />
    );
  }
};
