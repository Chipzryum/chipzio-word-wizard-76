
import React from 'react';
import { ClueData } from "@/utils/crosswordUtils";

interface CrosswordClueListProps {
  acrossClues: ClueData[];
  downClues: ClueData[];
  fontSize: number;
}

export const CrosswordClueList = ({
  acrossClues,
  downClues,
  fontSize,
}: CrosswordClueListProps) => {
  return (
    <div className="grid grid-cols-2 gap-2 mt-4 px-2 relative overflow-auto">
      <div>
        <div className="font-bold mb-1" style={{ fontSize: `${fontSize}px` }}>ACROSS</div>
        {acrossClues.map((clue) => (
          <div key={`across-${clue.number}`} className="mb-1" style={{ fontSize: `${fontSize}px` }}>
            {clue.number}. {clue.clue}
            {clue.answer ? ` (${clue.answer})` : ''}
          </div>
        ))}
      </div>
      <div>
        <div className="font-bold mb-1" style={{ fontSize: `${fontSize}px` }}>DOWN</div>
        {downClues.map((clue) => (
          <div key={`down-${clue.number}`} className="mb-1" style={{ fontSize: `${fontSize}px` }}>
            {clue.number}. {clue.clue}
            {clue.answer ? ` (${clue.answer})` : ''}
          </div>
        ))}
      </div>
    </div>
  );
};
