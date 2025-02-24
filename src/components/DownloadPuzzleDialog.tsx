
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PuzzleGrid, WordPlacement } from "@/utils/wordSearchUtils";
import { pdf, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  grid: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  cell: {
    width: 20,
    height: 20,
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordList: {
    marginTop: 20,
    columns: 4,
    columnGap: 20,
  },
});

interface PuzzlePDFProps {
  title: string;
  puzzle: PuzzleGrid;
}

const PuzzlePDF = ({ title, puzzle }: PuzzlePDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.grid}>
        {puzzle.grid.map((row, i) => (
          <View key={i} style={styles.row}>
            {row.map((cell, j) => (
              <Text key={`${i}-${j}`} style={styles.cell}>
                {cell}
              </Text>
            ))}
          </View>
        ))}
      </View>
      <View style={styles.wordList}>
        {puzzle.wordPlacements.map(({ word }, index) => (
          <Text key={index}>{word}</Text>
        ))}
      </View>
    </Page>
  </Document>
);

interface DownloadPuzzleDialogProps {
  open: boolean;
  onClose: () => void;
  puzzle: PuzzleGrid | null;
}

export function DownloadPuzzleDialog({
  open,
  onClose,
  puzzle,
}: DownloadPuzzleDialogProps) {
  const [title, setTitle] = useState("Word Search Puzzle");

  const handleDownload = async () => {
    if (!puzzle) return;

    try {
      const blob = await pdf(<PuzzlePDF title={title} puzzle={puzzle} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title.toLowerCase().replace(/\s+/g, '-')}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      onClose();
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Download Puzzle</DialogTitle>
          <DialogDescription>
            Customize your puzzle before downloading
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Puzzle Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter puzzle title"
            />
          </div>

          <div className="space-y-2">
            <Label>Preview</Label>
            <div className="border rounded-lg p-4 bg-white">
              <div className="text-center font-bold mb-4">{title}</div>
              <div className="grid place-items-center text-xs">
                {puzzle?.grid.slice(0, 5).map((row, i) => (
                  <div key={i} className="flex">
                    {row.slice(0, 5).map((cell, j) => (
                      <div
                        key={`${i}-${j}`}
                        className="w-4 h-4 flex items-center justify-center"
                      >
                        {cell}
                      </div>
                    ))}
                    {row.length > 5 && <span className="ml-1">...</span>}
                  </div>
                ))}
                {puzzle && puzzle.grid.length > 5 && (
                  <div className="mt-1">...</div>
                )}
              </div>
              <div className="mt-4 text-xs">
                {puzzle?.wordPlacements.slice(0, 3).map(({ word }, i) => (
                  <span key={i} className="mr-2">{word}</span>
                ))}
                {puzzle && puzzle.wordPlacements.length > 3 && "..."}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleDownload}>Download PDF</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
