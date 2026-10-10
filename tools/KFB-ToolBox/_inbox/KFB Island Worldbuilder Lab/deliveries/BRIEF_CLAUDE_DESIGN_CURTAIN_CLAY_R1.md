# Claude Design · KFB Theatre Curtain im Claymation-Look R1

Du gestaltest den **Look** des KFB-Theatervorhangs samt Bühne neu. Technik und Vertrag des Vorhangs bleiben, wie sie sind. Der Vorhang kommt in den MVP „Drive Loop“ zunächst unverändert, dein Ergebnis ersetzt dann nur den Stil.

## Warum

Der heutige Vorhang ist durch seine Vorlage pseudorealistisch geworden: Samt, Stein-Architekturrahmen, „alte Bühne“. Georg wollte von der Vorlage nur den **realistischeren Faltenwurf**. Alles andere soll **Diorama und Claymation** sein: handgebaut, cartoonig, mit Alter und Gewicht.

## Bestand (nicht neu bauen, sondern umgestalten)

- Repo `georg-doc/kayfabizarro`, `main`, `tools/KFB-ToolBox/_inbox/KFB Theatre Curtain Recovery Board/KFB_THEATRE_CURTAIN_RECOVERY_SESSION_2026-10-07/…/KFB_THEATRE_CURTAIN_RECOVERY_CLAUDE_DESIGN_2026-10-07/`:
  - `CURTAIN_MODULE_CONTRACT.md`: Schnittstelle; bleibt unverändert;
  - `candidate/kfb-curtain-core.js`, `kfb-curtain-host-demo.js`, `standalone.html`: aktueller Kern mit Cloth-Animation;
  - `MATERIAL_LOOK_STUDY.md`, `KEEP_TUNE_REJECT.md`, `FAIL_ANALYSIS.md`: was schon versucht wurde;
  - `donor/KFB Theatre Curtain v2.html`: Donor.
- Vorlage des Faltenwurfs: `tools/KFB-ToolBox/_inbox/KFB Elisa B-Day Reference+Mockups/CURATIN-THREE-js - old-stage-red-curtains-…webp`. Daraus **nur** die Faltenstruktur, nicht den Realismus.
- Einsatz im MVP: `skills/chat/workflows/KFB_PLAYABLE_MVP_CONSOLIDATION_V1_2026-09-21/CURTAIN_CHARACTER_SELECT_MVP_2026-10-04.md` (Character Select bzw. Übergang).
- Knet-Look:
  - Clay K2 bzw. v10;
  - KFB-Mauerwerk-Familie A (rund, Knetstein; RKIT);
  - Knetfleck-Übergang `kfbBlend`;
  - Rubbel-Grammatik (`docs/SPEC_EDGE_RUBBLE_GRAMMAR_R1.md` im KFB Island Worldbuilder Lab).

## Weltlogik zuerst (§00 der KFB-Regelwerke)

**Wer hat diese Bühne gebaut?** Ein Diorama-Bastler, ein Stop-Motion-Artist oder die KayKit-Figuren selbst, aus Brettern, Stoffresten und dem, was da war. Jede Entscheidung folgt daraus: leicht schiefe Bretter, sichtbare Nägel oder Dübel, geflickte Stellen, ein Vorhang, der schon viele Vorstellungen hinter sich hat.

## A · Vorhang (Stoff)

- **Faltenwurf:** realistische Struktur bleibt (schwere, tiefe Falten), die Oberfläche wird Knete bzw. Filz statt Samt-Glanz.
- **Alter und Gewicht:** abgegriffen an den Kanten und auf Greifhöhe, ausgeblichene Bahnen oben, dunklerer Saum unten. Ein paar **Decals**, die trotz Cloth-Animation mitlaufen: Flicken, Flecken, Staub, abgewetzte Stellen, eine lose Quaste. Sie liegen im UV-Raum des Stoffs, damit sie mit der Falte gehen.
- **Schwere sichtbar machen:** Saumgewicht bzw. dicker Saum, träge Bewegung, kein flatternder Seidenstoff.
- **Oben der geschwungene Schmuckvorhang** (Valance bzw. Swag): cartooniger, dickere Wülste, Quasten als Knetkugeln.

## B · Bühne (Holz in Knete)

- **Bodenbretter** als Claymation-Modellierung: vorne klar als einzelne Bretter erkennbar, mit cartoonig gerundeten Ecken, leichten Höhenversätzen, Fugen und sichtbarer Holzmaserung als Knet-Ritzung.
- Vorderkante mit sichtbaren Brettenden, eine Planke steht leicht über, ein Flicken-Brett in anderem Ton.
- **Material:** aus vorhandenen Assets ableitbar (KayKit bzw. Tiny Treats Holzteile, Dungeon-Bretter), umgeformt im Knet-Look. Nichts Fremdes ohne Clay.

## C · Rahmen (Proszenium, Säulen)

- Statt Stein-Ornament-Architektur: **handgebauter Diorama-Rahmen.** Gedrechselte bzw. gestapelte Säulen aus Holz oder Knetstein (Mauerwerk-Familie A), gerundet und leicht schief.
- Ein Bogen oder Querbalken oben, vielleicht ein gemaltes Schild in Cartoon-Art. Rampenlichter als Knet-Laternen.
- Proportionen dioramenhaft: etwas gedrungen, übergroße Details, klare Silhouette.

## Lieferung

- Look-Tafeln: Vorhang geschlossen, halb offen, offen; Bühne nah; Rahmen gesamt.
- Umsetzung **innerhalb** `CURTAIN_MODULE_CONTRACT.md`: Material, Decals, Geometrie von Bühne und Rahmen. Cloth-Kern und Steuerung unverändert.
- Performance: Decals ohne zweiten Renderpfad, Stoffauflösung wie heute oder geringer.
- Kurz notieren, was aus `MATERIAL_LOOK_STUDY` und `KEEP_TUNE_REJECT` übernommen bzw. verworfen ist.

## Nicht machen

- Kein Samt-Realismus, kein Stein-Ornament, keine dunkle Opern-Ästhetik.
- Den Modul-Vertrag und die Cloth-Simulation nicht umbauen.
- Keine neuen Figuren oder Bühnenhandlung; nur Look.
