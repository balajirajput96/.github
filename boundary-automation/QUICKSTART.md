# 🚀 Quick Start Guide

Get started with HashiCorp Boundary in under 5 minutes!

## Prerequisites

Ensure you have these tools installed:
```bash
curl unzip jq bash
```

## Step 1: Choose Your Path

### Option A: Fully Automated (Easiest) ⭐

```bash
cd boundary-automation
chmod +x *.sh
./auto-connect.sh
```

This will:
1. Install Boundary CLI automatically
2. Guide you through HCP configuration
3. List available targets
4. Connect you to a target

### Option B: Interactive Menu

```bash
cd boundary-automation
chmod +x *.sh
./complete-setup.sh
```

Then select option **1** for automated full setup.

### Option C: Manual Step-by-Step

```bash
cd boundary-automation
chmod +x *.sh

# 1. Install Boundary CLI
./install-boundary.sh

# 2. Configure HCP
./configure-hcp.sh

# 3. Setup targets
./setup-targets.sh

# 4. Connect
./boundary-connect.sh list
./boundary-connect.sh ttcp_xxxxxxxxxx
```

## Step 2: Get Your HCP Credentials

You'll need:

1. **Organization ID**: `904182ed-28ef-4c76-849e-d444545f9a2a` (pre-configured)
2. **Project ID**: `1856f618-0793-41f4-9610-1f93f4011ab6` (pre-configured)
3. **Cluster Name**: `boundary-cluster` (pre-configured)
4. **Service Principal Credentials**:
   - Go to: https://portal.cloud.hashicorp.com/orgs/904182ed-28ef-4c76-849e-d444545f9a2a/settings/service-principals
   - Create a new service principal
   - Copy Client ID and Client Secret

## Step 3: Test with Docker (Optional)

Start test services:

```bash
docker-compose up -d
```

Available services:
- SSH Server: `localhost:2222` (demo/demo123)
- PostgreSQL: `localhost:5432` (postgres/postgres123)
- MySQL: `localhost:3306` (root/mysql123)
- Redis: `localhost:6379` (password: redis123)
- Web App: `http://localhost:8080`
- NGINX: `http://localhost:8081`

## Common Commands

```bash
# List all targets
./boundary-connect.sh list

# Connect to a target
./boundary-connect.sh ttcp_xxxxxxxxxx

# SSH through Boundary
./boundary-ssh.sh ttcp_xxxxxxxxxx

# View Docker logs
docker-compose logs -f

# Stop Docker services
docker-compose down
```

## Need Help?

- Full documentation: [README.md](README.md)
- Troubleshooting: [README.md#troubleshooting](README.md#troubleshooting)
- Boundary docs: https://developer.hashicorp.com/boundary

## What's Next?

1. ✅ Create more targets using `./setup-targets.sh`
2. ✅ Set up credential stores
3. ✅ Configure session recording
4. ✅ Generate Terraform configs (option 8 in complete-setup.sh)
5. ✅ Integrate with CI/CD pipelines

---

**Pro Tip**: Source credentials for direct Boundary CLI usage:
```bash
source ~/.boundary/credentials.env
boundary targets list
```
