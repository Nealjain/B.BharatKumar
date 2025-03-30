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
    
    // Video Section Enhancement with 4-sec cycles and text slot machine
    const video = document.getElementById('apple-style-video');
    const brandOverlay = document.querySelector('.brand-overlay');
    const brandText = document.querySelector('.brand-text');
    const brandTagline = document.querySelector('.brand-tagline');
    const videoContainer = document.querySelector('.video-container');
    
    if (video) {
        // Set video properties
        video.muted = true;
        video.playsInline = true;
        video.loop = false; // Don't loop automatically
        video.preload = 'auto';
        
        // Characters for slot machine effect
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        const finalText = "B.BharatKumar";
        const finalTagline = "Since 1950s";
        let frameCount = 0;
        const framesPerChar = 3;
        let textUpdateInterval;
        
        // Initialize text
        brandText.textContent = generateRandomString(finalText.length);
        brandTagline.textContent = "";
        
        // Start video cycle when loaded
        video.addEventListener('loadeddata', function() {
            videoContainer.classList.add('loaded');
            startVideoCycle();
        });
        
        // Handle video errors
        video.addEventListener('error', function() {
            console.error('Video loading error');
            brandOverlay.classList.add('visible');
            videoContainer.classList.add('paused');
        });
        
        // Video ended event
        video.addEventListener('ended', function() {
            videoContainer.classList.add('paused');
            brandOverlay.classList.add('visible');
            startSlotMachineEffect();
        });
        
        // Start video play cycle
        function startVideoCycle() {
            // Reset state
            clearInterval(textUpdateInterval);
            videoContainer.classList.remove('paused');
            brandOverlay.classList.remove('visible');
            
            // Reset video and play
            video.currentTime = 0;
            
            // Play for 4 seconds then pause and show overlay
            const playPromise = video.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    // If video is longer than 4 seconds, set a timeout to pause it
                    if (video.duration > 4) {
                        setTimeout(() => {
                            video.pause();
                            videoContainer.classList.add('paused');
                            brandOverlay.classList.add('visible');
                            startSlotMachineEffect();
                        }, 4000);
                    }
                    // If video is shorter than 4 seconds, the 'ended' event will trigger
                }).catch(error => {
                    console.log('Auto-play prevented:', error);
                    videoContainer.classList.add('paused');
                    brandOverlay.classList.add('visible');
                    startSlotMachineEffect();
                });
            }
        }
        
        // Start slot machine text effect
        function startSlotMachineEffect() {
            frameCount = 0;
            
            // Start with random text
            brandText.textContent = generateRandomString(finalText.length);
            brandTagline.textContent = "";
            
            // Update text with slot machine effect
            textUpdateInterval = setInterval(() => {
                frameCount++;
                
                // Generate partially completed main text
                let text = "";
                for (let i = 0; i < finalText.length; i++) {
                    // If this character position should be finalized
                    if (frameCount >= i * framesPerChar) {
                        text += finalText[i];
                    } else {
                        text += chars[Math.floor(Math.random() * chars.length)];
                    }
                }
                
                // Update the display
                brandText.textContent = text;
                
                // Start showing tagline after main text is complete
                if (frameCount >= finalText.length * framesPerChar) {
                    // Generate tagline text with slot machine effect
                    let taglineText = "";
                    for (let i = 0; i < finalTagline.length; i++) {
                        // Offset the tagline animation to start after main text completes
                        const taglineFrame = frameCount - (finalText.length * framesPerChar);
                        if (taglineFrame >= i * 2) {
                            taglineText += finalTagline[i];
                        } else {
                            taglineText += chars[Math.floor(Math.random() * chars.length)];
                        }
                    }
                    brandTagline.textContent = taglineText;
                }
                
                // If effect is complete
                if (frameCount >= finalText.length * framesPerChar + finalTagline.length * 2 + 20) {
                    clearInterval(textUpdateInterval);
                    
                    // After 3 seconds, start the cycle again
                    setTimeout(() => {
                        startVideoCycle();
                    }, 3000);
                }
            }, 50);
        }
        
        // Generate random string of specified length
        function generateRandomString(length) {
            let result = '';
            for (let i = 0; i < length; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        }
        
        // Initial cycle start
        setTimeout(() => {
            if (videoContainer.classList.contains('loaded')) {
                startVideoCycle();
            }
        }, 1000);
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