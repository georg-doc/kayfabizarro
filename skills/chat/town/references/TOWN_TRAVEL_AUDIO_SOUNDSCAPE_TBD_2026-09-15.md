# KFB Town / Travel · TBD · World Audio & Soundscape Cohesion Pass

**Datum:** 15.09.2026  
**Status:** TO BE DISCUSSED / Design- und Audio-Pass, keine Implementation  
**Consumer:** KFB Travel Globe Planung, KFB Town, später ToolBox/Animation und weitere KFB-Spielhosts  
**Owner-Hinweis:** Town formuliert den Bedarf. Travel beziehungsweise der jeweilige Audio-Owner entscheidet Implementation und Tests im eigenen SSOT.

## Problem

Wie beim visuellen World Color & Lighting Cohesion Pass können unterschiedliche Musik-, Ambience-, SFX- und Voice-Quellen leicht wie mehrere übereinandergelegte Spiele wirken. KFB Town soll aber eine zusammenhängende Welt hören lassen, obwohl Graveyard, Farm, Maker Space, Area 51, City, Partyplatz, Ring, Vehicles und Orbit unterschiedliche lokale Klangidentitäten haben.

Dazu kommen verschiedene Produktionsquellen: generative Drones und prozedurale Sounds, vorhandene KFB-Songs, neue Suno-Instrumentals/Songs, Asset-SFX, Vehicle-/Combat-SFX und zunächst einfache Browser-TTS-Stimmen. Ein gemeinsamer Audio-Output allein garantiert keine Kohärenz.

## Ziel

Eine **immersive, räumlich lesbare KFB-Soundscape**, die lokale Orte unterscheidbar macht, aber dieselbe grundlegende Misch- und Prioritätslogik verwendet. Musik, Ambience, SFX und Sprache sollen sich gegenseitig Platz machen, statt gleichzeitig um Aufmerksamkeit zu kämpfen.

Nicht jede Zone braucht einen dauernden Song. Stille, Wind, entfernte Aktivität und einzelne lokale Quellen sind vollwertige Zustände.

## Grundprinzip

Nicht jede Quelle separat „schön mischen“. Stattdessen eine gemeinsame **World Audio Response** definieren und lokale Klangquellen darin platzieren.

### 1 · Global bed

Eine sehr leichte globale Grundschicht darf Wetter, Tageszeit, entfernte Weltaktivität und gegebenenfalls prozedurale Drone-/Atmosphäre tragen. Sie soll nicht als permanente Musikfläche alles zukleistern.

Beispiele: Wind, sehr entfernte Stadtaktivität, Wetter, tiefe generative Textur, nächtliche Insekten oder ein kaum hörbarer technischer Raumton in entsprechenden Gegenden.

### 2 · Local ambience zones

Farm, Graveyard, Maker Space, City, Area 51, Partyplatz und andere Orte bekommen lokale Klangfelder. Übergänge sollen räumlich beziehungsweise über kurze Crossfades erfolgen, nicht als harter Soundtrack-Wechsel an einer unsichtbaren Zonengrenze.

Lokale Ambience ist keine exklusive Instanz. Vom Rand einer Zone darf man bereits die nächste Quelle hören, wenn Entfernung und Gelände das plausibel machen.

### 3 · Diegetic music sources

Jukebox, Autoradio, Boombox, Band, Kino, Jumbotron und andere sichtbare Quellen spielen Musik **aus einem Ort in der Welt**. Entfernung, Richtung und gegebenenfalls Abschirmung beeinflussen ihre Präsenz.

Ein Song kann zur Hauptquelle werden, wenn der Spieler nahe genug ist oder ihn bewusst auswählt. Andere Musikquellen müssen dann nicht in voller Lautstärke weiterlaufen.

Vorhandene KFB-Songs und neue Suno-Tracks können dafür kuratiert werden. Rechte-/Produktionsstatus pro Track dokumentieren; keine pauschale Freigabe aus der bloßen Existenz einer Datei ableiten.

### 4 · Procedural / generated sound

Die vorhandene Drone-Idee darf erweitert werden. Interessant sind nicht nur gehaltene Drones, sondern kleine generative Systeme für Wind, elektrische Felder, Maschinen, Alien-Technik, entfernte Resonanzen, Boxel-/Voxel-Oberflächen oder wechselnde atmosphärische Texturen.

Ziel ist Variation ohne ständig neue Audiodateien. Generative Schichten bleiben subtil und dürfen wichtige SFX oder Sprache nicht maskieren.

### 5 · SFX families

SFX nach Funktion und Materialfamilie zusammenhalten: Schritte/Kontakt, Vehicle, Impact, UI/diegetische Bedienung, Werkzeuge, Combat, Boxel/Bumper, Natur, Magie/Alien, Crowd/Reaction.

Unterschiedliche Packs nicht einfach ungepegelt nebeneinanderlegen. Referenzlautheit, Transienten, Bassanteil und räumliche Reichweite pro Familie kalibrieren. Cartoon-Übertreibung bleibt erlaubt, aber innerhalb einer gemeinsamen Dynamik.

## Speech / Browser TTS

### Punk-POC

Für die frühe Town-Fassung ist **Browser Text-to-Speech ausdrücklich akzeptabel**. Keine ElevenLabs-Abhängigkeit für den ersten spielbaren Bewohnerbetrieb.

Figuren können zunächst grobe Voice-Profile wie `male`, `female`, `robot`, `old`, `bright`, `low` oder ähnliche verfügbare Kategorien erhalten. Diese sind **Wünsche/Charakterprofile**, keine Garantie auf einen bestimmten systemweiten Voice-Namen.

Browser und Betriebssystem stellen unterschiedliche Stimmen bereit. Deshalb keine kanonische Figurenidentität an einen einzelnen Voice-Namen binden, der auf anderen Geräten fehlen kann. Stattdessen pro Profil eine Prioritäten-/Fallback-Auswahl vorsehen.

Das gelegentlich blecherne, falsche oder billige Ergebnis darf zum KFB-Punk-Charme passen. **Technische Unverständlichkeit ist trotzdem kein Stilziel.** Kurze Triplets und kurze NPC-Sätze helfen.

### Voice selection fallback

Vorschlag für spätere Prüfung:

1. gewünschte Sprache zuerst,
2. passende grobe Voice-/Gender-/Timbre-Kategorie, soweit Browser-Metadaten sie zuverlässig hergeben,
3. bevorzugte lokale Stimme,
4. ansonsten erste verständliche Stimme der Zielsprache.

Keine Behauptung, dass alle Browser dieselben Gender- oder Timbre-Metadaten anbieten. Die tatsächliche Web-Speech-Unterstützung wird auf Zielgeräten geprüft.

## Mix priority und Ducking

Sprache bekommt temporär Platz, ohne die Welt stummzuschalten.

**Vorschlag für Prioritätsordnung:**

1. aktuell adressierte Sprache / wichtiger kurzer Callout,
2. unmittelbar spielrelevante SFX,
3. lokale diegetische Hauptmusik,
4. lokale Ambience,
5. globales Bed.

Beim Start einer relevanten TTS-Zeile werden Musik und Ambience kurz und weich abgesenkt. Spielrelevante Warn-/Kontakt-SFX bleiben hörbar, aber dürfen die Stimme nicht überfahren. Nach Sprachende kehren die Ebenen mit kurzer Release-Zeit zurück.

Nicht jede Ambient-NPC-Blase braucht automatisch dieselbe starke Ducking-Stufe. Eine gezielt angesprochene Figur darf stärker priorisiert werden als ein entfernter Buddy-Callout.

**Wichtig:** Ducking ist Mixlogik, keine Pausenlogik. Musik läuft zeitlich weiter, damit Tanz, Autoradio und Beat-Synchronisation nach einem Satz nicht neu starten oder auseinanderlaufen.

## Speech budget und Audio budget zusammen denken

Die Town-Regel bleibt: normalerweise eine aktive NPC-Sprechblase im Sichtfeld, zwei als weiche Obergrenze, eine dritte nur als begründete Antwort-/Eskalationsausnahme. Billboards/Jumbotron/Wegweiser gehören zur Media-/Landschaftsebene und verbrauchen kein NPC-Bubble-Budget.

Für Audio gilt analog: Nicht fünf entfernte NPC-TTS-Stimmen gleichzeitig starten, nur weil fünf Figuren technisch sprechen könnten. Sichtbarkeit, Entfernung, Gesprächsfokus und Sprecherbudget sollen Text- und Audioausgabe gemeinsam begrenzen.

Billboards sind vom **Bubble-Budget**, nicht automatisch vom **Audio-Budget** ausgenommen. Ein stilles Billboard kostet keine Stimme. Ein bewusst aktivierter Broadcast/Jumbotron bekommt einen Audio-Slot und muss mit Musik/Dialog koordiniert werden.

## Beispielstimmungen für einen Cohesion-Test

### Golden Hour / Town

Warme, offene Ambience, entfernte Stadtaktivität, lokales Autoradio oder Band als klare Musikquelle. Wind und Natur bleiben hörbar. TTS ducked Musik nur leicht bis mittel.

### Graveyard Night

Globaler Nacht-/Windboden, wenige lokale Grablichter visuell und dazu kleine Feuer-/Flacker-/Umgebungsgeräusche. Entfernte Skelette oder Vampirturm-Aktivität können räumlich vorkommen. Kein permanenter Horror-Drone-Zwang. Schwarzer Humor entsteht aus Bewohnern und Situation, nicht aus einem generischen Gruselbett.

### Maker Space

Werkzeuge, Maschinen und kleine elektrische/robotische Texturen bilden ein lokales Arbeitsfeld. Einzelne Aktionen müssen gegenüber dem Grundbetrieb lesbar bleiben. Musik kann aus einer sichtbaren Werkstattquelle kommen.

### Area 51 / Alien Night

Wind, offene trockene Landschaft, entfernte technische Resonanz und wenige fremdartige prozedurale Signale. UFO-/Traktorstrahl-SFX bekommen einen klaren räumlichen Verlauf. Nicht alle Sci-Fi-Geräusche gleichzeitig.

### Ring / Concert / Kayfabulation

Jumbotron, Crowd, Musik, Boxel/Bumper und Voice teilen denselben Ort. Je nach Modus wechselt die Hauptquelle. Beim Kayfabulation-Auftritt steht Sprache vorn; beim Konzert Musik; beim Match Treffer und Crowd-Reaktion. Derselbe Platz braucht deshalb einen benannten Mixzustand statt gleichzeitig alle Ebenen hochzufahren.

## Referenz-Testbühne

Analog zum visuellen Look-Test denselben kleinen Szenensatz unter mehreren Audiozuständen prüfen:

- FrizzleBob/Driver oder anderer Signature Character,
- ein KayKit-NPC mit TTS,
- Vehicle,
- Werkzeug-/Maker-SFX,
- Natur-/Windquelle,
- eine diegetische Musikquelle,
- ein Bumper/Impact,
- ein lokales Spezialfeld wie Graveyard oder Alien-Tech.

Prüffragen:

- Ist Sprache auf Laptop, Telefon und Kopfhörer verständlich?
- Ist die Herkunft einer diegetischen Musikquelle räumlich erkennbar?
- Klingen unterschiedliche SFX-Packs wie dieselbe Welt?
- Bleibt nach Ducking der musikalische Beat synchron?
- Entsteht beim Wechsel zwischen Nachbarschaften ein Übergang statt ein Audio-Cut?
- Bleiben wichtige Kontakte und Warnungen hörbar, ohne alles lauter zu machen?
- Gibt es echte ruhige Momente?

## TO BE DISCUSSED / keine Vorentscheidung

Noch offen:

- bestehender Travel-Audio-Owner und aktueller Mix-/AudioContext-Vertrag,
- konkrete Browser-TTS-Fallbackstrategie und Zielgeräte,
- ob und welche generativen Sounds bereits als wiederverwendbare Module existieren,
- Normalisierung/Loudness-Ziel für Musik und SFX,
- Occlusion/Reverb-Zonen und wie weit sie für den ersten Slice nötig sind,
- welche vorhandenen KFB-/Suno-Tracks in welchen Kontexten kuratiert werden,
- wie Musik-Metadaten für BPM/Beat/Section mit den bereits geplanten Signature Dances geteilt werden.

## Empfohlener nächster Test

Ein **KFB Audio Calibration Stage** mit drei Zuständen: `golden-hour-town`, `graveyard-night`, `ring-performance`.

Je Zustand dieselben Referenzquellen verwenden und nur World-/Local-/Mix-Parameter verändern. Erst wenn Sprache, Musik, Ambience und SFX dort zusammen funktionieren, die Regeln in Travel/Town als gemeinsamen Audio-Look übernehmen.

**Kein Ziel:** sofort das gesamte Audioinventar remastern oder eine neue globale Audio-Engine bauen.
