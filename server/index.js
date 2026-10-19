const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const { initDatabase } = require('./config/db');
const { corsOptions } = require('./config/corsConfig');
const { errorHandler } = require('./middleware/errorHandler');
const { logger } = require('./middleware/logger');
const routes = require('./routes');
const { startAutoBackup } = require('./utils/backup');

async function startServer() {
  try {
    // Initialize database
    await initDatabase();

    const app = express();
    const PORT = process.env.PORT || 3001;

      // Middleware
      app.use(cors(corsOptions));
      app.use(express.json());
      app.use(express.urlencoded({ extended: true }));
      app.use(logger);

      // API Routes
      app.use('/api', routes);

      // Health check
      app.get('/health', (req, res) => {
        res.json({ status: 'ok', timestamp: new Date().toISOString() });
      });

      // Serve static frontend build if present (for single-service deployment)
      const buildPath = path.join(__dirname, '..', 'build');
      if (fs.existsSync(buildPath)) {
        app.use(express.static(buildPath));
        app.get('*', (req, res, next) => {
          if (req.path.startsWith('/api') || req.path === '/health') {
            return next();
          }
          res.sendFile(path.join(buildPath, 'index.html'));
        });
      }

      // Error handler (must be last)
      app.use(errorHandler);

      return new Promise((resolve, reject) => {
        const server = app.listen(PORT, () => {
          console.log(`[Server] Running on port ${PORT}`);
          startAutoBackup();
          resolve(app);
        });

        server.on('error', (err) => {
          if (err.code === 'EADDRINUSE') {
            console.log(`[Server] Port ${PORT} already in use, trying ${PORT + 1}`);
            const fallbackServer = app.listen(PORT + 1, () => {
              console.log(`[Server] Running on fallback port ${PORT + 1}`);
              startAutoBackup();
              resolve(app);
            });
            fallbackServer.on('error', reject);
          } else {
            reject(err);
          }
        });
      });
  } catch (err) {
    throw err;
  }
}

if (require.main === module) {
  startServer().catch((err) => {
    console.error('Fatal Server Error:', err);
    process.exit(1);
  });
}

module.exports = startServer;
