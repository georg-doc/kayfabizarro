# Unabhängige Blindkritik · Combat R2 · 17.11.2026

**Urteil: nicht zur Abnahme empfohlen.** Der Kandidat zeigt einen funktionalen Pistolen-Effekt mit erkennbarer Schussfolge, einem ausgearbeiteten Mündungs-Sprite und tatsächlich verschiedenen Materialpartikeln. Die vollständige Wirkung erreicht aus dem Spielabstand noch nicht die geforderte gestalterische Klarheit. Insbesondere Treffer und Leuchtspur sind dort zu schwach, die Nachtansicht verschluckt die Umgebung, und die native Spielkamera liefert in meinem eigenen Durchlauf keinen belastbaren Gesamtbeleg der vollständigen Folge. Das ist keine Bestätigung professioneller oder AAA-Qualität.

## Identität und Eigenständigkeit

Selbst über normale Browser-UI geöffnet und bedient:
- Werkbank: http://127.0.0.1:8850/combat/
- Native Bühne: http://127.0.0.1:8807/pistol-gunshot.html
- Private Site: https://kfb-world-studio-mvp1.frizzlebob.chatgpt.site/combat/

Die lokale SOURCE.json wurde im Browser gelesen und als 17-source-metadata.txt festgehalten. Sie nennt build combat-stage-r2-c1-20261117, gameSourceCommit 1d4ecd2bbd42c5d77a4d61361fe823cec12e5adf und bundleSha256 efe8a5b8a2745ba2cdb231b3bbf56cf3feeece505c5da636dcbc79e011b9e98f. Das sind gelesene Metadaten, keine eigene kryptografische Dateiverifikation. Die private Site zeigte ohne neue Anmeldung die Combat-Oberfläche, befand sich beim Beleg aber noch im Ladezustand. Ihre vollständige Funktionsfähigkeit und exakte Revision wurden von mir nicht verifiziert.

Kein Produktionscode gelesen oder geändert. Keine Builder-Aufnahmen übernommen. Sämtliche PNGs in diesem Ordner stammen aus meinem eigenen CUA-Lauf. Die Kontaktbögen wurden ausschließlich aus diesen PNGs erzeugt. Die sichtbare Quellenklappe wurde zur Kandidatenkennung geöffnet; ihre technischen Behauptungen dienen nicht als Qualitätsnachweis.

## Bewertungsraster und Punkte

Das Raster wurde vor Kandidatenzugang festgelegt. Skala: 0 fehlt/nicht prüfbar, 1 klar fehlerhaft, 2 sichtbar schwach, 3 funktional, 4 überzeugend ausgearbeitet, 5 außergewöhnlich präzise. Gewichtete Punkte = Gewicht × Bewertung / 5.

| Kriterium | Gewicht | Punkte 0–5 | Gewichteter Beitrag |
|---|---:|---:|---:|
| Vollständigkeit / kausale Schussfolge | 15 | 3 | 9 |
| Mündungsfeuer / unmittelbarer Impuls | 15 | 3 | 9 |
| Leuchtspur / Geschossbahn | 15 | 2 | 6 |
| Materialabhängiger Treffer | 15 | 3 | 9 |
| Lesbarkeit / Bildruhe im Spiel | 15 | 2 | 6 |
| Synchronität / Druck / vorhandene Spiel-SFX | 10 | nicht prüfbar, formal 0 | 0 |
| Tag / Nacht | 10 | 2 | 4 |
| Integration / Wiederholung | 5 | 3 | 3 |
| Gesamt nach vorab festgelegter Regel | 100 | — | **46/100** |

Der Tonanteil von 10 Punkten ist eine Evidenzlücke, kein beobachteter Klangfehler. Die tatsächlich bewertbaren Kriterien erzielen 46 von 90 möglichen Punkten. Selbst bei späteren 5/5 im Tonkriterium läge das Gesamturteil bei 56/100 und damit unter der Abnahmegrenze von 80/100. Die Bewertungen der sichtbaren Wirkung sind ein begrenztes gestalterisches Urteil aus diesem Lauf; keine framegenaue Timingmessung.

## Konkrete Beobachtungen

**Mündung:** Im Tagesnahbild ist ein gerichteter, aufgefächerter weiß-oranger Blitz zu erkennen, keine beliebige Rauchkugel. Der helle Kern wird jedoch nahezu zu einer weißen Fläche; seine innere Staffelung ist dadurch begrenzt. In 03-muzzle-day-4.png erscheint die helle Hauptform zudem sichtbar vor der Mündung statt optisch fest in ihr verankert. Die Waffe hebt sich im Schussclip, der Effekt liest sich kurz. Für 4/5 fehlen mir kontrolliertere Kernform, engerer optischer Anschluss und überzeugenderer Druck aus der gesamten Folge.

**Bahn:** 06-trajectory-day-12.png zeigt eine gerichtete, sehr dünne weiße Linie vom Waffenbereich bis zum oberen linken Zielbereich. Sie ist kausal nachvollziehbar, in der Spielentfernung aber eher ein feiner Strich als ein deutlich gestalteter, impulsiver Flug. Der Schuss ist aus dieser Ansicht klarer als der Treffer. In den beobachteten Ausklängen bleibt kein Dauerstrahl stehen. Aus diskreten Screenshots kann ich keine genaue Lebensdauer oder lückenlose Sichtbarkeit attestieren.

**Materialtreffer:** Die Unterschiede sind echt sichtbar: Stein wirft helle kleine quadratische Fragmente aus (11-hit-stone-day-17.png), Holz längliche braune Splitter (07-hit-wood-night-17.png), Metall kurze helle Funken (08-hit-metal-night-17.png). Das geht über bloß andere Farben hinaus. Dennoch bleiben es einfache radiale Auswürfe; Stein wirkt wie flache helle Plättchen, Holz wie wenige gerade Stäbe. Kontaktkern und Oberflächenreaktion sind schwach. Die neutralen Zielplatten haben wenig Materialausarbeitung. Im Spielabstand verschwindet vor allem der Steintreffer fast vollständig.

**Spielabstand / Bildruhe:** Die Werkbank bleibt ruhig; ich sah keine bildfüllende Wolke, keine dominante fliegende Kugel und keine Restpartikel-Anhäufung nach den beobachteten Schüssen. Die drei nacheinander ausgelösten Tagesschüsse hinterlassen keine sichtbare Dauerüberdeckung. Mündung und dünne Bahn sind in einzelnen Bildern lesbar, ein kompletter markanter Mündung→Bahn→Kontakt-Akzent entsteht aus diesem Abstand aber nur schwach. Beleg: 12-game-day-burst-contact.jpg und die Original-PNGs.

**Nacht:** Der Mündungsakzent ist im eigenen Echtzeit-Spielabstandsbild sichtbar (10-game-night-real-0.png); der Boden zeigt kurz einen Lichtfleck. Figur, Materialflächen und Umgebung sind jedoch überwiegend sehr dunkel. Die Holzsplitter sind im Nahbild verständlich, die Metallfläche fast schwarz. Das verbessert die Effektisolierung, schwächt aber die Spielszenenlesbarkeit. Der separate Mündungs-Nachtlauf 09-* erfasst keinen hellen Peak; daraus folgt kein Nachweis eines fehlenden Effekts, sondern eine Grenze dieser zeitlich diskreten Erfassung.

**Native Spielkamera:** Nach längerer Ladezeit ließ sich „Bereitstellen“ auslösen. Ein erster Klickversuch meldete Timeout; ich prüfte den Zustand, ehe ich den normalen AX-Klick ausführte. Die UI bestätigte anschließend „Echte Spielkamera“. „Kurze Aufnahme“ lief durch Holz, Stein und Metall und meldete danach „Aufnahme bereit · echte Spielkamera“. Meine eigenen Bilder 15-native-sequence-* zeigen eine steile Ansicht über Figur und Gelände; die vollständige Schussbahn samt klarer Kontaktstelle ist darin nicht überzeugend abzulesen. Einzelne kleine Materialpartikel sind erkennbar. Dies ist kein belastbarer nativer Gesamtbeleg. Ich behaupte deshalb ausdrücklich keinen bestandenen nativen Kamera-Gate.

## Grenzen und offene Gates

- Keine hörende Beurteilung möglich. Ich habe Klangqualität, Druck des Sounds, Mix oder audiovisuelle Synchronität nicht gehört und nicht bestätigt.
- Die Werkbank meldete nach meinem Aufnahme-Klick „Aufnahme mit Spiel-SFX bereit“. Das ist nur ein UI-Nachweis, kein Beweis vorhandener Audiospuren oder ihrer Qualität.
- Die Browser-Schnittstelle verweigerte den direkten Blob-Download. Der anschließende reguläre Link-Klick mit Download-Ereignis lief in Timeout. Die erste zeitlich begrenzte Dateisuche fand noch keine Datei. Anschließend wurde anhand des exakten Dateinamens der tatsächliche Download bestätigt: kfb-combat-game-day-stone (1).webm, 2.891.968 Bytes, geändert 17.11.2026 10:15:40 CET, passend zu meinem Klick. Diese eigene UI-Aufnahme ist als 19-own-ui-recording-day-stone.webm gesichert. Der Download-Timeout war damit ein unbekannter Zustand und kein fehlgeschlagener Download. Die Datei wurde hier nicht hörend oder per Videoplayer ausgewertet. ffprobe ist im Standardpfad nicht verfügbar; Audiospur, Lautheit und Synchronität bleiben daher technisch und hörend ungeprüft.
- Die ausgewerteten eigenen Sichtbelege sind diskrete Screenshots; zusätzlich liegt die eigene, bislang nicht ausgewertete UI-Videoaufnahme vor. Sie belegen Formen und Zustände, keine lückenlose Wiedergabe und keine framegenaue Synchronität.
- Tag/Nacht wurde in Spielabstand und Nahansichten bedient; der Lauf deckt jedoch nicht jedes Material in jeder Kamera unter beiden Lichtzuständen vollständig ab. Stein ist stark im Tag-Treffernahbild, Holz und Metall im Nacht-Treffernahbild belegt. Das vollständige Kreuzraster bleibt offen.
- Die schnelle Wiederholbarkeit wurde mit drei normalen Schuss-Klicks und der UI-Aufnahmesequenz geprüft; ein hoher Feuertakt unter längerer Last wurde nicht belegt.
- Die Motzify-Referenz https://www.youtube.com/watch?v=HTPbHeqstT0 war als Webseite zugänglich, ihr Video über meine verfügbaren Zugriffswege nicht angesehen. Kein direkter visueller Gleichwertigkeitsvergleich. Keine Behauptung, die gezeigten Effekte stammten von Riot.

Abnahme-Gates: Zugang lokal bestanden; mindestens zwei verschiedene Materialwirkungen sichtbar bestanden; keine dominante Wolke/Kugel bzw. stehender Strahl in den beobachteten Bildern; vollständige native Kamerafolge, vollständiges Tag/Nacht-Materialraster und hörbares AV-Gate offen. Schon die sichtbaren Kriterien 3, 5 und 7 unterschreiten die Mindestanforderung von 3/5.

## Nächster Gate

Ein vollständiger, gut lesbarer Schuss aus der echten KFB-Spielkamera in normaler Geschwindigkeit: Mündung, klarer Flug und materialtypischer Kontakt müssen im selben Ablauf sicher erkannt werden. Erst danach kann ein hörbarer AV-Beleg die Sound- und Synchronitätsprüfung schließen. Das ist eine benannte Abnahmebedingung, kein erteilter Reparaturauftrag.

## Belege / Abschluss

Wichtigste Dateien:
- 03-muzzle-day-4.png — Tages-Mündungsform.
- 06-trajectory-day-12.png — gerichtete Bahn und Zielposition.
- 07-hit-wood-night-17.png — Holzsplitter.
- 08-hit-metal-night-17.png — Metallfunken.
- 11-hit-stone-day-17.png — Steinfragmente.
- 10-game-night-real-0.png und 10-game-night-real-contact.jpg — Nacht-Spielabstand.
- 12-game-day-burst-contact.jpg — drei Tagesschüsse, diskrete Abfolge.
- 14-native-ready.png, 15-native-contact.jpg, 16-native-final.png — eigener nativer Lauf.
- 17-source-metadata.txt — im Browser gelesene Kandidatenmetadaten.
- 18-site-access.png — private Site erreicht, noch im Ladezustand.
- 19-own-ui-recording-day-stone.webm — tatsächlich heruntergeladene eigene UI-Aufnahme; Inhalt und Ton hier nicht ausgewertet.

Alle Original-PNGs bleiben im selben Ordner erhalten. Die Namen mit fortlaufenden Nummern bezeichnen Aufnahmereihenfolge, keine fest getakteten Videoframes. Beide temporären Browser-Tabs wurden nach Sicherung geschlossen. Produktionscode unverändert.
