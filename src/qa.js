// This module and its stylesheet are HTTP 404 unless the server explicitly enables development.
if(!document.querySelector('meta[name="northline-development"][content="true"]'))throw new Error('QA requires development mode');
if(document.readyState==='loading')await new Promise(resolve=>document.addEventListener('DOMContentLoaded',resolve,{once:true}));
const [{collapseController:collapse},{storyController:story},{CollapseEffect,COLLAPSE_MODES},{observeEffects,effectEvent}]=await Promise.all([import('./collapse.js'),import('./story.js'),import('./collapse-art.js'),import('./effect-events.js')]);
const session={get(key,fallback){try{return JSON.parse(sessionStorage.getItem('northline-qa-'+key))??fallback;}catch{return fallback;}},set(key,value){try{sessionStorage.setItem('northline-qa-'+key,JSON.stringify(value));}catch{}}};
let log=session.get('log',[]);if(!Array.isArray(log))log=[];
log=log.slice(-200);
const button=(action,label,extra='')=>`<button type="button" data-qa-action="${action}" ${extra}>${label}</button>`;
const section=(title,body)=>`<details open><summary>${title}</summary>${body}</details>`;
const panel=document.createElement('aside');panel.id='qa-panel';panel.setAttribute('aria-label','Development effect QA');panel.hidden=!session.get('open',false);
panel.innerHTML=`<div class="qa-head"><h2>DEVELOPMENT QA</h2><div>${button('dock','Move left')}${button('minimize','Minimize')}${button('close','Close')}</div></div><p class="qa-note">Ctrl / Cmd + Shift + K. Real production controllers. Reduced motion remains respected.</p>${button('exaggerate','Exaggerate Visual Difference','aria-pressed="false"')}<p id="qa-message" role="status"></p>
${section('COLLAPSE',COLLAPSE_MODES.map(mode=>button('force-'+mode,'Force '+mode)).join('')+button('ordinary','NORMAL ornaments')+button('anomalous','ANOMALOUS ornaments')+'<pre id="qa-mounts"></pre><details><summary>Production component specimens (when absent on this page)</summary><div class="qa-stage collapse-lab">'+COLLAPSE_MODES.map(mode=>`<div><span>${mode}</span>${CollapseEffect({mode,id:'qa-'+mode.toLowerCase()})}</div>`).join('')+'</div></details>')}
${section('AUTOMATIC COLLAPSE','<pre id="qa-scheduler"></pre>'+button('next','Trigger Next Event Now')+button('pause','Pause Scheduler')+button('resume','Resume Scheduler'))}
${section('CRESSON FLOWER','<pre id="qa-flower"></pre>'+button('activate','Activation +1')+button('second','Force second-response')+button('level','Force Level I')+button('sequence-reset','Reset sequence')+button('cooldown-reset','Reset cooldown')+'<a class="qa-link" href="/about">Open About</a>')}
${section('LEVEL I','<pre id="qa-level"></pre>'+button('level','ENTER LEVEL I')+button('exit','EXIT LEVEL I')+button('normal','NORMAL')+button('level','LEVEL I'))}
${section('PERSONA CRESSON','<pre id="qa-persona"></pre>'+button('persona-hit','Highlight Hit Area','aria-pressed="false"')+button('persona-activate','Activation +1')+button('persona-response','Force Flower Response')+button('persona-level','Force Persona Level I Response')+button('persona-reset','Reset Persona Response')+button('persona-alignment','Show Overlay Alignment','aria-pressed="false"'))}
${section('ARCHIVE','<pre id="qa-archive"></pre>'+button('archive-force','Force ?')+button('archive-restore','Restore Count')+'<a class="qa-link" href="/archive">Open Archive</a>')}
${section('TRANSITIONS','<pre id="qa-transitions"></pre><a class="qa-link" data-qa-transition="normal">Test Normal Transition</a><a class="qa-link" data-qa-transition="rare">Force Rare Transition</a>')}
${section('ENVIRONMENT','<a class="qa-link" href="/404">Show 404 Footprint Pattern</a><a class="qa-link" href="/void">Open /void</a>'+button('missing','Highlight Missing Footprint','aria-pressed="false"')+button('impossible','Highlight Impossible Footprint','aria-pressed="false"'))}
${section('EVENT LOG','<p class="qa-note">Time · effect · component · trigger · phase · duration. Latest 200; retained across development navigations.</p><pre id="qa-log" class="qa-log" tabindex="0" aria-label="Actual effect event log"></pre>'+button('clear-log','Clear log'))}`;
document.body.append(panel);
const $=id=>panel.querySelector('#qa-'+id);
const format=event=>`${new Date(event.timestamp).toLocaleTimeString()} — ${event.effect} | ${event.component} | ${event.trigger} | ${event.phase} | ${event.duration}ms${event.detail?' | '+event.detail:''}`;
function renderLog(){const node=$('log'),atBottom=node.scrollHeight-node.scrollTop-node.clientHeight<35;node.textContent=log.map(format).join('\n');if(atBottom)node.scrollTop=node.scrollHeight;}
observeEffects(event=>{log.push(event);log=log.slice(-200);session.set('log',log);renderLog();});
renderLog();
const say=text=>$('message').textContent=text;
const realElements=()=>[...document.querySelectorAll('[data-collapse]')].filter(el=>!panel.contains(el));
const targetFor=mode=>realElements().find(el=>el.dataset.collapse===mode)||panel.querySelector('#qa-'+mode.toLowerCase());
let exaggerated=false;
function exaggerate(enabled){
  exaggerated=enabled;collapse.debugExaggeration=enabled;document.documentElement.toggleAttribute('data-qa-exaggerate',enabled);
  if(enabled)document.documentElement.dataset.qaExaggerate='true';
  session.set('exaggerate',enabled);panel.querySelector('[data-qa-action="exaggerate"]').setAttribute('aria-pressed',String(enabled));
  if(!enabled)for(const el of [...realElements(),...panel.querySelectorAll('[data-collapse]')]){
    collapse.finish(el);for(const name of ['--collapse-x','--collapse-y','--collapse-ghost-opacity','--collapse-from','--collapse-to'])el.style.removeProperty(name);delete el.dataset.collapsePosition;
  }
  effectEvent('Exaggeration','QA panel','qa','completed',0,enabled?'DEV ONLY: 20px / 0.5 echo / 90 SVG-unit relocation / 160px strip + 1500ms':'production intensity restored');
}
exaggerate(session.get('exaggerate',false)&&!panel.hidden);
function status(){
  const scheduler=collapse.snapshot(),state=story.snapshot();
  $('scheduler').textContent=`State: ${scheduler.state}\nEligible time remaining: ${scheduler.remaining===null?'—':(scheduler.remaining/1000).toFixed(1)+'s'}\nEligible visible decorations: ${scheduler.eligible.join(', ')||'none'}\nAutomatic event count: ${scheduler.events} / 3`;
  $('mounts').textContent=COLLAPSE_MODES.map(mode=>`${mode}: ${realElements().filter(el=>el.dataset.collapse===mode).map(el=>el.id).join(', ')||'not mounted here → same-component specimen'}`).join('\n');
  $('flower').textContent=`Mounted: ${state.flowerMounted}\nInteraction count: ${state.count}\nSince last activation: ${state.sinceLast===null?'never':(state.sinceLast/1000).toFixed(1)+'s'}\nCooldown: ${state.cooldown>0?(state.cooldown/1000).toFixed(1)+'s':'ready'}`;
  $('level').textContent=`${state.levelActive?'ACTIVE':'INACTIVE'}\nRemaining: ${(state.remaining/1000).toFixed(1)}s\nComparison: ${state.levelActive?'LEVEL I':'NORMAL'}${collapse.motion.matches?'\nReduced motion: static visual states':''}`;
  $('persona').textContent=`Mounted: ${state.personaMounted}\nShared interaction count: ${state.count}\nLevel I: ${state.levelActive?'ACTIVE':'INACTIVE'}`;
  $('archive').textContent=`Mounted: ${state.archiveMounted}\nVisit count: ${state.visits}\nVisit eligibility: ${state.archiveVisitEligible}\nProbability: 4%; actual draw result: ${state.archiveEligible}\nCurrent count: ${state.archiveValue??'not mounted'}`;
  $('transitions').textContent=`Cross-document API: ${'onpageswap' in window&&'onpagereveal' in window?'available':'not supported (ordinary navigation)'}\nMotion: ${collapse.motion.matches?'reduced':'normal'}\nResidual: ${exaggerated?'160px / +1500ms (DEV)':'120px / +450ms (production)'}`;
  for(const action of ['activate','second'])panel.querySelector(`[data-qa-action="${action}"]`).disabled=!state.flowerMounted;
  for(const action of ['persona-hit','persona-activate','persona-response','persona-level','persona-reset','persona-alignment'])panel.querySelector(`[data-qa-action="${action}"]`).disabled=!state.personaMounted;
  for(const action of ['archive-force','archive-restore'])panel.querySelector(`[data-qa-action="${action}"]`).disabled=!state.archiveMounted;
}
let ticker;
function setOpen(open){panel.hidden=!open;session.set('open',open);clearInterval(ticker);if(open){status();ticker=setInterval(status,150);}else{exaggerate(false);removeHighlights();} }
function removeHighlights(){clearPersonaGuides();document.querySelectorAll('[data-qa-footprint-marker]').forEach(el=>el.remove());panel.querySelectorAll('[data-qa-action="missing"],[data-qa-action="impossible"]').forEach(el=>el.setAttribute('aria-pressed','false'));}
function highlight(kind){
  const trails=[...document.querySelectorAll('.uncertain-footprints')];
  if(!trails.length){say('Footprints are not mounted here. Open 404 or /void.');return;}
  const existing=document.querySelector(`[data-qa-footprint-marker="${kind}"]`);
  if(existing){document.querySelectorAll(`[data-qa-footprint-marker="${kind}"]`).forEach(el=>el.remove());panel.querySelector(`[data-qa-action="${kind}"]`).setAttribute('aria-pressed','false');return;}
  for(const trail of trails){const group=document.createElementNS('http://www.w3.org/2000/svg','g');group.dataset.qaFootprintMarker=kind;
    // Annotation only: the production footprint geometry is never changed or recreated.
    group.innerHTML=kind==='missing'?'<rect class="qa-footprint-marker" x="43" y="180" width="17" height="25"/><text class="qa-footprint-label" x="0" y="175">absent left step</text>':'<rect class="qa-footprint-marker" x="43" y="16" width="17" height="25"/><text class="qa-footprint-label" x="0" y="12">distant continuation</text>';
    trail.append(group);
  }
  panel.querySelector(`[data-qa-action="${kind}"]`).setAttribute('aria-pressed','true');
  effectEvent('Footprint annotation',kind,'qa','completed',0,'debug overlay only');
}
function clearPersonaGuides(){
  for(const kind of ['hit','alignment']){delete document.documentElement.dataset['qaPersona'+(kind==='hit'?'Hit':'Alignment')];panel.querySelector('[data-qa-action="persona-'+kind+'"]').setAttribute('aria-pressed','false');}
}
function personaGuide(kind){const key='qaPersona'+(kind==='hit'?'Hit':'Alignment');const enabled=document.documentElement.dataset[key]!=='true';if(enabled)document.documentElement.dataset[key]='true';else delete document.documentElement.dataset[key];panel.querySelector('[data-qa-action="persona-'+kind+'"]').setAttribute('aria-pressed',String(enabled));}
panel.addEventListener('click',event=>{
  const transition=event.target.closest('[data-qa-transition]');
  if(transition){story.forceNextTransition(transition.dataset.qaTransition==='rare');session.set('open',true);return;}
  const control=event.target.closest('[data-qa-action]');if(!control)return;
  const action=control.dataset.qaAction;
  if(action==='dock'){const left=panel.classList.toggle('qa-left');control.textContent=left?'Move right':'Move left';return;}
  if(action==='minimize'){const small=panel.classList.toggle('qa-minimized');control.textContent=small?'Expand':'Minimize';return;}
  if(action.startsWith('force-')){
    const mode=action.slice(6),target=targetFor(mode);const specimen=panel.contains(target);
    if(specimen)target.closest('details').open=true;else target.scrollIntoView({block:'center',behavior:'instant'});
    if(['ABSENCE','REPETITION'].includes(mode))collapse.setOrdinary(target,false,'qa force');else collapse.play(target,'qa force');
    say(`${mode}: ${specimen?'same production component in QA specimen':target.id}. ${['ABSENCE','REPETITION'].includes(mode)?'Static geometry; use NORMAL ornaments to compare.':''}`);
  } else {
    const actions={close:()=>setOpen(false),exaggerate:()=>exaggerate(!exaggerated),ordinary:()=>COLLAPSE_MODES.filter(m=>['ABSENCE','REPETITION'].includes(m)).forEach(m=>collapse.setOrdinary(targetFor(m),true,'qa comparison')),anomalous:()=>COLLAPSE_MODES.filter(m=>['ABSENCE','REPETITION'].includes(m)).forEach(m=>collapse.setOrdinary(targetFor(m),false,'qa comparison')),next:()=>{say(collapse.triggerNow()?'Actual scheduled event triggered.':'No event: see scheduler state and event log.');},pause:()=>collapse.pause(),resume:()=>collapse.resume(),activate:()=>story.activate(undefined,'qa activation'),second:()=>story.secondResponse(undefined,'qa force'),level:()=>story.enterLevel('qa force'),exit:()=>story.endLevel('cancelled'),normal:()=>story.endLevel('cancelled'),'sequence-reset':()=>story.resetSequence(),'cooldown-reset':()=>story.resetCooldown(),'persona-hit':()=>personaGuide('hit'),'persona-alignment':()=>personaGuide('alignment'),'persona-activate':()=>story.activatePersona(),'persona-response':()=>story.personaResponse(),'persona-level':()=>story.enterLevel('qa persona'),'persona-reset':()=>{story.resetPersona();clearPersonaGuides();},'archive-force':()=>story.setArchive(true,'qa force'),'archive-restore':()=>story.setArchive(false,'qa restore'),missing:()=>highlight('missing'),impossible:()=>highlight('impossible'),'clear-log':()=>{log=[];session.set('log',log);renderLog();}};
    actions[action]?.();
  }
  status();
});
for(const link of panel.querySelectorAll('[data-qa-transition]'))link.href=location.pathname==='/about'?'/archive':'/about';
document.addEventListener('keydown',event=>{if((event.ctrlKey||event.metaKey)&&event.shiftKey&&event.key.toLowerCase()==='k'&&!event.repeat){event.preventDefault();setOpen(panel.hidden);if(!panel.hidden)panel.querySelector('button').focus();}});
window.addEventListener('northline-qa-native',event=>{log=session.get('log',[...log,event.detail]).slice(-200);renderLog();});
for(const name of ['transitionrun','transitionend','transitioncancel'])document.addEventListener(name,event=>{
  if(event.target.closest?.('.cresson-flower'))effectEvent('Flower CSS '+event.propertyName,'CressonFlower','CSS state change',name,event.elapsedTime*1000);
},true);
window.addEventListener('pagehide',()=>clearInterval(ticker));
window.addEventListener('pageshow',event=>{if(event.persisted)setOpen(!panel.hidden);});
setOpen(!panel.hidden);
effectEvent('QA ready','panel','development','completed',0,'production functions connected; no simulated animations');
