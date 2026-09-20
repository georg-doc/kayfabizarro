# KFB ToolBox v1 · Living Masterplan

Status: DECISION / INITIAL EXECUTION PLAN · 2026-09-14
Dies ist der ToolBox-Plan, kein Ersatz der Spiele-SSOTs oder des zentralen Produktionsrouters.

## Aktueller Stand

| Gegenstand | Belegt | Noch offen |
|---|---|---|
| Studio v17 | Standalone vorhanden; Autoren-Housekeeping: aktiv, v16 Referenz | normale Browser-/Site-QA, editierbarer Source-Pin, finaler Actor-Look |
| Rigging Lab v1 | Standalone und Rigging-Doku vorhanden | aktuelle Funktions-/Export-QA; keine pauschale Vehicle-Fit-Vollständigkeit annehmen |
| Animation Lab v2 | Standalone geliefert, vom Nutzer WIP genannt | zusammengesetzter FB-Graft statt rohem Driver, Clip-/Talk-/Roundtrip-Prüfung |
| Configs | sechs Eingangs-JSONs vorhanden | Current/WIP/Rollenbezug eindeutig; keine Auswahl nach `(1)`/`(4)` allein |
| Schriften | Housekeeping meldet 17 fehlende lokale Referenzen | vollständige Nutzungsliste; UI-Fonts ersetzen, Art-Fonts getrennt behandeln |
| ToolBox-Site | Ziel und Auftrag definiert | noch keine Veröffentlichung oder Browserabnahme in diesem Paket |

## T1 · ein vollständiger benutzbarer Produktions-Slice

**Nutzertest:** ToolBox öffnen → Studio öffnen → FrizzleBob-Graft auswählen/ändern → exportieren → denselben Actor im Lab mit Clip und Talk sehen → Rigging/Config erneut öffnen → keine verlorenen Werte.

Vier zusammenhängende Arbeitspakete, keine vier neuen Freigabeprojekte:

1. **Quellen und Startweg sichern.** Originale pinnen, Paket vollständig inventarisieren; Standalone-Kaltstarts prüfen; fehlenden modularen Source-/Build-Bestand gezielt beim Authoring-Owner anfordern. Keine Neuerfindung.
2. **ToolBox bereitstellen.** Drei erreichbare Werkzeuge, dezente gemeinsame Navigation und Docs/LLM-Einstieg; erhaltene Funktionen; Lab sichtbar WIP. UI lesbar machen, Artwork nicht pauschal umfärben/umsetzen.
3. **Config-/Actor-Nähte schließen.** Bestehendes `kfb.pets/1` importieren/exportieren; realen Graft im Lab benutzen. Identität, Rolle und Fit logisch unterscheiden, nicht jetzt alle Dateien in ein neues Schema zwingen.
4. **Prüfen und abgeben.** Browser, Reload, Datenrundreise, Talk/Modifiers, Fonts/Fallback, Consumer-Handoff; Vorschau separat; Georg prüft sichtbare Qualität. Erst danach T1 als abgenommen bezeichnen.

## Abhängigkeiten, die nicht alles blockieren

Fehlende Brandfonts blockieren die UI nicht. Finale FB-Farbabnahme blockiert nicht die Tool-Veröffentlichung mit klar benanntem WIP-Preset. Die zentrale private Inbox ist keine Voraussetzung für diesen lokalen Arbeitsbereich. Fehlende Lab-Graft-Funktion muss dagegen als konkrete T1-Lücke erscheinen; kein grüner Gesamtstatus nur weil das HTML startet.

## Nach T1, nicht unbemerkt in T1 hineinziehen

- Freigegebenes FB-Profil in Travel/Combat/Podcast übernehmen, jeweils im Consumer-Slice.
- Bath/Rover/Papierflieger-Fits und Surf-Pose aus vorhandenen Vehicle-/SeatLab-Donoren vorbereiten; keinen neuen Fit-Editor behaupten, bevor der bestehende Umfang geprüft ist.
- CapsuleCarl als eigenständigen Presenter für Wissens-Pilli/CME vorbereiten.
- Presenter-Verhalten aus Podcast-v5-Donoren adaptieren, nicht dessen alten Cube-FB zum neuen Standard machen.
- Später echte zeitcodierte Viseme/Lip-Sync, Swim-Familien und generische Role-/Fit-Auszüge nach nachgewiesenem Mehrfachbedarf.

## Recovery / aktueller Return

Startauftrag: `_handover/TOOLBOX_V1_2026-09-14/START_HERE.md`.
Bei Umsetzung dort `RETURN.md` mit exaktem Branch/Commit, Startkommando, URL, Tests, Problemen und nächster Handlung ergänzen. Dieser Return ist aktuell noch nicht geliefert; Template ist keine Evidenz.

## Additive Entscheidungen

### 2026-09-14 · DECISION
ToolBox-Onboarding, Verzeichnisvertrag und vollständiger T1-Auftrag angelegt. Bestehende Standalones/Configs bleiben unverändert.

### 2026-09-14 · DECISION
Bedienoberfläche verwendet lesbaren Webfont mit System-Fallback, keine Brandfonts. Referenzprofil für Umsetzung: Roboto. Fonteys PRO und andere Gestaltungsschriften nur für ausdrücklich ausgewiesene Art-/Logo-/Posterflächen.

### 2026-09-14 · CLARIFICATION
Die frühere Actor + Role + Fit-Skizze bezeichnet Verantwortungsgrenzen. Für T1 wird kein inkompatibles neues Exportformat erzwungen und keine WIP-Config zum Kanon erklärt.

### 2026-09-21 · Fluid/Card/Voxel source-first consolidation

The verified 23-file Lab intake enters ToolBox as candidates, not as automatic canonical modules. First resolve exact CardRig, terrain-v10, Card Zone and TinySkies/Travel owners. Then prove Fluid, Beam, Seed/Palette, CardStack and Voxel in separate bounded gates. ToolBox may package accepted modules, but receiving games keep scene/runtime ownership.

### 2026-09-21 · Theatre Curtain transition seam

Route the public Theatre Curtain v1 as a reusable donor. Core v2 may expose deterministic cover/reveal/progress events and host adapters, while consumer games keep renderer, camera, gameplay pause, loading, audio, route and persistence. First integration proves one neutral host and one WSA-selected consumer only.
