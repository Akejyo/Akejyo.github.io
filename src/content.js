import { imageAssets } from './image-assets.js';
import { readFile, readdir } from 'node:fs/promises';
import matter from 'gray-matter';
import { evaluate } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';

function Figure({ src, alt, caption, width=1200, height=700 }) {
  return h('figure', null, h('img', { src, alt, loading: 'lazy', width, height }), h('figcaption', null, caption));
}
function Table(props) { return h('div', {className:'table-scroll', tabIndex:0, role:'region', 'aria-label':'Scrollable data table'}, h('table', props)); }
export async function loadPosts(directory = new URL('../content/records/', import.meta.url)) {
  const files = (await readdir(directory)).filter(file=>file.endsWith('.mdx'));
  const posts = await Promise.all(files.map(async file=>{
    const raw = await readFile(new URL(file, directory), 'utf8');
    const { data, content } = matter(raw);
    for (const key of ['title','date','category','description','number']) if (!data[key]) throw new Error(`${file}: missing ${key}`);
    const slug = file.slice(0,-4);
    const { default: Content } = await evaluate(content, {...runtime, remarkPlugins:[remarkGfm,remarkMath],rehypePlugins:[rehypeKatex,rehypeSlug]});
    const html = renderToStaticMarkup(h(Content, {components:{Figure, table:Table}})).replace(/(<img[^>]*\bsrc=")([^"]+)(")/g, (match,before,src,after)=>before+(imageAssets[src.replaceAll('&amp;','&')]||src)+after);
    const plain = html.replace(/<[^>]*>/g,' ');
    const readingTime = Math.max(1,Math.ceil(plain.split(/\s+/).filter(Boolean).length/220));
    const headings = [...html.matchAll(/<h2 id="([^"]+)">([\s\S]*?)<\/h2>/g)].map(([,id,title])=>({id,title:title.replace(/<[^>]*>/g,'')}));
    return {...data,date:String(data.date),slug,html,readingTime,headings};
  }));
  return posts.sort((a,b)=>b.date.localeCompare(a.date));
}
