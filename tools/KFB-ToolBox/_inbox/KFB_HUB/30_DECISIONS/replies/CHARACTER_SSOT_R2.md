# Charakter-SSOT R2 · eine Datei je Figur für Spiel, Werkstatt und Dramatis Personae (WS0, 11.11.2026)

Georg 11.11.: „für jeden Character, NPC, Slop etc. eine SSOT/JSON zentral verwalten, abrufen und editierbar fürs Game nutzen können – ebenso wie neue Frankensteinings, künftig auch 2D-Characters mit KFB-Eye-Rig, Augenbrauen, unseren 6+ Mündern.“ Baut auf V-391 (Figurenkarte), V-394 (kfb.character/1), V-682 (Register als einzige Quelle), V-1105/V-1106 (Werkstatt und Speicherweg) auf.

## Grundsatz

- **Bearbeitet wird nur in der bestehenden Figuren-Werkstatt** (https://kfb-toolbox.frizzlebob.chatgpt.site/). Kein neues Werkzeug, keine neue Oberfläche (Georg 11.11., V-390). Fehlende Felder kommen dort als Tab bzw. Regler dazu.

- **Eine Datei je Figur:** `data/characters/<id>.character.json` im Spiel-Repo (KFB-Stunt-Car-Race), Schema `kfb.character/2`.
- **Wer schreibt:**
  - die Figuren-Werkstatt, über einen Vorschlags-Zweig auf GitHub (V-1106);
  - Georgs Web-Chat-Diktat (V-416);
  - WS0 bei Migration und Technik.
- **Wer liest:**
  - das Spiel (fester Commit beim Bau);
  - die Dramatis Personae;
  - der Hub (Register-Ansicht);
  - Triplet- und Chatterbox-Werkzeuge.
- **Keine Parallel-Listen mehr.** cast, voice_casting, Slop-Roster, Pets-Export und Figurenkarten werden einmal hierher migriert und danach nur noch aus dieser Datei erzeugt.
- **Jedes Feld trägt `{v, src, status}`** (wie V-394). Status `GEORG` heißt: nur Georg ändert es. Was die Werkstatt nicht kennt, fällt nicht still weg.

## Arten (`kind`)

hero · kit_character · custom_rig · frankenstein · prop_character · pet · cube_pet · slop · npc · locus · vehicle · figure2d

## Abschnitte

| Abschnitt | Inhalt |
|---|---|
| `identity` | Name, Aliase, Art, Fraktion, Status |
| `story` | Backstory, Herkunft, Rolle in der Welt (Slops: Karriere, Bewohner und Zensur nach V-1483) |
| `personality` | Archetyp, Eigenheiten, Werte, Ängste |
| `dialogue` | Sprechweise, Stimme (Voice-Spec), Chatterbox-Instrument, Triplet-Referenzen (TRIPLET_SSOT), Lieblingssprüche |
| `cards` | Deck-Zuordnungen, Karten-IDs, Tipps (nur aus Druckbild oder Kartentext, V-1262) |
| `preferences` | Lieblingswaffen, Lieblingsbiom, Dioramen, Fahrzeug |
| `memory` | Beziehungen, Gedächtnis-Regeln |
| `appearance` | siehe unten (bisher Figurenkarte kfb.figure/1) |
| `performance` | Clips, Idle-Pool, Gesichts-Choreografien (Blick, Lid, Braue), Emotes |
| `game` | spielbar, Größe, Kampfprofil; Slops: Absurditätsstufe, Gegnerstufe, Fenster; Begegnungsregeln |

### `appearance` (Werkstatt-Felder, ein Format für 3D und 2D)

- `body`: Asset (GLB, Spritesheet für 2D), Rig (Rig_Medium/Large/eigen/2D), Maßstab.
- `eyes`: KFB-Eye-Rig (Version, Sockel, Größe, Abstand, Iris und Pupille, Farbe).
- `lids`:
  - Oberlid- und Unterlid-Grundstellung;
  - Farbe;
  - E2-Haut.
- `brows`:
  - Form und Teil-ID;
  - Farbe;
  - Lage.
- `mouth`:
  - Mundsatz aus den 6+ KFB-Mündern bzw. Originalmund;
  - Ruhezustand;
  - Viseme-Zuordnung.
- `nose`:
  - Teil-ID (Frankenstein-Studio);
  - Farbe;
  - Lage.
- `ears`: Rig, Kanon-Teile (z. B. FB linkes Ohr aus A11), Federwerte.
- `colors`: Materialzonen mit Farbwähler-Werten, z. B. Fell, Bauch.
- `addons`: Schwanz, Shirt, Rucksack, Kleidung, mit Schalter je Teil.
- `originals`: keep bzw. remove (V-391).

## Spiel

- **Ein Lader** `src/data/characters/characterSource.js` liest die Dateien; `stageCast`, `faceMountActor` und `fbLeben` holen ihre Werte nur noch daraus.
- **Konstanten im Code** wie `lidU`, Ohrfedern oder Schwanz-Schalter wandern in die Datei. Der Code behält nur Standardwerte, falls ein Feld fehlt.
- **Der FB-Kanon-Wächter** (`test/lib/fbKanon.mjs`) prüft gegen die Datei. Unit-Test: Schema-Prüfung aller Dateien, Pflichtfelder je Art.

## Reihenfolge

1. FrizzleBob: Werkstatt-Export 14.10., Rezept v5b, Kanon-Ohr, Lider (weit offen, q592), Schwanz, Shirt, Brauen- und Nasenfarbe in einer Datei; das Spiel liest daraus. (WS0)
2. Migration der 132 Register-Figuren, Figurenkarten und Slop-Roster in `kfb.character/2`, erzeugt per Skript aus den bisherigen Quellen, mit Lückenliste. (WS0) **Erledigt 11.11. für die 131 Register-Figuren** (`scripts/characters/build_characters_r2.py`, `index.r2.json`, Lückenliste `replies/CHARACTER_SSOT_R2_LUECKEN.md`, V-1623). Slop-Roster folgt; er trägt seine Karten schon im Feldformat.
3. Dramatis Personae und Hub lesen die neue Quelle. (WSA work)
4. Werkstatt schreibt Aussehen und Text über den Vorschlags-Zweig (Kern WSA PR #416). Probelauf: Georg ändert eine Farbe und sieht sie im nächsten Spielstand. (WSA work und WS0)
5. Lücken im Inhalt füllt Georg per Diktat, nach Wichtigkeit: Helden, Slops, KayKit. Inhalte werden nicht erfunden.
6. 2D-Figuren und neue Frankensteinings nutzen dasselbe `appearance`-Format; das 2D-Rig bekommt Eye-Rig, Brauen und Münder als Ebenen.
