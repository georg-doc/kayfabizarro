// Isolated read-only geometry checks. Run: node tests/thin-clay-lid.test.mjs
import assert from 'node:assert/strict';
import {thinClayLidMeshData,thinClayLidGeometry,KFB_THIN_CLAY_SCHEMA} from '../thin-clay-lid.v1.mjs';
let pass=0;const ok=(p,label)=>{assert.ok(p,label);console.log('PASS',++pass,label)};
const cases=[];for(const blink of [0,.5,1])for(const upper of [true,false])cases.push(thinClayLidMeshData({blink,upper}));
for(const data of cases){
 ok(data.schema===KFB_THIN_CLAY_SCHEMA,'schema '+data.meta.upper+'/'+data.meta.blink);
 ok([...data.positions].every(Number.isFinite),'finite vertices '+data.meta.upper+'/'+data.meta.blink);
 ok([...data.indices].every(v=>v>=0&&v<data.positions.length/3),'indices '+data.meta.upper+'/'+data.meta.blink);
 const es=new Map();for(let j=0;j<data.indices.length;j+=3){const tri=data.indices.subarray(j,j+3);for(let k=0;k<3;k++){const a=tri[k],b=tri[(k+1)%3],key=a<b?a+'/'+b:b+'/'+a;es.set(key,(es.get(key)||0)+1)}}
 ok([...es.values()].every(c=>c===2),'indexed edge manifold '+data.meta.upper+'/'+data.meta.blink);
}
const [uo,lo,uh,lh,uc,lc]=cases;
ok(uo.meta.boundary<Math.PI/2&&lo.meta.boundary>Math.PI/2,'neutral gap');
ok(uh.meta.boundary>uo.meta.boundary&&lh.meta.boundary<lo.meta.boundary,'both margins close');
ok(uc.meta.boundary>lc.meta.boundary,'full blink contact overlap');
ok(uc.meta.rOuter>=1.04&&lc.meta.rOuter>=1.04,'normal pupil inset below lid front depth');
ok(uc.meta.thickness<.13,'candidate thinner than source donor');
class G{setAttribute(){this.n=(this.n||0)+1}setIndex(){}computeVertexNormals(){}computeBoundingSphere(){}}
class A{constructor(x){this.x=x}}
const g=thinClayLidGeometry({BufferGeometry:G,BufferAttribute:A},{});
ok(g.userData.schema===KFB_THIN_CLAY_SCHEMA&&g.n===1,'Three adapter identity');
console.log('TOTAL '+pass+'/'+pass+' PASS');
