const http = require('http');
const fs = require('fs');
const path = require('path');

const port = Number(process.env.PORT || 5000);
const host = '0.0.0.0';
const root = __dirname;
const allowedRoots = new Set(['my-data', 'blog']);
const allowedFiles = new Set(['index.html', 'mobile.html', 'resume.html', 'site.js']);
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.pdf': 'application/pdf',
  '.ico': 'image/x-icon'
};

function getSafePath(urlPath) {
  const pathname = decodeURIComponent(urlPath.split('?')[0]);
  const normalized = path.normalize(pathname).replace(/^[/\\]+/, '');
  let requested = normalized === '' ? 'index.html' : normalized;
  if (requested === 'blog') requested = 'blog/index.html';
  else if (/^blog\/(?:articles\/|topics\/)?[a-z0-9-]+$/.test(requested)) requested += '.html';
  const firstSegment = requested.split(/[\\/]/)[0];

  if (!allowedFiles.has(requested) && !allowedRoots.has(firstSegment)) {
    return null;
  }

  const absolutePath = path.join(root, requested);
  if (!absolutePath.startsWith(root + path.sep)) {
    return null;
  }

  return absolutePath;
}

const server = http.createServer((req, res) => {
  if (!['GET', 'HEAD'].includes(req.method)) {
    res.writeHead(405, { Allow: 'GET, HEAD' });
    res.end('Method Not Allowed');
    return;
  }

  let filePath;
  try {
    filePath = getSafePath(req.url || '/');
  } catch {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Bad Request');
    return;
  }

  if (!filePath) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not Found');
    return;
  }

  fs.stat(filePath, (statError, stats) => {
    if (statError || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const headers = {
      'Content-Type': mimeTypes[ext] || 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Cache-Control': process.env.NODE_ENV === 'production' ? 'public, max-age=3600' : 'no-store'
    };

    res.writeHead(200, headers);
    if (req.method === 'HEAD') {
      res.end();
      return;
    }

    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(port, host, () => {
  console.log(`Portfolio site running on http://${host}:${port}`);
});

