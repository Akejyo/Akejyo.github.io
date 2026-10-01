// Only the atmospheric decoration participates. No scroll/input handlers or content transforms.
export function installEnvironment({doc=document,view=window}={}) {
  const surfaces=[...doc.querySelectorAll('[data-atmosphere]')];
  if(!surfaces.length)return {destroy(){}};
  const motion=view.matchMedia('(prefers-reduced-motion: reduce)');
  const html=doc.documentElement;
  let timer=null,departed=false,rate=1;
  const animations=()=>surfaces.flatMap(surface=>surface.getAnimations({subtree:true}));
  const stop=()=>{if(timer!==null)view.clearTimeout(timer);timer=null;};
  const apply=value=>{rate=value;for(const animation of animations()){
    if(value===0)animation.pause();else {animation.updatePlaybackRate(value);animation.play();}
  }};
  const sync=()=>{
    stop();
    if(motion.matches){delete html.dataset.environmentMotion;return;}
    html.dataset.environmentMotion='ready';
    if(doc.hidden||departed){apply(0);return;}
    const target=html.dataset.collapseLevel==='1'?0:1;
    const from=rate,start=view.performance.now(),duration=target===0?700:1000;
    if(from===target){apply(target);return;}
    const step=()=>{const progress=Math.min(1,(view.performance.now()-start)/duration);apply(from+(target-from)*progress);if(progress<1)timer=view.setTimeout(step,50);else timer=null;};
    step();
  };
  const hide=()=>{departed=true;stop();apply(0);};
  const show=()=>{departed=false;sync();};
  doc.addEventListener('collapselevelchange',sync);doc.addEventListener('visibilitychange',sync);
  motion.addEventListener('change',sync);view.addEventListener('pagehide',hide);view.addEventListener('pageshow',show);
  sync();
  return {destroy(){stop();apply(0);delete html.dataset.environmentMotion;doc.removeEventListener('collapselevelchange',sync);doc.removeEventListener('visibilitychange',sync);motion.removeEventListener('change',sync);view.removeEventListener('pagehide',hide);view.removeEventListener('pageshow',show);}};
}
