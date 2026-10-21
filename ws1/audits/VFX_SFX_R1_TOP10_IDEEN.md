# Top 10 · Cartoon-Animation, Game-Art und Gameplay · Prüfer D · 21.10.2026

Diese Ideen kommen in KFB bisher nicht vor oder sind dort nur halb umgesetzt. Ich habe jede gegen den Code geprüft: Probe `gelaende-probe.html`, Spiel `kfb-planet-t439` @ `eac5cb0`.

Zu jedem Vorschlag stehen der Stand heute, die Idee, der Aufwand und das Risiko.

## 1 · Drift lädt den Boost (Mini-Turbo-Schleife) · Gameplay
**Stand heute:** Am Boden ist der Boost unbegrenzt. Das HUD zeigt in allen Testfahrten „Boost 100 %“, weil `P.boost` nur aus dem Flugkessel kommt (Probe, `step()`). Damit gibt es keine Entscheidung und keinen Rhythmus.

**Idee:** ein Boost-Kessel für den Boden.
- Er füllt sich durch Drift in drei Stufen. Die Stufe zeigt sich an der Farbe der Drift-Spur und an einem kleinen Ring am Heck.
- Luftzeit und knappe Vorbeifahrten an Steinen füllen ebenfalls nach.
- Wer den Drift loslässt, bekommt einen Stoß in Stufenstärke: Ring V4 plus Zündklang.
- So greifen Drift, Boost, Effekte und Ton als eine Schleife ineinander.

**Aufwand:** M. **Risiko:** gering, wenn die Fahrhilfe M3 den Kessel optional macht.

## 2 · Coyote-Time und Sprung-Puffer · Gameplay-Gefühl
**Stand heute:** Gesprungen wird nur bei `jumpEdge && !d.air` (`k2t.js:151`).
- Über einer Kuppe ist der Wagen schon in der Luft. Ein Leertasten-Druck kurz danach verpufft.
- Ein Druck 80 ms vor dem Aufsetzen verpufft ebenfalls.

**Idee:** Nach dem Verlust des Bodens zählt ein Sprung noch 120 ms lang (Coyote-Time). Ein Druck in den 120 ms vor der Landung wird gemerkt und beim Aufsetzen ausgeführt (Puffer). Die Physik bleibt gleich, die Steuerung fühlt sich sofort präziser an.

**Aufwand:** S. **Risiko:** gering.

## 3 · Hit-Stop und Kamera-Trauma · Cartoon-Timing
**Stand heute:** Es gibt keinen Bildstopp und keinen Kamera-Ruck (im Code kein `shake`, `hitstop` oder `trauma`).

**Idee:**
- Bei schwerer Landung (`strength` > 0,6) und bei Aufprall hält die Physik 40–70 ms an, die Kamera läuft weiter.
- Danach folgt ein Ruck nach dem Trauma²-Modell: weiches Rauschen, das in 0,3 s abklingt.
- Der Ruck kommt nur bei Ereignissen, nie dauerhaft. Georg hatte schon einmal „Kamera springt im Stand“ bemängelt.
- Ein Regler schaltet das Ganze ab.

**Aufwand:** S. **Risiko:** gering.

## 4 · Cartoon-Schwerkraft: Klippen-Moment und Scheitel-Schweben · Animation + Gameplay
**Stand heute:** Die Flugbahn ist eine reine Parabel (Gravity in `k2t.js` Z. 141/152/181).

**Idee:**
- **Looney-Tunes-Regel:** Wer ohne Sprung über eine Kante fährt, hängt 0,15–0,25 s in der Luft. Die Nase kippt nach unten, als ob der Wagen hinunterschaut. Dann fällt er mit ×1,6.
- **Im Sprung:** am Scheitel 0,1 s Schwerkraft ×0,5 (Hang-Time), danach Fall mit ×1,4.
- Das liest sich knackiger und comichafter als eine physikalisch saubere Kurve.

**Aufwand:** M. **Risiko:** mittel, weil sich die Sprungweite verschiebt. Die Weite von m3-c muss neu gemessen werden.

## 5 · Saubere Landung belohnen · Gameplay
**Stand heute:** Das Ereignis `landing` kennt nur die Stärke, keine Qualität.

**Idee:**
- Landet die Nase parallel zum Hang (Winkel zwischen `D.up` und Bodennormale < 15°), ist das eine „Butter-Landung“: 8 % Schub, Ring in Akzentfarbe, heller Ton.
- Eine schiefe Landung gibt mehr Squash, einen seitlichen Puff und kostet 10 % Tempo.
- Damit bekommt die Nasensteuerung in der Luft (Pfeiltasten) einen Sinn.

**Aufwand:** S–M. **Risiko:** gering.

## 6 · Effekte „auf Zweiern“ animieren · Animations-Trick
**Stand heute:** Alle Effekte laufen flüssig mit der Bildrate.

**Idee:**
- Puffs, Ringe und Sterne laufen in 12-fps-Stufen (`t = floor(t*12)/12` im Uniform). Wagen und Kamera bleiben flüssig.
- Das ist ein klassischer Hanna-Barbera-Effekt, den auch Spider-Verse nutzt. Er lässt Effekte „gezeichnet“ wirken und passt zu den harten Bandkanten.

**Aufwand:** S, kostet keine Rechenzeit. **Risiko:** gering. Als Regler zum Vergleich einbauen.

## 7 · Die Welt weicht aus · Lebendigkeit
**Stand heute:** `uCarW` liegt schon im Gelände-Shader der Probe (Z. 1873–1875), wird aber nur für die Lichtpfützen genutzt. Büsche und Bäume reagieren nicht auf den Wagen.

**Idee:**
- Büsche, Gras-Kuppen und Baumkronen biegen sich im Vertex-Shader vom Wagen weg (Radius 3 m) und federn zurück.
- Bei `railImpact` an einem Baum wackelt der Baum 0,4 s mit Squash.
- Das kostet keine neuen Assets.

**Aufwand:** S–M. **Risiko:** gering.

## 8 · Heldenfarbe für den Racer · Game-Art
**Stand heute:** Auf allen Bildern ist der Wagen das unbunteste Objekt im Bild, Chrom-Grau vor Orange und Grün (z. B. `img/vfxsfx-std-2-fahrt.jpg`).

**Idee:** Nach der Grundregel ist der Spieler das am stärksten gesättigte Objekt mit der klarsten Silhouette. Ohne Randlicht (V-385) geht das so:
- eine Spielerfarbe als zweiter harter Ton auf Flossen und Streifen,
- das Düsenglühen in derselben Farbe,
- die Speedlines leicht in dieser Farbe getönt.

**Aufwand:** S. **Risiko:** gering. Art Direction (Prüfer A) sollte gegenlesen.

## 9 · Idle-Gesten: Persönlichkeit im Stand · Animation
**Stand heute:** Im Stand atmet der Wagen nur (Schwebe-Wippen).

**Idee:**
- Nach 4 s Stillstand läuft ein Zyklus kleiner Gesten aus vorhandenen Bausteinen:
  - Schulterzucken (Squash),
  - Blick nach links und rechts (Gieren ±8°),
  - Fehlzündung mit Rauch-Puff,
  - „Gähnen“ der Düse (Glühen langsam auf und zu).
- Nach 20 s schläft der Wagen ein: Das Schweben sinkt, das Summen wird tiefer.
- Die nächste Taste weckt ihn mit einem Hüpfer.

**Aufwand:** S–M. **Risiko:** gering.

## 10 · Squash und Stretch entlang der Bewegung, Smear, Nachziehen · Animation
**Stand heute:**
- Der Squash wirkt nur vertikal und kommt aus k2t (`P.sq`).
- Gestreckt wird der Wagen nur bei `surge`.
- Alle Teile bewegen sich starr miteinander.

**Idee:**
- **Strecken:** Im Sprung und im Flug streckt sich der Wagen entlang des Geschwindigkeitsvektors, bei erhaltenem Volumen. Die Stärke folgt der Beschleunigung.
- **Smear:** Bei einem harten Richtungswechsel zeigen 1–2 Bilder eine Nachzieh-Kopie der Silhouette in Wagenfarbe mit 40 % Deckung.
- **Nachziehen:** Flossen und Düsen folgen 1–2 Bilder versetzt (Overlap und Follow-through).

**Aufwand:** M. **Risiko:** mittel, weil Schatten und das Anheben über Hindernisse (`LIFT`) die Verformung mitmachen müssen.

---

**Reihenfolge nach Wirkung pro Aufwand:** 2 → 3 → 6 → 8 → 1 → 5 → 7 → 9 → 4 → 10.

Die Punkte 1 und 5 brauchen Effekte und Klänge aus `VFX_SFX_R1.md` (Ring V4, Drift-Spur V7, Ereignis-Strom).
