import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadPosts } from './src/content.js';
import { home, records, article, projects, projectDetail, archive, about, notFound, voidPage } from './src/pages.js';
import { expeditions } from './src/site.js';
import { developmentEnabled, injectQA } from './src/development.js';
const development=developmentEnabled();

const root = path.dirname(fileURLToPath(import.meta.url));
const posts = await loadPosts();
const port = Number(process.env.PORT || 3000);
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.webp':'image/webp', '.avif':'image/avif', '.gif':'image/gif', '.woff2':'font/woff2', '.woff':'font/woff', '.ttf':'font/ttf' };

export const server = http.createServer(async (req,res)=>{
  try {
    if (!['GET','HEAD'].includes(req.method)) {res.writeHead(405,{'Allow':'GET, HEAD'}).end();return;}
    let url;
    try { url=new URL(req.url,'http://localhost'); decodeURIComponent(url.pathname); } catch {res.writeHead(400).end('Bad request');return;}
    const pathname=decodeURIComponent(url.pathname).replace(/\/$/,'')||'/';
    res.setHeader('X-Content-Type-Options','nosniff');
    res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');
    let result;
    if(pathname==='/')result=home(posts);
    else if(pathname==='/records')result=records(posts,url.searchParams);
    else if(pathname==='/projects')result=projects();
    else if(pathname==='/archive')result=archive(posts);
    else if(pathname==='/about')result=about();
    else if(pathname==='/void')result=voidPage();
    else if(pathname.startsWith('/records/')){const post=posts.find(post=>pathname==='/records/'+post.slug);result=post?article(post,posts):notFound();}
    else if(pathname.startsWith('/projects/')){const project=expeditions.find(project=>pathname==='/projects/'+project.slug);result=project?projectDetail(project,posts):notFound();}
    else {
      let file;
      if(pathname==='/design-system')file='index.html';
      else if(pathname==='/preview.html')file='preview.html';
      else if(development&&/^\/src\/(qa\.js|qa\.css|qa-arrival\.js)$/.test(pathname))file=pathname.slice(1);
      else if(/^\/src\/(styles\.css|components\.js|main\.js|blog\.css|blog\.js|folklore\.css|collapse\.css|collapse\.js|collapse-art\.js|story\.css|story\.js|story-arrival\.js|effect-events\.js|environment\.js)$/.test(pathname))file=pathname.slice(1);
      else if(/^\/assets\/(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_-]+\.(svg|png|jpe?g|webp|avif|gif)$/.test(pathname))file=pathname.slice(1);
      else if(/^\/vendor\/katex\/(katex\.min\.css|fonts\/[a-zA-Z0-9_-]+\.(woff2|woff|ttf))$/.test(pathname))file=pathname.replace('/vendor/katex/','node_modules/katex/dist/');
      if(file){try{let body=await readFile(path.join(root,file));if(development&&file.endsWith('.html'))body=injectQA(body.toString());res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});res.end(req.method==='HEAD'?undefined:body);return;}catch(error){if(error.code!=='ENOENT')throw error;}}
      result=notFound();
    }
    res.writeHead(result.status,{'Content-Type':'text/html; charset=utf-8'});
    res.end(req.method==='HEAD'?undefined:development?injectQA(result.html):result.html);
  } catch(error) {console.error(error);res.writeHead(500,{'Content-Type':'text/plain; charset=utf-8'}).end('The page could not be loaded. Please try again.');}
});
server.listen(port,'0.0.0.0',()=>console.log(`Northline: http://localhost:${port} (${posts.length} MDX records)`));
