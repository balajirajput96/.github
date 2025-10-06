#!/bin/bash
# SSH proxy helper script

CONFIG_DIR="$HOME/.boundary"

if [ -f "$CONFIG_DIR/credentials.env" ]; then
    source "$CONFIG_DIR/credentials.env"
fi

if [ -z "$1" ]; then
    echo "Usage: $0 <target-id> [ssh-options]"
    echo ""
    echo "Examples:"
    echo "  $0 ttcp_1234567890"
    echo "  $0 ttcp_1234567890 -l username"
    exit 1
fi

TARGET_ID="$1"
shift

# Get connection info
boundary connect ssh -target-id "$TARGET_ID" -- "$@"
