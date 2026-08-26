---
name: workspace-sync
version: 1.0
date: 2026-08-26
canonical: https://raw.githubusercontent.com/georg-doc/kayfabizarro/refs/heads/main/skills/workspace-sync_v1.md
purpose: Reconciliation zwischen zwei Workspaces (typisch WS0 ↔ WS1). Vergleicht ihre Living-HTMLs, zeigt Diskrepanzen als Cards, empfiehlt Merges mit klarer PO-Empfehlung. On-demand via Trigger, kein Autolauf.
scope: Cross-Workspace-Sync. NICHT innerhalb einer Session (dafür session-design-briefing).
loads_on_demand:
  session-design-briefing_v1: https://raw.githubusercontent.com/georg-doc/kayfabizarro/refs/heads/main/skills/session-design-briefing_v1.md
triggered_by:
  - "sync ws0/ws1"
  - "workspace sync"
  - "gleich das ab"
  - "wo stehen wir zwischen den workspaces"
---

# Workspace Sync — WS0 ↔ WS1 Reconciliation

**Zwei Workspaces, zwei Living-HTMLs, ein PO. Dieser Skill sagt Georg wo sie auseinandergehen, was das bedeutet, und was er tun sollte — nicht mehr.**

---

## 1. Input

Zwei Living-HTML-Pfade oder raw-URLs. Beide müssen dem Skeleton aus `session-design-briefing_v1` folgen (Blocks `header`, `timeline`, `backlog`, `housekeeping`, `file-map`, `archive`).

Wenn ein Workspace kein Living-HTML hat: **Stop, kein Sync möglich.** Erste Antwort ist dann: „Workspace X hat kein Living-HTML — leg eins an über /session-design-briefing, dann nochmal syncen."

---

## 2. Was verglichen wird — in dieser Reihenfolge

| # | Block | Was zählt als Diskrepanz | Schwere |
|---|---|---|---|
| 1 | `header[data-role=current-state]` | Unterschiedliche „aktueller Stand"-Sätze | **hoch** |
| 2 | `timeline` | Fixes/Features in einem, nicht im anderen | **mittel-hoch** |
| 3 | `file-map` | File in einem, fehlt im anderen; oder derselbe Pfad mit anderem `data-purpose` | **hoch** (Konflikt-Risiko) |
| 4 | `backlog` | Item in beiden mit anderer Priorität; Item nur in einem | **mittel** |
| 5 | `housekeeping[data-role=ws-deltas]` | Bereits geflaggte Deltas — prüfen ob noch aktuell | **niedrig** |
| 6 | `archive` | Post-Mortem in einem, dessen Lehre im anderen nicht angewandt wurde | **mittel** |

**Ignoriert:** Timestamps, kosmetische HTML-Unterschiede, Q&A-Log (bleibt workspace-lokal).

---

## 3. Output — Diskrepanz-Cards

Pro Diskrepanz eine Card. Format:

```
[CARD] <kurz-titel>
Schwere: hoch | mittel-hoch | mittel | niedrig
WS0: <was da steht>
WS1: <was da steht>
Warum es zählt: <ein Satz, laientauglich>
Empfehlung: <klar, imperativ — nicht "man könnte">
Falls du ok gibst — nächster Schritt: <konkret>
```

**Maximal 5 Cards pro Sync-Runde.** Bei mehr Diskrepanzen: die 5 mit höchster Schwere zeigen, Rest als eine Zusammenfass-Zeile („zusätzlich 12 kleinere Deltas, überwiegend Timeline-Reihenfolge — im Housekeeping-Block beider Workspaces geflaggt").

---

## 4. Merge-Empfehlungen — die drei Standard-Fälle

| Fall | Empfehlung-Format |
|---|---|
| **Ein Workspace ist voraus** (Feature/Fix in WS1, nicht in WS0) | „Übernehme aus WS1 nach WS0: `<file#zeilen>`. Kein Konflikt — WS0 hat nichts Widersprechendes." |
| **Beide haben sich unabhängig entwickelt** (kein gemeinsamer Ancestor am Diskrepanz-Punkt) | „Zwei Fassungen desselben Themas. Empfehlung: WS<X> ist die neuere/robustere, siehe Beleg. WS<Y> wegwerfen ODER als Sidequest in Housekeeping schieben." |
| **Widerspruch mit gleichem Alter** | „Konflikt braucht deine Entscheidung. Kurz-Vergleich: [zwei Zeilen]. Ich empfehle WS<X>, weil [ein Satz]. Falls du überstimmst, sag welchen." |

---

## 5. Was NACH dem Sync passiert

Nach Georgs Entscheidung pro Card:

1. Merge ausführen (File-Copy, Backlog-Update, Header-Angleich)
2. **In BEIDEN Living-HTMLs eine Timeline-Zeile:** `[type]=sync-merge`, mit Cross-Reference auf den anderen Workspace
3. **`housekeeping[data-role=ws-deltas]`** in beiden aufräumen — resolved Deltas raus, verbleibende bleiben
4. Ein-Satz-Bericht an Georg: „Sync abgeschlossen. X Merges, Y verbleibend als Sidequest, Z abgelehnt."

---

## 6. Anti-Patterns beim Syncen

- **Nicht** stumm mergen ohne Card. Georg muss vor jedem Merge sehen was er entscheidet.
- **Nicht** kosmetische Deltas als Diskrepanz aufblasen (HTML-Whitespace, Timestamp-Reihenfolge).
- **Nicht** Q&A-Log oder Chat-Snippets mergen — die sind workspace-lokal und sollen es bleiben.
- **Nicht** Post-Mortems zwischen Workspaces kopieren — die Lehre kann übernommen werden (als Regel in `use-what-works` z.B.), das Post-Mortem selbst bleibt in seinem Ursprungs-Archiv.

---

## 7. Standardform am Rundenende

1. **Ein Satz Gesamtdiagnose** — „WS0 und WS1 sind eng beieinander, X Diskrepanzen, davon Y kritisch."
2. **Diskrepanz-Cards** (max 5)
3. **Empfehlung für Reihenfolge der Merges** — was zuerst, was danach
4. Kein Wall-of-Text, kein Prozess-Bericht

---

*v1.0 · 2026-08-26 · WS0↔WS1-Reconciliation. Lean, on-demand, Card-basiert. Für PO-Entscheidungen, nicht für Auto-Merge.*
