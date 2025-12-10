#!/bin/bash

# Configuration Verification Script for Netlify Deployment

echo "🔍 Verifying Dental Tech Portal configuration for Netlify..."
echo ""

# Check netlify.toml
if [ -f "netlify.toml" ]; then
    echo "✓ netlify.toml exists"

    # Check publish directory
    if grep -q 'publish = "."' netlify.toml; then
        echo "✓ Publish directory correctly set to '.'"
    else
        echo "❌ Publish directory not set correctly (should be '.')"
    fi

    # Check plugin
    if grep -q '@netlify/plugin-nextjs' netlify.toml; then
        echo "✓ Netlify Next.js plugin configured"
    else
        echo "❌ Netlify Next.js plugin not configured"
    fi
else
    echo "❌ netlify.toml not found"
fi

# Check next.config.js
if [ -f "next.config.js" ]; then
    echo "✓ next.config.js exists"
else
    echo "❌ next.config.js not found"
fi

# Check package.json
if [ -f "package.json" ]; then
    echo "✓ package.json exists"

    # Check build script
    if grep -q '"build"' package.json; then
        echo "✓ Build script defined"
    fi
else
    echo "❌ package.json not found"
fi

# Check if build works
echo ""
echo "📦 Testing build..."
if bun run build > /dev/null 2>&1; then
    echo "✓ Build successful"
else
    echo "❌ Build failed - run 'bun run build' to see errors"
fi

echo ""
echo "✅ Configuration verification complete!"
echo ""
echo "To deploy to Netlify:"
echo "  1. Run: netlify login"
echo "  2. Run: netlify deploy --prod"
echo ""
echo "Or use the helper script:"
echo "  ./deploy.sh"
