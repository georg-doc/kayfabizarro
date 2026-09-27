# ToolBox Production-03 · geprüfter Intake

Status: **TECHNICAL INTAKE PASS · PROCEED PASS · OWNER ADOPTION NEXT**
Owner: `tools/KFB-ToolBox`
Candidate: `tools/KFB-ToolBox/_inbox/KFB ToolBox Production-03/KFB_TOOLBOX_CLAUDE_DESIGN_SESSION_CUT_2026-09-27_r2/`

## Was jetzt wirklich vorhanden ist

Production-03 bündelt die bisher getrennten Arbeitsflächen in einer Oberfläche:

- **Studio:** Körper, Gesicht, Pose, Fit und Szene;
- **Animation Studio:** Clips, 24 Spielzustände, Bewegung, Ohren und Band;
- **Rigging:** Augen, Brauen, Nase, Mund, Schnurrbart, Haare, Ohren und Körper;
- echte KayKit-/KFB-Animationsquellen, Motion-Profile, Sheet/Strip/Trail und Import/Export.

Der eingetroffene Export wurde nicht nur inventarisiert:

- `zipcheck.py`: PASS;
- frischer HTTP-Kaltstart: PASS;
- Browser-Selbsttest: **33/33 PASS**;
- Browser-Konsole nach Boot und Selbsttest: **0 Errors · 0 Warnings**.

Zwei kleine Exportfehler wurden im Candidate eng repariert: ein grenzwertabhängiger Testschritt und ein Boot-Render vor Initialisierung des Animationszustands. Es wurde kein Runtime-Owner ersetzt.

## Nächster produktiver Slice · P03-ADOPT-01

Ziel ist **nicht** eine weitere ToolBox-Variante. Der korrigierte Candidate wird in den bestehenden ToolBox-Owner übernommen.

1. Candidate byte-genau aus diesem Intake übernehmen.
2. Die drei lokalen Deltas einzeln gegen ihre Besitzer prüfen:
   - `kfb-lib/face-mount.v1.js` → Mund-Wrap;
   - `kfb-lib/anim-map.v1.js` → 24 Zustände;
   - `kfb-lib/pose-rig.v1.js` → Handgelenk-Ketten.
3. Nur belegte Deltas in die kanonischen Owner-Pfade übernehmen; keine zweite Face-, Pose-, Animations- oder Registry-Logik.
4. Dieselbe 33/33-Sequenz auf dem adoptierten Stand ausführen.
5. Erst dann eine feste direkte ToolBox-Stage bereitstellen und im Hub als aktuelle Arbeitsoberfläche verlinken.

## Danach · BODY-02

Erst auf dem adoptierten Stand folgen Material-, Farb-, Licht- und Character-Surface-Regler. Clay/Knet-Look, Animationen und Actor-Profile sollen damit in derselben Produktionsoberfläche getestet werden; keine neue Spezial-App dafür.

## Nicht Teil dieses Gates

- kein UI-Neubau;
- keine zweite ToolBox-Homepage;
- keine Cloudflare-Live-Behauptung;
- keine Spiel-/Combat-/Travel-Runtime übernehmen;
- keine neuen Features vor abgeschlossener Owner-Adoption.

## Leseweg

1. Candidate `RETURN.md`
2. Candidate `TEST_REPORT.md`
3. Candidate `SOURCE.json`
4. Candidate `HANDOVER.md`
5. dieses Dokument

Einziger nächster Gate: **P03-ADOPT-01**.
