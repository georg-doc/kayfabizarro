# B2-R2 · Recherche-Notizen und Quellen · WSB · 2026-10-17

Ergänzt den Bestand in `KFB Island Worldbuilder Lab/docs/` (Bauweise, Etherington R2, Placement Grammar, NotebookLM P3), ersetzt ihn nicht. Was mit **(eigene Kenntnis)** markiert ist, ist nicht quellengeprüft.

## Kernbefund
Ein Muster braucht drei Dinge:
- **Farbe hängt an der Position** (einfarbige Nester, Bänder, Spiralarme). Die Regel „Nachbar anders“ bewirkt das Gegenteil.
- **Hierarchie:** ein Hero und mehrere Stützen.
- **Eine lesbare Ordnung:** Traube, Spirale oder Band.

Struktur kommt aus dem Feld (Licht, Höhe, Krümmung) und aus der Hierarchie. Abstandsregeln sind nur Hygiene.

## Botanik
- Früchte sitzen außen und oben. Im unteren Inneren der Krone kommt weniger als 15 % Licht an. Große Bäume tragen etwa doppelt so viel Frucht in der oberen Hälfte.
  - https://agris.fao.org/search/fr/records/65dfb3f70f3e94b9e5db836a
  - https://nibio.brage.unit.no/nibio-xmlui/handle/11250/3007220
  - https://journals.ashs.org/downloadpdf/view/journals/jashs/114/6/article-p869.pdf
- Früchte wachsen an Zweigspitzen und in Blattachseln. Trauben hängen mit dem Ansatz oben.
- Phyllotaxis (Vogel): r = c·√n, θ = n·137,508°. Es entstehen Spiralarme (Parastichien) in Fibonacci-Anzahl. Auf die Kugel übertragen ist das die Fibonacci-Sphere: Man begrenzt z auf eine Kappe und projiziert auf das Mesh.
  - https://mathworld.wolfram.com/VogelSpiral.html
  - https://extremelearning.com.au/evenly-distributing-points-on-a-sphere/
  - https://www.johndcook.com/blog/2023/08/12/fibonacci-lattice/

## Punktprozesse
- **Bridson-Poisson:** gleichmäßig. Taugt nur als Unterlage bzw. Abstandsprüfung.
  - https://www.cs.ubc.ca/~rbridson/docs/bridson-siggraph07-poissondisk.pdf
- **Variable-Density Blue Noise:** Die Dichte folgt einem Feld.
- **Lloyd/CVT (gewichtet, Secord):** ruhig, wirkt wie von Hand gestippelt.
  - https://en.wikipedia.org/wiki/Lloyd%27s_algorithm
  - https://www.cs.ubc.ca/labs/imager/tr/2002/secord2002b/secord.2002b.pdf
- **Neyman-Scott / Thomas / Matérn:** Eltern-Punkte plus Nachwuchs, ergibt Trauben.
  - https://www.rdocumentation.org/packages/spatstat/versions/1.63-3/topics/rThomas
- **Hierarchisch (Cluster von Clustern):** am stärksten „organisch und gestaltet“. Das entspricht KFB `nest()` mit 1 : 3 : 9.
- **Gray-Scott-Reaktions-Diffusion:** Flecken in fast gleichem Abstand. Teuer, besser einmal backen.
  - https://karlsims.com/rdtool-help.html
  - https://www.mrob.com/pub/comp/xmorphia/index.html
  - https://redblobgames.com/x/2202-turing-patterns

## Spiele und Lesbarkeit
- **Animal Crossing:** 3 Früchte pro Baum, feste Slots vorne in der Krone. Die Slot-Lage ist eigene Kenntnis.
  - https://acnl.fandom.com/wiki/Fruit_trees
- **Mario-Münzen** sind Brotkrumen, also Linien und Bögen. Rhythmus geht vor Dichte.
  - https://boingboing.net/2015/09/11/want-to-create-mario-maker-lev.html/amp
  - https://gamedev.net/articles/game-design/game-design-and-theory/super-mario-bros-3-level-design-lessons-part-1-r4682/
- **Yoshi's Crafted World:** wenige große, klar konturierte Formen. Collectibles sind Teil der Bastelei.
  - https://www.mariowiki.com/Yoshi's_Crafted_World

## Farbe
- Pro Pflanze eine Leitfarbe (60–70 %), ein Akzent (20–30 %), höchstens ein Funke. Nester einfarbig. Value-Kontrast schlägt Hue-Kontrast.
- Oliv auf Grün:
  - (a) den Helligkeitswert verschieben (Varianten-Frage, V-292 bleibt);
  - (b) dunkler Ton-Rand;
  - (c) nur auf Nicht-Grün-Trägern.
- Farbsehschwäche: zusätzlich ein zweites Merkmal pro Sorte.
  - https://utmb.edu/accessibility/digital/100/100-days-article/days-of-a11y/2024/07/12/day-53--people-with-color-blindness-want-to-have-fun!
- **Kusama:** Die Punkte sind auf den Graten größer und schrumpfen in die Falten.
  - https://audioguide.mplus.org.hk/en/locations/pumpkins/
  - https://www.christies.com.cn/en/lot/lot-6508410
- **Niki de Saint Phalle:** Farbe in Feldern und Bändern (eigene Kenntnis).

## Herriman / Coconino
- Mesas der Painted Desert, die Hintergründe wechseln von Panel zu Panel. Bäume stehen in Töpfen mit Navajo-, koptischen oder ägyptischen Mustern, das Muster sitzt teils im Laub. Theater-Rahmen.
- Folgerung: Pflanzen sind Bühnenrequisiten, Fluff darf Ornament sein (Band, Spirale), ein Muster pro Pflanze.
  - https://en.wikipedia.org/wiki/Krazy_Kat
  - https://en.wikipedia.org/wiki/George_Herriman
  - https://www.encyclopedia.com/media/encyclopedias-almanacs-transcripts-and-maps/krazy-kat
- KFB-intern:
  - `KFB_HUB/30_DECISIONS/replies/WS0_KRAZY_KAT_LIGHT_FLUFF_ACTOR_INTENT_R1_2026-10-16.md`
  - Issue #388 (Coconino Mesa R1)
  - V-164, V-340
