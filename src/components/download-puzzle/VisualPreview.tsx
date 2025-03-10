
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
  imagePositions?: { x: number; y: number }[];
  designAngle?: number;
  designSize?: number;
  designSpacing?: number;
  useTiledPattern?: boolean;
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
  imagePositions = [],
  designAngle = 0,
  designSize = 1,
  designSpacing = 1,
  useTiledPattern = false,
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
            imagePositions={imagePositions}
            designAngle={designAngle}
            designSize={designSize}
            designSpacing={designSpacing}
            useTiledPattern={useTiledPattern}
          />
        </PDFViewer>
      </div>
    );
  }

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
      {/* Background Images - Tiled Pattern */}
      {useTiledPattern && uploadedImages.length > 0 && (
        <div 
          className="absolute inset-0 overflow-hidden" 
          style={{ opacity: imageOpacity }}
        >
          {uploadedImages.map((image, index) => {
            // Use the first image for tiling
            if (index > 0) return null;
            
            const imgSize = 50 * designSize;
            const gap = 30 * designSpacing;
            const totalSize = imgSize + gap;
            
            return (
              <div 
                key={index}
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${image})`,
                  backgroundSize: `${imgSize * previewScaleFactor}px`,
                  backgroundRepeat: 'repeat',
                  backgroundPosition: 'center',
                  transform: `rotate(${designAngle}deg)`,
                  transformOrigin: 'center',
                  padding: `${gap/2 * previewScaleFactor}px`,
                  // Scale the background pattern based on spacing
                  backgroundPositionX: `${gap/2 * previewScaleFactor}px`,
                  backgroundPositionY: `${gap/2 * previewScaleFactor}px`,
                }}
              />
            );
          })}
        </div>
      )}
      
      {/* Regular Background Images */}
      {!useTiledPattern && uploadedImages.map((image, index) => (
        <div
          key={index}
          className="absolute pointer-events-none"
          style={{
            left: `${imagePositions[index]?.x ?? 0}%`,
            top: `${imagePositions[index]?.y ?? 0}%`,
            opacity: imageOpacity,
            maxWidth: '50%',
            maxHeight: '50%',
          }}
        >
          <img
            src={image}
            alt=""
            className="w-full h-full object-contain"
          />
        </div>
      ))}

      <div className="flex flex-col h-full">
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
                    className="flex items-center justify-center"
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
        {showWordList && puzzle && (
          <div 
            className="flex flex-wrap justify-center mt-4"
            style={{
              marginTop: `${getVerticalOffset(wordListOffset) * previewScaleFactor}px`,
              fontSize: `${fontSizes.wordListSize * previewScaleFactor * wordListSizeMultiplier}px`,
            }}
          >
            {puzzle.wordPlacements.map(({ word }, index) => (
              <span key={index} className="mx-2">{word.toLowerCase()}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
