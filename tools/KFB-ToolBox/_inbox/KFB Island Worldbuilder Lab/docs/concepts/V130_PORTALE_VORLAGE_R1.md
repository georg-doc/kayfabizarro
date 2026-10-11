# V-130 · Portal-Bausätze + Profil Bogen / Rechteck im Feld-Tunnel · Vorlage-Zeile R1 · 2026-10-11

Georgs Urteil zum Prototyp: TUNE (V-130). Die Joyride-Tunnel-Ein- und -Ausgänge fehlen in allen 4 Looks. Das Rechteck soll als **Profil** baubar sein, nicht nur als Fassade. Prüfkörper laut Steuerung: TC1-Knethügel auf einer Geraden, dazu ein MVP-Inselkörper über den Adapter (V-127: das Hirn ist nur Platzhalter).

## Warum die Portale im Prototyp fehlten

- Die Ursache war meine Eingrenzung des Prototyps. In `tunnel-field.ts` `fieldTunnelParts` habe ich nur die TC1-Kleinteile der race_tube (Bänder und Lampenkuppeln) auf die Feldwand gesetzt.
- Der Portal-Satz (race_rim + Lampenschild, arch_stones, rect_stones, timber) und der Innenausbau je Look (ribs, frames) sind in `tunnel-insert.ts tunnelParts` vorhanden, wurden aber nicht übernommen.
- Außerdem war der Ring fest der Bogen des O1-Stücks (Preset `gotthard`, Form `arch`).
- Im Konzept stand „TC1-Kleinteile projiziert“; die Portale hätten dazugehört. Das gehört so in den REPORT.

## Was es gibt

| Baustein | Pfad | Stand |
|---|---|---|
| TC1 Tunnel-Looks v3 (Gold) | `KFB_JOYRIDE_J15_…/evidence/tc1-looks.v3.jpg`; Code `src/world/organ/vendor/j17/lab-track/tunnel-clay.tc1.js` (vendored), Seite `KFB Joyride TC1 · Tunnel-Looks.dc.html` | 4 Looks: Wirt `mound` (Höhenfunktion `moundLift`) bzw. `shell`; Portal + Innen je Look; Ring je Look aus `td.tunnelLooks.looks[look].ring` (Core-kompiliert; portal_match / tunnel_shell PASS) |
| Rechteckprofil | Core v0.12 `TUNNEL_SHAPES.rect` (Superellipse e 10, abgerundete Ecken), `tunnelSpec` / `unitRing` / `fitLift` (`vendor-j15/lab-track/core/track-core.v012.mjs` Z. 1137 ff.); kompilierte Ringe in `p1b.export.json → tunnelLooks` | Bogen = `arch`, Rechteck = `rect`, je mit Fahrzeug-Hüllkurve gefittet |
| Portale + Innenausbau | `src/world/tunnel/tunnel-insert.ts` `KITS` + `tunnelParts` (TC1 1:1 + Q1/Q5-Anpassungen aus C1b-C3 r2) | an Wirt-Körpern per Boolean geprüft (V-112 PASS r2) |
| Feld-Tunnel | `src/world/tunnel/tunnel-field.ts` (Prototyp) + `tunnel-host.ts` (Naht-Schnitt, Wandfarbe) | Hirn race_tube: geschlossen, Q1 0, Q5 19,6 m |
| Mesh → Feld-Adapter | Konzept-Nachtrag `C1b_C3_KONZEPT_R1.md` (drei Quellen: O1-Feld · R2D-Höhenfeld → 3D · geschlossenes Netz über `mesh-check.ts surfaceDistance` + manifold-Punkttest) | noch nicht gebaut |
| MVP-Insel | R2D + Scholle v7 (`src/island/r2d/`, Lab-eigen, Georg 08.10. „Inselgrundlage“) · StreakByte-Demo-Inseln (`donors/streakbyte-floating-islands`, privat V-071, Texturen/UV) | – |

## Vorschlag

**1. Profil als eigene Eigenschaft des Tunnel-Moduls** (Schnittstelle in `MODULES.md`):
- `{ look: race_tube | stone_arch | stone_rect | mine, profile: 'arch' | 'rect' }`.
- Standard nach TC1: stone_arch und race_tube = `arch`, stone_rect und mine = `rect`.
- Der Ring kommt aus Core v0.12: `tunnelSpec({ shape: profile })` mit derselben Fahrbahn und Hüllkurve, also kein eigener Nachbau.
- Feldschnitt, Kragen, Sockel und Mündungs-Suche nehmen den Ring unverändert; `sdPoly` gilt für jede Kontur.
- Wahl je Tunnel im Strecken-Editor später (Phase E, V-100).

**2. Portal und Innenausbau je Look 1:1 aus `tunnelParts`:**
- An Einfahrt **und** Ausfahrt sitzen sie auf der feldgeformten Stirn bzw. dem Kragen. Ihre Rückseite wird wie die Bänder auf die echte Feldfläche projiziert.
- **Knet-Fuß ohne Spalt:** Die Grundfläche jedes Portalteils geht vor dem levelSet als weiche Vereinigung ins Feld (`smin`, k ≈ 0,4 m), danach wird das Teil per Boolean vereinigt. Gebaut wird also ein Fuß aus dem Körper selbst, kein Kleber.
- Innen: ribs (Steinbögen), bands (Race-Tube), frames (Holzrahmen). stone_rect und mine innen rechteckig, über das Profil.

**3. Prüfkörper A – TC1-Knethügel 1:1 auf einer Geraden** (neue Prüfbank-Seite `?bench=tc1`):
- Gerade Core-v0.12-Strecke wie in der TC1-Seite.
- Der Hügel wird als Feld aus TC1 `moundLift` gebaut (Höhenfunktion → 3D-Feld, Adapter-Weg 2), dann Feld-Tunnel wie oben.
- Alle 4 Looks, je Einfahrt / Innen / Ausfahrt.
- Kameras wie in tc1-looks.v3 (Werte aus der TC1-Seite übernehmen).
- Blatt im selben Raster mit der v3-Referenz daneben.

**4. Prüfkörper B – eine MVP-Insel über den Adapter:**
- Empfehlung: **R2D + Scholle v7 (Lab-eigen)**.
  - Adapter-Weg 2 (Höhenfeld + Umriss + Scholle-Profil → Feld): ein levelSet über den ganzen Körper, keine Naht.
  - Ein Hügel bzw. Fels auf der Insel ist der Wirt. Die Strecke läuft als Gerade auf der Prüfbank hindurch.
  - Look `mine` / Profil `rect`.
- **Alternative StreakByte** (Phase-D-Insel mit Fels):
  - Adapter-Weg 3: Netz → Feld. Neu vernetzt wird nur das Tunnel-Band, mit ebener Naht und übernommenen UV.
  - Beweist den Weg für gekaufte Netze; Risiko UV-Nähte. Bleibt lokal (V-071).

**5. Prüfwerte wie beim Prototyp:**
- Körper geschlossen (offen / mehrfach 0), Q1, Durchsicht, Q3, Q5 nach Art.
- Kosten: Bauzeit, Dreiecke.
- parity.

## Fragen an die Steuerung

1. Prüfkörper B: R2D + Scholle (empfohlen, ohne Naht) oder StreakByte (Netz-Weg mit Band-Naht)?
2. Prüfbank als eigene Seite `?bench=tc1` (gerade Strecke, kein Ring) ok?
3. Knet-Fuß der Portale als weiche Feld-Vereinigung vor dem levelSet: ok?
