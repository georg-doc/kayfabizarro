# Spec · Bord-Diorama „Hunky & Dory an Bord“ R1 (18.10.2026 · V-475)

Ein animiertes Diorama-Scenelet: Lord Hunky und Lady Dory im Alltag an Bord ihres UFOs. Drei Dinge daran:
- **Probe für die lebende Welt:** Point-of-Interest-Logik und Duett-Triplets werden in einem geschlossenen Raum getestet, bevor sie in die Open World gehen.
- **Bühne für den Comic-Motion-Slice:** Dialogszenen mit kfb.performance/1, wie bei den Pharao-Mumien (V-359, V-389).
- **Zuhause der Meta-Erzählung:** Fluff Incident, Academy, das Leben am Rand der Galaxis (META_NARRATIVE_R1).

Keine neue Plattform und kein neues Tool (V-390). Wiederverwendet werden:
- UFO-Bühne (V-252–V-259);
- Szenen-Pack-Format (V-465, SPEC_SCENE_PACK_R1);
- POI-/Patrouillen-Logik (SPEC_NPC_PATROL_R1);
- Triplet-Spec (TRIPLET_SET_SPEC_R2);
- Figurenkarten (V-391);
- Abnahme-Bühne (V-431).

## 1 · Figuren und Ton (Georg 18.10., ergänzt META_NARRATIVE_R1)
**Das Paar:** ein Ehepaar, seit Jahrtausenden (Fluff Incident, ca. 5.000 Jahre) in einer Art Duldungsstarre. Buddy-Banter, ein klassisch zerrüttetes Mann-Frau-Bild als Cartoon-Satire, alles durch die **Alien-Linse**.

**Lord Hunky:**
- Sieht sich als missverstandenes Genie, früher Terraforming-Koryphäe.
- Hasst seinen Job. Am liebsten würde er die Welt in die Luft sprengen, darf aber nicht, weil er Fluff ernten muss.
- Fliegt deshalb weiter Psy-Ops und spielt den Evil Mastermind. In Wahrheit ist er ein überforderter Hausmeister auf dem Gefängnisplaneten Erde.
- Die Fehler aus Genesis und Fluff Incident schiebt er anderen zu.
- Bastler: alles Do-it-yourself, geflickt mit Fluff.

**Lady Dory:**
- Ex-Socialite. Ihren Platz sieht sie in der Academy am Hof im Zentrum der Galaxis.
- Wirft ihm vor, so erfolglos zu sein, dass sie immer noch am Rand der Galaxis festhängen.
- Hat surreale Hobbys: kocht absurde, exotische Gerichte, malt an der Staffelei, züchtet absurde Pflanzen.
- Warm, fragend, „mercy outranks protocol“ (HD-Blatt).

**Das Schiff heißt C.O.M.I.C.** (Hub q40, Georg): *Consciousness-Operated Metaphysical Infinite Canvas*. Quelle: `gvw/VaultGvW/cancel_this_planet/ctc_instruction_sets_a_o_v1.md` (dort von FrizzleBob mit Quantumund und Mizzie gebaut); in den Golden-Strips „Inside the C.O.M.I.C. cockpit / psyop control room“.
- **TARDIS-Logik:** Das Cockpit ist die Tür zu beliebigen Räumen, Dungeons usw. Alles ist durch das UFO-Cockpit betretbar, innen größer als außen. Das passt zu den Szenen-Packs (V-465): Jeder Raum ist ein eigenes Pack, das Cockpit ist der Knoten.
- **Gäste je nach Kontext:** Norman und der Brain-Cyborg (B10) tauchen kontextuell auf.
- **Norman im Glastank:** Norman schwebt für absurde Experimente in einem schwebenden Glastank (Wassertreten bzw. Floating-Schleife, Mixamo). Der Tank ist ein POI für Hunkys Experimente.
- [OFFEN] Laut CTC-Text hat FrizzleBob die C.O.M.I.C. gebaut, geflogen wird sie von Hunky & Dory. Ob das ein Kanon-Knoten ist (gestohlen, geerbt, gehackt), entscheidet Georg bei Gelegenheit.

## 2 · Raum
- **UFO-Cockpit-Bühne:** Fassung A (Meshy), Maßstab 8 m pro Einheit, Monitor als Bildfläche (V-259). Auf dem Monitor laufen Karten, Reports und Hypernormalisation-Loops (V-256).
- **Kuppel:** eine Glaskuppel über dem UFO, ein- und ausblendbar (V-254 sah sie „bei Bedarf“ vor).
  - Glasschimmer: Fresnel-Rand plus leichter, langsam wandernder irisierender Schimmer.
  - Kein Post-Processing, kein Bloom.
  - Überblenden 0,6 s; der Schimmer flackert kurz beim Ein- und Ausblenden.
  - Nachts spiegelt sie Sterne bzw. den Skydome.
- **Transporterstrahl:**
  - Das UFO beamt Strukturen und Props in die Welt hinab oder holt sie herauf. Vorlage: UFO-Weltereignis (PREP).
  - Cartoon-Regel: Der Strahl staucht die Darstellung, nicht das Volumen; ein kleines UFO darf eine Burg einsaugen.
  - Im Diorama ist das ein Ereignis auf der Zeitleiste (V-389): Hunky „liefert“ eine Struktur ab oder holt einen Fehlschlag zurück.

## 3 · Points of Interest (R1: je Figur 3 POIs plus 1 gemeinsamer)
Jeder POI hat:
- einen Ankerpunkt mit Blickrichtung;
- ein Prop-Set aus vorhandenen Kits (KayKit, Kenney, B31-Werkstatt, B32-Alchemie);
- 1–2 Clip-Schleifen aus der vorhandenen Motion-Bibliothek;
- eine Verweilzeit von 8–20 s, zufällig, nie regelmäßig (V-456);
- optional einen Triplet-Auslöser.

| Figur | POI R1 | Props (Bestand zuerst) | Später (R2) |
|---|---|---|---|
| Hunky | Navigationskonsole bedienen, Steuerung checken | Cockpit-Konsole der UFO-Bühne | Reports am Monitor ablesen |
| Hunky | Maschine flicken (DIY, Fluff-Pflaster) | B31-Werkzeuge, Fluff-Ballen, Schraubenschlüssel | am Rumpf außen werkeln |
| Hunky | Bizarres Experiment | B32-Alchemie-Kolben, Glaskugeln, blubbernde Flasche; **schwebender Glastank mit Norman** (q40) | Strahl-Experiment |
| Dory | Kochen: absurde Suppen und exotische Gerichte | Herdplatte mit glühender Kochstelle, Topf mit Dampf; Kessel-Logik aus B32 | Gewürzregal |
| Dory | Malen an der Staffelei | Staffelei mit Leinwand, darauf eine Karte als Motiv (Bildflächen-Modul) | Galerie |
| Dory | Absurde Pflanzen züchten (Alien-Garten, V05) | Pilze und Pflanzen aus Halloween-/Natur-Kits, psychedelisch eingefärbt (V-467) | wachsende Pflanze |
| beide | Tisch: Essen servieren, streiten | Tisch, zwei Hocker, Teller | Monitor-Abend |

**Logik:**
- Jede Figur wählt den nächsten POI gewichtet: Wiederholungen werden gemieden, die Laune verschiebt die Gewichte.
- Kommen beide Figuren in Gesprächsnähe (≤ 3 m) oder an den gemeinsamen POI, startet eine Banter-Runde (§4).
- Danach haben beide 60–120 s Abklingzeit.
- Datenformat: der vorhandene POI-Block aus SPEC_NPC_PATROL_R1. Kein eigenes Schema.

## 4 · Banter in Triplet-Form (Alien-Linse)
- **Bleibt kartenbasiert (V-231–V-235):**
  - Der Monitor zeigt eine Karte, Dorys Gericht heißt nach einer Karte, oder Hunkys Report betrifft eine Karte.
  - Jede Zeile ist **ein** Triplet zu dieser Karte, gesprochen durch die Figur: Dory mit Spott und Sehnsucht nach dem Hof, Hunky mit Ausrede und Größenwahn.
- **Runde = drei Züge:** Dory sticht (Triplet 1) → Hunky rechtfertigt sich (Triplet 2) → Dory oder Hunky setzt den Punch (Triplet 3).
- Pro Runde eine Karte. Sie stammt aus der Deck-Zuordnung der aktuellen Szene bzw. Zone.
- **R1-Umfang:** ein Banter-Set mit 12 Runden aus 2–3 Decks. Geschrieben im Writers Room (Autor schreibt, Kritiker urteilt, Gate mechanisch: triplet_set_check.py).
- **Darstellung:** Sprechblase bzw. ChatterBox, später Stimme (Voice-Casting vo02).

## 5 · Comic-Motion-Slice (Kamera und Zeitleiste)
- **kfb.performance/1** mit einer Zeitleiste für Bewegung, Licht, SFX und VFX (V-389), wie bei den Pharao-Mumien.
- **Drei Kamera-Einstellungen** als feste Standard-Blicke (V-257):
  1. Totale mit Kuppel;
  2. Zweier-Einstellung am Tisch;
  3. Nah auf die sprechende Figur.
- Schnitt auf den Triplet-Takt.
- **Licht:** ein Rig (V-385/386), dazu je eine warme Figurenlicht-Quelle pro Dialoggruppe. Herdglut und Monitor sind Practicals; sie gehen in denselben Practicals-Pool wie die Kristall-Laternen (V-471).
- **Export:** Panels bzw. Clips für den Comic, und dieselbe Szene live im Spiel als Diorama.

## 6 · Wer macht was (eingereiht)
- **WSB, B34 „Bord-Requisiten“:** kommt direkt nach B32 Hexen, denn Kessel, Kochen und Alchemie teilen sich ein Set.
  - Herdplatte mit Glut-Material, Topf mit Deckel, Staffelei mit Leinwand-Fläche, 3 absurde Pflanzen, Experimentiertisch, Fluff-Pflaster, Tisch mit zwei Hockern;
  - Glaskuppel-Geometrie passend zum UFO-Rand;
  - alles in Clay, Abnahme auf der Abnahme-Bühne mit beiden Figuren für den Maßstab.
  - Danach geht es weiter mit B33.
- **WS1, nach dem laufenden Integrations-Slice:**
  - Diorama-Laufzeit: POI-Schleife, Banter-Auslöser, Kuppel-Shader mit Ein-/Ausblenden, Strahl-Ereignis;
  - als Szenen-Pack `kfb.scene-pack/1` mit Typ `diorama`, damit Georg es im God-Mode setzen kann.
- **WS0:** Spec, Banter-Set im Writers Room, Kamera- und Zeitleisten-Entwurf, Abnahmen.
- **Externer Kritiker (V-473):** Das Diorama ist ein guter Kandidat für Stufe 2, den Spieltest.

## 7 · Abnahme R1
1. Hub-Bildpaar: Totale mit Kuppel (an/aus) und POI-Lineup beider Figuren.
2. 30-s-Clip: zwei POI-Wechsel je Figur, eine Banter-Runde, ein Strahl-Ereignis.
3. Gates: Augen an beiden Figuren, Schattensaum, keine schwebenden Props, Kuppel ohne Z-Fighting.
