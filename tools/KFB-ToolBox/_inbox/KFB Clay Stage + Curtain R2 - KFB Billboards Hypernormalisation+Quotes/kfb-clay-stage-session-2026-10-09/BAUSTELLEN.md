# BAUSTELLEN · KFB Clay Stage nach R2 (09.10.2026)

Georg-Entscheid: R2 passt, folgende Punkte sind TUNE für später. Priorität: **A** vor MVP-Slice · **B** im MVP nachziehen · **C** später.
Jede Baustelle wird als R3-Kopie bearbeitet, R2 bleibt Referenz.

## Billboards

### B1 · 02 Pfeilspitze Boomerang · A
- Stand: Spitze symmetrisch auf dem Kreis, Sehnenachse 18,2° gegen die Tangente, Spitzenwinkel 53°. Kanal läuft durch, Blink-Spitze sitzt darauf.
- Offen: Proportion Spitze zu Schaft (HL 4,0 / HH 2,0 / Schaftbreite 1,9) im Hero-Abstand prüfen. Widerhaken-Radien (0,7) und Spitzenradius (0,75) gegen den Knet-Look abstimmen. Ob die Achse besser zwischen Sehne und Tangente liegt.
- Stellschrauben: `boomerangArrow()` in `billboards/kit.js`: `a1`, `HH`, `HL`, `W`, `m`, `r` an `arcArrow`, Einrückung `insetTri(..., 0.12)`.
- Prüfen: Front, ¾, Spitze nah, Seite. `fam.arc` liefert `apexDeg` und `headAxisDeg`.

### B2 · 02 Lauflicht und Blinken live · A
- Lauflicht entlang des Bogens und Blinken der Spitze wurden nur im Einzelrender gesehen, nicht im laufenden Bildschirm (siehe B8). Taktung und Glow im Live-Betrieb abnehmen.

### B3 · arcArrow als Bauweise für andere Tafeln · C
- Offene Frage aus R1: Trägt „ein Umriss + konstante Kontur + Lichtkanal" als Standard für alle Tafeln? `arcArrow`/`insetTri` sind allgemein genug für weitere Bogenformen.

## Bühne + Vorhang

### S1 · Falten im geschlossenen Zustand · B (Kern-TUNE)
- Der Kern setzt die Pin-Amplitude bei geschlossenem Vorhang auf 0 (T3/T10), der Stoff ist dann fast glatt. Die Bögen oben geben die Faltenlogik vor, die Bahnen nehmen sie geschlossen nicht auf.
- Nicht im Look lösbar. Anfrage an den Kern-Eigentümer (Issue #372), Kern nicht kopieren.

### S2 · Material-Einheit Stoff ↔ Schmuckvorhang · B
- R2: Bögen in Stofffarbe, Stoff mit derselben Marmorierung. Offen: Glanz, Rauheit und Kantenlicht zwischen Shader-Stoff und Knet-Wülsten weiter angleichen, damit beide als ein Material lesen.

### S3 · Formen klobiger, weniger Kleinteile · B
- Georg: Wechsel zwischen kleinteiligen und klobigen Elementen reduzieren. Kandidaten: Laternen, Rosetten, Quasten-Kordel, Schild-Stützen. Säulen und Portal-Wulst auf Cartoon-Maß prüfen.

### S4 · Pappaufsteller-Volumen und Seiten · B
- Portal hat Kante, Wangen und Laibung. Offen: Glaubwürdigkeit von der Seite (Ansicht `side`), Dicke der Pappe, ob Wangen bis zur Bühnenhinterkante laufen. Georg kann sich Pappaufsteller-Optik inkl. sichtbarer Machart vorstellen.

### S5 · Portal oder Säulen allein · A (Georg-Frage)
- Offen seit R2: Schließt das Portal als Pappaufsteller den Rahmen, oder sollen die Säulen allein abschließen? Ohne Portal muss die Stoffüberdeckung anders gelöst werden (Stoff bis hinter die Säulen).

### S6 · Vorhang hinter die Bühne ziehen · C
- Georg: Kante Vorhang/Bühne lässt sich auffangen, wenn der Vorhang weiter hinter die Bühne läuft. R2 löst es über Portal und versenkten Saum. Bei Wegfall des Portals (S5) wieder relevant.

### S7 · Asymmetrie weiter · C
- R2: Säulen, Schild, Laternen, Quasten ungleich. Offen: Portalform selbst ist symmetrisch.

## Technik

### B8 · Billboard-Boot hängt in der Vorschau · A
- In der Session blieb der Billboard-Bildschirm in R1 UND R2 beim Laden stehen, ohne Fehlermeldung. Vermutung: Vorschau-Rahmen im Hintergrund bekommt keine Animationsframes, oder eine `tryLoad`-Quelle (Quote-Pool raw, H14, Font) hängt. NOT_TESTED in normalem Browser-Tab. Zuerst dort prüfen.

### T1 · Vorhang-Kern pinnen · A
- Kern läuft über jsDelivr `@main`. Für die MVP-Slice auf einen Commit pinnen (`SRC.core` in `curtain/host.js`).

### T2 · Zwei three-Builds · B
- Billboards three 0.180 (WebGL), Vorhang three 0.186 (`three/webgpu`). Je Bildschirm rendert nur einer. In der Slice entscheiden: ein Renderer (Regel „ein Besitzer"), dann Billboards auf WebGPU heben oder Vorhang auf eigener Fläche lassen.

### T3 · Rubbel-Grammatik und kfbBlend · C
- Nicht gelesen, nicht eingebaut.

### T4 · Tests · B
- NOT_TESTED: fps auf Zielgerät, Safari, Firefox, Mobil, Gerät ohne WebGPU (Kern meldet `fallback_reveal`), Öffnen/Schließen live, Impact im Look.
