import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { loadPosts } from '../src/content.js';
import { expeditions } from '../src/site.js';
import { readFile } from 'node:fs/promises';

process.env.PORT='0';
const {server}=await import('../server.js');
if(!server.listening)await once(server,'listening');
const base=`http://127.0.0.1:${server.address().port}`;
after(()=>new Promise(resolve=>server.close(resolve)));
const posts=await loadPosts();
const paths=['/','/records','/projects','/archive','/about','/void','/design-system',...posts.map(p=>'/records/'+p.slug),...expeditions.map(p=>'/projects/'+p.slug)];
const pages=new Map();

test('all public routes render and unknown routes return a real 404',async()=>{
  for(const path of paths){const response=await fetch(base+path);assert.equal(response.status,200,path);const html=await response.text();pages.set(path,html);assert.match(html,/<html lang="en">/);assert.match(html,/<title>[^<]+<\/title>/);if(path!=='/design-system')assert.equal((html.match(/<h1[ >]/g)||[]).length,1,path);}
  for(const path of ['/404','/not-a-place','/records/missing','/projects/missing','/package.json','/src/site.js','/.git/config']){const response=await fetch(base+path);assert.equal(response.status,404,path);assert.match(await response.text(),/THIS PLACE<br>DOES NOT EXIST/);}
});

test('internal links, images, styles, scripts and article anchors resolve',async()=>{
  const seen=new Set();
  for(const path of paths){const html=pages.get(path)||(await(await fetch(base+path)).text());for(const [,value] of html.matchAll(/(?:href|src)="([^"]+)"/g)){
    if(!value.startsWith('/')&&!value.startsWith('#'))continue;
    const target=new URL(value,base+path);const key=target.pathname+target.hash;if(seen.has(key))continue;seen.add(key);
    const response=await fetch(target);assert.equal(response.status,200,`${path} -> ${value}`);
    // The preserved design-system specimen mounts its sections in the browser.
    if(target.hash && target.pathname!=='/design-system'){const body=await response.text();assert.ok(body.includes(`id="${decodeURIComponent(target.hash.slice(1))}"`),`${path}: missing ${target.hash}`);}
  }}
});

test('MDX supports long prose, math, code, images, tables and footnotes',async()=>{
  assert.ok(posts.length);assert.equal(new Set(posts.map(p=>p.number)).size,posts.length);
  const [fixture]=await loadPosts(new URL('./fixtures/records/',import.meta.url));
  assert.ok(fixture.readingTime>=6);
  for(const pattern of [/<h3/, /<table/, /data-footnote-ref/, /data-footnote-backref/, /class="katex"/, /<math/, /language-python/, /language-bash/])assert.match(fixture.html,pattern);
  assert.doesNotMatch(fixture.html,/katex-error/);
  for(const pattern of [/<figure>/g, /<figcaption>/g, /alt="[^"]+"/g])assert.equal((fixture.html.match(pattern)||[]).length,3);
});

test('published records render valid editable metadata, mathematics and migrated assets',async()=>{
  const manifest=JSON.parse(await readFile(new URL('../docs/POST-MIGRATION.json',import.meta.url),'utf8'));

  // The migration manifest is historical provenance, not a lock on future edits/deletions.
  for(const post of posts){
    assert.ok(post.title.trim());assert.ok(post.html.trim());
    assert.match(post.date,/^\d{4}-\d{2}-\d{2}$/);assert.ok(Number.isFinite(Date.parse(post.date)));
    assert.equal(typeof post.category,'string');assert.ok(post.description);if(post.author)assert.equal(typeof post.author,'string');
    assert.doesNotMatch(post.html,/class="katex-error"|\$withBase\(/,post.slug);
    assert.ok(pages.get('/records/'+post.slug));
  }
  for(const post of posts)assert.doesNotMatch(post.html,/<(?:img|a)[^>]+(?:src|href)="[A-Z]:/i);
  for(const asset of manifest.assets)assert.equal((await fetch(base+asset.url)).status,200,asset.source);
});

test('environmental details preserve content and keep the hidden page out of navigation',()=>{
  const voidHtml=pages.get('/void');assert.match(voidHtml,/It was already here<br>before you arrived/);
  assert.equal((voidHtml.match(/data-cresson/g)||[]).length,1);assert.doesNotMatch(voidHtml,/<nav/);
  for(const [path,html] of pages){assert.doesNotMatch(html,/href="\/void"/,path);if(path.startsWith('/records/')){const prose=html.match(/<article class="prose"[\s\S]*?<\/article>/)?.[0];assert.ok(prose);assert.doesNotMatch(prose,/data-cresson|data-collapse|uncertain-footprints|persona-cresson/);}}
  assert.match(pages.get('/archive'),new RegExp(`aria-hidden="true"><span data-archive-counter>${posts.length}</span>`));
  assert.match(pages.get('/archive'),new RegExp(`class="story-sr-only">${posts.length} records collected`));
  assert.match(pages.get('/about'),/data-persona-cresson aria-label="Cresson flower"/);
});

test('search filters on the server, including no results and escaped input',async()=>{
  const category=posts[0].category;const count=posts.filter(p=>p.category===category).length;
  const code=await(await fetch(base+'/records?category='+encodeURIComponent(category))).text();assert.ok(code.includes(count+' record'+(count===1?'':'s')+'</span>'));assert.equal((code.match(/<article hidden /g)||[]).length,posts.length-count);
  const missing=await(await fetch(base+'/records?q=definitely-no-matching-record')).text();assert.match(missing,/0 records<\/span>/);assert.equal((missing.match(/<article hidden /g)||[]).length,posts.length);
  const escaped=await(await fetch(base+'/records?q=%22%3E%3Cscript%3E')).text();assert.doesNotMatch(escaped,/value=""><script>/);assert.match(escaped,/&quot;&gt;&lt;script&gt;/);
});

test('KaTeX local assets and HEAD requests are served correctly',async()=>{
  const css=await fetch(base+'/vendor/katex/katex.min.css');assert.equal(css.status,200);const text=await css.text();const font=text.match(/url\((?:["'])?(fonts\/[^)"']+\.woff2)/);assert.ok(font);assert.equal((await fetch(base+'/vendor/katex/'+font[1])).status,200);
  const head=await fetch(base+'/records/'+posts[0].slug,{method:'HEAD'});assert.equal(head.status,200);assert.equal(await head.text(),'');
  assert.equal((await fetch(base+'/',{method:'POST'})).status,405);
});

test('Persona composition supplies real responsive assets, a native flower target and isolated motion rules',async()=>{
  const html=pages.get('/about');
  assert.match(html,/<button[^>]+id="persona-cresson"[^>]+data-cresson data-persona-cresson/);
  assert.equal((html.match(/data-persona-cresson/g)||[]).length,1);
  assert.match(html,/media="\(max-width: 600px\)"[^>]+persona-mobile-640.jpg 640w, \/assets\/persona-mobile-960.jpg 960w/);
  assert.match(html,/width="5504" height="3072"/);
  for(const name of ['persona-960','persona-1600','persona-2400','persona-mobile-640','persona-mobile-960']){
    const response=await fetch(base+'/assets/'+name+'.jpg');assert.equal(response.status,200);assert.equal(response.headers.get('content-type'),'image/jpeg');
  }
  const css=await readFile(new URL('../src/story.css',import.meta.url),'utf8');
  const reduced=css.slice(css.lastIndexOf('@media(prefers-reduced-motion:reduce)'));
  assert.match(reduced,/\.persona-scene img[^}]+transition:none;animation:none/);
  assert.match(reduced,/\.persona-center-rings[^}]+transform:none/);
  assert.match(css,/picture:not\(\.persona-flower-light\) img \{ filter:saturate\(\.92\) brightness\(\.96\)/);
  assert.doesNotMatch(css,/qa-persona/);
  const controller=await readFile(new URL('../src/story.js',import.meta.url),'utf8');
  assert.doesNotMatch(controller,/irisResponse|eligibleEye|eyeTimer|forcePortraitEligible/);
});
