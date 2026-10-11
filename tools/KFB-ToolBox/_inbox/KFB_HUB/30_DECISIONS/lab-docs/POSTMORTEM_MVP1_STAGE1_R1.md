# Post-Mortem R1 · Warum die Basics nicht halten (MVP-1, Stand 2026-10-10)

Verfasst von der Steuer-Sitzung (Claude Code). Ehrlich, ohne Schönfärben. Anlass: Georg am 10.10.: „Wieso klappen noch nicht einmal unsere basic SSOTs? … Wieso fehlen euch alle mentalen Modelle, selbst für bis ins letzte Detail beschriebene Basics wie Straßenbett, Brücken, Architektur?“

## 1 · Befund in Zahlen

| Baustelle | Messung Q | Kritiker (≥ 8 nötig) |
| --- | --- | --- |
| Lab Stufe 1, Lauf 02 / 03 | bestanden | 4,3 → 5,0 (Stopp) |
| RKIT Steinbogen, Lauf 01 / 02 | bestanden | 5,1 → 5,4 |
| RKIT Gehweg/Bord, Lauf 02 | bestanden | 5,0 |
| RKIT Q-Rückprüfung Bauweise-Blatt v7 | fast alles durchgefallen | – |

Die Messungen bestehen, die Bilder nicht. Die Technik wird besser, die Gestaltung kaum.

## 2 · Die Geisterlinien: warum sie immer wiederkommen

Es war nie **eine** Linie, sondern drei verschiedene Fehler mit demselben Aussehen:

1. **Sprenkel S1:** ein `return` vor `fwidth()` im Shader; Ableitungen in verzweigtem Code sind undefiniert → gestrichelte Linien. Erst am 10.10. gefunden.
2. **Farbkarte gespiegelt:** Fehler schon in der Vorlage R2D v0 (`flipY`), 1:1 portiert → Farbstreifen und Farblinie an der Kante. Am 10.10. gefunden.
3. **Naht unter der Rundung:** Oberseite, Kantenrundung und Scholle sind **getrennte Körper**, die sich an einer Linie treffen. Jede kleine Abweichung in Normale, Farbe oder Schatten macht diese Naht sichtbar. Wird gerade behoben.

**Echte Ursache von Nr. 3 (Bau-Sitzung, 10.10.):** Oberseite und Scholle waren zwei getrennt erzeugte Netze, die nie vernäht wurden. Das Oberseiten-Netz endete in einem versteckten „Tauchstreifen“ unter der Rundung; der Scholle-Oberring war absichtlich 0,4 hoch und 0,15 hinter die Rundung gesteckt („Überlappung statt Stoß“). Unter der Lippe schnitten sich deshalb zwei Flächen entlang einer geraden Linie rund um die ganze Insel. Dort wechselten gleichzeitig Normale (40–60°), Knet-Relief, AO und Farbquelle (Farbkarte gegen Scholle-Farbe). Jeder frühere Fix glich nur eine dieser Eigenschaften an; die Überlappung zweier Körper blieb, und mit ihr die Linie. Lösung: Scholle-Oberring aus der letzten Reihe des Oberseiten-Netzes erzeugen (gleiche Vertices, Normalen, Rolle, AO, Schatten), keine Überlappung, plus automatischer Fugen-Test.

**Grundursache:** Wir haben Symptome einzeln bekämpft, statt die Bauart zu ändern. Solange die Insel aus zusammengesetzten Teilen besteht, entsteht an jeder Fuge eine Linie. Die Regel „keine harten Schnitte“ stand im Text, aber nicht in der Konstruktion.

## 3 · Warum die „mentalen Modelle“ fehlen

1. **Wir bauen aus Text, nicht aus Bildern.** Die SSOTs beschreiben Regeln (Viertelkreis, Bordstein 1,6, Läuferverband). Die Bau-Sitzungen übersetzen das in Rechenformeln. Wie es **aussehen** soll, steht nirgends als verbindliches Bild. Eine Formel kann alle Maße erfüllen und trotzdem wie ein Teller oder ein Kasten aussehen.
2. **Kein Entwurf vor dem Bau.** Bei Architektur und Brücke wurde direkt gebaut. Ein Steinmetz oder Brückenbauer zeichnet zuerst. Das Formblatt kam erst in Lauf 02, und es war eine Skizze der Bau-Sitzung selbst.
3. **Jede Sitzung baut ihre eigene Welt.** RKIT hat das Gelände in Blender nachgebaut, obwohl es dem Lab gehört. So wurden Geländefehler zwei Mal gebaut und an der falschen Stelle bewertet. Erst seit heute wird alles im Lab auf der echten Insel geprüft.
4. **Die Vorlage war selbst fehlerhaft bzw. maßstabsfremd.** R2D v0 trug den Spiegelfehler und ist für Inseln mit einem Drittel der Größe gemacht. Bei Town wird die dicke Knet-Kante dadurch zur dünnen Krempe. Das hat niemand vorher geprüft.
5. **Steuerung hat Fehler durchgelassen bzw. verstärkt.** Ich habe die Brücke in Blatt v7 abgenommen, ohne die Bilder genau anzusehen, und eine Kritiker-Forderung („tropfende Ausläufer“) weitergegeben, die deiner Entscheidung vom 03.10. widersprach.

## 4 · Was jetzt anders ist (wirkt bereits)

- Bauqualität Q1–Q9 per Skript **vor** jedem Bild; nichts Kaputtes erreicht dich mehr.
- Blinder Kritiker mit Vergleichsbildern je Bereich (`REFS.md`).
- RKIT liefert nur Teile; Bewertung im Lab auf der echten Insel.
- Stopp-Regel nach zwei Runden statt endloser Flickerei.

## 5 · Was sich ändern muss (Entscheidung Georg 10.10.: Weg A)

1. **Erst Entwurf, dann Bau:** Claude Design entwirft Town und Protopia und liefert **Golden-Referenzen** für die Basics (Kante, Übergang, Straßenrand mit Bord, Steinbogen mit Widerlager-Nische, Pfeiler-Brocken). Georg nimmt die Bilder ab. Danach sind sie **Ziel für die Bau-Sitzung und Maßstab für den Kritiker**, statt Text-Regeln allein.
2. **Eine Insel, ein Körper:** Oberseite, Kante und Scholle als ein durchgehendes Netz bzw. mit einer gemeinsam erzeugten Fuge (gleiche Normalen, Farbe, Schatten). Kein Zusammenstecken mehr.
3. **Vorlage vor dem Port prüfen:** Jede Vorlage bekommt einen Port-Test auf Bild-Ebene (gleiche Kamera, gleiche Insel), bevor wir darauf aufbauen.
4. **Georgs Vorlagen-Grafiken:** helfen, wenn sie das **Aussehen** eines Elements zeigen (z. B. eine Skizze „so sieht eine gute Inselkante bzw. Brückenwurzel aus“). Sie werden dann Teil der Golden-Referenzen. Du musst sie aber nicht zeichnen: Claude Design legt Entwürfe vor, du wählst aus.
5. **Steuerung:** Ich sehe jedes Bild selbst in voller Größe an und gebe keine Kritiker-Forderung weiter, ohne sie gegen frühere Entscheidungen zu prüfen.
