# Konzeptblatt · Karten-Räume R2 (Mindspaces) · WS0 · 13.11.2026 (Vorlage CANON_3D/KONZEPTBLATT_R1.md, V-563)

Warnung V-561: Szenen-Dioramen fielen durch, weil sie auf Messwerte hin gebaut waren statt auf eine Bildidee. Erst dieses Blatt, dann bauen.
Quelle (wörtlich, Georg 13.11.): „begehbare 3D-Räume mit optischen Illusionen … mindestens einen weiteren Ausgang … innen und außen … Escher-mäßig … Dungeon Generator … Gewölben und Säulen und Treppen“.

| Feld | Inhalt |
|---|---|
| `one_sentence` | Dieser Raum zeigt eine Karte, die man betreten hat und die innen größer ist als außen, weil das Kartenbild selbst zu Wänden, Boden und Decke geworden ist; der Spieler soll zuerst den zweiten Ausgang sehen. |
| `story` | Wer eine KFB-Karte berührt, fällt in ihr Bild. Drinnen geht es weiter in die nächste Karte; an manchen Stellen kippt die Schwerkraft und die Wand wird zum Boden. Gefühl: neugierig, leicht schwindelig, nie bedroht. |
| `image_idea` | Ein Raum aus Kartenbild, hinten leuchtet der nächste Ausgang, an der rechten Wand läuft ein Weg hoch und wird zur Decke. |
| `focal` | Fokus = Ausgang (Portal-Rahmen). Blick: Portal → Escher-Weg an der Wand → Raumtiefe. |
| `space` | Vorne: Boden mit Kartenbild-Rand und Eintrittsportal. Mitte: Raumvolumen, ein Escher-Übergang. Hinten: zweiter Ausgang. Negativraum: Raummitte frei (man soll laufen können). Wertstruktur: Kartenbild mittel, Portal hellster Wert, Ecken dunkel. 70/20/10 = Kartenbild-Flächen / Architektur-Kanten (Rahmen, Säulen) / Portal. |
| `palette_roles` | Wände, Boden, Decke: Kartenbild bzw. HyperNorm-Bild unverändert. Gewölbe-Stein, Säulen, Stufen: Stein-Ton aus `kfb-cartoon-palette` (Biom der Karte), Schatten-Familie `shadow`/`deepShadow`/`edgeAccent` des Bioms. Akzent: Portal-Rand, führt zum Fokus. 60/30/10 = Bild / Stein / Portal. |
| `color_script` | Stimmung aus dem Deck (Tags `kfb-themen-tags.r1.json`). Terrain = Kartenbild. Sekundär = Stein. Akzent nur am Portal (Ausgang). Verboten: Neon-Glühen auf Flächen, Graustufen-Stein, neue Farben über dem Kartenbild. Licht: das eine Rig (V-385), weich, Raum leicht dunkler als die Welt. |
| `form_dna` | Grundformen: Quader-Raum, Rundbogen, Zylinder-Säule. Sekundär: Stufe, Portal-Rahmen. Verboten: spitze Kristall- und Splitterformen. Kanten: weich gerundet (Knete). Unregelmäßigkeit: leicht schiefe Wände, Bögen nie perfekt symmetrisch. |
| `life_anchor` | Das Kartenbild atmet leicht (langsame Bewegung im Bild bzw. HyperNorm-Video), der Portal-Rand pulsiert im Takt des Betts; Schritte klingen nach dem Boden. |
| `material_codes` | (1) Kartenbild-Fläche: ganze Wand, unverändert, Bewegung nur im Bild. (2) Gewölbe-Stein: Bögen und Säulen in ungeraden Gruppen, ruhig. (3) Portal-Rand: ein Ring je Ausgang, pulsiert. |
| `biography` | Entstehen: das Kartenbild faltet sich zum Raum. Nutzen: Durchgang zur nächsten Karte. Vergehen: Ränder des Bilds lösen sich zum Portal hin auf. Signatur: 1 Hero (Ausgang), 2 Echos (Escher-Weg, Gewölbe-Bogen). |
| `groups` | (a) Eingang: Portal + Bodenrand (Ortsgrund: Kante). (b) Escher-Stelle: Weg an der Wand (Ortsgrund: Wand). (c) Ausgang: Portal + Bogen (Ortsgrund: Landmarke). Gewölbe-Variante zusätzlich (d) Treppe mit Podest (Ortsgrund: Hang). |
| `story_beat` | Eintreten → umsehen → Escher-Weg gehen → Ausgang → Übergang in den nächsten Raum (Musik und Bett blenden über). |
| `cast` | Spielfigur FrizzleBob (cast `frizzlebob`) mit KFB-Augen, Knete; sonst keine Figuren. |
| `cameras` | die 4 festen Kritiker-Kameras (`CRITIC_3D_R1.md`) + Lauf-Kamera hinter der Figur. |
| `reference` | (1) zwei KFB-Kartenbilder aus `media/kfb` als Raumhaut; (2) ein HyperNorm-Standbild (H15); (3) M. C. Escher „Relativity“ als Prinzip der kippenden Schwerkraft (nur Idee, kein Nachbau). |

**Prüffragen:** Geschichte erklärt jedes Element (Portal, Escher-Weg, Gewölbe) – ja. Bildidee aus der Lauf-Kamera lesbar – Ausgang muss beim Eintreten im Bild sein. Echter Boden – Raumboden ist begehbare Geometrie, keine Scheibe. Quelle 1:1 – Georgs Satz oben.
