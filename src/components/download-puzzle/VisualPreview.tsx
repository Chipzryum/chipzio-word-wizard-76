
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
  imageGridSize?: number;
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
  imageGridSize = 100,
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
            imageGridSize={imageGridSize}
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
    const scaledSize = imageGridSize * previewScaleFactor;
    
    // Calculate number of images needed to cover the preview area
    const horizontalCount = Math.ceil((currentWidth * previewScaleFactor) / scaledSize) + 1;
    const verticalCount = Math.ceil((currentHeight * previewScaleFactor) / scaledSize) + 1;
    
    for (let x = 0; x < horizontalCount; x++) {
      for (let y = 0; y < verticalCount; y++) {
        imageElements.push({
          x: x * scaledSize,
          y: y * scaledSize,
          size: scaledSize,
          image: uploadedImages[0] // Use first image for grid
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
      {/* Background images grid */}
      {uploadedImages && uploadedImages.length > 0 && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ opacity: imageOpacity }}>
          {backgroundImages.map((img, index) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: img.x,
                top: img.y,
                width: img.size,
                height: img.size,
                backgroundImage: `url(${img.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          ))}
        </div>
      )}

      <div className="flex flex-col h-full relative z-10">
        {showTitle && (
          <div 
            className="text-center font-bold font-serif"
            style={{
              fontSize: `${fontSizes.titleSize * previewScaleFactor * titleSizeMultiplier}px`,
              marginTop: `${getVerticalOffset(titleOffset) * previewScaleFactor}px`,
            }}
          >
            {title.toUpperCase()}
          </div>
        )}
        {showSubtitle && (
          <div 
            className="text-center italic font-serif"
            style={{
              fontSize: `${fontSizes.subtitleSize * previewScaleFactor * subtitleSizeMultiplier}px`,
              marginTop: `${getVerticalOffset(subtitleOffset) * previewScaleFactor}px`,
            }}
          >
            {subtitle.toLowerCase()}
          </div>
        )}
        {showInstruction && (
          <div 
            className="text-center mb-4"
            style={{
              fontSize: `${fontSizes.instructionSize * previewScaleFactor * instructionSizeMultiplier}px`,
              marginTop: `${getVerticalOffset(instructionOffset) * previewScaleFactor}px`,
            }}
          >
            {instruction}
          </div>
        )}
        {showGrid && puzzle && (
          <div 
            className="flex flex-col items-center justify-center"
            style={{
              marginTop: `${getVerticalOffset(gridOffset) * previewScaleFactor}px`,
            }}
          >
            {puzzle.grid.map((row, i) => (
              <div key={i} className="flex">
                {row.map((letter, j) => (
                  <div
                    key={`${i}-${j}`}
                    className="flex items-center justify-center border border-gray-300 bg-white/80"
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
            className="flex flex-wrap justify-center mt-4 px-2"
            style={{
              marginTop: `${getVerticalOffset(wordListOffset) * previewScaleFactor}px`,
              fontSize: `${fontSizes.wordListSize * previewScaleFactor * wordListSizeMultiplier}px`,
            }}
          >
            {puzzle.wordPlacements.map(({ word }, index) => (
              <span key={index} className="mx-2 px-1.5 py-0.5 bg-white/80 rounded-md mb-1 border border-gray-200">
                {word.toLowerCase()}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
