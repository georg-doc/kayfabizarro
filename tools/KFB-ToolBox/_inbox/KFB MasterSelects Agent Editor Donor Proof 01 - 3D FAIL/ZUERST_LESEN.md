# Zuerst lesen — worum es hier geht

Stand: 12. Oktober 2026 · Für Georg, in normaler Sprache.
Die anderen Dateien in diesem Ordner sind für ausführende Agenten geschrieben. Diese hier ist für dich.

## Die Kurzfassung

Ich habe ein fremdes Programm getestet. Ergebnis: **eine Idee daraus ist wertvoll, das Programm selbst nicht.**

## Was getestet wurde

**MasterSelects**, ein Video-Editor von einem fremden Entwickler. Kein KFB-Werkzeug, nichts, was du jemals
bedienen musst oder sollst.

Der Fachbegriff im Auftrag war „Donor" — Spender. Die Frage war nie „benutzen wir das", sondern:
**Hat dieses fremde Programm eine Idee, die wir abschauen können?**

## Warum ausgerechnet dieses Programm

Weil es eine MCP-Brücke hat. Das ist dieselbe Technik-Familie wie Blender MCP: Ein Sprachmodell kann das
Programm fernsteuern, also Objekte verschieben, Werte ändern, speichern.

Genau das war der Prüfgegenstand. Nicht die Oberfläche, sondern die Frage:
**Wie baut man eine Fernsteuerung für Agenten, die nicht gefährlich wird?**

## Was gut gelöst ist (und das ist die Ausbeute)

Vier Dinge, die das Programm richtig macht und die für KFB nachahmenswert sind:

1. **Trockenlauf.** Der Agent kann vorher fragen „was würde passieren?", ohne dass etwas passiert.
2. **Bestätigungspflicht.** Gefährliche Befehle werden verweigert, bis der Agent ausdrücklich bestätigt.
   Das gilt dort sogar für reine Lesebefehle, wenn sie sensible Daten berühren.
3. **Lückenloses Protokoll.** Jeder Befehl wird mitgeschrieben: Zeitstempel, Auftraggeber, und was genau
   sich geändert hat.
4. **Alles umkehrbar.** Jede Änderung lässt sich zurücknehmen, und das habe ich in beide Richtungen geprüft.

Dazu kommt: Das Programm hat genau **einen** Besitzer für seinen Zustand. Die Fernsteuerung baut keinen
zweiten Datenstand nach, sondern greift auf denselben zu. Das ist die Regel, die ihr bei KFB sowieso
verfolgt („kein zweiter Runtime-Owner") — hier konnte ich sie einmal in freier Wildbahn funktionieren sehen.

## Was nicht funktioniert

Die 3D-Darstellung. Und genau die wäre der Grund gewesen, das Programm für KFB-Szenen einzusetzen.

Auf deinem Mac bleibt das Bild komplett schwarz, sobald 3D-Inhalt dabei ist. Das ist kein Bedienfehler
von mir. Ich habe es in zwei unterschiedlich gestarteten Browsern reproduziert und zusätzlich mit einer
Gegenprobe abgesichert: Reine 2D-Inhalte rendern im selben Messaufbau einwandfrei. Die Messung stimmt
also, das 3D kommt trotzdem nie an.

Zwei Details, die das Bild abrunden:
- Sobald 3D-Inhalt in der Szene liegt, verschwindet auch das 2D-Material, das vorher sichtbar war.
- Nach einem 3D-Versuch arbeitet die Anzeige nicht mehr zuverlässig weiter.

Wichtige Einschränkung, damit das fair bleibt: Das heißt **nicht**, dass das Programm kaputt ist. Es heißt,
dass es auf diesem Mac mit dieser macOS- und Chrome-Version nicht zum Laufen zu bringen war. Beim Entwickler
läuft es vermutlich.

## Eine Falle, die ich fast übersehen hätte

Das Programm bringt eigene Prüfwerkzeuge mit. Die melden „keine Fehler", **auch wenn jedes einzelne Bild
leer ist.** Sie protokollieren nur, sie bewerten nicht.

Hätte ich nur auf das grüne Ergebnis geschaut, stünde jetzt ein falsches „funktioniert" im Bericht.
Das ist eine Lehre für künftige Prüfungen, auch bei euren eigenen Werkzeugen: **Ein grüner Testlauf ist
kein Beweis, solange niemand prüft, ob überhaupt etwas herausgekommen ist.**

## Empfehlung

**Muster abschauen, Programm nicht übernehmen.**

Die vier Sicherheitsregeln oben gehören in die KFB-eigene Agenten-Anbindung. Dafür braucht ihr keine
einzige Zeile fremden Code.

Code übernehmen ist ohnehin nicht erlaubt: Das Programm steht unter AGPL-3.0, einer Lizenz, die auf ein
Gesamtprodukt durchschlagen kann, in das man sie einbaut. Das wäre eine Rechts- und Produktentscheidung,
keine technische.

Das Programm als externes Werkzeug zu nutzen, wäre erlaubt — aber für 3D-Arbeit müsste erst jemand
nachweisen, dass es auf der Zielmaschine überhaupt ein Bild erzeugt.

## Was du tun musst

Nichts. Es läuft nichts mehr auf deinem Rechner, KFB wurde nicht verändert, nichts wurde veröffentlicht.

## Was als Nächstes sinnvoll wäre

Dem Entwickler von MasterSelects die Beobachtung melden und fragen, ob 3D auf Apple-Silicon-Macs
funktionieren sollte. Das ist eine kurze Nachricht, kein Projekt. Seine Antwort entscheidet, ob das
Thema 3D für KFB endgültig erledigt ist oder nur vertagt.

## Welche Datei wofür

| Datei | Für wen |
|---|---|
| `ZUERST_LESEN.md` | **Du.** Diese Seite. |
| `RETURN.md` | Agenten und spätere Chats: Gesamtergebnis, Risiken, Empfehlung |
| `GATE_02_RESULT.md` | Der Nachtest, der das 3D-Ergebnis endgültig geklärt hat |
| `TEST_REPORT.md` | Alle Befehle und Messwerte zum Nachvollziehen |
| `SOURCE.json` | Dasselbe maschinenlesbar |
| `evidence/` | Bildschirmfotos aus dem laufenden Test |
| `raw/`, `raw_gate02/` | Rohdaten der Messungen |
