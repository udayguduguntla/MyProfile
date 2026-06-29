// File Manager Main - Initialize and coordinate all components
class FileManager {
    constructor() {
        this.core = null;
        this.ui = null;
        this.recycleBinManager = null;
        this.faviconGenerator = null;
        this.fileOperations = null;
        
        this.init();
    }

    // Initialize the file manager
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }

    // Initialize all components
    initializeComponents() {
        try {
            // Initialize core data management
            this.core = new FileManagerCore();
            
            // Initialize UI management
            this.ui = new FileManagerUI(this.core);
            
            // Initialize file operations
            this.fileOperations = new FileOperations(this.core, this.ui);
            this.ui.fileOperations = this.fileOperations;
            
            // Initialize recycle bin manager
            this.recycleBinManager = new RecycleBinManager(this.core, this.ui);
            this.ui.recycleBinManager = this.recycleBinManager;
            
            // Initialize favicon generator
            this.faviconGenerator = new FaviconGenerator(this.core, this.ui);
            this.ui.faviconGenerator = this.faviconGenerator;
            
            // Add keyboard shortcuts
            this.initializeKeyboardShortcuts();
            
            // Add additional event listeners
            this.initializeGlobalEvents();
            
            // Add CSS animations
            this.addAnimationStyles();
            
            console.log('File Manager initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize File Manager:', error);
            this.showErrorMessage('Failed to initialize File Manager. Please refresh the page.');
        }
    }

    // Initialize keyboard shortcuts
    initializeKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Don't handle shortcuts when typing in inputs
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }

            // Handle keyboard shortcuts
            if (e.ctrlKey || e.metaKey) {
                switch (e.key.toLowerCase()) {
                    case 'c':
                        e.preventDefault();
                        const selectedForCopy = document.querySelectorAll('.file-item.selected');
                        if (selectedForCopy.length > 0) {
                            this.fileOperations.copyItems(Array.from(selectedForCopy));
                        }
                        break;
                    
                    case 'x':
                        e.preventDefault();
                        const selectedForCut = document.querySelectorAll('.file-item.selected');
                        if (selectedForCut.length > 0) {
                            this.fileOperations.cutItems(Array.from(selectedForCut));
                        }
                        break;
                    
                    case 'v':
                        e.preventDefault();
                        this.fileOperations.pasteItems();
                        break;
                    
                    case 'a':
                        e.preventDefault();
                        this.ui.selectAll();
                        break;
                    
                    case 'n':
                        e.preventDefault();
                        if (e.shiftKey) {
                            this.ui.showCreateFolderModal();
                        }
                        break;
                }
            } else {
                switch (e.key) {
                    case 'Delete':
                        const selectedForDelete = document.querySelectorAll('.file-item.selected');
                        if (selectedForDelete.length > 0) {
                            this.fileOperations.deleteItems(Array.from(selectedForDelete));
                        }
                        break;
                    
                    case 'F2':
                        const selectedForRename = document.querySelector('.file-item.selected');
                        if (selectedForRename) {
                            this.fileOperations.renameItem(selectedForRename);
                        }
                        break;
                    
                    case 'Escape':
                        this.ui.clearSelection();
                        // Close any open modals
                        document.querySelectorAll('.modal.active').forEach(modal => {
                            this.ui.hideModal(modal);
                        });
                        break;
                    
                    case 'Enter':
                        const selectedForOpen = document.querySelector('.file-item.selected');
                        if (selectedForOpen) {
                            const path = selectedForOpen.dataset.path;
                            const type = selectedForOpen.dataset.type;
                            if (type === 'folder') {
                                this.ui.navigateToPath(path);
                            } else {
                                this.ui.openFile(path);
                            }
                        }
                        break;
                    
                    case 'Backspace':
                        // Navigate to parent directory
                        const parentPath = this.core.getParentPath(this.core.currentPath);
                        if (parentPath) {
                            this.ui.navigateToPath(parentPath);
                        }
                        break;
                }
            }
        });
    }

    // Initialize global events
    initializeGlobalEvents() {
        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleWindowResize();
        });

        // Handle beforeunload to save state
        window.addEventListener('beforeunload', () => {
            this.saveState();
        });

        // Handle visibility change to save state
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.saveState();
            }
        });

        // Handle online/offline status
        window.addEventListener('online', () => {
            this.ui.showNotification('Connection restored', 'success');
        });

        window.addEventListener('offline', () => {
            this.ui.showNotification('Working offline', 'warning');
        });

        // Prevent default drag and drop on the page
        document.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        document.addEventListener('drop', (e) => {
            e.preventDefault();
        });
    }

    // Handle window resize
    handleWindowResize() {
        // Adjust layout for mobile
        const isMobile = window.innerWidth <= 768;
        const fileManagerContent = document.querySelector('.file-manager-content');
        
        if (fileManagerContent) {
            if (isMobile) {
                fileManagerContent.style.gridTemplateColumns = '1fr';
            } else {
                fileManagerContent.style.gridTemplateColumns = '250px 1fr';
            }
        }
    }

    // Save current state
    saveState() {
        try {
            const state = {
                currentPath: this.core.currentPath,
                viewMode: this.core.viewMode,
                selectedItems: Array.from(this.core.selectedItems),
                timestamp: new Date().toISOString()
            };
            
            localStorage.setItem('fileManager_state', JSON.stringify(state));
        } catch (error) {
            console.error('Failed to save state:', error);
        }
    }

    // Load saved state
    loadState() {
        try {
            const saved = localStorage.getItem('fileManager_state');
            if (saved) {
                const state = JSON.parse(saved);
                
                // Restore path if it still exists
                if (this.core.fileSystem[state.currentPath]) {
                    this.core.currentPath = state.currentPath;
                }
                
                // Restore view mode
                if (state.viewMode) {
                    this.core.viewMode = state.viewMode;
                }
                
                // Refresh UI
                this.ui.render();
            }
        } catch (error) {
            console.error('Failed to load state:', error);
        }
    }

    // Add CSS animations
    addAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Notification animations */
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            /* File item hover animations */
            .file-item {
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .file-item:hover {
                transform: translateY(-2px) scale(1.02);
            }
            
            /* Modal animations */
            .modal {
                animation: modalFadeIn 0.3s ease;
            }
            
            @keyframes modalFadeIn {
                from {
                    opacity: 0;
                    backdrop-filter: blur(0px);
                }
                to {
                    opacity: 1;
                    backdrop-filter: blur(5px);
                }
            }
            
            .modal-content {
                animation: modalSlideIn 0.3s ease;
            }
            
            @keyframes modalSlideIn {
                from {
                    transform: translateY(-50px) scale(0.9);
                    opacity: 0;
                }
                to {
                    transform: translateY(0) scale(1);
                    opacity: 1;
                }
            }
            
            /* Loading animation */
            .loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(10, 15, 28, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                backdrop-filter: blur(5px);
            }
            
            .loading-spinner {
                width: 40px;
                height: 40px;
                border: 3px solid rgba(96, 165, 250, 0.3);
                border-top: 3px solid #60a5fa;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            /* Pulse animation for active elements */
            .pulse {
                animation: pulse 2s infinite;
            }
            
            @keyframes pulse {
                0% {
                    box-shadow: 0 0 0 0 rgba(96, 165, 250, 0.7);
                }
                70% {
                    box-shadow: 0 0 0 10px rgba(96, 165, 250, 0);
                }
                100% {
                    box-shadow: 0 0 0 0 rgba(96, 165, 250, 0);
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Show error message
    showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(239, 68, 68, 0.9);
                color: white;
                padding: 2rem;
                border-radius: 1rem;
                text-align: center;
                z-index: 10000;
                backdrop-filter: blur(10px);
            ">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                <h3>Error</h3>
                <p>${message}</p>
                <button onclick="location.reload()" style="
                    background: white;
                    color: #ef4444;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 0.5rem;
                    margin-top: 1rem;
                    cursor: pointer;
                    font-weight: 600;
                ">Refresh Page</button>
            </div>
        `;
        document.body.appendChild(errorDiv);
    }

    // Show loading overlay
    showLoading(message = 'Loading...') {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading-overlay';
        loadingDiv.innerHTML = `
            <div style="text-align: center; color: #f1f5f9;">
                <div class="loading-spinner"></div>
                <p style="margin-top: 1rem;">${message}</p>
            </div>
        `;
        document.body.appendChild(loadingDiv);
        return loadingDiv;
    }

    // Hide loading overlay
    hideLoading(loadingElement) {
        if (loadingElement && document.body.contains(loadingElement)) {
            document.body.removeChild(loadingElement);
        }
    }

    // Export file system data
    exportData() {
        const data = {
            fileSystem: this.core.fileSystem,
            recycleBin: this.core.recycleBin,
            exportDate: new Date().toISOString(),
            version: '1.0.0'
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `file-manager-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.ui.showNotification('File system exported successfully', 'success');
    }

    // Import file system data
    importData(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (data.fileSystem && data.recycleBin) {
                    const confirmed = confirm('This will replace your current file system. Are you sure?');
                    if (confirmed) {
                        this.core.fileSystem = data.fileSystem;
                        this.core.recycleBin = data.recycleBin;
                        this.core.saveFileSystem();
                        this.core.saveRecycleBin();
                        this.ui.render();
                        this.ui.updateRecycleBinCount();
                        this.ui.showNotification('File system imported successfully', 'success');
                    }
                } else {
                    throw new Error('Invalid backup file format');
                }
            } catch (error) {
                this.ui.showNotification('Failed to import file system: ' + error.message, 'error');
            }
        };
        reader.readAsText(file);
    }

    // Get file manager statistics
    getStatistics() {
        const stats = {
            totalFiles: 0,
            totalFolders: 0,
            totalSize: 0,
            recycleBinItems: this.core.recycleBin.length,
            lastModified: null
        };

        let latestModified = new Date(0);

        Object.values(this.core.fileSystem).forEach(item => {
            if (item.type === 'file') {
                stats.totalFiles++;
                stats.totalSize += item.size || 0;
            } else if (item.type === 'folder') {
                stats.totalFolders++;
            }

            const modified = new Date(item.modified);
            if (modified > latestModified) {
                latestModified = modified;
                stats.lastModified = item.modified;
            }
        });

        return stats;
    }

    // Cleanup and destroy
    destroy() {
        this.saveState();
        
        // Remove event listeners
        document.removeEventListener('keydown', this.handleKeyboard);
        window.removeEventListener('resize', this.handleWindowResize);
        window.removeEventListener('beforeunload', this.saveState);
        
        // Clear references
        this.core = null;
        this.ui = null;
        this.recycleBinManager = null;
        this.faviconGenerator = null;
        this.fileOperations = null;
    }
}

// Initialize File Manager when script loads
let fileManager;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        fileManager = new FileManager();
    });
} else {
    fileManager = new FileManager();
}

// Make fileManager globally accessible for debugging
window.fileManager = fileManager;