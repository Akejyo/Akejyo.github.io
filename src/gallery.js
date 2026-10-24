const gallery = document.querySelector('.gallery-page');
if (gallery) {
  const photos = [...gallery.querySelectorAll('.gallery-photos [data-gallery-item]')];
  const select = gallery.querySelector('#gallery-album');
  const more = gallery.querySelector('.gallery-more');
  let limit = 24;
  function filter() {
    const matches = photos.filter(item => !select.value || item.dataset.album === select.value);
    const shown = new Set(matches.slice(0, limit));
    for (const item of photos) item.hidden = !shown.has(item);
    gallery.querySelector('#gallery-count').textContent = `${shown.size} of ${matches.length} photographs`;
    more.hidden = shown.size >= matches.length;
  }
  if (select) {
    gallery.querySelector('.gallery-tools').hidden = false;
    select.addEventListener('change', () => { limit = 24; filter(); });
    more.addEventListener('click', () => {
      const firstNew = photos.find(item => item.hidden && (!select.value || item.dataset.album === select.value));
      limit += 24; filter();
      firstNew?.querySelector('a').focus();
    });
    filter();
  }
  const dialog = gallery.querySelector('dialog');
  const image = dialog.querySelector('[data-gallery-full]');
  const previous = dialog.querySelector('[data-gallery-prev]');
  const next = dialog.querySelector('[data-gallery-next]');
  let links = [], index = 0, opener;
  function show() {
    const link = links[index];
    dialog.querySelector('[data-gallery-error]').hidden = true;
    dialog.querySelector('[data-gallery-original]').href = link.href;
    image.alt = link.querySelector('img').alt;
    image.src = link.href;
    dialog.querySelector('[data-gallery-caption]').textContent = link.dataset.caption;
    dialog.querySelector('[data-gallery-position]').textContent = `${index + 1} / ${links.length}`;
    previous.disabled = index === 0;
    next.disabled = index === links.length - 1;
  }
  image.addEventListener('error', () => { dialog.querySelector('[data-gallery-error]').hidden = false; });
  gallery.addEventListener('click', event => {
    const link = event.target.closest('[data-gallery-open]');
    if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || typeof dialog.showModal !== 'function') return;
    event.preventDefault();
    links = [...link.closest('section').querySelectorAll('[data-gallery-open]')].filter(a => !a.closest('figure').hidden);
    index = links.indexOf(link); opener = link; show(); dialog.showModal();
    document.documentElement.classList.add('gallery-viewer-open');
    dialog.querySelector('[data-gallery-close]').focus();
  });
  previous.addEventListener('click', () => { if (index > 0) { index--; show(); } });
  next.addEventListener('click', () => { if (index < links.length - 1) { index++; show(); } });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); previous.click(); }
    if (event.key === 'ArrowRight') { event.preventDefault(); next.click(); }
  });
  dialog.querySelector('[data-gallery-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => { document.documentElement.classList.remove('gallery-viewer-open'); opener?.focus(); });
}
