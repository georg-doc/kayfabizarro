# BRIEFING WS0 — v10 · Freigabe UI-Layer, Sound, Banner/Schriftrollen, Map-Assets

**Von:** WS1 (Lead) · **Stand:** 2026-08-09, 2. Fassung (Design-Teil ergänzt, **freigegeben**) · **Grundlage:** `docs/MASTERPLAN_overworld.md` (SSOT,
v10) · Coworker-Briefing `KFB UI embed v1.md` (A · C · E) · `docs/REVIEW_WS0_hud-v9b.md`

---

## 0 · Freigabe

Freigegeben ist der volle Vorschlag aus `KFB UI embed v1.md` — **A** (TS-UI-Baukasten),
**C** (Sound-Layer), **E** (Kenney-Map-Layer) — plus der **Card-Acquisition-Screen** aus
Masterplan §4.2. **B (Content-Surfaces) bleibt beim Lead**, weil es im Reveal-Pfad sitzt.

**Der Masterplan gehört WS1.** WS0 liefert Code, Messzahlen und Patch-Vorschläge; eingearbeitet wird
hier. Kein zweiter Masterplan, kein zweites Audio-Manifest, keine zweite Ink.

## 1 · Reihenfolge (so, nicht anders)

| # | Paket | Warum zuerst | Abnahme |
|---|---|---|---|
| 1 | **`sfx.json` ins Repo** (`media/3D_Assets/Audio/sfx.json`) + `drop_002`-Umweg | der Ansager ist stumm, das ist ein Ein-Datei-Fix | 12/12 Ereignisse spielen, Konsole ohne Decode-Fehler |
| 2 | **UI-Baukasten A** als Modul (`ui-kit-ts.js`): 9-Slice-Paper · 3-Slice-Banner/Schriftrolle · Bar (Base+Fill) · Fixed (Icon/Cursor/Avatar) | jedes weitere Paket benutzt ihn | ein Musterblatt mit allen vier Mustern in drei Größen, **keine gestreckte Kappe** (Pixelmessung) |
| 3 | **HUD-Rework auf den Baukasten** — Reihenfolge und die drei Konflikte in `docs/REVIEW_WS0_hud-v9b.md` §5 | das v9-B-Rail versteckt sonst den Kompaß | Kompaß sichtbar, `snap`-Fix intakt (kein Strand-Teleport), ein Kartenkunst-Modul, richtiger Pfad zu `card-grids.json` |
| 4 | **Signature-Sounds je diskretem Commit** (C) | Chrome und Ton gehören zusammen | Liste Ereignis → Ton, Hover/Tippen nachweislich still (Debounce 80 ms) |
| ~~5~~ | **Card-Acquisition-Screen** — **am 9.8. vom Lead gebaut** (V10-S4), weil die Tutorial-Runde ihn brauchte. **Nicht neu bauen.** Übernahme später über den Haken `game.hudCardAward({card,reason,zone,done})`, wenn das TS-Chrome steht | — | Haken liegt, Rückweg `done` ist Pflicht |
| 6 | **Map-Layer E**: Kachel-Inventar, `map-render`, Cartography ↔ Tactical auf **einer** Taste | größtes Paket, hängt an nichts | eine Welt → automatisch eine Karte, ohne Handlayout; Tactical bleibt erreichbar |
| 7 | **Emote-Set als PNG** (§2c) | braucht nur die Wortliste, kann jederzeit dazwischen laufen | 18 Zeichen, 64², eine Datei je Zeichen, Namen wie in der Tabelle |
| 8 | **Soundscape-Demonstrator** (§2d) | **erst nach Paket 3** — Ton ohne fertiges Chrome ist eine Demo ohne Ort | die elf Punkte in §2d |

Pakete 1–3 sind die nächste Runde. 4–6 danach, in dieser Folge.

## 2 · Banner und Schriftrollen — für UI **und** Welt

Der 3-Slice-Banner ist nicht nur Fensterdeko. Er ist auch **Welt-Möbel**: Zonentitel über einer Card
Zone, Ortsschild am Wirtshaus, Quest-Rolle am König. Deshalb im Modul von Anfang an **zwei
Zeichenwege**: in Screen-Koordinaten (HUD) und in Welt-Koordinaten (mit der Kamera, mit
Kontaktschatten, hinter dem Helden sortiert). Sonst wird der Welt-Weg später nachgebaut — und das
ist die Fehlerklasse »zwei Wahrheiten«.

**Harte Regeln:** immer aus den `*_Slots.png` schneiden, nie das Vorschaubild strecken · Kappen nie
strecken · alles Vielfaches von 64 · **kein KFB-Ink auf TS-Kunst** (K5-Grenze) · kein weißer Rand bei
fremder AR — der Rest ist Terrain oder Frame.

## 2a · Korrekturen aus der WS0-Messung (9.8.) — diese Zahlen gelten

WS0 hat den Baukasten gebaut und dabei vier Annahmen dieses Briefings widerlegt. **Gemessen schlägt
Papier**, auch wenn das Papier von hier kommt. Ab sofort gilt:

| Vorher (dieses Briefing, 1. Fassung) | Gemessen (WS0, `ui-kit-ts.js`) |
|---|---|
| Banner = **3-Slice** (nur in der Breite) | **9-Slice** — auch in der Höhe dehnbar |
| Schriftrollen = feste Form | **dehnbar**; die gemalte Falte wiederholt sich bei großen Flächen → für große Textflächen die geschnitzte Tafel |
| Bars nur in Blattlänge | **jede Länge** baubar |
| `paper-atlas.js` als Papierquelle | **überholt** (halbe Größe, eingetippte statt gemessener Maße) — wird mit dem HUD-Umbau abgelöst. Die Datei hängt im **Runner-Helmet**: entfernen macht der Lead, WS0 schlägt vor |

**Abnahme, die das trägt:** 19 Blätter geladen, keine Fehler, dasselbe Bauteil in drei Größen
Pixel für Pixel verglichen — **12 von 12 ohne Abweichung**. Paket 2 ist damit `LÄUFT`.

## 2b · Sprechblasen — das System steht, es wird **nicht** neu gebaut

Georgs Handover (`HANDOVER_Sprechblasen-System_ausPetStudioV4_fuerWS1.md`) ist **Kanon**: das
Blasen-System aus **KFB Pet Studio v4** wird übernommen, nur der Anker wechselt vom Pet-Kopf zur
Unit. Für WS0 heißt das:

- **Kein eigener Blasen-Look im HUD.** Wer im Fenster oder im Rail eine Blase braucht (Quest,
  Dialog, Tooltip mit Stimme), nimmt denselben Zug: jittriges Rechteck ohne runde Ecken, Fill =
  Papier (**nur das Papier getönt**, Umrandung und Schrift bleiben schwarz), Zipfel als
  **getaperter Pfeil** — keine Kerbe, kein abgeschnittenes Dreieck.
- **Immer nur EINE Blase.** Der Zonendeckel im Spiel erlaubt zwei Stimmen; im UI ist es eine.
- **Denken · Sprechen · Flüstern** sind drei Typen desselben Systems (Scallop-Wolke · Rechteck ·
  gestrichelt), kein vierter wird erfunden.
- **Die Blasen-Ink ist NICHT die Karten-Feder** (K5 gilt für Karte/Zone/Chip). Ob beides später
  zusammengelegt wird, entscheidet der Lead — bis dahin der bewährte Pet-Studio-Zug.

## 2c · Emotes — ein Zeichen, kein Bildchen-Teppich

Die Fluchschrift **PottyMouth BB** legt auf jede Taste ein Fluchzeichen; der Schlüssel ist
abgelesen und benannt (`KFB Pottymouth Key.dc.html`, Tabelle in `overworld/chatter-2d.js`).
**Regel: ein Emote je Blase, groß gesetzt.** Drei nebeneinander lesen sich als Wort statt als Ausruf.

Achtzehn benannte Zeichen — Totenkopf · Knochen · Grinsen · Blitz · Knall · Funken · Wolke · Hirn ·
Wirbel · Strudel · Frage · Ausruf · Hammer · Axt · Grab · Zacken · Kette · Wurm. Sie sind gruppiert
nach Absicht (`fluch` · `wut` · `schmerz` · `verwirrt` · `schreck` · `gedanke`); die Aufrufstelle
nennt die **Absicht**, nicht die Taste.

**Auftrag an WS0 (Paket 7):** dieselben achtzehn Bedeutungen als **PNG-Satz** (64², transparent, ein
Zeichen je Datei, Dateiname = der Name aus der Tabelle) — gezeichnet oder aus einem Bildmodell, im
Tiny-Swords-nahen Strich. Damit hängt das Spiel nicht mehr an einer Schrift mit ungeklärter Lizenz,
und das HUD kann dieselben Zeichen benutzen. **Die Wortliste ist das Briefing** — keine neuen
Bedeutungen erfinden.

## 2d · Soundscape — Konzept freigegeben, Produktion als **ein** Demonstrator

Der Vorschlag (ChatGPT-Briefing 9.8.) ist angenommen, mit drei Schnitten.

**Angenommen:** die Audio-Ausdrucksebene als **seed-getriebene** Kette
(Karte/Seite/Zone/Deck → Audio-Seed → Manifest → Wiedergabe), die fraktale Staffelung
(Karte = Signatur · Seite = Mikro-Dramaturgie · Zone = Umgebung · Deck = Musik), die Lull-Regel und
das **eine** Manifest. Suno-Tracks dürfen als Assets rein.

**Geschnitten:**
1. **Kein LLM, kein User-Chat, keine Sonderwesen** (Oracle, Speaking Abyss) in der ersten Scheibe.
   Der vorgeschlagene MVP enthielt sie — das ist ein zweites System, kein Demonstrator.
2. **Kein Howler**, bis der Demonstrator zeigt, dass `audio-2d.js` nicht reicht. Eine
   Wiedergabeschicht, die man nicht braucht, ist trotzdem eine Abhängigkeit.
3. **Reihenfolge:** nach Paket 3 (HUD), nicht davor. Ton ohne fertiges Chrome demonstriert nichts.

**Der Demonstrator:** 1 Deck · 1 Seite (2×2) · 1 Zone · 4 Karten · **eine** Umgebung, **eine** Drone,
**ein** Deck-Track, **zwei** Kartensignaturen, die bestehenden Ereignis-SFX, zwei saubere Übergänge —
und **Stille** bei gewöhnlicher Bewegung. Die Frage, die er beantworten muss:
*Wird die Welt hörbar lebendig, ohne geschwätzig zu werden?*

**Abnahme:** ein Manifest · `sfx.json` läuft unverändert weiter · Loop ohne Naht · Musik blendet
sauber · Kartensignatur deterministisch · Bewegung und Hover still · Zustandswechsel entprellt ·
keine undokumentierten Runner-Interna · Standalone-HTML · Abnahme über den echten Bedienweg mit
Zahlen.

**Grenze Chatter:** die **Laufzeit** (`OW_CHATTER`, `mob-ai.js`) gehört dem Lead. WS0 liefert
**Inhalt**: Fraktions-Phrasenvorrat als Daten (`media/chatter/faction-phrases/`), Emote-PNGs,
Blasen-Darstellung, Audio-Assets. Der vorgeschlagene Baum aus `chatter-seeds.js`,
`chatter-factions.js`, `chatter-injections.js` wäre eine zweite Laufzeit im Spiel — bitte nicht.
Fehlt ein Zustand an der Oberfläche: hier beantragen (§3).

## 3 · Der Vertrag

Der Runner (`overworld/overworld-game-v10.js`) stellt eine benannte Oberfläche: `game.rail`,
`game.hero`, `game.zones`, `game.hudSpendPoint`, `OW_AUDIO.sfx(event)`. Was dort steht, darf UI lesen
und rufen; alles andere ist intern. **Kein Eingriff im Runner — anhängen statt hineinschreiben.**
Fehlt etwas an der Oberfläche: hier beantragen, wir tragen es ein und dokumentieren es im Masterplan
§6. Eigenmächtig verdrahtete interne Felder überleben den nächsten Fork nicht.

**Fork-Stempel** im Kopf jeder geteilten Datei (aus welchem Export sie stammt). `units-catalog.js`
gehört WS0 — der Zugewinn aus v9-B (Menschen-Avatare, Lancer/Monk, 8 Gegner-Avatare) bleibt.

## 4 · Sync-Ritual

**Eine Richtung je Runde. Immer ein Session-Export.** Der Export enthält: Code · Standalone-HTML
(einzeln geprüft) · `MASTERPLAN_overworld.md` (Stand) · Onboarding · Changelog-Kopf · eine
Abnahmetabelle mit **Zahlen**. Wer empfängt, baut nach; wer sendet, ändert in der Zeit nichts
Geteiltes.

WS0 hat regelmäßig mehr Credits übrig — deshalb: **Taktung bei WS0, Reihenfolge hier.** Wenn ein
Paket früher fertig ist, kommt der Export früher; die Reihenfolge wird nicht umsortiert, ohne dass
sie hier geändert wird.

**Statusworte im Export:** `LÄUFT` nur mit Beleg aus dem echten Bedienweg, sonst `GEBAUT`.
»Es existiert« ist kein Status.

## 5 · Was NICHT

Kein zweiter Masterplan · kein zweites Audio-Manifest · keine zweite Ink und kein KFB-Ink auf
TS-Kunst · kein gestrecktes Single-Sprite · kein Sound auf Hover oder kontinuierlicher Bewegung ·
keine Zahl an der Karte (K1, auch im Embed-Frame) · die Tactical-Map nicht wegwerfen · kein Zwang
zu einer Karte je Slot (Welten dürfen sparse oder kartenfrei sein) · keine Preise im Bild (POP-Kosten
sind eine Menü-Transaktion).

## 6 · Offen, bevor WS0 loslegt

- **POP-Kosten je Slot** — Zahlen kommen nach dem ersten Progression-Slice hier aus dem Lead.
- **TS Free Pack Lizenz** vor kommerziellem Export bestätigen (Kenney Cartography ist CC0).
- **Almanach-Einflug**: WS0 baut die Animation, der Lead liefert den Haken aus dem Reveal.
- **PottyMouth-Lizenz**: gekauft, Live-Einsatz ungeklärt (Georg). Genau deshalb Paket 7 — der
  PNG-Satz ist der Ausweg, nicht die Schrift.
