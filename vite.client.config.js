name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm install
          
      - name: Build Project
        run: |
          # Modify vite.config.ts for GitHub Pages
          cat > vite.config.ts << 'EOL'
          import { defineConfig } from "vite";
          import react from "@vitejs/plugin-react";
          import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
          import path, { dirname } from "path";
          import { fileURLToPath } from "url";

          const __filename = fileURLToPath(import.meta.url);
          const __dirname = dirname(__filename);

          export default defineConfig({
            base: '/RPN-Trainer/',
            plugins: [
              react(),
              themePlugin(),
            ],
            resolve: {
              alias: {
                "@": path.resolve(__dirname, "client", "src"),
                "@shared": path.resolve(__dirname, "shared"),
              },
            },
            root: path.resolve(__dirname, "client"),
            build: {
              outDir: path.resolve(__dirname, "dist"),
              emptyOutDir: true,
            },
          });
          EOL
          
          # Create .nojekyll file
          touch .nojekyll
          
          # Build the project
          npm run build
          
          # Copy .nojekyll to dist directory
          cp .nojekyll dist/
          
      - name: Deploy to GitHub Pages
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: dist
          branch: gh-pages
          clean: true
