# Auftrag WSA work · Waffen-Effekte in Shooter-Qualität · WS0 · 31.10.2026 (V-1126, ergänzt V-974, V-977, V-1038, V-1039, V-1040)
Georg: Das Mündungsfeuer ist „extrem dunkel und liest sich halt nicht als ein heller Feuerstrahl“. Es soll einem „Action-Game-Shooter-Qualitätsstandard“ entsprechen.

**Tier 0** (wörtlich aus CANON_3D_R1 §0)
1. **Kanon lesen:** `CANON_3D/CANON_3D_R1.md` (diese Seite) und die Zeilen deines Fachgebiets. **Vor dem Bau** liegt ein ausgefülltes Konzeptblatt `CANON_3D/KONZEPTBLATT_R1.md` vor; WS0 schreibt es (V-561).
2. **Bauen nur mit den Kanon-Werkzeugen:** Umgebung `CANON_3D/lib/kfb_env.py` (Blender: `kfb_env_bpy`); Figuren, Material und Licht: Proof-Stage-Module. Eigene Platzierungs-, Licht- oder Knete-Helfer sind verboten.
3. **Abgabe:** mechanisches Gate grün (`kfb_env_bpy.run()` + Proof-Stage G1–G7); dann der blinde Kritiker nach `CANON_3D/CRITIC_3D_R1.md`; Georg sieht nur Bestandenes.

**Für diesen Auftrag (WS0-Entscheidung):** Laufzeit-Code im Spiel, Gate sind die Tests des Schalters. **Konzeptblatt (WS0):** Beim Schuss sieht der Spieler zuerst einen hellen Feuerstoß an der Mündung, dann den Rückstoß, dann das Geschoss. Form: das vorhandene cartoonige Kit-Modell. Verboten: dunkles beleuchtetes Modell, Knopf vor der Mündung, Linien, Kegel. Kameras: Spielkamera und nah.

**Ist-Stand im Stamm `game/integration-r2`:** `src/modules/combatPlayer.js` nutzt `src/vendor/combat/muzzle-fx.v1.mjs`, das das Kit-Modell aus KayKit Action Figure klont. Das Material bleibt normal beleuchtet, darum wirkt es dunkel. Es lebt 0,06 s. Rückstoß und Lauf-Drehung fehlen. Im Modul stehen nur Pistole und HeroMan-Blaster; Die Gatling liegt in assets/private: `50_BLENDER/K10/_privat_kauf_asset/KFB_CombatMech_Minigun.k10.glb` und `kfb_kit_combatmech_minigun.weapon.json`, mit eigenem Knoten `CombatMech_Minigun_Barrel` und `KFB_Muzzle`.

## Bau auf eigenem Branch vom Stamm, hinter `fx=r2`
1. **Ein Flammen-Modul:** Das Kit-Modell bleibt die Form, leuchtet aber selbst, Kern fast weiß, über Gelb zu Orange, flammig wirkend und auf hellem Wüstenboden wie im Schatten klar lesbar. Es darf additiv leuchten. Dazu ein gemeinsames kurzes Lichtsignal nur beim Schuss des Spielers, das Waffe und Boden nah aufhellt (WS0-Ausnahme zu V-385, Georgs Wunsch). Die Schnittstelle taugt später auch für die Düsen der Dieselpunk-Antriebe; die baust du jetzt nicht.
2. **Bewegung je Schuss:** Kurzer Aufbau, Stauchen und Strecken entlang der Schussrichtung, wechselnde Drehung, damit kein Schuss gleich aussieht. Schussfolge und Stoßfolge kommen aus Daten je Waffe.
3. **Gatling:** in `K10_WEAPONS`, Modell und Griff wie vorhanden (V-1040): Hochlaufen, Drehung des Knotens `CombatMech_Minigun_Barrel`, durchgehende Schussfolge auf Primär, Flammen im Takt, Auslaufen.
4. **Große Rakete:** als Zweitfeuer der Gatling auf dem Knopf Sekundär (V-1038, V-1039): großer Austritt mit Rückstoßflamme und Rauch aus `fx-burst`, Rakete mit Stauchen beim Start. Geschoss-Modell ist vorerst `50_BLENDER/JETPACK/_privat_rocket/r1/KFB_Rocket.r1e.glb` verkleinert und unverändert. Treffer nutzt die vorhandenen Ereignisse `contact` und `kill` mit größerer Energie und `fx-burst` am Einschlag; keine neue Schadenslogik.
5. **Rückstoß:** kurzer Zug des Waffen-Slots entlang der Laufachse, Rückkehr mit Nachschwingen. Modelle und Clips bleiben unverändert (V-574, V-954), keine Glieder biegen.
6. **Waffenarten:** Tabelle je Waffe statt Sonderfälle: Feuer für Kugelwaffen, elektrische Entladung für den Blaster, eigene Einträge für Gatling und Rakete. Andere Waffen melden, was noch fehlt, nicht raten.
7. **Bestand zuerst:** `fx-burst` und FX_Visual (V-974, V-977), Rauch aus `dustTrail`.

Lies dazu `src/vendor/combat/SOURCE.md`, `src/data/combat/k10/` und die V-Einträge oben.

## Rückgabe an WS0, dann Stopp
Baue einen Prüf-Modus, der den Effekt im hellsten Moment anhält, nur für Aufnahmen. Einzelbilder aus dem Spiel in voller Größe (V-1100), je Waffe im Moment des Schusses, nah und aus der Spielkamera, einmal auf hellem Boden, einmal im Schatten; dazu je Waffe ein kurzes Video mit Ton. Je Bild ein Satz, was abzunehmen ist. Tests nach Stufe A, Zählwerte in `perf.json`, bei voller Gatling-Folge mit und ohne `fx=r2` (V-1107). Branch, Commit, Tests, was ungeprüft ist. Kritiker höchstens einmal, eine Reparaturrunde je Befund. Merge über WS1.
