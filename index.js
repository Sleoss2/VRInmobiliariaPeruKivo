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
  // In-memory storage for analytics (in production, use a database)
  const analyticsStore = {
    sessions: [],
    interactions: [],
    gestures: [],
    performance: []
  };

  Bun.serve({
    port: 3000,
    async fetch(req) {
      const url = new URL(req.url, `http://${req.headers.get('host') || 'localhost:3000'}`);

      // ===== API ROUTES =====
      
      // POST /api/analytics/session - Start analytics session
      if (req.method === 'POST' && url.pathname === '/api/analytics/session') {
        const data = await req.json();
        const session = {
          id: data.sessionId || `session_${Date.now()}`,
          startTime: Date.now(),
          userAgent: req.headers.get('user-agent'),
          ...data
        };
        analyticsStore.sessions.push(session);
        return new Response(JSON.stringify({ success: true, sessionId: session.id }), {
          status: 201,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // POST /api/analytics/interactions - Log interactions
      if (req.method === 'POST' && url.pathname === '/api/analytics/interactions') {
        const data = await req.json();
        analyticsStore.interactions.push({
          timestamp: Date.now(),
          ...data
        });
        return new Response(JSON.stringify({ success: true, count: analyticsStore.interactions.length }), {
          status: 201,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // POST /api/analytics/gestures - Log gestures
      if (req.method === 'POST' && url.pathname === '/api/analytics/gestures') {
        const data = await req.json();
        analyticsStore.gestures.push({
          timestamp: Date.now(),
          ...data
        });
        return new Response(JSON.stringify({ success: true }), {
          status: 201,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // POST /api/analytics/performance - Log performance metrics
      if (req.method === 'POST' && url.pathname === '/api/analytics/performance') {
        const data = await req.json();
        analyticsStore.performance.push({
          timestamp: Date.now(),
          ...data
        });
        return new Response(JSON.stringify({ success: true }), {
          status: 201,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // GET /api/analytics/summary - Get analytics summary
      if (req.method === 'GET' && url.pathname === '/api/analytics/summary') {
        const summary = {
          totalSessions: analyticsStore.sessions.length,
          totalInteractions: analyticsStore.interactions.length,
          totalGestures: analyticsStore.gestures.length,
          performanceMetrics: analyticsStore.performance.length,
          lastUpdated: Date.now()
        };
        return new Response(JSON.stringify(summary), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // GET /api/analytics/data - Export all analytics data
      if (req.method === 'GET' && url.pathname === '/api/analytics/data') {
        return new Response(JSON.stringify(analyticsStore, null, 2), {
          status: 200,
          headers: { 
            'Content-Type': 'application/json',
            'Content-Disposition': 'attachment; filename="analytics-export.json"'
          }
        });
      }

      // ===== STATIC FILE SERVING =====
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
  console.log('DreamHome Real Estate VR Experience running at http://localhost:3000');
  console.log('API endpoints:');
  console.log('  POST   /api/analytics/session');
  console.log('  POST   /api/analytics/interactions');
  console.log('  POST   /api/analytics/gestures');
  console.log('  POST   /api/analytics/performance');
  console.log('  GET    /api/analytics/summary');
  console.log('  GET    /api/analytics/data');
} else {
  console.log('This script is intended to run with Bun. Start with `bun index.js` or `bun run start`.');
}
