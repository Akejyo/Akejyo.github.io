/** Original geometry, using weaving rhythms rather than copied cultural emblems. */
export function TextileBand({ className = '', repeats = 7 } = {}) {
  const width = repeats * 32;
  const units = Array.from({ length: repeats }, (_, index) => {
    const x = index * 32;
    return `<g transform="translate(${x} 0)"><path class="thread-navy" d="M0 11 8 3 16 11 24 3 32 11M0 21 8 29 16 21 24 29 32 21"/><path class="thread-beige" d="M0 0h32M0 32h32M0 16h4m24 0h4"/><path class="thread-red" d="m16 10 6 6-6 6-6-6Z"/><path class="thread-white" d="m16 14 2 2-2 2-2-2Z"/><path class="thread-navy thread-fill" d="m3 16 3-3v6Zm26 0-3-3v6Z"/></g>`;
  }).join('');
  return `<svg class="textile-band ${className}" width="${width}" height="32" viewBox="0 0 ${width} 32" fill="none" aria-hidden="true" focusable="false">${units}</svg>`;
}

/** A normal left/right pair of barefoot impressions; no behaviour or animation. */
export function FootprintTrail() {
  const foot = `<path d="M14 20c-6-1-10 4-10 11 0 6 4 10 5 17 1 5-2 8-1 13 1 6 5 9 10 8 6-1 7-6 6-12-1-7-4-11-2-17 3-8 1-18-8-20Z"/><ellipse cx="9" cy="11" rx="4.4" ry="6"/><ellipse cx="18" cy="9" rx="3.1" ry="4.5"/><ellipse cx="25" cy="12" rx="2.7" ry="3.7"/><ellipse cx="30" cy="17" rx="2.2" ry="3.1"/><ellipse cx="33" cy="23" rx="1.8" ry="2.5"/>`;
  return `<svg class="footprint-trail" width="68" height="112" viewBox="0 0 84 140" fill="currentColor" aria-hidden="true" focusable="false"><g transform="translate(40 64) scale(-1 1) rotate(-8 18 35)">${foot}</g><g transform="translate(44 2) rotate(-5 18 35)">${foot}</g></svg>`;
}
