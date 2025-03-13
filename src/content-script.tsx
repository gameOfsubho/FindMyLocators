import React from "react";
import ReactDOM from "react-dom/client";
import ElementHighlighter from "./components/ElementHighlighter";
import ExtensionPopup from "./components/ExtensionPopup";

// Create container for the highlighter
const highlighterContainer = document.createElement("div");
highlighterContainer.id = "findmylocators-highlighter-container";
document.body.appendChild(highlighterContainer);

// Create container for messages from popup
const messageListener = () => {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "activateSelection") {
      // Render the highlighter
      const root = ReactDOM.createRoot(highlighterContainer);
      root.render(
        <ElementHighlighter
          isActive={true}
          onElementSelect={(element) => {
            // Generate locators
            const id = element.id ? element.id : undefined;
            const className =
              element.className && typeof element.className === "string"
                ? element.className
                : undefined;

            // Generate XPath
            const xpath = generateXPath(element);
            const css = generateCssSelector(element);

            // Send locators back to popup
            chrome.runtime.sendMessage({
              action: "elementSelected",
              data: {
                tagName: element.tagName.toLowerCase(),
                locators: {
                  xpath,
                  css,
                  ...(id && { id }),
                  ...(className && { className }),
                },
              },
            });

            // Remove highlighter after selection
            root.unmount();
          }}
        />,
      );
      sendResponse({ status: "Highlighter activated" });
    }
    return true;
  });
};

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

// Initialize the message listener
messageListener();
