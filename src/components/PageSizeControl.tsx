
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PageSize, Unit, UNITS } from "@/utils/pdfUtils";

interface PageSizeControlProps {
  selectedSize: PageSize;
  handleSizeChange: (size: PageSize) => void;
  selectedUnit: Unit;
  setSelectedUnit: React.Dispatch<React.SetStateAction<Unit>>;
  currentWidth: number;
  currentHeight: number;
  handleDimensionChange: (dimension: "width" | "height", value: string) => void;
  convertFromPoints: (points: number) => string;
}

export const PageSizeControl: React.FC<PageSizeControlProps> = ({
  selectedSize,
  handleSizeChange,
  selectedUnit,
  setSelectedUnit,
  currentWidth,
  currentHeight,
  handleDimensionChange,
  convertFromPoints,
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label>Page Size</Label>
        <select
          className="w-full p-2 border rounded"
          value={selectedSize}
          onChange={(e) => handleSizeChange(e.target.value as PageSize)}
        >
          {["A3", "A4", "A5", "A6", "Letter", "Legal", "Custom"].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      {selectedSize === "Custom" && (
        <>
          <div className="space-y-2">
            <Label>Units</Label>
            <select
              className="w-full p-2 border rounded"
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value as Unit)}
            >
              {Object.keys(UNITS).map((unit) => (
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
    </>
  );
};
