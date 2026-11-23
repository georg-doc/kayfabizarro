#!/usr/bin/env python3
"""AD-Rückgabe einlesen (WS0-Seite; Standardbibliothek, Pillow bzw. macOS-sips für Bildformat und Ähnlichkeit).

  python3 ad_ingest.py scan   [--inbox DIR ...] [--state DATEI]
  python3 ad_ingest.py ingest <rueckgabe.json> --aus <ordner> [--paket <paket-ordner>] [--bilder DIR | --datei BILD ...]
                              [--paar <Ziel>=<Datei> ...] [--paarung-ok] [--erlaube-simuliert] [--state DATEI]

scan    neue kfb-ad-return_*.json (Standard: ~/Downloads und KFB_AD/eingang), je run/Familie/Lauf die neueste.
ingest  prüft Schema, Skript-Prüfsumme (tools/skill_versions.json), Paket (run_id, paket_rev, kanonischer sha256 = kein
        Drift; --paket fehlt → aus KFB_AD/pakete.json), holt die Bilder (bundle: eingebettet; einzeln: aus --bilder im
        Zeitfenster Chat-Beginn … Manifest, Paarung über Ähnlichkeit zum Quell-Still; github: --bilder = ausgecheckter
        rueckgabe-Ordner), führt sie aufs Originalformat zurück (aufgefüllten Rand entfernen, Originalgröße),
        prüft Änderung außerhalb des Befund-Bereichs, Baubarkeit, und schreibt nach <aus>/:
          _privat/ziele/<id>.png (+ __roh, __kern) und _privat/rueckgabe.json  (privat; veröffentlichen mit
             ad_package.py publish <aus>/_privat --run <run_id> --unter rueckgabe/<F>_l<n> --push)
          INGEST_BERICHT.md + ingest_bericht.json · briefs/BRIEF_<run>_<F>.md · vergleich/<F>.json
Exit 0 = ok (Klärungsfälle im Bericht), 2 = Rückgabe unbrauchbar.
"""
import base64, datetime, json, os, sys
sys.dont_write_bytecode = True   # kein __pycache__ im gespiegelten replies/-Ordner
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from ad_common import (HUB, KFB_AD, canon_hash, diff, dump, load_schema, normalize, outside_change, sha256, sha256_bytes,
                       thumb, validate)

HERE = os.path.dirname(os.path.abspath(__file__))
AESTE = {1: 'HUD und Interface', 2: '3D, Material, Licht', 3: 'Szenenkomposition und Welt', 4: 'Regie, Kamera, Belege',
         5: 'Cartoon-Animation, Mimik, Augen', 6: 'VFX, Treffer, Zerstörung', 7: 'Ton und Musik', 8: 'Text, Stimme, Dialog',
         9: 'Metanarrativ und Kanon', 10: 'Beschaffung', 11: 'Spielschleife, Kampf, Waffen'}
GATE_DOMAINS = {1: 'HUD', 2: 'Licht', 3: 'Welt', 4: 'Welt', 5: 'Figuren', 6: 'Kampf', 7: 'Audio', 8: 'Audio', 9: 'Spiel', 10: 'Spiel', 11: 'Kampf'}
FLAGS = ['echtzeit_threejs', 'ein_licht_rig', 'keine_glanzpunkte', 'kein_neuer_text', 'figuren_unveraendert',
         'komposition_gleich', 'seitenverhaeltnis_gleich']
AUSSEN_HINWEIS, AUSSEN_KLAEREN = 12, 25   # mittlere Abweichung außerhalb des Bereichs (0–255)


def arg(a, k, d=None):
    return a[a.index(k) + 1] if k in a else d


def args_all(a, k):
    return [a[i + 1] for i, x in enumerate(a) if x == k and i + 1 < len(a)]


def die(msgs):
    for m in (msgs if isinstance(msgs, list) else [msgs]):
        print('FEHLER:', m)
    sys.exit(2)


def state_load(p):
    return json.load(open(p)) if os.path.exists(p) else {'erledigt': {}}


def load_json(p):
    try:
        return json.load(open(p, encoding='utf-8'))
    except (OSError, ValueError) as e:
        die(f'{p}: nicht lesbar ({e.__class__.__name__}) – Download unvollständig? Datei neu laden lassen')


def scan(a):
    inboxes = args_all(a, '--inbox') or [os.path.expanduser('~/Downloads'), os.path.join(KFB_AD, 'eingang')]
    st = state_load(arg(a, '--state', os.path.join(KFB_AD, '.ingest_state.json')))
    neu = {}
    for d in inboxes:
        if not os.path.isdir(d):
            continue
        for fn in os.listdir(d):
            if not (fn.startswith('kfb-ad-return_') and fn.endswith('.json')):
                continue
            p = os.path.join(d, fn)
            if sha256(p) in st['erledigt']:
                continue
            try:
                r = json.load(open(p, encoding='utf-8')); key = (r['run_id'], r['familie'], r.get('lauf', 1))
            except Exception:
                print(f'UNLESBAR: {p}'); continue
            if key not in neu or os.path.getmtime(p) > os.path.getmtime(neu[key]):
                neu[key] = p
    for k, p in sorted(neu.items()):
        print(f'NEU: {k[0]} Familie {k[1]} Lauf {k[2]}: {p}')
    print(f'{len(neu)} neue Rückgabe(n)')


def link(pkg, rel):
    ab = pkg['ablage']
    return f'https://github.com/{ab["repo"]}/blob/{ab["branch"]}/{os.path.dirname(ab["pfad"])}/{rel}'


def paket_ordner(a, run, rev):
    if arg(a, '--paket'):
        return arg(a, '--paket')
    p = os.path.join(KFB_AD, 'pakete.json')
    reg = json.load(open(p, encoding='utf-8')) if os.path.exists(p) else {}
    if run not in reg or rev not in reg[run]:
        die(f'Paket {run} {rev} nicht in {p}: --paket angeben')
    return reg[run][rev]['paket']


def ingest(a):
    rp = a[1]; out = arg(a, '--aus')
    if not out:
        die('--aus angeben')
    ret = load_json(rp)
    errs = validate(ret, load_schema('kfb.ad-return.v1'))
    if errs:
        die(['Schema: ' + e for e in errs[:30]])
    known = json.load(open(os.path.join(HERE, 'skill_versions.json'), encoding='utf-8'))
    if ret['webchat']['skill_sha256'] not in known:
        die(f'Skript-Prüfsumme {ret["webchat"]["skill_sha256"][:12]} unbekannt: ad_return.py lief verändert oder in fremder Fassung')
    pdir = paket_ordner(a, ret['run_id'], ret['paket']['paket_rev'])
    pkg = load_json(os.path.join(pdir, 'package.json'))
    if ret['simuliert'] and '--erlaube-simuliert' not in a:
        die('Rückgabe ist SIMULIERT – nur mit --erlaube-simuliert (Probelauf), nie bauen')
    if ret['run_id'] != pkg['run_id'] or ret['paket']['paket_rev'] != pkg['paket_rev']:
        die(f'Rückgabe gehört zu {ret["run_id"]} {ret["paket"]["paket_rev"]}, Paket ist {pkg["run_id"]} {pkg["paket_rev"]}')
    if ret['paket']['sha256'] != canon_hash(pkg):
        die('package.json im Webchat ≠ lokales Paket (Drift): Paket-Revision prüfen')
    fam = ret['familie']
    szenen = {s['scene_id']: s for s in pkg['szenen'] if s['familie'] == fam}
    befund_pkg = {b['id']: (s, b) for s in szenen.values() for b in s['befunde']}
    ref_ids = {r['id']: r for r in pkg['referenzen']}
    probleme, klaeren = [], []
    for fid in befund_pkg:
        if fid not in {b['finding_id'] for b in ret['befunde']}:
            probleme.append(f'{fid}: im Paket, fehlt in der Rückgabe (verlorener Befund)')
    for b in ret['befunde']:
        if b['finding_id'] not in befund_pkg:
            probleme.append(f'{b["finding_id"]}: nicht in Familie {fam} des Pakets'); continue
        s, pb = befund_pkg[b['finding_id']]
        if b['scene_id'] != s['scene_id']:
            probleme.append(f'{b["finding_id"]}: scene_id {b["scene_id"]} ≠ Paket {s["scene_id"]}')
        if sorted(b['aeste']) != sorted(pb['aeste']):
            probleme.append(f'{b["finding_id"]}: Äste {b["aeste"]} ≠ Paket {pb["aeste"]}')
        for r in b['referenzen']:
            if r not in pb['referenzen']:
                probleme.append(f'{b["finding_id"]}: Referenz {r} gehört nicht zu diesem Befund')
        stills = {st['pfad']: st for st in s['stills']}
        for z in b['ziele']:
            if not z['target_id'].startswith(b['finding_id'] + '_' + z['rolle']):
                probleme.append(f'{z["target_id"]}: passt nicht zu {b["finding_id"]}/{z["rolle"]}')
            if z['quelle_still'] not in stills or stills[z['quelle_still']]['rolle'] != z['rolle']:
                probleme.append(f'{z["target_id"]}: Quell-Still {z["quelle_still"]} nicht im Paket oder falsche Rolle')
    if probleme:
        die(probleme)

    zdir = os.path.join(out, '_privat', 'ziele')
    os.makedirs(zdir, exist_ok=True)
    pass_z = [(b, z) for b in ret['befunde'] for z in b['ziele'] if z['freigabe']['status'] == 'PASS']
    src_of = {z['target_id']: next(st for st in befund_pkg[b['finding_id']][0]['stills'] if st['pfad'] == z['quelle_still']) for b, z in pass_z}
    weg = ret['check_in']['weg']
    roh = {}
    paarung, paarung_ok = [], True
    if weg == 'bundle':
        for b, z in pass_z:
            raw = base64.b64decode(ret.get('bilder_b64', {}).get(z['datei'] or '', '') or b'')
            if not raw:
                die(f'{z["target_id"]}: Bild fehlt im Bundle')
            roh[z['target_id']] = raw
    elif weg == 'github':
        bd = arg(a, '--bilder') or die('Weg github: --bilder <ausgecheckter rueckgabe-Ordner>')
        for b, z in pass_z:
            p = os.path.join(bd, z['datei'] or '')
            if not os.path.exists(p):
                die(f'{z["target_id"]}: {p} fehlt')
            roh[z['target_id']] = open(p, 'rb').read()
    elif pass_z:
        expl = args_all(a, '--datei')
        if expl:
            lose = expl
        else:
            bd = arg(a, '--bilder') or die('Weg einzeln: --bilder DIR (meist ~/Downloads) oder --datei <bild> je Bild')
            t0 = datetime.datetime.strptime(ret['webchat']['gestartet'], '%Y-%m-%dT%H:%M:%SZ').replace(tzinfo=datetime.timezone.utc).timestamp()
            t1 = max(os.path.getmtime(rp), t0) + 600
            lose = sorted([os.path.join(bd, f) for f in os.listdir(bd) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp'))
                           and t0 - 5 <= os.path.getmtime(os.path.join(bd, f)) <= t1], key=os.path.getmtime)
        if len(lose) < len(pass_z):
            die(f'Weg einzeln: {len(lose)} Bild(er) gefunden, {len(pass_z)} PASS erwartet – Bilder laden lassen oder --datei angeben')
        raws, gesehen, doppelt = [], set(), []
        for p in list(lose):
            r = open(p, 'rb').read(); h = sha256_bytes(r)
            if h in gesehen:
                doppelt.append(os.path.basename(p)); lose.remove(p); continue
            gesehen.add(h); raws.append(r)
        if doppelt:
            klaeren.append('Doppelt geladen (ignoriert): ' + ', '.join(doppelt))
        if len(raws) < len(pass_z):
            die(f'Weg einzeln: nur {len(raws)} verschiedene Bilder für {len(pass_z)} PASS')
        sim = {}
        for _, z in pass_z:
            st = src_of[z['target_id']]
            ref = thumb(os.path.join(pdir, st['pfad']))
            row = []
            for r in raws:
                n, _ = normalize(r, (st['breite'], st['hoehe']), st['edit'])
                row.append(diff(thumb(n), ref) if n and ref else None)
            sim[z['target_id']] = row
        fest = dict(x.split('=', 1) for x in args_all(a, '--paar'))
        frei = set(range(len(raws))); offen_z = [z for _, z in pass_z]
        for tid, fn in fest.items():
            idx = next((i for i, p in enumerate(lose) if os.path.basename(p) == os.path.basename(fn)), None)
            if idx is None or tid not in sim:
                die(f'--paar {tid}={fn}: Ziel oder Datei unbekannt')
            frei.discard(idx); roh[tid] = raws[idx]; paarung.append((tid, os.path.basename(lose[idx]), 'von WS0 gesetzt'))
            offen_z = [z for z in offen_z if z['target_id'] != tid]
        def ts(t):
            return datetime.datetime.strptime(t, '%Y-%m-%dT%H:%M:%SZ').replace(tzinfo=datetime.timezone.utc).timestamp()
        mt = [os.path.getmtime(p) for p in lose]
        zeit = {z['target_id']: ts(z['freigabe']['zeit']) for _, z in pass_z}
        quelle = {z['target_id']: z['quelle_still'] for _, z in pass_z}
        def erlaubt(tid, i):
            return bool(expl) or mt[i] >= zeit[tid] - 30   # Download beim PASS: frühere Dateien sind ältere Fassungen
        nah = {}
        for i in range(len(raws)):
            werte = [(sim[t][i], quelle[t]) for t in sim if sim[t][i] is not None]
            nah[i] = min(werte)[1] if werte else None
        while offen_z:
            paare = [(sim[z['target_id']][i], z['target_id'], i) for z in offen_z for i in frei
                     if sim[z['target_id']][i] is not None and erlaubt(z['target_id'], i)]
            if not paare:
                paarung_ok = False
                for z in offen_z:
                    paarung.append((z['target_id'], '–', 'keine Zuordnung möglich'))
                die('Weg einzeln: Bilder lassen sich nicht vergleichen (Pillow fehlt?) – mit --paar je Ziel zuordnen')
            v, tid, i = min(paare)
            andere = sorted(x for j, x in enumerate(sim[tid]) if j != i and x is not None)
            rivalen = [j for j in frei if j != i and nah[j] == quelle[tid] and erlaubt(tid, j)
                       and not any(quelle[t] == quelle[tid] and t != tid for t in (z['target_id'] for z in offen_z))]
            sicher = (not andere or v < 0.6 * andere[0]) and not rivalen
            paarung_ok = paarung_ok and sicher
            frei.discard(i); roh[tid] = raws[i]
            paarung.append((tid, os.path.basename(lose[i]), 'Ähnlichkeit eindeutig' if sicher else 'mehrdeutig – Blick, dann --paar'))
            offen_z = [z for z in offen_z if z['target_id'] != tid]
        if frei:
            klaeren.append('Nicht zugeordnete Bilder (ignoriert): ' + ', '.join(os.path.basename(lose[i]) for i in sorted(frei)))
        if '--paarung-ok' in a:
            paarung_ok = True
        if not paarung_ok:
            klaeren.append('Paarung nicht eindeutig: WS0 prüft per Blick, dann neu mit --paar <Ziel>=<Datei> bzw. --paarung-ok')

    aussen = {}
    for b, z in pass_z:
        tid = z['target_id']; raw = roh[tid]; st = src_of[tid]
        if z['sha256'] and sha256_bytes(raw) != z['sha256']:
            if weg == 'bundle':
                die(f'{tid}: sha256 weicht ab')
            klaeren.append(f'{tid}: Download nicht byte-gleich mit der Sandbox-Datei (Blick)')
        z['_sha'] = sha256_bytes(raw)
        n, how = normalize(raw, (st['breite'], st['hoehe']), st['edit'])
        ext = '.png' if raw[:4] == b'\x89PNG' else ('.webp' if raw[:4] == b'RIFF' else '.jpg')
        open(os.path.join(zdir, f'{tid}__roh{ext}'), 'wb').write(raw)
        if not n:
            klaeren.append(f'{tid}: Format passt weder zum Original noch zur aufgefüllten Fassung')
            z['_lokal'] = os.path.join('_privat', 'ziele', f'{tid}__roh{ext}'); z['_wh'] = None; continue
        if how == 'rand_veraendert':
            klaeren.append(f'{tid}: grauer Rand übermalt oder Ausschnitt verschoben – Rückführung unsicher, Blick')
        open(os.path.join(zdir, f'{tid}.png'), 'wb').write(n)
        z['_lokal'] = os.path.join('_privat', 'ziele', f'{tid}.png'); z['_wh'] = (st['breite'], st['hoehe']); z['_wie'] = how
        bereich = befund_pkg[b['finding_id']][1].get('bereich')
        wert, kern = outside_change(n, os.path.join(pdir, st['pfad']), bereich)
        if kern:
            open(os.path.join(zdir, f'{tid}__kern.png'), 'wb').write(kern); z['_kern'] = os.path.join('_privat', 'ziele', f'{tid}__kern.png')
        if wert is not None:
            aussen[tid] = wert
            if wert >= AUSSEN_KLAEREN:
                klaeren.append(f'{tid}: Änderung außerhalb des Befund-Bereichs {wert}/255 (Text, Figuren?)')

    os.makedirs(os.path.join(out, 'briefs'), exist_ok=True)
    os.makedirs(os.path.join(out, 'vergleich'), exist_ok=True)
    bericht = {'run_id': ret['run_id'], 'familie': fam, 'lauf': ret.get('lauf', 1), 'weg': weg, 'simuliert': ret['simuliert'],
               'paket_sha256': ret['paket']['sha256'], 'skill': ret['webchat']['skill_version'], 'befunde': [], 'klaeren': klaeren,
               'paarung': paarung, 'paarung_ok': paarung_ok, 'aussen_abweichung': aussen}
    for b in ret['befunde']:
        s, pb = befund_pkg[b['finding_id']]
        pz = [z for z in b['ziele'] if z['freigabe']['status'] == 'PASS']
        e = {'finding_id': b['finding_id'], 'scene_id': s['scene_id'], 'status_webchat': b['status'],
             'pass': [z['target_id'] for z in pz], 'ergebnis': None, 'gruende': [], 'versandbereit': False}
        if b['status'] != 'bearbeitet':
            e['ergebnis'] = 'kein_bild'; e['gruende'].append(b.get('grund') or b['status'])
            if b['status'] == 'uebersprungen' and (b.get('grund') or '').startswith('anderer Lauf'):
                e['ergebnis'] = 'anderer_lauf'
            elif b['status'] == 'uebersprungen':
                klaeren.append(f'{b["finding_id"]}: im Webchat ohne Zielbild zurück („{b.get("grund")}“) → Hub-Karte')
        elif not pz:
            e['ergebnis'] = 'kein_pass'
        else:
            bb = b['baubarkeit']; rot = [f for f in FLAGS if not bb[f]]
            if bb.get('hud_aus_kit') is False:
                rot.append('hud_aus_kit')
            if pb['art'] == 'bewegung' and {z['rolle'] for z in pz} < {'ausholung', 'aufprall'}:
                rot.append('bewegung_ohne_beide_extremposen')
            for z in pz:
                if any(k.startswith(z['target_id'] + ':') for k in klaeren):
                    rot.append(f'{z["target_id"]}: siehe Klären')
            if 'Georg-Vorgabe' in bb['hinweis']:
                rot.append('Georg-Vorgabe gegen Leitplanke')
            e['ergebnis'] = 'klaeren' if rot else 'bau'; e['gruende'] = rot
            if bb['neue_assets']:
                e['gruende'].append('neue Assets: ' + '; '.join(bb['neue_assets']))
            owner_ok = not any(x in pb['owner'] for x in ('+', ',', ' und ', '/'))
            if not owner_ok:
                e['gruende'].append(f'OWNER klären (genau einer): {pb["owner"]}')
            e['versandbereit'] = (e['ergebnis'] == 'bau' and owner_ok and not bb['neue_assets'] and not ret['simuliert'] and paarung_ok)
            if all(z.get('_wh') for z in pz):
                write_brief(out, pkg, s, pb, b, pz, ret, ref_ids, e)
                write_vergleich(out, pkg, s, pb, b, pz, e)
        bericht['befunde'].append(e)
    manifest = {k: v for k, v in ret.items() if k != 'bilder_b64'}
    manifest['befunde'] = [dict(bb, ziele=[dict({k: v for k, v in z.items() if not k.startswith('_')}, **({'sha256': z['_sha']} if z.get('_sha') else {}))
                                           for z in bb['ziele']]) for bb in ret['befunde']]
    dump(manifest, os.path.join(out, '_privat', 'rueckgabe.json'))
    dump(bericht, os.path.join(out, 'ingest_bericht.json'))
    write_bericht_md(out, bericht)
    stp = arg(a, '--state', os.path.join(KFB_AD, '.ingest_state.json'))
    st = state_load(stp); st['erledigt'][sha256(rp)] = {'datei': os.path.basename(rp), 'aus': os.path.abspath(out)}
    os.makedirs(os.path.dirname(os.path.abspath(stp)), exist_ok=True); dump(st, stp)
    print(f'OK: {sum(1 for e in bericht["befunde"] if e["ergebnis"] == "bau")} bau, '
          f'{sum(1 for e in bericht["befunde"] if e["ergebnis"] == "klaeren")} klären → {out}')


def write_brief(out, pkg, s, pb, b, pz, ret, ref_ids, e):
    c = s['clip']
    if c and not c.get('zeit_unsicher'):
        fenster = f'Fenster {c["t_start"]}–{c["t_end"]} s (Clip-Zeit)'
    else:
        fenster = 'Clip-Zeitfenster unbekannt (Ausnahme im Paket); Laufuhr-Ereignisse der Stills gelten'
    clip = f'{link(pkg, "paket/" + c["pfad"])} · {fenster}' if c else '–'
    refs = '; '.join('%s [%s] (%s)' % (ref_ids[r]['name'], ref_ids[r]['wirksamkeit'],
                                        ', '.join(link(pkg, 'paket/' + f) for f in ref_ids[r]['frames']) or 'ohne Frames') for r in b['referenzen'])
    owner = pb['owner'] if not any(g.startswith('OWNER klären') for g in e['gruende']) else f'KLÄREN – genau einer aus: {pb["owner"]}'
    dom = ','.join(sorted({GATE_DOMAINS[n] for n in b['aeste']} | {'Spiel'}))
    lines = [f'# Auftrag {pkg["run_id"]} · {b["finding_id"]} · {s["titel"]}' + (' · SIMULIERT – NICHT VERSENDEN' if ret['simuliert'] else ''), '',
             f'Stub aus AD-Rückgabe ({ret["webchat"]["skill"]} {ret["webchat"]["skill_version"]}, Lauf {ret.get("lauf", 1)}). '
             f'WS0 vor Versand: `python3 tools/brief_gate.py <dieser Brief> --domains {dom}` + Prüf-Agent. '
             f'Ergebnis: **{e["ergebnis"]}** · versandbereit: {"ja" if e["versandbereit"] else "nein"}' +
             (f' · offen: {"; ".join(e["gruende"])}' if e['gruende'] else ''), '', '```',
             f'ABSICHT  {pkg["absicht"]} Hier: {b["warum"]}',
             f'GENRE    {pkg["genre"]}',
             f'OWNER    {owner} · Branch/Modul: WS0 trägt ein',
             'ZIEL     Zielbild(er), von Georg im Webchat freigegeben (aufs Originalformat zurückgeführt):']
    rdir = 'rueckgabe/%s_l%s/ziele/' % (ret['familie'], ret.get('lauf', 1))
    for z in pz:
        fz = z['freigabe']
        lines.append(f'           {z["target_id"]}: {link(pkg, rdir + os.path.basename(z["_lokal"]))} · PASS {fz["zeit"]} „{fz.get("georg_wortlaut") or ""}“')
        st = next(x for x in s['stills'] if x['pfad'] == z['quelle_still'])
        lines.append(f'           Ausgang: {link(pkg, "paket/" + z["quelle_still"])} · Ereignis {st.get("ereignis") or "–"} · Clip-Zeit {st.get("t_clip_s") if st.get("t_clip_s") is not None else "unbekannt"}')
    lines += [f'         Clip: {clip}', f'         Referenzen: {refs}',
              f'FERTIG   Blind-Vergleich nach vergleich/{b["finding_id"]}.json (tools/ad_vergleich.py): jede Achse ≥ 7, Mittel ≥ 8, B ≥ 8;',
              '         Gates Stufe A/B grün; ≤ 5 stille Runden, Stopp nach 2 ohne Besserung (kleinster Blocker als Karte).',
              f'GRENZEN  Bleibt: {b["bleibt"]}',
              '         Figuren, Augen, Kanon und bestehende Texte unverändert; HUD-Positionen bleiben; nur dieses Modul.',
              f'DETAIL   Änderung: {b["aenderung"]}',
              f'         Befund {pb["id"]} (Achse {pb["achse"]}, {pb["schwere"]}, {pb["art"]}): {pb["text"]}',
              f'         Quelle: {pb["quelle"]["datei"]} #{pb["quelle"]["nr"]} · Build {pkg["build"]["version"]} · Szene {s["scene_id"]} ({s["modus_geraet"]})',
              f'         SOP: {" · ".join(pkg["sop"][k] for k in ("stamm", "aeste", "referenzen"))} · Äste: {" · ".join(f"{n} {AESTE[n]}" for n in b["aeste"])}',
              f'         Baubarkeit: {b["baubarkeit"]["hinweis"]}' + (f' · neue Assets: {"; ".join(b["baubarkeit"]["neue_assets"])}' if b['baubarkeit']['neue_assets'] else ''),
              '```', '']
    with open(os.path.join(out, 'briefs', f'BRIEF_{pkg["run_id"]}_{b["finding_id"]}.md'), 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))


def write_vergleich(out, pkg, s, pb, b, pz, e):
    c = s['clip']
    v = {'schema': 'kfb.ad-vergleich.v1', 'run_id': pkg['run_id'], 'finding_id': b['finding_id'], 'ergebnis_ingest': e['ergebnis'],
         'basis': ('KFB_HUB/' + os.path.relpath(os.path.abspath(out), HUB)) if os.path.abspath(out).startswith(HUB + os.sep) else os.path.basename(os.path.abspath(out)),
         'absicht': pkg['absicht'], 'genre': pkg['genre'],
         'ziel': {'bilder': [z.get('_kern') or z['_lokal'] for z in pz],
                  'kern': f'Geändert: {b["aenderung"]} Bleibt: {b["bleibt"]}',
                  'hinweis': 'Bilder relativ zu basis; __kern = Original außerhalb des Befund-Bereichs, Ziel innerhalb'},
         'erfassung_vorgabe': {'scene_id': s['scene_id'], 'modus_geraet': s['modus_geraet'], 'rollen': [z['rolle'] for z in pz],
                               'clip_fenster': {'t_start': c['t_start'], 't_end': c['t_end'], 'unsicher': c.get('zeit_unsicher')} if c else None,
                               'ereignisse': {z['rolle']: next((st.get('ereignis') for st in s['stills'] if st['pfad'] == z['quelle_still']), None) for z in pz},
                               'aufloesung': list(pz[0]['_wh']),
                               'regel': 'gleicher Lauf, gleiche Auflösung, gleiches Ereignis/Kamera-Preset wie das Ausgangs-Still; Bewegung als Video',
                               'ablage': f'{os.path.basename(os.path.abspath(out))}/_privat/vergleich_{b["finding_id"]}_r<n>/ (nie öffentlich; ad_vergleich prüft)'},
         'matrix': 'tools/qa_matrix.r1.json', 'prompt': 'tools/CRITIC_BLIND_PROMPT.md',
         'pass': {'min_axis': 7, 'min_mean': 8, 'min_B': 8}, 'max_runden': 5, 'stopp_ohne_besserung': 2,
         'nicht_mitgeben': ['Ausgangs-Still (kein Vergleich mit früheren Ständen)', 'Owner-Notizen', 'Webchat-Verlauf']}
    dump(v, os.path.join(out, 'vergleich', f'{b["finding_id"]}.json'))


def write_bericht_md(out, r):
    L = [f'# Ingest {r["run_id"]} · Familie {r["familie"]} · Lauf {r["lauf"]}' + (' · SIMULIERT' if r['simuliert'] else ''), '',
         f'Weg: {r["weg"]} · Skill {r["skill"]} · Paket-sha256: {r["paket_sha256"][:12]}…', '',
         '| Befund | Szene | PASS-Ziele | Ergebnis | Gründe / offen | versandbereit |', '|---|---|---|---|---|---|']
    for e in r['befunde']:
        L.append(f'| {e["finding_id"]} | {e["scene_id"]} | {", ".join(e["pass"]) or "–"} | {e["ergebnis"]} | {"; ".join(e["gruende"]) or "–"} | {"ja" if e["versandbereit"] else "nein"} |')
    if r['aussen_abweichung']:
        L += ['', 'Abweichung außerhalb des Befund-Bereichs (0–255; ab %d WS0-Blick, ab %d klären): ' % (AUSSEN_HINWEIS, AUSSEN_KLAEREN) +
              ', '.join(f'{k} {v}' for k, v in r['aussen_abweichung'].items())]
    if r['klaeren']:
        L += ['', '**Klären:**'] + [f'- {k}' for k in r['klaeren']]
    if r['paarung']:
        L += ['', f'**Paarung einzeln geladener Bilder ({"eindeutig" if r["paarung_ok"] else "WS0 prüft per Blick"}):**'] + \
             [f'- {t} ← {f} ({w})' for t, f, w in r['paarung']]
    with open(os.path.join(out, 'INGEST_BERICHT.md'), 'w', encoding='utf-8') as f:
        f.write('\n'.join(L) + '\n')


def main():
    a = sys.argv[1:]
    if not a:
        sys.exit(__doc__)
    if a[0] == 'scan':
        scan(a)
    elif a[0] == 'ingest' and len(a) > 1:
        ingest(a)
    else:
        sys.exit(__doc__)


if __name__ == '__main__':
    main()
