# Field Notes

The learning website for **Web Technologies** (BiUH, 2026): a small, hand-written site
about learning HTML, CSS and JavaScript.

- **Live:** https://chen070218.github.io/my-site/
- **Repository:** https://github.com/Chen070218/my-site

No framework, no package manager, no build step — the files in this repository are exactly
what the browser receives.

## Pages

| File | What it is |
| --- | --- |
| `index.html` | Hero image, overview of the site and what I practised |
| `quotes.html` | 18 quotes, a random-quote hero and the full list |
| `project.html` | Six project ideas with the skill each one teaches |
| `machine.html` | The useless machine and a 30-second bug-catching game |
| `about.html` | Who writes it, how it is built, credits and contact |

## Requirements from the assignment

| # | Item | Where |
| --- | --- | --- |
| 1 | Index page with a hero image and an overview | `index.html`, `images/hero-field-notes.webp` |
| 2 | Quotes page with at least 15 quotes | `quotes.html` — 18 quotes |
| 3 | DRY navigation, written once and injected with JavaScript | `nav.html`, `nav.js` |
| 4 | Project page with at least five project ideas | `project.html` — six ideas |
| 5 | Styled quotes page with a random quote in the hero | `quotes.html`, `quotes.js`, `style.css` |
| 6 | Useless machine page | `machine.html` — `#machine` |
| 7 | Interactive game on the machine page | `machine.html` — Bug squash, `machine.js` |
| 8 | Whole site styled and finalised, working links, images and phone layout | `style.css` + all pages |

The remaining items (Git installed, repository initialised, GitHub remote, pushed, live) are
satisfied by this repository and its GitHub Pages deployment.

## How to run it

Because the navigation is fetched from `nav.html`, the site needs a local HTTP server; opening
`index.html` straight from disk will show the fallback navigation instead of the fetched
fragment.

- VS Code → **Live Server** → *Open with Live Server*, or
- any static server, for example:

```sh
python -m http.server 4600
```

then open <http://localhost:4600/>.

## How it works

- **Navigation** (`nav.html` + `nav.js`): the menu is written once as an HTML fragment.
  `nav.js` fetches it into `[data-nav]` on every page and sets `aria-current="page"` on the
  current link. Adding a page means editing one file.
- **Random quote** (`quotes.js`): reads the quotes that are already in the list on the page,
  picks one at random and swaps the hero text. No second copy of the data.
- **Useless machine** (`machine.js`): a state flag, an `aria-pressed` button and one
  `setTimeout`. The arm rotates with CSS; the machine switches itself off after 900 ms.
- **Bug squash** (`machine.js`): nine buttons, a random bug position, a 1 s hop timer and a
  30 s countdown. Score, misses, time and best (in `localStorage`) are shown; the status
  message is announced with `aria-live="polite"`.
- **Styling** (`style.css`): CSS custom properties for the palette, a paper-grid background
  built from two gradients, flexbox and grid for the layout, `clamp()` for type, and a
  `prefers-color-scheme: dark` palette. Every animation is disabled under
  `prefers-reduced-motion`.

## Accessibility

- Skip link, landmarks (`header`, `nav`, `main`, `footer`), one `h1` per page and ordered
  headings.
- All controls are native `<button>`/`<a>` elements; the game is playable with the keyboard.
- Visible `:focus-visible` ring, labelled tiles, `aria-live` status messages.
- Colour contrast checked with axe in both light and dark colour schemes: no violations.
- Reduced-motion support for the arm and the tile feedback.

## Images and credits

The hero illustration, the Open Graph cover and both icons were drawn for this project with
a small Python/Pillow script — no stock images and no third-party fonts. The full list of
quotes, with authors, is on `quotes.html`. Text and code: Chen Xiangyang, 2026.
