import { mkdir, readFile, writeFile, cp, readdir, rm, lstat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadPosts } from '../src/content.js';
import { home, records, article, projects, projectDetail, archive, about, notFound, voidPage } from '../src/pages.js';
import { expeditions } from '../src/site.js';

const root=fileURLToPath(new URL('../',import.meta.url));
const output=path.resolve(root,'dist');
// Only this fixed generated directory can be removed; never follow a linked output.
if(path.dirname(output)!==path.resolve(root))throw Error('Unsafe output directory');
const existing=await lstat(output).catch(e=>{if(e.code!=='ENOENT')throw e;});
if(existing?.isSymbolicLink())throw Error('dist must not be a symlink');
await rm(output,{recursive:true,force:true});
await mkdir(output,{recursive:true});
const write=async(file,body)=>{const dest=path.join(output,file);await mkdir(path.dirname(dest),{recursive:true});await writeFile(dest,body);};
const posts=await loadPosts();
const routes=new Map([['/',home(posts)],['/records',records(posts,new URLSearchParams())],['/projects',projects()],['/archive',archive(posts)],['/about',about()],['/void',voidPage()]]);
for(const post of posts){if(!/^[a-z0-9-]+$/i.test(post.slug))throw Error('Unsafe article slug: '+post.slug);routes.set('/records/'+post.slug,article(post,posts));}
for(const project of expeditions){if(!/^[a-z0-9-]+$/i.test(project.slug))throw Error('Unsafe project slug: '+project.slug);routes.set('/projects/'+project.slug,projectDetail(project,posts));}
for(const [route,page] of routes){if(page.status!==200)throw Error('Failed route '+route);await write(route==='/'?'index.html':route.slice(1)+'/index.html',page.html);}
await write('404.html',notFound().html);
await write('404/index.html',notFound().html);
await write('design-system/index.html',await readFile(path.join(root,'index.html')));
await write('preview.html',await readFile(path.join(root,'preview.html')));
// Explicit client allowlist: no QA, server, MDX sources, documentation or credentials.
const clients=['styles.css','components.js','main.js','blog.css','blog.js','folklore.css','collapse.css','collapse.js','collapse-art.js','story.css','story.js','story-arrival.js','effect-events.js','environment.js'];
for(const file of clients)await write('src/'+file,await readFile(path.join(root,'src',file)));
async function copyImages(dir,relative='assets'){
  for(const entry of await readdir(dir,{withFileTypes:true})){
    if(entry.isSymbolicLink())throw Error('Linked asset is not supported: '+entry.name);
    if(entry.isDirectory())await copyImages(path.join(dir,entry.name),relative+'/'+entry.name);
    else if(/\.(svg|png|jpe?g|webp|avif|gif)$/i.test(entry.name))await write(relative+'/'+entry.name,await readFile(path.join(dir,entry.name)));
  }
}
await copyImages(path.join(root,'assets'));
await mkdir(path.join(output,'vendor/katex'),{recursive:true});
await cp(path.join(root,'node_modules/katex/dist/fonts'),path.join(output,'vendor/katex/fonts'),{recursive:true});
await write('vendor/katex/katex.min.css',await readFile(path.join(root,'node_modules/katex/dist/katex.min.css')));
await write('.nojekyll','');
console.log(`Built ${routes.size+3} HTML routes (${posts.length} articles) into dist/ for https://akejyo.github.io/`);
