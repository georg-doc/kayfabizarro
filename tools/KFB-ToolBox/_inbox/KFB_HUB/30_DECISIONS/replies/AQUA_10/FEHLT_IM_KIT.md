# Aqua 1.0 · Fehlt im Kit (23.11.2026)

**Kurz:** Drei Interface-Teile lassen sich mit dem HUD-Kit (tex/hud) nicht regelkonform bauen. Das Kit markiert kein Teil als dehnbar (manifest.json enthält nur Größen), und ein Symbol ohne eigenen Ring gibt es nicht. Bis die Teile da sind, stehen diese Stellen als reiner Text mit Schatten im Spiel, ohne nachgebauten Rahmen.
**Stand:** Die Handwerks-Prüfung (dc-aquarium-radio/scripts/handwerk.js) ist auf Artefakt v71 in allen Szenen grün.
**Zu prüfen:** WS0 besorgt die Teile über den Webchat. Maße gelten in CSS-Pixeln bei 1×, geliefert werden bitte 2× (Klammerwert).

| # | Teil | Wo | Größe (1× / 2×) | Anforderung |
|---|---|---|---|---|
| 1 | Hinweisleiste | unten im Becken und im Meer, ein- bis zweizeiliger Hinweis | 560×72 (1120×144) Desktop, 440×64 (880×128) Handy quer, 497×72 (994×144) bei 529 px | Im Stil von prompt_pill, aber **ohne Fassung**. Entweder in diesen drei festen Breiten oder als ausdrücklich dehnbares Teil mit angegebenen Schnittkanten (Enden fest, Mitte nahtlos wiederholbar). |
| 2 | Prompt-Beschriftung | neben der Keycap, z. B. „Open the hatch“, „Take over“ | 200×52 (400×104), Text bis etwa 18 Zeichen | Kurze Leiste ohne Fassung, gleiche Höhe wie die Keycap bei 46 px Breite. Fest oder als dehnbares Teil wie in Zeile 1. |
| 3 | Symbole ohne Ring | nur falls prompt_pill mit Fassung bleiben soll: Karte, Lautsprecher, Figur, Taste | 34×34 (68×68) | Reines Symbol, passend für die quadratische Glasfassung der prompt_pill. Ohne eigenen Ring und ohne Knopfrahmen. |

**Nicht mehr nötig:** Die Tür-Felder liegen jetzt auf panel_wide in Originalproportion (Tafel mit Inhalt). Das ist die Rolle dieses Teils.

## Nachtrag 23.11. (Georg): Glanz in den Tafeln

| # | Teil | Wo | Anforderung |
|---|---|---|---|
| 4 | panel_wide und panel_tall mit weich auslaufendem Glanz | Tür, Fisch-Karte, Radio-Menü, Rap Sheet, Most Wanted | Der Glanz oben links läuft im Kit-Bild hart aus. Georg: lieber ohne Glanz, als dass er das Layout bestimmt. Bis zur Lieferung nutzt das Spiel abgeleitete Fassungen `panel_wide_ohne_glanz.webp` und `panel_tall_ohne_glanz.webp`: Glanzstelle mit der gespiegelten Ecke oben rechts derselben Tafel überblendet, sonst unverändert, gleiche Größe. |
| 5 | Hohes, breites Panel | Figurenblatt (Character sheet) | Falls das Figurenblatt eine eigene Tafel bekommt: etwa 560×420 (1120×840), sonst wie panel_tall. |
