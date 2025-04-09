
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { PuzzleGrid } from "@/utils/wordSearchUtils";
import { CrosswordGrid } from "@/utils/crosswordUtils";
import { CombinedPuzzleGrid } from "./types";
import { DialogContent as PuzzleDialogContent } from "./DialogContent";
import { usePuzzleDimensions } from "./hooks/usePuzzleDimensions";
import { usePuzzleElements } from "./hooks/usePuzzleElements";
import { usePuzzleSizes } from "./hooks/usePuzzleSizes";
import { usePuzzlePages } from "./hooks/usePuzzlePages";
import { usePuzzlePreview } from "./hooks/usePuzzlePreview";
import { PreviewRenderer } from "./PreviewRenderer";

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
  
  // Content state
  const [title, setTitle] = useState(defaultValues.title);
  const [subtitle, setSubtitle] = useState(defaultValues.subtitle);
  const [instruction, setInstruction] = useState(defaultValues.instruction);
  const [includeSolution, setIncludeSolution] = useState(true);
  const [puzzles, setPuzzles] = useState<CombinedPuzzleGrid[]>([]);
  
  // Use our custom hooks
  const { 
    selectedSize, selectedUnit, customWidth, customHeight, 
    currentWidth, currentHeight, contentWidth, contentHeight,
    handleSizeChange, handleUnitChange, handleDimensionChange, convertFromPoints 
  } = usePuzzleDimensions();
  
  const {
    showTitle, setShowTitle,
    showSubtitle, setShowSubtitle,
    showInstruction, setShowInstruction,
    showGrid, setShowGrid,
    showWordList, setShowWordList,
    titleOffset, setTitleOffset,
    subtitleOffset, setSubtitleOffset,
    instructionOffset, setInstructionOffset,
    gridOffset, setGridOffset,
    wordListOffset, setWordListOffset,
    positioningElement,
    togglePositioning,
    moveElement,
    getPositionValue
  } = usePuzzleElements();
  
  const {
    titleSizeMultiplier, setTitleSizeMultiplier,
    subtitleSizeMultiplier, setSubtitleSizeMultiplier,
    instructionSizeMultiplier, setInstructionSizeMultiplier,
    cellSizeMultiplier, setCellSizeMultiplier,
    letterSizeMultiplier, setLetterSizeMultiplier,
    wordListSizeMultiplier, setWordListSizeMultiplier,
    fontSizes,
    calculateGridCellSize,
    calculateLetterSize,
    getVerticalOffset
  } = usePuzzleSizes(currentWidth, currentHeight, contentHeight);
  
  const { displayPages, activePuzzleIndex, handleSelectPuzzle } = 
    usePuzzlePages(puzzles, includeSolution);
  
  const {
    isGenerating, isPDFReady, pdfBlob, showLivePreview,
    setIsPDFReady, setShowLivePreview,
    handleSaveLayout: handleSaveLayoutPreview,
    handleDownload: handleDownloadPreview,
    formatSliderValue
  } = usePuzzlePreview();
  
  const previewScaleFactor = 0.3;
  const cellSize = calculateGridCellSize(
    puzzles, 
    activePuzzleIndex, 
    showTitle, 
    showSubtitle, 
    showInstruction, 
    showWordList
  );
  const letterSize = calculateLetterSize(cellSize);

  // Initialize puzzles when dialog opens
  useEffect(() => {
    if (open) {
      if (allPuzzles && allPuzzles.length > 0) {
        setPuzzles(allPuzzles);
      } else if (puzzle) {
        setPuzzles([puzzle]);
      }
    }
  }, [open, puzzle, allPuzzles]);
  
  // Reset preview state when settings change
  useEffect(() => {
    setIsPDFReady(false);
    setShowLivePreview(false);
  }, [
    titleSizeMultiplier, subtitleSizeMultiplier, instructionSizeMultiplier,
    cellSizeMultiplier, letterSizeMultiplier, wordListSizeMultiplier,
    showTitle, showSubtitle, showInstruction, showWordList, showGrid,
    titleOffset, subtitleOffset, instructionOffset, gridOffset, wordListOffset,
    title, subtitle, instruction, selectedSize, customWidth, customHeight,
    activePuzzleIndex, puzzles, setIsPDFReady, setShowLivePreview
  ]);

  // Handlers with correct parameter passing
  const handleSaveLayout = async () => {
    await handleSaveLayoutPreview(
      puzzles,
      activePuzzleIndex,
      puzzleType,
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
      wordListSizeMultiplier
    );
  };

  const handleDownload = async () => {
    await handleDownloadPreview(
      puzzles,
      isPDFReady,
      pdfBlob,
      title,
      onOpenChange
    );
  };

  // Render the preview using our PreviewRenderer component
  const renderPreview = () => {
    return (
      <PreviewRenderer
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          handleDownload={handleDownload}
          isGenerating={isGenerating}
          isPDFReady={isPDFReady}
          pdfBlob={pdfBlob}
        />
      </DialogContent>
    </Dialog>
  );
}
