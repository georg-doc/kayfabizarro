import { A, assert } from './asset-librarian-v1.2-env.mjs';
import { waitFor, screenshot } from './asset-librarian-v1.2-cdp.mjs';
import { resetSelection, setFilters, openResult, selectResult, setConsumer, handoff, assertHandoff, canvasProbe } from './asset-librarian-v1.2-ui.mjs';

export async function runTasksA(cdp,result){
  await setFilters(cdp,{query:'OrcRaider',kind:'model-3d'});
  const orc=await openResult(cdp,A.orc);assert(!String(orc.preview).startsWith('Preview failed'),orc.preview);result.tasks.T1={orc,webgl:await canvasProbe(cdp)};
  assert(orc.pinned.includes(`/${result.registrySourceCommit}/`),'T1 pinned RAW is not commit-pinned');
  assert(/complete|embedded|missing|unresolved/.test(orc.badges),`T1 dependency status absent: ${orc.badges}`);
  await setFilters(cdp,{query:'orc_texture_A',kind:'image-2d'});const tex=await openResult(cdp,A.orcTexture);
  const dims=await waitFor(cdp,`(()=>{const i=document.getElementById('imagePreviewImg');return i?.naturalWidth>0?[i.naturalWidth,i.naturalHeight]:null;})()`,'orc texture dimensions');
  result.tasks.T1.texture={...tex,dimensions:dims};await screenshot(cdp,'t1-orc-raider');

  await resetSelection(cdp);
  await cdp.evaluate(`document.getElementById('galleryViewButton').click();true`);
  await setFilters(cdp,{query:'Rover',kind:'model-3d'});
  const galleryThumb=await waitFor(cdp,`(()=>{const card=[...document.querySelectorAll('.result-card')].find(c=>c.dataset.assetId===${JSON.stringify(A.rover)});const img=card?.querySelector('.result-thumb img');return img?.src?.startsWith('data:image/')?img.src.length:0;})()`,'Rover_Round gallery 3D thumbnail',90000);
  assert(galleryThumb>1000,`T2 Rover gallery thumbnail not rendered: ${galleryThumb}`);
  await screenshot(cdp,'t2-rover-gallery');
  await openResult(cdp,A.rover);await selectResult(cdp,A.rover);await setConsumer(cdp,'stunt-car-race');
  const h2=await handoff(cdp);assertHandoff(h2,'stunt-car-race',[A.rover]);result.tasks.T2={asset:A.rover,gallery3DThumbnail:true,handoffAssets:h2.assets.map(a=>a.path)};await screenshot(cdp,'t2-rover-round');

  await resetSelection(cdp);await setFilters(cdp,{query:'Rig_Medium',kind:'model-3d',rigged:'yes',animated:'yes'});
  const mediumCount=await cdp.evaluate(`document.querySelectorAll('.result-card').length`);assert(mediumCount>=3,`T3 expected >=3 Rig_Medium results, got ${mediumCount}`);
  for(const x of A.medium)await selectResult(cdp,x);await openResult(cdp,A.medium[0]);await setConsumer(cdp,'animation-lab');
  const h3=await handoff(cdp);assertHandoff(h3,'animation-lab',A.medium);assert(h3.assets.filter(a=>A.medium.includes(a.path)).every(a=>a.rigFacts?.hasSkin&&a.rigFacts?.animationCount>0),'T3 selected assets not rigged+animated');
  result.tasks.T3={matches:mediumCount,assets:A.medium,animationCounts:h3.assets.filter(a=>A.medium.includes(a.path)).map(a=>a.rigFacts.animationCount)};await screenshot(cdp,'t3-rig-medium');
}
