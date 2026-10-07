import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const root=process.argv[2];
const baseline=JSON.parse(fs.readFileSync(root+'/dist/open-world-mvp.fallback.json','utf8'));
const clone=x=>structuredClone(x);
let queue=[],calls=[];
class Component {
  constructor(props){this.props=props;this.state={};}
  setState(s,cb){this.state={...this.state,...s};cb?.();}
}
const React={Component,createElement:(tag,props,...children)=>({tag,props,children})};
const context={window:{},URL,AbortController,setTimeout,clearTimeout,console,
  fetch:async(url,options)=>{calls.push({url,cache:options.cache});const item=queue.shift();if(item instanceof Error)throw item;return {ok:true,json:async()=>clone(item)};}};
vm.createContext(context);vm.runInContext(fs.readFileSync(root+'/dist/open-world-mvp-view.js','utf8'),context);
const View=context.window.createKfbMvpView(React);
const instantiate=()=>{const v=new View({query:''});v._alive=true;return v;};
const run=async(name,items,check)=>{queue=items;calls=[];const v=instantiate();await v.load();check(v,calls);return name;};
const results=[];
results.push(await run('valid live feed uses no fallback',[baseline],(v,c)=>{assert.equal(v.state.source,'GitHub LIVE');assert.equal(c.length,1);assert.equal(c[0].cache,'no-store');}));
results.push(await run('network failure uses deployed fallback',[new Error('offline'),baseline],(v,c)=>{assert.equal(v.state.source,'Lokaler Fallback');assert.equal(c.length,2);assert.match(v.state.error,/Live-Daten/);}));
const weakened=clone(baseline);weakened.requirements[0].required=false;weakened.requirements[0].acceptance='NON_BLOCKER';
results.push(await run('required row cannot be downgraded',[weakened,baseline],(v)=>assert.equal(v.state.source,'Lokaler Fallback')));
const missing=clone(baseline);missing.requirements.shift();
results.push(await run('truncated ledger cannot claim pass',[missing,baseline],v=>assert.equal(v.state.source,'Lokaler Fallback')));
const duplicate=clone(baseline);duplicate.requirements.push(clone(duplicate.requirements[0]));
results.push(await run('duplicate IDs rejected',[duplicate,baseline],v=>assert.equal(v.state.source,'Lokaler Fallback')));
results.push(await run('unavailable live and fallback reported',[new Error('offline'),new Error('no fallback')],v=>{assert.equal(v.state.data,null);assert.match(v.state.error,/nicht erreichbar/);}));
const allGreen=clone(baseline);allGreen.requirements.filter(r=>r.required).forEach(r=>r.acceptance='GREEN');
const flatten=node=>typeof node==='string'?node:node?.children?.map(flatten).join(' ')||'';
results.push(await run('binary result derived from complete required rows',[allGreen],v=>assert.match(flatten(v.render()),/MVP PASS · COMPLETE ACCEPTANCE MATRIX GREEN/)));
const oneMissing=clone(allGreen);oneMissing.requirements[12].acceptance='MISSING';oneMissing.productStatus='MVP PASS';
results.push(await run('declared PASS cannot override missing required row',[oneMissing],v=>assert.match(flatten(v.render()),/NO MVP · ACCEPTANCE MATRIX NOT FULLY GREEN/)));
console.log(JSON.stringify({passed:results.length,tests:results,environment:'Node VM loader tests; no product-runtime gameplay claim'},null,2));
