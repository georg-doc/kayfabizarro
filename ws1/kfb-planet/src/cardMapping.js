// Kartenvertrag der Registry (kfb-deck-registry/v2, media/kfb/index.json): Seite = coverOffset + 1 + floor((n-1)/4).
// Ohne three, ohne DOM. Festgenagelt auf denselben Stand wie die Bilder (MEDIA_COMMIT).
import audit from './data/mapping-audit.json'

export const MEDIA_COMMIT = 'ac9dbaed2e5966a537a4bb719e8cd847dcc5e099'

// Ob die Zuordnung Karte -> Viertelseite stimmt, steht nicht in der Registry. Sie ist je Deck geprüft:
// scripts/audit-mapping.py liest jede Viertelseite mit Apple Vision und vergleicht den Titel mit dem Kartennamen.
// Nur Decks mit Status SAFE zeigen PDF-Bilder und dürfen in den Turm; alle anderen behalten den Platzhalter mit
// dem wörtlichen Kartentext. Beispiel UNSAFE: nibelungen_booster_pack_design (jede Karte um 4 verschoben,
// coverOffset 1 statt 0), suppressed_book_deck #13 (JSON „Harry Potter“, Bild „THE MANIPULATED MAN“).
export const MAPPING_AUDIT = audit
export const isMappingSafe = (deckId) => audit.media === MEDIA_COMMIT && audit.decks[deckId]?.status === 'SAFE'
export const safeDecks = () => Object.keys(audit.decks).filter(isMappingSafe)
