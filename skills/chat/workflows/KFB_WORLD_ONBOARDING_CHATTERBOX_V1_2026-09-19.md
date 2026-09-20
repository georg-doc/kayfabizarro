# KFB World Onboarding + Chatterbox v1

Status: **PLANNING ONLY · NO RUNTIME IMPLEMENTATION YET**  
Datum: 2026-09-19

## Ziel

Ein kleiner, lesbarer Einstieg in KFB Town: Lorekeeper begrüßt, ein Bewohner reagiert auf Ort oder Karte, und der Spieler erhält einen freiwilligen kleinen Botengang/Card-Quest statt eines Erklärtext-Walls.

## Erst Quellen prüfen

- KFB Town Living Document und Resident-Module
- vorhandene Triplet-/Resident-Prompts
- FrizzleBob Driver / GothGirl: exakte aktuelle Modelle, Rigs und Owner
- bestehende Chatterbox-/Tourbus- bzw. Dialog-Donors
- `skills/session-entry-use-what-works_v1.md`

Die drei Triplet-Namen werden nur aus der vorhandenen Quelle übernommen. **Bingo** und **Bongo** sind genannt; der dritte Name bleibt bis zum Quellennachweis offen.

## Erste Probe

1. Lorekeeper bietet einen einzigen Kontextsatz und zwei kurze Antworten.
2. Spieler sieht Karte oder Ort.
3. Ein Resident erinnert genau drei bestätigte Dinge.
4. Ein optionaler Mini-Auftrag führt zu einer sichtbaren Landmark/Card und zurück.
5. Erst dann: Duo-Auswahl FrizzleBob / GothGirl, wenn beide aktueller Rig-/Controller-Nachweis sind.

Dialoggrammatik: kurze Wahl → klare Antwort → sichtbare Folge → Rückkehr. Sie ist eigenständig formuliert und übernimmt keine fremden Texte oder Systeme.

## Grenzen

- Keine Zahlungs-, Geburtstags-, Elisa- oder Onboarding-Daten in dieser öffentlichen Spiel-/Hub-Slice.
- Keine neuen LLM-/Memory-Systeme ohne vorhandene Eigentümer-/Datengrenze.
- Kein zweites Dialogsystem neben nachgewiesenem Chatterbox-Donor.
