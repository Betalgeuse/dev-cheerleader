#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export CHEERLEADER_HOOK_TYPE="pre_compact"
node "$SCRIPT_DIR/dist/cheerleader.mjs"
