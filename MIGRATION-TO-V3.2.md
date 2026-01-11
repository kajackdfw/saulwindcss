# Migration Plan: Tailwind CSS v3.2.0 (JavaScript-only Fork)

## Overview

**Goal:** Create a complete JavaScript-only implementation of Tailwind CSS v3.2 features, forked from the current `javascript-fork-v3.1` branch.

**Branch:** `javascript-fork-v3.2.0` (new branch from `javascript-fork-v3.1`)

**Version:** 3.2.0

**Strategy:** Preserve v3.1.0 artifacts, build v3.2.0 alongside them using the established version-specific build system.

**Scope:** Complete v3.2 feature port including:
- 8-10 new utilities
- 4 new variant types
- 6 configuration/API enhancements

---

## Phase 1: Branch Setup & Version Configuration

### 1.1 Create New Branch
```bash
git checkout javascript-fork-v3.1
git checkout -b javascript-fork-v3.2.0
```

### 1.2 Update Version Numbers
**File:** `package.json`
- Update `"version": "3.1.0"` → `"version": "3.2.0"`

**File:** `README.md` (lines 1-3)
- Update title from "3.0 (javaScript version)" to "3.2 (javaScript version)"
- Update line 18: `**Version:** 3.1.0` → `**Version:** 3.2.0`

**File:** `CLAUDE.md` (lines 1-10)
- Update version references to v3.2.0
- Update feature list to reflect v3.2 additions

### 1.3 Update Migration Status
**File:** `README.md` (lines 57-63)
- Mark v3.2 as "✅ **DONE**" after completion
- Update feature descriptions

---

## Phase 2: Core Utilities Implementation

All changes in: `src/corePlugins.js`

### 2.1 Text Breaking - `break-keep`
**Location:** `wordBreak` plugin (current: lines ~1589-1596)

**Add:**
```javascript
'.break-keep': { 'word-break': 'keep-all' }
```

**Testing:** Verify with Korean/Chinese text that doesn't break mid-word

---

### 2.2 Visibility - `collapse`
**Location:** `visibility` plugin (current: lines ~2350-2354)

**Add:**
```javascript
'.collapse': { visibility: 'collapse' }
```

**Use case:** Table rows/columns with `visibility: collapse`

---

### 2.3 SVG Fill/Stroke - `fill-none` and `stroke-none`
**Location:**
- `fill` plugin (current: lines ~824-836)
- `stroke` plugin (current: lines ~1789-1802)

**Current implementation:** Only supports color values from theme
**Change:** Add explicit "none" value support

**Pattern:**
```javascript
fill: ({ matchUtilities, theme, addUtilities }) => {
  matchUtilities(
    {
      fill: (value) => ({ fill: value }),
    },
    { values: flattenColorPalette(theme('fill')), type: ['color', 'any'] }
  )
  // ADD THIS:
  addUtilities({
    '.fill-none': { fill: 'none' }
  })
}
```

Same pattern for `stroke` plugin.

---

### 2.4 Baseline Alignment Utilities
**Locations:**
- `placeContent` plugin (lines ~1167-1194)
- `placeItems` plugin (lines ~1196-1220)
- `alignContent` plugin (lines ~209-230)

**Add to each:**
```javascript
'.place-content-baseline': { 'place-content': 'baseline' }
'.place-items-baseline': { 'place-items': 'baseline' }
'.content-baseline': { 'align-content': 'baseline' }
```

**Note:** Check if `items-baseline` and `self-baseline` already exist (they likely do for flex)

---

### 2.5 Negative Outline Offset
**Location:** `outlineOffset` plugin (current: lines ~1066-1079)

**Current:**
```javascript
outlineOffset: matchUtilities(
  { 'outline-offset': (value) => ({ 'outline-offset': value }) },
  { values: theme('outlineOffset'), type: ['length', 'percentage', 'any'] }
)
```

**Change:** Add `supportsNegativeValues: true`
```javascript
outlineOffset: matchUtilities(
  { 'outline-offset': (value) => ({ 'outline-offset': value }) },
  {
    values: theme('outlineOffset'),
    type: ['length', 'percentage', 'any'],
    supportsNegativeValues: true  // ADD THIS
  }
)
```

**Testing:** Verify `-outline-offset-2` generates negative value

---

## Phase 3: Dynamic Variant Implementation

All changes in: `src/corePlugins.js` (variant plugins section)

### 3.1 ARIA Attribute Variants - `aria-*`
**Location:** Add new plugin in `variantPlugins` section (after line ~200)

**Implementation:**
```javascript
ariaVariants: ({ matchVariant, theme }) => {
  matchVariant(
    'aria',
    (value) => `&[aria-${value}]`,
    { values: theme('aria') ?? {} }
  )
}
```

**Theme addition** in `src/public/default-theme.js`:
```javascript
aria: {
  busy: 'busy="true"',
  checked: 'checked="true"',
  disabled: 'disabled="true"',
  expanded: 'expanded="true"',
  hidden: 'hidden="true"',
  pressed: 'pressed="true"',
  readonly: 'readonly="true"',
  required: 'required="true"',
  selected: 'selected="true"',
}
```

**Usage examples:**
- `aria-checked:bg-blue-500` → `[aria-checked="true"]:bg-blue-500`
- `aria-[sort=ascending]:rotate-0` → arbitrary aria attributes

**Extraction:** Update `src/lib/defaultExtractor.js` to match `aria-*` patterns

---

### 3.2 Data Attribute Variants - `data-*`
**Location:** Add new plugin in `variantPlugins` section

**Implementation:**
```javascript
dataVariants: ({ matchVariant, theme }) => {
  matchVariant(
    'data',
    (value) => `&[data-${value}]`,
    { values: theme('data') ?? {} }
  )
}
```

**Theme addition** in `src/public/default-theme.js`:
```javascript
data: {
  // Common data attribute patterns - users can extend
}
```

**Usage examples:**
- `data-[state=open]:block` → `[data-state="open"]:block`
- `data-[loading]:opacity-50` → `[data-loading]:opacity-50`

**Extraction:** Update `src/lib/defaultExtractor.js` to match `data-*` patterns

---

### 3.3 CSS Feature Query Variant - `supports-*`
**Location:** Add new plugin in `variantPlugins` section

**Implementation:**
```javascript
supportsVariants: ({ matchVariant }) => {
  matchVariant(
    'supports',
    (value) => `@supports (${value})`,
    { values: {} } // Only arbitrary values
  )
}
```

**Usage examples:**
- `supports-[display:grid]:grid` → `@supports (display: grid) { .grid { ... } }`
- `supports-[(backdrop-filter:blur(0px))]:backdrop-blur-sm`

**Challenge:** Parsing CSS property:value pairs with nested parentheses
**Solution:** Reuse bracket balance validation from arbitrary variants (`src/lib/generateRules.js` lines 46-64)

**Extraction:** Update `src/lib/defaultExtractor.js` to match `supports-[...]` pattern

---

### 3.4 Min/Max Media Query Variants - `min-*` and `max-*`
**Location:** Add new plugin in `variantPlugins` section

**Implementation:**
```javascript
minMaxVariants: ({ matchVariant }) => {
  matchVariant(
    'min',
    (value) => `@media (min-width: ${value})`,
    { values: {}, sort: (a, z) => parseFloat(a.value) - parseFloat(z.value) }
  )
  matchVariant(
    'max',
    (value) => `@media (max-width: ${value})`,
    { values: {}, sort: (a, z) => parseFloat(z.value) - parseFloat(a.value) }
  )
}
```

**Usage examples:**
- `min-[768px]:flex` → `@media (min-width: 768px) { .flex { ... } }`
- `max-[1024px]:hidden` → `@media (max-width: 1024px) { .hidden { ... } }`

**Challenge:** Sorting by numeric value (min ascending, max descending)
**Solution:** Use `sort` function in `matchVariant` (may need API enhancement)

**Extraction:** Update `src/lib/defaultExtractor.js` to match `min-[...]` and `max-[...]`

---

## Phase 4: Configuration & API Enhancements

### 4.1 `@config` Directive Support
**File:** `src/lib/expandTailwindAtRules.js` (main processing pipeline)

**Goal:** Allow per-CSS-file config specification
```css
@config "./tailwind.admin.config.js";
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Implementation approach:**
1. Add new at-rule handler before `@tailwind` processing
2. Parse `@config` path (relative to CSS file location)
3. Load specified config file via `lilconfig`
4. Merge with or replace default config
5. Process remaining `@tailwind` directives with custom config

**Complexity:** Moderate - requires config loading refactor

---

### 4.2 Relative Content Paths - `relative: true`
**File:** `src/lib/setupContextUtils.js` (configuration resolution, ~lines 100-200)

**Goal:** Resolve content globs relative to config file location
```javascript
module.exports = {
  relative: true,
  content: ['./src/**/*.html'], // relative to config file, not process.cwd()
}
```

**Implementation:**
1. Detect `relative: true` in config
2. Get config file directory via `path.dirname(configPath)`
3. Resolve all content paths using `path.resolve(configDir, contentPath)`
4. Pass resolved absolute paths to `fast-glob`

**Complexity:** Low - straightforward path resolution

---

### 4.3 Font Feature Settings
**File:** `src/corePlugins.js` - `fontFamily` plugin (lines ~837-868)

**Goal:** Support `font-feature-settings` alongside `font-family`
```javascript
theme: {
  fontFamily: {
    sans: ['Inter var', { fontFeatureSettings: '"cv11", "ss01"' }]
  }
}
```

**Implementation:**
```javascript
fontFamily: ({ matchUtilities, theme }) => {
  matchUtilities(
    {
      font: (value) => {
        let [fontFamily, options] = Array.isArray(value) ? value : [value, {}]
        return {
          'font-family': Array.isArray(fontFamily) ? fontFamily.join(', ') : fontFamily,
          ...(options.fontFeatureSettings && {
            'font-feature-settings': options.fontFeatureSettings
          }),
        }
      },
    },
    { values: theme('fontFamily'), type: ['lookup', 'generic-name', 'family-name'] }
  )
}
```

**Complexity:** Low - object value handling

---

### 4.4 `matchUtilities` Modifier Support
**File:** `src/lib/setupContextUtils.js` (lines 329-380)

**Goal:** Support opacity modifiers on utilities created with `matchUtilities`
```html
<div class="bg-red-500/50">  <!-- 50% opacity -->
```

**Current status:** Already supported for colors via `alpha` modifier
**Enhancement:** Generalize to custom modifiers via `modifiers` option

**Implementation:**
- Check if `matchUtilities` already handles modifiers (it likely does via `coerceValue()`)
- If not, add modifier extraction before value coercion
- Pass modifier to utility function as second parameter

**Complexity:** Low - likely already implemented

---

### 4.5 Fallback Plugin System
**File:** `src/lib/generateRules.js` (candidate rule matching, ~lines 350-450)

**Goal:** Handle ambiguous arbitrary values by trying multiple plugins
```html
<div class="inset-[5px]">  <!-- Could be top+right+bottom+left OR inset-inline+inset-block -->
```

**Implementation:**
- When multiple plugins match a candidate, try generating rules with each
- If one succeeds and others fail, use the successful one
- If multiple succeed, use explicit precedence order

**Complexity:** Medium - requires plugin ordering and error handling

---

### 4.6 `matchVariant` Sort Function
**File:** `src/lib/setupContextUtils.js` (variant API, ~lines 380-450)

**Goal:** Custom sort order for variants with arbitrary values
```javascript
matchVariant('min', (value) => `@media (min-width: ${value})`, {
  sort: (a, z) => parseFloat(a.value) - parseFloat(z.value)
})
```

**Check:** May already be implemented - verify in `setupContextUtils.js`
**If not:** Add `sort` option handling to variant registration

**Complexity:** Low if API exists, Medium if needs implementation

---

## Phase 5: Content Extraction Updates

**File:** `src/lib/defaultExtractor.js` (lines 1-27)

**Add patterns for new variants:**
```javascript
// Current patterns include arbitrary variants: /(\[&.*?\]:[^<>"'`\s]*)/
// Add these:

/(\baria-\[[^\]]+\]:[^<>"'`\s]*)/.source,        // aria-[checked]:utility
/(\bdata-\[[^\]]+\]:[^<>"'`\s]*)/.source,        // data-[state=open]:utility
/(\bsupports-\[[^\]]+\]:[^<>"'`\s]*)/.source,    // supports-[display:grid]:utility
/(\bmin-\[[^\]]+\]:[^<>"'`\s]*)/.source,         // min-[768px]:utility
/(\bmax-\[[^\]]+\]:[^<>"'`\s]*)/.source,         // max-[1024px]:utility
```

**Testing:** Ensure extraction catches all new variant patterns in HTML/JSX/template files

---

## Phase 6: Testing Strategy

### 6.1 Create Test File
**File:** `tests/v3.2-features.test.js` (new file, ~300-400 lines)

**Test structure:**
```javascript
describe('v3.2 utilities', () => {
  test('break-keep utility', () => { ... })
  test('collapse visibility', () => { ... })
  test('fill-none and stroke-none', () => { ... })
  test('baseline alignment utilities', () => { ... })
  test('negative outline-offset', () => { ... })
})

describe('v3.2 variants', () => {
  test('aria variants with predefined values', () => { ... })
  test('aria variants with arbitrary values', () => { ... })
  test('data variants with arbitrary values', () => { ... })
  test('supports variant with feature queries', () => { ... })
  test('min/max media query variants', () => { ... })
})

describe('v3.2 configuration', () => {
  test('@config directive loads custom config', () => { ... })
  test('relative content paths resolve correctly', () => { ... })
  test('font-feature-settings in font-family', () => { ... })
})
```

### 6.2 Update Existing Tests
**Files:** `tests/*.test.js`
- Ensure no regressions in existing v3.1 features
- Run full test suite: `npm test`

### 6.3 Integration Tests
**Directory:** `integrations/`
- Test with Webpack, Vite, Parcel, Rollup
- Verify new variants work in real-world bundlers
- Check that tarballs install correctly

---

## Phase 7: Documentation Updates

### 7.1 Update CHANGELOG.md
**File:** `CHANGELOG.md`

**Add v3.2.0 section:**
```markdown
## [3.2.0] - 2026-01-XX

### Added

**New Utilities:**
- `break-keep` - Prevent breaking within words (word-break: keep-all)
- `collapse` - Collapse table rows/columns (visibility: collapse)
- `fill-none` - No SVG fill (fill: none)
- `stroke-none` - No SVG stroke (stroke: none)
- `place-content-baseline`, `place-items-baseline`, `content-baseline` - Baseline alignment
- Negative `outline-offset-*` values

**New Variants:**
- `aria-*` - Style based on ARIA attributes (aria-checked:, aria-[disabled]:)
- `data-*` - Style based on data attributes (data-[state=open]:, data-[loading]:)
- `supports-*` - CSS feature query variant (supports-[display:grid]:)
- `min-*` / `max-*` - Arbitrary min/max-width media queries (min-[768px]:, max-[1024px]:)

**Configuration:**
- `@config` directive for per-file configuration
- `relative: true` option for content paths relative to config file
- Font feature settings support in `fontFamily` theme
- Modifier support in `matchUtilities`
- Fallback plugin system for ambiguous arbitrary values
- Sort function for `matchVariant`

### Changed
- Updated version-specific build system to support v3.2.0
- Enhanced extractor patterns for new variant types
```

### 7.2 Update README.md
**File:** `README.md`

**Update lines 22-56** - Change "What's New in v3.1" to "What's New in v3.2":
- List all v3.2 utilities and variants
- Provide usage examples
- Explain new configuration options

**Update lines 57-64** - Migration plan status:
```markdown
- **v3.1** - ✅ **DONE** - Arbitrary variants, new utilities, new variants
- **v3.2** - ✅ **DONE** - ARIA/data variants, @supports, min/max queries, logical properties
- **v3.4** - Modern CSS features (subgrid, :has(), text-wrap, size-* utilities)
```

### 7.3 Update CLAUDE.md
**File:** `CLAUDE.md`

**Lines 1-10:** Update version to v3.2.0
**Lines 22-64:** Update feature list and implementation status

---

## Phase 8: Build & Package

### 8.1 Build v3.2.0
```bash
npm run build
```

**Expected output:**
- `lib/3.1.0/` - Preserved from previous build
- `lib/3.2.0/` - New build output
- `lib/*.js` - Symlinks updated to point to `3.2.0/`

### 8.2 Package v3.2.0
```bash
npm run pack
```

**Expected output:**
- `dist/3.1.0/tailwindcss-3.1.0.tgz` - Preserved
- `dist/3.2.0/tailwindcss-3.2.0.tgz` - New tarball
- `dist/tailwindcss-3.2.0.tgz` - Convenience copy

### 8.3 Test Installation
```bash
cd /tmp
mkdir test-v3.2
cd test-v3.2
npm init -y
npm install /home/ktaylor/Projects/tailwindcss/dist/3.2.0/tailwindcss-3.2.0.tgz
npx tailwindcss init
```

Create test HTML with v3.2 features and verify CSS generation.

---

## Phase 9: Version Control

### 9.1 Commit Changes
```bash
git add .
git commit -m "feat: Tailwind CSS v3.2.0 JavaScript-only fork

- Add new utilities: break-keep, collapse, fill-none, stroke-none, baseline alignment, negative outline-offset
- Add new variants: aria-*, data-*, supports-*, min-*, max-*
- Add configuration features: @config directive, relative paths, font-feature-settings
- Add comprehensive test suite for v3.2 features
- Preserve v3.1.0 build artifacts alongside v3.2.0
- Update documentation and changelog

Adapted from Tailwind CSS v3.2 (official release) while maintaining JavaScript-only architecture (no Rust/Oxide dependencies)."
```

### 9.2 Create Git Tag
```bash
git tag -a v3.2.0 -m "Tailwind CSS v3.2.0 (JavaScript-only fork)"
```

### 9.3 Optional: Push to Remote
```bash
git push origin javascript-fork-v3.2.0
git push origin v3.2.0
```

---

## Critical Files Reference

**Files to modify (in order of changes):**

1. `package.json` - Version bump
2. `src/corePlugins.js` - All utilities and variants (~300 lines of changes)
3. `src/public/default-theme.js` - Add `aria` and `data` theme keys
4. `src/lib/defaultExtractor.js` - Add extraction patterns for new variants
5. `src/lib/expandTailwindAtRules.js` - Add `@config` directive support
6. `src/lib/setupContextUtils.js` - Add relative path resolution
7. `tests/v3.2-features.test.js` - Complete test suite (NEW FILE)
8. `CHANGELOG.md` - Document v3.2.0 changes
9. `README.md` - Update feature list and migration status
10. `CLAUDE.md` - Update version and feature references

**Files to preserve:**
- `lib/3.1.0/*` - Keep all v3.1.0 build artifacts
- `dist/3.1.0/*` - Keep v3.1.0 tarball

---

## Verification Checklist

### Build Verification
- [ ] `npm install` completes without errors
- [ ] `npm run build` generates `lib/3.2.0/` directory
- [ ] Symlinks in `lib/` point to `3.2.0/` files
- [ ] `npm run pack` creates `dist/3.2.0/tailwindcss-3.2.0.tgz`
- [ ] Tarball installs correctly in test project

### Feature Verification
- [ ] All new utilities generate correct CSS
- [ ] `aria-*` variant works with predefined and arbitrary values
- [ ] `data-*` variant works with arbitrary values
- [ ] `supports-*` variant generates `@supports` queries
- [ ] `min-*` / `max-*` variants generate media queries
- [ ] Negative outline-offset values work
- [ ] Baseline alignment utilities render correctly

### Testing Verification
- [ ] `npm test` passes all tests
- [ ] New v3.2 test file has 100% coverage of new features
- [ ] No regressions in v3.1 features
- [ ] Integration tests pass with bundlers

### Documentation Verification
- [ ] CHANGELOG.md has complete v3.2.0 section
- [ ] README.md reflects v3.2 features
- [ ] CLAUDE.md updated with v3.2 patterns
- [ ] Usage examples in README work correctly

### End-to-End Verification
1. Install tarball in fresh project
2. Create `tailwind.config.js` with v3.2 features
3. Create HTML with all new utilities and variants
4. Run `npx tailwindcss -i input.css -o output.css`
5. Verify generated CSS contains all expected rules
6. Test in browser that styles apply correctly

---

## Estimated Implementation Order

1. **Day 1: Simple Utilities** (2-3 hours)
   - break-keep, collapse, fill-none, stroke-none
   - Baseline alignment utilities
   - Negative outline-offset

2. **Day 2: ARIA/Data Variants** (3-4 hours)
   - aria-* variant with theme
   - data-* variant
   - Extraction patterns
   - Basic tests

3. **Day 3: Media/Feature Variants** (4-5 hours)
   - supports-* variant
   - min-* / max-* variants
   - Extraction patterns
   - Complex tests

4. **Day 4: Configuration Features** (4-6 hours)
   - @config directive
   - Relative paths
   - Font feature settings
   - matchUtilities enhancements

5. **Day 5: Testing & Documentation** (3-4 hours)
   - Comprehensive test suite
   - Update all documentation
   - Build and package
   - End-to-end verification

**Total Estimate:** 16-22 hours of focused development

---

## Notes & Considerations

### Rust/Oxide Avoidance
- All features implemented in pure JavaScript/TypeScript
- No binary dependencies or native compilation
- PostCSS-based processing throughout
- Regex-based extraction (not state machines)

### Backwards Compatibility
- v3.1.0 artifacts preserved in `lib/3.1.0/`
- Symlinks ensure existing projects continue working
- No breaking changes to existing APIs

### Performance Considerations
- New variant extraction may slightly slow content scanning
- Consider caching for `@supports` / `min-*` / `max-*` variants
- Test with large projects to ensure acceptable performance

### Future Migration Path
- v3.3: Container queries, logical property enhancements
- v3.4: Subgrid, :has(), text-wrap utilities
- Each version preserves previous builds

### Known Limitations
- `matchVariant` sort function may not exist in v3.1 codebase (need to implement)
- Complex `@supports` queries with nested parentheses need careful parsing
- Min/max media queries need proper numeric sorting

---

## Quick Reference: v3.2 Features at a Glance

### New Utilities (8)
| Utility | CSS Property | Use Case |
|---------|--------------|----------|
| `break-keep` | `word-break: keep-all` | Keep words intact (CJK languages) |
| `collapse` | `visibility: collapse` | Collapse table rows/columns |
| `fill-none` | `fill: none` | No SVG fill |
| `stroke-none` | `stroke: none` | No SVG stroke |
| `place-content-baseline` | `place-content: baseline` | Grid/flex baseline alignment |
| `place-items-baseline` | `place-items: baseline` | Grid/flex baseline alignment |
| `content-baseline` | `align-content: baseline` | Baseline content alignment |
| `-outline-offset-*` | `outline-offset: -Xpx` | Negative outline offset |

### New Variants (4)
| Variant | Selector Pattern | Example |
|---------|------------------|---------|
| `aria-*` | `[aria-{state}="..."]` | `aria-checked:bg-blue-500` |
| `data-*` | `[data-{attr}="..."]` | `data-[state=open]:block` |
| `supports-*` | `@supports (prop: val)` | `supports-[display:grid]:grid` |
| `min-*/max-*` | `@media (min/max-width: X)` | `min-[768px]:flex` |

### Configuration (6)
| Feature | Purpose | Complexity |
|---------|---------|------------|
| `@config` directive | Per-file configuration | Moderate |
| `relative: true` | Config-relative content paths | Low |
| Font feature settings | Advanced typography | Low |
| `matchUtilities` modifiers | Custom modifiers | Low (likely exists) |
| Fallback plugins | Ambiguous value handling | Medium |
| `matchVariant` sort | Custom variant ordering | Low-Medium |
