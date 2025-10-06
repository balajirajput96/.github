#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration file
CONFIG_DIR="$HOME/.boundary"
CONFIG_FILE="$CONFIG_DIR/config.hcl"

echo -e "${BLUE}╔═══════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   HashiCorp Boundary HCP Configuration       ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════╝${NC}"
echo ""

# Create config directory if it doesn't exist
mkdir -p "$CONFIG_DIR"

# Check if boundary CLI is installed
if ! command -v boundary &> /dev/null; then
    echo -e "${RED}❌ Boundary CLI is not installed${NC}"
    echo -e "${YELLOW}Run ./install-boundary.sh first${NC}"
    exit 1
fi

echo -e "${CYAN}HCP Boundary Configuration Wizard${NC}"
echo -e "${CYAN}═══════════════════════════════════${NC}"
echo ""

# Default values based on the problem statement
DEFAULT_ORG_ID="904182ed-28ef-4c76-849e-d444545f9a2a"
DEFAULT_PROJECT_ID="1856f618-0793-41f4-9610-1f93f4011ab6"
DEFAULT_CLUSTER="boundary-cluster"

# Get HCP Organization ID
echo -e "${BLUE}→${NC} HCP Organization ID"
read -p "  Enter Organization ID [$DEFAULT_ORG_ID]: " ORG_ID
ORG_ID=${ORG_ID:-$DEFAULT_ORG_ID}

# Get HCP Project ID
echo -e "${BLUE}→${NC} HCP Project ID"
read -p "  Enter Project ID [$DEFAULT_PROJECT_ID]: " PROJECT_ID
PROJECT_ID=${PROJECT_ID:-$DEFAULT_PROJECT_ID}

# Get Cluster Name
echo -e "${BLUE}→${NC} Boundary Cluster Name"
read -p "  Enter Cluster Name [$DEFAULT_CLUSTER]: " CLUSTER
CLUSTER=${CLUSTER:-$DEFAULT_CLUSTER}

# Construct cluster URL
CLUSTER_URL="https://${CLUSTER}.boundary.hashicorp.cloud"

echo ""
echo -e "${YELLOW}Authentication Method${NC}"
echo "  1. Service Principal (recommended for automation)"
echo "  2. Password (username/password)"
echo "  3. OIDC (OAuth/OpenID Connect)"
read -p "Select method [1-3]: " AUTH_METHOD
AUTH_METHOD=${AUTH_METHOD:-1}

case $AUTH_METHOD in
    1)
        echo ""
        echo -e "${BLUE}→${NC} Service Principal Configuration"
        echo -e "${YELLOW}You can create a service principal at:${NC}"
        echo -e "  https://portal.cloud.hashicorp.com/orgs/${ORG_ID}/settings/service-principals"
        echo ""
        read -p "  Client ID: " CLIENT_ID
        read -sp "  Client Secret: " CLIENT_SECRET
        echo ""
        
        # Save credentials
        cat > "$CONFIG_DIR/credentials.env" <<EOF
export HCP_CLIENT_ID="$CLIENT_ID"
export HCP_CLIENT_SECRET="$CLIENT_SECRET"
export BOUNDARY_ADDR="$CLUSTER_URL"
EOF
        chmod 600 "$CONFIG_DIR/credentials.env"
        echo -e "${GREEN}✓${NC} Credentials saved to $CONFIG_DIR/credentials.env"
        ;;
    2)
        echo ""
        echo -e "${BLUE}→${NC} Password Authentication"
        read -p "  Username: " USERNAME
        read -sp "  Password: " PASSWORD
        echo ""
        
        cat > "$CONFIG_DIR/credentials.env" <<EOF
export BOUNDARY_ADDR="$CLUSTER_URL"
export BOUNDARY_AUTH_METHOD_ID="ampw_"
export BOUNDARY_USERNAME="$USERNAME"
export BOUNDARY_PASSWORD="$PASSWORD"
EOF
        chmod 600 "$CONFIG_DIR/credentials.env"
        echo -e "${GREEN}✓${NC} Credentials saved"
        ;;
    3)
        echo ""
        echo -e "${BLUE}→${NC} OIDC Authentication"
        read -p "  Auth Method ID: " AUTH_METHOD_ID
        
        cat > "$CONFIG_DIR/credentials.env" <<EOF
export BOUNDARY_ADDR="$CLUSTER_URL"
export BOUNDARY_AUTH_METHOD_ID="$AUTH_METHOD_ID"
EOF
        chmod 600 "$CONFIG_DIR/credentials.env"
        echo -e "${GREEN}✓${NC} Configuration saved"
        ;;
esac

# Create HCL configuration
cat > "$CONFIG_FILE" <<EOF
# Boundary Configuration for HCP
# Organization: $ORG_ID
# Project: $PROJECT_ID
# Cluster: $CLUSTER

cluster "$CLUSTER" {
  addr = "$CLUSTER_URL"
}

default {
  cluster = "$CLUSTER"
}
EOF

echo ""
echo -e "${GREEN}✓${NC} Configuration saved to $CONFIG_FILE"
echo ""

# Test connection
echo -e "${BLUE}→${NC} Testing connection..."
source "$CONFIG_DIR/credentials.env"

if boundary authenticate &> /dev/null || boundary scopes list &> /dev/null; then
    echo -e "${GREEN}✓${NC} Successfully connected to HCP Boundary!"
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo -e "  1. Source credentials: ${YELLOW}source $CONFIG_DIR/credentials.env${NC}"
    echo -e "  2. Run setup targets: ${YELLOW}./setup-targets.sh${NC}"
    echo -e "  3. Or run complete setup: ${YELLOW}./complete-setup.sh${NC}"
else
    echo -e "${YELLOW}⚠${NC}  Could not verify connection automatically"
    echo -e "  Please verify credentials manually with: ${YELLOW}boundary authenticate${NC}"
fi

echo ""
echo -e "${CYAN}Configuration Summary:${NC}"
echo -e "  Cluster URL: ${YELLOW}$CLUSTER_URL${NC}"
echo -e "  Config File: ${YELLOW}$CONFIG_FILE${NC}"
echo -e "  Credentials: ${YELLOW}$CONFIG_DIR/credentials.env${NC}"
