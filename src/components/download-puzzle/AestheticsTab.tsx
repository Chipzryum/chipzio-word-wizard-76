
import { Label } from "@/components/ui/label";

export const AestheticsTab = () => {
  return (
    <div className="space-y-4">
      <div className="glass-card rounded-lg p-4 bg-white/50 border shadow-sm">
        <Label className="text-center block w-full text-muted-foreground">
          No aesthetics settings are currently available.
        </Label>
      </div>
    </div>
  );
};
