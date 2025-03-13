import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import ExtensionPopup from "./components/ExtensionPopup";
import "./index.css";

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

const Popup = () => {
  const [isSelectionActive, setIsSelectionActive] = useState(false);
  const [selectedElement, setSelectedElement] = useState<ElementInfo | null>(
    null,
  );
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);

  // Load history from storage on initial load
  useEffect(() => {
    chrome.storage.local.get(["locatorHistory"], (result) => {
      if (result.locatorHistory) {
        setHistoryItems(JSON.parse(result.locatorHistory));
      }
    });
  }, []);

  // Listen for messages from content script
  useEffect(() => {
    const messageListener = (message: any) => {
      if (message.action === "elementSelected") {
        const newElement = message.data;
        setSelectedElement(newElement);
        setIsSelectionActive(false);

        // Add to history
        const historyItem: HistoryItem = {
          id: Date.now().toString(),
          timestamp: new Date(),
          element: `${newElement.tagName}${newElement.locators.id ? `#${newElement.locators.id}` : ""}`,
          locators: newElement.locators,
        };

        setHistoryItems((prev) => {
          const newHistory = [historyItem, ...prev];
          // Save to storage
          chrome.storage.local.set({
            locatorHistory: JSON.stringify(newHistory),
          });
          return newHistory;
        });
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  const handleActivateSelection = () => {
    // Send message to content script to activate selection
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "activateSelection" });
        setIsSelectionActive(true);
      }
    });
  };

  const handleClearHistory = () => {
    setHistoryItems([]);
    chrome.storage.local.remove(["locatorHistory"]);
  };

  const handleCopyLocator = (locator: string, type: string) => {
    navigator.clipboard.writeText(locator);
  };

  return (
    <ExtensionPopup
      isOpen={true}
      selectedElement={selectedElement || undefined}
      historyItems={historyItems}
      onActivateSelection={handleActivateSelection}
      isSelectionActive={isSelectionActive}
      onClearHistory={handleClearHistory}
    />
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
);
