# Konzept · Ortsbiografie, Szenen-Komposition und Worldbuilder-Bausatz · WSB · R1 · 2026-10-17

**Status: Vorschlag an WS0 (Georg 17.10. im WSB-Chat).** Ergänzt `SPEC_PLACEMENT_GRAMMAR_R2` und wiederholt keine Regel daraus.
- **Owner:** Laufzeit und Worldbuilder bei WS1/Lab, Blender-Bauteile bei WSB, Freigabe und Reihenfolge bei WS0.
- **Gilt zusammen mit:**
  - V-341 (Bühnen wachsen aus dem Boden);
  - V-396 (Schürze, Einsinken);
  - V-402 (Mesa-Grundrichtung, Bühnenpalette mit Rollen);
  - V-403 (gesprenkelte Übergänge, keine Verläufe);
  - V-404 (3D-Asset-Suche);
  - V-286 und V-305 (Meshy leicht tönen, Eigenbau volle Palette, OKLCH-Harmonie).

## 1 · Georgs Auftrag in einem Satz
Jede Szene erzählt, **wie der Ort entstanden ist, wie er genutzt wird, wie er verfällt und wie er bewachsen wird**. Das geschieht in cartooniger Sparsamkeit: wenige Materialcodes, wenige Signatur-Elemente, Rule of Three. Alles läuft über eine formale Verteilungslogik statt Handplatzierung.
- **Asset-Suche:** proaktiv nutzen, um Lücken und stimmige Ergänzungen vorwegzunehmen, z. B. die Palme etwas weiter weg oder den Übergang zwischen Biomen und Nutzungszonen.

## 2 · Ortsbiografie: vier Schichten, jede mit eigener Quelle und Richtung
Eine Szene wird in dieser Reihenfolge gedacht. Jede Schicht liest die vorige.

| Schicht | Frage | Quelle im Bild | Richtung der Verteilung | Bausteine |
|---|---|---|---|---|
| 1 · Entstehen (Geologie) | Woraus ist der Ort gemacht? | Grundgestein, Sockel, Mesa-Schichten (Cap → Body → Erosion Skirt, V-167) | von oben nach unten, schichtweise | Bühnen-Sockel, Felsen, Schichtkanten |
| 2 · Nutzen (Kultur) | Wer kommt hier wozu her? | Eingänge, Wege, Plätze | entlang der Wege, Abnutzung zur Mitte | Weg-Steine (dicht → Übergang → lose), Trittspuren, Requisiten |
| 3 · Vergehen (Verfall) | Was bröckelt ab, wohin rollt es? | Kanten, Ecken, Vorsprünge | hangabwärts, nach außen kleiner und seltener | Steinkit (Ringbänder §4), Ruinen-Passstücke |
| 4 · Bewachsen (Sukzession) | Was wächst wo zuerst? | Fugen, Schatten, Feuchte, Licht | aus Fugen nach außen: Moos → Gras → Büsche → Bäume weiter weg | Moos-Sprenkel, Gras-Büschel, Fluff-Träger, Palmen/Bäume als Rahmen |

**Regeln, die daraus folgen:**
- **Größe wächst mit der Zeit und dem Abstand.**
  - Moos sitzt in den Fugen der Bühne;
  - Gras im Band 0–2 m;
  - Büsche in 2–6 m;
  - Bäume und Palmen ab ≈ 6 m und nie direkt am Sockel. Sie rahmen die Bühne, statt sie zu verdecken.
- **Jede Schicht nutzt dieselben Operatoren** (`nest`, `stands`, `fall`, `relax`) und dieselben Zahlen: ungerade Mengen, Abstände um ≥ 30 % variiert, Negativraum ≥ 30 %.
- **Übergänge zwischen Biomen bzw. Nutzungszonen sind Sprenkel** (V-403), nie Linien oder Verläufe.
  - In beide Richtungen: Flecken von A wandern in B und umgekehrt.
  - Pflanzen dünnen in Gruppen aus, nicht in Reihen.

## 3 · Materialcodes und Signatur-Elemente (Sparsamkeit)
- **Ein Materialcode je Schicht und Ort:** z. B. Dschungel-Computer = heller Kalkstein + Moos + Lianenholz. Jedes Teil, das wir dazustellen, trägt einen dieser Codes, keinen neuen.
- **Signatur-Element:** pro Zone genau **eines**, höchstens dreimal sichtbar (1 Hero, 2 Echos). Abstände nach Rule of Three, z. B. der Steinstapel oder die Säulentrommel.
- **Farbe:**
  - Meshy-Dioramen werden nur leicht getönt (V-286);
  - alles Dazugestellte (Steine, Pflanzen, Requisiten, Weg-Steine) bekommt die **Bühnenpalette mit Rollen** (V-402):
    - Boden (Boden-Rolle);
    - Steine und Mauern (stone);
    - Holz (bark);
    - Pflanzen (grass/leaf);
    - Fluff (bloom/accent).
  - Die Töne kommen aus `ENV_ROLES` [hell, mitte, dunkel] bzw. `kfb-cartoon-palette.js fromColors(edgePalette)`.
  - Jedes Asset im Set hat dafür eine `role`.

## 4 · Szenen-Komposition mit der Asset-Suche (Ablauf je Diorama)
1. **Ortsbiografie lesen:** Material, Eingänge, Kanten, Licht- und Feuchteseite. Das kommt aus Bühnen-Deskriptor, `edgePalette`, `footprint`, `entrances[]` (vorgeschlagen).
2. **Lückenliste je Schicht:** was fehlt, was wäre die eine stimmige Ergänzung.
3. **Suche** (`3d-assets`):
   - nur Lizenzen mit kommerzieller Nutzung ohne Namensnennung, CC0 bevorzugt;
   - niedrige Polygonzahl bzw. stilisiert;
   - nie Kauf- oder PRO-Pakete in öffentlichen Dateien.
4. **Knete-Übertragung** in Blender: Voxel-Remesh + Glättung, Gruppen Stein für Stein. Dann normiert, Sohle, `role`, `weight`, Lizenzzeile.
5. **Set** je Diorama (`kfb.stage-set/1`, Vorschlag): Liste aus Steinkit-Auswahl + Pflanzen + Requisiten mit Rolle, Gewicht, Band, Signatur-Markierung.
6. **Probe** auf der Knete-Bühne (WSB, Skizze) → Abnahme im Spiel (WS1).
7. **Ablage:** gefundene Assets mit Lizenzangaben ins Repo, über WS0 (V-401: WS0 legt Merge-Anträge an). Kanonisch erst nach Aufnahme in die Asset-Bibliothek (V-404).

## 5 · Worldbuilder-Bausatz (perspektivisch, Georg: „im Worldbuilder haben“)
**Ziel:** Steinübergänge, Wände, Zellenstrukturen und Erhebungen direkt im Worldbuilder modellieren, mit Gizmo und skalierbar, ohne jedes Mal die Asset-Suche zu benutzen.

### 5.1 Stein-Pinsel
- **Werkzeug:** am Bühnenrand bzw. entlang einer Kante „malen“. Die Grammatik (Spec §4) setzt Gruppen aus dem Steinkit.
- **Schieber:** `density`, `spread`, `sinkBias`, `seed`, Band-Breite.
- **Weg-Pinsel** entlang einer Kurve: dicht gepflastert in der Mitte → Übergang → lose Streuung am Rand, aus den drei Quaternius-Gruppen.

### 5.2 Gizmo-Wände (`kfb.wall-kit/1`, Vorschlag)
- **Bauteile:**

  | Art | Teile |
  |---|---|
  | gerade | 1 m, 2 m |
  | Ecken | 90°, rund |
  | Enden | Endkappe, abgebrochen |
  | Sonstige | Pfeiler, Bogen, Treppe, Sockel |
  | Höhenstufen | 1, 2, 3 Lagen |

- **Skalierung:** Teile werden **wiederholt statt gestreckt**, wie ein 9-Slice in 3D. Die Ziegelgröße bleibt in jeder Länge gleich; Ecken und Enden sind feste Stücke.
- **Kanten:** rund und abgefast. Fugen als Mesh-Rillen, keine reine Textur, damit sie im Knete-Licht lesbar sind (wie die Mauerstücke im Steinkit).
- **Grundformen:**
  - CC0-Dungeon- und Burg-Bausätze als Ausgangsformen (Kenney Modular Dungeon/Castle Kit, KayKit Dungeon FREE; liegen im Repo);
  - in Blender in Knete übertragen, Ecken gerundet, dazu Verfalls-Varianten (abgebrochene Oberkante, fehlender Stein).
- **Verfall und Bewuchs:** dieselbe Grammatik. Abgebrochene Enden werfen Steinkit-Gruppen ab, in den Fugen sitzt Moos.
- **WSB baut die Teile** und das Datenblatt (Anschlusspunkte, Raster 0,5 m, Höhenstufen). **WS1/Lab baut das Gizmo.**

## 6 · Vorschlag Reihenfolge (WS0 entscheidet)
1. Steinkit v4 (Kiesel und Weg-Gruppen) fertig, Spec R2 → Register.
2. **Anschluss-Sets** für die bearbeiteten Dioramen: B7 + B8-Bühnen. Jeweils Recherche, Knete, Rolle, Probe.
3. B8 abschließen.
4. Wand-Bausatz R1 (Blender) + Datenblatt.
5. Spec R3 „Ortsbiografie-Schichten“ (formal, mit Zahlen je Schicht) nach Georgs Blick auf die Sets.
