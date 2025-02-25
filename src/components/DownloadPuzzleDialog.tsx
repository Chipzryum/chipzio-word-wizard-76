
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
import { PuzzleGrid } from "@/utils/wordSearchUtils";
import { pdf, Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";

// Register the New Peninim MT font for PDF generation
Font.register({
  family: 'New Peninim MT',
  src: '/fonts/NewPeninimMT-Regular.ttf'
});

const PAGE_SIZES = {
  'A3': { width: 841.89, height: 1190.55 },
  'A4': { width: 595.28, height: 841.89 },
  'A5': { width: 419.53, height: 595.28 },
  'A6': { width: 297.64, height: 419.53 },
  'Letter': { width: 612, height: 792 },
  'Legal': { width: 612, height: 1008 },
  'Custom': { width: 595.28, height: 841.89 },
};

const UNITS = {
  'Points': 1,
  'Millimeters': 2.83465,
  'Inches': 72,
};

type PageSize = keyof typeof PAGE_SIZES;
type Unit = keyof typeof UNITS;

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: 'New Peninim MT',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
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
    width: 20,
    height: 20,
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordList: {
    marginTop: 20,
    columns: 4,
    columnGap: 20,
  },
});

interface DownloadPuzzleDialogProps {
  open: boolean;
  onClose: () => void;
  puzzle: PuzzleGrid | null;
}

export function DownloadPuzzleDialog({
  open,
  onClose,
  puzzle,
}: DownloadPuzzleDialogProps) {
  const [title, setTitle] = useState("Word Search Puzzle");
  const [selectedSize, setSelectedSize] = useState<PageSize>("A4");
  const [selectedUnit, setSelectedUnit] = useState<Unit>("Points");
  const [customWidth, setCustomWidth] = useState(PAGE_SIZES.A4.width);
  const [customHeight, setCustomHeight] = useState(PAGE_SIZES.A4.height);

  const currentWidth = selectedSize === "Custom" ? customWidth : PAGE_SIZES[selectedSize].width;
  const currentHeight = selectedSize === "Custom" ? customHeight : PAGE_SIZES[selectedSize].height;

  const handleSizeChange = (size: PageSize) => {
    setSelectedSize(size);
    if (size !== "Custom") {
      setCustomWidth(PAGE_SIZES[size].width);
      setCustomHeight(PAGE_SIZES[size].height);
    }
  };

  const handleDimensionChange = (dimension: "width" | "height", value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    const pointValue = numValue * UNITS[selectedUnit];
    if (dimension === "width") {
      setCustomWidth(pointValue);
    } else {
      setCustomHeight(pointValue);
    }
    setSelectedSize("Custom");
  };

  const convertFromPoints = (points: number) => {
    return (points / UNITS[selectedUnit]).toFixed(2);
  };

  const handleDownload = async () => {
    if (!puzzle) return;

    try {
      const blob = await pdf(
        <Document>
          <Page size={[currentWidth, currentHeight]} style={styles.page}>
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <style>
          {`
            @font-face {
              font-family: 'New Peninim MT';
              src: url('/fonts/NewPeninimMT-Regular.ttf') format('truetype');
            }
          `}
        </style>
        <DialogHeader>
          <DialogTitle>Download Puzzle</DialogTitle>
          <DialogDescription>
            Customize your puzzle before downloading
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
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
              <select
                className="w-full p-2 border rounded"
                value={selectedSize}
                onChange={(e) => handleSizeChange(e.target.value as PageSize)}
              >
                {Object.keys(PAGE_SIZES).map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            {selectedSize === "Custom" && (
              <>
                <div className="space-y-2">
                  <Label>Units</Label>
                  <select
                    className="w-full p-2 border rounded"
                    value={selectedUnit}
                    onChange={(e) => setSelectedUnit(e.target.value as Unit)}
                  >
                    {Object.keys(UNITS).map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Width</Label>
                    <Input
                      type="number"
                      value={convertFromPoints(currentWidth)}
                      onChange={(e) => handleDimensionChange("width", e.target.value)}
                      min="1"
                      step="0.01"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Height</Label>
                    <Input
                      type="number"
                      value={convertFromPoints(currentHeight)}
                      onChange={(e) => handleDimensionChange("height", e.target.value)}
                      min="1"
                      step="0.01"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="space-y-4">
            <Label>Preview</Label>
            <div className="border rounded-lg p-4 bg-white">
              <div 
                className="relative bg-gray-50 border"
                style={{
                  width: '100%',
                  paddingTop: `${(currentHeight / currentWidth) * 100}%`
                }}
              >
                <div className="absolute inset-0 p-4">
                  <div className="w-full h-full flex flex-col">
                    <div className="text-center font-bold mb-2 text-xs" style={{ fontFamily: 'New Peninim MT' }}>{title}</div>
                    <div className="flex-1 grid place-items-center">
                      <div className="grid grid-cols-1 gap-0.5">
                        {puzzle?.grid.map((row, i) => (
                          <div key={i} className="flex gap-0.5">
                            {row.map((cell, j) => (
                              <div
                                key={`${i}-${j}`}
                                className="w-2 h-2 flex items-center justify-center text-[4px]"
                                style={{ fontFamily: 'New Peninim MT' }}
                              >
                                {cell}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-2 text-[6px] flex flex-wrap gap-1" style={{ fontFamily: 'New Peninim MT' }}>
                      {puzzle?.wordPlacements.map(({ word }, i) => (
                        <span key={i} className="mr-1">{word}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-2 text-xs text-center text-muted-foreground">
                {convertFromPoints(currentWidth)} × {convertFromPoints(currentHeight)} {selectedUnit.toLowerCase()}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleDownload}>Download PDF</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
