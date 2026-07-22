import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// The frontend calls the API at /api/*. In dev, Vite proxies those requests to
// the Express server so there is no CORS dance and no hard-coded host in the
// client code.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3050,
    proxy: {
      "/api": {
        target: "http://localhost:8787",
        changeOrigin: true,
      },
    },
  },
});
