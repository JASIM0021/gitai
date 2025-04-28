#!/bin/bash
set -e

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "Visit https://nodejs.org/ to download and install Node.js"
    exit 1
fi

echo "✅ Node.js is installed"

# Install the package globally
echo "📦 Installing GitAI globally..."
npm install -g git-commit-cli-helper

echo "✅ GitAI installed successfully!"
echo ""
echo "👉 You can now run 'gitai' from anywhere!"
