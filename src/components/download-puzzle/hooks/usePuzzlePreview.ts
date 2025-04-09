
import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { CrosswordGrid } from "@/utils/crosswordUtils";
import { PuzzleGrid } from "@/utils/wordSearchUtils";
import { CombinedPuzzleGrid } from "../types";
import { PuzzlePDFPreview } from "../PuzzlePDFPreview";
import { CrosswordPDFPreview } from "../CrosswordPDFPreview";
import { useToast } from "@/hooks/use-toast";

export function usePuzzlePreview() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPDFReady, setIsPDFReady] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [showLivePreview, setShowLivePreview] = useState(false);
  
  const { toast } = useToast();

  const handleSaveLayout = async (
    puzzles: CombinedPuzzleGrid[],
    activePuzzleIndex: number,
    puzzleType: "wordsearch" | "crossword",
    title: string,
    subtitle: string,
    instruction: string,
    showTitle: boolean,
    showSubtitle: boolean,
    showInstruction: boolean,
    showGrid: boolean,
    showWordList: boolean,
    titleOffset: number,
    subtitleOffset: number,
    instructionOffset: number,
    gridOffset: number,
    wordListOffset: number,
    currentWidth: number,
    currentHeight: number,
    contentWidth: number,
    contentHeight: number,
    cellSize: number,
    letterSizeMultiplier: number,
    titleSizeMultiplier: number,
    subtitleSizeMultiplier: number,
    instructionSizeMultiplier: number,
    wordListSizeMultiplier: number
  ) => {
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
      
      let pdfDocument;
      
      if (puzzleType === "crossword") {
        pdfDocument = (
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
            includeSolution={true}
          />
        );
      } else {
        pdfDocument = (
          <PuzzlePDFPreview
            puzzle={puzzles[activePuzzleIndex] as PuzzleGrid}
            allPuzzles={puzzles as PuzzleGrid[]}
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
            showSolution={false}
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

  const handleDownload = async (
    puzzles: CombinedPuzzleGrid[],
    isPDFReady: boolean,
    pdfBlob: Blob | null,
    title: string,
    onOpenChange: (open: boolean) => void
  ) => {
    if (puzzles.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No puzzles to download. Please generate puzzles first.",
      });
      return;
    }
    
    if (!isPDFReady || !pdfBlob) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please save the layout first by clicking 'Save Layout'.",
      });
      return;
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
      
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to download PDF:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to download PDF: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    }
  };

  const formatSliderValue = (value: number) => {
    return `${(value * 100).toFixed(0)}%`;
  };

  return {
    isGenerating,
    isPDFReady,
    pdfBlob,
    showLivePreview,
    setIsPDFReady,
    setShowLivePreview,
    handleSaveLayout,
    handleDownload,
    formatSliderValue,
  };
}
