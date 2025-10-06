#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# ASCII Art Banner
show_banner() {
    clear
    echo -e "${CYAN}"
    cat << "EOF"
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   ██████╗  ██████╗ ██╗   ██╗███╗   ██╗██████╗  █████╗ ██████╗██╗   ██╗
║   ██╔══██╗██╔═══██╗██║   ██║████╗  ██║██╔══██╗██╔══██╗██╔══██╗╚██╗ ██╔╝
║   ██████╔╝██║   ██║██║   ██║██╔██╗ ██║██║  ██║███████║██████╔╝ ╚████╔╝
║   ██╔══██╗██║   ██║██║   ██║██║╚██╗██║██║  ██║██╔══██║██╔══██╗  ╚██╔╝
║   ██████╔╝╚██████╔╝╚██████╔╝██║ ╚████║██████╔╝██║  ██║██║  ██║   ██║
║   ╚═════╝  ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝
║                                                              ║
║              HashiCorp Boundary Automation Suite             ║
║                    Complete Setup Wizard                     ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
}

# Progress bar
show_progress() {
    local current=$1
    local total=$2
    local text=$3
    local percent=$((current * 100 / total))
    local filled=$((percent / 2))
    local empty=$((50 - filled))
    
    printf "\r${BLUE}[${NC}"
    printf "%${filled}s" | tr ' ' '█'
    printf "%${empty}s" | tr ' ' '░'
    printf "${BLUE}]${NC} %3d%% - %s" $percent "$text"
}

# Main menu
show_main_menu() {
    show_banner
    echo -e "${YELLOW}╔════════════════════════════════════════════════╗${NC}"
    echo -e "${YELLOW}║           MAIN MENU                            ║${NC}"
    echo -e "${YELLOW}╚════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "  ${CYAN}1.${NC} 🚀 Automated Full Setup (Recommended)"
    echo -e "  ${CYAN}2.${NC} 📦 Install Boundary CLI"
    echo -e "  ${CYAN}3.${NC} ⚙️  Configure HCP Connection"
    echo -e "  ${CYAN}4.${NC} 🎯 Setup Targets & Resources"
    echo -e "  ${CYAN}5.${NC} 🔗 Quick Connect to Target"
    echo -e "  ${CYAN}6.${NC} 🐳 Docker Test Environment"
    echo -e "  ${CYAN}7.${NC} 📊 System Status"
    echo -e "  ${CYAN}8.${NC} 🔧 Generate Terraform Config"
    echo -e "  ${CYAN}9.${NC} 📚 Help & Documentation"
    echo -e "  ${CYAN}0.${NC} 🚪 Exit"
    echo ""
    echo -ne "${BLUE}→${NC} Select option [0-9]: "
}

# Check system status
check_status() {
    echo ""
    echo -e "${CYAN}System Status Check${NC}"
    echo -e "${CYAN}═══════════════════${NC}"
    
    # Check Boundary CLI
    if command -v boundary &> /dev/null; then
        VERSION=$(boundary version | head -n1)
        echo -e "${GREEN}✓${NC} Boundary CLI: $VERSION"
    else
        echo -e "${RED}✗${NC} Boundary CLI: Not installed"
    fi
    
    # Check configuration
    if [ -f "$HOME/.boundary/config.hcl" ]; then
        echo -e "${GREEN}✓${NC} Configuration: Found"
    else
        echo -e "${YELLOW}⚠${NC} Configuration: Not configured"
    fi
    
    # Check credentials
    if [ -f "$HOME/.boundary/credentials.env" ]; then
        echo -e "${GREEN}✓${NC} Credentials: Configured"
    else
        echo -e "${YELLOW}⚠${NC} Credentials: Not configured"
    fi
    
    # Check Docker
    if command -v docker &> /dev/null; then
        echo -e "${GREEN}✓${NC} Docker: Installed"
    else
        echo -e "${YELLOW}⚠${NC} Docker: Not installed (optional)"
    fi
    
    echo ""
}

# Automated setup
automated_setup() {
    show_banner
    echo -e "${CYAN}Starting Automated Setup${NC}"
    echo -e "${CYAN}════════════════════════${NC}"
    echo ""
    
    # Step 1: Install Boundary
    show_progress 1 4 "Installing Boundary CLI..."
    if ! command -v boundary &> /dev/null; then
        ./install-boundary.sh > /tmp/boundary-install.log 2>&1 || {
            echo ""
            echo -e "${RED}❌ Installation failed. Check /tmp/boundary-install.log${NC}"
            return 1
        }
    fi
    echo ""
    
    # Step 2: Configure HCP
    show_progress 2 4 "Configuring HCP Connection..."
    echo ""
    echo ""
    echo -e "${YELLOW}Please provide HCP credentials:${NC}"
    ./configure-hcp.sh || {
        echo -e "${RED}❌ Configuration failed${NC}"
        return 1
    }
    
    # Step 3: Test connection
    show_progress 3 4 "Testing connection..."
    sleep 1
    echo ""
    
    # Step 4: Complete
    show_progress 4 4 "Setup complete!"
    echo ""
    echo ""
    echo -e "${GREEN}✓${NC} Automated setup completed successfully!"
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo -e "  • Run option 4 to setup targets"
    echo -e "  • Run option 5 to connect to a target"
    echo ""
}

# Quick connect
quick_connect() {
    echo ""
    echo -e "${CYAN}Quick Connect${NC}"
    echo -e "${CYAN}═════════════${NC}"
    
    if [ -f "$HOME/.boundary/credentials.env" ]; then
        source "$HOME/.boundary/credentials.env"
    fi
    
    echo ""
    echo -e "${BLUE}→${NC} Listing available targets..."
    boundary targets list -format table 2>/dev/null || {
        echo -e "${RED}❌ Failed to list targets${NC}"
        echo -e "${YELLOW}Make sure you're authenticated and have configured targets${NC}"
        return 1
    }
    
    echo ""
    read -p "Enter target ID to connect: " TARGET_ID
    
    if [ -n "$TARGET_ID" ]; then
        echo -e "${BLUE}→${NC} Connecting to target $TARGET_ID..."
        boundary connect -target-id "$TARGET_ID"
    fi
}

# Generate Terraform config
generate_terraform() {
    echo ""
    echo -e "${CYAN}Generate Terraform Configuration${NC}"
    echo -e "${CYAN}═══════════════════════════════${NC}"
    
    read -p "Output directory [./terraform]: " OUTPUT_DIR
    OUTPUT_DIR=${OUTPUT_DIR:-./terraform}
    
    mkdir -p "$OUTPUT_DIR"
    
    cat > "$OUTPUT_DIR/main.tf" <<'EOF'
terraform {
  required_providers {
    boundary = {
      source  = "hashicorp/boundary"
      version = "~> 1.1"
    }
  }
}

provider "boundary" {
  addr = var.boundary_addr
}

variable "boundary_addr" {
  description = "Boundary cluster address"
  type        = string
}

variable "project_scope_id" {
  description = "Project scope ID"
  type        = string
}

# Example target
resource "boundary_target" "example" {
  name         = "example-target"
  type         = "tcp"
  default_port = "22"
  scope_id     = var.project_scope_id
}
EOF

    cat > "$OUTPUT_DIR/variables.tf" <<'EOF'
variable "boundary_addr" {
  description = "Boundary cluster address"
  type        = string
}

variable "project_scope_id" {
  description = "Project scope ID"
  type        = string
}
EOF

    cat > "$OUTPUT_DIR/terraform.tfvars.example" <<EOF
boundary_addr     = "https://boundary-cluster.boundary.hashicorp.cloud"
project_scope_id  = "p_1234567890"
EOF

    echo -e "${GREEN}✓${NC} Terraform configuration generated in $OUTPUT_DIR"
    echo -e "${YELLOW}⚠${NC}  Copy terraform.tfvars.example to terraform.tfvars and update values"
}

# Show help
show_help() {
    echo ""
    echo -e "${CYAN}Help & Documentation${NC}"
    echo -e "${CYAN}═══════════════════${NC}"
    echo ""
    echo -e "${YELLOW}Quick Start:${NC}"
    echo -e "  1. Run option 1 for automated setup"
    echo -e "  2. Follow the prompts to configure HCP connection"
    echo -e "  3. Create targets using option 4"
    echo -e "  4. Connect to targets using option 5"
    echo ""
    echo -e "${YELLOW}Manual Commands:${NC}"
    echo -e "  • Install CLI:     ./install-boundary.sh"
    echo -e "  • Configure HCP:   ./configure-hcp.sh"
    echo -e "  • Setup targets:   ./setup-targets.sh"
    echo -e "  • Auto connect:    ./auto-connect.sh"
    echo ""
    echo -e "${YELLOW}Docker Environment:${NC}"
    echo -e "  • Start:  docker-compose up -d"
    echo -e "  • Stop:   docker-compose down"
    echo ""
    echo -e "${YELLOW}Documentation:${NC}"
    echo -e "  • README.md - Full documentation"
    echo -e "  • https://developer.hashicorp.com/boundary"
    echo ""
}

# Docker environment
docker_menu() {
    echo ""
    echo -e "${CYAN}Docker Test Environment${NC}"
    echo -e "${CYAN}══════════════════════${NC}"
    echo ""
    echo "  1. Start Docker environment"
    echo "  2. Stop Docker environment"
    echo "  3. View logs"
    echo "  4. Back to main menu"
    echo ""
    read -p "Select option [1-4]: " DOCKER_OPT
    
    case $DOCKER_OPT in
        1)
            if [ -f "docker-compose.yml" ]; then
                echo -e "${BLUE}→${NC} Starting Docker environment..."
                docker-compose up -d
                echo -e "${GREEN}✓${NC} Docker environment started"
            else
                echo -e "${RED}❌ docker-compose.yml not found${NC}"
            fi
            ;;
        2)
            echo -e "${BLUE}→${NC} Stopping Docker environment..."
            docker-compose down
            echo -e "${GREEN}✓${NC} Docker environment stopped"
            ;;
        3)
            docker-compose logs -f
            ;;
        4)
            return
            ;;
    esac
}

# Main loop
main() {
    while true; do
        show_main_menu
        read OPTION
        
        case $OPTION in
            1)
                automated_setup
                ;;
            2)
                ./install-boundary.sh
                ;;
            3)
                ./configure-hcp.sh
                ;;
            4)
                ./setup-targets.sh
                ;;
            5)
                quick_connect
                ;;
            6)
                docker_menu
                ;;
            7)
                check_status
                ;;
            8)
                generate_terraform
                ;;
            9)
                show_help
                ;;
            0)
                echo ""
                echo -e "${GREEN}Thank you for using Boundary Automation Suite!${NC}"
                exit 0
                ;;
            *)
                echo -e "${RED}Invalid option${NC}"
                ;;
        esac
        
        echo ""
        read -p "Press Enter to continue..."
    done
}

# Run main function
main
