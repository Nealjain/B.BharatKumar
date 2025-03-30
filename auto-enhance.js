/**
 * B.BharatKumar Website Auto-Enhancement System
 * This script automatically enhances the website over time with AI-driven improvements
 */

// Configuration
const config = {
  enhancementInterval: 12 * 60 * 60 * 1000, // 12 hours in milliseconds
  commitMessagePrefix: '🤖 Auto-enhance:',
  targetFiles: [
    'css/style.css',
    'js/script.js',
    'index.html',
    'translate.js'
  ],
  improvementTypes: [
    'animation',
    'accessibility',
    'performance',
    'design',
    'seo',
    'responsiveness'
  ],
  logFile: 'enhancement-log.json',
  maxEnhancementsPerRun: 1
};

// Enhancement history
let enhancementLog = [];

// Utility function to execute shell commands
async function executeCommand(command) {
  try {
    console.log(`Executing: ${command}`);
    const { exec } = require('child_process');
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing command: ${error.message}`);
          return reject(error);
        }
        resolve(stdout.trim());
      });
    });
  } catch (error) {
    console.error(`Command execution failed: ${error.message}`);
    throw error;
  }
}

// Load enhancement log
async function loadEnhancementLog() {
  const fs = require('fs').promises;
  try {
    const data = await fs.readFile(config.logFile, 'utf8');
    enhancementLog = JSON.parse(data);
    console.log(`Loaded ${enhancementLog.length} previous enhancements`);
  } catch (error) {
    console.log('No existing enhancement log found, creating new one');
    enhancementLog = [];
  }
}

// Save enhancement log
async function saveEnhancementLog() {
  const fs = require('fs').promises;
  try {
    await fs.writeFile(config.logFile, JSON.stringify(enhancementLog, null, 2), 'utf8');
    console.log('Enhancement log saved');
  } catch (error) {
    console.error(`Failed to save enhancement log: ${error.message}`);
  }
}

// Select a file to enhance
function selectTargetFile() {
  // Prioritize files that haven't been enhanced recently
  const fileLastEnhanced = {};
  
  config.targetFiles.forEach(file => {
    const lastEnhancement = enhancementLog
      .filter(e => e.file === file)
      .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    
    fileLastEnhanced[file] = lastEnhancement ? new Date(lastEnhancement.date) : new Date(0);
  });
  
  // Sort files by last enhancement date (oldest first)
  const sortedFiles = config.targetFiles.sort((a, b) => 
    fileLastEnhanced[a] - fileLastEnhanced[b]
  );
  
  return sortedFiles[0]; // Return the file that was enhanced longest ago
}

// Select an improvement type
function selectImprovementType(file) {
  // Get file extension
  const extension = file.split('.').pop().toLowerCase();
  
  // Filter improvement types based on file type
  let applicableTypes = [];
  
  switch (extension) {
    case 'css':
      applicableTypes = ['animation', 'design', 'responsiveness', 'performance'];
      break;
    case 'js':
      applicableTypes = ['performance', 'animation', 'accessibility'];
      break;
    case 'html':
      applicableTypes = ['accessibility', 'seo', 'design'];
      break;
    default:
      applicableTypes = config.improvementTypes;
  }
  
  // Randomly select an improvement type
  const randomIndex = Math.floor(Math.random() * applicableTypes.length);
  return applicableTypes[randomIndex];
}

// Read file content
async function readFileContent(file) {
  const fs = require('fs').promises;
  try {
    return await fs.readFile(file, 'utf8');
  } catch (error) {
    console.error(`Failed to read file ${file}: ${error.message}`);
    throw error;
  }
}

// Generate enhancement based on file type and improvement type
async function generateEnhancement(file, content, improvementType) {
  // Extract file extension
  const extension = file.split('.').pop().toLowerCase();
  
  let enhancement = {
    description: '',
    newContent: content
  };
  
  switch (extension) {
    case 'css':
      enhancement = generateCSSEnhancement(content, improvementType);
      break;
    case 'js':
      enhancement = generateJSEnhancement(content, improvementType);
      break;
    case 'html':
      enhancement = generateHTMLEnhancement(content, improvementType);
      break;
    default:
      console.log(`File type not supported for automatic enhancement: ${extension}`);
      return null;
  }
  
  return enhancement;
}

// Generate CSS enhancements
function generateCSSEnhancement(content, improvementType) {
  let enhancement = {
    description: '',
    newContent: content
  };
  
  switch (improvementType) {
    case 'animation':
      // Add subtle animations to enhance user experience
      if (!content.includes('hover-shine')) {
        const newAnimation = `
/* ========== Shine Effect on Hover ========== */
.hover-shine {
  position: relative;
  overflow: hidden;
}

.hover-shine::before {
  content: '';
  position: absolute;
  top: 0;
  left: -75%;
  z-index: 2;
  display: block;
  width: 50%;
  height: 100%;
  background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 100%);
  transform: skewX(-25deg);
  transition: all 0.75s;
}

.hover-shine:hover::before {
  animation: shine 1.5s;
}

@keyframes shine {
  100% {
    left: 125%;
  }
}

/* Apply hover-shine to collection items */
.collection-item {
  position: relative;
  overflow: hidden;
}

.collection-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -75%;
  z-index: 2;
  display: block;
  width: 50%;
  height: 100%;
  background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 100%);
  transform: skewX(-25deg);
  opacity: 0;
  transition: all 0.75s;
}

.collection-item:hover::before {
  animation: shine 1.5s;
  opacity: 1;
}`;
        
        // Find the appropriate place to insert the new animation
        if (content.includes('/* Animations */')) {
          enhancement.newContent = content.replace('/* Animations */', '/* Animations */\n' + newAnimation);
        } else {
          // Append at the end if no suitable section is found
          enhancement.newContent = content + '\n' + newAnimation;
        }
        
        enhancement.description = 'Added elegant shine effect animation to collection items on hover';
      }
      break;
    
    case 'responsiveness':
      // Improve mobile responsiveness
      if (!content.includes('@media (max-width: 375px)')) {
        const newMedia = `
/* Extra small devices */
@media (max-width: 375px) {
  .logo a {
    font-size: 0.85rem;
  }
  
  .hero h1 {
    font-size: 1.8rem !important;
  }
  
  .hero p {
    font-size: 0.9rem !important;
  }
  
  .collection-grid {
    grid-template-columns: 1fr;
  }
  
  .section-header h2 {
    font-size: 1.4rem;
  }
  
  .gallery-item {
    width: 200px;
    height: 180px;
  }
  
  .gallery-caption h3 {
    font-size: 1.1rem;
  }
}`;
        
        // Find the appropriate place to insert the new media query
        if (content.includes('@media (max-width: 480px)')) {
          enhancement.newContent = content.replace('@media (max-width: 480px) {', newMedia + '\n\n@media (max-width: 480px) {');
        } else {
          // Append at the end if no suitable section is found
          enhancement.newContent = content + '\n' + newMedia;
        }
        
        enhancement.description = 'Added improved responsiveness for extra small devices (375px and below)';
      }
      break;
    
    case 'performance':
      // Optimize CSS performance
      if (!content.includes('will-change:')) {
        const optimizedContent = content
          .replace('.gallery-item:hover img {', '.gallery-item:hover img {\n  will-change: transform;')
          .replace('.collection-item:hover {', '.collection-item:hover {\n  will-change: transform;');
        
        enhancement.newContent = optimizedContent;
        enhancement.description = 'Added will-change property to optimize animations performance';
      }
      break;
    
    case 'design':
      // Enhance visual appeal
      if (!content.includes('text-shadow') && content.includes('.section-header h2')) {
        const enhancedHeader = content.replace(
          '.section-header h2 {', 
          '.section-header h2 {\n  text-shadow: 0 2px 4px rgba(var(--brand-gold-rgb), 0.1);'
        );
        
        enhancement.newContent = enhancedHeader;
        enhancement.description = 'Added subtle text shadow to section headers for enhanced visual depth';
      }
      break;
    
    default:
      console.log(`No CSS enhancement available for improvement type: ${improvementType}`);
      return { description: '', newContent: content };
  }
  
  return enhancement;
}

// Generate JS enhancements
function generateJSEnhancement(content, improvementType) {
  let enhancement = {
    description: '',
    newContent: content
  };
  
  switch (improvementType) {
    case 'animation':
      // Add scroll reveal animation if not already present
      if (!content.includes('scrollReveal') && !content.includes('AOS')) {
        const scrollRevealCode = `
// Scroll reveal animation
function initScrollReveal() {
  const scrollItems = document.querySelectorAll('.scroll-reveal');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15
  });
  
  scrollItems.forEach(item => {
    observer.observe(item);
  });
}

// Initialize scroll reveal
document.addEventListener('DOMContentLoaded', function() {
  // Check if we already have scroll-reveal elements
  const existingItems = document.querySelectorAll('.collection-item, .service-item, .contact-item');
  
  existingItems.forEach(item => {
    item.classList.add('scroll-reveal');
  });
  
  // Add necessary CSS if not already in the stylesheets
  if (!document.querySelector('style#scroll-reveal-styles')) {
    const style = document.createElement('style');
    style.id = 'scroll-reveal-styles';
    style.textContent = \`
      .scroll-reveal {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.8s ease, transform 0.8s ease;
      }
      
      .scroll-reveal.revealed {
        opacity: 1;
        transform: translateY(0);
      }
    \`;
    document.head.appendChild(style);
  }
  
  initScrollReveal();
});`;
        
        // Add the scroll reveal code at the end of the file
        enhancement.newContent = content + '\n' + scrollRevealCode;
        enhancement.description = 'Added scroll reveal animations to collection and service items';
      }
      break;
    
    case 'performance':
      // Optimize JavaScript performance
      if (!content.includes('requestAnimationFrame') && content.includes('scroll')) {
        // Optimize scroll event handling
        const optimizedScroll = content.replace(
          /window\.addEventListener\(['"]scroll['"], function/g,
          `window.addEventListener('scroll', function() {
  // Use requestAnimationFrame for better scroll performance
  requestAnimationFrame(function`
        ).replace(/}\);/g, `});
});`);
        
        enhancement.newContent = optimizedScroll;
        enhancement.description = 'Optimized scroll event handling with requestAnimationFrame for better performance';
      }
      break;
    
    case 'accessibility':
      // Improve accessibility
      if (!content.includes('aria-') && !content.includes('keyboard navigation')) {
        const accessibilityCode = `
// Improve keyboard navigation for gallery items
function enhanceKeyboardNavigation() {
  const focusableElements = document.querySelectorAll('.gallery-item, .collection-item, .btn, .category-btn');
  
  focusableElements.forEach(element => {
    // Make items focusable
    if (!element.hasAttribute('tabindex')) {
      element.setAttribute('tabindex', '0');
    }
    
    // Add keyboard event listeners for enter key
    element.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        element.click();
      }
    });
    
    // Add appropriate ARIA roles
    if (element.classList.contains('btn') || element.classList.contains('category-btn')) {
      element.setAttribute('role', 'button');
    } else if (element.classList.contains('gallery-item') || element.classList.contains('collection-item')) {
      element.setAttribute('role', 'article');
    }
  });
}

// Initialize accessibility enhancements
document.addEventListener('DOMContentLoaded', function() {
  enhanceKeyboardNavigation();
});`;
        
        // Add the accessibility code at the end of the file
        enhancement.newContent = content + '\n' + accessibilityCode;
        enhancement.description = 'Added keyboard navigation support and ARIA roles for better accessibility';
      }
      break;
    
    default:
      console.log(`No JS enhancement available for improvement type: ${improvementType}`);
      return { description: '', newContent: content };
  }
  
  return enhancement;
}

// Generate HTML enhancements
function generateHTMLEnhancement(content, improvementType) {
  let enhancement = {
    description: '',
    newContent: content
  };
  
  switch (improvementType) {
    case 'accessibility':
      // Add accessibility attributes
      let accessibleContent = content;
      
      // Add missing alt attributes to images
      accessibleContent = accessibleContent.replace(/<img\s+src="([^"]+)"([^>]*)>/g, (match, src, attrs) => {
        if (!attrs.includes('alt=')) {
          // Generate alt text from the filename
          const fileName = src.split('/').pop().split('.')[0];
          const altText = fileName.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          return `<img src="${src}" alt="${altText}" ${attrs}>`;
        }
        return match;
      });
      
      // Add aria-labels to links without text
      accessibleContent = accessibleContent.replace(/<a\s+([^>]*href="[^"]+")([^>]*)>\s*<i[^>]*><\/i>\s*<\/a>/g, (match, href, attrs) => {
        if (!attrs.includes('aria-label=')) {
          return match.replace('<a ', '<a aria-label="Social media link" ');
        }
        return match;
      });
      
      enhancement.newContent = accessibleContent;
      enhancement.description = 'Added accessibility attributes: alt text for images and aria-labels for icon links';
      break;
    
    case 'seo':
      // Improve SEO
      if (!content.includes('<meta name="description"') || !content.includes('<meta name="keywords"')) {
        let seoContent = content;
        const headEndPos = seoContent.indexOf('</head>');
        
        if (headEndPos !== -1) {
          const metaTags = `
    <meta name="description" content="B.BharatKumar - Exquisite jewelry shop in Mumbai offering fine gold, silver, and diamond jewelry with traditional craftsmanship since the 1950s.">
    <meta name="keywords" content="jewelry, gold jewelry, diamond jewelry, silver jewelry, Mumbai jewelry shop, wedding jewelry, traditional Indian jewelry, B.BharatKumar">
    <meta name="author" content="B.BharatKumar">
    <meta property="og:title" content="B.BharatKumar - Fine Jewelry">
    <meta property="og:description" content="Discover exquisite jewelry pieces crafted with traditional techniques and contemporary designs.">
    <meta property="og:type" content="website">
    <meta property="og:image" content="images/banner-bg.jpg">`;
          
          seoContent = seoContent.slice(0, headEndPos) + metaTags + seoContent.slice(headEndPos);
        }
        
        enhancement.newContent = seoContent;
        enhancement.description = 'Added SEO meta tags for better search engine visibility';
      }
      break;
    
    case 'design':
      // Enhance design elements
      if (!content.includes('back-to-top')) {
        let designContent = content;
        const bodyEndPos = designContent.lastIndexOf('</body>');
        
        if (bodyEndPos !== -1) {
          const backToTopButton = `
    <!-- Back to top button -->
    <a href="#" id="back-to-top" class="back-to-top" aria-label="Back to top">
        <i class="fas fa-chevron-up"></i>
    </a>
    <style>
        .back-to-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 45px;
            height: 45px;
            background-color: var(--gold);
            color: white;
            border-radius: 50%;
            opacity: 0;
            visibility: hidden;
            transform: translateY(20px);
            transition: all 0.3s ease;
            z-index: 99;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }
        
        .back-to-top.visible {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }
        
        .back-to-top:hover {
            background-color: var(--gold-dark);
            transform: translateY(-3px);
        }
        
        @media (max-width: 768px) {
            .back-to-top {
                width: 40px;
                height: 40px;
                bottom: 20px;
                right: 20px;
            }
        }
    </style>
    <script>
        // Back to top button functionality
        document.addEventListener('DOMContentLoaded', function() {
            const backToTopButton = document.getElementById('back-to-top');
            
            window.addEventListener('scroll', function() {
                if (window.pageYOffset > 300) {
                    backToTopButton.classList.add('visible');
                } else {
                    backToTopButton.classList.remove('visible');
                }
            });
            
            backToTopButton.addEventListener('click', function(e) {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        });
    </script>`;
          
          designContent = designContent.slice(0, bodyEndPos) + backToTopButton + designContent.slice(bodyEndPos);
        }
        
        enhancement.newContent = designContent;
        enhancement.description = 'Added elegant back-to-top button for better navigation on long pages';
      }
      break;
    
    default:
      console.log(`No HTML enhancement available for improvement type: ${improvementType}`);
      return { description: '', newContent: content };
  }
  
  return enhancement;
}

// Apply enhancement to file
async function applyEnhancement(file, enhancement) {
  if (!enhancement || enhancement.newContent === null) {
    console.log(`No enhancement to apply for ${file}`);
    return false;
  }
  
  const fs = require('fs').promises;
  try {
    await fs.writeFile(file, enhancement.newContent, 'utf8');
    console.log(`Enhancement applied to ${file}: ${enhancement.description}`);
    return true;
  } catch (error) {
    console.error(`Failed to apply enhancement to ${file}: ${error.message}`);
    return false;
  }
}

// Commit and push changes
async function commitAndPushChanges(enhancement) {
  try {
    console.log('Committing changes...');
    
    // Make sure we're on the main branch
    await executeCommand('git checkout main || git checkout master');
    
    // Pull latest changes to avoid conflicts
    await executeCommand('git pull --rebase');
    
    // Add the file to git
    await executeCommand(`git add "${enhancement.file}"`);
    
    // Commit with a descriptive message
    const commitMessage = `${config.commitMessagePrefix} ${enhancement.description}`;
    await executeCommand(`git commit -m "${commitMessage}"`);
    
    // Push changes
    await executeCommand('git push');
    
    console.log('Changes committed and pushed successfully');
    return true;
  } catch (error) {
    console.error(`Failed to commit and push changes: ${error.message}`);
    return false;
  }
}

// Run enhancement cycle
async function runEnhancementCycle() {
  try {
    console.log('Starting enhancement cycle...');
    
    // Load enhancement log
    await loadEnhancementLog();
    
    // Select a file to enhance
    const targetFile = selectTargetFile();
    console.log(`Selected target file: ${targetFile}`);
    
    // Select improvement type
    const improvementType = selectImprovementType(targetFile);
    console.log(`Selected improvement type: ${improvementType}`);
    
    // Read file content
    const content = await readFileContent(targetFile);
    
    // Generate enhancement
    const enhancement = await generateEnhancement(targetFile, content, improvementType);
    
    if (!enhancement || enhancement.newContent === content) {
      console.log(`No enhancement generated for ${targetFile}`);
      return;
    }
    
    // Apply enhancement
    const success = await applyEnhancement(targetFile, enhancement);
    
    if (success) {
      // Log enhancement
      const enhancementRecord = {
        date: new Date().toISOString(),
        file: targetFile,
        type: improvementType,
        description: enhancement.description
      };
      
      enhancementLog.push(enhancementRecord);
      await saveEnhancementLog();
      
      // Commit and push changes
      enhancement.file = targetFile;
      await commitAndPushChanges(enhancement);
      
      console.log('Enhancement cycle completed successfully');
    }
  } catch (error) {
    console.error(`Enhancement cycle failed: ${error.message}`);
  }
}

// Schedule enhancement cycles
function scheduleEnhancements() {
  console.log(`Scheduling enhancements every ${config.enhancementInterval / (60 * 60 * 1000)} hours`);
  
  // Run immediately and then on schedule
  runEnhancementCycle();
  
  // Schedule periodic runs
  setInterval(runEnhancementCycle, config.enhancementInterval);
}

// CLI commands
function processCLICommand() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  switch (command) {
    case 'run':
      console.log('Running enhancement cycle now...');
      runEnhancementCycle();
      break;
    
    case 'log':
      console.log('Loading enhancement log...');
      loadEnhancementLog().then(() => {
        console.log('Enhancement History:');
        console.log(JSON.stringify(enhancementLog, null, 2));
      });
      break;
    
    case 'start':
      console.log('Starting enhancement scheduler...');
      scheduleEnhancements();
      break;
    
    default:
      console.log('Usage:');
      console.log('  node auto-enhance.js run    - Run enhancement cycle once');
      console.log('  node auto-enhance.js log    - Show enhancement history');
      console.log('  node auto-enhance.js start  - Start enhancement scheduler');
  }
}

// Entry point - process command line arguments or start scheduler
if (require.main === module) {
  if (process.argv.length > 2) {
    processCLICommand();
  } else {
    scheduleEnhancements();
  }
}

module.exports = {
  runEnhancementCycle,
  loadEnhancementLog
};
 