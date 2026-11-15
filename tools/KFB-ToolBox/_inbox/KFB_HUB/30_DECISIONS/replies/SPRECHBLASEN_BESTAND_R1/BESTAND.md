# Sprechblasen-Bestand R1 · KFB · 15.11.2026

Inventur für einen neuen Blasen-Stil (kantiger, Street-Art, nicht repetitiv). Nur Bestand, keine neuen Entwürfe.
Bilder: `bilder/` (24 Dateien), Übersicht: `KONTAKTBOGEN_SPRECHBLASEN_BESTAND_R1.jpg`.
Kürzel: **Stamm** = `/Users/georgv.westphalen/kfb-ws0/stamm-wt` (Spiel, Stand @f00ff292). **privat** = Git-Stand `82212dc9` im Stamm (`git show 82212dc9:<pfad>`). **Register** = `KFB_HUB/30_DECISIONS/DECISIONS.md`.

## Kurz
1. Im Spiel läuft genau ein Blasen-Renderer: chatterbox-core (cbs-core 0.1) in der Plain-Variante ohne Umriss, mit Papierfläche, weichem Schatten und geradem Dreieck-Zipfel zur Kopfmitte. Dazu Denkblase (Scallop-Wolke + Punkte) und Antwort-Blasen.
2. Rufe (Bingo! · Boggle...? · Bongo. · Blödsinn! · Humbug?!) stehen im Spiel als fetter Text in normalen Sprechblasen. Als 3D-Knet-Lettering ist im Spiel nur „Humbug?!“ (MiB-Ereignis) eingebaut, als Comic-Wort nur „PLOPP!“ (Kampf-K.o.).
3. Erarbeitet, aber nicht im Spiel: die ganze Blasenfamilie mit Ruf/Schrei, Flüstern, Caption, Kayfabulate (ChatterBox Studio v2), vier Rand-Stile Clay / Clay pur / Ink / Slab, die Comic-Wörter-Bank POW/BAM/WHOOSH/WOW/COOL (4 Klassen), die Tusche-Blasen mit fünf Stimmen scream/loud/mid/soft/whisper (Pet Studio v12 Shaper), Fluff-o-lect-Glyphen in Blasen, Zensurbalken.
4. Die KFB-Tusche-Variante (Ink-Outline) ist für Spiel-Sprechblasen per Register verboten (V-204, V-214). Sie lebt nur in Studios und Vorlagen.
5. Paket `kfb-bubbles.v1` (V-501, WSA PR #424) wurde gebaut, aber nicht ins Spiel übernommen; das Spiel nutzt die Vendor-Datei direkt.

## Im Spiel produktiv

| Stil | Wo im Spiel | Aussehen | Quelle (Datei · Funktion) |
|---|---|---|---|
| **Sprechblase plain** (`speech`) | NPC-Zeilen, Triplets, Tratsch, Begrüßung, Spielerzeile | Abgerundetes Rechteck (Eckradius min(14, 0,3 × Höhe)), kein Umriss, keine Tusche. Fläche = Papier `#fbf2df` gemischt mit 20 % Sprecherfarbe. Leichter Flächenverlauf (`clayFront`, `#kfbFaceShade`), Schatten `drop-shadow(0 3px 5px rgba(42,26,12,.28))`. Zipfel gerades Dreieck, Länge bis 30 px, Fuß 22 px bei 900 px Bildhöhe (skaliert mit Höhe), zielt auf Kopfmitte, Ansatz wandert über alle vier geraden Kanten. Schrift Shantell Sans 400/700, Grundgröße 15–20 px (innerHeight/42), Tinte `#1f1a14`, fette Tokens als `<b>`. Innenabstand Kern + `AIR {x .6, y .45, lh .12}` em. Kein Witwen-Wort (`lastLineShare .40`). Einblenden: Pop 0,82 → 1,04 → 1 in 170 ms; Satzteile klappen nacheinander auf (rotateX −86° → 0, 300 ms, Versatz 520 ms). Lebenszeit 7,5 s. | `Stamm/src/bubbleLayer.js` · `aimRoundRectPath()`, `bubbleBodySvg()`, `layoutTri()`, `createBubbleLayer()`; Kern `Stamm/src/vendor/chatterbox-core.js` (md5 847270cf…, 1:1 aus ChatterBox Studio v2) |
| **Denkblase** (`thought`) | Schweigen-Zeilen (`SILENCE`), Begrüßung ohne Text | Scallop-Wolke (`blobPath`, rx = 0,6 w + 12) plus drei wachsende Bläschen zum Kopf (`thinkDots`, R0 = 20 % Blasenhöhe, 7–13 px). Gleiche Papierfläche, kein Umriss. | `bubbleLayer.js` · `bubbleBodySvg()` Zweig `kind === 'thought'`; `chatterbox-core.js` · `thoughtPath()`, `thinkDots()`; Aufrufer `Stamm/src/BubbleHost.jsx` Z. 36–37, `Stamm/src/m1/M1World.jsx` Z. 356 |
| **Antwort-Blasen** (Spieler-Gespräch) | Weltwissen-Gespräch hinter `wissen=r1` | Spalte neben dem Kopf der Spielfigur, Papier `#fbf2df`, fette Ziffer im Text, Hover Gold `#E9B53A` + 1,05, Druck 0,96/0,92, gewählte Blase wird Spielerblase. Zipfel seitlich, Abstand 18 px. Körper aus demselben `bubbleBodySvg`. | `Stamm/src/hud/talkLayer.js` · `createAnswerBubbles()`; Vorgabe `replies/SPRECHBLASEN_SSOT_R2.md` + `SPRECHBLASEN_SSOT_R2/proto-bubbles.ref.js` |
| **Zuruf-Auswahl 2 × 2** (`choice`) | Spieler ruft Bingo!/Boggle...?/Bongo./Blödsinn! (Tasten 1–4) | Derselbe Blasenkörper, Tastenkreis in Tonfarbe ohne Tusche-Rand: Bingo `#e2b33c`, Boggle `#59c3e6`, Bongo `#7fc46a`, Blödsinn `#e5563d`. Stempel 420 ms. | `Stamm/src/choiceLayer.js` · `ZURUFE`, `createChoiceLayer` |
| **Blase mit Kartenvorschau** | NPC zeigt Karte im Gespräch (V-1067) | Sprechblase wächst um ein Kartenbild (Radius 6 px, Schatten). Ohne Bild nur der Satz. | `bubbleLayer.js` · `say(…, media)` |
| **Rufe als Text** | Tratsch, Begegnungen, Gespräch | Fett, genau so geschrieben: Bingo! · Boggle...? · Bongo. · Blödsinn! · Humbug?! in normaler Sprechblase. | `Stamm/src/dialog/ssotLines.js` · `CALLS`; `Stamm/src/poolReader.js` · `callLine()`; `Stamm/src/npc/talkDirector.js` Z. 95 |
| **Ruf „Humbug?!“ als 3D-Knet-Lettering** | MiB-Turm-Ereignis (Blitzdingsen) | Gebogenes Knet-Wort, Farbsatz C2, Violett `#9a5cf0`, Pop/Hold/Out-Clips. | GLB `src/private/50_BLENDER/N35/out/rufe/C2/KFB_Ruf_Humbug.n35c.glb` (privat); `Stamm/src/npc/mibCast.js` Z. 12/20, `Stamm/src/npc/mibEvent.js` Z. 85 |
| **Comic-Wort „PLOPP!“** | Kampf: K.o. eines Gegners | Sprite über dem Gegner, Bangers 900 104 px, Kontur `#4a2410` 18 px, Fläche Gold `#f2b33a`, oben hell `rgba(255,248,226,.9)`. Dazu Knet-Puff. | `Stamm/src/vendor/combat/knet-fx.v1.mjs` · `wordTex()`, `pop()`; Aufrufer `Stamm/src/modules/combatPlayer.r2.js` Z. 813 |
| **Emanata (Knet-Sticker)** | Reaktionen neben dem Kopf; **Standard aus** (`emanata=1`, q294/V-955) | Billboards aus Georgs Sticker-Bogen: exclaim, question, sparkles, impact, anger, dizzy, zzz, hearts … Atlas enthält auch Knet-Sprech-, Ruf-, Denk- und Tipp-Blase. | `Stamm/src/life/emanata.js`, `Stamm/src/data/life/emanata.r1.json`, Atlas `Stamm/src/assets/emanata/emanata_atlas.webp` · Bild `21_…`, Bogen `22_…` |
| Platzierung (für alle) | global | Nur über dem Sprecher, nie über Figuren, Köpfe, HUD (V-887); Kandidaten DY/DX, kleinste Überdeckung. | `Stamm/src/bubblePlace.js` · `spotAbove()`; `Stamm/src/bubbleAvoid.js` · `avoidRects()`; `Stamm/src/bubbleAnchors.js` |

Bilder Spielstand: `01_…` (Abnahme-Maßstab SSOT R2), `02_…` (Fehlerbild), `03_…` (V-204-Referenz), `04_…`, `05_…`, `06_…` (q263), `07_…` (q189 Tratsch mit Ruf).

## Erarbeitet, nicht produktiv

| Stil / Katalog | Status | Quelle | Bild |
|---|---|---|---|
| **Blasenfamilie 8 Register**: speech, thought, whisper (gestrichelt, Schrift 0,85, `#5a4f44`), shout/Ruf (Kranz, 12–18 Zacken, 2 lange, 1 nach innen, Bangers 1,35), caption (ocker, ohne Zipfel), kayfabulate (Erzählkarte, roter Irish-Grover-Reiter), interactive choice, ambient | Liegt im Kern (`KINDS`, `shoutPath`, `crown`), im Spiel ungenutzt. ChatterBox Studio v2 Status „v2 · TUNE“. | `/Users/georgv.westphalen/Dropbox/CLAUDE/KFB_CHATTERBOX_STUDIO_CLAUDE_DESIGN_SESSION_CUT_2026-10-05_r2/` · `KFB ChatterBox Studio v2.dc.html`, `lib/chatterbox/chatterbox-core.js`, `docs/chatterbox-studio/SPEC_COMPONENTS.md` §2 | `08_`, `09_`, `10_` |
| **Rand-Stile Clay / Clay pur / Ink / Slab** (Leitregel „Clay außen, Ink innen“; Ink = schwarze Feder `#1f1a14`, Slab = dunkle Unterseite wie Combat-Karten) | Ink im Spiel verboten (V-204), Clay pur = heutige Basis. | wie oben, `rimLayers()`, Prop `rimStyle` | `08_` Ink, `09_` Clay pur, `10_` Clay |
| **Comic-Wörter-Bank (VFX)**: Impact (POW! BAM! BONK! CRASH! SLAP!, Kranz + Innenstern, Gelb `#ffd84a` auf Rot `#e94a2e`), Movement (WHOOSH! FWIP! ZZIP! SWOOP!, Speed-Streaks, Mint `#a6f0cf`), Reaction (WOW! OOPS! WHAT? HMM OHYEAH!, Papierwolke, Pink `#ff8fcf`), Reward (COOL! SPECIAL! AMAZING! BOSS!, Abzeichen, Gold `#ffcf3a` auf Violett `#7c4fd0`); Zeiten Ein/Halten/Ab je Klasse, SFX thump/whoosh/boing/chime | Im Kern (`WORD`, `comicWord()` v0.5, Deskriptor `kfb.comic-word.v1`). V-501/V-728 sagen „saftig animiert wie die Comic Words“. Im Spiel nicht eingebaut. | `chatterbox-core.js` Z. 213–295; `SPEC_COMPONENTS.md` §4 | `11_` |
| Wireface-Bühne mit Tusche-Blase | **FAIL V-214**, nie als Referenz verwenden | `…SESSION_CUT_2026-10-05_r2/evidence/s2_bubble_still.jpg` | `12_` |
| **Bubble Shaper v2/v3 mit KFB-Tusche (Ink-Canon, BAND-Feder)**: Formen rect / round / free (free = Erzählerbox ohne Zipfel); Stimmen scream (Bangers 36, Versalien), loud (Fonteys PRO 900, Versalien), mid (Shantell 600 22), soft (Shantell kursiv 17), whisper (Shantell kursiv 15, Feder gestrichelt 0,46/0,40 em). Formen von Georg von Hand gezogen (25.08.), cloud und burst verworfen. | Georg „80-%-Stand“ abgenommen (Aug.). Nicht im Spiel. | `/Users/georgv.westphalen/Dropbox/CLAUDE/KFB Pet Studio/KFB Pet Studio v12 (WS0)/session-export_petstudio-v12_2026-09-10/code/petstudio-v9/studio-v7/bubble-shaper.v3.js` (`VOICE_STYLE`, `VOICE_INK`, `BUBBLE_INK`); Formen `…/podcast-v2/bubble-shapes.json`; Tusche-Kanon `…/kfb-ink-canon.js`; Stil-Doc `/Users/georgv.westphalen/Dropbox/CLAUDE/Pet Studio + 3D TableDiorama KFB (WS0 FULL EXPORT)/KFB_INK_OUTLINE_STYLE_v2.md` | `13_` |
| Pet Studio v4 Blase (Rechteck mit Feder-Jitter ±1,3 px, keine runden Ecken, getaperter Pfeil, Totzone 44, Trägheit 0,10), Denkblase Scallop | Ursprung aller späteren Formen (Juli/Aug.) | `/Users/georgv.westphalen/Dropbox/CLAUDE/KFB Pet Studio/KFB Pet Studio v4/`; Handover `/Users/georgv.westphalen/Dropbox/CLAUDE/KFB VoxelWorld/Masterplan + Feedback + Living docs/WS0_coworker/HANDOVER_Sprechblasen-System_ausPetStudioV4_fuerWS1.md` | `14_` |
| Pet Podcast v5 Blasen (Tusche auf Bühne, Zipfel und Schatten) | Studie | `/Users/georgv.westphalen/Dropbox/CLAUDE/Pet Studio + 3D TableDiorama KFB (WS0 FULL EXPORT)/podcast-v5/bubbles.v5.js`, `bubble-shaper.v2.js` | `15_` |
| Vorlagen-Bögen Blasen (Tusche, Weiß, Farbig) | Referenzmaterial, Herkunft nicht dokumentiert | `/Users/georgv.westphalen/Dropbox/CLAUDE/KFB Pet Studio/KFB Pet Podcast v2 + Pet Studio v4 - export-ws1/vorlagen/` | `16_`, `17_`, `18_` |
| Overworld v13 Blasen-Formen + Bubble-Fixtures (rede/thought/whisper, Kanon gap 46, arrow 34, dead 44) und Handover „Fünf Arten, fünf Formen“ (Rede, Gedanke, Ruf zackig 8–16 Zacken ungleich, Flüstern gestrichelt, Kayfabulate Erzählkasten) | Vorlage laut V-085; in cbs-core portiert | `/Users/georgv.westphalen/Dropbox/CLAUDE/KFB VoxelWorld/KFB Overworld v13-WS0/overworld-v13_2026-08-12/` · `KFB Blasen-Formen v1.dc.html`, `KFB Bubble-Fixtures v1.dc.html`, `overworld-v13/bubble-ts.js`, `bubble-layout.js`, `docs/HANDOVER_Bubbles_Design_coworker.md` | `19_` (v4-Leinwand) |
| Bubble Follow v1 (Totzone, Zipfel zuerst, Ballon an der Schnur) | CANDIDATE, Claude Design 24.09. | privat `75_REFS/npc_card_speculation_r1/docs/HANDOVER_BUBBLE_FOLLOW_v1.md`, Szene `…/npc-card-spec-01/resident-scene.mjs` | `23_` |
| `kfb-bubbles.v1` (SSOT-Paket mit Fluff-o-lect-Hook) | V-501; WSA PR #424, Branch `wsa/kfb-bubbles-ssot-r1-2026-10-18` @b3963767; nie ins Spiel | `replies/BRIEF_WSA_SLICES_R1.md`, `replies/WS0_TO_WSA_2026-10-18_EVENING.md`, `replies/WSA_TO_WS0_WORKDIR_CLEANUP_R1.md` Z. 172 | – |
| **Fluff-o-lect in Blasen**: drei Stufen je Wort (Comic-Glyphen PottyMouth-Stil, Fluff-Wörter, Klartext), Glyphenbreite = Wortbreite (0,7–1,3), Tinte auf Papier | V-500, V-505, V-508 (PottyMouth-Lizenz gekauft, Web nicht ausdrücklich), V-515; Probe R10.1. Nicht im Spielcode gefunden. | `replies/SPEC_FLUFF_O_LECT_R1_DRAFT.md`; Probe `KFB_HUB/40_AUDIO/kfb_language_r1/probe_r10_1.html` | – |
| Zensurbalken in Blasen (Knet-Balken Tintenschwarz, Glanz, Tropfkante, 1–2 Inhaltswörter, nie Titel/Namen) | V-532 → V-609 (q104 B) entschieden. Nicht im Blasencode gefunden (nur Fassaden-Bresche `zensur=1`). | Register | – |
| Rufe als 3D-Knet-Lettering, alle fünf, Farbsatz C2 | V-728/V-729; Sequenz pop/hold/out beim Rufer. Nur Humbug im Spiel. | `/Users/georgv.westphalen/Dropbox/CLAUDE/KFB_HUB/50_BLENDER/N35/out/rufe/C2/` (Dateien dort online-only, 0 Byte lokal); Farben + Zeiten `KFB_HUB/60_CAST/clips.talk.r1.reactions.json` | – |
| „Blödsinn!“ Knet-Lettering K16 (Bangers, Bogen, Extrusion 0,11, Fläche `#b8361f`, Flanken `#7a2414`, Pop gestaffelt) | WSB 22.10., Vorgänger von C2 | privat `50_BLENDER/K16/out/KFB_Bloedsinn.k16.glb`, `50_BLENDER/K16/RETURN.md` | `20_` |
| Plain-Blase im HUD-R4-Paket (CSS-Blase, Ruf-Wort in Bangers über Shantell) | Vendor, im Spiel nicht als Blase genutzt | `Stamm/src/vendor/hud/hud-r4/r4-hud.js` · `bubble()` Z. 318 | – |
| Knet-Sprechblasen für Ladezeilen, Erzählerbox ohne Zipfel | V-1282, V-1293, V-1300 (Erzählerbox im Vorhang hinter `hudkit=clay`) | Register; Knet-HUD-Bogen in `/Users/georgv.westphalen/Dropbox/CLAUDE/KFB Hud + UI/` | `22_` |
| Nachbar-Projekt FrizzleCrits / Cancel This Comic (Comic-Templates mit Bubble, Caption, SFX-Lettering, „BAM!“; Bubble-Physik-Briefing) | nicht KFB-Spiel | `/Users/georgv.westphalen/Dropbox/CLAUDE/FrizzleCrits/Georg ComicReportTemplate (9)/uploads/BRIEFING_claude-design_comic-templates_v1.html`, `…/BRIEFING_coworker_bubble-engine_v1.html`, `…/BRIEFING_claude-design_bubble-attach_v1.html` | `24_` |

Hinweis: `08_`–`11_` und `13_` sind am 15.11. aus den vorhandenen Studios abgelichtet (nichts verändert). Alle anderen Bilder sind Kopien vorhandener Dateien.

## Comic-Wörter · Lautmalerei · Rufe
- **Ruf-Grammatik (V-712):** Satzzeichen trägt die Haltung. Bingo! = ja, annehmen. Boggle...? = offen, mehr davon. Bongo. = weiches Nein. Blödsinn! = hartes Nein, Dialog endet. Humbug?! = vergiss es (MiB-Blitzdingsen). Gilt für NPC, Fahrzeug, Ort, Spieler.
- **Schreibweise (V-699, V-704):** im Spiel genau so und fett. Kayfa-Formen (KayfaBINGO! …) nur am realen Kartentisch.
- **Farbcodierung, drei Sätze im Bestand (nicht vereinheitlicht):**
  - V-292 Ruf-Farben (dunkel, Website): Bingo `#4f6029`, Bongo `#8a6f3e`, Boggle `#5a6b76`, Blödsinn `#b8361f`.
  - V-728/V-729 Knet-Lettering C2 („cartoonig-farbig nach Semantik“): Bingo! `#22a06b` · Boggle...? `#3bb4e6` · Bongo. `#f6b02e` · Blödsinn! `#d6352a` · Humbug?! `#9a5cf0` (Quelle `clips.talk.r1.reactions.json`).
  - Zuruf-Tasten im Spiel: `#e2b33c` / `#59c3e6` / `#7fc46a` / `#e5563d` (`choiceLayer.js`).
- **Scream / Shout / Whisper:**
  - ChatterBox-Kern: `shout` = Kranz-Blase, Bangers 1,35, 21 Zeichen; `whisper` = gestrichelt, Schrift 0,85. Im Spiel nicht aufgerufen.
  - Pet Studio Shaper: fünf Stimmen scream · loud · mid · soft · whisper (Werte siehe Tabelle). Laut wird über Versalien und fetten Schnitt, nur scream wird größer (Georg 25.08.).
  - Overworld-Handover: „Die Kontur schreit, nicht die Schrift“; Flüstern „soll leiser aussehen, nicht nur kleiner sein“.
- **Lautmalerei (VFX-Wörter):** Bank in ChatterBox Studio (`11_`), ein lesbares Wort zur Zeit, nie über Gesicht, sonst entfällt es. Im Spiel nur „PLOPP!“. Humbug als Comic-Wort „gebogen, ohne Sprechblase“ (V-530).
- **Schriften:** Fließtext Shantell Sans; Ruf/Wort Bangers oder Irish Grover (V-501). Pet Studio v12 nutzte zusätzlich Fonteys PRO („Georgs Entscheidung gegen Shantell“, Aug.) und eine Custom-Familie GeorgComic mit Flüster-Strichen als Glyphen; später gilt Shantell (V-501, V-992).

## Regeln, die gelten (Register)
- **V-204:** Sprechblasen in der Plain-Variante ohne Outline bzw. Ink, maximal lesbar, leichter Schatten ohne zweite Ebene.
- **V-212 / V-215:** 2D-DOM im Host-Slot `#ui-bubbles`, keine 3D-Sprechblasen, genau ein Renderer (chatterbox-core 1:1).
- **V-214:** Blase mit Tusche-Outline = FAIL, Bild nie als Referenz.
- **V-499:** Cartoon-Formen-Spec gilt auch für Gedanken- und Sprechblasen: eine Masse mit Lappen, groß–mittel–klein ohne Symmetrie, keine Wiederholung (eigener Seed, ±25–40 % Größe). `replies/SPEC_CARTOON_VFX_SHAPES_R1.md`.
- **V-501:** Stil und Comic-Words als ein SSOT-Modul, kein Nachbau.
- **V-505 / V-519:** Tinte `#1f1a14`; Hintergrund weiß/hell/Papier, optional pastellige Story-Mode-Tönung, an Tageszeit angepasst, Kontrast immer ausreichend.
- **V-650, V-839, V-875:** alle Blasentexte Englisch.
- **V-699:** Kartentitel fett, höchstens eine kursive Stelle je Blase, Rufe fett in fester Schreibweise.
- **V-734:** Randabstand nicht zu eng.
- **V-839:** KFB-Sprechblase ohne Umriss, Zipfel zum Kopf (auch KB-Vignette).
- **V-887:** Blasen, Zuruf-Auswahl und Comic-Wörter überdecken nie Figuren, Köpfe oder HUD; Pfeil auf Kopfmitte, Ansatz wandert über den Rand.
- **V-992:** Cascade Sphere übernimmt dasselbe Modul (Shantell mit Bold-Tokens, Sprech-/Denkblase, Flip-Reveal).
- **V-1067:** Monkey-Island-Chat in Blasen; dort steht auch: „Sprechblasen nicht erneut über Claude Design.“
- **V-1099:** Zipfel 30/22 bei 900 px für alle Blasen, Vorgabe `replies/SPRECHBLASEN_SSOT_R2.md`, Antwort-Blasen ohne Farbpunkte.
- **V-1381:** bei Slops vermutlich keine Sprechblasen, sonst nur Standardblasen.
- **V-085:** Sprech-, Denkblasen und Comic-Wörter stehen als TBD auf der Checkliste.

## Tools
1. **KFB ChatterBox Studio v2** (Blasen dynamisch testen; Tabs Triplet-Bühne, Triplet-Review, Bühne, Dialog, **Blasen-Familie**, **Comic-Wörter**, **Stream · TTS**, Spec · Export; Schalter Rand Clay/Clay pur/Ink/Slab, Bühne 3D/2D, Text Kurz/Mittel/Lang/Überlauf, Viewport).
   Pfad: `/Users/georgv.westphalen/Dropbox/CLAUDE/KFB_CHATTERBOX_STUDIO_CLAUDE_DESIGN_SESSION_CUT_2026-10-05_r2/KFB ChatterBox Studio v2.dc.html`. Öffnen nur über einen lokalen Server im Ordner (`python3 -m http.server 8000`, dann `http://localhost:8000/KFB%20ChatterBox%20Studio%20v2.dc.html`); `file://` geht nicht. Braucht Internet (three, Fonts, GLBs). Anleitung `START_HERE.md`.
2. **KFB Pet Studio v12** (wahrscheinlich das „Pad-Studio“: Reiter Body, Face, Actor, Motion, **Voice**, **Bubbles**, **Pad**). Bubbles-Reiter = Shaper mit Formen rect/round/free, Stimmen scream…whisper, Wortlaut-Feld, Griffe, Feder, Zipfel-Bank.
   Pfad: `/Users/georgv.westphalen/Dropbox/CLAUDE/KFB Pet Studio/KFB Pet Studio v12 (WS0)/session-export_petstudio-v12_2026-09-10/code/petstudio-v9/KFB Pet Studio v12.dc.html`. Öffnen über lokalen Server im Ordner `code` und `petstudio-v9/KFB%20Pet%20Studio%20v12.dc.html`. Die Standalone-Datei `…/standalone/KFB Pet Studio v12 standalone.html` öffnet, lädt den Shaper aber nicht (fremde URL).
   Ältere Fassungen: `KFB Pet Studio v4 … v11`, `Pet Studio + 3D TableDiorama KFB (WS0 FULL EXPORT)/petstudio-v9/KFB FrizzleBob Studio v13.dc.html`, FrankenStein Studio v15–v17 in `KFB Vehicle + Rigging + Animation Lab(3)/`.
3. **Overworld v13 Blasen-Formen / Bubble-Fixtures** als Standalone: `/Users/georgv.westphalen/Dropbox/CLAUDE/KFB VoxelWorld/KFB Overworld v13-WS0/overworld-v13_2026-08-12/standalone/KFB Blasen-Formen v1 (standalone).html` und `… KFB Bubble-Fixtures v1 (standalone).html`.
4. **Sprachprobe R10.1** (Fluff-o-lect-Stufen in der Original-Blase): `/Users/georgv.westphalen/Dropbox/CLAUDE/KFB_HUB/40_AUDIO/kfb_language_r1/probe_r10_1.html`.
5. **Im Spiel:** Blasen erscheinen in jedem Stamm-Build; Antwort-Blasen mit `#wissen=r1`, Emanata mit `#emanata=1`, alte Innenabstände mit `#bubblepad=old`, Silben-Stimmen mit `#chat=syl`.

## Lücken
- **„Voice & Speech“-Tab:** Ein Tab mit genau diesem Namen wurde nicht gefunden. Gefunden: Pet Studio v12 mit getrennten Reitern **Voice**, **Bubbles** und **Pad**, und ChatterBox Studio v2 mit **Stream · TTS** und **Blasen-Familie**. Welches Georg meint, bitte bestätigen.
- **POW-artige Comic-Welten mit eigener Blasenklasse im Spiel:** nicht gefunden (Register, Hub, Stamm). Gefunden nur die Comic-Wörter-Bank (POW!/BAM! …) in ChatterBox Studio v2 und das Nachbar-Projekt FrizzleCrits/Cancel This Comic. Ein „Comic“-Story-Mode existiert nur als Farbe/Tonleiter.
- **N35-Ruf-Lettering (A, B, C, C2, Vorschau-Video, `RETURN.md`):** in `KFB_HUB/50_BLENDER/N35/` nur als 0-Byte-Platzhalter (Dropbox online-only). Bilder davon konnten nicht kopiert werden. Lokal ist nur `KFB_Ruf_Humbug.n35c.glb` (privat) lesbar.
- **Hub-Karten q152, q182/q183, q243/q244, q330/q331:** keine Blasen-Bilder im Archiv gefunden (q243 zeigt nur Werbetafel). q207 ist nur Video (13,9 MB, nicht kopiert).
- **Fluff-o-lect-Glyphen und Zensurbalken in der Blase:** entschieden, aber keine Bilder und kein Spielcode gefunden.
- **kfb-bubbles.v1 (PR #424):** Inhalt liegt auf GitHub-Branch, nicht lokal; nicht geprüft.
- **Herkunft der Vorlagen-Bögen `16_`–`18_`:** nicht dokumentiert.
