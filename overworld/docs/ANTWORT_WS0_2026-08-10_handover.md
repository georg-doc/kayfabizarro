# Antwort an WS0 — 10. August, auf den Handover

## 1 · Der Bildtakt-Befund war ein Treffer, auch bei uns

§3.1 gilt für unseren Code, und ihr hattet recht, es zu prüfen zu verlangen: **`loadZoneCard()`
stand im Zeichenpfad.** Drosselt der Browser die Bilder, heilt eine geräumte Zone ihre fehlende
Kartenkunst nie und zeigt dauerhaft die Rückseite — dieselbe Klasse wie euer `reconcile()`, nur bei
uns.

Behoben (V10-S24): der Heilpfad läuft jetzt in `step()`, höchstens eine Ladung je Sekunde. Euer
Merksatz steht als Kommentar an der Stelle: **was einen Zustand zeigt oder heilt, gehört nicht ans
Bild. Animation ja, Zustand nein.**

## 2 · Wo ihr meine Vorgaben korrigiert habt — alle drei angenommen

**§5.1 Augengröße.** Mein Fehler, und zwar ein methodischer: ich habe **eine** Einheit gemessen
(bodyH 72,8) und daraus »72–86« gemacht. Ihr habt alle 31 gemessen: **31–111 px**. Ein 13-px-Auge
ist auf dem Schaf 42 % der Körperhöhe und auf dem Bären 12 % — das sind zwei verschiedene Wesen.
**Euer Vorschlag gilt:** `0.16 × bodyH`, geklemmt auf 6…14. Eine absolute Zahl wären 31 Einträge,
die niemand pflegt. *Eine Spanne aus einem Beispiel ist keine Spanne.*

**§5.2 Food-Pack.** Auch mein Fehler — ich habe aus einem Screenshot geschlossen, was im Repo liegt.
**Die Zwiebel ist die bessere Antwort**, nicht der Notnagel: zehn fertige Stimmungen sind mehr
Ausdruck als drei Eskalationsstufen brauchen, und *eine* Zwiebel, die überall auftaucht, ist ein
Running Gag statt einer Requisitenkiste. Die Biome-Zuordnung (Pizza, Burger, Steak) wandert damit
auf die Einkaufsliste — sie war ohnehin Weltbau, nicht Voraussetzung.

**§5.5 Schrift.** Angenommen: **PottyMouth groß und wackelnd** statt einer zweiten Comic-Familie.
Dazu Georgs Präzisierung vom selben Abend: **Bangers gehört ausschließlich »BLÖDSINN!«** — nicht
dem Schrei allgemein. Alles andere Laute (Social Calls) nimmt Irish Grover. Damit habt ihr für die
dritte Snack-Stufe PottyMouth, und Bangers bleibt dem einen Wort.

## 3 · Der POP-Knopf gewinnt, und euer Einwand hat ihn gewonnen

**§5.4.** Ihr habt gestern gebaut, was die Tüte sein sollte — und *»ein Automat ohne Preisschild ist
ein Glücksspiel«* ist das bessere Argument. Mein »kein Menü« war zu pauschal: ich meinte *keine
Werte-Tabelle*, ihr habt *keine Preisliste* verstanden, und Preise zu zeigen ist nicht dasselbe wie
Werte anzuzeigen (K1 verbietet Letzteres, nicht Ersteres).

**Entscheidung, vorbehaltlich Georg:** die Liste bleibt und bekommt die **Anmutung** des Automaten —
Tüte als Kopf, Reihen als Fächer, Kauf als Auswurf mit Prellen. Die Tüte ist damit **HUD-Möbel**,
und in der Welt gibt es sie höchstens als stummes Requisit ohne Klick. Zwei Bedienstellen für eine
Währung wären zwei Wahrheiten, da habt ihr recht.

## 4 · Was ihr braucht — hier

- **`KFB Pet Studio v4.dc.html`** liegt jetzt in `export/fuer-WS0/`. Es war in unserem Projekt, nicht
  im Repo — deshalb habt ihr nur den 3D-Editor gefunden. Das Augen-Rig steckt in `_eyeRig` /
  den Lid-Parametern (`lashesP`, Lidschrägen); lest es, bevor ihr die vier Lider baut.
- **Googly Eyes zeichnen statt laden** — einverstanden, und euer Grund ist besser als meiner: vier
  Lider bekommt man aus einem Sprite nicht heraus, und gezeichnet skalieren sie mit `bodyH`.
- **`game.onLoot({card:{packId,n,t,l}, zone})`** — kommt so, mit `packId`. Eure Begründung ist
  richtig: ein Zähler würde euch zwingen, die Karte selbst zu suchen, und das wäre die zweite
  Wahrheit darüber, was gefunden wurde.
- **Ink-Presets `bend` / `torn`:** eure Anforderung ist brauchbar und der Punkt mit der **absoluten
  Federbreite** ist der wichtige — `card` normiert auf `min(W,H)`, und bei 19:1 läuft das in die
  Klemme. Wir bauen beide mit eigener Normierung. Was wir noch brauchen: **ein Beispielmaß je
  Preset**, an dem ihr sie abnehmen würdet (»so sieht 446×24 richtig aus«), sonst raten wir am
  oberen Ende.
- **Die »Ignorieren«-Definition** (§5.5): euer Vorschlag gilt — Zeiger über dem Objekt **oder**
  Abstand sinkt über zwei Felder. Ohne das wäre die Eskalation doch wieder eine Uhr, und genau das
  wollten wir nicht.

## 5 · Kartensymbole

Sauber gemacht, und die Zuordnung über die **Wirkung** statt den Titel ist der richtige Schnitt —
eine neue Karte mit bekannter Wirkung bringt ihr Symbol mit. Der Nennsatz kommt in den Abspann:

> Icons von Lorc und Delapouite · game-icons.net · CC BY 3.0

Die elf SVG legen wir ins Repo (`media/2D_Assets/icons-rpg/`), dann stellt ihr auf `OW_SRC` um.

## 6 · Reihenfolge

**Re-Home S22 ist Schritt null** — richtig, und der Export liegt euch vor. Danach Skins-Sprint mit
Googly Eyes zuerst.

Und ein Hinweis zum Re-Home: `hud-v7.js` haben wir seit eurem Stand an **sechs** Stellen angefasst,
alle mit `WS1-Eingriff 9.8.` markiert (POP statt Level, sechs Werte aus `game.STAT_KEYS`, Farben aus
`STAT_INFO`, `openPts` am Kontostand, Slot-Preise aus `popCost`, Name/Titel-Zeile). Euer »neu
aufsetzen statt überstülpen« ist genau richtig — und wenn eure Fassung diese sechs Leser übernimmt,
könnt ihr unsere Eingriffe ersatzlos streichen.

**Stay fluffy.**
