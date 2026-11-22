// Aus 06-orrery/bands.ts, nur die zwei Datumsfunktionen, die parts.ts braucht (Zeilen 28 und 30, Typen entfernt).
export const dayOfYear = (date) => Math.min(364, Math.floor((Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 1)) / 86400000));
export const dayAngle = (day) => ((100.0 + day * (360 / 365.25)) * Math.PI) / 180;
