export function localHash(link:unknown){if(typeof link!=='string')return null;if(link.startsWith('#'))return link;try{const u=new URL(link);return u.hostname==='ws1-preview.kayfabizarro.pages.dev'&&u.hash?u.hash:null}catch{return null}}
export function testSummary(t:any){
 if(typeof t==='string'){const m=t.match(/^(\d+)\/(\d+)$/);return m?{passed:+m[1],total:+m[2]}:null}
 if(Array.isArray(t)){const pass=(v:any)=>v===true||v==='PASS'||v==='pass'||(v&&typeof v==='object'&&(v.passed===true||v.success===true||['PASS','pass','passed'].includes(v.status)));return {passed:t.filter(pass).length,total:t.length}}
 if(t&&Number.isInteger(t.passed)&&Number.isInteger(t.total))return {passed:t.passed,total:t.total};
 return null;
}
export function validBuild(b:any){
 const t=testSummary(b?.tests);
 if(b?.schema!=='kfb.ws1-build/1'||!t||t.total<=0||t.passed!==t.total||!Number.isFinite(Date.parse(b.date)))throw Error('WS1-Build ist nicht als vollständig geprüft ausgewiesen');
 if(typeof b.commit!=='string'||!b.commit.trim()||typeof b.notes!=='string'||!b.links||typeof b.links!=='object'||Array.isArray(b.links)||!localHash(b.links.stage))throw Error('WS1-Metadaten oder Bühnenziel fehlen');
 const entry=b.entry||'index.html';if(!/^(index\.html|dist\/index\.html)$/.test(entry))throw Error('Unzulässiger Einstieg');
 return {...b,entry};
}
