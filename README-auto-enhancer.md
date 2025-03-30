# B.BharatKumar Website Auto-Enhancer

This tool automatically enhances the B.BharatKumar jewelry shop website over time by making small, AI-driven improvements to the codebase.

## Features

- **Autonomous Enhancement**: Makes small improvements to your website without human intervention
- **Minimal Changes**: Each enhancement is carefully scoped to be small and non-disruptive
- **Smart Selection**: Uses weighted randomization to select files and enhancement types
- **Change Tracking**: Logs all enhancements for review
- **Automatic Git Integration**: Commits and pushes changes to GitHub
- **Business Requirement Compliance**: Ensures all changes comply with showcase-only requirements

## Business Requirements

The tool enforces the following business requirements:

1. **Showcase Only**: The website clearly states it is for displaying jewels only, not for selling
2. **No Prices**: All mentions of prices, discounts, sales, or offers are removed
3. **Business Focus**: Content emphasizes that the primary business is 92.5 silver, with a small portion of gold
4. **No Buy Options**: All "Buy" or "Order" buttons are disabled or removed
5. **No Misleading Information**: Ensures no misleading claims about selling products appear

## Enhancement Types

The tool can make the following types of improvements:

1. **Add Subtle Animations**: Small animations to improve user engagement
2. **Improve Mobile Responsiveness**: Better display on various screen sizes
3. **Optimize Performance**: Code optimizations for better loading and rendering
4. **Enhance Visual Appeal**: Small visual improvements
5. **Add Accessibility Features**: Make the site more accessible to all users
6. **Ensure Showcase-only Compliance**: Verify and enforce business requirements

## Setup

1. Ensure you have Node.js installed (v14.0.0 or later)
2. Install dependencies:
   ```
   npm install
   ```
3. Make sure you have git configured with proper credentials

## Usage

Start the auto-enhancer:

```
npm start
```

or

```
node auto-enhance.js
```

### Available Commands

Once running, you can use these commands:

- `run` - Run enhancement process immediately
- `log` - View enhancement history
- `exit` - Exit the program

## Running 24/7 (Even When Mac is Closed)

For continuous operation, use the keep-alive script on a cloud server:

1. Set up a Virtual Private Server (VPS) like DigitalOcean, AWS EC2, or Azure VM
2. Clone your repository to the server
3. Run the keep-alive script:
   ```
   node keep-alive.js
   ```

The keep-alive script:
- Keeps the auto-enhancer running
- Forces GitHub Pages to rebuild periodically
- Continues working even when your computer is off

## Configuration

You can adjust settings in the `CONFIG` object at the top of `auto-enhance.js`:

- `enhanceInterval`: Time between enhancements (default: 12 hours)
- `maxChangesPerRun`: Maximum number of changes per run (default: 1)
- `targetFiles`: Which files to enhance and their selection weight
- `improvementTypes`: Types of improvements and their selection weight
- `businessRequirements`: Compliance requirements for showcase-only website

## How It Works

1. The tool selects a file to enhance based on weighted probability
2. It chooses an enhancement type based on weighted probability
3. It analyzes the selected file for enhancement opportunities
4. It makes small, targeted changes to implement the enhancement
5. It commits and pushes the changes to GitHub
6. It logs the enhancement and waits for the next cycle

## Safety

The tool is designed to make minimal, non-breaking changes. Each enhancement is small and focused on a specific improvement. The enhancement history is logged so you can review all changes.

---

**Note**: This is an experimental tool. Always monitor the changes and keep backups of your website. 