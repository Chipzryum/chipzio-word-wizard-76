
import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { PuzzleGrid } from "@/utils/wordSearchUtils";
import { getVerticalOffset, PDF_MARGIN, BORDER_WIDTH, BASE_PADDING } from "@/utils/pdfUtils";

interface PuzzlePDFProps {
  puzzle: PuzzleGrid;
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
  currentWidth: number;
  currentHeight: number;
  pdfStyles: any;
}

export const PuzzlePDF: React.FC<PuzzlePDFProps> = ({
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
  currentWidth,
  currentHeight,
  pdfStyles,
}) => {
  return (
    <Document>
      <Page size={[currentWidth, currentHeight]} style={pdfStyles.page}>
        <View style={pdfStyles.container}>
          {showTitle && <Text style={pdfStyles.title}>{title.toUpperCase()}</Text>}
          {showSubtitle && <Text style={pdfStyles.subtitle}>{subtitle.toLowerCase()}</Text>}
          {showInstruction && <Text style={pdfStyles.instruction}>{instruction}</Text>}
          <View style={pdfStyles.grid}>
            {puzzle.grid.map((row, i) => (
              <View key={i} style={pdfStyles.row}>
                {row.map((cell, j) => (
                  <Text key={`${i}-${j}`} style={pdfStyles.cell}>
                    {cell}
                  </Text>
                ))}
              </View>
            ))}
          </View>
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
};

export const createPDFStyles = (
  showTitle: boolean,
  showSubtitle: boolean,
  showInstruction: boolean,
  showWordList: boolean,
  titleOffset: number,
  subtitleOffset: number,
  instructionOffset: number,
  gridOffset: number,
  wordListOffset: number,
  fontSizes: any,
  cellSize: number,
  letterSizeMultiplier: number,
  puzzle: PuzzleGrid | null,
  contentWidth: number,
  contentHeight: number
) => {
  if (!puzzle) return StyleSheet.create({});

  // Calculate the maximum content height to ensure one-page printing
  const totalContentHeight = calculateTotalContentHeight(
    puzzle,
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
    contentHeight
  );
  
  const adjustmentFactor = totalContentHeight > contentHeight ? contentHeight / totalContentHeight : 1;
  
  const adjustedFontSizes = {
    titleSize: Math.max(12, Math.min(36, Math.floor(fontSizes.titleSize * adjustmentFactor))),
    subtitleSize: Math.max(8, Math.min(24, Math.floor(fontSizes.subtitleSize * adjustmentFactor))),
    instructionSize: Math.max(6, Math.min(14, Math.floor(fontSizes.instructionSize * adjustmentFactor))),
    wordListSize: Math.max(6, Math.min(12, Math.floor(fontSizes.wordListSize * adjustmentFactor))),
  };
  
  // Adjust cell size if needed to fit on one page
  const adjustedCellSize = cellSize * adjustmentFactor;
  
  return StyleSheet.create({
    page: {
      padding: PDF_MARGIN,
      fontFamily: 'Times-Roman',
    },
    container: {
      flex: 1,
      border: BORDER_WIDTH,
      padding: BASE_PADDING,
      position: 'relative',
    },
    title: {
      fontSize: adjustedFontSizes.titleSize,
      marginBottom: 10,
      marginTop: getVerticalOffset(titleOffset, contentHeight),
      textAlign: 'center',
      fontWeight: 'bold',
      display: showTitle ? 'flex' : 'none',
      position: 'relative',
    },
    subtitle: {
      fontSize: adjustedFontSizes.subtitleSize,
      marginBottom: 10,
      marginTop: getVerticalOffset(subtitleOffset, contentHeight),
      textAlign: 'center',
      fontFamily: 'Times-Italic',
      display: showSubtitle ? 'flex' : 'none',
      position: 'relative',
    },
    instruction: {
      fontSize: adjustedFontSizes.instructionSize,
      marginBottom: 20,
      marginTop: getVerticalOffset(instructionOffset, contentHeight),
      textAlign: 'center',
      display: showInstruction ? 'flex' : 'none',
      position: 'relative',
    },
    grid: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: 20,
      marginTop: getVerticalOffset(gridOffset, contentHeight),
      position: 'relative',
    },
    row: {
      display: 'flex',
      flexDirection: 'row',
    },
    cell: {
      width: adjustedCellSize,
      height: adjustedCellSize,
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 0.5,
      borderColor: '#000',
      fontSize: adjustedCellSize * 0.6 * letterSizeMultiplier,
    },
    wordList: {
      marginTop: getVerticalOffset(wordListOffset, contentHeight),
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
};

// Calculate total height of all content to ensure one-page fitting
const calculateTotalContentHeight = (
  puzzle: PuzzleGrid,
  showTitle: boolean,
  showSubtitle: boolean,
  showInstruction: boolean,
  showWordList: boolean,
  titleOffset: number,
  subtitleOffset: number,
  instructionOffset: number,
  gridOffset: number,
  wordListOffset: number,
  fontSizes: any,
  cellSize: number,
  contentHeight: number
) => {
  let totalHeight = 0;
  
  // Add height for visible elements with their actual multipliers
  if (showTitle) totalHeight += fontSizes.titleSize + 20 + Math.abs(getVerticalOffset(titleOffset, contentHeight));
  if (showSubtitle) totalHeight += fontSizes.subtitleSize + 20 + Math.abs(getVerticalOffset(subtitleOffset, contentHeight));
  if (showInstruction) totalHeight += fontSizes.instructionSize + 30 + Math.abs(getVerticalOffset(instructionOffset, contentHeight));
  
  // Add grid height with cell size multiplier
  const gridHeight = puzzle.grid.length * cellSize + Math.abs(getVerticalOffset(gridOffset, contentHeight));
  totalHeight += gridHeight + 40;
  
  // Add word list height with word list multiplier
  if (showWordList) {
    const wordRows = Math.ceil(puzzle.wordPlacements.length / 6);
    totalHeight += wordRows * (fontSizes.wordListSize + 10) + Math.abs(getVerticalOffset(wordListOffset, contentHeight));
  }
  
  // Add margins and padding
  totalHeight += PDF_MARGIN * 2 + BASE_PADDING * 2 + BORDER_WIDTH * 2;
  
  return totalHeight;
};
