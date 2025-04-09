
import { useState } from "react";
import { PageSize, Unit } from "../types";
import { PAGE_SIZES, UNITS, PDF_MARGIN, BASE_PADDING, BORDER_WIDTH } from "../constants";

export function usePuzzleDimensions(initialSize: PageSize = "A4") {
  const [selectedSize, setSelectedSize] = useState<PageSize>(initialSize);
  const [selectedUnit, setSelectedUnit] = useState<Unit>("Points");
  const [customWidth, setCustomWidth] = useState(PAGE_SIZES.A4.width);
  const [customHeight, setCustomHeight] = useState(PAGE_SIZES.A4.height);

  const currentWidth = selectedSize === "Custom" ? customWidth : PAGE_SIZES[selectedSize].width;
  const currentHeight = selectedSize === "Custom" ? customHeight : PAGE_SIZES[selectedSize].height;

  const contentWidth = currentWidth - (2 * PDF_MARGIN) - (2 * BASE_PADDING) - (2 * BORDER_WIDTH);
  const contentHeight = currentHeight - (2 * PDF_MARGIN) - (2 * BASE_PADDING) - (2 * BORDER_WIDTH);

  const handleSizeChange = (size: PageSize) => {
    setSelectedSize(size);
    if (size !== "Custom") {
      setCustomWidth(PAGE_SIZES[size].width);
      setCustomHeight(PAGE_SIZES[size].height);
    }
  };

  const handleUnitChange = (unit: Unit) => {
    setSelectedUnit(unit);
  };

  const handleDimensionChange = (dimension: "width" | "height", value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    const pointValue = numValue * UNITS[selectedUnit];
    if (dimension === "width") {
      setCustomWidth(pointValue);
    } else {
      setCustomHeight(pointValue);
    }
    setSelectedSize("Custom");
  };

  const convertFromPoints = (points: number) => {
    return (points / UNITS[selectedUnit]).toFixed(2);
  };

  return {
    selectedSize,
    selectedUnit,
    customWidth,
    customHeight,
    currentWidth,
    currentHeight,
    contentWidth,
    contentHeight,
    handleSizeChange,
    handleUnitChange,
    handleDimensionChange,
    convertFromPoints,
  };
}
