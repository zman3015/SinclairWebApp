#!/bin/bash

# Dental Tech Portal - Netlify Deployment Script
# This script deploys the Next.js application to Netlify

set -e

echo "🚀 Starting Netlify deployment for Dental Tech Portal..."

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "Installing Netlify CLI..."
    bun install -g netlify-cli
    export PATH="/home/same/.bun/bin:$PATH"
fi

# Build the project
echo "📦 Building Next.js application..."
bun run build

# Deploy to Netlify
echo "☁️  Deploying to Netlify..."
if [ -z "$NETLIFY_AUTH_TOKEN" ]; then
    echo "⚠️  NETLIFY_AUTH_TOKEN not found. Using interactive login..."
    netlify deploy --prod
else
    echo "✓ Using NETLIFY_AUTH_TOKEN for authentication..."
    netlify deploy --prod --auth "$NETLIFY_AUTH_TOKEN"
fi

echo "✅ Deployment complete!"
