#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}"
cat << "EOF"
╔═══════════════════════════════════════════════════╗
║   Boundary Auto-Connect                           ║
║   Automated Setup & Connection                    ║
╚═══════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

CONFIG_DIR="$HOME/.boundary"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Function to check prerequisites
check_prerequisites() {
    echo -e "${BLUE}→${NC} Checking prerequisites..."
    
    # Check if Boundary is installed
    if ! command -v boundary &> /dev/null; then
        echo -e "${YELLOW}⚠${NC}  Boundary CLI not found. Installing..."
        "$SCRIPT_DIR/install-boundary.sh" || {
            echo -e "${RED}❌ Failed to install Boundary CLI${NC}"
            exit 1
        }
    else
        echo -e "${GREEN}✓${NC} Boundary CLI is installed"
    fi
}

# Function to configure if needed
check_configuration() {
    echo -e "${BLUE}→${NC} Checking configuration..."
    
    if [ ! -f "$CONFIG_DIR/credentials.env" ]; then
        echo -e "${YELLOW}⚠${NC}  No configuration found. Running configuration wizard..."
        "$SCRIPT_DIR/configure-hcp.sh" || {
            echo -e "${RED}❌ Configuration failed${NC}"
            exit 1
        }
    else
        echo -e "${GREEN}✓${NC} Configuration found"
        source "$CONFIG_DIR/credentials.env"
    fi
}

# Function to authenticate
authenticate() {
    echo -e "${BLUE}→${NC} Authenticating with Boundary..."
    
    source "$CONFIG_DIR/credentials.env"
    
    if boundary authenticate &> /dev/null; then
        echo -e "${GREEN}✓${NC} Authentication successful"
        return 0
    else
        echo -e "${YELLOW}⚠${NC}  Attempting interactive authentication..."
        boundary authenticate || {
            echo -e "${RED}❌ Authentication failed${NC}"
            exit 1
        }
    fi
}

# Function to list and select target
select_target() {
    echo ""
    echo -e "${BLUE}→${NC} Fetching available targets..."
    
    # List targets
    TARGETS=$(boundary targets list -format json 2>/dev/null || echo '{"items":[]}')
    TARGET_COUNT=$(echo "$TARGETS" | jq -r '.items | length')
    
    if [ "$TARGET_COUNT" -eq 0 ]; then
        echo -e "${YELLOW}⚠${NC}  No targets found"
        echo ""
        echo -e "${CYAN}Would you like to create a target now?${NC}"
        read -p "Create target? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            "$SCRIPT_DIR/setup-targets.sh"
            exit 0
        else
            echo -e "${YELLOW}Run ./setup-targets.sh to create targets${NC}"
            exit 0
        fi
    fi
    
    echo ""
    echo -e "${GREEN}✓${NC} Found $TARGET_COUNT target(s)"
    echo ""
    echo -e "${CYAN}Available Targets:${NC}"
    echo "$TARGETS" | jq -r '.items[] | "  \(.id) - \(.name)"'
    echo ""
    
    # If only one target, use it automatically
    if [ "$TARGET_COUNT" -eq 1 ]; then
        TARGET_ID=$(echo "$TARGETS" | jq -r '.items[0].id')
        TARGET_NAME=$(echo "$TARGETS" | jq -r '.items[0].name')
        echo -e "${BLUE}→${NC} Auto-selecting target: $TARGET_NAME ($TARGET_ID)"
    else
        # Let user select
        read -p "Enter target ID or name: " TARGET_INPUT
        
        # Try to find by ID first, then by name
        TARGET_ID=$(echo "$TARGETS" | jq -r ".items[] | select(.id==\"$TARGET_INPUT\" or .name==\"$TARGET_INPUT\") | .id" | head -n1)
        
        if [ -z "$TARGET_ID" ]; then
            echo -e "${RED}❌ Target not found${NC}"
            exit 1
        fi
    fi
    
    echo ""
    echo -e "${BLUE}→${NC} Connecting to target: $TARGET_ID"
    
    # Connect to target
    boundary connect -target-id "$TARGET_ID" || {
        echo -e "${RED}❌ Connection failed${NC}"
        exit 1
    }
}

# Main execution flow
main() {
    check_prerequisites
    check_configuration
    authenticate
    select_target
}

# Handle command line arguments
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    echo "Usage: $0 [target-id]"
    echo ""
    echo "Options:"
    echo "  target-id    Optional target ID to connect to directly"
    echo "  --help, -h   Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                    # Interactive mode"
    echo "  $0 ttcp_1234567890    # Connect to specific target"
    exit 0
fi

# If target ID provided as argument, use it
if [ -n "$1" ]; then
    check_prerequisites
    check_configuration
    authenticate
    
    echo ""
    echo -e "${BLUE}→${NC} Connecting to target: $1"
    boundary connect -target-id "$1" || {
        echo -e "${RED}❌ Connection failed${NC}"
        exit 1
    }
else
    # Interactive mode
    main
fi
