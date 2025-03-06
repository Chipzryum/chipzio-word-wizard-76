
import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IMAGE_PLACEMENT_OPTIONS, ImagePlacement } from "./constants";
import { Upload, Trash2, RefreshCw } from "lucide-react";

interface AestheticsPanelProps {
  backgroundOpacity: number;
  setBackgroundOpacity: (value: number) => void;
  imagePlacement: ImagePlacement;
  setImagePlacement: (value: ImagePlacement) => void;
  backgroundImage: string | null;
  setBackgroundImage: (value: string | null) => void;
  randomizeImagePlacement: () => void;
}

export const AestheticsPanel = ({
  backgroundOpacity,
  setBackgroundOpacity,
  imagePlacement,
  setImagePlacement,
  backgroundImage,
  setBackgroundImage,
  randomizeImagePlacement,
}: AestheticsPanelProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(backgroundImage);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setImagePreview(result);
      setBackgroundImage(result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setBackgroundImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <Label>Background Image</Label>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Image
          </Button>
          {backgroundImage && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRemoveImage}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>
        
        {imagePreview && (
          <div className="mt-2 relative">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="w-full h-32 object-cover rounded-md border"
            />
          </div>
        )}
      </div>

      {backgroundImage && (
        <>
          <div className="grid gap-2">
            <Label>Image Opacity</Label>
            <Slider
              value={[backgroundOpacity * 100]}
              min={5}
              max={50}
              step={5}
              onValueChange={(value) => setBackgroundOpacity(value[0] / 100)}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>5%</span>
              <span>{(backgroundOpacity * 100).toFixed(0)}%</span>
              <span>50%</span>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Image Placement</Label>
            <div className="flex gap-2 items-center">
              <Select
                value={imagePlacement}
                onValueChange={(value) => setImagePlacement(value as ImagePlacement)}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select placement" />
                </SelectTrigger>
                <SelectContent>
                  {IMAGE_PLACEMENT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={randomizeImagePlacement}
                title="Randomize Placement"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
