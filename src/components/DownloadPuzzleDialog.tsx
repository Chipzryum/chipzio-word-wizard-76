
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
import { ChevronUp, ChevronDown, Save, Download, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
const BORDER_WIDTH = 1; // Using 1 to fix the invalid border style issue
const BASE_PADDING = 20;
const MAX_OFFSET = 5; // Reduced maximum offset to prevent elements going outside the page

// Default font size multipliers
const DEFAULT_TITLE_MULTIPLIER = 1.0;
const DEFAULT_SUBTITLE_MULTIPLIER = 1.0;
const DEFAULT_INSTRUCTION_MULTIPLIER = 1.0;
const DEFAULT_CELL_MULTIPLIER = 1.0;
const DEFAULT_LETTER_SIZE_MULTIPLIER = 1.0;
const DEFAULT_WORDLIST_MULTIPLIER = 1.0;

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
  const [letterSizeMultiplier, setLetterSizeMultiplier] = useState(DEFAULT_LETTER_SIZE_MULTIPLIER);
  const [wordListSizeMultiplier, setWordListSizeMultiplier] = useState(DEFAULT_WORDLIST_MULTIPLIER);

  // Toggle states for showing/hiding elements
  const [showTitle, setShowTitle] = useState(true);
  const [showSubtitle, setShowSubtitle] = useState(true);
  const [showInstruction, setShowInstruction] = useState(true);
  const [showWordList, setShowWordList] = useState(true);

  // Position offsets for elements
  const [titleOffset, setTitleOffset] = useState(0);
  const [subtitleOffset, setSubtitleOffset] = useState(0);
  const [instructionOffset, setInstructionOffset] = useState(0);
  const [gridOffset, setGridOffset] = useState(0);
  const [wordListOffset, setWordListOffset] = useState(0);

  // Track which element is being positioned
  const [positioningElement, setPositioningElement] = useState<string | null>(null);
  
  // State for saving layout and loading status
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPDFReady, setIsPDFReady] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  
  const { toast } = useToast();

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
      titleSize: Math.max(20, Math.min(48, Math.floor(36 * sizeRatio * titleSizeMultiplier))),
      subtitleSize: Math.max(14, Math.min(36, Math.floor(24 * sizeRatio * subtitleSizeMultiplier))),
      instructionSize: Math.max(8, Math.min(24, Math.floor(14 * sizeRatio * instructionSizeMultiplier))),
      // Make word list size more responsive to multiplier
      wordListSize: Math.max(6, Math.min(28, Math.floor(12 * sizeRatio * wordListSizeMultiplier))),
    };
  };

  const fontSizes = calculateFontSizes();
  
  // Calculate space needed for elements
  const calculateSpaceNeeded = () => {
    let space = 0;
    if (showTitle) space += fontSizes.titleSize * titleSizeMultiplier + 10;
    if (showSubtitle) space += fontSizes.subtitleSize * subtitleSizeMultiplier + 10;
    if (showInstruction) space += fontSizes.instructionSize * instructionSizeMultiplier + 20;
    if (showWordList) space += fontSizes.wordListSize * wordListSizeMultiplier * 3;
    return space;
  };

  // Calculate grid cell size based on page dimensions, grid size, and the cell size multiplier
  const calculateGridCellSize = () => {
    if (!puzzle) return 20;
    
    const gridWidth = puzzle.grid[0].length;
    const gridHeight = puzzle.grid.length;
    
    // Reserve space for visible elements
    const reservedSpace = calculateSpaceNeeded() + 40; // add padding
    
    const availableHeight = contentHeight - reservedSpace;
    const availableWidth = contentWidth;
    
    // Calculate cell size to fit the grid
    const cellSizeByWidth = availableWidth / gridWidth;
    const cellSizeByHeight = availableHeight / gridHeight;
    
    const baseSize = Math.min(cellSizeByWidth, cellSizeByHeight);
    
    // Apply the cell size multiplier
    return baseSize * cellSizeMultiplier;
  };

  const cellSize = calculateGridCellSize();
  
  // Calculate letter size separately, based on cell size and letter size multiplier
  const calculateLetterSize = () => {
    // Base letter size is a percentage of cell size
    const baseLetterSize = cellSize * 0.6;
    return baseLetterSize * letterSizeMultiplier;
  };
  
  const letterSize = calculateLetterSize();

  // Calculate vertical position offset with improved boundary checking
  const getVerticalOffset = (offset: number) => {
    // Each unit is 10 points, limit to prevent going off page
    const maxAllowedOffset = Math.min(MAX_OFFSET, (contentHeight / 6) / 10);
    return Math.max(-maxAllowedOffset, Math.min(offset * 10, maxAllowedOffset * 10));
  };

  // Create styles for PDF dynamically based on page size and multipliers
  const createPDFStyles = () => {
    // Calculate the maximum content height to ensure one-page printing
    const totalContentHeight = calculateTotalContentHeight();
    const adjustmentFactor = totalContentHeight > contentHeight ? contentHeight / totalContentHeight : 1;
    
    const adjustedFontSizes = {
      titleSize: Math.max(12, Math.min(36, Math.floor(fontSizes.titleSize * adjustmentFactor))),
      subtitleSize: Math.max(8, Math.min(24, Math.floor(fontSizes.subtitleSize * adjustmentFactor))),
      instructionSize: Math.max(6, Math.min(14, Math.floor(fontSizes.instructionSize * adjustmentFactor))),
      wordListSize: Math.max(6, Math.min(12, Math.floor(fontSizes.wordListSize * adjustmentFactor))),
    };
    
    // Adjust cell size if needed to fit on one page
    const adjustedCellSize = cellSize * adjustmentFactor;
    
    return StyleSheet.create({
      page: {
        padding: PDF_MARGIN,
        fontFamily: 'Times-Roman',
      },
      container: {
        flex: 1,
        borderWidth: BORDER_WIDTH,
        borderColor: '#000',
        padding: BASE_PADDING,
        position: 'relative',
      },
      title: {
        fontSize: adjustedFontSizes.titleSize,
        marginBottom: 10,
        marginTop: getVerticalOffset(titleOffset),
        textAlign: 'center',
        fontWeight: 'bold',
        display: showTitle ? 'flex' : 'none',
        position: 'relative',
      },
      subtitle: {
        fontSize: adjustedFontSizes.subtitleSize,
        marginBottom: 10,
        marginTop: getVerticalOffset(subtitleOffset),
        textAlign: 'center',
        fontFamily: 'Times-Italic',
        display: showSubtitle ? 'flex' : 'none',
        position: 'relative',
      },
      instruction: {
        fontSize: adjustedFontSizes.instructionSize,
        marginBottom: 20,
        marginTop: getVerticalOffset(instructionOffset),
        textAlign: 'center',
        display: showInstruction ? 'flex' : 'none',
        position: 'relative',
      },
      grid: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: getVerticalOffset(gridOffset),
        position: 'relative',
      },
      row: {
        display: 'flex',
        flexDirection: 'row',
      },
      cell: {
        width: adjustedCellSize,
        height: adjustedCellSize,
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.5,
        borderColor: '#000',
        fontSize: adjustedCellSize * 0.6 * letterSizeMultiplier,
      },
      wordList: {
        marginTop: getVerticalOffset(wordListOffset),
        display: showWordList ? 'flex' : 'none',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        position: 'relative',
      },
      wordItem: {
        marginHorizontal: 15,
        marginVertical: 5,
        fontSize: adjustedFontSizes.wordListSize,
      },
    });
  };

  // Calculate total height of all content to ensure one-page fitting
  const calculateTotalContentHeight = () => {
    if (!puzzle) return 0;
    
    let totalHeight = 0;
    
    // Add height for visible elements with their actual multipliers
    if (showTitle) totalHeight += fontSizes.titleSize * titleSizeMultiplier + 20 + Math.abs(getVerticalOffset(titleOffset));
    if (showSubtitle) totalHeight += fontSizes.subtitleSize * subtitleSizeMultiplier + 20 + Math.abs(getVerticalOffset(subtitleOffset));
    if (showInstruction) totalHeight += fontSizes.instructionSize * instructionSizeMultiplier + 30 + Math.abs(getVerticalOffset(instructionOffset));
    
    // Add grid height with cell size multiplier
    const gridHeight = puzzle.grid.length * cellSize + Math.abs(getVerticalOffset(gridOffset));
    totalHeight += gridHeight + 40;
    
    // Add word list height with word list multiplier
    if (showWordList) {
      const wordRows = Math.ceil(puzzle.wordPlacements.length / 6);
      totalHeight += wordRows * (fontSizes.wordListSize * wordListSizeMultiplier + 10) + Math.abs(getVerticalOffset(wordListOffset));
    }
    
    // Add margins and padding
    totalHeight += PDF_MARGIN * 2 + BASE_PADDING * 2 + BORDER_WIDTH * 2;
    
    return totalHeight;
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

  const handleSaveLayout = async () => {
    if (!puzzle) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No puzzle to save. Please generate a puzzle first.",
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const pdfStyles = createPDFStyles();
      console.log("Creating PDF with styles:", pdfStyles);
      
      const blob = await pdf(
        <Document>
          <Page size={[currentWidth, currentHeight]} style={pdfStyles.page}>
            <View style={pdfStyles.container}>
              {showTitle && <Text style={pdfStyles.title}>{title.toUpperCase()}</Text>}
              {showSubtitle && <Text style={pdfStyles.subtitle}>{subtitle.toLowerCase()}</Text>}
              {showInstruction && <Text style={pdfStyles.instruction}>{instruction}</Text>}
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
              {showWordList && (
                <View style={pdfStyles.wordList}>
                  {puzzle.wordPlacements.map(({ word }, index) => (
                    <Text key={index} style={pdfStyles.wordItem}>{word.toLowerCase()}</Text>
                  ))}
                </View>
              )}
            </View>
          </Page>
        </Document>
      ).toBlob();
      
      console.log("PDF blob generated successfully:", blob);
      setPdfBlob(blob);
      setIsPDFReady(true);
      
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
    if (!puzzle) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No puzzle to download. Please generate a puzzle first.",
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
      
      onClose();
    } catch (error) {
      console.error('Failed to download PDF:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to download PDF: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    }
  };

  // Format slider value for display
  const formatSliderValue = (value: number) => {
    return `${(value * 100).toFixed(0)}%`;
  };

  // Handle element positioning with improved boundary limits
  const moveElement = (element: string, direction: 'up' | 'down') => {
    const step = direction === 'up' ? -1 : 1;
    const maxAllowedOffset = Math.min(MAX_OFFSET, (contentHeight / 6) / 10);
    
    switch(element) {
      case 'title':
        setTitleOffset(prev => Math.max(-maxAllowedOffset, Math.min(maxAllowedOffset, prev + step)));
        break;
      case 'subtitle':
        setSubtitleOffset(prev => Math.max(-maxAllowedOffset, Math.min(maxAllowedOffset, prev + step)));
        break;
      case 'instruction':
        setInstructionOffset(prev => Math.max(-maxAllowedOffset, Math.min(maxAllowedOffset, prev + step)));
        break;
      case 'grid':
        setGridOffset(prev => Math.max(-maxAllowedOffset, Math.min(maxAllowedOffset, prev + step)));
        break;
      case 'wordList':
        setWordListOffset(prev => Math.max(-maxAllowedOffset, Math.min(maxAllowedOffset, prev + step)));
        break;
    }
  };

  // Helper for position display
  const getPositionValue = (offset: number) => {
    if (offset === 0) return '0';
    return offset > 0 ? `+${offset}` : `${offset}`;
  };

  // Toggle positioning controls
  const togglePositioning = (element: string) => {
    if (positioningElement === element) {
      setPositioningElement(null);
    } else {
      setPositioningElement(element);
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
            {/* Title Controls */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant={showTitle ? "default" : "outline"}
                  className="w-24 h-8"
                  onClick={() => setShowTitle(!showTitle)}
                >
                  {showTitle ? "Title" : "Title Off"}
                </Button>
                <Button
                  type="button"
                  variant={positioningElement === 'title' ? "secondary" : "outline"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => togglePositioning('title')}
                  disabled={!showTitle}
                >
                  {getPositionValue(titleOffset)}
                </Button>
                {positioningElement === 'title' && (
                  <>
                    <Button
                      type="button"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => moveElement('title', 'up')}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => moveElement('title', 'down')}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
              {showTitle && (
                <>
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
                      max={2.0} 
                      step={0.1}
                      value={[titleSizeMultiplier]} 
                      onValueChange={(value) => setTitleSizeMultiplier(value[0])}
                      className="w-32"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Subtitle Controls */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant={showSubtitle ? "default" : "outline"}
                  className="w-24 h-8"
                  onClick={() => setShowSubtitle(!showSubtitle)}
                >
                  {showSubtitle ? "Subtitle" : "Subtitle Off"}
                </Button>
                <Button
                  type="button"
                  variant={positioningElement === 'subtitle' ? "secondary" : "outline"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => togglePositioning('subtitle')}
                  disabled={!showSubtitle}
                >
                  {getPositionValue(subtitleOffset)}
                </Button>
                {positioningElement === 'subtitle' && (
                  <>
                    <Button
                      type="button"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => moveElement('subtitle', 'up')}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => moveElement('subtitle', 'down')}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
              {showSubtitle && (
                <>
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
                      max={2.0} 
                      step={0.1}
                      value={[subtitleSizeMultiplier]} 
                      onValueChange={(value) => setSubtitleSizeMultiplier(value[0])}
                      className="w-32"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Instruction Controls */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant={showInstruction ? "default" : "outline"}
                  className="w-24 h-8"
                  onClick={() => setShowInstruction(!showInstruction)}
                >
                  {showInstruction ? "Instruction" : "Instr. Off"}
                </Button>
                <Button
                  type="button"
                  variant={positioningElement === 'instruction' ? "secondary" : "outline"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => togglePositioning('instruction')}
                  disabled={!showInstruction}
                >
                  {getPositionValue(instructionOffset)}
                </Button>
                {positioningElement === 'instruction' && (
                  <>
                    <Button
                      type="button"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => moveElement('instruction', 'up')}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => moveElement('instruction', 'down')}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
              {showInstruction && (
                <>
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
                      max={2.0} 
                      step={0.1}
                      value={[instructionSizeMultiplier]} 
                      onValueChange={(value) => setInstructionSizeMultiplier(value[0])}
                      className="w-32"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Page Size Controls */}
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

            {/* Word Search Grid Controls */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="cellSize" className="w-24">Word Search</Label>
                <Button
                  type="button"
                  variant={positioningElement === 'grid' ? "secondary" : "outline"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => togglePositioning('grid')}
                >
                  {getPositionValue(gridOffset)}
                </Button>
                {positioningElement === 'grid' && (
                  <>
                    <Button
                      type="button"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => moveElement('grid', 'up')}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => moveElement('grid', 'down')}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs">Grid Size: {formatSliderValue(cellSizeMultiplier)}</span>
                <Slider 
                  id="cellSize"
                  min={0.7} 
                  max={1.5} 
                  step={0.1}
                  value={[cellSizeMultiplier]} 
                  onValueChange={(value) => setCellSizeMultiplier(value[0])}
                  className="w-32"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs">Letter Size: {formatSliderValue(letterSizeMultiplier)}</span>
                <Slider 
                  id="letterSize"
                  min={0.5} 
                  max={1.5} 
                  step={0.1}
                  value={[letterSizeMultiplier]} 
                  onValueChange={(value) => setLetterSizeMultiplier(value[0])}
                  className="w-32"
                />
              </div>
            </div>

            {/* Word List Controls */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant={showWordList ? "default" : "outline"}
                  className="w-24 h-8"
                  onClick={() => setShowWordList(!showWordList)}
                >
                  {showWordList ? "Word List" : "Words Off"}
                </Button>
                <Button
                  type="button"
                  variant={positioningElement === 'wordList' ? "secondary" : "outline"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => togglePositioning('wordList')}
                  disabled={!showWordList}
                >
                  {getPositionValue(wordListOffset)}
                </Button>
                {positioningElement === 'wordList' && (
                  <>
                    <Button
                      type="button"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => moveElement('wordList', 'up')}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => moveElement('wordList', 'down')}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
              {showWordList && (
                <div className="flex items-center justify-between">
                  <span className="text-xs">Size: {formatSliderValue(wordListSizeMultiplier)}</span>
                  <Slider 
                    id="wordListSize"
                    min={0.5} 
                    max={3.0} 
                    step={0.1}
                    value={[wordListSizeMultiplier]} 
                    onValueChange={(value) => setWordListSizeMultiplier(value[0])}
                    className="w-32"
                  />
                </div>
              )}
            </div>

            {/* Custom Page Size Controls */}
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

          {/* Preview Section */}
          <div className="space-y-4">
            <Label>Preview</Label>
            <div className="border rounded-lg p-4 bg-white h-[430px] flex flex-col items-center justify-center">
              <div 
                className="relative border-2 border-black bg-white p-4 overflow-hidden"
                style={{
                  width: `${currentWidth * previewScaleFactor}px`,
                  height: `${currentHeight * previewScaleFactor}px`,
                  maxWidth: '100%',
                  maxHeight: '380px',
                }}
              >
                <div className="flex flex-col h-full">
                  {showTitle && (
                    <div 
                      className="text-center font-bold font-serif"
                      style={{
                        fontSize: `${fontSizes.titleSize * previewScaleFactor}px`,
                        marginBottom: `${10 * previewScaleFactor}px`,
                        marginTop: `${getVerticalOffset(titleOffset) * previewScaleFactor}px`,
                        position: 'relative',
                      }}
                    >
                      {title.toUpperCase()}
                    </div>
                  )}
                  
                  {showSubtitle && (
                    <div 
                      className="text-center font-serif italic"
                      style={{
                        fontSize: `${fontSizes.subtitleSize * previewScaleFactor}px`,
                        marginBottom: `${10 * previewScaleFactor}px`,
                        marginTop: `${getVerticalOffset(subtitleOffset) * previewScaleFactor}px`,
                        position: 'relative',
                      }}
                    >
                      {subtitle.toLowerCase()}
                    </div>
                  )}
                  
                  {showInstruction && (
                    <div 
                      className="text-center font-serif"
                      style={{
                        fontSize: `${fontSizes.instructionSize * previewScaleFactor}px`,
                        marginBottom: `${20 * previewScaleFactor}px`,
                        marginTop: `${getVerticalOffset(instructionOffset) * previewScaleFactor}px`,
                        position: 'relative',
                      }}
                    >
                      {instruction}
                    </div>
                  )}
                  
                  <div 
                    className="flex-1 grid place-items-center mb-4"
                    style={{
                      marginTop: `${getVerticalOffset(gridOffset) * previewScaleFactor}px`,
                      position: 'relative',
                    }}
                  >
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
                                fontSize: `${letterSize * previewScaleFactor}px`,
                              }}
                            >
                              {cell}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {showWordList && (
                    <div 
                      className="flex flex-wrap justify-center gap-2 font-serif"
                      style={{
                        fontSize: `${fontSizes.wordListSize * previewScaleFactor}px`,
                        marginTop: `${getVerticalOffset(wordListOffset) * previewScaleFactor}px`,
                        position: 'relative',
                      }}
                    >
                      {puzzle?.wordPlacements.map(({ word }, i) => (
                        <span key={i} className="mx-3 my-1">{word.toLowerCase()}</span>
                      ))}
                    </div>
                  )}
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
          <Button 
            onClick={handleSaveLayout} 
            disabled={!puzzle || isGenerating}
            className="mr-2"
            variant="secondary"
          >
            {isGenerating ? "Saving..." : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Layout
              </>
            )}
          </Button>
          <Button 
            onClick={handleDownload} 
            disabled={!puzzle || !isPDFReady}
            variant="default"
          >
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

