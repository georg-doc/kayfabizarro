#!/usr/bin/env python3
"""Deck-Paket zusammenbauen: Bestand (media/kfb) + Druck-Transkription (*.print.json) + Back-Protokoll (bake.json) -> deck.json, prüfung.json, texte/.
python3 build_pack.py <packId> --repo <worktree> --print <x.print.json> --bake <bake.json> --pak <paketordner> [--texte <ordner copy/>] [--status <status.json>] [--kosten <kosten.json>] [--crop <crop.json>]
Text: Druck führt. Jede Abweichung landet in textAenderungen, Altwerte in jsonLegacy. Titel ändern sich nie nur wegen Typografie.
Bewertung: grade bleibt, rating kommt dazu, Widersprüche werden gelistet, nichts wird gemittelt."""
import argparse, difflib, json, os, re, shutil, unicodedata
A = argparse.ArgumentParser()
A.add_argument('pack'); A.add_argument('--repo', required=True); A.add_argument('--print', dest='pr', required=True); A.add_argument('--bake', required=True)
A.add_argument('--pak', required=True); A.add_argument('--texte'); A.add_argument('--status'); A.add_argument('--kosten'); A.add_argument('--crop')
A.add_argument('--role', default=''); A.add_argument('--question', default=''); A.add_argument('--video', default=''); A.add_argument('--tier', default='')
a = A.parse_args()
idx = json.load(open(f'{a.repo}/media/kfb/index.json'))
e = next(d for d in idx['decks'] if d['packId'] == a.pack)
src = json.load(open(f"{a.repo}/media/kfb/{e['data']}"))
P, B = json.load(open(a.pr)), json.load(open(a.bake))
bake = {c['n']: c for c in B['cards']}
old = {(c.get('cardNumber') or c.get('num')): c for c in src['cards']}
norm = lambda s: re.sub(r'\s+', ' ', (s or '').strip())
plain = lambda s: (s or '').replace('’', "'").replace('‘', "'").replace('“', '"').replace('”', '"')
typo = lambda s: re.sub(r'[^a-z0-9]+', ' ', plain(s).lower()).strip()
EXP = {5: 1, 4: 1, 3: 2, 2: 3, 1: 3}
cards, changes, wid, stich, befunde = [], [], [], [], list(P.get('findings') or [])
for pc in sorted(P['cards'], key=lambda c: c['cardNumber']):
    n = pc['cardNumber']; o = old.get(n, {}); b = bake.get(n)
    if not b:
        befunde.append(f'Karte #{n} ohne Bild (Zahl weicht vom PDF ab)'); continue
    alt = {'cardName': o.get('cardName') or o.get('name'), 'power': o.get('power'), 'lore': o.get('lore')}
    # Titel: nur wenn er sich inhaltlich ändert (Lesson 4: nie nur wegen Typografie)
    name = alt['cardName'] if alt['cardName'] and typo(alt['cardName']) == typo(pc.get('cardName')) else plain(pc.get('cardName'))
    neu = {'cardName': name, 'power': pc.get('power') or '', 'lore': pc.get('lore') or ''}
    diff = [k for k in neu if norm(alt[k]) != norm(neu[k])]
    typo_only = [k for k in diff if typo(alt[k]) == typo(neu[k])]
    if diff:
        changes.append({'cid': f'cid:{a.pack}:{n}', 'felder': diff, 'nurSchreibweise': typo_only, 'alt': {k: alt[k] for k in diff}, 'neu': {k: neu[k] for k in diff},
                        'quelle': (pc.get('textSource') or {}).get('source')})
    ts = pc.get('textSource') or {}
    card = {'cid': f'cid:{a.pack}:{n}', 'n': n, **neu}
    pname = pc.get('cardNamePrint') or o.get('cardNamePrint')
    if pname and pname != neu['cardName']:
        card['cardNamePrint'] = pname
    if pc.get('stats'):
        card['stats'] = pc['stats']
    card['grade'] = o.get('grade')
    card['rating'] = pc.get('rating')
    card['bilder'] = {'karte': f'bilder/karte/{n:02d}.webp', 'motiv': f'bilder/motiv/{n:02d}.webp'}
    card['motiv'] = {'rect': b['motivRect'], 'quelle': b.get('motivQuelle'), 'guete': b.get('motivGuete')}
    card['herkunft'] = {'seite': b['page'], 'viertel': b['quad'], 'rect': b['rect']}
    card['pruefstand'] = {'text': 'offen' if pc.get('printOpen') else 'gesehen', 'method': ts.get('method', 'visual-transcription'), 'checkedAt': ts.get('checkedAt') or P.get('checkedAt'),
                          'printTypo': pc.get('printTypo'), 'printOpen': pc.get('printOpen')}
    leg = o.get('jsonLegacy') or (alt if diff else None)
    if leg:
        card['jsonLegacy'] = leg
    if o.get('gradeReason'):
        card['gradeReason'] = o['gradeReason']
    if o.get('artworkPrompt'):
        card['artworkPrompt'] = o['artworkPrompt']
    cards.append(card)
    # Gegenprobe: Text gegen lokale Texterkennung
    ocr = typo(' '.join(b.get('ocr') or []))
    txt = typo(neu['power'] + ' ' + neu['lore'])
    words = txt.split()
    hit = sum(1 for w in words if w in ocr) / max(1, len(words))
    if hit < .75:
        stich.append({'cid': card['cid'], 'ocrTreffer': round(hit, 2), 'seite': b['page'], 'viertel': b['quad']})
    # Widerspruch grade gegen Sterne
    st = (pc.get('rating') or {}).get('stars')
    g = o.get('grade')
    if st and g in (1, 2, 3) and abs(EXP[st] - g) >= 2:
        wid.append({'cid': card['cid'], 'titel': neu['cardName'], 'grade': g, 'sterne': st, 'art': 'grade und Sterne liegen zwei Stufen auseinander', 'gradeGrund': o.get('gradeReason'), 'sterneGrund': (pc.get('rating') or {}).get('reason')})
deck_r = (P.get('deck') or {}).get('deckRating') or {}
stars = [c['rating']['stars'] for c in cards if c.get('rating')]
g_ = [c['grade'] for c in cards if c.get('grade')]
g1, s45 = (sum(1 for x in g_ if x == 1) / max(1, len(g_))), (sum(1 for x in stars if x >= 4) / max(1, len(stars)))
matrix = {f'g{g}': {str(s): sum(1 for c in cards if c.get('grade') == g and (c.get('rating') or {}).get('stars') == s) for s in range(1, 6)} for g in (1, 2, 3)}
deck_wid = []
if g1 - s45 > .25:
    deck_wid.append(f'G1-Anteil {g1:.0%} gegen 4+5-Sterne-Anteil {s45:.0%}: Altbewertung ist deutlich großzügiger.')
if src.get('overallScore') and deck_r.get('stars') and src['overallScore'] >= 8 and deck_r['stars'] <= 3:
    deck_wid.append(f"Deck-Gesamtscore alt {src['overallScore']}/10 gegen {deck_r['stars']} Sterne nach R1.")
nv = (P.get('deck') or {}).get('viralScore')
if nv and src.get('viralScore') and abs(nv - src['viralScore']) >= 2:
    deck_wid.append(f"Viral-Score alt {src['viralScore']} gegen neu {nv}.")
byN = {c['n']: c['cardName'] for c in cards}
cname = lambda x: x if isinstance(x, str) else byN.get(x) if isinstance(x, int) else (x.get('cardName') or byN.get(x.get('cardNumber')))
tn = {typo(cname(x)) for x in (P.get('deck') or {}).get('topCards') or []}
to = {typo(x) for x in src.get('topCards') or []}
if tn and to and not (tn & to):
    deck_wid.append('Top-Karten alt und neu haben keine Überschneidung.')
top_norm = [cname(x) for x in (P.get('deck') or {}).get('topCards') or []]
wst_norm = [cname(x) for x in (P.get('deck') or {}).get('worstCards') or []]
deck = {
    'schema': 'kfb.deck-paket/1', 'packId': a.pack, 'title': src.get('deckTitle'), 'role': a.role or e.get('role'), 'question': a.question,
    'quelle': {'druckPdf': B['pdfFile'], 'sha256': B['pdfSha256'], 'seiten': e.get('pages'), 'coverOffset': e.get('coverOffset', 1), 'jsonStand': 'data/kfb-deck-analyzer-r1:media/kfb/' + e['data']},
    'bewertung': {'deckRating': deck_r, 'topCards': top_norm, 'worstCards': wst_norm, 'viralScore': nv, 'viralReason': (P.get('deck') or {}).get('viralReason')},
    'marketing': {'viralScoreAlt': src.get('viralScore'), 'overallScore': src.get('overallScore'), 'coverScore': src.get('coverScore'), 'g1Anteil': round(g1, 3), 'topCardsAlt': src.get('topCards'), 'worstCardsAlt': src.get('worstCards'), 'hashtags': src.get('hashtags'), 'blurb': src.get('blurb'), 'tier': a.tier},
    'verweise': {'video': a.video or None, 'songs': None, 'tratsch': None},
    'cover': 'bilder/cover.webp', 'cards': cards}
pak = a.pak
json.dump(deck, open(f'{pak}/deck.json', 'w'), ensure_ascii=False, indent=1)
tex = []
if a.texte and a.tier != 'ROT' and os.path.isdir(a.texte):
    os.makedirs(f'{pak}/texte', exist_ok=True)
    for f in sorted(os.listdir(a.texte)):
        if f.endswith('.md'):
            shutil.copy(os.path.join(a.texte, f), f'{pak}/texte/{f}'); tex.append(f)
    st = json.load(open(a.status))['decks'].get(a.pack, {}) if a.status else {}
    json.dump({'packId': a.pack, 'kanaele': st.get('channels', {}), 'stand': 'Rollout-Desk; Freigabe nur durch Georg'}, open(f'{pak}/texte/status.json', 'w'), ensure_ascii=False, indent=1)
crop = json.load(open(a.crop)) if a.crop else []
pr = {
    'schema': 'kfb.deck-paket-pruefung/1', 'packId': a.pack, 'geprueftAm': P.get('checkedAt'),
    'zaehlung': {'karten': len(cards), 'gesehen': sum(1 for c in cards if c['pruefstand']['text'] == 'gesehen'), 'offen': [c['cid'] for c in cards if c['pruefstand']['text'] == 'offen'],
                 'textGeaendert': len(changes), 'nurSchreibweise': sum(1 for x in changes if set(x['felder']) == set(x['nurSchreibweise'])), 'sterne': {str(s): stars.count(s) for s in range(1, 6)}},
    'herkunft': {'pdf': B['pdfFile'], 'sha256': B['pdfSha256'], 'bytes': B['pdfBytes']},
    'zuschnitt': {'hinweise': crop, 'motivNiedrigeGuete': [{'cid': f'cid:{a.pack}:{c["n"]}', 'guete': c['motiv']['guete']} for c in cards if (c['motiv']['guete'] or 0) < .3]},
    'befunde': befunde, 'textAenderungen': changes,
    'widersprueche': {'karten': wid, 'deck': deck_wid, 'gradeGegenSterne': matrix, 'hinweis': 'Nicht gemittelt. Vorschlag grade aus Sternen: 4-5 → 1, 3 → 2, 1-2 → 3; erst nach Abnahme.'},
    'stichproben': {'ocrGegenprobe': stich}, 'kosten': json.load(open(a.kosten)) if a.kosten else None,
    'bilder': {'bytes': B['bilderBytes'], 'bakeSekunden': B['bakeSeconds']}, 'mappingNote': P.get('mappingNote'), 'seitenGesehen': P.get('pagesViewed'), 'vierGesehen': P.get('quadsViewed')}
fn = unicodedata.normalize('NFC', 'prüfung.json')
json.dump(pr, open(f'{pak}/{fn}', 'w'), ensure_ascii=False, indent=1)
print(f"{a.pack}: {len(cards)} Karten, Text geändert {len(changes)}, Widersprüche Karte {len(wid)}, Deck {len(deck_wid)}, OCR-Stichprobe {len(stich)}, Texte {len(tex)}")
