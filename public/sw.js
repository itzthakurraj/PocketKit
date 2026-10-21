// PocketKit PWA Service Worker
// Enforces online requirement to ensure Google AdSense advertisement revenue
const CACHE_NAME = 'pocketkit-pwa-v1';
const CORE_SHELL_ASSETS = [
  '/',
  '/manifest.json',
  '/pocketkit-icon.svg',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_SHELL_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Network-first policy with strict offline blocking for tools
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Allow AdSense scripts and ad network calls
  if (url.origin.includes('google') || url.origin.includes('pagead2') || url.origin.includes('doubleclick')) {
    return;
  }

  // Handle navigation requests (loading pages)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(async () => {
        // When offline, do NOT serve cached tools that bypass ads
        return new Response(
          `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PocketKit - Internet Connection Required</title>
  <style>
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0f172a;
      color: #f8fafc;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 24px;
      box-sizing: border-box;
      text-align: center;
    }
    .card {
      max-width: 480px;
      background: #1e293b;
      border: 1px solid #334155;
      padding: 32px 24px;
      border-radius: 20px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.5);
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      font-size: 11px;
      font-weight: 700;
      color: #f59e0b;
      background: rgba(245, 158, 11, 0.15);
      border: 1px solid rgba(245, 158, 11, 0.3);
      border-radius: 999px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 16px;
    }
    h1 {
      font-size: 22px;
      margin: 0 0 12px 0;
      font-weight: 800;
    }
    p {
      font-size: 14px;
      line-height: 1.6;
      color: #94a3b8;
      margin: 0 0 20px 0;
    }
    .btn {
      display: inline-block;
      padding: 12px 28px;
      font-size: 14px;
      font-weight: 700;
      color: #ffffff;
      background: #4f46e5;
      border-radius: 12px;
      text-decoration: none;
      cursor: pointer;
      border: none;
    }
    .btn:hover {
      background: #4338ca;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">Connection Required</div>
    <h1>Internet Connection Required</h1>
    <p>PocketKit provides 70+ professional productivity tools 100% free forever, supported by Google AdSense sponsored advertisements.</p>
    <p>To support our free service and ensure sponsors can display advertisements, an active internet connection is required to use PocketKit.</p>
    <button class="btn" onclick="window.location.reload()">Check Connection &amp; Retry</button>
  </div>
</body>
</html>`,
          {
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
            status: 503,
            statusText: 'Service Unavailable - Online Connection Required'
          }
        );
      })
    );
    return;
  }

  // All other requests: Network-first
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
