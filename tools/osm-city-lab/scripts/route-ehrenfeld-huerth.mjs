import fs from 'node:fs/promises';

const DATA=new URL('../data/corridors/ehrenfeld-huerth-v0/',import.meta.url);
const raw=JSON.parse(await fs.readFile(new URL('source.overpass.json',DATA),'utf8'));
const spec=JSON.parse(await fs.readFile(new URL('SOURCE_SPEC.json',DATA),'utf8'));
const provenance=JSON.parse(await fs.readFile(new URL('PROVENANCE.json',DATA),'utf8'));

const nodes=new Map();
const ways=[];
for(const e of raw.elements){
  if(e.type==='node'&&Number.isFinite(e.lat)&&Number.isFinite(e.lon))nodes.set(e.id,e);
  else if(e.type==='way'&&Array.isArray(e.nodes)&&e.nodes.length>=2)ways.push(e);
}

const R=6371008.8;
const rad=x=>x*Math.PI/180;
function distance(a,b){
  const p1=rad(a.lat),p2=rad(b.lat),dp=p2-p1,dl=rad(b.lon-a.lon);
  const h=Math.sin(dp/2)**2+Math.cos(p1)*Math.cos(p2)*Math.sin(dl/2)**2;
  return 2*R*Math.asin(Math.min(1,Math.sqrt(h)));
}
function nearest(target){
  let best=null;
  for(const n of nodes.values()){
    const d=distance(target,n);
    if(!best||d<best.d)best={id:n.id,d,node:n};
  }
  return best;
}
const factors={
  trunk:1.35,
  primary:.9,
  secondary:.84,
  tertiary:.82,
  unclassified:.95,
  residential:1.02,
  living_street:1.15,
  service:1.28
};
const preferred=new Set(spec.preferredRoadNames||[]);
const graph=new Map();
const edgeMeta=new Map();

function addEdge(a,b,cost,meta){
  if(!graph.has(a))graph.set(a,[]);
  graph.get(a).push({to:b,cost,meta});
}
for(const w of ways){
  const tags=w.tags||{};
  if(tags.access==='private'||tags.motor_vehicle==='no'||tags.vehicle==='no')continue;
  const cls=tags.highway;
  if(!factors[cls])continue;
  const one=String(tags.oneway||'').toLowerCase();
  const reverse=one==='-1';
  const forwardOnly=['yes','1','true'].includes(one);
  const name=String(tags.name||'').trim();
  const preferredFactor=preferred.has(name)?.58:1;
  for(let i=1;i<w.nodes.length;i++){
    const na=nodes.get(w.nodes[i-1]),nb=nodes.get(w.nodes[i]);
    if(!na||!nb)continue;
    const len=distance(na,nb);
    const cost=len*factors[cls]*preferredFactor;
    const meta={wayId:w.id,highway:cls,name:lengthSafe(name),lengthM:len};
    if(reverse)addEdge(nb.id,na.id,cost,meta);
    else{
      addEdge(na.id,nb.id,cost,meta);
      if(!forwardOnly)addEdge(nb.id,na.id,cost,meta);
    }
  }
}

function lengthSafe(s){return s.length>120?s.slice(0,120):s;}

const start=nearest(spec.start);
const end=nearest(spec.end);
if(!start||!end)throw new Error('Could not snap corridor endpoints to OSM graph');

class MinHeap{
  constructor(){this.a=[];}
  push(x){this.a.push(x);let i=this.a.length-1;while(i){const p=(i-1)>>1;if(this.a[p].d<=x.d)break;this.a[i]=this.a[p];i=p;}this.a[i]=x;}
  pop(){
    if(!this.a.length)return null;
    const root=this.a[0],last=this.a.pop();
    if(this.a.length){
      let i=0;
      while(true){
        let l=i*2+1,r=l+1,b=i;
        if(l<this.a.length&&this.a[l].d<this.a[b].d)b=l;
        if(r<this.a.length&&this.a[r].d<this.a[b].d)b=r;
        if(b===i)break;
        this.a[i]=this.a[b];i=b;
      }
      this.a[i]=last;
      // restore upward in case last is smaller than parent
      while(i){const p=(i-1)>>1;if(this.a[p].d<=this.a[i].d)break;[this.a[p],this.a[i]]=[this.a[i],this.a[p]];i=p;}
    }
    return root;
  }
}
const dist=new Map([[start.id,0]]);
const prev=new Map();
const heap=new MinHeap();
heap.push({id:start.id,d:0});
const seen=new Set();

while(true){
  const cur=heap.pop();
  if(!cur)break;
  if(seen.has(cur.id))continue;
  seen.add(cur.id);
  if(cur.id===end.id)break;
  for(const e of graph.get(cur.id)||[]){
    const nd=cur.d+e.cost;
    if(nd<(dist.get(e.to)??Infinity)){
      dist.set(e.to,nd);
      prev.set(e.to,{from:cur.id,meta:e.meta});
      heap.push({id:e.to,d:nd});
    }
  }
}
if(!prev.has(end.id))throw new Error('No route found between corridor anchors');

const nodeIds=[end.id];
const segments=[];
let cur=end.id;
while(cur!==start.id){
  const p=prev.get(cur);
  if(!p)throw new Error('Broken route predecessor chain');
  segments.push({from:p.from,to:cur,...p.meta});
  cur=p.from;
  nodeIds.push(cur);
}
nodeIds.reverse();
segments.reverse();

const routeNodes=nodeIds.map(id=>{const n=nodes.get(id);return {id,lat:n.lat,lon:n.lon};});
let physicalM=0;
for(const s of segments)physicalM+=s.lengthM;
const roadUsage=new Map();
for(const s of segments){
  const key=s.name||`(${s.highway})`;
  const e=roadUsage.get(key)||{name:key,lengthM:0,segments:0,highways:new Set(),wayIds:new Set()};
  e.lengthM+=s.lengthM;e.segments++;e.highways.add(s.highway);e.wayIds.add(s.wayId);roadUsage.set(key,e);
}
const namedRoads=[...roadUsage.values()].map(e=>({
  name:e.name,
  lengthM:+e.lengthM.toFixed(1),
  segments:e.segments,
  highways:[...e.highways],
  wayIds:[...e.wayIds]
})).sort((a,b)=>b.lengthM-a.lengthM);

const lats=routeNodes.map(n=>n.lat),lons=routeNodes.map(n=>n.lon);
const result={
  schema:'kfb.osm-city.route-discovery.v0',
  id:spec.id,
  status:'SOURCE_DERIVED_ROUTE_CANDIDATE',
  sourceSha256:provenance.sourceSha256,
  startSnap:{requested:spec.start,nodeId:start.id,snapDistanceM:+start.d.toFixed(1),lat:start.node.lat,lon:start.node.lon},
  endSnap:{requested:spec.end,nodeId:end.id,snapDistanceM:+end.d.toFixed(1),lat:end.node.lat,lon:end.node.lon},
  route:{
    physicalLengthM:+physicalM.toFixed(1),
    weightedCost:+(dist.get(end.id)||0).toFixed(1),
    nodeCount:routeNodes.length,
    segmentCount:segments.length,
    preferredRoadNames:spec.preferredRoadNames,
    preferredRoadsUsed:namedRoads.filter(r=>preferred.has(r.name)).map(r=>r.name),
    namedRoads,
    bounds:{south:Math.min(...lats),west:Math.min(...lons),north:Math.max(...lats),east:Math.max(...lons)},
    nodes:routeNodes,
    segments
  },
  futureCorridorHalfWidthM:spec.futureCorridorHalfWidthM,
  note:'Graph-discovery candidate only. Human/map review precedes rendered corridor extraction.'
};
await fs.mkdir(new URL('../evidence/',import.meta.url),{recursive:true});
await fs.writeFile(new URL('../evidence/ehrenfeld-huerth-route.json',import.meta.url),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({
  id:result.id,
  physicalLengthM:result.route.physicalLengthM,
  preferredRoadsUsed:result.route.preferredRoadsUsed,
  topRoads:result.route.namedRoads.slice(0,12),
  startSnapM:result.startSnap.snapDistanceM,
  endSnapM:result.endSnap.snapDistanceM
},null,2));
