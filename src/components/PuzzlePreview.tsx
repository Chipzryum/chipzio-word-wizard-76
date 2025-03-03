
import React from "react";
import { PuzzleGrid } from "@/utils/wordSearchUtils";
import { getVerticalOffset } from "@/utils/pdfUtils";

interface PuzzlePreviewProps {
  puzzle: PuzzleGrid | null;
  title: string;
  subtitle: string;
  instruction: string;
  showTitle: boolean;
  showSubtitle: boolean;
  showInstruction: boolean;
  showWordList: boolean;
  titleOffset: number;
  subtitleOffset: number;
  instructionOffset: number;
  gridOffset: number;
  wordListOffset: number;
  fontSizes: any;
  cellSize: number;
  letterSize: number;
  previewScaleFactor: number;
  currentWidth: number;
  currentHeight: number;
  selectedUnit: string;
  convertFromPoints: (points: number) => string;
  contentHeight: number;
}

export const PuzzlePreview: React.FC<PuzzlePreviewProps> = ({
  puzzle,
  title,
  subtitle,
  instruction,
  showTitle,
  showSubtitle,
  showInstruction,
  showWordList,
  titleOffset,
  subtitleOffset,
  instructionOffset,
  gridOffset,
  wordListOffset,
  fontSizes,
  cellSize,
  letterSize,
  previewScaleFactor,
  currentWidth,
  currentHeight,
  selectedUnit,
  convertFromPoints,
  contentHeight,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Preview</h3>
      <div className="border rounded-lg p-4 bg-white h-[430px] flex flex-col items-center justify-center">
        <div 
          className="relative border-2 border-black bg-white p-4 overflow-hidden"
          style={{
            width: `${currentWidth * previewScaleFactor}px`,
            height: `${currentHeight * previewScaleFactor}px`,
            maxWidth: '100%',
            maxHeight: '380px',
          }}
        >
          <div className="flex flex-col h-full">
            {showTitle && (
              <div 
                className="text-center font-bold font-serif"
                style={{
                  fontSize: `${fontSizes.titleSize * previewScaleFactor}px`,
                  marginBottom: `${10 * previewScaleFactor}px`,
                  marginTop: `${getVerticalOffset(titleOffset, contentHeight) * previewScaleFactor}px`,
                  position: 'relative',
                }}
              >
                {title.toUpperCase()}
              </div>
            )}
            
            {showSubtitle && (
              <div 
                className="text-center font-serif italic"
                style={{
                  fontSize: `${fontSizes.subtitleSize * previewScaleFactor}px`,
                  marginBottom: `${10 * previewScaleFactor}px`,
                  marginTop: `${getVerticalOffset(subtitleOffset, contentHeight) * previewScaleFactor}px`,
                  position: 'relative',
                }}
              >
                {subtitle.toLowerCase()}
              </div>
            )}
            
            {showInstruction && (
              <div 
                className="text-center font-serif"
                style={{
                  fontSize: `${fontSizes.instructionSize * previewScaleFactor}px`,
                  marginBottom: `${20 * previewScaleFactor}px`,
                  marginTop: `${getVerticalOffset(instructionOffset, contentHeight) * previewScaleFactor}px`,
                  position: 'relative',
                }}
              >
                {instruction}
              </div>
            )}
            
            <div 
              className="flex-1 grid place-items-center mb-4"
              style={{
                marginTop: `${getVerticalOffset(gridOffset, contentHeight) * previewScaleFactor}px`,
                position: 'relative',
              }}
            >
              <div className="grid grid-cols-1">
                {puzzle?.grid.map((row, i) => (
                  <div key={i} className="flex">
                    {row.map((cell, j) => (
                      <div
                        key={`${i}-${j}`}
                        className="flex items-center justify-center font-serif border border-black"
                        style={{
                          width: `${cellSize * previewScaleFactor}px`,
                          height: `${cellSize * previewScaleFactor}px`,
                          fontSize: `${letterSize * previewScaleFactor}px`,
                        }}
                      >
                        {cell}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            
            {showWordList && (
              <div 
                className="flex flex-wrap justify-center gap-2 font-serif"
                style={{
                  fontSize: `${fontSizes.wordListSize * previewScaleFactor}px`,
                  marginTop: `${getVerticalOffset(wordListOffset, contentHeight) * previewScaleFactor}px`,
                  position: 'relative',
                }}
              >
                {puzzle?.wordPlacements.map(({ word }, i) => (
                  <span key={i} className="mx-3 my-1">{word.toLowerCase()}</span>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="mt-2 text-xs text-center text-muted-foreground">
          {convertFromPoints(currentWidth)} × {convertFromPoints(currentHeight)} {selectedUnit.toLowerCase()}
        </div>
      </div>
    </div>
  );
};
