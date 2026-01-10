# Migrating to v3.1

This guide covers migrating from v3.0.24 to v3.1.0 of the JavaScript-only fork of Tailwind CSS.

## Overview

Tailwind CSS v3.1.0 introduces powerful new features while maintaining full backwards compatibility with v3.0.24. No breaking changes were introduced, so upgrading is straightforward.

## What's New

### Arbitrary Variants

The biggest feature in v3.1 is **arbitrary variants**, which allow you to use any selector on-the-fly without writing custom CSS.

#### Pseudo-classes

Apply styles based on any pseudo-class:

```html
<!-- Apply styles on hover -->
<div class="[&:hover]:text-blue-500">Hover me</div>

<!-- Style specific children -->
<div class="[&:nth-child(3)]:font-bold">Third child is bold</div>

<!-- First and last child -->
<div class="[&:first-child]:mt-0 [&:last-child]:mb-0">No outer spacing</div>

<!-- Focus visible -->
<button class="[&:focus-visible]:ring-2">Accessible focus</button>
```

#### Descendant and Child Selectors

Target nested elements:

```html
<!-- Style all paragraph children -->
<div class="[&_p]:text-gray-600">
  <p>This will be gray</p>
  <div><p>This will also be gray</p></div>
</div>

<!-- Direct children only -->
<div class="[&>li]:border-b">
  <li>Has border</li>
  <ul><li>No border (not direct child)</li></ul>
</div>

<!-- Sibling selectors -->
<div class="[&+div]:mt-4">Space after this</div>
```

#### Pseudo-elements

Style pseudo-elements inline:

```html
<!-- Before/after content -->
<div class="[&::before]:content-['★'] [&::before]:mr-2">
  Starred item
</div>

<!-- First line styling -->
<p class="[&::first-line]:font-bold">
  This line is bold<br>
  This line is normal
</p>
```

#### Attribute Selectors

Style based on attributes:

```html
<!-- Data attributes -->
<div class="[&[data-active]]:bg-blue-500">Active state</div>

<!-- ARIA attributes -->
<button class="[&[aria-pressed='true']]:bg-gray-700">Toggle</button>

<!-- Type attribute -->
<input class="[&[type='checkbox']]:mr-2" />
```

#### Stacking Arbitrary Variants

Combine multiple arbitrary variants:

```html
<!-- Hover on first child -->
<div class="[&:hover]:[&:first-child]:bg-blue-500">
  Special hover effect
</div>
```

### New Utilities

#### Table Border Spacing

Control spacing between table borders:

```html
<!-- All directions -->
<table class="border-spacing-4">
  ...
</table>

<!-- Horizontal and vertical separately -->
<table class="border-spacing-x-2 border-spacing-y-8">
  ...
</table>
```

Available values: All spacing scale values (0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96, px)

#### Logical Text Alignment

Use logical properties for text alignment:

```html
<!-- Aligns to the start/end based on text direction -->
<p class="text-start">Aligns to start (left in LTR, right in RTL)</p>
<p class="text-end">Aligns to end (right in LTR, left in RTL)</p>
```

This is especially useful for internationalization where text direction might change.

#### Dense Grid Flow

Control how auto-placed items flow in CSS Grid:

```html
<!-- Fill gaps with smaller items -->
<div class="grid grid-flow-dense">
  ...
</div>

<!-- Dense packing by row or column -->
<div class="grid grid-flow-row-dense">
  ...
</div>
<div class="grid grid-flow-col-dense">
  ...
</div>
```

#### Mix Blend Plus Lighter

Additional blend mode utility:

```html
<div class="mix-blend-plus-lighter">
  ...
</div>
```

### New Variants

#### Backdrop Variant

Style the `::backdrop` pseudo-element for `<dialog>` elements:

```html
<dialog class="backdrop:bg-black/50">
  <div class="p-4">Dialog content</div>
</dialog>
```

#### Enabled Variant

Style enabled form elements (counterpart to `disabled:`):

```html
<button class="enabled:bg-blue-500 disabled:bg-gray-300">
  Submit
</button>

<input class="enabled:border-gray-300 disabled:border-gray-100" />
```

#### Optional Variant

Style optional form fields:

```html
<input class="optional:border-gray-300 required:border-blue-500" />
```

#### Contrast Variants

Adapt to user's contrast preferences:

```html
<div class="text-gray-600 contrast-more:text-black contrast-less:text-gray-400">
  Text adapts to user's contrast settings
</div>

<!-- In high contrast mode: text is black -->
<!-- In reduced contrast mode: text is lighter gray -->
```

## Upgrading

### Step 1: Update Package

```bash
# If installing from tarball
npm install path/to/dist/3.1.0/tailwindcss-3.1.0.tgz

# If using npm link
npm unlink tailwindcss
cd /path/to/tailwindcss-fork
git checkout javascript-fork-v3.1
npm run build
npm link
cd /path/to/your-project
npm link tailwindcss
```

### Step 2: Rebuild Your CSS

```bash
# Rebuild your Tailwind CSS
npm run build
```

### Step 3: Test Your Application

All existing utilities and variants continue to work exactly as before. Test your application to ensure everything works as expected.

### Step 4: Start Using New Features

You can immediately start using the new utilities and variants in your HTML. No configuration changes are required.

## Compatibility Notes

### Browser Support

All new features use standard CSS properties and selectors supported by modern browsers:

- **Arbitrary variants**: All modern browsers
- **border-spacing**: All modern browsers
- **text-start/end**: All modern browsers
- **grid-flow-dense**: All browsers with CSS Grid support
- **backdrop**: Browsers supporting `<dialog>` element
- **contrast-more/less**: Browsers supporting `prefers-contrast` media query

### No Breaking Changes

This release is 100% backwards compatible with v3.0.24:

- All existing utilities work exactly the same
- All existing variants work exactly the same
- All configuration options remain unchanged
- Plugin API remains unchanged

### Known Limitations

**Arbitrary Variants:**
- Stacking arbitrary variants with regular variants (e.g., `hover:[&:first-child]:bg-blue`) may not work in all cases
- Very complex selectors may need escaping or simplification
- Arbitrary variants are applied after regular variants

## Examples

### Before and After

#### Styling nth-child Elements

**Before (custom CSS required):**
```css
.my-list li:nth-child(3) {
  @apply text-red-500;
}
```

**After (inline arbitrary variant):**
```html
<li class="[&:nth-child(3)]:text-red-500">Third item</li>
```

#### Styling Child Paragraphs

**Before (custom CSS required):**
```css
.article-content p {
  @apply text-gray-600;
}
```

**After (inline arbitrary variant):**
```html
<div class="[&_p]:text-gray-600">
  <p>Paragraph is gray</p>
</div>
```

#### Table Border Spacing

**Before (custom CSS):**
```css
table {
  border-spacing: 1rem;
}
```

**After (utility class):**
```html
<table class="border-spacing-4">
  ...
</table>
```

## Getting Help

If you encounter any issues:

1. Check the [GitHub Issues](https://github.com/tailwindlabs/tailwindcss/issues) for similar problems
2. Review the test files in `tests/v3.1-features.test.js` for usage examples
3. Refer to the official [Tailwind CSS v3.1 documentation](https://tailwindcss.com/blog/tailwindcss-v3-1)

## Next Steps

- Explore using arbitrary variants to reduce custom CSS
- Update tables to use `border-spacing` utilities
- Use logical properties (`text-start`/`text-end`) for better i18n support
- Leverage new variants for more semantic styling

Happy styling!
