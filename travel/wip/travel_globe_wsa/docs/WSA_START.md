# Travel Globe · nächster Arbeitsstart

Arbeitsstand: B0 in Arbeit, keine B0-Abnahme. Das private Ziel-Repository georg-doc/KFB-Travel-Globe ist angelegt und über den GitHub-Connector erreichbar. Der ursprüngliche GitHub-main-Commit ff55c3a1042bd11d96a5d7a24effeb7fbeb25813 bleibt als Vorgänger erhalten. PR #1 wurde bei 65d9f5c4397ae8e14b27cf488bcddf75e054c0ef gemergt; der main-CI-Lauf bestand.

Zuerst README.md, MASTERPLAN.md, HOUSEKEEPING.md, B0_BASELINE.json und qa/B0/RETURN.md lesen. Aktuelle Repository- und Deployment-Angaben immer verifizieren.

Quellbasis: georg-doc/KFB-Stunt-Car-Race@53e929f24f68420a9a384a003aa27375424b307f, Pfad _inbox/KFB TRAVEL GLOBE re-home WS0/KFB Travel Globe v13-3 re-homne WS0.

travel/ ist der unveränderte R0-Import. Node.js >=22 genügt für npm test, npm run build, npm run verify und npm run serve. Im Browser http://127.0.0.1:4173 öffnen; externe Module und Assets benötigen Internet.

Nächster Auftrag bleibt B0: normale Browser-QA, geprüfte Dependency-Pins, verified Travel main → reproducible build → public Kayfabizarro WIP mirror → normal browser QA. Import/PR #1 und CI sind erledigt; Belege in qa/B0/RETURN.md. Alle Belege und Fehler mit dem tatsächlich geprüften Kontext dokumentieren. Browser-Sicherheitssperren nicht umgehen. Datengetriebene Modul-/Funktionsprüfungen ersetzen keine Flugprobe und keine visuelle Abnahme.

Bewegung: carpet.js; Kamera: camera-rig.js; Kartenträger: card-carrier.js; Passagier: Cube-Pet-Pfad; Sammlung: sky-cards/card-flight/collect-hud; Portale: portal.js; vorhandene leichte Aktionen: sky-enemies/sky-dice. Details in travel/CONTRACT.md.

STOP vor MVP1. FrizzleBob, Fahrzeuge, Walk, Stunt und Combat erst nach Georgs B0-Abnahme. Die aktuelle MVP1-Planung heißt Bath Flight. Vor Coding `_handover/MVP1_BATH_FLIGHT_PREFLIGHT/START_HERE.md`, V16_DONOR_REFRESH.md und ADAPTER_OWNER_MAP.md lesen: bestehendes SeatLab/PoseRig/DriveActing adaptieren. Studio v16 und Animation Lab liefern Look, Bath-Konfiguration und belegten Sitz-/Idle-Clip. Asset Librarian ist Entdeckung, kayfabizarro bleibt Asset-Quelle.

Astra übernimmt ausdrücklich Branch-/PR-/Merge-Management. Für Vorarbeiten `_handover/INDEX.md` lesen; Rückgaben unter `_inbox/` sind Review-Eingaben.

Publikation: `georg-doc/kayfabizarro/travel/wip/travel_globe_wsa/` ist ausschließlich der öffentliche dist-Mirror. Eine eigene Travel-Cloudflare-Kontoverbindung ist keine Voraussetzung. Erwartete öffentliche URL: https://kayfabizarro.pages.dev/travel/wip/travel_globe_wsa/. Tatsächliche Auslieferung und Build-ID belegen; Quelle bleibt Travel.
