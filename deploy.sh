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
# Git branch to deploy
GIT_BRANCH="master"

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

# --- Main Script ---

# 1. Preamble & Dependency Check
print_header "STARTING RADAR-STORE DEPLOYMENT"
print_info "This script will update and restart the ${SERVICE_NAME} service."

# Check for Git
if ! command -v git &> /dev/null; then
    print_error "Git is not installed. Please install Git to proceed."
fi
print_success "Git is installed."

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

# 2. Fetch Latest Code
print_header "FETCHING LATEST SOURCE CODE"
print_info "Switching to '${GIT_BRANCH}' branch..."
git checkout ${GIT_BRANCH} || print_error "Failed to switch to branch '${GIT_BRANCH}'."

print_info "Pulling latest changes from origin..."
git pull origin ${GIT_BRANCH} || print_error "Failed to pull latest changes."
print_success "Source code is up to date."

# 3. Build and Restart Docker Container
print_header "BUILDING AND RESTARTING DOCKER SERVICE"
print_info "Building the Docker image for '${SERVICE_NAME}'. This may take a few minutes..."

docker-compose build --no-cache ${SERVICE_NAME} || print_error "Docker build failed."
print_success "Docker image built successfully."

print_info "Restarting the '${SERVICE_NAME}' service with the new image..."
docker-compose up -d --force-recreate ${SERVICE_NAME} || print_error "Failed to restart the Docker service."
print_success "${SERVICE_NAME} service has been restarted."

# 4. Cleanup
print_header "CLEANING UP OLD DOCKER IMAGES"
print_info "Removing dangling Docker images to free up space..."
docker image prune -f || print_info "Could not perform cleanup. This is non-critical."
print_success "Cleanup complete."

# 5. Final Status
print_header "DEPLOYMENT COMPLETE"
print_success "Radar-Store has been successfully deployed!"
echo -e "\n${C_YELLOW}You can view the running container with: ${C_BOLD}docker-compose ps${C_RESET}"
echo -e "${C_YELLOW}And check the logs with: ${C_BOLD}docker-compose logs -f ${SERVICE_NAME}${C_RESET}\n"
