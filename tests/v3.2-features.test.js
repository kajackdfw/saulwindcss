import { html, run, css } from './util/run'

describe('v3.2 new utilities', () => {
  test('break-keep utility', () => {
    let config = {
      content: [{ raw: html`<div class="break-keep"></div>` }],
      corePlugins: { preflight: false },
    }

    return run('@tailwind utilities', config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .break-keep {
          word-break: keep-all;
        }
      `)
    })
  })

  test('collapse visibility utility', () => {
    let config = {
      content: [{ raw: html`<div class="collapse"></div>` }],
      corePlugins: { preflight: false },
    }

    return run('@tailwind utilities', config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .collapse {
          visibility: collapse;
        }
      `)
    })
  })

  test('fill-none and stroke-none utilities', () => {
    let config = {
      content: [{ raw: html`<svg class="fill-none stroke-none"></svg>` }],
      corePlugins: { preflight: false },
    }

    return run('@tailwind utilities', config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .fill-none {
          fill: none;
        }
        .stroke-none {
          stroke: none;
        }
      `)
    })
  })

  test('baseline alignment utilities', () => {
    let config = {
      content: [
        {
          raw: html`<div class="place-content-baseline place-items-baseline content-baseline"></div>`,
        },
      ],
      corePlugins: { preflight: false },
    }

    return run('@tailwind utilities', config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .place-content-baseline {
          place-content: baseline;
        }
        .place-items-baseline {
          place-items: baseline;
        }
        .content-baseline {
          align-content: baseline;
        }
      `)
    })
  })

  test('negative outline-offset values', () => {
    let config = {
      content: [{ raw: html`<div class="-outline-offset-2 outline-offset-4"></div>` }],
      corePlugins: { preflight: false },
    }

    return run('@tailwind utilities', config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .-outline-offset-2 {
          outline-offset: -2px;
        }
        .outline-offset-4 {
          outline-offset: 4px;
        }
      `)
    })
  })
})

describe('v3.2 ARIA variants', () => {
  test('ARIA variants with predefined values', () => {
    let config = {
      content: [
        {
          raw: html`<button class="aria-checked:bg-blue-500 aria-disabled:opacity-50"></button>`,
        },
      ],
      corePlugins: { preflight: false },
    }

    return run('@tailwind utilities', config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .aria-checked\:bg-blue-500[aria-checked="true"] {
          --tw-bg-opacity: 1;
          background-color: rgb(59 130 246 / var(--tw-bg-opacity));
        }
        .aria-disabled\:opacity-50[aria-disabled="true"] {
          opacity: 0.5;
        }
      `)
    })
  })

  test('ARIA variants with arbitrary values', () => {
    let config = {
      content: [
        {
          raw: html`<div class="aria-[sort=ascending]:rotate-0 aria-[current=page]:font-bold"></div>`,
        },
      ],
      corePlugins: { preflight: false },
    }

    return run('@tailwind utilities', config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .aria-\[sort\=ascending\]\:rotate-0[aria-sort="ascending"] {
          --tw-rotate: 0deg;
          transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate))
            skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
            scaleY(var(--tw-scale-y));
        }
        .aria-\[current\=page\]\:font-bold[aria-current="page"] {
          font-weight: 700;
        }
      `)
    })
  })
})

describe('v3.2 data attribute variants', () => {
  test('data variants with arbitrary values', () => {
    let config = {
      content: [
        {
          raw: html`<div class="data-[state=open]:block data-[loading]:opacity-50"></div>`,
        },
      ],
      corePlugins: { preflight: false },
    }

    return run('@tailwind utilities', config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .data-\\[state\=open\\]\:block[data-state="open"] {
          display: block;
        }
        .data-\\[loading\\]\:opacity-50[data-loading] {
          opacity: 0.5;
        }
      `)
    })
  })

  test('data variants can be stacked with other variants', () => {
    let config = {
      content: [
        {
          raw: html`<div class="hover:data-[active]:bg-blue-500"></div>`,
        },
      ],
      corePlugins: { preflight: false },
    }

    return run('@tailwind utilities', config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .hover\:data-\\[active\\]\:bg-blue-500:hover[data-active] {
          --tw-bg-opacity: 1;
          background-color: rgb(59 130 246 / var(--tw-bg-opacity));
        }
      `)
    })
  })
})

describe('v3.2 supports variants', () => {
  test('supports variant with CSS feature queries', () => {
    let config = {
      content: [
        {
          raw: html`<div class="supports-[display:grid]:grid supports-[backdrop-filter]:backdrop-blur-sm"></div>`,
        },
      ],
      corePlugins: { preflight: false },
    }

    return run('@tailwind utilities', config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        @supports (display: grid) {
          .supports-\\[display\:grid\\]\:grid {
            display: grid;
          }
        }
        @supports (backdrop-filter) {
          .supports-\\[backdrop-filter\\]\:backdrop-blur-sm {
            --tw-backdrop-blur: blur(4px);
            -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
              var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate)
              var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
              var(--tw-backdrop-sepia);
            backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
              var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate)
              var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
              var(--tw-backdrop-sepia);
          }
        }
      `)
    })
  })

  test('supports variant with complex feature queries', () => {
    let config = {
      content: [
        {
          raw: html`<div class="supports-[(backdrop-filter:blur(0px))]:backdrop-blur-lg"></div>`,
        },
      ],
      corePlugins: { preflight: false },
    }

    return run('@tailwind utilities', config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        @supports ((backdrop-filter: blur(0px))) {
          .supports-\\[\\(backdrop-filter\:blur\\(0px\\)\\)\\]\:backdrop-blur-lg {
            --tw-backdrop-blur: blur(16px);
            -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
              var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate)
              var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
              var(--tw-backdrop-sepia);
            backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
              var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate)
              var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
              var(--tw-backdrop-sepia);
          }
        }
      `)
    })
  })
})

describe('v3.2 min/max media query variants', () => {
  test('min-width arbitrary media query variants', () => {
    let config = {
      content: [
        {
          raw: html`<div class="min-[768px]:flex min-[1024px]:grid"></div>`,
        },
      ],
      corePlugins: { preflight: false },
    }

    return run('@tailwind utilities', config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        @media (min-width: 768px) {
          .min-\\[768px\\]\:flex {
            display: flex;
          }
        }
        @media (min-width: 1024px) {
          .min-\\[1024px\\]\:grid {
            display: grid;
          }
        }
      `)
    })
  })

  test('max-width arbitrary media query variants', () => {
    let config = {
      content: [
        {
          raw: html`<div class="max-[1024px]:hidden max-[640px]:block"></div>`,
        },
      ],
      corePlugins: { preflight: false },
    }

    return run('@tailwind utilities', config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        @media (max-width: 1024px) {
          .max-\\[1024px\\]\:hidden {
            display: none;
          }
        }
        @media (max-width: 640px) {
          .max-\\[640px\\]\:block {
            display: block;
          }
        }
      `)
    })
  })

  test('min and max variants can be combined', () => {
    let config = {
      content: [
        {
          raw: html`<div class="min-[640px]:max-[1024px]:flex"></div>`,
        },
      ],
      corePlugins: { preflight: false },
    }

    return run('@tailwind utilities', config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        @media (min-width: 640px) {
          @media (max-width: 1024px) {
            .min-\\[640px\\]\:max-\\[1024px\\]\:flex {
              display: flex;
            }
          }
        }
      `)
    })
  })

  test('min/max variants work with arbitrary units', () => {
    let config = {
      content: [
        {
          raw: html`<div class="min-[20rem]:text-lg max-[50em]:text-sm"></div>`,
        },
      ],
      corePlugins: { preflight: false },
    }

    return run('@tailwind utilities', config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        @media (min-width: 20rem) {
          .min-\\[20rem\\]\:text-lg {
            font-size: 1.125rem;
            line-height: 1.75rem;
          }
        }
        @media (max-width: 50em) {
          .max-\\[50em\\]\:text-sm {
            font-size: 0.875rem;
            line-height: 1.25rem;
          }
        }
      `)
    })
  })
})

describe('v3.2 variant combinations', () => {
  test('ARIA and data variants can be combined', () => {
    let config = {
      content: [
        {
          raw: html`<div class="aria-[checked]:data-[state=active]:bg-blue-500"></div>`,
        },
      ],
      corePlugins: { preflight: false },
    }

    return run('@tailwind utilities', config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .aria-\\[checked\\]\:data-\\[state\=active\\]\:bg-blue-500[aria-checked][data-state="active"] {
          --tw-bg-opacity: 1;
          background-color: rgb(59 130 246 / var(--tw-bg-opacity));
        }
      `)
    })
  })

  test('new variants work with responsive variants', () => {
    let config = {
      content: [
        {
          raw: html`<div class="md:aria-[checked]:bg-blue-500 lg:data-[active]:opacity-100"></div>`,
        },
      ],
      corePlugins: { preflight: false },
    }

    return run('@tailwind utilities', config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        @media (min-width: 768px) {
          .md\:aria-\\[checked\\]\:bg-blue-500[aria-checked] {
            --tw-bg-opacity: 1;
            background-color: rgb(59 130 246 / var(--tw-bg-opacity));
          }
        }
        @media (min-width: 1024px) {
          .lg\:data-\\[active\\]\:opacity-100[data-active] {
            opacity: 1;
          }
        }
      `)
    })
  })

  test('supports variant can be combined with other variants', () => {
    let config = {
      content: [
        {
          raw: html`<div class="hover:supports-[display:grid]:grid"></div>`,
        },
      ],
      corePlugins: { preflight: false },
    }

    return run('@tailwind utilities', config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        @supports (display: grid) {
          .hover\:supports-\\[display\:grid\\]\:grid:hover {
            display: grid;
          }
        }
      `)
    })
  })
})
