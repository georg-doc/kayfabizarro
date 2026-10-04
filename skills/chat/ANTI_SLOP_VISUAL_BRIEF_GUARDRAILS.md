# KFB Visual Brief Guardrails · Anti-Slop

Status: **CURRENT REFERENCE**  
Datum: 2026-09-19  
Auslöser: `KFB-Stunt-Car-Race/_handover/HUD_RIG_V1_AI_SLOP_POSTMORTEM_2026-09-19.md`

## North Star

> **Every letter and every pixel has to pay rent.**

Ein sichtbares Element bleibt nur, wenn es eine notwendige Handlung, einen aktuellen Zustand oder eine eindeutige KFB-Identität trägt. Alles andere wird entfernt oder erst bei Bedarf gezeigt.

## Pflichtblock für zukünftige visuelle Briefings

Jedes Briefing für UI, HUD, Hub, 3D-Props, Markenobjekte oder Asset-basierte Szenen muss diese Regeln ausdrücklich enthalten:

1. **Quelle vor Komposition.** Für jedes sichtbare Kernobjekt zuerst exakten Donor, Pfad, Revision und erwartete sichtbare Ausgabe nennen.
2. **Donor einzeln beweisen.** Erst isolierter Screenshot der echten Quelle, danach eine Integrationsnaht.
3. **Geladen ist nicht benutzt.** Eine richtige Asset-URL beweist keine visuelle Treue. Die Ausgabe der Quelle muss sichtbar wieder erscheinen.
4. **Keine ästhetischen Platzhalter.** Scheitert ein vorgeschriebenes Asset, zeigt der Build `SOURCE ASSET FAILED`. Kein Ersatzkörper, kein generischer Fallback.
5. **Kein Generic-UI-Leak.** Keine ungefragten schwarzen Panels, Badges, Readouts, Karten oder abgerundeten Dashboard-Kacheln.
6. **Marke nicht neu erfinden.** Vor Schrift, Wortmarke, Icon oder Ornament immer vorhandene KFB-Donors suchen und verwenden.
7. **FOV und Aufgabe vor Safe Area.** Innerhalb des Viewports ist nicht automatisch richtig. Die eigentliche Tätigkeit muss frei und lesbar bleiben.
8. **Identity before polish.** Keine Responsive-, CI-, Deployment- oder Animationspolitur, solange Quelle und Komposition sichtbar falsch sind.
9. **Screenshot vor PASS-Sprache.** Den echten Desktop-, Mobile- und gegebenenfalls Split-Screen-Screenshot gegen das Briefing prüfen, bevor „fertig“ oder „bereit“ gesagt wird.
10. **Grüne Tests sind kein grünes Produkt.** Technik, sichtbare Übereinstimmung und Georgs Annahme werden getrennt berichtet.
11. **Falschen Fork verwerfen.** Bei struktureller visueller Abweichung nicht weiterpatchen. Vom Donor neu starten.
12. **Zwei-Pass-Stop.** Nach zwei Reparaturpässen ohne Fortschritt am selben Gate: stoppen, vollständigen Export und Postmortem liefern.

## Verbotene Abkürzungen

- „source-backed“, wenn nur die URL oder Datei geladen wurde
- „responsive“, wenn der Inhalt zwar hineinpasst, aber die Hauptaufgabe verdeckt
- „KFB style“, wenn generisches UI nur anders eingefärbt wurde
- „fertig“, wenn nur CI grün ist
- „Fallback“, wenn ein vorgeschriebenes sichtbares Asset fehlt
- „v2“, wenn tatsächlich die abgelehnte v1 weitergepatcht wurde

## Pflichtbelege

Ein visuelles Slice liefert mindestens:

- Donor-Screenshot pro Kernobjekt
- integrierten Screenshot in der echten Nutzungssituation
- Mobile- und Desktop-Beleg; Split-Screen, wenn das die reale Review-Situation ist
- Liste jedes sichtbaren Elements mit Zweck oder Entfernung
- klare Trennung: implementiert / technisch getestet / visuell verglichen / von Georg akzeptiert

## Kurzer Review-Test

Vor Übergabe jedes sichtbare Element fragen:

1. Welche notwendige Handlung, Information oder Identität trägt es?
2. Ist es die echte Quelle oder eine Neuerfindung?
3. Könnte es verborgen oder entfernt werden, ohne die Aufgabe zu verschlechtern?
4. Verdeckt es die Haupttätigkeit?

Gibt es keine gute Antwort, zahlt das Element keine Miete und wird entfernt.

