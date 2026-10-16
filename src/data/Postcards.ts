/**
 * Postcards: the most beautiful views in Solaris, each one a real place, moment and direction you
 * can return to. The pictures in public/gallery/ were taken in Solaris itself, from exactly these
 * settings, so "Take me there" puts you in the same frame.
 */

export interface Postcard {
  id: string;
  title: string;
  /** Where you stand, in a few words. */
  place: string;
  /** One line about what you are looking at. */
  caption: string;
  body: string;
  lat: number;
  lon: number;
  /** The moment (UTC). */
  utc: string;
  /** Compass heading and height above the horizon of the view, degrees. */
  heading: number;
  pitch: number;
  fov: number;
  /** Planet sizes in the sky: 1 real, 10, 100, 1000 = poster. */
  magnification: number;
  atmosphere?: boolean;
}

export const POSTCARDS: Postcard[] = [
  {
    id: 'event-horizon-sea', title: 'The shore of Sagittarius A*', place: 'An imagined ocean world beside the black hole',
    caption: 'Light from the far side of the disc bends up and over the shadow. The world is invented; the way the light bends is not.',
    body: 'Sagittarius A*', lat: 0, lon: 0, utc: '2026-10-16T12:00:00Z', heading: 0, pitch: 0, fov: 52, magnification: 1,
  },
  {
    id: 'crescent-saturn', title: 'Saturn, after sunset', place: 'Mimas, near the equator',
    caption: 'From Mimas, Saturn never moves in the sky. The Sun has just set, the giant is a crescent, and its rings, seen edge-on, cut across it like a blade.',
    body: 'Mimas', lat: -9.51, lon: -49.33, utc: '2026-10-16T20:01:15Z', heading: 95, pitch: 30, fov: 84, magnification: 1,
  },
  {
    id: 'charon-core', title: 'Charon over the heart of the galaxy', place: 'Pluto, the side that faces Charon',
    caption: 'Pluto and Charon face each other forever, so Charon hangs over only one half of Pluto and never moves. Behind it, the centre of the Milky Way. It is midday, and the sky is black.',
    body: 'Pluto', lat: 44.95, lon: 26.1, utc: '2026-11-18T01:05:05Z', heading: 213, pitch: 29, fov: 46, magnification: 1,
  },
  {
    id: 'earth-sliver', title: 'A sliver of home', place: 'The Moon, east of the Sea of Tranquillity',
    caption: "Earth sits close to the Sun in the Moon's sky, so only a thin blue crescent is lit, over the night horizon, with the Milky Way rising behind it. Drawn ten times larger.",
    body: 'Moon', lat: 3.5, lon: 49.91, utc: '2026-10-28T20:01:32Z', heading: 267, pitch: 24, fov: 64, magnification: 10,
  },
  {
    id: 'uranus-galaxy', title: 'Uranus and the Milky Way', place: 'Miranda, southern hemisphere',
    caption: 'Half-lit Uranus beside the Milky Way and both Magellanic Clouds, from the little moon with the tallest cliffs known.',
    body: 'Miranda', lat: -48.8, lon: -12.63, utc: '2026-11-19T01:05:20Z', heading: 22, pitch: 37, fov: 66, magnification: 1,
  },
  {
    id: 'neptune-crescent', title: 'The blue crescent', place: 'Triton',
    caption: 'Neptune hangs sixteen times wider than our Moon, lit from the side by a Sun nine hundred times fainter than at home.',
    body: 'Triton', lat: 22.26, lon: 46.01, utc: '2026-11-18T01:04:40Z', heading: 247, pitch: 37, fov: 20, magnification: 1,
  },
  {
    id: 'jupiter-night', title: 'Jupiter by night', place: 'Europa, the side facing Jupiter',
    caption: 'Jupiter never sets over this side of Europa. At night it is a crescent twenty-four times wider than the full Moon.',
    body: 'Europa', lat: -0.24, lon: 50, utc: '2026-11-15T17:04:24Z', heading: 266, pitch: 36, fov: 30, magnification: 1,
  },
  {
    id: 'martian-dusk', title: 'Two worlds at dusk', place: 'Mars, Meridiani Planum',
    caption: 'Minutes after sunset, the blue Martian dusk glows over the horizon. Above it, Earth with its Moon, and Venus, drawn poster-size.',
    body: 'Mars', lat: 4.94, lon: -3.65, utc: '2026-11-14T05:49:00Z', heading: 283, pitch: 15, fov: 72, magnification: 1000,
  },
];

export const postcardImage = (p: Postcard, thumb = false): string =>
  `${import.meta.env.BASE_URL || '/'}gallery/${p.id}${thumb ? '_thumb' : ''}.jpg`;
