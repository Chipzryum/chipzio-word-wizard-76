
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import { PuzzleGrid } from "@/utils/wordSearchUtils";

interface PDFWordSearchWordListProps {
  puzzle: PuzzleGrid;
  wordListSize: number;
}

export const PDFWordSearchWordList = ({
  puzzle,
  wordListSize,
}: PDFWordSearchWordListProps) => {
  const styles = StyleSheet.create({
    wordList: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    wordItem: {
      marginHorizontal: 15,
      marginVertical: 5,
      fontSize: wordListSize,
      backgroundColor: 'rgba(229, 231, 235, 0.6)',
      padding: 4,
      borderRadius: 4,
    },
  });

  return (
    <View style={styles.wordList}>
      {puzzle.wordPlacements.map(({ word }, index) => (
        <Text key={index} style={styles.wordItem}>{word.toLowerCase()}</Text>
      ))}
    </View>
  );
};
