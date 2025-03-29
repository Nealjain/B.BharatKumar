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
    
    // Apple-style video wallpaper
    const videoContainer = document.querySelector('.video-container');
    const video = document.getElementById('apple-style-video');
    const brandOverlay = document.querySelector('.brand-overlay');
    
    if (video && videoContainer) {
        // Function to check if element is in viewport
        function isInViewport(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= -100 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + 100
            );
        }
        
        // Function to handle video play/pause cycle
        function handleVideoVisibility() {
            if (isInViewport(videoContainer)) {
                // Only start the cycle if it hasn't been started yet
                if (!videoContainer.classList.contains('cycle-started')) {
                    videoContainer.classList.add('cycle-started');
                    videoContainer.classList.add('in-view');
                    startVideoCycle();
                } else if (!videoContainer.classList.contains('in-view')) {
                    // If returning to view and cycle is already started, just make visible
                    videoContainer.classList.add('in-view');
                }
            } else if (videoContainer.classList.contains('in-view')) {
                // When scrolling away, DON'T hide the video, just mark as not in view
                videoContainer.classList.remove('in-view');
                // But keep video visible
            }
        }
        
        // Function to start the video cycle
        function startVideoCycle() {
            // Reset state
            videoContainer.classList.remove('paused');
            brandOverlay.classList.remove('visible');
            
            // Start video (now plays regardless of view status)
            video.currentTime = 0;
            video.play();
            
            // After 4.5 seconds, smoothly fade out and pause video
            window.playTimer = setTimeout(() => {
                if (video.played.length > 0) { // Only if video actually played
                    // Smooth stop by reducing playback rate gradually
                    let rate = 1.0;
                    const fadeInterval = setInterval(() => {
                        rate -= 0.1;
                        if (rate <= 0.1) {
                            clearInterval(fadeInterval);
                            video.pause();
                            videoContainer.classList.add('paused');
                            brandOverlay.classList.add('visible');
                        } else {
                            video.playbackRate = rate;
                        }
                    }, 50);
                    
                    // After 30 seconds, restart the cycle regardless of viewport visibility
                    window.cycleTimer = setTimeout(() => {
                        if (videoContainer.classList.contains('cycle-started')) {
                            startVideoCycle();
                        }
                    }, 30000);
                }
            }, 4500);
        }
        
        // Check visibility on scroll
        window.addEventListener('scroll', handleVideoVisibility);
        
        // Check initial visibility
        handleVideoVisibility();
        
        // Remove all click interactions - video now plays on its own cycle only
        // No click functionality
    }
    
    // Animation on scroll
    const animateElements = document.querySelectorAll('.fadeIn');
    
    function checkVisible() {
        animateElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                el.classList.add('visible');
            }
        });
    }
    
    window.addEventListener('scroll', checkVisible);
    checkVisible(); // Check on page load
    
    // Handle gallery infinite scrolling
    const galleryScroll = document.querySelector('.gallery-scroll');
    if (galleryScroll) {
        // Force the animation to restart when it ends
        galleryScroll.addEventListener('animationiteration', () => {
            // This ensures the animation continues seamlessly
            galleryScroll.style.animationPlayState = 'running';
        });
    }
});

// Prevent right-clicking and text selection
document.addEventListener('contextmenu', event => event.preventDefault());
document.addEventListener('selectstart', event => event.preventDefault()); 