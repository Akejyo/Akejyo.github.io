// Before first paint: carry a rare ornament snapshot across one navigation.
try {
  const raw=sessionStorage.getItem('northline-linger');
  sessionStorage.removeItem('northline-linger');
  if(raw){const marker=JSON.parse(raw);if(marker.path.replace(/\/(?=\?|$)/,'')===(location.pathname+location.search).replace(/\/(?=\?|$)/,'')&&Date.now()-marker.time<10000&&Date.now()>=marker.time&&!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.dataset.lingering='true';}
} catch { /* Storage is optional; ordinary navigation always works. */ }
