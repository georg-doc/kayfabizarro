# WS1_STATUS · R3F-Spielrahmen (Branch `ws1/r3f-frame`)

Stand: 14.10.2026, WS1 (Claude Code auf Georgs Mac). Empfänger: WS0. Regeln: Host-Vertrag R1.2, `KFB_WORKING_RULES_R1.md`, V-209, V-212, V-213.
Neueste Einträge oben (§8 ist der neueste). WS0 antwortet im Register-Branch `docs/kfb-decisions-register-2026-10-11`.

## 8 · 14.10. spät · S5a/S5b/S5c fertig · Billboard-Vorlagenzeile · Vorführung an Georg noch gesperrt

**Gelesen vor diesem Schritt:** `WS0_TO_WS1.md` (bis „Billboard-Standard V-220“), `DECISIONS.md` bis V-220, `BILLBOARD_STANDARD_R1.md`, `WIREFACE_STAGE_VISUAL_DONOR_FAIL_2026-10-14.md`.

**Stand:** S5a, S5b und S5c sind gebaut. Alle 9 Tests sind PASS: contract-static, deps, host, s0, s1, s1-view, s5a, s5b, s5c. Blinder Prüfer 3: PASS MIT AUFLAGEN, die Auflagen sind bearbeitet (Tabelle unten).

| Slice | Was | Vorlage (1:1) | Beleg |
|---|---|---|---|
| S5a Blase | `createBubbleLayer()` im Slot `#ui-bubbles`, `bubbleAnchors` über ModuleHost, Projektion pro Frame per `transform` (0 React-Renders beim Bewegen), Ausblenden hinter der Kamera und außerhalb des Bildes | `islands-npc.ts` (Blob 13ad2738) Z. 76–102 und 160–176; `chatterbox-core.js` (f59a8a1a) byte-gleich | `test/s5a.mjs`; Bildpaar `ws1/proofs/2026-10-14/s5a_pair.png` (links V204-Lab-Referenz, rechts Stand) |
| S5b Pool-Leser | Text nur aus ACCEPTED-Pool über `makePacket`/`consumePacket`, sonst wörtlicher Kartentext aus der Quelle, sonst „…“. Der Host zeigt nur Zeilen, die der Leser ausgegeben hat. Pool live über die Contents API (r5, Blob dfb5435b, 0 ACCEPTED), mit Zwischenspeicher gegen die Abruf-Grenze | `triplet-pool-core.mjs` (#365, Blob 517bb34b) byte-gleich | `test/s5b.mjs` (Node, deterministisch, 19 Prüfpunkte, darunter eine als TEST FIXTURE markierte ACCEPTED-Kopie) |
| S5c Spielerwahl | 2 × 2 Zurufe in fester Reihenfolge mit Tasten 1–4, Ziele ≥ 44 px, Stempel 420 ms, bis 8 eigene Wörter, Slot `#ui-choice`, Controller aus, folgt der Kamera, die Wahl wird zur Blase der Spielfigur | Studio v2 `choiceGeo()`, `place()`, Clay-pur-Antwortzeile; Vertrag „Zurufe (Player)“ | `test/s5c.mjs`; Bild `ws1/proofs/2026-10-14/s5c_choice.png` |

**S5c: Optik nicht abgenommen.** Das Studio (05.10.) ist älter als V-204 und V-214. Bewusste Abweichungen, im Kopf von `src/choiceLayer.js` aufgeführt:
1. Der Blasenkörper ist derselbe Plain-Körper wie bei der Sprechblase, ohne Rim-Wände.
2. Der Tastenkreis hat keinen Tusche-Rand.
3. Stempel und Hover haben keinen harten dunklen Schatten.
4. Es gibt noch kein Ausweichen vor Gesichtern (erst mit F1).
5. Die Zeile für eigene Wörter ist neu.

**Bitte:** Die Auswahl im Bild prüfen, bevor Georg sie sieht.

**Aufgeräumt (§5, Prüfer 3 Befund 8):** Der Spike-Dialog setzte noch Sätze aus Kartenstücken und Verbindern zusammen. Entfernt sind `LineBuilder`, `fragments`, `pickFragments` und `CONNECTORS`. Im Ritual stehen Power und Lore jetzt wörtlich. Erzählzeilen sind bis D1 ein Schnitt („…“).

**Blinder Prüfer 3 (S5a–c): PASS MIT AUFLAGEN**
| # | Befund | Stand |
|---|---|---|
| 1 | zweiter Renderer für den Blasenkörper der Wahl | behoben: ein `bubbleBodySvg()` für beide |
| 2 | mehr Studio-Abweichungen als dokumentiert (`place()` verkürzt, Mobil-Zweig, Umbruch, Wand-Schatten) | behoben: `place()` vollständig, Mobil-Zweig, Umbruch, Clay-pur-Stil mit Wand; Liste der Abweichungen korrigiert |
| 3 | Hover und Fokus fehlten | behoben (Anhebung −2 px, Fokus 3 px #e2b33c) |
| 4 | `parts` blieb veränderbar | behoben (tief eingefroren, Test) |
| 5 | beliebiges Kartenobjekt ergab eine CARD-Zeile | behoben: Text nur aus der Kartenquelle, Fremdkarte → „…“ (Test) |
| 6 | Zuruf und eigene Wörter nicht an die Spielfigur gebunden | behoben: `speaker: 'player'`, der Host prüft das (Test) |
| 8 | LineBuilder erzeugt Triplets und Brücken | behoben (siehe oben) |
| 9 | S5 ohne Debug-Schalter nicht sichtbar | offen bis D1: Wahl und Pool-Zeilen bekommen ihre Aufrufer im Dialog-Modul |
| 10 | Zipfel der Wahl zeigte ins Leere und folgte der Kamera nicht | behoben: Anker knapp über dem Kopf, folgt pro Frame (Test mit Mausrad-Zoom) |
| 11 | gleicher Rang wie die Dialog-Auswahl | behoben (`PRIO.playerChoice` 35); kein Escape, wie im Studio („steht bis zur Auswahl“) |
| 13 | Testlücken | weitgehend behoben (s5b +7 Fälle, s5c Zipfel und Folgen); `livePoolLoaded` hängt am Netz |
| 16 | Gesamtbild nicht vorführbar | **siehe Frage 8.2** |

**8.1 · Vorlagen-Zeile Billboard (V-220), bitte freigeben**
- **Gibt es schon:**
  - Branch `work/billboard-island-integration-01-2026-10-01`, Ordner `KFB_WORLD_BILLBOARD_CLAY01_CLAUDE_DESIGN_SESSION_CUT_2026-10-01_r2/`;
  - `briefd/billboard-clay.js` (Blob 5c9f22e1), Exporte `Billboard`, `BillboardScheduler`, `makeClayFamily`, `loadContent`, `STYLES` (mit `plain`), `layoutFor`;
  - Einbau-Vertrag `billboard.embed-spec.v1.json` (Blob 4be98228).
- **1:1 übernommen:**
  - `billboard-clay.js` unverändert. Die Imports `three` und `three/addons` löst Vite auf die eine Instanz 0.186.1 auf.
  - `bodyStyle: 'plain'`, runde Innenecken (`faceCornerM`), Bildfläche 12 × 6 m mit CanvasTexture 1024 × 512, genau ein `BillboardScheduler.tick()` im Host-Frame.
- **Neu, und warum:**
  - eine dünne Modul-Hülle `createBillboard(options)` nach `create/update/dispose`;
  - eine Inhaltsquelle „Karte“: `cardImage(deckId, n)` wird `fit` in die 1024 × 512-Fläche gezeichnet, statt der Kaleido-Inhalte aus `contentAsset`;
  - `billboard-stage.js` wird **nicht** übernommen (eigene Szene, Kamera und OrbitControls; Vertrag §1).
- **Offen:**
  - Hypernormalisation/H13: Laut RETURN 07.10. ist noch kein Zitat für die Laufzeit freigegeben. WS1 baut deshalb zunächst Körper + Karte + Scheduler und lässt die Lesefolge bis zur Freigabe leer.
  - Der Knet-TV-Knopf unter dem Billboard kommt mit der Lesefolge, als Teil desselben Schedulers (kein zweiter).

**8.2 · Vorführung an Georg: Vorschlag, S1 + S5a erst nach Billboard und F1 zu bündeln.** Heute stehen Karten als flache Rechtecke auf Bühne und Turm (gegen V-220). Die Spielfigur ist ein KayKit ohne KFB-Eye-Rig (gegen V-214). Die Kulisse ist die Hex-Insel (Legacy, V-216). Prüfer 3 nennt das Gesamtbild deshalb nicht vorführbar. Vorschlag: Reihenfolge F1 Augen → Billboard → Vorführung „Karte im Billboard + Blase + Wahl, Figur mit Eye-Rig“ auf einem kompakten Clay-Boden statt Hex. Die Karten-Aufsteller auf Bühne und Turm fallen dann weg oder gehen ins Billboard.

**8.3 · Für Claude Design (Triad-Gate im Fail-Protokoll):** Zwei der drei positiven Quellen liegen als echte Renderings aus dem Code-Pfad vor:
- (A) Plain-Blase: `ws1/proofs/2026-10-14/s5a_pair.png`;
- (B) Querformat-Karte, je gegen eine unabhängige PDFKit-Referenz: `ws1/proofs/2026-10-14/s1_pair_forget_utopia_7.png` und `s1_pair_protopia_web_2.png`.
(C) Eye-Rig folgt mit F1.

## 0 · Kurzstand
| Slice | Stand | Beleg |
|---|---|---|
| Host-Vertrag | `test:host` PASS auf Georgs Mac (V-211-Kriterium) | `ws1/kfb-planet/test/host.mjs` |
| S0 Host-Gerüst | fertig, Tests grün | `test/contract-static.mjs`, `test/deps.mjs`, `test/s0.mjs` |
| S1 Kartenbilder | fertig, Tests grün. Blinder Prüfer 1: PASS MIT AUFLAGEN; Prüfer 2 (auf die Nacharbeit): FAIL wegen Freigabe je Deck → behoben (§2) | `test/s1.mjs`, `test/s1-view.mjs`, Bildpaare §1 |
| S5a/b/c, D1 | als Nächstes (S5a entsperrt durch `replies/lab-donors/`) | – |
| Zur Abnahme durch Georg | bereit aus WS1-Sicht nach Prüfer 2 + Behebung; **Freigabe durch WS0** (V-213). Vorschlag: Prüfer 3 nur auf die Behebung, falls WS0 das verlangt | – |

Code: `ws1/kfb-planet/` (Vite + R3F, Versionen exakt nach Vertrag §1). Prüfen: `cd ws1/kfb-planet && npm ci && npx playwright install chromium && npm run build && npm test` (braucht Netz für die Karten-PDFs). Alle sechs Tests PASS: contract-static, deps, host, s0, s1, s1-view.
Host-Vertrag R1.2 liegt unverändert als `KFB_HOST_CONTRACT_R3F_R1.md` im Branch-Wurzelordner, zur V-Nummer durch WS0.

## 1 · S0 und S1 im Einzelnen

**S0 Host-Gerüst** (Vertrag §1, §3, §4, §6)
- Feste Host-Slots `#ui-bubbles` und `#ui-choice` (`index.html`).
- Ein Tasten-Router (`src/hostKeys.js`): eine Tastatur-Map, ein eigener keydown-Listener; Bewegung liest ecctrl über drei-`KeyboardControls` (Falle 3). Rangfolge Auswahl > Dialog > Editor > Figur.
- Dialog offen → Controller aus (§3.5). **Eigener Befund dabei:** Ein abgeschaltetes ecctrl rechnet weder Bremse noch Schwerkraft (Welt-Schwerkraft ist 0); die Figur glitt ungebremst weiter und kletterte Stufen hoch. Fix: Der Host setzt bei offenem Dialog jede Frame `linvel = 0` (`src/Player.jsx`). Test: W 4 s ohne Dialog → läuft, mit Dialog → 0,00 m.
- Dialog offen im Flug: Flugsteuerung aus, die Figur schwebt bis zum Schließen. Springt die Figur und ein Dialog öffnet sich in der Luft, bleibt sie dort stehen und fällt nach dem Schließen normal (bewusst so, dokumentiert).
- Fester Zeitschritt 1/60 (Schalter `#vary` entfernt). Debug nur `window.__kfb*` **und** nur mit URL-Schalter `#debug`/`#hosttest` (`src/debug.js`; Test: ohne Schalter kein `__kfb*` am window). Ausnahme dokumentiert: `window.OW_SRC`/`OW_ART` ist der Vertrag der Vorlage card-art-2d, kein Debug-Zugang.

**S1 Kartenbilder** (Vertrag §5)
- `cardImage(deckId, n)` (`src/cardImage.js`) = dünne Hülle über `src/vendor/card-art-2d.js`, **byte-gleich** mit `overworld-v13/card-art-2d.js` @main (Blob `d14b497e`), Aufruf `OW_ART.quarter()` = derselbe Code-Pfad wie im Lab-Almanach (V-206). Viertelseite, `fit`, ohne Tusche, pdf.js 4.7.76 ESM.
- Kartenquelle festgenagelt: `media/kfb` @ `ac9dbaed` (index.json Blob `af276a8b`).
- Echte Bilder auf Turm, Bühne (Aufsteller), Actor über der Figur, Planeten-Szene, Dialog und Sammlung. Platzhalter (wörtlicher Kartentext, Spike-Canvas `cardTextureLandscape`) bleibt nur während des Ladens und als Rückfall, wie in der Vorlage („Textblatt bleibt stehen“).
- **Nur Karten mit geprüfter Zuordnung zeigen PDF-Bilder** (§3.2), Freigabe je Karte: `src/cardMapping.js` liest `src/data/mapping-audit.json`; 45 von 78 Nicht-MED-Decks SAFE, darin 2344 Karten freigegeben, 114 einzeln gesperrt. Der Turm baut nur aus freigegebenen Karten. Fester Turm per URL-Schalter `#seed=N`.

**Bildpaare** (links Referenz, rechts Stand; Referenz unabhängig von pdf.js: macOS PDFKit über `scripts/crop.swift` aus MODULE_INVENTORY_R1/proofs, Titel mit Apple Vision gelesen)
| Karte | Seite/Viertel | mittlere Abweichung (0–255) | Titel im Bild (OCR) | Name im JSON |
|---|---|---|---|---|
| `forget_utopia` #7 | 3 / unten links | 10,4 | THE MOVING LAUNCH DATE | The Moving Launch Date |
| `protopia_web` #2 (erste Turmkarte bei `#seed=4242`) | 2 / oben rechts | 6,08 | The Dystopian Apathy | The Dystopian Apathy |

Trennschärfe (Prüfer 1): gleiche Karte ~10, Nachbarkarte derselben Seite 43–57, 3 px Versatz 36; Schwelle 14.

## 2 · Blinder Prüfer 1 (S0+S1): PASS MIT AUFLAGEN, 15 Befunde
| # | Befund | Schwere | Stand |
|---|---|---|---|
| 1 | Turmkarte zeigt anderes Bild als ihr Name (`suppressed_book_deck` #13) | sollte | **behoben und ausgeweitet**: eigenes Audit aller Decks (§3.2), Bilder nur für freigegebene Karten |
| 2 | Wachhund-Timer nie gelöscht, falsche Warnungen nach 20 s | sollte | behoben |
| 3 | „neu versuchen“ greift nicht, wenn pdf.js einmal scheitert (`libTried`) | sollte | teilweise: neuer Versuch nach 10 s bzw. wenn der Tab wieder sichtbar wird; `libTried` liegt in der Vorlage → Befund an WS0 (§3.1) |
| 4 | Test prüft Name gegen Name, nicht gegen Bild | sollte | behoben: Titel-OCR der Referenz gegen den Namen |
| 5 | Turm-Test nicht deterministisch (`Date.now()`) | sollte | behoben: `#seed=N` |
| 6 | Bühnen-Aufsteller ohne eigenen Test | kann | offen: Aufsteller nutzen denselben Textur-Cache-Schlüssel wie die Turmkarten, kein eigenes Bildpaar |
| 7 | `s1-view` nicht in `npm test`, kein Turm-Bildpaar | kann | behoben |
| 8 | Speicher ohne Räumung | sollte | festgehalten als bewusster Sitzungs-Cache (~60 MB je Turm), Kommentar in `cardImage.js` |
| 9 | toter Code `cardTexture` (Hochformat) | sollte | entfernt; Platzhalterweg oben benannt |
| 10 | „genau ein keydown-Listener“ stimmt zur Laufzeit nicht wörtlich | kann | umformuliert (Router + KeyboardControls) |
| 11 | `window.OW_*` nicht erfasst | kann | als Ausnahme dokumentiert und geprüft |
| 12 | Controller-Test bestätigt sich selbst | kann | behoben: Gegenprobe Bewegung (fand den Gleit-Fehler aus §1) |
| 13 | Konsolen-Warnungen lassen Tests nicht scheitern | kann | behoben (Warnungen der Kartenkette = FAIL) |
| 14 | Actor-Karte über der Figur steht schräg | kann | offen, Altlast aus dem Spike (gleich in 745431d) |
| 15 | S1 ist kein Modul nach create/update/dispose | kann | Frage an WS0 (§4.3) |

**Blinder Prüfer 2 (Nacharbeit c7f4d3f): FAIL, 1 blockierend, 7 weitere**
| # | Befund | Schwere | Stand |
|---|---|---|---|
| 1 | Freigabe je Deck lässt falsche Einzelkarten durch (85 von 2683 Karten in SAFE-Decks) | blockierend | **behoben**: Freigabe je Karte, Test mit gesperrten Beispielkarten (`anti_rules_toolkit` #51, `big_bad_brain_wrestling` #50/#51, `romantic_kayfabe` #55) |
| 2 | Matching je Karte zu locker („THE“ zählt, Nachbartext), kyrillisch/Umlaute zu streng | sollte | behoben: Füllwörter raus, Unicode erhalten, eigener Name muss besser passen als jeder andere des Decks |
| 3 | Im Flug ignoriert die Figur den offenen Dialog | sollte | behoben, Test: fliegen, Dialog auf, W + Leertaste 3 s → 0,00 m |
| 4 | In der Luft bleibt die Figur bei offenem Dialog stehen; Debug-Teleport bei offenem Dialog lässt sie schweben | kann | dokumentiert (§1); Teleport-Fall nur über Debug erreichbar |
| 5 | Kein neuer Versuch bei Fehlschlag im sichtbaren Tab; möglicher Flackern bei neuem Versuch | sollte | behoben: Timer 10 s; fertige Karten laden nicht neu |
| 6 | Gesperrte Karten zählen als Fehlschlag | kann | behoben (`blocked` statt `failed`) |
| 7 | Testlücken (Name gegen Bild nur für 2 bekannte Karten, Regel nur Teilmenge, Flug ungetestet) | sollte | behoben bis auf: Name gegen Bild weiterhin an 2 Referenzkarten plus Audit für alle |
| 8 | Turmbild ohne Referenz; Debug-Globals ohne URL-Schalter | kann | Debug behoben; Turmbild bleibt Sichtprüfung (die erste Turmkarte hat ein Bildpaar) |

## 3 · Befunde für WS0

**3.1 · Vorlage `card-art-2d.js` (overworld-v13, Blob `d14b497e`), nicht geändert**
- Gleichzeitige Aufrufe von `quarter()`: Nur der erste bekommt ein Bild. `ensureLib()` setzt `libTried = true` vor dem Laden von pdf.js; jeder zweite Aufruf während dieses Ladens bekommt still `null`, ohne Warnung. Im Lab fällt es nicht auf, weil `art()` über eine Warteschlange läuft, `quarter()` aber nicht. WS1 reiht die Aufrufe in der Hülle ein (`src/cardImage.js`).
- Scheitert der erste pdf.js-Import (Netz, Wachhund), bleibt das Modul für die Sitzung ohne pdf.js (`libTried`), jeder weitere Aufruf liefert `null`.
- `quarter()` hat keinen Wachhund (pdf.js rendert über rAF und hängt im Hintergrund-Tab); WS1 hat ihn in der Hülle ergänzt.

**3.2 · Registry `media/kfb/index.json` @ac9dbaed: Kartenzuordnung bei 33 von 78 Decks nicht belegbar, dazu 114 Einzelkarten in den übrigen**
Methode: `scripts/audit-mapping.py` + `scripts/audit-mapping.swift`: jede Kartenseite mit PDFKit rendern, Viertel nach Registry-Regel schneiden, Text mit Apple Vision lesen, Titel gegen `cards.json` (Registry @ac9dbae). Karte ok = eigener Name im Titelbereich (≥ 0,75) und besser als jeder andere Kartenname des Decks; Deck SAFE = mindestens 85 % der lesbaren Karten ok; Bild nur für Karten in `ok`. Rohdaten je Deck (OCR-Zeilen je Viertel): `ws1/kfb-planet/test/audit/`, Ergebnis: `src/data/mapping-audit.json`.
- **15 Decks um genau eine Seite verschoben**: Das Viertel n zeigt Karte n+4. Die PDFs haben kein Deckblatt, die Registry sagt aber `coverOffset 1`. Vermutlich ist `coverOffset 0` richtig, siehe Tabelle.
- 2 Decks ohne PDF auf GitHub (404).
- Bei den übrigen passen nur einzelne Karten, oder die Abweichung ist uneinheitlich. Belegte Einzelfälle (Prüfer 2, per PDFKit-Bild angesehen): `anti_rules_toolkit` „The Skill Issue“ doppelt in cards.json (#50/#51), ab da um eine Karte verschoben; `big_bad_brain_wrestling` #50/#51 vertauscht; `romantic_kayfabe` #54–#56 auf einer Hochformat-Seite; `unspoken_systems_kayfabizarro_meta_deck_01` #38 „TIGHT LOOP“ im JSON, „TRUST LOOP“ im Bild.
- **Bitte:** Die Registry-Daten sollte ihr Eigentümer korrigieren, nicht das Spiel. WS1 zeigt für diese Decks bis dahin nur den Platzhalter mit wörtlichem Kartentext und baut aus ihnen keinen Turm.


| Deck | Karten eindeutig belegt | Befund |
|---|---|---|
| `1001_kayfabe_nights` | 0/53 | ganze Seite verschoben (Viertel n zeigt Karte n+4) |
| `anti_rules_toolkit` | 39/57 | einzelne Karten abweichend oder unlesbar |
| `bullshit_jobs_uncut` | 43/56 | einzelne Karten abweichend oder unlesbar |
| `cosmic_grift_dark_journalism` | 0/56 | ganze Seite verschoben (Viertel n zeigt Karte n+4) |
| `deep_state_plumbing` | 36/52 | einzelne Karten abweichend oder unlesbar |
| `epistemic_sabotage` | 0/56 | ganze Seite verschoben (Viertel n zeigt Karte n+4) |
| `federal_kayfabe` | 0/56 | teils verschoben (+4), uneinheitlich |
| `frizzlebob_s_ego_mania_narcissist` | 37/56 | einzelne Karten abweichend oder unlesbar |
| `frizzlebob_s_kayfabizarro_kompendium_elender_wic` | 0/60 | ganze Seite verschoben (Viertel n zeigt Karte n-4) |
| `frizzlebob_s_mission_control` | 30/56 | einzelne Karten abweichend oder unlesbar |
| `geopolitical_thrillers_conspiracy_theories` | – | PDF fehlt (404) |
| `grimms_kayfabe_legends_expansion_set_02` | 0/52 | teils verschoben (-4), uneinheitlich |
| `help_i_am_a_human` | 0/56 | ganze Seite verschoben (Viertel n zeigt Karte n-4) |
| `jung_and_shinn_a_guide_to_cosmic_cringe` | 0/56 | ganze Seite verschoben (Viertel n zeigt Karte n+4) |
| `kayfabizarro_improv_comedy` | 0/56 | ganze Seite verschoben (Viertel n zeigt Karte n+4) |
| `kayfabizarro_monomyth_mayhem` | 35/56 | einzelne Karten abweichend oder unlesbar |
| `kayfabizarro_pulitzer_punk` | 0/56 | ganze Seite verschoben (Viertel n zeigt Karte n+4) |
| `kayfabizarros_ontological_hazards` | 11/47 | teils verschoben (-4), uneinheitlich |
| `museum_of_modern_mess` | 0/48 | ganze Seite verschoben (Viertel n zeigt Karte n+4) |
| `nibelungen_booster_pack_design` | 0/56 | ganze Seite verschoben (Viertel n zeigt Karte n+4) |
| `observation_underground` | 37/48 | einzelne Karten abweichend oder unlesbar |
| `philosopher_dungeon_raid` | 0/10 | teils verschoben (-4), uneinheitlich |
| `platos_dungeon_raid_hero_set_01` | – | PDF fehlt (404) |
| `reality_redrawn` | 0/56 | ganze Seite verschoben (Viertel n zeigt Karte n+4) |
| `shadow_monopoly_blackrock_vanguard_co` | 0/56 | ganze Seite verschoben (Viertel n zeigt Karte n+4) |
| `shakespearean_animal_beatdown` | 0/5 | einzelne Karten abweichend oder unlesbar |
| `suppressed_book_deck` | 0/20 | teils verschoben (-4), uneinheitlich |
| `the_biological_metropolis` | 0/32 | ganze Seite verschoben (Viertel n zeigt Karte n+4) |
| `the_biology_of_rebellion_hilfe_ich_bin_ein_mensc` | 0/32 | ganze Seite verschoben (Viertel n zeigt Karte n+4) |
| `the_carnival_of_unsolved_problems_therapy` | 0/44 | ganze Seite verschoben (Viertel n zeigt Karte n+4) |
| `the_importance_of_being_kayfab_earnest` | 0/9 | teils verschoben (+4), uneinheitlich |
| `the_uruk_rumble` | 0/0 | einzelne Karten abweichend oder unlesbar |
| `unspoken_systems_kayfabizarro_meta_deck_01` | 46/56 | einzelne Karten abweichend oder unlesbar |

SAFE-Decks mit einzeln gesperrten Karten (114 Karten in 38 Decks), Liste je Deck in `src/data/mapping-audit.json` (Feld `blocked`).

Zählung: 45 von 78 Nicht-MED-Decks SAFE, 2344 Karten mit freigegebenem Bild.

## 4 · Fragen an WS0 (keine blockiert den nächsten Slice)

**4.1 · Hex-Insel gegen V-194.** Der Integrationsplan R1 (13.10.) sagt „Diese Teile bleiben: … Hex-Insel und Deck-Turm“ und plant S2 Clay „für Hex-Boden“. V-194 (12.10.) sagt „Hex-Raster ist Legacy und keine Grundlage“. Georg hat das am 14.10. bemerkt. Empfehlung des WSA-Web-Chats (von Georg weitergereicht), der WS1 folgt, bis WS0 entscheidet:
- Die Hex-Insel ist nur noch eine **ausdrücklich als Legacy bezeichnete Testkulisse**. Karten, Eingabe, Figuren und Blasen sind davon entkoppelt (für S0/S1 erfüllt: nichts davon hängt am Hex-Raster). Der Deck-Turm wird keine architektonische Voraussetzung.
- S2 Clay wird nicht auf Hex-Boden ausgerichtet.
- Für die erste Wireface-/ChatterBox-Bühne: kompakter, organischer Clay-Boden mit flacher Spielfläche, Billboard, zwei Figuren, Blasen, Kontaktschatten, SKY3, ohne ganze Inselwelt.
- Terrain/God-Mode später über den bestehenden Worldbuilder-Owner (WB2/Surface-Truth-Donors); ein versteckter Hex-Index nur, wenn er messbar gewinnt.
- **Bitte:** Integrationsplan R1 gegen V-194 korrigieren und die Terrain-Frage an den Worldbuilder-Owner geben.

**4.2 · Registry-Korrektur (§3.2).** Wer korrigiert `coverOffset` der 15 verschobenen Decks, die 2 fehlenden PDFs und die Einzelfälle in `cards.json` (z. B. doppelter Name in `anti_rules_toolkit`)? Nach einer Korrektur: neuen `MEDIA_COMMIT` nennen, WS1 lässt das Audit neu laufen (`python3 scripts/audit-mapping.py`).

**4.3 · Einordnung S1.** `cardImage()` ist kein Modul nach `create/update/dispose`, sondern ein Host-Dienst (liefert three-Texturen, kein `object3d`), und hat deshalb keinen Vertragstest nach `test/host.mjs`. Bitte bestätigen oder anders einordnen.

**4.4 · V-Nummer für Host-Vertrag R1.2** (Datei im Branch-Wurzelordner, unverändert aus dem OneDrive-Ordner WS1).

## 5 · Pool-Kandidaten für Georgs Ankreuz-Seite (V-213 Punkt 2c)
Quelle: `skills/chat/workflows/KFB_CHATTERBOX_VOICE_V1_2026-10-08/data/KFB_TRIPLET_OPENER_POOL_R1_2026-10-13.json` auf PR #379, Head `d788e429`, Blob `dfb5435bc0c913ea48f8f5558f801b293962fbc8` (= „final r5“ laut Consumer-Vertrag #365). Alle Einträge, die nicht ACCEPTED sind. Text wörtlich (`pattern` bzw. `surfaceText`), nichts umformuliert, nichts ergänzt. `{title}` ist der Platzhalter für den Kartennamen und gehört zum Text.


| # | Art | ID | Version | Status | aktiv | Text (wörtlich) |
|---|---|---|---|---|---|---|
| 1 | Opener | `DIRECT` | 1 | EDITORIAL_CANDIDATE | ja | {title}. |
| 2 | Opener | `HEARD_OF` | 1 | EDITORIAL_CANDIDATE | ja | Ever heard of {title}? |
| 3 | Opener | `DO_YOU_KNOW` | 1 | EDITORIAL_CANDIDATE | ja | Do you know {title}? |
| 4 | Opener | `EVER_TASTED` | 1 | EDITORIAL_CANDIDATE | ja | Ever tasted {title}? |
| 5 | Opener | `I_ONCE_MET` | 1 | EDITORIAL_CANDIDATE | ja | I once met {title}. |
| 6 | Opener | `RESTAURANT_ORDERED` | 1 | EDITORIAL_CANDIDATE | ja | I went to a restaurant and ordered {title}. |
| 7 | Opener | `ANYONE_HEARD_OF` | 1 | PROPOSED | nein | Anyone here heard of {title}? |
| 8 | Opener | `LET_ME_TELL_YOU_ABOUT` | 1 | PROPOSED | nein | Let me tell you about {title}. |
| 9 | Opener | `QUICK_QUESTION` | 1 | PROPOSED | nein | Quick question. Ever heard of {title}? |
| 10 | Opener | `YOU_KNOW_THE_THING_WITH` | 1 | PROPOSED | nein | You know the thing with {title}? |
| 11 | Opener | `DID_YOU_EVER_TRY` | 1 | PROPOSED | nein | Did you ever try {title}? |
| 12 | Opener | `WHAT_IF` | 1 | PROPOSED | nein | What if {title}? |
| 13 | Opener | `HAVE_YOU_HEARD` | 1 | PROPOSED | nein | Have you heard of {title}? |
| 14 | Opener | `EVER_HEARD_BEFORE` | 1 | PROPOSED | nein | Have you ever heard of {title}? |
| 15 | Beat | `wrinkle_rumble:10:compact` | 3 | EDITORIAL_CANDIDATE | – | The Cookie of Causality restarts the war over a snickerdoodle at Turn One, but keeps all the damage. |

Summe: 15 Einträge nicht ACCEPTED. ACCEPTED: 0.

## 7 · Neu 14.10. spät: Stopp für Figuren und Gesichter (Georg), Frage an WS0 (blockiert D1)
Georg hat am 14.10. zwei Abweichungen gefunden: das Hex-Raster (§4.1) und fehlende KFB-Gesichter. Die Figuren im Rahmen sind KayKit-Originale, ohne KFB-Eye-Rig und ohne Mund. Für Wireface braucht es beides. Der Integrationsplan R1 sieht keinen Gesichts-Slice vor. Register: V-061/V-090 (Eye-Rig in Georgs Konfiguration, EYE-CLEANUP-01), V-200/V-201 FAIL (eigener Slice „Augen-Wiederherstellung“ 1:1 aus dem Eye-Rig-Studio), V-086 (KFB-Münder, Backlog), V-179 (Brauen jetzt, Mund später), PR #355 (Gesichtskanäle gehören dem Composer: KFB_NATIVE | WIREFACE_MESH | WIREFACE_MODEL, je Region genau ein Treiber).
- **WS1 baut bis zur Entscheidung nichts mit Figuren oder Gesichtern** (D1-Sprecher, Wireface). S5a (Blasen-Ebene) hängt nicht an Figuren und läuft weiter. S5b und S5c ebenso.
- **Frage 4.5 an WS0:** Ein Gesichts-Slice vor D1: Woher kommen Eye-Rig, Brauen und Mund? Vorschlag: aus dem nativen Gesichtsteil des Composers (#355), als Modul nach `create/update/dispose` eingehängt. Mit welcher Abnahme (Nahbild-Paar Studio | Spiel, V-201)?
- **Frage 4.6 an WS0:** Referenzbild für V-204. Im Repo liegt nur `evidence/s2_bubble_still.jpg` aus dem ChatterBox-Studio-Cut. Es zeigt die alte Tusche-Variante und Figuren ohne KFB-Augen, ist also kein gültiges Referenzbild. Bitte ein abgenommenes Standbild der Plain-Blase aus dem Lab in `replies/lab-donors/` legen. Bis dahin prüft der S5a-Test die V-204-Merkmale am gezeichneten SVG (nur Flächen, kein Strich, ein Zipfel, Schatten, Flip 520 ms).
- **Neue WS1-Regel gegen Drift:** Vor jedem sichtbaren Baustein prüft WS1 die Vorlage gegen `DECISIONS.md` und nennt die betroffenen V-Nummern in der Vorlage-Zeile. Eine Vorlage, die älter ist als eine Entscheidung, die sie ablöst, zählt nicht als Referenz. Der blinde Prüfer bekommt `DECISIONS.md` mit.

## 6 · Als Nächstes
1. **S5a Blase:** `createBubbleLayer({host})` aus `replies/lab-donors/islands-npc.ts` (`say/layoutTri/draw`, Blob `13ad2738`) herauslösen, `chatterbox-core.js` 1:1 (V-204 plain, Flip 520 ms), Host projiziert `bubbleAnchors` in `#ui-bubbles` (Vertrag R1.2 §4, V-212). Aus dem Lab-Weg wird **nur die Darstellung** übernommen: Das Lab holt seine Zeilen über `prepareResidentTurn` aus `RUNTIME_POOL` (PR #310). Das ist nicht der KEEP-Pool (#379) und wird nicht verwendet.
2. **S5b Pool-Leser:** `consumePacket` aus `triplet-pool-core.mjs` (#365), accepted-only. Solange nichts ACCEPTED ist: wörtlicher Kartentext der eigenen Karte (Name, Power oder Lore, unverändert) oder „…“.
3. **S5c Spielerwahl** „choice“ 2 × 2 in `#ui-choice`, Zifferntasten, optional bis 8 eigene Wörter.
4. **D1 Dialog-Modul:** Regel-Logik aus Spike-`Dialog.jsx`, ohne LineBuilder, `fragments` und `CONNECTORS`. **Wartet auf die Antwort zu §7 (Gesichter).**
