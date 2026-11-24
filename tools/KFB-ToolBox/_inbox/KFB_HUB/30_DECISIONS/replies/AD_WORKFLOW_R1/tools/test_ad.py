#!/usr/bin/env python3
"""Tests für ad_common/ad_package/ad_ingest/ad_vergleich/ad_return (stdlib unittest; Pillow für Bildproben).
Braucht den Probelauf (test_r1/LAUF.md): Paket test_r1/_privat/paket und Rückgabe in test_r1/_privat/webchat_D.
  python3 -W ignore tools/test_ad.py
"""
import base64, glob, hashlib, json, os, re, shutil, subprocess, sys, tempfile, unittest
T = os.path.dirname(os.path.abspath(__file__)); R = os.path.dirname(T)
sys.dont_write_bytecode = True
sys.path.insert(0, T)
from ad_common import (DEC, canon_hash, image_size, load_schema, mp4_duration, normalize, pad_geometry, ratio_ok,
                       referenz_tabelle, sop_versions, validate)

PKG = os.path.join(R, 'test_r1', '_privat', 'paket')
RET = sorted(glob.glob(os.path.join(R, 'test_r1', '_privat', 'webchat_D', 'kfb-ad-return_*.json')))[-1]
SKILL = os.path.join(R, 'chatgpt-skill', 'kfb-art-direction')
S = os.path.join(SKILL, 'scripts', 'ad_return.py')
STILL = os.path.join(PKG, 'media', 'stills', 'S02_startbild__trouble_desktop__still.png')


def run(*a, env=None):
    return subprocess.run([sys.executable, *a], capture_output=True, text=True, env=env)


class Common(unittest.TestCase):
    def test_validator(self):
        s = {'type': 'object', 'required': ['a'], 'additionalProperties': False,
             'properties': {'a': {'type': 'string', 'pattern': '^F[0-9]{2}$'}, 'b': {'type': ['integer', 'null'], 'minimum': 1}}}
        self.assertEqual(validate({'a': 'F01', 'b': None}, s), [])
        for bad in ({'a': 'X1'}, {'a': 'F01', 'c': 1}, {'a': 'F01', 'b': 0}, {'b': 2}):
            self.assertTrue(validate(bad, s))

    def test_media(self):
        self.assertEqual(image_size(STILL), (1280, 720))
        self.assertAlmostEqual(mp4_duration(os.path.join(PKG, 'media', 'clips', 'S16_hai_angriff__trouble_desktop.mp4')), 10.8, delta=0.3)
        self.assertTrue(ratio_ok((1920, 1080), (1280, 720)))
        self.assertFalse(ratio_ok((1000, 1000), (1280, 720)))

    def test_pad_and_back(self):
        g = pad_geometry(1280, 720)
        self.assertEqual((g['breite'], g['hoehe'], g['oben'] + g['unten']), (1280, 853, 133))
        self.assertIsNone(pad_geometry(1024, 1024))
        from PIL import Image
        import io
        im = Image.open(STILL); c = Image.new('RGB', (1280, 853), (128, 128, 128)); c.paste(im, (0, g['oben']))
        b = io.BytesIO(); c.resize((1536, 1024)).save(b, 'PNG')
        n, how = normalize(b.getvalue(), (1280, 720), g)
        self.assertEqual((how, image_size_from(n)), ('rand_entfernt', (1280, 720)))
        b2 = io.BytesIO(); Image.new('RGB', (900, 900)).save(b2, 'PNG')
        self.assertEqual(normalize(b2.getvalue(), (1280, 720), g), (None, None))

    def test_leitplanke_matches_sop(self):
        v = sop_versions()
        lp = open(os.path.join(SKILL, 'references', 'LEITPLANKEN.md'), encoding='utf-8').readline()
        for k in ('stamm', 'aeste', 'referenzen'):
            self.assertIn(v[k], lp, 'SOP hat hochgezählt: LEITPLANKEN.md nachziehen (reist mit jedem Paket)')
        self.assertIn('Claybound', referenz_tabelle())

    def test_schema_copies_equal(self):
        a = open(os.path.join(R, 'schema', 'kfb.ad-return.v1.json'), 'rb').read()
        self.assertEqual(a, open(os.path.join(SKILL, 'references', 'kfb.ad-return.v1.json'), 'rb').read())
        import importlib.util
        sp = importlib.util.spec_from_file_location('ad_return', S); m = importlib.util.module_from_spec(sp); sp.loader.exec_module(m)
        self.assertEqual(json.loads(m.SCHEMA_EINGEBETTET), json.loads(a), 'eingebettetes Schema in ad_return.py nachziehen')

    def test_skill_hash_registered_and_in_package(self):
        h = hashlib.sha256(open(S, 'rb').read()).hexdigest()
        self.assertIn(h, json.load(open(os.path.join(T, 'skill_versions.json'))), 'neue ad_return.py: tools/skill_versions.json ergänzen')
        with open(os.path.join(PKG, 'package.json')) as f:
            self.assertEqual(json.load(f)['werkzeug']['sha256'], h, 'Probe-Paket mit altem Skript: bash test_r1/lauf.sh')


def image_size_from(b):
    from ad_common import image_size_bytes
    return image_size_bytes(b[:1 << 18])


class Package(unittest.TestCase):
    def setUp(self):
        self.d = tempfile.mkdtemp(); self.p = os.path.join(self.d, 'paket'); shutil.copytree(PKG, self.p)
        self.pj = os.path.join(self.p, 'package.json')
        with open(self.pj) as f:
            self.pkg = json.load(f)
        self.env = dict(os.environ, KFB_AD_DIR=os.path.join(self.d, 'kfb_ad'))

    def tearDown(self):
        shutil.rmtree(self.d)

    def save(self):
        with open(self.pj, 'w') as f:
            json.dump(self.pkg, f, ensure_ascii=False)

    def val(self):
        return run(os.path.join(T, 'ad_package.py'), 'validate', self.p, env=self.env)

    def test_valid(self):
        self.assertEqual(self.val().returncode, 0)

    def test_behoben_rejected(self):
        self.pkg['szenen'][0]['befunde'][0]['stand'] = 'behoben r40'; self.save()
        self.assertIn('behoben', self.val().stdout)

    def test_motion_needs_clip_and_time(self):
        s = next(x for x in self.pkg['szenen'] if x['scene_id'] == 'S16_hai_angriff')
        self.pkg['ausnahmen'] = []; self.save()
        self.assertIn('Zeitfenster unbekannt', self.val().stdout)
        s['clip'] = None; self.save()
        self.assertIn('Bewegungsbefund braucht Clip', self.val().stdout)

    def test_refs_need_frames(self):
        for r in self.pkg['referenzen']:
            r['frames'] = []
        self.save()
        self.assertIn('keine Referenz mit Frames', self.val().stdout)

    def test_media_tamper(self):
        with open(os.path.join(self.p, 'media', 'edit', 'S02_startbild__trouble_desktop__still__edit.png'), 'ab') as f:
            f.write(b'x')
        self.assertIn('sha256 weicht ab', self.val().stdout)

    def test_build_guards(self):
        a = os.path.join(self.d, 'a.json')
        with open(os.path.join(R, 'test_r1', 'auswahl_r1.json')) as f:
            sp = json.load(f)
        sp['erfassung_wurzel'] = os.path.join(DEC, 'replies', 'AQUA_10', 'erfassung_r1')
        with open(a, 'w') as f:
            json.dump(sp, f)
        self.assertIn('öffentlich gespiegelt', run(os.path.join(T, 'ad_package.py'), 'build', a, os.path.join(self.d, '_privat', 'p'), env=self.env).stdout)
        sp['erfassung_wurzel'] = os.path.join(R, 'test_r1', '_privat_quelle', 'erfassung_r1'); sp['szenen'][0]['stills'][0]['sha256'] = '0' * 64
        with open(a, 'w') as f:
            json.dump(sp, f)
        self.assertIn('weicht von der angesehenen Fassung ab', run(os.path.join(T, 'ad_package.py'), 'build', a, os.path.join(self.d, '_privat', 'p'), '--erlaube-zeit-unsicher', env=self.env).stdout)

    def test_publish_probe_only_own_paths(self):
        r = run(os.path.join(T, 'ad_package.py'), 'publish', self.p, env=self.env)
        self.assertEqual(r.returncode, 0, r.stdout); self.assertIn('PROBE', r.stdout)
        r = run(os.path.join(T, 'ad_package.py'), 'publish', self.p, '--run', 'aqua10-ad-test-r1', '--unter', '../x', env=self.env)
        self.assertEqual(r.returncode, 2)


class Ingest(unittest.TestCase):
    def setUp(self):
        self.d = tempfile.mkdtemp()
        with open(RET) as f:
            self.ret = json.load(f)
        self.rp = os.path.join(self.d, 'r.json'); self.st = os.path.join(self.d, 'state.json')

    def tearDown(self):
        shutil.rmtree(self.d)

    def ing(self, extra=('--erlaube-simuliert',)):
        with open(self.rp, 'w') as f:
            json.dump(self.ret, f)
        return run(os.path.join(T, 'ad_ingest.py'), 'ingest', self.rp, '--paket', PKG, '--aus', os.path.join(self.d, 'aus'), '--state', self.st, *extra)

    def bericht(self):
        with open(os.path.join(self.d, 'aus', 'ingest_bericht.json')) as f:
            return {e['finding_id']: e for e in json.load(f)['befunde']}

    def test_ok_and_normalized(self):
        r = self.ing(); self.assertEqual(r.returncode, 0, r.stdout)
        self.assertEqual(image_size(os.path.join(self.d, 'aus', '_privat', 'ziele', 'F03_aufprall_v2.png')), (1280, 720))
        self.assertTrue(os.path.exists(os.path.join(self.d, 'aus', 'vergleich', 'F03.json')))

    def test_simulated_blocked(self):
        self.assertIn('SIMULIERT', self.ing(extra=()).stdout)

    def test_drift(self):
        self.ret['paket']['sha256'] = '0' * 64
        self.assertIn('Drift', self.ing().stdout)

    def test_unknown_script(self):
        self.ret['webchat']['skill_sha256'] = '1' * 64
        self.assertIn('Skript-Prüfsumme', self.ing().stdout)

    def test_lost_finding(self):
        self.ret['befunde'] = [b for b in self.ret['befunde'] if b['finding_id'] != 'F04']
        self.assertIn('verlorener Befund', self.ing().stdout)

    def test_aeste_and_refs_fixed(self):
        self.ret['befunde'][0]['aeste'] = [1]
        self.assertIn('Äste', self.ing().stdout)

    def test_bundle_tamper(self):
        k = next(iter(self.ret['bilder_b64'])); self.ret['bilder_b64'][k] = base64.b64encode(b'\x89PNG\r\n\x1a\n' + b'0' * 40).decode()
        self.assertIn('sha256 weicht ab', self.ing().stdout)

    def test_truncated_download(self):
        with open(self.rp, 'w') as f:
            f.write('{"schema": "kfb.ad-ret')
        r = run(os.path.join(T, 'ad_ingest.py'), 'ingest', self.rp, '--paket', PKG, '--aus', os.path.join(self.d, 'aus'), '--state', self.st)
        self.assertEqual(r.returncode, 2); self.assertIn('nicht lesbar', r.stdout)

    def test_unbuildable_goes_to_klaeren(self):
        self.ret['befunde'][1]['baubarkeit']['kein_neuer_text'] = False
        self.assertEqual(self.ing().returncode, 0)
        self.assertEqual(self.bericht()['F04']['ergebnis'], 'klaeren')

    def test_bildtreue_fremdes_bild_verworfen(self):
        b4 = next(b for b in self.ret['befunde'] if b['finding_id'] == 'F04')
        z = next(z for z in b4['ziele'] if z['freigabe']['status'] == 'PASS')
        raw = open(os.path.join(PKG, 'media', 'stills', 'S02_startbild__trouble_desktop__still.png'), 'rb').read()
        self.ret['bilder_b64'][z['datei']] = base64.b64encode(raw).decode(); z['sha256'] = hashlib.sha256(raw).hexdigest()
        r = self.ing(); self.assertEqual(r.returncode, 0, r.stdout)
        e = self.bericht()['F04']
        self.assertEqual(e['ergebnis'], 'verworfen'); self.assertIn('Bild verändert außerhalb des Bereichs', e['gruende'][0])
        with open(os.path.join(self.d, 'aus', 'ingest_bericht.json')) as f:
            self.assertFalse(any('F04' in k for k in json.load(f)['klaeren']), 'verworfen geht nicht als Klärung zu Georg')
        self.assertFalse(os.path.exists(os.path.join(self.d, 'aus', 'briefs', 'BRIEF_aqua10-ad-test-r1_F04.md')))
        self.assertEqual(self.bericht()['F03']['ergebnis'], 'bau')

    def test_motion_needs_both_poses(self):
        for z in self.ret['befunde'][0]['ziele']:
            if z['rolle'] == 'aufprall':
                z['freigabe']['status'] = 'FAIL'
        self.ing()
        self.assertEqual(self.bericht()['F03']['ergebnis'], 'klaeren')


class Einzeln(unittest.TestCase):
    """Weg einzeln: ältere Fassung vor dem PASS geladen → ignoriert; zweite Fassung nach dem PASS → mehrdeutig, nie still falsch."""
    def setUp(self):
        self.d = tempfile.mkdtemp()
        self.ret = sorted(glob.glob(os.path.join(R, 'test_r1', '_privat', 'webchat_A', 'kfb-ad-return_*.json')))[-1]
        src = os.path.join(R, 'test_r1', '_privat', 'downloads_A')
        self.dl = os.path.join(self.d, 'dl'); shutil.copytree(src, self.dl)

    def tearDown(self):
        shutil.rmtree(self.d)

    def ing(self):
        rp = os.path.join(self.dl, os.path.basename(self.ret))
        r = run(os.path.join(T, 'ad_ingest.py'), 'ingest', rp, '--paket', PKG, '--aus', os.path.join(self.d, 'aus'),
                '--bilder', self.dl, '--erlaube-simuliert', '--state', os.path.join(self.d, 's.json'))
        with open(os.path.join(self.d, 'aus', 'ingest_bericht.json')) as f:
            return r, json.load(f)

    def variante(self, mtime):
        from PIL import Image
        im = Image.open(os.path.join(self.dl, 'ChatGPT Image 2.png')).convert('RGB')
        im.putpixel((5, 500), (255, 0, 0)); p = os.path.join(self.dl, 'ChatGPT Image alt.png'); im.save(p)
        os.utime(p, (mtime, mtime))

    def test_old_version_before_pass_ignored(self):
        with open(self.ret) as f:
            ret = json.load(f)
        z = [z for b in ret['befunde'] for z in b['ziele'] if z['target_id'] == 'F01_still_v1'][0]
        import datetime
        t = datetime.datetime.strptime(z['freigabe']['zeit'], '%Y-%m-%dT%H:%M:%SZ').replace(tzinfo=datetime.timezone.utc).timestamp()
        self.variante(t - 120)
        r, b = self.ing()
        self.assertTrue(b['paarung_ok'], r.stdout)

    def test_second_version_after_pass_is_ambiguous(self):
        import time
        self.variante(time.time())
        os.utime(os.path.join(self.dl, os.path.basename(self.ret)))   # Rückgabe „gerade geladen“: Test hängt nicht mehr am Alter des Probelaufs
        r, b = self.ing()
        self.assertFalse(b['paarung_ok'])
        self.assertFalse(any(e['versandbereit'] for e in b['befunde']))


def auswahl_kopie(d, aendern=None):
    """Probe-Auswahl in einen Temp-Ordner (Erfassung absolut), optional geändert; gibt den Pfad zurück."""
    with open(os.path.join(R, 'test_r1', 'auswahl_r1.json')) as f:
        sp = json.load(f)
    sp['erfassung_wurzel'] = os.path.join(R, 'test_r1', '_privat_quelle', 'erfassung_r1')
    if aendern:
        aendern(sp)
    p = os.path.join(d, 'auswahl.json')
    with open(p, 'w') as f:
        json.dump(sp, f, ensure_ascii=False)
    return p


def befund(sp, fid):
    return next(b for s in sp['szenen'] for b in s['befunde'] if b['id'] == fid)


class Sortierung(unittest.TestCase):
    """R3: Weg-Pflichtfeld, nur ad im Malpaket, Dedupe zu Designentscheidungen."""
    def setUp(self):
        self.d = tempfile.mkdtemp(); self.env = dict(os.environ, KFB_AD_DIR=os.path.join(self.d, 'kfb_ad'))

    def tearDown(self):
        shutil.rmtree(self.d)

    def build(self, aendern):
        return run(os.path.join(T, 'ad_package.py'), 'build', auswahl_kopie(self.d, aendern), os.path.join(self.d, '_privat', 'p'),
                   '--erlaube-zeit-unsicher', env=self.env)

    def test_weg_pflicht(self):
        def ohne(sp):
            befund(sp, 'F02').pop('weg'); befund(sp, 'F03')['grund'] = ''
        r = self.build(ohne)
        self.assertEqual(r.returncode, 2); self.assertIn('F02: Pflichtfeld weg', r.stdout); self.assertIn('F03: Pflichtfeld grund', r.stdout)
        r = self.build(lambda sp: befund(sp, 'F01').pop('bereich'))
        self.assertIn('F01: ad-Befund ohne bereich', r.stdout)

    def test_nur_ad_im_malpaket(self):
        def sortiert(sp):
            befund(sp, 'F04').update(weg='code', grund='Monitor verschieben ist Platzierung im Code.')
            befund(sp, 'F02').update(weg='kit', grund='Kit-Rahmen gibt es schon, nur einsetzen.')
        r = self.build(sortiert); self.assertEqual(r.returncode, 0, r.stdout)
        p = os.path.join(self.d, '_privat', 'p')
        with open(os.path.join(p, 'package.json')) as f:
            pkg = json.load(f)
        ids = {b['id'] for s in pkg['szenen'] for b in s['befunde']}
        self.assertEqual(ids, {'F01', 'F03'})
        self.assertNotIn('S05_figurenblatt', [s['scene_id'] for s in pkg['szenen']])
        with open(os.path.join(p, 'paket_bericht.json')) as f:
            ber = json.load(f)
        direkt = {x['id']: g['weg'] for g in ber['auftraege_direkt'] for x in g['befunde']}
        self.assertEqual(direkt, {'F02': 'kit', 'F04': 'code'})
        self.assertEqual(ber['wege'], {'code': 1, 'kit': 1, 'ad': 2})
        for s in pkg['szenen']:
            for b in s['befunde']:
                self.assertTrue(b['masken'] and all(os.path.exists(os.path.join(p, m)) for m in b['masken'].values()))
        self.assertTrue(os.path.exists(os.path.join(p, 'CODEX_AUFTRAG.md')) and os.path.exists(os.path.join(p, 'ad_bildtreue.py')))
        self.assertEqual(run(os.path.join(T, 'ad_package.py'), 'validate', p, env=self.env).returncode, 0)

    def test_dedupe(self):
        import importlib
        ap = importlib.import_module('ad_package')
        with open(auswahl_kopie(self.d)) as f:
            sp = json.load(f)
        befund(sp, 'F01')['element'] = 'Figurenblatt'; befund(sp, 'F02')['element'] = 'figurenblatt'
        g, err = ap.dedupe(sp)
        self.assertEqual(err, []); self.assertIn(['F01', 'F02'], [x['befunde'] for x in g]); self.assertEqual(len(g), 3)
        befund(sp, 'F02')['weg'] = 'kit'
        self.assertIn('gemischter Weg', ap.dedupe(sp)[1][0])
        # gleiche Szene auf zweitem Gerät (protokoll_nr gleich), Bereich überlappt → eine Entscheidung
        sp2 = json.loads(json.dumps(sp)); s16 = next(s for s in sp2['szenen'] if s['scene_id'] == 'S16_hai_angriff')
        handy = json.loads(json.dumps(s16)); handy['scene_id'] = 'S16_hai_angriff_handy'; handy['lauf'] = 'trouble_handy'
        handy['befunde'] = [dict(befund(sp2, 'F03'), id='F09', bereich={'x': 0.32, 'y': 0.2, 'w': 0.5, 'h': 0.65})]
        sp2['szenen'].append(handy)
        self.assertIn(['F03', 'F09'], [x['befunde'] for x in ap.dedupe(sp2)[0]])
        handy['befunde'][0]['bereich'] = {'x': 0.0, 'y': 0.0, 'w': 0.1, 'h': 0.1}
        self.assertNotIn(['F03', 'F09'], [x['befunde'] for x in ap.dedupe(sp2)[0]])

    def test_dedupe_cli_schreibt_nichts(self):
        a = auswahl_kopie(self.d); vorher = open(a, 'rb').read()
        r = run(os.path.join(T, 'ad_package.py'), 'dedupe', a, env=self.env)
        self.assertEqual(r.returncode, 0, r.stdout); self.assertIn('ad 4', r.stdout); self.assertEqual(open(a, 'rb').read(), vorher)


class Bildtreue(unittest.TestCase):
    ORIG = os.path.join(PKG, 'media', 'stills', 'S16_hai_angriff__trouble_desktop__aufprall.png')
    BEREICH = '0.3,0.18,0.55,0.68'

    def setUp(self):
        self.d = tempfile.mkdtemp(); self.p = os.path.join(self.d, '_privat'); os.makedirs(self.p)

    def tearDown(self):
        shutil.rmtree(self.d)

    def bt(self, ziel, *extra):
        r = run(os.path.join(T, 'ad_bildtreue.py'), ziel, self.ORIG, '--bereich', self.BEREICH, *extra)
        return r.returncode, (json.loads(r.stdout) if r.stdout.strip().startswith('{') else r.stdout)

    def test_innen_geaendert_ist_pass(self):
        from PIL import Image, ImageDraw
        im = Image.open(self.ORIG).convert('RGB'); ImageDraw.Draw(im).ellipse([480, 200, 900, 560], fill=(255, 40, 40))
        z = os.path.join(self.p, 'innen.png'); im.save(z)
        code, res = self.bt(z, '--heatmap', os.path.join(self.p, 'hm.png'))
        self.assertEqual((code, res['status'], res['format']['wie']), (0, 'PASS', 'gleich'))
        self.assertTrue(os.path.exists(os.path.join(self.p, 'hm.png')))
        if not shutil.which('tesseract'):
            self.assertEqual(res['ocr']['status'], 'übersprungen')

    def test_modellformat_mit_rand_ist_pass(self):
        from PIL import Image
        g = pad_geometry(1280, 720); im = Image.open(self.ORIG).convert('RGB')
        c = Image.new('RGB', (g['breite'], g['hoehe']), (128, 128, 128)); c.paste(im, (0, g['oben']))
        z = os.path.join(self.p, 'modell.png'); c.resize((1536, 1024)).save(z)
        code, res = self.bt(z, '--rand-geo', json.dumps(g))
        self.assertEqual((code, res['format']['wie']), (0, 'rand_entfernt'))

    def test_fremdes_bild_und_fremdes_menue_fail(self):
        code, res = self.bt(os.path.join(PKG, 'media', 'stills', 'S02_startbild__trouble_desktop__still.png'))
        self.assertEqual((code, res['status']), (3, 'FAIL'))
        from PIL import Image, ImageDraw
        im = Image.open(self.ORIG).convert('RGB'); ImageDraw.Draw(im).rectangle([20, 20, 300, 200], fill=(30, 200, 220))
        z = os.path.join(self.p, 'menue.png'); im.save(z)
        code, res = self.bt(z)
        self.assertEqual(code, 3); self.assertIn('Kachel', res['gruende'][0])
        b = os.path.join(self.p, 'quadrat.png'); Image.new('RGB', (900, 900)).save(b)
        self.assertEqual(self.bt(b)[0], 3)

    def test_heatmap_nur_privat(self):
        code, res = self.bt(self.ORIG, '--heatmap', os.path.join(self.d, 'oeffentlich.png'))
        self.assertEqual(code, 2); self.assertIn('_privat', res['grund'])


class CodexWeg(unittest.TestCase):
    """Codex startet mit Skript + Leitplanke aus upload/<F>, malt, prüft Bildtreue übers Paket; WS0-Vorprüfung sortiert."""
    def setUp(self):
        self.d = tempfile.mkdtemp(); self.w = os.path.join(self.d, 'rueckgabe', 'D_l1')

    def tearDown(self):
        shutil.rmtree(self.d)

    def test_codex_fluss(self):
        from PIL import Image, ImageDraw
        u = os.path.join(PKG, 'upload', 'D'); sc = os.path.join(u, 'ad_return.py')
        with open(os.path.join(PKG, 'package.json')) as f:
            h = canon_hash(json.load(f))[:12]
        r = run(sc, 'start', '--paket', os.path.join(u, 'package.json'), '--familie', 'D', '--erwarte', h, '--modell', 'codex probe', '--arbeit', self.w)
        self.assertEqual(r.returncode, 0, r.stdout)
        ziele = {}
        for rolle, farbe in (('ausholung', None), ('aufprall', None)):
            im = Image.open(os.path.join(u, f'S16_hai_angriff__trouble_desktop__{rolle}__edit.png')).convert('RGB').resize((1536, 1024))
            if rolle == 'ausholung':
                ImageDraw.Draw(im).ellipse([700, 380, 950, 620], fill=(250, 250, 255))       # im Bereich
            else:
                ImageDraw.Draw(im).rectangle([20, 160, 330, 330], fill=(0, 90, 110))         # erfundenes Menü außerhalb
            ziele[rolle] = os.path.join(self.d, f'F03_{rolle}_v1.png'); im.save(ziele[rolle])
        codes = {k: run(os.path.join(PKG, 'ad_bildtreue.py'), v, '--paket', os.path.join(u, 'package.json'), '--befund', 'F03',
                        '--rolle', k, '--ohne-ocr').returncode for k, v in ziele.items()}
        self.assertEqual(codes, {'ausholung': 0, 'aufprall': 3})
        for k, v in ziele.items():
            self.assertEqual(run(sc, 'ziel', '--finding', 'F03', '--rolle', k, '--bild', v, '--arbeit', self.w).returncode, 0)
        aus = os.path.join(self.d, 'vp')
        r = run(os.path.join(T, 'ad_ingest.py'), 'vorpruefung', self.w, '--paket', PKG, '--aus', aus)
        self.assertEqual(r.returncode, 0, r.stdout)
        with open(os.path.join(aus, 'vorpruefung.json')) as f:
            st = {x['target_id']: x['status'] for x in json.load(f)['ziele']}
        self.assertEqual((st['F03_ausholung_v1'], st['F03_aufprall_v1']), ('PASS', 'FAIL'))


class Vergleich(unittest.TestCase):
    def setUp(self):
        self.d = tempfile.mkdtemp()
        self.v = os.path.join(self.d, 'F03.json')
        with open(self.v, 'w') as f:
            json.dump({'pass': {'min_axis': 7, 'min_mean': 8, 'min_B': 8}, 'max_runden': 5, 'stopp_ohne_besserung': 2}, f)

    def tearDown(self):
        shutil.rmtree(self.d)

    def runde(self, scores, gates=True):
        p = os.path.join(self.d, 'k.json')
        with open(p, 'w') as f:
            json.dump({'verdict': 'x', 'scores': scores, 'findings': [{'axis': k, 'file': 'f.png'} for k in scores]}, f)
        return run(os.path.join(T, 'ad_vergleich.py'), 'runde', self.v, p, '--erfassung', self.d, *(['--gates-gruen'] if gates else [])).returncode

    def test_rounds(self):
        low = {k: 6 for k in 'ABCDEFGH'}
        self.assertEqual(self.runde(low), 1)
        self.assertEqual(self.runde(low), 1)
        self.assertEqual(self.runde(low), 3)            # 2 Runden ohne Besserung → STOPP
        self.assertEqual(self.runde(low), 2)            # beendet

    def test_pass_needs_B(self):
        s = {k: 9 for k in 'ABCDEFGH'}; s['B'] = 7; s['G'] = 'n/a'
        self.assertEqual(self.runde(s), 1)
        s['B'] = 8
        self.assertEqual(self.runde(s, gates=False), 1)   # ohne bestätigte Gates kein PASS
        self.assertEqual(self.runde(s), 0)


class WebchatScript(unittest.TestCase):
    def setUp(self):
        self.d = tempfile.mkdtemp()

    def tearDown(self):
        shutil.rmtree(self.d)

    UA = os.path.join(PKG, 'upload', 'A')

    def st(self, *extra, paket=None):
        return run(S, 'start', '--paket', paket or os.path.join(self.UA, 'package.json'),
                   '--arbeit', os.path.join(self.d, 'w'), *extra)

    def test_unknown_family(self):
        self.assertIn('nicht im Paket', self.st('--familie', 'C').stdout)

    def test_wrong_hash(self):
        self.assertIn('Prüfsumme', self.st('--familie', 'A', '--erwarte', 'abc').stdout)

    def test_wrong_folder_for_family(self):
        self.assertIn('Upload passt nicht', self.st('--familie', 'D').stdout)

    def test_foreign_script_rejected(self):
        u = os.path.join(self.d, 'u'); shutil.copytree(self.UA, u); shutil.copy2(S, os.path.join(u, 'ad_return.py'))
        with open(os.path.join(u, 'ad_return.py'), 'a') as f:
            f.write('\n# verändert\n')
        r = run(os.path.join(u, 'ad_return.py'), 'start', '--paket', os.path.join(u, 'package.json'), '--familie', 'A', '--arbeit', os.path.join(self.d, 'w'))
        self.assertIn('gehört nicht zum Paket', r.stdout)

    def test_reformatted_package_same_hash(self):
        with open(os.path.join(self.UA, 'package.json')) as f:
            pkg = json.load(f)
        u = os.path.join(self.d, 'u'); shutil.copytree(self.UA, u)
        with open(os.path.join(u, 'package.json'), 'w') as f:
            json.dump(pkg, f, indent=4)
        r = run(S, 'start', '--paket', os.path.join(u, 'package.json'), '--familie', 'A',
                '--erwarte', canon_hash(pkg)[:12], '--arbeit', os.path.join(self.d, 'w'))
        self.assertEqual(r.returncode, 0, r.stdout)

    def test_unchanged_target_rejected_and_verwerfen(self):
        self.assertEqual(self.st('--familie', 'A').returncode, 0)
        w = ['--arbeit', os.path.join(self.d, 'w')]
        sc = S
        r = run(sc, 'ziel', '--finding', 'F01', '--rolle', 'still', '--bild', os.path.join(self.UA, 'S02_startbild__trouble_desktop__still__edit.png'), *w)
        self.assertIn('unverändert', r.stdout)
        self.assertIn('Entwurf', self.st('--familie', 'A').stdout)
        run(sc, 'verwerfen', '--finding', 'F01', '--grund', 'Bildmodell verweigert', *w)
        self.assertNotIn('F01', run(sc, 'status', *w).stdout.split('ZUSTAND')[0])


if __name__ == '__main__':
    unittest.main(verbosity=1)
