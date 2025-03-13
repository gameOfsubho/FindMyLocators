# FindMyLocators Chrome Extension

## Overview
FindMyLocators is a Chrome extension designed for test automation engineers to extract web element locators through an intuitive point-and-click interface. The extension helps developers and QA professionals quickly generate multiple locator strategies (XPath, CSS, ID, class names) for web elements.

## Features
- Point-and-click element selection
- Multiple locator generation strategies (XPath, CSS, ID, class)
- Dark/light mode toggle
- Element selection history with local storage
- Clipboard integration for locator copying

## Installation

### Development Mode
1. Clone this repository
2. Run `npm install` to install dependencies
3. Run `npm run build-extension` to build the extension
4. Open Chrome and navigate to `chrome://extensions/`
5. Enable "Developer mode" in the top right corner
6. Click "Load unpacked" and select the `dist` directory

### From Chrome Web Store
*(Coming soon)*

## Usage
1. Navigate to the webpage where you want to extract locators
2. Click the FindMyLocators extension icon in your browser toolbar
3. Click "Select Element" in the popup
4. Hover over elements on the page and click to select
5. View and copy the generated locators from the popup
6. Switch between different locator types using the tabs
7. View history of previously selected elements

## Development

### Building the Extension
```
npm run build-extension
```

### Project Structure
- `src/popup.tsx` - Main popup UI entry point
- `src/content-script.tsx` - Content script for element selection
- `src/components/` - React components for the UI
- `public/manifest.json` - Extension manifest file

## Technologies Used
- React with TypeScript
- Tailwind CSS
- ShadcnUI components
- Framer Motion for animations
- Chrome Extension APIs

## License
MIT

## Created by
Unn.ai
