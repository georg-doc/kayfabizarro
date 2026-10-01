# START HERE · World Core R2C · Hex-Archipel

Session-Cut 2026-10-01 · **vollständig, ohne Vorgänger-Cut lauffähig.** Ordner entpacken, HTML direkt öffnen (lokaler Webserver, z. B. `npx serve`).

## Was ist aktuell?
| Datei | Rolle | UI |
|---|---|---|
| **`KFB World Core R2C · Hex-Archipel Katalog.dc.html`** | **AKTUELL** · Inselwelt nach KayKit-Katalog, Strecke mit Mindestradius, Kreuzungsprüfung | Resident Atlas S7 |
| `KFB Clay Gate FACADE-AB-01 · building_A.dc.html` | Clay-Gate building_A (Golden K1 gegen v10), Schatten-Rezept | Resident Atlas S7 |
| `KFB World Core R2B · Hex-Archipel Atlas-UI.dc.html` | Vergleich: eigene Knetkachel ↔ KayKit, Messlauf A/B | Resident Atlas S7 |

R2A (altes blau-weißes UI) ist **SUPERSEDED** durch R2B und liegt nicht im Paket.

## Inhalt
- `lab-world/` Inselwelt-Module (`hex-archipel.r2c.js` aktiv, `hex-archipel.r2a.js` für R2B), `shadow-fit.v1.js`, `sky-core.r0a.js`
- `lab-clay/` Knete K2/v10 (Parität = Gate-MATCH)
- `golden/` Gate-Code + K1-Code 1:1
- `bb-scene.js`, `wd-donors.js`, `wd-registry.js` Deck-Cover für die Billboards
- `support.js` Laufzeit der Design-Komponenten
- `docs/` RETURN, **HANDOVER_WSA** (nächster Chat), CHANGELOG, FACADE-RETURN, HOUSEKEEPING, github.md
- `pictures/` Belegbilder

Alle Assets (KayKit, Wolken, Berge, Fingerabdrücke, building_A, Deck-PDFs) laden zur Laufzeit per jsDelivr/raw.githubusercontent @main. Kein lokaler Asset-Pfad.

Lesereihenfolge: `docs/RETURN.md` → `docs/HANDOVER_WSA.md` → `docs/CHANGELOG.md`.
