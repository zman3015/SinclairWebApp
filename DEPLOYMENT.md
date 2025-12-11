# Dental Tech Portal - Netlify Deployment Guide

## Configuration Status ✅

Your Next.js 15 application is now properly configured for Netlify deployment as a **dynamic site**. The following files have been configured:

### 1. netlify.toml
```toml
[images]
  remote_images = ["https://source.unsplash.com/.*", "https://images.unsplash.com/.*", "https://ext.same-assets.com/.*", "https://ugc.same-assets.com/.*"]

[build]
  command = "bun run build"
  publish = "."

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

**Key Changes Made:**
- ✅ Changed `publish` from `.next` to `.` (root directory) - required for @netlify/plugin-nextjs
- ✅ Using Bun as the build command
- ✅ @netlify/plugin-nextjs enabled for dynamic routing support

### 2. Build Verification
The production build completes successfully with:
- **Static routes**: /, /inventory, /invoices, /scanner, /schedule
- **Dynamic routes**: /equipment/[id] (server-rendered on demand)
- **First Load JS**: ~101 kB shared bundle

## Deployment Options

### Option 1: Deploy via Netlify CLI (Recommended)

1. **Install Netlify CLI** (if not already installed):
   ```bash
   bun install -g netlify-cli
   ```

2. **Login to Netlify**:
   ```bash
   netlify login
   ```

3. **Deploy to Production**:
   ```bash
   cd dental-tech-portal
   netlify deploy --prod
   ```

   Or use the provided script:
   ```bash
   ./deploy.sh
   ```

### Option 2: Deploy via Netlify Dashboard

1. **Push to Git Repository**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - dental tech portal"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Connect to Netlify**:
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Connect your Git provider
   - Select your repository

3. **Build Settings** (auto-detected from netlify.toml):
   - Build command: `bun run build`
   - Publish directory: `.`
   - Functions directory: `.netlify/functions` (auto-configured by plugin)

### Option 3: Deploy with Authentication Token

If you have a Netlify auth token:

```bash
export NETLIFY_AUTH_TOKEN="your-token-here"
netlify deploy --prod --auth "$NETLIFY_AUTH_TOKEN"
```

## Environment Variables

If your application requires environment variables:

1. **Via Netlify Dashboard**:
   - Site settings → Build & deploy → Environment variables
   - Add each variable

2. **Via Netlify CLI**:
   ```bash
   netlify env:set VARIABLE_NAME "value"
   ```

## Post-Deployment Verification

After deployment, verify:
- ✅ Homepage loads correctly
- ✅ Static routes are accessible
- ✅ Dynamic route `/equipment/[id]` works with different IDs
- ✅ QR scanner functionality works
- ✅ Images load from allowed domains

## Troubleshooting

### Build Fails
- Ensure all dependencies are in `package.json`
- Check build logs for specific errors
- Verify Node.js version compatibility (18.x or higher)

### Plugin Issues
- The @netlify/plugin-nextjs is automatically installed by Netlify
- No need to add it to package.json dependencies

### Dynamic Routes Not Working
- Verify `publish = "."` in netlify.toml (not `.next`)
- Ensure @netlify/plugin-nextjs is listed in plugins

## Next.js 15 Compatibility

This project uses Next.js 15.3.2 with:
- App Router (src/app directory)
- Dynamic routes with [id] parameters
- Client-side components (use client directive)
- Server Components (default)

The @netlify/plugin-nextjs v5.x fully supports Next.js 15 and handles:
- Automatic API routes
- Middleware support
- Image optimization
- Server-side rendering (SSR)
- Static Site Generation (SSG)
- Incremental Static Regeneration (ISR)

## Contact

For deployment issues, refer to:
- [Netlify Next.js Plugin Documentation](https://github.com/netlify/next-runtime)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
