# Briefing · Animation Lab v5 + Waffen-Regler
*Für einen frischen Chat. 13.09.2026. Geschrieben so, daß er ohne die Vorsitzung auskommt.*

## Was du baust und was ausdrücklich NICHT

**Du baust:** `KFB Animation Lab v5` auf der Grundlage von **v1** (nicht v4 — v1 ist reicher an
Clips und Bedienung; v4 hat nur den Waffenzweig weitergetrieben und ihn verbockt).

**Du baust NICHT:** Materialzonen, Kopfzonen, Wortmarke, Card Rider. Die gehören dem
**FrankenStein Studio v16** und kommen als **Konfiguration** herüber, nicht als Code. Wer sie im Lab
nachbaut, hat ab dem nächsten Tag zwei Wahrheiten.

## Die Arbeitsteilung, in einem Satz

**Das Studio entscheidet, das Lab spielt ab.** Das Studio ist Mess-, Aufsetz- und Kalibrierwerkzeug;
es schreibt eine JSON. Das Lab **liest** sie und rechnet nichts davon nach.

---

## Teil A · Die Waffenhaltung. Der wichtigste Teil, und der einzige, der schon gescheitert ist.

### Was vorgefallen ist (aus Georgs eigenem Postmortem, `lab-v4/POSTMORTEM_WEAPON_HOLD.md`)

Sechs Fehlversuche in einer Nacht. **Die Referenz `Character_Gun.gltf` lag die ganze Zeit vor** — in
ihr steht, wie KayKit die Waffe in die Hand legt. Sie wurde **sechsmal abgeleitet statt wörtlich
übernommen**. Versuch 5 war richtig und scheiterte nur noch daran, daß `FistR` und `handslotr`
nicht dieselbe Eigenlage haben.

**Die Lehre, und sie ist die Bauvorschrift für dich:**
> Eine vorhandene Referenz wird **wörtlich übernommen**, nicht abgeleitet. Was danach noch nicht
> stimmt, wird **an Regler gegeben** — nicht an eine weitere Herleitung.

### Was du konkret machst

1. **Lies `Character_Gun.gltf` aus** und nimm die Lage der Waffe relativ zu ihrem Elternknochen
   **so wie sie dort steht** (Position, Drehung, Maßstab — als Zahlen, nicht als Formel).
2. **Setze sie wörtlich** an den Handknochen der Figur. Keine Umrechnung »weil die Achsen ja anders
   liegen«. Wenn es schief steht, ist das der Ausgangspunkt der Kalibrierung, nicht ein Fehler.
3. **⚠ Die Eigenlage der beiden Knochen ist NICHT gleich.** `FistR` (unsere Figur) und `handslotr`
   (die Referenz) haben unterschiedliche Bindedrehungen. Das ist genau die Stelle, an der Versuch 5
   gestorben ist. Nimm die Differenz **einmal gemessen** heraus:
   ```
   delta = FistR.bindWorldQuaternion⁻¹ · handslotr.bindWorldQuaternion
   ```
   und schreibe in den Kommentar, daß es eine Messung ist und woher sie stammt.
4. **Sechs Regler** (Georg kalibriert damit **einmal** für den Main-Blaster):
   `posX` · `posY` · `posZ` (in Knochenlängen, nicht in Weltmaßen — sonst gilt es nur bei einer
   Figurengröße), `yaw` · `pitch` · `roll` (Grad).
   Dazu ein Knopf **»wie in der Referenz«**, der alle sechs auf null stellt.
5. **Der Stand fällt als JSON heraus** und geht in den Vertrag (siehe Teil C). Das Lab liest ihn
   beim Start; es rechnet die Lage **nie** selbst aus.

### Abnahme, an der du dich messen läßt
- Die Waffe steht bei **allen** Waffen-Clips an derselben Stelle in der Hand (nicht nur im Idle).
- Die Zahl, die Georg einstellt, steht nach Neuladen wieder da.
- Zwei selbst gerenderte Standbilder aus verschiedenen Clips, nicht »sieht gut aus«.

---

## Teil B · Was v5 von v1 erbt und was dazukommt

**Erbt unverändert:** Clip-Liste, Abspielsteuerung, Kamera, alles was v1 an Bedienung hat.

**Kommt dazu:**
1. **Der Waffen-Zweig aus Teil A** — mit Reglern, nicht mit Herleitung.
2. **Look aus der Studio-JSON auflegen** statt eigener Farbregler. Konkret: `graft.mat` (Atlasfelder
   des Wirts), `graft.zones` (Kopf und Gesicht), `eye.sclera`/`eye.pupil`/`eye.oval`,
   `nose.color`/`brow.color`/`moustache.color`, `graft.wordmark`, `graft.donorEyes`.
   **⚠ Nicht selbst tinten.** Der Grund steht in der WSA-Übergabe §1: der Wirt hat EIN Material über
   alle Netze, ein Tint trifft zwangsläufig alles. Das Studio liefert fertige Leinwände; übernimm
   `frizzlegraft-v1/matzones.v1.js` als Modul, statt Farbe anders zu lösen.
3. **Posen aus `pose-rig.v1.js`**, inklusive `surf` und dem Feld `stagger`.

## Teil C · Der Vertrag zwischen Studio und Lab

Format: `kfb.pets/1`, ein Eintrag unter `pets[]`. Beispiele liegen in
`github.com/georg-doc/KFB-Stunt-Car-Race/tree/main/_inbox/Config_JSONs`.

Neu in v16 und schon drin: `graft.mat` · `graft.zones` · `graft.wordmark` · `graft.donorEyes` ·
`eye.oval` · `eye.sclera` · `eye.pupil` · `pose.stagger` · `cardRider`.

**Dein neues Feld:** `weapon` mit den sechs Reglerwerten, dem Referenznamen und der gemessenen
Eigenlagen-Differenz. Schreib den **Namen der Referenzdatei** mit hinein — sonst weiß in vier Wochen
niemand mehr, wogegen kalibriert wurde.

## Die Hausregeln, die hier Geld gekostet haben

1. **Messen → verstehen → Grenzfälle prüfen → bauen.** Die ersten drei ändern nichts.
2. **Referenz schlägt Beschreibung.** Ein übernommener Befund ist eine Vermutung, keine Messung.
3. **⚠ Vor jedem Standbild selbst rendern.** Im verborgenen Vorschaufenster parkt die Bildschleife
   (`document.hidden`) — der Zähler steht bei 35 Bildern und es sieht nach einem toten Bau aus.
   Der Fehler sitzt dann nicht im Bau.
4. **»getroffen« ist nicht »gesehen«** — Sichtbarkeit wird am Pixel gemessen, mit und ohne.
   Und andersherum: **nicht gesehen ist nicht kaputt** — erst die Blickrichtung prüfen.
5. **Eine Abnahmezahl, die vom Spielzustand abhängt, muß ein Verhältnis sein.**
6. **Eine Messung darf nichts speichern.** Wer über einen Bedien-Handler mißt, schreibt in Georgs
   Sitzung.
7. **Zwei Eigentümer für dieselben Netz-Indizes** sind die teuerste Fehlerklasse dieses Projekts.

## Bericht an Georg
Ein Satz, ein Beleg, drei Schritte, klare Frage mit benannten Optionen und markierter Empfehlung.
Kein Jargon, kein Denglisch, keine Zahlenketten.
