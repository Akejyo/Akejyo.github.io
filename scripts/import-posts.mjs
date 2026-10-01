import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { toMarkdown } from 'mdast-util-to-markdown';
import { mdxToMarkdown } from 'mdast-util-mdx';
import { mathToMarkdown } from 'mdast-util-math';
import { gfmToMarkdown } from 'mdast-util-gfm';
import { evaluate } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import rehypeKatex from 'rehype-katex';

const project=fileURLToPath(new URL('..',import.meta.url));
const source=path.resolve(process.argv[2]||'E:/Akejyo.github.io/_posts');
const destination=path.join(project,'content/records');
const manifestPath=path.join(project,'docs/POST-MIGRATION.json');
const parser=unified().use(remarkParse).use(remarkGfm).use(remarkMath);
const digest=value=>createHash('sha256').update(value).digest('hex');
const slash=value=>value.replaceAll('\\','/');
const all=(await fs.readdir(source,{recursive:true,withFileTypes:true})).filter(e=>e.isFile()).map(e=>path.join(e.parentPath||e.path,e.name));
const postFiles=all.filter(file=>/\.(md|markdown|mdx)$/i.test(file)).sort();
const assets=all.filter(file=>/\.(png|jpe?g|webp|gif|svg|avif)$/i.test(file));
const byName=new Map(assets.map(file=>[path.basename(file).toLowerCase(),file]));
const assetMap=new Map(), warnings=[], entries=[], staged=[];
for(const file of assets){
  const bytes=await fs.readFile(file),name=digest(bytes).slice(0,16)+path.extname(file).toLowerCase();
  const url='/assets/imported/'+name;assetMap.set(file,url);
  await fs.mkdir(path.join(project,'assets/imported'),{recursive:true});
  await fs.writeFile(path.join(project,url),bytes);
}
let previous;try{previous=JSON.parse(await fs.readFile(manifestPath,'utf8'));}catch{}
const previousBySource=new Map(previous?.posts.map(post=>[post.source,post])||[]);
const existing=await fs.readdir(destination);
let number=Math.max(0,...await Promise.all(existing.filter(f=>f.endsWith('.mdx')).map(async f=>Number(matter(await fs.readFile(path.join(destination,f),'utf8')).data.number)||0)));
const plain=node=>node.type==='text'||node.type==='inlineCode'||node.type==='inlineMath'?node.value:(node.children||[]).map(plain).join('');
const visit=(node,fn)=>{fn(node);node.children?.forEach(child=>visit(child,fn));};
function resolveImage(url,file){
  if(url.startsWith('/assets/imported/'))return url;
  if(/^https?:/i.test(url)){
    // Local duplicates of remotely referenced images can travel with the article.
    let name;try{name=path.basename(decodeURIComponent(new URL(url).pathname));}catch{return url;}
    return assetMap.get(byName.get(name.toLowerCase()))||url;
  }
  const normalized=slash(url),name=normalized.split('/').pop();
  const found=byName.get(name.toLowerCase());
  if(found)return assetMap.get(found);
  warnings.push({source:slash(path.relative(source,file)),asset:url,reason:'Not present in source assets; retained at original site URL.'});
  return new URL(normalized.replace(/^[A-Z]:/i,''),'https://akejyo.github.io/').href;
}
for(const file of postFiles){
  const raw=await fs.readFile(file,'utf8'),{data,content}=matter(raw);
  const relative=slash(path.relative(source,file));
  const originalDate=data.date instanceof Date?data.date.toISOString().slice(0,10):String(data.date);
  const parts=originalDate.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if(!parts)throw Error(`Invalid date: ${relative}`);
  const date=`${parts[1]}-${parts[2].padStart(2,'0')}-${parts[3].padStart(2,'0')}`;
  const tail=path.basename(file).replace(/^\d{4}-\d{1,2}-\d{1,2}-/,'').replace(/\.(md|markdown|mdx)$/i,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  const slug=date+'-'+(tail||relative.split('/')[0].toLowerCase().replace(/[^a-z0-9]+/g,'-'));
  if(staged.some(post=>post.file===slug+'.mdx'))throw Error(`Duplicate output slug: ${slug}`);
  const prior=previousBySource.get(relative);
  if(existing.includes(slug+'.mdx')&&(!prior||digest(await fs.readFile(path.join(destination,slug+'.mdx')))!==prior.outputHash))throw Error(`Will not overwrite existing/edited post: ${slug}`);
  // Repair Windows image destinations before Markdown treats their spaces/backslashes as syntax.
  let input=content.replaceAll('\r\n','\n').replace(/!\[([^\]\n]*)\]\(([A-Z]:[^\n]*?\.(?:png|jpe?g|gif|webp|svg))\)/gi,(_,alt,url)=>`![${alt}](${resolveImage(url,file)})`);
  const tree=parser.parse(input);
  const codes=[];visit(tree,node=>{if(node.type==='code')codes.push(node.value);});
  let hasH1=false;visit(tree,node=>{if(node.type==='heading'&&node.depth===1||node.type==='html'&&/^<h1\b/.test(node.value))hasH1=true;});
  visit(tree,node=>{
    if(node.type==='math'||node.type==='inlineMath')node.value=node.value.replaceAll('$$','').replaceAll('，','\\text{，}');
    if(node.type==='heading'&&hasH1)node.depth=Math.min(6,node.depth+1);
    if(node.type==='image')node.url=resolveImage(node.url,file);
    if(node.type!=='html')return;
    if(/^<!--\s*more\s*-->$/.test(node.value)){node.type='text';node.value='';return;}
    if(/^\s*<img\b/.test(node.value)){
      const url=node.value.match(/\bsrc="([^"]+)"/)?.[1];
      const src=url?.match(/^\$withBase\('([^']+)'\)$/)?.[1]||url;
      if(!src)throw Error(`Unsupported image: ${relative}`);
      const alt=node.value.match(/\balt="([^"]*)"/)?.[1]||path.basename(src,path.extname(src));
      node.type='image';node.url=resolveImage(src,file);node.alt=alt;delete node.value;return;
    }
    if(/^<h1\b/.test(node.value)){
      node.type='heading';node.depth=2;node.children=[{type:'text',value:node.value.replace(/<[^>]+>/g,'')}];delete node.value;return;
    }
    // Keep the original underline markup; unknown generic-looking tags are literal prose.
    if(!/^<\/?u>$/.test(node.value)){node.type='text';}
  });
  visit(tree,node=>{
    if(!['root','blockquote','listItem'].includes(node.type))return;
    node.children=node.children.filter(child=>child.type!=='text'||child.value.trim()).map(child=>['image','text'].includes(child.type)?{type:'paragraph',children:[child]}:child);
  });
  const paragraphs=[];visit(tree,node=>{if(node.type==='paragraph'){const text=plain(node).trim();const prose=(node.children||[]).filter(child=>child.type!=='link'&&child.type!=='image').map(plain).join('');if(prose.length>30)paragraphs.push(text);}});
  const description=(paragraphs[0]||data.title).replace(/\s+/g,' ').slice(0,180);
  const body=toMarkdown(tree,{fences:true,extensions:[gfmToMarkdown(),mathToMarkdown(),mdxToMarkdown()],handlers:{html:node=>node.value}});
  const convertedTree=parser.parse(body), convertedCodes=[];visit(convertedTree,node=>{if(node.type==='code')convertedCodes.push(node.value);});
  if(JSON.stringify(codes)!==JSON.stringify(convertedCodes))throw Error(`Code preservation failed: ${relative}`);
  const metadata={...data,title:String(data.title),date,category:(data.categories||[]).at(-1)||relative.split('/')[0],description,number:prior?.number||String(++number).padStart(3,'0'),selected:false,author:'Akejyo',importedFrom:relative};
  const output=matter.stringify(body,metadata);
  // The actual blog's compiler, math plugins and React renderer, not just a syntax check.
  const {default:Content}=await evaluate(body,{...runtime,remarkPlugins:[remarkGfm,remarkMath],rehypePlugins:[rehypeKatex]});
  const html=renderToStaticMarkup(createElement(Content));
  entries.push({source:relative,file:slug+'.mdx',slug,number:metadata.number,date,title:metadata.title,sourceHash:digest(raw),outputHash:digest(output),codeBlocks:codes.length,mathErrors:(html.match(/class="katex-error"/g)||[]).length});
  staged.push({file:slug+'.mdx',output});
}
for(const post of staged)await fs.writeFile(path.join(destination,post.file),post.output);
const manifest={source,posts:entries,assets:[...assetMap].map(([file,url])=>({source:slash(path.relative(source,file)),url})),warnings};
await fs.writeFile(manifestPath,JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify({posts:entries.length,assets:assetMap.size,warnings,mathErrors:entries.filter(p=>p.mathErrors)},null,2));
