#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Install esbuild if needed
if ! command -v npx &> /dev/null || ! npx esbuild --version &> /dev/null; then
    echo "Installing esbuild..."
    npm install esbuild --save-dev
fi

# Build TypeScript to JavaScript
echo "Building cheerleader hooks..."
npx esbuild src/cheerleader.ts \
    --bundle \
    --platform=node \
    --target=node18 \
    --format=esm \
    --outfile=dist/cheerleader.mjs

echo "✓ Build complete: dist/cheerleader.mjs"

# Make shell scripts executable
chmod +x *.sh

echo "✓ Shell scripts made executable"
