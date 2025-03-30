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
    
    // Video Section Enhancement with smooth slot machine effect
    const video = document.getElementById('apple-style-video');
    const brandOverlay = document.querySelector('.brand-overlay');
    const brandText = document.querySelector('.brand-text');
    const brandTagline = document.querySelector('.brand-tagline');
    const videoContainer = document.querySelector('.video-container');
    
    if (video) {
        let cycleTimer = null;
        let textTimer = null;
        
        // Set video properties
        video.muted = true;
        video.playsInline = true;
        video.loop = false;
        video.preload = 'auto';
        
        // Text for display with spaces between words
        const finalTextArray = "B.Bharat Kumar".split(" ");
        const finalTaglineArray = "Since 1950s".split(" ");
        
        // Characters for slot machine effect
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.";
        
        // Initialize text
        brandText.innerHTML = "";
        brandTagline.innerHTML = "";
        
        // Start video cycle when loaded
        video.addEventListener('loadeddata', function() {
            videoContainer.classList.add('loaded');
            startCycle();
        });
        
        // Handle video errors
        video.addEventListener('error', function() {
            console.error('Video loading error');
            videoContainer.classList.add('paused');
            brandOverlay.classList.add('visible');
            showText();
        });
        
        // Main cycle function
        function startCycle() {
            // Clear any existing timers
            clearTimeout(cycleTimer);
            clearTimeout(textTimer);
            clearAllAnimationTimers();
            
            // Hide text, show video
            videoContainer.classList.remove('paused');
            brandOverlay.classList.remove('visible');
            brandText.innerHTML = "";
            brandTagline.innerHTML = "";
            
            // Reset and play video
            video.currentTime = 0;
            
            // Play video for exactly 4 seconds
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    // After 4 seconds, pause video and show text
                    cycleTimer = setTimeout(() => {
                        video.pause();
                        videoContainer.classList.add('paused');
                        brandOverlay.classList.add('visible');
                        showText();
                    }, 4000);
                }).catch(error => {
                    console.log('Auto-play prevented:', error);
                    videoContainer.classList.add('paused');
                    brandOverlay.classList.add('visible');
                    showText();
                });
            }
        }
        
        // Animation timers storage
        const animationTimers = [];
        
        // Clear all animation timers
        function clearAllAnimationTimers() {
            while(animationTimers.length > 0) {
                clearTimeout(animationTimers.pop());
            }
        }
        
        // Show text with enhanced slot machine effect
        function showText() {
            // Prepare containers for each word
            let brandTextHTML = "";
            for (let i = 0; i < finalTextArray.length; i++) {
                brandTextHTML += `<span class="word word-${i}" style="opacity: 0;">${generateRandomText(finalTextArray[i].length)}</span> `;
            }
            brandText.innerHTML = brandTextHTML;
            
            let brandTaglineHTML = "";
            for (let i = 0; i < finalTaglineArray.length; i++) {
                brandTaglineHTML += `<span class="word word-${i}" style="opacity: 0;">${generateRandomText(finalTaglineArray[i].length)}</span> `;
            }
            brandTagline.innerHTML = brandTaglineHTML;
            
            // Get all word elements
            const mainWords = document.querySelectorAll('.brand-text .word');
            const taglineWords = document.querySelectorAll('.brand-tagline .word');
            
            // Total animation time for all words = 10 seconds
            const totalAnimTimeMs = 10000;
            const wordDelay = totalAnimTimeMs / (mainWords.length + taglineWords.length + 1);
            
            // Animate main text words one by one
            mainWords.forEach((wordEl, wordIndex) => {
                // Delay each word's animation
                const delay = wordIndex * wordDelay;
                
                // Make word visible with delay
                animationTimers.push(setTimeout(() => {
                    wordEl.style.opacity = "1";
                    
                    // Animate each letter in the word
                    const word = finalTextArray[wordIndex];
                    const letterAnimTime = wordDelay / (word.length + 1);
                    
                    for (let letterIndex = 0; letterIndex < word.length; letterIndex++) {
                        // Create slot machine effect for each letter
                        animateLetterInWord(wordEl, letterIndex, word[letterIndex], letterAnimTime, letterIndex * letterAnimTime);
                    }
                }, delay));
            });
            
            // Animate tagline words with delay after main text
            const taglineStartDelay = mainWords.length * wordDelay + wordDelay/2;
            
            taglineWords.forEach((wordEl, wordIndex) => {
                const delay = taglineStartDelay + wordIndex * wordDelay;
                
                // Make word visible with delay
                animationTimers.push(setTimeout(() => {
                    wordEl.style.opacity = "1";
                    
                    // Animate each letter in the word
                    const word = finalTaglineArray[wordIndex];
                    const letterAnimTime = wordDelay / (word.length + 1);
                    
                    for (let letterIndex = 0; letterIndex < word.length; letterIndex++) {
                        // Create slot machine effect for each letter
                        animateLetterInWord(wordEl, letterIndex, word[letterIndex], letterAnimTime, letterIndex * letterAnimTime);
                    }
                }, delay));
            });
            
            // Schedule next cycle after 30 seconds
            textTimer = setTimeout(() => {
                startCycle();
            }, 30000);
        }
        
        // Animate a single letter with slot machine effect
        function animateLetterInWord(wordEl, letterIndex, finalLetter, duration, delay) {
            // Generate random characters for the effect (5-10 characters)
            const numRandomChars = 5 + Math.floor(Math.random() * 6); // 5-10 characters
            const initialText = wordEl.textContent;
            
            // Track the current frame
            let frame = 0;
            const totalFrames = numRandomChars;
            const frameInterval = duration / totalFrames;
            
            // Start animation after specified delay
            const letterTimer = setTimeout(() => {
                // Create interval for changing characters
                const interval = setInterval(() => {
                    // Get current text and split into array
                    let textArray = wordEl.textContent.split('');
                    
                    // If we've reached the last frame, show the final letter
                    if (frame >= totalFrames - 1) {
                        textArray[letterIndex] = finalLetter;
                        wordEl.textContent = textArray.join('');
                        clearInterval(interval);
                        return;
                    }
                    
                    // Otherwise show random character
                    textArray[letterIndex] = chars.charAt(Math.floor(Math.random() * chars.length));
                    wordEl.textContent = textArray.join('');
                    
                    frame++;
                }, frameInterval);
                
                // Store timer reference
                animationTimers.push(interval);
            }, delay);
            
            // Store timer reference
            animationTimers.push(letterTimer);
        }
        
        // Generate random text of specified length
        function generateRandomText(length) {
            let result = '';
            for (let i = 0; i < length; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        }
        
        // Start the cycle after a short delay
        setTimeout(startCycle, 1000);
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

// Add letter-by-letter animation
function animateLetters() {
    const elements = document.querySelectorAll('.brand-text, .brand-tagline');
    
    elements.forEach(element => {
        const text = element.textContent;
        let html = '';
        
        // Split text into letters
        for (let i = 0; i < text.length; i++) {
            if (text[i] === ' ') {
                html += ' ';
            } else {
                const delay = i * 0.05; // 50ms delay between each letter
                html += `<span class="letter" style="animation-delay: ${delay}s">${text[i]}</span>`;
            }
        }
        
        element.innerHTML = html;
        element.classList.add('animate-letters');
    });
}

// Parallax scrolling effect
function initParallaxEffect() {
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        
        // Parallax for hero section
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.style.backgroundPositionY = `${scrolled * 0.5}px`;
        }
        
        // Subtle parallax for collection items
        const collectionItems = document.querySelectorAll('.gallery-item img');
        collectionItems.forEach(item => {
            const parent = item.closest('.gallery-item');
            const rect = parent.getBoundingClientRect();
            if (rect) {
                const centerY = rect.top + rect.height / 2;
                const viewportCenter = window.innerHeight / 2;
                const distanceFromCenter = (centerY - viewportCenter) * 0.05;
                
                item.style.transform = `translateY(${distanceFromCenter}px) scale(1.1)`;
            }
        });
    });
}

// 3D hover effect for gallery items
function init3DHoverEffect() {
    const items = document.querySelectorAll('.gallery-item');
    
    items.forEach(item => {
        item.addEventListener('mousemove', handleHover3D);
        item.addEventListener('mouseleave', resetHover3D);
    });
}

function handleHover3D(e) {
    const item = this;
    const rect = item.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const angleX = (y - centerY) / 20;
    const angleY = (centerX - x) / 20;
    
    item.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale3d(1.05, 1.05, 1.05)`;
    item.style.transition = 'transform 0.1s ease';
    
    // Add shadow based on tilt
    const shadow = `0 ${Math.abs(angleX) * 2}px ${Math.abs(angleY) * 2}px rgba(0,0,0,0.2)`;
    item.style.boxShadow = shadow;
}

function resetHover3D() {
    this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    this.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease';
    this.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
}

// Initialize these features when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Call function when video section is in view
    const videoSection = document.getElementById('video-wallpaper');
    const brandOverlay = document.querySelector('.brand-overlay');

    if (videoSection && brandOverlay) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        brandOverlay.classList.add('visible');
                        animateLetters();
                    }, 500);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(videoSection);
    }
    
    // Initialize futuristic features
    initParallaxEffect();
    init3DHoverEffect();
}); 