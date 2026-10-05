export function hash32(input) {
  let h = 0x811c9dc5;
  const s = String(input);
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return h >>> 0;
}
export function deriveSeed(rootSeed, generatorVersion, path) { return hash32(`${rootSeed}|g${generatorVersion}|${path}`); }
function mix32(x) { x = Math.imul(x ^ (x >>> 16), 0x7feb352d); x = Math.imul(x ^ (x >>> 15), 0x846ca68b); return (x ^ (x >>> 16)) >>> 0; }
function unit(seed, x, y, band) { return mix32(seed ^ Math.imul(x,0x9e3779b1) ^ Math.imul(y,0x85ebca6b) ^ Math.imul(band,0xc2b2ae35)) / 0xffffffff; }
function smooth(t){return t*t*(3-2*t)} function lerp(a,b,t){return a+(b-a)*t}
export function valueNoise(seed,x,y,cells,band=0){const gx=x*cells,gy=y*cells,x0=Math.floor(gx),y0=Math.floor(gy),tx=smooth(gx-x0),ty=smooth(gy-y0);const a=unit(seed,x0,y0,band),b=unit(seed,x0+1,y0,band),c=unit(seed,x0,y0+1,band),d=unit(seed,x0+1,y0+1,band);return lerp(lerp(a,b,tx),lerp(c,d,tx),ty)*2-1}
export function bandContribution(rootSeed,generatorVersion,x,y,band){const seed=deriveSeed(rootSeed,generatorVersion,`terrain/band/${band}`);return valueNoise(seed,x,y,2**(band+1),band)/(1.75**band)}
export function sampleHeight(rootSeed,generatorVersion,x,y,level=0){let h=0;for(let band=0;band<=2+Math.max(0,level);band++)h+=bandContribution(rootSeed,generatorVersion,x,y,band);return h}
export function stableLandmarks(rootSeed,generatorVersion,count=9){const out=[];for(let i=0;i<count;i++){const s=deriveSeed(rootSeed,generatorVersion,`landmark/${i}`);const x=((mix32(s^0xa341316c)%9000)+500)/10000,y=((mix32(s^0xc8013ea4)%9000)+500)/10000;const kinds=['life-tree','settlement','activity','card','route-node'];out.push({id:`L${i}`,x,y,kind:kinds[mix32(s^0xad90777d)%kinds.length]})}return out}
export function worldIdentity({seed,generatorVersion}){return `kfb-world:${seed}:g${generatorVersion}`}
export function worldFingerprint({seed,generatorVersion}){const probes=[];for(let y=0;y<8;y++)for(let x=0;x<8;x++)probes.push(Math.round(sampleHeight(seed,generatorVersion,(x+.5)/8,(y+.5)/8,0)*100000));const landmarks=stableLandmarks(seed,generatorVersion).map(x=>`${x.id}:${x.kind}:${x.x.toFixed(4)}:${x.y.toFixed(4)}`).join('|');return hash32(`${probes.join(',')}|${landmarks}`).toString(16).padStart(8,'0')}
export function generateHeightTile({seed,generatorVersion,level=0,size=128}){const data=new Float32Array(size*size);let min=Infinity,max=-Infinity;for(let y=0;y<size;y++)for(let x=0;x<size;x++){const h=sampleHeight(seed,generatorVersion,x/(size-1),y/(size-1),level);data[y*size+x]=h;min=Math.min(min,h);max=Math.max(max,h)}return{data,min,max}}
export function makeEdit({x,y,label='Authored anchor',kind='authored'}){return{id:`E-${hash32(`${x.toFixed(5)}|${y.toFixed(5)}|${label}|${Date.now()}`).toString(16)}`,x,y,label,kind}}
