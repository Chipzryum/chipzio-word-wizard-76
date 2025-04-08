
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Unit } from "./types";

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
}

export const ControlPanel = ({
  title,
  subtitle,
  instruction,
  showTitle,
  showSubtitle,
  showInstruction,
  showGrid,
  showWordList,
  setTitle,
  setSubtitle,
  setInstruction,
  setShowTitle,
  setShowSubtitle,
  setShowInstruction,
  setShowGrid,
  setShowWordList,
}: ControlPanelProps) => {
  return (
    <div className="p-4 overflow-y-auto max-h-[60vh]">
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
    </div>
  );
};
