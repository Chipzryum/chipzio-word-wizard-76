
import { CombinedPuzzleGrid } from "./types";
import { PDFViewer } from "@react-pdf/renderer";
import { PuzzlePDFPreview } from "./PuzzlePDFPreview";
import { VisualPreview as VisualPreviewComponent } from "./visual-preview";

interface VisualPreviewProps {
  puzzle: CombinedPuzzleGrid | null;
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
  includeSolution?: boolean;
  isAnswer?: boolean;
  pageNumber?: number;
  showSolution?: boolean;
}

export const VisualPreview = (props: VisualPreviewProps) => {
  const {
    puzzle,
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
    letterSizeMultiplier,
    titleSizeMultiplier,
    subtitleSizeMultiplier,
    instructionSizeMultiplier,
    wordListSizeMultiplier,
    isAnswer = false,
    includeSolution
  } = props;

  if (showLivePreview && isPDFReady) {
    return (
      <div className="w-full h-full flex-1">
        <PDFViewer width="100%" height="100%" className="border-0">
          <PuzzlePDFPreview
            puzzle={puzzle}
            title={title}
            subtitle={subtitle}
            instruction={instruction}
            showTitle={showTitle}
            showSubtitle={showSubtitle}
            showInstruction={isAnswer ? false : showInstruction}
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
            showSolution={isAnswer || false}
            includeSolution={includeSolution}
          />
        </PDFViewer>
      </div>
    );
  }

  // Use the component from the visual-preview directory for non-PDF preview
  return (
    <VisualPreviewComponent {...props} />
  );
};
