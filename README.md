# Space Simulations

An extensible collection of interactive astronomy visualizations, starting with a live Sun–Earth–Moon orbit view.

The site is a zero-build static project: HTML, CSS, and vanilla JavaScript are served directly by GitHub Pages. Each simulation is self-contained and appears as a tab in the shared workspace shell.

## Local development

Run a static server from the repository root so ES modules and iframe paths behave like they do on GitHub Pages:

```bash
python3 -m http.server 8000
```

Then open [http://127.0.0.1:8000/](http://127.0.0.1:8000/) in a browser.

## Repository layout

```text
index.html                         Shared workspace shell
src/app.js                         Tab rendering and switching
src/simulations.js                 Simulation registry
src/styles/                        Shared responsive shell styles
simulations/moon-orbit/            Self-contained Moon Orbit page
.github/workflows/deploy-pages.yml GitHub Pages deployment
docs/adding-simulations.md         Extension guide
```

## GitHub Pages deployment

1. Push the repository to GitHub as `space-simulations`.
2. In Settings → Pages, set Source to **GitHub Actions**.
3. Push to `main` or run the **Deploy to GitHub Pages** workflow manually.

For an owner named `<owner>`, the project site URL will be:

```text
https://<owner>.github.io/space-simulations/
```

All app, stylesheet, script, and iframe references use relative paths so the repository subpath is supported.

## Adding a simulation

See [docs/adding-simulations.md](./docs/adding-simulations.md).
