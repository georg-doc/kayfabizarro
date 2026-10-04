# PLAN · VFX-Schicht, Aussteigen und Flug-Mode für die Fahrzeug-Linie

*Stand 2026-09-18. Georgs Auftrag aus derselben Sitzung, in der Manöver, Zwei-Rad und Fassrolle
gebaut wurden. Dieses Papier ist **Planung mit gemessenen Zahlen**, kein Entwurf aus dem Kopf:
alles, was hier als Quelle steht, wurde im Repo nachgesehen, und alles, was als Maß steht, am
geladenen Modell gemessen. Was nicht geprüft ist, ist ausdrücklich als ungeprüft markiert.*

Reihenfolge nach Motion-Skill §15: eine Choreografie sichtbar richtig, dann die nächste. Die drei
Pakete unten sind darum nacheinander gedacht, nicht gleichzeitig.

---

## Was schon steht (Grundlage, nicht Plan)

| Familie | Datei | Read |
|---|---|---|
| Pose | `lab-v7/vehicle-cartoon-deformer.v2.js` | Squash, Stretch, Nicken, Rollen, Drift-Yaw |
| Schlingern | `lab-v7/vehicle-fishtail.v1.js` | Heck pendelt aus, Nase bleibt auf Kurs |
| Zwei-Rad | `lab-v7/vehicle-twowheel.v1.js` | steht auf zwei Rädern, frei oder an der Bande |
| Fassrolle | `lab-v7/vehicle-tumble.v1.js` | überschlägt sich seitlich, landet auf den Rädern |
| Manöver | `lab-v7/vehicle-manoeuvre.v1.js` | Rückwärts, Wenden, Einparken — echter Weg über den Boden |

Schichtung von innen nach außen: **Deformer → Schlingern → Zwei-Rad → Fassrolle → Manöver.**
Jede Schicht besitzt genau eine Gruppe und fasst keine fremde an; alle Lenkanteile werden addiert.
Deshalb kann ein Fahrzeug an einer Bande entlangFAHREN und dabei gekippt stehen.

**Erledigt am 18.09. nach Georgs Ansage:** Lautwörter sind aus der Grundbewegung heraus. Das
Fassrollen-Modul meldet `soundWord` nur bei `trigger({ words: true })`, die Werkbank hat einen
Schalter, Vorgabe **aus**. Der Budget-Eintrag `maxSoundWords: 1` bleibt stehen — er ist die
Obergrenze, nicht die Vorgabe.

---

## Paket A · VFX-Schicht (optional, zuschaltbar)

Georgs Rahmen: 2D-Feuer/Rauch **plus** three.js-Partikel und **Speedlines**, abgeleitet von
travel / TinySkies. Lautwort gehört in diese Schicht, mit Bangers-Typo und Cartoon-Deformer auf
der Schrift.

### Die Quellen liegen schon im Repo — nichts davon wird neu erfunden

| Vorlage | Pfad (kayfabizarro) | Was sie ist |
|---|---|---|
| `speed-lines.js` | `travel/travel-v16/terrain-v16/`, `travel/KFB Travel Combat v25/terrain-v25/` | Speedlines als **zweiter Renderpass**, portiert aus TinySkies `client/src/game/SpeedLines.ts` @ `2659a5cc`. API `createSpeedLines({THREE, ink})`, `setInk`, `setEnabled` |
| `contrails.js` / `card-contrails.js` | `travel/KFB Travel Globe v13-1/globe-v13/` | **Comic-Speedlines am Fahrzeug**, 72 Stützpunkte je Band, additiv. Georgs eigene Definition (3.9.): „das sind doch quasi comic speedlines → also müssen sie von dem object ausgehen" |
| `drift-smoke.js` | `travel/KFB Travel Globe v13-1/globe-v13/` | `THREE.Points`, hängt am **Driftwinkel**, nicht am Tempo; 28 Partikel je Sekunde |
| `impact-dust.js` | dito | `THREE.Points`, Einschlagstaub |
| `carpet-wake.js`, `carpet-leaves.js` | dito | Partikel-Pools mit Tempo-Gate |
| `post-radial.js` | beide Linien | Radial-Blur-Pass. **Reihenfolge: Szene → post-radial → Speedlines → HUD** |

### 2D-Material, geprüft

`media/3D_Assets/FX_Visual` enthält **keine 3D-Effektnetze**.

- `kenney_smoke-particles/PNG` — fünf Ordner als **Einzelbilder**: Black smoke 25, White puff 25,
  Explosion 9, Fart 9, Flash 9. Direkt als Billboard-Sprite verwendbar, kein Zuschnitt nötig.
  **Das ist das Material erster Wahl.**
- `explosions_smoke` — **gepackte** Spritesheets, Bildlagen in einer `.plist`
  (`explosion_smoke_HowTo_v01.md`: Frames liegen nicht im Raster, Position und Größe stehen als
  `{{101,404},{100,100}}`). Muss erst zerlegt werden, also zweite Wahl.
- `brackeys_vfx_bundle/particles` (185 Dateien), `VFX Mysterious Objec - 192x192` (20),
  `Beams_BinbunVFX`, `FreeHitVfx` — nicht gesichtet.

**Folge, die vorher gesagt sein muss:** alle Effekte dieser Linie sind kamerazugewandte
Billboards, keine Volumen. Für Cartoon ist das richtig.

### Fünf Lehren aus travel, die hier gelten (teuer bezahlt, nicht wiederholen)

1. **Wer Bewegung meint, muss Bewegung messen, nicht die Ausnutzung des Spielraums.** Die
   Speedline-Blende hing am `speedRatio`; Reisefahrt liegt auf dem Tempoboden, also Verhältnis 0
   — die Speedlines waren die ganze normale Fahrt unsichtbar. Für uns: an **absolutem** Tempo in
   u/s hängen, nicht am normierten Signal.
2. **Frag das Objekt nach seinen Maßen.** Zwei Fassungen der Speedlines rechneten ihre
   Ansatzpunkte aus einem Mesh, das gar nicht gezeichnet wird, und hatten eine sichtbare Lücke.
   Für uns: Ansatzpunkte aus `rig.wheels[i].steer` und `rig.frame`, nie aus einer Zahl daneben.
3. **Ein Effekt, der nicht mehr rechnet, hört damit nicht auf zu erscheinen.** Ohne Tiefentest ist
   ein additives Quad von überall sichtbar. Sichtbarkeit ist eine eigene Zeile.
4. **Additiv, nicht normal.** `AdditiveBlending` + `depthWrite: false` ist in allen Vorlagen die
   Vorgabe; ein Versuch mit `NormalBlending` war in travel ein gemessener Fehler.
5. **Ein Partikelmodul zählt je Sekunde, nicht je Bild.** `drift-smoke` tut es richtig, zwei
   Nachbarn aus derselben Quelle tun es falsch — bei 144 Hz emittieren die doppelt so viel.

### Vorschlag, was gebaut wird

`lab-v7/vehicle-vfx.v1.js` — eine Schicht, fünf Ausgänge, alle **aus Vorgabe aus**:

| Ausgang | Hängt an | Quelle |
|---|---|---|
| Reifenrauch | `readout.lateral` und `drift` des Deformers | `drift-smoke.js`, Sprite aus `White puff` |
| Einschlagstaub | `touchdown`-Ereignis von Fassrolle/Zwei-Rad, Stärke = `strength` | `impact-dust.js`, `Black smoke` |
| Klapp-Rauch (Paket C) | Klappfaktor je Rad | dito, vier Emitter an den gemessenen Radnaben |
| Speedlines | absolutes Tempo aus dem Manöver bzw. `speed × topSpeed` | `speed-lines.js` als zweiter Pass |
| Lautwort | `soundWord` im Readout | **neu**: Bangers, Cartoon-Deformer auf der Schrift |

Das Lautwort ist der einzige Teil ohne Vorlage. Vorschlag: DOM-Overlay (kein 3D-Text), Bangers
über Google Fonts, und der Cartoon-Deformer als CSS — Squash beim Erscheinen, Overshoot, Abklingen
mit derselben Federableitung wie die Karosserie, damit Schrift und Blech dieselbe Masse haben.
**Offene Entscheidung für Georg:** Lautwort als DOM-Overlay (scharf, aber immer bildschirmparallel)
oder als Billboard in der Szene (perspektivisch, aber weich). Ich würde DOM nehmen — ein Comic-Wort
sitzt auf dem Panel, nicht im Raum.

---

## Paket B · Ducken zur Ausstiegsseite

Georgs Entscheidung: keine Klappkarosserie, sondern **das Fahrzeug duckt sich zur Ausstiegsseite
und die Figur poppt heraus.** Muss für alle KayKit-Resident-Größen und -Rigs laufen, inklusive
der kleinen Legacy-Figuren und des großen Orc Brute.

### Gemessener Befund zuerst: es gibt keine Tür

Acht Fixtures geprüft (car-hatchback, car-police, truck, firetruck, garbage-truck, van, suv,
spacetruck): **kein Türknoten in keinem Modell.** Kenney und KayKit liefern 6–8 Knoten, nämlich
Karosserie plus vier Räder. Die Poly-by-Google-Modelle sind nach **Material** getrennt
(`Object003_1 … _6`), nicht nach Bauteil. Einzige Ausnahme im Satz: `garbage-truck` bringt `arm`,
`body` und `trash` als eigene Knoten mit, also einen echten beweglichen Aufbau.

Darum ist Ducken die richtige Wahl: es braucht **keine neue Achse und keine neue Geometrie.**

### Was der Deformer schon kann

`lateralSquash`, `rollResponse` und die Seitenlast sind da. Ein Duck-Read besteht aus drei Teilen,
alle aus vorhandenen Griffen:

1. Fahrhöhe sinkt (Federweg je Rad über `WheelRig.setSuspension`, negativ),
2. die Karosserie neigt sich **zur** Ausstiegsseite (`shellRoot`-Roll, nicht dagegen),
3. eine kurze Gegenbewegung beim Aufrichten, nachdem die Figur draußen ist.

### Die Falle, die diese Linie schon einmal bezahlt hat

Aus `lab-v4/player.js`, wörtlich im Kommentar festgehalten: *die Hüftspur eines
`Rig_Medium`-Clips ist in Medium-Maß. Auf `Mannequin_Large` (3,981 u) setzt sie die Hüfte auf halbe
Höhe und die Figur steht bis zu den Schienbeinen im Boden.* Die Regel dort heißt **gemessen wird
ein Verhältnis, angewandt ein Verhältnis** — und genau das gilt für den Ausstieg:

- Die Ausstiegshöhe ist **kein absoluter Wert**, sondern ein Anteil der Figurenspanne.
- Orc Brute ist **Large** mit Spanne **3,32 u** (aus `HOUSEKEEPING.md`), `Mannequin_Large`
  3,981 u; ein car_hatchback ist 0,806 u lang und 0,4 u hoch. Der Orc ist also **achtmal so hoch
  wie das Auto lang ist.** Ein Ausstieg, der am Auto gemessen ist, ist für ihn unbrauchbar, und
  umgekehrt.
- `RigCompatibility.json` (12.09.) sagt je Figur, ob **Medium** oder **Large** trägt. Das ist die
  Quelle für die Rig-Wahl, nicht eine Annahme am Namen.

**Daraus folgt der Vorschlag:** der Duck-Read wird auf das **Verhältnis Figurenspanne zu
Fahrzeughöhe** gerechnet, und wo das Verhältnis über eine gemessene Schwelle geht, ist der Read
nicht mehr „aussteigen", sondern „absteigen" — der Orc sitzt nicht im Hatchback, er sitzt darauf.
Welcher der beiden Reads bei welchem Verhältnis gilt, **muss gemessen werden, bevor gebaut wird**,
und zwar an mindestens: kleine Legacy-Figur, Rig_Medium-Standard, Orc Brute (Large), gegen
car_hatchback, truck und firetruck. Sechs Kombinationen, eine Tabelle, dann die Schwelle.

### Bekannte Lücke

`KayKit ActionFigure / Rig_Medium` ist **nicht im Handoff-Satz** (141 Assets, kein Treffer auf
`rig_medium|actionfigure`). Nächstliegende gerigte Figuren im Satz: `Astronaut_*` (43 Joints,
18 Clips), `Mech_*` (13 Joints, 17 Clips) — beide keine ActionFigure. Steht als R2 in
`HANDOVER_RACE_2026-09-18.md`. **Ohne eine Figur im Satz ist der Ausstieg nicht abnehmbar**, nur
baubar. Die Animationssätze selbst sind da: `Rig_Medium` acht Dateien mit gemessenen 139 Clips,
`Rig_Large` sechs Dateien.

---

## Paket C · Rad-Umklappen, Anti-Grav, Flug-Mode

Georgs Einschätzung, dass das der größere Sprung ist, stimmt. Aber der Mechanismus ist billig,
weil das Rig ihn schon hat.

### Machbar ohne neue Geometrie — gemessen am Rig

Jedes Rad hat drei geschachtelte Gruppen (`lab-v7/carrig.v2.js`):
`steer` (y) → `susp` (y-Versatz) → `spin` (x). Die Reihenfolge ist Absicht, sonst lenkt das Rad um
seine eigene gedrehte Achse.

- **Klappen** = `steer.rotation.z` auf ±90°. Damit steht die Radachse von quer auf senkrecht: die
  Scheibe liegt waagerecht und `spin` dreht sie um die Hochachse — ein Rotor, kein Rad. **Eine
  Drehung auf einer vorhandenen Gruppe.**
- **Absenken** = `susp.position.y` negativ, damit der Rotor unter dem Aufbau steht.
- **Schweben** = die Hubgruppe, die die Fassrolle schon besitzt (`TumbleLift`), oder eine eigene
  darüber.

### Ein Faktor fährt alles

`hover` 0…1 treibt gemeinsam: Klappwinkel, Fahrhöhe, Schubneigung (Nicken aus der
Beschleunigungsrichtung statt aus der Feder), Rotorendrehzahl, und die Blende der Klapp-VFX. Das
ist der fließende Übergang zwischen Drive- und Flug-Mode, und er ist **eine** Zahl, nicht fünf.

### Was daran noch nicht gemessen ist

- **Radbreite gegen Radstand.** Ein umgeklapptes Rad ragt um seinen Radius nach vorn und hinten.
  Bei kurzem Radstand können sich Vorder- und Hinterrotor überschneiden. Muss über die Fixtures
  gemessen werden — `car-hatchback` hat Radstand 0,502 u bei Radradius 0,072 u, das passt; ein Kart
  mit kurzem Radstand und großen Rädern möglicherweise nicht.
- **Welche Achse zuerst klappt.** Gleichzeitig ist billiger, nacheinander (hinten zuerst) ist der
  bessere Read. Entscheidung Georgs.
- **Senkrechtstart** braucht einen Bodenkontakt-Read: der Staub kommt beim Abheben unter den
  Rotoren hervor und hört auf, wenn die Höhe über einer gemessenen Schwelle liegt.
- **Anti-Grav und Fassrolle teilen sich die Hubgruppe.** Beide gleichzeitig ist ein doppelter
  Besitzer. Entweder eine gemeinsame Hubschicht oder ein Verbot im Fixture-Vertrag
  (`forbiddenOverlaps`).

---

## Paket D · SFX (später)

Georgs Rahmen: möglichst rechnererzeugt oder aus öffentlichen Repos für Racing-Games und
Sci-Fi/Anti-Grav mit Drohne, ähnlich wie im KFB Rollercoaster.

Stand heute: die Fassrolle hat **zwei synthetisierte Töne** (aufsteigender Whoosh beim Absprung,
Rauschstoß plus tiefer Puls beim Aufsetzen), beide über WebAudio ohne Asset, **aus Vorgabe stumm**.
Das ist der Beweis, dass der synthetische Weg trägt. Für Anti-Grav ist er sogar der bessere: ein
Rotorgeräusch ist ein Sägezahn mit langsamer Frequenzmodulation, kein Sample.

**Noch nicht getan:** kein öffentliches Repo geprüft, keine Lizenz gelesen. Bevor ein Sample
hereinkommt, gilt dieselbe Regel wie bei den Modellen — Herkunft und Lizenz gepinnt, sonst nicht.

---

## Reihenfolge, die ich vorschlagen würde

1. **Paket A ohne Lautwort** — Reifenrauch und Einschlagstaub an die vorhandenen Ereignisse. Klein,
   sofort sichtbar, und es prüft die Anbindung der Kenney-Einzelbilder.
2. **Paket A Speedlines** — zweiter Pass, Reihenfolge Szene → post-radial → Speedlines. Hängt am
   absoluten Tempo.
3. **Paket C Klappen** — Mechanik erst ohne VFX, mit der Radstand-Messung über alle Fixtures.
4. **Paket A Lautwort** — Bangers plus Schrift-Deformer, jetzt mit dem Klapp-Rauch als Nachbar.
5. **Paket B Ausstieg** — erst wenn eine Figur im Satz ist (R2), sonst nur baubar, nicht abnehmbar.
6. **Paket D SFX.**

## Was Georg entscheiden muss, bevor gebaut wird

1. Lautwort als DOM-Overlay oder als Billboard in der Szene.
2. Klappen beider Achsen gleichzeitig oder hinten zuerst.
3. Anti-Grav und Fassrolle gleichzeitig erlaubt oder verboten.
4. Beim Ausstieg: gilt „aussteigen" und „absteigen" als zwei Reads, oder soll einer für alle
   Größen gestreckt werden?
5. Ob `explosions_smoke` zerlegt werden soll oder die Kenney-Einzelbilder genügen.
