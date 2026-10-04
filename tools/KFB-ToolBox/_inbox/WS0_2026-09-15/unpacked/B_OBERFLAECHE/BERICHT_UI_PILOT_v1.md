# Ergebnis B · Teil 2 · Der UI-Pilot
*15.09.2026 · `KFB ToolBox Pilot v1.dc.html` · Eine Hülle, dieselben Module, der Prüfablauf als
Schrittfolge. Gemessen, nicht behauptet; was nicht gemessen ist, steht unten als solches.*

## In einem Satz
**Der Prüfablauf geht jetzt in einem Werkzeug durch** — Carl wählen, Originalnase einstellen, eine
benannte Materialzone färben, Talk und Ruhe prüfen, Profil ausgeben — und der Feldbeleg, den
Ergebnis A offen gelassen hat, steht als Fläche im Export-Schritt.

## Was der Pilot **nicht** ist
Er baut **keine Figur selbst und kennt keine eigenen Zahlen.** Carl kommt aus
`lab-v6/carlrig-mount.v1.js#mountCarl`, der Graft aus `frizzlegraft-v1/graft-mount.v1.js#mountGraft`,
die Gesichtsmodule aus `faceMods()` — dieselben Dateien, die Studio und Rigging Lab laden.
Keine Designsystem-Bibliothek, kein Framework-Wechsel, keine neue Rig- oder Materialwahrheit.
Er ist auch **kein Ersatz** für Studio oder Rigging Lab: die tragen weiter Georgs Arbeit.

## Die Navigation ist die Arbeitsfolge
**Select → Shape & Look → Attach & Fit → Motion & Talk → Export.** Links die Auswahl, mittig eine
durchgehende Bühne, rechts der Inspector zum Schritt, unter der Bühne die Kamerastellungen.

| Kritikpunkt | Antwort im Piloten |
|---|---|
| 1 · kein erster Schritt | **Select** ist Schritt 1; die Actor-Liste links ist der **einzige** Ort, an dem gewählt wird |
| 2 · Talk liegt im anderen Werkzeug | **Motion & Talk** benutzt `PetMouth.talk()` und `talkBurst()` aus dem geteilten Modul — kein zweiter Sprechweg |
| 3 · Zone hinter allem | **Form** und **Colour · 21 zones** sind zwei Unterreiter. Die Zone ist **einen Klick** entfernt, nicht einen Scroll |
| 4 · 21 freie Farbwähler | Kuratierte Palette aus **gemessenen** Projektwerten, lesbarer Hexwert je Zone, **Original** und **Hide** je Zone, Filterfeld über die Namen |
| 5 · 89 von 125 Elementen unter 24 px | **0 von 248** unter 24 px. Regler 32 px hoch, Zahlenfeld daneben statt feinerem Griff |
| 6 · vier Schriftfamilien | Roboto in der ganzen Bedienung, Roboto Mono **nur** für Meßwerte. Keine Brand-Schrift, die Wortmarke ist eine eigene Fläche |
| 7 · `Load\\u2026` | existiert hier nicht |
| 8 · Ausgabe unterscheidet nichts | Vier benannte Ausgaben, jede mit einem Satz über ihren **tatsächlichen** Inhalt; die zwei nicht gebauten stehen als **Not built** da, statt zu fehlen |
| 9 · kein Hinweis auf ungespeichertes | Anzeige in der Kopfzeile: `in sync` / `unsaved changes` / `saved`, plus **Revert** |
| 10 · Feldbeleg unsichtbar | **Field coverage** im Export-Schritt: `+ angewandt` grün, `! abgewiesen` rot mit Begründung — direkt aus `report.applied` / `report.rejected` des Lesers |

## Gemessen
| | |
|---|---|
| HTTP-Ausfälle beim Start | **0** |
| Bedienelemente unter 24 px | **0 von 248** (Rigging Lab: 89 von 125) |
| Carl | mountet, **21 benannte Zonen** vom Leser gemeldet |
| FB-Driver-Graft | mountet über denselben Weg, Gesicht, Waffe, Jacke stehen |
| Zonenfarbe | trifft **genau eine** Insel — eine Braue gelb gefärbt, die andere unberührt |
| Nasen-Kalibrierung | Georgs Werte kommen an: **1,340 / −0,020 / −0,066** in den Reglern und Zahlenfeldern |

**Drei Dinge, die der Auftrag ausdrücklich verlangt, und wie sie gelöst sind:**
- **Kein geteilter Materialcache.** Eine Zonenfarbe klont das Material **dieser** Insel einmal und
  setzt danach nur noch den Farbwert. Nachweis oben: eine Braue gelb, die andere unverändert.
- **Kein zweiter Mixer.** Vor jedem Bau wird der alte Bewohner über sein eigenes `dispose()` entsorgt.
- **Tippen bewegt die Welt nicht.** OrbitControls hängen an `renderer.domElement`, nicht am Dokument —
  das ist bauartbedingt, nicht per Sonderregel.

## Schritt 1 trägt die Herkunft
Der Inspector ist kontextabhängig, also darf er im ersten Schritt nicht leer sein. Er zeigt dort,
woher die Figur kommt — **Reader · Contract · Schema · Entry · Class · Islands · Mouth set · Fields**
(angewandt / abgewiesen) — und direkt darunter die offene Look-Frage. Wer einen Actor wählt, sieht
im selben Moment, welcher Leser ihn baut und aus welcher Datei.

## Ein Befund, den der Pilot sichtbar gemacht hat — und die Entscheidung dazu
**Carl ist DocCheck-Rot, `#c03`, weil der Vertrag es sagt.** Der Pilot zeigt den Wert neben der Zone
»capsule (body)«; die Quelle ist `petstudio-v9/kfb-pet-capsule-carl.json`.

**Entschieden (Georg, 15.09.): der Vertrag gewinnt.** Die Werkbanksitzung `kfb.carl.rig.v6.3` ist ein
**lokaler Entwurf**, keine zweite Wahrheit. Ein sandfarbener Carl im Rigging Lab ist dieser Entwurf,
nicht der ausgelieferte Look.

**Folge für die ToolBox:** wer Carl ausliefert, liest den Vertrag. Eine Sitzung darf ihn im
Authoring überstimmen, aber nie in einem Consumer-Paket — und die Oberfläche muß sagen, welcher
von beiden gerade gilt. Der Pilot sagt es an der Stelle, an der der Actor gewählt wird.

**Nicht angefaßt:** Georgs Werkbanksitzung. Der sandfarbene Stand im Rigging Lab bleibt, wie er ist,
bis du ihn ausdrücklich angleichen willst — eine Messung oder eine Entscheidung löscht keinen
Entwurf.

## Sitzung — was der Pilot anfaßt
**Nur seinen eigenen Schlüssel `kfb-toolbox-pilot-v1`.** `kfb-pet-studio-v5`, `kfb.carl.rig.v6.3`
und `kfb-lab-v2:ui` bleiben unberührt. Der Pilot kann Georgs Arbeit nicht überschreiben.

## Nicht gemessen, nicht behauptet
- **Die vier Prüfgrößen** (1440×900 · 1024×768 · 768×1024 · 390×844), geteiltes Fenster, Browserzoom.
  Das Layout ist fluid gebaut (`flex`, `minmax`, keine festen Breiten außer den beiden Spalten), aber
  gebaut ist nicht gemessen. Für schmale Fenster fehlt noch der Drawer-Weg — dort stehen heute drei
  Spalten nebeneinander.
- Tastaturweg und Fokusreihenfolge (Fokusring ist gesetzt, der Weg ist nicht durchgegangen).
- Zweiter Reiter, Wiederaufnahme aus der eigenen Sitzung.
- Der unabhängige Embed als letzter Schritt des Prüfablaufs — das Profil fällt heraus, geladen wurde
  es dort noch nicht.
- Consumer-Paket und Video sind **nicht gebaut** und als nicht gebaut gekennzeichnet.

## Drei nächste Schritte
1. **Schmales Fenster:** ein Drawer je Spalte statt drei gestauchter Spalten, dann die vier
   Prüfgrößen wirklich messen.
2. **Den Ablauf schließen:** das ausgegebene Profil im unabhängigen Embed laden und die
   Darstellung gegenüberstellen — damit ist der Prüfablauf des Auftrags vollständig durchgespielt.
3. **Die Carl-Frage entscheiden** (Vertrag oder Werkbanksitzung), danach die Hülle auf Rigging Lab
   und Animation Lab übertragen — dieselbe Oberfläche, nicht eine zweite.
