# Wiederverwendbare Methode für visuelle Videoanalyse

## 1. Quelle festhalten

Für jedes Video erfassen:

- Titel, Creator/Kanal, URL und Veröffentlichungsdatum;
- Dauer und vorhandene Kapitel;
- behandelte Asset-/Software-Version;
- ob der Creator selbst spricht oder nur Material Dritter zeigt;
- ob die Quelle vollständig erreichbar ist.

Das Transkript wird einmal exportiert und nur als Index benutzt. Jede produktrelevante Aussage muss danach am Bild oder an der sichtbaren UI überprüft werden.

## 2. Relevante Stellen finden

Zuerst über Kapitel, Transkriptbegriffe und sichtbare Szenen grobe Bereiche markieren. Danach jeden Bereich langsam ansehen.

Für Bewegungen werden nicht beliebige hübsche Bilder gesammelt, sondern Phasen:

- Ausgangszustand;
- Beginn des Übergangs;
- deutlichste Misch-/Zwischenphase;
- Zielzustand;
- Fußkontakt oder Landekontakt;
- Rückkehr beziehungsweise Schleifenpunkt.

Für Blender- oder Engine-Einstellungen werden nur Bilder erfasst, auf denen die betreffende Einstellung lesbar ist.

## 3. Beobachtung und Deutung trennen

Jeder Befund erhält genau eine Kennzeichnung:

- `SEEN` — direkt im Bild oder in der sichtbaren UI belegt;
- `SAID` — vom Creator hörbar gesagt, aber nicht sichtbar belegt;
- `INFERRED` — nachvollziehbare Interpretation;
- `NOT_SHOWN` — in den geprüften Quellen nicht gezeigt;
- `SOURCE_BLOCKED` — technisch nicht prüfbar.

Eine Deutung darf nie als sichtbarer Fakt formuliert werden.

## 4. Bewegungsdetails erfassen

Wenn im Bild erkennbar, dokumentieren:

- benutzter Charakter beziehungsweise Rig;
- sichtbarer Clipname;
- Idle-, Walk-, Run-, Sprint-, Jump-, Strafe-, Backwards-, Dodge- oder Bow-Zustand;
- Start, Stop, Pivot, Turn oder Blend;
- Standbein, Fußkontakt, Passing Pose und Flugphase;
- Körpervorlage, Armhaltung, Schwerpunkt, Hüfte und Oberkörper;
- Root Motion oder In-place, aber nur wenn gezeigt oder ausdrücklich gesagt;
- sichtbare Abspielgeschwindigkeit, Blendzeit, Parameter oder Importoption;
- Eingabe beziehungsweise Zustandsbedingung, sofern sichtbar.

Bei unlesbarer UI steht `UNREADABLE`; Werte werden nicht geraten.

## 5. Bilder begrenzen

Pro Thema normalerweise drei bis sechs Bilder. Jedes Bild muss eine konkrete Frage beantworten. Für einen Gangzyklus sind beispielsweise Kontakt, Passing und Gegenkontakt sinnvoller als sechs nahezu identische Bilder.

Dateinamen:

`<video-id>_<hh-mm-ss>_<topic>_<phase>.webp`

Jedes Bild erhält direkt im Kontaktbogen:

- Zeitmarke;
- Themen-/Phasenname;
- Kennzeichnung `SEEN`, `SAID` oder `INFERRED`;
- Link zum Originalvideo mit Zeitparameter.

## 6. Vergleichsauftrag ableiten

Für jeden belegten Moment wird eine kleine Blender-Aufgabe formuliert:

- Figur/Rig;
- Clip;
- Zeitpunkt oder normalisierte Clipphase;
- Kamerablick, soweit aus dem Video ableitbar;
- sichtbare Einstellung;
- zu vergleichendes Merkmal.

Der Recherchechat entscheidet nicht `KEEP` oder `REJECT`. Das macht der nachfolgende Blender-/Designvergleich.

## 7. Qualitätsprüfung

Vor Rückgabe prüfen:

- Jede Hauptaussage hat Video und Zeitmarke.
- Bildbefund und Tonspur sind getrennt.
- Fehlende Themen sind als `NOT_SHOWN` markiert.
- Kein Screenshot wird als Game-Asset oder Lizenzfreigabe bezeichnet.
- Keine genaue Zahl wurde aus einer unscharfen UI geraten.
- Der Return enthält genau einen nächsten Executor.
