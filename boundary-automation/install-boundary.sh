#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BOUNDARY_VERSION="${BOUNDARY_VERSION:-0.20.0+ent}"
INSTALL_DIR="${INSTALL_DIR:-/usr/local/bin}"

echo -e "${BLUE}╔═══════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   HashiCorp Boundary CLI Installer           ║${NC}"
echo -e "${BLUE}║   Version: ${BOUNDARY_VERSION}                        ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════╝${NC}"
echo ""

# Detect OS and Architecture
OS=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)

case $ARCH in
    x86_64)
        ARCH="amd64"
        ;;
    aarch64|arm64)
        ARCH="arm64"
        ;;
    *)
        echo -e "${RED}❌ Unsupported architecture: $ARCH${NC}"
        exit 1
        ;;
esac

echo -e "${GREEN}✓${NC} Detected OS: ${YELLOW}$OS${NC}"
echo -e "${GREEN}✓${NC} Detected Architecture: ${YELLOW}$ARCH${NC}"
echo ""

# Check if Boundary is already installed
if command -v boundary &> /dev/null; then
    CURRENT_VERSION=$(boundary version | head -n1 | awk '{print $2}' | sed 's/v//')
    echo -e "${YELLOW}⚠${NC}  Boundary CLI is already installed (version: $CURRENT_VERSION)"
    read -p "Do you want to reinstall? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${GREEN}✓${NC} Keeping existing installation"
        exit 0
    fi
fi

# Download URL
DOWNLOAD_URL="https://releases.hashicorp.com/boundary/${BOUNDARY_VERSION}/boundary_${BOUNDARY_VERSION}_${OS}_${ARCH}.zip"

echo -e "${BLUE}→${NC} Downloading Boundary CLI..."
echo -e "  URL: ${DOWNLOAD_URL}"

# Create temporary directory
TMP_DIR=$(mktemp -d)
cd "$TMP_DIR"

# Download the binary
if ! curl -sSL "$DOWNLOAD_URL" -o boundary.zip; then
    echo -e "${RED}❌ Failed to download Boundary CLI${NC}"
    echo -e "${YELLOW}Please check if version ${BOUNDARY_VERSION} is available${NC}"
    rm -rf "$TMP_DIR"
    exit 1
fi

echo -e "${GREEN}✓${NC} Download complete"

# Extract the binary
echo -e "${BLUE}→${NC} Extracting binary..."
unzip -q boundary.zip

# Install the binary
echo -e "${BLUE}→${NC} Installing to ${INSTALL_DIR}..."

if [ -w "$INSTALL_DIR" ]; then
    mv boundary "$INSTALL_DIR/"
    chmod +x "$INSTALL_DIR/boundary"
else
    echo -e "${YELLOW}⚠${NC}  Requires sudo for installation to $INSTALL_DIR"
    sudo mv boundary "$INSTALL_DIR/"
    sudo chmod +x "$INSTALL_DIR/boundary"
fi

# Clean up
cd - > /dev/null
rm -rf "$TMP_DIR"

# Verify installation
if command -v boundary &> /dev/null; then
    INSTALLED_VERSION=$(boundary version | head -n1)
    echo ""
    echo -e "${GREEN}✓${NC} Installation successful!"
    echo -e "${GREEN}✓${NC} $INSTALLED_VERSION"
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo -e "  1. Run ${YELLOW}./configure-hcp.sh${NC} to configure HCP connection"
    echo -e "  2. Run ${YELLOW}./complete-setup.sh${NC} for interactive setup"
    echo -e "  3. Or run ${YELLOW}./auto-connect.sh${NC} for automated setup"
else
    echo -e "${RED}❌ Installation verification failed${NC}"
    exit 1
fi
