import { A, assert } from './asset-librarian-v1.2-env.mjs';
import { waitFor, screenshot } from './asset-librarian-v1.2-cdp.mjs';
import { resetSelection, setFilters, openResult, selectResult, setConsumer, handoff, assertHandoff } from './asset-librarian-v1.2-ui.mjs';

export async function runTasksB(cdp,result){
  await resetSelection(cdp);await setFilters(cdp,{query:'CapsuleCarl',kind:'model-3d'});const cap=await openResult(cdp,A.capsulePlayer);
  assert(cap.dependencies.includes('player.bin')&&cap.dependencies.includes('capsule_texture.png'),`T4 Capsule dependencies incomplete: ${cap.dependencies}`);await selectResult(cdp,A.capsulePlayer);
  await setFilters(cdp,{query:'capsule_texture',kind:'image-2d'});await openResult(cdp,A.capsuleTexture);const capDims=await waitFor(cdp,`document.getElementById('imagePreviewImg')?.naturalWidth>0`,'Capsule texture preview');
  await setFilters(cdp,{query:'CharacterTemplate',kind:'model-3d'});await openResult(cdp,A.characterTemplate);await selectResult(cdp,A.characterTemplate);await setConsumer(cdp,'frankenstein-studio');
  const h4=await handoff(cdp);assertHandoff(h4,'frankenstein-studio',[A.capsulePlayer,A.characterTemplate]);result.tasks.T4={player:A.capsulePlayer,texture:A.capsuleTexture,texturePreview:Boolean(capDims),template:A.characterTemplate,handoffAssets:h4.assets.map(a=>a.path)};await screenshot(cdp,'t4-capsulecarl');

  await resetSelection(cdp);await setFilters(cdp,{query:'bath',kind:'model-3d'});await openResult(cdp,A.bath);await selectResult(cdp,A.bath);
  await setFilters(cdp,{query:'Jetpack',kind:'model-3d'});await openResult(cdp,A.jetpack);await selectResult(cdp,A.jetpack);await setConsumer(cdp,'frankenstein-studio');
  const h5=await handoff(cdp);assertHandoff(h5,'frankenstein-studio',[A.bath,A.jetpack]);result.tasks.T5={bath:A.bath,propulsionCandidate:A.jetpack,handoffAssets:h5.assets.map(a=>a.path)};await screenshot(cdp,'t5-bath-propulsion');

  await resetSelection(cdp);await setFilters(cdp,{query:'EnterArena',kind:'audio'});await openResult(cdp,A.audio);
  await waitFor(cdp,`document.getElementById('audioPlayer')?.readyState >= 1`,'audio metadata',60000);const audioMeta=await cdp.evaluate(`document.getElementById('audioMeta').textContent`);assert(audioMeta.trim().length>0,'T6 audio metadata missing');
  const played=await cdp.evaluate(`document.getElementById('audioPlayer').play().then(()=>{document.getElementById('audioPlayer').pause();return true;}).catch(e=>({error:e.message}))`);assert(played===true,`T6 audio play failed: ${JSON.stringify(played)}`);
  await selectResult(cdp,A.audio);await setConsumer(cdp,'generic-runtime');const h6=await handoff(cdp);assertHandoff(h6,'generic-runtime',[A.audio]);await screenshot(cdp,'t6-audio');
  await cdp.send('Page.reload');await waitFor(cdp,`document.getElementById('registryStatus')?.textContent === 'Registry ready'`,'reload after T6');await waitFor(cdp,`document.getElementById('selectionCount')?.textContent === '1 selected'`,'persistent selection');
  result.tasks.T6={asset:A.audio,audioMeta,playPause:true,persistedAfterReload:true,handoffAssets:h6.assets.map(a=>a.path)};
}
