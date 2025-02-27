
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

// Constants for PDF layout
const PDF_MARGIN = 40;
const TITLE_FONT_SIZE = 36;
const SUBTITLE_FONT_SIZE = 24;
const INSTRUCTION_FONT_SIZE = 14;
const GRID_FONT_SIZE = 12;
const WORD_LIST_FONT_SIZE = 12;
const TITLE_MARGIN = 10;
const SUBTITLE_MARGIN = 10;
const INSTRUCTION_MARGIN = 20;
const WORD_LIST_MARGIN = 30;
const BORDER_WIDTH = 2;

const styles = StyleSheet.create({
  page: {
    padding: PDF_MARGIN,
    fontSize: GRID_FONT_SIZE,
    fontFamily: 'Times-Roman',
  },
  container: {
    flex: 1,
    border: BORDER_WIDTH,
    padding: 20,
  },
  title: {
    fontSize: TITLE_FONT_SIZE,
    marginBottom: TITLE_MARGIN,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: SUBTITLE_FONT_SIZE,
    marginBottom: SUBTITLE_MARGIN,
    textAlign: 'center',
    fontFamily: 'Times-Italic',
  },
  instruction: {
    fontSize: INSTRUCTION_FONT_SIZE,
    marginBottom: INSTRUCTION_MARGIN,
    textAlign: 'center',
  },
  grid: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  cell: {
    width: GRID_FONT_SIZE * 2,
    height: GRID_FONT_SIZE * 2,
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: '#000',
    fontSize: GRID_FONT_SIZE,
  },
  wordList: {
    marginTop: WORD_LIST_MARGIN,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  wordItem: {
    marginHorizontal: 15,
    marginVertical: 5,
    fontSize: WORD_LIST_FONT_SIZE,
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
  const [subtitle, setSubtitle] = useState("word search");
  const [instruction, setInstruction] = useState("Can you find all the words?");
  const [selectedSize, setSelectedSize] = useState<PageSize>("A4");
  const [selectedUnit, setSelectedUnit] = useState<Unit>("Points");
  const [customWidth, setCustomWidth] = useState(PAGE_SIZES.A4.width);
  const [customHeight, setCustomHeight] = useState(PAGE_SIZES.A4.height);

  const currentWidth = selectedSize === "Custom" ? customWidth : PAGE_SIZES[selectedSize].width;
  const currentHeight = selectedSize === "Custom" ? customHeight : PAGE_SIZES[selectedSize].height;

  // Calculate the maximum preview size that maintains aspect ratio
  const previewContainerWidth = 300; // Fixed width for preview container
  const previewContainerHeight = 400; // Fixed height for preview container
  
  // Calculate scaling to fit within the preview container while maintaining aspect ratio
  const widthScale = previewContainerWidth / currentWidth;
  const heightScale = previewContainerHeight / currentHeight;
  const previewScaleFactor = Math.min(widthScale, heightScale);

  // Calculate grid cell size based on page dimensions and grid size
  const calculateGridCellSize = () => {
    if (!puzzle) return GRID_FONT_SIZE * 2;
    
    const contentWidth = currentWidth - (2 * PDF_MARGIN) - (2 * 20) - (2 * BORDER_WIDTH);
    const contentHeight = currentHeight - (2 * PDF_MARGIN) - (2 * 20) - (2 * BORDER_WIDTH) 
      - TITLE_FONT_SIZE - SUBTITLE_FONT_SIZE - INSTRUCTION_FONT_SIZE - WORD_LIST_MARGIN - WORD_LIST_FONT_SIZE * 3;
    
    const gridWidth = puzzle.grid[0].length;
    const gridHeight = puzzle.grid.length;
    
    // Use the smaller dimension to ensure the grid fits
    const cellSizeByWidth = contentWidth / gridWidth;
    const cellSizeByHeight = contentHeight / gridHeight;
    
    return Math.min(cellSizeByWidth, cellSizeByHeight);
  };

  const cellSize = calculateGridCellSize();

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
      // Create dynamic styles for the PDF to adjust cell size
      const dynamicStyles = StyleSheet.create({
        cell: {
          width: cellSize,
          height: cellSize,
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 0.5,
          borderColor: '#000',
          fontSize: Math.min(cellSize * 0.6, GRID_FONT_SIZE),
        },
      });

      const blob = await pdf(
        <Document>
          <Page size={[currentWidth, currentHeight]} style={styles.page}>
            <View style={styles.container}>
              <Text style={styles.title}>{title.toUpperCase()}</Text>
              <Text style={styles.subtitle}>{subtitle.toLowerCase()}</Text>
              <Text style={styles.instruction}>{instruction}</Text>
              <View style={styles.grid}>
                {puzzle.grid.map((row, i) => (
                  <View key={i} style={styles.row}>
                    {row.map((cell, j) => (
                      <Text key={`${i}-${j}`} style={dynamicStyles.cell}>
                        {cell}
                      </Text>
                    ))}
                  </View>
                ))}
              </View>
              <View style={styles.wordList}>
                {puzzle.wordPlacements.map(({ word }, index) => (
                  <Text key={index} style={styles.wordItem}>{word.toLowerCase()}</Text>
                ))}
              </View>
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
        <DialogHeader>
          <DialogTitle>Download Puzzle</DialogTitle>
          <DialogDescription>
            Customize your puzzle before downloading
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Main Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter main title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Enter subtitle"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instruction">Instruction</Label>
              <Input
                id="instruction"
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                placeholder="Enter instruction text"
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
            <div className="border rounded-lg p-4 bg-white h-[430px] flex flex-col items-center justify-center">
              <div 
                className="relative border-2 border-black bg-white p-4"
                style={{
                  width: `${currentWidth * previewScaleFactor}px`,
                  height: `${currentHeight * previewScaleFactor}px`,
                  maxWidth: '100%',
                  maxHeight: '380px',
                }}
              >
                <div className="flex flex-col h-full">
                  <div 
                    className="text-center font-bold font-serif"
                    style={{
                      fontSize: `${TITLE_FONT_SIZE * previewScaleFactor}px`,
                      marginBottom: `${TITLE_MARGIN * previewScaleFactor}px`,
                    }}
                  >
                    {title.toUpperCase()}
                  </div>
                  
                  <div 
                    className="text-center font-serif italic"
                    style={{
                      fontSize: `${SUBTITLE_FONT_SIZE * previewScaleFactor}px`,
                      marginBottom: `${SUBTITLE_MARGIN * previewScaleFactor}px`,
                    }}
                  >
                    {subtitle.toLowerCase()}
                  </div>
                  
                  <div 
                    className="text-center font-serif"
                    style={{
                      fontSize: `${INSTRUCTION_FONT_SIZE * previewScaleFactor}px`,
                      marginBottom: `${INSTRUCTION_MARGIN * previewScaleFactor}px`,
                    }}
                  >
                    {instruction}
                  </div>
                  
                  <div className="flex-1 grid place-items-center mb-4">
                    <div className="grid grid-cols-1">
                      {puzzle?.grid.map((row, i) => (
                        <div key={i} className="flex">
                          {row.map((cell, j) => (
                            <div
                              key={`${i}-${j}`}
                              className="flex items-center justify-center font-serif border border-black"
                              style={{
                                width: `${cellSize * previewScaleFactor}px`,
                                height: `${cellSize * previewScaleFactor}px`,
                                fontSize: `${Math.min(cellSize * 0.6, GRID_FONT_SIZE) * previewScaleFactor}px`,
                              }}
                            >
                              {cell}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div 
                    className="flex flex-wrap justify-center gap-2 font-serif"
                    style={{
                      fontSize: `${WORD_LIST_FONT_SIZE * previewScaleFactor}px`,
                    }}
                  >
                    {puzzle?.wordPlacements.map(({ word }, i) => (
                      <span key={i} className="mx-3 my-1">{word.toLowerCase()}</span>
                    ))}
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
