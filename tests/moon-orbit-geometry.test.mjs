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
assert.match(source, /var MOON_R\s+= 7;/);
assert.match(source, /var MOON_R_TRUE\s+= 69\.4;/);
assert.match(source, /var ORBIT_R_TRUE\s+=/);
assert.match(source, /var SUN_RADIUS_TRUE\s+=/);
assert.match(source, /cameraMaxRadius/);
assert.match(source, /PerspectiveCamera\(45, W\/H, 0\.1, 50000\)/);
assert.match(source, /spherical\.radius = 30000;/);
assert.match(source, /solarsystemscope-sun-2k\.jpg/);
assert.match(source, /sunMat\.map = texture/);
assert.match(source, /function setMoonScale\(trueScale\)/);
assert.match(source, /scaleBtn/);
assert.match(source, /New York City, NY/);
assert.match(source, /Moon phase/);
assert.match(source, /function moonPhaseSvg\(age\)/);
assert.match(source, /role="img" aria-label="Moon phase visual"/);
assert.match(source, /function updateMoonPhaseBox\(date\)/);
assert.match(source, /updateMoonPhaseBox\(simulated\);/);
assert.match(source, /new THREE\.Spherical\(22,/);
assert.match(source, /id="mobileHud"/);
assert.doesNotMatch(source, /mobileOverrideStyle|mobileSizingStyle|responsiveUiStyle/);
assert.match(source, /display:\s*grid/);
assert.match(source, /safe-area-inset-top/);
assert.match(source, /safe-area-inset-bottom/);
assert.match(source, /@media \(max-width:\s*380px\)/);

console.log('Moon orbit geometry contract passed');
