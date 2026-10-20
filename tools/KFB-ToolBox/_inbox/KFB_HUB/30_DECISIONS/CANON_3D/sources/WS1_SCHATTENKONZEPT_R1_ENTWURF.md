# KFB Schattenkonzept · R1 · ENTWURF · 21.10.2026

Für: Georg (Projektleitung) und WS0 (Kanon). Auftrag: Georg 21.10. („am KayKit-Creator orientieren … Kontaktschatten … weniger 3D-Schatten … Racer/Dieselpunk … Boden aus Blender … ein stimmiges Gesamtkonzept mit dem neuen Terrain“).
Status: **Recherche-Entwurf.** Kein Code geändert, nichts gerendert, keine Abnahme. Register-Zitate beziehen sich auf `origin/reg` (Pfade gekürzt, `30_DECISIONS/` = `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/`).

---

## 1 · Kurzfassung

KayKit erdet seine Objekte vor allem über die **Farbe selbst**: Jede Farbe im Textur-Atlas ist ein senkrechter Verlauf von hell nach dunkel, und die Modelle sind so abgewickelt, dass ihr **Fuß im dunklen Teil** liegt. Das haben wir an fünf KayKit-Modellen nachgemessen. Den 3D-Schatten braucht KayKit dann nur noch als ruhige, weiche Zutat. Unser Kanon verlangt dagegen echte Schatten aus einer Sonne (V-564) und verbietet eingebackenes Licht in der Farbe (Kanon M2). Mein Vorschlag übernimmt KayKits **Wirkung**, nicht seine Bauweise. Den dunklen Fuß erzeugt der Knet-Shader zur Laufzeit als `contactDepthTint`, abhängig vom echten Abstand zum Boden. Das ist schon Georgs Wort (V-570: „dunkler, nie schwarzer Kontaktton an jedem Requisit“). Die eine Sonne wirft weiterhin echte, im Palettenton gefärbte Schatten, aber leiser und mit klarer Form. Kleinteile dürfen nach KayKit-Art auf den Schattenwurf verzichten (offene Frage 2). Der Boden bekommt Mulden und Erdwülste als echte Geometrie aus Blender (Ursache). Für feste Objekte kommt eine einmal berechnete Verdeckungskarte aus der Draufsicht dazu. Bei Figuren werfen alle festen Teile Schatten, auch die Ohren auf den Kopf, und alle Teile empfangen Schatten. Dafür braucht es eine zweite, feinere Schattenkarte derselben Sonne nahe der Kamera (offene Frage 3).

## 2 · Was KayKit konkret macht (belegt)

| # | Befund | Beleg | Sicherheit |
|---|---|---|---|
| K1 | Alle Packs nutzen **einen Gradient-Atlas** mit 1024², der sich auf 128² verkleinern lässt | itch.io/GitHub-README, z. B. [Medieval Hexagon](https://github.com/KayKit-Game-Assets/KayKit-Medieval-Hexagon-Pack-1.0), Suchtreffer [Forest](https://kaylousberg.itch.io/kaykit-forest), [Dungeon](https://kaylousberg.itch.io/kaykit-dungeon-pack) | Quelle |
| K2 | Jede Atlas-Farbe ist ein **senkrechter Verlauf hell → dunkel**, bis fast Schwarz | eigene Sichtung `forest_texture.png`, `dungeon_texture.png` aus `media/3D_Assets/…` @origin/reg | gemessen |
| K3 | Die Modelle sind so abgewickelt, dass **tiefere Punkte dunklere Verlaufsstellen** treffen. Korrelation Höhe ↔ Texturzeile: Busch −0,98, Baum −0,85, Fass −0,70, Truhe −0,69, Fels −0,68 | eigene Messung der glTF-Dateien (Forest 1.0, Dungeon 1.1) aus demselben Repo-Pfad | gemessen |
| K4 | Keine Vertexfarben, ein Material je Pack, Rauheit im Pack 0,45 | Messung K3 (0 `COLOR_0`); `LIGHT_CONCEPT_S13_3.md` (tools/world_atlas/docs) | gemessen |
| K5 | Promo-Bilder: **ein** Schattenlicht von oben, alle Schatten in eine Richtung, weicher Kontaktschatten unter jedem Teil, Fackeln nur als Akzent, matt | `LIGHT_CONCEPT_S13_3.md`; `LIGHT_RESEARCH_AUDIT_R1.md` §3 | eigene Bildanalyse 17.09. |
| K6 | Godot-Tutorial: WorldEnvironment und Licht, Tag → **dieselbe** Szene als Nacht, Innenraum als eigenes Thema | [YouTube Vfr3n4WKsc0](https://www.youtube.com/watch?v=Vfr3n4WKsc0); Kays Patreon-Text laut `KAYKIT_CREATOR_TUTORIAL_RESEARCH_2026-10-10.md` (Zweig research/kaykit-creator-tutorial-atlas-2026-10-10) | Thema belegt, **0 Videobilder gesehen** |
| K7 | Leuchtteile haben ein eigenes Material (`holiday_glow`), das die Engine leuchten lässt, statt eine Lampe je Teil | `KAYKIT_DEMO_SCENE_LEARNINGS.md` | Quelle |
| K8 | SSAO, Schattenfilter und -auflösung in Kays Godot-Szenen | nicht auffindbar (YouTube-Seite, Patreon, itch.io sperren den Abruf; Mastodon ohne Treffer) | **Vermutung:** Godot-Standard mit SSAO und weichem Richtungsschatten |
| K9 | Bodenkacheln mit eingebauten Vertiefungsrändern | nicht geprüft | offen |

**Kern für uns:** KayKits „guter Kompromiss“ liegt in K2 und K3. Die Erdung steckt kostenlos im Material, der Echtzeitschatten ist Beiwerk. Das ist auch billig: null Laufzeitkosten.

**Kurz zu anderen Spielen (Kosten im Browser, WebGL2):**
- **Screen-Space-Contact-Shadows** (Days Gone, Bend Studio): scharfe Schatten genau dort, wo Dinge sich berühren (Füße, Falten), wofür die Schattenkarte zu grob ist ([Bend-Blog](https://www.bendstudio.com/blog/inside-bend-screen-space-shadows/)). Das ist ein Strahl-Marsch im Tiefenpuffer je Pixel. In three.js gibt es keinen fertigen Pass. *Schätzung:* mittlere Kosten, auf Mobil teuer.
- **Kontakthärtende Schatten (PCSS):** hart am Fuß, weich in der Ferne ([three.js-Beispiel](https://threejs.org/examples/webgl_shadowmap_pcss.html)). *Schätzung:* 2–3 × die Kosten je Pixel eines normalen weichen Schattens, auf dem Mac gut, auf Mobil grenzwertig.
- **VSM:** sehr weich bei wenig Kosten je Pixel ([Beispiel](https://threejs.org/examples/webgl_shadowmap_vsm.html)), aber Licht leckt an Kontaktstellen. Unsere `LESSONS_SHADOWS.md` sagt deshalb „VSM meiden“.
- **GTAO/SSAO** als Nachbearbeitung ([GTAOPass](https://threejs.org/docs/pages/GTAOPass.html)): ein Vollbild-Durchgang. *Schätzung:* auf dem Mac mit halber Auflösung tragbar, auf Mobil teuer.
- **Vertex-AO bzw. Verlauf im Material** (KayKit): keine Laufzeitkosten, aber eingebacken.
- **Verdeckungskarte aus der Draufsicht** (drei `AccumulativeShadows` sammelt einmal und kostet danach nichts mehr, [Doku](https://drei.docs.pmnd.rs/staging/accumulative-shadows)): einmal rechnen, danach ein Texturzugriff. drei `ContactShadows` rendert dagegen jedes Bild von unten, ist „rather expensive“ und eine flache Scheibe ([Doku](https://drei.docs.pmnd.rs/staging/contact-shadows)), für uns also eine Decal-Lösung.

## 3 · Abgleich mit unserem Kanon

| KayKit-Element | Kanon | Urteil |
|---|---|---|
| Eine Sonne, ein Schatten in eine Richtung (K5) | V-385, V-429, V-564 | **vereinbar** |
| Nacht = dieselbe Szene, Leuchten über Material (K6, K7) | LIGHT_MODEL_R2 Regel 6/7 | **vereinbar** |
| Matte Materialien | Kanon 8, V-385 (Sheen ≤ 0,05) | **vereinbar** |
| Dunkler Fuß als **Wirkung** | V-570 „dunkler, nie schwarzer Kontaktton an jedem Requisit … Baumkronen-Unterseiten“; Ü18 `contactDepthTint` | **vereinbar**, das will Georg ausdrücklich |
| Dunkler Fuß **eingebacken** in den Atlas (K2/K3) | Kanon 15 (3) und 17 (8): „kein eingebackenes Licht, kein eingebackenes AO“, „keine Schattierung in die Albedo“ (M2); V-355 (Meshy entlichten) | **Konflikt → offene Frage 1** |
| Weicher Kontaktschatten unter jedem Teil (K5), falls als Fleck gebaut | V-564 „keine Blob-/Scheiben-Schatten“; Ü20 „kein Kapsel-, Decal- oder Blob-Objekt“; CRITIC K4 | **Konflikt**, nur mit Ursache (Geometrie, Shadow-Map, Verdeckung) zulässig |
| Wenig 3D-Schatten, Kleinteile ohne Wurf | V-429 „alle Objekte werfen und empfangen“; Ü20 „jeder Akteur wirft“ | **teilweise Konflikt → offene Frage 2** (Akteure immer, Kleinteile offen) |
| SSAO (K8, Vermutung) | LIGHT_MODEL_R2 Regel 9 „AO-Probe im Budget“; W13 | **offen** (offene Frage 5) |

**Eigene Altlasten, die dem Kanon schon heute widersprechen** (gefunden in `~/kfb-ws1/kfb-planet-t439` @f1d6daf, nicht im Register):
1. `createContactAO` in `src/vendor/light/kfb-stage-light.v1.1.js` (Z. 208 ff.) ist ein **schwarzer Gauß-Fleck auf einer Ebene** (MeshBasicMaterial, Deckkraft 0,42), also ein Decal-Schatten nach Ü20. In der Laufwelt sitzt er zudem 1,3 m zu hoch (WS1B_SHADOW_DIAG_R1 Befund 3). `look=terrain2` hat die Flecke schon entfernt (@4f0f774).
2. Die Laufwelt nutzt seit 20.10. **VSM** (`src/m1/M1World.jsx:211`, Georg wollte „weich ohne Stufen“). Das widerspricht `LESSONS_SHADOWS.md` („VSM meiden … Licht an Kontaktstellen“, also Schattensaum-Gefahr V-440). Offene Frage 4.
3. FB-Ohren werfen keinen Schatten, Haarbüschel und Brauen empfangen keinen (WS1B_SHADOW_DIAG_R1 Befund 2). Das sind genau Georgs „halbe Andeutungen“.

## 4 · Konsolidiertes Konzept in Schichten

### (a) Sonne und Schattenkarte
- **Eine Sonne**, Richtung aus der Stimmung (`kfb-stage-light`), kein Rand- und kein Gegenlicht (V-392).
- **Zwei Kaskaden derselben Sonne** (Vorschlag, offene Frage 3), weil eine Karte nicht beides kann (Befund 1: Baumkronen abgeschnitten; Ohr auf Kopf braucht Millimeter-Texel):
  - **Nah:** Kugel um Spieler bzw. Dialog-Gruppe, ≈ 6 m Radius bei 2048² → Texel ≈ 6 mm. Trägt Selbstschatten, Füße, Räder.
  - **Fern:** sichtbarer Bereich bis ≈ 60 m, 2048² (Mobil 1024²). Trägt Bäume, Gebäude, Felsen. Die Lichtposition schließt den höchsten Werfer ein (Kronenhöhe ÷ sin(Sonnenhöhe) + Rand, Befund 1).
  - three.js bringt dafür ein CSM-Modul mit ([Beispiel](https://threejs.org/examples/webgl_shadowmap_csm.html)). Die Regeln aus `fitShadow` v1.1 gelten je Kaskade: Texel-Einrasten, Vorderseiten werfen, normalBias 1,5 Texel, Gate G6.
- **Filter:** weiche PCF mit **kontakthärtender** Kante (PCSS-artig) als Ziel: hart und klar am Fuß, ein schmaler weicher Rand weiter weg. So ist nichts pixelig (Georg 20.10.), und es entsteht kein Leck wie bei VSM. Den Entscheid trifft ein Bildvergleich VSM | PCF weich | PCSS (offene Frage 4).
- **Antwort:** zweistufig nach Kanon 7. Die Shadow-Map bestimmt, **wo** der Schatten liegt, die Palette des Empfängers bestimmt, **welche Farbe** er hat (`castShadowTint`, Ü18: Figur −12…−18 L\*, Terrain −18…−24, Fels −22…−28). Überlappung über `max`, nie Summe. Schattenstärke wie heute leiser (≈ 0,8), damit der Kontaktton die Erdung trägt. Das ist der KayKit-Kompromiss.
- **Wer wirft:** alle Akteure, Fahrzeuge, Gebäude, Bäume, Felsen ≥ 0,3 m. **Wer empfängt:** alles außer Himmel und Partikeln. Dünne Überzüge (Brauen, Mund-Decals, Lider) werfen nicht, empfangen aber (siehe d).

### (b) Kontakt und Erdung je Klasse
Gemeinsamer Baustein ist der **Kontaktton im Knet-Shader**: Er dunkelt das Objekt selbst in einem schmalen Band über dem Boden ab. Das Band ist eine harte Stufe 8–12 L\* unter dem Wurfschatten, ≤ 0,15 × Aufstandsradius, nie schwarz (V-570, Ü18, W7). Gerechnet wird aus dem **echten** Abstand zur Bodenhöhe (`groundAt`). Sinkt oder hebt sich das Objekt, wandert das Band mit. Das ist KayKits dunkler Fuß, aber mit Ursache und ohne Einbacken. Dazu kommt der gleiche Ton auf dem Boden direkt am Fuß (Empfänger-Rolle `contactDepthTint`).

| Klasse | Erdung |
|---|---|
| **Figuren** | echter Wurfschatten (Nah-Kaskade) + Kontaktton an Sohle und Boden; beim Sprung blendet der Kontaktton bis 0,15 m Höhe aus, der Wurfschatten bleibt; Figurenlicht V-386 hält das Gesicht lesbar |
| **Fahrzeuge/Racer am Boden** | Wurfschatten + Kontaktton nur an den **Aufstandsflächen** (Räder, Kufen), nicht als Fläche unter dem ganzen Fahrzeug; Unterboden bekommt den Kontaktton als Verlauf zur Bodenseite (Dieselpunk: Öl, Ruß als Material-Gebrauchsspur, Kanon 3) |
| **Racer im Schweben/Flug** | Wurfschatten der Fern-Kaskade zeigt die Höhe; Kontaktton aus ab 0,3 m; **kein Fleck unter dem Racer**. Weil der Schatten bei tiefer Sonne seitlich aus dem Bild wandert (10 m Höhe bei 40° Sonne → ≈ 12 m Versatz), schlage ich als Höhenhilfe ein **echtes Lande- bzw. Antigrav-Licht nach unten** vor: ein Praktikal aus dem Pool, als Pfütze auf den Empfänger projiziert (`kfb-light-pool.v1`, V-572), mit erzählter Ursache (Düse, Scheinwerfer). Braucht eine eigene V-Nummer |
| **Requisiten, Steine** | eingesunken nach SINK (Findling 40–50 %, V-570), Kontakt-Geometrie an der Fuge (V-565, `kfb_env.contact`), Kontaktton; Kleinteile < 0,3 m erden nur über Einsinken + Kontaktton (offene Frage 2) |
| **Bäume** | Wurfschatten (Fern), Kontaktton am Stammfuß, **Kronen-Unterseite** dunkler (V-570), Fluff-Kugeln am Kronenrand werfen mit, damit keine Ring- oder Fleckschatten entstehen (Befund 1) |
| **Gebäude, Dioramen** | Sockel sinkt ein bzw. Erdwall um den Fuß (Kanon 15 (1); in `terrain2` schon als „Erdwall um den gemessenen Fuß“ gebaut, @4f0f774), Wurfschatten (Fern), Kontaktton am Sockel, Verdeckungskarte am Boden (c) |

### (c) Boden
- **Vertiefungen und Übergänge sind Geometrie, keine Malerei.** In Blender (`kfb_env_bpy.place`, `kfb_edge_bpy`) bekommt jedes große Objekt ein **Fußbett**: eine flache Mulde mit leichtem Erdwulst bzw. eine Schürze, dazu Kontakt-Brocken an der Fuge (V-565). Die Innenflanke liegt dann von selbst im Hemi- bzw. Sonnenschatten, der Wulst fängt Licht. Das ist plausible Erdung ohne Trick. Zur Laufzeit stempelt WS1 dieselbe Form ins Höhenfeld, sobald ein Objekt gesetzt wird.
- **Boden-Verdeckungskarte** (Vorschlag, offene Frage 5): je Gelände-Abschnitt wird einmal beim Laden aus der Draufsicht eine weiche Verdeckung der **festen** Objekte gerechnet (Tiefe von oben, weichgezeichnet) und im Terrain-Shader als `contactDepthTint` mit Deckel (`max`, ≤ 1 Stufe) gelesen. Kosten: einmalig, danach ein Texturzugriff. Bewegte Dinge bekommen das nicht, sie haben Shadow-Map und Kontaktton.
- **Palettenton:** Schatten, Kontakt und Kantenakzent kommen aus dem Rollen-Quartett des Bioms (Ü18), höchstens zwei Stufen, nie Grau oder Schwarz (Kanon 7). Die Fließfarben-Flächen bleiben davon getrennt: Die Diagnose-Ansicht „Albedo ohne Schatten“ (Kanon 17 (9)) muss schattenfrei sein.

### (d) Selbstschatten an Figuren
Grundsatz: **ganz oder gar nicht, je Teilart gleich.**
- **Feste Teile** (Kopf, Ohren, Haarbüschel, Nase, Hut, Arme, Fahrzeugteile): werfen **und** empfangen. Das Ohr wirft also auf den Kopf und auf den Boden, damit der Bodenschatten Ohren hat (Befund 2).
- **Dünne Überzüge** (Brauen, Mund, Lider, Pupillen): werfen nicht (`LESSONS_SHADOWS.md` Ursache 4), **übernehmen aber die Abdunklung** der Fläche darunter. Liegt der Kopf im Schatten, werden Brauen und Mund mit dunkel.
- Die Nah-Kaskade (≈ 6 mm Texel) macht den Ohrschatten **sauber statt angedeutet**. Mit nur einer großen Karte entsteht genau die halbe Andeutung.
- **Gesicht:** geglättete Normalen (Ü19), zweistufige Antwort (Licht- und Schattenseite, Kanon 7). Augen und Mund bleiben über das Figurenlicht V-386 lesbar (L-9: Mund/Stirn ≥ 0,85). Fällt ein Ohrschatten über ein Auge, ist das zulässig, solange L-9 hält.

### (e) Leistung und Budget
| Posten | Desktop/Mac | Mobil | Anmerkung |
|---|---|---|---|
| Schattenkarten | 2 Kaskaden × 2048² | 1 Kaskade 1024² + Nah 1024² | jede Kaskade rendert ihre Werfer erneut (Draw Calls) |
| Filter | PCF weich, 8–16 Proben, kontakthärtend | PCF 4–8 Proben | VSM nur nach Bildvergleich |
| Kontaktton | Shader-Term, ~0 | ~0 | ersetzt `createContactAO` |
| Boden-Verdeckung | einmalig je Abschnitt | dito | danach 1 Texturzugriff |
| SSAO/GTAO | nur als A/B-Probe, halbe Auflösung | aus | erst wenn (b)+(c) nicht reichen |
| Werfer-Grenze | ≥ 0,3 m bzw. Akteur | ≥ 0,5 m | offene Frage 2 |

Ziel nach V-570 bzw. V-370: 60 fps gemessen (Desktop), p95 ≥ 30 fps auf Georgs MacBook. Zuletzt waren es dort 15 fps (Stand 20.10.). Erst messen, dann Kaskaden zuschalten. Alle Kostenangaben sind **Schätzungen**, nicht gemessen.

## 5 · Messbare Abnahme-Kriterien
| ID | Prüfung | Schwelle |
|---|---|---|
| S1 | kein Ersatzschatten im Szenengraph (Ebene/Decal mit schwarzer Transparenz, `contact-ao`) | 0 Objekte (Ü20) |
| S2 | Schattensaum G6 bei 0,1/0,3/1/6 m, **für den gewählten Filter** (auch VSM) | seamPx = 0, acnePx = 0 |
| S3 | jeder Akteur wirft in Tag/Gold/Nacht | shadowPx > 0 je Akteur und Stimmung |
| S4 | Schattenfarbe = Empfängerrolle | \|Δh\| ≤ 20°, C 0,8–1,15 ×, Tag L\* ≥ 15, kein Pixel C < 0,02 bei L\* < 20 (Ü18/19) |
| S5 | Überlappung `max` | Doppelschatten ≤ 3 L\* dunkler als Einzelschatten |
| S6 | Kontaktton | Stufe 8–12 L\* unter Wurfschatten, Breite ≤ 0,15 × Aufstandsradius, L\* ≥ 15; aus ab Abstand > 0,15 m (Figur) bzw. 0,3 m (Racer) |
| S7 | Teil-Flags | alle festen Teile cast+receive = true; Überzüge cast = false; Prüfung im Szenengraph |
| S8 | Ohr auf Kopf | Sonne seitlich: Ohrschatten auf dem Kopf ≥ N px (aus Referenzbild), Bodenschatten zeigt Ohren (Silhouetten-Vergleich) |
| S9 | Kopf im Kronenschatten | Brauen, Haare, Mund ≈ gleiche Abdunklung wie Haut (±10 %) |
| S10 | keine abgeschnittenen Werfer | Schattenbild vs. Referenz (Nah-Ebene −60 m), Abweichung ≤ 0,5 % Pixel (Befund 1) |
| S11 | Racer-Höhe | Schatten vorhanden bei 0/1/3/10 m (im Sichtfeld), kein Fleck darunter |
| S12 | nicht pixelig, nicht zitternd | Wurfkante ≤ 3 px @1080 (Ü19); beim Orbit wechseln in ruhenden Schattenflächen ≤ 0,1 % Pixel je Bild |
| S13 | Gesicht | L-9 unverändert grün |
| S14 | Leistung | p95-Bildrate auf Georgs MacBook und Desktop, mit/ohne Kaskade |

## 6 · Offene Fragen an WS0/Georg
1. **KayKit-Verlauf in der Farbe:** Behalten KayKit-Assets ihren eingebackenen Hell-dunkel-Verlauf (Konflikt mit M2), oder setzt `kfb_clay_bpy.apply` sie auf flache Rollenfarben, und der Kontaktton entsteht nur zur Laufzeit (mein Vorschlag)?
2. **Kleinteile ohne Wurf:** Dürfen Teile unter 0,3 m (Kiesel, Gras, Sprenkel, Fluff) auf den Schattenwurf verzichten und nur über Einsinken + Kontaktton erden? (Widerspricht V-429 „alle Objekte werfen“.)
3. **Zwei Kaskaden einer Sonne:** Gilt das noch als „ein Rig“ (V-385/V-429)? Ohne sie gibt es entweder abgeschnittene Bäume oder keinen sauberen Ohrschatten.
4. **Filter:** VSM (aktuelle Laufwelt, sehr weich) oder weiche bzw. kontakthärtende PCF (kein Leck am Fuß)? Vorschlag: Bildvergleich an derselben Stelle, Georg entscheidet.
5. **Kontakt-Verdeckung:** Gilt eine einmal berechnete Boden-Verdeckungskarte aus der Draufsicht als „mit Ursache“ (kein Decal)? Und bleibt SSAO/GTAO nur eine Rückfall-Probe?

---

## Quellen
**Register (`git show origin/reg:<pfad>`):**
- `30_DECISIONS/DECISIONS.md`: V-203, V-329, V-342 (5), V-355, V-385, V-386, V-387, V-392, V-417, V-429, V-440, V-447, V-563, V-564, V-565, V-566, V-568, V-570, V-572
- `30_DECISIONS/CANON_3D/CANON_3D_R1.md`: Gebiete 2, 4, 5, 7, 8, 15, 17, §2
- `30_DECISIONS/CANON_3D/CRITIC_3D_R1.md`: K4, Prüfpunkt 7
- `30_DECISIONS/CANON_3D/EINARBEITUNG_WS1_R1.md`: Ü18–Ü20, W3/W4/W7/W13
- `30_DECISIONS/replies/LIGHT_RESEARCH_AUDIT_R1.md`, `LIGHT_MODEL_R2.md` (KayKit-Vorgehen, Regel 9/11)
- `30_DECISIONS/replies/WS1B_SHADOW_DIAG_R1.md` (Befunde 1–3)
- `30_DECISIONS/replies/WS0_CARTOON_TERRAIN_PALETTE_SHADOW_DESIGN_R1_2026-10-19.md`, `WS0_COLOURED_3D_SHADOW_MVP_TRIAL_R1_2026-10-19.md`
- `30_DECISIONS/CANON_3D/sources/LESSONS_SHADOWS.md` (26.09.); `tools/KFB-ToolBox/docs/LESSONS_SHADOWS.md` (29.09.)
- `tools/world_atlas/docs/LIGHT_CONCEPT_S13_3.md` (alle drei Kopien gleich)
- `tools/asset_registry/librarian/_handover/KAYKIT_REFERENCE_ATLAS_2026-09-15/KAYKIT_DEMO_SCENE_LEARNINGS.md`
- `…/KAYKIT_CREATOR_TUTORIAL_RESEARCH_2026-10-10.md`, `…/KAYKIT_LIGHTING_VIDEO_SOURCE_AUDIT_2026-10-10.md` @origin/research/kaykit-creator-tutorial-atlas-2026-10-10
- KayKit-Packdateien `media/3D_Assets/KayKit_Forest_Nature_Pack_1.0_FREE/…`, `KayKit_Dungeon_Pack_1.1_FREE 2/…` (Atlas + glTF, eigene Messung)

**Spiel-Code (lokal, nur gelesen):** `~/kfb-ws1/kfb-planet-t439` @f1d6daf: `src/vendor/light/kfb-stage-light.v1.1.js`, `src/m1/M1World.jsx:211`, `src/look/terrain2.js`, Commit 4f0f774.

**Web:**
- KayKit Medieval Hexagon README: https://github.com/KayKit-Game-Assets/KayKit-Medieval-Hexagon-Pack-1.0
- KayKit Forest / Dungeon (itch.io, Suchtreffer; Seite sperrt Abruf): https://kaylousberg.itch.io/kaykit-forest · https://kaylousberg.itch.io/kaykit-dungeon-pack
- KayKit GitHub-Repos (Liste): https://api.github.com/users/KayKit-Game-Assets/repos
- Kay Lousberg, Godot-Tutorial: https://www.youtube.com/watch?v=Vfr3n4WKsc0 · Patreon (gesperrt): https://www.patreon.com/kaylousberg/posts/updates-recap-169539427
- Bend Studio, Screen Space Shadows: https://www.bendstudio.com/blog/inside-bend-screen-space-shadows/
- three.js PCSS: https://threejs.org/examples/webgl_shadowmap_pcss.html · VSM: https://threejs.org/examples/webgl_shadowmap_vsm.html · CSM: https://threejs.org/examples/webgl_shadowmap_csm.html · GTAOPass: https://threejs.org/docs/pages/GTAOPass.html
- drei ContactShadows: https://drei.docs.pmnd.rs/staging/contact-shadows · AccumulativeShadows: https://drei.docs.pmnd.rs/staging/accumulative-shadows
