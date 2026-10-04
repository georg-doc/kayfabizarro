# HANDOVER · WSA · KFB ToolBox Production-02 · Session Cut 2026-09-27 r1

## 1 · Was vorliegt
Dieselbe Laufzeit wie r2 mit den drei Reitern **Studio · Animation Studio · Rigging**. Geändert haben sich nur zwei Dateien: `KFB ToolBox Production-02.dc.html` und `kfb-lib/face-mount.v1.js`. Die übrigen kfb-lib-Module sind byte-gleich zu r2.

## 2 · Änderungen
- **Mund auf der Haut** (face-mount.v1): Der gemalte Mund hing an einer unsichtbaren Helferform, die 0,05 hinter der Kopffläche lag, deshalb hat der Kopf ihn verdeckt. Jetzt sitzen alle 52 Ecken auf `CharacterTemplate_Head` (skin-proxy).
- **Schatten**: Nase, Mund, Brauen und Bart werfen nicht mehr (Regel aus docs/LESSONS_SHADOWS.md). Es werfen nur noch die Augen.
- **Labels**: Die Quelle je Teil heißt Painted rig (13 gemalte Formen), Model mesh (Mund aus dem Modell) oder Off. Augen, Brauen und Nase zeigen ebenfalls »Model mesh«.
- **Selbsttest**: neuer Schritt 21b (Talk auf der echten Haut, keine Nasenschliere).

## 3 · Georgs Befund 27.09. (nicht behoben, Anlass für RECOVERY-01)
Beleg: `evidence/georg-2026-09-27-0441-v18-face-visemes.png` (FrankenStein Studio v18, Reiter Face).
- **Die Viseme fehlen im Studio.** Es gibt dort keinen Mund-Reiter. v18 hatte in Face: Visemes (5 shapes) mit Show viseme, Zuordnung Form je Visem (13 Decals), Review (5 durchspielen, Default look) und Asymmetry (Δ linkes Auge). In Production-02 steht das nur im Rigging › Mouth, im Studio › Face bleiben 5 Knöpfe plus Talk und Sets.
- **Zu viele Metatexte und Messwerte** in den Panels. Das wirkt unübersichtlich.
- **Die untere Palette überdeckt die Bühne.** Animationen sind schlechter zu sehen als in FrankenStein bzw. im »Patch-Studio« (VOICE_INPUT_UNCERTAIN, gemeint ist wahrscheinlich Pet Studio).
- Der neue Stil gefällt, funktional ist er aber noch nicht.

## 4 · Offene Befunde, bekannt
- Selbsttest 27 (Clay-Lider, PR #159) FAIL: 2 Augen, 6768+6768 Dreiecke, geschlossenes Volumen, die Schalen sind während »on« aus. Welche Bedingung scheitert, ist nicht geklärt.
- Mund-Regler aktualisieren beim Ziehen nur etwa alle 120 ms, weil ein Durchlauf rund 60 ms rechnet.
- Aus r2 übernommen: gepinnte IK-Ziele nach einer Längenänderung neu pinnen · Ohr-Ruhewinkel halten nur, solange kein Clip die Ohrknochen keyt · Glide-Lider bauen bei jeder Lid-Änderung neu · Schatten auf großen Bühnen weicher (r ≤ 14).
- Animation Lab v1 liegt weiter weder auf main noch im Projekt (SOURCE_REQUIRED).

## 5 · Push
Der Schreibweg aus Claude Design antwortet 403. Diesen Ordner lokal ins Repo kopieren: `kfb-lib/*` nach `tools/KFB-ToolBox/kfb-lib/`, die DC nach `tools/KFB-ToolBox/production/`, `docs/*` nach `tools/KFB-ToolBox/docs/`. Die Prüfsummen stehen in `CHECKSUMS.sha256`.

## Next Gate
**RECOVERY-01 · Vollinventar aller Funktionen und Einstellungen aus allen Vorgänger-Werkzeugen gegen Production-02, mit Lückenliste und Nachzieh-Reihenfolge. Vor jedem weiteren Ausbau.**
