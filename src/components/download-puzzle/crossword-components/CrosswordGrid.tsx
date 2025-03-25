
import React from 'react';
import { CrosswordGrid as CrosswordGridType, isWordStart } from "@/utils/crosswordUtils";

interface CrosswordGridProps {
  puzzle: CrosswordGridType;
  cellSize: number;
  letterSize: number;
  previewScaleFactor: number;
  showSolution: boolean;
  showBlackBoxes?: boolean;
}

export const CrosswordGridDisplay = ({
  puzzle,
  cellSize,
  letterSize,
  previewScaleFactor,
  showSolution,
  showBlackBoxes = true,
}: CrosswordGridProps) => {
  // Increase the effective cell size for better visibility
  const effectiveCellSize = cellSize * 1.2; // 20% increase in cell size

  return (
    <div className="overflow-auto max-h-[300px] max-w-full">
      {puzzle.grid.map((row, i) => (
        <div key={i} className="flex">
          {row.map((cell, j) => {
            const wordNumber = isWordStart(puzzle.wordPlacements, i, j);
            const isEmpty = cell === '';
            
            return (
              <div
                key={`${i}-${j}`}
                className={`flex items-center justify-center border border-gray-900 relative ${isEmpty && showBlackBoxes ? 'bg-black' : 'bg-white bg-opacity-60'}`}
                style={{
                  width: `${effectiveCellSize * previewScaleFactor}px`,
                  height: `${effectiveCellSize * previewScaleFactor}px`,
                }}
              >
                {wordNumber !== null && (
                  <span 
                    className="absolute text-xs font-bold"
                    style={{
                      top: '1px',
                      left: '1px',
                      fontSize: `${10 * previewScaleFactor}px`, // Increased font size for numbers
                    }}
                  >
                    {wordNumber}
                  </span>
                )}
                {!isEmpty && showSolution && (
                  <span style={{ fontSize: `${letterSize * 1.2 * previewScaleFactor}px` }}> {/* Increased letter size */}
                    {cell}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};
