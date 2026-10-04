# Free Roam · konkreter Receiver-/Control-Vorschlag

**PROPOSAL r1 · 18.09.2026 · noch keine Runtime- oder Defaultänderung.** Quellenblobs und Lesetiefe stehen in [SOURCE_REVIEW](SOURCE_REVIEW.md). Bestehende Verträge werden erst durch einen angenommenen Owner-Delta erweitert.

## 1 · Zuständigkeiten und minimale Anpassung

Travel bleibt World-/Modus-/Anker-/Persistenzhost; seine vorhandene WB0-Brücke bekommt einen benannten DRIVE-Empfänger. Race liefert die bestehende Slice-04-Fahrphysik, Kontaktfakten und die fachlich betreuten Anpassungen. Kein zweiter Renderer, keine zweite Hostschleife und kein neuer allgemeiner Movement-Service.

Genau ein aktiver Spielerbewegungswriter: Ground oder Drive oder Carpet. Der geparkte Wagen behält seine stabile Fahrzeugidentität und seinen Collider; sein physikalischer Zustand bleibt vom Drive-/Physikowner geführt, nicht vom Ground-Root. Ein Ground-Spieler plus ein geparkter Wagen sind zwei Entitäten, kein Anlass, beide Posen durch denselben Root zu ersetzen.

Donor-Delta: explizite statt importierter fester Track-Surfaces/Start-/Safe-Points, geeignete Kontaktregistrierung, klarer Raum-/Einheitenvertrag, getrennte Reverse-/Boost-Parameter und neutraler Richtungswechsel. Vorhandenen Solver/Fahrzeugcontroller verwenden. Das heutige `addMesh` akzeptiert nur deklarierte TRACK-GLTF-IDs; beliebiges Travel-Terrain kann nicht unverändert als bereits kompatibel gelten.

## 2 · Eingaben und langsames Fahren

Semantische Wünsche werden im vorhandenen Host einmal je Fixschritt abgetastet. Signiertes Tempo ist Geschwindigkeit entlang der tatsächlichen Fahrzeugfront; Geschwindigkeit als Betrag ersetzt dieses Vorzeichen nicht.

| Eingabe | Vorgeschlagener Vertrag |
|---|---|
| W/S | Gewünschte Fahrtrichtung. Gegen laufende Bewegung zunächst throttle=0 und Bremse. Erst nach stabiler Neutralzone in die andere Richtung antreiben. |
| W+S | Deterministisch bremsen, kein Gas und kein Boost. Kein zufälliges Last-Key-Wins. |
| A/D | Fahrzeugrelativer Lenkeinschlag; rückwärts ergibt die Fahrphysik die entgegengesetzte Gierantwort. Lenksignal nicht zusätzlich invertieren. A+D neutral. Kein Chassisdrehen auf der Stelle. |
| Q/E | Im DRIVE gerichteter Driftwunsch, im GROUND bleibt Strafe. Q+E erzeugt keinen gerichteten Drift. Slice-04-Gripänderung weiterverwenden; Richtungsanteil/Re-Grip ausdrücklich anpassen und testen, nicht zweite Seitwärtsphysik aus BOX1 übernehmen. |
| Shift | DRIVE: Boost nur bei Vorwärtswunsch, Vorwärtsbewegung und ohne Bremse. GROUND: bestehendes Run. Kein Rückwärtsturbo. |
| Space / R | Vorhandene Hop-/Reset-Semantik erhalten; kein Exit darauf legen. Hop nur auf frischen Druck und gültigen Kontakt. Reset bleibt Recovery, nicht Mode-Transition. |
| Kontextinteraktion | Derselbe explizite Enter-/Exit-Wunsch aus bestehender Interaktionsnaht und sichtbarem Button. I/F müssen noch im tatsächlichen Host vollständig geprüft werden. E ist wegen Drift/Strafe nicht frei; F kollidiert im Race-Spender mit Orbit-Recenter. Keine unbestätigte Taste hardcoden. |

Konkrete **Versuchsparameter**, nicht freigegebene Werte: Neutralzone `|v_forward| <= 0.02 * L / s` für 0.12 s; L ist die gemessene physische Fahrzeuglänge im vereinbarten Physikmaß. Rückwärts-Cap zunächst 25 % des ungeboosteten Vorwärts-Caps. Drift-Untergrenze aus dem Slice-04-Profil als eigene Einheit dokumentieren, nicht den BOX1-Wert ungeprüft übernehmen. Beim Richtungswechsel Drift/Boost lösen. Keine harte SetLinvel-Vorzeichenumkehr zum Kaschieren unzureichender Bremsung.

Stand/Hang: kontrolliertes Halten und kein ungewolltes Rollen in die Gegenrichtung nach Neutralfreigabe prüfen. Ist die Bremse am Hang unzureichend, das als Physik-/Tuningfehler melden; nicht still die Pose einfrieren. Drift muss bewusst beginnen und in Grip zurückkehren, ohne jede Parkkurve zu erfassen.

Blur, Visibility, Pause, UI-Modal, BUILD-Wechsel und Modusübergabe löschen alle gehaltenen Wünsche und verwerfen akkumulierte Simulationszeit. Resume erzeugt weder Catch-up noch Restgas/Schuss/Hop. Beim Text-/Pickerfokus keine Spieltasten abfangen. Touch-Buttons senden dieselben Wünsche inklusive pointercancel; kein unabhängiger Touchcontroller.

## 3 · Walk↔Drive als Transaktion

**Prepare → Validate → Commit**, andernfalls Erhalt des letzten gültigen Zustands. Die vorhandene Ground↔Flight-Brücke beweist diesen Vertrag noch nicht.

Prepare erfasst World-/Vehicle-/Actoridentität, Modus, Handlung/Aktivität, Pose/Heading, lineare und Winkelgeschwindigkeit, Sitzbelegung, Kamera/Orbit, Inputgeneration und gültigen Restorestand. Benötigte Assets/Profile werden gestaged, ohne die vorhandene Szene zu ersetzen. Jeder Request hat eine Generation; Cancel oder neuerer Request entwertet verspätete Ladeantworten.

Validate unmittelbar vor Commit: aktueller erreichbarer Interaktionsabstand, dasselbe Fahrzeug/derselbe freie Sitz, kein bewegter Zielzustand nach altem Snapshot. Regulärer Ausstieg nur langsam und mit stabiler Unterstützung. Versuchsschwelle: Gesamttempo <= 0.02 L/s, Winkeltempo <= 0.15 rad/s und Kontakt stabil für 0.25 s. Diese Werte müssen am Fahrzeug geprüft werden.

Ausstieg prüft links, rechts, dann hinter dem Wagen: tatsächliches Capsule-/Kopffreiraumvolumen, Bodenneigung/Support, Erreichbarkeit des kurzen Ausstiegswegs und Abstand zum Wagen. Die eigene Karosserie nicht pauschal aus der Ziel-Freiraumprüfung ausschließen. Ein bloßer einzelner Bodenray reicht nicht. Bei allen blockierten Kandidaten bleibt DRIVE gültig; sichtbarer englischer Hinweis `No safe place to exit.`. Niemals in Wand, Fahrzeug oder auf das darüberliegende Brückendeck setzen.

Commit übergibt in einem synchronen Host-Schritt Input, Spielerpose, Kamera und Darstellung; keine asynchrone Lücke zwischen Abschalten des alten und Übernehmen des neuen Owners. Fehler kompensieren einschließlich Sichtbarkeit, Listener, Kamera und Sitzreservierung. Enter darf zunächst als funktionaler Wechsel ohne Einsteigeclip erfolgen. Keine erfundene Rig-/Seat-Kompatibilität.

Beim Aussteigen bleibt das Fahrzeug vorhanden und steht kontrolliert; Ground übernimmt nur den Actor. Beim Wiedereinsteigen dasselbe Fahrzeug und dieselbe Identität. DRIVE→FLIGHT bleibt zunächst gesondert: sauber aussteigen, dann vorhandenes GROUND→FLIGHT verwenden. Keine heimliche Fahrzeugumwandlung und kein Verlust des geparkten Wagens.

## 4 · Kamera, Darstellung und Audio

Drive-Kamera folgt der tatsächlichen Fahrzeugfront und lokalem Up, nicht dem Vorzeichen des Tempos. Rückwärtsrollen dreht weder Modell noch Kamera automatisch um 180 Grad. Bestehende Orbit-/Lookrechte erhalten; Obstruktionsprüfung muss dieselben benannten Kontaktgeometrien berücksichtigen. Ein Camera-Clearance-API im Donor ist kein Beweis korrekter Travel-Skalierung.

Signierte tatsächlich zurückgelegte Strecke steuert Raddrehung; physischer Lenkeinschlag die passenden Räder. Reset/Teleport/Restore zählen nicht als gefahrene Strecke. Fehlende bewegliche Radknoten dokumentieren. Karosserie/Deformer lesen Beschleunigung, Lateralbewegung, Grip, Landung und Kontaktfakten. Kein zusätzlicher voller BOX1-Body-Response neben einem bereits aktiven Deformer. Laufende Mechs bleiben getrennte Clip-/Bindingfälle.

Travel verwaltet einen Audio-Lebenszyklus; vorhandene Motor-/Kontakt-/Musikquellen durch die benannte Bus-/Telemetrienaht übernehmen. Kein neuer AudioContext beim Einsteigen, keine dauerhaft doppelte Musik. Audio-A1 bei tatsächlicher Integration frisch lokalisieren, nicht aus älterer Recovery als dauerhaft fehlend erklären und nicht aus Prosa nachbauen.

## 5 · Physikraum, Kugel, Gelände und Recovery

**Receiver-Vorschlag für den ersten begrenzten Versuch:** ein expliziter lokaler kartesischer Physikraum für genau das Quartier, mit gemessener Abbildung zur bestehenden Travel-Welt. Kein Versprechen einer globalen Free-Drive-Fassung.

Benennen: sphärischer Weltanker, Frame-Basis/Quaternion, Einheitenskalierung, Fahrzeuggröße, Gültigkeitsradius und Verhalten am Rand. Tatsächlich gebackene Travel-Dreiecke und registrierte Straßen-/Propgeometrien werden in diesen Raum transformiert; keine glatte Ersatzebene oder unabhängig neu gesampelte Terrainwelt. Darstellung und Kontakt verwenden dieselbe Abbildung.

Der Source-Donor setzt Welt-Up/-Y und XZ-Prüfungen voraus. Seine Verwendung mit fester lokaler Gravity ist nur innerhalb eines gemessenen Up-/Kontaktfehlerbudgets zulässig. Vor größerer Ausdehnung radiale Gravity, Suspension-/Normalenbezug, Hop/Landung, Rollover/Checkpoint und gegebenenfalls Frame-Rebase am EXISTIERENDEN Solver prüfen. Kein ungetestetes Versprechen, eine Körperrotation allein löse das.

Analytischer Warnbefund für eine **unprojizierte flache Tangentenebene**, nicht für importierte gekrümmte Dreiecke: bei R=5 und Vorschlag max. 0.05*0.022 radialem Fehler ist ihr zulässiger Radius nur ca. 0.104887 Travel-Einheiten; Normalendifferenz dort ca. 1.201736°. Baked-Terrainvariation, Meshdicke und Dynamik fehlen in dieser Rechnung. Daraus nicht automatisch den echten gültigen Fahrbereich übernehmen.

Bis die Randübergabe bewiesen ist, Gebiet sichtbar begrenzen und kontrolliert anhalten; kein unsichtbares Umstellen auf den BOX1-Streckenkanal. Offroad-Abzweig bleibt echtes befahrbares Travel-Terrain innerhalb der getesteten Region.

Recovery ersetzt die Donor-Trackregionen durch vom Receiver validierte sichere Zustände: World/Vehicle-ID, Pose/Up/Heading, geprüfte Kontaktfläche/Freivolumen. Kein Reset in den alten Race-Origin. Geparkt, gebremst, pausiert und im freien Sprung darf kein Stuck-Timer anlaufen. Nicht bloß die höchste radiale Oberfläche als Unterfahrtscheckpoint verwenden.

## 6 · Save/Reload und Combat/Race

Die vorhandene World Recipe bleibt der Speicherowner. Sie hat noch keinen nachgewiesenen vollständigen Vehicle-/Seat-/Actor-Resume-Vertrag. Ihre Normalisierung setzt das Schema um; das ist keine Validierung. Unbekannte Felder können im Serializer erhalten bleiben, müssen aber auch die konkreten WB0-Sync-/Restorepfade überleben.

Minimaler benannter Owner-Delta: stabile Fahrzeug-/Asset-/Profilidentität, sphärischer Anker plus Orientierung, physikalisch relevanter Fahrzeugzustand, Actor-/Sitzbeziehung, Locomotion/Action/Activity und sicherer Restorepunkt. Die exakten Feldnamen/versionierte Migration im bestehenden Recipe-Owner festlegen, keine parallele Garage/Registry. Welt plus Spieler-/Fahrzeugzustand gemeinsam validieren, dann committen. Fehlende Quelle/kaputter Import/alter Load behält vorherige Szene UND Save. Kein localStorage.clear; Originwechsel sind kein automatischer Savetransfer.

Combat ergänzt eine Handlung über Ground. Den vollständigen Arena-Player/Host nicht importieren: er besitzt eigenen Root, Bewegung und planaren Boden. Für den begrenzten Test vorhandene Shot-/Hit-Logik mit genau einem Actor-/Clipentscheider anbinden. Aktuelles Arena-schuss verlangt Action/Marker und ein korrektes Muzzle; das ist mehr als `fire()` aufrufen. LMB-Klick/Orbit-Drag und RMB-Look nicht parallel als Waffeninput behandeln. Ein Ziel, bestätigter Schussabgang, Hit und Rückkehr zu Explore reichen als erster Combat-Nachweis; keine neue Economy/Polizei.

Free Roam→Race ändert zunächst Checkpoints/Zeitwertung/Ziele, nicht Wagen, Pose, Geschwindigkeit, Controller oder Audiokontext. Abbruch/Abschluss geben dieselbe Fahrt frei. Separater BOX1-Einstieg bleibt erlaubt, aber ausdrücklich nicht nahtlos integriert.
