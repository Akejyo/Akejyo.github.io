import { ParticleMorph } from "./particle-engine.js";

const host = document.querySelector("#home-particle-canvas");
if (host) {
  const sources = {
    "/": "home",
    "/records": "records",
    "/projects": "expeditions",
    "/archive": "archive",
    "/gallery": "gallery",
    "/about": "about",
  };
  const fallback = document.querySelector(".particle-fallback");
  const nav = document.querySelector("#main-navigation");
  const captions = [...document.querySelectorAll('[data-home-caption]')];
  const captionPanel = document.querySelector('.home-caption-stack');
  const captionBackground = captionPanel?.querySelector('.home-caption-background');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let activeCaption = captions[0], desiredCaption = activeCaption, captionVersion = 0;
  function settleCaptions() {
    captionVersion++;
    activeCaption = desiredCaption;
    captionBackground?.getAnimations().forEach(animation => animation.cancel());
    for (const caption of captions) {
      caption.getAnimations().forEach(animation => animation.cancel());
      caption.hidden = caption !== activeCaption;
      caption.setAttribute('aria-hidden', String(caption !== activeCaption));
    }
  }
  async function showCaption(name) {
    const next = captions.find(caption => caption.dataset.homeCaption === name);
    if (!next || next === desiredCaption) return;
    desiredCaption = next;
    const version = ++captionVersion;
    if (motion.matches || !next.animate) { settleCaptions(); return; }
    const previous = activeCaption;
    const style = getComputedStyle(previous);
    const fromOpacity = style.opacity;
    const fromTransform = style.transform;
    previous.getAnimations().forEach(animation => animation.cancel());
    const timing = { duration:650, easing:'cubic-bezier(.2,.65,.3,1)' };
    // Keep the outgoing caption in normal flow at its exact original width.
    // Do not reveal or lay out the next caption until this exit is complete.
    const outgoing = previous.animate([
      {opacity:fromOpacity, transform:fromTransform},
      {opacity:0, transform:'translateX(-28px)'}
    ], {...timing, fill:'forwards'});
    try { await outgoing.finished; } catch { return; }
    if (version !== captionVersion) return;
    const fromHeight = captionBackground.getBoundingClientRect().height;
    captionBackground.getAnimations().forEach(animation => animation.cancel());
    previous.hidden = true;
    previous.setAttribute('aria-hidden', 'true');
    outgoing.cancel();
    activeCaption = next;
    next.hidden = false;
    next.setAttribute('aria-hidden', 'false');
    const toHeight = captionPanel.getBoundingClientRect().height;
    captionBackground.animate([{height:fromHeight+'px'}, {height:toHeight+'px'}], timing);
    next.animate([
      {opacity:0, transform:'translateX(20px)'},
      {opacity:1, transform:'translateX(0)'}
    ], timing);
  }
  motion.addEventListener('change', settleCaptions);
  window.addEventListener('resize', settleCaptions);
  document.fonts?.ready.then(settleCaptions);
  let engine,
    current = "",
    request = 0;
  try {
    engine = new ParticleMorph(host, {
      color: "#263f50",
      gap: 3,
      size: 3,
      maxParticles: 12000,
      gamma: 0.7,
      threshold: 0.035,
      padding: 0.08,
      pointerScope: "container",
      autoPause: true,
      respectReducedMotion: true,
    });
  } catch {
    /* The supplied image remains available without Canvas 2D. */
  }
  async function select(route) {
    const name = sources[route] || "home";
    if (name === current) return;
    current = name;
    showCaption(name);
    const version = ++request;
    const src = `/assets/particles/${name}.png`;
    fallback.src = src;
    if (!engine) {
      fallback.hidden = false;
      host.style.visibility = "hidden";
      return;
    }
    try {
      const installed = await engine.show(src);
      if (version === request && installed) {
        fallback.hidden = true;
        host.style.visibility = "visible";
      }
    } catch {
      if (version === request) {
        fallback.hidden = false;
        host.style.visibility = "hidden";
      }
    }
  }
  for (const link of nav.querySelectorAll("a")) {
    const route = new URL(link.href).pathname.replace(/\/$/, "") || "/";
    link.addEventListener("pointerenter", (event) => {
      if (event.pointerType !== "touch") select(route);
    });
    link.addEventListener("focus", () => select(route));
  }
  // Keep the most recently previewed image until another navigation item is selected.
  select("/");
  window.addEventListener("pagehide", (event) => {
    settleCaptions();
    if (event.persisted) engine?.pause();
    else engine?.destroy();
  });
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) engine?.resume();
  });
}
