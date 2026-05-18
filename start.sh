#!/bin/bash

# BeeKeeper's Log One-Click Starter
# This script ensures dependencies are installed, the app is built, and the server starts.

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR"

echo "🐝 Starting BeeKeeper's Log..."

# 1. Ensure all dependencies are installed using npm
echo "📦 Checking/Installing dependencies..."
npm run install-all

# 2. Ensure database is ready
echo "🗄️ Checking database..."
cd packages/api
if [ ! -f "prisma/dev.db" ]; then
    echo "🚀 Initializing database..."
    npx prisma db push
    npm run seed
else
    npx prisma db push --skip-generate
fi
cd ../..

# 4. Build UI if missing
if [ ! -d "packages/ui/dist" ]; then
    echo "🏗️ Building frontend (this may take a minute)..."
    npm run build
fi

# 5. Start the application
echo "🚀 BeeKeeper's Log is ready! Access it at http://localhost:3001"
npm start
