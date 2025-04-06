
import { Button } from "@/components/ui/button";
import { CombinedPuzzleGrid } from "./DownloadPuzzleDialog";
import { Loader2 } from "lucide-react";

interface ActionButtonsProps {
  handleSaveLayout: () => Promise<void>;
  handleDownload: () => Promise<void>;
  isGenerating: boolean;
  isPDFReady: boolean;
  puzzle: CombinedPuzzleGrid | null;
  pdfBlob: Blob | null;
  downloadButtonText?: string;
}

export function ActionButtons({
  handleSaveLayout,
  handleDownload,
  isGenerating,
  isPDFReady,
  puzzle,
  pdfBlob,
  downloadButtonText = "Download"
}: ActionButtonsProps) {
  return (
    <div className="flex space-x-2 mt-4">
      <Button
        onClick={handleSaveLayout}
        disabled={isGenerating || !puzzle}
        variant="outline"
        className="flex-1"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          "Save Layout"
        )}
      </Button>

      <Button
        onClick={handleDownload}
        disabled={!isPDFReady || !pdfBlob}
        className="flex-1"
      >
        {downloadButtonText}
      </Button>
    </div>
  );
}
