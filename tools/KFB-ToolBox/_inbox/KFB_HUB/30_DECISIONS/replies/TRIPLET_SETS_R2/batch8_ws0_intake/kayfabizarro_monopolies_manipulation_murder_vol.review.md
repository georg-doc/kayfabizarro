# WS0-Intake · Monopolies, Manipulation & Murder Vol. II [kayfabizarro_monopolies_manipulation_murder_vol]

Quelle: `editorial/kfb-triplets-eight-decks-r2-2026-10-15 @31639721`, Kartentext `data/kfb-card-title-case-2026-10-15` @eade4aec (`media/kfb/Kayfabizarro_-_Monopolies,_Manipulation_&_Murder_Vol._II - ADD web.pdf.json`), Register @52adc8f1. PDF: `media/kfb/Kayfabizarro_-_Monopolies,_Manipulation_&_Murder_Vol._II - ADD web ID.pdf` (identisch mit der lokalen v05-Kopie, Git-Blob verglichen).

## Technik
- Python-Prüfskript (exakt, `triplet_set_check.py`) auf geliefertem `takes.csv`: **55 PASS / 0 FAIL** (Ausgabe: `kayfabizarro_monopolies_manipulation_murder_vol.check.ws0.txt`).
- `suno.txt`: **4018 Zeichen** (< 5000). Nach allen Fixes unten: **4674 Zeichen**. Alle Fix-Zeilen mit demselben Prüfskript nachgeprüft: 0 FAIL (`kayfabizarro_monopolies_manipulation_murder_vol.fixcheck.ws0.txt`).
- `takes.csv`, `suno.txt` und `hub.json` stimmen Zeile für Zeile überein; Skips stehen in `hub.json` mit `inTrack: false`.

## Intro
- Geliefert: „Monopolies, Manipulation & Murder Vol. II: The Riksbank, The BIS, The World Bank.“
- Urteil: **OK** – Titel steht auf dem Cover (dort „(2/2)“ statt „Vol. II“, Registertitel); 3 gedruckte Kartentitel.

## Opener
- 18 Opener, Dubletten: 0, Familienabstand ≥ 10: ja (heard: Have you heard of (Z. 30), Did you hear of (Z. 51) – Abstand 21; know: You know (Z. 6), Do you know (Z. 48) – Abstand 42)
- Harte Passungsregeln („I once met“, „Ever tasted“, „You played“): nicht benutzt.
- „What if“ (Z. 9, #8) steht vor einer Nominalgruppe ohne Verb und ohne „?“ – passt nicht; Fix in der Tabelle.
- Zeichensetzung nach Opener fehlt in 9 Zeilen (Konvention der Goldens: Komma nach Anyway/No wait/Before we continue/Meanwhile elsewhere/You with the card in your hand; Doppelpunkt nach Not a metaphor/Everyone agrees/This one has a rule; „?“ nach Titel+Begriff bei Have you heard of/Did you hear of/Do you know). In der Tabelle mit „Z“ markiert und im Fix enthalten.
- Alle acht Decks nutzen exakt denselben Opener-Fahrplan (gleicher Opener auf gleicher Zeilennummer, jede 3. Zeile). Regelkonform, aber die Passung zur Karte ist dadurch Zufall.

## Ausgelassene Karten
- #44 The Cashless Trap: **BERECHTIGT** – Druck S. 12 unten rechts (Web und Print) ist KI-Glyphensalat („POVSR: Elialoete sacnyeity …“), Lore am Kartenrand abgeschnitten. JSON-Text ist eine Rekonstruktion mit [UNCLEAR]. OPEN bleibt; keine Zeile.

## Zeilen
OK 38 · TUNE 17 · FAIL 0 · Z = nur Opener-Zeichensetzung

| Z. | # | Urteil | Geliefert | Befund | Fix (neuer Sprechtext) |
|---:|---:|---|---|---|---|
| 1 | Intro | OK | Monopolies, Manipulation & Murder Vol. II: The Riksbank, The BIS, The World Bank. | Titel steht auf dem Cover (dort „(2/2)“ statt „Vol. II“, Registertitel); 3 gedruckte Kartentitel. |  |
| 2 | 1 | OK | The Riksbank, Central Bank monopoly: physical gold for paper promises |  |  |
| 3 | 2 | TUNE | Remember Bank of England, Infinite liquidity out of nothing | Pointe fehlt. | Remember Bank of England, infinite liquidity out of nothing; sovereign debt into private profit. |
| 4 | 3 | OK | Banque de France, inflating opponents' assets until they burst |  |  |
| 5 | 4 | TUNE | Federal Reserve Act, National control to global market consolidation | Flach. | Federal Reserve Act, paradigm shift: empire runs on contracts and liabilities, not standing armies. |
| 6 | 5 | TUNE | You know The Fiat Flood, Devalue currency | Nur Etikett. | You know The Fiat Flood, devalue all currency; constant inflation to sustain illusion. |
| 7 | 6 | TUNE | Government Bonds, Lending capital for negative real returns | Pointe fehlt (pleite Staat verkauft IOUs). | Government Bonds, state crowdfunding: broke government sells IOUs to own citizens. |
| 8 | 7 | OK | The German Debt Clock, Permanent debt-drain; bankrupt states, central bank masters. |  |  |
| 9 | 8 | TUNE | What if The Taxation Illusion, Extract wealth via subsidies | „What if“ braucht Satz und Fragezeichen; Pointe fehlt. | What if The Taxation Illusion extracts wealth via subsidies? Taxes just maintain illusion money printer isn't running. |
| 10 | 9 | OK | J.P. Morgan's Magnet, Financial panic consolidates wealth; 1907 crisis, monopoly. |  |  |
| 11 | 10 | TUNE | The Pujo Committee Kabuki, Nullify Regulatory Investigation | Pointe fehlt (Kabuki). | The Pujo Committee Kabuki, nullify Regulatory Investigation; hearings merely paved way for Federal Reserve. |
| 12 | 11 | TUNE | Anyway Hjalmar Schacht, Double resources from authoritarian players | Flach. | Anyway, Hjalmar Schacht, markets love totalitarian regimes; Hitler's Banker. Capital has no morals. |
| 13 | 12 | TUNE | Union Banking Corp., Fund opponent's enemies | Flach. | Union Banking Corp., secretly fund opponent's enemies; Prescott Bush, Fritz Thyssen, fascist war machine. |
| 14 | 13 | OK | The BIS, Override national banking rules; least accountable organization on Earth. |  |  |
| 15 | 14 | OK · Z | No wait The IMF, Rescue bankrupt player, permanent infrastructure control |  | No wait, The IMF, Rescue bankrupt player, permanent infrastructure control |
| 16 | 15 | OK | The World Bank, Development loans never fully repaid |  |  |
| 17 | 16 | OK | The UN / League of Nations, Financial expansion as peacekeeping |  |  |
| 18 | 17 | OK · Z | Before we continue Liberty Loans, Civilian wealth into military debt; financed bloodshed of WWI. |  | Before we continue, Liberty Loans, Civilian wealth into military debt; financed bloodshed of WWI. |
| 19 | 18 | OK | The Versailles Truce, Pause conflict, double cost of next war |  |  |
| 20 | 19 | TUNE | Swiss Vault Neutrality, Store illicit wealth immune to audits | Pointe fehlt (Alpen aus Moral). | Swiss Vault Neutrality, illicit wealth immune to audits; Alps made of pure morality. |
| 21 | 20 | OK · Z | Not a metaphor The Ukraine Rebuild, Crisis privatizes state assets |  | Not a metaphor: The Ukraine Rebuild, Crisis privatizes state assets |
| 22 | 21 | OK | The Economic Hit Man, Loan ruins economy; fraudulent reports, bribery, extortion. |  |  |
| 23 | 22 | TUNE | Regime Change, Remove non-compliant leader | Pointe fehlt. | Regime Change, remove non-compliant leader; swiftly acquainted with harder arguments. |
| 24 | 23 | TUNE | The thing about Resource Extraction, Resource tokens from developing nation | Verb fehlt. | The thing about Resource Extraction, drain developing nation; true goal of development loans. |
| 25 | 24 | TUNE | The Privatization Vise, Indebted player sells public utilities | Pointe fehlt. | The Privatization Vise, indebted player sells public utilities; liberalization means stealing commons. |
| 26 | 25 | OK | IOR, Launder criminal wealth with divine immunity; blood-soaked history. |  |  |
| 27 | 26 | OK · Z | Everyone agrees Banco Ambrosiano Collapse, Debt offshore before collapse |  | Everyone agrees: Banco Ambrosiano Collapse, Debt offshore before collapse |
| 28 | 27 | TUNE | Roberto Calvi's Bridge, Problematic witness discarded | Pointe fehlt. | Roberto Calvi's Bridge, suicide problematic witness; silenced before he could sing. |
| 29 | 28 | OK | Michele Sindona's Espresso, Poison strongest asset; cyanide coffee in prison. |  |  |
| 30 | 29 | OK · Z | Have you heard of BCCI, Phantom loans cover illegal operations; bribery, trafficking, nuclear sales. |  | Have you heard of BCCI, phantom loans cover illegal operations? Bribery, trafficking, nuclear tech sales. |
| 31 | 30 | TUNE | The Price Waterhouse Blindfold, Ignore insolvency penalties | Flach. | The Price Waterhouse Blindfold, ignore insolvency; consulting firms deliberately ignored BCCI insolvent. |
| 32 | 31 | OK | Saddam's BNL Secret, Secret loans for weapons |  |  |
| 33 | 32 | TUNE | Let me tell you about Osama's Offshore Wallet, Untraceable shell company | Pointe fehlt. | Let me tell you about Osama's Offshore Wallet, untraceable shell company; CIA used BCCI to teach future enemies offshore finance. |
| 34 | 33 | OK | The $1.6 Trillion Wash, Illegal drug tokens into Wall Street capital |  |  |
| 35 | 34 | OK | The 2008 Buffer, Survive market collapse using underworld capital |  |  |
| 36 | 35 | OK · Z | This one has a rule The War on Drugs Loop, Expand Police State without reducing supply |  | This one has a rule: The War on Drugs Loop, Expand Police State without reducing supply |
| 37 | 36 | OK | CIA Flight Paths, Monopoly on black market logistics |  |  |
| 38 | 37 | OK | The Nixon Shock, Unpeg currency; gold standard abolished, fiat currency. |  |  |
| 39 | 38 | OK | Nobody warned us about Milton Friedman's Monetarism, Manipulate money supply, ignore social costs |  |  |
| 40 | 39 | OK | The Euro Snake, Bind opponents' economies; cannot escape crash. |  |  |
| 41 | 40 | OK | The ECB, Socialize Eurozone losses; absolute financial world domination. |  |  |
| 42 | 41 | OK | The deck insists on CBDC, Absolute control over rules of money; central bank. |  |  |
| 43 | 42 | OK | SWIFTNet Data Vacuum, Transaction data sanctions non-compliant players |  |  |
| 44 | 43 | OK | Crypto-Colonialism, Decentralised tech resubjugates nations |  |  |
| 45 | 45 | OK | Which brings us to Trudeau's Account Freeze, Freeze protesting players' assets |  |  |
| 46 | 46 | TUNE | GoFundMe Theft, Canfiscats opponent crowdfunding; redirect donations to charities. | Druckfehler „Canfiscats“ wird gesprochen. | GoFundMe Theft, opponent's crowdfunding donated to yourself; redirect donations to charities. |
| 47 | 47 | OK | PayPal's $2500 Fine, Extract fine for wrongthink |  |  |
| 48 | 48 | OK · Z | Do you know Financial Paternalism, Erase non-cooperative players; cease to exist financially. |  | Do you know Financial Paternalism? Erase non-cooperative players; cease to exist financially. |
| 49 | 49 | OK | The Greek Tragedy, Sell entire infrastructure; cradle of democracy in chokehold. |  |  |
| 50 | 50 | OK | Varoufakis vs. Draghi, Cut capital flow; retaliation for democratic referendum. |  |  |
| 51 | 51 | OK · Z | Did you hear of BRICS New Development Bank, Alternative system, exact same panopticon |  | Did you hear of BRICS New Development Bank? Alternative system, exact same panopticon. |
| 52 | 52 | OK | The Yield Vampire, Collapse bond yields; continuous expropriation of citizen. |  |  |
| 53 | 53 | OK | Occupy 2.0, Nullify Central Bank cards; true mass protest from below. |  |  |
| 54 | 54 | OK | Welcome to The El Salvador Glitch, Stop paying taxes; illusion that you fund government. |  |  |
| 55 | 55 | TUNE | The Physical Barter, Move assets offline | Pointe fehlt. | The Physical Barter, move assets offline; they cannot take physical away from you. |
| 56 | 56 | OK | The Sovereign Animal, Victory Condition: free man has no debt; cash is resistance. |  |  |
