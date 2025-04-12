
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CombinedPuzzleGrid } from "./types";
import { DialogContent as PuzzleDialogContent } from "./DialogContent";
import { PreviewSection } from "./PreviewSection";
import { PuzzlePreview } from "./PuzzlePreview";
import { 
  usePuzzlePages, 
  usePuzzleLayout, 
  usePuzzleSizes, 
  usePDFGeneration 
} from "./hooks";

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
  
  // Initialize page management
  const {
    puzzles,
    displayPages,
    activePuzzleIndex,
    handleSelectPuzzle
  } = usePuzzlePages(allPuzzles, puzzle, includeSolution);

  // Layout management
  const {
    selectedSize,
    selectedUnit,
    customWidth,
    customHeight,
    currentWidth,
    currentHeight,
    contentWidth,
    contentHeight,
    handleSizeChange,
    handleUnitChange,
    handleDimensionChange,
    convertFromPoints,
    getVerticalOffset
  } = usePuzzleLayout();

  // Size management
  const currentPuzzle = puzzles[activePuzzleIndex];
  const {
    titleSizeMultiplier, setTitleSizeMultiplier,
    subtitleSizeMultiplier, setSubtitleSizeMultiplier,
    instructionSizeMultiplier, setInstructionSizeMultiplier,
    cellSizeMultiplier, setCellSizeMultiplier,
    letterSizeMultiplier, setLetterSizeMultiplier,
    wordListSizeMultiplier, setWordListSizeMultiplier,
    showTitle, setShowTitle,
    showSubtitle, setShowSubtitle,
    showInstruction, setShowInstruction,
    showWordList, setShowWordList,
    showGrid, setShowGrid,
    titleOffset, setTitleOffset,
    subtitleOffset, setSubtitleOffset,
    instructionOffset, setInstructionOffset,
    gridOffset, setGridOffset,
    wordListOffset, setWordListOffset,
    fontSizes,
    cellSize,
    letterSize
  } = usePuzzleSizes(currentWidth, currentHeight, contentWidth, contentHeight, currentPuzzle);

  // PDF generation
  const pdfProps = {
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
  };

  const {
    isGenerating,
    isPDFReady,
    pdfBlob,
    showLivePreview,
    setIsPDFReady,
    setShowLivePreview,
    handleSaveLayout,
    handleDownload
  } = usePDFGeneration(puzzles, activePuzzleIndex, puzzleType, pdfProps);

  // Reset preview state when parameters change
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

  const previewScaleFactor = 0.3;

  const renderPreview = () => {
    if (displayPages.length === 0) return null;

    return (
      <PuzzlePreview
        puzzle={currentPuzzle}
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
        displayPages={displayPages}
        activePuzzleIndex={activePuzzleIndex}
      />
    );
  };

  const formatSliderValue = (value: number) => `${(value * 100).toFixed(0)}%`;
  const getPositionValue = (offset: number) => offset === 0 ? '0' : (offset > 0 ? `+${offset}` : `${offset}`);

  const currentPage = displayPages && displayPages[activePuzzleIndex];
  const isAnswerPage = currentPage?.isAnswer || false;
  const pageNumber = currentPage?.pageNumber || 1;
  const totalPuzzlePages = Math.ceil(displayPages?.length / (includeSolution ? 2 : 1)) || 0;
  
  const pageLabel = isAnswerPage 
    ? `Answer ${pageNumber} of ${totalPuzzlePages}`
    : `Question ${pageNumber} of ${totalPuzzlePages}`;

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
          
          renderPreview={() => (
            <PreviewSection
              renderPreview={renderPreview}
              handleSaveLayout={handleSaveLayout}
              handleDownload={handleDownload}
              isGenerating={isGenerating}
              isPDFReady={isPDFReady}
              puzzles={puzzles}
              activePuzzleIndex={activePuzzleIndex}
              includeSolution={includeSolution}
              pdfBlob={pdfBlob}
              pageLabel={pageLabel}
            />
          )}
          handleSaveLayout={handleSaveLayout}
          handleDownload={handleDownload}
          isGenerating={isGenerating}
          isPDFReady={isPDFReady}
          pdfBlob={pdfBlob}
          pageLabel={pageLabel}
        />
      </DialogContent>
    </Dialog>
  );
}
