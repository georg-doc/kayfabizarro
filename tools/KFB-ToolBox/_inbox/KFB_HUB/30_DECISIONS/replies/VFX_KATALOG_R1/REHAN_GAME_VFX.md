# rehan/game-vfx · Einordnung für den SOP-Ast VFX (WS0, 24.11.2026)

Quelle: https://patch.gg/rehan/game-vfx, Version 0.1.1. Das Repo (@e444d6f1) wurde in einen leeren Scratch-Ordner geladen und nur gelesen. Bilddateien liegen in Git LFS und sind hier nur als Zeiger vorhanden; ausgeführt wurde nichts.
Lizenz: Code MIT, Art CC0-1.0.

## Was es ist
Drei Dinge in einem Paket:
1. **Ein Skill für Claude Code** (`skills/game-vfx/SKILL.md`, Vorgehen und Handwerk in `reference/CRAFT.md`): Er beschreibt, wie man Spiel-VFX aus KI-Video baut.
2. **Eine Laufzeit für three.js** (`runtime/`). Sie enthält:
   - eine Pipeline mit 5 Pässen: Welt mit Tiefe, Effekte in eigenem HDR-Ziel, Verzerrung, Zusammensetzen, Bloom mit ACES;
   - FxWorld mit Lichtpool aus 12 Punktlichtern, Wackeln, Bildblitz und Ton-Marken;
   - Sprite-Systeme in vier Modi: billboard, stretch, ground, axis;
   - die Bausteine Trail, Bolt, Shockwave, Decal, MagicCircle, IceSpikes, Debris und Haze;
   - 6 fertige Zauber und Patchs Puppe.
3. **Eine Effekt-Sammlung:** 12 Flipbooks mit je 8 × 8 Bildern zu 256 px, mit Seedance 2.5 gemacht, CC0.

Technik: WebGL2, three 0.185.1 (Spender gibt 0.17x–0.18x an), keine eigene Build-Stufe. Python, numpy, Pillow und ffmpeg braucht man nur für neue Flipbooks. Neue Clips kosten Geld (fal.ai, Seedance): etwa 1,90 $ je Element und 2,40–2,80 $ je Muster-Video. Im Katalog R2 ist der Spender mit 26 Einträgen erfasst: 6 Zauber, 12 Flipbooks, 8 Bausteine.

## Was als Regel für unseren SOP-Ast VFX taugt
1. **Zauber als Zeitplan planen:** Laden, Loslassen, Flug, Einschlag, was bleibt. Je Teil festlegen, ob er ein Bild ist (Flipbook) oder Code (Funken, Bänder, Ringe, Licht, Wackeln). Das passt direkt zu unserem Rezept-Format (Kaskaden-Choreografie, `core/rezept.js`).
2. **Jeder Effekt hinterlässt etwas:** eine Brandspur, die abkühlt, Restfeuer, aufsteigender Rauch, Reif, Brocken am Boden. Das passt zum Krater-Mentalmodell und zu „Ursache und Richtung“.
3. **Kontrast statt Helligkeit:** Eine dunkle Scheibe unter einem leuchtenden Bodeneffekt liest sich, Helles auf hellem Boden verschmiert. Druckwellen-Ringe dünn und schwach.
4. **Blitze klein und kurz:** Lichtpunkte unter etwa 1 m und etwa 0,1 s, Vollbild-Blitze winzig. Die Zahlen gelten für ACES und müssen an unseren Tonweg angepasst werden. Der Grundsatz „mäßige HDR-Werte, sonst wird alles weiß“ gilt aber auch bei uns.
5. **Rauch über Farbe, nicht über Licht:** Rauch weiß aufnehmen und im Shader tönen; ein Rauch-Flipbook dient dann für jede Farbe (Zielmaterial, Waffenfarbe).
6. **Brocken dunkel, Glühen kühlt in 1–2 s ab.** Das passt zu „keine gemalten Glanzlichter“.
7. **Einschlags-Sprites 0,5–0,8 m zur Kamera hin versetzen,** damit der Körper sie nicht halbiert. Das ist eine Darstellungs-Technik; der Treffpunkt selbst bleibt auf der Oberfläche („Faust auf der Fläche“).
8. **Ton auf das Bild legen:** Die Spitze des Geräuschs liegt auf dem Bild, in dem der Effekt zündet; die Aufnahme schreibt diese Bilder als Marken mit. Das ist dieselbe Regel wie bei portalTon R3.
9. **Prüfen im Vergleich:** Vorlage und eigene Aufnahme nebeneinander, Kontaktbogen von beiden. Abgeglichen werden Zeitablauf und das, was bleibt, nicht der genaue Look. Das ist zugleich eine Kritik-Methode für eine Runde (eine Kritik je Runde).
10. **Für eigene Flipbooks (Aqua-Weg):**
    - ein Element je Clip, mittig, nie am Rand;
    - Bodeneffekte von oben, Säulen von der Seite;
    - den ganzen Ablauf von Schwarz bis Schwarz beschreiben;
    - Ausbrüche in Zeitlupe;
    - die ersten weißen Bilder eines Ausbruchs überspringen (`from: 3`) und mit `ease` 0,55–0,7 abspielen;
    - Schleifen aus der ruhigen Mitte nehmen und überblenden.
11. **Kosten nennen, bevor Geld ausgegeben wird.** Das passt zu unserer Regel: Bezahltes nur nach Georgs Ja.

## Was nicht taugt (oder nur mit Georg)
- **Die Pipeline mit ACES, Bloom und 12 Punktlichtern:** Sie widerspricht unserem einen Licht-Rig und unserem Tonweg (V-385/386). Im Spiel nur die Pässe vfx und distort über feuerNaht, ohne deren Tonkurve, und den Lichtpool auf unsere Zahl kürzen.
- **„Dämmerung mit viel Fülllicht“ als Szenenregel:** Unser Licht ist Kanon (ein Rig), nicht je Effekt wählbar.
- **Realistische KI-Videobilder als Standard-Look:** KFB will realistischen Hintergrund, Cartoon-Vordergrund und Knete (V-1171). Seedance-Feuer neben Knete-Figuren ist ungeprüft; Kampf-VFX laufen bei uns über Vorbilder und Georgs Wahl, und eigene Formen zeigen wir nicht.
- **2D-Bildfolgen auf 3D-Körpern:** Flipbooks nur für frei stehende Elemente (Explosion, Rauch, Säule, Bodenfläche), nie als Hülle um Figuren. Das ist unsere Regel „VFX: Denkmodell zuerst“.
- **Feuer allgemein:** Unser Feuer-Kanon ist Patch Fire (Volumen); Flipbook-Feuer nur dort, wo Patch Fire nicht hinkommt, also im Aqua-Artefakt und bei Geschossen.
- **Seedance-Clips und Muster-Videos selbst erzeugen:** Das kostet Geld, darum nur nach Georgs Ja. Muster-Video als Referenz ja, aber das passt eher zum Weg über Georgs Vorbilder.
- **Patchs Puppe als Zaubernder:** Bei uns sind Werfer und Ziele unsere Figuren; PointActor reicht dafür.

## Wo der Spender bei uns am meisten bringt
1. **Aqua:** Die 12 CC0-Flipbooks passen direkt in den vorhandenen Flipbook-Weg (wie phantasm_atlas_r1). Feuer-Explosion, große Explosion, Rauch, Plasmakugel und Blitz-Einschlag sind sofort nutzbar.
2. **Effekt-Vitrine:** `examples/minimal` ist schon eine Vitrine mit Boden, Werfer, drei Zielen und je einem Knopf pro Zauber, auf eigener Leinwand.
3. **SOP-Ast VFX:** die Regeln 1–11 oben als Abschnitt „Handwerk“, mit unseren Zahlen statt ACES-Zahlen.
