# Free Roam · vorhandenes Quartier als Bauauftrag / Abnahme

**PROPOSED BUILD ORDER r1 · kein importierbares World Recipe und keine gebaute Site.** Dieser Auftrag konkretisiert ein Fixture aus vorhandenen Quellen; er erfindet kein neues Szenenschema.

## Quelle und gezielte Änderungen

Donor ist `tools/world_atlas/source/scenes/city-block.js`, Blob `be8364bd6dec7b423d6cf3c48163e73fffd5d471`, Szene `CQ-S2_KENNEY_CITY_STREET_GRID`. Vorhandenes 10×10-Modulraster mit Kreuzung [4,5], Nord–Süd-Straße x=4 und Ost–West-Straße z=5. Modulmaß M wird aus dem geladenen `roads:road-straight` gemessen. Dessen Source-Orientierung ist X; Nord–Süd benötigt 90°. Nicht Dateinamen als Größenmessung benutzen.

Gezielter Receiver-Delta, Originalrezept unverändert behalten:

1. In [4,2] und [7,5] die Gerade **durch** `road-crossing` ersetzen, nicht überlagern. Die lokale Quellprobe belegt beide Doppelbelegungen. Danach 19 statt 21 Straßenflächenplatzierungen; noch keine Aussage über tatsächliche Meshüberlappungen.
2. `construction-cone` in [4,8] und `construction-barrier` in [4,9] aus dem regulären Fahrkorridor entfernen/außerhalb seiner gemessenen Hüllkurve aufstellen. Als spätere bewusste Hindernisse getrennt kennzeichnen; nicht unbemerkt als Straßenabschluss stehen lassen.
3. Südlichen Randstreifen z=8..9 als Kandidat für Parken und Rangieren reservieren; vorhandene Dekoration in diesem Streifen nur im Fixture versetzen. Zufahrt an die bestehende Nord–Süd-Achse anbinden. Exakte Parkposes erst nach Modell-/Hüllkurvenmessung festschreiben.
4. Vier vorhandene Fassaden genügen: Commercial `building-a`, `building-c`; Suburban `building-type-a`, `building-type-c`. Weitere Originalbebauung optional ausblenden, ohne Quellen zu löschen. Ein KayKit-City-`bench` am sicheren Fußweg ergänzt den dritten City-Pack konkret; nicht alle drei Packs als drei fertige Städte bauen.
5. Einen straßenparallelen, ausreichend freien Travel-Terrainabschnitt als Offroad-Rückweg und einen klaren Stuntabzweig vorsehen. Bumper/Rampe verwenden die tatsächliche vorhandene Race-Geometrie samt Kontaktvertrag. Keine nur dekorative Straßensteigung als geprüften Stunt ausgeben. Ein befahrbarer Bypass ist Pflicht.
6. Parkfläche, Gehweg/Actor-Start, Fahrzeug, Combat-Testziel und Rückweg am selben Travel-Anker instanziieren. Das existierende Lorekeeper-/Hex-Fixture bleibt unverändert und wird nicht durch dieses Quartier ersetzt.

## Konkrete Assetreferenzen

Alle folgenden Modellpfade gehören zu `georg-doc/kayfabizarro` am bestehenden Atlas-Assetpin **`8948a06b75cb18c970599afb29b6a772315fad0e`**. Keine Kopien im Free-Roam-Verzeichnis.

| Verwendung | Exakter Quellpfad / ausgewählte Dateien |
|---|---|
| Straßen/Grundplatten | `media/3D_Assets/kenney_city-kit-roads/Models/GLB format/` mit `road-straight.glb`, `road-crossroad.glb`, `road-crossing.glb`, `tile-low.glb`; existierende Donor-Referenzen, vor Instanzierung alle Dateien laden/prüfen. |
| Geschäftsfassaden | `media/3D_Assets/kenney_city-kit-commercial_2.1/Models/GLB format/building-a.glb` und `building-c.glb`. |
| Vorstadthäuser/Zufahrt | `media/3D_Assets/kenney_city-kit-suburban_20/Models/GLB format/building-type-a.glb`, `building-type-c.glb`, `driveway-short.glb`. |
| KayKit-Stadtprop | `media/3D_Assets/KayKit_City_Builder_Bits_1.0_FREE/Assets/gltf/bench.gltf`; GLTF/BIN-Präsenz am Pin direkt bestätigt, übrige Sidecars noch zu schließen. |
| Fahrzeug/Stunts | Race `race/SOURCES.json`, `race/src/physics.js` und gemeinsame `world.js`-Geometrie; vorhandenen Kart-Kandidaten zuerst verwenden. Exakten Loaderpfad/Profil/Bodymaß vor Freigabe pinnen; world.js-Geometrie wurde in diesem Preflight nicht vollständig neu vermessen. |

Die Fassaden-/Straßendateien sind aus dem tatsächlich gelesenen Rezept/Loader abgeleitet; dieses Dokument behauptet keinen neuen vollständigen Binary-Ladetest. Das Atlas-buildScene kann fehlende Modelle überspringen. Für das Pflichtfixture müssen alle erforderlichen Modelle/Sidecars vor dem Commit validiert sein; sichtbare Lücken sind kein erfolgreicher Import.

## Maßstab und Kontakt vor Dekoration

Zuerst M, Karosserielänge L/Breite W/Höhe H, Radstand/Radbreite und Actor-Körperhöhe messen. Ein gemeinsamer Ensemblemaßstab zur Travel-Körperhöhe 0.022; keinen Wagen und jedes Haus separat auf dieselbe Höhe normalisieren. Die .022 sind keine Meterangabe.

Explizite vorläufige Auslegungsziele: Parkbucht mindestens 1.35 W breit und 1.25 L tief; Zweirichtungsfahrbahn mindestens 2.5 W frei. Reale Wende-/Drift-Hüllkurve und Außenspiegel/Collider können größere Werte verlangen. Bordstein nach verfügbarer Suspension/Schritthöhe und echte Durchfahrt nach H plus gemessenem Federweg prüfen. Diese Verhältnisse sind Vorschläge, keine Assetmaße oder Normen.

Aufzeichnen: Repo/Pin/Datei, vollständige Sidecarliste, Mesh-Bounds/Transform, Colliderart, sichtbare Straßenoberkante, Einheitenfaktor, sphärischer Anker/Frame, lokale Normalen und Gültigkeitsgebiet. Freie Korridore gegen Collider-Volumen testen, nicht nur Mittellinien. BUILD und PLAY verwenden dieselben Instanzen/Geometrien.

## Durchgehende Abnahme — noch nicht ausgeführt

`Flight zum Ort → Ground → zum Wagen gehen → einsteigen → rückwärts ausparken → Drei-Punkt-Wende → langsam Vorstadt → Asphalt/Terrain/Asphalt → Kreuzungsdrift → Boostgerade → Bumper/Rampe oder Bypass → sicher parken → aussteigen → ein Combat-Testziel → Explore → wieder einsteigen → Save → Reload → Ground/Flight-Rückweg`.

| Test | Nachweis / Gegenprobe |
|---|---|
| D01 Reverse/Neutral | S während Vorwärtsfahrt und W während Rückwärtsfahrt: bremsen, stabile Neutralphase, dann andere Richtung. W+S bremst. Kein abrupter Geschwindigkeits- oder Modellflip. |
| D02 Rangieren | Gleicher A-/D-Lenkwunsch vorwärts/rückwärts erzeugt passende entgegengesetzte Gierantwort. Stillstand ohne Antrieb dreht nicht das Chassis. Parken ohne Drift/Turbo. |
| D03 Grip/Boost | Q/E bewusst, Q+E deterministisch, sauberes Re-Grip; Shift beschleunigt nur erlaubte Vorwärtsfahrt. Rückwärts-Cap und Boost-aus-Rückwärts gesondert prüfen. |
| D04 Weltkontakt | Befahrbarer Asphalt-/Terrainwechsel, Hang und quer dazu gefahrene Kurve mit echtem gebackenem Boden; Physik-/Bildhöhe und Up protokollieren. Ankerfernere Stelle zusätzlich, nicht nur direkt am Tangentialursprung. |
| D05 Stunt | Tatsächlicher Bumper-/Rampenkontakt, Air/Landing-Fakten und nutzbarer Bypass. Keine Belohnung nur durch Annäherung oder Abspielen eines Clips. |
| D06 Enter/Exit | Ein Owner, sichtbarer Wechsel, Wagen bleibt erhalten. Links blockiert→rechts; beide Seiten blockiert→hinten; alles blockiert→im Wagen bleiben. Niedrige Decke, Wand und Luftfahrtversuch negativ testen. |
| D07 Transaktionsfehler | Fehlendes Modell/Sidecar, abgebrochener Load, verspäteter vorheriger Load und fehlgeschlagene Übergabe lassen Szene, Actor, Sitz, Modus und Save gültig. |
| D08 Park/Restore | Dieselbe Vehicle-ID/Pose nach Aussteigen/Wiedereinsteigen und neuem Boot. Save in Ground UND geparktem Drive; korrupter Import überschreibt nicht den vorherigen Save. |
| D09 Combat | Explizit aktiviertes Testziel: Aim, bestätigter Clipmarker/Muzzle-Abgang, Treffer, Cancel/Explore. Kein zweiter Bewegungs-/Mixer-/Kameraschreiber; Orbit-Drag schießt nicht. |
| D10 Aktivität | Race starten/abbrechen/beenden ohne Wagen-/Physik-/Kamerasprung. Als separater BOX1-Einstieg gekennzeichneter Übergang erfüllt diesen Seamless-Test nicht. |
| D11 Lebenszyklus | Mindestens 20 sinnvolle Enter/Exit/Moduszyklen; gehaltene Tasten, Blur/Visibility, Pause, Modal und BUILD→PLAY. Keine Restinputs, wachsenden Listener, Audio-Loops oder Mixer. |
| D12 Bestandsregression | Vorhandener Ground=8-Gate und Ground↔Flight samt FX/Kamera/Save bleiben intakt. BOX1-v0.8 unverändert. Desktop, ~832px und schmaler Touch-Kontext; emulierter Touch ist kein Gerätetest. |

Pro Test tatsächliche Sourcekombination, Weltseed/Anker, Actor/Vehicleprofil, Inputspur, Kontakt-/Modus-/Posefakten, sichtbare Aufnahme und Befund speichern. Numerischer Test, Browserbeweis und Georgs Urteil getrennt führen. Erstes Ergebnis dieses Auftrags ist aktuell der Quell-/Rechenbeleg in `evidence/source-probe.json`, nicht D01–D12.
