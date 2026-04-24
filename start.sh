#!/bin/bash

# ============================================
# AI Music School & Academy Manager - Start Script
# ============================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

echo -e "${PURPLE}"
echo "╔══════════════════════════════════════════════╗"
echo "║   🎵 AI Music School Academy Manager 🎵     ║"
echo "╠══════════════════════════════════════════════╣"
echo "║         Starting Application...              ║"
echo "╚══════════════════════════════════════════════╝"
echo -e "${NC}"

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR"

# Load .env
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
  echo -e "${GREEN}✓ Environment variables loaded${NC}"
else
  echo -e "${RED}✗ .env file not found! Creating default...${NC}"
  cat > .env << 'ENVEOF'
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/music_school
JWT_SECRET=music-school-secret-key-2024
OPENROUTER_API_KEY=your-openrouter-key-here
OPENROUTER_MODEL=anthropic/claude-haiku-4.5
BACKEND_PORT=4001
FRONTEND_PORT=3001
ENVEOF
  export $(grep -v '^#' .env | xargs)
fi

# ============================================
# Step 1: Clean used ports
# ============================================
echo -e "\n${YELLOW}[1/6] Cleaning used ports...${NC}"

cleanup_port() {
  local port=$1
  local pids=$(lsof -ti :$port 2>/dev/null || true)
  if [ -n "$pids" ]; then
    echo -e "  Killing processes on port $port: $pids"
    echo "$pids" | xargs kill -9 2>/dev/null || true
    sleep 1
  fi
}

cleanup_port ${BACKEND_PORT:-4001}
cleanup_port ${FRONTEND_PORT:-3001}
echo -e "${GREEN}✓ Ports cleaned${NC}"

# ============================================
# Step 2: Check PostgreSQL
# ============================================
echo -e "\n${YELLOW}[2/6] Checking PostgreSQL...${NC}"

if command -v pg_isready &> /dev/null; then
  if pg_isready -q 2>/dev/null; then
    echo -e "${GREEN}✓ PostgreSQL is running${NC}"
  else
    echo -e "${YELLOW}  Starting PostgreSQL...${NC}"
    if command -v brew &> /dev/null; then
      brew services start postgresql@14 2>/dev/null || brew services start postgresql 2>/dev/null || true
    fi
    sleep 2
    if pg_isready -q 2>/dev/null; then
      echo -e "${GREEN}✓ PostgreSQL started${NC}"
    else
      echo -e "${RED}✗ Could not start PostgreSQL. Please start it manually.${NC}"
      exit 1
    fi
  fi
else
  echo -e "${YELLOW}  pg_isready not found, assuming PostgreSQL is running${NC}"
fi

# Create database if it doesn't exist
echo -e "  Creating database if needed..."
createdb music_school 2>/dev/null || echo -e "  Database already exists"
echo -e "${GREEN}✓ Database ready${NC}"

# ============================================
# Step 3: Install Backend Dependencies
# ============================================
echo -e "\n${YELLOW}[3/6] Installing backend dependencies...${NC}"
cd "$PROJECT_DIR/backend"
if [ ! -d "node_modules" ]; then
  npm install
else
  echo -e "  node_modules exists, checking for updates..."
  npm install --silent 2>/dev/null
fi
echo -e "${GREEN}✓ Backend dependencies installed${NC}"

# ============================================
# Step 4: Install Frontend Dependencies
# ============================================
echo -e "\n${YELLOW}[4/6] Installing frontend dependencies...${NC}"
cd "$PROJECT_DIR/frontend"
if [ ! -d "node_modules" ]; then
  npm install
else
  echo -e "  node_modules exists, checking for updates..."
  npm install --silent 2>/dev/null
fi
echo -e "${GREEN}✓ Frontend dependencies installed${NC}"

# ============================================
# Step 5: Seed Database
# ============================================
echo -e "\n${YELLOW}[5/6] Seeding database...${NC}"
cd "$PROJECT_DIR/backend"
node src/seed.js
echo -e "${GREEN}✓ Database seeded with sample data${NC}"

# ============================================
# Step 6: Start Application (with hot reload)
# ============================================
echo -e "\n${YELLOW}[6/6] Starting application...${NC}"

# Trap to clean up on exit
cleanup() {
  echo -e "\n${YELLOW}Shutting down...${NC}"
  kill $(jobs -p) 2>/dev/null || true
  cleanup_port ${BACKEND_PORT:-4001}
  cleanup_port ${FRONTEND_PORT:-3001}
  echo -e "${GREEN}✓ Application stopped${NC}"
  exit 0
}
trap cleanup SIGINT SIGTERM EXIT

# Start backend with nodemon (hot reload)
cd "$PROJECT_DIR/backend"
echo -e "${BLUE}  Starting backend on port ${BACKEND_PORT:-4001} (with hot reload)...${NC}"
npx nodemon src/server.js &
BACKEND_PID=$!

# Wait for backend to be ready
sleep 3

# Start frontend with Vite (hot reload built-in)
cd "$PROJECT_DIR/frontend"
echo -e "${BLUE}  Starting frontend on port ${FRONTEND_PORT:-3001} (with hot reload)...${NC}"
npx vite --port ${FRONTEND_PORT:-3001} &
FRONTEND_PID=$!

sleep 2

echo -e "\n${PURPLE}"
echo "╔══════════════════════════════════════════════╗"
echo "║         🎵 Application is Ready! 🎵         ║"
echo "╠══════════════════════════════════════════════╣"
echo "║                                              ║"
echo "║  Frontend: http://localhost:${FRONTEND_PORT:-3001}             ║"
echo "║  Backend:  http://localhost:${BACKEND_PORT:-4001}             ║"
echo "║                                              ║"
echo "║  Login:                                      ║"
echo "║    Email:    admin@musicschool.com            ║"
echo "║    Password: admin123                        ║"
echo "║                                              ║"
echo "║  Hot reload is enabled for both              ║"
echo "║  frontend and backend!                       ║"
echo "║                                              ║"
echo "║  Press Ctrl+C to stop                        ║"
echo "╚══════════════════════════════════════════════╝"
echo -e "${NC}"

# Wait for any process to exit
wait
