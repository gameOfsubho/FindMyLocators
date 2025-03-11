import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Crosshair, Info } from "lucide-react";
import Logo from "./Logo";

interface PopupHeaderProps {
  title?: string;
  onActivateSelection?: () => void;
  isSelectionActive?: boolean;
  darkMode?: boolean;
}

const PopupHeader = ({
  title = "FindMyLocators",
  onActivateSelection = () => console.log("Selection mode activated"),
  isSelectionActive = false,
  darkMode = false,
}: PopupHeaderProps) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div
      className={`${darkMode ? "bg-slate-800" : "bg-slate-800"} p-4 rounded-t-lg flex items-center justify-between border-b border-slate-700 transition-colors duration-300`}
    >
      <div className="flex items-center gap-2">
        <Logo size={24} className="mr-1" />
        <h1 className="text-lg font-semibold text-white">{title}</h1>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full"
              >
                <Info size={14} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Select elements to extract locators</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Button
        variant={isSelectionActive ? "destructive" : "secondary"}
        size="sm"
        className={`transition-all duration-200 ${isHovering && !isSelectionActive ? "bg-blue-600 text-white" : ""} ${darkMode && !isSelectionActive && !isHovering ? "bg-slate-700 text-slate-200 hover:bg-slate-600" : ""}`}
        onClick={onActivateSelection}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <Crosshair size={16} className="mr-2" />
        {isSelectionActive ? "Cancel" : "Select Element"}
      </Button>
    </div>
  );
};

export default PopupHeader;
