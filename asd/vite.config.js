import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import chokidar from 'chokidar'
import { WebSocketServer } from 'ws'

// Create a WebSocket server on a different port and do not crash if already in use.
const ws = new WebSocketServer({ port: 5175 });
let connectedSocket = null;

ws.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.warn('WebSocket port 5175 already in use. Continuing without live image notifications.');
    return;
  }
  console.error('WebSocket server error:', err);
});

ws.on('connection', (socket) => {
  console.log('WebSocket client connected');
  connectedSocket = socket;
  socket.on('close', () => {
    console.log('WebSocket client disconnected');
    connectedSocket = null;
  });
});

// Watch for file changes in the public images directory
chokidar.watch('public/images/questions').on('all', (event, path) => {
  if (connectedSocket && (event === 'add' || event === 'change' || event === 'unlink')) {
    console.log('File has been changed:', path);
    connectedSocket.send(JSON.stringify({ type: 'file-change', path }));
  }
});

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    fs: {
      // Allow serving files from the root directory
      allow: ['./'],
    },
  },
});
