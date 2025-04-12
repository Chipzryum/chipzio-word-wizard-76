
import { useState, useMemo } from "react";
import { 
  DEFAULT_TITLE_MULTIPLIER,
  DEFAULT_SUBTITLE_MULTIPLIER,
  DEFAULT_INSTRUCTION_MULTIPLIER,
  DEFAULT_CELL_MULTIPLIER,
  DEFAULT_LETTER_SIZE_MULTIPLIER,
  DEFAULT_WORDLIST_MULTIPLIER
} from "../constants";

export const usePuzzleSizes = (
  currentWidth: number, 
  currentHeight: number, 
  contentWidth: number, 
  contentHeight: number,
  puzzleGrid: any
) => {
  const [titleSizeMultiplier, setTitleSizeMultiplier] = useState(DEFAULT_TITLE_MULTIPLIER);
  const [subtitleSizeMultiplier, setSubtitleSizeMultiplier] = useState(DEFAULT_SUBTITLE_MULTIPLIER);
  const [instructionSizeMultiplier, setInstructionSizeMultiplier] = useState(DEFAULT_INSTRUCTION_MULTIPLIER);
  const [cellSizeMultiplier, setCellSizeMultiplier] = useState(DEFAULT_CELL_MULTIPLIER);
  const [letterSizeMultiplier, setLetterSizeMultiplier] = useState(DEFAULT_LETTER_SIZE_MULTIPLIER);
  const [wordListSizeMultiplier, setWordListSizeMultiplier] = useState(DEFAULT_WORDLIST_MULTIPLIER);

  const [showTitle, setShowTitle] = useState(true);
  const [showSubtitle, setShowSubtitle] = useState(true);
  const [showInstruction, setShowInstruction] = useState(true);
  const [showWordList, setShowWordList] = useState(true);
  const [showGrid, setShowGrid] = useState(true);

  const [titleOffset, setTitleOffset] = useState(0);
  const [subtitleOffset, setSubtitleOffset] = useState(0);
  const [instructionOffset, setInstructionOffset] = useState(0);
  const [gridOffset, setGridOffset] = useState(0);
  const [wordListOffset, setWordListOffset] = useState(0);

  const calculateFontSizes = () => {
    const sizeRatio = Math.sqrt((currentWidth * currentHeight) / (PAGE_SIZES.A4.width * PAGE_SIZES.A4.height));
    return {
      titleSize: Math.max(20, Math.min(48, Math.floor(36 * sizeRatio * titleSizeMultiplier))),
      subtitleSize: Math.max(14, Math.min(36, Math.floor(24 * sizeRatio * subtitleSizeMultiplier))),
      instructionSize: Math.max(8, Math.min(24, Math.floor(14 * sizeRatio * instructionSizeMultiplier))),
      wordListSize: Math.max(6, Math.min(28, Math.floor(12 * sizeRatio * wordListSizeMultiplier))),
    };
  };

  const fontSizes = useMemo(calculateFontSizes, [
    currentWidth, currentHeight, titleSizeMultiplier, subtitleSizeMultiplier,
    instructionSizeMultiplier, wordListSizeMultiplier
  ]);

  const calculateSpaceNeeded = () => {
    return [
      showTitle ? fontSizes.titleSize * titleSizeMultiplier + 10 : 0,
      showSubtitle ? fontSizes.subtitleSize * subtitleSizeMultiplier + 10 : 0,
      showInstruction ? fontSizes.instructionSize * instructionSizeMultiplier + 20 : 0,
      showWordList ? fontSizes.wordListSize * wordListSizeMultiplier * 3 : 0
    ].reduce((acc, val) => acc + val, 0);
  };

  const calculateGridCellSize = () => {
    if (!puzzleGrid || !puzzleGrid.grid) return 20;
    const { grid } = puzzleGrid;
    const gridWidth = grid[0].length;
    const gridHeight = grid.length;
    const reservedSpace = calculateSpaceNeeded() + 40;
    const availableHeight = contentHeight - reservedSpace;
    const baseSize = Math.min(contentWidth / gridWidth, availableHeight / gridHeight);
    return baseSize * cellSizeMultiplier;
  };

  const cellSize = useMemo(calculateGridCellSize, [
    puzzleGrid, contentWidth, contentHeight,
    cellSizeMultiplier, showTitle, showSubtitle, showInstruction, showWordList
  ]);

  const calculateLetterSize = () => {
    const baseLetterSize = cellSize * 0.6;
    return baseLetterSize * Math.min(letterSizeMultiplier, MAX_LETTER_SIZE);
  };

  const letterSize = useMemo(calculateLetterSize, [cellSize, letterSizeMultiplier]);

  return {
    titleSizeMultiplier, setTitleSizeMultiplier,
    subtitleSizeMultiplier, setSubtitleSizeMultiplier,
    instructionSizeMultiplier, setInstructionSizeMultiplier,
    cellSizeMultiplier, setCellSizeMultiplier,
    letterSizeMultiplier, setLetterSizeMultiplier,
    wordListSizeMultiplier, setWordListSizeMultiplier,
    showTitle, setShowTitle,
    showSubtitle, setShowSubtitle,
    showInstruction, setShowInstruction,
    showWordList, setShowWordList,
    showGrid, setShowGrid,
    titleOffset, setTitleOffset,
    subtitleOffset, setSubtitleOffset,
    instructionOffset, setInstructionOffset,
    gridOffset, setGridOffset,
    wordListOffset, setWordListOffset,
    fontSizes,
    cellSize,
    letterSize
  };
};

// Add missing import at the top to fix reference to PAGE_SIZES
import { PAGE_SIZES, MAX_LETTER_SIZE } from "../constants";
