# Adding a simulation

Each simulation is an independent HTML document loaded into the workspace shell. Keep its styles, scripts, libraries, and assets inside its own directory whenever possible.

## 1. Create a simulation directory

Use a lowercase, hyphenated ID:

```text
simulations/
└── three-body-problem/
    ├── index.html
    ├── scene.js
    ├── styles.css
    └── assets/
```

The document should include its own viewport declaration and should resize its canvas to the iframe viewport. Use relative URLs for local files and CDN URLs for external libraries.

## 2. Register the simulation

Add one frozen object to `src/simulations.js`:

```js
Object.freeze({
  id: 'three-body-problem',
  label: 'Three-Body Problem',
  path: './simulations/three-body-problem/index.html'
})
```

The `id` must be unique and safe for use in HTML IDs. The `label` is the visible and accessible tab name. The `path` must be relative to the repository root.

## 3. Check mobile behavior

Test the new simulation at narrow portrait and landscape sizes. It should fit its iframe without requiring the outer page to scroll, support touch gestures without blocking controls, and keep all important controls reachable. The workspace shell provides the tab bar and available frame size; the simulation owns its internal canvas and UI layout.
