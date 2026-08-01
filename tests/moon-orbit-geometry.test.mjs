import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../simulations/moon-orbit/solar_system.html', import.meta.url), 'utf8');

assert.match(
  source,
  /new THREE\.Vector3\(fx, 0, fz\)\s*\.applyAxisAngle\(new THREE\.Vector3\(1, 0, 0\), incl\)/,
  'Moon direction must rotate a flat radial vector into the same X-tilted plane as moonRing'
);

console.log('Moon orbit geometry contract passed');
