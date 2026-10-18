# Spec · Fluff-Saugarm: Ernte per Ansaugen R1 (18.10.2026 · V-479, Georg zu Hub q39)

## 1 · Idee (Georg)
- Die Fluff-Bots (B31) **saugen Fluff-Kugeln mit ihrem Cyber-Arm einfach auf**: von Bäumen, aus dem Terrain, aus dem Wasser.
- Besiegt der Spieler einen Saugarm-Bot, kann er **den Saugarm erbeuten**. Damit erntet er selbst Fluff, effizienter als von Hand.
- Später kommen **absurde Werkzeuge** auf den Arm-Aufsatz: ein Werkzeug-Slot, eine Aufgabe je Fluff-Farbe.

## 2 · Die Saug-Animation (Cartoon, Squash & Stretch)
Ein Ablauf, drei Herkünfte. Dauer etwa 1,2–1,8 s pro Kugel.

| Phase | Was passiert | Dauer |
|---|---|---|
| 1 · Anlauf | Düse richtet sich aus. Luftflimmern bzw. Knet-Partikel strömen zur Düse. Die Kugel zittert. | 0,3 s |
| 2 · Stretch am Ursprung | Die Kugel streckt sich zur Düse hin wie Gummi. Der Fuß bleibt am Ast, im Boden oder im Wasser haften, ein Hals entsteht. | 0,3–0,5 s |
| 3 · Plopp | Die Kugel löst sich mit Squash. Ursprungs-Effekt: Blätter rascheln und ein Zweig federt nach; Erdkrümel und ein kleiner Krater; Spritzer und Ringwelle. | 0,1 s |
| 4 · Flug gestreckt | Die Kugel fliegt als gestreckte Tropfenform zur Düse, leichte Kurve, wird schneller. | 0,3–0,5 s |
| 5 · Einsaugen | Die Kugel wird in die Düse gezogen. Der Arm schluckt sichtbar: eine Beule wandert den Arm entlang, dann ein kurzer Squash am Tank. | 0,2 s |
| 6 · Voll (optional) | Der Tank ist voll: kleiner Rülpser, Ding, Fluff-Farbe blinkt am Bot. | – |

**Technik:**
- Prozedural in three.js über Vertex- bzw. Skalier-Deformation entlang des Vektors Kugel → Düse. Kein Rig auf der Kugel.
- Fluff-Kugeln aus dem Bestand: B17 S/M/L und B31 XL.
- Effekte aus clay-vfx.v1 mit gemeinsamem VFX-Budget (V-357).
- Ein Modul für Bots und Spieler: `kfb-fluff-suck` mit `suck(ball, nozzle, origin: 'tree'|'ground'|'water')`.
- Die Phasen laufen als Cues auf der Ereignis-Zeitleiste (V-389), damit Ton und VFX synchron sind.

## 3 · Ton (fertig, R1)
- ElevenLabs-Set `40_AUDIO/elevenlabs_r1/fluff_suction_r1/`, Pegel-normalisiert in `fluff_suction_r1_norm/`.
- 7 Ereignisse mit je 2 Varianten:
  - S01 Anlauf, S02 Saug-Schleife;
  - S03 Plopp Baum, S04 Plopp Erde, S05 Plopp Wasser;
  - S06 Einsaugen, S07 Tank voll.

## 4 · Spielmechanik (Vorschlag WS0, Georg entscheidet)
- **Bots:**
  - Ein Saugarm-Bot erntet in seinem Gebiet, dazu passt die POI-Logik aus SPEC_NPC_PATROL_R1.
  - Volle Bots fahren zur Ladestation in ihrer Farbe und leeren dort ihren Tank.
  - Die Fluff-Farbe des Bots bestimmt, welchen Fluff er erntet.
- **Beute:**
  - Ein besiegter Saugarm-Bot lässt den Saugarm fallen, als Fundsache (B28-Logik, schwebt mit 0,15 m Bodenabstand nach V-450).
  - Der Spieler trägt ihn als Werkzeug, Ernte-Effizienz ×2 (Wert TBD).
  - Alles als Daten in der Loot-Tabelle, kein Sonderfall im Code.
- **Satire-Schicht:** Die Bots saugen Fluff für die Academy ab („Low-Vibrational Fluff harvest“). Der Spieler kapert das Werkzeug der Ausbeuter.

## 5 · Wer macht was
- **WSB, in B31 r3:**
  - Saugdüse als Aufsatz für den Cyber-Arm, aus Kit-Teilen (Rohr, Trichter);
  - Anker `kfb_tool_socket` am Armende für spätere absurde Werkzeuge;
  - Anker `kfb_nozzle` mit Richtung;
  - der Saugarm zusätzlich als eigenständiges Beute-Modell (`KFB_Loot_SuctionArm`).
- **WS1, nach dem Integrations-Slice:** `kfb-fluff-suck`-Modul, Beute-Eintrag, Bot-Ernte-POI.
- **WS0:** Spec, Ton (fertig), Abnahme.

## 6 · Abnahme
1. Bildstreifen der 6 Phasen je Herkunft (Baum, Erde, Wasser) auf der Abnahme-Bühne.
2. 10-s-Clip: Bot saugt drei Kugeln, dann Tank voll.
3. Gates: kein Durchdringen der Düse, die Kugel behält ihr Volumen bis zum Einsaugen (Cartoon: Darstellung staucht, Volumen nicht).

## 7 · Fluff-Kreislauf (Georg 18.10., V-480)
**Meta-Erzählung:**
1. Bots saugen Fluff und liefern ihn an der **Ladestation** ab.
2. Ist die Station voll, schickt ein pseudowissenschaftlich-absurder Cartoon-Mechanismus den Fluff direkt ins **Hauptquartier nach Utopia**.
3. Dort wird er auf Förderbändern und in Fabrikeinheiten zu Rohstoff verarbeitet.
4. Daraus entstehen **plastikartige, schlecht funktionierende, aber massenproduktionstaugliche und profitable** Werkzeuge und Bauteile.
5. Aus genau diesen Bauteilen bestehen die **Gebäudekomplexe**, die der Spieler im Destruction-Modus fliegend, fahrend oder laufend zerstört.
6. Zerstörte Teile zerfallen durch Explosion oder Schüsse wieder in **Fluff-Kügelchen**, die nach der normalen Ernte-Logik geerntet werden. Der Kreis schließt sich.

**Darstellung, nach Aufwand gestuft (WS0-Empfehlung):**
- Der **Transport wird nicht animiert**, keine Flugbahn und kein Rohrnetz.
- An der Station gibt es nur einen 1-s-Effekt:
  - Tank-Füllstand fällt auf null;
  - kurze Schimmer-Säule über der Station (additives Sprite aus dem gemeinsamen VFX-Budget);
  - Ton E01.
- Kein neues Asset.
- **Utopia-Fabrik** nur als Kulisse und Klang, wenn der Spieler dort ist (E02-Schleife). Eigene Fabrik-Assets erst, wenn die Utopia-Zone gebaut wird.
- **Zerstörung:** Gebäudeteile tragen in der Destruction-Logik das Feld `yields: fluff(color, count)`. Beim Bruch zuerst Plastik-Knacken (E04), dann Fluff-Kügelchen (E05), die liegen bleiben und eingesaugt oder aufgesammelt werden.

**Ton (fertig):** `40_AUDIO/elevenlabs_r1/fluff_economy_r1/` mit 5 Ereignissen × 2:
- E01 Station schickt ab;
- E02 Fabrik-Schleife;
- E03 Plastikteile klappern;
- E04 Plastik bricht, Fluff pufft heraus;
- E05 Kügelchen springen.

## 8 · UFO-Ernte: ganze Gebiete abernten (Georg 18.10., V-484)
**Bild:** Hunky fliegt wie ein Bauer übers Feld. Mit der C.O.M.I.C. und einem hin und wieder flackernden Traktorstrahl erntet er ganze Gebiete. Die Fluff-Kügelchen ploppen cartoonig aus Boden, Pflanzen und Wasser und werden in die runde Mündung unten am UFO gesaugt. Das ist sein täglicher Job: Ernte von Low-Vibrational Fluff auf der Erde, Meta-Erzählung V05.

**Darstellung (eine Logik mit dem Saugarm, §2):**
- **Strahl-Shader:** Vorlage ist Georgs Beam- und Materialisierungs-Animation aus dem UFO-Lab. Sie läuft in beide Richtungen: ein Modell zerfällt in Knetkügelchen bzw. Partikel oder baut sich daraus auf. Fundort noch zu bestätigen; WS1 bzw. Georg nennen den Pfad.
- Dieselbe Strahl-Logik dient für Ernte (aufsaugen) und Transport (abbeamen, hinbeamen; siehe V-475 Bord-Diorama).
- **Farbe:** Strahl und Kügelchen tragen die Farbe des **primären Fluffs** des Gebiets. Die Zone bzw. Karten-Zone liefert die Farbe als Datum.
- **Flug:**
  - Das UFO neigt sich glaubwürdig zum Fluff-Vorkommen; der Strahlkegel ist auf den Schwerpunkt der Kugeln ausgerichtet.
  - Leichtes Pendeln; der Strahl flackert unregelmäßig, nie im Takt (V-456).
- **Ablauf je Kugel:**
  - wie §2 (Stretch, Plopp, gestreckter Flug, Einsaugen), nur in den Strahlkegel statt zur Düse;
  - viele Kugeln gestaffelt als Strom;
  - in der Mündung ein kurzer Squash, der Tank-Zähler steigt.
- **Leistung:** als instanzierte Partikel im gemeinsamen VFX-Budget (V-357). Ab einer Obergrenze werden mehrere Kugeln zu einer Partikelwolke zusammengefasst, damit Gebiete mit vielen Kugeln performant bleiben.
- **Modul:** `kfb-fluff-suck` bekommt einen zweiten Sauger-Typ `beam` (Kegel statt Düse); Bots, Spieler und UFO teilen den Code.

**Ton (fertig):** `40_AUDIO/elevenlabs_r1/ufo_harvest_r1/` mit 5 Ereignissen × 2:
- U01 Strahl an;
- U02 Ernte-Schleife mit Flackern;
- U03 Plopp-Strom;
- U04 Einschlucken in die Mündung;
- U05 Strahl aus.
