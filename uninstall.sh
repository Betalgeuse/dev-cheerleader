#!/bin/bash
# Uninstall Dev Cheerleader from ~/.claude/
#
# Usage: ./uninstall.sh

set -euo pipefail

GLOBAL_DIR="$HOME/.claude"
HOOKS_DIR="$GLOBAL_DIR/hooks"

echo ""
echo "┌─────────────────────────────────────────────────────────────┐"
echo "│  Dev Cheerleader - Uninstall                                │"
echo "└─────────────────────────────────────────────────────────────┘"
echo ""

read -p "Remove Dev Cheerleader? [y/N] " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Uninstall cancelled."
    exit 0
fi

echo "Removing hooks..."
rm -f "$HOOKS_DIR/dist/cheerleader.mjs"
rm -f "$HOOKS_DIR/session-start-cheerleader.sh"
rm -f "$HOOKS_DIR/pre-compact-cheerleader.sh"
rm -f "$HOOKS_DIR/post-tool-cheerleader.sh"

echo "✓ Hook files removed"
echo ""
echo "⚠️  Note: You may need to manually remove cheerleader entries from"
echo "   $GLOBAL_DIR/settings.json"
echo ""
echo "Uninstall complete!"
