// File Manager UI - User Interface Management
class FileManagerUI {
    constructor(core) {
        this.core = core;
        this.elements = {};
        this.contextMenu = null;
        this.draggedItem = null;
        
        this.initializeElements();
        this.bindEvents();
        this.render();
    }

    // Initialize DOM elements
    initializeElements() {
        this.elements = {
            fileGrid: document.getElementById('fileGrid'),
            breadcrumb: document.getElementById('breadcrumb'),
            recycleBinCount: document.getElementById('recycleBinCount'),
            contextMenu: document.getElementById('contextMenu'),
            
            // Modals
            createFolderModal: document.getElementById('createFolderModal'),
            recycleBinModal: document.getElementById('recycleBinModal'),
            faviconModal: document.getElementById('faviconModal'),
            
            // Buttons
            createFolderBtn: document.getElementById('createFolderBtn'),
            uploadFileBtn: document.getElementById('uploadFileBtn'),
            fileInput: document.getElementById('fileInput'),
            recycleBinBtn: document.getElementById('recycleBinBtn'),
            faviconGeneratorBtn: document.getElementById('faviconGeneratorBtn'),
            
            // View toggle
            viewBtns: document.querySelectorAll('.view-btn'),
            
            // Sidebar
            sidebarItems: document.querySelectorAll('.sidebar-item')
        };
    }

    // Bind event listeners
    bindEvents() {
        // Toolbar buttons
        this.elements.createFolderBtn.addEventListener('click', () => this.showCreateFolderModal());
        this.elements.uploadFileBtn.addEventListener('click', () => this.elements.fileInput.click());
        this.elements.fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
        this.elements.recycleBinBtn.addEventListener('click', () => this.showRecycleBinModal());
        this.elements.faviconGeneratorBtn.addEventListener('click', () => this.showFaviconModal());

        // View toggle
        this.elements.viewBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.toggleView(e.target.dataset.view));
        });

        // Sidebar navigation
        this.elements.sidebarItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const path = e.currentTarget.dataset.path;
                this.navigateToPath(path);
            });
        });

        // File grid events
        this.elements.fileGrid.addEventListener('click', (e) => this.handleFileGridClick(e));
        this.elements.fileGrid.addEventListener('dblclick', (e) => this.handleFileGridDoubleClick(e));
        this.elements.fileGrid.addEventListener('contextmenu', (e) => this.handleContextMenu(e));

        // Context menu events
        this.elements.contextMenu.addEventListener('click', (e) => this.handleContextMenuClick(e));

        // Global events
        document.addEventListener('click', (e) => this.hideContextMenu(e));
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Modal events
        this.bindModalEvents();

        // Drag and drop
        this.bindDragDropEvents();
    }

    // Bind modal events
    bindModalEvents() {
        // Create folder modal
        const createFolderModal = this.elements.createFolderModal;
        const folderNameInput = document.getElementById('folderNameInput');
        const confirmCreateFolder = document.getElementById('confirmCreateFolder');
        const cancelCreateFolder = document.getElementById('cancelCreateFolder');

        confirmCreateFolder.addEventListener('click', () => this.createFolder());
        cancelCreateFolder.addEventListener('click', () => this.hideModal(createFolderModal));
        
        folderNameInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.createFolder();
            if (e.key === 'Escape') this.hideModal(createFolderModal);
        });

        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                this.hideModal(modal);
            });
        });

        // Click outside to close
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModal(modal);
                }
            });
        });
    }

    // Bind drag and drop events
    bindDragDropEvents() {
        // File grid drag and drop
        this.elements.fileGrid.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.elements.fileGrid.classList.add('drag-over');
        });

        this.elements.fileGrid.addEventListener('dragleave', (e) => {
            if (!this.elements.fileGrid.contains(e.relatedTarget)) {
                this.elements.fileGrid.classList.remove('drag-over');
            }
        });

        this.elements.fileGrid.addEventListener('drop', (e) => {
            e.preventDefault();
            this.elements.fileGrid.classList.remove('drag-over');
            this.handleFileDrop(e);
        });

        // File item drag
        this.elements.fileGrid.addEventListener('dragstart', (e) => {
            const fileItem = e.target.closest('.file-item');
            if (fileItem) {
                this.draggedItem = fileItem.dataset.path;
                fileItem.classList.add('dragging');
            }
        });

        this.elements.fileGrid.addEventListener('dragend', (e) => {
            const fileItem = e.target.closest('.file-item');
            if (fileItem) {
                fileItem.classList.remove('dragging');
                this.draggedItem = null;
            }
        });
    }

    // Render the file manager
    render() {
        this.renderBreadcrumb();
        this.renderFileGrid();
        this.updateRecycleBinCount();
        this.updateSidebarSelection();
    }

    // Render breadcrumb navigation
    renderBreadcrumb() {
        const breadcrumb = this.elements.breadcrumb;
        breadcrumb.innerHTML = '';

        const pathParts = this.core.currentPath.split('/').filter(part => part);
        
        // Root item
        const rootItem = document.createElement('span');
        rootItem.className = 'breadcrumb-item';
        rootItem.dataset.path = '/';
        rootItem.innerHTML = '<i class="fas fa-home"></i> Root';
        if (this.core.currentPath === '/') {
            rootItem.classList.add('active');
        }
        rootItem.addEventListener('click', () => this.navigateToPath('/'));
        breadcrumb.appendChild(rootItem);

        // Path items
        let currentPath = '';
        pathParts.forEach((part, index) => {
            currentPath += '/' + part;
            const item = document.createElement('span');
            item.className = 'breadcrumb-item';
            item.dataset.path = currentPath;
            item.textContent = part;
            
            if (index === pathParts.length - 1) {
                item.classList.add('active');
            }
            
            item.addEventListener('click', () => this.navigateToPath(currentPath));
            breadcrumb.appendChild(item);
        });
    }

    // Render file grid
    renderFileGrid() {
        const fileGrid = this.elements.fileGrid;
        fileGrid.innerHTML = '';

        // Apply view mode
        fileGrid.className = `file-grid ${this.core.viewMode === 'list' ? 'list-view' : ''}`;

        const contents = this.core.getCurrentDirectoryContents();
        
        if (contents.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-message';
            emptyMessage.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: #94a3b8;">
                    <i class="fas fa-folder-open" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <p>This folder is empty</p>
                    <p style="font-size: 0.9rem;">Create a new folder or upload files to get started</p>
                </div>
            `;
            fileGrid.appendChild(emptyMessage);
            return;
        }

        contents.forEach(item => {
            const fileItem = this.createFileItem(item);
            fileGrid.appendChild(fileItem);
        });
    }

    // Create file item element
    createFileItem(item) {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.dataset.path = item.path;
        fileItem.dataset.type = item.type;
        fileItem.draggable = true;

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

        const fileName = document.createElement('div');
        fileName.className = 'file-name';
        fileName.textContent = item.name;

        const fileInfo = document.createElement('div');
        fileInfo.className = 'file-info';
        
        if (item.type === 'file') {
            fileInfo.textContent = `${this.core.formatFileSize(item.size)} • ${this.core.formatDate(item.modified)}`;
        } else {
            const itemCount = item.children ? item.children.length : 0;
            fileInfo.textContent = `${itemCount} items • ${this.core.formatDate(item.modified)}`;
        }

        fileItem.appendChild(icon);
        fileItem.appendChild(fileName);
        fileItem.appendChild(fileInfo);

        return fileItem;
    }

    // Handle file grid click
    handleFileGridClick(e) {
        const fileItem = e.target.closest('.file-item');
        
        if (!fileItem) {
            // Clicked on empty space, clear selection
            this.clearSelection();
            return;
        }

        // Handle selection
        if (e.ctrlKey || e.metaKey) {
            // Multi-select
            this.toggleSelection(fileItem);
        } else {
            // Single select
            this.clearSelection();
            this.selectItem(fileItem);
        }
    }

    // Handle file grid double click
    handleFileGridDoubleClick(e) {
        const fileItem = e.target.closest('.file-item');
        if (!fileItem) return;

        const path = fileItem.dataset.path;
        const type = fileItem.dataset.type;

        if (type === 'folder') {
            this.navigateToPath(path);
        } else {
            this.openFile(path);
        }
    }

    // Handle context menu
    handleContextMenu(e) {
        e.preventDefault();
        
        const fileItem = e.target.closest('.file-item');
        if (fileItem && !fileItem.classList.contains('selected')) {
            this.clearSelection();
            this.selectItem(fileItem);
        }

        this.showContextMenu(e.clientX, e.clientY);
    }

    // Show context menu
    showContextMenu(x, y) {
        const contextMenu = this.elements.contextMenu;
        contextMenu.style.left = x + 'px';
        contextMenu.style.top = y + 'px';
        contextMenu.classList.add('active');

        // Adjust position if menu goes off screen
        const rect = contextMenu.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
            contextMenu.style.left = (x - rect.width) + 'px';
        }
        if (rect.bottom > window.innerHeight) {
            contextMenu.style.top = (y - rect.height) + 'px';
        }
    }

    // Hide context menu
    hideContextMenu(e) {
        if (!this.elements.contextMenu.contains(e.target)) {
            this.elements.contextMenu.classList.remove('active');
        }
    }

    // Handle context menu click
    handleContextMenuClick(e) {
        const action = e.target.closest('.context-menu-item')?.dataset.action;
        if (!action) return;

        const selectedItems = Array.from(document.querySelectorAll('.file-item.selected'));
        if (selectedItems.length === 0) return;

        this.hideContextMenu({ target: document.body });

        switch (action) {
            case 'open':
                if (selectedItems.length === 1) {
                    const path = selectedItems[0].dataset.path;
                    const type = selectedItems[0].dataset.type;
                    if (type === 'folder') {
                        this.navigateToPath(path);
                    } else {
                        this.openFile(path);
                    }
                }
                break;
            case 'rename':
                if (selectedItems.length === 1) {
                    this.renameItem(selectedItems[0]);
                }
                break;
            case 'copy':
                this.copyItems(selectedItems);
                break;
            case 'cut':
                this.cutItems(selectedItems);
                break;
            case 'delete':
                this.deleteItems(selectedItems);
                break;
            case 'properties':
                if (selectedItems.length === 1) {
                    this.showProperties(selectedItems[0]);
                }
                break;
        }
    }

    // Selection methods
    selectItem(fileItem) {
        fileItem.classList.add('selected');
        this.core.selectedItems.add(fileItem.dataset.path);
    }

    toggleSelection(fileItem) {
        if (fileItem.classList.contains('selected')) {
            fileItem.classList.remove('selected');
            this.core.selectedItems.delete(fileItem.dataset.path);
        } else {
            this.selectItem(fileItem);
        }
    }

    clearSelection() {
        document.querySelectorAll('.file-item.selected').forEach(item => {
            item.classList.remove('selected');
        });
        this.core.selectedItems.clear();
    }

    // Navigation
    navigateToPath(path) {
        if (this.core.navigateTo(path)) {
            this.render();
        }
    }

    // File operations
    openFile(path) {
        const item = this.core.fileSystem[path];
        if (!item || item.type !== 'file') return;

        // Create a simple file viewer modal
        this.showFileViewer(item);
    }

    showFileViewer(item) {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content modal-large">
                <div class="modal-header">
                    <h3><i class="${this.core.getFileIcon(item)}"></i> ${item.name}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="file-viewer">
                        ${this.getFileViewerContent(item)}
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary close-viewer">Close</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Bind events
        modal.querySelector('.modal-close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        modal.querySelector('.close-viewer').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    getFileViewerContent(item) {
        const extension = item.name.split('.').pop().toLowerCase();
        
        if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension)) {
            return `<img src="data:image/${extension};base64,${btoa(item.content || '')}" alt="${item.name}" style="max-width: 100%; height: auto;">`;
        } else if (['html', 'css', 'js', 'json', 'xml', 'md', 'txt'].includes(extension)) {
            return `<pre style="background: rgba(51, 65, 85, 0.8); padding: 1rem; border-radius: 0.5rem; overflow-x: auto; color: #f1f5f9;"><code>${this.escapeHtml(item.content || 'No content available')}</code></pre>`;
        } else {
            return `
                <div style="text-align: center; padding: 2rem; color: #94a3b8;">
                    <i class="${this.core.getFileIcon(item)}" style="font-size: 4rem; margin-bottom: 1rem;"></i>
                    <h4>${item.name}</h4>
                    <p>Size: ${this.core.formatFileSize(item.size)}</p>
                    <p>Modified: ${this.core.formatDate(item.modified)}</p>
                    <p>This file type cannot be previewed</p>
                </div>
            `;
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Toggle view mode
    toggleView(viewMode) {
        this.core.viewMode = viewMode;
        
        // Update button states
        this.elements.viewBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === viewMode);
        });

        this.renderFileGrid();
    }

    // Update recycle bin count
    updateRecycleBinCount() {
        this.elements.recycleBinCount.textContent = this.core.recycleBin.length;
    }

    // Update sidebar selection
    updateSidebarSelection() {
        this.elements.sidebarItems.forEach(item => {
            item.classList.toggle('active', item.dataset.path === this.core.currentPath);
        });
    }

    // Modal methods
    showModal(modal) {
        modal.classList.add('active');
        const input = modal.querySelector('input[type="text"]');
        if (input) {
            setTimeout(() => {
                input.focus();
                input.select();
            }, 100);
        }
    }

    hideModal(modal) {
        modal.classList.remove('active');
        // Clear form inputs
        const inputs = modal.querySelectorAll('input');
        inputs.forEach(input => input.value = '');
    }

    // Show create folder modal
    showCreateFolderModal() {
        this.showModal(this.elements.createFolderModal);
    }

    // Create folder
    createFolder() {
        const folderNameInput = document.getElementById('folderNameInput');
        const name = folderNameInput.value.trim();

        if (!name) {
            this.showNotification('Please enter a folder name', 'error');
            return;
        }

        if (!/^[a-zA-Z0-9._-]+$/.test(name)) {
            this.showNotification('Folder name contains invalid characters', 'error');
            return;
        }

        try {
            this.core.createFolder(name);
            this.hideModal(this.elements.createFolderModal);
            this.render();
            this.showNotification(`Folder "${name}" created successfully`, 'success');
        } catch (error) {
            this.showNotification(error.message, 'error');
        }
    }

    // Handle file upload
    handleFileUpload(e) {
        const files = Array.from(e.target.files);
        
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    this.core.createFile(file.name, event.target.result, file.type);
                    this.render();
                    this.showNotification(`File "${file.name}" uploaded successfully`, 'success');
                } catch (error) {
                    this.showNotification(error.message, 'error');
                }
            };
            reader.readAsText(file);
        });

        // Clear input
        e.target.value = '';
    }

    // Handle file drop
    handleFileDrop(e) {
        const files = Array.from(e.dataTransfer.files);
        
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    this.core.createFile(file.name, event.target.result, file.type);
                    this.render();
                    this.showNotification(`File "${file.name}" uploaded successfully`, 'success');
                } catch (error) {
                    this.showNotification(error.message, 'error');
                }
            };
            reader.readAsText(file);
        });
    }

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#60a5fa'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        `;

        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Keyboard shortcuts
    handleKeyboard(e) {
        if (e.target.tagName === 'INPUT') return;

        switch (e.key) {
            case 'Delete':
                const selectedItems = Array.from(document.querySelectorAll('.file-item.selected'));
                if (selectedItems.length > 0) {
                    this.deleteItems(selectedItems);
                }
                break;
            case 'F2':
                const selectedItem = document.querySelector('.file-item.selected');
                if (selectedItem) {
                    this.renameItem(selectedItem);
                }
                break;
            case 'Escape':
                this.clearSelection();
                break;
            case 'a':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.selectAll();
                }
                break;
        }
    }

    selectAll() {
        const fileItems = document.querySelectorAll('.file-item');
        fileItems.forEach(item => this.selectItem(item));
    }

    // Show recycle bin modal
    showRecycleBinModal() {
        this.showModal(this.elements.recycleBinModal);
        this.renderRecycleBin();
    }

    // Show favicon modal
    showFaviconModal() {
        this.showModal(this.elements.faviconModal);
    }

    // Placeholder methods for operations (implemented in other modules)
    deleteItems(items) {
        // Implemented in file-operations.js
    }

    renameItem(item) {
        // Implemented in file-operations.js
    }

    copyItems(items) {
        // Implemented in file-operations.js
    }

    cutItems(items) {
        // Implemented in file-operations.js
    }

    showProperties(item) {
        // Implemented in file-operations.js
    }

    renderRecycleBin() {
        // Implemented in recycle-bin.js
    }
}