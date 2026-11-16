# WS0 · Creature Animation Authoring R0 — Enemies, Tiere, Insekten und Splat-Anschluss
**Stand:** 16.11.2026 · **Status:** SOURCE-CHECKED RESEARCH / FOLGEBRIEFING, NOT BUILT / NO GAME INTEGRATION
**Zusammenhang:** eigenständiger **Authoring-/Quality-Gate-Workflow** als *optionaler Querverbraucher* der WS0-Splat-R0-Experimente, **keine** neue Runtime, kein neuer allgemeiner Charakter- oder Animation-Lab-Owner.
**Owner:** WS0 Visual/Motion Authoring in Abstimmung mit den bestehenden KFB ToolBox Motion-/Animation-Lab-Kandidaten; Asset-ID beim KFB Asset Registry/Librarian; aktueller In-Game-Mixer, Actor-/Combat-State-/Collider-/AI bleiben dem vorhandenen `KFB-Stunt-Car-Race`-Owner.
**Baseline gelesen:** `georg-doc/KFB-Stunt-Car-Race` `game/integration-r2` @ `648f932e52eadaa019e141ce8e34508bd372e5e5`; Hauptreview `georg-doc/kayfabizarro` PR #474. Vor produktiver Umsetzung Heads neu prüfen.
**Patch / weitere Stilvarianten:** nach Georgs Anweisung später; kein patch.gg-Job.
**Kein automatisches neues Monster-Design.** Original-KFB-Assets und deren Charakteridentität sind Primärquelle.

## 1. Externer Anstoß und Evidence-Grenze

Reddit, 15.11.2026, `https://www.reddit.com/r/TopologyAI/comments/1xx75ht/i_built_an_ai_animation_pipeline_for_my_indie_rpg/`: Entwickler von *After the Wind* beschreibt eine **eigene Godot/Blender-/Fable-5.2-Anima­tionspipeline** für zwei Wüstenmonster (Kröte und Fächervogel). Dokumentierte Schritte: Angriff zuerst entwerfen (Telegraph/Commit/Impact/Recovery), Tierbewegung per Videoreferenz untersuchen, Keyposes per Code in Blender backen, getrennte Iterationen für Gewicht/Attacke, Secondary Motion, Walk/Idle, Hit/Recovery, Review im Godot-Lab mit Orthogonalansichten/Onion Skin und automatische Fehlerprüfung (Treffgeschwindigkeit/Stop/Impact-Position). **Autorangaben** 10 Iterationen beim ersten, 4 beim zweiten Monster; keine unabhängige Leistungsbestätigung, kein veröffentlichter vollständiger Skill-/Code-Donor in diesem Post. Methodik-Donor, **kein** direkt importierbares KFB-Plugin und kein Godot-Runtime-Ersatz.
Optionale weitere Forschungsquelle: `https://github.com/Friedrich-M/UniMate` (veröffentlichtes Modell-/Code-Projekt mit rig-preprocess und Preview-Checkpoints für verschiedenartige Skelette; Gewichte, Performance, Lizenzgrenzen und tatsächliche KFB-Qualität gesondert prüfen). **Nicht** als bereits passender KFB-Rigger deklarieren.

## 2. Realer KFB-Bestand

- `georg-doc/kayfabizarro/skills/chat/tool-nodes/animation-lab.md` kennzeichnet Animation Lab derzeit als **UNVERIFIED**; es besitzt eine vorgesehene Clip-Inventar-/Playback-/Motion-QA-Funktion, keine gesicherte neue Produkt-SSOT. Bestehende Motion-Kalibrierung in `kfb-hub/stage/toolbox/kaykit-motion-lab-v1/README.md` ist auf humanoide Rig_Medium/Large ausgerichtet (87/87 lokale Browser-Checks in einem früheren Proof), **kein** Tier-/Insekten-PASS.
- Asset Registry `tools/asset_registry/README.md`: rigfacts zu tatsächlich vorhandenen GLB/glTF-Skins/Joints/Clips und handoff `consumer: animation-lab`, ohne Retarget-Kompatibilitätsgarantie. Nicht doppeln.
- Race `src/data/npc/fluffer.kinds.k15.json` führt **15 reale K15 GLB-Kreaturen** mit Quell-SHA, darunter `chicken` und `crab` (Arthropode, **kein Insekt**). Bereits `Idle`, `Walk`, `Jump`, `HitRecieve`, `Bite_Front`, `Death` u.a.; diese Clips als Ausgangsgolden verwenden, nicht still ersetzen. `assets/private` enthält tatsächliche Dateien, vor Ausführung bytes/rig isoliert prüfen.
- `src/data/characters/registry.r1.json` führt Tier-Aliasse wie `animal_bee` und `animal_caterpillar`; das ist **allein kein Beweis für eine riggbare, in der aktuellen Engine vorhandene Biene oder Raupe**. Insektenquellen erst per Librarian + Original-GLB validieren.
- Race `src/npc/mobs2d.js`, `src/data/mobs2d/{inkblobs.r1.json,slop-loops.r1.json}`: 2D Slops/Black Ink Blobs besitzen bereits bestehende Sprung-/Squash-/Hit-/Zerfall- und Sprite-Loop-Pfade. Nur eigene **kontrollierte 2D-Kontur-/SDF-Deformation** als Kandidat; kein künstliches humanoides Skelettrig, keine automatische Splat-3D-Rückseite.

## 3. Produktionsschnitt: eine Motion-Definition, mehrere Renderziele

`source GLB/PNG + rig facts → behavior/attack design → referenzgestützte Pose/Timing → Blender-scripted bake / 2D keyframe deform → QA/Versionvergleich → Clip/pose/metadata export → bestehender Spiel-Actor-Host`.

**3D Rigged Tiere/Gegner/Arthropoden:** Bake auf das **Originalrig** unter festen Bone-Längen, exportiere konservativ glTF/GLB AnimationClips inkl. benannter Zeiten/Events; benutze vorhandenen Mixer. Posing, Ground Contact, RootMotion-Ownership und zielgerichtete Bite/Hit-/Spit-Vectors bleiben unabhängig beurteilbar. Gleiche gebackene Bone-Pose darf optional KFB-Splat-Hülle mitnehmen, solange deformierte Splats korrekt an Bones/Part-IDs hängen (Source isolated before integration). Rendererwechsel wird **nicht** als Motion-Verbesserung bewertet.
**2D Slops:** Bewegung über vorhandene bildparallele Avatar-/Atlas-Pipeline bzw. explizit vom Original abgeleitete Körperkontur und eigene getrackt-verankerte Augen/Zähne. Export: vorhandene Sprite-/Loop-Atlas-Kontrakte oder Motion-Kurve, nicht skinned GLB erzwingen.
**Insekten und gefiederte Tiere:** separate Körperplan-QA: mehrbeinige Stützphasentakte, Antennen/Fühler, Flügel-Schlagfrequenz, Kontakt/Fußdrift; Kopfstabilisierung bzw. Körperrotation ist **Quellreferenz**, keine universelle Naturregel. Für einen ersten Insekten-Proof tatsächliche rigged Originalquelle aus vorhandenen Assets bestätigen.

## 4. Pilot C1 – ein echter K15 Chicken-Actor

**Donor:** `KFB_Chicken_healed.k11c.glb` im bestätigten K15-Roster, Source-SHA `04f077f5b5fe80718bf9261606511f02dcebb48843b58a068ab7e79f859e883f`; Hash der *echten importierten Datei* erneut prüfen und Original-Modell plus vorhandenes `Walk`/`Idle`/`Bite_Front` isoliert bei drei Kamerawinkeln zeigen.
**Neue Kandidaten-Aktion:** ein spezifischer kurzer animalisch inspirierter `peck-then-recoil` Angriff plus ursprünglicher Idle→Walk→Attack→Hit→Recovery-Zusammenhang. Keine neue K15-Skelett-/Modellfamilie und keine neue Actor-State-Maschine.
**Behaviorsheet vor dem Bake:** Spielerfrage, Telegraph, Start/Anticipation, Commit/Strike, Contact-Frame und Hit-Position relativ zu bestehendem KFB Actor, Recovery/Interruptibility, zusammen mit dem **vorhandenen** Combat-Event-/Collider-Owner. Der Authoring-Clip ist nicht die Combat-/Damage-Truth.
**Referenz:** ein technisch/lizenziell nutzbarer echter Huhn-Lauf-/Pick-Clip mit sichtbaren Füßen, Zeitposition und Quellenvermerk; kein AI-berechneter Videoersatz, wenn Originalreferenz fehlt.
**Blender-Passes:** 1) große Keyposes & Angriffsgeschwindigkeit; 2) Kopf-/Flügel-/Schwanzfolgebewegung bei identischer Character-Identität; 3) Locomotion/Stand/Loop; 4) Hit/Recoil/Recovery. Jedes Mal denselben Frame-Bereich und Original-Clip nebeneinander, Front/Side/3/4 und Footprint-/Face-Details prüfen.
**Game-Lieferung:** ein zusätzlicher optionaler `AnimationClip`, keine Überschreibung der 10 vorhandenen Clips, plus Event-/Frame-Metadata (Clip-ID, rig source ID, seed, fps, source video, contact, ground-lock, export version).

**Danach, nur wenn C1 technisch brauchbar:** K15 `Crab` für eine mehrbeinige/seitliche Bewegung und Klauenangriff mit bereits vorhandener Quelle; dann ein tatsächlich aus Registry/privater Source isoliertes Insekt (z. B. Biene, falls riggbare Quelle vorliegt); dann ein einzelner aktueller Black Ink Blob als separat behandelter 2D-/SDF-Deformationsfall. Kein vierfacher neuer Produktionsjob vor einer funktionierenden K15-Kette.

## 5. Qualitätskontrollen / Ergebnisgrenzen

- **Source-/Rig-Identität:** SHA/GLB-Bones/Restpose und Quell-Clip nachweisen; keine neue Ersatzfigur/Marke; Gesichts-/Augen-/Munddetails auch unter der stärksten Pose korrekt.
- **Plausible Bewegung:** 3 Ansichten, Foot-/Body-/Tail-Kontakt, Root-Drift, Bone-Length, Self-Intersection, Durchdringung des Bodens und Zyklus-End-Continuity; bei Flug/Insekten eigene Freiheitsgrade statt menschlicher Walk-Checks.
- **Combat-Timing:** Warnpose sichtbar; Strike-Speed/Impact-Fenster; Hit-Position/-Richtung innerhalb plausibler Toleranz zu bestehender Target-/Collider-Geometrie; Recovery und Cancel-Fenster nachvollziehbar. Toleranzen erst am Originalmodell messen, keine erfundenen fixen Universalwerte.
- **Playback:** gleicher gespeicherter Clip in Blender und im bestehenden KFB-host-/R3F-Viewer (falls später autorisiert); gleiche Ereignis-Frame-Reihenfolge beim Re-Export; kein ungewollter zweiter Root-Motion-Owner.
- **Splat-Anschluss, separat:** gleiche Animationsdaten auf Original-Mesh vs skinned-Splat/Part-Splat; gleicher Kameraweg/Licht, Gesicht und Anker stabil, framep95 und Speicher-Mehrkosten. Nicht die Splat-Materialänderung mit Animationsqualität verwechseln.
- **Automatisch:** Clipname, Rig-Kompatibilität, Enden/Loops, finite transforms, joints, Contact-Frame, Footslip/Drift, Bake/GLB-Reimport; nur tatsächlich gemessene Checks als PASS.
- **Blinder visueller Check:** Unabhängiger Critic beurteilt Charakter/Timing/Bewegungswahrheit auf realen Renderaufnahmen; Builder kann seine eigene Änderung nicht global akzeptieren.

## 6. Ownership, Abfolge, Gate

WS0 beauftragt nur den **Motion-Authoring-Adapter** mit echten bereits registrierten Quellen. ToolBox/Animation-Lab (nach Source-Pin) kann Clip-Playback/Calibration/Comparison nutzen; FrankenStein Studio bleibt für Figur/Rig/Face authoritative. Race-Game-Host bleibt alleiniger Besitzer von Enemy AI, locomotion, Hit-Events, Kollision, GameClock, Splat-/Mesh-Render-Integration. Keine zweite Godot-Runtime; Godot im Reddit-Beispiel ist nur UI-/Workflow-Referenz.

**Konfliktfreiheit mit WS0 Splat-R0:** Dieses Dokument ist ein **separater, optionaler Authoring-Folgepilot** auf derselben Review-Branch, kein zusätzliches G0-Hindernis für Props/Slops/Scenelets oder den nachfolgenden Dungeon-/SDF-Test. Ohne echten animierten K15-Isolations- und Qualitäts-PASS keine Runtime-Übernahme. Patch später.

**Nachweis bei diesem Research-Commit:** 0 neue Blender-Bakes; 0 echte Video-Referenzfiles beschafft; 0 neue GPU-/KFB-Animationstests; kein Site-/Stage-/Live-Link. Bestehende K15 Clips sind anhand des aktuellen Datenmanifests belegt, **nicht neu im Browser gerendert**.

**Genau ein nächster Gate:** **WS0/ToolBox** zeigt den tatsächlichen K15 Chicken-Original-GLB isoliert einschließlich `Idle`, `Walk`, `Bite_Front` (Hash, Rig-Bones, Perspektiven), bevor ein zusätzlicher `peck-then-recoil`-Clip programmatisch gebacken wird. Danach sein identisches Motion-Playback im Mesh- und optional Splat-Rendering messen.
