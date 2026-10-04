# B0 · Abhängigkeitsprüfung

Prüfzeit: 2026-09-13T03:13:23.007Z

Bekannte kayfabizarro-Revision: 0b48cd2a924ec1b51547485f4b30b348b3bf1243. Über GitHub main verifiziert.

1137 statische URL-Vorkommen, 1083 unterschiedliche URL-Literale, 1123 bewegliche Vorkommen. Das Inventar enthält auch Basis-URLs, dynamische Vorlagen und inaktive Pfade. Die tatsächlich geladenen Ressourcen müssen im Browser zusätzlich erfasst werden.

## Sechs direkt eingebundene Pet-Module

| Modul | Vergleich bewegliche CDN-URL / feste Revision | Angewendet |
|---|---|---|
| build/pet-library.v6.js | Byte-identisch | Nein |
| build/pet-eye-rig.v5.js | Byte-identisch | Nein |
| build/pet-motion.v2.js | Byte-identisch | Nein |
| build/pet-face.v1.js | Byte-identisch | Nein |
| build/pet-mouth.v1.js | Byte-identisch | Nein |
| pet-surface.v1.js | Byte-identisch | Nein |

Vollständige URLs, Hashes und etwaige transitive bewegliche Code-URLs stehen in dependency-pins.json. Kein Pin wurde angewendet, weil die Browserregression durch den fehlgeschlagenen Richtlinien-Prüfschritt des Codex-Browserwerkzeugs blockiert ist.

## Verbleibende externe Abhängigkeiten

R0 verwendet weiterhin bewegliche RAW-Assets und Daten (Kartenindex, Pet-Konfiguration, GLB/GLTF, Texturen und Audio). Drei.js 0.160.0, PDF.js 4.7.76 und React 18.3.1 sind versionsgebunden; Google Fonts bleiben extern. Keine lokale Spiegelung, keine stille Ersetzung. Keine vollständige Netz-/Asset-Verfügbarkeit oder Kaltstart-Performance behauptet.
