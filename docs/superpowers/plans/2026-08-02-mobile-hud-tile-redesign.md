# Mobile HUD Tile Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace conflicting mobile HUD offsets with a responsive tiled layout that keeps the simulation readable and all controls visible on phones.

**Architecture:** Preserve the existing simulation DOM and desktop styles. On mobile, add one fixed `#mobileHud` overlay using CSS Grid and move the existing time, scale, info, and moon phase elements into it. Keep the canvas full-screen and keep the timeline in a separate bottom dock.

**Tech Stack:** Vanilla HTML, CSS, browser JavaScript, Three.js already loaded by the page, Node syntax and geometry tests.

## Global Constraints

- Do not change orbital geometry, scale calculations, moon phase calculations, or camera behavior.
- Do not change the desktop HUD arrangement.
- Mobile tiles must use normal-flow grid placement, not hard-coded vertical offsets.
- Preserve dark theme, blue accent, existing labels, focus states, and touch-friendly controls.
- Respect `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)`.

---

### Task 1: Consolidate the mobile HUD structure

**Files:**
- Modify: `simulations/moon-orbit/solar_system.html` in the HUD markup and initialization area
- Test: `tests/moon-orbit-geometry.test.mjs`

**Interfaces:**
- Consumes: existing `#info`, `#clock`, `#timepanel`, `#moonPhaseBox`, and dynamically created `#scaleBtn`.
- Produces: a mobile-only `#mobileHud` container that owns the top tiles while desktop elements retain their current behavior.

- [ ] **Step 1: Write the failing structural assertion**

Add a source-level assertion that the page has one `#mobileHud` container and does not contain the previous duplicate mobile style markers (`mobileOverrideStyle`, `mobileSizingStyle`, `responsiveUiStyle`).

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `node tests/moon-orbit-geometry.test.mjs`

Expected: FAIL because the current page still contains the duplicate mobile style blocks and no mobile HUD container.

- [ ] **Step 3: Implement the structure**

Create a mobile-only overlay container and append the existing HUD nodes into it at runtime. Keep the time panel outside the container as the bottom timeline dock. Remove the three duplicate style injection blocks and replace them with one consolidated mobile style block.

- [ ] **Step 4: Run the focused test to verify it passes**

Run: `node tests/moon-orbit-geometry.test.mjs`

Expected: PASS, including the new structural assertion.

- [ ] **Step 5: Commit**

```bash
git add simulations/moon-orbit/solar_system.html tests/moon-orbit-geometry.test.mjs
git commit -m "refactor: group mobile simulation HUD"
```

### Task 2: Implement the responsive tile visual system

**Files:**
- Modify: `simulations/moon-orbit/solar_system.html` mobile CSS

**Interfaces:**
- Consumes: `#mobileHud` containing `#clock`, `#scaleBtn`, `#info`, and `#moonPhaseBox`.
- Produces: mobile layout rules that fit 320px to tablet widths without clipping.

- [ ] **Step 1: Add layout assertions for mobile rules**

Extend the source-level test to require `display:grid`, `safe-area-inset-top`, `safe-area-inset-bottom`, and a narrow-width single-column fallback.

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `node tests/moon-orbit-geometry.test.mjs`

Expected: FAIL until the new grid and safe-area rules are present.

- [ ] **Step 3: Implement the tile layout**

Use one mobile media block with a two-column grid. The system and moon tiles span both columns, while time and scale form the compact top row. At widths below 380px, switch the grid to one column.

- [ ] **Step 4: Make the timeline safe-area aware**

Set the timeline to `left: 8px`, `right: 8px`, `bottom: calc(8px + env(safe-area-inset-bottom))`, `width: auto`, and `box-sizing: border-box`. Allow the slider to shrink with `min-width: 0` and keep the live button and offset label from clipping.

- [ ] **Step 5: Run focused checks**

Run: `node tests/moon-orbit-geometry.test.mjs`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add simulations/moon-orbit/solar_system.html tests/moon-orbit-geometry.test.mjs
git commit -m "fix: tile mobile simulation controls"
```

### Task 3: Verify source, behavior, and responsive regressions

**Files:**
- Verify: `simulations/moon-orbit/solar_system.html`
- Verify: `src/app.js`
- Verify: `src/styles/shell.css`
- Verify: `src/styles/tabs.css`

- [ ] **Step 1: Run JavaScript syntax checks**

Run:

```bash
node --check src/app.js
node --input-type=module -e "import {readFile} from 'node:fs/promises'; const html=await readFile('simulations/moon-orbit/solar_system.html','utf8'); const scripts=[...html.matchAll(/<script(?: [^>]*)?>([\\s\\S]*?)<\\/script>/g)].map(m=>m[1]).join('\\n'); new Function(scripts); console.log('Embedded JavaScript syntax passed');"
```

Expected: both commands exit successfully.

- [ ] **Step 2: Run the geometry and source tests**

Run: `node tests/moon-orbit-geometry.test.mjs`

Expected: all assertions pass.

- [ ] **Step 3: Check the diff for whitespace errors and remaining conflicting rules**

Run:

```bash
git diff --check
rg -n "mobileOverrideStyle|mobileSizingStyle|responsiveUiStyle|top:285px|top:142px" simulations/moon-orbit/solar_system.html
```

Expected: `git diff --check` is clean and the search returns no old conflicting style blocks or hard-coded mobile HUD offsets.

- [ ] **Step 4: Review the mobile pre-flight checklist**

Confirm the 320px, 380px, 390px, and 430px layout rules have no horizontal overflow; the top tiles remain readable; the phase visual is not obscured; the Earth remains the visual focus; and the timeline sits above the safe area.

- [ ] **Step 5: Commit the final verified implementation**

```bash
git add simulations/moon-orbit/solar_system.html tests/moon-orbit-geometry.test.mjs
git commit -m "fix: improve mobile simulation HUD layout"
```
