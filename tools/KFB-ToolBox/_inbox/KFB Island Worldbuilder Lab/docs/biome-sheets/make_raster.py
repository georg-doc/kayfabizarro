# Erzählraster als Entscheidungstafel (statt Markdown): docs/ENV_ERZAEHLRASTER_R1.md → raster.html → R3_erzaehlraster_*.jpg
import os, html
D = os.path.dirname(os.path.abspath(__file__))
e = html.escape
F = ['Ursprung', 'Lebensader', 'Landmarke', 'Arbeit / Leben', 'Spuren', 'Natur nach Gelände']
ISL = [
 ('pyramide', 'Pyramiden-Insel', 'entschieden (D4)', '#2a9d5f', [
   'Eine Oase in der Wüste; um sie herum die Baustelle einer Pyramide, die nie fertig wurde. Okkult, altes Ägypten, Lovecraft.',
   'Die Oase mit Quelle und Palmenhain; ein Pfad zum Steinbruch und zur Baurampe.',
   'Die unvollendete Pyramide (13 Lagen, flache Plattform); oben Auge oder Vogelgott, an der Flanke der Dungeon-Eingang.',
   'Steinbruch an der Inselkante, Schlitten mit Quader, Zeltlager der Bauleute, Wasserkrüge. Die Mumien sind die Bauleute.',
   'Schleifspuren im Sand vom Steinbruch zur Rampe, abgeschlagene Quaderkanten, Trampelpfad Oase → Lager.',
   'Palmen und Schilf nur an der Oase; sonst Dünen, Steine, vereinzelte Dornbüsche im Windschatten; totes Holz, wo die Oase früher reichte.'],
  ['Steine = Bruchstücke aus dem Steinbruch (Sandstein-Ocker): gehäuft am Bruch, vereinzelt an der Schleifspur, in Lagen an der Rampe.', 'Sand angeweht, im Lee höher; kein Gras an Steinen.', 'Fluff nur an den Oasen-Palmen; Fallobst am Ufer und im Lager gesammelt.']),
 ('canyon', 'Canyon', 'Vorschlag', '#e9a03b', [
   'Ein Bach hat aus dem Canyonfels ein Tal gegraben; ein Müller hat sich am Mühlteich angesiedelt.',
   'Bach und Mühlteich; der Weg kommt über den Hügel zur Mühle.',
   'Die Wassermühle.',
   'Mahlen, Holz schlagen im alten Kugelwald.',
   'Baumstümpfe am Waldrand, Holzstapel an der Mühle, ausgetretener Weg.',
   'Kugelwald hinter der Mühle, Jungwald wo gefällt wurde, Weiden am Wasser, Kiefern auf dem mageren Hügel.'],
  ['Felsen nur, wo das Wasser den Inselfels freigelegt hat (Bachrinne, Hang, Kante); Schutt bergab.', 'Stümpfe am Waldrand zur Mühle hin, Jungbäume daneben.', 'Fluff an den Kugelbäumen; der Müller erntet, Korb an der Mühle.']),
 ('bucht', 'Bikini-Bucht', 'Vorschlag', '#e9a03b', [
   'Eine Lagune, die das Meer zurückgelassen hat: ein Unterwasser-Strand.',
   'Die Lagune und der Steg im Süden.',
   'Die Strandtaverne.',
   'Bewirten, Fischen, Tang sammeln.',
   'Pfad vom Steg zur Taverne, Fußspuren im Sand, Liegen und Fässer.',
   'Tangbäume mit rosa Blüten am Ufer (aus angespültem Tang), Palmen vom Wirt vor der Taverne, Dünengras; lebende Korallen nur im flachen Wasser.'],
  ['Strandsteine rund geschliffen, nur an der Flutkante.', 'Korallen-Violett nur im Wasser; Felsen sind ocker.', 'Fluff an Tangbäumen und Palmen.']),
 ('otown', 'O-Town', 'Vorschlag', '#e9a03b', [
   'Eine Vorstadt auf ebenem Grund.',
   'Die Straße (RKIT) und der Parkplatz.',
   'Das Stadthaus.',
   'Wohnen, Parken, Gärtnern.',
   'Trampelpfad quer über den Rasen (Abkürzung), Pfähle an Jungbäumen, Beetrand.',
   'Alles gepflanzt: Straßenbäume in Reihe, Herbstpark hinter dem Haus, Blumenbeet, geschnittene Hecken; Schieferbrocken nur am Rand, aus der Baugrube.'],
  ['Ordnung ist hier die Geschichte: Straßenbäume in gleichem Abstand (Ursache Stadtplanung).', 'Fluff an den Parkbäumen; Fallobst auf dem Rasen, Anwohner sammeln.', '']),
]
RULES = [
 ('Fluff rundum', 'Jede Kronenseite trägt Fluff, Lichtseite etwa 60 : 40. Gruppen zu 2–3 an Zweigenden. Fallobst unter der ganzen Krone, bergab mehr; wo geerntet wird, liegt keins (dort Korb oder Kiste).'),
 ('Saum aus der Ursache', 'Jedes Element beantwortet: wer oder was hat es dorthin gebracht? Wasser, Schwerkraft, Wind, Menschen, Wachstum. Wo keine Ursache wirkt, liegt nichts; keine Zählregel.'),
 ('Übergänge', 'Nie Verlauf oder Alpha. Erde, Sand, Pflaster: Sprenkel (Dot-Muster). Schnee: Zackenkappe (cartoon) oder Flocken (cozy). Je Biom in der Tabellenzeile.'),
 ('Inselböschung', 'Natürliche Rundung von der Oberseite in den Erdfels. Übergang mit dem Dot-Muster, auf der Oberseite oder über die Rundung: Gras wächst ein Stück über die Böschung; im Schnee-Biom ist der Rand abgetaut. Vorerst keine zusätzlichen Unebenheiten.'),
]
CSS = '''*{box-sizing:border-box}body{margin:0;width:1600px;font:14px/1.45 system-ui,-apple-system,sans-serif;color:#2b2340;background:#f6f1e8}
.top{display:flex;align-items:center;gap:16px;padding:12px 22px;background:#2b2340;color:#fff}.top h1{margin:0;font-size:22px}.top .m{opacity:.8}
.wrap{padding:14px 18px;display:flex;flex-direction:column;gap:14px}.box{background:#fff;border-radius:10px;padding:12px 14px;box-shadow:0 1px 3px #0001}
.card{display:grid;grid-template-columns:230px 1fr 330px;gap:16px}.card img{width:100%;border-radius:8px}
h2{margin:0 0 4px;font-size:20px}.st{display:inline-block;color:#fff;border-radius:5px;padding:1px 8px;font-size:12px;font-weight:700}
table{border-collapse:collapse;width:100%}td{padding:5px 8px;border-top:1px solid #eee;vertical-align:top}td.k{width:170px;font-weight:700;color:#5a5070}
.fo h3{margin:0 0 6px;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:#7a6f8f}.fo li{margin-bottom:6px}
.pf{display:flex;gap:8px;margin-top:10px}.pf span{border:2px solid #2b2340;border-radius:6px;padding:3px 12px;font-weight:700;font-size:13px}
.rules{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.rules b{display:block;font-size:15px;margin-bottom:4px}
'''
cards = ''
for id, name, st, col, vals, folgen in ISL:
    rows = ''.join(f'<tr><td class="k">{e(k)}</td><td>{e(v)}</td></tr>' for k, v in zip(F, vals))
    fol = ''.join(f'<li>{e(x)}</li>' for x in folgen if x)
    pf = '<div class="pf"><span>PASS</span><span>ÄNDERN</span></div>' if st != 'entschieden (D4)' else ''
    cards += f'<div class="box card"><div><h2>{e(name)}</h2><span class="st" style="background:{col}">{e(st)}</span><img src="plan/top_{id}.jpg" style="margin-top:8px">{pf}</div><table>{rows}</table><div class="fo"><h3>Was daraus folgt</h3><ul style="margin:0;padding-left:18px">{fol}</ul></div></div>'
rules = ''.join(f'<div><b>{e(t)}</b>{e(x)}</div>' for t, x in RULES)
page = f'<!doctype html><html lang="de"><head><meta charset="utf-8"><title>Erzählraster</title><style>{CSS}</style></head><body><div class="top"><h1>Erzählraster je Insel</h1><span class="m">vor jeder Platzierung · Pyramide entschieden (D4), Canyon, Bucht, O-Town zur Entscheidung</span></div><div class="wrap">{cards}<div class="box"><div class="rules">{rules}</div></div></div></body></html>'
open(os.path.join(D, 'raster.html'), 'w').write(page)
print('ok')
