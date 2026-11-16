# WS0 · Gaussian-Splat-Piloten R0: 2D-Assets/Props, Slops, kleine Scenelets
Stand: 2026-11-16 · **Status: PRODUKTIONSBRIEFING / NO RUNTIME / PATCH DEFERRED**
**Owner:** WS0 (Asset-Auswahl, Bildtreue, visuelles QA und Asset-Intake). **Receiving:** bestehender KFB Asset Registry/Librarian für Identität; KFB-Stunt-Car-Race WS0/WS1-Integration für Runtime/Physik. **Modus:** BOUNDED_SLICE, drei Kandidatenklassen, sequenzieller gemeinsamer Technik-Pilot; KEIN zweiter Runtime-Owner.
**Baseline geprüft:** georg-doc/kayfabizarro main @ a9143605b1463df36c0e57d7092d5253d7e7b721; georg-doc/KFB-Stunt-Car-Race game/integration-r2 @ 648f932e52eadaa019e141ce8e34508bd372e5e5. Heads sind Momentaufnahmen und vor Ausführung neu zu lesen.

## 1. Ziel und Begrenzung

Aus **echten vorhandenen KFB-Quellassets** einen reproduzierbaren, isolierten Gaussian-Splat-Vergleich erstellen. Der Pilot soll sichtbar beantworten: Bringt ein Splat-Layer bei (A) einem 2D-Prop, (B) einem bestehenden Slop und (C) einem kleinen vorhandenen 3D-Scenelet einen Vorteil für Oberfläche/Deformation/Volumen bei tragbaren Kosten? Alle drei Kandidaten bleiben bis zur Prüfung **nur Varianten**, die bestehende KFB-Darstellung bleibt unverändert und ist jederzeit Fallback.

**Nicht in Scope:** PatchWorld, patch.gg, Remixes und Stylewahl (Georg: später); komplette Splat-Welt; neue Charakterfamilien; Neues Asset-Library-Backend; neuer Gameplay-Renderer/Actor-Store; Material-Look als Stilkanon; Live/Stage/Hub-Release; Multi-Repo-Live-Integration. Kein Prompt-to-3D-Resultat als Ersatz für ein geprüftes Quellobjekt ausgeben.

## 2. Verifizierte KFB-Anschlüsse

- Asset-SSOT: georg-doc/kayfabizarro, tools/asset_registry/README.md und Registry/Librarian. Auswahl immer mit originalem file path / blob / Lizenz oder privatem Intake-Record, nicht aus geratenem Thumbnail; generierte Registry-Ergebnisse sind keine neue Source of Truth.
- Bestehender Slop-Pfad: georg-doc/KFB-Stunt-Car-Race, src/data/mobs2d/inkblobs.r1.json (72 private Atlas-Actors als bestehender Donor), slop-loops.r1.json (Atlas + Loop), src/npc/mobs2d.js, src/look/kfbInsert.js, vorhandene Kollisions-/Hit-/Ink-FX. Bereits existierende sechs zusätzliche L0-Actors aus früherem WS0-Intake sind **noch nicht** als echte Dateibytes eingegliedert: für R0 zuerst einen wirklich vorhandenen 72er Actor, nicht ein vermeintlich verfügbares neues Bild verwenden.
- WS0 Original-/Alpha-Gate: media/2D_Assets/KFB_Custom/WS0_BLACK_INK_BLOB_SERIES/{README.md,LIBRARIAN_GAME_HANDOFF.md,RETURN.md}, Issue #466. Der R2-Fail-Recovery-Zustand gilt; keine neuen Ink-Monster auf Vorrat generieren.
- Scenelet-/Diorama-Pfad: src/world/dioramen/README.md, src/world/dioramen/index.js, src/world/szenen/README.md und docs/UEBERGABE_WS1_INTEGRATION_R2.md im Race-Branch. Bestehende Meshy-GLBs und LODs aus privatem Asset-Branch bleiben Asset-Owner; World-/Kamera-/Höhen-/Kollisionssysteme bleiben unverändert. src/world/szenen ist nach der WS1-Übergabe noch nicht als Naht freigeschaltet.
- Übergabe technisch: docs/MODULE.md (Daten/Module/Kern), WS1-Branch game/integration-r2. Keine Änderungen an M1World.jsx, M1Player.jsx, flags.js, Physik, Crowd-/Combat-Owner oder privaten Assets durch WS0-Studie.

## 3. Gemeinsamer Aufbau für alle drei Piloten

**Quelle zuerst isolieren:** Actual Originaldatei laden, SHA-256 der echten Datei festhalten, mit Quelle, Lizenz/Provenance, Typ und Maßstab identifizieren. Vor jedem Konverter getrennt Original als Foto/Viewport in 1:1/3:4 zeigen. Eine URL, ein geladenes Asset oder ein Dateiname allein belegen keine visuell korrekte Donor-Übernahme. Falls Quelldatei nicht verfügbar: Status SOURCE_MISSING, keinen Ersatz erfinden.

**Pipeline:** ORIGINAL → SOURCE QA → geometrische Trägerform (SDF aus Primärformen für organische Teile, vorhandenes GLB/Mesh für echtes 3D, 2D-Sprite nur als Ebene/2.5D) → Oberflächen-Sampling / orientierte Gaussian Splats → Splat-Material/Beleuchtung → Vergleichsviewer. **Original-Renderer/Collider/Gameplay bleiben Referenz.** Kompatibilität mit React Three Fiber / Three.js WebGL-Renderer vorher isoliert prüfen; nicht durch eine zweite Game-Engine oder ungebetenen Render-Owner ersetzen. Splats dürfen visuell sein; die originale Collision-Shape bleibt authoritative.

**Erste Quellen für einen technischen isolierten Vergleich, keine adoptierten KFB-Donoren:** 
- siliconjungle/shapeshift-labs-ink-studio (MIT; SDF/Bake/Animation/GLB-Import; headless; 16 Float32 je Splat laut Source README);
- cobanov/pixelart-gaussiansplat (MIT-Kern, Three.js/Spark, GLB-/glTF-Konverter auch mit Rig/Clips; Drittmodell-Lizenz gesondert);
- iamvillain/SyntaxSplat (SDF-Scene, Export, Testrenderer).
WS0/WSA muss tatsächliche Source und sichtbare Outputs **isoliert** prüfen, bevor eine Bibliothek eingebaut wird. Kein Automatismus, dass Pixel Art, Dithering, dunkle Outline oder Paper/Ink-Look gewählt werden. KFB-Art-Direction bleibt bei Georg.

**Vier Darstellungsvarianten pro Quelle, soweit technisch sinnvoll:** (O) unverändertes Original; (S) softes Splat-Look ohne Stilfilter; (C) sanftes clay-/volumenorientiertes Splat-Material ohne überlagerte Papier-/Tuschästhetik; (optional P) bewusst pixeliger Stil rein als Vergleich – nicht automatisch KFB-Vorgabe. Keinen vierten Kandidaten erzeugen, wenn Ausgangsgeometrie dafür fehlt.

**Beweis:** Pro Klasse 1 Quelle, 3 Kameraansichten (Front, 3/4, Rückseite; nur bei echten 3D-Assets; 2D-Billboard-Rückseite als fehlend markieren), volle Auflösung und 96px Thumbnail; Quelle und Splat in identischem Bildausschnitt/Kamera/Licht vergleichen. Notiere Splat-Anzahl, Format-/Texturgröße, Ladezeit, FPS und p50/p95/Maximum Frame-Time über identischen 60s-Kamerapfad sowie zusätzliche GPU-/CPU-Kosten gegen das Original auf derselben Maschine. Kein CPU-Test als GPU-Benchmark etikettieren. Fremddemos sind kein Leistungsbeweis.

## 4. Pilot A – 2D-Assets und Props

**Quelle:** WS0 wählt **ein reales, freigegebenes, nicht-personales 2D-Prop PNG mit echter Alpha**, nachvollziehbar aus Librarian oder bestehendem privaten Intake (z. B. Truhe, Schild, Relikt – nur wenn Datei real vorhanden). Nicht durch neue Bildgenerierung ersetzen. Nach Möglichkeit denselben Prop als vorhandenes GLB suchen; wenn keiner existiert, das als fehlende 3D-Wahrheit dokumentieren.

**Verfahren A1 (konservativ):** Alpha-Kontur des PNG in eine flache oder leicht geschichtete 2.5D-Fläche wandeln; Farbwerte und geschlossene Transparenz beibehalten; Splats tangential orientieren. Original bleibt im direkten Frontalvergleich maßgeblich. Tiefenlagen sind eine explizite künstlerische Interpretation, keine aus einer einzigen Ansicht rekonstruierte Wahrheit.

**Verfahren A2 (nur mit echter 3D-Quelle oder ausdrücklich als Entwurf):** Vorhandenes Mesh glTF/GLB oberflächen-samplen; falls keine Geometrie existiert, ein kompakter SDF-Blockout als *neuer Kandidat* und niemals als Originalreproduktion. Holes/Öffnungen, Kanten und Griffe müssen front/side/back plausibel sein.

**Output:** Original PNG + Alpha-Beleg, A1-Splat vorne, A1 Schrägansicht mit sichtbar dokumentierter 2.5D-Grenze, optional A2 mit echten drei 3D-Ansichten; gemeinsames side-by-side. Ein Prop/kein 6er-Pack vor Pilotbeleg.

**FAIL:** Fake-3D-Rückseite, verlorene Alpha-Löcher, ausgefranste Kanten, Splat-Farbdrift, verbesserter Look nur durch neu erfundenen Prop statt echten Donor.

## 5. Pilot B – bestehende Slops / Black Ink Blobs

**Quelle:** Ein *bereits im 72er privaten Atlas* aktiver, technisch abrufbarer Blob (idealerweise einfacher L0 ohne großes Accessoire). Quelle isoliert und inklusive der Gesichtsdetails anzeigen. Die 18 WS0-Sheets/108 Crops und die ausstehende neue sechs-er Gruppe sind nicht stillschweigend als importiert zu behandeln.

**Verfahren:** bestehende Sprite-/Atlas-Ansicht als visueller Golden. Ein einfacher kugelig-asymmetrischer SDF-Körper dient als potenzieller Volumenträger; Splats folgen Körperdeformation. Augen, Pupillen, Mund und Zähne werden **explizit separiert/geschützt** (Layer, eigene verankerte Flächen oder klarer Front-Projection-Fallback); sie dürfen sich weder im Körper auflösen noch gelocht/transparenziert werden. Vorhandene springende Squash/Stretch-, Splash- und Hit-Ereignisse sollen die Varianten antreiben; keine zweite AI, Damage-, Physics- oder Actor-State-Maschine bauen.

**Minisequenz:** 3 s Idle/Breathing → 2 vollständige Sprünge (Vorbereitung/Flug/Landung) → ein Treffer mit kurzem asymmetrischem Wobble → Splatter/Defeat; Kamera Front und 3/4. Vergleich gegen denselben Actor aus existierendem mobs2d-Renderer und ggfs. visuelle Deformation im Original. Ein kostenloser Frontalbeleg genügt nicht: Gesichts- und Silhouettenstabilität auch seitlich prüfen.

**Output:** ein originaler Atlas-Actor mit ID und verifiziertem Crop; 3D/Splat-Version; kurze deterministische Sequenz mit gleicher Input-Event-Reihe; Einzelbilder wichtiger Zustände, Delta-Frame-Messung; KEINE Änderung des bestehenden Slop-Rosters während des Pilotvergleichs.

**FAIL:** Augen/Zähne schweben oder verschwinden, identische generische Blob-Form trotz Original, fehlender Gesichtsausdruck, fehlende Deformationsreaktion, Game-Events müssten neu implementiert werden.

## 6. Pilot C – kleine 3D-Scenelets

**Quelle:** ein tatsächlich vorhandenes kleines Diorama-/Scenelet-GLB, bevorzugt aus dem bestehenden WS0-Diorama-Pfad (kein großes Amphitheater). WS0 nennt die **exakte bestehende Objekt-/LOD-Identität** nach Zugriff auf private Dateien. Ein gerenderter Screenshot einer 2D-Tür ist KEIN Nachweis von 3D-Geometrie.

**Verfahren:** Original GLB inklusive Material, korrekter Maßstab, echtes Unterseiten-/Hinterseitenbild isolieren. Splat-Oberflächen-Sampling auf vorhandener Geometrie; der bestehende Mesh-LOD- und Collider-Pfad bleibt unverändert. Falls zusätzliche SDF-Aushöhlungen (Höhle/Tunnel) später relevant werden, muss eine reale Durchgangsöffnung einschließlich Geometrie und Kollisionspfad bewiesen werden – die Splat-Bilder allein machen keinen begehbaren Raum.

**Minisequenz:** Orbit 360°, langsamer Vorbeigang, Nah/Fern-Vergleich, Tages- und Nachtdarstellung und ein Avatar-Durchgang nur falls das Original begehbar ist. LOD/Streaming in Isolation mit fester Szene messen; keine unautorisierte Naht zu szenen=r1 oder Änderungen am bestehenden diorama=r2 Streaming.

**Output:** Original-Mesh isoliert Front/Side/Back; Splat-Variante mit identischer Kamera; mindestens eine nahe und eine entfernte Ansicht; LOD-/Performance-Diff. Kollision nur über bisherige Mesh-/Rapier-Quelle, solange nicht gesondert geprüft.

**FAIL:** Splat-Löcher an Unterseiten, physische Öffnungen nur als dunkles Bild, Collisions differieren, Renderkosten im Nah/Fern-Wechsel dominieren, Ausgangs-GLB wird durch neue KI-Modellvariante ersetzt.

## 7. Testpaket / Entscheidungen / Stop-Regel

**Kleiner Gate-Prozess:**
G0: drei konkrete, echte Quellen gefunden, Herkunft und Artefakt verifiziert, jeweils 1 isoliertes Original. Falls nur 1–2 Quellen verfügbar, die vorhandenen testen; fehlende Klasse nicht mit Ersatz füllen.
G1: **ein gemeinsamer Viewer** mit getrennten Kamera-/Licht-/Materialparametern zeigt Source versus Splat; für 2D zunächst 2.5D, für Slop animiert, für Scenelet Mesh-Sampling. Externes Patch wird ausdrücklich nicht vorgezogen.
G2: Der Integration Tester prüft technische Integrität und messenbare Kosten. Independent Critic prüft blind identische Kamerawinkel auf Identität, Kanten, Gesichter, Silhouetten und Materialvorteil. Production Guard klassifiziert Abweichungen; nach zwei nicht verbessernden Reparaturen nur den kleinsten Problemfall einfrieren.
G3: WS0 liefert **pro Kandidat KEEP / ADAPT / DEFER** plus eine kleine Vergleichstafel; echte stilistische Entscheidung nur wenn sich ein sichtbar neuer/anderer Look ergibt. Keine neue Pflichtfreigabe für technische Tatsachen.

**Mindestnachweise:** drei Originalquellen mit Identität/Hash ODER sauber SOURCE_MISSING; Quelle vor Splat gezeigt; Front/3-4/Back nur bei 3D; 96px-Kontrolle; 3 Slop-Animationszustände und Wobble; Scenelet-LOD / Kollision; original-versus-splat p95 Frame-Kosten identisches Gerät; Repro-Seed/Parameter und Dateiformate.

**Budget-Vorschlag, nicht Messwert oder Kanon:** je ein low/medium/high Splat-Level (z. B. 2k/8k/20k für kleines Prop, 4k/12k/30k für Blob, 10k/30k/75k für Scenelet); früh abbrechen, wenn keine visuelle Verbesserung oder untragbarer Kostenanstieg. Ink-Studio-Datenformat 16 × Float32 ≈ 64 B pro Splat vor Render-Overhead: 20k ≈ 1.28 MB reine Werte – keine allgemeine Speicherbehauptung für andere Renderer.

**Repository-native Checks beim späteren integrierten Versuch:** tests für Registry-Quelle, slop-roster/atlas-IDs und Scenelet-Katalog; im Race-Worktree u. a. node scripts/ir2/listen-check.mjs, node test/unit/slopRoster.mjs, node test/unit/dioramenPlatz.mjs, node test/unit/szenenPlan.mjs, relevanter Split-Build und der vorhandene Browser-/GPU-Vergleich. **Heute nicht ausgeführt.** Keine bestehenden Dateien oder Flags ohne den Runtime-Owner ändern.

## 8. Übergabe, Produktion und Veröffentlichung

- **WS0/Asset Librarian:** source-backed Auswahl und Variantenkuration; 3 persönliche Quellobjekte isolieren, keine neuen PNG-Familien generieren.
- **WSA Builder (nur temporärer isolierter Viewer):** wählt nach Quellenprüfung kleinsten geeigneten vorhandenen Splat-Donor und baut Vergleichsoberfläche (kein Game-Renderer, keine KFB-Quelle überschreiben).
- **Integration Tester:** misst und hält Screenshots/Video, Source-/GPU-Beweis, prüft Asset-Verlust.
- **Independent Critic:** visuelle Identität unabhängig abnehmen, nicht selbst ändern.
- **Production Guard:** entscheidet CONTINUE / REPAIR / QUARANTINE / STOP; keine automatische Merge-/Promotion-Autorität.
- **WS1/aktueller Race-Integrator:** nur nach grünem isoliertem Kandidaten dessen Game-Seam minimal übernehmen; Actor-Kollision, Kamera, Streaming bleiben dort.
- **Georg:** im Moment **nichts**; Patch-Styles bleiben ausdrücklich später. Wenn die drei Vergleichsansichten einen echten visuellen Produktentscheid erlauben, erst dann wird eine konkrete A/B-Wahl gezeigt.

**Publikationsweg:** Diese Arbeit ist vorerst GitHub-/lokale Forschung, **keine Stage URL**. Wenn später ein menschlicher Web-Test erforderlich ist: nur direktes https://kayfabizarro.pages.dev/... und eine KFB-Hub-Verlinkung, exakt geöffnet und mit sichtbarer Revision; niemals GitHub Pages, Raw-CDN, githack oder file:// als Abnahme-Link. Kein Live ohne Georgs Gate.

## 9. Ein nächster produktiver Schritt

WS0 startet **G0: Quelle in Isolation** für je einen vorhandenen 2D-Prop, 72er Ink-Blob und kleines Meshy-Scenelet; dokumentiert deren tatsächliche Identität/Verfügbarkeit. Danach kann derselbe isolierte A/B-Viewer ohne zusätzliche Grundsatzplanung gebaut werden.

**Referenzen:** Race: docs/MODULE.md; docs/UEBERGABE_WS1_INTEGRATION_R2.md; src/world/dioramen/README.md; src/world/szenen/README.md; src/data/mobs2d/{inkblobs.r1.json,slop-loops.r1.json}. WS0: tools/asset_registry/README.md; media/2D_Assets/KFB_Custom/WS0_BLACK_INK_BLOB_SERIES/{README.md,RETURN.md,LIBRARIAN_GAME_HANDOFF.md}; Issue #466. Extern (nur Kandidaten): siliconjungle/shapeshift-labs-ink-studio; cobanov/pixelart-gaussiansplat; iamvillain/SyntaxSplat.
