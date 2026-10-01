/** Original open diamond: the upper-right segment is intentionally absent. */
export function BrokenDiamond({ size = 24, className = '' } = {}) {
  return `<svg class="broken-diamond ${className}" width="${size}" height="${size}" viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false"><path d="M16 4 4 16 16 28 28 16" stroke="currentColor" stroke-width="1.3" stroke-linecap="square"/></svg>`;
}
export function TextilePattern() {
  return `<svg class="textile-pattern" viewBox="0 0 600 64" fill="none" aria-hidden="true" focusable="false">${Array.from({length:15},(_,i)=>`<path d="m${i*40+20} 12-20 20 20 20 20-20 M${i*40+20} 24l-8 8 8 8 8-8" stroke="currentColor" stroke-width="1"/>`).join('')}</svg>`;
}
export function ArticleMetadata() { return '<div class="article-meta"><span class="category">Field notes</span><span aria-hidden="true">/</span><time datetime="2026-01-18">18 January 2026</time><span aria-hidden="true">·</span><span>6 min read</span></div>'; }
export function ArticleCard() { return `<article class="article-card"><span class="eyebrow">Journal &nbsp; / &nbsp; 003</span><h3>The shape of silence</h3><p>On quiet landscapes, unfinished thoughts, and the things we choose to notice.</p><div class="card-bottom"><span>18 Jan 2026 · 6 min read</span><a href="#typography" aria-label="Explore the typography behind The shape of silence">↗</a></div></article>`; }
