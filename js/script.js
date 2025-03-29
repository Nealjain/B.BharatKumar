// DOM elements
const navbarMenu = document.getElementById("menu");
const burgerMenu = document.getElementById("burger");
const headerMenu = document.getElementById("header");

// Open Close Navbar Menu on Click Burger
if (burgerMenu && navbarMenu) {
    burgerMenu.addEventListener("click", () => {
        burgerMenu.classList.toggle("is-active");
        navbarMenu.classList.toggle("is-active");
    });
}

// Close Navbar Menu on Click Links
document.querySelectorAll(".menu-link").forEach((link) => {
    link.addEventListener("click", () => {
        burgerMenu.classList.remove("is-active");
        navbarMenu.classList.remove("is-active");
    });
});

// Fixed Navbar Menu on Window Resize
window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) {
        if (navbarMenu.classList.contains("is-active")) {
            navbarMenu.classList.remove("is-active");
        }
    }
});

// Dark and Light Mode on Switch Click
document.addEventListener("DOMContentLoaded", () => {
    const darkSwitch = document.getElementById("switch");

    darkSwitch.addEventListener("click", () => {
        document.documentElement.classList.toggle("darkmode");
        document.body.classList.toggle("darkmode");
    });
    
    // Smooth scrolling for navigation links
    const links = document.querySelectorAll('a[href^="#"]');
    
    for (const link of links) {
        link.addEventListener('click', smoothScroll);
    }
    
    function smoothScroll(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    }

    // Scroll reveal animations
    const revealElements = document.querySelectorAll('.section');
    
    function checkReveal() {
        for (let i = 0; i < revealElements.length; i++) {
            const windowHeight = window.innerHeight;
            const elementTop = revealElements[i].getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                revealElements[i].classList.add('active');
            }
        }
    }
    
    window.addEventListener('scroll', checkReveal);
    checkReveal();
    
    // Collection category buttons
    const categoryBtns = document.querySelectorAll('.category-btn');
    
    if (categoryBtns.length > 0) {
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                categoryBtns.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                btn.classList.add('active');
                
                // Filtering functionality for collection items
                const collectionItems = document.querySelectorAll('.collection-item');
                const category = btn.textContent.toLowerCase();
                
                collectionItems.forEach(item => {
                    item.style.opacity = '0.4';
                    item.style.transform = 'scale(0.95)';
                    
                    setTimeout(() => {
                        if (category === 'all' || Math.random() > 0.5) {
                            item.style.display = 'block';
                            setTimeout(() => {
                                item.style.opacity = '1';
                                item.style.transform = 'scale(1)';
                            }, 50);
                        } else {
                            item.style.display = 'none';
                        }
                    }, 300);
                });
            });
        });
    }
});

// Mobile Navigation
document.addEventListener('DOMContentLoaded', function() {
    // Simple video initialization
    const video = document.getElementById('apple-style-video');
    if (video) {
        video.muted = true;
        video.playsInline = true;
        video.loop = true;
        
        // Force play on page load
        setTimeout(() => {
            video.play().catch(e => {
                console.log('Video play failed:', e);
            });
        }, 1000);
    }
    
    // Prevent image context menu, dragging, and selection
    document.addEventListener('contextmenu', event => {
        if (event.target.tagName === 'IMG') {
            event.preventDefault();
            return false;
        }
    });
    
    document.addEventListener('dragstart', event => {
        if (event.target.tagName === 'IMG') {
            event.preventDefault();
            return false;
        }
    });
    
    document.addEventListener('selectstart', event => {
        if (event.target.tagName === 'IMG') {
            event.preventDefault();
            return false;
        }
    });
    
    // Block common keyboard shortcuts for saving images
    document.addEventListener('keydown', function(event) {
        // Block Ctrl+S, Ctrl+P, Ctrl+Shift+S
        if ((event.ctrlKey || event.metaKey) && 
            (event.key === 's' || event.key === 'p' || 
             (event.shiftKey && event.key === 's'))) {
            event.preventDefault();
            return false;
        }
    });
    
    // Add guard attribute to all images
    document.querySelectorAll('img').forEach(img => {
        img.setAttribute('oncontextmenu', 'return false');
        img.setAttribute('ondragstart', 'return false');
        img.setAttribute('onselectstart', 'return false');
    });
    
    // Mobile Navigation Toggle
    const menuToggle = document.querySelector('.mobile-nav-toggle');
    const nav = document.querySelector('nav');
    const body = document.body;
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            nav.classList.toggle('active');
            body.classList.toggle('menu-open');
        });
    }
    
    // Close mobile nav when clicking menu items
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (nav.classList.contains('active')) {
                menuToggle.classList.remove('active');
                nav.classList.remove('active');
                body.classList.remove('menu-open');
            }
        });
    });
    
    // Close mobile nav when clicking outside
    document.addEventListener('click', function(e) {
        if (nav.classList.contains('active') && 
            !e.target.closest('nav') && 
            !e.target.closest('.mobile-nav-toggle')) {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
            body.classList.remove('menu-open');
        }
    });
    
    // Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 60,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Header scroll effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.style.padding = '10px 0';
            header.classList.add('scrolled');
        } else {
            header.style.padding = '15px 0';
            header.classList.remove('scrolled');
        }
    });
    
    // Responsive logo size
    function adjustLogoSize() {
        const logo = document.querySelector('.logo a');
        if (logo) {
            if (window.innerWidth <= 350) {
                logo.style.fontSize = '0.8rem';
            } else if (window.innerWidth <= 480) {
                logo.style.fontSize = '0.9rem';
            } else if (window.innerWidth <= 768) {
                logo.style.fontSize = '1.1rem';
            } else if (window.innerWidth <= 992) {
                logo.style.fontSize = '1.3rem';
            } else {
                logo.style.fontSize = '1.6rem';
            }
        }
    }
    
    // Call once on load and then on resize
    adjustLogoSize();
    window.addEventListener('resize', adjustLogoSize);
    
    // Handle gallery infinite scrolling
    const galleryScroll = document.querySelector('.gallery-scroll');
    if (galleryScroll) {
        // Force the animation to restart when it ends
        galleryScroll.addEventListener('animationiteration', () => {
            // This ensures the animation continues seamlessly
            galleryScroll.style.animationPlayState = 'running';
        });
    }

    // Play the video no matter what
    const bannerVideo = document.getElementById('banner-video');
    if (bannerVideo) {
        // Ensure video attributes are set programmatically
        bannerVideo.muted = true;
        bannerVideo.loop = true;
        bannerVideo.playsInline = true;
        bannerVideo.autoplay = true;
        
        // Try immediately
        playVideo();
        
        // Try again after a short delay
        setTimeout(playVideo, 1000);
        
        // And again after another delay
        setTimeout(playVideo, 3000);
        
        // Try on scroll
        window.addEventListener('scroll', playVideo, {once: true});
        
        // Try on click anywhere
        document.addEventListener('click', playVideo, {once: true});
        
        function playVideo() {
            bannerVideo.play().catch(error => {
                console.log('Video play attempt:', error);
            });
        }
    }
});

// Global prevention of right-click and text selection
document.addEventListener('contextmenu', event => event.preventDefault());
document.addEventListener('selectstart', event => event.preventDefault()); 