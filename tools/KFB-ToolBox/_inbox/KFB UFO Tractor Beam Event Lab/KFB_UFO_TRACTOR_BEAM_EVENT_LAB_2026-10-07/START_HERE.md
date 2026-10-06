# START HERE · KFB UFO Tractor Beam Event Lab · Session 2026-10-06/07

Session-Paket für **Work/WSA**. Isolierter Beweis, nicht integriert.

## Lesereihenfolge
1. `ufo-event-lab/HANDOVER_WSA_2026-10-07.md`: Übergabe, Code-Karte, offene Entscheidungen für den Freeze
2. `ufo-event-lab/EVENT_CONTRACT.json`: Phasen, Hooks, Event-Namen, Zielklassen, Beam-Regel, Audio-Hooks (maschinenlesbar)
3. `ufo-event-lab/CHANGELOG.md`: r2-Änderungen nach Georgs Review
4. `ufo-event-lab/RETURN.md`: vollständiger V1-Return (Quellen, Pins, Parameter, Audio, Belege)
5. `ufo-event-lab/BRIEF.md`: Auftrag, Scope-Regeln, Ausblick Destruction/Terraforming Beam
6. `ufo-event-lab/screens/r2/00-r2-contact-sheet.png`: aktueller Stand auf einen Blick (r1-Screens daneben zum Vergleich)

## Lab öffnen
`KFB UFO Tractor Beam Event Lab.dc.html` über einen lokalen Webserver öffnen (z. B. `npx serve .` im Paketordner), in einem sichtbaren Top-Level-Tab.
- Braucht Netz: three@0.170.0, UFO-GLBs und Audio werden gepinnt über jsDelivr geladen (Fallback raw.githubusercontent).
- Bedienung: Leertaste = Play/Pause, R = Neustart, Timeline scrubben. „Ton an“ für die Audio-Vorschau.

## Inhalt
```
START_HERE.md
KFB UFO Tractor Beam Event Lab.dc.html   Lab (UI-Shell)
support.js                               Design-Component-Runtime
ufo-event-lab/
  ufo-lab.js                             Szene + Event (kommentierter Datei-Header = Modulkarte)
  ufo-audio.js                           Vorschau-Audio, Event-Map, Messung
  HANDOVER_WSA_2026-10-07.md
  EVENT_CONTRACT.json
  CHANGELOG.md
  RETURN.md
  BRIEF.md
  screens/       r1 (00–18)
  screens/r2/    r2 (00–08)
BACKLOG.md                               Projekt-Backlog (Stand 07.10.2026)
```

## Grenzen
Keine Open-World-Writes · keine Persistenz · kein Merge · PR #348 unberührt · Ziele sind Clay-Proxies · Audio nicht per Gehör abgenommen.
