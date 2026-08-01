# Mobile HUD Tile Redesign

## Design Read

Reading this as a preserve-mode redesign of an interactive astronomy simulation for mobile users, with a dark observatory HUD language and a calmer, structured layout.

## Goal

Make the Moon Orbit simulation readable and uncluttered on touch devices by grouping its controls and context into a responsive tiled HUD at the top of the viewport, while preserving the existing simulation, desktop layout, and interaction model.

## Design Direction

Use a compact two-column tile grid for mobile:

1. A time tile showing UTC and local time.
2. A scale tile containing the readable/true scale toggle.
3. A wider system tile showing the essential date, moon phase, Earth-Moon distance, and New York City marker.
4. A wider moon tile showing the visual phase indicator, phase name, location, and lunar age.
5. A full-width timeline docked at the bottom with safe-area padding.

The system and moon tiles should remain visually dominant relative to the compact time and scale tiles. At very narrow widths, the grid may become a single column for the two wide tiles, while time and scale remain compact and readable. The canvas remains visible between the top HUD and bottom timeline.

## Root Cause Addressed

The current mobile CSS is split across several dynamically injected style blocks. They assign competing absolute positions to the same elements, including `#info`, `#moonPhaseBox`, `#clock`, `#scaleBtn`, and `#timepanel`. The redesign will consolidate mobile layout rules into one source of truth and use a dedicated mobile HUD grouping rather than accumulating positional overrides.

## Constraints

- Do not change orbital geometry, scale calculations, moon phase calculations, or canvas controls.
- Do not change the desktop HUD arrangement.
- Keep all mobile controls visible without horizontal clipping.
- Respect `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)`.
- Preserve keyboard focus styles and touch target sizes.
- Keep the existing dark visual language, using one consistent border radius and blue accent.
- Avoid introducing a framework or runtime dependency.
- Keep the timeline separate from the top HUD so it does not compete with the tiles.

## Responsive Behavior

- Touch/mobile layouts activate using the existing mobile detection.
- At mobile widths, top HUD tiles use CSS Grid with a stable gap and viewport-side padding.
- The top HUD uses normal flow inside a fixed overlay container, eliminating hard-coded vertical offsets.
- The system and moon tiles span both columns when there is enough width.
- At narrow widths, all tiles become one column in a predictable order.
- The canvas remains the background layer and is never pushed or resized by HUD content.
- The bottom timeline uses `left`, `right`, and safe-area padding instead of a fixed width or minimum width.

## Acceptance Criteria

- At a 390px-wide phone viewport, no tile or timeline content is cut off horizontally.
- The time and scale controls form a coherent top row.
- The system and moon phase information are readable and do not overlap the Earth or each other.
- The timeline remains fully visible above the mobile browser safe area.
- No duplicate mobile style blocks remain for the same HUD elements.
- Desktop presentation and simulation behavior remain unchanged.
- Existing geometry tests and JavaScript syntax checks pass.

