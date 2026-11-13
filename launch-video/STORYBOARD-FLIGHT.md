# SOLARIS 2.0 — "Now you can fly it" (third launch film)

**Concept.** The first films showed the Solar System. This one hands you the stick. It is cut as
modern motion design (the reference: big kinetic sentences with inline chips, glass cards and
small callouts floating over soft-focus footage, fast confident cuts), but every picture behind
the type is real Solaris footage: the jet over the whole Earth in 3D, NASA's fleet where it
really is, and the planets from the cockpit.

- 1920×1080, 30 fps, ~62 s
- Type: Rajdhani / Montserrat for the sentences, JetBrains Mono for data, Instrument Serif italic
  for the one human line
- Palette: night `#050407`, paper `#f3f1ec` (the type cards), mint `#6dfcc0` (the HUD), sand gold
  `#dcab76`, one warm accent `#ff6a3d` for the cursor and the chips' highlights
- Sound: a Solaris soundtrack side as the bed, the game's own cockpit audio on top (engine start,
  mask breathing, real radio takes, Betty), whooshes and ticks on the cuts, sub hits on the titles

| Time | Beat | Picture | Type / sound |
|---|---|---|---|
| 0–4 | Hook | Paper card. A sentence types itself | "You've seen the Solar System." → the cursor deletes "seen" → **"flown"** in orange. Tick per key |
| 4–8 | Ignition | Black. Engine start. Cockpit fades up at dawn, canopy glass, HUD boots | Radio: "Solaris One-One, cleared as filed." Title chip: `SOLARIS 2.0` |
| 8–20 | The whole Earth | Fast landmark cuts from the jet, golden hour: Manhattan, Everest, Paris, Giza, Tokyo, Grand Canyon, Golden Gate, Sydney, Rio, Matterhorn | Sentence builds across cuts: "The whole **[🌍 Earth]**" · "**1:1**" · "in **[3D]**". Each cut stamps a tactical location card (decoding name, MGRS grid) |
| 20–27 | Four cameras | Same pass seen four ways, split into four panels that slide in | Chips: `CHASE` `COCKPIT` `GOPRO` `FLY-BY`. "Fly it your way." |
| 27–33 | The HUD | Live HUD footage inside a glass card, callouts draw to the parts | Callouts: "Real MGRS grid", "Mach, G, climb", "ENTERING AIRSPACE". Radio take plays, subtitle card |
| 33–41 | Up | Climb through cloud, the sky goes black, the curve of Earth; the ISS drifts past, then Hubble, JWST | "Then keep **[↑ climbing]**." · Counter: `150+ NASA spacecraft · where they really are, right now` |
| 41–50 | The Solar System | Jet at Saturn's rings, Olympus Mons, Io; Voyager; the tactical card reads `SATURN · LIGHT-TIME 1H 19M` | "Every world." "Real distances." "One jet." Hits on the beat |
| 50–56 | Postcards | The best stills of Solaris as a fan of photo cards | Serif: *"It's all real. It's all there."* |
| 56–62 | Lockup | Mark + SOLARIS 2.0, cockpit glow behind | "Fly the Solar System." · `solarises.vercel.app` · engine fades |

## Pipeline

1. `capture/flight-shots.mjs` records each shot on the frame-perfect rig (`rig.mjs`).
2. `remotion/Flight.tsx` composes the film (composition id `Flight`).
3. `capture/flight_mix.py` prepares the sound bed.
