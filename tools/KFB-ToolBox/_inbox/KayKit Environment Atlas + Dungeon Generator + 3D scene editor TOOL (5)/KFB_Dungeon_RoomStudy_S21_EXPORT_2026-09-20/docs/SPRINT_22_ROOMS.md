# Sprint 22 · die restlichen Promoräume

Vertrag vor Code. Reihenfolge nach Georgs Auswahl und nach Erkenntnisgewinn je Raum.

| # | Raum | Vorlage | Was der Raum neu beweist | Risiko |
|---|---|---|---|---|
| 1 | **R07 Grosse Halle** | S07 | grosse Grundfläche, Boden als Raumsprache, Stummelwand mit `wall_endcap`, Falltür-Paar (Rost zu/offen), `floor_tile_big_spikes` als Gefahr | Endcap-Platzierungsregel ist **noch nicht gemessen** |
| 2 | **R08 Vorratskeller** | S08 | Fasslogik und Stapelgrammatik, Holztreppe als Andeutung, Kerzen auf der Mauerkrone | Kerzen auf der Krone brauchen eine gemessene Auflagehöhe |
| 3 | **R09 Zellen** | S09 | `wall_gated` + `wall_corner_gated` als Raumsorte, minimale Möblierung | Gitterblatt auf/zu fehlt als Teil — Abweichung |
| 4 | **R03 Zweigeschossiges Lager** | S03 | zwei Ebenen, Treppe, Brüstung (`barrier`), Galerie | Ebenenlogik aus S13.2 übernehmen, nicht neu bauen |
| 5 | **R05 Schatzkammer** | S05 | Läufer als Blickführung, drei Beutestufen, DG2-C-Vorlage | viel Gold → Durchdringungsprüfung wird eng |
| 6 | **R12 Vier-Räume-Schnitt** | S12 | vier Raumrollen nebeneinander = Rezeptvorlage für den Generator | grösster Umfang, zuletzt |

**Je Raum dieselben Tore:** Grundfläche/Silhouette gegen die Vorlage · Bodenkontakt · 0
Durchdringungen (Requisite↔Requisite und Requisite↔Wand) · Blickfang frei · Abweichungen benannt.

**Nicht in diesem Sprint:** S11 (Mine) und S13 (Taverne) — dort fehlen die Assets
(`docs/PACK_GAPS_DUNGEON_1_1.md`). S06 (Wasser) nur, wenn eine Wasserfläche gebaut werden soll.

## Danach: E2 · Figuren
Erst wenn drei Räume stehen, lohnt der Posing-Teil der Editor-Schicht
(`docs/EDITOR_LAYER.md`, Abschnitt E2). Vorher fehlt die Bühne, auf der eine Figur sitzen könnte.
