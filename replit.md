# E-Commerce React + Vite Application

## Overview
This is a React application built with Vite. It's a fresh GitHub import that has been configured to run in the Replit environment.

**Project Name:** e-commerce  
**Type:** Frontend React Application  
**Framework:** Vite v7.2.4 with React v19.2.0  
**Current State:** Running successfully on port 5000

## Recent Changes
- **November 25, 2025**: Initial Replit environment setup
  - Configured Vite to run on port 5000 with host 0.0.0.0
  - Added allowedHosts: true for Replit proxy compatibility
  - Installed all npm dependencies
  - Set up workflow for frontend server
  - Configured deployment settings

## Project Architecture

### Tech Stack
- **Frontend Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Language**: JavaScript (JSX)
- **Styling**: CSS

### Directory Structure
```
.
├── public/          # Static assets
├── src/
│   ├── assets/      # React and Vite logos
│   ├── App.jsx      # Main app component
│   ├── App.css      # App styles
│   ├── main.jsx     # Entry point
│   └── index.css    # Global styles
├── index.html       # HTML template
├── vite.config.js   # Vite configuration
├── package.json     # Dependencies
└── eslint.config.js # ESLint configuration
```

### Configuration
- **Dev Server**: Runs on 0.0.0.0:5000 with allowedHosts enabled for Replit
- **Workflow**: "Start application" runs `npm run dev`
- **Build Output**: dist/ directory (gitignored)

## Development

### Available Scripts
- `npm run dev` - Start development server (port 5000)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Running Locally
The application is configured to run automatically via the "Start application" workflow.

## Deployment
Configured for Autoscale deployment with production build optimization.
