/**
 * The press. Solaris's own footage and planet maps, printed live.
 *
 * One WebGL context does all the work: for each registered panel it draws the current video frame
 * (or a globe spun from a real surface map) through one of eight print techniques, and copies the
 * result onto that panel's 2D canvas. Panels update twelve times a second, "on twos", which is how
 * limited animation moves. The paper shows through wherever the picture is bright.
 *
 * The looks: screentone sheets, a press halftone, banknote engraving, pen cross-hatching, rings and
 * rays of line that radiate from the subject, woodblock, and hand stipple. A slow camera drifts
 * over each panel, and a double-page spread can share one frame across the gutter.
 */

export type Look = 'tone' | 'dots' | 'engrave' | 'hatch' | 'rings' | 'rays' | 'wood' | 'stipple';
const LOOKS: Record<Look, number> = { tone: 0, dots: 1, engrave: 2, hatch: 3, rings: 4, rays: 5, wood: 6, stipple: 7 };

export type InkSource =
  | { kind: 'video'; name: string }
  | { kind: 'image'; url: string }
  | { kind: 'globe'; map: string; spin?: number; tilt?: number; ring?: boolean | 'front'; phase?: number };

export type Spot = 'orange' | 'green' | 'both' | 'none';

export interface Print {
  look?: Look;
  spot?: Spot;
  /** Screen size in page pixels. */
  cell?: number;
  gain?: number;
  /** Ink outlines round the shapes in the picture. */
  edge?: number;
  /** Where in the frame the camera looks (0–1), and how close. */
  x?: number;
  y?: number;
  zoom?: number;
  /** How far the slow camera moves. */
  drift?: number;
  /** For a double-page spread: which part of the frame's width this panel shows. */
  crop?: [number, number];
  /** Where rings and rays radiate from, in the panel (0–1). */
  fx?: number;
  fy?: number;
  neg?: boolean;
}

const base = import.meta.env.BASE_URL;
const ORANGE = [0.886, 0.31, 0.122];
const GREEN = [0.145, 0.561, 0.337];

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0., 1.); }`;
const FRAG = `
precision highp float;
uniform sampler2D tex;
uniform vec2 res, focus, crop;
uniform vec3 view, warm, cool;
uniform float texAspect, mode, cell, gain, spin, tilt, ring, ringFront, spotOn, neg, look, edge, px;
const vec3 INK = vec3(0.082, 0.071, 0.055);
const float PI = 3.14159265;

mat2 rot(float a){ float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3. - 2. * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
}

float dots(vec2 p, float angle, float size, float v){
  vec2 q = rot(angle) * p / size;
  float d = length(fract(q) - 0.5);
  float r = sqrt(clamp(v, 0., 1.)) * 0.76;
  return 1. - smoothstep(r - 0.1, r + 0.1, d);
}
// a line screen: f runs 0–1 across each line, and the line is as wide as the darkness asks
float line(float f, float v){
  float d = abs(fract(f) - 0.5) * 2.;
  return 1. - smoothstep(v - 0.14, v + 0.14, d);
}

vec4 source(vec2 frag){
  if (mode < 0.5) {
    float a = res.x / res.y * (1. / crop.y);
    vec2 uv = vec2(crop.x + frag.x / res.x * crop.y, 1. - frag.y / res.y);
    if (a > texAspect) uv.y = 0.5 + (uv.y - 0.5) * texAspect / a;
    else uv.x = 0.5 + (uv.x - 0.5) * a / texAspect;
    uv = view.xy + (uv - 0.5) / view.z;
    return vec4(texture2D(tex, uv).rgb, 1.);
  }
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

float lum(vec3 c){ return dot(c, vec3(0.3, 0.59, 0.11)); }

void main(){
  vec2 p = gl_FragCoord.xy;
  vec4 s = source(p);
  float rg = 0.;
  if (ring > 0.5) {
    float R = min(res.x, res.y) * 0.33;
    vec2 n = rot(0.32) * ((p - res * 0.5) / R);
    float d = length(n * vec2(1., 3.6));
    rg = smoothstep(1.26, 1.3, d) * (1. - smoothstep(2.2, 2.26, d)) * (1. - 0.45 * smoothstep(1.6, 1.64, d) * (1. - smoothstep(1.76, 1.8, d)));
    if (s.a > 0.5 && n.y > 0.) rg = 0.;
    if (ringFront > 0.5 && n.y > 0.) rg = 0.;
  }
  if (s.a < 0.5 && rg <= 0.) { gl_FragColor = vec4(0.); return; }
  if (neg > 0.5) s.rgb = 1. - clamp(s.rgb * gain, 0., 1.);
  float L = clamp(lum(s.rgb) * (neg > 0.5 ? 1. : gain), 0., 1.);
  float d = s.a < 0.5 ? 0. : 1. - L;
  float a = 0.;
  vec2 c = focus * res;
  float cs = cell;
  if (look < 0.5) {
    // screentone: four flat sheets of tone, the way a manga artist lays them
    a = step(0.8, d);
    if (d <= 0.8) a = dots(p, 0.785, cs, d > 0.58 ? 0.56 : d > 0.36 ? 0.26 : d > 0.16 ? 0.07 : 0.);
    if (d <= 0.16) a = 0.;
  } else if (look < 1.5) {
    a = dots(p, 0.785, cs, d);
  } else if (look < 2.5) {
    // engraving: lines that swell with the shadow and bend with the form, as on a banknote
    float w = p.y / cs + L * 1.6 + sin(p.x * 0.018) * 0.7;
    a = line(w, d);
  } else if (look < 3.5) {
    a = line((p.x + p.y) / cs / 1.4, step(0.2, d) * 0.5);
    if (d > 0.46) a = max(a, line((p.x - p.y) / cs / 1.4, 0.5));
    if (d > 0.68) a = max(a, line(p.y / cs / 0.9, 0.56));
    if (d > 0.88) a = 1.;
  } else if (look < 4.5) {
    a = line(length(p - c) / cs, d);
  } else if (look < 5.5) {
    vec2 v = p - c;
    float n = floor(min(res.x, res.y) / cs * 2.4);
    a = line(atan(v.y, v.x) / (2. * PI) * n, d * 0.98);
    a *= smoothstep(0., cs * 2.5, length(v));
  } else if (look < 6.5) {
    // woodblock: flat shapes with a slightly torn edge
    float n = noise(p / (cs * 1.6)) * 0.1;
    a = step(0.66 + n, d);
  } else {
    float h = hash(floor(p / max(1.4, cs * 0.34)));
    a = step(h, d * d * 1.05);
  }
  if (edge > 0.) {
    vec2 e = vec2(max(1.2, cs * 0.3), 0.);
    float gx = lum(source(p + e.xy).rgb) - lum(source(p - e.xy).rgb);
    float gy = lum(source(p + e.yx).rgb) - lum(source(p - e.yx).rgb);
    a = max(a, smoothstep(0.1, 0.26, length(vec2(gx, gy)) * gain) * edge);
  }
  // colour: warm light takes the vermilion plate, cool light the green
  float sat = max(s.r, max(s.g, s.b)) - min(s.r, min(s.g, s.b));
  float wc = s.r - s.b;
  vec3 ink2 = wc >= -0.02 ? warm : cool;
  float spotV = spotOn * smoothstep(0.05, 0.4, sat) * (0.45 + 0.55 * L) * s.a;
  float spotA = look > 5.5 && look < 6.5 ? step(0.34 + noise(p / (cs * 1.2)) * 0.1, spotV) : dots(p + vec2(1.6, -1.1) * px, 0.262, cs * 0.92, spotV);
  if (rg > 0.) { a = max(a, dots(p, 0.785, cs * 0.8, rg * 0.55)); }
  vec3 col = mix(ink2, INK, a);
  float alpha = max(a, spotA);
  gl_FragColor = vec4(col * alpha, alpha);
}`;

interface Video { el: HTMLVideoElement; tex: WebGLTexture; aspect: number; ready: boolean; refs: number; live: number; stamp: number }

interface Job {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  src: InkSource;
  print: Required<Omit<Print, 'crop' | 'neg'>> & { crop: [number, number]; neg: boolean };
  live: boolean;
  dirty: boolean;
  spin: number;
  t: number;
  texture: WebGLTexture | null;
  video?: Video;
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
  private videos = new Map<string, Video>();
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
    for (const n of ['tex', 'res', 'focus', 'crop', 'view', 'warm', 'cool', 'texAspect', 'mode', 'cell', 'gain', 'spin', 'tilt', 'ring', 'ringFront', 'spotOn', 'neg', 'look', 'edge', 'px']) this.u[n] = gl.getUniformLocation(pr, n);
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

  /** Both halves of a double-page spread share one video, so the gutter never tears. */
  private video(name: string, job: Job) {
    let v = this.videos.get(name);
    if (!v) {
      const el = document.createElement('video');
      el.src = `${base}book/clips/${name}.mp4`;
      el.muted = true;
      el.loop = true;
      el.playsInline = true;
      el.preload = 'auto';
      el.crossOrigin = 'anonymous';
      const rec: Video = { el, tex: this.newTexture(), aspect: 16 / 9, ready: false, refs: 0, live: 0, stamp: -1 };
      el.addEventListener('loadeddata', () => {
        rec.ready = true;
        rec.aspect = el.videoWidth / el.videoHeight;
        for (const j of this.jobs) if (j.video === rec) { j.ready = true; j.aspect = rec.aspect; j.dirty = true; }
        this.kick();
      });
      this.videos.set(name, rec);
      v = rec;
    }
    v.refs++;
    job.video = v;
    job.texture = v.tex;
    if (v.ready) { job.ready = true; job.aspect = v.aspect; }
  }

  add(canvas: HTMLCanvasElement, src: InkSource, print: Print): Job | null {
    this.init();
    if (!this.gl) return null;
    const job: Job = {
      ctx: canvas.getContext('2d')!,
      canvas,
      src,
      print: { look: 'tone', spot: 'both', cell: 5, gain: 1.05, edge: 0, x: 0.5, y: 0.5, zoom: 1, drift: 0.05, fx: 0.5, fy: 0.5, ...print, crop: print.crop ?? [0, 1], neg: !!print.neg },
      live: false,
      dirty: true,
      spin: src.kind === 'globe' && src.phase !== undefined ? src.phase : Math.random() * 6,
      t: Math.random() * 20,
      texture: null,
      ready: false,
      aspect: 16 / 9,
    };
    this.jobs.add(job);
    if (src.kind === 'video') this.video(src.name, job);
    else if (src.kind === 'image') this.still(src.url, job);
    else this.still(`${base}textures/${src.map}`, job);
    this.kick();
    return job;
  }

  remove(job: Job) {
    this.jobs.delete(job);
    const v = job.video;
    if (v) {
      if (job.live) v.live--;
      v.refs--;
      if (v.live <= 0) v.el.pause();
      if (v.refs <= 0) {
        v.el.removeAttribute('src');
        v.el.load();
        this.gl?.deleteTexture(v.tex);
        for (const [k, x] of this.videos) if (x === v) this.videos.delete(k);
      }
    }
  }

  setLive(job: Job, live: boolean) {
    if (job.live === live) return;
    job.live = live;
    const v = job.video;
    if (v) {
      v.live += live ? 1 : -1;
      if (v.live > 0 && !reduced) v.el.play().catch(() => {});
      else v.el.pause();
    }
    job.dirty = true;
    this.kick();
  }

  resize(job: Job) {
    job.dirty = true;
    this.kick();
  }

  private draw(job: Job, now: number) {
    const gl = this.gl!;
    const c = job.canvas;
    const w = Math.min(1400, c.width);
    const h = Math.min(1400, c.height);
    if (!w || !h || !job.texture) return;
    const p = job.print;
    gl.viewport(0, 0, w, h);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, job.texture);
    const v = job.video;
    if (v && v.stamp !== now) {
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, v.el);
      v.stamp = now;
    }
    const g = job.src.kind === 'globe' ? job.src : null;
    const k = c.width / Math.max(1, c.clientWidth);
    // the slow camera: a breath in and out, and a little sideways
    const zoom = p.zoom * (1 + p.drift * (0.5 + 0.5 * Math.sin(job.t * 0.35)));
    const dx = (p.drift * 0.25 * Math.sin(job.t * 0.21)) / p.zoom;
    gl.uniform1i(this.u.tex, 0);
    gl.uniform2f(this.u.res, w, h);
    gl.uniform2f(this.u.focus, p.fx, 1 - p.fy);
    gl.uniform2f(this.u.crop, p.crop[0], p.crop[1]);
    gl.uniform3f(this.u.view, p.x + dx, p.y, zoom);
    const warm = p.spot === 'green' ? GREEN : ORANGE;
    const cool = p.spot === 'orange' ? ORANGE : GREEN;
    gl.uniform3f(this.u.warm, warm[0], warm[1], warm[2]);
    gl.uniform3f(this.u.cool, cool[0], cool[1], cool[2]);
    gl.uniform1f(this.u.texAspect, job.aspect);
    gl.uniform1f(this.u.mode, g ? 1 : 0);
    gl.uniform1f(this.u.cell, p.cell * k);
    gl.uniform1f(this.u.px, k);
    gl.uniform1f(this.u.gain, p.gain);
    gl.uniform1f(this.u.spin, job.spin);
    gl.uniform1f(this.u.tilt, g?.tilt ?? 0);
    gl.uniform1f(this.u.ring, g?.ring ? 1 : 0);
    gl.uniform1f(this.u.ringFront, g?.ring === 'front' ? 1 : 0);
    gl.uniform1f(this.u.spotOn, p.spot === 'none' ? 0 : 1);
    gl.uniform1f(this.u.neg, p.neg ? 1 : 0);
    gl.uniform1f(this.u.look, LOOKS[p.look]);
    gl.uniform1f(this.u.edge, p.edge);
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
      if (moving) {
        j.t += dt;
        if (j.src.kind === 'globe') j.spin += dt * (j.src.spin ?? 0.35);
        j.dirty = true;
      }
      if (j.dirty) { this.draw(j, t); j.dirty = false; }
    }
  };
}

export const press = new Press();
export type PressJob = NonNullable<ReturnType<Press['add']>>;
