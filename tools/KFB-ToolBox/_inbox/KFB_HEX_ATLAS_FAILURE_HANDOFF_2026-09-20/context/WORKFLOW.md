# KFB · Arbeitsweise für diesen Chat und für frische Chats

Stand 19.09.2026. Gilt, bis Georg es ändert. Quellen im Repo:
`skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md` · `skills/chat/STAGE_LIVE_WORKFLOW.md` ·
`skills/session-entry-use-what-works_v1.md`

## Die Trennung

**Live bleibt stabil. Stage darf experimentieren. Work prüft und übernimmt.**

- **Live** ist die letzte angenommene, verlässliche Fassung.
- **Stage** ist der öffentliche Spielplatz für genau einen benannten Kandidaten.
  Einstieg: `https://kayfabizarro.pages.dev/kfb-hub/stage/`
- **Work** prüft die Rückgabe gegen die Projekt-SSOT und die Eigentümergrenzen.

Ein neuer Slice muss nie die brauchbare Fassung ersetzen, nur um testbar zu sein.

## Die Schleife

1. Ein produzierender Chat ändert **einen** abgegrenzten Slice auf eigenem Zweig.
2. Er gibt zurück: Changelog, genaue Revision, echte Tests, Stage-Link.
3. Georg testet den Stage-Link auf Desktop oder Mobil. Kein GitHub-Handling nötig.
4. Work prüft gegen SSOT und Grenzen.
5. Angenommenes wird gemerged, der Live-Zeiger **bewusst** bewegt.
6. Abgelehntes bleibt Stage oder Historie. Live bleibt unberührt.

Ein Merge auf einen Stage-Pfad ist **keine** Abnahme durch Georg und macht nichts Live.

## Was Claude Design hier tut

Genau **einen abgegrenzten visuellen Slice** pro Lauf. Vor der Umsetzung fünf Zeilen:

- **Ziel** — ein sichtbares oder anders prüfbares Ergebnis
- **Eigentümer** — das bestehende Projekt, dem das Ergebnis gehört
- **Quelle** — Repository, Ref, benannte Spender
- **Geschützte Grenze** — was dieser Slice nicht ersetzen oder nachjustieren darf
- **Fertig, wenn** — die kleinste echte Prüfung, die den Slice belegt

Jeder Lauf endet mit: Export, kurzem Changelog, **tatsächlich gelaufenen** Tests und genau
**einer** offenen Prüffrage.

Claude Design **pusht nicht** nach GitHub. Lieferung ist ZIP plus Preview; Integration macht
der Web Lead.

## Ehrlichkeit als Format

Behauptungen werden getrennt geführt und nicht vermischt:

`SOURCE` · `DECISION` · `IMPLEMENTATION` · `TESTED RESULT` · `EXPORT` ·
`PUBLIC DEPLOYMENT` · `GEORG ACCEPTANCE` · `OPEN`

Nicht Gelaufenes heißt `NOT_TESTED`. Ein automatisches PASS ist nie Georgs Abnahme.
Fehlschläge und ungetestete Pfade bleiben sichtbar. Alte Ergebnisse werden **nicht**
umgeschrieben, damit die Historie sauberer aussieht — angehängt wird, nicht ersetzt.

## Prüfen heißt hinsehen

Zahlenprüfungen sagen, ob etwas an der richtigen Stelle steht. Ob es dort stehen **soll**,
sagt nur ein Entwurf und ein Blick auf das Bild in Arbeitsgröße.

Zwei Fehlschläge an einem Tag, beide von Georg im Bild gefunden und von keiner Messung:
die Treppe (`POC v0.3`) und die Inselkomposition (`v1`, `docs/FAIL_ISLANDS.md`).
Deshalb gilt: **vor jeder weiteren Teile- oder Szenenkonstruktion ein Screenshot in
Arbeitsgröße, isoliert, und zusätzlich eine Seitenansicht** — keine weitere Messreihe.

Und: **kein Whack-a-Mole.** Stimmt das Bild nicht, wird erst gefragt, ob die Grundlage
stimmt. Fünf Korrekturrunden auf falschem Fundament sind teurer als ein Neuentwurf.

## Mobil

Mobile Ideen starten von der öffentlichen Stage-URL. Web- und Work-Chats können Briefings,
Reviews und Cloud-Arbeit vorbereiten, aber **nicht auf lokale Dateien des Macs zugreifen**.
Ein mobiler Slice wird deshalb zuerst ein GitHub-gestützter Slice oder ein Briefing.
Integration, Tests und Versionsverwaltung bleiben im Desktop-Kontext.

## Stand der Nachbarprojekte (zur Einordnung, nicht zum Anfassen)

- **Vehicle Deformer v2** übernommen über PR #79: 61 Boden-Fixtures, 10 Flugkandidaten,
  23 Bewegungsfolgen. Der Flug-Tab ist Inventar und Vorschau, **keine** fertige Flugsteuerung.
- **C1** (OSM-Stadt plus Vehicle Deformer) eingebaut, 9/9 Modul- und 26/26 Browserprüfungen.
  Bleibt absichtlich separater Stage-Entwurf (`KFB-Stunt-Car-Race` PR #10). Noch nicht mobil,
  noch nicht Live.
- **TinySkies / Flug v3** ist als Briefing vorbereitet
  (`skills/chat/workflows/VEHICLE_DEFORMER_V3_TINYSKIES_2026-09-19/START_HERE.md`) und
  verlangt C0 als unveränderte Fahrbasis, TinySkies/Travel als gemeinsame Formen-, Licht-,
  Farb- und Terrain-Sprache, OSM als geografisches Gerüst, echten Flug-Deformer und einen
  klaren Drive→Flight→Drive-Übergang.

## Kaltstart-Satz zum Kopieren

> Sync aus `skills/chat/START_HERE.md` und `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`, dann
> den aktuellen GitHub-Stand dieses Projekts wiederherstellen. Nur den benannten Slice
> additiv fertigstellen. Bestehende Eigentümer und SSOTs behalten. Return/Changelog des
> Projekts ergänzen und das übliche kompakte Review-Paket hinterlassen: genauer PR/Head,
> tatsächliche Tests, sichtbarer Beleg, offene Punkte, ein nächstes Gate.
