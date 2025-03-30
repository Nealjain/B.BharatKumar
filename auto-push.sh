#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Auto-Push Script for B.BharatKumar${NC}"
echo "This script will automatically push to GitHub every 30 seconds to force rebuild."
echo -e "${RED}Press Ctrl+C to stop at any time${NC}\n"

counter=1

while true; do
    # Get current timestamp for commit message
    timestamp=$(date +"%Y-%m-%d %H:%M:%S")
    
    # Create a small change to force a commit
    echo "<!-- Auto-push timestamp: $timestamp -->" > force-rebuild.html
    
    # Add, commit and push
    echo -e "\n${YELLOW}Push #$counter - $timestamp${NC}"
    echo -e "${GREEN}Adding file...${NC}"
    git add force-rebuild.html
    
    echo -e "${GREEN}Committing...${NC}"
    git commit -m "Force GitHub Pages rebuild - $timestamp"
    
    echo -e "${GREEN}Pushing to GitHub...${NC}"
    git push origin main
    
    # Increment counter
    counter=$((counter+1))
    
    echo -e "\n${YELLOW}Waiting 30 seconds before next push...${NC}"
    for i in {30..1}; do
        echo -ne "\rNext push in ${GREEN}$i${NC} seconds..."
        sleep 1
    done
    echo -e "\rPreparing next push...                  "
done 