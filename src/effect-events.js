// Passive instrumentation. With no subscriber (production), this is a no-op.
const subscribers=new Set();
export function observeEffects(listener){subscribers.add(listener);return ()=>subscribers.delete(listener);}
export function effectEvent(effect,component,trigger,phase,duration=0,detail='') {
  if(!subscribers.size)return;
  const event={timestamp:Date.now(),effect,component:component?.id||component?.dataset?.collapse||component||'page',trigger,phase,duration,detail};
  for(const listener of subscribers){try{listener(event);}catch{/* Observers must never affect production behavior. */}}
}
