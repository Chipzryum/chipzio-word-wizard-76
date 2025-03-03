
import React from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { formatSliderValue } from "@/utils/pdfUtils";

interface SizeSliderProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export const SizeSlider: React.FC<SizeSliderProps> = ({
  id,
  label,
  value,
  onChange,
  min = 0.5,
  max = 2.0,
  step = 0.1,
  className = "w-32",
}) => {
  return (
    <div className="flex items-center justify-between mt-2">
      <Label htmlFor={id} className="text-xs">{label}: {formatSliderValue(value)}</Label>
      <Slider 
        id={id}
        min={min} 
        max={max} 
        step={step}
        value={[value]} 
        onValueChange={onChange}
        className={className}
      />
    </div>
  );
};
