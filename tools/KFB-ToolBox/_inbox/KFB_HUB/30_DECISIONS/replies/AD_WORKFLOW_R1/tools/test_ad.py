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
        r, b = self.ing()
        self.assertFalse(b['paarung_ok'])
        self.assertFalse(any(e['versandbereit'] for e in b['befunde']))


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
