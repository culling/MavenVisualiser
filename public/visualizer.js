class DependencyVisualizer {
    constructor(container) {
        this.container = container;
        this.filteredNodes = new Set();
        this.highlightedNodes = new Set();
    }

    render(dependencyTree) {
        this.container.innerHTML = '';
        
        if (!dependencyTree || (!dependencyTree.children || dependencyTree.children.length === 0)) {
            this.renderEmptyState();
            return;
        }

        const treeElement = document.createElement('div');
        treeElement.className = 'tree-root';
        
        this.renderNode(dependencyTree, treeElement, 0);
        this.container.appendChild(treeElement);
    }

    renderNode(node, parentElement, depth) {
        const nodeElement = document.createElement('div');
        nodeElement.className = 'tree-node';
        nodeElement.setAttribute('data-node-id', this.getNodeId(node));
        
        const contentElement = document.createElement('div');
        contentElement.className = 'node-content';
        
        if (this.highlightedNodes.has(this.getNodeId(node))) {
            contentElement.classList.add('highlighted');
        }

        // Create toggle button
        const hasChildren = node.children && node.children.length > 0;
        const toggleButton = document.createElement('button');
        toggleButton.className = `node-toggle ${hasChildren ? '' : 'leaf'}`;
        toggleButton.innerHTML = hasChildren ? (node.expanded ? '−' : '+') : '';
        
        if (hasChildren) {
            toggleButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleNode(node);
            });
        }

        // Create node info
        const infoElement = document.createElement('div');
        infoElement.className = 'node-info';
        
        const nameElement = document.createElement('span');
        nameElement.className = 'node-name';
        nameElement.textContent = node.name || node.fullName || 'Unknown';
        
        const detailsElement = document.createElement('span');
        detailsElement.className = 'node-details';
        
        if (node.version) {
            detailsElement.textContent = node.version;
        }
        
        if (node.scope && node.scope !== 'compile') {
            const scopeElement = document.createElement('span');
            scopeElement.className = `node-scope scope-${node.scope}`;
            scopeElement.textContent = node.scope;
            detailsElement.appendChild(scopeElement);
        }
        
        if (node.isOmitted) {
            nameElement.classList.add('omitted');
            detailsElement.textContent += ` (omitted: ${node.omittedReason})`;
        }

        infoElement.appendChild(nameElement);
        if (detailsElement.textContent || detailsElement.children.length > 0) {
            infoElement.appendChild(detailsElement);
        }

        contentElement.appendChild(toggleButton);
        contentElement.appendChild(infoElement);
        nodeElement.appendChild(contentElement);

        // Add children if expanded
        if (hasChildren && node.expanded) {
            const childrenElement = document.createElement('div');
            childrenElement.className = 'children';
            
            for (const child of node.children) {
                this.renderNode(child, childrenElement, depth + 1);
            }
            
            nodeElement.appendChild(childrenElement);
        }

        parentElement.appendChild(nodeElement);
    }

    renderEmptyState() {
        const emptyElement = document.createElement('div');
        emptyElement.className = 'empty-state';
        emptyElement.innerHTML = `
            <h3>No Dependencies</h3>
            <p>Parse a Maven dependency tree to see the visualization here.</p>
        `;
        this.container.appendChild(emptyElement);
    }

    toggleNode(node) {
        node.expanded = !node.expanded;
        this.refreshNode(node);
    }

    refreshNode(node) {
        const nodeElement = this.container.querySelector(`[data-node-id="${this.getNodeId(node)}"]`);
        if (!nodeElement) return;

        const parent = nodeElement.parentNode;
        const nextSibling = nodeElement.nextSibling;
        
        nodeElement.remove();
        
        const tempContainer = document.createElement('div');
        this.renderNode(node, tempContainer, 0);
        
        if (nextSibling) {
            parent.insertBefore(tempContainer.firstChild, nextSibling);
        } else {
            parent.appendChild(tempContainer.firstChild);
        }
    }

    expandAll(node) {
        if (node.children) {
            node.expanded = true;
            for (const child of node.children) {
                this.expandAll(child);
            }
        }
    }

    collapseAll(node) {
        if (node.children) {
            node.expanded = false;
            for (const child of node.children) {
                this.collapseAll(child);
            }
        }
    }

    highlightNodes(nodeIds) {
        this.highlightedNodes.clear();
        nodeIds.forEach(id => this.highlightedNodes.add(id));
        
        // Remove existing highlights
        this.container.querySelectorAll('.node-content.highlighted').forEach(el => {
            el.classList.remove('highlighted');
        });
        
        // Add new highlights
        nodeIds.forEach(nodeId => {
            const nodeElement = this.container.querySelector(`[data-node-id="${nodeId}"]`);
            if (nodeElement) {
                const contentElement = nodeElement.querySelector('.node-content');
                if (contentElement) {
                    contentElement.classList.add('highlighted');
                }
            }
        });
    }

    clearHighlights() {
        this.highlightedNodes.clear();
        this.container.querySelectorAll('.node-content.highlighted').forEach(el => {
            el.classList.remove('highlighted');
        });
    }

    getNodeId(node) {
        return `${node.groupId || ''}:${node.artifactId || ''}:${node.version || ''}:${node.scope || ''}`.replace(/[^a-zA-Z0-9:-]/g, '_');
    }

    scrollToNode(nodeId) {
        const nodeElement = this.container.querySelector(`[data-node-id="${nodeId}"]`);
        if (nodeElement) {
            nodeElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            
            // Temporarily highlight the node
            const contentElement = nodeElement.querySelector('.node-content');
            if (contentElement) {
                contentElement.style.backgroundColor = '#007bff';
                contentElement.style.color = 'white';
                
                setTimeout(() => {
                    contentElement.style.backgroundColor = '';
                    contentElement.style.color = '';
                }, 1000);
            }
        }
    }
}