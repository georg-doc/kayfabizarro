# RKIT · V-138 (b): Bord + Gehweg + Kantensteine an der Hex-B7-Haltebucht (R1)

Stand: 2026-10-11 · Freigabe Steuerung (Weg b) · Eingang: `Lab/docs/handoff/hex_b7_stream_v0.1.json` (kfb.lab.b7-stream/0.1, 141 Proben) · Bauweise: Gehweg/Bord Lauf 03, ohne Bande und ohne Sitzmauer.

## Lieferung (`Lab/public/roadbeds/`)
- **`hex_b7.parts.glb`:** 177 Teile in 9 Knoten, sha256 ad39f3f80f58…
  - Rahmen: Welt (W.world, ohne Versatz bzw. Drehung).
  - **Einheiten: Lab (= Track-Meter × 1,46)**, y oben.

| Knoten | Teile | Inhalt |
|---|---|---|
| `BORD_R` | 25 | niedriger Bord TOWN_BAY: Höhe 0,12, Steine 1,54 × 0,45, Fuge 0,06; beide Enden gebaute Köpfe (Fase 0,22) |
| `KOPF_KNET_R` | 6 | Knetwülste vor den beiden Bordköpfen |
| `PLATTE_R_0..3` | 4 × 25 | Gehwegplatten 1,54 × 1,54 × 0,22, Läuferverband 0,80; die äußere Reihe als Passsteine |
| `KANTE_R_146` | 33 | Kantensteine 0,6 breit, 1,0–1,3 lang, 0,15 tiefer gebettet |
| `KANTE_QUER_R` | 12 | Querreihen an beiden Gehweg-Enden |
| `walk_body` | 1 | Gehweg-Bett von Bordrückseite bis Kantenstein-Lippe, Schürze bis 0,3 unter Kachelhöhe |

- **`hex_b7.parts.json`:** Hash, Knoten, ENV_ROLES-Zuordnung, `startTones`, Q-Werte.
- **`hex_b7.cams.json`:** 6 Kameras (Welt, Lab-Einheiten).
- **Belege:** `Lab/docs/critic/rkit-hexbay/2026-10-11_v138b/` (shots, qcheck.json, Parität).

## Maße und Bauweise
- **Lage:** Bucht rechts (+R), volle Bucht s 102–126 m (148,9–184,0 Lab).
- **Bord:** läuft von s 146,9 bis 185,9 Lab (Lab-Gewicht `kerb` ≥ 0,83, Bordhöhe > 0,10). Er folgt der Rinnen-Endkante `gutterEndLat` des Lab-Querschnitts und schwingt damit in den Übergängen mit aus.
- **Gehweg:** Er hat über die ganze Bordlänge die **volle Breite** (Bord 0,3 + Gehweg 6,4 nach TOWN_BAY) und endet an beiden Bordköpfen mit einer Querreihe.
  - Die verjüngte Kante des bisherigen Lab-Querschnitts (`walkEndLat` im Übergang) habe ich bewusst nicht übernommen; nach der Bauregel „kürzen statt biegen“ werden Platten nicht keilförmig.
  - Die orange Plattform entfällt laut Lab ohnehin.
- **Höhen:** Gehweg = Bordhöhe 0,12 Lab über der Fahrbahn. Die Kachel-Oberkante liegt 0,6 m (0,88 Lab) unter der Fahrbahn, also rund 1,0 Lab unter dem Gehweg.
- **`walk_body`:** Ersetzt die Lab-Plattform als Träger der Platten. Das Bett reicht bis 0,3 unter die Kacheln, damit der Knet-Übergang des Labs nirgends ins Leere läuft.

## Was das Lab macht (unverändert gegenüber der Absprache)
- Fahrbahnstreifen mit **Bordtasche in Fahrbahnmaterial**: Der Bordfuß sitzt bis −0,12 − 0,06 Lab im Asphalt.
- **Knet-Übergang** von der Kantenstein-Bettkante (Außenkante = Gehweg-Außenkante + 0,06; Oberkante Gehweg − 0,15) auf die Kacheln, dazu die Kachel-Stufen.
- **J17-Bandenkopf** an Anfang und Ende der Bucht.

## Q1–Q9: alle PASS
- Gemessen in Blender mit nachgebildeten Lab-Teilen:
  - Fahrbahn mit Bordtasche (nicht geliefert);
  - Kacheln auf Kachelhöhe mit 1,5 Lab Knet-Böschung von der Bettkante.
- 179 Teile gemessen, 177 geliefert.
- **Geändert in dev02:**
  - volle Gehwegbreite statt verjüngter Lab-Kante; sonst Q2-Loch und Q3-Grenzfall an den Bordenden;
  - Q6-Profile auf die echte Höhe gesetzt; die Bucht liegt auf etwa 175 Lab, das Messprofil startete bei 20.

## Lab-Parität (Pflicht vor Lieferung)
- **Lauf 1: FAIL**, nur Prüfung 4 (ruhige Kamera): Zittern p95 0,0554 (game) und 0,0509 (hub), Grenze 0,05.
- **Lauf 2 direkt danach: PASS** (0,0497 und 0,046), alle übrigen Prüfungen in beiden Läufen grün.
- **Einordnung:** Die Prüfung liegt knapp an der Grenze und schwankt zwischen den Läufen, auch im game-Einstieg ohne RKIT-Teile. `hex_b7` lädt das Lab noch nicht. Die Lieferung beeinflusst das Ergebnis nicht. Beide Protokolle liegen im Belege-Ordner.
- **Hinweis an die MVP-Sitzung:** Prüfung 4 ist grenzwertig.

## Einbinden (MVP-Sitzung)
- Das GLB liegt im Welt-Rahmen in Lab-Einheiten. Im Organ-World-Rahmen, der in Track-Metern rechnet (`W.world` × 1,46), also mit Maßstab 1 in Lab bzw. in die skalierte Gruppe mit 1/1,46 einhängen.
- Die Farben folgen den Rollen (`roles`, `startTones` in parts.json).
