# Antwort auf die Review (claude_web, 2026-08-20) — v1 → v2

Die Review hatte in **jedem** Punkt recht. Am echten Repo gegengeprüft (raw), dann v2 gebaut. Danke —
das war eine ehrliche, teure Lektion: mein v1 hat **Pfade und Tests geraten**, genau vor dem meine
eigenen Regeln 3 und 4 warnen.

## Was gefixt ist
| Befund | Fix in v2 |
|---|---|
| **B1** Ink-Test rot (`drawInk.length>=8`) | `drawInk.length===7 && INK_CANON_VERSION>=2 && typeof measureInk==='function'`; echte Abnahme = `measureInk(...).ok` gegen `INK_CHECK`. Am Export bestätigt: 7 Parameter. |
| **B2** CardBuilder-Test rot (`buildCard`) | `typeof createCardBuilder==='function' && CARD_AR===1.74`. Am Export bestätigt. |
| **B3** gemischte Herkunft | **Regel 7** aufgenommen (eine Herkunft je Modul-Stack); der Card-Stack (builder+format+ink) lädt komplett aus `jsdelivr skills/`. |
| **B4** Module unter `media/` | korrigiert auf `skills/kfb-card-builder.js` / `skills/kfb-card-format.js`; Karten-Daten via raw `media/kfb/index.json`. |
| **B5** Doku-404 (`_v1` fehlte) | Zeiger jetzt `EMBED_KFB_CardBuilder_Ink_FULL_v1.md`. Ink-Doku auf die echte SSOT `SSOT_Card_Ink_Outline_v2.md` (nicht das erfundene `03_…`). |
| **B6** tote Doku-Zeiger + `ui-sfx.json` falsch als kanonisch | die nicht-existierenden auf `status: pending-push`; `sfx.json`/`ui-sfx.json` als **noch nicht kanonisch** markiert. |
| **B7** Prosa in `canonicalUrl` | leere Felder → `canonicalUrl: null` + `status`; `capabilityTest` strukturiert (`symbols` · `condition` · `human`) statt eval-String. |
| **B8** zwei handgepflegte Fassungen | **ein Index, ein Render:** `00_INDEX.md` wird aus `kfb-embed-index.json` generiert. |
| **B9** 6/11 nicht plug&play, aber KICKOFF verschweigt es | **Ehrlichkeitszeile** oben im KICKOFF: on-github vs pending-push. |
| **Größte Lücke: kein Spielkanon** | Block **Spielkanon** in Index + KICKOFF: Power=Stichwort/K1, KayfaBONGO, rollenlose Karten, Quest-Die, Social Calls, Lizenz CC BY-NC-SA 4.0 — mit Zeiger auf die Regel-SSOT als Gewinner. |

## v2.1 (nach dem zweiten Durchgang)
Der zweite Review bestätigte Index/KICKOFF/JSON als sauber, fand aber **eine** nicht durchgezogene
Datei: `MANIFEST_versions.md` trug noch v1-Inhalt (B5 ohne `_v1`, B3 pages.dev-Ink unter „kanonisch",
Fußzeile „v1→v1.1", 4 statt 5 Dateien) — der nächste Push hätte zwei behobene Befunde **wieder
eingeführt**. Gefixt in v2.1. Zusätzlich: `asset-repo.fullDoc` → `null` (letzter Prosa-Rest, B7).

## Offen (außerhalb des Bundles — Formulierung nach dem 2. Review geschärft)
- **`cardGrid`: „Mapping ohne Ränder", nicht „kein Mapping".** Die Registry HAT ein globales
  `cardMapping` (2×2, TL/TR/BL/BR, Seitenformel mit `coverOffset`, v4-ohne-Gutter). Was fehlt, ist das
  **Rechteck pro Deck** — wo der 2×2-Block auf der Seite sitzt. Builder-Default `cardGrid: null` = ganze
  Seite, und der Code sagt selbst, dass das nicht stimmt. **130/130 Decks ohne `cardGrid`.** Das ist der Push.
- **Quest-Die Beat 2:** „Funke" (Live-DE) vs „Auslöser" (ältere Notizen) — ein Stand ist alt, klären.
- **Deckzahl — vermutlich kein Widerspruch.** Verifiziert: **130 Decks · 6.985 Karten · 1.915 Seiten.**
  Die ~400 im Almanach ist eine andere Zählung (gezeichnet vs. veröffentlicht).

*Verfahren statt Trefferquote: bevor eine Fähigkeit `on-github` wird, den Fähigkeitstest einmal gegen
den echten Export laufen lassen — und **jede** Bundle-Datei durchziehen, nicht nur die generierten.*
