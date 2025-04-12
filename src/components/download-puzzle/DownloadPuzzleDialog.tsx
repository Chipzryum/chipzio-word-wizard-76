
import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { PuzzleGrid } from "@/utils/wordSearchUtils";
import { CrosswordGrid } from "@/utils/crosswordUtils";
import { pdf } from "@react-pdf/renderer";
import { useToast } from "@/hooks/use-toast";
import { VisualPreview } from "./VisualPreview";
import { CrosswordVisualPreview } from "./CrosswordVisualPreview";
import { PuzzlePDFPreview } from "./PuzzlePDFPreview";
import { CrosswordPDFPreview } from "./CrosswordPDFPreview";
import { CombinedPuzzleGrid, PageSize, Unit } from "./types";
import { DialogContent as PuzzleDialogContent } from "./DialogContent";
import {
  PAGE_SIZES,
  UNITS,
  PDF_MARGIN,
  BORDER_WIDTH,
  BASE_PADDING,
  MAX_OFFSET,
  DEFAULT_TITLE_MULTIPLIER,
  DEFAULT_SUBTITLE_MULTIPLIER,
  DEFAULT_INSTRUCTION_MULTIPLIER,
  DEFAULT_CELL_MULTIPLIER,
  DEFAULT_LETTER_SIZE_MULTIPLIER,
  DEFAULT_WORDLIST_MULTIPLIER,
  MAX_LETTER_SIZE
} from "./constants";

// Define the structure for page-specific settings
interface PageSettings {
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
  letterSizeMultiplier: number;
  titleSizeMultiplier: number;
  subtitleSizeMultiplier: number;
  instructionSizeMultiplier: number;
  wordListSizeMultiplier: number;
  cellSizeMultiplier: number;
}

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

  // Global settings (used when editAllPages is true)
  const [title, setTitle] = useState(defaultValues.title);
  const [subtitle, setSubtitle] = useState(defaultValues.subtitle);
  const [instruction, setInstruction] = useState(defaultValues.instruction);
  const [selectedSize, setSelectedSize] = useState<PageSize>("A4");
  const [selectedUnit, setSelectedUnit] = useState<Unit>("Points");
  const [customWidth, setCustomWidth] = useState(PAGE_SIZES.A4.width);
  const [customHeight, setCustomHeight] = useState(PAGE_SIZES.A4.height);

  const [titleSizeMultiplier, setTitleSizeMultiplier] = useState(DEFAULT_TITLE_MULTIPLIER);
  const [subtitleSizeMultiplier, setSubtitleSizeMultiplier] = useState(DEFAULT_SUBTITLE_MULTIPLIER);
  const [instructionSizeMultiplier, setInstructionSizeMultiplier] = useState(DEFAULT_INSTRUCTION_MULTIPLIER);
  const [cellSizeMultiplier, setCellSizeMultiplier] = useState(DEFAULT_CELL_MULTIPLIER);
  const [letterSizeMultiplier, setLetterSizeMultiplier] = useState(DEFAULT_LETTER_SIZE_MULTIPLIER);
  const [wordListSizeMultiplier, setWordListSizeMultiplier] = useState(DEFAULT_WORDLIST_MULTIPLIER);
  const [includeSolution, setIncludeSolution] = useState(true);

  const [showTitle, setShowTitle] = useState(true);
  const [showSubtitle, setShowSubtitle] = useState(true);
  const [showInstruction, setShowInstruction] = useState(true);
  const [showWordList, setShowWordList] = useState(true);
  const [showGrid, setShowGrid] = useState(true);

  const [titleOffset, setTitleOffset] = useState(0);
  const [subtitleOffset, setSubtitleOffset] = useState(0);
  const [instructionOffset, setInstructionOffset] = useState(0);
  const [gridOffset, setGridOffset] = useState(0);
  const [wordListOffset, setWordListOffset] = useState(0);

  const [positioningElement, setPositioningElement] = useState<string | null>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isPDFReady, setIsPDFReady] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

  const [showLivePreview, setShowLivePreview] = useState(false);

  const [activePuzzleIndex, setActivePuzzleIndex] = useState(0);
  const [puzzles, setPuzzles] = useState<CombinedPuzzleGrid[]>([]);
  const [displayPages, setDisplayPages] = useState<any[]>([]);
  
  // New state for per-page settings
  const [pageSettings, setPageSettings] = useState<PageSettings[]>([]);
  const [editAllPages, setEditAllPages] = useState(true);

  const { toast } = useToast();

  const previewScaleFactor = 0.3;

  // Initialize puzzle pages and settings
  useEffect(() => {
    if (open) {
      // Initialize with provided puzzles when dialog opens
      const puzzlesArray = allPuzzles.length ? allPuzzles : [puzzle];
      
      // Sort puzzles to have questions first, then answers
      const questionPuzzles = puzzlesArray.filter(p => !p.isAnswer);
      const answerPuzzles = puzzlesArray.filter(p => p.isAnswer);
      const orderedPuzzles = [...questionPuzzles, ...answerPuzzles];
      
      setPuzzles(orderedPuzzles);
      createDisplayPages(orderedPuzzles);
      setActivePuzzleIndex(0);
      
      // Initialize page settings for each page
      initializePageSettings(orderedPuzzles.length);
    }
  }, [open, puzzle, allPuzzles]);

  // Initialize page settings with default values
  const initializePageSettings = (numPages: number) => {
    const initialSettings: PageSettings[] = [];
    
    for (let i = 0; i < numPages; i++) {
      initialSettings.push({
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
        letterSizeMultiplier,
        titleSizeMultiplier,
        subtitleSizeMultiplier,
        instructionSizeMultiplier,
        wordListSizeMultiplier,
        cellSizeMultiplier
      });
    }
    
    setPageSettings(initialSettings);
  };

  // Modified function to properly create display pages
  const createDisplayPages = (puzzlesArray: CombinedPuzzleGrid[]) => {
    // Filter puzzles by type
    const questionPuzzles = puzzlesArray.filter(p => !p.isAnswer);
    const answerPuzzles = puzzlesArray.filter(p => p.isAnswer);
    
    // Create separate page numbering for questions and answers
    const questionPages = questionPuzzles.map((puzzle, index) => ({
      puzzle,
      isAnswer: false,
      pageNumber: index + 1
    }));
    
    const answerPages = answerPuzzles.map((puzzle, index) => ({
      puzzle,
      isAnswer: true,
      pageNumber: index + 1
    }));
    
    // Combine with questions first, then answers
    const pages = [...questionPages, ...answerPages];
    
    setDisplayPages(pages);
  };

  // Update display pages when includeSolution changes
  useEffect(() => {
    if (puzzles.length > 0) {
      createDisplayPages(puzzles);
      setActivePuzzleIndex(0);
    }
  }, [includeSolution]);

  // Apply global settings to all pages
  useEffect(() => {
    if (editAllPages && pageSettings.length > 0) {
      const updatedSettings = pageSettings.map(setting => ({
        ...setting,
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
        letterSizeMultiplier,
        titleSizeMultiplier,
        subtitleSizeMultiplier,
        instructionSizeMultiplier,
        wordListSizeMultiplier,
        cellSizeMultiplier
      }));
      
      setPageSettings(updatedSettings);
    }
  }, [
    editAllPages,
    title, subtitle, instruction,
    showTitle, showSubtitle, showInstruction, showGrid, showWordList,
    titleOffset, subtitleOffset, instructionOffset, gridOffset, wordListOffset,
    letterSizeMultiplier, titleSizeMultiplier, subtitleSizeMultiplier,
    instructionSizeMultiplier, wordListSizeMultiplier, cellSizeMultiplier
  ]);

  // Save the current page's settings
  const savePageSettings = () => {
    if (pageSettings.length > activePuzzleIndex) {
      const newSettings = [...pageSettings];
      newSettings[activePuzzleIndex] = {
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
        letterSizeMultiplier,
        titleSizeMultiplier,
        subtitleSizeMultiplier,
        instructionSizeMultiplier,
        wordListSizeMultiplier,
        cellSizeMultiplier
      };
      
      setPageSettings(newSettings);
      toast({ title: "Saved", description: `Settings saved for page ${activePuzzleIndex + 1}` });
    }
  };

  // Load settings for the selected page
  useEffect(() => {
    if (!editAllPages && pageSettings.length > activePuzzleIndex) {
      const currentPageSettings = pageSettings[activePuzzleIndex];
      
      // Only update if we have settings for this page
      if (currentPageSettings) {
        setTitle(currentPageSettings.title);
        setSubtitle(currentPageSettings.subtitle);
        setInstruction(currentPageSettings.instruction);
        setShowTitle(currentPageSettings.showTitle);
        setShowSubtitle(currentPageSettings.showSubtitle);
        setShowInstruction(currentPageSettings.showInstruction);
        setShowGrid(currentPageSettings.showGrid);
        setShowWordList(currentPageSettings.showWordList);
        setTitleOffset(currentPageSettings.titleOffset);
        setSubtitleOffset(currentPageSettings.subtitleOffset);
        setInstructionOffset(currentPageSettings.instructionOffset);
        setGridOffset(currentPageSettings.gridOffset);
        setWordListOffset(currentPageSettings.wordListOffset);
        setLetterSizeMultiplier(currentPageSettings.letterSizeMultiplier);
        setTitleSizeMultiplier(currentPageSettings.titleSizeMultiplier);
        setSubtitleSizeMultiplier(currentPageSettings.subtitleSizeMultiplier);
        setInstructionSizeMultiplier(currentPageSettings.instructionSizeMultiplier);
        setWordListSizeMultiplier(currentPageSettings.wordListSizeMultiplier);
        setCellSizeMultiplier(currentPageSettings.cellSizeMultiplier);
      }
    }
  }, [activePuzzleIndex, editAllPages]);

  const handleUnitChange = (unit: Unit) => setSelectedUnit(unit);

  const togglePositioning = (element: string | null) => setPositioningElement(element);

  const moveElement = (element: string, direction: 'up' | 'down') => {
    const change = direction === 'up' ? -1 : 1;
    const stateSetters = {
      title: setTitleOffset,
      subtitle: setSubtitleOffset,
      instruction: setInstructionOffset,
      grid: setGridOffset,
      wordList: setWordListOffset
    };
    stateSetters[element]?.(prev => prev + change);
  };

  const currentWidth = selectedSize === "Custom" ? customWidth : PAGE_SIZES[selectedSize].width;
  const currentHeight = selectedSize === "Custom" ? customHeight : PAGE_SIZES[selectedSize].height;

  const contentWidth = currentWidth - 2 * (PDF_MARGIN + BASE_PADDING + BORDER_WIDTH);
  const contentHeight = currentHeight - 2 * (PDF_MARGIN + BASE_PADDING + BORDER_WIDTH);

  const calculateFontSizes = () => {
    const sizeRatio = Math.sqrt((currentWidth * currentHeight) / (PAGE_SIZES.A4.width * PAGE_SIZES.A4.height));
    return {
      titleSize: Math.max(20, Math.min(48, Math.floor(36 * sizeRatio * titleSizeMultiplier))),
      subtitleSize: Math.max(14, Math.min(36, Math.floor(24 * sizeRatio * subtitleSizeMultiplier))),
      instructionSize: Math.max(8, Math.min(24, Math.floor(14 * sizeRatio * instructionSizeMultiplier))),
      wordListSize: Math.max(6, Math.min(28, Math.floor(12 * sizeRatio * wordListSizeMultiplier))),
    };
  };

  const fontSizes = useMemo(calculateFontSizes, [
    currentWidth, currentHeight, titleSizeMultiplier, subtitleSizeMultiplier,
    instructionSizeMultiplier, wordListSizeMultiplier
  ]);

  const calculateSpaceNeeded = () => {
    return [
      showTitle ? fontSizes.titleSize * titleSizeMultiplier + 10 : 0,
      showSubtitle ? fontSizes.subtitleSize * subtitleSizeMultiplier + 10 : 0,
      showInstruction ? fontSizes.instructionSize * instructionSizeMultiplier + 20 : 0,
      showWordList ? fontSizes.wordListSize * wordListSizeMultiplier * 3 : 0
    ].reduce((acc, val) => acc + val, 0);
  };

  const calculateGridCellSize = () => {
    if (!puzzles[activePuzzleIndex]) return 20;
    const { grid } = puzzles[activePuzzleIndex];
    const gridWidth = grid[0].length;
    const gridHeight = grid.length;
    const reservedSpace = calculateSpaceNeeded() + 40;
    const availableHeight = contentHeight - reservedSpace;
    const baseSize = Math.min(contentWidth / gridWidth, availableHeight / gridHeight);
    return baseSize * cellSizeMultiplier;
  };

  const cellSize = useMemo(calculateGridCellSize, [
    puzzles, activePuzzleIndex, contentWidth, contentHeight,
    cellSizeMultiplier, showTitle, showSubtitle, showInstruction, showWordList
  ]);

  const calculateLetterSize = () => {
    const baseLetterSize = cellSize * 0.6;
    return baseLetterSize * Math.min(letterSizeMultiplier, MAX_LETTER_SIZE);
  };

  const letterSize = useMemo(calculateLetterSize, [cellSize, letterSizeMultiplier]);

  const getVerticalOffset = (offset: number) => {
    const maxAllowedOffset = Math.min(MAX_OFFSET, (contentHeight / 6) / 10);
    return Math.max(-maxAllowedOffset, Math.min(offset * 10, maxAllowedOffset * 10));
  };

  const handleSizeChange = (size: PageSize) => {
    setSelectedSize(size);
    if (size !== "Custom") {
      setCustomWidth(PAGE_SIZES[size].width);
      setCustomHeight(PAGE_SIZES[size].height);
    }
    setIsPDFReady(false);
  };

  const handleDimensionChange = (dimension: "width" | "height", value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      const pointValue = numValue * UNITS[selectedUnit];
      dimension === "width" ? setCustomWidth(pointValue) : setCustomHeight(pointValue);
      setSelectedSize("Custom");
      setIsPDFReady(false);
    }
  };

  const convertFromPoints = (points: number) => (points / UNITS[selectedUnit]).toFixed(2);

  const handleSaveLayout = async () => {
    if (puzzles.length === 0) {
      toast({ variant: "destructive", title: "Error", description: "No puzzles to save. Please generate puzzles first." });
      return;
    }

    // Save current page settings if in single page mode
    if (!editAllPages) {
      savePageSettings();
    }

    setIsGenerating(true);

    try {
      // Create a new array of puzzles with their respective settings
      const puzzlesWithSettings = puzzles.map((puzzleItem, index) => {
        const settings = pageSettings[index] || pageSettings[0];
        return {
          ...puzzleItem,
          pageSettings: settings
        };
      });

      const pdfDocument = puzzleType === "crossword" ? (
        <CrosswordPDFPreview
          puzzle={puzzles[activePuzzleIndex] as CrosswordGrid}
          allPuzzles={puzzles as CrosswordGrid[]}
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
          letterSizeMultiplier={letterSizeMultiplier}
          titleSizeMultiplier={titleSizeMultiplier}
          subtitleSizeMultiplier={subtitleSizeMultiplier}
          instructionSizeMultiplier={instructionSizeMultiplier}
          wordListSizeMultiplier={wordListSizeMultiplier}
          showSolution={false}
          includeSolution={false} // Don't add additional answer pages in the PDF component
        />
      ) : (
        <PuzzlePDFPreview
          puzzle={puzzles[activePuzzleIndex] as PuzzleGrid}
          allPuzzles={puzzlesWithSettings as PuzzleGrid[]}
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
          letterSizeMultiplier={letterSizeMultiplier}
          titleSizeMultiplier={titleSizeMultiplier}
          subtitleSizeMultiplier={subtitleSizeMultiplier}
          instructionSizeMultiplier={instructionSizeMultiplier}
          wordListSizeMultiplier={wordListSizeMultiplier}
          includeSolution={false} // Don't add additional answer pages in the PDF component
        />
      );

      const blob = await pdf(pdfDocument).toBlob();
      setPdfBlob(blob);
      setIsPDFReady(true);
      setShowLivePreview(true);

      toast({ title: "PDF Ready", description: "Your layout has been saved. Click 'Download PDF' to download." });
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      toast({ variant: "destructive", title: "Error", description: `Failed to generate PDF: ${error instanceof Error ? error.message : "Unknown error"}` });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (puzzles.length === 0) {
      toast({ variant: "destructive", title: "Error", description: "No puzzles to download. Please generate puzzles first." });
      return;
    }

    if (!isPDFReady || !pdfBlob) {
      toast({ variant: "destructive", title: "Error", description: "Please save the layout first by clicking 'Save Layout'." });
      return;
    }

    try {
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title.toLowerCase().replace(/\s+/g, '-')}.pdf`;
      link.click();
      URL.revokeObjectURL(url);

      toast({ title: "Success", description: "PDF downloaded successfully!" });
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to download PDF:', error);
      toast({ variant: "destructive", title: "Error", description: `Failed to download PDF: ${error instanceof Error ? error.message : "Unknown error"}` });
    }
  };

  const formatSliderValue = (value: number) => `${(value * 100).toFixed(0)}%`;

  const getPositionValue = (offset: number) => offset === 0 ? '0' : (offset > 0 ? `+${offset}` : `${offset}`);

  const handleSelectPuzzle = (index: number) => {
    if (index >= 0 && index < displayPages.length) {
      // If not in "edit all pages" mode, save the current page settings
      if (!editAllPages) {
        savePageSettings();
      }
      
      setActivePuzzleIndex(index);
    }
  };

  const renderPreview = () => {
    if (displayPages.length === 0) return null;

    const { puzzle, isAnswer, pageNumber } = displayPages[activePuzzleIndex];
    const PreviewComponent = visualPreviewComponent === "crossword" ? CrosswordVisualPreview : VisualPreview;

    // Get settings for the current page
    const currentSettings = !editAllPages && pageSettings[activePuzzleIndex] 
      ? pageSettings[activePuzzleIndex] 
      : {
          title,
          subtitle,
          instruction,
          showTitle,
          showSubtitle,
          showInstruction: !isAnswer && showInstruction,
          showGrid,
          showWordList,
          titleOffset,
          subtitleOffset,
          instructionOffset,
          gridOffset,
          wordListOffset,
          letterSizeMultiplier,
          titleSizeMultiplier,
          subtitleSizeMultiplier,
          instructionSizeMultiplier,
          wordListSizeMultiplier,
        };

    return (
      <PreviewComponent
        puzzle={puzzle}
        showLivePreview={showLivePreview}
        isPDFReady={isPDFReady}
        title={currentSettings.title}
        subtitle={currentSettings.subtitle}
        instruction={currentSettings.instruction}
        showTitle={currentSettings.showTitle}
        showSubtitle={currentSettings.showSubtitle}
        showInstruction={!isAnswer && currentSettings.showInstruction}
        showGrid={currentSettings.showGrid}
        showWordList={currentSettings.showWordList}
        titleOffset={currentSettings.titleOffset}
        subtitleOffset={currentSettings.subtitleOffset}
        instructionOffset={currentSettings.instructionOffset}
        gridOffset={currentSettings.gridOffset}
        wordListOffset={currentSettings.wordListOffset}
        currentWidth={currentWidth}
        currentHeight={currentHeight}
        contentWidth={contentWidth}
        contentHeight={contentHeight}
        cellSize={cellSize}
        letterSize={letterSize}
        letterSizeMultiplier={currentSettings.letterSizeMultiplier}
        titleSizeMultiplier={currentSettings.titleSizeMultiplier}
        subtitleSizeMultiplier={currentSettings.subtitleSizeMultiplier}
        instructionSizeMultiplier={currentSettings.instructionSizeMultiplier}
        wordListSizeMultiplier={currentSettings.wordListSizeMultiplier}
        previewScaleFactor={previewScaleFactor}
        fontSizes={fontSizes}
        getVerticalOffset={getVerticalOffset}
        showSolution={isAnswer}
        includeSolution={includeSolution}
        isAnswer={isAnswer}
        pageNumber={pageNumber}
      />
    );
  };

  useEffect(() => {
    setIsPDFReady(false);
    setShowLivePreview(false);
  }, [
    titleSizeMultiplier, subtitleSizeMultiplier, instructionSizeMultiplier,
    cellSizeMultiplier, letterSizeMultiplier, wordListSizeMultiplier,
    showTitle, showSubtitle, showInstruction, showWordList, showGrid,
    titleOffset, subtitleOffset, instructionOffset, gridOffset, wordListOffset,
    title, subtitle, instruction, selectedSize, customWidth, customHeight,
    activePuzzleIndex, puzzles
  ]);

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
          
          // New props for page editing mode
          editAllPages={editAllPages}
          setEditAllPages={setEditAllPages}
          savePageSettings={savePageSettings}
        />
      </DialogContent>
    </Dialog>
  );
}
