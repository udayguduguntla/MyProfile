// File Manager Core - Data Management and Storage
class FileManagerCore {
    constructor() {
        this.currentPath = '/';
        this.fileSystem = this.loadFileSystem();
        this.recycleBin = this.loadRecycleBin();
        this.clipboard = null;
        this.selectedItems = new Set();
        this.viewMode = 'grid';
        
        // Initialize default file system if empty
        if (Object.keys(this.fileSystem).length === 0) {
            this.initializeDefaultFileSystem();
        }
    }

    // Initialize default file system structure
    initializeDefaultFileSystem() {
        this.fileSystem = {
            '/': {
                type: 'folder',
                name: 'Root',
                children: ['documents', 'images', 'projects', 'sample.txt'],
                created: new Date().toISOString(),
                modified: new Date().toISOString()
            },
            '/documents': {
                type: 'folder',
                name: 'Documents',
                children: ['readme.md', 'notes.txt'],
                created: new Date().toISOString(),
                modified: new Date().toISOString()
            },
            '/images': {
                type: 'folder',
                name: 'Images',
                children: ['avatar.png', 'logo.svg'],
                created: new Date().toISOString(),
                modified: new Date().toISOString()
            },
            '/projects': {
                type: 'folder',
                name: 'Projects',
                children: ['website', 'app'],
                created: new Date().toISOString(),
                modified: new Date().toISOString()
            },
            '/sample.txt': {
                type: 'file',
                name: 'sample.txt',
                size: 1024,
                content: 'This is a sample text file.',
                created: new Date().toISOString(),
                modified: new Date().toISOString()
            },
            '/documents/readme.md': {
                type: 'file',
                name: 'readme.md',
                size: 2048,
                content: '# Welcome to File Manager\n\nThis is a robust file management system.',
                created: new Date().toISOString(),
                modified: new Date().toISOString()
            },
            '/documents/notes.txt': {
                type: 'file',
                name: 'notes.txt',
                size: 512,
                content: 'Important notes and reminders.',
                created: new Date().toISOString(),
                modified: new Date().toISOString()
            },
            '/images/avatar.png': {
                type: 'file',
                name: 'avatar.png',
                size: 15360,
                mimeType: 'image/png',
                created: new Date().toISOString(),
                modified: new Date().toISOString()
            },
            '/images/logo.svg': {
                type: 'file',
                name: 'logo.svg',
                size: 2048,
                mimeType: 'image/svg+xml',
                created: new Date().toISOString(),
                modified: new Date().toISOString()
            },
            '/projects/website': {
                type: 'folder',
                name: 'website',
                children: ['index.html', 'style.css'],
                created: new Date().toISOString(),
                modified: new Date().toISOString()
            },
            '/projects/app': {
                type: 'folder',
                name: 'app',
                children: ['main.js', 'config.json'],
                created: new Date().toISOString(),
                modified: new Date().toISOString()
            },
            '/projects/website/index.html': {
                type: 'file',
                name: 'index.html',
                size: 4096,
                content: '<!DOCTYPE html><html><head><title>My Website</title></head><body><h1>Hello World</h1></body></html>',
                created: new Date().toISOString(),
                modified: new Date().toISOString()
            },
            '/projects/website/style.css': {
                type: 'file',
                name: 'style.css',
                size: 1024,
                content: 'body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }',
                created: new Date().toISOString(),
                modified: new Date().toISOString()
            },
            '/projects/app/main.js': {
                type: 'file',
                name: 'main.js',
                size: 2048,
                content: 'console.log("Hello from main.js");',
                created: new Date().toISOString(),
                modified: new Date().toISOString()
            },
            '/projects/app/config.json': {
                type: 'file',
                name: 'config.json',
                size: 256,
                content: '{"name": "My App", "version": "1.0.0"}',
                created: new Date().toISOString(),
                modified: new Date().toISOString()
            }
        };
        this.saveFileSystem();
    }

    // Load file system from localStorage
    loadFileSystem() {
        try {
            const stored = localStorage.getItem('fileManager_fileSystem');
            return stored ? JSON.parse(stored) : {};
        } catch (error) {
            console.error('Error loading file system:', error);
            return {};
        }
    }

    // Save file system to localStorage
    saveFileSystem() {
        try {
            localStorage.setItem('fileManager_fileSystem', JSON.stringify(this.fileSystem));
        } catch (error) {
            console.error('Error saving file system:', error);
        }
    }

    // Load recycle bin from localStorage
    loadRecycleBin() {
        try {
            const stored = localStorage.getItem('fileManager_recycleBin');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading recycle bin:', error);
            return [];
        }
    }

    // Save recycle bin to localStorage
    saveRecycleBin() {
        try {
            localStorage.setItem('fileManager_recycleBin', JSON.stringify(this.recycleBin));
        } catch (error) {
            console.error('Error saving recycle bin:', error);
        }
    }

    // Get current directory contents
    getCurrentDirectoryContents() {
        const currentDir = this.fileSystem[this.currentPath];
        if (!currentDir || currentDir.type !== 'folder') {
            return [];
        }

        return currentDir.children.map(childName => {
            const childPath = this.joinPath(this.currentPath, childName);
            const childItem = this.fileSystem[childPath];
            return {
                ...childItem,
                path: childPath,
                fullName: childName
            };
        }).filter(item => item.name); // Filter out undefined items
    }

    // Navigate to a path
    navigateTo(path) {
        if (this.fileSystem[path] && this.fileSystem[path].type === 'folder') {
            this.currentPath = path;
            return true;
        }
        return false;
    }

    // Create a new folder
    createFolder(name) {
        const newPath = this.joinPath(this.currentPath, name);
        
        if (this.fileSystem[newPath]) {
            throw new Error('A file or folder with this name already exists');
        }

        // Create the folder
        this.fileSystem[newPath] = {
            type: 'folder',
            name: name,
            children: [],
            created: new Date().toISOString(),
            modified: new Date().toISOString()
        };

        // Add to parent directory
        const parentDir = this.fileSystem[this.currentPath];
        if (parentDir && parentDir.type === 'folder') {
            parentDir.children.push(name);
            parentDir.modified = new Date().toISOString();
        }

        this.saveFileSystem();
        return newPath;
    }

    // Upload/Create a file
    createFile(name, content = '', mimeType = 'text/plain') {
        const newPath = this.joinPath(this.currentPath, name);
        
        if (this.fileSystem[newPath]) {
            throw new Error('A file or folder with this name already exists');
        }

        // Create the file
        this.fileSystem[newPath] = {
            type: 'file',
            name: name,
            size: content.length,
            content: content,
            mimeType: mimeType,
            created: new Date().toISOString(),
            modified: new Date().toISOString()
        };

        // Add to parent directory
        const parentDir = this.fileSystem[this.currentPath];
        if (parentDir && parentDir.type === 'folder') {
            parentDir.children.push(name);
            parentDir.modified = new Date().toISOString();
        }

        this.saveFileSystem();
        return newPath;
    }

    // Delete item (move to recycle bin)
    deleteItem(path) {
        const item = this.fileSystem[path];
        if (!item) {
            throw new Error('Item not found');
        }

        // Add to recycle bin with timestamp
        const recycleItem = {
            ...item,
            originalPath: path,
            deletedAt: new Date().toISOString(),
            id: Date.now() + Math.random()
        };

        // If it's a folder, recursively add all children to recycle bin
        if (item.type === 'folder') {
            this.addFolderToRecycleBin(path, recycleItem);
        }

        this.recycleBin.push(recycleItem);

        // Remove from parent directory
        const parentPath = this.getParentPath(path);
        const parentDir = this.fileSystem[parentPath];
        if (parentDir && parentDir.type === 'folder') {
            const fileName = this.getFileName(path);
            parentDir.children = parentDir.children.filter(child => child !== fileName);
            parentDir.modified = new Date().toISOString();
        }

        // Remove from file system
        this.removeItemRecursively(path);

        this.saveFileSystem();
        this.saveRecycleBin();
    }

    // Recursively add folder contents to recycle bin
    addFolderToRecycleBin(folderPath, recycleItem) {
        const folder = this.fileSystem[folderPath];
        if (folder && folder.type === 'folder') {
            recycleItem.children = [];
            folder.children.forEach(childName => {
                const childPath = this.joinPath(folderPath, childName);
                const childItem = this.fileSystem[childPath];
                if (childItem) {
                    const childRecycleItem = {
                        ...childItem,
                        originalPath: childPath,
                        deletedAt: recycleItem.deletedAt,
                        id: Date.now() + Math.random()
                    };
                    
                    if (childItem.type === 'folder') {
                        this.addFolderToRecycleBin(childPath, childRecycleItem);
                    }
                    
                    recycleItem.children.push(childRecycleItem);
                }
            });
        }
    }

    // Remove item and all children from file system
    removeItemRecursively(path) {
        const item = this.fileSystem[path];
        if (item && item.type === 'folder') {
            item.children.forEach(childName => {
                const childPath = this.joinPath(path, childName);
                this.removeItemRecursively(childPath);
            });
        }
        delete this.fileSystem[path];
    }

    // Restore item from recycle bin
    restoreItem(recycleId) {
        const recycleIndex = this.recycleBin.findIndex(item => item.id === recycleId);
        if (recycleIndex === -1) {
            throw new Error('Item not found in recycle bin');
        }

        const recycleItem = this.recycleBin[recycleIndex];
        const originalPath = recycleItem.originalPath;

        // Check if original path is available
        if (this.fileSystem[originalPath]) {
            throw new Error('Cannot restore: A file with the same name already exists');
        }

        // Restore the item
        const restoredItem = { ...recycleItem };
        delete restoredItem.originalPath;
        delete restoredItem.deletedAt;
        delete restoredItem.id;

        this.fileSystem[originalPath] = restoredItem;

        // If it's a folder, restore all children
        if (restoredItem.type === 'folder') {
            this.restoreFolderChildren(originalPath, recycleItem);
        }

        // Add back to parent directory
        const parentPath = this.getParentPath(originalPath);
        const parentDir = this.fileSystem[parentPath];
        if (parentDir && parentDir.type === 'folder') {
            const fileName = this.getFileName(originalPath);
            if (!parentDir.children.includes(fileName)) {
                parentDir.children.push(fileName);
                parentDir.modified = new Date().toISOString();
            }
        }

        // Remove from recycle bin
        this.recycleBin.splice(recycleIndex, 1);

        this.saveFileSystem();
        this.saveRecycleBin();
    }

    // Restore folder children recursively
    restoreFolderChildren(folderPath, recycleItem) {
        if (recycleItem.children) {
            recycleItem.children.forEach(childRecycleItem => {
                const childPath = this.joinPath(folderPath, childRecycleItem.name);
                const childItem = { ...childRecycleItem };
                delete childItem.originalPath;
                delete childItem.deletedAt;
                delete childItem.id;

                this.fileSystem[childPath] = childItem;

                if (childItem.type === 'folder') {
                    this.restoreFolderChildren(childPath, childRecycleItem);
                }
            });
        }
    }

    // Permanently delete from recycle bin
    permanentlyDelete(recycleId) {
        const recycleIndex = this.recycleBin.findIndex(item => item.id === recycleId);
        if (recycleIndex === -1) {
            throw new Error('Item not found in recycle bin');
        }

        this.recycleBin.splice(recycleIndex, 1);
        this.saveRecycleBin();
    }

    // Empty recycle bin
    emptyRecycleBin() {
        this.recycleBin = [];
        this.saveRecycleBin();
    }

    // Rename item
    renameItem(path, newName) {
        const item = this.fileSystem[path];
        if (!item) {
            throw new Error('Item not found');
        }

        const parentPath = this.getParentPath(path);
        const newPath = this.joinPath(parentPath, newName);

        if (this.fileSystem[newPath]) {
            throw new Error('A file or folder with this name already exists');
        }

        // Update item name
        item.name = newName;
        item.modified = new Date().toISOString();

        // Move in file system
        this.fileSystem[newPath] = item;
        delete this.fileSystem[path];

        // Update parent directory
        const parentDir = this.fileSystem[parentPath];
        if (parentDir && parentDir.type === 'folder') {
            const oldFileName = this.getFileName(path);
            const index = parentDir.children.indexOf(oldFileName);
            if (index !== -1) {
                parentDir.children[index] = newName;
                parentDir.modified = new Date().toISOString();
            }
        }

        // If it's a folder, update all children paths
        if (item.type === 'folder') {
            this.updateChildrenPaths(path, newPath);
        }

        this.saveFileSystem();
        return newPath;
    }

    // Update children paths when folder is renamed
    updateChildrenPaths(oldFolderPath, newFolderPath) {
        Object.keys(this.fileSystem).forEach(path => {
            if (path.startsWith(oldFolderPath + '/')) {
                const relativePath = path.substring(oldFolderPath.length);
                const newPath = newFolderPath + relativePath;
                this.fileSystem[newPath] = this.fileSystem[path];
                delete this.fileSystem[path];
            }
        });
    }

    // Utility methods
    joinPath(parent, child) {
        if (parent === '/') {
            return '/' + child;
        }
        return parent + '/' + child;
    }

    getParentPath(path) {
        if (path === '/') return null;
        const lastSlash = path.lastIndexOf('/');
        return lastSlash === 0 ? '/' : path.substring(0, lastSlash);
    }

    getFileName(path) {
        const lastSlash = path.lastIndexOf('/');
        return path.substring(lastSlash + 1);
    }

    // Get file icon based on type
    getFileIcon(item) {
        if (item.type === 'folder') {
            return 'fas fa-folder';
        }

        const extension = item.name.split('.').pop().toLowerCase();
        const iconMap = {
            // Images
            'jpg': 'fas fa-image',
            'jpeg': 'fas fa-image',
            'png': 'fas fa-image',
            'gif': 'fas fa-image',
            'svg': 'fas fa-image',
            'webp': 'fas fa-image',
            
            // Documents
            'pdf': 'fas fa-file-pdf',
            'doc': 'fas fa-file-word',
            'docx': 'fas fa-file-word',
            'txt': 'fas fa-file-alt',
            'md': 'fas fa-file-alt',
            'rtf': 'fas fa-file-alt',
            
            // Code
            'html': 'fas fa-file-code',
            'css': 'fas fa-file-code',
            'js': 'fas fa-file-code',
            'json': 'fas fa-file-code',
            'xml': 'fas fa-file-code',
            'php': 'fas fa-file-code',
            'py': 'fas fa-file-code',
            'java': 'fas fa-file-code',
            'cpp': 'fas fa-file-code',
            'c': 'fas fa-file-code',
            
            // Archives
            'zip': 'fas fa-file-archive',
            'rar': 'fas fa-file-archive',
            '7z': 'fas fa-file-archive',
            'tar': 'fas fa-file-archive',
            'gz': 'fas fa-file-archive',
            
            // Audio
            'mp3': 'fas fa-file-audio',
            'wav': 'fas fa-file-audio',
            'flac': 'fas fa-file-audio',
            'ogg': 'fas fa-file-audio',
            
            // Video
            'mp4': 'fas fa-file-video',
            'avi': 'fas fa-file-video',
            'mkv': 'fas fa-file-video',
            'mov': 'fas fa-file-video',
            'wmv': 'fas fa-file-video',
            
            // Spreadsheets
            'xls': 'fas fa-file-excel',
            'xlsx': 'fas fa-file-excel',
            'csv': 'fas fa-file-csv',
            
            // Presentations
            'ppt': 'fas fa-file-powerpoint',
            'pptx': 'fas fa-file-powerpoint'
        };

        return iconMap[extension] || 'fas fa-file';
    }

    // Format file size
    formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    // Format date
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }
}