#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

CONFIG_DIR="$HOME/.boundary"

echo -e "${BLUE}╔═══════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Boundary Target Setup                      ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════╝${NC}"
echo ""

# Check if boundary CLI is installed
if ! command -v boundary &> /dev/null; then
    echo -e "${RED}❌ Boundary CLI is not installed${NC}"
    exit 1
fi

# Source credentials if available
if [ -f "$CONFIG_DIR/credentials.env" ]; then
    source "$CONFIG_DIR/credentials.env"
    echo -e "${GREEN}✓${NC} Loaded credentials from $CONFIG_DIR/credentials.env"
else
    echo -e "${YELLOW}⚠${NC}  No credentials file found. Run ./configure-hcp.sh first"
    exit 1
fi

# Authenticate
echo -e "${BLUE}→${NC} Authenticating with Boundary..."
if ! boundary authenticate &> /dev/null; then
    echo -e "${RED}❌ Authentication failed${NC}"
    exit 1
fi
echo -e "${GREEN}✓${NC} Authenticated successfully"
echo ""

# Get default scope
echo -e "${BLUE}→${NC} Fetching scopes..."
SCOPES=$(boundary scopes list -format json 2>/dev/null || echo "[]")
if [ "$SCOPES" = "[]" ]; then
    echo -e "${YELLOW}⚠${NC}  No scopes found or unable to list scopes"
    read -p "Enter Project Scope ID: " PROJECT_SCOPE
else
    echo -e "${GREEN}✓${NC} Found scopes"
    PROJECT_SCOPE=$(echo "$SCOPES" | jq -r '.items[0].id // empty' | head -n1)
fi

if [ -z "$PROJECT_SCOPE" ]; then
    echo -e "${RED}❌ No project scope available${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} Using scope: $PROJECT_SCOPE"
echo ""

# Menu for target setup
while true; do
    echo -e "${CYAN}Target Management Menu${NC}"
    echo -e "${CYAN}═════════════════════${NC}"
    echo "  1. Create SSH Target"
    echo "  2. Create HTTP Target"
    echo "  3. Create Database Target"
    echo "  4. List Targets"
    echo "  5. Create Host Catalog"
    echo "  6. Create Host Set"
    echo "  7. Exit"
    echo ""
    read -p "Select option [1-7]: " OPTION

    case $OPTION in
        1)
            echo ""
            echo -e "${BLUE}→${NC} Create SSH Target"
            read -p "  Target Name: " TARGET_NAME
            read -p "  Target Host (IP/hostname): " TARGET_HOST
            read -p "  Target Port [22]: " TARGET_PORT
            TARGET_PORT=${TARGET_PORT:-22}

            TARGET_ID=$(boundary targets create tcp \
                -scope-id "$PROJECT_SCOPE" \
                -name "$TARGET_NAME" \
                -default-port "$TARGET_PORT" \
                -session-connection-limit -1 \
                -format json | jq -r '.item.id')

            echo -e "${GREEN}✓${NC} Created target: $TARGET_ID"
            echo -e "${YELLOW}Connect with:${NC} boundary connect -target-id $TARGET_ID"
            ;;
        2)
            echo ""
            echo -e "${BLUE}→${NC} Create HTTP Target"
            read -p "  Target Name: " TARGET_NAME
            read -p "  Target Host: " TARGET_HOST
            read -p "  Target Port [80]: " TARGET_PORT
            TARGET_PORT=${TARGET_PORT:-80}

            TARGET_ID=$(boundary targets create tcp \
                -scope-id "$PROJECT_SCOPE" \
                -name "$TARGET_NAME" \
                -default-port "$TARGET_PORT" \
                -session-connection-limit -1 \
                -format json | jq -r '.item.id')

            echo -e "${GREEN}✓${NC} Created target: $TARGET_ID"
            ;;
        3)
            echo ""
            echo -e "${BLUE}→${NC} Create Database Target"
            read -p "  Target Name: " TARGET_NAME
            read -p "  Database Type (postgres/mysql/redis): " DB_TYPE
            
            case $DB_TYPE in
                postgres)
                    DEFAULT_PORT=5432
                    ;;
                mysql)
                    DEFAULT_PORT=3306
                    ;;
                redis)
                    DEFAULT_PORT=6379
                    ;;
                *)
                    DEFAULT_PORT=5432
                    ;;
            esac

            read -p "  Target Host: " TARGET_HOST
            read -p "  Target Port [$DEFAULT_PORT]: " TARGET_PORT
            TARGET_PORT=${TARGET_PORT:-$DEFAULT_PORT}

            TARGET_ID=$(boundary targets create tcp \
                -scope-id "$PROJECT_SCOPE" \
                -name "$TARGET_NAME" \
                -default-port "$TARGET_PORT" \
                -session-connection-limit -1 \
                -format json | jq -r '.item.id')

            echo -e "${GREEN}✓${NC} Created target: $TARGET_ID"
            ;;
        4)
            echo ""
            echo -e "${BLUE}→${NC} Listing targets..."
            boundary targets list -scope-id "$PROJECT_SCOPE" -format table
            ;;
        5)
            echo ""
            echo -e "${BLUE}→${NC} Create Host Catalog"
            read -p "  Catalog Name: " CATALOG_NAME

            CATALOG_ID=$(boundary host-catalogs create static \
                -scope-id "$PROJECT_SCOPE" \
                -name "$CATALOG_NAME" \
                -format json | jq -r '.item.id')

            echo -e "${GREEN}✓${NC} Created catalog: $CATALOG_ID"
            ;;
        6)
            echo ""
            echo -e "${BLUE}→${NC} Create Host Set"
            read -p "  Host Catalog ID: " CATALOG_ID
            read -p "  Host Set Name: " HOSTSET_NAME

            HOSTSET_ID=$(boundary host-sets create static \
                -host-catalog-id "$CATALOG_ID" \
                -name "$HOSTSET_NAME" \
                -format json | jq -r '.item.id')

            echo -e "${GREEN}✓${NC} Created host set: $HOSTSET_ID"
            ;;
        7)
            echo ""
            echo -e "${GREEN}Goodbye!${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid option${NC}"
            ;;
    esac
    echo ""
done
