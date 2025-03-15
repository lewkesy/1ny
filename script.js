// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const headerOffset = 70;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background change on scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Add animation classes to elements
document.querySelectorAll('.feature, .product-card, .about h2, .products h2, .contact h2').forEach(el => {
    el.classList.add('fade-in-element');
    observer.observe(el);
});

// Add hover effect to product cards
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
        this.style.transition = 'all 0.3s ease';
    });

    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Form submission handling
const contactForm = document.querySelector('.contact-form');
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Add loading state
    const submitButton = this.querySelector('button');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    // Simulate form submission (replace with actual form submission)
    setTimeout(() => {
        submitButton.textContent = 'Message Sent!';
        submitButton.style.backgroundColor = '#27ae60';
        
        // Reset form
        this.reset();
        
        // Reset button after 3 seconds
        setTimeout(() => {
            submitButton.textContent = originalText;
            submitButton.style.backgroundColor = '#e67e22';
            submitButton.disabled = false;
        }, 3000);
    }, 1500);
});

// Add CSS class for fade-in elements
const style = document.createElement('style');
style.textContent = `
    .fade-in-element {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }

    .fade-in-element.animate {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    const scrolled = window.pageYOffset;
    hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Enhanced Mobile Menu
const createMobileMenu = () => {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelector('.nav-links');
    
    // Create mobile menu button with improved accessibility
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.classList.add('mobile-menu-btn');
    mobileMenuBtn.setAttribute('aria-label', 'Toggle navigation menu');
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    
    // Add mobile menu button to navbar
    navbar.appendChild(mobileMenuBtn);
    
    // Toggle mobile menu with animation
    mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinks.classList.toggle('show');
        mobileMenuBtn.classList.toggle('active');
        
        // Toggle aria-expanded
        const isExpanded = navLinks.classList.contains('show');
        mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
        
        // Toggle icon
        mobileMenuBtn.innerHTML = isExpanded ? 
            '<i class="fas fa-times"></i>' : 
            '<i class="fas fa-bars"></i>';
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target)) {
            navLinks.classList.remove('show');
            mobileMenuBtn.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
    });

    // Close menu when clicking on a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('show');
            mobileMenuBtn.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        });
    });

    // Handle touch events for product cards
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        let touchStartY = 0;
        let touchEndY = 0;

        card.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
            card.style.transition = 'transform 0.1s ease';
        });

        card.addEventListener('touchmove', (e) => {
            touchEndY = e.touches[0].clientY;
            const deltaY = touchStartY - touchEndY;
            
            if (deltaY > 0) { // Scrolling up
                card.style.transform = 'translateY(-5px)';
            }
        });

        card.addEventListener('touchend', () => {
            card.style.transform = 'translateY(0)';
            card.style.transition = 'transform 0.3s ease';
        });
    });
};

// Initialize mobile menu for all screen sizes and handle resize
const initResponsiveMenu = () => {
    createMobileMenu();
    
    // Handle window resize
    let windowWidth = window.innerWidth;
    window.addEventListener('resize', () => {
        if (window.innerWidth !== windowWidth) {
            windowWidth = window.innerWidth;
            const navLinks = document.querySelector('.nav-links');
            const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
            
            if (windowWidth > 768) {
                navLinks.classList.remove('show');
                if (mobileMenuBtn) {
                    mobileMenuBtn.classList.remove('active');
                    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                    mobileMenuBtn.setAttribute('aria-expanded', 'false');
                }
            }
        }
    });
};

// Initialize responsive menu
initResponsiveMenu();

// Add touch feedback for buttons
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('touchstart', () => {
        button.style.transform = 'scale(0.98)';
    });

    button.addEventListener('touchend', () => {
        button.style.transform = 'scale(1)';
    });
});

// Prevent zoom on double tap for iOS
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Add mobile menu styles
const mobileStyles = document.createElement('style');
mobileStyles.textContent = `
    @media (max-width: 768px) {
        .mobile-menu-btn {
            display: block;
            background: none;
            border: none;
            font-size: 1.5rem;
            color: #2c3e50;
            cursor: pointer;
            padding: 0.5rem;
        }
        
        .nav-links {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background: white;
            padding: 1rem;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            flex-direction: column;
            text-align: center;
        }
        
        .nav-links.show {
            display: flex;
        }
        
        .nav-links li {
            margin: 1rem 0;
        }
    }
`;
document.head.appendChild(mobileStyles); 