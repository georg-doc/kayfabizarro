import fs from 'node:fs';
import crypto from 'node:crypto';
const root='dist/experience/',source=fs.readFileSync(root+'main.js'),hash=crypto.createHash('sha256').update(source).digest('hex'),name='main.'+hash.slice(0,12)+'.js';
fs.writeFileSync(root+name,source);
const manifest={schema:'kfb.site-manifest/1',channel:'stage',shell:'1',base:'hypernorm-private-r1',modules:{'kfb-hypernorm-experience':{src:'./'+name,sha256:hash,requires:{shell:'1',base:'hypernorm-private-r1'}}}};
fs.writeFileSync(root+'stage.json',JSON.stringify(manifest,null,2));
fs.writeFileSync(root+'stage.packaged.json',JSON.stringify(manifest,null,2));
fs.writeFileSync(root+'live.json',JSON.stringify({...manifest,channel:'live',modules:{}},null,2));
console.log(JSON.stringify({entry:name,sha256:hash,liveUntouched:true}));
