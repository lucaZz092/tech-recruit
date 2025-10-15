#!/bin/bash

# Tech Recruit Deploy Script
# This script helps deploy the application to different platforms

set -e

echo "🚀 Tech Recruit Deploy Script"
echo "=============================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking requirements..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    
    print_success "Requirements check passed"
}

# Build frontend
build_frontend() {
    print_status "Building frontend..."
    cd front-end
    npm install
    npm run build
    cd ..
    print_success "Frontend built successfully"
}

# Install backend dependencies
setup_backend() {
    print_status "Setting up backend..."
    cd back-end
    npm install --production
    cd ..
    print_success "Backend setup completed"
}

# Docker deployment
deploy_docker() {
    print_status "Deploying with Docker..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed"
        exit 1
    fi
    
    # Create .env file if it doesn't exist
    if [ ! -f .env ]; then
        print_warning ".env file not found, creating from example..."
        cp .env.example .env
        print_warning "Please edit .env file with your configuration"
    fi
    
    # Build and start services
    docker-compose down
    docker-compose build
    docker-compose up -d
    
    print_success "Docker deployment completed"
    print_status "Services are running at:"
    print_status "  Frontend: http://localhost:80"
    print_status "  Backend:  http://localhost:5001"
    print_status "  MongoDB:  mongodb://localhost:27017"
}

# Heroku deployment
deploy_heroku() {
    print_status "Preparing Heroku deployment..."
    
    if ! command -v heroku &> /dev/null; then
        print_error "Heroku CLI is not installed"
        print_status "Install it from: https://devcenter.heroku.com/articles/heroku-cli"
        exit 1
    fi
    
    # Check if user is logged in
    if ! heroku auth:whoami &> /dev/null; then
        print_error "Please login to Heroku first: heroku login"
        exit 1
    fi
    
    print_status "Creating Heroku apps..."
    
    # Create backend app
    read -p "Enter backend app name: " backend_app
    heroku create $backend_app
    
    # Add MongoDB addon
    heroku addons:create mongodb-atlas:sandbox -a $backend_app
    
    # Set environment variables
    heroku config:set NODE_ENV=production -a $backend_app
    heroku config:set JWT_SECRET=$(openssl rand -base64 32) -a $backend_app
    heroku config:set JWT_EXPIRES_IN=7d -a $backend_app
    
    # Deploy backend
    git subtree push --prefix=back-end heroku main
    
    print_success "Heroku backend deployment initiated"
    print_status "Backend URL: https://$backend_app.herokuapp.com"
}

# Vercel deployment (frontend)
deploy_vercel() {
    print_status "Preparing Vercel deployment..."
    
    if ! command -v vercel &> /dev/null; then
        print_error "Vercel CLI is not installed"
        print_status "Install it with: npm i -g vercel"
        exit 1
    fi
    
    cd front-end
    vercel --prod
    cd ..
    
    print_success "Vercel deployment completed"
}

# Local production deployment
deploy_local() {
    print_status "Setting up local production deployment..."
    
    # Build frontend
    build_frontend
    
    # Setup backend
    setup_backend
    
    # Create production environment file
    if [ ! -f .env ]; then
        cp .env.example .env
        print_warning "Created .env file from example. Please configure it."
    fi
    
    print_success "Local production setup completed"
    print_status "To start the application:"
    print_status "  Backend:  cd back-end && npm start"
    print_status "  Frontend: Serve the front-end/dist folder with a web server"
}

# Main menu
show_menu() {
    echo ""
    echo "Select deployment option:"
    echo "1) Docker (Full stack with MongoDB)"
    echo "2) Heroku (Backend only)"
    echo "3) Vercel (Frontend only)"
    echo "4) Local Production Build"
    echo "5) Exit"
    echo ""
}

# Main script
main() {
    check_requirements
    
    while true; do
        show_menu
        read -p "Enter your choice (1-5): " choice
        
        case $choice in
            1)
                deploy_docker
                break
                ;;
            2)
                deploy_heroku
                break
                ;;
            3)
                deploy_vercel
                break
                ;;
            4)
                deploy_local
                break
                ;;
            5)
                print_status "Goodbye!"
                exit 0
                ;;
            *)
                print_error "Invalid option. Please choose 1-5."
                ;;
        esac
    done
}

# Run main function
main
