# Codex-Auftrag R1 · Bildschritt eines AD-Pakets (kfb Art Direction R3)

Diese Datei liegt in jedem Malpaket als `ad/<run_id>/paket_<rev>/CODEX_AUFTRAG.md` im privaten Zweig `ad/<run_id>` von `georg-doc/KFB-Stunt-Car-Race`. Codex liest sie und führt sie aus. Grundlage: V-2146, V-2147 (keine kostenpflichtige Bild-API; der Bildschritt läuft in Codex mit Georgs ChatGPT-Plan oder er ruht).

## Für Georg: eine Zeile
Georg öffnet Codex (App, Arbeitsordner = Checkout des privaten Repos, Zweig `ad/<run_id>`) und fügt die Zeile aus dem Paket-README bzw. der Hub-Karte ein, zum Beispiel:

```
Lies im Repo georg-doc/KFB-Stunt-Car-Race, Zweig ad/aqua10-ad-r1, die Datei ad/aqua10-ad-r1/paket_r4/CODEX_AUFTRAG.md und führe sie aus: Familie C Lauf 1 #<12 Zeichen>
```
Mehr tut Georg nicht: keine Rückfragen beantworten, nichts kopieren, keine Freigabe im Codex-Chat. Freigegeben wird gebündelt im Hub.

## Für Codex: Anleitung
Platzhalter aus der Zeile: `<run_id>`, `<rev>`, `<F>` (Familie), `<n>` (Lauf), `<hash>` (12 Zeichen).
```
P=ad/<run_id>/paket_<rev>        U=$P/upload/<F>        W=ad/<run_id>/rueckgabe/<F>_l<n>
```

**0 · Vorbedingungen (sonst sofort stoppen, ein Satz als Antwort, nichts malen)**
- Ein eingebautes Bildwerkzeug zum Bearbeiten vorhandener Bilder steht zur Verfügung (eingebaute Bildgenerierung bzw. `$imagegen`). Fehlt es: nur `$W/KEIN_BILDWERKZEUG.md` mit einem Satz anlegen, committen (Schritt 6), antworten „Codex hat hier kein Bildwerkzeug; der Bildschritt ruht.“
- **Nie** über die API erzeugen (kein `OPENAI_API_KEY`, keine kostenpflichtigen Aufrufe, keine anderen Dienste).
- `$W` existiert schon → stoppen („Rückgabe-Ordner existiert, nichts überschreiben“).

**1 · Start (prüft Paket-Prüfsumme, Skript und Leitplanke)**
```
python3 $U/ad_return.py start --paket $U/package.json --familie <F> --lauf <n> --erwarte <hash> --modell "codex <Bildmodell>" --arbeit $W
```
Bricht der Start ab: Meldung als Antwort, stoppen. Die Ausgabe nennt je Befund die zu bearbeitende Datei.

**2 · Lesen, bevor gemalt wird**
- `$U/LEITPLANKEN.md` ganz. `$U/package.json`: `absicht`, `genre`, je Befund `text`, `bereich`, `masken`, `referenzen`, `entscheidung`; oben `entscheidungen`.
- Im Paket stehen nur Befunde mit Weg `ad` (Code- und Kit-Befunde hat WS0 vorher aussortiert). `malbar: false` → nicht malen (Start setzt ihn auf `nicht_malbar`).
- **Eine Designentscheidung = eine Lösung:** Befunde mit derselben `entscheidung` bekommen dieselbe gestalterische Lösung auf allen ihren Zielen (z. B. Handy und Desktop).

**3 · Malen, je Ziel (Befund × Rolle aus der Start-Ausgabe)**
- Eingabe ist die Datei aus `$U` (`…__edit.png`, grauer Rand bleibt grau). Maske: `$P/<masken[rolle]>` (weiß = darf sich ändern, schwarz = bleibt pixelgleich). Referenz-Frame: `$P/media/refs/<referenz>__1.*` als Stilbezug, nie als Inhalt.
- **Bearbeiten statt neu erzeugen.** Im Prompt: was sich im weißen Bereich ändert (aus `text`, Ziel-Teil), und ausdrücklich, was gleich bleibt: alles außerhalb, Figuren, Augen, Kamera, Bildausschnitt, Licht, alle vorhandenen Texte wörtlich. Kein neuer Text, kein neues Menü, keine neuen Interface-Teile, kein neuer Rahmen außerhalb des Bereichs.
- Ergebnis speichern als `$W/neu/<Befund>_<rolle>_v<k>.png` (k = Versuch 1, 2, 3).

**4 · Bildtreue selbst prüfen (deterministisch)**
```
python3 $P/ad_bildtreue.py $W/neu/<Befund>_<rolle>_v<k>.png --paket $U/package.json --befund <Befund> --rolle <rolle> --json $W/neu/<Befund>_<rolle>_v<k>.bildtreue.json
```
- Exit 0 (PASS) oder 1 (HINWEIS): registrieren: `python3 $U/ad_return.py ziel --finding <Befund> --rolle <rolle> --bild $W/neu/<Befund>_<rolle>_v<k>.png --arbeit $W`
- Exit 3 (FAIL): **Reparatur**, höchstens 2 weitere Versuche: wieder von der Eingabedatei aus `$U` (nicht vom misslungenen Bild), Prompt enger auf den Bereich, die genannte Kachel/Abweichung ausdrücklich verbieten.
- Nach dem 3. FAIL: `python3 $U/ad_return.py verwerfen --finding <Befund> --grund "Bildtreue FAIL nach 3 Versuchen: <Grund aus dem JSON>" --arbeit $W`. Bei Bewegungsbefunden gilt das für den ganzen Befund (beide Rollen).
- `ad_bildtreue.py`, `ad_return.py`, `package.json`, Masken und alles unter `$P` nie ändern. WS0 prüft dieselbe Bildtreue beim Abholen noch einmal.

**5 · Texte je bearbeitetem Befund**
```
python3 $U/ad_return.py texte --finding <Befund> --aenderung "<ein Satz>" --bleibt "<ein Satz>" --warum "<Befund-Bezug>" --referenzen <ids aus dem Befund> --baubarkeit '<json wie in LEITPLANKEN.md: echtzeit_threejs, ein_licht_rig, keine_glanzpunkte, kein_neuer_text, figuren_unveraendert, komposition_gleich, seitenverhaeltnis_gleich, hud_aus_kit, neue_assets, hinweis>' --arbeit $W
```
`freigabe` und `abschluss` **nicht** aufrufen: Georg entscheidet im Hub, WS0 trägt es ein.

**6 · Ergebnis als Commit auf denselben Zweig**
- `$W/CODEX_BERICHT.md`: je Ziel eine Zeile (Ziel, Versuche, Bildtreue-Status mit Mittel/Kachel, Datei), verworfene Befunde mit Grund.
- Commit **nur** Dateien unter `$W/` (entwurf.json, `ziele/`, `neu/`, `*.bildtreue.json`, CODEX_BERICHT.md) auf den Zweig `ad/<run_id>`, Nachricht `AD <run_id> rueckgabe/<F>_l<n> (Codex)`. Push auf denselben Zweig; kein neuer Zweig, kein Pull Request, kein Force-Push, nichts außerhalb von `$W`.
- Antwort an Georg, eine Zeile: `Fertig: Familie <F> Lauf <n> · <x> Ziele Bildtreue ok · <y> verworfen · Commit <sha7>`. Schlägt der Push fehl: Commit lokal lassen und genau das in einer Zeile melden.

## Danach (WS0, nicht Codex)
1. Zweig holen (nur `ad/<run_id>/rueckgabe/<F>_l<n>/`), lokal unter `…/_privat/` ablegen.
2. `python3 tools/ad_ingest.py vorpruefung <W> --paket <lokales Paket> --aus <…/vorpruefung_<F>_l<n>>`: FAIL = verworfen (geht nicht zu Georg), HINWEIS = WS0-Blick.
3. Eine Hub-Karte je Designentscheidung (gebündelt, alle Ziele der Entscheidung nebeneinander, Bilder per SendUserFile).
4. Georgs Antwort eintragen: `ad_return.py freigabe --target … --status PASS|FAIL --wortlaut "<Hub-Antwort>" --zeit <Hub-Zeit> --arbeit <W>`, dann `ad_return.py abschluss --weg github --arbeit <W>` und `ad_ingest.py ingest <W>/kfb-ad-return_*.json --bilder <W> --aus …` (Bildtreue läuft dort erneut).

## Stand der Prüfung (24.11.2026, offizielle OpenAI-Doku)
- Bildgenerierung und -bearbeitung sind für Codex-App, CLI (`$imagegen`, `-i`) und IDE dokumentiert, mit Referenzbild und (in der App) „Bereich auswählen“; eine Maske als Datei oder Parameter, Cloud-Aufgaben und `codex exec` sind dafür nicht beschrieben. Darum Schritt 0 und Bildtreue-Prüfung statt Masken-Vertrauen.
- Keine feste Bildzahl: zählt auf die allgemeinen Codex-Limits (Bildzüge verbrauchen sie 3–5× schneller); im Free-Plan keine Bildgenerierung.
- Codex Cloud checkt Repos des verbundenen GitHub-Kontos aus und kann committen bzw. einen PR öffnen; die App kann committen, einen Zweig pushen und PRs anlegen. Push auf einen bestehenden, benannten Zweig ist nicht ausdrücklich dokumentiert (erster Lauf zeigt es).
- Quellen: https://developers.openai.com/codex/image-generation · https://developers.openai.com/codex/pricing · https://developers.openai.com/codex/cloud · https://developers.openai.com/codex/environments/local-environment · https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan
