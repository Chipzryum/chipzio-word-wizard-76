
import React from "react";
import { CombinedPuzzleGrid } from "./DownloadPuzzleDialog";

interface MultiPuzzleGridProps {
  puzzles: CombinedPuzzleGrid[];
  activePuzzleIndex: number;
  onSelectPuzzle: (index: number) => void;
}

export const MultiPuzzleGrid: React.FC<MultiPuzzleGridProps> = ({
  puzzles,
  activePuzzleIndex,
  onSelectPuzzle,
}) => {
  if (puzzles.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto p-2">
      {puzzles.map((puzzle, index) => (
        <div
          key={index}
          onClick={() => onSelectPuzzle(index)}
          className={`relative cursor-pointer border-2 ${
            activePuzzleIndex === index ? "border-primary" : "border-gray-300"
          } rounded-md overflow-hidden`}
        >
          <div className="absolute top-0 left-0 bg-primary text-primary-foreground px-2 py-1 text-xs font-medium rounded-br-md">
            Page {index + 1}
          </div>
          
          <div className="p-4 bg-white">
            {/* Simplified grid preview */}
            <div className="grid place-items-center">
              <div className="grid grid-cols-5 gap-[2px] scale-75 origin-center">
                {puzzle.grid.slice(0, 5).map((row, rowIndex) => (
                  <div key={rowIndex} className="flex">
                    {row.slice(0, 5).map((cell, cellIndex) => (
                      <div
                        key={`${rowIndex}-${cellIndex}`}
                        className="w-4 h-4 flex items-center justify-center text-[6px] border border-gray-300"
                      >
                        {cell && cell !== " " ? cell : ""}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
