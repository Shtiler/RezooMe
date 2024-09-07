import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 80,  // Set Vite to listen on port 80
    host: true,  // Enable external access (e.g., for LAN or public access)
    strictPort: true  // Prevent fallback to a different port if 80 is in use
  }
});
