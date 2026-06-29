// File Manager File Operations - Handles file/folder operations
class FileOperations {
    constructor(core, ui) {
        this.core = core;
        this.ui = ui;
        this.clipboard = null;
        this.clipboardOperation = null; // 'copy' or 'cut'
    }

    // Delete selected items
    deleteItems(items) {
        if (items.length === 0) return;

        const itemNames = items.map(item => {
            const path = item.dataset.path;
            const fileItem = this.core.fileSystem[path];
            return fileItem ? fileItem.name : 'Unknown';
        });

        const message = items.length === 1 
            ? `Are you sure you want to delete "${itemNames[0]}"?`
            : `Are you sure you want to delete ${items.length} items?`;

        this.showConfirmDialog(
            'Delete Items',
            message + ' Items will be moved to the Recycle Bin.',
            'Delete',
            'btn-warning'
        ).then(confirmed => {
            if (confirmed) {
                let deletedCount = 0;
                let failedCount = 0;

                items.forEach(item => {
                    try {
                        const path = item.dataset.path;
                        this.core.deleteItem(path);
                        deletedCount++;
                    } catch (error) {
                        failedCount++;
                        console.error('Failed to delete item:', error);
                    }
                });

                this.ui.render();
                this.ui.updateRecycleBinCount();

                if (failedCount === 0) {
                    const message = deletedCount === 1 
                        ? `"${itemNames[0]}" moved to Recycle Bin`
                        : `${deletedCount} items moved to Recycle Bin`;
                    this.ui.showNotification(message, 'success');
                } else {
                    this.ui.showNotification(
                        `${deletedCount} items deleted, ${failedCount} failed`, 
                        'warning'
                    );
                }
            }
        });
    }

    // Rename item
    renameItem(item) {
        const path = item.dataset.path;
        const fileItem = this.core.fileSystem[path];
        if (!fileItem) return;

        const currentName = fileItem.name;
        
        this.showInputDialog(
            'Rename Item',
            'Enter new name:',
            currentName,
            'Rename'
        ).then(newName => {
            if (newName && newName !== currentName) {
                if (!/^[a-zA-Z0-9._-]+(\.[a-zA-Z0-9]+)?$/.test(newName)) {
                    this.ui.showNotification('Invalid file name. Use only letters, numbers, dots, hyphens, and underscores.', 'error');
                    return;
                }

                try {
                    this.core.renameItem(path, newName);
                    this.ui.render();
                    this.ui.showNotification(`Renamed to "${newName}"`, 'success');
                } catch (error) {
                    this.ui.showNotification(error.message, 'error');
                }
            }
        });
    }

    // Copy items to clipboard
    copyItems(items) {
        if (items.length === 0) return;

        this.clipboard = items.map(item => ({
            path: item.dataset.path,
            type: item.dataset.type
        }));
        this.clipboardOperation = 'copy';

        const message = items.length === 1 
            ? `"${this.core.fileSystem[this.clipboard[0].path].name}" copied`
            : `${items.length} items copied`;
        
        this.ui.showNotification(message, 'success');
    }

    // Cut items to clipboard
    cutItems(items) {
        if (items.length === 0) return;

        this.clipboard = items.map(item => ({
            path: item.dataset.path,
            type: item.dataset.type
        }));
        this.clipboardOperation = 'cut';

        // Visual feedback for cut items
        items.forEach(item => {
            item.style.opacity = '0.5';
        });

        const message = items.length === 1 
            ? `"${this.core.fileSystem[this.clipboard[0].path].name}" cut`
            : `${items.length} items cut`;
        
        this.ui.showNotification(message, 'success');
    }

    // Paste items from clipboard
    pasteItems() {
        if (!this.clipboard || this.clipboard.length === 0) {
            this.ui.showNotification('Nothing to paste', 'info');
            return;
        }

        let pastedCount = 0;
        let failedCount = 0;
        const errors = [];

        this.clipboard.forEach(clipboardItem => {
            try {
                const sourceItem = this.core.fileSystem[clipboardItem.path];
                if (!sourceItem) {
                    throw new Error('Source item no longer exists');
                }

                if (this.clipboardOperation === 'copy') {
                    this.copyItemToCurrentDirectory(clipboardItem.path, sourceItem);
                } else if (this.clipboardOperation === 'cut') {
                    this.moveItemToCurrentDirectory(clipboardItem.path, sourceItem);
                }
                pastedCount++;
            } catch (error) {
                failedCount++;
                errors.push(error.message);
            }
        });

        // Clear clipboard if it was a cut operation
        if (this.clipboardOperation === 'cut') {
            this.clearClipboard();
        }

        this.ui.render();

        if (failedCount === 0) {
            const operation = this.clipboardOperation === 'copy' ? 'copied' : 'moved';
            const message = pastedCount === 1 
                ? `1 item ${operation}`
                : `${pastedCount} items ${operation}`;
            this.ui.showNotification(message, 'success');
        } else {
            this.ui.showNotification(
                `${pastedCount} items pasted, ${failedCount} failed`, 
                'warning'
            );
        }
    }

    // Copy item to current directory
    copyItemToCurrentDirectory(sourcePath, sourceItem) {
        let newName = sourceItem.name;
        let counter = 1;

        // Find available name
        while (this.core.fileSystem[this.core.joinPath(this.core.currentPath, newName)]) {
            const nameParts = sourceItem.name.split('.');
            if (nameParts.length > 1) {
                const extension = nameParts.pop();
                const baseName = nameParts.join('.');
                newName = `${baseName} (${counter}).${extension}`;
            } else {
                newName = `${sourceItem.name} (${counter})`;
            }
            counter++;
        }

        if (sourceItem.type === 'file') {
            this.core.createFile(newName, sourceItem.content || '', sourceItem.mimeType || 'text/plain');
        } else {
            const newFolderPath = this.core.createFolder(newName);
            this.copyFolderContents(sourcePath, newFolderPath);
        }
    }

    // Move item to current directory
    moveItemToCurrentDirectory(sourcePath, sourceItem) {
        const newPath = this.core.joinPath(this.core.currentPath, sourceItem.name);
        
        if (this.core.fileSystem[newPath]) {
            throw new Error(`An item named "${sourceItem.name}" already exists`);
        }

        // Move the item
        this.core.fileSystem[newPath] = sourceItem;
        
        // Remove from old location
        delete this.core.fileSystem[sourcePath];
        
        // Update parent directories
        const oldParentPath = this.core.getParentPath(sourcePath);
        const oldParent = this.core.fileSystem[oldParentPath];
        if (oldParent && oldParent.type === 'folder') {
            const fileName = this.core.getFileName(sourcePath);
            oldParent.children = oldParent.children.filter(child => child !== fileName);
            oldParent.modified = new Date().toISOString();
        }

        const newParent = this.core.fileSystem[this.core.currentPath];
        if (newParent && newParent.type === 'folder') {
            newParent.children.push(sourceItem.name);
            newParent.modified = new Date().toISOString();
        }

        // Update paths for folder contents
        if (sourceItem.type === 'folder') {
            this.updateFolderPaths(sourcePath, newPath);
        }

        this.core.saveFileSystem();
    }

    // Copy folder contents recursively
    copyFolderContents(sourceFolderPath, targetFolderPath) {
        const sourceFolder = this.core.fileSystem[sourceFolderPath];
        if (!sourceFolder || sourceFolder.type !== 'folder') return;

        sourceFolder.children.forEach(childName => {
            const childSourcePath = this.core.joinPath(sourceFolderPath, childName);
            const childItem = this.core.fileSystem[childSourcePath];
            if (!childItem) return;

            if (childItem.type === 'file') {
                const childTargetPath = this.core.joinPath(targetFolderPath, childName);
                this.core.fileSystem[childTargetPath] = {
                    ...childItem,
                    created: new Date().toISOString()
                };
                
                // Add to target folder's children
                const targetFolder = this.core.fileSystem[targetFolderPath];
                if (targetFolder && targetFolder.type === 'folder') {
                    targetFolder.children.push(childName);
                }
            } else if (childItem.type === 'folder') {
                const childTargetPath = this.core.joinPath(targetFolderPath, childName);
                this.core.fileSystem[childTargetPath] = {
                    ...childItem,
                    children: [],
                    created: new Date().toISOString()
                };
                
                // Add to target folder's children
                const targetFolder = this.core.fileSystem[targetFolderPath];
                if (targetFolder && targetFolder.type === 'folder') {
                    targetFolder.children.push(childName);
                }
                
                // Recursively copy contents
                this.copyFolderContents(childSourcePath, childTargetPath);
            }
        });
    }

    // Update folder paths when moving
    updateFolderPaths(oldFolderPath, newFolderPath) {
        Object.keys(this.core.fileSystem).forEach(path => {
            if (path.startsWith(oldFolderPath + '/')) {
                const relativePath = path.substring(oldFolderPath.length);
                const newPath = newFolderPath + relativePath;
                this.core.fileSystem[newPath] = this.core.fileSystem[path];
                delete this.core.fileSystem[path];
            }
        });
    }

    // Clear clipboard
    clearClipboard() {
        // Remove visual feedback from cut items
        document.querySelectorAll('.file-item').forEach(item => {
            item.style.opacity = '';
        });
        
        this.clipboard = null;
        this.clipboardOperation = null;
    }

    // Show item properties
    showProperties(item) {
        const path = item.dataset.path;
        const fileItem = this.core.fileSystem[path];
        if (!fileItem) return;

        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="${this.core.getFileIcon(fileItem)}"></i> Properties</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="properties-content">
                        ${this.generatePropertiesHTML(fileItem, path)}
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary close-properties">Close</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Bind events
        modal.querySelector('.modal-close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        modal.querySelector('.close-properties').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    // Generate properties HTML
    generatePropertiesHTML(item, path) {
        const properties = [
            { label: 'Name', value: item.name },
            { label: 'Type', value: item.type === 'folder' ? 'Folder' : 'File' },
            { label: 'Location', value: path },
            { label: 'Size', value: item.type === 'file' ? this.core.formatFileSize(item.size) : this.getFolderSize(path) },
            { label: 'Created', value: this.core.formatDate(item.created) },
            { label: 'Modified', value: this.core.formatDate(item.modified) }
        ];

        if (item.type === 'file' && item.mimeType) {
            properties.splice(2, 0, { label: 'MIME Type', value: item.mimeType });
        }

        if (item.type === 'folder') {
            const itemCount = item.children ? item.children.length : 0;
            properties.splice(3, 0, { label: 'Contains', value: `${itemCount} items` });
        }

        return `
            <div class="properties-grid">
                ${properties.map(prop => `
                    <div class="property-row">
                        <div class="property-label">${prop.label}:</div>
                        <div class="property-value">${prop.value}</div>
                    </div>
                `).join('')}
            </div>
            <style>
                .properties-grid {
                    display: grid;
                    gap: 1rem;
                }
                .property-row {
                    display: grid;
                    grid-template-columns: 120px 1fr;
                    gap: 1rem;
                    align-items: center;
                }
                .property-label {
                    font-weight: 600;
                    color: #cbd5e1;
                }
                .property-value {
                    color: #f1f5f9;
                    word-break: break-all;
                }
            </style>
        `;
    }

    // Get folder size (recursive)
    getFolderSize(folderPath) {
        const folder = this.core.fileSystem[folderPath];
        if (!folder || folder.type !== 'folder') return '0 B';

        let totalSize = 0;
        let itemCount = 0;

        const calculateSize = (path) => {
            const item = this.core.fileSystem[path];
            if (!item) return;

            if (item.type === 'file') {
                totalSize += item.size || 0;
                itemCount++;
            } else if (item.type === 'folder') {
                itemCount++;
                if (item.children) {
                    item.children.forEach(childName => {
                        const childPath = this.core.joinPath(path, childName);
                        calculateSize(childPath);
                    });
                }
            }
        };

        calculateSize(folderPath);
        
        return `${this.core.formatFileSize(totalSize)} (${itemCount} items)`;
    }

    // Duplicate item
    duplicateItem(item) {
        const path = item.dataset.path;
        const fileItem = this.core.fileSystem[path];
        if (!fileItem) return;

        try {
            this.copyItemToCurrentDirectory(path, fileItem);
            this.ui.render();
            this.ui.showNotification(`"${fileItem.name}" duplicated`, 'success');
        } catch (error) {
            this.ui.showNotification(error.message, 'error');
        }
    }

    // Compress items (create archive)
    compressItems(items) {
        if (items.length === 0) return;

        const archiveName = items.length === 1 
            ? `${this.core.fileSystem[items[0].dataset.path].name}.zip`
            : `archive-${new Date().toISOString().split('T')[0]}.zip`;

        this.showInputDialog(
            'Create Archive',
            'Enter archive name:',
            archiveName,
            'Create'
        ).then(name => {
            if (name) {
                try {
                    const archiveContent = this.createArchiveContent(items);
                    this.core.createFile(name, archiveContent, 'application/zip');
                    this.ui.render();
                    this.ui.showNotification(`Archive "${name}" created`, 'success');
                } catch (error) {
                    this.ui.showNotification(error.message, 'error');
                }
            }
        });
    }

    // Create archive content (simplified)
    createArchiveContent(items) {
        const archiveData = {
            created: new Date().toISOString(),
            items: []
        };

        items.forEach(item => {
            const path = item.dataset.path;
            const fileItem = this.core.fileSystem[path];
            if (fileItem) {
                archiveData.items.push({
                    path: path,
                    name: fileItem.name,
                    type: fileItem.type,
                    content: fileItem.content || '',
                    size: fileItem.size || 0
                });
            }
        });

        return JSON.stringify(archiveData, null, 2);
    }

    // Show confirmation dialog
    showConfirmDialog(title, message, confirmText, confirmClass) {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.className = 'modal active';
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>${title}</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <p style="color: #cbd5e1; line-height: 1.6;">${message}</p>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary cancel-btn">Cancel</button>
                        <button class="btn ${confirmClass} confirm-btn">${confirmText}</button>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            const confirmBtn = modal.querySelector('.confirm-btn');
            const cancelBtn = modal.querySelector('.cancel-btn');
            const closeBtn = modal.querySelector('.modal-close');

            const cleanup = () => {
                if (document.body.contains(modal)) {
                    document.body.removeChild(modal);
                }
            };

            confirmBtn.addEventListener('click', () => {
                cleanup();
                resolve(true);
            });

            cancelBtn.addEventListener('click', () => {
                cleanup();
                resolve(false);
            });

            closeBtn.addEventListener('click', () => {
                cleanup();
                resolve(false);
            });

            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    cleanup();
                    resolve(false);
                }
            });

            setTimeout(() => confirmBtn.focus(), 100);
        });
    }

    // Show input dialog
    showInputDialog(title, message, defaultValue = '', confirmText = 'OK') {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.className = 'modal active';
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>${title}</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <p style="color: #cbd5e1; margin-bottom: 1rem;">${message}</p>
                        <input type="text" class="form-input dialog-input" value="${defaultValue}">
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary cancel-btn">Cancel</button>
                        <button class="btn btn-primary confirm-btn">${confirmText}</button>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            const input = modal.querySelector('.dialog-input');
            const confirmBtn = modal.querySelector('.confirm-btn');
            const cancelBtn = modal.querySelector('.cancel-btn');
            const closeBtn = modal.querySelector('.modal-close');

            const cleanup = () => {
                if (document.body.contains(modal)) {
                    document.body.removeChild(modal);
                }
            };

            const confirm = () => {
                const value = input.value.trim();
                cleanup();
                resolve(value || null);
            };

            confirmBtn.addEventListener('click', confirm);
            
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') confirm();
                if (e.key === 'Escape') {
                    cleanup();
                    resolve(null);
                }
            });

            cancelBtn.addEventListener('click', () => {
                cleanup();
                resolve(null);
            });

            closeBtn.addEventListener('click', () => {
                cleanup();
                resolve(null);
            });

            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    cleanup();
                    resolve(null);
                }
            });

            setTimeout(() => {
                input.focus();
                input.select();
            }, 100);
        });
    }
}

// Extend UI class with file operations
FileManagerUI.prototype.deleteItems = function(items) {
    if (this.fileOperations) {
        this.fileOperations.deleteItems(items);
    }
};

FileManagerUI.prototype.renameItem = function(item) {
    if (this.fileOperations) {
        this.fileOperations.renameItem(item);
    }
};

FileManagerUI.prototype.copyItems = function(items) {
    if (this.fileOperations) {
        this.fileOperations.copyItems(items);
    }
};

FileManagerUI.prototype.cutItems = function(items) {
    if (this.fileOperations) {
        this.fileOperations.cutItems(items);
    }
};

FileManagerUI.prototype.showProperties = function(item) {
    if (this.fileOperations) {
        this.fileOperations.showProperties(item);
    }
};