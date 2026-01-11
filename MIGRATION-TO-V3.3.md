# Migration Plan: Tailwind CSS v3.3.0 (JavaScript-only Fork)

## Overview

**Goal:** Create a complete JavaScript-only implementation of Tailwind CSS v3.3 features, forked from the current `javascript-fork-v3.2.0` branch.

**Branch:** `javascript-fork-v3.3.0` (new branch from `javascript-fork-v3.2.0`)

**Version:** 3.3.0

**Strategy:** Preserve v3.2.0 artifacts, build v3.3.0 alongside them using the established version-specific build system.

**Scope:** Complete v3.3 feature port including:
- Extended color palette (950 shades)
- Line-clamp utilities (from plugin)
- Logical properties utilities
- Enhanced gradient controls
- Font-size line-height modifiers
- New utility classes

---

## Phase 1: Branch Setup & Version Configuration

### 1.1 Create New Branch
```bash
git checkout javascript-fork-v3.2.0
git checkout -b javascript-fork-v3.3.0
```

### 1.2 Update Version Numbers
**File:** `package.json`
- Update `"version": "3.2.0"` → `"version": "3.3.0"`

**File:** `README.md` (lines 1-3)
- Update title from "3.2 (javaScript version)" to "3.3 (javaScript version)"
- Update version reference to v3.3.0

**File:** `CLAUDE.md` (lines 1-10)
- Update version references to v3.3.0
- Update feature list to reflect v3.3 additions

### 1.3 Update Migration Status
**File:** `README.md` (migration plan section)
- Mark v3.3 as "✅ **DONE**" after completion
- Update feature descriptions

---

## Phase 2: Extended Color Palette - 950 Shades

All changes in: `src/public/colors.js` and `stubs/defaultConfig.stub.js`

### 2.1 Add 950 Shade to All Colors
**Location:** `src/public/colors.js`

**Colors to update:**
- `slate`, `gray`, `zinc`, `neutral`, `stone` (neutral grays)
- `red`, `orange`, `amber`, `yellow`, `lime`, `green`, `emerald`, `teal`, `cyan`, `sky`, `blue`, `indigo`, `violet`, `purple`, `fuchsia`, `pink`, `rose`

**Pattern for each color:**
```javascript
slate: {
  50: '#f8fafc',
  100: '#f1f5f9',
  // ... existing shades
  900: '#0f172a',
  950: '#020617', // ADD THIS - darkest shade
}
```

**950 Shade Values:**
- Grays (slate/gray/zinc/neutral/stone): Act as "tinted black" - very dark with slight hue
- Colors: Optimized for high contrast text and tinted control backgrounds
- Use values from official Tailwind CSS v3.3 color palette

### 2.2 Update Default Theme
**Location:** `stubs/defaultConfig.stub.js`

Ensure the extended color palette is exported and available in the default theme configuration.

---

## Phase 3: Line-Clamp Utilities (Built-in)

**Goal:** Promote `@tailwindcss/line-clamp` plugin functionality into core

### 3.1 Add Line-Clamp Plugin to Core
**Location:** `src/corePlugins.js`

**Implementation:**
```javascript
lineClamp: ({ matchUtilities, addUtilities, theme }) => {
  // Add base utility for disabling line-clamp
  addUtilities({
    '.line-clamp-none': {
      'overflow': 'visible',
      'display': 'block',
      '-webkit-box-orient': 'horizontal',
      '-webkit-line-clamp': 'none',
    },
  })

  // Add numbered line-clamp utilities
  matchUtilities(
    {
      'line-clamp': (value) => ({
        'overflow': 'hidden',
        'display': '-webkit-box',
        '-webkit-box-orient': 'vertical',
        '-webkit-line-clamp': `${value}`,
      }),
    },
    { values: theme('lineClamp') }
  )
}
```

### 3.2 Add Theme Configuration
**Location:** `stubs/defaultConfig.stub.js`

```javascript
lineClamp: {
  1: '1',
  2: '2',
  3: '3',
  4: '4',
  5: '5',
  6: '6',
}
```

**Usage examples:**
- `line-clamp-1` - Truncate to 1 line
- `line-clamp-3` - Truncate to 3 lines
- `line-clamp-none` - Disable line clamping

---

## Phase 4: Logical Properties Utilities

All changes in: `src/corePlugins.js`

### 4.1 Add Logical Inset Properties
**Location:** After existing `inset` plugin

**Add new utilities:**
```javascript
insetInline: createUtilityPlugin('insetInline', [['inset-inline', ['inset-inline']]], {
  supportsNegativeValues: true,
}),
insetInlineStart: createUtilityPlugin('insetInlineStart', [['inset-inline-start', ['inset-inline-start']]], {
  supportsNegativeValues: true,
}),
insetInlineEnd: createUtilityPlugin('insetInlineEnd', [['inset-inline-end', ['inset-inline-end']]], {
  supportsNegativeValues: true,
}),
insetBlock: createUtilityPlugin('insetBlock', [['inset-block', ['inset-block']]], {
  supportsNegativeValues: true,
}),
insetBlockStart: createUtilityPlugin('insetBlockStart', [['inset-block-start', ['inset-block-start']]], {
  supportsNegativeValues: true,
}),
insetBlockEnd: createUtilityPlugin('insetBlockEnd', [['inset-block-end', ['inset-block-end']]], {
  supportsNegativeValues: true,
}),
```

### 4.2 Add Logical Margin Properties
**Location:** After existing `margin` plugin

```javascript
marginInline: createUtilityPlugin('marginInline', [
  ['mx', ['margin-inline-start', 'margin-inline-end']], // Alias for existing mx
  ['margin-inline', ['margin-inline']],
], {
  supportsNegativeValues: true,
}),
marginInlineStart: createUtilityPlugin('marginInlineStart', [
  ['ms', ['margin-inline-start']],
  ['margin-inline-start', ['margin-inline-start']],
], {
  supportsNegativeValues: true,
}),
marginInlineEnd: createUtilityPlugin('marginInlineEnd', [
  ['me', ['margin-inline-end']],
  ['margin-inline-end', ['margin-inline-end']],
], {
  supportsNegativeValues: true,
}),
marginBlock: createUtilityPlugin('marginBlock', [
  ['my', ['margin-block-start', 'margin-block-end']], // Alias for existing my
  ['margin-block', ['margin-block']],
], {
  supportsNegativeValues: true,
}),
marginBlockStart: createUtilityPlugin('marginBlockStart', [
  ['mt', ['margin-block-start']], // Alias for existing mt
  ['margin-block-start', ['margin-block-start']],
], {
  supportsNegativeValues: true,
}),
marginBlockEnd: createUtilityPlugin('marginBlockEnd', [
  ['mb', ['margin-block-end']], // Alias for existing mb
  ['margin-block-end', ['margin-block-end']],
], {
  supportsNegativeValues: true,
}),
```

### 4.3 Add Logical Padding Properties
**Location:** After existing `padding` plugin

Similar structure to margin, with `padding-inline`, `padding-inline-start`, `padding-inline-end`, `padding-block`, `padding-block-start`, `padding-block-end`.

Use shortcuts: `ps`, `pe` for padding-inline-start/end.

### 4.4 Add Logical Border Radius Properties
**Location:** After existing `borderRadius` plugin

```javascript
borderStartStartRadius: createUtilityPlugin('borderStartStartRadius', [
  ['rounded-ss', ['border-start-start-radius']],
]),
borderStartEndRadius: createUtilityPlugin('borderStartEndRadius', [
  ['rounded-se', ['border-start-end-radius']],
]),
borderEndStartRadius: createUtilityPlugin('borderEndStartRadius', [
  ['rounded-es', ['border-end-start-radius']],
]),
borderEndEndRadius: createUtilityPlugin('borderEndEndRadius', [
  ['rounded-ee', ['border-end-end-radius']],
]),
```

### 4.5 Add Logical Scroll Properties
**Location:** After existing scroll utilities

- `scroll-margin-inline`, `scroll-margin-inline-start`, `scroll-margin-inline-end`
- `scroll-margin-block`, `scroll-margin-block-start`, `scroll-margin-block-end`
- `scroll-padding-inline`, `scroll-padding-inline-start`, `scroll-padding-inline-end`
- `scroll-padding-block`, `scroll-padding-block-start`, `scroll-padding-block-end`

---

## Phase 5: Font-Size Line-Height Modifiers

**Goal:** Allow setting line-height alongside font-size in a single utility

### 5.1 Enhance fontSize Plugin
**Location:** `src/corePlugins.js` - `fontSize` plugin (around line 1648)

**Current implementation:** Already supports arrays like `['14px', '20px']`

**Enhancement needed:** Support modifier syntax like `text-lg/8` where `/8` sets line-height

**Implementation approach:**
- Modify candidate parsing to detect `/` separator after font-size utility
- Parse the modifier value (number, named value, arbitrary)
- Apply line-height alongside font-size

**Example usage:**
- `text-lg/7` - Font size `lg` with line-height from spacing scale `7`
- `text-base/loose` - Font size `base` with named line-height `loose`
- `text-sm/[3rem]` - Font size `sm` with arbitrary line-height `3rem`

**Note:** This may require changes to `src/lib/generateRules.js` to handle modifiers for utilities.

---

## Phase 6: Gradient Color Stop Positions

**Goal:** Allow specifying exact positions for gradient color stops

### 6.1 Add Gradient Position Utilities
**Location:** `src/corePlugins.js`

**Add new plugins:**
```javascript
gradientColorStopPositions: ({ matchUtilities, theme }) => {
  matchUtilities(
    {
      from: (value) => ({
        '--tw-gradient-from-position': value,
      }),
      via: (value) => ({
        '--tw-gradient-via-position': value,
      }),
      to: (value) => ({
        '--tw-gradient-to-position': value,
      }),
    },
    {
      values: theme('gradientColorStopPositions'),
      type: ['length', 'percentage'],
    }
  )
}
```

### 6.2 Update Gradient Rendering
**Location:** `src/corePlugins.js` - `gradientColorStops` plugin

Update gradient color stop generation to include position variables:
```javascript
'--tw-gradient-from': `${toColorValue(value)} var(--tw-gradient-from-position, 0%)`,
'--tw-gradient-to': `${toColorValue(value)} var(--tw-gradient-to-position, 100%)`,
'--tw-gradient-via': `${toColorValue(value)} var(--tw-gradient-via-position, 50%)`,
```

### 6.3 Add Theme Configuration
**Location:** `stubs/defaultConfig.stub.js`

```javascript
gradientColorStopPositions: {
  '0%': '0%',
  '5%': '5%',
  '10%': '10%',
  // ... through 100%
}
```

**Usage examples:**
- `from-blue-500 from-10%` - Start gradient at 10%
- `via-purple-500 via-60%` - Middle color at 60%
- `to-pink-500 to-90%` - End gradient at 90%

---

## Phase 7: Additional New Utilities

All changes in: `src/corePlugins.js`

### 7.1 Hyphens Utilities
```javascript
hyphens: ({ addUtilities }) => {
  addUtilities({
    '.hyphens-none': { 'hyphens': 'none' },
    '.hyphens-manual': { 'hyphens': 'manual' },
    '.hyphens-auto': { 'hyphens': 'auto' },
  })
}
```

### 7.2 Caption-Side Utilities
```javascript
captionSide: ({ addUtilities }) => {
  addUtilities({
    '.caption-top': { 'caption-side': 'top' },
    '.caption-bottom': { 'caption-side': 'bottom' },
  })
}
```

### 7.3 List-Style-Image Utilities
```javascript
listStyleImage: ({ matchUtilities, theme }) => {
  matchUtilities(
    {
      'list-image': (value) => ({ 'list-style-image': value }),
    },
    { values: theme('listStyleImage') }
  )
}
```

**Theme config:**
```javascript
listStyleImage: {
  none: 'none',
}
```

### 7.4 Whitespace Break-Spaces
**Location:** Existing `whitespace` plugin

**Add:**
```javascript
'.whitespace-break-spaces': { 'white-space': 'break-spaces' }
```

### 7.5 Justify Normal/Stretch
**Location:** Existing `justifyContent` plugin

**Add:**
```javascript
'.justify-normal': { 'justify-content': 'normal' },
'.justify-stretch': { 'justify-content': 'stretch' },
```

### 7.6 Content Normal/Stretch
**Location:** Existing `alignContent` plugin

**Add:**
```javascript
'.content-normal': { 'align-content': 'normal' },
'.content-stretch': { 'align-content': 'stretch' },
```

### 7.7 Delay-0 and Duration-0
**Location:** Existing transition utilities

Ensure `0` value is included in transition delay and duration themes.

---

## Phase 8: CSS Variable Arbitrary Values (Shorthand)

**Goal:** Allow using CSS variables without `var()` wrapper in arbitrary values

### 8.1 Update Arbitrary Value Parser
**Location:** `src/util/isValidArbitraryValue.js` or value coercion in `src/lib/setupContextUtils.js`

**Enhancement:**
- Detect CSS variable patterns: `--my-variable`, `--tw-color`
- Automatically wrap in `var()` when used as arbitrary values
- Example: `bg-[--my-color]` → `background-color: var(--my-color)`

**Implementation approach:**
1. Check if arbitrary value starts with `--`
2. If yes, wrap with `var(...)` before applying
3. Maintain backwards compatibility with explicit `var(...)` syntax

---

## Phase 9: Font-Variation-Settings Support

**Goal:** Default `font-variation-settings` for font families

### 9.1 Enhance fontFamily Configuration
**Location:** Already implemented in v3.2 via `fontFeatureSettings`

**Extend to support `fontVariationSettings`:**
```javascript
fontFamily: {
  sans: [
    'Inter var',
    {
      fontFeatureSettings: '"cv11", "ss01"',
      fontVariationSettings: '"wght" 500', // NEW
    },
  ],
}
```

### 9.2 Update fontFamily Plugin
**Location:** `src/corePlugins.js` - `fontFamily` plugin (already modified in v3.2)

**Add support for `fontVariationSettings`:**
```javascript
...(options.fontVariationSettings && {
  'font-variation-settings': options.fontVariationSettings,
}),
```

---

## Phase 10: ESM and TypeScript Config Support

**Goal:** Support `tailwind.config.ts` and `tailwind.config.mjs` files

### 10.1 Enhance Config Loader
**Location:** `src/util/resolveConfigPath.js`

**Add support for:**
- `tailwind.config.ts`
- `tailwind.config.mjs`
- `tailwind.config.cts`

**Implementation approach:**
1. Update config file discovery to check for `.ts` and `.mjs` extensions
2. Use appropriate loaders:
   - For `.mjs`: Use native ESM import
   - For `.ts`: Use `@swc/register` or `tsx` to transpile on-the-fly
3. Fallback to existing `.js` and `.cjs` support

### 10.2 Add Dependencies (if needed)
**File:** `package.json`

May need to add optional dependencies for TypeScript support:
- `tsx` or similar TypeScript loader
- Or rely on existing `@swc/register` dependency

---

## Phase 11: Behavioral Changes

### 11.1 Update rtl/ltr Variants
**Location:** `src/corePlugins.js` - variant plugins

Remove any deprecation warnings for `rtl` and `ltr` variants (if present).

### 11.2 Use inset Property
**Location:** `src/corePlugins.js` - positioning utilities

**Change:** Prefer `inset` property over individual `top/right/bottom/left`

**Current utilities like `inset-0`:** Already use `inset` property (verify)

### 11.3 Dark/RTL/LTR Variants DOM-Order Insensitive
**Location:** `src/corePlugins.js` - variant implementations

**Enhancement:** Use `:is()` or `:where()` selectors to make these variants work regardless of DOM order

**Example:**
```javascript
// Instead of: .dark .dark\:bg-black
// Generate: :is(.dark) .dark\:bg-black
```

### 11.4 Important Modifier with :is()
**Location:** `src/lib/generateRules.js` - important handling

Update important modifier to use `:is()` for specificity control.

---

## Phase 12: Content Extraction Updates

**File:** `src/lib/defaultExtractor.js`

### 12.1 Add Line-Height Modifier Pattern
**Add pattern to extract:**
- `text-lg/7`
- `text-base/loose`
- `text-sm/[3rem]`

**New regex pattern:**
```javascript
/(text-[^\s:]+\/[^\s:]+)/.source, // Font-size with line-height modifier
```

### 12.2 Add Gradient Position Pattern
**Add pattern to extract:**
- `from-10%`
- `via-50%`
- `to-90%`

**New regex pattern:**
```javascript
/(from|via|to)-\d+%/.source, // Gradient color stop positions
```

### 12.3 Add Logical Property Pattern
**Ensure extraction of:**
- `ms-4`, `me-8` (margin-inline)
- `ps-2`, `pe-6` (padding-inline)
- `rounded-ss`, `rounded-ee` (border-radius logical)

Existing patterns should cover these, but verify.

---

## Phase 13: Testing Strategy

### 13.1 Create Test File
**File:** `tests/v3.3-features.test.js` (new file, ~500-600 lines)

**Test structure:**
```javascript
describe('v3.3 extended color palette', () => {
  test('950 shades for all colors', () => { ... })
})

describe('v3.3 line-clamp utilities', () => {
  test('line-clamp-1 through line-clamp-6', () => { ... })
  test('line-clamp-none disables clamping', () => { ... })
})

describe('v3.3 logical properties', () => {
  test('logical inset properties', () => { ... })
  test('logical margin properties', () => { ... })
  test('logical padding properties', () => { ... })
  test('logical border-radius properties', () => { ... })
  test('logical scroll properties', () => { ... })
})

describe('v3.3 font-size line-height modifiers', () => {
  test('text-lg/7 sets font-size and line-height', () => { ... })
  test('arbitrary line-height modifiers', () => { ... })
})

describe('v3.3 gradient color stop positions', () => {
  test('from-10% via-50% to-90%', () => { ... })
})

describe('v3.3 new utilities', () => {
  test('hyphens utilities', () => { ... })
  test('caption-side utilities', () => { ... })
  test('list-style-image utilities', () => { ... })
  test('whitespace-break-spaces', () => { ... })
  test('justify-normal and justify-stretch', () => { ... })
  test('content-normal and content-stretch', () => { ... })
})

describe('v3.3 CSS variable shorthand', () => {
  test('bg-[--my-color] expands to var()', () => { ... })
})

describe('v3.3 font-variation-settings', () => {
  test('fontVariationSettings in fontFamily config', () => { ... })
})
```

### 13.2 Update Existing Tests
- Ensure no regressions in v3.0, v3.1, v3.2 features
- Run full test suite: `npm test`

### 13.3 Integration Tests
**Directory:** `integrations/`
- Test with bundlers (Webpack, Vite, etc.)
- Verify ESM/TypeScript config loading works

---

## Phase 14: Documentation Updates

### 14.1 Update CHANGELOG.md
**File:** `CHANGELOG.md`

**Add v3.3.0 section:**
```markdown
## [3.3.0] - 2026-01-XX

### Added

**Extended Color Palette:**
- Added 950 shade to all color scales for darker UI options
- Optimized for high contrast text and tinted backgrounds

**Line-Clamp (Built-in):**
- `line-clamp-{n}` utilities (1-6)
- `line-clamp-none` utility
- Promoted from `@tailwindcss/line-clamp` plugin

**Logical Properties:**
- Inset: `inset-inline`, `inset-inline-start/end`, `inset-block`, `inset-block-start/end`
- Margin: `ms`, `me`, `margin-inline-start/end`, `margin-block-start/end`
- Padding: `ps`, `pe`, `padding-inline-start/end`, `padding-block-start/end`
- Border-radius: `rounded-ss`, `rounded-se`, `rounded-es`, `rounded-ee`
- Scroll: `scroll-m{s|e|b|t}`, `scroll-p{s|e|b|t}`

**Font-Size Line-Height Modifiers:**
- `text-{size}/{height}` syntax (e.g., `text-lg/7`)
- Arbitrary line-heights (e.g., `text-sm/[3rem]`)

**Gradient Color Stop Positions:**
- `from-{position}`, `via-{position}`, `to-{position}` utilities
- Fine-tune gradient transitions (e.g., `from-10% via-50% to-90%`)

**New Utilities:**
- `hyphens-{none|manual|auto}` - Control hyphenation
- `caption-{top|bottom}` - Table caption position
- `list-image-{value}` - Custom list item images
- `whitespace-break-spaces` - CSS white-space value
- `justify-normal`, `justify-stretch` - Additional justify-content values
- `content-normal`, `content-stretch` - Additional align-content values
- `delay-0`, `duration-0` - Zero-value transitions

**Configuration:**
- ESM config file support (`tailwind.config.mjs`)
- TypeScript config file support (`tailwind.config.ts`)
- `fontVariationSettings` support in `fontFamily` theme
- CSS variable shorthand in arbitrary values (e.g., `bg-[--my-color]`)

### Changed
- `rtl` and `ltr` variants marked stable (no warnings)
- Improved specificity handling with `:is()` selectors
- Updated `dark`, `rtl`, and `ltr` variants to be DOM-order insensitive

### Notes
JavaScript-only implementation maintaining compatibility with v3.0-v3.2.
No Rust/Oxide dependencies.
```

### 14.2 Update README.md
**File:** `README.md`

Update "What's New in v3.3" section with all features and examples.

### 14.3 Update CLAUDE.md
**File:** `CLAUDE.md`

Update version and feature references to v3.3.0.

---

## Phase 15: Build & Package

### 15.1 Build v3.3.0
```bash
npm run build
```

**Expected output:**
- `lib/3.0.24/`, `lib/3.1.0/`, `lib/3.2.0/` - Preserved
- `lib/3.3.0/` - New build output
- `lib/*.js` - Symlinks updated to point to `3.3.0/`

### 15.2 Package v3.3.0
```bash
npm run pack
```

**Expected output:**
- Previous version tarballs preserved
- `dist/3.3.0/tailwindcss-3.3.0.tgz` - New tarball
- `dist/tailwindcss-3.3.0.tgz` - Convenience copy

### 15.3 Test Installation
```bash
cd /tmp
mkdir test-v3.3
cd test-v3.3
npm init -y
npm install /home/ktaylor/Projects/tailwindcss/dist/3.3.0/tailwindcss-3.3.0.tgz
npx tailwindcss init
```

Create test HTML/config with v3.3 features and verify CSS generation.

---

## Phase 16: Version Control

### 16.1 Commit Changes
```bash
git add .
git commit -m "feat: Tailwind CSS v3.3.0 JavaScript-only fork

Complete v3.3 feature implementation:
- Extended color palette with 950 shades
- Line-clamp utilities (built-in)
- Logical properties (inset, margin, padding, border-radius, scroll)
- Font-size line-height modifiers
- Gradient color stop positions
- New utilities (hyphens, caption-side, list-style-image, etc.)
- ESM/TypeScript config support
- CSS variable shorthand
- Font-variation-settings support

Preserves v3.0.24, v3.1.0, v3.2.0 build artifacts alongside v3.3.0.
JavaScript-only architecture maintained (no Rust/Oxide dependencies)."
```

### 16.2 Create Git Tag
```bash
git tag -a v3.3.0 -m "Tailwind CSS v3.3.0 (JavaScript-only fork)"
```

### 16.3 Push to Remote
```bash
git push origin javascript-fork-v3.3.0
git push origin v3.3.0
```

---

## Critical Files Reference

**Files to modify (in order of changes):**

1. `package.json` - Version bump
2. `src/public/colors.js` - Add 950 shades to all colors
3. `stubs/defaultConfig.stub.js` - Add lineClamp, gradientColorStopPositions themes
4. `src/corePlugins.js` - Add all new utilities and logical properties (~500 lines of changes)
5. `src/lib/defaultExtractor.js` - Add extraction patterns for new syntaxes
6. `src/util/resolveConfigPath.js` - Add ESM/TS config support
7. `src/util/isValidArbitraryValue.js` - Add CSS variable shorthand
8. `tests/v3.3-features.test.js` - Complete test suite (NEW FILE)
9. `CHANGELOG.md` - Document v3.3.0 changes
10. `README.md` - Update feature list and migration status
11. `CLAUDE.md` - Update version and feature references

**Files to preserve:**
- `lib/3.0.24/*`, `lib/3.1.0/*`, `lib/3.2.0/*` - Keep all previous build artifacts
- `dist/3.0.24/*`, `dist/3.1.0/*`, `dist/3.2.0/*` - Keep previous tarballs

---

## Verification Checklist

### Build Verification
- [ ] `npm install` completes without errors
- [ ] `npm run build` generates `lib/3.3.0/` directory
- [ ] Symlinks in `lib/` point to `3.3.0/` files
- [ ] `npm run pack` creates `dist/3.3.0/tailwindcss-3.3.0.tgz`
- [ ] Tarball installs correctly in test project

### Feature Verification - Colors
- [ ] All colors have 950 shade
- [ ] 950 shades render correctly in CSS
- [ ] Existing color functionality preserved

### Feature Verification - Line-Clamp
- [ ] `line-clamp-1` through `line-clamp-6` work
- [ ] `line-clamp-none` disables clamping
- [ ] Multi-line text truncates correctly

### Feature Verification - Logical Properties
- [ ] Logical inset properties work
- [ ] Logical margin properties (ms, me) work
- [ ] Logical padding properties (ps, pe) work
- [ ] Logical border-radius (rounded-ss, etc.) work
- [ ] Logical scroll properties work
- [ ] RTL layouts adapt correctly

### Feature Verification - Font Modifiers
- [ ] `text-lg/7` sets font-size and line-height
- [ ] Arbitrary modifiers work (e.g., `text-sm/[3rem]`)
- [ ] Named line-heights work (e.g., `text-base/loose`)

### Feature Verification - Gradient Positions
- [ ] `from-10%` sets gradient start position
- [ ] `via-50%` sets middle color position
- [ ] `to-90%` sets gradient end position
- [ ] Gradients render with correct positions

### Feature Verification - New Utilities
- [ ] Hyphens utilities work
- [ ] Caption-side utilities work
- [ ] List-style-image utilities work
- [ ] Whitespace-break-spaces works
- [ ] Justify-normal/stretch work
- [ ] Content-normal/stretch work

### Feature Verification - Configuration
- [ ] ESM config files load (`.mjs`)
- [ ] TypeScript config files load (`.ts`)
- [ ] CSS variable shorthand works (`bg-[--my-color]`)
- [ ] fontVariationSettings in fontFamily works

### Testing Verification
- [ ] `npm test` passes all tests
- [ ] New v3.3 test file has comprehensive coverage
- [ ] No regressions in v3.0, v3.1, v3.2 features
- [ ] Integration tests pass

### Documentation Verification
- [ ] CHANGELOG.md has complete v3.3.0 section
- [ ] README.md reflects v3.3 features
- [ ] CLAUDE.md updated with v3.3 patterns
- [ ] Usage examples work correctly

---

## Estimated Implementation Order

1. **Day 1: Colors & Line-Clamp** (3-4 hours)
   - Add 950 shades to color palette
   - Implement line-clamp utilities
   - Basic tests

2. **Day 2: Logical Properties Part 1** (4-5 hours)
   - Logical inset properties
   - Logical margin properties
   - Logical padding properties
   - Tests

3. **Day 3: Logical Properties Part 2** (3-4 hours)
   - Logical border-radius
   - Logical scroll properties
   - Tests

4. **Day 4: Font Modifiers & Gradients** (4-5 hours)
   - Font-size line-height modifiers
   - Gradient color stop positions
   - Tests

5. **Day 5: New Utilities** (2-3 hours)
   - Hyphens, caption-side, list-style-image
   - Whitespace, justify, content utilities
   - Tests

6. **Day 6: Configuration Enhancements** (3-4 hours)
   - ESM/TypeScript config support
   - CSS variable shorthand
   - Font-variation-settings
   - Tests

7. **Day 7: Testing & Documentation** (3-4 hours)
   - Comprehensive test suite
   - Update all documentation
   - Build and package
   - End-to-end verification

**Total Estimate:** 22-29 hours of focused development

---

## Notes & Considerations

### Rust/Oxide Avoidance
- All features implemented in pure JavaScript/TypeScript
- No binary dependencies or native compilation
- PostCSS-based processing throughout
- Config loading uses standard Node.js mechanisms

### Backwards Compatibility
- All v3.0.24, v3.1.0, v3.2.0 artifacts preserved
- Symlinks ensure existing projects continue working
- No breaking changes to existing APIs

### Performance Considerations
- Extended color palette adds minimal overhead
- Logical properties are simple CSS output
- Line-clamp uses standard CSS properties
- Test with large projects to ensure acceptable performance

### Future Migration Path
- v3.4: Subgrid, :has(), text-wrap, size-* utilities
- Each version preserves previous builds
- Gradual feature adoption possible

### Known Limitations
- Font-size line-height modifiers may require significant parser changes
- ESM/TypeScript config support depends on Node.js version and available loaders
- Some logical properties may need browser polyfills for older browsers

---

## Reference Links

- [Tailwind CSS v3.3 Official Blog Post](https://tailwindcss.com/blog/tailwindcss-v3-3)
- [Tailwind CSS v3.3.0 GitHub Release](https://github.com/tailwindlabs/tailwindcss/releases/tag/v3.3.0)
- [Line-Clamp Documentation](https://v3.tailwindcss.com/docs/line-clamp)
