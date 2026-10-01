import test from 'node:test';
import assert from 'node:assert/strict';
import { FlowerSequence, rememberVisit, archiveUncertainty, installStory } from '../src/story.js';
import { UncertainFootprints } from '../src/story-art.js';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { observeEffects } from '../src/effect-events.js';

test('flower requires five paced interactions; first is quiet, second responds, then cooldown',()=>{
  const sequence=new FlowerSequence();
  assert.equal(sequence.interact(0),'quiet');assert.equal(sequence.interact(600),'listen');
  assert.equal(sequence.interact(1200),'rings');assert.equal(sequence.interact(1800),'crimson');
  assert.equal(sequence.interact(2400),'level');assert.equal(sequence.until,12400);
  assert.equal(sequence.interact(13000),'quiet');assert.equal(sequence.interact(72401),'quiet');
  const rapid=new FlowerSequence();for(let t=0;t<1000;t+=100)assert.equal(rapid.interact(t),'quiet');
  assert.equal(rapid.interact(10000),'quiet');
});
test('storage denial is harmless and archive anomalies require repeat visits',()=>{
  assert.equal(rememberVisit({getItem(){throw Error('blocked');}}),1);
  assert.equal(archiveUncertainty(2,()=>0),false);assert.equal(archiveUncertainty(3,()=>.01),true);
  assert.equal(archiveUncertainty(500,()=>.05),false);
  const svg=UncertainFootprints();assert.equal((svg.match(/<g transform/g)||[]).length,6);
  assert.doesNotMatch(svg,/animate|<text/);assert.match(svg,/aria-hidden="true"/);
});

test('third and fourth production activations respond and cleanup on cancellation',()=>{
  const f=fixture();f.flower.emit('click');f.advance(600);f.flower.emit('click');
  assert.ok(f.flower.classList.values.has('is-listening'));f.advance(600);f.flower.emit('click');
  assert.ok(f.flower.classList.values.has('is-attending'));assert.equal(f.flower.classList.values.has('is-listening'),false);
  f.advance(600);f.flower.emit('click');assert.ok(f.flower.classList.values.has('is-answering'));
  f.doc.hidden=true;f.doc.emit('visibilitychange');assert.equal(f.flower.classList.values.size,0);assert.equal(f.jobs.size,0);f.api.destroy();
});
function fixture({withPersona=false,withCounter=false,reduced=false}={}){
  const target=()=>({listeners:{},addEventListener(name,fn){(this.listeners[name]??=[]).push(fn);},removeEventListener(){},emit(name,event={}){this.listeners[name]?.forEach(fn=>fn(event));}});
  const classes=()=>({values:new Set(),add(v){this.values.add(v);},remove(v){this.values.delete(v);}});
  const flower={...target(),classList:classes()};const jobs=new Map();let id=0;let now=0;
  const persona=withPersona?{...target(),id:'persona-cresson',classList:classes()}:null,counter=withCounter?{textContent:'6'}:null;
  const doc={...target(),hidden:false,documentElement:{dataset:{}},body:{classList:classes()},querySelector:selector=>selector==='[data-persona-cresson]'?persona:selector==='[data-archive-counter]'?counter:null,querySelectorAll:selector=>selector==='[data-cresson]'?(persona?[flower,persona]:[flower]):[],dispatchEvent(event){this.emit(event.type,event);}};
  const motion={...target(),matches:reduced};const view={...target(),matchMedia:()=>motion,performance:{now:()=>now},CustomEvent:class{constructor(type,options){this.type=type;this.detail=options.detail;}},setTimeout(fn,delay){jobs.set(++id,{fn,at:now+delay});return id;},clearTimeout:id=>jobs.delete(id)};
  const api=installStory({doc,view,random:()=>1});
  const advance=ms=>{now+=ms;for(const [id,job] of jobs)if(job.at<=now){jobs.delete(id);job.fn();}};
  const activate=()=>{for(let i=0;i<5;i++){flower.emit('click');advance(600);}};
  return {doc,view,jobs,api,advance,activate,flower,persona,counter};
}
test('Level I clears after ten seconds and cancels on hidden pages and disposal',()=>{
  const f=fixture();f.activate();assert.equal(f.doc.documentElement.dataset.collapseLevel,'1');
  f.advance(9399);assert.equal(f.doc.documentElement.dataset.collapseLevel,'1');
  f.advance(1);assert.equal(f.doc.documentElement.dataset.collapseLevel,undefined);f.api.destroy();
  const hidden=fixture();hidden.activate();hidden.doc.hidden=true;hidden.doc.emit('visibilitychange');
  assert.equal(hidden.doc.documentElement.dataset.collapseLevel,undefined);assert.equal(hidden.jobs.size,0);hidden.api.destroy();
  const disposed=fixture();disposed.activate();disposed.api.destroy();assert.equal(disposed.jobs.size,0);assert.equal(disposed.doc.documentElement.dataset.collapseLevel,undefined);
});

test('navigation handoff is consumed once and rejects expired, mismatched and reduced-motion markers',()=>{
  const script=readFileSync(new URL('../src/story-arrival.js',import.meta.url),'utf8');
  function arrive(marker,reduced=false,pathname='/about'){
    let stored=JSON.stringify(marker);const document={documentElement:{dataset:{}}};
    const sessionStorage={getItem:()=>stored,removeItem:()=>stored=null};
    runInNewContext(script,{sessionStorage,document,location:{pathname,search:''},Date:{now:()=>100000},matchMedia:()=>({matches:reduced})});
    assert.equal(stored,null);return document.documentElement.dataset.lingering;
  }
  assert.equal(arrive({path:'/about',time:99900}),'true');
  assert.equal(arrive({path:'/about',time:99900},false,'/about/'),'true');
  assert.equal(arrive({path:'/about/',time:99900}),'true');
  assert.equal(arrive({path:'/about',time:99900},true),undefined);
  assert.equal(arrive({path:'/about',time:80000}),undefined);
  assert.equal(arrive({path:'/records',time:99900}),undefined);
});

test('QA entry points invoke the actual Persona flower and archive state with cancellable lifecycles',()=>{
  const events=[],stop=observeEffects(event=>events.push(event));const f=fixture({withPersona:true,withCounter:true});
  f.api.secondResponse(undefined,'qa');assert.ok(f.flower.classList.values.has('is-listening'));f.advance(1200);assert.equal(f.flower.classList.values.has('is-listening'),false);
  assert.equal(f.api.snapshot().personaMounted,true);f.api.personaResponse();
  assert.ok(f.persona.classList.values.has('is-answering'));assert.ok(f.flower.classList.values.has('is-answering'));
  f.advance(1200);assert.equal(f.persona.classList.values.size,0);
  f.api.setArchive(true,'qa');assert.equal(f.counter.textContent,'?');f.api.setArchive(false,'qa');assert.equal(f.counter.textContent,'6');
  f.api.enterLevel('qa');assert.equal(f.api.snapshot().remaining,10000);f.api.endLevel('cancelled');assert.equal(f.api.snapshot().levelActive,false);
  f.activate();assert.ok(f.api.snapshot().cooldown>0);f.api.resetSequence();assert.equal(f.api.snapshot().count,0);assert.ok(f.api.snapshot().cooldown>0);f.api.resetCooldown();assert.equal(f.api.snapshot().cooldown,0);
  assert.ok(events.some(e=>e.effect==='Second response'&&e.phase==='completed'));assert.ok(events.some(e=>e.effect==='Fourth response'&&e.phase==='completed'));assert.ok(events.some(e=>e.effect==='Level I'&&e.phase==='cancelled'));f.api.destroy();stop();
});

test('Persona and abstract flower share one sequence, including reduced-motion cancellation',()=>{
  for(const reduced of [false,true]){
    const f=fixture({withPersona:true,reduced});
    f.persona.emit('click');assert.equal(f.api.snapshot().count,1);assert.equal(f.persona.classList.values.size,0);
    f.advance(600);f.flower.emit('click');assert.ok(f.persona.classList.values.has('is-listening'));
    f.advance(600);f.api.activatePersona();assert.ok(f.persona.classList.values.has('is-attending'));
    f.advance(600);f.persona.emit('click');assert.ok(f.persona.classList.values.has('is-answering'));
    f.advance(600);f.persona.emit('click');assert.equal(f.api.snapshot().levelActive,true);assert.equal(f.persona.classList.values.size,0);
    f.advance(10000);assert.equal(f.api.snapshot().levelActive,false);assert.equal(f.jobs.size,0);
    f.api.personaResponse();f.api.enterLevel();f.api.resetPersona();assert.equal(f.api.snapshot().levelActive,false);assert.equal(f.persona.classList.values.size,0);assert.equal(f.jobs.size,0);
    f.api.destroy();
  }
});
