
import { Document } from "@react-pdf/renderer";
import { CombinedPuzzleGrid } from "../types";
import { PDFPage } from "./PDFPage";
import { calculateFontSizes, getVerticalOffset } from "./PDFUtils";

interface PDFDocumentProps {
  puzzlesToRender: CombinedPuzzleGrid[];
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
  uploadedImages = [],
  imageOpacity = 0.3,
  imageGridSize = 100,
  imageAngle = 0,
  imageSpacing = 0,
  includeSolution = true,
}: PDFDocumentProps) => {
  // Calculate font sizes based on page dimensions
  const fontSizes = calculateFontSizes(currentWidth, currentHeight, {
    titleSizeMultiplier,
    subtitleSizeMultiplier,
    instructionSizeMultiplier,
    wordListSizeMultiplier
  });
  
  // Create offset calculator function with contentHeight
  const offsetCalculator = (offset: number) => getVerticalOffset(offset, contentHeight);
  
  // Separate questions and answers
  const questionPuzzles = puzzlesToRender.filter(p => p.isAnswer !== true);
  const answerPuzzles = puzzlesToRender.filter(p => p.isAnswer === true);
  
  // Create all pages
  const pages = [];
  
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
        getVerticalOffset={offsetCalculator}
        uploadedImages={uploadedImages}
        imageOpacity={imageOpacity}
        imageGridSize={imageGridSize}
        imageAngle={imageAngle}
        imageSpacing={imageSpacing}
        isAnswer={false}
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
        getVerticalOffset={offsetCalculator}
        uploadedImages={uploadedImages}
        imageOpacity={imageOpacity}
        imageGridSize={imageGridSize}
        imageAngle={imageAngle}
        imageSpacing={imageSpacing}
        isAnswer={true}
        pageNumber={i + 1}
        totalPuzzles={answerPuzzles.length}
      />
    );
  });
  
  return <Document>{pages}</Document>;
};
