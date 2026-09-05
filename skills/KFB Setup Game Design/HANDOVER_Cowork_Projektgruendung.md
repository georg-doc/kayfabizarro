# Handover an Cowork · Projektgründung abstimmen

**Stand:** 03.09.2026
**Beiliegend:** Gründungsdokument (Entwurf), Frankensteining Lab, Prompt Lab.
**Zweck:** Abstimmung und Ausarbeitung, bevor ein frisches Design-Projekt angelegt wird.
**Konvention (hart):** keine Bindestriche als Satzzeichen, echte Umlaute, Kausalität über also und aber.

---

## 1. Worum es geht, in drei Sätzen

Es liegen **über zwölf Artefakte** vor, jedes ein sauberer Einzelbeweis, und **keines lässt sich mit
einem anderen zusammenbauen**. Die Ursache ist nicht der zu kleine Schnitt, sondern dass jedes eigene
Annahmen mitbringt und keines gegen einen Vertrag gebaut wurde. **Ein frisches Design-Projekt soll
selbst der Wirt sein**, gegen den alles Weitere gebaut wird.

---

## 2. Die drei Dokumente

| Dokument | Rolle |
|---|---|
| **Gründungsdokument** (Entwurf) | Was ins Projektwissen gehört, wie der Wirt aussieht, was der erste Auftrag ist |
| **Frankensteining Lab** | Über 70 Setzungen und über ein Dutzend Post Mortems. **Vertragsbestandteil, nicht Lektüre**, denn dort stehen die Zahlen, die sonst neu gemessen würden |
| **Prompt Lab** | Wie Agenten-Läufe geordnet und geprüft werden. Enthält die Trennung der zwei Achsen: **wenige Rollen, voller Umfang** |

---

## 3. Was vor dem Start erledigt sein muss

**Georgs Vorbedingung, und sie steht zuerst, weil alles Weitere darauf steht.**

### 3.1 Skills und Embeds prüfen und aktualisieren

| Datei | Was zu prüfen ist |
|---|---|
| **`EMBED_CUBE_PET_FULL_v2.2.md`** | **Höchste Priorität.** Georg nennt die Pets ausdrücklich. Stimmt der Vertrag noch, ist das Augen-Rig aktuell, funktioniert `narratorPromptRef` |
| **`kfb-embed-bundle v3`** | Einstiegspunkt ist `createCardBuilder`, **nicht** `buildCard`. Alle Geschwister müssen vom **selben Basis-URL** laden. Ist v3 der Stand, oder gibt es Neueres |
| **`kfb-cartoon-animation_v2`** | Deckt es das ab, was für Mech und Pets gebraucht wird |
| **`session-design-briefing.md`** v1.2 | Ist die Dachvorlage aktuell. Sie lädt die übrigen bei Bedarf nach |
| **`session-entry-use-what-works_v1.md`** v1.1 | Sieben Regeln gegen Regression. Unverändert gültig |
| **`living-document_v1.md`** | Form aller Living Documents |

**Ein Vertrag, der auf veralteten Bausteinen steht, ist kein Vertrag.** Deshalb vor dem Anlegen des
Projekts.

### 3.2 Asset-Bibliothek um Lizenz und Quelle ergänzen

`kfb-asset-library.json`, Stand 03.09.2026:

| | |
|---|---|
| Umfang | **10 466 Einträge** |
| Bilder | 5 435 · Ton 1 460 · Modelle 3 571 |
| Wurzeln | `media/2D_Assets`, `media/3D_Assets` |
| Je Eintrag | `path`, `kind`, `folder`, `texture`, **fertige `url`** |

**Der Wert liegt im `url`-Feld:** jeder Eintrag ist ohne Zutun ladbar. Damit entfällt das Abtasten von
Ordnern, das in der Vorsitzung mehrfach von Hand gemacht wurde, einmal sogar dreimal für dasselbe
Paket.

**Was fehlt: Lizenz und Quelle je Paket.** Ohne die ist es ein Verzeichnis und kein Manifest. Vier
harte Böden gehören dazu:

1. **Keine Lizenzdatei heißt Vollschutz**, also nicht verwendbar.
2. **Nicht kommerziell nutzbar**, etwa CC BY-NC. Pay What You Want ist kommerziell.
3. **Copyleft**, etwa GPL, schlägt auf alles Abgeleitete durch.
4. **Rastermaß nicht restlos teilbar** oder Leinwand je Figur uneinheitlich.

**Dazu die Dreiteilung der Quellen**, die im Lab bereits gesetzt ist: Assetquelle, bedingte
Assetquelle, Referenzquelle. Letztere in einen eigenen Ordner, vom Build ausgeschlossen. **Das Risiko
ist nicht die Absicht, sondern die Drift.**

**Und eine Regel aus einem Fehler:** Größen werden **nie aus dem Dateinamen gelesen**. Bei einem
Paket trugen alle zwanzig Dialogbox-Dateien eine falsche Bildgröße im Namen, und ein Lader, der sie
liest, schneidet Bruchstücke **ohne dass irgendwo ein Fehler auftaucht**.

### 3.3 Ton sichten

`media/3D_Assets/Audio/` mit `README_AUDIO.md` und `HANDOVER_audio-not-empty.md`.

**Der Name der zweiten Datei ist selbst der Befund**, also gehört sie gelesen, bevor jemand Ton
einbaut. Bitte prüfen, ob der Stand noch gilt und ob die 1460 Dateien im Manifest damit
übereinstimmen.

### 3.4 Zwei Nachträge in den Daten

- **`cardGrid` fehlt in `index.json`**, obwohl die SSOT ausdrücklich verlangt, dass diese Zahlen **nur** dort stehen. Sie werden derzeit als Konstanten mitgeschleppt.
- **Shop-Adresse je Deck** existiert nicht. Falls sie kommen soll, als **Alias**, nicht als Seed, denn eine Verkaufsadresse kann sich ändern und dann verschwindet die Welt eines Decks.

---

## 4. Was am Entwurf zur Abstimmung steht

**Vier Stellen, an denen ich eine Meinung habe und die trotzdem entschieden werden müssen.**

### 4.1 Zwei Module gleichzeitig statt eines

**Ein Vertrag, der nur ein Modul trägt, ist ungeprüft.** Deshalb: Wirt plus **zwei** Module als erster
Auftrag.

**Und damit es nicht wieder verwechselt wird, die zwei Achsen getrennt:**

| Achse | Klein anfangen? |
|---|---|
| **Rollen und Verrohrung** | **Ja.** Zwei Rollen genügen, Wellen und Integrator kommen später |
| **Umfang und Vertrag** | **Nein.** Vertrag zuerst, zwei Module. Kleiner Umfang ohne Vertrag erzeugt Bruchstücke | Vorschlag ist Welt aus dem Torus-POC und Begegnung aus dem Mech-Slice, weil beide Hälften
schon laufen und es damit ein reiner Integrationsfall ist. **Scheitert es, scheitert die Methode und
nicht der Inhalt.**

### 4.2 Zwei Tore statt einem

| Tor | Prüft |
|---|---|
| **1 · Modul allein** | Showcase-Ansicht. Beweist die Funktion, **nicht** die Verträglichkeit |
| **2 · Modul im Spiel geladen** | dasselbe Modul im Wirt, neben mindestens einem anderen |

**Genau Tor 2 wurde bisher übersprungen**, und das ist Georgs eigener Befund gewesen.

### 4.3 Die Kalibrierszene

Ein Rechteck in bekannter Farbe an bekannter Stelle, ein Text in bekannter Größe, ein Zähler mit
bekanntem Wert. **Zeigt das Bildschirmfoto sie nicht richtig, ist der Kanal unzuverlässig und jedes
spätere Urteil wertlos.** Besonders wichtig, weil das Werkzeug in Design nicht selbst gewählt wird.

### 4.4 Referenz für den Paarvergleich

**Nicht ein fremdes Spiel, sondern ein Kartenbild aus dem Deck.** Die Frage lautet nicht „sieht es
teuer aus", sondern **„gehört diese Welt in dasselbe Universum wie ihr Deck"**. Das Material liegt
ohnehin vor.

---

## 5. Was ich für die schwächsten Stellen des Entwurfs halte

**Selbstkritisch, damit es nicht erst beim Bauen auffällt.**

- **Der Wirt ist beschrieben, aber nicht geschrieben.** Dreizehn Fähigkeiten auf Papier. Ob sie in der Design-Umgebung so umsetzbar sind, ist unbewiesen.
- **Der Blindlese-Test braucht eine Instanz ohne Auftragskenntnis**, und wie das in Design praktisch geht, steht nirgends.
- **Die Rollentrennung ist in Design sequenziell**, also derselbe Chat wechselt die Rolle. Ob das reicht, um die Selbstfreundlichkeit zu vermeiden, ist offen. Der Urheber hatte getrennte Agenten.
- **Draw Calls in Dutzenden** ist gesetzt, aber für die Kombination aus Welt und Begegnung nicht gerechnet.

---

## 6. Rückfragen an Cowork

1. **Sind die Skills auf Stand?** Vor allem Pets und Embed-Bundle.
2. **Kann die Asset-Bibliothek um Lizenz und Quelle erweitert werden**, und wie viel Aufwand ist das bei 10 466 Einträgen?
3. **Gilt der Audio-Handover noch**, oder hat sich der Stand geändert?
4. **Wird `cardGrid` nachgetragen**, und wer misst es je Deck?
5. **Zwei Module oder doch eines?** Der Entwurf sagt zwei, mit Begründung.
6. **Fehlt etwas im Projektwissen**, das aus deiner Sicht dazugehört?

---

## 7. Herkunft und Herleitung

**Quelle:** ein öffentlich geteilter Agenten-Prompt samt Ergebnis und drei erläuternden Kommentaren
des Urhebers, dazu die vorhandenen KFB-Skills und die Befunde einer langen Arbeitssitzung.

**Anlass:** über zwölf Artefakte, die sich nicht zusammenbauen lassen.

**Herleitung:** Als Gegenmittel wurde zuerst ein **noch engerer Schnitt** vorgeschlagen. Georgs
Einwand hat gezeigt, dass genau das das Muster ist, das die zwölf Artefakte erzeugt hat. Daraus folgte
die Umkehrung: **nicht der Umfang war das Problem, sondern das Fehlen eines Vertrags**, und kleiner
Schnitt war nur die Notlösung dafür.

**Verworfen:** noch engerer Schnitt, Voxelwelt als Open World mangels prüfbarem Erfolgskriterium,
Städtebauer mit Cartoon-Anstrich weil er das Ziel statt der Methode kopiert, und vierzehn parallele
Agenten weil in Design nicht verfügbar.

---

*Ende. Erst die Bausteine prüfen, dann den Vertrag setzen, dann bauen.*
