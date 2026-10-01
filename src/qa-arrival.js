// Served only by an explicitly development-mode server, before first paint.
try {
  if(sessionStorage.getItem('northline-qa-exaggerate')==='true')document.documentElement.dataset.qaExaggerate='true';
  if(document.documentElement.dataset.lingering==='true')document.documentElement.dataset.qaRare='true';
} catch {}
// pagereveal may precede DOMContentLoaded; observe it before the panel module loads.
for(const name of ['pageswap','pagereveal'])window.addEventListener(name,event=>{
  const started=Date.now();
  const record=(phase,detail='')=>{
    const entry={timestamp:Date.now(),effect:'Native transition',component:'environment-memory',trigger:name,phase,duration:Date.now()-started,detail};
    try {const entries=JSON.parse(sessionStorage.getItem('northline-qa-log'))||[];entries.push(entry);sessionStorage.setItem('northline-qa-log',JSON.stringify(entries.slice(-200)));}catch{}
    window.dispatchEvent(new CustomEvent('northline-qa-native',{detail:entry}));
  };
  if(!event.viewTransition){record('skipped','native transition unavailable');return;}
  record('started');
  event.viewTransition.finished.then(()=>record('completed'),()=>record('cancelled'));
});
