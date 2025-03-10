# RPN Calculator Trainer

![RPN Calculator](https://img.shields.io/badge/Calculator-RPN-blue)
![React](https://img.shields.io/badge/React-18-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6)
![License](https://img.shields.io/badge/License-MIT-green)

A web application for learning and practicing Reverse Polish Notation (RPN) calculations. This interactive tool helps users understand the stack-based approach of RPN through visualization and practice problems.

🔗 **[Try it here!](https://chefaharoni.github.io/RPN-Trainer/)**

![RPN Calculator Screenshot](https://raw.githubusercontent.com/ChefAharoni/RPN-Trainer/main/rpn-app-screenshot.png)

## 📋 Table of Contents

- [Features](#features)
- [What is RPN?](#what-is-rpn)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Running Locally](#running-locally)
  - [Building for Production](#building-for-production)
- [GitHub Pages Deployment](#github-pages-deployment)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- **Random Expression Generator**: Creates RPN expressions for practice
- **Interactive Calculator**: Validate your solutions with instant feedback
- **Stack Visualization**: See how the stack changes with each operation
- **Step-by-Step Explanation**: Understand the calculation process
- **Mobile-Friendly Design**: Practice RPN on any device

## 🧮 What is RPN?

Reverse Polish Notation (RPN) is a mathematical notation where operators follow their operands. Unlike conventional infix notation, RPN doesn't require parentheses to define order of operations.

**Example**:
- Infix: `3 + 4 * 2`
- RPN: `3 4 2 * +`

RPN uses a stack-based approach:
1. Numbers are pushed onto the stack
2. When an operator is encountered, it pops the required number of operands
3. The operator is applied to these operands
4. The result is pushed back onto the stack

## 🛠️ Technology Stack

- **Frontend**: React, TypeScript
- **UI Components**: Shadcn/UI, Tailwind CSS
- **Build Tool**: Vite
- **Routing**: Wouter (with hash-based routing for GitHub Pages)
- **Package Manager**: npm

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm (included with Node.js)

### Running Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/ChefAharoni/RPN-Trainer.git
   cd RPN-Trainer
   ```

2. Navigate to the project directory:
   ```bash
   cd RpnTrainer  # If using the subdirectory structure
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

### Building for Production

1. Build the application:
   ```bash
   npm run build
   ```

2. The built files will be in the `dist` directory.

## 🌐 GitHub Pages Deployment

This project is configured to be hosted on GitHub Pages as a static site.

### How GitHub Pages Serves This App

1. The application is built as a static site using Vite
2. The built files are pushed to the `gh-pages` branch
3. GitHub Pages serves these files from the root of this branch
4. Hash-based routing (`/#/`) is used to ensure client-side routing works

### Manual Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Copy the contents of the `dist` directory to the `gh-pages` branch:
   ```bash
   git checkout gh-pages
   git rm -rf .
   cp -r ../dist/* .
   touch .nojekyll
   git add .
   git commit -m "Update GitHub Pages"
   git push origin gh-pages
   ```

### Automated Deployment

This project can be configured with GitHub Actions for automated deployment:

1. Create a GitHub Actions workflow file (`.github/workflows/deploy.yml`):
   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: [ main ]

   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '18'
         - name: Install Dependencies
           run: |
             cd RpnTrainer
             npm ci
         - name: Build
           run: |
             cd RpnTrainer
             npm run build
         - name: Deploy
           uses: JamesIves/github-pages-deploy-action@v4
           with:
             folder: RpnTrainer/dist
             branch: gh-pages
             clean: true
   ```

2. Push this file to the main branch to trigger the deployment.

## 📁 Project Structure

```
RpnTrainer/
├── client/                  # Frontend code
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utility functions
│   │   ├── pages/           # Page components
│   │   ├── App.tsx          # Main App component
│   │   └── main.tsx         # Entry point
│   └── index.html           # HTML template
├── server/                  # Backend code (for local development)
├── shared/                  # Shared code/types
├── package.json             # Project dependencies
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
└── tailwind.config.ts       # Tailwind CSS configuration
```

## 🤝 Contributing

Contributions are welcome! Here's how you can contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests to ensure everything works
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Add comments for complex logic
- Update documentation for new features
- Write descriptive commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ by [Chef Aharoni](https://github.com/ChefAharoni)
