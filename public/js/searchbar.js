// === NAVBAR SCROLL ANIMATION JAVASCRIPT ===

class WanderLustNavbarAnimation {
    constructor() {
        this.navbar = document.getElementById('mainNavbar') || document.querySelector('.fixed-navbar');
        this.scrollThreshold = 100; // Adjust this value to control when animation triggers
        this.isScrolled = false;
        this.ticking = false;
        
        // Only initialize if navbar exists
        if (this.navbar) {
            this.init();
        }
    }
    
    init() {
        // Bind scroll event with performance optimization
        window.addEventListener('scroll', () => this.requestTick(), { passive: true });
        
        // Handle resize events to recalculate on screen size changes
        window.addEventListener('resize', () => this.handleResize(), { passive: true });
        
        // Initial check in case page loads already scrolled
        this.updateNavbar();
    }
    
    requestTick() {
        if (!this.ticking) {
            this.ticking = true;
            requestAnimationFrame(() => this.updateNavbar());
        }
    }
    
    updateNavbar() {
        const scrollY = window.scrollY;
        const shouldBeScrolled = scrollY > this.scrollThreshold;
        
        // Only update DOM if state actually changed
        if (shouldBeScrolled !== this.isScrolled) {
            this.isScrolled = shouldBeScrolled;
            
            if (this.isScrolled) {
                this.navbar.classList.add('navbar-scrolled');
                // Optional: Add body class for additional styling
                document.body.classList.add('navbar-compact');
            } else {
                this.navbar.classList.remove('navbar-scrolled');
                document.body.classList.remove('navbar-compact');
            }
            
            // Trigger custom event for other scripts that might need to know
            window.dispatchEvent(new CustomEvent('navbarStateChange', {
                detail: { isScrolled: this.isScrolled }
            }));
        }
        
        this.ticking = false;
    }
    
    handleResize() {
        // Recalculate on resize with debouncing
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            this.updateNavbar();
        }, 100);
    }
    
    // Public method to manually trigger animation (useful for debugging)
    forceUpdate() {
        this.updateNavbar();
    }
    
    // Public method to change scroll threshold dynamically
    setScrollThreshold(newThreshold) {
        this.scrollThreshold = newThreshold;
        this.updateNavbar();
    }
}

// === INITIALIZATION ===

// Initialize when DOM is ready
function initializeNavbarAnimation() {
    // Create global instance for debugging/external access
    window.wanderLustNavbar = new WanderLustNavbarAnimation();
}

// Multiple initialization methods to ensure it works in all scenarios
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeNavbarAnimation);
} else {
    initializeNavbarAnimation();
}

// Fallback initialization after window load
window.addEventListener('load', () => {
    if (!window.wanderLustNavbar) {
        initializeNavbarAnimation();
    }
});

// === ADDITIONAL ENHANCEMENTS ===

// Smooth scroll behavior for better UX (optional)
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling to anchor links if they exist
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// === UTILITY FUNCTIONS ===

// Function to check if navbar animation is active (useful for other scripts)
function isNavbarScrolled() {
    return window.wanderLustNavbar ? window.wanderLustNavbar.isScrolled : false;
}

// Function to manually trigger navbar state change (useful for SPA navigation)
function updateNavbarState() {
    if (window.wanderLustNavbar) {
        window.wanderLustNavbar.forceUpdate();
    }
}

// === PERFORMANCE MONITORING (Development Only) ===
// Remove this section in production if not needed

if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // Performance monitoring for development
    let scrollEventCount = 0;
    let animationFrameCount = 0;
    
    window.addEventListener('scroll', () => {
        scrollEventCount++;
        if (scrollEventCount % 100 === 0) {
            console.log(`Scroll events: ${scrollEventCount}, Animation frames: ${animationFrameCount}`);
        }
    });
    
    // Override requestAnimationFrame to count frames
    const originalRAF = window.requestAnimationFrame;
    window.requestAnimationFrame = function(callback) {
        animationFrameCount++;
        return originalRAF.call(window, callback);
    };
}