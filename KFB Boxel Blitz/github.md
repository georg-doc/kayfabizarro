# github.md

repo: uuuulala/Threejs-rolling-dice-tutorial
branch: master
path: js/main.js

Vorbild für die Würfelphysik, von Georg geliefert (MIT, Codrops / Ksenia Kondrashova).
Nur GELESEN, nichts kopiert: die Entscheidungen daraus (cannon-es über die Importkarte,
Schwere 50 bei Kante 1,0, glatter Box-Kollisionskörper bei abgerundetem Netz, Wurf als
Impuls an versetztem Punkt, die Antwort auf »liegt auf der Kante«) stehen im Kopf von
`boxelblitz-v4/cube.v3.js`.

## Weitere gelesene Quellen

- `pmndrs/cannon-es@master` — `src/world/Narrowphase.ts` Z. 345–380: die Auflösung der
  Materialpaarung (Shape → Body → Vorgabewert). Grundlage dafür, dass eine Boxelzelle
  Deckfläche und Flanke in EINEM Körper trennen kann. Im Spiel gemessen, nicht geglaubt.
- `georg-doc/kayfabizarro@main` — `skills/session-entry-use-what-works_v1.md`
  (Anti-Regressions-Regeln; Sprint-intern verbindlich).
- `georg-doc/kayfabizarro@main` — `skills/kfb-cartoon-animation_v2.md` (von Georg als Rohpfad
  geliefert, 06.09.). Verbindlich daraus: §4.5 Ringe nur für Zielen/Laden/Portal/Zone, nie
  als Aufprall-Effekt · §8.3 additive Sichtoffsets, niemals Physik überschreiben ·
  §12.1 kein Anspruch ohne Bild-Beleg · §2.1 Ursache → Anlauf → Aktion → Aufprall →
  Nachschwingen → Erholung. Umgesetzt in `boxelblitz-v4/dice.v4.js` (V4-S18…S20).
  ⚠ Meine Aussage »der Pfad existiert nicht« war falsch — mein Tree-Filter hatte die Datei
  nicht gefunden.
- `georg-doc/kayfabizarro@main` — `skills/cartoon-motion_v1.md` (Grundsätze 1 und 7:
  Streckung entlang der Bewegung, Volumenerhaltung, Bahnen sind Bögen).

## Last sync

date: 2026-09-06T05:36:33Z
commit: —  (nicht bekannt; die Baumkennung a05d43d52e82 ist ein Tree-Hash, kein Commit)

### Updated in this project

- `boxelblitz-v4/dice.v4.js` — Verformung nach `skills/cartoon-motion_v1.md`: zwei Kanäle
  (Ereignis auf der Flächennormale, fortwährend entlang der Geschwindigkeit), Deformer als
  eigener Kindknoten in Weltachsen, Zielmarke mit Kreuz und Trägerscheibe.
- `boxelblitz-v4/cube.v3.js` — Hüpfer aus dem Schlitz statt Drehung, Anstoss-Budget je Lage.
- `cardbuilder/kfb-card-builder.js` — `backUrl`: die Repo-Rückseite
  (`media/kfb/KayfaBizarro_Card_Backside_01_lowrez.png`) als Wartezustand statt Textblatt.
- `boxelblitz-v4/surfaces.v1.js` — sechs Restitutionen samt gemessener Löser-Kennlinie.

## Screen map

| Ansicht / Baustelle | gebaut aus |
|---|---|
| KFB Boxel Blitz v4 · Würfelbewegung | `uuuulala/Threejs-rolling-dice-tutorial` `js/main.js` (Vorbild, gelesen) · `pmndrs/cannon-es` `src/world/Narrowphase.ts` (Materialpaarung) · `boxelball-v1/dice.v1.js` Z. 62–66 und 441/466/496 (die sechs Designwerte, Aufprallschwelle, Bumper-Kick) |
| KFB Boxel Blitz v4 · Cartoon-Verformung | `georg-doc/kayfabizarro` `skills/cartoon-motion_v1.md` (Maßstab, gelesen) |
| KFB Boxel Blitz v4 · Kartenrückseite als Wartezustand | `georg-doc/kayfabizarro` `media/kfb/KayfaBizarro_Card_Backside_01_lowrez.png` (zur Laufzeit geladen) |

## Sync history

- 2026-09-06T00:31:57Z — Vorbild für die Würfelphysik gelesen (`uuuulala`), Materialpaarung in
  `cannon-es` nachgeschlagen, Materialmodell und `cube.v3.js` gebaut.
