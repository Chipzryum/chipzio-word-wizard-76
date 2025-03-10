
const handleSaveLayout = async () => {
  if (!puzzle) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "No puzzle to save. Please generate a puzzle first.",
    });
    return;
  }
  
  setIsGenerating(true);
  
  try {
    console.log("Creating PDF with letterSizeMultiplier:", letterSizeMultiplier);
    console.log("Creating PDF with cellSize:", cellSize);
    
    // Cap the letter size multiplier
    const cappedLetterSizeMultiplier = Math.min(letterSizeMultiplier, MAX_LETTER_SIZE);
    console.log("Creating PDF with cappedLetterSizeMultiplier:", cappedLetterSizeMultiplier);
    
    const blob = await pdf(
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
    ).toBlob();
    
    console.log("PDF blob generated successfully:", blob);
    setPdfBlob(blob);
    setIsPDFReady(true);
    setShowLivePreview(true);
    
    toast({
      title: "PDF Ready",
      description: "Your layout has been saved. Click 'Download PDF' to download.",
    });
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    toast({
      variant: "destructive",
      title: "Error",
      description: `Failed to generate PDF: ${error instanceof Error ? error.message : "Unknown error"}`,
    });
  } finally {
    setIsGenerating(false);
  }
};
