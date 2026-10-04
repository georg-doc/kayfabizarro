# T1 · Produkt- und UI-Spec

Status: DECISION / IMPLEMENTATION TARGET, nicht bereits gebaut.

## Ergebnis

Eine schlanke öffentliche ToolBox auf dem vorhandenen Kayfabizarro-Publikationsweg. Drei vorhandene Werkzeuge statt eines neuen Super-Editors: Studio v17, Rigging v1, Animation v2 mit sichtbarem WIP-Status. Eine Startseite und echte Werkzeug-Links genügen; kein neues Konto, Backend oder neues Cloudflare-Projekt als Voraussetzung.

## Erhalten

Vorhandene Regler, Presets, Roster, Mess-/Exportfunktionen und brauchbare Defaults. Vor jeder Änderung Funktionsliste aus echtem Stand erfassen. Fehler reparieren, nicht eine vereinfachte Ersatzoberfläche mit fehlenden Funktionen bauen. Exportoriginale bleiben Vergleichsstand.

## Navigation

- ToolBox-Einstieg mit drei eindeutig benannten Werkzeugen und Versions-/WIP-Kennzeichnung.
- Dezenter Link `Docs / LLM` pro Werkzeug, daneben Rückweg zur ToolBox.
- Aktueller Actor, gewählter Config-Stand und ungespeicherte Änderungen erkennbar.
- Import/Export/Reset eindeutig; Reset arbeitet nur auf dem benannten Ziel und zeigt seine Reichweite.
- Fehler als konkrete Meldung mit Ressource/Handlung; kein endloser leerer Canvas.

Erste Umsetzung darf separate Seiten nutzen. Kein iframe-Zwang und kein Zusammenführen der drei Renderer. Eine Shell kann später hinzukommen; mehrere versteckt weiterlaufende Render-/Audio-Loops vermeiden.

## Lesbarkeit

Referenzprofil: Roboto 400/500/700 als Webfont, System-Sans-Fallback. Reguläre Beschriftungen 15–16 px, Hilfstexte mindestens 14 px als Ausgangswert. Zahlen dürfen tabular sein; kein Typewriter- oder Monospace-Look für ganze Panels. Texte umbrechen statt abgeschnittene kryptische Labels. Sichtbarer Tastaturfokus, klare Disabled-Zustände, genügend Kontrast. Dies sind Designziele, kein behauptetes Accessibility-Zertifikat.

Prüfen bei 1440×900, 1024×768, schmalem Fenster und 200 % Browserzoom. Eingaben/Import/Export müssen erreichbar bleiben; auf kleinen Breiten Panels stapeln oder einklappen. Keine Pflicht zu vollständiger Smartphone-3D-Bedienung in T1.

Brand-Art, Poster, Wortmarken, Karten und Modelltexturen sind getrennte Flächen. Keine globale CSS-Regel, die in SVG-Text oder Canvas-/3D-Text-Art unbeabsichtigt die Schrift austauscht. Typografische Details: FONTS.md.

## Actor und Lern-/Spielrollen

FrizzleBob Driver Graft ist die gemeinsame gewünschte FB-Linie, auch für Presenter/Podcast. CapsuleCarl ist ein eigener Actor mit eigenen Messwerten. Kein Tausch des Body-Systems durch den alten Cube-Pet-Podcast-Donor. Rollen steuern z.B. Waffen-Sichtbarkeit, Pose oder Target; das Spiel bleibt Bewegungs-/Camera-/Combat-Owner.

T1 muss WIP-Snapshots anzeigen können, ohne sie als fertigen schwarzen Leder-Look auszugeben. Carls Nasen-/Brauen-Mods sind demonstrierbare Optionen, keine automatisch globale Identitätsänderung.

## Nicht Bestandteil

Kein generisches ECS, keine neue Physik, keine neue Asset-Registry, kein kompletter Tool-Rebuild, kein Full-Body-IK-Projekt, kein Pflicht-Cloudbackend, kein neues LLM-/TTS-Abonnement. Noch kein vollständiges Lip-Sync, keine zwölf neu erfundenen Clips, kein automatisches Umschalten aller Consumer auf v17.
