# Postmortem · ToolBox / FB_CANON · 22.10.2026

**Status: Umsetzung auf ausdrücklichen Wunsch Georgs PAUSIERT.** Dieses Dokument ist Fehleranalyse und Übergabe, keine Freigabe für einen weiteren Umbau.

## Ergebnis und Verantwortung
Die angeforderte Übernahme einer bereits konfigurierten Figur ist in wiederholte, nicht abnahmefähige Darstellungen und lokale Rekonstruktionsversuche abgedriftet. Georg musste bekannte Anforderungen erneut erklären und zusätzliche Kosten tragen. Die Verantwortung für diese Ausweitung und die unzureichende visuelle Prüfung liegt bei WSA.

Der eigentliche Auftrag war begrenzt: Georgs vorhandene Figur samt Gesicht, Mund, Rig und Abstimmungen bewahren, die freigegebenen Knete-/E2-Lidmodule korrekt verwenden und eine passende Oberfläche zeigen. Es war kein Auftrag, die Figur neu zu gestalten, Konfigurationen neu zu erfinden oder den gesamten Figurenbestand neu aufzubauen.

## Verlauf
| Schritt | Tatsächliches Ergebnis | Fehlentscheidung |
| --- | --- | --- |
| P08 / Exportweg | Eine Quellen-JSON mit Rig-Augen, Brauen −0,08 und Pitch 8; GLB-Export/Neuimport technisch eingerichtet | Der Beleg für die vollständige sichtbare Figur wurde nicht gleichwertig zum Transport geprüft |
| R2 | Höhe 1,81 m und Clips technisch geprüft; alte v6-Lidschalen, Mund-Schmierfleck | Technische Korrektheit wurde zu stark als Zeichen der Produktreife gewertet |
| R3 | E2-Geometrie übernommen, alte Shells entfernt; Mundträger entfernt; breite Glättung am Kopf | Mundanker und Rezept wurden als ausreichender Ersatz für einen tatsächlich sichtbaren Mund behandelt |
| R3-Abnahme | Georg: starkes Lidrelief, Kopf ohne passende Textur, Mund fehlt → FAIL | Die vorangegangene unabhängige Sichtprüfung erkannte diese klar sichtbaren Produktfehler nicht ausreichend |
| Lokale Nahbildversuche | Mehrere Material-/Mundträger-Versuche; noch keine gültige Neun-Bilder-Reihe | Statt zuerst den konfigurierten Ausgangsstand vollständig zu bewahren, wurden weitere Darstellungsparameter und Träger angepasst |
| Pause | Georg verlangt Konsolidierung, einschließlich Kit-Characters, Pencil und Eraser | Kein weiterer Reparaturlauf; Zwischenstand wird quarantänisiert |

R3-Hash `17e20ab4293206366381378a3addb9e17599a658a021c51cd1d18e8b7a75a256` ist **verworfen**, kein FB_CANON-Kandidat. R2 ist ebenfalls verworfen. Die technischen Messungen bleiben Belege, keine visuelle Freigabe.

## Ursachen
1. **Konfiguration und Darstellung nicht sauber getrennt.** Basis-GLB, gespeicherte ToolBox-Werte, Figurenkarte und Laufzeitmodule wurden nicht als zusammengehörige, bereits vorhandene Figur verifiziert. Ein geladenes Basis-GLB allein stellt Georgs Figur nicht wieder her.
2. **Lokale Fehlerbehebung veränderte das Produkt.** Das Entfernen des Mundträgers löste einen sichtbaren Fehler durch Funktionsverlust. Die breit angelegte Clean-Region entfernte auch gewünschte Kopftextur. Beide Veränderungen hätten vor einer Übergabe auffallen müssen.
3. **Keine verbindliche Parität zwischen Kopf und Lidern.** Gleicher Materialname und freigegebene Geometrie bewiesen weder gleiche sichtbare Reliefgröße noch eine passende gemeinsame Oberfläche.
4. **Vorschau und tatsächliche Laufzeit wichen auseinander.** Im GLB-Neuimport war der Mund nicht wieder sichtbar an das Modul angeschlossen. Anker und Metadaten allein sind kein Nachweis für einen funktionierenden Mund.
5. **Veralteter Modulcache erschwerte die Diagnose.** Ein veraltetes Clay-Modul wurde zunächst weiter verwendet. Das war ein realer technischer Befund, rechtfertigte aber weder die breite Kopfglättung noch eine visuelle Freigabe.
6. **Figurenbestand nicht als vollständige Migration abgesichert.** Die aktuelle lokale ToolBox mischt feste Figurenliste, vier gebündelte Karten und einen älteren Resident-Szenenindex. Die auf dem Register vorhandenen 13 Karten werden nicht automatisch vollständig im Studio angeboten. Das erklärt eine konkrete Bestandslücke; es beweist noch nicht, wo jede früher gespeicherte Konfiguration liegt.
7. **Zu viele Schleifen vor einer einfachen Sichtprüfung.** Material, Export und Munddarstellung wurden in zu vielen Schritten verändert. Fehler der Umsetzung wurden damit wiederholt an Georg als neue Abnahmeaufgabe weitergereicht.

## Was erhalten blieb
- Die P08-Quellen-JSON ist unverändert: SHA-256 `8b7ac319a0ba9c4b9cdce5fddc738a35d85a8dc517b6f1f40585c378fc843ce9`.
- Keine Live-Veröffentlichung dieser Arbeiten; Sites-Metadaten melden weiterhin ToolBox v11.
- Keine Umstellung der kanonischen FrizzleBob-Figurenkarte auf R2/R3.
- In den jüngsten lokalen Versuchen wurde keine neue GLB exportiert. Die angeforderte Nahbildreihe wurde nicht fertiggestellt.
- Fehlversuche und Quelländerungen sind erhalten, als unfreigegeben markiert. Der eigene Prüftab ist geschlossen und der eigene lokale Prüfserver beendet.
- Ohrreduktion wurde nicht begonnen.

## Kosten und Prozesskorrektur
Zusätzliche Token und Georgs Prüfzeit wurden durch vermeidbare Rekonstruktion, wiederholte Diagnose und unzureichende Produktprüfung verbraucht. Eine belastbare Zahl für diesen einzelnen Teilauftrag liegt nicht vor; es wird keine Kostenschätzung erfunden.

Für eine spätere, ausdrücklich freigegebene Wiederaufnahme gilt:
- Zuerst vorhandene Konfigurationen wiederfinden und ihren unveränderten Ausgangsstand belegen.
- Vorhandene Figuren und Module konsolidieren; keine fehlende Auswahl durch neue Ersatzfiguren auffüllen.
- Eine sichtbare Figur vor/nach einer eng begrenzten Material-/Moduländerung vergleichen. Fehlender Mund oder verlorene Kopftextur sind sofortiger FAIL.
- Den Figurenbestand separat vollständig abgleichen. Eine kleine FrizzleBob-Reparatur darf keine unbemerkte Verkleinerung des Studios festschreiben.
- Erst ein stimmiges Nahbild mit sichtbarem Mund und Augen offen/halb/zu; danach, nur bei gesonderter Freigabe, Export und weitere Ansichten.
- Technische Tests und unabhängige Prüfer ersetzen Georgs visuelle Abnahme nicht.

## Quellen / Anschluss
Aktueller Konsolidierungsreport: `WSA_TO_WS0_TOOLBOX_CONSOLIDATION_STATUS_R1.md`.
R3-FAIL-Return: `WSA_TO_WS0_FB_CANON_R3_RETURN.md` (FAIL-Markierung in Register-Commit `5585985a8ad2481be28d1d31db0c62cfb07d4c63`).
Letzte geprüfte WS0-Anweisung: `WS0_TO_WSA_COMBAT_ARENA_R2.md`, Abschnitt V-669. Register-Snapshot `00bce086c5426cbe68f074a92f6dbdd028c0701a` enthielt noch keine neuere Antwort zum R3-FAIL.
