# SPRINTPLAN · R2D → MVP-Slice · Stand 2026-10-03

Ein abgegrenzter Slice je Lauf (WORKFLOW.md). Jeder Sprint endet mit Bild-Abnahme durch Georg.

## S1 · Scholle v7 fertig (Bank)
- Einen Benchmark von Hand isoliert bauen, mit Seitenansicht: A Leuchtturm oder E Strand. Danach die übrigen 7 als Abwandlung.
- Knete-Material v10 in der Bank (gleiche Oberfläche wie Bäume und Insel).
- Unterkontur (Zackenfolge) als zweites Maß neben dem Profil anzeigen. Keine automatische Nachführung.
- **Abnahme:** Georg nimmt mindestens 1 Benchmark-Nachbau am Bild an. Bauzeit < 20 ms je Insel.

## S2 · Scholle in die Insel
- Modul K aus INSEL_BAUSTEIN: Oberseite mit echtem Höhenfeld, Rand, Felskörper als ein Mesh. Ersetzt `buildBody()` v6 und die Unterseiten-Schleife in `island.js`.
- Kantenhöhe folgt dem Gelände. Straße und Brückenköpfe schneiden sauber an der Kante.
- **Abnahme:** keine Nähte, keine Durchstöße (Draufsicht und Unterseite), Biom-Wechsel < 2 s.

## S3 · Biome auf der Scholle + Gebäude rund
- `BIOMES.under` → Scholle-Parameter je Biom (Utopia bauchig, Dystopia zerklüftet, Schnee mit Eisband).
- Gebäude: rundere Knete ohne Zerreißen. Weg ist entweder verschweißen plus sanftes Glätten nur der Außenhülle, oder ein B2-Fassaden-Owner. Vorher fragen.
- Protopia im Bild prüfen.
- **Abnahme:** 5 Biome nebeneinander (Vergleich), Gebäude passen zum Knet-Look.

## S4 · Wasser (wartet auf WSA)
- Eingang: Fluid-Shader aus Card Lab v2 (`BRIEF_WSA_FLUID_SHADER.md`). Konzept: `WATER_CONCEPT.md` (U-Bett im Gelände-Mesh, Gefälle, Wasserfall mit Volumen).
- **Abnahme:** ein Bach mit Wasserfall auf einer Insel, liest sich als fließend.

## S5 · MVP-Slice Zusammenschau
- 3 Inseln mit Brücke, Kreuzung und Kreisverkehr aus dem Track Core.
- Figuren aus dem Register, lazy und manifest-getrieben. Portal-Plätze als Hub-Stationen.
- Optional der Joyride-Knetstrang als Straßenlook (`BRIEF_WSA_KNETSTRANG_BAUSTEIN.md`).
- **Abnahme:** Georg fährt und läuft über die drei Inseln, fps auf seinem Gerät gemessen.

## Abhängigkeiten
WSA: Fluid-Shader (S4), Knetstrang als Funktion (S5 optional), Check-in dieses Cuts (vor S1, damit Pins stabil sind).
