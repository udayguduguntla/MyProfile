// File Manager Recycle Bin - Handles deleted items management
class RecycleBinManager {
    constructor(core, ui) {
        this.core = core;
        this.ui = ui;
        this.bindEvents();
    }

    bindEvents() {
        // Recycle bin toolbar buttons
        const restoreAllBtn = document.getElementById('restoreAllBtn');
        const emptyBinBtn = document.getElementById('emptyBinBtn');

        if (restoreAllBtn) {
            restoreAllBtn.addEventListener('click', () => this.restoreAll());
        }

        if (emptyBinBtn) {
            emptyBinBtn.addEventListener('click', () => this.emptyBin());
        }
    }

    // Render recycle bin contents
    renderRecycleBin() {
        const recycleBinContent = document.getElementById('recycleBinContent');
        if (!recycleBinContent) return;

        recycleBinContent.innerHTML = '';

        if (this.core.recycleBin.length === 0) {
            recycleBinContent.innerHTML = `
                <div class="empty-recycle-bin">
                    <div style="text-align: center; padding: 3rem; color: #94a3b8;">
                        <i class="fas fa-trash" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                        <h4>Recycle Bin is Empty</h4>
                        <p>Deleted files will appear here</p>
                    </div>
                </div>
            `;
            return;
        }

        // Sort by deletion date (newest first)
        const sortedItems = [...this.core.recycleBin].sort((a, b) => 
            new Date(b.deletedAt) - new Date(a.deletedAt)
        );

        sortedItems.forEach(item => {
            const recycleItem = this.createRecycleItem(item);
            recycleBinContent.appendChild(recycleItem);
        });
    }

    // Create recycle bin item element
    createRecycleItem(item) {
        const recycleItem = document.createElement('div');
        recycleItem.className = 'recycle-item';
        recycleItem.dataset.id = item.id;

        const icon = document.createElement('i');
        icon.className = `file-icon ${this.core.getFileIcon(item)}`;
        
        // Set icon color based on type
        if (item.type === 'folder') {
            icon.style.color = '#60a5fa';
        } else {
            const extension = item.name.split('.').pop().toLowerCase();
            const colorMap = {
                'jpg': '#f59e0b', 'jpeg': '#f59e0b', 'png': '#f59e0b', 'gif': '#f59e0b', 'svg': '#f59e0b',
                'pdf': '#ef4444', 'doc': '#2563eb', 'docx': '#2563eb',
                'html': '#f97316', 'css': '#06b6d4', 'js': '#eab308', 'json': '#22c55e',
                'zip': '#8b5cf6', 'rar': '#8b5cf6', '7z': '#8b5cf6',
                'mp3': '#ec4899', 'wav': '#ec4899', 'mp4': '#a855f7', 'avi': '#a855f7'
            };
            icon.style.color = colorMap[extension] || '#94a3b8';
        }

        const itemInfo = document.createElement('div');
        itemInfo.className = 'recycle-item-info';

        const itemName = document.createElement('div');
        itemName.className = 'recycle-item-name';
        itemName.textContent = item.name;

        const itemDetails = document.createElement('div');
        itemDetails.className = 'recycle-item-details';
        
        const deletedDate = new Date(item.deletedAt);
        const originalPath = item.originalPath;
        const sizeInfo = item.type === 'file' ? this.core.formatFileSize(item.size) : 
                        `${item.children ? item.children.length : 0} items`;
        
        itemDetails.innerHTML = `
            <div>Original location: ${originalPath}</div>
            <div>Deleted: ${this.core.formatDate(item.deletedAt)} • ${sizeInfo}</div>
        `;

        const itemActions = document.createElement('div');
        itemActions.className = 'recycle-item-actions';

        const restoreBtn = document.createElement('button');
        restoreBtn.className = 'btn btn-success btn-small';
        restoreBtn.innerHTML = '<i class="fas fa-undo"></i> Restore';
        restoreBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.restoreItem(item.id);
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-danger btn-small';
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i> Delete';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.permanentlyDeleteItem(item.id);
        });

        itemActions.appendChild(restoreBtn);
        itemActions.appendChild(deleteBtn);

        itemInfo.appendChild(itemName);
        itemInfo.appendChild(itemDetails);

        recycleItem.appendChild(icon);
        recycleItem.appendChild(itemInfo);
        recycleItem.appendChild(itemActions);

        return recycleItem;
    }

    // Restore a single item
    restoreItem(recycleId) {
        try {
            this.core.restoreItem(recycleId);
            this.renderRecycleBin();
            this.ui.updateRecycleBinCount();
            this.ui.render(); // Refresh main view if we're in the restored item's parent directory
            
            const item = this.core.recycleBin.find(item => item.id === recycleId);
            const itemName = item ? item.name : 'Item';
            this.ui.showNotification(`"${itemName}" restored successfully`, 'success');
        } catch (error) {
            this.ui.showNotification(error.message, 'error');
        }
    }

    // Permanently delete a single item
    permanentlyDeleteItem(recycleId) {
        const item = this.core.recycleBin.find(item => item.id === recycleId);
        if (!item) return;

        // Show confirmation dialog
        const confirmed = this.showConfirmDialog(
            'Permanently Delete Item',
            `Are you sure you want to permanently delete "${item.name}"? This action cannot be undone.`,
            'Delete Forever',
            'btn-danger'
        );

        if (confirmed) {
            try {
                this.core.permanentlyDelete(recycleId);
                this.renderRecycleBin();
                this.ui.updateRecycleBinCount();
                this.ui.showNotification(`"${item.name}" permanently deleted`, 'success');
            } catch (error) {
                this.ui.showNotification(error.message, 'error');
            }
        }
    }

    // Restore all items
    restoreAll() {
        if (this.core.recycleBin.length === 0) {
            this.ui.showNotification('Recycle bin is already empty', 'info');
            return;
        }

        const confirmed = this.showConfirmDialog(
            'Restore All Items',
            `Are you sure you want to restore all ${this.core.recycleBin.length} items from the recycle bin?`,
            'Restore All',
            'btn-success'
        );

        if (confirmed) {
            let restoredCount = 0;
            let failedCount = 0;
            const totalItems = this.core.recycleBin.length;

            // Create a copy of the recycle bin array since we'll be modifying it
            const itemsToRestore = [...this.core.recycleBin];

            itemsToRestore.forEach(item => {
                try {
                    this.core.restoreItem(item.id);
                    restoredCount++;
                } catch (error) {
                    failedCount++;
                    console.error(`Failed to restore ${item.name}:`, error);
                }
            });

            this.renderRecycleBin();
            this.ui.updateRecycleBinCount();
            this.ui.render();

            if (failedCount === 0) {
                this.ui.showNotification(`All ${restoredCount} items restored successfully`, 'success');
            } else {
                this.ui.showNotification(
                    `${restoredCount} items restored, ${failedCount} failed (files may already exist)`, 
                    'warning'
                );
            }
        }
    }

    // Empty recycle bin
    emptyBin() {
        if (this.core.recycleBin.length === 0) {
            this.ui.showNotification('Recycle bin is already empty', 'info');
            return;
        }

        const confirmed = this.showConfirmDialog(
            'Empty Recycle Bin',
            `Are you sure you want to permanently delete all ${this.core.recycleBin.length} items? This action cannot be undone.`,
            'Empty Bin',
            'btn-danger'
        );

        if (confirmed) {
            const itemCount = this.core.recycleBin.length;
            this.core.emptyRecycleBin();
            this.renderRecycleBin();
            this.ui.updateRecycleBinCount();
            this.ui.showNotification(`Recycle bin emptied (${itemCount} items permanently deleted)`, 'success');
        }
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

            // Focus the confirm button for keyboard navigation
            setTimeout(() => confirmBtn.focus(), 100);
        });
    }

    // Get recycle bin statistics
    getRecycleBinStats() {
        const stats = {
            totalItems: this.core.recycleBin.length,
            totalSize: 0,
            fileCount: 0,
            folderCount: 0,
            oldestItem: null,
            newestItem: null
        };

        if (this.core.recycleBin.length === 0) {
            return stats;
        }

        let oldestDate = new Date();
        let newestDate = new Date(0);

        this.core.recycleBin.forEach(item => {
            if (item.type === 'file') {
                stats.fileCount++;
                stats.totalSize += item.size || 0;
            } else {
                stats.folderCount++;
            }

            const deletedDate = new Date(item.deletedAt);
            if (deletedDate < oldestDate) {
                oldestDate = deletedDate;
                stats.oldestItem = item;
            }
            if (deletedDate > newestDate) {
                newestDate = deletedDate;
                stats.newestItem = item;
            }
        });

        return stats;
    }

    // Auto-cleanup old items (optional feature)
    autoCleanup(daysOld = 30) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);

        const itemsToDelete = this.core.recycleBin.filter(item => {
            const deletedDate = new Date(item.deletedAt);
            return deletedDate < cutoffDate;
        });

        if (itemsToDelete.length === 0) {
            return 0;
        }

        itemsToDelete.forEach(item => {
            this.core.permanentlyDelete(item.id);
        });

        return itemsToDelete.length;
    }

    // Search in recycle bin
    searchRecycleBin(query) {
        if (!query.trim()) {
            return this.core.recycleBin;
        }

        const searchTerm = query.toLowerCase();
        return this.core.recycleBin.filter(item => {
            return item.name.toLowerCase().includes(searchTerm) ||
                   item.originalPath.toLowerCase().includes(searchTerm);
        });
    }

    // Filter recycle bin by type
    filterRecycleBin(type) {
        if (type === 'all') {
            return this.core.recycleBin;
        }
        return this.core.recycleBin.filter(item => item.type === type);
    }

    // Sort recycle bin
    sortRecycleBin(sortBy = 'deletedAt', order = 'desc') {
        const sorted = [...this.core.recycleBin];
        
        sorted.sort((a, b) => {
            let aValue, bValue;
            
            switch (sortBy) {
                case 'name':
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
                    break;
                case 'size':
                    aValue = a.size || 0;
                    bValue = b.size || 0;
                    break;
                case 'deletedAt':
                    aValue = new Date(a.deletedAt);
                    bValue = new Date(b.deletedAt);
                    break;
                case 'originalPath':
                    aValue = a.originalPath.toLowerCase();
                    bValue = b.originalPath.toLowerCase();
                    break;
                default:
                    return 0;
            }

            if (aValue < bValue) return order === 'asc' ? -1 : 1;
            if (aValue > bValue) return order === 'asc' ? 1 : -1;
            return 0;
        });

        return sorted;
    }
}

// Extend UI class with recycle bin methods
FileManagerUI.prototype.renderRecycleBin = function() {
    if (this.recycleBinManager) {
        this.recycleBinManager.renderRecycleBin();
    }
};