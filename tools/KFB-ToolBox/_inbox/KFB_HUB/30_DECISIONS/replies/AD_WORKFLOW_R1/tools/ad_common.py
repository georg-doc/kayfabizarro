#!/usr/bin/env python3
"""Gemeinsame Helfer für ad_package.py und ad_ingest.py (nur Standardbibliothek).
- validate(obj, schema): kleiner JSON-Schema-Prüfer (type, required, properties, additionalProperties,
  enum, const, pattern, minLength, items, minItems, maxItems, minimum, maximum, $ref auf #/$defs).
- image_size(path): Breite/Höhe aus PNG, JPEG, WebP.
- mp4_duration(path): Dauer in s aus dem mvhd-Atom (None, wenn nicht lesbar).
- sha256(path).
"""
import hashlib, json, os, re, struct

HERE = os.path.dirname(os.path.abspath(__file__))
SCHEMA_DIR = os.path.join(os.path.dirname(HERE), 'schema')
TYPES = {'object': dict, 'array': list, 'string': str, 'boolean': bool, 'null': type(None)}


def load_schema(name):
    with open(os.path.join(SCHEMA_DIR, name + '.json'), encoding='utf-8') as f:
        return json.load(f)


def _is(v, t):
    if t == 'integer':
        return isinstance(v, int) and not isinstance(v, bool)
    if t == 'number':
        return isinstance(v, (int, float)) and not isinstance(v, bool)
    return isinstance(v, TYPES[t])


def validate(obj, schema, root=None, path='$'):
    """Gibt eine Liste von Fehlertexten zurück (leer = gültig)."""
    root = root or schema
    if '$ref' in schema:
        ref = schema['$ref'].split('/')[-1]
        return validate(obj, root['$defs'][ref], root, path)
    err = []
    t = schema.get('type')
    if t:
        ts = t if isinstance(t, list) else [t]
        if not any(_is(obj, x) for x in ts):
            return [f'{path}: Typ {type(obj).__name__}, erwartet {t}']
    if 'const' in schema and obj != schema['const']:
        err.append(f'{path}: muss {schema["const"]!r} sein')
    if 'enum' in schema and obj not in schema['enum']:
        err.append(f'{path}: {obj!r} nicht in {schema["enum"]}')
    if isinstance(obj, str):
        if len(obj) < schema.get('minLength', 0):
            err.append(f'{path}: zu kurz')
        if 'pattern' in schema and not re.search(schema['pattern'], obj):
            err.append(f'{path}: {obj!r} passt nicht zu {schema["pattern"]}')
    if _is(obj, 'number'):
        if 'minimum' in schema and obj < schema['minimum']:
            err.append(f'{path}: {obj} < {schema["minimum"]}')
        if 'maximum' in schema and obj > schema['maximum']:
            err.append(f'{path}: {obj} > {schema["maximum"]}')
    if isinstance(obj, list):
        if len(obj) < schema.get('minItems', 0):
            err.append(f'{path}: mindestens {schema["minItems"]} Einträge')
        if 'maxItems' in schema and len(obj) > schema['maxItems']:
            err.append(f'{path}: höchstens {schema["maxItems"]} Einträge')
        if 'items' in schema:
            for i, v in enumerate(obj):
                err += validate(v, schema['items'], root, f'{path}[{i}]')
    if isinstance(obj, dict):
        for k in schema.get('required', []):
            if k not in obj:
                err.append(f'{path}: Pflichtfeld {k} fehlt')
        props = schema.get('properties', {})
        addl = schema.get('additionalProperties', True)
        for k, v in obj.items():
            if k in props:
                err += validate(v, props[k], root, f'{path}.{k}')
            elif addl is False:
                err.append(f'{path}: unbekanntes Feld {k}')
            elif isinstance(addl, dict):
                err += validate(v, addl, root, f'{path}.{k}')
    return err


def sha256(path):
    h = hashlib.sha256()
    with open(path, 'rb') as f:
        for b in iter(lambda: f.read(1 << 20), b''):
            h.update(b)
    return h.hexdigest()


def canon_hash(obj):
    """sha256 der kanonischen JSON-Form (sortierte Schlüssel, kompakt) – gleich wie ad_return.py."""
    return hashlib.sha256(json.dumps(obj, sort_keys=True, ensure_ascii=False, separators=(',', ':')).encode('utf-8')).hexdigest()


def sha256_bytes(data):
    return hashlib.sha256(data).hexdigest()


def image_size_bytes(d):
    if d[:8] == b'\x89PNG\r\n\x1a\n':
        return struct.unpack('>II', d[16:24])
    if d[:4] == b'RIFF' and d[8:12] == b'WEBP':
        c = d[12:16]
        if c == b'VP8 ':
            w, h = struct.unpack('<HH', d[26:30]); return w & 0x3fff, h & 0x3fff
        if c == b'VP8L':
            b = int.from_bytes(d[21:25], 'little'); return (b & 0x3fff) + 1, ((b >> 14) & 0x3fff) + 1
        if c == b'VP8X':
            return int.from_bytes(d[24:27], 'little') + 1, int.from_bytes(d[27:30], 'little') + 1
    if d[:2] == b'\xff\xd8':
        i = 2
        while i < len(d) - 9:
            if d[i] != 0xFF:
                i += 1; continue
            m = d[i + 1]
            if m in (0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6, 0xC7, 0xC9, 0xCA, 0xCB, 0xCD, 0xCE, 0xCF):
                h, w = struct.unpack('>HH', d[i + 5:i + 9]); return w, h
            i += 2 + struct.unpack('>H', d[i + 2:i + 4])[0]
    return None


def image_size(path):
    with open(path, 'rb') as f:
        head = f.read(1 << 18)
    return image_size_bytes(head)


def mp4_duration(path):
    """Dauer aus moov/mvhd; liest nur die Atom-Köpfe."""
    try:
        with open(path, 'rb') as f:
            size = os.path.getsize(path)
            def walk(start, end):
                pos = start
                while pos + 8 <= end:
                    f.seek(pos)
                    n, typ = struct.unpack('>I4s', f.read(8)); hdr = 8
                    if n == 1:
                        n = struct.unpack('>Q', f.read(8))[0]; hdr = 16
                    elif n == 0:
                        n = end - pos
                    if n < hdr:
                        return None
                    if typ == b'moov':
                        r = walk(pos + hdr, pos + n)
                        if r is not None:
                            return r
                    if typ == b'mvhd':
                        v = f.read(1)[0]; f.read(3)
                        if v == 1:
                            f.read(16); ts, du = struct.unpack('>IQ', f.read(12))
                        else:
                            f.read(8); ts, du = struct.unpack('>II', f.read(8))
                        return round(du / ts, 3) if ts else None
                    pos += n
                return None
            return walk(0, size)
    except (OSError, struct.error, IndexError):
        return None


def ratio_ok(a, b, tol=0.01):
    """Seitenverhältnis gleich (Stamm §4 B: ≤ 1 %)."""
    if not a or not b:
        return False
    ra, rb = a[0] / a[1], b[0] / b[1]
    return abs(ra - rb) / rb <= tol


def dump(obj, path):
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(obj, f, ensure_ascii=False, indent=2)
        f.write('\n')


# ---- Bildformat für das Bildmodell (Auffüllen) und Rückführung ----
EDIT_RATIOS = (1.5, 1.0, 2 / 3)   # Ausgabeformate der Bildmodelle (1536×1024, 1024×1024, 1024×1536)
PAD_COLOR = (128, 128, 128)


def _pil():
    try:
        from PIL import Image
        return Image
    except ImportError:
        return None


def pad_geometry(w, h):
    """Rand, der ein w×h-Bild ohne Skalieren auf das nächste Modellformat bringt (oder None)."""
    r = w / h
    target = min(EDIT_RATIOS, key=lambda x: abs(x - r))
    if abs(target - r) / target <= 0.01:
        return None
    if r > target:   # zu breit → oben/unten auffüllen
        H = round(w / target); d = H - h
        return {'breite': w, 'hoehe': H, 'oben': d // 2, 'unten': d - d // 2, 'links': 0, 'rechts': 0}
    W = round(h * target); d = W - w
    return {'breite': W, 'hoehe': h, 'oben': 0, 'unten': 0, 'links': d // 2, 'rechts': d - d // 2}


def pad_image(src, dst, g):
    Image = _pil()
    if Image:
        im = Image.open(src).convert('RGB'); c = Image.new('RGB', (g['breite'], g['hoehe']), PAD_COLOR)
        c.paste(im, (g['links'], g['oben'])); c.save(dst); return
    import subprocess
    r = subprocess.run(['sips', '--padToHeightWidth', str(g['hoehe']), str(g['breite']), '--padColor', '808080', src, '--out', dst],
                       capture_output=True, text=True)
    if r.returncode:
        raise RuntimeError('sips: ' + r.stderr)


def normalize(raw, orig_wh, g):
    """Zielbild aufs Originalformat zurückführen: Rand (falls im Modellformat) proportional entfernen, auf Originalgröße skalieren.
    Gibt (png_bytes, wie) zurück; wie = 'original' | 'rand_entfernt' | None (Format passt zu nichts)."""
    import io
    Image = _pil()
    wh = image_size_bytes(raw[:1 << 18])
    if not wh:
        return None, None
    if ratio_ok(wh, orig_wh):
        how, box = 'original', None
    elif g and ratio_ok(wh, (g['breite'], g['hoehe'])):
        sx, sy = wh[0] / g['breite'], wh[1] / g['hoehe']
        box = (round(g['links'] * sx), round(g['oben'] * sy), wh[0] - round(g['rechts'] * sx), wh[1] - round(g['unten'] * sy))
        how = 'rand_entfernt'
    else:
        return None, None
    if Image:
        im = Image.open(io.BytesIO(raw)).convert('RGB')
        if box and not band_grau(im, box):
            how = 'rand_veraendert'
        if box:
            im = im.crop(box)
        if im.size != tuple(orig_wh):
            im = im.resize(tuple(orig_wh), Image.LANCZOS)
        b = io.BytesIO(); im.save(b, 'PNG'); return b.getvalue(), how
    import subprocess, tempfile
    d = tempfile.mkdtemp(); p = os.path.join(d, 'x'); open(p, 'wb').write(raw); q = os.path.join(d, 'y.png')
    cmds = []
    if box:
        cmds.append(['sips', '--cropToHeightWidth', str(box[3] - box[1]), str(box[2] - box[0]), p, '--out', p])
    cmds.append(['sips', '-s', 'format', 'png', '-z', str(orig_wh[1]), str(orig_wh[0]), p, '--out', q])
    for c in cmds:
        if subprocess.run(c, capture_output=True).returncode:
            return None, None
    return open(q, 'rb').read(), how


def band_grau(im, box):
    """Ist der aufgefüllte Rand (außerhalb box) noch flach grau? (Bildmodelle übermalen ihn manchmal.)"""
    W, H = im.size
    teile = [(0, 0, W, box[1]), (0, box[3], W, H), (0, 0, box[0], H), (box[2], 0, W, H)]
    px = []
    for t in teile:
        if t[2] - t[0] > 2 and t[3] - t[1] > 2:
            px += list(im.crop((t[0] + 1, t[1] + 1, t[2] - 1, t[3] - 1)).convert('L').resize((32, 4)).getdata())
    if not px:
        return True
    m = sum(px) / len(px)
    return abs(m - 128) < 20 and max(abs(x - m) for x in px) < 40


def thumb(raw_or_path, size=(48, 27)):
    """Graustufen-Miniatur als Liste (für Ähnlichkeit); None ohne Pillow."""
    import io
    Image = _pil()
    if not Image:
        return None
    im = Image.open(io.BytesIO(raw_or_path) if isinstance(raw_or_path, bytes) else raw_or_path).convert('L').resize(size)
    return list(im.getdata())


def diff(a, b):
    return sum(abs(x - y) for x, y in zip(a, b)) / len(a) if a and b else None


def outside_change(raw_target, path_orig, bereich):
    """Mittlere Abweichung außerhalb des Befund-Bereichs (0–255) und Kern-Komposit (Original außen, Ziel innen)."""
    import io
    Image = _pil()
    if not Image or not bereich:
        return None, None
    t = Image.open(io.BytesIO(raw_target)).convert('RGB'); o = Image.open(path_orig).convert('RGB').resize(t.size)
    W, H = t.size
    box = (int(bereich['x'] * W), int(bereich['y'] * H), int((bereich['x'] + bereich['w']) * W), int((bereich['y'] + bereich['h']) * H))
    mask = Image.new('L', t.size, 0); mask.paste(255, box)
    tg, og = t.convert('L').resize((64, 36)), o.convert('L').resize((64, 36)); mk = mask.resize((64, 36))
    vals = [abs(a - b) for a, b, m in zip(tg.getdata(), og.getdata(), mk.getdata()) if m < 128]
    comp = Image.composite(t, o, mask); buf = io.BytesIO(); comp.save(buf, 'PNG')
    return (round(sum(vals) / len(vals), 1) if vals else 0.0), buf.getvalue()


# ---- Hub-Bezüge: SOP-Versionen, Referenz-Tabelle, KFB_AD ----
HUB = os.path.expanduser(os.environ.get('KFB_HUB_DIR', '~/Dropbox/CLAUDE/KFB_HUB'))
KFB_AD = os.path.expanduser(os.environ.get('KFB_AD_DIR', '~/Dropbox/CLAUDE/KFB_AD'))
DEC = os.path.join(HUB, '30_DECISIONS')


def sop_versions():
    """Liest die Versionen aus den Kopfzeilen der SOP-Dateien (Stamm 'Version R2', Äste 'Äste R1', Referenzen 'Referenzen R1')."""
    out = {}
    for key, fn, pat in (('stamm', 'KFB_SOP_R1.md', r'Version (R[0-9.]+)'), ('aeste', 'KFB_SOP_AESTE_R1.md', r'Äste (R[0-9.]+)'),
                         ('referenzen', 'KFB_REFERENZEN_R1.md', r'Referenzen (R[0-9.]+)')):
        with open(os.path.join(DEC, fn), encoding='utf-8') as f:
            m = re.search(pat, f.readline())
        out[key] = f'{fn}@{m.group(1) if m else "?"}'
    out['matrix'] = 'tools/qa_matrix.r1.json'
    return out


def sop_kurz(sop):
    return ' · '.join(f'{k} {v.split("@")[-1]}' for k, v in sop.items() if k != 'matrix')


def referenz_tabelle():
    """Zeilen aus KFB_REFERENZEN_R1.md: Name → {aeste, nimm, nicht, frames, wirksamkeit}."""
    rows = {}
    with open(os.path.join(DEC, 'KFB_REFERENZEN_R1.md'), encoding='utf-8') as f:
        for ln in f:
            m = re.match(r'^\| \*\*(.+?)\*\*[^|]*\|([^|]*)\|([^|]*)\|([^|]*)\|([^|]*)\|([^|]*)\|', ln)
            if m:
                rows[m.group(1).strip()] = {'aeste': m.group(2).strip(), 'nimm': m.group(3).strip(), 'nicht': m.group(4).strip(),
                                            'frames_text': m.group(5).strip(), 'wirksamkeit': m.group(6).strip()}
    return rows


def sync_schuetzt(pfad):
    """Wird pfad vom öffentlichen Spiegel (sync_github.sh) sicher ausgelassen?
    Sicher: außerhalb von 30_DECISIONS und 65_SCENELETS; oder unter replies/ mit einem Unterordner _privat… (Muster */_privat*);
    oder sync_github.sh enthält den passenden Ausschluss (erfassung_r*, belege). Vergleich über realpath, ohne Groß/klein."""
    p = os.path.realpath(os.path.expanduser(pfad)); low = p.lower()
    dec = os.path.realpath(DEC).lower(); sce = os.path.realpath(os.path.join(HUB, '65_SCENELETS')).lower()
    def unter(a, b):
        return a == b or a.startswith(b + os.sep)
    if not unter(low, dec) and not unter(low, sce):
        return True
    rep = os.path.join(dec, 'replies')
    if not unter(low, rep):
        return False
    rel = p[len(rep) + 1:]
    if re.search(r'.+/_privat', rel):
        return True
    try:
        sync = open(os.path.join(DEC, 'sync_github.sh'), encoding='utf-8').read()
    except OSError:
        return False
    return ('*/erfassung_r*/*' in sync and re.search(r'.+/erfassung_r[^/]*/', rel) is not None) or \
           ('*/belege/*' in sync and re.search(r'.+/belege/', rel) is not None)
