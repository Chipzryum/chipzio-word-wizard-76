
import { CombinedPuzzleGrid } from "../types";
import { PreviewContent } from "./PreviewContent";

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

export const VisualPreview = ({
  puzzle,
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
  isAnswer = false,
  pageNumber = 1,
  showSolution = false, // Added with default value
  ...props
}: VisualPreviewProps) => {
  // Set dimensions to maintain A4 aspect ratio
  const a4AspectRatio = 1 / Math.sqrt(2); // Approximately 0.7071 (standard ISO 216)
  const scaledWidth = currentWidth * previewScaleFactor;
  const scaledHeight = scaledWidth / a4AspectRatio;

  return (
    <div 
      className="relative border-2 border-black bg-white p-4 overflow-hidden"
      style={{
        width: `${scaledWidth}px`,
        height: `${scaledHeight}px`,
        maxWidth: '100%',
        maxHeight: '420px',
      }}
    >
      {puzzle && (
        <>
          {/* Page indicator */}
          <div className="absolute top-2 right-2 bg-gray-100 text-xs font-medium px-2 py-1 rounded-md z-10">
            {isAnswer ? `Answer ${pageNumber}` : `Question ${pageNumber}`}
          </div>
          
          <PreviewContent
            puzzle={puzzle}
            title={props.title}
            subtitle={props.subtitle}
            instruction={props.instruction}
            showTitle={props.showTitle}
            showSubtitle={props.showSubtitle}
            showInstruction={isAnswer ? false : props.showInstruction}
            showGrid={props.showGrid}
            showWordList={props.showWordList}
            titleOffset={props.titleOffset}
            subtitleOffset={props.subtitleOffset}
            instructionOffset={props.instructionOffset}
            gridOffset={props.gridOffset}
            wordListOffset={props.wordListOffset}
            getVerticalOffset={getVerticalOffset}
            previewScaleFactor={previewScaleFactor}
            fontSizes={fontSizes}
            titleSizeMultiplier={titleSizeMultiplier}
            subtitleSizeMultiplier={subtitleSizeMultiplier}
            instructionSizeMultiplier={instructionSizeMultiplier}
            wordListSizeMultiplier={wordListSizeMultiplier}
            cellSize={cellSize}
            showSolution={isAnswer || showSolution} // Use either isAnswer or showSolution
          />
        </>
      )}
    </div>
  );
};
