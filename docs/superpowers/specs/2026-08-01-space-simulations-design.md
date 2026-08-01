# Space Simulations Design

## Goal

Turn the existing self-contained Moon Orbit HTML visualization into the first simulation in a clean, extensible GitHub Pages repository named `space-simulations`, without changing its visual behavior or simulation logic.

## Product shape

The site is a single static workspace with a shared shell and Google Sheets-style simulation tabs. The first tab is Moon Orbit and loads the existing visualization. Future simulations are sibling directories registered in one small catalog.

The shell uses buttons for tabs rather than URL-based SPA routing. This avoids GitHub Pages refresh and repository-subpath problems while still allowing instant in-page switching. Each simulation is loaded in an iframe so its globals, inline styles, canvas, controls, and embedded assets remain isolated.

## Repository architecture

```text
space-simulations/
├── index.html
├── README.md
├── .gitignore
├── .nojekyll
├── .github/
│   └── workflows/
│       └── deploy-pages.yml
├── src/
│   ├── app.js
│   ├── simulations.js
│   └── styles/
│       ├── shell.css
│       └── tabs.css
├── simulations/
│   └── moon-orbit/
│       └── solar_system.html
└── docs/
    └── adding-simulations.md
```

`index.html` contains semantic workspace landmarks and the initial loading state. `src/simulations.js` is the only simulation registration point. `src/app.js` renders tabs, manages the active state, lazy-loads the selected iframe, and updates accessibility attributes. Shared presentation stays in `src/styles/`; simulation-specific presentation remains inside the simulation HTML.

The existing `solar_system.html` is moved without refactoring its rendering code. One viewport meta tag is added for correct mobile layout. Its scene, UI, embedded texture, Three.js CDN dependency, controls, and resize listener remain otherwise unchanged.

## Simulation registry contract

Each entry is a plain object:

```js
{
  id: 'moon-orbit',
  label: 'Moon Orbit',
  path: './simulations/moon-orbit/solar_system.html'
}
```

The first registry entry is active by default. Tab buttons use the `id` as their accessible association and iframe panel ID. A new simulation requires a sibling folder and one registry entry; no shell markup change is required.

## Responsive and mobile behavior

The shell includes `meta name="viewport" content="width=device-width, initial-scale=1"`, uses dynamic viewport-height units with a fixed fallback, and accounts for safe-area insets. The tab row is horizontally scrollable on narrow screens without wrapping or shrinking labels below a usable tap target.

The active iframe is `width: 100%`, `height: 100%`, borderless, and contained by a flex child with `min-height: 0`. The shell does not depend on experimental iframe intrinsic sizing. The embedded Moon Orbit document gets the viewport declaration it needs because an iframe has its own viewport. Its existing pointer, wheel, pinch, and resize behavior is retained.

On small screens, shell chrome is compact, while the simulation receives the remaining viewport. The shell body prevents accidental outer-page scrolling; scroll chaining is controlled on the shell, and the simulation remains responsible for its canvas gestures.

## Accessibility and interaction

The tab strip uses `role="tablist"`; each button uses `role="tab"`, `aria-selected`, and `aria-controls`. Each simulation frame uses a labelled `tabpanel` and an iframe title. Clicking a tab changes the selected state and only loads the requested simulation. Keyboard focus remains visible. Tab buttons can be activated with Enter or Space through native button behavior.

## Deployment

GitHub Pages deploys the repository root as a static artifact through GitHub Actions on pushes to `main`. The workflow grants `contents: read`, `pages: write`, and `id-token: write`, then checks out the repository, configures Pages, uploads `.`, and deploys the artifact to the `github-pages` environment. All app and simulation references are relative paths so the site works at `/<repository-name>/`.

## Verification

Verification covers:

1. Static structure checks for required files, registry path, viewport metadata, relative paths, and workflow permissions.
2. JavaScript checks for rendering one tab, default activation, lazy iframe loading, and switching selected state.
3. Browser smoke checks at desktop width and narrow mobile widths in portrait and landscape.
4. Touch checks for canvas drag and pinch zoom, plus tab scrolling and tap targets.
5. GitHub Pages-style serving from a subdirectory to catch absolute-path mistakes.

## Out of scope

- Refactoring the Moon Orbit simulation into a JavaScript module.
- Adding additional simulations now.
- Adding a framework, npm dependency, backend, persistence, or authentication.
- Changing the simulation’s scientific model or visual design.
