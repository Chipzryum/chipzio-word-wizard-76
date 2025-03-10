import { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2, Upload, Shuffle, Info } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PAGE_SIZES, PAGE_SIZE_OPTIONS, DEFAULT_VALUES, MAX_MULTIPLIERS, Unit } from "./constants";

interface ControlPanelProps {
  title: string;
  setTitle: (value: string) => void;
  
  subtitle: string;
  setSubtitle: (value: string) => void;
  
  instruction: string;
  setInstruction: (value: string) => void;
  
  showTitle: boolean;
  setShowTitle: (value: boolean) => void;
  
  showSubtitle: boolean;
  setShowSubtitle: (value: boolean) => void;
  
  showInstruction: boolean;
  setShowInstruction: (value: boolean) => void;
  
  showGrid: boolean;
  setShowGrid: (value: boolean) => void;
  
  showWordList: boolean;
  setShowWordList: (value: boolean) => void;
  
  selectedSize: string;
  handleSizeChange: (size: string) => void;
  
  selectedUnit: string;
  setSelectedUnit: (unit: Unit) => void;
  
  currentWidth: number;
  currentHeight: number;
  
  handleDimensionChange: (dimension: "width" | "height", value: string) => void;
  convertFromPoints: (points: number) => string;
  
  letterSizeMultiplier: number;
  setLetterSizeMultiplier: (value: number) => void;
  
  titleSizeMultiplier: number;
  setTitleSizeMultiplier: (value: number) => void;
  
  subtitleSizeMultiplier: number;
  setSubtitleSizeMultiplier: (value: number) => void;
  
  instructionSizeMultiplier: number;
  setInstructionSizeMultiplier: (value: number) => void;
  
  wordListSizeMultiplier: number;
  setWordListSizeMultiplier: (value: number) => void;
  
  cellSizeMultiplier: number;
  setCellSizeMultiplier: (value: number) => void;
  
  titleOffset: number;
  subtitleOffset: number;
  instructionOffset: number;
  gridOffset: number;
  wordListOffset: number;
  
  positioningElement: string | null;
  togglePositioning: (element: string) => void;
  moveElement: (element: string, direction: 'up' | 'down') => void;
  
  formatSliderValue: (value: number) => string;
  getPositionValue: (offset: number) => string;

  uploadedImages: string[];
  onImagesChange: (images: string[]) => void;
  imageOpacity: number;
  setImageOpacity: (value: number) => void;
  onRandomizeImages: () => void;
}

export const ControlPanel = ({
  title,
  subtitle,
  instruction,
  selectedSize,
  showTitle,
  showSubtitle,
  showInstruction,
  showGrid,
  showWordList,
  letterSizeMultiplier,
  titleSizeMultiplier,
  subtitleSizeMultiplier,
  instructionSizeMultiplier,
  wordListSizeMultiplier,
  cellSizeMultiplier,
  titleOffset,
  subtitleOffset,
  instructionOffset,
  gridOffset,
  wordListOffset,
  setTitle,
  setSubtitle,
  setInstruction,
  handleSizeChange,
  setShowTitle,
  setShowSubtitle,
  setShowInstruction,
  setShowGrid,
  setShowWordList,
  setLetterSizeMultiplier,
  setTitleSizeMultiplier,
  setSubtitleSizeMultiplier,
  setInstructionSizeMultiplier,
  setWordListSizeMultiplier,
  setCellSizeMultiplier,
  selectedUnit,
  setSelectedUnit,
  currentWidth,
  currentHeight,
  handleDimensionChange,
  convertFromPoints,
  formatSliderValue,
  getPositionValue,
  positioningElement,
  togglePositioning,
  moveElement,
  uploadedImages,
  onImagesChange,
  imageOpacity,
  setImageOpacity,
  onRandomizeImages
}: ControlPanelProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImages: string[] = [];
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    const supportedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (!supportedTypes.includes(file.type)) {
        continue;
      }

      if (file.size > maxFileSize) {
        continue;
      }

      const reader = new FileReader();
      try {
        const dataUrl = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        newImages.push(dataUrl);
      } catch (error) {
        console.error('Error reading file:', error);
      }
    }

    if (newImages.length > 0) {
      onImagesChange([...uploadedImages, ...newImages]);
    }
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="p-4 overflow-y-auto max-h-[60vh]">
      <Tabs defaultValue="content">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="content" className="flex-1">
            Content
          </TabsTrigger>
          <TabsTrigger value="layout" className="flex-1">
            Layout
          </TabsTrigger>
          <TabsTrigger value="sizes" className="flex-1">
            Sizes
          </TabsTrigger>
          <TabsTrigger value="aesthetics" className="flex-1">
            Aesthetics
          </TabsTrigger>
        </TabsList>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-6">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <div className="flex items-center gap-2">
                <Switch
                  checked={showTitle}
                  onCheckedChange={setShowTitle}
                  id="show-title"
                />
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={!showTitle}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <div className="flex items-center gap-2">
                <Switch
                  checked={showSubtitle}
                  onCheckedChange={setShowSubtitle}
                  id="show-subtitle"
                />
                <Input
                  id="subtitle"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  disabled={!showSubtitle}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="instruction">Instruction</Label>
              <div className="flex items-center gap-2">
                <Switch
                  checked={showInstruction}
                  onCheckedChange={setShowInstruction}
                  id="show-instruction"
                />
                <Input
                  id="instruction"
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
                  disabled={!showInstruction}
                />
              </div>
            </div>

            <Separator />

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="show-grid">Show Grid</Label>
                <Switch
                  id="show-grid"
                  checked={showGrid}
                  onCheckedChange={setShowGrid}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="show-word-list">Show Word List</Label>
                <Switch
                  id="show-word-list"
                  checked={showWordList}
                  onCheckedChange={setShowWordList}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Layout Tab */}
        <TabsContent value="layout" className="space-y-6">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label>Page Size</Label>
              <Select
                value={selectedSize}
                onValueChange={(value) => handleSizeChange(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {PAGE_SIZE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label} 
                      {option.value !== "Custom" && ` (${PAGE_SIZES[option.value].width.toFixed(0)} × ${PAGE_SIZES[option.value].height.toFixed(0)})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedSize === "Custom" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="custom-width">Width ({selectedUnit})</Label>
                  <Input
                    id="custom-width"
                    type="number"
                    value={convertFromPoints(currentWidth)}
                    onChange={(e) => 
                      handleDimensionChange("width", e.target.value)
                    }
                    min="0"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="custom-height">Height ({selectedUnit})</Label>
                  <Input
                    id="custom-height"
                    type="number"
                    value={convertFromPoints(currentHeight)}
                    onChange={(e) =>
                      handleDimensionChange("height", e.target.value)
                    }
                    min="0"
                  />
                </div>
                <div className="grid gap-2 col-span-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Select
                    value={selectedUnit}
                    onValueChange={(value) => setSelectedUnit(value as Unit)}
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

            <Separator />

            {showTitle && (
              <div className="grid gap-2">
                <Label>Title Position</Label>
                <Slider
                  value={[titleOffset]}
                  min={-5}
                  max={5}
                  step={1}
                  onValueChange={(value) => moveElement('title', value[0] > titleOffset ? 'down' : 'up')}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Up</span>
                  <span>Down</span>
                </div>
              </div>
            )}

            {showSubtitle && (
              <div className="grid gap-2">
                <Label>Subtitle Position</Label>
                <Slider
                  value={[subtitleOffset]}
                  min={-5}
                  max={5}
                  step={1}
                  onValueChange={(value) => moveElement('subtitle', value[0] > subtitleOffset ? 'down' : 'up')}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Up</span>
                  <span>Down</span>
                </div>
              </div>
            )}

            {showInstruction && (
              <div className="grid gap-2">
                <Label>Instruction Position</Label>
                <Slider
                  value={[instructionOffset]}
                  min={-5}
                  max={5}
                  step={1}
                  onValueChange={(value) => moveElement('instruction', value[0] > instructionOffset ? 'down' : 'up')}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Up</span>
                  <span>Down</span>
                </div>
              </div>
            )}

            {showGrid && (
              <div className="grid gap-2">
                <Label>Grid Position</Label>
                <Slider
                  value={[gridOffset]}
                  min={-5}
                  max={5}
                  step={1}
                  onValueChange={(value) => moveElement('grid', value[0] > gridOffset ? 'down' : 'up')}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Up</span>
                  <span>Down</span>
                </div>
              </div>
            )}

            {showWordList && (
              <div className="grid gap-2">
                <Label>Word List Position</Label>
                <Slider
                  value={[wordListOffset]}
                  min={-5}
                  max={5}
                  step={1}
                  onValueChange={(value) => moveElement('wordList', value[0] > wordListOffset ? 'down' : 'up')}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Up</span>
                  <span>Down</span>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Sizes Tab */}
        <TabsContent value="sizes" className="space-y-6">
          <div className="space-y-4">
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

            {showSubtitle && (
              <div className="grid gap-2">
                <Label>Subtitle Size</Label>
                <Slider
                  value={[subtitleSizeMultiplier * 100]}
                  min={50}
                  max={150}
                  step={10}
                  onValueChange={(value) => setSubtitleSizeMultiplier(value[0] / 100)}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>50%</span>
                  <span>{(subtitleSizeMultiplier * 100).toFixed(0)}%</span>
                  <span>150%</span>
                </div>
              </div>
            )}

            {showInstruction && (
              <div className="grid gap-2">
                <Label>Instruction Size</Label>
                <Slider
                  value={[instructionSizeMultiplier * 100]}
                  min={50}
                  max={150}
                  step={10}
                  onValueChange={(value) =>
                    setInstructionSizeMultiplier(value[0] / 100)
                  }
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>50%</span>
                  <span>{(instructionSizeMultiplier * 100).toFixed(0)}%</span>
                  <span>150%</span>
                </div>
              </div>
            )}

            {showWordList && (
              <div className="grid gap-2">
                <Label>Word List Size</Label>
                <Slider
                  value={[wordListSizeMultiplier * 100]}
                  min={50}
                  max={150}
                  step={10}
                  onValueChange={(value) =>
                    setWordListSizeMultiplier(value[0] / 100)
                  }
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>50%</span>
                  <span>{(wordListSizeMultiplier * 100).toFixed(0)}%</span>
                  <span>150%</span>
                </div>
              </div>
            )}
            
            {showGrid && (
              <div className="grid gap-2">
                <Label>Cell Size</Label>
                <Slider
                  value={[cellSizeMultiplier * 100]}
                  min={50}
                  max={150}
                  step={10}
                  onValueChange={(value) => setCellSizeMultiplier(value[0] / 100)}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>50%</span>
                  <span>{(cellSizeMultiplier * 100).toFixed(0)}%</span>
                  <span>150%</span>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Aesthetics Tab */}
        <TabsContent value="aesthetics" className="space-y-6">
          <div className="space-y-4">
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label>Background Images</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Info className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Supported formats: JPG, PNG, GIF, WebP</p>
                      <p>Max file size: 5MB per image</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  onClick={triggerFileInput}
                  className="flex-1"
                  variant="outline"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Images
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onRandomizeImages}
                  disabled={uploadedImages.length === 0}
                >
                  <Shuffle className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Image Opacity</Label>
              <Slider
                value={[imageOpacity * 100]}
                min={10}
                max={100}
                step={10}
                onValueChange={(value) => setImageOpacity(value[0] / 100)}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>10%</span>
                <span>{(imageOpacity * 100).toFixed(0)}%</span>
                <span>100%</span>
              </div>
            </div>

            {uploadedImages.length > 0 && (
              <div className="grid gap-2">
                <Label>Uploaded Images</Label>
                <div className="grid grid-cols-4 gap-2">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Uploaded ${index + 1}`}
                        className="w-full h-20 object-cover rounded-md"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 p-1 rounded-md bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};