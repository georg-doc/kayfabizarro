# MINI_blatt_r1 · Ausdrucksblatt R1 · RETURN (WSB, 16.11.2026, V-1833/V-1835, V-1838)

**Bundle:** `wsb-ausdrucksblatt-r1.bundle`, sha256 `585f964349bba630c4e675d07c633a857c281aca9b0aac7d381e9b50e60f0c2b`
- Zweig `assets/wsb-ausdrucksblatt-r1` @eb113fea, ab `assets/private` @800a85eb.
- 162 neue Dateien unter `50_BLENDER/AUSDRUCK_R1/`, dazu die geänderte `50_BLENDER/FB/data/FB_CANON.json`. WSB pusht nicht.

**Messblatt mit Winkeln je Take und allen Abweichungen:** `50_BLENDER/AUSDRUCK_R1/RETURN_ausdrucksblatt_r1.md`.

**Blätter** (hier und in `50_BLENDER/AUSDRUCK_R1/blaetter/`):
- `AUSDRUCK_R1_blatt_1von4.jpg` bis `_4von4.jpg`: 16 Takes, je Zelle „FB | Farmerin“, Phase E, cartoon, dreiviertel vorn, Knete v1.1;
- `AUSDRUCK_R1_stufen.jpg`: Jubel, Schreck und Wut je fein | cartoon | extrem an FB.

## Kurz
- **Kein Figur-Export je Take** (V-1838). Die Posen kommen als JSON und werden zur Laufzeit in einer Bühnenkopie mit Posen-Haken angewandt (`50_BLENDER/AUSDRUCK_R1/stage/`). Die GLB-Dateien bleiben unverändert.
- **Gesichter:**
  - FB über `fb_gesicht.v1.js` / `ausdruckZielR2` (Brauen-Enden mit Abstand-Regel, Lid-Schräge, Ohren, Blick, Mund);
  - Farmerin über EyeRig v6 + E2 (augenR2 1,15 / 0,45, Lidfarbe #a67e66 nach LID_RULE).
- **Posen für Schritt 3:** `50_BLENDER/AUSDRUCK_R1/posen/*.pose.json`, 40 Stück (FB 17 cartoon + 6 Stufen, Farmerin 17). Darin stehen Eingabe-Winkel, aufgelöste lokale Quaternionen, Gesicht und Boden.
- **Zwei Runden blinder Kritiker.** Dazu Georgs Hinweise aus dem Chat: Triumph (Kopf weg vom Arm, Hand nicht im Bauch) und Mundschatten, beide umgesetzt.
- **FB_CANON.json:**
  - Proof-Durchlass nur für `FB_WEB_KANON.r1j.glb` (1d13f2cd…), mit Georgs Ja im Chat; die Sperre ist unverändert.
  - Achtung beim Nachziehen: Die Datei im Bündel ist mein gültiger Stand. Gegenüber deiner Kopie @800a85eb enthält sie auch die älteren Einträge (Kanon-Hash 91092623… V-804, Proof-Durchlass V-776, Träger V-890), weil deine Kopie noch `sha256: null` hat.

## Wichtigste Abweichungen (Details im Messblatt)
1. **Hut der Farmerin:** auf der Bühne ausgeblendet (WS0 einverstanden).
2. **Kurze Arme:** Kinn, Mund und Hinterkopf sind nicht erreichbar. Lösung: Hand an die Wange über den Oberarm-twist, der Kopf neigt sich zur Hand. Statt Arme verschränken stehen beide mit Händen in den Hüften.
3. **Keine Fingerknochen:** Beim Zeigen bleibt die Hand eine Faust.
4. **Farmerin ohne steuerbare Brauen:** Wut liest sich bei ihr schwächer.
5. **FB, G1:** meldet „keine Augen-Anker“, weil die Augen in der Web-Datei eingebacken sind. Die Bilder laufen deshalb mit `--saveAll`, das Gate ist unverändert.
6. **Bühnenkopie, Ladekorrekturen:** Meshopt-Decoder, Export-Extras `kfbClayOrig` verworfen, Mundbilder ohne Knete und Schatten.
7. **Gesichts-Vorschläge** für die Katalog-Lücken: Jubel, Frust, Angst, Verlegenheit, Nachdenken. Dazu Skepsis mit Mund zu.
