
import { CombinedPuzzleGrid } from "./types";
import { VisualPreview } from "./VisualPreview";
import { CrosswordVisualPreview } from "./CrosswordVisualPreview";

interface PuzzlePreviewProps {
  puzzle: CombinedPuzzleGrid | null;
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
  displayPages: any[];
  activePuzzleIndex: number;
}

export const PuzzlePreview = ({
  puzzle,
  visualPreviewComponent,
  displayPages,
  activePuzzleIndex,
  ...props
}: PuzzlePreviewProps) => {
  if (displayPages.length === 0) return null;

  const { isAnswer, pageNumber } = displayPages[activePuzzleIndex];
  const PreviewComponent = visualPreviewComponent === "crossword" 
    ? CrosswordVisualPreview 
    : VisualPreview;

  return (
    <PreviewComponent
      puzzle={puzzle}
      showInstruction={!isAnswer && props.showInstruction}
      isAnswer={isAnswer}
      pageNumber={pageNumber}
      showSolution={isAnswer}
      {...props}
    />
  );
};
