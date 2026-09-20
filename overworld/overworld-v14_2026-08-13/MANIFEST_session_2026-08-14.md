# MANIFEST — Session-Export 2026-08-14 · Overworld v14 FROZEN

Nur was in **dieser** Sitzung entstanden oder geändert wurde. Der Rest des Projekts bleibt, wo er
ist — **kein Gesamt-Projekt-Zip**.

Größenbudget eingehalten: schwerste Datei **846 kB** (die Standalone-Datei), Grenze 2 MB. Nichts
Schweres eingebettet; Props laden zur Laufzeit per RAW über `asset-repo.json`.

---

## (a) Deliverables

| Datei | Änderung | Status |
|---|---|---|
| `KFB Overworld v14.dc.html` | eine Skriptzeile: `input-truth.js` zuletzt geladen | AKTIV |
| `overworld-v14/hud-v7.js` | **C1** · Hintergrund-Schließer in `mkWin()` entfernt (X + Esc bleiben) | geändert |
| `overworld-v14/card-rail-v9b.js` | **C2a** · `const ACCT_ZEILE = false` deklariert — benutzt in Zeile 2134, nie definiert; brach den Rail-Einbau ab | geändert |
| `overworld-v14/input-truth.js` | **neu** · Meßgerät für Eingabe-Herkunft, Umschalt+I, ändert kein Verhalten | AKTIV (Werkzeug) |
| `export/overworld-v14_2026-08-13/KFB-Overworld-v14-standalone.html` | **neu** · 846 kB, eine Datei, für GitHub und den Firefox-Test | AKTIV |

## (b) Contract- und Daten-Dateien

Keine geändert. `asset-repo.json` (Projektwurzel, 986 Assets mit `ghUrl`) unberührt — Version und
`canonical` bleiben, wie sie sind.

## (c) Docs

| Datei | Inhalt |
|---|---|
| `docs/overworld-v14/MESSUNG_v14_2026-08-14.md` | **neu** · Chrome-Grundlinie, vier Verdächtige, Firefox-Auftrag Schritt für Schritt, offene Ränder |
| `docs/overworld-v14/HANDOVER_v14_FREEZE.md` | **neu** · Handover für Coworker und frische Chats: C0/C1/C2, v15-Reihenfolge, Regeln |
| `docs/overworld-v14/MANIFEST_session_2026-08-14.md` | dieses Blatt |
| `HOUSEKEEPING.md` | §4z-C nachgezogen: v14 **FROZEN**, v13 SUPERSEDED, Clean-Run-Zeile |

## (d) Abnahme-Captures

Keine neuen. Die Bildpaare aus V1 liegen unverändert in `docs/overworld-v14/captures/`
(924×540, fester Standpunkt über `OW_WINS.oeffne(id)`) und sind **nicht** Teil dieses Exports.

---

## Cleanup-Kandidaten — nur benannt, nichts ausgeführt

Keine Löschung ohne ausdrückliche Freigabe, jeder Schritt einzeln.

| Kandidat | Empfehlung | Grund |
|---|---|---|
| `KFB Overworld v11.dc.html` + `overworld-v11/` | **behalten** bis v15 steht | letzter Stand vor dem Wasser-Slice |
| `KFB Overworld v12.dc.html` + `overworld-v12/` | löschbar nach Georgs Okay | von v13 vollständig überholt, Check-in liegt in `export/overworld-v12_2026-08-12/` |
| `KFB Overworld v13.dc.html` + `overworld-v13/` | **behalten** | Vergleichsmaßstab für v14 (§4z) |
| `uploads/` — 11 Briefings + `Georg's Infinite Canvas (8)/` | prüfen, dann löschen | was nach `docs/` gewandert ist, ist doppelt; der WS1-Export darin ist schwer |
| `overworld-v14/input-truth.js` | **behalten, solange v14 lebt** | Werkzeug, unsichtbar bis Umschalt+I; raus = eine Zeile in der DC-Datei |

**Geteilte Module** (mehrere Deliverables importieren sie) — nicht als tot einstufen:
`hud-v7.js` · `card-rail-v9b.js` · `ui-kit-ts.js` · `win-owner.js` · `game-feel.js` · `bench.js`.

## Pfad-Hygiene

**C2a — der Fehler, den nur der Export zeigt.** `ACCT_ZEILE` war in `card-rail-v9b.js:2134` als
Bedingung im Einsatz und im CSS-Kommentar erwähnt, aber **nirgends deklariert**. Die Chat-Vorschau
hat die Ausnahme still verschluckt, der Standalone-Export meldet sie (`ReferenceError`) — und mit ihr
brach der komplette Rail-Einbau ab. Der Defekt war die ganze Zeit da. Gegengeprüft im geladenen
Export: `.r9stat` vorhanden, `.v7-win` 6, `.acct` **0** (die POP-account-Zeile bleibt weg, §4j),
32 Mobs. **Merksatz für die Clean-Run-Liste: der Standalone-Export ist die strengere Prüfung, nicht
die bequemere Kopie — er läuft ohne die Fehlertoleranz der Vorschau.**

Geprüft: kein neuer relativer Asset-Pfad in dieser Sitzung. `input-truth.js` lädt nichts, zeichnet
nichts, holt nichts — es hat keine Assets. Der bekannte Rand bleibt notiert: Props laufen über
`asset-repo.json` → RAW, nicht über `catalog.json` (dessen `path` ist der LOKALE Pfad, ~1550
Einträge liegen nicht im Repo — `github.md`).

## Was im Zip liegt

```
KFB-Overworld-v14-standalone.html          846 kB   ← in Firefox öffnen
HANDOVER_v14_FREEZE.md                              ← zuerst lesen
MESSUNG_v14_2026-08-14.md                           ← §4 = der Firefox-Auftrag
MANIFEST_session_2026-08-14.md                      ← dieses Blatt
```
