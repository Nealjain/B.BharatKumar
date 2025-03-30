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

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
    rebuildsPerDay: 8,           // Number of GitHub Pages rebuilds per day
    maxRebuilds: 5000,           // Stop after this many rebuilds (about 2 years with 8 rebuilds/day)
    rebuildFile: 'rebuild.txt',  // File to modify for forcing rebuilds
    rebuildInterval: null,       // Will be calculated based on rebuildsPerDay
    autoEnhancerScript: 'auto-enhance.js', // Path to auto-enhancer script
    autoEnhancerFrequency: 1,    // Run auto-enhancer once every N rebuilds
    logFile: 'keep-alive.log'    // Log file
};

// Calculate rebuild interval
CONFIG.rebuildInterval = Math.floor(24 * 60 * 60 * 1000 / CONFIG.rebuildsPerDay);

// Variable to track state
let currentRebuild = 0;
let autoEnhancerProcess = null;

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
    const { spawn } = require('child_process');
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

// Force a GitHub Pages rebuild by changing a file and pushing to GitHub
async function forceGitHubPagesRebuild() {
    try {
        currentRebuild++;
        log(`Starting GitHub Pages rebuild (Push #${currentRebuild})`);
        
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
        const commitMessage = `Force GitHub Pages rebuild - ${new Date().toLocaleString()}`;
        await executeCommand(`git commit -m "${commitMessage}"`);
        
        // Push to GitHub
        log('Pushing to GitHub...');
        const pushOutput = await executeCommand('git push origin main');
        log(pushOutput);
        
        // Run auto-enhancer if it's time
        if (currentRebuild % CONFIG.autoEnhancerFrequency === 0) {
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
function startKeepAlive() {
    log('Starting B.BharatKumar Keep-Alive Script');
    log(`Rebuild interval: ${CONFIG.rebuildInterval / 1000} seconds (${CONFIG.rebuildsPerDay} rebuilds/day)`);
    log(`Auto-enhancer frequency: Every ${CONFIG.autoEnhancerFrequency} rebuild(s)`);
    
    // Start auto-enhancer initially
    startAutoEnhancer();
    
    // Start rebuild process
    forceGitHubPagesRebuild();
}

// Handle script termination
process.on('SIGINT', () => {
    log('Caught interrupt signal. Shutting down gracefully.');
    if (autoEnhancerProcess) {
        autoEnhancerProcess.kill();
    }
    process.exit(0);
});

process.on('SIGTERM', () => {
    log('Termination signal received. Shutting down gracefully.');
    if (autoEnhancerProcess) {
        autoEnhancerProcess.kill();
    }
    process.exit(0);
});

// Start the keep-alive process
startKeepAlive(); 