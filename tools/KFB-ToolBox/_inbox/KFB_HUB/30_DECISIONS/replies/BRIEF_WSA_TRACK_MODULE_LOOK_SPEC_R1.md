# An WSA · Look-Spezifikation der Strecken-Module aus Joyride (R1, 11.10.2026, V-144/V-134)

Recherche und Spezifikation, **kein Bau, keine Geometrie, kein Lab-src**. Geometrie baut RKIT (Track Core), den Look setzt die Bau-Sitzung im Lab um. Du lieferst die genaue Vorlage, damit niemand erfindet (V-140).

## Auftrag
Für jedes Modul aus Georgs Rundkurs-Baukasten (`replies/REFS_RUNDKURS_2026-10-11/RK2_rundkurs_baukasten.png`) den **J17-Look aus den echten Joyride-Quellen** belegen:
1. gerade → Kreisel bzw. Abzweig
2. geführte Einfädelung (ENTRY)
3. geführte Ausfädelung (EXIT) inkl. Gore-Fläche und Leitwand-Nase
4. innerer Banden-Übergang
5. äußerer Banden-Übergang
6. Bord- bzw. Schulter-Verjüngung
7. Markierungs-Logik (Vorfahrt, gestrichelt, Ausfahrtpfeile; J17 M1/M2, bio-Zonen)
8. Endkappen bzw. Bandenköpfe (J17-Strang-Knetkopf, ROUND_END, END_TAPER)
9. Übergang Strecke → Straße (J14 T4 ZA, J17 transition-atlas, Variante B nach V-104/V-139)

## Je Modul
- Quelle mit Pfad und Zeilen (track-look.v5, stream-to-three.v5, transition-atlas, markings, lab-clay v10, J14/J15/J16/J17-Cuts, TC1).
- Maße in Track-Metern (lab = m × 1,46), Farben als Rollen (Hex nur wenn in der Quelle), Materialschicht.
- Was es in Joyride gibt (1:1) und was nicht. Bei „nicht gefunden in …“ das Such-Protokoll (V-140).
- Ein Ausschnitt aus vorhandenen J17-Bildern als Beleg, falls vorhanden; keine Bildgenerierung.

## Ergebnis
`replies/WSA_TRACK_MODULE_LOOK_SPEC_R1.md` + `track-module-look.json` (Schema-Vorschlag `kfb.track-module-look/1`, Felder passend zu den MODULES-Spalten: id, family, section, edge, frames, look-Quelle, Maße, Farb-Rollen, Markierung). Look bleibt J17 (V-102); die Farben in Georgs Bild zählen nicht.
