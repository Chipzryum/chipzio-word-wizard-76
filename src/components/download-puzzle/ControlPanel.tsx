
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { PageSize, Unit } from "./constants";

interface ControlPanelProps {
  showTitle: boolean;
  setShowTitle: (show: boolean) => void;
  title: string;
  setTitle: (title: string) => void;
  titleSizeMultiplier: number;
  setTitleSizeMultiplier: (value: number) => void;
  titleOffset: number;
  positioningElement: string | null;
  togglePositioning: (element: string) => void;
  moveElement: (element: string, direction: 'up' | 'down') => void;
  
  showSubtitle: boolean;
  setShowSubtitle: (show: boolean) => void;
  subtitle: string;
  setSubtitle: (subtitle: string) => void;
  subtitleSizeMultiplier: number;
  setSubtitleSizeMultiplier: (value: number) => void;
  subtitleOffset: number;
  
  showInstruction: boolean;
  setShowInstruction: (show: boolean) => void;
  instruction: string;
  setInstruction: (instruction: string) => void;
  instructionSizeMultiplier: number;
  setInstructionSizeMultiplier: (value: number) => void;
  instructionOffset: number;
  
  selectedSize: PageSize;
  handleSizeChange: (size: PageSize) => void;
  
  showGrid: boolean;
  setShowGrid: (show: boolean) => void;
  cellSizeMultiplier: number;
  setCellSizeMultiplier: (value: number) => void;
  letterSizeMultiplier: number;
  setLetterSizeMultiplier: (value: number) => void;
  gridOffset: number;
  
  showWordList: boolean;
  setShowWordList: (show: boolean) => void;
  wordListSizeMultiplier: number;
  setWordListSizeMultiplier: (value: number) => void;
  wordListOffset: number;
  
  selectedUnit: Unit;
  setSelectedUnit: (unit: Unit) => void;
  currentWidth: number;
  currentHeight: number;
  handleDimensionChange: (dimension: "width" | "height", value: string) => void;
  convertFromPoints: (points: number) => string;
  formatSliderValue: (value: number) => string;
  getPositionValue: (offset: number) => string;
}

export const ControlPanel = ({
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
}: ControlPanelProps) => {
  const MAX_LETTER_SIZE = 1.3;
  
  return (
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
          <Button
            type="button"
            variant={showGrid ? "default" : "outline"}
            className="w-24 h-8"
            onClick={() => setShowGrid(!showGrid)}
          >
            {showGrid ? "Grid" : "Grid Off"}
          </Button>
          <Button
            type="button"
            variant={positioningElement === 'grid' ? "secondary" : "outline"}
            size="icon"
            className="h-8 w-8"
            onClick={() => togglePositioning('grid')}
            disabled={!showGrid}
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
        {showGrid && (
          <>
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
              <span className="text-xs">Letter Size: {formatSliderValue(letterSizeMultiplier)} {letterSizeMultiplier > MAX_LETTER_SIZE ? "(will be capped)" : ""}</span>
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
          </>
        )}
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
              {["Points", "Millimeters", "Inches"].map((unit) => (
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
  );
};
