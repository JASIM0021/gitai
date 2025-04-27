# Install script for Windows (PowerShell)

$ErrorActionPreference = "Stop"

$repoUrl = "https://yourdomain.com/gitai"  # 🔥 Replace this with your real URL
$binaryName = "gitai.exe"
$tempPath = "$env:TEMP\$binaryName"
$installPath = "$env:ProgramFiles\GitAI"

Write-Host "🔍 Detecting your system..."

if (-Not (Test-Path $installPath)) {
    Write-Host "📁 Creating install directory at $installPath"
    New-Item -ItemType Directory -Path $installPath | Out-Null
}

Write-Host "🌐 Downloading $binaryName..."
Invoke-WebRequest -Uri "$repoUrl/$binaryName" -OutFile $tempPath

Write-Host "🚀 Installing to $installPath..."
Move-Item -Force -Path $tempPath -Destination "$installPath\$binaryName"

# Adding to PATH (for current user)
$envPath = [System.Environment]::GetEnvironmentVariable("Path", [System.EnvironmentVariableTarget]::User)
if ($envPath -notlike "*$installPath*") {
    Write-Host "🛠️  Adding $installPath to PATH..."
    [System.Environment]::SetEnvironmentVariable("Path", "$envPath;$installPath", [System.EnvironmentVariableTarget]::User)
}

Write-Host "✅ Installation complete!"
Write-Host ""
Write-Host "👉 You can now run 'gitai' from any terminal (restart terminal if needed)."
