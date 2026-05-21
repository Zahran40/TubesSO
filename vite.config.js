import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

const historyApiPlugin = () => {
  return {
    name: 'history-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/api/history') {
          const dataDir = path.resolve(__dirname, 'data');
          const historyFile = path.resolve(dataDir, 'history.json');

          // Ensure data dir exists
          if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir);
          }
          if (!fs.existsSync(historyFile)) {
            fs.writeFileSync(historyFile, JSON.stringify([]));
          }

          if (req.method === 'GET') {
            res.setHeader('Content-Type', 'application/json');
            const data = fs.readFileSync(historyFile, 'utf-8');
            res.end(data);
            return;
          }

          if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
              body += chunk.toString();
            });
            req.on('end', () => {
              try {
                const newEntry = JSON.parse(body);
                const existingData = JSON.parse(fs.readFileSync(historyFile, 'utf-8'));
                // add unique ID and date
                newEntry.id = '#SIM-' + Math.random().toString(36).substr(2, 6).toUpperCase();
                newEntry.date = new Date().toISOString();
                
                existingData.unshift(newEntry); // Add to beginning
                fs.writeFileSync(historyFile, JSON.stringify(existingData, null, 2));
                
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, entry: newEntry }));
              } catch (err) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: err.message }));
              }
            });
            return;
          }
        }
        next();
      });
    }
  }
}

export default defineConfig({
  plugins: [react(), historyApiPlugin()],
  server: {
    port: 5173,
    open: true
  }
})
