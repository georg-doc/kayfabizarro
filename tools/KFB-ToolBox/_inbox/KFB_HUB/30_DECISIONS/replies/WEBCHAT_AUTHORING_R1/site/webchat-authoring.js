import {AUTHORING_ROOT,validateScene,validateReceipt} from './authoring-contract.mjs';
export async function readAuthoring(json,api,raw,pin,proposal=false){
 const list=async(dir)=>{try{const r=await json(api+'/contents/'+AUTHORING_ROOT+dir+'?ref='+pin);if(!Array.isArray(r)||r.length>150)throw Error('Autorenverzeichnis ungültig/zu groß');return r.filter(f=>f.type==='file'&&/^[a-z0-9][a-z0-9_]*\.(?:scenelet|diorama|proposal)\.json$/.test(f.name)).map(f=>dir+'/'+f.name);}catch(e){if(e.status===404)return [];throw e;}};
 const [scenelets,dioramas,proposals]=await Promise.all(['scenelets','dioramas','proposals'].map(list));
 const docs=await Promise.all([...scenelets,...dioramas,...proposals].map(async path=>({path,doc:await json(raw+pin+'/'+AUTHORING_ROOT+path)})));
 const scenes=[],receipts=[];
 for(const {path,doc} of docs){const errors=path.startsWith('proposals/')?validateReceipt(doc):validateScene(doc);if(errors.length)throw Error(path+': '+errors.join('; '));if(path.startsWith('proposals/')){if(path!=='proposals/'+doc.id+'.proposal.json')throw Error('Vorschlagsdatei passt nicht zur ID');receipts.push(doc);}else{if(path!==(doc.kind==='scenelet'?'scenelets/':'dioramas/')+doc.id+'.'+doc.kind+'.json')throw Error('Szenendatei passt nicht zur ID');scenes.push(doc);}}
 if(proposal&&!receipts.length)throw Error('Kein geprüfter Änderungsvorschlag auf diesem Branch');
 return {scenes,receipts};
}
