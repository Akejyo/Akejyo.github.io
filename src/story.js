import { effectEvent } from './effect-events.js';
import { installEnvironment } from './environment.js';
// Deliberate, paced activations. Rapid clicks and long pauses reset the sequence.
export class FlowerSequence {
  constructor(){this.count=0;this.last=-Infinity;this.until=0;this.cooldown=0;}
  interact(now){
    if(now<this.cooldown)return 'quiet';
    const gap=now-this.last;
    this.count=gap>=450&&gap<=4000?this.count+1:1;this.last=now;
    if(this.count===5){this.count=0;this.until=now+10000;this.cooldown=now+70000;return 'level';}
    return this.count===2?'listen':this.count===3?'rings':this.count===4?'crimson':'quiet';
  }
  reset(){this.count=0;this.last=-Infinity;this.until=0;}
}
export function rememberVisit(storage){
  try {const previous=Number(storage.getItem('northline-visits'));const visits=Math.min(10000,(Number.isFinite(previous)&&previous>=0?previous:0)+1);storage.setItem('northline-visits',String(visits));return visits;}catch{return 1;}
}
export const archiveUncertainty=(visits,random=Math.random)=>visits>=3&&random()<.04;

export function installStory({doc=document,view=window,random=Math.random}={}) {
  const html=doc.documentElement,sequence=new FlowerSequence(),timers=new Set(),removers=[];
  const motion=view.matchMedia('(prefers-reduced-motion: reduce)');
  const environment=installEnvironment({doc,view});
  let storage;try{storage=view.localStorage;}catch{}
  const visits=rememberVisit(storage),flowers=[...doc.querySelectorAll('[data-cresson]')];
  const counter=doc.querySelector('[data-archive-counter]'),originalCount=counter?.textContent;
  const personaFlower=doc.querySelector('[data-persona-cresson]');
  let levelTimer,levelUntil=0,levelTrigger='sequence';
  const secondRuns=new Map();
  const later=(fn,delay)=>{const id=view.setTimeout(()=>{timers.delete(id);fn();},delay);timers.add(id);return id;};
  const cancel=id=>{view.clearTimeout(id);timers.delete(id);};
  const now=()=>view.performance.now();
  const listen=(target,event,fn)=>{target?.addEventListener(event,fn);removers.push(()=>target?.removeEventListener(event,fn));};
  const signal=active=>doc.dispatchEvent(new view.CustomEvent('collapselevelchange',{detail:{active}}));
  const endSecond=(phase='completed')=>{
    for(const [timer,run] of secondRuns){cancel(timer);run.flower.classList.remove(run.className);effectEvent(run.label,run.flower.id||'CressonFlower',run.trigger,phase,1200);}secondRuns.clear();
  };
  const secondResponse=(flower=flowers[0],trigger='sequence',response='listen')=>{
    if(!flower){effectEvent('Second response','CressonFlower',trigger,'blocked',0,'not mounted');return false;}
    endSecond('cancelled');
    const className=response==='rings'?'is-attending':response==='crimson'?'is-answering':'is-listening';
    const label=response==='rings'?'Third response':response==='crimson'?'Fourth response':'Second response';
    for(const target of flowers){
      target.classList.add(className);effectEvent(label,target.id||'CressonFlower',trigger,'started',1200);
      const timer=later(()=>{target.classList.remove(className);secondRuns.delete(timer);effectEvent(label,target.id||'CressonFlower',trigger,'completed',1200);},1200);
      secondRuns.set(timer,{flower:target,trigger,className,label});
    }
    return true;
  };
  const endLevel=(phase='completed')=>{
    cancel(levelTimer);const active=html.dataset.collapseLevel==='1';delete html.dataset.collapseLevel;levelUntil=0;signal(false);
    if(active)effectEvent('Level I','environment',levelTrigger,phase,10000);
  };
  const enterLevel=(trigger='sequence')=>{
    if(html.dataset.collapseLevel==='1')endLevel('cancelled');
    endSecond('cancelled');doc.querySelectorAll('.is-listening').forEach(el=>el.classList.remove('is-listening'));
    html.dataset.collapseLevel='1';levelUntil=now()+10000;levelTrigger=trigger;signal(true);
    effectEvent('Level I','environment',trigger,'started',10000);levelTimer=later(()=>endLevel(),10000);
  };
  const activate=(flower=flowers[0],trigger='pointer/keyboard')=>{
    if(!flower){effectEvent('Flower activation','CressonFlower',trigger,'blocked',0,'not mounted');return false;}
    const at=now(),blocked=at<sequence.cooldown,response=sequence.interact(at);
    effectEvent(`Flower activation ${response==='level'?5:sequence.count}`,'CressonFlower',trigger,blocked?'blocked':'completed',0,blocked?'cooldown':response);
    if(['listen','rings','crimson'].includes(response))secondResponse(flower,trigger,response);
    if(response==='level')enterLevel(trigger);return true;
  };
  for(const flower of flowers)listen(flower,'click',()=>activate(flower));
  const setArchive=(anomalous,trigger='probability')=>{
    if(!counter){effectEvent('Archive counter','archive',trigger,'blocked',0,'not mounted');return false;}
    counter.textContent=anomalous?'?':originalCount;effectEvent('Archive counter','archive',trigger,'completed',0,anomalous?'?':'restored');return true;
  };
  const archiveEligible=!!counter&&archiveUncertainty(visits,random);
  if(archiveEligible)setArchive(true);
  const prepareTransition=(target,forced=null,trigger='navigation')=>{
    const linger=!motion.matches&&(forced===null?visits>=3&&random()<.035:forced);
    if(linger)html.dataset.lingering='true';else delete html.dataset.lingering;
    if(linger)html.dataset.lingerDeparture='true';else delete html.dataset.lingerDeparture;
    try {view.sessionStorage.removeItem('northline-linger');if(linger)view.sessionStorage.setItem('northline-linger',JSON.stringify({path:target.pathname+target.search,time:Date.now()}));}catch{}
    effectEvent(linger?'Rare transition':'Normal transition','environment-memory',trigger,'prepared',linger?700:250,motion.matches?'reduced motion':'native cross-document transition');return linger;
  };
  let nextTransition=null;
  listen(doc,'click',event=>{
    const link=event.target.closest?.('a[href]');
    if(!link||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||link.hasAttribute('download')||link.target)return;
    const target=new URL(link.href,view.location.href);
    if(target.origin!==view.location.origin||(target.pathname===view.location.pathname&&target.search===view.location.search))return;
    prepareTransition(target,nextTransition,nextTransition===null?'navigation':'qa navigation');nextTransition=null;
  });
  const clear=()=>{
    for(const id of timers)view.clearTimeout(id);timers.clear();sequence.reset();delete html.dataset.lingering;delete html.dataset.lingerDeparture;
    endSecond('cancelled');doc.querySelectorAll('.is-listening').forEach(el=>el.classList.remove('is-listening'));endLevel('cancelled');
  };
  listen(doc,'visibilitychange',()=>{if(doc.hidden)clear();});listen(view,'pagehide',clear);
  listen(view,'pageshow',event=>{if(event.persisted)clear();else later(()=>{delete html.dataset.lingering;},900);});
  listen(motion,'change',()=>{if(motion.matches){delete html.dataset.lingering;delete html.dataset.lingerDeparture;}});
  return {
    activate,secondResponse,enterLevel,endLevel,setArchive,
    activatePersona(trigger='qa activation'){return activate(personaFlower,trigger);},
    personaResponse(trigger='qa force'){return secondResponse(personaFlower,trigger,'crimson');},
    resetPersona(){endSecond('cancelled');endLevel('cancelled');sequence.reset();},
    resetSequence(){sequence.reset();effectEvent('Sequence reset','CressonFlower','qa','completed');},
    resetCooldown(){sequence.cooldown=0;effectEvent('Cooldown reset','CressonFlower','qa','completed');},
    forceNextTransition(rare){nextTransition=rare;},
    snapshot(){const at=now();return {visits,flowerMounted:flowers.length,count:sequence.count,sinceLast:Number.isFinite(sequence.last)?at-sequence.last:null,cooldown:Math.max(0,sequence.cooldown-at),levelActive:html.dataset.collapseLevel==='1',remaining:Math.max(0,levelUntil-at),personaMounted:!!personaFlower,archiveMounted:!!counter,archiveVisitEligible:visits>=3,archiveEligible,archiveValue:counter?.textContent};},
    destroy(){clear();environment.destroy();removers.forEach(remove=>remove());}
  };
}
export const storyController=typeof document!=='undefined'?installStory():null;

