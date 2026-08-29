# README · Export Pet Studio v10 · 29.08.2026 (spät)

**22 Dateien, 0,94 MB.** Keine über 2 MB. Alle 3D-Assets (GLB, Texturen, Skydome) laufen zur
Laufzeit über RAW-URLs aus `georg-doc/kayfabizarro` — nichts eingebettet.

## Lesereihenfolge

1. **`docs/petstudio-v10/POST_MORTEM_rolli_v10.md`** — zuerst. Warum Rolli in dieser Form nicht
   weitergebaut wird, und die Drei-Befunde-Regel.
2. `KFB Pet Studio SESSION_LIVING.dc.html` — Stand der Baustelle, Nachtrag v10 oben.
3. `docs/HOUSEKEEPING.md` — Status je Artefakt, Clean-Run v10 (8 Punkte).
4. `docs/petstudio-v10/PRUEFUNG_kopflos_rolli.md` — die Messungen, falls jemand eine Zahl
   nachrechnen will.
5. Für Recherchi: `docs/recherchi-v4/SPEC_recherchi-modul_v1.md`, dann `README_REHOME.md`.

## Was drin ist

| Teil | Zustand |
|---|---|
| `KFB Pet Studio v10.dc.html` | **AKTIV** — Fork von v9. Sprechblase und Tipp-Punkte starten aus, Mund-Regler geweitet, Zug-Gestik am Blatt, Pad-Abschnitt »Roll« |
| `studio-v10/KloRolli.js` | **FROZEN** — läuft, gemessen, Konstruktion falsch. Blatt flach (`SPEC.paper.mode = 'flat'`). Tuch-Code unbenutzt mit Messwerten im Kommentar |
| `recherchi-v4/` (9 Dateien) | **GAST, nicht eingebaut** — lauffähig als eigene Einheit |
| `contracts/recherchi.pet.json` | **ENTWURF** — nicht einspielen, ohne `version` zu zählen |

## Drei Dinge, die man wissen muss

1. **Rolli ist nicht der Startbewohner.** Aus der Pet-Liste wählen.
2. **`recherchi-v4/support.js` ist eine bewusst gepinnte ältere Runtime.** Nicht durch eine neuere
   ersetzen — die Komponenten sind dagegen geschrieben.
3. **Recherchi und das Studio halten verschiedene three-Instanzen** (0.185 webgpu + HTML-Polyfill
   gegen die Studio-three). Wer sie zusammenbaut, muss diese Naht zuerst entscheiden.

## Offen, ehrlich benannt

- **Das Bild dieser Runde ist nicht abgenommen** — die Vorschaufenster antworteten am Ende nicht
  mehr. Alle Zahlen sind am echten Quelltext gemessen (Verfahren in der Prüfung dokumentiert), aber
  niemand hat das flache Blatt in der laufenden Szene gesehen.
- `recherchi-v4/assets/doccheck-doc.png` hängt an einem **relativen** Pfad. Lädt, weil die Datei
  daneben liegt; kanonisch wäre eine RAW-URL.
- `kfb-pets.v5.json` **1.2.7** muss nach `media/3D_Assets/` — dort liegt 1.2.6.
- Die Look-Zahl, die niemand entschieden hat: das GLB-Papier der **Rolle** trägt Metall 0,400 und
  liest halbglänzend. Das Blatt ist weiß und matt.

## Für WS1

Rolli neu, als **eigenes Modell** mit Augen und Mund als Teil der Form — nicht als Gesichtsteile auf
einem Rohr. Das Ruhebild des Blattes bleibt flach; ein Fall-Blatt ist ein eigener Schnitt mit eigenem
Abnahmekriterium, nicht die Rückkehr der Tuchsimulation.

`LADEWEG.tsv` trägt Pfad, Bytes und sha256-16 je Datei — damit ist prüfbar, ob im Ziel dasselbe
ankommt.
