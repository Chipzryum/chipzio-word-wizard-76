
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageSize, Unit } from "./types";
import { PAGE_SIZES, UNITS, PAGE_SIZE_OPTIONS } from "./constants";

interface LayoutSettingsProps {
  selectedSize: PageSize;
  handleSizeChange: (size: PageSize) => void;
  customWidth: number;
  customHeight: number;
  selectedUnit: Unit;
  handleUnitChange: (unit: Unit) => void;
  handleDimensionChange: (dimension: "width" | "height", value: string) => void;
  convertFromPoints: (points: number) => string;
  
  titleOffset: number;
  subtitleOffset: number;
  instructionOffset: number;
  gridOffset: number;
  wordListOffset: number;
  setTitleOffset: (value: number) => void;
  setSubtitleOffset: (value: number) => void;
  setInstructionOffset: (value: number) => void;
  setGridOffset: (value: number) => void;
  setWordListOffset: (value: number) => void;
  
  showTitle: boolean;
  showSubtitle: boolean;
  showInstruction: boolean;
  showGrid: boolean;
  showWordList: boolean;
  
  getPositionValue: (offset: number) => string;
}

export const LayoutSettings = ({
  selectedSize,
  handleSizeChange,
  customWidth,
  customHeight,
  selectedUnit,
  handleUnitChange,
  handleDimensionChange,
  convertFromPoints,
  
  titleOffset,
  subtitleOffset,
  instructionOffset,
  gridOffset,
  wordListOffset,
  setTitleOffset,
  setSubtitleOffset,
  setInstructionOffset,
  setGridOffset,
  setWordListOffset,
  
  showTitle,
  showSubtitle,
  showInstruction,
  showGrid,
  showWordList,
  
  getPositionValue
}: LayoutSettingsProps) => {
  return (
    <div className="space-y-6">
      <div className="glass-card rounded-lg p-4 bg-white/50 border shadow-sm">
        <h3 className="font-medium mb-3">Page Size</h3>
        <Select value={selectedSize} onValueChange={(value) => handleSizeChange(value as PageSize)}>
          <SelectTrigger className="w-full mb-3">
            <SelectValue placeholder="Select page size" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(PAGE_SIZES).map((size) => (
              <SelectItem key={size} value={size}>
                {size}
              </SelectItem>
            ))}
            <SelectItem value="Custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {selectedSize === "Custom" && (
        <>
          <div className="glass-card rounded-lg p-4 bg-white/50 border shadow-sm">
            <h3 className="font-medium mb-3">Custom Dimensions</h3>
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
          </div>

          <div className="glass-card rounded-lg p-4 bg-white/50 border shadow-sm">
            <h3 className="font-medium mb-3">Units</h3>
            <div className="grid grid-cols-4 gap-2">
              {Object.keys(UNITS).map((unit) => (
                <button
                  key={unit}
                  onClick={() => handleUnitChange(unit as Unit)}
                  className={`py-2 px-4 rounded-md transition-colors ${
                    selectedUnit === unit
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                  }`}
                >
                  {unit}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="glass-card rounded-lg p-4 bg-white/50 border shadow-sm">
        <h3 className="font-medium mb-3">Element Position</h3>
        <div className="space-y-4">
          {showTitle && (
            <div className="space-y-2">
              <div className="flex justify-between items-center mb-2">
                <Label>Title Position</Label>
                <span className="text-xs bg-muted px-2 py-1 rounded-md">
                  {getPositionValue(titleOffset)}
                </span>
              </div>
              <Slider
                value={[titleOffset]}
                min={-20}
                max={20}
                step={1}
                onValueChange={(values) => setTitleOffset(values[0])}
              />
            </div>
          )}
          
          {showSubtitle && (
            <div className="space-y-2">
              <div className="flex justify-between items-center mb-2">
                <Label>Subtitle Position</Label>
                <span className="text-xs bg-muted px-2 py-1 rounded-md">
                  {getPositionValue(subtitleOffset)}
                </span>
              </div>
              <Slider
                value={[subtitleOffset]}
                min={-20}
                max={20}
                step={1}
                onValueChange={(values) => setSubtitleOffset(values[0])}
              />
            </div>
          )}
          
          {showInstruction && (
            <div className="space-y-2">
              <div className="flex justify-between items-center mb-2">
                <Label>Instruction Position</Label>
                <span className="text-xs bg-muted px-2 py-1 rounded-md">
                  {getPositionValue(instructionOffset)}
                </span>
              </div>
              <Slider
                value={[instructionOffset]}
                min={-20}
                max={20}
                step={1}
                onValueChange={(values) => setInstructionOffset(values[0])}
              />
            </div>
          )}
          
          {showGrid && (
            <div className="space-y-2">
              <div className="flex justify-between items-center mb-2">
                <Label>Grid Position</Label>
                <span className="text-xs bg-muted px-2 py-1 rounded-md">
                  {getPositionValue(gridOffset)}
                </span>
              </div>
              <Slider
                value={[gridOffset]}
                min={-20}
                max={20}
                step={1}
                onValueChange={(values) => setGridOffset(values[0])}
              />
            </div>
          )}
          
          {showWordList && (
            <div className="space-y-2">
              <div className="flex justify-between items-center mb-2">
                <Label>Word List Position</Label>
                <span className="text-xs bg-muted px-2 py-1 rounded-md">
                  {getPositionValue(wordListOffset)}
                </span>
              </div>
              <Slider
                value={[wordListOffset]}
                min={-20}
                max={20}
                step={1}
                onValueChange={(values) => setWordListOffset(values[0])}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
