
import { useState, useEffect } from "react";
import { CombinedPuzzleGrid } from "../types";

export function usePuzzlePages(
  puzzles: CombinedPuzzleGrid[],
  includeSolution: boolean
) {
  const [displayPages, setDisplayPages] = useState<any[]>([]);
  const [activePuzzleIndex, setActivePuzzleIndex] = useState(0);

  useEffect(() => {
    if (puzzles.length > 0) {
      createDisplayPages(puzzles, includeSolution);
    }
  }, [puzzles, includeSolution]);

  const createDisplayPages = (puzzlesArray: CombinedPuzzleGrid[], includeSol: boolean) => {
    const pages = [];
    
    for (let i = 0; i < puzzlesArray.length; i++) {
      pages.push({
        puzzle: puzzlesArray[i],
        isAnswer: false,
        pageNumber: i + 1
      });
      
      if (includeSol) {
        pages.push({
          puzzle: puzzlesArray[i],
          isAnswer: true,
          pageNumber: i + 1
        });
      }
    }
    
    setDisplayPages(pages);
    setActivePuzzleIndex(0);
  };

  const handleSelectPuzzle = (index: number) => {
    if (index >= 0 && index < displayPages.length) {
      setActivePuzzleIndex(index);
    }
  };

  return {
    displayPages,
    activePuzzleIndex,
    handleSelectPuzzle
  };
}
