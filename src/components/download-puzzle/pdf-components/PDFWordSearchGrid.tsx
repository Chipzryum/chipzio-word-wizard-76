
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import { PuzzleGrid } from "@/utils/wordSearchUtils";

interface PDFWordSearchGridProps {
  puzzle: PuzzleGrid;
  cellSize: number;
  letterSize: number;
  showSolution: boolean;
}

export const PDFWordSearchGrid = ({
  puzzle,
  cellSize,
  letterSize,
  showSolution,
}: PDFWordSearchGridProps) => {
  // Create styles specific to the grid
  const styles = StyleSheet.create({
    row: {
      display: 'flex',
      flexDirection: 'row',
    },
    cell: {
      width: cellSize,
      height: cellSize,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.6)',
      borderWidth: 0.5,
      borderColor: '#d1d5db',
      position: 'relative',
    },
    letter: {
      textAlign: 'center',
      alignSelf: 'center',
      fontSize: letterSize,
      zIndex: 3,
    },
    solutionLine: {
      position: 'absolute',
      backgroundColor: 'rgb(239, 68, 68)',
      opacity: 0.7,
      zIndex: 2,
    },
    horizontalLine: {
      height: 2,
      left: 0,
      right: 0,
      top: '50%',
    },
    verticalLine: {
      width: 2,
      top: 0,
      bottom: 0,
      left: '50%',
    },
    diagonalLineDown: {
      height: 2,
      width: '140%',
      left: '-20%',
      top: '50%',
      transform: 'rotate(45deg)',
    },
    diagonalLineUp: {
      height: 2,
      width: '140%',
      left: '-20%',
      top: '50%',
      transform: 'rotate(-45deg)',
    },
  });

  // Helper function to check if a cell is part of a word
  function isPartOfWord(x: number, y: number, placement: any): boolean {
    const { startPos, direction, length } = placement;
    
    if (typeof direction === 'string') {
      return false;
    }
    
    for (let i = 0; i < length; i++) {
      const checkX = startPos.x + (direction.x * i);
      const checkY = startPos.y + (direction.y * i);
      if (checkX === x && checkY === y) {
        return true;
      }
    }
    return false;
  }

  return (
    <>
      {puzzle.grid.map((row, i) => (
        <View key={i} style={styles.row}>
          {row.map((cell, j) => {
            const wordPlacements = showSolution ? 
              puzzle.wordPlacements.filter(wp => isPartOfWord(j, i, wp)) : 
              [];

            return (
              <View key={`${i}-${j}`} style={styles.cell}>
                <Text style={styles.letter}>{cell}</Text>
                
                {showSolution && wordPlacements.map((placement, index) => {
                  if (typeof placement.direction === 'string') {
                    return null;
                  }
                  
                  const { direction } = placement;
                  let lineStyle;
                  
                  if (direction.x === 1 && direction.y === 0) {
                    lineStyle = styles.horizontalLine;
                  } else if (direction.x === 0 && direction.y === 1) {
                    lineStyle = styles.verticalLine;
                  } else if (direction.x === 0 && direction.y === -1) {
                    lineStyle = styles.verticalLine;
                  } else if (direction.x === 1 && direction.y === 1) {
                    lineStyle = styles.diagonalLineDown;
                  } else if (direction.x === 1 && direction.y === -1 || 
                            (direction.x === -1 && direction.y === 1)) {
                    lineStyle = styles.diagonalLineUp;
                  }
                  
                  return lineStyle && (
                    <View 
                      key={`line-${index}`} 
                      style={[styles.solutionLine, lineStyle]} 
                    />
                  );
                })}
              </View>
            );
          })}
        </View>
      ))}
    </>
  );
};
