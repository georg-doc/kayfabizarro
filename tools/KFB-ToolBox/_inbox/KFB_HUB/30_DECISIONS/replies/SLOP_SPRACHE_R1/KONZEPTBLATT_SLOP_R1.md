# Slop-Heads · Ton und Bild · Konzeptblatt R1 (WS-Flight, 04.11.2026)

**Leitbild:** Slop ist Tinte auf Papier. Der Ton sind Blasen in zäher Tinte, das Bild ist bedrucktes Papier. Stimme, Treffer und Tod kommen aus diesen beiden Modellen, nicht aus Einzel-Effekten.

## Stimme (Melodie-Sprache, eine neue Stimmfamilie)
- **Satzmelodie** aus der abgenommenen Probe r10, unverändert:
  - ein Ton je Wort, Inhaltswörter betont;
  - Frage steigt, Punkt fällt;
  - auf die Welt-Tonart gerastert, in der Probe Comic = mixolydisch auf D.
  - Bedeutung steht nur in der Blase. Keine Silben, keine Sprache.
- **Klangfarbe Blase** (Minnaert, van den Doel):
  - ein abklingender Sinus mit leicht steigendem Chirp; je größer die Blase, desto tiefer der Ton.
  - Jeder Ton ist eine kurze Blasenkette, darunter liegt ein leiser Kern auf derselben Höhe. Der Kern trägt Melodie und Harmonie.
  - Klang dumpf, unter 1,5 kHz.
- **Mob:** Bass (D2), Mitte (A2) und Oben (D3) singen reihum je einen Satzteil.
  - Der Vorredner hält kurz eine Terz oder Sexte unter dem Einsatz des nächsten.
  - Am Schluss klingt ein Dreiklang, Oben läuft eine Kaskade abwärts. So entsteht eine Gesamtmelodie.
- **Aufregung** (Gefühls-Schicht, gleiche Stimme):
  - eine Quarte bis Quinte höher, 1,35- bis 1,5-mal schneller, 1,7- bis 2-mal dichter;
  - Tonleiter-Lauf aufwärts am Satzanfang, Einsätze überlappen;
  - am Ende sprechen zwei Stimmen zusammen.
- **Tod:** Glissando etwa eine Oktave und mehr abwärts. Die Blasen werden langsamer, größer und leiser. Danach folgen ein letzter großer Gluckser und ein Sickern.
- **Mischung:**
  - Die Slop-Stimmen bleiben im Frequenzfenster 50–1500 Hz, die Kampf-Sounds liegen darüber.
  - Unter jedem Treffer und jeder Explosion wird die Stimme um 10 dB abgesenkt, für 0,25 s plus 0,35 s Rücklauf.

## Treffer-Codes
| Ziel | Klang | Bild-Akzent |
|---|---|---|
| Gebäude (Pappe/Knete) | hohler Pappe-Wumms mit Knistern (ElevenLabs T1) plus tiefer Puls | vorhandene Pappe-Trümmer und Staub der Waffe |
| Slop ungepanzert | nasser Klatsch (T2) plus Blasenbüschel aus dem Stimm-Modell | Tintenspritzer (Tropfen-Kern, vorhandener Treffer) |
| Slop gepanzert | Blech-Klonk (412/1093/1861 Hz) plus kleiner Klatsch 40 ms später | kleiner Spritzer; Klonk-Funke als Bild noch offen |

## Auflösen: ein Effekt aus einem Schnittmuster
1. **Treffer:** kleiner Puff aus der Waffen-Explosion (Größe „puff“). Er bleibt klein und kompakt (Etherington #783).
2. **Zerreißen:**
   - Das Bild des Blobs wird entlang dreier Geraden (Risse) und dreier Kreise zerschnitten: ein Einschlag und zwei kleine Bisse am Rand.
   - Jede Fläche zwischen den Schnitten ist ein Schnipsel mit gerader und gebogener Kante, also eine D-Form im Großen und im Kleinen.
   - Vorn trägt er den Druck, hinten ist er Papier mit durchscheinendem Druck, an der Schnittkante liegt ein heller Papierrand.
3. **Wegfliegen** (Etherington #27/#28): Die winzigen Schnipsel lösen sich zuerst und fliegen weit, die mittleren fächern in Schussrichtung auf, die großen brechen nur ab und fallen schwer.
4. **Flattern:** Die Schnipsel pendeln, kippen und erreichen ein Endtempo. Beim Sinken legt sich das Papier flach.
5. **Liegen:** Die Schnipsel liegen 30 s flach, mit Papier- oder Druckseite nach oben, dann sinken sie ein.
6. **Tinte aus denselben Schnitten:** Tropfen fallen an den Risskanten (kfbTropfen). Der Rest sickert als Pfütze in den Boden (inkPatch).

**Ein Effekt oder mehrere zusammengesteckte?** Ein Effekt:
- Schnipsel, Tropfen und Pfütze entstehen aus demselben Schnittmuster und haben denselben Zeitnullpunkt.
- Der Puff ist die vorhandene Waffen-Explosion, nur verkleinert, keine neue Schicht.
- Es gibt keinen eigenen Rauch, keine Funken und keine Überblendung.

## Zusammenspiel auf der Zeitachse
| Zeit | Bild | Ton |
|---|---|---|
| 0 ms | Treffer, Puff | Klatsch plus Blasenbüschel, Stimmen werden abgesenkt |
| +50 ms | Bild zerreißt in D-Schnipsel | Papier reißt und flattert (T4) |
| +80 ms bis ca. 2 s | Schnipsel sinken flatternd | Tod-Glissando: die Tonhöhe fällt mit dem Papier |
| ca. 2 s | Schnipsel landen, Pfütze sickert | letzter Gluckser, leises Sickern |
| +0,7 s | Überlebende hüpfen weiter | Aufregung: höher, schneller, Zusammensprechen |

## Offen und Schwächen
- Nichts davon ist im Spiel. Der Zerfall hängt hinter dem Schalter `slopzerfall=1`, die Stimme gibt es nur als Probe.
- Den Ton habe ich nicht gehört, das kann ich nicht. Geprüft sind Spektrum, Pegel und Ablauf. Ob es blubbrig-dumpf und angenehm klingt, entscheidet Georgs Ohr.
- Die Papier-Rückseite wirkt noch eher flach beige. Auf der dunklen Pfütze haben die liegenden Schnipsel wenig Kontrast.
- Von der Seite ist der Blob nur ein Strich, weil das Bild zur Spielkamera zeigt.
- Die Farbe des Puffs kommt aus der Waffe.
