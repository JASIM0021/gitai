#!/bin/bash
set -e

INSTALL_DIR="/usr/local/bin"
TARGET="$INSTALL_DIR/gitai"
DOWNLOAD_URL="https://raw.githubusercontent.com/JASIM0021/gitai/refs/heads/master/dist/gitai.js"

echo "🌐 Downloading GitAI..."
curl -fsSL "$DOWNLOAD_URL" -o "$TARGET"

echo "🛠️  Making it executable..."
chmod +x "$TARGET"

echo "✅ GitAI installed at $TARGET"
echo ""
echo "👉 You can now run 'gitai' from anywhere!"
