import test from 'node:test';
import assert from 'node:assert/strict';
import { installEnvironment } from '../src/environment.js';
import { SnowAtmosphere } from '../src/story-art.js';
import { home, article, notFound, voidPage } from '../src/pages.js';
import { loadPosts } from '../src/content.js';
import { readFileSync } from 'node:fs';

test('ambient motion slows into Level I, restores, and respects hidden/reduced-motion lifecycle',()=>{
  const target=()=>({listeners:{},addEventListener(n,f){this.listeners[n]=f;},removeEventListener(n){delete this.listeners[n];},emit(n){this.listeners[n]?.();}});
  let time=0,id=0;const jobs=new Map();
  const animation={playbackRate:1,playState:'running',updatePlaybackRate(v){this.playbackRate=v;},play(){this.playState='running';},pause(){this.playState='paused';}};
  const motion={...target(),matches:false};
  const doc={...target(),hidden:false,documentElement:{dataset:{}},querySelectorAll:()=>[{getAnimations:()=>[animation]}]};
  const view={...target(),matchMedia:()=>motion,performance:{now:()=>time},setTimeout(fn,ms){jobs.set(++id,{fn,at:time+ms});return id;},clearTimeout:id=>jobs.delete(id)};
  const advance=ms=>{const end=time+ms;while(jobs.size){const [id,job]=[...jobs].sort((a,b)=>a[1].at-b[1].at)[0];if(job.at>end)break;time=job.at;jobs.delete(id);job.fn();}time=end;};
  const api=installEnvironment({doc,view});advance(1000);
  doc.documentElement.dataset.collapseLevel='1';doc.emit('collapselevelchange');advance(350);
  assert.equal(animation.playbackRate,.5);advance(350);assert.equal(animation.playState,'paused');
  delete doc.documentElement.dataset.collapseLevel;doc.emit('collapselevelchange');advance(1000);
  assert.equal(animation.playbackRate,1);assert.equal(animation.playState,'running');
  doc.hidden=true;doc.emit('visibilitychange');assert.equal(animation.playState,'paused');assert.equal(jobs.size,0);
  doc.hidden=false;doc.emit('visibilitychange');motion.matches=true;motion.emit('change');
  assert.equal(doc.documentElement.dataset.environmentMotion,undefined);assert.equal(jobs.size,0);
  api.destroy();assert.equal(jobs.size,0);
});

test('snow mounts on production atmospheric routes only; mobile and motion safeguards remain',async()=>{
  const posts=await loadPosts();
  for(const page of [home(posts),notFound(),voidPage()]){
    assert.match(page.html,/data-atmosphere aria-hidden="true"/);
    assert.match(page.html,/src\/story.js/);
  }
  assert.doesNotMatch(article(posts[0],posts).html,/data-atmosphere/);
  assert.equal((SnowAtmosphere().match(/<i style/g)||[]).length,24);
  const css=readFileSync(new URL('../src/story.css',import.meta.url),'utf8');
  assert.match(css,/prefers-reduced-motion:reduce/);assert.match(css,/snow-layer,.snow-fog \{ display:none/);
  assert.match(css,/snow-layer i:nth-child\(even\)/);assert.match(css,/story-out 250ms ease 450ms/);
});
