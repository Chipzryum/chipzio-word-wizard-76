
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";
import { PageSize, Unit } from "./constants";

interface ControlPanelProps {
  showTitle: boolean;
  setShowTitle: (show: boolean) => void;
  title: string;
  setTitle: (title: string) => void;
  titleSizeMultiplier: number;
  setTitleSizeMultiplier: (multiplier: number) => void;
  titleOffset: number;
  positioningElement: string | null;
  togglePositioning: (element: string | null) => void;
  moveElement: (element: string, direction: 'up' | 'down') => void;

  showSubtitle: boolean;
  setShowSubtitle: (show: boolean) => void;
  subtitle: string;
  setSubtitle: (subtitle: string) => void;
  subtitleSizeMultiplier: number;
  setSubtitleSizeMultiplier: (multiplier: number) => void;
  subtitleOffset: number;

  showInstruction: boolean;
  setShowInstruction: (show: boolean) => void;
  instruction: string;
  setInstruction: (instruction: string) => void;
  instructionSizeMultiplier: number;
  setInstructionSizeMultiplier: (multiplier: number) => void;
  instructionOffset: number;

  selectedSize: PageSize;
  handleSizeChange: (size: PageSize) => void;

  showGrid: boolean;
  setShowGrid: (show: boolean) => void;
  cellSizeMultiplier: number;
  setCellSizeMultiplier: (multiplier: number) => void;
  letterSizeMultiplier: number;
  setLetterSizeMultiplier: (multiplier: number) => void;
  gridOffset: number;

  showWordList: boolean;
  setShowWordList: (show: boolean) => void;
  wordListSizeMultiplier: number;
  setWordListSizeMultiplier: (multiplier: number) => void;
  wordListOffset: number;

  selectedUnit: Unit;
  setSelectedUnit: (unit: Unit) => void;
  currentWidth: number;
  currentHeight: number;
  handleDimensionChange: (dimension: "width" | "height", value: string) => void;
  convertFromPoints: (points: number) => string;
  formatSliderValue: (value: number) => string;
  getPositionValue: (offset: number) => string;

  uploadedImages: string[];
  onImagesChange: (images: string[]) => void;
  imageOpacity: number;
  setImageOpacity: (opacity: number) => void;
  imageGridSize: number;
  setImageGridSize: (size: number) => void;
  imageAngle: number;
  setImageAngle: (angle: number) => void;
  imageSpacing: number;
  setImageSpacing: (spacing: number) => void;
  hideImageUpload?: boolean;
}

export function ControlPanel({
  showTitle,
  setShowTitle,
  title,
  setTitle,
  titleSizeMultiplier,
  setTitleSizeMultiplier,
  titleOffset,
  positioningElement,
  togglePositioning,
  moveElement,
  
  showSubtitle,
  setShowSubtitle,
  subtitle,
  setSubtitle,
  subtitleSizeMultiplier,
  setSubtitleSizeMultiplier,
  subtitleOffset,
  
  showInstruction,
  setShowInstruction,
  instruction,
  setInstruction,
  instructionSizeMultiplier,
  setInstructionSizeMultiplier,
  instructionOffset,
  
  selectedSize,
  handleSizeChange,
  
  showGrid,
  setShowGrid,
  cellSizeMultiplier,
  setCellSizeMultiplier,
  letterSizeMultiplier,
  setLetterSizeMultiplier,
  gridOffset,
  
  showWordList,
  setShowWordList,
  wordListSizeMultiplier,
  setWordListSizeMultiplier,
  wordListOffset,
  
  selectedUnit,
  setSelectedUnit,
  currentWidth,
  currentHeight,
  handleDimensionChange,
  convertFromPoints,
  formatSliderValue,
  getPositionValue,
  
  uploadedImages,
  onImagesChange,
  imageOpacity,
  setImageOpacity,
  imageGridSize,
  setImageGridSize,
  imageAngle,
  setImageAngle,
  imageSpacing,
  setImageSpacing,
  hideImageUpload = false,
}: ControlPanelProps) {
  return (
    <>
      <div className="glass-card rounded-lg p-4 bg-white/50 border shadow-sm">
        <h3 className="font-medium mb-3">Title</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="showTitle">Show title</Label>
            <Switch
              id="showTitle"
              checked={showTitle}
              onCheckedChange={setShowTitle}
            />
          </div>
          
          {showTitle && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Puzzle title"
                    className="w-full"
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => moveElement('title', 'up')}
                  className="h-9 w-9"
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => moveElement('title', 'down')}
                  className="h-9 w-9"
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="glass-card rounded-lg p-4 bg-white/50 border shadow-sm">
        <h3 className="font-medium mb-3">Subtitle</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="showSubtitle">Show subtitle</Label>
            <Switch
              id="showSubtitle"
              checked={showSubtitle}
              onCheckedChange={setShowSubtitle}
            />
          </div>
          
          {showSubtitle && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Input
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="Subtitle"
                    className="w-full"
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => moveElement('subtitle', 'up')}
                  className="h-9 w-9"
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => moveElement('subtitle', 'down')}
                  className="h-9 w-9"
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="glass-card rounded-lg p-4 bg-white/50 border shadow-sm">
        <h3 className="font-medium mb-3">Instructions</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="showInstructions">Show instructions</Label>
            <Switch
              id="showInstructions"
              checked={showInstruction}
              onCheckedChange={setShowInstruction}
            />
          </div>
          
          {showInstruction && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Input
                    value={instruction}
                    onChange={(e) => setInstruction(e.target.value)}
                    placeholder="Instructions"
                    className="w-full"
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => moveElement('instruction', 'up')}
                  className="h-9 w-9"
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => moveElement('instruction', 'down')}
                  className="h-9 w-9"
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="glass-card rounded-lg p-4 bg-white/50 border shadow-sm">
        <h3 className="font-medium mb-3">Grid</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="showGrid">Show grid</Label>
            <Switch
              id="showGrid"
              checked={showGrid}
              onCheckedChange={setShowGrid}
            />
          </div>
          
          {showGrid && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => moveElement('grid', 'up')}
                className="h-9 w-9"
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => moveElement('grid', 'down')}
                className="h-9 w-9"
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="glass-card rounded-lg p-4 bg-white/50 border shadow-sm">
        <h3 className="font-medium mb-3">Word List</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="showWordList">Show word list</Label>
            <Switch
              id="showWordList"
              checked={showWordList}
              onCheckedChange={setShowWordList}
            />
          </div>
          
          {showWordList && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => moveElement('wordList', 'up')}
                className="h-9 w-9"
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => moveElement('wordList', 'down')}
                className="h-9 w-9"
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {!hideImageUpload && (
        <div className="glass-card rounded-lg p-4 bg-white/50 border shadow-sm">
          <h3 className="font-medium mb-3">Background Images</h3>
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
                    onImagesChange(newImages);
                  }}
                  className="absolute top-0 right-0 bg-red-500 text-white w-4 h-4 flex items-center justify-center rounded-full text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = (event) => {
                  if (event.target?.result) {
                    onImagesChange([...uploadedImages, event.target.result as string]);
                  }
                };
                reader.readAsDataURL(e.target.files[0]);
              }
            }}
            className="w-full mb-4"
          />
        </div>
      )}
    </>
  );
}
