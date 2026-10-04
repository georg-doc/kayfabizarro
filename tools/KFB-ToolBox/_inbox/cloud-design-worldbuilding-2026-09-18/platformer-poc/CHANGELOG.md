# Changelog

## v0 · 2026-09-18 — erste Fassung

Gebaut nach `CLAUDE_DESIGN_BRIEF.md` @ `a12e3316dd56f2bcda1bf0d7c1b743f40fec849e`.

**Neu**
- Spielbare KFB Project Island: 17 Plattformen aus dem Platformer Game Kit - Dec 2021,
  9 Projektportale, 18 Pickups, Bouncer, zwei Gefahren, 8 Checkpoints.
- Zwei Modi auf einer Welt: Chill & Fun (assistierter, ballistisch gerechneter Sprung) und
  KFB Game Mode (manuell, Gefahren scharf, Checkpoint-Respawn).
- Ein Bewegungs-Besitzer mit neun semantischen Zuständen; vier Aktor-Adapter
  (Platformer Character, KayKit/Resident-Biped, FrizzleBob-Graft, CapsuleCarl).
- Manifest-getriebenes Roster (15 Einträge, lazy, genau ein lebender Aktor).
- Freier Orbit mit Zoom und Recenter, ohne jeden Selbstlauf.
- Motion Lab als einklappbare Diagnose mit manuellem Clip-Dropdown.
- Zwei Eingabe-Presets: `KFB_TRAVEL` (Standard) und `PLATFORMER_CAMERA_RELATIVE`.

**Gemessen statt angenommen**
- Zellkante am Pack-Würfel (2,000) — alle Level-Maße sind Zellen.
- Figurenhöhe je Aktor, Skalierung auf 1,05 Zellen.
- Clip-Bindung je Zustand und Aktor (Track-Auflösung, nicht Augenschein).

**Korrekturen während des Baus** (im Code kommentiert, weil sie wiederkehren)
- Kollisionsreihenfolge: erst Boden, dann Wände. Vorher schob die Seitenauflösung landende
  Figuren aus der Plattform — 3 von 9 assistierten Sprüngen endeten im Fall.
- Luftkontrolle: während eines Assists null, ohne Eingabe fast keine Reibung. Vorher fraß die
  Dämpfung den Anlauf und die „garantierte" Landung fiel kurz.
- Anticipation friert die Position, nicht die Geschwindigkeit.
- Unterschicht der Plattformen aus der Dirt-Single-Height-Reihe: `Cube_Dirt_Center_Tall` ist
  gemessen 2 × 0 × 2 — ein Deckel, kein Block.
- Deko wird auf gemessene Zielhöhen skaliert; die Pack-Bäume sind 8,63 hoch und hätten die
  Inseln aufgefressen.

**Nicht enthalten** — siehe `docs/KNOWN_ISSUES.md`.
