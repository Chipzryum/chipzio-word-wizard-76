
import { Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { PuzzleGrid } from "@/utils/wordSearchUtils";
import { CombinedPuzzleGrid, PageSettings } from "../types";
import { PDFTiledBackground } from "./PDFTiledBackground";
import { PDFWordSearchGrid } from "./PDFWordSearchGrid";
import { PDFWordSearchWordList } from "./PDFWordSearchWordList";
import { PDFPageNumber } from "./PDFPageNumber";

interface PDFPageProps {
  puzzle: CombinedPuzzleGrid;
  title: string;
  subtitle: string;
  instruction: string;
  showTitle: boolean;
  showSubtitle: boolean;
  showInstruction: boolean;
  showGrid: boolean;
  showWordList: boolean;
  titleOffset: number;
  subtitleOffset: number;
  instructionOffset: number;
  gridOffset: number;
  wordListOffset: number;
  currentWidth: number;
  currentHeight: number;
  contentWidth: number;
  contentHeight: number;
  cellSize: number;
  letterSizeMultiplier: number;
  titleSizeMultiplier: number;
  subtitleSizeMultiplier: number;
  instructionSizeMultiplier: number;
  wordListSizeMultiplier: number;
  fontSizes: {
    titleSize: number;
    subtitleSize: number;
    instructionSize: number;
    wordListSize: number;
  };
  getVerticalOffset: (offset: number) => number;
  uploadedImages?: string[];
  imageOpacity?: number;
  imageGridSize?: number;
  imageAngle?: number;
  imageSpacing?: number;
  isAnswer: boolean;
  pageNumber: number;
  totalPuzzles: number;
}

export const PDFPage = ({
  puzzle,
  title,
  subtitle,
  instruction,
  showTitle,
  showSubtitle,
  showInstruction,
  showGrid,
  showWordList,
  titleOffset,
  subtitleOffset,
  instructionOffset,
  gridOffset,
  wordListOffset,
  currentWidth,
  currentHeight,
  contentWidth,
  contentHeight,
  cellSize,
  letterSizeMultiplier,
  titleSizeMultiplier,
  subtitleSizeMultiplier,
  instructionSizeMultiplier,
  wordListSizeMultiplier,
  fontSizes,
  getVerticalOffset,
  uploadedImages = [],
  imageOpacity = 0.3,
  imageGridSize = 100,
  imageAngle = 0,
  imageSpacing = 0,
  isAnswer,
  pageNumber,
  totalPuzzles,
}: PDFPageProps) => {
  // Create PDF styles
  const styles = createPDFStyles(fontSizes, cellSize, letterSizeMultiplier);
  
  // Format page numbers with proper numbering
  const pageLabel = isAnswer ? 
    `Answer ${pageNumber}` : 
    `Page ${pageNumber}`;
  
  // Determine title text with solution indicator if needed
  const titleText = isAnswer 
    ? `${title.toUpperCase()} - SOLUTION` 
    : totalPuzzles > 1 
      ? `${title.toUpperCase()}` 
      : title.toUpperCase();

  return (
    <Page size={[currentWidth, currentHeight]} style={styles.page} wrap={false}>
      {/* Tiled background pattern */}
      {uploadedImages && uploadedImages.length > 0 && (
        <PDFTiledBackground
          uploadedImages={uploadedImages}
          currentWidth={currentWidth}
          currentHeight={currentHeight}
          imageGridSize={imageGridSize}
          imageSpacing={imageSpacing}
          imageOpacity={imageOpacity}
          imageAngle={imageAngle}
        />
      )}
      
      <View style={styles.container}>
        {showTitle && (
          <View style={[styles.titleContainer, {marginTop: getVerticalOffset(titleOffset)}]}>
            <Text style={styles.title}>{titleText}</Text>
          </View>
        )}
        
        {showSubtitle && (
          <View style={[styles.subtitleContainer, {marginTop: getVerticalOffset(subtitleOffset)}]}>
            <Text style={styles.subtitle}>{subtitle.toLowerCase()}</Text>
          </View>
        )}
        
        {showInstruction && !isAnswer && (
          <View style={[styles.instructionContainer, {marginTop: getVerticalOffset(instructionOffset)}]}>
            <Text style={styles.instruction}>{instruction}</Text>
          </View>
        )}
        
        {showGrid && (
          <View style={[styles.gridContainer, {marginTop: getVerticalOffset(gridOffset)}]}>
            <View style={styles.grid}>
              <PDFWordSearchGrid 
                puzzle={puzzle} 
                cellSize={cellSize} 
                letterSize={cellSize * 0.6 * Math.min(letterSizeMultiplier, 1.3)}
                showSolution={isAnswer} 
              />
            </View>
          </View>
        )}
        
        {showWordList && (
          <View style={[styles.wordListContainer, {marginTop: getVerticalOffset(wordListOffset)}]}>
            <PDFWordSearchWordList 
              puzzle={puzzle} 
              wordListSize={fontSizes.wordListSize} 
            />
          </View>
        )}
      </View>
      
      {/* Page number */}
      <PDFPageNumber label={pageLabel} />
    </Page>
  );
};

// Create styles for PDF
function createPDFStyles(fontSizes: { 
  titleSize: number; 
  subtitleSize: number; 
  instructionSize: number; 
  wordListSize: number;
}, cellSize: number, letterSizeMultiplier: number) {
  // Calculate letter size based on cell size
  const cappedLetterSizeMultiplier = Math.min(letterSizeMultiplier, 1.3);
  const letterSize = cellSize * 0.6 * cappedLetterSizeMultiplier;
  
  return StyleSheet.create({
    page: {
      padding: 40,
      fontFamily: 'Times-Roman',
      position: 'relative',
      overflow: 'hidden',
    },
    container: {
      flex: 1,
      borderWidth: 1,
      borderColor: '#000',
      padding: 20,
      position: 'relative',
      zIndex: 1,
    },
    titleContainer: {
      zIndex: 2,
      alignSelf: 'center',
    },
    subtitleContainer: {
      zIndex: 2,
      alignSelf: 'center',
    },
    instructionContainer: {
      zIndex: 2,
      alignSelf: 'center',
    },
    gridContainer: {
      zIndex: 2,
      width: '100%',
      alignItems: 'center',
    },
    wordListContainer: {
      zIndex: 2,
      alignSelf: 'center',
      width: '100%',
    },
    title: {
      fontSize: fontSizes.titleSize,
      marginBottom: 10,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    subtitle: {
      fontSize: fontSizes.subtitleSize,
      marginBottom: 10,
      textAlign: 'center',
      fontFamily: 'Times-Italic',
    },
    instruction: {
      fontSize: fontSizes.instructionSize,
      marginBottom: 20,
      textAlign: 'center',
    },
    grid: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: 20,
    },
  });
}
