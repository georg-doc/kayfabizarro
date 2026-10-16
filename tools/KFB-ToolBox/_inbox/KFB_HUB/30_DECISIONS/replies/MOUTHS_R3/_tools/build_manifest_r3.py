#!/usr/bin/env python3
"""MOUTHS_R3: set.json per new set + mouth_sets.manifest.json (all ToolBox mouth sets) + repo staging tree.
usage: python3 build_manifest_r3.py [STAGE_ROOT]   (after cut_align_r3.py)
Adding a set later = append ONE entry to SETS_EXISTING / SETS_R3 (or directly to the manifest's "sets" array).
"""
import json, os, shutil, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REPO_CLONE = os.path.expanduser('~/Developer/kayfabizarro-publish')
R3_REPO_DIR = 'media/3D_Assets/Textures/KFB-Mouth-Sets_R3'
COMMIT = 'ea603d31d'
ALIEN_REF = 'assets/kfb-alien-figures-toolbox-2026-10-15'
ALIEN_DIR = 'media/3D_Assets/MeshyModels/alien_figures_toolbox_r1/mouths'

# common vocabulary (V-255 spec names). visemeMap: talk slot -> shape id of the set. emoteMap: face emote -> shape id.
VISEME_KEYS = ['rest', 'mbp', 'small_open', 'ah', 'ee', 'oh', 'oo', 'fv', 'l_th']
EMOTE_KEYS = ['neutral', 'happy', 'angry', 'sad', 'surprised', 'blink']


def decal_entry(sid, label, folder, files, emote, petv, gaps, note, fallback=None):
    vm = {'rest': 'neutral', 'mbp': 'm', 'small_open': 'd', 'ah': 'ah', 'ee': 'ee', 'oh': 'oh', 'oo': 'woo', 'fv': 'f', 'l_th': 'l'}
    vm_extra = {k: k for k in ('s', 'r', 'uh') if k in files}
    return dict(
        id=sid, label=label, format='decal13', ref='main', path=folder,
        canvas=[274, 169], anchors=None,
        shapes=[dict(id=k, file=v) for k, v in files.items()],
        defaults=dict(rest='neutral', fallback=fallback or 'neutral', loader='pet-mouth.v1.js MOUTH_SETS (same keys)'),
        visemeMap=vm, visemeMapExtra=vm_extra, petMouthVisemes=petv, emoteMap=emote,
        talkPool=[k for k in ['ah', 'ee', 'oh', 'uh', 'd', 's', 'l', 'r'] if k in files],
        tintable=False, tint=None, gaps=gaps,
        source=dict(repo='georg-doc/kayfabizarro', path=folder, note=note), status='in use (pet-mouth.v1)')


def git_files(ref, path):
    out = subprocess.run(['git', '-C', REPO_CLONE, 'ls-tree', '--name-only', f'{ref}:{path}'], capture_output=True, text=True).stdout.split()
    return out


def male_files():
    return {'smile': 'FrizzleBobMouth_01_0000s_0001s_0000_Smile.png', 'neutral': 'FrizzleBobMouth_01_0000s_0001s_0001_Neutral.png',
            'm': 'FrizzleBobMouth_01_0000s_0001s_0002_M.png', 'd': 'FrizzleBobMouth_01_0000s_0001s_0003_D.png',
            's': 'FrizzleBobMouth_01_0000s_0001s_0004_S.png', 'ee': 'FrizzleBobMouth_01_0000s_0001s_0005_Ee.png',
            'uh': 'FrizzleBobMouth_01_0000s_0001s_0006_Uh.png', 'ah': 'FrizzleBobMouth_01_0000s_0001s_0007_Ah.png',
            'oh': 'FrizzleBobMouth_01_0000s_0001s_0008_Oh.png', 'r': 'FrizzleBobMouth_01_0000s_0001s_0009_R.png',
            'f': 'FrizzleBobMouth_01_0000s_0001s_0010_F.png', 'woo': 'FrizzleBobMouth_01_0000s_0001s_0011_W-oo.png',
            'l': 'FrizzleBobMouth_01_0000s_0001s_0012_L.png'}


def female_files():
    return {'smile': 'FrizzleFemaleMouth_01_0000s_0000s_0000_Smile.png', 'neutral': 'FrizzleFemaleMouth_01_0000s_0000s_0001_Neutral.png',
            'm': 'FrizzleFemaleMouth_01_0000s_0000s_0002_M.png', 'd': 'FrizzleFemaleMouth_01_0000s_0000s_0003_D.png',
            's': 'FrizzleFemaleMouth_01_0000s_0000s_0004_S.png', 'ee': 'FrizzleFemaleMouth_01_0000s_0000s_0005_Ee.png',
            'uh': 'FrizzleFemaleMouth_01_0000s_0000s_0006_Uh.png', 'ah': 'FrizzleFemaleMouth_01_0000s_0000s_0007_Ah.png',
            'r': 'FrizzleFemaleMouth_01_0000s_0000s_0008_R.png', 'oh': 'FrizzleFemaleMouth_01_0000s_0000s_0009_Oh.png',
            'woo': 'FrizzleFemaleMouth_01_0000s_0000s_0010_W-oo.png', 'f': 'FrizzleFemaleMouth_01_0000s_0000s_0011_F.png',
            'l': 'FrizzleFemaleMouth_01_0000s_0000s_0012_L.png'}


def red_files():
    return {'neutral': 'FrizzleBob_RedLips_Mouth_01_0000s_0000s_0011_Neutral.png', 'm': 'FrizzleBob_RedLips_Mouth_01_0000s_0000s_0003_M.png',
            'd': 'FrizzleBob_RedLips_Mouth_01_0000s_0000s_0006_D.png', 's': 'FrizzleBob_RedLips_Mouth_01_0000s_0000s_0005_S.png',
            'ee': 'FrizzleBob_RedLips_Mouth_01_0000s_0000s_0004_Ee.png', 'uh': 'FrizzleBob_RedLips_Mouth_01_0000s_0000s_0010_Uh.png',
            'ah': 'FrizzleBob_RedLips_Mouth_01_0000s_0000s_0009_Aa.png', 'oh': 'FrizzleBob_RedLips_Mouth_01_0000s_0000s_0008_Oh.png',
            'r': 'FrizzleBob_RedLips_Mouth_01_0000s_0000s_0007_R.png', 'f': 'FrizzleBob_RedLips_Mouth_01_0000s_0000s_0002_F.png',
            'woo': 'FrizzleBob_RedLips_Mouth_01_0000s_0000s_0001_W-Oo.png', 'l': 'FrizzleBob_RedLips_Mouth_01_0000s_0000s_0000_L.png'}


PETV_DECAL = {'closed': 'm', 'open': 'ah', 'wide': 'ee', 'round': 'oh', 'smile': 'smile'}
EMOTE_DECAL = {'neutral': 'neutral', 'happy': 'smile', 'angry': 's', 'sad': 'm', 'surprised': 'oh', 'blink': 'neutral'}


def anchored_entry(sid, label, ref, path, anchors, vm, vm_extra, petv, emote, talk, tintable, tint, gaps, source, status, quality,
                   recommended):
    shapes = [dict(id=m['id'], file=m['file'], use_as=m['use_as'], variant_of=m['variant_of'],
                   **({'sheet_label': m['sheet_label']} if m.get('sheet_label') else {}))
              for m in anchors['mouths']]
    ids = {m['id'] for m in anchors['mouths']}
    for mp in (vm, vm_extra, petv, emote):
        for k, v in mp.items():
            assert v in ids, (sid, k, v)
    for t in talk: assert t in ids, (sid, t)
    return dict(
        id=sid, label=label, format='anchored_png', ref=ref, path=path,
        canvas=anchors['canvas'], anchors='anchors.json',
        anchor=dict(x=anchors['anchor']['x'], y=anchors['anchor']['y'], closed_upper_lip_top_y=anchors['anchor']['closed_upper_lip_top_y']),
        upperLift=anchors['upperLift']['value'],
        shapes=shapes,
        defaults=dict(rest=vm['rest'], fallback=vm['rest'], shadow='baked (X.png); noshadow/X.png without',
                      fullVariants='*_full = unsquashed original of a shape squashed to the height limit'),
        visemeMap=vm, visemeMapExtra=vm_extra, petMouthVisemes=petv, emoteMap=emote, talkPool=talk,
        tintable=tintable, tint=tint, gaps=gaps, source=source, status=status, quality=quality, recommended=recommended)


def r3_sets():
    out = []
    A = lambda sid: json.load(open(os.path.join(ROOT, sid, 'anchors.json')))
    out.append(anchored_entry(
        'clay_yellow_r3', 'Knete gelb (FrizzleBob-Viseme, 20)', 'main', f'{R3_REPO_DIR}/clay_yellow_r3', A('clay_yellow_r3'),
        vm={'rest': 'closed', 'mbp': 'mbp', 'small_open': 'd', 'ah': 'ah', 'ee': 'eh', 'oh': 'oh', 'oo': 'oo', 'fv': 'fv', 'l_th': 'th'},
        vm_extra={'l': 'l', 'd': 'd', 's': 's_z', 'ch': 'ch_j', 'r': 'r', 'clench': 'clench'},
        petv={'closed': 'mbp', 'open': 'ah', 'wide': 'eh', 'round': 'oh', 'smile': 'smile_teeth'},
        emote={'neutral': 'closed', 'happy': 'smile_teeth', 'angry': 'angry', 'sad': 'sad', 'surprised': 'surprised', 'blink': 'closed'},
        talk=['ah', 'eh', 'oh', 'd', 's_z', 'l', 'th', 'r', 'ch_j'],
        tintable=False,
        tint=dict(note='Lippen = FrizzleBob-Hautgelb, eingebacken. Auf FB verschmelzen die Lippen mit der Haut (gewollt: Knet-Mund aus derselben '
                       'Masse); Kontur kommt vom gebackenen Kontaktschatten. Umfärben wäre nur per Farbton-Maske auf den gesättigten Gelb-Pixeln möglich.'),
        gaps=['kein smile_closed (Lächeln geschlossen); happy nutzt smile_teeth', 'E-Form des Bogens ist offen (eh), kein breites EE; '
              's_z/clench decken EE/S'],
        source=dict(repo='georg-doc/kayfabizarro', path='media/3D_Assets/Textures/FrizzleBob-Mouths_PNGs/YELLOW_Clay-Mundvisemen für Lippen-Synchronisation.png',
                    commit=COMMIT, grid='5x4', background='weiss (freigestellt)'),
        status='WS0-Vorschlag, wartet auf Georg (Hub)', quality='gut: sauber freigestellt, keine Ränder, 20/20 geschnitten, keine Stauchung nötig',
        recommended=['FrizzleBob', 'gelbe Figuren']))
    out.append(anchored_entry(
        'clay_neutral_r3', 'Knete neutral (lippenlos, jede Hautfarbe, 16)', 'main', f'{R3_REPO_DIR}/clay_neutral_r3', A('clay_neutral_r3'),
        vm={'rest': 'closed', 'mbp': 'mbp', 'small_open': 'small_open', 'ah': 'ah', 'ee': 'ee', 'oh': 'oh', 'oo': 'oo', 'fv': 'fv', 'l_th': 'l_th'},
        vm_extra={'mid_open': 'mid_open'},
        petv={'closed': 'mbp', 'open': 'ah', 'wide': 'ee', 'round': 'oh', 'smile': 'smile_closed'},
        emote={'neutral': 'closed', 'happy': 'smile_closed', 'angry': 'grumpy', 'sad': 'sad', 'surprised': 'surprised', 'blink': 'closed'},
        talk=['small_open', 'mid_open', 'ah', 'ee', 'oh', 'l_th', 'fv'],
        tintable=True,
        tint=dict(channel='rim', mask='tintmask/<id>.png (grau 0..255, 255 = dunkelbrauner Mundrand)',
                  lipColour='keine (lippenlos)', skin='keine Hautpixel im PNG; die Figurenhaut liegt drum herum',
                  how='Rand per Maske mit einer abgedunkelten Hautfarbe multiplizieren (z. B. Haut × 0,35); Zähne/Rachen/Zunge bleiben.'),
        gaps=[],
        source=dict(repo='georg-doc/kayfabizarro', path='media/3D_Assets/Textures/FrizzleBob-Mouths_PNGs/NEUTRAL_Claymation-Mund-Sprite-Sheet in 4×4 Raster.png',
                    commit=COMMIT, grid='4x4 (V-255-Reihenfolge)', background='Alpha vorhanden'),
        status='WS0-Vorschlag, wartet auf Georg (Hub)',
        quality='sehr gut: einziger Bogen exakt nach V-255 (16 Slots), sauberer Alpha-Rand; ah/oh/surprised auf Gesichtsbudget gestaucht (+ _full)',
        recommended=['Lord Hunky', 'Lady Dory', 'alle Figuren mit eigener Hautfarbe']))
    out.append(anchored_entry(
        'monster_lila_r3', 'Monster lila (Reißzähne, 12)', 'main', f'{R3_REPO_DIR}/monster_lila_r3', A('monster_lila_r3'),
        vm={'rest': 'closed', 'mbp': 'mbp', 'small_open': 'small_open', 'ah': 'ah', 'ee': 'fangs_peek', 'oh': 'oh', 'oo': 'oo',
            'fv': 'fangs_peek', 'l_th': 'small_open'},
        vm_extra={'mid_open': 'mid_open', 'clench': 'grumpy'},
        petv={'closed': 'mbp', 'open': 'ah', 'wide': 'fangs_peek', 'round': 'oh', 'smile': 'smile_teeth'},
        emote={'neutral': 'closed', 'happy': 'smile_teeth', 'angry': 'snarl', 'sad': 'closed', 'surprised': 'oh', 'blink': 'closed'},
        talk=['small_open', 'mid_open', 'ah', 'oh', 'fangs_peek', 'oo'],
        tintable=False, tint=dict(note='Lippen lila eingebacken (Monster-Look); kein Umfärben vorgesehen.'),
        gaps=['kein F/V (fangs_peek als Ersatz)', 'kein L/TH (small_open als Ersatz)', 'kein sad (closed + Mundwinkel-bend −)'],
        source=dict(repo='georg-doc/kayfabizarro', path='media/3D_Assets/Textures/FrizzleBob-Mouths_PNGs/Lila Monster-Mundausdrücke als Animationsvorlage.png',
                    commit=COMMIT, grid='4x3', background='weiss (freigestellt)'),
        status='WS0-Vorschlag, wartet auf Georg (Hub)', quality='gut: sauber freigestellt, ah/oh leicht gestaucht (+ _full); Visem-Lücken F/V, L/TH, sad',
        recommended=['Monster', 'Kreaturen', 'Bösewichte']))
    return out


def gpt_sets():
    out = []
    for d, vm, vm_extra, petv, emote, talk, gaps, label, quality in [
        ('A', {'rest': 'closed', 'mbp': 'mbp', 'small_open': 'small_open', 'ah': 'ah', 'ee': 'ee_wide', 'oh': 'oh', 'oo': 'oo',
               'fv': 'teeth_small', 'l_th': 'th_tongue'}, {'teeth': 'teeth_small'},
         {'closed': 'mbp', 'open': 'ah', 'wide': 'ee_wide', 'round': 'oh', 'smile': 'smile_closed'},
         {'neutral': 'closed', 'happy': 'smile_closed', 'angry': 'teeth_small', 'sad': 'closed', 'surprised': 'surprised_tall', 'blink': 'closed'},
         ['small_open', 'ah', 'ee_wide', 'oh', 'oo', 'teeth_small', 'th_tongue'],
         ['kein echtes F/V (teeth_small als Ersatz)', 'th_tongue ist eher EH/AE', 'kein sad/angry (closed bzw. teeth_small + bend)'],
         'GPT A (runde Lippen, 12)', 'PASS-Vorlage aus R2 (V-259 Typ A/B)'),
        ('B', {'rest': 'closed', 'mbp': 'closed', 'small_open': 'small_open', 'ah': 'ah', 'ee': 'grit', 'oh': 'oh', 'oo': 'oh',
               'fv': 'grimace', 'l_th': 'small_open'}, {'laugh': 'laugh'},
         {'closed': 'closed', 'open': 'ah', 'wide': 'grit', 'round': 'oh', 'smile': 'smile_closed'},
         {'neutral': 'closed', 'happy': 'smile_closed', 'angry': 'grit', 'sad': 'grimace', 'surprised': 'oh', 'blink': 'closed'},
         ['small_open', 'ah', 'oh', 'grit'],
         ['kein eigenes MBP/OO/FV/LTH (Ersatzformen)', 'Spaßformen scream/tongue_out nur als Reaktion'],
         'GPT B (Zahnlücke, expressiv, 12)', 'PASS (V-259 Typ B)')]:
        an = json.load(open(os.path.join(os.path.dirname(ROOT), 'MOUTHS_GPT_R2', d, 'anchors.json')))
        on_branch = set(git_files(f'origin/{ALIEN_REF}', f'{ALIEN_DIR}/{d}') or git_files(f'gh/{ALIEN_REF}', f'{ALIEN_DIR}/{d}'))
        missing = [m['file'] for m in an['mouths'] if on_branch and m['file'] not in on_branch]
        assert not missing, (d, missing)
        out.append(anchored_entry(
            f'gpt_{d.lower()}_r2', label, ALIEN_REF, f'{ALIEN_DIR}/{d}', an, vm, vm_extra, petv, emote, talk, False,
            dict(note='Lippenfarbe eingebacken'), gaps,
            dict(repo='georg-doc/kayfabizarro', path=an['source'], hub='replies/MOUTHS_GPT_R2/' + d,
                 note='liegt bisher nur auf dem Alien-Figuren-Branch; nach Merge ref -> main'),
            'im Einsatz (Alien-Figuren R1)', quality, ['Lord Hunky', 'Lady Dory'] if d == 'A' else ['FrizzleBob', 'Comedy-Figuren']))
    return out


def existing_decals():
    return [
        decal_entry('fb_male_decal_01', 'FrizzleBob Mund 01 (Decal)', 'media/3D_Assets/Textures/FrizzelBob-Mouth_01', male_files(),
                    EMOTE_DECAL, PETV_DECAL, ['kein sad/surprised als eigene Form (m / oh + bend)'], 'pet-mouth.v1 set "male" (Ordner heisst FrizzelBob, Tippfehler im Repo)'),
        decal_entry('fb_female_decal_01', 'FrizzleBob Mund weiblich 01 (Decal)', 'media/3D_Assets/Textures/FrizzleBob-FemaleMouth_01', female_files(),
                    EMOTE_DECAL, PETV_DECAL, ['wie male'], 'pet-mouth.v1 set "female" (Index R/Oh vertauscht, Mapping nach Schlüssel)'),
        decal_entry('fb_red_decal_01', 'FrizzleBob rote Lippen 01 (Decal)', 'media/3D_Assets/Textures/FrizzleBob-RedMouth_01', red_files(),
                    dict(EMOTE_DECAL, happy='neutral'), dict(PETV_DECAL, smile='neutral'),
                    ['kein smile (12 statt 13): happy/smile -> neutral, Lächeln über bend +0.35'],
                    'pet-mouth.v1 set "red" (Aa statt Ah, W-Oo)', fallback='neutral'),
    ]


def main():
    stage = sys.argv[1] if len(sys.argv) > 1 else None
    r3 = r3_sets()
    for e in r3:   # per-set manifest entry next to its PNGs
        json.dump(e, open(os.path.join(ROOT, e['id'], 'set.json'), 'w'), indent=1, ensure_ascii=False)
    man = dict(
        schema='kfb.mouth_sets.manifest/1', created='2026-10-16', owner='WS0 (Daten) -> WSA ToolBox (Mund-Dropdown)',
        rawTemplate='https://raw.githubusercontent.com/georg-doc/kayfabizarro/{ref}/{path}/{file}',
        howToAdd='Neues Set = EIN Eintrag in "sets" anhängen: id, label, format, ref, path, shapes, visemeMap, emoteMap, tintable, source. '
                 'anchored_png braucht zusätzlich anchors.json im Ordner (Schema MOUTHS_GPT_R2/A/anchors.json).',
        formats=dict(
            decal13='Character-Animator-PNG 274x169, keine Anker; Platzierung macht pet-mouth.v1 (size/dy/sx). Schlüssel smile, neutral, m, d, s, ee, uh, ah, oh, r, f, woo, l.',
            anchored_png='512x512, Anker (256,220) = Lippenlinie von closed; offene Formen mit upperLift 0.35 gebacken (V-259); '
                         'Höhe <= 1.7x closed bzw. Gesichtsbudget; X.png mit Kontaktschatten, noshadow/X.png ohne; Details in anchors.json.'),
        vocabulary=dict(visemeMap=VISEME_KEYS, emoteMap=EMOTE_KEYS,
                        petMouthVisemes=['closed', 'open', 'wide', 'round', 'smile'],
                        note='visemeMapExtra = zusätzliche Sprechformen, falls das Set sie hat; gaps = ehrliche Lücken mit Ersatzform'),
        defaultSet='fb_male_decal_01',
        sets=existing_decals() + gpt_sets() + r3)
    for e in man['sets']:
        for k in EMOTE_KEYS: assert k in e['emoteMap'], (e['id'], k)
        for k in VISEME_KEYS: assert k in e['visemeMap'], (e['id'], k)
        ids = {s['id'] for s in e['shapes']}
        for mp in ('visemeMap', 'emoteMap', 'petMouthVisemes'):
            for v in e[mp].values(): assert v in ids, (e['id'], mp, v)
    p = os.path.join(ROOT, 'mouth_sets.manifest.json')
    json.dump(man, open(p, 'w'), indent=1, ensure_ascii=False)
    print('manifest', p, len(man['sets']), 'sets')
    if stage:
        dst = os.path.join(stage, R3_REPO_DIR)
        os.makedirs(dst, exist_ok=True)
        shutil.copy2(p, os.path.join(dst, 'mouth_sets.manifest.json'))
        for e in r3:
            shutil.copytree(os.path.join(ROOT, e['id']), os.path.join(dst, e['id']), dirs_exist_ok=True)
        shutil.copy2(os.path.join(ROOT, 'README.md'), os.path.join(dst, 'README.md')) if os.path.exists(os.path.join(ROOT, 'README.md')) else None
        print('staged', dst)


if __name__ == '__main__':
    main()
