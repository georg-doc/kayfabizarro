/* FrizzleGraft v1 · headzones.v1 — DIE FARBZONEN DES KOPFES, FREI WÄHLBAR.  13.09.2026
 *
 * WOFÜR (Georg 13.09.): »ich brauche die ganzen Farben natürlich auch für den Kopf … ich kann das
 * Gesicht nicht färben … die Idee ist ja nicht, dass das wie ein Kostüm wirkt, sondern dass ich das
 * Gesicht gelb, blau, grün färben kann … und das gleiche gilt für Augen und Augenlider.«
 *
 * GEMESSEN AM GRAFT, bevor eine Zeile entstand (13.09., am laufenden Blatt):
 *   Kopf      EIN Netz `kfb-head`, 1500 Dreiecke, ZWEI Materialien —
 *             `Main` #f7cb00 (Schädel, Ohren, Zacken) und `Main_Light` #f6c19d (Gesicht, Schnauze).
 *   Auge      vier Netze je Seite — Sklera #f3ede2 (MeshPhysical), Pupille #070707,
 *             zwei Lider #ceaa20 (= abgedunkelte `baseColor` des Rigs).
 *   Nase      ein Netz, `MeshPhysicalMaterial` #17130f, Wert in `pet.nose.color`.
 *   Braue     ein Netz, ShaderMaterial (KEIN `color`-Feld — es geht NUR über `brow.set({color})`).
 *   Schnurrbart ebenso.
 *
 * DIE ENTSCHEIDUNG: dieses Modul erfindet keine zweite Wahrheit. Sechs der acht Zonen haben längst
 * einen Eigentümer im Eintrag (`graft.zones.bodyHex` · `graft.zones.faceHex` · `graft.roles.eyes` ·
 * `nose.color` · `brow.color` · `moustache.color`) — es SAGT nur, welche Zonen es gibt, wo ihr Wert
 * wohnt und wie er ankommt. Eigenes Eigentum hat es an genau zwei Dingen, die im geteilten Augen-Rig
 * hart stehen und deshalb dort nicht wählbar sind: **Augapfel und Pupille**.
 *
 * ⚠ WARUM DER ANSTRICH SICH AN `build()` HÄNGT: das Rig baut seine Augen bei jedem Farbwechsel,
 * jedem Pupillenstil und jedem Anker NEU. Ein einmal gesetztes Material wäre danach weg — derselbe
 * Grund wie bei `eyeoval.v1`. Der Wert kommt aus dem Eintrag, nicht aus einem gemerkten Zustand.
 */

export const SCHEMA = 'kfb.headzones/0.1';

/* Die Zonen des Kopfes. `where` ist der Ort im Eintrag — die Oberfläche liest und schreibt DORT. */
export const HEAD_ZONES = [
  { id: 'skull',  label: 'Kopf · Schädel, Ohren, Zacken', where: 'graft.zones.bodyHex', base: 0xf7cb00, via: 'applyZones · Material Main' },
  { id: 'face',   label: 'Gesicht · Schnauze',            where: 'graft.zones.faceHex', base: 0xf6c19d, via: 'applyZones · Material Main_Light' },
  { id: 'sclera', label: 'Augapfel',                      where: 'eye.sclera',          base: 0xf3ede2, via: 'headzones · Augen-Rig' },
  { id: 'pupil',  label: 'Pupille',                       where: 'eye.pupil',           base: 0x070707, via: 'headzones · Augen-Rig' },
  { id: 'lid',    label: 'Augenlider',                    where: 'graft.roles.eyes',    base: 0xf2c93c, via: 'rig.setBaseColor (Lid = abgedunkelt)' },
  { id: 'nose',   label: 'Nase',                          where: 'nose.color',          base: 0x17130f, via: 'nose.set' },
  { id: 'brow',   label: 'Augenbrauen',                   where: 'brow.color',          base: 0x17130f, via: 'brow.set' },
  { id: 'moust',  label: 'Schnurrbart',                   where: 'moustache.color',     base: 0x17130f, via: 'moust.set' },
];

const hexInt = (h) => (typeof h === 'string' ? parseInt(h.replace('#', ''), 16) : h);
export const toHex = (h) => '#' + ((h >>> 0) & 0xffffff).toString(16).padStart(6, '0');

/**
 * Augapfel und Pupille anstreichen. `null` = der Wert des Rigs bleibt stehen (gemessen: #f3ede2 /
 * #070707). Rückgabe ist ein Bericht: was gesetzt wurde, an wie vielen Netzen.
 */
export function paintEyes(rig, p) {
  if (!rig || !Array.isArray(rig.eyes) || !rig.eyes.length) return { status: 'KEIN_RIG' };
  const q = p || {};
  let sc = 0, pu = 0;
  for (const e of rig.eyes) {
    /* ⚠ GEMESSEN, nicht angenommen: das Rig hängt die Pupille als `e._puMesh` an, für den Augapfel
       gibt es KEINEN Griff (`_scMesh` existiert nicht — geprüft am laufenden Blatt). Er ist das
       einzige direkte Mesh-Kind der Augengruppe; Lider und Pupille hängen in Gruppen darunter.
       Über die Kind-REIHENFOLGE zu gehen wäre beim nächsten Bauteil ein stiller Fehler. */
    const sclera = e._scMesh || e.children.find((c) => c.isMesh && c !== e._puMesh);
    if (q.sclera != null && sclera && sclera.material && sclera.material.color) { sclera.material.color.setHex(hexInt(q.sclera)); sclera.material.needsUpdate = true; sc++; }
    if (q.pupil != null && e._puMesh && e._puMesh.material && e._puMesh.material.color) { e._puMesh.material.color.setHex(hexInt(q.pupil)); e._puMesh.material.needsUpdate = true; pu++; }
  }
  return { status: 'OK', sclera: sc, pupil: pu,
    note: sc + pu === 0 ? 'nichts gesetzt — beide Werte stehen auf »wie geliefert«' : null };
}

/** Einmal ans Rig hängen: nach jedem `build()` gilt wieder, was im Eintrag steht. */
export function attach(rig, get) {
  if (!rig) return { status: 'KEIN_RIG' };
  rig.__kfbHeadGet = get;
  if (!rig.__kfbHeadPatched) {
    const base = rig.build.bind(rig);
    rig.build = function (...a) {
      const r = base(...a);
      try { paintEyes(rig, rig.__kfbHeadGet ? rig.__kfbHeadGet() : null); } catch (e) { console.warn('[headzones]', e && e.message); }
      return r;
    };
    rig.__kfbHeadPatched = true;
  }
  return paintEyes(rig, get ? get() : null);
}

/** Was das Auge WIRKLICH trägt — gemessen, nicht behauptet. Der Beleg für die Leiste. */
export function scanEyes(rig) {
  if (!rig || !rig.eyes || !rig.eyes.length) return null;
  const e = rig.eyes[0];
  const sclera = e._scMesh || e.children.find((c) => c.isMesh && c !== e._puMesh);
  const hx = (m) => (m && m.material && m.material.color ? toHex(m.material.color.getHex()) : '—');
  const lidMesh = e._up && (e._up.isMesh ? e._up : e._up.children.find((c) => c.isMesh));
  return { sclera: hx(sclera), pupil: hx(e._puMesh), lid: hx(lidMesh) };
}

export default { SCHEMA, HEAD_ZONES, toHex, paintEyes, attach, scanEyes };
