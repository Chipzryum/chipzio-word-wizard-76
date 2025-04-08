
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface SizesSettingsProps {
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
  showTitle: boolean;
  showSubtitle: boolean;
  showInstruction: boolean;
  showWordList: boolean;
  showGrid: boolean;
}

export const SizesSettings = ({
  letterSizeMultiplier,
  setLetterSizeMultiplier,
  titleSizeMultiplier, 
  setTitleSizeMultiplier,
  subtitleSizeMultiplier,
  setSubtitleSizeMultiplier,
  instructionSizeMultiplier,
  setInstructionSizeMultiplier,
  wordListSizeMultiplier,
  setWordListSizeMultiplier,
  cellSizeMultiplier,
  setCellSizeMultiplier,
  showTitle,
  showSubtitle,
  showInstruction,
  showWordList,
  showGrid
}: SizesSettingsProps) => {
  return (
    <div className="space-y-4">
      <div className="glass-card rounded-lg p-4 bg-white/50 border shadow-sm">
        <div className="grid gap-2">
          <Label className="font-medium">Letters Size</Label>
          <Slider
            value={[letterSizeMultiplier * 100]}
            min={50}
            max={150}
            step={1}
            onValueChange={(value) => setLetterSizeMultiplier(value[0] / 100)}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>50%</span>
            <span>{(letterSizeMultiplier * 100).toFixed(0)}%</span>
            <span>150%</span>
          </div>
        </div>
      </div>

      {showTitle && (
        <div className="glass-card rounded-lg p-4 bg-white/50 border shadow-sm">
          <div className="grid gap-2">
            <Label className="font-medium">Title Size</Label>
            <Slider
              value={[titleSizeMultiplier * 100]}
              min={50}
              max={150}
              step={1}
              onValueChange={(value) => setTitleSizeMultiplier(value[0] / 100)}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>50%</span>
              <span>{(titleSizeMultiplier * 100).toFixed(0)}%</span>
              <span>150%</span>
            </div>
          </div>
        </div>
      )}

      {showSubtitle && (
        <div className="glass-card rounded-lg p-4 bg-white/50 border shadow-sm">
          <div className="grid gap-2">
            <Label className="font-medium">Subtitle Size</Label>
            <Slider
              value={[subtitleSizeMultiplier * 100]}
              min={50}
              max={150}
              step={1}
              onValueChange={(value) => setSubtitleSizeMultiplier(value[0] / 100)}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>50%</span>
              <span>{(subtitleSizeMultiplier * 100).toFixed(0)}%</span>
              <span>150%</span>
            </div>
          </div>
        </div>
      )}

      {showInstruction && (
        <div className="glass-card rounded-lg p-4 bg-white/50 border shadow-sm">
          <div className="grid gap-2">
            <Label className="font-medium">Instruction Size</Label>
            <Slider
              value={[instructionSizeMultiplier * 100]}
              min={50}
              max={150}
              step={1}
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
        </div>
      )}

      {showWordList && (
        <div className="glass-card rounded-lg p-4 bg-white/50 border shadow-sm">
          <div className="grid gap-2">
            <Label className="font-medium">Word List Size</Label>
            <Slider
              value={[wordListSizeMultiplier * 100]}
              min={50}
              max={150}
              step={1}
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
        </div>
      )}
      
      {showGrid && (
        <div className="glass-card rounded-lg p-4 bg-white/50 border shadow-sm">
          <div className="grid gap-2">
            <Label className="font-medium">Grid Cell Size</Label>
            <Slider
              value={[cellSizeMultiplier * 100]}
              min={50}
              max={150}
              step={1}
              onValueChange={(value) => setCellSizeMultiplier(value[0] / 100)}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>50%</span>
              <span>{(cellSizeMultiplier * 100).toFixed(0)}%</span>
              <span>150%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
