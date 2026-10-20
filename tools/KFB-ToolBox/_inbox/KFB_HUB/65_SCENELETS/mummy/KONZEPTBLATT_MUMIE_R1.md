# Konzeptblatt · Mummy · Grabkammer & Sarkophag · R1 · 2026-10-20 · WS0
**Vorlage:** `30_DECISIONS/CANON_3D/KONZEPTBLATT_R1.md` · **Kanon:** V-563/V-564/V-565/V-566 · **Szene:** `mummy` (NPC_SETTINGS_01 · MUMMY-01)

**Quelle 1:1:** Resident Atlas S17, Rezept `mummy` in `data/cast.js` (Teil `parts` in `lib/atlas.js`), live unter `#mummy`, dazu `docs/NPC_SETTINGS_01/MUMMY_01_RETURN.md`.
- **Bleibt unverändert:**
  - Besetzung, Plätze, Drehungen und Posen;
  - Deckel-Versatz und alle Grabbeigaben.
- **Neu** ist nur die **Einpassung ins Terrain** (Kanon Gebiet 15).
- **Verbindlich von Georg:**
  - 01.10.: Augen-PASS für beide Mumien, das schwarze Band bei Mummy_A bleibt;
  - 17.10.: Postmortem „Figuren immer mit Augen-Rig“;
  - V-395 (c): Mann = Mummy_B, Frau = Mummy_A.

**Gegenbeispiel (FAIL):**
- Atlas-Studio mit Promo-Hintergrund 0xd29a68 und neutralem Licht;
- Mumien mit Original-Texturaugen (Postmortem 17.10.);
- Dioramen auf Scheiben, mit eigenen Farben (V-561).

---

## Ein Satz (`one_sentence`)
**Diese Szene zeigt eine Begrüßung in einer oben offenen Grabkammer im Canyon, weil die Gruft bewohnt ist und Mummy_A aus dem offenen Sarkophag winkt, während Mummy_B mit dem Ankh herankommt, und der Spieler soll zuerst den orange-goldenen Sarkophag sehen.**

## Geschichte (`story`)
In der Canyon-Wüste ist eine Grabkammer in den violetten Fels geschlagen, oben offen zum Himmel. In der Kammer steht der Sarkophag, der Deckel ist aufgeschoben. Mummy_A steht darin und hebt die Hand zum Gruß. Mummy_B stapft mit dem Ankh über den Sand auf sie zu. Links und rechts stehen Krüge voller Gold, eine Vase ist umgekippt (Quelle: „Grab-Resident · Wüste und Schatzkammer“). **Man soll fühlen:** Die Gruft ist bewohnt, und man ist willkommen. Das ist gruselig-komisch, nicht unheimlich.

## Bildidee (`image_idea`)
**In einer oben offenen Grabkammer im violetten Canyon leuchtet der orange-goldene Sarkophag vor dunklen Terracotta-Wänden. Mummy_A winkt aus dem offenen Sarg, und Mummy_B stapft mit erhobenem Ankh über den hellen Sand heran.**

## Fokus und Leserichtung (`focal`)
**Landmarken-Regel:**
- Landmarke ist der Sarkophag (Quelle: „landmark“), 1,00 m Sockel + 0,33 m Deckel, das höchste und massigste gebaute Element.
- Mit Mummy_A darin erreicht die Gruppe Figurenhöhe.
- Die Kammerwand ist Terrain und bleibt unter Kopfhöhe (siehe Raum).

Leserichtung:
1. **Sarkophag** mit aufgeschobenem Deckel.
2. **Die gehobene Hand von Mummy_A** im offenen Sarg.
3. **Mummy_B mit Ankh** vorn links auf dem Weg.
4. **Goldkrug links, Goldvase rechts.**
5. **Umgekippte Vase** in der rechten Ecke.

## Raumkonzept (`space`)
Koordinaten aus der Quelle, Blick der Key-Art von +z.
- **Vordergrund (Spielkamera-Seite, +z):**
  - offen;
  - der Kammerboden läuft als Sandrampe ohne Stufen nach vorn hinaus, dort kommt Mummy_B her;
  - Toilettenpapier optional am Rampenfuß (−2,6 / 2,4);
  - dunklere Tonfläche des Terrains (#439) jenseits der Rampe.
- **Mittelgrund:** ebener Sandboden.
  - Mummy_B bei (−1,35 / 1,55);
  - Goldkrug (−1,05 / 0,7) und gelehnte Vase (−0,8 / −0,45) links;
  - Goldvase (3,8 / −0,2) und umgekippte Vase (4,35 / 0,35) rechts.
- **Hintergrund:**
  - Sarkophag mit Mummy_A bei (1,7 / −0,5), Drehung −6°;
  - dahinter die Kammer-Rückwand, links und rechts die Seitenwände, nach vorn abfallend;
  - die Wände sind Terrain-Schnitt, keine Mauer.
  - Die Oberkante der Rückwand bleibt unter Kopfhöhe der Mumien, damit Köpfe und die gehobene Hand gegen den Himmel stehen.
- **Negativraum:** der Sand zwischen Mummy_B und Sarkophag (rund 3,7 m), ihr Weg; er bleibt frei.
- **Hell-Dunkel:**
  - hell: sonnige Sandsohle und Himmel;
  - mittel: violettes Gelände über der Kammerkante;
  - dunkel: Innenflächen der Wände (dunkle Terracotta-Töne).
  - Der orange-goldene Sarkophag hebt sich durch den Wertkontrast ab.
- **70/20/10 (V-566, ersetzt 70/30):**
  - Ruhe (70 %): Sandsohle, Wandflächen und Gelände außen, großflächig und kontrastarm;
  - Struktur (20 %): Wandbänder mit Fugen, Bröckel, Gras an der Kante, schlichte Vasen, der Weg;
  - Bedeutung (10 %): Sarkophag mit Mummy_A, Mummy_B mit Ankh, Goldkrug und Goldvase. Hier liegt der stärkste Kontrast.
- **Wertstruktur und drei Tiefenebenen:** siehe „Bildanatomie (V-566)“.

## Palettenrollen (`palette_roles`)
**Welt: Claybound-Canyon** aus dem Farbdrehbuch V-406 (Joyride A). **Warum:**
- Eine Grabkammer wird in Fels geschlagen; der Canyon-Körper (Cap → Body → Skirt, Kanon §5) zeigt im Schnitt seine Terracotta-Schichten.
- Die Harmonie-Zeilen under1–3 (#ce826b …) treffen den Promo-Hintergrund 0xd29a68.
- Der Canyon-Sand trägt den Quell-„Sandboden“.

| Rolle | Ton | Wo |
|---|---|---|
| ground | `#8b68c7` Violett | Gelände rings um die Kammer und die Kappe der Wände |
| stageFloor | `#e2d0bc` Sand | Kammerboden und Rampe, ~60 % des Kammerbilds |
| wall | `#b56d5b` | Wandbänder (Harmonie-Zeile under2) |
| wall_dark | `#935649` | untere Wandbänder und Wandfuß (under3), dunkle Masse hinter dem Sarkophag |
| tiers | `#a582d9` | Gras-Büschel an der oberen Kammerkante |
| tiers2 | `#7b5bb8` | Moos in den Fugen der Wandbänder und an Kontaktstellen |
| frame | `#ef5a22` | Sarkophag, leicht getönt (V-286), Landmarke |
| structures2 | `#e8743a` | Goldkrug und Goldvase, leicht getönt, ≤ 10 % zusammen mit dem Sarkophag, führen zum Fokus |
| sky | `#96bede` | Himmel |

- **60/30/10:** Sand und Violett (60) / Terracotta-Wände (30) / Orange-Gold (10).
- Figuren behalten ihre eigenen Farben und werden nie umgetönt.
- Ankh und schlichte Vasen bleiben in Kit-Form mit Knete, nur leicht getönt.

## Licht
**Ein Rig:** `kfb-stage-light.v1.1`, Stimmung **MESA day**.
- Die hohe Sonne fällt in die oben offene Kammer.
- Die Sohle ist hell, die Wände stehen im Eigenschatten.

**Innenraum und ein Rig (LIGHT_MODEL_R2):**
- Eine geschlossene Kammer hätte kein Sonnenlicht. Dann trügen nur Hemisphere und Praktische, nachts ≥ 2 Licht-Inseln (Regel 6).
- Die Quelle hat **keine** Praktischen: keine Fackel, keine Lampe, auch nicht im Pack.
- Deshalb wird die Kammer oben offen gebaut. Es gibt keine erfundenen Lampen, und eine Nacht-Stimmung ist ausgeschlossen.
- Die Hemisphere-Füllung trägt den Bodenton (edgePalette = Sand).

**Figurenlicht nach Regel 11 (V-386):** warm und schattenlos für die Dialog-Gruppe Mummy_A + Mummy_B, mit Catchlight in den Augen (auch im schwarzen Band von Mummy_A).

**Schatten:** echte Schatten aus der Sonne, nach Empfänger-Palette getönt (V-564). Keine Blob-Schatten.

## Bildanatomie (V-566)
Nach Kanon Gebiet 16. Die Quelle bleibt 1:1; alles hier wirkt nur über Terrain, Knet-Oberfläche, Rollenfarbe und das eine Licht.

**Farb-Skript (`color_script`)**

| Feld | Festlegung |
|---|---|
| Stimmung | sonniger Tag, gruselig-komisch: Die Gruft ist bewohnt, und man ist willkommen |
| Terrain | Violett #8b68c7 rings um die Kammer, Sand #e2d0bc als Sohle und Rampe (~60 % des Kammerbilds), dunklere Tonfläche (#439) jenseits der Rampe; ruhig |
| Sekundär | Wandbänder #b56d5b und #935649, lila Gras #a582d9 an der Kante, Moos #7b5bb8 in den Fugen |
| Akzent (nur mit Bedeutung) | Orange #ef5a22 am Sarkophag: Landmarke und Erzählkern. Gold #e8743a an Goldkrug und Goldvase: der Schatz (Erzählkern-Echos), führen zum Fokus. Zusammen ≤ 10 %. |
| Verboten | Promo-Hintergrund 0xd29a68 als Fläche; Orange oder Gold an schlichten Vasen, Ankh oder Wänden; Fackel- oder Lampenlicht; Texturaugen; Figuren umtönen |
| Licht | ein Rig kfb-stage-light.v1.1, MESA day (hohe Sonne in die offene Kammer, Wände im Eigenschatten, Hemisphere-Füllung im Sandton), Figurenlicht nach Regel 11 mit Catchlight; keine Praktikals |

**Form-DNA (`form_dna`)**

| Feld | Festlegung |
|---|---|
| Grundformen (3) | weiche Mulde im Canyon-Körper (Kammer-Schnitt, Wände nach vorn abfallend) · weiche Keile (Rampe, Sandverwehungen, Sandkeile) · abgeflachte Kugeln (Gras-Polster an der Kante, Bröckel am Wandfuß) |
| Sekundärformen (2) | leicht wellige waagrechte Wandbänder · gerundete Gefäßkörper (Krüge, Vasen nach Eingangsprüfung) |
| Verbotene Formfamilie | scharfe Prismen: Mauern, Säulen, Dach, Stufen, Platte |
| Kantenrundung | runde Knet-Kanten; die Wandkante bröckelt statt einer Linie; Rampe ohne Stufe |
| Unregelmäßigkeit | kontrolliert: Bänder leicht wellig, hinten am höchsten; rechte Ecke mehr Bröckel; Gruppen ungerade |

**Lebensanker (`life_anchor`)**
- lila Gras-Büschel an der Kammerkante wiegen in Wind-Gruppen (Kit §6/§8)
- die gehobene Hand von Mummy_A (Waving, Quelle) reagiert auf den Ankömmling
- **Glaubwürdig macht es:** Die Sandverwehungen liegen in derselben Windrichtung wie das Gras; so wirkt der Wind echt, auch wenn der Moment eingefroren ist.

**Wertstruktur (`space`)**

| Zone | Wo |
|---|---|
| hell | sonnige Sandsohle und Himmel |
| mittel | violettes Gelände über der Kammerkante |
| dunkel | Innenflächen der Wände (#935649 am Wandfuß) |
| **stärkster Kontrast** | orange-goldener Sarkophag mit Mummy_A vor der dunkelsten Rückwand, also auf dem Fokus |
| ruhig | Sandsohle, Wandflächen, Gelände außen |

**Drei Tiefenebenen (`space`)**

| Ebene | Aufgabe | Inhalt |
|---|---|---|
| Vordergrund | rahmt | Sandrampe, dahinter die dunkle Tonfläche: rahmt den Zugang, über den Mummy_B kommt |
| Mittelgrund | trägt die Handlung | ebene Sohle mit Mummy_B, den Gefäßen und dem freien Weg: höchste Klarheit; der Sarkophag steht als Endpunkt an der Grenze zum Hintergrund |
| Hintergrund | vereinfacht | Rück- und Seitenwände in ruhigen Bändern, Oberkante unter Kopfhöhe |
- **Das Terrain ist nie die lauteste Fläche:** Wände und Sohle bleiben unter dem Wertkontrast des Sarkophags.

**70/20/10 (`space`, ersetzt 70/30)**

| Anteil | Inhalt |
|---|---|
| 70 % Ruhe | Sandsohle, Wandflächen und Gelände außen |
| 20 % Struktur | Wandbänder mit Fugen, Bröckel, Gras an der Kante, schlichte Vasen, der Weg |
| 10 % Bedeutung | Sarkophag mit Mummy_A, Mummy_B mit Ankh, Goldkrug und Goldvase; hier liegt der stärkste Kontrast |

**Gebrauchsspuren (Kanon Gebiet 3, V-566)**: RA-Quelle, daher nur über Knet-Oberfläche und Terrain; die Silhouette bleibt 1:1.

| Objekt | Spur | Ursache |
|---|---|---|
| Sarkophag (Hero, Landmarke) | Sand im Fuß angeweht (Sandkeil) | Wind trägt Sand in die offene Kammer |
| Sarkophag (Hero, Landmarke) | Deckel oben leicht ausgeblichen | Farbverlust: hohe Sonne in der oben offenen Kammer |
| Sarkophag (Hero, Landmarke) | Abrieb an der Deckelkante | Abnutzung: Der Deckel wurde aufgeschoben (Lage bleibt Quelle) |
| Goldkrug und Goldvase (Echos) | Gold oben stumpf, Sandverwehung am Fuß | Fleck: Staub und Sand in der Kammer |
| Kammerwände (Terrain) | Moos in den Fugen, bröckelnde Kante | Moos im Eigenschatten, Vergehen der Wandkante |

## Materialcodes (`material_codes`, höchstens 3)
1. **Canyon-Wand:**
   - Form: Knet-Schnitt mit waagrechten Bändern, oben die violette Kappe, darunter Terracotta (under2/under3), runde Knet-Kanten.
   - Verteilung: Die Bänder laufen leicht wellig um die Kammer und sind hinten am höchsten.
   - Bewegung: Moos-Polster in den Fugen. Oben an der Kante stehen lila Gras-Büschel in Dreiergruppen und wiegen in Wind-Gruppen (Environment-Kit §6/§8).
2. **Sand-Knete-Boden:**
   - Form: weiche, ebene Sohle, vorn eine Rampe ohne Stufen.
   - Verteilung: Mummy_Bs Weg ist eine flache Trittmulde (Relief, kein Farbwechsel). An Sockel und Gefäßen liegen Sandverwehungen; die umgekippte Vase ist halb zugeweht.
   - Bewegung: Der Sand liegt ruhig; die Wehen zeigen die Windrichtung der Gras-Gruppen.
3. **Grab-Gerät:**
   - Form: Sarkophag, Krüge, Vasen und Ankh in Kit-Form, vorher durch die Eingangsprüfung (`kfb_clay_bpy.apply`), dann Knete und Rollenton.
   - Verteilung: nach Quelle.
   - Bewegung: Der Deckel ist nach Quelle aufgeschoben; die Gefäße stehen.

## Ortsbiografie (`biography`)
Nur Terrain-Arbeit, keine neuen Requisiten.

| Schicht | Ein Satz | Umsetzung |
|---|---|---|
| 1 Entstehen | Die Kammer ist in den Canyon-Körper geschlagen, oben offen. Die Wände zeigen die Schichten, der Boden ist Sand, vorn läuft eine Rampe hinaus | Terrain-Schnitt mit Bändern, Rampe ohne Stufen, keine Platte, kein Dach |
| 2 Nutzen | Mummy_Bs Weg von der Rampe zum Sarkophag ist im Sand ausgetreten. Vor dem Sarkophag ist der Boden glatt, am Sockel ist Sand angeweht | Trittmulde (Relief); Sandkeil am Sockelfuß (Sarkophag-Höhe bleibt Quelle). **Gebrauchsspuren (V-566, nur Knet-Oberfläche/Terrain):** Sarkophag (Hero, Landmarke): Sand im Fuß angeweht (Sandkeil) (Wind trägt Sand in die offene Kammer); Sarkophag (Hero, Landmarke): Deckel oben leicht ausgeblichen (Farbverlust: hohe Sonne in der oben offenen Kammer); Sarkophag (Hero, Landmarke): Abrieb an der Deckelkante (Abnutzung: Der Deckel wurde aufgeschoben (Lage bleibt Quelle)); Goldkrug und Goldvase (Echos): Gold oben stumpf, Sandverwehung am Fuß (Fleck: Staub und Sand in der Kammer); Kammerwände (Terrain): Moos in den Fugen, bröckelnde Kante (Moos im Eigenschatten, Vergehen der Wandkante) |
| 3 Vergehen | Die Wandkanten bröckeln. Am Wandfuß liegen Terracotta- und Violett-Steinchen, in der rechten Ecke mehr, wo die Vase umgefallen und halb zugeweht ist | Steinbänder Grammatik §4 (Band 0–2) am Wandfuß, `nest_ok`, ungerade; Sandverwehung über `vase_lying` |
| 4 Bewachsen | Die Kammersohle bleibt kahl (Wüste). Nur oben an der Kante wächst lila Gras, in den Wandfugen Moos | Gras-Gruppen 3/5 an der Kante, Fugen-Sprenkel tiers2 |

**Kontakt-Geometrie (V-565):** Jede Fuge wird gebrochen (`kfb_env.contact`):
- am Sarkophag-Sockel ein Sandkeil rundum plus Steinchen-Dreier hangab an der Rückwandseite;
- an Goldkrug und Goldvase Sandkeil plus Steinchen;
- die gelehnte Vase mit Sandkeil an der Standseite;
- die umgekippte Vase halb im Sand;
- am Wandfuß Bröckel und Moos;
- Mummy_B steht direkt auf dem Sand.

**Signatur:** Hero = Sarkophag; Echos = Goldkrug links und Goldvase rechts (Quelle: „Krüge mit Gold links und rechts davon“). Nichts Drittes.

## Gruppen (`groups`)
- **g1 Sarkophag hinten:**
  - Sarkophag (Anker) + Mummy_A darin + Wandfuß-Nest dahinter;
  - Ortsgrund: Landmarke an der Rückwand, wo die Kammer am tiefsten in den Fels geht.
- **g2 links:**
  - Goldkrug (Anker) + gelehnte Vase (Stütze) + Steinchen am linken Wandfuß;
  - Ortsgrund: Grabbeigaben neben dem Weg, am Fuß der linken Wand.
- **g3 rechte Ecke:**
  - Goldvase (Anker) + umgekippte Vase (Stütze) + größeres Bröckel-Nest;
  - Ortsgrund: Ecke, in der Sand und Geröll liegen bleiben (Vergehen).
- **Optional:** Toilettenpapier (Quelle: Lull, nur contents.png) am Rampenfuß, allein.
- Jede Gruppe ungerade (Gate G1). Kontakt-Steinchen zählen nicht in die Gruppenregeln.

## Story-Beat (`story_beat`)
Eingefrorener Moment der Quelle, „Begrüßung“:
- Mummy_B in `Walking_A` bei 0,64 s: linker Arm vorn auf Brusthöhe, Ankh nach oben.
- Mummy_A in `Waving` bei 0,5 s: Hand gehoben, steht im Sarkophag.

Der Deckel bleibt nach links-vorn aufgeschoben (off −0,75 / 0,02 / 0,05, rot 4°).

## Besetzung (`cast`)
| Figur | Rolle (Quelle) | Augen |
|---|---|---|
| `mummy_b` | Ankh-Träger, freies Gesicht (Mann, V-395) | EYE-CLEANUP-01 NoEyes + Augen-Rig auf `eye_anchorl/r`, Lid = Haut #f6bd99 |
| `mummy_a` | zweite Mumie im offenen Sarkophag (Frau, V-395) | EYE-CLEANUP-01 NoEyes, Augen im schwarzen Band (Georg: bleibt), Lid #111618 |

- Jede Figur hat KFB-Augen und E2-Lider, an jeder Variante. Nie mit Texturaugen zeigen (Postmortem 17.10.).
- Ankh an `handslot.l` von Mummy_B (Quelle).

## Kameras (`cameras`)
1. 45° schräg von oben in die Kammer.
2. Augenhöhe (1 H) von der Rampe (Hauptweg) auf den Sarkophag.
3. Fuß nah: Sarkophag-Sockel mit Sandkeil und gelehnter Vase.
4. Seite: rechte Kammerwand, Silhouette mit umgekippter Vase.
5. Gesicht nah: Mummy_A (Augen im Band) und Mummy_B.
6. Spielkamera (Bühnen-Orbit V-257); dazu die Key-Art der Quelle (Richtung 0,06 / 0,2 / 1, frontal leicht erhöht).

## Referenz (`reference`)
- RA S17 `#mummy` und KayKit Mummy `artwork.png` (Promo, Donor @ 9248211a): Plätze, Deckel, Posen 1:1.
- Joyride A Claybound-Canyon: Farbwelt, Harmonie-Zeilen under1–3.
- Terrain-Design 19.10. (#439): Farbflächen, dunklere Vordergrund-Tonfläche, getönte Schatten.

## Verbote für diese Szene
- Dach, Decke, Mauern oder Säulen; Fackeln, Kerzen oder Lampen.
- Neue Requisiten, Dünen- und Steinbrocken-Assets aus Fremdpacks (Quelle: Georgs Entscheidung).
- Sarkophag absenken oder Plätze „verschönern“.
- Platte, Scheibe oder Studio-Hintergrund.
- Mumien mit Texturaugen.

## Offene Punkte (Quelle lückenhaft oder widersprüchlich, nicht durch Erfinden gelöst)
1. **Innen oder außen:** Der Name sagt „Grabkammer“. `habitatIntent` sagt „Sandboden“, die Promo zeigt Dünen und Steinbrocken unter freiem Himmel, `townRole` sagt „Wüste“. Dieses Blatt baut eine oben offene Kammer im Terrain. Eine geschlossene Kammer bräuchte Praktische, die die Quelle nicht hat. Georg entscheidet.
2. **Dünen und Steinbrocken der Promo:** Der Pack liefert sie nicht. Hier gibt es nur Terrain-Form und Kanon-Steinbänder (Grammatik §4), keine Promo-Brocken.
3. **Mummy_A** steht im massiven Sockel, ihre Beine stecken unsichtbar in der Geometrie. Es ist kein echter Sitz.
4. **Lagen sind Bildabgleich:** Deckel- und Krug-Lagen sowie die Waving-Zeit 0,5 s sind nicht gemessen. Nach den Zahlen steht die „an den Sockel gelehnte“ Vase rund 0,8 m vom Sockelende (Ursprung der GLTF ungeprüft). Im Bau prüfen, nicht verschieben.
5. **Besetzungsliste:** Die Mumien fehlen in `60_CAST/cast.r1.json`. Karten liegen in `replies/FIGURES_R1/figures/mummy_{a,b}.figure.json` (Status leer).
6. **Augen:**
   - Die Karten nennen `pet-eye-rig.v6` mit Anker-Sitz. Ob das E2-Lid (V-420) schon drin ist, ist ungeprüft.
   - Der Ladeweg ist ungepinnt (Branch `georg-doc-patch-3`).
7. **Toilettenpapier:** Laut Quelle optional. Es bleibt optional, ob es gebaut wird, entscheidet Georg.
8. **Atlas-Licht:** Die Quelle folgt dem Promo-Studio (0xd29a68, neutrales Licht). Hier gilt nur das Welt-Rig mit der Palette.

## Ablauf
- **WS1 (Paket E):** Einpassung im Spielterrain Canyon (Kammer-Schnitt, Rampe, Wandbänder).
- **WSB:** Eingangsprüfung, Knete und Rollenton für Sarkophag, Krüge, Vasen und Ankh. Mumien-Karten mit E2-Prüfung, Eintrag in die Besetzungsliste.
- **Prüfung:** Gate mit `concept.json` daneben, dann der blinde Kritiker mit den Kameras 1–6.
- Georg sieht nur das Bestandene.


## WS0-Entscheide (20.10., Art Direction)
Diese Entscheide schließen die offenen Punkte oben; was dort noch offen steht, ist hiermit beantwortet.
- Außen statt Innenraum: Die Quelle zeigt Wüste mit Sandboden und offenem Himmel. Die „Grabkammer“ ist eine nach oben offene Grabungsstätte, in den Canyon geschnitten, bei Tag. So braucht es keine erfundenen Lampen.
- Dünen und Felsbrocken der Promo entstehen nur aus Terrain-Form und Steinbändern des Kanons.
- Mumie A und Deckel- bzw. Topf-Positionen bleiben wie in der Quelle. Steht A sichtbar im Sockel, misst WS1 die Durchdringung (Proof Stage G4) und meldet sie, ohne zu verschieben.
- Die Mumien trägt WS0 in `cast.r1.json` nach. E2-Lider prüft G1, den Augen-Ladepfad pinnt WS0.
