// File Manager Favicon Generator - Creates custom SVG favicons
class FaviconGenerator {
    constructor(core, ui) {
        this.core = core;
        this.ui = ui;
        this.currentFavicon = null;
        this.bindEvents();
        this.initializePreview();
    }

    bindEvents() {
        // Input events for real-time preview
        const firstInitial = document.getElementById('firstInitial');
        const secondInitial = document.getElementById('secondInitial');
        const faviconColor = document.getElementById('faviconColor');
        const saveFavicon = document.getElementById('saveFavicon');
        const cancelFavicon = document.getElementById('cancelFavicon');

        if (firstInitial) {
            firstInitial.addEventListener('input', () => this.updatePreview());
            firstInitial.addEventListener('keyup', (e) => {
                // Auto-uppercase and move to next field
                e.target.value = e.target.value.toUpperCase();
                if (e.target.value.length === 1 && secondInitial) {
                    secondInitial.focus();
                }
                this.updatePreview();
            });
        }

        if (secondInitial) {
            secondInitial.addEventListener('input', () => this.updatePreview());
            secondInitial.addEventListener('keyup', (e) => {
                e.target.value = e.target.value.toUpperCase();
                this.updatePreview();
            });
        }

        if (faviconColor) {
            faviconColor.addEventListener('input', () => this.updatePreview());
        }

        if (saveFavicon) {
            saveFavicon.addEventListener('click', () => this.saveFavicon());
        }

        if (cancelFavicon) {
            cancelFavicon.addEventListener('click', () => this.cancelFavicon());
        }
    }

    // Initialize preview with default values
    initializePreview() {
        const firstInitial = document.getElementById('firstInitial');
        const secondInitial = document.getElementById('secondInitial');
        
        if (firstInitial && !firstInitial.value) {
            firstInitial.value = 'U';
        }
        if (secondInitial && !secondInitial.value) {
            secondInitial.value = 'K';
        }
        
        this.updatePreview();
    }

    // Update favicon preview
    updatePreview() {
        const firstInitial = document.getElementById('firstInitial')?.value.toUpperCase() || 'U';
        const secondInitial = document.getElementById('secondInitial')?.value.toUpperCase() || 'K';
        const backgroundColor = document.getElementById('faviconColor')?.value || '#60a5fa';
        
        const faviconPreview = document.getElementById('faviconPreview');
        if (!faviconPreview) return;

        // Generate SVG favicon
        const svg = this.generateFaviconSVG(firstInitial, secondInitial, backgroundColor);
        
        // Display preview
        faviconPreview.innerHTML = svg;
        
        // Store current favicon data
        this.currentFavicon = {
            firstInitial,
            secondInitial,
            backgroundColor,
            svg
        };
    }

    // Generate SVG favicon
    generateFaviconSVG(first, second, bgColor) {
        // Calculate complementary text color
        const textColor = this.getContrastColor(bgColor);
        
        // Create gradient for more professional look
        const gradientColor = this.adjustBrightness(bgColor, -20);
        
        const svg = `
            <svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:${bgColor};stop-opacity:1" />
                        <stop offset="100%" style="stop-color:${gradientColor};stop-opacity:1" />
                    </linearGradient>
                    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="2" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.3)"/>
                    </filter>
                </defs>
                
                <!-- Background circle with gradient -->
                <circle cx="32" cy="32" r="30" fill="url(#bgGradient)" filter="url(#shadow)" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
                
                <!-- Inner circle for depth -->
                <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
                
                <!-- Text initials -->
                <text x="32" y="40" font-family="Arial, sans-serif" font-size="24" font-weight="bold" 
                      text-anchor="middle" fill="${textColor}" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">
                    ${first}${second}
                </text>
            </svg>
        `;
        
        return svg;
    }

    // Generate different favicon sizes
    generateFaviconSizes(first, second, bgColor) {
        const sizes = [16, 32, 48, 64, 128, 256];
        const favicons = {};
        
        sizes.forEach(size => {
            const textColor = this.getContrastColor(bgColor);
            const gradientColor = this.adjustBrightness(bgColor, -20);
            const fontSize = Math.floor(size * 0.375); // Proportional font size
            const radius = Math.floor(size * 0.46875); // Proportional radius
            
            const svg = `
                <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="bgGradient${size}" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:${bgColor};stop-opacity:1" />
                            <stop offset="100%" style="stop-color:${gradientColor};stop-opacity:1" />
                        </linearGradient>
                        <filter id="shadow${size}" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="1" dy="1" stdDeviation="1" flood-color="rgba(0,0,0,0.3)"/>
                        </filter>
                    </defs>
                    
                    <circle cx="${size/2}" cy="${size/2}" r="${radius}" fill="url(#bgGradient${size})" 
                            filter="url(#shadow${size})" stroke="rgba(255,255,255,0.2)" stroke-width="0.5"/>
                    
                    <circle cx="${size/2}" cy="${size/2}" r="${radius-2}" fill="none" 
                            stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>
                    
                    <text x="${size/2}" y="${size/2 + fontSize/3}" font-family="Arial, sans-serif" 
                          font-size="${fontSize}" font-weight="bold" text-anchor="middle" fill="${textColor}" 
                          style="text-shadow: 0.5px 0.5px 1px rgba(0,0,0,0.3);">
                        ${first}${second}
                    </text>
                </svg>
            `;
            
            favicons[size] = svg;
        });
        
        return favicons;
    }

    // Save favicon to file system
    saveFavicon() {
        if (!this.currentFavicon) {
            this.ui.showNotification('Please generate a favicon first', 'error');
            return;
        }

        const { firstInitial, secondInitial, backgroundColor, svg } = this.currentFavicon;
        const fileName = `favicon-${firstInitial}${secondInitial}.svg`;
        
        try {
            // Check if favicon already exists
            const existingPath = this.core.joinPath(this.core.currentPath, fileName);
            if (this.core.fileSystem[existingPath]) {
                const confirmed = confirm(`A favicon named "${fileName}" already exists. Do you want to replace it?`);
                if (!confirmed) return;
                
                // Delete existing favicon (move to recycle bin)
                this.core.deleteItem(existingPath);
            }
            
            // Create favicon file
            this.core.createFile(fileName, svg, 'image/svg+xml');
            
            // Generate additional sizes and create a favicon package
            const faviconSizes = this.generateFaviconSizes(firstInitial, secondInitial, backgroundColor);
            
            // Create favicon manifest
            const manifest = {
                name: `${firstInitial}${secondInitial} Favicon`,
                short_name: `${firstInitial}${secondInitial}`,
                description: `Custom favicon with initials ${firstInitial}${secondInitial}`,
                background_color: backgroundColor,
                theme_color: backgroundColor,
                generated_at: new Date().toISOString(),
                sizes: Object.keys(faviconSizes)
            };
            
            // Save manifest
            const manifestFileName = `favicon-${firstInitial}${secondInitial}-manifest.json`;
            this.core.createFile(manifestFileName, JSON.stringify(manifest, null, 2), 'application/json');
            
            // Generate HTML snippet for easy integration
            const htmlSnippet = this.generateHTMLSnippet(fileName, firstInitial, secondInitial);
            const htmlFileName = `favicon-${firstInitial}${secondInitial}-html.txt`;
            this.core.createFile(htmlFileName, htmlSnippet, 'text/plain');
            
            // Close modal and refresh view
            this.ui.hideModal(this.ui.elements.faviconModal);
            this.ui.render();
            
            this.ui.showNotification(`Favicon "${fileName}" created successfully with manifest and HTML snippet`, 'success');
            
        } catch (error) {
            this.ui.showNotification(error.message, 'error');
        }
    }

    // Generate HTML snippet for favicon integration
    generateHTMLSnippet(fileName, first, second) {
        return `<!-- Favicon HTML Snippet for ${first}${second} -->
<!-- Add this to your HTML <head> section -->

<!-- Standard favicon -->
<link rel="icon" type="image/svg+xml" href="${fileName}">

<!-- Fallback for browsers that don't support SVG favicons -->
<link rel="icon" type="image/png" href="favicon-${first}${second}-32.png" sizes="32x32">
<link rel="icon" type="image/png" href="favicon-${first}${second}-16.png" sizes="16x16">

<!-- Apple Touch Icon -->
<link rel="apple-touch-icon" href="favicon-${first}${second}-180.png" sizes="180x180">

<!-- Android Chrome -->
<link rel="icon" type="image/png" href="favicon-${first}${second}-192.png" sizes="192x192">
<link rel="icon" type="image/png" href="favicon-${first}${second}-512.png" sizes="512x512">

<!-- Web App Manifest -->
<link rel="manifest" href="favicon-${first}${second}-manifest.json">

<!-- Theme color for mobile browsers -->
<meta name="theme-color" content="${this.currentFavicon.backgroundColor}">

<!-- Generated by File Manager Favicon Generator -->
<!-- Date: ${new Date().toISOString()} -->`;
    }

    // Cancel favicon creation
    cancelFavicon() {
        // Reset form
        const firstInitial = document.getElementById('firstInitial');
        const secondInitial = document.getElementById('secondInitial');
        const faviconColor = document.getElementById('faviconColor');
        
        if (firstInitial) firstInitial.value = 'U';
        if (secondInitial) secondInitial.value = 'K';
        if (faviconColor) faviconColor.value = '#60a5fa';
        
        this.updatePreview();
        this.ui.hideModal(this.ui.elements.faviconModal);
    }

    // Utility: Get contrast color (black or white) for given background
    getContrastColor(hexColor) {
        // Convert hex to RGB
        const r = parseInt(hexColor.slice(1, 3), 16);
        const g = parseInt(hexColor.slice(3, 5), 16);
        const b = parseInt(hexColor.slice(5, 7), 16);
        
        // Calculate luminance
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        
        // Return black or white based on luminance
        return luminance > 0.5 ? '#000000' : '#ffffff';
    }

    // Utility: Adjust color brightness
    adjustBrightness(hexColor, percent) {
        const num = parseInt(hexColor.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }

    // Generate favicon from existing file (if user uploads an image)
    generateFromImage(imageFile) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    // Set canvas size
                    canvas.width = 64;
                    canvas.height = 64;
                    
                    // Draw image
                    ctx.drawImage(img, 0, 0, 64, 64);
                    
                    // Convert to data URL
                    const dataUrl = canvas.toDataURL('image/png');
                    resolve(dataUrl);
                };
                img.onerror = reject;
                img.src = e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(imageFile);
        });
    }

    // Preset color schemes
    getPresetColors() {
        return [
            { name: 'Ocean Blue', color: '#60a5fa', description: 'Professional and trustworthy' },
            { name: 'Forest Green', color: '#22c55e', description: 'Natural and growth-oriented' },
            { name: 'Sunset Orange', color: '#f97316', description: 'Energetic and creative' },
            { name: 'Royal Purple', color: '#a855f7', description: 'Luxury and innovation' },
            { name: 'Cherry Red', color: '#ef4444', description: 'Bold and attention-grabbing' },
            { name: 'Golden Yellow', color: '#eab308', description: 'Optimistic and friendly' },
            { name: 'Deep Teal', color: '#0891b2', description: 'Sophisticated and modern' },
            { name: 'Warm Pink', color: '#ec4899', description: 'Creative and approachable' }
        ];
    }

    // Apply preset color
    applyPresetColor(color) {
        const faviconColor = document.getElementById('faviconColor');
        if (faviconColor) {
            faviconColor.value = color;
            this.updatePreview();
        }
    }

    // Export favicon as different formats
    exportFavicon(format = 'svg') {
        if (!this.currentFavicon) {
            this.ui.showNotification('Please generate a favicon first', 'error');
            return;
        }

        const { firstInitial, secondInitial, backgroundColor } = this.currentFavicon;
        
        switch (format) {
            case 'svg':
                return this.currentFavicon.svg;
            case 'png':
                return this.convertSVGToPNG(this.currentFavicon.svg);
            case 'ico':
                return this.convertSVGToICO(this.currentFavicon.svg);
            default:
                return this.currentFavicon.svg;
        }
    }

    // Convert SVG to PNG (simplified version)
    convertSVGToPNG(svgString, size = 64) {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            canvas.width = size;
            canvas.height = size;
            
            img.onload = () => {
                ctx.drawImage(img, 0, 0, size, size);
                const dataUrl = canvas.toDataURL('image/png');
                resolve(dataUrl);
            };
            
            img.onerror = reject;
            
            const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(svgBlob);
            img.src = url;
        });
    }

    // Validate initials input
    validateInitials(first, second) {
        const errors = [];
        
        if (!first || first.length !== 1) {
            errors.push('First initial must be exactly one character');
        }
        
        if (!second || second.length !== 1) {
            errors.push('Second initial must be exactly one character');
        }
        
        if (!/^[A-Za-z]$/.test(first)) {
            errors.push('First initial must be a letter');
        }
        
        if (!/^[A-Za-z]$/.test(second)) {
            errors.push('Second initial must be a letter');
        }
        
        return errors;
    }

    // Get favicon recommendations based on initials
    getRecommendations(first, second) {
        const recommendations = [];
        
        // Color recommendations based on initials
        const colorMap = {
            'A': '#ef4444', 'B': '#3b82f6', 'C': '#22c55e', 'D': '#f97316',
            'E': '#8b5cf6', 'F': '#06b6d4', 'G': '#84cc16', 'H': '#f59e0b',
            'I': '#ec4899', 'J': '#10b981', 'K': '#6366f1', 'L': '#f43f5e',
            'M': '#8b5cf6', 'N': '#059669', 'O': '#dc2626', 'P': '#7c3aed',
            'Q': '#0891b2', 'R': '#ea580c', 'S': '#16a34a', 'T': '#c2410c',
            'U': '#60a5fa', 'V': '#a855f7', 'W': '#0d9488', 'X': '#be123c',
            'Y': '#ca8a04', 'Z': '#9333ea'
        };
        
        const firstColor = colorMap[first.toUpperCase()] || '#60a5fa';
        const secondColor = colorMap[second.toUpperCase()] || '#a855f7';
        
        recommendations.push({
            name: `${first} Color`,
            color: firstColor,
            description: `Based on initial "${first}"`
        });
        
        recommendations.push({
            name: `${second} Color`,
            color: secondColor,
            description: `Based on initial "${second}"`
        });
        
        // Blend the two colors
        const blendedColor = this.blendColors(firstColor, secondColor);
        recommendations.push({
            name: 'Blended',
            color: blendedColor,
            description: `Combination of ${first} and ${second} colors`
        });
        
        return recommendations;
    }

    // Blend two hex colors
    blendColors(color1, color2, ratio = 0.5) {
        const hex1 = color1.replace('#', '');
        const hex2 = color2.replace('#', '');
        
        const r1 = parseInt(hex1.substring(0, 2), 16);
        const g1 = parseInt(hex1.substring(2, 4), 16);
        const b1 = parseInt(hex1.substring(4, 6), 16);
        
        const r2 = parseInt(hex2.substring(0, 2), 16);
        const g2 = parseInt(hex2.substring(2, 4), 16);
        const b2 = parseInt(hex2.substring(4, 6), 16);
        
        const r = Math.round(r1 * (1 - ratio) + r2 * ratio);
        const g = Math.round(g1 * (1 - ratio) + g2 * ratio);
        const b = Math.round(b1 * (1 - ratio) + b2 * ratio);
        
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
}