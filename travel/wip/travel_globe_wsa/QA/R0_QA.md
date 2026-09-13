# R0_QA.md · Abnahme des Re-home

**Datum:** 2026-09-13 · **Baum:** `rehome-r0/travel/` · **Beleg:** `R0_coldstart.png`

Die Spalte **Kontext** ist Pflicht: Tastaturfokus im Design-Preview ist keine Laufzeit-Aussage.

| # | Pruefung | Ergebnis | Kontext |
|---|---|---|---|
| 1 | Kaltstart des re-homed Einstiegs | **PASS** — Bild steht, Kugel, Karten, Vulkan, Wortmarke, HUD | DESIGN PREVIEW TEST |
| 2 | Boot-Fehler (`window.__bootErrors`) | **PASS** — leer (0) | DESIGN PREVIEW TEST |
| 3 | HTTP-Fehler ≥ 400 | **PASS** — 0 von 250 Ressourcen | DESIGN PREVIEW TEST |
| 4 | Alle lokalen Ressourcen aus `travel/` | **PASS** — 97 lokal, 0 ausserhalb des Pakets | DESIGN PREVIEW TEST |
| 5 | Renderpfad WebGL | **PASS** — WebGL 2.0, Leinwand 1848×1080 | DESIGN PREVIEW TEST |
| 6 | Pet-Pfad (Cube Bunny) | **PASS (Ladepfad)** — `CubePet`, `PetLibrary`, `PetMotion`, `PetFace`, `PetMouth` registriert | DESIGN PREVIEW TEST |
| 7 | Bunny **sichtbar** im Bild | **NOT TESTED** — der Beleg zeigt die Nachtseite im Anflug, das Tier ist darauf nicht eindeutig zu erkennen | — |
| 8 | Flug-Eingabe | **NOT TESTED** — Tastatur, Fokusgrenze | NORMAL BROWSER TEST offen |
| 9 | Bremse | **NOT TESTED** | NORMAL BROWSER TEST offen |
| 10 | Schwebe-Umschaltung (Lesemodus) | **NOT TESTED** | NORMAL BROWSER TEST offen |
| 11 | Steigen/Sinken | **NOT TESTED** | NORMAL BROWSER TEST offen |
| 12 | Karten-Anflug / Einsammeln | **NOT TESTED** | NORMAL BROWSER TEST offen |
| 13 | Portal- oder Landmarken-Kontakt | **NOT TESTED** — deckt zugleich UNRESOLVED 1 (`rift.png`) ab | NORMAL BROWSER TEST offen |
| 14 | Schuss-/Aktionspfad | **NOT TESTED** | NORMAL BROWSER TEST offen |
| 15 | Fokusverlust / Wiederaufnahme | **NOT TESTED** — bekannte DC-Kante (WIRT §8.2: rAF pausiert, Neubau haengt Canvas ab) | — |

## Was 1–6 zusammen beweisen

Der Baum ist **portabel**. Kein Bild haengt mehr an einer Datei, die nur im Workspace liegt.
Was 1–6 **nicht** beweisen: dass sich v13 unveraendert *spielt*. Die Zeilen 8–15 sind der Teil,
der an einer Tastatur im normalen Browser erledigt werden muss — bitte einmal aus
`python3 -m http.server` heraus durchklicken und die Zeilen hier fuellen.
