
import { PDFViewer } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { Download, Save } from "lucide-react";
import { CombinedPuzzleGrid } from "./types";

interface PreviewSectionProps {
  renderPreview: () => JSX.Element | null;
  handleSaveLayout: () => Promise<void>;
  handleDownload: () => Promise<void>;
  isGenerating: boolean;
  isPDFReady: boolean;
  puzzles: CombinedPuzzleGrid[];
  activePuzzleIndex: number;
  includeSolution: boolean;
  pdfBlob: Blob | null;
  pageLabel?: string;
}

export const PreviewSection = ({
  renderPreview,
  handleSaveLayout,
  handleDownload,
  isGenerating,
  isPDFReady,
  puzzles,
  activePuzzleIndex,
  includeSolution,
  pdfBlob,
  pageLabel
}: PreviewSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Preview</h3>
        {pageLabel && (
          <span className="text-xs bg-muted px-2 py-1 rounded">{pageLabel}</span>
        )}
      </div>
      <div className="border rounded-lg p-4 bg-white h-[430px] flex flex-col items-center justify-center overflow-y-auto relative">
        {renderPreview()}
      </div>
      <div className="flex gap-4">
        <Button
          onClick={handleSaveLayout}
          className="flex-1 flex items-center justify-center gap-2"
          disabled={isGenerating || !puzzles[Math.floor(activePuzzleIndex / (includeSolution ? 2 : 1))]}
        >
          <Save className="h-4 w-4" />
          Preview Page
        </Button>
        <Button
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-2"
          variant={isPDFReady ? "default" : "outline"}
          disabled={!isPDFReady || !pdfBlob}
        >
          <Download className="h-4 w-4" />
          Download All Pages
        </Button>
      </div>
      {!isPDFReady && (
        <p className="text-xs text-muted-foreground">
          Click "Preview Page" after making changes to update the PDF preview.
        </p>
      )}
    </div>
  );
};
