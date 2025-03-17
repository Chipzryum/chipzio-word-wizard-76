
import { PuzzleGrid } from "@/utils/wordSearchUtils";
import { PDFViewer } from "@react-pdf/renderer";
import { PuzzlePDFPreview } from "./PuzzlePDFPreview";

interface VisualPreviewProps {
  puzzle: PuzzleGrid | null;
  showLivePreview: boolean;
  isPDFReady: boolean;
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
  letterSize: number;
  letterSizeMultiplier: number;
  titleSizeMultiplier: number;
  subtitleSizeMultiplier: number;
  instructionSizeMultiplier: number;
  wordListSizeMultiplier: number;
  previewScaleFactor: number;
  fontSizes: {
    titleSize: number;
    subtitleSize: number;
    instructionSize: number;
    wordListSize: number;
  };
  getVerticalOffset: (offset: number) => number;
  uploadedImages?: string[];
  imageOpacity?: number;
}

export const VisualPreview = ({
  puzzle,
  showLivePreview,
  isPDFReady,
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
  letterSize,
  letterSizeMultiplier,
  titleSizeMultiplier,
  subtitleSizeMultiplier,
  instructionSizeMultiplier,
  wordListSizeMultiplier,
  previewScaleFactor,
  fontSizes,
  getVerticalOffset,
  uploadedImages = [],
  imageOpacity = 0.3,
}: VisualPreviewProps) => {
  if (showLivePreview && isPDFReady) {
    return (
      <div className="w-full h-full flex-1">
        <PDFViewer width="100%" height="100%" className="border-0">
          <PuzzlePDFPreview
            puzzle={puzzle}
            title={title}
            subtitle={subtitle}
            instruction={instruction}
            showTitle={showTitle}
            showSubtitle={showSubtitle}
            showInstruction={showInstruction}
            showGrid={showGrid}
            showWordList={showWordList}
            titleOffset={titleOffset}
            subtitleOffset={subtitleOffset}
            instructionOffset={instructionOffset}
            gridOffset={gridOffset}
            wordListOffset={wordListOffset}
            currentWidth={currentWidth}
            currentHeight={currentHeight}
            contentWidth={contentWidth}
            contentHeight={contentHeight}
            cellSize={cellSize}
            letterSizeMultiplier={letterSizeMultiplier}
            titleSizeMultiplier={titleSizeMultiplier}
            subtitleSizeMultiplier={subtitleSizeMultiplier}
            instructionSizeMultiplier={instructionSizeMultiplier}
            wordListSizeMultiplier={wordListSizeMultiplier}
            uploadedImages={uploadedImages}
            imageOpacity={imageOpacity}
          />
        </PDFViewer>
      </div>
    );
  }

  console.log("Rendering VisualPreview with showWordList:", showWordList);
  console.log("Puzzle words:", puzzle?.wordPlacements.map(wp => wp.word));

  // Calculate how many images we need to cover the preview
  const calculateImageGrid = () => {
    if (!uploadedImages || uploadedImages.length === 0) return [];
    
    const imageElements = [];
    const scaledImageSize = 100 * previewScaleFactor; // Base size in pixels adjusted for preview scale
    
    // Calculate number of images needed to cover the preview
    const horizontalCount = Math.ceil((currentWidth * previewScaleFactor) / scaledImageSize) + 1;
    const verticalCount = Math.ceil((currentHeight * previewScaleFactor) / scaledImageSize) + 1;
    
    for (let x = 0; x < horizontalCount; x++) {
      for (let y = 0; y < verticalCount; y++) {
        imageElements.push({
          x: x * scaledImageSize,
          y: y * scaledImageSize,
          size: scaledImageSize,
          image: uploadedImages[0] // Use first image for pattern
        });
      }
    }
    
    return imageElements;
  };
  
  const backgroundImages = calculateImageGrid();

  return (
    <div 
      className="relative border-2 border-black bg-white p-4 overflow-hidden"
      style={{
        width: `${currentWidth * previewScaleFactor}px`,
        height: `${currentHeight * previewScaleFactor}px`,
        maxWidth: '100%',
        maxHeight: '380px',
      }}
    >
      {/* Background image grid */}
      {uploadedImages && uploadedImages.length > 0 && (
        <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 0 }}>
          {backgroundImages.map((img, index) => (
            <img
              key={index}
              src={img.image}
              alt="Background pattern"
              className="absolute object-cover"
              style={{
                left: img.x,
                top: img.y,
                width: img.size,
                height: img.size,
                opacity: imageOpacity,
              }}
            />
          ))}
        </div>
      )}

      <div className="flex flex-col h-full relative" style={{ zIndex: 1 }}>
        {showTitle && (
          <div 
            className="text-center font-bold font-serif relative"
            style={{
              fontSize: `${fontSizes.titleSize * previewScaleFactor * titleSizeMultiplier}px`,
              marginTop: `${getVerticalOffset(titleOffset) * previewScaleFactor}px`,
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              padding: '3px',
              borderRadius: '2px',
            }}
          >
            {title.toUpperCase()}
          </div>
        )}
        {showSubtitle && (
          <div 
            className="text-center italic font-serif relative"
            style={{
              fontSize: `${fontSizes.subtitleSize * previewScaleFactor * subtitleSizeMultiplier}px`,
              marginTop: `${getVerticalOffset(subtitleOffset) * previewScaleFactor}px`,
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              padding: '3px',
              borderRadius: '2px',
            }}
          >
            {subtitle.toLowerCase()}
          </div>
        )}
        {showInstruction && (
          <div 
            className="text-center mb-4 relative"
            style={{
              fontSize: `${fontSizes.instructionSize * previewScaleFactor * instructionSizeMultiplier}px`,
              marginTop: `${getVerticalOffset(instructionOffset) * previewScaleFactor}px`,
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              padding: '3px',
              borderRadius: '2px',
            }}
          >
            {instruction}
          </div>
        )}
        {showGrid && puzzle && (
          <div 
            className="flex flex-col items-center justify-center relative"
            style={{
              marginTop: `${getVerticalOffset(gridOffset) * previewScaleFactor}px`,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              padding: '8px',
              borderRadius: '4px',
            }}
          >
            {puzzle.grid.map((row, i) => (
              <div key={i} className="flex">
                {row.map((letter, j) => (
                  <div
                    key={`${i}-${j}`}
                    className="flex items-center justify-center border border-gray-300 bg-white"
                    style={{
                      width: `${cellSize * previewScaleFactor}px`,
                      height: `${cellSize * previewScaleFactor}px`,
                      fontSize: `${letterSize * previewScaleFactor}px`,
                    }}
                  >
                    {letter}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
        {showWordList && puzzle && puzzle.wordPlacements && puzzle.wordPlacements.length > 0 && (
          <div 
            className="flex flex-wrap justify-center mt-4 px-2 relative"
            style={{
              marginTop: `${getVerticalOffset(wordListOffset) * previewScaleFactor}px`,
              fontSize: `${fontSizes.wordListSize * previewScaleFactor * wordListSizeMultiplier}px`,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              padding: '5px',
              borderRadius: '4px',
            }}
          >
            {puzzle.wordPlacements.map(({ word }, index) => (
              <span key={index} className="mx-2 px-1 py-0.5 bg-gray-100 rounded-md mb-1">
                {word.toLowerCase()}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
