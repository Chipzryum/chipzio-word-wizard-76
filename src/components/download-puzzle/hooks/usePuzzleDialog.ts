import { useState, useEffect } from "react";
import { PageSize, Unit, CombinedPuzzleGrid } from "../types";
import { 
  PAGE_SIZES,
  DEFAULT_TITLE_MULTIPLIER,
  DEFAULT_SUBTITLE_MULTIPLIER,
  DEFAULT_INSTRUCTION_MULTIPLIER,
  DEFAULT_CELL_MULTIPLIER,
  DEFAULT_LETTER_SIZE_MULTIPLIER,
  DEFAULT_WORDLIST_MULTIPLIER
} from "../constants";

interface UsePuzzleDialogProps {
  puzzle: CombinedPuzzleGrid;
  defaultValues?: {
    title: string;
    subtitle: string;
    instruction: string;
  };
  allPuzzles?: CombinedPuzzleGrid[];
}

export const usePuzzleDialog = ({
  puzzle,
  defaultValues = {
    title: "Puzzle",
    subtitle: "educational puzzle",
    instruction: "Can you solve the puzzle?"
  },
  allPuzzles = []
}: UsePuzzleDialogProps) => {
  // Content state
  const [title, setTitle] = useState(defaultValues.title);
  const [subtitle, setSubtitle] = useState(defaultValues.subtitle);
  const [instruction, setInstruction] = useState(defaultValues.instruction);
  
  // Visibility state
  const [showTitle, setShowTitle] = useState(true);
  const [showSubtitle, setShowSubtitle] = useState(true);
  const [showInstruction, setShowInstruction] = useState(true);
  const [showWordList, setShowWordList] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [includeSolution, setIncludeSolution] = useState(true);

  // Page size state
  const [selectedSize, setSelectedSize] = useState<PageSize>("A4");
  const [selectedUnit, setSelectedUnit] = useState<Unit>("Points");
  const [customWidth, setCustomWidth] = useState(PAGE_SIZES.A4.width);
  const [customHeight, setCustomHeight] = useState(PAGE_SIZES.A4.height);

  // Size multipliers
  const [titleSizeMultiplier, setTitleSizeMultiplier] = useState(DEFAULT_TITLE_MULTIPLIER);
  const [subtitleSizeMultiplier, setSubtitleSizeMultiplier] = useState(DEFAULT_SUBTITLE_MULTIPLIER);
  const [instructionSizeMultiplier, setInstructionSizeMultiplier] = useState(DEFAULT_INSTRUCTION_MULTIPLIER);
  const [cellSizeMultiplier, setCellSizeMultiplier] = useState(DEFAULT_CELL_MULTIPLIER);
  const [letterSizeMultiplier, setLetterSizeMultiplier] = useState(DEFAULT_LETTER_SIZE_MULTIPLIER);
  const [wordListSizeMultiplier, setWordListSizeMultiplier] = useState(DEFAULT_WORDLIST_MULTIPLIER);

  // Position offsets
  const [titleOffset, setTitleOffset] = useState(0);
  const [subtitleOffset, setSubtitleOffset] = useState(0);
  const [instructionOffset, setInstructionOffset] = useState(0);
  const [gridOffset, setGridOffset] = useState(0);
  const [wordListOffset, setWordListOffset] = useState(0);

  // Other state
  const [positioningElement, setPositioningElement] = useState<string | null>(null);
  const [puzzles, setPuzzles] = useState<CombinedPuzzleGrid[]>([]);

  useEffect(() => {
    if (allPuzzles && allPuzzles.length > 0) {
      setPuzzles(allPuzzles);
    } else if (puzzle) {
      setPuzzles([puzzle]);
    }
  }, [puzzle, allPuzzles]);

  const handleUnitChange = (unit: Unit) => {
    setSelectedUnit(unit);
  };

  const togglePositioning = (element: string | null) => {
    setPositioningElement(element);
  };

  const moveElement = (element: string, direction: 'up' | 'down') => {
    const amount = 1;
    const change = direction === 'up' ? -amount : amount;
    
    switch (element) {
      case 'title':
        setTitleOffset(prev => prev + change);
        break;
      case 'subtitle':
        setSubtitleOffset(prev => prev + change);
        break;
      case 'instruction':
        setInstructionOffset(prev => prev + change);
        break;
      case 'grid':
        setGridOffset(prev => prev + change);
        break;
      case 'wordList':
        setWordListOffset(prev => prev + change);
        break;
      default:
        break;
    }
  };

  const handleSizeChange = (size: PageSize) => {
    setSelectedSize(size);
    if (size !== "Custom") {
      setCustomWidth(PAGE_SIZES[size].width);
      setCustomHeight(PAGE_SIZES[size].height);
    }
  };

  const handleDimensionChange = (dimension: "width" | "height", value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    const unitValue = dimension === "width" 
      ? setCustomWidth
      : setCustomHeight;
      
    unitValue(numValue);
    setSelectedSize("Custom");
  };

  const formatSliderValue = (value: number) => {
    return `${(value * 100).toFixed(0)}%`;
  };

  const getPositionValue = (offset: number) => {
    if (offset === 0) return '0';
    return offset > 0 ? `+${offset}` : `${offset}`;
  };

  return {
    title,
    setTitle,
    subtitle,
    setSubtitle,
    instruction,
    setInstruction,
    showTitle,
    setShowTitle,
    showSubtitle,
    setShowSubtitle,
    showInstruction,
    setShowInstruction,
    showWordList,
    setShowWordList,
    showGrid,
    setShowGrid,
    includeSolution,
    setIncludeSolution,
    selectedSize,
    selectedUnit,
    customWidth,
    customHeight,
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
    titleOffset,
    setTitleOffset,
    subtitleOffset,
    setSubtitleOffset,
    instructionOffset,
    setInstructionOffset,
    gridOffset,
    setGridOffset,
    wordListOffset,
    setWordListOffset,
    positioningElement,
    puzzles,
    handleUnitChange,
    togglePositioning,
    moveElement,
    handleSizeChange,
    handleDimensionChange,
    formatSliderValue,
    getPositionValue
  };
};
