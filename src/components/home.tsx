import React, { useState, useCallback } from "react";
import ExtensionPopup from "./ExtensionPopup";
import DemoWebpage from "./DemoWebpage";
import ElementHighlighter from "./ElementHighlighter";
import Logo from "./Logo";

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

const Home = () => {
  const [isSelectionActive, setIsSelectionActive] = useState(false);
  const [selectedElement, setSelectedElement] = useState<ElementInfo | null>(
    null,
  );
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(true);

  const handleActivateSelection = useCallback(() => {
    setIsSelectionActive((prev) => !prev);
  }, []);

  const handleElementSelect = useCallback((element: HTMLElement) => {
    // Generate locators for the selected element
    const id = element.id ? element.id : undefined;
    const className =
      element.className && typeof element.className === "string"
        ? element.className
        : undefined;

    // Generate locators
    const xpath = generateXPath(element);
    const css = generateCssSelector(element);

    const newElement: ElementInfo = {
      tagName: element.tagName.toLowerCase(),
      locators: {
        xpath,
        css,
        ...(id && { id }),
        ...(className && { className }),
      },
    };

    setSelectedElement(newElement);
    setIsSelectionActive(false);

    // Add to history
    const historyItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: new Date(),
      element: `${newElement.tagName}${id ? `#${id}` : ""}`,
      locators: newElement.locators,
    };

    setHistoryItems((prev) => [historyItem, ...prev]);
  }, []);

  // XPath generator with improved handling of element hierarchy
  const generateXPath = (element: HTMLElement): string => {
    // If element has an ID, use it directly for a simple, reliable XPath
    if (element.id) {
      return `//${element.tagName.toLowerCase()}[@id='${element.id}']`;
    }

    // If element has text content, try to use that
    const textContent = element.textContent?.trim();
    if (textContent && textContent.length < 50) {
      // Only use text if it's reasonably short
      return `//${element.tagName.toLowerCase()}[contains(text(),'${textContent.replace(/'/g, "'")}')`;
    }

    // Otherwise, build a path
    let path = "";
    let current = element;

    while (current && current !== document.body) {
      let tag = current.tagName.toLowerCase();
      let id = current.id ? `[@id='${current.id}']` : "";

      if (id) {
        path = `//${tag}${id}${path ? path : ""}`;
        break;
      }

      // Try to use a class if available
      if (
        current.className &&
        typeof current.className === "string" &&
        current.className.trim()
      ) {
        const classes = current.className.trim().split(/\s+/).filter(Boolean);
        if (classes.length > 0) {
          path = `/${tag}[contains(@class,'${classes[0]}')]${path}`;
          current = current.parentElement as HTMLElement;
          continue;
        }
      }

      // Otherwise use position
      let index = 1;
      let sibling = current.previousElementSibling;

      while (sibling) {
        if (sibling.tagName.toLowerCase() === tag) {
          index++;
        }
        sibling = sibling.previousElementSibling;
      }

      path = `/${tag}[${index}]${path}`;
      current = current.parentElement as HTMLElement;
    }

    return `//${element.tagName.toLowerCase()}${element.id ? `[@id='${element.id}']` : path}`;
  };

  // CSS selector generator with improved class handling
  const generateCssSelector = (element: HTMLElement): string => {
    // If element has an ID, use it directly
    if (element.id) {
      return `#${element.id}`;
    }

    // Try to use classes if available
    if (
      element.className &&
      typeof element.className === "string" &&
      element.className.trim()
    ) {
      const classes = element.className.trim().split(/\s+/).filter(Boolean);
      if (classes.length > 0) {
        // If there are multiple classes, use the first one that's not a common utility class
        const nonUtilityClasses = classes.filter(
          (cls) =>
            !cls.startsWith("text-") &&
            !cls.startsWith("bg-") &&
            !cls.startsWith("p-") &&
            !cls.startsWith("m-") &&
            !cls.startsWith("flex-") &&
            !cls.startsWith("grid-") &&
            !cls.startsWith("border-"),
        );

        if (nonUtilityClasses.length > 0) {
          return `${element.tagName.toLowerCase()}.${nonUtilityClasses[0]}`;
        }
        return `${element.tagName.toLowerCase()}.${classes[0]}`;
      }
    }

    // Try to create a more specific selector using parent elements
    let current = element;
    let selector = element.tagName.toLowerCase();
    let depth = 0;
    const maxDepth = 3; // Limit how far up the tree we go

    // Add nth-child for more specificity
    const index =
      Array.from(element.parentElement?.children || []).indexOf(element) + 1;
    if (index > 0) {
      selector = `${selector}:nth-child(${index})`;
    }

    while (
      current.parentElement &&
      depth < maxDepth &&
      current !== document.body
    ) {
      current = current.parentElement;
      if (current.id) {
        return `#${current.id} > ${selector}`;
      }

      // Try to use a class from the parent
      if (
        current.className &&
        typeof current.className === "string" &&
        current.className.trim()
      ) {
        const classes = current.className.trim().split(/\s+/).filter(Boolean);
        if (classes.length > 0) {
          const nonUtilityClasses = classes.filter(
            (cls) =>
              !cls.startsWith("text-") &&
              !cls.startsWith("bg-") &&
              !cls.startsWith("p-") &&
              !cls.startsWith("m-"),
          );

          if (nonUtilityClasses.length > 0) {
            return `.${nonUtilityClasses[0]} > ${selector}`;
          }
        }
      }

      depth++;
      selector = `${current.tagName.toLowerCase()} > ${selector}`;
    }

    return selector;
  };

  const handleClearHistory = useCallback(() => {
    setHistoryItems([]);
  }, []);

  const handleCopyLocator = useCallback((locator: string, type: string) => {
    console.log(`Copied ${type} locator: ${locator}`);
    // In a real extension, this would copy to clipboard
    navigator.clipboard.writeText(locator);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-gray-100">
      <div className="container mx-auto p-4">
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Logo size={48} className="mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">
              FindMyLocators Chrome Extension Demo
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            This demo showcases how the FindMyLocators Chrome Extension works.
            Click "Select Element" in the popup to activate the element
            selector, then hover over and click on any element in the demo
            webpage below.
          </p>
          <div className="text-sm text-gray-500 mt-2">by Unn.ai</div>
        </header>

        <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Demo webpage content */}
          <DemoWebpage />

          {/* Element highlighter overlay */}
          <ElementHighlighter
            isActive={isSelectionActive}
            onElementSelect={handleElementSelect}
            highlightColor="rgba(77, 156, 255, 0.3)"
            zIndex={9999}
          />
        </div>
      </div>

      {/* Extension popup */}
      <ExtensionPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        selectedElement={selectedElement || undefined}
        historyItems={historyItems}
        onActivateSelection={handleActivateSelection}
        isSelectionActive={isSelectionActive}
      />

      {/* Toggle button to reopen popup if closed */}
      {!isPopupOpen && (
        <button
          onClick={() => setIsPopupOpen(true)}
          className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          Open Extractor
        </button>
      )}
    </div>
  );
};

export default Home;
