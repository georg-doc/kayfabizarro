# Gründungsdokument · KFB Design-Projekt

**Art:** Entwurf zur Abstimmung. Was ins Projektwissen gehört, wie der Wirt aussieht, was der erste
Auftrag ist.
**Konvention (hart):** keine Bindestriche als Satzzeichen, echte Umlaute, Kausalität über also und aber.

---

## 1. Die Diagnose, und sie ist nicht der Umfang

**Es gibt über zwölf Artefakte, jedes ein sauberer Einzelbeweis, und keines lässt sich mit einem
anderen zusammenbauen.**

**Die Ursache ist nicht, dass sie zu klein geschnitten waren.** Kleiner schneiden hätte nur mehr
Bruchstücke erzeugt. Die Ursache ist, dass **jedes seine eigenen Annahmen mitbringt**: eigenes
three-Laden, eigene Bedienleiste, eigener Zustand, eigene Zeitbasis, eigener Zufall, eigene
Quellenkette. Sie wurden **nebeneinander** gebaut, nicht gegeneinander.

**Der fremde Lauf, der in einer Stunde ein komponierendes Ergebnis erzeugte, hat es umgekehrt gemacht:
Vertrag zuerst.** Ordnerbesitz und Schnittstellen vor dem Code. Deshalb passte alles zusammen, obwohl
es viel größer angelegt war als jede einzelne Scheibe hier.

> **Der Umfang war nie das Problem. Die Struktur war es. Kleiner Umfang war die Notlösung für den
> fehlenden Vertrag.**

### Was die zwölf Artefakte trotzdem wert sind

**Die meisten sind keine Module, sondern Belege.** Ihr Produkt ist ein Befund, kein Code.

| Artefakt | Befund, der bleibt |
|---|---|
| Schussbahn-Slice | Sprites instanziert laufen bei zwei Draw Calls |
| Materialmessung | Farbanzahl, Saumanteil, Leinwandkonstanz je Paket |
| Torus-POC | Spiralpfad (6,5) deckt die Fläche ab, Naht schließt bei 10⁻¹⁵ |
| Collage-POC | Reißkante trägt, blind geviertelt ergibt 16:9 |
| Umgebungstests | nur cdnjs, Module ja, Addons nein |

**Diese Befunde stehen im Frankensteining Lab, also ist ihr Wert gesichert.** Der Fehler war die
Erwartung, dass sich Beweise zu einem Produkt zusammensetzen lassen. **Das tun sie nie, in keinem
Projekt.**

---

## 2. Das Projekt ist der Wirt

**Nicht ein Ordner mit Dateien, sondern die gemeinsame Grundlage, gegen die alles gebaut wird. Und das
Projektwissen ist der Vertrag.**

Ab Tag eins gilt: **kein Modul lädt three selbst, setzt den Farbraum selbst, baut eine eigene
Zeitbasis oder eine eigene Quellenkette.** Der Wirt liefert, das Modul meldet an.

---

## 3. Was ins Projektwissen gehört

### 3.1 Skills, verlinkt statt kopiert

**Alle sind bereits geschrieben und aktuell gepflegt. Sie werden referenziert, nicht nachgebaut.**

| Skill | Rolle im Projekt |
|---|---|
| **`session-design-briefing.md`** v1.2 | **Die Dachvorlage.** Wie geredet wird, in welcher Reihenfolge gearbeitet wird, und **was als Beweis zählt**, in sieben Bedingungen. Lädt die übrigen bei Bedarf nach |
| **`session-entry-use-what-works_v1.md`** v1.1 | **Anti-Regression.** Wenn eine Vorlage funktioniert, wird sie kopiert, nicht nachgebaut, nicht nachgerechnet. Sieben Regeln, jede durch einen Fehler bezahlt |
| **`living-document_v1.md`** | Form der Living Documents: Übergabe zuerst, Entscheidungen mit Kennung, Post Mortems mit Regel, Register zuletzt |
| **`kfb-cartoon-animation_v2`** | Bewegungsvokabular, Cartoon-Timing |
| **`kfb-embed-bundle v3`** | Karten-Einbettung. **Einstiegspunkt ist `createCardBuilder`**, alle Geschwister vom selben Basis-URL laden |
| **`EMBED_CUBE_PET_FULL_v2.2.md`** | Cube-Pets samt Augen-Rig und `narratorPromptRef` |
| `session-export_v1`, `session-cut_v1`, `workspace-sync_v1`, `georg_v1` | werden von der Dachvorlage bei Bedarf geladen |

**Vorbedingung, von Georg gesetzt:** diese Skills und Embeds, **vor allem die Pets**, werden vom
Coworker geprüft und aktualisiert, **bevor** das Projekt darauf aufsetzt. Ein Vertrag, der auf
veralteten Bausteinen steht, ist kein Vertrag.

### 3.2 Asset-Bibliothek

`kfb-asset-library.json`, Stand 03.09.2026, aus `georg-doc/kayfabizarro`.

| | |
|---|---|
| Umfang | **10 466 Einträge** |
| Bilder | 5 435 |
| Ton | 1 460 |
| Modelle | 3 571 |
| Wurzeln | `media/2D_Assets`, `media/3D_Assets` |
| Je Eintrag | `path`, `kind`, `folder`, `texture`, **fertige `url`** |
| Als Textur markiert | 458 |

**Der Wert liegt im `url`-Feld:** jeder Eintrag ist ohne Zutun ladbar. Damit entfällt das Abtasten von
Ordnern, das in der Vorsitzung mehrfach von Hand gemacht wurde.

**Was noch fehlt und ergänzt gehört:** je Paket **Lizenz und Quelle**. Ohne die ist die Bibliothek ein
Verzeichnis und kein Manifest. Vier harte Böden gehören dazu: keine Lizenz heißt Vollschutz, nicht
kommerziell nutzbar, Copyleft, und Raster nicht restlos teilbar.

### 3.3 Ton

`media/3D_Assets/Audio/`, mit `README_AUDIO.md` und `HANDOVER_audio-not-empty.md`.

**Der Name der zweiten Datei ist selbst der Befund**, also gehört sie gelesen, bevor jemand Ton
einbaut. Dazu die eigene Regel: **Ton standardmäßig aus**, Einschaltgeste beim Wirt, und prozedural
erzeugen außer wo Synthese hörbar scheitert.

### 3.4 Daten

| Quelle | Inhalt |
|---|---|
| `media/kfb/index.json` | Registry, **130 Decks**, Schema `kfb-deck-registry/v2` |
| Deck-JSONs | je 56 Karten mit `cardName`, `grade`, `power`, `lore`, `gradeReason`, `artworkPrompt` |
| `skills/SOT_REGISTRY.md` | Quelle der Wahrheit für den Kanon |
| `skills/kfb-ink-canon.js` | **die Kanon-Feder.** Importieren, nie nachbauen |

### 3.5 Befunde aus dem Lab

Das **Frankensteining Lab** mit inzwischen über 70 Setzungen und über einem Dutzend Post Mortems
gehört ins Projektwissen. **Nicht als Lektüre, sondern als Vertragsbestandteil**, denn dort stehen
die Zahlen, die sonst neu gemessen würden.

---

## 4. Der Wirt

**Was er liefert, damit kein Modul es selbst tut.**

| Fähigkeit | Was der Wirt stellt |
|---|---|
| `three@0.160` | **eine** Instanz, als ES-Modul. Löst Versionsbruch und Ladeweg |
| `renderer:webgl` | angemeldet, nicht vorausgesetzt. WebGPU wird abgelehnt statt still falsch zu laufen |
| `warmup` | Vorkompilierung der Materialien vor dem ersten sichtbaren Bild |
| `decks` | aufgelöste Registry samt Basis, Quellenkette schon geklärt |
| `cards` | `createCardBuilder` aus dem Embed-Bundle |
| `ink` | Kanon-Feder, Farbe `#1f1a14` |
| `pets` | Cube-Pet-Bibliothek samt Augen-Rig |
| `assets` | Zugriff auf die Bibliothek über `path`, liefert die `url` |
| `audio` | Ausgabe, **standardmäßig aus**, Einschaltgeste beim Wirt |
| `rng` | geseedet. **Wer `Math.random` benutzt, verletzt den Vertrag** |
| `clock` | feste Zeitbasis, keine Uhrzeit, keine Bildrate als Zeitgeber |
| `pointer` | vereinheitlicht, iOS-Eigenheiten einmal gelöst |
| `storage:read` / `storage:write` | getrennt nach Recht |

**Drei Kopffelder, die kein Modul auslassen darf:**

- **`view`**, also `2d`, `3d` oder `flat`. Macht das Schichtenmodell sichtbar.
- **`determinism`**, also `seeded` oder `free`. **Davon hängt Storymap-Wiedergabe und Mehrspieler ohne Backend ab.**
- **`since`**, die Kanon-Version. Damit sieht man einem Modul an, ob es drei Forks alt ist.

**Und Parameter werden deklariert, nicht gebaut.** Das wichtigste Feld ist `rebuild`, denn es
unterscheidet, ob ein Regler die Szene neu aufbaut oder nur einen Wert ändert. Die Leiste **liegt über
der Bühne und verschiebt sie nicht**, sonst wandert der Standpunkt.

---

## 5. Zwei Tore statt einem

**Das ist die Lücke, die alle bisherigen Runden hatten.**

| Tor | Prüft | Warum es allein nicht reicht |
|---|---|---|
| **1 · Modul allein** | Showcase-Ansicht, die nur dieses Modul zeigt | Beweist die Funktion, **nicht** die Verträglichkeit |
| **2 · Modul im Spiel geladen** | dasselbe Modul im Wirt, neben mindestens einem anderen | **Genau dieses Tor wurde bisher übersprungen** |

**Beide mit Bild und Protokoll**, denn Bild und Zahl gehören zusammen: eine falsche Konstante ist im
Bild unsichtbar, ein leerer Bildschirm in den Zahlen.

**Und die Kalibrierszene kommt vor beiden.** Ein Rechteck in bekannter Farbe an bekannter Stelle, ein
Text in bekannter Größe, ein Zähler mit bekanntem Wert. **Zeigt das Bildschirmfoto sie nicht richtig,
ist der Kanal unzuverlässig und jedes spätere Urteil wertlos.** Das ist besonders wichtig, weil das
Werkzeug hier nicht selbst gewählt wird.

---

## 6. Der erste Auftrag

**Rollen klein, Umfang nicht.**

> **Wirt plus zwei echte Module gleichzeitig.**

**Die zwei Achsen dürfen nicht verwechselt werden:**

| Achse | Klein anfangen? | Warum |
|---|---|---|
| **Rollen und Verrohrung** | **Ja.** Bauen, Rolle wechseln, kritisieren | Wellen und Integrator sind Verrohrung und kommen später |
| **Umfang und Vertrag** | **Nein.** Vertrag zuerst, zwei Module | Kleiner Umfang ohne Vertrag erzeugt Bruchstücke statt Bausteine |

**Und die Unterscheidung, die alles erklärt:**

> **Ein Beleg darf klein sein, ein Modul nicht.**

Ein Beleg liefert einen Befund und wird danach weggeworfen, also ist enger Schnitt richtig. Ein Modul
soll mit anderen zusammenspielen, also braucht es zuerst einen Vertrag. **Die zwölf Artefakte sind
Belege, die für Module gehalten wurden.**

**Begründung: ein Vertrag, der nur ein Modul trägt, ist ungeprüft.** Erst zwei Module unter demselben
Wirt zeigen, ob die Fähigkeiten stimmen, ob die Zeitbasis geteilt werden kann und ob das zweite Tor
überhaupt greift.

**Vorschlag für die zwei Module**, weil beide Hälften schon laufen und es damit ein reiner
Integrationsfall ist:

| Modul | Woher | Meldet an |
|---|---|---|
| **Welt** | Torus-POC, Spiralpfad, Karten im Gelände | `three`, `decks`, `assets`, `rng`, `clock`, `pointer` · `view:3d` · `determinism:seeded` |
| **Begegnung** | Mech-Slice, Schussbahn, VFX und SFX | `three`, `assets`, `audio`, `rng`, `clock` · `view:3d` · `determinism:seeded` |

**Scheitert das, scheitert die Methode und nicht der Inhalt.** Das ist bei einem ersten Lauf mehr wert
als ein großes Ergebnis.

**Reihenfolge im Projekt:**

```
0  Kalibrierszene                     was zeigt der Bildschirmfoto-Kanal?
1  Wirt mit den Faehigkeiten aus §4   noch ohne Inhalt
2  Modul A und Modul B parallel       beide melden an, keines laedt selbst
3  Tor 1 je Modul                     Showcase, Bild plus Protokoll
4  Tor 2                              beide im Wirt, nebeneinander
5  Erst danach ein drittes Modul
```

---

## 7. Wie gearbeitet wird

**Zwei Rollen genügen**, und mehr wäre Verrohrung vor dem Beweis.

- **Bauen.** Dann ausdrücklich **die Rolle wechseln**.
- **Kritiker mit verankertem Raster**, Bildschirmfoto und Mängelliste. **Ein Modell, das seine eigene Arbeit benotet, ist viel zu freundlich zu sich selbst.**
- Dann wieder bauen, mit der Liste.

**Böden als `BLOCK`, messbar und nicht benotet:** keine Konsolenfehler, gleicher Seed gleiche Welt,
Farbanzahl unter 40 je Sprite, weicher Saum 0,0 Prozent, Leinwand je Figur konstant, Fußpunkt an
genau einem Ort, Draw Calls in Dutzenden, mobil benutzbar.

**Wo nichts messbar ist:** blinder Paarvergleich, zwei Bilder, nur A und B, Reihenfolge gemischt.
Die Referenz hängt an der Bahn (siehe §8): **Deck-in-Welt** vergleicht gegen ein **Kartenbild aus dem
Deck**; ein **eigenständiges 3D-Spiel** vergleicht gegen den **Genre-Standard**, den es umsetzt.

**Abbruch:** drei Runden ohne messbare Verbesserung an einem Modul heißt anhalten, Stand schreiben,
nächsten Punkt benennen.

---

## 8. Was dieses Projekt nicht ist

- **Kein Sammelort für weitere Einzelbeweise.** Wer einen Befund braucht, baut ihn außerhalb und trägt das Ergebnis ins Lab. **Belege gehören ins Lab, Module ins Projekt.**
- **Kein Neubau vorhandener Module.** Registry, Ink-Kanon, Card Builder, Cube-Pets werden importiert. Ein zweiter Nachbau ist ein Fehler, keine Variante.
- **Kein Ort für Kanon-Entscheidungen.** Die fallen vorher und stehen im Lab.
- **Zwei Bahnen, nicht eine.** Der Deck-/Comic-Kanon (Ink-Feder, Kartenlook, `kfb-ink-canon.js`) gilt für **Decks und Karten-in-Welt** — dort ist er richtig. Für **eigenständige 3D-Spiele/Apps** (Voxel, Mech, Boxel Blitz …) gilt er **NICHT**: kein Ink-Outline, keine Tusche-Feder, keine Spielkarten-Motive, außer Georg fordert sie ausdrücklich an. Referenz ist der **Genre-Standard**, nicht die Kartenbilder; **PBR und Game-Industry-Basics sind kein Kanon-Verstoß.** KFB-Aroma ist eine **opt-in-Schicht NACH sauberen Basics**, nie ein Tor. *(Dieser Absatz hat Vorrang, wenn eine ältere Zeile „Kartenbilder = Referenz" oder „PBR = Verstoß" pauschal behauptet.)*

---

## 9. Offene Punkte vor dem Start

1. **Coworker prüft und aktualisiert die Skills und Embeds**, vor allem die Pets. **Vorbedingung.**
2. **Lizenz und Quelle je Paket in die Asset-Bibliothek nachtragen.** Ohne die ist sie ein Verzeichnis, kein Manifest.
3. **Welche zwei Module wirklich zuerst?** Vorschlag steht in §6.
4. **Wo lebt der Wirt?** Eigene Datei im Projekt, oder neben den Skills im Repo.
5. **`cardGrid` in `index.json` nachtragen**, es fehlt dort weiterhin.
6. **Wie wird der Blindlese-Test gelöst**, der eine Instanz ohne Auftragskenntnis braucht?

---

## 10. Herkunft und Herleitung

**Quellen:** ein öffentlich geteilter Agenten-Prompt samt Ergebnis und drei erläuternden Kommentaren
des Urhebers. Dazu die vorhandenen KFB-Skills, das Frankensteining Lab und das Prompt Lab.

**Anlass:** die Beobachtung, dass über zwölf saubere Einzelbeweise vorliegen, die sich nicht
zusammenbauen lassen.

**Herleitung:** Zuerst wurde als Gegenmittel ein **noch engerer Schnitt** vorgeschlagen, also eine
einzelne Begegnung statt eines Ausbaus. Georgs Einwand hat gezeigt, dass genau das **das Muster ist,
das die zwölf Artefakte erzeugt hat**. Daraus folgte die Umkehrung: nicht der Umfang war das Problem,
sondern das Fehlen eines Vertrags, und kleiner Schnitt war nur die Notlösung dafür. Der fremde Lauf
belegt es von der anderen Seite, denn er war viel größer angelegt und komponierte trotzdem, **weil
der Vertrag vor dem Code stand**.

**Verworfen:**

| Verworfen | Warum |
|---|---|
| **Noch engerer Schnitt** | Erzeugt mehr Bruchstücke, nicht weniger. War der Fehler, nicht die Kur |
| **Voxelwelt als Open World** | Kein prüfbares Erfolgskriterium. Wann ist eine offene Welt fertig? |
| **Städtebauer mit Cartoon-Anstrich** | Kopiert das Ziel des Vorbilds statt seine Methode, und die Referenz wäre wieder ein fremdes Spiel |
| **Erst ein Modul, dann das nächste** | Ein Vertrag, der nur ein Modul trägt, ist ungeprüft |
| **Vierzehn parallele Agenten** | In Design nicht verfügbar, und zwei Rollen bringen laut Urheber fast alles |

---

*Ende. Der Vertrag steht vor dem Code, und zwei Module beweisen ihn, eines nicht.*
