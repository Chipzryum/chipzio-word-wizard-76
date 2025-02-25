
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PuzzleGrid, WordPlacement } from "@/utils/wordSearchUtils";
import { pdf, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const createStyles = (width: number, height: number) => StyleSheet.create({
  page: {
    padding: Math.min(width, height) * 0.1, // Dynamic padding based on page size
    fontSize: Math.min(width, height) * 0.02, // Dynamic font size
    width: width,
    height: height,
  },
  title: {
    fontSize: Math.min(width, height) * 0.05,
    marginBottom: Math.min(width, height) * 0.04,
    textAlign: 'center',
  },
  grid: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  cell: {
    width: Math.min(width, height) * 0.04,
    height: Math.min(width, height) * 0.04,
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordList: {
    marginTop: Math.min(width, height) * 0.04,
    columns: 4,
    columnGap: Math.min(width, height) * 0.04,
  },
});

interface PuzzlePDFProps {
  title: string;
  puzzle: PuzzleGrid;
  width: number;
  height: number;
}

const PuzzlePDF = ({ title, puzzle, width, height }: PuzzlePDFProps) => {
  const styles = createStyles(width, height);
  return (
    <Document>
      <Page size={[width, height]} style={styles.page}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.grid}>
          {puzzle.grid.map((row, i) => (
            <View key={i} style={styles.row}>
              {row.map((cell, j) => (
                <Text key={`${i}-${j}`} style={styles.cell}>
                  {cell}
                </Text>
              ))}
            </View>
          ))}
        </View>
        <View style={styles.wordList}>
          {puzzle.wordPlacements.map(({ word }, index) => (
            <Text key={index}>{word}</Text>
          ))}
        </View>
      </Page>
    </Document>
  );
};

interface DownloadPuzzleDialogProps {
  open: boolean;
  onClose: () => void;
  puzzle: PuzzleGrid | null;
}

const DEFAULT_SIZES = {
  "A4": { width: 595.28, height: 841.89 },
  "A5": { width: 419.53, height: 595.28 },
  "A6": { width: 297.64, height: 419.53 },
  "Letter": { width: 612, height: 792 },
};

export function DownloadPuzzleDialog({
  open,
  onClose,
  puzzle,
}: DownloadPuzzleDialogProps) {
  const [title, setTitle] = useState("Word Search Puzzle");
  const [pageWidth, setPageWidth] = useState(DEFAULT_SIZES.A4.width);
  const [pageHeight, setPageHeight] = useState(DEFAULT_SIZES.A4.height);
  const [selectedSize, setSelectedSize] = useState("A4");

  const handleSizeChange = (size: keyof typeof DEFAULT_SIZES) => {
    setSelectedSize(size);
    setPageWidth(DEFAULT_SIZES[size].width);
    setPageHeight(DEFAULT_SIZES[size].height);
  };

  const handleDownload = async () => {
    if (!puzzle) return;

    try {
      const blob = await pdf(
        <PuzzlePDF 
          title={title} 
          puzzle={puzzle} 
          width={pageWidth} 
          height={pageHeight} 
        />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title.toLowerCase().replace(/\s+/g, '-')}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      onClose();
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Download Puzzle</DialogTitle>
          <DialogDescription>
            Customize your puzzle before downloading
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Puzzle Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter puzzle title"
            />
          </div>

          <div className="space-y-2">
            <Label>Page Size</Label>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {Object.keys(DEFAULT_SIZES).map((size) => (
                <Button
                  key={size}
                  variant={selectedSize === size ? "default" : "outline"}
                  onClick={() => handleSizeChange(size as keyof typeof DEFAULT_SIZES)}
                  className="w-full"
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Custom Size (points)</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="width" className="text-xs text-muted-foreground">Width</Label>
                <Input
                  id="width"
                  type="number"
                  value={pageWidth}
                  onChange={(e) => {
                    setPageWidth(Number(e.target.value));
                    setSelectedSize("custom");
                  }}
                  min={100}
                  max={2000}
                />
              </div>
              <div>
                <Label htmlFor="height" className="text-xs text-muted-foreground">Height</Label>
                <Input
                  id="height"
                  type="number"
                  value={pageHeight}
                  onChange={(e) => {
                    setPageHeight(Number(e.target.value));
                    setSelectedSize("custom");
                  }}
                  min={100}
                  max={2000}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Preview</Label>
            <div className="border rounded-lg p-4 bg-white overflow-hidden">
              <div 
                className="relative bg-gray-50 border"
                style={{
                  width: '100%',
                  paddingTop: `${(pageHeight / pageWidth) * 100}%`,
                }}
              >
                <div className="absolute inset-0 p-4">
                  <div className="w-full h-full flex flex-col">
                    <div className="text-center font-bold mb-4 text-xs">{title}</div>
                    <div className="flex-1 grid place-items-center">
                      <div className="grid grid-cols-1 gap-0.5">
                        {puzzle?.grid.map((row, i) => (
                          <div key={i} className="flex gap-0.5">
                            {row.map((cell, j) => (
                              <div
                                key={`${i}-${j}`}
                                className="w-2 h-2 flex items-center justify-center text-[4px]"
                              >
                                {cell}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-2 text-[6px] flex flex-wrap gap-1">
                      {puzzle?.wordPlacements.slice(0, 6).map(({ word }, i) => (
                        <span key={i}>{word}</span>
                      ))}
                      {puzzle && puzzle.wordPlacements.length > 6 && "..."}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-2 text-xs text-muted-foreground text-center">
                {Math.round(pageWidth)} × {Math.round(pageHeight)} points
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleDownload}>Download PDF</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
