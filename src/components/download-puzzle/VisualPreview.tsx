
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
  showSolution?: boolean; // Added this missing property
}

export const VisualPreview = (props: VisualPreviewProps) => {
  if (props.showLivePreview && props.isPDFReady) {
    return (
      <div className="w-full h-full flex-1">
        <PDFViewer width="100%" height="100%" className="border-0">
          <PuzzlePDFPreview
            puzzle={props.puzzle}
            title={props.title}
            subtitle={props.subtitle}
            instruction={props.instruction}
            showTitle={props.showTitle}
            showSubtitle={props.showSubtitle}
            showInstruction={props.isAnswer ? false : props.showInstruction}
            showGrid={props.showGrid}
            showWordList={props.showWordList}
            titleOffset={props.titleOffset}
            subtitleOffset={props.subtitleOffset}
            instructionOffset={props.instructionOffset}
            gridOffset={props.gridOffset}
            wordListOffset={props.wordListOffset}
            currentWidth={props.currentWidth}
            currentHeight={props.currentHeight}
            contentWidth={props.contentWidth}
            contentHeight={props.contentHeight}
            cellSize={props.cellSize}
            letterSizeMultiplier={props.letterSizeMultiplier}
            titleSizeMultiplier={props.titleSizeMultiplier}
            subtitleSizeMultiplier={props.subtitleSizeMultiplier}
            instructionSizeMultiplier={props.instructionSizeMultiplier}
            wordListSizeMultiplier={props.wordListSizeMultiplier}
            showSolution={props.isAnswer || props.showSolution || false}
            includeSolution={props.includeSolution}
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
