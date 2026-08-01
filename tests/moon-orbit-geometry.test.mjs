import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../simulations/moon-orbit/solar_system.html', import.meta.url), 'utf8');

assert.match(source, /function moonDirection\(angle\)/);
assert.match(source, /return new THREE\.Vector3\(fx, 0, fz\);/);

assert.match(source, /var moonOrbit = new THREE\.Group\(\);/);
assert.match(source, /moonOrbit\.add\(moonRing\);/);
assert.match(source, /moonOrbit\.add\(moon\);/);
assert.match(source, /moonOrbit\.position\.copy\(earthPosNow\);/);
assert.match(source, /moonRing\.material\.depthTest = true;/);
assert.match(source, /var MOON_R\s+= 14;/);
assert.match(source, /var MOON_R_TRUE\s+= 69\.4;/);
assert.match(source, /var ORBIT_R_TRUE\s+=/);
assert.match(source, /var SUN_RADIUS_TRUE\s+=/);
assert.match(source, /cameraMaxRadius/);
assert.match(source, /function setMoonScale\(trueScale\)/);
assert.match(source, /scaleBtn/);
assert.match(source, /New York City, NY/);
assert.match(source, /Moon phase/);
assert.match(source, /new THREE\.Spherical\(22,/);

console.log('Moon orbit geometry contract passed');
