// Freiflächen für Module, die selbst Boden zeigen (z. B. das Karten-Relief): der Bewuchs lässt diese Rechtecke frei.
// Einträge { x, z, hw, hd, pad }; hw/hd = halbe Breite/Tiefe in m, pad = Saum ohne Bewuchs.
export const KEEPOUT = []
export const inKeepout = (x, z) => KEEPOUT.some((r) => Math.abs(x - r.x) < r.hw + (r.pad || 0) && Math.abs(z - r.z) < r.hd + (r.pad || 0))
