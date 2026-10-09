# Lieferung R2 nach QA_RULEBOOK_ENVIRONMENT_R1 §00 + §0b: Farb-Grammatik + Palette-Audit, Etherington-Probe,
# Artenlisten nach Set-Hierarchie, Aussortiert. Alles aus innerweltlichen Geschichten abgeleitet.
# python3 docs/biome-sheets/make_r2.py && node docs/biome-sheets/render_r2.mjs
import json, os, re, html
D = os.path.dirname(os.path.abspath(__file__))
e = html.escape
src = open(os.path.join(D, '..', '..', 'src', 'palettes.ts')).read()

def roles(pid):
    blk = src[src.index(f'  {pid}: {{\n    why'):]
    blk = blk[:blk.index('\n  },')]
    out = {}
    for k in ['ground', 'grass', 'stone', 'bark', 'leaf', 'bloom', 'water', 'accent']:
        m = re.search(rf"\b{k}: \['(#\w+)', '(#\w+)', '(#\w+)'\]", blk)
        out[k] = m.groups()
    return out

CSS = '''*{box-sizing:border-box}body{margin:0;width:1600px;font:13px/1.35 system-ui,-apple-system,sans-serif;color:#2b2340;background:#f6f1e8}
.top{display:flex;align-items:center;gap:16px;padding:12px 22px;background:#2b2340;color:#fff}.top h1{margin:0;font-size:22px}.top .m{opacity:.8}
.top .pf{margin-left:auto;display:flex;gap:10px}.pf span{border:2px solid #fff;border-radius:6px;padding:4px 14px;font-weight:700}
.wrap{padding:12px 18px;display:flex;flex-direction:column;gap:12px}.box{background:#fff;border-radius:10px;padding:10px 12px;box-shadow:0 1px 3px #0001}
h2{font-size:12px;letter-spacing:.06em;text-transform:uppercase;margin:0 0 6px;color:#7a6f8f}
table{border-collapse:collapse;width:100%}td,th{padding:5px 6px;border-top:1px solid #eee;vertical-align:top;text-align:left}th{font-size:11px;color:#7a6f8f;text-transform:uppercase}
.sw{display:flex;height:22px;border-radius:4px;overflow:hidden;margin-bottom:3px}.sw i{flex:1}.why{font-size:11px;color:#4a4060}
.ok{color:#2a9d5f;font-weight:700}.no{color:#d1495b;font-weight:700}
.story{font-size:15px;line-height:1.45}.note{font-size:12px;color:#5a5070}
.sp{display:grid;grid-template-columns:repeat(5,1fr);gap:10px}.sp div{background:#fbf8f2;border-radius:8px;padding:6px;font-size:12px}
.sp img{width:100%;height:150px;object-fit:cover;object-position:50% 70%;border-radius:6px;background:#eef3f8}.sp b{display:block;font-size:13px;margin:3px 0 1px}
.tag{display:inline-block;border-radius:4px;padding:0 5px;font-size:11px;margin-right:4px}.p{background:#d8f0e0}.x{background:#ffe7c2}
.pr{display:grid;grid-template-columns:300px 1fr 1fr 260px;gap:10px;align-items:start}.pr img{width:100%;border-radius:8px}
'''

def page(name, title, meta, body, h=None):
    html_ = f'<!doctype html><html lang="de"><head><meta charset="utf-8"><title>{e(title)}</title><style>{CSS}</style></head><body><div class="top"><h1>{e(title)}</h1><span class="m">{e(meta)}</span><div class="pf"><span>PASS</span><span>FAIL</span></div></div><div class="wrap">{body}</div></body></html>'
    open(os.path.join(D, name + '.html'), 'w').write(html_)

# ---------------- (a) Farb-Grammatik ----------------
ISL = [('pyramide', 'wueste', 'Pyramiden-Insel'), ('canyon', 'canyon', 'Canyon'), ('bucht', 'bucht', 'Bikini-Bucht'), ('otown', 'otown', 'O-Town')]
RN = [('ground', 'Boden'), ('grass', 'Gras'), ('stone', 'Fels / Stein'), ('bark', 'Rinde'), ('leaf', 'Laub'), ('bloom', 'Blüte'), ('water', 'Wasser'), ('accent', 'Akzent / Requisit')]
WHY = {
 'pyramide': ['Sand: verwitterter Sandstein der Insel', 'Trockengras, vom Sand eingefärbt', 'derselbe Sandstein wie die Pyramide: aus ihr gebrochen, beim Bau liegen geblieben',
              'Palmstamm, sonnenverbrannt warm', 'Dattelpalmen-Grün: saftig nur an der Oase', 'Kaktusblüte: Koralle', 'Oase: das einzige Kühle der Insel', 'hellster Punkt = Pyramidenspitze; Koralle an Krügen und Requisiten'],
 'canyon': ['violetter Tisch: dunkle Walderde, surreal ins Violett verschoben', 'Waldgras, entsättigt Richtung Tisch', 'Orange: der Fels der Insel (Unterseite, Tafeltürme); Brocken fallen vom selben Stein',
            'Braun: altes Holz, das der Müller schlägt', 'Waldgrün der Kugelbäume', 'Lime-Gelb: Blüten am Waldrand', 'Schieferblau: der Mühlteich', 'Strang-Orange: Mühlrad, Werkzeug, Requisiten'],
 'bucht': ['Sand, vom Meer abgelagert', 'Dünengras: gedämpftes Lime', 'warmer Ocker: Strandsteine aus dem Inselgrund (Unterseite), vom Meer rundgeschliffen',
           'Sandbraun: Stämme im Salzwind', 'Lime: Tang- und Palmgrün im Licht', 'Rosa: Tangblüte', 'Aqua: die Lagune', 'Korallen-Violett: nur lebende Koralle am Wasser und Requisiten, nie Fels'],
 'otown': ['Petrol: gepflegter Rasen der Vorstadt, surreal verschoben', 'Mint-Petrol: frisch gemäht', 'Schiefer Lila-Grau: aus der Baugrube (Unterseite)',
           'Lila Stämme: dieselbe Erde wie die Unterseite', 'Herbstorange der gepflanzten Straßenbäume', 'Magenta: Blumenbeet der Anwohner', 'Taubenblau', 'Magenta der Wackeltürme: Schilder, Bänke, Requisiten'],
}
rows = ''
for isl, pid, nm in ISL:
    R = roles(pid)
    cells = ''.join(f'<td><div class="sw">{"".join(f"<i style=background:{c}></i>" for c in R[k])}</div><div class="why">{e(WHY[isl][i])}</div></td>' for i, (k, _) in enumerate(RN))
    rows += f'<tr><td><b>{e(nm)}</b><br><span class="note">Palette {pid}</span></td>{cells}</tr>'
audit = [
 ('rock → Fels/Stein', 'ok: Sandstein', 'falsch: Creme = Wolkenfarbe', 'falsch: Korallen-Violett', 'falsch: Magenta der Türme', 'Stein aus Unterseite und Hügel ableiten'),
 ('leaf 0/1 → Laub', 'ok', 'ok', 'ok', 'ok (Herbst)', '–'),
 ('leaf 2 → Blüte', 'ok', 'ok (Lime)', 'ok (Rosa)', 'ok (Magenta)', '–'),
 ('trunk → Rinde', 'ok', 'ok', 'ok', 'ok (Lila = Unterseite)', '–'),
 ('water → Wasser', 'ok', 'ok', 'ok', 'ok', '–'),
 ('– → Gras', 'fehlt', 'fehlt', 'fehlt', 'fehlt', 'bisher Laubfarbe, jetzt aus Boden + Laub'),
 ('tower → Akzent/Requisit', 'ok', 'ok', 'ok', 'ok', 'nur Akzent, nie Fels'),
]
mark = lambda t: f'<span class="{"ok" if t.startswith("ok") else "no"}">{e(t)}</span>' if t != '–' else '–'
arows = ''.join(f'<tr><td><b>{e(a[0])}</b></td>{"".join(f"<td>{mark(x)}</td>" for x in a[1:5])}<td class="note">{e(a[5])}</td></tr>' for a in audit)
body = f'''<div class="box"><h2>Farb-Grammatik · je Material-Rolle drei Töne (hell, mittel, dunkel) · der Satz sagt, woher die Farbe innerweltlich kommt</h2>
<table><tr><th>Insel</th>{"".join(f"<th>{e(n)}</th>" for _, n in RN)}</tr>{rows}</table></div>
<div class="box"><h2>Palette-Audit · taugen die Joyride-Paletten für Material-Rollen?</h2>
<table><tr><th>Joyride-Feld → Rolle</th><th>Pyramide</th><th>Canyon</th><th>Bucht</th><th>O-Town</th><th>Folge</th></tr>{arows}</table>
<p class="note"><b>Befund:</b> Die Joyride-Paletten sind Stimmungen für eine Rennstreckenwelt. Laub, Blüte, Rinde und Wasser tragen, aber das Feld <i>rock</i> ist auf drei von vier Inseln eine Turm- oder Wolkenfarbe, und Gras fehlt.
<b>Vorschlag:</b> kein neues Palettensystem, sondern eine Rollen-Schicht pro Insel (<code>ENV_ROLES</code> in <code>src/palettes.ts</code>, steht schon im Code): drei Töne je Rolle mit Herkunft. Kenney-Modelle benennen ihre Materialien selbst (<i>leafsGreen, woodBark, grass, dirt, colorRed</i>) und werden über dieselben Rollen umgefärbt. Ein eigener Claude-Design-Auftrag ist nur für das Feintuning der 32 Felder nötig, nicht für das System.</p></div>'''
page('farbgrammatik', 'Farb-Grammatik und Palette-Audit', 'Lieferung (a) · QA §0b.4 · aus den Geschichten abgeleitet', body)

# ---------------- (b) Etherington-Probe ----------------
info = {r['object']: r for r in json.load(open(os.path.join(D, 'probe', 'probe.json')))['eval'][0]}
PROBE = [
 ('baum', 'Baum · KayKit Kugelbaum', 'Der Baum ist hier gewachsen, nicht hingestellt. Seine Wurzeln haben die Erde am Stamm aufgewölbt (Eingraben); Laub und Regen dunkeln die Erde um ihn (Kontakt); im Schatten am Fuß wächst Gras, ein Brocken ist gegen den Stamm gerollt (Überlappen).'),
 ('busch', 'Busch · KayKit Kuppelbusch', 'Der Busch wächst aus dem Boden: Seine Zweige hängen bis auf die Erde, darunter ist es feucht und dunkel. Gras schiebt sich unter dem Rand hervor.'),
 ('fels', 'Fels · KayKit Felsbrocken', 'Der Brocken ist vom Hügel gerollt und auf seiner breiten Seite zur Ruhe gekommen. Erde hat sich angeweht und ihn eingebettet; im Windschatten wächst Gras, abgeplatzte Bröckel liegen daneben.'),
]
rows = ''
for k, title, story in PROBE:
    i = info[k]
    meas = f'Höhe {i["heightH"]} H · eingesunken {i["sinkPct"]} % · Erdhügel {i["moundMax"]} · Kontaktband {i["contactBand"]} der Höhe · {i["tufts"]} Grasbüschel ({round(i["tuftShare"]*100)} %) · {i["pebbles"]} Bröckel ({round(i["pebbleShare"]*100)} %)'
    rows += f'<div class="box pr"><div><h2>{e(title)}</h2><div class="story" style="font-size:14px">{e(story)}</div></div><div><h2>ohne</h2><img src="probe/probe__{k}-ohne.jpg"></div><div><h2>mit Eingraben · Kontakt · Überlappen</h2><img src="probe/probe__{k}-mit.jpg"></div><div><h2>Messwerte</h2><div class="note">{e(meas)}</div><h2 style="margin-top:10px">Technik → Umsetzung</h2><div class="note">Eingraben: Fuß 5–15 % in den Boden, weicher Erdhügel. Kontakt: Kontakt-Blob (AO) und dunklere Erde am Boden, Bodenfarbe zieht am Fuß hoch. Überlappen: Büschel und Bröckel auf der Bodenlinie, je unter 15 % der Objekthöhe.</div></div></div>'
body = f'''<div class="box" style="display:grid;grid-template-columns:1fr 220px 220px;gap:12px;align-items:center"><div class="story">Probe vor jeder Insel (QA §0b.5): dasselbe Licht wie im Worldbuilder, derselbe Boden, links ohne, rechts mit den drei Etherington-Techniken. Feste Kameras auf den Fuß; Seite <code>/probe.html</code>, Presets <i>baum-ohne … fels-mit</i>. Palette Canyon.</div>
<div><img src="pdf/atlas_p11.jpg" style="width:100%;border-radius:6px"><div class="note">Diorama Texture Atlas: radiale Kontakt-Blobs</div></div><div><img src="pdf/atlas_p13.jpg" style="width:100%;border-radius:6px"><div class="note">Atlas: Krümel und Brocken am Fuß</div></div></div>{rows}'''
page('etherington', 'Etherington-Probe', 'Lieferung (b) · Baum, Busch, Fels · ohne / mit', body)

# ---------------- (c) Artenlisten ----------------
L = json.load(open(os.path.join(D, 'lists_r2.json')))
KITN = {'kk': 'KayKit', 'tt': 'Tiny Treats', 'q': 'Quaternius', 'kn': 'Kenney'}
ART = {
 'pyramide': ('Die Pyramide wurde aus dem Sandstein der Insel gebrochen; ihre Erbauer, die Mumien, leben noch hier. Wasser gibt es nur in der Oase, dort haben die Mumien Dattelpalmen gepflanzt. Alles andere wächst wild und trocken, je weiter vom Wasser, desto karger.', [
   ('Schirmakazie', 'wild gewachsen, wo das Grundwasser der Oase noch reicht; breite Krone als Schatten am Karawanenweg'),
   ('Dattelpalme', 'von den Mumien an die Oase gepflanzt, wegen der Datteln; neigt sich zum Wasser. Ergänzung: KayKit und Tiny Treats haben keine Palme'),
   ('Saguaro', 'wächst wild im trockenen Westteil, wo sonst nichts überlebt. Ergänzung: kein Kaktus bei KayKit/Tiny Treats'),
   ('Totes Holz', 'verdorrt, als die Oase kleiner wurde: erzählt, dass es hier einmal grüner war'),
   ('Dornbusch', 'im Windschatten der Steine, wo sich Feuchtigkeit hält'),
   ('Sandsteinblock', 'vom Pyramidenbau übrig, liegt, wo die Bauleute ihn abgelegt haben (ocker = Pyramidenstein)'),
   ('Sandsteinsplitter', 'Abschlag vom Behauen, um die Blöcke verstreut'),
   ('Trockengras', 'nur im Schatten am Fuß von Stein und Baum'),
 ]),
 'canyon': ('Ein Müller hat die Wassermühle an den Teich gebaut. Sein Holz holt er aus dem alten Kugelwald hinter der Mühle; wo er fällt, wächst Jungwald nach. Der Hügel ist mager und steinig, dort halten sich nur Kiefern.', [
   ('Kugelbaum', 'alter Wald, seit jeher hier; liefert dem Müller Holz und Schatten'),
   ('Kugelbaum, ausladend', 'der älteste Baum am Teich, zu groß zum Fällen'),
   ('Jungbaum', 'nachgewachsen, wo der Müller gefällt hat; steht neben einem Stumpf'),
   ('Kiefer', 'auf dem mageren Hügel angeflogen'),
   ('Waldrandbusch, flach', 'am Waldrand, wo Licht hinkommt'),
   ('Waldrandbusch, rund', 'unter den Kugelbäumen'),
   ('Canyonfels', 'vom Hügel gerollt; derselbe orange Stein wie die Unterseite der Insel'),
   ('Kiesel', 'Abrieb vom Fels, am Wegrand zusammengeschoben'),
   ('Baumstumpf', 'hier hat der Müller Holz geschlagen; Moos sagt, dass es lange her ist. Ergänzung: Quaternius'),
   ('Pilze', 'im feuchten Schatten am Teich und an Stümpfen. Ergänzung: Kenney'),
   ('Seerose', 'im Mühlteich (Wasserpflanze; Größe noch falsch: eigene Regel nach Durchmesser)'),
   ('Waldgras', 'im Halbschatten am Fuß der Bäume'),
 ]),
 'bucht': ('Eine Strandtaverne an einer Lagune, die das Meer zurückgelassen hat. Was hier wächst, hat das Wasser angespült oder der Wirt gepflanzt: Tangbäume am Ufer, Palmen als Schatten für die Gäste.', [
   ('Tangbaum', 'aus angespültem Tang am Lagunenufer hochgewachsen; die Krone blüht rosa (Instanz-Slot Blüte, noch nicht im Bild)'),
   ('Palme', 'vom Wirt gepflanzt, Schatten vor der Taverne. Ergänzung: Quaternius'),
   ('junger Tangbaum', 'neu angespült, noch klein'),
   ('Dünenbusch', 'hält den Sand am Rand fest'),
   ('Strandstein', 'vom Meer rundgeschliffen, liegt an der Flutkante (Ocker aus dem Inselgrund)'),
   ('Kiesel', 'am Wasser, wo die Wellen sie ablegen'),
   ('Strandblume weiß', 'wächst, wo die Gäste nicht treten, zwischen den Steinen'),
   ('Strandblume blau', 'dito, an der Lagune'),
   ('Dünengras', 'auf den Dünen, vom Wind gekämmt'),
   ('Seerose', 'in der Lagune (Größe noch falsch, s. Canyon)'),
 ]),
 'otown': ('Eine Vorstadt: Stadthaus und Parkplatz sind gebaut, alles Grün ist gepflanzt. Die Stadt hat Straßenbäume an den Weg gesetzt, die Anwohner einen kleinen Park hinter dem Haus und ein Blumenbeet.', [
   ('Straßenbaum', 'von der Stadt am Weg gepflanzt, in Reihe und gleichem Abstand'),
   ('Parkbaum', 'von den Anwohnern im Park hinter dem Haus gepflanzt'),
   ('Jungbaum', 'neu nachgepflanzt, mit Pfahl'),
   ('Hecke rund', 'am Haus gepflanzt, rund geschnitten'),
   ('Ziergebüsch', 'Rand des Parks'),
   ('Schieferbrocken', 'beim Ausheben der Baugrube übrig, an den Rand geschoben'),
   ('Schieferkiesel', 'Rest vom Bau, am Wegrand'),
   ('Beetblume weiß', 'von Anwohnern ins Beet am Haus gepflanzt'),
   ('Beetblume blau', 'dito'),
   ('Rasen', 'gemäht, nur am Fuß von Baum und Stein höher'),
 ]),
}
for isl, pid, nm in ISL:
    pal, lst = L[isl]
    story, items = ART[isl]
    meta = json.load(open(os.path.join(D, 'r2', f'r2_{isl}.json')))['eval'][0]
    cards = ''
    for i, (sid, (nmx, why)) in enumerate(zip(lst, items)):
        pre, rest = sid.split(':')
        model, role = rest.split('@')
        prim = pre in ('kk', 'tt')
        hh = meta[i][1]
        cards += f'<div><img src="r2/r2_{isl}__item{i}.jpg"><b>{e(nmx)}</b><span class="tag {"p" if prim else "x"}">{KITN[pre]} · {"primär" if prim else "Ergänzung"}</span><span class="note">{e(model)} · {hh} H</span><div class="why" style="margin-top:4px">{e(why)}</div></div>'
    body = f'<div class="box"><h2>Geschichte der Insel</h2><div class="story">{e(story)}</div></div><div class="box"><h2>Arten nach Set-Hierarchie · Bild aus lineup.html in der Farb-Grammatik · je Art: wer, warum, was erzählt es</h2><div class="sp">{cards}</div></div>'
    page(f'arten_{isl}', f'Artenliste {nm}', 'Lieferung (c) · primär KayKit + Tiny Treats, Ergänzung Quaternius / Kenney · keine Kachelstücke', body)

# ---------------- Aussortiert ----------------
pal, lst = L['aus']
REASON = ['Quaternius: gerade Schnittflächen und Moosdeckel, liest als Klippen-Kachel. Stand am Canyon-Rand.', 'dito, Canyon-Rand', 'Quaternius: flach geschnittene Platte. Stand am Pyramiden-Rand.', 'Quaternius: Säule mit Schnittflächen',
          'Kenney: flache Sechseck-Platte = Bodenkachel', 'Kenney: flache Platte', 'Kenney: Tafelberg-Säule mit Kachelfuß', 'Kenney: Bodenplatte', 'Kenney: Baum auf Plateau-Kachel', 'Kenney: Baum auf Bodenkachel (Name ground)',
          'Kenney cliff_*: Klippenkachel (Eichstück)', 'Kenney cliff_*: Klippenkachel', 'KayKit: Würfelkrone, anderer Stil', 'KayKit: Würfelbusch', 'Kenney: kastiger Kaktus', 'Kenney: Scheiben-Kiefer, flach']
cards = ''.join(f'<div><img src="r2/r2_aus__item{i}.jpg"><b>{e(s.split(":")[1].split("@")[0])}</b><div class="why">{e(REASON[i])}</div></div>' for i, s in enumerate(lst))
body = f'''<div class="box" style="display:grid;grid-template-columns:1fr 1fr;gap:12px"><div><h2>Beleg: das falsche Bauteil am Rand (Bild aus der abgelehnten Fassung)</h2><img src="r2/beleg_canyon_rand.jpg" style="width:100%;border-radius:8px"></div>
<div><h2>Befund</h2><div class="story">Die „harten Kanten“ waren die Randsteine <b>Quaternius Rock_Moss_4 / 6 / 7</b> (Canyon) und <b>Rock_6 / Rock_1 / Rock_3</b> (Pyramide, Bucht): gerade Schnittflächen, flacher Deckel mit Moosschicht. Sie sehen aus wie die Kenney-Klippenkachel <i>cliff_block</i> und standen dort, wo eine Felsformation hingehört.</div>
<p class="note">Regel ab jetzt: Namensfilter <code>TILE_NAME</code> in <code>src/environment/kits.ts</code> (cliff, ground, path, bridge, platform, fence, crops …) plus Sichtprüfung jedes Steins in der Aufreihung. Ein automatischer Kachel-Detektor (Anteil achsparalleler Flächen) trennt nicht sicher: Kenney-Steine sind von Haus aus kastig. Er bleibt nur Hinweis.</p></div></div>
<div class="box"><h2>Aussortiert (Kit-Originalfarben)</h2><div class="sp" style="grid-template-columns:repeat(8,1fr)">{cards}</div></div>'''
page('aussortiert', 'Aussortiert: Kachel- und Anschlussstücke', 'Lieferung (c) · Nachweis', body)
print('ok')
