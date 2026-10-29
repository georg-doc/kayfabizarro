# Konzeptblatt · Cascade Sphere R5: Treffer, Befall, Heilung · R1 · 29.10.2026 · WS0 (V-561, V-1011)

| Feld | Inhalt |
|---|---|
| `one_sentence` | Diese Szene zeigt ein Kartengebäude, das unter Beschuss je nach Waffe und Material anders nachgibt, weil die Hülle ein Behälter der Karte ist. Der Spieler soll zuerst den Treffpunkt sehen, dann die freigelegte Karte und die austretenden Kugeln. |
| `story` | Der Goo hat dem Viertel die Farbe gestohlen. FrizzleBob schießt die Hüllen auf, holt die Karten-Kugeln heraus und zahlt mit Fluff die Heilung. Man soll fühlen: Zerstören ist Befreien, Heilen bringt die Welt zurück. |
| `image_idea` | Eine graue Hülle mit einem frischen, zum Treffer passenden Loch. Dahinter leuchtet die bunte Karte, davor kullern die Kugeln auf einen Bürgersteig, auf dem die Farbe schon zurückkriecht. |
| `focal` | Zuerst der Treffpunkt bzw. die Bresche, dann die Karte im Loch, dann die Kugeln am Fuß. Die Figur steht seitlich und verdeckt nichts. |
| `space` | **Vordergrund:** Figur seitlich, Jetpack klein. **Mittelgrund:** Gebäude mit Bresche als stärkster Hell-Dunkel-Kontrast (Karte gegen dunklen Innenraum). **Hintergrund:** Nachbargebäude und farbiges Gelände in Ruhe. **Verteilung 70/20/10:** ruhige Hüllen und Boden, Struktur von Bordstein und Gassen, Bedeutung bei Bresche und Karte. |
| `palette_roles` | **Gelände:** `terrain3`-Bänder in der Palette. **Bürgersteig:** dieselben Bänder, leicht aufgehellt. **Befall:** entsättigte Hülle mit erhaltener Helligkeit (V-625), kein flächiges Mittelgrau. **Akzent:** Kartenfarben, auch in den Kugeln. **Ruß:** `deepShadow` der Palette, nie schwarz. **Schatten-Familie:** `shadow` für Kontaktton und Innenraum der Bresche, `deepShadow` für Ruß, `edgeAccent` für die aufgehellte Pappe- bzw. Knete-Kante. |
| `color_script` | Kühle, entsättigte Befallszone gegen warme, bunte Umgebung. Die Heilung kehrt das um, als Sprenkelband (V-403). Verboten: Neon, Selbstleuchten bei Rauch und Staub. |
| `form_dna` | **Grundformen:** Quader-Hülle, runde Kugeln, gerundeter Bordstein-Ring. **Sekundärformen:** ausgefranste Bresche und runde Einschüsse. **Verboten:** rechteckige Ausschnitte, Kiesel- oder Bastel-Steine. Kanten weich gerundet. |
| `life_anchor` | Kugeln kullern dem Gefälle nach. Rauch nach SPEC_CARTOON_VFX_SHAPES_R1 (eine Masse, Lebenszyklus). Funken springen, die Pfütze breitet sich aus, die Sprenkel der Heilung wachsen. |
| `material_codes` | **Pappe:** reißt mit Faserkante. **Knete:** bröckelt in Krümel, die auf dem Gelände liegen bleiben (V-767). **Stoff:** franst aus. **Metall** (später): beult sich, Abprall. Je Gebäude höchstens ein Code. |
| `biography` | Gebaut als Kartenbehälter, befallen vom Goo, aufgeschossen, geheilt. Nach der Heilung bleibt eine leichte Narbe im Material. |
| `groups` | Je Gebäude: Anker = Bresche, Stützen = Kugelhaufen am Fuß, Akzent = Rußkranz bzw. Funken. Die Bordstein-Ringe fassen die Gruppe. |
| `story_beat` | 1 Gatling-Folge: Einschüsse wachsen zusammen. 2 Rakete: großer Ausriss mit Ruß. 3 Kugeln treten aus. 4 Fluff zahlen, heilen, Farbe kehrt in Hülle und Gelände zurück. |
| `cast` | FrizzleBob (FB_CANON) mit kleinerem Jetpack (V-1012), KFB-Augen sichtbar. |
| `cameras` | Spielkamera Third-Person (V-987) plus die vier festen Kritiker-Kameras. |
| `reference` | R4-Golden-Bilder (`review/evidence/v1001-play.png`, `v1001-play-healed.png`, `v1001-edge.png` im WSA-Repo); Seed World Mech Destruction POC 01 (`75_REFS/seedworld_poc01`, Zellen-Zerstörung); K14 Look-Test graues Haus mit halb zurückgefärbtem Nachbarn (V-625). |
