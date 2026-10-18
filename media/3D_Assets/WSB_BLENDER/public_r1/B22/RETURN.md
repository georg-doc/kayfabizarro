# B22 r3 · Bodenkontakt für die Abnahme-Bühne (27. Nachtrag WS0) · 2026-10-18
- `KFB_Billboard_Lamps.r3.glb` (`75f74e7e7f39…`) und `KFB_BillboardLamp_arm.r3.glb` (`c302d8290d91…`) = r2, um 0,06 u (3,7 cm) angehoben. Die Füße stehen jetzt auf y = 0.
- r2 liegt in `_superseded/`. Das Skript `scripts/b22_billboard.py` hebt die Wand jetzt selbst an.
- **Abnahme-Bühne:** **PASS** (G2, G3 = 0,00 cm, G5; G4 nur Warnung: kleine lose Teile wie Arm-Platten und Kenney-Pfosten).
  - Kontaktbogen und Manifest: `renders/proof_stage/`.

---

# B22 r2 · Klassische Plakatwand in Cartoon-Logik (24. Nachtrag WS0, V-430) · WSB · 2026-10-17
**Status: r2 FERTIG als Proof.** WS0 prüft vor Georg.

## Aufbau
- **Plakatwand:** Kenney Racing Kit `billboardLow`, ein fertiges Asset, kein Eigenbau. Mit Knete-Durchgang, auf 6 × 3 u Tafel gebracht; die Figur ist 2,2 u hoch.
- **Karte:** eigene Fläche auf der Tafel, **selbstleuchtend** (LIGHT_MODEL_R2). Im Proof ein Platzhalter in den sechs Story-Farben.
- **3 Lampen an langen Armen:**
  - Der Arm geht von der Tafel-Oberkante 1,25 u nach vorn und leicht nach oben.
  - Am Armende sitzt das **Flutlicht-Gehäuse** (Poly Haven, CC0); der Kopf ist schräg nach unten auf die Tafel gerichtet.
  - Anker `KFB_Mount_board` und `KFB_LightOrigin`.
- **Lichtkeil:** je Lampe ein weicher Cartoon-Kegel (`KFB_Glow_wedge_*`). Leuchtend, Alpha läuft von der Lampe zur Tafel aus, doppelseitig.
- **Lichtteppich:** ein gleichmäßiger warmer Schein über die **ganze Tafel** (`KFB_Glow_pool`): Plateau mit weichen Rändern, **kein Hotspot**. Echte Spot-Lichter mit Hotspot gibt es nicht.
- Die Glüh-Teile tragen `extras.noClay`, damit sie nicht in den Knete-Shader laufen.
- **B7-Fassung:** dieselbe Logik mit 2 Lampen über dem Bildschirm, Lampen jetzt deutlich größer (Kopf ≈ 27 % der Bildbreite).

## Dateien (öffentlich möglich: Kenney CC0, Poly Haven CC0, eigen; Quellen `_quellen/LIZENZEN.md`)
- `KFB_Billboard_Lamps.r2.glb` (`5b4351fd0690…`): Wand, Karte, 3 Lampen, Keile, Teppich.
- `KFB_BillboardLamp_arm.r2.glb` (`b2ba8068a35c…`): eine Lampe mit Arm und Keil, zum Anschrauben an beliebige Tafeln.
- **Skript:** `scripts/b22_billboard.py`. Proof-Seite: `scripts/b22_proof.html` (neu: `?dusk=1`, `?scl=`). Messwerte: `data/b22_r2.json`.
- **Lizenz Kenney Racing:** Kenney (kenney.nl), CC0. Die Lizenzdatei fehlt lokal; CC0 hat WS0 am 17.10. bestätigt.

## Bilder
- **Privat** (`_privat_kauf_asset/renders/`; Anzug-Figur bzw. Meshy-Bühne im Bild):
  - flache Plakatwand mit Figur: `B22r2_plakatwand_front|dreiviertel_tag|daemmerung.png`;
  - B7: `B22r2_b7_front_front|dreiviertel_tag|daemmerung.png`;
  - Größenvergleich (Lampen in Plakatwand-Größe neben der Figur): `B22r2_groesse_front.png`.
- **Öffentlich** (`renders/`): Nahaufnahmen, Lampe füllt das Bild, je vorn, ¾ und Seite:
  - `B22r2_nah_flood|spot|lantern_…`;
  - `B22r2_nah_armlampe_…`.

## Offen
- Die Stärke von Keil und Teppich (Alpha 0,42 bzw. 0,30) ist ein Startwert. Im Spiel regelt WS1 das mit dem Lichtmodell. In der Dämmerung wirken sie stärker, am Tag dezenter.

---

# RETURN · B22 · Billboard-Lampen aus Asset-Paketen r1 (23. Nachtrag WS0, V-429) · WSB · 2026-10-17

**Status: r1 FERTIG als Proof.** Es gibt keinen Eigenbau: Alle drei Lampen sind fertige Pakete-Assets mit Knete-Durchgang. WS0 prüft vor Georg.

## Suche
- **Lokale Pakete:**
  - KayKit City Builder, Mixed Bag, Halloween, RPG Tools, Dungeon (alle FREE);
  - Kenney City Roads, Racing, Holiday, Graveyard, Fantasy Town;
  - Quaternius, Tiny Treats Park.
  - Gefunden: Straßenlaternen, Fackeln, Laternen, ein Bau-Strahler. Einen echten Bühnen-Scheinwerfer gibt es lokal nicht.
- **3D-Asset-Suche** (10 Begriffe, auch Sketchfab/Fab, Rohdaten `data/b22_lamp_search_raw.json`): 185 Treffer, 24 davon CC0 und lampenartig.
  - Am besten passt das Poly-Haven-Flutlicht am Wandarm. Die BlenderKit-Strahler sind „Royalty Free“ und brauchen eine Anmeldung, also nicht genommen.
- Eine KayKit-Mystery-Lampe (`Lamp_Workbench`, Serie 5) gäbe es, ist aber nicht _FREE, also privat. Nicht genommen.

## Kandidaten (alle **CC0 → öffentlich möglich**; Quellen in `_quellen/LIZENZEN.md`)
| Datei | Was | Quelle / Lizenz | Befestigung | Licht |
|---|---|---|---|---|
| `KFB_Lamp_spot.r1.glb` (`2aa11d8017e4…`) | kleiner Strahler auf Fuß | Kenney City Kit Roads (www.kenney.nl), CC0 1.0 | `KFB_Mount_base` (Fuß) | Kegel 40°, Leuchtfläche seitlich am Kopf |
| `KFB_Lamp_flood.r1.glb` (`9b0c2af1afed…`) | Flutlicht am Wandarm, Glas nach unten | Poly Haven „Security Light“ (Maximilian Schuster), CC0 1.0 | `KFB_Mount_wall` (Wandplatte) | Kegel 70°, nach unten |
| `KFB_Lamp_lantern.r1.glb` (`226e12f6c3a7…`) | Cartoon-Laterne am Wandarm | Kenney Holiday Kit 2.0 (www.kenney.nl), CC0 1.0 | `KFB_Mount_wall` | 120°, leicht nach vorn unten (Stimmungslicht) |

- **Knete-Durchgang:**
  - Farben der Textur je Ecke in Vertex-Farben übernommen;
  - Leuchtfläche als eigenes warmes Leuchtmaterial (`#ffd98a`);
  - Bevel und 1× Subsurf für runde Kanten (beim Flutlicht nur Bevel, es ist schon fein genug).
  - Größe: längste Kante = 1,0 u. Die Bühne skaliert.
- **Anker:**
  - `KFB_Mount_*`: Befestigungspunkt, glTF +Z zeigt weg von der Fläche.
  - `KFB_LightOrigin`: Mitte der Leuchtfläche, glTF +Z = Kegelrichtung, `extras.kfb.coneDeg`.
- **Skript:** `scripts/b22_lamps.py`. Proof-Seite: `scripts/b22_proof.html` (`?spots=` setzt je `KFB_LightOrigin` einen Spot). Messwerte: `data/b22_lamps.json`.

## Bilder (`_privat_kauf_asset/renders/`, privat, weil die B7-Meshy-Bühne zu sehen ist)
- Je Kandidat 2 Lampen über dem Bildschirmrahmen des Dschungel-Computers. Strahler und Flutlicht sind auf die Bildmitte gerichtet, mit Spot im Proof.
- `B22_billboard_spot|flood|lantern_front.png`, `…_front_dreiviertel.png`.

## Empfehlung
- **Flutlicht (flood)** als Billboard-Lampe: Es liest sich sofort als Bühnenlicht, hat einen klaren Kegel aufs Bild und einen Wandarm für die Rahmenoberkante.
- Die **Laterne** als Stimmungsvariante für Dorf- oder Dschungelbühnen.
- Der **Strahler** ist klein; er taugt als Bodenstrahler vor der Bühne.

## Offen
- Die alten Eigenbau-Lampen der Bühne habe ich nicht angefasst. Austauschen tut WS1 im Spiel über die Anker.
