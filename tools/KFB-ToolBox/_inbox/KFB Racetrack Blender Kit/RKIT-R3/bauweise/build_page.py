import gen_svgs as G, html
pave, ncut = G.paving_plan()
E = [
 ('Gehweg · Verlegeplan', 'alle Einträge mit Gehweg (A1, A4, B1, B2, B5, D, E)',
  'Die Pflasterer der Stadt legen von der Bordkante aus. Die erste Reihe liegt an der Anlegekante, die Reihen laufen im Läuferverband (halber Versatz). An der Hinterkante, an Verjüngungen und an Enden wird jeder Stein, der nicht passt, mit der Trennscheibe auf die Kante geschnitten. Ein Stein schmaler als ¼ wird nie gelegt: Dann wird der Nachbar länger geschnitten. Zum Schluss setzen sie gerundete Kantensteine an die Schnittkante, davor bleibt etwas Rubbel liegen. Das ist der Fall „gebaute Kante“: Die Stadt hat bis hier gebaut. Läuft ein Weg dagegen frei in die Wiese aus, gilt das nächste Blatt: ein Ende, das verfallen ist.',
  ['Platten 1,6 × 1,6 (¼ MC), Fuge 0,06, vier Töne pro Fläche (so wie in deinem Lob)', 'Passsteine entlang jeder Kante, Fläche lückenlos', 'kein Stück schmaler als 0,4', 'Kantensteine 0,8 lang, gerundet, einzeln gesetzt (keine Linie), Rubbel davor', 'in Kurven: innen Keilschnitt, außen Passstreifen'],
  'flächendeckend: Gehwegfläche = Plattenfläche + Fugen (Abweichung 0) · kleinstes Stück ≥ 0,4 · jede Schnittkante hat Kantenstein', pave),
 ('Gehweg-Ende frei · verfallen', 'Gehweg, Wege, Plätze, die in Wiese oder Gelände auslaufen',
  'Niemand hat dieses Ende gebaut, es ist mit der Zeit zerfallen. Übrig sind ganze große Platten. Die letzten drei treten gestaffelt zurück und bilden zusammen das gerundete Endstück, an den Ecken abgerundet und leicht gekippt. Aus den Stufen dazwischen kommt Rubbel aus denselben Steinen: dicht in den Ecken der Staffel, nach außen auslaufend. Sand liegt nur in den Fugen, nie über den Rand hinaus. Der Übergang ist kurz, eine bis zwei Plattenlängen.',
  ['nur ganze große Platten, keine kleinen Zwischenstücke', 'die letzten drei Platten treten gestaffelt zurück (Endstück)', 'Rubbel in den Stufen, gehäuft, nie in Reihen, nie als Sprühnebel', 'Sand nur in den Fugen, keine sichtbare Bettkante'],
  'kein gerader Rand · kein Rubbel-freier Kantenstreifen · Übergang 1–2 Plattenlängen', G.wegende_frei()),
 ('Bordstein · Höhenwechsel', 'B1, B2, B5, D4, D6, E2',
  'Ein Bord ändert seine Höhe nie im Stein. Die Steinsetzer setzen einen Übergangsstein mit schräger Oberseite (Hochbord 0,35 → Tiefbord 0,08) und lassen den Bord mit einem gerundeten Bordsteinkopf enden. So bauen sie Absenkungen an Furten und Zufahrten und das Ende des Bords am Ortsausgang.',
  ['Bordsteine 1,6, Fuge 0,06, Quader mit gerundeten Kanten (S1-Lehre)', 'Übergangsstein: eine Steinlänge, Oberseite schräg', 'Tiefbord 0,08 bleibt befahrbar', 'Bordsteinkopf: gerundetes Ende, nie ein offener Schnitt', 'in engen Kurven: Kurvensteine 0,8 mit radialen Fugen'],
  'Höhenwechsel nur in Übergangssteinen · jedes Bordende ist ein Bordsteinkopf · keine Steine ohne Gehweg dahinter', G.kerb_elevation()),
 ('B1 · Ortseingang Stadt → Land', 'B1 (gleiches Prinzip B2, B3)',
  'Die Landstraße war zuerst da. Die Stadt hat ihren Teil darauf gebaut und bis zum Ortsschild bezahlt: Gehweg, Bord, Rinne. Am Ortsschild hört ihr Bauwerk auf, und zwar gebaut: Der letzte Straßenablauf nimmt das Wasser aus der Rinne. Der Bord geht über einen Übergangsstein auf Tiefbord und endet mit einem Bordsteinkopf. Der Gehweg endet mit einem 45°-Schnitt mit Passsteinen und Kantenstein. Dahinter beginnt die Wiese und das Kiesbankett der Landstraße. Der Asphalt läuft unverändert durch, denn die Fahrbahn ist ein Guss. Nur loser Kies weht als Punktraster auf den Rand.',
  ['Fahrbahn durchgehend, keine Farbänderung', 'Rinne endet am letzten Straßenablauf', 'Bord: Hochbord → Übergangsstein → 3 Tiefbord → Bordsteinkopf', 'Gehweg: 45°-Schnitt, Passsteine, Kantenstein', 'Kies auf Asphalt: M2-Verwehung (Punktraster, an den Rändern früher), sonst kein Materialübergang', 'Ortsschild-Anker am Gehwegende'],
  'kein Farbverlauf · keine Fläche ohne Bauteil · Kies-Raster nur am Rand (≤ 1,2 breit)', G.ortseingang()),
 ('B5 · Rampenfuß Bande → Stadtbord', 'B5',
  'Am Straßenrand gibt es in der Inselwelt nur zwei Familien: den Bordstein der Stadt und die Joyride-Bande, rot, rund und knetig. Die Bandenbauer setzen ihren Strang bis zu ihrer Grenze. Dort schließen sie die Bande mit einer gebauten Kappe ab, einem gerundeten Wulst ohne Spitze, der halb im Boden sitzt; um ihren Fuß liegt Rubbel. Es folgt ein Grünstreifen. Dann setzt die Stadt einen Bordsteinkopf, den Bord und einen Gehweg, der mit einem 45°-Schnitt, gerundeten Kantensteinen und Rubbel beginnt. Die Fahrbahn läuft durch. Keine Wand, keine Reifen, keine Ebenen übereinander.',
  ['Joyride-Bande als eigenes rundes Bauteil auf Grasbett (Highway-Familie, Radius 0,65)', 'Bandenkopf taucht im ersten Drittel der Zone ab, Rubbel am Austritt', 'Grünstreifen im mittleren Drittel', 'Bordsteinkopf, Bord, Gehweg mit 45°-Anfang, gerundete Kantensteine, Rubbel (letztes Drittel)', 'Randlinie B → S als Keil über 20 (M2)'],
  'Bande ganz abgetaucht, bevor der Bord beginnt (Track Core, test-v015) · keine übereinanderliegenden Ebenen · jedes Ende gerundet mit Rubbel', G.rampenfuss()),
 ('C1 / C2 · Steinbogen aus dem Fels', 'C1, C2 (Georg 08.10.: Steinbogen)',
  'Die Inselleute wollten die Nachbarinsel erreichen (Vorbild: deine Referenz, eine Buckelbrücke mit Rundbogen). In die Felsflanken beider Inseln, etwa 12 unter der Grasnarbe, haben sie je eine Kämpferbank gehauen. Darauf stand ein Lehrbogen aus Holz, auf dem sie den Bogen aus großen Knetquadern gemauert haben; der Schlussstein kam zuletzt. Über dem Bogen tragen Zwickelmauern und Füllung die Fahrbahn, die dem Bogen als leichte Kuppe folgt. Oben läuft eine Steinbrüstung mit Deckplatte. Sie endet auf jeder Insel mit einem Endpfeiler, und Flügelmauern halten dort den Inselboden. Gehweg und Bord laufen über die Brücke durch.',
  ['Kämpfersitze im echten Inselfels (Profile aus dem Lab, rkit_hub), Rubbel und Knetsteinchen davor', 'Rundbogen-Charakter: Stich aus der Tiefe der Kämpfer, Scheitel unter der Fahrbahn', 'eigener Ring aus großen Bogensteinen, Schlussstein größer und vorstehend', 'Zwickel in unregelmäßigen Steinlagen, bündig mit der Brüstung', 'Fahrbahn mit sichtbarem Buckel bis 8 % Steigung (Georg 08.10.), Gehweg und Bord durchgehend', 'Brüstung mit runden Decksteinen', 'Endpfeiler + Flügelmauern auf der Insel, Rand-Band dort ausgespart (Lab)'],
  'Lastweg geschlossen: Fahrbahn → Zwickel → Bogen → Kämpferbank → Fels (Abstand 0) · keine Fläche ohne Tragglied · 0 Pfeiler · Render vorläufig prozedural, die Felsflanken kommen nach dem Lab-Umbau aus den echten Profilen', G.bogen2()),
]
glob = [
 ('Oberflächen-Wechsel (organisch)', 'kfbLayer exakt wie in R2D v0 island.js, Zelle 1,1 und Sand-Bankettband „1 − smoothstep(hw + 0,6, hw + 3,4, d)“ aus R2D, umgerechnet mit × 1,46 (RACE_W: R2D rechnet in Track-Core-Metern, bestätigt von der Steuer-Sitzung), Zelle also ≈ 1,6. Die Schicht „Tropfen zurück“ ist nur in der Übergangszone aktiv. Das Muster ist in eine Bodentextur gebacken (Bake-Regel) und aus den Spielkameras gerendert, ohne Vergrößerung. Ehrlicher Befund Nahaufnahme (Laufhöhe 0,9 H, letztes Bild): Aus der Nähe verschmilzt das Muster zu größeren Flächen mit Tropfen am Rand; als Sprenkel liest es sich erst aus Fahr- und Mittelhöhe. Entscheidung offen: für die Nahsicht eine kleinere Zelle oder eine eigene Punkt-Lage. Stand 09.10.: Georg sucht ein anderes Referenzbeispiel; bis dahin ruht die Arbeit am Muster.', '<div class="pair"><figure><img src="img/r2d_ref.jpg" alt="R2D v0 Referenz: Sand und Gras am Bach"><figcaption>Referenz R2D v0 (Burg-Insel)</figcaption></figure><figure><img src="img/knetflecken_3.jpg" alt="Draufsicht"><figcaption>Draufsicht über ein inselgroßes Stück</figcaption></figure></div><div class="pair"><figure><img src="img/knetflecken_2.jpg" alt="Mittelhöhe"><figcaption>Mittelhöhe</figcaption></figure><figure><img src="img/knetflecken_1.jpg" alt="Fahrhöhe"><figcaption>Fahrhöhe</figcaption></figure></div><div class="pair"><figure><img src="img/knetflecken_4.jpg" alt="Laufhöhe Nahaufnahme"><figcaption>Laufhöhe, Nahaufnahme: verschmilzt zu Flächen</figcaption></figure><figure><img src="img/r2d_ref.jpg" alt="R2D v0 Referenz"><figcaption>Referenz R2D v0</figcaption></figure></div>'),
 ('Linien (nur Markierungen)', 'Eine Linie, die enden muss, zerfällt in ihren Takt: Die Mitte jedes Stücks bleibt auf dem Takt, die Länge fällt linear bis zum Quadrat, dann ist Schluss. Eine Stärkeänderung läuft als Keil über 20, die Außenkante bleibt bündig (M2).', G.takt()),
]
cards = []
LEG = {'Gehweg-Ende frei · verfallen': ('nur ganze Platten, gestaffeltes Endstück aus den letzten drei, Rubbel gehäuft in den Stufen, kurz (1–2 Plattenlängen)', 'genaue Lage und Drehung der Steine (fester Seed in der Welt)'), 'B5 · Rampenfuß Bande → Stadtbord': ('Bande als rundes Bauteil, Kopf taucht ab mit Rubbel, Grünstreifen, Bordsteinkopf, Gehweg mit 45°-Anfang und Kantensteinen; Zonen-Drittel aus dem Track Core', 'Längen der Drittel, Rubbelmenge'), 'Gehweg · Verlegeplan': ('Plattenmaß 1,6 × 1,6, Fuge 0,06, Läuferverband ab Bordkante, Zuschnitt an jeder Kante, Mindeststück 0,4, Kantenstein 0,14 an Schnittkanten', 'Gehwegbreiten und Verziehungslänge (Beispiel), Farben'), 'Bordstein · Höhenwechsel': ('Stein 1,6, Hochbord 0,35, Tiefbord 0,08, Übergangsstein genau ein Stein, Bordsteinkopf an jedem Ende, Reihenfolge', 'Höhen 4-fach überhöht, Farben'), 'B1 · Ortseingang Stadt → Land': ('Bauteile und Reihenfolge: letzter Ablauf, Übergangsstein, 3 Tiefbord, Bordsteinkopf, 45°-Schnitt mit Passsteinen und Kantenstein; Fahrbahn durchgehend', 'Abstände entlang der Straße, Lage des Ortsschilds; der Kies am Rand ist nur angedeutet, er wird organisch (siehe Oberflächen)'), 'B5 · Rampenfuß Bande → Stadtbord': ('Wandkopf + Anpralldämpfer, Grünstreifen ≥ 3,2, Bordsteinkopf, Gehweg mit 45°-Anfang, Randlinie B → S über 20; keine Überlagerung', 'Längen und Form des Wandkopfs'), 'C1 / C2 · Steinbogen aus dem Fels': ('Tragwerk: Kämpfersitz im Fels, eigener Ring aus Bogensteinen mit Schlussstein, Zwickel in Steinlagen, Brüstung mit runden Decksteinen, Endpfeiler + Flügelmauer; Bogenscheitel unter der Fahrbahn; Lastweg bis in den Fels; 0 Pfeiler', 'Inselsilhouette (die echten Felsprofile von rkit_hub kommen vom Lab), Stich und Zahl der Steine (Buckel verbindlich: bis 8 %)')}
RENDERS = {'Gehweg · Verlegeplan': ['verlegeplan_1', 'verlegeplan_2'], 'Gehweg-Ende frei · verfallen': ['wegende_frei_1'], 'Bordstein · Höhenwechsel': ['ortseingang_2'],
  'B1 · Ortseingang Stadt → Land': ['ortseingang_1', 'ortseingang_2'], 'B5 · Rampenfuß Bande → Stadtbord': ['rampenfuss_1', 'rampenfuss_2', 'rampenfuss_3'], 'C1 / C2 · Steinbogen aus dem Fels': ['steinbogen_1', 'steinbogen_2', 'steinbogen_3']}
RCAP = {'verlegeplan_1': 'Verjüngung Stadt → Fahrschule, Schnitt durch das Profil vorn', 'verlegeplan_2': 'Passsteine an der Hinterkante, gerundete Kantensteine, Rubbel-Häufchen', 'wegende_frei_1': 'Freies Ende: gestaffeltes Endstück, kein Sandbett über den Rand, Rubbel aus den Stufen in den Plattentönen',
  'ortseingang_1': 'Ortseingang mit Profilschnitt (dunkle Schnittfläche vorn)', 'ortseingang_2': 'Übergangsstein, 45°-Schnitt mit Passsteinen und Kantensteinen; Sandbett → Wiese in Knetflecken', 'rampenfuss_1': 'Bande (Schnitt vorn) taucht ab, Grünstreifen, Bord beginnt',
  'rampenfuss_2': 'Stadtanfang: Bord als Steinkörper, Gehweg mit 45°-Anfang, Sandbett → Wiese organisch', 'rampenfuss_3': 'Bandenkappe (gerundeter Wulst, keine Spitze), halb im Boden, Rubbel am Fuß; Fahrbahn verzieht sich sauber', 'steinbogen_1': 'Ansicht: Bogenring, Zwickel in Steinlagen, Brüstung mit runden Decksteinen', 'steinbogen_2': 'Schnitt quer durch Fahrbahn, Füllung und Zwickel', 'steinbogen_3': 'Kämpfersitz im Fels mit Rubbel'}
for t, ids, story, parts, test, svg in E:
    li = ''.join(f'<li>{html.escape(p)}</li>' for p in parts)
    rr = ''.join(f'<figure><img src="img/{n}.jpg" alt="{html.escape(RCAP.get(n, n))}" loading="lazy"><figcaption>{html.escape(RCAP.get(n, n))}</figcaption></figure>' for n in RENDERS.get(t, []))
    rblock = f'<div class="r3d">{rr}</div>' if rr else ''
    cards.append(f'<section class="e"><h2>{html.escape(t)}</h2><div class="ids">{html.escape(ids)}</div>{rblock}<div class="grid"><div><h3>Baugeschichte</h3><p>{html.escape(story)}</p><h3>Bauteile</h3><ul>{li}</ul><h3>Prüfung</h3><p class="test">{html.escape(test)}</p></div><div><div class="lp">Lageplan (2D)</div><div class="sk">{svg}</div><div class="leg"><p><b>Verbindlich (Konstruktion):</b> {html.escape(LEG[t][0])}</p><p><b>Schematisch:</b> {html.escape(LEG[t][1])}</p></div></div></div></section>')
gl = ''.join(f'<section class="e"><h2>{html.escape(t)}</h2><p class="col">{html.escape(p)}</p><div class="sk wide">{svg}</div></section>' for t, p, svg in glob)
SCRIPT = ''
page = f'''<title>RKIT R3 Bauweise-Blatt</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Overpass:wght@400;600;800&family=Overpass+Mono:wght@400;600&display=swap">
<style>
/* Layout: one entry per section: story + parts + test on the left, the construction sketch on the right (stacks on phones) */
:root {{ --bg:#f2f0eb; --paper:#fbfaf7; --fg:#23262b; --muted:#5d636b; --line:#d8d4ca; --accent:#c95f27; --accent2:#e3b25c;
  --asphalt:#566680; --kerb:#d9ccb2; --tile:#e7d9c5; --tile2:#d8c6aa; --edge:#9b8a70; --grass:#7fb65a; --gravel:#c9b48c; --wall:#d8c8ae; --wall2:#c4b190;
  --rock:#5a3d66; --void:#bcd6ea; --mark:#f7eedd; --warn:#f2b632; --ok:#2f8a4e;
  --display:"Overpass","Helvetica Neue",Arial,sans-serif; --mono:"Overpass Mono",ui-monospace,Menlo,monospace; }}
@media (prefers-color-scheme: dark) {{ :root:not([data-theme="light"]) {{ --bg:#1b1d21; --paper:#23262b; --fg:#e9e6df; --muted:#a6abb2; --line:#3a3e45; --void:#2e4458; color-scheme:dark }} }}
:root[data-theme="dark"] {{ --bg:#1b1d21; --paper:#23262b; --fg:#e9e6df; --muted:#a6abb2; --line:#3a3e45; --void:#2e4458; color-scheme:dark }}
body {{ background:var(--bg); color:var(--fg); font-family:var(--display); font-size:15.5px; line-height:1.58; }}
.wrap {{ max-width:1200px; margin:0 auto; padding-inline:18px; padding-block:26px 64px; }}
h1 {{ font-size:clamp(28px,4.4vw,42px); font-weight:800; margin:0; text-wrap:balance; }}
.eyebrow {{ font-family:var(--mono); font-size:12.5px; letter-spacing:.06em; text-transform:uppercase; color:var(--muted); }}
.chips {{ display:flex; flex-wrap:wrap; gap:8px; margin:14px 0; }} .chip {{ font-family:var(--mono); font-size:12.5px; padding:3px 10px; border:1.5px solid currentColor; border-radius:3px; }}
.chip.a {{ color:var(--accent) }} .chip.m {{ color:var(--muted) }}
.col, .lede {{ max-width:760px; }} .lede {{ font-size:17px; }}
.q {{ border-left:4px solid var(--accent); background:var(--paper); padding:10px 16px; margin:16px 0; max-width:820px; }}
.e {{ margin-top:38px; padding-top:14px; border-top:3px solid var(--fg); }}
.e h2 {{ margin:0; font-size:22px; font-weight:800; }} .ids {{ font-family:var(--mono); font-size:12.5px; color:var(--muted); margin-top:2px; }}
.e h3 {{ font-size:13px; font-family:var(--mono); letter-spacing:.05em; text-transform:uppercase; color:var(--muted); margin:14px 0 4px; }}
.grid {{ display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1.25fr); gap:22px; align-items:start; }}
@media (max-width:820px) {{ .grid {{ grid-template-columns:1fr }} }}
.e p {{ margin:4px 0; }} .e ul {{ margin:4px 0; padding-left:18px; }} .test {{ font-family:var(--mono); font-size:13px; }}
.sk {{ background:var(--paper); border:1px solid var(--line); border-radius:4px; padding:10px; overflow-x:auto; }}
.sk svg {{ display:block; width:100%; height:auto; min-width:520px; }} .sk.wide svg {{ min-width:640px }} .sk canvas {{ display:block; width:100%; height:auto; margin:6px 0; border-radius:3px }} .leg {{ font-size:13.5px; margin-top:8px; }} .r3d {{ display:grid; grid-template-columns:repeat(auto-fit,minmax(320px,1fr)); gap:10px; margin:12px 0 4px; }}
.r3d figure, .pair figure {{ margin:0; min-width:0 }} .r3d img, .pair img {{ display:block; width:100%; height:auto; border-radius:4px; border:1px solid var(--line) }}
.r3d figcaption, .pair figcaption {{ font-family:var(--mono); font-size:12px; color:var(--muted); margin-top:4px }} .pair {{ display:grid; grid-template-columns:1fr 1fr; gap:10px; margin:8px 0 }}
.lp {{ font-family:var(--mono); font-size:12px; letter-spacing:.05em; text-transform:uppercase; color:var(--muted); margin:4px 0 }} .leg p {{ margin:3px 0 }}
svg text {{ font-family:var(--mono); fill:#23262b; paint-order:stroke; stroke:#fbfaf7; stroke-width:3px; }} svg .t-muted {{ fill:#5d636b }} svg .t-acc {{ fill:#c95f27 }}
</style>
<div class="wrap">
<div class="eyebrow">KFB Racetrack Construction Kit R3 · Bauweise-Blatt zu Katalog v3 · 08.10.2026</div>
<h1>Bauweise-Blatt: wer baut was, womit, warum</h1>
<div class="chips"><span class="chip a" style="color:var(--ok)">FREIGEGEBEN: Georg PASS am 09.10. (Version 7, „auch mit Rubbel-Eiern“)</span><span class="chip m">TUNE später: Rubbel am freien Wegende sichtbar aus den Platten gebrochen</span><span class="chip m">Atlas v0.15: FAIL (Georg)</span><span class="chip m">Regelwerk §00 „Weltlogik zuerst“, U8</span></div>
<p class="lede"><b>Darstellung (QA R1 §1):</b> Jedes Bauteil steht oben als 3D-Render in Knet-Material aus den Track-Core-Körpern, mit Schnitt durch das Profil (dunkle Schnittfläche). Die 2D-Skizze daneben ist nur der Lageplan.</p>
<p class="lede"><b>Lesehilfe:</b> Unter jeder Skizze steht, was verbindlich ist (Bauteile, Maße, Reihenfolge, wer was berührt) und was nur schematisch gezeichnet ist (Silhouetten, Längen, Farben). Gebaut wird das Verbindliche.</p>
<p class="lede">Der Atlas v0.15 hat Anforderungen erfüllt, aber nichts gebaut. Hier steht für jeden Katalog-Eintrag zuerst die Baugeschichte in der Inselwelt, dann die Bauteile, die daraus folgen, dann die Prüfung. Gebaut wird nur, was sich so erzählen lässt.</p>
<div class="q"><b>Grundregel §01 (Georg, 09.10.):</b> Keine harten Schnitte, keine sichtbaren Kanten. Auch gebaute Enden (Kantenstein, Bordsteinkopf, Wandkopf, Reifenstapel, Portal) sind gerundete Knet-Bauteile, die mit Rubbel oder Knetflecken in ihrer Umgebung sitzen.</div>
<div class="q"><b>Georg, 08.10.:</b> „…wie das ein Fliesenleger oder ein Straßenarbeiter machen würde.“ Ab jetzt gilt für jedes Element die Frage nach §00: Wer hat es gebaut oder wachsen lassen, womit, warum, und was erzählt es?</div>
{''.join(cards)}
{gl}
<section class="e"><h2>Was sich gegenüber v0.15 ändert</h2><ul class="col">
<li>Track Core liefert pro Übergang einen <b>Bauplan</b> (Bauteile mit Station: Übergangsstein bei s, Bordsteinkopf bei s, Schnittlinie, Ablauf, Wandkopf, Kämpferbank) statt eines Farb- und Formverlaufs.</li>
<li>Der Gehweg wird als <b>Verlegeplan</b> berechnet: Raster ab Bordkante, Zuschnitt an jeder Kante, Mindeststück 0,4. Das zeigt die Skizze oben ({ncut} geschnittene Steine an einer Verjüngung).</li>
<li>Körper der Straße bleiben eine Form, aber ein Familienwechsel heißt künftig: <b>ein Bauwerk endet, das andere beginnt</b>. Keine Rauschflecken und kein Körper, der in einen anderen übergeht.</li>
<li>Brücke: Steinbogen mit Kämpferbänken im <b>echten Fels</b> von <code>rkit_hub</code> (Profile kommen vom Lab).</li>
<li>Prüfung: harte Regeln plus Kritiker mit U8 „Innerweltliche Baulogik“ (≥ 7). Du siehst erst Bestandenes oder einen Stopp-Bericht.</li>
</ul></section>
{SCRIPT}
</div>'''
open('index.html', 'w').write(page); print(len(page), ncut)
