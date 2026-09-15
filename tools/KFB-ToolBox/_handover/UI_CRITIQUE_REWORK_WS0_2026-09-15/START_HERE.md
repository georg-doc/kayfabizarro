# KFB ToolBox · WS0 UI Critique & Rework Brief

**Datum:** 15.09.2026  
**Status:** EXECUTION BRIEF / INPUT. Kein neuer ToolBox-Owner, kein Runtime-Release.  
**Empfänger:** WS0 / Desktop Design / ToolBox UI workstream.  
**Aktueller Shared-Repo-Pin beim Briefing:** `georg-doc/kayfabizarro@f7f9bee9cd6011680f5ec67337d43809be182d2c`.

## 1 · Auftrag in einem Satz

Nimm den realen, bereits funktionalen **KFB ToolBox Pilot v1** als Ausgangspunkt, führe zuerst eine belastbare UX/UI-Kritik durch und entwickle daraus **eine kohärente gemeinsame Authoring-Oberfläche** weiter — ohne Rig-, Material-, Session- oder Consumer-Wahrheiten neu zu erfinden.

Der Rework soll die ToolBox als zukünftige **browserbasierte Site / Authoring-Shell** vorbereiten. Die Site ist später ein veröffentlichter Consumer desselben Quellstands, **kein zweiter handgepflegter Codebaum**.

## 2 · Zuerst lesen

1. `tools/KFB-ToolBox/START_HERE.md`
2. `tools/KFB-ToolBox/MASTERPLAN.md`
3. `tools/KFB-ToolBox/_inbox/WS0_2026-09-15/FIELD_COVERAGE.md`
4. `tools/KFB-ToolBox/_inbox/WS0_2026-09-15/RETURN_WSA.md`
5. `tools/KFB-ToolBox/_inbox/WS0_2026-09-15/unpacked/B_OBERFLAECHE/KRITIK_UX_CARL_WEG_v1.md`
6. `tools/KFB-ToolBox/_inbox/WS0_2026-09-15/unpacked/B_OBERFLAECHE/BERICHT_UI_PILOT_v1.md`
7. `tools/KFB-ToolBox/_inbox/WS0_2026-09-15/unpacked/B_OBERFLAECHE/KFB ToolBox Pilot v1.dc.html`
8. `tools/KFB-ToolBox/_handover/BIRTHDAY_STARTSCREEN_2026-09-15/RETURN_BIRTHDAY_CONSUMER.md`
9. `tools/KFB-ToolBox/_inbox/kfb-pet-graft-driver(1).json` — **aktueller Georg-Entwurf, ausdrücklich nicht final**.

Ergebnis A und Ergebnis B bleiben getrennt. A nicht neu bauen. B ist der UI-/Workflow-Pilot und hier der aktive Designgegenstand.

## 3 · Bereits vorhandene Ausgangslage

### TESTED RESULT · Ergebnis A

Der Quellstand wurde bereits mit 7/7 Coldstarts, geschlossenem lokalen Modulbaum und positiver Feldabdeckung geprüft. Diese Beweise nicht noch einmal als Beschäftigungstherapie wiederholen.

### IMPLEMENTATION / TESTED RESULT · Ergebnis B Pilot

Der vorhandene Pilot bildet bereits die gemeinsame Arbeitsfolge:

`Select → Shape & Look → Attach & Fit → Motion & Talk → Export`

Gemessen wurden unter anderem Carl-/Graft-Mount, 21 Materialzonen und eine deutlich bessere Bediengröße als im alten Rigging Lab. Responsive Drawer, echte Mehrformat-QA und unabhängiger Embed-Roundtrip sind noch offen.

### TESTED RESULT · Birthday Consumer

Der Birthday-Casting-Return zeigt einen realen Consumer-Workflow und ist deshalb ein wertvoller UX-Fall:

`actor finden → rig erkennen → state clips casten → binding messen → consumer-ready return`

Der Pilot hat dafür noch keine klare Casting-Fläche. Das ist ein konkretes UX-Delta, kein Anlass für eine zweite Motion-Wahrheit.

## 4 · User-reported defects · als Befund aufnehmen, nicht wegdesignen

Die folgenden Punkte sind **USER-REPORTED / TO VERIFY**. Sie sind nicht durch den UI-Pilot-Return automatisch widerlegt:

1. **Carl eyebrows sind dysfunktional.**
2. **Eyebrow tapering ist broken bzw. war nie korrekt.**
3. **Material-Zonen brauchen Texturen / Surface-Zugriff für alle relevanten Zonen.**
4. **Colorpicker-UX ist broken:**
   - kein sauberer `#hex`-Workflow / Copy;
   - Colorfields praktisch nicht nutzbar;
   - Picker soll bei Klick außerhalb schließen;
   - Escape soll ebenfalls schließen;
   - ungültige Werte dürfen nicht still gespeichert werden.
5. `kfb-pet-graft-driver(1).json` ist ein **aktueller Draft**, nicht final/canonical.

### Harte Trennung

- **UI/UX-Problem:** Auffindbarkeit, Bedienung, Feedback, Colorpicker, Zone-Workflow, Responsive, State, Exportverständlichkeit.
- **Rig-/Reader-Problem:** Braue verhält sich funktional falsch, Tapering wirkt geometrisch/funktional nicht korrekt.
- **Material-/Renderer-Problem:** Texture/Surface wird nicht korrekt angewandt oder besitzt keinen vorhandenen Consumer-Griff.

Ein UI-Rework darf einen technischen Rig-Defekt **nicht** durch hübschere Controls kaschieren. Technische Defekte müssen sichtbar benannt und an ihren bestehenden Owner zurückgegeben werden.

## 5 · Designziel

Die ToolBox soll sich wie **ein Werkzeug mit mehreren Arbeitsschritten** anfühlen, nicht wie mehrere historische Labs in einem Browserfenster.

### Gemeinsame Shell

Beibehalten / stärken:

- `Select`
- `Shape & Look`
- `Attach & Fit`
- `Motion & Talk`
- `Export`

Die Bühne bleibt möglichst stabil. Inspector und Tools wechseln mit der Aufgabe, nicht die gesamte App.

### Grundprinzipien

- eine Auswahlquelle für Actors;
- ein sichtbarer Source-/Contract-/Draft-Status;
- direkte räumliche Rückmeldung auf der Bühne;
- progressive disclosure statt 100 Regler gleichzeitig;
- sinnvolle Presets + genaue Zahlenfelder;
- keine wichtige Funktion nur über Hover;
- `in sync / unsaved / saved` immer klar;
- Reset/Revert pro sinnvoller Einheit;
- kein stiller Datenverlust;
- keine doppelten Reader, Mixer oder Materialwahrheiten.

## 6 · UI-Kritik zuerst

Vor dem Rework einen kurzen, konkreten Critique-Report erstellen.

### Prüfe mindestens

- Informationsarchitektur und Schrittfolge;
- visuelle Hierarchie;
- Actor-/Draft-/Source-Verständlichkeit;
- Material-/Zone-Workflow;
- Colorpicker / Hex / Copy / Reset;
- Motion-Casting und Clip-Binding als realen Workflow;
- Talk/Idle/Rest;
- Attach/Fit / Seat / CardRider nur soweit real vorhanden;
- Export: Profil vs. Consumer Package vs. Preview vs. Video klar unterscheiden;
- Responsive und Fenstergrößen;
- Keyboard/Fokus;
- Loading / Fehler / unsupported fields;
- Rückkehr aus Detailmodus in stabile Arbeitsansicht.

### Output der Kritik

Maximal 10 priorisierte Probleme. Je Problem:

`Observed evidence → user cost → smallest useful repair → owner (UI / Rig / Material / Contract)`

Keine generischen Aussagen wie `make it cleaner` oder `make it more polished`.

## 7 · Konkrete Rework-Anforderungen

### 7.1 Color / Material Zones

Für eine gewählte Zone soll die Oberfläche mindestens bieten:

- klarer Zonenname;
- aktuelle Farbe als sichtbares `#RRGGBB`;
- `Copy #hex`;
- editierbares Hexfeld mit Validation;
- kuratierte Palette;
- `Original / Reset`;
- `Hide` nur wo Contract/Reader es trägt;
- Bühne hebt die aktive Zone sichtbar hervor;
- Colorpicker schließt auf **click outside** und **Esc**;
- kein Modal-Zwang für einfache Farbarbeit;
- Texture/Surface-Auswahl nur über den bestehenden Material-/Surface-Owner; keinen zweiten Shader-/Texture-Contract erfinden.

### 7.2 Textures je Materialzone

Designseitig eine skalierbare UI dafür vorsehen, aber Implementation nur dort anschließen, wo ein realer Material-Griff existiert.

Bevorzugter UX-Ansatz:

`Zone → Base Color → Surface/Texture → Roughness/Relief nur wenn unterstützt`

Unsupported Felder müssen sichtbar `unsupported/not connected` sein, nicht wirkungslos aussehen.

### 7.3 Brows / Tapering

- Controls nur dann als `working` darstellen, wenn visuelle Wirkung im echten Actor reproduzierbar ist.
- Vorher/Nachher-Nahansicht oder Brow-Camera-Preset verwenden.
- Tapering nicht nur über gespeicherten Zahlenwert abnehmen; Formwirkung prüfen.
- Falls Reader/Rig defekt: UI zeigt Status und liefert präzisen Repair-Handoff an den Owner.

### 7.4 Motion Casting

Birthday-Consumer als Workflow-Fall aufnehmen:

`Actor → Rig family → state slot → candidate clip → binding coverage → preview → accept/reject`

Für einen State reichen wenige Kandidaten. Keine Motion-Masse als Designziel.

### 7.5 Living authoring UI

Auch ein Tool darf unmittelbares Feedback haben:

- kleine, schnelle in-place Reaktionen;
- State-/Save-Feedback am Ort der Aktion;
- Stage-Kamera weich zwischen taskbezogenen Presets;
- keine langen leeren Transitions;
- kein Animation-Overload.

## 8 · Responsive / Site readiness

Ziel ist desktop-first Authoring, aber die Shell muss robust skalieren.

Prüfgrößen:

- 1440×900
- 1024×768
- 768×1024
- 390×844

Für schmale Breiten bevorzugt Drawer/Stacking statt drei zusammengequetschter Spalten.

**Site direction:** später z. B. `/toolbox/` als WIP. Noch kein eigener SSOT. Published build muss reproduzierbar aus dem geprüften Quellstand entstehen.

## 9 · Optionaler Desktop-Design-GitHub-Workflow

Wenn Desktop Design GitHub schreiben kann:

**bevorzugt:** eigener Design-Branch / PR.  
Nicht still direkt `main` überschreiben.

Wenn Branching nicht geht:

`tools/KFB-ToolBox/_inbox/design-current/`

als Intake-Pfad verwenden; danach WSA/ToolBox prüft und promotet.

## 10 · QA / Acceptance

Vor `UI PASS` mindestens:

- kompletter Carl-Workflow ohne Toolwechsel;
- kompletter Graft/Birthday-Casting-Workflow als Gegenprobe;
- Colorpicker click-outside + Esc + Hex-Copy;
- eine Materialzone Farbe ändern und exakt diese Zone sehen;
- Texture/Surface nur dort anwenden, wo Consumer es wirklich liest;
- Brow/Tapering Status ehrlich dokumentiert;
- Save/Revert verständlich;
- vier Viewports;
- Keyboard/Fokus-Basics;
- unabhängiger Export/Import- oder Embed-Roundtrip für einen kleinen Profilfall;
- keine neuen fatalen Console Errors.

`UI PASS` ist nicht `Rig PASS` und nicht Georg Acceptance.

## 11 · Return Contract

Liefere:

1. `CRITIQUE.md` — priorisierte Findings.
2. Rework-Datei/Branch/Commit.
3. Screenshots der vier Viewports.
4. kurzer Flow-Beleg für:
   - Actor wählen;
   - Zone färben / Hex kopieren;
   - Motion-State casten;
   - Export/Return.
5. getrennte Statusliste:
   - UI fixed/tested;
   - Rig defect open;
   - Material/Contract open;
   - Deferred.
6. exakte GitHub-Revision und ggf. Vorschau-URL.

## 12 · Startprompt

> Read `tools/KFB-ToolBox/_handover/UI_CRITIQUE_REWORK_WS0_2026-09-15/START_HERE.md` and the linked real Pilot/WSA evidence. Do **not** rebuild ToolBox A. First produce an evidence-based critique of the current ToolBox Pilot and the actual Carl/Graft workflow. Then rework the shared shell `Select → Shape & Look → Attach & Fit → Motion & Talk → Export`. Treat Georg's reports about broken Carl brows/tapering, material-zone texture access and broken Colorpicker/hex/outside-click behavior as defects to verify, not as solved facts. Keep UI, Rig and Material ownership separate. Use the Birthday actor-casting return as a real workflow test. Measure the four target viewports, close the small independent roundtrip, and return exact evidence. If Desktop Design can push GitHub, use a branch/PR where possible; do not silently replace main or existing contracts.

## 13 · Status

- **DECISION:** UI critique first, then one coherent rework shell.
- **DECISION:** ToolBox may become a published Site later, but source truth remains the existing ToolBox/WS0 path.
- **USER-REPORTED:** brows/tapering/colorpicker/material-zone texture problems need verification.
- **IMPLEMENTATION:** no UI changes by this briefing.
- **TESTED RESULT:** existing A/B and Birthday consumer evidence only; new rework not tested yet.
