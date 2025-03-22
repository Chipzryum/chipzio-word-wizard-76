
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Grid2X2,
  Download,
  RotateCw,
  Settings,
  Info,
  X,
  Sparkles,
  Eye,
  AlertTriangle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { generateCrossword, prepareWordsForCrossword, CrosswordGrid, isWordStart } from "@/utils/crosswordUtils";
import { DEFAULT_VALUES, PAGE_SIZES, PAGE_SIZE_OPTIONS } from "@/components/download-puzzle/constants";
import { useToast } from "@/components/ui/use-toast";
import { DownloadPuzzleDialog } from "@/components/download-puzzle";

const Crossword = () => {
  const { toast } = useToast();
  const [words, setWords] = useState<string[]>([]);
  const [inputWord, setInputWord] = useState("");
  const [gridSize, setGridSize] = useState(15);
  const [puzzle, setPuzzle] = useState<CrosswordGrid | null>(null);
  const [customWords, setCustomWords] = useState("");
  const [showSolution, setShowSolution] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTab, setSelectedTab] = useState("word-input");
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);

  // Generate the crossword puzzle
  const generatePuzzle = useCallback(() => {
    if (words.length < 3) {
      toast({
        title: "Not enough words",
        description: "Please add at least 3 words to generate a crossword puzzle.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setPuzzle(null);

    // Use a slight delay to allow the UI to update
    setTimeout(() => {
      try {
        // Prepare words for crossword generation
        const processedWords = prepareWordsForCrossword(words);
        
        // Generate the crossword puzzle
        const newPuzzle = generateCrossword(processedWords, gridSize, gridSize);
        
        if (newPuzzle) {
          setPuzzle(newPuzzle);
          toast({
            title: "Crossword Generated",
            description: `Created with ${newPuzzle.wordPlacements.length} out of ${words.length} words.`,
          });
        } else {
          toast({
            title: "Failed to generate crossword",
            description: "Try adding more words or adjusting the grid size.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error generating crossword:", error);
        toast({
          title: "Error",
          description: "Failed to generate the crossword. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsGenerating(false);
      }
    }, 100);
  }, [words, gridSize, toast]);

  // Add a word to the list
  const addWord = () => {
    const trimmedWord = inputWord.trim();
    
    if (!trimmedWord) {
      return;
    }
    
    if (trimmedWord.length < 3) {
      toast({
        title: "Word too short",
        description: "Words must be at least 3 characters long.",
        variant: "destructive",
      });
      return;
    }
    
    if (trimmedWord.includes(" ")) {
      toast({
        title: "Invalid word",
        description: "Words cannot contain spaces. Add each word separately.",
        variant: "destructive",
      });
      return;
    }
    
    if (words.includes(trimmedWord.toUpperCase())) {
      toast({
        title: "Duplicate word",
        description: "This word is already in the list.",
        variant: "destructive",
      });
      return;
    }
    
    setWords([...words, trimmedWord]);
    setInputWord("");
  };

  // Remove a word from the list
  const removeWord = (word: string) => {
    setWords(words.filter((w) => w !== word));
  };

  // Process multiple words from textarea
  const processMultipleWords = () => {
    const newWords = customWords
      .split(/[\n,;]/) // Split by newline, comma, or semicolon
      .map((word) => word.trim())
      .filter((word) => word.length >= 3 && !word.includes(" "))
      .filter((word) => !words.includes(word.toUpperCase()));

    if (newWords.length > 0) {
      setWords([...words, ...newWords]);
      setCustomWords("");
      toast({
        title: "Words Added",
        description: `${newWords.length} new word(s) added to the list.`,
      });
    } else {
      toast({
        title: "No valid words",
        description: "Make sure words are at least 3 characters long and don't contain spaces.",
        variant: "destructive",
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addWord();
    }
  };

  // Clear all words
  const clearAllWords = () => {
    setWords([]);
    setCustomWords("");
    setPuzzle(null);
  };

  // Toggle solution display
  const toggleSolution = () => {
    setShowSolution(!showSolution);
  };

  // Default PDF properties for the crossword
  const defaultPDFProps = {
    title: "CROSSWORD PUZZLE",
    subtitle: "educational crossword",
    instruction: "Solve the crossword using the clues provided",
    ...DEFAULT_VALUES,
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
            <Link to="/kids-tools" className="hover:text-foreground/80">
              Kids Book Tools
            </Link>
            <span className="text-muted-foreground">/</span>
            <span>Crossword Generator</span>
          </nav>
        </div>
      </header>

      <main className="flex-1 py-8 container">
        <section className="text-center mb-8 animate-fade-down">
          <h1 className="text-4xl font-bold mb-2">Crossword Puzzle Generator</h1>
          <p className="text-lg text-muted-foreground">
            Create custom crossword puzzles for educational activities
          </p>
        </section>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Controls */}
          <div className="space-y-6 animate-fade-right">
            <Card className="p-6">
              <Tabs
                defaultValue="word-input"
                value={selectedTab}
                onValueChange={setSelectedTab}
                className="w-full"
              >
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="word-input">Word Input</TabsTrigger>
                  <TabsTrigger value="bulk-input">Bulk Input</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="word-input" className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={inputWord}
                      onChange={(e) => setInputWord(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Enter a word..."
                      className="flex-1"
                    />
                    <Button onClick={addWord}>Add</Button>
                  </div>

                  <div className="h-[200px] overflow-y-auto border rounded-md p-2">
                    {words.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <Info size={24} className="mb-2" />
                        <p>Add words to create your crossword puzzle</p>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {words.map((word, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-1 bg-secondary rounded-full px-3 py-1"
                          >
                            <span>{word}</span>
                            <button
                              onClick={() => removeWord(word)}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={clearAllWords}
                      disabled={words.length === 0}
                    >
                      Clear All
                    </Button>
                    <Button
                      onClick={generatePuzzle}
                      disabled={words.length < 3 || isGenerating}
                      className="gap-2"
                    >
                      {isGenerating ? (
                        <>
                          <RotateCw className="h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          Generate Crossword
                        </>
                      )}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="bulk-input" className="space-y-4">
                  <Textarea
                    value={customWords}
                    onChange={(e) => setCustomWords(e.target.value)}
                    placeholder="Enter multiple words separated by commas, semicolons, or new lines..."
                    className="h-[200px]"
                  />
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setCustomWords("")}
                      disabled={!customWords}
                    >
                      Clear
                    </Button>
                    <Button
                      onClick={processMultipleWords}
                      disabled={!customWords.trim()}
                    >
                      Add Words
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Grid Size: {gridSize}×{gridSize}
                      </label>
                      <Slider
                        value={[gridSize]}
                        onValueChange={(values) => setGridSize(values[0])}
                        min={8}
                        max={20}
                        step={1}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Larger grids can fit more words but may be harder to solve
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 mt-4">
                      <Checkbox
                        id="showSolution"
                        checked={showSolution}
                        onCheckedChange={() => toggleSolution()}
                      />
                      <label
                        htmlFor="showSolution"
                        className="text-sm font-medium cursor-pointer"
                      >
                        Show solution in preview
                      </label>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>

            {words.length > 0 && !puzzle && (
              <div className="text-center p-4 border border-yellow-200 bg-yellow-50 rounded-md text-yellow-800">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <AlertTriangle size={18} />
                  <span className="font-medium">Tip</span>
                </div>
                <p className="text-sm">
                  Click "Generate Crossword" to create your puzzle. The algorithm
                  works best with words that share common letters.
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Preview */}
          <div className="animate-fade-left">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Puzzle Preview</h3>
                {puzzle && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleSolution}
                      className="gap-1"
                    >
                      <Eye className="h-4 w-4" />
                      {showSolution ? "Hide Solution" : "Show Solution"}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setShowDownloadDialog(true)}
                      className="gap-1"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center min-h-[400px] bg-secondary/30 rounded-lg overflow-hidden">
                {!puzzle ? (
                  <div className="text-center p-6">
                    <Grid2X2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium mb-2">No puzzle yet</h3>
                    <p className="text-muted-foreground">
                      Add at least 3 words and click Generate to create a crossword
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center w-full h-full p-2">
                    {/* Crossword Preview */}
                    <div className="flex flex-col items-center overflow-auto w-full">
                      <div className="mb-2 text-sm font-medium text-muted-foreground">
                        {puzzle.wordPlacements.length} words placed (out of {words.length})
                      </div>
                      <div className="grid grid-flow-row gap-0 border border-black">
                        {puzzle.grid.map((row, i) => (
                          <div key={i} className="flex">
                            {row.map((cell, j) => {
                              const wordNumber = isWordStart(puzzle.wordPlacements, i, j);
                              const isEmpty = cell === '';
                              
                              return (
                                <div
                                  key={`${i}-${j}`}
                                  className={`flex items-center justify-center border border-gray-900 relative ${isEmpty ? 'bg-gray-900' : 'bg-white'}`}
                                  style={{
                                    width: '30px',
                                    height: '30px',
                                  }}
                                >
                                  {wordNumber !== null && (
                                    <span 
                                      className="absolute text-xs font-bold"
                                      style={{
                                        top: '1px',
                                        left: '1px',
                                      }}
                                    >
                                      {wordNumber}
                                    </span>
                                  )}
                                  {!isEmpty && showSolution && (
                                    <span>{cell}</span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {puzzle && (
              <div className="mt-4 grid md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <h3 className="font-medium mb-2">Across</h3>
                  <div className="max-h-[200px] overflow-y-auto text-sm">
                    {puzzle.wordPlacements
                      .filter((wp) => wp.direction === 'across')
                      .sort((a, b) => (a.number || 0) - (b.number || 0))
                      .map((wp, idx) => (
                        <div key={idx} className="mb-1">
                          <span className="font-medium">{wp.number}.</span> {wp.clue}
                        </div>
                      ))}
                  </div>
                </Card>
                
                <Card className="p-4">
                  <h3 className="font-medium mb-2">Down</h3>
                  <div className="max-h-[200px] overflow-y-auto text-sm">
                    {puzzle.wordPlacements
                      .filter((wp) => wp.direction === 'down')
                      .sort((a, b) => (a.number || 0) - (b.number || 0))
                      .map((wp, idx) => (
                        <div key={idx} className="mb-1">
                          <span className="font-medium">{wp.number}.</span> {wp.clue}
                        </div>
                      ))}
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Download Dialog */}
      {showDownloadDialog && puzzle && (
        <DownloadPuzzleDialog 
          open={showDownloadDialog}
          onOpenChange={setShowDownloadDialog}
          puzzle={{
            grid: puzzle.grid,
            wordPlacements: puzzle.wordPlacements,
            width: puzzle.width,
            height: puzzle.height
          }}
          defaultValues={defaultPDFProps}
          puzzleType="crossword"
          showSolution={showSolution}
          visualPreviewComponent="crossword"
        />
      )}
    </div>
  );
};

export default Crossword;
