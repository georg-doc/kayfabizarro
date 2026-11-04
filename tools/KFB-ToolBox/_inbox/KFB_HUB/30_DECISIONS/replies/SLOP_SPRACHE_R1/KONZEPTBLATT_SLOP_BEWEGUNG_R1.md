# Slop-Bewegung · 2D-Animations-Bibliothek · Konzeptblatt R1 (WS-Flight, 04.11.2026)

**Ziel:** eine Bewegungs-Grammatik für Slop-Units und künftig alle 2D-Figuren. Grundlage ist der Skill cartoon-motion nach Preston Blair: Anticipation, Aktion, Follow-through und Recovery, sauber getimt; Squash und Stretch mit Volumenerhalt, nie mehr als ±16 % verzerrt.

## Eine Quelle für Bild, Ton und Spiel
- `60_VIDEO/remotion/src/slop-anim/slopKurven.ts` ist die Kurven-Datei (wie `kurven4.ts` beim Holo-Bau). Sie ist rein, ohne React und ohne Remotion:
  - benannte Clips, je mit Bildanzahl, Schleife ja/nein und **Zeitmarken**;
  - `pose(name, f)` liefert x, y, sx, sy und Drehung;
  - `todTeile(f)` liefert die Stücke beim Zerreißen.
- Remotion zeichnet den Clip daraus (`Slop-Bewegung`). Das Ton-Skript liest dieselben Marken (`scripts/slop-bewegung-ton.mjs`), und das Spiel kann die Datei 1:1 übernehmen: Node lädt sie direkt.
- Gemessen: Die Einsätze von Treffer, Schrei, Landen und Tod-Treffer liegen höchstens 5 ms neben ihrer Marke.

## Die Clips
| Clip | Bilder | Ablauf | Ton an den Marken |
|---|---|---|---|
| Ruhe | 90, Schleife | Atmen, kaum sichtbares Heben | leiser Blub je Atemzug |
| Plaudern | 66 | je Silbe ein kleiner Wipp, Neigen im Wechsel | eine Blasen-Silbe je Marke (Satzmelodie) |
| Hüpfen | 26 | ducken → Stretch beim Absprung → Bogen → Squash beim Landen → Feder | Blup aufwärts, Plopp beim Landen |
| Schreck | 40 | Luft holen (ducken, zurücklehnen) → Schrei (hoch, gestreckt) → landen → nachzittern → erholen | Einatmen, Schrei-Glissando höher blubbernd (höchstens D4), Plopp, Zittern mit 9 Hz wie im Bild, Seufzer |
| Panik | 60, Schleife | schnelle Hopser im Zickzack | kurze aufgeregte Zwei-Ton-Rufe |
| Treffer | 18 | weggeschoben und quer gestaucht, Feder zurück | nasser Klatsch und tiefes „Uff“ |
| Tod | 170 | Riss läuft als Reißverschluss (7 Bilder) → Hälften ziehen sich aufrecht auseinander (9 Bilder) → Fall wie Blätter, das Stück dreht durch und zeigt die Papierseite → liegen, Tinte sickert ein → Verblassen in Flecken, das Gesichtsstück zuletzt | Klatsch, Papier reißt, die Stimme zerläuft im Fallen, Gluckser auf der Landung, Sickern |

## Warum der Tod jetzt als Papier liest
Im Spiel (R1–R5) dauerte das Reißen null Bilder, der Kritiker sah nur eine Platte, die umkippt. Jetzt hat der Riss eigene Bilder:
- Die helle Linie läuft sichtbar los.
- Die Hälften stehen kurz getrennt.
- Erst danach fallen sie.

Ein Effekt: Alles entsteht aus einem Schnitt und einem Zeitnullpunkt, ohne Rauch und ohne Funken.

## Übernahme ins Spiel (erst nach Georgs Ja)
- `slopKurven.ts` übernehmen und die Clips mit `mobs2d` verbinden:
  - Hüpfen ersetzt die Hop-Kurve;
  - Schreck bei einem Treffer in der Gruppe, danach Panik;
  - Treffer bei einem nicht tödlichen Treffer;
  - Tod ersetzt den Zerfall-Ablauf in `slopZerfall.js`; dort bleiben die Schnitte und das Papier-Material.
- Der Ton läuft über `slopVoice.js`; `schreck()` ist schon dort.
- C (notiert): Slop-Familien als Chatterbox-Profile registrieren (Stimme, Sprache, Alltag als fraktales Gegenstück zum NPC-Alltag), je Familie ein Profil.
