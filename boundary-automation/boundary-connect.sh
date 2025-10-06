#!/bin/bash
# Quick connect helper script

CONFIG_DIR="$HOME/.boundary"

if [ -f "$CONFIG_DIR/credentials.env" ]; then
    source "$CONFIG_DIR/credentials.env"
fi

if [ "$1" = "list" ]; then
    boundary targets list -format table
    exit 0
fi

if [ -z "$1" ]; then
    echo "Usage: $0 <target-id|list>"
    echo ""
    echo "Examples:"
    echo "  $0 list              # List all targets"
    echo "  $0 ttcp_1234567890   # Connect to target"
    exit 1
fi

boundary connect -target-id "$1"
