import { sampleRGBA, gridSize, shuffle } from './particle-sampling.js';
import { pointerFactor, relaxOffset, particleProgress, followTarget } from './particle-motion.js';

export const defaults = Object.freeze({
  gap: 3, size: 1.8, maxParticles: 12000, color: '#add8e6', shape: 'circle',
  gamma: 1.8, threshold: 0.08, mode: 'brightness', jitter: 0.3,
  transition: 'relax', duration: 1100, scatter: 0, padding: 0.1, pixelRatio: 2,
  pointerMode: 'inverse', pointerScope: 'window', pointerRadius: 100, pointerStrength: 28,
  pointerScale: 'image', pointerReferenceSize: 400,
  returnTime: Object.freeze([330, 500]), drift: 0, driftPeriod: 1600,
  autoPause: true, respectReducedMotion: true, cacheSize: 8, loadTimeout: 15000,
});

function optionsFor(input) {
  const o = { ...defaults, ...input };
  for (const key of Object.keys(input)) if (!(key in defaults)) throw new TypeError(`Unknown option: ${key}`);
  for (const key of ['gap', 'size', 'maxParticles', 'gamma', 'duration', 'pixelRatio', 'cacheSize', 'loadTimeout', 'driftPeriod', 'pointerReferenceSize']) {
    if (!Number.isFinite(o[key]) || o[key] <= 0) throw new RangeError(`${key} must be positive`);
  }
  for (const key of ['threshold', 'jitter', 'scatter', 'pointerRadius', 'pointerStrength', 'drift', 'padding']) {
    if (!Number.isFinite(o[key]) || o[key] < 0) throw new RangeError(`${key} must be non-negative`);
  }
  if (o.padding >= 0.5 || o.threshold > 1 || o.jitter > 1) throw new RangeError('padding < 0.5; threshold/jitter <= 1');
  if (!Number.isInteger(o.maxParticles) || o.maxParticles > 100000) throw new RangeError('maxParticles must be an integer from 1 to 100000');
  if (!Number.isInteger(o.cacheSize)) throw new RangeError('cacheSize must be an integer');
  if (!['inverse', 'local'].includes(o.pointerMode)) throw new TypeError('Invalid pointerMode');
  if (!['window', 'container'].includes(o.pointerScope)) throw new TypeError('Invalid pointerScope');
  if (!['image', 'pixels'].includes(o.pointerScale)) throw new TypeError('Invalid pointerScale');
  if (!['circle', 'square'].includes(o.shape)) throw new TypeError('Invalid shape');
  if (!['relax', 'timed'].includes(o.transition)) throw new TypeError('Invalid transition');
  if (!Array.isArray(o.returnTime) || o.returnTime.length !== 2 ||
      !o.returnTime.every(v => Number.isFinite(v) && v > 0) || o.returnTime[0] > o.returnTime[1]) {
    throw new RangeError('returnTime must be [min, max] in positive milliseconds, min <= max');
  }
  o.returnTime = Object.freeze([...o.returnTime]);
  if (!['brightness', 'dark', 'alpha'].includes(o.mode)) throw new TypeError('Invalid mode');
  for (const key of ['autoPause', 'respectReducedMotion']) if (typeof o[key] !== 'boolean') throw new TypeError(`${key} must be boolean`);
  if (typeof o.color !== 'string' || !CSS.supports('color', o.color)) throw new TypeError('Invalid color');
  return Object.freeze(o);
}

/** Browser-only, isolated Canvas 2D particle renderer. Import itself is SSR-safe. */
export class ParticleMorph {
  constructor(container, options = {}) {
    if (typeof document === 'undefined') throw new Error('Create ParticleMorph after the component mounts in a browser');
    this.host = typeof container === 'string' ? document.querySelector(container) : container;
    if (!(this.host instanceof HTMLElement)) throw new TypeError('container must be an HTMLElement or a matching selector');
    this.options = optionsFor(options);
    this.canvas = document.createElement('canvas');
    this.canvas.style.cssText = 'display:block;width:100%;height:100%;';
    this.canvas.setAttribute('aria-hidden', 'true');
    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) throw new Error('Canvas 2D is unavailable');
    this.host.append(this.canvas);
    this._data = {};
    for (const key of ['x', 'y', 'sx', 'sy', 'tx', 'ty', 'a', 'sa', 'ta', 'arcX', 'arcY', 'ox', 'oy', 'returnTime', 'phase']) {
      this._data[key] = new Float32Array(this.options.maxParticles);
    }
    this._count = this._targetCount = this._request = 0;
    this._width = this._height = 1;
    this._elapsed = this._time = 0;
    this._last = null;
    this._raf = null;
    this._paused = this._destroyed = this._hidden = false;
    this._visible = true;
    this._cache = new Map();
    this._pending = new Map();
    this._cancels = new Set();
    this._pointer = null;
    this._pointerClient = null;
    this._interactionScale = 1;
    this._events = new AbortController();
    const signal = this._events.signal;
    this._media = matchMedia('(prefers-reduced-motion: reduce)');
    this._motionChange = () => {
      if (this._reduced()) { this._finish(); this._draw(0); }
      this._wake();
    };
    this._media.addEventListener('change', this._motionChange);
    const pointerTarget = this.options.pointerScope === 'window' ? window : this.canvas;
    pointerTarget.addEventListener('pointermove', e => {
      this._pointerClient = { x: e.clientX, y: e.clientY };
      this._updatePointer();
      this._wake();
    }, { signal, passive: true });
    const leave = () => { this._pointer = this._pointerClient = null; this._wake(); };
    (this.options.pointerScope === 'window' ? document.documentElement : this.canvas).addEventListener('pointerleave', leave, { signal });
    pointerTarget.addEventListener('pointercancel', leave, { signal });
    pointerTarget.addEventListener('pointerup', e => { if (e.pointerType !== 'mouse') leave(); }, { signal });
    window.addEventListener('blur', leave, { signal });
    window.addEventListener('scroll', () => { this._updatePointer(); this._wake(); }, { signal, capture: true, passive: true });
    document.addEventListener('visibilitychange', () => {
      this._hidden = document.hidden;
      if (this._hidden) this._pointer = this._pointerClient = null;
      this._sync();
    }, { signal });
    this._hidden = document.hidden;
    this._resizeObserver = new ResizeObserver(() => this._resize());
    this._resizeObserver.observe(this.host);
    if (this.options.autoPause && typeof IntersectionObserver !== 'undefined') {
      this._intersection = new IntersectionObserver(entries => {
        this._visible = entries[0].isIntersecting;
        this._sync();
      });
      this._intersection.observe(this.host);
    }
    this._tick = now => {
      this._raf = null;
      if (!this._canRun()) return;
      const dt = this._last === null ? 0 : Math.min(50, Math.max(0, now - this._last));
      this._last = now;
      this._elapsed += dt;
      this._time += dt;
      this._draw(dt);
      if (this._morphActive || (!this._reduced() && (this.options.drift > 0 || this._pointer || this._offsetActive))) this._wake();
      else this._last = null;
    };
    this._sprite = this._createSprite();
    this._resize();
  }

  _createSprite() {
    if (this.options.shape === 'square') return null;
    const sprite = document.createElement('canvas');
    sprite.width = sprite.height = 32;
    const ctx = sprite.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D is unavailable');
    ctx.fillStyle = this.options.color; ctx.fillRect(0, 0, 32, 32);
    ctx.globalCompositeOperation = 'destination-in';
    const mask = ctx.createRadialGradient(16, 16, 9, 16, 16, 16);
    mask.addColorStop(0, '#fff'); mask.addColorStop(1, '#fff0');
    ctx.fillStyle = mask; ctx.fillRect(0, 0, 32, 32);
    return sprite;
  }

  _assert() { if (this._destroyed) throw new Error('ParticleMorph has been destroyed'); }
  _updatePointer() {
    const p = this._pointerClient;
    if (!p) { this._pointer = null; return; }
    const rect = this.canvas.getBoundingClientRect();
    if (this.options.pointerScope === 'container' &&
        (p.x < rect.left || p.x > rect.right || p.y < rect.top || p.y > rect.bottom)) {
      this._pointer = null; return;
    }
    this._pointer = { x: (p.x - rect.left) * this._width / (rect.width || 1),
      y: (p.y - rect.top) * this._height / (rect.height || 1) };
  }
  _reduced() { return this.options.respectReducedMotion && this._media.matches; }
  _canRun() { return !this._destroyed && !this._paused && !this._hidden && this._visible && this._hasSize; }
  _wake() { if (this._canRun() && this._raf === null && this._count) this._raf = requestAnimationFrame(this._tick); }
  _sync() {
    if (!this._canRun()) {
      if (this._raf !== null) cancelAnimationFrame(this._raf);
      this._raf = this._last = null;
    } else this._wake();
  }

  _resize() {
    if (this._destroyed) return;
    const width = this.host.clientWidth, height = this.host.clientHeight;
    this._hasSize = width > 0 && height > 0;
    if (!this._hasSize) { this._sync(); return; }
    const dpr = Math.min(devicePixelRatio || 1, this.options.pixelRatio);
    if (width === this._width && height === this._height && dpr === this._dpr) return;
    const rx = width / this._width, ry = height / this._height;
    for (let i = 0; i < this._count; i++) {
      for (const key of ['x', 'sx', 'tx', 'arcX', 'ox']) this._data[key][i] *= rx;
      for (const key of ['y', 'sy', 'ty', 'arcY', 'oy']) this._data[key][i] *= ry;
    }
    this._width = width; this._height = height; this._dpr = dpr;
    this.canvas.width = Math.round(width * dpr);
    this.canvas.height = Math.round(height * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this._updatePointer();
    if (this._source) this._retarget(this._source);
    else this._draw(0);
    this._sync();
  }

  async _load(source) {
    if (typeof source !== 'string') {
      if (source instanceof HTMLImageElement) {
        await source.decode();
      } else if (!(source instanceof HTMLCanvasElement) && !(typeof ImageBitmap !== 'undefined' && source instanceof ImageBitmap)) {
        throw new TypeError('source must be a URL, HTMLImageElement, HTMLCanvasElement or ImageBitmap');
      }
      return source;
    }
    if (this._cache.has(source)) {
      const image = this._cache.get(source);
      this._cache.delete(source); this._cache.set(source, image);
      return image;
    }
    if (this._pending.has(source)) return this._pending.get(source);
    const image = new Image();
    image.crossOrigin = 'anonymous';
    const task = new Promise((resolve, reject) => {
      const clean = () => { clearTimeout(timer); image.onload = image.onerror = null; this._cancels.delete(cancel); };
      const cancel = () => { clean(); image.src = ''; reject(new DOMException('Image load cancelled', 'AbortError')); };
      const timer = setTimeout(() => { clean(); image.src = ''; reject(new Error(`Image load timed out: ${source}`)); }, this.options.loadTimeout);
      this._cancels.add(cancel);
      image.onload = () => { clean(); resolve(image); };
      image.onerror = () => { clean(); reject(new Error(`Cannot load image (check URL / CORS): ${source}`)); };
      image.src = source;
    });
    this._pending.set(source, task);
    try {
      const loaded = await task;
      if (!this._destroyed) {
        this._cache.set(source, loaded);
        while (this._cache.size > this.options.cacheSize) this._cache.delete(this._cache.keys().next().value);
      }
      return loaded;
    } finally { this._pending.delete(source); }
  }

  /** Resolves true when installed, false when superseded or destroyed. Does not wait for the animation. */
  async show(source) {
    this._assert();
    const request = ++this._request;
    try {
      const image = await this._load(source);
      if (this._destroyed || request !== this._request) return false;
      this._retarget(image); // Sampling failures preserve the previous image/targets.
      this._source = image;
      return true;
    } catch (error) {
      if (this._destroyed || request !== this._request) return false;
      throw error;
    }
  }

  async preload(sources) {
    this._assert();
    await Promise.all(sources.map(source => this._load(source)));
  }

  _retarget(image) {
    const iw = image.naturalWidth || image.width, ih = image.naturalHeight || image.height;
    if (!(iw > 0 && ih > 0)) throw new Error('Image has no pixels');
    const o = this.options, d = this._data;
    const scale = Math.min(this._width * (1 - o.padding * 2) / iw, this._height * (1 - o.padding * 2) / ih);
    const w = iw * scale, h = ih * scale;
    const [cols, rows] = gridSize(w, h, o.gap, o.maxParticles);
    // A fresh, tiny scratch canvas bounds CPU/memory and never taints the display canvas.
    const scratch = document.createElement('canvas');
    scratch.width = cols; scratch.height = rows;
    const ctx = scratch.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('Canvas 2D is unavailable');
    ctx.drawImage(image, 0, 0, cols, rows);
    let pixels;
    try { pixels = ctx.getImageData(0, 0, cols, rows).data; }
    catch (cause) { throw new Error('Cannot sample image: serve it from the same origin or enable CORS on the image server', { cause }); }
    const targets = shuffle(sampleRGBA(pixels, cols, rows, o));
    this._interactionScale = o.pointerScale === 'image' ? Math.max(w, h) / o.pointerReferenceSize : 1;
    // Reuse every allocated live slot, including particles still fading from an earlier switch.
    const oldCount = this._count;
    this._count = Math.max(oldCount, targets.length);
    this._targetCount = targets.length;
    for (let i = 0; i < this._count; i++) {
      if (i >= oldCount) {
        d.x[i] = Math.random() * this._width;
        d.y[i] = Math.random() * this._height;
        d.a[i] = d.ox[i] = d.oy[i] = 0;
        d.returnTime[i] = o.returnTime[0] + Math.random() * (o.returnTime[1] - o.returnTime[0]);
        d.phase[i] = Math.random() * Math.PI * 2;
      }
      d.sx[i] = d.x[i]; d.sy[i] = d.y[i]; d.sa[i] = d.a[i];
      const t = targets[i];
      d.tx[i] = t ? (this._width - w) / 2 + t.x * w : d.x[i];
      d.ty[i] = t ? (this._height - h) / 2 + t.y * h : d.y[i];
      d.ta[i] = t ? t.alpha : 0;
      const angle = Math.random() * Math.PI * 2;
      const distance = o.scatter * (0.5 + Math.random() * 0.5);
      d.arcX[i] = Math.cos(angle) * distance;
      d.arcY[i] = Math.sin(angle) * distance;
    }
    this._elapsed = 0;
    this._morphActive = this._count > 0;
    if (this._reduced()) { this._finish(); this._draw(0); }
    this._wake();
  }

  _finish() {
    const d = this._data;
    for (let i = 0; i < this._count; i++) {
      d.x[i] = d.sx[i] = d.tx[i]; d.y[i] = d.sy[i] = d.ty[i];
      d.a[i] = d.sa[i] = d.ta[i]; d.ox[i] = d.oy[i] = 0;
    }
    this._elapsed = this.options.duration;
    this._morphActive = false;
    this._count = this._targetCount;
  }

  _draw(dt) {
    const d = this._data, o = this.options, ctx = this.ctx;
    const reduced = this._reduced();
    const t = Math.min(1, this._elapsed / o.duration);
    const meanReturnTime = (o.returnTime[0] + o.returnTime[1]) / 2;
    const interactionScale = this._interactionScale;
    const pointerRadius = o.pointerRadius * interactionScale;
    ctx.clearRect(0, 0, this._width, this._height);
    ctx.fillStyle = o.color;
    this._offsetActive = false;
    this._morphActive = false;
    for (let i = 0; i < this._count; i++) {
      if (o.transition === 'timed') {
        const u = particleProgress(t, d.returnTime[i], meanReturnTime);
        const ease = u * u * (3 - 2 * u), arc = Math.sin(Math.PI * u);
        d.x[i] = d.sx[i] + (d.tx[i] - d.sx[i]) * ease + d.arcX[i] * arc;
        d.y[i] = d.sy[i] + (d.ty[i] - d.sy[i]) * ease + d.arcY[i] * arc;
        d.a[i] = d.sa[i] + (d.ta[i] - d.sa[i]) * ease;
        if (t < 1) this._morphActive = true;
      } else {
        // Continue from the live state. A new image changes targets, not the clock/trajectory.
        const tau = d.returnTime[i];
        d.x[i] = followTarget(d.x[i], d.tx[i], dt, tau);
        d.y[i] = followTarget(d.y[i], d.ty[i], dt, tau);
        d.a[i] = followTarget(d.a[i], d.ta[i], dt, tau);
        const positionClose = Math.abs(d.x[i] - d.tx[i]) + Math.abs(d.y[i] - d.ty[i]) < 0.05;
        const alphaClose = Math.abs(d.a[i] - d.ta[i]) < 0.001;
        if (positionClose) { d.x[i] = d.tx[i]; d.y[i] = d.ty[i]; }
        if (alphaClose) d.a[i] = d.ta[i];
        // An invisible outgoing particle no longer needs a position update.
        if ((!positionClose && d.a[i] > 0) || !alphaClose) this._morphActive = true;
      }
      let vx = 0, vy = 0;
      const tau = d.returnTime[i];
      if (!reduced && this._pointer && o.pointerStrength > 0) {
        const dx = d.x[i] + d.ox[i] - this._pointer.x, dy = d.y[i] + d.oy[i] - this._pointer.y;
        const dist = Math.hypot(dx, dy);
        if (o.pointerMode === 'inverse') {
          const factor = pointerFactor(dist, o.pointerStrength, interactionScale);
          vx = dx * factor; vy = dy * factor;
        } else if (pointerRadius > 0 && dist < pointerRadius) {
          const force = (1 - dist / pointerRadius) ** 2 * o.pointerStrength * interactionScale;
          vx = (dist > 0.001 ? dx / dist : 0) * force * 1000 / tau;
          vy = (dist > 0.001 ? dy / dist : 0) * force * 1000 / tau;
        }
      }
      d.ox[i] = reduced ? 0 : relaxOffset(d.ox[i], vx, dt, tau);
      d.oy[i] = reduced ? 0 : relaxOffset(d.oy[i], vy, dt, tau);
      if (Math.abs(d.ox[i]) + Math.abs(d.oy[i]) > 0.01) this._offsetActive = true;
      const phase = d.phase[i];
      const driftX = reduced ? 0 : Math.sin(this._time / o.driftPeriod + phase) * o.drift;
      const driftY = reduced ? 0 : Math.cos(this._time / (o.driftPeriod * 1.2) + phase) * o.drift;
      ctx.globalAlpha = Math.max(0, Math.min(1, d.a[i]));
      const x = d.x[i] + d.ox[i] + driftX - o.size / 2;
      const y = d.y[i] + d.oy[i] + driftY - o.size / 2;
      if (this._sprite) ctx.drawImage(this._sprite, x, y, o.size, o.size);
      else ctx.fillRect(x, y, o.size, o.size);
    }
    ctx.globalAlpha = 1;
    if (o.transition === 'timed') {
      if (t === 1) this._count = this._targetCount;
    } else {
      while (this._count > this._targetCount && d.a[this._count - 1] === 0) this._count--;
    }
  }

  pause() { this._assert(); this._paused = true; this._sync(); }
  resume() { this._assert(); this._paused = false; this._sync(); }
  resize() { this._assert(); this._resize(); }
  get stats() {
    return Object.freeze({ particles: this._count, targets: this._targetCount,
      width: this._width, height: this._height, running: this._raf !== null,
      transitioning: !!this._morphActive,
      reducedMotion: this._reduced(), destroyed: this._destroyed });
  }
  destroy() {
    if (this._destroyed) return;
    this._destroyed = true; this._request++;
    this._sync();
    this._events.abort();
    this._media.removeEventListener('change', this._motionChange);
    this._resizeObserver.disconnect(); this._intersection?.disconnect();
    for (const cancel of [...this._cancels]) cancel();
    this._cache.clear(); this._pending.clear(); this._source = null;
    this._sprite = null;
    this._count = this._targetCount = 0;
    this._morphActive = false;
    this._data = {};
    this.canvas.remove();
  }
}

export default ParticleMorph;
