import fs from 'node:fs';
const bank=JSON.parse(fs.readFileSync('tools/KFB-Audio-Site/sfx-prompt-bank.v1.json','utf8'));
const html=fs.readFileSync('tools/KFB-Audio-Site/SFX_PROMPT_BANK_01.html','utf8');
const checks=[];const check=(n,o,d=null)=>{checks.push({name:n,ok:!!o,detail:d});if(!o)throw new Error(n+': '+JSON.stringify(d))};
try{
 check('schema',bank.schema==='kfb.audio-sfx-prompt-bank/1.0',bank.schema);
 check('26 ElevenLabs prompts',bank.elevenLabs.length===26,bank.elevenLabs.length);
 check('6 Suno Sounds prompts',bank.sunoSounds.length===6,bank.sunoSounds.length);
 check('3 Suno v6 experiments',bank.sunoV6MusicExperiments.length===3,bank.sunoV6MusicExperiments.length);
 check('all ElevenLabs prompts <=450 chars',bank.elevenLabs.every(x=>x.prompt.length<=450),Math.max(...bank.elevenLabs.map(x=>x.prompt.length)));
 check('ids unique',new Set([...bank.elevenLabs,...bank.sunoSounds,...bank.sunoV6MusicExperiments].map(x=>x.id)).size===35);
 check('P0 gap families represented',['Weather','Crowd','City / Traffic','Tyre / Friction','Machinery'].every(c=>bank.elevenLabs.some(x=>x.priority==='P0'&&x.category===c)));
 check('HTML marker',html.includes('data-kfb-sfx-bank="1.0"'));
 check('HTML copy controls',html.includes('copyP0')&&html.includes('data-copy='));
 console.log(JSON.stringify({status:'PASS',checks:checks.length,maxElevenLabsPromptChars:Math.max(...bank.elevenLabs.map(x=>x.prompt.length))},null,2));
}catch(e){console.error(JSON.stringify({status:'FAIL',checks,failure:String(e.stack||e)},null,2));process.exit(1)}
