import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  base: '/RPN-Trainer/',
  plugins: [react()],
  build: {
    outDir: path.resolve(__dirname, "assets"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: 'index.js',
        assetFileNames: 'index.css',
      }
    }
  }
});
