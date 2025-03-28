import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173, // Or whatever your frontend runs on (optional)
    proxy: {
      // Requests starting with /api will be forwarded
      "/api": {
        target: "http://localhost:5001", // <-- YOUR BACKEND SERVER
        changeOrigin: true, // Recommended for virtual hosted sites
        secure: false, // Optional: If backend uses self-signed certs (usually false for http)
        // ws: true,       // Optional: If you need WebSocket proxying
        // You likely DON'T need a rewrite if your backend routes already include /api
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
