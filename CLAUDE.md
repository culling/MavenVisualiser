# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

The MavenVisualiser is a standalone Node.js web application that provides an interactive visualization of Maven dependency trees. It allows users to paste Maven dependency output and explore dependencies through an interactive tree interface.

## Technology Stack

- **Backend**: Node.js with Express.js
- **Frontend**: Vanilla HTML, CSS, and JavaScript
- **Architecture**: Client-side parsing and rendering with a simple Express server for static file serving

## Development Commands

- `npm install` - Install dependencies
- `npm start` - Start the production server
- `npm run dev` - Start development server with auto-reload (requires nodemon)

## Project Structure

```
public/
├── index.html      # Main application UI
├── styles.css      # Application styling
├── parser.js       # Maven dependency tree parser
├── visualizer.js   # Tree visualization and rendering
└── app.js         # Main application logic and event handling
examples/
└── example_01.txt  # Sample Maven dependency tree output
server.js           # Express.js server
```

## Key Components

### MavenDependencyParser (parser.js)
- Parses `mvn dependency:tree` output
- Handles various Maven output formats including omitted dependencies
- Builds hierarchical dependency tree structure
- Provides search functionality across the dependency tree

### DependencyVisualizer (visualizer.js)
- Renders interactive tree visualization
- Handles expand/collapse functionality
- Manages node highlighting and navigation
- Provides smooth scrolling to specific dependencies

### MavenVisualizerApp (app.js)
- Main application controller
- Coordinates parser and visualizer
- Handles user interactions and search
- Manages application state and statistics

## Features

- **Paste & Parse**: Accepts raw Maven dependency tree output
- **Interactive Tree**: Click to expand/collapse dependency branches
- **Search**: Real-time search with path navigation
- **Statistics**: Displays dependency counts, depth, and scope breakdown
- **Keyboard Shortcuts**: Ctrl+Enter to parse, Ctrl+F to search
- **Responsive Design**: Works on desktop and mobile devices

## Maven Output Format Support

The parser handles standard `mvn dependency:tree` output including:
- Tree structure with `+-` and `\-` characters
- Dependency coordinates (groupId:artifactId:type:version:scope)
- Omitted dependencies with reasons (conflicts, duplicates)
- Various scopes (compile, provided, runtime, test)

## Running the Application

1. Install dependencies: `npm install`
2. Start the server: `npm start`
3. Open http://localhost:3000 in your browser
4. Paste Maven dependency tree output and click "Parse Dependencies"