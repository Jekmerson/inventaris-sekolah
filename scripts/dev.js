const { spawn } = require('child_process');
const net = require('net');
const path = require('path');

console.log('🚀 Memulai Inventaris Sekolah Development Mode...');

// 1. Jalankan React Dev Server
const reactProcess = spawn(
  process.platform === 'win32' ? 'npm.cmd' : 'npm',
  ['run', 'react-start'],
  {
    cwd: path.resolve(__dirname, '..'),
    env: { ...process.env, BROWSER: 'none', PORT: '3000' },
    stdio: 'inherit',
    shell: true
  }
);

// 2. Fungsi polling port 3000
function checkPort(port, host, timeout = 1000) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let isConnected = false;

    socket.setTimeout(timeout);
    socket.once('connect', () => {
      isConnected = true;
      socket.destroy();
      resolve(true);
    });

    socket.once('timeout', () => {
      socket.destroy();
      resolve(false);
    });

    socket.once('error', () => {
      resolve(false);
    });

    socket.connect(port, host);
  });
}

async function waitForReactAndStartElectron() {
  console.log('⏳ Menunggu React Dev Server siap di http://127.0.0.1:3000...');
  const maxAttempts = 60; // 60 detik max
  let attempts = 0;

  while (attempts < maxAttempts) {
    const isReady = await checkPort(3000, '127.0.0.1', 800);
    if (isReady) {
      console.log('✅ React Dev Server siap! Meluncurkan Electron Desktop Window...');
      break;
    }
    attempts++;
    await new Promise((r) => setTimeout(r, 1000));
  }

  // 3. Jalankan Electron
  const electronProcess = spawn(
    process.platform === 'win32' ? 'npx.cmd' : 'npx',
    ['electron', '.'],
    {
      cwd: path.resolve(__dirname, '..'),
      env: { ...process.env, NODE_ENV: 'development' },
      stdio: 'inherit',
      shell: true
    }
  );

  electronProcess.on('close', () => {
    console.log('Jendela Electron ditutup. Menghentikan dev server...');
    try {
      if (process.platform === 'win32') {
        spawn('taskkill', ['/pid', reactProcess.pid, '/f', '/t']);
      } else {
        reactProcess.kill('SIGINT');
      }
    } catch (e) {}
    process.exit(0);
  });
}

waitForReactAndStartElectron();
