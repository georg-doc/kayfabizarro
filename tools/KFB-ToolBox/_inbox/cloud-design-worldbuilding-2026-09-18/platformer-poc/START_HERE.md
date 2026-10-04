# START HERE

**KFB Free Roam · Platformer Hub POC v0** — eigenständiger Kandidat, gebaut nach
`skills/chat/workflows/FREE_ROAM_PLATFORMER_POC_2026-09-18/CLAUDE_DESIGN_BRIEF.md`
(Commit `a12e3316dd56f2bcda1bf0d7c1b743f40fec849e`).

## Starten

`index.html` im Browser öffnen. Kein Build, kein `npm`, kein Server nötig — es sind ES-Module
plus eine Importmap auf three@0.160 (CDN). **Netz wird gebraucht:** alle Modelle kommen zur
Laufzeit als GitHub-SourceRefs aus `georg-doc/kayfabizarro`, nichts liegt im Paket.

Wenn der lokale Browser `file://`-Module blockiert: irgendeinen statischen Server im Ordner
starten. Das ist die einzige Terminalzeile im ganzen Paket, und auch die nur im Notfall.

## In 60 Sekunden

1. Es lädt die Insel (~35 Quellen, ein paar Sekunden).
2. **W** laufen, **Shift** rennen, **Space** springen. Im Chill-Modus wird das nächste
   plausible Ziel hervorgehoben und der Bogen gerechnet — Sprung geht nie daneben, solange
   das Ziel gültig ist.
3. **KFB Game** oben umschalten: dieselbe Welt, dieselben Aktoren, kein garantiertes Ziel,
   Hindernisse scharf, Rettung auf den letzten Checkpoint.
4. **Characters**: Aktor wechseln. Vier Nachweise sind markiert (`proof`).
5. **Motion Lab**: echter Clip, Bindungsquote, Assist-Bewertung, Zellmaß, Ladeprotokoll.
6. Auf einer Projekt-Plattform stehen → **Enter** öffnet das Kandidaten-Ziel.

## Was dieses Paket NICHT ist

- Kein Ersatz für den veröffentlichten Free-Roam-Drive-POC (`fr-s04-01`). Der bleibt unberührt.
- Keine zweite Animation-Engine, kein neues Asset-Registry, kein universelles Rig.
- Keine öffentliche Veröffentlichung. `GITHUB PUSH: NOT PERFORMED`.

## Reihenfolge zum Lesen

| Datei | wofür |
|---|---|
| `README.md` | Was drin ist, wie es bedient wird |
| `docs/ARCHITECTURE.md` | Welche Datei was besitzt |
| `docs/ACTOR_ADAPTERS.md` | Die vier Adapter und was wirklich bindet |
| `docs/TEST_REPORT.md` | Was gemessen wurde — und was NOT_TESTED ist |
| `docs/KNOWN_ISSUES.md` | Offene Punkte, ehrlich |
| `EXPORT_MANIFEST.json` | Jede Quelle mit Pin und Ladeergebnis |
