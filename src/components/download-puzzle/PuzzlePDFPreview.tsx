import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { PuzzleGrid } from "@/utils/wordSearchUtils";
import { CombinedPuzzleGrid, PageSettings } from "./types";

interface PuzzlePDFPreviewProps {
  puzzle: CombinedPuzzleGrid | null;
  allPuzzles?: (CombinedPuzzleGrid & { pageSettings?: PageSettings })[];
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
  includeSolution?: boolean;
  showSolution?: boolean;
}

export const PuzzlePDFPreview = ({
  puzzle,
  allPuzzles = [],
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
  includeSolution = true,
  showSolution = false,
}: PuzzlePDFPreviewProps) => {
  if (!puzzle) return null;
  
  const puzzlesToRender = allPuzzles && allPuzzles.length > 0 ? allPuzzles : [puzzle];
  
  const calculateFontSizes = (multipliers: {
    titleSizeMultiplier: number;
    subtitleSizeMultiplier: number;
    instructionSizeMultiplier: number;
    wordListSizeMultiplier: number;
  }) => {
    const a4Width = 595.28;
    const a4Height = 841.89;
    const sizeRatio = Math.sqrt((currentWidth * currentHeight) / (a4Width * a4Height));
    
    return {
      titleSize: Math.max(20, Math.min(48, Math.floor(36 * sizeRatio * multipliers.titleSizeMultiplier))),
      subtitleSize: Math.max(14, Math.min(36, Math.floor(24 * sizeRatio * multipliers.subtitleSizeMultiplier))),
      instructionSize: Math.max(8, Math.min(24, Math.floor(14 * sizeRatio * multipliers.instructionSizeMultiplier))),
      wordListSize: Math.max(6, Math.min(28, Math.floor(12 * sizeRatio * multipliers.wordListSizeMultiplier))),
    };
  };

  const defaultFontSizes = calculateFontSizes({
    titleSizeMultiplier,
    subtitleSizeMultiplier,
    instructionSizeMultiplier,
    wordListSizeMultiplier
  });
  
  function createPDFStyles(fontSizes: { 
    titleSize: number; 
    subtitleSize: number; 
    instructionSize: number; 
    wordListSize: number;
  }, letterSizeMultiplier: number) {
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
      wordList: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
      },
      wordItem: {
        marginHorizontal: 15,
        marginVertical: 5,
        fontSize: fontSizes.wordListSize,
        backgroundColor: 'rgba(229, 231, 235, 0.6)',
        padding: 4,
        borderRadius: 4,
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
      verticalLineUp: {
        width: 2,
        top: 0,
        bottom: 0,
        left: '50%',
      },
      pageNumber: {
        position: 'absolute',
        bottom: 30,
        right: 40,
        fontSize: 10,
        color: '#666',
      },
    });
  }

  function getVerticalOffset(offset: number) {
    const maxAllowedOffset = Math.min(5, (contentHeight / 6) / 10);
    return Math.max(-maxAllowedOffset, Math.min(offset * 10, maxAllowedOffset * 10));
  }
  
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

  const defaultPdfStyles = createPDFStyles(defaultFontSizes, letterSizeMultiplier);
  
  const pages = [];
  let pageCounter = 1;
  
  let questionPageCounter = 1;
  let answerPageCounter = 1;
  
  puzzlesToRender.forEach((puzzleItem, index) => {
    const isAnswer = 'isAnswer' in puzzleItem && puzzleItem.isAnswer === true;
    
    const pageSettings = puzzleItem.pageSettings || {
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
      letterSizeMultiplier,
      titleSizeMultiplier,
      subtitleSizeMultiplier,
      instructionSizeMultiplier,
      wordListSizeMultiplier,
      cellSizeMultiplier: 1.0
    };
    
    const pageFontSizes = calculateFontSizes({
      titleSizeMultiplier: pageSettings.titleSizeMultiplier,
      subtitleSizeMultiplier: pageSettings.subtitleSizeMultiplier,
      instructionSizeMultiplier: pageSettings.instructionSizeMultiplier,
      wordListSizeMultiplier: pageSettings.wordListSizeMultiplier
    });
    
    const pageStyles = createPDFStyles(pageFontSizes, pageSettings.letterSizeMultiplier);
    
    pages.push(createPuzzlePage(
      puzzleItem, 
      index, 
      isAnswer, 
      isAnswer ? answerPageCounter++ : questionPageCounter++,
      pageSettings,
      pageStyles
    ));
    
    pageCounter++;
  });
  
  function createPuzzlePage(
    puzzleToRender: CombinedPuzzleGrid, 
    index: number, 
    isAnswer: boolean, 
    pageNum: number,
    pageSettings: PageSettings,
    pdfStyles: any
  ) {
    const pageLabel = isAnswer ? `Answer ${pageNum}` : `Page ${pageNum}`;
    
    return (
      <Page 
        key={`${index}-${isAnswer ? 'solution' : 'puzzle'}`} 
        size={[currentWidth, currentHeight]} 
        style={pdfStyles.page}
      >
        <View style={pdfStyles.container}>
          {pageSettings.showTitle && (
            <View style={[pdfStyles.titleContainer, {marginTop: getVerticalOffset(pageSettings.titleOffset)}]}>
              <Text style={pdfStyles.title}>
                {isAnswer ? `${pageSettings.title.toUpperCase()} - SOLUTION` : pageSettings.title.toUpperCase()}
              </Text>
            </View>
          )}
          
          {pageSettings.showSubtitle && (
            <View style={[pdfStyles.subtitleContainer, {marginTop: getVerticalOffset(pageSettings.subtitleOffset)}]}>
              <Text style={pdfStyles.subtitle}>{pageSettings.subtitle.toLowerCase()}</Text>
            </View>
          )}
          
          {pageSettings.showInstruction && !isAnswer && (
            <View style={[pdfStyles.instructionContainer, {marginTop: getVerticalOffset(pageSettings.instructionOffset)}]}>
              <Text style={pdfStyles.instruction}>{pageSettings.instruction}</Text>
            </View>
          )}
          
          {pageSettings.showGrid && (
            <View style={[pdfStyles.gridContainer, {marginTop: getVerticalOffset(pageSettings.gridOffset)}]}>
              <View style={pdfStyles.grid}>
                {puzzleToRender.grid.map((row, i) => (
                  <View key={i} style={pdfStyles.row}>
                    {row.map((cell, j) => {
                      const wordPlacements = isAnswer ? 
                        puzzleToRender.wordPlacements.filter(wp => isPartOfWord(j, i, wp)) : 
                        [];

                      return (
                        <View key={`${i}-${j}`} style={pdfStyles.cell}>
                          <Text style={pdfStyles.letter}>{cell}</Text>
                          
                          {isAnswer && wordPlacements.map((placement, index) => {
                            if (typeof placement.direction === 'string') {
                              return null;
                            }
                            
                            const { direction } = placement;
                            let lineStyle;
                            
                            if (direction.x === 1 && direction.y === 0) {
                              lineStyle = pdfStyles.horizontalLine;
                            } else if (direction.x === 0 && direction.y === 1) {
                              lineStyle = pdfStyles.verticalLine;
                            } else if (direction.x === 0 && direction.y === -1) {
                              lineStyle = pdfStyles.verticalLine;
                            } else if (direction.x === 1 && direction.y === 1) {
                              lineStyle = pdfStyles.diagonalLineDown;
                            } else if (direction.x === 1 && direction.y === -1 || 
                                      (direction.x === -1 && direction.y === 1)) {
                              lineStyle = pdfStyles.diagonalLineUp;
                            }
                            
                            return lineStyle && (
                              <View 
                                key={`line-${index}`} 
                                style={[pdfStyles.solutionLine, lineStyle]} 
                              />
                            );
                          })}
                        </View>
                      );
                    })}
                  </View>
                ))}
              </View>
            </View>
          )}
          
          {pageSettings.showWordList && (
            <View style={[pdfStyles.wordListContainer, {marginTop: getVerticalOffset(pageSettings.wordListOffset)}]}>
              <View style={pdfStyles.wordList}>
                {puzzleToRender.wordPlacements.map(({ word }, index) => (
                  <Text key={index} style={pdfStyles.wordItem}>{word.toLowerCase()}</Text>
                ))}
              </View>
            </View>
          )}
        </View>
        
        <Text style={pdfStyles.pageNumber}>{pageLabel}</Text>
      </Page>
    );
  }

  return <Document>{pages}</Document>;
};
