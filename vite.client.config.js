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
          # Modify vite.config.ts temporarily for GitHub Pages
          sed -i 's|outDir: path.resolve(__dirname, "dist/public"),|outDir: path.resolve(__dirname, "dist"),|' vite.config.ts
          
          # Add .nojekyll file to prevent Jekyll processing
          touch .nojekyll
          
          # Run the build with the original config
          npm run build
          
          # Make sure we have an index.html at the root level of the output
          if [ ! -f "dist/index.html" ]; then
            cp dist/public/index.html dist/
          fi
          
          # Copy the .nojekyll file to the dist directory
          cp .nojekyll dist/
          
      - name: Deploy to GitHub Pages
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: dist
          branch: gh-pages
          clean: true
