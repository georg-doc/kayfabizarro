# Lead-Sammlung 27.10.2026 · alles aus dem Lead-Chat für die Weiterarbeit in WS0

WS1 Lead für WS0 · Auftrag Georg (27.10.): „Alles, was wir besprochen haben, komplett bei GitHub einchecken, mit Kommentaren, damit wir es in WS0 weiter ausarbeiten können.“

**So ist das Dokument aufgebaut:**
- Je Thema stehen der Stand, die Quelle bzw. das Dokument und ein **Kommentar Lead** (Einschätzung, Empfehlung, was als Nächstes zu tun ist).
- Entscheidungen Georgs sind mit Datum markiert; alles andere sind Vorschläge.
- Das Register (V-Nummern) führt ihr. Hier stehen keine neuen V-Nummern.

## 1 · GitHub-Stand am 27.10. (morgens)

| Was | Wo | Stand |
|---|---|---|
| WS0-Spiel | KFB-Stunt-Car-Race `game/proc-world-ws0` | @5fb46e7 (V-861, 27.10. 05:09) |
| Register | kayfabizarro `docs/kfb-decisions-register-2026-10-11` | @472e1c55b (V-841, 26.10. 00:21) |
| WS1-Spielstand privat | KFB-Stunt-Car-Race `game/mvp-r1` | **@9a95ea9 = mvp e88689c (heute nachgezogen)** |
| WS1-Spielstand öffentlich | kayfabizarro `ws1/mvp-r1` | **@5ec9e21** (Spiegel e88689c; @372a93e davor war versehentlich leer, harmlos) |
| WS1-Status und Dokumente | kayfabizarro `ws1/status` | §176–§178 und `docs/*` (diese Datei) |
| Abnahme-Bündel | KFB-Stunt-Car-Race `abnahme/ws1` | um den Abnahme-Seiten-Schnappschuss ergänzt (siehe §7) |
| Site | KFB-Stunt-Car-Race `site/mvp-r3-dist` | @c41dc9a (von euch, aus proc-world @da7b084) |

**Kommentar Lead:**
- Im Register fehlen V-842 bis V-861. Es gibt sie bisher nur als Commit-Texte in `game/proc-world-ws0`. Falls das die Stelle mit den Merge-Konflikten ist: Im öffentlichen Repo melden alle offenen PRs „mergeable“ (#447, #448, #453, #454, #455). Konflikte gibt es nur beim Mischen unseres Spielstands in euren, siehe §2.

## 2 · Merge-Konflikte `game/mvp-r1` → `game/proc-world-ws0`
- Ausführlich mit Empfehlung je Konflikt: **`docs/MERGE_HINWEISE_PROC_WORLD_R1.md`**.
- Kurz: 17 Konflikte in 4 Dateien (`M1World.jsx`, `M2Car.jsx`, `kfbAudio.js`, `AudioHost.jsx`). Ursache sind zwei S1-Wege: euer `mount=live` gegen WS1ds `travel=1`.
- **Kommentar Lead:**
  - Euren Weg als Basis nehmen und `carLive()` als Alias auf `CAR_LIVE.on` setzen.
  - **Die Telemetrie aus unserer Seite behalten:** Säule zu Fuß und Höhe über Grund sind Georgs Wahl vom 25.10.
  - Fluff-Effekt, Vorwärmen und den `travelState`-Haken fürs Fahrzeug-Symbol übernehmen.

## 3 · World Explorer (Georg 26.10.): Evaluierung und Konzept R1.1
- **Dokument:** `docs/WORLD_EXPLORER_EVAL_R1.md`. Seite: https://claude.ai/artifact/Af1oi1n5n9WrpX6pLtFVMU; HTML-Kopie: `docs/seiten/world-explorer-spender.html`.
- **Urteil:** wie eure R7-Notiz (PR #447). Keine Basis, keine Laufzeit, kein OSM- bzw. Höhen-Streaming zur Laufzeit. Fünf Spender:

| Spender | Stand | Kommentar Lead |
|---|---|---|
| P1 Gelände-Blätter im Worker | Angebot an euch | unsichtbar; `createEndlessHeight` ist schon three-frei. **Falle:** `cardgrid=0`/`boards=0` aus `location.hash` sieht der Worker nicht. Der Lead liefert Patch und Golden-Test, wenn ihr wollt |
| P2 Horizont-Hülle | nach Bildpaket | ein Draw Call; hilft bei Racer-Flug und Drohnen-Zoom |
| P3 echte Höhenmuster (Terrarium) | Frage an Georg offen | nur offline gebacken; gibt der Kölner Tasche eine gemessene „Ebene“ (V-747) |
| P4 ferne Bäume als Popup-Aufsteller | Frage an Georg offen | im Stil der Pariser Werbetafeln (V-839) |
| P5 Brücken-Profil | HOLD | erst mit Wasser und Kölner Tasche |

## 4 · Verkehr, Wetter, Kaiju, Z14 (Georg 26.10.)
- **Verkehr: zurückgestellt, nur einplanen (Georg).**
  - Wege: A Pisten je Zelle, B Stadtzonen, C Straßennetz (Welt-Entscheid).
  - **D: Georgs Idee „Freeroaming zwischen Orten“:** Autos fahren quer durchs Gelände von Kartenzone zu Diorama zu Popup-Szene.
  - Vorschlag „Seele nach Entfernung“: fern anonym, nah ein Bewohner mit Signatur-Deck und Ruf-Skala.
  - **Kommentar Lead:** D passt am besten zur heutigen Welt (keine Straßen nötig). Ziele sind die Orte, die die Regie R0 ohnehin kennt (Szenen-Raster, R1.6 §4).
- **Wetter und Himmel:** WS0 hat das meiste schon.
  - Lehre 1: ein **Tageslicht-Vertrag** in `driveAtmos` (`daylight()/isNight()/onDaylight()`). Heute schalten HUD (≤ 0,25), Musik (< 0,18), Scheinwerfer (eigene Kurve), Tafeln und Grillen getrennt auf „Nacht“, und Wetter zählt meist nicht mit.
  - Lehre 2: Wetter mit Folgen (Nässe-Wert: Schirme, weniger Leute).
  - Idee: Himmel bevölkern, Wetterfronten als Feld.
  - **Kommentar Lead:** Der Vertrag ist klein und unsichtbar; Patch auf Wunsch.
- **Kaiju:** japanisch „Riesenmonster“.
  - **Georgs Idee:** ein Godzilla-artiger Kampf mit 3D-Modellen, der Riese als Black bzw. Dark Fluffer oder Goo-Monster. Einplanen bei Combat (V-782) und Destruction (V-767).
  - Technik-Spender: Gebäude-Schaden über eine Zustands-Textur, Panik-Menge, GPU-Partikel, Modus-Controller.
- **Z14:** Kartenkacheln zum Zeichnen, vereinfacht, oft ohne feste OSM-IDs. Deshalb bleibt das OSM City Lab Owner der Geografie.

## 5 · Waffen und Kampf (Georg 26.10.)
- **Korrektur Georg:** Heilen ist ein **Meta-Gimmick**, keine Standardwaffe, und kann ganz anders laufen. Der normale Kampf (bisher POC in der Combat Arena) braucht **differenzierte Waffen und Mechaniken**.
- **Arsenal R1:** `docs/WAFFEN_ZUORDNUNG_R1.md`. Seite: https://claude.ai/artifact/5Dpj76JoSeS52wxECdia7k; HTML-Kopie: `docs/seiten/kfb-arsenal.html`.
  - 12 K10-Karten sind den 8 Gefühlsprofilen aus `kfb-combat-def.js` zugeordnet, dazu neue Mechaniken: Spannschuss, Kettenblitz, Kombo, Hitze, Zonen.
  - Zwei Profile ohne Modell: Scrap Cannon und Mortar.
- **Mechanik-Katalog und World-Explorer-Lehren** (Zielhilfe, Aufschalten, Schwachstellen, Zerstörung über Zustands-Textur, Modus-Controller für Minigames): `docs/WORLD_EXPLORER_EVAL_R1.md` §3b.5 und §3b.6.
- **Kommentar Lead:**
  - Weiter mit dem Waffen-Konzept R1 bei WSA, mit Prüfkriterien und einem Clip je Waffe. Dann wählt Georg.
  - **Offen bei Georg:** die Signaturwaffe von FrizzleBob.
  - Kauf-Modelle (Blaster, Action-Gewehr, Minigun) bleiben privat.

## 6 · Offene Fragen an Georg (zusammengeführt, Stand 27.10.)
Abgeglichen mit `OFFENE_PUNKTE_GEORG.md` in `abnahme/ws1` und der Lead-Liste vom 24.10.

**Neu (26.10.):**
1. Echte Höhenmuster (Kölner Bucht, Herkules) als Grund für Stadtzonen: ja, zuerst als Bild? (P3)
2. Ferne Bäume als Popup-Aufsteller: ja, als Bildpaket? (P4)
3. Verkehr: Soll C, ein Straßennetz in der Endlos-Welt, als eigener Welt-Entscheid auf die Liste? (D ist notiert.)
4. Signaturwaffe für FrizzleBob (Arsenal R1).

**Weiter offen (aus der Abnahme):**

5. S1-Bildpaket „Auto rufen“ (6 Keyframes): Passt der Ablauf?
6. Fahrzeug-Symbol A oder B (Empfehlung B, Taste J).
7. Flug-Block: Kesseldruck als Füllung oder weg (Empfehlung weg).
8. HUD Paket 7 „passt so?“ (Boost A, Almanach A, Säule zu Fuß, Höhe über Grund ist umgesetzt).
9. Tratsch-Trio (`lines=tr1`) als Standard; Satz-Opener (20) und Erwiderungen (4); tr1-Zeilen fürs Orakel nur nach Okay.
10. Wechselrede bzw. Begrüßung mit „Boggle...?“-Blase so lassen? Disco-MC ruhig bis zum ersten Ruf?
11. Kleine Karten: Kit-Knete (Empfehlung Stufe 2), Wasser R2, Käfer-Scheinwerfer (Empfehlung 35 %), Sperrliste tr1.
12. §175: Signatur-Deck für FrizzleBob und die Dark Fluffer (S3, Karte je Szene).
13. Ton (Owner WS-Audio): Spielfigur ohne Instrument (eigene Familie?), Kazoo/Trompete für Skelette und Soldaten, FrizzleBob Posaune/Talkbox.

**Erledigt bzw. entschieden (nur zur Info):**
- Ebene-Relief für Stadtzonen (V-747).
- Tempo als Säule mit gleichem Maßstab für Fahren und Fliegen, drei Zonen bis Rot.
- Höhe über Grund, Säule zu Fuß.
- Paket 4 abgenommen.
- Chatterbox nur mit Blasen, Silben hinter `chat=syl` ohne weiteres Tuning (V-746 Tier 0).
- Orbit-Test stabilisiert (mvp 86bfbf3).
- Verwaister Vite-Prozess (PID 95416) läuft nicht mehr.

**Wartet auf Georg im jeweiligen Fenster:** Freigaben bei **WS1b** (Endlos-Biom-Fahrt) und **Deck-Analyzer**. Beide Sitzungen stehen auf „waiting“; nur Georg kann dort bestätigen.

## 7 · Abnahme und Seiten
- Zentrale Abnahme bleibt `abnahme/ws1` (Bilder, Videos, Karten, `OFFENE_PUNKTE_GEORG.md`).
- Neu dort: `seiten/kfb-abnahme.html`, Schnappschuss der Abnahme-Seite (Artefakt https://claude.ai/artifact/HVwr3YSWy1MFfSEyLCrFi6). Die Bilder der Seite liegen im Artefakt; im Zweig liegen dieselben Motive unter `bilder/` und `karten/`.
- Seiten dieses Chats als HTML-Kopie auf `ws1/status` unter `docs/seiten/`.

## 8 · Regeln und Lehren, die für WS0 mitgelten
- **Pushes:** `set -e` bricht in unserer Bash-Umgebung nicht zuverlässig ab (27.10.: leerer Spiegel-Commit). Jeden Schritt mit `|| exit 1`, vor dem Commit Teilbaum und Parent prüfen, nie mit leerer Variable pushen (24.10.: assets/private gelöscht und wiederhergestellt).
- **Private bzw. gekaufte Modelle** nie in kayfabizarro oder öffentliche Vorschauen. Songs und Effekte dürfen öffentlich sein.
- **Kein Merge nach main ohne Georg.** Abnahme nur im Live-Stand mit Site-Hash. Neues Aussehen nur hinter Schalter, bis Georg es gesehen hat. Bildpaket vor dem sichtbaren Bau (V-740).
- **Heilen** ist Meta-Gameplay, keine Kampf-Grundregel (Georg 26.10.).
- **Keine Lizenzprüfungen bzw. -anfragen**; Creator-Credits bleiben. Für World Explorer: MIT „© 2026 Jerry Xie“; Terrain Tiles (Mapzen/AWS) und „© OpenStreetMap contributors“ in die Credits, falls genutzt.

## 9 · Was der Lead als Nächstes anbieten kann (auf Zuruf von WS0)
1. P1-Patch (Gelände im Worker) mit Golden-Test gegen `endlessTerrain.js`.
2. Tageslicht-Vertrag für `driveAtmos` als Patch.
3. Merge-Hilfe: Konfliktauflösung als fertiger Branch zum Prüfen, z. B. `ws1/merge-proc-world-r1`. Nur wenn ihr das wollt; sonst löst ihr selbst nach `MERGE_HINWEISE_PROC_WORLD_R1.md`.
4. P3-Back-Skript (Terrarium → Höhenmuster), sobald Georg Frage 1 bejaht.
