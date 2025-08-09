# Maven Dependency Visualizer

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-16%2B-green.svg)](https://nodejs.org/)

An interactive web application for visualizing and exploring Maven dependency trees. Transform your `mvn dependency:tree` output into an interactive, searchable tree structure with detailed statistics and analysis.

## Features

- **📊 Interactive Tree Visualization**: Click to expand/collapse dependency branches
- **🔍 Real-time Search**: Find dependencies instantly with path navigation
- **📈 Dependency Statistics**: View counts, depth analysis, and scope breakdown
- **⌨️ Keyboard Shortcuts**: Ctrl+Enter to parse, Ctrl+F to search
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **🎯 Maven Format Support**: Handles standard `mvn dependency:tree` output including omitted dependencies

## Screenshots

### Input and Search Interface
![Maven Dependency Input](docs/Screenshot1%20-%20input%20and%20search.PNG)

### Interactive Tree Visualization with Statistics
![Dependency Tree Visualization](docs/Screenshot2%20-%20Visualisation%20and%20stats.PNG)

## Getting Started

### Prerequisites

- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js)

### Installation

1. **Clone or download the repository:**
   ```bash
   git clone <repository-url>
   cd MavenVisualiser
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the application:**
   ```bash
   npm start
   ```

4. **Open your browser and navigate to:**
   ```
   http://localhost:3000
   ```

### Development

For development with auto-reload functionality:

```bash
npm run dev
```

This requires `nodemon` which is included in the dev dependencies.

## Usage

1. **Generate Maven dependency tree output:**
   ```bash
   mvn dependency:tree
   ```

2. **Copy the output** from your terminal

3. **Paste the output** into the text area in the web application

4. **Click "Parse Dependencies"** or use the keyboard shortcut `Ctrl+Enter`

5. **Explore your dependencies:**
   - Click on any dependency to expand/collapse its children
   - Use the search box to find specific dependencies
   - View detailed statistics in the sidebar
   - Use "Expand All" or "Collapse All" for bulk operations

### Example Input

The application supports standard Maven dependency tree output like:

```
[INFO] com.example:my-project:jar:1.0.0
[INFO] +- org.springframework:spring-core:jar:5.3.21:compile
[INFO] |  \- org.springframework:spring-jcl:jar:5.3.21:compile
[INFO] +- junit:junit:jar:4.13.2:test
[INFO] |  \- org.hamcrest:hamcrest-core:jar:1.3:test
[INFO] \- org.slf4j:slf4j-api:jar:1.7.36:compile
```

## Technology Stack

- **Backend**: Node.js with Express.js
- **Frontend**: Vanilla HTML, CSS, and JavaScript
- **Architecture**: Client-side parsing and rendering with Express server for static file serving

## Project Structure

```
MavenVisualiser/
├── public/
│   ├── index.html      # Main application UI
│   ├── styles.css      # Application styling
│   ├── parser.js       # Maven dependency tree parser
│   ├── visualizer.js   # Tree visualization and rendering
│   └── app.js         # Main application logic and event handling
├── examples/
│   └── example_01.txt  # Sample Maven dependency tree output
├── docs/
│   ├── Screenshot1 - input and search.PNG
│   └── Screenshot2 - Visualisation and stats.PNG
├── server.js           # Express.js server
├── package.json        # Node.js dependencies and scripts
└── CLAUDE.md          # Development guidelines for Claude Code
```

## Key Components

### MavenDependencyParser (`parser.js`)
- Parses `mvn dependency:tree` output with robust format handling
- Supports various Maven output formats including omitted dependencies
- Builds hierarchical dependency tree structure
- Provides comprehensive search functionality

### DependencyVisualizer (`visualizer.js`)
- Renders interactive tree visualization with smooth animations
- Handles expand/collapse functionality with state management
- Manages node highlighting and navigation
- Provides smooth scrolling to specific dependencies

### MavenVisualizerApp (`app.js`)
- Main application controller coordinating all components
- Handles user interactions and keyboard shortcuts
- Manages application state and statistics calculation
- Provides error handling and user feedback

## Supported Maven Output Features

- ✅ Standard tree structure with `+-` and `\-` characters
- ✅ Dependency coordinates (`groupId:artifactId:type:version:scope`)
- ✅ Omitted dependencies with conflict reasons
- ✅ Multiple dependency scopes (compile, provided, runtime, test)
- ✅ Transitive dependency analysis
- ✅ Duplicate detection and handling

## Development Guidelines

This project follows specific development conventions documented in `CLAUDE.md`. Key points:

- Vanilla JavaScript approach (no external frameworks)
- Client-side parsing and rendering
- Responsive design principles
- Comprehensive error handling
- Clean, maintainable code structure

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Troubleshooting

### Common Issues

**Q: The parser doesn't recognize my Maven output**
- Ensure you're using the output from `mvn dependency:tree`
- Check that the output includes the `[INFO]` prefixes
- Try with the `-Dverbose` flag: `mvn dependency:tree -Dverbose`

**Q: Search is not working**
- Make sure dependencies have been parsed first
- Search is case-sensitive for exact matching
- Use partial terms for broader search results

**Q: Statistics are not showing**
- Ensure the dependency tree was successfully parsed
- Check the browser console for any JavaScript errors
- Try refreshing the page and re-parsing

### Browser Compatibility

- Chrome/Chromium 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Roadmap

- [ ] Export functionality (JSON, CSV)
- [ ] Dependency conflict visualization
- [ ] Version comparison features
- [ ] Integration with popular build tools
- [ ] Dark mode support
- [ ] Dependency vulnerability scanning integration

---

**Built with ❤️ for the Java development community**