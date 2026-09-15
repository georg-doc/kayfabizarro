# Ergebnis B · Teil 1 · UX-Kritik am tatsächlichen Carl-Weg
*15.09.2026 · Jede Zeile hat eine Fundstelle. Wo nichts gemessen wurde, steht das da.
Prüfablauf aus dem Auftrag: **Carl wählen → Originalnase einstellen → eine benannte Materialzone
färben → Talk und Ruhe prüfen → Profil exportieren → im unabhängigen Embed laden.***

## Die Kernaussage
**Der Prüfablauf läßt sich in keinem der Werkzeuge durchgehen.** Schritt 1 (wählen) und Schritt 4
(Talk und Ruhe) fehlen im Rigging Lab; Schritt 3 (Zone färben) liegt dort hinter allem anderen;
Schritt 5 (exportieren) unterscheidet nicht, was er ausgibt. Der Weg zerfällt in zwei Werkzeuge mit
zwei Oberflächen und zwei Sitzungszuständen — das ist das Problem, nicht die Optik.

## Gemessene Grundlage
Rigging Lab v1, 924 px Dokumentbreite, nach dem Laden selbst gerendert:
**125 Bedienelemente · 26 Regler · 21 Farbfelder · 0 Auswahllisten · 1 Element mit fester
px-Breite (340) · kein waagerechter Überlauf** (`scrollWidth` = `clientWidth`).
Panel-Reihenfolge: **Eyes → Brows → Nose → Moustache → Zones**.

---

## 1 · Das Werkzeug hat keinen ersten Schritt
**Fundstelle** Kopfzeile »Rigging Lab · CapsuleCarl«; gemessen **0 Auswahllisten**, kein Roster.
**Problem** Carl ist fest verdrahtet. »Carl wählen« existiert nicht — die Auswahl liegt im Studio,
also in einem anderen Werkzeug mit anderer Oberfläche. Wer den Prüfablauf gehen will, wechselt
zwischen Schritt 1 und 2 das Programm.
**Vorschlag** **Select** als erster Schritt der gemeinsamen Hülle, Actor-Liste aus **einer** Quelle.

## 2 · Talk und Ruhe liegen nicht dort, wo geformt wird
**Fundstelle** Suche über alle Knöpfe nach `talk|viseme|idle|rest|emote` → **ein** Treffer: »Mouth«,
und der schaltet nur die fünf Formen `closed · open · wide · round · smile`.
**Problem** Schritt 4 verlangt wieder das Studio. Dabei liegt die Fähigkeit im **geteilten** Modul:
`PetMouth.talk(on)` und `talkBurst(dur)` sind öffentliche Methoden in
`petstudio-v9/studio-v3/pet-mouth.v1.js`, die beide Werkzeuge schon laden.
**Vorschlag** **Motion & Talk** als eigener Schritt. Keine neue Mundlogik — der vorhandene Griff.

## 3 · Die Zone aus dem Prüfablauf ist das Letzte, was man erreicht
**Fundstelle** Panel-Reihenfolge; »Zones« steht **hinter** Eyes, Brows, Nose und Moustache.
**Problem** Für »eine benannte Materialzone färben« scrollt man an 26 Reglern vorbei. Form und
Farbe stehen in derselben Spalte, obwohl es zwei verschiedene Aufgaben sind.
**Vorschlag** **Shape & Look** trennt Form von Farbe. Zonen als eigene Liste, benannt, mit Suchfeld
und gezielter Hervorhebung in der Vorschau.

## 4 · 21 freie Farbwähler statt einer Palette
**Fundstelle** 21 × `input[type=color]`.
**Problem** Drei Dinge zugleich: der freie Wähler erzeugt Farben außerhalb des Kanons; der gewählte
Wert ist nirgends als Zahl lesbar; ein »Original« je Zone ist nicht sichtbar. Für ein Werkzeug, das
Profile für Consumer ausgibt, ist eine unkontrollierte Farbe die teuerste Art von Freiheit.
**Vorschlag** Kuratierte Felder aus dem Kanon **plus** lesbarer Hexwert **plus** Original/Reset je
Zone. Freier Wähler nur als ausdrücklich benannter Sonderweg.

## 5 · 89 von 125 Bedienelementen sind unter 24 px
**Fundstelle** gemessen; die Regler sind **288 × 18**, das kleinste Element »Reset« ist **30 × 18**.
**Problem** Auf 768 × 1024 und 390 × 844 ist das nicht bedienbar. Auch am Schreibtisch ist ein
18 px hoher Griff für eine Nasentiefe von 0,002 Schritten eine Zumutung.
**Vorschlag** 32 px Mindesthöhe in der Bedienung; wo eine Aufgabe feiner sein muß, ein Zahlenfeld
neben dem Regler statt eines feineren Griffs.

## 6 · Vier Schriftfamilien in der Bedienung
**Fundstelle** gemessen in Bedienelementen: **Roboto · Roboto Slab · -apple-system · ui-monospace**.
**Problem** Der Auftrag verlangt Roboto mit System-Fallback. Roboto Slab ist eine Überschriftenschrift
und hat in einem Regler nichts zu suchen; `-apple-system` ist ein vergessenes Element.
**Vorschlag** Eine Familie in der Bedienung. Monospace **nur** für Meßwerte — dort ist sie richtig,
weil Ziffern nicht springen sollen.

## 7 · Ein Escape steht als Text im Knopf
**Fundstelle** Kopfzeile: der Knopf trägt buchstäblich **`Load\\u2026`** statt `Load…`.
**Problem** Klein, aber es steht in der Kopfzeile des Werkzeugs, mit dem Georg täglich arbeitet.
**Vorschlag** `Load…`. (Ein Zeichen, kein Umbau — erledigt im Piloten.)

## 8 · Der Ausgabebereich unterscheidet nichts
**Fundstelle** `Save setting` · `Load\\u2026` · **fünf** Knöpfe mit der identischen Aufschrift `Copy`.
**Problem** Der Auftrag verlangt vier unterscheidbare Ausgaben — **Profil speichern · Consumer-Paket ·
Vorschaubild · Video**. Vorhanden ist eine Sitzungsablage und fünfmal dasselbe Wort. Was in der
Ablage landet, sagt niemand: ein Profil-JSON ist kein Asset-Paket, ein GLB trägt keine prozedurale
Augen- und Talk-Logik, eine WebGL-Aufnahme trägt keine DOM-Flächen.
**Vorschlag** Vier benannte Ausgaben, jede mit einem Satz darüber, was wirklich drin ist — und die
nicht implementierten sichtbar als nicht implementiert, nicht weggelassen.

## 9 · Kein Hinweis auf ungespeicherten Zustand
**Fundstelle** Die Kopfzeile hat »Save setting«, aber keine Anzeige daneben. Das Studio hat eine
(`● unsaved` / `○ in sync`).
**Problem** Zwei Werkzeuge, zwei Verhalten. Im Rigging Lab weiß man nach zwanzig Reglerbewegungen
nicht, ob etwas davon gesichert ist.
**Vorschlag** Eine Anzeige, in der gemeinsamen Hülle, für alle Werkzeuge gleich.

## 10 · Der Feldbeleg liegt schon im Leser — und niemand zeigt ihn
**Fundstelle** `lab-v6/carlrig-mount.v1.js` gibt
`report: { applied[], rejected[], islands, hidden, mouthSet, brow, nose, face[] }` zurück.
**Problem** Keine Oberfläche zeigt das. Genau diese Liste ist der Nachweis, den R2 verlangt
(»eine erhaltene JSON-Zeile beweist nicht ihre Wirkung«) — und der in Ergebnis A offen geblieben ist.
**Vorschlag** Im Export-Schritt sichtbar machen: welches Feld ist **angewandt**, welches
**abgewiesen** und mit welcher Begründung. Das kostet keine neue Messung, nur eine Fläche.

---

## Was ich **nicht** gemessen habe
- **Die vier Prüfgrößen** (1440×900 · 1024×768 · 768×1024 · 390×844), geteiltes Fenster, Browserzoom.
  Mein Versuch, die Breite im laufenden Blatt zu klemmen, hat **nichts bewegt** — die Bühne ist
  absolut positioniert, also war die Klemme wirkungslos. Ein wirkungsloser Versuch ist **kein**
  Befund: das bleibt offen und gehört in einen echten Fenstertest.
- Tastaturweg und Fokus-Sichtbarkeit.
- Zweiter Reiter, zweiter Mixer, geteilter Materialcache zwischen Actors.
- Der Graft-Weg als Gegenprobe (Teil 2 des Piloten).

## Was gut ist und bleiben soll
Die Bühne ist ruhig und groß. Die Kamerastellungen (Front · 3/4 · Side · Eyes · Mouth · Below) sind
aufgabenbezogen, nicht dekorativ — das ist besser als ein freier Orbit allein. »Orig« neben »Copy«
je Block ist der richtige Gedanke, nur an der falschen Stelle. Und das Layout ist **fluid**: genau
ein Element trägt eine feste Pixelbreite. Der Umbau muß nichts auseinandernehmen.
