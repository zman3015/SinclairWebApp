#!/usr/bin/env node

/**
 * Netlify Deployment Helper for Dental Tech Portal
 * This script helps deploy the Next.js app to Netlify
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🦷 Dental Tech Portal - Netlify Deployment Helper\n');

// Check if netlify.toml exists
if (!fs.existsSync('netlify.toml')) {
  console.error('❌ netlify.toml not found!');
  process.exit(1);
}

// Verify build command
console.log('✓ netlify.toml found');

// Check for Netlify auth token
const authToken = process.env.NETLIFY_AUTH_TOKEN;

if (!authToken) {
  console.log('\n⚠️  NETLIFY_AUTH_TOKEN not found in environment variables.\n');
  console.log('To deploy, you have two options:\n');
  console.log('Option 1: Set your auth token');
  console.log('  export NETLIFY_AUTH_TOKEN="your-token-here"');
  console.log('  node netlify-deploy-helper.js\n');
  console.log('Option 2: Use interactive login');
  console.log('  netlify login');
  console.log('  netlify deploy --prod\n');
  console.log('Get your auth token from: https://app.netlify.com/user/applications\n');
  process.exit(1);
}

try {
  console.log('\n📦 Building Next.js application...');
  execSync('bun run build', { stdio: 'inherit' });

  console.log('\n☁️  Deploying to Netlify...');
  const deployCommand = `netlify deploy --prod --auth "${authToken}"`;
  execSync(deployCommand, { stdio: 'inherit' });

  console.log('\n✅ Deployment successful!');
} catch (error) {
  console.error('\n❌ Deployment failed:', error.message);
  process.exit(1);
}
