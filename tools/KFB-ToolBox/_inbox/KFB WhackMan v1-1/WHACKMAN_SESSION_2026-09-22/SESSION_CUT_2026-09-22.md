# Session-Cut · KFB WhackMan v1 · 2026-09-22

Hinweis zur Form: Der offizielle `cut-prompt-v1-2.md`-Template-Text war aus dieser Umgebung nicht
ladbar (kein Zugriff auf das referenzierte Skill-Repo-File). Struktur unten folgt dem in der
Skill-Beschreibung genannten 5-Sektionen-Muster nach bestem Wissen, ist aber eine Rekonstruktion,
kein Original-Template-Output. Sag Bescheid, falls das offizielle Format woanders liegt.

---

## 1 · Kontext & Ziel dieser Session

Fortsetzung aus einem vorherigen Chat (Fortsetzungs-Auftrag, referenziert
`github.com/georg-doc/kayfabizarro/tree/main/skills/chat`). Ausgangsliste aus dem 2026-09-21-
Stand (`returns/WHACKMAN_V1_2026-09-22/CHANGELOG.md`, Abschnitt "Für den nächsten Chat"):

1. Wand-Kollision (Spieler + Verfolger, Maze-Grid-basiert)
2. Dot-Pickup-Trefferfenster über die ganze Flugkurve
3. Zufällige Idle-Animationen entfernen
4. Echtes Kontakt-Feedback (Squash/Knockback statt Quadrat-Sprite)
5. Dämmerungslicht heller ziehen
6. Material-Pass Roughness/Metalness

Alle sechs Punkte wurden nacheinander abgearbeitet, jeweils mit Verifier-Runde. Im Verlauf kamen
weitere Aufträge dazu: Ton-Default, Minimap, generisches Kollisions-/Bounce-Modul, Kamera-
Freiblick mit Scroll-Zoom, Kekse-vs-Verfolger-Mechanik (zweimal nachgebessert), Impact-VFX.

## 2 · Postmortem

**Was gut lief:**
- Die Graph-basierte Bewegungsarchitektur (MazeMotor) hat sich als bereits solide erwiesen —
  "Wand-Kollision" war grösstenteils schon durch den Graphen gelöst; die eigentliche Arbeit lag
  in einer Sicherheitsklemme (`wm-collide.js`) für alles, was NICHT über den Motor läuft.
- Das generische Bounce-Modul (additive Versätze, nie die kanonische Position überschreibend)
  hat sich als richtiger Hebel erwiesen: derselbe Baustein trägt jetzt Spieler-Treffer,
  Verfolger-Verfolger-Trennung und (in seiner finalen Form) das Kekse-Hüpfen.
- Der Verifier hat in dieser Session mehrfach echte, nicht-triviale Bugs gefangen, die sonst
  unbemerkt geblieben wären (siehe unten) — das Muster "Fix → Verifier probiert echte Frames
  durch → Gegenbeweis" hat mehrfach getragen.

**Was schiefging (ehrlich, ohne Beschönigung):**
- **Drei Fehlversuche bei der Kekse-vs-Verfolger-Mechanik**, bevor die Lösung stand:
  1. Erster Versuch (Wegschieben + Feder) hatte einen unerreichten Zweig bei Distanz ≈ 0
     (Verfolger exakt auf der Keks-Position) — vom Verifier reproduziert und gefangen.
  2. Zweiter Versuch (Wegschieben, Randfall gefixt) hat funktional "gehalten", aber
     spielmechanisch nicht gepasst — Georgs Einwand: Wegschieben verzerrt das Spielfeld
     dauerhaft (Kekse landen woanders). Kompletter Richtungswechsel auf "Hoch-Hüpfen mit fixem
     Anker" nötig.
  3. Beim Hüpfen-Umbau selbst zwei weitere Bugs: der Stauch-Trigger beim Landen feuerte nie
     (Schwellwert-Schnappschuss VOR dem Frame, von einer gedämpften Feder immer schon
     unterschritten), und `hopV` fehlte in BEIDEN Init-Blöcken → NaN ab Frame 1. Beide vom
     Verifier gefangen, nicht von mir vorab gesehen.
  **Lesart:** Cartoon-Bounce-Physik (Feder, Schwellwerte, Nulldurchgänge) ist fehleranfälliger
  als sie aussieht — ein Schwellwert-Vergleich auf einen Snapshot-Wert VOR dem Integrationsschritt
  ist der wiederkehrende Fehlertyp hier, nicht Logikfehler in der Grundidee.
- **Ein Bug in der ersten Rotation-Feder** (`Bounce.rot`): Drehimpuls wurde integriert, aber nie
  zu 0 zurückgefedert — der Spieler blieb nach einem Treffer dauerhaft leicht verdreht stehen.
  Vom Verifier gemessen (Endwert nach 600 Frames), nicht von mir vorab erkannt.
- **Ein Missverständnis bei "Wand-Kollision" selbst:** Ich hatte zunächst (stillschweigend)
  angenommen, dass eine AABB-Klemme etwas Sichtbares reparieren würde, ohne vorab zu prüfen, ob
  überhaupt eine XZ-Drift-Quelle jenseits des Motors existierte (es gab zum Zeitpunkt des ersten
  Fixes keine — der Fix war zu diesem Zeitpunkt technisch korrekt, aber wirkungslos, bis später
  echte Drift-Quellen wie Bounce-Kicks dazukamen). Kein Fehler im Ergebnis, aber ein Punkt, den
  ich hätte transparenter benennen sollen, statt es als abgeschlossen zu präsentieren.
- **Ein für den User verwirrender Moment:** Die Kamera-Freiblick-Funktion wurde eine Nachricht
  vor der erneuten Anfrage schon gebaut, war aber offenbar nicht als "schon da" erkennbar — ich
  hätte das nach der Implementierung deutlicher als eigenständiges Feature herausstellen sollen
  (z. B. kurz beschreiben WIE man es benutzt: Ziehen im Verfolger-View), statt es nur in einem
  Nebensatz zwischen anderen Punkten zu erwähnen.

**Was ich nicht zuverlässig weiss:**
- Ob die Kekse-Hüpf-Mechanik bei einer GROSSEN Anzahl gleichzeitig überlappender Verfolger (alle
  drei auf einem Haufen) noch lesbar bleibt, wurde nicht getestet — nur Einzelkontakt.
- Ob die Bounce-Feder-Konstanten (k/damp-Werte) bei einer deutlich anderen Bildrate (sehr
  schwacher Rechner, gedrosselter Tab) noch stabil federn oder sichtbar überschwingen, ist nicht
  gemessen — nur bei normaler rAF-Taktung geprüft.

## 3 · Offene Fäden / Backlog

Volle Liste mit Reihenfolge-Vorschlag in `WHACKMAN_BACKLOG_2026-09-22.md` (im Export enthalten).
Kurzfassung:

1. Endloser Prozedural-Dungeon mit Fenster-Persistenz (Räume ändern sich hinter einer Tür) —
   eigener Design-Durchgang, MazeGraph ist aktuell komplett/statisch.
2. Breitere Gänge / Dungeon-Roguelike-Mix mit Freiraum.
3. Deko-Grounding — Bäume/Deko stecken nicht sauber im Boden (Gate B).
4. 3D-Platzierungs-Editor für Props (Position/Rotation/Bodenhöhe direkt setzen).
5. Wandkronen-Ansicht von oben: Figur auf der Innenwand visuell noch nicht saubere Darstellung.
6. Appear/Vanish-VFX für Spawn/Despawn — keine passenden Clips/Cues im Legacy-Bestand vorhanden.
7. Sounddesign/Mix — weiterhin Platzhalter-Niveau.
8. (Neu, aus dieser Session, bewusst NICHT gebaut) Der alte "Ballistik-Tritt fliegt weg und
   landet woanders"-Effekt war als Idee gut, passte aber nicht als Basismechanik — als
   optionaler Spezial-Effekt (z. B. bei einem Power-Pellet-Treffer, nicht bei jedem Keks) später
   nachrüstbar.

## 4 · Nächste Schritte

Empfehlung unverändert vom letzten Stand: 3 (Deko-Fix, klein) vor 1/2 (grosser Umbau) vor 4
(Editor). Punkt 6/7 (VFX/Sound) können jederzeit parallel laufen, sind unabhängig vom Rest.

## 5 · Fünf proaktive Ergänzungen (nicht besprochen, meine eigene Einschätzung)

1. **Bestleistung/Einstellungen persistieren.** `localStorage` für Highscore, Ton-An/Aus,
   Fog-of-War-Reglerstand. Aktuell geht bei jedem Reload alles verloren — kleiner Aufwand,
   grosser Effekt auf "fühlt sich wie ein echtes Spiel an".
2. **Billige Verfolger-Augen statt gesperrtem EyeRig.** Der EyeRig-Host ist laut Brief
   gesperrt (`LEGACY_PIN`/LegacyFaceHost offen) — ein Paar additive Glut-Sprites (dieselbe
   Textur-Technik wie Fackelglut/Impact-VFX) auf Kopfhöhe der Verfolger, die zum Spieler
   schauen, würde "lebendig" sehr billig erkaufen, ohne auf die Rig-Freigabe zu warten.
3. **Dynamische Schwierigkeitskurve statt fester Wellentabelle.** `WAVES`/Tempo sind aktuell
   fest verdrahtet. Ein sanfter Tempo-/Aggressions-Anstieg mit der Überlebenszeit (z. B. alle
   30s +3% Verfolgertempo, gedeckelt) gibt dem Spiel eine Kurve statt eines Plateaus, ohne die
   Wellenlogik selbst umzubauen.
4. **Räumlicher Sound.** Der WebAudio-Kontext existiert schon (`wm-audio.js`), spielt aber
   zentral ohne Panning ab. Ein `PannerNode` pro Quelle (Fackelknistern, Verfolger-Schritte)
   würde Richtung/Nähe hörbar machen — bei einer Verfolgerkamera mit Sichtverdeckung durch
   Wände (die es ja schon gibt) ist Ton-Ortung ein natürlicher zweiter Sinneskanal.
5. **Touch-/Mobile-Steuerung.** Das Spiel läuft in einem Browser-DC, ist aber reine
   Tastatursteuerung (WASD/Pfeile). Ein simples Drag-Pad oder Vier-Tasten-Overlay (nur
   sichtbar bei Touch-Geräten) würde die Reichweite deutlich erhöhen, ohne die Motor-Logik
   anzufassen — Intent kommt ja schon über `makeKeys()`, ein Touch-Layer müsste nur dieselben
   Flags setzen.

**Bonus, rein technisch (keiner der 5 Haupt-Punkte, aber erwähnenswert):** Bei 108+ Sammelplätzen
läuft die volle Feder-/Hop-/Rotationsrechnung jeden Frame für JEDES Stück, auch weit ausserhalb
der Kamera. Bei einem grösseren Grundriss (Punkt 1/2 im Backlog) würde sich ein einfacher
Distanz-Cutoff zum Spieler lohnen (grobe Ruhe-Pose für alles jenseits von z. B. 8 Modulen,
volle Physik nur in der Nähe) — aktuell unproblematisch, aber der erste Posten, der bei einem
grösseren Feld auffällt.

---

## Memory-Snapshot (separat)

- Projekt: KFB WhackMan v1 (Design-Component, Three.js, Pac-Man-artiges Spiel im KFB-Universum).
- Architektur: MazeGraph (`wm-maze.js`) als einzige Bewegungswahrheit; `wm-motor.js` bewegt
  Spieler/Verfolger ausschliesslich über legale Kanten; `wm-collide.js` (neu, diese Session)
  liefert AABB-Wandklemme + generisches `Bounce`/`pushApart`-Federmodul, additiv über der
  kanonischen Position (Prinzip aus `kfb-cartoon-animation_v2.md` §8.3).
- Wiederkehrender Fehlertyp in dieser Session: Feder-/Schwellwert-Logik, die auf einem
  Snapshot-Wert VOR dem Integrationsschritt prüft, statt auf den Nulldurchgang selbst — zweimal
  aufgetreten (Stauch-Trigger, indirekt auch die Rotation-Feder). Beim nächsten Cartoon-Bounce-
  Baustein direkt darauf achten.
- Georgs Präferenz, beobachtet: Wegschieben/Verschieben von Spielfeld-Objekten wird abgelehnt,
  sobald es den Feld-Zustand dauerhaft verändert — Ausweich-Mechaniken sollen den Anker
  respektieren (hüpfen/heben statt versetzen). Vermutlich generalisierbar auf andere KFB-Spiele.
