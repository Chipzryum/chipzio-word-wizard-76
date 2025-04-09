
import { useState } from "react";

export function usePuzzleElements() {
  const [showTitle, setShowTitle] = useState(true);
  const [showSubtitle, setShowSubtitle] = useState(true);
  const [showInstruction, setShowInstruction] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [showWordList, setShowWordList] = useState(true);

  const [titleOffset, setTitleOffset] = useState(0);
  const [subtitleOffset, setSubtitleOffset] = useState(0);
  const [instructionOffset, setInstructionOffset] = useState(0);
  const [gridOffset, setGridOffset] = useState(0);
  const [wordListOffset, setWordListOffset] = useState(0);

  const [positioningElement, setPositioningElement] = useState<string | null>(null);

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

  const getPositionValue = (offset: number) => {
    if (offset === 0) return '0';
    return offset > 0 ? `+${offset}` : `${offset}`;
  };

  return {
    showTitle,
    setShowTitle,
    showSubtitle,
    setShowSubtitle,
    showInstruction,
    setShowInstruction,
    showGrid,
    setShowGrid,
    showWordList,
    setShowWordList,
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
    togglePositioning,
    moveElement,
    getPositionValue,
  };
}
