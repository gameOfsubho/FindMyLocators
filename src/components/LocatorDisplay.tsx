import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Copy, Check } from "lucide-react";

interface LocatorDisplayProps {
  locators?: {
    xpath: string;
    css: string;
    id?: string;
    className?: string;
  };
  onCopy?: (locator: string, type: string) => void;
  darkMode?: boolean;
}

const LocatorDisplay = ({
  locators = {
    xpath: "//div[@id='example-element']",
    css: "#example-element",
    id: "example-element",
    className: "example-class",
  },
  onCopy = () => {},
  darkMode = false,
}: LocatorDisplayProps) => {
  const [activeTab, setActiveTab] = useState<string>("xpath");
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({
    xpath: false,
    css: false,
    id: false,
    className: false,
  });

  const handleCopy = (locator: string, type: string) => {
    navigator.clipboard.writeText(locator);
    onCopy(locator, type);

    // Set copied state for this locator type
    setCopiedStates((prev) => ({
      ...prev,
      [type]: true,
    }));

    // Reset copied state after 2 seconds
    setTimeout(() => {
      setCopiedStates((prev) => ({
        ...prev,
        [type]: false,
      }));
    }, 2000);
  };

  // Filter out undefined locators
  const availableLocators = Object.entries(locators).filter(
    ([_, value]) => value !== undefined,
  ) as [string, string][];

  return (
    <div
      className={`w-full h-full p-4 ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"} rounded-md shadow-sm border transition-colors duration-300`}
    >
      <h3
        className={`text-lg font-medium mb-3 ${darkMode ? "text-white" : ""}`}
      >
        Element Locators
      </h3>

      <Tabs
        defaultValue="xpath"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList
          className={`w-full grid grid-cols-4 mb-4 ${darkMode ? "bg-slate-700" : ""}`}
        >
          <TabsTrigger
            value="xpath"
            className={
              darkMode
                ? "data-[state=active]:bg-slate-600 text-slate-300 data-[state=active]:text-white"
                : ""
            }
          >
            XPath
          </TabsTrigger>
          <TabsTrigger
            value="css"
            className={
              darkMode
                ? "data-[state=active]:bg-slate-600 text-slate-300 data-[state=active]:text-white"
                : ""
            }
          >
            CSS
          </TabsTrigger>
          <TabsTrigger
            value="id"
            disabled={!locators.id}
            className={
              darkMode
                ? "data-[state=active]:bg-slate-600 text-slate-300 data-[state=active]:text-white"
                : ""
            }
          >
            ID
          </TabsTrigger>
          <TabsTrigger
            value="className"
            disabled={!locators.className}
            className={
              darkMode
                ? "data-[state=active]:bg-slate-600 text-slate-300 data-[state=active]:text-white"
                : ""
            }
          >
            Class
          </TabsTrigger>
        </TabsList>

        {availableLocators.map(([type, locator]) => (
          <TabsContent key={type} value={type} className="space-y-2">
            <div className="relative">
              <div
                className={`p-3 ${darkMode ? "bg-slate-900 border-slate-700 text-slate-300" : "bg-gray-50 border-gray-200"} rounded-md border text-sm font-mono overflow-x-auto transition-colors duration-300`}
              >
                {locator}
              </div>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`absolute top-2 right-2 h-8 w-8 ${darkMode ? "text-slate-400 hover:text-white hover:bg-slate-700" : ""}`}
                      onClick={() => handleCopy(locator, type)}
                    >
                      {copiedStates[type] ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {copiedStates[type] ? "Copied!" : "Copy to clipboard"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div
              className={`text-sm ${darkMode ? "text-slate-400" : "text-gray-500"}`}
            >
              {type === "xpath" &&
                "XPath provides a flexible way to locate elements in XML/HTML documents."}
              {type === "css" &&
                "CSS selectors offer a concise way to target elements based on their attributes."}
              {type === "id" &&
                "ID selectors are the most efficient way to locate unique elements."}
              {type === "className" &&
                "Class selectors target elements with specific CSS classes."}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div
        className={`mt-4 pt-3 border-t ${darkMode ? "border-slate-700" : "border-gray-200"}`}
      >
        <p
          className={`text-xs ${darkMode ? "text-slate-400" : "text-gray-500"}`}
        >
          Select the most appropriate locator type for your automation needs.
          IDs are generally the most stable option when available.
        </p>
      </div>
    </div>
  );
};

export default LocatorDisplay;
