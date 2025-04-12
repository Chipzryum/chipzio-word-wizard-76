
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface PageEditToggleProps {
  editAllPages: boolean;
  onToggleEditMode: (value: boolean) => void;
}

export const PageEditToggle = ({ 
  editAllPages, 
  onToggleEditMode 
}: PageEditToggleProps) => {
  return (
    <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md mb-4">
      <Switch
        checked={editAllPages}
        onCheckedChange={onToggleEditMode}
        id="edit-mode-toggle"
      />
      <Label htmlFor="edit-mode-toggle" className="text-sm cursor-pointer">
        {editAllPages ? "Editing All Pages" : "Editing Selected Page Only"}
      </Label>
    </div>
  );
};
