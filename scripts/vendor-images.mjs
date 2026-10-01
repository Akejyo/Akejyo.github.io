// One-time/explicit maintenance, never run during deployment. Preserve source URLs in the manifest.
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { loadPosts } from '../src/content.js';
import { recordCover } from '../src/record-cover.js';
const urls=new Set();
try{const prior=JSON.parse(await readFile(new URL('../docs/IMAGE-ASSETS.json',import.meta.url)));for(const entry of [...prior.images,...prior.failures])urls.add(entry.source);}catch(e){if(e.code!=='ENOENT')throw e;}
for(const post of await loadPosts()){
  const cover=recordCover(post);if(cover?.src.startsWith('http'))urls.add(cover.src);
  for(const [,url] of post.html.matchAll(/<img[^>]+src="(https?:[^\"]+)"/g))urls.add(url.replaceAll('&amp;','&'));
}
await mkdir(new URL('../assets/articles/',import.meta.url),{recursive:true});
const queue=[...urls];const images=[];const failures=[];
async function worker(){while(queue.length){const source=queue.shift();try{
  const response=await fetch(source,{signal:AbortSignal.timeout(30000)});
  if(!response.ok)throw Error('HTTP '+response.status);
  const type=response.headers.get('content-type')?.split(';')[0];
  const ext={'image/png':'png','image/jpeg':'jpg','image/webp':'webp','image/gif':'gif','image/svg+xml':'svg','image/avif':'avif'}[type];
  if(!ext)throw Error('Not an image: '+type);
  const file=createHash('sha256').update(source).digest('hex').slice(0,20)+'.'+ext;
  const bytes=Buffer.from(await response.arrayBuffer());
  await writeFile(new URL('../assets/articles/'+file,import.meta.url),bytes);
  images.push({source,path:'/assets/articles/'+file,bytes:bytes.length});
}catch(error){failures.push({source,error:error.message});}}}
await Promise.all(Array.from({length:6},worker));
images.sort((a,b)=>a.source.localeCompare(b.source));failures.sort((a,b)=>a.source.localeCompare(b.source));
await writeFile(new URL('../docs/IMAGE-ASSETS.json',import.meta.url),JSON.stringify({images,failures},null,2)+'\n');
await writeFile(new URL('../src/image-assets.js',import.meta.url),'// Vendored source images; provenance: docs/IMAGE-ASSETS.json.\nexport const imageAssets = '+JSON.stringify(Object.fromEntries(images.map(i=>[i.source,i.path])),null,2)+';\n');
console.log(`Saved ${images.length} images (${images.reduce((sum,i)=>sum+i.bytes,0)} bytes); ${failures.length} unavailable.`);
for(const failure of failures)console.log(failure.source+' '+failure.error);
