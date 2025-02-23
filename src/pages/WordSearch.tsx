
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

  // Component for drawing strike-through lines
  const StrikeLine = ({ placement }: { placement: WordPlacement }) => {
    const { startPos, direction, length } = placement;
    
    // Calculate the angle based on direction
    let angle = 0;
    if (direction.x === 0 && direction.y === 1) angle = 90; // vertical down
    if (direction.x === 0 && direction.y === -1) angle = 90; // vertical up
    if (direction.x === 1 && direction.y === 1) angle = 45; // diagonal down-right
    if (direction.x === 1 && direction.y === -1) angle = -45; // diagonal up-right

    // Calculate line length (2rem per cell)
    const lineLength = `${length * 2}rem`;

    return (
      <div
        className="absolute transition-opacity duration-200"
        style={{
          opacity: showAnswers ? 1 : 0,
          left: `${startPos.x * 2}rem`,
          top: `${startPos.y * 2}rem`,
          width: lineLength,
          height: '3px',
          backgroundColor: 'rgba(239, 68, 68, 0.75)', // red-500 with opacity
          transform: `translateY(1rem) rotate(${angle}deg)`,
          transformOrigin: '0 center',
          zIndex: 10
        }}
      />
    );
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
                  <div className="relative grid place-items-center w-full p-4">
                    {/* Strike-through lines layer */}
                    {puzzle.wordPlacements.map((placement, index) => (
                      <StrikeLine key={`strike-${index}`} placement={placement} />
                    ))}
                    {/* Letters grid layer */}
                    {puzzle.grid.map((row, y) => (
                      <div key={y} className="flex">
                        {row.map((letter, x) => (
                          <div
                            key={`${x}-${y}`}
                            className="w-8 h-8 flex items-center justify-center font-medium"
                          >
                            {letter}
                          </div>
                        ))}
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
