<h1>
  Saulwind CSS v3.4.0 (JavaScript-only Fork)
</h1>

A utility-first CSS framework for rapidly building custom user interfaces.

**Forked from** - TailwindCSS v3.0.24
**JavaScript-only version** - No Rust/Oxide dependencies required.

<p>
    <a href="https://github.com/tailwindlabs/tailwindcss/actions"><img src="https://img.shields.io/github/workflow/status/tailwindlabs/tailwindcss/Node.js%20CI" alt="Build Status"></a>
    <a href="https://www.npmjs.com/package/tailwindcss"><img src="https://img.shields.io/npm/dt/tailwindcss.svg" alt="Total Downloads"></a>
    <a href="https://github.com/tailwindcss/tailwindcss/releases"><img src="https://img.shields.io/npm/v/tailwindcss.svg" alt="Latest Release"></a>
    <a href="https://github.com/tailwindcss/tailwindcss/blob/master/LICENSE"><img src="https://img.shields.io/npm/l/tailwindcss.svg" alt="License"></a>
</p>

------

## About This Fork

**Version:** 3.4.0 (JavaScript-only fork)

This is a JavaScript-only fork of Tailwind CSS, originally based on version 3.0.24 - the last version before the Rust/Oxide engine was introduced. This fork maintains the pure JavaScript/TypeScript architecture without requiring Rust toolchain dependencies.

**Note:** Tailwind CSS v4 is a complete rewrite in Rust with the Oxide engine. This fork focuses on the JavaScript implementation with modern v3.x features.

### What's New in v3.4.0

This version includes modern CSS features from Tailwind CSS v3.4, adapted for the JavaScript-only architecture:

**Modern Viewport Units:**
- `h-dvh`, `h-svh`, `h-lvh` - Dynamic/Small/Large viewport height units
- `w-dvw`, `w-svw`, `w-lvw` - Dynamic/Small/Large viewport width units
- Better mobile browser support with viewport units that account for dynamic UI (URL bars, etc.)

**Size Utilities:**
- `size-*` - Combined width and height utilities (e.g., `size-4` sets both `width: 1rem` and `height: 1rem`)
- Supports all spacing values, fractions (`size-1/2`), and arbitrary values (`size-[200px]`)

**:has() Pseudo-Class Variant:**
- `has-[selector]:utility` - Style parents based on descendants
- Examples: `has-[:checked]:bg-blue-500`, `has-[>a]:underline`, `has-[img]:p-4`
- Modern contextual styling for parent elements

**Text Wrapping:**
- `text-balance` - Balance text across lines for better headlines
- `text-pretty` - Better text wrapping avoiding orphans and widows
- `text-wrap` / `text-nowrap` - Standard wrapping controls

**CSS Subgrid:**
- `grid-cols-subgrid` - Inherit parent grid columns
- `grid-rows-subgrid` - Inherit parent grid rows

**Accessibility:**
- `forced-colors:` variant - Style for Windows High Contrast Mode

**Example Usage:**
```html
<!-- Modern viewport units -->
<div class="h-dvh">Full dynamic viewport height</div>
<div class="min-h-svh">Minimum small viewport height</div>

<!-- Size utilities -->
<div class="size-16">Square 16x16</div>
<div class="size-full">Full width and height</div>

<!-- :has() variant -->
<div class="has-[:checked]:bg-blue-500">
  <input type="checkbox">Checked parent changes
</div>

<!-- Text wrapping -->
<h1 class="text-balance">Balanced headline text</h1>
<p class="text-pretty">Pretty wrapped paragraph</p>

<!-- Subgrid -->
<div class="grid grid-cols-3">
  <div class="grid grid-cols-subgrid col-span-2">Subgrid item</div>
</div>

<!-- Forced colors (accessibility) -->
<div class="forced-colors:border-4">High contrast border</div>
```

### Version History

This fork incrementally migrates features from Tailwind CSS releases while maintaining JavaScript-only architecture:

- **v3.0.24** - ✅ **BASE** - Original JavaScript-only fork
- **v3.1.0** - ✅ **DONE** - Arbitrary variants, new utilities, new variants
- **v3.2.0** - ✅ **DONE** - ARIA/data variants, @supports, min/max queries, baseline alignment
- **v3.3.0** - ✅ **DONE** - Extended colors (950 shades), line-clamp, logical properties
- **v3.4.0** - ✅ **DONE** - Viewport units, size utilities, :has(), text-wrap, subgrid

All versions are preserved in `lib/VERSION/` directories and available as tarballs in `dist/VERSION/`.

See `CHANGELOG.md` for detailed release notes.

### Installation and Building

```bash
# Install dependencies
npm install

# Build with version-specific folders
npm run build

# Create version-specific tarball
npm run pack

# Build and package together
npm run build:pack

# Legacy build (outputs to lib/ without versioning)
npm run swcify
```

#### Version-Specific Build System

This fork uses a version-specific build system that allows multiple versions to coexist:

**Build Output:**
- `lib/VERSION/` - Compiled code for each version (e.g., `lib/3.0.24/`)
- `lib/*.js` - Symlinks to the latest version for backwards compatibility
- `dist/VERSION/` - Packaged tarballs (e.g., `dist/3.0.24/tailwindcss-3.0.24.tgz`)
- `dist/*.tgz` - Latest tarball copy at root for convenience

**Benefits:**
- Work on multiple versions simultaneously
- Preserve old version artifacts when building new versions
- Install specific versions from versioned tarballs
- Backwards compatible with existing tooling via symlinks

### Using in Your Project

You can install this JavaScript-only fork directly from the pre-built tarballs in the `dist/` folder.

#### Quick Start

**1. Install from Tarball**

```bash
# Create a new project
mkdir my-website
cd my-website
npm init -y

# Install Tailwind CSS v3.4.0 from tarball
# Option A: Clone this repo and install locally
git clone https://github.com/YOUR_USERNAME/tailwindcss.git
npm install ./tailwindcss/dist/3.4.0/tailwindcss-3.4.0.tgz

**2. Create Tailwind Config**

```bash
npx tailwindcss init
```

This creates a `tailwind.config.js` file:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./src/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**3. Create Your CSS File**

Create `src/input.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**4. Build Your CSS**

```bash
# One-time build
npx tailwindcss -i ./src/input.css -o ./dist/output.css

# Watch mode for development
npx tailwindcss -i ./src/input.css -o ./dist/output.css --watch

# Minified for production
npx tailwindcss -i ./src/input.css -o ./dist/output.css --minify
```

**5. Use in Your HTML**

Create `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Tailwind Site</title>
  <link href="./dist/output.css" rel="stylesheet">
</head>
<body>
  <div class="container mx-auto px-4">
    <h1 class="text-3xl font-bold text-blue-600">
      Hello Tailwind CSS v3.1!
    </h1>

    <!-- Try v3.1 features -->
    <div class="[&:hover]:text-red-500">
      Arbitrary variant example
    </div>

    <table class="border-spacing-4">
      <tr><td>Border spacing utility</td></tr>
    </table>

    <button class="enabled:bg-blue-500 disabled:bg-gray-300">
      New enabled variant
    </button>
  </div>
</body>
</html>
```

**6. Add Build Scripts to package.json**

```json
{
  "scripts": {
    "dev": "tailwindcss -i ./src/input.css -o ./dist/output.css --watch",
    "build": "tailwindcss -i ./src/input.css -o ./dist/output.css --minify"
  }
}
```

Then run:
```bash
npm run dev    # Development with watch mode
npm run build  # Production build
```

#### Advanced Configuration

**Using with PostCSS:**

```bash
npm install -D postcss postcss-cli autoprefixer
```

Create `postcss.config.js`:

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  }
}
```

## Simple Method to use the prebult packages in your nodejs / React project

  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "tailwindcss": "file:../saulwindcss/dist/3.4.0/tailwindcss-3.4.0.tgz"
  }

## Contributing to Tailwind , Not Me

