
import { CombinedPuzzleGrid } from "./types";
import { VisualPreview } from "./VisualPreview";
import { CrosswordVisualPreview } from "./CrosswordVisualPreview";
import { MultiPuzzleGrid } from "./MultiPuzzleGrid";
import { ActionButtons } from "./ActionButtons";

interface PuzzlePreviewProps {
  puzzles: CombinedPuzzleGrid[];
  activePuzzleIndex: number;
  displayPages: any[];
  includeSolution: boolean;
  handleSelectPuzzle: (index: number) => void;
  renderPreview: () => JSX.Element | null;
  handleSaveLayout: () => Promise<void>;
  handleDownload: () => Promise<void>;
  isGenerating: boolean;
  isPDFReady: boolean;
  pdfBlob: Blob | null;
  visualPreviewComponent?: "wordsearch" | "crossword";
}

export const PuzzlePreview = ({
  puzzles,
  activePuzzleIndex,
  displayPages,
  includeSolution,
  handleSelectPuzzle,
  renderPreview,
  handleSaveLayout,
  handleDownload,
  isGenerating,
  isPDFReady,
  pdfBlob,
  visualPreviewComponent = "wordsearch"
}: PuzzlePreviewProps) => {
  const currentPage = displayPages && displayPages[activePuzzleIndex];
  const isAnswerPage = currentPage?.isAnswer || false;
  const pageNumber = currentPage?.pageNumber || 1;
  const totalPuzzlePages = Math.ceil(displayPages?.length / (includeSolution ? 2 : 1)) || 0;
  
  const pageLabel = isAnswerPage 
    ? `Answer ${pageNumber} of ${totalPuzzlePages}`
    : `Question ${pageNumber} of ${totalPuzzlePages}`;

  return (
    <div className="space-y-4">
      {displayPages && displayPages.length > 0 && (
        <div className="glass-card rounded-lg p-4 bg-white/50 border shadow-sm">
          <h3 className="font-medium mb-3">Pages ({displayPages.length})</h3>
          <MultiPuzzleGrid 
            puzzles={puzzles}
            activePuzzleIndex={activePuzzleIndex}
            onSelectPuzzle={handleSelectPuzzle}
            includeSolution={includeSolution}
          />
          <p className="text-xs text-muted-foreground mt-2">
            Click on a page to select and edit it
          </p>
        </div>
      )}
      
      <div className="border rounded-lg p-4 bg-white h-[430px] flex flex-col items-center justify-center overflow-y-auto relative">
        {renderPreview()}
      </div>
      
      <ActionButtons 
        handleSaveLayout={handleSaveLayout}
        handleDownload={handleDownload}
        isGenerating={isGenerating}
        isPDFReady={isPDFReady}
        puzzle={puzzles[activePuzzleIndex < puzzles.length ? activePuzzleIndex : 0]}
        pdfBlob={pdfBlob}
      />
      
      {!isPDFReady && (
        <p className="text-xs text-muted-foreground">
          Click "Save Layout" after making changes to update the PDF preview.
        </p>
      )}
    </div>
  );
};
