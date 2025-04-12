
import { useState, useMemo } from "react";
import { PageSize, Unit } from "../types";
import { PAGE_SIZES, UNITS, PDF_MARGIN, BASE_PADDING, BORDER_WIDTH, MAX_OFFSET } from "../constants";

export const usePuzzleLayout = () => {
  const [selectedSize, setSelectedSize] = useState<PageSize>("A4");
  const [selectedUnit, setSelectedUnit] = useState<Unit>("Points");
  const [customWidth, setCustomWidth] = useState(PAGE_SIZES.A4.width);
  const [customHeight, setCustomHeight] = useState(PAGE_SIZES.A4.height);

  const handleSizeChange = (size: PageSize) => {
    setSelectedSize(size);
    if (size !== "Custom") {
      setCustomWidth(PAGE_SIZES[size].width);
      setCustomHeight(PAGE_SIZES[size].height);
    }
  };

  const handleUnitChange = (unit: Unit) => setSelectedUnit(unit);

  const handleDimensionChange = (dimension: "width" | "height", value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      const pointValue = numValue * UNITS[selectedUnit];
      dimension === "width" ? setCustomWidth(pointValue) : setCustomHeight(pointValue);
      setSelectedSize("Custom");
    }
  };

  const convertFromPoints = (points: number) => (points / UNITS[selectedUnit]).toFixed(2);

  const currentWidth = selectedSize === "Custom" ? customWidth : PAGE_SIZES[selectedSize].width;
  const currentHeight = selectedSize === "Custom" ? customHeight : PAGE_SIZES[selectedSize].height;

  const contentWidth = currentWidth - 2 * (PDF_MARGIN + BASE_PADDING + BORDER_WIDTH);
  const contentHeight = currentHeight - 2 * (PDF_MARGIN + BASE_PADDING + BORDER_WIDTH);

  const getVerticalOffset = (offset: number) => {
    const maxAllowedOffset = Math.min(MAX_OFFSET, (contentHeight / 6) / 10);
    return Math.max(-maxAllowedOffset, Math.min(offset * 10, maxAllowedOffset * 10));
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
    getVerticalOffset
  };
};
