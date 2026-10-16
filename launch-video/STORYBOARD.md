# SOLARIS — launch film storyboard

**Concept: Light Travel.** Every frame of the film rides with one photon leaving the Sun. A light-clock in the corner counts
the real time light takes to reach each world, so the edit itself is a lesson in scale: minutes to Earth, hours to
Neptune, 27,000 years to the black hole. Every shot is real footage of the Solaris website, captured frame by frame.

- 1920×1080, 30 fps, ~66 s
- Music: *Helios Overture* (Solaris soundtrack, side 00), 95.7 BPM. Its ambient intro (0–15 s) is the cold open, the
  first hit lands at 15.0 s, and the beat grid starts at 16.37 s (one beat = 0.627 s, one bar = 2.51 s)
- Type: Montserrat (thin, wide-tracked caps), Instrument Serif italic for the human lines, JetBrains Mono for the clock
- Palette: the mark's sand gold `#dcab76`, deep night `#050407`, mint `#6dfcc0` accents (from the HUD)

| Time | Act | Picture | Type / sound |
|---|---|---|---|
| 0.0–4.0 | Cold open | Black. One point of light breathes in the centre | Clock `00:00:00` ticks. *"Every light in this film has already left."* |
| 4.0–15.0 | The Sun | Macro push across the photoreal photosphere: granules, flares, prominences, then pull back | Serif line: *"8 minutes, 20 seconds ago, it left the Sun."* Riser into the hit |
| 15.0–19.4 | Title | The Solaris mark draws itself: orbits sweep in, worlds drop onto them, the star flares. SOLARIS tracks in | Hit + bloom flash. *"The real Solar System. Live in your browser."* |
| 19.4–31.0 | The journey | Beat cuts outward: Mercury, Venus, **Earth** (holds; the Moon's *"sliver of home"*), Mars at dusk, Jupiter by night from Europa, Saturn after sunset, Uranus and the Milky Way, Neptune's crescent, Pluto & Charon | The clock jumps per cut: 3m13s, 6m01s, 8m19s, 12m40s, 43m15s, 1h19m, 2h39m, 4h10m, 5h28m |
| 31.0–48.0 | What it is | Feature montage with kinetic labels: orbits in time-lapse, standing on a world and looking up, flying into the Cosmic Cliffs, Vela, the vinyl soundtrack, the Atlas | Pills: *Real orbits · NASA JPL*, *Stand anywhere. Look up.*, *Fly into nebulae*, *Meet Vela* (her voice), *A song for every world*, *478 worlds* |
| 48.0–56.0 | Beyond | At the music's peak: the scale ladder zooms out through the stars to the Milky Way, then dives to Sgr A* and its lensed horizon | Clock spins to `27,000 YEARS` |
| 56.0–66.0 | Lockup | The mark and SOLARIS on night, the light settles | *"Look up."* · `solarises.vercel.app` |

## Pipeline

1. `capture/` drives the site in a GPU Chromium with a virtual clock (every frame stepped exactly 1/30 s, CSS animations
   included), writes PNG frames per shot, and encodes each shot with ffmpeg.
2. `remotion/` composes the film: footage, the drawn logo, the light-clock, kinetic type, grain, light leaks and the mix.
3. Output: `out/solaris-launch.mp4` (H.264, high bitrate) plus a 1080×1920 vertical cut if time allows.
