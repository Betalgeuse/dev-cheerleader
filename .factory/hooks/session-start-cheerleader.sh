#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export CHEERLEADER_HOOK_TYPE="session_start"
node "$SCRIPT_DIR/dist/cheerleader.mjs"
