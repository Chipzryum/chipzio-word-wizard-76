
import { useState } from "react";
import { Link } from "react-router-dom";
import { Download, Book } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  validateAndProcessInput,
  generateWordSearch,
  type PuzzleGrid
} from "@/utils/wordSearchUtils";

const WordSearch = () => {
  const [words, setWords] = useState<string[]>([]);
  const [dimension, setDimension] = useState(15);
  const [showAnswers, setShowAnswers] = useState(false);
  const [puzzle, setPuzzle] = useState<PuzzleGrid | null>(null);
  const { toast } = useToast();

  const generatePuzzle = () => {
    try {
      // Validate input
      const validationResult = validateAndProcessInput(words.join('\n'), dimension);
      
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

      // Generate puzzle
      const newPuzzle = generateWordSearch(validationResult.words, dimension);
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

  const highlightWord = (placement: WordPlacement) => {
    const { startPos, direction, length } = placement;
    const points: { x: number; y: number }[] = [];
    
    // Calculate all points for the word
    for (let i = 0; i < length; i++) {
      points.push({
        x: startPos.x + i * direction.x,
        y: startPos.y + i * direction.y
      });
    }
    
    // Calculate oval dimensions
    const minX = Math.min(...points.map(p => p.x)) - 0.5;
    const maxX = Math.max(...points.map(p => p.x)) + 0.5;
    const minY = Math.min(...points.map(p => p.y)) - 0.5;
    const maxY = Math.max(...points.map(p => p.y)) + 0.5;
    
    const width = maxX - minX;
    const height = maxY - minY;
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    
    return (
      <ellipse
        cx={`${centerX * 100 / dimension}%`}
        cy={`${centerY * 100 / dimension}%`}
        rx={`${(width * 100 / dimension) / 2}%`}
        ry={`${(height * 100 / dimension) / 2}%`}
        className="fill-none stroke-red-500 stroke-2 opacity-50"
        style={{ transform: 'rotateX(0deg)' }}
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

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Grid Size: {dimension}x{dimension}
                  </label>
                  <input
                    type="range"
                    min="7"
                    max="19"
                    value={dimension}
                    onChange={(e) => setDimension(parseInt(e.target.value))}
                    className="w-full"
                  />
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

              <div className="aspect-square bg-white/50 rounded-lg flex items-center justify-center border relative">
                {puzzle ? (
                  <div className="grid h-full w-full place-items-center relative">
                    {/* SVG overlay for answer highlights */}
                    {showAnswers && (
                      <svg className="absolute inset-0 w-full h-full">
                        {puzzle.wordPlacements.map((placement, index) => (
                          <g key={`highlight-${index}`}>
                            {highlightWord(placement)}
                          </g>
                        ))}
                      </svg>
                    )}
                    {/* Grid display */}
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
                  <p className="text-muted-foreground">
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
