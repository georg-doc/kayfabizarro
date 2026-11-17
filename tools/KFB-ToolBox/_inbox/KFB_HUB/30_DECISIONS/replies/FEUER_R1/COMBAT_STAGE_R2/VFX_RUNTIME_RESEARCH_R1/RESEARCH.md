# KFB Combat-VFX: Quellcode-Deep-Dive Effekseer und three.quarks
17.11.2026 · Recherche-/Entscheidungspaket, kein Spieleinbau und keine gestalterische Abnahme

## Ergebnis und Entscheidung

**Effekseer ist der stärkere Kandidat für einen durchgängigen Authoring-Weg mit bereits gestalteten Effektprojekten. three.quarks ist der direktere Kandidat für eine Partikel-Wiedergabe innerhalb unserer bestehenden Three.js-Szene. Keines von beiden verwandelt einen ungestalteten Schuss automatisch in einen überzeugenden Schuss.**

Für KFB priorisiere ich jetzt die Prüfung realer, unveränderter Effektvorlagen: Effekseers `andrewfm/hit_eff` als ausgearbeitetes Treffer-Rezept und Quarks' originales Mündungsbeispiel als Referenz für getrennte Ebenen und Zeitkurven. Erst nach deren isolierter Sichtung und einem begrenzten Test an der echten KFB-Rendernaht wird eine Runtime übernommen. **Keine gleichzeitige Einführung beider Systeme in das Produktionsspiel.** Der erfolglose bestehende Gunshot wird nicht durch weiteres Vergrößern seiner weißen Linie zum neuen Standard.

Der neue EffekseerForWeb-Hauptzweig ist nicht mit dem bereits veröffentlichten EffekseerForWebGL-Paket gleichzusetzen. Der öffentliche Patch-Baustein `patch/effekseer` verwendet die ältere, veröffentlichte WebGL-Runtime 1.80.8 und besitzt einen konkreten kleinen Three.js-Adapter, komplette Lizenznotizen und 33 Effektvorlagen. Er ist ein besonders nützlicher geprüfter Ausgangspunkt für einen Versuch. Seine Demo-Farb- und Tiefentricks dürfen nicht ungeprüft ins Spiel wandern.

| Frage | Effekseer / Web | three.quarks |
|---|---|---|
| Gestaltung | Eigenständiger Desktop-Editor, editierbare Projekte, Kurven, Hierarchien, Materialien; kompilierter Effekt für die Wiedergabe | Partikelsysteme und Verhalten in Code/JSON; separater gehosteter visueller Editor |
| Wiedergabe im vorhandenen KFB-WebGL | Derselbe GL-Kontext möglich, aber eigener nativer Renderer und GL-Zustand | Eigene Batch-Objekte innerhalb derselben Three.js-Szene |
| Konkretes Original | Sieben Ebenen im gelesenen Trefferprojekt; Laserdateien im offiziellen WebGL-Beispiel | Sechs Systeme im gelesenen Mündungsbeispiel; gesonderte Trail-/Explosionsbeispiele |
| Größter Integrationspunkt | Farbverarbeitung, Tiefe, Audioinitialisierung, WASM/Assets | Shader-/Materialverträglichkeit, CPU-Partikelbudget, Tiefe für Soft Particles |
| KFB-Kollision/Schaden | Bleiben beim vorhandenen Zielbesitzer | Bleiben beim vorhandenen Zielbesitzer |
| Freigabestatus | Noch kein KFB-Kompatibilitäts- oder Qualitäts-PASS | Deklarierter Versionsbereich passt; noch kein KFB-Kompatibilitäts- oder Qualitäts-PASS |

## Warum der bisherige Schuss gescheitert ist

Das ist am eigenen Quellcode konkret nachvollziehbar. Die zuletzt gezeigte Fassung ist **keine getreue Übernahme** des Quarks-Mündungsbeispiels oder eines vollständig gestalteten Effekseer-Treffers.

In `pistolGunshot.r1.js` begrenzt `segment()` die sichtbare Spur ausdrücklich auf die letzten 2.4 m des angekommenen Segments. Weitere Sweep-Meldungen überschreiben den sichtbaren Abschnitt. `draw()` hält diesen Abschnitt 55 ms sichtbar und blendet ihn aus. Der Nutzer sieht deshalb den hellen Rest am Ziel, keinen überzeugend vom Lauf zum Ziel laufenden Ausstoß. Das ist eine eigene Darstellungsentscheidung des Builders, kein Fehler eines Donor-Beispiels.

Der Stein-/Holztreffer erzeugt neun einfache Fragmente, drei Staubflächen und eine Kontaktmarke. Ein ausgearbeitetes kurzes Kontaktmaximum mit gestaffelten Formebenen fehlt. Metall bekommt zwölf einfache Funken. Das erklärt die fehlende Wucht wesentlich besser als ein angeblich zu kleines Partikelbudget.

[Eigener tatsächlich gezeigter Code](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/c60dc8aed5d452da6b8cb5ed03f5d9c4bae1c3fd/src/modules/pistolGunshot.r1.js). Georg hat auch diese Fassung verworfen. Die unabhängige vorherige53/100-Wertung wird nicht als Zustimmung verwendet.

## three.quarks: was der Code tatsächlich bereitstellt

Geprüfter Quellstand: `9d0445c5949c7da570f412ad7007efecd0357886`. Die Registry meldete bei der Recherche Version 0.18.0 und `three >=0.182.0`. KFB verwendet im aktuellen empfangenden Stamm `three@0.186.1` und R3F 9.8.1. Der deklarierte Bereich umfasst KFB; ein erfolgreicher Shader-/Knet-Look-Test folgt daraus nicht.

Die WebGL-Klasse `BatchedRenderer` hängt als Three.js-Objekt in der vorhandenen Szene. Sie braucht keinen neuen Canvas oder zweiten WebGL-Kontext. Der Host ruft ihr `update(dt)` auf. Für KFB wäre der direkte Host-Anschluss sinnvoll; ein unverändert übernommener R3F-Provider darf keinen zweiten Update-Takt neben M1 einführen.

**Das originale Mündungsbeispiel besteht aus sechs Systemen:**

| System | Im Originalcode |
|---|---|
| Beam | Lokaler, unbewegter Mündungsanteil,0.1–0.2 s; trotz Namen kein fliegendes Geschoss |
| Muzzle1 | Lokale animierte Fläche, Flipbook-Kurven und Größen-/Farbverlauf |
| Muzzle2 | Zweite, um 90° gekreuzte animierte Fläche |
| Flash | Zwei kameragerichtete Blitzflächen, eigene Frame- und Farbkurve |
| Smoke | Fünf Weltpartikel aus einem 20°-Kegel,0.6–0.8 s, Normal-Blending, Rotation |
| Particles | Acht gestreckte Funken,0.2–0.6 s, Geschwindigkeit1–15, eigener Größenverlauf |

Das Original ist ein stilisiertes Performance-Beispiel, **kein realistischer Pistolen-Gesamtshot**. Es enthält weder einen materialabhängigen Einschlag noch eine native Geschosskollision. Seine Partikel- und Rauchgestaltung ist keine automatische KFB-Art-Direction.

Das Trail-Beispiel zeigt bewegte, auf historischen Punkten beruhende Trails mit Kraft und Kollision; es ist eine eigenständige bunte Partikeldemo. Das Explosionsbeispiel lädt ein fertig gestaltetes `ps.json` über `QuarksLoader`. Man muss also zwischen Wiedergabewerkzeug und gestaltetem Effektpaket unterscheiden.

Wichtige Befunde aus der Runtime:
- Die Partikelsimulation läuft in der gelesenen `ParticleSystem.ts` über CPU-Schleifen. Batching/Instancing betrifft die Zeichnung. Marketing zu GPU/WASM ist kein Beleg, dass dieser WebGL-Pfad alles auf der GPU simuliert.
- `update()` begrenzt einen einzelnen Delta-Schritt auf 0.1 s. Für Pausen, Ruckler und Wiederholungen muss KFB genau einen definierten Takt liefern.
- `BaseBatchedRenderer.equals()` fasst nur passende Material-, Textur-, Blend-, RenderMode-, Layer- und RenderOrder-Einstellungen zusammen. Unterschiedliche Effekte sind nicht automatisch ein einziger Draw Call.
- `spawn()` erweitert den Partikelpool nach Bedarf. Die in Beispielen stehende Option `maxParticle` ist im gelesenen aktuellen `ParticleSystem` keine nachgewiesene harte Begrenzung. Ein Budget muss über nachvollziehbare Emission/Anzahl/Lebensdauer und Host-Regeln gesichert werden.
- WebGL-Soft-Particles benötigen eine vorhandene oder separat erzeugte Tiefentextur über `setDepthTexture()`. KFB besitzt eine solche im HDR-Ziel, aber dieselbe Textur darf nicht beliebig gleichzeitig als beschriebener Tiefen-Anhang und gesampelte Quelle benutzt werden. Eine passende Pass-Reihenfolge oder Tiefenkopie muss erst getestet werden.
- KFBs `onBeforeCompile`-Erweiterungen und dessen Knet-Materialien sind nicht durch den Peer-Versionsbereich abgedeckt. Unlit-Sprites benötigen nicht denselben Shader wie Knet-Meshes; beleuchtete Mesh-Partikel sind ein eigener Testfall.
- Die neue WebGPU-Variante ist kein Grund, KFBs vorhandenen Renderer umzubauen. Für diesen Auftrag ist der WebGL-Import maßgeblich.

Der MIT-Lizenznachweis betrifft das Repository/Runtime. Ein Editorzugang oder Marktplatz-Asset erbt diese Lizenz nicht automatisch. Auf der aktuellen Quarks-Preisseite steht für die kostenlose Editorstufe kein JSON-Export; Starter wird mit 12 USD pro Monat/Benutzer und Export beworben. Keine Anmeldung, kein Kauf und kein privater Upload wurde vorgenommen. Die FAQ enthält zudem Beispiele/Aussagen, die nicht mit der aktuellen Runtime-Oberfläche übereinstimmen; für den Adapter sind der gepinnte Code und reale Tests maßgeblich.

[Originales Mündungsbeispiel](https://github.com/Alchemist0823/three.quarks/blob/9d0445c5949c7da570f412ad7007efecd0357886/packages/quarks.examples/muzzleFlashDemo.js), [Runtime](https://github.com/Alchemist0823/three.quarks/blob/9d0445c5949c7da570f412ad7007efecd0357886/packages/three.quarks/src/ParticleSystem.ts), [Batch-Regeln](https://github.com/Alchemist0823/three.quarks/blob/9d0445c5949c7da570f412ad7007efecd0357886/packages/three.quarks/src/BaseBatchedRenderer.ts), [Editorangebot](https://quarks.art/).

## Effekseer: Authoring, Originaltreffer und Web-Wiedergabe

Effekseer trennt das Gestalten im Editor von der kompakten Wiedergabe im Spiel. Die offizielle Downloadseite bietet 1.80.8 auch für MacARM64. Das veröffentlichte Release 1808 enthält `EffekseerForWebGL1.80.8.zip` mit 3000475 Bytes. Das ist die Größe des kompletten Archivs, keine gemessene Netzwerk- oder Startzeit eines KFB-Moduls.

Der neuere untersuchte `EffekseerForWeb`-Hauptzweig `a6a0758cfb4e273a14a1c8c1860a017be6d949a9` implementiert WebGL und WebGPU. Das offizielle WebGL-Beispiel übergibt `renderer.getContext()`, verwendet `setCameraFromThree()`, zeichnet nach der Szene und ruft `renderer.resetState()` auf. Es lädt Laser01/02/03 als konkrete Ressourcen. Die Beispielkamera, deren Version und ein gerendertes Laserbild sind kein Nachweis der KFB-HDR-Verträglichkeit.

Im neuen Repository waren zum Recherchezeitpunkt keine eigenen Releases gelistet. Die geprüfte API aus dem Hauptzweig und das veröffentlichte ältere WebGL-Paket haben unterschiedliche Initialisierung. Diese Schnittstellen dürfen nicht vermischt werden.

### Konkreter Fund: Patch-Effekseer statt neuer Eigenkonstruktion

Originalstand `patch/effekseer@31f94d3d4a5d6b4b8be825c5470c266edb0de0b7` wurde als Quellcode gelesen. Sein Adapter importiert keine Three.js-Bauteile, nutzt aber den bestehenden GL-Kontext. Das Projekt pinnt dieselbe Three-Version0.186.1 wie KFB.

Das gelesene `source/andrewfm/hit_eff.efkproj` ist ein editierbares XML-Projekt mit 19204 Bytes und sieben benannten Knoten:

| Knoten | Angegebene zentrale Lebensdauer | Angegebener Startversatz |
|---|---:|---:|
| Impact Orientation |50 Frames |nicht ausdrücklich gesetzt |
| Small Flashes |15 Frames |3 Frames |
| Action Lines |9 Frames |2 Frames |
| Motion Sparks |18 Frames |6 Frames |
| Spark Sparkles |30 Frames |7 Frames |
| Glow |12 Frames |nicht ausdrücklich gesetzt |
| Big Flash |9 Frames |1Frame |

Das Projekt hat außerdem vier kleine Blitze, drei Action Lines und jeweils 30 Motion Sparks/Spark Sparkles in seinen expliziten Generationseinstellungen. Die Tabelle beschreibt die Quelldaten; Defaults und wahrgenommene Bildwirkung wurden nicht aus einer Animation rekonstruiert. Der Patch-Player zählt 60 Effektframes pro Sekunde.

Das Feuer-Burst-Projekt enthält seinerseits Smoke, Fire, Shockwave, Flash, Debris und Debris Trail. `SonicBoom` umfasst 14 Knoten einschließlich Distortion, zweier Bursts und Shockwave. Diese Beispiele zeigen eine gestaltete Ursache-/Folge-Struktur, die unserem aktuellen simplen Treffer fehlt.

**Geeignete Donorsichtung:**
- `andrewfm/hit_eff.efk`: Kontaktimpuls und gestaffelte Nachwirkung, besonders für einen klaren Energietreffer als Ausgangspunkt.
- `tktk/ToonHit.efk`: stilisierte, kantige Trefferformen für Blaster-/KFB-Anmutung; keine automatische realistische Steinwirkung.
- `pierre-1/SonicBoom.efk`: Quelle für eine größere Druck-/Distortionswirkung, eher schwere Waffe oder Explosion.
- Offizielles Laser01/02/03: Strahl-/Blasterkandidaten; nicht als Pistolen-Tracer umdeklarieren.

Die Patch-Messdaten geben für `red-hit` bei Originalskala etwa 5.70×5.87 m an, für `spark-hit` etwa 11.37×13.57 m. Das sind **Messungen des Donors, nicht unsere Messungen**. Ein unveränderter 8 m-Treffer im Spiel wäre ebenso falsch wie der aktuelle schwache Treffer. Die Form wird zuerst unverändert in Isolation betrachtet, danach nachweisbar für die Waffe dimensioniert.

### Die drei entscheidenden Einbauhürden

**1. Farbe/HDR und Tiefe.** Der Patch-Adapter zeichnet in das gerade gebundene Ziel. Seine Demo tone-mappt die Szene vor den Effekten, zeichnet deren für Display-Farben gestaltete Ausgabe darüber und verwendet dafür ein Ziel ohne Tiefenpuffer. Die README warnt ausdrücklich vor ausgewaschener Wirkung in linearen Zielen und harten Glow-Schnitten bei normalem Tiefentest. Das ist keine fertige Spielintegration mit verdeckenden Wänden. KFB rendert bereits in ein Half-Float-Ziel mit Tiefe und führt eine gemeinsame Ausgabe-Tonkurve aus. Der richtige Platz im Pass muss anhand dieses bestehenden Besitzers entschieden werden. Ein fremder Bloom-/Compositor-Owner wird nicht zusätzlich eingeführt.

**2. Der eine Audiomischer.** Sowohl der geprüfte ältere C++-Pfad als auch der neue `RuntimeContext.h` initialisieren OpenAL. Im mitgelieferten Emscripten-JavaScript ist die Erzeugung eines neuen AudioContext enthalten. Das gilt auch dann, wenn die ausgewählten Effekte keine Sounddateien besitzen. Im neuen TypeScript setzt `audioContext` lediglich die von `resumeAudio()` verwendete Referenz; es ist im gelesenen Pfad kein belegter Ersatz für die native OpenAL-Kontexterzeugung und keine Verdrahtung an KFBs Busse. **`setSoundVolume(0)` oder stumme Projekte sind kein Beweis für einen einzigen Kontext.** Ein belastbarer KFB-Versuch braucht eine explizit soundlose Runtime oder einen echten verifizierten Anschluss; alle Schuss-/Treffer-SFX bleiben bei `kfbAudio`.

**3. Takt und Ressourcen.** Effekseer erwartet Delta in60Hz-Effektframes, Quarks Sekunden. KFB bleibt der Taktbesitzer. Die Quelladapter-RAF-Schleifen werden nicht zusätzlich übernommen. Effekseer-Texturen müssen vor dem Schuss geladen sein; GL-Unpack-Flags, Runtime-/Effektfreigabe, Context-Loss und Lifecycle sind eigene Prüfungen. Distortion benötigt ein Bild der Szene; der gelesene WebGL-Capture-Pfad kopiert in eine RGBA/Unsigned-Byte-Textur, wodurch für HDR eine weitere konkrete Prüfung entsteht. Eine Soft-Particle-Tiefen-API ist in der gelesenen neuen öffentlichen WebGL-TS-Oberfläche nicht belegt.

### Größen und Lizenzen

Aus den tatsächlichen Patch-Runtime-Bytes gemessen:
- JavaScript 168668 Bytes, lokal gzip 37076 Bytes.
- WASM 1403622 Bytes, lokal gzip 372191 Bytes.
- Zusammen 1572290 Bytes roh bzw. 409267 Bytes lokal gzip, **ohne Effektressourcen, ohne Server-Header und ohne Startzeitmessung**.
- Im Quellbaum sind zahlreiche Textur-/Modelldateien Git-LFS-Zeiger. Deren ungefähr 130 Bytes sind nicht ihre Assetgröße. Ein vollständiges Runtime-/Artpaket wurde nicht als fertig heruntergeladen behauptet.

Runtime/Adapter MIT. Der mitgelieferte Sample-Hinweis und die Effekseer-Primärdokumentation belegen CC0 für die entsprechenden Sample-Effekte. Die offizielle Webseite enthält separat ältere Sammlungen mit anderen Bedingungen. Deshalb gilt die Freigabe für die belegten Sammlungen und Dateien, nicht automatisch für jeden Download mit Effekseer im Namen. Die Patch-Lizenznotizen ordnen alle 33 Effekte ihren Autoren zu; der Hinweis wurde gegen den offiziellen Sample-Text gegengeprüft. Das fehlende `LICENSE` im Unterrepo `ResourceData` wurde nicht stillschweigend durch die MIT-Lizenz der Engine ersetzt.

[Neues WebGL-Beispiel](https://github.com/effekseer/EffekseerForWeb/blob/a6a0758cfb4e273a14a1c8c1860a017be6d949a9/PackageData/Sample/webgl.js), [neue native Initialisierung](https://github.com/effekseer/EffekseerForWeb/blob/a6a0758cfb4e273a14a1c8c1860a017be6d949a9/src/cpp/RuntimeContext.h), [ältere native Initialisierung](https://github.com/effekseer/EffekseerForWebGL/blob/accb827e32e60d3986fe9924237ebe81d98b55f0/src/cpp/main.cpp), [Patch-Baustein mit Quellcode](https://patch.gg/patch/effekseer), [offizielle Samples/Lizenzen](https://effekseer.github.io/en/contribute.html).

## Konkreter Produktionsweg für WS0

**Erster Versuch:** unverändertes Quarks-Mündungsbeispiel und unverändertes Effekseer-`hit_eff` als getrennte Donornachweise. Keine verkürzte Ersatzanimation zeichnen. Danach genau einen Effekt am echten KFB-Kamera-/HDR-Pfad prüfen; die Runtimeentscheidung erfolgt aus diesem Ergebnis. Für die Auswahl zählt der vollständige Schuss, nicht ein schönes einzelnes Partikelbild.

Eine Pistole braucht dann eine zusammenhängende Gestaltung:
1. Der vorhandene Animations-/Mündungsanker gibt den Schuss einmal frei.
2. Der Flugweg stammt aus dem bestehenden Sweep. Der sichtbare Impuls beginnt an der Mündung und erreicht den bestätigten Kontakt; der derzeitige isolierte Restabschnitt wird nicht weiterverwendet.
3. Am Kontakt sitzt eine kurze, klare Hauptform. Nachlauf, Materialauswurf und Kontaktmarke sind getrennte Ebenen mit abnehmender Energie.
4. Holz, Stein und Metall ändern Form, Farbe und Auswurf. Körperkontakt übergibt an den vorhandenen Knete-/Ende-Kaskadenbesitzer. Ein generischer großer Magic-Burst ersetzt diese Materiallogik nicht.
5. Vorhandene SFX und Bodenlicht reagieren auf dieselben Freigabe-/Kontaktmeldungen. Keine fremde Audio-, Kamera-Shake- oder Point-Light-Infrastruktur wird unbesehen übernommen.

Der erste Nahttest prüft den identischen Effekt bei Tag/Nacht, aus der echten 55°-Spielkamera und den Nahansichten; vor/hinter einer Wand, am Boden und mit Pause/Reset. Er zählt wirkliche WebGL-/Audio-Kontexte und prüft Ressourcen nach wiederholtem Laden/Entladen. Für Kosten werden kalter erster Schuss, warmer erster Schuss und kurze Schussfolgen getrennt erfasst; CPU-Bildzeit, GPU-Zeit soweit verfügbar und sichtbare Zeitspitzen werden nicht durch einen geglätteten Film ersetzt. Die bereits gemessenen nativen p95 68.5 ms/Maximum 256 ms sind ein offener Befund, kein Effekseer-/Quarks-Benchmark.

Erst mit einer überzeugenden Pistolen-Gesamtsequenz folgt die Übertragung auf andere Waffen. Für Blaster bleiben das vorhandene Modell, seine Anker und Lila verbindlich.

## Belegumfang und Grenzen

- 17 Quarks- und14 neue Effekseer-Code-/Textdateien vollständig abgerufen; die für die aufgeführten Aussagen relevanten Implementierungen/Abschnitte geprüft. Das ist kein Vollaudit jeder Zeile dieser Repositories.
- Zusätzlich der ältere Effekseer-C++-Initialisierungspfad, originale Patch-Player-/Look-/Demo-/Lizenzdateien sowie mehrere editierbare Originalprojekte tatsächlich gelesen und drei Projektknotenbäume geparst.
- Quarks-Live-Demo selbst geöffnet: originale Mündungs-Performance-Szene sichtbar, eigenes Screenshot. Ihre gehostete Revision wurde nicht kryptografisch mit dem gepinnten Git-Stand gleichgesetzt. Der FPS-Zähler dort ist kein KFB-Benchmark.
- Effekseer-Patch-Demo zeigte die Bühne; ihre übergeordneten Effekt-Schalter blieben deaktiviert. Deshalb kein behaupteter eigener sichtbarer Hit-/Laser-Abspieltest und keine Erfindung eines daraus abgeleiteten Qualitätsurteils.
- Kein Einbau in KFB, keine neue Site-Version, kein gekaufter Editor, kein Asset-Upload und keine hörende Prüfung in dieser Recherche.
- Drei aktuelle GitHub-Start-/Workflow-Dateien gelesen. Die im Research-Skill genannten Atlas-Protokoll-/Indexdateien waren unter den angegebenen main-Pfaden nicht vorhanden. Deshalb bleibt dieser Bericht ein begrenzter Combat-Owner-Research-Return und behauptet keinen neuen kanonischen Atlas-Eintrag.
- Aktueller empfangender Stamm: `game/integration-r2@9fa6ddbd3f914c403a21453881cd44fdb406bfc5`; Three 0.186.1, bestehender M1-Takt, bestehende HDR-/Depth-Naht und ein Audiomischer im aktuellen GitHub-Stand geprüft.
- Detaillierte Quellen und Status in `SOURCE_LEDGER.json`; Donor-Schichtdaten in `DONOR_ANATOMY.json`.

**Ein nächster Gate:** Ein unveränderter, konkret benannter Originaleffekt muss isoliert und anschließend an KFBs vorhandener Farb-/Tiefen-/Takt-Naht nachweisbar funktionieren; dabei bleibt es bei einem AudioContext. Erst dann ist eine Runtimeentscheidung belastbar.

