// ===== PORTFOLIO JAVASCRIPT - FIXED VERSION =====

document.addEventListener('DOMContentLoaded', function () {
    initPortfolio();
});

function initPortfolio() {
    initLoadingScreen();
    initNavigation();
    initRoleCarousel();
    initScrollAnimations();
    initContactForm();
    initInteractions();
    initScrollToTop();
    initCounterAnimations();
    initProjectInteractions();
    initAdvancedScrollAnimations();
    console.log('🚀 Enhanced Portfolio initialized successfully!');
}

// Role Carousel
function initRoleCarousel() {
    const roles = document.querySelectorAll('.role');
    let currentRole = 0;

    if (roles.length === 0) return;

    // Show first role
    roles[0].classList.add('active');

    function showNextRole() {
        roles[currentRole].classList.remove('active');
        currentRole = (currentRole + 1) % roles.length;
        roles[currentRole].classList.add('active');
    }

    // Change role every 3 seconds
    setInterval(showNextRole, 3000);
}

// Fixed Loading Screen
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');

    if (!loadingScreen) {
        // If no loading screen, show navbar immediately
        const navbar = document.getElementById('navbar');
        if (navbar) navbar.classList.add('loaded');
        return;
    }

    // Simple progress simulation
    let progress = 0;
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    const loadingText = document.querySelector('.loading-text');

    const updateProgress = () => {
        progress += Math.random() * 20 + 10;

        if (progress >= 100) {
            progress = 100;

            // Update UI
            if (progressFill) progressFill.style.width = '100%';
            if (progressText) progressText.textContent = '100%';
            if (loadingText) loadingText.textContent = 'Ready!';

            // Hide loading screen and show navbar
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                const navbar = document.getElementById('navbar');
                if (navbar) navbar.classList.add('loaded');

                setTimeout(() => {
                    loadingScreen.remove();
                }, 800);
            }, 500);
        } else {
            // Update progress
            if (progressFill) progressFill.style.width = progress + '%';
            if (progressText) progressText.textContent = Math.floor(progress) + '%';

            // Continue updating
            setTimeout(updateProgress, 100);
        }
    };

    // Start progress after a short delay
    setTimeout(updateProgress, 200);
}

// Navigation
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenuOverlay = document.getElementById('nav-menu-overlay');
    const navClose = document.getElementById('nav-close');

    // Scroll effect for regular navbar (if exists)
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    });

    // Floating menu toggle
    navToggle?.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenuOverlay?.classList.toggle('active');
    });

    // Close menu button
    navClose?.addEventListener('click', () => {
        navToggle?.classList.remove('active');
        navMenuOverlay?.classList.remove('active');
    });

    // Close menu when clicking overlay
    navMenuOverlay?.addEventListener('click', (e) => {
        if (e.target === navMenuOverlay) {
            navToggle?.classList.remove('active');
            navMenuOverlay?.classList.remove('active');
        }
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle?.classList.remove('active');
            navMenuOverlay?.classList.remove('active');
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Role Carousel
function initRoleCarousel() {
    const roles = document.querySelectorAll('.role');
    let currentRole = 0;

    if (roles.length === 0) return;

    // Initialize first role
    roles[0].classList.add('active');

    // Start the carousel
    setInterval(() => {
        roles[currentRole].classList.remove('active');
        currentRole = (currentRole + 1) % roles.length;
        roles[currentRole].classList.add('active');
    }, 3000);
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe fade-in elements
    document.querySelectorAll('.fade-in').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Contact Form
function initContactForm() {
    const form = document.getElementById('contact-form');

    form?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Basic validation
        if (!data.name || !data.email || !data.message) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        // Simulate form submission
        setTimeout(() => {
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

// Interactive Elements
function initInteractions() {
    // Button ripple effects
    document.querySelectorAll('.btn, .project-link, .social-link').forEach(button => {
        button.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
                z-index: 1000;
            `;

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Enhanced project card hover effects
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Form enhancements
    document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
        input.addEventListener('focus', function () {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function () {
            this.parentElement.classList.remove('focused');
            if (this.value) {
                this.parentElement.classList.add('filled');
            } else {
                this.parentElement.classList.remove('filled');
            }
        });
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        gap: 1rem;
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        max-width: 400px;
        backdrop-filter: blur(10px);
    `;

    // Add to document
    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Add CSS animations
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        flex: 1;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 4px;
        opacity: 0.8;
        transition: opacity 0.2s ease;
    }
    
    .notification-close:hover {
        opacity: 1;
        background: rgba(255, 255, 255, 0.1);
    }
    
    .form-group.focused input,
    .form-group.focused textarea {
        border-color: #60a5fa !important;
        box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2) !important;
    }
    
    .form-group.filled label {
        top: -8px !important;
        font-size: 0.85rem !important;
        color: #60a5fa !important;
    }
`;
document.head.appendChild(animationStyles);
//
 Scroll to Top Button
function initScrollToTop() {
    const scrollToTopBtn = document.getElementById('scroll-to-top');

    if (!scrollToTopBtn) return;

    // Show/hide scroll to top button
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });

    // Scroll to top functionality
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Enhanced animations for better UX
function addEnhancedAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.preview-card, .section-header').forEach(el => {
        observer.observe(el);
    });
}

// Initialize enhanced animations
document.addEventListener('DOMContentLoaded', () => {
    addEnhancedAnimations();
});

// Add CSS for scroll animations
const style = document.createElement('style');
style.textContent = `
    .preview-card,
    .section-header {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .preview-card.animate-in,
    .section-header.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .preview-card:nth-child(1) { transition-delay: 0.1s; }
    .preview-card:nth-child(2) { transition-delay: 0.2s; }
    .preview-card:nth-child(3) { transition-delay: 0.3s; }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
// Enhance
d Footer Interactions
function initFooterEnhancements() {
    // Add hover effects to footer social links
    const footerSocialLinks = document.querySelectorAll('.footer-social .social-link');

    footerSocialLinks.forEach(link => {
        link.addEventListener('mouseenter', function () {
            this.style.transform = 'translateX(10px) scale(1.05)';
        });

        link.addEventListener('mouseleave', function () {
            this.style.transform = 'translateX(0) scale(1)';
        });
    });

    // Animate footer elements on scroll
    const footerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.footer-column, .footer-brand').forEach(el => {
        footerObserver.observe(el);
    });
}

// Enhanced CTA Section
function initCTAEnhancements() {
    const ctaButtons = document.querySelectorAll('.cta-btn');

    ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-3px) scale(1.02)';
        });

        button.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Particle System Enhancement
function initParticleSystem() {
    const heroSection = document.querySelector('.hero-section');
    const particlesContainer = document.querySelector('.hero-particles');

    if (!particlesContainer) return;

    // Add more particles dynamically
    for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.animationDuration = (15 + Math.random() * 10) + 's';
        particle.style.width = (2 + Math.random() * 4) + 'px';
        particle.style.height = particle.style.width;
        particlesContainer.appendChild(particle);
    }
}

// Enhanced Scroll Animations
function initEnhancedScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const enhancedObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;

                // Add different animations based on element type
                if (element.classList.contains('skill-category')) {
                    element.style.animation = 'slideInFromLeft 0.8s ease forwards';
                } else if (element.classList.contains('project-card')) {
                    element.style.animation = 'scaleInCenter 0.6s ease forwards';
                } else if (element.classList.contains('achievement-item')) {
                    element.style.animation = 'slideInFromRight 0.8s ease forwards';
                } else {
                    element.style.animation = 'fadeInUp 0.8s ease forwards';
                }

                // Add stagger effect for grouped elements
                const siblings = element.parentElement.children;
                Array.from(siblings).forEach((sibling, index) => {
                    if (sibling === element) {
                        sibling.style.animationDelay = (index * 0.1) + 's';
                    }
                });
            }
        });
    }, observerOptions);

    // Observe all animated elements
    document.querySelectorAll('.skill-category, .project-card, .achievement-item, .cta-content').forEach(el => {
        el.style.opacity = '0';
        enhancedObserver.observe(el);
    });
}

// Initialize all enhancements
document.addEventListener('DOMContentLoaded', () => {
    initFooterEnhancements();
    initCTAEnhancements();
    initParticleSystem();
    initEnhancedScrollAnimations();
});

// Add CSS for enhanced animations
const enhancedStyle = document.createElement('style');
enhancedStyle.textContent = `
    @keyframes slideInFromLeft {
        from {
            opacity: 0;
            transform: translateX(-100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideInFromRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes scaleInCenter {
        from {
            opacity: 0;
            transform: scale(0.8);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    /* Enhanced hover effects */
    .project-card, .skill-category, .achievement-item {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .project-card:hover {
        transform: translateY(-8px) scale(1.02);
    }
    
    .skill-category:hover {
        transform: translateY(-5px) scale(1.01);
    }
    
    .achievement-item:hover {
        transform: translateY(-3px) scale(1.01);
    }
`;
document.head.appendChild(enhancedStyle);/
    / Counter Animation for Stats
function initCounterAnimations() {
        const counters = document.querySelectorAll('.stat-number[data-target]');

        const animateCounter = (counter) => {
            const target = parseInt(counter.getAttribute('data-target'));
            const increment = target / 100;
            let current = 0;

            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            updateCounter();
        };

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

// Enhanced Project Card Interactions
function initProjectInteractions() {
        const projectCards = document.querySelectorAll('.featured-project, .service-card');

        projectCards.forEach(card => {
            card.addEventListener('mouseenter', function () {
                this.style.transform = 'translateY(-15px) scale(1.02)';
            });

            card.addEventListener('mouseleave', function () {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Add parallax effect to floating icons
        const floatingIcons = document.querySelectorAll('.floating-icon');

        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;

            floatingIcons.forEach((icon, index) => {
                const speed = (index + 1) * 0.5;
                const x = (mouseX - 0.5) * speed * 20;
                const y = (mouseY - 0.5) * speed * 20;

                icon.style.transform = `translate(${x}px, ${y}px) rotate(${x * 0.5}deg)`;
            });
        });
    }

// Testimonial Carousel (if more testimonials are added)
function initTestimonialCarousel() {
        const testimonials = document.querySelectorAll('.testimonial-card');
        let currentTestimonial = 0;

        if (testimonials.length <= 2) return; // No need for carousel with 2 or fewer items

        function showTestimonial(index) {
            testimonials.forEach((testimonial, i) => {
                testimonial.style.display = i === index ? 'block' : 'none';
            });
        }

        function nextTestimonial() {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            showTestimonial(currentTestimonial);
        }

        // Auto-rotate testimonials every 5 seconds
        setInterval(nextTestimonial, 5000);
    }

// Enhanced Scroll Reveal Animations
function initAdvancedScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;

                // Add different reveal animations based on element class
                if (element.classList.contains('stat-item')) {
                    element.style.animation = 'scaleInCenter 0.6s ease forwards';
                } else if (element.classList.contains('service-card')) {
                    element.style.animation = 'slideInFromLeft 0.8s ease forwards';
                } else if (element.classList.contains('featured-project')) {
                    element.style.animation = 'fadeInUp 0.8s ease forwards';
                } else if (element.classList.contains('impact-card')) {
                    element.style.animation = 'scaleInCenter 0.6s ease forwards';
                } else if (element.classList.contains('timeline-item')) {
                    element.style.animation = 'slideInFromRight 0.8s ease forwards';
                } else if (element.classList.contains('testimonial-card')) {
                    element.style.animation = 'fadeInUp 0.6s ease forwards';
                }

                // Add stagger delay for grouped elements
                const parent = element.parentElement;
                const siblings = Array.from(parent.children);
                const index = siblings.indexOf(element);
                element.style.animationDelay = (index * 0.1) + 's';

                revealObserver.unobserve(element);
            }
        });
    }, observerOptions);

    // Observe all animated elements
    const animatedElements = document.querySelectorAll(`
        .stat-item, .service-card, .featured-project, 
        .impact-card, .timeline-item, .testimonial-card,
        .about-content, .about-visual
    `);

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        revealObserver.observe(el);
    });
}

// Dynamic Background Particles
function initDynamicParticles() {
    const sections = document.querySelectorAll('.services-section, .impact-section');

    sections.forEach(section => {
        const particleContainer = document.createElement('div');
        particleContainer.className = 'section-particles';
        particleContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            pointer-events: none;
            z-index: 1;
        `;

        section.style.position = 'relative';
        section.appendChild(particleContainer);

        // Create floating particles
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: linear-gradient(135deg, #60a5fa, #a78bfa);
                border-radius: 50%;
                opacity: 0.4;
                animation: particleFloat ${15 + Math.random() * 10}s infinite linear;
                left: ${Math.random() * 100}%;
                animation-delay: ${Math.random() * 10}s;
            `;
            particleContainer.appendChild(particle);
        }
    });
}

// Smooth Section Transitions
function initSectionTransitions() {
    const sections = document.querySelectorAll('section');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-active');
            }
        });
    }, { threshold: 0.2 });

    sections.forEach(section => {
        sectionObserver.observe(section);
    });
}

// Initialize all enhanced features
document.addEventListener('DOMContentLoaded', () => {
    initCounterAnimations();
    initProjectInteractions();
    initTestimonialCarousel();
    initAdvancedScrollAnimations();
    initDynamicParticles();
    initSectionTransitions();
});

// Add enhanced CSS animations
const advancedStyle = document.createElement('style');
advancedStyle.textContent = `
    .section-active {
        animation: sectionFadeIn 1s ease forwards;
    }
    
    @keyframes sectionFadeIn {
        from {
            opacity: 0.8;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .floating-icon {
        transition: transform 0.3s ease;
    }
    
    .featured-project:hover .project-icon {
        animation: iconBounce 0.6s ease;
    }
    
    @keyframes iconBounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
    }
    
    .service-card:hover .service-icon {
        animation: iconRotate 0.8s ease;
    }
    
    @keyframes iconRotate {
        0% { transform: rotate(0deg) scale(1); }
        50% { transform: rotate(180deg) scale(1.1); }
        100% { transform: rotate(360deg) scale(1); }
    }
    
    .impact-card:hover .impact-icon {
        animation: iconPulse 1s ease infinite;
    }
    
    @keyframes iconPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
`;
document.head.appendChild(advancedStyle);