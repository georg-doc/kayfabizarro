#!/usr/bin/env python3
"""B2 Figuren-Auswahl · catalogue + local copies (Steuerung 11.10.). Reads the eye-cleanup sources, copies every playable figure into
public/assets/figures-b2/<id>/ and writes public/assets/figures-b2/catalog.json. Local only (KayKit CC0 / Georg's FB; Lab not public).

Groups / eye rule (Steuerung, vorläufig — die NEUERE Georg-Abnahme gilt):
  A pass01   EYE-CLEANUP-01 (Georg PASS 01.10.)  anchored NoEyes, lid = measured skin of that figure
  B dxdy     rig-large-reviewed.v1.json (Georg 20.09., dx/dy) for the Large without a CLEANUP-01 entry, original GLB @ 986699c
  C cand02   EYE-CLEANUP-02 candidates           anchored NoEyes, lid = measured skin — marked „Kandidat“
  D original figures without a NoEyes version     their own eyes — marked „Original-Augen“
  E fb       FrizzleBob v3 / v4 / v5             own FB eyes (FB_Eye_L/R)
Rigs: Medium (Rig_Medium clips), Large (Rig_Large clips), Legacy (embedded clips or none → Idle / static, marked).
"""
import json, os, re, shutil, subprocess, sys
HOME = os.path.expanduser('~')
LAB = os.path.join(HOME, 'Dropbox/CLAUDE/KFB Island Worldbuilder Lab')
OUT = os.path.join(LAB, 'public/assets/figures-b2')
S16 = os.path.join(HOME, 'Dropbox/CLAUDE/KFB Resident Atlas S16/NPC_SETTINGS_01')
A3D = os.path.join(HOME, 'Dropbox/CLAUDE/Frizzlebob fractal almanac BRIEFING anchor v2/3D TableDiorama KFB + PET Editor + PDF VIewer/3D ASSETS')
RA1 = os.path.join(HOME, 'Dropbox/CLAUDE/KFB_RESIDENT_ATLAS_SESSION_CUT_2026-10-04_r1')
CLONE = os.path.join(HOME, 'Developer/kayfabizarro-publish')
LARGE = {'OrcBrute', 'DemonLord', 'Monstrosity', 'BlackKnight', 'FrostGolem', 'Clanker', '4GTN', '4GTN_Forgotten', 'Mannequin_Large'}
if os.path.isdir(OUT): shutil.rmtree(OUT)  # generated output only — rebuilt from the sources each run
os.makedirs(OUT, exist_ok=True)
cat = []
SKIPPED = []
GLBS = {}
for root, _, files in os.walk(A3D):
    for f in files:
        if f.lower().endswith('.glb') and 'noeyes' not in f.lower() and 'anim' not in root.lower(): GLBS.setdefault(f[:-4], os.path.join(root, f))
MANN = os.path.join(A3D, 'KayKit_Character_Animations_1.1/Mannequin Character/characters')
for n in ('Mannequin_Medium', 'Mannequin_Large'): GLBS[n] = os.path.join(MANN, n + '.glb')

def slug(s): return re.sub(r'[^a-z0-9]+', '_', s.lower()).strip('_')
def textures_for(glb_path, label=''):
    """variant PNGs: the pack's textures folder next to the character folder (up to 3 levels up), only files named after this
    figure (a shared pack folder holds the other characters' atlases with other UV layouts — swapping those would be wrong)"""
    if not glb_path: return []
    key = {'orcraider': 'orc_texture'}.get(label.lower(), label.lower().split('_')[0])
    d = os.path.dirname(glb_path)
    for _ in range(4):
        t = os.path.join(d, 'textures')
        if os.path.isdir(t): return sorted(os.path.join(t, x) for x in os.listdir(t) if x.lower().endswith('.png') and x.lower().startswith(key) and 'faces' not in x.lower())
        d = os.path.dirname(d)
    return []
def copy_into(fid, src, name=None):
    os.makedirs(os.path.join(OUT, fid), exist_ok=True); dst = os.path.join(OUT, fid, name or os.path.basename(src)); shutil.copy2(src, dst); return 'figures-b2/' + fid + '/' + os.path.basename(dst)
def add(fid, label, group, rig, glb_rel, eyes, status, src_glb=None, skin=None, extra=None):
    tex = textures_for(src_glb, label)
    variants = [copy_into(fid, t) for t in tex][:6]
    e = {'id': fid, 'label': label, 'group': group, 'rig': rig, 'glb': glb_rel, 'eyes': eyes, 'status': status, 'skin': skin, 'variants': variants}
    if extra: e.update(extra)
    cat.append(e)

# A · EYE-CLEANUP-01 (Georg PASS 01.10.)
c1 = json.load(open(os.path.join(S16, 'EYE_CLEANUP_01/eye-cleanup-01.json')))
pass01 = {}
for x in c1['figures']:
    fn = os.path.basename(x['out']); name = fn.replace('_NoEyes.glb', ''); fid = slug(name)
    rel = copy_into(fid, os.path.join(S16, 'EYE_CLEANUP_01/glb', fn)); pass01[name] = True
    add(fid, name, 'A', 'Large' if name in LARGE else 'Medium', rel, {'mode': 'anchored', 'source': 'EYE-CLEANUP-01 · Georg PASS 01.10.', 'skin': x['skin']}, 'PASS', GLBS.get(name), x['skin'])
# B · dx/dy (Georg 20.09.) for the Large without a CLEANUP-01 entry — original GLB at the reviewed revision
lr = json.load(open(os.path.join(RA1, 'data/eye-rig/rig-large-reviewed.v1.json')))
dxdy = {}
for p in lr['profiles']:
    name = os.path.basename(p['source']['path'])[:-4]
    if name in pass01: continue
    fid = slug(name); os.makedirs(os.path.join(OUT, fid), exist_ok=True)
    dst = os.path.join(OUT, fid, name + '.glb')
    with open(dst, 'wb') as fh: fh.write(subprocess.check_output(['git', '-C', CLONE, 'show', p['source']['revision'] + ':' + p['source']['path']]))
    dxdy[name] = True
    add(fid, name, 'B', 'Large', 'figures-b2/' + fid + '/' + name + '.glb', {'mode': 'dxdy', 'source': 'rig-large-reviewed.v1.json · Georg 20.09. (dx/dy, vorläufig)', 'profile': p['actorId']}, 'Georg 20.09. (vorläufig)', GLBS.get(name))
# C · EYE-CLEANUP-02 candidates
c2 = json.load(open(os.path.join(S16, 'EYE_CLEANUP_02/eye-cleanup-02.json')))
for x in c2['figures']:
    if x.get('status') != 'done': continue
    fn = os.path.basename(x['out']); name = fn.replace('_NoEyes.glb', '')
    if name in pass01 or name in dxdy: continue
    if name == 'ActionFigure_Head_B': SKIPPED.append({'name': name, 'why': 'Kopfteil (Wechselkopf der ActionFigure), keine Figur: 0,53 H, kein Kopfknochen'}); continue
    src = os.path.join(S16, 'EYE_CLEANUP_02/glb', fn)
    if not os.path.exists(src): print('missing', fn); continue
    fid = slug(name)
    if name.startswith('character_orc'):
        # unrigged legacy orcs: the NoEyes candidate has eye anchors but no head bone, so the EyeRig cannot be mounted
        # (anchored-eyes → faceHost „kein Kopfknochen“). Fallback: the original legacy file with its own eyes, marked.
        org = os.path.join(A3D, 'KayKit Legacy/Orc Warband - legacy/characters/gltf', name + '.gltf')
        add(fid, name, 'C', 'Legacy', copy_into(fid, org), {'mode': 'original', 'source': 'EYE-CLEANUP-02-Kandidat nicht montierbar (kein Kopfknochen) → Original-Augen'}, 'Kandidat · Original-Augen', None, None,
            {'note': 'unrigged (kein Skin): statisch'})
        continue
    rel = copy_into(fid, src)
    rig = 'Legacy' if name.startswith(('KayKit_AnimatedCharacter', 'character_orc')) else 'Large' if name in LARGE else 'Medium'
    add(fid, name, 'C', rig, rel, {'mode': 'anchored', 'source': 'EYE-CLEANUP-02 · Kandidat', 'skin': x['skin']}, 'Kandidat', GLBS.get(name), x['skin'],
        {'note': 'unrigged (no skin): static' if name.startswith('character_orc') else None})
# D · originals without a NoEyes version (their own eyes)
ORIG = ['OrcRaider', 'Paladin', 'Paladin_with_Helmet', 'Robot_One', 'Robot_Two', 'Driver', 'Monster', 'MonsterCostume', 'Werewolf_Man', 'Werewolf_Wolf', 'SpaceRanger', 'Survivalist', 'CombatMech', 'Superhero', 'Vampire', 'Helper_A', 'Helper_B', 'Tiefling', 'Marksman', 'MagicalGirl', 'Skeleton_Minion', 'Santa', 'Mannequin_Medium',
        'FrostGolem', 'Clanker', '4GTN', '4GTN_Forgotten', 'Mannequin_Large', 'Knight', 'Mage', 'Rogue', 'Rogue_Hooded', 'Barbarian', 'Ranger']
have = {e['label'] for e in cat}
for name in ORIG:
    if name in have: continue
    src = GLBS.get(name)
    if not src: print('not found', name); continue
    fid = slug(name); rel = copy_into(fid, src)
    extra = {}
    if name == 'OrcRaider': extra = {'bindTexture': True, 'note': 'GLB has images=[] and no baseColorTexture; the registry says dependencyStatus embedded (wrong). Texture bound at runtime.'}
    add(fid, name, 'D', 'Large' if name in LARGE else 'Medium', rel, {'mode': 'original', 'source': 'Original-Augen (keine NoEyes-Fassung)'}, 'Original-Augen', src, None, extra)
# E · FrizzleBob
for v in ('v3', 'v4', 'v5'):
    src = os.path.join(A3D, 'BLENDER MCP/FB_GRAFT', '_' + v, 'FB_TEMPLATE_LOOK_' + v + '.glb')
    if not os.path.exists(src): print('no FB', v); continue
    fid = 'frizzlebob_' + v; rel = copy_into(fid, src)
    add(fid, 'FrizzleBob ' + v, 'E', 'Medium', rel, {'mode': 'own', 'source': 'FB-Augen (FB_Eye_L/R im Modell)'}, 'v5-Ohr-Rig automatisch PASS, Look offen' if v == 'v5' else 'ohne Status', None)
os.makedirs(os.path.join(OUT, 'eye-profiles'), exist_ok=True)
shutil.copy2(os.path.join(RA1, 'data/eye-rig/rig-large-reviewed.v1.json'), os.path.join(OUT, 'eye-profiles'))
json.dump({'schema': 'kfb.figures-b2/1', 'rule': 'V-090 (Georg 11.10.): neuere Abnahme gilt — EYE-CLEANUP-01 anchored (Lid = Haut) vor dx/dy 20.09.; Large ohne neueren Eintrag dx/dy, markiert', 'figures': cat, 'skipped': SKIPPED}, open(os.path.join(OUT, 'catalog.json'), 'w'), indent=1, ensure_ascii=False)
from collections import Counter
print(len(cat), Counter(e['group'] for e in cat), Counter(e['rig'] for e in cat))
