
import { useState } from 'react';
import { pdf } from "@react-pdf/renderer";
import { useToast } from "@/hooks/use-toast";
import { PuzzleGrid } from "@/utils/wordSearchUtils";
import { CrosswordGrid } from "@/utils/crosswordUtils";
import { CombinedPuzzleGrid } from "../types";
import { PuzzlePDFPreview } from "../PuzzlePDFPreview";
import { CrosswordPDFPreview } from "../CrosswordPDFPreview";

export const usePDFGeneration = (
  puzzles: CombinedPuzzleGrid[],
  activePuzzleIndex: number,
  puzzleType: "wordsearch" | "crossword",
  pdfProps: any
) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPDFReady, setIsPDFReady] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [showLivePreview, setShowLivePreview] = useState(false);
  
  const { toast } = useToast();

  const handleSaveLayout = async () => {
    if (puzzles.length === 0) {
      toast({ variant: "destructive", title: "Error", description: "No puzzles to save. Please generate puzzles first." });
      return;
    }

    setIsGenerating(true);

    try {
      const pdfDocument = puzzleType === "crossword" ? (
        <CrosswordPDFPreview
          puzzle={puzzles[activePuzzleIndex] as CrosswordGrid}
          allPuzzles={puzzles as CrosswordGrid[]}
          {...pdfProps}
          showSolution={false}
          includeSolution={false} // Don't add additional answer pages in the PDF component
        />
      ) : (
        <PuzzlePDFPreview
          puzzle={puzzles[activePuzzleIndex] as PuzzleGrid}
          allPuzzles={puzzles as PuzzleGrid[]}
          {...pdfProps}
          includeSolution={false} // Don't add additional answer pages in the PDF component
        />
      );

      const blob = await pdf(pdfDocument).toBlob();
      setPdfBlob(blob);
      setIsPDFReady(true);
      setShowLivePreview(true);

      toast({ title: "PDF Ready", description: "Your layout has been saved. Click 'Download All Pages' to download." });
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
      toast({ variant: "destructive", title: "Error", description: "Please save the layout first by clicking 'Preview Page'." });
      return;
    }

    try {
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${pdfProps.title.toLowerCase().replace(/\s+/g, '-')}.pdf`;
      link.click();
      URL.revokeObjectURL(url);

      toast({ title: "Success", description: "PDF downloaded successfully!" });
      return true;
    } catch (error) {
      console.error('Failed to download PDF:', error);
      toast({ variant: "destructive", title: "Error", description: `Failed to download PDF: ${error instanceof Error ? error.message : "Unknown error"}` });
      return false;
    }
  };

  return {
    isGenerating,
    isPDFReady,
    pdfBlob,
    showLivePreview,
    setIsPDFReady,
    setShowLivePreview,
    handleSaveLayout,
    handleDownload
  };
};
