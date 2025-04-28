# Install script for Windows (PowerShell)

$ErrorActionPreference = "Stop"

# Check if Node.js is installed
if (-Not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js is not installed. Please install Node.js first."
    Write-Host "Visit https://nodejs.org/ to download and install Node.js"
    exit 1
}

Write-Host "✅ Node.js is installed"

# Install the package globally
Write-Host "📦 Installing GitAI globally...."
npm install -g git-commit-cli-helper

Write-Host "✅ GitAI installed successfully!"
Write-Host ""
Write-Host "👉 You can now run 'gitai' from anywhere!"
