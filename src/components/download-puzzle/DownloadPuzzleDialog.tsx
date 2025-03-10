
import { useState, useEffect, useRef } from "react";
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
import { useLocalStorage } from "@/hooks/use-local-storage";
import { VisualPreview } from "./VisualPreview";
import { ControlPanel } from "./ControlPanel";
import { ActionButtons } from "./ActionButtons";
import { PuzzlePDFPreview } from "./PuzzlePDFPreview";
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
  DEFAULT_IMAGE_OPACITY,
  DEFAULT_IMAGE_GRID_SIZE,
  MIN_IMAGE_GRID_SIZE,
  MAX_IMAGE_GRID_SIZE,
  PageSize,
  Unit
} from "./constants";
import { Slider } from "../ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

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
  
  const [titleSizeMultiplier, setTitleSizeMultiplier] = useState(DEFAULT_TITLE_MULTIPLIER);
  const [subtitleSizeMultiplier, setSubtitleSizeMultiplier] = useState(DEFAULT_SUBTITLE_MULTIPLIER);
  const [instructionSizeMultiplier, setInstructionSizeMultiplier] = useState(DEFAULT_INSTRUCTION_MULTIPLIER);
  const [cellSizeMultiplier, setCellSizeMultiplier] = useState(DEFAULT_CELL_MULTIPLIER);
  const [letterSizeMultiplier, setLetterSizeMultiplier] = useState(DEFAULT_LETTER_SIZE_MULTIPLIER);
  const [wordListSizeMultiplier, setWordListSizeMultiplier] = useState(DEFAULT_WORDLIST_MULTIPLIER);

  const [showTitle, setShowTitle] = useState(true);
  const [showSubtitle, setShowSubtitle] = useState(true);
  const [showInstruction, setShowInstruction] = useState(true);
  const [showWordList, setShowWordList] = useState(true);
  const [showGrid, setShowGrid] = useState(true);

  const [titleOffset, setTitleOffset] = useState(0);
  const [subtitleOffset, setSubtitleOffset] = useState(0);
  const [instructionOffset, setInstructionOffset] = useState(0);
  const [gridOffset, setGridOffset] = useState(0);
  const [wordListOffset, setWordListOffset] = useState(0);

  const [positioningElement, setPositioningElement] = useState<string | null>(null);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPDFReady, setIsPDFReady] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  
  const [showLivePreview, setShowLivePreview] = useState(false);

  const [uploadedImages, setUploadedImages] = useLocalStorage<string[]>("puzzle-images", []);
  const [imageOpacity, setImageOpacity] = useState(DEFAULT_IMAGE_OPACITY);
  const [imageGridSize, setImageGridSize] = useState(DEFAULT_IMAGE_GRID_SIZE);
  
  const { toast } = useToast();
  
  const previewScaleFactor = 0.25;

  const handleRandomizeImages = () => {
    if (uploadedImages.length > 0) {
      const shuffledImages = [...uploadedImages].sort(() => Math.random() - 0.5);
      setUploadedImages(shuffledImages);
    }
  };

  const handleUnitChange = (unit: Unit) => {
    setSelectedUnit(unit);
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
    if (!puzzle) return 20;
    
    const gridWidth = puzzle.grid[0].length;
    const gridHeight = puzzle.grid.length;
    
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
          uploadedImages={uploadedImages}
          imageOpacity={imageOpacity}
          imageGridSize={imageGridSize}
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

  useEffect(() => {
    setIsPDFReady(false);
    setShowLivePreview(false);
  }, [
    titleSizeMultiplier, subtitleSizeMultiplier, instructionSizeMultiplier,
    cellSizeMultiplier, letterSizeMultiplier, wordListSizeMultiplier,
    showTitle, showSubtitle, showInstruction, showWordList, showGrid,
    titleOffset, subtitleOffset, instructionOffset, gridOffset, wordListOffset,
    title, subtitle, instruction, selectedSize, customWidth, customHeight,
    uploadedImages, imageOpacity, imageGridSize
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

        <Tabs defaultValue="content">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="layout">Layout</TabsTrigger>
            <TabsTrigger value="sizes">Sizes</TabsTrigger>
            <TabsTrigger value="aesthetics">Aesthetics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="content" className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
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
                
                uploadedImages={uploadedImages}
                onImagesChange={setUploadedImages}
                imageOpacity={imageOpacity}
                setImageOpacity={setImageOpacity}
                onRandomizeImages={handleRandomizeImages}
              />
            </div>

            <div className="space-y-4">
              <Label>Preview</Label>
              <div className="border rounded-lg p-4 bg-white h-[430px] flex flex-col items-center justify-center overflow-y-auto relative">
                {uploadedImages.length > 0 && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div 
                      className="w-full h-full"
                      style={{
                        backgroundImage: uploadedImages.length > 0 
                          ? `url(${uploadedImages[0]})` 
                          : 'none',
                        backgroundSize: `${imageGridSize}px ${imageGridSize}px`,
                        backgroundRepeat: 'repeat',
                        opacity: imageOpacity,
                      }}
                    />
                  </div>
                )}
                
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
                <p className="text-xs text-muted-foreground">
                  Click "Save Layout" after making changes to update the PDF preview.
                </p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="layout" className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <Label>Position Elements</Label>
                <div className="grid grid-cols-2 gap-2">
                  {showTitle && (
                    <div className="space-y-2 p-2 border rounded-md">
                      <div className="flex items-center justify-between">
                        <Label>Title Position</Label>
                        <span className="text-xs">{getPositionValue(titleOffset)}</span>
                      </div>
                      <div className="flex justify-between">
                        <button 
                          onClick={() => moveElement('title', 'up')}
                          className="px-2 py-1 bg-secondary rounded-md"
                        >
                          Up
                        </button>
                        <button 
                          onClick={() => moveElement('title', 'down')}
                          className="px-2 py-1 bg-secondary rounded-md"
                        >
                          Down
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {showSubtitle && (
                    <div className="space-y-2 p-2 border rounded-md">
                      <div className="flex items-center justify-between">
                        <Label>Subtitle Position</Label>
                        <span className="text-xs">{getPositionValue(subtitleOffset)}</span>
                      </div>
                      <div className="flex justify-between">
                        <button 
                          onClick={() => moveElement('subtitle', 'up')}
                          className="px-2 py-1 bg-secondary rounded-md"
                        >
                          Up
                        </button>
                        <button 
                          onClick={() => moveElement('subtitle', 'down')}
                          className="px-2 py-1 bg-secondary rounded-md"
                        >
                          Down
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {showInstruction && (
                    <div className="space-y-2 p-2 border rounded-md">
                      <div className="flex items-center justify-between">
                        <Label>Instruction Position</Label>
                        <span className="text-xs">{getPositionValue(instructionOffset)}</span>
                      </div>
                      <div className="flex justify-between">
                        <button 
                          onClick={() => moveElement('instruction', 'up')}
                          className="px-2 py-1 bg-secondary rounded-md"
                        >
                          Up
                        </button>
                        <button 
                          onClick={() => moveElement('instruction', 'down')}
                          className="px-2 py-1 bg-secondary rounded-md"
                        >
                          Down
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {showGrid && (
                    <div className="space-y-2 p-2 border rounded-md">
                      <div className="flex items-center justify-between">
                        <Label>Grid Position</Label>
                        <span className="text-xs">{getPositionValue(gridOffset)}</span>
                      </div>
                      <div className="flex justify-between">
                        <button 
                          onClick={() => moveElement('grid', 'up')}
                          className="px-2 py-1 bg-secondary rounded-md"
                        >
                          Up
                        </button>
                        <button 
                          onClick={() => moveElement('grid', 'down')}
                          className="px-2 py-1 bg-secondary rounded-md"
                        >
                          Down
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {showWordList && (
                    <div className="space-y-2 p-2 border rounded-md">
                      <div className="flex items-center justify-between">
                        <Label>Word List Position</Label>
                        <span className="text-xs">{getPositionValue(wordListOffset)}</span>
                      </div>
                      <div className="flex justify-between">
                        <button 
                          onClick={() => moveElement('wordList', 'up')}
                          className="px-2 py-1 bg-secondary rounded-md"
                        >
                          Up
                        </button>
                        <button 
                          onClick={() => moveElement('wordList', 'down')}
                          className="px-2 py-1 bg-secondary rounded-md"
                        >
                          Down
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Preview</Label>
              <div className="border rounded-lg p-4 bg-white h-[430px] flex flex-col items-center justify-center overflow-y-auto relative">
                {uploadedImages.length > 0 && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div 
                      className="w-full h-full"
                      style={{
                        backgroundImage: uploadedImages.length > 0 
                          ? `url(${uploadedImages[0]})` 
                          : 'none',
                        backgroundSize: `${imageGridSize}px ${imageGridSize}px`,
                        backgroundRepeat: 'repeat',
                        opacity: imageOpacity,
                      }}
                    />
                  </div>
                )}
                
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
            </div>
          </TabsContent>
          
          <TabsContent value="sizes" className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <Label>Page Size</Label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.keys(PAGE_SIZES).map((size) => (
                    <button
                      key={size}
                      onClick={() => handleSizeChange(size as PageSize)}
                      className={`py-2 px-4 rounded-md ${
                        selectedSize === size
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                  <button
                    onClick={() => handleSizeChange("Custom")}
                    className={`py-2 px-4 rounded-md ${
                      selectedSize === "Custom"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    Custom
                  </button>
                </div>
              </div>

              {selectedSize === "Custom" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Width ({selectedUnit})</Label>
                    <input
                      type="number"
                      value={convertFromPoints(customWidth)}
                      onChange={(e) => handleDimensionChange("width", e.target.value)}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Height ({selectedUnit})</Label>
                    <input
                      type="number"
                      value={convertFromPoints(customHeight)}
                      onChange={(e) => handleDimensionChange("height", e.target.value)}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Units</Label>
                <div className="grid grid-cols-4 gap-2">
                  {Object.keys(UNITS).map((unit) => (
                    <button
                      key={unit}
                      onClick={() => handleUnitChange(unit as Unit)}
                      className={`py-2 px-4 rounded-md ${
                        selectedUnit === unit
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {unit}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Preview</Label>
              <div className="border rounded-lg p-4 bg-white h-[430px] flex flex-col items-center justify-center overflow-y-auto relative">
                {uploadedImages.length > 0 && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div 
                      className="w-full h-full"
                      style={{
                        backgroundImage: uploadedImages.length > 0 
                          ? `url(${uploadedImages[0]})` 
                          : 'none',
                        backgroundSize: `${imageGridSize}px ${imageGridSize}px`,
                        backgroundRepeat: 'repeat',
                        opacity: imageOpacity,
                      }}
                    />
                  </div>
                )}
                
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
            </div>
          </TabsContent>
          
          <TabsContent value="aesthetics" className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Background Images</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="relative w-12 h-12 rounded overflow-hidden border">
                      <img 
                        src={image} 
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <button 
                        onClick={() => {
                          const newImages = [...uploadedImages];
                          newImages.splice(index, 1);
                          setUploadedImages(newImages);
                        }}
                        className="absolute top-0 right-0 bg-red-500 text-white w-4 h-4 flex items-center justify-center rounded-bl"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <label className="w-12 h-12 border-2 border-dashed rounded flex items-center justify-center cursor-pointer hover:bg-secondary/30">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            if (event.target && typeof event.target.result === 'string') {
                              setUploadedImages([...uploadedImages, event.target.result]);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    +
                  </label>
                </div>
                
                {uploadedImages.length > 0 && (
                  <button
                    onClick={handleRandomizeImages}
                    className="px-2 py-1 bg-secondary rounded-md text-xs"
                  >
                    Randomize Order
                  </button>
                )}
              </div>

              {uploadedImages.length > 0 && (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>Image Opacity</Label>
                      <span className="text-xs">{(imageOpacity * 100).toFixed(0)}%</span>
                    </div>
                    <Slider
                      value={[imageOpacity * 100]}
                      min={10}
                      max={100}
                      step={5}
                      onValueChange={(value) => setImageOpacity(value[0] / 100)}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>Image Grid Size</Label>
                      <span className="text-xs">{imageGridSize}px</span>
                    </div>
                    <Slider
                      value={[imageGridSize]}
                      min={MIN_IMAGE_GRID_SIZE}
                      max={MAX_IMAGE_GRID_SIZE}
                      step={5}
                      onValueChange={(value) => setImageGridSize(value[0])}
                    />
                  </div>
                </>
              )}
            </div>
            
            <div className="space-y-4">
              <Label>Preview</Label>
              <div className="border rounded-lg p-4 bg-white h-[430px] flex flex-col items-center justify-center overflow-y-auto relative">
                {uploadedImages.length > 0 && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div 
                      className="w-full h-full"
                      style={{
                        backgroundImage: uploadedImages.length > 0 
                          ? `url(${uploadedImages[0]})` 
                          : 'none',
                        backgroundSize: `${imageGridSize}px ${imageGridSize}px`,
                        backgroundRepeat: 'repeat',
                        opacity: imageOpacity,
                      }}
                    />
                  </div>
                )}
                
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
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
