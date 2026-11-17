# Unabhängige Nachprüfung C2 · 17.11.2026

**Urteil: sichtbare Verbesserung, weiterhin keine Abnahmeempfehlung. 53/100 nach dem unveränderten Raster.** Bewertbare Kriterien: 53/90; Ton bleibt nicht hörend prüfbar und erhält gemäß ursprünglicher Regel formal 0 von 10 möglichen Punkten. Selbst eine spätere maximale Tonwertung ergäbe 63/100. Die Mündungs-Nahkamera hat einen konkreten Fehler und sperrt den erforderlichen Nahbeleg. Der Originalbericht mit 46/100 wurde in dieser Nachprüfung nicht geändert.

## Selbst geprüfter Kandidat

Normale UI unter http://127.0.0.1:8850/combat/ geöffnet; sie leitete auf /combat/?fx=r2. Werkbank war funktionsfähig. Gelesene SOURCE.json und der DOM-Status bestätigten build combat-stage-r2-c2-20261117. SOURCE.json nennt gameSourceCommit 48fffaafe3cd5af08c9cc96a8435f4ea955f51d3 und bundleSha256 a6603bbdf30837eeec17a82ec19deafcb2e7e59292fdf901d8ed86089b16f1b9. Metadaten wurden gelesen, keine eigene kryptografische Bundleprüfung.

Eigener begrenzter Lauf: alle drei Materialien Stein/Holz/Metall aus Spielabstand in Echtzeit bei Tag und Nacht; Mündungs-Nahkamera bei beiden Lichtzuständen; Materialkontakt-Nahkamera bei Tag in Viertelgeschwindigkeit. Sämtliche Bilder sind eigene Screenshots. Kein Produktionscode verändert, keine Builder-Aufnahme als unabhängiger Beleg verwendet, keine Reparatur durchgeführt.

## Punkte nach demselben Raster

| Kriterium | Gewicht | C2 0–5 | Beitrag | Einordnung |
|---|---:|---:|---:|---|
| Vollständigkeit / kausale Folge | 15 | 3 | 9 | Werkbankfolge geprüft; vollständiger nativer Nachweis offen |
| Mündungsfeuer / Impuls | 15 | 3 | 9 | Im Spielabstand geprüft; Nahform wegen Kamerafehler nicht sauber prüfbar |
| Leuchtspur / Bahn | 15 | 3 | 9 | Gegenüber C1 deutlicher |
| Materialabhängiger Treffer | 15 | 3 | 9 | Alle Materialien selbst gesehen |
| Lesbarkeit / Bildruhe im Spiel | 15 | 3 | 9 | Werkbank-Spielabstand verbessert; native Abnahme offen |
| Synchronität / Druck / Spiel-SFX | 10 | nicht prüfbar, formal 0 | 0 | Nur technischer Audiostatus |
| Tag / Nacht | 10 | 3 | 6 | Spielabstand beidseits selbst geprüft |
| Integration / Wiederholung | 5 | 2 | 2 | Konkreter Nahkamera-Fehler; hoher Feuertakt nicht erneut geprüft |
| Gesamt | 100 | — | **53/100** | Keine Abnahme |

Eine höhere Punktzahl ist keine Freigabe. Das vorab festgelegte Raster verlangt mindestens 80/100, die Kriterien 1–7 jeweils mindestens 3/5 sowie sämtliche Evidenz-Gates. Die Gesamtgrenze wird deutlich verfehlt, Nahkamera- und hörbarer AV-Gate sind offen. Die Werte sind gestalterische Urteile aus diskreten Bildschirmbelegen, keine framegenauen Timingmessungen.

## Beobachtungen

**Bessere Lesbarkeit:** Die Bahn ist nun im normalen Spielabstand als gerichteter heller, zugespitzter Strich deutlicher. Mündung und Kontakt sind in einzelnen Echtzeitbildern gemeinsam zu sehen. Beispiel: c2/02-day-game-Holz-1.png und c2/02-day-game-Metall-1.png. Der Strich bleibt in den beobachteten Ausklängen nicht als Dauerstrahl stehen. Er wirkt weiterhin recht schlicht; der Kontakt setzt im Vergleich zur Mündung nur einen kleinen Akzent.

**Nacht verbessert:** Figur und Bodenkontur sind gegenüber meinem C1-Lauf deutlich besser lesbar. Mündungslicht setzt einen kurzen Bodenakzent, die Kontaktpartikel bleiben erkennbar. Die Metallplatte ist noch sehr dunkel, der Kontext verschwindet aber weniger stark. Beispiele: c2/03-night-game-Stein-1.png, Holz-1.png und Metall-1.png. Keine in meinen Belegen dominierende Wolke oder fliegende Kugel.

**Materialwirkung bleibt funktional:** Stein wirft kleine helle Dreiecks-/Plättchenformen, Holz längliche Stäbe/Splitter, Metall feine helle Funken aus. Materialplatten sind nun klarer voneinander unterscheidbar. Ein dunkler Kontaktpunkt bleibt an der Fläche sichtbar. Der Auswurf ist weiterhin einfach und weitgehend radial; Stein wirkt grafisch flach und Holz geometrisch gleichförmig. Das ist ausreichend unterscheidbar, noch keine überzeugend ausgearbeitete Oberflächenreaktion. Beispiele: c2/07-day-hit-Stein-8.png, Holz-8.png, Metall-5.png.

**Mündungs-Nahkamera fehlerhaft:** Nach normalem Klick auf „Mündung“ zeigt die Kamera Beine, Bauch und den unteren Waffenbereich. Beim Anheben zum Schuss liegen Waffenmündung und Effekt außerhalb des oberen Bildrandes. Das tritt in meinem Lauf bei Tag und Nacht auf. c2/06-day-muzzle-8.png und die Reihen c2/04-night-muzzle-* bzw. c2/06-day-muzzle-* belegen den Zustand. Ich habe die Kamera nicht durch manuelles Umsehen oder andere Eingriffe nachgestellt. Die notwendige Formprüfung der Mündung scheitert damit an der vorgesehenen UI-Kamera. Die Wertung 3/5 für den Effekt basiert auf den Spielabstandsbelegen und ist durch diesen fehlenden Nahbeleg begrenzt; die Kamera wird zusätzlich im Integrationskriterium abgewertet.

## Audiostatus: technisch belegt, nicht gehört

Nach normalen Schussklicks war „Spiel-SFX an“ aktiv. Ein gezieltes Auslesen des vom Kandidaten bereitgestellten data-combat-status ergab: state=running, mode=full, unlocked=true, contexts=1, index/combatStage/ready/total jeweils ok=true, Bank loaded=22, plays=14; error=null und errors=[]. cues=[] und events=[] waren beim gezielten Ablesen leer. Es wurden daher keine tatsächlich abgegriffenen Cue-IDs protokolliert. Vollständiger, auf Audio und Status begrenzter Beleg: c2/05-audio-status.json.

Dieser Befund bestätigt einen laufenden, freigeschalteten Audiostatus und geladene Bankeinträge. Er bestätigt weder den hörbaren Inhalt noch Klangqualität, Impuls, Lautheit oder audiovisuelle Synchronität. Kein Ton wurde gehört. Keine neue C2-Videoaufnahme wurde heruntergeladen oder ausgewertet. Die ältere eigene C1-Aufnahme ist kein C2-Beleg.

## Nicht erneut geschlossen

- Native C2-Spielkamera: Seite selbst geöffnet und Bereitschafts-UI erreicht; kein neuer nativer Schuss-/Aufnahmelauf. Der unverändert offene native Abnahme-Gate aus C1 wird nicht durch eine Builder-Aufnahme ersetzt.
- Private Site C2: nicht erneut geprüft. Lokale Funktionsprüfung ist keine Bestätigung ihrer veröffentlichten Revision.
- Kein lückenloser Video- oder hörbarer AV-Beleg; Screenshots haben keinen festgelegten Bildtakt.
- Hoher Feuertakt und längere Wiederholungslast nicht erneut geprüft. Keine entsprechende Verbesserung behauptet.
- Referenzvideo weiterhin nicht selbst angesehen; kein direkter Gleichwertigkeitsvergleich und keine Urheberschaftszuschreibung an Riot.

## Belege und Abschluss

Nachtrag: /private/tmp/kfb-combat-blind-critic-r2/ADDENDUM_C2.md
Eigene C2-Belege: /private/tmp/kfb-combat-blind-critic-r2/c2/

c2/00-source-metadata.txt hält die gelesene Kennung fest. c2/02-day-game-* und 03-night-game-* enthalten die Echtzeitläufe aller drei Materialien. c2/04-night-muzzle-* und 06-day-muzzle-* belegen den Nahkamera-Fehler. c2/07-day-hit-* enthält die Material-Nahansichten. Die Kontaktbögen sind ausschließlich aus diesen eigenen PNGs abgeleitet. c2/08-last-ui-state.txt hält den letzten UI-Zustand fest.

Alle drei für diesen Nachtest geöffneten temporären Tabs (Werkbank, Metadaten, native Seite) sind geschlossen; GPU wieder frei. Keine weiteren Testschleifen oder Reparaturen vorgenommen. Ein nächster Abnahme-Gate bleibt ein vollständiger, eigenständig belegter Schuss aus der echten Spielkamera mit nutzbarer Mündungs-Nahansicht und hörbarem AV-Beleg. Dies ist eine Prüfvoraussetzung, kein neuer Reparaturauftrag.
