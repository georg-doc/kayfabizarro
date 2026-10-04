/* pet-surface.v1.js — KFB Pet Oberflächen-Look als GETEILTES Modul v1 (2026-07-23)
 *
 * Der Aardman-Clay/Papier-Look 1:1 aus „KFB Pet Editor v9" (makeMat + _surfShader +
 * _buildLidSampler + reskin), herausgezogen als teilbarer Code — damit Studio, die Referenz
 * und jeder externe Embed DENSELBEN Look aus DEMSELBEN Vertrag bekommen.
 *
 * Das schließt die „ungare" Stelle: Bewegung/Gesicht/Augen/Mund waren geteilt, die Oberfläche
 * nie. Der Vertrag (`koerper.material.live`) trägt die Settings (texture/surf/paperGold/tintMode/
 * kenneyBase); dieses Modul ist der geteilte Consumer dieser Settings.
 *
 *   const surface = await createPetSurface({ THREE, renderer, material: lib.koerper.material });
 *   const pet = await makePet(lib, 'bunny', { surface });     // kfb-pets.js verdrahtet reskin + lidSampler
 *   // nach scene.add: renderer.compile(scene, camera)  (sonst lazy -> flach/gold)
 *
 * Technik: object-space TRIPLANAR (kein Modell-UV → keine Terrassen), drei Farb-Pfade wie v9:
 * uLook 0 = Recolor · 1 = Kenney-Basis · 2 = Colormap+Papier+Gelb (paperGold, NICHT multiplikativ).
 * Lider (lid:true) laufen bewusst über uLook 0 + uLidM (dunkle Base bleibt) — deshalb tragen sie
 * dieselbe Clay-Oberfläche wie der Körper statt glattem Plastik.
 */

const DEF_SURF = { texScale: 0.9, tint: 0.85, relief: 0.8, knet: 0.22, ao: 0.26, rough: 0.9, freq: 11, modScale: 2.0, modAmt: 0.55, paper: 0.32 };
const TEXBASE_DEFAULT = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/Textures/';

export async function createPetSurface({ THREE, renderer, material, texBase } = {}) {
  const TEXBASE = texBase || TEXBASE_DEFAULT;
  const live = (material && material.live) || {};
  const S = {
    texture: live.texture || 'proc',
    mod: live.mod || 'none',
    surf: Object.assign({}, DEF_SURF, live.surf || {}),
    kenneyBase: !!live.kenneyBase,
    paperGold: live.paperGold !== false,
    tintMode: live.tintMode || 'lum',
  };

  const loadTex = (url) => new Promise((res) => {
    const l = new THREE.TextureLoader(); l.setCrossOrigin('anonymous');
    l.load(url, (t) => {
      t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.NoColorSpace; t.anisotropy = 4;
      try { renderer.initTexture(t); } catch (e) {}   // GPU-Upload erzwingen (Custom-Sampler triggert Auto-Upload nicht)
      res(t);
    }, undefined, () => res(null));
  });
  const white = () => { const t = new THREE.DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1, THREE.RGBAFormat); t.needsUpdate = true; return t; };
  const wtex = white();

  let _tex = null, _nrm = null;
  if (S.texture && S.texture !== 'proc') {
    _tex = await loadTex(TEXBASE + S.texture + '/' + S.texture + '_diffuse.jpg');
    _nrm = await loadTex(TEXBASE + S.texture + '/' + S.texture + '_normal.jpg');
  }
  let pckN = 0;

  // ---- v9 _surfShader, verbatim portiert (mod entfällt: Vertrag = 'none') ----
  function surfShader(mat, useTex, dScale, plain, lid, hasColor) {
    const sf = S.surf;
    const ds = dScale || 1;
    const tex = useTex ? _tex : wtex;
    mat.userData.isClay = true;
    const look = (plain || lid) ? 0 : (S.paperGold ? 2 : (S.kenneyBase ? 1 : 0));
    const pck = 'kfclay' + (++pckN);
    mat.customProgramCacheKey = () => pck;
    mat.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, {
        uFreq: { value: sf.freq }, uKnet: { value: sf.knet }, uAO: { value: sf.ao },
        uTexScale: { value: sf.texScale * ds }, uTint: { value: sf.tint }, uRelief: { value: sf.relief },
        uModScale: { value: sf.modScale }, uModAmt: { value: sf.modAmt },
        uHasTex: { value: useTex ? 1 : 0 }, uTex: { value: tex },
        uHasNrm: { value: (useTex && _nrm) ? 1 : 0 }, uNrm: { value: (useTex && _nrm) ? _nrm : wtex },
        uModKind: { value: 0 }, uMod: { value: wtex },
        uLook: { value: look }, uTintMode: { value: S.tintMode === 'lerp' ? 1 : 0 },
        uHasColor: { value: hasColor ? 1 : 0 }, uPaper: { value: sf.paper != null ? sf.paper : 0.32 }, uLidM: { value: lid ? 1 : 0 },
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
          + '  float ao=kfN(p*uFreq*0.5); diffuseColor.rgb*=mix(1.0-uAO,1.0,smoothstep(0.2,0.72,ao));\n'
          + '  if(uModKind>1.5){ float md=kfMod(p,w);\n'
          + '    if(uModKind<2.5) diffuseColor.rgb*=mix(1.0,1.0-0.85*uModAmt,md);\n'
          + '    else diffuseColor.rgb=mix(diffuseColor.rgb, vec3(0.90,0.86,0.72), md*uModAmt); } }');
      mat.userData.shader = sh;
    };
    mat.needsUpdate = true;
    return mat;
  }

  // ---- v9 makeMat (mode fest = clay; cel/original entfallen hier) ----
  function makeMat(o = {}) {
    const col = new THREE.Color(o.color != null ? o.color : 0xffffff);
    const useTex = S.texture !== 'proc' && !!_tex;
    const keepMap = S.kenneyBase || S.paperGold || !useTex;   // paperGold behält die Colormap NEBEN der Triplanar-Textur
    const mat = new THREE.MeshStandardMaterial({
      color: col, map: keepMap ? (o.map || null) : null, metalness: 0,
      roughness: o.roughness != null ? o.roughness : S.surf.rough, envMapIntensity: 1.0, flatShading: false,
    });
    const hasColor = (!o.plain && !o.lid && o.color != null && o.color !== 0xffffff) ? 1 : 0;
    surfShader(mat, useTex, o.detailScale, o.plain, o.lid, hasColor);
    return mat;
  }

  function findBody(ch) {
    if (ch._body) return ch._body;
    let best = null, bestV = -1;
    (ch.inner || ch.group).traverse((n) => {
      if (!n.isMesh || n.userData.petOverlay) return;
      if (n.name && n.name.toLowerCase() === 'body') { best = n; bestV = 1e9; return; }
      if (!n.geometry.boundingBox) n.geometry.computeBoundingBox();
      const s = n.geometry.boundingBox.getSize(new THREE.Vector3()); const v = s.x * s.y * s.z;
      if (v > bestV) { bestV = v; best = n; }
    });
    return best;
  }
  function buildLidSampler(ch) {
    const body = findBody(ch);
    const tex = body && (body.userData._glbMap || (body.material && body.material.map));
    const img = tex && tex.image;
    if (!img || !img.width) return null;
    const w = img.width, h = img.height;
    const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
    const g = cv.getContext('2d', { willReadFrequently: true });
    g.drawImage(img, 0, 0, w, h);
    let px; try { px = g.getImageData(0, 0, w, h); } catch (e) { return null; }
    const d = px.data;
    return (u, v) => {   // GLTF flipY=false -> Zeile = v*H (nicht 1-v); uv wrappen
      const uu = ((u % 1) + 1) % 1, vv = ((v % 1) + 1) % 1;
      const x = Math.min(w - 1, Math.max(0, Math.floor(uu * w)));
      const y = Math.min(h - 1, Math.max(0, Math.floor(vv * h)));
      const i = (y * w + x) * 4;
      return new THREE.Color().setStyle('rgb(' + d[i] + ',' + d[i + 1] + ',' + d[i + 2] + ')');
    };
  }

  const surface = {
    state: S,
    makeMat,
    lidSampler: null,
    // Ob der EyeRig aus der Colormap sampeln soll (v9-Regel: kenneyBase ODER kein pet.color)
    usesLidSampler(petHex) { return !!(S.kenneyBase || petHex == null); },
    // v9 reskin: native Colormap behalten, Farbe je Pfad; danach lidSampler bauen
    reskin(ch, petHex) {
      if (!ch || !ch.inner) return;
      ch.inner.traverse((n) => {
        if (!n.isMesh || n.userData.petOverlay) return;
        const glbMap = n.userData._glbMap !== undefined ? n.userData._glbMap : ((n.material && n.material.map) || null);
        let map = glbMap, color = 0xffffff;
        if (S.paperGold) { map = glbMap; color = (petHex != null ? petHex : 0xffffff); }
        else if (S.kenneyBase) { map = glbMap; color = 0xffffff; }
        else if (map && petHex != null) map = ch._recolorMap(map, petHex);
        n.material = makeMat({ map, color });
        n.castShadow = true; n.receiveShadow = false; n.frustumCulled = false;
      });
      this.lidSampler = buildLidSampler(ch);
      return this;
    },
  };
  return surface;
}

export default { createPetSurface };
