# Konzeptblatt C1b+C3 · nach Kritiker-FAIL (T4 3 / D3 3) · 2026-10-11 · R1

Ohne Code. Erst Vorlage, dann neu. Grundlage sind die Befunde in `docs/critic/lab-track/2026-10-11_C1b-C3-r2/critic_*/verdict.json`.

## Was die Befunde gemeinsam haben

Der Tunnel ist bisher ein Bausatz, der vor bzw. in den Körper gesetzt wird: Boolean aus Hülle, Platte, Ring und Teilen. Jede Teilgrenze wird zu einer Kante:
- Ringbeine stehen vor der Fläche.
- Unter der Fahrbahn ragt ein Plattenrand mit Messerkante.
- Um das Portal läuft eine Geisterbogen-Linie.
- Das Deck stößt mit einem Kasten in den Körper.
- Die Farbwechsel am Ring sind gezackt.
- Q5 kommt auf 47 bis 2 550 Kantenzüge.

Kleben an diesem Bausatz hilft nicht mehr. Der Körper muss den Tunnel selbst formen.

## (a) Tunnel-Einsatz: der Körper formt Röhre, Kragen und Stirn

**Vorlage (Bestand):**
- **O1 v7 Mündung** `organ-islands.v7.js` l.472–500: Knetröhre ab Portal 0,8 r nach außen plus Kragen-Torus, beide weich ins Organfeld vereinigt. Diese Form wächst schon aus dem Körper.
- **Track Core v0.12** `TUNNEL_SHAPES`: arch, rect (Superellipse e 10 = Rechteck mit runden Ecken), round, oval, poly.
  - Je Tunnelstück wählbar; das Portal übernimmt den Ring des Röhrenendes.
  - „Kein eckiges Portal auf runder Röhre“ ist eine Georg-Regel im Core-Kommentar.
- **TC1** `tunnel-clay.tc1.js`: Maße der Kits (Module, Bänder, Lampen, Rahmen, Steine).
- **manifold-3d levelSet** (V-116): vernetzt ein Feld geschlossen.

**Neu, als Vorschlag A:** Röhre, Kragen, Stirn und Rollkante sind Formen IM Körperfeld, nicht angesetzte Netze.
1. **Feld:** Körper (O1-Feld)
   - minus Innenraum = der Core-Ring des Stücks (2D-Abstandsfeld, entlang des Streams gezogen), mit weichem Übergang (smin/smax, Radius ≈ 0,5–0,8 m) an jeder Stelle;
   - plus Kragen = O1-v7-Mündungsröhre, aber mit dem TC1-Außenprofil statt Kreis;
   - plus Rollkante = Torus am Mund aus Körperknete.
2. **Ein levelSet über das ganze Feld** → der ganze Inselkörper ist ein geschlossenes Netz. Es gibt keine Box-, Platten- oder Boolean-Naht und keine Plattenränder; Kehlen entstehen durch den weichen Übergang selbst.
3. **TC1-Kleinteile bleiben Teile:** Bandwulst, Lampen-Kuppeln, Steine, Holzrahmen sind feiner als die Feldzelle (1,25–2,5 m). Sie werden aber auf die tatsächliche Feldfläche projiziert und mit Knet-Fuß eingebunden: Wulst- bzw. Kuppel-Profil wie in Runde 2, keine Kugel oder Kiste auf Fläche.
   - Farbwechsel nur an Teilgrenzen: Portalring wie TC1 als 14 eigene Bögen, nicht als Dreiecks-Einfärbung, sonst gezackt.
4. **Deck am Mund:** Der Kragen hat einen Knet-Sockel unter dem Deck, also eine Schürze bis Barriere-Unterkante. Die Fahrbahn liegt darauf statt in den Körper zu stoßen. Die J17-Fahrbahn bleibt eigenes Modul, wird aber an der Schwelle vom Sockel getragen; keine Messerkante.
5. **Tonsprung auf der Fahrbahn an der Schwelle:** zuerst in J17 an einem race_tube-Portal mit derselben Kamera messen (Schattenkante der Röhre?). Danach weicher Übergang über die ersten 10 m: Tunnel-Licht-Anteil plus weicher Schatten. Keine Vermutung als Fix.

**Risiko und Preis:**
- Der Innenraum aus dem Feld ist auf ± ½ Zelle genau (0,6–1,25 m). Der Core-Abstand 0,3 m hält, wenn der Ring im Feld um ½ Zelle größer angelegt wird; heute ist der Mindestabstand 1,49 m.
- Die Wand ist dann knetig und nicht mathematisch glatt. Das ist gewollt (Knete), muss aber im Bild geprüft werden.
- Bauzeit: levelSet wie heute, die Booleans entfallen weitgehend.

**stone_rect und mine:**
- **TC1 gibt kein eigenes Profil her.** J17s eigener Stream (`p1b.v2`) hat keine `tunnelLooks`. Alle Styles nutzen dort denselben Bogenring (24,9 m breit, Scheitel 14,3 m), und die Rechteck-Fassade steht auch in J17 vor einer Bogenröhre.
- **Innen-Mauerwerk** hat TC1 nicht; die Stein-Kits haben innen Fels-Wand plus Gurtbögen.
- **Der Minen-Rahmen** in TC1 (Stempel bis O.top − 0,2, Kappe darunter) setzt ein kastiges Profil voraus. Im Bogen stößt er durch die Wölbung: Pfosten mit Schrägschnitt, Bretter ohne Verbindung.
- **Vorschlag:** stone_rect und mine bekommen den Core-Ring `rect`. Das ist Core-Bestand, kein Neubau. Damit passen Fassade und Rahmen ins Profil.
- Innen-Mauerwerk und Minen-Licht wären neu und sind nicht erfunden. → Georg-Frage, ob gewünscht.

**Q5:** Trennung Übergang / gestaltet nach §1b.
- Übergang (Kragen, Kehle, Sockel, Wulst-Fuß, Kuppel-Fuß): 0 Kanten > 60°.
- Gestaltet (Steinkanten, Balkenkanten, Fugen): zählt nicht, Flächenwinkel wird angegeben.

## (b) Echter Fahrtest (V-125)

**Vorlage:** k2b `stepDriver` 1:1, also keine eigene Physik. Fahrzeugdaten aus dem Modell: halbe Breite; dazu `motorK`, falls je Fahrzeug festgelegt.

**Aufbau:**
- **Autopilot:** Lenk-, Gas- und Bremstasten aus Blick-voraus-Regler mit Kurven-Grenztempo v = √(a_max · R).
- **Läufe:**
  1. assist 0 (ohne Spurhilfe)
  2. assist 0,8 (Spiel)
  3. Grenzlauf mit Boost
- **Je Lauf:** ganze Runde plus 200 m über Start/Ziel.
- **Gemessen:**
  - Bandenkontakte
  - Landungen: Sinkgeschwindigkeit, `land`-Energie, `rescue` = 0
  - Höhe unter Deck nur bei Bodenkontakt, Luftphasen mit Lande-s und Zielabweichung
  - Querbeschleunigung
  - Rundenzeit
- **Ehrlich vorab:** k2b hat außer der Breite (und `motorK`) keine Fahrzeugparameter. Fahrzeugabhängig wird das Ergebnis nur über Breite bzw. Bandenkontakte und Motorfaktor. Mehr Fahrzeugphysik wäre ein k2b-Eingriff → nicht ohne Freigabe.
- **Dock:** Die Figur läuft mit Tasten von ihrem Spawn zur Tür, kein Setzen; Einsteigen und Aussteigen.
- **Hex-Laufweg** über die Kacheln (Kachelmitte ↔ Rand), Höhe der Figur gegen den Boden in jedem Bild.

## (c) Design

| Befund | Vorlage, Messung zuerst | Vorschlag |
| --- | --- | --- |
| Strecke spießt in die Hub-Seite, Pfosten unter dem Deck | O1-Dock/CONNECT-Rezept (Hub) und C4 (V-110 / V-113 / V-118, Track-Core EXIT/ENTRY) | Hub-Anschluss als gebautes Dock bzw. Rampe in C4; der Pfosten ist O1-Hub-Bestand → klären, was er ist |
| Boost-Chevrons zu dicht und dick, gelbe statt weißer Randlinie | J17-Stream `p1b.v2`: `markings`/`pads` je 100 m zählen; M2-Zone `bio 1` (Strecke) statt `bio 0` (Stadt) | O1-Stream hat eigene Boost-Liste (`td.markings`) → Dichte gegen J17 messen, Zone Strecke nehmen (weiße Randlinie) |
| Auto zu klein | Meine Standbild-Kamera (9 m hinter dem Auto) war NICHT die Spiel-Schienenkamera (J06-Werte, V-103) | Fahrt-Bilder aus der echten `chase()`-Kamera; Bildanteil des Autos gegen `j17_chase_curve` messen |
| Tunnel „doppelt so geräumig“ | J17-Ring 24,9 × 14,3 m (über Fahrbahn); unser Core-Ring 27,2 × 10,4 m; Autos 4,1–4,3 m beide | Ring ist nicht doppelt. Eindruck kommt von der Kamera → mit der Spiel-Kamera neu messen |
| Teal-Stich an Portalen | J17-Licht `track-look.v5.js` l.126–129: Sonne #fff4e6 2,9, Hemi #eef4fa / #9a8a78 1,05, Gegenlicht 0,6. Unsere Hemi-Himmelsfarbe kommt vom Insel-Preset #80ccdd (cyan) | Strecken-Welt nimmt J17-Licht als Tag-Basis (V-010). day-night skaliert weiter über den Tag → Entscheidung, weil day-night Licht-Schreiber ist |
| Tunnel unbeleuchtet | J17 race_tube hat keine Lichter; hell durch ungeschattete Hemisphäre. Unser Pool: nur 4 nächste Punktlichter | Lampenpool entlang der Röhre (8, Abfall sichtbar) oder gebackene Licht-Vertexfarbe aus den Lampen-Positionen; Kosten messen (V-115) |
| Moiré auf der Fahrbahn | gleicher Kamerablick in J17 (Lab-Kopie) | erst Vergleich; liegt es am Lab (Nahband / Mip), dann LOD des Details |
| Kurzer Messerkanten-Streckenteil über dem Spawn | Fahrbahn-LOD (Schritt 3 / 8 / 24 ab 0 / 250 / 900 lab) | Abstände gegen J17-Dichte prüfen |

## Nur auflisten, Georg entscheidet

- **Leerer Taghimmel:** kein „cosmic roadtrip“-Gefühl, die halbe Fläche ist toter Himmel.
- **Drei O1-Sprung-Lücken** (*_kick) ohne sichtbare Landung bzw. Rampe.
- **Schild mit 5 Lampen** über race_tube ohne Zweck (TC1-Gantry).

## Reihenfolge, wenn freigegeben

1. Fahrtest neu (unabhängig, schnell).
2. Tunnel im Feld (A) an EINEM Organ und EINEM Style (race_tube), Standbilder + Q5-Trennung.
3. Licht nach J17 + Tunnel-Licht.
4. rect-Ring für stone_rect/mine.
5. Markierungen/Chevrons.
6. Dock in C4.

## Nachtrag (Steuerung 11.10.): Körper ohne Feld — Mesh → Feld-Adapter, generisch

Der Tunnel-Einsatz aus (a) braucht für jeden Inselkörper ein Abstandsfeld (Raster, innen < 0). Drei Quellen, alle in ein gemeinsames Raster `G {nx, ny, nz, o, h, V}`; das ist das Format des O1-Feldes:

| Körper | Vorlage (Bestand) | Adapter |
| --- | --- | --- |
| O1-Organe (Platzhalter) | O1 v7 Feld `Gc` (organ-world.lab.js) | keiner, Feld ist da |
| Lab-Inseln R2D + Scholle | `IslandField` (`src/island/terrain.ts`, `r2d/field.ts`): height(x,z), base(x,z), Umriss mit `shape.ts signedDist` | Höhenfeld → 3D: V = max(−signedDist₂D, y − height, base − y), weich verrundet (smax k ≈ 1 Zelle); die Scholle-Unterseite über ihre Profilfunktion (`scholle.ts`), sonst über Weg 3 |
| StreakByte-Meshes (Phase D), Gebirge / Basis (V-113), jedes geschlossene Netz | `mesh-check.ts surfaceDistance` (exakter Punkt-Dreieck-Abstand, Raumgitter) · manifold-3d (Punkttest = Schnitt mit Mini-Würfel, wie `findMouths`) | Raster über das Netz: Betrag = Abstand zur nächsten Fläche, Vorzeichen = innen/außen per manifold-Punkttest. Nur im Tunnel-Band (± 25 m um die Röhre) fein; außerhalb bleibt das Original-Netz |

**Regel für Netze mit Textur (StreakByte, gekaufte Assets, V-071 privat):** ganz neu vernetzen würde ihre UV und Texturen zerstören. Deshalb:
- Nur das **Tunnel-Band** wird aus dem Feld neu vernetzt; der Rest bleibt das Original-Netz.
- Die Grenze des Bandes ist eine **ebene Schnittfläche quer zum Körper weit vom Portal**; beide Seiten haben dort dieselbe Schnittkontur aus manifold-3d, eine gemeinsame Naht ohne Spalt.
- Farbe bzw. UV im Band werden von der nächsten Original-Fläche übernommen (wie LAB PATCH 9d bei den Organen).
- **Risiko:** UV-Nähte im Band. Erst an einem StreakByte-Körper testen, vor Freigabe kein Ausrollen.

Für Körper ohne Textur (Organe, R2D-Knete, Gebirge aus Knete) gilt ein levelSet über den ganzen Körper, damit gibt es keine Naht.

## Prototyp-Plan (Freigabe 2): Hirn + race_tube

Vorlage zuerst: O1 v7 Mündungs-Hülse (bleibt), Core-v0.12-Ring des Stücks, TC1 race_tube (Bänder, Lampen, Module 6 m, Farben strang/cloud), manifold-3d levelSet (V-116).

1. **Feld (Hero + Light):** O1-Feld ohne Bohrung (LAB PATCH 11), dann drei Feld-Schritte im Tunnel-Band:
   - Innenraum = −Abstand zum Core-Ring, entlang des Streams gezogen bis 3 m vor die Mündungsfläche hinaus; weich abgezogen (smax k 0,6 m) → gerundete Lippe am Mund.
   - Sockel unter dem Deck am Mund: Knet-Kissen (lat ± Bandenbreite, bis Unterkante Deck) weich vereinigt → die Fahrbahn liegt auf.
   - Ring bekommt im Feld ½ Zelle Zuschlag (Core-Abstand 0,3 m hält).
2. **Ein levelSet** → Körper geschlossen, Mehrfachkanten-Ziel 0 (gezeichnet gemessen wie `body_closed.json`).
3. **Farbe:** Dreiecke der Röhrenwand bekommen das TC1-Material (strang/cloud je 6-m-Modul) als eigene Zeichengruppe auf DENSELBEN Ecken (keine Naht). Die Farbgrenze liegt unter dem Bandwulst.
4. **TC1-Kleinteile:** Bandwulst und Lampen-Kuppeln auf die Feldfläche projiziert (Fuß in der Wand). Kein Portalring, kein Schild: die Lippe kommt aus dem Feld, das Schild ist Georg-Frage.
5. **Prototyp-Blatt:** Portal nah/fern, Mund mit Fahrbahn, innen, Körper geschlossen (offen 0, mehrfach 0), Q5 getrennt Übergang/gestaltet. Dann Stopp.
