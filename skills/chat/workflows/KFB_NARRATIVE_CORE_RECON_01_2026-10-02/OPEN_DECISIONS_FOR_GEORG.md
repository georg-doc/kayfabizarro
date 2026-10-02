# Offene Entscheidungen für Georg · KFB-NARRATIVE-CORE-RECON-01

Nur Fragen, die sich nicht aus den Quellen ableiten lassen. Zu jeder steht meine Empfehlung. **Fett** = blockiert den ersten Bau (SIM-01).

## Blockiert SIM-01

**G-02 · Welche Spender?**
Der Brief nennt nur Simulator v0.8. Es gibt aber zwei echte Vorlagen:
- **Gameplay-Engine (Juni):** kann schon 1–6 Plätze, den wechselnden King, Quest Fail, Zurufe und ein Protokoll pro Zug.
- **Simulator v0.8:** liefert Kartenkorpus, Match Card, Finale und Optik.

Empfehlung: beide nutzen, mit fester Zuordnung (Architektur §6). Sonst bauen wir die Mehrspieler-Runde neu, die es schon gibt.

**G-06 · Woher kommen Hunky, Dory und FrizzleBob für SIM-01?**
CritEngine ist leer. Die einzigen ausgearbeiteten Profile liegen im Sprint-01-Paket des Comic-Creators und sind nicht abgenommen.

Empfehlung: Sprint-01-Profile als markierte Zwischenlösung (`canon:false`) anheften. Parallel liefert CritEngine die drei Profile sauber nach (Slice S3).

**G-04 · Welche Fassung von Hunky und Dory gilt?**
Es gibt vier Fassungen:

| Quelle | Hunky | Dory |
|---|---|---|
| CritEngine | Senex | Puer |
| Cancel-This-Planet-YAML | Realitäts-Hausmeister | Moral-Inquisitorin und Archivarin |
| Mnemosyne/H&D-Flow | nihilistischer Technokrat | empathische Saboteurin |
| Sprint-01 | blaues Stielaugen-Alien | rot-orangener Blob |

Empfehlung: eine Kurzantwort von dir, welche Stimme am Tisch spielt. Die Optik aus Sprint-01 kann daneben stehen bleiben.

**G-11 · Wer besitzt das Gedächtnis?**
Es gibt zwei Entwürfe:
- `crit_memory.py`: läuft schon, merkt sich pro Figur Karten, King-Haltung und Zurufe.
- PR #272: Bewohner-Gedächtnis mit sozialen Fäden und AIDA, nur als Entwurf.

Empfehlung: SIM-01 schreibt nur Quittungen und keinen eigenen Speicher. Später übernimmt #272 die Rolle als Besitzer, `crit_memory.py` bleibt die Tisch-Auswertung, die daraus liest.

**G-12 · Darf SIM-01 überhaupt ein LLM benutzen?**
Die Regeln laufen ohne LLM. Nur der Erzähltext simulierter Plätze braucht Sprache.

Empfehlung: Standard ohne LLM, mit Vorlagen aus Kartentext und Figurenstimme. Ein LLM nur als abschaltbarer Zusatz, der außerhalb des Spielablaufs läuft und im Replay nie neu gefragt wird.

**G-01 · Bleibt das Vier-Lesarten-Finale?**
Plan, Humbug, Auszahlung und Blödsinn plus Bleistift-Zeile aus v0.8 gibt es in den Regeln nicht. Empfehlung: als optionale „Nachschau“ nach dem regulären Finale behalten. Es ersetzt das Finale nicht.

## Später entscheiden

- **G-03 · „Beat“:** Ein Zug hat 5 Beats nach den Regeln. Die 8 Simulator-Beats heißen künftig „Story-Panels“. Kurz bestätigen.
- **G-05 · NPC Norman:** Sitzt er am Tisch oder reagiert er nur? In CritEngine ist er „NPC“, im Sprint-01-Paket ein vollwertiger achter Pol.
- **G-07 · Advisory Council und Roundtable:** Als Linsen und Ausgabeformate nutzen, nicht als Spielfiguren? Empfehlung: ja.
- **G-08 · Alte Regeln in der NIE:** Die alte Freestyle-Regeldatei (M50) widerspricht der Regelseite: 8 Schritte, HUMBUG, Quest-Würfel startet bei 3. Bekommt sie einen Vermerk „ersetzt durch #kfb“?
- **G-09 · Zwei Regeldetails:**
  - Gibt es beim Finale-Zug ein King-Urteil?
  - Gilt +2 höchstens einmal pro Episode? Das steht in der Gameplay-Engine, aber nicht auf der Regelseite.
- **G-10 · Zuruf-Namen bei den Bewohnern:** PR #305 nutzt BINGO, BONGO, BOGGLE und BLÖDSINN mit anderer Bedeutung als die Regeln. Umbenennen, etwa in „Anschluss“, „Halten“, „Kippen“ und „Kollision“, oder die doppelte Bedeutung bewusst stehen lassen?
- **G-13 · Ort des neuen Moduls:** Vorschlag `tools/kfb-kayfabulation-sim/` im kayfabizarro-Repo. Oder lieber neben dem Simulator in Dropbox?
