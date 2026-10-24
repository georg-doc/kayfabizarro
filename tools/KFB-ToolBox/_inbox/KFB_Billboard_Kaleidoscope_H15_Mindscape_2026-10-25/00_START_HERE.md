# KFB Billboard Kaleidoscope H15 · Mindscape · Export 25.10.2026

Re-Home-Paket für WS0. Claude Design pusht nicht nach GitHub. Lieferung: dieses ZIP plus Preview. Integration macht der Web Lead.

## Lesereihenfolge
1. `00_START_HERE.md`: diese Seite
2. `DOKU.md`: Aufbau, Module, Datenfluss, Parameter
3. `HANDOVER_WS0.md`: Re-Home-Schritte, Pfade, Abhängigkeiten, Prüfliste
4. `OFFEN_UND_FRAGEN.md`: offene Punkte und Fragen an Georg
5. `TOP5_WS0.md`: fünf Vorschläge von Claude Design an WS0
6. `CHANGELOG_ADDITIVE.md`: H14 → H15 M3, nur additiv
7. `KFB_H15_Mindscape/RETURN_M1.md`, `RETURN_M2.md`, `RETURN_M3_NAHT.md`: Rückgaben je Slice

## Inhalt
| Pfad | Was |
|---|---|
| `KFB Billboard Kaleidoscope H15 Mindscape.dc.html` | Engine (H14 + Mindscape), eine Datei |
| `support.js` | DC-Laufzeit, Pflicht neben der .dc.html |
| `KFB_H15_Mindscape/poems.js` | Gedichtband: Wikisource-Lader, Zeilensatz im Takt |
| `KFB_H15_Mindscape/soundbed.js` | Soundbed: Binaural, Drone, Schellack, Puls |
| `data/h6-card-crops.json` | KFB-Karten-Crops (aus H6) |
| `hypernorm_r3/texte/*.json` | Gedicht-Seed, Zitat-Index |
| `hypernorm_r3/pd_audio/manifest.json` | Schellack-Liste (Internet Archive, gestreamt) |
| `hypernorm_r3/pd_pool/manifest.json` | WS0-Bildpool, nur das Manifest |
| `EXPORT_MANIFEST.json` | Dateiliste, externe Quellen, Pins |

## Nicht im Paket (Regel 1)
- Die 481 Bilder aus `hypernorm_r3/pd_pool/`. Sie liegen in `georg-doc/KFB-Stunt-Car-Race` @ `design/claude-design-r3`, `hypernorm_r3/pd_pool/`.
- three.js (jsDelivr @0.160.0), Schriften (Google Fonts), Audio (archive.org), Karten (Commons). Alles wird zur Laufzeit geladen.

## Status in einer Zeile
Sphäre, Schalen, Soundbed, Gedichte, Karten und WS0-Pool laufen in der Preview. Die Naht ist ursächlich behoben (M3), aber NOT_TESTED auf Hardware. GEORG ACCEPTANCE ist offen.
