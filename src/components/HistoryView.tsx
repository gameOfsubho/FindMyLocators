import React, { useState } from "react";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Badge } from "./ui/badge";
import { Clipboard, Clock, Trash2 } from "lucide-react";

interface HistoryItem {
  id: string;
  timestamp: Date;
  element: string;
  locators: {
    xpath: string;
    css: string;
    id?: string;
    className?: string;
  };
}

interface HistoryViewProps {
  historyItems?: HistoryItem[];
  onCopyLocator?: (locator: string) => void;
  onClearHistory?: () => void;
  darkMode?: boolean;
}

const HistoryView = ({
  historyItems = [
    {
      id: "1",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      element: "Submit Button",
      locators: {
        xpath: '//button[@type="submit"]',
        css: 'button[type="submit"]',
        id: "submit-btn",
      },
    },
    {
      id: "2",
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
      element: "Username Input",
      locators: {
        xpath: '//input[@name="username"]',
        css: 'input[name="username"]',
        id: "username-input",
      },
    },
    {
      id: "3",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      element: "Navigation Menu",
      locators: {
        xpath: '//nav[@class="main-nav"]',
        css: "nav.main-nav",
        className: "main-nav",
      },
    },
  ],
  onCopyLocator = () => {},
  onClearHistory = () => {},
  darkMode = false,
}: HistoryViewProps) => {
  const [activeTab, setActiveTab] = useState("xpath");

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const copyToClipboard = (locator: string) => {
    onCopyLocator(locator);
  };

  return (
    <div
      className={`w-full h-full ${darkMode ? "bg-slate-800" : "bg-white"} p-4 rounded-md shadow-sm transition-colors duration-300`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock
            className={`h-4 w-4 ${darkMode ? "text-slate-400" : "text-gray-500"}`}
          />
          <h3 className={`text-sm font-medium ${darkMode ? "text-white" : ""}`}>
            Selection History
          </h3>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearHistory}
                className={`h-8 px-2 ${darkMode ? "text-slate-400 hover:text-white hover:bg-slate-700" : ""}`}
              >
                <Trash2
                  className={`h-4 w-4 ${darkMode ? "text-slate-400" : "text-gray-500"}`}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Clear history</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {historyItems.length === 0 ? (
        <div
          className={`flex flex-col items-center justify-center h-[200px] ${darkMode ? "text-slate-400" : "text-gray-500"}`}
        >
          <Clock className="h-12 w-12 mb-2 opacity-20" />
          <p className="text-sm">No history items yet</p>
          <p className="text-xs">Selected elements will appear here</p>
        </div>
      ) : (
        <ScrollArea className="h-[250px] pr-4">
          <div className="space-y-3">
            {historyItems.map((item) => (
              <div
                key={item.id}
                className={`p-3 border rounded-md ${darkMode ? "border-slate-700 hover:bg-slate-700" : "hover:bg-gray-50"} transition-colors`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span
                      className={`text-sm font-medium ${darkMode ? "text-white" : ""}`}
                    >
                      {item.element}
                    </span>
                    <Badge
                      variant={darkMode ? "outline" : "outline"}
                      className={`ml-2 text-xs ${darkMode ? "border-slate-600 text-slate-300" : ""}`}
                    >
                      {formatTime(item.timestamp)}
                    </Badge>
                  </div>
                </div>

                <Tabs
                  defaultValue={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList
                    className={`grid grid-cols-4 h-8 ${darkMode ? "bg-slate-700" : ""}`}
                  >
                    <TabsTrigger
                      value="xpath"
                      className={`text-xs ${darkMode ? "data-[state=active]:bg-slate-600 text-slate-300 data-[state=active]:text-white" : ""}`}
                    >
                      XPath
                    </TabsTrigger>
                    <TabsTrigger
                      value="css"
                      className={`text-xs ${darkMode ? "data-[state=active]:bg-slate-600 text-slate-300 data-[state=active]:text-white" : ""}`}
                    >
                      CSS
                    </TabsTrigger>
                    <TabsTrigger
                      value="id"
                      className={`text-xs ${darkMode ? "data-[state=active]:bg-slate-600 text-slate-300 data-[state=active]:text-white" : ""}`}
                    >
                      ID
                    </TabsTrigger>
                    <TabsTrigger
                      value="class"
                      className={`text-xs ${darkMode ? "data-[state=active]:bg-slate-600 text-slate-300 data-[state=active]:text-white" : ""}`}
                    >
                      Class
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="xpath" className="mt-2">
                    <div
                      className={`flex items-center justify-between ${darkMode ? "bg-slate-900 text-slate-300" : "bg-gray-50"} p-2 rounded text-xs font-mono`}
                    >
                      <code className="truncate">{item.locators.xpath}</code>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-6 w-6 p-0 ${darkMode ? "text-slate-400 hover:text-white hover:bg-slate-700" : ""}`}
                        onClick={() => copyToClipboard(item.locators.xpath)}
                      >
                        <Clipboard className="h-3 w-3" />
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="css" className="mt-2">
                    <div
                      className={`flex items-center justify-between ${darkMode ? "bg-slate-900 text-slate-300" : "bg-gray-50"} p-2 rounded text-xs font-mono`}
                    >
                      <code className="truncate">{item.locators.css}</code>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-6 w-6 p-0 ${darkMode ? "text-slate-400 hover:text-white hover:bg-slate-700" : ""}`}
                        onClick={() => copyToClipboard(item.locators.css)}
                      >
                        <Clipboard className="h-3 w-3" />
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="id" className="mt-2">
                    {item.locators.id ? (
                      <div
                        className={`flex items-center justify-between ${darkMode ? "bg-slate-900 text-slate-300" : "bg-gray-50"} p-2 rounded text-xs font-mono`}
                      >
                        <code className="truncate">{item.locators.id}</code>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-6 w-6 p-0 ${darkMode ? "text-slate-400 hover:text-white hover:bg-slate-700" : ""}`}
                          onClick={() =>
                            copyToClipboard(item.locators.id || "")
                          }
                        >
                          <Clipboard className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div
                        className={`text-xs ${darkMode ? "text-slate-400" : "text-gray-500"} italic p-2`}
                      >
                        No ID available
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="class" className="mt-2">
                    {item.locators.className ? (
                      <div
                        className={`flex items-center justify-between ${darkMode ? "bg-slate-900 text-slate-300" : "bg-gray-50"} p-2 rounded text-xs font-mono`}
                      >
                        <code className="truncate">
                          {item.locators.className}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-6 w-6 p-0 ${darkMode ? "text-slate-400 hover:text-white hover:bg-slate-700" : ""}`}
                          onClick={() =>
                            copyToClipboard(item.locators.className || "")
                          }
                        >
                          <Clipboard className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div
                        className={`text-xs ${darkMode ? "text-slate-400" : "text-gray-500"} italic p-2`}
                      >
                        No class available
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default HistoryView;
