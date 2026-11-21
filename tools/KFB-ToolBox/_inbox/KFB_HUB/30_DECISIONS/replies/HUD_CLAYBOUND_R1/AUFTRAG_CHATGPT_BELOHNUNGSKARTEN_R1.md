# Auftrag ChatGPT-Bild · KFB Belohnungskarten R1 (Truhe, 3 Karten zur Wahl)

**Warum:** Die Truhe bietet drei Belohnungen an. Sie brauchen große, saftige TCG-Karten im Stil von Hearthstone, mit Titel, Text und gut lesbarer Seltenheit. Im vorhandenen Bestand gibt es dafür keine Teile:
- Die GvW-Papierfelder sind nur 160 px groß und reichen deshalb nicht.
- Die Fantasy-Papiere sind realistisch gezeichnet statt Claymation.

**Hochladen:** `KFB Paper HUD 05 GvW.png` (Referenz für Material, Licht und Kante) in denselben Chat, dann den Block unten einfügen. Ein Lauf, ein Blatt.

**Bedeutung je Teil im Belohnungsablauf** (jedes Teil hat eine Aufgabe):

| Teil | Aufgabe im Ablauf |
|---|---|
| Kartenrücken | Die Truhe öffnet sich, drei Karten liegen verdeckt und drehen sich um (Enthüllung). |
| Rahmen in drei Seltenheiten | Die Seltenheit ist auf einen Blick an Farbe und Zahl der Papierlagen zu erkennen, ohne Lesen. |
| Bildfenster | Hier sitzt das Hero-Bild der Belohnung (Waffe, Fahrzeug, Karte). |
| Titelband | Name der Belohnung. |
| Textfeld | Was sie tut, zwei Zeilen. |
| Stern-Abzeichen (leer/voll) | Seltenheit als große, lesbare Sterne. |
| Ziel-Sockel | Wohin die Belohnung fliegt (Faust-Slot, Rucksack, Almanach). Daran hängt die Flug-Animation zum HUD-Platz. |
| Schilder „NEU“ und „UPGRADE“ | Neue Sache oder Stufe hoch. |
| Auswahl-Rand | Zustand Fokus bzw. Hover beim Wählen. |

---

```text
Use the attached image as the exact style reference: handmade claymation-paper HUD parts — thick layered torn paper, soft clay-like bevel, pastel cream paper with blue-grey, coral and mustard-yellow paper layers, subtle Japanese seigaiha wave accents, soft top-left light, gentle drop shadow. Everything must look like it comes from the same kit, same material, same light, same edge treatment, "all of one piece".

Create ONE sprite sheet on a fully transparent background with these separate parts, generously spaced, front view, no perspective, no text, no letters, no numbers, no icons, no logos:

1. Three trading-card frames, portrait 5:7, each about 700 x 980 px, juicy and cartoony like a collectible card game:
   - COMMON: cream paper card with one blue-grey torn paper layer behind.
   - RARE: cream card with coral layer plus blue-grey layer, slightly thicker bevel.
   - EPIC: cream card with mustard-yellow, coral and blue-grey layers, extra torn paper flourish at the top corners.
   Each frame has: a large empty picture window in the upper 55 % (recessed, soft inner shadow); a blank title ribbon crossing the lower edge of the picture window; a blank two-line copy box below; a round empty socket in the bottom-right corner.
2. One card back for the same cards: cream paper with a centered stylized folded-paper star emblem and seigaiha border, no text.
3. Two big paper star badges about 120 px: one empty (pressed-in outline), one filled (mustard-yellow raised paper star).
4. Two blank paper tags about 220 x 90 px: one coral, one mustard-yellow (for "NEW" and "UPGRADE" labels added later in code).
5. One selection outline matching the card frame shape: a warm golden glowing torn-paper rim, transparent inside.

Keep all parts crisp, high resolution, clean alpha edges, no background, no checkerboard, no scene.
```

---

**Einbau danach (WS0):**
- Die Teile werden ausgeschnitten und mit derselben Skala für alle Teile eingesetzt, Text kommt im Code dazu.
- Titel und Text in der HUD-Infoschrift; Sterne mindestens 40u groß.
- Ablauf: Truhe → drei Kartenrücken → umdrehen → Fokus-Rand → Wahl → Karte fliegt in den Ziel-Slot.
