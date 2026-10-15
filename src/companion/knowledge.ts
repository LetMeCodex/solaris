/**
 * Vela's knowledge: fun facts (checked against NASA / ESA fact sheets), the hidden things Solaris
 * can do, and a small intent parser that turns what the user types or says into an answer and,
 * where it makes sense, an action.
 */

export type CompanionAction =
  | { kind: 'fly'; body: string }
  | { kind: 'sky'; body: string; facing?: string }
  | { kind: 'landmark'; id: string; body: string }
  | { kind: 'horizon' }
  | { kind: 'lens'; name: 'cinematic' | 'fisheye' | 'clean' }
  | { kind: 'scale'; mode: 'exploration' | 'scientific' }
  | { kind: 'time'; rate: number }
  | { kind: 'orbits' }
  | { kind: 'tour' }
  | { kind: 'overview' };

export interface Chip {
  label: string;
  /** Either say this as if the user had typed it… */
  ask?: string;
  /** …or run this directly. */
  action?: CompanionAction;
}

export interface Reply {
  text: string;
  chips?: Chip[];
  action?: CompanionAction;
}

/* ----------------------------------------------------------------------------------------------
   Fun facts, per world
   ---------------------------------------------------------------------------------------------- */
export const FACTS: Record<string, string[]> = {
  Sun: [
    'The Sun holds about 99.86 percent of all the mass in the Solar System. Everything else, every planet, moon and comet, is the leftover crumbs.',
    'The light touching you left the Sun\'s surface about eight minutes ago. But the energy in it was made in the core thousands of years earlier, and has been slowly wandering outwards ever since.',
    'About one point three million Earths would fit inside the Sun.',
  ],
  Mercury: [
    'On Mercury, one solar day, sunrise to sunrise, lasts 176 Earth days. That is two of its years.',
    'Mercury is shrinking. As its iron core cools, the whole planet contracts, and its crust has wrinkled into cliffs hundreds of kilometres long.',
    'Even this close to the Sun, there is water ice on Mercury, hidden in craters at its poles that never see daylight.',
  ],
  Venus: [
    'A day on Venus is longer than its year. It takes 243 Earth days to turn once, but only 225 to circle the Sun. And it spins backwards.',
    'The ground on Venus is about 465 degrees. Hot enough to melt lead, and the hottest surface of any planet, even though Mercury is closer to the Sun.',
    'Standing on Venus would feel like being nine hundred metres under the ocean. Its air is that heavy.',
  ],
  Earth: [
    'Every year the Moon drifts about three point eight centimetres further away from us. Roughly the speed your fingernails grow.',
    'As far as we know, this is the only place in the universe where anyone has ever looked up and wondered.',
    'Earth is the densest planet in the Solar System.',
  ],
  Moon: [
    'We only ever see one face of the Moon. It turns exactly once for each trip around Earth.',
    'With no wind and no rain, the footprints the Apollo astronauts left could last for millions of years.',
    'The Moon is a quarter of Earth\'s width. Compared with its planet, it is one of the largest moons there is.',
  ],
  Mars: [
    'Olympus Mons, on Mars, is about 22 kilometres high. Two and a half times the height of Everest.',
    'Sunsets on Mars are blue. The fine dust scatters blue light forward, around the setting Sun.',
    'Phobos, the larger moon of Mars, is slowly spiralling inwards. In about fifty million years it will break apart and may form a ring.',
  ],
  Jupiter: [
    'Jupiter has more than twice the mass of all the other planets put together.',
    'The Great Red Spot is a storm wider than the whole Earth, and it has been raging for at least a hundred and fifty years.',
    'A day on Jupiter lasts less than ten hours. The fastest spin of any planet.',
  ],
  Saturn: [
    'Saturn is less dense than water. In a bathtub big enough, it would float.',
    'Saturn\'s rings are hundreds of thousands of kilometres wide, but in most places only about ten metres to a kilometre thick.',
    'At Saturn\'s north pole there is a storm shaped like a hexagon, each side wider than the Earth.',
  ],
  Uranus: [
    'Uranus rolls around the Sun on its side, tilted ninety eight degrees. Each pole gets about forty two years of sunlight, then forty two years of night.',
    'Uranus has the coldest atmosphere of any planet, down to minus 224 degrees.',
    'Its moons are named after characters from Shakespeare and Alexander Pope. Miranda, Ariel, Titania, Oberon.',
  ],
  Neptune: [
    'Neptune was found with mathematics before anyone saw it. Its pull on Uranus gave it away in 1846.',
    'Neptune has the fastest winds in the Solar System, over two thousand kilometres an hour.',
    'One year on Neptune lasts 165 of ours. It finished its first full orbit since its discovery only in 2011.',
  ],
  Pluto: [
    'That pale heart on Pluto is a glacier of nitrogen ice, about a thousand kilometres across.',
    'Pluto and Charon are locked face to face. Each always shows the other the same side, like dancers holding hands.',
    'One year on Pluto lasts 248 Earth years. It has not completed a single orbit since it was discovered in 1930.',
  ],
  Charon: [
    'Charon is half the width of Pluto. So big that the two of them orbit a point in empty space between them.',
    'Charon\'s red north pole is painted by Pluto. Gas escaping Pluto freezes there and is slowly reddened by sunlight.',
  ],
  'Sagittarius A*': [
    'Sagittarius A star has the mass of about four point three million Suns, packed into a region smaller than Mercury\'s orbit.',
    'Its light has been travelling for twenty seven thousand years to reach us. It left before the first cities were built.',
    'In 2022 the Event Horizon Telescope photographed its shadow. Seen from Earth it is about as big as a doughnut on the Moon.',
    'A star called S2 swings around it every sixteen years, reaching seven thousand six hundred kilometres per second.',
  ],
  Io: ['Io is the most volcanic place in the Solar System. Its volcanoes throw plumes hundreds of kilometres into space.'],
  Europa: ['Under Europa\'s ice there is a salty ocean holding about twice as much water as all of Earth\'s oceans.'],
  Ganymede: ['Ganymede is bigger than the planet Mercury, and it is the only moon with its own magnetic field.'],
  Callisto: ['Callisto is the most heavily cratered object we know. Its surface has barely changed in four billion years.'],
  Titan: [
    'Titan has a thicker atmosphere than Earth, and lakes and rain made of methane.',
    'On Titan, with its thick air and low gravity, you could strap on wings and fly by flapping your arms.',
  ],
  Enceladus: ['Enceladus sprays water into space from cracks near its south pole. Those jets feed one of Saturn\'s rings.'],
  Mimas: ['Mimas has a crater so huge it looks like the Death Star. The impact nearly shattered it.'],
  Iapetus: ['Iapetus is two-faced. One side is as dark as coal, the other as bright as snow.'],
  Triton: ['Triton orbits Neptune backwards. It was probably captured from the Kuiper belt.'],
  Phobos: ['Phobos orbits faster than Mars spins. From the Martian surface it rises in the west and sets in the east, twice a day.'],
  Miranda: ['Miranda has Verona Rupes, a cliff about twenty kilometres high. A fall from the top would last about twelve minutes.'],
};

/** Number of known moons (IAU / NASA, 2024). */
export const MOONS: Record<string, number> = {
  Mercury: 0, Venus: 0, Earth: 1, Mars: 2, Jupiter: 95, Saturn: 146, Uranus: 28, Neptune: 16, Pluto: 5,
};

/* ----------------------------------------------------------------------------------------------
   Hidden things worth showing someone
   ---------------------------------------------------------------------------------------------- */
export interface Secret {
  id: string;
  /** Worlds where Vela should mention this on arrival. */
  at: string[];
  pitch: string;
  chip: Chip;
}

export const SECRETS: Secret[] = [
  { id: 'mimas', at: ['Saturn', 'Mimas'], pitch: 'Want to see something beautiful? I can put you on the surface of Mimas, with Saturn\'s rings slicing across the whole sky.', chip: { label: 'Stand on Mimas', action: { kind: 'sky', body: 'Mimas', facing: 'Saturn' } } },
  { id: 'iapetus', at: ['Saturn', 'Iapetus'], pitch: 'From Iapetus, far out and tilted, you can see Saturn\'s rings wide open.', chip: { label: 'Open rings from Iapetus', action: { kind: 'sky', body: 'Iapetus', facing: 'Saturn' } } },
  { id: 'enceladus', at: ['Saturn', 'Enceladus'], pitch: 'We could stand on Enceladus, on the ice, with Saturn hanging overhead.', chip: { label: 'Saturn from Enceladus', action: { kind: 'sky', body: 'Enceladus', facing: 'Saturn' } } },
  { id: 'moon-earth', at: ['Earth', 'Moon'], pitch: 'Do you want to stand on the Moon and look back at Earth? It hangs there, never rising, never setting.', chip: { label: 'Earth from the Moon', action: { kind: 'sky', body: 'Moon', facing: 'Earth' } } },
  { id: 'everest', at: ['Earth'], pitch: 'I can take you down over Mount Everest, using real satellite imagery.', chip: { label: 'Fly to Everest', action: { kind: 'landmark', id: 'earth-everest', body: 'Earth' } } },
  { id: 'apollo', at: ['Moon'], pitch: 'Tranquility Base is down there, where Apollo 11 landed. Shall we go?', chip: { label: 'Tranquility Base', action: { kind: 'landmark', id: 'moon-tranquility', body: 'Moon' } } },
  { id: 'olympus', at: ['Mars'], pitch: 'Olympus Mons is right there on Mars. I can fly you over it.', chip: { label: 'Fly over Olympus Mons', action: { kind: 'landmark', id: 'mars-olympus', body: 'Mars' } } },
  { id: 'phobos', at: ['Mars', 'Phobos'], pitch: 'From Phobos, Mars fills the sky. And if you turn around, Earth, Venus and Mercury line up like jewels.', chip: { label: 'Mars from Phobos', action: { kind: 'sky', body: 'Phobos', facing: 'Mars' } } },
  { id: 'mars-sky', at: ['Mars'], pitch: 'Would you like to stand on Mars and see its sky for yourself?', chip: { label: 'Stand on Mars', action: { kind: 'sky', body: 'Mars' } } },
  { id: 'io', at: ['Jupiter', 'Io'], pitch: 'From Io, Jupiter is enormous. It covers nearly twenty degrees of sky, forty times the full Moon.', chip: { label: 'Jupiter from Io', action: { kind: 'sky', body: 'Io', facing: 'Jupiter' } } },
  { id: 'europa', at: ['Jupiter', 'Europa'], pitch: 'We could stand on Europa\'s ice and watch Jupiter overhead.', chip: { label: 'Jupiter from Europa', action: { kind: 'sky', body: 'Europa', facing: 'Jupiter' } } },
  { id: 'titan', at: ['Saturn', 'Titan'], pitch: 'Titan\'s orange haze is something else. Shall we land?', chip: { label: 'Into Titan\'s haze', action: { kind: 'sky', body: 'Titan' } } },
  { id: 'miranda', at: ['Uranus', 'Miranda'], pitch: 'From Miranda, Uranus hangs in the sky, blue-green and silent.', chip: { label: 'Uranus from Miranda', action: { kind: 'sky', body: 'Miranda', facing: 'Uranus' } } },
  { id: 'triton', at: ['Neptune', 'Triton'], pitch: 'On Triton\'s frozen nitrogen plains, Neptune fills the sky.', chip: { label: 'Neptune from Triton', action: { kind: 'sky', body: 'Triton', facing: 'Neptune' } } },
  { id: 'charon', at: ['Pluto', 'Charon'], pitch: 'From Charon, Pluto never moves in the sky. It just hangs there, forever.', chip: { label: 'Pluto from Charon', action: { kind: 'sky', body: 'Charon', facing: 'Pluto' } } },
  { id: 'horizon', at: ['Sagittarius A*'], pitch: 'There is a viewpoint here not many people find. Stand on the shore of an ocean world and watch the black hole rise. Then fly down towards the horizon, if you dare.', chip: { label: 'Take me to the shore', action: { kind: 'horizon' } } },
  { id: 'blackhole', at: ['Neptune', 'Pluto'], pitch: 'We are at the edge of the Solar System. Do you want to go much further? Twenty seven thousand light years, to the black hole at the centre of the galaxy.', chip: { label: 'To the black hole', action: { kind: 'fly', body: 'Sagittarius A*' } } },
  { id: 'fisheye', at: [], pitch: 'Try the fisheye lens. Everything curves like an astronaut\'s helmet visor.', chip: { label: 'Fisheye lens', action: { kind: 'lens', name: 'fisheye' } } },
  { id: 'true-scale', at: [], pitch: 'Here is a humbling one. Switch to true distances and see how empty space really is.', chip: { label: 'True distances', action: { kind: 'scale', mode: 'scientific' } } },
  { id: 'time', at: [], pitch: 'Push time to a year per second, and watch the whole Solar System turn like clockwork.', chip: { label: 'A year per second', action: { kind: 'time', rate: 31536000 } } },
];

/* ----------------------------------------------------------------------------------------------
   Intent parsing
   ---------------------------------------------------------------------------------------------- */
const ALIASES: Record<string, string> = {
  sun: 'Sun', mercury: 'Mercury', venus: 'Venus', earth: 'Earth', home: 'Earth', moon: 'Moon', luna: 'Moon',
  mars: 'Mars', jupiter: 'Jupiter', saturn: 'Saturn', uranus: 'Uranus', neptune: 'Neptune', pluto: 'Pluto',
  charon: 'Charon', io: 'Io', europa: 'Europa', ganymede: 'Ganymede', callisto: 'Callisto', titan: 'Titan',
  enceladus: 'Enceladus', mimas: 'Mimas', iapetus: 'Iapetus', triton: 'Triton', phobos: 'Phobos', deimos: 'Deimos',
  miranda: 'Miranda', 'black hole': 'Sagittarius A*', blackhole: 'Sagittarius A*', 'sgr a': 'Sagittarius A*',
  sagittarius: 'Sagittarius A*', 'galactic centre': 'Sagittarius A*', 'galactic center': 'Sagittarius A*',
};

export function findBody(text: string): string | null {
  const t = ` ${text.toLowerCase().replace(/[^a-z* ]/g, ' ')} `;
  // longest aliases first ("black hole" before "hole")
  for (const key of Object.keys(ALIASES).sort((a, b) => b.length - a.length)) {
    if (t.includes(` ${key} `) || t.includes(` ${key}s `)) return ALIASES[key];
  }
  return null;
}

export interface BodyInfo {
  radiusKm: number;
  aAU: number;
  periodDays: number;
  dayHours?: number;
  parent?: string;
}

export interface Context {
  current: string;
  lightFromEarthSec: number | null;
  info: (name: string) => BodyInfo | null;
}

const pick = <T,>(xs: T[]): T => xs[Math.floor(Math.random() * xs.length)];

function fmtDays(d: number): string {
  if (d > 730) return `${(d / 365.25).toFixed(d > 3650 ? 0 : 1)} Earth years`;
  return `${Math.round(d)} Earth days`;
}

function fmtLight(sec: number): string {
  if (sec < 60) return `${sec.toFixed(1)} seconds`;
  if (sec < 3600) return `${Math.round(sec / 60)} minutes`;
  return `${Math.floor(sec / 3600)} hours and ${Math.round((sec % 3600) / 60)} minutes`;
}

export const HELP_CHIPS: Chip[] = [
  { label: 'Tell me a fun fact', ask: 'tell me a fun fact' },
  { label: 'Show me something hidden', ask: 'show me something hidden' },
  { label: 'Take me to Saturn', ask: 'take me to saturn' },
  { label: 'Show me around', action: { kind: 'tour' } },
];

/** Turn a line from the user into Vela's answer. */
export function answer(input: string, ctx: Context): Reply {
  const q = input.toLowerCase().trim();
  const named = findBody(q);
  const body = named ?? ctx.current;
  const has = (...ws: string[]) => ws.some((w) => q.includes(w));

  if (!q) return { text: 'I\'m here. Ask me anything about where we are.', chips: HELP_CHIPS };

  if (has('who are you', 'your name', 'what are you')) {
    return { text: 'I\'m Vela. Named after the sails of an old constellation. I know every world in here, and a few secrets. I\'ll travel with you.', chips: HELP_CHIPS };
  }
  if (has('help', 'what can you do', 'what can i do', 'how does this work')) {
    return {
      text: 'You can ask me about any world, how far, how big, how long its day is. Ask me to take you somewhere, or to show you something hidden. I can also walk you through the instruments.',
      chips: HELP_CHIPS,
    };
  }
  if (has('tour', 'show me around', 'guide me', 'explain the', 'instruments')) {
    return { text: 'Of course. Let me show you around.', action: { kind: 'tour' } };
  }
  if (has('overview', 'whole solar system', 'zoom out', 'step back')) {
    return { text: 'Stepping back, so you can see everything at once.', action: { kind: 'overview' } };
  }
  if (has('horizon', 'stand near the black hole', 'shore')) {
    return { text: 'To the shore of the ocean world, beside the black hole. Hold on.', action: { kind: 'horizon' } };
  }

  // Standing on a surface / looking up
  if (has('stand on', 'land on', 'surface of', 'look up', 'sky from', 'sky of', 'atmosphere')) {
    const s = SECRETS.find((x) => x.chip.action?.kind === 'sky' && (x.chip.action as { body: string }).body === body);
    if (s?.chip.action) return { text: `Landing on ${body}. Look up when we get there.`, action: s.chip.action };
    return {
      text: `I can't put you on ${body}'s surface, but these skies are worth it.`,
      chips: SECRETS.filter((x) => x.chip.action?.kind === 'sky').slice(0, 4).map((x) => x.chip),
    };
  }

  // Travel
  if (named && has('take me', 'go to', 'fly to', 'travel', 'visit', 'show me', 'let\'s go', 'lets go', 'move to', 'jump to')) {
    return { text: named === 'Sagittarius A*' ? 'Twenty seven thousand light years. Here we go.' : `Setting course for ${named}.`, action: { kind: 'fly', body: named } };
  }

  // Controls
  if (has('fisheye')) return { text: 'Fisheye on. Like looking through a helmet visor.', action: { kind: 'lens', name: 'fisheye' } };
  if (has('cinematic lens', 'normal lens')) return { text: 'Back to the cinematic lens.', action: { kind: 'lens', name: 'cinematic' } };
  if (has('true distance', 'real distance', 'real scale', 'true scale')) return { text: 'True distances. Now you can feel how empty it is out here.', action: { kind: 'scale', mode: 'scientific' } };
  if (has('orbit line', 'orbits')) return { text: 'Switching the orbit lines.', action: { kind: 'orbits' } };
  if (has('pause', 'stop time', 'freeze time')) return { text: 'Time held.', action: { kind: 'time', rate: 1 } };
  if (has('faster', 'speed up', 'year per second')) return { text: 'A year every second. Watch them turn.', action: { kind: 'time', rate: 31536000 } };
  if (has('real time', 'slow down', 'normal speed')) return { text: 'Back to real time.', action: { kind: 'time', rate: 1 } };

  // Secrets
  if (has('secret', 'hidden', 'easter egg', 'something cool', 'surprise', 'something beautiful', 'what else')) {
    const local = SECRETS.filter((s) => s.at.includes(body));
    const s = local.length ? pick(local) : pick(SECRETS);
    return { text: s.pitch, chips: [s.chip, { label: 'Something else', ask: 'show me something hidden' }] };
  }

  // Facts and figures
  const info = ctx.info(body);
  if (has('how far', 'distance', 'how long does light', 'light take', 'signal')) {
    if (body === 'Sagittarius A*') return { text: 'About twenty seven thousand light years from the Sun. Eight point three kiloparsecs.' };
    if (info) {
      const extra = body === ctx.current && ctx.lightFromEarthSec != null ? ` Right now, light from Earth takes ${fmtLight(ctx.lightFromEarthSec)} to get here.` : '';
      return { text: `${body} orbits about ${info.aAU.toFixed(info.aAU < 2 ? 2 : 1)} astronomical units from the Sun. Sunlight takes ${fmtLight(info.aAU * 499.0)} to reach it.${extra}` };
    }
  }
  if (has('how big', 'size', 'radius', 'diameter', 'how large', 'wide')) {
    if (body === 'Sagittarius A*') return { text: 'Its event horizon is about twenty five million kilometres across. Smaller than Mercury\'s orbit, holding four million Suns.' };
    if (info) {
      const r = info.radiusKm / 6371;
      const cmp = r >= 1 ? `${r.toFixed(r > 10 ? 0 : 1)} times wider than Earth` : `${Math.round(r * 100)} percent of Earth's width`;
      return { text: `${body} is about ${Math.round(info.radiusKm * 2).toLocaleString('en-US')} kilometres across. ${cmp}.` };
    }
  }
  if (has('day', 'rotate', 'spin')) {
    if (info?.dayHours !== undefined) {
      const h = Math.abs(info.dayHours);
      return { text: `${body} turns once every ${h > 48 ? `${(h / 24).toFixed(1)} Earth days` : `${h.toFixed(1)} hours`}${info.dayHours < 0 ? ', and backwards' : ''}.` };
    }
  }
  if (has('year', 'orbit the sun', 'around the sun', 'period')) {
    if (info) return { text: `One year on ${body} lasts ${fmtDays(info.periodDays)}.` };
  }
  if (has('moon')) {
    if (MOONS[body] !== undefined) return { text: MOONS[body] === 0 ? `${body} has no moons at all.` : `${body} has ${MOONS[body]} known moons.` };
  }
  if (has('fact', 'tell me', 'interesting', 'about', 'what is', 'more')) {
    const fs = FACTS[body];
    if (fs) return { text: pick(fs), chips: [{ label: 'Another', ask: `another fact about ${body}` }, { label: 'Something hidden', ask: 'show me something hidden' }] };
  }
  if (named) {
    const fs = FACTS[named];
    return {
      text: fs ? pick(fs) : `${named} is out there. Want to go?`,
      chips: [{ label: `Take me to ${named}`, action: { kind: 'fly', body: named } }, { label: 'Another fact', ask: `fact about ${named}` }],
    };
  }

  return {
    text: 'I don\'t know that one yet. But I know every world here. Try asking how far, how big, or for something hidden.',
    chips: HELP_CHIPS,
  };
}

/** What Vela says on arriving somewhere (first visit this session gets a secret, if any). */
export function arrivalLine(body: string, firstTime: boolean): Reply | null {
  const facts = FACTS[body];
  const secrets = SECRETS.filter((s) => s.at.includes(body));
  if (!facts && !secrets.length) return null;
  const fact = facts ? pick(facts) : '';
  if (firstTime && secrets.length) {
    const s = secrets[0];
    return { text: `${fact} ${s.pitch}`.trim(), chips: [s.chip, { label: 'Tell me more', ask: `fact about ${body}` }] };
  }
  return { text: fact, chips: [{ label: 'Another fact', ask: `fact about ${body}` }, { label: 'Something hidden', ask: 'show me something hidden' }] };
}
