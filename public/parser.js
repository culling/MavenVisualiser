class MavenDependencyParser {
    constructor() {
        this.dependencyTree = null;
    }

    parse(mavenOutput) {
        const lines = mavenOutput.split('\n');
        const dependencyLines = this.extractDependencyLines(lines);
        this.dependencyTree = this.buildDependencyTree(dependencyLines);
        return this.dependencyTree;
    }

    extractDependencyLines(lines) {
        const dependencyLines = [];
        let inDependencySection = false;

        for (const line of lines) {
            // Start collecting dependencies after the tree command starts
            if (line.includes('--- dependency:') && line.includes('tree')) {
                inDependencySection = true;
                continue;
            }

            // Stop at BUILD SUCCESS or end markers
            if (line.includes('BUILD SUCCESS') || line.includes('--------')) {
                if (inDependencySection && line.includes('--------')) {
                    break;
                }
                continue;
            }

            // Include root project line and all dependency lines
            if (inDependencySection && line.includes('[INFO]')) {
                const cleanLine = line.replace(/^\[INFO\]\s*/, '');
                // Include root project, direct dependencies, and tree structure lines
                if (cleanLine.match(/^[a-zA-Z0-9.-]+:[a-zA-Z0-9.-]+:/) || 
                    cleanLine.includes('+-') || 
                    cleanLine.includes('\\-') || 
                    cleanLine.includes('|')) {
                    dependencyLines.push(line);
                }
            }
        }

        return dependencyLines;
    }

    buildDependencyTree(dependencyLines) {
        if (dependencyLines.length === 0) return null;

        const root = { name: 'Root', children: [], level: -1, fullName: '', type: 'root' };
        const stack = [root];

        for (let i = 0; i < dependencyLines.length; i++) {
            const line = dependencyLines[i];
            const dependency = this.parseDependencyLine(line);
            if (!dependency) continue;

            // Adjust stack to current level
            while (stack.length > dependency.level + 1) {
                stack.pop();
            }

            const parent = stack[stack.length - 1];
            dependency.parent = parent;
            parent.children.push(dependency);
            stack.push(dependency);
        }

        return root.children.length > 0 ? root.children[0] : root;
    }

    parseDependencyLine(line) {
        // Remove [INFO] prefix
        const cleanLine = line.replace(/^\[INFO\]\s*/, '');
        
        // Handle root project line (no tree characters)
        if (cleanLine.match(/^[a-zA-Z0-9.-]+:[a-zA-Z0-9.-]+:/) && !cleanLine.includes('+-') && !cleanLine.includes('\\-') && !cleanLine.includes('|')) {
            const dependencyInfo = cleanLine.trim();
            const parts = dependencyInfo.split(':');
            if (parts.length < 4) return null;

            const groupId = parts[0];
            const artifactId = parts[1];
            const type = parts[2];
            const version = parts[3];
            const scope = parts[4] || 'compile';

            return {
                name: `${groupId}:${artifactId}`,
                fullName: dependencyInfo,
                groupId,
                artifactId,
                type,
                version,
                scope,
                level: 0,
                children: [],
                isOmitted: false,
                omittedReason: '',
                expanded: true
            };
        }
        
        // Calculate level based on indentation characters for tree lines
        const level = this.calculateLevel(cleanLine);
        
        // Extract the dependency part (after tree characters)
        let dependencyMatch = cleanLine.match(/[+\\|-]+\s*(.+?)(?:\s*-\s*omitted|$)/);
        if (!dependencyMatch) {
            // Try alternative pattern for lines with parentheses (omitted dependencies)
            dependencyMatch = cleanLine.match(/[+\\|-]+\s*\((.+?)\s*-\s*omitted/);
            if (!dependencyMatch) return null;
        }

        const dependencyInfo = dependencyMatch[1].trim();
        
        // Handle omitted dependencies
        const isOmitted = line.includes('omitted');
        let omittedReason = '';
        if (isOmitted) {
            const omittedMatch = line.match(/omitted for (.+?)\)/);
            omittedReason = omittedMatch ? omittedMatch[1] : 'unknown';
        }

        // Parse groupId:artifactId:type:version:scope format
        const parts = dependencyInfo.split(':');
        if (parts.length < 4) return null;

        const groupId = parts[0];
        const artifactId = parts[1];
        const type = parts[2];
        const version = parts[3];
        const scope = parts[4] || 'compile';

        return {
            name: `${groupId}:${artifactId}`,
            fullName: dependencyInfo,
            groupId,
            artifactId,
            type,
            version,
            scope,
            level: level + 1, // Increment level since root is level 0
            children: [],
            isOmitted,
            omittedReason,
            expanded: true
        };
    }

    calculateLevel(line) {
        let level = 0;
        let i = 0;
        
        // Count the depth based on tree structure characters
        while (i < line.length) {
            if (line[i] === ' ') {
                i++;
            } else if (line.startsWith('+-', i) || line.startsWith('\\-', i)) {
                // This is a leaf at current level
                break;
            } else if (line[i] === '|') {
                // This indicates we're going deeper
                level++;
                i++;
                // Skip spaces after |
                while (i < line.length && line[i] === ' ') {
                    i++;
                }
            } else {
                break;
            }
        }
        
        return level;
    }

    searchDependencies(query) {
        if (!this.dependencyTree) return [];
        
        const results = [];
        const searchTerm = query.toLowerCase();
        
        this.searchNode(this.dependencyTree, searchTerm, results, []);
        return results;
    }

    searchNode(node, searchTerm, results, path) {
        const currentPath = [...path, node];
        
        if (node.name && node.name.toLowerCase().includes(searchTerm)) {
            results.push({
                node: node,
                path: currentPath
            });
        }
        
        if (node.children) {
            for (const child of node.children) {
                this.searchNode(child, searchTerm, results, currentPath);
            }
        }
    }
}