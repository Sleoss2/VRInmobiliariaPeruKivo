// Bun HTTP server for DreamHome Real Estate landing page
// Run with: `bun index.js` or `bun run start`
const fs = require('fs');
const path = require('path');

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp',
    '.txt': 'text/plain',
  }[ext] || 'application/octet-stream';
}

if (typeof Bun !== 'undefined' && Bun.serve) {
  Bun.serve({
    port: 3000,
    async fetch(req) {
      const url = new URL(req.url, `http://${req.headers.get('host') || 'localhost:3000'}`);
      let filePath;
      if (url.pathname === '/') {
        filePath = path.join(__dirname, 'public', 'index.html');
      } else {
        // Serve static files from public/
        filePath = path.join(__dirname, 'public', url.pathname);
      }
      try {
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          const data = fs.readFileSync(filePath);
          return new Response(data, {
            status: 200,
            headers: { 'Content-Type': getMimeType(filePath) },
          });
        } else if (url.pathname === '/') {
          return new Response('Landing page not found.', { status: 404 });
        } else {
          // Fallback to index.html for unknown routes (SPA style)
          const html = fs.readFileSync(path.join(__dirname, 'public', 'index.html'), 'utf8');
          return new Response(html, {
            status: 200,
            headers: { 'Content-Type': 'text/html' },
          });
        }
      } catch (err) {
        return new Response('Internal server error', { status: 500 });
      }
    },
  });
  console.log('DreamHome Real Estate landing page running at http://localhost:3000');
} else {
  console.log('This script is intended to run with Bun. Start with `bun index.js` or `bun run start`.');
}
