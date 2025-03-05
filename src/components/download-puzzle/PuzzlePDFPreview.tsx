
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { PuzzleGrid } from "@/utils/wordSearchUtils";

interface PuzzlePDFPreviewProps {
  puzzle: PuzzleGrid | null;
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
}

export const PuzzlePDFPreview = ({
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
}: PuzzlePDFPreviewProps) => {
  if (!puzzle) return null;
  
  const pdfStyles = createPDFStyles();
  
  return (
    <Document>
      <Page size={[currentWidth, currentHeight]} style={pdfStyles.page}>
        <View style={pdfStyles.container}>
          {showTitle && <Text style={pdfStyles.title}>{title.toUpperCase()}</Text>}
          {showSubtitle && <Text style={pdfStyles.subtitle}>{subtitle.toLowerCase()}</Text>}
          {showInstruction && <Text style={pdfStyles.instruction}>{instruction}</Text>}
          {showGrid && (
            <View style={pdfStyles.grid}>
              {puzzle.grid.map((row, i) => (
                <View key={i} style={pdfStyles.row}>
                  {row.map((cell, j) => (
                    <View key={`${i}-${j}`} style={pdfStyles.cell}>
                      <Text style={pdfStyles.letter}>{cell}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          )}
          {showWordList && (
            <View style={pdfStyles.wordList}>
              {puzzle.wordPlacements.map(({ word }, index) => (
                <Text key={index} style={pdfStyles.wordItem}>{word.toLowerCase()}</Text>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );

  // Create styles for PDF dynamically based on page size and multipliers
  function createPDFStyles() {
    // Calculate the maximum content height to ensure one-page printing
    const totalContentHeight = calculateTotalContentHeight();
    const adjustmentFactor = totalContentHeight > contentHeight ? contentHeight / totalContentHeight : 1;

    const fontSizes = calculateFontSizes();
    
    const adjustedFontSizes = {
      titleSize: Math.max(12, Math.min(36, Math.floor(fontSizes.titleSize * adjustmentFactor))),
      subtitleSize: Math.max(8, Math.min(24, Math.floor(fontSizes.subtitleSize * adjustmentFactor))),
      instructionSize: Math.max(6, Math.min(14, Math.floor(fontSizes.instructionSize * adjustmentFactor))),
      wordListSize: Math.max(6, Math.min(12, Math.floor(fontSizes.wordListSize * adjustmentFactor))),
    };
    
    // Adjust cell size if needed to fit on one page
    const adjustedCellSize = cellSize * adjustmentFactor;
    
    // Cap the letter size multiplier to prevent disappearing text
    const cappedLetterSizeMultiplier = Math.min(letterSizeMultiplier, 1.3);
    
    return StyleSheet.create({
      page: {
        padding: 40,
        fontFamily: 'Times-Roman',
      },
      container: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#000',
        padding: 20,
        position: 'relative',
      },
      title: {
        fontSize: adjustedFontSizes.titleSize,
        marginBottom: 10,
        marginTop: getVerticalOffset(titleOffset),
        textAlign: 'center',
        fontWeight: 'bold',
        display: showTitle ? 'flex' : 'none',
        position: 'relative',
      },
      subtitle: {
        fontSize: adjustedFontSizes.subtitleSize,
        marginBottom: 10,
        marginTop: getVerticalOffset(subtitleOffset),
        textAlign: 'center',
        fontFamily: 'Times-Italic',
        display: showSubtitle ? 'flex' : 'none',
        position: 'relative',
      },
      instruction: {
        fontSize: adjustedFontSizes.instructionSize,
        marginBottom: 20,
        marginTop: getVerticalOffset(instructionOffset),
        textAlign: 'center',
        display: showInstruction ? 'flex' : 'none',
        position: 'relative',
      },
      grid: {
        width: '100%',
        display: showGrid ? 'flex' : 'none',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: getVerticalOffset(gridOffset),
        position: 'relative',
      },
      row: {
        display: 'flex',
        flexDirection: 'row',
      },
      cell: {
        width: adjustedCellSize,
        height: adjustedCellSize,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: adjustedCellSize * 0.6 * cappedLetterSizeMultiplier,
        textAlign: 'center',
      },
      letter: {
        textAlign: 'center',
        alignSelf: 'center',
      },
      wordList: {
        marginTop: getVerticalOffset(wordListOffset),
        display: showWordList ? 'flex' : 'none',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        position: 'relative',
      },
      wordItem: {
        marginHorizontal: 15,
        marginVertical: 5,
        fontSize: adjustedFontSizes.wordListSize,
      },
    });
  }

  // Calculate total height of all content to ensure one-page fitting
  function calculateTotalContentHeight() {
    let totalHeight = 0;
    
    // Add height for visible elements with their actual multipliers
    if (showTitle) totalHeight += fontSizes.titleSize * titleSizeMultiplier + 20 + Math.abs(getVerticalOffset(titleOffset));
    if (showSubtitle) totalHeight += fontSizes.subtitleSize * subtitleSizeMultiplier + 20 + Math.abs(getVerticalOffset(subtitleOffset));
    if (showInstruction) totalHeight += fontSizes.instructionSize * instructionSizeMultiplier + 30 + Math.abs(getVerticalOffset(instructionOffset));
    
    // Add grid height with cell size multiplier if grid is shown
    if (showGrid) {
      const gridHeight = puzzle.grid.length * cellSize + Math.abs(getVerticalOffset(gridOffset));
      totalHeight += gridHeight + 40;
    }
    
    // Add word list height with word list multiplier
    if (showWordList) {
      const wordRows = Math.ceil(puzzle.wordPlacements.length / 6);
      totalHeight += wordRows * (fontSizes.wordListSize * wordListSizeMultiplier + 10) + Math.abs(getVerticalOffset(wordListOffset));
    }
    
    // Add margins and padding
    totalHeight += 40 * 2 + 20 * 2 + 1 * 2;
    
    return totalHeight;
  }

  // Calculate font sizes based on page dimensions and multipliers
  function calculateFontSizes() {
    // Base sizes for A4
    const a4Width = 595.28;
    const a4Height = 841.89;
    const sizeRatio = Math.sqrt((currentWidth * currentHeight) / (a4Width * a4Height));
    
    return {
      titleSize: Math.max(20, Math.min(48, Math.floor(36 * sizeRatio * titleSizeMultiplier))),
      subtitleSize: Math.max(14, Math.min(36, Math.floor(24 * sizeRatio * subtitleSizeMultiplier))),
      instructionSize: Math.max(8, Math.min(24, Math.floor(14 * sizeRatio * instructionSizeMultiplier))),
      wordListSize: Math.max(6, Math.min(28, Math.floor(12 * sizeRatio * wordListSizeMultiplier))),
    };
  }

  // Calculate vertical position offset with improved boundary checking
  function getVerticalOffset(offset: number) {
    // Each unit is 10 points, limit to prevent going off page
    const maxAllowedOffset = Math.min(5, (contentHeight / 6) / 10);
    return Math.max(-maxAllowedOffset, Math.min(offset * 10, maxAllowedOffset * 10));
  }
}
