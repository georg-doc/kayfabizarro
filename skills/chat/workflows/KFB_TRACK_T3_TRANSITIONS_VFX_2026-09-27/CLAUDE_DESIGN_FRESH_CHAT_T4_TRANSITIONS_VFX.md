# Follow-up · frischer Claude-Design-Chat · T3 v2/K2 → T4 Übergänge + Clay-VFX

## Startnachricht

Du bist der visuelle Autor für **KFB Knet-Strecke T4**. Du hast keinen früheren Chat- oder Projektkontext. Rekonstruiere nichts aus Erinnerung und frage Georg nicht nach alten Uploads. Alles Nötige liegt in GitHub. Lies in dieser Reihenfolge:

1. `skills/chat/workflows/KFB_TRACK_T3_TRANSITIONS_VFX_2026-09-27/START_HERE.md`
2. `skills/chat/workflows/KFB_TRACK_T3_TRANSITIONS_VFX_2026-09-27/TRANSITION_GRAMMAR_T3_V1.md`
3. `skills/chat/workflows/KFB_TRACK_T3_TRANSITIONS_VFX_2026-09-27/VFX_CLAY_PARTICLE_GRAMMAR_V1.md`
4. `tools/KFB-ToolBox/_inbox/KFB Knet-Strecke T3 v2/KFB_CLAYMATION_K2_KNET_WERKZEUGE_2026-09-28/START_HERE.md`
5. dort `HANDOVER_WSA.md`, `docs/LIVING_CLAY.md`, `NEXT_CHAT.md`
6. danach nur die in START_HERE genannten aktiven v10/v4/v1-Module
7. H0/Hirnwelt nur für Welt-, Gebäude- und Proportionskontext; T1/T2 nur als Fehlerhistorie

GitHub-State schlägt Vermutung. Wenn eine genannte Quelle fehlt: `SOURCE_REQUIRED`, keine Ersatzästhetik.

## Ziel

Erweitere die akzeptierte **T3-v2/K2-Bühne** um einen zusammenhängenden Übergangsatlas und einen Clay-Partikelatlas. Arbeite auf `track-look.v4.js` + `clay-material.v10.js` + `clay-relief.v4.js` + `clay-toolmix.v1.js` und im WorldBuilder-/H0-Kontext. Kein freistehendes neues Trackdesign und kein neues Materialsystem.

Visuelle Richtung:

**bunt, lebendig, harmonisch-weird-bent Cartoon + Claymation**, auf Basis von Claybound, K1 und H0; als Stimmungsmischung aus Rocko, SpongeBob, Wallace & Gromit und Mario Kart — ohne Figuren, Logos oder konkrete Designs zu kopieren.

## T4 Pflichtszene

Eine kontinuierlich befahrbare Szene zeigt gleichzeitig:

1. **Track→City:** Knetstrang löst sich über Distanz in Bordstein, Gehweg, Stadtmöbel und ungleich hohe, leicht gebogene Häuser auf.
2. **Track→Nature:** Wulst wird Böschung/Graben; dahinter ein source-bewiesener KayKit- oder Tiny-Treats-Zaun plus Dreiergruppen aus Vegetation/Felsen.
3. **Rückkehr:** mindestens eine Richtung zurück auf den Track, die wegen Blick- und Beschleunigungsrichtung anders rhythmisiert ist.

Ein Wechsel darf nicht an einer Stelle stattfinden. Fahrbahn, Markierungen, Bande, Pit Lane, Bordstein, Gehweg und Naturband beginnen/enden in unterschiedlichen Fenstern aus dem gemeinsamen Vertrag.

## Gestaltungsregeln

- T3 v2 `track-look.v4.js` bleibt sichtbare Basis; neue Datei `track-look.v5.js` oder ein additiver `transition-atlas.v1.js`, kein Überschreiben.
- K2 ist bereits von Georg als Basis akzeptiert. Kein erneutes A/B/C für Material v8 gegen v10 und kein Rückfall auf v8.
- Verwende die vorhandenen K2-Klassenmischungen. Ändere eine Mischung nur mit vorher/nachher Pixelbeleg und additivem Profil.
- Die Fahrbahn behält zunächst ihr bewusstes Legacy-Straßenprofil. Eine neue Fahrbahn-Mischung ist ein separater, optionaler TUNE-Pass.
- Eine Primärszene, Welt-/Biom-Presets als Umschalter. Keine drei getrennten Architekturen und kein neuer Look-Wettbewerb.
- Großform zuerst, Props zuletzt.
- Bürgersteige und Bordsteine sind geformte Knetmassen/Steinreihen, keine flachen Texturstreifen.
- Gebäude verwenden WorldBuilder/H0-Proportionen, unterschiedliche Höhen und Fassadenrhythmus. Keine zufälligen Schuhkartons.
- KayKit/Kenney/Tiny Treats nur source-identisch isolieren, dann sichtbar begründet skalieren/deformieren/umfärben.
- Keine generischen UI-Panels im Blickfeld. Prüfoptionen hinter einem kleinen Info-/Werkzeugschalter.
- Kein Alpha-Fade als Übergangsersatz. Knetflecken, Segmente, Wülste, Fugen und räumliche Überlagerung bilden den Wechsel.
- Behalte die bewiesene Diagnose aus K2: kein Spachtel-Kreuzraster, Macro/Legacy nur gezielt, auslaufende Facetten statt dunkler Polygon-Scherben.

## Clay-VFX

Baue einen kleinen visuellen Atlas aus instanzierten Knetkügelchen, Krümeln und gequetschten Tropfen. Pflicht-Ereignisse:

- Rollen/Beschleunigen;
- Bremsen/Drift;
- Bande/Zaun streifen;
- Sprung/Landung;
- Boost;
- Biomwechsel.

Pflicht-Umgebungen:

- City/Asphalt;
- Wiese/Natur;
- Canyon/trocken;
- optional Küste/nass als Preset, ohne Wasserruntime zu erfinden.

Partikel übernehmen Palette und Materialrolle des Bodens, bleiben aber kontrastreich genug. Kein generischer Rauch- oder Glitzer-Emitter. Sie verwenden eine vereinfachte Clay-Materialfassung: keine sechs K2-Werkzeuge und keine dynamischen Schatten pro Partikel. Details stehen im VFX-Vertrag.

Biomwechsel werden aus demselben Seed-/Profilvertrag gespeist wie Trackrand, Props, Licht und VFX. Der Wechsel erfolgt gestaffelt; nicht alle Systeme wechseln an derselben Querlinie.

## Outputs

- `KFB Knet-Strecke T4.dc.html`
- `lab-track/track-look.v5.js` oder `lab-track/transition-atlas.v1.js`
- `lab-track/transition-profiles.v1.json`
- `lab-vfx/clay-particle-profiles.v1.json`
- `DESIGN_SPEC_T4.md`
- `SOURCE.json`, `RETURN.md`, additiver `CHANGELOG.md`
- Screenshots: Totale, Mitfahren, Fußhöhe, Pit-Abzweig, City-Naht, Nature-Naht, Graustufe, VFX je Pflicht-Ereignis

## Prüfung

- tatsächliche T3-Quelle im Bild und in `SOURCE.json` belegt;
- keine einzelne sichtbare Umschaltkante;
- Fahrbahn und Markierungen bleiben bei Tempo lesbar;
- keine bekannte T1/T2-AI-Slop-Form kehrt zurück;
- mindestens ein VFX-Profil zeigt niedrige und hohe Qualitätsstufe;
- Anzahl aktiver Partikel, Draw Calls, Geometrie und Ladezeit werden gemessen;
- Materialkosten werden getrennt gemessen: T3-v2/K2 ohne VFX, mit LOW-VFX und mit HIGH-VFX;
- Desktop und schmaler View zeigen die Szene, ohne dass Kontroll-UI den Fahrraum verdeckt.

## Stop

STOP nach T4-Atlas und vollständigem GitHub-Export. Keine Fahrphysik, keine Runtime-Integration, keine neue Route und keine Live-Promotion. Der nächste Work-Slice integriert den akzeptierten Output in den echten WorldBuilder/Racer.

Boxengasse, Track-Auf-/Abfahrten und Trackrand-Billboards sind bewusst nicht Teil von T4. Dafür liegt `CLAUDE_DESIGN_LATER_JOBS_PIT_RAMPS_BILLBOARDS.md` bereit.
