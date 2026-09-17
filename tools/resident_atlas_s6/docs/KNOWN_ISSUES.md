# KNOWN_ISSUES · Export 2026-09-17-r1

## 1 · Assets via GitHub — Entscheidung, nicht Fehler

Alle 121 Zeilen in `ASSET_MANIFEST.json` stehen auf `availability: REMOTE_ONLY`. Das ist so **entschieden** (Georg, 2026-09-17): die zentrale Quelle ist `georg-doc/kayfabizarro/media/3D_Assets/`, das Paket referenziert sie über gepinnte Raw-URLs statt zu kopieren. Ein Paket mit kopierten Assets wäre rund 300 MB groß und ab dem nächsten Pack-Update veraltet.

Folgen, die daraus sachlich entstehen und im Blick bleiben müssen:

- Das Paket braucht Netzzugriff. Offline-Fähigkeit wird nicht behauptet.
- `sha256`, `byteSize` und `sourceBlobSha` sind `null`, weil dieses Projekt die Bytes nicht besitzt. Wer sie braucht, berechnet sie an der gepinnten Quelle — Pfad und Commit stehen in jeder Zeile.
- Die Identität eines Assets hängt an **Pfad + Commit**, nicht an einer Kopie. Ein Pack-Update ohne Pin-Anpassung ändert nichts an diesem Paket.

**Diese Einordnung war in der ersten Fassung dieses Dokuments falsch.** Ich hatte sie als „Hauptblocker" geführt, also eine bewusste Architekturentscheidung als Fehlteil dokumentiert. Korrigiert auf Georgs Hinweis.

## 2 · three.js kommt von unpkg

Die Import-Map zeigt auf `unpkg.com`, Version 0.184.0 gepinnt — dieselbe Logik wie bei den Assets. Für einen echten Offline-Betrieb müssten fünf Dateien nach `vendor/` gespiegelt und die Map umgehängt werden. Eigene Aufgabe, nicht Teil der Asset-Entscheidung.

## 3 · Kein Browser-Zustand exportiert

Der Exportauftrag verlangt `localStorage`/IndexedDB als JSON. Der Atlas hält in `localStorage` die Studio-Korrekturen pro Resident (überleben einen Reload). Ein Zustands-Export ist **nicht** gebaut; der Studio-Knopf „Patch exportieren" liefert nur die Korrekturen des aktuellen Residents als `<resident>.studio-patch.json`. Ein vollständiger Zustands-Dump fehlt.

## 4 · Offene fachliche Punkte

Dreißig dokumentierte OPEN-Punkte in `ATLAS_RETURN.md`, darunter: keine Balance-Pose für den Clown, kein Schuss-/Lade-Clip für den Blaster, kein Lese-Clip für den Folianten, Schlag-Clips der Orc Warband nicht kollisionsfrei, Honig existiert im Repo nicht, konstruktiv gehaltene Instrumente überleben keinen Motion-Wechsel.

## 5 · UI ist nicht responsiv (Backlog)

Die Seitenpaletten und die HUD-Caption sind fest eingeblendet. „Leiste ausblenden" klappt nur die Seitenspalte; die Caption-Bande über den unteren ~13 % der Leinwand ist nicht wegschaltbar und hat in S32 die vordere Requisitenebene verdeckt. Siehe `ATLAS_NEXT_SLICES.md`, Scheibe G.

## 6 · Prosa liegt in einer .js-Datei

Die Resident-Notizen stehen als String-Arrays in `data/cast.js`. Zweimal in dieser Session hat eine eingefügte Notiz ein Array-Komma verschluckt und damit den gesamten Atlas lahmgelegt (Syntaxfehler, leere Auswahlliste). Der Lade-Check nach dem Doku-Schritt hat es beide Male gefangen — die Klasse bleibt aber bestehen.