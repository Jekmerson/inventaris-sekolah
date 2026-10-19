function getDeviceId() {
  try {
    const { machineIdSync } = require('node-machine-id');
    return machineIdSync(true);
  } catch (err) {
    console.error('[DeviceId] Error getting machine ID:', err.message);
    // Fallback: generate a hash from OS info
    const os = require('os');
    const crypto = require('crypto');
    const info = `${os.hostname()}-${os.platform()}-${os.arch()}-${os.cpus()[0]?.model || 'unknown'}`;
    return crypto.createHash('sha256').update(info).digest('hex').substring(0, 32);
  }
}

module.exports = { getDeviceId };
