
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface BlackBoxToggleProps {
  showBlackBoxes: boolean;
  setShowBlackBoxes: (value: boolean) => void;
}

export const BlackBoxToggle = ({
  showBlackBoxes,
  setShowBlackBoxes
}: BlackBoxToggleProps) => {
  return (
    <div className="flex items-center space-x-2 mb-4">
      <Switch 
        id="black-boxes" 
        checked={showBlackBoxes} 
        onCheckedChange={setShowBlackBoxes} 
      />
      <Label htmlFor="black-boxes">Show Black Boxes</Label>
    </div>
  );
};
