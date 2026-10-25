import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { loadPosts } from '../src/content.js';
import { expeditions } from '../src/site.js';
import { readFile } from 'node:fs/promises';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { galleryBody } from '../src/gallery-page.js';
import { galleryItems } from '../src/gallery-data.js';
import rehypeCodeHighlight from '../src/rehype-code-highlight.js';

process.env.PORT='0';
const {server}=await import('../server.js');
if(!server.listening)await once(server,'listening');
const base=`http://127.0.0.1:${server.address().port}`;
after(()=>new Promise(resolve=>server.close(resolve)));
const posts=await loadPosts();
const paths=['/','/records','/projects','/archive','/about','/gallery','/void','/design-system',...posts.map(p=>'/records/'+p.slug),...expeditions.map(p=>'/projects/'+p.slug)];
const pages=new Map();

test('home particle assets are served and the avatar icon and Explore link remain available', async()=>{
  const html = await (await fetch(base+'/')).text();
  assert.match(html,/id="home-particle-canvas"/);
  for (const title of ['Boundless Gift','Horizon Invitation','Dimensional Fluid','Old Fan','Golden Chalice','Hot Water Kettle']) assert.ok(html.includes(title));
  assert.equal((html.match(/data-home-caption=/g)||[]).length,6);
  assert.equal((html.match(/data-home-caption="[^"]+" hidden/g)||[]).length,5);
  const font = await fetch(base+'/assets/fonts/FarNorthRunes-Regular.woff');
  assert.equal(font.status,200);
  assert.match(font.headers.get('content-type'),/font\/woff/);
  assert.match(html,/<img class="particle-fallback"[^>]* hidden>/);
  assert.match(html,/<noscript><img class="particle-fallback"[^>]*><\/noscript>/);
  assert.match(html,/href="\/records">ENTER \/ EXPLORE/);
  assert.match(html,/href="\/assets\/avatar-icon.png"/);
  assert.doesNotMatch(html,/Between what exists/);
  for (const name of ['home','records','expeditions','archive','gallery','about']) {
    assert.equal((await fetch(base+`/assets/particles/${name}.png`)).status,200);
  }
  for (const name of ['home-particles','particle-engine','particle-motion','particle-sampling']) {
    assert.equal((await fetch(base+`/src/${name}.js`)).status,200);
  }
  assert.doesNotMatch(await (await fetch(base+'/records')).text(),/src="\/src\/home-particles.js"/);
});

test('gallery renders the complete catalog with thumbnail links and escaped captions', () => {
  const body = galleryBody();
  assert.equal((body.match(/data-gallery-open /g) || []).length, galleryItems.length);
  for (const item of galleryItems) {
    assert.ok(body.includes(`href="${item.src}"`));
    assert.ok(body.includes(`src="${item.thumbnail}"`));
    assert.ok(item.width > 0 && item.height > 0);
  }
  const fixture = galleryBody([{type:'photo',src:'/assets/forest.svg', title:'A <scene>', alt:'Trees & water', album:'<Forest>'}]);
  assert.match(fixture,/A &lt;scene&gt;/);
  assert.match(fixture,/Trees &amp; water/);
  assert.doesNotMatch(fixture,/<Forest>|<scene>/);
  assert.match(galleryBody([]),/The drawing collection will appear here/);
});

test('syntax highlighting supports requested languages and preserves exact copy text', () => {
  const samples = {
    c:'int main() { return 0; }', cpp:'int main() { return 0; }', 'C++':'int main() { return 0; }',
    'C#':'public class Example {}', Python:'def hello(): return "hi"', py:'print("hi")',
    html:'<div title="safe">Hello</div>', javascript:'const value = 1;', js:'const value = 1;', javescript:'const value = 1;',
    css:'body { color: red; }', java:'public class Example {}', rust:'fn main() {}',
    react:'const view = <div>Hello</div>;', jsx:'const view = <div>Hello</div>;',
    typescript:'const value: number = 1;', tyscript:'const value: number = 1;', ts:'const value: number = 1;', tsx:'const view = <div>Hello</div>;',
    json:'{"value": 1}', bash:'echo "$HOME"', sql:'SELECT * FROM records;', ini:'[section]\nkey=value',
    url:'https://example.com/path?q=value#section',
  };
  const text = node => node.type === 'text' ? node.value : (node.children || []).map(text).join('');
  for (const [language, sample] of Object.entries(samples)) {
    const source = sample + '\n';
    const code = {type:'element', tagName:'code', properties:{className:[`language-${language}`]}, children:[{type:'text',value:source}]};
    rehypeCodeHighlight()({type:'element',tagName:'pre',children:[code]});
    assert.ok(code.children.some(child=>child.type === 'element'), language);
    assert.equal(text(code), source, language);
  }
  for (const language of ['unknown-language', '']) {
    const code = {type:'element',tagName:'code',properties:{className:[`language-${language}`]},children:[{type:'text',value:'<script> & text'}]};
    const before = structuredClone(code);
    rehypeCodeHighlight()({type:'element',tagName:'pre',children:[code]});
    assert.deepEqual(code, before);
    code.properties.className = ['language-js'];
    const inline = structuredClone(code);
    rehypeCodeHighlight()({type:'element',tagName:'p',children:[code]});
    assert.deepEqual(code, inline);
  }
});

test('Markdown callouts preserve rich content and leave ordinary quotes and code alone', async()=>{
  const directory = await mkdtemp(join(tmpdir(), 'northline-callouts-'));
  try {
    const types = ['TIP','NOTE','WARNING','IMPORTANT','CAUTION'];
    const variants = types.flatMap(type=>[type, type.toLowerCase(), type[0] + type.slice(1).toLowerCase()]);
    const body = variants.map(type=>`> [!${type}]\n> A **bold** message with [a link](https://example.com).\n>\n> - A list item`).join('\n\n');
    await writeFile(join(directory,'callouts.mdx'), `---\ntitle: Callouts\nnumber: "999"\ndate: "2026-10-22"\ncategory: Test\ndescription: Callout fixture\n---\n${body}\n\n> Ordinary reference\n\n> [!UNKNOWN]\n> Unchanged\n\n\`\`\`md\n> [!NOTE]\n\`\`\`\n\n> [!NOTE]\n> Nested:\n>\n> > [!TIP]\n> > Inside\n`);
    const [post] = await loadPosts(pathToFileURL(directory + '/'));
    for (const type of types) {
      const count = (post.html.match(new RegExp(`class="article-callout article-callout-${type.toLowerCase()}"`, 'g')) || []).length;
      assert.equal(count, type === 'TIP' || type === 'NOTE' ? 4 : 3, type);
    }
    assert.equal((post.html.match(/class="article-callout-title"/g)||[]).length,17);
    assert.match(post.html, /<strong>bold<\/strong>/);
    assert.match(post.html, /<a href="https:\/\/example.com">a link<\/a>/);
    assert.match(post.html, /<li>A list item<\/li>/);
    assert.match(post.html, /<blockquote>\s*<p>Ordinary reference<\/p>/);
    assert.match(post.html, /<blockquote>\s*<p>\[!UNKNOWN\]/);
    assert.match(post.html, /<code class="language-md hljs">/);
    assert.match(post.html.replace(/<[^>]*>/g,''), /&gt; \[!NOTE\]/);
  } finally { await rm(directory, { recursive:true, force:true }); }
});



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
