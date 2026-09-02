# Nexus Castle v5 — Export

**Stand:** 2026-09-02 · Arbeitsdatei `Nexus Castle v5.dc.html` (~3580 Zeilen, ein File).
Konzept-Demo: ein Pixel-Dorf im Tiny-Swords-Stil, in dem Agenten, Prozesse und Freigaben als
Spielwelt statt als Dashboard dargestellt sind.

## Sofort ansehen

**`Nexus Castle v5 - standalone.html` — doppelklicken, läuft im Browser.** Kein Server, kein Build.
Aufbau dauert ~10 s, weil die Sprite-Blätter einzeln aus dem Netz kommen (siehe unten).

## Was hier drin liegt

| Pfad | Inhalt |
|---|---|
| `Nexus Castle v5 - standalone.html` | **Ein Doppelklick, läuft.** Alles Lokale ist eingebacken. |
| `quellcode/Nexus Castle v5.dc.html` | aktueller Stand, die Arbeitsdatei |
| `quellcode/Nexus Castle v4.dc.html` | geparkt: Stand vor Gummitwist, R6 und Treppen-Werkzeug |
| `quellcode/Nexus Village v3.dc.html` | geparkt: Dorf ohne Höhenstufen, der Vorgängerkorpus |
| `quellcode/support.js` | Laufzeit für die `.dc.html`-Dateien (liegt daneben, wird relativ geladen) |
| `doku/HANDOVER-Nexus-Castle-v5.md` | **hier anfangen** — was v4 kann, was v5 soll, offene Baustellen, Fahrplan bis v6 |
| `doku/BAUKASTEN-Konstruktionsregeln.md` | globale Regeln R1–R6: Eingang von unten, keine Überlappungen, Sockel-Kollision, Zellregeln |
| `doku/BAUKASTEN-TinySwords.md` | Regelwissen: Terrain-Ebenen, 4×4-Autotile, Foam/Schatten als Stempel, Units, 9-Slice, ATLAS, FX, Leylines, Leistungsregeln |
| `doku/CHANGELOG-Nexus-Village.md` | additiver Verlauf, Bugnummern bis #73, Fehlschläge inklusive |
| `doku/ONBOARDING-NEXT-CHAT.md` | Einstieg für den nächsten Bau-Durchgang |
| `doku/HANDOVER-Nexus-Castle-v4.md`, `doku/HANDOVER-Nexus-Village-v3.md` | Vorgänger-Stände |
| `doku/QA-Nexus-Village-v3.md`, `doku/POSTMORTEM-UI-v3.md` | Prüfbefunde und die UI-Lehre aus v3 |
| `doku/github.md` | Quell-Repos, Screen-Map, letzter Sync |

## Was das Standalone kann und was nicht

Eingebacken ist alles, was im Projekt lag — Code, Laufzeit, Fonts. **Zur Laufzeit aus dem Netz**
kommen die Sprite-Blätter (40+ PNGs per `raw.githubusercontent` aus `georg-doc/kayfabizarro` und
`georg-doc/lietz-nexus`). Bewusst so: die Assets bleiben in ihren Repos, nichts wird dupliziert.

**Ohne Netz bleibt das Bild leer.** Wer eine netzunabhängige Fassung braucht, muss den Atlas bauen —
er steht ohnehin als grösster Hebel für die Ladezeit im Handover.

## Bedienung

Ziehen schwenkt die Karte · Mausrad zoomt · Klick auf Held oder Gebäude öffnet die Karte ·
**Leyline anfassen und ziehen** verformt die Bahn; auf begehbarem Grund loslassen legt sie neu,
im Nirgendwo schnalzt sie zurück · **E** Editor · **L** Leylines an/aus · **Tab** UI einklappen ·
**Esc** schliesst alles · im Editor **Strg+Z / Strg+Y** Undo/Redo.

Im Editor: Höhen malen, Gebäude ziehen, Wegpunkte und Kanten, Treppenspalten, Abbau-Orte, Spawn,
Requisiten, Kader. Karten-Slots liegen im `localStorage`, Export/Import als JSON (MapConfig v1).
Die Prüfungen R1–R6 laufen nach jedem Schritt und **melden** Befunde — sie reparieren nichts.

## Was v5 gegenüber v4 neu hat

- **Anfassbare Leylines** ("Gummitwist") — Bahnen greifen, verformen, neu legen; Zurückschnalzen als
  gedämpfte Feder.
- **Weg hinauf zur Burg** — `linkPlateau()` gibt jedem Haus auf einer Stufe einen Wegpunkt oben,
  in derselben Treppenspalte wie die Anfahrt.
- **R6, Anschluss-Prüfung** — Breitensuche vom Marktplatz meldet Wegpunkte ohne Verbindung.
- **Treppen-Werkzeug** — Treppenspalten sind Karten-Daten statt aus Häusern abgeleitet.

Offen und im Handover benannt: Ladezeit (Atlas), stufige Sandkanten, seitliche Treppen-Kachel,
Leistung nie am laufenden Bild gemessen. Card Zone ist v6, Raids danach.

## Lizenz und Herkunft

Sprites: **Tiny Swords** von Pixel Frog (CC0), bezogen über die Repos oben.
Code und Konzept: Georg v. Westphalen / DocCheck.
