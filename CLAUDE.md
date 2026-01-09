# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Build and Development
```bash
# Install dependencies
pnpm install

# Build all packages (excludes playgrounds)
pnpm build

# Development mode with watch (excludes playgrounds)
pnpm dev

# Run specific playground
pnpm vite        # Vite playground
pnpm nextjs      # Next.js playground
```

### Testing
```bash
# Run all tests (Rust + TypeScript unit tests)
pnpm test

# Run tests in watch mode (unit tests only)
pnpm tdd

# Run integration tests (requires build first)
pnpm build && pnpm test:integrations

# Run browser/UI tests (requires build first)
pnpm build && pnpm test:ui

# Run benchmarks
pnpm bench

# Run single test file
pnpm vitest run packages/tailwindcss/src/[filename].test.ts

# Run integration test for specific tool
pnpm vitest --root=./integrations run cli/[test-file].test.ts
```

### Code Quality
```bash
# Check formatting and run type checks
pnpm lint

# Auto-format code
pnpm format
```

### Rust Development
```bash
# Run Rust tests
cargo test

# Install required Rust toolchain and WASM target
rustup default stable
rustup target add wasm32-wasip1-threads
```

## Architecture

### Monorepo Structure
This is a pnpm workspace + Turbo monorepo with both Rust and TypeScript code. The project is organized into three main directories:

- **`crates/`** - Rust workspace containing the high-performance core
- **`packages/`** - TypeScript packages that consume the Rust core
- **`playgrounds/`** - Example projects for testing (excluded from builds)

### Rust Core (`crates/`)

The Rust core (`tailwindcss-oxide`) handles performance-critical operations:

- **`crates/oxide/`** - Main Rust library that provides:
  - File scanning and candidate extraction (finding class names in source files)
  - Fast glob matching for file discovery
  - Path normalization and handling
  - Core scanning algorithms

- **`crates/node/`** - N-API bindings that expose Rust functionality to Node.js
  - Uses `napi-rs` to create native Node modules
  - Compiled to platform-specific `.node` binaries
  - Bridge between TypeScript and Rust

- **`crates/classification-macros/`** - Procedural macros for Rust code generation
- **`crates/ignore/`** - Gitignore-style file filtering

The Rust code is compiled into the `@tailwindcss/oxide` package which is consumed by other TypeScript packages.

### TypeScript Packages (`packages/`)

All packages are prefixed with `@tailwindcss` except the main `tailwindcss` package:

- **`tailwindcss/`** - Core library containing:
  - CSS parsing and AST manipulation (`ast.ts`, `css-parser.ts`)
  - Candidate processing and canonicalization (`candidate.ts`, `canonicalize-candidates.ts`)
  - Design system and theme management (`design-system.ts`, `theme.ts`)
  - Utility generation and compilation (`compile.ts`, `utilities.ts`)
  - Variant handling (`variants.ts`)
  - Plugin system (`plugin.ts`)
  - Compatibility layer for v3 configs (`compat/`)

- **`@tailwindcss-oxide/`** - Native Node bindings to Rust core (built from `crates/node/`)
- **`@tailwindcss-node/`** - Node.js utilities for file system operations, compilation, and optimization
- **`@tailwindcss-cli/`** - Standalone CLI tool (`bin: tailwindcss`)
- **`@tailwindcss-postcss/`** - PostCSS plugin for build tool integration
- **`@tailwindcss-vite/`** - Vite plugin
- **`@tailwindcss-browser/`** - Browser runtime for client-side Tailwind
- **`@tailwindcss-upgrade/`** - Migration tool for upgrading from v3 to v4
- **`@tailwindcss-standalone/`** - Standalone builds

### Integration Tests (`integrations/`)

Integration tests verify end-to-end functionality with different build tools:
- `cli/` - CLI integration tests
- `postcss/` - PostCSS plugin tests
- `vite/` - Vite plugin tests
- `webpack/` - Webpack integration tests
- `upgrade/` - Upgrade tool tests
- `oxide/` - Rust core integration tests

Each integration test directory contains tests that build real projects and verify output.

### Key Architectural Concepts

**Two-Phase Processing:**
1. **Scanning (Rust)** - Fast file scanning to extract candidates (class names) from source files
2. **Compilation (TypeScript)** - Generate CSS from candidates using the design system

**Design System:**
The design system (`design-system.ts`) is the central registry that holds:
- Theme configuration (colors, spacing, etc.)
- Utility definitions
- Variant definitions
- Plugin registrations

**Candidate Flow:**
1. Source files are scanned for candidates (potential class names)
2. Candidates are canonicalized (normalized, variants extracted)
3. Design system compiles candidates to CSS AST nodes
4. AST is optimized and serialized to CSS

**Plugin System:**
Plugins can register utilities, variants, and base styles. The v4 plugin API is simpler than v3, using the `css` template literal for defining styles.

### Build System

- **Turbo** - Orchestrates monorepo builds with caching
- **tsup** - Bundles TypeScript packages
- **cargo** - Builds Rust crates
- **napi-rs** - Compiles Rust to native Node modules

Build outputs:
- TypeScript packages output to `packages/*/dist/`
- After build, `pnpm postbuild` runs `scripts/pack-packages.mjs` to create tarballs in `dist/`

### Testing Strategy

- **Unit tests** - Co-located `.test.ts` files using Vitest
- **Rust tests** - Standard Cargo tests in `crates/*/src/`
- **Integration tests** - Full build tool integration in `integrations/`
- **Browser tests** - Playwright tests for browser-specific features

### Source Map Support

The codebase includes sophisticated source map handling (`source-maps/` in main package) to map generated CSS back to utility usage in source files.
