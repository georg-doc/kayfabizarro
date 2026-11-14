# Dramatis Personae Web-Kanon R1 · Hunky und Dory · RETURN (WSB, Mac mini, 14.11.2026, V-1743)

**Auftrag (WS0):** derselbe Web-Build wie FB_WEB_KANON_R1 für die wichtigsten Figuren, danach Pause bis zur Abnahme. Geliefert sind Lord Hunky und Lady Dory. Mizzy ist offen (siehe unten).

| Datei (`_privat_kauf_asset/`) | Größe | sha256 (Anfang) | Höhe |
|---|---|---|---|
| `LORD_HUNKY_WEB_KANON.r1.glb` | 4,11 MB | ef1f4ac528b4f54a | 1,188 m |
| `LADY_DORY_WEB_KANON.r1.glb` | 3,57 MB | 0a7ca77d8c41c07d | 1,217 m |

- Beide laden in reinem three.js mit GLTFLoader und MeshoptDecoder, wie die FB-Datei.
- Beide liegen unter 8 MB.
- Der Ursprung liegt zwischen den Füßen, Blick nach +Z.
- Der Spielmaßstab ist übernommen (0,6509 am Wurzelknoten), nichts nachskaliert.

## Was neu ist gegenüber FB
Hunky und Dory haben im Spiel **keine gebackene Knete**. Das Korn entsteht zur Laufzeit im Shader, und ihre UVs taugen nicht zum Backen: Die Kit-Teile haben Paletten-UVs, bei denen jede Fläche auf einem Punkt liegt.

Darum hat der Exporter einen allgemeinen Atlas-Bake bekommen:
1. **Atlas:** Je Figur entsteht ein eigener Atlas mit der Atlas-Funktion des Spiels (`clayBake.buildAtlas`/`splitGeometry`, dieselbe wie bei FBs `clayUv`).
2. **Rendern im Atlas:** Das Spiel-Material selbst wird in diesem Atlas gerendert.
   - Farbe: einschließlich Kit-Palette und Marmorierung.
   - Normale: die Shader-Normale, im Tangentenraum wie beim FB-Atlas.
3. **Ergebnis:** ein Texturpaar je Figur, 2048², als JPEG.

Im Spiel bleibt alles unverändert. Derselbe Weg gibt jetzt auch dem Twin-Jetpack sein Knetkorn; siehe Hinweise.

Weitere Anpassungen:
- **Gesicht:**
  - EyeRig v6 mit E2-Lidhaut, 5 Lid-Morphs wie bei FB.
  - Hunkys Schielwinkel (converge 0,35) bleibt als Ruhedrehung erhalten; der Blick wird darauf gerechnet.
  - Dory hat ein Auge; dessen Knoten tragen die Seite `C`.
- **Mund:**
  - Kopfteil-Decal Satz A (Hunky) bzw. B (Dory), Ruhe `closed`.
  - Einschübe smile, d und oh.
  - Das Decal liegt im Spiel senkrecht gespiegelt (geprüft an der Ruheform), die Einschübe sind ebenso gespiegelt.
- **Clips (29 + Gesicht):** was das Spiel heute für KayKit-Körper spielt, also die `.kk`-Fassungen:
  - `Idle_A`, `Idle_B`, `Walking_B`, `Running_A`, `Running_B`, `Jump_Start`, `Jump_Idle`, `Jump_Land` (WSB_HALTUNG_R1);
  - Ruhe-Pools happy, threat, bored (ML v1 und v2 `.kk`);
  - Gesten winken, zeigen, reden, grüßen;
  - die 8 Flug-Clips aus FLY_CLIPS.
  - Die tief gebeugten Pool-Clips (q669) sind enthalten, solange sie im Spiel-Pool stehen.
- **Größe:** Spiel-Notizen in den Extras der Netze (Originalgeometrie, ca. 6–9 MB) werden entfernt.

## Knoten zum Steuern (Präfix `Hunky_` bzw. `Dory_`)
| Knoten | Was |
|---|---|
| `<P>Auge_L/R_Blick` (Dory: `Dory_Auge_C_Blick`) | Blick, wie bei FB. Bei Hunky liegt eine Ruhedrehung y = ∓0,175 rad (Schielen) darunter. |
| `<P>Lidhaut_L/R` (Dory: `_C`) | Morphs `oben_halb`, `oben_zu`, `unten_halb`, `unten_zu`, `zu` |
| `<P>Mund_closed`, `<P>Mund_smile`, `<P>Mund_d`, `<P>Mund_oh` | genau einer auf Skalierung 1 |
| `<P>Gesicht_Leerlauf` | Gesichts-Clip, 12 s, wie bei FB, dazu oh bei 10,2–10,8 s |
| Skelett Rig_Medium | wie bei FB |

## Prüfung
- **Inhalt** (`data/pruefung.json`): beide ok. Alle Gesichtsknoten vorhanden, 5 Lid-Morphs, 30 Clips.
- **Bildpaare Spiel ↔ Web** (gleiche Kamera und Lichter): mittlere Abweichung je Pixel (0–255, vorn / seitlich / Gesicht):
  - Hunky 2,9 / 2,2 / 3,8
  - Dory 3,1 / 2,6 / 4,7
  - Werte in `data/paar_metrik.json`.
- **Blätter:** `blaetter/D1_hunky.jpg`, `D2_dory.jpg` mit Paar, Clips und Gesicht.
- **Unterwegs behoben:**
  - Spiegel-Karten im Atlas ergaben nach innen zeigende Normalen.
  - Der Stiel bei Hunky war ein offenes Rohr; das Material ist jetzt beidseitig wie im Spiel.

## Blinde Kritik (CRITIC_3D_R1, Figurenabnahme)
Eine Runde: **K4 9 · K6 8 · K10 8, Mittel 8,3 → PASS für beide Figuren.**
- **Ohne Befund:**
  - Körper, Pose, Augen und Mund decken sich mit dem Spiel.
  - Der Blick zieht synchron mit, die Lider folgen dem Blick, kein Auswärts-Schielen.
  - Die Mund-Einschübe sitzen sauber.
  - Keine Durchdringung in den Clips.
- **Hinweise:**
  - Die Kopfunterseite fällt im Web etwas dunkler ab, das Knetrelief am Kopf ist etwas schwächer. Laut Kritiker liegt das unter der Befundschwelle.
  - Das geschlossene Lid zeigt einen Spalt. Das ist die Stellung „zu“ des Spiel-Rigs, wie bei FB; WS0 führt das als Spiel-Punkt.

## Offen
1. **Mizzy:** Im Spiel und im Hub gibt es keine 3D-Figur „Mizzy“. Mizzy ist dort die BNWN-Moderatorin (Videos `40_AUDIO/KFB Shooter Reactions Mizzy/`, Billboard). Welches Modell ist gemeint? Ich baue erst, wenn WS0 die Figur nennt.
2. **Twin-Jetpack:** Mit dem neuen Atlas-Bake bekäme `FB_WEB_KANON_twin` sein Knetkorn ohne Änderung am Spiel. Auf WS0s Ja erzeuge ich r1c.

## Ordner
- `_privat_kauf_asset/`
- `blaetter/`
- `bilder/<figur>/`
- `data/`: Export-Logs, Phase 2, Konfiguration je Figur, Prüfung, Metrik
- `scripts/`: Exporter mit Atlas-Bake, Phase 2 mit Figuren-Konfiguration, Packen, Bilder, Probe; `web/claybake_atlas.js` = gebündelte Atlas-Funktion des Spiels
