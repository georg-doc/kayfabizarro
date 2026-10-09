# Vorschlag: die 8 StreakByte-Demo-Inseln als Satelliten um die vier Hauptinseln (nach MVP).
# Szene → Geschichte (§00, Decks) → Bewohner → Billboard → Lage/Höhe → K2-Faktor → Aufwand. Bilder: docs/biome-sheets/demo/.
import os, html
D = os.path.dirname(os.path.abspath(__file__))
e = html.escape
# MVP world (docs/KFB_MASTERPLAN_MVP_DRIVE_LOOP_R2.md §2): KFB Town in the middle with ring road, three deck islands at different heights
MAIN = [('KFB Town', 0, 0, 0, 80), ('Dystopia', -160, -95, -20, 50), ('Utopia', 165, -70, 12, 50), ('Protopia', 0, 175, 35, 55)]
S = [
 # id, name, deck, card(s), story, residents, billboard, pos(x,z,y), K2 factor + basis, diameter lab, water, effort, effort note
 ('02', 'Fluss-Camp', 'Abenteuer (gesetzt)', '–',
  'Der Hiker zeltet am Fluss. Der freundliche Holzhacker bringt jeden Abend Brennholz, aber nachts fehlt er, und auf dem Felsen heult ein Wolf.',
  'Hiker (KayKit Mystery 5) · Holzhacker = Werwolf als Gestaltwandler (KayKit Mystery 4 „Werewolf“: Werewolf_Man mit Axt ↔ Werewolf_Wolf) · Bär, Hirsch aus der Szene',
  'Wanderschild am Pfad zum Zelt', (-110, 245, 45), '≈ 4 (Auto 0,75 m → Dach 0,8 H)', 48, 'Fluss (fluid.js F2, vorhanden)', 'M', 'Fluss auf F2, zwei neue Figuren ins Register'),
 ('08', 'Holzhacker-Hütte', 'Abenteuer, Teil 2', 'Protopia „The Made Thing“',
  'Die Hütte mit Wassertank hat der Holzhacker selbst gebaut. Tagsüber erntet er Fluff von den Bäumen. Über der Tür hängt ein Kalender, auf dem die Vollmonde angekreuzt sind.',
  'Holzhacker / Werwolf (wie 02) · später: Hiker auf Besuch', 'Holzbrett am Wassertank', (-55, 305, 58), '≈ 2,4 (Hütte 7,35 m → 2 Stockwerke + Dach)', 52, '–', 'S', 'kein Wasser, wenig Teile'),
 ('01', 'Leuchtturm-Hafen', 'Dystopia', '„The Doomsday Clock“ · „The Perpetual Almost“',
  'Der Leuchtturmwärter blinkt Sturmwarnung nach Dienstplan, nicht nach Wetter. Seit Jahren kam kein Sturm, und trotzdem fährt niemand mehr hinaus.',
  'Lorekeeper als Wärter · ein Fischer ohne Boot (Survivalist oder Farmer)', 'Tafel am Steg mit dem Warnstand', (-265, -40, -32), '≈ 5,8 (Haus 2,65 m → 2 Stockwerke); Bank 0,18 m passt nicht', 133, 'Meerkante am Steg (F4, geplant)', 'L', 'Maßstab innerhalb der Szene uneinheitlich, Meer F4'),
 ('05', 'Piratenhöhle', 'Utopia', '„The Roadmap to Eden“ · „The Moving Launch Date“',
  'Die Skelett-Piraten graben seit 300 Jahren nach dem Schatz. Die Karte zeigt jedes Mal ein neues Kreuz, und alle graben weiter.',
  'Skeleton Rogue und Warrior (KayKit Skeletons) · Skeleton Mage als Kapitän', 'Schatzkarte an der Felswand vor der Höhle', (265, -150, 2), '≈ 4 (Autowrack 0,73 m)', 103, 'Meer und Klippenfuß (F4, geplant)', 'L', 'viele Teile, Klippen, Meer'),
 ('04', 'Strandhütte', 'Dystopia', '„The Useful Enemy“',
  'Der Hai ist der Geschäftspartner des Hüttenwirts. Solange er kreist, bleiben alle am Strand und kaufen Limonade.',
  'Survivalist als Wirt (KayKit Mystery 4) · Hai aus der Szene', 'Haiwarnung am Pfahl vor der Hütte', (-215, -205, -26), '≈ 4,6 (Fass 0,29 m, Tisch 0,32 m)', 57, 'Meer und Lagune (F4, geplant)', 'L', 'Strand- und Meerkante F4'),
 ('06', 'Eisland', 'Dystopia', '„The Frozen Watcher“',
  'Ein Schiff steckt im Eis. Der Kapitän verkündet jeden Morgen das Tauwetter, und inzwischen haben die Pinguine das Deck übernommen.',
  'FrostGolem als Kapitän (KayKit Mystery 5) · Pinguine aus der Szene', 'Eisscholle mit Tauwetter-Countdown', (-80, -240, 6), '≈ 5 (Fass 0,24 m)', 142, 'Eissee (F1)', 'M', 'Schneekappen als Knetzungen, Eissee'),
 ('03', 'Food-Truck-Garten', 'Utopia', '„The Pre-Order“ · „The Eternal Soon“',
  'Vor dem Food-Truck „Food Point“ steht seit Tagen eine Schlange für einen Burger, den man nur vorbestellen kann. Ausgabe: „bald“.',
  'Clown als Verkäufer (KayKit Mystery 4) · Protagonist B in der Schlange · Hund aus der Szene', 'Menütafel „Coming Soon“ am Truck', (265, 25, 18), '≈ 1,3 (Stuhl 1,68 m, Tisch 1,2 m)', 27, '–', 'S', 'klein, kein Wasser'),
 ('07', 'Torii-Teich', 'Protopia', '„The Held Breath“ · „The Lower Lung“',
  'Ein Ninja hat das Schwert gegen einen Rechen getauscht und bringt Besuchern bei, langsam zu atmen. Seine besten Schüler sind die Reiher.',
  'Ninja (KayKit Mystery 4) · Reiher aus der Szene', 'Holztafel am Torii', (130, 240, 30), '≈ 2,7 (Bank 1,13 m)', 72, 'Teich und Bach (F1, F2)', 'M', 'Teich und Bach, Kirschfarbe (Atlas ohne Rosa)'),
]
REF = {'01': 'A', '02': 'B', '03': 'D', '04': 'E', '05': 'F', '06': 'G', '07': 'C', '08': 'I'}

def mapsvg():
    W, H, k = 620, 620, 0.85  # lab units → px
    P = lambda x, z: (W / 2 + x * k, H / 2 + z * k)
    out = [f'<rect width="{W}" height="{H}" fill="#eef3f8" rx="10"/>']
    for nm, x, z, y, rr in MAIN:
        cx, cz = P(x, z)
        out.append(f'<circle cx="{cx:.0f}" cy="{cz:.0f}" r="{rr*k:.0f}" fill="#d8c8f0" stroke="#5e4294" stroke-width="2"/><text x="{cx:.0f}" y="{cz+4:.0f}" font-size="13" font-weight="700" text-anchor="middle" fill="#2b2340">{e(nm)}</text><text x="{cx:.0f}" y="{cz+19:.0f}" font-size="10" text-anchor="middle" fill="#5a5070">y {y}</text>')
    for sid, nm, deck, _c, _s, _r, _b, (x, z, y), _f, dia, _w, eff, _n in S:
        cx, cz = P(x, z)
        col = {'Dystopia': '#7a3a5a', 'Utopia': '#d08a2a', 'Protopia': '#2a8a6a'}.get(deck.split(' ')[0], '#3a6ab0')
        r = max(10, dia * 0.35 * k * 0.5)
        out.append(f'<circle cx="{cx:.0f}" cy="{cz:.0f}" r="{r:.0f}" fill="{col}33" stroke="{col}" stroke-width="2" stroke-dasharray="4 3"/><text x="{cx:.0f}" y="{cz-2:.0f}" font-size="12" font-weight="700" text-anchor="middle" fill="{col}">{sid} {e(nm)}</text><text x="{cx:.0f}" y="{cz+12:.0f}" font-size="10" text-anchor="middle" fill="#5a5070">y {y:+d}</text>')
    t0 = P(0, 0); out.append(f'<circle cx="{t0[0]:.0f}" cy="{t0[1]:.0f}" r="{86*k:.0f}" fill="none" stroke="#2b2340" stroke-width="2" stroke-dasharray="6 4"/><text x="{t0[0]:.0f}" y="{t0[1]-80*k:.0f}" font-size="10" text-anchor="middle" fill="#2b2340">Ringstraße</text>')
    a, b = P(-110, 245), P(-55, 305)
    out.append(f'<line x1="{a[0]:.0f}" y1="{a[1]+16:.0f}" x2="{b[0]:.0f}" y2="{b[1]-16:.0f}" stroke="#3a6ab0" stroke-width="3" stroke-dasharray="2 4"/>')
    out.append(f'<text x="12" y="{H-12}" font-size="11" fill="#5a5070">Draufsicht, Norden oben · gestrichelte Kreise grob nach Ø · Farben: Dystopia · Utopia · Protopia · Abenteuer</text>')
    return f'<svg viewBox="0 0 {W} {H}" style="width:100%">{"".join(out)}</svg>'

CSS = '''*{box-sizing:border-box}body{margin:0;width:1600px;font:13px/1.4 system-ui,-apple-system,sans-serif;color:#2b2340;background:#f6f1e8}
.top{display:flex;align-items:center;gap:16px;padding:12px 22px;background:#2b2340;color:#fff}.top h1{margin:0;font-size:22px}.top .m{opacity:.8}
.wrap{padding:12px 18px;display:grid;grid-template-columns:1fr 1fr;gap:12px}.box{background:#fff;border-radius:10px;padding:10px 12px;box-shadow:0 1px 3px #0001}
.full{grid-column:1 / span 2}.card{display:grid;grid-template-columns:250px 1fr;gap:12px}.card img{width:100%;border-radius:8px;display:block}
h2{margin:0 0 2px;font-size:17px}.tag{display:inline-block;border-radius:4px;padding:0 6px;font-size:11px;color:#fff;font-weight:700;margin-right:6px}
.story{font-size:14px;margin:6px 0}.k{color:#5a5070;font-weight:700}.eff{font-weight:800;font-size:15px}.note{font-size:12px;color:#5a5070}
table{border-collapse:collapse;width:100%;font-size:12.5px}td,th{padding:4px 6px;border-top:1px solid #eee;text-align:left;vertical-align:top}th{color:#7a6f8f;font-size:11px;text-transform:uppercase}
.lic{background:#fff1d6;border:2px solid #f0a020}'''
cards = ''
for sid, nm, deck, cardn, story, res, bb, pos, fac, dia, water, eff, en in S:
    col = {'Dystopia': '#7a3a5a', 'Utopia': '#d08a2a', 'Protopia': '#2a8a6a'}.get(deck.split(' ')[0], '#3a6ab0')
    cards += f'''<div class="box card"><div><img src="demo/demo{sid}__overview.jpg"><img src="ref/diorama_{REF[sid]}.jpg" style="margin-top:6px;opacity:.9"><div class="note">oben Nachbau im Lab · unten Referenz {REF[sid]}</div></div>
<div><h2>{sid} · {e(nm)}</h2><span class="tag" style="background:{col}">{e(deck)}</span><span class="note">{e(cardn)}</span>
<div class="story">{e(story)}</div><div><span class="k">Bewohner:</span> {e(res)}</div><div><span class="k">Billboard:</span> {e(bb)}</div>
<div><span class="k">Lage:</span> x {pos[0]}, z {pos[1]}, Höhe y {pos[2]:+d} · <span class="k">K2-Faktor:</span> {e(fac)} → Ø ≈ {dia} Lab-Einheiten</div>
<div><span class="k">Wasser:</span> {e(water)} · <span class="k">Aufwand:</span> <span class="eff">{eff}</span> <span class="note">{e(en)}</span></div></div></div>'''
rows = ''.join(f'<tr><td>{sid} {e(nm)}</td><td>{e(fac)}</td><td>{dia}</td><td>{e(water)}</td><td><b>{eff}</b></td><td>{e(en)}</td></tr>' for sid, nm, deck, cardn, story, res, bb, pos, fac, dia, water, eff, en in S)
body = f'''<div class="box"><h2>Lage um die Hauptinseln</h2>{mapsvg()}<div class="note">MVP-Welt (Masterplan R2 §2): KFB Town in der Mitte mit Ringstraße an der Kante, drei Deck-Inseln in verschiedenen Höhen. Die Demo-Inseln liegen bei ihrem Deck: Hafen, Strand und Eis (Dystopia) tief um Dystopia; Piraten und Food-Truck (Utopia) um Utopia; der Teich und das Abenteuer 02 + 08 (mit Steg) am Wald- und Gebirgsrand der Berg-Insel Protopia, dort am höchsten. Koordinaten schematisch, Stufe nach dem MVP.</div></div>
<div class="box"><h2>Aufwand für die Übernahme ins Lab</h2><table><tr><th>Szene</th><th>K2-Faktor (Bezug)</th><th>Ø Lab</th><th>Wasser</th><th>Aufw.</th><th>Hinweis</th></tr>{rows}</table>
<p class="note"><b>Für alle Szenen:</b>
1 · Maßstab je Szene messen (Tür-, Bank- oder Auto-Regel), die Szenen haben untereinander verschiedene Maßstäbe (Faktor ≈ 1,3–5,8).
2 · Clay K2 auf alle Teile (Materialtausch, klein).
3 · <b>Sprenkel S1</b> statt der harten Polygon-Farbwechsel im Inselboden: Gewichte je Vertex aus den Atlasfarben des Bodens (Gras, Sand, Fels), dann `kfb-speckle` (mittel).
4 · Inselkante nach §01: Die StreakByte-Oberkanten sind facettierte Schnittkanten; Rundung bzw. Sprenkel über die Kante nötig (mittel).
5 · Bewohner aus dem Register bzw. neu aus den KayKit Mystery Series (Hiker, Werewolf, Survivalist, Clown, Ninja, FrostGolem).
6 · Wasser auf fluid.js (F1/F2 vorhanden, F4 Strand/Meer geplant).
S = bis 1 Tag · M = 1–2 Tage · L = 3+ Tage, je mit Kritiker-Runde.</p></div>
{cards}
<div class="box full lic"><b>Lizenz:</b> StreakByte „Low Poly Floating Islands“ steht unter der Unity-Asset-Store-EULA. Die Assets und daraus abgeleitete Szenen-JSON bleiben lokal (Lab, `public/assets/streakbyte/`) bzw. im fertigen, kompilierten Build. Nie roh in ein öffentliches Repo, nie als einzelne Dateien weitergeben.</div>'''
page = f'<!doctype html><html lang="de"><head><meta charset="utf-8"><title>Satelliten-Inseln</title><style>{CSS}</style></head><body><div class="top"><h1>Vorschlag: 8 Demo-Inseln als Satelliten</h1><span class="m">Szene → Geschichte (§00, Decks) → Bewohner → Billboard → Lage → Aufwand · Stufe nach dem MVP</span></div><div class="wrap">{body}</div></body></html>'
open(os.path.join(D, 'satelliten.html'), 'w').write(page)
print('ok')
