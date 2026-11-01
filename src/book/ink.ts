/**
 * The press. Solaris's own footage and planet maps, printed live in two inks.
 *
 * One WebGL context does all the work: for each registered panel it draws a halftone of the current
 * video frame (or of a globe spun from a real surface map) and copies the result onto that panel's
 * 2D canvas. Panels update twelve times a second, "on twos", which is how limited animation moves.
 * The paper shows through, so every panel sits in the page like printed ink.
 */

export type InkSource =
  | { kind: 'video'; name: string; start?: number }
  | { kind: 'image'; url: string }
  | { kind: 'globe'; map: string; spin?: number; tilt?: number; ring?: boolean };

export type Spot = 'orange' | 'green' | 'none';

const base = import.meta.env.BASE_URL;
const SPOT: Record<Spot, [number, number, number]> = { orange: [0.886, 0.31, 0.122], green: [0.145, 0.561, 0.337], none: [0, 0, 0] };

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0., 1.); }`;
const FRAG = `
precision highp float;
uniform sampler2D tex;
uniform vec2 res;
uniform float texAspect, mode, cell, gain, spin, tilt, ring, spotOn, offsetX, neg;
uniform vec3 spot;
const vec3 INK = vec3(0.082, 0.071, 0.055);
const float PI = 3.14159265;

mat2 rot(float a){ float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }

// a dot that grows with coverage v; past about 0.8 the dots merge into solid ink
float dots(vec2 p, float angle, float size, float v){
  vec2 q = rot(angle) * p / size;
  float d = length(fract(q) - 0.5);
  float r = sqrt(clamp(v, 0., 1.)) * 0.76;
  return 1. - smoothstep(r - 0.09, r + 0.09, d);
}

// what the plate sees at a pixel: rgb and whether anything is there
vec4 sampleSource(vec2 frag){
  vec2 uv;
  if (mode < 0.5) {
    // cover the panel
    float a = res.x / res.y;
    uv = vec2(frag.x / res.x, 1. - frag.y / res.y);
    if (a > texAspect) uv.y = 0.5 + (uv.y - 0.5) * texAspect / a;
    else uv.x = 0.5 + (uv.x - 0.5) * a / texAspect;
    uv.x += offsetX;
    return vec4(texture2D(tex, uv).rgb, 1.);
  }
  // a sphere, lit from the upper left
  float R = min(res.x, res.y) * (ring > 0.5 ? 0.33 : 0.48);
  vec2 n = (frag - res * 0.5) / R;
  float r2 = dot(n, n);
  if (r2 >= 1.) return vec4(0.);
  vec3 N = vec3(n, sqrt(1. - r2));
  vec3 L = normalize(vec3(-0.55, 0.45, 0.72));
  float light = clamp(dot(N, L) * 1.25, 0., 1.);
  vec3 P = N;
  P.xy = rot(tilt) * P.xy;
  float lon = atan(P.x, P.z) + spin;
  float lat = asin(clamp(P.y, -1., 1.));
  vec3 c = texture2D(tex, vec2(fract(lon / (2. * PI) + 0.5), 0.5 - lat / PI)).rgb;
  return vec4(c * (0.12 + light), 1.);
}

void main(){
  vec2 p = gl_FragCoord.xy;
  vec4 s = sampleSource(p);
  // Saturn's ring, as a tilted band of dots
  float rg = 0.;
  if (ring > 0.5) {
    float R = min(res.x, res.y) * 0.33;
    vec2 n = (p - res * 0.5) / R;
    n = rot(0.32) * n;
    vec2 e = n * vec2(1., 3.6);
    float d = length(e);
    float front = step(n.y, 0.);
    rg = smoothstep(1.26, 1.3, d) * (1. - smoothstep(2.2, 2.26, d)) * (1. - 0.45 * smoothstep(1.6, 1.64, d) * (1. - smoothstep(1.76, 1.8, d)));
    if (s.a > 0.5 && front < 0.5) rg = 0.;
  }
  if (s.a < 0.5 && rg <= 0.) { gl_FragColor = vec4(0.); return; }
  if (neg > 0.5) s.rgb = 1. - clamp(s.rgb * gain, 0., 1.);
  float lum = dot(s.rgb, vec3(0.3, 0.59, 0.11));
  float dark = s.a < 0.5 ? 0. : 1. - pow(clamp(neg > 0.5 ? lum : lum * gain, 0., 1.), 0.62);
  float sat = max(s.r, max(s.g, s.b)) - min(s.r, min(s.g, s.b));
  float spotV = spotOn * smoothstep(0.03, 0.42, sat) * (0.4 + 0.6 * lum) * s.a;
  // the second plate sits a hair out of register, as it would on a real press
  float inkA = dots(p, 0.785, cell, dark);
  float spotA = dots(p + vec2(1.6, -1.1), 0.262, cell * 0.92, spotV);
  if (rg > 0.) { inkA = max(inkA, dots(p, 0.785, cell * 0.8, rg * 0.55)); s.a = 1.; }
  vec3 col = mix(spot, INK, inkA);
  float a = max(inkA, spotA);
  gl_FragColor = vec4(col * a, a);
}`;

interface Job {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  src: InkSource;
  spot: Spot;
  cell: number;
  gain: number;
  neg: boolean;
  live: boolean;
  dirty: boolean;
  spin: number;
  texture: WebGLTexture | null;
  video?: HTMLVideoElement;
  image?: HTMLImageElement;
  ready: boolean;
  aspect: number;
}

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

class Press {
  private gl: WebGLRenderingContext | null = null;
  private canvas = document.createElement('canvas');
  private jobs = new Set<Job>();
  private u: Record<string, WebGLUniformLocation | null> = {};
  private textures = new Map<string, { tex: WebGLTexture; aspect: number; ready: boolean; waiting: Job[] }>();
  private last = 0;
  private running = false;
  ok = true;

  private init() {
    if (this.gl || !this.ok) return;
    const gl = this.canvas.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: false });
    if (!gl) { this.ok = false; return; }
    const sh = (t: number, s: string) => {
      const o = gl.createShader(t)!;
      gl.shaderSource(o, s);
      gl.compileShader(o);
      if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(o));
      return o;
    };
    const pr = gl.createProgram()!;
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(pr);
    gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    for (const n of ['tex', 'res', 'texAspect', 'mode', 'cell', 'gain', 'spin', 'tilt', 'ring', 'spotOn', 'spot', 'offsetX', 'neg']) this.u[n] = gl.getUniformLocation(pr, n);
    gl.clearColor(0, 0, 0, 0);
    this.gl = gl;
    this.canvas.width = 1400;
    this.canvas.height = 1400;
  }

  private newTexture(): WebGLTexture {
    const gl = this.gl!;
    const t = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    return t;
  }

  /** Stills and maps are shared between panels. */
  private still(url: string, job: Job) {
    let rec = this.textures.get(url);
    if (!rec) {
      rec = { tex: this.newTexture(), aspect: 2, ready: false, waiting: [] };
      this.textures.set(url, rec);
      const r = rec;
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const gl = this.gl!;
        gl.bindTexture(gl.TEXTURE_2D, r.tex);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        r.aspect = img.width / img.height;
        r.ready = true;
        for (const j of r.waiting) { j.ready = true; j.aspect = r.aspect; j.dirty = true; }
        r.waiting = [];
        this.kick();
      };
      img.src = url;
    }
    job.texture = rec.tex;
    if (rec.ready) { job.ready = true; job.aspect = rec.aspect; } else rec.waiting.push(job);
  }

  add(canvas: HTMLCanvasElement, src: InkSource, spot: Spot, cell: number, gain: number, neg = false): Job | null {
    this.init();
    if (!this.gl) return null;
    const job: Job = { ctx: canvas.getContext('2d')!, canvas, src, spot, cell, gain, neg, live: false, dirty: true, spin: Math.random() * 6, texture: null, ready: false, aspect: 16 / 9 };
    if (src.kind === 'video') {
      const v = document.createElement('video');
      v.src = `${base}report/media/${src.name}.mp4`;
      v.muted = true;
      v.loop = true;
      v.playsInline = true;
      v.preload = 'auto';
      v.crossOrigin = 'anonymous';
      if (src.start) v.currentTime = src.start;
      v.addEventListener('loadeddata', () => { job.ready = true; job.aspect = v.videoWidth / v.videoHeight; job.dirty = true; this.kick(); });
      job.video = v;
      job.texture = this.newTexture();
    } else if (src.kind === 'image') this.still(src.url, job);
    else this.still(`${base}textures/${src.map}`, job);
    this.jobs.add(job);
    this.kick();
    return job;
  }

  remove(job: Job) {
    this.jobs.delete(job);
    if (job.video) {
      job.video.pause();
      job.video.removeAttribute('src');
      job.video.load();
      if (job.texture) this.gl?.deleteTexture(job.texture);
    }
  }

  setLive(job: Job, live: boolean) {
    job.live = live;
    if (job.video) {
      if (live && !reduced) job.video.play().catch(() => {});
      else job.video.pause();
    }
    job.dirty = true;
    this.kick();
  }

  resize(job: Job) {
    job.dirty = true;
    this.kick();
  }

  private draw(job: Job) {
    const gl = this.gl!;
    const c = job.canvas;
    const w = Math.min(1400, c.width);
    const h = Math.min(1400, c.height);
    if (!w || !h || !job.texture) return;
    gl.viewport(0, 0, w, h);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, job.texture);
    if (job.video) {
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, job.video);
    }
    const g = job.src.kind === 'globe' ? job.src : null;
    const s = SPOT[job.spot];
    gl.uniform1i(this.u.tex, 0);
    gl.uniform2f(this.u.res, w, h);
    gl.uniform1f(this.u.texAspect, job.aspect);
    gl.uniform1f(this.u.mode, g ? 1 : 0);
    // the screen's cell size follows the panel's real size on screen
    gl.uniform1f(this.u.cell, job.cell * (c.width / Math.max(1, c.clientWidth)));
    gl.uniform1f(this.u.gain, job.gain);
    gl.uniform1f(this.u.spin, job.spin);
    gl.uniform1f(this.u.tilt, g?.tilt ?? 0);
    gl.uniform1f(this.u.ring, g?.ring ? 1 : 0);
    gl.uniform1f(this.u.spotOn, job.spot === 'none' ? 0 : 1);
    gl.uniform3f(this.u.spot, s[0], s[1], s[2]);
    gl.uniform1f(this.u.offsetX, 0);
    gl.uniform1f(this.u.neg, job.neg ? 1 : 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    job.ctx.clearRect(0, 0, c.width, c.height);
    job.ctx.drawImage(this.canvas, 0, this.canvas.height - h, w, h, 0, 0, c.width, c.height);
  }

  private kick() {
    if (this.running) return;
    this.running = true;
    requestAnimationFrame(this.tick);
  }

  private tick = (t: number) => {
    requestAnimationFrame(this.tick);
    if (t - this.last < 1000 / 12) return;
    const dt = Math.min(0.2, (t - this.last) / 1000);
    this.last = t;
    for (const j of this.jobs) {
      if (!j.ready) continue;
      const moving = j.live && !reduced;
      if (j.src.kind === 'globe' && moving) j.spin += dt * (j.src.spin ?? 0.35);
      if (moving && j.src.kind !== 'image') j.dirty = true;
      if (j.dirty) { this.draw(j); j.dirty = false; }
    }
  };
}

export const press = new Press();
export type PressJob = NonNullable<ReturnType<Press['add']>>;
