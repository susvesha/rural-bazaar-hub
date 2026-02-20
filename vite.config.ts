import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";

// Custom middleware for SPA routing
const spa = () => ({
  name: "spa-fallback",
  configureServer(server) {
    return () => {
      server.middlewares.use((req, res, next) => {
        // If the request path doesn't have a file extension and it's not a known asset
        if (!req.url.includes(".") && !req.url.includes("__vite")) {
          req.url = "/index.html";
        }
        next();
      });
    };
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), spa()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  preview: {
    port: 8080,
  },
}));
