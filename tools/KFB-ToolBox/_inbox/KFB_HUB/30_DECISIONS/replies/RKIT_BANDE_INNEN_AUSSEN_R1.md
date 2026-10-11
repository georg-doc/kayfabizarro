# RKIT · #4 Banden-Übergang innen / außen: Vorschlag aus Bestand (V-150 #4) · Georg entscheidet am Bild (R1)

Stand 2026-10-11 · Bild: [RKIT_BANDE_INNEN_AUSSEN_R1/bande_innen_aussen.png](RKIT_BANDE_INNEN_AUSSEN_R1/bande_innen_aussen.png) (SVG daneben) · Skript `~/Developer/rkit-r3/trackcore/proposals/bande_inner_outer.mjs`

## Bestand: Das gibt es schon, nichts erfunden

Der J17-Look (`lab-track/track-look.v5.js:191–216`, J14 = J15 = J17) hat den Übergang bereits. Die Bande (Strang) bleibt durchgehend und verändert sich nur nach der Krümmung.

**Ablauf**
- Die Krümmung wird vorzeichenrichtig über ±8 m geglättet; Rechtskurve heißt innen = rechts.
- **Innen** (Kurveninnenseite) bekommt der Strang Rippen im Abstand von 3,5 m, „zwei Handbreiten“: ein Wulst am Fuß bis +0,26 und eine um bis zu 12 % dickere Kappe.
  - Er beginnt ab |k| 0,008 (R 125) und ist voll ab |k| 0,022 (R 45).
- **Außen** (Kurvenaußenseite) wächst der Strang: Radius +32 %, Oberkante +0,30 (1,35 → 1,65), 0,12 weiter nach außen.
  - Er beginnt ab |k| 0,014 (R 71) und ist voll ab |k| 0,04 (R 25).
- Die Übergangslänge entsteht aus dem Ease der Kurve (Core: CURVE_EASE-Ease = min(0,6·R, 30)) und der 8-m-Glättung. Es gibt keine eigene feste Länge, so wie S4 v2 es verlangt: „do not create another hardcoded transition-length system“.

## Zahlen (90°-Kurve auf der Renn-Geraden, gemessen)

| R | Ease | innen: Bereich, Anlauf / Auslauf, Maximum | außen: Bereich, Anlauf / Auslauf, Maximum |
|---|---|---|---|
| 80 m | 30 m | s 75–181 · nie voll · max 0,19 | bleibt 0 |
| 40 m | 24 m | s 60–127 · 12 m / 12 m · voll | s 68–118 · nie voll · max 0,27 |
| 25 m | 15 m | s 54–101 · **5 m** / 5 m · voll | s 57–97 · 14,4 m / 14,4 m · 0,96 |

**Befund:** In engen Kurven ist der Innen-Anlauf kürzer als die 8-m-Nahtregel aus S4 v2 (R 25: 5 m).

## Varianten zur Entscheidung

| | Variante | Was | Core | Aufwand |
|---|---|---|---|---|
| **A** | J17 wie er ist | Der Look rechnet die Gewichte selbst | unverändert | 0 |
| **B (Empfehlung)** | J17-Regel als Strom-Daten | Der Core schreibt je Probe `q.edge = {inner, outer}` (0..1) nach derselben Formel. Anlauf mindestens 8 m (S4-v2-Nahtregel). Lab, RKIT und Blender lesen dieselben Gewichte, gleicher Übergang überall. | nur Daten, Kontaktgeometrie gleich (S4 v2 §599 „The look adds no collision geometry“) | S |
| C | Bande als Geometrie anheben | Außen +0,30 in den Banden-Slots | ändert Kollision und Physik, gegen §599 und „same physics“ | M, nicht empfohlen |

**Für town gilt das nicht:** Dort gibt es keine Bande (V-118), Bord und Gehweg bleiben gleich. Für dirt nach Freigabe: Bande nur an Gefahrenstellen (#13). Dort gilt dieselbe Regel, sobald eine Bande steht.

**Frage an Georg (am Bild):**
- A, B oder C?
- Bei B: Sollen die J17-Schwellen (R 125 / 45 innen, R 71 / 25 außen) bleiben, oder nach V-151 (Assist) früher einsetzen?

## Entscheid und Umsetzung (V-154, 11.10.)

Georg hat **Variante B** gewählt und die J17-Schwellen beibehalten. Umgesetzt in Track Core 0.16.4:
- `q.edge = {L: {inner, outer}, R: {inner, outer}}` auf jeder Probe mit race-Querschnitt;
- Anlauf je Kanal mindestens 8 m (R 25 innen: 5 → 8 m);
- Fingerprint und alle übrigen Probenfelder sind identisch mit 0.16.3, Kontaktgeometrie unverändert;
- Weltstraßen haben kein `q.edge`.

Tests: test-skin 88/88, alle Suiten unverändert, Teil 0 bitgleich.

Lab-Look: Der J17-`sideProfile` liest künftig `q.edge[side].inner / .outer` statt selbst zu rechnen. Das ist eine Zeile je Wert im Look; den Umbau macht das Lab.
