# Briefing Slice 3 · Fahrhilfe M3 „Assisted Stunt“ Schritt 1 auf K2B (R1 · V-379)

Stand 17.10.2026 · von WS0 freigegeben als V-379 (Hub b70) · Grundlage V-290, V-347, V-351, V-352, V-367, V-370, V-375, V-378 · Recherche `WSA_CARTOON_RACER_RESEARCH_R1_2026-10-16` · Spender `STUNT_DONOR_MAP_R1.md`, `DONOR_F1SIM_R1.md`

## Ziel
Wildes, achterbahnartiges Cartoon-Fahren auf K2B, das sich nie bestraft anfühlt: kein Überschlag, kein Nasenstand nach kleiner Rampe, Landung in Fahrtrichtung, nie festfahren, bouncy Abprallen mit Squash an Gebäuden. Danach markierte Rampen (Push/Launch) und Wände (Ride-Surface), auf denen das Auto assistiert auf zwei Rädern fährt. Q/E-Drift, Wendekreis und Tastenbelegung bleiben wie in m2/fahren @5ff47c8.

## Rahmen
- **Start erst nach** V-345 `worldScale.js` und M2-Merge (Georgs Zustimmung, ecctrl raus). Schwellen in echten Metern; Rampen/Wände aus dem Kollisions-Deskriptor von Slice 1 (Hang ≠ Wand).
- **K2B ist die einzige Fahrbasis** (V-367). Keine zweite Fahr-/Physik-Runtime; ecctrl wird nicht weiter abgestimmt.
- **Warp-Fahrt / Guided Hyperspeed ist nicht Teil** (nach M2, eigener Pilot).
- **Besitzer:** WS1 Bewegungs-Sitzung. Langlauf nach V-375 (keine anhaltenden Rückfragen, Stand-Commits alle 30–45 Min., kein main-Merge, am Ende Vorschau + Messwerte + Clay-Beweise).
- **Grundsätze aus den Spendern:** Assist zonenweise „freie Anfahrt, weiches Einfangen, stabiler Commit, bewusste Freigabe, schnelle Recovery“; kein globales Wandkleben, keine unsichtbare Spline gegen die Eingabe; Deformer ändern nie die physische Kontaktpose; kein harter Snap, nur gedämpfte Rotation.
- **Messregel:** jeder Fahrtest zweimal, bei ≥ 50 fps **und** gedrosselt auf 30 fps (Zielgerät p95 ≥ 30 fps, V-370). fps im Protokoll; ein Test unter 50 fps ohne Drossel-Absicht zählt nicht (Tunnel-Fehl-PASS, V-138).
- Alle Zahlen unten sind **Startwerte zum Abstimmen**; wo kein Spender Werte liefert, setzt WS1 sie und begründet sie im Status (V-375).

## Stufen (Reihenfolge; nächste Stufe erst nach PASS der vorigen)

**A · Fester Schritt + Interpolation unter K2B.** Spender: `DONOR_F1SIM_R1` `src/lib/f1-physics-2026.ts` 529–567 (nur Idee): 120 Hz, Render-Interpolation `alpha = acc/dt`, dt-Clamp + max. Schritte; Alternative Rapier-CCD am Fahrzeug-Collider. Abnahme: 0 Wand-Durchfahrten in 50 Anfahrten (Vollgas + Boost, beide fps); Sprungweite gleicher Rampe 30 vs. 60 fps ≤ 3 % Abweichung; Regression: 180°-Wende ≤ 1,9 Wagenlängen, 20 Vollgas-Läufe 0 Überschläge, Neigung ≤ 10 ° (heute 1,79 / 0 / 9,7 °).

**B · Anti-Roll, tiefer virtueller Schwerpunkt, Luftlage.** Spender: **neu bauen** (alle Spender setzen erst nach dem Umkippen zurück). Werte aus K2B-ASSIST: flyGravity 13,3 · flySteer 0,35 · flyMax 8. Recherche (Vorschlag, ungetestet): virtueller Schwerpunkt deutlich unter dem sichtbaren, Anti-Roll-Moment bei seitlicher Neigung, Auto-Righting ab 60–90 ° Neigung bei wenig Tempo, leichte Downforce bei hohem Tempo, Hang: Schwerkraft leicht hangabwärts, Querbewegung dämpfen; Kanten < 30 ° als Mini-Rampe. Abnahme: 0 Überschläge in 40 Rampenläufen (4 Rampentypen × 5 Tempi × 2 fps), davon 10 Nasen-Tests (langsam von niedriger Kante rollen): 0 × Nickwinkel > 45 ° länger als 0,5 s; Hangfahrt quer 20 × ohne Seitwärtshüpfen/Dauerrollen.

**C · Landehilfe in Fahrtrichtung.** Spender: K2B-ASSIST in Lab `src/play/vendor/kfb-drive.k2b.js` (landAim 1,0 · landAhead 6 · align 2,4 · alignSteer 0,25 · psiMax 0,85); Handover v1_41: nach Landung nur Normalbewegung begrenzen, Tangentialfahrt bleibt; Landungs-Squash vN/12 (0,3–1,4). Recherche: kurzes Grip-Fenster mit gedämpfter Seitbewegung; zu steiler Aufprall → kleiner Bounce + Aufrichten, kein Spin-Out. Abnahme: Gierfehler zur Geschwindigkeitsrichtung ≤ 10 ° binnen 0,3 s nach Aufsetzen (30 Sprünge, beide fps); 0 Spin-Outs; Tangentialtempo nach Landung ≥ 85 %.

**D · Anti-Steckenbleiben, Recovery-Stufen.** Spender: K2B-ASSIST `rescue`; Reverse-Assist in Stunt-Repo `ChatGPT_web/free-roam/site/drive-intent.mjs`; Rollover-Reset Stunt-Repo `race/src/physics.js`; P2-`recover` 1,35/1,4/1,7, Zieltempo 9. Stufen (Recherche): T1 Vor-/Rück-Nudge, wenn Tempo < X und Winkel > Y länger als Z s; T2 Auto-Righting gedämpft; T3 weicher Respawn am letzten sicheren Punkt in Fahrtrichtung. X/Y/Z setzt WS1. Abnahme: 20 Fallen (Ecke, Dach, Seitenlage, Nase, Mulde, zwischen Gebäuden) → fahrbereit ≤ 3 s ohne Tastendruck; T3 höchstens 2 von 20.

**E · Deformer v2 + Abprallen an Gebäuden.** Spender: kayfabizarro main `tools/KFB-ToolBox/_inbox/KFB Cartoon Vehicle Deformer Lab v2/WSA_Vehicles_v2_2026-09-18/lab-v7/vehicle-cartoon-deformer.v2.js` + `deformer-profiles.json`, Profil `CAR_CHILL_LIGHT` (squash .03 · stretch .03 · lateral .02 · pitch 4 ° · roll 5 ° · driftYaw 8 ° · impact .07 · landing .09 · Feder 3 Hz · Dämpfung .55); GPU-Kern aus `tyre-deformation.ts` 64–219 (MIT, CREDITS; Schatten-Material mitverformt); `WALL_IMPACT {speed, normal}` nach Idee `VehiclePhysics.ts` 1384–1460 / `TrackColliderQuery.ts` 383–470. Abprallen: wallReflect 0,4 · wallKeep 0,995 · Bande bounceBase 4,6 · retention 0,985. Mapping Beschleunigung→Stretch, Drift→Lean, Landung→Squash, Crash→asymmetrisch + Wobble. Abnahme: Ereignis bei 30/30 Aufprallen über Schwelle; Collider-Pose unverändert; kein Stillstand, weiterfahrbar ≤ 0,5 s; Kosten im Performance-Overlay, Budget V-370 gehalten.

**F · Rampen- und Wandzonen (Push/Pull).** Spender: P2-Zustände free/capture/commit/release/recover, Stunt-Repo `_inbox/KFB_P2_GUIDED_DRIVING_v0_1/` (`assist-profile.json` `chill`: capture .65/.75/.95 · commit 1.05/1.15/1.35 · releaseSeconds .8 · Abbruch bei Lenkung > .82 für .32 s; `stunt-zone.schema.json`); Launch-Ramp = Zusatzimpuls (Handover §205 ff.); „Pull“ = Neugier, kein Sog; Wandfahrt-Ablauf `WALL_RIDE_BACKLOG.md` (Branch `wsa/osm-city-drive-c1-deformer-2026-09-19`); Zwei-Rad an der Wand `vehicle-twowheel.v1.js` `wallride` (TIP_SAFETY .92 · WALL_LEAN .45 · holdMs 1400). Testfeld-Rampe: Branch `work/free-roam-s04-03-stuntfield`. Wandfahrt nur bei Kontakt + markierter Fläche. Abnahme: Launch 10/10 auf den Rädern in Fahrtrichtung; Wand 10/10 Einfangen → entlang → Freigabe; Abbruch per Lenkung 10/10; 0 Einfangen an unmarkierten Wänden (20 Fahrten).

**G · Präsentation (optional, Loot) – nur wenn A–F PASS.** Spender lab-v7 `vehicle-tumble.v1.js` (Fassrolle), `vehicle-fishtail.v1.js` (Schlingern); Zwei-Rad `free`. Ausgelöst per Sprung bzw. als Signature Card, kein eigener Stunt-Modus. Abnahme: jeder Trick endet 20/20 auf den Rädern, Lenkung bleibt aktiv.

**Georg-Fühlprobe** am Ende: Vorschau mit Vergleichsleiste „M3-Assist | vorher“, Label „Fahrsystem: K2B · Assist M3 an/aus“, Tastenliste im Info-Symbol.

## Abnahme-Raster
| ID | Prüfung | Schwelle | Beleg |
|---|---|---|---|
| G-A1 | Tunneln | 0/50 Durchfahrten, ≥ 50 fps und 30 fps | Testprotokoll mit fps |
| G-A2 | fps-Unabhängigkeit | Sprungweite 30 vs. 60 fps ≤ 3 % | Messtabelle |
| G-A3 | Regression M2 | Wende ≤ 1,9 WL · 0/20 Überschläge · ≤ 10 ° | Node-Messung |
| G-B1 | Kein Überschlag | 0/40 Rampenläufe | Protokoll + Clip |
| G-B2 | Kein Nasenstand | 0/10 (> 45 ° > 0,5 s) | Clip vorher/nachher |
| G-C1 | Landung in Fahrtrichtung | Gierfehler ≤ 10 ° in 0,3 s, 0 Spin-Outs | Messtabelle + Clip |
| G-D1 | Nie festfahren | ≤ 3 s in 20/20 Fallen, T3 ≤ 2 | Protokoll + Clip |
| G-E1 | Squash ohne Posen-Änderung | 30/30 Ereignisse, Pose unverändert | Clip + Bildpaar |
| G-F1 | Zonen | Launch 10/10, Wand 10/10, Fehl-Einfangen 0/20 | Clip |
| G-P | Leistung | p95 ≥ 30 fps Zielgerät-Drossel, ≥ 60 fps M1 Max, ≤ 300 Draw Calls | Performance-Overlay |
| G-V | Beweise | alle Bilder/Clips mit Clay-Material (`vehicle`), Sättigung ≥ 95 % | `ws1/proofs/…` |
| G-G | Fühlprobe | Georgs Urteil | Status-Eintrag |

## Nicht in diesem Slice
Warp-Fahrt / Guided Hyperspeed / Hover-Rush · Hero-Shot-Kamera und Hero-Sequenzen · Loop, Magnet, Skyramp, Bounce-Pads (RKIT-08/09) · globales Wandkleben · Drift-Hop mit Boost-Fenster (Drift bleibt wie M2) · VFX V1 und Motorsound-LoopGrid (direkt danach in Slice 3, V-370) · Rennstrecken, Item-Waffen, Kart-Menü · ecctrl-Abstimmung · F1-Sim-Steuerung, -Assets, `CarAudio.ts`, `visual-fx.ts`.

## Entscheide WS0 (17.10., V-379)
1. **Wandfahrt bleibt drin**, obwohl die Recherche „kein Wall-Ride in R1“ rät: Georg hat sie ausdrücklich verlangt (V-351). Nur bei Kontakt mit markierter Fläche, kein globales Kleben.
2. **Lande-Boost in Stufe C mitbauen**: kurz, lenkbar, Startwert 1,55 aus FEEL, abschaltbar in der Vergleichsleiste; Georg urteilt in der Fühlprobe.
3. **Respawn T3 ist erlaubt, aber nie als harter Schnitt** (Regel „keine harten Schnitte“): sichtbarer Cartoon-Übergang (Hüpfer/Puff, Auto plumpst am letzten sicheren Punkt in Fahrtrichtung auf), nur als letzte Stufe.
4. **Abnahme-Schwellen** sind WS0-Vorschläge; WS1 darf sie mit Messbegründung im Status anpassen (V-375). X/Y/Z beim Anti-Steckenbleiben setzt WS1.
