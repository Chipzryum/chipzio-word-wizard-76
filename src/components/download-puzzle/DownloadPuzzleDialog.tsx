
// Update the ControlPanel component call to remove image-related props
<ControlPanel 
  showTitle={showTitle}
  setShowTitle={setShowTitle}
  title={title}
  setTitle={setTitle}
  titleSizeMultiplier={titleSizeMultiplier}
  setTitleSizeMultiplier={setTitleSizeMultiplier}
  titleOffset={titleOffset}
  positioningElement={positioningElement}
  togglePositioning={togglePositioning}
  moveElement={moveElement}
  
  showSubtitle={showSubtitle}
  setShowSubtitle={setShowSubtitle}
  subtitle={subtitle}
  setSubtitle={setSubtitle}
  subtitleSizeMultiplier={subtitleSizeMultiplier}
  setSubtitleSizeMultiplier={setSubtitleSizeMultiplier}
  subtitleOffset={subtitleOffset}
  
  showInstruction={showInstruction}
  setShowInstruction={setShowInstruction}
  instruction={instruction}
  setInstruction={setInstruction}
  instructionSizeMultiplier={instructionSizeMultiplier}
  setInstructionSizeMultiplier={setInstructionSizeMultiplier}
  instructionOffset={instructionOffset}
  
  selectedSize={selectedSize}
  handleSizeChange={handleSizeChange}
  
  showGrid={showGrid}
  setShowGrid={setShowGrid}
  cellSizeMultiplier={cellSizeMultiplier}
  setCellSizeMultiplier={setCellSizeMultiplier}
  letterSizeMultiplier={letterSizeMultiplier}
  setLetterSizeMultiplier={setLetterSizeMultiplier}
  gridOffset={gridOffset}
  
  showWordList={showWordList}
  setShowWordList={setShowWordList}
  wordListSizeMultiplier={wordListSizeMultiplier}
  setWordListSizeMultiplier={setWordListSizeMultiplier}
  wordListOffset={wordListOffset}
  
  selectedUnit={selectedUnit}
  setSelectedUnit={handleUnitChange}
  currentWidth={currentWidth}
  currentHeight={currentHeight}
  handleDimensionChange={handleDimensionChange}
  convertFromPoints={convertFromPoints}
  formatSliderValue={formatSliderValue}
  getPositionValue={getPositionValue}
/>
