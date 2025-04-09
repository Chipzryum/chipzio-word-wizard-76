import { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ControlPanel } from "./ControlPanel";
import { LayoutSettings } from "./LayoutSettings";
import { SizesSettings } from "./SizesSettings";
import { AestheticsTab } from "./AestheticsTab";
import { ActionButtons } from "./ActionButtons";
import { MultiPuzzleGrid } from "./MultiPuzzleGrid";
import { CombinedPuzzleGrid } from "./types";
import { PageSize, Unit } from "./types";

interface DialogContentProps {
  title: string;
  setTitle: (value: string) => void;
  subtitle: string;
  setSubtitle: (value: string) => void;
  instruction: string;
  setInstruction: (value: string) => void;
  showTitle: boolean;
  setShowTitle: (value: boolean) => void;
  showSubtitle: boolean;
  setShowSubtitle: (value: boolean) => void;
  showInstruction: boolean;
  setShowInstruction: (value: boolean) => void;
  showGrid: boolean;
  setShowGrid: (value: boolean) => void;
  showWordList: boolean;
  setShowWordList: (value: boolean) => void;
  
  selectedSize: PageSize;
  handleSizeChange: (size: PageSize) => void;
  customWidth: number;
  customHeight: number;
  selectedUnit: Unit;
  handleUnitChange: (unit: Unit) => void;
  handleDimensionChange: (dimension: "width" | "height", value: string) => void;
  convertFromPoints: (points: number) => string;
  
  titleOffset: number;
  setTitleOffset: (value: number) => void;
  subtitleOffset: number;
  setSubtitleOffset: (value: number) => void;
  instructionOffset: number;
  setInstructionOffset: (value: number) => void;
  gridOffset: number;
  setGridOffset: (value: number) => void;
  wordListOffset: number;
  setWordListOffset: (value: number) => void;
  
  letterSizeMultiplier: number;
  setLetterSizeMultiplier: (value: number) => void;
  titleSizeMultiplier: number;
  setTitleSizeMultiplier: (value: number) => void;
  subtitleSizeMultiplier: number;
  setSubtitleSizeMultiplier: (value: number) => void;
  instructionSizeMultiplier: number;
  setInstructionSizeMultiplier: (value: number) => void;
  wordListSizeMultiplier: number;
  setWordListSizeMultiplier: (value: number) => void;
  cellSizeMultiplier: number;
  setCellSizeMultiplier: (value: number) => void;
  
  getPositionValue: (offset: number) => string;
  formatSliderValue: (value: number) => string;
  
  puzzles: CombinedPuzzleGrid[];
  activePuzzleIndex: number;
  handleSelectPuzzle: (index: number) => void;
  includeSolution: boolean;
  displayPages: any[];
  
  renderPreview: () => JSX.Element | null;
  handleSaveLayout: () => Promise<void>;
  handleDownload: () => Promise<void>;
  isGenerating: boolean;
  isPDFReady: boolean;
  pdfBlob: Blob | null;
}

export const DialogContent = ({
  title,
  setTitle,
  subtitle,
  setSubtitle,
  instruction,
  setInstruction,
  showTitle,
  setShowTitle,
  showSubtitle,
  setShowSubtitle,
  showInstruction,
  setShowInstruction,
  showGrid,
  setShowGrid,
  showWordList,
  setShowWordList,
  
  selectedSize,
  handleSizeChange,
  customWidth,
  customHeight,
  selectedUnit,
  handleUnitChange,
  handleDimensionChange,
  convertFromPoints,
  
  titleOffset,
  setTitleOffset,
  subtitleOffset,
  setSubtitleOffset,
  instructionOffset,
  setInstructionOffset,
  gridOffset,
  setGridOffset,
  wordListOffset,
  setWordListOffset,
  
  letterSizeMultiplier,
  setLetterSizeMultiplier,
  titleSizeMultiplier,
  setTitleSizeMultiplier,
  subtitleSizeMultiplier,
  setSubtitleSizeMultiplier,
  instructionSizeMultiplier,
  setInstructionSizeMultiplier,
  wordListSizeMultiplier,
  setWordListSizeMultiplier,
  cellSizeMultiplier,
  setCellSizeMultiplier,
  
  getPositionValue,
  formatSliderValue,
  
  puzzles,
  activePuzzleIndex,
  handleSelectPuzzle,
  includeSolution,
  displayPages,
  
  renderPreview,
  handleSaveLayout,
  handleDownload,
  isGenerating,
  isPDFReady,
  pdfBlob
}: DialogContentProps) => {
  const currentPage = displayPages && displayPages[activePuzzleIndex];
  const isAnswerPage = currentPage?.isAnswer || false;
  const pageNumber = currentPage?.pageNumber || 1;
  const totalPuzzlePages = Math.ceil(displayPages?.length / (includeSolution ? 2 : 1)) || 0;
  
  const pageLabel = isAnswerPage 
    ? `Answer ${pageNumber} of ${totalPuzzlePages}`
    : `Question ${pageNumber} of ${totalPuzzlePages}`;

  return (
    <Tabs defaultValue="content">
      <TabsList className="grid grid-cols-4 mb-4 w-full">
        <TabsTrigger value="content">Content</TabsTrigger>
        <TabsTrigger value="layout">Layout</TabsTrigger>
        <TabsTrigger value="sizes">Sizes</TabsTrigger>
        <TabsTrigger value="aesthetics">Aesthetics</TabsTrigger>
      </TabsList>
      
      <TabsContent value="content" className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {displayPages && displayPages.length > 0 && (
            <div className="glass-card rounded-lg p-4 bg-white/50 border shadow-sm">
              <h3 className="font-medium mb-3">Pages ({displayPages.length})</h3>
              <MultiPuzzleGrid 
                puzzles={puzzles}
                activePuzzleIndex={activePuzzleIndex}
                onSelectPuzzle={handleSelectPuzzle}
                includeSolution={includeSolution}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Click on a page to select and edit it
              </p>
            </div>
          )}
        
          <ControlPanel 
            showTitle={showTitle}
            setShowTitle={setShowTitle}
            title={title}
            setTitle={setTitle}
            subtitle={subtitle}
            setSubtitle={setSubtitle}
            instruction={instruction}
            setInstruction={setInstruction}
            showSubtitle={showSubtitle}
            setShowSubtitle={setShowSubtitle}
            showInstruction={showInstruction}
            setShowInstruction={setShowInstruction}
            showGrid={showGrid}
            setShowGrid={setShowGrid}
            showWordList={showWordList}
            setShowWordList={setShowWordList}
          />
        </div>

        <div className="space-y-4">
          <Label>Preview ({pageLabel})</Label>
          <div className="border rounded-lg p-4 bg-white h-[430px] flex flex-col items-center justify-center overflow-y-auto relative">
            {renderPreview()}
          </div>
          
          <ActionButtons 
            handleSaveLayout={handleSaveLayout}
            handleDownload={handleDownload}
            isGenerating={isGenerating}
            isPDFReady={isPDFReady}
            puzzle={puzzles[Math.floor(activePuzzleIndex / (includeSolution ? 2 : 1))]}
            pdfBlob={pdfBlob}
          />
          
          {!isPDFReady && (
            <p className="text-xs text-muted-foreground">
              Click "Save Layout" after making changes to update the PDF preview.
            </p>
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="layout" className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LayoutSettings
          selectedSize={selectedSize}
          handleSizeChange={handleSizeChange}
          customWidth={customWidth}
          customHeight={customHeight}
          selectedUnit={selectedUnit}
          handleUnitChange={handleUnitChange}
          handleDimensionChange={handleDimensionChange}
          convertFromPoints={convertFromPoints}
          
          titleOffset={titleOffset}
          subtitleOffset={subtitleOffset}
          instructionOffset={instructionOffset}
          gridOffset={gridOffset}
          wordListOffset={wordListOffset}
          setTitleOffset={setTitleOffset}
          setSubtitleOffset={setSubtitleOffset}
          setInstructionOffset={setInstructionOffset}
          setGridOffset={setGridOffset}
          setWordListOffset={setWordListOffset}
          
          showTitle={showTitle}
          showSubtitle={showSubtitle}
          showInstruction={showInstruction}
          showGrid={showGrid}
          showWordList={showWordList}
          
          getPositionValue={getPositionValue}
        />

        <div className="space-y-4">
          <Label>Preview</Label>
          <div className="border rounded-lg p-4 bg-white h-[430px] flex flex-col items-center justify-center overflow-y-auto relative">
            {renderPreview()}
          </div>
          
          <ActionButtons 
            handleSaveLayout={handleSaveLayout}
            handleDownload={handleDownload}
            isGenerating={isGenerating}
            isPDFReady={isPDFReady}
            puzzle={puzzles[Math.floor(activePuzzleIndex / (includeSolution ? 2 : 1))]}
            pdfBlob={pdfBlob}
          />
        </div>
      </TabsContent>
      
      <TabsContent value="sizes" className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SizesSettings
          letterSizeMultiplier={letterSizeMultiplier}
          setLetterSizeMultiplier={setLetterSizeMultiplier}
          titleSizeMultiplier={titleSizeMultiplier}
          setTitleSizeMultiplier={setTitleSizeMultiplier}
          subtitleSizeMultiplier={subtitleSizeMultiplier}
          setSubtitleSizeMultiplier={setSubtitleSizeMultiplier}
          instructionSizeMultiplier={instructionSizeMultiplier}
          setInstructionSizeMultiplier={setInstructionSizeMultiplier}
          wordListSizeMultiplier={wordListSizeMultiplier}
          setWordListSizeMultiplier={setWordListSizeMultiplier}
          cellSizeMultiplier={cellSizeMultiplier}
          setCellSizeMultiplier={setCellSizeMultiplier}
          showTitle={showTitle}
          showSubtitle={showSubtitle}
          showInstruction={showInstruction}
          showWordList={showWordList}
          showGrid={showGrid}
        />

        <div className="space-y-4">
          <Label>Preview</Label>
          <div className="border rounded-lg p-4 bg-white h-[430px] flex flex-col items-center justify-center overflow-y-auto relative">
            {renderPreview()}
          </div>
          
          <ActionButtons 
            handleSaveLayout={handleSaveLayout}
            handleDownload={handleDownload}
            isGenerating={isGenerating}
            isPDFReady={isPDFReady}
            puzzle={puzzles[Math.floor(activePuzzleIndex / (includeSolution ? 2 : 1))]}
            pdfBlob={pdfBlob}
          />
        </div>
      </TabsContent>
      
      <TabsContent value="aesthetics" className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AestheticsTab />
        
        <div className="space-y-4">
          <Label>Preview</Label>
          <div className="border rounded-lg p-4 bg-white h-[430px] flex flex-col items-center justify-center overflow-y-auto relative">
            {renderPreview()}
          </div>
          
          <ActionButtons 
            handleSaveLayout={handleSaveLayout}
            handleDownload={handleDownload}
            isGenerating={isGenerating}
            isPDFReady={isPDFReady}
            puzzle={puzzles[Math.floor(activePuzzleIndex / (includeSolution ? 2 : 1))]}
            pdfBlob={pdfBlob}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
};
