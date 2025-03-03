
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
import { pdf } from "@react-pdf/renderer";
import { PuzzleGrid } from "@/utils/wordSearchUtils";
import { ElementPositionControl } from "./ElementPositionControl";
import { SizeSlider } from "./SizeSlider";
import { PageSizeControl } from "./PageSizeControl";
import { PuzzlePreview } from "./PuzzlePreview";
import { PuzzlePDF, createPDFStyles } from "./PuzzlePDF";
import {
  PAGE_SIZES,
  UNITS,
  PDF_MARGIN,
  BASE_PADDING,
  BORDER_WIDTH,
  MAX_OFFSET,
  DEFAULT_TITLE_MULTIPLIER,
  DEFAULT_SUBTITLE_MULTIPLIER,
  DEFAULT_INSTRUCTION_MULTIPLIER,
  DEFAULT_CELL_MULTIPLIER,
  DEFAULT_LETTER_SIZE_MULTIPLIER,
  DEFAULT_WORDLIST_MULTIPLIER,
  convertFromPoints as convertPointsToUnit,
  getVerticalOffset,
  PageSize,
  Unit,
} from "@/utils/pdfUtils";

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
  // Text content states
  const [title, setTitle] = useState("Word Search Puzzle");
  const [subtitle, setSubtitle] = useState("word search");
  const [instruction, setInstruction] = useState("Can you find all the words?");
  
  // Page size states
  const [selectedSize, setSelectedSize] = useState<PageSize>("A4");
  const [selectedUnit, setSelectedUnit] = useState<Unit>("Points");
  const [customWidth, setCustomWidth] = useState(PAGE_SIZES.A4.width);
  const [customHeight, setCustomHeight] = useState(PAGE_SIZES.A4.height);
  
  // Size multiplier states
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
    return convertPointsToUnit(points, selectedUnit);
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

  // Toggle positioning controls
  const togglePositioning = (element: string) => {
    if (positioningElement === element) {
      setPositioningElement(null);
    } else {
      setPositioningElement(element);
    }
  };

  const handleDownload = async () => {
    if (!puzzle) return;

    try {
      const pdfStyles = createPDFStyles(
        showTitle,
        showSubtitle,
        showInstruction,
        showWordList,
        titleOffset,
        subtitleOffset,
        instructionOffset,
        gridOffset,
        wordListOffset,
        fontSizes,
        cellSize,
        letterSizeMultiplier,
        puzzle,
        contentWidth,
        contentHeight
      );
      
      const blob = await pdf(
        <PuzzlePDF
          puzzle={puzzle}
          title={title}
          subtitle={subtitle}
          instruction={instruction}
          showTitle={showTitle}
          showSubtitle={showSubtitle}
          showInstruction={showInstruction}
          showWordList={showWordList}
          titleOffset={titleOffset}
          subtitleOffset={subtitleOffset}
          instructionOffset={instructionOffset}
          gridOffset={gridOffset}
          wordListOffset={wordListOffset}
          currentWidth={currentWidth}
          currentHeight={currentHeight}
          pdfStyles={pdfStyles}
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
            <ElementPositionControl
              elementName="title"
              buttonText="Title"
              showElement={showTitle}
              toggleElement={() => setShowTitle(!showTitle)}
              positioningElement={positioningElement}
              togglePositioning={togglePositioning}
              moveElement={moveElement}
              offset={titleOffset}
            >
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter main title"
              />
              <SizeSlider
                id="titleSize"
                label="Size"
                value={titleSizeMultiplier}
                onChange={(value) => setTitleSizeMultiplier(value[0])}
              />
            </ElementPositionControl>

            {/* Subtitle Controls */}
            <ElementPositionControl
              elementName="subtitle"
              buttonText="Subtitle"
              showElement={showSubtitle}
              toggleElement={() => setShowSubtitle(!showSubtitle)}
              positioningElement={positioningElement}
              togglePositioning={togglePositioning}
              moveElement={moveElement}
              offset={subtitleOffset}
            >
              <Input
                id="subtitle"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Enter subtitle"
              />
              <SizeSlider
                id="subtitleSize"
                label="Size"
                value={subtitleSizeMultiplier}
                onChange={(value) => setSubtitleSizeMultiplier(value[0])}
              />
            </ElementPositionControl>

            {/* Instruction Controls */}
            <ElementPositionControl
              elementName="instruction"
              buttonText="Instruction"
              showElement={showInstruction}
              toggleElement={() => setShowInstruction(!showInstruction)}
              positioningElement={positioningElement}
              togglePositioning={togglePositioning}
              moveElement={moveElement}
              offset={instructionOffset}
            >
              <Input
                id="instruction"
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                placeholder="Enter instruction text"
              />
              <SizeSlider
                id="instructionSize"
                label="Size"
                value={instructionSizeMultiplier}
                onChange={(value) => setInstructionSizeMultiplier(value[0])}
              />
            </ElementPositionControl>

            {/* Page Size Controls */}
            <PageSizeControl
              selectedSize={selectedSize}
              handleSizeChange={handleSizeChange}
              selectedUnit={selectedUnit}
              setSelectedUnit={setSelectedUnit}
              currentWidth={currentWidth}
              currentHeight={currentHeight}
              handleDimensionChange={handleDimensionChange}
              convertFromPoints={convertFromPoints}
            />

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
                  {gridOffset === 0 ? '0' : gridOffset > 0 ? `+${gridOffset}` : `${gridOffset}`}
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
              <SizeSlider
                id="cellSize"
                label="Grid Size"
                value={cellSizeMultiplier}
                onChange={(value) => setCellSizeMultiplier(value[0])}
                min={0.7}
                max={1.5}
              />
              <SizeSlider
                id="letterSize"
                label="Letter Size"
                value={letterSizeMultiplier}
                onChange={(value) => setLetterSizeMultiplier(value[0])}
                min={0.5}
                max={1.5}
              />
            </div>

            {/* Word List Controls */}
            <ElementPositionControl
              elementName="wordList"
              buttonText="Word List"
              showElement={showWordList}
              toggleElement={() => setShowWordList(!showWordList)}
              positioningElement={positioningElement}
              togglePositioning={togglePositioning}
              moveElement={moveElement}
              offset={wordListOffset}
            >
              <SizeSlider
                id="wordListSize"
                label="Size"
                value={wordListSizeMultiplier}
                onChange={(value) => setWordListSizeMultiplier(value[0])}
                min={0.5}
                max={3.0}
              />
            </ElementPositionControl>
          </div>

          {/* Preview Section */}
          <PuzzlePreview
            puzzle={puzzle}
            title={title}
            subtitle={subtitle}
            instruction={instruction}
            showTitle={showTitle}
            showSubtitle={showSubtitle}
            showInstruction={showInstruction}
            showWordList={showWordList}
            titleOffset={titleOffset}
            subtitleOffset={subtitleOffset}
            instructionOffset={instructionOffset}
            gridOffset={gridOffset}
            wordListOffset={wordListOffset}
            fontSizes={fontSizes}
            cellSize={cellSize}
            letterSize={letterSize}
            previewScaleFactor={previewScaleFactor}
            currentWidth={currentWidth}
            currentHeight={currentHeight}
            selectedUnit={selectedUnit}
            convertFromPoints={convertFromPoints}
            contentHeight={contentHeight}
          />
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
