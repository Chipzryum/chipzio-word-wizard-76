
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
import { Slider } from "@/components/ui/slider";
import { PuzzleGrid } from "@/utils/wordSearchUtils";
import { pdf, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

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
const BORDER_WIDTH = 2;
const BASE_PADDING = 20;

// Default font size multipliers
const DEFAULT_TITLE_MULTIPLIER = 1.0;      // 24-36pt
const DEFAULT_SUBTITLE_MULTIPLIER = 1.0;    // 16-24pt
const DEFAULT_INSTRUCTION_MULTIPLIER = 1.0; // 10-14pt
const DEFAULT_CELL_MULTIPLIER = 1.0;        // Dynamic based on grid size
const DEFAULT_WORDLIST_MULTIPLIER = 1.0;    // 8-12pt

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
  
  // Size multiplier sliders
  const [titleSizeMultiplier, setTitleSizeMultiplier] = useState(DEFAULT_TITLE_MULTIPLIER);
  const [subtitleSizeMultiplier, setSubtitleSizeMultiplier] = useState(DEFAULT_SUBTITLE_MULTIPLIER);
  const [instructionSizeMultiplier, setInstructionSizeMultiplier] = useState(DEFAULT_INSTRUCTION_MULTIPLIER);
  const [cellSizeMultiplier, setCellSizeMultiplier] = useState(DEFAULT_CELL_MULTIPLIER);
  const [wordListSizeMultiplier, setWordListSizeMultiplier] = useState(DEFAULT_WORDLIST_MULTIPLIER);

  const currentWidth = selectedSize === "Custom" ? customWidth : PAGE_SIZES[selectedSize].width;
  const currentHeight = selectedSize === "Custom" ? customHeight : PAGE_SIZES[selectedSize].height;

  // Calculate available content area (after margins and border)
  const contentWidth = currentWidth - (2 * PDF_MARGIN) - (2 * BASE_PADDING) - (2 * BORDER_WIDTH);
  const contentHeight = currentHeight - (2 * PDF_MARGIN) - (2 * BASE_PADDING) - (2 * BORDER_WIDTH);

  // Calculate preview size (maintaining aspect ratio)
  const previewContainerWidth = 300;
  const previewContainerHeight = 400;
  const widthScale = previewContainerWidth / currentWidth;
  const heightScale = previewContainerHeight / currentHeight;
  const previewScaleFactor = Math.min(widthScale, heightScale);

  // Calculate font sizes based on page dimensions and multipliers
  const calculateFontSizes = () => {
    // Base sizes for A4
    const a4Width = PAGE_SIZES.A4.width;
    const a4Height = PAGE_SIZES.A4.height;
    const sizeRatio = Math.sqrt((currentWidth * currentHeight) / (a4Width * a4Height));
    
    return {
      titleSize: Math.max(20, Math.min(42, Math.floor(36 * sizeRatio * titleSizeMultiplier))),
      subtitleSize: Math.max(14, Math.min(30, Math.floor(24 * sizeRatio * subtitleSizeMultiplier))),
      instructionSize: Math.max(8, Math.min(18, Math.floor(14 * sizeRatio * instructionSizeMultiplier))),
      wordListSize: Math.max(6, Math.min(16, Math.floor(12 * sizeRatio * wordListSizeMultiplier))),
    };
  };

  const fontSizes = calculateFontSizes();
  
  // Calculate grid cell size based on page dimensions, grid size, and the cell size multiplier
  const calculateGridCellSize = () => {
    if (!puzzle) return 20;
    
    const gridWidth = puzzle.grid[0].length;
    const gridHeight = puzzle.grid.length;
    
    // Reserve space for titles and word list
    const titlesHeight = fontSizes.titleSize + fontSizes.subtitleSize + fontSizes.instructionSize + 40;
    const wordListHeight = fontSizes.wordListSize * 3;
    
    const availableHeight = contentHeight - titlesHeight - wordListHeight;
    const availableWidth = contentWidth;
    
    // Calculate cell size to fit the grid
    const cellSizeByWidth = availableWidth / gridWidth;
    const cellSizeByHeight = availableHeight / gridHeight;
    
    const baseSize = Math.min(cellSizeByWidth, cellSizeByHeight);
    
    // Apply the cell size multiplier
    return baseSize * cellSizeMultiplier;
  };

  const cellSize = calculateGridCellSize();

  // Create styles for PDF dynamically based on page size and multipliers
  const createPDFStyles = () => {
    return StyleSheet.create({
      page: {
        padding: PDF_MARGIN,
        fontFamily: 'Times-Roman',
      },
      container: {
        flex: 1,
        border: BORDER_WIDTH,
        padding: BASE_PADDING,
      },
      title: {
        fontSize: fontSizes.titleSize,
        marginBottom: 10,
        textAlign: 'center',
        fontWeight: 'bold',
      },
      subtitle: {
        fontSize: fontSizes.subtitleSize,
        marginBottom: 10,
        textAlign: 'center',
        fontFamily: 'Times-Italic',
      },
      instruction: {
        fontSize: fontSizes.instructionSize,
        marginBottom: 20,
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
        width: cellSize,
        height: cellSize,
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.5,
        borderColor: '#000',
        fontSize: Math.min(cellSize * 0.6, fontSizes.wordListSize * 1.5),
      },
      wordList: {
        marginTop: 20,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
      },
      wordItem: {
        marginHorizontal: 15,
        marginVertical: 5,
        fontSize: fontSizes.wordListSize,
      },
    });
  };

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
      const pdfStyles = createPDFStyles();
      
      const blob = await pdf(
        <Document>
          <Page size={[currentWidth, currentHeight]} style={pdfStyles.page}>
            <View style={pdfStyles.container}>
              <Text style={pdfStyles.title}>{title.toUpperCase()}</Text>
              <Text style={pdfStyles.subtitle}>{subtitle.toLowerCase()}</Text>
              <Text style={pdfStyles.instruction}>{instruction}</Text>
              <View style={pdfStyles.grid}>
                {puzzle.grid.map((row, i) => (
                  <View key={i} style={pdfStyles.row}>
                    {row.map((cell, j) => (
                      <Text key={`${i}-${j}`} style={pdfStyles.cell}>
                        {cell}
                      </Text>
                    ))}
                  </View>
                ))}
              </View>
              <View style={pdfStyles.wordList}>
                {puzzle.wordPlacements.map(({ word }, index) => (
                  <Text key={index} style={pdfStyles.wordItem}>{word.toLowerCase()}</Text>
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

  // Format slider value for display
  const formatSliderValue = (value: number) => {
    return `${(value * 100).toFixed(0)}%`;
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
              <div className="flex items-center justify-between mt-2">
                <Label htmlFor="titleSize" className="text-xs">Size: {formatSliderValue(titleSizeMultiplier)}</Label>
                <Slider 
                  id="titleSize"
                  min={0.5} 
                  max={1.5} 
                  step={0.1}
                  value={[titleSizeMultiplier]} 
                  onValueChange={(value) => setTitleSizeMultiplier(value[0])}
                  className="w-32"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Enter subtitle"
              />
              <div className="flex items-center justify-between mt-2">
                <Label htmlFor="subtitleSize" className="text-xs">Size: {formatSliderValue(subtitleSizeMultiplier)}</Label>
                <Slider 
                  id="subtitleSize"
                  min={0.5} 
                  max={1.5} 
                  step={0.1}
                  value={[subtitleSizeMultiplier]} 
                  onValueChange={(value) => setSubtitleSizeMultiplier(value[0])}
                  className="w-32"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instruction">Instruction</Label>
              <Input
                id="instruction"
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                placeholder="Enter instruction text"
              />
              <div className="flex items-center justify-between mt-2">
                <Label htmlFor="instructionSize" className="text-xs">Size: {formatSliderValue(instructionSizeMultiplier)}</Label>
                <Slider 
                  id="instructionSize"
                  min={0.5} 
                  max={1.5} 
                  step={0.1}
                  value={[instructionSizeMultiplier]} 
                  onValueChange={(value) => setInstructionSizeMultiplier(value[0])}
                  className="w-32"
                />
              </div>
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

            <div className="space-y-2">
              <Label htmlFor="cellSize">Letter Size</Label>
              <div className="flex items-center justify-between">
                <span className="text-xs">{formatSliderValue(cellSizeMultiplier)}</span>
                <Slider 
                  id="cellSize"
                  min={0.7} 
                  max={1.5} 
                  step={0.1}
                  value={[cellSizeMultiplier]} 
                  onValueChange={(value) => setCellSizeMultiplier(value[0])}
                  className="w-full mx-2"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="wordListSize">Word List Size</Label>
              <div className="flex items-center justify-between">
                <span className="text-xs">{formatSliderValue(wordListSizeMultiplier)}</span>
                <Slider 
                  id="wordListSize"
                  min={0.7} 
                  max={1.5} 
                  step={0.1}
                  value={[wordListSizeMultiplier]} 
                  onValueChange={(value) => setWordListSizeMultiplier(value[0])}
                  className="w-full mx-2"
                />
              </div>
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
                      fontSize: `${fontSizes.titleSize * previewScaleFactor}px`,
                      marginBottom: `${10 * previewScaleFactor}px`,
                    }}
                  >
                    {title.toUpperCase()}
                  </div>
                  
                  <div 
                    className="text-center font-serif italic"
                    style={{
                      fontSize: `${fontSizes.subtitleSize * previewScaleFactor}px`,
                      marginBottom: `${10 * previewScaleFactor}px`,
                    }}
                  >
                    {subtitle.toLowerCase()}
                  </div>
                  
                  <div 
                    className="text-center font-serif"
                    style={{
                      fontSize: `${fontSizes.instructionSize * previewScaleFactor}px`,
                      marginBottom: `${20 * previewScaleFactor}px`,
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
                                fontSize: `${Math.min(cellSize * 0.6, fontSizes.wordListSize * 1.5) * previewScaleFactor}px`,
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
                      fontSize: `${fontSizes.wordListSize * previewScaleFactor}px`,
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
