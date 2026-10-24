import { readdir, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

// Explicit local import, never run by deployment. Source files are read only.
const [drawingsDirectory, photosDirectory] = process.argv.slice(2);
if (!drawingsDirectory || !photosDirectory) throw Error('Usage: node scripts/import-gallery.mjs <drawings-folder> <photos-folder>');
const output = new URL('../assets/gallery/', import.meta.url);
await mkdir(output, { recursive:true });
const items = [];
for (const [type, directory] of [['drawing',drawingsDirectory],['photo',photosDirectory]]) {
  const files = (await readdir(directory)).filter(name=>/\.(png|jpe?g|webp|avif)$/i.test(name)).sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}));
  for (const [index, file] of files.entries()) {
    const source = path.join(directory,file);
    const id = `${type}-${createHash('sha256').update(file).digest('hex').slice(0,12)}`;
    const pipeline = sharp(source).rotate();
    const full = await pipeline.clone().resize({width:2400,height:2400,fit:'inside',withoutEnlargement:true}).webp({quality:90}).toBuffer({resolveWithObject:true});
    await writeFile(new URL(`${id}.webp`,output),full.data);
    await pipeline.clone().resize({width:900,height:900,fit:'inside',withoutEnlargement:true}).webp({quality:82}).toFile(fileURLToPath(new URL(`${id}-thumb.webp`,output)));
    const title = `${type === 'drawing' ? 'Drawing' : 'Photograph'} ${String(index+1).padStart(2,'0')}`;
    items.push({type,title,alt:title,src:`/assets/gallery/${id}.webp`,thumbnail:`/assets/gallery/${id}-thumb.webp`,width:full.info.width,height:full.info.height,album:type==='photo'?'Collected photographs':undefined});
  }
}
// Separate generated inventory from hand-edited captions so reimports preserve edits.
await writeFile(new URL('../src/gallery-inventory.json',import.meta.url),JSON.stringify(items,null,2)+'\n');
console.log(`Imported ${items.length} works. Source files unchanged; add captions in src/gallery-data.js.`);
