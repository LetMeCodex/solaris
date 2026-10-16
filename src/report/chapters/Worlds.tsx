import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Chapter, Fig, T, Cite, VelaNote, Loop } from '../kit';
import { SunLayers } from '../figures/SunLayers';
import { TilePyramid } from '../figures/TilePyramid';
import { NebulaLayers } from '../figures/NebulaLayers';

// ---------------------------------------------------------------------------------------------
export const Sun: React.FC = () => (
  <Chapter
    id="sun"
    n="04"
    kicker="The Sun"
    title="A star with no picture"
    intro="Chapter four: the Sun. Sunglasses on! There's no photo here: every pixel of the Sun is maths, drawn sixty times a second."
    costume="shades"
    mood="happy"
  >
    <div className="prose">
      <p className="lead">There is no image of the Sun in Solaris. It is computed, pixel by pixel, every frame.</p>
      <p>
        A photograph would look flat up close and fixed in time, so the Sun is a <T k="shader">shader</T>: a small program on the graphics card that works out the colour of each pixel from scratch. Its surface is layers of <T k="fbm">fractal noise</T>, warped and stacked to imitate <T k="granulation">granulation</T>, with <T k="limb">limb darkening</T> at the edge and fourteen <T k="prominence">prominences</T> rising from it.
      </p>
      <p>
        It took several attempts. The first version looked like tiled lava: the convection cells were too regular and too contrasted. The prominences first came out as hard boomerangs and stripes. Each fix was a matter of softening, spreading and slowing things down until it looked like the photographs from solar observatories, not like a texture.
      </p>
    </div>
    <Fig
      n={8}
      title="The Sun, layer by layer"
      vela="Hover the layers on the right and I'll tell you what each one does. They all run at once, on your graphics card, while the Sun turns."
      caption={<><b>Six layers, one shader.</b> The clip is the Sun as Solaris renders it, captured frame by frame for the launch film.</>}
    >
      <SunLayers />
    </Fig>
  </Chapter>
);

// ---------------------------------------------------------------------------------------------
const IMAGERY: Array<[string, string, string, string, number]> = [
  ['Earth', 'Sentinel-2 cloudless 2016, 10 m', 'EOX WMTS', '≈ 9.5 m/px', 13],
  ['Moon', 'SELENE/Kaguya Terrain Camera mosaic', 'NASA Moon Trek', '≈ 21 m/px', 14],
  ['Mars', 'MRO CTX global mosaic, tinted', 'Trek → Esri cache', '≈ 10 m/px', 16],
  ['Mercury', 'MESSENGER MDIS BDR mosaic', 'NASA Mercury Trek', '≈ 234 m/px', 15],
  ['Venus', 'Magellan radar (SAR) mosaic', 'USGS Astrogeology WMS', '≈ 290 m/px', 17],
];

export const Ground: React.FC = () => (
  <Chapter
    id="ground"
    n="05"
    kicker="Surface imagery"
    title="Down to the ground"
    intro="Chapter five: zooming into the ground. Keep scrolling in Solaris and a planet turns into a map, then into real spacecraft photos. Ten metres a pixel on Earth."
    mood="excited"
  >
    <div className="prose">
      <p className="lead">Fly close to Earth, the Moon, Mars, Mercury or Venus and the globe turns into real spacecraft imagery, sharper the closer you go.</p>
      <p>
        Below 2.5 planet radii, Solaris starts streaming map tiles from public servers using <T k="wmts">WMTS</T>, the same idea as Google Maps. The globe is cut into a pyramid of tiles, each level four times sharper than the one above. Only tiles near where you are looking are fetched, coarse to fine and nearest first, six at a time, with the choice made by <T k="lod">screen-space error</T>. Until a tile arrives, its blurrier parent stands in, so there are never holes.
      </p>
      <p>
        No server needs a key. Every endpoint was tested from GitHub's servers, posing as the live site: which zoom levels really answer, and whether the server allows other websites to use its images (<T k="cors">CORS</T>). The results are saved in the repository.
      </p>
    </div>
    <Fig
      n={9}
      title="The tile pyramid, streaming"
      vela="Move your cursor over the square: that's where you're looking. Watch me fetch the blurry tiles first, then sharper ones only near your cursor, six at a time. The dashed ones are on their way."
      caption={<><b>A level-of-detail pyramid.</b> Five levels shown (Solaris goes to 13 on Earth). Dashed tiles are in flight; at most six requests run at once, nearest first. Requests the view no longer needs are cancelled.</>}
    >
      <TilePyramid />
    </Fig>
    <Fig n={10} wide={false} title="Imagery sources" vela="Every surface you can zoom into, where it comes from, and how sharp it gets. Venus is radar, because its clouds hide the ground. We say so on screen." caption="The finest level is set by the data: Solaris allows twice over-zoom of the sharpest tiles, and no more.">
      <table className="dtable">
        <thead><tr><th>World</th><th>Imagery</th><th>Served by</th><th>Finest</th></tr></thead>
        <tbody>
          {IMAGERY.map(([w, i, s, f, r]) => (
            <tr key={w}><td>{w}<Cite n={r} /></td><td>{i}</td><td>{s}</td><td className="num">{f}</td></tr>
          ))}
        </tbody>
      </table>
    </Fig>
    <VelaNote>Honest labels matter. Venus says "radar, not visible light". The Moon and Mercury say "monochrome". The giant planets say "cloud tops", because they have no ground at all.</VelaNote>
  </Chapter>
);

// ---------------------------------------------------------------------------------------------
const StandingPoint: React.FC = () => {
  const ref = useRef<SVGSVGElement>(null);
  useGSAP(
    () => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: 'top 75%' } });
      tl.from('.sp-draw', { drawSVG: '0%', duration: 1.2, stagger: 0.25, ease: 'power2.inOut' })
        .from('.sp-pop', { scale: 0, transformOrigin: 'center', transformBox: 'fill-box', stagger: 0.12, duration: 0.6, ease: 'back.out(2)' }, 0.4)
        .from('.sp-text', { opacity: 0, stagger: 0.1, duration: 0.5 }, 1);
    },
    { scope: ref }
  );
  return (
    <svg ref={ref} viewBox="0 0 1180 420" className="media" role="img" aria-label="How the standing point is chosen">
      <circle className="sp-pop" cx="300" cy="230" r="120" fill="#2a2a30" stroke="#8a8a96" />
      <circle className="sp-pop" cx="900" cy="150" r="70" fill="#d8b98a" />
      <circle className="sp-pop" cx="90" cy="60" r="26" fill="#ffd28a" />
      <path className="sp-draw" d="M 300 230 L 380 140" stroke="#6dfcc0" strokeWidth="2" fill="none" />
      <path className="sp-draw" d="M 380 140 L 860 160" stroke="#d8b98a" strokeWidth="1.5" strokeDasharray="5 5" fill="none" />
      <path className="sp-draw" d="M 380 140 L 450 62" stroke="rgba(243,239,233,0.6)" strokeWidth="1.5" fill="none" />
      <path className="sp-draw" d="M 380 140 L 110 70" stroke="#ffd28a" strokeWidth="1.2" strokeDasharray="3 5" fill="none" />
      <path className="sp-draw" d="M 432 82 A 70 70 0 0 1 449 143" stroke="#dcab76" strokeWidth="2" fill="none" />
      <circle className="sp-pop" cx="380" cy="140" r="7" fill="#fff" />
      <g fontFamily="JetBrains Mono" fontSize="13" fill="rgba(243,239,233,0.75)">
        <text className="sp-text" x="250" y="380">THE MOON YOU STAND ON</text>
        <text className="sp-text" x="860" y="250">THE PLANET</text>
        <text className="sp-text" x="60" y="112">SUN</text>
        <text className="sp-text" x="398" y="132" fill="#fff">YOU</text>
        <text className="sp-text" x="456" y="56">ZENITH</text>
        <text className="sp-text" x="470" y="104" fill="#dcab76">~40° ABOVE THE HORIZON</text>
        <text className="sp-text" x="560" y="300" fill="rgba(243,239,233,0.5)">The spot is chosen on the moon's real, IAU-oriented globe so that</text>
        <text className="sp-text" x="560" y="322" fill="rgba(243,239,233,0.5)">the planet hangs about 40° up, on the side the Sun lights,</text>
        <text className="sp-text" x="560" y="344" fill="rgba(243,239,233,0.5)">from the true positions at that moment.</text>
      </g>
    </svg>
  );
};

export const Skies: React.FC = () => (
  <Chapter
    id="skies"
    n="06"
    kicker="Standing on other worlds"
    title="Stand anywhere, and look up"
    intro="Chapter six, my favourite: standing on other worlds. Everything in these skies is where it really is, at that very moment."
    mood="love"
  >
    <div className="prose">
      <p className="lead">Press "Stand here · look up" and you are on the ground, under that world's own sky, at that moment.</p>
      <p>
        The camera becomes a person standing on the surface. Every planet and moon in the sky is placed from the real positions, as seen from that exact spot, at its true angular size and its real brightness in <T k="magnitude">magnitudes</T>, worked out from its reflectivity and phase. Crescents are real crescents, lit from where the Sun really is.
      </p>
      <p>
        Skies with air get a physically based atmosphere: <T k="rayleigh">Rayleigh and Mie scattering</T>, blue by day and red at dusk on Earth, butterscotch by day and blue at sunset on Mars. The first version had a flaw: Earth's twilight went pitch black, because light only bounced once. Adding a <T k="multiscatter">multiple-scattering</T> term made it glow, as real twilight does.
      </p>
      <p>
        One click can also stand you on a moon with its planet in the sky. The spot is computed from the moon's real orientation so that the planet hangs about 40° up, on its sunlit side.
      </p>
    </div>
    <Fig n={11} title="Choosing where to stand" vela="I pick the spot on the moon so the planet hangs about forty degrees up, on its lit side. Then everything else in the sky just falls where it really is." caption={<><b>The "look up from…" rule.</b> Computed from the real positions and each moon's IAU orientation at that moment.</>}>
      <StandingPoint />
    </Fig>
    <Fig
      n={12}
      title="Skies of other worlds · rendered in Solaris"
      vela="Hover these. Mars rising over Phobos. Jupiter from Io, where it never sets. Saturn from Enceladus. And sunset on Saturn's cloud tops, under the rings. Nobody has ever stood in any of these places."
      caption={<><b>Six real skies.</b> Captured from the running site for the launch film. Positions, phases and sizes are true for the date shown in each.</>}
    >
      <div className="media-grid c3">
        <Loop src="sky_phobos_rise" label="Marsrise · Phobos" onHover="Mars from Phobos. It's 6,000 km below your feet and covers 42 degrees of sky." />
        <Loop src="sky_io" label="Jupiter · from Io" onHover="Jupiter from Io. Io always shows Jupiter the same face, so from this spot Jupiter never rises or sets." />
        <Loop src="sky_enceladus" label="Saturn · from Enceladus" onHover="Saturn from Enceladus, with the Helix nebula beside it. The rings are edge-on because Enceladus orbits in their plane." />
        <Loop src="sky_saturn" label="Sunset · Saturn's cloud tops" onHover="Standing on Saturn's cloud tops at sunset, under the rings. The blue band is its atmosphere, lit from below the horizon." />
        <Loop src="mars_dusk" label="Dusk · Meridiani Planum, Mars" onHover="Dusk on Mars: the glow around the setting Sun is blue there. Earth and Venus are drawn poster-size, and the screen says so." />
        <Loop src="miranda_uranus" label="Uranus · from Miranda" onHover="Uranus from Miranda, beside the Milky Way and the clouds of Carina." />
      </div>
    </Fig>
  </Chapter>
);

// ---------------------------------------------------------------------------------------------
export const Nebulae: React.FC = () => (
  <Chapter
    id="nebulae"
    n="07"
    kicker="Nebulae"
    title="Flying into a photograph"
    intro="Chapter seven: nebulae. Three of them are real photographs from Webb, Hubble and VISTA. The trick was turning a flat picture into something you can fly around."
    mood="excited"
  >
    <div className="prose">
      <p className="lead">Three of the nine nebulae in Solaris are real telescope images. You can fly out to them and around them.</p>
      <p>
        The Cosmic Cliffs from Webb<Cite n={25} />, Mystic Mountain from Hubble<Cite n={26} /> and the Helix from ESO's VISTA<Cite n={27} /> hang on the sky in their real directions, enlarged. The other six are procedural figures placed near nebulae of their kind. A script removes each photo's star background, softens its edges and stores it with <T k="premultiplied">premultiplied alpha</T> so it blends cleanly into the Milky Way.
      </p>
      <p>
        Pick one and you leave the Solar System for it. Up close it is not a flat picture: it is split into seven brightness bands, each placed at its own depth and moving its own way. Some evaporate, some fire jets, the Helix expands. Swing the camera and the layers slide past each other.
      </p>
    </div>
    <Fig
      n={13}
      title="Seven brightness bands · the Cosmic Cliffs"
      vela="Scroll, and watch the photo come apart into its seven layers, faint haze at the back, hot cores at the front. Then it folds back into the picture. Hover a layer and I'll tell you which one it is."
      caption={<><b>One photograph, seven depths.</b> The Webb image split into brightness bands (computed for this figure the way the 3D stage separates them). Scroll to separate and rejoin them.</>}
    >
      <NebulaLayers />
    </Fig>
    <Fig n={14} title="Nebulae, live in Solaris" vela="And here they are in the real thing. The Cosmic Cliffs, and the Helix, a dying star shedding its shell." caption="Captured from the running site.">
      <div className="media-grid c2">
        <Loop src="nebula" label="Cosmic Cliffs · NGC 3324 · Webb" />
        <Loop src="nebula2" label="The Helix · NGC 7293 · VISTA" />
      </div>
    </Fig>
    <VelaNote>One bug I still giggle about: the first time we flew to a nebula, it came out mirrored and upside down. The fix was one line of maths: which way is "right" when you're facing a picture in the sky.</VelaNote>
  </Chapter>
);

// ---------------------------------------------------------------------------------------------
export const BlackHole: React.FC = () => (
  <Chapter
    id="blackhole"
    n="08"
    kicker="Sagittarius A*"
    title="The heart of the galaxy"
    intro="Chapter eight. The black hole. I, um, don't love this one. Let's be brave together."
    mood="scared"
  >
    <div className="prose">
      <p className="lead">Zoom out past the stars and the galaxy, and you can fall towards Sagittarius A*, the black hole at its centre.</p>
      <p>
        Its numbers are real. It sits 8.277 kiloparsecs away, about 27,000 light-years, and weighs 4.3 million Suns, both from the GRAVITY collaboration<Cite n={18} />, who weighed it by timing stars racing around it. Its shadow, 51.8 microarcseconds across, comes from the <T k="eht">Event Horizon Telescope</T><Cite n={20} />.
      </p>
      <p>
        Its picture is an honest approximation. The bright disc that arches over the top and under the bottom is light bent around the hole along <T k="geodesic">null geodesics</T>, but Solaris ray-marches an approximate bending, not a full relativistic ray-tracer. And the ocean world at its shore, in the launch film, is imagined. The way the light bends over it is not.
      </p>
    </div>
    <Fig n={15} title="Sgr A*, in Solaris" vela="The disc bends up over the top because its light travels around the hole to reach you. I still don't want to go any closer." caption="Captured from the running site. The sea is imagined; the bending is approximated.">
      <div className="media-grid c2">
        <Loop src="sgra" label="Sagittarius A* · approaching" />
        <Loop src="bh_sea" label="The shore of Sagittarius A* · imagined" />
      </div>
    </Fig>
  </Chapter>
);
