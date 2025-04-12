
import { useState, useEffect } from "react";
import { CombinedPuzzleGrid } from "../types";

export const usePuzzlePages = (
  allPuzzles: CombinedPuzzleGrid[] = [], 
  puzzle: CombinedPuzzleGrid, 
  includeSolution: boolean
) => {
  const [puzzles, setPuzzles] = useState<CombinedPuzzleGrid[]>([]);
  const [displayPages, setDisplayPages] = useState<any[]>([]);
  const [activePuzzleIndex, setActivePuzzleIndex] = useState(0);

  // Initialize puzzle pages when dialog opens
  useEffect(() => {
    // Initialize with provided puzzles
    const puzzlesArray = allPuzzles.length ? allPuzzles : [puzzle];
    
    // Sort puzzles to have questions first, then answers
    const questionPuzzles = puzzlesArray.filter(p => !p.isAnswer);
    const answerPuzzles = puzzlesArray.filter(p => p.isAnswer);
    const orderedPuzzles = [...questionPuzzles, ...answerPuzzles];
    
    setPuzzles(orderedPuzzles);
    createDisplayPages(orderedPuzzles);
    setActivePuzzleIndex(0);
  }, [puzzle, allPuzzles]);

  // Update display pages when includeSolution changes
  useEffect(() => {
    if (puzzles.length > 0) {
      createDisplayPages(puzzles);
      setActivePuzzleIndex(0);
    }
  }, [includeSolution]);

  // Modified function to properly create display pages
  const createDisplayPages = (puzzlesArray: CombinedPuzzleGrid[]) => {
    // Filter puzzles by type
    const questionPuzzles = puzzlesArray.filter(p => !p.isAnswer);
    const answerPuzzles = puzzlesArray.filter(p => p.isAnswer);
    
    // Create separate page numbering for questions and answers
    const questionPages = questionPuzzles.map((puzzle, index) => ({
      puzzle,
      isAnswer: false,
      pageNumber: index + 1
    }));
    
    const answerPages = answerPuzzles.map((puzzle, index) => ({
      puzzle,
      isAnswer: true,
      pageNumber: index + 1
    }));
    
    // Combine with questions first, then answers
    const pages = [...questionPages, ...answerPages];
    
    setDisplayPages(pages);
  };

  const handleSelectPuzzle = (index: number) => {
    if (index >= 0 && index < displayPages.length) {
      setActivePuzzleIndex(index);
    }
  };

  return {
    puzzles,
    displayPages,
    activePuzzleIndex,
    handleSelectPuzzle
  };
};
