/* KFB WorldBuilder · WB2-DESIGN-01 · authoring/UI refinement on the accepted WB2 source
   Base: tools/KFB-ToolBox/worldbuilder/wb2-terrain-sculpt-01/WB2_TERRAIN_SCULPT_01_SOURCE.html
         blob a250f1a36137121942f0f99d6a259146d718b162 @ ec52eb746be8c1a0e6f3f3d62857ed4b3121b284 (GEORG HUMAN PASS)
   Owners reused unchanged (imported, not copied into this file):
     · tools/KFB-ToolBox/lib/edit-layer.js  (c15a200b…)  — selection · Move · Rotate · Scale · Drop · World/Local
     · ../wb2-terrain-sculpt-01/terrain-sculpt.js (182f7c42…) — sculpt strokes · falloff · dab math
   Engine, terrain truth, scene document, storage key and self-test are ported 1:1 from the accepted source.
   This pass changes only the authoring chrome and adds the presentation seam (wb2d-presentation.js).
   ZyFou/ProceduralTerrains@f58a8ddb81d1fbb526a41282a9a7e9c05c2d2070 · MIT — see notice below. */
/*
 * Third-party notice for the adapted ProceduralTerrains subset below.
 * Source: ZyFou/ProceduralTerrains@f58a8ddb81d1fbb526a41282a9a7e9c05c2d2070
 *
 * MIT License
 *
 * Copyright (c) 2026 ZyFou
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense,
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { makeEditLayer } from '../../lib/edit-layer.js';
import { ensureSculpt, brushWeight, makeStroke, pointSpacing, addStrokePoint, sculptDeltaAt, applyDabToGeometry, strokeCount } from '../wb2-terrain-sculpt-01/terrain-sculpt.js';
import { makePresentation, PROFILES, TERRAIN_LOOKS, OBJECT_LOOKS, LIGHT_PARAMS, TORCH_KEYS } from './wb2d-presentation.js';

/* ---------------- chrome ---------------- */
const CSS = `
#wb2d{--bg:#17150f;--panel:rgba(26,23,17,.94);--panel2:#211e17;--line:#554d3d;--text:#f2eadb;--muted:#b7aa91;--accent:#e3b466;--ok:#8fc58a;--bad:#e48d7e;
  position:fixed;inset:0;display:grid;grid-template-columns:minmax(0,1fr) auto;background:var(--bg);color:var(--text);
  font:13px/1.35 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
#wb2d *{box-sizing:border-box}
#wb2d [hidden]{display:none!important}
#wb2d button,#wb2d input,#wb2d select{font:inherit;color:inherit}
#wb2d button{border:1px solid var(--line);background:#2a261d;border-radius:7px;padding:5px 9px;font-weight:650;cursor:pointer;white-space:nowrap;line-height:1.2}
#wb2d button:hover{border-color:#82755c}
#wb2d button[disabled]{opacity:.42;cursor:not-allowed}
#wb2d button.active{border-color:var(--accent);color:#ffe2a7;background:#342c1d}
#wb2d button.quiet{background:transparent;border-color:transparent;color:var(--muted)}
#wb2d button.quiet:hover{border-color:var(--line);color:var(--text)}
#wb2d button.hide-off[disabled]{display:none}
#wb2d kbd{font:600 10px ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--muted);border:1px solid var(--line);border-bottom-width:2px;border-radius:4px;padding:0 4px;margin-left:6px}
#wb2d button.active kbd{color:#ffe2a7;border-color:#8a6f3e}
#wb2d input[type=range]{accent-color:var(--accent);height:14px}
#wb2d input[type=number]{border:1px solid var(--line);background:#15130f;border-radius:6px;padding:4px 6px;width:78px}
#wb2d select{border:1px solid var(--line);background:#15130f;border-radius:6px;padding:4px 6px;max-width:150px}
#stage{position:relative;min-width:0;min-height:0;overflow:hidden}
#stage canvas{display:block;width:100%;height:100%;touch-action:none}
#top{position:absolute;z-index:11;left:10px;right:10px;top:10px;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-start;gap:8px;pointer-events:none}
.col{display:flex;flex-direction:column;gap:6px;align-items:flex-start;pointer-events:none}
.col>.cl{pointer-events:auto}
#top>*{pointer-events:auto}
.cl{display:flex;gap:4px;align-items:center;flex-wrap:nowrap;background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:4px;box-shadow:0 6px 18px #05030a55}
.brand{font-size:11px;letter-spacing:.14em;font-weight:750;padding:0 8px 0 6px}
.brand span{color:var(--muted);font-weight:500;letter-spacing:.06em;margin-left:6px}
.sep{width:1px;align-self:stretch;background:var(--line);margin:3px 3px}
#review button.done::after{content:'✓';margin-left:5px;color:var(--ok);font-size:11px}
#status{max-width:min(560px,70vw);color:var(--muted);font-size:11px;pointer-events:none;background:var(--panel);border:1px solid var(--line);border-radius:7px;padding:3px 8px}
#status:empty{display:none}
#status.ok{color:var(--ok)}#status.bad{color:var(--bad)}
#dock{position:absolute;z-index:10;left:10px;right:10px;bottom:12px;display:flex;flex-direction:column;align-items:center;gap:6px;pointer-events:none}
#dock>.cl{pointer-events:auto;flex-wrap:wrap;justify-content:center;row-gap:4px}
.grp{display:flex;gap:4px;align-items:center}
.brush{display:flex;align-items:center;gap:6px;color:var(--muted);font-size:11px;padding:0 4px}
.brush input[type=range]{width:88px}
.brush output{min-width:30px;color:var(--text);font:11px ui-monospace,SFMono-Regular,Menlo,monospace}
.count{color:var(--muted);font:11px ui-monospace,SFMono-Regular,Menlo,monospace;padding:0 6px 0 2px}
#pick{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--muted);padding-left:4px}
#pick b{color:var(--text);max-width:170px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#legend{display:flex;gap:14px;color:var(--muted);font-size:11px;pointer-events:none;white-space:nowrap;background:var(--panel);border:1px solid var(--line);border-radius:7px;padding:4px 10px}
#legend kbd{margin:0 4px 0 0}
#facts{position:absolute;z-index:9;left:10px;bottom:10px;padding:8px 10px;background:var(--panel);border:1px solid var(--line);border-radius:10px;font:10px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--muted);max-width:min(620px,calc(100% - 20px));overflow-wrap:anywhere}
#facts b{color:var(--text);font-family:system-ui,sans-serif;font-size:11px}
#facts .lock{color:var(--accent);font-family:system-ui,sans-serif}
#drawer{width:0;overflow:hidden;background:var(--panel2);border-left:1px solid var(--line);display:flex;flex-direction:column;min-height:0}
#wb2d.open #drawer{width:292px}
.dhead{display:flex;align-items:center;justify-content:space-between;padding:10px 10px 8px 14px;border-bottom:1px solid rgba(255,255,255,.07)}
.dhead h1{font-size:11px;letter-spacing:.14em;text-transform:uppercase;margin:0}
.dbody{overflow:auto;padding:4px 14px 18px;flex:1;min-height:0}
.sec{padding-top:12px;margin-top:12px;border-top:1px solid rgba(255,255,255,.07)}
.sec:first-child{border-top:0;margin-top:0}
.sec h2{font-size:10px;text-transform:uppercase;letter-spacing:.12em;color:var(--muted);margin:0 0 8px;font-weight:650}
.row{display:flex;gap:5px;flex-wrap:wrap;align-items:center}
.field{display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center;margin:5px 0;color:var(--muted);font-size:11px}
.field.rng{grid-template-columns:1fr 112px 36px}
.field.rng output{font:10px ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--text);text-align:right}
.badge{display:inline-block;padding:2px 6px;border:1px solid var(--line);border-radius:999px;color:var(--muted);font:10px ui-monospace,SFMono-Regular,Menlo,monospace}
.src{font:10px/1.45 ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--muted);overflow-wrap:anywhere}
.src b{color:var(--text)}
#doc{white-space:pre-wrap;max-height:240px;overflow:auto;background:#13110d;border:1px solid var(--line);border-radius:8px;padding:8px;font:10px ui-monospace,SFMono-Regular,Menlo,monospace;color:#cfc2aa;margin-top:8px}
#selftest{white-space:pre-wrap;font:10px ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--ok);margin-top:8px}
#objmenu{position:absolute;z-index:10;display:flex;gap:3px;padding:3px;border-radius:7px;background:#14130fee;border:1px solid #4a4433;box-shadow:0 6px 18px #05030a80;transform:translate(-50%,0)}
#objmenu button{width:28px;height:28px;padding:0;font-size:13px;line-height:1;border-radius:5px}
#objmenu .scale-pair{display:flex;gap:1px;border:1px solid var(--line);border-radius:5px;overflow:hidden}
#objmenu .scale-pair button{width:23px;border:0;border-radius:0;background:#2a261d}
#objmenu .scale-pair button+button{border-left:1px solid var(--line)}
@media(max-width:720px){
  #wb2d{grid-template-columns:1fr;grid-template-rows:minmax(0,1fr) auto}
  #wb2d.open #drawer{width:auto;max-height:44vh;border-left:0;border-top:1px solid var(--line)}
  .brand span,#legend{display:none}
}`;

const HTML = `
<main id="stage">
  <div id="top">
    <div class="col"><div class="cl">
      <div class="brand">WORLDBUILDER<span>WB2</span></div>
      <div id="review" class="grp">
        <button id="viewActor" class="active" title="Review the exact actor source">Actor</button>
        <button id="viewProp" title="Review the exact prop source">Prop</button>
        <button id="viewScene" disabled title="Unlocks after Actor + Prop review">Scene</button>
      </div>
    </div><div id="status">loading engine…</div></div>
    <div class="cl">
      <span id="wiGrp" class="grp" hidden>
        <button id="wiPlay" title="Play · walk this world (Tab)">Play<kbd>Tab</kbd></button>
        <button id="wiEdit" class="active" title="Edit · terrain + objects (Tab)">Edit</button>
        <span class="sep"></span>
      </span>
      <span id="saveGrp" class="grp" hidden>
        <button id="save" title="Save scene locally">Save</button>
        <button id="reload" class="quiet" title="Reload the saved scene">Reload</button>
        <span class="sep"></span>
      </span>
      <button id="tabTerrain" class="quiet" data-tab="terrain" hidden>Terrain</button>
      <button id="tabLook" class="quiet" data-tab="look">Look</button>
      <button id="tabDoc" class="quiet" data-tab="doc" hidden>Scene</button>
    </div>
  </div>
  <div id="facts"></div>
  <div id="wiHud" class="cl" hidden style="position:absolute;z-index:10;left:50%;bottom:12px;transform:translateX(-50%);flex-wrap:wrap;justify-content:center;gap:12px;padding:5px 12px;font-size:11px;color:var(--muted);max-width:calc(100% - 20px)"><span style="white-space:nowrap"><kbd>W</kbd><kbd>S</kbd> walk</span><span style="white-space:nowrap"><kbd>A</kbd><kbd>D</kbd> turn</span><span style="white-space:nowrap"><kbd>Q</kbd><kbd>E</kbd> strafe</span><span style="white-space:nowrap"><kbd>Shift</kbd> run</span><span style="white-space:nowrap"><kbd>Space</kbd> jump</span><span style="white-space:nowrap"><kbd>drag</kbd> look</span><span style="white-space:nowrap"><kbd>Tab</kbd> edit</span><b id="wiState" style="color:var(--text);font:600 11px ui-monospace,SFMono-Regular,Menlo,monospace"></b></div>
  <div id="dock" hidden>
  <div id="legend" hidden><span><kbd>drag</kbd>sculpt</span><span><kbd>wheel</kbd>radius</span><span><kbd>Space</kbd>hold to orbit</span><span><kbd>Esc</kbd>object</span></div>
  <div class="cl">
    <div class="grp">
      <button id="sculptObject" class="active" title="Object / Orbit">Object<kbd>1</kbd></button>
      <button id="sculptRaise" title="Raise terrain">Raise<kbd>2</kbd></button>
      <button id="sculptLower" title="Lower terrain">Lower<kbd>3</kbd></button>
    </div>
    <span class="sep"></span>
    <div id="brushGrp" class="grp" hidden>
      <label class="brush" title="Brush radius · wheel / trackpad">Radius<input id="sculptRadius" type="range" min=".45" max="5" step="any" value="1.25"><output id="radiusOut">1.25</output></label>
      <label class="brush" title="Strength per dab">Strength<input id="sculptStrength" type="range" min=".01" max=".8" step=".01" value=".12"><output id="strengthOut">0.12</output></label>
      <span class="sep"></span>
    </div>
    <div class="grp">
      <button id="sculptUndo" class="quiet" title="Undo last sculpt stroke">Undo</button>
      <button id="sculptClear" class="quiet" title="Clear sculpt layer · procedural base stays">Clear</button>
      <span id="sculptCount" class="count" title="Sculpt strokes">0 strokes</span>
    </div>
    <div id="objGrp" class="grp">
      <span class="sep"></span>
      <button id="snap" class="active quiet" title="Snap 0.05 / 15°">Snap</button>
      <div id="pick" hidden><b></b><button id="remove" class="quiet" disabled title="Remove selected">Remove</button></div>
      <button id="addActor" class="hide-off quiet" disabled>+ Caveman</button>
      <button id="addProp" class="hide-off quiet" disabled>+ Boulder</button>
    </div>
  </div></div>
  <div id="objmenu" hidden>
    <button data-m="translate" title="Move (g)">✥</button>
    <button data-m="rotate" title="Rotate (r)">⟳</button>
    <span class="scale-pair" title="Uniform size · S keeps the free scale gizmo"><button data-m="scale-down" title="Smaller ×0.8">−</button><button data-m="scale-up" title="Larger ×1.25">+</button></span>
    <button data-m="floor" title="Drop onto the visible surface below">⬓</button>
    <button data-m="space" title="World / local axes">⊹</button>
    <button data-m="close" title="Clear selection (Esc)">✕</button>
  </div>
</main>
<aside id="drawer">
  <div class="dhead"><h1 id="drawerTitle">Look</h1><button id="drawerClose" class="quiet" title="Close">✕</button></div>
  <div class="dbody">
    <div id="paneTerrain" hidden>
      <div class="sec">
        <h2>Procedural base</h2>
        <div class="field"><label for="seed">Seed</label><input id="seed" type="number" step="1" value="43129"></div>
        <div class="field"><label for="height">Height</label><input id="height" type="number" min="0" max="8" step=".1" value="2.6"></div>
        <div class="field"><label for="macro">Macro scale</label><input id="macro" type="number" min=".5" max="8" step=".1" value="3.2"></div>
        <div class="field"><label for="detail">Detail</label><input id="detail" type="number" min=".1" max="2" step=".05" value=".55"></div>
        <div class="row" style="margin-top:8px"><button id="regen">Regenerate</button></div>
        <div id="terrainSig" class="src" style="margin-top:8px"></div>
      </div>
      <div class="sec">
        <h2>Source</h2>
        <div class="src">ZyFou/ProceduralTerrains@f58a8ddb · MIT<br>final = base(x,z) + sculpt(x,z) · reversible</div>
      </div>
    </div>
    <div id="paneLook">
      <div id="wiLook" class="sec" hidden>
        <h2>World</h2>
        <div class="row"><button id="wiInk" class="quiet" title="w0-ink · outlines only around drawn geometry">Ink off</button><button id="wiNames" class="active" title="Street name signs">Names</button></div>
        <div class="field" style="margin-top:8px"><label for="wiSky">Sky</label><select id="wiSky"></select></div>
        <div class="field"><label for="wiMotion">Motion set</label><select id="wiMotion"></select></div>
        <div id="wiInkFacts" class="src" style="margin-top:6px"></div>
      </div>
      <div class="sec">
        <h2>Light</h2>
        <div id="profileSeg" class="row"></div>
        <div id="lightFields" style="margin-top:6px"></div>
      </div>
      <div class="sec">
        <h2>Surface</h2>
        <div class="field"><label for="lookTerrain">Terrain</label><select id="lookTerrain"></select></div>
        <div class="field"><label for="lookObjects">Objects</label><select id="lookObjects"></select></div>
        <div class="field rng"><label for="story">Story palette</label><input id="story" type="range" min="0" max="1" step=".01" value="0"><output id="storyOut"></output></div>
      </div>
      <div class="sec">
        <div class="src">WorldDesign Lab donors · wd-light.js · wd-look.js<br>light ⟂ surface · SOURCE = untouched material</div>
      </div>
    </div>
    <div id="paneDoc" hidden>
      <div id="wiDoc" class="sec" hidden>
        <h2>World zone</h2>
        <div class="field"><label for="wiZoneSel">Zone</label><select id="wiZoneSel" title="Same WorldBuilder, same presenter rules · reloads"></select></div>
        <div id="wiZone" class="src"></div>
        <div class="row" style="margin-top:8px"><button id="wiSelftest" class="quiet">Run world self-test</button></div>
        <div id="wiTest" class="src" style="margin-top:6px;white-space:pre-wrap"></div>
      </div>
      <div class="sec">
        <h2>Scene document</h2>
        <div class="row">
          <button id="exportDoc" class="quiet">Copy JSON</button>
          <button id="importDoc" class="quiet">Import JSON</button>
          <button id="resetScene" class="quiet">Reset fixture</button>
        </div>
        <div id="saveState" class="src" style="margin-top:8px">No local save yet.</div>
        <div id="doc"></div>
      </div>
      <div class="sec">
        <h2>Owners</h2>
        <div class="src">
          <b>Object edit</b> lib/edit-layer.js · c15a200b<br>
          <b>Sculpt</b> wb2-terrain-sculpt-01/terrain-sculpt.js · 182f7c42<br>
          <b>Resident</b> Resident Atlas Caveman · Rig_Medium · Melee_Unarmed_Idle<br>
          <b>WorldBuilder</b> terrain settings · sculpt strokes · source refs · transforms
        </div>
      </div>
      <div id="selftest" class="sec" hidden></div>
    </div>
  </div>
</aside>`;

const styleEl = document.createElement('style');
styleEl.textContent = CSS;
document.head.appendChild(styleEl);
const APP = document.createElement('div');
APP.id = 'wb2d';
APP.innerHTML = HTML;
document.body.appendChild(APP);

/* ---------------- WORLD-INTEGRATION-01 seam ----------------
   One flag decides what this WorldBuilder authors. Unset = the accepted WB2 sandbox, unchanged.
   `world=<zone>` (URL or host prop) = a real World Zone in the SAME engine, scene document,
   sculpt layer, edit layer and save/reload — plus Play, which reads that same state. */
const WORLD_ID=new URLSearchParams(location.search).get('world')||(window.__wb2dProps&&window.__wb2dProps.world)||'';
const WI=WORLD_ID?await import('../world-integration-01/wi1-world.js'):null;
const WORLD=WI?await WI.prepare(WORLD_ID):null;
let PLAY=null;

/* ---------------- accepted WB2 constants (unchanged) ---------------- */
const ASSET_COMMIT='891eadf01e218f5fc21387e64cea1fec8332c5b6';
const ANIM_COMMIT='aa16a777a970f23d3f11fb3c23dc40718b04fa88';
const ZYFOU_COMMIT='f58a8ddb81d1fbb526a41282a9a7e9c05c2d2070';
const STORAGE_KEY=WORLD?WORLD.storageKey:'kfb-wb2-terrain-sculpt-01';
const DOC_ID=WORLD?WORLD.docId:'wb2-terrain-sculpt-01';
const ACTOR={
  id:'resident-caveman',kind:'resident',name:'Caveman',residentId:'caveman',rigFamily:'Rig_Medium',
  path:'media/3D_Assets/KayKit_Mystery_Series6/8 - February 2025 - Caveman/characters/Caveman.glb',
  commit:ASSET_COMMIT,fit:{height:2.2},
  texture:{path:'media/3D_Assets/KayKit_Mystery_Series6/8 - February 2025 - Caveman/assets/gltf/caveman_texture.png',commit:ASSET_COMMIT},
  clip:{name:'Melee_Unarmed_Idle',path:'media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/Rig_Medium/Rig_Medium_CombatMelee.glb',commit:ANIM_COMMIT}
};
const PROP={
  id:'landmark-boulder',kind:'prop',name:'Boulder · Rock_3_E_Color1',
  path:'media/3D_Assets/KayKit_Forest_Nature_Pack_1.0_FREE/Assets/gltf/Rock_3_E_Color1.gltf',
  commit:ASSET_COMMIT,fit:{max:1.35}
};
const DEFAULT_DOC={
  format:'kfb-worldbuilder-scene',version:1,id:'wb2-terrain-sculpt-01',
  terrain:{seed:43129,height:2.6,macroScale:3.2,detail:0.55,sculpt:{version:1,strokes:[]}},
  sources:{
    terrain:{repo:'ZyFou/ProceduralTerrains',commit:ZYFOU_COMMIT,license:'MIT',files:['src/engine/terrain/noise/cpuNoise.js','src/engine/terrain/noise/seedDomain.js']},
    terrainSculpt:{owner:'KFB WorldBuilder',module:'tools/KFB-ToolBox/worldbuilder/wb2-terrain-sculpt-01/terrain-sculpt.js',version:1,interaction:['raise','lower','radius','strength','undo','clear','stroke-save-reload']},
    sceneEdit:{owner:'KFB ToolBox',module:'tools/KFB-ToolBox/lib/edit-layer.js',baseDonorBlob:'c97b3537f71e939176f3ae5ce7ae83feabb7918f',moduleBlob:'c15a200ba8615d55f9d3ae26616e0a8ceba8dc01',lineage:['Dungeon Room Study S21/S22','Resident Atlas S7','ToolBox R3 uniform-scale extension'],interaction:['object-menu','pointerup-select','translate','rotate','scale-gizmo','uniform-scale-down','uniform-scale-up','drop','world-local','snap']},
    resident:{owner:'KFB Resident Atlas',residentId:'caveman',donorPath:'tools/resident_atlas/scenes/caveman-cave-camp.json'}
  },
  objects:[
    {id:ACTOR.id,kind:ACTOR.kind,name:ACTOR.name,source:{path:ACTOR.path,commit:ACTOR.commit},
     resident:{id:ACTOR.residentId,rigFamily:ACTOR.rigFamily,texture:{path:ACTOR.texture.path,commit:ACTOR.texture.commit},clip:{name:ACTOR.clip.name,path:ACTOR.clip.path,commit:ACTOR.clip.commit}},
     transform:{position:[-2.2,null,0.2],rotation:[0,0.35,0],scale:[1,1,1]}},
    {id:PROP.id,kind:PROP.kind,name:PROP.name,source:{path:PROP.path,commit:PROP.commit},
     transform:{position:[2.2,null,-0.6],rotation:[0,-0.45,0],scale:[1,1,1]}}
  ]
};
const deepClone=v=>JSON.parse(JSON.stringify(v));
if(WORLD)WORLD.patchDoc(DEFAULT_DOC);
let sceneDoc=deepClone(DEFAULT_DOC);
const E=id=>document.getElementById(id);
const enc=p=>p.split('/').map(encodeURIComponent).join('/');
const raw=(p,c)=>'https://raw.githubusercontent.com/georg-doc/kayfabizarro/'+c+'/'+enc(p);
const status=(t,k='')=>{if(WORLD&&k!=='bad'){E('status').textContent='';E('status').className='';return}E('status').textContent=t;E('status').className=k};   // world mode: errors only, no meta chatter
const near=(a,b,e=1e-3)=>Math.abs(a-b)<=e;
const UI={legend:true,selectionRing:true};

/* ---- ZyFou/ProceduralTerrains pinned MIT subset: cpuNoise.js + seedDomain.js (unchanged) ---- */
function fract(v){return v-Math.floor(v)}
function hash12(px,py){
  let p3x=fract(px*0.1031),p3y=fract(py*0.1031),p3z=p3x;
  const d=p3x*(p3y+33.33)+p3y*(p3z+33.33)+p3z*(p3x+33.33);
  p3x+=d;p3y+=d;
  return fract((p3x+p3y)*(p3z+d));
}
function vnoise2(px,py){
  const ix=Math.floor(px),iy=Math.floor(py),fx=px-ix,fy=py-iy;
  const ux=fx*fx*fx*(fx*(fx*6-15)+10),uy=fy*fy*fy*(fy*(fy*6-15)+10);
  const a=hash12(ix,iy),b=hash12(ix+1,iy),c=hash12(ix,iy+1),d=hash12(ix+1,iy+1);
  const top=a+(b-a)*ux,bot=c+(d-c)*ux;
  return top+(bot-top)*uy;
}
function rot2(x,y){return [0.80*x+0.60*y,-0.60*x+0.80*y]}
function fbm2(px,py,octaves,pers,lac){
  let amp=.5,sum=0,norm=0,x=px,y=py;
  const n=Math.max(1,Math.min(9,octaves|0));
  for(let i=0;i<n;i++){
    sum+=amp*vnoise2(x,y);norm+=amp;amp*=pers;
    const r=rot2(x,y);x=r[0]*lac;y=r[1]*lac;
  }
  return sum/Math.max(norm,1e-4);
}
function seedDomainOffset(value){
  const numeric=Number(value);if(!Number.isFinite(numeric))return 0;
  const seed=Math.trunc(numeric);if(seed===0)return 0;
  let hash=seed>>>0;
  hash=Math.imul(hash^(hash>>>16),0x7feb352d);
  hash=Math.imul(hash^(hash>>>15),0x846ca68b);
  hash=(hash^(hash>>>16))>>>0;
  return Math.fround((hash/0x100000000)*2048-1024);
}
/* ---- end pinned donor subset ---- */

const renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.shadowMap.enabled=true;
E('stage').prepend(renderer.domElement);

const scene=new THREE.Scene();
const WB2_BG=new THREE.Color(0x8e887a),WB2_FOG=new THREE.Fog(0x8e887a,22,45);
scene.background=WB2_BG;
scene.fog=WB2_FOG;
const camera=new THREE.PerspectiveCamera(42,1,.05,100);
camera.position.set(9,7,11);
const controls=new OrbitControls(camera,renderer.domElement);
controls.enableDamping=true;
controls.target.set(0,1,0);
controls.maxPolarAngle=Math.PI*.49;
controls.minDistance=2;
controls.maxDistance=32;
const hemiWB2=new THREE.HemisphereLight(0xfff2d6,0x323832,2.4);scene.add(hemiWB2);
const sun=new THREE.DirectionalLight(0xffe6b3,2.8);
sun.position.set(8,13,7);sun.castShadow=true;scene.add(sun);
const grid=new THREE.GridHelper(12,24,0xe3b466,0x6a6253);
grid.position.y=.01;scene.add(grid);
if(WORLD)WORLD.stage({scene,camera,controls,sun,fog:WB2_FOG,background:WB2_BG});

const worldRoot=new THREE.Group();scene.add(worldRoot);
const previewRoot=new THREE.Group();scene.add(previewRoot);
const loader=new GLTFLoader();
let terrain=null,mode='actor',selected=null,currentMixer=null,clock=new THREE.Clock(),actorSourceReady=false,propSourceReady=false,sceneLoadToken=0,gizmoSpace='world',sculptMode='off',sculptStroke=null,sculptPointerId=null,sculptOrbitHold=false,sculptHoverHit=null;
const sceneObjects=new Map();
const viewer={camera,scene,controls};

/* presentation seam — terrainHeightAt is hoisted (function declaration) */
const PRES=makePresentation({scene,renderer,wb2Lights:[hemiWB2,sun],wb2Background:WB2_BG,wb2Fog:WB2_FOG,heightAt:(x,z)=>terrain?terrainHeightAt(x,z):0});

function recordForNode(node){
  const id=node&&node.userData&&node.userData.sceneObjectId;
  return id?sceneDoc.objects.find(o=>o.id===id)||null:null;
}
const MODE_LABEL={translate:'move',rotate:'rotate',scale:'scale'};
function setSelectionUi(node,rec){
  selected=node||null;
  const r=rec||recordForNode(node);
  E('pick').hidden=!selected;
  if(selected&&r){E('pick').querySelector('b').textContent=r.name.split(' · ')[0];E('pick').title=r.name+' · '+r.kind+' · '+(MODE_LABEL[EDIT.mode]||EDIT.mode)+' · '+gizmoSpace+' axes'}
  refreshAddButtons();
}
function syncEditorUi(){
  if(!E('objmenu'))return;
  const active=EDIT.selection;
  if(!active.length&&selected)setSelectionUi(null);
  else if(active.length===1&&selected!==active[0])setSelectionUi(active[0],recordForNode(active[0]));
  E('objmenu').querySelectorAll('button').forEach(btn=>{
    const m=btn.dataset.m;
    btn.classList.toggle('active',m===EDIT.mode||(m==='space'&&gizmoSpace==='local'));
  });
  E('snap').classList.toggle('active',EDIT.snap);
  if(selected)setSelectionUi(selected);
}
function onEditorPick(node,rec){setSelectionUi(node,rec);syncEditorUi()}
function onEditorChange(nodes){
  for(const node of nodes)updateRecordFromRoot(node);
  if(nodes.length===1)selected=nodes[0];
  refreshDoc();
  syncEditorUi();
}
function onEditorMenu(action){
  if(action==='floor'){
    const result=EDIT.drop();
    const msg=result.length?result.map(r=>r.refused?(r.id+': '+r.refused):(r.id+': dropped '+r.moved+' to '+r.on)).join(' · '):'nothing selected';
    status(msg,result.length?'ok':'');
  }
  if(action==='space'){
    gizmoSpace=gizmoSpace==='world'?'local':'world';
    EDIT.gizmo.setSpace(gizmoSpace);
    syncEditorUi();
    status('gizmo axes · '+gizmoSpace,'ok');
  }
}
const EDIT=makeEditLayer(viewer,renderer.domElement,{
  getRoot:()=>worldRoot,
  recordOf:recordForNode,
  menu:E('objmenu'),
  gridStep:.05,
  angleStep:15,
  onPick:onEditorPick,
  onChange:onEditorChange,
  onMenu:onEditorMenu
});
EDIT.onChange(syncEditorUi);
EDIT.setOn(false);

const sculptRay=new THREE.Raycaster();
const sculptNdc=new THREE.Vector2();
const sculptCursor=new THREE.Mesh(
  new THREE.RingGeometry(.96,1.04,64),
  new THREE.MeshBasicMaterial({color:0xffd27a,transparent:true,opacity:.9,side:THREE.DoubleSide,depthTest:false})
);
sculptCursor.rotation.x=-Math.PI/2;
sculptCursor.visible=false;
sculptCursor.renderOrder=50;
scene.add(sculptCursor);

/* restrained selection/support feedback: a ground ring under the selection, accent when the
   object's base sits on the terrain, muted red when it floats or is buried (> 8 cm). */
const selRing=new THREE.Mesh(
  new THREE.RingGeometry(.9,1,56),
  new THREE.MeshBasicMaterial({color:0xe3b466,transparent:true,opacity:.5,side:THREE.DoubleSide,depthWrite:false,depthTest:false,fog:false})
);
selRing.rotation.x=-Math.PI/2;selRing.visible=false;selRing.renderOrder=40;scene.add(selRing);
const RING_OK=new THREE.Color(0xe3b466),RING_BAD=new THREE.Color(0xe48d7e);
function updateSelRing(){
  const node=EDIT.node;
  if(!UI.selectionRing||mode!=='scene'||sculptMode!=='off'||!EDIT.on||!node||!terrain){selRing.visible=false;return}
  const b=bounds(node,false),s=b.getSize(new THREE.Vector3());
  const gy=terrainHeightAt(node.position.x,node.position.z),gap=b.min.y-gy;
  selRing.visible=true;
  selRing.position.set(node.position.x,gy+.03,node.position.z);
  selRing.scale.setScalar(Math.max(.35,Math.max(s.x,s.z)*.55+.12));
  selRing.material.color.copy(Math.abs(gap)<=.08?RING_OK:RING_BAD);
}

function sculptState(){return ensureSculpt(sceneDoc.terrain)}
function brushRadius(){return Math.max(.45,Math.min(5,Number(E('sculptRadius').value)||1.25))}
function brushStrength(){return Math.max(.01,Math.min(.8,Number(E('sculptStrength').value)||.12))}
function wheelRadiusFactor(deltaY){
  const d=Math.max(-240,Math.min(240,Number(deltaY)||0));
  return Math.exp(-d*.0015);
}
function setBrushRadius(next){
  const value=Math.max(.45,Math.min(5,Number(next)||1.25));
  E('sculptRadius').value=(Math.round(value*100)/100).toFixed(2);
  E('radiusOut').value=brushRadius().toFixed(2);
  if(sculptCursor.visible)sculptCursor.scale.setScalar(brushRadius());
  return brushRadius();
}
function adjustBrushRadiusByWheel(deltaY){
  return setBrushRadius(brushRadius()*wheelRadiusFactor(deltaY));
}
function updateSculptUi(){
  const s=sculptState();
  E('sculptObject').classList.toggle('active',sculptMode==='off');
  E('sculptRaise').classList.toggle('active',sculptMode==='raise');
  E('sculptLower').classList.toggle('active',sculptMode==='lower');
  const n=strokeCount(s);
  E('sculptCount').textContent=n+(n===1?' stroke':' strokes');
  E('sculptUndo').disabled=!n;E('sculptClear').disabled=!n;
  const sculpting=sculptMode!=='off';
  E('brushGrp').hidden=!sculpting;E('objGrp').hidden=sculpting;
  E('legend').hidden=!(sculpting&&UI.legend&&mode==='scene');
  E('radiusOut').value=brushRadius().toFixed(2);E('strengthOut').value=brushStrength().toFixed(2);
}
function setTemporaryOrbit(on){
  if(mode!=='scene'||sculptMode==='off'||sculptPointerId!=null)return false;
  const next=!!on;
  if(next===sculptOrbitHold)return true;
  sculptOrbitHold=next;
  sculptCursor.visible=false;
  controls.enabled=true;
  status(next?'orbit · release Space for '+sculptMode:sculptMode,'ok');
  return true;
}
function setSculptMode(next){
  sculptMode=next==='raise'||next==='lower'?next:'off';
  sculptOrbitHold=false;sculptStroke=null;sculptPointerId=null;sculptHoverHit=null;sculptCursor.visible=false;
  if(sculptMode==='off'){
    if(mode==='scene')EDIT.setOn(true);
  }else{
    EDIT.clear();setSelectionUi(null);EDIT.setOn(false);
  }
  controls.enabled=true;
  updateSculptUi();
}
function terrainHitFromEvent(e){
  if(!terrain||mode!=='scene')return null;
  const r=renderer.domElement.getBoundingClientRect();
  sculptNdc.set(((e.clientX-r.left)/r.width)*2-1,-((e.clientY-r.top)/r.height)*2+1);
  sculptRay.setFromCamera(sculptNdc,camera);
  return sculptRay.intersectObject(terrain,false)[0]||null;
}
function showBrushAt(hit){
  sculptHoverHit=hit||null;
  if(!hit||sculptMode==='off'||sculptOrbitHold){sculptCursor.visible=false;return}
  sculptCursor.visible=true;
  sculptCursor.position.copy(hit.point);sculptCursor.position.y+=.035;
  sculptCursor.scale.setScalar(brushRadius());
}
function refreshTerrainAppearance(){
  if(!terrain)return;
  const g=terrain.geometry,pos=g.attributes.position,col=g.attributes.color;
  const low=new THREE.Color(0x65705b),mid=new THREE.Color(0x7d7659),high=new THREE.Color(0xa58e67),cc=new THREE.Color();
  for(let i=0;i<pos.count;i++){
    const y=pos.getY(i);
    const q=Math.max(0,Math.min(1,(y/Math.max(sceneDoc.terrain.height,1)+.5)));
    if(q<.5)cc.copy(low).lerp(mid,q*2);else cc.copy(mid).lerp(high,(q-.5)*2);
    col.setXYZ(i,cc.r,cc.g,cc.b);
  }
  col.needsUpdate=true;
  g.computeVertexNormals();
  g.attributes.normal.needsUpdate=true;
}
function applyCurrentSculptPoint(hit){
  if(!sculptStroke||!hit||!terrain)return false;
  const spacing=pointSpacing(sculptStroke.radius,18/80);
  if(!addStrokePoint(sculptStroke,hit.point.x,hit.point.z,spacing))return false;
  applyDabToGeometry(terrain.geometry,sculptStroke.mode,hit.point.x,hit.point.z,sculptStroke.radius,sculptStroke.strength);
  refreshTerrainAppearance();showBrushAt(hit);
  return true;
}
function beginSculpt(e){
  if(sculptMode==='off'||sculptOrbitHold||mode!=='scene')return;
  const hit=terrainHitFromEvent(e);if(!hit)return;
  e.preventDefault();e.stopImmediatePropagation();
  sculptPointerId=e.pointerId;
  try{renderer.domElement.setPointerCapture(e.pointerId)}catch{}
  controls.enabled=false;
  sculptStroke=makeStroke(sculptMode,brushRadius(),brushStrength());
  applyCurrentSculptPoint(hit);
}
function moveSculpt(e){
  if(sculptMode==='off'||mode!=='scene')return;
  if(sculptOrbitHold){sculptCursor.visible=false;return}
  const hit=terrainHitFromEvent(e);showBrushAt(hit);
  if(sculptPointerId===e.pointerId&&sculptStroke&&hit){
    e.preventDefault();e.stopImmediatePropagation();applyCurrentSculptPoint(hit);
  }
}
function finishSculpt(e,cancel=false){
  if(sculptPointerId!==e.pointerId)return;
  e.preventDefault();e.stopImmediatePropagation();
  try{renderer.domElement.releasePointerCapture(e.pointerId)}catch{}
  controls.enabled=true;
  if(cancel){buildTerrain()}
  else if(sculptStroke&&sculptStroke.points.length){
    sculptState().strokes.push(sculptStroke);
    if(WORLD)WORLD.onTerrain();
    refreshDoc();
    status(sculptStroke.mode+' · '+sculptStroke.points.length+' dabs','ok');
  }
  sculptStroke=null;sculptPointerId=null;updateSculptUi();
}
renderer.domElement.addEventListener('pointerdown',beginSculpt,{capture:true});
renderer.domElement.addEventListener('pointermove',moveSculpt,{capture:true});
renderer.domElement.addEventListener('pointerup',(e)=>finishSculpt(e,false),{capture:true});
renderer.domElement.addEventListener('pointercancel',(e)=>finishSculpt(e,true),{capture:true});
renderer.domElement.addEventListener('pointerleave',()=>{if(sculptPointerId==null)sculptCursor.visible=false});
renderer.domElement.addEventListener('wheel',e=>{
  if(mode!=='scene'||sculptMode==='off'||sculptOrbitHold)return;
  e.preventDefault();e.stopImmediatePropagation();
  const value=adjustBrushRadiusByWheel(e.deltaY);
  if(sculptHoverHit)showBrushAt(sculptHoverHit);
  status('radius '+value.toFixed(2),'ok');
},{capture:true,passive:false});

function bounds(o,precise=true){o.updateWorldMatrix(true,true);return new THREE.Box3().setFromObject(o,precise)}
function fitObject(o,fit){
  const b=bounds(o,false),s=new THREE.Vector3();b.getSize(s);
  let k=1;
  if(fit&&fit.height)k=fit.height/Math.max(s.y,1e-6);
  if(fit&&fit.max)k=fit.max/Math.max(s.x,s.y,s.z,1e-6);
  o.scale.multiplyScalar(k);o.updateWorldMatrix(true,true);
}
function groundModelLocal(model){
  const b=bounds(model,true);
  const parentY=model.parent?model.parent.getWorldPosition(new THREE.Vector3()).y:0;
  if(Number.isFinite(b.min.y)&&Number.isFinite(parentY)){
    model.position.y+=parentY-b.min.y;
    model.updateWorldMatrix(true,true);
  }
}
function setCameraForObject(obj){
  const b=bounds(obj,true),c=b.getCenter(new THREE.Vector3()),s=b.getSize(new THREE.Vector3());
  const r=Math.max(s.x,s.y,s.z,1);
  controls.target.copy(c);
  camera.position.set(c.x+r*2.1,c.y+r*1.15,c.z+r*2.4);
  controls.update();
}
function clearGroup(g){
  while(g.children.length)g.remove(g.children[0]);
}
function disposeTerrain(){
  if(terrain){worldRoot.remove(terrain);terrain.geometry.dispose();terrain.material.dispose();terrain.userData.kfbSrcMat?.dispose?.();terrain=null}
}
function resetMixer(){
  if(currentMixer){try{currentMixer.stopAllAction()}catch{}currentMixer=null}
}
const explicitTextureCache=new Map();
async function loadExplicitTexture(path,commit){
  const url=raw(path,commit);
  if(!explicitTextureCache.has(url)){
    explicitTextureCache.set(url,(async()=>{
      let tex=null;
      if(typeof fetch==='function'&&typeof createImageBitmap==='function'){
        try{
          const response=await fetch(url,{mode:'cors'});
          if(!response.ok)throw Error('HTTP '+response.status);
          const bitmap=await createImageBitmap(await response.blob());
          tex=new THREE.Texture(bitmap);tex.needsUpdate=true;
        }catch(err){console.warn('explicit texture fetch/ImageBitmap failed; trying TextureLoader',url,err)}
      }
      if(!tex){
        const tl=new THREE.TextureLoader();tl.setCrossOrigin('anonymous');
        tex=await tl.loadAsync(url);
      }
      tex.colorSpace=THREE.SRGBColorSpace;
      tex.flipY=false;
      tex.magFilter=THREE.NearestFilter;
      tex.minFilter=THREE.LinearMipmapLinearFilter;
      tex.needsUpdate=true;
      return tex;
    })());
  }
  return explicitTextureCache.get(url);
}
async function applyExplicitTexture(node,textureRef){
  if(!textureRef?.path)return 0;
  const tex=await loadExplicitTexture(textureRef.path,textureRef.commit||ASSET_COMMIT);
  let applied=0;
  node.traverse(o=>{
    if(!(o.isMesh||o.isSkinnedMesh)||!o.material)return;
    const wasArray=Array.isArray(o.material);
    const mats=(wasArray?o.material:[o.material]).filter(Boolean).map(m=>{
      const n=m.clone();
      n.map=tex;
      n.needsUpdate=true;
      applied++;
      return n;
    });
    if(mats.length)o.material=wasArray?mats:mats[0];
  });
  node.userData.sourceTexture=textureRef.path;
  node.userData.sourceTextureApplied=applied;
  return applied;
}
async function loadActorModel(animated=true){
  const gltf=await loader.loadAsync(raw(ACTOR.path,ACTOR.commit));
  const model=gltf.scene;fitObject(model,ACTOR.fit);
  try{await applyExplicitTexture(model,ACTOR.texture)}
  catch(err){model.userData.sourceTextureError=String(err?.message||err);console.warn('explicit Caveman texture unavailable in this host',err)}
  if(animated){
    const ag=await loader.loadAsync(raw(ACTOR.clip.path,ACTOR.clip.commit));
    const clip=ag.animations.find(c=>c.name===ACTOR.clip.name);
    if(!clip)throw Error('Resident clip not found: '+ACTOR.clip.name);
    currentMixer=new THREE.AnimationMixer(model);
    currentMixer.clipAction(clip).play();
    currentMixer.setTime(0);
    model.userData.clip=clip.name;
  }
  groundModelLocal(model);
  model.traverse(n=>{if(n.isMesh){n.castShadow=true;n.receiveShadow=true}});
  return model;
}
async function loadPropModel(){
  const gltf=await loader.loadAsync(raw(PROP.path,PROP.commit));
  const model=gltf.scene;fitObject(model,PROP.fit);groundModelLocal(model);
  model.traverse(n=>{if(n.isMesh){n.castShadow=true;n.receiveShadow=true}});
  return model;
}

function terrainSettingsFromUI(){
  const sculpt=deepClone(sculptState());
  return {
    seed:Math.trunc(Number(E('seed').value)||0),
    height:Math.max(0,Number(E('height').value)||0),
    macroScale:Math.max(.25,Number(E('macro').value)||3.2),
    detail:Math.max(.05,Number(E('detail').value)||.55),
    sculpt,
    ...(sceneDoc.terrain.tile?{tile:deepClone(sceneDoc.terrain.tile)}:{})
  };
}
function applyTerrainUI(t){
  ensureSculpt(t);
  E('seed').value=t.seed;E('height').value=t.height;E('macro').value=t.macroScale;E('detail').value=t.detail;
  updateSculptUi();
}
function terrainHeightAt(x,z,t=sceneDoc.terrain){
  const ox=seedDomainOffset(t.seed),oz=seedDomainOffset(t.seed^0x51f15e);
  const macro=fbm2((x+ox)*(.13/t.macroScale),(z+oz)*(.13/t.macroScale),5,.5,2.0);
  const fine=fbm2((x-ox*.37)*(.55*t.detail),(z+oz*.29)*(.55*t.detail),3,.5,2.13);
  const base=(macro-.5)*t.height+(fine-.5)*t.height*.18;
  return base+sculptDeltaAt(x,z,t.sculpt);
}
function terrainSignature(){
  const pts=[[-4,-4],[-2,3],[0,0],[3,-2],[4,4]];
  return pts.map(p=>terrainHeightAt(p[0],p[1]).toFixed(3)).join(' · ');
}
function buildTerrain(){
  ensureSculpt(sceneDoc.terrain);
  disposeTerrain();
  const T=sceneDoc.terrain.tile;   // WORLD-INTEGRATION-01: editable tile of a world zone · absent = WB2 18 m sandbox
  const g=T?new THREE.PlaneGeometry(T.size,T.size,T.seg,T.seg):new THREE.PlaneGeometry(18,18,80,80);g.rotateX(-Math.PI/2);if(T)g.translate(T.cx,0,T.cz);
  const pos=g.attributes.position;
  const colors=[];
  const cLow=new THREE.Color(0x65705b),cMid=new THREE.Color(0x7d7659),cHigh=new THREE.Color(0xa58e67),c=new THREE.Color();
  for(let i=0;i<pos.count;i++){
    const x=pos.getX(i),z=pos.getZ(i),y=terrainHeightAt(x,z);
    pos.setY(i,y);
    const q=Math.max(0,Math.min(1,(y/Math.max(sceneDoc.terrain.height,1)+.5)));
    if(q<.5)c.copy(cLow).lerp(cMid,q*2);else c.copy(cMid).lerp(cHigh,(q-.5)*2);
    colors.push(c.r,c.g,c.b);
  }
  g.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));g.computeVertexNormals();
  const m=new THREE.MeshStandardMaterial({vertexColors:true,roughness:1,metalness:0});
  terrain=new THREE.Mesh(g,m);terrain.receiveShadow=true;terrain.name='Continuous terrain';
  worldRoot.add(terrain);
  if(WORLD)WORLD.dressTerrain(terrain);
  E('terrainSig').textContent='signature '+terrainSignature();
  PRES.onTerrain(terrain);
  updateSculptUi();
}

function makeRoot(record){
  const root=new THREE.Group();
  root.name=record.name;root.userData.sceneObjectId=record.id;root.userData.kind=record.kind;
  const p=record.transform.position||[0,0,0];
  root.position.set(Number(p[0])||0,p[1]==null?0:(Number(p[1])||0),Number(p[2])||0);
  root.userData.needsInitialGround=p[1]==null;
  root.rotation.fromArray((record.transform.rotation||[0,0,0]).concat(['XYZ']).slice(0,4));
  root.scale.fromArray(record.transform.scale||[1,1,1]);
  worldRoot.add(root);sceneObjects.set(record.id,root);return root;
}
async function buildSceneObjects(token){
  resetMixer();
  for(const root of sceneObjects.values())worldRoot.remove(root);
  sceneObjects.clear();selected=null;EDIT.clear();PRES.onObjectsReset();
  for(const rec of sceneDoc.objects){
    if(token!==sceneLoadToken)return;
    const root=makeRoot(rec);
    const model=rec.kind==='resident'?await loadActorModel(true):await loadPropModel();
    if(token!==sceneLoadToken)return;
    root.add(model);
    root.userData.model=model;
    if(rec.kind==='resident')groundModelLocal(model);
    if(root.userData.needsInitialGround){dropRoot(root);root.userData.needsInitialGround=false;updateRecordFromRoot(root)}
    PRES.onObject(root);
  }
  refreshAddButtons();refreshDoc();
}
function dropRoot(root){
  if(!root)return;
  root.position.y=terrainHeightAt(root.position.x,root.position.z);
  root.updateMatrixWorld(true);
}
function snapAllToTerrain(){
  for(const root of sceneObjects.values())dropRoot(root);
}
function updateRecordFromRoot(root){
  const rec=sceneDoc.objects.find(o=>o.id===root.userData.sceneObjectId);
  if(!rec)return;
  rec.transform.position=root.position.toArray().map(v=>+v.toFixed(4));
  rec.transform.rotation=[root.rotation.x,root.rotation.y,root.rotation.z].map(v=>+v.toFixed(5));
  rec.transform.scale=root.scale.toArray().map(v=>+v.toFixed(4));
}
function updateAllRecords(){for(const root of sceneObjects.values())updateRecordFromRoot(root)}
function refreshDoc(){
  updateAllRecords();
  E('doc').textContent=JSON.stringify(sceneDoc,null,2);
}
function refreshAddButtons(){
  E('addActor').disabled=sceneDoc.objects.some(o=>o.id===ACTOR.id);
  E('addProp').disabled=sceneDoc.objects.some(o=>o.id===PROP.id);
  E('remove').disabled=!selected;
  E('pick').hidden=!selected;
}
function selectRoot(root){
  if(sculptMode!=='off')return null;
  if(!root){EDIT.clear();setSelectionUi(null);return null}
  EDIT.setOn(true);
  EDIT.select(root);
  setSelectionUi(root,recordForNode(root));
  syncEditorUi();
  return root;
}

const short=c=>c.slice(0,12);
function sourceFacts(kind){
  const lock=(actorSourceReady&&propSourceReady)?'':'<br><span class="lock">Scene unlocks after Actor + Prop review.</span>';
  if(kind==='actor'){
    return '<b>Caveman</b> · exact Resident Atlas source<br>'+ACTOR.path+' @ '+short(ACTOR.commit)+'<br>texture '+ACTOR.texture.path.split('/').pop()+' · '+ACTOR.rigFamily+' · '+ACTOR.clip.name+' @ '+short(ACTOR.clip.commit)+lock;
  }
  return '<b>Boulder</b> · exact source landmark<br>'+PROP.path+' @ '+short(PROP.commit)+'<br>whole authored asset · fit max 1.35'+lock;
}
function setPanels(sceneMode){
  E('dock').hidden=!sceneMode;E('saveGrp').hidden=!sceneMode;
  E('tabTerrain').hidden=!sceneMode;E('tabDoc').hidden=!sceneMode;
  E('facts').hidden=sceneMode;
  if(WORLD){
    E('wiGrp').hidden=!sceneMode;E('wiLook').hidden=false;E('wiDoc').hidden=!sceneMode;WORLD.setVisible(sceneMode);
    if(PLAY){if(!sceneMode&&PLAY.on)setPlay(false);PLAY.actor.holder.visible=sceneMode}
  }
  if(!sceneMode&&(drawerTab==='terrain'||drawerTab==='doc'))openDrawer('');
  updateSculptUi();
}
function setReviewButtons(active){
  E('viewActor').classList.toggle('active',active==='actor');
  E('viewProp').classList.toggle('active',active==='prop');
  E('viewScene').classList.toggle('active',active==='scene');
  E('viewActor').classList.toggle('done',actorSourceReady&&active!=='actor');
  E('viewProp').classList.toggle('done',propSourceReady&&active!=='prop');
}
async function showActor(){
  mode='actor';setSculptMode('off');actorSourceReady=false;updateReviewUnlock();resetMixer();EDIT.setOn(false);selectRoot(null);clearGroup(previewRoot);worldRoot.visible=false;previewRoot.visible=true;grid.visible=true;setPanels(false);
  setReviewButtons('actor');
  E('facts').innerHTML=sourceFacts('actor');
  status('loading exact Caveman source…');
  const model=await loadActorModel(true);previewRoot.add(model);setCameraForObject(model);actorSourceReady=true;
  const textureState=model.userData.sourceTextureApplied?' · texture bound':' · texture host fallback unavailable';
  status('source actor · '+ACTOR.clip.name+textureState,model.userData.sourceTextureApplied?'ok':'bad');
  updateReviewUnlock();E('facts').innerHTML=sourceFacts('actor');setReviewButtons('actor');
}
async function showProp(){
  mode='prop';setSculptMode('off');propSourceReady=false;updateReviewUnlock();resetMixer();EDIT.setOn(false);selectRoot(null);clearGroup(previewRoot);worldRoot.visible=false;previewRoot.visible=true;grid.visible=true;setPanels(false);
  setReviewButtons('prop');
  E('facts').innerHTML=sourceFacts('prop');
  status('loading exact Boulder source…');
  const model=await loadPropModel();previewRoot.add(model);setCameraForObject(model);propSourceReady=true;status('source prop','ok');
  updateReviewUnlock();E('facts').innerHTML=sourceFacts('prop');setReviewButtons('prop');
}
async function showScene(){
  if(!actorSourceReady||!propSourceReady)return;
  mode='scene';resetMixer();clearGroup(previewRoot);previewRoot.visible=false;worldRoot.visible=true;grid.visible=false;setPanels(true);setSculptMode('off');syncEditorUi();
  setReviewButtons('scene');
  status('building terrain + source objects…');
  applyTerrainUI(sceneDoc.terrain);buildTerrain();
  sceneLoadToken++;await buildSceneObjects(sceneLoadToken);
  if(WORLD){
    if(!PLAY)await initPlay();else PLAY.readDoc(sceneDoc);
    WORLD.frameEdit(camera,controls);
    status('world ready · '+WORLD.zone.id+' · Tab = Play','ok');
    return;
  }
  camera.position.set(10,7.2,11.5);controls.target.set(0,.5,0);controls.update();
  status('scene ready','ok');
}
/* WORLD-INTEGRATION-01 · Play reads the WorldBuilder's own state: terrainHeightAt (base + sculpt),
   the zone's footprints and the edited scene objects. Edit and Play never hold two copies. */
async function initPlay(){
  status('loading player · FrizzleBob graft + KFB Motion Library…');
  const WP=await import('../world-integration-01/wi1-play.js');
  PLAY=await WP.makePlay({scene,camera,dom:renderer.domElement,groundAt:(x,z)=>WORLD.groundAt(x,z,terrainHeightAt(x,z)),obstacles:()=>[...sceneObjects.values()],hud:E('wiState'),log:t=>WORLD.log.push(t)});
  PLAY.readDoc(sceneDoc);
  const AM=await import('../world-integration-01/wi1-actor.js');
  E('wiMotion').innerHTML=Object.entries(AM.SET_LABEL).map(([k,l])=>'<option value="'+k+'">'+l+'</option>').join('');E('wiMotion').value=PLAY.actor.motionSet;
  WORLD.setScanRoots([PLAY.actor.holder,worldRoot]);
  refreshWorldFacts();
}
function setPlay(on){
  if(!PLAY||mode!=='scene')return;
  on=!!on;
  if(on){setSculptMode('off');selectRoot(null);EDIT.setOn(false);controls.enabled=false}
  PLAY.setOn(on);
  if(!on){EDIT.setOn(true);controls.enabled=true;PLAY.handToOrbit(controls)}
  E('dock').hidden=on;E('wiPlay').classList.toggle('active',on);E('wiEdit').classList.toggle('active',!on);
  status(on?'play · W walk (hold → faster) · S back · A/D turn · Q/E strafe · Shift run (hold → sprint) · C crouch · Z sneak · X crawl · Space jump · Tab edit':'edit · 1 object · 2 raise · 3 lower · Tab play','ok');
}
function refreshWorldFacts(){
  if(!WORLD)return;
  const z=WORLD.zone,sp=WORLD.spawn,t=WORLD.tile,pv=z.provenance||{};
  let h='<b>'+z.id+'</b> · '+z.counts.buildings+' buildings · '+z.counts.roadParts+' road parts<br>'+(pv.normalizedSha256?'normalized sha256 '+pv.normalizedSha256.slice(0,16)+'… · ':'')+(pv.commit?'@'+String(pv.commit).slice(0,12):'')+'<br>spawn '+(sp.road||'zone centre')+' · edit tile '+t.size+' m @ '+(t.size/t.seg)+' m<br>© OpenStreetMap contributors · ODbL 1.0';
  if(PLAY){
    const R=PLAY.actor.report,m=R.measured,V=PLAY.speeds;
    h+='<br><br><b>Player</b> '+R.actor+'<br>'+R.height.bodyM+' m body ('+R.height.withEarsM+' m with ears) · door/figure '+R.height.doorRatio+' · floor/figure '+R.height.floorRatio;
    h+='<br>'+Object.entries(R.clips).map(([k,c])=>k+' '+c.name).join(' · ');
    const pf=PLAY.profile();
    h+='<br><br><b>Locomotion consumed</b> ('+pf.owner+')<br>'+pf.rows.map(r=>r.state+' · '+r.sourceClip+(r.variant?' <i>variant</i>':'')+' ×'+r.playbackRate+(r.worldSpeedMs!=null?' · '+r.worldSpeedMs+' m/s':'')+(r.cadenceStepsPerMin?' · '+r.cadenceStepsPerMin+' spm':'')+(r.inPlace?' · in-place':'')).join('<br>');
    h+='<br>bands · walk→run '+pf.bands.upRun+' · run→walk '+pf.bands.downRun+' m/s';
    h+='<br>walker v25 unchanged (speed commanded per frame) · jump apex '+(PLAY.params.jumpV**2/2/PLAY.params.gravity).toFixed(2)+' m';
    if(R.gaps.length)h+='<br><span style="color:var(--accent)">motion gaps · '+R.gaps.join(' · ')+'</span>';
    if(R.graft)h+='<br>graft · host head hidden '+R.graft.hiddenHostHeadTris+' tris + '+R.graft.hiddenExtras+' meshes · face: eyeRig '+R.face.eyeRig+' · mouth '+R.face.mouth+' · donor eyes stripped '+R.face.donorEyesStripped;
  }
  {const cs=WORLD.city&&WORLD.city.stats,sr=WORLD.supportReport;
    if(cs)h+='<br><br><b>OSM presenter</b> (global rule) · '+cs.facade.rule+' · '+cs.facade.windows+' windows · '+cs.facade.doors+' doors · '+cs.facade.bare+' bare<br>roofs: orientEG · FrontSide / shadowSide Back · flat-roof routed '+cs.flatRoofRouted+' · wall normals from walls only '+(cs.wallNormalsOnly||0)+' · sunk wall feet '+(cs.sunkBases||0);
    if(sr)h+='<br>host support · '+sr.moved+' buildings moved · max offset '+sr.maxOffsetM+' m · max footprint span '+sr.maxFootprintSpanM+' m · no plates';
    if(WORLD.landmarks.length)h+='<br>landmarks (protected) · '+WORLD.landmarks.map(l=>l.id+' Δ'+l.offsetM+' m · OSM base '+l.base).join(' · ');}
  E('wiZone').innerHTML=h;
  const ir=WORLD.inkReport;
  E('wiInkFacts').textContent=WORLD.inkOn?(ir?'excluded as not drawn · '+ir.excludedInvisible+(ir.names.length?' ('+ir.names.join(', ')+')':''):'scanning…'):'ink off · WB-D1 default';
}
async function runWorldSelfTest(){
  const T=await import('../world-integration-01/wi1-selftest.js');
  E('wiTest').textContent='running…';
  try{const rep=await T.run(window.__wb2d);E('wiTest').textContent=rep.join('\n');status('WORLD SELFTEST '+rep.length+'/'+rep.length+' PASS','ok');return rep}
  catch(err){E('wiTest').textContent=(err.report||[]).join('\n')||String(err);status(String(err.message||err),'bad');throw err}
  finally{refreshWorldFacts()}
}
function updateReviewUnlock(){E('viewScene').disabled=!(actorSourceReady&&propSourceReady)}

function addActor(){
  if(sceneDoc.objects.some(o=>o.id===ACTOR.id))return;
  sceneDoc.objects.push(deepClone(DEFAULT_DOC.objects[0]));return rebuildSceneAfterDocChange();
}
function addProp(){
  if(sceneDoc.objects.some(o=>o.id===PROP.id))return;
  sceneDoc.objects.push(deepClone(DEFAULT_DOC.objects[1]));return rebuildSceneAfterDocChange();
}
async function rebuildSceneAfterDocChange(){sceneLoadToken++;buildTerrain();await buildSceneObjects(sceneLoadToken)}
async function removeSelected(){
  if(!selected)return;
  const id=selected.userData.sceneObjectId;
  sceneDoc.objects=sceneDoc.objects.filter(o=>o.id!==id);selectRoot(null);await rebuildSceneAfterDocChange();
}
function regenerate(){
  sceneDoc.terrain=terrainSettingsFromUI();buildTerrain();snapAllToTerrain();refreshDoc();status('terrain regenerated · seed '+sceneDoc.terrain.seed,'ok');
}
function undoSculpt(){
  const s=sculptState();
  if(!s.strokes.length){status('no sculpt stroke to undo','');return false}
  s.strokes.pop();buildTerrain();refreshDoc();status('last stroke undone','ok');return true;
}
function clearSculpt(){
  const s=sculptState();
  if(!s.strokes.length){status('sculpt layer already clear','');return false}
  s.strokes=[];buildTerrain();refreshDoc();status('sculpt cleared · procedural base restored','ok');return true;
}
function saveDoc(){
  updateAllRecords();if(PLAY)PLAY.writeDoc(sceneDoc);sceneDoc.savedAt=new Date().toISOString();
  localStorage.setItem(STORAGE_KEY,JSON.stringify(sceneDoc));
  E('saveState').textContent='Saved locally · '+sceneDoc.savedAt;refreshDoc();status('scene saved','ok');
  E('save').classList.remove('dirty');
}
async function reloadDoc(){
  const rawDoc=localStorage.getItem(STORAGE_KEY);
  if(!rawDoc){status('no saved scene found','bad');return false}
  const d=JSON.parse(rawDoc);
  if(d.format!=='kfb-worldbuilder-scene'||d.id!==DOC_ID)throw Error('Unexpected scene document');
  sceneDoc=d;ensureSculpt(sceneDoc.terrain);applyTerrainUI(sceneDoc.terrain);await rebuildSceneAfterDocChange();if(PLAY)PLAY.readDoc(sceneDoc);
  E('saveState').textContent='Reloaded saved scene · '+(sceneDoc.savedAt||'no timestamp');status('saved scene reloaded','ok');return true;
}
async function resetFixture(){
  sceneDoc=deepClone(DEFAULT_DOC);localStorage.removeItem(STORAGE_KEY);applyTerrainUI(sceneDoc.terrain);await rebuildSceneAfterDocChange();if(PLAY)PLAY.readDoc(sceneDoc);
  E('saveState').textContent='Fixture reset · no local save.';status('fixture reset','ok');
}
async function exportDoc(){
  refreshDoc();const text=JSON.stringify(sceneDoc,null,2);
  try{await navigator.clipboard.writeText(text);status('scene JSON copied','ok')}catch{window.prompt('Copy scene JSON:',text)}
}
async function importDoc(){
  const text=window.prompt('Paste kfb-worldbuilder-scene JSON:');if(!text)return;
  const d=JSON.parse(text);if(d.format!=='kfb-worldbuilder-scene')throw Error('Wrong scene document format');
  sceneDoc=d;ensureSculpt(sceneDoc.terrain);applyTerrainUI(sceneDoc.terrain);await rebuildSceneAfterDocChange();status('scene JSON imported','ok');
}

/* ---------------- drawer (docked: opening it shrinks the view, never covers it) ---------------- */
let drawerTab='';
const TABS={terrain:['paneTerrain','Terrain','tabTerrain'],look:['paneLook','Look','tabLook'],doc:['paneDoc','Scene','tabDoc']};
function openDrawer(tab){
  drawerTab=drawerTab===tab?'':tab;
  if(drawerTab&&!TABS[drawerTab])drawerTab='';
  APP.classList.toggle('open',!!drawerTab);
  for(const [k,[pane,,btn]] of Object.entries(TABS)){E(pane).hidden=k!==drawerTab;E(btn).classList.toggle('active',k===drawerTab)}
  if(drawerTab)E('drawerTitle').textContent=TABS[drawerTab][1];
  PRES.setDrawer(drawerTab);
}
document.querySelectorAll('#wb2d [data-tab]').forEach(b=>b.onclick=()=>openDrawer(b.dataset.tab));
E('drawerClose').onclick=()=>openDrawer(drawerTab);

function rangeField(host,[key,label,min,max,step],value,onInput){
  const f=document.createElement('div');f.className='field rng';
  f.innerHTML='<label>'+label+'</label><input type="range" min="'+min+'" max="'+max+'" step="'+step+'"><output></output>';
  const inp=f.querySelector('input'),out=f.querySelector('output');
  const fmt=v=>(+v).toFixed(step<.01?3:step<1?2:0);
  inp.value=value;out.value=fmt(value);
  inp.oninput=()=>{out.value=fmt(inp.value);onInput(+inp.value)};
  host.appendChild(f);
}
function renderLightUi(){
  const st=PRES.state,seg=E('profileSeg'),host=E('lightFields');
  seg.innerHTML='';host.innerHTML='';
  for(const [id,label] of PROFILES){
    const b=document.createElement('button');b.textContent=label;b.className=st.profile===id?'active':'quiet';
    b.onclick=()=>{PRES.setProfile(id);renderLightUi();status('light · '+label,'ok')};seg.appendChild(b);
  }
  if(st.profile==='wb2'){host.innerHTML='<div class="src" style="margin-top:4px">accepted WB2 light · hemi 2.4 · sun 2.8 · fog 22–45</div>';return}
  for(const p of LIGHT_PARAMS){
    if(TORCH_KEYS.includes(p[0])&&st.profile!=='whackman')continue;
    rangeField(host,p,st.light[p[0]],v=>PRES.setLight(p[0],v));
  }
  if(st.profile==='whackman')host.insertAdjacentHTML('beforeend','<div class="src" style="margin-top:6px">4 torches at lab positions · not world truth</div>');
}
function fillSelect(id,list,value,layer){
  const s=E(id);s.innerHTML=list.map(n=>'<option>'+n+'</option>').join('');s.value=list.includes(value)?value:'SOURCE';
  s.onchange=()=>{PRES.setLook(layer,s.value).then(()=>status(layer+' look · '+s.value,'ok'))};
}
fillSelect('lookTerrain',TERRAIN_LOOKS,PRES.state.terrainLook,'terrain');
fillSelect('lookObjects',OBJECT_LOOKS,PRES.state.objectLook,'objects');
E('story').value=PRES.state.story;E('storyOut').value=(+PRES.state.story).toFixed(2);
E('story').oninput=()=>{E('storyOut').value=(+E('story').value).toFixed(2);PRES.setStory(+E('story').value)};
renderLightUi();

/* ---------------- wiring (accepted behaviour) ---------------- */
E('viewActor').onclick=()=>showActor().catch(fail);
E('viewProp').onclick=()=>showProp().catch(fail);
E('viewScene').onclick=()=>showScene().catch(fail);
E('snap').onclick=()=>{
  EDIT.setSnap(!EDIT.snap);
  syncEditorUi();
  status(EDIT.snap?'snap 0.05 / 15°':'snap off · continuous','ok');
};
E('addActor').onclick=()=>Promise.resolve(addActor()).catch(fail);
E('addProp').onclick=()=>Promise.resolve(addProp()).catch(fail);
E('remove').onclick=()=>removeSelected().catch(fail);
E('sculptObject').onclick=()=>setSculptMode('off');
E('sculptRaise').onclick=()=>setSculptMode('raise');
E('sculptLower').onclick=()=>setSculptMode('lower');
E('sculptUndo').onclick=undoSculpt;
E('sculptClear').onclick=clearSculpt;
E('sculptRadius').oninput=E('sculptRadius').onchange=()=>{setBrushRadius(E('sculptRadius').value);if(sculptHoverHit)showBrushAt(sculptHoverHit);updateSculptUi()};
E('sculptStrength').oninput=E('sculptStrength').onchange=updateSculptUi;
E('regen').onclick=regenerate;
E('save').onclick=saveDoc;
E('reload').onclick=()=>reloadDoc().catch(fail);
E('resetScene').onclick=()=>resetFixture().catch(fail);
E('exportDoc').onclick=()=>exportDoc().catch(fail);
E('importDoc').onclick=()=>importDoc().catch(fail);
if(WORLD){
  APP.querySelector('.brand span').textContent='WB2 · '+WORLD.zone.id.replace(/-crop-v0$/,'');
  E('review').hidden=true;   // world mode works in the scene only; source review stays in the WB2 sandbox
  E('wiPlay').onclick=()=>setPlay(true);E('wiEdit').onclick=()=>setPlay(false);
  E('wiInk').onclick=()=>{WORLD.setInk(!WORLD.inkOn);E('wiInk').textContent=WORLD.inkOn?'Ink on':'Ink off';E('wiInk').className=WORLD.inkOn?'active':'quiet';refreshWorldFacts();setTimeout(refreshWorldFacts,1500)};
  E('wiNames').onclick=()=>{const v=!WORLD.namesOn;WORLD.setNames(v);E('wiNames').className=v?'active':'quiet'};
  E('wiSelftest').onclick=()=>runWorldSelfTest().catch(fail);
  E('wiSky').innerHTML=WORLD.SKY_MODES.map(([k,l])=>'<option value="'+k+'">'+l+'</option>').join('');E('wiSky').value=WORLD.skyMode;
  E('wiSky').onchange=()=>WORLD.setSky(E('wiSky').value).then(()=>status('sky · '+E('wiSky').selectedOptions[0].text,'ok'));
  E('wiZoneSel').innerHTML=Object.entries(WI.ZONES).map(([k,z])=>'<option value="'+k+'">'+z.label+'</option>').join('');E('wiZoneSel').value=WORLD_ID;
  E('wiZoneSel').onchange=()=>{try{localStorage.setItem('kfb-wi1.world',E('wiZoneSel').value)}catch{}const u=new URL(location.href);u.searchParams.delete('world');location.href=u.href};
  E('wiMotion').onchange=()=>{if(!PLAY)return;PLAY.actor.setMotionSet(E('wiMotion').value);PLAY.retune();refreshWorldFacts();status('motion set · '+E('wiMotion').selectedOptions[0].text,'ok')};
}
addEventListener('keydown',e=>{
  if(mode!=='scene')return;
  if(WORLD&&e.code==='Tab'){e.preventDefault();setPlay(!(PLAY&&PLAY.on));return}
  if(PLAY&&PLAY.on)return;
  const tag=String(e.target?.tagName||'').toLowerCase();
  const typing=tag==='input'||tag==='textarea'||tag==='select'||e.target?.isContentEditable;
  if(!typing&&e.code==='Space'&&sculptMode!=='off'){
    if(!e.repeat){e.preventDefault();setTemporaryOrbit(true)}
    return;
  }
  if(!typing&&e.code==='Digit1'){e.preventDefault();setSculptMode('off');status('object / orbit','ok');return}
  if(!typing&&e.code==='Digit2'){e.preventDefault();setSculptMode('raise');status('raise','ok');return}
  if(!typing&&e.code==='Digit3'){e.preventDefault();setSculptMode('lower');status('lower','ok');return}
  if(e.key==='Escape'&&sculptMode!=='off'){setSculptMode('off');return}
  if(sculptMode!=='off')return;
  if(typing)return;
  if(e.key==='g')EDIT.setMode('translate');
  if(e.key==='r')EDIT.setMode('rotate');
  if(e.key==='s')EDIT.setMode('scale');
  if(e.key==='Escape')selectRoot(null);
  syncEditorUi();
});
addEventListener('keyup',e=>{
  if(e.code==='Space'&&sculptOrbitHold){
    e.preventDefault();
    setTemporaryOrbit(false);
  }
});
addEventListener('blur',()=>{if(sculptOrbitHold)setTemporaryOrbit(false)});

function resize(){
  const r=E('stage').getBoundingClientRect();if(!r.width||!r.height)return;
  camera.aspect=Math.max(.1,r.width/r.height);camera.updateProjectionMatrix();renderer.setSize(r.width,r.height,false);
}
addEventListener('resize',resize);
new ResizeObserver(resize).observe(E('stage'));
resize();
renderer.setAnimationLoop(()=>{
  const dt=Math.min(clock.getDelta(),.05);
  if(currentMixer)currentMixer.update(dt);
  if(mode==='actor'&&previewRoot.children[0])groundModelLocal(previewRoot.children[0]);
  if(mode==='scene'){
    const actorRoot=sceneObjects.get(ACTOR.id);
    if(actorRoot&&actorRoot.userData.model){
      groundModelLocal(actorRoot.userData.model);
    }
  }
  PRES.tick(clock.elapsedTime);
  if(PLAY&&mode==='scene')PLAY.update(dt);
  if(WORLD)WORLD.tick(PLAY&&PLAY.on?PLAY.position:controls.target,camera);
  EDIT.follow();updateSelRing();if(!(PLAY&&PLAY.on))controls.update();
  if(!(WORLD&&WORLD.render(clock.elapsedTime,renderer,scene,camera)))renderer.render(scene,camera);
});

function fail(err){
  console.error(err);status('ERROR · '+(err&&err.message?err.message:String(err)),'bad');
  E('selftest').hidden=false;E('selftest').textContent=String(err&&err.stack?err.stack:err);
}

/* ---- accepted WB2 self-test, ported 1:1 (34 assertions) ---- */
async function runSelfTest(){
  const report=[];const ok=(name,cond,extra='')=>{if(!cond)throw Error('SELFTEST FAIL · '+name+(extra?' · '+extra:''));report.push('PASS · '+name)};
  localStorage.removeItem(STORAGE_KEY);
  await showActor();ok('exact actor source visible',previewRoot.children.length===1&&mode==='actor');
  ok('actor clip bound',currentMixer&&previewRoot.children[0].userData.clip===ACTOR.clip.name);
  ok('explicit actor texture bound',previewRoot.children[0].userData.sourceTexture===ACTOR.texture.path&&previewRoot.children[0].userData.sourceTextureApplied>0);
  await showProp();ok('exact prop source visible',previewRoot.children.length===1&&mode==='prop');
  ok('scene gate unlocked',!E('viewScene').disabled);
  await showScene();ok('continuous terrain mesh exists',terrain&&terrain.geometry.attributes.position.count>1000);
  ok('shared ToolBox edit layer is active',EDIT.on&&EDIT.gizmo&&E('objmenu'));
  ok('resident loaded',sceneObjects.has(ACTOR.id));
  ok('prop loaded',sceneObjects.has(PROP.id));
  const actor=sceneObjects.get(ACTOR.id),actorY=actor.position.y+1.1;
  actor.position.y=actorY;updateRecordFromRoot(actor);
  ok('resident Y transform is editable',near(sceneDoc.objects.find(o=>o.id===ACTOR.id).transform.position[1],actorY));
  const a=terrainHeightAt(-4,-4),b=terrainHeightAt(4,4);ok('terrain varies',!near(a,b,1e-4),a+' / '+b);
  const sculpt=sculptState();sculpt.strokes=[];buildTerrain();
  const baseCenter=terrainHeightAt(0,0),edgeWeight=brushWeight(1.2,1.2);
  const raise=makeStroke('raise',1.2,.2);addStrokePoint(raise,0,0,0);sculpt.strokes.push(raise);buildTerrain();
  const raisedCenter=terrainHeightAt(0,0);
  ok('raise stroke increases terrain',raisedCenter>baseCenter+.15);
  ok('smooth brush reaches zero at radius',near(edgeWeight,0,1e-9));
  const radiusBefore=brushRadius(),radiusUp=adjustBrushRadiusByWheel(-100),radiusDown=adjustBrushRadiusByWheel(100);
  ok('wheel up increases sculpt radius',radiusUp>radiusBefore);
  ok('wheel down reduces sculpt radius',radiusDown<radiusUp);
  setBrushRadius(radiusBefore);
  setSculptMode('raise');ok('quick mode enters Raise',sculptMode==='raise'&&!EDIT.on);
  ok('Space hold enters temporary orbit without losing Raise',setTemporaryOrbit(true)&&sculptOrbitHold&&sculptMode==='raise'&&controls.enabled);
  setTemporaryOrbit(false);ok('Space release returns to Raise',!sculptOrbitHold&&sculptMode==='raise');
  setSculptMode('off');ok('quick Object/Orbit mode restores edit owner',sculptMode==='off'&&EDIT.on);
  const lowBase=terrainHeightAt(3,0);
  const lower=makeStroke('lower',1.1,.16);addStrokePoint(lower,3,0,0);sculpt.strokes.push(lower);buildTerrain();
  ok('lower stroke decreases terrain',terrainHeightAt(3,0)<lowBase-.1);
  const sculptSavedHeight=terrainHeightAt(0,0),sculptSavedCount=strokeCount(sculpt);saveDoc();
  sculpt.strokes=[];buildTerrain();ok('clear restores procedural base in test',terrainHeightAt(0,0)<sculptSavedHeight-.15);
  await reloadDoc();
  ok('save/reload restores sculpt strokes',strokeCount(sculptState())===sculptSavedCount&&near(terrainHeightAt(0,0),sculptSavedHeight,1e-4));
  undoSculpt();ok('undo removes one sculpt stroke',strokeCount(sculptState())===sculptSavedCount-1);
  clearSculpt();
  const prop=sceneObjects.get(PROP.id);selectRoot(prop);
  ok('object-attached mini menu opens',EDIT.node===prop&&!E('objmenu').hidden);
  const baseUniform=prop.scale.x;
  EDIT.scaleBy(.8);ok('uniform smaller scales prop',near(prop.scale.x,baseUniform*.8));
  EDIT.scaleBy(1.25);ok('uniform larger reverses smaller',near(prop.scale.x,baseUniform));
  EDIT.setMode('scale');prop.scale.setScalar(1.15);prop.position.x+=1.2;prop.position.z-=.7;prop.rotation.y+=THREE.MathUtils.degToRad(15);updateRecordFromRoot(prop);
  const dropReport=EDIT.drop();ok('shared drop reports a surface',dropReport.length===1&&!dropReport[0].refused);
  onEditorMenu('space');ok('world/local toggle reaches gizmo',gizmoSpace==='local');onEditorMenu('space');
  const before=deepClone(sceneDoc.objects.find(o=>o.id===PROP.id).transform);saveDoc();
  prop.position.set(99,99,99);prop.rotation.y=0;updateRecordFromRoot(prop);
  await reloadDoc();
  const after=sceneDoc.objects.find(o=>o.id===PROP.id).transform;
  ok('save/reload restores x',near(before.position[0],after.position[0]));
  ok('save/reload restores z',near(before.position[2],after.position[2]));
  ok('save/reload restores rotation',near(before.rotation[1],after.rotation[1]));
  ok('save/reload restores scale',near(before.scale[0],after.scale[0])&&near(sceneObjects.get(PROP.id).scale.x,before.scale[0]));
  ok('save/reload restores resident Y',near(sceneObjects.get(ACTOR.id).position.y,actorY));
  ok('scene document stores references not bytes',JSON.stringify(sceneDoc).length<12000&&sceneDoc.objects.every(o=>o.source&&o.source.path&&o.source.commit));
  document.body.dataset.selftest='PASS';
  document.body.dataset.selftestCount=report.length+'/'+report.length;
  E('selftest').hidden=false;E('selftest').textContent=report.join('\n');
  status('SELFTEST '+report.length+'/'+report.length+' PASS','ok');
  return report;
}

/* host props (Claude Design tweaks / plain HTML defaults) */
function applyUiProps(p){
  if(!p)return;
  if(typeof p.legend==='boolean')UI.legend=p.legend;
  if(typeof p.selectionRing==='boolean')UI.selectionRing=p.selectionRing;
  updateSculptUi();
}
applyUiProps(window.__wb2dProps);
addEventListener('wb2d-props',e=>applyUiProps(e.detail));

window.__wb2d={
  selftest:()=>runSelfTest().catch(err=>{document.body.dataset.selftest='FAIL';fail(err);throw err}),
  get mode(){return mode},get sculptMode(){return sculptMode},get doc(){return sceneDoc},
  EDIT,PRES,showActor,showProp,showScene,setSculptMode,openDrawer,renderer,camera,controls,scene,
  /* WORLD-INTEGRATION-01 · same state, exposed for the world self-test */
  get world(){return WORLD},get play(){return PLAY},get terrain(){return terrain},STORAGE_KEY,DOC_ID,
  setPlay,terrainHeightAt,sculptState,buildTerrain,refreshDoc,saveDoc,reloadDoc,resetFixture,updateRecordFromRoot,sceneObjects,
  worldSelftest:()=>runWorldSelfTest()
};

try{
  refreshDoc();
  if(PRES.state.drawer==='look')openDrawer('look');
  if(WORLD){
    status('building world zone · '+WORLD.zone.id+' …');
    await WORLD.mount({scene,renderer,getTerrain:()=>terrain,heightAt:(x,z)=>terrainHeightAt(x,z)});
    const saved=localStorage.getItem(STORAGE_KEY);
    if(saved){try{const d=JSON.parse(saved);if(d.format==='kfb-worldbuilder-scene'&&d.id===DOC_ID){sceneDoc=d;ensureSculpt(sceneDoc.terrain);E('saveState').textContent='Loaded saved world · '+(d.savedAt||'no timestamp')}}catch(err){console.warn('saved world unreadable',err)}}
    actorSourceReady=propSourceReady=true;updateReviewUnlock();
    await showScene();
    if(new URLSearchParams(location.search).get('selftest')==='wi1')await runWorldSelfTest();
  }else await showActor();
  if(!WORLD&&new URLSearchParams(location.search).get('selftest')==='1')await runSelfTest();
}catch(err){document.body.dataset.selftest='FAIL';fail(err)}
