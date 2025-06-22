#!/bin/bash

# ==================================================================================
#
#   DEPLOYMENT SCRIPT FOR RADAR-STORE
#
#   This script automates the deployment process for the Radar-Store application.
#   It ensures all necessary dependencies are met, pulls the latest code,
#   rebuilds the Docker container, and cleans up old resources.
#
#   Usage: ./deploy.sh
#
# ==================================================================================

# --- Configuration ---
# Service name defined in your docker-compose.yaml
SERVICE_NAME="radar-store"

# --- Colors ---
C_RESET='\033[0m'
C_RED='\033[0;31m'
C_GREEN='\033[0;32m'
C_YELLOW='\033[0;33m'
C_BLUE='\033[0;34m'
C_PURPLE='\033[0;35m'
C_CYAN='\033[0;36m'
C_BOLD='\033[1m'

# --- Helper Functions ---

# Print a formatted header
function print_header() {
    echo -e "\n${C_BOLD}${C_PURPLE}=======================================================${C_RESET}"
    echo -e "${C_BOLD}${C_PURPLE}  $1"
    echo -e "${C_BOLD}${C_PURPLE}=======================================================${C_RESET}"
}

# Print a success message
function print_success() {
    echo -e "${C_GREEN}✔ $1${C_RESET}"
}

# Print an error message and exit
function print_error() {
    echo -e "${C_RED}✖ $1${C_RESET}"
    exit 1
}

# Print an informational message
function print_info() {
    echo -e "${C_CYAN}ℹ $1${C_RESET}"
}

# Print a warning message
function print_warning() {
    echo -e "${C_YELLOW}⚠ $1${C_RESET}"
}

# Function to select Git branch interactively
function select_branch() {
    print_header "BRANCH SELECTION"
    
    # Fetch latest branch information
    print_info "Fetching latest branch information..."
    git fetch --all &> /dev/null || print_warning "Could not fetch latest branches. Using local branch list."
    
    # Get all branches (local and remote), remove duplicates and clean format
    local branches=($(git branch -a | sed 's/remotes\/origin\///g' | sed 's/^[* ]*//g' | grep -v '^HEAD' | sort | uniq | grep -v '^$'))
    
    if [ ${#branches[@]} -eq 0 ]; then
        print_error "No branches found in this repository."
    fi
    
    echo -e "\n${C_BOLD}${C_BLUE}Available branches:${C_RESET}"
    echo -e "${C_YELLOW}┌─────┬──────────────────────────────────────────┐${C_RESET}"
    echo -e "${C_YELLOW}│  #  │ Branch Name                              │${C_RESET}"
    echo -e "${C_YELLOW}├─────┼──────────────────────────────────────────┤${C_RESET}"
    
    for i in "${!branches[@]}"; do
        local branch_name="${branches[$i]}"
        local current_marker=""
        
        # Check if this is the current branch
        local current_branch=$(git branch --show-current)
        if [ "$branch_name" = "$current_branch" ]; then
            current_marker="${C_GREEN} (current)${C_RESET}"
        fi
        
        printf "${C_YELLOW}│${C_RESET} %2d  ${C_YELLOW}│${C_RESET} %-36s%s ${C_YELLOW}│${C_RESET}\n" $((i+1)) "$branch_name" "$current_marker"
    done
    
    echo -e "${C_YELLOW}└─────┴──────────────────────────────────────────┘${C_RESET}"
    echo ""
    
    # Get user selection
    while true; do
        echo -n -e "${C_BOLD}${C_CYAN}Select branch number (1-${#branches[@]}): ${C_RESET}"
        read -r selection
        
        # Validate input
        if [[ "$selection" =~ ^[0-9]+$ ]] && [ "$selection" -ge 1 ] && [ "$selection" -le "${#branches[@]}" ]; then
            GIT_BRANCH="${branches[$((selection-1))]}"
            print_success "Selected branch: ${C_BOLD}${GIT_BRANCH}${C_RESET}"
            break
        else
            print_error "Invalid selection. Please enter a number between 1 and ${#branches[@]}."
        fi
    done
    
    # Confirm selection
    echo ""
    echo -n -e "${C_YELLOW}Deploy branch '${C_BOLD}${GIT_BRANCH}${C_RESET}${C_YELLOW}'? [Y/n]: ${C_RESET}"
    read -r confirm
    
    if [[ "$confirm" =~ ^[Nn]$ ]]; then
        print_info "Deployment cancelled by user."
        exit 0
    fi
    
    echo ""
}

# --- Main Script ---

# 1. Preamble & Dependency Check
print_header "STARTING RADAR-STORE DEPLOYMENT"
print_info "This script will update and restart the ${SERVICE_NAME} service."

# Check for Git
if ! command -v git &> /dev/null; then
    print_error "Git is not installed. Please install Git to proceed."
fi
print_success "Git is installed."

# Check if we're in a Git repository
if ! git rev-parse --git-dir &> /dev/null; then
    print_error "This directory is not a Git repository."
fi
print_success "Git repository detected."

# Check for Docker
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker to proceed."
fi
print_success "Docker is installed."

# Check for Docker Compose
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install it to proceed."
fi
print_success "Docker Compose is installed."

# Check if docker-compose.yaml exists
if [ ! -f "docker-compose.yaml" ] && [ ! -f "docker-compose.yml" ]; then
    print_error "docker-compose.yaml file not found in current directory."
fi
print_success "Docker Compose configuration found."

# 2. Branch Selection
select_branch

# 3. Fetch Latest Code
print_header "FETCHING LATEST SOURCE CODE"
print_info "Switching to '${GIT_BRANCH}' branch..."
git checkout ${GIT_BRANCH} || print_error "Failed to switch to branch '${GIT_BRANCH}'."

print_info "Pulling latest changes from origin..."
git pull origin ${GIT_BRANCH} || print_error "Failed to pull latest changes."
print_success "Source code is up to date."

# Display current commit info
local current_commit=$(git rev-parse --short HEAD)
local commit_message=$(git log -1 --pretty=format:"%s")
print_info "Current commit: ${C_BOLD}${current_commit}${C_RESET} - ${commit_message}"

# 4. Pre-deployment checks
print_header "PRE-DEPLOYMENT CHECKS"

# Check if service exists in docker-compose
if ! docker-compose config --services | grep -q "^${SERVICE_NAME}$"; then
    print_error "Service '${SERVICE_NAME}' not found in docker-compose configuration."
fi
print_success "Service '${SERVICE_NAME}' found in docker-compose configuration."

# Show current container status if exists
if docker-compose ps | grep -q "${SERVICE_NAME}"; then
    print_info "Current service status:"
    docker-compose ps ${SERVICE_NAME}
    echo ""
fi

# 5. Build and Restart Docker Container
print_header "BUILDING AND RESTARTING DOCKER SERVICE"

print_info "Stopping and removing any existing '${SERVICE_NAME}' containers..."
docker-compose down || print_info "No existing containers to remove."

print_info "Building the Docker image for '${SERVICE_NAME}'. This may take a few minutes..."

docker-compose build --no-cache ${SERVICE_NAME} || print_error "Docker build failed."
print_success "Docker image built successfully."

print_info "Starting the '${SERVICE_NAME}' service with the new image..."
docker-compose up -d --force-recreate ${SERVICE_NAME} || print_error "Failed to start the Docker service."

# Wait a moment for the service to start
sleep 3

# Check if service is running
if docker-compose ps | grep -q "${SERVICE_NAME}.*Up"; then
    print_success "${SERVICE_NAME} service has been started successfully."
else
    print_warning "${SERVICE_NAME} service may not have started correctly. Check the logs."
fi

# 6. Cleanup
print_header "CLEANING UP OLD DOCKER IMAGES"
print_info "Removing dangling Docker images to free up space..."
docker image prune -f || print_info "Could not perform cleanup. This is non-critical."

# Optional: Remove unused volumes
echo -n -e "${C_YELLOW}Remove unused Docker volumes? [y/N]: ${C_RESET}"
read -r cleanup_volumes
if [[ "$cleanup_volumes" =~ ^[Yy]$ ]]; then
    docker volume prune -f || print_info "Could not remove unused volumes."
    print_success "Volume cleanup complete."
fi

print_success "Cleanup complete."

# 7. Final Status
print_header "DEPLOYMENT COMPLETE"
print_success "Radar-Store has been successfully deployed!"
print_info "Branch: ${C_BOLD}${GIT_BRANCH}${C_RESET}"
print_info "Commit: ${C_BOLD}${current_commit}${C_RESET}"

echo -e "\n${C_BOLD}${C_CYAN}Useful commands:${C_RESET}"
echo -e "${C_YELLOW}View running containers: ${C_BOLD}docker-compose ps${C_RESET}"
echo -e "${C_YELLOW}Check service logs:     ${C_BOLD}docker-compose logs -f ${SERVICE_NAME}${C_RESET}"
echo -e "${C_YELLOW}Stop the service:       ${C_BOLD}docker-compose stop ${SERVICE_NAME}${C_RESET}"
echo -e "${C_YELLOW}Restart the service:    ${C_BOLD}docker-compose restart ${SERVICE_NAME}${C_RESET}"

# Show service status
echo ""
print_info "Current service status:"
docker-compose ps ${SERVICE_NAME}

echo ""