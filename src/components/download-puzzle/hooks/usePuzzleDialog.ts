
import { useState, useEffect, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { pdf } from "@react-pdf/renderer";
import { PuzzlePDFPreview } from "../PuzzlePDFPreview";
import { CrosswordPDFPreview } from "../CrosswordPDFPreview";
import { CombinedPuzzleGrid, PageSize, Unit } from "../types";
import { PAGE_SIZES, UNITS, PDF_MARGIN, BASE_PADDING, BORDER_WIDTH, MAX_OFFSET } from "../constants";

export const usePuzzleDialog = (
  puzzle: CombinedPuzzleGrid,
  defaultValues: {
    title: string;
    subtitle: string;
    instruction: string;
  },
  puzzleType: "wordsearch" | "crossword",
  allPuzzles: CombinedPuzzleGrid[] = []
) => {
  const [title, setTitle] = useState(defaultValues.title);
  const [subtitle, setSubtitle] = useState(defaultValues.subtitle);
  const [instruction, setInstruction] = useState(defaultValues.instruction);
  const [selectedSize, setSelectedSize] = useState<PageSize>("A4");
  const [selectedUnit, setSelectedUnit] = useState<Unit>("Points");
  const [customWidth, setCustomWidth] = useState(PAGE_SIZES.A4.width);
  const [customHeight, setCustomHeight] = useState(PAGE_SIZES.A4.height);

  const [titleSizeMultiplier, setTitleSizeMultiplier] = useState(1);
  const [subtitleSizeMultiplier, setSubtitleSizeMultiplier] = useState(1);
  const [instructionSizeMultiplier, setInstructionSizeMultiplier] = useState(1);
  const [cellSizeMultiplier, setCellSizeMultiplier] = useState(1);
  const [letterSizeMultiplier, setLetterSizeMultiplier] = useState(1);
  const [wordListSizeMultiplier, setWordListSizeMultiplier] = useState(1);
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

  const { toast } = useToast();

  // Initialize with provided puzzles when dialog opens
  useEffect(() => {
    const puzzlesArray = allPuzzles.length ? allPuzzles : [puzzle];
    setPuzzles(puzzlesArray);
    createDisplayPages(puzzlesArray);
    setActivePuzzleIndex(0);
  }, [puzzle, allPuzzles]);

  // Update display pages when includeSolution changes
  useEffect(() => {
    if (puzzles.length > 0) {
      createDisplayPages(puzzles);
      setActivePuzzleIndex(0);
    }
  }, [includeSolution]);

  // Update PDF ready state when relevant states change
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

  const currentWidth = useMemo(() => {
    return selectedSize === "Custom" ? customWidth : PAGE_SIZES[selectedSize].width;
  }, [selectedSize, customWidth]);

  const currentHeight = useMemo(() => {
    return selectedSize === "Custom" ? customHeight : PAGE_SIZES[selectedSize].height;
  }, [selectedSize, customHeight]);

  const contentWidth = useMemo(() => {
    return currentWidth - 2 * (PDF_MARGIN + BASE_PADDING + BORDER_WIDTH);
  }, [currentWidth]);

  const contentHeight = useMemo(() => {
    return currentHeight - 2 * (PDF_MARGIN + BASE_PADDING + BORDER_WIDTH);
  }, [currentHeight]);

  const fontSizes = useMemo(() => {
    const sizeRatio = Math.sqrt((currentWidth * currentHeight) / (PAGE_SIZES.A4.width * PAGE_SIZES.A4.height));
    return {
      titleSize: Math.max(20, Math.min(48, Math.floor(36 * sizeRatio * titleSizeMultiplier))),
      subtitleSize: Math.max(14, Math.min(36, Math.floor(24 * sizeRatio * subtitleSizeMultiplier))),
      instructionSize: Math.max(8, Math.min(24, Math.floor(14 * sizeRatio * instructionSizeMultiplier))),
      wordListSize: Math.max(6, Math.min(28, Math.floor(12 * sizeRatio * wordListSizeMultiplier))),
    };
  }, [
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

  const letterSize = useMemo(() => {
    const baseLetterSize = cellSize * 0.6;
    return baseLetterSize * Math.min(letterSizeMultiplier, 1.3); // Cap at 1.3
  }, [cellSize, letterSizeMultiplier]);

  const getVerticalOffset = (offset: number) => {
    const maxAllowedOffset = Math.min(MAX_OFFSET, (contentHeight / 6) / 10);
    return Math.max(-maxAllowedOffset, Math.min(offset * 10, maxAllowedOffset * 10));
  };

  // Modified function to properly create display pages
  const createDisplayPages = (puzzlesArray: CombinedPuzzleGrid[]) => {
    // Filter and organize puzzles by type
    const pages = puzzlesArray.map((puzzle, index) => {
      const isAnswerPage = 'isAnswer' in puzzle && puzzle.isAnswer === true;
      return {
        puzzle,
        isAnswer: isAnswerPage,
        // Calculate page number based on actual position
        pageNumber: index + 1
      };
    });
    
    setDisplayPages(pages);
  };

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
    
    if (element in stateSetters) {
      const setter = stateSetters[element as keyof typeof stateSetters];
      setter(prev => prev + change);
    }
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

  const handleSelectPuzzle = (index: number) => {
    if (index >= 0 && index < displayPages.length) {
      setActivePuzzleIndex(index);
    }
  };

  const handleSaveLayout = async () => {
    if (puzzles.length === 0) {
      toast({ variant: "destructive", title: "Error", description: "No puzzles to save. Please generate puzzles first." });
      return;
    }

    setIsGenerating(true);

    try {
      const pdfDocument = puzzleType === "crossword" ? (
        <CrosswordPDFPreview
          puzzle={puzzles[activePuzzleIndex]}
          allPuzzles={puzzles}
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
          puzzle={puzzles[activePuzzleIndex]}
          allPuzzles={puzzles}
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
      return true; // Return true to indicate success (can be used by parent component)
    } catch (error) {
      console.error('Failed to download PDF:', error);
      toast({ variant: "destructive", title: "Error", description: `Failed to download PDF: ${error instanceof Error ? error.message : "Unknown error"}` });
      return false;
    }
  };

  const formatSliderValue = (value: number) => `${(value * 100).toFixed(0)}%`;

  const getPositionValue = (offset: number) => offset === 0 ? '0' : (offset > 0 ? `+${offset}` : `${offset}`);

  return {
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
    positioningElement,
    togglePositioning,
    moveElement,
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
  };
};
