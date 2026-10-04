# SPEC · Recherchi als Bewohner von Pet Studio

**Stand:** 29.08.2026 · **Fassung 2** (Fassung 1 lag in der Richtung falsch, siehe §7)
**Ziel:** Recherchi in **Pet Studio v10** bauen — mit Studio-Körper, **Studio-Beinen**,
Studio-Licht, Studio-Kamera und den Studio-Reglern. Was Recherchi mitbringt, sind **drei Bauteile**: die
**HTML-Flächen**, die **Chat-Eingabe** (`face.input`) und die **Nase als Knopf** (`face.button`).

**Verträge:** `skills/session_modulvertrag.md` · Treiber-Vertrag `studio-v3/pet-puppet.v1.js` §Eigentum ·
Datenvertrag `studio-v3/PET_EDITOR/pet-LIBRARY.json` 0.4.3

---

## 1 · Die Richtung, in einem Satz

**Recherchi wird ein Bewohner von Pet Studio, nicht ein Gast mit eigenem Hausrat.** v9 forken zu v10,
Recherchi als **Art in die Bibliothek** eintragen — Kamera, Reiter, Regler für Augen und Mund, Export
sind dort schon da und funktionieren für jedes Pet. Beine, Licht und Kamera sind **Studio-Eigentum**.

Der Grund, warum das überhaupt gesagt werden muss: derselbe Fehler ist im Projekt zweimal
passiert — ein Ersatzkörper und eine Etage höher ein eigenes Licht, eine eigene Kamera, eigene
Regler. Jedes Mal war das Ergebnis ein zweites System, das dem ersten widerspricht.

---

## 2 · Eigentum je Kanal (nicht verhandelbar)

Aus dem Treiber-Vertrag, wörtlich übernommen und um die zwei neuen Zeilen ergänzt:

| Kanal | Eigentümer | Recherchi bringt |
|---|---|---|
| Augen | `PetFace` / `EyeRig` | drei gemessene Zahlen (Ankerlage), sonst nichts |
| Mund (Viseme) | `PetMouth` | nichts |
| Körper, **Beine**, Gang | `PetMotion` + GLB-Clips | nichts |
| Clips + Emote-Tabelle | Host (Studio) | nichts |
| Licht, Kamera, Boden | Host (Studio) | nichts |
| **Flächen (HTML)** | **neu: `html-faces`** | **das Bauteil** |
| **Eingabe auf der Fläche** | **neu: `face.input`** | **das Bauteil** |
| **Knopf auf der Fläche (Nase)** | **neu: `face.button`** + `pointer` | **das Bauteil** |

**Wer eine Fähigkeit benutzt, die er nicht angemeldet hat, bekommt sie nicht.** Recherchi meldet
`html-faces`, `face.input` und `face.button` an. Er meldet keine Beine an, also zeichnet er keine.

---

## 3 · Was Recherchi mitbringt: frei befüllbare HTML-Flächen

Das ist Recherchis eigentliches Kapital und das Einzige, was das Studio noch nicht hat: der Körper
rendert **echtes DOM** als Textur (`THREE.HTMLTexture` + HTML-in-Canvas-Polyfill) und richtet für
jede Fläche eine `matrix3d`-Trefferfläche aus — native Pointer-Events auf **allen sechs** Seiten,
nicht nur vorn.

```
el.faces = [{ id, l, sub }, …]      // max 6, Reihenfolge = Flächenbelegung
el.setFaceHtml(id, html)            // Inhalt einer Fläche, live austauschbar
el.overlay(id)                      // L2: mitausgerichtetes DOM ÜBER dem Canvas, kostet keine Rasterung
el.active = 'scan'                  // Fläche nach vorn
```

**Drei Regeln, jede einmal bezahlt:**

1. **Der Entwurfsrahmen ist 470 px, quadratisch, fest** (`.rc-des`). Jede Zahl im Flächen-HTML
   rechnet dagegen; `_desFit()` skaliert einmal an der Grenze. Wer die Kante gegen die Canvas-Box
   auflösen lässt, bekommt ein 16 % breit gezogenes Gesicht und Augen auf der Fase.
2. **Eine Rolle pro Element.** Rasterbox (`.rc-rot`) gehört dem Polyfill, Trefferfläche (`.rc-face`)
   den Zeigerereignissen, Entwurfsrahmen dem Inhalt. Deckkraft an diesen Knoten ist Mechanik.
3. **Bewegliche Gesichtsteile gehören ins L2-Overlay, nicht in die Textur.** Jede Änderung in der
   Textur rastert den Würfel neu.

**Für das Studio heißt das:** eine Fläche ist ein `innerHTML`-String. Ein Pet mit HTML-Gesicht
braucht keinen eigenen Renderer, sondern eine **Flächentabelle** — sechs Strings plus IDs. Der Wirt
übernimmt Polyfill, Entwurfsrahmen und Trefferausrichtung, genau wie er heute three und den Farbraum
übernimmt.

Zusammenspiel mit `face.stripEyes`: bei `body: "html-cube"` gibt es keine gebackenen Kenney-Augen,
das Feld ist wirkungslos — nicht falsch. Die Augen des EyeRigs liegen im L2-Overlay über der Fläche.

---

## 4 · Was Recherchi mitbringt: die Chat-Eingabe (und warum sie nicht „Mund" heißt)

Recherchis Mund ist **kein Bild eines Mundes**, sondern das Eingabefeld selbst: ein
`<textarea data-act="chat">` auf 72 % Flächenhöhe, 81 % Breite, mitwachsend. Klicks und Tasten
stellt der Würfel synthetisch zu (`_hitAct`: Strahl auf den Körper, UV in Entwurfspixel,
Bedienelement über die Layout-Offsets), deshalb funktioniert Tippen auf einer gedrehten Fläche.

```
Textur-HTML:  <textarea data-act="chat" rows="1" placeholder="Frag Recherchi …">
Rückkanal:    Event 'faceaction' {face, act:'chat', value, key}
```

**Der scharfe Punkt:** laut Treiber-Vertrag besitzt `PetMouth` den Mund. Zwei Besitzer an einem
Kanal ist der Fehler, an dem der Travel-Cut gescheitert ist. Deshalb der Vorschlag:

> Der Viseme-Mund bleibt bei `PetMouth`. Das Eingabefeld heißt **`face.input`** und liegt auf der
> Fläche. Zwei Namen, zwei Besitzer, kein Streit. Recherchi spricht mit dem Viseme-Mund des Studios und
> **hört** über `face.input`.

Damit gewinnt Recherchi sogar etwas: er bekommt Viseme, Emotes und den Sprech-Timeline-Treiber des
Studios gratis dazu — `speak()`, `setExpression()`, `playState()` funktionieren für ihn wie für
jedes andere Pet.

---

## 4b · Die Nase ist ein Knopf (neu, 29.08.)

**Setzung des Leads:** die Nase wird ein **3D-Ball zum Eindrücken** — ein echtes Bedienelement, kein
gemalter Punkt.

Heute ist die Nase ein grüner Kreis im Flächen-HTML (`#99CC33`, 21 % der Entwurfskante, Mitte auf
45 % Höhe). Als Knopf ist sie das nicht mehr: sie sitzt **vor** der Fläche als Halbkugel und wird
beim Druck in den Körper gedrückt.

### Warum das nicht in die Textur gehört

Ein Knopf, der sich bewegt, muss bei jedem Frame gezeichnet werden. Läge er in der Textur, rasterte
jeder Druck den ganzen Würfel neu (Regel 3 aus §3). Der Ball ist deshalb **Geometrie**, keine Fläche:
eine kleine Halbkugel am Flächenmittelpunkt, die auf der Normalen der Fläche eintaucht.

### Kanal und Eigentum

| Was | Wer |
|---|---|
| Ballgeometrie, Eintauchtiefe, Feder | Wirt (dasselbe Eigentum wie die Augenschalen des EyeRigs) |
| Trefferbehandlung | `pointer` — die vereinheitlichte Zeigerbehandlung des Wirts, nicht eigene Listener |
| Bedeutung des Drucks | Recherchi (die Anwendung) |

Rückkanal wie bei jedem anderen Bedienelement der Fläche:
`faceaction {face, act:'nose', value: 'down'|'up'}`. Damit hängt der Knopf an derselben Naht wie
die Chat-Eingabe und braucht keinen zweiten Weg.

### Bewegungsregeln (die Fassung 1 verletzt hat)

Ein physisches Bedienelement folgt **anderen** Regeln als eine Figur:

1. **Keine Anticipation.** Ein Knopf, der sich vor dem Druck bewegt, ist kaputt. Die Reaktion beginnt
   im Frame des Drucks.
2. **Eintauchen hart, Rückkehr federnd.** Rein in 60–80 ms, zurück über einen kritisch gedämpften
   Feder-Dämpfer ohne Überschwingen — dieselbe Feder, die `pet-puppet`, `pet-face` und
   `pet-motion` schon benutzen (`sd()`), nicht eine vierte.
3. **Der Körper antwortet, nicht der Knopf allein.** Ein Druck ist ein Impuls: leichter Squash über
   die Motion-Schicht (`nudge` steht in `MOVES` bereits, apex 0.06). Das ist die Kaskade — Knopf,
   dann Kopf, dann Körper.
4. **Eintauchtiefe ist ein Anteil des Ballradius**, keine Pixelzahl, damit derselbe Knopf auf Telefon
   und Desktop gleich liest.

### Offene Fragen

1. **Was tut der Druck?** Vorschläge, eine davon: Scan starten (»Apportieren!« wandert von der
   Schaltfläche auf die Nase) · Ton aus/an · Recherchi wecken. Das ist eine Entscheidung über die
   Bedienung, keine über den Knopf.
2. **Ist der Knopf pro Fläche oder nur im Gesicht?** Sechs Flächen, aber nur eine hat ein Gesicht.
   Vorschlag: ein Knopf, an der Gesichtsfläche verankert, dreht mit.
3. **Braucht er ein Geräusch?** Wenn ja, gehört es in `audio` des Wirts, mit dessen Regel
   »standardmäßig aus, Einschaltgeste beim Wirt«.

---

## 5 · Die Beine: Studio-Eigentum, drei Wege

Bei den 24 Cube-Pets stecken **Beingeometrie und Gang im GLB**: acht Clips je Pet
(`static, idle, walk, run, eat, dance, gesture-positive, gesture-negative`), Node-Animation, nicht
skinned. Recherchi hat kein GLB — das ist die eine offene Entscheidung.

| Weg | Was passiert | Kosten | Urteil |
|---|---|---|---|
| **(a) Spender-GLB** | ein vorhandenes Cube-Pet liefert Beine + die acht Clips, der Rumpf wird durch den HTML-Würfel ersetzt | kein neues Asset | **für den ersten Lauf empfohlen** — sichtbares Ergebnis in einer Sitzung, fremde Proportionen sind der Preis |
| **(b) Eigenes GLB** | Beine und Clips für Recherchi modelliert, gleiche Node-Namen wie die 24 | ein Asset ins Repo | **das Ziel.** Danach ist Recherchi ein Pet wie jedes andere |
| **(c) Prozedurale Beine im Wirt** | `PetMotion` bekommt ein Bein-Bauteil für körperlose Arten | teuerste Variante | **zuletzt.** Führt ein zweites Bewegungssystem ein — genau das, was Fassung 1 dieser Spec falsch gemacht hat |

**Was in keinem der drei Wege passiert:** Recherchi zeichnet seine eigenen Beine. Ein Modul, das
Beine malt, während `PetMotion` den Körper bewegt, kämpft mit ihm um dieselbe Achse.

---

## 6 · Der Art-Eintrag

`contracts/recherchi.pet.json` — Entwurf zur Aufnahme in die kanonische `pet-LIBRARY.json`. Feldnamen
aus 0.4.3 übernommen, nicht erfunden. Kurz:

```
id: rolli · name: Recherchi · glb: null · body: "html-cube" · skin: "html-faces"
color: #FFFFFF · archetype: deadpan · defaultEmote: neutral
eye.anchor: { dx 0.275, dy -0.23, ring 0.26, track 0.14 }
tuning: { claySurface 0, jitter 0 }
```

**Drei neue Werte** (`body: html-cube`, `skin: html-faces`, `glb: null`) und die Begründung je Wert
stehen im `_abweichungen`-Block der Datei. **Vier offene Fragen** stehen im `_offen`-Block — sie
gehören ins Studio, wo der Vertrag wohnt, nicht in eine Recherchi-Sitzung.

Die Augen-Ankerlage ist aus dem gemessenen Recherchi-Gesicht umgerechnet (Entwurfsrahmen 470 px:
Augenbreite 26 %, Abstand 55 %, Mitte auf 27 % Höhe). **Eine Quelle, drei Zahlen** — in Recherchi
als `EYE`, im Studio als `eye.anchor`.

---

## 7 · Fassung 1 war falsch — die Anekdote

**Was ich am 29.08. zuerst gebaut habe:** ein eigenes Bein-Modul (`modules/recherchi-legs.v1.js`),
Rubber-Hose in SVG, mit Gangzyklus, Plant-Lock, Werkbank und Abnahmezahl. Technisch lief es, der
Fußschlupf war 0,00 px.

**Warum es trotzdem falsch war:**

1. **Es beantwortet die falsche Frage.** Der Grund für Export, Design und Import sind die Beine
   **aus dem Studio**. Ein zweites Beinsystem daneben ist genau der Ersatzkörper-Fehler, eine Etage
   tiefer.
2. **Es verletzt den Eigentumsvertrag.** Körper und Bewegung gehören `PetMotion`. Ein Modul, das
   Beine zeichnet, hält eine zweite Wahrheit über die Lage der Figur.
3. **Es ignoriert die Animationsregeln des Hauses.** Kein Anticipation-Frame, keine Kaskade
   (Augen → Kopf → Körper → Root), keine ballistischen Bögen, keine Feder-Dämpfer-Physik — alles
   Dinge, die in `recherchi-motion.js` (BRIEFING-03) und im Studio bereits gelöst sind. Ein
   Sinus-Fußhub ist keine Animation, sondern eine Bewegung.

**Status:** `modules/recherchi-legs.v1.js` + Werkbank bleiben als **ANEKDOTE** im Paket, mit Stempel
im Datei-Header. Nicht weiterentwickeln, nicht in v5 einbauen, nicht in die Bibliothek eintragen.
Sie sind aus einem Grund aufbewahrt: als Beleg, wie schnell ein lauffähiges Ergebnis in die falsche
Richtung zeigt, wenn es an keinem Vertrag hängt.

---

## 8 · Für Recherchi v5

1. **Nichts an den Beinen bauen.** v5 bekommt sie, wenn Recherchi im Studio steht — dann kommen sie mit
   Licht, Kamera und Reglern zusammen.
2. **Die Nase als Knopf bauen** — sie ist heute ein Kreis im Flächen-HTML und wird eine Halbkugel
   vor der Fläche (§4b). Erst die Bedeutung des Drucks entscheiden, dann den Ball.
3. **Die Flächentabelle nach außen ziehen** (heute in `faceHtml()` im Modul verdrahtet). Sechs
   Strings plus IDs sind die Naht, an der das Studio Recherchi befüllt.
4. **`face.input` benennen**, statt weiter „Mund" zu sagen — sonst wandert der Namenskonflikt mit.
5. **Die drei Augen-Zahlen** aus dem Modul in den Art-Eintrag verlagern, sobald Recherchi in der
   Bibliothek steht. Eine Quelle.

---

*Ein Modul erklärt, was es braucht. Ein Wirt liefert genau das. Was nicht erklärt wurde, ist nicht da.*
