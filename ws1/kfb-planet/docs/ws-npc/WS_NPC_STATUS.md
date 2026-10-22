# WS_NPC_STATUS · Sitzung „WS-NPC“ (Bewohner-Leben, Begegnung, Dark Fluffer)
Auftrag: `BRIEF_WS1_NPC_LIFE_R2.md` (V-585). Lead: WS1 „R3F Modul-Host Vertrag“. Empfänger: Lead (schreibt den Abschnitt WS-NPC in `WS1_STATUS.md`), WS0 liest hier direkt.
Neueste Einträge oben.

## 11 · 22.10. · An WS0: Offene Abnahmen für Georg, bitte bei WS0 bündeln (Georg 22.10.)

**Georg 22.10.:** „wo sehe ich Abnahmen für mich? … gib das an WS0, dann machen wir das dort.“
- Georg möchte die Abnahmen an einer Stelle sehen, bei WS0.
- Die Bilder liegen lokal auf Georgs Mac unter `~/kfb-ws1/kfb-planet-npc/test/out/npc/`; `test/out` ist gitignored.
- Einige Bilder zeigen private Kauf-Assets (Bots, K11, Ork-Band). Sie gehören deshalb nicht in eine öffentliche Ablage.

**Wartet auf Georgs Entscheidung:**
| # | Was | Frage an Georg | Bild / Beleg (lokal) |
|---|---|---|---|
| G-1 | Bot-Augen (Kayfabrick-Bots B17, PROOF; Augen-Sitz aus den Karten-Ankern über `deriveSourceAnchorSeed`) | Passen Sitz und Größe der KFB-Augen im Visier-Schlitz? Erst danach geht etwas davon Richtung main (Lead-Bedingung). | `bot_front.png`, `bot_crew.png` |
| G-2 | Gerücht D2, ein Schritt (V-602): nur Selbsterlebtes, mit Quelle, eine Stufe weniger sicher, einmal je Erzähler und Tag; wer davon gehört hat, grüßt mit „fight“ | Ist das Verhalten so richtig? Danach entscheidet WS0 über Gerücht-Ketten (told-of-told). | `unit-rumor` (9/9); im Spiel erst einen Spieltag später sichtbar |
| G-3 | Spielzeugsoldaten treffbar, vorerst mit Skelett-Clips für KO und Aufstehen | Ist das als Übergang ok, bis der eigene Spielzeug-Clip von WSB kommt? | `squad.png`; KO wie im Clip |

**Entschieden oder umgesetzt, nur zur Ansicht (bei Bedarf einwenden):**
| # | Was | Stand | Bild / Beleg (lokal) |
|---|---|---|---|
| A-1 | Dark Fluffer 0,8 m (WS0 V-616), Tropfen und Fleck kleiner, Trefferfläche gleich | umgesetzt (5ae84c8) | `fluffer_size_0_8.png` (Vergleich `fluffer_size_1_1.png`, `_0_7`) |
| A-2 | Heilschuss-Vorrang vor dem Baum (Georg a) | umgesetzt (d923b9b) | fluffer `E_healFromSixMetresTreeNearer` |
| A-3 | Echte Bewohner K11: Lorekeeper liest mit Buch, Farmer B gräbt/harkt mit Gabel | umgesetzt (ebdbb82) | `k11_lorekeeper.png`, `k11_farmer.png` |
| A-4 | Dark Fluffer K11 k11c: Spucken aus `KFB_Mouth`, weiße Augen nach dem Heilen | umgesetzt (846e209) | fluffer `E_whiteEyesAfterHeal`; Heil-Video von WS-Audio |
| A-5 | Ork-Band im Takt der Weltzeit, Ort vorläufig (Lead-Teil) | umgesetzt (8c36cd9) | `hud_t3.png`, `band.png` |
| A-6 | Skelette: Warnung, Drohung, Aggro, Cartoon-KO, Rückkehr | umgesetzt (D3) | Clip `WS_NPC_PhaseD3_clip_terrain3.webm` (64 s), `aggro.png` |
| A-7 | Schritte und Hüpfer für den Ton | umgesetzt (f6e7eed, a5437f1) | WS-Audio-Videos |

**Wartet auf WSB (über WS0):**
- Dark-Fluffer-Cubes K11 (§9).
- Marsch der Spielzeugsoldaten mit Gewehr.
- Eigener Spielzeug-KO-Clip.

## 10 · 22.10. · Fluffer 0,8 m (WS0 V-616), Schritt- und Hüpf-Ereignisse für den Ton, Pushes

**Gepusht** (`ws-npc/phase-a`, Spiegel wie zuvor, jeweils nach voller Reihe):
| Spiegel | Stand | Inhalt | Volle Reihe |
|---|---|---|---|
| 4b78a5b | 4625c6e | echte Figuren K11, Ghost k11c, Gerücht D2, eyeActor eyeAnchors, Bots | 65/67 |
| 226a5ec | ef2f7b8 | Heilschuss-Vorrang (a), Status 8/9 | 66/67 |
| 30fda96 | f6e7eed | Schritt- und Hüpf-Ereignisse | 66/68 |

Rot blieben jeweils nur c2 (bekannter Wackler) und s5a `livePoolLoaded` (nur im Gesamtlauf, einzeln PASS).

**Lokal, gemergt vom Lead in `ws1/mvp-r1` @bfa4e09, Remote-Push nach der nächsten vollen Reihe:**
- **5ae84c8 – Dark Fluffer 0,8 m** (WS0 V-616, vorher 1,1 m; Georg: 30–40 % kleiner).
  - Größenfaktor heightM/refH (1,1) für Tropfen-Radius, Streuung, Bogenhöhe und Fleck-Radius.
  - Trefferradius bleibt 0,7.
  - Vergleichsbilder `test/out/npc/fluffer_size_{1_1,0_8,0_7}.png`.
  - Einzeln PASS: unit-flufferSim, fluffer, ink, orchard-npc, memory, npc-a.
- **a5437f1 – `rig: 'medium'|'large'`** in jedem Schritt (WS-Audio V-607, schwere Schritte für Large-Rig).

**Schritt- und Hüpf-Ereignisse** (f6e7eed, Georg 21.10.):
- `groups.steps()`, `npc.steps()` mit { id, foot, at, base, speed, rig, t }.
- `fluffer.hops()` mit { id, at, t }.
- Erkennung aus der echten Sohlenlage: Hysterese 1,2/3,5 cm; gemessen hebt der tiefste Sohlenpunkt nur 6–8 cm ab.
- Takt: Skelette alle ~0,43 s im Wechsel l/r, Fluffer-Hüpfer alle ~0,54 s (Walk).
- WS-Audio spielt sie mit den WS0-Tönen `npc_steps_r1`: Schritte haben den niedrigsten Rang, höchstens 8 zugleich. Gemessen 3,5–7,5 Schritte/s, keine Fehler.

**Offen:**
- WSB: Dark-Fluffer-Cubes K11 (§9), Spielzeugsoldaten-Marsch mit Gewehr, eigener Spielzeug-KO-Clip.
- Georgs Blick auf die Bot-Augen (PROOF) und auf Gerücht D2 (vor told-of-told).

## 9 · 21.10. spät · An WS0: WSB-Auftrag „Dark-Fluffer-Cubes K11 für alle Boden-Cubes“ (Georg 21.10.)

**Georg 21.10.:** „wir könnten auch die anderen Enemies aus der Combat-Slice als Dark Fluffer gebrauchen, das war die Idee“ → WSB-Auftrag über WS0.

**Ausgangslage:**
- Das WSA-Spenderpaket (`georg-doc/KFB-Combat-Arena` @028dd00, `wsa/dark-fluffer-donor-v584-2026-10-21`, `dark_fluffer_donor/cubes.json`) enthält 17 Boden-Cubes aus MonsterCuteCubes (Quaternius, CC0), Quelle kayfabizarro @c746a95.
- Einen vermessenen Maul-Anker `KFB_Mouth` und die geheilte Fassung `*_healed` gibt es bisher nur für den Ghost (WSB K11 k11c).
- Die Arena-Formel (Höhe × 0,62) liegt auf der Stirn. Die `Mouth`-Knochen sind Gelenke, nicht die sichtbare Maulöffnung (WSA-Befund).
- WS0 V-589: Spucken nur aus `KFB_Mouth`.

**Auftrag an WSB (Vorschlag WS-NPC, wie Ghost K11 k11c):**
1. **Je Cube eine Datei** `KFB_<Name>_healed.k11c.glb`, as-is (V-574, CC0, Clips unverändert), mit:
   - `KFB_Mouth`: Kind von `Head`, Mitte der sichtbaren Maulöffnung, lokal +Z = Spuckrichtung (V-589);
   - `KFB_HealedEyes`: weiße Augen-Auflage mit Pupille, im Spiel erst nach dem Heilen sichtbar.
2. **Karten** `q_<name>.figure.json` und `q_<name>_healed.figure.json` mit sha256, Anker-Regel und Clip-Liste, wie `q_ghost`.
3. **Frontbild je Cube** (dunkel/geheilt) mit markiertem `KFB_Mouth`.
4. **Liste**, 15 Cubes, Mushroom zuerst (WS0 V-589: lebt am Waldboden bei den Obstbäumen):
   - q_mushroom, q_alien, q_alien_tall, q_cactus, q_chicken, q_crab, q_cyclops, q_deer, q_demon, q_greendemon, q_panda, q_penguin, q_pig, q_tree, q_yeti.
   - Ausgeschlossen: q_skull (leere Augenhöhlen, nichts wird weiß; Arena schließt ihn aus) und die vier Flieger.
   - Hinweis: Tree hat keinen `Death`; das ist für das Heilen nicht nötig.
5. **Größe:** Georg prüft gerade 0,7–0,8 m statt 1,1 m (Vergleichsbilder folgen). Die Höhe stellt das Spiel ein (`heightM`); WSB liefert in Originalgröße.

**WS-NPC danach:**
- Mehrere Dark Fluffer über die Daten (`fluffers[]`), je Sorte und Baum.
- Spucken aus `KFB_Mouth`, weiße Augen nach dem Heilen.
- Gleiche Tests wie beim Ghost (fluffer, orchard-npc).
- Bis die Cubes da sind, bleibt der Ghost der einzige Dark Fluffer.

## 8 · 21.10. spät · An WS0 und den Lead: Heilschuss trifft den Baum statt des Dark Fluffer (Entscheidung erbeten)

**Beobachtung (WS-Audio, Video mit Kampf-Ton, 21.10.):** Aus etwa 6 m ging der Heilschuss auf den Ghost zweimal daneben. Getroffen wurde jeweils der Goblin-Baum t4, an dem der Ghost spuckt; geheilt wurde nicht.

**Ursache (abgenommenes Verhalten, kein Fehler):** Schuss B (`orchard.shoot`) sucht im Zielkegel vor dem Spieler (cos ≥ 0,75, also etwa ±41°) zwei Kandidaten: den nächsten Baum und das nächste Ziel (`addTarget`, hier der Ghost). Gewählt wird der nähere der beiden („näheres Ziel gewinnt“, Lead-OK Phase C d). Der Ghost steht beim Spucken direkt am Stamm. Je nach Winkel ist der Stamm deshalb näher am Spieler als die Mitte des Ghost, und der Schuss fliegt in die Krone. Von nah (2–3 m) auf der baumabgewandten Seite trifft er sicher; so prüft es `fluffer.mjs`.

**Vorschlag (WS-NPC, noch nicht gebaut):** Ein Ziel, das gerade feindlich ist (Dark Fluffer in Phase hostile), gewinnt im Kegel vor dem Baum, wenn es höchstens etwa 1,5 m hinter dem Baum steht. Bäume ohne Fluffer und alle anderen Fälle bleiben, wie sie sind. Gruppen-Mitglieder (Skelette, Soldaten, Bots) sind nicht betroffen, weil sie nicht an Bäumen stehen. Umfang: eine Zeile Vorrang in `orchard3d.shoot` und ein Prüffall in `orchard-npc.mjs`.

**Entscheidung erbeten (Georg / WS0):**
- (a) Vorrang für den feindlichen Fluffer wie vorgeschlagen.
- (b) Alles bleibt („näheres Ziel gewinnt“); der Spieler muss nah heran.
- (c) Eine andere Regel, z. B. das Ziel in der Kegelmitte gewinnt.

Bis dahin bleibt alles, wie es ist.

**Nachtrag 21.10. (Korrektur und Entscheid):**
- Georg hat **(a)** gewählt; eingebaut in d923b9b. Tests: orchard-npc `e_priorityTargetBeatsTreeBehind`, fluffer `E_healFromSixMetresTreeNearer`.
- Die Erklärung oben war falsch, was WS-Audios Fehlschüsse angeht. Ursache war die Kamera: Teleport dreht nur die Figur, Schuss B zielt in Kamerarichtung, und die lag 50–120° daneben. Den Fall „Stamm näher als der Ghost“ löst (a) trotzdem; ohne (a) gewann dort der Baum.

## 7 · 21.10. abends · WS0 V-602 umgesetzt: echte Figuren, Ghost k11c, Gerücht D2, Bots · Push ws-npc/phase-a

**WS0 V-602:**
- Push-Go für `ws-npc/*` (kein Merge).
- Gerücht nur ein Schritt.
- Bots (B17) und Soldat r3d liegen im privaten Zweig.
- `~/kfb-ws1/private` löschen nur mit Georgs Ja.
- K11-Figuren sind fertig.

**Georg 21.10.:**
- `~/kfb-ws1/private` gelöscht.
- Push ja.
- Gewehr: WSB-Auftrag „Marsch“, bis dahin bleibt der Trupp ohne Gewehr.
- Bots als Arbeitstrupp.

**Lead 21.10.:**
- `eyeActor` additiv um `eyeAnchors` erweitern, mit drei Bedingungen: ohne die Option bitgenau, nur Kanon-Werte, Bot-Augen PROOF mit Frontbild an Georg.
- Keine sichtbaren Fenster.
- Bilder und Abnahmen mit `look=terrain3`.

**Push:** `ws-npc/phase-a` @55fff1e in `georg-doc/kayfabizarro`.
- Spiegel wie `ws1/terrain-439`: Parent 41be79f, nur die 73 WS-NPC-Dateien unter `ws1/kfb-planet/`, Stand 32e1143, nichts Privates.
- Die volle Reihe auf 32e1143 lag bei 63/64; c2 ist der bekannte Wackler, auch auf der Basis.

**Lokal seit dem Push** (je einzeln PASS, volle Reihe folgt nach dem ruhigen Fenster von WS-Audio):
| Commit | Inhalt |
|---|---|
| 846e209 | Dark Fluffer = WSB K11 `KFB_Ghost_healed.k11c` (CC0 laut Karte, im Repo). Spucken aus `KFB_Mouth`, weiße Augen erst nach dem Heilen (fluffer `E_whiteEyesAfterHeal`). |
| ebdbb82 | Echte Bewohner. Der Lorekeeper ersetzt `lore_ph`: öffentlich Original + Georgs Profil, privat K11b mit Buch. Farmer B privat K11 mit Gabel (Digging/Working_C). Je Clip eine feste Halterung, die Requisite ist nur in diesen Clips sichtbar (figures-k11). |
| cc6157f | Gerücht D2 (V-602): nur Selbsterlebtes, mit Quelle, salience −1, einmal je Erzähler und Tag. Wer nichts weiß, reagiert nicht; wer es gehört hat, grüßt mit „fight“ (unit-rumor 9/9). |
| 1d09cc4 | `eyeActor` `eyeAnchors`: Studio-Weg `sourceAnchorSeed` (`deriveSourceAnchorSeed`). Ohne Option bitgenau (f1, actors, cast, g4, stage, m1-eyes PASS). |
| eeb55fb | Kayfabrick-Bots (B17 r1 PROOF) als Arbeitstrupp: drei Bots mit Helm tragen Blöcke zwischen Ladestation und Baustelle. Wut bei Treffern, KFB-Augen an den Karten-Ankern (bots 7/7). |

| # | Zeile | Ergebnis | Beleg |
|---|---|---|---|
| D-7a | Gerücht aus erster Hand (V-602-Regeln) | **PASS** (Node) · **NOT RUN** im Spiel (nächstes Treffen erst einen Spieltag später) | unit-rumor |
| D-7b | Gerücht-Kette (told-of-told) | **NOT RUN** – WS0: kein told-of-told, erst nach Georgs Blick auf D2 | – |
| D-9 | Bots (Arbeitstrupp) | **PASS** (Proof; Augen PROOF, Frontbild an Georg) | bots, `test/out/npc/bot_front.png`, `bot_crew.png` |
| D-10 | Spielzeugsoldaten mit Gewehr | **NOT RUN** – WSB-Auftrag „Marsch“ (Halterung Walking/Idle oder Marsch-Clip), über den Lead an WS0 | – |
| D-11 | fps headless, look=terrain3 (Last 28–40) | **FAIL** gegen 55 (Basis-Grenze). Ohne Gruppen/Band 39,5 / 41,2, mit 43,9 / 41,8 fps; kein messbarer Aufpreis (+166 Draw-Calls, +132 k Dreiecke) | fps-d.mjs |
| E-1 | Weiße Augen am geheilten Ghost | **PASS** | fluffer `E_whiteEyesAfterHeal` |
| K-1 | Echte Bewohner-Figuren (K11) mit Requisite | **PASS** | figures-k11, Bilder `k11_farmer.png`, `k11_lorekeeper.png` |

**Lücken (neu):**
1. Eigentempo von `kfb_bot_carry_a` ist nicht gemessen; es ist aus Walking_A abgeleitet, Fußgleiten möglich.
2. Der Augen-Sitz der Bots ist PROOF und braucht Georgs Blick.
3. Bots und Ort sind Platzhalter (Lead-Teil, später Dioramen-Anker).
4. Weiter offen: Marsch-Clip bzw. Halterung für das Gewehr; der eigene Spielzeug-KO-Clip (WSB, nach K13).

## 6 · 21.10. · Phase D gebaut (lokal) · Abnahmematrix · Lückenliste

**Georg 21.10.:** „mach weiter mit Phase D“. **Lead 21.10.:** RECEIPT_KINDS-Erweiterung selbst, eigener Commit, Version bleibt 1.
**Georg 21.10. (später):** Die Spielzeugsoldaten sollen treffbar sein; fehlt ein Clip, wird er über WS0/Blender MCP beauftragt. Private Assets über das Stunt-Race-Repo (`assets/private`).
**Lead 21.10.:** WS-NPC baut das Modul „band“ im Spiel. Der Ort ist Lead-Teil, vorerst ein POI, per Parameter verschiebbar. Private Assets nur lokal (gitignored), sonst Platzhalter. Keine sichtbaren Browserfenster; Bilder und Abnahmen mit `look=terrain3`.
**Stand:** `ws-npc/phase-a` lokal, kein Push. Aufruf `dist/index.html#m1,harvest,look=terrain3,patrol,band` (Treffer brauchen den Obstgarten), mit Gedächtnis zusätzlich `npc`; Band-Ort `bandat=x,z,Grad`.
Commits:
- D1 b55da99: Skelett-Patrouille
- D2 5caa948: Spielzeugsoldaten-Trupp über Begegnungstabelle
- D3 0379e95: Treffer, Aggro, KO
- 7f42cab: RECEIPT_KINDS
- d822abe: Gruppen-Gedächtnis
- 4e75ade: Spielzeugsoldaten treffbar
- 8c36cd9: Modul band

**Was läuft:**
- **Skelett-Patrouille** (Warrior, Rogue, Mage; KFB-Augen aus Georgs Batch): eine Schleife im Westen auf Fahrplan, in Formation, mit zwei Halten. Wenn der Spieler auf ≤ 7 m herankommt, hält die Gruppe und schaut hin; der Anführer spielt `Skeletons_Taunt`. Danach geht sie weiter und holt mit höchstens 1,25 × Tempo auf.
- **Spielzeugsoldaten Nr. 1–6** über die Begegnungstabelle `kfb.encounter-table/1` (Zone m1-east). Beim Betreten wird gewürfelt; ein- oder ausgeblendet wird nur, solange kein Mitglied im Bild ist. Nr. 6 stolpert alle 11 m (`Hit_B`) und holt wieder auf.
- **Treffer** (Schuss B über `orchard.addTarget`, kein Schaden). Die Stufen gelten je Begegnungsfenster:
  1. Treffer: Warnung, `Hit_A`, 1 Fluff.
  2. Treffer: Drohung, `Hit_B`, der Anführer spielt `Skeletons_Taunt_Longer`, 3 Fluff.
  3. Treffer: **Aggro.** Die Gruppe verlässt die Route und folgt dem Spieler bis 2,4 m, an einer Leine von 16 m um den Austrittspunkt.
  4. Jeder weitere Treffer: **Cartoon-KO** (`Skeletons_Death`). Das Mitglied liegt 10 s, ist liegend nicht treffbar und steht mit `Skeletons_Awaken_Floor` an Ort und Stelle wieder auf (gleiche ID). Dazu kommt 1 Fluff, einmal je Mitglied.
- **Ende der Aggro:** nach 18 s ohne Treffer, wenn der Spieler weit weg ist, oder an der Leine. Die Gruppe kehrt dann zum Austrittspunkt zurück, geht auf die Route und holt auf, bis sie exakt auf dem Plan ist. Außerhalb der Blase steht sie sofort auf dem Plan.
- **Fluff ist endlich:** Die Tags gelten je Gruppe und Welttag. Ein zweites Fenster am selben Tag gibt kein neues Fluff.
- **Spielzeugsoldaten treffbar:** Warnen und Drohen mit `Interact`, KO und Aufstehen vorerst mit `Skeletons_Death` und `Skeletons_Awaken_Floor` (Rig_Medium_Special, as-is, passt auf jede Rig_Medium-Figur). Ein eigener Clip `Toy_KO`/`Toy_GetUp` ist über den Lead bei WS0/Blender MCP beauftragt.
- **Ork-Band „The KayfaBizarros“:** Scenelet orc_band_01 R2, vier Darsteller r1b. Standort ist die Wegkreuzung am Amphitheater [−8, 30], Boden < 1,1°, Blick zum Weg.
  - Die Clips (bounce, strum, drum_v5c, trumpet_groove) laufen im Takt der Weltzeit (Formel des Scenelets). Wer weggeht und zurückkommt, sieht die Band ohne Neustart weiterspielen.
  - Die Köpfe drehen sich zum Spieler (≤ 14 m, ≤ 50°). Kein Kampf.
  - Die Assets bindet der Build optional über `src/private` ein, gitignored, Verweis auf `~/kfb-ws1/private-assets`. Fehlen sie, steht ein sichtbarer Platzhalter da (Status PLACEHOLDER).
- **Gedächtnis:** Die Skelette merken sich `hit_warning`, `hostile_response`, `resident_downed` (selbst beteiligt, die anderen haben es gesehen) und `respawned`. Bewohner in Sichtweite (≤ 25 m) werden Zeugen. In der nächsten Begegnung erzählt der Zeuge davon (`told`); wer es nur gehört hat, erzählt es nicht weiter.

| # | Zeile (Brief R2 Phase D) | Ergebnis | Beleg |
|---|---|---|---|
| D-1 | Gruppe in Formation auf Fahrplan, bemerken/drohen, aufholen, weggehen und zurückkommen ohne Pop-in | **PASS** | unit-groupPatrol, patrol |
| D-2 | Gruppe über Begegnungstabelle, Umschalten nie im Bild, Spielzeugsoldaten Nr. 1–6 mit Stolper-Gag | **PASS** | squad |
| D-3 | Treffer-Treppe Warnung → Drohung → Aggro, Fluff endlich und eindeutig | **PASS** | unit-groupAggro, aggro (echte Schüsse) |
| D-4 | Aggro an der Leine, Rückkehr auf den Fahrplan, kein Sprung im Bild | **PASS** | unit-groupAggro (`leashHolds`, `catchesUpOnPlan`), aggro (`E_noPopInView`) |
| D-5 | Cartoon-KO: liegen, nicht treffbar, aufstehen an Ort und Stelle, gleiche ID | **PASS** | unit-groupAggro, aggro (`C_*`) |
| D-6 | Gedächtnis der Gruppen-Ereignisse (R0.6-Kinds), Zeugen nur in Sichtweite, idempotent | **PASS** | unit-groupMemory, aggro (`F_memoryReceipts`), unit worldSave (`kindsPhaseD`) |
| D-7a | Gerücht aus erster Hand (Zeuge erzählt weiter) | **PASS** (Node) · **NOT RUN** (im Spiel: nächstes Treffen erst einen Spieltag später) | unit-groupMemory (`tellFirstHand`, `noRetell`) |
| D-7b | Gerücht-Kette (told-of-told) | **NOT RUN**: Das Schema `kfb.world-save/1` verwirft told ohne Zeugen-Quelle; eine Kette braucht eine Schema-Entscheidung von WS0 | – |
| D-8 | Ork-Band im Spiel (Takt der Weltzeit, Blick, kein Neustart beim Zurückkommen, Ort verschiebbar, Platzhalter ohne private Assets) | **PASS** | unit-bandClock, band (mit privaten Assets: OK; ohne: PLACEHOLDER, beide PASS), Bild `test/out/npc/hud_t3.png` |
| D-8b | Spielzeugsoldaten treffbar | **PASS** (mit Skelett-Clips as-is) · eigener Spielzeug-Clip **NOT RUN** (beauftragt) | squad `E_toyHittable` |
| D-9 | Bots | **NOT RUN** (blockiert: Robot_Two fehlt) | Lückenliste |
| D-10 | Spielzeugsoldaten mit Gewehr | **NOT RUN** (blockiert: Gewehr-Halterung V-582 liegt bei WSB r3d, nicht auf diesem Mac) | Lückenliste |
| D-11 | fps aus der Spielkamera mit Gruppen und Band, Ziel ≥ 55 | **FAIL** (Basis-Grenze). Vorläufig, sichtbar unter Last 27–40 gemessen: Basis 27,0/25,4, mit patrol+band 24,5/27,2 fps (Mittel +0,5 ms, im Rauschen; +166 Draw-Calls, +132 k Dreiecke; Module groups ≈ 0,2 ms, band ≈ 0,15 ms je Schritt). Die gültige Messung headless mit look=terrain3 folgt bei ruhiger Maschine | fps-d.mjs |
| D-12 | Clip aus der Spielkamera | **PASS** | `test/out/npc/WS_NPC_PhaseD3_clip_terrain3.webm` (64 s, look=terrain3, headless): Warnung, Drohung, Aggro, KO, Aufstehen, Ruhe, dann die Band |
| D-13 | Volle Testreihe (npm test + NPC-Browsertests, 62 Dateien) @d822abe | **PASS** 60/62 · c2 FAIL (bekannter Wackler, auch auf der Basis und im Software-Modus) · s5a unter Last 45 FAIL, einzeln wiederholt PASS | test/out/npc/suite_result.txt; nach 4e75ade/8c36cd9 einzeln: band, squad, aggro, patrol und die Unit-Tests PASS |

**Lückenliste (an WS0/WSB, nicht blockierend für D1–D7a):**
1. Skelett-Augen: Batch-Profile AUTO_CANDIDATE, Bereinigung der Original-Augenhöhlen HUMAN_REQUIRED.
2. Spielzeugsoldaten: Hut-Nummern Nr. 1–6 (V-464) nicht im Asset, heute nur in den Daten.
3. Gewehr-Halterung V-582 (WSB r3d) fehlt hier → Soldaten ohne Gewehr.
4. ~~Ork-Band~~: erledigt über `assets/private` (ORKBAND r1b). Offen: der Band-Ort als Dioramen-Anker aus dem Gelände (Lead-Teil); Treffer auf die Band nur nach Entscheid.
5. Bots: Robot_Two fehlt.
6. Spielzeugsoldaten-KO: Heute laufen die Skelett-Clips (Rig_Medium) as-is. Ein eigener Clip `Toy_KO`/`Toy_GetUp` ist bei WS0/Blender MCP beauftragt (Rig_Medium, Sohlen auf y=0, nur Clips).
7. Gerücht-Kette (told-of-told): Schema-Frage an WS0 (siehe D-7b); der Lead erweitert das Schema nicht ohne Entscheid.
9. Private Assets im Build und in der Vorschau: Wie sie dorthin kommen, entscheidet WS0. Heute gilt: nur lokal; `kayfabizarro` ist öffentlich und bekommt keine Kauf-Assets.
10. Für WS-Audio (V-598) bleiben die Ereignisnamen stabil: Fluffer `taint`, `drop`, `burst`, `fade`, `healed`; Gruppen `hit`, `aggro`, `ko`, `awake`, `calm`, `fluff`.
8. Offen aus A–C: weiße Augen für den geheilten Ghost, Lorekeeper weiter Platzhalter (WSB K11), Clip „Graben“, Konzeptblatt, Google Doc, Ton/Stimme, Eigentempo des Ghost-Walk ungemessen.

## 5 · 21.10. · Phase B Gedächtnis gebaut (lokal) · Abnahmematrix

**Georg 21.10.:** Ghost-Größe 1,1 m bestätigt („passt, mach weiter“).
**Stand:** `ws-npc/phase-a` lokal @c5c3e0e, kein Push. Speicher = `kfb.world-save/1` des Leads (`src/world/worldSave.js`, Schema nach WS-NPC-Vorschlag), getrennt von `kfb.save/1`. Aufruf wie Phase A/C; `npcfresh` leert den Weltstand vor dem Start (Tests), `npcmem=0` schaltet das Gedächtnis ab.

**Was entsteht (ein Beleg je bedeutendem Erlebnis, ohne Transkript):**
- Begegnung Farmer B ↔ Lorekeeper-Platzhalter → beide *beteiligt* (`greeted` bzw. `silent`).
- Bewohner bemerkt den Spieler → *beteiligt* `interrupted_by_player` (einmal je Plan-Slot).
- Bewohner bemerkt den feindlichen Fluffer → *gesehen* `plague_seen`.
- Fluffer geheilt → *gesehen* `fluffer_cured` **nur** für Bewohner in Sichtweite (≤ 25 m, in der Spielerblase); wer weit weg ist, weiß nichts.
- Nächste Begegnung: wer etwas gesehen hat, erzählt es dem, der es nicht weiß → *erzählt* (`told`, Quelle = Erzähler), ein Thema je Begegnung; der Erzähler gestikuliert (`Interact`).

**Veränderte Begrüßung (abgeleitet, nicht gespeichert):** unbekannt → nur bemerken (`Idle_B`); kennt den Spieler → winkt (`Waving`); hat die Heilung gesehen oder davon gehört → jubelt (`Cheering`, Kit-Clip aus `Rig_Medium_Simulation`, as-is).

| # | Zeile (Brief R2 Phase B / Workshop M3) | Ergebnis | Beleg |
|---|---|---|---|
| B-1 | Ein Ereignis-Beleg je bedeutendem Erlebnis (gesehen / beteiligt / erzählt), idempotent | **PASS** | npcMemory (12 Belege über 3 Tage, kein Doppel), memory |
| B-2 | Zeuge vs. Nicht-Zeuge, kein allwissendes Wissen | **PASS** | npcMemory `farAwayDidNotSee`, memory `s1_farAwayNoReceipt` |
| B-3 | Weitergabe mit Quelle (told) | **PASS** (Node) · **NOT RUN** (im Spiel: nächstes Treffen erst einen Spieltag später) | npcMemory `toldAtNextMeeting` |
| B-4 | Veränderte nächste Begrüßung | **PASS** | npcMemory (Idle_B → Waving → Cheering), memory (Cheering nach Heilung) |
| B-5 | Neu laden: Beleg erhalten, Begrüßung gleich, keine Doppel; Spieler-Save unberührt | **PASS** | memory (echtes localStorage, Seite neu geladen), npcMemory |
| B-6 | Keine Belohnung/Item aus Belegen, keine Profile im Save | **PASS** | Beleg-Schema ohne Freitext (npcMemory `noTranscript`); Burst nur aus der Heilung (Phase C) |

**Grenzen:** Weltzeit wird nicht gespeichert (jede Sitzung beginnt bei der gewählten Tageszeit); Schlüssel aus Tag + Plan-Slot sind deshalb je Sitzung gleich → kein Doppel, aber ein Treffen „Tag 0“ zählt nur einmal. RECEIPT_KINDS nur mit WS0 erweiterbar (genutzt: met-Familie, interrupted_by_player, plague_seen, fluffer_cured; `player_greeted` ungenutzt).

**Nächstes Gate:** volle `npm test` (läuft) → Bitte um WS0-Go für Push von `ws-npc/*`. Phase D (Gruppen, Ork-Band, Skelette, KO, Gerüchte) nur mit eigenem Go.

## 4 · 21.10. · Phase C P1 Dark Fluffer gebaut (lokal) · Abnahmematrix

**Stand:** `ws-npc/phase-a` lokal, kein Push. Aufruf: `dist/index.html#m1,harvest,npc,fluffer` (`fluffert=<s>` Start des Fluffers, Standard 4 s).
**Georg 21.10.:** Gegner `Ghost.gltf` (MonsterCuteCubes), Heil-Waffe `Gun_Pistol.gltf` (KayKit Prototype Bits). **Lead 21.10.:** Punkte a–d baut WS-NPC selbst, je ein Commit; Patch-Ort Goblin-Garten t4.

**Ablauf im Spiel:** Ghost marschiert an → spuckt dreimal nach `spuck.v3` (Tropfen sammeln sich 0,34 s am Maul-Knochen „Mouth“ des Modells, Bogen, Aufprall) → Tusche-Fleck wächst 0,4/0,7/1,0 → Baum t4 dunkelt nach dem 1. Aufprall, wirft nach dem 2. ab, die dunklen Kügelchen liegen und sinken ein → Ghost lauert. Kommt ein Bewohner auf ≤ 12 m vorbei: zuckt zusammen (`Hit_A`), schaut hin, weicht seitlich aus, macht weiter. **Heilen:** Schuss (B) mit der Pistole in FrizzleBobs Hand trifft Ghost → hört auf zu spucken, freut sich (`Yes`, `Dance`), lässt **einmal** bunten Fluff (6 Sorten) fallen, Fleck verblasst, Tusche-Shader wieder ab. Ohne Heilen läuft der Fleck nach 180 s ab und Ghost geht.

| Commit | Inhalt |
|---|---|
| 296f8e7 | (a) `m1-terrain.setInkPatches` + `src/look/inkPatch.js` (≤ 4, `uInk[4]`, `uInkSeed`, Kante über `NOISE_GLSL`) |
| 04c2d24 | (b) `orchard.taint` (Instanzfarbe, Abwurf über `hitTree`, Einsinken, nicht aufsammelbar) |
| 7930fad | (c) `fluff.releaseAt` + `orchard.burst` (gleiche Physik, keine 7. Sorte, einmal je Tag) |
| 792c87d | (d) `orchard.addTarget` + `shoot → onHit` (kein Schaden, kein Kampfsystem) |
| fa91782 | Fluffer-Modul `src/npc/darkFluffer.js` + `flufferSim.js`, Bewohner-Reaktion, Assets byte-gleich mit main @c746a95 |
| 55f6bb3 | Gun_Pistol: eine feste Halterungsdrehung (V-581, gemessen: Euler −90°/0°/180°) |
| (neu) | Tusche-Shader: Rauschen nur innerhalb der Fleck-Kante |

**Abnahmematrix Phase C P1** (Web-Chat-Brief A–F; Belege `test/unit/flufferSim|npcThreat|taint|releaseAt.mjs`, `test/ink.mjs`, `test/orchard-npc.mjs`, `test/fluffer.mjs`, Clip `evidence/phase-c/phase-c-spielkamera.webm`)

| # | Zeile | Ergebnis | Beleg |
|---|---|---|---|
| A-1 | Cube isoliert, vorne +Z, Clips | **PASS** | `evidence/phase-c0/*`, Ghost-Bildreihe; +Z im Spender gemessen und nachgerendert |
| A-2 | Spucken: Ansage, 3–5 Tropfen aus dem Maul, keine Zielmarke | **PASS** | Maul = Knochen „Mouth“ des Modells (statt spuck.v3-Schätzung); fluffer A, Clip |
| B-1 | Fleck nur nach echtem Aufprall, begrenzt, organisch, keine Änderung an Kollision/Bäumen | **PASS** | ink (byte-gleich ohne Patch, Kollision/Höhen gleich), fluffer B |
| C-1 | Fluff dunkel → fällt nativ → liegt → sinkt; außerhalb unverändert; gleicher Seed = gleiches Ereignis | **PASS** | orchard-npc b, fluffer C, flufferSim (deterministisch) |
| D-1 | Ein Bewohner bemerkt, weicht aus bzw. warnt, kehrt zurück; nicht allwissend | **PASS** | fluffer D (Lorekeeper-Platzhalter, einmal, Blick, Rückstand 0), npcThreat. Warnen nur als Geste (stumm, Ton von WS0) |
| E-1 | Heilen statt töten: weiße Augen, Goo hört auf, einmal bunter Fluff über `fluff.js` | **PASS** ohne Augen | fluffer E. **Weiße Augen: Lücke** (WSB-Variante), Heilung läuft ohne Augenwechsel |
| E-2 | Reinigen/Ablauf stellt den Patch wieder her, kein Quest-/Karten-Eingriff, kein geschenkter Ertrag außer dem einen Burst | **PASS** | flufferSim (Ablauf 180 s), fluffer E (Burst einmal, zweiter Treffer nichts) |
| F-1 | Kosten | **PASS** Modul · **FAIL** Gesamt-fps | Bewohner-Modul 0,1–0,17 ms/Schritt. fps A/B (sichtbares Chromium, 1600×900): ohne 32,3/31,4, mit Bewohnern + Fluffer 30,1/29,8 → **+1,5–2,3 ms** (Tusche-Shader + Ghost + Tropfen); zweite Messung unter fremder GPU-Last verrauscht. ≥ 55 fps: Basis-Grenze wie P-1a |
| F-2 | Clip aus der Spielkamera | **PASS** | `phase-c-spielkamera.webm` |
| F-3 | Kritiker CRITIC_3D_R1 | **NOT RUN** | |

**Lücken an WS0/WSB:** weiße Augen für Ghost; Eigentempo des Ghost-Walk-Clips nicht gemessen (Abspielrate 0,8–1,25 nach Tempo); Ghost-Größe 1,1 m (Georg bestätigt); Mob-Chant/Triplets und Ton (P2, WS0); Heil-Waffe vorerst Gun_Pistol (Georg), Team-Heilen mit den Hexen offen.

## 3 · 21.10. · Farmer B echt im Spiel · Georgs Entscheide zu Phase C

**Farmer B:** `Farmer_B.glb` aus `kayfabizarro` main (KayKit Mystery S6 „12 - June 2026 - Farmers“, Blob bc765229 = Pin @29c7500 in Georgs Augen-Batch), über das vorhandene Besetzungs-Werkzeug `scripts/cast/build-cast.py` als `farmer-b` aufgenommen (Augen aus `eye-rig-medium.batch-1` @ac9dbaed, AUTO_CANDIDATE wie Mage/Barbarian; bestehende Besetzung byte-gleich). **Georg 21.10.:** Farmer B „wie ausgeliefert“, also mit der eingebetteten Textur (das ist farmer_texture_A; farmer_texture_B.png liegt nur daneben). Vergleichsbild `evidence/phase-a/farmer-ab.png`.
- npc-a im Spiel PASS mit echter Figur (Sohlen −4,2 … +5,1 cm, Gang-Rate 0,8–1,25, Begegnung volle Grammatik + Waving, 0 Pop-ins).
- Matrix-Zeile M0-2: **Farmer B PASS** (echte Figur, Augen); **Lorekeeper weiter Platzhalter** (Mage, WSB K11). Georgs Batch enthält auch ein Lorekeeper-Augenprofil und `Lorekeeper.glb` mit Buch und Stab liegt in main – Frage an WS0, ob er vor K11 so laufen darf.
- **Widerspruch an WS0:** Writers Room `reality_redrawn` nennt Farmer_A „Bäuerin mit Kornschein“; `Farmer_A.glb` ist der Bauer mit Bart.

**Phase C, Georg 21.10.:** Dark Fluffer = `MonsterCuteCubes/glTF/Ghost.gltf`. Heil-Waffe (statt töten) vorerst `KayKit_Bits_Bundle1_1.1/Prototype Bits/Assets/gltf/Gun_Pistol.gltf`. Damit sind Cube und Heil-Auslöser entschieden; offen bleiben Patch-Ort und Baum (Vorschlag folgt), weiße Augen (WSB).

## 2 · 21.10. · Phase A gebaut (lokal, Zweig `ws-npc/phase-a`, kein Push) · Abnahmematrix

**Stand:** Spiel `kfb-planet`, Basis `terrain/439` @a701da4 (mit `kfb.world-save/1` und M1 dpr ≤ 1,25 des Leads), lokale Commits auf `ws-npc/phase-a` (Hash siehe Meldung an den Lead). Aufruf: `dist/index.html#m1,harvest,npc` (Start 0,27 Tag: erstes Treffen nach ≈ 20 s; `npct=<s>` setzt die Tageszeit).

**Was läuft:**
- Zwei Bewohner mit Tagesplan `kfb.npc-day/1` (Tag = 300 s): Farmer B (Bäuerin/Theaterdirektorin: Zuhause → Fluff-Baum pflegen → Treffpunkt Wiesenrand → Bühne prüfen → Baum → Zuhause) und **PLATZHALTER · Lorekeeper (WSB K11)** (Zuhause → Helden-Fluff studieren → Treffpunkt → zurück). Figuren: Farmer B fehlt auf diesem Mac, Platzhalter-Figur `adventurer-barbarian`, klar markiert; Lorekeeper-Platzhalter `adventurer-mage` (Lead-OK).
- Fahrplan statt Simulation: Lage = `planAt(t)` aus Plan + Route + Weltzeit; Live-Abweichungen (Spieler, Begegnung) holen mit ≤ 1,25 × Plantempo wieder auf.
- Begegnung über den portierten #210-Bus, Grammatik notice → approach → orient → greet|silent → react → part → resume, stabile ID `meet:farmer_b+lore_ph:d<Tag>:wiese_rand`.
- Einbau: ein ModuleHost-Modul `src/npc/residentLife.js` + kinematische Kapseln; `M1World.jsx` nur hinter Hash `npc` (+24 Zeilen), dunkler Fuß (terrain3) wie bei Spieler und Partnerin; Kontaktverdeckung ist seit V-587 aus M1 entfernt. Gruß-Clip `Waving` aus `Rig_Medium_Simulation.glb` as-is (KayKit Character Animations, byte-gleich mit `intake/loco`, Lead-OK 21.10.). Keine eigenen Licht-, Schatten- oder Materiallösungen.

**Abnahmematrix Phase A** (Belege: `test/unit/npcEncounter|npcWorld|npcSim.mjs`, `test/npc-a.mjs`, Bildreihe `test/out/npc/npc-a-sheet.png`, Clip `test/out/npc/clip/*.webm`)

| # | Zeile | Ergebnis | Beleg |
|---|---|---|---|
| M0-1 | Inventur je Quelle (übernommen / nicht / Lücke) | **PASS** (Entwurf) | `CANON_3D/sources/WS_NPC_INVENTUR_R1.md` |
| M0-2 | Echte Figuren aus cast.r1.json, `ready`, quell-isoliert (Farmer B, Lorekeeper) | **Farmer B PASS · Lorekeeper FAIL** | Farmer B echt (§3); Lorekeeper erst WSB K11, Mage-Platzhalter; cast.r1.json selbst weiter nicht auf diesem Mac |
| M0-3 | Jeder Clip isoliert nachgewiesen | **NOT RUN** | genutzt as-is: Idle_A, Idle_B, Walking_B, Interact, PickUp, Use_Item, Waving (Rig_Medium General/MovementBasic/Simulation) |
| M0-4 | Konzeptblatt Phase A | **NOT RUN** | WS0 schreibt es |
| M1-1 | Tagesplan `kfb.npc-day/1` für zwei Bewohner, deterministisch je Seed | **PASS** | npcWorld, npcSim |
| M1-2 | Arbeits- und Sozial-POIs mit Aktionsraum ≥ 1,5 m an echten Weltobjekten | **PASS** | npcWorld (Baum in Reichweite 1,7–1,8 m; kein Stamm/Fundsache/Laterne im Raum) |
| M1-3 | Zwei Routen-Varianten je Weg, beide benutzt; frei von Stämmen (≥ 1,7 m), Fundsachen (≥ 0,96 m), Laternen, Rang-Zaun, Theaterring | **PASS** | npcWorld; Spiegel = Spielstand (npc-a B) |
| M1-4 | Gang ohne Rutschen: Abspielrate 0,8–1,25, Sohlen am Boden (tiefste Sohle −2 … +6,7 cm), Wurzel auf dem Gelände | **PASS** | npc-a D |
| M1-5 | Unterbrechen durch den Spieler (stehen, drehen, schauen) und Fortsetzen mit Aufholen ≤ 1,25 × | **PASS** | npc-a E (aufgeholt nach 13 s), npcSim |
| M2-1 | Echte gegenseitige Begegnung über die Grammatik, beide richten sich aus | **PASS** | npc-a C (Blickfehler < 1°), Clip |
| M2-2 | Begegnung pausiert, wenn der Spieler dazukommt, und setzt am selben Beat fort; Fensterende bricht sauber ab | **PASS** (Node) / **NOT RUN** (im Spiel) | npcSim 4a/4b |
| M2-3 | Weggehen und Zurückkommen: beide exakt auf dem Plan, kein Sprung im Kamerabild | **PASS** | npc-a F (Abweichung 4e-16 m, 0 Pop-ins in 4 289 Schritten) |
| M2-4 | Gruß-Geste | **PASS** | Gruß und Antwort-Gruß = `Waving` (npc-a C_greetGesture) |
| M2-5 | Zeile oder Schweigen | **PASS** (Schweigen) | stumm bis WS0 Ton/Text liefert; Ausgang `silent` vorhanden |
| M2-6 | Spieler-Hinweis E an Bewohnern (`interactable`) | **NOT RUN** | in M1 gibt es keinen interactable-Host, E = seitwärts |
| P-1a | ≥ 55 fps aus der Spielkamera (Spiel gesamt) | **FAIL** · Basis-Grenze | sichtbares Chromium, Metal, 1600×900, dpr 1, Stand a701da4: Spiel **ohne** Bewohner 35,1/35,1 fps, **mit** 34,9/35,1 fps (p95 ≈ 28,6 fps); auf 4c6ec5a unter höherer GPU-Last 15,5 bzw. 15,4–15,7. Die Grenze liegt im Spiel selbst (GPU geteilt mit ~8 Sitzungen; Prüfer C misst, CODE_PERF_R1 §7) |
| P-1b | Anteil der Bewohner an der Bildzeit | **PASS** · kein messbarer Anteil | A/B je 900 Bilder auf beiden Ständen: Unterschied innerhalb der Streuung (≤ 0,2 ms); Modul 0,11–0,15 ms/Schritt, +41 Draw Calls, +51 k Dreiecke |
| P-2 | Stresstest 8/12/20 | **NOT RUN** | erst nach 2 Figuren + fps-Basis |
| V-1 | Clip aus der Spielkamera | **PASS** | `test/out/npc/clip/page@….webm` (32 s, Headless-GPU mit Aufnahme) |
| V-2 | Mechanisches Gate + blinder Kritiker (CRITIC_3D_R1) | **NOT RUN** | nach echten Figuren |
| T-1 | volle `npm test` (46 Tests, PW_GPU, Stand 4c6ec5a; nach Rebase auf a701da4: Node-Tests + npc-a erneut PASS, volle Reihe vor dem Code-Push) | **PASS** außer bekannten Wacklern | Gesamtlauf 42/46; einzeln: s5a PASS (zuvor Zeitprüfung bzw. Netz 403), drift PASS (fehlte nur `test/out/drift/drift-report.json` im frischen Worktree), c2 PASS im Software-Modus; **orbit FAIL** (`calmAfterRelease`, SW: Zeitüberschreitung). Gegenprobe auf dem unveränderten Lead-Stand 4c6ec5a: orbit und c2 scheitern dort gleich → nicht durch Phase A |

**Phase A ist damit nicht abgenommen** (M0-2 FAIL, P-1a FAIL als Basis-Grenze; mehrere NOT RUN). Kein „MVP PASS“.

**Clip-Liste an WS0 (WSB baut):** `Digging` bzw. Harke/Mistgabel-Arbeit (Farmer B am Baum), Lesen/Buch (Lorekeeper). Alles für Rig_Medium.
**Lücken an WS0:** Konzeptblatt Phase A; Scheune/Strohballen-Bühne und Kartenraum als Orte (heute nur Stellen ohne Asset); Knete für die KayKit-Adventurer (keine Figurenkarte → kein `claySSOT`-Profil, Spieler und Partnerin haben eins).

**Phase C Schritt 0 (Quell-Audit, Lead-Freigabe):** erledigt, siehe Inventur §6. Isolationsbilder der 16 Bodenläufer (+Z bestätigt, Höhen = Spender), Lücken Maul-Anker (V-584) und Gelände-Patch (Terrain-Owner). **An WS0:** Cube wählen (Vorschlag Skull oder GreenDemon), Heil-Auslöser wählen (Vorschlag T Saugarm), weiße Augen bei WSB.

**Nächstes Gate:** Farmer-B-Dateien auf diesem Mac (Lead/WS0) → Tausch der Platzhalter-Figur, Clip-Isolation, Kritiker. Phase C P1 nach WS0-Entscheid zu Cube, Patch, Baum und Heil-Auslöser.

## 1 · 21.10. · Inventur-Entwurf + Bauplan Phase A

**Gelesen:** Brief R2, Dark-Fluffer-Brief, Patrol-Spec, PR-#400-Paket (R0.6, R0.7, R0.8, R1-Audit, Workshop R1, Intake, R0.9, Fluffer-Konzept + Follow-on), Dramatis Personae + Writers Room (`ws-song/workshop-r1`: FIGURES_R1, PERSONAE_PATCH_R1, RESIDENT_DP_ALIGNMENT_R1, Export 2026-10-20c), CANON_3D R1 + Konzeptblatt-Vorlage + Kritiker, PR #210 `encounter-bus.js` @f534a056, PR #272 AIDA @992ea98, Spielcode `terrain/439` @fd5ccc5.
**Nicht gelesen:** `60_CAST/cast.r1.json`, `clips.r1.json` (nur im Hub/Dropbox, auf diesem Mac nicht vorhanden); Google-Doc (Anmeldung nötig).

**Inventur:** `CANON_3D/sources/WS_NPC_INVENTUR_R1.md` (dieser Zweig). Kurz: Plan-Logik, Begegnungs-Bus und Bewegung lassen sich vollständig aus vorhandenen Quellen bauen. Es fehlen die Figuren-Dateien.

**Blocker (bitte Lead / Georg):**
1. **Farmer B (`farmer_harke`)**: GLB, Augenprofil, Figurenkarte nicht auf diesem Mac. Bitte nach `~/kfb-ws1/private/cast/` kopieren (lokal, nicht in Git), zusammen mit `60_CAST/cast.r1.json` und `clips.r1.json`.
2. Platzhalter zweite Rolle: Vorschlag `adventurer-mage` (im Spiel, KFB-Augen aus Georgs Batch), markiert `PLATZHALTER · Lorekeeper (WSB K11)`. Ob sie in cast.r1.json `ready` ist, kann ich ohne die Datei nicht prüfen.
3. Clip `Waving` (Grüßen) liegt nur unter `~/kfb-ws1/intake/loco/Rig_Medium_Simulation.glb`, nicht im Spiel. Darf ich das Paket as-is nach `src/assets/actors/` aufnehmen?

**Bauplan Phase A** (Laufzeit-Code nur lokal auf `ws-npc/phase-a`, Push erst nach WS0-Go):

| Schritt | Inhalt | Beleg |
|---|---|---|
| A0 Kern (rein, Node) | `src/npc/npcRoute.js` (`kfb.npc-route/1`: Polylinie, Länge, Lage/Blick bei s), `src/npc/npcDay.js` (`kfb.npc-day/1`: Zeit → POI, Aktivität, Route-Variante; `planAt(t)` deterministisch aus Seed + Tag), `src/npc/encounter.js` (Port #210 + `orient`, `silent`, `cancel`, `interrupt`/`resume`, stabile IDs) | Node-Tests: 21 alte #210-Prüfungen + neue (Abbruch, Unterbrechen/Fortsetzen, Überschneidung, Aufräumen, Schweigen, gleicher Seed = gleicher Tag, zwei Seeds = andere Route) |
| A1 Daten | `src/data/npc/pois.r1.json`, `routes.r1.json`, `days.r1.json`: Farmer B Arbeit = Obstgarten-Bäume (Fluff-Ernte), Sozial = Wegkreuzung am Demo-Weg / Amphitheater-Rampe (Theaterdirektorin), Zuhause = Ort ohne neues Asset (Scheune fehlt); Platzhalter-Rolle Arbeit = Billboard-Karte lesen, Sozial = dieselbe Kreuzung. Je Bewohner 2 Routen-Varianten | Node: jeder POI ≥ 1,5 m frei (Bäume, Zaun, Weg), Routen außerhalb des Rang-Zauns, Steigung begrenzt |
| A2 Modul | `src/npc/residentLife.js` (ein ModuleHost-Modul): Darsteller-Slot + GaitAnimator (V-248, Füße stehen), Ankunft = abbremsen → drehen → Blick → Aktions-Clip as-is; **Plan ist Wahrheit**: Abweichungen (Begegnung, Unterbrechung) holen danach im Tempo-Fenster ≤ 1,25× wieder auf. Blase: nah = voll, fern = seltener animiert, Lage immer aus dem Plan. Kinematische Kollider, Spieler-Hinweis über `interactable` | Browser `#m1,harvest,npc,debug,replay` |
| A3 Begegnung | Beide am Sozial-POI → bemerken → annähern → ausrichten → grüßen oder schweigen → reagieren → trennen → weitermachen; Spieler nähert sich → Unterbrechen (Blick, Gruß), danach Fortsetzen | Test: Beat-Folge, beide belegt, keine zweite Begegnung, Fortsetzen am selben Beat |
| A4 Weggehen/Zurückkommen | Spieler > R weg, Zeit läuft, zurück: beide stehen dort, wo der Plan sie sieht; kein Sichtbarkeitswechsel im Kamerabild | Test: Lageabweichung ≤ 0,05 m zum Plan, 0 Pop-ins im Frustum |
| A5 Abnahme | Abnahmematrix (PASS/FAIL/NOT RUN je Zeile), Clip aus der Spielkamera, fps (perfBudget + Messung im Spiel), volle `npm test` | Matrix hier + an Lead |

Einbau in `M1World.jsx` nur hinter dem Hash `npc` (eine Zeile + ein Kollider-Baustein), damit der Diff zum Lead-Stand klein bleibt.

**Nächstes Gate:** Lead/Georg zu Blocker 1–3; WS0 zum Konzeptblatt Phase A. A0 und A1 baue ich jetzt (brauchen keine Figur-Dateien).
