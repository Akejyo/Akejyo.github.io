// These components intentionally do not accept children or arbitrary markup.
// A CollapseEffect can contain only geometry created here, never reader content.
export const COLLAPSE_MODES = Object.freeze(['ABSENCE', 'DISPLACEMENT', 'REPETITION', 'NONLINEARITY']);
const safeId = value => {
  if (typeof value!=='string' || !/^[a-z][a-z0-9-]*$/.test(value)) throw new TypeError('Collapse decorations need a unique, lowercase HTML id.');
  return value;
};
const safeClass = value => /^[a-zA-Z0-9 _-]*$/.test(value) ? value : '';

function stitch(index, offset=0) {
  return `<g transform="translate(${index*32+offset} 0)"><path class="collapse-thread" d="M0 11 8 3 16 11 24 3 32 11M0 21 8 29 16 21 24 29 32 21"/><path class="collapse-selvedge" d="M0 0h32M0 32h32M0 16h4m24 0h4"/><path class="collapse-knot" d="m16 10 6 6-6 6-6-6Z"/></g>`;
}
const weave = () => Array.from({length:7}, (_,index)=>stitch(index)).join('');

export function CollapseEffect({mode='ABSENCE',id,className=''}={}) {
  if (!COLLAPSE_MODES.includes(mode)) throw new TypeError(`Unknown Collapse mode: ${mode}`);
  safeId(id);
  const attributes = `id="${id}" class="collapse-effect collapse-${mode.toLowerCase()} ${safeClass(className)}" data-collapse="${mode}" data-collapse-state="rest" aria-hidden="true" focusable="false"`;
  if (mode==='NONLINEARITY') {
    return `<svg ${attributes} width="120" height="32" viewBox="0 0 120 32" fill="none"><path class="collapse-ground" d="M0 24h34m38 0h48"/><g class="collapse-traveller"><path d="M45 16c3-5 9-6 13-3-1 5-8 7-13 3Z"/><path class="collapse-inner-trace" d="m49 15 5-1"/></g></svg>`;
  }
  let geometry;
  if (mode==='ABSENCE') {
    geometry = `<defs><mask id="${id}-absence" maskUnits="userSpaceOnUse" x="0" y="-2" width="224" height="36"><rect x="0" y="-2" width="224" height="36" fill="white"/><rect class="collapse-missing" x="96" y="-2" width="32" height="36" fill="black"/></mask></defs><g mask="url(#${id}-absence)">${weave()}</g>`;
  } else if (mode==='DISPLACEMENT') {
    geometry = `<g class="collapse-echo">${weave()}</g><g class="collapse-presence">${weave()}</g>`;
  } else {
    geometry = `<g class="collapse-ordinary">${weave()}</g><g class="collapse-repeated">${Array.from({length:7},(_,index)=>stitch(index,index===3?15:index===4?8:0)).join('')}<path class="collapse-repeat-echo" d="m129 10 6 6-6 6-6-6Z"/></g>`;
  }
  return `<svg ${attributes} width="224" height="32" viewBox="0 0 224 32" fill="none">${geometry}</svg>`;
}

/** Original asymmetrical botanical emblem. No spinning, copied insignia or raster art. */
export function CressonFlower({className=''}={}) {
  const petals = [0,49,104,153,207,257,309].map((angle,index)=>`<path class="cresson-outer" transform="rotate(${angle} 64 64)" d="M57 45C45 ${30+index%3} 51 17 64 9c3 16 17 22 10 36Z"/>`).join('');
  const inner = [22,94,166,238,310].map(angle=>`<path class="cresson-inner" transform="rotate(${angle} 64 64)" d="M58 49c-4-9-1-16 7-22 1 11 12 15 7 25Z"/>`).join('');
  return `<svg class="cresson-flower ${safeClass(className)}" viewBox="0 0 128 128" width="48" height="48" fill="none" aria-hidden="true" focusable="false">${petals}${inner}<path class="cresson-eye" d="M34 66c15-17 37-19 61-3-17 16-40 21-61 3Z"/><g class="cresson-rings"><path d="M47 43a27 27 0 1 1-9 29M42 50l-2 4"/><path d="M69 44a20 20 0 1 1-22 12M52 48l3-2"/><path class="cresson-cold" d="M57 53a13 13 0 0 1 16 3"/></g><ellipse class="cresson-heart" cx="64" cy="65" rx="12" ry="10"/><ellipse class="cresson-void" cx="65" cy="65" rx="6.5" ry="7.5"/><path class="cresson-cold" d="M62 59q3-2 5 0"/></svg>`;
}

export function CollapseStudies() {
  return `<section id="collapse-studies" class="ds-section collapse-lab"><div class="section-heading"><h2><span class="section-number">06</span>Collapse studies</h2><span class="section-note">Only the ornament is uncertain.</span></div><p class="micro">An isolated review surface. The blog waits 4-7 seconds of eligible exposure before a possible event, then 15-30 seconds of eligible exposure between events; each ornament rests for 30 seconds. At most three events occur per page visit, only while an eligible decoration is visible.</p><div class="collapse-lab-tools"><button type="button" class="button secondary" data-collapse-static aria-pressed="false">Use static variants</button><span class="micro" data-collapse-status role="status">System motion preference is respected.</span></div><div class="collapse-samples">${COLLAPSE_MODES.map(mode=>`<div class="collapse-sample"><h3 class="eyebrow">${mode}</h3><div class="collapse-sample-art">${CollapseEffect({id:'study-'+mode.toLowerCase(),mode})}</div><p class="micro">${{ABSENCE:'A precisely absent segment, without a torn or erased edge.',DISPLACEMENT:'A 4-8 px displacement for 120–300 ms. A faint original remains.',REPETITION:'A second reading of the same weave, with incompatible spacing.',NONLINEARITY:'A small form leaves one position and becomes present elsewhere.'}[mode]}</p><button type="button" class="button secondary" data-collapse-preview="study-${mode.toLowerCase()}" ${['ABSENCE','REPETITION'].includes(mode)?'aria-pressed="false"':''}>${['ABSENCE','REPETITION'].includes(mode)?'Compare ordinary form':'Observe once'}</button></div>`).join('')}<div class="collapse-sample flower-study"><h3 class="eyebrow">CressonFlower</h3><div class="collapse-sample-art">${CressonFlower()}</div><p class="micro">A desaturated flower, an eye-shaped opening, and interrupted rings. Hover to reveal its quiet crimson center. A rare emblem, separate from the common woven mark.</p></div></div></section>`;
}
