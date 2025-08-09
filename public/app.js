class MavenVisualizerApp {
    constructor() {
        this.parser = new MavenDependencyParser();
        this.visualizer = new DependencyVisualizer(document.getElementById('dependency-tree'));
        this.currentTree = null;
        this.searchResults = [];
        
        this.initializeElements();
        this.attachEventListeners();
        this.updateStats();
    }

    initializeElements() {
        this.elements = {
            mavenInput: document.getElementById('maven-input'),
            parseBtn: document.getElementById('parse-btn'),
            clearBtn: document.getElementById('clear-btn'),
            expandAllBtn: document.getElementById('expand-all-btn'),
            collapseAllBtn: document.getElementById('collapse-all-btn'),
            searchInput: document.getElementById('search-input'),
            clearSearchBtn: document.getElementById('clear-search-btn'),
            searchResults: document.getElementById('search-results'),
            stats: document.getElementById('stats')
        };
    }

    attachEventListeners() {
        // Parse button
        this.elements.parseBtn.addEventListener('click', () => {
            this.parseDependencies();
        });

        // Clear button
        this.elements.clearBtn.addEventListener('click', () => {
            this.clearAll();
        });

        // Expand/Collapse all buttons
        this.elements.expandAllBtn.addEventListener('click', () => {
            this.expandAll();
        });

        this.elements.collapseAllBtn.addEventListener('click', () => {
            this.collapseAll();
        });

        // Search functionality
        this.elements.searchInput.addEventListener('input', (e) => {
            this.performSearch(e.target.value);
        });

        this.elements.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.clearSearch();
            }
        });

        this.elements.clearSearchBtn.addEventListener('click', () => {
            this.clearSearch();
        });

        // Input validation
        this.elements.mavenInput.addEventListener('input', () => {
            const hasContent = this.elements.mavenInput.value.trim().length > 0;
            this.elements.parseBtn.disabled = !hasContent;
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'Enter':
                        e.preventDefault();
                        if (!this.elements.parseBtn.disabled) {
                            this.parseDependencies();
                        }
                        break;
                    case 'f':
                        if (this.currentTree) {
                            e.preventDefault();
                            this.elements.searchInput.focus();
                        }
                        break;
                }
            }
        });
    }

    parseDependencies() {
        const input = this.elements.mavenInput.value.trim();
        if (!input) return;

        try {
            this.elements.parseBtn.disabled = true;
            this.elements.parseBtn.textContent = 'Parsing...';

            // Parse with a small delay to show loading state
            setTimeout(() => {
                try {
                    this.currentTree = this.parser.parse(input);
                    this.visualizer.render(this.currentTree);
                    this.enableTreeControls();
                    this.updateStats();
                    
                    // Show success message briefly
                    this.elements.parseBtn.textContent = 'Parsed!';
                    setTimeout(() => {
                        this.elements.parseBtn.textContent = 'Parse Dependencies';
                        this.elements.parseBtn.disabled = false;
                    }, 1000);
                    
                } catch (error) {
                    console.error('Parsing error:', error);
                    alert('Error parsing Maven output. Please check the format and try again.');
                    this.elements.parseBtn.textContent = 'Parse Dependencies';
                    this.elements.parseBtn.disabled = false;
                }
            }, 100);

        } catch (error) {
            console.error('Parsing error:', error);
            alert('Error parsing Maven output. Please check the format and try again.');
            this.elements.parseBtn.disabled = false;
            this.elements.parseBtn.textContent = 'Parse Dependencies';
        }
    }

    clearAll() {
        this.elements.mavenInput.value = '';
        this.elements.parseBtn.disabled = true;
        this.currentTree = null;
        this.visualizer.render(null);
        this.disableTreeControls();
        this.clearSearch();
        this.updateStats();
    }

    expandAll() {
        if (!this.currentTree) return;
        this.visualizer.expandAll(this.currentTree);
        this.visualizer.render(this.currentTree);
    }

    collapseAll() {
        if (!this.currentTree) return;
        this.visualizer.collapseAll(this.currentTree);
        this.visualizer.render(this.currentTree);
    }

    performSearch(query) {
        if (!this.currentTree || !query.trim()) {
            this.clearSearchResults();
            return;
        }

        this.searchResults = this.parser.searchDependencies(query);
        this.displaySearchResults(this.searchResults);
        
        // Highlight matching nodes in the tree
        const nodeIds = this.searchResults.map(result => 
            this.visualizer.getNodeId(result.node)
        );
        this.visualizer.highlightNodes(nodeIds);
    }

    displaySearchResults(results) {
        const container = this.elements.searchResults;
        container.innerHTML = '';

        if (results.length === 0) {
            container.innerHTML = '<div class="search-result">No matches found</div>';
        } else {
            results.forEach((result, index) => {
                const resultElement = document.createElement('div');
                resultElement.className = 'search-result';
                
                const nameElement = document.createElement('div');
                nameElement.textContent = result.node.name;
                
                const pathElement = document.createElement('div');
                pathElement.className = 'path';
                pathElement.textContent = this.getNodePath(result.path);
                
                resultElement.appendChild(nameElement);
                resultElement.appendChild(pathElement);
                
                resultElement.addEventListener('click', () => {
                    this.navigateToNode(result);
                });
                
                container.appendChild(resultElement);
            });
        }

        container.classList.add('show');
    }

    navigateToNode(result) {
        // Expand the path to the node
        for (const node of result.path) {
            if (node.children && node.children.length > 0) {
                node.expanded = true;
            }
        }
        
        // Re-render and scroll to node
        this.visualizer.render(this.currentTree);
        const nodeId = this.visualizer.getNodeId(result.node);
        this.visualizer.scrollToNode(nodeId);
    }

    getNodePath(path) {
        return path
            .filter(node => node.name && node.name !== 'Root')
            .map(node => node.name)
            .join(' → ');
    }

    clearSearch() {
        this.elements.searchInput.value = '';
        this.clearSearchResults();
        this.visualizer.clearHighlights();
    }

    clearSearchResults() {
        this.elements.searchResults.innerHTML = '';
        this.elements.searchResults.classList.remove('show');
    }

    enableTreeControls() {
        this.elements.searchInput.disabled = false;
        this.elements.expandAllBtn.disabled = false;
        this.elements.collapseAllBtn.disabled = false;
    }

    disableTreeControls() {
        this.elements.searchInput.disabled = true;
        this.elements.expandAllBtn.disabled = true;
        this.elements.collapseAllBtn.disabled = true;
    }

    updateStats() {
        if (!this.currentTree) {
            this.elements.stats.innerHTML = `
                <h3>Statistics</h3>
                <div class="stat-item">
                    <span class="stat-label">Total Dependencies:</span>
                    <span class="stat-value">0</span>
                </div>
            `;
            return;
        }

        const stats = this.calculateStats(this.currentTree);
        
        this.elements.stats.innerHTML = `
            <h3>Statistics</h3>
            <div class="stat-item">
                <span class="stat-label">Total Dependencies:</span>
                <span class="stat-value">${stats.total}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Direct Dependencies:</span>
                <span class="stat-value">${stats.direct}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Transitive Dependencies:</span>
                <span class="stat-value">${stats.transitive}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Max Depth:</span>
                <span class="stat-value">${stats.maxDepth}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Omitted Dependencies:</span>
                <span class="stat-value">${stats.omitted}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Scopes:</span>
                <span class="stat-value">${Object.keys(stats.scopes).length}</span>
            </div>
        `;

        // Add scope breakdown
        if (Object.keys(stats.scopes).length > 0) {
            const scopesHtml = Object.entries(stats.scopes)
                .sort(([,a], [,b]) => b - a)
                .map(([scope, count]) => `
                    <div class="stat-item" style="margin-left: 10px; font-size: 0.9em;">
                        <span class="stat-label scope-${scope}">${scope}:</span>
                        <span class="stat-value">${count}</span>
                    </div>
                `).join('');
            
            this.elements.stats.innerHTML += scopesHtml;
        }
    }

    calculateStats(node, depth = 0, stats = null) {
        if (!stats) {
            stats = {
                total: 0,
                direct: 0,
                transitive: 0,
                maxDepth: 0,
                omitted: 0,
                scopes: {}
            };
        }

        if (node.name && node.name !== 'Root') {
            stats.total++;
            stats.maxDepth = Math.max(stats.maxDepth, depth);
            
            if (depth === 1) {
                stats.direct++;
            } else if (depth > 1) {
                stats.transitive++;
            }
            
            if (node.isOmitted) {
                stats.omitted++;
            }
            
            if (node.scope) {
                stats.scopes[node.scope] = (stats.scopes[node.scope] || 0) + 1;
            }
        }

        if (node.children) {
            for (const child of node.children) {
                this.calculateStats(child, depth + 1, stats);
            }
        }

        return stats;
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new MavenVisualizerApp();
});