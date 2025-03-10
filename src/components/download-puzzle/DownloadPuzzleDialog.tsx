
import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PuzzlePDFPreview } from "./PuzzlePDFPreview";
import { pdf } from "@react-pdf/renderer";
import { Slider } from "@/components/ui/slider";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { PuzzleGrid } from "@/utils/wordSearchUtils";
import { useToast } from "@/hooks/use-toast";
import { 
  PAGE_SIZE_OPTIONS,
  MAX_LETTER_SIZE 
} from "./constants";

interface DownloadPuzzleDialogProps {
  open: boolean;
  onClose: () => void;
  puzzle: PuzzleGrid | null;
}

export const DownloadPuzzleDialog: React.FC<DownloadPuzzleDialogProps> = ({
  open,
  onClose,
  puzzle
}) => {
  const { toast } = useToast();
  
  // State variables for PDF generation
  const [isPDFReady, setIsPDFReady] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [showLivePreview, setShowLivePreview] = useState(false);
  
  // Content configuration
  const [title, setTitle] = useState("WORD SEARCH PUZZLE");
  const [subtitle, setSubtitle] = useState("Find all the words");
  const [instruction, setInstruction] = useState("Circle all the words from the list below.");
  
  // Visibility options
  const [showTitle, setShowTitle] = useState(true);
  const [showSubtitle, setShowSubtitle] = useState(true);
  const [showInstruction, setShowInstruction] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [showWordList, setShowWordList] = useState(true);
  
  // Position offsets
  const [titleOffset, setTitleOffset] = useState(0);
  const [subtitleOffset, setSubtitleOffset] = useState(0);
  const [instructionOffset, setInstructionOffset] = useState(0);
  const [gridOffset, setGridOffset] = useState(0);
  const [wordListOffset, setWordListOffset] = useState(0);
  
  // Size configurations
  const [cellSize, setCellSize] = useState(28);
  const [letterSizeMultiplier, setLetterSizeMultiplier] = useState(1);
  const [titleSizeMultiplier, setTitleSizeMultiplier] = useState(1);
  const [subtitleSizeMultiplier, setSubtitleSizeMultiplier] = useState(1);
  const [instructionSizeMultiplier, setInstructionSizeMultiplier] = useState(1);
  const [wordListSizeMultiplier, setWordListSizeMultiplier] = useState(1);
  
  // Page size configuration
  const [currentWidth, setCurrentWidth] = useState(595.28); // A4 default
  const [currentHeight, setCurrentHeight] = useState(841.89); // A4 default
  const [contentWidth, setContentWidth] = useState(515.28); // A4 content area
  const [contentHeight, setContentHeight] = useState(761.89); // A4 content area
  
  // Aesthetics configuration
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [imageOpacity, setImageOpacity] = useState(0.3);
  const [imagePositions, setImagePositions] = useState<{x: number; y: number}[]>([]);
  const [designAngle, setDesignAngle] = useState(0);
  const [designSize, setDesignSize] = useState(1);
  const [designSpacing, setDesignSpacing] = useState(1);
  const [useTiledPattern, setUseTiledPattern] = useState(false);

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
          uploadedImages={uploadedImages}
          imageOpacity={imageOpacity}
          imagePositions={imagePositions}
          designAngle={designAngle}
          designSize={designSize}
          designSpacing={designSpacing}
          useTiledPattern={useTiledPattern}
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

  // Rest of component implementation
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogTitle>Download Puzzle</DialogTitle>
        <div className="grid gap-4">
          <button
            onClick={handleSaveLayout}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded"
            disabled={isGenerating}
          >
            {isGenerating ? "Generating PDF..." : "Generate PDF"}
          </button>
          
          {/* Rest of your UI implementation */}
          {/* Add tabs for Layout, Content, Aesthetics */}
          <Tabs defaultValue="layout">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="layout">Layout</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="aesthetics">Aesthetics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="layout">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Page Size</label>
                  <Select 
                    defaultValue="a4" 
                    onValueChange={(value) => {
                      // Handle page size change
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a page size" />
                    </SelectTrigger>
                    <SelectContent>
                      {PAGE_SIZE_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Cell Size: {cellSize}px</label>
                  <Slider
                    value={[cellSize]}
                    min={20}
                    max={40}
                    step={1}
                    onValueChange={(values) => setCellSize(values[0])}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="content">
              {/* Content tab implementation */}
            </TabsContent>
            
            <TabsContent value="aesthetics">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Image Tiling Pattern</label>
                  <Select 
                    defaultValue="none" 
                    onValueChange={(value) => {
                      setUseTiledPattern(value === "tiled");
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select pattern type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="tiled">Tiled Pattern</SelectItem>
                      <SelectItem value="centered">Centered</SelectItem>
                      <SelectItem value="random">Random</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Design Angle: {designAngle}°
                  </label>
                  <Slider
                    value={[designAngle]}
                    min={0}
                    max={360}
                    step={5}
                    onValueChange={(values) => setDesignAngle(values[0])}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Design Size: {Math.round(designSize * 100)}%
                  </label>
                  <Slider
                    value={[designSize]}
                    min={0.2}
                    max={2}
                    step={0.1}
                    onValueChange={(values) => setDesignSize(values[0])}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Image Opacity: {Math.round(imageOpacity * 100)}%
                  </label>
                  <Slider
                    value={[imageOpacity]}
                    min={0.05}
                    max={1}
                    step={0.05}
                    onValueChange={(values) => setImageOpacity(values[0])}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Upload Images</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          if (event.target && typeof event.target.result === 'string') {
                            setUploadedImages([...uploadedImages, event.target.result]);
                            setImagePositions([...imagePositions, { x: 25, y: 25 }]);
                          }
                        };
                        reader.readAsDataURL(e.target.files[0]);
                      }
                    }}
                    className="w-full border rounded p-2"
                  />
                </div>
                
                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {uploadedImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img 
                          src={image} 
                          alt={`Uploaded ${index}`} 
                          className="w-full h-20 object-contain border rounded"
                        />
                        <button
                          className="absolute top-0 right-0 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center"
                          onClick={() => {
                            const newImages = [...uploadedImages];
                            const newPositions = [...imagePositions];
                            newImages.splice(index, 1);
                            newPositions.splice(index, 1);
                            setUploadedImages(newImages);
                            setImagePositions(newPositions);
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
