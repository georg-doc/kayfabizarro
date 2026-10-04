# MANIFEST · Session-Export S38 · Rig-Werkstatt

Erzeugt 2026-09-20 aus dem Projekt *KayKit Resident Atlas*. **Kein Gesamt-Projekt-Zip** — nur was
in dieser Session gebaut oder geändert wurde, plus die zwei Laufzeit-Abhängigkeiten, ohne die die
Seite nicht startet. Gesamtgröße rund 400 KB, größte Datei 177 KB, keine Binärdateien, keine
Screenshots.

## (a) Deliverables

| Datei | Größe | Status |
|---|---|---|
| `KFB_Resident_Atlas_S7.html` | 62 KB | **neu** — Rig-Werkstatt |
| `lib/edit-layer.js` | 10 KB | **neu** — Editor-Schicht (zweiter Einbau des S21-Blocks) |
| `lib/rigwork.js` | 12 KB | **neu** — Gliederpuppe, IK, Boden-Haftung |
| `lib/studio.js` | 11 KB | **geändert, additiv** — `noGizmo`, `recordBone`/`recordNode`, `check`/`bundle`/`merge` |
| `lib/atlas.js` | 96 KB | unverändert · **Laufzeit-Abhängigkeit** (Viewer, Rezept-Bau, `reachChain`, `skinnedWorld`) |
| `data/cast.js` | 177 KB | unverändert · **Laufzeit-Abhängigkeit** (Rezept-Quelle aller Residents) |

## (b) Werkzeug und Daten

| Datei | Zweck |
|---|---|
| `tools/eye-lid-color-probe.html` | **neu** — misst die Gesichtsfarbe der vier Rig_Large-Köpfe am Modell gegen den Batch-Wert `#b58f83` |
| `abnahme/goth-girl.atlas-recipe.json` | Georgs Testexport, Abnahmebeleg für Rasterdrehung und Absetzen |

## (c) Docs

| Datei | Inhalt |
|---|---|
| `CHANGELOG_S38.md` | additiver Auszug der Scheibe S38 |
| `docs/RIG_WERKSTATT_S7.md` | Aufbau, Messwerte, vier eigene Fehler, Abnahme am Testexport, Slice-Planung |
| `docs/EYE_RIG_BATCH_REVIEW_S38.md` | Prüfung des Eye-Rig-Batches gegen seine eigenen Daten |
| `HOUSEKEEPING.md` | Status je Artefakt, Clean-Run-Checkliste, Aufräum-Kandidaten |

## (d) Abnahme-Captures

**Keine.** Die Abnahme steht als Zahl in `docs/RIG_WERKSTATT_S7.md` und als Datei in
`abnahme/goth-girl.atlas-recipe.json`. Ein Screenshot hätte hier nichts belegt, was die Zahlen
nicht belegen.

## Ausdrücklich NICHT im Export

- Das ganze Projekt (`_inbox/`, `screenshots/`, `ref/`, `media/`, `registry/`, `scenes/`,
  frühere Scheiben S1–S6, Quaternius-Faden).
- `github.md` (84 KB Sync-Historie des Projekts) — die S38-Bullets stehen im Changelog-Auszug.
- Jede Binärdatei. Geometrie und Texturen lädt die Seite zur Laufzeit von
  `raw.githubusercontent.com` an gepinnten Commits.

## Laufen lassen

Ordner auf einen beliebigen statischen Server legen und `KFB_Resident_Atlas_S7.html` öffnen
(ES-Module brauchen `http://`, ein `file://`-Doppelklick reicht nicht). Netzzugriff ist nötig:
three.js kommt von unpkg, die Assets von `raw.githubusercontent.com/georg-doc/kayfabizarro` an
den Commits `891eadf0` (Assets), `aa16a777` (Animationen), `10a7fdce` / `eb48f504` (Legacy).

Deep-Link auf einen Residenten über den Fragmentteil, z. B. `…S7.html#goth-girl`.

## Bekannte Grenze im schlanken Export

`reference.src` in `data/cast.js` zeigt bei einigen Residents auf Projektdateien
(`ref/atlas/*.gif`, `uploads/*.png`), die hier bewusst fehlen. Folge: der Regler **Referenz**
blendet dort nichts ein. Die Szene selbst ist nicht betroffen. Fix-Kandidat ist in
`HOUSEKEEPING.md` unter *Pfad-Hygiene* benannt.

## Für das Review bei BSA — was zu prüfen sich lohnt

1. **Die Bedienung**, nicht der Code: Puppe an, einen Fuß einrasten, die Hüfte ziehen. Wenn die
   Knie sich beugen und die Füße stehen, stimmt die Kette.
2. **Der Restfehler.** Ein Ziel außer Reichweite muss als Zahl erscheinen, nicht als hübsche Pose.
3. **Die Trennung Ist-Zustand / Handkorrektur** im Export: `placements` ist die Szene,
   `studioPatch` sind die Griffe. Im beigelegten Beleg steht `speaker` im ersten und nicht im
   zweiten Block — genau so soll es sein.
4. **Die Eye-Rig-Prüfung** ist ein Einspruch gegen eine Fremdmeldung, kein fertiger Einbau. Wenn
   BSA die Gegenmessung laufen lässt, entscheidet sie die Frage; bis dahin ist `#b58f83` auf allen
   vier Figuren der Stand der Datei.
