import { imageAssets } from './image-assets.js';
// Explicit editorial metadata only: never infer a cover from article-body images.
export function recordCover(post) {
  if(post.cover===false)return null;
  const value=post.cover??post.image;
  let src=typeof value==='string'?value:value?.src??value?.path;
  if(typeof src!=='string'||!src.trim())return null;
  src=src.trim();
  // Imported Chirpy posts used this img_cdn for their /img/... frontmatter.
  if(post.importedFrom&&src.startsWith('/img/'))src='https://raw.githubusercontent.com/Akejyo/imageForBlog/master'+src;
  src=imageAssets[src]||src;
  if(!/^(?:https?:\/\/|\/(?!\/))/.test(src))return null;
  const fit=post.coverFit==='contain'?'contain':'cover';
  const requested=String(post.coverPosition||'center');
  const position=/^(?:(?:left|right|top|bottom|center|\d+(?:\.\d+)?%)(?:\s+|$)){1,2}$/.test(requested)?requested:'center';
  return {src,fit,position};
}
