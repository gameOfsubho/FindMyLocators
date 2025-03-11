import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import PopupHeader from "./PopupHeader";
import LocatorDisplay from "./LocatorDisplay";
import HistoryView from "./HistoryView";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

interface LocatorInfo {
  xpath: string;
  css: string;
  id?: string;
  className?: string;
}

interface ElementInfo {
  tagName: string;
  locators: LocatorInfo;
}

interface HistoryItem {
  id: string;
  timestamp: Date;
  element: string;
  locators: LocatorInfo;
}

interface ExtensionPopupProps {
  isOpen?: boolean;
  onClose?: () => void;
  selectedElement?: ElementInfo;
  historyItems?: HistoryItem[];
  onActivateSelection?: () => void;
  isSelectionActive?: boolean;
}

const ExtensionPopup = ({
  isOpen = true,
  onClose = () => {},
  selectedElement,
  historyItems = [],
  onActivateSelection,
  isSelectionActive = false,
}: ExtensionPopupProps) => {
  const [activeTab, setActiveTab] = useState<"locators" | "history">(
    "locators",
  );
  const [localSelectionActive, setLocalSelectionActive] =
    useState(isSelectionActive);
  const [darkMode, setDarkMode] = useState(false);

  // Sync with parent component's selection state
  useEffect(() => {
    setLocalSelectionActive(isSelectionActive);
  }, [isSelectionActive]);

  const handleActivateSelection = () => {
    const newState = !localSelectionActive;
    setLocalSelectionActive(newState);
    if (onActivateSelection) {
      onActivateSelection();
    } else {
      // Fallback for standalone usage
      console.log("Selection mode toggled:", newState);
    }
  };

  const handleCopyLocator = (locator: string, type: string) => {
    console.log(`Copied ${type} locator: ${locator}`);
    navigator.clipboard.writeText(locator);
  };

  const handleClearHistory = () => {
    console.log("History cleared");
    // In a real extension, this would clear the history
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed top-4 right-4 w-[350px] ${darkMode ? "bg-slate-900" : "bg-white"} rounded-lg shadow-lg border ${darkMode ? "border-slate-700" : "border-gray-200"} overflow-hidden z-50 transition-colors duration-300`}
    >
      <PopupHeader
        title="FindMyLocators"
        onActivateSelection={handleActivateSelection}
        isSelectionActive={localSelectionActive}
        darkMode={darkMode}
      />

      <Tabs
        defaultValue="locators"
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "locators" | "history")}
        className="w-full"
      >
        <div className="px-4 pt-4">
          <TabsList
            className={`grid w-full grid-cols-2 ${darkMode ? "bg-slate-800" : ""}`}
          >
            <TabsTrigger
              value="locators"
              className={
                darkMode
                  ? "data-[state=active]:bg-slate-700 text-slate-300 data-[state=active]:text-white"
                  : ""
              }
            >
              Locators
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className={
                darkMode
                  ? "data-[state=active]:bg-slate-700 text-slate-300 data-[state=active]:text-white"
                  : ""
              }
            >
              History
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="locators" className="p-4">
          {selectedElement ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div
                  className={`px-2 py-1 ${darkMode ? "bg-blue-900 text-blue-100" : "bg-blue-100 text-blue-800"} rounded text-xs font-medium`}
                >
                  {selectedElement.tagName}
                </div>
                <p
                  className={`text-sm ${darkMode ? "text-slate-400" : "text-gray-500"}`}
                >
                  Element selected
                </p>
              </div>
              <LocatorDisplay
                locators={selectedElement.locators}
                onCopy={handleCopyLocator}
                darkMode={darkMode}
              />
            </div>
          ) : (
            <div
              className={`flex flex-col items-center justify-center h-[300px] ${darkMode ? "text-slate-400" : "text-gray-500"}`}
            >
              <p className="text-sm">No element selected</p>
              <p className="text-xs mt-1">Click "Select Element" to begin</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="p-4">
          <HistoryView
            historyItems={historyItems}
            onCopyLocator={(locator) => {
              console.log(`Copied from history: ${locator}`);
              navigator.clipboard.writeText(locator);
            }}
            onClearHistory={handleClearHistory}
            darkMode={darkMode}
          />
        </TabsContent>
      </Tabs>

      <div
        className={`p-3 ${darkMode ? "bg-slate-800 border-slate-700" : "bg-gray-50 border-gray-200"} border-t text-xs ${darkMode ? "text-slate-400" : "text-gray-500"} flex justify-between items-center transition-colors duration-300`}
      >
        <span>FindMyLocators v1.0 by Unn.ai</span>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleDarkMode}
            className={`relative w-10 h-5 rounded-full ${darkMode ? "bg-blue-600" : "bg-gray-300"} transition-colors duration-300 flex items-center`}
            aria-label="Toggle dark mode"
          >
            <motion.div
              className={`absolute w-4 h-4 rounded-full ${darkMode ? "bg-white" : "bg-white"} flex items-center justify-center`}
              initial={false}
              animate={{
                x: darkMode ? 20 : 4,
              }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              {darkMode ? (
                <Moon className="h-3 w-3 text-blue-600" />
              ) : (
                <Sun className="h-3 w-3 text-amber-500" />
              )}
            </motion.div>
          </button>
          <button
            onClick={onClose}
            className={`${darkMode ? "text-slate-400 hover:text-white" : "text-gray-500 hover:text-gray-700"} transition-colors`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExtensionPopup;
