
import { CrosswordGrid } from "@/utils/crosswordUtils";
import { PDFViewer } from "@react-pdf/renderer";
import { CrosswordPDFPreview } from "./CrosswordPDFPreview";
import { CrosswordClueList, CrosswordGridDisplay, TiledBackground } from "./crossword-components";

interface CrosswordVisualPreviewProps {
  puzzle: CrosswordGrid | null;
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
  imageAngle?: number;
  imageSpacing?: number;
  showSolution?: boolean;
  includeSolution?: boolean;
}

export const CrosswordVisualPreview = ({
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
  imageAngle = 0,
  imageSpacing = 0,
  showSolution = false,
  includeSolution = true,
}: CrosswordVisualPreviewProps) => {
  if (showLivePreview && isPDFReady) {
    return (
      <div className="w-full h-full flex-1">
        <PDFViewer width="100%" height="100%" className="border-0">
          <CrosswordPDFPreview
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
            imageAngle={imageAngle}
            imageSpacing={imageSpacing}
            showSolution={showSolution}
            includeSolution={includeSolution}
          />
        </PDFViewer>
      </div>
    );
  }

  // A4 aspect ratio is roughly 1:1.414 (width:height)
  const previewAspectRatio = 1 / 1.414;
  
  return (
    <div 
      className="relative border-2 border-black bg-white p-4 overflow-hidden mx-auto"
      style={{
        width: `${Math.min(currentWidth * previewScaleFactor, 420)}px`,
        height: `${Math.min(currentWidth * previewScaleFactor / previewAspectRatio, 593)}px`,
        maxWidth: '100%', 
        maxHeight: '593px',
      }}
    >
      {/* Apply tiled background pattern */}
      {uploadedImages && uploadedImages.length > 0 && (
        <TiledBackground 
          uploadedImages={uploadedImages} 
          imageOpacity={imageOpacity}
          imageGridSize={imageGridSize}
          previewScaleFactor={previewScaleFactor}
          imageAngle={imageAngle}
          imageSpacing={imageSpacing}
          currentWidth={currentWidth}
          currentHeight={currentHeight}
        />
      )}
      
      <div className="flex flex-col h-full relative" style={{ zIndex: 2 }}>
        {showTitle && (
          <div 
            className="text-center font-bold font-serif relative"
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
            className="text-center italic font-serif relative"
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
            className="text-center mb-4 relative"
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
            className="flex flex-col items-center justify-center relative"
            style={{
              marginTop: `${getVerticalOffset(gridOffset) * previewScaleFactor}px`,
            }}
          >
            <CrosswordGridDisplay 
              puzzle={puzzle} 
              cellSize={cellSize * previewScaleFactor} 
              letterSize={letterSize * previewScaleFactor}
              previewScaleFactor={previewScaleFactor}
              showSolution={showSolution}
            />
          </div>
        )}

        {showWordList && puzzle && (
          <div 
            className="mt-4 relative"
            style={{
              marginTop: `${getVerticalOffset(wordListOffset) * previewScaleFactor}px`,
              fontSize: `${fontSizes.wordListSize * previewScaleFactor * wordListSizeMultiplier}px`,
              maxHeight: '140px',
              overflowY: 'auto'
            }}
          >
            <CrosswordClueList 
              acrossClues={puzzle.acrossClues} 
              downClues={puzzle.downClues} 
              fontSize={fontSizes.wordListSize * previewScaleFactor * wordListSizeMultiplier}
            />
          </div>
        )}
      </div>
    </div>
  );
};
