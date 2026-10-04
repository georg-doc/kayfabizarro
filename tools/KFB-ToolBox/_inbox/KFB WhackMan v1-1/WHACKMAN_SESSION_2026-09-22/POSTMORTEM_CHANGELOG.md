# KFB WhackMan v1 · Changelog 2026-09-22 (Check-in)

Fortsetzung der offenen Punkte aus dem 2026-09-21-Stand. Alle Punkte unten sind in diesem
Snapshot enthalten und im laufenden Chat einzeln verifiziert (Konsole clean je Schritt).

## Erledigt in dieser Session

1. **Ton** — Default aus (`wm-audio.js` + `wm-boot.js`; die Boot-UI hatte den Audio-Default
   überschrieben, das war der eigentliche Bug).
2. **Wand-Kollision** — `wm-collide.js` (neu): AABB auf Zelle + legale Nachbarn, als
   Sicherheitsklemme über der schon graphgebundenen Bewegung. Für Spieler und Verfolger.
3. **Dot-Trefferfenster** — galt technisch schon über die ganze Flugkurve (reiner XZ-Test);
   jetzt explizit dokumentiert plus grösserer Fangradius für fliegende Stücke.
4. **Zufällige Idle-Animationen** — abgeschaltet (`wm-lull.js`); nur noch stille Idle-Pose.
5. **Kontakt-Feedback** — echtes generisches Bounce-/Federmodul (`wm-collide.js`: `Bounce`,
   `pushApart`), additiv über die kanonische Position (kfb-cartoon-animation_v2 §8.3):
   - Spieler-Treffer: Wirbel hoch (Y-Impuls + Spin), Fall, Landestauchung, Rückkehr in
     Standpose — kein Teleport zum Spawn mehr, nur ein Leben weg, 1,1s Unverwundbarkeit danach.
   - Verfolger-Verfolger: weiche Trennung jeden Frame (auch im Pferch).
   - Verfolger-Sammelgut: harte Nicht-Durchdringung + Feder-Rückkehr statt Ballistik-Tritt —
     kein "Fressen" mehr, keine Kaskade aus scheinbar auftauchenden/verschwindenden Keksen.
     Grosse Belohnungen (Special/Story) sind von dieser Verdrängung ausgenommen.
6. **Fog of War** — Punktlicht folgt dem Spieler, hellt nur seine Umgebung auf. Default aus
   (reguläre Dämmerung unverändert), stufenloser Regler im Werkzeuge-Panel.
7. **Minimap** — 2D-Canvas aus dem MazeGraph oben rechts (Referenz: butchler/Pacman-3D
   `renderHud`, hier ohne zweiten WebGL-Pass). Werkzeuge-Icon sitzt jetzt neben dem Titel.
8. **Freier Blick in der Verfolgerkamera** — Ziehen dreht/hebt den Blick frei um den Akteur;
   sobald er sich bewegt, federt der Blick selbst zurück in die normale Rahmung.
9. **Impact-VFX** — runde, additive Glanzpunkte (Radial-Gradient-Textur) statt harter
   PointsMaterial-Quadrate, schrumpfen zusätzlich zum Ausfaden.
10. **Kekse vs. Verfolger, zweiter Durchgang** — Wegschieben (erster Fix) hat das Spielfeld
    verzerrt (Stücke landeten dauerhaft anderswo); jetzt bleibt der Anker (baseX/baseZ) fix,
    der Keks hüpft über den Kopf des Verfolgers, dreht sich dabei (Spin-Impuls, klingt ab),
    und titscht beim Landen sichtbar auf (Stauchungs-Impuls + kleiner Rücksprung unter 0,
    geklemmt) statt gerade einzurasten. Zwei Nachbesserungen dabei fing der Verifier ab: der
    Stauch-Trigger feuerte ursprünglich nie (Schwellwert-Schnappschuss VOR dem Frame, nie
    erfüllt), und `hopV` fehlte in der Initialisierung (NaN von Frame 1).
11. **Scroll/Touch-Zoom mit Cursor-Fokus** — auf der Verfolgerkamera, zoomt zu der Stelle hin,
    auf die der Zeiger zeigt, nicht stur zur Bildmitte.
10. **Material-Pass** (Roughness/Metalness, matt) — bereits vor dieser Session in `wm-boot.js`
    (`mattieren()`) vorhanden und aktiv; hier nur bestätigt, nicht neu gebaut.

## Referenzen gelesen (nicht kopiert, nur gelesen für Entscheidungen)
- `georg-doc/kayfabizarro` · `media/3D_Assets/Audio/sfx.json` — kein appear/vanish-Cue verfügbar.
- `georg-doc/kayfabizarro` · `skills/kfb-cartoon-animation_v2.md` — Choreografie-Modell für das
  Bounce-Modul (Ursache→Anticipation→Aktion→Impact→Follow-through→Recovery, additive Offsets).
- `butchler/Pacman-3D@gh-pages` · `game.js` — Vergleich Geisterlogik (unser System ist weiter),
  Minimap-Technik übernommen (`renderHud`).

## Bekannte offene Punkte (nicht in diesem Stand behoben)
Siehe `WHACKMAN_BACKLOG_2026-09-22.md` für Details und Reihenfolge-Vorschlag:
1. Endloser Prozedural-Dungeon mit Fenster-Persistenz (Räume ändern sich hinter einer Tür) —
   eigener Design-Durchgang, MazeGraph ist aktuell komplett/statisch.
2. Breitere Gänge / Dungeon-Roguelike-Mix mit Freiraum.
3. Deko-Grounding — Bäume/Deko stecken nicht sauber im Boden (Sichtprüfung + Fix in Gate B).
4. 3D-Platzierungs-Editor für Props (Position/Rotation/Bodenhöhe direkt setzen).
5. Wandkronen-Ansicht von oben: Figur auf der Innenwand ist visuell noch nicht saubere
   Darstellung (kein Blocker, nur Nachschärfen).
6. Appear/Vanish-VFX für Spawn/Despawn — keine passenden Clips/Cues im Legacy-Bestand; müsste
   aus Darstellung (Scale + Glut-Sprite-Technik) + einem nachgezogenen Kenney-Whoosh gebaut
   werden, nicht aus vorhandenen Assets.
7. Sounddesign/Mix — weiterhin Platzhalter-Niveau.

## Für den nächsten Chat / Übergabe
- Dieser Snapshot ist der Übergabestand für den WSA-Lead-Chat (KFB-Travel-Globe /
  `_handover/WORLD_BUILDER_GOD_MODE_2026-09-17/`). Kollisions-/Bounce-Grundlage
  (`wm-collide.js`) ist generisch genug, um auch für Welt-Objekte jenseits von WhackMan
  wiederverwendet zu werden, falls das dort relevant wird.
- Reihenfolge-Vorschlag für die offenen Punkte: 1 (Kern-Ask abgearbeitet in dieser Session),
  jetzt 3 (Deko-Fix, klein) vor 1/2 (grosser Umbau) vor 4 (Editor).
