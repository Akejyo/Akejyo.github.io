import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=fileURLToPath(new URL('../dist/',import.meta.url));
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.gif':'image/gif','.avif':'image/avif','.woff2':'font/woff2','.woff':'font/woff','.ttf':'font/ttf'};
export function createPreviewServer(){return http.createServer(async(req,res)=>{
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405).end();return;}
  try{
    const url=new URL(req.url,'http://localhost');const decoded=decodeURIComponent(url.pathname);
    const filename=path.resolve(root,'.'+decoded);
    if(filename!==path.resolve(root)&&!filename.startsWith(root)){res.writeHead(400).end();return;}
    let file=filename;const info=await stat(file).catch(()=>null);
    if(info?.isDirectory()){
      if(!url.pathname.endsWith('/')){res.writeHead(301,{Location:url.pathname+'/'+url.search}).end();return;}
      file=path.join(file,'index.html');
    }
    let body;let status=200;
    try{body=await readFile(file);}catch{body=await readFile(path.join(root,'404.html'));file='404.html';status=404;}
    res.writeHead(status,{'Content-Type':types[path.extname(file)]||'application/octet-stream','X-Content-Type-Options':'nosniff'});res.end(req.method==='HEAD'?undefined:body);
  }catch{res.writeHead(400).end('Invalid request or missing build. Run npm run build first.');}
});}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const port=Number(process.env.PORT||4173);createPreviewServer().listen(port,'127.0.0.1',()=>console.log(`Static production preview: http://localhost:${port}`));
}
