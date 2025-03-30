/**
 * B.BharatKumar Keep-Alive Script
 * 
 * This script keeps the auto-enhancer running and forces GitHub Pages to rebuild
 * periodically, ensuring your site remains active even when your computer is asleep.
 * 
 * Run in a cloud environment like AWS, Azure or a VPS server for 24/7 operation.
 * 
 * Usage: node keep-alive.js
 */

const { exec, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const CONFIG = {
    rebuildsPerDay: 8,           // Number of GitHub Pages rebuilds per day
    maxRebuilds: 5000,           // Stop after this many rebuilds (about 2 years with 8 rebuilds/day)
    rebuildFile: 'rebuild.txt',  // File to modify for forcing rebuilds
    rebuildInterval: null,       // Will be calculated based on rebuildsPerDay
    autoEnhancerScript: 'auto-enhance.js', // Path to auto-enhancer script
    autoEnhancerFrequency: 1,    // Run auto-enhancer once every N rebuilds
    logFile: 'keep-alive.log',   // Log file
    errorDetection: {
        enabled: true,
        checkInterval: 6 * 60 * 60 * 1000, // 6 hours between error checks
        lastCheck: 0,
        maxConsecutiveFailures: 3,
        consecutiveFailures: 0,
        selfHealing: true
    },
    installDependencies: true    // Auto-install required dependencies
};

// Calculate rebuild interval
CONFIG.rebuildInterval = Math.floor(24 * 60 * 60 * 1000 / CONFIG.rebuildsPerDay);

// Variable to track state
let currentRebuild = 0;
let autoEnhancerProcess = null;
let errorCheckInterval = null;
let checkInProgress = false;

// Function to log with timestamp
function log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage);
    
    // Write to log file
    fs.appendFileSync(CONFIG.logFile, logMessage + '\n');
}

// Function to execute shell commands
function executeCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                log(`Error executing command: ${error.message}`);
                return reject(error);
            }
            if (stderr) {
                log(`Command warning: ${stderr}`);
            }
            resolve(stdout);
        });
    });
}

// Install dependencies if needed
async function ensureDependenciesInstalled() {
    if (!CONFIG.installDependencies) return;
    
    log('Checking for required dependencies...');
    
    // Check for package.json
    if (!fs.existsSync('package.json')) {
        log('Creating package.json...');
        await executeCommand('npm init -y');
    }
    
    // Check for puppeteer
    try {
        require('puppeteer');
        log('Puppeteer is already installed.');
    } catch (err) {
        log('Installing puppeteer for UI validation...');
        try {
            await executeCommand('npm install puppeteer');
            log('Puppeteer installed successfully.');
        } catch (err) {
            log(`Failed to install puppeteer: ${err.message}`);
        }
    }
}

// Start the auto-enhancer script
function startAutoEnhancer() {
    // Check if auto-enhancer script exists
    if (!fs.existsSync(CONFIG.autoEnhancerScript)) {
        log(`Auto-enhancer script not found: ${CONFIG.autoEnhancerScript}`);
        return;
    }
    
    // Kill existing process if it exists
    if (autoEnhancerProcess) {
        try {
            autoEnhancerProcess.kill();
        } catch (err) {
            log(`Error killing existing auto-enhancer process: ${err.message}`);
        }
    }
    
    log('Starting auto-enhancer process...');
    
    // Start the auto-enhancer script
    autoEnhancerProcess = spawn('node', [CONFIG.autoEnhancerScript], {
        detached: true,
        stdio: 'ignore'
    });
    
    // Handle process events
    autoEnhancerProcess.on('error', (err) => {
        log(`Auto-enhancer process error: ${err.message}`);
    });
    
    autoEnhancerProcess.unref();
    log('Auto-enhancer process started');
}

// Run auto-enhancer with specific command
async function runAutoEnhancerWithCommand(command) {
    return new Promise((resolve, reject) => {
        log(`Running auto-enhancer with command: ${command}`);
        
        const child = spawn('node', [CONFIG.autoEnhancerScript, command], {
            stdio: ['ignore', 'pipe', 'pipe']
        });
        
        let stdout = '';
        let stderr = '';
        
        child.stdout.on('data', (data) => {
            const output = data.toString();
            stdout += output;
            log(`[auto-enhancer] ${output.trim()}`);
        });
        
        child.stderr.on('data', (data) => {
            const output = data.toString();
            stderr += output;
            log(`[auto-enhancer-error] ${output.trim()}`);
        });
        
        child.on('close', (code) => {
            if (code === 0) {
                log(`Auto-enhancer command '${command}' completed successfully`);
                resolve({ success: true, output: stdout });
            } else {
                log(`Auto-enhancer command '${command}' failed with code ${code}`);
                resolve({ success: false, output: stderr });
            }
        });
        
        child.on('error', (err) => {
            log(`Error executing auto-enhancer command: ${err.message}`);
            reject(err);
        });
    });
}

// Check for UI errors
async function checkForUIErrors() {
    if (checkInProgress) return;
    checkInProgress = true;
    
    try {
        log('Checking for UI errors...');
        
        // Try to require puppeteer
        let puppeteer;
        try {
            puppeteer = require('puppeteer');
        } catch (err) {
            log('Puppeteer not found. Installing...');
            await executeCommand('npm install puppeteer');
            puppeteer = require('puppeteer');
        }
        
        // Create screenshots directory if it doesn't exist
        const screenshotDir = './ui-validation';
        if (!fs.existsSync(screenshotDir)) {
            fs.mkdirSync(screenshotDir, { recursive: true });
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
                log(`Console error: ${msg.text()}`);
                errors.push({ type: 'console', message: msg.text() });
            }
        });
        
        // Collect all failed requests
        page.on('requestfailed', request => {
            const failureText = request.failure().errorText;
            const url = request.url();
            log(`Request failed: ${url} - ${failureText}`);
            errors.push({ type: 'request', url, message: failureText });
        });
        
        // Test different viewport sizes
        const viewports = [
            { width: 1920, height: 1080, name: 'desktop' },
            { width: 768, height: 1024, name: 'tablet' },
            { width: 375, height: 812, name: 'mobile' }
        ];
        
        for (const viewport of viewports) {
            log(`Testing viewport: ${viewport.name} (${viewport.width}x${viewport.height})`);
            
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
                path: `${screenshotDir}/screenshot-${viewport.name}-${timestamp}.png`,
                fullPage: true
            });
            
            // Check for visual errors
            const viewportErrors = await page.evaluate(() => {
                const uiErrors = [];
                
                // Check for elements that overflow the viewport
                const elements = document.querySelectorAll('*');
                for (const el of elements) {
                    const rect = el.getBoundingClientRect();
                    if (rect.width > window.innerWidth + 5) {
                        uiErrors.push({
                            type: 'overflow',
                            element: el.tagName,
                            details: `Element overflows viewport horizontally by ${rect.width - window.innerWidth}px`
                        });
                    }
                }
                
                // Check for broken images
                const images = document.querySelectorAll('img');
                for (const img of images) {
                    if (!img.complete || img.naturalHeight === 0) {
                        uiErrors.push({
                            type: 'image',
                            element: 'img',
                            details: `Broken image: ${img.src}`
                        });
                    }
                }
                
                return uiErrors;
            });
            
            // Add viewport errors to main errors array
            for (const error of viewportErrors) {
                errors.push({
                    ...error,
                    viewport: viewport.name
                });
            }
        }
        
        await browser.close();
        
        log(`UI check completed. Found ${errors.length} errors.`);
        
        // Update error detection state
        CONFIG.errorDetection.lastCheck = Date.now();
        
        if (errors.length > 0) {
            CONFIG.errorDetection.consecutiveFailures++;
            log(`Consecutive UI check failures: ${CONFIG.errorDetection.consecutiveFailures}`);
            
            // Handle errors
            if (CONFIG.errorDetection.selfHealing && 
                CONFIG.errorDetection.consecutiveFailures <= CONFIG.errorDetection.maxConsecutiveFailures) {
                
                log('Attempting to auto-fix UI errors...');
                
                // Run auto-enhancer with fix command
                await runAutoEnhancerWithCommand('run');
                
                // Force a rebuild after fixes
                await forceGitHubPagesRebuild(true);
            }
        } else {
            CONFIG.errorDetection.consecutiveFailures = 0;
            log('UI check passed with no errors!');
        }
        
        return errors.length === 0;
    } catch (err) {
        log(`Error checking for UI errors: ${err.message}`);
        return false;
    } finally {
        checkInProgress = false;
    }
}

// Schedule regular UI error checks
function startErrorDetection() {
    if (!CONFIG.errorDetection.enabled) {
        log('UI error detection is disabled');
        return;
    }
    
    log(`Starting UI error detection (interval: ${CONFIG.errorDetection.checkInterval / (60 * 60 * 1000)} hours)`);
    
    // Run initial check
    checkForUIErrors();
    
    // Set up interval for regular checks
    errorCheckInterval = setInterval(async () => {
        if (Date.now() - CONFIG.errorDetection.lastCheck >= CONFIG.errorDetection.checkInterval) {
            await checkForUIErrors();
        }
    }, 30 * 60 * 1000); // Check every 30 minutes if it's time for a full check
}

// Force a GitHub Pages rebuild by changing a file and pushing to GitHub
async function forceGitHubPagesRebuild(isErrorFix = false) {
    try {
        if (!isErrorFix) {
            currentRebuild++;
        }
        
        log(`Starting GitHub Pages rebuild (Push #${currentRebuild}${isErrorFix ? ' - Error fix' : ''})`);
        
        // Check if rebuild file exists, create if not
        if (!fs.existsSync(CONFIG.rebuildFile)) {
            fs.writeFileSync(CONFIG.rebuildFile, `Last rebuilt: ${new Date().toISOString()}`);
            log('Created rebuild file');
        }
        
        // Update the rebuild file
        const timestamp = new Date().toISOString();
        fs.writeFileSync(CONFIG.rebuildFile, `Last rebuilt: ${timestamp}`);
        log('Updated rebuild file');
        
        // Add file to git
        log('Adding file...');
        await executeCommand(`git add ${CONFIG.rebuildFile}`);
        
        // Commit with message
        log('Committing...');
        const commitMessage = isErrorFix 
            ? `Fix UI errors - ${new Date().toLocaleString()}`
            : `Force GitHub Pages rebuild - ${new Date().toLocaleString()}`;
            
        await executeCommand(`git commit -m "${commitMessage}"`);
        
        // Push to GitHub
        log('Pushing to GitHub...');
        const pushOutput = await executeCommand('git push origin main');
        log(pushOutput);
        
        // Run auto-enhancer if it's time and not an error fix
        if (!isErrorFix && currentRebuild % CONFIG.autoEnhancerFrequency === 0) {
            log('Time to run auto-enhancer');
            startAutoEnhancer();
        }
        
        // Wait 30 seconds before next push to avoid GitHub API rate limiting
        log('Waiting 30 seconds before next push...');
        setTimeout(scheduleNextRebuild, 30 * 1000);
    } catch (err) {
        log(`Error during GitHub Pages rebuild: ${err.message}`);
        setTimeout(scheduleNextRebuild, 5 * 60 * 1000); // Try again in 5 minutes
    }
}

// Schedule next rebuild
function scheduleNextRebuild() {
    if (currentRebuild >= CONFIG.maxRebuilds) {
        log(`Maximum number of rebuilds (${CONFIG.maxRebuilds}) reached. Stopping.`);
        return;
    }
    
    log(`Next push in ${Math.floor(CONFIG.rebuildInterval / 1000)} seconds...`);
    setTimeout(forceGitHubPagesRebuild, CONFIG.rebuildInterval);
}

// Start the process
async function startKeepAlive() {
    log('Starting B.BharatKumar Keep-Alive Script');
    log(`Rebuild interval: ${CONFIG.rebuildInterval / 1000} seconds (${CONFIG.rebuildsPerDay} rebuilds/day)`);
    log(`Auto-enhancer frequency: Every ${CONFIG.autoEnhancerFrequency} rebuild(s)`);
    
    // Install dependencies if needed
    await ensureDependenciesInstalled();
    
    // Start auto-enhancer initially
    startAutoEnhancer();
    
    // Start UI error detection
    startErrorDetection();
    
    // Start rebuild process
    forceGitHubPagesRebuild();
}

// Handle script termination
process.on('SIGINT', () => {
    log('Caught interrupt signal. Shutting down gracefully.');
    if (autoEnhancerProcess) {
        autoEnhancerProcess.kill();
    }
    if (errorCheckInterval) {
        clearInterval(errorCheckInterval);
    }
    process.exit(0);
});

process.on('SIGTERM', () => {
    log('Termination signal received. Shutting down gracefully.');
    if (autoEnhancerProcess) {
        autoEnhancerProcess.kill();
    }
    if (errorCheckInterval) {
        clearInterval(errorCheckInterval);
    }
    process.exit(0);
});

// Start the keep-alive process
startKeepAlive(); 