// Validation types and interfaces
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  words: string[];
}

export interface WordPlacement {
  word: string;
  startPos: { x: number; y: number };
  direction: { x: number; y: number };
  length: number;
}

export interface PuzzleGrid {
  grid: string[][];
  wordPlacements: WordPlacement[];
}

// Core validation function
export function validateAndProcessInput(rawInput: string, gridSize: number): ValidationResult {
  const words = rawInput
    .trim()
    .toUpperCase()
    .split('\n')
    .map(w => w.trim())
    .filter(w => w.length > 0);

  const validationResult: ValidationResult = {
    isValid: true,
    errors: [],
    words: []
  };

  // Check for maximum word length
  words.forEach(word => {
    if (word.length > gridSize) {
      validationResult.isValid = false;
      validationResult.errors.push(
        `Word "${word}" is too long for current grid size (${gridSize}x${gridSize})`
      );
    }

    // Check for valid characters (now allowing I)
    if (!/^[A-Z]+$/.test(word)) {
      validationResult.isValid = false;
      validationResult.errors.push(
        `Word "${word}" contains invalid characters. Only letters A-Z are allowed.`
      );
    }
  });

  // Check for duplicate words
  const uniqueWords = new Set(words);
  if (uniqueWords.size !== words.length) {
    validationResult.isValid = false;
    validationResult.errors.push("Duplicate words found. Please remove duplicates.");
  }

  validationResult.words = Array.from(uniqueWords);
  return validationResult;
}

// Puzzle generation functions
export function generatePuzzleGrid(width: number, height: number): PuzzleGrid {
  return {
    grid: Array(height).fill(null).map(() => Array(width).fill(null)),
    wordPlacements: []
  };
}

export function canPlaceWord(
  grid: string[][],
  word: string,
  pos: { x: number; y: number },
  dir: { x: number; y: number }
): boolean {
  const height = grid.length;
  const width = grid[0].length;
  let { x, y } = pos;

  // Check if word fits within grid bounds
  const endX = x + (word.length - 1) * dir.x;
  const endY = y + (word.length - 1) * dir.y;
  if (endX < 0 || endX >= width || endY < 0 || endY >= height) {
    return false;
  }

  // Check if placement conflicts with existing letters
  for (let i = 0; i < word.length; i++) {
    const currentCell = grid[y][x];
    if (currentCell !== null && currentCell !== word[i]) {
      return false;
    }
    x += dir.x;
    y += dir.y;
  }

  return true;
}

export function generateWordSearch(validatedWords: string[], width: number, height: number): PuzzleGrid {
  const puzzle = generatePuzzleGrid(width, height);
  const directions = [
    { x: 1, y: 0 },   // right
    { x: 0, y: 1 },   // down
    { x: 1, y: 1 },   // diagonal right-down
    { x: 0, y: -1 },  // up
    { x: 1, y: -1 }   // diagonal right-up
  ];

  // Sort words by length (longest first)
  const sortedWords = [...validatedWords].sort((a, b) => b.length - a.length);

  // Try to place each word
  for (const word of sortedWords) {
    let placed = false;
    let attempts = 0;
    const maxAttempts = width * height * directions.length;

    while (!placed && attempts < maxAttempts) {
      const pos = {
        x: Math.floor(Math.random() * width),
        y: Math.floor(Math.random() * height)
      };
      const direction = directions[Math.floor(Math.random() * directions.length)];

      if (canPlaceWord(puzzle.grid, word, pos, direction)) {
        // Place the word
        let { x, y } = pos;
        for (let i = 0; i < word.length; i++) {
          puzzle.grid[y][x] = word[i];
          x += direction.x;
          y += direction.y;
        }

        // Store word placement
        puzzle.wordPlacements.push({
          word,
          startPos: { ...pos },
          direction,
          length: word.length
        });
        placed = true;
      }

      attempts++;
    }

    if (!placed) {
      throw new Error(
        `Unable to place word "${word}" after ${maxAttempts} attempts. Try increasing grid size or reducing number of words.`
      );
    }
  }

  // Fill empty spaces with random letters
  fillEmptySpaces(puzzle.grid);

  return puzzle;
}

function fillEmptySpaces(grid: string[][]): void {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === null) {
        grid[y][x] = letters[Math.floor(Math.random() * letters.length)];
      }
    }
  }
}

// Export puzzle as an image
export function exportPuzzleAsImage(puzzle: PuzzleGrid, filename: string): void {
  // Create a canvas element
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');
  
  const cellSize = 32; // Size of each cell in pixels
  const padding = 40; // Padding around the grid
  const wordListPadding = 20; // Padding between grid and word list
  const wordListFontSize = 16;
  
  const gridWidth = puzzle.grid[0].length * cellSize;
  const gridHeight = puzzle.grid.length * cellSize;
  
  // Calculate word list dimensions
  const wordsPerRow = 3;
  const wordRows = Math.ceil(puzzle.wordPlacements.length / wordsPerRow);
  const wordListHeight = wordRows * (wordListFontSize + 10);
  
  // Set canvas dimensions
  canvas.width = Math.max(gridWidth, wordsPerRow * 120) + (padding * 2);
  canvas.height = gridHeight + wordListHeight + padding * 2 + wordListPadding;
  
  // Fill background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw title
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Word Search Puzzle', canvas.width / 2, padding / 2);
  
  // Draw grid
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 1;
  
  const startX = (canvas.width - gridWidth) / 2;
  const startY = padding;
  
  // Draw cells
  for (let y = 0; y < puzzle.grid.length; y++) {
    for (let x = 0; x < puzzle.grid[y].length; x++) {
      const cellX = startX + (x * cellSize);
      const cellY = startY + (y * cellSize);
      
      // Draw cell border
      ctx.strokeRect(cellX, cellY, cellSize, cellSize);
      
      // Draw letter
      ctx.font = 'bold 18px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        puzzle.grid[y][x],
        cellX + cellSize / 2,
        cellY + cellSize / 2
      );
    }
  }
  
  // Draw word list
  ctx.font = `${wordListFontSize}px Arial`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  
  const wordListY = startY + gridHeight + wordListPadding;
  const wordsTitle = "Words to find:";
  ctx.font = 'bold 18px Arial';
  ctx.fillText(wordsTitle, startX, wordListY);
  
  ctx.font = `${wordListFontSize}px Arial`;
  for (let i = 0; i < puzzle.wordPlacements.length; i++) {
    const rowIndex = Math.floor(i / wordsPerRow);
    const colIndex = i % wordsPerRow;
    
    const wordX = startX + (colIndex * (canvas.width - padding * 2) / wordsPerRow);
    const wordY = wordListY + 30 + (rowIndex * (wordListFontSize + 10));
    
    ctx.fillText(puzzle.wordPlacements[i].word, wordX, wordY);
  }
  
  // Export as image
  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = `${filename}.png`;
  link.href = dataUrl;
  link.click();
}
