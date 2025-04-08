import { defineConfig, loadEnv } from "vite"; // Import loadEnv
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Use function form to access mode
  // Load env variables based on the mode (e.g., development, production)
  // Loads .env, .env.[mode], .env.local, .env.[mode].local
  const env = loadEnv(mode, process.cwd(), ""); // process.cwd() gets root dir, '' loads all vars without VITE_ prefix requirement here

  const apiTarget = env.VITE_API_TARGET_URL; // Get your specific variable

  if (!apiTarget) {
    console.error(
      "ERROR: VITE_API_TARGET_URL is not defined in your .env file!"
    );
    // You might want to throw an error or default, but erroring is safer
    throw new Error(
      "VITE_API_TARGET_URL environment variable is required for API proxy."
    );
  }
  console.log(`Proxying /api requests to: ${apiTarget}`); // Log for confirmation

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: 5173,
      proxy: {
        "/api": {
          target: apiTarget, // Use the loaded variable
          changeOrigin: true,
          secure: false,
          // rewrite: (path) => path.replace(/^\/api/, '') // Usually not needed if backend expects /api
        },
      },
    },
  };
});
