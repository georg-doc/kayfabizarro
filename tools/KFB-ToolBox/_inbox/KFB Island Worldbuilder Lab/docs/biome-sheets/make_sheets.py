# Biom-Blätter (QA_RULEBOOK_ENVIRONMENT_R1 §1): one page per island, rendered from this data.
# python3 docs/biome-sheets/make_sheets.py  → docs/biome-sheets/<id>.html (served by the lab dev server)
import json, os, html

D = os.path.dirname(os.path.abspath(__file__))
GEO = json.load(open(os.path.join(D, 'islands.geo.json')))
# top view: island origin at image centre (500, 500), px per lab unit (measured from the camera, tools/out/top_<id>.json)
PX = {'pyramide': 9.202, 'canyon': 14.269, 'bucht': 15.683, 'otown': 13.470}

S = {
 'pyramide': dict(
  title='Pyramiden-Insel', biome='Wüste', kit='Quaternius, rund geknetet', pal='wueste',
  story='Die Mumien halten Hof vor ihrer Pyramide: Mumie A thront auf dem Sarkophag, Mumie B trägt das Ankh. '
        'Alles Leben drängt sich an die Oase, dort stehen die Palmen dicht und neigen sich übers Wasser. '
        'Je weiter weg vom Wasser, desto karger: Agaven, ein Saguaro, am Westrand nur noch totes Holz. Gefühl: Hitze, Weite, ein grüner Fleck.',
  colors=[('60', '#eac47c', 'Sand · Boden, Dünen, Sandstein (Pyramide, Steine Ton in Ton)'),
          ('30', '#3f9142', 'Palmengrün · Laub hell #5fb04a / dunkel #3f9142'),
          ('10', '#34bccb', 'Oasentürkis · Wasser; hellster Punkt = Pyramidenspitze #f8dc98')],
  light='Hellste Fläche ist die Pyramidenspitze. Das dunkle Palmengrün sitzt links an der Oase als Gegengewicht, der Rest bleibt hell.',
  species=[(1, 'Palme gebogen', '3,25 H', 'Anker Oase'), (0, 'Palme gerade', '3,25 H', 'Anker Flanke'), (5, 'Saguaro', '2 H', 'Anker trocken'),
           (9, 'Totes Holz', '2 H', 'Akzent Westrand'), (10, 'Agave', '0,6 H', 'Busch'), (12, 'Schilf', '0,6 H', 'nur am Ufer'),
           (13, 'Sandstein', '1,35 H', 'Rand'), (16, 'Kiesel', '0,43 H', 'Akzent'), (17, 'Gras', '0,18 H', 'Fuß-Überlappung')],
  groups=[('G1', 'Oasen-Hain', 'Wasser', -27, 4, 'Palme gebogen ×1,3 übers Wasser', 'Palme gerade ×2 (0,8) · Schilf ×3 am Ufer', 'Kiesel'),
          ('G2', 'Mumien-Garten', 'Bewohner', 24, 28, 'Saguaro ×1,3', 'Agave ×2 · Saguaro 0,8', 'Kiesel'),
          ('G3', 'Palmen an der Ostflanke', 'Landmarke', 38, -5, 'Palme gerade ×1,3', 'Palme 0,8 · Agave', 'Kiesel'),
          ('G4', 'Verdorrt am Westrand', 'Rand', -40, -8, 'Totes Holz ×1,2', 'Sandstein ×2 · Gras', '–')],
  cams=[('K1', 'Übersicht SO', 40, 40, -1, -1), ('K2', 'Augenhöhe Karawanenweg → Pyramide', 3, 40, 0, -1), ('K3', 'Seite West, Silhouette', -50, 0, 1, 0)],
  free='Frei bleiben: Karawanenweg und Platz vor der Pyramide (Freifläche); kein Baum vor der Pyramide über 13 (60 % von 21,8).',
  refs=[('claybound_kaktus', 'Claybound: Knetform, Kaktus'), ('diorama_E', 'Palmen dicht am Wasser'), ('diorama_F', 'Sand, Fels, totes Holz')],
  decide=None),
 'canyon': dict(
  title='Canyon', biome='Wald', kit='Quaternius, rund geknetet', pal='canyon',
  story='Der Müller mahlt am Mühlteich; der Weg kommt vom Rand über den Hügel herunter zur Mühle. '
        'Hinter der Mühle steht der alte Wald aus Kugelbäumen, am Teich hängen Weiden ins Wasser, am Nordhang stehen Kiefern im Wind. '
        'Gefühl: ruhiges Waldtal. Man kommt über den Hügel und sieht unten die Mühle.',
  colors=[('60', '#8b68c7', 'Violetter Tisch · Boden, Hügel #a582d9'),
          ('30', '#1f7a3e', 'Waldgrün · Kugelkronen #1f7a3e / #2f8a45'),
          ('10', '#ef5a22', 'Orange · Mühlrad, Dach (Joyride-Tafeltürme); Lime-Blüten #cdc666')],
  light='Dunkle Waldmasse direkt hinter der Mühle, davor das helle Teichufer: Das warme Mühlendach hebt sich ab.',
  species=[(4, 'Kugelbaum', '3,25 H', 'Anker Wald'), (1, 'Laubbaum', '3,25 H', 'Stütze'), (6, 'Weide', '3,25 H', 'Anker Teich'),
           (7, 'Kiefer', '2 H', 'Anker Hang'), (9, 'Kiefer breit', '2 H', 'Stütze Hang'), (12, 'Busch', '0,6 H', 'Stütze'),
           (14, 'Beerenbusch', '0,6 H', 'Stütze'), (16, 'Moosstein', '0,43 H', 'Akzent'), (17, 'Baumstumpf', '0,43 H', 'Akzent Mühle'),
           (19, 'Blumen', '0,25 H', 'Akzent Teich'), (20, 'Gras', '0,18 H', 'Fuß-Überlappung')],
  groups=[('G1', 'Mühlwald', 'Landmarke', 22, -10, 'Kugelbaum ×1,3', 'Laubbaum 0,8 · Busch · Beerenbusch', 'Baumstumpf'),
          ('G2', 'Weiden am Mühlteich', 'Wasser', 8, 4, 'Weide ×1,2', 'Busch ×2', 'Blumen'),
          ('G3', 'Kiefern am Nordhang', 'Hang', -14, -12, 'Kiefer ×1,3', 'Kiefer breit ×2 (0,8)', 'Moosstein'),
          ('G4', 'Waldrand Süd', 'Vordergrund K1', 6, 18, 'Laubbaum ×1,2', 'Busch · Beerenbusch', 'Moosstein')],
  cams=[('K1', 'Übersicht SO', 30, 30, -1, -1), ('K2', 'Augenhöhe vom Hügel → Mühle', -22, 0, 1, -0.4), ('K3', 'Seite Süd, Silhouette', 0, 36, 0, -1)],
  free='Frei bleiben: Hügel und Weg (Freifläche), Blick über den Teich auf die Mühle.',
  refs=[('claybound_baeume', 'Claybound: runde Knetkronen'), ('diorama_B', 'Wald am Wasser, Kiefern'), ('diorama_I', 'Haus von Bäumen gerahmt')],
  decide='Mühle ist 2,37 H hoch. Nach der Landmarken-Regel dürfen Bäume höchstens 2,25 H, vor ihr 1,4 H sein: Anker-Band 2,5–4 H geht nicht. '
         'Entscheidung: Mühle zuerst nach K2 vergrößern (Tür-Regel) oder Bäume klein lassen?'),
 'bucht': dict(
  title='Bikini-Bucht', biome='Strand', kit='Quaternius, rund geknetet', pal='bucht',
  story='Ein Unterwasser-Strand: Die Strandtaverne steht an der Lagune, der Weg kommt vom Steg im Süden. '
        'Über dem Lagunenufer hängen Tangbäume mit rosa Blüten, am Weg zur Taverne stehen Palmen. Violette Korallenfelsen stehen an der Kante. '
        'Gefühl: Ferien, Wasser, Wiegen.',
  colors=[('60', '#f0cf7e', 'Sand · Boden, Strand #fbe8b4'),
          ('30', '#3fc4d4', 'Aqua · Lagune, Dünen #5cc3bf, Palmengrün #8fcf45'),
          ('10', '#f7a1c4', 'Rosa · Tangblüten; Korallen-Violett #9a6fd0 an Steinen')],
  light='Helles Sand-Oval, dunkleres Aqua in der Mitte. Rosa sitzt nur am Lagunenufer und zieht den Blick von dort zur Taverne.',
  species=[(1, 'Tangbaum (Weide, rosa Krone)', '3,25 H', 'Anker Ufer'), (4, 'Palme gebogen', '3,25 H', 'Anker Weg'), (5, 'Palme klein', '2 H', 'Stütze'),
           (7, 'Agave', '0,6 H', 'Busch'), (11, 'Korallenfels', '1,35 H', 'Rand'), (12, 'Korallenstein', '0,43 H', 'Akzent'),
           (13, 'Blumen', '0,25 H', 'Akzent'), (14, 'Gras', '0,18 H', 'Fuß-Überlappung')],
  groups=[('G1', 'Tang-Ufer', 'Wasser', -9, -10, 'Tangbaum ×1,2', 'Palme klein 0,8 · Agave', 'Korallenstein'),
          ('G2', 'Palmen vor der Taverne', 'Landmarke', 15, 7, 'Palme gebogen ×1,3', 'Palme klein · Agave', 'Blumen'),
          ('G3', 'Strandpalmen am Weg', 'Weg', 6, 19, 'Palme gebogen ×1,2', 'Agave ×2', 'Korallenstein')],
  cams=[('K1', 'Übersicht SO', 30, 30, -1, -1), ('K2', 'Augenhöhe vom Steg → Taverne', -14, 26, 1, -1), ('K3', 'Seite West, Silhouette', -34, 0, 1, 0)],
  free='Frei bleiben: Lagune und Westufer (Freifläche), Weg vom Steg zur Taverne.',
  refs=[('claybound_kaktus', 'Claybound: Knetform, Farbe'), ('diorama_E', 'Palmen am Wasser'), ('diorama_C', 'rosa Kronen am Teich')],
  decide='Taverne ist 2,3 H hoch. Wie beim Canyon: Palmen dürfen höchstens 2,2 H, vor ihr 1,4 H sein. Taverne zuerst vergrößern?'),
 'otown': dict(
  title='O-Town', biome='Herbst-Vorstadt', kit='Quaternius (Herbst-Varianten), rund geknetet', pal='otown',
  story='Schräge Vorstadt: Das Stadthaus ist das Ziel, davor parken die Autos. '
        'Die Anwohner haben hinter dem Haus einen kleinen Herbstpark gepflanzt, Schirmbäume mit orangen Kronen auf lila Stämmen. '
        'Am Abzweig steht eine Baumgruppe als Wegmarke, magentafarbene Felsen an der Kante erinnern an die Wackeltürme. Gefühl: Spätsommer in der Vorstadt.',
  colors=[('60', '#3aa596', 'Petrol · Boden, Hügel #2f8f83; Gras = Boden hell, nicht Laub'),
          ('30', '#f08a2c', 'Orange · Kronen #f08a2c / #f5b041 auf lila Stämmen #6b4a8a'),
          ('10', '#e0679f', 'Magenta · Felsen, Steine (Joyride-Wackeltürme)')],
  light='Orange Kronen rahmen das Stadthaus links und rechts, davor bleibt der Platz petrol und ruhig.',
  species=[(0, 'Schirmbaum', '3,25 H', 'Anker Park'), (2, 'Laubbaum', '3,25 H', 'Anker'), (4, 'Herbstbirke', '2 H', 'Stütze'),
           (8, 'Busch', '0,6 H', 'Stütze'), (9, 'Busch breit', '0,6 H', 'Stütze'), (11, 'Magenta-Stein', '0,43 H', 'Akzent'),
           (12, 'Magenta-Fels', '1,35 H', 'Rand'), (13, 'Blumen', '0,25 H', 'Akzent'), (14, 'Gras', '0,18 H', 'Fuß-Überlappung')],
  groups=[('G1', 'Herbstpark West', 'Landmarke', -21, -12, 'Schirmbaum ×1,3', 'Herbstbirke ×2 · Busch', 'Magenta-Stein'),
          ('G2', 'Hinterhof Ost', 'Landmarke', 12, -19, 'Laubbaum ×1,2', 'Herbstbirke · Busch breit', 'Blumen'),
          ('G3', 'Wegmarke am Abzweig', 'Weg', 26, 8, 'Laubbaum ×1,2', 'Busch ×2', 'Magenta-Stein'),
          ('G4', 'Garten Südwest', 'Kern', -18, 15, 'Schirmbaum ×1,2', 'Busch · Herbstbirke 0,8', 'Blumen')],
  cams=[('K1', 'Übersicht SO', 34, 34, -1, -1), ('K2', 'Augenhöhe vom Weg → Stadthaus', 22, 19, -1, -1), ('K3', 'Seite West, Silhouette', -40, 0, 1, 0)],
  free='Frei bleiben: Platz vor dem Stadthaus mit den Autos (Freifläche), beide Wege.',
  refs=[('claybound_baeume', 'Claybound: runde Knetkronen'), ('diorama_D', 'Bäume rahmen das Ziel'), ('diorama_B', 'Herbstkronen')],
  decide=None),
}

CSS = '''
*{box-sizing:border-box}body{margin:0;width:1600px;height:1000px;font:14px/1.35 system-ui,-apple-system,sans-serif;color:#2b2340;background:#f6f1e8;overflow:hidden}
.top{display:flex;align-items:center;gap:18px;padding:12px 22px;background:#2b2340;color:#fff}
.top h1{margin:0;font-size:24px}.top .m{opacity:.8}.top .pf{margin-left:auto;display:flex;gap:10px}
.pf span{border:2px solid #fff;border-radius:6px;padding:4px 14px;font-weight:700}
.grid{display:grid;grid-template-columns:520px 1fr 380px;gap:14px;padding:12px 18px}
.box{background:#fff;border-radius:10px;padding:10px 12px;box-shadow:0 1px 3px #0001}
h2{font-size:12px;letter-spacing:.06em;text-transform:uppercase;margin:0 0 6px;color:#7a6f8f}
.plan{position:relative;width:496px;height:496px}.plan img,.plan svg{position:absolute;inset:0;width:496px;height:496px}
.story{font-size:16px;line-height:1.45}
.bar{display:flex;height:34px;border-radius:6px;overflow:hidden;margin:4px 0 6px}
.bar div{display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;text-shadow:0 1px 2px #0006}
.cl{font-size:12.5px;margin:2px 0}.cl i{display:inline-block;width:12px;height:12px;border-radius:3px;margin-right:6px;vertical-align:-1px}
table{border-collapse:collapse;width:100%;font-size:12.5px}td{padding:4px 5px;border-top:1px solid #eee;vertical-align:top}
td.g{font-weight:700;color:#fff;border-radius:4px;text-align:center;width:30px}
.why{display:inline-block;background:#efe8ff;border-radius:4px;padding:0 5px;font-size:11.5px}
.sp{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}.sp div{text-align:center;font-size:11px}
.sp img{width:100%;height:78px;object-fit:cover;object-position:50% 72%;border-radius:6px;background:#eef3f8}
.sp b{display:block;font-size:11.5px}
.refs{display:flex;gap:6px;flex-wrap:wrap}.refs div{flex:1 1 30%}.refs div{flex:1;font-size:11px;text-align:center}.refs img{width:100%;height:70px;object-fit:cover;border-radius:6px}
.dec{background:#fff1d6;border:2px solid #f0a020;border-radius:10px;padding:8px 12px;font-size:13px;margin-top:10px}
.note{font-size:12px;color:#5a5070;margin-top:6px}
'''
GC = ['#d1495b', '#2a9d8f', '#e9a03b', '#5a6fd6']

def plan_svg(id, s):
    g, px = GEO[id], PX[id]
    P = lambda x, z: (500 + x * px, 500 + z * px)
    out = []
    ox, oz = P(*g['openC']); out.append(f'<circle cx="{ox:.0f}" cy="{oz:.0f}" r="{g["openR"]*px:.0f}" fill="#ffffff22" stroke="#fff" stroke-width="4" stroke-dasharray="14 10"/>')
    out.append(f'<text x="{ox:.0f}" y="{oz:.0f}" fill="#fff" font-size="30" font-weight="700" text-anchor="middle" style="paint-order:stroke" stroke="#0007" stroke-width="5">Freifläche</text>')
    lx, lz = P(*g['landmark']); out.append(f'<text x="{lx:.0f}" y="{lz+12:.0f}" font-size="54" text-anchor="middle" fill="#ffd23c" stroke="#2b2340" stroke-width="3">★</text>')
    for i, (gid, name, why, x, z, *_r) in enumerate(s['groups']):
        cx, cz = P(x, z); c = GC[i % 4]
        out.append(f'<circle cx="{cx:.0f}" cy="{cz:.0f}" r="{7*px:.0f}" fill="{c}55" stroke="{c}" stroke-width="5"/>')
        out.append(f'<text x="{cx:.0f}" y="{cz+13:.0f}" font-size="38" font-weight="800" text-anchor="middle" fill="#fff" stroke="{c}" stroke-width="7" style="paint-order:stroke">{gid}</text>')
    for k, name, x, z, dx, dz in s['cams']:
        cx, cz = P(x, z); cx, cz = min(960, max(40, cx)), min(960, max(40, cz))  # keep the camera badge on the plan
        L = (dx*dx + dz*dz) ** 0.5 or 1; ex, ez = cx + dx / L * 90, cz + dz / L * 90
        out.append(f'<line x1="{cx:.0f}" y1="{cz:.0f}" x2="{ex:.0f}" y2="{ez:.0f}" stroke="#2b2340" stroke-width="7" marker-end="url(#a)"/>')
        out.append(f'<circle cx="{cx:.0f}" cy="{cz:.0f}" r="24" fill="#2b2340"/><text x="{cx:.0f}" y="{cz+9:.0f}" font-size="24" font-weight="800" fill="#fff" text-anchor="middle">{k}</text>')
    return ('<svg viewBox="0 0 1000 1000"><defs><marker id="a" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto"><path d="M0,0 L5,2.5 L0,5 z" fill="#2b2340"/></marker></defs>'
            + ''.join(out) + '</svg>')

for id, s in S.items():
    e = html.escape
    bar = ''.join(f'<div style="width:{p}%;background:{c}">{p}</div>' for p, c, _ in s['colors'])
    cl = ''.join(f'<div class="cl"><i style="background:{c}"></i><b>{p} %</b> {e(t)}</div>' for p, c, t in s['colors'])
    rows = ''.join(f'<tr><td class="g" style="background:{GC[i%4]}">{g}</td><td><b>{e(n)}</b> <span class="why">{e(w)}</span><br>Anker: {e(a)}<br>Stützen: {e(st)}<br>Akzent: {e(ac)}</td></tr>'
                   for i, (g, n, w, x, z, a, st, ac) in enumerate(s['groups']))
    sp = ''.join(f'<div><img src="species/sp_{id}__item{i}.jpg"><b>{e(n)}</b>{e(h)} · {e(r)}</div>' for i, n, h, r in s['species'])
    cams = ' · '.join(f'<b>{k}</b> {e(n)}' for k, n, *_ in s['cams'])
    refs = ''.join(f'<div><img src="ref/{f}.jpg">{e(t)}</div>' for f, t in s['refs'])
    dec = f'<div class="dec"><b>Vorab zu entscheiden:</b> {e(s["decide"])}</div>' if s['decide'] else ''
    page = f'''<!doctype html><html lang="de"><head><meta charset="utf-8"><title>Biom-Blatt {e(s["title"])}</title><style>{CSS}</style></head><body>
<div class="top"><h1>{e(s["title"])}</h1><span class="m">Biom {e(s["biome"])} · Kit {e(s["kit"])} · Palette {s["pal"]} · ein Kit, keine Mischung</span>
<div class="pf"><span>PASS</span><span>FAIL</span></div></div>
<div class="grid">
<div><div class="box"><h2>Lageplan · Gruppen · Kameras</h2><div class="plan"><img src="plan/top_{id}.jpg">{plan_svg(id, s)}</div>
<div class="note">{cams}. K4 = Nahaufnahme Fuß an G1.<br>{e(s["free"])}</div></div></div>
<div style="display:flex;flex-direction:column;gap:12px">
<div class="box"><h2>Geschichte</h2><div class="story">{e(s["story"])}</div></div>
<div class="box"><h2>Farbkonzept 60 / 30 / 10</h2><div class="bar">{bar}</div>{cl}<div class="note">Hell-Dunkel: {e(s["light"])}</div></div>
<div class="box"><h2>Gruppen-Rezepte (Rule of Three, Ort-Begründung)</h2><table>{rows}</table></div>{dec}
</div>
<div style="display:flex;flex-direction:column;gap:12px">
<div class="box"><h2>Arten · Bild aus lineup.html · Zielhöhe in H</h2><div class="sp">{sp}</div></div>
<div class="box"><h2>Referenz</h2><div class="refs">{refs}</div></div>
<div class="box"><h2>Kit-Look: facettiert → rund geknetet (gleiche Dreiecke)</h2><img src="soft/look_{id}.jpg" style="width:100%;height:150px;object-fit:cover;object-position:50% 30%;border-radius:6px"></div>
</div></div></body></html>'''
    open(os.path.join(D, f'{id}.html'), 'w').write(page)
    print('wrote', id)
