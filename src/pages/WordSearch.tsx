
import { useState } from "react";
import { Link } from "react-router-dom";
import { Download, Book } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  validateAndProcessInput,
  generateWordSearch,
  type PuzzleGrid,
  type WordPlacement
} from "@/utils/wordSearchUtils";

const WordSearch = () => {
  const [words, setWords] = useState<string[]>([]);
  const [gridWidth, setGridWidth] = useState(15);
  const [gridHeight, setGridHeight] = useState(15);
  const [showAnswers, setShowAnswers] = useState(false);
  const [puzzle, setPuzzle] = useState<PuzzleGrid | null>(null);
  const { toast } = useToast();

  const generatePuzzle = () => {
    try {
      // Use the larger dimension for validation to ensure words fit
      const maxDimension = Math.max(gridWidth, gridHeight);
      const validationResult = validateAndProcessInput(words.join('\n'), maxDimension);
      
      if (!validationResult.isValid) {
        validationResult.errors.forEach(error => {
          toast({
            variant: "destructive",
            title: "Error",
            description: error,
          });
        });
        return;
      }

      // Generate puzzle using both width and height
      const newPuzzle = generateWordSearch(validationResult.words, gridWidth, gridHeight);
      setPuzzle(newPuzzle);
      
      toast({
        title: "Success",
        description: "Puzzle generated successfully!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate puzzle",
      });
    }
  };

  const downloadPuzzle = () => {
    toast({
      title: "Coming Soon",
      description: "Download functionality will be available soon!",
    });
  };

  // Helper function to check if a cell is part of a word
  const isPartOfWord = (x: number, y: number, placement: WordPlacement): boolean => {
    const { startPos, direction, length } = placement;
    for (let i = 0; i < length; i++) {
      const checkX = startPos.x + (direction.x * i);
      const checkY = startPos.y + (direction.y * i);
      if (checkX === x && checkY === y) {
        return true;
      }
    }
    return false;
  };

  // Helper function to get all word placements that include this cell
  const getWordPlacementsForCell = (x: number, y: number): WordPlacement[] => {
    if (!puzzle || !showAnswers) return [];
    return puzzle.wordPlacements.filter(placement => isPartOfWord(x, y, placement));
  };

  // Helper function to determine if this cell is the start of a word
  const isStartOfWord = (x: number, y: number, placement: WordPlacement): boolean => {
    return placement.startPos.x === x && placement.startPos.y === y;
  };

  // Helper function to determine if this cell is the end of a word
  const isEndOfWord = (x: number, y: number, placement: WordPlacement): boolean => {
    const endX = placement.startPos.x + (placement.direction.x * (placement.length - 1));
    const endY = placement.startPos.y + (placement.direction.y * (placement.length - 1));
    return x === endX && y === endY;
  };

  // Helper function to get the border radius classes for a cell
  const getCellBorderRadius = (x: number, y: number, placement: WordPlacement): string => {
    if (placement.length === 1) return "rounded-full";
    
    if (isStartOfWord(x, y, placement)) {
      if (placement.direction.x === 1 && placement.direction.y === 0) return "rounded-l-full";
      if (placement.direction.x === -1 && placement.direction.y === 0) return "rounded-r-full";
      if (placement.direction.x === 0 && placement.direction.y === 1) return "rounded-t-full";
      if (placement.direction.x === 0 && placement.direction.y === -1) return "rounded-b-full";
      if (placement.direction.x === 1 && placement.direction.y === 1) return "rounded-tl-full";
      if (placement.direction.x === -1 && placement.direction.y === 1) return "rounded-tr-full";
      if (placement.direction.x === 1 && placement.direction.y === -1) return "rounded-bl-full";
      if (placement.direction.x === -1 && placement.direction.y === -1) return "rounded-br-full";
    }
    
    if (isEndOfWord(x, y, placement)) {
      if (placement.direction.x === 1 && placement.direction.y === 0) return "rounded-r-full";
      if (placement.direction.x === -1 && placement.direction.y === 0) return "rounded-l-full";
      if (placement.direction.x === 0 && placement.direction.y === 1) return "rounded-b-full";
      if (placement.direction.x === 0 && placement.direction.y === -1) return "rounded-t-full";
      if (placement.direction.x === 1 && placement.direction.y === 1) return "rounded-br-full";
      if (placement.direction.x === -1 && placement.direction.y === 1) return "rounded-bl-full";
      if (placement.direction.x === 1 && placement.direction.y === -1) return "rounded-tr-full";
      if (placement.direction.x === -1 && placement.direction.y === -1) return "rounded-tl-full";
    }
    
    return "";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container py-6">
          <nav className="flex items-center gap-4">
            <Link to="/" className="logo-gradient text-xl">
              <strong>Chipzio</strong>
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link
              to="/kids-tools"
              className="text-muted-foreground hover:text-foreground"
            >
              Kids Book Tools
            </Link>
            <span className="text-muted-foreground">/</span>
            <span>Word Search Generator</span>
          </nav>
        </div>
      </header>

      <main className="flex-1 py-12">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <section className="glass-card rounded-xl p-6 animate-fade-up">
              <div className="flex items-center gap-3 mb-6">
                <Book className="h-6 w-6" />
                <h2 className="text-2xl font-semibold">Create your Word Search</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Enter your words (one per line)
                  </label>
                  <textarea
                    className="w-full h-40 p-3 rounded-lg border bg-white/50"
                    placeholder="Example:
HELLO
WORLD
PUZZLE"
                    onChange={(e) => setWords(e.target.value.split("\n"))}
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Grid Width: {gridWidth}
                    </label>
                    <input
                      type="range"
                      min="7"
                      max="19"
                      value={gridWidth}
                      onChange={(e) => setGridWidth(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Grid Height: {gridHeight}
                    </label>
                    <input
                      type="range"
                      min="7"
                      max="19"
                      value={gridHeight}
                      onChange={(e) => setGridHeight(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={generatePuzzle}
                    className="flex-1 bg-primary text-primary-foreground hover:opacity-90 transition rounded-lg px-4 py-2"
                  >
                    Generate Puzzle
                  </button>
                  <button
                    onClick={downloadPuzzle}
                    className="flex items-center justify-center gap-2 bg-secondary text-secondary-foreground hover:opacity-90 transition rounded-lg px-4 py-2"
                    disabled={!puzzle}
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                </div>
              </div>
            </section>

            {/* Preview Section */}
            <section className="glass-card rounded-xl p-6 animate-fade-up">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Preview</h2>
                <button
                  onClick={() => setShowAnswers(!showAnswers)}
                  className="text-sm underline"
                  disabled={!puzzle}
                >
                  {showAnswers ? "Hide Answers" : "Show Answers"}
                </button>
              </div>

              <div className="bg-white/50 rounded-lg flex items-center justify-center border">
                {puzzle ? (
                  <div className="grid place-items-center w-full p-4">
                    {puzzle.grid.map((row, y) => (
                      <div key={y} className="flex">
                        {row.map((letter, x) => {
                          const wordPlacements = getWordPlacementsForCell(x, y);
                          return (
                            <div
                              key={`${x}-${y}`}
                              className="relative"
                            >
                              {wordPlacements.map((placement, index) => (
                                <div
                                  key={index}
                                  className={`absolute inset-0.5 border-2 border-red-500 transition-opacity ${
                                    showAnswers ? "opacity-100" : "opacity-0"
                                  } ${getCellBorderRadius(x, y, placement)}`}
                                />
                              ))}
                              <div
                                className="w-8 h-8 flex items-center justify-center font-medium"
                              >
                                {letter}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground p-8">
                    Generate a puzzle to see preview
                  </p>
                )}
              </div>
              
              {puzzle && (
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Words to find:</h3>
                  <div className="flex flex-wrap gap-2">
                    {puzzle.wordPlacements.map(({ word }) => (
                      <span
                        key={word}
                        className="px-2 py-1 bg-secondary rounded-md text-sm"
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WordSearch;
