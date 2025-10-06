# 🎯 HashiCorp Boundary Automation Suite

Complete automation suite for HashiCorp Boundary with HCP integration, Docker test environment, and helper scripts.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Usage Guide](#usage-guide)
- [Configuration](#configuration)
- [Docker Environment](#docker-environment)
- [Troubleshooting](#troubleshooting)
- [Advanced Usage](#advanced-usage)

## 🌟 Overview

This automation suite provides a complete set of tools to:
- Install and configure HashiCorp Boundary CLI
- Connect to HCP (HashiCorp Cloud Platform) Boundary clusters
- Manage targets, hosts, and credentials
- Test with Docker-based target services
- Generate Terraform configurations

## ✨ Features

- **🚀 Automated Installation** - One-command Boundary CLI installation
- **⚙️ HCP Integration** - Seamless connection to HCP Boundary clusters
- **🎯 Target Management** - Create and manage SSH, HTTP, and database targets
- **🔐 Multiple Auth Methods** - Support for Service Principal, Password, and OIDC
- **🐳 Docker Test Environment** - Complete test environment with multiple services
- **📊 Interactive Menu** - Beautiful CLI interface with progress indicators
- **🔧 Terraform Generation** - Auto-generate IaC configurations
- **🛠️ Helper Scripts** - Quick connect and SSH proxy scripts

## 📦 Prerequisites

- **Operating System**: Linux, macOS, or WSL2 on Windows
- **Required Tools**:
  - `curl` - For downloading Boundary CLI
  - `unzip` - For extracting archives
  - `jq` - For JSON processing
  - `bash` 4.0+ - For running scripts
- **Optional**:
  - `docker` and `docker-compose` - For test environment
  - `terraform` - For infrastructure as code

### Install Prerequisites

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install -y curl unzip jq
```

**macOS:**
```bash
brew install curl jq
```

**RHEL/CentOS:**
```bash
sudo yum install -y curl unzip jq
```

## 🚀 Quick Start

### Method 1: Interactive Menu (Recommended)

```bash
cd boundary-automation
chmod +x *.sh
./complete-setup.sh
```

Select option **1** for automated full setup.

### Method 2: Fully Automated

```bash
cd boundary-automation
chmod +x *.sh
./auto-connect.sh
```

### Method 3: Manual Setup

```bash
# Step 1: Install Boundary CLI
./install-boundary.sh

# Step 2: Configure HCP connection
./configure-hcp.sh

# Step 3: Setup targets
./setup-targets.sh

# Step 4: Connect to a target
./boundary-connect.sh list
./boundary-connect.sh ttcp_xxxxxxxxxx
```

### Method 4: Docker Test Environment

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📁 Project Structure

```
boundary-automation/
├── README.md                  # This file
├── complete-setup.sh          # Interactive menu-driven setup
├── auto-connect.sh            # Automated setup and connection
├── install-boundary.sh        # Boundary CLI installer
├── configure-hcp.sh           # HCP configuration wizard
├── setup-targets.sh           # Target and resource management
├── boundary-connect.sh        # Quick connect helper
├── boundary-ssh.sh            # SSH proxy helper
├── docker-compose.yml         # Docker test environment
└── sample-web/                # Test web application
    ├── Dockerfile
    ├── index.html
    ├── style.css
    └── nginx.conf
```

## 📖 Usage Guide

### Installing Boundary CLI

The installation script automatically detects your OS and architecture:

```bash
./install-boundary.sh
```

**Environment Variables:**
- `BOUNDARY_VERSION` - Version to install (default: 0.20.0+ent)
- `INSTALL_DIR` - Installation directory (default: /usr/local/bin)

**Example:**
```bash
BOUNDARY_VERSION=0.19.0+ent ./install-boundary.sh
```

### Configuring HCP Connection

The configuration wizard will guide you through setting up your HCP connection:

```bash
./configure-hcp.sh
```

**You'll need:**
1. **Organization ID** - Found in HCP portal URL
2. **Project ID** - Found in HCP portal URL
3. **Cluster Name** - Your Boundary cluster name
4. **Credentials** - Service Principal or username/password

**Default Configuration:**
- **Organization ID**: `904182ed-28ef-4c76-849e-d444545f9a2a`
- **Project ID**: `1856f618-0793-41f4-9610-1f93f4011ab6`
- **Cluster**: `boundary-cluster`

### Creating Service Principal

1. Go to: https://portal.cloud.hashicorp.com/
2. Navigate to your organization settings
3. Click "Service Principals"
4. Create a new service principal
5. Save the Client ID and Client Secret

### Managing Targets

The target management script provides an interactive menu:

```bash
./setup-targets.sh
```

**Options:**
1. Create SSH Target
2. Create HTTP Target
3. Create Database Target
4. List Targets
5. Create Host Catalog
6. Create Host Set

### Quick Connect

**List all targets:**
```bash
./boundary-connect.sh list
```

**Connect to a target:**
```bash
./boundary-connect.sh ttcp_xxxxxxxxxx
```

### SSH Through Boundary

```bash
./boundary-ssh.sh ttcp_xxxxxxxxxx
./boundary-ssh.sh ttcp_xxxxxxxxxx -l username
```

## ⚙️ Configuration

### Configuration Files

All configuration is stored in `~/.boundary/`:

```
~/.boundary/
├── config.hcl           # Boundary CLI configuration
└── credentials.env      # Environment variables and credentials
```

### Loading Credentials

To use Boundary commands directly:

```bash
source ~/.boundary/credentials.env
boundary targets list
```

### Environment Variables

**Boundary Configuration:**
```bash
export BOUNDARY_ADDR="https://boundary-cluster.boundary.hashicorp.cloud"
export BOUNDARY_TOKEN="at_xxxxxxxxxxxxxxxx"
```

**HCP Service Principal:**
```bash
export HCP_CLIENT_ID="your-client-id"
export HCP_CLIENT_SECRET="your-client-secret"
```

## 🐳 Docker Environment

The Docker Compose setup includes:

### Services

| Service | Port | Credentials | Description |
|---------|------|-------------|-------------|
| SSH Server | 2222 | demo/demo123 | OpenSSH server |
| PostgreSQL | 5432 | postgres/postgres123 | PostgreSQL 15 |
| MySQL | 3306 | root/mysql123 | MySQL 8.0 |
| Redis | 6379 | redis123 | Redis 7 |
| Web App | 8080 | N/A | Test web application |
| NGINX | 8081 | N/A | Static web server |

### Docker Commands

**Start all services:**
```bash
docker-compose up -d
```

**View logs:**
```bash
docker-compose logs -f [service-name]
```

**Stop all services:**
```bash
docker-compose down
```

**Rebuild services:**
```bash
docker-compose up -d --build
```

**Access services directly:**
```bash
# SSH
ssh -p 2222 demo@localhost
# Password: demo123

# PostgreSQL
psql -h localhost -p 5432 -U postgres
# Password: postgres123

# MySQL
mysql -h localhost -P 3306 -u root -p
# Password: mysql123

# Redis
redis-cli -h localhost -p 6379 -a redis123

# Web App
curl http://localhost:8080
```

### Creating Targets for Docker Services

After starting Docker services, create Boundary targets:

```bash
./setup-targets.sh

# Then select option 1, 2, or 3 and enter:
# - Target Host: localhost (or Docker host IP)
# - Target Port: (service port from table above)
```

## 🔧 Troubleshooting

### Common Issues

**1. Boundary CLI not found after installation**

```bash
# Check if installed
which boundary

# Add to PATH manually
export PATH=$PATH:/usr/local/bin

# Or reinstall with different directory
INSTALL_DIR=$HOME/bin ./install-boundary.sh
```

**2. Authentication fails**

```bash
# Verify credentials
cat ~/.boundary/credentials.env

# Re-authenticate manually
boundary authenticate

# Or reconfigure
./configure-hcp.sh
```

**3. Cannot connect to target**

```bash
# List targets
boundary targets list

# Check target details
boundary targets read -id ttcp_xxxxxxxxxx

# Verify network connectivity
ping <target-host>
telnet <target-host> <target-port>
```

**4. Docker services not starting**

```bash
# Check Docker is running
docker ps

# View logs
docker-compose logs

# Restart services
docker-compose restart
```

**5. Permission denied errors**

```bash
# Make scripts executable
chmod +x *.sh

# Or run with bash explicitly
bash install-boundary.sh
```

### Debug Mode

Enable debug output:

```bash
# Set debug level
export BOUNDARY_LOG_LEVEL=debug

# Run with verbose output
boundary -log-level=debug targets list
```

### Getting Help

```bash
# Script help
./auto-connect.sh --help
./complete-setup.sh  # Select option 9

# Boundary CLI help
boundary --help
boundary targets --help
```

## 🔬 Advanced Usage

### Custom Boundary Version

```bash
BOUNDARY_VERSION=0.19.0+ent ./install-boundary.sh
```

### Using with CI/CD

```bash
# Non-interactive authentication
export BOUNDARY_ADDR="https://..."
export HCP_CLIENT_ID="..."
export HCP_CLIENT_SECRET="..."

boundary authenticate
boundary targets list
```

### Terraform Integration

Generate Terraform configuration:

```bash
./complete-setup.sh
# Select option 8

cd terraform
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values

terraform init
terraform plan
terraform apply
```

### SSH ProxyCommand

Add to `~/.ssh/config`:

```
Host *.boundary
    ProxyCommand boundary connect ssh -target-id %h -- -W %h:%p
```

Then connect:

```bash
ssh ttcp_xxxxxxxxxx.boundary
```

### Session Recording

Enable session recording in Boundary:

```bash
boundary targets update tcp \
  -id ttcp_xxxxxxxxxx \
  -session-recording-enabled
```

## 📚 Resources

- **Official Documentation**: https://developer.hashicorp.com/boundary
- **HCP Portal**: https://portal.cloud.hashicorp.com/
- **Boundary Tutorials**: https://developer.hashicorp.com/boundary/tutorials
- **Terraform Provider**: https://registry.terraform.io/providers/hashicorp/boundary/latest
- **GitHub Repository**: https://github.com/hashicorp/boundary

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## 📄 License

This automation suite is provided as-is for use with HashiCorp Boundary.

## 🙏 Acknowledgments

Built with ❤️ for the HashiCorp community.

---

**Need Help?**

- Check the [Troubleshooting](#troubleshooting) section
- Review Boundary [documentation](https://developer.hashicorp.com/boundary)
- Open an issue in the repository
