import { effectEvent } from './effect-events.js';
// One scheduler for the whole page. No animation loop, scroll handler or WebGL.
export const COLLAPSE_TIMING = Object.freeze({ firstMin:4000, firstMax:7000, min:15000, max:30000, cooldown:30000, maxEvents:3 });
const protectedContent = '.prose, .article-heading, .article-toc, nav, header, a, button, form, input, select, textarea, pre, code, table, math, [contenteditable]';
const animatedModes = new Set(['DISPLACEMENT','NONLINEARITY']);

export function isSafeDecoration(element) {
  return element?.tagName?.toLowerCase()==='svg' && element.getAttribute('aria-hidden')==='true'
    && element.classList.contains('collapse-effect') && !element.closest(protectedContent)
    && !element.querySelector('text, foreignObject, a, image');
}

export class CollapseController {
  constructor({root=document, view=window, random=Math.random, clock=globalThis}={}) {
    this.root=root; this.view=view; this.random=random; this.clock=clock;
    this.elements=[...root.querySelectorAll('[data-collapse]')].filter(isSafeDecoration);
    this.motion=view.matchMedia('(prefers-reduced-motion: reduce)');
    this.visible=new Set(); this.running=new Map(); this.timer=null; this.events=0; this.destroyed=false; this.pageActive=true;
    this.handlers=[];
    this.paused=false;this.nextAt=null;this.debugExaggeration=false;
    this.remaining=null;this.exposureStarted=null;this.cooldowns=new Map();
    this.observer=typeof view.IntersectionObserver==='function' ? new view.IntersectionObserver(entries=>{
      this.clearSchedule();
      for(const entry of entries){if(entry.isIntersecting&&entry.intersectionRatio>=.5)this.visible.add(entry.target);else {this.visible.delete(entry.target);this.finish(entry.target);}}
      if(!this.candidates().length)this.clearSchedule();
      this.schedule();
    },{threshold:.5}) : null;
    this.onMotion=()=>{this.cancelAll();this.syncMotion();this.schedule();};
    this.onVisibility=()=>{if(root.hidden)this.cancelAll();else this.schedule();};
    this.onPageHide=()=>{this.pageActive=false;this.cancelAll();};
    this.onPageShow=()=>{this.pageActive=true;this.schedule();};
    this.onLevel=event=>{if(event.detail.active){for(const element of this.elements)element.style.setProperty('--level-line-shift',`${4/(Math.abs(element.getScreenCTM?.()?.a)||1)}px`);this.cancelAll();}else this.schedule();};
    this.onInteraction=()=>{this.clearSchedule();this.schedule();};
    for(const name of ['selectionchange','focusin','focusout'])root.addEventListener(name,this.onInteraction);
    root.addEventListener('collapselevelchange',this.onLevel);
    this.motion.addEventListener('change',this.onMotion);
    root.addEventListener('visibilitychange',this.onVisibility);
    view.addEventListener('pagehide',this.onPageHide);
    view.addEventListener('pageshow',this.onPageShow);
    this.syncMotion();
    for(const element of this.elements)if(animatedModes.has(element.dataset.collapse)&&!element.closest('.collapse-lab'))this.observer?.observe(element);
    this.bindPreview();
  }
  range(min,max){return Math.round(min+this.random()*(max-min));}
  isStatic(element){return this.motion.matches||!!element.closest('.collapse-lab.is-static');}
  syncMotion(){for(const element of this.elements){element.classList.toggle('is-static',this.isStatic(element));element.dataset.collapseState=this.isStatic(element)?'static':'rest';}}
  now(){return this.clock.now?.()??this.view.performance?.now()??Date.now();}
  visibleCandidates(){return [...this.visible].filter(element=>isSafeDecoration(element)&&animatedModes.has(element.dataset.collapse)&&!this.isStatic(element)&&!element.closest('.collapse-lab'));}
  candidates(){return this.visibleCandidates().filter(element=>(this.cooldowns.get(element)||0)<=this.now());}
  busy(){return !!(this.root.activeElement?.closest('a,button,input,textarea,select,[contenteditable]')||this.view.getSelection()?.toString());}
  clearSchedule(){
    if(this.exposureStarted!==null)this.remaining=Math.max(0,this.remaining-(this.now()-this.exposureStarted));
    if(this.timer!==null)this.clock.clearTimeout(this.timer);this.timer=null;this.nextAt=null;this.exposureStarted=null;
  }
  snapshot(){return {state:this.destroyed?'destroyed':this.paused?'paused':!this.pageActive||this.root.hidden?'hidden':this.motion.matches?'reduced motion':this.root.documentElement?.dataset.collapseLevel==='1'?'Level I':this.events>=COLLAPSE_TIMING.maxEvents?'event limit reached':!this.visibleCandidates().length?'waiting for visible decoration':!this.candidates().length?'ornament cooldown':this.busy()?'reader interacting':this.timer!==null?'scheduled':'idle',nextAt:this.nextAt,remaining:this.remaining===null?null:Math.max(0,this.remaining-(this.exposureStarted===null?0:this.now()-this.exposureStarted)),eligible:this.candidates().map(el=>el.id||el.dataset.collapse),events:this.events};}
  pause(){this.paused=true;this.clearSchedule();effectEvent('Scheduler','page','qa','paused');}
  resume(){this.paused=false;effectEvent('Scheduler','page','qa','resumed');this.schedule();}
  triggerNext(trigger='automatic',ignoreFocus=false){
    const candidates=this.candidates();
    const busy=!ignoreFocus&&(this.root.activeElement?.closest('a,button,input,textarea,select,[contenteditable]')||this.view.getSelection()?.toString());
    if(this.destroyed||!this.pageActive||this.root.hidden||this.motion.matches||this.root.documentElement?.dataset.collapseLevel==='1'||this.events>=COLLAPSE_TIMING.maxEvents||busy||!candidates.length){effectEvent('Scheduler','page',trigger,'blocked',0,busy?'reader interacting':this.snapshot().state);return false;}
    const element=candidates[Math.min(candidates.length-1,Math.floor(this.random()*candidates.length))];
    if(this.play(element,trigger)){this.events++;this.cooldowns.set(element,this.now()+COLLAPSE_TIMING.cooldown);this.remaining=null;return true;}return false;
  }
  triggerNow(){this.clearSchedule();const played=this.triggerNext('qa scheduler',true);this.schedule();return played;}
  setOrdinary(element,ordinary,trigger='specimen'){
    if(!isSafeDecoration(element))return false;
    element.classList.toggle('is-ordinary',ordinary);
    effectEvent(element.dataset.collapse,element,trigger,'completed',0,ordinary?'ordinary geometry':'anomalous geometry');return true;
  }
  schedule(){
    if(this.paused||this.destroyed||!this.pageActive||this.root.documentElement?.dataset.collapseLevel==='1'||this.timer!==null||this.events>=COLLAPSE_TIMING.maxEvents||this.root.hidden||this.motion.matches||!this.visibleCandidates().length)return;
    if(this.remaining===null)this.remaining=this.events?this.range(COLLAPSE_TIMING.min,COLLAPSE_TIMING.max):this.range(COLLAPSE_TIMING.firstMin,COLLAPSE_TIMING.firstMax);
    const available=this.candidates().length>0;
    const counting=available&&!this.busy();
    const delay=counting?this.remaining:available?1000:Math.max(1,Math.min(...this.visibleCandidates().map(el=>this.cooldowns.get(el)-this.now())));
    if(counting){this.exposureStarted=this.now();this.nextAt=Date.now()+delay;}
    this.timer=this.clock.setTimeout(()=>{
      this.clearSchedule();
      if(counting)this.triggerNext();
      this.schedule();
    },delay);
  }
  play(element,trigger='direct'){
    if(this.destroyed||this.root.hidden||!isSafeDecoration(element)||!animatedModes.has(element.dataset.collapse))return false;
    this.finish(element);
    if(this.isStatic(element)){
      if(this.debugExaggeration&&element.dataset.collapse==='DISPLACEMENT'){const scale=Math.abs(element.getScreenCTM?.()?.a)||1;element.style.setProperty('--collapse-x',`${20/scale}px`);element.style.setProperty('--collapse-y','0px');element.style.setProperty('--collapse-ghost-opacity','.5');}
      element.classList.add('is-static');element.dataset.collapseState='static';effectEvent(element.dataset.collapse,element,trigger,'static',0,'Reduced motion or specimen static mode');return false;
    }
    const nonlinear=element.dataset.collapse==='NONLINEARITY';
    const distance=this.debugExaggeration?90:36;
    const position=Number(element.dataset.collapsePosition||distance);
    const from=this.debugExaggeration?(position===0?0:distance):position;const to=from===0?distance:0;
    let duration=900;
    if(nonlinear){element.style.setProperty('--collapse-from',`${from}px`);element.style.setProperty('--collapse-to',`${to}px`);}
    else {const scale=Math.abs(element.getScreenCTM?.()?.a)||1;duration=this.range(120,300);const offset=this.range(4,8)*(this.random()<.5?-1:1);element.style.setProperty('--collapse-x',`${(this.debugExaggeration?20:offset)/scale}px`);element.style.setProperty('--collapse-y','0px');const echo=this.range(8,20)/100;element.style.setProperty('--collapse-ghost-opacity',String(this.debugExaggeration?.5:echo));}
    element.classList.add('is-anomalous');element.dataset.collapseState='active';
    const timer=this.clock.setTimeout(()=>this.finish(element,true),duration);
    this.running.set(element,{timer,to,nonlinear,trigger,duration,started:Date.now()});effectEvent(element.dataset.collapse,element,trigger,'started',duration,this.debugExaggeration?'DEV exaggeration':'production values');return true;
  }
  finish(element,settle=false){
    const running=this.running.get(element);if(!running)return;
    this.clock.clearTimeout(running.timer);
    if(settle&&running.nonlinear){element.dataset.collapsePosition=String(running.to);element.style.setProperty('--collapse-from',`${running.to}px`);}
    element.classList.remove('is-anomalous');element.dataset.collapseState=this.isStatic(element)?'static':'rest';this.running.delete(element);
    effectEvent(element.dataset.collapse,element,running.trigger,settle?'completed':'cancelled',running.duration,`elapsed ${Date.now()-running.started}ms`);
  }
  cancelAll(){this.clearSchedule();for(const element of [...this.running.keys()])this.finish(element);}
  listen(element,event,handler){element.addEventListener(event,handler);this.handlers.push(()=>element.removeEventListener(event,handler));}
  bindPreview(){
    for(const lab of this.root.querySelectorAll('.collapse-lab')){
      const status=lab.querySelector('[data-collapse-status]');
      const toggle=lab.querySelector('[data-collapse-static]');
      if(toggle)this.listen(toggle,'click',()=>{const enabled=toggle.getAttribute('aria-pressed')!=='true';toggle.setAttribute('aria-pressed',String(enabled));lab.classList.toggle('is-static',enabled);for(const element of this.elements.filter(element=>element.closest('.collapse-lab')===lab))this.finish(element);this.syncMotion();status.textContent=enabled||this.motion.matches?'Static variants. No decorative motion.':'System motion preference is respected.';});
      for(const button of lab.querySelectorAll('[data-collapse-preview]'))this.listen(button,'click',()=>{
        const element=this.root.getElementById(button.dataset.collapsePreview);
        if(!this.elements.includes(element)||element.closest('.collapse-lab')!==lab)return;
        if(animatedModes.has(element.dataset.collapse)){this.play(element);status.textContent=this.isStatic(element)?'Reduced motion: a static spatial variant.':`${element.dataset.collapse}: one decorative event.`;}
        else {const ordinary=!element.classList.contains('is-ordinary');this.setOrdinary(element,ordinary);button.setAttribute('aria-pressed',String(ordinary));status.textContent=ordinary?'Ordinary form.':'Anomalous form; all textual information is unchanged.';}
      });
    }
  }
  destroy(){this.destroyed=true;this.cancelAll();this.observer?.disconnect();this.motion.removeEventListener('change',this.onMotion);this.root.removeEventListener('collapselevelchange',this.onLevel);this.root.removeEventListener('visibilitychange',this.onVisibility);for(const name of ['selectionchange','focusin','focusout'])this.root.removeEventListener(name,this.onInteraction);this.view.removeEventListener('pagehide',this.onPageHide);this.view.removeEventListener('pageshow',this.onPageShow);this.handlers.forEach(remove=>remove());}
}

export const collapseController=typeof window!=='undefined'&&typeof document!=='undefined'?new CollapseController():null;
