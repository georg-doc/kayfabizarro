# Offene Spielanschlüsse · Eigentümer WS0

## P0 · FPS-Armhaltung / echtes Figuren-Rig

**Heute:** private Proof-Figur und ursprüngliches Waffenmodell; FPS zeigt einen Waffen-Klon im tiefengelöschten Overlay desselben Renderers. Materialien und Kind-Transforms teilen den nativen Zustand. Kein endgültiges Game-Arm-Rig. Der Web-Kanon r1j bleibt ausschließlich Proof-Referenz, 1,81 m; keine Laufzeit-FB-Ersetzung.

**Anschluss:** bestehenden Game-Figuren-/Held-Weapon-/Action-Host einsetzen. Pose und Angriff auf der bestehenden Animationsuhr halten; FPS/TPS-Wechsel darf weder neue Freigabe noch zweite Waffe auslösen. Keine neuen Arme oder Ersatzmodelle bauen.

**Abnahme:** FPS/TPS und Kontaktansicht zeigen plausiblen Griff, sichtbare Recoil/Rückkehr und keinen Wanddurchtritt der Arme; Clipunterbrechung, Reset und Kameradrehung führen zu keiner verspäteten Freigabe. Aktuelle Klick-Abbruchlogik stoppt die noch ausstehende Ausrichtung; einen bereits vom nativen Kampf angenommenen Angriff behandelt dessen Besitzer.

## P0 · Mündungsausrichtung / Kamera-Parallaxe

**Heute:** Kamera zentriert den gewählten Punkt vor fire. Der reale native Schuss startet an der Welt-Mündung und verwendet `direct:true` plus festen point. Die sichtbare FPS-Overlay-Mündung ist eine eigene Darstellung; ihre endgültige Deckung mit der Welt-Mündung ist nicht abgenommen. Ein Head→World-Muzzle-Blocker existiert im privaten Host.

**Anschluss:** kanonischen Game-Schussanker verwenden. Zielpunkt, sichtbarer Lauf, Blitz, Spur und reale erste Kollision müssen denselben nativen Freigabemoment und die tatsächliche Schussbahn respektieren. Nahwand-Schutz im bestehenden Kampf-/Kollisionsbesitzer belassen; keine zusätzliche Zieltreffer-Instanz im Raummodul. Bei verdeckter Mündung nicht durch Deckung zum Kameraziel schießen.

**Abnahme:** frontal/schräg an Wand und Lochrand, Boden/Decke und FPS/TPS vergleichen. Angewählter Punkt ist die Absicht; verdeckte Mündung darf einen anderen ersten Kontakt ergeben oder den Schuss blockieren. Bei freiem Weg liegt der bestätigte Treffer am Ziel. Bestehenden Durchbruch erneut anklicken sowie bewusst durch ihn hindurch zielen prüfen; UI muss offene Luft verständlich behandeln.

## P0 · Audio / genau einmal hörbar

**Heute:** ein nativer `audio.k10`-Verbraucher nach Producer-Sequenz, ein AudioContext/Mixer. Ton nur nach Entsperren; Musik wird im Prüfstand zur Schussisolation pausiert. Performance-Videos und Messläufe sind Audio AUS und sind kein Hörbeleg. Frühere Proof-Quelle nennt unvollständige Bank-/FX-Ressourcen, unter anderem fehlenden Snow-Footstep; aktueller Game-Bankstand muss separat geprüft werden.

**Anschluss:** vorhandenen Game-Audio-Besitzer/Consumer nutzen, den Proof-Consumer nicht zusätzlich starten. Originale Bank-/FX-Dateien und Pfade vervollständigen; keine Ersatzsamples oder eigenen Analyser/AudioContext. Stille/Ladefehler sichtbar behandeln.

**Abnahme:** genau ein Schuss-/Freigabeton, ein passender Erstkontakt/Bruch und keine zweite Klangkaskade nach Worker-Commit. FPS/TPS, Reset, Menü ein/aus und Rückkehr nach Tabwechsel ohne Doppelton, Neustart oder verlorenen Kontext. Musik/Ambient im bestehenden Mixer belassen; keine Aussage zu Audio-Last aus den stillen Messungen ableiten.

## P1 · Welt-/Lebenszyklus und weitere Last

- Quelle einmal registrieren, beim Verlassen abmelden; Worker und Ressourcen über die bestehende Raum-Lebenszeit freigeben.
- Bestehenden Renderer, Rapier-Welt, Frame-Loop, Mixer und sichere Rückwege verwenden. Proof-Capsule/Fall-Reset sind keine endgültige Game-Reise- oder Fahrzeuglogik.
- room local/world transforms auch bei gedrehten/versetzten Räumen prüfen; keine Änderung am Stamm-Portalweg.
- Reset darf den Spieler nicht einmauern; späte Masken dürfen keine zurückgesetzten Löcher öffnen. Fehler/Queue-Limit sinnvoll an die bestehende Rückmeldung anschließen.
- Gatling, Explosionen, Fahrzeug-/Nahkontakt und längere Sessions inklusive Speicher/Dispose erneut prüfen. Nur HeroMan-Blaster ist hier live belegt. Waffenprofile sind Daten; keine neuen Waffen-Namen/Modelle.
- Feste kanonische Game-Kameras für seite/dreiviertel/totale/kontakt verwenden. Proof-Presets tragen diese Namen, ihre Transforms sind keine kanonische Game-Abnahme.
- Rezept-/FX-Ressourcen vollständig anschließen; der volle Kaskaden-Rezeptmodus ist im Proof nicht standardmäßig aktiv. Funken/Rauch/Schuss/Explosion/Ton bleiben combatPlayer, Raumantwort baut nur Bruch/Loch/Trümmer.
