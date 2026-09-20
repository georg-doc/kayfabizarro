import { makeEditLayer } from '../KFB-ToolBox/shared/scene-patch/edit-layer.v1.js';
import { makeScenePatchSession } from '../KFB-ToolBox/shared/scene-patch/scene-patch.v1.js';

const BASE_REVISION = '6c1b02a3338c005127d45bc7bff3ecbb785f1342';

function slug(s='object') {
  return String(s).toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') || 'object';
}
function downloadJson(doc, name) {
  const href=URL.createObjectURL(new Blob([JSON.stringify(doc,null,2)],{type:'application/json'}));
  const a=document.createElement('a');a.href=href;a.download=name;document.body.append(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(href),500);
}
function isTyping(e){return /^(INPUT|TEXTAREA|SELECT)$/.test(e.target?.tagName||'');}

export function makeResidentScenePatchAdapter(ctx) {
  const records=new Map();
  let session=null, selected=null;
  const viewer={scene:ctx.scene,camera:ctx.camera,controls:ctx.controls};
  const status=ctx.status;
  const setStatus=(extra='')=>{
    if(!status)return;
    const s=session?.stats();
    const sel=selected?.userData?.scenePatchRecord;
    status.textContent=session
      ? `${s.changed} changed · undo ${s.undo} · ${s.draft?'draft saved':'no draft'}${sel?' · '+sel.label:''}${extra?' · '+extra:''}`
      : 'load a scene first';
  };
  const recordOf=(node)=>{
    const r=node?.userData?.scenePatchRecord;
    return r?.editable===false?null:r;
  };
  const edit=makeEditLayer(viewer,ctx.canvas,{
    getRoot:ctx.getRoot,
    recordOf,
    groupOf:(r)=>r?.group||null,
    menu:ctx.menu,
    gridStep:0.05,
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
  edit.gizmo.addEventListener('mouseUp',()=>{session?.commit(edit.selection,edit.mode);setStatus();});

  function bindScene(def,nodes) {
    records.clear();
    for(const node of nodes||[]) {
      const r=node.userData.scenePatchRecord;
      if(r?.editable!==false) records.set(r.id,node);
    }
    edit.clear();
    selected=null;
    const sourceFile=def.__sourceFile||(`${def.id}.json`);
    session=makeScenePatchSession({
      host:'resident-atlas',
      source:{
        assetId:`resident-scene:${def.id}`,
        sourceRef:`tools/resident_atlas/scenes/${sourceFile}`,
        revision:BASE_REVISION
      },
      resolve:(id)=>records.get(id)||null,
      recordOf,
      storageKey:`kfb.scene-patch.v1:resident-atlas:${def.id}`,
      onApplied:(touched)=>{ctx.onEdited?.(touched);edit.follow();}
    });
    session.register([...records.values()]);
    setStatus(session.readDraft()?'draft available':'ready');
    return session;
  }

  function toggleEditor(force) {
    const on=force===undefined?!edit.on:!!force;
    edit.setOn(on);
    ctx.editorButton?.classList.toggle('active',on);
    if(ctx.dock)ctx.dock.hidden=!on;
    setStatus(on?'editor on':'editor off');
    return on;
  }

  ctx.editorButton?.addEventListener('click',()=>toggleEditor());
  ctx.undoButton?.addEventListener('click',()=>{session?.undo();edit.follow();setStatus();});
  ctx.redoButton?.addEventListener('click',()=>{session?.redo();edit.follow();setStatus();});
  ctx.resetButton?.addEventListener('click',()=>{const n=session?.reset()||0;edit.clear();setStatus(`${n} reset`);});
  ctx.draftButton?.addEventListener('click',()=>{
    if(!session)return;
    const r=session.restoreDraft();
    edit.clear();
    setStatus(r.ok?`${r.applied||0} restored`:r.errors.join(', '));
  });
  ctx.exportButton?.addEventListener('click',()=>{
    if(!session)return;
    const doc=session.makePatch();
    downloadJson(doc,`resident-${ctx.getSceneId?.()||'scene'}.scene-patch.json`);
    setStatus(`${doc.ops.length} ops exported`);
  });
  ctx.importButton?.addEventListener('click',()=>ctx.fileInput?.click());
  ctx.fileInput?.addEventListener('change',async()=>{
    const file=ctx.fileInput.files?.[0];ctx.fileInput.value='';
    if(!file||!session)return;
    try{
      const doc=JSON.parse(await file.text());
      const r=session.applyPatch(doc,'import');
      edit.clear();
      setStatus(r.ok?`${r.applied||0} imported`:r.errors.join(', '));
    }catch(e){setStatus('invalid JSON: '+(e?.message||e));}
  });
  addEventListener('keydown',(e)=>{
    if(isTyping(e))return;
    if(e.key==='Escape'){edit.clear();selected=null;setStatus();return;}
    if(!edit.on)return;
    if(e.key==='g')edit.setMode('translate');
    if(e.key==='r')edit.setMode('rotate');
    if(e.key==='s')edit.setMode('scale');
  });

  return { edit, bindScene, toggleEditor, get session(){return session;}, resolve:(id)=>records.get(id)||null, editableNodes:()=>[...records.values()], setStatus };
}

export function stampResidentPatchRecords(def,nodes) {
  nodes.forEach((node,index)=>{
    const a=def.assets[index];
    if(!a)return;
    node.userData.scenePatchRecord={
      id:`${def.id}:${a.group}:${String(index).padStart(2,'0')}:${slug(a.name)}`,
      assetId:a.path,
      sourceRef:a.path,
      group:a.group,
      sceneId:def.id,
      index,
      label:a.name,
      editable:a.group!=='actor'
    };
  });
  return nodes;
}
