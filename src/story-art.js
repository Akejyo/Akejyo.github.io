import { CressonFlower } from './collapse-art.js';

/** Fixed, sparse depth layers. CSS removes half on mobile; none mount in articles. */
export function SnowAtmosphere() {
  return `<div class="snow-atmosphere" data-atmosphere aria-hidden="true"><div class="snow-fog"></div>${[['back',12,30],['middle',9,18],['front',3,10]].map(([layer,count,seconds])=>`<div class="snow-layer snow-${layer}">${Array.from({length:count},(_,i)=>`<i style="--snow-x:${(i*37+11)%100}%;--snow-duration:${seconds+i%4*2}s;--snow-delay:-${(i*7+3)%(seconds-1)}s;--snow-drift:${(i%2?1:-1)*(18+i%3*14)}px"></i>`).join('')}</div>`).join('')}</div>`;
}

export function CressonControl({className=''}={}) {
  return `<button type="button" class="cresson-control ${className}" data-cresson aria-label="Cresson flower">${CressonFlower()}</button>`;
}

/** A walking cadence, one absent impression, then a distant continuation. */
export function UncertainFootprints() {
  const foot='<path d="M9 15c-5 0-7 4-6 9 1 4 4 7 3 12-1 5 1 8 5 8 5 0 6-4 4-9-2-5 0-8 1-12 1-5-2-8-7-8Z"/><ellipse cx="5" cy="8" rx="3" ry="4"/><ellipse cx="11" cy="6" rx="2.2" ry="3"/><ellipse cx="16" cy="8" rx="1.8" ry="2.5"/><ellipse cx="20" cy="11" rx="1.5" ry="2"/><ellipse cx="22" cy="15" rx="1.2" ry="1.6"/>';
  const steps=[[46,342,1],[76,302,-1],[47,262,1],[76,222,-1],/* the next left step is absent */[76,142,-1],[47,18,1]];
  return `<svg class="uncertain-footprints" viewBox="0 0 120 400" fill="currentColor" aria-hidden="true" focusable="false">${steps.map(([x,y,direction])=>`<g transform="translate(${x} ${y}) scale(${direction*.42} .42) rotate(-7)">${foot}</g>`).join('')}</svg>`;
}

export function SnowField() {
  // Original distant tree line. No borrowed imagery or symbolic shapes.
  const trees=Array.from({length:107},(_,i)=>{const x=i*15-12+(i*7%11);const h=14+(i*17%31);return `<path transform="translate(${x} 270) scale(${.45+(i%4)*.06} ${h/60})" d="M0-60-6-42-3-44-11-25-6-28-16-5-2-9-2 0h4v-9l14 4-10-23 5 3-8-19 3 2Z"/>`;}).join('');
  return `<svg class="snow-field-art" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false"><path fill="#dce4e8" d="M0 0h1600v900H0Z"/><path fill="#c4d0d7" d="m0 272 188-37 177 26 215-55 190 51 225-64 186 51 249-35 170 58v190H0Z"/><g fill="#344754" opacity=".72">${trees}</g><path fill="#eff2f3" d="M0 270q420-9 800 14t800-8v624H0Z"/><path fill="#e7edef" d="M0 580q800-54 1600 12v308H0Z"/></svg>`;
}
