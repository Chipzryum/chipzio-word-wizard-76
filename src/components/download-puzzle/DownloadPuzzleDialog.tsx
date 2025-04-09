
import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CombinedPuzzleGrid } from "./types";
import { UNITS } from "./constants";
import { DialogContent as PuzzleDialogContent } from "./DialogContent";
import { PuzzlePreview } from "./PuzzlePreview";
import { usePuzzleDialog } from "./hooks/usePuzzleDialog";
import { usePuzzlePreview } from "./hooks/usePuzzlePreview";

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
    includeSolution,
    setIncludeSolution,
    selectedSize,
    selectedUnit,
    customWidth,
    customHeight,
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
    puzzles,
    handleUnitChange,
    handleSizeChange,
    handleDimensionChange,
    formatSliderValue,
    getPositionValue
  } = usePuzzleDialog({ puzzle, defaultValues, allPuzzles });

  const {
    isGenerating,
    isPDFReady,
    pdfBlob,
    showLivePreview,
    activePuzzleIndex,
    displayPages,
    currentWidth,
    currentHeight,
    contentWidth,
    contentHeight,
    fontSizes,
    cellSize,
    letterSize,
    previewScaleFactor,
    getVerticalOffset,
    handleSaveLayout,
    handleDownload,
    handleSelectPuzzle
  } = usePuzzlePreview({
    puzzles,
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
    selectedSize,
    customWidth,
    customHeight,
    titleSizeMultiplier,
    subtitleSizeMultiplier,
    instructionSizeMultiplier,
    cellSizeMultiplier,
    letterSizeMultiplier,
    wordListSizeMultiplier,
    includeSolution,
    puzzleType
  });

  const convertFromPoints = (points: number) => {
    return (points / UNITS[selectedUnit]).toFixed(2);
  };

  useEffect(() => {
    if (!open) return;
    // Reset PDF state when dialog is opened
    // to ensure new previews will be generated
  }, [open]);

  const handleCloseDialog = async (isOpen: boolean) => {
    if (!isOpen && isPDFReady) {
      // Handle download before closing if needed
      onOpenChange(isOpen);
    } else {
      onOpenChange(isOpen);
    }
  };

  const renderPreview = () => {
    return (
      <PuzzlePreview
        displayPages={displayPages}
        activePuzzleIndex={activePuzzleIndex}
        visualPreviewComponent={visualPreviewComponent}
        showLivePreview={showLivePreview}
        isPDFReady={isPDFReady}
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
      />
    );
  };

  const handleFinalDownload = async () => {
    const success = await handleDownload();
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleCloseDialog}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Download Puzzle</DialogTitle>
          <DialogDescription>
            Customize your {puzzles.length > 1 ? 
              `puzzles (${puzzles.length} ${includeSolution ? 'with answers' : 'puzzles'})` : 
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
          handleDownload={handleFinalDownload}
          isGenerating={isGenerating}
          isPDFReady={isPDFReady}
          pdfBlob={pdfBlob}
        />
      </DialogContent>
    </Dialog>
  );
}
