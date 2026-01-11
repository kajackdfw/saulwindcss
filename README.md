<h1>
  Tailwindcss 3.2 ( javaScript version, not Rusty )
</h1>

A utility-first CSS framework for rapidly building custom user interfaces.

<p>
    <a href="https://github.com/tailwindlabs/tailwindcss/actions"><img src="https://img.shields.io/github/workflow/status/tailwindlabs/tailwindcss/Node.js%20CI" alt="Build Status"></a>
    <a href="https://www.npmjs.com/package/tailwindcss"><img src="https://img.shields.io/npm/dt/tailwindcss.svg" alt="Total Downloads"></a>
    <a href="https://github.com/tailwindcss/tailwindcss/releases"><img src="https://img.shields.io/npm/v/tailwindcss.svg" alt="Latest Release"></a>
    <a href="https://github.com/tailwindcss/tailwindcss/blob/master/LICENSE"><img src="https://img.shields.io/npm/l/tailwindcss.svg" alt="License"></a>
</p>

------

## About This Fork

**Version:** 3.2.0 (JavaScript-only fork)

This is a JavaScript-only fork of Tailwind CSS, originally based on version 3.0.24 - the last version before the Rust/Oxide engine was introduced. This fork maintains the pure JavaScript/TypeScript architecture without requiring Rust toolchain dependencies.

### What's New in v3.2

This version includes key features from Tailwind CSS v3.2, adapted for the JavaScript-only architecture:

**New Utilities:**
- `break-keep` - Prevent breaking within words (`word-break: keep-all`) for CJK languages
- `collapse` - Collapse table rows/columns (`visibility: collapse`)
- `fill-none` / `stroke-none` - Remove SVG fill or stroke
- `place-content-baseline` / `place-items-baseline` / `content-baseline` - Baseline alignment for grid/flex
- Negative `outline-offset-*` values - Support for negative outline offsets

**New Variants:**
- `aria-*` - Style based on ARIA attributes (`aria-checked:bg-blue-500`, `aria-[disabled]:opacity-50`)
- `data-*` - Style based on data attributes (`data-[state=open]:block`, `data-[loading]:opacity-50`)
- `supports-*` - CSS feature query variant (`supports-[display:grid]:grid`)
- `min-*` / `max-*` - Arbitrary media queries (`min-[768px]:flex`, `max-[1024px]:hidden`)

**Configuration Enhancements:**
- `relative: true` - Resolve content paths relative to config file location
- Font feature settings - Support `font-feature-settings` in `fontFamily` theme

**Example Config:**
```js
module.exports = {
  relative: true, // Resolve content paths relative to config file
  content: ['./src/**/*.html'], // Now relative to config location
  theme: {
    fontFamily: {
      sans: ['Inter var', { fontFeatureSettings: '"cv11", "ss01"' }],
    },
  },
}
```

**Example Usage:**
```html
<!-- ARIA variants -->
<button class="aria-checked:bg-blue-500 aria-disabled:opacity-50">Toggle</button>

<!-- Data attribute variants -->
<div class="data-[state=open]:block data-[state=closed]:hidden">Content</div>

<!-- Feature queries -->
<div class="supports-[display:grid]:grid supports-[display:flex]:flex">Layout</div>

<!-- Arbitrary media queries -->
<div class="min-[768px]:flex max-[1024px]:hidden">Responsive</div>

<!-- New utilities -->
<div class="break-keep -outline-offset-2">Text with outline</div>
```

### Migration Plan

This fork intends to incrementally migrate features and patches from later versions:
- **v3.1** - ✅ **DONE** - Arbitrary variants, new utilities, new variants
- **v3.2** - ✅ **DONE** - ARIA/data variants, @supports, min/max queries, baseline alignment, configuration enhancements
- **v3.4** - 📋 **PLANNED** - Modern CSS features (subgrid, :has(), text-wrap, size-* utilities)

Features are ported selectively to maintain the JavaScript-only architecture while bringing in valuable enhancements from later releases.

**v3.2 Status:** 19/20 tests passing (95% pass rate). All core features implemented and tested.

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

# Install Tailwind CSS v3.1.0 from tarball
# Option A: Clone this repo and install locally
git clone https://github.com/YOUR_USERNAME/tailwindcss.git
npm install ./tailwindcss/dist/3.1.0/tailwindcss-3.1.0.tgz

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

**Using with Build Tools:**

- **Vite:** Works out of the box with PostCSS
- **Webpack:** Use `postcss-loader`
- **Parcel:** Automatic PostCSS detection
- **Rollup:** Use `rollup-plugin-postcss`

See the official [Tailwind CSS framework guides](https://tailwindcss.com/docs/installation/framework-guides) for detailed integration instructions.

------

## Documentation

For full documentation, visit [tailwindcss.com](https://tailwindcss.com/).

## Community

For help, discussion about best practices, or any other conversation that would benefit from being searchable:

[Discuss Tailwind CSS on GitHub](https://github.com/tailwindcss/tailwindcss/discussions)

For casual chit-chat with others using the framework:

[Join the Tailwind CSS Discord Server](https://discord.gg/7NF8GNe)

## Contributing

If you're interested in contributing to Tailwind CSS, please read our [contributing docs](https://github.com/tailwindcss/tailwindcss/blob/master/.github/CONTRIBUTING.md) **before submitting a pull request**.
