# WORLD-DRIVE-INTERACT-M2A · Additive Changelog

## 2026-09-27 · productive Drive + E integration

- World M1 ohne Ersatzwelt übernommen;
- exakte Free-Roam-Physik und Drive-Intent aus Race PR #10 bytegleich paketiert;
- ein bewährtes Kenney-Fahrzeug samt Vehicle Deformer v2 integriert;
- World-Terrain und OSM-Gebäude in Kontaktflächen für den bestehenden Drive-Owner übersetzt;
- `E` als gemeinsamen Interaktions-Key eingeführt; Ground-Strafe rechts auf `R` verschoben;
- sichtbaren Cartoon-Einstieg, Fahrer und sicheren Ausstieg ergänzt;
- Ground, Drive und Flight mit jeweils genau einem Movement-/Camera-Owner verbunden;
- Desktop und Narrow Browser 28/28 PASS;
- Track Core ausdrücklich nicht durch einen Proxy ersetzt.
- Hirnwelt-H0-Knete als sichtbaren Standard gesetzt; Original bleibt reversibel per Toggle oder `?look=original`.
- 2026-09-27 · Feste Cloudflare-Stage publiziert und im echten Browser erneut mit 34/34 Prüfungen auf Desktop und schmalem Viewport bestätigt.

## 2026-09-27 · Human free-play override

- Georgs Urteil als `HUMAN_TUNE · NOT_PLAYABLE` aufgenommen;
- automatischen 34/34-PASS auf technische Lade-/Ablauf-Evidence begrenzt;
- langsame/ruckelige Bewegung, Ladezeit/Frametiming, Animationstiming, Fahrzeug-Bodenniveau und fehlende Offroad-Terrainkollision als Kernblocker erfasst;
- Boulder-/Prop-Schattenartefakt als nachrangigen sichtbaren Bug erfasst;
- öffentlichen Stand als reproduzierbaren Fehlerbeleg erhalten;
- genau einen begrenzten nächsten Gate gesetzt: `WORLD-M2A-R1`.
