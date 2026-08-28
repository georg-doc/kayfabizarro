# Vorschlag · Modulvertrag

**Art:** Vorschlag zur Setzung, kein Bauauftrag.
**Anlass:** Es gibt Verträge für **Daten**, aber keinen für **Module**.
**Konvention (hart):** keine Bindestriche als Satzzeichen, echte Umlaute, Kausalität über also und aber.

---

## 1. Das Problem, benannt

Für Daten sind die Verträge da: `index.json` beschreibt Decks, `pet-LIBRARY.json` beschreibt Pets,
`SOT_REGISTRY.md` sagt, wo der Kanon liegt, das Sprite-Manifest beschreibt Assets.

**Für Module gibt es nichts.** Die Overworld hat fünfundvierzig, dazu die Travel-Module, die
Minigames, die Terrain-Demos, der Kartencollage-POC, das Pinball. Jede Datei trifft eigene Annahmen
darüber, was zur Verfügung steht, und dokumentiert sie nirgends.

**Die Folgen sind bereits sichtbar:**

- Ein Modul lief auf three r128 mit `outputEncoding`, ein anderes auf 0.160 mit `outputColorSpace`. **Ohne Fehlermeldung, nur mit flauen Farben.**
- Ein POC lud three per Importmap von unpkg, das in der Zielumgebung gesperrt war. Das Modul lief gar nicht erst an, und die Ursache war nicht sichtbar.
- Hilfscode ist viermal dupliziert: Tween, Zeigerbehandlung, eingeschränkte Kamera, `roundedBox`.
- Niemand kann einer Datei ansehen, ob sie Deck-Daten braucht, bevor er sie öffnet.

**Ein Modulvertrag löst genau das:** das Modul **erklärt**, was es braucht, und der Wirt **liefert** es.
Was nicht erklärt wurde, ist nicht da.

---

## 2. Der Vertrag

Vier Regeln, mehr nicht.

| Regel | Bedeutung |
|---|---|
| **Dateiname ist Kennung** | `modules/CardCollage.js` heisst `CardCollage`. Kein zweites Namensfeld, das abweichen kann |
| **Docblock ist Pflicht** | Name, Kategorie, Fähigkeiten, Kanon-Version. Fehlt er, wird das Modul nicht geladen |
| **Fähigkeiten sind deklarativ** | Das Modul listet, was es braucht. Der Wirt spritzt genau das ein und nichts sonst |
| **Default-Export ist Pflicht** | Eine Klasse oder Fabrik mit festem Lebenszyklus |

### Beispiel

```js
/**
 * @kfb name        Kartencollage als Gelände
 * @kfb category    terrain
 * @kfb capability  three@0.160
 * @kfb capability  decks
 * @kfb capability  ink
 * @kfb capability  storage:read
 * @kfb view        3d
 * @kfb determinism seeded
 * @kfb since       v13
 */
export default class CardCollage {
  static describe(){ return { seedable: true, needsPointer: true }; }

  async init(ctx){            // ctx enthält NUR das Deklarierte
    this.three = ctx.three;   // die eine Instanz, die der Wirt hält
    this.decks = ctx.decks;   // aufgelöste Registry, Quelle schon geklärt
    this.ink   = ctx.ink;     // Kanon-Feder, nicht selbst gebaut
    this.rnd   = ctx.rng;     // geseedet, weil determinism: seeded
  }

  mount(el){}                 // in einen Container hängen
  update(dt){}                // ein Schritt, feste Zeitbasis
  resize(w, h){}
  dispose(){}                 // alles freigeben, überprüfbar
}
```

### Der Fähigkeitenkatalog

Bewusst kurz. Was nicht darin steht, gibt es nicht, und wer es braucht, meldet es an.

| Fähigkeit | Was der Wirt liefert |
|---|---|
| `three@0.160` | **eine** three-Instanz, vom Wirt geladen. Löst den Versionsbruch und den Ladeweg auf einen Schlag |
| `decks` | aufgelöste Registry samt Basis. Die Quellenkette (eigene Domain, RAW, Datei) hat der Wirt schon geklärt |
| `cards` | der Kartenbauer, also `createCardBuilder`, samt `cardGrid` aus den Daten |
| `ink` | die Kanon-Feder. **Damit erfindet niemand eine zweite** |
| `pets` | Cube-Pet-Bibliothek mit Augen-Rig und Motion |
| `audio` | Tonausgabe **mit der Regel: standardmässig aus**, Einschaltgeste beim Wirt |
| `storage:read` / `storage:write` | Speicher, getrennt nach Lese- und Schreibrecht |
| `pointer` | vereinheitlichte Zeigerbehandlung, damit iOS-Eigenheiten einmal gelöst sind |
| `rng` | geseedeter Zufall. **Wer `Math.random` benutzt, verletzt den Vertrag** |
| `clock` | feste Zeitbasis. Keine Uhrzeit, keine Bildrate als Zeitgeber |

**Die drei Kopffelder, die keine Fähigkeit sind, aber alles entscheiden:**

- **`view`**, also `2d`, `3d` oder `flat`. Macht das Schichtenmodell sichtbar, statt es zu erraten.
- **`determinism`**, also `seeded` oder `free`. Ein Modul mit `seeded` darf keine Uhrzeit und kein `Math.random` benutzen. **Davon hängt ab, ob Storymaps je wiedergegeben werden können.**
- **`since`**, die Kanon-Version. Damit sieht man einem Modul an, ob es drei Forks alt ist.

---

## 3. Was der Wirt übernimmt

Alles, was heute jedes Modul einzeln falsch machen kann.

| Wirt-Aufgabe | Welchen Fehler sie abschafft |
|---|---|
| **Bibliotheken laden und halten** | Versionsbruch zwischen Modulen, falscher Ladeweg, gesperrte Herkunft |
| **Farbraum einmal setzen** | Der stille Fehler: `outputEncoding` gegen `outputColorSpace`. Ohne Meldung, nur flau |
| **Quellenkette auflösen** | Jedes Modul baut heute seine eigene, meist ohne Rückfall |
| **Zeitbasis stellen** | Feste Schrittweite statt Bildrate, Voraussetzung für Determinismus |
| **Seed verteilen** | Gleicher Seed gleiche Sitzung, ohne dass Module sich absprechen |
| **Zeigerereignisse vereinheitlichen** | iOS-Sonderfälle einmal statt fünfmal |
| **Ton sperren, bis eine Geste kam** | Der Ausfall, den die Community am lautesten meldet |
| **`prefers-reduced-motion` durchreichen** | Qualitätsboden ohne Ansage |
| **`dispose` erzwingen und prüfen** | Speicherlecks beim Modulwechsel |

**Und eine Aufgabe, die den grössten Unterschied macht: der Wirt kann ein Modul ablehnen.** Wer eine
Fähigkeit benutzt, die er nicht angemeldet hat, bekommt sie nicht. Damit werden Annahmen zu Fehlern
statt zu Überraschungen.

---

## 4. Zwei Fenster: Steuerung und Ausgabe

Aus dem Vorbild übernommen, und für euch konkret nützlich.

- **Steuerfenster** mit Reglern, Modulliste, Messwerten, Debug-Überlagerung.
- **Ausgabefenster** mit ausschliesslich dem Bild.

**Warum das bei euch mehr ist als Bequemlichkeit:** für die geplanten Spielfotos aus dem
Comic-Seminar ist das der Unterschied zwischen einer Vorführung und einem Bildschirmfoto mit Reglern
darauf. Und es erzwingt eine saubere Trennung, denn ein Modul, das nur im Ausgabefenster läuft, kann
gar nicht heimlich auf UI-Elemente zugreifen.

Technisch genügt dafür ein zweites Browserfenster und ein `BroadcastChannel`, es braucht kein Electron.

---

## 5. Ereignis auf Methode, besonders fürs Pinball

Der zweite Gedanke aus dem Vorbild, und beim Flipper ist er am wertvollsten.

**Ein Modul gibt Methoden frei, der Wirt legt Ereignisse darauf.** Die Zuordnung steht in einer
Tabelle, nicht im Code.

```js
static methods(){
  return {
    flash:    { args: ['color', 'strength'] },
    shake:    { args: ['strength'] },
    speedline:{ args: ['direction'] },
    censor:   { args: ['region'] }
  };
}
```

```json
{
  "bumper":      ["flash:accent:0.6", "shake:0.3"],
  "ramp":        ["speedline:up"],
  "transgression": ["censor:center"],
  "drain":       ["shake:1.0", "flash:ink:1.0"]
}
```

**Der Gewinn ist kayfabe-rein:** die Show hängt am Ereignis, wirkt aber nicht zurück. Man kann die
ganze Inszenierung austauschen, ohne die Mechanik anzufassen. Das ist genau die Trennung, die im
Ludo-Beispiel als Bauprinzip bewiesen ist: Spektakel darf alles, die Rechnung nichts.

**Dieselbe Tabelle nimmt Tonauslöser auf.** Mehrband-Schwellenanalyse lokal, damit eine Suno-Spur
Bilder auslösen kann, ohne dass jemand Bilder von Hand setzt.

---

## 6. Umstellung der vorhandenen Module

**Nicht alles auf einmal.** Der Wirt kann beides tragen.

1. **Wirt bauen**, mit den Fähigkeiten `three`, `decks`, `rng`, `clock`, `pointer`.
2. **Zwei Module umstellen**, eines 2D und eines 3D. Vorschlag: der Kartencollage-POC und ein Overworld-Modul.
3. **Nicht umgestellte Module laufen weiter** in einem Rahmen ohne Vertrag, aber der Wirt markiert sie als `legacy`.
4. **Kanon-Regel setzen:** neue Module nur noch mit Vertrag.
5. **Erst danach** die vier duplizierten Hilfsstücke in Fähigkeiten überführen.

**Bewusst nicht am Anfang:** Hot Reload. Das ist bequem, aber es löst kein Problem, das heute Geld
kostet.

---

## 7. Themen-agnostisch, für andere Anwendungen

**Nichts am Vertrag ist an Comics oder Karten gebunden.** Was ihn trägt, ist die Trennung zwischen
*was ein Modul erklärt* und *was ein Wirt liefert*. Der Kern bleibt gleich, nur der
Fähigkeitenkatalog wechselt.

### Was immer gleich bleibt

Dateiname als Kennung · Docblock mit deklarierten Fähigkeiten · Default-Export mit festem
Lebenszyklus · Wirt lehnt Unangemeldetes ab · `determinism` als Kopffeld · `dispose` erzwungen.

### Was projektweise wechselt

| Anwendung | Fähigkeiten statt `decks` und `ink` |
|---|---|
| **Agenten-Visualisierung** | `agents`, `events`, `timeline`, `layout` |
| **Datenauswertung** | `dataset`, `schema`, `query`, `chart` |
| **Fachliche Nachschlagewerke** | `taxonomy`, `search`, `citation`, `locale` |
| **Lernwerkzeuge** | `progress`, `assessment`, `content` |

### Warum das gerade in einem Fachumfeld trägt

**Vier Eigenschaften des Vertrags sind dort mehr wert als hier.**

**Deklarierte Datenzugriffe sind prüfbar.** Wenn ein Modul `capability patientdata` anmelden muss, um
sie zu bekommen, ist die Liste der Module mit Datenzugriff eine Abfrage und keine Durchsicht. Wer
nichts anmeldet, bekommt nichts, und das ist belegbar statt behauptet.

**Getrennte Lese- und Schreibrechte** von Anfang an, also `storage:read` gegen `storage:write`. Das
nachträglich einzuziehen ist teuer, es vorher zu haben kostet nichts.

**`determinism` ist eine Nachvollziehbarkeits-Eigenschaft.** Ein Modul, das als `seeded` erklärt ist,
liefert bei gleicher Eingabe dasselbe Ergebnis. In einem Umfeld, in dem jemand nachfragen könnte,
warum etwas angezeigt wurde, ist das kein Komfort, sondern eine Anforderung.

**`since` und Kanon-Version machen Altlasten sichtbar.** Ein Modul, das gegen eine alte Fassung
gebaut ist, meldet sich selbst, statt still weiterzulaufen.

**Dazu der Vorführmodus aus Abschnitt 4**, der in Fachumgebungen eine zweite Rolle bekommt: ein
Ausgabefenster ohne Bedienelemente ist zugleich ein Fenster, in dem versehentlich nichts sichtbar
wird, was nicht sichtbar sein soll.

**Und die Ereignistabelle aus Abschnitt 5** ist ohne Änderung eine Zuordnung von fachlichen
Ereignissen auf Darstellungen. Statt Bumper auf Blitz eben Zustandswechsel auf Anzeige. Dieselbe
Tabelle, anderer Inhalt.

### Der Satz, der es zusammenhält

> **Ein Modul erklärt, was es braucht. Ein Wirt liefert genau das. Was nicht erklärt wurde, ist nicht da.**

Das ist übertragbar, weil es nichts über den Gegenstand aussagt, sondern nur über die Grenze zwischen
beiden.

---

## 8. Herkunft und Herleitung

**Quelle:** `github.com/aagentah/nw_wrld`, ein ereignisgetriebener Sequenzer zum Auslösen von Visuals,
Electron plus Node ab 20. **Lizenz GPL.** Ein Muster ist davon nicht betroffen, Code schon. Also die
Idee übernehmen, keine Zeile kopieren.

**Anlass:** Die Frage war, ob sich daraus etwas für das KFB-Pinball und andere Anwendungen lernen
lässt. Beim Lesen fiel auf, dass der interessanteste Teil nicht der Sequenzer ist, sondern der
**Modulvertrag**: Dateiname ist Kennung, ein Docblock deklariert Abhängigkeiten, der Wirt spritzt sie
ein, Default-Export ist Pflicht.

**Herleitung in vier Schritten:**

1. Der Vertrag dort löst ein Problem, das hier ebenfalls besteht, aber bisher unbenannt war. Es gibt **Verträge für Daten**, also `index.json`, `pet-LIBRARY.json`, die SoT-Registry, das Sprite-Manifest, aber **keinen für Module**.
2. Die Folgen liessen sich an bereits eingetretenen Fehlern belegen und nicht nur behaupten: der stille Farbraum-Fehler, der blockierte Importmap-Ladeweg, viermal duplizierter Hilfscode. Alle drei sind Fälle von unausgesprochenen Annahmen darüber, was zur Verfügung steht.
3. Daraus folgte, dass der Katalog **kurz** bleiben muss. Ein Vertrag, der alles erlaubt, erklärt nichts. Deshalb zehn Fähigkeiten und drei Kopffelder statt einer offenen Liste.
4. Die drei Kopffelder kamen nicht aus der Quelle, sondern aus dem eigenen Kanon. **`determinism`** stammt aus der Storymap-Wiedergabe und der Erkenntnis, dass Determinismus zusätzlich die Tür zu Mehrspieler ohne Backend offen hält. **`view`** stammt aus dem Schichtenmodell, also 2D für Papier und 3D für Welt. **`since`** stammt daraus, dass ein Masterplan drei Forks alt sein kann, ohne dass man es einer Datei ansieht.

**Ausdrücklich verworfen:**

| Verworfen | Warum |
|---|---|
| **Electron als Unterbau** | Die eigene Kette hängt daran, dass Dinge im Browser unter einer URL laufen. Derselbe Bruch wie bei einer Desktop-Engine |
| **Der 16-Schritt-Sequenzer** | Ein Flipper ist ereignisgetrieben, nicht taktgetrieben. Übernommen wurde nur die **Zuordnungstabelle**, nicht das Raster |
| **Hot Reload zuerst** | Bequem, löst aber kein Problem, das heute Geld kostet. Deshalb ans Ende der Umstellung |
| **Der Code selbst** | GPL. Copyleft würde auf alles Abgeleitete durchschlagen |

**Verwandte Setzungen, die hier einfliessen:** die Kayfabe-Trennung von Spektakel und Rechnung aus dem
Ludo-Beispiel, die Regel „Skripte erzwingen, das Modell urteilt" aus dem Produktions-Loop, und die
Invariante, dass Zierschichten den Zustand lesen, aber nie schreiben dürfen.

---

## 9. Offene Entscheidungen

1. **Vertrag setzen, ja oder nein.** Danach richtet sich alles Weitere.
2. **Fähigkeitenkatalog bestätigen** oder kürzen. Zehn ist bereits viel für den Anfang.
3. **`determinism` als Pflichtfeld** oder als Empfehlung? Ich rate zur Pflicht, sonst ist es in einem halben Jahr nirgends gesetzt.
4. **Welche zwei Module** werden zuerst umgestellt?
5. **Zwei Fenster einführen**, oder erst zum Seminar?
6. **Ereignistabelle im Pinball** ausprobieren, bevor der Vertrag steht, oder danach?
7. **Wo lebt der Wirt?** Eigenes Repo, oder neben den Skills im bestehenden.

---

*Ende. Ein Muster, keine Bibliothek. Der Wert liegt in der Grenze, nicht im Code.*
