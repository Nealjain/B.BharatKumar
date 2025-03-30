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
        { name: 'Enhance brand identity', weight: 5 },
        { name: 'Improve letter animations', weight: 5 },
        { name: 'Add futuristic features', weight: 4 },
        { name: 'Add subtle animations', weight: 2 },
        { name: 'Improve mobile responsiveness', weight: 3 },
        { name: 'Optimize performance', weight: 2 },
        { name: 'Enhance visual appeal', weight: 3 },
        { name: 'Add accessibility features', weight: 2 },
        { name: 'Ensure showcase-only compliance', weight: 4 },
        { name: 'Fix UI errors', weight: 5 }
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
    },
    // New error detection settings
    errorDetection: {
        enabled: true,
        runBeforeEnhancements: true, // First check for errors, then do enhancements
        screenshotPath: './ui-validation/',
        validationInterval: 4 * 60 * 60 * 1000, // 4 hours between validations
        retryOnError: true,
        maxRetries: 3,
        viewports: [
            { width: 1920, height: 1080, name: 'desktop' },
            { width: 768, height: 1024, name: 'tablet' },
            { width: 375, height: 812, name: 'mobile' }
        ]
    },
    // Self-healing settings
    selfHealing: {
        enabled: true,
        knownIssues: [
            { 
                pattern: /Error: (.*?)is not defined/i, 
                fix: 'script-variable-undefined'
            },
            {
                pattern: /Uncaught TypeError: Cannot read properties of (null|undefined)/i,
                fix: 'dom-null-reference'
            },
            {
                pattern: /404 Not Found: (.*?\.(?:js|css|png|jpg|svg))/i,
                fix: 'missing-resource'
            },
            {
                pattern: /@media query expression .* is invalid/i,
                fix: 'invalid-media-query'
            },
            {
                pattern: /Uncaught SyntaxError: (.*)/i,
                fix: 'syntax-error'
            }
        ]
    },
    updateTracking: {
        enabled: true,
        logFile: 'updates.txt',
        maintenanceMode: {
            enabled: true,
            thresholdUpdates: 5, // Number of updates that trigger maintenance mode
            maintenanceFile: 'maintenance.html',
            maintenanceTemplate: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>B.BharatKumar - Maintenance</title>
    <style>
        body {
            font-family: 'Montserrat', sans-serif;
            background-color: #121212;
            color: #fff;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            text-align: center;
        }
        .maintenance-container {
            max-width: 600px;
            padding: 40px;
            background-color: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        h1 {
            font-family: 'Cinzel', serif;
            color: #D4AF37;
            font-size: 2.5rem;
            margin-bottom: 20px;
        }
        p {
            font-size: 1.1rem;
            line-height: 1.6;
            margin-bottom: 30px;
            color: rgba(255, 255, 255, 0.8);
        }
        .gold-text {
            color: #D4AF37;
            font-weight: 500;
        }
        .timer {
            font-size: 1.2rem;
            margin-top: 30px;
            color: rgba(255, 255, 255, 0.7);
        }
        .logo {
            font-family: 'Cinzel', serif;
            font-size: 1.8rem;
            color: #D4AF37;
            margin-bottom: 30px;
        }
    </style>
</head>
<body>
    <div class="maintenance-container">
        <div class="logo">B.BharatKumar</div>
        <h1>We're Making Something Beautiful</h1>
        <p>Our website is currently undergoing enhancements to provide you with an even better experience. We'll be back shortly with a refreshed look.</p>
        <p>Thank you for your patience.</p>
        <p class="gold-text">Since 1950s</p>
        <div class="timer" id="countdown">Estimated time: <span id="time">5:00</span></div>
    </div>
    <script>
        // Countdown timer
        function startTimer(duration, display) {
            var timer = duration, minutes, seconds;
            setInterval(function () {
                minutes = parseInt(timer / 60, 10);
                seconds = parseInt(timer % 60, 10);
                
                minutes = minutes < 10 ? "0" + minutes : minutes;
                seconds = seconds < 10 ? "0" + seconds : seconds;
                
                display.textContent = minutes + ":" + seconds;
                
                if (--timer < 0) {
                    timer = 0;
                    window.location.reload();
                }
            }, 1000);
        }
        
        window.onload = function () {
            var fiveMinutes = 60 * 5,
                display = document.querySelector('#time');
            startTimer(fiveMinutes, display);
        };
    </script>
</body>
</html>`
        },
        autoPush: true
    },
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
        changes: [],
        scriptChanges: null
    };
    
    // Generate enhancements based on improvement type and file type
    if (improvementType === 'Enhance brand identity') {
        if (fileExtension === '.css') {
            enhancement = generateBrandIdentityEnhancement(fileContent, enhancement);
        }
    } else if (improvementType === 'Improve letter animations') {
        if (fileExtension === '.css') {
            enhancement = generateLetterAnimationEnhancement(fileContent, enhancement);
        }
    } else if (improvementType === 'Add futuristic features') {
        if (fileExtension === '.css') {
            enhancement = generateFuturisticFeaturesEnhancement(fileContent, enhancement);
        }
    } else {
        // Existing enhancement generation logic
        if (fileExtension === '.css') {
            enhancement = generateCssEnhancement(fileContent, improvementType, enhancement);
        } else if (fileExtension === '.js') {
            enhancement = generateJsEnhancement(fileContent, improvementType, enhancement);
        } else if (fileExtension === '.html') {
            enhancement = generateHtmlEnhancement(fileContent, improvementType, enhancement);
        }
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
        // First log the update
        logUpdate(enhancement);
        
        // Skip if auto-push is disabled
        if (!CONFIG.updateTracking.autoPush) {
            console.log('Auto-push is disabled. Skipping commit and push.');
            return true;
        }
        
        console.log('Starting git operations...');
        
        // Make sure we're on the main branch
        await executeCommand('git checkout main || git checkout master');
        
        // Pull latest changes to avoid conflicts
        console.log('Pulling latest changes...');
        await executeCommand('git pull --rebase');
        
        const commitMessage = `${CONFIG.commitMessage}: ${enhancement.description}`;
        
        // Add the changed file
        console.log(`Adding file: ${enhancement.file}`);
        await executeCommand(`git add "${enhancement.file}"`);
        
        // Add the updates log file
        if (fs.existsSync(CONFIG.updateTracking.logFile)) {
            console.log(`Adding update log: ${CONFIG.updateTracking.logFile}`);
            await executeCommand(`git add "${CONFIG.updateTracking.logFile}"`);
        }
        
        // Commit the changes
        console.log('Committing changes...');
        await executeCommand(`git commit -m "${commitMessage}"`);
        
        // Force push to ensure changes are applied
        console.log('Pushing changes to remote repository...');
        await executeCommand('git push --force-with-lease');
        
        // Create a force-rebuild.html file with current timestamp to trigger GitHub Pages rebuild
        const timestamp = new Date().toISOString();
        fs.writeFileSync('force-rebuild.html', `<!-- Force rebuild: ${timestamp} -->`);
        
        // Add and commit the force-rebuild file
        await executeCommand('git add force-rebuild.html');
        await executeCommand('git commit -m "Force rebuild GitHub Pages"');
        await executeCommand('git push --force-with-lease');
        
        console.log('Changes committed and pushed successfully. GitHub Pages rebuild triggered.');
        return true;
    } catch (err) {
        console.error('Error committing and pushing changes:', err);
        // Try again with different approach if the first attempt failed
        try {
            console.log('Trying alternative push approach...');
            await executeCommand('git add .');
            await executeCommand(`git commit -m "Auto-update: ${enhancement.description}"`);
            await executeCommand('git push');
            console.log('Alternative push completed successfully');
            return true;
        } catch (retryErr) {
            console.error('Error in alternative push approach:', retryErr);
            return false;
        }
    }
}

// Add new function for UI validation and error detection
async function validateUI() {
    if (!CONFIG.errorDetection.enabled) {
        console.log('UI validation is disabled');
        return { success: true, errors: [] };
    }
    
    try {
        console.log('Starting UI validation...');
        
        // Try to require puppeteer
        let puppeteer;
        try {
            puppeteer = require('puppeteer');
        } catch (err) {
            console.warn('Puppeteer not found. Installing puppeteer...');
            await executeCommand('npm install puppeteer');
            puppeteer = require('puppeteer');
        }
        
        // Create screenshot directory if it doesn't exist
        if (!fs.existsSync(CONFIG.errorDetection.screenshotPath)) {
            fs.mkdirSync(CONFIG.errorDetection.screenshotPath, { recursive: true });
        }
        
        // Launch headless browser
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        // Create a new page
        const page = await browser.newPage();
        
        // Configure console logging
        const errors = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                console.error(`Console error: ${msg.text()}`);
                errors.push({ type: 'console', message: msg.text() });
            }
        });
        
        // Collect all failed requests
        page.on('requestfailed', request => {
            const failureText = request.failure().errorText;
            const url = request.url();
            console.error(`Request failed: ${url} - ${failureText}`);
            errors.push({ type: 'request', url, message: failureText });
        });
        
        // Test each viewport (responsive design)
        for (const viewport of CONFIG.errorDetection.viewports) {
            console.log(`Testing viewport: ${viewport.name} (${viewport.width}x${viewport.height})`);
            
            // Set viewport
            await page.setViewport({
                width: viewport.width,
                height: viewport.height
            });
            
            // Navigate to the page (local file)
            const timestamp = new Date().toISOString().replace(/:/g, '-');
            const htmlPath = path.resolve('index.html');
            await page.goto(`file://${htmlPath}`);
            
            // Wait for page to be fully loaded
            await page.waitForTimeout(2000);
            
            // Take a screenshot
            await page.screenshot({ 
                path: `${CONFIG.errorDetection.screenshotPath}/screenshot-${viewport.name}-${timestamp}.png`,
                fullPage: true
            });
            
            // Run UI tests
            const viewportErrors = await page.evaluate(() => {
                const uiErrors = [];
                
                // Check for overlapping elements
                const elements = document.querySelectorAll('*');
                const visibleElements = [...elements].filter(el => {
                    const style = window.getComputedStyle(el);
                    return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
                });
                
                // Check for elements that overflow the viewport
                visibleElements.forEach(el => {
                    const rect = el.getBoundingClientRect();
                    if (rect.width > window.innerWidth + 5) {
                        uiErrors.push({
                            type: 'overflow',
                            element: el.tagName + (el.id ? `#${el.id}` : (el.className ? `.${el.className.replace(/\s+/g, '.')}` : '')),
                            message: `Element overflows viewport horizontally: width ${rect.width}px (viewport: ${window.innerWidth}px)`
                        });
                    }
                });
                
                // Check for font sizes too small to read
                visibleElements.forEach(el => {
                    const style = window.getComputedStyle(el);
                    const fontSize = parseFloat(style.fontSize);
                    if (fontSize < 10 && el.textContent.trim().length > 0) {
                        uiErrors.push({
                            type: 'font-size',
                            element: el.tagName + (el.id ? `#${el.id}` : (el.className ? `.${el.className.replace(/\s+/g, '.')}` : '')),
                            message: `Font size too small: ${fontSize}px`
                        });
                    }
                });
                
                // Check for color contrast issues
                visibleElements.forEach(el => {
                    if (el.textContent.trim().length === 0) return;
                    
                    const style = window.getComputedStyle(el);
                    const color = style.color.match(/\d+/g);
                    const backgroundColor = style.backgroundColor.match(/\d+/g);
                    
                    if (color && backgroundColor && backgroundColor.length >= 3) {
                        // Simple luminance calculation
                        const colorLum = (0.299 * color[0] + 0.587 * color[1] + 0.114 * color[2]) / 255;
                        const bgLum = (0.299 * backgroundColor[0] + 0.587 * backgroundColor[1] + 0.114 * backgroundColor[2]) / 255;
                        
                        const contrast = Math.abs(colorLum - bgLum);
                        
                        if (contrast < 0.3) {
                            uiErrors.push({
                                type: 'contrast',
                                element: el.tagName + (el.id ? `#${el.id}` : (el.className ? `.${el.className.replace(/\s+/g, '.')}` : '')),
                                message: `Poor text contrast detected (${contrast.toFixed(2)})`
                            });
                        }
                    }
                });
                
                // Check for missing images
                const images = document.querySelectorAll('img');
                images.forEach(img => {
                    if (!img.complete || img.naturalHeight === 0) {
                        uiErrors.push({
                            type: 'image',
                            element: img.tagName + (img.id ? `#${img.id}` : (img.className ? `.${img.className.replace(/\s+/g, '.')}` : '')),
                            message: `Image failed to load: ${img.src}`
                        });
                    }
                });
                
                return uiErrors;
            });
            
            // Add viewport-specific errors
            viewportErrors.forEach(error => {
                errors.push({
                    ...error,
                    viewport: viewport.name
                });
            });
        }
        
        await browser.close();
        
        console.log(`UI validation completed. Found ${errors.length} errors.`);
        if (errors.length > 0) {
            console.error('UI Errors:', JSON.stringify(errors, null, 2));
        }
        
        return {
            success: errors.length === 0,
            errors: errors
        };
    } catch (err) {
        console.error('Error during UI validation:', err);
        return {
            success: false,
            errors: [{ type: 'system', message: err.message }]
        };
    }
}

// Enhanced function to fix UI errors
function generateErrorFix(errors) {
    const enhancement = {
        file: '',
        type: 'Fix UI errors',
        description: 'Fixed UI errors detected during validation',
        changes: []
    };
    
    // Group errors by file
    const errorsByFile = {};
    for (const error of errors) {
        // Determine which file is likely causing the error
        let targetFile = '';
        
        if (error.type === 'request' && error.url) {
            // Extract the filename from the URL
            const urlParts = error.url.split('/');
            const filename = urlParts[urlParts.length - 1];
            
            if (filename.endsWith('.css')) {
                targetFile = 'css/style.css';
            } else if (filename.endsWith('.js')) {
                targetFile = 'js/script.js';
            } else {
                targetFile = 'index.html';
            }
        } else if (error.type === 'console') {
            // Check error message to identify the file
            if (error.message.includes('.css') || error.message.includes('CSS')) {
                targetFile = 'css/style.css';
            } else if (error.message.includes('.js') || error.message.includes('script')) {
                targetFile = 'js/script.js';
            } else {
                targetFile = 'index.html';
            }
        } else {
            // For UI errors, default to HTML
            targetFile = 'index.html';
        }
        
        if (!errorsByFile[targetFile]) {
            errorsByFile[targetFile] = [];
        }
        
        errorsByFile[targetFile].push(error);
    }
    
    // Process errors for each file
    for (const [file, fileErrors] of Object.entries(errorsByFile)) {
        // Read file content
        let fileContent = readFile(file);
        if (!fileContent) continue;
        
        let changes = [];
        
        for (const error of fileErrors) {
            // Try to detect known issues
            for (const knownIssue of CONFIG.selfHealing.knownIssues) {
                const errorMessage = error.message || '';
                
                if (knownIssue.pattern.test(errorMessage)) {
                    console.log(`Found known issue: ${knownIssue.fix}`);
                    
                    switch (knownIssue.fix) {
                        case 'script-variable-undefined': {
                            // Extract the variable name
                            const match = errorMessage.match(/Error: (.*?) is not defined/i);
                            if (match && match[1]) {
                                const varName = match[1].trim();
                                changes.push({
                                    type: 'add',
                                    position: fileContent.indexOf('document.addEventListener'),
                                    content: `\n// Auto-fix: Define missing variable\nlet ${varName};\n\n`
                                });
                            }
                            break;
                        }
                        
                        case 'dom-null-reference': {
                            // Add null checks to DOM selectors
                            if (file.endsWith('.js')) {
                                // Enhance querySelector calls with null checks
                                changes.push({
                                    type: 'replace',
                                    search: /const (\w+) = document\.querySelector\(['"]([^'"]+)['"]\);/g,
                                    replacement: 'const $1 = document.querySelector(\'$2\');\nif ($1) {'
                                });
                                
                                // Close the if statements at the end of blocks
                                changes.push({
                                    type: 'replace',
                                    search: /(\w+)\.addEventListener\(['"](\w+)['"], function\((.*?)\) {([\s\S]*?)}\);/g,
                                    replacement: '$1.addEventListener(\'$2\', function($3) {$4});\n}'
                                });
                            }
                            break;
                        }
                        
                        case 'missing-resource': {
                            // Extract the missing resource path
                            const match = errorMessage.match(/404 Not Found: (.*?\.(?:js|css|png|jpg|svg))/i);
                            if (match && match[1]) {
                                const resource = match[1].trim();
                                const filename = resource.split('/').pop();
                                
                                if (filename.endsWith('.js')) {
                                    // Remove the script tag if it's a missing JS file
                                    changes.push({
                                        type: 'replace',
                                        search: new RegExp(`<script[^>]*?src=["']${filename}["'][^>]*?>.*?</script>`, 'i'),
                                        replacement: `<!-- Auto-removed missing script: ${filename} -->`
                                    });
                                } else if (filename.endsWith('.css')) {
                                    // Remove the link tag if it's a missing CSS file
                                    changes.push({
                                        type: 'replace',
                                        search: new RegExp(`<link[^>]*?href=["']${filename}["'][^>]*?>`, 'i'),
                                        replacement: `<!-- Auto-removed missing stylesheet: ${filename} -->`
                                    });
                                } else if (/\.(png|jpg|jpeg|gif|svg)$/i.test(filename)) {
                                    // Replace missing images with a placeholder
                                    changes.push({
                                        type: 'replace',
                                        search: new RegExp(`<img[^>]*?src=["'][^"']*${filename}["'][^>]*?>`, 'i'),
                                        replacement: `<img src="https://placehold.co/600x400/gold/white?text=Image" alt="Placeholder" loading="lazy">`
                                    });
                                }
                            }
                            break;
                        }
                        
                        case 'invalid-media-query': {
                            if (file.endsWith('.css')) {
                                // Fix invalid media queries
                                changes.push({
                                    type: 'replace',
                                    search: /@media[^{]+?{/g,
                                    replacement: (match) => {
                                        // Sanitize the media query
                                        return match.replace(/\s+and\s+and\s+/g, ' and ')
                                            .replace(/\(\s*max-width\s*:\s*\)/g, '(max-width: 768px)')
                                            .replace(/\(\s*min-width\s*:\s*\)/g, '(min-width: 768px)');
                                    }
                                });
                            }
                            break;
                        }
                        
                        case 'syntax-error': {
                            if (file.endsWith('.js')) {
                                // Check for common syntax errors like missing semicolons
                                changes.push({
                                    type: 'replace',
                                    search: /}\n\s*const/g,
                                    replacement: '};\n\nconst'
                                });
                                
                                changes.push({
                                    type: 'replace',
                                    search: /}\n\s*let/g,
                                    replacement: '};\n\nlet'
                                });
                                
                                changes.push({
                                    type: 'replace',
                                    search: /}\n\s*var/g,
                                    replacement: '};\n\nvar'
                                });
                            }
                            break;
                        }
                    }
                }
            }
            
            // Specific fixes based on error type
            if (error.type === 'overflow' && error.element) {
                if (file.endsWith('.css')) {
                    // Add max-width constraint to overflowing elements
                    const elementSelector = error.element
                        .replace(/\#/g, '\\#') // Escape # for CSS selectors
                        .replace(/\./g, '\\.'); // Escape . for CSS selectors
                    
                    if (fileContent.includes(elementSelector)) {
                        // Update existing selector
                        changes.push({
                            type: 'replace',
                            search: new RegExp(`${elementSelector}\\s*{[^}]*}`, 'g'),
                            replacement: (match) => {
                                if (match.includes('max-width')) {
                                    return match.replace(/max-width:[^;]+;/, 'max-width: 100%;');
                                } else {
                                    return match.replace('{', '{\n    max-width: 100%;');
                                }
                            }
                        });
                    } else {
                        // Add new selector
                        changes.push({
                            type: 'add',
                            position: fileContent.lastIndexOf('}') + 1,
                            content: `\n\n/* Auto-fix: Fix overflowing element */\n${error.element} {\n    max-width: 100%;\n    overflow-x: hidden;\n}\n`
                        });
                    }
                }
            } else if (error.type === 'font-size' && error.element) {
                if (file.endsWith('.css')) {
                    // Increase font size for better readability
                    const elementSelector = error.element
                        .replace(/\#/g, '\\#')
                        .replace(/\./g, '\\.');
                    
                    changes.push({
                        type: 'add',
                        position: fileContent.lastIndexOf('}') + 1,
                        content: `\n\n/* Auto-fix: Fix small font size */\n${error.element} {\n    font-size: 12px !important;\n}\n`
                    });
                }
            } else if (error.type === 'contrast') {
                if (file.endsWith('.css')) {
                    // Improve contrast for better readability
                    const elementSelector = error.element
                        .replace(/\#/g, '\\#')
                        .replace(/\./g, '\\.');
                    
                    changes.push({
                        type: 'add',
                        position: fileContent.lastIndexOf('}') + 1,
                        content: `\n\n/* Auto-fix: Improve text contrast */\n${error.element} {\n    color: var(--dark) !important;\n    text-shadow: 0 0 1px rgba(255,255,255,0.5);\n}\n`
                    });
                }
            } else if (error.type === 'image') {
                if (file.endsWith('.html')) {
                    // Fix broken images
                    const imgSrc = error.message.match(/Image failed to load: ([^\s]+)/);
                    if (imgSrc && imgSrc[1]) {
                        changes.push({
                            type: 'replace',
                            search: new RegExp(`<img[^>]*?src=["']${imgSrc[1]}["'][^>]*?>`, 'gi'),
                            replacement: `<img src="https://placehold.co/600x400/gold/white?text=Jewelry" alt="Jewelry placeholder" loading="lazy">`
                        });
                    }
                }
            }
        }
        
        // Add fixing changes to enhancement
        if (changes.length > 0) {
            enhancement.file = file;
            enhancement.changes = changes;
            break; // Only fix one file at a time
        }
    }
    
    if (enhancement.changes.length === 0) {
        enhancement.file = 'index.html';
        enhancement.changes.push({
            type: 'add',
            position: 0,
            content: '<!-- No auto-fixable errors found -->'
        });
    }
    
    return enhancement;
}

// Extend main enhancement process to include validation
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
    
    // Run UI validation first if enabled
    if (CONFIG.errorDetection.enabled && CONFIG.errorDetection.runBeforeEnhancements) {
        console.log('Running UI validation before enhancements...');
        const validationResult = await validateUI();
        
        if (!validationResult.success) {
            console.log(`Found ${validationResult.errors.length} UI errors. Fixing before enhancing...`);
            
            // Generate fixes for the errors
            const errorFix = generateErrorFix(validationResult.errors);
            
            if (errorFix.changes.length > 0) {
                // Apply the fixes
                const applied = applyEnhancement(errorFix);
                
                if (applied) {
                    // Commit and push the fixes
                    const pushed = await commitAndPushChanges({
                        ...errorFix,
                        description: `Fixed ${validationResult.errors.length} UI errors`
                    });
                    
                    if (pushed) {
                        // Update enhancement log
                        log.lastRun = now;
                        log.enhancements.push({
                            timestamp: now,
                            file: errorFix.file,
                            type: errorFix.type,
                            description: `Fixed ${validationResult.errors.length} UI errors`
                        });
                        
                        // Save updated log
                        saveEnhancementLog(log);
                        
                        console.log('UI error fixes applied successfully!');
                        return true;
                    }
                }
            }
        }
    }
    
    // Proceed with regular enhancements
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
    
    // Run validation after enhancement if enabled
    if (CONFIG.errorDetection.enabled && !CONFIG.errorDetection.runBeforeEnhancements) {
        console.log('Running UI validation after enhancements...');
        const validationResult = await validateUI();
        
        if (!validationResult.success) {
            console.log(`Found ${validationResult.errors.length} UI errors after enhancement. Will fix in next run.`);
        } else {
            console.log('UI validation passed after enhancement!');
        }
    }
    
    return true;
}

// Add new function to trigger GitHub Pages deployment
async function triggerGitHubPagesDeployment() {
    console.log('Triggering GitHub Pages deployment...');
    
    try {
        // Create a temporary file with current timestamp
        const timestamp = new Date().toISOString();
        fs.writeFileSync('github-pages-trigger.html', `<!-- GitHub Pages rebuild trigger: ${timestamp} -->`);
        
        // Add, commit and push the file
        await executeCommand('git add github-pages-trigger.html');
        await executeCommand('git commit -m "Trigger GitHub Pages rebuild"');
        await executeCommand('git push');
        
        // Remove the temporary file
        await executeCommand('git rm github-pages-trigger.html');
        await executeCommand('git commit -m "Remove rebuild trigger file"');
        await executeCommand('git push');
        
        console.log('GitHub Pages deployment triggered successfully!');
        console.log('Your website should be updated within 1-2 minutes.');
        return true;
    } catch (err) {
        console.error('Error triggering GitHub Pages deployment:', err);
        return false;
    }
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
    console.log('  deploy - Trigger GitHub Pages deployment immediately');
    console.log('  direct - Direct deployment to GitHub Pages (recommended)');
    console.log('  push - Force push all changes');
    console.log('  status - Check git status and deployment');
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
            } else if (answer === 'deploy') {
                console.log('Triggering GitHub Pages deployment...');
                await triggerGitHubPagesDeployment();
                promptCommand();
            } else if (answer === 'direct') {
                console.log('Starting direct deployment to GitHub Pages...');
                await directDeploy("Manual direct deployment");
                promptCommand();
            } else if (answer === 'push') {
                console.log('Force pushing all changes...');
                try {
                    await executeCommand('git add .');
                    await executeCommand('git commit -m "Manual: Force push all changes"');
                    await executeCommand('git push --force-with-lease');
                    console.log('All changes pushed successfully!');
                } catch (err) {
                    console.error('Error pushing changes:', err);
                }
                promptCommand();
            } else if (answer === 'status') {
                console.log('Checking git status...');
                try {
                    const status = await executeCommand('git status');
                    console.log(status);
                    
                    // Check if GitHub Pages is enabled
                    console.log('Checking deployment status...');
                    const branch = await executeCommand('git rev-parse --abbrev-ref HEAD');
                    console.log(`Current branch: ${branch.trim()}`);
                    console.log('Note: Ensure GitHub Pages is enabled in repository settings.');
                } catch (err) {
                    console.error('Error checking status:', err);
                }
                promptCommand();
            } else if (answer === 'exit') {
                console.log('Exiting...');
                rl.close();
                process.exit(0);
            } else {
                console.log('Unknown command. Available commands: run, log, deploy, direct, push, status, exit');
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

// Add these new functions after the existing generateEnhancement function

// Add this after the existing generateHtmlEnhancement function
function generateBrandIdentityEnhancement(fileContent, enhancement) {
    // Define brand colors
    const brandColors = {
        primary: '#D4AF37', // Gold
        secondary: '#121212', // Dark
        accent: '#8A6D3B', // Dark gold
        light: '#F8F4E3', // Light cream
        dark: '#0A0A0A' // Near black
    };

    // Add brand identity improvements
    enhancement.changes.push({
        type: 'add',
        location: 'after_match',
        search: ':root {',
        addition: `
    /* Brand Identity Colors */
    --brand-gold: ${brandColors.primary};
    --brand-gold-rgb: 212, 175, 55;
    --brand-dark: ${brandColors.secondary};
    --brand-dark-rgb: 18, 18, 18;
    --brand-accent: ${brandColors.accent};
    --brand-light: ${brandColors.light};
    --brand-near-black: ${brandColors.dark};
    --font-primary: 'Cormorant Garamond', serif;
    --font-secondary: 'Montserrat', sans-serif;
    --font-accent: 'Cinzel', serif;`
    });
    
    enhancement.description = 'Enhanced brand identity with consistent color variables and typography';
    
    return enhancement;
}

// Add this after the existing generateHtmlEnhancement function
function generateLetterAnimationEnhancement(fileContent, enhancement) {
    if (fileContent.includes('.brand-text') && fileContent.includes('.brand-tagline')) {
        // Improved letter-by-letter animation for brand text
        enhancement.changes.push({
            type: 'replace',
            search: /\.brand-text {[\s\S]+?}/,
            replacement: `.brand-text {
    font-family: var(--font-accent, 'Cinzel', serif);
    color: var(--brand-gold, #D4AF37);
    font-size: 3.5rem;
    letter-spacing: 2px;
    margin-bottom: 5px;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s ease;
}`
        });
        
        enhancement.changes.push({
            type: 'replace',
            search: /\.brand-tagline {[\s\S]+?}/,
            replacement: `.brand-tagline {
    font-family: var(--font-secondary, 'Montserrat', sans-serif);
    color: var(--brand-light, #F8F4E3);
    font-size: 1.2rem;
    letter-spacing: 3px;
    text-transform: uppercase;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s ease;
}`
        });
        
        // Add letter-by-letter animation
        enhancement.changes.push({
            type: 'add',
            location: 'after_match',
            search: '/* Mobile responsiveness */',
            addition: `
/* Letter Animation */
.animate-letters .letter {
    display: inline-block;
    opacity: 0;
    transform: translateY(10px);
    transition: opacity 0.3s ease, transform 0.3s ease;
}

.animate-letters.visible .letter {
    opacity: 1;
    transform: translateY(0);
}

.brand-text .letter {
    animation-name: letterFadeIn;
    animation-fill-mode: forwards;
    animation-duration: 0.4s;
    opacity: 0;
}

.brand-tagline .letter {
    animation-name: letterFadeIn;
    animation-fill-mode: forwards;
    animation-duration: 0.4s;
    opacity: 0;
}

@keyframes letterFadeIn {
    0% {
        opacity: 0;
        transform: translateY(10px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}`
        });
        
        // Add JavaScript code to split text into letters
        enhancement.scriptChanges = `
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
                html += \`<span class="letter" style="animation-delay: \${delay}s">\${text[i]}</span>\`;
            }
        }
        
        element.innerHTML = html;
        element.classList.add('animate-letters');
    });
}

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
}`;
        
        enhancement.description = 'Improved letter-by-letter animation for brand identity';
    }
    
    return enhancement;
}

// Add this after the existing generateHtmlEnhancement function
function generateFuturisticFeaturesEnhancement(fileContent, enhancement) {
    // Add futuristic features like parallax scrolling, 3D hover effects, etc.
    
    // Add JavaScript for parallax scrolling effect
    enhancement.scriptChanges = `
// Parallax scrolling effect
function initParallaxEffect() {
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        
        // Parallax for hero section
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.style.backgroundPositionY = \`\${scrolled * 0.5}px\`;
        }
        
        // Subtle parallax for collection items
        const collectionItems = document.querySelectorAll('.gallery-item img');
        collectionItems.forEach(item => {
            const parent = item.closest('.gallery-item');
            const rect = parent.getBoundingClientRect();
            const centerY = rect.top + rect.height / 2;
            const viewportCenter = window.innerHeight / 2;
            const distanceFromCenter = (centerY - viewportCenter) * 0.05;
            
            item.style.transform = \`translateY(\${distanceFromCenter}px) scale(1.1)\`;
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
    
    item.style.transform = \`perspective(1000px) rotateX(\${angleX}deg) rotateY(\${angleY}deg) scale3d(1.05, 1.05, 1.05)\`;
    item.style.transition = 'transform 0.1s ease';
    
    // Add shadow based on tilt
    const shadow = \`0 \${Math.abs(angleX) * 2}px \${Math.abs(angleY) * 2}px rgba(0,0,0,0.2)\`;
    item.style.boxShadow = shadow;
}

function resetHover3D() {
    this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    this.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease';
    this.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
}

// Initialize futuristic features
document.addEventListener('DOMContentLoaded', () => {
    initParallaxEffect();
    init3DHoverEffect();
});`;
    
    // Add CSS for futuristic effects
    enhancement.changes.push({
        type: 'add',
        location: 'after_match',
        search: '/* Mobile responsiveness */',
        addition: `
/* Futuristic Features */
.gallery-item {
    transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    perspective: 1000px;
    transform-style: preserve-3d;
    overflow: visible;
}

.gallery-item::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(var(--brand-gold-rgb), 0.2) 0%, rgba(var(--brand-dark-rgb), 0.1) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 1;
    border-radius: 10px;
}

.gallery-item:hover::before {
    opacity: 1;
}

.gallery-caption {
    transform: translateZ(30px);
    backface-visibility: hidden;
}

/* Add smooth scrolling to the whole page */
html {
    scroll-behavior: smooth;
}`
    });
    
    enhancement.description = 'Added futuristic features including parallax scrolling and 3D hover effects';
    
    return enhancement;
}

// Update applyEnhancement function to handle scriptChanges
function applyEnhancement(enhancement) {
    try {
        const filePath = enhancement.file;
        const fileContent = readFile(filePath);
        
        if (!fileContent) {
            console.error(`Could not read file: ${filePath}`);
            return false;
        }
        
        let updatedContent = fileContent;
        
        // Apply each change
        for (const change of enhancement.changes) {
            if (change.type === 'replace') {
                updatedContent = updatedContent.replace(change.search, change.replacement);
            } else if (change.type === 'add') {
                if (change.location === 'start') {
                    updatedContent = change.addition + updatedContent;
                } else if (change.location === 'end') {
                    updatedContent = updatedContent + change.addition;
                } else if (change.location === 'after_match') {
                    const matchIndex = updatedContent.indexOf(change.search);
                    if (matchIndex !== -1) {
                        const endOfMatchIndex = matchIndex + change.search.length;
                        updatedContent = updatedContent.substring(0, endOfMatchIndex) + change.addition + updatedContent.substring(endOfMatchIndex);
                    }
                } else if (change.location === 'before_match') {
                    const matchIndex = updatedContent.indexOf(change.search);
                    if (matchIndex !== -1) {
                        updatedContent = updatedContent.substring(0, matchIndex) + change.addition + updatedContent.substring(matchIndex);
                    }
                }
            }
        }
        
        // Handle script changes if they exist
        if (enhancement.scriptChanges && filePath.endsWith('.js')) {
            // Find a good place to insert the new script (before the last line that has a closing function or right before the last line)
            const lines = updatedContent.split('\n');
            let insertIndex = lines.length - 1;
            
            // Look for a good insertion point - before the last closing brace or event handler
            for (let i = lines.length - 1; i >= 0; i--) {
                if (lines[i].includes('DOMContentLoaded') || lines[i].includes('window.onload')) {
                    // Found an event handler, insert the script changes inside it, right after the opening brace
                    for (let j = i; j < lines.length; j++) {
                        if (lines[j].includes('{')) {
                            insertIndex = j + 1;
                            break;
                        }
                    }
                    break;
                }
            }
            
            // Insert the script changes
            lines.splice(insertIndex, 0, enhancement.scriptChanges);
            updatedContent = lines.join('\n');
        }
        
        // Write updated content back to file
        fs.writeFileSync(filePath, updatedContent, 'utf-8');
        
        console.log(`Applied enhancement to ${filePath}`);
        return true;
    } catch (err) {
        console.error(`Error applying enhancement to ${enhancement.file}:`, err);
        return false;
    }
}

// Add these functions for update tracking
function logUpdate(enhancement) {
    if (!CONFIG.updateTracking.enabled) return;
    
    try {
        // Create timestamp
        const timestamp = new Date().toISOString();
        
        // Format update message
        const updateMessage = `[${timestamp}] ${enhancement.description}\n` +
            `File: ${enhancement.file}\n` +
            `Type: ${enhancement.type}\n` +
            `Changes: ${enhancement.changes.length}\n` +
            `-----------------------------------------\n`;
        
        // Append to updates.txt
        fs.appendFileSync(CONFIG.updateTracking.logFile, updateMessage);
        console.log(`Logged update to ${CONFIG.updateTracking.logFile}`);
        
        // Check if we should enable maintenance mode
        checkMaintenanceMode();
    } catch (err) {
        console.error('Error logging update:', err);
    }
}

function checkMaintenanceMode() {
    if (!CONFIG.updateTracking.maintenanceMode.enabled) return;
    
    try {
        // Count recent updates (updates in last hour)
        let updateContent = '';
        if (fs.existsSync(CONFIG.updateTracking.logFile)) {
            updateContent = fs.readFileSync(CONFIG.updateTracking.logFile, 'utf-8');
        }
        
        // Get timestamp from one hour ago
        const oneHourAgo = new Date();
        oneHourAgo.setHours(oneHourAgo.getHours() - 1);
        
        // Count updates in the last hour
        const recentUpdates = updateContent.split('[')
            .filter(line => {
                if (!line.trim()) return false;
                try {
                    const timestamp = new Date(line.split(']')[0]);
                    return timestamp > oneHourAgo;
                } catch (e) {
                    return false;
                }
            }).length;
        
        console.log(`Recent updates in the last hour: ${recentUpdates}`);
        
        // Check if we should enable maintenance mode
        if (recentUpdates >= CONFIG.updateTracking.maintenanceMode.thresholdUpdates) {
            console.log('Enabling maintenance mode due to high number of updates');
            enableMaintenanceMode();
        } else if (isMaintenanceModeEnabled()) {
            // Check if we should disable maintenance mode
            console.log('Disabling maintenance mode as update frequency has decreased');
            disableMaintenanceMode();
        }
    } catch (err) {
        console.error('Error checking maintenance mode:', err);
    }
}

function isMaintenanceModeEnabled() {
    // Check if index.html is renamed to index.original.html
    return fs.existsSync('index.original.html');
}

function enableMaintenanceMode() {
    if (isMaintenanceModeEnabled()) return; // Already in maintenance mode
    
    try {
        // Backup original index.html
        fs.renameSync('index.html', 'index.original.html');
        
        // Create maintenance page
        fs.writeFileSync('index.html', CONFIG.updateTracking.maintenanceMode.maintenanceTemplate);
        
        console.log('Maintenance mode enabled');
    } catch (err) {
        console.error('Error enabling maintenance mode:', err);
    }
}

function disableMaintenanceMode() {
    if (!isMaintenanceModeEnabled()) return; // Not in maintenance mode
    
    try {
        // Delete maintenance page
        fs.unlinkSync('index.html');
        
        // Restore original index.html
        fs.renameSync('index.original.html', 'index.html');
        
        console.log('Maintenance mode disabled');
    } catch (err) {
        console.error('Error disabling maintenance mode:', err);
    }
}

// Add function to directly deploy changes to GitHub Pages
async function directDeploy(message = "Direct deployment from auto-enhancer") {
    console.log('Starting direct deployment to GitHub Pages...');
    
    try {
        // Get GitHub Pages branch (gh-pages or main/master)
        const currentBranch = (await executeCommand('git rev-parse --abbrev-ref HEAD')).trim();
        console.log(`Current branch: ${currentBranch}`);
        
        // Add all files to staging
        await executeCommand('git add .');
        
        // Commit all changes
        await executeCommand(`git commit -m "Deploy: ${message}"`);
        
        // Push to GitHub with force option to ensure update
        await executeCommand('git push --force origin HEAD');
        
        // Create a CNAME file if it doesn't exist (helps with custom domains)
        if (!fs.existsSync('CNAME')) {
            // Only create if there's likely a custom domain
            const hasCustomDomain = fs.existsSync('_config.yml') || 
                                     fs.existsSync('.nojekyll');
            
            if (hasCustomDomain) {
                // Try to determine domain name from config or leave empty for manual setting
                fs.writeFileSync('CNAME', '');
                
                await executeCommand('git add CNAME');
                await executeCommand('git commit -m "Add CNAME file for custom domain"');
                await executeCommand('git push origin HEAD');
            }
        }
        
        // Create or update .nojekyll file to disable Jekyll processing
        fs.writeFileSync('.nojekyll', '');
        await executeCommand('git add .nojekyll');
        await executeCommand('git commit -m "Add .nojekyll file to disable Jekyll processing"');
        await executeCommand('git push origin HEAD');
        
        console.log('\nWebsite changes have been deployed successfully!');
        console.log('Your website will be available at:');
        console.log('  https://[username].github.io/B.BharatKumar/');
        console.log('\nIf you\'ve configured a custom domain in GitHub Pages settings,');
        console.log('your website will be available at your custom domain.');
        console.log('\nNOTE: It may take a few minutes for changes to be visible.');
        
        return true;
    } catch (err) {
        console.error('Error during direct deployment:', err);
        
        // Attempt recovery
        try {
            console.log('Attempting recovery...');
            await executeCommand('git add .');
            await executeCommand('git commit -m "Recovery commit"');
            await executeCommand('git push origin HEAD');
        } catch (recoveryErr) {
            console.error('Recovery attempt failed:', recoveryErr);
        }
        
        return false;
    }
}
 