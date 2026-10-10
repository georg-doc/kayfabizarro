# Architektur-Review R1 · Post-MVP-Konzepte (Fluff, Academy, Reputation) gegen Lab und MVP

Stand: 2026-10-09 · Claude Code (Lab-Steuerung) · **Nur Lese-Review.** Kein Gameplay-Test, kein Laufzeit-Code. Antwort auf `HANDOVER_CLAUDE_CODE_DECK_WORLD_REPUTATION_FLUFF_V11.md`.

## 0 · Gelesene Quellen

| Quelle | Ref |
| --- | --- |
| Fluff-Branch `planning/kfb-fluff-crafting-almanac-ideation-2026-10-09`: v0.3 Crafting/Almanac, v0.4 Play·Craft·Learn, v0.5 Genesis/UFO, v0.6 Angeln/Farm/Blast, v0.7.1 Blast-Mining/Loot/lebende Props, Return v0.7.1 | `06dbf2e3` |
| Academy-Branch `planning/kfb-ai-game-art-academy-makerspace-v05-2026-10-09`: Reputation sechs Stufen v1.1 (+ Fixture), Gatekeeper-Grammatik v1.0, Gott-Modus-Werkzeug-Zensus v0.7, Holographic World Foundry v0.8, Handover an Claude Code | `624123ac` |
| Main: `DECK_WORLD_SEED_CARD_PIPELINE_2026-10-04.md` (§4, §8), `SITE_GODMODE_LEAN_MEMORY_ARCHITECTURE_2026-10-04.md` (§10, §11, §17), `registry/assets/v1/decks/embrace_protopia.json` | `909828ef` |
| Lab-Code (lokal = Sync-Branch `3c9d7379` plus diese Änderung): `src/island/spec.ts` (`WorldSpec`, `IslandSpec`, `ResidentSpec`), `src/main.ts` (localStorage `kfb.worldbuilder.v1`), `src/editor.ts` (JSON-Export, `newId`), `src/island/roadbed.ts` (`kfb.island-outline/1`, Rim-Profile) | lokal |

## 1 · Befund in einem Satz

Die Konzepte passen zur Architektur. Sie bauen auf denselben Grundsätzen auf (eine Wahrheit je Bereich, `deckId + cardNumber`, Rezept statt Mesh, Chill als Standard). **Im Lab-Code gibt es heute nur Autoren-Zustand** (Welt-JSON). Spielstand, Karten-Sammlung, Wallet, WorldGraph, Ereignis-Ledger und Gatekeeper existieren noch nirgends als laufender Code, auch nicht auf Main (§17 der Lean-Memory-Architektur sagt das selbst). Ein P0-Bruch existiert nicht. Vier kleine **Datenfelder** im geplanten Insel-Rezept verhindern einen späteren Umbau; sie sind jetzt in der Spec eingetragen (§4).

## 2 · Verträglichkeits-Matrix

| # | Thema | Urteil | Begründung, Ort |
| --- | --- | --- | --- |
| 1 | `deckId + cardNumber`, eine Almanac- bzw. PlayerSave-Wahrheit, Karte in Kurier-Obhut ohne zweites Bag-Objekt | **KEEP** (Vertrag) · **AFTER_MVP** (Code) | Vertrag steht auf Main (Lean Memory §10/§11 „Card rule“). Im Lab gibt es noch keinen Spielstand. Regel ergänzt: Das Insel-Rezept speichert nie Spielerzustand. |
| 2 | Insel mit 0…n Decks, feste Welt-, Deck- und Bewohner-IDs | **ADAPT** (erledigt in der Spec) | Spec hatte 0…n, aber das Beispiel nutzte den PDF-Namen statt der Registry-ID. Bewohner hatten keine Trennung Instanz ↔ Figur. Deck-Pipeline §4 sagt „one primary deckId“ → jetzt `decks: [{ deckId, role: primary|linked }]`. Im Code: `IslandSpec` hat noch kein `decks`; IDs neuer Inseln sind `isl-<zeit>` (stabil nach dem Speichern, aber nicht lesbar). |
| 3 | Erste Karte bzw. Welt entdecken, lesbarer WorldGraph, Schwelle | **AFTER_MVP** · Andockstelle **KEEP** | Zustände `DISCOVERED / ROUTE_KNOWN / ENTRY_GRANTED / VISITED / FAST_TRAVEL_KNOWN` gehören in den Spielstand, nicht ins Rezept. Das Rezept liefert nur Anker mit `kind: threshold | portal | dock | road`. |
| 4 | Genau sechs abgeleitete Reaktionsstufen je Deck, Welt und NPC, Valenz getrennt | **KEEP** (als reiner Selektor) · **AFTER_MVP** | Ein reiner Selektor über Sammlung, Beziehung und Belege braucht keinen eigenen Speicher. Wichtig: Welten mit mehreren Decks dürfen die Zählung nicht addieren; Town hat 0 Decks und leitet nur aus Ereignissen ab. Die Schwellen 0/1/3/10/28/51 bleiben Vorschlag. Das ältere 5er-Enum `relationshipBand` bleibt Besitzer der Beziehung, die sechs Stufen sind nur Anzeige. |
| 5 | Gefallen, Kurier, Maker-Geschenke, verlorene Kämpfe → Belege → NPC-Reaktion; Gerücht nur ein Schritt weit | **KEEP** · **AFTER_MVP** | Andockstelle ist die Figuren-Karte (`voice`, `expressions`, `SPEC_CHARACTER_INTEGRITY_R1.md`) plus ChatterBox. Im MVP (Stufe 4a) spricht die Stimme nur feste Zeilen. Regel: Generierter Text vergibt nie Karten oder Rechte. |
| 6 | Eine deterministische Gatekeeper-Entscheidung für Straße, Fuß, Flug, Portal, Neuladen | **ADAPT** (Besitzer: Lab, entschieden) · **AFTER_MVP** | Die Konzepte nennen „WB2 / F-S13“ als Welt-Besitzer. WB2 R4 ist gestoppt; für MVP-1/2 ist **das Lab die Welt-Laufzeit**. Der Gatekeeper gehört später also ins Lab (bzw. dessen Nachfolger). MVP-Regel: keine Ad-hoc-Sperren bauen, alle MVP-Inseln sind offen. |
| 7 | Fluff v0.3/v0.4: D6 × HIGH/LOW-Wallet, `CraftRequest` vergibt Karte genau einmal, HP-Fluff getrennt, keine Paywall | **KEEP** · **AFTER_MVP** · Wallet-Besitzer **UNKNOWN** | Es gibt noch keinen Wallet-Besitzer. Empfehlung: Wallet im selben `PLAYER_SAVE` (kein zweiter Speicher). Fluff-Farben sind Akzent-Rollen innerhalb `ENV_ROLES`, keine zweite Palette. Ernte-Punkte kommen aus `nodes[]` im Rezept. |
| 8 | Ein Pfad Save → Entladen → Import → Neuladen mit gleichen Karten, Weltwissen, Gate, NPC, Gerücht | **AFTER_MVP** | Heute gibt es nur den Autoren-Roundtrip (localStorage + JSON-Export). Neu in Stufe 1: Export → Neuladen → Import ergibt dieselben IDs. Der Spielstand-Roundtrip wird das erste Gate der Post-MVP-Spielschicht (§5). |
| 9 | MVP-Schutz: was trägt schon, was fehlt | — | **Trägt:** Welt-JSON mit Seeds und Umrissen, feste Insel-IDs, `kfb.island-outline/1` mit Hash, Rim-Profile `kfb.island-rim-profiles/1` (Anker-Vorläufer), Bewohner mit Asset, Animation, Augen, Prop, Sitz. **Fehlt:** `worldId`, `decks`, Bewohner-Karten-Ref, typisierte Anker, `nodes`, jede Spieler-Schicht. |
| 10 | Kleinste Vertragsstelle gegen späteren Umbau | **ADAPT** (nur Spec, kein Code) | Siehe §4. Wird in Stufe 1 ohnehin neu geschrieben (Migration auf `kfb.island-config/1`), kostet also nichts extra. |

## 3 · Die Konzepte einzeln: Wo sie im Plan landen

| Konzept | Kern | Passt an | Plan |
| --- | --- | --- | --- |
| Fluff-Ernte, Crafting, fraktaler Almanac (v0.3) | Wackeln → Fluff fällt → einsammeln; D6 × HIGH/LOW; Knet-Rezept → echte Karte oder Prop; Almanac mit Herkunft | bestehender Backlog „Fluff-Ernte“, Backpack, Kanten-Grammatik | Post-MVP-Schicht P1 |
| Play · Craft · Learn, Chill/Standard/Hard (v0.4) | Chill ist Standard, Hard nur als Regelprofil, Friedhof bzw. DeathReceipt | Gatekeeper-Schwierigkeit, Academy | P1-Regel, kein eigenes Spiel |
| Genesis-Konstellation, UFO, kosmische Inseln (v0.5) | Lorekeeper, Hexe, Caveman, Hunky und Dory als Tiefenzeit-Figuren; UFO-Innenraum; Käse-Mond, kosmische Track-Core-Straße | Insel-Archetypen und Portale im Gott-Modus; Bewohner-Rollen bleiben (Caveman Mine, Lorekeeper Protopia) | P4 (Archetyp „kosmisch“ bzw. Instanz) |
| Angeln, Farm, Cartoon-Blast-Angeln (v0.6) | Angeln an echten Gewässern, Farmer-Beete, Clown-Bombe als Spielzeug | See-Insel-Archetyp, `nodes: water | farm` | P2 |
| Blast-Mining, Boxel-Kaskaden, Loot-Karten (v0.7.1) | Ein Ergebnis je Aktion, ein Wallet; graue Fundstücke nie ins Bag; BINGO/BOGGLE/BONGO als Loot-Auswahl | Caveman-Mine als erster `resource`-Punkt; Kanten-Grammatik (Rubbel) | P2 |
| Lebende Props (v0.7.1-Korrektur) | Jedes Prop darf wackeln, tanzen, reagieren; Strenge gilt der Architektur, nicht der Kreativität | §00 Weltlogik, Soundbed bzw. World Pulse | gilt ab sofort als Gestaltungsfreiheit, keine Pflicht im MVP |
| Sechs Reaktionsstufen, Gerüchte (v1.1) | Welt reagiert über Blick, Pose, Gruß, Gefallen; keine Balken | Figuren-Karte, ChatterBox, Lean Memory | P3 |
| Gatekeeper-Grammatik (v1.0), 4GTN, Black Knight | Schwelle als kleine Szene, Welt entscheidet, NPC spielt nur | Dark Knight vor dem Big Castle (MVP: nur Wach-Idle), Anker `threshold` | P3 |
| Gott-Modus-Werkzeug-Zensus (v0.7), Character Alchemy | Werkbank ruft bestehende Tools (FrankenStein, EyeRig, Matzones) auf, keine Kopien | Figuren-Integrität (ein Eye-Rig, Figuren-Karte) | Slice Figuren-Integrität, dann Academy |
| Holographic World Foundry, private Rückzugsorte (v0.8) | Miniatur = Ansicht desselben Rezepts; Entwurf → Instanz → Veröffentlichung | `kfb.island-config/1` ist dieses Rezept | P4 (nach Gott-Modus) |

## 4 · Kleinste Vertragsstellen (jetzt in der Spec, Code erst in Stufe 1)

In `SPEC_WORLDBUILDER_GODMODE_VISION_R1.md` §6 und `STAGE1_R2D_PORT_PLAN.md` eingetragen:
1. **`worldId`** als fester Slug, nie neu erzeugt.
2. **`decks: [{ deckId, role }]`** mit Registry-IDs (`embrace_protopia`, `forget_utopia`, `ignore_dystopia`), höchstens ein `primary`, 0 erlaubt.
3. **Bewohner `{ id, card, variant }`**: Instanz, Figuren-Karte, Welt-Variante getrennt.
4. **Anker `{ id, kind }`** und **`nodes: []`** (im MVP leer).

Dazu die Trennregel: **Rezept ≠ Spielstand.** `kfb.worldbuilder.v1` (localStorage) bleibt Autoren-Zustand.

## 5 · Post-MVP-Spielschicht: Reihenfolge (Vorschlag)

- **P0 (nach MVP-2):** `PLAYER_SAVE` + Ereignis-Ledger als **ein** Modul im Lab nach Lean Memory §10/§11: Karten-Sammlung mit Herkunft, aktuelle Welt bzw. Anker, Wallet-Feld (noch leer). Gate: Save → Entladen → Import → Neuladen, gleicher Stand, kein doppeltes Ereignis.
- **P1:** Fluff-Ernte und ein Rezept (Fluff-Gate `MINIGAME_FLUFF_SOURCE_AND_OWNER_AUDIT`): ein Baum, eine Mine, eine Farbfamilie, eine echte Protopia-Karte, Almanac-Fächer.
- **P2:** Wasser- und Minen-Aktivitäten (Angeln, Blast-Mining) über `nodes[]`.
- **P3:** Gatekeeper + sechs Stufen + Gerüchte (ein Schritt): erste Karte → Gate-Reaktion → Neuladen; Gefallen → Nachbar-Gerücht.
- **P4:** Gott-Modus-Werkzeuge, Track-Editor, Hologramm-Werkbank, private Inseln, kosmische Archetypen.

Keine dieser Stufen ändert MVP-1 oder MVP-2.

## 6 · Fragen und Probleme (von Georg am 09.10. entschieden)

1. **Welt-Besitzer:** Mehrere Konzepte nennen noch WB2 bzw. F-S13 als Welt-Laufzeit. Vorschlag: Das Lab ist Welt-Besitzer für MVP und die Spielschicht danach. **Entschieden: ja, das Lab** (Georg 09.10.). Webchat-Konzepte, die WB2 bzw. F-S13 als Welt-Besitzer nennen, sind so zu lesen.
2. **Zugang im MVP:** Alle Inseln offen, Gatekeeper erst ab P3 (Dark Knight im MVP nur als Wache). **Entschieden: ja.**
3. **Town-Decks:** Laut Deck-Pipeline ist Town kein Deck-Spiegel. **Entschieden:** Town bekommt vorerst **ein** Deck: Uncle FrizzleBob’s Mission Control (Meta-Quest-Deck, meta-narrativ passend), `deckId` `frizzlebob_s_mission_control` (= `packId` in `media/kfb/index.json`), Quelle `media/kfb/FrizzleBob_s_Mission_Control_-_ADD_web.pdf.json` bzw. `FrizzleBob_s_Mission_Control - ADD web ID.pdf`. Es steht im Kanon-Index `media/kfb/index.json` (130 Decks), aber noch nicht als Shard in `registry/assets/v1/decks/` (dort 4 Decks); den Shard erzeugt der Deck-Library-Auftrag an WSA. „ADD“ ist kein Deck, sondern die Endung der unkomprimierten PDFs (gegenüber `web.pdf`).
4. **Datumsfehler korrigiert:** Lab-Dokumente trugen „2026-10-10“; richtig ist 2026-10-09. Die Academy hat das zu Recht angemerkt.
5. **Fluff-Farben:** Die D6-Farben (Tragic `#3e6a83` … Forbidden `#8f3a5f`) werden Akzent-Rollen in `ENV_ROLES`, keine zweite Palette.

## 7 · Ein nächstes Gate

Unverändert: **Georgs Reset → Stufe 1 (R2D-Port) mit `kfb.island-config/1` inkl. der Felder aus §4.** Für die Konzepte gibt es kein neues Gate vor MVP-2. Die Gates der anderen Besitzer bleiben: Academy `ACADEMY_MAKERSPACE_VISUAL_SOURCE_PROOF_R1`, Fluff `MINIGAME_FLUFF_SOURCE_AND_OWNER_AUDIT` (nach dem spielbaren MVP).
