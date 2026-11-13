# Konzeptblatt · Card Dungeon R0 (ein Raum mit Begegnung und Karten) · WS0 · 13.11.2026 (Vorlage CANON_3D/KONZEPTBLATT_R1.md, V-563)

Warnung V-561: Szenen fielen durch, weil sie auf Messwerte hin gebaut waren statt auf eine Bildidee. Erst dieses Blatt, dann bauen.
Quelle (wörtlich, Georg 13.11.): „im Zentrum eines (zerstörten) hypernorm-viertels den eingang/tunnel / einfahrt zum dungeon setzen … jeder raum 1-4 karten … nach "clearen" des raums mit schatztruhe oder floating card pickup gesammelt“.

| Feld | Inhalt |
|---|---|
| `one_sentence` | Dieser Raum zeigt einen Kartensaal unter dem zerstörten Viertel, in dem die Wesen von Hunky & MiB die Karten bewachen, weil das System sie dort weggesperrt hat; der Spieler soll zuerst die bewachte Karte und den Ausgang dahinter sehen. |
| `story` | Unter jedem HyperNorm-Viertel liegt das Archiv des Systems. Wer die erste Kartenseite oben befreit, findet den Tunnel nach unten. Unten bewachen Würfelmonster, Spielzeugsoldaten und Papp-Slops die Karten; man kämpft oder heilt sie, dann gibt der Raum seine Karten frei. Gefühl: mutig, verspielt, ein bisschen unheimlich, nie grausam. |
| `image_idea` | Ein Gewölbesaal, an den Wänden riesige Kartenbilder des Decks, in der Mitte zwei Würfelmonster mit roten Glühpupillen vor einer Truhe, hinten leuchtet der Durchgang. |
| `focal` | Fokus = Truhe bzw. schwebende Karte (Belohnung). Blick: Monster → Truhe/Karte → Ausgang. |
| `space` | Vorne: Eingang mit Boden-Rand und Portal. Mitte: Kampffläche frei (Negativraum zum Laufen und Ausweichen), 2–3 Deckungen. Hinten: Ausgang. Wertstruktur: Kartenwände mittel, Belohnung und Ausgang hellste Werte, Ecken dunkel. 70/20/10 = Wände / Architektur-Kanten (Bögen, Säulen) / Belohnung + Ausgang. |
| `palette_roles` | Wände, Boden, Decke: Kartenbild bzw. HyperNorm-Bild unverändert (wie Kartenraum R2). Gewölbe-Stein, Säulen, Deckung: Stein-Ton aus `kfb-cartoon-palette` (Biom des Viertels), Schatten-Familie des Bioms. Akzent: Glühpupillen, Truhen- und Kartenglanz, Ausgang. 60/30/10 = Bild / Stein / Akzent. |
| `color_script` | Stimmung aus dem Deck (`kfb-themen-tags.r1.json`). Verboten: Neon-Flächen, Graustufen-Stein, neue Farben über dem Kartenbild. Licht: das eine Rig (V-385), Raum dunkler als die Welt, die Belohnung trägt das hellste Licht. |
| `form_dna` | Grundformen: Quader-Saal, Rundbogen, Zylinder-Säule. Sekundär: Truhe, Deckungsblock, Portal-Rahmen. Verboten: spitze Kristall- und Splitterformen. Kanten weich gerundet mit Ruinensteinen am Fuß (V-754). Unregelmäßigkeit: Bögen nie perfekt symmetrisch. |
| `life_anchor` | Monster im Idle (Clips vorhanden), Kartenbild atmet leicht, Truhe wackelt, wenn der Raum frei ist, Schritte klingen nach dem Boden. |
| `material_codes` | (1) Kartenbild-Fläche: ganze Wand, unverändert. (2) Gewölbe-Stein: Bögen und Säulen in ungeraden Gruppen. (3) Ruinensteine am Fuß der Wände (V-754). (4) Belohnung: Truhe (Pop-up-Klasse truhe) oder schwebende Karte. |
| `biography` | Entstehen: das System hat das Archiv unter dem Viertel gebaut. Nutzen: Karten wegsperren, Wächter halten. Vergehen: nach dem Clearen werden die Wächter geheilt oder fallen um, die Karten werden frei. Signatur: 1 Hero (Belohnung), 2 Echos (Wächter, Ausgang). |
| `groups` | (a) Eingang: Portal + Bodenrand (Ortsgrund: Kante). (b) Kampffläche: Wächter + Deckung (Ortsgrund: Mitte). (c) Belohnung: Truhe/Karte (Ortsgrund: Landmarke). (d) Ausgang: Bogen + Portal (Ortsgrund: Kante). |
| `story_beat` | Eintreten → Wächter bemerken den Spieler → kämpfen oder heilen → Raum frei → Truhe entsperrt (öffnen mit I oder Schuss) bzw. Karte schwebt → Karte durch Drüberlaufen sammeln, Hero-Shot → Ausgang öffnet. |
| `cast` | Spielfigur FrizzleBob (cast `frizzlebob`) mit KFB-Augen, Knete; Wächter: Würfelmonster (`fluffer.kinds.k15.json`, KFB-Augen schwarz mit roten Glühpupillen), Papp-Slops (`mobs2d`); Elite-Soldaten später. |
| `cameras` | die 4 festen Kritiker-Kameras (`CRITIC_3D_R1.md`) + Spielkamera; Abnahme von vorn oder seitlich, nie von hinten. |
| `reference` | (1) InfiniteRooms-Galerie R6 mit Karten-Oberfläche als Raumhaut; (2) Kartenraum-Konzeptblatt `replies/PATCH_TRANSFER_R1/KONZEPTBLATT.md`; (3) Patch Dungeons / Dungeon Forge (Majid Manzarpour) als Grundriss-Prinzip, nicht als Look. |

**Prüffragen:** Geschichte erklärt jedes Element (Wächter, Truhe, Ausgang) – ja. Bildidee aus der Spielkamera lesbar – Belohnung und Ausgang beim Eintreten im Bild. Echter Boden – begehbare Geometrie. Quelle 1:1 – Georgs Satz oben.
