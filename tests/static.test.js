import test, {after} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {once} from 'node:events';
import {createPreviewServer} from '../scripts/preview.mjs';
import {loadPosts} from '../src/content.js';
import {expeditions} from '../src/site.js';
const server=createPreviewServer().listen(0,'127.0.0.1');
await once(server,'listening');after(()=>new Promise(resolve=>server.close(resolve)));
const base='http://127.0.0.1:'+server.address().port;
const posts=await loadPosts();
const routes=['/','/records','/projects','/archive','/about','/void','/design-system',...posts.map(p=>'/records/'+p.slug),...expeditions.map(p=>'/projects/'+p.slug)];
const pages=new Map();
test('every static route supports fresh navigation and refresh, plus real custom 404',async()=>{
  for(const route of routes){
    for(let refresh=0;refresh<2;refresh++){
      const response=await fetch(base+route);assert.equal(response.status,200,route);const html=await response.text();pages.set(route,html);
      assert.match(html,/<html lang="en">/);assert.doesNotMatch(html,/northline-development|\/src\/qa(?:-arrival)?\.(?:css|js)|\/Akejyo\.github\.io\//);
      if(route!=='/')assert.equal(new URL(response.url).pathname,route+'/');
    }
  }
  for(const route of ['/does-not-exist','/records/unknown','/deep/missing/path','/src/qa.js','/src/qa.css','/src/qa-arrival.js','/content/records/example.mdx','/server.js']){
    const response=await fetch(base+route);assert.equal(response.status,404,route);assert.match(await response.text(),/THIS PLACE<br>DOES NOT EXIST/);
  }
  assert.equal((await fetch(base+'/404.html')).status,200);
  assert.equal((await fetch(base+'/about/',{method:'HEAD'})).status,200);
});
test('rendered local links, images, scripts, styles and responsive sources exist in the artifact',async()=>{
  const checked=new Set();
  for(const [route,html] of pages){
    const refs=[...html.matchAll(/(?:src|href)="([^\"]+)"/g)].map(m=>m[1]);
    for(const [,set] of html.matchAll(/srcset="([^\"]+)"/g))refs.push(...set.split(',').map(v=>v.trim().split(/\s+/)[0]));
    for(const ref of refs){
      if(!ref.startsWith('/')&&!ref.startsWith('#'))continue;
      const target=new URL(ref,base+route+(route==='/'?'':'/'));const key=target.pathname+target.hash;if(checked.has(key))continue;checked.add(key);
      const response=await fetch(target);assert.equal(response.status,200,route+' -> '+ref);
      if(target.hash&&!target.pathname.startsWith('/design-system'))assert.ok((await response.text()).includes('id="'+decodeURIComponent(target.hash.slice(1))+'"'),route+' -> '+ref);
    }
  }
});
test('browser effect modules are preserved verbatim and their imports/CSS assets resolve',async()=>{
  for(const file of await readdir(new URL('../dist/src/',import.meta.url))){
    assert.doesNotMatch(file,/^qa/);
    const built=await readFile(new URL('../dist/src/'+file,import.meta.url),'utf8');assert.equal(built,await readFile(new URL('../src/'+file,import.meta.url),'utf8'),file);
    const dependencies=file.endsWith('.js')?[...built.matchAll(/(?:from\s*|import\s*\()(['"])(\.\.?\/[^'"]+)\1/g)].map(m=>m[2]):[...built.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)].map(m=>m[1]);
    for(const ref of dependencies){if(ref.startsWith('data:')||ref.startsWith('#'))continue;assert.equal((await fetch(new URL(ref,base+'/src/'+file))).status,200,file+' -> '+ref);}
  }
  const css=await(await fetch(base+'/vendor/katex/katex.min.css')).text();
  for(const [,font] of css.matchAll(/url\((fonts\/[^)]+)\)/g))assert.equal((await fetch(base+'/vendor/katex/'+font)).status,200,font);
  assert.match(pages.get('/about'),/data-persona-cresson/);assert.match(pages.get('/records'),/record-ghost/);assert.match(pages.get('/'),/snow-atmosphere/);
  assert.match(pages.get('/void'),/data-cresson/);
});
