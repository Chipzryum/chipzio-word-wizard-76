
import { useState } from "react";
import { MAX_OFFSET, DEFAULT_TITLE_MULTIPLIER, DEFAULT_SUBTITLE_MULTIPLIER, DEFAULT_INSTRUCTION_MULTIPLIER, DEFAULT_CELL_MULTIPLIER, DEFAULT_LETTER_SIZE_MULTIPLIER, DEFAULT_WORDLIST_MULTIPLIER, MAX_LETTER_SIZE } from "../constants";
import { CombinedPuzzleGrid } from "../types";
import { PAGE_SIZES } from "../constants";

export function usePuzzleSizes(currentWidth: number, currentHeight: number, contentHeight: number) {
  const [titleSizeMultiplier, setTitleSizeMultiplier] = useState(DEFAULT_TITLE_MULTIPLIER);
  const [subtitleSizeMultiplier, setSubtitleSizeMultiplier] = useState(DEFAULT_SUBTITLE_MULTIPLIER);
  const [instructionSizeMultiplier, setInstructionSizeMultiplier] = useState(DEFAULT_INSTRUCTION_MULTIPLIER);
  const [cellSizeMultiplier, setCellSizeMultiplier] = useState(DEFAULT_CELL_MULTIPLIER);
  const [letterSizeMultiplier, setLetterSizeMultiplier] = useState(DEFAULT_LETTER_SIZE_MULTIPLIER);
  const [wordListSizeMultiplier, setWordListSizeMultiplier] = useState(DEFAULT_WORDLIST_MULTIPLIER);

  const calculateFontSizes = () => {
    const a4Width = PAGE_SIZES.A4.width;
    const a4Height = PAGE_SIZES.A4.height;
    const sizeRatio = Math.sqrt((currentWidth * currentHeight) / (a4Width * a4Height));
    
    return {
      titleSize: Math.max(20, Math.min(48, Math.floor(36 * sizeRatio * titleSizeMultiplier))),
      subtitleSize: Math.max(14, Math.min(36, Math.floor(24 * sizeRatio * subtitleSizeMultiplier))),
      instructionSize: Math.max(8, Math.min(24, Math.floor(14 * sizeRatio * instructionSizeMultiplier))),
      wordListSize: Math.max(6, Math.min(28, Math.floor(12 * sizeRatio * wordListSizeMultiplier))),
    };
  };

  const fontSizes = calculateFontSizes();

  const calculateSpaceNeeded = (showTitle: boolean, showSubtitle: boolean, showInstruction: boolean, showWordList: boolean) => {
    let space = 0;
    if (showTitle) space += fontSizes.titleSize * titleSizeMultiplier + 10;
    if (showSubtitle) space += fontSizes.subtitleSize * subtitleSizeMultiplier + 10;
    if (showInstruction) space += fontSizes.instructionSize * instructionSizeMultiplier + 20;
    if (showWordList) space += fontSizes.wordListSize * wordListSizeMultiplier * 3;
    return space;
  };

  const calculateGridCellSize = (
    puzzles: CombinedPuzzleGrid[],
    activePuzzleIndex: number,
    showTitle: boolean,
    showSubtitle: boolean,
    showInstruction: boolean,
    showWordList: boolean
  ) => {
    if (!puzzles[activePuzzleIndex]) return 20;
    
    const currentPuzzle = puzzles[activePuzzleIndex];
    const gridWidth = currentPuzzle.grid[0].length;
    const gridHeight = currentPuzzle.grid.length;
    
    const reservedSpace = calculateSpaceNeeded(showTitle, showSubtitle, showInstruction, showWordList) + 40;
    
    const availableHeight = contentHeight - reservedSpace;
    const availableWidth = contentWidth;
    
    const cellSizeByWidth = availableWidth / gridWidth;
    const cellSizeByHeight = availableHeight / gridHeight;
    
    const baseSize = Math.min(cellSizeByWidth, cellSizeByHeight);
    
    return baseSize * cellSizeMultiplier;
  };

  const calculateLetterSize = (cellSize: number) => {
    const baseLetterSize = cellSize * 0.6;
    const cappedMultiplier = Math.min(letterSizeMultiplier, MAX_LETTER_SIZE);
    return baseLetterSize * cappedMultiplier;
  };

  const getVerticalOffset = (offset: number) => {
    const maxAllowedOffset = Math.min(MAX_OFFSET, (contentHeight / 6) / 10);
    return Math.max(-maxAllowedOffset, Math.min(offset * 10, maxAllowedOffset * 10));
  };

  return {
    titleSizeMultiplier,
    setTitleSizeMultiplier,
    subtitleSizeMultiplier,
    setSubtitleSizeMultiplier,
    instructionSizeMultiplier,
    setInstructionSizeMultiplier,
    cellSizeMultiplier,
    setCellSizeMultiplier,
    letterSizeMultiplier,
    setLetterSizeMultiplier,
    wordListSizeMultiplier,
    setWordListSizeMultiplier,
    fontSizes,
    calculateGridCellSize,
    calculateLetterSize,
    getVerticalOffset,
  };
}
