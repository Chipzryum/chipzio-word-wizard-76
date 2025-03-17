
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
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
  uploadedImages?: string[];
  imageOpacity?: number;
  imageGridSize?: number;
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
  uploadedImages = [],
  imageOpacity = 0.3,
  imageGridSize = 100,
}: PuzzlePDFPreviewProps) => {
  if (!puzzle) return null;
  
  // Calculate font sizes based on page dimensions and multipliers
  const calculateFontSizes = () => {
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
  };

  const fontSizes = calculateFontSizes();
  
  // Use the exact font sizes from our calculations
  const pdfStyles = createPDFStyles(fontSizes);

  // Calculate how many images we need to cover the page
  const calculateImageGrid = () => {
    if (!uploadedImages || uploadedImages.length === 0) return [];
    
    const imageElements = [];
    const scaledImageSize = imageGridSize; // Size in points (PDF units)
    
    // Calculate number of images needed to cover the page
    const horizontalCount = Math.ceil(currentWidth / scaledImageSize) + 1;
    const verticalCount = Math.ceil(currentHeight / scaledImageSize) + 1;
    
    for (let x = 0; x < horizontalCount; x++) {
      for (let y = 0; y < verticalCount; y++) {
        imageElements.push({
          x: x * scaledImageSize,
          y: y * scaledImageSize,
          size: scaledImageSize,
          image: uploadedImages[0] // Use the first image for grid
        });
      }
    }
    
    return imageElements;
  };
  
  const backgroundImages = calculateImageGrid();
  
  return (
    <Document>
      <Page size={[currentWidth, currentHeight]} style={pdfStyles.page}>
        {/* Background image grid - rendered first to be behind content */}
        {uploadedImages && uploadedImages.length > 0 && (
          <View style={pdfStyles.backgroundGrid}>
            {backgroundImages.map((img, index) => (
              <Image
                key={`img-${index}`}
                src={img.image}
                style={{
                  position: 'absolute',
                  left: img.x,
                  top: img.y,
                  width: img.size,
                  height: img.size,
                  opacity: imageOpacity,
                }}
              />
            ))}
          </View>
        )}
        
        {/* Content container with semi-transparent background for readability */}
        <View style={pdfStyles.container}>
          {showTitle && (
            <Text style={[
              pdfStyles.title, 
              {marginTop: getVerticalOffset(titleOffset)},
              pdfStyles.textBackground
            ]}>
              {title.toUpperCase()}
            </Text>
          )}
          
          {showSubtitle && (
            <Text style={[
              pdfStyles.subtitle, 
              {marginTop: getVerticalOffset(subtitleOffset)},
              pdfStyles.textBackground
            ]}>
              {subtitle.toLowerCase()}
            </Text>
          )}
          
          {showInstruction && (
            <Text style={[
              pdfStyles.instruction, 
              {marginTop: getVerticalOffset(instructionOffset)},
              pdfStyles.textBackground
            ]}>
              {instruction}
            </Text>
          )}
          
          {showGrid && (
            <View style={[pdfStyles.grid, {marginTop: getVerticalOffset(gridOffset)}, pdfStyles.gridBackground]}>
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
            <View style={[pdfStyles.wordList, {marginTop: getVerticalOffset(wordListOffset)}, pdfStyles.wordListBackground]}>
              {puzzle.wordPlacements.map(({ word }, index) => (
                <Text key={index} style={pdfStyles.wordItem}>{word.toLowerCase()}</Text>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );

  // Create styles for PDF that match the preview exactly
  function createPDFStyles(fontSizes: { 
    titleSize: number; 
    subtitleSize: number; 
    instructionSize: number; 
    wordListSize: number;
  }) {
    // Apply the exact multipliers as in the preview
    // The letter size calculation remains based on cell size
    const cappedLetterSizeMultiplier = Math.min(letterSizeMultiplier, 1.3);
    const letterSize = cellSize * 0.6 * cappedLetterSizeMultiplier;
    
    return StyleSheet.create({
      page: {
        padding: 40,
        fontFamily: 'Times-Roman',
        position: 'relative',
      },
      container: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#000',
        padding: 20,
        position: 'relative',
        backgroundColor: 'transparent', // Container should be transparent to show background images
        zIndex: 2, // Place above background images
      },
      backgroundGrid: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1, // Lower z-index so background is behind content
      },
      title: {
        fontSize: fontSizes.titleSize,
        marginBottom: 10,
        textAlign: 'center',
        fontWeight: 'bold',
        position: 'relative',
        zIndex: 3,
      },
      subtitle: {
        fontSize: fontSizes.subtitleSize,
        marginBottom: 10,
        textAlign: 'center',
        fontFamily: 'Times-Italic',
        position: 'relative',
        zIndex: 3,
      },
      instruction: {
        fontSize: fontSizes.instructionSize,
        marginBottom: 20,
        textAlign: 'center',
        position: 'relative',
        zIndex: 3,
      },
      grid: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 20,
        position: 'relative',
        zIndex: 3,
        padding: 10,
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
        backgroundColor: 'white',
        borderWidth: 0.5,
        borderColor: '#ccc',
      },
      letter: {
        textAlign: 'center',
        alignSelf: 'center',
        fontSize: letterSize,
      },
      wordList: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 3,
        padding: 8,
      },
      wordItem: {
        marginHorizontal: 15,
        marginVertical: 5,
        fontSize: fontSizes.wordListSize,
        padding: 4,
        backgroundColor: '#f8f8f8',
        borderRadius: 3,
      },
      // Semi-transparent backgrounds for readability
      textBackground: {
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        padding: 3,
        borderRadius: 2,
      },
      gridBackground: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
      },
      wordListBackground: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 4,
      },
    });
  }

  // Calculate vertical position offset
  function getVerticalOffset(offset: number) {
    // Each unit is 10 points, limit to prevent going off page
    const maxAllowedOffset = Math.min(5, (contentHeight / 6) / 10);
    return Math.max(-maxAllowedOffset, Math.min(offset * 10, maxAllowedOffset * 10));
  }
};
