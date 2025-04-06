#!/bin/bash

# StuHouses UK English Deployment Script
echo "🇬🇧 Starting StuHouses UK English Deployment"

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Check for required tools
if ! command_exists node; then
  echo "❌ Node.js not found. Please install Node.js to continue."
  exit 1
fi

if ! command_exists npm; then
  echo "❌ npm not found. Please install npm to continue."
  exit 1
fi

# Install dependencies if needed
echo "📦 Installing dependencies..."
npm install

# Run UK English standardization
echo "🇬🇧 Standardizing to UK English..."
npm run uk-english

# Confirm changes
read -p "Do you want to commit the UK English changes? (y/n) " commit_changes
if [[ $commit_changes == "y" || $commit_changes == "Y" ]]; then
  if command_exists git; then
    git add .
    git commit -m "Standardize to UK English"
    echo "✅ Changes committed to Git"
  else
    echo "⚠️ Git not found. Changes were made but not committed."
  fi
fi

# Run the main deployment script
echo "🚀 Proceeding with deployment..."
./deploy.sh

echo "🎉 UK English deployment complete!"
echo "Your site is now live with UK English standardization!" 