import * as THREE from 'three';
import type { TimeOfDay } from './SkyAstronomy';
import { TexturePipeline } from '../rendering/TexturePipeline';
import type { LandSpec } from './DeepTimeLand';

/**
 * Deep time: the sky of the future, from the ground. Each scene puts you on a real world, at a
 * chosen time of day, and adds what the sky will hold in that era: Betelgeuse going supernova,
 * Gliese 710 passing and the comet storm it stirs up, Saturn without its rings, the last total
 * eclipse turned annular, the brightening Sun's ice haloes, Andromeda filling the night, the red
 * giant Sun, the merged galaxy, the Sun's planetary nebula seen from Pluto, the white dwarf, and
 * the end of the stars.
 *
 * Everything here hangs on the sky sphere around the observer, placed by compass heading and
 * height above the horizon (or relative to the Sun), at a fixed angular size, the way the eye sees
 * anything very far away. Brightness is HDR-ish (additive, past white) so the bloom pass gives it
 * glare; the dome tint, the ground light and the star field are steered through `SkyLook`.
 */

export type DeepFx =
  | { kind: 'supernova'; az: number; alt: number; daylight?: boolean; sunRelative?: boolean }
  | { kind: 'sunStar' }
  | { kind: 'afterglow' }
  | { kind: 'ringRain' }
  | { kind: 'collision' }
  | { kind: 'redStar'; az: number; alt: number }
  | { kind: 'comets'; count: number }
  | { kind: 'meteors' }
  | { kind: 'annular' }
  | { kind: 'halo' }
  | { kind: 'andromeda'; az: number; alt: number; sizeDeg: number }
  | { kind: 'redGiant'; sizeDeg: number }
  | { kind: 'elliptical' }
  | { kind: 'planetaryNebula' }
  | { kind: 'whiteDwarf' }
  | { kind: 'ember'; az: number; alt: number };

export interface DeepTimeScene {
  id: string;
  title: string;
  /** When, in plain words ("In 1.3 million years"). */
  when: string;
  /** One or two lines about what you are seeing. */
  blurb: string;
  body: string;
  /** Stand where the parent world is in the sky (moons), else at lat/lon. */
  facing?: string;
  lat?: number;
  lon?: number;
  place: string;
  time: TimeOfDay;
  /** Hours after that moment. */
  hours?: number;
  /** Compass heading (deg) or relative to the Sun's; height above the horizon likewise; field of view. */
  view: { heading: number | { sun: number }; pitch: number | { sun: number }; fov: number };
  atmosphere?: boolean;
  /** Star field brightness (1 as now, 0 none) and whether the Milky Way is drawn. */
  stars?: number;
  milkyWay?: boolean;
  hideSun?: boolean;
  hideRings?: boolean;
  /** Sunlight on the ground: colour multiplier and an extra ambient light. */
  ground?: { sun: [number, number, number]; ambient: number };
  /** A wash over the whole sky (the colour of a red giant's light, an eclipse's dusk). */
  /** A wash over the whole sky, from the horizon colour up to the zenith colour. */
  dome?: { top: number; bottom: number; opacity: number; add?: boolean };
  /** A real 3D landscape around you (src/explorer/DeepTimeLand). */
  land?: LandSpec;
  /** The light on that landscape: the Sun, the scene's own phenomenon, or only the sky. */
  light?: { from: 'sun' | 'fx' | 'moonless'; color: [number, number, number]; ambient: [number, number, number] };
  fx: DeepFx[];
}

export const DEEP_TIME_SCENES: DeepTimeScene[] = [
  {
    id: 'betelgeuse',
    title: 'Betelgeuse explodes',
    when: 'Any time within the next 100,000 years',
    blurb: 'The red supergiant on Orion’s shoulder flickers, then collapses. The sky lights up as it outshines the Moon with a blue-white glow, bright enough to cast shadows across the dunes.',
    body: 'Earth', lat: 23.8, lon: 11.0, place: 'Sahara dunes, at dusk',
    time: 'sunset', hours: 0.6, view: { heading: { sun: 18 }, pitch: 12, fov: 74 },
    land: { kind: 'dunes', fog: [0.004, 0.006, 0.012], fogSun: [0.05, 0.018, 0.004], haze: 1.2 },
    light: { from: 'fx', color: [0.55, 0.7, 1.0], ambient: [0.004, 0.006, 0.012] },
    fx: [{ kind: 'afterglow' }, { kind: 'supernova', az: 0, alt: 16, sunRelative: true }],
  },
  {
    id: 'two-suns',
    title: 'Two lights in the day',
    when: 'Weeks after the supernova',
    blurb: 'For a while the dead star is bright enough to see at noon: a second hard blue-white point in the blue sky beside the Sun. It could happen tomorrow, or in a thousand years.',
    body: 'Earth', lat: 38.4, lon: 15.9, place: 'Hills above the Tyrrhenian Sea',
    time: 'sunrise', hours: 3.2, view: { heading: { sun: 28 }, pitch: 14, fov: 72 },
    land: { kind: 'hills', fog: [0.42, 0.55, 0.7], fogSun: [0.75, 0.72, 0.62], haze: 0.9, turn: 200 },
    light: { from: 'sun', color: [2.4, 2.3, 2.1], ambient: [0.16, 0.22, 0.32] },
    fx: [{ kind: 'sunStar' }, { kind: 'supernova', az: 0, alt: 0, daylight: true }],
  },
  {
    id: 'gliese',
    title: 'Gliese 710 arrives',
    when: 'In 1.3 million years',
    blurb: 'A red dwarf passes through the Oort cloud, closer than any star has come in millions of years. On Earth it will appear as a bright orange dot in the night sky, brighter than Jupiter.',
    body: 'Earth', lat: 26.3, lon: 30.0, place: 'Red desert, Western Sahara',
    time: 'night', view: { heading: 120, pitch: 10, fov: 74 },
    land: { kind: 'redDesert', fog: [0.03, 0.012, 0.006], fogSun: [0.03, 0.012, 0.006], haze: 1.4 },
    light: { from: 'fx', color: [0.35, 0.12, 0.05], ambient: [0.018, 0.008, 0.005] },
    dome: { top: 0x020203, bottom: 0x1a0c06, opacity: 0.55 },
    fx: [{ kind: 'redStar', az: 120, alt: 26 }],
  },
  {
    id: 'comet-storm',
    title: 'The comet storm',
    when: 'In 1.3 million years, and for millions after',
    blurb: 'The comets Gliese 710 knocks out of the Oort cloud fall in towards the Sun. For millions of years there is always a comet in the sky, often several, and meteor showers to match.',
    body: 'Earth', lat: 47.3, lon: 11.4, place: 'Tyrolean Alps, Austria',
    time: 'night', view: { heading: 200, pitch: 18, fov: 82 },
    stars: 1.2,
    land: { kind: 'alpine', fog: [0.035, 0.045, 0.065], fogSun: [0.06, 0.05, 0.05], haze: 1.6 },
    dome: { top: 0x000000, bottom: 0x56688c, opacity: 1, add: true },
    light: { from: 'moonless', color: [0.03, 0.04, 0.06], ambient: [0.012, 0.016, 0.026] },
    fx: [{ kind: 'comets', count: 3 }, { kind: 'meteors' }],
  },
  {
    id: 'ring-rain',
    title: 'Saturn’s rings fall',
    when: 'In 100 million years',
    blurb: 'Ice from the rings rains down into Saturn, pulled along the magnetic field. Seen from above the cloud deck, the ring arch hangs over the horizon and its fragments burn in as meteors.',
    body: 'Saturn', lat: 28, lon: 0, place: 'Above Saturn’s cloud tops',
    time: 'noon', view: { heading: 180, pitch: 16, fov: 85 },
    fx: [{ kind: 'ringRain' }],
  },
  {
    id: 'ringless-saturn',
    title: 'Saturn without its rings',
    when: 'In about 300 million years',
    blurb: 'In time the rings are gone, and the planet hangs over Enceladus bare.',
    body: 'Enceladus', facing: 'Saturn', place: 'Enceladus, facing Saturn',
    time: 'noon', view: { heading: 0, pitch: 30, fov: 60 },
    hideRings: true,
    fx: [],
  },
  {
    id: 'last-eclipse',
    title: 'The last total eclipse',
    when: 'In about 600 million years',
    blurb: 'The Moon drifts 3.8 cm farther away every year. One day its disc is too small to cover the Sun: every eclipse after that is a ring of fire, the photosphere breaking through as beads round its edge.',
    body: 'Earth', lat: 20.0, lon: -155.9, place: 'Kona coast, Hawaiʻi',
    time: 'sunrise', hours: 1.2, view: { heading: { sun: 0 }, pitch: { sun: 0 }, fov: 6 },
    land: { kind: 'coast', fog: [0.6, 0.38, 0.2], fogSun: [0.9, 0.55, 0.25], haze: 1.0, turn: 0 },
    light: { from: 'sun', color: [0.25, 0.18, 0.12], ambient: [0.03, 0.04, 0.07] },
    dome: { top: 0x0a1a38, bottom: 0xd88a4a, opacity: 0.82 },
    ground: { sun: [0.25, 0.22, 0.2], ambient: -0.05 },
    fx: [{ kind: 'annular' }],
  },
  {
    id: 'bright-sun',
    title: 'A brighter Sun',
    when: 'In 1 billion years',
    blurb: 'The Sun is 10% brighter and the oceans start to boil off. High ice haze rings the Sun with sun dogs either side, and a road of light runs across the shrinking sea.',
    body: 'Earth', lat: 40.76, lon: -113.88, place: 'A shrinking sea',
    time: 'sunrise', hours: 1.4, view: { heading: { sun: 0 }, pitch: { sun: -7 }, fov: 90 },
    land: { kind: 'shore', fog: [0.78, 0.7, 0.55], fogSun: [1.2, 1.1, 0.95], haze: 0.8 },
    light: { from: 'sun', color: [1.7, 1.55, 1.3], ambient: [0.22, 0.2, 0.17] },
    dome: { top: 0x9a8562, bottom: 0xeadcb8, opacity: 0.62 },
    ground: { sun: [1.15, 1.05, 0.85], ambient: 0.08 },
    fx: [{ kind: 'sunStar' }, { kind: 'halo' }],
  },
  {
    id: 'andromeda',
    title: 'Andromeda fills the night',
    when: 'In 3.75 billion years',
    blurb: 'The Andromeda galaxy, now a smudge, falls towards us. Before the collision it spans the sky beside the Milky Way, its dust lanes and blue star clouds bright enough to see from any dark place.',
    body: 'Earth', lat: -49.3, lon: -73.05, place: 'Patagonia, under Fitz Roy',
    time: 'night', view: { heading: 60, pitch: 24, fov: 95 },
    stars: 1.5,
    land: { kind: 'jagged', fog: [0.0, 0.0, 0.0], fogSun: [0.0, 0.0, 0.0], haze: 0.2 },
    light: { from: 'moonless', color: [0, 0, 0], ambient: [0.002, 0.002, 0.003] },
    dome: { top: 0x000000, bottom: 0x141a2a, opacity: 1, add: true },
    fx: [{ kind: 'andromeda', az: 48, alt: 40, sizeDeg: 86 }],
  },
  {
    id: 'collision',
    title: 'The galaxies collide',
    when: 'In 4 billion years',
    blurb: 'The two galaxies plunge through each other. Their gas clouds crash together and light up the whole sky with starbirth: pink nebulae, blue clusters of young stars, rivers of dust.',
    body: 'Earth', lat: -49.3, lon: -73.05, place: 'Patagonia, under Fitz Roy',
    time: 'night', view: { heading: 30, pitch: 26, fov: 100 },
    stars: 1.4, milkyWay: false,
    land: { kind: 'jagged', fog: [0.01, 0.006, 0.012], fogSun: [0.01, 0.006, 0.012], haze: 0.2 },
    light: { from: 'moonless', color: [0.03, 0.02, 0.03], ambient: [0.01, 0.008, 0.012] },
    fx: [{ kind: 'collision' }],
  },
  {
    id: 'red-giant',
    title: 'The red giant Sun',
    when: 'In 5 billion years',
    blurb: 'Out of hydrogen in its core, the Sun swells hundreds of times wider. Mercury and Venus are swallowed; from a scorched Earth its boiling surface fills the horizon and the crust runs with lava.',
    body: 'Earth', lat: 23.4, lon: 25.0, place: 'What was the Sahara',
    time: 'sunrise', hours: 0.6, view: { heading: { sun: 0 }, pitch: 14, fov: 95 },
    atmosphere: false, hideSun: true,
    land: { kind: 'scorched', fog: [0.25, 0.06, 0.01], fogSun: [0.7, 0.2, 0.03], haze: 1.3 },
    light: { from: 'sun', color: [3.0, 0.85, 0.2], ambient: [0.28, 0.07, 0.016] },
    ground: { sun: [2.4, 0.6, 0.12], ambient: 0.01 },
    dome: { top: 0x2a0702, bottom: 0x7a2208, opacity: 0.62 },
    stars: 0.25,
    fx: [{ kind: 'redGiant', sizeDeg: 78 }],
  },
  {
    id: 'milkdromeda',
    title: 'Milkdromeda',
    when: 'In 7 billion years',
    blurb: 'The two galaxies have merged into one giant elliptical. No more spiral arms and dust lanes: a soft golden glow of old stars, brightest towards its heart, over the whole sky.',
    body: 'Earth', lat: 31.0, lon: 35.4, place: 'A dead Earth, desert hills',
    time: 'night', view: { heading: 150, pitch: 22, fov: 95 },
    atmosphere: false, milkyWay: false, stars: 1.6,
    land: { kind: 'dunes', fog: [0.06, 0.045, 0.03], fogSun: [0.06, 0.045, 0.03], haze: 0.6 },
    light: { from: 'fx', color: [0.22, 0.17, 0.12], ambient: [0.05, 0.04, 0.03] },
    ground: { sun: [1, 1, 1], ambient: 0.07 },
    fx: [{ kind: 'elliptical' }],
  },
  {
    id: 'planetary-nebula',
    title: 'The Sun’s last breath, from Pluto',
    when: 'In 7.5 billion years',
    blurb: 'The Sun sheds its outer layers into space. Its bare core, a white dwarf, lights them up: a planetary nebula, teal inside and red at the edges, around a point of hard white light.',
    body: 'Pluto', lat: 20, lon: 175, place: 'Sputnik Planitia, Pluto',
    time: 'sunrise', hours: 10, view: { heading: { sun: 0 }, pitch: { sun: -6 }, fov: 62 },
    hideSun: true,
    ground: { sun: [0.14, 0.15, 0.19], ambient: 0.01 },
    fx: [{ kind: 'planetaryNebula' }, { kind: 'whiteDwarf' }],
  },
  {
    id: 'white-dwarf',
    title: 'The white dwarf',
    when: 'In 8 billion years',
    blurb: 'What is left of the Sun is the size of the Earth: a point too bright to look at, too faint to warm anything. Earth, if it survived, is frozen rock under a black sky.',
    body: 'Earth', lat: 64.0, lon: -17.0, place: 'Frozen Earth, the old Iceland',
    time: 'sunrise', hours: 2, view: { heading: { sun: 0 }, pitch: 10, fov: 80 },
    atmosphere: false, hideSun: true,
    land: { kind: 'ice', fog: [0.004, 0.005, 0.008], fogSun: [0.01, 0.012, 0.016], haze: 0.5 },
    light: { from: 'sun', color: [0.55, 0.62, 0.8], ambient: [0.012, 0.015, 0.022] },
    ground: { sun: [0.06, 0.07, 0.09], ambient: 0.006 },
    fx: [{ kind: 'whiteDwarf' }],
  },
  {
    id: 'stars-out',
    title: 'The stars go out',
    when: 'In 100 trillion years',
    blurb: 'Star formation ends; the last red dwarfs burn out. One by one the lights fade, until the last ember cools to nothing and the sky is truly black.',
    body: 'Earth', lat: 31.0, lon: 35.4, place: 'A dead world',
    time: 'night', view: { heading: 180, pitch: 14, fov: 80 },
    atmosphere: false, milkyWay: false, stars: 0,
    land: { kind: 'dunes', fog: [0, 0, 0], fogSun: [0, 0, 0], haze: 0.3 },
    light: { from: 'fx', color: [0.05, 0.01, 0.0], ambient: [0.001, 0.001, 0.001] },
    ground: { sun: [1, 1, 1], ambient: 0.004 },
    fx: [{ kind: 'ember', az: 180, alt: 20 }],
  },
  {
    id: 'black-hole',
    title: 'The last light: a black hole',
    when: 'Beyond 10¹⁰⁰ years',
    blurb: 'When everything else is gone, black holes remain: the last objects in the universe, slowly evaporating. Stand on the shore beside one.',
    body: 'Sagittarius A*', place: 'Beside Sagittarius A*',
    time: 'night', view: { heading: 0, pitch: 0, fov: 70 },
    fx: [],
  },
];

/** Whether a scene's sky is built round the Sun (the red giant, the eclipse, the halo…): you see it by facing the Sun. */
export function sunAnchored(d: DeepTimeScene): boolean {
  return d.fx.some(
    (f) =>
      f.kind === 'annular' || f.kind === 'halo' || f.kind === 'redGiant' || f.kind === 'planetaryNebula' ||
      f.kind === 'whiteDwarf' || f.kind === 'sunStar' || f.kind === 'afterglow' ||
      (f.kind === 'supernova' && (f.daylight || f.sunRelative))
  );
}

/** What the host must change for a scene: the star field, the Milky Way, the Sun's disc, rings. */
export interface SkyLook {
  stars: number;
  milkyWay: boolean;
  hideSun: boolean;
  hideRings: boolean;
}

// ------------------------------------------------------------------ textures (no files)

function canvasTex(w: number, h: number, draw: (x: CanvasRenderingContext2D) => void): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  draw(c.getContext('2d') as CanvasRenderingContext2D);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

const glowTex = (): THREE.CanvasTexture =>
  canvasTex(256, 256, (x) => {
    const g = x.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.08, 'rgba(255,255,255,0.7)');
    g.addColorStop(0.3, 'rgba(255,255,255,0.18)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g;
    x.fillRect(0, 0, 256, 256);
  });

/** Diffraction spikes: four (or six) thin rays, the way a camera's aperture draws a bright point. */
const spikesTex = (n: number): THREE.CanvasTexture =>
  canvasTex(512, 512, (x) => {
    x.translate(256, 256);
    for (let i = 0; i < n; i++) {
      x.save();
      x.rotate((i * Math.PI) / (n / 2) + Math.PI / 4);
      const g = x.createLinearGradient(0, 0, 256, 0);
      g.addColorStop(0, 'rgba(255,255,255,0.95)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      x.fillStyle = g;
      x.beginPath();
      x.moveTo(0, -3);
      x.lineTo(256, 0);
      x.lineTo(0, 3);
      x.fill();
      x.restore();
    }
  });

/** A thin horizontal streak (an anamorphic lens's flare). */
const streakTex = (): THREE.CanvasTexture =>
  canvasTex(512, 64, (x) => {
    const g = x.createLinearGradient(0, 0, 512, 0);
    g.addColorStop(0, 'rgba(160,200,255,0)');
    g.addColorStop(0.5, 'rgba(220,235,255,0.9)');
    g.addColorStop(1, 'rgba(160,200,255,0)');
    x.fillStyle = g;
    const v = x.createLinearGradient(0, 0, 0, 64);
    v.addColorStop(0, 'rgba(0,0,0,0)');
    v.addColorStop(0.5, 'rgba(0,0,0,1)');
    v.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillRect(0, 26, 512, 12);
  });

/** The 22° halo: a thin ring, reddish on its inner edge and fading bluish-white outwards. */
const haloTex = (): THREE.CanvasTexture =>
  canvasTex(512, 512, (x) => {
    const g = x.createRadialGradient(256, 256, 200, 256, 256, 256);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(0.62, 'rgba(0,0,0,0)');
    g.addColorStop(0.7, 'rgba(255,120,70,0.55)');
    g.addColorStop(0.76, 'rgba(255,230,170,0.5)');
    g.addColorStop(0.86, 'rgba(220,235,255,0.22)');
    g.addColorStop(1, 'rgba(200,220,255,0)');
    x.fillStyle = g;
    x.fillRect(0, 0, 512, 512);
  });

/** A sun dog: a bright spot, red towards the Sun, with a faint white tail away from it. */
const sunDogTex = (): THREE.CanvasTexture =>
  canvasTex(256, 256, (x) => {
    // Refraction through plate crystals: red nearest the Sun, through yellow and green to a pale blue
    const g = x.createLinearGradient(0, 0, 256, 0);
    g.addColorStop(0, 'rgba(255,60,30,0)');
    g.addColorStop(0.2, 'rgba(255,90,40,0.75)');
    g.addColorStop(0.32, 'rgba(255,190,70,0.9)');
    g.addColorStop(0.44, 'rgba(240,240,150,0.8)');
    g.addColorStop(0.56, 'rgba(120,230,200,0.6)');
    g.addColorStop(0.7, 'rgba(120,170,255,0.45)');
    g.addColorStop(1, 'rgba(200,220,255,0)');
    x.fillStyle = g;
    x.beginPath();
    x.ellipse(128, 128, 128, 120, 0, 0, Math.PI * 2);
    x.fill();
    const v = x.createLinearGradient(0, 0, 0, 256);
    v.addColorStop(0, 'rgba(0,0,0,1)');
    v.addColorStop(0.5, 'rgba(0,0,0,0)');
    v.addColorStop(1, 'rgba(0,0,0,1)');
    x.globalCompositeOperation = 'destination-out';
    x.fillStyle = v;
    x.fillRect(0, 0, 256, 256);
  });

/** The corona: long soft streamers radiating from the disc. */
const coronaTex = (): THREE.CanvasTexture =>
  canvasTex(512, 512, (x) => {
    x.translate(256, 256);
    let s = 3;
    const rnd = (): number => ((s = (s * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < 90; i++) {
      const a = rnd() * Math.PI * 2;
      const len = 120 + rnd() * 130 * (0.5 + 0.5 * Math.abs(Math.cos(a)));
      x.save();
      x.rotate(a);
      const g = x.createLinearGradient(40, 0, len, 0);
      g.addColorStop(0, 'rgba(255,245,230,0.35)');
      g.addColorStop(1, 'rgba(255,245,230,0)');
      x.fillStyle = g;
      x.beginPath();
      x.moveTo(40, -6 - rnd() * 8);
      x.lineTo(len, 0);
      x.lineTo(40, 6 + rnd() * 8);
      x.fill();
      x.restore();
    }
    const c = x.createRadialGradient(0, 0, 40, 0, 0, 200);
    c.addColorStop(0, 'rgba(255,240,220,0.7)');
    c.addColorStop(1, 'rgba(255,240,220,0)');
    x.fillStyle = c;
    x.beginPath();
    x.arc(0, 0, 200, 0, Math.PI * 2);
    x.fill();
  });

/** The chromosphere: a thin ragged red-orange rim with prominences. */
const chromoTex = (): THREE.CanvasTexture =>
  canvasTex(512, 512, (x) => {
    x.translate(256, 256);
    let s = 9;
    const rnd = (): number => ((s = (s * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < 720; i++) {
      const a = (i / 720) * Math.PI * 2;
      const h = 4 + rnd() * 6 + (rnd() < 0.03 ? 18 + rnd() * 20 : 0);
      x.strokeStyle = `rgba(255,${90 + Math.floor(rnd() * 80)},40,0.55)`;
      x.lineWidth = 2;
      x.beginPath();
      x.moveTo(Math.cos(a) * 200, Math.sin(a) * 200);
      x.lineTo(Math.cos(a) * (200 + h), Math.sin(a) * (200 + h));
      x.stroke();
    }
  });

/** A vertical sun pillar. */
const pillarTex = (): THREE.CanvasTexture =>
  canvasTex(64, 512, (x) => {
    const g = x.createLinearGradient(0, 0, 0, 512);
    g.addColorStop(0, 'rgba(255,230,190,0)');
    g.addColorStop(0.5, 'rgba(255,230,190,0.85)');
    g.addColorStop(1, 'rgba(255,230,190,0)');
    x.fillStyle = g;
    const h = x.createLinearGradient(0, 0, 64, 0);
    h.addColorStop(0, 'rgba(0,0,0,0)');
    x.fillRect(24, 0, 16, 512);
  });

/** A comet tail: bright at the head, broadening and fading along its length. */
const tailTex = (r: number, gg: number, b: number, curve: number): THREE.CanvasTexture =>
  canvasTex(512, 128, (x) => {
    for (let i = 0; i < 512; i++) {
      const u = i / 511;
      const w = 4 + u * 50;
      const yc = 64 + curve * u * u * 40;
      const g = x.createLinearGradient(0, yc - w, 0, yc + w);
      const a = Math.pow(1 - u, 1.4) * 0.95;
      g.addColorStop(0, `rgba(${r},${gg},${b},0)`);
      g.addColorStop(0.5, `rgba(${r},${gg},${b},${a})`);
      g.addColorStop(1, `rgba(${r},${gg},${b},0)`);
      x.fillStyle = g;
      x.fillRect(i, yc - w, 1, w * 2);
    }
  });

/** Clumpy pink star-forming clouds (for the galaxy collision). */
const cloudsTex = (): THREE.CanvasTexture =>
  canvasTex(512, 512, (x) => {
    let s = 7;
    const rnd = (): number => ((s = (s * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < 420; i++) {
      const cx = 256 + (rnd() - 0.5) * 300;
      const cy = 256 + (rnd() - 0.5) * 120 + (cx - 256) * 0.2;
      const r = 14 + rnd() * 60;
      const pink = rnd() < 0.75;
      const g = x.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, pink ? 'rgba(255,80,140,0.16)' : 'rgba(120,180,255,0.2)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      x.fillStyle = g;
      x.fillRect(cx - r, cy - r, r * 2, r * 2);
    }
    const fade = x.createRadialGradient(256, 256, 40, 256, 256, 250);
    fade.addColorStop(0, 'rgba(0,0,0,0)');
    fade.addColorStop(1, 'rgba(0,0,0,1)');
    x.globalCompositeOperation = 'destination-out';
    x.fillStyle = fade;
    x.fillRect(0, 0, 512, 512);
  });

/** A giant elliptical galaxy: a smooth glow falling off from its core (de Vaucouleurs-like). */
const ellipticalTex = (): THREE.CanvasTexture =>
  canvasTex(512, 512, (x) => {
    const img = x.createImageData(512, 512);
    for (let j = 0; j < 512; j++) {
      for (let i = 0; i < 512; i++) {
        const dx = (i - 256) / 256;
        const dy = (j - 256) / 256;
        const r = Math.sqrt(dx * dx + dy * dy);
        const v = Math.exp(-7.67 * (Math.pow(Math.max(r, 1e-3) / 0.5, 0.25) - 1)) * 0.08;
        const a = Math.min(1, v) * (1 - Math.min(1, r) ** 4);
        const o = (j * 512 + i) * 4;
        img.data[o] = 255;
        img.data[o + 1] = 236;
        img.data[o + 2] = 205;
        img.data[o + 3] = Math.round(a * 255);
      }
    }
    x.putImageData(img, 0, 0);
  });

// ------------------------------------------------------------------ the red giant's surface

const giantMaterial = (): THREE.ShaderMaterial =>
  new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uGain: { value: 1 } },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
    `,
    fragmentShader: /* glsl */ `
      uniform float uTime;
      uniform float uGain;
      varying vec2 vUv;
      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float noise(vec2 p) {
        vec2 i = floor(p), f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
      }
      float fbm(vec2 p) { float s = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { s += a * noise(p); p *= 2.03; a *= 0.5; } return s; }
      void main() {
        vec2 p = (vUv - 0.5) * 2.0;
        float r = length(p);
        // The disc fills 0.8 of the quad; outside it, the glowing envelope and prominences
        float disc = 0.8;
        if (r < disc) {
          vec2 q = p / disc;
          // Foreshortening towards the limb: cells squash as the surface turns away
          float mu = sqrt(max(0.0, 1.0 - dot(q, q)));
          vec2 sp = q / (0.35 + 0.65 * mu);
          float cells = fbm(sp * 3.0 + vec2(uTime * 0.012, -uTime * 0.009));
          float fine = fbm(sp * 11.0 - uTime * 0.03);
          float t = 0.55 + 0.6 * cells + 0.25 * fine;
          // Limb darkening: hotter, brighter at the centre
          float limb = 0.35 + 0.65 * pow(mu, 0.6);
          // Deep red where cool, orange where hot: kept under white, so the cells read
          vec3 cool = vec3(0.32, 0.035, 0.004);
          vec3 hot = vec3(0.95, 0.36, 0.06);
          float heat = clamp(t * limb - 0.25, 0.0, 1.0);
          vec3 c = mix(cool, hot, heat * heat * (3.0 - 2.0 * heat)) * (0.55 + 0.5 * limb);
          gl_FragColor = vec4(c * uGain, 1.0);
          return;
        }
        // Envelope glow and arcs of prominences
        float a = atan(p.y, p.x);
        float edge = exp(-(r - disc) * 9.0);
        float prom = smoothstep(0.55, 0.85, fbm(vec2(a * 4.0, uTime * 0.05))) * exp(-(r - disc) * 22.0);
        vec3 c = vec3(1.0, 0.32, 0.06) * edge * 0.9 + vec3(1.0, 0.45, 0.15) * prom * 1.4;
        gl_FragColor = vec4(c * uGain, (edge + prom) * 0.9);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

// ------------------------------------------------------------------ the sky layer

interface Meteor { from: THREE.Vector3; to: THREE.Vector3; age: number; life: number; k: number }

export class DeepTimeSky {
  public readonly group = new THREE.Group();
  public scene: DeepTimeScene | null = null;
  /** Ground light this frame (null: leave the observer's own). */
  public ground: { sun: [number, number, number]; ambient: number } | null = null;
  /** The key light on the scene's landscape this frame (world direction, colour) and the sky light. */
  public light = { dir: new THREE.Vector3(0, 1, 0), color: new THREE.Color(1, 1, 1), ambient: new THREE.Color(0.05, 0.06, 0.08) };
  /** Meteors fall from the ring arch (Saturn's ring rain) rather than anywhere. */
  private rainMode = false;
  private t = 0;
  private textures: Record<string, THREE.Texture> = {};
  private items: THREE.Object3D[] = [];
  private dome: THREE.Mesh;
  private v = new THREE.Vector3();
  private meteors: Meteor[] = [];
  private meteorLines: THREE.LineSegments | null = null;
  private nextMeteor = 0;

  constructor() {
    this.group.name = 'deep_time_sky';
    this.group.visible = false;
    this.dome = new THREE.Mesh(
      new THREE.SphereGeometry(1, 48, 24),
      new THREE.ShaderMaterial({
        uniforms: { uTop: { value: new THREE.Color() }, uBottom: { value: new THREE.Color() }, uUp: { value: new THREE.Vector3(0, 1, 0) }, uOpacity: { value: 0 } },
        vertexShader: `varying vec3 vD; void main() { vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: `uniform vec3 uTop, uBottom, uUp; uniform float uOpacity; varying vec3 vD;
          void main() { float h = dot(normalize(vD), uUp); float t = smoothstep(-0.03, 0.16, h);
            gl_FragColor = vec4(mix(uBottom, uTop, t), uOpacity * (0.75 + 0.25 * t)); }`,
        transparent: true,
        depthWrite: false,
        side: THREE.BackSide,
      })
    );
    this.dome.renderOrder = 44;
    this.dome.frustumCulled = false;
  }

  private tex(name: string, make: () => THREE.Texture): THREE.Texture {
    return (this.textures[name] ??= make());
  }

  /** What the host must change for the current scene (null: nothing). */
  public look(): SkyLook | null {
    const s = this.scene;
    if (!s) return null;
    return { stars: s.stars ?? 1, milkyWay: s.milkyWay ?? true, hideSun: !!s.hideSun, hideRings: !!s.hideRings };
  }

  public setScene(scene: DeepTimeScene | null): void {
    for (const o of this.items) {
      o.removeFromParent();
      o.traverse((c) => {
        const m = c as THREE.Mesh;
        if (m.geometry && m.geometry !== this.dome.geometry) m.geometry.dispose();
        const mat = m.material as THREE.Material | undefined;
        if (mat && mat !== this.dome.material) mat.dispose();
      });
    }
    this.items = [];
    this.meteors = [];
    this.meteorLines = null;
    this.rainMode = false;
    this.dome.removeFromParent();
    this.scene = scene;
    this.t = 0;
    this.group.visible = !!scene;
    this.ground = scene?.ground ?? null;
    if (!scene) return;
    if (scene.dome) {
      const u = (this.dome.material as THREE.ShaderMaterial).uniforms;
      u.uTop.value.setHex(scene.dome.top);
      u.uBottom.value.setHex(scene.dome.bottom);
      u.uOpacity.value = scene.dome.opacity;
      const dm = this.dome.material as THREE.ShaderMaterial;
      dm.blending = scene.dome.add ? THREE.AdditiveBlending : THREE.NormalBlending;
      dm.needsUpdate = true;
      this.group.add(this.dome);
    }
    for (const fx of scene.fx) this.build(fx);
  }

  // A sprite or quad; userData holds how it is placed each frame
  private sprite(texName: string, make: () => THREE.Texture, color: number, data: Record<string, unknown>, order = 46): THREE.Sprite {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.tex(texName, make), color, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    s.renderOrder = order;
    s.frustumCulled = false;
    s.userData = data;
    this.group.add(s);
    this.items.push(s);
    return s;
  }

  private quad(mat: THREE.Material, data: Record<string, unknown>, order = 46): THREE.Mesh {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat);
    m.renderOrder = order;
    m.frustumCulled = false;
    m.userData = data;
    this.group.add(m);
    this.items.push(m);
    return m;
  }

  private build(fx: DeepFx): void {
    const glow = (): THREE.Texture => glowTex();
    switch (fx.kind) {
      case 'supernova': {
        // In daylight beside the Sun; at dusk over the afterglow, a little to one side of the sunset
        const at = fx.daylight ? { sunOffset: [28, 6] } : fx.sunRelative ? { sunOffset: [fx.az, 0], fixedAlt: fx.alt } : { az: fx.az, alt: fx.alt };
        const day = { ...at, daylight: !!fx.daylight };
        if (!fx.daylight) this.sprite('glow', glow, 0x3a6ad0, { ...day, role: 'snSky' }, 46);
        this.sprite('glow', glow, 0xcfe4ff, { ...day, role: 'snCore' }, 48);
        this.sprite('glow', glow, 0x8fbaff, { ...day, role: 'snHalo' }, 47);
        this.sprite('spikes4', () => spikesTex(4), 0xe6f0ff, { ...day, role: 'snSpikes' }, 48);
        if (!fx.daylight) this.sprite('streak', streakTex, 0xbcd6ff, { ...day, role: 'snStreak' }, 48);
        break;
      }
      case 'redStar':
        this.sprite('glow', glow, 0xff6a2a, { az: fx.az, alt: fx.alt, size: 2.2, role: 'static', k: 1.4 }, 47);
        this.sprite('spikes4', () => spikesTex(4), 0xff8a50, { az: fx.az, alt: fx.alt, size: 4.5, role: 'static', k: 0.7 }, 47);
        break;
      case 'comets': {
        const ion = (): THREE.Texture => tailTex(130, 190, 255, 0);
        const dust = (): THREE.Texture => tailTex(255, 236, 200, 1);
        const spots = [[160, 30, 34], [245, 42, 22], [118, 18, 14]].slice(0, fx.count);
        spots.forEach(([az, alt, len], i) => {
          const base = { az, alt, len, role: 'comet' };
          const mk = (tn: string, make: () => THREE.Texture, color: number, part: string, width: number): void => {
            this.quad(new THREE.MeshBasicMaterial({ map: this.tex(tn, make), color, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }), { ...base, part, width, seed: i }, 46);
          };
          mk('ionTail', ion, 0xffffff, 'ion', 0.06);
          mk('dustTail', dust, 0xffffff, 'dust', 0.22);
          this.sprite('glow', glow, 0xd6fbff, { az, alt, size: 1.4 + 0.5 * (2 - i), role: 'static', k: 1.4 }, 47);
        });
        break;
      }
      case 'meteors': {
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(30 * 6), 3).setUsage(THREE.DynamicDrawUsage));
        g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(30 * 6), 3).setUsage(THREE.DynamicDrawUsage));
        const l = new THREE.LineSegments(g, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
        l.frustumCulled = false;
        l.renderOrder = 47;
        this.group.add(l);
        this.items.push(l);
        this.meteorLines = l;
        break;
      }
      case 'annular': {
        // The Moon's disc, 0.9 of the Sun's, slightly off-centre: a ring of fire with beads of photosphere
        // Transparent (opacity 1) so it draws after the Sun's own disc, over it
        this.quad(new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 1, depthWrite: false, depthTest: false }), { sunOffset: [0.01, 0.006], role: 'moonDisc' }, 49);
        (this.items[this.items.length - 1] as THREE.Mesh).geometry = new THREE.CircleGeometry(0.5, 96);
        this.sprite('corona', coronaTex, 0xfff2e0, { sunOffset: [0, 0], role: 'corona' }, 47);
        this.sprite('chromo', chromoTex, 0xffffff, { sunOffset: [0.01, 0.006], role: 'chromo' }, 50);
        for (let i = 0; i < 7; i++) this.sprite('glow', glow, 0xfff4dc, { sunOffset: [0, 0], role: 'bead', i }, 50);
        break;
      }
      case 'afterglow':
        // The band of sunset light low over where the Sun went down
        this.sprite('glow', glow, 0xff6a20, { sunOffset: [0, 0], fixedAlt: 2, size: 140, flat: 0.14, role: 'static', k: 0.9 }, 44);
        this.sprite('glow', glow, 0xffa040, { sunOffset: [0, 0], fixedAlt: 0.5, size: 60, flat: 0.1, role: 'static', k: 0.9 }, 44);
        break;
      case 'sunStar':
        // The Sun through a camera lens: a starburst and a wide glare
        this.sprite('spikes8', () => spikesTex(8), 0xfff6e8, { sunOffset: [0, 0], size: 9, role: 'static', k: 0.85 }, 48);
        this.sprite('glow', glow, 0xfff2dc, { sunOffset: [0, 0], size: 14, role: 'static', k: 0.55 }, 47);
        this.sprite('streak', streakTex, 0xfff0e0, { sunOffset: [0, 0], size: 30, stretch: 1, flat: 0.06, role: 'static', k: 0.5 }, 48);
        break;
      case 'ringRain': {
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(30 * 6), 3).setUsage(THREE.DynamicDrawUsage));
        g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(30 * 6), 3).setUsage(THREE.DynamicDrawUsage));
        const l = new THREE.LineSegments(g, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
        l.frustumCulled = false;
        l.renderOrder = 47;
        l.userData = { role: 'rain' };
        this.group.add(l);
        this.items.push(l);
        this.meteorLines = l;
        this.rainMode = true;
        break;
      }
      case 'collision': {
        // The whole sky lit by colliding galaxies: real nebula photographs as the star-forming regions,
        // the tilted spiral, and the clumpy pink-and-blue clouds strewn across it
        const tp = TexturePipeline.getInstance();
        const pics: Array<[string, number, number, number, number]> = [
          ['/textures/nebulae/lagoon-lane.webp', 20, 40, 70, -20],
          ['/textures/nebulae/cosmic-cliffs.webp', 80, 22, 60, 10],
          ['/textures/nebulae/orion-cloud.webp', -30, 30, 55, 30],
          ['/textures/nebulae/rosette-ring.webp', 50, 62, 40, 0],
          ['/textures/nebulae/mystic-mountain.webp', 120, 35, 50, -15],
          ['/textures/nebulae/north-america.webp', -70, 50, 50, 20],
        ];
        for (const [url, az, alt, size, roll] of pics) {
          this.quad(new THREE.MeshBasicMaterial({ map: tp.loadTexture(url, true), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }), { az, alt, size: size * 1.45, aspect: 0.75, roll, role: 'tilted', k: 1.7 }, 45);
        }
        this.quad(new THREE.MeshBasicMaterial({ map: tp.getMilkyWayDiskTexture(), color: 0xffe6cc, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }), { az: 30, alt: 42, size: 120, aspect: 0.55, roll: -35, role: 'tilted', k: 0.6 }, 44);
        for (const [az, alt] of [[10, 30], [70, 50], [-40, 45], [110, 25]]) {
          this.quad(new THREE.MeshBasicMaterial({ map: this.tex('clouds', cloudsTex), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }), { az, alt, size: 70, aspect: 0.6, roll: az * 0.3, role: 'tilted', k: 1.5 }, 46);
        }
        break;
      }
      case 'halo':
        this.sprite('halo', haloTex, 0xffffff, { sunOffset: [0, 0], role: 'halo' }, 46);
        this.sprite('sundog', sunDogTex, 0xffffff, { sunOffset: [0, 0], role: 'sundog', side: 1 }, 47);
        this.sprite('sundog', sunDogTex, 0xffffff, { sunOffset: [0, 0], role: 'sundog', side: -1 }, 47);
        this.sprite('pillar', pillarTex, 0xffe0b0, { sunOffset: [0, 0], role: 'pillar' }, 47);
        break;
      case 'andromeda': {
        const tex = TexturePipeline.getInstance().getMilkyWayDiskTexture();
        this.quad(new THREE.MeshBasicMaterial({ map: tex, color: 0xffeedd, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, opacity: 0.95 }), { az: fx.az, alt: fx.alt, size: fx.sizeDeg, aspect: 0.42, roll: -28, role: 'tilted' }, 45);
        this.quad(new THREE.MeshBasicMaterial({ map: this.tex('clouds', cloudsTex), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }), { az: fx.az - 8, alt: fx.alt - 9, size: fx.sizeDeg * 0.75, aspect: 0.5, roll: -24, role: 'tilted', k: 1.4 }, 46);
        break;
      }
      case 'redGiant':
        this.quad(giantMaterial(), { sunOffset: [0, 0], fixedAlt: 9, size: fx.sizeDeg / 0.8, role: 'giant' }, 45);
        break;
      case 'elliptical':
        this.sprite('elliptical', ellipticalTex, 0xffe4bf, { az: 150, alt: 30, size: 172, stretch: 1.85, role: 'static', k: 0.85 }, 45);
        this.sprite('glow', glow, 0xfff0d8, { az: 150, alt: 30, size: 22, role: 'static', k: 0.28 }, 46);
        break;
      case 'planetaryNebula': {
        const tex = TexturePipeline.getInstance().loadTexture('/textures/nebulae/helix.webp', true);
        this.quad(new THREE.MeshBasicMaterial({ map: tex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }), { sunOffset: [0, 0], size: 30, aspect: 1, role: 'facing', k: 1.6 }, 45);
        break;
      }
      case 'whiteDwarf':
        this.sprite('glow', glow, 0xeef5ff, { sunOffset: [0, 0], size: 2.4, role: 'static', k: 2.2 }, 48);
        this.sprite('glow', glow, 0x9ab8ff, { sunOffset: [0, 0], size: 9, role: 'static', k: 0.35 }, 47);
        this.sprite('spikes4', () => spikesTex(4), 0xdfeaff, { sunOffset: [0, 0], size: 16, role: 'static', k: 1 }, 48);
        break;
      case 'ember':
        this.sprite('glow', glow, 0xff3a10, { az: fx.az, alt: fx.alt, size: 1.6, role: 'ember' }, 47);
        break;
    }
  }

  /**
   * Per frame: follow the camera, place everything on the sky, animate.
   * @param frame the observer's local axes; `sunDir` unit vector to the Sun; `radius` the sky shell
   */
  public update(dt: number, camera: THREE.Camera, frame: { east: THREE.Vector3; north: THREE.Vector3; up: THREE.Vector3 }, sunDir: THREE.Vector3, radius: number): void {
    const s = this.scene;
    if (!s) return;
    this.t += dt;
    const R = radius * 0.92;
    this.group.position.copy(camera.position);
    this.dome.scale.setScalar(R * 0.98);
    (this.dome.material as THREE.ShaderMaterial).uniforms.uUp.value.copy(frame.up);
    const sunAlt = Math.asin(THREE.MathUtils.clamp(sunDir.dot(frame.up), -1, 1)) / (Math.PI / 180);
    let sunAz = Math.atan2(sunDir.dot(frame.east), sunDir.dot(frame.north)) / (Math.PI / 180);
    if (sunAz < 0) sunAz += 360;

    const dirOf = (az: number, alt: number, out: THREE.Vector3): THREE.Vector3 => {
      const a = (az * Math.PI) / 180;
      const e = (alt * Math.PI) / 180;
      return out.set(0, 0, 0).addScaledVector(frame.north, Math.cos(e) * Math.cos(a)).addScaledVector(frame.east, Math.cos(e) * Math.sin(a)).addScaledVector(frame.up, Math.sin(e)).normalize();
    };
    const sizeAt = (deg: number): number => 2 * R * Math.tan(((Math.min(deg, 170) * Math.PI) / 180) / 2);
    // Turn a plane to face the observer, its x axis level with the local horizon, then roll it
    const face = (o: THREE.Object3D, rollDeg = 0): void => {
      const z = this.v.copy(o.position).negate().normalize();
      const x = new THREE.Vector3().crossVectors(frame.up, z);
      if (x.lengthSq() < 1e-8) x.copy(frame.east);
      x.normalize();
      const y = new THREE.Vector3().crossVectors(z, x).normalize();
      o.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, y, z));
      if (rollDeg) o.rotateZ((rollDeg * Math.PI) / 180);
    };
    let snLight = 0;
    const snDir = new THREE.Vector3().copy(frame.up);

    for (const o of this.items) {
      const d = o.userData as Record<string, number | number[] | string | boolean>;
      const off = d.sunOffset as number[] | undefined;
      const az = off ? sunAz + off[0] : (d.az as number);
      const alt = off ? (d.fixedAlt !== undefined ? (d.fixedAlt as number) : sunAlt + off[1]) : (d.alt as number);
      if (az === undefined || alt === undefined) continue;
      const dir = dirOf(az, alt, this.v);
      o.position.copy(dir).multiplyScalar(R);
      const role = d.role as string;
      const k = (d.k as number) ?? 1;
      const mat = (o as THREE.Mesh).material as THREE.MeshBasicMaterial | THREE.SpriteMaterial | THREE.ShaderMaterial;

      if (role === 'static') {
        o.scale.set(sizeAt((d.size as number) ?? 1) * ((d.stretch as number) ?? 1), sizeAt((d.size as number) ?? 1) * ((d.flat as number) ?? 1), 1);
        (mat as THREE.SpriteMaterial).opacity = Math.min(1, k);
      } else if (role.startsWith('sn')) {
        // Flicker, then detonation, then a slow settle (daylight: already at its peak)
        const t = this.t;
        let I: number;
        if (d.daylight) I = 2.2;
        else if (t < 4) I = 0.35 + 0.25 * Math.sin(t * 9) * Math.sin(t * 3.3) + 0.1 * t;
        else if (t < 4.7) I = THREE.MathUtils.lerp(0.8, 12, THREE.MathUtils.smoothstep(t, 4, 4.7));
        else I = 7 + 5 * Math.exp(-(t - 4.7) / 3) + 0.4 * Math.sin(t * 1.7);
        snLight = Math.max(snLight, d.daylight ? 0.15 : Math.min(1, I / 12));
        const sizes: Record<string, number> = { snCore: 0.35 + I * 0.18, snHalo: 2 + I * 2.6, snSpikes: 1.2 + I * 0.9, snStreak: 6 + I * 4.5, snSky: 10 + I * 4 };
        const sz = sizes[role] ?? 1;
        o.scale.set(sizeAt(sz) * (role === 'snStreak' ? 1 : 1), sizeAt(role === 'snStreak' ? sz * 0.1 : sz), 1);
        (mat as THREE.SpriteMaterial).opacity = Math.min(1, (role === 'snHalo' ? 0.25 : role === 'snSky' ? 0.22 : 0.9) * Math.max(0.3, I / 6));
        snDir.copy(dir);
      } else if (role === 'comet') {
        // Tail away from the Sun: from the head, along the anti-solar direction projected on the sky
        const anti = this.v.copy(sunDir).negate();
        const head = dirOf(az, alt, new THREE.Vector3());
        const along = anti.clone().addScaledVector(head, -anti.dot(head));
        if (along.lengthSq() < 1e-8) along.copy(frame.up);
        along.normalize();
        const len = sizeAt(d.len as number);
        const width = len * (d.width as number);
        const twist = d.part === 'dust' ? 0.12 : 0;
        const ax = along.clone().applyAxisAngle(head, twist);
        const sd = new THREE.Vector3().crossVectors(head, ax).normalize();
        const m = new THREE.Matrix4().makeBasis(ax, sd, head.clone().negate());
        o.quaternion.setFromRotationMatrix(m);
        o.scale.set(len, width, 1);
        o.position.copy(head).multiplyScalar(R).addScaledVector(ax, len / 2);
        (mat as THREE.MeshBasicMaterial).opacity = d.part === 'dust' ? 0.85 : 1;
      } else if (role === 'moonDisc') {
        const sunR = 0.267; // deg
        o.scale.setScalar(sizeAt(sunR * 2 * 0.9));
        o.position.copy(dirOf(sunAz + (off ? off[0] : 0), sunAlt + (off ? off[1] : 0), this.v)).multiplyScalar(R * 0.995);
        face(o);
      } else if (role === 'corona') {
        o.scale.setScalar(sizeAt(1.6));
        (mat as THREE.SpriteMaterial).opacity = 0.45;
      } else if (role === 'chromo') {
        o.scale.setScalar(sizeAt(0.267 * 2 * 0.9 * 1.28));
        (mat as THREE.SpriteMaterial).opacity = 0.9;
      } else if (role === 'bead') {
        // Light through valleys on the Moon's limb: on the side where the ring is thinnest, flickering
        const i = d.i as number;
        const ang = -0.6 + i * 0.2 + 0.05 * Math.sin(this.t * 3 + i);
        const r = 0.267 * 0.94;
        const bd = dirOf(sunAz + (r * Math.cos(ang)) / Math.max(0.2, Math.cos((sunAlt * Math.PI) / 180)), sunAlt + r * Math.sin(ang), this.v);
        o.position.copy(bd).multiplyScalar(R * 0.99);
        o.scale.setScalar(sizeAt(0.12 + 0.05 * Math.sin(this.t * 5 + i * 2)));
        (mat as THREE.SpriteMaterial).opacity = 0.9;
      } else if (role === 'halo') {
        o.scale.setScalar(sizeAt(22 * 2 * 1.28));
        (mat as THREE.SpriteMaterial).opacity = 0.14;
      } else if (role === 'sundog') {
        // 22 deg either side along the horizon's direction (a little further out with the Sun higher)
        const sideAz = sunAz + ((d.side as number) * 22.5) / Math.max(0.35, Math.cos((sunAlt * Math.PI) / 180));
        o.position.copy(dirOf(sideAz, sunAlt, this.v)).multiplyScalar(R);
        o.scale.set(sizeAt(7), sizeAt(16), 1);
        (mat as THREE.SpriteMaterial).rotation = (d.side as number) > 0 ? 0 : Math.PI;
        (mat as THREE.SpriteMaterial).opacity = 0.7;
      } else if (role === 'pillar') {
        o.scale.set(sizeAt(1.2), sizeAt(16), 1);
        (mat as THREE.SpriteMaterial).opacity = 0.3;
      } else if (role === 'tilted' || role === 'facing') {
        face(o, (d.roll as number) ?? 0);
        const sz = sizeAt(d.size as number);
        o.scale.set(sz, sz * ((d.aspect as number) ?? 1), 1);
        (mat as THREE.MeshBasicMaterial).opacity = Math.min(1, k * 0.8);
      } else if (role === 'giant') {
        face(o);
        o.scale.setScalar(sizeAt(d.size as number));
        (mat as THREE.ShaderMaterial).uniforms.uTime.value = this.t;
      } else if (role === 'ember') {
        // A last star cooling: dimmer and redder, then gone
        const f = Math.max(0, 1 - this.t / 16);
        o.scale.setScalar(sizeAt(0.4 + 1.4 * f));
        (mat as THREE.SpriteMaterial).color.setRGB(1, 0.15 + 0.2 * f, 0.05 * f);
        (mat as THREE.SpriteMaterial).opacity = f * (0.85 + 0.15 * Math.sin(this.t * 2));
      }
    }

    const L = s.light;
    if (L) {
      const fxDir = s.fx.some((f) => f.kind === 'supernova') ? snDir : this.firstFxDir(frame, dirOf);
      if (L.from === 'sun') {
        // The Sun dims and reddens as it nears the horizon
        const k = Math.max(0, Math.min(1, (sunAlt + 2) / 10));
        this.light.dir.copy(sunDir);
        this.light.color.setRGB(L.color[0] * k, L.color[1] * k, L.color[2] * k);
      } else if (L.from === 'fx') {
        const k = s.fx.some((f) => f.kind === 'supernova') ? snLight : 1;
        this.light.dir.copy(fxDir);
        // A night light: enough to pick out the land's shape, never daylight
        const f = 0.04 + 0.7 * k;
        this.light.color.setRGB(L.color[0] * f, L.color[1] * f, L.color[2] * f);
      } else {
        this.light.dir.copy(frame.up);
        this.light.color.setRGB(L.color[0], L.color[1], L.color[2]);
      }
      this.light.ambient.setRGB(L.ambient[0], L.ambient[1], L.ambient[2]);
    }

    // The supernova lights the land: cold blue-white light, strong enough for shadows
    if (s.fx.some((f) => f.kind === 'supernova')) {
      const k = snLight;
      this.ground = { sun: [1 + 0.4 * k, 1 + 0.55 * k, 1 + 0.9 * k], ambient: 0.1 * k };
    }

    if (this.meteorLines) this.updateMeteors(dt, frame, R);
  }

  /** Where the scene's light comes from when it is a sky object (the first placed phenomenon). */
  private firstFxDir(frame: { up: THREE.Vector3 }, dirOf: (az: number, alt: number, out: THREE.Vector3) => THREE.Vector3): THREE.Vector3 {
    for (const f of this.scene?.fx ?? []) {
      if ('az' in f && 'alt' in f) return dirOf(f.az, f.alt, new THREE.Vector3());
    }
    return frame.up.clone();
  }

  private updateMeteors(dt: number, frame: { east: THREE.Vector3; north: THREE.Vector3; up: THREE.Vector3 }, R: number): void {
    this.nextMeteor -= dt;
    if (this.nextMeteor <= 0 && this.meteors.length < 30) {
      const az = this.rainMode ? 150 + Math.random() * 60 : Math.random() * 360;
      const alt = this.rainMode ? 25 + Math.random() * 40 : 20 + Math.random() * 55;
      const dirOf = (a: number, e: number): THREE.Vector3 => {
        const ar = (a * Math.PI) / 180;
        const er = (e * Math.PI) / 180;
        return new THREE.Vector3().addScaledVector(frame.north, Math.cos(er) * Math.cos(ar)).addScaledVector(frame.east, Math.cos(er) * Math.sin(ar)).addScaledVector(frame.up, Math.sin(er)).normalize();
      };
      const from = dirOf(az, alt);
      const to = this.rainMode ? dirOf(az + (Math.random() - 0.5) * 6, alt - 12 - Math.random() * 18) : dirOf(az + (Math.random() - 0.5) * 30, alt - 6 - Math.random() * 14);
      this.meteors.push({ from, to, age: 0, life: 0.4 + Math.random() * 0.9, k: (this.rainMode ? 1.6 : 0.5) + Math.random() * (this.rainMode ? 1.4 : 1) });
      this.nextMeteor = this.rainMode ? 0.04 + Math.random() * 0.16 : 0.4 + Math.random() * 1.6;
    }
    const pos = this.meteorLines!.geometry.attributes.position as THREE.BufferAttribute;
    const col = this.meteorLines!.geometry.attributes.color as THREE.BufferAttribute;
    (pos.array as Float32Array).fill(0);
    (col.array as Float32Array).fill(0);
    this.meteors = this.meteors.filter((m) => (m.age += dt) < m.life);
    this.meteors.forEach((m, i) => {
      const f = m.age / m.life;
      const head = m.from.clone().lerp(m.to, f).normalize().multiplyScalar(R);
      const tail = m.from.clone().lerp(m.to, Math.max(0, f - 0.35)).normalize().multiplyScalar(R);
      const a = Math.sin(Math.PI * f) * m.k;
      pos.setXYZ(i * 2, tail.x, tail.y, tail.z);
      pos.setXYZ(i * 2 + 1, head.x, head.y, head.z);
      col.setXYZ(i * 2, 0, 0, 0);
      col.setXYZ(i * 2 + 1, 0.85 * a, 1.0 * a, 0.9 * a);
    });
    pos.needsUpdate = true;
    col.needsUpdate = true;
  }

  public dispose(): void {
    this.setScene(null);
    this.dome.geometry.dispose();
    (this.dome.material as THREE.Material).dispose();
    for (const t of Object.values(this.textures)) t.dispose();
  }
}
