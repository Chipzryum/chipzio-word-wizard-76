
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { usePuzzleDialog } from "./hooks/usePuzzleDialog";
import { usePreviewRenderer } from "./hooks/usePreviewRenderer";
import { DialogContent as PuzzleDialogContent } from "./DialogContent";
import { CombinedPuzzleGrid } from "./types";

interface DownloadPuzzleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  puzzle: CombinedPuzzleGrid;
  defaultValues?: {
    title: string;
    subtitle: string;
    instruction: string;
  };
  puzzleType?: "wordsearch" | "crossword";
  showSolution?: boolean;
  visualPreviewComponent?: "wordsearch" | "crossword";
  allPuzzles?: CombinedPuzzleGrid[];
}

export function DownloadPuzzleDialog({
  open,
  onOpenChange,
  puzzle,
  defaultValues = {
    title: "Puzzle",
    subtitle: "educational puzzle",
    instruction: "Can you solve the puzzle?"
  },
  puzzleType = "wordsearch",
  showSolution = false,
  visualPreviewComponent = "wordsearch",
  allPuzzles = []
}: DownloadPuzzleDialogProps) {
  const {
    title,
    setTitle,
    subtitle,
    setSubtitle,
    instruction,
    setInstruction,
    selectedSize,
    handleSizeChange,
    customWidth,
    customHeight,
    selectedUnit,
    handleUnitChange,
    handleDimensionChange,
    convertFromPoints,
    titleSizeMultiplier,
    setTitleSizeMultiplier,
    subtitleSizeMultiplier,
    setSubtitleSizeMultiplier,
    instructionSizeMultiplier,
    setInstructionSizeMultiplier,
    cellSizeMultiplier,
    setCellSizeMultiplier,
    letterSizeMultiplier,
    setLetterSizeMultiplier,
    wordListSizeMultiplier,
    setWordListSizeMultiplier,
    includeSolution,
    setIncludeSolution,
    showTitle,
    setShowTitle,
    showSubtitle,
    setShowSubtitle,
    showInstruction,
    setShowInstruction,
    showWordList,
    setShowWordList,
    showGrid,
    setShowGrid,
    titleOffset,
    setTitleOffset,
    subtitleOffset,
    setSubtitleOffset,
    instructionOffset,
    setInstructionOffset,
    gridOffset,
    setGridOffset,
    wordListOffset,
    setWordListOffset,
    isGenerating,
    isPDFReady,
    pdfBlob,
    showLivePreview,
    activePuzzleIndex,
    puzzles,
    displayPages,
    handleSelectPuzzle,
    handleSaveLayout,
    handleDownload,
    formatSliderValue,
    getPositionValue,
    currentWidth,
    currentHeight,
    contentWidth,
    contentHeight,
    fontSizes,
    cellSize,
    letterSize,
    getVerticalOffset
  } = usePuzzleDialog(puzzle, defaultValues, puzzleType, allPuzzles);

  const { renderPreview } = usePreviewRenderer({
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
    visualPreviewComponent
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Download Puzzle</DialogTitle>
          <DialogDescription>
            Customize your {puzzles.length > 1 ?
              `puzzles (${puzzles.length} pages)` :
              "puzzle"} before downloading
          </DialogDescription>
        </DialogHeader>

        <PuzzleDialogContent
          title={title}
          setTitle={setTitle}
          subtitle={subtitle}
          setSubtitle={setSubtitle}
          instruction={instruction}
          setInstruction={setInstruction}
          showTitle={showTitle}
          setShowTitle={setShowTitle}
          showSubtitle={showSubtitle}
          setShowSubtitle={setShowSubtitle}
          showInstruction={showInstruction}
          setShowInstruction={setShowInstruction}
          showGrid={showGrid}
          setShowGrid={setShowGrid}
          showWordList={showWordList}
          setShowWordList={setShowWordList}

          selectedSize={selectedSize}
          handleSizeChange={handleSizeChange}
          customWidth={customWidth}
          customHeight={customHeight}
          selectedUnit={selectedUnit}
          handleUnitChange={handleUnitChange}
          handleDimensionChange={handleDimensionChange}
          convertFromPoints={convertFromPoints}

          titleOffset={titleOffset}
          setTitleOffset={setTitleOffset}
          subtitleOffset={subtitleOffset}
          setSubtitleOffset={setSubtitleOffset}
          instructionOffset={instructionOffset}
          setInstructionOffset={setInstructionOffset}
          gridOffset={gridOffset}
          setGridOffset={setGridOffset}
          wordListOffset={wordListOffset}
          setWordListOffset={setWordListOffset}

          letterSizeMultiplier={letterSizeMultiplier}
          setLetterSizeMultiplier={setLetterSizeMultiplier}
          titleSizeMultiplier={titleSizeMultiplier}
          setTitleSizeMultiplier={setTitleSizeMultiplier}
          subtitleSizeMultiplier={subtitleSizeMultiplier}
          setSubtitleSizeMultiplier={setSubtitleSizeMultiplier}
          instructionSizeMultiplier={instructionSizeMultiplier}
          setInstructionSizeMultiplier={setInstructionSizeMultiplier}
          wordListSizeMultiplier={wordListSizeMultiplier}
          setWordListSizeMultiplier={setWordListSizeMultiplier}
          cellSizeMultiplier={cellSizeMultiplier}
          setCellSizeMultiplier={setCellSizeMultiplier}

          getPositionValue={getPositionValue}
          formatSliderValue={formatSliderValue}

          puzzles={puzzles}
          activePuzzleIndex={activePuzzleIndex}
          handleSelectPuzzle={handleSelectPuzzle}
          includeSolution={includeSolution}
          displayPages={displayPages}

          renderPreview={renderPreview}
          handleSaveLayout={handleSaveLayout}
          handleDownload={handleDownload}
          isGenerating={isGenerating}
          isPDFReady={isPDFReady}
          pdfBlob={pdfBlob}
        />
      </DialogContent>
    </Dialog>
  );
}
