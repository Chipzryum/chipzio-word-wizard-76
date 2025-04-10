import { useState } from "react";
import { Link } from "react-router-dom";
import { Book } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  validateAndProcessInput,
  generateWordSearch,
  type PuzzleGrid,
} from "@/utils/wordSearchUtils";
import { DownloadPuzzleDialog } from "@/components/download-puzzle";
import { 
  WordInputSection, 
  PreviewSection, 
  SettingsSection 
} from "@/components/word-search";

const WordSearch = () => {
  const [words, setWords] = useState<string[]>([]);
  const [gridWidth, setGridWidth] = useState(15);
  const [gridHeight, setGridHeight] = useState(15);
  const [showAnswers, setShowAnswers] = useState(false);
  const [puzzle, setPuzzle] = useState<PuzzleGrid | null>(null);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  
  // Add state for multiple puzzles
  const [savedPuzzles, setSavedPuzzles] = useState<PuzzleGrid[]>([]);
  const [activePuzzleIndex, setActivePuzzleIndex] = useState<number>(0);
  
  // Add state for including answer pages
  const [includeAnswers, setIncludeAnswers] = useState<"with" | "without">("without");
  
  const { toast } = useToast();

  const generatePuzzle = () => {
    try {
      const maxDimension = Math.max(gridWidth, gridHeight);
      const processedInput = words.join('\n');
      const validationResult = validateAndProcessInput(processedInput, maxDimension);

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

  const addToPdf = () => {
    if (!puzzle) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No puzzle to add. Please generate a puzzle first.",
      });
      return;
    }

    // Create the question puzzle
    const questionPuzzle = { ...puzzle, isQuestion: true };
    
    if (includeAnswers === "with") {
      // Create the answer puzzle
      const answerPuzzle = { ...puzzle, isAnswer: true };
      
      // Add both puzzles
      setSavedPuzzles(prev => [...prev, questionPuzzle, answerPuzzle]);
      
      // Set active index to the question puzzle we just added
      setActivePuzzleIndex(savedPuzzles.length);
      
      toast({
        title: "Added to PDF",
        description: `Added puzzle ${Math.ceil((savedPuzzles.length + 2) / 2)} with its answer page.`,
      });
    } else {
      // Only add the question puzzle
      setSavedPuzzles(prev => [...prev, questionPuzzle]);
      
      // Set active index to the puzzle we just added
      setActivePuzzleIndex(savedPuzzles.length);
      
      toast({
        title: "Added to PDF",
        description: `Added puzzle ${savedPuzzles.length + 1} to PDF.`,
      });
    }
  };

  const handleSelectPuzzle = (index: number) => {
    if (index >= 0 && index < savedPuzzles.length) {
      setActivePuzzleIndex(index);
      setPuzzle(savedPuzzles[index]);
      setShowAnswers(savedPuzzles[index].isAnswer || false);
    }
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
            <section className="glass-card rounded-xl p-6 animate-fade-up">
              <div className="flex items-center gap-3 mb-6">
                <Book className="h-6 w-6" />
                <h2 className="text-2xl font-semibold">Create your Word Search</h2>
              </div>

              <WordInputSection 
                setWords={setWords}
                gridWidth={gridWidth}
                setGridWidth={setGridWidth}
                gridHeight={gridHeight}
                setGridHeight={setGridHeight}
                generatePuzzle={generatePuzzle}
              />
              
              {puzzle && (
                <SettingsSection
                  puzzle={puzzle}
                  includeAnswers={includeAnswers}
                  setIncludeAnswers={setIncludeAnswers}
                  addToPdf={addToPdf}
                  setShowDownloadDialog={setShowDownloadDialog}
                  savedPuzzles={savedPuzzles}
                />
              )}
            </section>

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

              <PreviewSection 
                savedPuzzles={savedPuzzles}
                activePuzzleIndex={activePuzzleIndex}
                handleSelectPuzzle={handleSelectPuzzle}
                puzzle={puzzle}
                showAnswers={showAnswers}
                setShowAnswers={setShowAnswers}
              />
            </section>
          </div>
        </div>
      </main>

      <DownloadPuzzleDialog
        open={showDownloadDialog}
        onOpenChange={setShowDownloadDialog}
        puzzle={savedPuzzles.length > 0 ? savedPuzzles[activePuzzleIndex] : puzzle}
        puzzleType="wordsearch"
        allPuzzles={savedPuzzles.length > 0 ? savedPuzzles : puzzle ? [puzzle] : []}
      />
    </div>
  );
};

export default WordSearch;