/**
 * Aircraft liveries, exterior canopy optical coatings, and airshow smoke presets shared across
 * the 3D Hangar, flight shader pipeline, HUD, and smoke/vortex VFX.
 */

export type JetSkinId =
  | 'flame_phantom'
  | 'plasma_ion'
  | 'nebula_prism'
  | 'aurora_jade'
  | 'stock';

export type CanopyTintId = 'clear' | 'smoked' | 'gold';

export type AirshowSmokeId = 'off' | 'crimson' | 'cobalt' | 'gold' | 'ember';

export interface JetSkinSpec {
  id: JetSkinId;
  name: string;
  subtitle: string;
  description: string;
  badge: string;
  /** Numeric shader mode uniform (0 = stock, 1 = Flame Phantom, 2 = Ion Plasma, 3 = Nebula Prism, 4 = Aurora Jade). */
  shaderMode: number;
  /** Primary accent hex (sRGB) for spark emitters, Holo Aura, and Hangar deck highlights. */
  accentHex: number;
  /** Secondary highlight hex (sRGB) for HDR flame/vein cores and starbursts. */
  coreHex: number;
  /** CSS gradient swatch shown in the Hangar customization dock. */
  swatchCss: string;
  airframes: ReadonlyArray<'su30' | 'gripen' | 'kestrel'>;
}

export const JET_SKIN_KEY = 'solaris.jetSkin';
export const CANOPY_TINT_KEY = 'solaris.canopyTint';
export const AIRSHOW_SMOKE_KEY = 'solaris.airshowSmoke';
export const HOLO_AURA_KEY = 'solaris.holoAura';

export const JET_SKINS: ReadonlyArray<JetSkinSpec> = [
  {
    id: 'flame_phantom',
    name: 'Flame Phantom · Solar Flare',
    subtitle: 'Indian Air Force · SB-143',
    description:
      'Iridescent pearl forebody with reactive billowing solar-crimson flames, 3D parallax obsidian-nebula wings, live molten veins, IAF markings & thermal ember aura.',
    badge: 'INDIAN AIR FORCE · LIVING 3D',
    shaderMode: 1,
    accentHex: 0xff6218,
    coreHex: 0xffcf54,
    swatchCss: 'linear-gradient(125deg, #edeae2 0%, #ef4618 40%, #ffcb52 56%, #0b0c12 72%, #19131e 100%)',
    airframes: ['su30', 'gripen', 'kestrel'],
  },
  {
    id: 'plasma_ion',
    name: 'Cherenkov · Ion Surge',
    subtitle: 'Afterburner Arc · SB-143',
    description:
      'Cryo-platinum pearlescent nose sweeping into electric cyan & ultraviolet plasma tongues, live lightning filigree veins, thin-film sapphire coat & G-reactive voltage spikes.',
    badge: 'REACTIVE PLASMA · LIVING 3D',
    shaderMode: 2,
    accentHex: 0x26c6ff,
    coreHex: 0x9cf7ff,
    swatchCss: 'linear-gradient(125deg, #e2eef7 0%, #2b64ff 42%, #47f0ff 56%, #070d1a 74%, #111c36 100%)',
    airframes: ['su30', 'gripen', 'kestrel'],
  },
  {
    id: 'nebula_prism',
    name: 'Nebula · Sovereign Prism',
    subtitle: 'Deep-Space Parallax · SB-143',
    description:
      'Moonstone satin lacquer over deep 3D parallax glass-obsidian wings containing drifting magenta-violet starfields, prism diffraction highlights & liquid rose-gold flame rims.',
    badge: 'PARALLAX COSMOS · LIVING 3D',
    shaderMode: 3,
    accentHex: 0xd946ef,
    coreHex: 0xffc6f6,
    swatchCss: 'linear-gradient(125deg, #ebe6f2 0%, #b829d6 42%, #ff99d8 58%, #0a0616 74%, #1f1038 100%)',
    airframes: ['su30', 'gripen', 'kestrel'],
  },
  {
    id: 'aurora_jade',
    name: 'Solaris · Aurora Borealis',
    subtitle: 'Oil-Slick Curtain · SB-143',
    description:
      'Brushed silver-frost airframe flowing into liquid jade-teal & solar-gold aurora ribbons with optical oil-slick interference and night-orbit bioluminescence.',
    badge: 'OIL-SLICK AURORA · LIVING 3D',
    shaderMode: 4,
    accentHex: 0x2df5a8,
    coreHex: 0xffe488,
    swatchCss: 'linear-gradient(125deg, #e5eeea 0%, #10b981 42%, #f4d36e 58%, #061414 74%, #0f292b 100%)',
    airframes: ['su30', 'gripen', 'kestrel'],
  },
  {
    id: 'stock',
    name: 'Factory Stock',
    subtitle: 'Standard Service Airframe',
    description:
      'Authentic factory operational camouflage and squadron markings preserved with full panel-line depth, specular sheen, and heat-tinted titanium exhaust petals.',
    badge: 'FACTORY STANDARD',
    shaderMode: 0,
    accentHex: 0x8ea4be,
    coreHex: 0xe6edf5,
    swatchCss: 'linear-gradient(135deg, #748091 0%, #4b5563 52%, #2b323d 100%)',
    airframes: ['su30', 'gripen', 'kestrel'],
  },
];

export const JET_SKIN_BY_ID: Readonly<Record<JetSkinId, JetSkinSpec>> = {
  flame_phantom: JET_SKINS[0],
  plasma_ion: JET_SKINS[1],
  nebula_prism: JET_SKINS[2],
  aurora_jade: JET_SKINS[3],
  stock: JET_SKINS[4],
};

export interface CanopyTintSpec {
  id: CanopyTintId;
  name: string;
  subtitle: string;
}

export const CANOPY_TINTS: ReadonlyArray<CanopyTintSpec> = [
  { id: 'clear', name: 'Clear', subtitle: 'Optical Acrylic' },
  { id: 'smoked', name: 'Smoked', subtitle: 'Dark Exterior Tint' },
  { id: 'gold', name: 'Gold Iridium', subtitle: 'Radar-Absorbent Film' },
];

export interface AirshowSmokeSpec {
  id: AirshowSmokeId;
  name: string;
  /** Primary pigment hex (sRGB) for dense airshow plumes. */
  colorHex: number;
  /** Secondary highlight / ember core hex (sRGB). */
  accentHex: number;
}

export const AIRSHOW_SMOKES: ReadonlyArray<AirshowSmokeSpec> = [
  { id: 'off', name: 'Off', colorHex: 0xd8dce4, accentHex: 0xd8dce4 },
  { id: 'ember', name: 'Ember', colorHex: 0xff6b24, accentHex: 0xffcf5c },
  { id: 'crimson', name: 'Crimson', colorHex: 0xe6293d, accentHex: 0xff6e7a },
  { id: 'cobalt', name: 'Cobalt', colorHex: 0x267dff, accentHex: 0x73c4ff },
  { id: 'gold', name: 'Gold', colorHex: 0xf0ad2b, accentHex: 0xffe48a },
];

export const AIRSHOW_SMOKE_BY_ID: Readonly<Record<AirshowSmokeId, AirshowSmokeSpec>> = {
  off: AIRSHOW_SMOKES[0],
  ember: AIRSHOW_SMOKES[1],
  crimson: AIRSHOW_SMOKES[2],
  cobalt: AIRSHOW_SMOKES[3],
  gold: AIRSHOW_SMOKES[4],
};

function readStorage(key: string): string | null {
  try {
    return globalThis.localStorage?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string): void {
  try {
    globalThis.localStorage?.setItem(key, value);
  } catch {
    /* storage blocked */
  }
}

export function isJetSkinId(v: unknown): v is JetSkinId {
  return (
    v === 'flame_phantom' ||
    v === 'plasma_ion' ||
    v === 'nebula_prism' ||
    v === 'aurora_jade' ||
    v === 'stock'
  );
}

export function isCanopyTintId(v: unknown): v is CanopyTintId {
  return v === 'clear' || v === 'smoked' || v === 'gold';
}

export function isAirshowSmokeId(v: unknown): v is AirshowSmokeId {
  return v === 'off' || v === 'crimson' || v === 'cobalt' || v === 'gold' || v === 'ember';
}

export function chosenJetSkin(): JetSkinId {
  const v = readStorage(JET_SKIN_KEY);
  return isJetSkinId(v) ? v : 'flame_phantom';
}

export function setChosenJetSkin(id: JetSkinId): void {
  writeStorage(JET_SKIN_KEY, isJetSkinId(id) ? id : 'flame_phantom');
}

export function chosenHoloAura(): boolean {
  const v = readStorage(HOLO_AURA_KEY);
  return v === null ? true : v === '1' || v === 'true';
}

export function setChosenHoloAura(enabled: boolean): void {
  writeStorage(HOLO_AURA_KEY, enabled ? '1' : '0');
}

export function chosenCanopyTint(): CanopyTintId {
  const v = readStorage(CANOPY_TINT_KEY);
  return isCanopyTintId(v) ? v : 'clear';
}

export function setChosenCanopyTint(id: CanopyTintId): void {
  writeStorage(CANOPY_TINT_KEY, isCanopyTintId(id) ? id : 'clear');
}

export function chosenAirshowSmoke(): AirshowSmokeId {
  const v = readStorage(AIRSHOW_SMOKE_KEY);
  return isAirshowSmokeId(v) ? v : 'ember';
}

export function setChosenAirshowSmoke(id: AirshowSmokeId): void {
  writeStorage(AIRSHOW_SMOKE_KEY, isAirshowSmokeId(id) ? id : 'ember');
}

export function nextAirshowSmoke(current: AirshowSmokeId): AirshowSmokeId {
  const order: ReadonlyArray<AirshowSmokeId> = ['off', 'ember', 'crimson', 'cobalt', 'gold'];
  const idx = order.indexOf(current);
  return order[(idx + 1) % order.length];
}
