
import { useState, useEffect } from "react";
import { pdf } from "@react-pdf/renderer";
import { useToast } from "@/hooks/use-toast";
import { CombinedPuzzleGrid, PageSize, Unit } from "../types";
import { PuzzlePDFPreview } from "../PuzzlePDFPreview";
import { CrosswordPDFPreview } from "../CrosswordPDFPreview";
import { 
  PAGE_SIZES, 
  UNITS, 
  PDF_MARGIN, 
  BORDER_WIDTH, 
  BASE_PADDING, 
  MAX_OFFSET,
  MAX_LETTER_SIZE
} from "../constants";

interface UsePuzzlePreviewProps {
  puzzles: CombinedPuzzleGrid[];
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
  selectedSize: PageSize;
  customWidth: number;
  customHeight: number;
  titleSizeMultiplier: number;
  subtitleSizeMultiplier: number;
  instructionSizeMultiplier: number;
  cellSizeMultiplier: number;
  letterSizeMultiplier: number;
  wordListSizeMultiplier: number;
  includeSolution: boolean;
  puzzleType: "wordsearch" | "crossword";
}

export const usePuzzlePreview = ({
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
}: UsePuzzlePreviewProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPDFReady, setIsPDFReady] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [showLivePreview, setShowLivePreview] = useState(false);
  const [activePuzzleIndex, setActivePuzzleIndex] = useState(0);
  const [displayPages, setDisplayPages] = useState<any[]>([]);

  const { toast } = useToast();
  const previewScaleFactor = 0.3;

  useEffect(() => {
    if (puzzles.length > 0) {
      createDisplayPages(puzzles, includeSolution);
      setActivePuzzleIndex(0);
    }
  }, [puzzles, includeSolution]);

  const createDisplayPages = (puzzlesArray: CombinedPuzzleGrid[], includeSol: boolean) => {
    const pages = [];
    
    for (let i = 0; i < puzzlesArray.length; i++) {
      pages.push({
        puzzle: puzzlesArray[i],
        isAnswer: false,
        pageNumber: i + 1
      });
      
      if (includeSol) {
        pages.push({
          puzzle: puzzlesArray[i],
          isAnswer: true,
          pageNumber: i + 1
        });
      }
    }
    
    setDisplayPages(pages);
  };

  const currentWidth = selectedSize === "Custom" ? customWidth : PAGE_SIZES[selectedSize].width;
  const currentHeight = selectedSize === "Custom" ? customHeight : PAGE_SIZES[selectedSize].height;

  const contentWidth = currentWidth - (2 * PDF_MARGIN) - (2 * BASE_PADDING) - (2 * BORDER_WIDTH);
  const contentHeight = currentHeight - (2 * PDF_MARGIN) - (2 * BASE_PADDING) - (2 * BORDER_WIDTH);

  const calculateFontSizes = () => {
    const a4Width = PAGE_SIZES.A4.width;
    const a4Height = PAGE_SIZES.A4.height;
    const sizeRatio = Math.sqrt((currentWidth * currentHeight) / (a4Width * a4Height));
    
    return {
      titleSize: Math.max(20, Math.min(48, Math.floor(36 * sizeRatio * titleSizeMultiplier))),
      subtitleSize: Math.max(14, Math.min(36, Math.floor(24 * sizeRatio * subtitleSizeMultiplier))),
      instructionSize: Math.max(8, Math.min(24, Math.floor(14 * sizeRatio * instructionSizeMultiplier))),
      wordListSize: Math.max(6, Math.min(28, Math.floor(12 * sizeRatio * wordListSizeMultiplier))),
    };
  };

  const fontSizes = calculateFontSizes();
  
  const calculateSpaceNeeded = () => {
    let space = 0;
    if (showTitle) space += fontSizes.titleSize * titleSizeMultiplier + 10;
    if (showSubtitle) space += fontSizes.subtitleSize * subtitleSizeMultiplier + 10;
    if (showInstruction) space += fontSizes.instructionSize * instructionSizeMultiplier + 20;
    if (showWordList) space += fontSizes.wordListSize * wordListSizeMultiplier * 3;
    return space;
  };

  const calculateGridCellSize = () => {
    if (!puzzles[0]) return 20;
    
    const currentPuzzle = puzzles[0];
    const gridWidth = currentPuzzle.grid[0].length;
    const gridHeight = currentPuzzle.grid.length;
    
    const reservedSpace = calculateSpaceNeeded() + 40;
    
    const availableHeight = contentHeight - reservedSpace;
    const availableWidth = contentWidth;
    
    const cellSizeByWidth = availableWidth / gridWidth;
    const cellSizeByHeight = availableHeight / gridHeight;
    
    const baseSize = Math.min(cellSizeByWidth, cellSizeByHeight);
    
    return baseSize * cellSizeMultiplier;
  };

  const cellSize = calculateGridCellSize();
  
  const calculateLetterSize = () => {
    const baseLetterSize = cellSize * 0.6;
    const cappedMultiplier = Math.min(letterSizeMultiplier, MAX_LETTER_SIZE);
    return baseLetterSize * cappedMultiplier;
  };
  
  const letterSize = calculateLetterSize();

  const getVerticalOffset = (offset: number) => {
    const maxAllowedOffset = Math.min(MAX_OFFSET, (contentHeight / 6) / 10);
    return Math.max(-maxAllowedOffset, Math.min(offset * 10, maxAllowedOffset * 10));
  };

  const handleSaveLayout = async () => {
    if (puzzles.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No puzzles to save. Please generate puzzles first.",
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      console.log("Creating PDF with letterSizeMultiplier:", letterSizeMultiplier);
      console.log("Creating PDF with cellSize:", cellSize);
      console.log("Word list visibility:", showWordList);
      
      const cappedLetterSizeMultiplier = Math.min(letterSizeMultiplier, MAX_LETTER_SIZE);
      console.log("Creating PDF with cappedLetterSizeMultiplier:", cappedLetterSizeMultiplier);
      
      let pdfDocument;
      
      if (puzzleType === "crossword") {
        pdfDocument = (
          <CrosswordPDFPreview
            puzzle={puzzles[0]}
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
            includeSolution={true}
          />
        );
      } else {
        pdfDocument = (
          <PuzzlePDFPreview
            puzzle={puzzles[0]}
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
            includeSolution={true}
          />
        );
      }
      
      const blob = await pdf(pdfDocument).toBlob();
      
      console.log("PDF blob generated successfully:", blob);
      setPdfBlob(blob);
      setIsPDFReady(true);
      setShowLivePreview(true);
      
      toast({
        title: "PDF Ready",
        description: "Your layout has been saved. Click 'Download PDF' to download.",
      });
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to generate PDF: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (puzzles.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No puzzles to download. Please generate puzzles first.",
      });
      return false;
    }
    
    if (!isPDFReady || !pdfBlob) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please save the layout first by clicking 'Save Layout'.",
      });
      return false;
    }
    
    try {
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title.toLowerCase().replace(/\s+/g, '-')}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "PDF downloaded successfully!",
      });
      
      return true;
    } catch (error) {
      console.error('Failed to download PDF:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to download PDF: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
      return false;
    }
  };

  const handleSelectPuzzle = (index: number) => {
    if (index >= 0 && index < displayPages.length) {
      setActivePuzzleIndex(index);
    }
  };

  return {
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
  };
};
