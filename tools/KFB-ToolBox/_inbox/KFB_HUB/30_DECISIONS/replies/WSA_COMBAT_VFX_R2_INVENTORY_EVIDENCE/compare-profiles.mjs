import {readFileSync, readdirSync, writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import * as old from './game/weapon-profile.v1.mjs';
import * as current from './arena/weapon-profile.v1.mjs';
const lock=JSON.parse(readFileSync(new URL('./SOURCE_LOCK.json',import.meta.url)));
for(const f of lock.files){const b=readFileSync(new URL(f.target,import.meta.url));const sha=createHash('sha1').update(Buffer.concat([Buffer.from('blob '+b.length+'\0'),b])).digest('hex'); assert.equal(sha,f.gitBlob,f.target);}
const rows=readdirSync(new URL('./profiles/',import.meta.url)).sort().map(name=>{
 const p=JSON.parse(readFileSync(new URL('./profiles/'+name,import.meta.url)));
 const a=old.auditWeaponProfile(p),b=current.auditWeaponProfile(p);
 return {weapon:name.replace('.json',''),game:a.status,gameIssues:a.issues,arena:b.status,arenaIssues:b.issues};
});
const probes=[
 ['action-rifle','Ranged_1H_Reload'],['action-rifle','Ranged_2H_Shoot'],
 ['gatling','flight_aim'],['staff','Ranged_Magic_Raise'],['bow','Ranged_Bow_Release']
].map(([name,clip])=>{
 const p=JSON.parse(readFileSync(new URL('./profiles/'+name+'.json',import.meta.url)));
 p.release={...p.release,clip};
 return {weapon:name,selectedClip:clip,game:old.auditWeaponProfile(p),arena:current.auditWeaponProfile(p)};
});
assert.equal(rows.length,12);
assert.equal(rows.filter(r=>r.game==='CONTRACT_PASS').length,4);
assert.equal(rows.filter(r=>r.arena==='CONTRACT_PASS').length,12);
assert.equal(probes.filter(r=>r.game.status==='CONTRACT_PASS').length,2);
assert.ok(probes.every(r=>r.arena.issues.includes('SELECTED_CLIP_EXCLUDED')));
const output={scope:'Source-byte and pure-validator comparison only. No asset loading, browser, gameplay or hearing acceptance.',sourceFilesVerified:lock.files.length,rows,excludedSelectionProbes:probes,gameHasExclusionExport:typeof old.isClipExcluded==='function',arenaHasExclusionExport:typeof current.isClipExcluded==='function'};
writeFileSync(new URL('./comparison.json',import.meta.url),JSON.stringify(output,null,2)+'\n');
console.log(JSON.stringify(output,null,2));

