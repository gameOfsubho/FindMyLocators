import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface ElementHighlighterProps {
  isActive?: boolean;
  onElementSelect?: (element: HTMLElement) => void;
  highlightColor?: string;
  zIndex?: number;
}

const ElementHighlighter = ({
  isActive = false,
  onElementSelect = () => {},
  highlightColor = "rgba(77, 156, 255, 0.3)",
  zIndex = 9999,
}: ElementHighlighterProps) => {
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(
    null,
  );
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });
  const highlighterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive) {
      setHoveredElement(null);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      // Ignore the highlighter itself to prevent flickering
      if (
        highlighterRef.current &&
        (e.target === highlighterRef.current ||
          highlighterRef.current.contains(e.target as Node))
      ) {
        return;
      }

      // Get the target element - use composedPath() to get through shadow DOM if needed
      let target = e.target as HTMLElement;

      // Get the deepest element at the current mouse position
      const elementsAtPoint = document.elementsFromPoint(e.clientX, e.clientY);
      if (elementsAtPoint.length > 0) {
        // Filter out the highlighter itself
        const filteredElements = elementsAtPoint.filter((el) => {
          return (
            !highlighterRef.current?.contains(el) &&
            el !== highlighterRef.current
          );
        });

        if (filteredElements.length > 0) {
          target = filteredElements[0] as HTMLElement;
        }
      }

      // Skip body and html elements
      if (target === document.body || target === document.documentElement) {
        setHoveredElement(null);
        return;
      }

      // Check for text nodes and highlight their parent element
      if (target.nodeType === Node.TEXT_NODE && target.parentElement) {
        target = target.parentElement;
      }

      if (target !== hoveredElement) {
        setHoveredElement(target);
        updateElementPosition(target);
      }
    };

    const updateElementPosition = (element: HTMLElement) => {
      const rect = element.getBoundingClientRect();
      setPosition({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height,
      });
    };

    const handleClick = (e: MouseEvent) => {
      if (hoveredElement) {
        e.preventDefault();
        e.stopPropagation();
        onElementSelect(hoveredElement);
      }
    };

    const handleScroll = () => {
      if (hoveredElement) {
        updateElementPosition(hoveredElement);
      }
    };

    // Use capture phase to get events before they're handled
    document.addEventListener("mousemove", handleMouseMove, { capture: true });
    document.addEventListener("click", handleClick, { capture: true });
    document.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove, {
        capture: true,
      });
      document.removeEventListener("click", handleClick, { capture: true });
      document.removeEventListener("scroll", handleScroll);
    };
  }, [isActive, hoveredElement, onElementSelect]);

  if (!isActive || !hoveredElement) return null;

  return (
    <motion.div
      ref={highlighterRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        position: "absolute",
        top: position.top,
        left: position.left,
        width: position.width,
        height: position.height,
        backgroundColor: highlightColor,
        border: "2px solid rgba(77, 156, 255, 0.8)",
        borderRadius: "2px",
        pointerEvents: "none",
        zIndex: zIndex,
        boxShadow: "0 0 0 1px rgba(77, 156, 255, 0.3)",
        mixBlendMode: "multiply",
      }}
      className="element-highlighter"
    >
      <div
        className="absolute -top-6 left-0 bg-blue-600 text-white text-xs py-1 px-2 rounded-t-md font-mono"
        style={{ zIndex: zIndex + 1 }}
      >
        {hoveredElement.tagName.toLowerCase()}
        {hoveredElement.id && `#${hoveredElement.id}`}
        {hoveredElement.className &&
          typeof hoveredElement.className === "string" &&
          hoveredElement.className
            .split(" ")
            .filter(Boolean)
            .map((cls) => `.${cls}`)
            .join("")}
      </div>
    </motion.div>
  );
};

export default ElementHighlighter;
