import test from 'node:test';
import assert from 'node:assert/strict';
import { CollapseController, isSafeDecoration } from '../src/collapse.js';
import { CollapseEffect, COLLAPSE_MODES } from '../src/collapse-art.js';
import { observeEffects } from '../src/effect-events.js';

function fixture(mode='DISPLACEMENT', reduced=false) {
  const classes=new Set(['collapse-effect']);const styles={};const jobs=new Map();let next=0, now=0;
  const element={tagName:'svg',dataset:{collapse:mode},getAttribute:()=> 'true',querySelector:()=>null,closest:()=>null,getScreenCTM:()=>({a:.5}),style:{setProperty:(key,value)=>styles[key]=value},classList:{contains:key=>classes.has(key),add:key=>classes.add(key),remove:key=>classes.delete(key),toggle(key,on){if(on)classes.add(key);else classes.delete(key);}}};
  const motion={matches:reduced,addEventListener(){},removeEventListener(){}};
  const root={hidden:false,querySelectorAll:s=>s==='[data-collapse]'?[element]:[],addEventListener(){},removeEventListener(){}};
  const view={matchMedia:()=>motion,addEventListener(){},removeEventListener(){},getSelection:()=>'',IntersectionObserver:class{constructor(callback){this.callback=callback;}observe(){}disconnect(){}}};
  const clock={now:()=>now,setTimeout(fn,delay){jobs.set(++next,{fn,delay,at:now+delay});return next;},clearTimeout:id=>jobs.delete(id)};
  const controller=new CollapseController({root,view,clock,random:()=>.5});
  const tick=()=>{const [id,job]=[...jobs.entries()].sort((a,b)=>a[1].at-b[1].at)[0];jobs.delete(id);now=job.at;job.fn();return job.delay;};
  const visible=()=>controller.observer.callback([{target:element,isIntersecting:true,intersectionRatio:1}]);
  return {controller,element,motion,root,classes,styles,jobs,tick,visible,advance:ms=>{now+=ms;}};
}

test('automatic events require visibility, stay rare, and stop after three',()=>{
  const f=fixture();assert.equal(f.jobs.size,0);f.visible();assert.equal(f.tick(),5500);
  assert.equal(f.controller.events,1);assert.equal(f.tick(),210);
  assert.equal(Math.abs(parseFloat(f.styles['--collapse-x']))*.5,6);
  assert.equal(f.styles['--collapse-ghost-opacity'],'0.14');
  assert.equal(f.tick(),30000);assert.equal(f.tick(),22500);f.tick();assert.equal(f.tick(),30000);assert.equal(f.tick(),22500);f.tick();
  assert.equal(f.controller.events,3);assert.equal(f.jobs.size,0);f.controller.destroy();
});
test('reduced motion cancels a running event and supplies a static variant',()=>{
  const f=fixture();f.visible();f.tick();f.motion.matches=true;f.controller.onMotion();
  assert.equal(f.jobs.size,0);assert.equal(f.classes.has('is-anomalous'),false);assert.equal(f.classes.has('is-static'),true);
  assert.equal(f.controller.play(f.element),false);f.controller.destroy();
});
test('hidden tabs, offscreen decorations and disposal cancel all pending work',()=>{
  const f=fixture();f.visible();f.root.hidden=true;f.controller.onVisibility();assert.equal(f.jobs.size,0);
  f.root.hidden=false;f.controller.onVisibility();f.tick();
  f.controller.observer.callback([{target:f.element,isIntersecting:false,intersectionRatio:0}]);assert.equal(f.jobs.size,0);
  f.visible();f.controller.destroy();assert.equal(f.jobs.size,0);
});

test('Level I pause and page departure cannot restart competing ambient events',()=>{
  const f=fixture();f.root.documentElement={dataset:{}};f.visible();f.tick();
  f.root.documentElement.dataset.collapseLevel='1';f.controller.onLevel({detail:{active:true}});
  assert.equal(f.jobs.size,0);f.controller.schedule();assert.equal(f.jobs.size,0);
  f.controller.onPageHide();delete f.root.documentElement.dataset.collapseLevel;
  f.controller.onLevel({detail:{active:false}});assert.equal(f.jobs.size,0);
  f.controller.onPageShow();assert.equal(f.jobs.size,1);f.controller.destroy();
});
test('nonlinear relocation settles at its destination without changing layout',()=>{
  const f=fixture('NONLINEARITY');f.controller.play(f.element);assert.equal(f.tick(),900);
  assert.equal(f.element.dataset.collapsePosition,'0');assert.equal(f.styles['--collapse-from'],'0px');
  f.controller.play(f.element);f.tick();assert.equal(f.element.dataset.collapsePosition,'36');f.controller.destroy();
});
test('content and interactive ancestors are never eligible for animation',()=>{
  const f=fixture();assert.equal(isSafeDecoration(f.element),true);
  f.element.closest=()=>({});assert.equal(isSafeDecoration(f.element),false);
  assert.equal(f.controller.play(f.element),false);assert.equal(f.jobs.size,0);f.controller.destroy();
  for(const mode of COLLAPSE_MODES){const svg=CollapseEffect({mode,id:'test-'+mode.toLowerCase()});assert.match(svg,/aria-hidden="true" focusable="false"/);assert.doesNotMatch(svg,/<(?:text|foreignObject|a|image)[\s>]/);}
  assert.throws(()=>CollapseEffect({mode:'GLITCH',id:'test'}));
});

test('QA uses the production player, exaggerates only when enabled, and logs completion/cancellation',()=>{
  const events=[];const stop=observeEffects(event=>events.push(event));const f=fixture();
  f.controller.debugExaggeration=true;f.controller.play(f.element,'qa force');
  assert.equal(parseFloat(f.styles['--collapse-x'])*.5,20);assert.equal(f.styles['--collapse-ghost-opacity'],'0.5');f.tick();
  f.controller.debugExaggeration=false;f.controller.play(f.element,'qa force');
  assert.equal(parseFloat(f.styles['--collapse-x'])*.5,6);assert.equal(f.styles['--collapse-ghost-opacity'],'0.14');f.controller.cancelAll();
  assert.deepEqual(events.map(e=>e.phase),['started','completed','started','cancelled']);f.controller.destroy();stop();
});
test('manual scheduler trigger respects real eligibility, cap and pause/resume state',()=>{
  const f=fixture();assert.equal(f.controller.triggerNow(),false);f.visible();f.controller.pause();assert.equal(f.controller.snapshot().state,'paused');assert.equal(f.jobs.size,0);
  assert.equal(f.controller.triggerNow(),true);assert.equal(f.controller.events,1);f.tick();assert.equal(f.jobs.size,0);
  f.controller.resume();assert.equal(f.controller.snapshot().state,'ornament cooldown');f.controller.destroy();
});

test('eligible exposure accumulates across scrolling, hidden time and interaction pauses',()=>{
  const f=fixture();f.visible();f.advance(2000);
  f.controller.observer.callback([{target:f.element,isIntersecting:false,intersectionRatio:0}]);
  assert.equal(f.controller.snapshot().remaining,3500);f.advance(90000);f.visible();
  f.advance(1000);f.root.hidden=true;f.controller.onVisibility();
  assert.equal(f.controller.snapshot().remaining,2500);f.advance(60000);f.root.hidden=false;f.controller.onVisibility();
  f.advance(500);f.root.activeElement={closest:()=>({})};f.controller.onInteraction();
  assert.equal(f.controller.snapshot().remaining,2000);f.tick();assert.equal(f.controller.events,0);
  f.root.activeElement=null;f.controller.onInteraction();assert.equal(f.tick(),2000);
  assert.equal(f.controller.events,1);f.controller.destroy();
});

test('cooldown excludes the previous ornament and another visible ornament is preferred',()=>{
  const f=fixture(),other=fixture('NONLINEARITY');f.visible();
  f.controller.observer.callback([{target:other.element,isIntersecting:true,intersectionRatio:1}]);
  f.tick();assert.equal(f.controller.events,1);assert.equal(f.controller.candidates().length,1);
  assert.equal(f.controller.candidates()[0],f.element); // random .5 chose the second ornament
  f.tick();assert.equal(f.tick(),22500);assert.equal(f.controller.events,2);
  assert.equal(f.controller.candidates().length,0);f.controller.destroy();other.controller.destroy();
});
