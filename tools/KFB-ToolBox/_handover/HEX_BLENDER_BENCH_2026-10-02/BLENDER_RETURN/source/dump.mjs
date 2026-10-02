import * as P1 from './environment-family-p1.mjs';
import * as P2 from './environment-family-p2.mjs';
import fs from 'fs';
const set=[['P0B_TREE',P1.buildP0BTreeGeometry()],['P0B_PEBBLE',P1.buildP0BPebbleGeometry()],['K1_BOULDER',P1.buildK1BoulderGeometry()],['T3_ACCENT_ROCK',P1.buildT3AccentRockGeometry()],['T3_BUSH',P1.buildT3BushGeometry()],...P2.p2GeometrySet()];
const out={};
for(const [id,g] of set){
  const pos=g.getAttribute('position'); const idx=g.index?Array.from(g.index.array):null;
  out[id]={attrs:Object.keys(g.attributes),groups:g.groups,facts:(id.startsWith('SOFT')?P2:P1).geometryFacts(g),pos:Array.from(pos.array).map(v=>+v.toFixed(5)),index:idx};
  console.log(id,Object.keys(g.attributes).join(','),JSON.stringify(out[id].facts),g.groups.length);
}
fs.writeFileSync('proc_geoms.json',JSON.stringify(out));
