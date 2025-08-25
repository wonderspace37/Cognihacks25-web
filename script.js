// ===== GLOBAL VARIABLES =====
let currentSection = 'home';
let isScrolling = false;
let scrollTimeout;

// ===== DOM ELEMENTS =====
const loadingScreen = document.getElementById('loadingScreen');
const navbar = document.getElementById('navbar');
const navMenu = document.getElementById('navMenu');
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelectorAll('.nav-link');
const backToTop = document.getElementById('backToTop');
const registrationForm = document.getElementById('registrationForm');
const countdown = document.getElementById('countdown');

// ===== LOADING SCREEN =====
window.addEventListener('load', () => {
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 3000);
});

// ===== NAVIGATION =====
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// ===== SMOOTH SCROLLING =====
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 70; // Account for fixed navbar
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ===== SCROLL EFFECTS =====
window.addEventListener('scroll', () => {
    // Navbar scroll effect
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Back to top button
    if (window.scrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }

    // Active navigation highlighting
    updateActiveNavLink();

    // Parallax effects
    updateParallaxElements();
});

// ===== ACTIVE NAVIGATION =====
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            if (currentSection !== sectionId) {
                currentSection = sectionId;
                updateNavLinks(sectionId);
            }
        }
    });
}

function updateNavLinks(activeSection) {
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${activeSection}`) {
            link.classList.add('active');
        }
    });
}

// ===== PARALLAX EFFECTS =====
function updateParallaxElements() {
    const floatingElements = document.querySelectorAll('.floating-element');
    const scrolled = window.pageYOffset;
    
    floatingElements.forEach(element => {
        const speed = parseFloat(element.getAttribute('data-speed')) || 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
}

// ===== ANIMATION ON SCROLL =====
function animateOnScroll() {
    const elements = document.querySelectorAll('[data-aos]');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('aos-animate');
        }
    });
}

// Add animation classes
document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('[data-aos]');
    elements.forEach(element => {
        element.classList.add('aos-animate');
    });
});

// ===== STATS COUNTER ANIMATION =====
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            if (target >= 1000) {
                stat.textContent = Math.floor(current).toLocaleString();
            } else {
                stat.textContent = Math.floor(current);
            }
        }, 16);
    });
}

// Trigger stats animation when hero section is visible
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStats();
            statsObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

const heroSection = document.querySelector('.hero-section');
if (heroSection) {
    statsObserver.observe(heroSection);
}

// ===== FAQ TOGGLE =====
function toggleFAQ(element) {
    const faqItem = element.closest('.faq-item');
    const isActive = faqItem.classList.contains('active');
    
    // Close all other FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Toggle current item
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// ===== COUNTDOWN TIMER =====
function updateCountdown() {
    const eventDate = new Date('August 30, 2025 07:30:00').getTime();
    const now = new Date().getTime();
    const distance = eventDate - now;
    
    if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    } else {
        // Event has passed
        document.getElementById('countdown').innerHTML = '<h3>Event Complete!</h3><p>Thank you for participating in CogniHacks 2025!</p>';
    }
}

// Update countdown every second
setInterval(updateCountdown, 1000);
updateCountdown(); // Initial call

// ===== FORM HANDLING =====
if (registrationForm) {
    registrationForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(registrationForm);
        const data = Object.fromEntries(formData);
        
        // Show loading state
        const submitBtn = registrationForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        
        try {
            // Submit to Google Sheets
            const response = await submitToGoogleSheets(data);
            
            if (response.success) {
                showNotification('Registration submitted successfully! We\'ll be in touch soon.', 'success');
                registrationForm.reset();
            } else {
                showNotification('Registration failed. Please try again or contact us directly.', 'error');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            showNotification('Registration failed. Please try again or contact us directly.', 'error');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    });
}

// ===== GOOGLE SHEETS INTEGRATION =====
async function submitToGoogleSheets(data) {
    // Replace this URL with your Google Apps Script web app URL
    const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
    
    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Required for Google Apps Script
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                timestamp: new Date().toISOString(),
                name: data.name,
                email: data.email,
                experience: data.experience,
                track: data.track,
                team: data.team
            })
        });
        
        // Since we're using no-cors, we can't read the response
        // But if the request completes, we assume success
        return { success: true };
        
    } catch (error) {
        console.error('Error submitting to Google Sheets:', error);
        return { success: false, error: error.message };
    }
}

// ===== NOTIFICATIONS =====
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 9999;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// ===== INTERACTIVE ELEMENTS =====
// Add hover effects to cards
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.about-card, .track-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add click effects to buttons
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
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
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', (e) => {
    // Escape key closes mobile menu
    if (e.key === 'Escape') {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
    
    // Arrow keys for navigation
    if (e.key === 'ArrowUp' && window.scrollY > 0) {
        e.preventDefault();
        window.scrollBy(0, -100);
    }
    
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        window.scrollBy(0, 100);
    }
});

// ===== PERFORMANCE OPTIMIZATION =====
// Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(() => {
    // Scroll effects here
}, 16)); // 60fps

// ===== ACCESSIBILITY =====
// Add focus indicators
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});

// ===== LAZY LOADING =====
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ===== SMOOTH ANIMATIONS =====
// Add CSS animations for elements entering viewport
const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.about-card, .track-card, .timeline-item, .faq-item');
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        animationObserver.observe(element);
    });
});

// ===== MOBILE OPTIMIZATIONS =====
// Prevent zoom on double tap
let lastTouchEnd = 0;
document.addEventListener('touchend', (event) => {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// ===== UTILITY FUNCTIONS =====
// Debounce function
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Format numbers with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    lazyLoadImages();
    
    // Add smooth scrolling to all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            if (target !== '#') {
                scrollToSection(target.substring(1));
            }
        });
    });
    
    // Add loading states to forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function() {
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                
                // Re-enable after 3 seconds (replace with actual form submission)
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = submitBtn.getAttribute('data-original-text') || 'Submit';
                }, 3000);
            }
        });
    });
    
    // Store original button text
    document.querySelectorAll('button[type="submit"]').forEach(btn => {
        btn.setAttribute('data-original-text', btn.innerHTML);
    });
});

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    // You can send error reports to your analytics service here
});

// ===== SERVICE WORKER REGISTRATION (FOR PWA FEATURES) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// ===== EXPORT FUNCTIONS FOR GLOBAL USE =====
window.scrollToSection = scrollToSection;
window.scrollToTop = scrollToTop;
window.toggleFAQ = toggleFAQ;
window.showNotification = showNotification;
