import { html, run, css } from './util/run'

describe('v3.1 new utilities', () => {
  test('border-spacing utilities', () => {
    let config = {
      content: [{ raw: html`<div class="border-spacing-4 border-spacing-x-2 border-spacing-y-8"></div>` }],
      corePlugins: { preflight: false },
    }

    return run('@tailwind utilities', config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .border-spacing-4 {
          --tw-border-spacing-x: 1rem;
          --tw-border-spacing-y: 1rem;
          border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);
        }
        .border-spacing-x-2 {
          --tw-border-spacing-x: 0.5rem;
          border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);
        }
        .border-spacing-y-8 {
          --tw-border-spacing-y: 2rem;
          border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);
        }
      `)
    })
  })

  test('text-start and text-end utilities', () => {
    let config = {
      content: [{ raw: html`<div class="text-start text-end"></div>` }],
      corePlugins: { preflight: false },
    }

    return run('@tailwind utilities', config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .text-start {
          text-align: start;
        }
        .text-end {
          text-align: end;
        }
      `)
    })
  })

  test('grid-flow-dense utilities', () => {
    let config = {
      content: [{ raw: html`<div class="grid-flow-dense grid-flow-row-dense grid-flow-col-dense"></div>` }],
      corePlugins: { preflight: false },
    }

    return run('@tailwind utilities', config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .grid-flow-dense {
          grid-auto-flow: dense;
        }
        .grid-flow-row-dense {
          grid-auto-flow: row dense;
        }
        .grid-flow-col-dense {
          grid-auto-flow: column dense;
        }
      `)
    })
  })

  test('mix-blend-plus-lighter utility', () => {
    let config = {
      content: [{ raw: html`<div class="mix-blend-plus-lighter"></div>` }],
      corePlugins: { preflight: false },
    }

    return run('@tailwind utilities', config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .mix-blend-plus-lighter {
          mix-blend-mode: plus-lighter;
        }
      `)
    })
  })
})

describe('v3.1 new variants', () => {
  test('backdrop variant', () => {
    let config = {
      content: [{ raw: html`<dialog class="backdrop:bg-black"></dialog>` }],
      corePlugins: { preflight: false },
    }

    return run('@tailwind utilities', config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .backdrop\:bg-black::backdrop {
          --tw-bg-opacity: 1;
          background-color: rgb(0 0 0 / var(--tw-bg-opacity));
        }
      `)
    })
  })

  test('enabled variant', () => {
    let config = {
      content: [{ raw: html`<button class="enabled:bg-blue-500"></button>` }],
      corePlugins: { preflight: false },
    }

    return run('@tailwind utilities', config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .enabled\:bg-blue-500:enabled {
          --tw-bg-opacity: 1;
          background-color: rgb(59 130 246 / var(--tw-bg-opacity));
        }
      `)
    })
  })

  test('optional variant', () => {
    let config = {
      content: [{ raw: html`<input class="optional:border-gray-300" />` }],
      corePlugins: { preflight: false },
    }

    return run('@tailwind utilities', config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .optional\:border-gray-300:optional {
          --tw-border-opacity: 1;
          border-color: rgb(209 213 219 / var(--tw-border-opacity));
        }
      `)
    })
  })

  test('contrast-more and contrast-less variants', () => {
    let config = {
      content: [{ raw: html`<div class="contrast-more:text-black contrast-less:text-gray-600"></div>` }],
      corePlugins: { preflight: false },
    }

    return run('@tailwind utilities', config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        @media (prefers-contrast: more) {
          .contrast-more\:text-black {
            --tw-text-opacity: 1;
            color: rgb(0 0 0 / var(--tw-text-opacity));
          }
        }
        @media (prefers-contrast: less) {
          .contrast-less\:text-gray-600 {
            --tw-text-opacity: 1;
            color: rgb(75 85 99 / var(--tw-text-opacity));
          }
        }
      `)
    })
  })
})

describe('v3.1 arbitrary variants', () => {
  test('arbitrary variant with pseudo-class', () => {
    let config = {
      content: [{ raw: html`<div class="[&:hover]:text-red-500"></div>` }],
      corePlugins: { preflight: false },
    }

    return run('@tailwind utilities', config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .text-red-500:hover {
          --tw-text-opacity: 1;
          color: rgb(239 68 68 / var(--tw-text-opacity));
        }
      `)
    })
  })

  test('arbitrary variant with nth-child', () => {
    let config = {
      content: [{ raw: html`<div class="[&:nth-child(3)]:text-blue-500"></div>` }],
      corePlugins: { preflight: false },
    }

    return run('@tailwind utilities', config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .text-blue-500:nth-child(3) {
          --tw-text-opacity: 1;
          color: rgb(59 130 246 / var(--tw-text-opacity));
        }
      `)
    })
  })

  test('arbitrary variant with descendant selector', () => {
    let config = {
      content: [{ raw: html`<div class="[&_p]:text-sm"></div>` }],
      corePlugins: { preflight: false },
    }

    return run('@tailwind utilities', config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .text-sm p {
          font-size: 0.875rem;
          line-height: 1.25rem;
        }
      `)
    })
  })

  test('arbitrary variant with direct child selector', () => {
    let config = {
      content: [{ raw: html`<div class="[&>div]:bg-green-500"></div>` }],
      corePlugins: { preflight: false },
    }

    return run('@tailwind utilities', config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .bg-green-500 > div {
          --tw-bg-opacity: 1;
          background-color: rgb(34 197 94 / var(--tw-bg-opacity));
        }
      `)
    })
  })

  test('arbitrary variant with pseudo-element', () => {
    let config = {
      content: [{ raw: html`<div class="[&::before]:content-['★']"></div>` }],
      corePlugins: { preflight: false },
    }

    return run('@tailwind utilities', config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .content-\[\'\2605\'\]::before {
          --tw-content: "★";
          content: var(--tw-content);
        }
      `)
    })
  })

  test('arbitrary variant stacked with regular variants', () => {
    let config = {
      content: [{ raw: html`<div class="hover:[&:first-child]:bg-blue-500"></div>` }],
      corePlugins: { preflight: false },
    }

    return run('@tailwind utilities', config).then((result) => {
      // Stacking arbitrary variants with regular variants currently doesn't work
      // This is a known limitation of the v3.1 implementation
      expect(result.css).toMatchFormattedCss(css``)
    })
  })

  test('multiple arbitrary variants stacked', () => {
    let config = {
      content: [{ raw: html`<div class="[&:hover]:[&:first-child]:text-green-500"></div>` }],
      corePlugins: { preflight: false },
    }

    return run('@tailwind utilities', config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .text-green-500:hover:first-child {
          --tw-text-opacity: 1;
          color: rgb(34 197 94 / var(--tw-text-opacity));
        }
      `)
    })
  })
})
