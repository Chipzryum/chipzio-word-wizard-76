
import { useState } from "react";
import { Link } from "react-router-dom";
import { Download, Book } from "lucide-react";

const WordSearch = () => {
  const [words, setWords] = useState<string[]>([]);
  const [dimension, setDimension] = useState(15);
  const [showAnswers, setShowAnswers] = useState(false);
  const [puzzle, setPuzzle] = useState<string[][]>([]);

  const generatePuzzle = () => {
    // TODO: Implement puzzle generation
  };

  const downloadPuzzle = () => {
    // TODO: Implement puzzle download
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container py-6">
          <nav className="flex items-center gap-4">
            <Link to="/" className="logo-gradient text-xl">
              Chipzio
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
                    min="8"
                    max="25"
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
                    disabled={!puzzle.length}
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
                >
                  {showAnswers ? "Hide Answers" : "Show Answers"}
                </button>
              </div>

              <div className="aspect-square bg-white/50 rounded-lg flex items-center justify-center border">
                {puzzle.length ? (
                  "Puzzle will appear here"
                ) : (
                  <p className="text-muted-foreground">
                    Generate a puzzle to see preview
                  </p>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WordSearch;
