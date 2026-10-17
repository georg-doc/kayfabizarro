// KFB Cologne Race · HUD authoring seam · kfb.racer-hud-theme/1
//
// Vorher standen alle Masse und Farben als literale Werte in ~40 style-Attributen
// verteilt; die --ui-* CSS-Variablen im Markup hatten NIE einen echten Wert, nur
// ihren Fallback (var(--ui-a, #FFA97A) und #FFA97A war zugleich Anfang und Ende).
// Dieses Modul ist die eine Stelle, die HUD-Praesentation traegt. Renn-Zustand
// (Runde, Bestzeit, Tempo, Musik, Karte, Einstellungen) bleibt in der Komponente —
// dieses Modul kennt keinen einzigen Rennwert.
export const HUD_LAYOUT_SCHEMA = 'kfb.racer-hud-theme/1';

// Die aktuelle, bereits gebaute Komposition — jeder Wert 1:1 aus dem Markup
// abgeschrieben. Umschalten auf diesen Eintrag darf am Bild NICHTS aendern.
export const HUD_CURRENT = {
  id: 'HUD_CURRENT', label: 'Aktuell',
  insetX: '16px', insetY: '14px', insetBottom: '16px',
  gapSm: '9px',
  iconBtnSize: '46px', iconBtnInnerSize: '32px',
  panelRadius: '16px', chipRadius: '11px', roundRadius: '50%',
  speedoSize: '104px', speedoRingThickness: '13px',
  mapSize: '104px', radioHeight: '46px', radioGap: '6px', radioTitleWidth: '124px',
  panelBlur: '8px',
  colorPeach: '#FFA97A', colorPeachHi: '#FFC3A2', colorPeachLo: '#B87B60', colorPeachInk: '#3A2416',
  colorInk: '#F6F4FA', colorCream: '#D6CFEA', colorDim: '#8478A6',
  colorPanel: 'linear-gradient(180deg,#C6B8E4 0%,#A895D2 62%,#6E5C9E 100%)',
  colorWell: 'linear-gradient(180deg,#221A33 0%,#3D3359 100%)',
  colorGlass: 'rgba(42,34,63,.88)',
  typeClockSize: '24px', typeLapSize: '22px', typeBestSize: '10px',
  typeSpeedSize: '30px', typeUnitSize: '8px',
};

// Erste Claude-Design-Abstimmung derselben Komposition: etwas grosszuegigere
// Antipptreffer (46->50px), sichtbarer Fokusring per dickerer Kontur, minimal
// mehr Kartenluft. Keine neue Anordnung, keine neue Farbe.
export const HUD_CLAUDE_2026_09_23 = {
  ...HUD_CURRENT,
  id: 'HUD_CLAUDE_2026_09_23', label: 'Claude · 23.09.',
  iconBtnSize: '50px', iconBtnInnerSize: '34px',
  panelRadius: '18px', chipRadius: '12px',
  speedoSize: '112px', speedoRingThickness: '14px',
  mapSize: '112px', radioHeight: '50px',
  panelBlur: '10px',
  typeSpeedSize: '32px',
};

export const HUD_PRESETS = [HUD_CURRENT, HUD_CLAUDE_2026_09_23];

const VAR_MAP = {
  insetX: '--kfb-inset-x', insetY: '--kfb-inset-y', insetBottom: '--kfb-inset-bottom',
  gapSm: '--kfb-gap-sm',
  iconBtnSize: '--kfb-icon-btn', iconBtnInnerSize: '--kfb-icon-btn-inner',
  panelRadius: '--kfb-radius-panel', chipRadius: '--kfb-radius-chip', roundRadius: '--kfb-radius-round',
  speedoSize: '--kfb-speedo-size', speedoRingThickness: '--kfb-speedo-ring',
  mapSize: '--kfb-map-size', radioHeight: '--kfb-radio-h', radioGap: '--kfb-radio-gap', radioTitleWidth: '--kfb-radio-title-w',
  panelBlur: '--kfb-panel-blur',
  typeClockSize: '--kfb-type-clock', typeLapSize: '--kfb-type-lap', typeBestSize: '--kfb-type-best',
  typeSpeedSize: '--kfb-type-speed', typeUnitSize: '--kfb-type-unit',
};
// Farbrollen sind hier absichtlich MIT aufgefuehrt (siehe HUD_CURRENT/HUD_CLAUDE_2026_09_23
// oben) - die Race-Palette bleibt aber die Quelle der Wahrheit fuer --ui-*. applyHudTheme
// setzt keine Farbe; der Aufrufer ruft nach einem Presetwechsel applyUiVars()/
// applyPaletteVars() erneut auf, damit die aktive Palette immer gewinnt.

// Auf ein DOM-Element anwenden (rootRef) — kein Template-Hole, weil Theme-Werte
// hier ausdruecklich per JS gesetzt werden, nicht in Markup-Literalen gehalten.
export function applyHudTheme(el, theme) {
  if (!el) return;
  for (const [key, cssVar] of Object.entries(VAR_MAP)) {
    if (theme[key] != null) el.style.setProperty(cssVar, theme[key]);
  }
}
