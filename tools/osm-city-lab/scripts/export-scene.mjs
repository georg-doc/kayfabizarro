import fs from 'node:fs/promises';
import { buildConsumerScene } from '../src/export/scene-recipe.js';

const ids=process.argv.slice(2);
if(!ids.length) throw new Error('Usage: node export-scene.mjs <city-id> [...]');

await fs.mkdir(new URL('../scenes/',import.meta.url),{recursive:true});
for(const id of ids){
  if(!/^[a-z0-9-]+$/.test(id)) throw new Error('invalid city id '+id);
  const normalized=JSON.parse(await fs.readFile(new URL(`../data/${id}/normalized.json`,import.meta.url),'utf8'));
  const scene=buildConsumerScene(normalized);
  await fs.writeFile(new URL(`../scenes/${id}.json`,import.meta.url),JSON.stringify(scene,null,2)+'\n');
  console.log(`exported ${id}: ${scene.surfaces.roads.length} roads, ${scene.obstacles.buildings.length} buildings`);
}
