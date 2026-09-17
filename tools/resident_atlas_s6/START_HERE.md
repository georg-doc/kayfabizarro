# KFB Resident Atlas S6 · Export 2026-09-17

**Status: `PORTABLE_EXPORT_COMPLETE`, online-portabel.** Code, Daten und alle verlangten Dokumente sind enthalten. Die 3D-Assets werden **nach Entscheidung** nicht mitkopiert, sondern über gepinnte Raw-URLs aus der zentralen Quelle `georg-doc/kayfabizarro/media/3D_Assets/` geladen — das ist die Single Source of Truth, kein Fehlteil. Das Paket braucht Netzzugriff; Offline-Fähigkeit wird nicht behauptet. Zwei Punkte bleiben offen, siehe `EXPORT_MANIFEST.json` → `remainingGaps`.

## Sofort starten

Aus dem entpackten Verzeichnis, über HTTP (nicht per `file://` — ES-Module und die Import-Map brechen sonst):

```sh
python3 -m http.server 8080
# dann: http://localhost:8080/KFB_Resident_Atlas_S6.html
```

Erwartung beim ersten Laden: Auswahlliste mit 21 Residents plus Ensemble, Status „5 Objekte geladen · alle Pfade auflösbar" für den Default-Resident (Goth Girl). Netzzugriff auf `raw.githubusercontent.com` und `unpkg.com` ist erforderlich.

## Was ist das

Ein Viewer für 21 Bewohner-Vignetten aus KayKit-Packs. Jede Vignette ist ein datengetriebenes Rezept in `data/cast.js`: exakter Aktor, Habitat-Basis, Landmarke und bis zu sechs Signatur-Requisiten, mit gemessenen Transforms, Pose-Bindung und dokumentierten offenen Punkten. Alle Ausgaben sind `candidate-only`.

## Reihenfolge zum Lesen

1. `docs/RECOVERY.md` — Startpunkt für einen neuen Chat oder Entwickler.
2. `docs/ATLAS_RETURN.md` — Entscheidungen, Befunde, OPEN-Liste 1–30.
3. Kopf von `data/cast.js` — die Strukturregel für Hand-Requisiten (Identität zuerst).
4. `docs/ATLAS_NEXT_SLICES.md` — die nächsten Scheiben mit Briefing.
5. `CHANGELOG.md` ist 32 Sprints lang und nur bei konkreter Rückfrage nötig.

## Was dieses Paket NICHT behauptet

- Kein GitHub-Push: `GITHUB PUSH: NOT PERFORMED`.
- Kein Deployment: `PUBLIC DEPLOYMENT: NOT PERFORMED`.
- Keine Travel-Abnahme, keine L5-Reife, keine Animations-Retarget-Freigabe.
- Keine Lizenzprüfung der KayKit-Packs. Aus Besitz folgt keine Freigabe zur Rohdatenverteilung.
- Keine Offline-Fähigkeit. Das ist gewollt: alle Assets via GitHub, gepinnt.