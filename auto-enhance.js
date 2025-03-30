/**
 * B.BharatKumar Website Auto-Enhancer
 * 
 * This script automatically enhances the website over time by:
 * 1. Analyzing current code
 * 2. Generating small improvements using AI
 * 3. Implementing changes
 * 4. Committing and pushing to GitHub
 * 
 * Run with: node auto-enhance.js
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');
const readline = require('readline');

// Configuration
const CONFIG = {
    enhanceInterval: 12 * 60 * 60 * 1000, // 12 hours between enhancements
    commitMessage: 'Auto-enhancement: AI-generated improvement',
    maxChangesPerRun: 1, // Keep changes minimal
    targetFiles: [
        { path: 'css/style.css', weight: 3 },
        { path: 'js/script.js', weight: 3 },
        { path: 'index.html', weight: 2 }
    ],
    improvementTypes: [
        { name: 'Add subtle animations', weight: 2 },
        { name: 'Improve mobile responsiveness', weight: 3 },
        { name: 'Optimize performance', weight: 2 },
        { name: 'Enhance visual appeal', weight: 3 },
        { name: 'Add accessibility features', weight: 2 },
        { name: 'Ensure showcase-only compliance', weight: 4 } // Higher weight for compliance
    ],
    enhancementLog: 'enhancement-log.json',
    // Business requirements
    businessRequirements: {
        showcaseOnly: true,          // Only for displaying, not selling
        noPrices: true,              // No mention of prices or discounts
        primaryFocus: "92.5 silver", // Primary business focus
        secondaryFocus: "gold",      // Secondary business focus
        noBuyOptions: true,          // No buy or order buttons
        noMisleadingInfo: true       // No misleading claims about sales
    }
};

// Utility to execute shell commands
function executeCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing command: ${error.message}`);
                return reject(error);
            }
            if (stderr) {
                console.warn(`Command warning: ${stderr}`);
            }
            resolve(stdout);
        });
    });
}

// Load enhancement log
function loadEnhancementLog() {
    try {
        if (fs.existsSync(CONFIG.enhancementLog)) {
            return JSON.parse(fs.readFileSync(CONFIG.enhancementLog));
        }
    } catch (err) {
        console.error('Error loading enhancement log:', err);
    }
    return { lastRun: 0, enhancements: [] };
}

// Save enhancement log
function saveEnhancementLog(log) {
    try {
        fs.writeFileSync(CONFIG.enhancementLog, JSON.stringify(log, null, 2));
    } catch (err) {
        console.error('Error saving enhancement log:', err);
    }
}

// Select a file to enhance using weighted random selection
function selectTargetFile() {
    const totalWeight = CONFIG.targetFiles.reduce((sum, file) => sum + file.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const file of CONFIG.targetFiles) {
        random -= file.weight;
        if (random <= 0) {
            return file.path;
        }
    }
    
    return CONFIG.targetFiles[0].path; // Fallback
}

// Select improvement type using weighted random selection
function selectImprovementType() {
    const totalWeight = CONFIG.improvementTypes.reduce((sum, type) => sum + type.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const type of CONFIG.improvementTypes) {
        random -= type.weight;
        if (random <= 0) {
            return type.name;
        }
    }
    
    return CONFIG.improvementTypes[0].name; // Fallback
}

// Read file content
function readFile(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf-8');
    } catch (err) {
        console.error(`Error reading file ${filePath}:`, err);
        return null;
    }
}

// Generate enhancement using AI-like logic
function generateEnhancement(filePath, improvementType) {
    const fileContent = readFile(filePath);
    
    if (!fileContent) {
        return { file: filePath, type: improvementType, changes: [] };
    }
    
    const fileExtension = path.extname(filePath);
    
    let enhancement = {
        file: filePath,
        type: improvementType,
        description: `Enhanced ${path.basename(filePath)} with ${improvementType.toLowerCase()}`,
        changes: []
    };
    
    // Simple enhancements based on file type and improvement type
    if (fileExtension === '.css') {
        enhancement = generateCssEnhancement(fileContent, improvementType, enhancement);
    } else if (fileExtension === '.js') {
        enhancement = generateJsEnhancement(fileContent, improvementType, enhancement);
    } else if (fileExtension === '.html') {
        enhancement = generateHtmlEnhancement(fileContent, improvementType, enhancement);
    }
    
    return enhancement;
}

// Add new function for ensuring showcase-only compliance
function ensureComplianceWithBusinessRequirements(fileContent, fileExtension) {
    const changes = [];
    
    if (fileExtension === '.html') {
        // Check for buy/order buttons and replace them
        if (CONFIG.businessRequirements.noBuyOptions) {
            // Replace buy/order/purchase buttons with "View Details" or disable them
            if (fileContent.match(/buy|order|purchase|shop now|add to cart/i)) {
                changes.push({
                    type: 'replace',
                    search: /<button[^>]*>(.*?buy.*?)<\/button>/gi,
                    replacement: '<button class="view-btn" disabled>View Details</button>'
                });
                
                changes.push({
                    type: 'replace',
                    search: /<button[^>]*>(.*?order.*?)<\/button>/gi,
                    replacement: '<button class="view-btn" disabled>View Details</button>'
                });
                
                changes.push({
                    type: 'replace',
                    search: /<button[^>]*>(.*?purchase.*?)<\/button>/gi,
                    replacement: '<button class="view-btn" disabled>View Details</button>'
                });
                
                changes.push({
                    type: 'replace',
                    search: /<button[^>]*>(.*?shop now.*?)<\/button>/gi,
                    replacement: '<button class="view-btn" disabled>View Collection</button>'
                });
                
                changes.push({
                    type: 'replace',
                    search: /<button[^>]*>(.*?add to cart.*?)<\/button>/gi,
                    replacement: '<button class="view-btn" disabled>View Details</button>'
                });
                
                // Replace links with similar text
                changes.push({
                    type: 'replace',
                    search: /<a[^>]*>(.*?buy.*?)<\/a>/gi,
                    replacement: '<a href="javascript:void(0)" class="view-link">View Details</a>'
                });
                
                changes.push({
                    type: 'replace',
                    search: /<a[^>]*>(.*?order.*?)<\/a>/gi,
                    replacement: '<a href="javascript:void(0)" class="view-link">View Details</a>'
                });
            }
        }
        
        // Add showcase-only notice if not present
        if (CONFIG.businessRequirements.showcaseOnly) {
            if (!fileContent.includes('showcase only') && !fileContent.includes('display only')) {
                const heroSection = fileContent.match(/<section[^>]*hero[^>]*>([\s\S]*?)<\/section>/i);
                if (heroSection) {
                    changes.push({
                        type: 'replace',
                        search: heroSection[0],
                        replacement: heroSection[0].replace(
                            /<\/h1>/i, 
                            '</h1>\n      <p class="showcase-notice">Showcase Only - Not For Sale</p>'
                        )
                    });
                }
                
                // Add disclaimer in footer if not present
                const footerSection = fileContent.match(/<footer[^>]*>([\s\S]*?)<\/footer>/i);
                if (footerSection && !footerSection[0].includes('showcase')) {
                    changes.push({
                        type: 'replace',
                        search: footerSection[0],
                        replacement: footerSection[0].replace(
                            /<\/footer>/i,
                            '  <div class="disclaimer">\n    <p>This website is for showcase purposes only. Products displayed are not for sale.</p>\n  </div>\n</footer>'
                        )
                    });
                }
            }
        }
        
        // Ensure primary business focus is mentioned
        if (!fileContent.includes(CONFIG.businessRequirements.primaryFocus)) {
            const aboutSection = fileContent.match(/<section[^>]*about[^>]*>([\s\S]*?)<\/section>/i);
            if (aboutSection) {
                changes.push({
                    type: 'replace',
                    search: aboutSection[0],
                    replacement: aboutSection[0].replace(
                        /<\/p>/i,
                        ` Our primary focus is ${CONFIG.businessRequirements.primaryFocus} jewelry, with a small selection of ${CONFIG.businessRequirements.secondaryFocus} pieces also on display.</p>`
                    )
                });
            }
        }
        
        // Remove price mentions
        if (CONFIG.businessRequirements.noPrices) {
            changes.push({
                type: 'replace',
                search: /\$\d+(\.\d{2})?/g,
                replacement: ''
            });
            
            changes.push({
                type: 'replace',
                search: /Rs\.\s*\d+/g,
                replacement: ''
            });
            
            changes.push({
                type: 'replace',
                search: /₹\s*\d+/g,
                replacement: ''
            });
            
            changes.push({
                type: 'replace',
                search: /(price|cost):\s*[\w\s\.₹$,]+/gi,
                replacement: ''
            });
            
            changes.push({
                type: 'replace',
                search: /(discount|sale|offer|special price)/gi,
                replacement: 'exclusive design'
            });
        }
    } 
    else if (fileExtension === '.css') {
        // Add CSS for showcase notice
        if (CONFIG.businessRequirements.showcaseOnly && !fileContent.includes('.showcase-notice')) {
            changes.push({
                type: 'add',
                position: fileContent.lastIndexOf('}') + 1,
                content: `\n\n/* Auto-enhanced: Added showcase notice styling */
.showcase-notice {
    background-color: var(--gold);
    color: white;
    padding: 8px 16px;
    display: inline-block;
    margin-top: 15px;
    font-weight: 500;
    border-radius: 4px;
}

.disclaimer {
    background-color: #f8f8f8;
    padding: 15px;
    text-align: center;
    margin-top: 20px;
    border-top: 1px solid #eee;
}

.disclaimer p {
    font-size: 0.9rem;
    color: #666;
    margin: 0;
}\n`
            });
        }
        
        // Style disabled buttons
        if (CONFIG.businessRequirements.noBuyOptions && !fileContent.includes('.view-btn')) {
            changes.push({
                type: 'add',
                position: fileContent.lastIndexOf('}') + 1,
                content: `\n\n/* Auto-enhanced: Added view-only button styling */
.view-btn {
    background-color: #f0f0f0;
    color: var(--dark);
    border: 1px solid #ddd;
    padding: 8px 16px;
    cursor: default;
    transition: background-color 0.3s;
}

.view-btn:hover {
    background-color: #e8e8e8;
}

.view-link {
    color: var(--dark);
    text-decoration: none;
    border-bottom: 1px dotted var(--gold);
}

.view-link:hover {
    color: var(--gold);
}\n`
            });
        }
    }
    else if (fileExtension === '.js') {
        // Disable e-commerce related functionality
        if (CONFIG.businessRequirements.noBuyOptions) {
            if (fileContent.includes('add to cart') || fileContent.includes('buy') || fileContent.includes('purchase')) {
                changes.push({
                    type: 'add',
                    position: fileContent.lastIndexOf('});') + 3,
                    content: `\n\n// Auto-enhanced: Added showcase-only compliance
document.addEventListener('DOMContentLoaded', function() {
    // Disable any remaining buy/order/purchase buttons
    const buyButtons = document.querySelectorAll('button, a');
    buyButtons.forEach(button => {
        const buttonText = button.textContent.toLowerCase();
        if (buttonText.includes('buy') || 
            buttonText.includes('order') || 
            buttonText.includes('purchase') || 
            buttonText.includes('add to cart') ||
            buttonText.includes('shop now')) {
            
            // Replace with view button
            if (button.tagName === 'BUTTON') {
                button.textContent = 'View Details';
                button.disabled = true;
                button.classList.add('view-btn');
            } else if (button.tagName === 'A') {
                button.textContent = 'View Details';
                button.setAttribute('href', 'javascript:void(0)');
                button.classList.add('view-link');
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                });
            }
        }
    });
    
    // Add alert for any remaining purchase attempts
    document.body.addEventListener('click', function(e) {
        const target = e.target;
        if (target.tagName === 'BUTTON' || target.tagName === 'A') {
            const text = target.textContent.toLowerCase();
            if (text.includes('buy') || 
                text.includes('order') || 
                text.includes('purchase') || 
                text.includes('add to cart') ||
                text.includes('shop now')) {
                
                e.preventDefault();
                e.stopPropagation();
                alert('This website is for showcase purposes only. Products are not for sale.');
                return false;
            }
        }
    });
});\n`
                });
            }
        }
    }
    
    return changes;
}

// Generate HTML enhancement
function generateHtmlEnhancement(fileContent, improvementType, enhancement) {
    console.log(`Generating HTML enhancement: ${improvementType}`);
    
    // For business requirement compliance, use a dedicated function
    if (improvementType === 'Ensure showcase-only compliance') {
        const complianceChanges = ensureComplianceWithBusinessRequirements(fileContent, '.html');
        enhancement.changes = enhancement.changes.concat(complianceChanges);
        return enhancement;
    }
    
    // Existing code for other enhancement types
    switch (improvementType) {
        case 'Add accessibility features':
            if (!fileContent.includes('aria-label')) {
                // Add aria-labels to social media links
                let socialIconsMatch = fileContent.match(/<div class="social-icons">([\s\S]*?)<\/div>/);
                if (socialIconsMatch) {
                    let socialIconsContent = socialIconsMatch[1];
                    let enhancedContent = socialIconsContent
                        .replace(/<a href="#"><i class="fab fa-facebook-f"><\/i><\/a>/, '<a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>')
                        .replace(/<a href="#"><i class="fab fa-instagram"><\/i><\/a>/, '<a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>')
                        .replace(/<a href="#"><i class="fab fa-twitter"><\/i><\/a>/, '<a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>')
                        .replace(/<a href="#"><i class="fab fa-whatsapp"><\/i><\/a>/, '<a href="#" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i></a>');
                        
                    enhancement.changes.push({
                        type: 'replace',
                        search: socialIconsContent,
                        replacement: enhancedContent
                    });
                }
            }
            break;
            
        case 'Optimize performance':
            // Add loading attributes to images
            if (!fileContent.includes('loading="lazy"')) {
                enhancement.changes.push({
                    type: 'replace',
                    search: /<img src="([^"]+)" alt="([^"]+)"/g,
                    replacement: '<img src="$1" alt="$2" loading="lazy"'
                });
            }
            break;
            
        case 'Enhance visual appeal':
            // Add subtle icon to headings
            if (!fileContent.includes('section-title-icon')) {
                const sectionHeaders = fileContent.match(/<h2>([^<]+)<\/h2>/g);
                if (sectionHeaders && sectionHeaders.length > 0) {
                    // Enhance the first section header found
                    enhancement.changes.push({
                        type: 'replace',
                        search: sectionHeaders[0],
                        replacement: sectionHeaders[0].replace(/<h2>([^<]+)<\/h2>/, '<h2><span class="section-title-icon">✦</span> $1</h2>')
                    });
                    
                    // Add CSS for the icon in a style tag
                    if (!fileContent.includes('<style>')) {
                        enhancement.changes.push({
                            type: 'add',
                            position: fileContent.indexOf('</head>'),
                            content: `
    <!-- Auto-enhanced: Added subtle section title icon styling -->
    <style>
        .section-title-icon {
            display: inline-block;
            color: var(--gold);
            margin-right: 8px;
            transform: scale(0.8);
        }
    </style>`
                        });
                    }
                }
            }
            break;
            
        case 'Improve mobile responsiveness':
            // Ensure proper viewport meta tag
            if (!fileContent.includes('viewport')) {
                enhancement.changes.push({
                    type: 'add',
                    position: fileContent.indexOf('</head>'),
                    content: '\n    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">'
                });
            } else if (!fileContent.includes('maximum-scale')) {
                enhancement.changes.push({
                    type: 'replace',
                    search: /<meta name="viewport" content="[^"]+"/,
                    replacement: '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0"'
                });
            }
            break;
            
        case 'Add subtle animations':
            // Add subtle animation class to section headers
            if (!fileContent.includes('data-aos')) {
                enhancement.changes.push({
                    type: 'replace',
                    search: /<div class="section-header">/g,
                    replacement: '<div class="section-header" data-aos="fade-up" data-aos-duration="800">'
                });
                
                // Add AOS library if not present
                if (!fileContent.includes('aos.js')) {
                    enhancement.changes.push({
                        type: 'add',
                        position: fileContent.indexOf('</head>'),
                        content: `
    <!-- Auto-enhanced: Added AOS library for subtle scroll animations -->
    <link rel="stylesheet" href="https://unpkg.com/aos@next/dist/aos.css" />`
                    });
                    
                    enhancement.changes.push({
                        type: 'add',
                        position: fileContent.indexOf('</body>'),
                        content: `
    <script src="https://unpkg.com/aos@next/dist/aos.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            AOS.init();
        });
    </script>`
                    });
                }
            }
            break;
    }
    
    // Apply business requirements regardless of enhancement type
    const complianceChanges = ensureComplianceWithBusinessRequirements(fileContent, '.html');
    enhancement.changes = enhancement.changes.concat(complianceChanges);
    
    return enhancement;
}

// Generate CSS enhancement
function generateCssEnhancement(fileContent, improvementType, enhancement) {
    console.log(`Generating CSS enhancement: ${improvementType}`);
    
    // For business requirement compliance, use a dedicated function
    if (improvementType === 'Ensure showcase-only compliance') {
        const complianceChanges = ensureComplianceWithBusinessRequirements(fileContent, '.css');
        enhancement.changes = enhancement.changes.concat(complianceChanges);
        return enhancement;
    }
    
    // Existing enhancement logic
    switch (improvementType) {
        case 'Add subtle animations':
            if (!fileContent.includes('@keyframes hover-glow')) {
                enhancement.changes.push({
                    type: 'add',
                    position: fileContent.lastIndexOf('}') + 1,
                    content: `\n\n/* Auto-enhanced: Added subtle hover glow effect */
@keyframes hover-glow {
    0% { box-shadow: 0 0 5px rgba(212, 175, 55, 0.2); }
    50% { box-shadow: 0 0 12px rgba(212, 175, 55, 0.5); }
    100% { box-shadow: 0 0 5px rgba(212, 175, 55, 0.2); }
}

.collection-item:hover, .service-item:hover {
    animation: hover-glow 2s infinite;
}\n`
                });
            }
            break;
        
        case 'Improve mobile responsiveness':
            if (!fileContent.includes('@media (max-width: 375px)')) {
                enhancement.changes.push({
                    type: 'add',
                    position: fileContent.lastIndexOf('}') + 1,
                    content: `\n\n/* Auto-enhanced: Added extra mobile optimization for small screens */
@media (max-width: 375px) {
    .section-header h2 {
        font-size: 1.4rem;
    }
    
    .hero h1 {
        font-size: 1.8rem;
    }
    
    .gallery-item {
        width: 180px;
        height: 180px;
    }
}\n`
                });
            }
            break;
            
        case 'Enhance visual appeal':
            if (!fileContent.includes('text-shadow')) {
                enhancement.changes.push({
                    type: 'add',
                    position: fileContent.indexOf('.section-header h2 {') + '.section-header h2 {'.length,
                    content: `
    text-shadow: 1px 1px 3px rgba(0,0,0,0.1);`
                });
            }
            break;
            
        case 'Add accessibility features':
            if (!fileContent.includes(':focus')) {
                enhancement.changes.push({
                    type: 'add',
                    position: fileContent.lastIndexOf('}') + 1,
                    content: `\n\n/* Auto-enhanced: Added focus styles for accessibility */
a:focus, button:focus {
    outline: 2px solid var(--gold);
    outline-offset: 2px;
}

.btn:focus {
    box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.5);
    outline: none;
}\n`
                });
            }
            break;
            
        case 'Optimize performance':
            if (!fileContent.includes('will-change')) {
                enhancement.changes.push({
                    type: 'add',
                    position: fileContent.indexOf('.collection-item {') + '.collection-item {'.length,
                    content: `
    will-change: transform;`
                });
            }
            break;
    }
    
    // Apply business requirements regardless of enhancement type
    const complianceChanges = ensureComplianceWithBusinessRequirements(fileContent, '.css');
    enhancement.changes = enhancement.changes.concat(complianceChanges);
    
    return enhancement;
}

// Generate JS enhancement
function generateJsEnhancement(fileContent, improvementType, enhancement) {
    console.log(`Generating JS enhancement: ${improvementType}`);
    
    // For business requirement compliance, use a dedicated function
    if (improvementType === 'Ensure showcase-only compliance') {
        const complianceChanges = ensureComplianceWithBusinessRequirements(fileContent, '.js');
        enhancement.changes = enhancement.changes.concat(complianceChanges);
        return enhancement;
    }
    
    // Existing enhancement logic
    switch (improvementType) {
        case 'Add subtle animations':
            if (!fileContent.includes('scrollOffset')) {
                enhancement.changes.push({
                    type: 'add',
                    position: fileContent.lastIndexOf('});') + 3,
                    content: `\n\n// Auto-enhanced: Added parallax scrolling effect
document.addEventListener('DOMContentLoaded', function() {
    window.addEventListener('scroll', function() {
        const scrollOffset = window.scrollY;
        const parallaxElements = document.querySelectorAll('.section-header');
        
        parallaxElements.forEach(element => {
            const speed = 0.05;
            element.style.transform = \`translateY(\${scrollOffset * speed}px)\`;
        });
    });
});\n`
                });
            }
            break;
            
        case 'Improve mobile responsiveness':
            if (!fileContent.includes('resizeObserver')) {
                enhancement.changes.push({
                    type: 'add',
                    position: fileContent.lastIndexOf('});') + 3,
                    content: `\n\n// Auto-enhanced: Added resize observer for better responsiveness
document.addEventListener('DOMContentLoaded', function() {
    if (window.ResizeObserver) {
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                if (entry.contentBoxSize) {
                    // Handle layout shifts more efficiently
                    if (window.innerWidth <= 768 && document.body.classList.contains('desktop-layout')) {
                        document.body.classList.remove('desktop-layout');
                        document.body.classList.add('mobile-layout');
                    } else if (window.innerWidth > 768 && document.body.classList.contains('mobile-layout')) {
                        document.body.classList.remove('mobile-layout');
                        document.body.classList.add('desktop-layout');
                    }
                }
            }
        });
        
        // Initialize class
        if (window.innerWidth <= 768) {
            document.body.classList.add('mobile-layout');
        } else {
            document.body.classList.add('desktop-layout');
        }
        
        resizeObserver.observe(document.body);
    }
});\n`
                });
            }
            break;
            
        case 'Optimize performance':
            if (!fileContent.includes('requestAnimationFrame')) {
                enhancement.changes.push({
                    type: 'add',
                    position: fileContent.lastIndexOf('});') + 3,
                    content: `\n\n// Auto-enhanced: Optimized scroll handler with requestAnimationFrame
document.addEventListener('DOMContentLoaded', function() {
    let ticking = false;
    let lastScrollY = 0;
    
    function onScroll() {
        lastScrollY = window.scrollY;
        
        if (!ticking) {
            requestAnimationFrame(() => {
                // Process scroll events at most once per animation frame
                if (lastScrollY > 100) {
                    document.querySelector('header').classList.add('scrolled');
                } else {
                    document.querySelector('header').classList.remove('scrolled');
                }
                ticking = false;
            });
            
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', onScroll, { passive: true });
});\n`
                });
            }
            break;
            
        case 'Add accessibility features':
            if (!fileContent.includes('aria-')) {
                enhancement.changes.push({
                    type: 'add',
                    position: fileContent.lastIndexOf('});') + 3,
                    content: `\n\n// Auto-enhanced: Added accessibility improvements
document.addEventListener('DOMContentLoaded', function() {
    // Add appropriate ARIA attributes to interactive elements
    const menuToggle = document.querySelector('.mobile-nav-toggle');
    if (menuToggle) {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Toggle navigation menu');
        
        menuToggle.addEventListener('click', function() {
            const expanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !expanded);
        });
    }
    
    // Add keyboard navigation for gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.setAttribute('tabindex', '0');
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                this.querySelector('img').click();
            }
        });
    });
});\n`
                });
            }
            break;
            
        case 'Enhance visual appeal':
            if (!fileContent.includes('color-theme')) {
                enhancement.changes.push({
                    type: 'add',
                    position: fileContent.lastIndexOf('});') + 3,
                    content: `\n\n// Auto-enhanced: Added theme color preference detection
document.addEventListener('DOMContentLoaded', function() {
    // Check if user prefers dark mode
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('prefer-dark');
    } else {
        document.body.classList.add('prefer-light');
    }
    
    // Listen for changes in color scheme preference
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (e.matches) {
            document.body.classList.remove('prefer-light');
            document.body.classList.add('prefer-dark');
        } else {
            document.body.classList.remove('prefer-dark');
            document.body.classList.add('prefer-light');
        }
    });
});\n`
                });
            }
            break;
    }
    
    // Apply business requirements regardless of enhancement type
    const complianceChanges = ensureComplianceWithBusinessRequirements(fileContent, '.js');
    enhancement.changes = enhancement.changes.concat(complianceChanges);
    
    return enhancement;
}

// Apply enhancement to file
function applyEnhancement(enhancement) {
    console.log(`Applying enhancement to ${enhancement.file}: ${enhancement.type}`);
    
    try {
        let fileContent = fs.readFileSync(enhancement.file, 'utf8');
        let appliedChanges = [];
        
        // Apply changes in reverse order (bottom to top) to avoid position shifts
        const orderedChanges = [...enhancement.changes].sort((a, b) => {
            if (a.position !== undefined && b.position !== undefined) {
                return b.position - a.position; // Apply from bottom to top
            }
            return 0;
        });
        
        for (const change of orderedChanges) {
            if (change.type === 'add' && change.position !== undefined) {
                fileContent = fileContent.slice(0, change.position) + change.content + fileContent.slice(change.position);
                appliedChanges.push(`Added content at position ${change.position}`);
            } else if (change.type === 'replace' && change.search) {
                if (typeof change.search === 'string') {
                    if (fileContent.includes(change.search)) {
                        fileContent = fileContent.replace(change.search, change.replacement);
                        appliedChanges.push(`Replaced "${change.search.substring(0, 30)}..."`);
                    }
                } else {
                    // Regular expression
                    fileContent = fileContent.replace(change.search, change.replacement);
                    appliedChanges.push(`Applied regex replacement`);
                }
            }
        }
        
        if (appliedChanges.length > 0) {
            fs.writeFileSync(enhancement.file, fileContent);
            console.log(`Successfully applied changes to ${enhancement.file}:`, appliedChanges);
            return true;
        } else {
            console.log(`No changes applied to ${enhancement.file}`);
            return false;
        }
    } catch (err) {
        console.error(`Error applying enhancement to ${enhancement.file}:`, err);
        return false;
    }
}

// Commit and push changes
async function commitAndPushChanges(enhancement) {
    try {
        console.log('Committing changes...');
        
        // Add file to git
        await executeCommand(`git add ${enhancement.file}`);
        
        // Commit with message
        const commitMessage = `${CONFIG.commitMessage}: ${enhancement.description}`;
        await executeCommand(`git commit -m "${commitMessage}"`);
        
        // Push to remote
        console.log('Pushing changes...');
        await executeCommand('git push origin main');
        
        console.log('Successfully committed and pushed changes.');
        return true;
    } catch (err) {
        console.error('Error committing and pushing changes:', err);
        return false;
    }
}

// Main enhancement process
async function runEnhancement() {
    console.log('Starting auto-enhancement process...');
    
    // Load enhancement log
    const log = loadEnhancementLog();
    const now = Date.now();
    
    // Check if it's too soon to run again
    if (now - log.lastRun < CONFIG.enhanceInterval) {
        const timeToNextRun = new Date(log.lastRun + CONFIG.enhanceInterval);
        console.log(`Too soon to run enhancement. Next run at: ${timeToNextRun.toLocaleString()}`);
        return false;
    }
    
    // Select target file
    const targetFile = selectTargetFile();
    
    // Select improvement type
    const improvementType = selectImprovementType();
    
    console.log(`Selected file for enhancement: ${targetFile}`);
    console.log(`Selected improvement type: ${improvementType}`);
    
    // Generate enhancement
    const enhancement = generateEnhancement(targetFile, improvementType);
    
    if (enhancement.changes.length === 0) {
        console.log('No valid enhancements generated. Trying again next time.');
        return false;
    }
    
    // Apply enhancement
    const applied = applyEnhancement(enhancement);
    
    if (!applied) {
        console.log('Failed to apply enhancement. Trying again next time.');
        return false;
    }
    
    // Commit and push changes
    const pushed = await commitAndPushChanges(enhancement);
    
    if (!pushed) {
        console.log('Failed to commit and push changes. Trying again next time.');
        return false;
    }
    
    // Update enhancement log
    log.lastRun = now;
    log.enhancements.push({
        timestamp: now,
        file: enhancement.file,
        type: enhancement.type,
        description: enhancement.description
    });
    
    // Save updated log
    saveEnhancementLog(log);
    
    console.log('Enhancement process completed successfully!');
    return true;
}

// Start enhancement process
async function startEnhancement() {
    try {
        await runEnhancement();
    } catch (err) {
        console.error('Error during enhancement process:', err);
    }
    
    // Schedule next run
    const nextRunMs = CONFIG.enhanceInterval;
    const nextRunHours = nextRunMs / (1000 * 60 * 60);
    
    console.log(`Scheduling next enhancement in ${nextRunHours} hours...`);
    setTimeout(startEnhancement, nextRunMs);
}

// Command line interface
function startCLI() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    console.log('=====================================');
    console.log('B.BharatKumar Website Auto-Enhancer');
    console.log('=====================================');
    console.log('');
    console.log('This tool will automatically enhance your website using AI-driven improvements.');
    console.log(`Enhancement interval: ${CONFIG.enhanceInterval / (1000 * 60 * 60)} hours`);
    console.log('');
    console.log('Commands:');
    console.log('  run - Run enhancement process immediately');
    console.log('  log - View enhancement history');
    console.log('  exit - Exit the program');
    console.log('');
    
    function promptCommand() {
        rl.question('> ', async (answer) => {
            if (answer === 'run') {
                console.log('Running enhancement process...');
                await runEnhancement();
                promptCommand();
            } else if (answer === 'log') {
                const log = loadEnhancementLog();
                console.log('Enhancement History:');
                if (log.enhancements.length === 0) {
                    console.log('No enhancements recorded yet.');
                } else {
                    log.enhancements.forEach((enhancement, i) => {
                        const date = new Date(enhancement.timestamp).toLocaleString();
                        console.log(`${i + 1}. [${date}] ${enhancement.description} (${enhancement.type})`);
                    });
                }
                promptCommand();
            } else if (answer === 'exit') {
                console.log('Exiting...');
                rl.close();
                process.exit(0);
            } else {
                console.log('Unknown command. Available commands: run, log, exit');
                promptCommand();
            }
        });
    }
    
    // Start CLI
    promptCommand();
    
    // Start automated enhancement process
    startEnhancement();
}

// Start the application
startCLI(); 