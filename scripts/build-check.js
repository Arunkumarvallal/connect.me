#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('Running build...\n');

try {
  execSync('npm run build', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  console.log('\n✓ Build successful!');
  process.exit(0);
} catch (error) {
  console.error('\n✗ Build failed!');
  process.exit(1);
}
