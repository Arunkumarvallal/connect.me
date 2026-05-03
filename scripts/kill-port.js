#!/usr/bin/env node

/**
 * Cross-platform script to kill processes running on a specific port
 * Works on Windows (CMD, PowerShell) and macOS/Linux (zsh, bash)
 * 
 * Usage: node scripts/kill-port.js <port>
 * Example: node scripts/kill-port.js 9002
 */

const { execSync } = require('child_process');
const port = process.argv[2];

if (!port) {
  console.error('Error: Port number required');
  console.error('Usage: node scripts/kill-port.js <port>');
  process.exit(1);
}

if (!/^\d+$/.test(port)) {
  console.error(`Error: Invalid port number: ${port}`);
  process.exit(1);
}

try {
  // Cross-platform port killing
  if (process.platform === 'win32') {
    try {
      // Windows: use netstat to find PID, then taskkill
      const netstat = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf8' });
      const lines = netstat.trim().split('\n').filter(Boolean);
      const pids = new Set();
      
      lines.forEach(line => {
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        if (pid && /^\d+$/.test(pid)) {
          pids.add(pid);
        }
      });
      
      if (pids.size === 0) {
        console.log(`No process found on port ${port}`);
      } else {
        pids.forEach(pid => {
          try {
            execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
            console.log(`✓ Killed process ${pid} on port ${port}`);
          } catch (e) {
            // Process already dead or access denied
          }
        });
        // Small delay to allow OS to release the port
        execSync('timeout /t 2 /nobreak >nul 2>&1 || sleep 2', { stdio: 'ignore' });
      }
    } catch (e) {
      // No process found on port (netstat returns non-zero)
      console.log(`No process found on port ${port}`);
    }
  } else {
    // macOS/Linux: use lsof
    try {
      const result = execSync(`lsof -ti:${port}`, { encoding: 'utf8' });
      const pids = result.trim().split('\n').filter(Boolean);
      
      if (pids.length === 0) {
        console.log(`No process found on port ${port}`);
      } else {
        pids.forEach(pid => {
          try {
            execSync(`kill -9 ${pid}`, { stdio: 'ignore' });
            console.log(`✓ Killed process ${pid} on port ${port}`);
          } catch (e) {
            // Process already dead
          }
        });
      }
    } catch (e) {
      // No process found on port (lsof returns non-zero)
      console.log(`No process found on port ${port}`);
    }
  }
} catch (error) {
  // Ignore unexpected errors
  console.error(`Error: ${error.message}`);
}

process.exit(0);

