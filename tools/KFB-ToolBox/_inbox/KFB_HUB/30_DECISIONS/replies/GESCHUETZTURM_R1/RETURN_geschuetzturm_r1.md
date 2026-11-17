# Geschützturm R1 · Crimson · RETURN (WSB, 17.11.2026)

**Auftrag:** Georg (Chat) und WS0 (38)/(39), V-1892/V-1902:
- Drehbares Turm-Modul (360°) fürs Dach der Dieselpunk-Fahrzeuge, ohne Fahrer und ohne FB.
- Darauf die Kenney-Blaster: Eine runde Basis fasst Griff bzw. Magazin ein, Effekte über `KFB_Muzzle` wie bei den Handwaffen.
- Look wie aus einem Guss mit dem Fahrzeug (weder Knete noch Bonbon-Plastik), ins Dach eingesenkt wie aufgeschraubt.
- Crimson zuerst. Vergleich mit Georgs `quaternius_turret_teleporter.glb`.

**Gültig ist der Stand r1b**, also nach dem blinden Kritiker überarbeitet (siehe 6). Der Stand r1 steht auf der Löschliste.

## 1 · Dateien
- **`glb_r1b/KFB_Geschuetzturm.r1b.glb`** (542 KB): Turm ohne Waffe, Ursprung = Sitzpunkt.
- **`glb_r1b/KFB_Geschuetzturm_blaster_a.r1b.glb`** (590 KB): derselbe Turm mit Blaster a im Sitz, zur Vorschau.
- **`glb_r1b/kenney_diesel_r1b/`:** alle 18 Kenney-Blaster im Dieselpunk-Look (`KFB_Kenney_blaster_<a–r>.diesel.r1b.glb`).
  - Geometrie, UV, `KFB_Grip` und `KFB_Muzzle` sind byte-gleich zu den Karten r1b.
  - Neu sind nur die Palette (Lackrot, Gussgrau, gealtertes Messing, Stahl, Oliv, Patina, Rost) und eine Metall/Rauheit-Palette.
  - Quittung: `kenney_diesel_r1b.json`.
- **`data/r1b/geschuetzturm_r1b.json`:** Datenblatt mit Maßen, Knoten, Fahrzeug-Sitz, Einfahr-Pose und dem Folgenden je Waffe:
  - Sitzhöhe;
  - Mündung vor/über der Höhenachse;
  - freier Höhenbereich;
  - Grenze am Crimson-Dach;
  - Empfehlung.
- **`data/r1b/hoehenbereich_messung_r1b.txt`:** Rohdaten der Kollisionsprüfung.
- **Skripte:**
  - `scripts/turm_r1.py` (Bau, Posen, Höhen-Prüfung, Export) und `scripts/turm_material_r1.py` (Look);
  - `scripts/kenney_diesel_r1.mjs` (Waffen-Palette) und `scripts/paket_r1.mjs` (WebP, Datenblatt);
  - `scripts/_wsb-turm-r1.mjs` (Kampfbühne) und `scripts/sichtung_r1.py`.

## 2 · Aufbau (nur Kit-Teile, CC0, kein Eigenbau)
- **Sitzring:** Georgs Quaternius-Teil, umgefärbt, als ovale Grundplatte (1,10 × 0,84 m).
  - Er ragt 4 cm aus dem Dach, der Rest steckt im Dach.
  - Er dreht nicht mit.
- **Flansch mit Schraubenkranz:** KayKit Platformer `cannon_base` (Rohr entfernt).
- **Gabel:** dessen `cannon_turret`, in der Höhe × 0,75 (gedrungen).
- **Achse:** `strut_horizontal`.
- **Zwei verschraubte Wangen:** `bracing_medium`.
- **Sattelboden:** `lever_floor_base` ohne Hebel.
  - Griff und Magazin der Waffe stecken zwischen den Wangen auf dem Sattelboden.
  - Je Waffe ist der Sitz so hoch, dass ihr tiefster Punkt auf dem Boden aufliegt.
- **Maßstab:** Kit-Teile × 0,40 m je Einheit (Flansch Ø 0,80 m), Waffen × 1,4 der Karten r1b.
  - Höhenachse 0,80 m über dem Sitz; Turm samt Blaster a etwa 1,39 m hoch.

| Knoten | Bedeutung |
|---|---|
| `KFB_Geschuetzturm` / `KFB_TurmSitz` | Wurzel = Sitzpunkt (Unterkante Flansch) |
| `KFB_FederAnker` | 2 cm unter dem Flansch |
| `KFB_Turret_Einfahr` | Einfahr-Pivot; Absenkung je Fahrzeug, bei Crimson 0 (keine Luke) |
| `KFB_Turret_Yaw` | Gier um +Y, 360° frei |
| `KFB_Turret_Pitch` | Höhe: Drehung um −X hebt die Mündung (three: `rotation.x = −höhe`) |
| `KFB_Turret_Seat` | Hier sitzt der `KFB_Grip` der Waffe; Waffe 180° um Y; Höhe je Waffe aus den Daten |
| `KFB_Grip` / `KFB_Muzzle` | unverändert aus den Kenney-Karten |

- **Crimson:** `sitz_modell [0, 2,79, −0,6]` im Modellmaß, `senke_m −0,03`.
  - Einbau in three: Turm in `modelObj`, Position = `sitz_modell − (0, senke_m / modellSkala, 0)`, Maßstab = `1 / modellSkala`.
  - Der Sitz liegt 0,1 Modelleinheiten hinter der Dachmitte, weil das Dach vorn zur Scheibe abfällt.
- **Eingefahren:** Gier 0, Höhe auf dem unteren Empfehlungswert, Einfahr-Pivot um `einfahr_m`.

## 3 · Look
- **Turm:**
  - Teile auf Crimsons Töne umgefärbt: Lack #8c2b27 an Gabel und Sattel, Gussgrau an Flansch und Wangen, gealtertes Messing an den Schrauben, Stahl an der Achse.
  - Verschleiß gebacken (Cycles, B31-Kette): Kupfer- und Grundierungskanten wie an Crimson, tiefe Abplatzer, Rostflecken, Schmutz in Ritzen.
  - Gemessener Lack-Median (130, 42, 38) zu Crimson (140, 43, 39).
  - Farbe plus Metall/Rauheit-Karte, als WebP wie bei Crimson.
- **Im Spiel:** Turm-Materialien erfüllen die Bedingung für `prepVehicleLook` (map + metallicRoughness).
  - Einbau mit `prepVehicleLook(turm)`, `hookVehicleLook(turm)` und envMap wie beim Wagen; im Test angewendet (applied 2, envMap ja).
- **Effekte:** kein Effekt gebaut. Schuss, Treffer und VFX laufen über den unveränderten `KFB_Muzzle` aus dem gemeinsamen Kampfsystem (Code, WSA Racer).

## 4 · Prüfung
- **Höhenbereich je Waffe** (Kollision Waffe/Sattel/Wangen gegen Gabel/Flansch, dazu Crimson-Dach über 24 Gierwinkel):
  - Alle 18 sind frei von mindestens −32,5° bis mindestens +55°. e endet bei +55°, d bei +62,5°, f bei +65°, i und n bei +82,5°, der Rest bei +90°.
  - Das Crimson-Dach begrenzt bei keiner Waffe.
  - Empfehlung für das Spiel: −15° bis +45° (in den Daten je Waffe).
- **Kampfbühne** (`buehne=r1`, Crimson auf dem Start, Turm am nativen Fahrzeugmodell; `belege_r1b/kampfbuehne/`, `bericht.json`):
  - Sitzring-Unterkante rundum 1,9 bis 5,0 cm im Dach, nirgends Luft (24 Randpunkte).
  - Posen Gier 0/45/90/180/270°, Höhe −12° bis +60°.
  - Fahrt bis Tempo 28 mit schwenkendem Turm; der Turm bleibt am Modell.
- **Proof-Stage v1.2.7:** ABNAHMEFÄHIG (G2, G3, G5, G6 PASS; G4 WARN wegen offener Kit-Ränder).
  - G3 lief über eine Proof-Kopie mit um 7,5 cm angehobener Wurzel. Der Sitzring reicht planmäßig unter den Sitzpunkt ins Dach.
  - Die gelieferte Datei behält den Sitzpunkt als Ursprung.
- **Bilder:**
  - `belege_r1b/GESCHUETZTURM_R1B_vorschau.jpg`, `_posen.jpg`, `_waffen.jpg` (8 Blaster), `_kampfbuehne.jpg`;
  - `_vergleich_quaternius.jpg`;
  - `KFB_Geschuetzturm_blaster_a.r1b_proof_contact_sheet.png`.

## 5 · Vergleich mit Georgs Quaternius-Teil
Der Turret Teleporter ist eine flache Platte ohne Gier- und Höhenmechanik. Ich nutze ihn als eingelassenen Sitzring, der die Gabel trägt. Der Ring macht das „aufgeschraubt“ deutlich sichtbar.

## 6 · Blinder Kritiker (ein Lauf, nur Bilder, Stand r1) und Nacharbeit
**Urteil: PASS mit Hinweisen (grenzwertig).**
- **Der Kritiker:** Die Mechanik liest sich klar. Er bemängelte aber:
  - zu wenig Verschleiß, sauberes gesättigtes Rot;
  - gelbe Blaster wirken bonbonartig;
  - der Turm ist zu hoch, der dünne Stiel wirkt wie ein Periskop;
  - kein sichtbares Einlassen ins Dach;
  - abgeschnittene Bildausschnitte.
- **In r1b nachgezogen:**
  - Gabel × 0,75 und Maßstab 0,40/1,4: Der Turm ist etwa 20 % niedriger, die Höhenachse sinkt von 1,13 auf 0,80 m.
  - Georgs Ring als Sitzring, eingelassen.
  - Verschleiß kräftiger (Kupferkanten, Rost); Messing gealtert und dunkler.
  - Bildausschnitte neu.
- **Nicht geändert:**
  - Die Kenney-Blaster bleiben kantig. Das ist ihr Stil und so gewählt.
  - Waffen mit langem Griff sitzen höher als solche mit kurzem, weil der Griff auf dem Sattelboden steht. Ein gemeinsamer Griffpunkt hieße, Griffe durch den Boden zu stecken.

## 7 · Für WS0 / WSA Racer
- Wunsch-Einträge für `BUEHNE_KAMERAS`: Der Turm liegt sonst unter dem Hinweis-Banner; im Test standen sie lokal.
  ```js
  wagen_turm: { blick: 'mitte', ab: 12, hoch: 2.4, zielHoch: 2.0, winkel: 0, fov: 40 },
  wagen_turm_dreiviertel: { blick: 'z', ab: 7, hoch: 2.6, zielHoch: 1.6, winkel: 50, fov: 45 },
  ```
- Einbau auf weitere Fahrzeuge: je Wagen `sitz_modell`, `senke_m`, `einfahr_m` und Ring-Halbachsen messen; das Mess-Skript liegt bei.
- **Auf Zuruf:**
  - Weitere Fahrzeuge.
  - Einfahr-Luke.
  - Variante mit einfarbigen statt gemischten Waffenpaletten.

## Löschliste
Der Stand r1 (`glb/`, `belege/`, `data/geschuetzturm_r1.json` usw.), die Probeläufe und die Test-Zwischenkopien stehen in `BLINDE_KRITIK_R1/LOESCHLISTE.md` und warten auf Georgs Ja.
