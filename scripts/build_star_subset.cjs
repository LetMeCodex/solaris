/**
 * Builds public/data/stars.json — the subset of the Hipparcos catalogue the app actually draws —
 * from the full V ≤ 8.0 catalogue in data/source/hipparcos_v8_full.json.
 *
 * Kept stars:
 *  - every star with V ≤ 4.6 (celestial-sphere layer and all constellation figure stars), and
 *  - every star with a Hipparcos distance below 120 pc (3D local-neighbourhood layer).
 *
 * Usage: node scripts/build_star_subset.cjs
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const src = path.join(root, 'data', 'source', 'hipparcos_v8_full.json');
const dst = path.join(root, 'public', 'data', 'stars.json');

const SKY_MAG_LIMIT = 4.6;
const LOCAL_DISTANCE_PC = 120;

const full = JSON.parse(fs.readFileSync(src, 'utf8'));
const stars = full.stars.filter((s) => s[4] <= SKY_MAG_LIMIT || (s[6] !== null && s[6] > 0 && s[6] < LOCAL_DISTANCE_PC));

const out = {
  ...full,
  count: stars.length,
  subset: `V <= ${SKY_MAG_LIMIT} or distance < ${LOCAL_DISTANCE_PC} pc, taken from the ${full.count}-star V <= ${full.magnitudeLimit} catalogue`,
  stars,
};

fs.writeFileSync(dst, JSON.stringify(out));
console.log(`Wrote ${stars.length} of ${full.count} stars to ${path.relative(root, dst)} (${fs.statSync(dst).size} bytes)`);
