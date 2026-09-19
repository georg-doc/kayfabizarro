# Sprint 19 · Cartoon-Deformer: Requisite wird Darsteller

Vertrag **vor** Code. Grundlage: `skills/kfb-cartoon-animation_v2.md` (v2.0, canonical-draft)
im Repo `georg-doc/kayfabizarro`. Diese Datei übersetzt die Skill-Regeln in die Messgrössen
und Abnahmetore dieses Projekts. Sie ist noch **kein** Baubericht — nichts davon ist gebaut.

Ziel in einem Satz: aus den getopften Requisiten von S18 werden **lebende, atmende Figuren,
die auf Zeiger, Klick und Einschlag cartoonhaft reagieren**, durch die Landschaft hüpfen und
miteinander reden können — ohne dass eine einzige Quellgeometrie verändert wird.

---

## 1 · Warum ein Deformer und nicht mehr Rig

Das Rig aus S18 (`lib/plant-rig.js`) bewegt **Pivots**. Damit gehen Wiegen, Wind, Nähe,
Rückstoss und ein volumenerhaltender Puls über `SquashWrap`. Was damit **nicht** geht:

- echtes Stauchen des Netzes (Squash & Stretch ist Formänderung, nicht Skalierung einer
  Gruppe — eine skalierte Gruppe staucht auch den Topfrand und die Erdfläche mit);
- Biegen einer Krone gegen ihre eigene Achse (Bend/Bow);
- Nachlauf einzelner Blätter gegen den Stamm (Follow-through auf Vertexebene).

S19 setzt deshalb eine **zweite Schicht** darunter: einen Vertex-Deformer im Shader
(`onBeforeCompile`, Uniforms je Instanz), der die geklonten Materialien von S18 nutzt. Das
Netz auf der Platte bleibt unangetastet; deformiert wird beim Zeichnen.

### Additive Komposition — verbindlich

```
finalPose =
    Rezeptplatzierung (Wahrheit, Rezept)
  + Rig-Pivotversatz  (S18, Transformebene)
  + Deformer-Uniforms (S19, Vertexebene)
  + Weltbewegung      (S19, nur im Modus HOP, siehe §4)
```

Der Deformer **überschreibt nie** eine Rezept- oder Physiklage. Skill §8.3.

---

## 2 · Grenzen (Anti-Scope)

- **Nichts in `lib/kit-lab.js`.** Das Modul ist von 19 Seiten geteilt. Der Deformer bekommt
  `lib/plant-deformer.js` und hängt sich an die Instanz, nicht an den Szenenbauer.
- **Kein zweites Augensystem.** Weiterhin `pet-eye-rig.v6.js` über den Adapter
  `lib/plant-eyes.js`. Mienen kommen aus `kfb-pet-graft-driver.v4.json`.
- **Kein zweiter Jitter-Generator.** Konturen und Muster kommen aus dem Feld in
  `plant-pattern.js`, mit **stabilem Seed** je Ereignis (Skill §5.2). Neue Zufallsgeometrie
  je Bild ist Flackern, nicht Handzeichnung.
- **Kein Ausbau der Inhalte im selben Sprint.** Kakteen, Pilze, Blumen, Früchte,
  Hamburger-Bäume stehen in `docs/BACKLOG_PLANT_PROP.md` §P2 und kommen **nach** der ersten
  sichtbar korrekten Choreografie (Skill §14: „expand scope before one choreography is
  visibly correct" — verboten).

---

## 3 · Bewegungsfamilien für Pflanzen

Aus dem Katalog des Skills (`idle · locomotion · turn · jump · impact · speech · emotion ·
card · camera · transition · ambient · vfx · ui`) sind für Pflanzenrequisiten **sechs**
einschlägig. Jede bekommt genau einen Standardablauf.

| Familie | Bedeutung hier | Auslöser |
|---|---|---|
| `idle` | Atmen. Beleg, dass etwas lebt — keine Dauerwackelei | immer, in AMBIENT/AWARE |
| `emotion` | `neutral · happy · angry` als Körpersprache, nicht als Miene allein | Zustand |
| `impact` | Klick, Stoss, Einschlag | Zeigerklick, Fremdereignis |
| `jump` | Hüpfen (ein Sprung) | Befehl / Kette in `locomotion` |
| `locomotion` | Hüpfkette durch die Landschaft | Wegpunkt |
| `speech` | Reden, Zuhören, Konspirieren (zwei Akteure) | Dialogereignis |

`turn`, `card`, `ui` sind in diesem Slot nicht einschlägig. `camera` bleibt **still**, solange
kein Gate es verlangt (Skill §9).

---

## 4 · Die fünf Presets, mit Zeitachse

Zeiten sind Startwerte aus dem Skill, hier auf die gemessenen Größen von S18 bezogen
(Topfhöhe 1,00; Einsetztiefe 0,20; Schauhöhe 3,2 / Landmarke 6,6).

### 4.1 `breathe` — Familie `idle`

```
Dauer 2600–3400 ms, Schleife, phasenversetzt je Instanz (Seed aus dem Rezept)
Squash:   ±1,8 % Höhe, volumenerhaltend (Breite gegenläufig)
Krone:    Nachlauf +90 ms, halbe Amplitude
Erde/Topf: 0 — der Topf atmet NICHT mit, er ist Gefäss
Blinzeln: EyeRig, 3–7 s Abstand, nicht getaktet
```
Verboten: Dauerrotation, Partikel, Kamerabewegung. Skill §3.1.

### 4.2 `poke` — Familie `impact`, leicht

```
0–40    ms  Kontakt registriert, Blickziel springt auf den Zeiger
40–95   ms  Hitstop + Squash 8 % in Stossrichtung
60–220  ms  ein kleiner gefüllter Burst am Kontaktpunkt (sekundär)
160–360 ms  2–3 Blattzucker (tertiär), Krone schwingt gegen die Stossrichtung
360–620 ms  Abklingen, Blick kehrt zum Zeiger zurück
620–850 ms  Recovery → breathe
```
Budget: 1 primär · 2 sekundär · 3 tertiär · **0** Lautwörter · 0 Kamera.

### 4.3 `whack` — Familie `impact`, schwer

Wie `poke`, plus: **ein** Lautwort (`PLOCK` · `TOCK` · `BLÖDSINN!`) in freier Fläche,
Popin 80–140 / Halt 350–650 / Abgang 160–260 ms (Skill §6.6), und **eine** Kamerahandlung
(kurzer Shake, danach Stille). Nie beides zugleich mit einem grossen Ring — Ringe sind für
Zone/Ladung/Portal reserviert (Skill §4.5).

### 4.4 `hop` — Familie `jump`

```
0–120   ms  Squash nach unten, Schatten weitet sich
120–310 ms  Abstoss, Stretch, Erde bleibt im Topf (Deformer-Maske: nur Krone streckt)
310–560 ms  Bogen. Weltbewegung NUR hier, Bodenhöhe per Strahl von oben (wie snapToSurface)
560–680 ms  Landevorbereitung, Schatten zieht sich zusammen
680     ms  Aufsetzen: Hitstop, kleiner gefüllter Burst am Topfboden, 2–3 Staubpuffs
680–860 ms  Stauchung, Nachlauf der Krone, zurück nach breathe
```
Der Bogen ist Pflicht (Skill §3.4). Ein senkrechtes Auf-Ab ist kein Sprung.

### 4.5 `confer` — Familie `speech`, zwei Akteure

Das „Konspirieren". Zwei Requisiten, ein Ereignis, **eine** Leserichtung.

```
Akteur A neigt sich 6–9° zu B, Krone folgt +90 ms
B neigt sich halb so weit zurück  (Antwort ist kleiner als Frage)
Blick: EyeRig beider auf den jeweils anderen, nicht auf die Kamera
Betonung: EIN Körperhüpfer je Phrase, nicht je Silbe
Pause: Stille ist aktiv (Skill §7.4) — mindestens ein Schweigepunkt je Wechsel
Ende:  beide zurück in die Senkrechte, breathe
```
Kein Sprechblasen-Text in dieser Stufe. Wer Text will, braucht zuerst die geschützten
Flächen (§5).

---

## 5 · Geschützte Flächen (3D-Fassung)

Der Skill definiert `ProtectedArea` in Bildschirmkoordinaten. Für diese Bühne heisst das:
je Bild die projizierten Rechtecke von

```
Gesicht/Augen jeder AWARE-Requisite
Kontaktpunkt des laufenden Ereignisses
Maßstabszeuge im Erstbeweis
Legende und Prüfleiste der Werkbank
```

Ein Lautwort prüft die Kandidaten rechts · links · oben · unten · entlang der Bahn ·
gegen die Bahn und nimmt den ersten freien. Gibt es keinen: **Wort weglassen.** Wortbreite
wird mit `ctx.measureText()` in der echten Schrift gemessen, nie aus der Zeichenzahl
geschätzt (Skill §6.3). Position und animierte Transformation liegen auf getrennten Ebenen
(§6.4).

---

## 6 · Abnahme: Fixtures und Tore

### 6.1 Feste Fixtures (feste Kamera, fester Seed)

```
fx-breathe-single      eine Requisite, AMBIENT, 6 s
fx-poke-light          Klick auf zzplant_large, Topf D
fx-whack-heavy         schwerer Stoss auf die Landmarke (Maßstab 6,6)
fx-hop-flat            drei Hüpfer über ebenen Boden
fx-hop-step            ein Hüpfer auf eine 0,5 höhere Stufe
fx-confer-pair         zwei Requisiten, 8 s Dialog, kein Text
fx-emotion-triple      neutral · happy · angry, gleiche Pflanze, gleiche Kamera
```

Je Fixture: `seed`, Kamerazustand, Auslöser, **erwarteter primärer Read**, erwartete Dauer,
verbotene Überdeckungen.

### 6.2 Tore — ein Slice besteht nur, wenn alle grün sind

1. **Ein Blick genügt:** in einem Standbild aus der Aktionsmitte ist erkennbar, was passiert.
2. **Hierarchie:** genau ein primärer Read; sekundär und tertiär sind kleiner, kürzer, leiser.
3. **Budget eingehalten:** ≤ 1 primär, ≤ 2 sekundär, ≤ 3 tertiär, ≤ 1 Lautwort, ≤ 1 Kamera.
4. **Spacing trägt das Gewicht:** Fallpositionen weiten sich, Steigpositionen dichten sich.
   Gemessen aus der Positionsreihe, nicht behauptet.
5. **Recovery:** nach `withinMs` ist jede Transformation zurück, jeder VFX geräumt, der Zustand
   wieder `breathe`. Nachgewiesen durch Zustandsvergleich vor/nach, nicht durch Augenschein.
6. **Keine Quellmutation:** Prüfsumme der geladenen Geometrie vor und nach dem Lauf gleich.
7. **Keine Kollision mit S18-Toren:** Fehlschläge 0, Rezept-Rundlauf byte-identisch,
   Musterurteil unverändert — der Deformer darf das Rezept nicht anfassen.
8. **Konsole:** ausser der bekannten `THREE.Clock`-Warnung nichts.

### 6.3 Belege (Skill §12.1)

Je Fixture: Standbild vorher, Standbild nachher, kurze Wiedergabe, **gemessene** Dauer,
sichtbare Anker im Debug-Overlay, benannte semantische Klasse, benannte Hierarchie,
bestätigte Recovery. Ein Screenshot, der ein Problem zeigt, schlägt jede interne Kennzahl.

### 6.4 Debug-Overlay (Pflicht, Schalter in der Leiste)

Anker (Fuss · Körper · Krone · Gesicht) · Aktionspunkt · Kontaktpunkt · geschützte Flächen ·
Wortkandidaten und gewählter Kandidat · laufende Phase · Zeitmarke · aktives Preset ·
Zahl aktiver VFX · Zahl aktiver Lautwörter · Kamerahandlung.

---

## 7 · Reihenfolge des Baus (Skill §15)

```
1  SSOTs lesen: diese Datei, HANDOFF_WSA_S18.md, BACKLOG_PLANT_PROP.md
2  fx-breathe-single als einzige Fixture bauen
3  lib/plant-deformer.js: Squash/Stretch + Bend, Uniforms, stabiler Seed
4  breathe grün bekommen (Tore 1–8), erst dann weiter
5  poke → whack (Lautwort + geschützte Flächen kommen hier, nicht früher)
6  hop (Weltbewegung, Bodenstrahl, Bogen)
7  confer (zwei Akteure, Blickführung über den EyeRig-Adapter)
8  Audio erst, wenn der visuelle Read ohne Ton steht
9  Kamera erst, wenn sie den primären Read stärkt
10 CHANGELOG-Eintrag mit Zahlen und benannten Grenzen
```

---

## 8 · Was der Lead vor Baubeginn entscheidet

1. **Revisionsbindung** (Backlog P0-1): SHA-Pflege ja/nein. Ohne sie ist eine Choreografie
   gegen einen wandernden Stand geprüft.
2. **Inhalt oder Bewegung zuerst:** Kakteen/Fleischfresser/Pilze/Blumen/Früchte (Backlog P2)
   **vor** oder **nach** S19. Empfehlung: nach — Skill §14 verbietet Scope-Ausweitung vor der
   ersten korrekten Choreografie.
3. **`confer` in S19 oder S20.** Zwei-Akteur-Staging ist die aufwendigste der fünf Presets und
   die einzige, die eine Dialogquelle braucht.
