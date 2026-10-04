# Pet Studio (FrankenStein Studio v18) → KFB ToolBox · vollständiges Feature-Mapping
*26.09.2026 abends · Referenz: `tools/KFB-ToolBox/stage-first/src/KFB FrankenStein Studio v18.dc.html` (V2CFG, V2CFG_BIPED, V2MERGE, V2MESS, V2BOTTOM, Kopf/File-Menü) gegen `KFB ToolBox Production-02.dc.html` (Stand dieser Session).*
*Löst `handover/PARITY_STUDIO_V18_TOOLBOX.md` als Arbeitsliste ab; dieses Dokument bleibt die Detailtabelle für das Gesicht.*

**Status:** **HAVE** = gleichwertig bedienbar · **PLUS** = in der ToolBox besser als in v18 · **SCHWUND** = als Schwundform da (weniger Felder, kein Speichern, nur Test) · **MISSING** = Eigentümer existiert, keine Bedienung · **OUT** = auch in v18 nur Platzhalter · **V18+** = v18 macht es besser, wir sollten nachziehen.

## 0 · Shell und Rahmen
| v18 | ToolBox Production-02 | Status |
|---|---|---|
| 5 Reiter: Body · Face · Motion · Voice · Messen | Studio · Animation Studio · Rigging (+ »…« Quellen/Selbsttest) | anders geschnitten, siehe §7 |
| **Untere Leiste »ohne Klick da«** (V2BOTTOM): Emotes · Viseme · Anim in jedem Reiter, Face zusätzlich Viseme | **seit heute Abend:** Emotes · Viseme (+ Talk · Grin · Pout · Rest) · Anim (Idle · Walk · Run · Jump · Eat · Dance · Pos · Neg) in Studio und Rigging; im Animation Studio stehen Emotes und Viseme oben im Dock | **HAVE** (Anim bei Bipeds: Rollen-Zuordnung, sonst Namensabgleich) |
| Leere Gruppen werden nicht gezeigt, Brauen-Presets springen ein, wenn `lib.emotes` leer ist | Gruppe nur mit Eigentümer (Emotes nur mit Face-API, Viseme nur mit Mund) · Emotes aus `contract.eyeRig.emotes` + Fallback | **HAVE** |
| Figurenwahl im Kopf (Initiale + Menü) | Actor ▾ mit Suche und Roster-Gruppen | **PLUS** |
| File-Menü: Export dieses Pet · Auswahl · ganzer Satz · Laden | Rigging › Import · Export (eine Figur) · Save = Workspace | **SCHWUND** (Auswahl/Satz fehlen) |
| Schalter »Erklärtexte« (lange Notizen nur auf Wunsch) · Filter > 90 Zeichen | alle Notizen immer sichtbar | **V18+** |
| Abschnitte aufklappbar, offen als Vorgabe, Kopf klebt oben (sticky) | flache Liste je Reiter/Teil | **V18+** (bei langen Teilen wie Eyes/Mouth) |
| Thema Paper/Dark | nur Paper | MISSING (niedrig) |
| schmal (832 px): Kopfzeile schrumpft | ≤ 900/1000/1120-px-Stufen, Inspektor ein/aus | **PLUS** |
| 3D-Bearbeitung: Pet-Drag/Gizmo lokal pro Reiter | EIN Edit-Layer (`lib/edit-layer.js`): Klick-Auswahl, schwebendes Objektmenü Move/Rotate/Scale/−/+/Drop/Scope/**Snap/Reset (neu)**/✕, Tasten G/R/S/F/Esc | **PLUS** · die alte untere Werkzeugleiste ist entfernt (redundant) |

## 1 · Body (v18 `koerper` + `pad` + `V2CFG_BIPED`)
| v18 Abschnitt | Felder | ToolBox | Status |
|---|---|---|---|
| Material (Cube Pet) | Style Kenney/Clay/Cel · Texture scale · Tint · Relief · AO · Roughness | — | MISSING |
| Surface (Pet) | Textur-Gruppen (Clay, Fabric, Holz, Papier, Stein, Fell) · Mods (Fingerprint, Kaffee, Tinte, Kratzer, Tape) · 9 Regler | — | MISSING |
| Light | Mood Day/Dusk/Night/Under · Azimut · Höhe · Rim | Stage-Presets + WorldBuilder-Himmel/-Licht; Sonne fest | **SCHWUND** |
| Color | 6 Swatches · Native Kenney · Facets | Face-Basisfarbe (Lid/Kopf) | **SCHWUND** |
| Body contract · Würfel | gemessene Kennzahlen | Studio › Body »Fakten« | **SCHWUND** |
| Ground plane (Pet-Vertrag) + Boden der Zone | Schatten · Kachel · Kontakt-AO | Bühnenboden + Schatten-Rezept (LESSONS_SHADOWS) | **SCHWUND** |
| Pad: Anker · Base · Audio · Roll | Gear-Anker, Base-AO/Ink, 4 Klang-Ereignisse, Klo-Rolli | — | MISSING (Rolli nicht im Roster) |
| Biped · Variante · Waffe | plain/gun, Palette, Maße | Legacy Builder (Warband) · Held item | **SCHWUND** |
| Material zones (v16) | Atlas-Farbfelder je Zone | läuft in der Graft-Kette, keine Bedienung | MISSING |
| Head zones (v16) | Gesicht/Kopf frei färben + Augapfel/Pupille/Lid/Nase/Braue/Bart | Augapfel, Pupille, Lid, Brauen-Tinte, Nase, Bart | **SCHWUND** (Kopfton fehlt) |
| GothGirl zones (v18) | 12 Kopfinseln + 5 Netze | — | OUT (nicht im Roster) |
| Card Rider (v16) | Travel-Abgabe | Studio › Fit (CARD_SURF-Naht) | **HAVE** |
| Waffe · Handbetrieb (v16) | | Legacy Held item fit | **SCHWUND** |
| Seat · Sitzpose (v13) | Presets, Winkel, Arme per IK | Studio › Pose + IK-Punkte auf der Bühne | **PLUS** |
| — | — | **Rigging › Body (neu): Dicke Torso/Arme/Beine · Bein-/Torso-Länge · Höhe · Presets** | **PLUS** |

## 2 · Face (v18 `gesicht` + `actor`) → Rigging
Das Gesicht ist vollständig bis auf die Zeilen unten. Details stehen in `PARITY_STUDIO_V18_TOOLBOX.md`.
| v18 | ToolBox | Status |
|---|---|---|
| Eyes (alle Regler, Oval, Wimpern, Blink, inset, splay, converge) | alles + Splay −1…2 + Lid fit + Head-zone-Farben | **PLUS** |
| Emotes · Blick folgt Cursor | Chips + Bottom-Bar + gleichnamige Brauen-Vorlage + Ruhe-Mund | **PLUS** |
| Emote-Werte editieren (Lid oben/unten/Slant/Pupille je Emote, gespeichert) | Emotes setzen die Lid-Regler, eigene Emote-Werte speichern: nein | **V18+** |
| Asymmetry · Life · Kinetics | Δ links · Life gespeichert · Kinetik als Test | **HAVE** (Kinetik bewusst nicht gespeichert, wie v18) |
| »Skeptisch«-Knopf (Asymmetrie-Preset) | — | MISSING (klein) |
| Original parts ↔ Overlay | Source je Teil + partrig + Lean/Turn/XYZ | **PLUS** |
| Brows (alle Regler) | + Drehen, Neigen, XYZ, **Brauen-Leben** (Schweben, Blick, Reaktionen) | **PLUS** |
| Nose · Moustache | alle Regler | **HAVE** |
| Carls gegraftete Braue/Nase am Driver (`brow.graft.*`, `nose.graft.*`) | Source »Carl's own« schaltbar, keine Platzierungsfelder | **SCHWUND** |
| Mouth · Visemes · Ruhe-Mund | alles + Yaw, Knick-Bremse, Lip-sync 13 Decals | **PLUS** |
| Lider | Schalen + Clay/Thin mit Auto-Fit, Glide/Fold | **PLUS** |
| Ohren | Rigging › Ears (Dangle, Kräfte, Pose, Basis-Knochen) | **PLUS** |

## 3 · Motion (v18 `motion` + `anim`) → Animation Studio
| v18 | ToolBox | Status |
|---|---|---|
| Clips · Aktion (8 Trigger) | Bottom-Bar Anim + Clip-Popover mit Suche | **HAVE** |
| Own clips · biped (FrizzleBob 19) | own + stock + Motion Library 33 | **PLUS** |
| Abspielen · Schleife · Tempo | Play/Frame/Scrub/Loop/Speed + Fußkontakt-Bänder | **PLUS** |
| Zuordnung · 24 Spielzustände | Rollen + 14 gemessene Locomotion-Rollen · Lab › State | **SCHWUND** (24 → Rollenliste, keine vollständige 24er-Tabelle) |
| Sitzprobe · Badewanne · Fahr-Acting | Studio › Fit (Surf/Armchair/Cockpit/Bath) | **SCHWUND** |
| Zählwerk · echte Clipnamen | Quellen-Panel zählt Clips je Quelle | **SCHWUND** |
| Dateien · Inventar-/Zuordnungs-Export | Motion-Profil im Workspace, kein Datei-Export | MISSING |
| Driver contract §2b (Puppet: setExpression · playState · speak) | — | MISSING |
| Motion tuning | — | OUT (auch v18 Platzhalter) |

## 4 · Voice (v18 `voice` + `bubbles`)
| v18 | ToolBox | Status |
|---|---|---|
| Shaper · Tail · Shape bank · Tipp-Punkte | — | MISSING (Georg: Rework mit/ohne KFB-Outline = eigener Design-Slice) |
| Voice-Quelle | — | OUT |

## 5 · Messen (v18)
| v18 | ToolBox | Status |
|---|---|---|
| Body contract · Ground contract · Driver contract · Pad anchors · Clip audit · Export | »…«-Panel: Quellen, Pins, Selbsttest, Ear-Messung, Band-Messung, Solver-Gate | **SCHWUND** |

## 6 · Roster
| v18 | ToolBox | Status |
|---|---|---|
| Cube 24 · Graft (Driver) · Carl · Klo-Rolli · Recherchi | Cube 24 · Driver Graft · FB Ear Rig v5 · Orc Brute · Warband · Resident Scene | Carl / Rolli / Recherchi **MISSING** |

## 7 · Was ist anders, und was ist besser?
- **v18 ist besser** bei (1) aufklappbaren Abschnitten mit klebendem Kopf, (2) dem Schalter »Erklärtexte« gegen Prosa-Wände, (3) gespeicherten Emote-Werten je Ausdruck, (4) dem Material/Surface-Baukasten für Cube Pets, (5) dem Datei-Export ganzer Sätze. Diese fünf Punkte stehen oben im Sprintplan.
- **Die ToolBox ist besser** bei: einer Laufzeit für alle Reiter (kein Neubau beim Wechseln), einem Edit-Layer statt Drag je Reiter, dem Rigging als eigenem Reiter mit Feld-API (`face-mount.v1`), IK auf der Bühne, der Motion Library mit Fußkontakten, dem Schatten-Rezept, Body-Shape, Ear-Dangle und Brauen-Leben.
- **Bewusst anders:** Kinetik bleibt ein Testeingang und wird nicht gespeichert (wie v18). Die Blasen werden neu gestaltet statt 1:1 übernommen.
- **Animation Lab v1:** diese Datei liegt weder im Repo (`main` @689bc755, Suche ohne Treffer) noch im Projekt. Vorhanden sind nur v2 (Standalone) und v3. Der Reiter heißt ab jetzt **Animation Studio**. Die Übernahme der v1-Ansicht ist **SOURCE_REQUIRED**: bitte v1 hochladen oder den Pfad nennen.

## 8 · Sprintplan (jeder Sprint ein Slice mit eigenem Selbsttest und Screenshot-Gate)
| # | Sprint | Inhalt | Gate |
|---|---|---|---|
| S1 | **TB-UI-01 · Panel-Ordnung** | aufklappbare Abschnitte mit klebendem Kopf in Rigging (Eyes, Mouth, Brows, Ears) · Schalter »Erklärtexte« · Emote-Werte editieren + speichern · Skeptisch-Preset | Eyes-Panel ≤ 2 Bildschirmhöhen bei geschlossenen Abschnitten |
| S2 | **TB-ANIM-01 · Animation Studio** | v1-Ansicht nach Quelle (SOURCE_REQUIRED) · 24-Zustände-Tabelle · Datei-Export (Inventar, Zuordnung, Sitzprofile) · Zählwerk | 24/24 Zustände zugeordnet oder markiert |
| S3 | **TB-BODY-02 · Look** | Cube-Pet Material/Surface/Color (v18 SURF + Mods) · Kopfton-Zone · Materialzonen Driver · Licht-Mood + Sonnen-Regler | Pet-Look-Export byte-gleich zum v18-Feldschema |
| S4 | **TB-DRIVER-02 · Carl-Graft** | `brow.graft.*` / `nose.graft.*` Platzierung · Driver §2b Puppet (setExpression · playState · speak) | Driver-Rundlauf ohne Feld-Diff |
| S5 | **TB-ROSTER-02** | Carl · Klo-Rolli (Pad: Anker, Base, Audio, Roll) · Recherchi | alle 5 v18-Rosterklassen laden ohne SOURCE MISSING |
| S6 | **TB-FILE-01** | Export Auswahl / ganzer Satz / Laden (v18 File-Menü) | Satz-Export → Import → 0 Diff |
| S7 | **VOICE-01** | Blasen-Rework mit/ohne KFB-Outline (Design-Slice, Optionen) | Georgs Auswahl |
| S8 | **HUNKY-01 · Alien Build A** | Lord Hunky: Mund-Kopf, Knollennase, Augen auf Stielen mit DangleChain (`ear-base.v1` + `ear-dangle.v1`) | braucht Modell mit Stiel-Knochen |
