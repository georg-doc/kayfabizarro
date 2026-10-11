# C · Licht-Studie / bestehender KFB-Rig · 11.10.2026

Status: **SOURCE_VIDEO_OBSERVED + READ_ONLY_KFB_SOURCE_AUDIT + PROPOSAL**, kein neuer Lichtrig und keine Lab-Lieferung.
V-050 Abend TUNE, V-051 Insel-Thema, V-053 Clay, V-011 weiche Übergänge, V-122 Plan/Owner bleiben maßgeblich.

## 1. Creator-Tutorial jetzt tatsächlich beobachtet
Primärquelle: [Kay Lousberg – Basic Environment and Lighting Setup in Godot](https://www.youtube.com/watch?v=Vfr3n4WKsc0). Englische zeitmarkierte Untertitel exportiert;9 echte Bildstichproben geprüft. Originalvideo, vollständige Untertitel und Aufnahmen werden nicht öffentlich re-hosted. C_VIDEO_FRAME_CAPTURE.json enthält tatsächliche Zeiten, Dateihashes, Werbeausschluss und Grenzen.

| Tatsächliche Zeit | Beobachtung |
| --- | --- |
| 2:24 | Directional-Light-Platzierung und Schatten |
| 7:20 | Ambient getrennt vom Hintergrund |
| 9:16 | SSAO am Gebäudekontakt |
| 13:44 | Hintergrund mit dezenter Fog-Staffelung |
| 16:46 | Kontrastvergleich desselben Motivs |
| 19:19 | Andere Farb-/Atmosphärenstimmung |
| 23:37 | Dunkle Nachtfassung, Emissionsmaterial |
| 25:00 | Warme Fenster plus lokale Lichtwirkung |
| 28:10 | Innenraum, lokale/Flächen-Beleuchtung |

Nachprüfbare Einzelwerte: Ambient Energy0.75 im Inspector7:20 (Untertitel lassen die Dezimalstelle unklar); SSAO Intensity2.0 bei9:16,3.0 bei13:44; AreaLight Energy8.0 bei28:10. **Godot-Werte, keine Three.js-Kalibrierung.**
Der Transfer: Kontakttrennung, lesbarer Vordergrund, abgestimmter Hintergrund/Fog, Nacht durch kontrollierte Farbe und lokales Licht. Emission allein ersetzt keine Ausleuchtung angrenzender Flächen. Innenräume brauchen andere Lichtverteilung als Außenräume.
Nicht jedes angeforderte Seek wurde getroffen; tatsächliche Zeit im Beleg gilt. Werbebilder sind kein Tutorial-Beleg. Kein vollständiges „alle Einstellungen“ oder portierter Shader behauptet.

## 2. Drei getrennte Quellenebenen
- **Creator:** obere Tabelle und primäres Video; keine Godot-Zahl als Lab-Sollwert.
- **KFB-Goldstandard:** J17-Pixel/Code aus D_JOYRIDE_GOLD; Slate-Blue/Orange nach V-102, Material/Licht gemeinsam vergleichen.
- **Aktueller Receiver:** read-only lokale Lab-Dateien src/world/light.ts, src/sky/sky.ts, day-night.js, sky-presets.js mit Hashes in C_SOURCE_SNAPSHOTS.json. Lokaler Snapshot ist Codebeobachtung, keine zusätzliche GitHub-/Georg-Abnahme.

Der bestehende Atlas hatte keinen zugänglichen Videoframe/Transkript. Diese konkrete Eingabelücke ist jetzt geschlossen; alle anderen ungesehenen Videos bleiben ungesehen.

## 3. Zahlenbasis für den bestehenden Owner
### J17 Vergleichsrig (aus tatsächlichem Source-Code)
track-look.v5.js:126–129,442:
| Rolle | Farbe / Stärke / Herkunft |
| --- | --- |
| Sonne | #fff4e6 /2.9 |
| Hemisphere sky/ground | #eef4fa /#9a8a78 /1.05 |
| Gegen-/Fill-Licht | #ffe6d6 /.6 |
| Sonnenrichtung relativ zum Ziel | (-160,260,120); daraus Elevation52.43°, Azimut−53.13° ab+Z berechnet |
| Ausgabe | sRGB + ACESFilmicToneMapping |
| Source shadow | PCFSoft,4096; alte feste Bias-Werte sind **kein** universeller KFB-Sollwert |

Die Winkel sind Berechnung aus Code, keine Pixel-Schätzung. Source-Stärken bleiben r160-Snapshot; Lab r186 braucht bestehenden Parity-Vergleich.

### Aktiver Lab-/SKY3-Weg, kein zweiter Rig
src/sky/sky.ts verwendet einen EnvironmentHost; day-night schreibt Fog/Hintergrund und gibt Werte durch light.skyRig an den bestehenden Rig weiter.
Im aktiven Pfad schreibt **kein zusätzliches Studiolicht pro Figur**. Das klassische makeWorldLight.refresh-Profil vor Sky-Übernahme ist vom anschließenden SKY3-getriebenen Zustand zu unterscheiden.
Source-Adaptermaßstab: key = world/5, hemi = ambient/1.75, fill = world*.375/1.75; Source-Basis world2.4/ambient1.25.
Bei unveränderten Defaults ergeben sich:
| Zeit | Key | Hemi | Fill | Quelle |
| --- | --- | --- | --- | --- |
| Tag |2.4 |1.25 |.9 | DAY_PRESET×bestehender Adapter |
| Abend |1.68 |.6714 |.45 | EVENING_PRESET×Adapter |
| Nacht |.6 |.4464 |.3214 | NIGHT_PRESET×Adapter |

Diese Werte sind **aus gelesenen Defaults abgeleitet**, nicht live gemessene Reglerwerte. Preset-Farben bleiben im bestehenden SKY3-Modul; aktuelle Overrides können andere Werte ergeben. Lab-Ausgabe nach Sky-Owned-Pfad NeutralToneMapping, Exposure aus bestehendem State.
Lab-Key-Direction(-120,180,90) ergibt50.19° Elevation/−53.13° Azimut. Das ist die beobachtete Richtung des Receivers, nicht ein Creator-Kamerawert.

## 4. Empfohlenes Vorgehen für Tag / Abend / Nacht / Innen
**Empfehlung = Source-basierte Prüfkonfiguration, keine neue Abnahme.**
- **Tag:** vorhandenes SKY3-day und den bestehenden Adapter als Ausgangspunkt behalten. Warme Key-Seite, kühler Sky-Fill und Boden-Bounce müssen Source-Farbe/Clay lesbar halten. J17 im Vergleich aufnehmen; keine neue feste Globalfarbe setzen.
- **Abend:** vorhandenes evening plus weiche Übergänge, Geometrie/Material/Objekt-IDs unverändert. V-050 „zu orange/dunkel“ ist TUNE: erst Fokus-/Haut-/Fahrbahnlesbarkeit gegen Tag prüfen, nicht eine gesamte Insel erneut einfärben.
- **Nacht:** vorhandenes night/EnvironmentHost, Source-Glow-Materialien gezielt anmelden und bestehende lokale Pools nutzen. Licht sitzt an Quellen/Arbeitsorten; Schatten und Kontrast bleiben kontrolliert. Nicht nur Exposure senken und keine unbenannte Dauerlampe hinzufügen.
- **Innen:** gleiche Environment-Ownership, lokal geführter Vergleich an einem echten vorhandenen Raum. Gezielte Lichter an Fenster/Kerze/Tor statt Sonnenprofil pauschal abdunkeln. Warmes Tätigkeitszentrum und dunklere angrenzende Zonen lesbar halten; späterer Receiver entscheidet über Technik.
- **Story-Modes:** storyTint bleibt leichte Modifikation des Insel-Themas (V-051), keine zweite Palette/Lichtverwaltung. Himmel-/Atmosphärenton und Source-Lichtfarbe nicht wahllos gemeinsam drehen.
- **Hintergrund:** vorhandenen Himmel/Fog passend zu Sichtweite/Ort einsetzen. Hintergrundstaffelung und DOF aus Creator-Promo sind kein Freibrief, spielrelevante Wege/Bewegung zu verwischen.

## 5. Kontakt und Kosten sind Teil des Looks
Aktuelle gemeinsame Regel: main/tools/KFB-ToolBox/docs/LESSONS_SHADOWS.md@fb0e1398f411889015f664bb924aad124f2a554e.
Fit caster/receiver, enge near/far, texel-relative Normal-Bias und Texel-Snap. Keine universellen Literalwerte wie Source0.3 oder alter0.9-Bias übernehmen. Helle Fuß-/Dachbänder prüfen auch Geometrie/Normalen, nicht als „Clay-Highlight“ verkaufen.
Source-Lab benutzt2048 als Default und texel-abhängigen Bias; das ersetzt keine aktuelle Kosten-/Bildprüfung.
Lokale Source-Pools sind begrenzt (world/light.ts:6 Torches, ergänzender Tunnelpool4). Die lokale Lichtpopulation des Godot-Beispiels ist kein KFB-Budget.

## 6. Konkrete spätere Vergleichsprüfung (Research-Eingang)
Auf derselben echten Szene: dieselben source-treuen Figuren/Props, Kamera und Geometrie, je Tag/Abend/Nacht/Innen. Nach V-060 keine Figuren-Skalierung.
Erst Nah-/Spiel-/Fernansicht: Gesicht, Hand/Requisite, Fußkontakt, dunkle Seite, Terrain-/Track-Kante, helle Source-Farben und Glow-Umgebung.
Lichtpass isolieren: unveränderte Material-/Relief-Parameter; danach Materialpass isolieren: unverändertes Licht. Kosten unter echter Ziel-GPU prüfen und tools/parity vor Lab-Lieferung.
Hier: keine neuen Lab-Render/Runtime-/Performance-/Paritätstests, keine neue Licht-Abnahme, keine neuen Goldens. B-Inselvergleich bleibt bis zum privaten Screenshot-ZIP ausstehend.

