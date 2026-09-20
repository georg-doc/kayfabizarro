# Claude Design Brief · KFB Production Hub UI v2

Status: **DESIGN BRIEF · KEINE ANNAHME VOR GEORG-REVIEW**  
Datum: 2026-09-19  
Zielseite: `https://kayfabizarro.pages.dev/kfb-hub/`  
Quellpfad: `georg-doc/kayfabizarro/kfb-hub/index.html`

## Auftrag

Gestalte den bestehenden KFB Production Hub als radikal knappe Arbeitsoberfläche neu. Keine neue Informationsarchitektur erfinden und keine Inhalte aus GitHub nacherzählen. Der Hub soll Georg in wenigen Sekunden zu genau einer nächsten Handlung bringen.

## North Star

> **Every letter and every pixel has to pay rent.**

Ein sichtbares Element muss genau eine dieser Aufgaben erfüllen:

- Handlung auslösen,
- aktuellen Zustand zeigen,
- eine Quelle eindeutig benennen,
- KFB-Identität tragen.

Wenn es keine davon erfüllt: entfernen oder erst bei Bedarf zeigen.

## Aktuell verworfene UI-Muster

Nicht übernehmen:

- großer Hero-Header mit Erklärtext
- „How to use this page“-Texte im sichtbaren Arbeitsbereich
- riesige KFB/DocCheck-Buttons mitten im Blickfeld
- Kartenwand als Startansicht
- wiederholte Beschreibungen von Dingen, deren Titel bereits eindeutig ist
- große Leerflächen und Mindesthöhen in Karten
- versteckte Pocket Inbox / Dropzone
- generische Dashboard-Chrome als vermeintlicher KFB-Stil

## Was im ersten Viewport bleiben muss

Nur:

1. kompakte Kennung `KFB Hub`,
2. kleine Fokuswahl `KFB / DocCheck`,
3. Suche,
4. sichtbare Pocket Inbox / Dropzone,
5. höchstens vier aktuelle Aufgaben,
6. höchstens vier aktuelle Briefings.

Stage und Repo dürfen als kleine Utility-Links in der Kopfzeile bleiben. Alles Weitere liegt hinter Suche, `Mehr` oder einem kompakten Browse-Modus.

## Pocket Inbox

Sie darf nicht in einem geschlossenen Akkordeon verschwinden.

Im ersten Viewport sichtbar:

- einzeilige Paste-/Notizfläche,
- klar erkennbare Datei-Dropzone,
- kleine Aktionen `Speichern` und `Exportieren`,
- Anzahl lokaler Einträge.

Keine Behauptung eines Uploads: Daten bleiben lokal im Browser, bis Georg exportiert.

## Aufgaben und Briefings

- kompakte Zeilen statt hoher Karten
- Titel zuerst; Status und Bereich als kleine Metadaten
- Beschreibung höchstens zwei Zeilen, standardmäßig eher eine
- primäre Aktion eindeutig, sekundäre Aktionen klein
- keine Informationen doppelt in Titel, Badge, Text und Button wiederholen
- erledigte Aufgaben dürfen verschwinden oder stark zurücktreten

## Progressive Disclosure

- Startzustand ist `Heute`, nicht `Alles`.
- `Heute` zeigt nur aktuelle Aufgaben, Briefings und Inbox.
- Suche darf über alle Projekte und Referenzen gehen.
- Historie, Regeln und lange Projektlisten erscheinen erst nach bewusster Auswahl.
- Mobile und Split-Screen sind echte Hauptansichten, keine nachträgliche Verkleinerung.

## Visuelle Richtung

- KFB: prägnant, physisch, editorisch, kein SaaS-Dashboard
- wenig Rahmen; Trennung eher durch Rhythmus, Typografie und klare Kanten
- Farbe nur für Status oder Handlung
- keine großen Pillen-/Tab-Flächen
- keine Dekoration ohne Navigations- oder Identitätsfunktion
- bestehende KFB-Wortmarke oder Typografie-Donors verwenden; keine Ersatzmarke erfinden

## Anti-Slop-Guardrails

Lies vor dem Entwurf vollständig:

- `skills/chat/ANTI_SLOP_VISUAL_BRIEF_GUARDRAILS.md`
- `skills/session-entry-use-what-works_v1.md`
- `KFB-Stunt-Car-Race/_handover/HUD_RIG_V1_AI_SLOP_POSTMORTEM_2026-09-19.md`

Insbesondere:

- kein generischer Ersatz für vorhandene KFB-Donors,
- kein Placeholder, der später zur Architektur wird,
- kein „responsive = passt in den Viewport“-Scheinbeleg,
- kein technischer PASS als Design-PASS.

## Erster Design-Gate

Liefere zunächst genau drei statische Ansichten desselben Entwurfs:

- Desktop 1440 × 900
- Split-Screen 900 × 900
- Mobile 390 × 844

Markiere in jeder Ansicht:

- erste Hauptaktion,
- sichtbare Dropzone,
- belegte freie Fläche,
- Elemente, die erst nach Interaktion erscheinen.

Noch keine neue Feature-Logik. Noch keine neue Datenstruktur.

## Abnahmefragen

1. Ist ohne Lesen eines Erklärabsatzes klar, was heute zu tun ist?
2. Ist die Dropzone sofort sichtbar?
3. Bleiben Split-Screen und Mobile unter einer Bildschirmhöhe handhabbar?
4. Zahlt jedes sichtbare Element Miete?
5. Wirkt es wie KFB-Arbeitsoberfläche statt generisches Dashboard?

Wenn eine Antwort nein ist, nicht polieren. Entwurf reduzieren.

## Rückgabe

- vollständiger Code-Export
- die drei Screenshots
- Liste entfernter Elemente und Begründung
- Liste wiederverwendeter Donors mit Pfad/Revision
- keine Live-Promotion vor Georgs visueller Annahme
- nach zwei erfolglosen Reparaturpässen stoppen und Recovery-Export liefern

