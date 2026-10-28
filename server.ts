import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Persistent Real Visitor Counter storage
const DATA_DIR = path.join(__dirname, 'data');
const VISITORS_FILE = path.join(DATA_DIR, 'visitors.json');

interface VisitorData {
  totalVisitors: number;
  uniqueVisitors: number;
  visitorIps: string[];
  lastUpdated: string;
}

function getVisitorData(): VisitorData {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(VISITORS_FILE)) {
      const content = fs.readFileSync(VISITORS_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (typeof parsed.totalVisitors === 'number') {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading visitor file:', err);
  }
  return {
    totalVisitors: 1,
    uniqueVisitors: 1,
    visitorIps: [],
    lastUpdated: new Date().toISOString(),
  };
}

function saveVisitorData(data: VisitorData) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(VISITORS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving visitor file:', err);
  }
}

// Real Visitor Counter Endpoints
app.get('/api/visitors', (_req, res) => {
  const data = getVisitorData();
  res.json({
    totalVisitors: data.totalVisitors,
    uniqueVisitors: data.uniqueVisitors,
  });
});

app.post('/api/visitors/hit', (req, res) => {
  const data = getVisitorData();
  const clientIp =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
    req.socket.remoteAddress ||
    'unknown';
  const visitorToken = req.body?.visitorToken || '';
  const identifier = visitorToken ? `token:${visitorToken}` : `ip:${clientIp}`;

  const isNew = !data.visitorIps.includes(identifier);
  if (isNew) {
    data.uniqueVisitors += 1;
    if (data.visitorIps.length > 2000) {
      data.visitorIps.shift();
    }
    data.visitorIps.push(identifier);
  }
  data.totalVisitors += 1;
  data.lastUpdated = new Date().toISOString();
  saveVisitorData(data);

  res.json({
    totalVisitors: data.totalVisitors,
    uniqueVisitors: data.uniqueVisitors,
    isNew,
  });
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
