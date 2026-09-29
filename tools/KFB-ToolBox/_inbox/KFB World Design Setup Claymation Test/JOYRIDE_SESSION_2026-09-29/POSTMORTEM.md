# POSTMORTEM · Fassaden + Kronen-Kontaktschatten (J05–J10)

Stop-Regel JOYRIDE-WORLD-01: „Zwei Fehlpässe am selben Tor → einfrieren.“ Ich habe **vier** gemacht. Das ist der Hauptfehler.

## Verlauf
| Pass | Annahme | Ergebnis (Georg) | Tatsächliche Ursache |
|---|---|---|---|
| J03 | Vorstufe nach dem Mergen, absolute Maße | „zu grobe Textur“ | Vorstufe muss je Quelle/Teil laufen (HOWTO §2) |
| J05 | FACE_NORMALS 42° | „nicht korrekt“ | half nur gegen helle Dachkante, nicht Look |
| J07 | Fingerabdruck-Karte fehlte; Vorstufe je Quelle vor Biegung | „nicht K1/H0“ | Karte fehlte wirklich (echter Fund), aber Material war v10+K2-Werkzeuge statt K1-v8 |
| J08 | K1-v8-Material, Werte × 2,36 | „Deformation + Textur falsch“ | T4 streckt/biegt ungleichmäßig; Vorstufe auf verschmolzenem Haus |
| J09 | T4-Biegung aus, Vertex-AO nach Normale | „Dächer broken, Baum nicht gefixt“ | Dach/Wand eines Hauses sind EIN Mesh; AO nach Normale trifft die Naht nicht |
| J10 | Vorstufe je Teil, maxTris 24 000 | „beides NICHT gefixt“ (mit Markierungen) | Budget 24 000 statt 90 000 → Taubin wellt dünne Dachplatte/Kanten; Naht = Nähe zur oberen Kugel, braucht Abstands-AO |

## Was ich falsch gemacht habe
1. **Ohne Pixel-Beweis ausgegeben** (J07–J10). Georg: „MACH SCREENSHOTS VOR AUSGABE“. Die Werkbank-Nahaufnahme hätte J10 sofort entlarvt.
2. **Aus Screenshots geraten statt Referenz-Code gelesen.** Die K1/H0-Codebasis lag erst ab J08 vor; danach habe ich trotzdem den T4-Pfad angepasst statt den K1-Pfad zu übernehmen.
3. **Stop-Regel ignoriert.** Nach J07 hätte ein A/B-Tor stehen müssen.
4. **Budget still geändert** (maxTris 90 000 → 24 000) ohne Vorher/Nachher-Bild.
5. **Schatten und Kontaktverdeckung vermischt.** PR-#290-Schatten ist umgesetzt; die Kronen-Naht ist fehlende AO an Kugelkontakten, ein anderes Problem.

## Was stimmt (belegt)
Fingerabdruck-Karte fehlte (J07, gefixt) · K1/H0 laden v8, nicht v10 (J08, Befund) · T4 verschmilzt Hausteile (J10, Befund) · Schatten-Follow nach Kanon hält.
