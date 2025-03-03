
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";
import { formatSliderValue } from "@/utils/pdfUtils";

interface ElementPositionControlProps {
  elementName: string;
  buttonText: string;
  showElement: boolean;
  toggleElement: () => void;
  positioningElement: string | null;
  togglePositioning: (element: string) => void;
  moveElement: (element: string, direction: 'up' | 'down') => void;
  offset: number;
  disabled?: boolean;
  children?: React.ReactNode;
}

export const ElementPositionControl: React.FC<ElementPositionControlProps> = ({
  elementName,
  buttonText,
  showElement,
  toggleElement,
  positioningElement,
  togglePositioning,
  moveElement,
  offset,
  disabled = false,
  children,
}) => {
  // Helper for position display
  const getPositionValue = (offset: number) => {
    if (offset === 0) return '0';
    return offset > 0 ? `+${offset}` : `${offset}`;
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant={showElement ? "default" : "outline"}
          className="w-24 h-8"
          onClick={toggleElement}
        >
          {showElement ? buttonText : `${buttonText} Off`}
        </Button>
        <Button
          type="button"
          variant={positioningElement === elementName ? "secondary" : "outline"}
          size="icon"
          className="h-8 w-8"
          onClick={() => togglePositioning(elementName)}
          disabled={disabled || !showElement}
        >
          {getPositionValue(offset)}
        </Button>
        {positioningElement === elementName && (
          <>
            <Button
              type="button"
              size="icon"
              className="h-8 w-8"
              onClick={() => moveElement(elementName, 'up')}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              className="h-8 w-8"
              onClick={() => moveElement(elementName, 'down')}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
      {showElement && children}
    </div>
  );
};
