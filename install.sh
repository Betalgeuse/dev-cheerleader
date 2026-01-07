#!/bin/bash
# Install Dev Cheerleader globally to ~/.claude/
# 
# Usage: ./install.sh
#
# This script MERGES hooks into your existing ~/.claude/settings.json
# Your existing hooks are preserved, cheerleader hooks are added.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GLOBAL_DIR="$HOME/.claude"
HOOKS_DIR="$GLOBAL_DIR/hooks"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo ""
echo "┌─────────────────────────────────────────────────────────────┐"
echo "│  Dev Cheerleader - Installation                             │"
echo "└─────────────────────────────────────────────────────────────┘"
echo ""
echo "This will install to: $HOOKS_DIR"
echo ""
echo "What gets installed:"
echo "   • ~/.claude/hooks/cheerleader.mjs"
echo "   • ~/.claude/hooks/*-cheerleader.sh"
echo "   • Updates to ~/.claude/settings.json (backup created)"
echo ""

# Check for --yes flag to skip prompt
if [[ "${1:-}" != "--yes" && "${1:-}" != "-y" ]]; then
    read -p "Continue with installation? [y/N] " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Installation cancelled."
        exit 0
    fi
fi

echo ""
echo "Installing Dev Cheerleader..."
echo ""

# Create directories
mkdir -p "$HOOKS_DIR"
mkdir -p "$HOOKS_DIR/dist"

# Copy hook files
echo "Copying hooks..."
cp "$SCRIPT_DIR/.factory/hooks/dist/cheerleader.mjs" "$HOOKS_DIR/dist/"
cp "$SCRIPT_DIR/.factory/hooks/session-start-cheerleader.sh" "$HOOKS_DIR/"
cp "$SCRIPT_DIR/.factory/hooks/pre-compact-cheerleader.sh" "$HOOKS_DIR/"
cp "$SCRIPT_DIR/.factory/hooks/post-tool-cheerleader.sh" "$HOOKS_DIR/"

# Make scripts executable
chmod +x "$HOOKS_DIR/"*-cheerleader.sh

echo "✓ Hooks installed"

# Update settings.json
SETTINGS_FILE="$GLOBAL_DIR/settings.json"

if [ -f "$SETTINGS_FILE" ]; then
    echo "Backing up settings.json..."
    cp "$SETTINGS_FILE" "$SETTINGS_FILE.backup-$TIMESTAMP"
    echo "✓ Backup: $SETTINGS_FILE.backup-$TIMESTAMP"
fi

# Check if jq is available for JSON merging
if command -v jq &> /dev/null; then
    echo "Merging hooks into settings.json..."
    
    # Create base settings if not exists
    if [ ! -f "$SETTINGS_FILE" ]; then
        echo '{"hooks":{}}' > "$SETTINGS_FILE"
    fi
    
    # Merge cheerleader hooks
    jq '.hooks.SessionStart = ((.hooks.SessionStart // []) + [{
        "hooks": [{
            "type": "command",
            "command": "$HOME/.claude/hooks/session-start-cheerleader.sh"
        }]
    }]) | .hooks.PreCompact = ((.hooks.PreCompact // []) + [{
        "hooks": [{
            "type": "command",
            "command": "$HOME/.claude/hooks/pre-compact-cheerleader.sh"
        }]
    }]) | .hooks.PostToolUse = ((.hooks.PostToolUse // []) + [{
        "matcher": "Bash|Execute",
        "hooks": [{
            "type": "command",
            "command": "$HOME/.claude/hooks/post-tool-cheerleader.sh"
        }]
    }])' "$SETTINGS_FILE" > "$SETTINGS_FILE.tmp" && mv "$SETTINGS_FILE.tmp" "$SETTINGS_FILE"
    
    echo "✓ settings.json updated"
else
    echo ""
    echo "⚠️  jq not found. Please manually add hooks to $SETTINGS_FILE:"
    echo ""
    cat << 'EOF'
{
  "hooks": {
    "SessionStart": [{
      "matcher": "resume|compact|clear",
      "hooks": [{
        "type": "command",
        "command": "$HOME/.claude/hooks/session-start-cheerleader.sh"
      }]
    }],
    "PreCompact": [{
      "hooks": [{
        "type": "command",
        "command": "$HOME/.claude/hooks/pre-compact-cheerleader.sh"
      }]
    }],
    "PostToolUse": [{
      "matcher": "Bash|Execute",
      "hooks": [{
        "type": "command",
        "command": "$HOME/.claude/hooks/post-tool-cheerleader.sh"
      }]
    }]
  }
}
EOF
fi

echo ""
echo "┌─────────────────────────────────────────────────────────────┐"
echo "│  ✓ Installation Complete!                                   │"
echo "└─────────────────────────────────────────────────────────────┘"
echo ""
echo "Restart Claude Code to activate the cheerleader!"
echo ""
echo "You'll see:"
echo "   • Welcome message on session start"
echo "   • Encouragement before context compact"
echo "   • Support when errors occur"
echo ""
