const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

function logger(req, res, next) {
  const start = Date.now();
  const timestamp = new Date().toISOString();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logEntry = `[${timestamp}] ${req.method} ${req.path} ${res.statusCode} ${duration}ms`;
    
    // Console log in development
    if (process.env.NODE_ENV === 'development') {
      const color = res.statusCode >= 400 ? '\x1b[31m' : '\x1b[32m';
      console.log(`${color}${logEntry}\x1b[0m`);
    }

    // File log
    const logFile = path.join(logDir, 'app.log');
    fs.appendFile(logFile, logEntry + '\n', (err) => {
      if (err) console.error('Log write error:', err.message);
    });
  });

  next();
}

module.exports = { logger };
