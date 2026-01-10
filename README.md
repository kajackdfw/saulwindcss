<h1>
  Tailwindcss 3.0 ( javaScript version, not Rusty )
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

**Version:** 3.1.0 (JavaScript-only fork)

This is a JavaScript-only fork of Tailwind CSS, originally based on version 3.0.24 - the last version before the Rust/Oxide engine was introduced. This fork maintains the pure JavaScript/TypeScript architecture without requiring Rust toolchain dependencies.

### What's New in v3.1

This version includes key features from Tailwind CSS v3.1, adapted for the JavaScript-only architecture:

**New Utilities:**
- `border-spacing-*` - Control table border spacing (`border-spacing-4`, `border-spacing-x-2`, `border-spacing-y-8`)
- `text-start` / `text-end` - Logical text alignment properties
- `grid-flow-dense` - Dense grid packing utilities (`grid-flow-dense`, `grid-flow-row-dense`, `grid-flow-col-dense`)
- `mix-blend-plus-lighter` - Additional blend mode utility

**New Variants:**
- `backdrop:` - Style the `::backdrop` pseudo-element
- `enabled:` - Style enabled form elements (counterpart to `disabled:`)
- `optional:` - Style optional form fields
- `contrast-more:` / `contrast-less:` - Adapt to user contrast preferences

**Arbitrary Variants:**
Write custom selector variants on-the-fly:
```html
<!-- Apply styles to nth-child -->
<div class="[&:nth-child(3)]:text-red-500">

<!-- Target child elements -->
<div class="[&_p]:text-sm">

<!-- Direct child selector -->
<div class="[&>div]:bg-green-500">

<!-- Pseudo-elements -->
<div class="[&::before]:content-['★']">

<!-- Stack multiple arbitrary variants -->
<div class="[&:hover]:[&:first-child]:bg-blue-500">
```

### Migration Plan

This fork intends to incrementally migrate features and patches from later versions:
- **v3.1** - ✅ **DONE** - Arbitrary variants, new utilities, new variants
- **v3.2** - Additional logical property support, bug fixes
- **v3.4** - Modern CSS features (subgrid, :has(), text-wrap, size-* utilities)

Features will be ported selectively to maintain the JavaScript-only architecture while bringing in valuable enhancements from later releases.

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
