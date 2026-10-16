/**
 * Vela, in pixels. A glowing orb with a star on her antenna and two stubby arms, drawn on a
 * 23 × 21 grid around centre column 11 (pixel x mirrors to 22 − x). Every expression and costume
 * is a set of pixels, composed per frame.
 */

export type Eyes = 'open' | 'blink' | 'happy' | 'wide' | 'closed' | 'x' | 'heart' | 'squint';
export type Mouth = 'smile' | 'flat' | 'open' | 'o' | 'grin' | 'wobble';
export type Arms = 'down' | 'wave1' | 'wave2' | 'point' | 'up' | 'hold';
export type Costume = 'none' | 'shades' | 'headphones' | 'hardhat' | 'glasses' | 'scarf';

export interface Face {
  eyes: Eyes;
  mouth: Mouth;
  arms: Arms;
  costume: Costume;
  /** Where she looks, -1..1 each way. */
  gaze: [number, number];
  cheeks: boolean;
  sweat: boolean;
  /** Antenna star: 0 small, 1 big (it twinkles). */
  star: 0 | 1;
}

export const W = 23;
export const H = 21;
const CX = 11;
const CY = 12;
const R = 6.4;

const P = {
  outline: '#0e3a32',
  body: '#6dfcc0',
  shade: '#38c995',
  light: '#e2fff4',
  eye: '#071014',
  shine: '#ffffff',
  star: '#ffd28a',
  starCore: '#fff6e0',
  cheek: '#ff8fa6',
  tongue: '#ff6f8a',
  hat: '#ffc94a',
  hatShade: '#d99a1c',
  shades: '#0a0a10',
  rim: '#dcab76',
  phones: '#5b6476',
  cup: '#dcab76',
  sweat: '#7cc8ff',
  scarf: '#ff7a59',
  scarfShade: '#c9502f',
};

export type Px = [number, number, string];

export function draw(f: Face): Px[] {
  const px = new Map<number, string>();
  const set = (x: number, y: number, c: string) => {
    if (x >= 0 && y >= 0 && x < W && y < H) px.set(y * W + x, c);
  };
  /** The same pixel on both sides. */
  const both = (x: number, y: number, c: string) => { set(x, y, c); set(2 * CX - x, y, c); };

  // Antenna and its twinkling star
  set(CX, 4, P.outline);
  set(CX, 3, P.outline);
  if (f.star) {
    set(CX, 0, P.star); both(CX - 1, 1, P.star); set(CX, 2, P.star); set(CX, 1, P.starCore);
  } else {
    set(CX, 1, P.starCore); set(CX, 2, P.star);
  }

  // Body: outline ring, shading to the lower right, a highlight upper left
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const dx = x - CX;
      const dy = y - CY;
      const d = Math.hypot(dx, dy);
      if (d < R) {
        let c = P.body;
        if (dx * 0.55 + dy * 0.85 > 2.6) c = P.shade;
        if (Math.hypot(x - 8, y - 9) < 1.3) c = P.light;
        set(x, y, c);
      } else if (d < R + 1) set(x, y, P.outline);
    }
  }

  // Arms: two-pixel-thick body-coloured limbs, outlined automatically
  const left: Record<Arms, Array<[number, number]>> = {
    down: [[3, 13], [3, 14], [2, 14], [2, 15]],
    wave1: [[3, 13], [3, 14], [2, 14], [2, 15]],
    wave2: [[3, 13], [3, 14], [2, 14], [2, 15]],
    point: [[3, 13], [3, 14], [2, 14], [2, 15]],
    up: [[3, 11], [3, 10], [2, 10], [2, 9], [3, 12]],
    hold: [[6, 17], [7, 17], [6, 16]],
  };
  const right: Record<Arms, Array<[number, number]>> = {
    down: [[19, 13], [19, 14], [20, 14], [20, 15]],
    wave1: [[19, 11], [19, 10], [20, 10], [20, 9], [21, 9], [21, 8]],
    wave2: [[19, 11], [19, 10], [19, 9], [20, 9], [20, 8], [20, 7]],
    point: [[19, 12], [20, 12], [21, 12], [19, 13], [20, 13], [21, 13]],
    up: [[19, 11], [19, 10], [20, 10], [20, 9], [19, 12]],
    hold: [[16, 17], [15, 17], [16, 16]],
  };
  const limbs = [...left[f.arms], ...right[f.arms]];
  for (const [x, y] of limbs) set(x, y, P.body);
  for (const [x, y] of limbs) {
    for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) {
      const k = (y + j) * W + (x + i);
      if (x + i >= 0 && x + i < W && y + j >= 0 && y + j < H && !px.has(k)) set(x + i, y + j, P.outline);
    }
  }

  // Eyes. Two-pixel shapes sit in columns 8–9 and 13–14; three-pixel ones in 7–9 and 13–15.
  const gx = Math.max(-1, Math.min(1, Math.round(f.gaze[0])));
  const gy = Math.max(-1, Math.min(1, Math.round(f.gaze[1])));
  for (const side of [0, 1]) {
    const x2 = (side ? 13 : 8) + gx;
    const x3 = side ? 13 : 7;
    const y = 11 + gy;
    switch (f.eyes) {
      case 'open':
        for (let j = 0; j < 3; j++) for (let i = 0; i < 2; i++) set(x2 + i, y + j, P.eye);
        set(x2, y, P.shine);
        break;
      case 'wide':
        for (let j = 0; j < 3; j++) for (let i = 0; i < 3; i++) set(x3 + gx + i, 11 + j, P.eye);
        set(x3 + gx, 11, P.shine); set(x3 + gx + 1, 11, P.shine);
        break;
      case 'blink': set(x2, 13, P.eye); set(x2 + 1, 13, P.eye); break;
      case 'closed': for (let i = 0; i < 3; i++) set(x3 + i, 13, P.eye); break;
      case 'squint': set(x3, 12, P.eye); set(x3 + 1, 13, P.eye); set(x3 + 2, 12, P.eye); break;
      case 'happy': set(x3, 13, P.eye); set(x3 + 1, 12, P.eye); set(x3 + 2, 13, P.eye); break;
      case 'x': set(x3, 11, P.eye); set(x3 + 2, 11, P.eye); set(x3 + 1, 12, P.eye); set(x3, 13, P.eye); set(x3 + 2, 13, P.eye); break;
      case 'heart':
        set(x3, 11, P.cheek); set(x3 + 2, 11, P.cheek);
        for (let i = 0; i < 3; i++) set(x3 + i, 12, P.cheek);
        set(x3 + 1, 13, P.cheek);
        break;
    }
  }

  // Mouth, centred on column 11
  switch (f.mouth) {
    case 'smile': both(9, 15, P.eye); both(10, 16, P.eye); set(11, 16, P.eye); break;
    case 'flat': both(10, 16, P.eye); set(11, 16, P.eye); break;
    case 'open': both(10, 15, P.eye); set(11, 15, P.eye); both(10, 16, P.tongue); set(11, 16, P.tongue); break;
    case 'o': set(11, 15, P.eye); both(10, 16, P.eye); set(11, 17, P.eye); break;
    case 'grin': both(9, 15, P.eye); both(10, 15, P.eye); set(11, 15, P.eye); both(10, 16, P.tongue); set(11, 16, P.tongue); break;
    case 'wobble': both(9, 16, P.eye); both(10, 15, P.eye); set(11, 16, P.eye); break;
  }
  if (f.cheeks) both(6, 14, P.cheek);
  if (f.sweat) { set(18, 8, P.sweat); set(18, 9, P.sweat); set(19, 9, P.sweat); }

  // Costumes
  switch (f.costume) {
    case 'shades':
      for (let x = 6; x <= 16; x++) set(x, 11, P.shades);
      for (let i = 0; i < 4; i++) { set(7 + i, 12, P.shades); set(12 + i, 12, P.shades); }
      set(8, 11, P.rim); set(13, 11, P.rim);
      break;
    case 'glasses':
      for (const x0 of [7, 12]) {
        for (let i = 0; i < 4; i++) { set(x0 + i, 10, P.rim); set(x0 + i, 14, P.rim); }
        for (let j = 10; j <= 14; j++) { set(x0, j, P.rim); set(x0 + 3, j, P.rim); }
      }
      set(11, 11, P.rim);
      break;
    case 'headphones':
      for (let x = 4; x <= 18; x++) {
        const dx = x - CX;
        if (Math.abs(dx) > 7.6) continue;
        set(x, Math.round(CY - Math.sqrt(7.6 * 7.6 - dx * dx)), P.phones);
      }
      for (let j = 11; j <= 14; j++) { both(3, j, P.cup); both(4, j, P.cup); }
      break;
    case 'hardhat':
      for (let y = 5; y <= 7; y++) for (let x = 5; x <= 17; x++) {
        if (Math.abs(x - CX) <= 5.4 - (7 - y) * 1.3) set(x, y, y === 7 ? P.hatShade : P.hat);
      }
      for (let x = 3; x <= 19; x++) set(x, 8, P.hatShade);
      set(CX, 5, P.hatShade);
      break;
    case 'scarf':
      for (let x = 5; x <= 17; x++) set(x, 17, x % 2 ? P.scarf : P.scarfShade);
      set(15, 18, P.scarf); set(15, 19, P.scarfShade); set(16, 18, P.scarfShade);
      break;
  }

  return [...px.entries()].map(([k, c]) => [k % W, Math.floor(k / W), c] as Px);
}
