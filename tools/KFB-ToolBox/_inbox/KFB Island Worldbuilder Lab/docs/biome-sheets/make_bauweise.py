# Bauweise-Blatt „Wie liegt was in der Landschaft“ (QA_RULEBOOK_ENVIRONMENT_R1 §00, §0b, H1/H8/H12):
# je Objektart Geschichte → Lage (Physik) → Geländeform für field.addEmbed → Saum nach Ursache → Nicht.
# Schnittzeichnungen als SVG: Hang fällt nach rechts ab (bergauf links).
# python3 docs/biome-sheets/make_bauweise.py && node docs/biome-sheets/render_bauweise.mjs
import os, html, math
D = os.path.dirname(os.path.abspath(__file__))
e = html.escape

W, Hh = 360, 170
def ground(y0=110, slope=0.12, x0=0, x1=W):
    return y0, slope
def gy(x, y0=110, slope=0.12):
    return y0 + (x - W / 2) * slope

def svg(parts, title=''):
    return f'<svg viewBox="0 0 {W} {Hh}" style="width:100%;background:#eef3f8;border-radius:8px">{"".join(parts)}<text x="8" y="16" font-size="11" fill="#5a5070" stroke="#eef3f8" stroke-width="4" paint-order="stroke">{e(title)}</text><text x="8" y="{Hh-6}" font-size="10" fill="#7a6f8f">bergauf</text><text x="{W-52}" y="{Hh-6}" font-size="10" fill="#7a6f8f">bergab →</text></svg>'

def terrain_poly(f):
    pts = [(x, f(x)) for x in range(0, W + 1, 4)]
    return '<path d="M' + ' L'.join(f'{x},{y:.1f}' for x, y in pts) + f' L{W},{Hh} L0,{Hh} Z" fill="#9f86d4"/>' + \
           '<path d="M' + ' L'.join(f'{x},{y:.1f}' for x, y in pts) + '" fill="none" stroke="#5e4294" stroke-width="2"/>'

def bump(x, c, w, h):
    d = (x - c) / w
    return h * math.exp(-d * d)

def tufts(xs, f, col='#5c8a5a', s=1.0):
    out = ''
    for x in xs:
        y = f(x)
        for k in (-1, 0, 1):
            out += f'<path d="M{x},{y} q{k*3*s},{-9*s} {k*5*s},{-12*s}" stroke="{col}" stroke-width="2.2" fill="none" stroke-linecap="round"/>'
    return out

def pebbles(items, f, col='#d0602e'):
    return ''.join(f'<ellipse cx="{x}" cy="{f(x)-r*0.6:.1f}" rx="{r}" ry="{r*0.7:.1f}" fill="{col}" stroke="#7a3a1a" stroke-width="1"/>' for x, r in items)

def sink_line(x0, x1, y, label):
    return f'<line x1="{x0}" y1="{y}" x2="{x1}" y2="{y}" stroke="#2b2340" stroke-dasharray="4 3"/><text x="{x1+4}" y="{y+4}" font-size="10" fill="#2b2340">{e(label)}</text>'

# ---- Findling ----
def s_findling():
    c = 170
    f = lambda x: gy(x) - bump(x, c - 38, 26, 16) - bump(x, c + 30, 30, 5)  # Erdkeil bergauf, kleiner Schleppenansatz bergab
    rock = f'<path d="M{c-62},{gy(c-62)+16} Q{c-70},{gy(c)-38} {c-20},{gy(c)-62} Q{c+30},{gy(c)-70} {c+56},{gy(c)-30} Q{c+66},{gy(c)+2} {c+52},{gy(c+52)+14} Z" fill="#e8743a" stroke="#8a3a14" stroke-width="2"/>'
    parts = [rock, terrain_poly(f), f'<path opacity="1" d="M{c-62},{gy(c-62)+16} Q{c-70},{gy(c)-38} {c-20},{gy(c)-62} Q{c+30},{gy(c)-70} {c+56},{gy(c)-30} Q{c+66},{gy(c)+2} {c+52},{gy(c+52)+14}" fill="none" stroke="#8a3a14" stroke-width="2" stroke-dasharray="3 3"/>']
    parts += [tufts([c - 52, c - 46, c - 40], f), tufts([c + 50], f, s=0.8), pebbles([(c + 70, 5), (c + 84, 3.5), (c + 96, 2.5), (c + 104, 2), (c + 116, 1.6)], f)]
    parts.append(sink_line(c - 60, c + 54, gy(c) + 14, ''))
    parts.append(f'<text x="{c-56}" y="{gy(c)+30}" font-size="10" fill="#fff">verborgener Teil ≈ 40 % (gestrichelt)</text>')
    return svg(parts, 'Schnitt: Findling')

def s_mesa():
    c = 160
    f = lambda x: gy(x, 132, 0.1) - bump(x, c - 46, 22, 10) - bump(x, c + 52, 40, 14)
    mesa = f'<path d="M{c-40},{gy(c-40,132,.1)+18} L{c-34},{gy(c,132,.1)-86} L{c+26},{gy(c,132,.1)-92} L{c+38},{gy(c,132,.1)-54} L{c+46},{gy(c+46,132,.1)+18} Z" fill="#e8743a" stroke="#8a3a14" stroke-width="2"/>'
    parts = [mesa, terrain_poly(f), pebbles([(c + 52, 4), (c + 64, 3), (c + 76, 3.5), (c + 90, 2.5), (c + 104, 2), (c + 118, 1.6), (c + 58, 2.2)], f), tufts([c - 54, c - 60], f), tufts([c - 4, c + 10], lambda x: gy(c, 132, .1) - 91, s=0.7)]
    parts.append(sink_line(c - 30, c + 52, gy(c, 132, .1) + 12, 'Sockel ≈ 20 %'))
    return svg(parts, 'Schnitt: Mesa / Felsformation mit Schutthalde')

def s_rand():
    parts = []
    lip = 230
    top = lambda x: 70 + (x - lip) * 0.03 if x < lip else 70 + (x - lip) * 1.6
    body = f'<path d="M0,70 L{lip},70 Q{lip+18},74 {lip+22},92 L{lip+10},150 L{lip-40},{Hh} L0,{Hh} Z" fill="#c8743a"/>'
    rock = f'<path d="M{lip-58},74 Q{lip-62},34 {lip-24},26 Q{lip+12},22 {lip+20},52 Q{lip+26},86 {lip+14},120 L{lip-30},128 Z" fill="#e8743a" stroke="#8a3a14" stroke-width="2"/>'
    grass = f'<path d="M0,70 L{lip-56},70 Q{lip-50},64 {lip-46},58" fill="none" stroke="#7b5bb8" stroke-width="7"/>'
    parts += [body, rock, f'<rect x="0" y="62" width="{lip-58}" height="10" fill="#8b68c7"/>', grass, tufts([lip - 60, lip - 66, lip - 72], lambda x: 66)]
    parts.append(f'<text x="{lip-150}" y="100" font-size="10" fill="#fff">Inselkörper (Unterseite)</text><text x="{lip-40}" y="146" font-size="10" fill="#2b2340">Fels wächst aus dem Körper</text>')
    return f'<svg viewBox="0 0 {W} {Hh}" style="width:100%;background:#eef3f8;border-radius:8px">{"".join(parts)}<text x="8" y="16" font-size="11" fill="#7a6f8f">Schnitt: Randfels an der Inselkante</text></svg>'

def s_strauch():
    c = 175
    f = lambda x: gy(x, 112, 0.08) - bump(x, c, 70, 3)
    shade = f'<ellipse cx="{c+8}" cy="{gy(c,112,.08)+1}" rx="70" ry="5" fill="#3d2a66" opacity="0.45"/>'
    bush = f'<path d="M{c-58},{gy(c-58,112,.08)+4} Q{c-62},{gy(c,112,.08)-46} {c},{gy(c,112,.08)-58} Q{c+62},{gy(c,112,.08)-46} {c+60},{gy(c+60,112,.08)+4} Z" fill="#2f8a45" stroke="#1f5a2e" stroke-width="2"/>'
    parts = [terrain_poly(f), shade, bush, tufts([c - 62, c - 56, c + 64], f), f'<text x="{c-50}" y="{gy(c,112,.08)+22}" font-size="10" fill="#fff">dunkler Boden unter der Tropfkante</text>']
    return svg(parts, 'Schnitt: Strauch wächst heraus')

def s_baum():
    c = 175
    f = lambda x: gy(x, 132, 0.08) - bump(x, c, 22, 7) - bump(x, c + 16, 16, 2)
    shade = f'<path d="M{c-80},{f(c-80)} Q{c},{f(c)+10} {c+90},{f(c+90)}" fill="none" stroke="#3d2a66" stroke-width="5" opacity="0.4"/>'
    trunk = f'<path d="M{c-22},{f(c-22)+3} Q{c-9},{f(c)-14} {c-8},{f(c)-62} L{c+8},{f(c)-62} Q{c+10},{f(c)-14} {c+24},{f(c+24)+3} Z" fill="#8a5a3a" stroke="#4a2a18" stroke-width="2"/>'
    crown = f'<ellipse cx="{c}" cy="{f(c)-88}" rx="70" ry="30" fill="#2f8a45" stroke="#1f5a2e" stroke-width="2"/>'
    fl = ''.join(f'<circle cx="{c+dx}" cy="{f(c)-88+dy*0.7}" r="6" fill="#f2b632" stroke="#a87a10"/>' for dx, dy in [(-40, 18), (22, 26), (50, 4), (-10, -8)])
    fall = f'<circle cx="{c+70}" cy="{f(c+70)-6}" r="6" fill="#f2b632" stroke="#a87a10"/><path d="M{c+48},{f(c)-70} q14,30 22,{f(c+70)-f(c)+58}" fill="none" stroke="#a87a10" stroke-dasharray="3 3"/>'
    parts = [terrain_poly(f), shade, trunk, crown, fl, fall, tufts([c - 82, c - 74, c + 84, c + 92], f), tufts([c - 26, c + 28], f, s=0.7)]
    return svg(parts, 'Schnitt: Baum mit Wurzelanlauf, Fluff in der Krone')

def s_gras():
    f = lambda x: gy(x, 104, 0.06) - bump(x, 90, 40, -10) - bump(x, 260, 30, 8)
    parts = [terrain_poly(f), tufts([70, 78, 84, 92, 100, 106, 112], f), tufts([150, 200], f, s=0.8), tufts([236, 300], f, s=0.6)]
    parts.append('<text x="56" y="150" font-size="10" fill="#fff">Senke: dicht, lang</text><text x="232" y="150" font-size="10" fill="#fff">Kuppe: kurz, lichter</text>')
    return svg(parts, 'Schnitt: Bodendecker folgt dem Wasser')

def s_requisit():
    f = lambda x: gy(x, 116, 0.05)
    c = 180
    pot = f'<path d="M{c-18},{f(c)} Q{c-26},{f(c)-30} {c-10},{f(c)-44} L{c+10},{f(c)-44} Q{c+26},{f(c)-30} {c+18},{f(c)} Z" fill="#f2b632" stroke="#a87a10" stroke-width="2"/>'
    parts = [terrain_poly(f), f'<ellipse cx="{c}" cy="{f(c)+1}" rx="22" ry="3.5" fill="#2b2340" opacity="0.5"/>', pot, f'<text x="{c+30}" y="{f(c)-20}" font-size="10" fill="#2b2340">liegt auf, kurzer Kontaktschatten</text>']
    return svg(parts, 'Schnitt: Requisit')

def s_fluff():
    f = lambda x: gy(x, 112, 0.14) - bump(x, 250, 34, -12)
    parts = [terrain_poly(f)]
    path = [(70, 40), (96, f(96) - 6), (120, f(120) - 26), (150, f(150) - 6), (176, f(176) - 14), (204, f(204) - 6), (236, f(236) - 6), (252, f(252) - 6)]
    parts.append('<path d="M' + ' L'.join(f'{x},{y:.0f}' for x, y in path) + '" fill="none" stroke="#a87a10" stroke-dasharray="3 3"/>')
    parts += [f'<circle cx="{x}" cy="{y:.0f}" r="6" fill="#f2b632" stroke="#a87a10"/>' for x, y in [path[0], path[-1]]]
    parts.append(f'<circle cx="262" cy="{f(262)-6:.0f}" r="5" fill="#ef7a4f" stroke="#a04020"/><text x="196" y="{f(250)+20:.0f}" font-size="10" fill="#fff">sammelt sich in der Mulde</text>')
    return svg(parts, 'Fluff-Fallobst: fällt, springt, rollt bergab')

TYPES = [
 ('Findling / Fels', s_findling(), 'inventory/inv__item18.jpg', 'KayKit Rock_3_E',
  'Er lag schon hier, bevor etwas wuchs: vom Hügel gerollt oder aus dem Boden gewittert. Er ist schwer und liegt lange.',
  'Steckt tief: 35–50 % unter dem Gelände. Längsachse quer zum Hang, flache Seite nach oben. Das Gelände läuft an ihm hoch, die sichtbare Form ist die Spitze eines größeren Körpers.',
  'kind <b>boulder</b> · sink 0,35–0,5 h · rise 0,1–0,2 h bergauf (Erdkeil, konkave Kehle) · falloff 0,6–1,0 r · downhill 0,7: bergauf tiefer eingebettet, bergab etwas freier',
  'Bergauf im Erdkeil ein großes Grasnest (die Kehle hält Wasser und Erde), dazu ein kleines Nest in einer Kerbe. Bergab ein Fächer aus Bröckeln, die vom Fels abgeplatzt sind: 1 mittel, 3–5 klein, nach außen kleiner. Kein Ring.',
  'Nicht kugelig auflegen, nicht drehen, bis die Form „passt“, keine Blümchen ringsum.'),
 ('Mesa / Felsformation', s_mesa(), 'inventory/inv__item49.jpg', 'Kenney rock_tallA',
  'Der Fels der Insel selbst: Regen hat das weiche Erdreich abgetragen, der harte Kern steht heraus.',
  'Wurzelt im Inselkörper: Sockel 15–25 % im Boden. Am Fuß eine Schutthalde aus dem, was oben abbricht.',
  'kind <b>outcrop</b> · sink 0,15–0,25 h · rise 0,1–0,15 h als Schutthalde · falloff 1,0–1,5 r · downhill 0,8: Halde bergab lang ausgezogen',
  'Bröckel in der Halde bergab, von groß am Fuß zu klein außen. Gras nur auf flachen Absätzen oben und bergauf am Fuß. Fraktal: eine Mesa, zwei kleinere Felsnasen, viele Brocken.',
  'Keine geschnittenen Kachel-Blöcke, kein flacher Sockel, der sichtbar auf dem Gras steht.'),
 ('Randfels', s_rand(), 'inventory/inv__item21.jpg', 'KayKit Rock_3_N',
  'Wo die Insel abgebrochen ist, liegt ihr Fels frei: Der Randfels gehört zum Inselkörper, er ist nicht hingelegt.',
  'Er sitzt in der Kante und setzt sich in die Unterseite fort. Höchstens ein kleiner Überstand; nie ein Block auf der Lippe, der herunterfallen müsste (H12). Farbe wie die Unterseite.',
  'kind <b>rim</b> · sink bis unter die Grasnarbe · Grasband rollt auf den Fels · Lab: Kante und Unterseite nehmen ihn auf (Hook am Rand)',
  'Gras nur oben, wo das Grasband auf den Fels läuft. Keine Bröckel auf der Lippe.',
  'Keine freistehenden Brocken auf der Kante, keine Blöcke mit Schnittflächen.'),
 ('Strauch', s_strauch(), 'inventory/inv__item12.jpg', 'KayKit Bush_1_D',
  'Er ist aus dem Boden gewachsen; seine Zweige hängen bis auf die Erde.',
  'Kein sichtbarer Fuß: Die Unterkante liegt im Boden (10–20 %), darunter ist es dunkel. Kein Anstieg, das Gelände bleibt.',
  'kind <b>shrub</b> · sink 0,1–0,2 h · rise 0 · Bodenfarbe unter der Tropfkante dunkler (Schatten, Feuchte)',
  'Bodendecker auf der Sonnenseite unter der Kante, 1–2 Nester, die unter den Rand greifen. Schattenseite kahl.',
  'Kein Ball auf dem Boden, kein Grasring.'),
 ('Baum', s_baum(), 'inventory/inv__item0.jpg', 'KayKit Tree_1_A',
  'Er ist hier aufgewachsen; seine Wurzeln haben die Erde am Stamm angehoben. In der Krone wächst Fluff.',
  'Stamm geht in einen Wurzelanlauf über: Gelände 3–6 % der Höhe angehoben, innerhalb 1,5 Stammradien, bergab etwas länger. Unter der Krone dunklerer, kahlerer Boden.',
  'kind <b>tree</b> · sink 0,03–0,05 h · rise 0,03–0,06 h · falloff 1,5 Stammradien · downhill 0,3',
  'Gras dünn unter der Krone, dicht an der Tropfkante (dort kommt Licht und Regen hin). 1–2 Nester zwischen den Wurzelansätzen. Fluff-Fallobst sammelt sich bergab unter der Krone.',
  'Kein gebasteltes Totholz, keine kleinteiligen Äste. Totes Holz nur als ganzes Kit-Modell, wo die Geschichte es trägt.'),
 ('Bodendecker / Gras', s_gras(), 'inventory/inv__item30.jpg', 'Tiny Treats grass_A',
  'Gras wächst, wo Wasser und Erde sich halten.',
  'Folgt dem Gelände: dicht und lang in Senken, am Teichufer, im Windschatten von Fels und Busch; kurz und licht auf Kuppen; nie auf dem Weg, dicht am Wegrand.',
  'kein Embed · braucht <b>unebenen Boden</b>: Lab-Gelände mit leichtem Kleinrelief (Mulden und Kuppen) unter den Gruppen',
  'Fraktal: großes Nest, zwei mittlere, viele kleine Büschel, mit Lücken dazwischen. Kurz, lang und büschelig gemischt.',
  'Kein gleichmäßiger Teppich, keine Einzelhalme.'),
 ('Requisit', s_requisit(), None, 'Krug, Kiste, Ball …',
  'Jemand hat es hingestellt oder liegen lassen.',
  'Liegt auf: kleine Kontaktfläche, kurzer, dunkler Kontaktschatten, höchstens 0–3 % Abdruck.',
  'kind <b>prop</b> · sink 0–0,03 h · rise 0',
  'Kein Gras darüber; Spuren erzählen, wer es gebracht hat (Weg, Platz).',
  'Nicht eingraben, als sei es gewachsen.'),
 ('Fluff (Ernte)', s_fluff(), None, 'Kugel in Biom-Farbe',
  'Fluff wächst als bunte Kugel an Bäumen und Sträuchern. Die Farmen ernten ihn (Rohstoff, passt zur Fluff-Masse der Zellen-Grammatik). Reife Kugeln fallen als Fallobst, springen und rollen.',
  'Am Baum: in der Krone, an der Lichtseite, 3–6 je Anker, 1–2 je Strauch. Am Boden: fällt, springt 2–3 Mal, rollt bergab und bleibt in Mulden oder an Hindernissen liegen. Aufsammeln durch Drüberlaufen (Spieler und NPCs).',
  'kein Embed · liegt auf · Farbe aus der Biom-Palette (Blüte/Akzent, s. Farb-Grammatik)',
  'Fallobst sammelt sich unter der Krone bergab und in der nächsten Mulde, nicht verstreut über die Insel. Technik: einfacher Sprung-und-Roll-Integrator am Gelände, keine Physik-Engine; Ernte durch Farmen = NPC-Activities (Blender-Coworker).',
  'Kein Fluff ohne Herkunft: jede Kugel am Boden liegt unter oder bergab von einem Fluff-Baum.'),
]

cards = ''
for name, sv, img, model, story, lage, embed, saum, nicht in TYPES:
    pic = f'<img src="{img}" style="width:100%;height:120px;object-fit:cover;object-position:50% 70%;border-radius:8px">' if img else '<div style="height:120px;border-radius:8px;background:#f2ead8;display:flex;align-items:center;justify-content:center;color:#7a6f8f">kein Kit-Modell nötig</div>'
    cards += f'''<div class="box card"><div class="h"><h3>{e(name)}</h3><span class="note">{e(model)}</span></div>
<div class="row"><div>{sv}</div><div>{pic}</div></div>
<p><b>Geschichte:</b> {e(story)}</p><p><b>Lage:</b> {e(lage)}</p><p class="emb"><b>Gelände (field.addEmbed):</b> {embed}</p><p><b>Saum nach Ursache:</b> {e(saum)}</p><p class="no"><b>Nicht:</b> {e(nicht)}</p></div>'''

FRACT = '''<svg viewBox="0 0 760 150" style="width:100%"><g font-size="11" fill="#2b2340">
<text x="10" y="16" font-weight="700">Insel</text><circle cx="70" cy="80" r="44" fill="#d8f0e0"/><circle cx="160" cy="70" r="30" fill="#d8f0e0"/><circle cx="210" cy="110" r="18" fill="#d8f0e0"/><text x="40" y="140">2–4 Gruppen, groß → klein</text>
<path d="M250,80 L300,80" stroke="#2b2340" marker-end="url(#ar)"/>
<text x="310" y="16" font-weight="700">Gruppe</text><circle cx="370" cy="80" r="30" fill="#2f8a45"/><circle cx="420" cy="62" r="18" fill="#5fb84a"/><circle cx="415" cy="104" r="14" fill="#5fb84a"/><circle cx="448" cy="90" r="7" fill="#e8743a"/><text x="330" y="140">Anker · 2–3 Stützen · Akzent</text>
<path d="M480,80 L530,80" stroke="#2b2340" marker-end="url(#ar)"/>
<text x="540" y="16" font-weight="700">Fuß</text><ellipse cx="600" cy="84" rx="26" ry="12" fill="#6e8a6a"/><ellipse cx="640" cy="98" rx="14" ry="7" fill="#6e8a6a"/><ellipse cx="652" cy="70" rx="12" ry="6" fill="#6e8a6a"/><circle cx="676" cy="92" r="3" fill="#6e8a6a"/><circle cx="688" cy="80" r="2.5" fill="#6e8a6a"/><circle cx="694" cy="100" r="2" fill="#6e8a6a"/><text x="560" y="140">1 Nest · 2 mittlere · viele kleine, Lücken</text>
<defs><marker id="ar" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#2b2340"/></marker></defs></g></svg>'''

CSS = '''*{box-sizing:border-box}body{margin:0;width:1600px;font:13px/1.4 system-ui,-apple-system,sans-serif;color:#2b2340;background:#f6f1e8}
.top{display:flex;align-items:center;gap:16px;padding:12px 22px;background:#2b2340;color:#fff}.top h1{margin:0;font-size:22px}.top .m{opacity:.8}
.top .pf{margin-left:auto;display:flex;gap:10px}.pf span{border:2px solid #fff;border-radius:6px;padding:4px 14px;font-weight:700}
.wrap{padding:12px 18px;display:grid;grid-template-columns:1fr 1fr;gap:12px}.box{background:#fff;border-radius:10px;padding:10px 12px;box-shadow:0 1px 3px #0001}
.full{grid-column:1 / span 2}.card .h{display:flex;align-items:baseline;gap:10px}h3{margin:0 0 6px;font-size:16px}h2{font-size:12px;letter-spacing:.06em;text-transform:uppercase;margin:0 0 6px;color:#7a6f8f}
.row{display:grid;grid-template-columns:1.6fr 1fr;gap:10px;align-items:center}.card p{margin:6px 0}.emb{background:#efe8ff;border-radius:6px;padding:4px 8px}.no{color:#a03a3a}.note{font-size:12px;color:#5a5070}
'''
RULES = [
 ('1 · Ursache statt Ring', 'Jedes Saum-Element hat eine Ursache und liegt dort, wo sie wirkt: Wasser (Kehle bergauf, Senke, Ufer), Schatten (Tropfkante, Schattenseite kahl), Schwerkraft (Bröckel- und Fallobst-Fächer bergab), Wind (Lee). Nie ein gleichmäßiger Kranz.'),
 ('2 · Häufen statt verteilen', 'Wuchs breitet sich von einer Quelle aus: 1–3 Nester je Objekt, dicht innen, nach außen lichter, mit bewusstem Negativraum dazwischen. Keine Einzelstreuung, keine Poisson-Teppiche.'),
 ('3 · Gras beschreibt die Form', 'Büschel folgen der Fußlinie und dem Hang, lehnen vom Objekt weg und hangabwärts, sind in der Kehle lang und auf der Kuppe kurz. Kurz, lang und büschelig gemischt; Halme in alle Richtungen.'),
 ('4 · Rule of Three, fraktal', 'Dieselbe Staffel auf jeder Ebene: Insel (2–4 Gruppen) → Gruppe (Anker, 2–3 Stützen, Akzent) → Fuß (ein großes Nest, zwei mittlere, viele kleine). Mengen etwa 1 : 3 : 9, Größe nimmt nach außen ab.'),
 ('5 · Wenige Arten', 'Je Biom 2–3 tragende Arten und 1–2 Akzente; je Gruppe ein Kit. Abwechslung über Größe, Drehung und Variante derselben Art, nicht über immer neue Arten.'),
 ('6 · Unebener Boden, kein Bastelkram', 'Das Gelände hat Kleinrelief (Mulden, Kuppen) unter den Gruppen, vom Lab. Totes Holz und Äste nur als ganzes Kit-Modell, wo die Geschichte es trägt; nichts Kleinteiliges gebastelt.'),
]
rules = ''.join(f'<div><b>{e(t)}</b><div class="note" style="margin-top:3px">{e(x)}</div></div>' for t, x in RULES)
head = f'''<div class="box full"><h2>Regeln für Saum und Komposition (gelten für jede Objektart unten)</h2><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px 18px">{rules}</div></div>
<div class="box full" style="display:grid;grid-template-columns:1.2fr 1fr;gap:14px"><div><h2>Grundsatz</h2><div style="font-size:15px">Jedes Objekt liegt so, wie seine Geschichte und seine Physik es verlangen. Daraus folgen die Tiefe im Gelände, die Form des Geländes und wo der Saum entsteht. Saum-Elemente haben eine Ursache: Wasser, Schatten, Schwerkraft, Wind. Sie bilden nie einen Ring. Das Gelände verformt sich selbst (Lab-Hook <code>field.addEmbed</code>), es gibt keine aufgeklebten Erdhügel. Totes Holz nur als ganzes Kit-Modell, wo die Geschichte es trägt, nie kleinteilig gebastelt.</div></div>
<div><h2>Rule of Three, fraktal</h2>{FRACT}</div></div>'''
page = f'<!doctype html><html lang="de"><head><meta charset="utf-8"><title>Bauweise-Blatt Erdung</title><style>{CSS}</style></head><body><div class="top"><h1>Bauweise: Wie liegt was in der Landschaft</h1><span class="m">je Objektart Geschichte → Lage → Gelände → Saum · für Probe v2 und den Lab-Hook</span><div class="pf"><span>PASS</span><span>FAIL</span></div></div><div class="wrap">{head}{cards}</div></body></html>'
open(os.path.join(D, 'bauweise.html'), 'w').write(page)
print('ok')
