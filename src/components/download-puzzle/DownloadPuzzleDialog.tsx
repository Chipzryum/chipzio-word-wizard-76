import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PuzzleGrid } from "@/utils/wordSearchUtils";
import { pdf } from "@react-pdf/renderer";
import { useToast } from "@/hooks/use-toast";
import { VisualPreview } from "./VisualPreview";
import { ControlPanel } from "./ControlPanel";
import { ActionButtons } from "./ActionButtons";
import { PuzzlePDFPreview } from "./PuzzlePDFPreview";
import { AestheticsPanel } from "./AestheticsPanel";
import { 
  PAGE_SIZES, 
  UNITS, 
  PDF_MARGIN, 
  BORDER_WIDTH, 
  BASE_PADDING, 
  MAX_OFFSET,
  DEFAULT_TITLE_MULTIPLIER,
  DEFAULT_SUBTITLE_MULTIPLIER,
  DEFAULT_INSTRUCTION_MULTIPLIER,
  DEFAULT_CELL_MULTIPLIER,
  DEFAULT_LETTER_SIZE_MULTIPLIER,
  DEFAULT_WORDLIST_MULTIPLIER,
  MAX_LETTER_SIZE,
  PageSize,
  Unit,
  ImagePlacement
} from "./constants";

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
  const [showGrid, setShowGrid] = useState(true);

  // Position offsets for elements
  const [titleOffset, setTitleOffset] = useState(0);
  const [subtitleOffset, setSubtitleOffset] = useState(0);
  const [instructionOffset, setInstructionOffset] = useState(0);
  const [gridOffset, setGridOffset] = useState(0);
  const [wordListOffset, setWordListOffset] = useState(0);

  // New aesthetics settings
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [backgroundOpacity, setBackgroundOpacity] = useState(0.15);
  const [imagePlacement, setImagePlacement] = useState<ImagePlacement>("centered");

  // Track which element is being positioned
  const [positioningElement, setPositioningElement] = useState<string | null>(null);
  
  // State for saving layout and loading status
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPDFReady, setIsPDFReady] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  
  // State for live preview
  const [showLivePreview, setShowLivePreview] = useState(false);
  
  const { toast } = useToast();

  // Handle unit change with proper type
  const handleUnitChange = (unit: Unit) => {
    setSelectedUnit(unit);
  };

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
    
    // Cap the letter size multiplier to prevent disappearing text
    const cappedMultiplier = Math.min(letterSizeMultiplier, MAX_LETTER_SIZE);
    
    return baseLetterSize * cappedMultiplier;
  };
  
  const letterSize = calculateLetterSize();

  // Calculate vertical position offset with improved boundary checking
  const getVerticalOffset = (offset: number) => {
    // Each unit is 10 points, limit to prevent going off page
    const maxAllowedOffset = Math.min(MAX_OFFSET, (contentHeight / 6) / 10);
    return Math.max(-maxAllowedOffset, Math.min(offset * 10, maxAllowedOffset * 10));
  };

  // Randomize image placement
  const randomizeImagePlacement = () => {
    const positions: ImagePlacement[] = ["centered", "tiled", "random", "top", "bottom"];
    let newPlacement: ImagePlacement;
    
    // Make sure the new placement is different from the current one
    do {
      const randomIndex = Math.floor(Math.random() * positions.length);
      newPlacement = positions[randomIndex];
    } while (newPlacement === imagePlacement);
    
    setImagePlacement(newPlacement);
    setIsPDFReady(false);
    toast({
      title: "Image Placement Updated",
      description: `Changed to ${newPlacement}`,
    });
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
    if (isNaN(numValue)) return;

    const pointValue = numValue * UNITS[selectedUnit];
    if (dimension === "width") {
      setCustomWidth(pointValue);
    } else {
      setCustomHeight(pointValue);
    }
    setSelectedSize("Custom");
    setIsPDFReady(false);
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
      console.log("Creating PDF with letterSizeMultiplier:", letterSizeMultiplier);
      console.log("Creating PDF with cellSize:", cellSize);
      
      // Cap the letter size multiplier
      const cappedLetterSizeMultiplier = Math.min(letterSizeMultiplier, MAX_LETTER_SIZE);
      console.log("Creating PDF with cappedLetterSizeMultiplier:", cappedLetterSizeMultiplier);
      
      const blob = await pdf(
        <PuzzlePDFPreview
          puzzle={puzzle}
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
          backgroundImage={backgroundImage}
          backgroundOpacity={backgroundOpacity}
          imagePlacement={imagePlacement}
        />
      ).toBlob();
      
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

  const formatSliderValue = (value: number) => {
    return `${(value * 100).toFixed(0)}%`;
  };

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
    setIsPDFReady(false);
  };

  const getPositionValue = (offset: number) => {
    if (offset === 0) return '0';
    return offset > 0 ? `+${offset}` : `${offset}`;
  };

  const togglePositioning = (element: string) => {
    if (positioningElement === element) {
      setPositioningElement(null);
    } else {
      setPositioningElement(element);
    }
  };

  // Update effect to reset PDF status whenever settings change
  useEffect(() => {
    setIsPDFReady(false);
    setShowLivePreview(false);
  }, [
    titleSizeMultiplier, subtitleSizeMultiplier, instructionSizeMultiplier,
    cellSizeMultiplier, letterSizeMultiplier, wordListSizeMultiplier,
    showTitle, showSubtitle, showInstruction, showWordList, showGrid,
    titleOffset, subtitleOffset, instructionOffset, gridOffset, wordListOffset,
    title, subtitle, instruction, selectedSize, customWidth, customHeight,
    backgroundImage, backgroundOpacity, imagePlacement
  ]);

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
          <div>
            <div className="mb-4 border-b">
              <div className="flex space-x-1">
                <div 
                  className={`px-4 py-2 cursor-pointer ${!positioningElement ? 'border-b-2 border-primary font-medium' : 'text-muted-foreground'}`}
                  onClick={() => setPositioningElement(null)}
                >
                  Content
                </div>
                <div 
                  className={`px-4 py-2 cursor-pointer ${positioningElement === 'layout' ? 'border-b-2 border-primary font-medium' : 'text-muted-foreground'}`}
                  onClick={() => setPositioningElement('layout')}
                >
                  Layout
                </div>
                <div 
                  className={`px-4 py-2 cursor-pointer ${positioningElement === 'sizes' ? 'border-b-2 border-primary font-medium' : 'text-muted-foreground'}`}
                  onClick={() => setPositioningElement('sizes')}
                >
                  Sizes
                </div>
                <div 
                  className={`px-4 py-2 cursor-pointer ${positioningElement === 'aesthetics' ? 'border-b-2 border-primary font-medium' : 'text-muted-foreground'}`}
                  onClick={() => setPositioningElement('aesthetics')}
                >
                  Aesthetics
                </div>
              </div>
            </div>

            {!positioningElement && (
              <ControlPanel 
                showTitle={showTitle}
                setShowTitle={setShowTitle}
                title={title}
                setTitle={setTitle}
                titleSizeMultiplier={titleSizeMultiplier}
                setTitleSizeMultiplier={setTitleSizeMultiplier}
                titleOffset={titleOffset}
                positioningElement={positioningElement}
                togglePositioning={togglePositioning}
                moveElement={moveElement}
                
                showSubtitle={showSubtitle}
                setShowSubtitle={setShowSubtitle}
                subtitle={subtitle}
                setSubtitle={setSubtitle}
                subtitleSizeMultiplier={subtitleSizeMultiplier}
                setSubtitleSizeMultiplier={setSubtitleSizeMultiplier}
                subtitleOffset={subtitleOffset}
                
                showInstruction={showInstruction}
                setShowInstruction={setShowInstruction}
                instruction={instruction}
                setInstruction={setInstruction}
                instructionSizeMultiplier={instructionSizeMultiplier}
                setInstructionSizeMultiplier={setInstructionSizeMultiplier}
                instructionOffset={instructionOffset}
                
                selectedSize={selectedSize}
                handleSizeChange={handleSizeChange}
                
                showGrid={showGrid}
                setShowGrid={setShowGrid}
                cellSizeMultiplier={cellSizeMultiplier}
                setCellSizeMultiplier={setCellSizeMultiplier}
                letterSizeMultiplier={letterSizeMultiplier}
                setLetterSizeMultiplier={setLetterSizeMultiplier}
                gridOffset={gridOffset}
                
                showWordList={showWordList}
                setShowWordList={setShowWordList}
                wordListSizeMultiplier={wordListSizeMultiplier}
                setWordListSizeMultiplier={setWordListSizeMultiplier}
                wordListOffset={wordListOffset}
                
                selectedUnit={selectedUnit}
                setSelectedUnit={handleUnitChange}
                currentWidth={currentWidth}
                currentHeight={currentHeight}
                handleDimensionChange={handleDimensionChange}
                convertFromPoints={convertFromPoints}
                formatSliderValue={formatSliderValue}
                getPositionValue={getPositionValue}
              />
            )}

            {positioningElement === 'layout' && (
              <div className="p-4 space-y-6">
                <div className="grid gap-2">
                  <Label>Page Size</Label>
                  <div className="flex items-center space-x-4">
                    <Select
                      value={selectedSize}
                      onValueChange={(value) => handleSizeChange(value as PageSize)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        {PAGE_SIZE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label} 
                            {option.value !== "Custom" && ` (${PAGE_SIZES[option.value as PageSize].width.toFixed(0)} × ${PAGE_SIZES[option.value as PageSize].height.toFixed(0)})`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {selectedSize === "Custom" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="custom-width">Width ({selectedUnit})</Label>
                      <input
                        id="custom-width"
                        type="number"
                        value={convertFromPoints(currentWidth)}
                        onChange={(e) => 
                          handleDimensionChange("width", e.target.value)
                        }
                        min="0"
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="custom-height">Height ({selectedUnit})</Label>
                      <input
                        id="custom-height"
                        type="number"
                        value={convertFromPoints(currentHeight)}
                        onChange={(e) =>
                          handleDimensionChange("height", e.target.value)
                        }
                        min="0"
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div className="grid gap-2 col-span-2">
                      <Label htmlFor="unit">Unit</Label>
                      <Select
                        value={selectedUnit}
                        onValueChange={(value) => handleUnitChange(value as Unit)}
                      >
                        <SelectTrigger id="unit">
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Points">Points</SelectItem>
                          <SelectItem value="Inches">Inches</SelectItem>
                          <SelectItem value="Millimeters">Millimeters</SelectItem>
                          <SelectItem value="Centimeters">Centimeters</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
            )}

            {positioningElement === 'sizes' && (
              <div className="p-4 space-y-6">
                <div className="grid gap-2">
                  <Label>Letters Size</Label>
                  <Slider
                    value={[letterSizeMultiplier * 100]}
                    min={50}
                    max={150}
                    step={10}
                    onValueChange={(value) => setLetterSizeMultiplier(value[0] / 100)}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>50%</span>
                    <span>{(letterSizeMultiplier * 100).toFixed(0)}%</span>
                    <span>150%</span>
                  </div>
                </div>

                {showTitle && (
                  <div className="grid gap-2">
                    <Label>Title Size</Label>
                    <Slider
                      value={[titleSizeMultiplier * 100]}
                      min={50}
                      max={150}
                      step={10}
                      onValueChange={(value) => setTitleSizeMultiplier(value[0] / 100)}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>50%</span>
                      <span>{(titleSizeMultiplier * 100).toFixed(0)}%</span>
                      <span>150%</span>
                    </div>
                  </div>
                )}

                {/* Add other size controls (subtitle, instruction, etc.) here */}
                {/* ... keep existing code for other size controls ... */}
              </div>
            )}

            {positioningElement === 'aesthetics' && (
              <div className="p-4">
                <AestheticsPanel
                  backgroundOpacity={backgroundOpacity}
                  setBackgroundOpacity={setBackgroundOpacity}
                  imagePlacement={imagePlacement}
                  setImagePlacement={setImagePlacement}
                  backgroundImage={backgroundImage}
                  setBackgroundImage={setBackgroundImage}
                  randomizeImagePlacement={randomizeImagePlacement}
                />
              </div>
            )}
          </div>

          {/* Preview Section */}
          <div className="space-y-4">
            <Label>Preview</Label>
            <div className="border rounded-lg p-4 bg-white h-[430px] flex flex-col items-center justify-center overflow-y-auto">
              <VisualPreview 
                puzzle={puzzle}
                showLivePreview={showLivePreview}
                isPDFReady={isPDFReady}
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
                letterSize={letterSize}
                letterSizeMultiplier={letterSizeMultiplier}
                titleSizeMultiplier={titleSizeMultiplier}
                subtitleSizeMultiplier={subtitleSizeMultiplier}
                instructionSizeMultiplier={instructionSizeMultiplier}
                wordListSizeMultiplier={wordListSizeMultiplier}
                previewScaleFactor={previewScaleFactor}
                fontSizes={fontSizes}
                getVerticalOffset={getVerticalOffset}
                backgroundImage={backgroundImage}
                backgroundOpacity={backgroundOpacity}
                imagePlacement={imagePlacement}
              />
            </div>
            
            <ActionButtons 
              handleSaveLayout={handleSaveLayout}
              handleDownload={handleDownload}
              isGenerating={isGenerating}
              isPDFReady={isPDFReady}
              puzzle={puzzle}
              pdfBlob={pdfBlob}
            />
            
            {!isPDFReady && (
              <p className="text-xs text-muted-foreground">Click "Save Layout" after making changes to update the PDF preview.</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
