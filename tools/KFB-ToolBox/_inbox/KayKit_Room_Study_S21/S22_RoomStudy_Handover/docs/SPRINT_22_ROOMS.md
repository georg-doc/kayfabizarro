# Sprint 22 · die restlichen Promoräume

Vertrag vor Code. Reihenfolge nach Georgs Auswahl und nach Erkenntnisgewinn je Raum.

**Stand 2026-09-22:** #1 R07 **gebaut und abgenommen**. #2 R08 **abgebrochen, nicht abgenommen**
(Postmortem `docs/POSTMORTEM_R08_S22.md`, drei Fail-Runden) — kein weiterer Rezept-Freihand-Versuch
für diesen Raum, bis der zentrale 3D-Editor für Handplatzierung steht (Deliverable notiert, noch
nicht gebaut — siehe Postmortem). #3 R09 **gebaut** — einfacher, geschlossener Zellenblock statt
der versetzten Drei-Zellen-Vorlage, 0 Überlappungen, Abweichungen benannt. Weiter mit #4 R03.

| # | Raum | Vorlage | Was der Raum neu beweist | Risiko |
|---|---|---|---|---|
| 1 | ~~**R07 Grosse Halle**~~ **fertig** | S07 (= Packbild `Dungeon_sample6.png`) | grosse Grundfläche, Boden als Raumsprache, zwei Stummelwände mit `wall_endcap`, zwei T-Knoten, Innenecke | erledigt: Endcap-Regel gemessen |
| 2 | ~~**R08 Vorratskeller**~~ **abgebrochen** | S08 (= `Dungeon_sample7.png`) | drei echte Ecken statt einer Bühnen-Ecke, `wall_doorway_sides` als freistehender Pfeiler, Fasslogik | nicht abgenommen — Postmortem, kein weiterer Freihand-Versuch |
| 3 | ~~**R09 Zellen**~~ **gebaut** | S09 | `wall_gated` als Raumsorte, minimale Möblierung, EIN offener Zellenblock statt Trennwand (Motor-Grenze: nicht halbierbare Teile zwischen zwei Knoten) | erledigt — 0 Überlappungen, `wall_corner_gated` nicht verwendet (keine Ecke ist Gitter+Gitter), Abweichungen benannt |
| 4 | ~~**R03 Zweigeschossiges Lager**~~ **nicht abgenommen** | S03 | zwei Ebenen ohne generierten Grundriss (`boden.ober` + `props[].level`, `kit.HUB` jetzt korrekt gemessen), `fest`-Flag gegen Entzerrer-Verzug | **Brüstung/Treppe falsch** — nie isoliert angesehen (Regel R4, `docs/POSTMORTEM_S22_CONSOLIDATED.md`) |
| 5 | **R05 Schatzkammer** | S05 | Läufer als Blickführung, drei Beutestufen, DG2-C-Vorlage | viel Gold → Durchdringungsprüfung wird eng |
| 6 | **R12 Vier-Räume-Schnitt** | S12 | vier Raumrollen nebeneinander = Rezeptvorlage für den Generator | grösster Umfang, zuletzt |

**Je Raum dieselben Tore:** Grundfläche/Silhouette gegen die Vorlage · Bodenkontakt · 0
Durchdringungen (Requisite↔Requisite und Requisite↔Wand) · Blickfang frei · Abweichungen benannt.

**Aus R03 mitzunehmen (S22):**

- `kit.HUB` war bis hierhin auf `WALL_H` aliasiert (Wandhöhe) — früher unbemerkt, weil kein Raum
  zwei Ebenen hatte. Jetzt gemessen aus `stairFrame(stairs_wood)`, wie in
  `docs/HANDOFF_dungeon_S13.md` verlangt (4,05 ≠ 4,00 Wandhöhe).
- Eine Galerie braucht keine eigenen Wände, wenn die Bühnenwände schon hoch genug sind — nur
  eine Brüstung an der offenen Kante. Das hat den Umfang klein gehalten (`boden.ober` +
  `props[].level`, keine zweite Fugen-/Knoten-Ebene nötig).
- Wandrequisiten (`p.wand`) kennen weiterhin nur die Erdgeschosswand — eine Vitrine/ein Regal AUF
  der Galerie ist damit nicht darstellbar, benannt statt ersetzt.

**Aus R09 mitzunehmen (S22):**

- Eine Trennwand zwischen zwei 1-Modul-Zellen erzeugt einen T-Knoten (Schenkel 2,0), der das
  angrenzende `wall_gated`/`wall_doorway`-Modul frisst oder überlappt — nicht halbierbare Teile
  brauchen mindestens EIN volles, knotenfreies Modul auf jeder Seite. Erster Entwurf (w=2,h=2,
  mit Trennwand) ist daran gescheitert; Fix war eine grössere Grundfläche OHNE Trennwand.
  `wall_corner_small` (Schenkel 0,76, unter der Fress-Schwelle) lässt Randmodule ganz — bei
  gemischten Ecken (nicht alle gleich) ist das oft die einzige durchgängig sichere Wahl, weil
  der Motor nur EINEN Eckteil-Typ pro Raum kennt.
- Blickfang durch ein Gitter ist naturgemäss nie 100 % frei (die Stäbe selbst zählen als
  Verdecker) — die Prüfzeile meldet das korrekt, ist aber kein Fehler bei einem Zellenraum.

**Aus R08 mitzunehmen (Postmortem, S22):**

- Ein Bauteil mit eigener Laufrichtung (Treppe, Bank, Regal) bekommt IMMER ein 90°-Vielfaches und
  einen Wandanker — nie eine frei geschätzte Rotation "die am Bild richtig aussieht".
- Jede `auf`-Platzierung (Requisit auf Requisit) braucht denselben Blick wie eine Wandrequisite:
  gemessene Oberkante der Unterlage, sichtbare Lückenprobe vor dem Screenshot — nicht die
  Koordinate raten und hoffen.
- Drei Korrekturrunden für denselben Raum sind ein Signal, keine Serie von Einzelfehlern: beim
  zweiten Fund derselben Fehlerart (hier: geschätzte statt gemessene Position) anhalten und die
  Methode korrigieren, nicht nur den einen gemeldeten Fund.

**Aus R07 mitzunehmen (S22):**

- Die Nummern des Atlas sind **nicht** die Nummern des Packs: Atlas `sNN` = `Dungeon_sample(NN−1).png`.
- Brennweite ist ein Messwert. Laufen die Seitenwände im Nachbau sichtbar zusammen, in der
  Vorlage aber nicht, ist `fov` zu gross — nicht die Kamerahöhe falsch.
- Jede nicht halbierbare Öffnung (`wall_doorway`, `wall_gated`) braucht eine **volle** Fuge
  zwischen zwei Knoten. Das bestimmt die Grundfläche mit.
- Das Falltür-Paar (`floor_tile_*_grate` ⇄ `_open`) und `floor_tile_big_spikes` sind aus R07
  **herausgefallen**: in Bild S07 kommt beides nicht vor. Sie gehören nach R09 (Zellen) oder in
  einen eigenen Gefahren-Raum — nicht in einen Nachbau, der sie nicht zeigt.

**Nicht in diesem Sprint:** S11 (Mine) und S13 (Taverne) — dort fehlen die Assets
(`docs/PACK_GAPS_DUNGEON_1_1.md`). S06 (Wasser) nur, wenn eine Wasserfläche gebaut werden soll.

## Danach: E2 · Figuren
Erst wenn drei Räume stehen, lohnt der Posing-Teil der Editor-Schicht
(`docs/EDITOR_LAYER.md`, Abschnitt E2). Vorher fehlt die Bühne, auf der eine Figur sitzen könnte.
Stand: **drei** abgenommene Räume (R02, R07, R09) — R08 zählt nicht (abgebrochen).
