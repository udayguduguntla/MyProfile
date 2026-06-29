/**
 * Theme-Responsive Constellation Effect - HTML5 Canvas Background Animation
 * 
 * Features:
 * - High-performance dynamic particles floating in a 2D space.
 * - Theme-Responsive: Dynamically changes colors and contrast when user switches between Light/Dark mode.
 * - Interactive cursor tracking: particles are drawn toward the cursor.
 * - Dynamic line connections between nearby particles and between the cursor and particles.
 * - Height/width adaptive particle counts (100 - 200).
 * - Soft glowing particle shaders.
 * - Native prefers-reduced-motion support (stops movement and interactions).
 * - Resizes dynamically with window resizing.
 */

(function () {
  // Prevent duplicate initialization
  if (window.constellationInitialized) return;
  window.constellationInitialized = true;

  // Create Canvas Element
  const canvas = document.createElement('canvas');
  canvas.id = 'constellation-canvas';
  
  // Style Canvas to be full-screen, fixed, behind everything, and non-blocking for pointer events
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.zIndex = '-9999';
  canvas.style.pointerEvents = 'none';
  canvas.style.display = 'block';
  
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  let particles = [];
  let isDarkMode = true; // Tracks theme state
  
  // Configurable Parameters (Visual Style Requirements)
  const CONFIG = {
    connectionDistance: 135, // Connection line distance threshold (~120-150px)
    mouseRadius: 180,        // Cursor interaction radius (~180px)
    maxParticles: 200,       // Upper limit for particle count
    minParticles: 80,        // Lower limit for particle count
    particleAreaRatio: 9000, // Pixels per particle density
    attractionForce: 0.15,   // Mouse attraction multiplier
    damping: 0.95,           // Velocity damping when close to mouse
    returnSpeed: 0.03        // Return to normal speed interpolation
  };

  const mouse = {
    x: null,
    y: null,
    active: false
  };

  // Color Palettes
  // 1. Cyberpunk Dark Mode Palette (Subtle Cyan, Soft Blue, Light Purple)
  const darkColors = [
    { rgb: '56, 189, 248', glow: 'rgba(56, 189, 248, 0.5)' },  // Cyan
    { rgb: '96, 165, 250', glow: 'rgba(96, 165, 250, 0.5)' },  // Blue
    { rgb: '192, 132, 252', glow: 'rgba(192, 132, 252, 0.5)' } // Purple
  ];

  // 2. Muted Organic Light Mode Palette (Forest Green, Emerald, Ocean Teal)
  const lightColors = [
    { rgb: '16, 185, 129', glow: 'rgba(16, 185, 129, 0.3)' },  // Emerald
    { rgb: '20, 184, 166', glow: 'rgba(20, 184, 166, 0.3)' },  // Teal
    { rgb: '14, 165, 233', glow: 'rgba(14, 165, 233, 0.3)' }   // Ocean Sky
  ];

  // Check brightness of the page body to detect light/dark theme dynamically
  function detectTheme() {
    const bodyBg = window.getComputedStyle(document.body).backgroundColor;
    const match = bodyBg.match(/\d+/g);
    if (match && match.length >= 3) {
      const r = parseInt(match[0]);
      const g = parseInt(match[1]);
      const b = parseInt(match[2]);
      // Standard luminance formula
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      const newThemeIsDark = brightness < 135;
      
      // If the theme changed, update existing particles' color settings
      if (newThemeIsDark !== isDarkMode) {
        isDarkMode = newThemeIsDark;
        particles.forEach(p => p.assignColors());
      }
    }
  }

  // Access user reduced-motion setting
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let motionEnabled = !motionQuery.matches;

  // React to changes in user motion settings
  motionQuery.addEventListener('change', (e) => {
    motionEnabled = !e.matches;
    particles.forEach(p => {
      p.vx = motionEnabled ? p.baseVx : 0;
      p.vy = motionEnabled ? p.baseVy : 0;
    });
  });

  class Particle {
    constructor() {
      this.reset(true);
    }

    assignColors() {
      const palette = isDarkMode ? darkColors : lightColors;
      const colorScheme = palette[Math.floor(Math.random() * palette.length)];
      this.rgb = colorScheme.rgb;
      this.glowColor = colorScheme.glow;
    }

    reset(initPhase = false) {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      
      // Determine size: 1px to 3px
      this.radius = 1.0 + Math.random() * 2.0;

      // Assign theme-responsive colors
      this.assignColors();

      // Base transparency (higher opacity for light mode to maintain visibility contrast)
      this.alpha = isDarkMode ? (0.15 + Math.random() * 0.35) : (0.25 + Math.random() * 0.3);

      // Random speed vector (0.2 to 0.7 pixels per frame)
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.2 + Math.random() * 0.5;
      this.baseVx = Math.cos(angle) * speed;
      this.baseVy = Math.sin(angle) * speed;

      this.vx = motionEnabled ? this.baseVx : 0;
      this.vy = motionEnabled ? this.baseVy : 0;
    }

    update() {
      if (!motionEnabled) return;

      this.x += this.vx;
      this.y += this.vy;

      // Wrap-around screen bounds with padding
      const padding = 15;
      if (this.x < -padding) this.x = width + padding;
      else if (this.x > width + padding) this.x = -padding;

      if (this.y < -padding) this.y = height + padding;
      else if (this.y > height + padding) this.y = -padding;

      // Interaction with mouse cursor
      if (mouse.active && mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONFIG.mouseRadius) {
          // Attract towards cursor
          const force = (1 - dist / CONFIG.mouseRadius) * CONFIG.attractionForce;
          this.vx += (dx / dist) * force;
          this.vy += (dy / dist) * force;

          // Apply deceleration damping to prevent slingshotting away
          this.vx *= CONFIG.damping;
          this.vy *= CONFIG.damping;
        } else {
          // Slowly interpolate back to original wander speed
          this.vx += (this.baseVx - this.vx) * CONFIG.returnSpeed;
          this.vy += (this.baseVy - this.vy) * CONFIG.returnSpeed;
        }
      } else {
        // Return to normal speed when cursor leaves
        this.vx += (this.baseVx - this.vx) * 0.01;
        this.vy += (this.baseVy - this.vy) * 0.01;
      }
    }

    draw() {
      let currentAlpha = this.alpha;
      let currentRadius = this.radius;

      // Brighten and scale particle when near cursor
      if (motionEnabled && mouse.active && mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONFIG.mouseRadius) {
          const factor = 1 - dist / CONFIG.mouseRadius;
          currentAlpha += factor * (isDarkMode ? 0.45 : 0.35); // Increase brightness
          currentRadius += factor * 1.0;  // Increase size slightly
          
          // Apply canvas shadow glow ONLY near the cursor and in dark mode (Performance & visual optimization!)
          if (isDarkMode) {
            ctx.shadowBlur = 8 * factor;
            ctx.shadowColor = this.glowColor;
          } else {
            ctx.shadowBlur = 0;
          }
        } else {
          ctx.shadowBlur = 0;
        }
      } else {
        ctx.shadowBlur = 0;
      }

      ctx.fillStyle = `rgba(${this.rgb}, ${currentAlpha})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, currentRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Populate particles based on canvas dimensions
  function populateParticles() {
    particles = [];
    const screenArea = width * height;
    const count = Math.max(
      CONFIG.minParticles, 
      Math.min(CONFIG.maxParticles, Math.floor(screenArea / CONFIG.particleAreaRatio))
    );

    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  // Handle resizing and adjust particle count
  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    populateParticles();
  }

  window.addEventListener('resize', resize);
  resize();

  // Mouse move tracking
  window.addEventListener('mousemove', (e) => {
    if (!motionEnabled) return;
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });

  // Mouse leave tracking
  window.addEventListener('mouseleave', () => {
    mouse.active = false;
    mouse.x = null;
    mouse.y = null;
  });

  // Touch Support for mobile screens
  window.addEventListener('touchmove', (e) => {
    if (!motionEnabled || e.touches.length === 0) return;
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
    mouse.active = true;
  }, { passive: true });

  window.addEventListener('touchend', () => {
    mouse.active = false;
    mouse.x = null;
    mouse.y = null;
  });

  // Smooth 60fps Animation Loop
  function tick() {
    // Detect active page theme changes (e.g. settings menu toggle)
    detectTheme();

    ctx.clearRect(0, 0, width, height);

    // Turn off shadow blur on connections for maximum rendering performance
    ctx.shadowBlur = 0;

    // Line connection color based on active theme
    const connectionColor = isDarkMode ? '96, 165, 250' : '20, 184, 166'; // Soft Blue (Dark) vs Teal (Light)
    const cursorLineColor = isDarkMode ? '192, 132, 252' : '16, 185, 129'; // Purple (Dark) vs Green (Light)
    const maxLineAlpha = isDarkMode ? 0.12 : 0.22; // Higher line opacity on light bg for visibility

    // Draw lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONFIG.connectionDistance) {
          // Opacity decreases with distance
          let lineAlpha = (1 - dist / CONFIG.connectionDistance) * maxLineAlpha;

          // Increase connection opacity if the connection is close to the mouse cursor
          if (motionEnabled && mouse.active && mouse.x !== null && mouse.y !== null) {
            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2;
            const mdx = mouse.x - midX;
            const mdy = mouse.y - midY;
            const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

            if (mdist < CONFIG.mouseRadius) {
              const factor = 1 - mdist / CONFIG.mouseRadius;
              lineAlpha += factor * (isDarkMode ? 0.22 : 0.15); // Opacity boost near mouse
            }
          }

          ctx.strokeStyle = `rgba(${connectionColor}, ${lineAlpha})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }

    // Draw connection lines from cursor to surrounding particles
    if (motionEnabled && mouse.active && mouse.x !== null && mouse.y !== null) {
      particles.forEach(p => {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONFIG.mouseRadius) {
          const lineAlpha = (1 - dist / CONFIG.mouseRadius) * (isDarkMode ? 0.28 : 0.35);
          ctx.strokeStyle = `rgba(${cursorLineColor}, ${lineAlpha})`;
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        }
      });
    }

    // Update and Draw Particles
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(tick);
  }

  // Launch animation loop
  requestAnimationFrame(tick);
})();
