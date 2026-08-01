# Space Simulations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static, mobile-friendly GitHub Pages workspace with a tabbed shell and the existing Moon Orbit visualization as its first isolated simulation.

**Architecture:** A root `index.html` provides the shell. `src/simulations.js` defines the simulation catalog and `src/app.js` renders accessible tabs and lazy-loads the selected simulation into a full-size iframe. The existing `solar_system.html` remains self-contained under `simulations/moon-orbit/`, with only the mobile viewport declaration added.

**Tech Stack:** Semantic HTML, modern vanilla JavaScript modules, CSS, Three.js r128 via the existing CDN reference, GitHub Actions Pages deployment.

## Global Constraints

- Preserve the Moon Orbit rendering logic, embedded texture, controls, CDN dependency, and visual design.
- Add only `<meta name="viewport" content="width=device-width, initial-scale=1">` to the existing simulation for mobile compatibility.
- Do not add npm, a framework, a bundler, a backend, authentication, or persistent storage.
- Use relative paths so the site works under a GitHub Pages repository subpath.
- Load only the active simulation iframe initially.
- Use native buttons and semantic tab roles for accessible navigation.
- Support narrow portrait and landscape mobile layouts with safe-area padding and touch-friendly tab targets.

---

### Task 1: Establish repository metadata and preserve the simulation

**Files:**
- Move: `solar_system.html` → `simulations/moon-orbit/solar_system.html`
- Modify: `simulations/moon-orbit/solar_system.html:4-5`
- Create: `.gitignore`
- Create: `.nojekyll`

**Interfaces:**
- Produces the simulation document at `./simulations/moon-orbit/solar_system.html` for the registry.

- [ ] **Step 1: Create the simulation directory and move the existing page.**

Run:

```bash
mkdir -p simulations/moon-orbit
mv solar_system.html simulations/moon-orbit/solar_system.html
```

- [ ] **Step 2: Add the mobile viewport declaration immediately after the charset declaration.**

The head must begin with:

```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Sun · Earth · Moon — current positions</title>
```

- [ ] **Step 3: Add repository ignores and disable Jekyll processing.**

`.gitignore` must contain:

```gitignore
.DS_Store
.worktrees/
.superpowers/
```

`.nojekyll` is an empty marker file.

- [ ] **Step 4: Verify the simulation content was not otherwise changed.**

Run:

```bash
wc -l simulations/moon-orbit/solar_system.html
rg -n "three\.js/r128|EARTH_TEXTURE_URL|touchmove|window\.addEventListener\('resize'" simulations/moon-orbit/solar_system.html
```

Expected: 486 lines after the one added meta line; all four markers are present.

- [ ] **Step 5: Commit the preserved simulation.**

```bash
git add .gitignore .nojekyll simulations/moon-orbit/solar_system.html
git commit -m "chore: organize moon orbit simulation"
```

### Task 2: Build the responsive static shell

**Files:**
- Create: `index.html`
- Create: `src/styles/shell.css`
- Create: `src/styles/tabs.css`

**Interfaces:**
- Produces `#simulation-tabs` as the tablist mount point and `#simulation-panels` as the panel mount point.
- Imports `./src/app.js` as a module.

- [ ] **Step 1: Create semantic shell markup with responsive viewport metadata.**

`index.html` must include:

```html
<main class="workspace" aria-labelledby="workspace-title">
  <header class="workspace-header">
    <p class="eyebrow">Interactive astronomy</p>
    <h1 id="workspace-title">Space Simulations</h1>
    <p class="workspace-description">Explore orbital motion and celestial systems.</p>
  </header>
  <div id="simulation-tabs" class="simulation-tabs" role="tablist" aria-label="Simulations"></div>
  <section id="simulation-panels" class="simulation-panels" aria-live="polite"></section>
</main>
<script type="module" src="./src/app.js"></script>
```

- [ ] **Step 2: Style the shell for desktop and mobile.**

`shell.css` must set `html, body` to full height, use `min-height: 100%`, apply `overflow: hidden` to the shell, and use `100dvh` with `100vh` fallback for the workspace height. The simulation area must be a flex child with `min-height: 0`.

At `max-width: 640px`, reduce header spacing, preserve a readable 1.5rem title, and include `env(safe-area-inset-top)`, `env(safe-area-inset-right)`, `env(safe-area-inset-bottom)`, and `env(safe-area-inset-left)` in padding calculations.

- [ ] **Step 3: Style tabs for accessible touch interaction.**

`tabs.css` must make the tab row horizontally scrollable without wrapping, give each tab at least `44px` of block size, preserve visible `:focus-visible` styling, and distinguish `[aria-selected="true"]` from inactive tabs.

- [ ] **Step 4: Verify shell markup and CSS are present.**

Run:

```bash
rg -n "viewport|simulation-tabs|simulation-panels|type=\"module\"" index.html
rg -n "100dvh|safe-area-inset|focus-visible|aria-selected|overflow-x" src/styles/*.css
```

- [ ] **Step 5: Commit the shell.**

```bash
git add index.html src/styles
git commit -m "feat: add responsive simulation workspace shell"
```

### Task 3: Add the simulation registry and tab controller

**Files:**
- Create: `src/simulations.js`
- Create: `src/app.js`

**Interfaces:**
- `src/simulations.js` exports `SIMULATIONS`, an array of `{ id, label, path }` objects.
- `src/app.js` exports `createWorkspace({ simulations, tabsRoot, panelsRoot })` for direct browser testing and calls it on `DOMContentLoaded` for the real page.

- [ ] **Step 1: Define the Moon Orbit registry entry.**

`src/simulations.js` must export:

```js
export const SIMULATIONS = Object.freeze([
  Object.freeze({
    id: 'moon-orbit',
    label: 'Moon Orbit',
    path: './simulations/moon-orbit/solar_system.html'
  })
]);
```

- [ ] **Step 2: Implement tab and panel creation.**

`createWorkspace` must:

1. Clear both mount points.
2. Create one `button` per simulation with `role="tab"`, `id="tab-${id}"`, `aria-controls="panel-${id}"`, and `aria-selected="false"`.
3. Create one `section` per simulation with `role="tabpanel"`, `id="panel-${id}"`, `aria-labelledby="tab-${id}"`, and `hidden=true`.
4. Create an iframe only when a tab is activated; set `title` to the simulation label, `src` to the registry path, and `loading="eager"` for the active frame.
5. Activate the first simulation after rendering.
6. On activation, set the selected tab to `true`, hide every other panel, set the active panel to visible, and avoid recreating an iframe that already exists.

- [ ] **Step 3: Implement native keyboard and click behavior.**

Attach click handlers to each button. Attach `keydown` handling for ArrowLeft, ArrowRight, Home, and End to move focus among tabs and activate the destination. Do not override Enter or Space; native buttons must activate through their normal behavior.

- [ ] **Step 4: Add a no-simulation guard.**

If `simulations` is empty, render the text `No simulations available yet.` into the panel mount point and do not throw. The shipped registry remains non-empty.

- [ ] **Step 5: Verify controller syntax and registry paths.**

Run:

```bash
node --check src/app.js
node --check src/simulations.js
rg -n "moon-orbit|role=|aria-selected|loading|ArrowLeft|ArrowRight|No simulations" src/*.js
```

- [ ] **Step 6: Commit the controller.**

```bash
git add src/app.js src/simulations.js
git commit -m "feat: add extensible simulation tabs"
```

### Task 4: Add GitHub Pages deployment and contributor documentation

**Files:**
- Create: `.github/workflows/deploy-pages.yml`
- Create: `README.md`
- Create: `docs/adding-simulations.md`

**Interfaces:**
- The workflow publishes the repository root as the Pages artifact.
- Documentation describes the registry contract from `src/simulations.js`.

- [ ] **Step 1: Create the official static Pages workflow.**

The workflow must run on pushes to `main` and manual dispatch, use `actions/checkout@v6`, `actions/configure-pages@v5`, `actions/upload-pages-artifact@v4`, and `actions/deploy-pages@v4`, and declare `contents: read`, `pages: write`, and `id-token: write` permissions. The deploy job must use the `github-pages` environment and upload `path: '.'`.

- [ ] **Step 2: Document local usage and GitHub Pages setup.**

`README.md` must explain that the project is a zero-build static site, show the repository structure, give a local server command (`python3 -m http.server 8000`), describe enabling Settings → Pages → GitHub Actions, and identify the deployed URL pattern `https://<owner>.github.io/space-simulations/`.

- [ ] **Step 3: Document how to add a simulation.**

`docs/adding-simulations.md` must show the exact folder convention and registry entry shape, require relative asset paths, and explain that each simulation should be self-contained and responsive within its iframe.

- [ ] **Step 4: Verify workflow and docs.**

Run:

```bash
rg -n "push:|workflow_dispatch|configure-pages|upload-pages-artifact|deploy-pages|pages: write|id-token: write|path: '\.'" .github/workflows/deploy-pages.yml
rg -n "python3 -m http.server|GitHub Actions|space-simulations|SIMULATIONS|relative" README.md docs/adding-simulations.md
```

- [ ] **Step 5: Commit deployment support.**

```bash
git add .github/workflows/deploy-pages.yml README.md docs/adding-simulations.md
git commit -m "docs: add GitHub Pages deployment workflow"
```

### Task 5: Run end-to-end static and mobile verification

**Files:**
- Modify: any implementation file only if a verification failure identifies a concrete defect.

**Interfaces:**
- Verifies the deployed artifact shape without adding runtime dependencies.

- [ ] **Step 1: Run syntax checks and repository structure checks.**

Run:

```bash
node --check src/app.js
node --check src/simulations.js
test -f index.html && test -f simulations/moon-orbit/solar_system.html && test -f .github/workflows/deploy-pages.yml
```

- [ ] **Step 2: Serve the repository as a static site.**

Run:

```bash
python3 -m http.server 8000
```

Open `http://127.0.0.1:8000/` in a browser and verify the Moon Orbit tab is selected, the iframe fills the panel, and the simulation loads.

- [ ] **Step 3: Verify responsive layouts.**

At approximately 390×844 and 844×390, verify that the shell has no horizontal page overflow, tabs can scroll horizontally, the iframe remains fully visible, panels remain readable, and the simulation canvas responds to resize.

- [ ] **Step 4: Verify touch interactions.**

On a touch-capable browser or device, verify one-finger orbit drag, two-finger pinch zoom, time slider input, and tab tapping. Confirm shell tab scrolling does not prevent canvas interaction after activation.

- [ ] **Step 5: Verify repository-subpath compatibility.**

Serve the parent directory and open the project through a subpath if the local server supports it, or inspect all HTML, JS, CSS, iframe, and workflow references to ensure none begin with `/` or assume the domain root.

- [ ] **Step 6: Review the final diff and status.**

Run:

```bash
git diff --check
git status --short
git log --oneline --decorate -6
```

Expected: no whitespace errors, all intended files committed, and the current branch is `codex/space-simulations`.

- [ ] **Step 7: Commit any verified fixes and record the final result.**

```bash
git add -A
git commit -m "test: verify responsive space simulations workspace"
```
