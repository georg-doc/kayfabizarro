import { makeEditLayer } from '../../../KFB-ToolBox/shared/scene-patch/edit-layer.v1.js';
import { makeScenePatchSession } from '../../../KFB-ToolBox/shared/scene-patch/scene-patch.v1.js';

const BASE_REVISION='6c1b02a3338c005127d45bc7bff3ecbb785f1342';
const DUNGEON_ROOT='media/3D_Assets/KayKit_Dungeon_Pack_1.1_FREE 2/Assets/gltf/';

function sourcePath(rec){
  const name=rec?.a?.split(':')[1];
  return name?DUNGEON_ROOT+name+'.gltf':null;
}
function downloadJson(doc,name){
  const href=URL.createObjectURL(new Blob([JSON.stringify(doc,null,2)],{type:'application/json'}));
  const a=document.createElement('a');a.href=href;a.download=name;document.body.append(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(href),500);
}
function isTyping(e){return /^(INPUT|TEXTAREA|SELECT)$/.test(e.target?.tagName||'');}

export function makeDungeonScenePatchAdapter(ctx){
  const records=new Map();
  let session=null,selected=null,currentModel=null;
  const recordOf=(n)=>n?.userData?.scenePatchRecord||null;
  const isEditable=(r)=>r?.editable===true;
  const setStatus=(extra='')=>{
    if(!ctx.status)return;
    const s=session?.stats(),rec=selected&&recordOf(selected);
    ctx.status.textContent=session
      ? `${s.changed} changed · ${records.size} candle props · undo ${s.undo} · ${s.draft?'draft saved':'no draft'}${rec?' · '+rec.label+(rec.editable?'':' · read only'):''}${extra?' · '+extra:''}`
      : 'generate dungeon first';
  };
  const viewer={scene:ctx.viewer.scene,camera:ctx.viewer.camera,controls:ctx.viewer.controls};
  const edit=makeEditLayer(viewer,ctx.canvas,{
    getRoot:ctx.getRoot,
    recordOf,
    groupOf:(r)=>r?.group||null,
    isEditable,
    menu:ctx.menu,
    gridStep:0.1,
    angleStep:15,
    onPick:(node,rec)=>{selected=node||null;ctx.onPick?.(node,rec);setStatus();},
    onChange:(nodes)=>{ctx.onEdited?.(nodes);setStatus();},
    onMenu:(action)=>{
      if(action==='floor'&&session){
        session.begin(edit.selection,'drop');
        const rows=edit.drop();
        session.commit(edit.selection,'drop');
        ctx.onEdited?.(edit.selection);
        setStatus(rows.map(x=>x.refused||(`floor ${x.to}`)).join(', '));
      }
    }
  });
  edit.gizmo.addEventListener('mouseDown',()=>session?.begin(edit.selection,edit.mode));
  edit.gizmo.addEventListener('mouseUp',()=>{session?.commit(edit.selection,edit.mode);ctx.onEdited?.(edit.selection);setStatus();});

  function bindDungeon(model,root){
    currentModel=model;
    records.clear();edit.clear();selected=null;
    root?.children?.forEach((node,index)=>{
      const rec=node.userData.recipe;
      const path=sourcePath(rec);
      if(!rec||!path)return;
      const name=rec.a.split(':')[1],editable=rec.layer==='candle';
      const patchRec={
        id:`dungeon:${model.seed}:L${rec.level??'x'}:${String(index).padStart(3,'0')}:${name}`,
        assetId:path,sourceRef:path,
        group:`L${rec.level??'x'}:${rec.layer}`,
        label:name,layer:rec.layer,level:rec.level,index,editable
      };
      node.userData.scenePatchRecord=patchRec;
      if(editable)records.set(patchRec.id,node);
    });
    const density=model.params?.density??'na';
    const source={
      assetId:`dungeon-s13-2:${model.seed}:${model.grid}:${density}`,
      sourceRef:'tools/world_atlas/source/KayKit_Dungeon_Generator_S13_2.html',
      revision:BASE_REVISION,
      context:{seed:model.seed,grid:model.grid,density}
    };
    session=makeScenePatchSession({
      host:'dungeon',
      source,
      resolve:(id)=>records.get(id)||null,
      recordOf,
      storageKey:`kfb.scene-patch.v1:dungeon:${source.assetId}`,
      onApplied:(nodes)=>{ctx.onEdited?.(nodes);edit.follow();}
    });
    session.register([...records.values()]);
    setStatus(session.readDraft()?'draft available':'ready');
    return session;
  }

  function toggleEditor(force){
    const on=force===undefined?!edit.on:!!force;
    edit.setOn(on);ctx.editorButton?.setAttribute('aria-pressed',String(on));
    if(ctx.dock)ctx.dock.hidden=!on;
    setStatus(on?'editor on':'editor off');return on;
  }

  ctx.editorButton?.addEventListener('click',()=>toggleEditor());
  ctx.undoButton?.addEventListener('click',()=>{session?.undo();ctx.onEdited?.(edit.selection);edit.follow();setStatus();});
  ctx.redoButton?.addEventListener('click',()=>{session?.redo();ctx.onEdited?.(edit.selection);edit.follow();setStatus();});
  ctx.resetButton?.addEventListener('click',()=>{const n=session?.reset()||0;edit.clear();ctx.onEdited?.([...records.values()]);setStatus(`${n} reset`);});
  ctx.draftButton?.addEventListener('click',()=>{if(!session)return;const r=session.restoreDraft();edit.clear();setStatus(r.ok?`${r.applied||0} restored`:r.errors.join(', '));});
  ctx.exportButton?.addEventListener('click',()=>{if(!session)return;const doc=session.makePatch();downloadJson(doc,`dungeon-${currentModel?.seed||'seed'}.scene-patch.json`);setStatus(`${doc.ops.length} ops exported`);});
  ctx.importButton?.addEventListener('click',()=>ctx.fileInput?.click());
  ctx.fileInput?.addEventListener('change',async()=>{
    const file=ctx.fileInput.files?.[0];ctx.fileInput.value='';
    if(!file||!session)return;
    try{const doc=JSON.parse(await file.text()),r=session.applyPatch(doc,'import');edit.clear();setStatus(r.ok?`${r.applied||0} imported`:r.errors.join(', '));}
    catch(e){setStatus('invalid JSON: '+(e?.message||e));}
  });
  addEventListener('keydown',(e)=>{
    if(isTyping(e))return;
    if(e.key==='Escape'){edit.clear();selected=null;setStatus();return;}
    if(!edit.on)return;
    if(e.key==='g')edit.setMode('translate');
    if(e.key==='r')edit.setMode('rotate');
    if(e.key==='s')edit.setMode('scale');
  });

  return {edit,bindDungeon,toggleEditor,get session(){return session;},resolve:(id)=>records.get(id)||null,editableNodes:()=>[...records.values()],setStatus};
}
