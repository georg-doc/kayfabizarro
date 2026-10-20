/* KFB Town Resident Atlas · ATLAS-EIGENE GEOMETRIE (candidate-only)
   ==================================================================
   ACHTUNG, das ist eine Grenze, die dieses Projekt bis S35 nie überschritten hat: alles
   hier ist VON MIR AUTHORED, nicht von Kay Lousberg. Bis jetzt hat der Atlas ausschließlich
   Pack-Assets platziert und gemessen; dieses Modul erzeugt Geometrie. Jedes Objekt daraus
   ist im Rezept als `gen:` ausgewiesen und im Panel als „Atlas-eigen" beschriftet, damit im
   Recipe-JSON und in jedem Screenshot unterscheidbar bleibt, was aus dem Pack kommt und was
   nicht. Kein Pack liefert ein Smartphone — das ist die einzige Begründung dafür.

   GRÖSSEN SIND ABGELEITET, NICHT GETIPPT: sie hängen am gemessenen FAUSTRADIUS der Figur
   (Rig_Medium, linke Hand, über die Skinning-Formel an der GEPOSTEN Haut gemessen:
   0,311 bei prot_b/Idle_A, 0,323 bei prot_a/Holding_B).

   DIE LÄNGE IST KORRIGIERT UND JETZT BEGRENZT, NICHT GEWÄHLT (Sonde 11/12). Der erste
   Stand war 2,40 Radien lang — ein Gerät von 0,72 bei einem gemessenen Unterarm von 0,334.
   Doppelt so lang wie der Unterarm, und genau deshalb steckte es beim hängenden Arm im
   Oberschenkel: bei prot_b/Idle_A waren 43 Gerätepunkte im Wirt und die Unterkante 0,167
   über Grund. Gemessen pro Länge (Anteil durchdringungsfreier Varianten bei prot_b):
   1,35 Radien 18/18 · 1,55 15/18 · 1,75 13/18 · 1,95 12/18 · 2,40 12/18.
   Neue Vorgabe: 1,45 lang, 1,12 breit, 0,22 dick — bei r = 0,32 ein Gerät von
   0,36 × 0,47 × 0,07. Seitenverhältnis 1,29 : 1, also stämmiger als ein echtes Handy
   (etwa 2,1 : 1). Das ist eine ENTSCHEIDUNG und keine Messung: die Figuren sind
   chibi-proportioniert — der gemessene Faustradius 0,32 ist fast so groß wie der ganze
   Unterarm 0,334 —, und ein maßstäblich schlankes Gerät wäre in dieser Faust unsichtbar.
   Die Kamerabuckel-Silhouette trägt die Lesbarkeit, nicht das Seitenverhältnis. */

import * as THREE from 'three';

/* Abgerundete Platte aus einer Box mit angeschrägten Kanten — kein Bevel-Modifier zur Hand,
   also über ein ExtrudeGeometry mit abgerundetem Profil. Zwei Meshes: Gehäuse und Bildschirm,
   getrennt, damit die Farben im Rezept einzeln gesetzt werden können. */
function roundedPlate(w, h, t, r, seg = 4) {
  const s = new THREE.Shape();
  const x = w / 2 - r, y = h / 2 - r;
  s.moveTo(-x - r, -y);
  s.lineTo(-x - r, y);
  s.quadraticCurveTo(-x - r, y + r, -x, y + r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x + r, y + r, x + r, y);
  s.lineTo(x + r, -y);
  s.quadraticCurveTo(x + r, -y - r, x, -y - r);
  s.lineTo(-x, -y - r);
  s.quadraticCurveTo(-x - r, -y - r, -x - r, -y);
  const g = new THREE.ExtrudeGeometry(s, { depth: t, bevelEnabled: true, bevelThickness: t * 0.28,
    bevelSize: t * 0.28, bevelSegments: 2, curveSegments: seg });
  g.translate(0, 0, -t / 2);
  g.computeVertexNormals();
  return g;
}

/* Smartphone. Lokale Achsen nach der Pack-Konvention für flache Requisiten:
   LANGACHSE auf +Y (wie Schwert, Streitkolben, Stab — die Familie, für die die
   Identitätsregel belegt ist), Bildschirm-NORMALE auf +Z, Breite auf X.

   PIVOT: in der MITTE des Körpers, nicht auf der Rückseite. Der alte Kommentar behauptete
   „Mitte der Rückseite“, die Geometrie war aber über `translate(0, 0, -t/2)` mittig — eine
   Behauptung im Kommentar, die der Code nicht einhielt. Mittig bleibt es auch, weil die
   Schub-Werte der Rezepte GEGEN diese Geometrie gemessen sind; eine Pivot-Verschiebung
   jetzt würde jede gemessene Zahl um t/2 verfälschen. */
export function makePhone(opts = {}) {
  const r = opts.fistRadius ?? 0.30;
  const w = (opts.width ?? 1.12) * r;
  const h = (opts.height ?? 1.45) * r;
  const t = (opts.thickness ?? 0.22) * r;
  const body = opts.color ?? '#3a3f4b';
  const screen = opts.screen ?? '#9fd8ff';
  const g = new THREE.Group();
  g.name = 'Phone';

  const shell = new THREE.Mesh(
    roundedPlate(w, h, t, Math.min(w, h) * 0.22),
    new THREE.MeshStandardMaterial({ color: new THREE.Color(body), roughness: 0.42, metalness: 0.08 })
  );
  shell.name = 'Phone_Shell';
  g.add(shell);

  /* Bildschirm als eigene, leicht kleinere Platte 0,3 mm vor der Vorderfläche — emissiv,
     damit er auch in der neutralen Atlas-Beleuchtung als Bildschirm lesbar ist. Derselbe
     Kunstgriff wie die `4GTN_glow`-Meshes des Packs: Leuchten ist ein eigenes Mesh. */
  const sw = w * 0.82, sh = h * 0.78;
  const sc = new THREE.Mesh(
    roundedPlate(sw, sh, t * 0.24, Math.min(sw, sh) * 0.16),
    new THREE.MeshStandardMaterial({ color: new THREE.Color(screen), roughness: 0.18,
      emissive: new THREE.Color(screen), emissiveIntensity: 0.55 })
  );
  sc.name = 'Phone_Screen';
  sc.position.set(0, h * 0.02, t * 0.56);
  g.add(sc);

  /* Kamerabuckel hinten oben — die eine Silhouettenmarke, die ein Handy von einer Platte
     unterscheidet. Ohne sie ist das Gerät von hinten ein Rechteck. */
  const cam = new THREE.Mesh(
    roundedPlate(w * 0.3, h * 0.16, t * 0.5, w * 0.07),
    new THREE.MeshStandardMaterial({ color: new THREE.Color(body).multiplyScalar(0.72), roughness: 0.35 })
  );
  cam.name = 'Phone_Camera';
  cam.position.set(-w * 0.22, h * 0.34, -t * 0.62);
  g.add(cam);

  g.userData.generated = { kind: 'phone', fistRadius: r,
    size: [+w.toFixed(4), +h.toFixed(4), +(t * 1.56).toFixed(4)], body, screen,
    ratios: [opts.width ?? 1.12, opts.height ?? 1.45, opts.thickness ?? 0.22],
    convention: 'Langachse +Y, Bildschirm-Normale +Z, Pivot mittig im Körper',
    laengeGedeckelt: 'Länge 1,45 Radien — über 1,55 steigt die Durchdringung am hängenden Arm messbar (Sonde 11)' };
  return g;
}

export const GENERATORS = { phone: makePhone };
