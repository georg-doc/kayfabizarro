/* kfb-pet-look.js · DER STUDIO-LOOK FÜR DIE 24 CUBE-PETS IM SCHUSSSTAND (v1, 04.09.2026)
 *
 * ═══ WARUM DIESES MODUL EXISTIERT ════════════════════════════════════════════
 * `kfb-pet-roster.js` sagt in seinem Kopf: „hier kommen die Modelle NACKT herein —
 * der Studio-Look ist eine eigene Schicht." Das war ehrlich und falsch zugleich:
 * ehrlich, weil es die Lücke benannt hat, falsch, weil Georg im Bild zwei
 * verschiedene Pets sah. Sein Befund vom 04.09. nennt drei Stellen, und alle drei
 * sind dieselbe Ursache:
 *   1. „cube pets sind ca 1/3 zu groß"          → Maßstab, gehört in den Roster
 *   2. „haben nicht das eye-rig … und mund"     → hier
 *   3. „farbe und textur … entspricht nicht"    → hier
 * Punkt 1 ist im Roster erledigt (H_FAKTOR). Punkte 2 und 3 sind DIESE Schicht.
 *
 * ═══ WAS HIER *NICHT* NEU GEBAUT WIRD ════════════════════════════════════════
 * Nichts von dem Gesicht. Es wird GEHOLT, aus genau den Dateien, die das Pet
 * Studio v10 lädt — sonst gäbe es zwei Wahrheiten über dasselbe Auge:
 *   ../studio-v3/pet-library.v6.js   faceShells · selectEyeShells · buildStripped
 *                                    (Kenneys flache Augen sind GEOMETRIE im
 *                                    body-Mesh, keine Textur — sie müssen aus dem
 *                                    Index geschnitten werden, sonst schimmern sie
 *                                    unter dem Rig durch)
 *   ../studio-v3/pet-eye-rig.v5.js   EyeRig: Augapfel, Lider, Pupille, Blinzeln,
 *                                    Leben, Blickfolge
 *   ../studio-v3/pet-mouth.v1.js     PetMouth: 13 Decals, angeschmiegt an die Fläche
 *   ../pet-LIBRARY.json              die Werte: pet.color, eye.anchor je Pet,
 *                                    material.live (der abgenommene Look), face
 *                                    (die Schnittregel), emotes
 *
 * ═══ DIE EINE SCHULD, DIE HIER STEHEN BLEIBT ═════════════════════════════════
 * Der Oberflächen-Shader (`makeMat` + Triplanar-Clay) ist aus `KFB Pet Studio
 * v10.dc.html` HERÜBERGETRAGEN, nicht importiert — dort lebt er als Methode im
 * Wirt, nicht als Modul. Der GLSL-Quelltext ist Zeichen für Zeichen derselbe; was
 * sich unterscheidet, ist nur der Zulauf (dort Regler-Zustand, hier
 * `material.live`). Das sind zwei Kopien EINES Shaders, und das ist eine Schuld:
 * wer im Studio am Shader schraubt, muss hier nachziehen. Der richtige Schnitt wäre
 * `studio-v3/pet-surface.v1.js`, das BEIDE laden — der Umbau des Studios gehört
 * aber nicht in diese Runde, und eine unbenannte Kopie wäre schlimmer als eine
 * benannte. `tor()` meldet sie als offenen Punkt, damit sie nicht in Vergessenheit
 * gerät.
 *
 * VERTRAG
 *   library()                       → pet-LIBRARY.json (gecacht)
 *   createLook(THREE, {renderer, scene, cam}) → Look
 *   Look.makeMat(o)                 → Studio-Material (Clay/Triplanar)
 *   Look.skin(root, petId)          → Körper umskinnen (Farbe + Textur)
 *   Look.face(root, petId)          → Kenney-Augen schneiden, Rig + Mund setzen → Face
 *   Face.update(dt, cam) · Face.lookAt(worldVec3) · Face.dispose()
 *   zeile() · tor()
 */

import { faceShells, selectEyeShells, buildStripped } from '../studio-v3/pet-library.v6.js';
import { EyeRig } from '../studio-v3/pet-eye-rig.v5.js';
import { PetMouth, MOUTH_DEFAULTS } from '../studio-v3/pet-mouth.v1.js';

const RAW = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/';
export const LIB_URLS = ['../pet-LIBRARY.json', RAW + 'pet-LIBRARY.json'];
const TEXBASE = RAW + 'Textures/';

/* Der Bootzustand des Studios (Reglerstellungen, die KEIN Vertragsfeld haben).
   `material.live` aus der Bibliothek legt sich darüber — dort steht der von Georg
   abgenommene Look, und der gewinnt. */
const BOOT = {
  mode: 'clay', texture: 'proc', mod: 'none',
  kenneyBase: false, paperGold: true, tintMode: 'lum', recolor: true, facet: false,
  surf: { texScale: 0.9, tint: 0.85, relief: 0.8, knet: 0.22, ao: 0.26, rough: 0.90, freq: 11, modScale: 2.0, modAmt: 0.55, paper: 0.32 }
};

const hexInt = (h) => parseInt(String(h).replace('#', ''), 16);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

let _libPr = null;
export function library() {
  if (_libPr) return _libPr;
  _libPr = (async () => {
    let last = null;
    for (const u of LIB_URLS) {
      try {
        const r = await fetch(new URL(u, import.meta.url).href);
        if (r.ok) return await r.json();
        last = 'HTTP ' + r.status + ' · ' + u;
      } catch (e) { last = String(e && e.message || e) + ' · ' + u; }
    }
    throw new Error('pet-LIBRARY.json nicht erreichbar (' + last + ')');
  })();
  return _libPr;
}

/* Der Roster führt `p_bunny`, die Bibliothek `bunny`. Ein Präfix ist keine Kennung. */
const bareId = (id) => String(id || '').replace(/^p_/, '');
function petOf(lib, id) {
  const pid = bareId(id);
  return ((lib && lib.pets) || []).find((p) => p.id === pid) || { id: pid, skin: 'default' };
}

/* ---------- Texturen ------------------------------------------------------- */
const _texCache = new Map();
function loadTex(THREE, renderer, url) {
  if (_texCache.has(url)) return _texCache.get(url);
  const pr = new Promise((res) => {
    const L = new THREE.TextureLoader(); L.setCrossOrigin('anonymous');
    L.load(url, (t) => {
      /* Object-space Triplanar sampelt ROH und linearisiert im Shader — mit
         SRGBColorSpace läge die Gamma-Korrektur doppelt drin. */
      t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.NoColorSpace; t.anisotropy = 4;
      /* GPU-Upload erzwingen: ein eigener Sampler-Uniform triggert three's
         Auto-Upload NICHT — ohne das sampelt der Shader Weiß (Studio-Befund). */
      try { if (renderer) renderer.initTexture(t); } catch (e) {}
      res(t);
    }, undefined, () => res(null));
  });
  _texCache.set(url, pr);
  return pr;
}

let _envPr = null;
/* Die drei Glanzpunkte auf der Pupille kommen im Studio aus RoomEnvironment.
   Der Schussstand hat keine — und soll auch keine bekommen: `scene.environment`
   gilt für ALLES, das würde Boden, Mechs und Monster mit umlackieren. Also hängt
   die Spiegelung an den AUGENMATERIALIEN, nicht an der Szene. */
function eyeEnv(THREE, renderer) {
  if (_envPr) return _envPr;
  _envPr = (async () => {
    if (!renderer) return null;
    try {
      const { RoomEnvironment } = await import('three/addons/environments/RoomEnvironment.js');
      const pm = new THREE.PMREMGenerator(renderer);
      const t = pm.fromScene(new RoomEnvironment(), 0.04).texture;
      pm.dispose();
      return t;
    } catch (e) { console.warn('[pet-look] kein Augen-Env: ' + (e && e.message || e)); return null; }
  })();
  return _envPr;
}

export async function createLook(THREE, host) {
  host = host || {};
  const renderer = host.renderer || null;
  const lib = await library();
  const live = (lib.material && lib.material.live) || {};
  const look = Object.assign({}, BOOT, live, { surf: Object.assign({}, BOOT.surf, live.surf || {}) });
  if (lib.material && lib.material.default) look.mode = lib.material.default;

  let tex = null, nrm = null;
  if (look.texture && look.texture !== 'proc') {
    tex = await loadTex(THREE, renderer, TEXBASE + look.texture + '/' + look.texture + '_diffuse.jpg');
    nrm = await loadTex(THREE, renderer, TEXBASE + look.texture + '/' + look.texture + '_normal.jpg');
    if (!tex) console.warn('[pet-look] Textur „' + look.texture + '" nicht ladbar — prozedurales Clay');
  }
  let white = null;
  const W = () => {
    if (white) return white;
    white = new THREE.DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1, THREE.RGBAFormat);
    white.needsUpdate = true;
    return white;
  };
  let pck = 0;
  const env = await eyeEnv(THREE, renderer);

  const L = {
    lib: lib, look: look, tex: tex, nrm: nrm, env: env,
    /* ═══ HERÜBERGETRAGEN aus KFB Pet Studio v10 · _surfShader ═══════════════
       Object-space Triplanar: Basis = prozedurales Knet-Clay ODER echte
       Diffuse-Textur (kein Modell-UV → keine Terrassen). Relief aus
       Textur-Luminanz + Knet-Noise; breite weiche AO. */
    _surfShader(mat, useTex, dScale, plain, lid) {
      const sf = look.surf;
      const ds = dScale || 1;
      mat.userData.dScale = ds;
      mat.userData.isClay = true;
      const t = useTex ? tex : W();
      /* uLook 0=recolor / 1=Kenney-Basis / 2=Colormap+Papier+Gelb. Lider gehen
         NIE durch Pfad 1/2 — dort würde die fehlende Colormap als Weiß gelesen
         und die abgedunkelte Lid-Base weggeblichen (Studio-Fix „dunkle Augenringe"). */
      const lk = (plain || lid) ? 0 : (look.paperGold ? 2 : (look.kenneyBase ? 1 : 0));
      /* three cacht Shader-Programme nach Quelltext → teilen sich Materialien EIN
         Programm, läuft onBeforeCompile für die weiteren NICHT und ihre
         Custom-Uniforms bleiben ungebunden (= glattes Material ohne Textur). */
      const key = 'kfclay' + (++pck);
      mat.customProgramCacheKey = () => key;
      mat.onBeforeCompile = (sh) => {
        Object.assign(sh.uniforms, {
          uFreq: { value: sf.freq }, uKnet: { value: sf.knet }, uAO: { value: sf.ao },
          uTexScale: { value: sf.texScale * ds }, uTint: { value: sf.tint }, uRelief: { value: sf.relief },
          uModScale: { value: sf.modScale }, uModAmt: { value: sf.modAmt },
          uHasTex: { value: useTex ? 1 : 0 }, uTex: { value: t },
          uHasNrm: { value: (useTex && nrm) ? 1 : 0 }, uNrm: { value: (useTex && nrm) ? nrm : W() },
          uModKind: { value: 0 }, uMod: { value: W() },
          uLook: { value: lk }, uTintMode: { value: look.tintMode === 'lerp' ? 1 : 0 },
          uHasColor: { value: mat.userData.hasColor ? 1 : 0 },
          uPaper: { value: sf.paper != null ? sf.paper : 0.32 }, uLidM: { value: lid ? 1 : 0 },
        });
        sh.vertexShader = sh.vertexShader
          .replace('#include <common>', '#include <common>\nvarying vec3 vObjP;\nvarying vec3 vObjN;\nvarying mat3 vNMat;')
          .replace('#include <beginnormal_vertex>', '#include <beginnormal_vertex>\n  vObjN = objectNormal;')
          .replace('#include <begin_vertex>', '#include <begin_vertex>\n  vObjP = transformed;\n  vNMat = normalMatrix;');
        sh.fragmentShader = sh.fragmentShader
          .replace('#include <common>', '#include <common>\n'
            + 'varying vec3 vObjP; varying vec3 vObjN; varying mat3 vNMat;\n'
            + 'uniform float uFreq,uKnet,uAO,uTexScale,uTint,uRelief,uModScale,uModAmt,uHasTex,uHasNrm,uModKind,uLook,uTintMode,uHasColor,uPaper,uLidM;\n'
            + 'uniform sampler2D uTex,uMod,uNrm;\n'
            + 'float kfH(vec3 p){ p=fract(p*0.3183099+0.1); p*=17.0; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }\n'
            + 'float kfN(vec3 x){ vec3 i=floor(x),f=fract(x); f=f*f*(3.0-2.0*f);\n'
            + '  return mix(mix(mix(kfH(i+vec3(0,0,0)),kfH(i+vec3(1,0,0)),f.x),mix(kfH(i+vec3(0,1,0)),kfH(i+vec3(1,1,0)),f.x),f.y),\n'
            + '             mix(mix(kfH(i+vec3(0,0,1)),kfH(i+vec3(1,0,1)),f.x),mix(kfH(i+vec3(0,1,1)),kfH(i+vec3(1,1,1)),f.x),f.y),f.z); }\n'
            + 'vec3 kfW(vec3 n){ vec3 w=pow(abs(normalize(n)),vec3(2.0)); return w/max(w.x+w.y+w.z,1e-4); }\n'
            + 'vec4 kfTri(sampler2D t,vec3 p,vec3 w){ return texture2D(t,p.yz)*w.x+texture2D(t,p.xz)*w.y+texture2D(t,p.xy)*w.z; }\n'
            + 'float kfMod(vec3 p,vec3 w){ vec4 c=kfTri(uMod,p*uModScale,w); return (c.a<0.999)?c.a:(1.0-dot(c.rgb,vec3(0.3333))); }\n'
            + 'float kfHeight(vec3 p){ vec3 w=kfW(vObjN); float h=uKnet*(kfN(p*uFreq)*0.8+kfN(p*uFreq*2.0)*0.2);\n'
            + '  if(uModKind>0.5 && uModKind<1.5) h+=uModAmt*0.4*kfMod(p,w); return h; }')
          .replace('#include <normal_fragment_maps>', '#include <normal_fragment_maps>\n'
            + '{ vec3 p=vObjP; float e=0.15/uFreq;\n'
            + '  vec3 g=vec3(kfHeight(p+vec3(e,0.,0.))-kfHeight(p-vec3(e,0.,0.)), kfHeight(p+vec3(0.,e,0.))-kfHeight(p-vec3(0.,e,0.)), kfHeight(p+vec3(0.,0.,e))-kfHeight(p-vec3(0.,0.,e)))/(2.0*e);\n'
            + '  vec3 gn=normalize(vObjN); g-=gn*dot(g,gn); vec3 nObj=normalize(gn-g);\n'
            + '  if(uHasNrm>0.5){ vec3 w=kfW(gn);\n'
            + '    vec3 tx=texture2D(uNrm,p.zy*uTexScale).xyz*2.0-1.0;\n'
            + '    vec3 ty=texture2D(uNrm,p.xz*uTexScale).xyz*2.0-1.0;\n'
            + '    vec3 tz=texture2D(uNrm,p.xy*uTexScale).xyz*2.0-1.0;\n'
            + '    tx.xy*=uRelief; ty.xy*=uRelief; tz.xy*=uRelief;\n'
            + '    tx=vec3(tx.xy+nObj.zy, abs(tx.z)*nObj.x);\n'
            + '    ty=vec3(ty.xy+nObj.xz, abs(ty.z)*nObj.y);\n'
            + '    tz=vec3(tz.xy+nObj.xy, abs(tz.z)*nObj.z);\n'
            + '    nObj=normalize(tx.zyx*w.x + ty.xzy*w.y + tz.xyz*w.z); }\n'
            + '  normal=normalize(vNMat*nObj); }')
          .replace('#include <map_fragment>', '#ifdef USE_MAP\n'
            + '  vec4 kfMap=texture2D(map,vMapUv);\n'
            + '  if(uLook<1.5) diffuseColor*=kfMap;\n'
            + '#endif')
          .replace('#include <color_fragment>', '#include <color_fragment>\n'
            + '{ vec3 p=vObjP; vec3 w=kfW(vObjN);\n'
            + '  float lp=1.0; vec3 tex=vec3(1.0);\n'
            + '  if(uHasTex>0.5){ tex=pow(kfTri(uTex,p*uTexScale,w).rgb,vec3(2.2)); lp=dot(tex,vec3(0.299,0.587,0.114)); }\n'
            + '  if(uLook>1.5){\n'
            + '    vec3 cm=vec3(1.0);\n'
            + '    #ifdef USE_MAP\n      cm=texture2D(map,vMapUv).rgb;\n    #endif\n'
            + '    vec3 baseC=cm*mix(1.0, lp*1.7, uPaper);\n'
            + '    vec3 yellow=diffuseColor.rgb;\n'
            + '    float t=uTint*uHasColor;\n'
            + '    vec3 tinted;\n'
            + '    if(uTintMode<0.5){\n'
            + '      float lum=dot(baseC,vec3(0.299,0.587,0.114));\n'
            + '      float yl=max(dot(yellow,vec3(0.299,0.587,0.114)),1e-3);\n'
            + '      tinted=mix(baseC, (yellow/yl)*lum, t);\n'
            + '    } else {\n'
            + '      tinted=mix(baseC, yellow, t);\n'
            + '    }\n'
            + '    diffuseColor.rgb=tinted;\n'
            + '  } else if(uLook>0.5){\n'
            + '    if(uHasTex>0.5) diffuseColor.rgb*=mix(vec3(1.0),vec3(lp*1.9),uTint);\n'
            + '  } else if(uHasTex>0.5){\n'
            + '    if(uLidM>0.5){ diffuseColor.rgb*=mix(1.0, lp*1.25, uTint); }\n'
            + '    else { vec3 recol=diffuseColor.rgb*lp*1.9; diffuseColor.rgb=mix(tex, recol, uTint); }\n'
            + '  }\n'
            + '  float ao=kfN(p*uFreq*0.5); diffuseColor.rgb*=mix(1.0-uAO,1.0,smoothstep(0.2,0.72,ao)); }');
        mat.userData.shader = sh;
      };
      mat.needsUpdate = true;
      return mat;
    },
    makeMat(o) {
      o = o || {};
      const col = new THREE.Color(o.color != null ? o.color : 0xffffff);
      if (look.mode === 'original') return new THREE.MeshStandardMaterial({ color: col, map: o.map || null, metalness: 0, roughness: o.roughness != null ? o.roughness : 0.55, envMapIntensity: 0.6 });
      const useTex = look.texture !== 'proc' && !!tex;
      /* paperGold BEHÄLT die Colormap neben der Triplanar-Textur (farbige Innenohren). */
      const keepMap = look.kenneyBase || look.paperGold || !useTex;
      const mat = new THREE.MeshStandardMaterial({
        color: col, map: keepMap ? (o.map || null) : null, metalness: 0,
        roughness: o.roughness != null ? o.roughness : look.surf.rough,
        envMapIntensity: 1.0, flatShading: false
      });
      mat.userData.hasColor = o.hasColor ? 1 : 0;
      L._surfShader(mat, useTex, o.detailScale, o.plain, o.lid);
      return mat;
    },
    /* ---------- Punkt 3: Farbe und Textur ---------------------------------- */
    skin(root, petId) {
      const p = petOf(lib, petId);
      const hex = (look.recolor !== false && p.color) ? hexInt(p.color) : null;
      let n = 0;
      root.traverse((m) => {
        if (!m.isMesh || m.userData.petOverlay) return;
        /* Die Original-Colormap überlebt jeden Textur-Wechsel — sie liegt im GLB
           und ist die Quelle der farbigen Innenohren. */
        const glbMap = m.userData._glbMap !== undefined ? m.userData._glbMap : ((m.material && m.material.map) || null);
        m.userData._glbMap = glbMap;
        let map = glbMap, color = 0xffffff;
        if (look.paperGold) { color = (hex != null ? hex : 0xffffff); }
        else if (look.kenneyBase) { color = 0xffffff; }
        m.material = L.makeMat({ map: map, color: color, hasColor: hex != null });
        m.castShadow = true; m.receiveShadow = false;
        /* Knoten-animierte GLB-Nodes: die lokale BoundingSphere trackt die
           Clip-Transforms nicht → sonst wird mitten in der Bewegung gecullt. */
        m.frustumCulled = false;
        n++;
      });
      /* Deterministisch kompilieren → onBeforeCompile läuft und bindet die
         Custom-Uniforms SOFORT. Ohne das kompiliert three lazy und uneinheitlich,
         und einzelne Meshes bleiben ohne Textur (der „goldene Klotz"). */
      if (renderer && host.scene && host.cam) { try { renderer.compile(host.scene, host.cam); } catch (e) {} }
      return n;
    },
    /* ---------- Punkt 2: Augen-Rig und Mund -------------------------------- */
    async face(root, petId) {
      const p = petOf(lib, petId);
      const fc = lib.face || {};
      /* KENNEYS AUGEN SIND GEOMETRIE. Sie liegen als getrennte Schalen im
         body-Mesh auf einer konstanten Z-Ebene (0,635, an 24 von 24 Pets
         vermessen). Bleiben sie stehen, schimmern sie unter dem Rig durch — genau
         das, was Georg als „flache default kenney-eyes" gesehen hat. */
      const meshes = [];
      root.traverse((m) => { if (m.isMesh && !m.userData.petOverlay) meshes.push(m); });
      const body = meshes.find((m) => m.name && m.name.toLowerCase() === 'body') || meshes[0] || null;
      let cut = 0;
      if (body && fc.stripEyes !== false) {
        const geo = body.userData._faceOrigGeo || body.geometry;
        body.userData._faceOrigGeo = geo;
        const shells = faceShells(geo);
        const pair = selectEyeShells(shells, fc);
        if (pair) {
          const tris = shells[pair[0]].tris.concat(shells[pair[1]].tris);
          body.geometry = buildStripped(geo, tris, fc.facet === true);
          cut = tris.length;
        } else console.warn('[pet-look] ' + p.id + ': kein Augenpaar gefunden — Kenney-Augen bleiben stehen');
      }
      /* Der Schein-Character: EyeRig und PetMouth brauchen genau drei Dinge —
         `THREE`, `inner` (der Wurzelknoten) und `o.makeMat`. Einen ganzen
         Character zu instanzieren hieße, das GLB ein zweites Mal zu laden. */
      const ch = { THREE: THREE, inner: root, o: { makeMat: (o) => L.makeMat(o) } };
      const er = lib.eyeRig || {};
      const eye = p.eye || {};
      const style = eye.pupilStyle || 'matte-cute';
      const pick = (a, b, d) => (a != null ? a : (b != null ? b : d));
      const rig = new EyeRig(ch, {
        anchor: eye.anchor || er.anchorDefault,
        pupilStyle: style,
        blink: er.blink,
        pupilSize: pick(eye.pupilSize, er.pupilSize, 0.4),
        inset: pick(eye.inset, er.inset, 0),
        lidFit: pick(eye.lidFit, er.lidFit, 0.9),
        gloss: (er.gloss && er.gloss[style] != null) ? er.gloss[style] : 0.85,
        converge: pick(eye.converge, er.converge, 0),
        baseColor: p.color ? hexInt(p.color) : 0xf2c93c,
        lashes: eye.lashes || (fc.eye && fc.eye.lashes) || { length: 0, density: 6, width: 1 }
      });
      rig.build();
      const em = ((lib.emotes || []).find((e) => e.id === (p.defaultEmote || 'neutral'))) || null;
      if (em) rig.applyEmote(em);
      rig.setGazeFollow(true);
      if (env && rig.rig) rig.rig.traverse((m) => {
        if (m.isMesh && m.material && m.material.isMeshPhysicalMaterial) { m.material.envMap = env; m.material.needsUpdate = true; }
      });
      const mp = Object.assign({}, MOUTH_DEFAULTS, lib.mouth || {}, p.mouth || {});
      const mouth = new PetMouth(ch, { params: mp });
      mouth.build();
      mouth.rest = 'neutral';
      mouth.setTex('neutral', false);

      /* Blickachse: das Rig sitzt auf +Z des body (fitAt strahlt von +Z nach −Z).
         Der Anker-Mittelpunkt der beiden Augen ist der Ursprung des Blicks — nicht
         der Körpermittelpunkt, sonst zeigt die Pupille bei einem breiten Pet
         dauerhaft schräg. */
      const eyeMid = new THREE.Vector3();
      if (rig.eyes) eyeMid.addVectors(rig.eyes[0].position, rig.eyes[1].position).multiplyScalar(0.5);
      let U = 1;
      if (body) {
        if (!body.geometry.boundingBox) body.geometry.computeBoundingBox();
        U = Math.max(0.05, body.geometry.boundingBox.getSize(new THREE.Vector3()).y / 2);
      }
      const _v = new THREE.Vector3();

      return {
        petId: p.id, rig: rig, mouth: mouth, body: body, cutTris: cut,
        /* Gegner-Tracking: Weltpunkt → body-lokal → normierter Blickvektor.
           `pointTo` erwartet −1…1 und rechnet selbst auf die Pupillenreise
           (`anchor.track`) um; hier wird also die RICHTUNG geliefert, nicht der Weg. */
        lookAt(world) {
          if (!body || !rig.eyes || !world) return;
          _v.copy(world); body.worldToLocal(_v).sub(eyeMid);
          const fz = Math.max(Math.abs(_v.z), U * 0.6);
          rig.pointTo(clamp(_v.x / fz, -1, 1), clamp(_v.y / fz, -1, 1));
        },
        update(dt, cam) {
          rig.update(dt);
          mouth.update(dt, cam);
        },
        /* Beim Anschlag geht das Maul auf und die Lider reißen — das ist die
           Trefferreaktion, die dem Pet-Clipsatz fehlt (kein `hit` im GLB). */
        hit() {
          rig.applyEmote({ lidUpper: 0.9, lidLower: 0.5, slant: -0.2, pupil: 'wide', gaze: 'front' });
          mouth.setTex('ah', true);
          clearTimeout(this._ht);
          this._ht = setTimeout(() => {
            if (em) rig.applyEmote(em); else rig.applyEmote(null);
            mouth.setTex('neutral', false);
          }, 420);
        },
        dispose() {
          clearTimeout(this._ht);
          try { rig.dispose(); } catch (e) {}
          try { mouth.dispose(); } catch (e) {}
        }
      };
    }
  };
  return L;
}

export function zeile() {
  return 'pet-look · Studio-Gesicht für die Cube-Pets: Kenney-Augen geschnitten (Geometrie, zPlane 0,635), '
    + 'EyeRig v5 (Augapfel · Lider · Pupille · Blinzeln · Blickfolge) + PetMouth v1 (13 Decals, angeschmiegt) '
    + '· Farbe und Textur aus pet-LIBRARY.json material.live · Augen-Env am Material, nicht an der Szene';
}

export function tor() {
  const z = []; let ok = 0, von = 0, nm = 0;
  const pruef = (b, gut, schlecht) => { von++; if (b) { ok++; z.push('\u2713 ' + gut); } else z.push('\u2717 ' + schlecht); };
  const offen = (s) => { nm++; z.push('\u2013 ' + s + ' (nicht messbar)'); };

  pruef(typeof faceShells === 'function' && typeof selectEyeShells === 'function' && typeof buildStripped === 'function',
    'Schnittregel aus pet-library.v6 geladen (kein Nachbau)', 'pet-library.v6.js liefert die Schalen-Funktionen nicht');
  pruef(typeof EyeRig === 'function', 'EyeRig v5 geladen (dieselbe Klasse wie im Studio)', 'pet-eye-rig.v5.js fehlt');
  pruef(typeof PetMouth === 'function' && !!MOUTH_DEFAULTS, 'PetMouth v1 geladen', 'pet-mouth.v1.js fehlt');
  /* Der Satz, der fallen MUSS, wenn jemand die Bootwerte des Studios anfasst:
     `material.live` soll gewinnen, nicht BOOT. Fällt der Vorrang weg, sieht das
     Pet wieder anders aus als im Studio — und genau das war der Befund. */
  pruef(BOOT.paperGold === true && BOOT.tintMode === 'lum',
    'Bootzustand entspricht dem Studio (paperGold · tintMode lum)', 'Bootzustand weicht vom Studio ab');
  offen('DIE EINE SCHULD: der Oberflächen-Shader ist eine KOPIE aus KFB Pet Studio v10 (dort Methode, nicht Modul). '
    + 'Richtiger Schnitt wäre studio-v3/pet-surface.v1.js, geladen von beiden — wer im Studio am Shader schraubt, muss hier nachziehen');
  offen('Sitz von Auge und Mund im BILD: nur 6 der 24 Pets haben einen eigenen eye.anchor in der Bibliothek, '
    + 'die anderen tragen anchorDefault — das ist im Studio abgenommen, im Schussstand ungeprüft');

  return { ok: ok === von, bestanden: ok, von: von, nichtMessbar: nm, zeilen: z,
           text: 'pet-look: ' + ok + '/' + von + ' bestanden' + (nm ? ', ' + nm + ' nicht messbar' : '') };
}
