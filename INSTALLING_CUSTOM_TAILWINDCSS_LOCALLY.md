# Installing Custom Saulwind CSS Locally

This guide explains how to set up a custom local version of Tailwind CSS in a Vite + React project.

## Prerequisites

- Node.js and npm installed
- A local Tailwind CSS compatible package (e.g., `tailwindcss-3.1.0.tgz`)

## Installation Steps

cd YourProjects
git clone https://github.com/kajackdfw/saulwindcss.git ( saulwindcss folder )
cd ../yourNewReactApp

### 1. Install Dependencies

In your `package.json`, add the following dependencies:

```json
{
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "tailwindcss": "file:../saulwindcss/dist/3.4.0/tailwindcss-3.4.0.tgz"
  },
  "devDependencies": {
    "autoprefixer": "^10.4.23",
    "postcss": "^8.5.6",
    "postcss-cli": "^11.0.1",
    "vite": "^7.2.4",
    "@vitejs/plugin-react": "^5.1.1"
  }
}
```

Run `npm install` to install all dependencies.

### 2. Create Tailwind Configuration

Create `tailwind.config.cjs` (note the `.cjs` extension if your package.json has `"type": "module"`):

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 3. Create PostCSS Configuration

Create `postcss.config.cjs` (note the `.cjs` extension):

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### 4. Add Tailwind Directives to CSS

In your `src/index.css` file, add the Tailwind directives at the top:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Your custom styles below */
body {
  margin: 0;
  font-family: system-ui, -apple-system, sans-serif;
}
```

### 5. Import CSS in Your App

Make sure your `src/main.jsx` imports the CSS file:

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'  // This line is important!
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

## Important: ES Module vs CommonJS

If your `package.json` contains `"type": "module"`, you **must** use `.cjs` extension for your config files:

- ✅ `tailwind.config.cjs` with `module.exports = { ... }`
- ✅ `postcss.config.cjs` with `module.exports = { ... }`
- ❌ `tailwind.config.js` with `export default { ... }` will fail
- ❌ `postcss.config.js` with `module.exports = { ... }` will fail

This is because PostCSS and Tailwind v3.1.0 require CommonJS format, and when your project is set to ES modules, you need to explicitly use the `.cjs` extension.

## Verification

### Test the Build

```bash
npm run build
```

You should see:
- No warnings about missing content configuration
- CSS file size that includes all your Tailwind utilities (typically 5+ KB)

### Start the Dev Server

```bash
npm run dev
```

Then open your browser and check that Tailwind utility classes are working (e.g., `bg-blue-500`, `rounded-lg`, etc.).

## Usage Example

```jsx
function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">My App</h1>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1>Welcome</h1>
        </div>
      </div>
    </div>
  )
}
```
