# HOUSEKEEPING — KFB Travel v20 (main) + Satelliten (living document)

> **Einstieg ist NICHT diese Datei.** Sie hat über 3000 Zeilen und ist ein Nachschlagewerk: erst
> suchen, wenn eine konkrete Frage da ist. Ein frischer Chat liest **`START_HIER.md`** (Regeln),
> **`PROJEKTE.md`** (welche Linie lebt, wo ihr Code liegt) und **`MODULE.md`** (was schon existiert
> und nicht neu gebaut werden muss). Angelegt am 10.09.2026, weil die Chronik als Einstieg das
> Kontextfenster verbraucht, bevor etwas gebaut ist.

Zweck: EINE Quelle für Aufräum-Entscheidungen und Clean-Runs in **diesem** Workspace. Nichts wird
ohne Freigabe gelöscht. Die Status-Spalte ist die Wahrheit, nicht das Datum.

Legende: **AKTIV** (weiterbauen) · **FROZEN** (Referenz, nicht anfassen) · **SUPERSEDED** (ersetzt,
archivierbar) · **EXPERIMENT** (Wert offen) · **DEAD** (löschbar nach Sign-off) · **ASSET** (Binär).

**Die Rollenverteilung seit 2026-08-12:** `KFB Travel v16.dc.html` ist **main** der Travel-Linie
(§4x, Landschaft); v15 (§4w, Flug-Sprint) und v14 sind Vergleichsmaßstab und FROZEN.
Die drei cut-v4-Werkzeuge sind **Autoren-Werkzeuge**, kein zweites Spiel. Zwischen beiden steht
**ein Vertrag: `zone-registry.json` + `zone-index.json` an der Wurzel.** Wer die schreibt, ändert

---

## 00-v25 · Travel Combat v25 — Nachtrag 2026-09-09 · Export-Paket · edge3-Pfad · v26 geplant

**Sitzungsstand 09.09.** Renn-Bob neu getunt und Combat-Pool entgiftet (Naht 179), `edge3.jpg` auf
den Pfad gedreht, der wirklich antwortet (v25.2s), und die Sitzung als Paket abgelegt.

| Artefakt | Rolle | Status |
|---|---|---|
| `export-v25/` | Codebasis (69 Dateien) + Doku + drei neue Dokumente, als Download | **AKTIV** |
| `docs/travel-v25/IST_v25.md` | **living document** — was gerade wahr ist: Zustände, Zahlen, Pfade | **AKTIV, maßgeblich** |
| `docs/travel-v25/SPRINT_v26.md` | v26-Planung. §0 ist die einzige blockierende Frage (Sky-Karten-Deck) | **AKTIV** |
| `docs/travel-v25/ONBOARDING_v26_frischer-Chat.md` | Einstieg für neue Sitzungen ohne Vorgeschichte | **AKTIV** |
| `docs/travel-v25/SPRINT_v25.md` | Sprint abgeschlossen, Clean-Run §4 bleibt maßgeblich | **FROZEN** |
| `docs/travel-v25/PLAN_einbau-v11-…md` | Einbau erfolgt | **SUPERSEDED** |
| `terrain-v25/voxel-glyphs.js` | hatte als einziges der drei Textur-Module **keinen** RAW-Rückfall | **AKTIV** |
| `uploads/kfb-asset-library (N).json` | Altkopien | **löschbar**, sobald Repo-Fassung bestätigt |

**Was diese Sitzung gekostet hat und warum.** Drei abgebrochene Antworten beim Versuch, den
Standalone zu bauen — jedes Mal, weil ~70 Module in **eine** Antwort inlined werden sollten. Das
Ausgabelimit reißt mittendrin, und der Abbruch hinterlässt nichts Verwertbares. Der Weg, der
funktioniert: Dateien per Skript schreiben, nicht Code in den Chat schreiben. Post-mortem und
Bauplan für den Standalone stehen in `docs/travel-v25/POSTMORTEM_standalone.md`.

---

## 00-v25a · Travel Combat v25 (2026-09-05, abends) — v11-Slice eingebaut · Mündung · Augapfel · Maßstab

**Fork aus v24.** Stand: Mündungsblitz vor der Silhouette, Augapfel als Sekundärwaffe mit gemessener
Drosselung, Spieler endlich größer als die Gegner, Kapselprobe als Instrument, Schrittmaß gelesen
(nicht angewandt). Fahrplan war der mitgelieferte `PLAN_einbau-v11-in-travel-combat-v24.md`.
Doku in `docs/travel-v25/`.

| Artefakt | Rolle | Status |
|---|---|---|
| `KFB Travel Combat v25.dc.html` + `terrain-v25/` (66 Dateien) | **der Arbeitsstand** der Travel-Linie | **AKTIV** — main |
| `KFB Travel Combat v24.dc.html` + `terrain-v24/` | Fork-Basis, Vergleichsmaßstab | **FROZEN seit 2026-09-05** — nicht weiterbauen, nicht löschen |
| `terrain-v25/mech-avatar.js` | Mech 2,00 → **3,20 u** (gegen den Gegner-Roster gerechnet) · `muendung(out, dir)` mit gemessenem Körperradius | **AKTIV** |
| `terrain-v25/combat-host.js` | Waffenraum des Wirts (`WAFFEN`), Sekundär umstellbar, Augapfel verdrahtet, `kapselprobe()`, `groessen()`, Tor 19 Zeilen | **AKTIV** |
| `terrain-v25/combat-shots.js` | `fire()` nimmt `mesh`/`spur`/`huepfer`; Zellabbildung für die Kit-Module; `spielerR` 1,3 → 1,66 | **AKTIV** |
| `terrain-v25/pet-kinetics.js` | liest `schrittmass.json`, wendet es NICHT an (Schalter + `?stride=gemessen`) | **AKTIV** |
| `modules/kfb-hit-response.js` · `kfb-combat-cues.js` | **aktualisiert aus dem v11-Slice**, API additiv — v24 liest sie mit und sieht anders aus (Stauchachse, HOLD, `knockScale` 0,9) | **AKTIV · GETEILT** |
| `modules/kfb-weapon-eyeball.js` + `studio-v3/pet-eye-rig.v5.js` | die Augapfel-Waffe und ihr Rezept. **Harte Abhängigkeit** — ohne das Rig fällt die Waffe ganz aus (Bootzeile sagt es) | **AKTIV · GETEILT** |
| `modules/kfb-weapon-dice.js` | der Würfelwurf (Georg geliefert 5.9.). GLB mit gemessenem Augen-Kontrast, Ersatzwürfel bei 404 | **AKTIV · GETEILT** |
| `terrain-v25/prop-scatter.js` (**ps-v1.4**) | **38 Modelle** (war 26), 57 Draw-Calls · Höhen-Band als zweite Einpass-Bedingung · `h` je Modell · Felsstufen mit Grasplateau · Gras als Kombo | **AKTIV** |
| `schrittmass.json` (Wurzel) + `modules/kfb-stride-measure.js` | 41 Messungen (23 Pets mit Schritt, 18 ohne Beine) + das Werkzeug | **AKTIV** |
| `docs/travel-v25/SPRINT_v25.md` · `CHANGELOG_v25.md` · `PLAN_einbau-v11-…md` | Sprint mit allen Zahlen · Nähte 124–131 · der Fahrplan im Wortlaut | **AKTIV, maßgeblich** |

**Die drei Zahlen, die diese Sitzung erzeugt hat.** (1) Der Mech war **2,00 u gegen 2,72 u** —
Georgs Eindruck war der Roster, nicht sein Auge. (2) Die Kapselprobe kam mit **0/10** heraus, und die
naheliegende Lesart war falsch: ein Bogenwurf trägt `v²/g`, also 26,2 u, das Ziel stand auf 148 u.
Nach der Tempo-Korrektur (Wirt-Wert 34 u/s) **5/10**. (3) Die Drosselung aus dem Plan reichte nicht:
**1718 Spurpuffe bei 10 Würfen, Pool 905× voll** — der Plan hatte mit der Schussbahn gerechnet
(0,62 s Flugzeit statt 3,2 s). Mit 0,9 u Abstand und 0,28 s Leben: 0 Ausfälle. **Der Pool ist nicht
vergrößert worden.**

**Regeln, die v25 dazugelernt hat:** (1) *Eine Null mit zwei möglichen Ursachen ist keine Messung* —
die Probe muß die Reichweite mitnennen, sonst liest man einen Reichweitenfehler als Hitbox-Fehler.
(2) *Eine gerechnete Drosselung gilt für den Wirt, in dem sie gerechnet wurde* — dieselbe Zahl war
auf der Schussbahn richtig und hier um Faktor 5 falsch. (3) *Der Hebel ist die Lebensdauer, nicht der
Abstand*: gleichzeitig lebende Sprites = `Leben × Tempo / Abstand`, und der Abstand kostet die
Lesbarkeit der Spur. (4) *Dieselbe Waffe darf in zwei Wirten zwei Tempi haben* — ein Wirt-Wert, keine
zweite Fassung im Modul. (5) *Ein Maßstab ist ein Verhältnis*, also gehört er in ein Tor, das gegen
den Pool rechnet, und nicht in eine Voreinstellung.

**Offen, und zwar für Georg:** die Nachprüfung der Trefferreaktion (sichtbare Änderung aus dem
v11-Modul) · die Schrittmaß-Entscheidung (rutschen ODER strampeln ODER Lauftempo senken, Faktor
×7,24 — das Panel zeigt Kadenz und Fußrutsch jetzt live) · die Pool-Messung nach `kreisLeben 0,28`
(gerechnet, noch nicht gemessen) · **fps @1080p bei 57 Draw-Calls** (das Prop-Set ist von 26 auf 38
Modelle gewachsen).

**Der vierte Befund dieser Sitzung — und er ist der billigste:** Georg sah „alles wie in v24", weil
in der Adresszeile `?file=KFB+Travel+Combat+v24.dc.html` stand. Ein Fork erzeugt eine zweite Datei,
nicht eine neue Ansicht derselben. Steht hier, weil es beim nächsten Fork wieder passieren wird.

**Clean-Run v25:** siehe `docs/travel-v25/SPRINT_v25.md` §4. Kurz: `combat.tor()` = 19/19 nach einer
Kapselprobe, `combat.groessen().faktor` = 1,18, `combat.shots.zaehler.poolVoll` = 0.
**Für die Kapselprobe erst Aggro auslösen** — ein Ziel am Horizont (110–190 u) liegt außerhalb jeder
Wurfbahn, und die Probe sagt das dann auch.

---

## 00-v24 · Travel Combat v24 (2026-09-05, Nacht) — Kampf-Slice + Licht + Schatten + Props

**Eingecheckt 2026-09-05.** Stand: Mech-Kampf mit 20 Gegner-Arten, gemessenes Lichtbudget, echter
Sonnenschatten, 26 Prop-Modelle mit Cluster und Gummibaum-Deformer, Kartenrückseite als einziger
Platzhalter. Doku in `docs/travel-v24/`. Export: `export/travel-combat-v24_2026-09-05/`.

| Artefakt | Rolle | Status |
|---|---|---|
| `KFB Travel Combat v24.dc.html` + `terrain-v24/` | Fork-Basis für v25, Vergleichsmaßstab | **FROZEN seit 2026-09-05** (siehe §00-v25) |
| `terrain-v24/light-budget.js` | **neu** · EIN Ort für die Helligkeit: vier Pfade, ein Tor (4/4). Auch die Abnahme abgetasteter Paletten (`palettePruefung`) | **AKTIV** |
| `terrain-v24/card-backside.js` | **neu** · die kanonische Rückseite für ALLE drei Kartenmaler. Hängt an nichts (Zyklus-Vermeidung) | **AKTIV · GETEILT** |
| `terrain-v24/prop-scatter.js` (**ps-v1.3**) | 26 Modelle, Cluster (rule of three), Tint 0,85, Nebel, Tiefenmaterial für den Schattenwurf, Gummibaum-Deformer | **AKTIV** |
| `terrain-v24/voxel-terrain.js` | Sonnenschatten-EMPFÄNGER (rohes ShaderMaterial liest die Karte selbst), `kfbBeweg`, Nebel-Uniforms geteilt | **AKTIV** |
| `terrain-v24/sky-mobs.js` | 20 Flieger, Clip-Rollen zur Laufzeit gemessen, gemischte 3er-Mobs, Horizont-Spawn | **AKTIV** |
| `terrain-v24/pack-discover.js` | Brücke zum KayKit-Pack, als die Library fehlte | **DEAD — gelöscht 2026-09-05** |
| `kfb-asset-library.json` (Wurzel, 4,3 MB, 10 509 Assets) | die neue Laufzeit-Wahrheit über ladbare Assets | **ASSET · AKTIV** — nicht in den Export (Budget 2 MB), gehört per RAW-URL geladen |
| `asset-repo.json` (Wurzel, 328 kB) | Rückweg der Ladekette; wird von `globe-v9`/`globe-v12` weiter gelesen | **AKTIV · GETEILT** — nicht als tot einstufen |
| `themes/kfb-shell.css` | Wortmarke ohne Cremeplatte, Meta unten links auf Hover | **AKTIV · GETEILT** (DC + index.html) |
| `modules/kfb-combat-def.js` | Kampf-Quelle; Notiz zur Messung der 17 Monster-Clips ergänzt | **AKTIV · GETEILT** |
| `docs/travel-v24/IST_v24.md` · `CHANGELOG_v24.md` · `HANDOVER_v25.md` | Ist-Stand · Verlauf · Onboarding für v25 | **AKTIV, maßgeblich** |
| `github.md` | Repo-Bindung, Sync-Quittung, **und die Werkzeug-Falle** (Baumsuche zeigt keine 3D-Modelle) | **AKTIV** |
| v20-Stand der Travel-Linie | Vergleichsmaßstab; `?combat=0` zeigt ihn im laufenden v24 | **SUPERSEDED** |

**Aufräum-Kandidaten (nicht ausgeführt):** `uploads/kfb-asset-library (1).json` und
`uploads/kfb-asset-library.json` (ältere Fassungen der Library) · ältere Feedback-Screenshots in
`uploads/` vor dem 2026-09-04. Die Screenshots dieser Sitzung sind nach Freigabe gelöscht.

**Clean-Run v24:** DC öffnen → Konsole zeigt `[props] Index: 10509 Assets`, `[weltwuerfel]`,
`[mobs] Pool vollständig: 20 Arten` und KEINE `[boot-error]`. Dann:
`window.__travelPOC.budget.tor()` = 4/4 · `combat.tor()` = 5/5 · `props.report().drawCalls` = 45 ·
`terrain.sunShadow.an` = true (nach dem ersten Bild).

---

## 00-v13 · Travel Globe v13 (2026-09-03, abends) — Zweig aus v12 · Ziel: TS-Delta Stufe A/B

**Eingecheckt 2026-09-03 (spät).** Stand dieser Sitzung: Contrails als Comic-Speedlines, drei
Kamera-Voreinstellungen gegen `CameraRig.ts` gemessen, Cartoon-Trägheit für das Pet, Tuschehaken
gestrichen. Der Export liegt in `export/kfb-travel-globe-v13_2026-09-03/`.

| Artefakt | Rolle | Status |
|---|---|---|
| `KFB Travel Globe v13.dc.html` + `globe-v13/` (90 Dateien) | **der Arbeitsstand** · 1:1-Kopie von v12 + `contrails.js` + `pet-traegheit.js`; geändert: `intro-flight.js` (Standbild vor dem Anflug), `karten-teppich.js` (Haken gestrichen), `globe-poc.js` (Verdrahtung, Kamera-Voreinstellungen, Versionsbezeichner) | **AKTIV** — main der Globe-Linie |
| `globe-v13/contrails.js` | Comic-Speedlines an der gezeichneten Karte. Panel „Speedline gate (v13)", `?contrails=0`. **Vier deklarierte Abweichungen** von `Contrails.ts` | **AKTIV** |
| `globe-v13/pet-traegheit.js` | Antrieb für die Cartoon-Verformung, Verformung im Wurzelraum (hängt die Figur NICHT um — sonst stirbt das Augen-Rig). Panel „Cartoon inertia gate" | **AKTIV** |
| `kfb-cartoon-deform.js` (Wurzel) | der Requisiten-Verbieger, unverändert. `pet-traegheit.js` nutzt nur `segmentsAlongY` daraus | **AKTIV · GETEILT** (Requisiten anderer Zweige lesen ihn) |
| `globe-v12/karten-teppich.js` | war heute die **Wiederherstellungsquelle**, nachdem ein Skript die v13-Fassung zerlegt hatte | **FROZEN — und genau deshalb wertvoll** |
| `docs/SPRINTPLAN_v14_frischer-Chat.md` | Übergabe an den nächsten Chat: Reihenfolge S0–S5, Q&A-Regeln, acht Entscheidungen, Post Mortems | **AKTIV, maßgeblich** |
| `docs/CHANGELOG_v13.md` | additiver Stand dieser Sitzung inkl. der verlassenen Quellenwerte | **AKTIV** |
| `docs/TS-DELTA-v12.md` | Plan: Stufe A (Contrails erledigt · Fireflies · Laternen · Vögel) → B → C · offene Baustellen §3 · Arbeitsregeln §4 | **AKTIV, maßgeblich** |
| `docs/ONBOARDING_v13_frischer-Chat.md` · `docs/CHANGELOG_v12.md` | Übergabe des Vorgängers | **AKTIV** |
| `export/kfb-travel-globe-v13_2026-09-03/` | Manifest-Export dieser Sitzung: Standalone-HTML (2,5 MB, **geladen, an der laufenden Welt gemessen und angesehen**: 110 fps, 37 Szenenknoten, Seed 326049440, `__KFB_BUNDLE.ok === true`, 0 Boot-Fehler, kein Quelltext im sichtbaren Text) + README. Direkt zusammengesetzt, **ohne Bündler-Durchgang** — Begründung im README. **Build — nie hier editieren** | **EXPORT-Stand** |

**Regeln, die v13 dazugelernt hat:** (1) Frag das Objekt nach seinen Maßen — zwei Fassungen der
Speedlines rechneten mit `carpet-mesh.js`, gezeichnet wird der CardCarrier. (2) Jedes Tor nennt eine
Zahl, die falsch werden kann; ein Tor, das eine Absicht prüft, übersieht eine Zuweisung, die im
Kommentar gelandet ist. (3) Wer Bewegung meint, muss Bewegung messen und nicht Ausnutzung des
Spielraums — `speedRatio` ist auf dem Tempoboden null. (4) Ein Effekt, der nicht mehr rechnet, hört
damit nicht auf zu erscheinen. (5) Eine Änderung, die verändert, was Georg sieht, ist niemals eine
Routineentscheidung. (6) Ein Werkzeug für Requisiten ist keins für Figuren — Requisiten haben keine
Hierarchie, die etwas bedeutet. (7) **Ein Bündel ist erst fertig, wenn es geladen wurde, nicht wenn
es geschrieben wurde** — zwei Fassungen des Standalone waren tot, und beide Male behaupteten vier
Dokumente schon das Gegenteil. Erst ein Ein-Blob-Bündel (Blob-URL ist keine hierarchische Basis, 87
relative Spezifizierer scheitern beim Parsen), dann eine Blob-Kette, die der Bündler zerschrieb
(camelCase auf kebab-case, 1616 Vorkommen, nur 6 von 87 Modulen parsten). Der Export wird jetzt
direkt zusammengesetzt, Nutzlast base64. Das Muster der Blob-Kette steht seit dem Pet-Studio-Zweig
in `endless/original-loader.js`. (8) **Ein Prüfgriff, der die falsche Frage stellt, ist ein grünes
Licht ohne Leitung** — „87 Module, 2 Canvas, 0 Boot-Fehler" war dreimal wahr und dreimal
nichtssagend, und gefragt wurde nach `__GLOBE` statt `__globe`. (9) **Beim Einbetten von Quelltext
in HTML zählen BEIDE Tag-Sequenzen** — `support.js` führt `<script` in einem String-Literal, das
schaltet den Tokenizer um, das folgende `</script>` schließt nicht mehr, und 1,3 kB Laufzeitquelle
standen sichtbar auf der Seite. Base64 für alles Eingebettete, plus eine Paarigkeitsprobe im Build.
(10) **Bild UND Zahl, nicht statt** — die dritte Exportfassung lief mit echten Zahlen und sah
kaputt aus, weil niemand hingesehen hatte.

**Freigabe fehlt:** nichts. **Gelöscht:** `_zwischenstand.dc.html` im Export (Bauzwischenschritt, nach dem Umbau auf Direktbau gegenstandslos).

### Export-Manifest v13 (2026-09-03, Georgs Okay liegt vor)

| Gruppe | Inhalt |
|---|---|
| **(a) Deliverables** | `KFB Travel Globe v13.dc.html` + `globe-v13/` (90 Dateien) |
| **(b) Contract- und Daten-Dateien** | keine geändert |
| **(c) Docs** | `docs/CHANGELOG_v13.md` · `docs/SPRINTPLAN_v14_frischer-Chat.md` · `docs/TS-DELTA-v12.md` · `HOUSEKEEPING.md` · `github.md` |
| **(d) Abnahme-Captures** | keine neuen. Georgs Feedback-Bild bleibt in `uploads/` und gehört nicht in den Export |
| **Build** | `export/kfb-travel-globe-v13_2026-09-03/` — Standalone (2,5 MB) + README |

### Clean-Run-Checkliste v13 (Stand 2026-09-03, am Export abgehakt)

- [x] DC-Quelle bootet ohne Konsolenfehler (`__bootErrors` leer, 2 Canvas).
- [x] Standalone bootet: `__KFB_BUNDLE.ok === true` — **nicht** `module === 87`, das belegt nur, dass die Quellen daliegen.
- [x] `typeof window.__globe === 'object'` (klein geschrieben) und die Welt läuft: 110 fps, 37 Szenenknoten, Seed 326049440.
- [x] **Auf die Seite gesehen:** `/dc-runtime|DCLogic/.test(document.body.innerText) === false`, im sichtbaren Text nur UI.
- [x] Kein Zweitstart (`[globe] Zweitstart verhindert` bleibt aus).
- [x] `<script` und `</script>` außerhalb der Base64-Nutzlast paarig (der Build bricht sonst ab).
- [x] Nutzlast unversehrt: `maxAmplitude` in `simplex-noise.js` intakt, `sc-camel-` nur zweimal in `support.js`, wo es hingehört.
- [ ] In **Firefox** geöffnet — offen, bisher nur Chromium geprüft.
- [ ] Standalone **einzeln** (ohne Nachbardateien) vom Desktop geöffnet — offen, bisher nur im Vorschaurahmen.
- [ ] Speedline-Tor und Karten-Tor im Panel gegen die DC-Quelle verglichen — offen.

**Aufräum-Kandidaten (benannt, NICHT ausgeführt):**

| Kandidat | Empfehlung |
|---|---|
| `globe-v11/` + `KFB Travel Globe v11.dc.html` | zwei Generationen zurück, FROZEN. Nach Sign-off archivieren — aber erst, wenn v13 abgenommen ist. Heute hat eine eingefrorene Vorgängerversion eine zerlegte Datei gerettet |
| `uploads/Bildschirmfoto 2026-09-03 um 19.45.39.png` | Feedback-Bild, verarbeitet (Befund S4a). Gehört nicht in den Export |
| `uploads/KFB_Frankensteining_Lab (1).html` · `uploads/KFB_Prompt_Lab.md` · `uploads/GRUENDUNGSDOKUMENT_*.md` · `uploads/HANDOVER_Cowork_*.md` | Referenz, nicht Build. Bleiben liegen, nicht exportieren |
| `KFB Mech Slice v7` (gemounteter Ordner) | nur zur Information angehängt. v10 baut gerade seine SFX, der Export kommt später |

## 00-v12 · Travel Globe v12 (2./3.9.2026) — FROZEN seit 2026-09-03 (abends) · Vegetation gebaut · Münzen · Schweben · Sperrzonen

| Artefakt | Rolle | Status |
|---|---|---|
| `KFB Travel Globe v12.dc.html` + `globe-v12/` (88 Dateien) | Vorgänger, Referenz. Neu: `ts-flora.js` · `muenzen.js`; geändert: 14 Module (Liste in `docs/CHANGELOG_v12.md`) | **FROZEN seit 2026-09-03 (abends)** — nicht anfassen, nicht löschen |
| `KFB Travel Globe v11.dc.html` + `globe-v11/` | Vor-Vorgänger | **FROZEN seit 2026-09-03** (war AKTIV bis zum v12-Zweig) |
| `KFB Flora-Prüfstand v11.dc.html` | liest `globe-v11/flora.js` — für v12/v13 nicht nachgezogen (Kits sind dort nur noch Kombi-Module) | AKTIV — Instrument, v11-Stand |

**Regeln, die v12 dazugelernt hat:** (1) Größe und Farbe sind Eigenschaften der Nachbarschaft — die Fels-Ausnahme ×1,75 und der Rauswurf der grau-braunen Bauten haben denselben Grund: gebaute Vegetation mit AO/Saum/Wind steht jetzt daneben. (2) Einen Eintrag aus einem gewichteten Satz zu nehmen verteilt seine Plätze um — leere Plätze lassen, nicht nachrücken. (3) Gegner kennen das Gelände, nicht die Props — Vulkane sind Sperrzonen, Türme/Portale/Landmarken NICHT (offen, §3.4 TS-DELTA). (4) Ein falscher Kommentar wird entfernt, nicht korrigiert.

**Freigabe fehlt:** nichts. **Gelöscht:** nichts.

---

## 00-v11 · Travel Globe v11 (2026-09-02, abends) — Assets · Streuung vereint · Wetter

| Artefakt | Rolle | Status |
|---|---|---|
| `KFB Travel Globe v11.dc.html` + `globe-v11/` (84 Module + 3 JSON) | ~~der Arbeitsstand~~ → Referenz · Flora (7 Familien) · Belegung + Familien-Abstand-Tor · 56 Terrain-Karten (Land + Wasser) mit Sky-Card je Karte · Portale/Gegner auf `streuen` · Regen 1:1 (RainOverlay.ts) · fogScale | **FROZEN seit 2026-09-03** (siehe §00-v12) |
| `KFB Flora-Prüfstand v11.dc.html` + `globe-v11/flora-pruefstand.js` | Screenshot-Beweise VOR dem Einbau; lädt `flora.js`/`formation.js` der Welt, keine Kopie | **AKTIV — Instrument** |
| `globe-v11/flora.js` · `formation.js` · `rain-overlay.js` · `flora-auswahl.json` | neu in v11 (Kopf jeder Datei nennt Quelle und Nähte) | **AKTIV** |
| `globe-v11/verteilung.js` | + `createBelegung` (Eintragsreihenfolge ist Vertrag) + `familienAbstandTor` | **AKTIV · GETEILT** (Flora, Felsen, Karten, Portale, Gegner lesen sie) |
| `docs/evidence/v11-*.png` (22 Bilder) | Beweise: Reihen je Familie, Formationen, VORHER/NACHHER Familien-Tor, Palmen von unten, Regen | ASSET (klein, behalten) |
| `docs/CHANGELOG_v11.md` · `OFFENE_SLICES_v11.md` · `ONBOARDING_v12_frischer-Chat.md` | Übergabe | **AKTIV, maßgeblich** |
| `KFB Travel Globe v10.dc.html` + `globe-v10/` | Vorgänger, Referenz | **FROZEN seit 2026-09-02 (abends)** |

**Regeln, die v11 dazugelernt hat:** (1) Sichtbarkeitsboden je FAMILIE (Median, Verhältnisse erhalten, Deckel 0,6 Bäume) — der Einzel-Boden aus v10 plättete die Größenleiter. (2) Jede sync gebaute Familie trägt sich in die Belegung ein, BEVOR die asynchronen (Felsen, Flora) bauen — sonst ist dieselbe Welt nicht dieselbe Welt. (3) three-Signaturen prüfen, bevor ein 1:1-Port läuft (`copyFramebufferToTexture` r160 ≠ r165).

**Freigabe fehlt:** nichts. **Gelöscht:** nur Debug-Probebilder aus `docs/evidence/`.

die Welt; wer sie liest, zeigt sie. Diese Naht nicht verwischen.

---

## 00-v9. Travel **Globe v9** — AKTIV seit 2026-09-01 (spät) · Zweig aus v8 · Maßstab + Wasser

> **Georgs zwei Befunde am Bild, beide gemessen statt gedeutet.** v8 wird eingecheckt und
> eingefroren (Eintrag unten unverändert); v9 ist die vollständige Kopie mit zwei Reparaturen.

| Artefakt | Status | Notiz |
|---|---|---|
| `KFB Travel Globe v9.dc.html` + `globe-v9/` | **AKTIV** — main der Globe-Linie · **eingecheckt 2026-09-02** | 1:1-Kopie von v8, dann 13 Eingriffe (Punkte 1–13), jeder mit Panel-Tor |
| `export/v9-checkin/` | **ASSET** · Check-in dieser Session | Deliverables + `docs/` + Standalone. Kein Voll-Projekt-Zip (session-export §4) |
| **Neu in v9:** `sun-shadow.js` · `lens-flare.js` · `avatar-lamp.js` · `verteilung.js` · `natur-marken.js` · `boden-lesung.js` | **AKTIV** | Sechs neue Module, alle mit Tor |
| `globe-v9/boden-lesung.js` | **AKTIV** · **GETEILT** | Mech, Türme, Leuchttürme und Bodenschein lesen sie. Nicht als tot einstufen |
| `globe-v9/verteilung.js` | **AKTIV** · **GETEILT** | Streuungsschicht: `planSites`, Vulkane, Leuchttürme. Nächste Leser: KayKit-Props, Glühwürmchen |
| `KFB Travel Globe v8.dc.html` + `globe-v8/` | **FROZEN** seit 2026-09-01 (spät) | Der Mech-Einbau-Zweig. Nicht anfassen, nicht löschen |

**1 · Mech-Maßstab (Georg: „scheinen etwas zu groß, um als Fahrzeug zu funktionieren").**
v8 skalierte gegen die Figurhöhe „~0,15 u" — die ist aber eine MESSGRÖSSE aus `walk-messung.js`
(Bodenfehler, Horizont) und nicht das, was man sieht. Gezeichnet wird die Karte:
`CARD_WELT = 0.075` u. Der v8-Mech stand damit auf **4,27 Kartenbreiten**. Jetzt ist `hoehe`
ABGELEITET (`bezug × faktor`, Voreinstellung 1,3× = 0,098 u), der Regler heißt „Mech size
(× the drawn card)", und das Stationstor nennt den Faktor im Klartext.

**2 · Wasser & Küstenlinien (Georg: „immer noch anders & gröber als im Original").**
Der Shader ist zeichengleich mit `tinyskies/Globe.ts` — bis auf EINE Zeile, und die war tot:
`shallowness = smoothstep(0.1, 0.22, vColor.r)`. Die Quelle legt sRGB-ZAHLEN in den Vertexpuffer
(0x2a8ca0 → r 0,165), wir backen dieselben Farben durch `new THREE.Color()`, also LINEAR
(r 0,023) — **beide Werte unter der Schwelle, `shallowness` klemmte auf 0 in jeder Stimmung.**
Folge: offener Schaum mit 5 % statt 57 % Verstärkung, Glitzerschwelle 0,70 statt 0,48 — die feine
Hälfte des Vorbilds fehlte, übrig blieben große Flecken plus starker Küstensaum. Reparatur aus den
DATEN mit der nachgerechneten Kurve der Quelle (`u = 0,539 − 0,686·Tiefe`), also farbraum- und
stimmungsunabhängig. Neu: `glanzTor()` (die Zahl) + Regler „Shallow-water structure" (0 = der
v8-Zustand, 1 = Quellenkurve). **Nicht geändert:** die goldene Schaumfarbe am Abend — die ist
belegt als Absicht (`sky-presets.js` §Schaumfarbe, Quelle 0xff9944 → KFB-Gold).

**3 · Fußlesung am gebackenen Netz (die v8-Schuld, bezahlt).** `surfaceAltitudeAt` ist laut
Messung 1 bis 17,5 % der Figurhöhe daneben — am Startplatz gemessen: **0,0085 u über** dem Netz,
8,7 % der Mechhöhe. Erste Fassung war ein Raycaster, **gemessen 8–21 ms je Strahl** (130 560
Dreiecke, kein BVH) — verworfen, nicht versteckt. Zweite Fassung liest dieselbe Fläche ohne Suche:
`SphereGeometry` ist ein regelmäßiges (W+1)×(H+1)-Gitter, die Zelle unter dem Mech wird gerechnet,
dann bilinear zwischen vier Vertex-Radien. **Δ 0,00001 u gegen den Kontrollstrahl** — ⚠ und diese
Zahl war eine flache Stelle, kein Beweis: die Abnahme hat später an sechs Richtungen
+0,0053 / +0,0028 / +0,0003 / +0,0051 / +0,0030 / +0,0006 u gemessen, **immer positiv**, Betrag
folgt der Spreizung der Eckradien. Ursache: ein bilineares Feld über vier Ecken ist gekrümmt, die
gezeichnete Fläche sind aber **zwei Dreiecke** (`SphereGeometry` schreibt (a,b,d) und (b,c,d)) — auf
steilen und sattelförmigen Zellen liegt die Mischung ÜBER beiden Dreiecken, der Mech schwebte also
genau auf dem Gelände, für das die v8-Klage gestellt wurde. **Reparatur an der Wurzel, nicht an der
Toleranz:** das richtige Dreieck wählen (die Diagonale trennt bei `fy = fx`) und den Strahl gegen
dessen Ebene schneiden — dieselbe Rechnung wie der Kontrollstrahl. Gemessen danach: **Δ 0,00000 u**.
(`bodenTor()` schießt genau einen Kontrollstrahl, wenn man es liest, und sagt jetzt auch, WELCHE
Lesart lief — „triangle-plane" oder der bilineare Rückfall.) Kosten: das Tor druckt **0,1 ms je
Bild** — das ist der Auflösungsboden von `performance.now()`, also die OBERGRENZE, nicht der Wert;
gegen 8–21 ms je Strahl. (⚠ Hier stand zuerst „0,000 ms" aus einer frühen Einzelmessung — eine
Schätzung neben einem Instrument, das 0,1 anzeigt. Korrigiert, weil Instrumente nicht lügen.) Eigentümer bleiben getrennt: der
Carrier besitzt WOHIN (`carpet.js`, E-43), die Lesung nur WIE HOCH.

**4 · Mech-Größe (Georg: „mit den Zahlen kann ich nichts entscheiden").** Kein Zahlenregler als
Entscheidung, sondern ein Knopf: „Size step 1,0× → 1,3× → 1,8× → 2,5×", Ansage per Erzähler,
Entscheid per Auge im laufenden Bild.

**5 · Schatten (Georg, 1.9.: „unser Schatten ist anders als in tinyskies — dort gibt es doch
einen").** Er hat recht, und **die falsche Quelle war ich**: `card-shadow.js` trägt seit 30.8. die
Notiz, die Quelle habe keinen sichtbaren Schatten, weil ihre Schattenkamera ±22 u bei Radius 5
spanne (→ 4 Texel für die Karte). Die Rechnung stimmte, die Schlussfolgerung nicht — gelesen war
nur der KONSTRUKTOR. `Game.ts` 3164–3170 setzt je Bild `sunLight.target` auf den Spieler und die
Box auf **±5**: bei 2048 px **0,0049 u je Texel**, die Karte also ~15 Texel, VSM-weich
(`radius 2.5`, 12 Blur-Samples) — klein, weich, lichtabhängig, leicht versetzt. Genau Georgs Bild.
Nachgebaut in **`globe-v9/sun-shadow.js`** (neu): Schalter, Spannen-Regler (5 = Laufzeitwert der
Quelle, 22 = der Konstruktorwert, den ich fehlgelesen habe), Tor mit Texelzahl, plus Schalter
„Wolken & Props werfen" (Quelle: ja — `Globe.ts` 5273 und ~20 `castShadow = true`; wir bisher nein).
Eine benannte Abweichung: unsere Sonne steht auf Abstand 60, ihre auf 13,2 — `near/far` werden
daher aus dem Abstand gerechnet statt aus deren 1/40.
**Lehre, zweite Fassung derselben:** eine Konstante im Konstruktor ist keine Aussage über die
Laufzeit. Wer einen Wert liest, muss seine Schreiber zählen.

**6 · Lens Flare + Standards (Georg, 1.9.: „tinyskies-Settings als default = on").**
`globe-v9/lens-flare.js` (neu) ist `LensFlare.ts` Zeile für Zeile: acht additive Quads in einer
Ortho-Szene (fünf weiche Kreise, drei Hexagone), Offsets entlang des Sonnen-Bildvektors
(`ex = sunX · (1 − 2·offset)`), Gesamt-Alpha gedeckelt auf **0,25**, Randabblendung ab 0,8 über 0,6,
gezeichnet nach der Szene mit `autoClear = false` — kein Post-Processing-Pass. Tagesgewicht wie in
der Quelle (`flareColorScale × dayW`), also nachts kein Reflex. Standards jetzt: Sonnenschatten AN,
Wolken- und Prop-Werfer AN (gemessen: 154/154 Wolken-Puffs werfen), Lens Flare AN.
⚠ **Direkt danach von der Abnahme gefangen, und es war dieselbe Fehlerklasse wie die Ozeanfarben
am 30.8.:** `flareColorScale` ist ein Zahlen-TRIPEL und stand deshalb weder in `NUM` noch in `COL`
der Tageszeit-Interpolation — `mix` ist ein Klon des TAG-Presets, also lieferte
`zyklus.preset.flareColorScale` für immer **[1, 1, 1]**, während das Nacht-Preset [0.3, 0.4, 0.8]
trägt. Jetzt gibt es `TRIPEL` als dritte Sorte (gemessen nach der Reparatur: am Abend
[1.00, 0.75, 0.40]). Dazu zwei Namen statt einer Nachrechnung: `zyklus.tagGewicht` (die Quelle hat
das Feld: `getDayWeight()`, „1 during day, 0 during night") und `gewichtTor()`, das den Unterschied
zwischen **Startzeit** (`timeOfDay`, beim Bau festgelegt) und **laufender Phase** ausdruckt — die
Abnahme hielt „Nachtwelt mit Nachtgewicht 0" für einen Fehler, es waren zwei verschiedene Größen.
**Geplant, noch nicht gebaut:** Glühwürmchen · Vulkane · Leuchttürme (die drei stehen im
Atmosphäre-Rest aus v7 und brauchen den `Additive white gate`-Blick vorher).

**7 · BUG-03 (Masken-Anschnitt beim Kartensammeln) — Instrument statt viertem Fix.**
Dreimal geraten, dreimal war die Vorschau blind. **Heute in GEORGS laufender Ansicht gemessen:**
Canvas, Bühne und Fenster sind deckungsgleich (862×669, alle drei) — der Versatz, den der
29.8.-Fix behoben hat, ist auch bei ihm exakt null. Also kein vierter Fix, sondern ein Messer:
`flug.anschnittTor()` verfolgt die GEZEICHNETE Kartenfläche in Canvas-Pixeln durch den ganzen Flug
und merkt je Kante, wie weit sie hinausragte — plus Phase, Kartenbreite und Rahmenvergleich.
Panel: „Card clip gate (BUG-03)" + Reset-Knopf. Nächste Sichtung liefert damit eine Zahl, keine
Vermutung. **Ein belegter Anschnitt wurde repariert:** das Blatt im Fächer stand auf
`background: center/cover` (Kachel 56×33 = 1,697 gegen Kartenformat 1,74) — das beschneidet das
Motiv mittig, dieselbe Ursache wie im Crop-Befund („`cover` statt `fit`"). Jetzt `contain`.

**8 · Nahfeld-Lampe des Avatars (Georg: „Lichtkegel mit Kerzenlicht-Anmutung").**
Gefunden und 1:1 gebaut (`globe-v9/avatar-lamp.js`): **kein Kegel**, sondern
`PointLight(0xeec4a8, 0, 6.5, 1.25)` (Game.ts:1517), Ort = Fahrzeug + 0,15 entlang der Senkrechten
(3146), Helligkeit = `nachtGewicht × 0,38` (6288 + Konstante 173). Bemerkenswert: Reichweite **6,5
bei Globusradius 5**. Regler für Stärke und Reichweite, Tor prüft alle fünf Quellenzahlen.
**Fog of War (Georgs zweite Idee) ausdrücklich NICHT gebaut:** der Lampenradius ist der natürliche
Träger für „was ist bekannt", aber eine Sichtbarkeitsmaske über Land, Props und Karten ist ein
zweiter Mechanismus — sie gehört in die Weltbau-Schicht. Steht als Notiz im Panel, damit sie nicht
als gelöst gilt.

**9 · Streuungsschicht (`verteilung.js`, NEU) — und drei Fehler, die sie selbst gefunden hat.**
Befund zuerst: 776 Prop-Instanzen, idealer Nachbarabstand 4,11°, Median 1,54°, engster 0,08°,
größte Lücke 17,93°. **Die Hälfte davon ist Absicht** (Kokos- und Felsgruppen sind Cluster, 4–9
bzw. 3–5 Stück) — eine Kennzahl über alle Instanzen misst die Absicht mit. Gezählt wird die
Streuung der SITZE und die Größe der Leerflächen.
Drei Fehler, in dieser Reihenfolge gefunden und behoben:
1. **`planSites` brach ab, sobald die Zielzahl voll war** — auf einer Fibonacci-Spirale, die nach
   BREITE geordnet ist. Bei 26 Sitzen aus 1040 Kandidaten war das etwa Index 213: **alle Sitze
   lagen in einer Nordkappe.** Für jede Nachbarschaftskennzahl unsichtbar (innerhalb des Bandes
   gleichmäßig), gemeldet erst von der Flächendeckung. Jetzt zwei Durchgänge: ganze Spirale prüfen,
   dann gleichmäßig über den Spiralindex greifen. Größte Lücke **125,6° → 51,7°**.
2. **Das Tor rechnete das Ideal für die ganze Kugel**, obwohl Sitze nur auf Land dürfen (39 %) —
   22,62° statt 14,10°, also ✗ auf einen gesunden Zustand. Jetzt flächenrichtig.
3. **Das Tor forderte DECKUNG** („höchstens ein Viertel weiter als 1,5 Ideale") — das hat niemand
   verlangt; 26 Landmarken sollen selten sein. Urteil jetzt: Ballung (Nachbarabstände) + Loch
   (größte Lücke gegen den TYPISCHEN Abstand, Grenze 3,5×). Stand: **✓ 128 % des Ideals, 0
   Ballungen, Lücke 3,0× typisch.**
*Ein Instrument, das dauerhaft ✗ meldet, erzieht dazu, es zu überlesen* — dreimal an mir selbst.

**10 · Vulkane + Leuchttürme als erste Reiter auf der Schicht.**
`globe-v9/natur-marken.js` (NEU). Beide geben ein **Prädikat** ab statt eigenen Zufall:
· **Vulkan** (2, Quelle `Volcano.ts`): Hochland `elevation > 0,4`; Körper aus dem Lathe-Profil der
Quelle (S 0,35 · H 1,25, Krater in sechs Stützstellen, 24 Außenschritte
`r = 0,24·S + t^1,6·1,15·S`), Rauschverzerrung, vier Farbbänder, 30 additive Lavakugeln + 15
Rauch-Billboards mit **beiden Shadern unverändert**, Einsinken `S·0,42`.
· **Leuchtturm** (3, Mechanik `Globe.ts` 5368–5646): Küste (Land unter dem Fuß, Wasser im Ring —
`waterRatioAround` als BEDINGUNG statt als Filter), Turm 0,18 u (`towerH`), Strahl als liegender
Kegel mit **0,8 rad/s**. Unser Anteil, benannt: Farben, Streifen, fünfteilige Silhouette statt
vierzehn Teilen. Gemessen: ✓ 2/2 auf 0,47/0,50 Höhe, 74° auseinander · ✓ 3/3 mit 63/25/63 %
Wasseranteil im Ring · Aufbau **80 ms**.
⚠ **Zwei Nachträge aus der Abnahme, beide von der Klasse „der Text war besser als der Code":**
(a) Der Vulkankörper hatte den **Randterm der Quelle verloren** — `Volcano.ts` ruft direkt nach dem
Material `addRimLight(mat, 0xff5533, 0.52, 2.55)`, unser Port nicht, während der Kopf den Körper als
zeichengleich auswies. Nachgezogen (Stärke/Exponent aus der Quelle; **Ton bleibt der geteilte
`globalRimColor`** — eine zweite Randfarbe wäre ein zweiter Schreiber), und das Tor liest jetzt den
gepatchten Shader statt meiner Behauptung. (b) Die **Ringzahlen des Küstenprädikats** (0,04 · 8
Proben · 25–75 %) sind **unsere**: die lighthouse-eigenen `CHECK_DIST`/`WATER_CHECKS` (Globe.ts
5369–5400) sind nicht gelesen, zwei Suchen lieferten nur die Aufrufstelle. Steht so im Kopf und im
Tor. *Eine ungelesene Konstante darf nicht als Quellenwert auftreten.*
**12 · Strahl, Schein und der Licht-Vergleich (Georg, 1.9., am Bild).**
*„Bei tiny skies endet der Strahl des Leuchtturms nicht mit Kreis, sondern fadet natürlich aus."* —
Ursache war die Materialwahl, nicht die Geometrie: der Kegel ist schon offen (`openEnded`), aber ein
`MeshBasicMaterial` mit konstanter Deckkraft färbt jeden Punkt gleich, also war die offene
Deckfläche am fernen Ende eine sichtbare Ellipse. Jetzt ein Shader mit zwei Verläufen — **entlang
der Achse** `(1 − uv.y)^1.6` (am fernen Ende bleibt nichts zum Abschneiden) und **über die
Silhouette** `1 − |n·view|` (streifend gesehene Flächen tragen mehr Licht, daher der dichte Rand
eines echten Kegels). Dazu die zwei Schein-Quellen, die die Quelle hat und wir nicht hatten:
**Laternen-Schein** (additive Kugel an `lanternY`, Quelle `glowMesh`) und **Bodenschein** mit dem
GETEILTEN Shader der Quelle, den wir wörtlich haben (`vec3(1.0, 0.6, 0.1)`,
`alpha = smoothstep(0.5, 0.0, dist)² · 0.4`).
⚠ **Der Verlauf selbst ist UNSER:** die Shader-Zeilen des Strahls (`Globe.ts` ~5560–5620) sind nach
drei Suchen weiter nicht gelesen (nur Geometrie und Aufrufstellen kamen zurück) — gebaut ist er aus
dem BILD (hellste Stelle an der Laterne, kein Deckel, weicher Auslauf).
**Licht-Vergleich, Stand:** verglichen und angeglichen sind Sonnenschatten (VSM, Box ±5 folgt),
Lens Flare (8 Quads, Deckel 0,25), Avatar-Lampe (PointLight 0xeec4a8 / 6,5 / 1,25 × Nachtgewicht
0,38), Ozeanfarben + Schaum, Wolken (additiv) und jetzt die zwei Leuchtturm-Scheine. **Offen:** das
Licht-Rig selbst (7 Lampen) ist als zeichengleich dokumentiert, aber nur über `light-budget` gemessen
— eine Zeile-für-Zeile-Gegenprobe der Intensitäten je Tageszeit fehlt; und ob die Quelle am
Leuchtturm eine echte `PointLight` hängt (Braziers und FlagSystem tun es, für den Leuchtturm kam in
den Suchen keine) ist ungeprüft.
**Nebenbefund am Sampler:** `streuen` zog genau so viele Kandidaten, wie es Treffer brauchte — für
2 Vulkane und 3 Leuchttürme aussichtslos (1/2 und 2/3 gemessen). Jetzt Überzeichnung plus dieselbe
Zwei-Durchgang-Auswahl wie in `planSites`. *Ein Sampler ohne Reserve scheitert umso sicherer, je
seltener die Sorte ist.*

**11 · Angemeldet für später (Georg, 1.9.):** die **KayKit Forest Nature Pack 1.0 FREE**-Elemente
aus `georg-doc/kayfabizarro/media/3D_Assets/KayKit_Forest_Nature_Pack_1.0_FREE` als Props prüfen
und einbauen — sie sind der natürliche zweite Reiter auf der Streuungsschicht (Prädikat je Sorte:
Wald, Küste, Hochland). Vorher: `KFB Asset-Inventur` darauf laufen lassen (Hülle, tri, Farbweg).

**13 · `boden-lesung.js` (NEU) — EIN Eigentümer für „wie hoch ist der gezeichnete Boden".**
Die Abnahme fand die dritte Antwort auf dieselbe Frage: `natur-marken` platzierte Türme und
Bodenschein aus der Höhenfunktion, und weil die bis ±8 mm von den gebackenen Dreiecken abweicht,
lag der Bodenschein bei **zwei von drei** Leuchttürmen UNTER dem Gelände (gemessen −8,19 mm /
−1,13 mm / +0,46 mm; ein Versatz von 1,4 mm überlebt das nicht). Also nicht den Versatz erhöhen,
sondern die Frage zusammenlegen: die Dreiecks-Ebenenlesung aus dem Mech-Slice ist jetzt ein eigenes
Modul, und alles, was auf dem Boden STEHT, fragt es. Nach dem Umbau gemessen: Bodenschein
**+2,7 mm über dem Netz an allen drei** Türmen, Tor sagt „height read off the MESH at 3/3", und
fällt der Eingang weg, nennt es den Rückfall statt ihn zu verschweigen.
*Eine Frage mit drei Antworten hat keinen Eigentümer* — dritter Fall heute derselben Klasse
(Kurs-Servo mit vier Antragsteller, Nachtgewicht mit zwei Definitionen, Bodenhöhe mit drei Lesern).
⚠ **Nachtrag, und er gehört zur Lehre:** die erste Fassung dieses Umbaus hat das Modul angelegt und
in `mech-station.js` importiert — **aber nie gerufen.** Die eigene Kopie lief weiter, damit hatte die
Frage wieder zwei Implementierungen, und drei Texte behaupteten eine (Modulkopf, dieser Eintrag, mein
Bericht). Gefunden von der Abnahme, nicht von mir. Jetzt ist die Kopie gelöscht und `bodenTor()`
liest `leser.vergleich()`; gemessen danach: „triangle-plane read 4.9949 vs control ray 4.9949
(Δ +0.00000 u) · one shared reader for mech, towers and glows".
*Ein Import ohne Aufruf ist eine Absichtserklärung, keine Zusammenlegung.*

**Offen für v9 (Reihenfolge aus Georgs Formular 1.9.):**
⚠ **Check-in-Befund 2.9.: der Standalone-Export geht (noch) nicht.** Der Inliner bündelt
`globe-poc.js` als eingebettetes Modul; eingebettete Module bekommen eine `blob:`-Basis, und darauf
löst `./globe.js` nicht auf (`Failed to resolve module specifier`). Es sind **70** relative Importe.
Der alte `export/KFB Travel Globe v2 - standalone.html` stammt aus einer Zeit mit flacherem Graph.
Was fehlt, ist ein Build-Schritt, der die Modulpfade auf eine **Import-Map** umschreibt — ein eigener
kleiner Slice, kein Nebenprodukt eines Exports. Lieferform bis dahin: der Ordner
`export/v9-checkin/` (mit einem Server starten, nicht `file://`).
1. ✅ Raycast-/Netz-Fußlesung — erledigt (Punkt 3).
2. **Weltbau-Werkstatt als eigene Seite** (Regler + Seed + Vorschau) — nächster Bauschritt.
   Georgs Vorgaben aus dem Formular: **zwei gleichberechtigte Wege, Zufall UND Deck, mit demselben
   Ausgang** · das **Deck als Ganzes** setzt Klima/Anatomie (Land-Anteil, Höhe, Wasser), nicht die
   Einzelkarte · Vorlage zuerst **stylisierte „reale" Weltkarte** (Kontinent-Maske als Bild) ·
   Anatomie-Schichten: Kontinent-Umriss, Höhenrelief, Klimazonen/Biome, Landmarken-Orte ·
   Determinismus: gleiche Welt, **Props dürfen wandern**.
   Zwei Punkte aus seinen offenen Fragen, die dazugehören: **Karten sollten GROSS auf das Terrain
   gemappt werden** (ursprünglicher Plan) und die **Streuungslogik von Props/Wegweisern/Karten muss
   Ballungen und Leerflächen ausgleichen** (heute: Zufall mit Rückweisung wie in der Quelle → klumpt).
3. Wasser/Küste zweite Runde am Original.
4. Signaturwaffe im Mech-Modus — von Georg NICHT in die Reihenfolge gewählt, bleibt offen.

## 00-v8. Travel **Globe v8** — **FROZEN seit 2026-09-01 (spät)** · vorher: AKTIV · Zweig für den Mech-Einbau

> **Georgs Entscheidung 1.9. (spät): Einbau in v8, v7 einchecken und einfrieren** — mit offenen
> Punkten, Planung, Clean-up und additivem Changelog (dieser Eintrag ist der Changelog-Kopf).
> KISS-Rahmen bestätigt: EIN Modul (`kfb-mech-combat`) · Mech = **Fahrzeug** im Sinne des
> `fahrzeug-vertrag.js` · `determinism: seeded` erst mit Storymap.

| Artefakt | Status | Notiz |
|---|---|---|
| `KFB Travel Globe v8.dc.html` + `globe-v8/` | **AKTIV** — main der Globe-Linie | 1:1-Kopie von v7 (Stand 1.9., nach Portal „Quelle nachbauen", Aurora mitfliegend, Block-3-Anfang); Pfade umgestellt, sonst noch NICHTS eingebaut |
| `modules/kfb-mech-combat.js` | **AKTIV** · angeliefert von „drüben" (v2-2) | Modulvertrag-konform; `FAHRZEUG_ENTWUERFE` (Bone-Box-Maße!), `SFX_PRESETS`, `MATH_RANDOM_STELLEN`, Wirt-Regeln im Docblock |
| `KFB Mech Slice v2.dc.html` | **FROZEN** · Referenz | Der spielbare Slice aus Georgs Parallel-Session; Quelle der VFX-/Audio-Rezepte. Nicht weiterbauen — Weiterbau ist der v8-Einbau |
| `KFB Mech Slice v1.dc.html` · `KFB Mech Recon v1.dc.html` | **FROZEN** · Referenz/Messsonde | Recon = Beleg der GLB-Fallen (frustumCulled, +Z-Achse, Bone-Box statt Box3) |
| `travel/travel-v16/terrain-v16/` (4 Dateien) | **FROZEN** · Kanon-Spiegel | Farbwelt + Tusche-SSOT für die Mech-Slices. **Nicht editieren** |
| `docs/ONBOARDING_v9_frischer-Chat.md` | **AKTIV** · neu 1.9. (spät) | Der Einstieg für einen frischen Chat: acht v9-Eingriffe mit Toren, drei Lehren, Georgs Reihenfolge |
| `docs/BRIEFING_mech-einbau_v8.md` | **AKTIV** · die Anleitung | 3 Entscheidungen beantwortet + Wirt-Tabelle + Recon-Fallen |
| `docs/MECH_*` (Changelog, Modulvertrag, Recherche, github-Befunde) | **FROZEN** · Belege | Vollständige Befundliste in `docs/MECH_github_2026-09-01.md` |
| `KFB Asset-Inventur KFB-Ordner.dc.html` + `globe-v7/asset-inventur.js` | **AKTIV** · Werkzeug | Live-GitHub-Baum + echte GLB-Ladung (Hülle, tri, Farbweg, Clips); entstand, weil das Tree-Listing `.glb` filtert |

**Offene Punkte, die v7 mit ins Eis nimmt (Weiterbau in v8):**
Block 3 Rest — Zeitlupe am Treffer, Anflug-Ruckler, BUG-03/06 (brauchen Georgs Editor-Bild) ·
vier Atmosphäre-Effekte (Glühwürmchen, Laternen, Kondensstreifen, Vögel; vorher `Additive white
gate` lesen, Glühwürmchen+Laternen+Aurora = erste Summenprüfung) · Slice „Boden" (E-43, Raycast
laut Messung 1 Pflicht) · Beweis-Schulden aus ONBOARDING §6 unverändert.

**Erster v8-Bauschritt (geplant):** `fahrzeug-vertrag.js`-Einträge aus `FAHRZEUG_ENTWUERFE`,
Mech-Skin über den bestehenden Walk-/Fahrzeug-Weg, Signaturwaffe pro Mech, `trauma.js`/`fx-bus`
statt Slice-Shake, Klangbank als Preset-Tabelle in `tiny-audio`.

## 00. Travel **Globe v7** — **FROZEN seit 2026-09-01 (spät)** · vorher: AKTIV, Slice „Gestaltung" eingecheckt 2026-09-01

> **Seit 1.9. ist v7 nicht mehr nur der Zweig, sondern der Bau.** Der Fork-Eintrag vom 31.8. steht
> unverändert weiter unten (§00-fork) — er beschreibt, was der Zweig *durfte*. **Nichts gelöscht.**

| Artefakt | Status | Notiz |
|---|---|---|
| `KFB Travel Globe v7.dc.html` + `globe-v7/` | **AKTIV** — main der Globe-Linie | Slice „Gestaltung": Portale, Wegweiser, Props, Küste, Aurora, Gottesstrahlen |
| `globe-v7/sky-atmosphere.js` | **AKTIV** · neu 1.9. | Aurora + Gottesstrahlen, zeichengleich aus tinyskies |
| `KFB Portal-Vergleich.dc.html` | **AKTIV** · neu 1.9. | Der tinyskies-Vergleich in Georgs Sprache. Zwei Tweak-Schalter, keine Fachwörter |
| `KFB Travel Globe v6.dc.html` + `globe-v6/` | **FROZEN** seit 2026-08-31 | Vorher der E/E2-Abnahme. **Nicht anfassen, nicht löschen.** |
| `KFB Travel v23a/b/c` + `terrain-v23/` | **FROZEN** | ⚠ Vorlage für den Skydome-Slice. Nicht aufräumen. |
| `docs/ONBOARDING_v7_frischer-Chat.md` | **AKTIV** · 1.9. neu gefasst | ⚠ Die Fassung vom 31.8. hatte zwei stale Stellen (Slice H als „ungebaut", `aurora` als „überall false") — beide falsch, beide hätten Arbeit gekostet |
| `docs/SPRINT_v7-Gestaltung.md` | **AKTIV** · neu 1.9. | Der Tag im Detail: Zahlen, neun Messfehler, Portal-Vergleich §6, Küstenbefund §7 |

### `globe-v7/` — diese Session (1.9.) neu oder geändert

| Datei | Status | Änderung |
|---|---|---|
| `sky-atmosphere.js` | **NEU** | Aurora (10 additive Vorhänge) + Gottesstrahlen (1 Kegel). Eine benannte Abweichung: Sonnenabstand 13,15 statt 60 |
| `globe-poc.js` | geändert | Atmosphäre verdrahtet · `weissTor` (Bildvergleich mit/ohne Effekt) · Kontextverlust-Wächter · 14 neue Panel-Zeilen |
| `portal.js` | geändert | `atem` (formtreu) · `sichtbar()` als Eigentümer des gezeichneten Maßes · `formTor()` · `skala` 2,6 → **1,3** · `nurLand`/`landVersuche` |
| `card-towers.js` | geändert | Leuchten als Rand-Maske im Shader · `reaktWinkelMax`/`reaktRueck` · `reaktTor()` · `motivTor()` |
| `globe-landmarks.js` | geändert | Beide Bücher raus, 9 Pflanzen rein (Summe bleibt 59) · `pflanzenTor()` liest die **gebaute Szene** |
| `globe.js` | geändert | Küstengewicht `wW` auf drei Wasser-Terme · `kuestenTor()` |
| `sky-cards.js` | geändert | Respawn an der Entfernung (B6) · `respawnTor()` |
| `day-night.js` | geändert | `nachtGewicht` als **Eigentümer** — drei Leser (Sterne, Aurora, Strahlen) |
| `intro-flight.js` | geändert | `skipBlende` 0,45 → **0,15 s** (A7) |
| `collect-hud.js` | geändert | `img` ohne `src` → transparentes 1×1-Pixel (Georgs Broken-Icon) |
| `pet-kinetics.js` | **nur Kommentar** | A13 geprüft: die zwei Squash-Klemmen sind Absicht, sie klemmen verschiedene Größen |

**Geteilte Module — nicht als tot einstufen:** `themes/kfb-shell.css` (v3…v7) ·
`kfb-deform-instanced.js` (Wurzel) · `asset-repo.json` (Wurzel; `sky-enemies` **und**
`globe-landmarks` lesen ihn zur Laufzeit) · `globe-v7/settings-panel.js` · `globe-v7/rim-light.js` ·
`globe-v7/light-budget.js`.

### Export-Manifest dieser Session (session-export §1 — **Veto-Fenster offen**)

**(a) Deliverables — 12 Dateien**
`KFB Portal-Vergleich.dc.html` (neu) · `globe-v7/sky-atmosphere.js` (neu) · `globe-poc.js` ·
`portal.js` · `card-towers.js` · `globe-landmarks.js` · `globe.js` · `sky-cards.js` ·
`day-night.js` · `intro-flight.js` · `collect-hud.js` · `pet-kinetics.js`.
Dazu `KFB Travel Globe v7.dc.html` **unverändert** — gehört in den Export, weil sie der Einstieg ist.

**(b) Contract- und Daten-Dateien — keine.** `asset-repo.json`, `zone-registry.json` und
`zone-index.json` sind **nicht angefasst**; die neun Pflanzen stehen als Namen in
`globe-landmarks.js` und werden zur Laufzeit aus dem Repo aufgelöst. Kein Versionsschritt fällig (§5).

**(c) Docs — 4 Dateien**
`docs/SPRINT_v7-Gestaltung.md` (neu) · `docs/ONBOARDING_v7_frischer-Chat.md` (neu gefasst) ·
`docs/LIVING_KFB-Travel-Globe.md` (§05z angehängt) · `github.md` (Quellstand 1.9.) ·
plus diese `HOUSEKEEPING.md`.

**(d) Abnahme-Captures — LEER.** Alle Zahlen des 1.9. sind Konsolen-Ablesungen und Panel-Tore.
*Kein Screenshot heißt hier: nicht vorhanden, nicht vergessen.* Die Beweis-Schuld aus SOP-01
(Bildstreifen für `portal.pass` / `enemy.hit` / `enemy.kill`) bleibt offen.

**Nicht im Export:** die restlichen 52 Dateien in `globe-v7/` (unverändert seit dem Fork), `globe-v1`
… `globe-v6`, alle `terrain-*` und `overworld-*`, `uploads/`, `screenshots/`, `refs/`, `scraps/`.

### ⚠ Pfad-Hygiene (Skill §6) — ein Fund, und er betrifft den Standalone-Export

`globe-v7/rift.png` (121 kB, unter dem 2-MB-Budget) ist der **einzige relative Asset-Pfad** im
Zweig. Alles andere — GLBs, Kenney-Atlanten, Sounds, Kartenrückseite — lädt über die kanonische
RAW-URL (`raw.githubusercontent.com/georg-doc/kayfabizarro/main/…`).

Der Loader versucht `./globe-v7/rift.png` und fällt auf `./rift.png` zurück; der Rückfall existiert,
weil `import.meta.url` beim Bündeln `blob:` ist (28.8. bezahlt). **Im Standalone-Export gibt es
keines von beiden daneben — dann ist der Riss weg**, und der Riss IST das Bild des Weltportals.

Die Datei stammt aus tinyskies (`client/public/2D/rift.png`), nicht aus `georg-doc/kayfabizarro`, hat
also keine kanonische KFB-RAW-URL. **Drei Wege, Georgs Wahl:**

1. **Upload ins KFB-Repo** unter `media/2D/rift.png`, dann RAW-URL zuerst, relativ als Rückfall.
   *Sauberste Lösung, braucht einen Upload von Georg.*
2. **Als Daten-URL in `portal.js` einbetteten** — 121 kB PNG ≈ 161 kB Base64. Läuft überall, bläht
   aber eine Quelldatei auf und verletzt „schwere Dinge per URL".
3. **Standalone ohne Riss ausliefern** und es im Export vermerken. Ehrlich, aber das Portal sieht
   dort dann wieder aus wie vor dem 30.8.

**Empfehlung: (1), und bis der Upload da ist (2) nur im Standalone-Build, nicht in `globe-v7/`.**

### Cleanup-Kandidaten (§3 — **benannt, nicht ausgeführt**)

| Kandidat | Empfehlung |
|---|---|
| `client/` an der Projektwurzel | leerer Rest des `github_copy_files`-Pfads. **Löschen** — steht seit 31.8. auf der Liste |
| `screenshots/v6-portal-01.png` | Zwischenaufnahme der Bauphase, durch Panel-Tore ersetzt. **Löschen** |
| `screenshots/v7-kueste-nachher.png` | 1.9. angelegt, dann durch `Coast gate` ersetzt. **Löschen** |
| `bildschirmfoto-2026-08-23-…png` (Wurzel) | verarbeitetes Feedback-Bild. **Löschen** |
| `globe-v1` … `globe-v4` | v5 ist das älteste noch gebrauchte Vorher. **Kandidat für Archiv**, nicht für Löschung ohne Blick |
| `docs/ONBOARDING_v5_frischer-Chat.md` · `_v6_` | **SUPERSEDED**, klein, harmlos. Liegenlassen |

**Kein Löschvorgang ohne Georgs Freigabe, jeder Schritt einzeln.**

### Clean-Run-Checkliste v7 (1.9. erweitert)

1. Seite laden → Konsole ohne Fehler, `frame errors 0`. **`WebGL context` muss `✓ alive` sagen** —
   sagt es „CONTEXT LOST", ist der Loop absichtlich angehalten und die Tafel steht im Bild.
2. Panel öffnen → grün lesen: `Portal shape gate` ✓ ±0,00 % · `Signpost artwork gate` ✓ 77 % ·
   `Signpost recoil gate` (nach Knopfdruck) ✓ 25° / 0° Rest · `Plant set gate` ✓ ohne Bücher ·
   `Coast gate` ✓ · `Mood gate` 4/4 · `Vehicle contract gate` 10/10.
3. **Ein Portal durchfliegen** → `portal.pass`, Sprung ≥ 115°. Der **Riss** muss zu sehen sein — er
   ist der Test, dass `rift.png` gefunden wird und nicht der Rückfall greift.
4. **Ein Schild anstreifen** → es dreht bis 25° und **kehrt zurück**. Bleibt es schief stehen, ist
   `reaktRueck` verloren gegangen.
5. **Zeit auf Nacht stellen** → Aurora sichtbar, wenn die Kamera nach Norden schaut.
   **Zeit auf Tag** → Gottesstrahlen, wenn die Sonne vor der Kamera steht.
   Dann `Additive white gate` drücken: es muss **eine Zahl nennen** und Zuwachs ≤ 1 % melden.
   ⚠ Sagt es „paused · this document is hidden", ist die Vorschau unsichtbar — **das ist kein
   Befund, sondern die Pause** (PM-51). Erst sichtbar machen, dann messen.

---

## 00-fork. Travel **Globe v7** — der Zweig-Eintrag vom 2026-08-31 (bleibt stehen)

> **Zweig, keine Fortschreibung:** `globe-v7/` ist eine vollständige Kopie von `globe-v6/` (61
> Dateien). **v6 ist EINGEFROREN** — Slice E/E2 sind abgenommen, und der Zweig hält das Vorher der
> Abnahme lauffähig. **Nichts gelöscht.**

### Deliverable

| Artefakt | Status | Notiz |
|---|---|---|
| `KFB Travel Globe v7.dc.html` + `globe-v7/` | **AKTIV** — main der Globe-Linie | noch inhaltsgleich mit v6; der Zweig ist die Bühne, nicht der Bau |
| `KFB Travel Globe v6.dc.html` + `globe-v6/` | **FROZEN** seit 2026-08-31 | Referenz und Vorher der E/E2-Abnahme. **Nicht anfassen, nicht löschen.** |
| `KFB Travel v23a/b/c` + `terrain-v23/` | **FROZEN** | ⚠ Vorlage für den Skydome-Slice (`skydome-shader.js`). Nicht aufräumen. |

### Was der Fork geändert hat — und nur das

| Datei | Änderung |
|---|---|
| `globe-v7/portal.js` | Riss-Textur-Pfad `./globe-v6/rift.png` → `./globe-v7/rift.png` (Rückfall auf `./rift.png` bleibt) |
| `globe-v7/globe-poc.js` | v7-Kopfnotiz (Zweig + E-43 + die zwei Messungen aus LIVING §05v); vier ANZEIGE-Etiketten auf v7 (Meta-Zeile, Panel-Titel, Berichtkopf, Dateikopf). Historische v3…v6-Notizen unverändert — sie sind Erzähler ihrer Regeln, keine Etiketten |
| `KFB Travel Globe v7.dc.html` | Titel, `hud-frame.css`- und `globe-poc.js`-Pfade auf `globe-v7/` |

**Nicht geändert:** kein Modul, keine Konstante, keine Kaskade. Ein Fork, der nebenbei etwas
verbessert, ist keine Vergleichsbasis mehr.

### Diese Session in `globe-v7/` — Fundament, kein Sichteffekt

| Datei | Status | Notiz |
|---|---|---|
| `fahrzeug-vertrag.js` | **AKTIV** · **NEU** | fünf Felder + `features`; Karte erfüllt sie; `vertragTor()` prüft **zehn** Zusagen gegen live gelesene Werte und zählt **verbotene** Feldnamen (Physik bleibt bei `carpet.js`). `ENTWURF_LAEUFER` = Walk-Eintrag mit `null` in jedem offenen Feld, ungeprüft nach E-30 |
| `walk-messung.js` | **AKTIV** · **NEU** | die zwei Messungen aus LIVING §05v. `bodenMessung()` 48 Strahlen aufs Mesh (nur auf Knopfdruck), `massstabMessung()` reine Rechnung |
| `globe-poc.js` | **AKTIV** | Panel-Abschnitt „Vehicle contract & walk prep (E-43)", Vertrags-Tor beim Start in der Konsole. Kein Modul, keine Konstante, keine Kaskade angefasst |

**Export-Manifest dieser Session** (session-export §1, Veto-Fenster offen): 4 Code-Dateien
(`KFB Travel Globe v7.dc.html`, `globe-v7/fahrzeug-vertrag.js`, `globe-v7/walk-messung.js`,
`globe-v7/globe-poc.js`) + 1 Pfad-Edit (`globe-v7/portal.js`) + 4 Docs. Die übrigen 58 Dateien
in `globe-v7/` sind **bitgleiche Kopien aus v6** — sie gehören in den Zweig, aber nicht in ein
Session-Zip. **Keine Abnahme-Captures** (Kategorie d ist leer): die Zahlen dieser Session sind
Konsolen-Ablesungen, kein Bild. Kein Screenshot heißt hier: nicht vorhanden, nicht vergessen.

**Messung 2 ist gelaufen und korrigiert das Living Doc:** Umrundung zu Fuß **255 s** (nicht
~105 s — die alte Zahl unterstellte 2,0 Körperhöhen/s, also Sprint), Horizont **1,10 u**,
zu Fuß = **2,3 × die Reiserunde**. Größere Welt löst beides (r = 66,7 für 4 u Horizont,
r = 17,6 für eine 15-Minuten-Runde); **die Figurgröße löst es nicht** — kleinere Figur heißt
längere Runde ABER näherer Horizont, die Ziele ziehen gegeneinander (LIVING §05y).
**Messung 1 ist abgelesen** (`hidden: false`, 24 Strahlen): max |Funktion − Mesh| **0,0262 u
= 17,5 % der Figurhöhe** gegen eine Schwelle von 5 %, Mittel 1,7 %, Vorzeichen **18 : 6 zum
Einsinken**. Der Raycast im Walk-Slice ist damit gemessen notwendig. Bei voller Stichprobe (48)
kann der Wert nur steigen — offen ist der Höchstwert, nicht das Urteil (LIVING §05y).

### Was in diesem Zweig ansteht (Reihenfolge aus `docs/ONBOARDING_v6_frischer-Chat.md` §6)

1. ~~**Fahrzeug-Vertrag**~~ — **erledigt 31.8.** (`fahrzeug-vertrag.js`, Tor im Panel).
   Offen bleibt daran genau eine Naht: `wakeUrsprung` hat noch keinen LESER; das Boot braucht
   `'heck'` statt `'mitte'`, und dann ist die Zeile eine Zuweisung statt einer Suche.
2. **Die zwei Messungen VOR dem Walk-Slice** (LIVING §05v/§05y): Instrumente stehen seit 31.8.
   **Beide abgelesen:** Messung 2 → 255 s zu Fuß, Horizont 1,10 u (die ~105 s aus §05v waren
   Sprint); Messung 1 → 17,5 % Abweichung bei Schwelle 5 %, Vorzeichen zum Einsinken ⇒
   **Raycast/baryzentrisch ist Pflicht, nicht Option.** Facettenkante 0,1227 u = 0,82 × Figurhöhe. **Die Maßstabsentscheidung gehört Georg** (§5.7): größere Welt
   ist der einzige Hebel, der Horizont UND Rundenzeit löst.
3. **E-43 Walk-Modus** als Skin am unsichtbaren Fahrzeug: `carpet.js` bleibt der einzige
   Bewegungsrechner, Schritt-Timing über `mixer.timeScale = tempo / schrittLaenge`.
4. Skydome — Georgs Plan sagt: **eigener frischer Chat**.

### Docs-Stand v7 (1.9.2026)

| Datei | Status |
|---|---|
| `docs/ONBOARDING_v7_frischer-Chat.md` | **AKTIV** · **NEU** — Einstieg für den frischen Chat |
| `docs/ONBOARDING_v6_frischer-Chat.md` | **SUPERSEDED** (Kopf zeigt auf v7; bleibt liegen) |
| `docs/LIVING_KFB-Travel-Globe.md` | **AKTIV** · geteilt — §05x (der Zweig), §05y (Vertrag + Messungen) |
| `docs/BACKLOG_globe.md` | **AKTIV** · Fahrzeug-Kopf trägt Status „gebaut" |

### ⚠ Pfad-Hygiene · ein Fund

`./globe-v7/rift.png` ist der **letzte relative Asset-Pfad** im Zweig — alles andere
(GLBs, Atlanten, Sounds, Kartenrückseite) lädt über die kanonische RAW-URL. Im
Standalone-Export gibt es kein `./globe-v7/` daneben, dort greift der Rückfall `./rift.png`
und dann ist der Riss weg. Der Rückfall existiert, weil `import.meta.url` beim Bündeln
`blob:` ist (28.8. bezahlt). **Empfehlung: RAW-URL zuerst, relativ als Rückfall.**
Nicht ausgeführt — das ist eine Verhaltensänderung, und v7 ist noch Vergleichsbasis.

### Aufräum-Kandidaten — **benannt, nicht ausgeführt** (unverändert aus v6 übernommen)

1. `client/` an der Projektwurzel — leerer Rest des `github_copy_files`-Pfads. **Empfehlung: löschen.**
2. `screenshots/v6-portal-01.png` — Zwischenaufnahme, durch die Panel-Tore ersetzt. **Empfehlung: löschen.**
3. `globe-v5/` — SUPERSEDED; bleibt, solange die E-Abnahme als Vorher/Nachher zitiert wird.

Freigabe fehlt für alle drei. **Gelöscht ist nichts.**

### Clean-Run-Checkliste v7 (identisch mit v6 — das ist der Beweis, dass der Fork sauber ist)

1. Neu laden, Panel öffnen (**G**). Der Panel-Titel muss **v7** sagen.
2. `Portal gate (source geometry)` ✓ · `Portal hit self-test` **6/6** ·
   `Signpost gate (E-34/E-35)` ✓ · `Enemy gate (SkyGremlins.ts)` ✓.
3. Ein Portal durchfliegen → `portal.pass`, Sprung ≥ 115°. Der **Riss** muss zu sehen sein —
   er ist der Test, dass `globe-v7/rift.png` gefunden wird und nicht der Rückfall greift
   (Abnahme 31.8.: fetch 200, 123 772 Bytes, kein Rückfall).
   Dazu Abschnitt „Vehicle contract & walk prep": `Vehicle contract gate` **✓ 10/10**, beide
   Mess-Knöpfe drücken — Messung 1 bei **48** Strahlen ist noch nicht protokolliert.
4. Steigen (↑), einen Gegner dreimal treffen → `enemy.hit` ×2, `enemy.kill` ×1, Sturz 0,8 s.
5. `?portale=8` → „8 asked, N placed".

---

## 00a. Travel **Globe v6** — FROZEN seit 2026-08-31 (Slice E „Portal & Wegweiser" + E2 „Gegner")

> Nachgezogen 31.8.2026 nach `session-export`. **Zweig, keine Fortschreibung:** `globe-v6/` ist
> eine vollständige Kopie von `globe-v5/` — v5 bleibt lauffähig, weil Slice E der einzige Slice mit
> Zwischenabnahme ist und eine Abnahme ein Vorher braucht. **Nichts gelöscht.**

### Deliverable

| Artefakt | Status | Notiz |
|---|---|---|
| `KFB Travel Globe v6.dc.html` | **FROZEN** (war main bis 31.8., dann Zweig auf v7) | Slice E + E2 |
| `KFB Travel Globe v5.dc.html` + `globe-v5/` | **SUPERSEDED** | von v6; als Vorher der E-Abnahme **nicht löschen** |
| `KFB Travel v23a/b/c` + `terrain-v23/` | **FROZEN** | ⚠ **Vorlage für den NÄCHSTEN Slice** (`skydome-shader.js`). Nicht aufräumen. |

### `globe-v6/` — diese Session neu oder geändert

| Datei | Status | am 30./31.8. |
|---|---|---|
| `portal.js` | **AKTIV** · **NEU** | Portalfeld: Platzierung, zwei Bilder (Ring/Riss), Trefferest als Ellipse, Sprung, `tor()` + `selbsttest()` |
| `sky-enemies.js` | **AKTIV** · **NEU** | Gegner als ZIELE nach `SkyGremlins.ts`; Treffer-Vertrag für den späteren „gefährlich"-Aufsatz |
| `rift.png` | **ASSET** · **NEU** | aus `client/public/2D/rift.png` kopiert — Bild des Welt-Übergangs |
| `carpet.js` | **AKTIV** | `teleportTo()` 1:1 `Carpet.ts:383` — der einzige Weg, `qPosition` von außen zu setzen |
| `card-towers.js` | **AKTIV** | Wegweiser ZEIGEN (`setAim`), zwei Sorten nach E-35, `glowBurst`, `weiserTor()`, Regenbogen sperrt Portal-Farbtöne |
| `fx-script.js` | **AKTIV** | drei neue Kaskaden: `portal.pass` · `enemy.hit` · `enemy.kill`; `glow`-Beat in `signpost.hit` |
| `globe-poc.js` | **AKTIV** | Verdrahtung, Zielgeber, `glow`-Wirker, zwei Panel-Abschnitte, `?portale=N` · `?gegner=N`, Etiketten auf v6 |

### Geteilte Module — NICHT als tot einstufen

`themes/kfb-shell.css` (v3+v4+v5+v6) · `kfb-deform-instanced.js` (Projektwurzel) ·
`asset-repo.json` (Wurzel — `sky-enemies` liest ihn zur Laufzeit) · `globe-v6/settings-panel.js` ·
`globe-v6/rim-light.js`.

### Pfad-Hygiene (Skill §6) — ⚠ eine Ausnahme, benannt

`globe-v6/rift.png` liegt **lokal** (78 kB, unter dem 2-MB-Budget). Grund: die Datei stammt aus
tinyskies, nicht aus `georg-doc/kayfabizarro`, hat also keine kanonische KFB-RAW-URL. Der Loader
versucht `./globe-v6/rift.png` und fällt auf `./rift.png` zurück. **Upload-Kandidat**, falls sie in
das KFB-Repo soll. Alles andere läuft über RAW-URLs.

### Aufräum-Kandidaten — **benannt, nicht ausgeführt**

1. `client/` an der Projektwurzel — leerer Rest des `github_copy_files`-Pfads (`client/public/2D/`),
   die Datei ist nach `globe-v6/` verschoben. **Empfehlung: löschen.**
2. `screenshots/v6-portal-01.png` — Zwischenaufnahme aus der Bauphase, durch die Panel-Tore
   ersetzt. **Empfehlung: löschen.**
3. `globe-v5/` — SUPERSEDED, aber **nicht löschen**, solange die E-Abnahme (Vorher/Nachher) offen
   ist.
4. Die Kandidaten der v5-Session stehen unverändert im Block darunter, Freigabe fehlt weiter.

### Clean-Run-Checkliste v6

1. Neu laden, Panel öffnen (**G**).
2. `Portal gate (source geometry)` ✓ · `Portal hit self-test` **6/6** ·
   `Signpost gate (E-34/E-35)` ✓ · `Enemy gate (SkyGremlins.ts)` ✓.
3. Losfliegen, ein Portal durchfliegen → `portal.pass`, Sprung ≥ 115°.
4. Steigen (↑) und einen Gegner dreimal treffen → `enemy.hit` ×2, `enemy.kill` ×1, Sturz 0,8 s.
5. `?portale=8` → die Torzeile muss „8 asked, N placed" sagen, nicht acht Portale behaupten.

---

## 00c. Travel **Globe v5** — SUPERSEDED seit 2026-08-31 (Farbkette komplett, Slices A–H durch)

> Nachgezogen 30.8.2026 nach `skills/session-export_v1.md`. Diese Session hat den BODEN dieses
> Zweigs an die Quelle übergeben (tinyskies) und Slice H „Weltstimmungen" abgeschlossen.
> **Nichts gelöscht** — Kandidaten stehen unten, Freigabe fehlt.

### Deliverable

| Artefakt | Status | Notiz |
|---|---|---|
| `KFB Travel Globe v5.dc.html` | **AKTIV** — main der Globe-Linie | 72 Seiten im Canvas |
| `KFB Travel Globe v4.dc.html` + `globe-v4/` | **SUPERSEDED** | von v5 |
| `KFB Travel Globe v3*.dc.html` + `globe-v3/` | **SUPERSEDED** | ⚠ vom Living Document als Rückweg zitiert (Vor-Band-Palette `ebene 0x6f8f5e`) — **nicht löschen** |
| `KFB Travel v23a/b/c` + `terrain-v23/` | **FROZEN** | ⚠ **Vorlage für den NÄCHSTEN Slice** (`skydome-shader.js`). Nicht aufräumen. |

### `globe-v5/` — diese Session geändert

| Datei | Status | am 30.8. |
|---|---|---|
| `globe.js` | **AKTIV** | Palette 1:1 aus `Globe.ts` · Fragment-Patch wörtliche Kopie · `setOceanColors`/`setWasserTon`/`ozeanSoll` · `setStimmung`/`landSaettigung` · `landFlag`-Attribut · drei Proben |
| `day-night.js` | **AKTIV** | Ozeanfarben in `COL` · `setHimmelTon` (Versatz) · `nebelSoll`/`verlaufSpanne` |
| `sky-presets.js` | **AKTIV** | Gischt harmonisiert · `OZEAN_QUELLE` exportiert |
| `terrain-surface.js` | **AKTIV** | ⚠ `zoneBlend` planiert nur noch Land — war die Ursache für „Wasser auf Hügeln" (365 Vertices über Meereshöhe → 0) |
| `globe-landmarks.js` | **AKTIV** | Fake-AO gebacken (Spanne 0,10–1,00) · Objekt-Rim je Klasse · `aoProbe` |
| `light-budget.js` | **AKTIV** | Schneeband als benannte Ausnahme, druckt `idle` wenn leer |
| `settings-panel.js` | **AKTIV** · **GETEILT** | unbekannte Zeilenart wird sichtbar statt still verworfen |
| `card-shadow.js` | **AKTIV** | Standard aus — entschieden an der AUFRUFSTELLE in `globe-poc.js` |
| `globe-poc.js` | **AKTIV** | Runner · Stimmungs-Anleger · acht Panel-Wächter |
| `weltstimmungen.js` | **AKTIV** · **NEU** | vier Stimmungen, ausschließlich Farbtöne |
| `hud-frame.css` | **AKTIV** | Platten-CSS ersatzlos gestrichen (§05o) |

### Geteilte Module — NICHT als tot einstufen

`themes/kfb-shell.css` (v3+v4+v5) · `kfb-deform-instanced.js` (Projektwurzel) ·
`globe-v5/settings-panel.js` · `globe-v5/rim-light.js` (Globus, Teppich und ab heute die Props).

### Docs

| Datei | Status |
|---|---|
| `docs/LIVING_KFB-Travel-Globe.md` | **AKTIV** · Stand-Dokument, additiv — §05o…§05w neu |
| `docs/ONBOARDING_v5_frischer-Chat.md` | **AKTIV** · **NEU** — Einstieg + Sprintplan für den nächsten Chat |
| `docs/BACKLOG_globe.md` | **AKTIV** · Fahrzeug-Entscheidung + Fünf-Feld-Vertrag vorangestellt |
| `github.md` | **AKTIV** · Sync-Beleg; Rolle der Quelle steht jetzt oben (Vorfahrt bei Widerspruch) |

### Pfad-Hygiene (Skill §6) — geprüft

Alle Assets laufen über kanonische RAW-URLs, keine `./assets/`-Pfade im Code. Die einzige RAW-URL,
die auf ein zurückgenommenes Feature zeigte (`Metal022_1K-JPG`, HUD-Platten), ist mit dem CSS weg.

### Aufräum-Kandidaten — **benannt, nicht ausgeführt**

1. ~~`uploads/Bildschirmfoto*.png`~~ — **ERLEDIGT 30.8., 317 Dateien gelöscht.** Georgs Freigabe
   wörtlich: „meine ganzen screenshot-uploads vom testing kannst du löschen". Es waren nicht 12
   (diese Session), sondern **317** aus allen Sessions seit dem 19.7. — die Zahl im Manifest war
   zu klein, weil ich nur die dieser Sitzung gezählt hatte. Alle Befunde daraus stehen mit
   Messwerten im Living Document. `uploads/Georg's Infinite Canvas (8)/` bleibt unberührt.
2. **`export/globe-v5_2026-08-30/`** — der Export dieser Session. `AKTIV`, nicht aufräumen:
   Standalone (1,46 MB) + `src/` (Modul-Graph, 59 Module + CSS + JSON) + `docs/` + `README.md`
   + `MODULE.txt`. **Der Fullscreen-Knopf ist entfernt** (Georg: „haben wir ja leider nicht") —
   er saß seit dem v20-Shell in der Vorlage und versprach etwas, das die Umgebung nicht liefert.
3. `export/globe-v4_2026-08-30/` · `export/travel-v20_2026-08-26/` · `export/overworld-v1*/` —
   alte Vollexporte mit je eigener Modulkopie. **Empfehlung: behalten bis v5 exportiert ist, danach
   löschen.** Freigabe fehlt.
4. `overworld-v10…v15` · `terrain-v20/v21` — SUPERSEDED. ⚠ **`terrain-planets-v1` NICHT:** der
   v5-Modulgraph importiert daraus `card-carrier.js`, `card-registry.js`, `kfb-pets.js`
   (belegt in `MODULE.txt`). **Als GETEILT geflaggt.**
   **Empfehlung: erst nach dem Skydome-Slice ansehen** (`terrain-v23` bleibt als Vorlage).
5. `globe-v3/` · `globe-v4/` — **Empfehlung: behalten**, solange das Living Document sie als
   Rückweg zitiert.

### Clean-Run-Checkliste v5

1. Neu laden, Panel öffnen (**G**).
2. Acht Wächter grün: `Source constants 8/8` · `Land palette 21 slots Δ0/Δ0` ·
   `Ocean palette 9 values Δ0.000` · `Ocean follows preset ✓` · `Sky follows mood ✓` ·
   `Mood gate 4/4` · `Water gate ✓` · `Prop AO + rim ✓ 0,10–1,00`.
3. Selbsttests: `FX 3/3` · `Trauma ✓` · `Spring ✓` · `Parameters 0 off source`.
4. Konsole leer · `__bootErrors` leer · `frameFehlerZahl 0` · `wiederFehler 0`.
5. **Vier Stimmungen durchklicken — keine darf einen Wächter rot machen.**

---

## 0. Travel v14 — FROZEN seit 2026-08-12 (Fork-Basis für v15, siehe §4w)

| Artefakt | Rolle | Status |
|---|---|---|
| `KFB Travel v14.dc.html` + `terrain-v14/` (56 Module + `edge3.jpg` + 4 JSON) | Fork-Basis für v15, Vergleichsmaßstab | **FROZEN seit 2026-08-12** — nicht weiterbauen, nicht löschen |
| `docs/travel-v14/SPRINT_travel-v14.md` | Fahrplan: **W1–W3** (Werkzeuge) + Stufe 0 + Block A–D | **AKTIV, maßgeblich** |
| `docs/travel-v14/CHANGELOG_v14.md` | additiv nach oben, jede Änderung mit Zahl | **AKTIV** |
| `KFB Travel v13.dc.html` + `terrain-v13/` | Fork-Basis, Vergleichsmaßstab | **FROZEN** — nicht weiterbauen, nicht löschen |

v14 darf sich nur da anders verhalten als v13, wo eine Abnahmezahl es verlangt.
**Erledigt:** W1 (Registry-Batch-Zeichnung, siehe §1). **Als nächstes:** **E0** — `asset-index.js`
beim Coworker anfordern; sie blockiert den ganzen neuen **Block E** (Card Zone in die Reise holen).
Parallel A0 + E1–E3 (Georg entscheidet Deck-Zahl, Kartenauswahl, Zonen-Zahl).

**⚠ Drei Dinge heißen „Zone"** — Registry-Hexkarte (Landkarte zum Autorieren), Hex-Ring
(Platzierungsraster; `hexSize` = Abstand zwischen Zonenmitten in Welt-Einheiten) und Card Zone
(der **rechteckige** Ort mit Boden, Beam und Props). Sie widersprechen sich nicht: das Sechseck ist
das Raster, auf dem die rechteckigen Zonen stehen. Tabelle in `docs/travel-v14/SPRINT_travel-v14.md`
— bei Verwirrung dort nachsehen, nicht raten.

---

## 0b. Travel v13 — Import-Herkunft (Stand S93f, FROZEN)

Quelle: Coworker-Ordner `travel-v13_S93f_2026-07-29` (Workspace 1). Captures und die FROZEN-
Herkunftsdoku (v12-Fassungen) blieben drüben.

| Artefakt | Rolle | Status |
|---|---|---|
| `KFB Travel v13.dc.html` | die Reise, Stand S93f | **FROZEN** (Fork-Basis für v14) |
| `terrain-v13/` (56 Module + `edge3.jpg` + 4 JSON) | Runner + Slices | FROZEN |
| `cardbuilder/` (`kfb-card-format.js`, `-builder.js`, `-ink-canon.js`) | geteilt; `card-format` liefert `CARD_AR` an `academy-deck` / `card-registry` / `sky-cards` | AKTIV, geteilt — **nicht löschen** |
| `themes/kfb-med.css` · `themes/kayfabe.json` | Wortmarke + Palette; das DC lädt die CSS direkt | AKTIV, geteilt |
| `docs/travel-v13/` (11 Dokumente) | Cut S93f, Sprint v14, SSOT Deck/Ausschnitt, Changelog, Coworker-Handover + Change-Orders, README, KFB_CONTEXT | AKTIV |
| `docs/travel-v13/*_source_*.md` (3) | Quell-Fassungen HOUSEKEEPING / CLAUDE / github aus Workspace 1 | **FROZEN** (Referenz) |
| `docs/travel-v13/SPRINT_travel-v14.md` | Ursprungsfassung des Fahrplans | FROZEN — die gepflegte liegt in `docs/travel-v14/` |
| `terrain-v13/kfb-pets.js` | lokaler Spiegel des Pet-Stacks | **Fallback, nie Quelle** — Runner zieht `PETS_CANON` über jsdelivr |

**Abnahme 2026-08-02 (nach dem cut-v4-Import):** `runStep('fade')` und `runStep('vehicle')` → `true`,
`__bootErrors` leer, `ring.ok` → **true**. `ring.report()`: 18 Slots / 18 belegt, 6 Biome verteilt
(Filz-Sumpf 4, Zeitungsstadt 1, Ton-Ebenen 2, Stein-Katakomben 3, Holzsteg-Werft 5, Wellpappe-
Wildnis 3), Ebenen mid 6 / up 7 / down 5. **Die Zonen-Lücke aus dem ersten Import ist geschlossen.**

**Clean-Run v13 (hier)**
1. DC öffnen, ~8 s: Voxel-Welt, drei Würfel, Pet auf der Flug-Karte, Kartenblätter nach 3–8 s.
   Im versteckten Tab kommt nichts — Absicht.
2. `__travelPOC.mgr.runStep('fade', 1/60)` und `runStep('vehicle', 1/60)` → `true`,
   `window.__loopErr` → `null`. (`__bootErrors` sieht diese Fehlerklasse NICHT.)
   **Der Handle heißt `window.__travelPOC`, nicht `T`** — die alte Checkliste sagt `T.mgr`.
3. Doppelklick auf eine Karte: Pad fliegt hin, **bleibt sichtbar stehen**, dann POV-Fahrt.
4. 60 s angedockt ohne Eingabe: Tempo ~0, kein selbsttätiger Abflug. Esc: Abflug ~3,9 s, monoton.
5. Panel → *Zonen-Ring*: Bodenluft > 0, Biome-Verteilung nicht einseitig.
   (`report().luft` ist `null`, solange kein `settle` gelaufen ist — kein Fehler.)

---

## 1. Zonen- und Worldbuilder (Import cut-v4, 2026-08-02)

Quelle: `KFB Voxel + Assets Worldbuilding + Cartoon Deformer + Zone Registry v3/kfb-cut-v4`
(Coworker-Export 2026-07-26). Alle drei DCs sind flach gewurzelt (`./`) und liefen hier ohne
Pfad-Änderung — bis auf `terrain-v10/`, das nachgereicht werden musste.

| Artefakt | Rolle | Status |
|---|---|---|
| `zone-registry.json` · `zone-index.json` (Wurzel) | **der Vertrag.** Ableitungs-Wahrheit · Biome-Kanon. Gelesen von `terrain-v13/zone-ring.js` (`../zone-*.json`) UND von der Registry (`./zone-*.json`) | **AKTIV, Contract — fremd, nur lesen** |
| `KFB Zonen-Registry.dc.html` | Weltkarte: Zonen auf dem Hex-Grid, Lernstand, Flows. Der Einstieg | AKTIV (Autoren-Werkzeug) |
| `KFB Card Zone Lab v2.dc.html` | **der Ort selbst** — rechteckiger Zonenboden mit Stufen, Graben + Wasser, Karte klappt auf, **Beam** (Holo-Schleier), Projektor-Sockel, Props | AKTIV (Autoren-Werkzeug) — **bootet wieder seit 2026-08-05**: `asset-index.js` + `constructs.json` aus dem Re-Home-Export cut-v5 nachgereicht (E0 erledigt) |
| `KFB Cartoon-Verbieger.dc.html` | Prop-Verbieger am Regler (Bogen, Neigung, Verjüngung, Verdrehung, Squash); Export = Parametersatz für den Scatter | AKTIV (Autoren-Werkzeug) — bootet, lädt Props live |
| `kfb-cartoon-deform.js` | Verbieger-Modul (objekt-normiert, Per-Instanz-Seed, Normalen nachgezogen) | AKTIV — **noch nicht eingehängt** (Slice **E3z**, war W2/S88p) |
| `kfb-box-material.js` · `kfb-ink-outline.js` | Voxel-Material · Tusche-Pass (im Lab aus) | AKTIV, geteilt — Import `./asset-index.js` läuft wieder (E0-Fix) |
| `asset-index.js` · `constructs.json` | Runtime-API über `asset-repo.json` (`loadIndex`, `getSet`, `getTexture`…) · Blueprint-Format | **AKTIV — nachgereicht 2026-08-05** aus `kfb-rehome-2026-08-02` (WS-Ordner, cut-v5). E0 erledigt; Block E / O3b entsperrt |
| `asset-repo.json` · `kfb-texture-catalog.json` | Prop-/Textur-Kataloge für Lab + Verbieger | AKTIV (Daten) |
| `terrain-v10/` (`voxel-terrain.js`, `world-context.js`, `edge3.jpg`) | **kanonisch** laut cut-v4-README; die Registry importiert `./terrain-v10/world-context.js` | AKTIV — **Achtung: `terrain-v14/` hat eigene Forks beider Dateien. Zwei Wahrheiten (Slice W3).** |
| `docs/zone-registry/` (8 Dokumente) | README cut-v4, drei Handover, zwei Session-Cuts, SPEC v10 Terrain | AKTIV (Doku) |
| `docs/zone-registry/HOUSEKEEPING_source_cut-v4.md` | Quell-Fassung | FROZEN |

**Nicht importiert:** `kfb-cut-v4/cardbuilder/` und `kfb-cut-v4/support.js` — beide sind hier schon
da (v13-Fassung bzw. Projekt-Wurzel). Der Builder weicht laut v13-Doku bewusst ab (750×418 gegen
573×391); **nicht stillschweigend angleichen**, das ist eine offene Entscheidung.

**Befund beim Boot (2026-08-02) — behoben mit W1.** Die Registry-README spricht von **168 Card
Zones** — geladen werden **6321**. Vorher: 6325 SVG-Knoten, Hauptthread ~30 s blockiert. Nach der
Batch-Zeichnung (gleiche Füllung + Deckkraft = ein `<path>`, Klick über eine Sammelfläche mit
Hit-Test): **32 Knoten**, Filterklick über alle 6321 Zonen **69 ms**, keine Zone verloren.
Rückweg `drawBatch: false`. Details und Zahlen in `docs/travel-v14/CHANGELOG_v14.md`.
**Gehört beim nächsten Abgleich an den Coworker gemeldet** — es ist sein Werkzeug.

---

## 2. PetFlight

| Artefakt | Rolle | Status |
|---|---|---|
| `KFB PetFlight v2.dc.html` + `petflight.v2.js` | Flug-Bühne | **AKTIV** |
| `export/petflight-v2/` | fork-fertiges Standalone-Paket (Handover, Housekeeping, README, Assets) | AKTIV (Auslieferung) |
| `KFB PetFlight v1.dc.html` | Vorgänger | SUPERSEDED von v2 |
| `Pet Embed v2 POC.dc.html` | Embed-Probe | EXPERIMENT |
| toter „Disco"-Button im Ansicht-Panel (v2) | bewusst stehen gelassen, damit der Export byte-gleich bleibt | bekannt, DEAD-Code |

## 3. Rollercoaster

| Artefakt | Rolle | Status |
|---|---|---|
| `Rollercoaster Ride v11.dc.html` | aktueller Stand, three **0.178 / WebGPU + TSL** | **AKTIV** |
| `Rollercoaster Ride v10.dc.html` · `v9` | Vorgänger | SUPERSEDED / FROZEN (Referenz) |
| `Fractal Skydome POC.dc.html` | Skydome-Studie, Tauschkandidat | EXPERIMENT |
| `Dancefloor POC.dc.html` | Studie | EXPERIMENT |
| `Canvas.dc.html` | undokumentiert, Wert prüfen | EXPERIMENT |

**Befund 2026-08-02 — Richtung korrigiert:** In `Rollercoaster Ride v11.dc.html` steht **kein**
Erzähler, **kein** LLM-Aufruf, **kein** Audio (0 Treffer auf `narrator`, `claude.complete`,
`speechSynthesis`, `AudioContext`, `jukebox`, `sfx`). Travel v13 bringt das alles schon mit:
`narrator.js`, `narrator-llm.js`, `narrator-prompts.js` (12 Blätter live aus dem Repo),
`frizzlebob-voice.js`, `travel-audio.js`, `sfx.json`, `jukebox.json`.
**Vom Rollercoaster zu holen ist also nicht der Erzähler, sondern das Rendering** — WebGPU/TSL,
Partikel, Schienen-Kinematik. Das ist ein Renderer-Wechsel, kein Modul-Kopieren.

**Offene Integrations-Entscheidung:** drei three-Stände — Travel v13 **0.160/WebGL**,
PetFlight v2 **0.160/WebGL**, Rollercoaster v11 **0.178/WebGPU**. Vor jedem Merge klären, welcher
Stand gewinnt. WebGPU↔WebGL ist kein Versionssprung.

## 4. Grand Theft Tax (neu 2026-08-04 · **FROZEN 2026-08-05, Pivot zu Overworld v1**)

Treadmill-Konzept eingefroren — wiederkehrende Defekte waren Symptome eines zweiten
Welt-Bewegungssystems neben dem fertigen v14-Stack. Begründung + Transplantations-Tabelle:
`docs/gtt/FREEZE_gtt-v2_2026-08-05.md`. Nachfolger: §4b.

| Artefakt | Rolle | Status |
|---|---|---|
| `KFB Grand-Theft-Tax v2.dc.html` + `gtt-v2/` (4 Module + `vendor/`) | das Spiel: Strip-Architektur, KayKit-Knight, Juice, Booklet-B-UI, EN | **FROZEN** — Content-Spender für Overworld v1, nicht weiterbauen |
| `gtt-v2/vendor/` (zipkit, motion-matrix, death-variants, frankenstein-eyes/-rigs) | **Vertrag zum Asset Lab (WS1)** — dort autorisiert, hier nur lesen/spiegeln | AKTIV, fremd |
| `KFB Grand-Theft-Tax v1.dc.html` + `gtt-v1/` | erster Kern-Loop, Vergleichsmaßstab | **FROZEN** (Playtest-Basis für Living Doc §8) |
| `LESSONS_GrandTheftTax.md` | Abweichungs-Doku (Briefing-Auftrag) | AKTIV |
| `docs/gtt/HANDOVER_assets_2026-08-04.md` | Asset-Abgleich für den Coworker: 9 neue Packs ungezippt, Katalog-/Manifest-Lücken | **AKTIV — an Coworker** (gilt auch für Overworld: Brücken/Planken) |
| `docs/gtt/FREEZE_gtt-v2_2026-08-05.md` | Freeze-Begründung + was transplantiert wird | AKTIV |
| `uploads/BRIEFING_KFB_GrandTheftTax_v1.md` · `uploads/Handover_GrandTheftTax_Living_v1.7.html` | Auftrag + Living Doc | FROZEN (Referenz) |

Wiederverwendet, nicht kopiert: `terrain-v13/voxel-terrain.js`, `skydome-shader.js`, `world-palettes.js`, `travel-audio.js` (Imports über `../terrain-v13/`). GLBs live per RAW.

## 4b. Overworld v1 (Kickoff 2026-08-05)

Fork von Travel v14: freie Bewegung (walk + flight), Aggro-Gegner, KISS-Kampf (Eldermyr-Vorbild,
Mini-Healthbars), Card Zones als Wellen-Arenen mit Karten-Freischaltung. Meta-Thema
deck-agnostisch über Deck-Config.

| Artefakt | Rolle | Status |
|---|---|---|
| `docs/overworld-v1/SPRINT_overworld-v1.md` | Fahrplan O1–O7, Prinzipien, offene Entscheidungen | **AKTIV, maßgeblich** |
| `docs/overworld-v1/CHANGELOG_overworld-v1.md` | additiv nach oben, jede Änderung mit Zahl | **AKTIV** |
| `KFB Overworld v1.dc.html` + `overworld-v1/` (56 Module + ow-avatar/-combat/-arena/-zone-geo + `vendor/`) | das Spiel, Arbeitsstand | **AKTIV — O1–O3b abgenommen 2026-08-05** |
| `overworld-v1/ow-avatar.js` | Boden-Avatar: KayKit Knight + Schwert, Clips/Aktionen über den Motion-Matrix-Vertrag; geteilte Loader | AKTIV |
| `overworld-v1/ow-combat.js` | Combat Core: Skeleton-Pool, Aggro/Leash, J/Klick-Angriff, Healthbars, Coins, HUD + Wellen-API | AKTIV |
| `overworld-v1/ow-arena.js` | Zonen-Arenen: Trigger am Ring, Wellen-Regie aus waves.json, Kontext-Beats, Karten-Freischaltung | AKTIV |
| `overworld-v1/ow-places.js` | **die Ortsschicht** — Ort = reine Funktion der Hex-Kachel (deterministisch, kein Speicher); Biome-Landschaften aus `hexHomes` | AKTIV — einzige Wahrheit über Orte |
| `overworld-v1/ow-zone-geo.js` | die Zone als Ort: Boden/Graben+Fluid/Planken/Böschung/Beam, Terrain-Carve (v10-Muster im Fork) | AKTIV — führt Zonen nach Kachel |
| `overworld-v1/ow-pointer.js` | Rechtsklick = Absicht (hingehen / hinfliegen / angreifen); linke Taste gehört der Kamera | AKTIV |
| `overworld-v1/vendor/` (7 Verträge v3 + waves/vfx/lighting/pickups.js + motion-matrix, zipkit, death-variants, frankenstein-*) | Asset-Lab-Verträge, Spiegel des Check-ins `assetlab-v3_2026-08-05` | AKTIV, fremd (Asset Lab WS1) — **nur lesen** |
| `docs/overworld-v1/FEEDBACK_assetlab-v4_2026-08-05.md` | Rückmeldung an WS1: Befunde + Wünsche (motion-trails, Gear-Zonen für rig-lose Körper) | AKTIV — an Coworker |
| `docs/overworld-v1/SPRINT_fighting-pets.md` | Einschätzung + Fahrplan FP1–FP4: Pets als Kampf-Avatare („die Waffe ist der Akteur“) | AKTIV — 3 Entscheidungen offen (Georg) |

`KFB Travel v14.dc.html` bleibt **main der Reise** und wird vom Fork nicht angefasst.

**Stand:** O1–O3f-a stehen. Steuerung nach **WoW-Logik**: links ziehen = Kamera, rechts ziehen =
drehen, rechts klicken = Absicht (hingehen / hinfliegen / angreifen), WASD wie gehabt.
Terrain rastet auf 6 Stufen und ist **vollständig kletterbar** (Hindernisse müssen gesetzt
werden). **Die Ortsschicht (`ow-places.js`) ist die einzige Wahrheit über Orte** — Orte werden
aus der Kachel gerechnet, nicht vergeben; damit ist das Zonen-Flackern strukturell erledigt
(`docs/overworld-v1/BEFUND_ortsschicht_2026-08-05.md`).
**Als Nächstes: O3f-b** — Lab-Geometrie & Seed-Optionen, Sky-Card- und Beam-Shader (ohne Card
Cube / 3D-Stapel), danach Flusslauf. Parallel FP3 bei WS1. Zahlen im Changelog.

## 4c. Overworld v4_B — Re-Home + HUD v6 → **HUD v7** (2026-08-06 / 07)

Re-Home des Coworker-Exports `KFB Overworld v4/overworld-v4.1_2026-08-06` (WS-Ordner
„KFB VoxelWorld"). Verzeichnis **umbenannt** auf `overworld-v4b/`, damit §4b (`overworld-v1/`)
nicht kollidiert. `overworld-game.js` ist **nicht angefasst** — der Abnahmestand des Exports gilt.
Dazu die HUD/UI-Arbeit aus `uploads/BRIEFING_KFB_HUD_ReHome_WS1_v1.md`.

| Artefakt | Rolle | Status |
|---|---|---|
| `KFB Overworld v4_B.dc.html` + `overworld-v4b/` (12 Module + `paper-atlas.js` · `hud-v6.js` · `hud-slots.json`) | das 2D-Overworld-Spiel, Arbeitsstand hier | **AKTIV** |
| `overworld-v4b/hud-v7.js` | **das HUD** (v7.0 „Tisch & Hand") — Papier + schwarze Blockkante; Blatt / Kompass+Quest / Bühne oben, Logbuch / Karten-Hand / Almanach-Fächer unten. Kein Chat. Drei Fenster, Ambient, UI-Klang mit `cap_polyphony`, Skillpunkt-Siegel | **AKTIV** |
| `overworld-v4b/hud-v6.js` | Vorgänger (v6.2) — Würfel-Slots, Chatbar, helle Kante auf Dunkel | **SUPERSEDED** — Rückfall per Helmet-Zeile |
| `overworld-v4b/paper-atlas.js` | Teileliste Tiny-Swords-UI + 9-Slice-Setzer (Update-010: lückenloses 3×3 aus 64ern — **nicht** das Free-Pack-Raster). v7 nutzt davon **nur noch `icon('gear')`** | AKTIV, geteilt (v6 + v7) |
| `overworld-v4b/hud-slots.json` | Slot-Config, der WoW-Swap. Ein Eintrag = eine Handkarte; v7 ignoriert `skin`/`colors` aus der Datei | **AKTIV, Daten** |
| `media/3D_Assets/Audio/ui-sfx.json` (Repo, live) | **der UI-Klang** — eine Familie, 16 Ereignisse; wird in `game.audio.manifest` gemergt. Die Lulls (Hover, Tippen, Bewegung) sind Absicht | AKTIV, fremd — nur lesen |
| `overworld-v4b/hud-skin.js` (hud-v5.0) · `hud-paper.js` (hud-v4.2) | Vorgänger-HUDs. Ausbauen = im Helmet tauschen; `hud-paper` ist das Papier-Register für NPC-Dialoge | **FROZEN, Referenz — nicht löschen** |
| `docs/overworld-v4b/HANDOVER_hud-v7_2026-08-07.md` | **der maßgebliche Vertrag** — Konzept, gelesene/gerufene/gesetzte Felder, Skillpunkt-Logik, Clean-Run, offene Nähte | **AKTIV, maßgeblich** |
| `docs/overworld-v4b/HANDOVER_WS1_2026-08-08.md` | **ÜBERGABE an WS1 + Coworker** — Originalgrößen-Regel (`scale = 1`), Diff-Liste der drei geänderten Dateien, Zustandsvertrag (was WS1 verdrahten muss), Asset-Bestand mit 20 Lücken, Fremdressourcen-Bewertung, Abnahme in vier Handgriffen | **AKTIV — Einstiegspunkt für WS1** |
| `docs/overworld-v4b/INDEX_tiny-swords-assets.md` | **Asset-Index aller drei gekauften Packs** — Klasse, Kontext, Animationen mit gemessenen Frames, Zustände, Funktion, Bauweise (9-Slice/3-Slice/Bars/Schriftrollen). 20 Positionen Lücken-Liste. Geparkt: Floor Tiles | **AKTIV — Bestandsaufnahme** |
| `KFB SpriteLab v1.dc.html` | **2D-Sheet-Messplatz** — Kontaktbogen, Messprotokoll gegen die 64er-Kachel, Zustandsvertrag, Größenappell, Export `sprite-matrix.json` (Schwester von `assetlab/motion-matrix.json`) | **AKTIV** |
| `overworld-v4b/unit-loader.js` | die **eine Wahrheit** für Sprites. **V3 (2026-08-08): Originalgröße, `scale = 1`** — `sizeRel` nur noch Datum. Takt über `FPS` + `unit.frameAt(key, sekunden)`; Anker seitlich korrigiert (`sideOffset`). Takt je Einheit: `def.fpsMul` / `def.fps` | **AKTIV** |
| `docs/overworld-v4b/BEFUND_frames_2026-08-07.md` | **§10 Frame-Befund** (Takt kam vom Aufrufer, krummer Maßstab, sieben ungenutzte Animationen) · **§10.8** idle flächendeckend 1,00 s → `FPS.idle` 8→11 · **§11** Anker seitlich schief (Minotaur −28 px) · **§12 der Normierungs-Irrweg**, zurückgenommen | **AKTIV, maßgeblich für Animation** |
| `docs/overworld-v4b/BRIEFING_bewegung-buehne.md` | **nächster Sprint (M): Bewegungs-Bühne** — Wasserregel in drei Klassen, Boot-Zustandsautomat, freies Testgelände, drei Vergleichsmodi, fünf Regler + Parametersatz-Export, Arena-Anschluss vorbereitet. Entschieden 2026-08-07, **noch nicht gebaut**. Schritt 0 ist der Frame-Befund §10 | **AKTIV — Startpunkt für frischen Chat** |
| `docs/overworld-v4b/HANDOVER_hud-v6_2026-08-06.md` | Atlas-Maße (weiter gültig), v6-Vertrag | SUPERSEDED, Atlas-Teil weiter lesen |
| `docs/overworld-v4b/` (7 Dokumente aus dem Export) | Masterplan, Session-Cut v4, Changelog, SSOT Tilemap | Doku (fremd, lesen) |
| `cardbuilder/kfb-ink-canon.js` | die **eine** Kante (Preset `card`) — das HUD lädt sie relativ, jsdelivr als Rückfall | AKTIV, geteilt |

**Die Nähte, die man kennen muss.** (1) `useSignature()` gibt es im Runner nicht; Slot 4 feuert
bis dahin den schweren Grundschlag und sagt das im Charakter-Fenster. (2) Lootbox-Funde tragen
sich noch nicht in den Almanach ein — der Einflug ist gebaut, es fehlt ein `game.onLoot`-Haken.
(3) `cap_polyphony: 4` **ist seit v7 umgesetzt** — das HUD zählt seine eigenen Stimmen, weil
`audio-2d.js` es nicht tut. (4) **Skillpunkte:** das Spiel kennt keinen Vorrat (`levelUp()` fragt
sofort). v7 zeigt ein Siegel, sobald `hero.skillPoints` gesetzt ist, und gibt notfalls selbst aus —
WS1 sollte `game.spendSkillPoint(stat)` nachliefern. (5) **Kompass/Minimap** ist die nächste Runde.
(6) **`u.anim` und `u.atkT` sind seit 2026-08-07 Sekunden**, keine Framezähler — wer sie erhöht,
erhöht Zeit; den Frame rechnet `unit.frameAt()`. Älterer Code, der `Math.floor(u.anim)%frames`
macht, ist falsch (§10.2). (7) `pick('row')` liefert den Ruderstreifen (nur Paddle Shark hat einen),
aber **kein** Zustand setzt ihn bisher — das ist Arbeit des Bühnen-Sprints.
(8) **Sprites zeichnen 1:1** (2026-08-08). `sizeRel` steuert das Zeichnen nicht mehr — wer es
wieder als Maßstab benutzt, frisst die Outline-Pixel. Ausnahme nur über `def.drawScale`, ganzzahlig.
(9) **FrizzleBob + die drei KFB-Heroes sind vorerst draußen** (Georg): stilistisch unpassend, keine
Linksdrehung beim Laufen, Augenpixel. Es gibt damit **keinen Helden als Bezugsgröße** — gemessen
wird gegen die 64er-Weltkachel.

**HUD v7 ist in WS0 verbaut (2026-08-07).** Der nächste Sprint hier ist ein anderes Subsystem:
**Bewegungs-Bühne** (`docs/overworld-v4b/BRIEFING_bewegung-buehne.md`) — Fortbewegung und
Terrain-Traversal statt UI. Kern-Entscheidung: Wasser ist **kein** Ja/Nein, sondern drei Klassen
(amphibisch · Seefahrer mit Boot · Landratte mit Planke), damit `tempBridge` seinen Job behält.
**Befund aus dem Katalog:** zwei leere Boot-Sprites, Ruder-Animation nur bei `paddle_shark`,
kein Boot für große Körper (Minotaur/Troll) — an WS1 zu melden.

`KFB Overworld v1.dc.html` (§4b, 3D-Fork von Travel v14) und `KFB Travel v14.dc.html` (main der
Reise) sind davon **nicht berührt**. v4_B ist der 2D-Zweig.

## 4d. Overworld v8 — Re-Home + Terrain-Floor-Art (2026-08-08)

Re-Home von `KFB Overworld v8.dc.html` als Basis. Beschluss aus BENCHMARK §2: **die Weltschicht in
v8 ist ungleich teurer nachzubauen als unsere FX-Schicht zu portieren** — also v8-Export als Basis,
unsere Module dazu. Warnung aus derselben Quelle: `game-feel.js` **nicht doppelt** einbauen.

Diese Session hat den **Boden** bearbeitet — neun Bauarten, acht davon gescheitert. Die Fehlerkette
ist dokumentiert, weil sie der teuerste Teil der Session war.

| Artefakt | Rolle | Status |
|---|---|---|
| `KFB Overworld v8.dc.html` | die Basis, Weltschicht + Kollisionsraster | **AKTIV — Basis, hier nicht angefasst** |
| `KFB Boden-Konzept.dc.html` | **der Bodengenerator.** Neun schaltbare Ebenen (Züge · Schwamm · Trockenpinsel · KFB-Tusche · Marken · Papier · Dreck · Wabern · Feldbänder), sechs Biome, **Bandbauart**. Vollbild neu **264 ms** (vorher 5146) | **AKTIV** |
| `KFB Boden-Analyse und Briefing.dc.html` | Fehlerkette (9 Anläufe), Feldbänder-Prüfstand, **lösungsoffenes Briefing** für externe Modelle | **AKTIV** |
| `KFB Übergabe WS1.dc.html` | menschenlesbares Übergabedokument | **AKTIV — Einstiegspunkt für WS1** |
| `docs/overworld-v8/HANDOVER_WS1_2026-08-08.json` | **maschinenlesbare Übergabe** — Fraktionen, Slices, Anti-Pattern, Asset-Befunde, Messwerte | **AKTIV, Contract-nah** |
| `docs/overworld-v8/HANDOVER_WS1_2026-08-08.md` | Volldoku derselben Übergabe | **AKTIV, maßgeblich** |
| `KFB Mob Übersicht.dc.html` | Einheitenkatalog. **`BOSS_ZONE` ist jetzt SSOT** für Zone *und* Gruppe; Monk/Lancer ergänzt; Troll-Prüfhinweis | **AKTIV** |
| `KFB Boden-Werkstatt.dc.html` | Vorläufer mit Oval-/Gitter-Bauart | **SUPERSEDED** von `KFB Boden-Konzept.dc.html` |
| `scraps/troll-blatt.png` · `scraps/baer-run.png` | Abnahme-Belege zu den Asset-Befunden | **ASSET** (klein, behalten) |
| `scraps/boden-*.jpg` · `scraps/band-*.png` · `scraps/anwuchs-*.png` · `scraps/feld-probe*.png` | Zwischenstände der neun Bauarten | **DEAD** — abgearbeitet, in der Fehlerkette dokumentiert. Löschen nach Sign-off. |

**Die Nähte, die man kennen muss.**
(1) **Der Boden ist die sichtbare Schicht, nie die spielende.** Kollision bleibt beim `land[]`-Raster.
(2) **Bevel und Emboss gehören zur Höhen-/Ebenenlogik**, nicht in die Floor-Art einer Ebene — die
häufigste Vermischung in dieser Session.
(3) **`BOSS_ZONE` überschreibt nur die Anzeige.** Die Quelle ist der externe Katalog `OW_UNITS`;
dort nachziehen, sonst gibt es zwei Wahrheiten.
(4) **Troll-Sprite:** die Quelle ist geprüft und korrekt (4608×384, grüner Troll mit Keule). Zeigt
die Kachel etwas anderes, liegt der Fehler im **Zuschnitt der Übersicht**.
(5) **Monk und Lancer liegen im Free Pack**, nicht in Update 010 — und noch nicht im Katalog.
(6) ⚠ **Null Audiodateien im Repo.** Der Ansager ist verdrahtet und stumm. Jede Ton-Idee steht auf
einer Schicht, die nicht existiert.
(7) **Kostenregel:** erstes Bild < 400 ms, 60 fps beim Scrollen, **nie synchron im Zeichenpfad**
backen. Referenz ist der 36-s-Kaltstart, der das Reliefsystem umgebracht hat.

## 4e. Overworld v9-B — die rechte Spalte ist ein Kartenspiel (2026-08-08)

Auftrag Georg: Mini-Map als **Rechteck im KFB-Kartenformat mit KFB-Tuschekante**, Quest darunter als
Karten-Vorschau, Actor-Karte unten rechts (gezogen aus dem Zonen-Deck, **gespeichert**), geräumte
Szenen-Karten gestapelt darüber, Sichtzeichen bei drei Szenen — und **Motive statt Platzhaltertext**
in Almanach und Quest-Log.

| Artefakt | Rolle | Status |
|---|---|---|
| `KFB Overworld v9-B.dc.html` | v8 + zwei Skripte im Helmet. Sonst identisch (gleiche Props) | **AKTIV** |
| `overworld/card-art-v9b.js` | Kartenmotiv aus dem Deck-PDF: Seitenviertel + `yShift`, auf `CARD_AR` aufgezogen. Ein Render zur Zeit, Watchdog | **AKTIV** |
| `overworld/card-rail-v9b.js` | die Spalte: Insel-Rechteck · Quest · Szenen-Stapel · Actor + Almanach/Quest-Log als Blattraster | **AKTIV** |
| `KFB Overworld v8.dc.html` | unverändert — lädt die zwei Skripte nicht | **AKTIV, Basis** |

**Die Nähte, die man kennen muss.**
(8) **Kein Eingriff im Runner.** `overworld/` ist geteilt: das Modul hängt sich an das **fertige**
v7-HUD (versteckt Kompass und Almanach-Stapel, setzt seine Blätter an deren Platz). v8 bleibt bitgleich.
(9) **Der Kanal ist der des Spiels, nicht der des Manifests.** `baseUrl` aus `index.json` wird
verworfen, es gilt `OW_SRC.kfb()` — dieselbe Entscheidung wie in `overworld-game.loadDeck`.
(10) **Crop-Zahlen bleiben eine Zahl, ein Ort:** `yShift` wird aus `terrain-v13/card-grids.json`
gelesen, nicht kopiert. Fehlt die Datei, bleibt es beim stumpfen Seitenviertel.
(11) **Ein Blatt malt sich erst, wenn es seine Größe kennt.** Gemessen: mit `requestAnimationFrame`
blieben alle Almanach-Blätter auf dem Canvas-Standard 300×150 leer, weil im nicht sichtbaren Tab kein
Frame kommt. Also zeichnet `fillGrid` **nach dem Anhängen synchron**; der `ResizeObserver` malt nur nach.
(12) **Kein zweiter Titel auf dem Blatt.** Das PDF-Motiv trägt seinen Titel selbst; ein gesetzter
Titel darüber war doppelt und verdeckte die Illustration. Die Rolle steht als **Stempel** im Blatt
(`ISLAND · 1/6` · `QUEST · 2/6` · `SCENE 1` · `ACTOR`), der Name im Tooltip und im Almanach.
(13) **Eigener Speicher, kein Vertragsbruch.** Actor + Quest-Log liegen unter
`kfb.v9b.rail.<seed>`; das `quests`-Fach im Journey-Save von v8 bleibt unberührt (es zu belegen wäre
eine Vertragsänderung, keine HUD-Sache).
(14) **Offen:** der König lobt je geräumter Szene ein Blatt aus einer anderen Welt aus, Deckel 6 —
die *Auflösung* (Quest-Finale, Actor-Wechsel als Skill) hängt an `game.rail.setActor/dropQuest` und
ist noch nicht bespielt.

**Nicht gebaut, aber spezifiziert** (Slices M3–M6 im Handover): Sternkarte mit Turm im Zentrum und
sechs terrainfolgenden Pfaden · Kartenzone mit Gummi-Outline, Fluid-Gutter und Holzbrücke ·
drei Wellen mit Boss · lebendige Biome in vier Zuständen.

---

## 4f. UI-Baukasten TS — WS0 Paket 2 (2026-08-09)

Auftrag: `uploads/BRIEFING_WS0_v10.md` §1 Paket 2 · §2. Der Tiny-Swords-Baukasten als eigenes Modul,
mit **zwei Zeichenwegen von Anfang an** (Bildschirm für HUD, Welt für Zonentitel/Ortsschild) —
damit der Welt-Weg nicht später nachgebaut wird (Fehlerklasse »zwei Wahrheiten«).

| Artefakt | Rolle | Status |
|---|---|---|
| `overworld/ui-kit-ts.js` (uikit-v1.3) | **der Baukasten** — `paper9` · `band3` · `bar` · `fixed`, `drawScreen` / `drawWorld`, ein Cache. Misst die Slice-Blätter selbst (Alpha-Scan + Einrasten auf 64) | **AKTIV** |
| `KFB UI-Baukasten TS.dc.html` | **das Musterblatt** — Messprotokoll, vier Muster in drei Größen, Kappen-/Ecken-Beweis, Welt-Weg-Bühne, `ui-slices.json`-Download | **AKTIV** |
| `overworld/ui-slices.json` | Messdatei zum Nachlesen — **zeichengleich mit `OW_UIKIT.exportSlices()`**, denselben Weg nimmt der Download-Knopf. **Bei Abweichung gilt die Messung**, nicht die Datei | AKTIV, Daten |
| `docs/overworld-v4b/BEFUND_ui-kit-ts_2026-08-09.md` | Befunde, Messverfahren, Oberfläche, Offenes | **AKTIV, maßgeblich** |
| `scraps/uikit-rohblaetter.png` · `scraps/uikit-papers.png` | Abnahme-Belege (Rohblätter im 64er-Raster) | ASSET (klein, behalten) |
| `overworld/paper-atlas.js` (pa-v1.0) | Vorgänger: Maße als Konstanten, zeichnet **halbiert** | **SUPERSEDED** — Leser `hud-paper.js` und `asset-browser-2d.js` hängen noch daran, Umstellung in Paket 3 |

**Abnahme 2026-08-09:** 19 Blätter, 0 Fehler · **Pixelmessung 12/12 bestanden**
(Abweichung 0 an allen Kappen und Ecken) · alle Teile aller Blätter Vielfache von 64.
Ladezeit kalt über CDN 379 / 577 ms in zwei Läufen — **ohne festen Standpunkt, also keine
Abnahmezahl** (Hausregel 2), nur eine Größenordnung.

**Die Nähte, die man kennen muss.**
(1) **`Banner_Slots.png` ist ein 9-Slice**, kein 3-Slice — 192×192, lückenloses 3×3 aus 64ern,
dasselbe Format wie die `*_9Slides` des 010-Satzes. Das Briefing §2 sagt anderes.
(2) **`RegularPaper`/`SpecialPaper` sind 9-Slice-Atlanten** (320×320, 3×3 mit 64er-Lücke) —
`INDEX_tiny-swords-assets.md` §8.2 („kein 9-Slice, feste Form") ist widerlegt. Einschränkung: die
Teile tragen eine gemalte Falte, die sich über große Flächen sichtbar wiederholt.
(3) **Die Free-Pack-Bars sind 3-Slice mit Lücken** (Kappe 64 · Lücke 64 · Mitte 64 · Lücke 64 ·
Kappe 64) — eine Leiste ist in jeder Länge baubar. `Swords.png` ebenso (Trennstrich).
(4) **Die Messung rastet auf 64 ein.** Der rohe Alpha-Scan liefert den Inhalt, nicht das Fach; die
durchsichtige Fassung um eine gerissene Kante gehört zum Teil.
(5) **Im Welt-Weg bleibt der Maßstab 1.** UI-Kunst wächst nicht mit dem Kamera-Zoom (Outline-Pixel).
`scaleMode:'integer'` ist der Notausgang. Die Sortierung gehört dem Aufrufer (`sortY`).
(6) **K5-Grenze:** das Modul kennt `kfb-ink-canon.js` nicht. TS-Kunst bleibt as-is.

**Blockiert:** Paket 3 (HUD-Rework) — `docs/REVIEW_WS0_hud-v9b.md` liegt nicht in diesem Workspace.
**Nicht machbar hier:** Paket 1 (`sfx.json` ins Repo) — kein Schreibzugriff; die Datei kann gebaut,
muss aber von Georg hochgeladen werden.

---

## 4g. Overworld v10-S5 — Re-Home des Lead-Stands (2026-08-09)

Quelle: WS1-Export `KFB Overworld v10-S5/overworld-v10-S5_2026-08-09` (lokaler Ordner). Grund:
die Review sagt es selbst — **WS0 forkt bisher v8, WS1 ist bei v10-S5.** Solange die HUD-Arbeit
additiv im Helmet hängt, ist das folgenlos; sobald jemand am Runner baut, ist es Fork-Divergenz.
Der HUD-Umbau (Paket 3) setzt deshalb auf diesem Stand auf, nicht mehr auf v8.

| Artefakt | Rolle | Status |
|---|---|---|
| `KFB Overworld v10.dc.html` + `overworld-v10/` (39 Module + Font + `hud-slots.json`) | **der Lead-Stand, neue Fork-Basis für WS0** | **AKTIV — Basis** |
| `refs/KFB-Overworld-v10-S5-standalone.html` | offline lauffähige Fassung zum Durchklicken | AKTIV (Referenz) |
| `KFB Overworld Masterplan.dc.html` | der Leser für `docs/overworld-v10/MASTERPLAN_overworld.md` | AKTIV |
| `docs/overworld-v10/` (11 Dokumente + 3 Captures) | Masterplan · Briefing (2. Fassung, §2a trägt unsere Messbefunde) · **REVIEW_WS0_hud-v9b.md** · Antwort an WS0 · Changelog · Onboarding · Living Concept · Konzept-Archiv · Session-Cut · Waber-SSOT · README | **AKTIV, maßgeblich** |
| `overworld/` (v8-Linie) + `KFB Overworld v8/v9-B.dc.html` | Vorgänger-Zweig; v8 muss bitgleich bleiben | **FROZEN nach dem HUD-Umbau** — bis dahin Quelle für `card-rail-v9b.js` |

**Die eine Änderung am Export:** die 38 Skriptpfade im DC zeigen auf `./overworld-v10/` statt
`./overworld/`, weil unter `overworld/` hier die eingefrorene v8/v9-B-Linie liegt. Ein Fork-Stempel
steht im Kopf des DC. **Der Runner ist nicht angefasst.**

**Abnahme 2026-08-09 (echter Bedienweg, im Vorschaufenster gemessen):** Module **39/39** geladen ·
`ready` true · 6 Zonen · 29 Mobs · Held gesetzt · `window.__loopErr` null · **Audio 26 Ereignisse,
Ansager 12/12** (Paket 1 ist im Repo angekommen — der Ansager ist nicht mehr stumm) · Relief 6 von
9, 483 ms kalt · Boden 13/13 Blätter · **von 104 lokalen Ressourcen keine mit Status ≥ 400**.
Einzige Warnung: `drop_002.ogg` dekodiert nicht — der bekannte, bereits umgangene Defekt.

**Beim ersten Anlauf gefehlt, behoben: `hud-slots.json`.** Der WS1-Export enthält sie nicht,
obwohl das README ihn als vollständig beschreibt — bei WS1 fällt das nicht auf, weil die Datei
dort im Verzeichnis liegt. `hud-v7.js` holt sie **relativ zum Modul** und schluckt den Fehlschlag
in einem leeren `catch`: **kein Konsolenfehler, das HUD fällt still auf `FALLBACK` zurück** und
sieht dabei aus wie in Ordnung. Gefunden wurde es nur über den Netzwerkweg (ein 404 von 104
Ressourcen). Aus der v8-Linie kopiert, gegengeprüft: **Status 200, 8 Slot-Einträge**.
**Gehört in die nächste Nachricht an WS1** — ihr Export ist unvollständig.
Merksatz für diese Klasse: *ein leeres `catch` um einen `fetch` macht eine fehlende Datei
unsichtbar; wer eine Konfiguration lädt, muss ihren Fehlschlag melden.*

**Nebenbefund, behoben:** `overworld/card-rail-v9b.js` rief `game.travelPoint(x, y, label)` an zwei
Stellen **ohne das vierte Argument**. Der Runner nimmt dann drei Felder Nachsicht — auf einer
112 px breiten Insel für 240 Felder ist ein Pixel zwei Felder, also fand jeder Klick irgendein
Ufer: **der Strand-Teleport.** `hud-v7.js:858` ruft mit `1`; wer den Kompaß ersetzt, erbt die Regel.
Insel-Klick jetzt mit `1`, Peilung behält die Vorgabe (sie zeigt auf einen benannten Ort).
Das ist Konflikt (c) aus `REVIEW_WS0_hud-v9b.md` §3 — belegt und erledigt.

---

## 4h. HUD-Umbau auf den Baukasten — WS0 Paket 3, Slice A (2026-08-09)

| Artefakt | Rolle | Status |
|---|---|---|
| `KFB Overworld v10 HUD.dc.html` | **der Arbeitsstand**: v10-Runner + Baukasten + Rail. `kfb-paper-atlas.js` ist ausgehängt | **AKTIV** |
| `overworld/card-rail-v9b.js` | die Kartenspalte. Kartenkunst über `OW_ART` (Adapter statt zweitem Modul), Chrome über `OW_UIKIT` | **AKTIV** |
| `overworld/ui-kit-ts.js` (uikit-v1.5) | + Icons (10 × 3 Zustände) · Zeiger (6) · Münzblätter · **Bandblätter mit Farbzeilen** (`band3(key,w,zeile)` / `band3By(key,w,'blue')`) · `icon` `pointer` `strip` `url` `src` `iconSrc` `pointerSrc` | **AKTIV** |
| `overworld-v10/units-catalog.js` | **zusammengeführt** aus der WS0-Fassung, gegen die v10-S5-Fassung gediffed (31/31 Einheiten, keine verloren). + Lancer/Monk, Menschen-Avatare als Regel, Gegner-Avatare 12→6 ungeklärt. Fork-Stempel im Kopf | **AKTIV — Diff an WS1** |
| `overworld-v10/hud-v7.js` | **von WS0 geändert** (WS1: »die Datei gehört euch«): Zahnrad aus dem Baukasten, `hud-slots.json`-Fehlschlag wird gemeldet | **AKTIV — Diff an WS1** |
| `docs/overworld-v10/BEFUND_hud-umbau_2026-08-09.md` | Umbau, Messungen, die zwei Laufzeitfehler, der nächste Slice | **AKTIV, maßgeblich** |
| `overworld/card-art-v9b.js` | zweites Kartenkunst-Modul | **DEAD** — nirgends mehr geladen, löschbar nach Sign-off |
| `overworld/paper-atlas.js` · `overworld-v10/kfb-paper-atlas.js` | Vorgänger-Teileliste | **SUPERSEDED** — im HUD-DC ausgehängt; Rückbau im Runner-Helmet ist ein Vorschlag an WS1 |

**Abnahme 2026-08-09 (echter Bedienweg):** die vier Punkte aus dem Briefing erfüllt — Kompaß
sichtbar (Insel zeichnet, 516 deckende Proben) · `snap`-Fix intakt · **ein** Kartenkunst-Modul ·
Pfad zu `card-grids.json` stimmt (`OW_ART` liest neben sich selbst). Dazu: `__loopErr` null ·
**keine Ressource mit Status ≥ 400** · 5 Blätter, 4 mit Motiv · `KFB_PAPER` nicht mehr geladen.

**Die Nähte, die man kennen muss.**
(1) **Der Adapter ist kein Modul.** `OW_ART` liefert Versprechen, das Rail braucht im Zeichentakt
eine synchrone Antwort — der Adapter hält nur das Ergebnis. `ready`/`decks`/`deckCards` benutzen
**dieselbe Auswahlregel und dieselben Feldnamen wie der Runner** (`loadDeck`).
(2) **Zwei Zugriffsarten auf eine Teileliste.** `icon()` misst und braucht `load()`;
`iconSrc()` gibt nur die Adresse und ist synchron — Chrome, das beim Anhängen gebaut wird, kann
nicht auf ein Versprechen warten.
(3) **Eine Regel an der Eingangstür gilt nicht für das, was schon im Haus ist.** Gespeicherte
Quests umgingen die Regel »nur gemessene Decks« und zeigten angeschnittene Karten; sie werden
jetzt beim Aufwachen verworfen. Derselbe Fehler wie `CA.ready`: beides fiel **still** aus.
(4) **`hud-v7.js` gehört WS0** (WS1, 9.8.) — Änderungen daran gehen als Diff zurück, nicht als
stiller Fork.
(5) **Das Heldenblatt prüft Fähigkeiten, nicht Versionen.** `popCost`/`popSpend` da → POP kauft;
nicht da → der alte Punkte-Weg. V10-S6 ist im vorliegenden Export **noch nicht enthalten**, also
ist der neue Weg `GEBAUT`, nicht `LÄUFT` — Beleg braucht einen Export mit S6.
(6) **Kein Level mehr im HUD-Text.** Damit ist WS1s Shadow-Regel, die unsere Level- und
»Frequency«-Zeile ausblendet, überflüssig.
(7) **Almanach und Quest-Log sind zwei Ringe** (Slice C). Die Blattgröße ist FEST — sie ist die
der Aktionskarten. Wer sie wieder variabel macht, holt sich das Neuzeichnen je Bild zurück:
Canvas-Blätter dürfen nicht per CSS skaliert werden, sonst weicht die Tuschekante auf.
Geometrie: Drehpunkt fünf Blattbreiten rechts außerhalb, Schritt 0,62 Blatthöhen, daraus der
Winkel (4,08° bei 87 px Blattbreite). Der Ausgriff nach rechts wird ausgeglichen — ohne das
standen 36 px über dem Bildrand.
(8) ⚠ **Ein Backtick in einem CSS-Kommentar beendet das Template-Literal.** Zum dritten Mal
getreten, diesmal zwei Zeilen unter der Warnung davor. Symptom: das Rail fehlt vollständig,
das HUD sieht dabei heil aus.
(9) **Ein Bandblatt darf Zeilen haben.** `Swords.png` sind **fünf liegende Schwerter, eines je
Farbe** (blau · rot · gelb · lila · stahl), je 3-Slice: Griff 128 · Klinge 64 kachelbar ·
Spitze 128, Zeilenhöhe 128. Der Messcode setzte für Bänder pauschal `rows=[[0,h]]` — »Band« hieß
dort »eine Zeile« — und meldete deshalb eine 602 px hohe Klinge, die es nicht gibt.
**Eine Messung, die auf einer Annahme sitzt, misst die Annahme.** Behoben in uikit-v1.5;
Kappen-Beweis 0 für alle fünf Farben.
(10) **Das Panel des Runners zeigt seit V10-S6 dasselbe noch einmal** (FLUFF · XP mit POP · Level ·
drei Werte) und liegt an derselben Stelle wie unser Blatt. Der erste Anlauf blendete nur die
Zeilen weg — zu wenig: **der Kasten selbst blieb stehen** und lag als graugrüne Platte über
unserem Papier. Jetzt fällt der Kasten mit (Hintergrund, Rahmen, Polsterung). **Was bleibt, sind
die Kayfabe-Ladungen** (`.kf`) — die zeigt unser Blatt nicht, und wer eine Anzeige versteckt, die
er nicht ersetzt, nimmt dem Spiel eine Auskunft weg. Gemessen: Panel-Hintergrund transparent,
genau ein sichtbares Kind (`kf`), **nichts Fremdes mehr im Statkasten**.
(11) **Papier ist Papier, kein Glas.** Die Statleiste lief auf der gemeinsamen Sichtbarkeit des
Rails (`--r9op` 0,78) mit. Bei den kleinen Kartenblättern fällt das nicht auf, bei einer Fläche
von 446×69 schon — das Gras schien durch und machte aus dem Papier eine olivgrüne Scheibe.
Das war Georgs Befund »die alte Fluff-Box wiederherstellen«: nicht die Tusche fehlte, die
**Deckkraft**. Gemessen nach dem Fix: Deckkraft 1, Papier rgb(237,229,208), voll deckend.
Die gemeinsame Sichtbarkeit gilt weiter für alles, was Teil des Bildes ist; ein beschriebenes
Blatt gehört nicht dazu.
(12) ⚠ **Vierter Backtick-Treffer im CSS-Literal** — diesmal im Kommentar, der Punkt (11) erklärt.
Andere Fehlermeldung (»Invalid left-hand side expression«), gleiche Wirkung: kein Rail.
**Wer im CSS-Block einen Bezeichner nennt, schreibt ihn ohne Backticks** und prüft danach, dass
der Block null Backticks enthält.

---

## 4i. Re-Home v10-S10 — der zweite Export des Tages (2026-08-09)

Quelle: WS1-Export `overworld-v10-S10_2026-08-09`. Bringt **V10-S6 (POP)** und alles danach; ersetzt
den S5-Stand. Selektiv re-homed: **zwei Dateien wurden NICHT überschrieben**, weil WS0 sie führt.

| Artefakt | Rolle | Status |
|---|---|---|
| `KFB Overworld v10 HUD.dc.html` | Arbeitsstand: S10-Runner + Baukasten + Rail, `kfb-paper-atlas.js` ausgehängt | **AKTIV** |
| `overworld-v10/` (46 Module + Font + 3 JSON) | S10-Stand · neu: `bubble-ts.js` (Sprechblase aus Pet Studio v4, bedienbar) · `chatter-phrases.js` (8 Fraktionen × 8 Felder) | **AKTIV — Basis** |
| `overworld-v10/hud-v7.js` | **nicht ersetzt** — S10s Fassung ist zeichengleich mit unserer Basis bis auf genau die drei Zeilen, die wir geändert haben. Es gab nichts zu übernehmen | **AKTIV — Diff an WS1** |
| `overworld-v10/units-catalog.js` | **nicht ersetzt** — unsere zusammengeführte Fassung (317 Zeilen gegen 252); WS1 hat den Diff noch nicht eingebaut | **AKTIV — Diff an WS1** |
| `docs/overworld-v10/` | + Antwort Runde 3 (Signaturen) · Masterplan §6 mit Aufruf-Tabelle · Changelog · **`EXPORT_PRUEFLISTE.md`** (aus unserem Befund entstanden) | **AKTIV** |
| `refs/KFB-Overworld-v10-S10-standalone.html` | offline lauffähig | AKTIV (Referenz) |
| `scraps/hud-v7-S10.js` · `scraps/units-catalog-S10.js` | die WS1-Fassungen als Vergleichsmaßstab | ASSET (klein, behalten) |

**Abnahme 2026-08-09:** `ready` true · Rail hängt · `__loopErr` null · **keine Ressource ≥ 400** ·
`popCost`/`popSpend` vorhanden · Held: **POP 8**, sechs Werte aus dem Runner, kein Level ·
Sprechblase und Fraktions-Phrasen geladen · Baukasten uikit-v1.4 · fünf Ritterklassen.

**Die Naht, die man kennen muss.** Drei Annahmen über die POP-Oberfläche waren falsch, und der
teuerste Punkt war der dritte: **vier der sechs Werte hießen im Rail anders** (`kayfabingo` gegen
`bingo`) und wurden dort als eigene Zahl geführt, weil der Runner sie früher nicht kannte. Seit
V10-S6 gehören alle sechs dem Runner. Ohne den Abgleich hätte das Heldenblatt vier Zahlen gezeigt,
die mit dem Spiel nichts zu tun haben — zwei Wahrheiten, und die stillere hätte gewonnen.

---

## 4j. POP-Knopf, Tab ohne Sprung, untere Bahn — Slice A2 (2026-08-09)

| Artefakt | Rolle | Status |
|---|---|---|
| `overworld/card-rail-v9b.js` | POP als runder Knopf mit Zahl darin; `lean` ohne Hover-Sprung; `lane()` verteilt Logbuch und Aktionskarten | **AKTIV** |
| `overworld/ui-kit-ts.js` | + `btnRound` (TinyRoundBlueButton) als `fixed`-Teil | **AKTIV** |

**Gemessen (681 px Breite):** POP-Knopf 32 × 32 mit Zahl darin · Abstand Logbuch → erste Karte
**14 px** · rechts 150 px frei · kein Hochsteigen nötig.

**Die Nähte.**
(13) **Ein Kreis hat keine dehnbare Mitte** — der runde Knopf ist `fixed`, nicht 9-Slice; 64 → 32
ist exakt halbiert und bleibt auf ganzen Pixeln.
(14) **Fester Kasten statt Textzeile:** die Zahl liegt IM Knopf, damit dreistellige Stände die
Zeile nicht schieben.
(15) **Eine Transform zählt für das Layout nicht.** Der Kartenfächer kippt per `transform`, also
wusste die Hand nichts von ihrer wirklichen Breite und schob ihr linkes Blatt unter das Logbuch.
`lane()` misst die belegten Rechtecke, statt mit Breiten zu rechnen.
(16) **Eine mittig gesetzte Reihe verschluckt die Hälfte** eines linken Polsters — gemessen kamen
von 26 px genau 13 an. Wird verdoppelt, solange `justify-content: center` gilt.
(17) **Wer weniger zeigen will, zeigt dauerhaft weniger — nicht abwechselnd.** Der `lean`-Tab
wechselte beim Zeigerkontakt die Breite (346 ↔ 446); das ruckte durchs Bild. Jetzt eine Breite.
(18) ⚠ **Zwei verschiedene Dinge unter einem Klassennamen sind die »zwei Wahrheiten«-Klasse in
CSS.** Das Badge hiess zuerst `.pop` — den Namen besitzt der Runner aber schon, als Vollbild-Modal
mit `background: rgba(12,18,15,.72)`. `position` und `display` wurden überschrieben, **der
Hintergrund nicht**: hinter dem runden Knopf mit durchsichtigen Ecken lag ein schwarzes Quadrat.
Ein Fehler, der nur an den Ecken sichtbar wird und sonst wie Absicht aussieht. Jetzt `.r9acct` —
rail-eigen, wie jede andere Klasse des Rails. **Vor jedem neuen Klassennamen im fremden Shadow-Root
gehört ein Blick in dessen Stylesheet.** Gemessen nach der Umbenennung: Hintergrund transparent.

---

## 4k. Avatare: alle geprüft, gemappt, korrigiert (2026-08-09)

Anlass: Georgs Befund »das Avatarbild ist falsch (war schon öfter so)«.

| Artefakt | Rolle | Status |
|---|---|---|
| `overworld-v10/units-catalog.js` | Zuordnung korrigiert; `HAV_SLOT` (Klasse → Platz) statt nackter Ziffern; Schwarz-Block ergänzt | **AKTIV — Diff an WS1** |
| `docs/overworld-v10/BEFUND_avatare_2026-08-09.md` | Verfahren, beide Tabellen, Belege | **AKTIV, maßgeblich** |
| `scraps/avatare-25.png` · `avatare-16-25.png` · `avatar-vs-unit3.png` · `gegner-avatare.png` · `gegner-zuordnung.png` | die Prüfbilder — jedes Blatt neben seiner Einheit | ASSET (klein, behalten) |

**Vorher/nachher:** Menschenklassen richtig 1/5 → **5/5** · Gegner mit Porträt 12 → **18** ·
offene Blätter 6 → **0** · spielbar ohne Porträt 6 → **1** (FrizzleBob, hat kein Blatt).

**Die Nähte.**
(19) **»Gemessen an der Übersicht« war nicht gemessen.** Der Kommentar behauptete die Reihenfolge
Warrior · Archer · Pawn; am Bild ist sie **Warrior · Lancer · Archer · Monk · Pawn**. Vier von fünf
Klassen trugen ein fremdes Gesicht — und keine so falsch, dass es beim Vorbeischauen auffällt.
(20) **Eine nackte Ziffer kann man nicht falsch finden, nur falsch haben.** `humanAvatar(c,1)`
stand an fünf Stellen. Jetzt nennt die Klasse ihren Platz selbst (`humanAvatar(c,'monk')`).
(21) **Ein Aufrufer, dem eine Farbe fehlt, fällt still auf die Vorgabe zurück.** `HAV_BASE` kannte
kein Schwarz, also trugen die fünf Schwarz-Ritter blaue Porträts — ohne eine Zeile Warnung.
(22) **»Offen« hieß: noch nicht hingesehen.** Sechs Gegner-Blätter galten als unklärbar; alle sechs
haben ein eindeutiges Gegenstück. Ohne Blatt bleiben genau zwei (`pig`, `pig_rider`).
(23) **Prüfen heißt nebeneinanderlegen.** Erst auf 130–150 px vergrößert wird ein Strohhut ein
Strohhut und eine Zipfelmütze eine Zipfelmütze — in Miniatur sind beide »klein, bunt, mit Hut«.
(24) **Die POP-Zahl saß nie schief** (gemessen: Versatz 0/0 zur Knopfmitte, Ziffernmitte gegen
Zeilenbox 0,11 px). Schief aussah sie wegen des gerichteten Schattens `0 1.5px`. Auf einer runden
Scheibe ist ein Schatten mit Richtung immer eine Behauptung über Licht — jetzt ein symmetrischer
Umriss, der nichts behauptet.

---

## 4l. Baukasten erweitert: 19 → 96 Teile (2026-08-09)

`overworld/ui-kit-ts.js` **uikit-v1.5**. Neu: Knopfzustände (Zeiger · gesperrt · gedrückt) als
3- und 9-Slice, Reiter rot, `Carved_Regular`, die beiden hängenden Banner — und **28 Verbinder
für Menübäume**, die als Regel stehen statt als Liste (`conn_blue_up`, `conn_red_left_pressed`,
`conn_banner_down`).

**Gemessen:** 96 Blätter, **905 ms** kalt (vorher 3003 ms bei denselben 96), 0 Fehler, alle
Pixelbeweise weiter bestanden.

**Die Nähte.**
(25) **Nebenläufig laden, sonst wartet jedes Blatt auf seinen Vorgänger.** Bei 19 Teilen fällt das
nicht auf, bei 96 sind es 2 Sekunden reine Wartezeit. Die Messung bleibt in Listenreihenfolge
(lesbares Protokoll), Fehler bleiben einzeln — ein fehlendes Blatt reißt die anderen 95 nicht mit.
(26) **28 Blätter als Liste sind unlesbar, als Regel sind sie sechs Zeilen.** Benannt wird nach
dem, wonach man sucht: Farbe, Richtung, Zustand.
(27) **`Carved_Regular` ist `fixed`, kein Slice.** Ein fertiges Täfelchen von 1,2 kB — wer es
dehnt, dehnt eine Zeichnung. Dehnbare Tafeln heißen `carved3` und `carved9`.

---

## 4m. Das leere Statblatt — Zustand am Bildtakt (2026-08-09)

`renderStats()` · `paintAvatar()` · `lane()` standen allein in der rAF-Schleife. Drosselt der
Browser die Bilder (Vorschau ohne Fokus, versteckter Tab, Screenshot-Lauf), läuft `frame()` nie —
das Blatt wird gebaut, aber **nie befüllt**: kein Fluff, keine Werte, POP 0, kein Gesicht, und
**keine Zeile Fehler**. Behoben: die drei hängen zusätzlich an der 800-ms-Uhr, die es in dieser
Datei längst gibt.

**Die Nähte.**
(28) ⚠ **Was einen Zustand zeigt, darf nicht am Bild hängen.** Animation gehört in die
Bildschleife, ein Zahlenstand nicht. Die Regel stand seit dem Kill-Wurf im selben File —
die Zustandsanzeigen waren nur nicht darunter gehängt.
(29) **Der Beleg lag im Log und wurde überlesen:** `[card-art] Wachhund: Render hängt (Tab
inaktiv?)` — ein anderes Modul meldet genau diesen Zustand. Wer eine Wachhund-Warnung eines
fremden Moduls ignoriert, verschenkt eine fremde Messung.
(30) **`lane()` prüfte `display` und `visibility`, nicht `opacity`.** Das eingeschlafene
Logbuch (opacity 0) reservierte weiter Platz. Was man nicht sieht, schiebt keine Karten.

**Gemessen im gedrosselten Zustand:** 120/120 · POP 8 · BZ 3 KF 2 BI 1 BO 1 BG 1 BS 0 · Porträt
108 px sichtbar · `--r9hand` 89 px.

---

## 4n. Skins, Snacks, Popcorn-Tüte — **Sprint für einen frischen Chat** (konsolidiert 2026-08-10)

Zwei WS1-Briefings (Lulls-Skins · Food/Googly/Popcorn) plus ihre Antwort mit den Sign-offs, in
**einem** Blatt zusammengeführt. Rein visuell, absurd, **ohne jeden Bonus** (K1). **Noch nicht gebaut.**

| Artefakt | Rolle | Status |
|---|---|---|
| `docs/overworld-v10/SPRINT_skins-snacks_2026-08-10.md` | **das eine Blatt**: Vertrag, Physik, die vier Stücke, fünf Klärungen mit Messwerten, Showroom, Reihenfolge | **AKTIV — Startpunkt für frischen Chat** |
| `docs/overworld-v10/BRIEFING_lulls-skins_2026-08-10.md` | erstes Briefing im Wortlaut | **SUPERSEDED** — in den Sprint gefaltet, löschbar nach Sign-off |
| `overworld/skins-2d.js` · Showroom-DC | `OW_SKINS.draw(ctx, skinId, u, dt, moved)` + `OW_SKINS.list()` | **GEPLANT** |

**Die drei Fragen sind beantwortet — mit Code.** WS1 hat den **Zeichen-Haken gebaut** (V10-S22: im
Runner, nach der Einheit, vor dem Etikett, getragen von `u.skin`), den Zustand uns gegeben
(Schlüssel Einheit × skinId, WeakMap) und die zweite Uhr in den Vertrag geschrieben. Der Luftballon
wird **gezeichnet**, nicht gekauft. Unser K1-Testfall ist übernommen.
**Damit ist die Blockade weg — und durch eine andere ersetzt: der Haken ist in S22, wir sind auf
S10.** Das Re-Home ist Schritt null dieses Sprints, keine Aufgabe daneben.

**Fünf Klärungen, die WS0 gemessen hat und die vor dem ersten Bild entschieden sein müssen:**
1 ⚠ **Augengröße 12–14 px passt nicht.** Das Briefing rechnet mit `bodyH 72–86`; gemessen sind
  **31–111 px** (Schaf 31, Bär 111). 13 px sind auf dem Schaf 42 % der Körperhöhe. Also **Anteil von
  `bodyH`**, nicht absolute Zahl.
2 **Das Food-Emote-Pack gibt es so nicht.** Im Repo: `Foods Asset HQ` (bis 4,2 MB, die »zu glatte«
  Variante), `Foods Assets Small`, und `Foods Assets CartoonOnion` — **eine Zwiebel in zehn
  Stimmungen**, keine Speisensammlung. Die Biome-Zuordnung hat noch keine Quelle.
3 **Kenney Googly Eyes liegen nicht im Repo** (0 Treffer in 3153 Dateien) — und **vier Lider bekommt
  man aus einem Sprite ohnehin nicht heraus**. Zeichnen ist hier nicht der Notnagel, sondern richtig.
4 **`KFB Pet Studio v4.dc.html` fehlt** in Projekt, S22-Export und Repo (nur der 3D-Pet-Editor ist
  da). Ohne das Rig bauen wir die Lider neu und tauschen sie später — genau das, was vermieden
  werden soll.
5 ⚠ **Die Popcorn-Tüte kollidiert mit dem POP-Knopf von gestern** (§4j/§4o): Icon + Zähler + Knopf
  gibt es bereits einmal. Zwei Bedienstellen für eine Währung sind zwei Wahrheiten. Dazu der
  ausgesprochene Widerspruch: »das Buffet darf kein Menü werden« — unsere Einkaufsliste **ist** eine
  Liste mit Preisen und wurde gestern abgenommen. **Preise zu zeigen ist nicht dasselbe wie Werte
  anzuzeigen**; ein Automat ohne Preisschild ist ein Glücksspiel. Georg entscheidet.

**Sign-offs von WS1 (10.8.), hier nachgetragen:** Schwert-als-Wappen **Go** · Almanach/Quest-Log als
zwei Ringe **Go** · `overworld/card-art-v9b.js` löschen **Go** · `scraps/boden-*.jpg` löschen **Go** ·
§5 uploads sichten **Go** (behalten, was ein Sprint zitiert).
**Der Ink-Kanon gehört WS1** — `bend`/`torn` bauen sie, wir liefern die Anforderung (wofür, welche
Größe, welche Anmutung). Damit ist unsere Blockade B beantwortet, nicht mehr offen.
**`game.onLoot`:** WS1 baut den Haken, sobald wir sagen, was wir brauchen — Ereignis mit Karte und
Zone oder nur ein Zähler. *Sie raten es ausdrücklich nicht.*

---

## 4o. Statblatt: Name, Titel, Padding — und der Almanach-Befund (2026-08-10)

| Artefakt | Rolle | Status |
|---|---|---|
| `overworld-v10/identity.js` | **aus dem WS1-Export S22 vorgezogen** (ident-v1, V10-S20): Name, Titel, Schmähung. Die eine Wahrheit über »wer ist der Spieler« | **AKTIV, fremd — nur lesen/rufen** |
| `overworld/card-rail-v9b.js` | Namenszeile im Statblatt (Name schreibbar, Titel durchblätterbar), Polster oben/unten 13/14 px, `reconcile()` an der 800-ms-Uhr | **AKTIV** |

**Notiz für den nächsten Sprint (Georg, 10.8.):** das **alte Fluff-Box-Design von WS1** ist wegen der
**Dreier-Gruppen** der Werte besser lesbar als unsere Sechserzeile (2 × 3 statt 1 × 6, Wert und
Kürzel als Paar). Daraus ein **Best-of** bauen: unsere Kante, unser Papier, unser POP-Knopf — ihre
Gruppierung und ihr POP-Band (»+21 POP to spend →« als ganze Zeile statt nur als Knopf).
Belege: `uploads/Bildschirmfoto 2026-08-10 um 00.47.33.png`.

**Die Nähte.**
(31) **Titel entstehen nur, wenn jemand fragt.** `OW_IDENT.pruefe()` ruft in unserem S10-Stand
niemand (die Titel kamen mit S20). Das Blatt fragt jetzt selbst — **mit dem, was hier bekannt ist**
(geborgene Karten, Ruf) und ohne erfundene Felder (Jagd, Schreie fehlen im S10-Runner).
(32) **Der Name wird an Ort und Stelle geschrieben.** `prompt()` kann in einem eingebetteten Rahmen
unterdrückt werden — dann passiert nichts, ohne eine Zeile Fehler. Ein bearbeitbares Feld kann das
nicht. Dazu: **die Tasten dürfen nicht durchfallen**, sonst läuft der Held mit WASD durch die Welt,
während man seinen Namen tippt.
(33) ⚠ **Zum ZWEITEN Mal: Zustand am Bildtakt** (§4m, Naht 28). `reconcile()` — das, was ein
Kartenblatt vom Textstand auf sein Motiv hebt — stand allein in der rAF-Schleife. Im gedrosselten
Tab lief sie nicht, also blieben Almanach und Quest-Stapel dauerhaft Text, **obwohl das Motiv im
Speicher lag** (gemessen: `OW_ART.art()` antwortete in 0 ms aus dem Cache). Das war Georgs Befund
»almanac cards werden nicht angezeigt«. Jetzt hängt `reconcile()` an der 800-ms-Uhr.
**Merksatz, jetzt zweimal bezahlt: was einen Zustand HEILT, gehört nicht ans Bild.**
(34) **»Unlesbar« darf nicht »für immer« heißen.** Drei Fehlversuche galten als kaputtes Deck, der
Eintrag flog aus der Liste — und drei Fehlversuche sind im Hintergrundtab der Normalfall, weil der
Wachhund von `card-art-2d` zuschlägt. Jetzt: 30 Sekunden Ruhe statt Todesurteil, und **im
versteckten Tab wird gar nicht gezählt** — ein Fehlschlag dort ist eine Aussage über den Tab.
(35) ⚠ **Fünfter und sechster Backtick-Treffer im CSS-Literal**, dazu eine neue Verwandte:
`content:'\00b7'` ist im Template-Literal eine **Oktal-Escape** und damit ein Syntaxfehler
(»Octal escape sequences are not allowed in template strings«). Wirkung wie immer: kein Rail, HUD
sieht heil aus. **Im CSS-Block gehören weder Backticks noch `\0…`-Escapes — Zeichen direkt setzen.**

---

## 4p. Re-Home auf v10-S22 — W1 Schritt null (2026-08-10)

Quelle: WS1-Export `overworld-v10-S22_2026-08-10` (`uploads/Georg's Infinite Canvas (8)/`). Ersetzt den
S10-Stand aus §4i. **Der Fork-Punkt, den `UPDATE_WS0_2026-08-10.md` §4 verlangt** — die HUD-Linie
sitzt jetzt auf dem aktuellen Runner, nicht mehr zwei Slices dahinter.

| Artefakt | Rolle | Status |
|---|---|---|
| `overworld-v10/` (S22-Stand, 50 Module + Font + 3 JSON + `backs/`) | **die neue Basis** | **AKTIV** |
| `overworld-v10/card-backs.js` + `backs/` (4 PNG) | Kartenrückseiten je Zone (V10-S16) | **AKTIV — neu** |
| `overworld-v10/rss-2d.js` | RSS als Plauder-Quelle (V10-S13), Regler standardmäßig **off** | **AKTIV — neu** |
| `overworld-v10/zone-story.js` | Mini-Story je Zone (V10-S17), sechs Anlässe | **AKTIV — neu** |
| `overworld-v10/units-catalog.js` | **nicht ersetzt** — unsere zusammengeführte Fassung (317 Zeilen, §4h/4k). WS1 hat den Diff noch nicht eingebaut | **AKTIV — Diff an WS1** |
| `overworld-v10/hud-v7.js` | **S22-Fassung genommen** + unsere zwei Eingriffe wieder aufgetragen | **AKTIV — siehe unten** |
| `scraps/hud-v7-WS0-preS22.js` | unsere Fassung vor dem Re-Home, als Vergleichsmaßstab | ASSET (klein, behalten) |
| `KFB Pet Studio v4.dc.html` | **das Augen-Rig** — Klärung 4 aus §4n ist damit geschlossen | **AKTIV, fremd — nur lesen** |
| `refs/KFB-Overworld-v10-S22-standalone.html` | offline lauffähig | AKTIV (Referenz) |

**Abnahme 2026-08-10 (echter Bedienweg, Konsole gelesen):** Module **39/39** · **keine Fehlerzeile** ·
Audio **26 Ereignisse, Ansager 12/12** · Relief 7 von 9, **417 ms** kalt · Boden 13/13 Blätter ·
Welt 240×180, **6 Zonen**, 23 Mobs + 8 Wegelagerer · Rückseiten-Satz kfb **4 Blätter** ·
`[rail-v9b] Kartenspalte steht` · Tutorial-Zone besetzt (skull am Tor, pig als Übungsgegner) ·
`[hud-v7] Kanon: kfb-ink-canon.js · opt ja`.
**Kein Warnruf zu `hud-slots.json`** — sie lädt, unser wieder aufgetragener Melder schweigt zu Recht.

**Der `hud-v7.js`-Handgriff, und warum genau so.** WS1 hat die Datei an **sechs** Stellen angefaßt
(12 markierte Blöcke `WS1-Eingriff 9.8.`); unsere S10-Fassung hatte **null** davon — der Diff war real,
nicht die drei Zeilen aus §4i. Also: **S22-Fassung als Basis** (sie trägt die sechs Leser: POP statt
Level, sechs Werte aus `game.STAT_KEYS`, Farben aus `STAT_INFO`, `openPts` am Kontostand, Slot-Preise
aus `popCost`, Name/Titel-Zeile) und unsere zwei Eingriffe darauf neu:
(a) **Zahnrad aus dem Baukasten** — `PA()` fällt jetzt `KFB_PAPER` → `OW_UIKIT.iconSrc` → Glyph,
weil `kfb-paper-atlas.js` im HUD-DC ausgehängt ist;
(b) **`hud-slots.json`-Fehlschlag wird gemeldet** statt in einem leeren `catch` zu verschwinden.

**Die Nähte.**
(36) **Ein Diff, den man nicht sieht, ist keiner.** §4i notierte »zeichengleich bis auf drei Zeilen« —
gemessen war das ein Vergleich gegen S10, nicht gegen S22. Zwischen beiden liegen POP (S6) und
Name/Titel (S20). **Wer »identisch« schreibt, muß dazusagen, gegen welchen Stand.**
(37) **Die Reihenfolge der Skripte ist eine Messung, keine Meinung.** `card-backs.js` steht im
Runner-DC des Exports zwischen `card-ink-2d` und `card-art-2d`, `rss-2d` nach `chatter-2d`,
`zone-story` nach `bubble-ts`. Übernommen wie geliefert — eine umgestellte Abhängigkeit fällt erst
in der Zone auf, nicht beim Start.
(38) **`OW_UIKIT.iconSrc` statt `icon`, weil Chrome beim Anhängen gebaut wird** (§4h Naht 2). Die
messende Variante gibt ein Versprechen; das Zahnrad kann nicht warten.

**Damit offen, und es ist unsere Liste, nicht ihre:** die vier Punkte, die in den neun WS0-Slices
(`UPDATE_WS0_2026-08-10.md` §5) **nicht vorkommen** — Slice C (zwei Ringmenüs, »Go« am 10.8.) ·
Schwert-als-Wappen (»Go«) · Best-of-Statblatt aus §4o (ihre Dreier-Gruppen, unser Papier, ihr
POP-Band) · **die Icon-Pfade** (`overworld/icons-rpg/` ist relativ und bricht im Standalone-Export;
gehört nach `media/2D_Assets/icons-rpg/` mit `OW_SRC`-Routing). Sie gehören in ihre Reihenfolge,
sonst verschwinden sie still.

---

## 4q. Echte Rückseiten, Stapelgröße — und der Crop-Befund (2026-08-10)

| Artefakt | Rolle | Status |
|---|---|---|
| `overworld/card-rail-v9b.js` | Rücken-Stapel nimmt `OW_BACKS` statt `OW_CARD.back()`; überlagert die Insel knapp, vier feste Lagen | **AKTIV** |
| `overworld-v10/card-backs.js` | Pfade lösen relativ zum **Modul** auf, nicht zum Dokument | **AKTIV — Diff an WS1** |

**Gemessen:** `[rail-v9b] Rückseiten kfb 4 geladen 4 gefehlt 0` · `[backs] Satz kfb · 4 Blätter ·
Zonen belegt **6/6** · Varianten 3` (vorher **0/6**, Varianten 1).

**Die Nähte.**
(39) **Ein Modul, das nachlädt, muß relativ zu SICH auflösen.** `card-backs.js` trug
`overworld/backs/…` — dokumentbezogen, also richtig neben WS1s DC und falsch neben unserem
(`overworld-v10/`). Und weil `für()` einen Rückweg auf das alte Einzelblatt hat, wurde daraus
**kein Fehler, sondern eine still falsche Rückseite in allen sechs Zonen.** Dieselbe Klasse wie
`hud-slots.json` (§4g). Behoben über `document.currentScript.src`.
(40) **Das Rail war älter als das Modul.** Es rief `OW_CARD.back()` — das *gezeichnete* Ersatzblatt
mit den Buchstaben »KFB« — weil `card-backs.js` erst mit dem Re-Home ankam. **Wer ein Modul
nachrüstet, muß prüfen, wer bisher seine Aufgabe vertreten hat**; der Vertreter verschwindet nicht
von selbst.
(41) **Unregelmäßig heißt nicht gewürfelt.** Vier feste Lagen (Drehung ·0,6…3,1°, Versatz 0…4 px).
Ein Stapel, der sich bei jedem Aufbau umsortiert, ist keine Handlung.
(41b) ⚠ **Default und Rückweg waren vertauscht** (Georgs Befund 10.8.). Der Satz hieß `kfb` und
führte die vier BLÖDSINN!-Blätter — das sind die Rückseiten des **Anti-Rules-Decks**. Die
Standardrückseite der KFB-Decks ist die **Wortmarke**, und die lag im **Rückweg**
(`card-backside.png`). Sie war damit nur erreichbar, wenn alles andere fehlschlug — also genau
solange, wie die Pfade kaputt waren. **Unser Pfad-Fix hat den Fehler erst sichtbar gemacht.**
Jetzt: `kfb` = Wortmarke (ein Blatt, richtig — ein Deck hat eine Rückseite) · `anti_rules` = die vier
Stempelblätter. Gemessen: `Satz kfb · 1 Blätter · Zonen belegt 6/6 · Varianten 1`.
**Merksatz:** *ein Rückweg, der besser ist als die Vorgabe, ist keine Absicherung — er ist eine
vertauschte Vorgabe.*

**Crop-Befund (Georgs Frage 10.8.) — in `BEFUNDE_fuer_WS1_2026-08-10.md` §4, und dort **korrigiert**:
der Blind-Viertel-Crop ist bei `forget_utopia` **kein** Defekt (Re-Messung 8.8. über Weißraum:
Vollanschnitt, gapX 0,024, Zelle 1,81 — ein stumpfes Viertel liegt ~1 % daneben; der Terrain-Reader
nutzt das Raster laut `_warnung_terrain` absichtlich nicht, V9-B4g). Ursache ist allein **`cover`
statt `fit`**: Zelle 1,81 gegen Sollformat 1,74 beschneidet links und rechts, und dort beginnt der
Titel. Der eigentliche Befund ist **drei Orte für denselben Schnitt** — das Kanon-Dokument (6.8.)
veröffentlicht die 26.7.-Zahlen als gemessen, `card-grids.json` (8.8.) führt sie als widerlegten
Vorgänger, `index.json` soll der einzige Ort sein. **Wir haben aus dem Dokument gerechnet und einen
Umbau angemeldet, den niemand braucht** — zurückgezogen, bevor er rausging.
**Merksatz:** *ein Dokument, das Zahlen abschreibt, wird still falsch, wenn die Messung nachgezogen
wird — Zahlen gehören an einen Ort, Dokumente verweisen darauf.*

---

## 4r. W6 · Ink-Normierung gemessen — und die Sammlung für WS1 (2026-08-10)

| Artefakt | Rolle | Status |
|---|---|---|
| `KFB Ink-Normierung.dc.html` | **das Messblatt** — sieben echte Größen, `measureInk` gegen `INK_CHECK`, Ecke in 1:1, Preset und Seed umschaltbar | **AKTIV** |
| `docs/overworld-v10/BEFUNDE_fuer_WS1_2026-08-10.md` | **die Sammlung** für die nächste Runde — wird bis Session-Ende fortgeschrieben | **AKTIV, wächst** |

**Der Befund:** `card` trägt `hb 0.0069` relativ zu `min(W,H)` — daneben aber **`minHalf: 1.2`, eine
absolute Zahl in Pixeln.** Umschlagpunkt **`min(W,H)` = 174 px**, bei AR 1,74 also **Blattbreite
303 px**. Darunter skaliert die Feder nicht mehr.

**Gemessen (Feder in % von min(W,H), Soll 1,20–1,80):** Weltteller 940×540 **1,38** · Blatt-Backe
700×390 **1,38** · Große Vorlage 320×184 **1,56** — alle drei im Soll. Rücken-Stapel 150×86 **2,79** ·
Handkarte 120×69 **3,48** · Almanach-Blatt 87×50 **4,80** · Statleiste 446×69 **3,48** — **vier von
sieben über dem Soll, alle vier unter 303 px.** Bauchung überall sauber (0,32–0,35 gegen Deckel 0,5),
Familie überall `Band`.

**Die Nähte.**
(42) ⚠ **Meine Zuordnung war falsch, der Befund richtig.** Die zu dicke Kante auf der Actor-Karte in
der Welt hatte ich der fehlenden Normierung zugeschrieben — der Weltteller misst **1,38 %** und liegt
im Soll. Die schwere Kante dort kommt aus einer anderen Quelle. **Eine Ursache, die zur Beobachtung
passt, ist noch keine gemessene Ursache.** Steht als offener Punkt in der WS1-Sammlung, ausdrücklich
als Selbstkorrektur.
(43) ⚠ **Ein Vergleich, der Groß- und Kleinschreibung nicht kennt, erfindet einen Fehlstand.**
`measureInk` gibt `Band`, `INK_CHECK` führt `band` — der strenge Vergleich meldete auf **jeder** der
sieben Zeilen »falsche Familie«. Das wäre als Anforderung an WS1 gegangen und hätte dort einen
Umbau ausgelöst, den niemand braucht. Gefunden nur, weil das Blatt die Familie **auch als Wort
anzeigt** und daneben »falsche Familie« stand: *zwei Anzeigen derselben Sache widersprachen sich im
selben Bild.*
(44) **Ein Name, zwei Bedeutungen: `torn`.** Im Masterplan §4.2c ein gewollter künftiger Stil, im
Ink-Kanon §2.4 die Bezeichnung für den gemessenen Fehlstand (`sky-2026-07`, »ein Fehler, kein
Stil«). Vorschlag an WS1: der Stil heißt **`tear`**, `torn` bleibt dem Vergleichsmaßstab.
(45) **Ein hot-reload der Logik führt `componentDidMount` nicht erneut aus.** Der Fix aus (43) war im
Code und nicht im Bild, weil die Messung im Zustand lag. Wer eine Messung im Aufbau rechnet, muss
zum Prüfen **neu laden**, nicht neu zeichnen.
(46) ⚠ **Ein Schlüssel mit `ß` löst in einer Vorlage nie auf.** `'maß'` im Zustand und `{{ z.maß }}`
in der Vorlage — der Pfad-Leser nimmt kein `ß`, die Stelle blieb **leer, ohne Fehler im Bild**.
Wirkung: das Messprotokoll nannte Feder und `min(W,H)`, aber nie die Größe, aus der sie kamen, und
beide Ankermaße — **das Einzige, um das WS1 gebeten hatte** — standen als »Ankermaß « ohne Zahl da.
**Objektschlüssel, die in einer Vorlage gelesen werden, bleiben ASCII.** Deutsche Bezeichner sind im
Code willkommen, in einem Pfad nicht.
(47) **Ein Platzhalter-Durchlauf fordert Bilder an, die es noch nicht gibt.** `<img src="{{ z.png }}">`
lädt in der Platzhalter-Runde wörtlich `%7B%7B%20z.png%20%7D%7D` — ein fehlgeschlagener Ladevorgang
je Aufbau. Jetzt in `<sc-if>` mit `hint-placeholder-val false`.

---

## 4s. Kartenschau — die große Kartendarstellung (2026-08-10)

| Artefakt | Rolle | Status |
|---|---|---|
| `KFB Kartenschau.dc.html` | **drei Ansichten, EIN Kartenzeichner**: eine Karte groß · Karussell (max 3) · Almanach mit Blättern. Echte Feder aus `kfb-ink-canon.js`, `fit` statt `cover` | **GEPARKT 10.8.** — siehe unten |

**Geparkt am 10.8. (Georg):** »das ist alles noch sehr unfertig — das sind auch nicht die TS-UI-
Elemente, und Karten sehe ich auch nicht, nur den Text der Rückseite in einem halbfertigen Mix.«
**Der Fehler war der Ansatz, nicht die Ausführung:** eine Kartenschau **ohne echte Karte** kann die
Frage »man kann nichts erkennen« gar nicht beantworten. Gezeichnet wurde der kanonische Textzustand
(§5.1 »Text zuerst«) — richtig als Ladezustand, falsch als Beurteilungsgrundlage. Danach wurde drei
Runden lang Layout um einen Platzhalter herum optimiert.
**Merksatz:** *ein Entwurf, dessen Hauptgegenstand ein Platzhalter ist, prüft nur den Rahmen.*

**Beschluss:** Karten werden **im Window** gezeigt (Georg 10.8.) — das Vokabular steht bereits, damit
ist die offene Frage Größe und Inhalt, kein neues Möbel. Georg gestaltet eine **Design-Vorlage**;
gebaut wird dagegen. Was aus dem Blatt trägt und weiterverwendet wird:
· **`fit` statt `cover`** (Zelle 1,81 gegen Sollformat 1,74 — der Beschnitt frisst den Titelanfang),
· die **Lesbarkeitsschwelle 683 px** und die Regel *unter der Schwelle wird weniger gezeichnet, nicht kleiner*,
· **Untergrund unterscheidet, nicht die Karte** (NEU gegen gesammelt),
· **Ablehnen legt unter den Stapel**, es wirft nicht weg.

Anlass: Georgs Befund »die Karte muss viel größer sein, man kann ja nichts erkennen — das gilt für
alle cards«. **Noch nicht im HUD verdrahtet** — erst die Schau, dann die drei Aufrufer.

**Die drei Entscheidungen, die drinstecken.**
(1) **`fit`, nicht `cover`.** Die gemessene Zelle ist 1,81, das Sollformat 1,74 — mit `cover` läuft
die Breite über und beschneidet links und rechts, und dort beginnt der Titel. Eingepaßt stehen
Titel, POWER und LORE im Bild. **Größe allein hätte nichts geheilt**, sie hätte den Beschnitt nur
größer gezeigt.
(2) **Untergrund unterscheidet, nicht die Karte.** NEU sitzt auf einem eigenen Rahmen mit Stempel,
GESAMMELT liegt als Papierblatt im Buch — **dieselbe Zeichnung, zwei Rahmen**. Später tritt die
TS-Schriftrolle an die Stelle des NEU-Rahmens (Georg: Buch-/BG-Layer).
(3) **Ablehnen heißt nicht wegwerfen** (Georg 10.8.): die Karte geht **unter den Stapel**, die
nächste erscheint zur Aufnahme. Die heutige Rail-Fassung erlaubt genau **einen** Rückweisung
(`declined < 1`) und läßt die Karte am Stapelort ausblenden — das wird beim Verdrahten ersetzt.

**Mindestbreite ist eine Messung, keine Vorliebe:** die Zelle ist 683 px breit gemessen; darunter
fällt die LORE-Zeile unter einen Pixel Strichstärke. Das ist aber ein **Ziel, kein Boden** — siehe
Naht (48).

**Die Nähte.**
(48) ⚠ **»So groß wie es geht« hat zwei Achsen.** Die erste Fassung rechnete nur mit der Breite
(`innerWidth × 0,66`) und hatte 560 px als **harten Boden**. Auf einem flachen Fenster (924×540
gemessen) stand die Entscheidungsfrage — »In den Almanach« / »Unter den Stapel« — dadurch **42 px
unter der Falte**, und das ist die eine Handlung, für die die Ansicht existiert. **Eine Karte, die man
nicht bedienen kann, ist nicht groß, sondern zu groß.** Jetzt wird gegen beide Achsen gerechnet
(Kopfzeile 60 · Polster 82 · Titelblock + Knöpfe 190), und die gemessene Zellbreite ist ein Ziel, das
gegen die Höhe verlieren darf.
(49) **Ein deklarierter Regler, den niemand liest, ist eine Lüge im Bedienfeld.** `startAnsicht` und
`maxBreite` standen in `data-props`, wurden aber nirgends aus `this.props` gelesen — zwei Bedienelemente
ohne Wirkung. Jetzt gelesen, und `ansicht()` fällt erst auf den Regler zurück, **solange niemand im
Blatt umgeschaltet hat**: ein Regler darf eine Wahl des Betrachters nicht überschreiben.
(50) ⚠ **Der erste Höhen-Fix hat den Fehler nur getauscht.** Die Knöpfe standen wieder im Bild — dafür
war die Karte **362 px** breit, also **0,53 × der eigenen Lesbarkeitsschwelle** von 683 px. Gemessen:
**457 px Beiwerk gegen 540 px Fensterhöhe**, die Karte bekam 208 px Höhe. **Wer eine Grenze
aufschreibt und dann dagegen zeichnet, hat die Grenze nicht.**
(51) **Die teuerste Zeile war eine Wiederholung.** Unter der Karte stand »The Missing Receipt« — 38 px
unter demselben Titel, den `malKarte` in die Leinwand schreibt. Der Block kostete mit seinen Lücken
**121 px Höhe, also rund 210 px Kartenbreite**. Zustandszeile und Knöpfe stehen jetzt in **einer**
Reihe. *Eine Beschriftung, die das Bild wiederholt, bezahlt der Betrachter in Größe.*
(52) **Jede Ansicht hat ihr eigenes Budget.** Ein fester Abzug ließ das **Buch** für eine Knopfreihe
zahlen, die es nicht hat — in genau der Ansicht, die »möglichst groß« im Auftrag trägt. Jetzt je
Ansicht gerechnet; die Fußnote darf unter die Falte, weil sie Prosa ist und keine Bedienung.

**Offen und benannt:** der NEU-Untergrund ist noch aus CSS gebaut. Georgs Vorgabe ist die
**TS-Schriftrolle/das Banner als Buch-/BG-Layer** — `overworld/ui-kit-ts.js` (uikit-v1.5, 99 Teile,
darunter die zwei hängenden Banner und dehnbare Schriftrollen) ist in diesem Blatt **nicht geladen**.
Nächster Schritt, sobald die Schau trägt.

**Die zweite Runde — und hier lag die eigentliche Ursache.**
(53) ⚠ **Was Platz braucht, muss in der Box stehen.** Alle drei Rahmenlagen waren
`position:absolute` mit negativem Versatz — die Wrapper-Box war damit **exakt die Leinwand**
(gemessen 612×352 bei 30 px Überstand). Die Flex-Spalte hat den Überstand nie gesehen, also war
**jede** gerechnete Lücke um genau ihn zu kurz, und die Knopfreihen lagen auf dem Rahmen (schau 4 px,
buch 16 px). Drei Runden Zahlendrehen hätten das nie geschlossen, weil die Zahl nicht der Fehler war.
Jetzt trägt der Wrapper **echtes Polster** und die Rahmen liegen darin (`inset` statt negativ) —
gemessen: Wrapper 616×388, kein Überlapp.
(54) ⚠ **Eine Zahl an zwei Orten, dritter Treffer dieser Klasse.** `budget().oben` stand auf 14, die
Vorlage auf `padding:50px` — die Breite rechnete gegen ein Polster, das es nicht gab, und die
Knopfreihe stand 24 px unter der Falte. Beide Zahlen sind jetzt gleich, mit Verweis aufeinander im
Kommentar. **Die Vorlage kann die Logik nicht lesen; darum muss der Kommentar es tun.**
(55) **Ein Karussell ist keine Reihe Daumennagel.** Drei gleich große Blätter zu **212 px** — 0,31 ×
der eigenen Schwelle — während 170 px Fensterhöhe leer blieben, weil `unten` 150 px für eine
**Fußnote** reservierte, die laut eigener Regel unter die Falte darf. Jetzt Mitte 536, Flanken 342
hinter der Mitte eingesteckt.
(56) **Unter der Schwelle wird WENIGER gezeichnet, nicht kleiner.** Eine knappe Karte (Zelle < 470 px)
trägt Titel und POWER in gröÞrem Grad und lässt Lore und Bildunterschrift weg. Text zu setzen, den
niemand lesen kann, ist die »Behauptung von Lesbarkeit«, gegen die dieses Blatt gebaut ist.

**Gemessen bei 924×540 (Vorschaugröße, also der schlechteste Fall):** Karte **560 px** (0,82 × der
Schwelle), Knopfreihe endet bei 528 gegen die Falte bei 540. Auf einem normalen Fenster (Höhe 900)
läuft die Rechnung auf 1186 px und wird von der Breite gedeckelt — die Schwelle ist dort kein Thema.

---

## 4t. Große Karte in der Welt · Glossar-Abgleich (2026-08-10)

| Artefakt | Rolle | Status |
|---|---|---|
| `overworld/card-rail-v9b.js` | große Vorlage mit `fit` statt `cover`; Kürzel aus dem Kanon | **AKTIV** |
| `github.md` | Repo-Anbindung `georg-doc/kayfabizarro`, Zweig `main`, Pfad `overworld` | **AKTIV** |

**Die Karte in der Welt.** `bigW` stand auf `min(320, max(200, Breite × 0,26))` — eine Briefmarke auf
einer Fläche, die ein Vielfaches hergibt (Georgs Markierung im Bild). Jetzt gegen **beide** Achsen:
`max(320, min(Breite × 0,56, Höhe × 0,58 × 1,74))` — bei 1850×1500 sind das **1036 px statt 320**.

**Und der Grund, warum nur das Bild zu sehen war:** `artSheet` rechnet
`Math.max(W/aw, H/ah) × OVERSCAN` — **cover mit Überschuss**. Auf einem Daumennagel ist das richtig
(sonst steht Papier neben der Briefmarke), auf der großen Vorlage schneidet es Titel, POWER und LORE
weg, die auf der gedruckten Zelle **stehen**. Jetzt zwei Passungen: `fit` für die Vorlage (Kanon §3,
Rest cremefarben innerhalb der Feder), `cover` für die Blätter im Rail.
**Merksatz:** *zwei Absichten, zwei Passungen — dieselbe Funktion für Briefmarke und Vorlage ist eine
Entscheidung, die niemand getroffen hat.*

**Glossar-Abgleich** (`overworld/docs/GLOSSAR_KFB.md`, Stand 10.8.) — es enthält eine ausdrückliche
WS0-Regel, und wir haben sie verletzt:
· **Zwei-Buchstaben-Kürzel fallen weg.** Unser Statblatt zeigte `BZ KF BI BO BG BS`; Kanon ist
  `Biz · Kay · Bin · Bon · Bog · Blö`. Behoben, gemessen: `Biz 3 Kay 2 Bin 1 Bon 1 Bog 1 Blö 0`.
· **Warum drei Buchstaben:** ein Schnitt aus dem Etikett ergäbe bei Kayfabe/KayfaBingo/-Bongo/-Boggle
  **viermal »Kay«**. Deshalb führt der Runner ein eigenes Feld `short`; wir lesen es und haben die
  Kanon-Kürzel nur als Rückweg.
· Etiketten und IDs waren bereits kanonisch (`bingo` → KayfaBingo usw.), ebenso `Newbie` und
  `Leichenfledderer`.
· **Papierseitig nachzuziehen:** die Eskalationsstufen der Schmährufe heißen seit 10.8. `P1`/`P2`;
  `K1`/`K2` gehören allein den Kanon-Regeln. Betrifft nur Dokumente, keinen Code.

**Die Nähte.**
(57) ⚠ **`game` ist kein Global.** Mein erster Anlauf suchte `window.game` — der Runner reicht sich
aber nur in `install(game, sh)` herein. Der Ausdruck fiel still auf den alten Wert zurück, das Blatt
zeigte weiter `BZ KF BI`, **ohne eine Zeile Fehler**. Jetzt wird der Runner übergeben, nicht gesucht.
Dieselbe Klasse wie das leere `catch` und der `ß`-Schlüssel: *etwas, das aussieht, als würde es
funktionieren.*
(58) **Ein Kürzel, das aus einem Etikett geschnitten wird, gehört niemandem.** Der Kanon hat dafür
ein eigenes Feld bekommen, weil eine Etikettänderung sonst still vier Anzeigen zerstört hätte.
(59) **Die äußere Grabenlinie ist ein Strich, keine Feder — und der Beweis ist die Streuung.**
An Georgs Bild gemessen (fünf senkrechte Proben): Kartenfeder **27–49 px** (Taper und Lichtlogik,
also ein Band), Grabenlinie **9–10 px über 1864 px praktisch konstant**. *Eine Linie ohne Streuung
ist kein Band.* Verhältnis gemessen **0,25**, §4.2b verlangt **0,45** — also ist nicht die Karte zu
dick, sondern die Nachbarin zu dünn. Beides Runner-Gebiet (`gutter-2d.js`, `drawCardPlate`);
**hier nicht gefixt**, sondern in `BEFUNDE_fuer_WS1_2026-08-10.md` §7 zurückgegeben. Ein Fork des
Runners wäre genau die Divergenz, gegen die §6 des Masterplans geschrieben ist.
(60) **Ein Fächer aus einer Karte ist eine Karte.** Almanach- und Quest-Stapel sind vorhanden und
sichtbar (gemessen: beide `.r9pile`, 87×50, je ein Kind) — sie sehen nur nach nichts aus, solange je
eine Karte darin liegt. Slice C (zwei Ringmenüs) ist das, was daraus wird.

---

## 4u. Overworld v11 — HUD-Statblatt, dreißig spielbare Einheiten, Flugkörper (2026-08-11)

Fork von `KFB Overworld v10.dc.html` (Basis v10-S22, §4p) mit den drei WS0-Reparaturen aus dem
WS1-Handover: `anim-clock` MIN_SLIP 7 · `mob-ai` Lauf-Hysterese 34/16 · Rücksprung auf Bild 0 raus.

| Artefakt | Rolle | Status |
|---|---|---|
| `KFB Overworld v11.dc.html` + `overworld-v11/` (60 Module + Font + `backs/` + `icons-rpg/` + 3 JSON) | Fork-Basis für v12 (§4v) | **SUPERSEDED von v12 — nicht löschen** (Vergleichsmaßstab) |
| `overworld-v11/shots.js` (shots-v1.0) | **neu** — alles, was fliegt: eine Bahn für Held und Gegner, Ausrichtung und Bilderzahl am Blatt gemessen, Bogen aus dem Katalog | **AKTIV — an WS1 anbieten** |
| `overworld-v11/reach.js` | eine Reichweite für Held und Gegner, aus beiden Körpern gerechnet | **AKTIV** |
| `overworld-v11/game-feel.js` (gf-v1.3) | + `bodyFactor()` als fünfter Tempofaktor · Lebensfarbe (fünf Stufen, unter ⅓ rot) für HUD **und** Weltbalken | **AKTIV — Diff an WS1** |
| `overworld-v11/unit-loader.js` | + `bump` (kein Angriffsclip → Laufstreifen als Rempler), gemessen statt gepflegt | **AKTIV — Diff an WS1** |
| `overworld-v11/units-catalog.js` | unsere zusammengeführte Fassung + `shot:{speed,arc}` (4 Einträge) + die korrigierte Zahl **30** | **AKTIV — Diff an WS1, seit §4h offen** |
| `overworld-v11/roster-sheet.js` (roster-v1.1) | Wahlblatt **ist** Messblatt: Körper, Bilder je Animation, Rempler, Wurfart, Tempo — je Kachel, plus Summenzeile | **AKTIV** |
| `overworld-v11/overworld-game-v10.js` · `mob-ai.js` · `card-rail-v9b.js` · `identity.js` · `anim-clock.js` | Runner + KI + HUD, diese Session geändert | **AKTIV — Diff an WS1** |
| `docs/overworld-v11/HANDOVER_WS0_2026-08-11.md` | **Onboarding für frischen Chat (§A) + Diff an WS1 (§B) + Nähte 61–66 (§C)** | **AKTIV, maßgeblich** |
| `KFB Overworld v10.dc.html` + `overworld-v10/` | Fork-Basis, WS1-Lead-Stand | **SUPERSEDED von v11 — nicht löschen** (Vergleichsmaßstab) |

**Abnahme 2026-08-11 (im laufenden Spiel gemessen, Konsole + Zustand):** keine Fehlerzeile ·
`OW_SHOTS` shots-v1.0 / `OW_FEEL` gf-v1.3 / `OW_ROSTER` roster-v1.1 geladen · Wahlblatt füllt
**30/30** Kacheln: *30 gemessen · 28 mit Hieb · 2 Rempler · 5 mit Wurf · 23 mit Porträt* ·
Tempo Schaf 31 px → **205 px/s**, Warrior 91 → **250**, Troll 177 → **305** · Heldenpfeil trifft den
Schädel nach 0,42 s auf 270 px (34 → 22 HP, Rückstoß 102 px/s) · Gnoll-Knochen steigt 30 px und
nimmt 7 HP. **Bild-Abnahme entfällt** — im gedrosselten Vorschaufenster kommt kein Frame (Naht 66).

**Die Nähte 61–66** stehen im Handover §C: Radius gegen Fußpunkt · Katalogdatum ohne Leser ·
gleiches Tempo macht die Auswahl zum Kostüm · Rempler statt Schlag in die Ruhe · ein Etikett
überlebt seinen Anlass · der gedrosselte Rahmen zeigt nichts.

**Entschieden am 11.8., noch nicht gebaut** (die Reihenfolge steht im Handover §A):
(1) **Wasser KISS** — eine Streufarbe je Fluid-KÖRPER (Säure-See = ein Giftgrün; flach/tief kommt
aus der Tiefe, nicht aus einer zweiten Farbe), Gradienten statt Höhenfeld, inkommensurable
Richtungen, Steigung als geführte Zahl.
(2) **Ink-Outline als System** — Stärke trägt, Farbe bestätigt; schwarz+dick = Sperre,
farbig+dünner = passierbar; Outline-Farbe **abgeleitet** (`inkOf(terrainfarbe)`), nie gewählt; das
Gummiband reagiert nur auf Schwarz; eine schwarze Linie wird **nie unterbrochen, nur überdeckt** —
die Holzbrücke ist die Tür.
(3) **Gummiband greift zu früh** — Hypothese: Trigger an der Feldgrenze, Tusche mit eigener
Verjüngung. Fix wie `reach.js`: eine Kontur, zwei Leser. **Vor dem Bauen messen.**
(4) Linienstärken (fällt mit 2 zusammen) · (5) Sprechblasen mit Level · (6) sieben Einheiten ohne
Porträt — **kein Sprite-Kopf als Ersatz** (Georg 11.8.).

**Pfad-Hygiene:** vier relative Ressourcen in `overworld-v11/` — `fonts/pottymouthbb_reg.otf`
(53 kB), `backs/*.png` (4 × ~340 kB), `card-backside.png` (**1,0 MB**), `icons-rpg/*.svg` (11, 16 kB).
Alle unter dem 2-MB-Budget, deshalb im Export drin; ins Repo mit `OW_SRC`-Routing gehören sie
trotzdem (offen seit §4p).

---

## 4v. Overworld v12 — Slice 1 »Wasser KISS« (2026-08-12)

Fork von `KFB Overworld v11.dc.html` (Stand §4u). Der Runner ist beim Fork **nicht** angefaßt
worden; die drei Änderungen unten kamen mit dem Slice.

| Artefakt | Rolle | Status |
|---|---|---|
| `KFB Overworld v12.dc.html` + `overworld-v12/` (75 Module + Font + `backs/` + `icons-rpg/` + 3 JSON) | **der Arbeitsstand** | **AKTIV — main der 2D-Linie** |
| `overworld-v12/water-kiss.js` (water-v2.0) | **neu** — eine Streufarbe je Fluid-Körper, **harte** Glanzformen (keine Rampe), Schwelle je Ort moduliert (Formen unterscheiden sich), **gestuftes Morphen** in zwei Folgen (7/9), Schelf am Ufer, RMS-Neigung als geführte Zahl. **Drei Formfamilien als Schalter** (`waterForm`: kleckse · striche · schlieren) — Georg entscheidet | **AKTIV — an WS1 anbieten** |
| `overworld-v12/terrain-paint.js` (tp-v4.6) | `drawWater` delegiert an `OW_WATER`; behält nur Clip und Ausschnitt. Alter Rauschweg bleibt als Rückfall | **AKTIV — Diff an WS1** |
| `overworld-v12/overworld-game-v10.js` | `paintOpt` trägt `fluid` + `nah`; `drawWater` steht jetzt **hinter** der Fluid-Schicht | **AKTIV — Diff an WS1** |
| `docs/overworld-v12/SLICE_wasser-kiss_2026-08-12.md` | Entscheidung, Bauart, Wellentabelle, Diff, Nähte 67–70, Abnahme | **AKTIV, maßgeblich** |
| `KFB Overworld v11.dc.html` + `overworld-v11/` | Fork-Basis | **SUPERSEDED von v12 — nicht löschen** |

**Abnahme 2026-08-12 (Konsole, echter Bedienweg):** `[water] water-v1.0 · RMS-Neigung 4° · Kachel
maxAlpha 230/255, Deckung 32,8 %` · Module **39/39** · **keine Fehlerzeile** · Audio 26 / Ansager
12/12 · Relief 7 von 9, 412 ms kalt · Boden 13/13 · Welt 240×180, 6 Zonen, 23 Mobs + 8 Wegelagerer ·
Rückseiten kfb 1/6 Zonen belegt · `[rail-v9b] Kartenspalte steht`.
**Der Wasserzweig getrennt:** er hängt an `nah` (`zoomEff()/dpr ≥ 0,7`) und läuft in der
**Standardansicht nicht** (1/2 = 0,5 — Bestand seit v10-S1f). Mit erhöhtem Zoom gemessen:
`drawWater` **20 Aufrufe in 800 ms** mit `{fluid:'wasser', nah:true}`, Streufarben je Fluid richtig.
**Bild-Abnahme entfällt** — im gedrosselten Vorschaufenster kommt kein Frame (Naht 66).

**Die Nähte 67–72** stehen im Slice-Blatt §3:
(67) **eine Schicht, die zugedeckt wird, ist keine Schicht** — das Glitzern lag vor dem Land, die
Fluid-Schicht deckt es mit 0,82 zu: 18 % blieben übrig · (68) **weiß ist keine Farbe des Körpers** ·
(69) **kachelbar und inkommensurabel schließen sich nicht aus** — der Cord-Befund lag nicht am
Sinus, sondern an zwei kommensurablen Perioden · (70) **eine Neigung, die niemand führt, wandert** ·
(71) ⚠ **eine Schranke ist keine Verteilung** — die Rampe normierte gegen die Summe aller vier
Wellen und traf damit fast nichts (maxAlpha 30, Deckung 0,5 %: die 5-von-255-Klasse aus
`terrain-paint.js` §449, ein zweites Mal); jetzt gegen das P98 des wirklichen Feldes ·
(72) **ein Slice, der nur im Boot-Log abgenommen wird, ist nicht abgenommen.**

**Nachtrag 12.8. — warum das Wasser trotzdem aussah wie vorher (v12-W1c):** der ganze Zweig hing
seit v10-S1f an `nah` (`zoomEff()/dpr ≥ 0,7`); bei **dpr 2** ist die Standardansicht 0,5, es wurde
also **nie** gezeichnet. Sperre raus, Aliasing dort behandelt, wo es entsteht: der Kachelmaßstab hat
eine Untergrenze (ein Quellpixel nie unter 0,6 Gerätepixel).
(73) **eine Sperre gegen ein Bildfehler-Risiko ist auch ein Ausschalter.**

**HUD-Runde 12.8.** (`card-rail-v9b.js`, vier Befunde von Georg):
(74) ⚠ **`document.activeElement` hört an der Schattengrenze auf** — »R« öffnete das Roster beim
Namenstippen, obwohl die Abfrage da war; sie sah den Wirt statt des Feldes. Betrifft nur
capture-Tasten · (75) **ein Dreieck von 9×6 px ist kein Ziel** — Trefferfläche 31×28, Zeichnung
unverändert · (76) **eine feste Zahl kann nicht ausweichen — und eine spätere feste Zahl schlägt
sie**: der erste Anlauf wirkte an einer von vier Stellen (`.r9stat.slim .sheet` war spezifischer,
der Avatar bekam seine Größe inline aus dem JS); jetzt drei Stufen, **nicht** per `transform`
(Canvas-Kante, §4h Naht 7) · (77) **Selbstkorrektur** — die Behauptung »das Logbuch ist
`pointer-events:none`, also war sein `:hover` tot« ist **falsch** (gemessen: `auto`, Hover feuert).
Geblieben ist ein 22-px-Saum; **warum Georg nichts sah, ist offen und benannt.** ·
(78) ⚠ **siebter Backtick-Treffer im CSS-Literal** — im Kommentar, der die Regel erklärt; das Rail
fiel komplett aus, Boot-Log unauffällig. **Abnahme des Rails ist die Zeile `[rail-v9b] Kartenspalte
steht`, nicht der Boot-Log** — eine fehlende Zeile sieht man nur, wenn man sie benannt hat.

**water-v2.0 (12.8., nach Georgs Bild):** (79) **der Betrag eines Gradientenfeldes ist ein
Höhenzug — also Aale**, und eine weiche Kante ist Airbrush in einem Bild, das überall Tusche
trägt · (80) **ab da war es eine Bildentscheidung, keine Ingenieursfrage** — vier Tuningrunden
tauschten nur Artefakte; die drei Formfamilien stehen jetzt als Schalter `waterForm`
(kleckse 9,9 % · striche 7,6 % · schlieren 4,8 % Deckung), **Georg entscheidet** · (81) **eine
Vorzugsrichtung ist kein Cord, ein messbarer Abstand schon.**
Runner-Diff dazu: ein Attribut `water-form` (observedAttributes + eine Zeile im Callback).

**Stand 12.8. abends: das Glitzern steht auf `aus`.** (82) **zwei Bewegungen, die sich
widersprechen, liest man als Ruckeln** — die Lage driftet stetig, die Form springt alle 0,38 s;
Georg sah Konfetti und vermutete ein Performance-Problem · (83) **wo das mentale Modell fehlt,
gehört kein Entwurf hin** — die Fluid-Schicht des Waber-Shaders zeichnet wieder allein, Gerüst und
Formfamilien bleiben über `waterForm` erreichbar. **Offen: Referenzen für Cartoon-Wasser** (Georg
recherchiert Shader mit klarem Vorbild).
Dazu aus derselben Runde: POP-account-Zeile raus (Ballast; Weg zurück: `ACCT_ZEILE`), Fluff-Balken
läuft wieder bis an seine Zahl, Avatar-Polster +14 px.

**Karten-Zone und Kamera (12.8., dritte Runde):**
(84) **wer eine Kamera an eine Uhr hängt, hat eine Kamera, die sich selbst bewegt** — das
zeitgesteuerte Überblenden auf die Blattmitte plus die Dämpfung darunter waren zwei geschachtelte
Glättungen (Georgs »springt/schwimmt«); ersetzt durch eine **geometrische Klammer**, die das Blatt
im Bild hält · (85) **ein Moduswechsel, den der Spieler nicht ausgelöst hat, liest sich als
Defekt** — das Blatt schaltete das HUD auf `minimal` (V9-B3b); der Grund (HUD deckte die obere
Kartenreihe) ist seit dem Rail-Umbau weg, der Griff war geblieben · (86) **Requisiten dürfen
überlappen, Einheiten nicht** — `aufBlatt()` als eine Abfrage für drei Säher, gemessen 42 Mobs /
**0 auf dem Blatt**.
Runner-Diff wächst damit um: Kamerazweig, `stepReader`, `spawnPoints`, `spawnCritters`,
Tutorial-Gegner, drei gelöschte Konstanten.

**Fluff-Zeile neu gelegt (12.8., vierte Runde):** obere Zeile gehört Name und Titel (Titel darf
umbrechen, keine Ellipse mehr), darunter Balken + Zahl + FLUFF als Gruppe, dahinter abgesetzt POP.
(87) **ein Element, das nur wegen seiner Stabilität irgendwo sitzt, bezahlt die anderen dafür** —
POP hielt seit v11-H5 die Namenszeile besetzt; das feste Raster in `.hp` ist durch eine
Mindestbreite an der Zahl ersetzt · Ausfahr-Verzögerung 260+500 ms → 90+220 ·
(88) ⚠ **achter Backtick-Treffer**, diesmal zwei Stück im erklärenden Kommentar selbst: `TypeError`
statt `SyntaxError`, gleiche Wirkung (kein Rail, HUD sieht heil aus).

**Statblatt als Unit Frame (12.8., fünfte Runde) — `docs/overworld-v12/KONZEPT_statblatt_2026-08-12.md`:**
(89) **ein Layout über Budget sieht nicht schief aus, sondern kaputt** — gemessen: Inhaltsspalte
176 px, gebraucht 204; die POP-Gruppe stand 16 px über dem Papierrand, und der Balken konnte nicht
wachsen, weil er auf seinem Minimum saß. Vier Runden Ausrichtungsregeln waren deshalb wirkungslos ·
(90) **die Bauform aus WoW/RPG löst es strukturell**: die Werte liegen IM Balken, nicht daneben —
eine Zeile, ein Kind, kein Streit um Breite. Drei Zeilen (Name/Titel · Fluff-Balken · POP-Platte),
alle gleich breit. Gemessen nach dem Umbau: **168/168/168 px, Überlauf 0, Polster rechts 20** ·
(91) **eine Mindestbreite am flexiblen Stück ist keine Lösung, sondern eine Überlaufgarantie.** ·
(93) **wer eine gute Anordnung wegen eines Platzproblems ersetzt, tauscht eine Stärke gegen eine
Zahl** — der Unit-Frame-Umbau ist zurückgenommen, die v11-Fluffbox steht zeichengleich wieder da
(Blatt 446/434, Avatar 108, Polster 132, Balken 118; keine Variablen, keine Media Queries).
Geblieben: deckendes Papier, `--pad` 13…22, Trefferfläche am Titel-Dreieck, POP-account-Zeile weg,
Logbuch so hoch wie sein Inhalt.

**Slice J1 · Die Journey speichert die Einheit (12.8.):** Schema **2.3.0 → 2.4.0** (`hero.unit`,
Katalogschlüssel ohne `hero_`-Präfix, alte Stände `null` = nie gewählt).
(94) **ein Spielstand, der die Wahl nicht kennt, macht die Wahl zur Dekoration** — 30
unterscheidbare Einheiten waren genau eine Sitzung lang unterscheidbar ·
(95) **zwei Kennungen für dieselbe Einheit, und nur eine passt ins Attribut** (Loader `hero_bear`,
Katalog `bear`) — die falsche zu speichern gibt still wieder eine gewürfelte Einheit.
Abnahme: Held `hero_gnoll` → Save `unit:"gnoll"`, geschrieben und zurückgelesen gleich, 6 Zonen,
Export/Import über das Tagebuch (J).
**Brücke (v12-B1):** zwei Felder statt einem (sie endete auf den beiden Panel-Linien), Tor-Loch im
Graben raus (daher das grüne Gras darunter) — die Linie wird überdeckt, nicht unterbrochen. ·
(92) ⚠ **»Papier ist Papier, kein Glas« — zum ZWEITEN Mal** (§4h Naht 11): das Statblatt lief wieder
auf der gemeinsamen Rail-Sichtbarkeit (0,78) mit, das Gras schien durch und ein Prop stand im
Namen. Die Regel war seit 9.8. da und ist beim Umbau verlorengegangen; sie steht jetzt im selben
Block wie das übrige Statblatt-Layout. Gemessen: **Deckkraft 1, Papier rgb(226,215,192), voll
deckend.** *Eine Regel, die nicht bei ihrem Gegenstand steht, überlebt dessen nächsten Umbau nicht.*

**Offen, Reihenfolge unverändert:** (2) Ink-Outline als System · (3) Gummiband greift zu früh
(**vor dem Bauen messen**) · (4) Linienstärken · (5) Sprechblasen mit Level · (6) sieben Einheiten
ohne Porträt.

**Wartet auf Sign-off, nicht gelöscht:** `scraps/`-Prüfbilder aus §4k/§4l · die tote `.no`-Regel in
`roster-sheet.js:48` (das Etikett dazu ist mit Naht 65 gefallen).

---

## 4w. Travel v15 — Flug-Sprint (Fork 2026-08-12 aus v14/S94a)

Auftrag Georg: Controls, Gameplay, **Flug- und Manöverdynamik**; erste Bedingung *„boden-kontakt
sollte nicht in den walk mode wechseln"*. **Blueprint und Benchmark:**
`github.com/dannylimanseta/tinyskies` (Zweig `cursor/globefly-multiplayer-globe-flight-game`) —
ein Mehrspieler-Flugspiel auf einer Kugel; unser Maßstab ist dort der **fliegende Teppich**
(`client/src/game/Carpet.ts`), weil er unser Fahrzeug ist: trägt eine Figur, schwebt über Gelände,
vier Tasten.

| Artefakt | Rolle | Status |
|---|---|---|
| `KFB Travel v15.dc.html` + `terrain-v15/` (56 Module + `edge3.jpg` + 4 JSON) | Fork-Basis für v16, Vergleichsmaßstab | **FROZEN seit 2026-08-12** |
| `terrain-v15/flight-controller.js` (**fc-v2.0**) | die Fahrdynamik: Kurs als Zahl, exponentielle Zeitkonstanten, Traktion & Drift, Kurvendeckel, Kufe | **AKTIV — der Gegenstand des Sprints** |
| `terrain-v15/travel-poc.js` | Runner. **Zwei Zeilen geändert:** `autoMode = false` (F0) und `input.noDrift` (F1). Fork-Stempel im Kopf | AKTIV |
| `terrain-v15/settings-schema.js` | Panel-Block *Fahrdynamik* (12 Regler + Messanzeige), Steuerungstabelle neu | AKTIV |
| `docs/travel-v15/SPRINT_travel-v15.md` | Fahrplan **F0–F6**, drei Prinzipien, was NICHT gemacht wird, Clean-Run | **AKTIV, maßgeblich** |
| `docs/travel-v15/BENCHMARK_tinyskies.md` | **der Lesebericht**: fünf gelesene Dateien, Tabelle übernommen/abgewandelt/gelassen mit beiden Zahlensätzen | **AKTIV, maßgeblich** |
| `docs/travel-v15/CHANGELOG_v15.md` | additiv nach oben, jede Änderung mit Zahl, Nähte 96–100 | **AKTIV** |
| `KFB Travel v14.dc.html` + `terrain-v14/` | Fork-Basis, Vergleichsmaßstab | **FROZEN** — nicht weiterbauen, nicht löschen |

**Was der Sprint entschieden hat.** (a) **Bodennähe ist ein FAHRZUSTAND, kein Zustandswechsel** —
im Vorbild schwebt der Teppich über der Oberfläche, „Boden" bedeutet dort gar nichts. Bei uns war
Bodenkontakt beides, und die Hälfte der `mode-owner`-Regeln existierte nur, um die Fälle
auszunehmen, in denen es das nicht sein sollte. *Eine Regel, die man dreimal ausnehmen muß, ist
keine Regel.* (b) **Zahlen aus dem Vorbild kommen mit Herkunft oder gar nicht** — übernommen sind
Raten (1/s) und Verhältnisse, nie Absolutwerte (tinyskies rechnet auf Weltradius 5).
(c) **Was Geschmack ist, wird ein Regler** — Haftung, Rutschwinkel-Deckel, Kurvendeckel, Kufe und
Kissenhöhe stehen im Panel; **Georg entscheidet am Regler**, dasselbe Verfahren wie `waterForm`
in §4v.

**Nicht übernommen, mit Grund:** die **geländefolgende Höhe** des Vorbilds. Karten, Zonenring
(»Bodenluft«) und Anflug hängen bei uns an ABSOLUTEN Höhen — geländefolgend wäre eine zweite
Höhen-Wahrheit neben der Registry. Übernommen ist die **Kufe** (ein Kissen über dem Boden), nicht
das Prinzip.

**Abnahme 2026-08-12 (im laufenden Spiel, `flight.update` direkt getaktet):**
`[travel-v15] fc-v2.0 · Drift an · Kurvenwiderstand 0.12 · Kufe 6 · Modus folgt der Höhe: nein` ·
`mgr.runStep('fade'|'vehicle')` → **true** · `__loopErr` **null** · `__bootErrors` **2** (die zwei
leeren `SCRIPT`-Einträge, die v14 genauso hat) ·
`modeOwner.request('walk','altitude')` → **abgelehnt, `höhe-abgeschaltet`**, `'hand'` → **ok**
(hin und zurück) · Vollgas geradeaus **42,00 u/s**, in voller Kurve **36,96** (−12 %), im Boost
wieder **42,00** · Rutschwinkel volle Kurve **40°** (Deckel), halbe Kurve **10°**, 0,5 s nach X
**13°** · Kufe an: min. Bodenabstand **2,86 u / 0 Klemm-Bilder**, Kufe aus: **2,20 u / 86** ·
Schwebehöhe über flachem Boden **3,46 u** · Bildratenspanne 120↔30 fps über 4 s Kurvenflug:
Ort **0,72 / 0,58 u** auf 38,6 u Weg, Tempo **38,05 gegen 38,06 u/s**.

**Die Nähte 96–100** stehen im Changelog: (96) ein Abzug am Soll, den eine gehaltene Taste im
selben Bild auffüllt, ist kein Widerstand (gemessen 0 %) · (97) ein Rutschwinkel ohne Deckel ist
Lenkrate ÷ Haftung = 78° — eine fremde Zahl trägt die fremde Streckenlänge mit · (98) eine Kufe,
die das SOLL nachzieht, ist langsamer als die Klemme, die sie ersetzen soll (86 Klemm-Bilder mit
UND ohne) · (99) ⚠ »am Boden« mußte umdefiniert werden, sonst hätte der Umbau still `landed`
unmöglich gemacht und damit den v14-Rückweg getötet · (100) ⚠ ein Modul ohne Versionsstempel in
der URL wird aus dem Cache bedient — zwei Meßrunden lang wurden Zahlen eines Codes gemessen, der
so nicht mehr im Projekt stand.

**Offen (Georg am Regler, Reihenfolge im Sprint §4):** Haftung normal 5,0 bedeutet **21,8°
Dauer-Schräglauf** in jeder normalen Kurve — Vorbildzahl, aber Geschmack · Rutschwinkel-Deckel 40° ·
Kurvendeckel 12 % · Schwebehöhe 3,46 u (damit setzt das Pad nie mehr auf — soll es das können?) ·
**F2 Boost-Grammatik** (Dauertaste oder Belohnung — das ist Spieldesign, keine Zahl).

**Blockiert, und nicht durch uns:** der **Standalone-Export** (Naht 101). Der Bundler verliert bei
jedem Einstiegs-Modul die erste relative Abhängigkeit und meldet den Fehler beim Nachbarn; sieben
Umgehungen gemessen, alle gescheitert. Die Overworld-Linie ist nicht betroffen (klassische
`<script src>` statt ES-Module) — deshalb gibt es dort Standalone-Fassungen und hier keine.
**Ersatz:** der Manifest-Export läuft offline über jeden statischen Server.

**Noch nicht gebaut:** F2 Boost · F3 Kamera am Tempo (FOV 60→80, `closeDamp`) · F4 den Drift
SEHEN (unsere Streifen hängen am Facing, nicht am Rutschwinkel) · F5 benannte Manöver · F6 Touch.

---

## 4x. Travel v16 — Landschaft · L1 »Stufung« + L2 »Farbwelten« + L2d »Ringwellen« (Fork 2026-08-12 aus v15)

Auftrag Georg: wechselnde Landschaften (Farben, Terrains, Farb-Instanzierung nach
`three.js/examples/webgl_instancing_dynamic`), **1/6-Stufung der Voxel-Höhen** für Steigungen und
Senken **neben** hohen Klippen, später **Kenney-3D-Props** statt der grauen Platzhalter-Blöcke
(Katalog `media/3D_Assets/CATALOG/catalog.json`: 2538 Assets, 33 Packs, mit `size` und
`footprint_xz`). Drei Slices, nacheinander — L1 steht, L2 und L3 sind offen.

| Artefakt | Rolle | Status |
|---|---|---|
| `KFB Travel v16.dc.html` + `terrain-v16/` (56 Module) | **die Reise, Arbeitsstand** | **AKTIV — main der Travel-Linie** |
| `terrain-v16/voxel-terrain.js` | die Stufung: Reliefkarte → vier Stufengrößen; `stepAt` · `reliefAt` · `setStepping` · `stepReport` | **AKTIV — der Gegenstand von L1** |
| `terrain-v16/color-worlds.js` (**cw-v1.0**) | **die Farbwelten (L2)** — `regionAt` (Ort → Palette), Weltwürfel, Atem, `rotateStops`/`guardStops`. **Null Zeilen GLSL**: der Shader konnte die Front seit v3 | **AKTIV** |
| `themes/kfb-shell.css` | **die Bühne, EINMAL** — von `index.html` und dem DC per `<link>` eingebunden; der TEXT der Meta-Zeile kommt aus `SHELL_META` im Runner. Vorher lagen die Regeln inline in beiden Fassungen und waren eine Runde später uneinig (Naht 122) | **AKTIV, GETEILT** |
| `index.html` | **die Betriebsfassung** — GitHub Pages, Vollbild, Performance-Messung. Kein Bundler (Naht 101 blockiert ihn; für Pages braucht es ihn nicht, und getrennte Dateien messen ehrlicher). **0 Boot-Fehler**, das DC hat 2 aus der Werkzeug-Hülle | **AKTIV — die Fassung für GitHub** |
| `KFB Travel Testliste.dc.html` | **T1** · 6 Gruppen / 27 Punkte mit Handgriff UND Erwartungswert, Zustände OK/DEFEKT/N/A/offen, Notizen, JSON-Export/Import, Zustand überlebt Neuladen | **AKTIV** |
| `docs/travel-v16/HANDOVER_WS_2026-08-12.md` | **Onboarding für frische Chats** (§A) + Diff (§B) + Testverfahren (§C) + Nähte (§D) + Offene Punkte (§E) | **AKTIV, maßgeblich** |
| `terrain-v16/prop-scatter.js` (**ps-v1.1**) | **die Props (L3)** — 9 Kenney-Modelle über `asset-repo.json` (RAW), globale InstancedMeshes, Verbieger pro Instanz, Bodenbewegung + Bodenfarbe + Squash am Bob des Würfels | **AKTIV** |
| `docs/travel-v16/HANDOVER_assets_chatgpt.md` | **Standalone-Auftrag an ChatGPT**, den Asset-Index zu konsolidieren: die zwei Indizes, sechs verifizierte Fallen, Zielformat, Verifikations-Pflicht | **AKTIV, maßgeblich für den Asset-Aufräumer** |
| `asset-repo.json` (Wurzel, 328 kB, 986 Assets mit `ghUrl`) | die **Laufzeit-Wahrheit** über ladbare Assets. Geteilt mit `KFB Cartoon-Verbieger.dc.html` | **GETEILT — nicht umbauen, ohne beide Verbraucher umzustellen** |
| `kfb-cartoon-deform.js` (Wurzel) | die Verbieger-Referenz. L3 hat die Mathematik übernommen, die Datei **nicht** angefasst | **GETEILT, unverändert** |
| `terrain-v16/settings-schema.js` | Abschnitte *Stufung* (7+2) · *Farbwelten* (13+3) · *Ringwellen* (6+2) · *Props* (16+3) | AKTIV |
| `scraps/01…03-farbwelten-v16.jpg` | Abnahme-Belege L2a: drei Seeds, drei Welten (11 mystical · 42 forbidden · 777 heroic) | ASSET (klein, behalten) |
| `scraps/01…04-wellen-v16.jpg` | Abnahme-Belege L2d: grüner Ring läuft über rosa Gelände nach außen | ASSET (klein, behalten) |
| `docs/travel-v16/SPRINT_travel-v16.md` | Fahrplan **L1–L3**, Reliefart-Tabelle, vier offene Entscheidungen, Clean-Run | **AKTIV, maßgeblich** |
| `docs/travel-v16/CHANGELOG_v16.md` | Messtabelle mit/ohne Stufung, Nähte 102–105 | **AKTIV** |
| `scraps/01-stufung-v16.jpg` | Abnahme-Beleg (Nahaufnahme — aus 46 u sieht man L1 nicht, Naht 105) | ASSET (klein, behalten) |
| `KFB Travel v15.dc.html` + `terrain-v15/` | Fork-Basis, Vergleichsmaßstab | **FROZEN seit 2026-08-12** — nicht weiterbauen, nicht löschen |

**Der Kern, in einem Satz.** Eine feinere Stufe allein löst die Aufgabe nicht: wer überall auf
`CELL/6` rastet, bekommt überall sanfte Terrassen und verliert die Klippe. **Steigung und Klippe
sind kein Gegensatz von Höhe, sondern von Stufengröße** — dieselbe Differenz ist eine Treppe in
zwölf Stufen und eine Wand in einer. Also ist die Stufengröße ein **Ort-Merkmal**: Hang 0,50 u ·
Terrasse 1,50 u · Kiste 3,00 u · Klippe 6,00 u, verteilt über eine langwellige Reliefkarte
(≈ 220 u). Das Höhenfeld darunter ist unverändert — an einer Reliefgrenze wechselt die Rasterung,
nicht der Berg. `stepAt(x,z)` ist eine reine Funktion des Ortes, also können Physik und Bild
nicht auseinanderlaufen.

**Abnahme L1 — RICHTIGGESTELLT 2026-08-12 (siehe Naht 115).** ⚠ Die erste Abnahme galt einem
festen Weltseed; **L2a hat ihn gewürfelt und damit L1s Zahlen still ungültig gemacht** — gefunden
hat das der Verifier, nicht ich. Die Schwellen sind seither **Flächenanteile** (Perzentilrang aus
einer je Welt gemessenen Verteilung), `reliefKontrast` ist ersatzlos weg.

*Global, 5 Welten, je 40 000 Proben über 12 000 u:* Hang **42–47 %** · Terrasse **31–34 %** ·
Kiste **15–16 %** · Klippe **7–8 %** (Ziel aus den Schwellen: 45/30/18/7 — die Regler bedeuten
jetzt, was sie sagen).
*Lokal, 6 Welten, 480 u:* 34–69 / 18–56 / 9–30 / 0–3 % — **die Streuung ist gewollt**: ein
480-u-Fenster enthält zwei Reliefwellenlängen, also ist ein Ort dort ein Ort und kein Durchschnitt.
*Die eigentliche Abnahmezahl:* Wände **in Klippengebieten 8,1–12,5 %** gegen **0,9–2,8 % sonst**
(4- bis 9-fache Konzentration) · gesamt mit Stufung 1,1–2,8 %, ohne 1,8–1,9 % · mittlerer
Nachbarsprung 0,44–0,52 gegen 0,55–0,60 u · größter 6,00 u · Weltwürfel inkl. Verteilungstabelle
**27 ms** · `__loopErr` null · `__bootErrors` 2 (die bekannten).

**Gestrichen, weil widerlegt:** die frühere Kernaussage „der Wandanteil ist mit und ohne Stufung
1,9 % — es sind nicht mehr Wände geworden". Gemessen hatte die Stufung den unkletterbaren Anteil
verdoppelt (1,8 → 3,1–4,5 %). Ein **Gesamtanteil kann eine Trennung nicht abnehmen**, er mittelt sie
weg (Naht 117).

**Startort, 40 Welten geprüft:** der Ursprung fällt **1 von 40** Mal in ein Klippenfeld; lokaler
Klippenanteil im 480-u-Fenster Median **2 %** (0–32 %). Aufgefallen ist es nur, weil die neue
Messzeile den Ort nennt. Nicht weggebogen — ein Startplatz mit Klippen kann dramatisch sein, das
ist eine Produktentscheidung; der Hebel wäre eine Startplatzsuche, kein Eingriff in die Verteilung.

**Gemessene Einschränkung, die dazugehört:** die Fläche außerhalb der Klippen ist mit 0,9–2,8 %
**nicht messbar begehbarer als v15**. Der Grund: „Kiste" (15–16 %) ist unverändertes v15-Verhalten,
und ein steiler, auf 3 u gerasterter Hang kann zwei Stufen zwischen Nachbarn springen. Wer die
Fläche wirklich begehbar will, schiebt *… bis Terrassen* hoch.

**L2 · Farbwelten (12.8., zweite Runde).** Drei Regeln standen vor dem ersten Bild:
(1) **Farbwelt ≠ Story-Modus** — der Modus trägt die TINTE (HUD, Würfel, Speedlines, Ton) und
gehört der Erzählung; eine Region wechselt nur Terrain, Himmel und Nebel. (2) ⚠ **Biom ist Farbe
und Props, NIE Höhe** — `setWorldContext` rebaked, `biomeShape`/`heightScale` verbiegen das
Höhenfeld, eine Biomgrenze im Flug hätte die Landschaft unter dem Spieler neu wachsen lassen
(dieselbe Disziplin wie die Wasserregel »Farbe, niemals eine Ebene«). (3) **Eine Bewegung, nicht
drei** — der Atem ist dieselbe Front wie der Wechsel, nur kleiner; ein zweites Morph-System wäre
die Konfetti-Falle aus §4v/82.
**Gemessen:** mittlere Weite einer Farbwelt **1500 u** (Kachel 1800, 8 Wechsel auf 12 km) ·
gleicher Ort → gleiches Ergebnis **ja** · Ursprung ist eine Kachel**mitte** ((0,0), (200,−200),
(−300,300) dieselbe Kachel) · Ereignisse in den ersten Sekunden **1** statt 2 (Naht 107) · Sprung
um 3000 u → genau **1** Wechsel · Atem 0° → 12,6° → 25,2° → 12,6° → 0°, kehrt um ·
drei Seeds → drei Welten (**11** mystical/Säuregrün · **42** forbidden/Glut · **777**
heroic/Bubblegum) · keine Fehlerzeile.
**Die Nähte 106–110:** (106) der Renderer konnte es die ganze Zeit — L2 brauchte **null Zeilen
GLSL**; wer nicht prüft, was sein Renderer kann, baut ein zweites davon · (107) ⚠ ein Raster,
dessen Nullpunkt auf einer Grenze liegt, feuert beim ersten Schritt · (108) eine Auswahl, die sich
von selbst zurücknimmt, sind zwei Wahrheiten über eine Farbe (Handauswahl schaltet die Farbwelten
ab und meldet es) · (109) ⚠ Biom ≠ Höhe · (110) der Atem ist dieselbe Bewegung wie der Wechsel.

**L2d · Ringwellen (12.8., dritte Runde).** Variante **A**: die Welle zieht durch, kein Gedächtnis.
Acht Plätze in einem Uniform-Array, Ring im Fragment-Shader — **kein Draw-Call, kein Attribut,
kein Rebake**, weil `vWXZ` seit v3 dort liegt. Eine flache Scheibe wäre falsch: sie z-fightet mit
den Würfeloberseiten und schwebt über Stufen, und L1 hat das Gelände gerade stufiger gemacht.
**Ausgelöst durch Ereignisse, nie durch den Beat** (Aufsetzen mit Wucht · Karte durchflogen vom Ort
der Karte · Farbwelt-Wechsel · Atemzug schwächer) — eine Welle im Takt wäre Deko statt Ursache.
**Gemessen:** Radius nach 2 s bei 46 u/s **92 u** · neunte Welle verdrängt die älteste · nach 7 s
alle Plätze frei · Ring-Scheitel **1,00** (alte Formel 0,50) · Fläche `#f54d8c` gegen Welle
`#66ff85`, ΔLum **+0,24** · keine Fehlerzeile.
**Die Nähte 111–114:** (111) ⚠ ein Backtick in einem GLSL-Kommentar beendet das Template-Literal
und der Fehler erscheint bei einem Nachbarn — **zweimal am selben Tag**, deshalb steht die Warnung
jetzt im Shader-Block · (112) ein Ring aus zwei smoothstep-Kanten erreicht im Scheitel nur die
Hälfte (0,50 statt 1,0; Atemzug kam auf 21 % Beimischung) — wer eine Kurve aus zwei Kanten baut,
muss ihren Scheitel ausrechnen, nicht ansehen · (113) ⚠ eine Welle in der Farbe der Palette ist
**per Konstruktion unsichtbar** — Kontrast zur Palette, nicht Mitgliedschaft in ihr · (114) der
Kontrast muss aus FARBE kommen, nicht aus Dunkelheit (ein dunkles Band liest sich als Schatten),
**und die Stelle in der Kette entscheidet mit**: vor dem Streu-Kanal des Terrains wurde der Ring
olivgrau, weil dieser jede Farbe um 11–28 % entsättigt.

**Backlog, bewusst außerhalb des Sprints (Georg, 12.8.):** **Variante B — die Welle FÄRBT EIN**
(`instanceColor`), Grundlage für farbige Wassertropfen aus dem geplanten Wetter. Die eigentliche
Frage dort ist nicht der Puffer, sondern **was beim Chunk-Recycling passiert**: eine Einfärbung,
die beim Wegfliegen verschwindet, ist keine Erinnerung — und eine, die bleibt, braucht einen Ort,
an dem sie wohnt (gerechnet oder gespeichert, dieselbe Entscheidung wie bei `stepAt`/`regionAt`).
Dazu ein Deckel gegen Matsch. Vollständig in `SPRINT_travel-v16.md` §3b.

**L3 · Kenney-Props (12.8., vierte Runde).** Die grauen Streu-Blöcke sind ersetzt: **9 Modelle**
aus `kenney_nature-kit`, zur Laufzeit über `asset-repo.json` (RAW, nichts kopiert), als **globale**
InstancedMeshes je Modell-Teil — **17 Draw-Calls statt 81** (vorher ein Streu-Mesh je Chunk). Der
Umbau macht das Bild reicher UND die Liste kürzer. **Die Standorte gehören dem Terrain**
(`propSites`): wer den Boden zweimal rechnet, hat zwei Höhen. **Biom-Logik über den Dateinamen** —
der Index hat von jedem Baum `_dark`/`_fall`, also ist „Herbstwald" ein Suffix und kein System.
**Die grauen Blöcke bleiben als Fallback**, nicht als Altlast: ein 404 macht die Landschaft ärmer,
nicht leer.

**Vor der ersten Zeile gemessen:** `kenney_nature-kit` liegt unter `Models/GLTF format/` — und
dieser Ordner enthält **`.glb`**. Wer die Endung aus dem Ordnernamen ableitet, baut 329 kaputte
URLs. Dazu: 19–31 Y-Ebenen bei den Bäumen, also **biegen** sie wirklich (der Verbieger braucht ≥ 4).

**L3b/c/d — Georgs drei Nachfragen, alle zu Vereinfachungen geworden:**
(b) *„Props sollten die Bewegung des Floor mitmachen — sonst versinken sie im Voxel."* Richtig; die
Reparatur war **nicht**, die Rechnung nachzubauen, sondern sie zu **teilen**: `MOTION_GLSL` als
exportierter Block, Uniforms als **dieselben Objekte** (`terrain.motionUniforms`). Die Phase kommt
vom WÜRFEL, nicht vom Prop — mit der eigenen Position liefe es minimal anders und versänke an den
Umkehrpunkten.
(c) *„runde Ecken"* = zwei Regler, keine Geometrie: Normale zwischen hart und weich mischen
(Beleuchtung) + entlang der weichen Normale aufblasen (Silhouette). *„mit der Terrain-Farbe
einfärben"* = **jedes Prop nimmt die Farbe des Würfels, auf dem es steht** (`kfbGroundColor`,
geteilte Paletten-Uniforms samt Front) — ein Wald färbt damit **mit** der Ringwelle um, ohne
benachrichtigt zu werden.
(d) *„Cartoon-Bounce aufwendig?"* Nein — es hat eine **falsche** Bewegung ersetzt: der Squash lief
an einer eigenen Uhr. Jetzt kommt er aus demselben `kfbBob` (Würfel unten → gestaucht, oben →
gestreckt) mit **Nachlauf** 0,09 s ± 0,06 s. `update()` ist dadurch leer geworden.

**Abnahme:** 9/9 Modelle in 307–453 ms · **17 Draw-Calls** · 4 030 Vertices · 1 376–1 427 Props
gesetzt, 0 über Budget (2 400) · Aufbau je Chunk-Wechsel **20–24 ms** (vorher 26–30, Naht 119) ·
`__loopErr` null · `__bootErrors` 2 (die bekannten).

**Die Nähte 119–121:** (119) 8 400 Attribut-Namenssuchen je Aufbau = anderthalb verlorene Bilder pro
Sekunde · (120) **die zweite Uhr ist der Fehler, nicht die fehlende Bewegung** — zweimal in einem
Slice, beide Male war die Lösung, den vorhandenen Takt zu teilen · (121) geteilte Uniforms brauchen
keine Synchronisation, und **die beste Synchronisation ist die, die es nicht gibt**.

**Offen bei L3:** der Aufbau (20–24 ms je Chunk-Wechsel) ist noch ein spürbarer Hänger — der Rest
sind `mulberry32` und Trigonometrie je Standort, also entweder ein Cache über die Chunk-Kachel oder
ein Aufbau in Scheiben über mehrere Bilder. Nicht gebaut, weil es eine Optimierung ohne Auftrag wäre.

**Asset-Aufräumen ist beauftragt, aber nicht von uns:** `docs/travel-v16/HANDOVER_assets_chatgpt.md`
ist ein **standalone** Auftrag an ChatGPT — zwei Indizes (`catalog.json` 2538 lokal gegen
`asset-repo.json` 986 mit `ghUrl`), sechs verifizierte Fallen (Ordner „GLTF format" mit `.glb`,
umbenannte Packs, verschachtelte Pfade, doppelte Namenswelten, Teilmengen, drei widersprüchliche
Größenangaben des Katalogs), Zielformat und **Verifikationspflicht** (jede URL mit HEAD geprüft,
Datum im Datensatz).

**T1 · Parametersatz und Testliste (12.8., fünfte Runde).** Panel *Varianten & Test*:
**Parametersatz sichern** schreibt 17 Abschnitte (Seed, Story, Biom, alle Regler, **plus die
Messwerte**) nach `localStorage['kfb-travel-params']`; die Testliste holt sie von dort. **Regler
würfeln** schüttelt die Grenzen durch und **lässt den Seed stehen** — man ändert Regler ODER Welt,
nie beides, sonst weiß niemand, welches gewirkt hat. Der Grund für das Ganze ist Naht 115: ein
Ergebnis ohne seinen Parametersatz ist eine Anekdote, und genau so wurde L1s Abnahme still
ungültig. Gemessen: 17 Abschnitte, Messwerte vollständig, `__bootErrors` **0** in `index.html`.

**S60d · Die drei Himmelswürfel zurück auf 120°** (Georg, 12.8.). `spreadAz` von 0,24 (≈ 29°) auf
**1**. Die 29° stammten vom 26.7. — damals sollten alle drei zugleich im Bild sein. Das war eine
Regie-Entscheidung, keine Messung, und sie kostete genau das, was die 120° leisten: eine ORDNUNG
des Himmels. Rückweg auf das alte Bild: 0,24.

**Offen (Georg am Regler):** Klippenanteil **7–8 %** (Schwelle *… bis Kisten*) — mehr Drama? ·
die Kiste behalten oder ihren Anteil den Terrassen geben (das ist der Hebel für „begehbar
außerhalb der Klippen", siehe Einschränkung oben)? · Klippenhöhe 6,0 u (über der Sprunggrenze 4,2)
oder überwindbar? · feiner Teiler 6 → 12 (0,25 u, unter der Tuschekante)? · Kachelgröße einer
Farbwelt (1800 u = 43 s) · Front-Dauer 9 s · Atemzug alle 44 s mit 12,6° · Lesbarkeits-Riegel bei
80 % · Wellentempo 46 u/s, Ringbreite 24 u, Deckkraft 100 % · **als nächstes L3 (Kenney-Props)
oder Variante B aus dem Backlog?**

---

## 4y. Overworld v13 — Fork (2026-08-12) + Doku-Abgleich

Fork von `KFB Overworld v12.dc.html` (Stand §4v). Der Runner ist beim Fork **nicht** angefaßt;
geändert sind nur die 39 Skriptpfade, das `x-import`-`from` und der Fork-Stempel im Kopf.
**Keine Modulzeile geändert** — die Module lösen ihre Nachbarn über die eigene Adresse auf, deshalb
wandert `icons-rpg/` mit dem Ordner.

| Artefakt | Rolle | Status |
|---|---|---|
| `KFB Overworld v13.dc.html` + `overworld-v13/` (56 Module + `icons-rpg/` + 3 JSON) | **der Arbeitsstand** | **AKTIV — main der 2D-Linie** |
| `docs/overworld-v13/SPRINT_overworld-v13.md` | Fork-Fakten, Fork-Abnahme, Slice-Reihenfolge, was NICHT gemacht wird | **AKTIV, maßgeblich** |
| `docs/overworld-v13/ABGLEICH_briefings_2026-08-12.md` | Briefings gegen Masterplan/Doku, Masterplan-Patch-Vorschlag, offener Runner-Diff | **AKTIV** |
| `KFB Overworld v12.dc.html` + `overworld-v12/` | Fork-Basis | **SUPERSEDED von v13 — nicht löschen** |
| `KFB Terrain-Probe v1.dc.html` (tp-probe-v1) | **Messplatz, kein Spiel** — Pirate Bomb neben Tiny-Swords-Einheiten/Requisiten auf lean Boden; lädt über `OW_SRC` → `OW_UNITS.heroDef` → `OW_LOADER.loadUnit(refBody 91)`, misst mit `probeBox`. Liest nur, ändert kein Modul | **AKTIV (Autoren-Werkzeug)** |
| `uploads/HANDOVER_Cowork_2026-08-12.md` + `kfb_overworld_living_doc.html` + `kfb_piratebomb_bundle(1).html` | **Eingang Coworker 12.8.** — Bubble-Setzungsarbeit (O1–O7, 12 ausgerechnete Fixtures), Asset-Befunde (Pirate Bomb CC0/20 fps/0 % Saum; Emanata-Blatt A ohne Raster; King 29 646 Farben → Portrait) | **AKTIV, maßgeblich für Runde 1** |

**Fork-Abnahme steht aus** (Reihenfolge im Sprint-Blatt §1): Module 39/39 · `[rail-v9b] Kartenspalte
steht` · Roster-Fußzeile `30 gemessen · …` · `[water]`-Zeile · Save trägt `hero.unit` (2.4.0) ·
Statblatt-Papier voll deckend. **Ohne diese Zahlen ist v13 GEBAUT, nicht LÄUFT** (Hausregel 4).

**Befund des Abgleichs (2026-08-12), drei Sätze:**
(101) **ein Plan, der drei Forks alt ist, wird stillschweigend zur zweiten Wahrheit** — der
Masterplan hat Stand 9.8./v10 und kennt neun Entscheidungen aus v11/v12 nicht (Ink-Regel,
Wasser-Kanon, 30 statt 31 Einheiten, Körper-Tempo, Journey 2.4.0, Statblatt-Rücknahme,
Kamera-Klammer, `aufBlatt()`, Glitzern aus). Er gehört WS1 — deshalb steht der Patch als
**Vorschlag** im Abgleich, nicht als Änderung am Plan.
(102) ⚠ **zwei ungesendete Runden übereinander** — §4v markiert drei Dateien als »Diff an WS1«,
seither sind `water-form`, Kamerazweig, `stepReader`, `spawnPoints`, `spawnCritters`, Journey 2.4.0
und die vier Rail-Befunde dazugekommen. Das Sync-Ritual (§6 Masterplan) sagt: eine Richtung, eine
Runde, ein Export. Empfehlung: Handover-Blatt **vor** dem ersten v13-Slice.
(103) **der Pixelbäcker liegt fertig, aber ohne Empfänger** — vier Prüfpunkte vor dem Absenden
(Loader-Messung gegen `bake.json` als Abnahme statt als Beleg · Outline (a) ausdrücklich als
nicht-KFB-Kante deklarieren, sonst zweite Feder gegen K5 · Körperhöhe in **Quellpixeln** melden ·
`shadow.lean/off` an **einen** Ort). Dazu fehlt ihm Naht 66/72: ein Werkzeug, dessen Ergebnis ein
Bild ist, darf nicht über die Vorschau abgenommen werden.

**Erste Messung an der Probe (12.8.):** Bald Pirate **Körper 59 px → ×1,54 = 91 px** neben Warrior
(192er-Zelle, 91 px, ×1,00) und Minotaur (Streifen, 129 px → ×1,23 = 159 px). Die Leinwand 63×67 ist
also **nicht zu groß** — die Figur füllt sie knapp zur Hälfte. Damit ist die offene Entscheidung 11
des Cowork-Handovers gemessen statt geschätzt.
(104) **Pirate Bomb ist ein DRITTES Blattformat** — der Katalog kennt `rowsheet` (192er-Zellen) und
`strips` (eine Datei je Animation); hier liegt **ein Bild je Frame in einem Ordner** (181 Bilder).
Entweder ein dritter Zweig `framedir` im `unit-loader` oder einmal zu Streifen backen (181
Anfragen → 11). **Nicht stillschweigend als `strips` eintragen** — das Blattformat entscheidet die
Bauart, und eine falsche Formangabe ist eine zweite Wahrheit über dieselbe Figur.

**Reihenfolge nach dem Cowork-Eingang (Slice-Plan im Sprint-Blatt §5):** H0 Handover (halbe Runde) →
Runde 1 **Bubble/ChatterBox** C1–C5 gegen die 12 ausgerechneten Fixtures → Runde 2 **Pirate Bomb**
P1–P5. Der Einwand des Coworkers ist angenommen: eine Runde Handover, keine Serie — v12 war ein
Housekeeping-Fork, v13 darf kein zweiter werden.

**Entscheidungen Georg 12.8. (Formular + Blick auf die Probe):**
| Frage | Entscheidung |
|---|---|
| Reihenfolge v13 | **H0 Handover → Bubble/ChatterBox C1–C5**, danach Pirate Bomb |
| Masterplan | **eine Zeile Vermerk am Kopf** — gesetzt am 12.8.: »liegt hinter dem Code, keine gültige Quelle für v11+«. Eigentum bleibt WS1, eingearbeitet wird dort |
| Pirate-Bomb-Maßstab | **HERO_REF-normiert** — »pirates passen super so« am Blatt (Bald Pirate ×1,54 = 91 px, neben Archer und Captain gesehen) |
| Blattformat | **zu Streifen backen** und als `strips` eintragen (181 Anfragen → 11) — kein dritter Loader-Zweig |
| Richtungen | **zwei** (spiegeln); die Ruheposen stehen fast frontal |
| Rolle | **alle fünf**: Gegner am Steg/Ufer · Card-Zone-Wächter · Bewohner/NPC · **Captain als Card-Owner** (Fluchtanimation) · Wegelagerer-Zone |
| Emanata | **Blatt B beauftragen** (7 fehlende Zeichen) + **Blatt A umbenennen** (keine Leerzeichen/Kommas/Punkte). Cyan-Frage bleibt offen |
| King Kayfabon | **zweiter Auftrag** — nicht Portrait aus dem Bestand, nicht Unit |

**H0 erledigt 12.8.:** `docs/overworld-v13/HANDOVER_WS1_2026-08-12.md` — und der Diff ist **größer
als §4v behauptet hat**: gemessener Byte-Vergleich v11 gegen v13 ergibt **acht** Dateien statt drei
(`water-kiss.js` neu · `overworld-game-v10.js` · `card-rail-v9b.js` · `terrain-paint.js` ·
`journey.js` · `card-backs.js` · `asset-source.js` · `gutter-2d.js`), am Wirt ein Attribut
`water-form`. `units-catalog.js`, `unit-loader.js`, `mob-ai.js`, `game-feel.js`, `reach.js`,
`shots.js`, `roster-sheet.js` sind **unverändert**.
(105) **eine Diff-Liste aus dem Gedächtnis ist eine Schätzung** — drei genannte Dateien, acht
gemessene. Der Byte-Vergleich kostet eine Minute und ist die einzige Fassung, die ein Empfänger
nachbauen kann.

**Slice C1 · Blasen-Layout (12.8.) — abgenommen gegen die Erwartung, nicht gegen den Eindruck.**
| Artefakt | Rolle | Status |
|---|---|---|
| `overworld-v13/bubble-layout.js` (bl-v1.0) | **die Setzungen als Code**: fünf Arten, ausgeglichener Umbruch (DP über Quadratsummen), Innenabstand in em, Kasten aus dem Textblock, Zeiten (34 Zchn/s · 800+42·n gedeckelt 5000 · Abgang 220 · min 1200). Kennt **keine** Blasengröße als Eingabe | **AKTIV — Leser folgen in C2/C3** |
| `KFB Bubble-Fixtures v1.dc.html` | die **Abnahme**: zwölf O7-Fixtures, Soll/Ist je Zeile, Gegenprobe füllend↔ausgeglichen, eigener Satz | **AKTIV (Messblatt)** |

**Abnahme 2026-08-12:** `[bubble-fixtures] C1 · 12/12 Fixtures · Zeilen 12/12 · Umbruch 5/5 ·
Zeiten 12/12 · Überlauf gemeldet`. Im Bild geprüft: `sandwich` 3 Zeilen / 5090 ms (Obergrenze und
Haltedeckelung), `thought` einzeilig bei genau 28 Zeichen, `overflow` **4 Zeilen → abgewiesen**
(»zu lang als INHALT, gehört gekürzt«), Gegenprobe zeigt bei vier von fünf Fällen die
Ein-Wort-Restzeile links und den Ausgleich rechts.
(106) **die Blase wird aus dem Textblock abgeleitet, nie umgekehrt** — deshalb nimmt das Modul keine
Größe an: die leere Riesenblase kann nicht entstehen, sie ist konstruktiv unmöglich.
(107) **der füllende Umbruch ist keine Ungenauigkeit, sondern eine andere Methode** — er füllt und
lässt den Rest fallen; der Ausgleich minimiert die Summe der Quadrate. Bei gleicher Zeilensumme ist
sie genau dann minimal, wenn die Zeilen gleich lang sind. `wrapFill()` bleibt als **Gegenprobe** im
Modul, nicht als Rückweg — wer sie im Spiel benutzt, hat den Slice zurückgedreht.
(108) **ein Modul, das seine eigene Abnahme kennt, prüft sich selbst** — die zwölf Erwartungswerte
stehen im Messblatt, nicht in `bubble-layout.js`.
**Offen aus O6, jetzt sichtbar:** Flüstern hat **keine** gesetzte Zeilenlänge. Fixtures sind mit
**28** gerechnet, rechnerisch sind es **33** (kleinere Schrift, mehr Zeichen). Regler liegt im
Messblatt (Tweaks); bei 33 wird `whisper` einzeilig. **Georgs Entscheidung.**

**Slice C2 · Fünf Formen (12.8.) — und zwei Konturen zweimal gebaut.**
| Artefakt | Rolle | Status |
|---|---|---|
| `overworld-v13/bubble-ts.js` (**bubble-ts-v2**) | fünf Register: rede · gedanke · **ruf (Sternplatzer)** · fluester · **kayfabulate (Kasten)**. `satz()` ist die EINE Satz-Rechnung (Umbruch + Schriftgröße + gemessene Zeichenbreite), `formen` gibt die Konturen einzeln heraus | **AKTIV — Diff an WS1** |
| `KFB Blasen-Formen v1.dc.html` | Messblatt C2: fünf Register nebeneinander, Ankerwinkel und Streuung am Regler, Zahlen je Block | **AKTIV (Messblatt)** |

**Der Kern des Slice:** der Textblock kommt aus `bubble-layout.js`, die Kontur legt sich darum.
Vorher stand im Träger `max-width:230px` — also eine Blasengröße, in die Text gelegt wird, genau die
Reihenfolge, die O6 verbietet.
(109) **eine angenommene Zeichenbreite ist eine angenommene Blasenbreite** — `charPx = font·0,60`
stimmt für Courier, nicht für Bangers und nicht für einen Ersatz-Monospace: der Text lief aus der
Kontur. Jetzt `measureText` über den wirklichen Satz. *Gemessen, nicht angenommen* — dieselbe Regel
wie beim Bestand, nur eine Ebene kleiner.
(110) ⚠ **eine Zacke auf einer Kante ist kein Platzer** (Georgs Befund) — der Ruf war ein Rechteck
mit Sägeprofil. Comic-Logik ist **radial**: ein **Kranz** aus 12–18 fast gleich langen Spitzen, Täler
bis auf den Block (0,92), dazu **Aufprall-Striche** in drei gesetzten Gruppen außerhalb der Fläche.
Zwischenschritt verworfen: 7–11 stark gestreute Spitzen auf einem Oval — das las sich als Klecks mit
zwei Hörnern. *Die Wirkung kommt aus Zahl und Tiefe, nicht aus Streuung.*
(111) **der Kranz braucht einen runderen Grund als der Text** — ein einzeiliger Ruf ist 3,6:1 flach;
mit dem Rechteck als Grundmaß wachsen zwei waagerechte Hörner. Die kurze Achse wird auf mindestens
0,42 der langen angehoben. *Die Kontur folgt dem Block, ihr Grundmaß folgt der Form.*
(112) **eine Wolke ist ein Kranz aus Lappen, keine gewellte Kante** — `blobPath` verband Punkte auf
einer Ellipse mit Bögen vom halben Sehnenmaß: eine gewellte Kartoffel. Jetzt Kerben auf dem Grundmaß
und Lappen als Bögen mit **Bauchung 0,74** darüber.
(113) **ein fehlender Kanon heißt dünnere Kante, nicht keine** — ohne `OW_CARD.canon` (ES-Import über
den CDN) zeichnete das Flüstern gar keine Kontur, und der Fehler war unsichtbar. Rückfall auf einen
gestrichelten Strich **mit Konsolenzeile**.
(115) ⚠ **der Weg, auf dem das Flüstern seine Kante holte, existiert im Kanon nicht — seit v10-S15.**
Gemessen am geladenen Kanon v2: er führt `inkRibbon2D` · `inkHalfWidth` · `measureInk` und die
Presets `card · chip · academy-2026-07 · sky-2026-07` — **kein `dashedPathD`, kein `card-dash`.**
`fluesterKante()` lieferte darum immer `''`, die Blase wurde mit `stroke-width 0` gezeichnet, und
sichtbar war nur der Schlagschatten. Ein Jahr Doku sagt »gestrichelte Kanon-Feder«; gebaut war ein
Griff nach einer API, die es nicht gibt. *Ein Aufruf mit Rückfall auf Leerstring meldet nichts —
er sieht wie eine Absicht aus.* Zusätzlich: `inkRibbon2D` zeichnet auf **Canvas**, nicht in einen
SVG-Pfad. Eine Kanonfeder im Overlay braucht also eine Canvas-Ebene oder eine SVG-Ausgabe im Kanon.
**Kein zweiter Federzeichner** (K5) — die gestrichelte Variante gehört in `kfb-ink-canon.js`, und
die gehört WS1. Bis dahin: gestrichelter Strich als **benannter** Platzhalter, mit Konsolenzeile.
(116) **ein Guard auf ein noch nicht geladenes Modul ist ein stiller Verzicht** — das Messblatt rief
`OW_CARD.ready()` einmal in `componentDidMount`, da war `window.OW_CARD` noch nicht da: der Guard
griff nicht, danach fragte niemand mehr. Jetzt nachziehen, bis es da ist (dasselbe Muster wie die
`OW_HERO`-Abfrage in der Terrain-Probe).
(117) **ein leeres Fehlerobjekt ist keine Erklärung, die Reihenfolge ist es** — die fünf
`render error … {}` beim Aufbau kamen von `ref`-Rückrufen, die **vor** `componentDidMount` feuern:
`this.b` gab es da noch nicht. Als Klassenfeld deklariert, weg.
(114) **eine Ergänzung im Export, die nicht greift, sieht wie eine Absicht aus** — `aufprall` fehlte
in `OW_BUBBLE.formen`, der Aufruf im Messblatt lief in einen `TypeError`, die Zeichenschleife starb
still, und drei Karten zeigten **alte** Geometrie. Gefunden nur, weil die Punktzahl der Pfade gezählt
wurde. *Ein Messblatt, das nichts mehr aktualisiert, sieht aus wie ein Messblatt.*
**Dritter Anlauf, 12.8. spät (Georg an fünf Bildern):**
(118) **eine Blase hat eine ovale Grundform, keine Kreissumme** — »die Bubbles dürfen nicht stumpf
aus Kreisen gebaut sein; es muss eine ovale Grundform sein, die harmonisch mit Bogenformen
nachgezeichnet wird«. Wolke UND Ruf sitzen jetzt auf **einer** Grundellipse (Halbmaße × √2, kurze
Achse ≥ 0,46 der langen, `ovalBasis()`). Vorher war das Grundmaß der Abstand zur **Rechteck**kante —
der springt an den Diagonalen, daher die zwei waagerechten Hörner (Ruf) und die gewellte Kartoffel
(Wolke). *Die Ellipse ist die Harmonie, die Bögen sind die Handschrift.*
(119) **die Denk-Kreise gehören AUSSERHALB der Wolke** — sie saßen auf halber Blockbreite und lagen
damit unter den Lappen. Jetzt vom Ellipsenrand plus Lappenhöhe gemessen.
(120) **ein Kasten mit toter Linie ist ein UI-Dialog** — Kayfabulate bekommt dieselbe Federsprache
wie die Rede (vier Zwischenpunkte je Kante, ±1,3 px), nur ohne Zipfel.
· Pfeilbasis der Rede 18 → **13,5 px** (»ca. 1/4 schmaler«).
(121) **ein Stil ist eine Maske über der Kante, keine zweite Kante** (Georgs Lösung für Naht 115):
gestrichelt heißt **Lücken über einer durchgängigen Kante**. `luecken()` stanzt quer zur
Laufrichtung in eine SVG-Maske; die Kante wird einmal gezeichnet. Damit braucht das Flüstern **keine**
zweite Feder — und dieselbe Maske liegt später über der Kanon-Feder, sobald die im SVG ankommt.
**Ehrlich dazu:** heute tragen Flüstern und Kasten die **Jitter-Kante des Trägers**, nicht die
KFB-Kanon-Feder. Die zeichnet auf Canvas (`inkRibbon2D`), das Overlay ist SVG — Bitte an WS1 steht
im Handover §5b.
**Vierter Anlauf, 12.8. Nacht — die Kante kommt jetzt wirklich aus dem Kanon:**
(122) **die KFB-Feder für ALLE Register, ohne zweiten Zeichner** (Georg: »Ruf hat eine dead line …
bitte für alle«). Der Kanon zeichnet auf **Canvas**, das Overlay ist SVG — also bekommt das Overlay
eine **Canvas-Ebene**: Fläche, Maske und Klick bleiben SVG, die **Kante** zeichnet `inkRibbon2D`
über dieselbe Punktkette, die die Fläche begrenzt (`kanonFeder()`, Preset `card`). Gemessen im
Messblatt: Tuschepixel je Karte **7582 · 7055 · 8445 · 2802 (Flüstern, mit Lücken) · 6146**.
Rückfall auf die SVG-Kontur bleibt und meldet sich.
(123) **eine Form aus `A`-Befehlen hat keine Kante** — die Wolke bestand aus Bögen; die Feder liest
eine PUNKTLISTE. Jetzt acht Stützpunkte je Lappen (quadratisch, Bauchung 0,42 der Sehne): optisch
derselbe Zug, aber eine Kette, die jeder lesen kann.
(124) **ein `canvas.width`-Schreibzugriff löscht die Fläche** — je Bild neu gesetzt heißt: zwischen
Löschen und Zeichnen darf nichts schiefgehen. Jetzt nur bei Maßänderung. Dazu Hausregel 8 im
Messblatt nachgezogen: **eine Kachel darf misslingen, die Bildschleife nicht** — ein Fehler in einer
Form hatte alle fünf Karten eingefroren, und eingefrorene Karten sehen aus wie fertige Karten.
(125) **ein Polster in em schrumpft mit der Schrift, der Zeichenstrich nicht** — beim Flüstern
(0,85-fach) fielen 0,60 em auf 8 px. `bubble-layout.js` hat jetzt ein **Mindestpolster** (11/8 px).
(126) **die Ellipse durch die Ecken polstert ungleich** — Halbmaß × √2 sitzt an den Ecken am Block
und steht an den Seiten 41 % ab (bei einer breiten Zeile 40 px seitlich gegen 14 px oben). Jetzt
eine **Superellipse** (n = 3) mit Mindestskalierung: gleicher glatter Zug, überall ähnliches Polster.
(127) **ein Rand, gemessen vom Block, ist definitionsgemäß null** — die erste Messung ging vom
Textblock aus, der das Polster schon enthält. Gemessen wird ab der **Schrift**; das Messblatt zeigt
die Zahl je Register.
**Schrift entschieden (Georg, 12.8. Nacht): `shantell` ist die Vorgabe** — Shantell Sans für alle
Blasen, **Special Elite für den Erzählkasten** (Kayfabulate), Bangers bleibt beim Ruf. Der Bestand
schrieb Courier: sauber, aber nicht gesprochen. *Erzählung darf nicht dieselbe Stimme haben wie
Rede — die Schrift trägt denselben Unterschied wie die Form.* Umsetzung: `SCHRIFT='shantell'` +
`SCHRIFT_JE_ART={kayfabulate:'elite'}` in `bubble-ts.js`, Schriften werden im Träger nachgeladen.

**Zwei Befunde von Georg am Bild (12.8. spät), beide behoben:**
(139) ⚠ **ein Rückfall ohne Wiedervorlage wird zum Zustand** — die Aktionskarten des v7-HUD standen
mit runden Ecken und ohne Tuschekante da. Grund: der Kanon lädt asynchron; die Karten der Hand
entstehen **nach** dem einen Nachzeichnen bei `loadInk().then()`, zeichneten also mit dem Rückfall
und wurden nie wieder angefaßt. Eine runde Ecke sieht nicht nach Fehler aus, sondern nach Entwurf.
Jetzt merkt `draw()` jede Fläche, die ohne Kanon gezeichnet hat (`OHNE_INK`), und zieht sie nach —
plus ein zweiter Blick nach 1,2 s. Gemessen im Spiel: 6 Aktionskarten, je **~3250 Tuschepixel** auf
der Kante (vorher 0).
(140) **Chat aus** (Georg): `chatter` steht im DC jetzt auf `off`. Die Umgebungs-Plauderei ist damit
stumm, **nicht ausgebaut** — der Weg zurück ist dieser eine Wert in den Tweaks.

(141) **was verschwindet, muss verschwinden dürfen** — das Logbuch ist eine rollende Liste mit
fester Höhe (`min(19vh,108px)`); die älteste Zeile wurde hart beschnitten und las sich als Defekt
(»chat ist abgeschnitten«). Jetzt läuft sie oben weich aus (Maske 0 → 22 px). Kein Layoutwechsel,
eine Zeile CSS.

⚠ **OFFEN, gemeldet 12.8. spät (Bild): das POP-Blatt überlappt sich selbst** — der Avatar hängt über
der ersten Wertezeile (»Bizarro« halb verdeckt), Kopfzeile und Liste teilen sich denselben Platz.
Gehört in denselben Lauf wie die Fenster-Doppelung: **erst Besitz klären, dann messen, dann rücken.**

⚠ **OFFEN, gemeldet 12.8. spät: dieselbe Quest-Karte steht zweimal im Bild** (Georgs Bild:
»The Convert Bonus«, das Blatt doppelt untereinander). Nicht diagnostiziert — Verdacht: das
Quest-Fenster zeichnet Blatt und Viertelseite übereinander, oder ein Knoten wird beim Neuaufbau
nicht geleert. **Erster Schritt für den nächsten Slice: nicht raten, sondern zählen** — wie viele
Knoten trägt der Quest-Behälter, und wer hängt sie ein.

**Auftrag für v14-V1 (Georg, 12.8.): Besitz der Fenster klären — als Prüf- UND Reparaturlauf mit
Bildbeweisen.** Verfahren, damit es kein Augenmaß wird: je Fenster ein Bild am **festen Standpunkt**,
davor die gezählten Knoten (wer hängt ein), danach dieselben Zahlen. Überlappungen werden **gemessen**
(Rechteck gegen Rechteck, Überlauf in px), nicht geschätzt — dieselbe Regel wie beim Statblatt
(Naht 89: ein Layout über Budget sieht nicht schief aus, sondern kaputt).

**Abnahme v13 im Standalone (12.8.), damit steht die Zahl:** Module **39/39** ·
`[rail-v9b] Kartenspalte steht · Quests 2` · `[journey] Einheit aus dem Spielstand: gnoll`
(Schema 2.4.0 liest zurück) · `[water] water-v2.0 — Glitzern steht auf aus` · `[bubble-layout]
bl-v1.1` · Kanon v2 geladen · `__bootErrors` **0** · Welt 240×180, 6 Zonen, 23 Mobs + 8 Wegelagerer,
Rückseiten 6/6. **Damit ist v13 LÄUFT, nicht nur GEBAUT.**
Bekannt und benannt geblieben: `KFB_Props/sheet-02.png` fehlt im Repo (Requisiten kommen aus dem
Tiny-Swords-Vorrat, 700), `drop_002.ogg` dekodiert nicht (seit 9.8.), `HUD-Skin v7 · undefined`
(kosmetisch, aber es steht in der Zeile, die sonst die Abnahme trägt).

**Vier Pfad-Fänge aus dem Bündeln (12.8., alle behoben und im Export):**
(135) ⚠ **eine relative Adresse gegen eine `blob:`-Basis wirft — und zwar synchron im Promise.**
`new URL('./x.json', 'blob:…')` ist kein gültiger Aufruf; der Fehler erreicht den vorhandenen
Rückweg **nicht**, sondern landet als unbehandelte Rejection. Betraf `hud-v7.js` (Kanon-Kandidat,
`hud-slots.json`) und `card-ink-2d.js`. *Ein Rückweg, der erst nach dem Wurf greift, ist keiner.*
(136) ⚠ **das gemessene Kartenraster ging im Standalone verloren** — `card-grids.json` wurde relativ
aufgelöst, der Wurf fiel in den `catch`, und die ausgelieferte Fassung zeichnete mit dem **geratenen**
Rückfallwert, während die gemessenen Zahlen (V10-S7) danebenlagen. Jetzt zwei Kandidaten: eigene
Adresse, dann `OW_SRC.ow()`.
(137) **ein 404 mit hübschem Ersatz fällt nie auf** — `prop-sheet.js` lud seit dem v11-Fork
`./overworld/prop-sheets.json`, den Ordner gibt es hier nicht mehr. Sichtbar wurde nichts, weil der
Rückfall 700 Tiny-Swords-Requisiten liefert. Der falsche Pfad wäre mit dem Check-in weitergereist.
(138) **das Bündel ist der einzige Ort, an dem diese Klasse auffällt** — im Projekt lösen sich alle
vier Adressen sauber auf. *Wer nur im Projekt prüft, prüft die Umgebung mit, in der der Fehler nicht
vorkommt.*

**Check-in 2026-08-12: `export/overworld-v13_2026-08-12/`** — Code (57 Module), vier **Standalone-
HTML** (Overworld · Bubble-Fixtures · Blasen-Formen · Terrain-Probe), `docs/overworld-v13/` (Sprint ·
zwei Abgleiche · Spec Lettering · Handover WS1), HOUSEKEEPING-Kopie, Masterplan-Kopie (Eigentum WS1),
die Bauanleitung des Coworkers als Eingang, Schreibweisen-Kanon, README mit Diff und Abnahme.
(133) **eine Kopfzeile, die einmal beim Mount gelesen wird, altert sofort** — im Standalone stand
»bubble-ts fehlt«, während die Blasen daneben zeichneten.
(134) ⚠ **ein Blatt, das alles in `renderVals` rechnet, meldet im Standalone 0/15** — die Rechnung
lief, nur zu früh: das Modul war beim ersten Rendern noch nicht geladen. Beide Blätter ziehen jetzt
nach. *Ein Messblatt, das »0/15« zeigt, ohne dass etwas kaputt ist, ist schlimmer als eines, das
gar nichts zeigt.*

**Slice C1b · Lettering in der Blase (12.8., nach Perplexity-Recherche + Coworker-Prüfung).**
Spec: `docs/overworld-v13/SPEC_lettering_2026-08-12.md` — **drei Zeichen, mehr nicht:** `*wort*`
(Betonung, fett), `…` (Pause/Auslaufen/Fortsetzung), `--` (Unterbrechung). Gestrichen: Kursiv-Markup,
zweite Betonungsstufe (bold italic), Uppercase-Zwang, Laufweiten-Dehnung, Token-Datenmodell mit
`marks[]`. Leitsatz: **ein typografisches Mittel, eine gesprochene Eigenschaft** — die Form trägt
Modus und Lautqualität, die Schrift nur Betonung, Pause, Abbruch.
Gebaut: `bubble-layout.js` **bl-v1.1** (`parse` · `normalisieren` · `segmente`, Deckel 1 Betonung bei
≤34 Zeichen, sonst 2) + `bubble-ts.js` **bubble-ts-v3**. Abnahme **15/15 · Umbruch 7/7 · Zeiten 15/15**.
(129) **Markup, das mitzählt, bricht die Zeile zu früh** — Umbruch und Zeiten rechnen auf dem
**sichtbaren** Text. `trailoff`: »...« → »…« macht aus 24 Zeichen 22, und die Zeit sinkt mit.
(130) ⚠ **fett ist breiter, also rechnet der Ausgleich in Pixeln** (Coworker-Fang): der ausgeglichene
Umbruch minimiert die Abweichung der Zeilen*längen* — mit einem fetten Wort ist die Zeichenzahl nicht
mehr die Länge. Die 28 Zeichen bleiben Deckel, die Ausgleichsrechnung nimmt die **gemessene** Breite,
und die Breitenfunktion bekommt je Wort den Schnitt mit. Ohne das sitzt genau die Zeile mit der
Betonung daneben.
(131) **ob eine Schrift Fettdruck kann, ist eine Messung** (Coworker-Fang): 400 gegen 700 gemessen;
unter 6 % Unterschied gibt es keinen echten Schnitt (synthetisch verfettet sieht bei 13 px matschig
aus). Dann trägt die Betonung Größe (×1,06) und Laufweite statt Fettdruck — ein Mittel, eine
Eigenschaft, nur ein anderes Mittel.
(132) **ein fettes Wort, das buchstabenweise einläuft, verliert seine Auszeichnung mittendrin** —
ein betonter Satz wird gesetzt, nicht getippt (wie der Ruf, Naht 128).
**Offen dazu:** die Anschluss-Ellipse bei geteilten Blasen (erste endet mit `…`, zweite beginnt mit
`…`) ist Spec, aber noch nicht im Code — sie gehört zu `split` in C3.

(128) **ein Schrei tippt sich nicht** — der Ruf wird jetzt **gesetzt**: Zeichen einzeln auf einem
flachen Bogen (15° Spanne, Drehung je Zeichen, Kipp ±1,6°, geseedet), dazu eine leichte
Gesamtneigung und Scherung. Bangers gerade auf der Linie las sich wie eine Überschrift.
Kein Filter, kein Warp — nur Buchstaben auf einer Kurve. Folge: für den Ruf ist das
Zeichen-für-Zeichen-Streaming **aus** (es würde den Bogen bei jedem Bild neu setzen).
`OW_BUBBLE.bogenSatz(text,seed,bogen)`; die Extremvariante aus Georgs Vorlage (starker Bogen,
Umriss-Schrift) bleibt eine Ausbaustufe.

**Abgleich mit dem Coworker-Handover (`uploads/HANDOVER_Bubbles_Design.md`), 12.8.:**
`docs/overworld-v13/ABGLEICH_bubbles_2026-08-12.md`. Deckungsgleich in allem Zählbaren (Fixtures,
Zeiten, Umbruch, Maße, »keine zweite Tusche«). **Ein echter Widerspruch:** die Bauanleitung §5.5
verlangt »**kein** gleichmäßiger Sternburst, 8–16 **unregelmäßige** Zacken«, gebaut ist auf Georgs
Ansage ein **Kranz** mit ±7 % Winkelstreuung — der erste, unregelmäßige Anlauf war von Georg als
Klecks mit Hörnern verworfen worden. *Regelmäßigkeit im Winkel ist billig, Regelmäßigkeit in der Zahl
ist Comic.* Vorschlag (nicht gebaut): ein bis zwei Zacken ×1,45, eine nach innen gekippt.
Sechs benannte Lücken (Gedankenpfad-Radien und Querversatz · Tail-Ansatz unteres Drittel +
Gesichts-Anker als Datum je Einheit + Deckel 22 statt 34 · Gedanke kursiv · Flüstern kontrastärmer ·
Wolke mit Bruchstellen · Debug-Schalter im Spiel) — alle in C2-Nachzug oder C3 einsortiert.
⚠ **Zwei Stellen veralteter Kanon im Handover:** »Puste, Witz, Schneid« ist am 9.8. verworfen (es
gelten sechs Werte + Fluff + POP), und »BLÖDSINN!« ist **beides** — sechster Wert **und** Todes-Regie.
**Perplexity:** zu Sprechblasen liegt im Workspace **nichts** vor (die zwei Blätter sind Tiny Swords);
drei Fragen sind im Abgleich §6 formuliert, damit der Abgleich nicht erfunden wird.

**Schrift-Variante (Georg 12.8.):** `OW_BUBBLE.SCHRIFTEN` — `courier` (Bestand) · `elite`
(*Special Elite*) · `shantell` (*Shantell Sans*), umschaltbar im Messblatt (Tweaks). Wer umschaltet,
ändert auch die **Messung**: `satz()` misst mit der wirklich gesetzten Schrift.

**Angefordert, noch nicht gebaut:** eine **wellige** Kontur (»emotional bewegt«) als sechstes
Register, hoch **und** quer — Vorlage liegt in `uploads/` (12.8.).

**Offen (O2), unverändert:** Kayfabulate als Kasten (so gebaut) oder als Blase mit doppelter Kontur.
**C3 findet vor:** `OW_BLAYOUT.PLACE` (Anker +6 px, Zipfel max 22 px, Emanatum 4 px, zwei Blasen).

**Eingang 12.8. spät: Franken-Bündel v2 (Georg, »update für später«)** — Pirate Bomb ist **fünf**
Figuren, **485 Bilder**, ~620 kB: Bomb Guy 58×58 (Inhalt 49×54, **kein Angriff**, dafür
`10-Door In`/`11-Door Out` mit je 16 Bildern = ein **Erscheinungsritual**), Bald Pirate 63×67
(39×59), Cucumber 64×68 (30×61, *Lunte auspusten* = defuse/deny), Captain 80×72 (48×67, Angstlauf),
Whale 68×46 (64×40, *Bombe verschlucken* = swallow/accept, einziger breiter als hoch). Weicher Saum
0,0 %, 14–21 Farben, Leinwand je Figur konstant, 20 fps kanonisch.
**Der inhaltliche Fund:** alle reagieren auf **denselben Gegenstand** verschieden — der Skeptiker
entschärft, der Gläubige schluckt, die Autorität flieht. Das ist die Card-Zone-Dynamik als fertiges
Animationsvokabular. Rollenvorschlag des Coworkers: Bomb Guy NPC/zweite Heldenhaut · Bald Pirate
Standard-Mob · Cucumber Skeptiker · Whale Gläubiger · Captain Card-Owner am Zugang.
In der Terrain-Probe sind alle fünf eingetragen (`PB_CHARS`, Bilderzahlen übernommen, nicht
geschätzt). **Für P2 kommt damit ein Manifest dazu** (Bündel §6, `kfb.sprite-pack/0.1`): der Lader
kennt nur `idle/walk/attack/…`, welcher Ordner dahinter liegt, steht in Daten — sonst kostet jedes
neue Paket (Kings and Pigs) eine Codezeile. **Noch offen:** `footY` als Vertrag, `view:"side"`
sichtbar halten, Tile-Set ungeprüft.

**Offen, unverändert aus §4v:** (1+2) Ink-Outline als System + Linienstärken · (3) Gummiband —
**vor dem Bauen messen** · (4) Sprechblasen mit Level · (5) sieben Einheiten ohne Porträt ·
Cartoon-Wasser-Referenzen (Georg).

---

---

## 4z. Overworld v14 — Fork (2026-08-13) + V1 »Besitz der Fenster«

Fork von `KFB Overworld v13.dc.html` (Stand §4y, Check-in `export/overworld-v13_2026-08-12/`).
Der Runner (`overworld-game-v10.js`) ist beim Fork **nicht** angefaßt; v13 bleibt Vergleichsmaßstab
(SUPERSEDED, nicht löschen). 49 Skriptpfade zeigen auf `./overworld-v14/`, `icons-rpg/` ist
mitgewandert. **v14 ist kein Feature-Sprint, ein Prüf- und Reparaturlauf** — Plan:
`docs/overworld-v14/SPRINT_overworld-v14.md`, Reihenfolge **V1 → C3 (+ P2 daneben) → C4.**

| Artefakt | Rolle | Status |
|---|---|---|
| `KFB Overworld v14.dc.html` | Arbeitsstand | AKTIV |
| `overworld-v14/win-owner.js` | **neu** · Besitztabelle + Messblatt + Debug-Schalter | AKTIV |
| `overworld-v14/hud-v7.js` | EINE Fensterschale (`mkWin`) · v7s `renderAlmanac` gelöscht | geändert |
| `overworld-v14/card-rail-v9b.js` | baut seine drei Fenster über die Schale · kein `r9box`, kein eigenes Esc | geändert |
| `overworld-v14/roster-sheet.js` | dunkles PLAY-AS-Blatt entsteht nicht mehr (Tabelle), Tür bleibt | geändert |
| `docs/overworld-v14/V1_BEFUND.md` | Zahlen, Soll/Ist, Bildpaare, Nähte 142–145 | AKTIV |
| `docs/overworld-v14/captures/` | Bildpaare vorher/nachher am festen Standpunkt (924×540) | AKTIV |
| `KFB Overworld v13.dc.html` + `overworld-v13/` | Vergleichsmaßstab | SUPERSEDED, behalten |

**V1 in Zahlen** (gemessen im Shadow-Root, nicht im Quelltext gelesen): `.v7-win` 6 → 6, aber
**FREMD 6 → 0** · `r9box` (zweiter Kanten-Maler) **3 → 0** · Kanten-Maler-Verfahren **2 → 1** ·
zweites Aufgebot `.roster` **1 → 0** · Esc-Anmeldungen für Fenster **7 → 1** · Erzähler im Almanach
**2 → 1**. Überlauf im Messblatt **0**.

**Besitz (Daten, `OW_WINS.OWNER`):** character · settings → **v7**; almanac · quest · shop · roster →
**Rail**. Eine Schale (hud-v7 `mkWin`), ein Esc (`OW_WINS.esc()`), ein Erzähler je Fenster.
**Der Verlierer entsteht gar nicht** — v7s `renderAlmanac` und der MutationObserver des Rails sind
gelöscht, die drei handgeschriebenen `r9box`-Bäume ebenso, `roster-sheet.js` baut nicht mehr.
Rückweg ist je eine Zeile in der Tabelle. **Preis, benannt:** mit dem dunklen Blatt fällt seine
gemessene Mob-Übersicht (Körperhöhe · Hieb · Lauf) weg — Entscheidung Georg, ob sie als Papier
wiederkommt.

**Debug-Schalter (V1e): Umschalt+D** — Fensterrahmen, Erzeuger, Kollisionsrechtecke, Legende mit
Fenstergröße; `OW_WINS.audit()` zählt, `OW_WINS.messen()` misst, `OW_WINS.oeffne(id)` ist der
reproduzierbare Standpunkt für Bildpaare.

**Fluffbox (Georg 13.8.):** Avatar hing über **drei** Kanten (8 px über der Oberkante, 9 unter der
Unterkante, 12 von links auf der Tuschekante), dokumentiert ist **eine** (unten). Repariert mit zwei
Zahlen: `.r9stat .av` `left:16px;top:4px`. Kein Umbau des Statblatts (Naht 93 gilt).

**Nähte 142–145** (Volltext in `V1_BEFUND.md`): (142) zwei Erzeuger für einen Gegenstand sind teurer
als ein häßliches Layout — ein MutationObserver auf `on`, der fremden Inhalt ersetzt, ist der zweite
Erzeuger in Verkleidung. (143) wer nicht gebraucht wird, wird nicht gebaut; `display:none` hält beide
Wahrheiten am Leben. (144) eine Meldung ohne Fenstergröße ist keine Fehlermeldung — und der gemeldete
Ort ist nicht immer der defekte. (145) ein Kommentar im Template-Literal ist Code: Backticks darin
haben das ganze Rail lahmgelegt, der Warnhinweis stand im Dateikopf.

**Offen / als nächstes:** C3 (Ablage über dem Kopf, drei Coworker-Nachzüge) · P2 daneben
(Streifen-Bäcker, `footY` ist der Vertrag) · C4 zuletzt. Nicht WS0: die Bild-/Look-Entscheidungen.
Beim Kanon-Eigentümer WS1: gestrichelte Preset-Variante, Canvas ↔ SVG.

---

## 4z-C. Overworld v14 — C0 »Eingabe-Wahrheit« · C1 »nur X« · C2 Messung → **FROZEN 2026-08-14**

Abschluß des Prüflaufs. **v14 ist eingefroren**; weiter geht es als v15 (Fork).

| Artefakt | Rolle | Status |
|---|---|---|
| `KFB Overworld v14.dc.html` | eingefrorener Prüfstand | **FROZEN** (Check-in `export/overworld-v14_2026-08-13/`) |
| `export/overworld-v14_2026-08-13/KFB-Overworld-v14-standalone.html` | prüfbare Auslieferung, 846 kB, eine Datei | AKTIV · für GitHub |
| `overworld-v14/input-truth.js` | **neu** · Meßgerät Eingabe-Herkunft (Umschalt+I), ändert kein Verhalten | AKTIV (Werkzeug) |
| `overworld-v14/hud-v7.js` | C1 · Hintergrund-Schließer aus `mkWin()` entfernt | geändert |
| `overworld-v14/card-rail-v9b.js` | C2a · `const ACCT_ZEILE = false` deklariert (war benutzt, nie definiert) | geändert |
| `docs/overworld-v14/MESSUNG_v14_2026-08-14.md` | Chrome-Grundlinie + Firefox-Auftrag | AKTIV |
| `docs/overworld-v14/HANDOVER_v14_FREEZE.md` | Handover Coworker / frischer Chat | AKTIV |
| `docs/overworld-v14/MANIFEST_session_2026-08-14.md` | Session-Manifest (Export-Umfang) | AKTIV |
| `KFB Overworld v13.dc.html` + `overworld-v13/` | Vergleichsmaßstab | SUPERSEDED, behalten |

**C0 — der Befund war die Umgebung, nicht das Spiel.** Georgs »jeder Klick läuft nach rechts« ist im
Vorschau-Reiter reproduzierbar, im v13-Standalone **nicht**, und endet beim Klick in die Browserzeile.
Der Code schließt die Verdächtigen aus: `travelPoint` teleportiert und räumt Ziel/Pfad;
`overworld-game-v10.js:641` **leert `keys` bei jedem Linksklick** — eine hängende Taste ist damit
unmöglich. Zeile 640 darüber ist `window.focus()` (Kommentar: »Chat/Panel stiehlt ihn — danach kamen
keine keyups mehr an«) und benimmt sich im verschachtelten Rahmen falsch. **Kein Eingriff:** ein
WS1-Diff am Fokusverhalten für einen Fehler, der in keiner echten Umgebung auftritt, wäre teurer als
der Fehler. Statt dessen liegt das Gerät bereit — GESPENSTERTASTE (in `keys`, aber körperlich nicht
unten) und ERSTE URSACHE (eingefroren, mit Datei und Zeile) beweisen es in einem Blick, falls es je
wiederkommt.

**C1 — Fenster schließen nur über X** (Abnahme Georg). Der Hintergrund-Schließer in `mkWin()` ist weg.
Zweiter Befund im Kommentar hinterlassen: `e.target===w` traf im Shadow-DOM **auch bei Klicks ins
Fenster** zu (von außerhalb nennt `target` den Wirt) — deshalb fühlte es sich unbeabsichtigt an. Wer
es zurückwill, nimmt `e.composedPath()[0]===w`. Bewußt **nicht** angefaßt: `bubble-ts.js:570` und
`reveal-2d.js:137` — dort ist Wegklicken beabsichtigt, Entscheidung offen.

**C2 — Chrome-Grundlinie** (`bench-v1.0`, im Rahmen ohne Fokus, also **Untergrenze**, das Gerät
markiert sich selbst `vertrauenswuerdig: false`): Bild **16,7 ms Median (59,9 fps)**, p90 17,3, max
20,9, **kein Bild über 33 ms**. Zeichnen **1,0 ms = 6 % des Bildes** → der Engpaß liegt **nicht** im
Zeichnen. `stillTrotzBewegung 0/210`, Eingabe-Latenz 16,3 ms (1 Bild). Vier Verdächtige, browser-
unabhängig: **3 129 Schattenzeichnungen** je 210 Bilder (≈15/Bild) · **3 von 9 Reliefs verworfen** ·
**2 171 ms Netzsuche** beim Start (4 URLs je Material) · Animationsuhr `maxFps 14`, 40 % an der Kappe.

**Nichts optimiert — mit Absicht.** Georgs Beschwerde gilt **Firefox**, und Firefox ist nicht
gemessen. Anleitung dafür Schritt für Schritt in `MESSUNG_v14_2026-08-14.md` §4 (zwei JSON-Dateien,
selbe Standalone-Datei, eigener Reiter). Der Ausgang entscheidet den Patienten: steigt `draw` in
Firefox → Schattenschicht; bleibt `draw` niedrig und `frame` steigt → `step`/KI.

**Unbelegt, offen benannt:** `atkFrames 0` — das Gerät fährt den Helden, es kämpft nicht. »Performante
Fights« ist bis heute keine gemessene Aussage. Kampf-Lauf ist v15-Arbeit.

**Naht 146:** ein Fehler, der nur in der Vorschau auftritt, ist ein Befund über die Vorschau. Der
billige Weg ist ein Meßgerät, das ihn beim nächsten Mal in zehn Sekunden benennt — nicht ein Umbau am
fremden Runner auf Verdacht.

**C2a — und die Gegenrichtung derselben Naht.** Georg am fertigen Standalone:
`ReferenceError: ACCT_ZEILE is not defined`. `card-rail-v9b.js:2134` prüfte den Schalter, Zeile 993
erwähnte ihn im Kommentar, **deklariert war er nie** — und mit der Ausnahme brach der komplette
Rail-Einbau ab. Die Chat-Vorschau hat sie still verschluckt. Behoben mit `const ACCT_ZEILE = false`
(POP-account-Zeile bleibt weg, §4j); gegengeprüft im geladenen Export: `.r9stat` da, `.v7-win` 6,
`.acct` 0, 32 Mobs.

**Naht 147:** der Standalone-Export ist die **strengere** Prüfung, nicht die bequemere Kopie — er
läuft ohne die Fehlertoleranz der Vorschau. Ein Stand ist erst dann prüfbar, wenn er einmal als
Export geöffnet und seine Konsole gelesen wurde. Zusammen mit Naht 146: **in welcher Umgebung ein
Befund auftritt, ist selbst ein Befund** — einmal über die Vorschau, einmal über den Export.

**v15 (Fork aus v14), Reihenfolge:** 1 Leistung nach Firefox-Befund + Kampf-Lauf für `bench.js` ·
2 Lebendigkeit zwischen den Karten-Zonen (Mob-Zonen, Patrouillenpfade, Einzel-Mobs mit Zweck:
Ressourcen suchen) — **vorher** messen, wo die Mob-Kurve kippt · 3 Zufalls-Test aller Mob-Einheiten ·
4 die Reste aus §4z: C3, P2, C4, und ob die Mob-Übersicht des gelöschten dunklen Blattes als Papier
zurückkommt.

**Clean-Run v14 (FROZEN-Stand):** Standalone im eigenen Reiter öffnen → **Konsole lesen, sie muß
leer sein** (Naht 147) → 30 s laufen → Fenster über **X** schließen (Klick daneben darf **nichts**
tun) → **Umschalt+D** zeigt Besitz/Rahmen → **Umschalt+I** zeigt die Eingabe-Tafel,
`GESPENSTERTASTE` muß leer bleiben → `OW_BENCH.run()` gegen die Zahlen aus
`MESSUNG_v14_2026-08-14.md` §1.

---

## 4z-D. v15 vorbereitet (2026-08-14) — Planung liegt, Sprint startet im neuen Chat

Kein Code, nur Vorbereitung. Drei Blätter, damit ein frischer Chat ohne Rückfragen anfängt:

| Datei | Rolle |
|---|---|
| `docs/overworld-v15/ONBOARDING_v15_neuer-chat.md` | Lage, Lesereihenfolge, Startzustand, P1–P4, **6 offene Entscheidungen**, Rollen, Werkzeuge |
| `docs/overworld-v15/SPRINT_v15_PLAN.md` | Abnahme (5 Kriterien), Pakete **M1–M10** mit Besitz und Vorbedingung, Architekturentscheidung, Diff-Kandidaten für WS1, Risiken |
| `docs/overworld-v15/FADEN.md` | **Wiedereinstieg** — wer den Faden verliert, liest nur diese Datei |

**Sprintziel v15:** Lebendigkeit zwischen den Kartenzonen (Mob-Zonen, Patrouillenpfade, Zweck-Mobs an
Ressourcen-Props, Mob-Parade als Abnahme) — **und die Leistung trägt es.**

**M1 ist der Flaschenhals und liegt bei Georg:** `OW_BENCH.run()` in Firefox **und** Chrome auf der
v14-Standalone. Ohne diese zwei Dateien ist jede Optimierung geraten — Chrome zeigt 60 fps und
Zeichnen bei 6 % des Bildes, dort ist nichts zu holen. Parallel und unblockiert: **M2** Kampf-Lauf
(`atkFrames 0` — »performante Fights« ist unbelegt), **M5** Verschwendung (3/9 Relief-Verwürfe,
2 171 ms Startsuche), **M9** Mob-Parade.

**Architekturentscheidung, vorne getroffen:** Mob-Zonen berühren Weltgenerierung = WS1-Gebiet. Weg
**(a) Schicht darüber** (WS0, sofort startbar) vor **(b) Diff an WS1**. Begründung: eine laufende
Schicht, die Georg sehen kann, ist ein besserer Diff-Antrag als eine Beschreibung — und scheitert (a)
an einer Grenze, **ist genau diese Grenze der Inhalt des Diffs.**

**Vorbedingung, die P3 an P1 bindet:** gemessen ist bei **32 Mobs**. Mob-Zonen heben die Zahl — erst
die Kurve (32/64/128), dann Zonen setzen. Sonst wird die Lebendigkeit zum Ruckelgrund und niemand
weiß, ob Schattenschicht oder Menge schuld ist.

**Sechs offene Entscheidungen** gehen als **ein** Formular an Georg. Vorneweg die **zwei
Beleuchtungen** (UI-Feder rechts/unten ↔ Terrain-Schatten oben/unten, ungemessen): sie muß fallen,
**bevor** eine weitere Bodenschicht darauf aufbaut — danach ist es ein Umbau statt einer Einstellung.
Außerdem offen: »nur X« auch für Sprechblase/Aufdeck-Overlay · Mob-Dichte · Mob-Parade als Werkzeug
oder Spielinhalt · darf eine Patrouille eine Kartenzone betreten · Klang (**es gibt keine Audiodateien
im Repo**).

**Nicht in v15:** Travel-v16-Props in der Welt · Rail/Statblatt auf Kanon-Kürzel · Klang · `cardGrid`
für die zwei fehlenden Decks · C3/C4/Streifen-Bäcker (nur wenn Zeit bleibt).

**Naht 148:** ein Sprint ohne Abnahmekriterien wird nachträglich schöngeredet. Die fünf für v15 stehen
im Plan §2 und sind prüfbar, nicht schätzbar.

---

## 4z-F. v15 gestartet (2026-08-16) — Fork, Entscheidungen, zwei Meßgeräte

**Fork ohne Umbau.** `KFB Overworld v15.dc.html` + `overworld-v15/` (72 Dateien). 52 Skriptpfade
umgehängt, sonst keine Zeile angefasst. Runner unverändert (WS1). v14 bleibt Vergleichsmaßstab.

**Sechs Entscheidungen beantwortet** → `docs/overworld-v15/ENTSCHEIDUNGEN_v15.md`:
E1 Terrain-Beleuchtung gewinnt · E2 Startdichte 6 Mobs je Zone (Regler kommt) · E3 Patrouille **darf**
Kartenzonen betreten (gegen meine Empfehlung, notiert) · E4 **Mob-Kurve vor Kampf-Lauf** · E5 ohne
M1 wird eingefroren, »ungemessen« dranschreiben · E6 »nur X« nur fürs Aufdeck-Overlay ·
E8 Mob-Parade **im Spiel**. Offen: E7 Klang.

**Zwei neue Meßgeräte, beide ohne Runner-Eingriff:**
- `mob-curve.js` (**Umschalt+M**) — vervielfacht vorhandene Kreaturen auf 32/64/128, fährt je Stufe
  `OW_BENCH.run()`, räumt danach zurück. Nennt den Kipppunkt als Satz, nicht als Tabelle.
- `mob-parade.js` (**Umschalt+P**) — 21 Einheiten einzeln: Idle · Lauf · Angriff · Tod, auf echtem
  Boden. Meldet fehlende Blätter (`attack` fehlt → Rempler) statt sie zu ersetzen.

### Naht 149 · »Ich sehe es nicht« ist kein Befund

Zwei Falschmeldungen an einem Tag, **dieselbe Fehlerklasse**, beide korrigiert:

1. **»Keine Audiodateien im Repo«** (stand in drei v15-Blättern). Falsch: sie liegen im **Asset-Repo**
   (`media/3D_Assets/Audio/…`), `audio-2d.js` holt sie über CDN + GitHub-API. Beleg im Ladeprotokoll:
   `[audio] sfx 26 · announcer 12/12 · rounds 5 · count 10`. Eine Dateiliste des *Projekts* zeigt sie nie.
   **Offener Rest, echt gemessen:** zwei Dateien scheitern beim Dekodieren —
   `kenney_interface-sounds/drop_002.ogg` und `kenney_casino-audio/card-place-1.ogg`
   (»unknown content type«). Das ist der wahre Klang-Befund, nicht »es gibt nichts«.
2. **»Tod-Blatt fehlt«** — erste Fassung der Parade meldete das bei *jeder* Einheit. Falsch: es gibt
   **kein** Sterbe-Sprite je Einheit, sondern EIN gemeinsames Leichen-Blatt (`Dead.png`, `deadSheet`)
   plus das Herauskommen aus der Asche (`rise`, ein wanderndes Beschneiden, kein Sprite).
   Die Tafel sagt das jetzt hin, statt einen Mangel zu behaupten.

**Die Regel:** Ein Fehlen wird erst zum Befund, wenn der **Ladeweg** geprüft ist, den der Code
tatsächlich geht — nicht der Ordner, in dem ich gerade stehe. Verwandt mit Naht 146 (in welcher
Umgebung ein Befund auftritt, ist selbst ein Befund).

### Naht 150 · Ein zweiter Schreiber ist kein Timing-Problem

Georg, 16.8., zur ersten Parade: *»das flackert alles sehr stark und ruckelt, die mobs werden unsauber
hin- und hergeswapped«* — und: *»die mobs werden durch eine art vorhang eingeblendet«.*

**Ursache 1 (Flackern):** `mob-ai.js` schreibt in **jedem Bild** `state`, `anim` und Position jedes
Mobs (`step` → `think` → `present`), *vor* dem Zeichnen. Die Parade schrieb dieselben Felder danach.
Gezeichnet wurde abwechselnd die Absicht der KI (»steht« — sie mißt die selbst geschobene Strecke
nicht) und die der Bühne (»läuft«). **Zwei Schreiber auf einem Feld sehen aus wie ein Ruckeln, sind
aber ein Eigentumsproblem.** Kein Timing, keine Verzögerung, kein `requestAnimationFrame`-Trick
behebt das.
**Lösung:** Die Bühne hält das Denken an — an der Stelle, die dafür gebaut ist. Der Runner schlägt
sein Gehirn über `window.OW_AI` nach (`OWA` ist ein **Getter**, v10-S19d). Die Parade hängt dort ein
Modul davor, das per `Object.create` alles erbt und nur `step()` durch einen Leerlauf ersetzt; beim
Beenden kommt das echte zurück. **Nicht** `g.OWA=null`: das Feld hat keinen Setter, und
`this.OWA.step(this,dt)` (Zeile 4312) ist ungeschützt — das wäre ein Absturz je Bild.
Nebenwirkung, hier eine Eigenschaft: die übrige Welt steht still, während die Bühne läuft.

**Ursache 2 (Vorhang):** Das war das Auferstehen aus der Asche (`rise`) — ein **wanderndes
Beschneiden**, gebaut in v10-S2d, *weil es in keinem der 20 Blätter ein Auftauch-Sprite gibt*.
Nachgesehen im Katalog: ein eigenes **Sterbe-Blatt** hat genau eine Einheit (`root_troll`), alle
anderen sterben über das gemeinsame `Dead.png`; **Spawn-, Dissolve- und Vanish-Blätter existieren im
Repo nicht** (nur `Hex Shaman_Explosion.png` als Zauber einer einzigen Einheit). Die Bühne zeigt
jetzt, was das Spiel wirklich tut — umfallen, Leiche liegt, harter Schnitt — und die Tafel schreibt
hin, was fehlt, statt es zu ersetzen. Wer Spawn-/Vanish-Effekte will, braucht **neue Assets**; das
ist eine Beschaffung, keine Programmierarbeit.

### Naht 151 · Wenn das Blatt fehlt, macht es die Bewegung

Georg, 16.8.: *»nur auftauchen und die/skull muss noch sauber animiert werden wie RPG games«* und
*»die angriff von pig (ohne attack animation) sollte zumindest ein cartoonigs stretch & squash in
richtung des ziels zeigen«.* Beides ohne ein einziges neues Sprite gelöst — `cartoon-motion-2d.js`
ist auf **motion-v1.1**:

- **Zwei-Takt-Hieb** (`anticip` → 0,12 s → `lunge`) für Einheiten **ohne** Angriffsblatt. Das Modul
  erkennt den Wechsel nach `state==='attack'` bei `unit.bump` **selbst** und schlägt in Richtung
  Held zu — kein Runner-Eingriff, und es wirkt auch im normalen Spiel, nicht nur auf der Bühne.
  Vorher gab es dort nur Schub nach vorn (v11-U1): das liest sich als »rutscht«, nicht als »schlägt«.
- **Auftritt und Abgang** als eigener Kanal (`enter`/`exit`). Begründung, warum kein Poke: ein
  Auftritt skaliert von 0 auf 1 — 100 %, die Poke-Grenze liegt bei 9 % (§17.3). Ein Auftritt ist
  keine Erschütterung, sondern eine Aufführung mit Anfang und Ende; eigene Uhr, eigenes Ende,
  abschaltbar und meßbar (`OW_MOTION.probe(u).auftritt`).

**Und der Haken, der daraus folgt (Diff-Kandidat 5 an WS1):** im normalen Spiel läuft der Abgang
**nie**. `overworld-game-v10.js:4972` nimmt nur Mobs mit `hp>0` in die Zeichenliste — wer stirbt,
ist im selben Bild weg. Die Parade kann es zeigen, weil sie `hp` erst am Ende der Bewegung auf 0
setzt. Der Antrag ist damit **vorführbar statt beschrieben** — genau die Reihenfolge aus Plan §4.

**Nebenbefund für M5:**Das Ladeprotokoll zeigt **7 von 9 Reliefs gebaut**, 2 verworfen — und beide
Verwürfe sind *begründet* (`clay_floor_001`, `Paper004`: Korn unter der Schwelle 8, ein graues Relief
macht flacher statt plastischer). Die Planzeile »3 von 9 Verwürfen = ein Drittel der Arbeit im Müll«
ist damit zu scharf: verschwendet ist nicht die Entscheidung, sondern das **Herunterladen und Messen
von vier Karten je Material, bevor entschieden wird**. M5 zielt auf den Ladeweg, nicht auf die Schwelle.

---

## 4z-E. Onboarding-Paket »Tiny Swords — neues Projekt« (2026-08-14)

Auf Georgs Auftrag: alles, was ein **komplett neues** Claude-Design-Projekt mit den drei
Tiny-Swords-Packs braucht. Liegt in `export/onboarding-tinyswords_2026-08-14/`, **~0,3 MB**.

Neun Doku-Blätter (`00`–`08`): Start Here · Assets/URLs · UI-Baukasten · **Ink-Kanon v2 inkl. §10** ·
**EMBED CardBuilder+Ink (aktuelle Fassung)** · Karten-Repo · **28 Fallen mit Beleg** · DC-Bauweise ·
Kickoff-Prompt (kurz + lang). Code: `kfb-ink-canon` · `kfb-card-builder` · `kfb-card-format` ·
`ui-kit-ts` · `asset-source`. Daten: `kfb-index.json`, drei Deck-JSONs als Schema-Muster,
`ui-slices.json`, `PDF_ADRESSEN.md`. Anhang: die vier Originaldokumente mit Messdatum.

**Bewußt NICHT im Paket:** die Deck-PDFs und die Tiny-Swords-Bilder — nur Adressen. Begründung im
Manifest: eine Kopie in einem Onboarding-Paket wird binnen Wochen zur **zweiten Wahrheit**, und genau
diese Falle ist im Repo mit zwei Registry-Dateien (`index.json` älter als `kfb-index.json`, Sonic
widersprüchlich) schon aktiv.

**Offener Rand, der mitgeht:** die Grenze »kein KFB-Ink auf Tiny-Swords-Kunst« steht als Kanon in `06`
und `08`, stammt aber aus dem WS0-Briefing (K5). Wer sie im neuen Projekt anders will, ändert sie
dort, **bevor** jemand darauf aufbaut.

---

## 4z-T. Travel v17 – v23 (Fork-Reihe) + **Export v20** (2026-08-26)

Die Reihe hinter v16 stand bisher nicht in dieser Liste — hier ist sie, mit dem Stand, den ich
belegen kann. Wer mehr Status braucht, liest den Fork-Stempel im Kopf von `terrain-vNN/travel-poc.js`;
der ist die Wahrheit, nicht diese Tabelle.

| Artefakt | Rolle | Status |
|---|---|---|
| `KFB Travel v17.dc.html` + `terrain-v17/` | Fahrgefühl-Sprint (F3/F4/F6). Fork-Basis für v20 | FROZEN |
| `KFB Travel v18.dc.html` + `terrain-v18/` | Rückfall bis zur Telefonabnahme (§4.5 dort) | FROZEN |
| `KFB Travel v19.dc.html` + `terrain-v19/` | K12 Erosions-fbm + K13 Farbmunition (Terrainkern getauscht) | SUPERSEDED durch v20-Reihe |
| `KFB Travel v20.dc.html` + `terrain-v20/` | **Karten-Gelände** (K1 Collage). Fork aus v17 | **EXPORTIERT 26.8., FROZEN** |
| `KFB Travel v21/v22.dc.html` + `terrain-v21/22/` | spätere Forks der Reihe | im Projekt, **nicht** im Export |
| `KFB Travel v23a/b/c` + `terrain-v23/` | Kantenvarianten (Schnittkante · Feiner Riss · Riss mit Kern) | im Projekt, Entscheidung offen (`docs/OFFENE-FRAGEN-Kartenlandschaft-v23.md`) |
| `cardbuilder/` (3 Module) | **GETEILT** — Travel, SpinBallPop und die Kartenschau importieren `kfb-card-format.js` | AKTIV, nicht als tot einstufen |
| `themes/kfb-shell.css` · `kfb-med.css` | **GETEILT** — DC und `index.html` binden dieselbe Bühne | AKTIV |
| `asset-repo.json` (328 kB) | **GETEILT** — Prop-Index, 986 Assets mit RAW-URL | AKTIV, ASSET |
| `export/travel-v20_2026-08-26/` | Re-Home-Paket: Code, Standalone, Doku, Selbsttest | **AKTIV** |

### Neu am 26.8.: es gibt ein Standalone

Seit v15 stand in jedem Kopf „es gibt kein Standalone-HTML" — Grund war Naht 101 (der Bundler des
Design-Werkzeugs verliert je Einstiegs-Modul die erste relative Abhängigkeit, sieben Umgehungen
gemessen). **Der Satz ist ab sofort falsch, die Naht bleibt es nicht.** Das Bündel benutzt den
Bundler nicht: jedes Modul wird eine Blob-URL, jeder relative Spezifizierer ein bare specifier
(`@kfb/…`) in einer zur Laufzeit eingehängten importmap. Ein bare specifier hat keine Basis, an der
sich etwas verlieren könnte — Zyklen und der dynamische `import('./kfb-pets.js')` inklusive.
55 Module, 1,42 MB, **0 Boot-Fehler** gemessen. Verfahren und Grenzen:
`export/travel-v20_2026-08-26/docs/STANDALONE_bauanleitung.md`, Neubau mit
`tools/build-standalone.mjs`.

### Aufräum-Kandidaten (NICHT ausgeführt, Freigabe offen)

- `export/travel-v16/` — vom v20-Paket abgelöst, gleiche Struktur. **Empfehlung: löschen**,
  sobald v20 abgenommen ist.
- `terrain-v13/` … `terrain-v19/` (7 Ordner, je ~50 Module) — FROZEN-Vergleichsmaßstäbe.
  **Empfehlung: behalten**, sie sind der einzige Weg, eine Regression zu belegen.
- `terrain-v21/` + `terrain-v22/` — falls v23 die Reihe entschieden hat, sind sie tot.
  **Empfehlung: erst nach der v23-Entscheidung anfassen.**
- `bildschirmfoto-2026-08-23-um-11-56-26-mt5mu8kb-qv6q.png` (Projektwurzel) — verarbeitetes
  Feedback-Bild. **Empfehlung: löschen.**
- `uploads/` — 11 Briefings + zwei schwere Ordner. **Entscheidung weiter offen** (§5).

---

## 4z-P. Travel Planets v1 — der Planet (Fork 2026-08-26 aus v20)

Fork von `KFB Travel v20.dc.html` → `KFB Travel Planets v1.dc.html` + `terrain-planets-v1/`
(60 Module). v20 bleibt Rückfall. Auftrag: das Gelände umschaltbar durch das Höhenfeld aus v19
ersetzen. Sprintblatt mit allen Zahlen: `docs/planets-v1/SPRINT_planets-v1.md`.

| Artefakt | Rolle | Status |
|---|---|---|
| `KFB Travel Planets v1.dc.html` + `terrain-planets-v1/` | Karten-Gelände **und** Planet, im Panel umschaltbar | **AKTIV** |
| `terrain-planets-v1/planet-terrain.js` | v19-Raymarcher als Fullscreen-Pass in Threes Kontext (neu) | AKTIV |
| `terrain-v19/flight-v19.js` | Quelle des Höhenfelds — gelesen, portiert, nicht importiert | FROZEN, Referenz |
| `KFB Travel v20.dc.html` + `terrain-v20/` | Rückfall und Vergleichsmaßstab | FROZEN |

### Naht 152 · `depthTest: false` schreibt keine Tiefe

Ein Fullscreen-Pass mit `depthWrite: true`, aber ausgeschaltetem Tiefentest schreibt **nichts** in
den Tiefenpuffer — GL schreibt Tiefe nur bei aktivem Test. Der Pass war deshalb in der Szene
unsichtbar (der Himmel übermalte ihn), isoliert aber sichtbar. Lösung: Test an, `AlwaysDepth`.
Merksatz für jeden weiteren Pass dieser Bauart.

### Werkzeug-Befund (kein Projektfehler)

Im Vorschaufenster hält die rAF-Schleife nach exakt 103 Frames an, sobald das Fenster inaktiv ist.
Wer dort „es bewegt sich nichts" misst, misst den Browser. **Bildraten gehören auf echtes Gerät.**

---

## 4z-G. Travel Globe v1 — Kugelwelt (2026-08-27)

Fork der Denkweise, nicht des Codes: die Welt ist eine **geschlossene Kugel** statt eines
Höhenfelds. Vorbild und Quelle `dannylimanseta/tinyskies` (Branch
`cursor/globefly-multiplayer-globe-flight-game`), gelesen und nach JS übertragen — nicht importiert,
weil TypeScript hier ohne Bundler nicht läuft. Übergabe: `export/globe-v1_2026-08-27/docs/
HANDOVER_globe-v1.md`. Rundenchronik mit jedem Befund und jeder Messung: `github.md`.

**Warum überhaupt:** an der Raymarch-Fassung (`terrain-planets-v1`) sind in einer Nacht acht Nähte
geschlossen worden, und jede Reparatur hat den Kompromiss nur verschoben. Ein raymarchtes Höhenfeld
hat keine Oberfläche, sondern ein Abtastverfahren — und **keine Geometrie, an die man Karten hängen
kann.** Genau das, worum es im Projekt geht, konnte die Technik am schlechtesten.

| Artefakt | Rolle | Status |
|---|---|---|
| `KFB Travel Globe v1.dc.html` + `globe-v1/` (15 Module, 121,5 kB) | Kugelwelt, Pet auf Karte, stufenloser Abstand bis POV | **AKTIV** |
| `export/globe-v1_2026-08-27/` | Export: Code, Standalone (205 kB), Handover | **AKTIV** |
| `globe-v1/carpet-mesh.js` | 1:1-Portierung von `CarpetMesh.ts`; seit dem v17-Kartenrig **nicht mehr importiert** | SUPERSEDED — **nicht löschen**, das ist der Rückweg |
| `terrain-planets-v1/card-carrier.js` | **GETEILT** — v17-Kartenrig. Clip-Versatz skaliert jetzt mit der Weltskalierung (bei Skalierung 1 unverändert, also für Travel neutral) | AKTIV, GETEILT |
| `terrain-planets-v1/card-registry.js` | **GETEILT** — Kartendecks. Nur Kommentar-Warnung zum `document.hidden`-Guard ergänzt | AKTIV, GETEILT |
| `terrain-planets-v1/kfb-pets.js` · `cardbuilder/` · `themes/` | **GETEILT**, unverändert | AKTIV, GETEILT |
| `KFB Travel Planets v1.dc.html` + `terrain-planets-v1/` | Raymarch-Fassung, Karten-Gelände | FROZEN, Vergleichsmaßstab |

---

## 4z-H. Travel Globe v2 — Klang, Avatar, Bedienung (2026-08-28)

v2 ist v1 plus Ton, plus der v17-Avatar mit seinem Verhalten, plus ein Bedienfeld hinter einem
Zahnrad. **v1 bleibt unangetastet** (eigener Ordner, eigene DC-Datei) — der Rückweg ist eine Datei,
kein Rebuild. Führendes Planungsdokument ist ab jetzt `docs/LIVING_KFB-Travel-Globe.md`; die
Rundenchronik mit jeder Messung steht in `github.md`.

| Artefakt | Rolle | Status |
|---|---|---|
| `KFB Travel Globe v2.dc.html` + `globe-v2/` (27 Dateien) | Kugelwelt mit Klang, Pet-Avatar, Panel | **AKTIV** |
| `export/globe-v2_2026-08-28/` | Session-Export: Code, Standalone (405 kB), Docs, Abnahme-Capture | **AKTIV** |
| `globe-v2/pet-kinetics.js` · `pet-facing.js` · `pet-lighting.js` | 1:1 aus `terrain-v17/` kopiert — Kinetik, Facing, Beleuchtung | AKTIV (Kopie, Quelle bleibt v17) |
| `globe-v2/gear-icon.js` | 3D-Zahnrad, lädt `media/3D_Assets/GEAR_ICON.glb`, gebauter Kranz als Rückweg | **AKTIV** |
| `globe-v2/settings-panel.js` | Bedienfeld. v17-`settings-overlay.js` bewusst NICHT portiert (Anti-Pattern-Ansage Georgs) | **AKTIV** |
| `globe-v2/travel-audio.js` | 1:1 aus v17, **eine** additive Änderung: `LOCAL()` fängt jetzt die `blob:`-Basis | AKTIV (Kopie mit Fang) |
| `globe-v2/carpet-mesh.js` | tinyskies-Teppich, seit dem Kartenrig nicht importiert | SUPERSEDED — **nicht löschen**, Rückweg |
| `KFB Travel Globe v1.dc.html` + `globe-v1/` | Vorgänger ohne Ton | **FROZEN** (bleibt lauffähig, keine Weiterentwicklung) |
| `docs/LIVING_KFB-Travel-Globe.md` | Stand, Kanon-Zahlen, Restlisten v17 + tinyskies, Sprints S1–S5 | **AKTIV**, führend |
| `docs/BACKLOG_globe.md` | Gimmicks mit Preis (Zahnrad-Tacho) | **AKTIV** |
| `media/3D_Assets/GEAR_ICON.glb` · `pet-surface.v1.js` · Pet-GLBs · Decks · Töne | über RAW/CDN geladen, nie eingebettet | ASSET |

### Die Nähte dieser Session

- **Naht · Ein Backtick beendet ein Template-Literal.** Ein Kommentar mit Code-Anführungen im
  CSS-String von `settings-panel.js` hat das Modul getötet — und weil `globe-poc.js` es importiert,
  den ganzen Runner: kein Canvas, kein Zahnrad, hellblaue Bühne. **Ein Zeichen, die ganze Seite.**
- **Naht · Ein Panel-Name darf kein Systemname sein.** `.kfb-btn` gehört `themes/kfb-med.css`, und
  dessen `<link>` mountet mit dem Helmet am STREAM-ENDE — also nach jedem zur Laufzeit injizierten
  `<style>`. Der Track-Knopf wurde rot, in der Farbe, die im Panel „aktiv" bedeutet. Alle
  Panel-Klassen stehen jetzt unter `.kfb-set`.
- **Naht · Ich habe den Pet-Look selbst zerstört.** `MeshPhongMaterial({ flatShading: true })` im
  Runner erzeugte die Facetten und warf die GLB-Colormap weg. Kenneys Cube-Pets bringen RUNDE
  Normalen mit; im Pet Studio ist das der Schalter `face.facet`, und `pet-library.v6.js` facettiert
  nur auf Contract-Wunsch. **Wer Material ersetzt, ersetzt auch Absichten.**
- **Naht · Zwei Kartenmaler.** Die gezeichnete Ersatzkarte überschrieb die kanonische Rückseite und
  brachte mit ihrem `strokeRect` eine zweite Kante plus Gutter mit. Fehlerklasse 1, zum n-ten Mal.
- **Naht · Eine Abwesenheit, die ein Werkzeug nicht sehen KANN, ist keine Abwesenheit.** Der
  Repo-Baum listet keine Binärdateien — ich habe `GEAR_ICON.glb` als „nicht im Repo" gemeldet,
  während es lädt. Gegenprobe ist immer der laufende Zustand, nicht die Suche.
- **Naht (Bündeln) · Eine relative Adresse gegen eine `blob:`-Basis wirft, und zwar SYNCHRON beim
  Bauen der Versuchsliste** — vor jedem `try`. Betraf `travel-audio.js` (`jukebox.json`, `sfx.json`).
  Dieselbe Naht wie am 12.8. bei `hud-v7.js` und `card-ink-2d.js`.

### Aufräum-Kandidaten (NICHT ausgeführt, Freigabe offen)

- `uploads/` — vier Feedback-Screenshots dieser Session, alle verarbeitet. **Empfehlung: löschen.**
- `export/KFB Travel Globe v2 - standalone.html` — Fehlversuch mit dem Bundler (525 kB, startet
  nicht: „Failed to resolve module specifier ./globe.js"). **Empfehlung: löschen**, der gültige
  Standalone liegt in `export/globe-v2_2026-08-28/`.
- `export/globe-v1_2026-08-27/` — v1 ist FROZEN, der Export bleibt der Rückweg. **Behalten.**
- `globe-v1/` und `globe-v2/` sind bewusst DOPPELT (Kopie statt geteiltem Ordner), damit v1 stabil
  bleibt. **Kein Aufräum-Kandidat**, sondern Absicht.

---

## 4z-G (Nachtrag). Die vier Nähte der v1-Session (27.8.), als Merksätze

- **Naht 156/13/15 · Absolute Konstanten gegen uniforme Gruppenskalierung.** Dreimal zugeschlagen:
  Weltmaßstab, Kartenbreite im Konstruktor, und der Clip-Versatz **in `sync` im Weltraum** — den
  heilt der Gruppen-Maßstab nicht. Bei jedem Rig-Transplant jede absolute Zahl im Frame-Pfad einzeln
  durchgehen.
- **Naht 166 · Ein unvollständiges Zustandsobjekt ist ein stiller NaN-Generator.** `carrier.sync`
  liest fünf Felder; fehlt eins, verschwinden Karte und Pet **ohne** Konsolenzeile.
- **Naht 165/159 · rAF tickt in verdeckten Seiten nicht.** Betrifft erstes Bild, jedes Warten auf ein
  Element, die HUD-Marke und pdf.js. Im Startpfad darf rAF nicht vorkommen.
- **Naht 180/… · Farben als HEX durch `THREE.Color`.** Ein handgeschriebenes Float-Tripel kommt im
  linearen Arbeitsraum ein Drittel zu hell heraus — das war das ausgebrannte Weiß.

### Aufräum-Kandidaten der v1-Session (NICHT ausgeführt, Freigabe offen)

- `uploads/` — sechs Feedback-Screenshots der v1-Session, alle verarbeitet. **Empfehlung: löschen.**
- `export/travel-v16/` — vom v20-Paket abgelöst. **Empfehlung: löschen**, sobald v20 abgenommen ist.
- `terrain-v13/`…`terrain-v19/` — FROZEN-Vergleichsmaßstäbe. **Empfehlung: behalten.**

---

## 5. Uploads / Briefings

`uploads/` hält 11 Markdown-Briefings (PetFlight-Sprint, Dragonflight, Partikel-Fix, Steuerungs-
Nachrichten) und 5 JSON (Deck-Daten, Jukebox, `kfb-index.json`). Zu sichten: was in einen Sprint
gewandert ist, gehört nach `docs/`; der Rest ist löschbar. **Entscheidung offen.**

## 6. Regeln

- Assets IMMER per GitHub-RAW laden, nichts Schweres ins Projekt (Decks, PDFs, GLBs, Texturen).
- `zone-registry.json` / `zone-index.json` sind **fremder Contract** — hier nur lesen. Änderungen
  gehen über den Coworker-Export, nicht über eine lokale Korrektur.
- Session-Export nach `session-export`: Manifest → Veto-Fenster → nur Session-Dateien. Nie Voll-Zip.
- Wer eine Version einfriert, ein Experiment beendet oder Assets verschiebt, trägt es hier nach.


## v24 · KFB Travel Combat (04.09.2026)

- **Neu:** `KFB Travel Combat v24.dc.html` → `terrain-v24/` (Kopie von terrain-v20 + combat-host, sky-mobs, combat-shots, combat-hud, mech-avatar) · `modules/kfb-{hit-response,combat-cues,combat-travel-adapter,combat-def}.js`, `modules/kfb-combat-sfx.v2.json` (Kit 04.09., unverändert).
- **Docs:** `docs/travel-v24/CONTRACT.md` · `ENVIRONMENT.md` · `STATUS.json` (gemessene Böden).
- **v20 bleibt unangetastet** (Vergleichsmaßstab). v21–v23 sind Terrain-Karten-Testslices, nicht Basis.
- **Regel:** `?combat=0` = v20-Bild. Tab = Ziel-Cycle, ohne Gegner = Einstellungen.
