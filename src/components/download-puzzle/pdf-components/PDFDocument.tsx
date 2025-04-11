
import { Document } from "@react-pdf/renderer";
import { CrosswordGrid } from "@/utils/crosswordUtils";
import { PDFPage } from "./PDFPage";

interface PDFDocumentProps {
  puzzlesToRender: CrosswordGrid[];
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
  includeSolution?: boolean;
}

export const PDFDocument = ({
  puzzlesToRender,
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
  includeSolution = true,
}: PDFDocumentProps) => {
  // Create all pages
  const pages = [];
  
  // Separate questions and answers
  const questionPuzzles = puzzlesToRender.filter(p => !p.isAnswer);
  const answerPuzzles = puzzlesToRender.filter(p => p.isAnswer);
  
  // Process question puzzles first
  questionPuzzles.forEach((currentPuzzle, i) => {
    pages.push(
      <PDFPage
        key={`question-${i}`}
        puzzle={currentPuzzle}
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
        fontSizes={fontSizes}
        getVerticalOffset={getVerticalOffset}
        uploadedImages={uploadedImages}
        imageOpacity={imageOpacity}
        imageGridSize={imageGridSize}
        imageAngle={imageAngle}
        imageSpacing={imageSpacing}
        showSolution={false}
        pageNumber={i + 1}
        totalPuzzles={questionPuzzles.length}
      />
    );
  });
  
  // Then process answer puzzles
  answerPuzzles.forEach((currentPuzzle, i) => {
    pages.push(
      <PDFPage
        key={`answer-${i}`}
        puzzle={currentPuzzle}
        title={title}
        subtitle={subtitle}
        instruction={instruction}
        showTitle={showTitle}
        showSubtitle={showSubtitle}
        showInstruction={false} // Don't show instructions on answer pages
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
        fontSizes={fontSizes}
        getVerticalOffset={getVerticalOffset}
        uploadedImages={uploadedImages}
        imageOpacity={imageOpacity}
        imageGridSize={imageGridSize}
        imageAngle={imageAngle}
        imageSpacing={imageSpacing}
        showSolution={true}
        pageNumber={i + 1}
        totalPuzzles={answerPuzzles.length}
      />
    );
  });
  
  return <Document>{pages}</Document>;
};
