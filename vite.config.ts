import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const appBase = process.env.VITE_APP_BASE || "/";

export default defineConfig({
  // Default to root-domain deployment; override with VITE_APP_BASE when using a subpath.
  base: appBase,
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        '404': path.resolve(__dirname, '404.html'),
      },
    },
  },
});