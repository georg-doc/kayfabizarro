import {readFileSync,existsSync} from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const root='work/kfb-tool-cleanup-r1/',read=p=>readFileSync(p,'utf8');
const lines=read(root+'pr/_redirects').split('\n').filter(l=>l&&!l.startsWith('#'));
const sources=new Set();
for(const line of lines){const words=line.split(/\s+/);assert.equal(words.length,3);const [src,dst,status]=words;assert.equal(status,'302');assert(src.startsWith('/') && !src.startsWith('//'));assert(!src.includes('*'));assert(!sources.has(src));sources.add(src);assert(!/\.(js|json|glb|png|jpg|webp)$/.test(src));assert(!dst.includes('ws1-preview'));assert(src!==dst);}
assert(lines.length<2000);
const rules=JSON.parse(read(root+'redirect-rules.json'));
const motion='/kfb-hub/stage/toolbox/kaykit-motion-lab-v1/';
assert.equal(rules[motion],'https://kfb-toolbox.frizzlebob.chatgpt.site/?tab=motion');
for(const p of ['/kfb-hub/stage/toolbox/kaykit-motion-lab-v1/PROFILE_PROPOSALS.json','/kfb-hub/stage/toolbox/production-03/kfb-lib/locomotion-profiles.v1.js','/index.html','/'])assert(!rules[p]);
const s=read('sites/kfb-toolbox-router/dist/index.html');assert(s.includes("if (this.state.tab === 'motion') return;"));assert(s.includes('<sc-if value="{{ isMotion }}"><iframe'));assert(s.includes("u.searchParams.delete('tab')"));
const lab=read('sites/kfb-toolbox-router/dist/motion/lab.mjs');assert.equal(lab,read(root+'donor-motion/lab.mjs'));
const profile=read('sites/kfb-toolbox-router/dist/motion/profile-reader.mjs');assert(profile.includes("../kfb-lib/locomotion-profiles.v1.js"));assert(profile.includes('/PROFILE_PROPOSALS.json'));assert(!profile.includes('localStorage'));
for(const p of ['index.html','donor/index.html']){const x=read(root+'old-hub/dist/'+p);assert(x.includes("location.replace('https://claude.ai/artifact/WxG16gvt7LNrBXxYkAhr9d')"));assert(existsSync(root+'old-hub/archive-before-tools-r1/'+p));}
console.log(JSON.stringify({ok:true,rules:lines.length,pathOnlySyntax:true,ws1AndDataPathsUnmatched:true,originalMotionRuntimeUnchanged:true,profileReaderReadOnly:true,oldHubSourcePreserved:true,labSHA256:createHash('sha256').update(lab).digest('hex')},null,2));
