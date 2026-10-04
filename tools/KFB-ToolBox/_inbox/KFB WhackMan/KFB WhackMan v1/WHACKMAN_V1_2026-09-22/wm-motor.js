/* KFB WhackMan v1 · MazeMotor
   Brief §7. Drei Stufen, absichtlich getrennt, damit später ein FPS-Adapter möglich ist, ohne
   die Bewegung anzufassen:

     Input → MovementIntent → MazeMotor → player transform
     player transform → CameraFollowTarget → OrbitControls

   Der Motor kennt NUR den MazeGraph. Er sieht keine Wand, wirft keinen Strahl und fragt keine
   Requisite. Eine Bewegung ist eine Kante des Graphen, nicht eine Kollision mit einem Mesh —
   deshalb kann eine Fackel nie unsichtbar den Weg sperren. */

export const VEC = { N: [0, -1], E: [1, 0], S: [0, 1], W: [-1, 0] };
export const OPP = { N: 'S', S: 'N', E: 'W', W: 'E' };
const kOf = (x, y) => x + ',' + y;

/* Weltrichtung → Kardinalrichtung. Der Rohvektor ist kamerarelativ (siehe cameraIntent);
   hier wird er auf die einzige Achse gelegt, die der Graph kennt. Kein Diagonalschnitt. */
export function toCardinal(vx, vz, deadzone = 0.28) {
  if (Math.hypot(vx, vz) < deadzone) return null;
  return Math.abs(vx) >= Math.abs(vz) ? (vx > 0 ? 'E' : 'W') : (vz > 0 ? 'S' : 'N');
}

/* Kamerarelativ: die Tasten meinen „weg von der Kamera / nach rechts im Bild", nicht Weltnorden.
   Die Kamera dreht den Spieler dabei NICHT — sie übersetzt nur seine Absicht.

   Die erste Fassung rechnete den Yaw-Winkel aus der Blickrichtung zurück und drehte den
   Tastenvektor damit. Das war eine Drehung zu viel und um das falsche Vorzeichen: bei der
   Startkamera (südlich, Blick nach Norden, camYaw = π) wurde aus „vorwärts" SÜDEN — und Süden
   ist dort Wand, also tat die erste Taste, die jemand drückt, gar nichts. Der Fehler war bei
   Yaw 0 unsichtbar, deshalb hat er überlebt.

   Richtig ist: die Kamera LIEFERT die Vorwärtsrichtung schon. Nicht zurückrechnen, benutzen. */
export function cameraIntent(keys, camDirX, camDirZ) {
  let fx = 0, fz = 0;
  if (keys.up) fz -= 1;
  if (keys.down) fz += 1;
  if (keys.left) fx -= 1;
  if (keys.right) fx += 1;
  if (!fx && !fz) return { vx: 0, vz: 0 };
  const L = Math.hypot(camDirX, camDirZ) || 1;
  const fwdX = camDirX / L, fwdZ = camDirZ / L;      // weg von der Kamera
  const rightX = -fwdZ, rightZ = fwdX;               // 90° im Uhrzeigersinn davon
  return { vx: rightX * fx - fwdX * fz, vz: rightZ * fx - fwdZ * fz };
}

export class MazeMotor {
  constructor(graph, opts = {}) {
    this.graph = graph;
    this.speed = opts.speed ?? 2.7;          // Zellen pro Sekunde
    this.bufferCells = opts.bufferCells ?? 0.55;
    this.node = opts.start || graph.spawn;
    this.from = this.node;
    this.to = null;
    this.dir = null;
    this.t = 0;
    this.buffer = null;
    this.bufferAge = 0;
    this.teleports = 0;
    this.turns = 0;
    this.forcedTurn = false;
    this.bufferedTurns = 0;
    this.blocked = () => false;
  }

  /* Drehen auf der Stelle. Wenn der Gang in die gewünschte Richtung zu ist, soll der Akteur
     wenigstens hinschauen — eine Eingabe, die gar nichts tut, liest sich als kaputte Steuerung. */
  face(dir) {
    if (this.to) return false;
    this.dir = dir;
    return true;
  }

  reset(nodeKey) {
    this.node = nodeKey || this.graph.spawn;
    this.from = this.node; this.to = null; this.dir = null; this.t = 0; this.buffer = null;
  }

  legal(nodeKey, dir) {
    const n = this.graph.nodes.get(nodeKey);
    if (!n || !n.nbr[dir]) return false;
    return !this.blocked(n.nbr[dir], nodeKey, dir);
  }

  /* Eine Kante ist ein Tunnel, wenn ihre beiden Knoten nicht benachbart LIEGEN. Dann wird
     gesprungen statt interpoliert — sonst zöge der Spieler quer über die ganze Karte. */
  isJump(a, b) {
    const A = this.graph.nodes.get(a), B = this.graph.nodes.get(b);
    return Math.abs(A.x - B.x) + Math.abs(A.y - B.y) > 1;
  }

  start(dir) {
    if (!this.legal(this.node, dir)) return false;
    this.from = this.node;
    this.to = this.graph.nodes.get(this.node).nbr[dir];
    this.dir = dir;
    this.t = 0;
    if (this.isJump(this.from, this.to)) { this.from = this.to; this.t = 0; this.teleports++; }
    return true;
  }

  /* `drive` = wird gerade gefahren. Ohne das rollt der Akteur nach dem Loslassen bis zur Wand
     weiter — das ist Pacman, nicht Chill&Fun. Georgs Trennung: WhackMan-Modus hält an, wenn
     niemand drückt; der Pacman-Modus läuft von selbst. */
  step(dt, intent, drive = true) {
    const G = this.graph;
    this.drive = drive;

    if (intent) {
      /* Umkehr gilt sofort, auch mitten auf der Kante — alles andere fühlt sich klebrig an. */
      if (this.dir && intent === OPP[this.dir] && this.to) {
        const a = this.from;
        this.from = this.to; this.to = a;
        this.t = 1 - this.t;
        this.dir = intent;
        this.node = this.from;
        this.buffer = null;
        this.turns++;
      } else if (!this.dir || !this.to) {
        /* Steht still: sofort losgehen, wenn der Gang das hergibt. Schlägt das fehl, wird NICHT
           gepuffert — es gibt keinen nächsten Knoten, an dem der Puffer feuern könnte, und eine
           jede Bild neu geschriebene unmögliche Absicht verstopft ihn nur. */
        if (this.start(intent)) this.turns++;
      } else if (intent !== this.dir) {
        /* Gepufferte Abbiegung: kurz VOR der Kreuzung gedrückt, an der Kreuzung ausgeführt.
           Gepuffert wird nur, was am ANKUNFTSKNOTEN wirklich legal ist. Ohne diese Bedingung
           überschreibt eine gehaltene Taste gegen eine Wand den Puffer in jedem Bild, und eine
           echte Abbiegung kommt nie zum Zug. */
        if (this.legal(this.to, intent)) { this.buffer = intent; this.bufferAge = 0; }
      }
    }
    if (this.buffer) {
      this.bufferAge += dt;
      if (this.bufferAge > 1.2) this.buffer = null;
    }

    this.forcedTurn = false;
    if (!this.to || !this.dir) return this.pose();
    if (!drive && !this.continuous) {
      /* Anhalten heisst anhalten — nicht bis zum nächsten Knoten weiterrollen. Die Position ist
         interpoliert, der kanonische Knoten ist der nähere der beiden Enden. */
      return this.pose();
    }

    this.t += this.speed * dt;
    let guard = 0;
    while (this.t >= 1 && guard++ < 8) {
      this.t -= 1;
      this.node = this.to;
      this.from = this.to;

      let next = null, fromBuffer = false;
      /* Ein Verfolger wählt seinen Weg selbst: der Motor fragt seinen `chooser`, statt einen
         Tastenpuffer zu lesen. Damit teilen Spieler und Verfolger denselben Bewegungskörper —
         gleiche Kanten, gleiche Geschwindigkeitsrechnung, gleiche Tunnelregel — und nur die
         Absicht kommt aus verschiedenen Quellen. Kein eigener Schleifenausgang: der Zweig setzt
         nur `next` und fällt in denselben Rumpf wie die Spielerbewegung. */
      if (this.chooser) {
        next = this.chooser(this.node, this.dir);
      } else if (this.buffer && this.legal(this.node, this.buffer)) {
        next = this.buffer;
        this.buffer = null;
        this.bufferedTurns++;
        this.turns++;
        fromBuffer = true;
      } else if (this.legal(this.node, this.dir)) {
        next = this.dir;
      }
      /* Hat der GANG die Richtung geändert, nicht der Spieler? Nur dann darf eine Anzeige oben
         die Blickrichtung nachziehen. Eine Kurve, die man fährt, weil es nicht anders geht, ist
         etwas anderes als eine, die man gewählt hat. */
      this.forcedTurn = !!next && !fromBuffer && !this.chooser && next !== this.dir;

      if (!next || (!drive && !this.continuous && !this.chooser)) { this.to = null; this.t = 0; break; }
      this.dir = next;
      this.to = G.nodes.get(this.node).nbr[next];
      if (this.isJump(this.node, this.to)) {
        this.node = this.to; this.from = this.to;
        this.teleports++;
        const on = G.nodes.get(this.node);
        this.to = on.nbr[next] ? on.nbr[next] : null;
        if (!this.to) { this.t = 0; break; }
      }
    }
    return this.pose();
  }

  /* Weltlage in ZELLEN. Die Umrechnung in Meter macht der Aufrufer mit dem gemessenen Modul —
     der Motor kennt kein Modul. */
  pose() {
    const G = this.graph;
    const a = G.nodes.get(this.from);
    const b = this.to ? G.nodes.get(this.to) : a;
    const t = this.to ? this.t : 0;
    const x = a.x + (b.x - a.x) * t;
    const y = a.y + (b.y - a.y) * t;
    const v = this.dir ? VEC[this.dir] : [0, 1];
    return { x, y, dir: this.dir, yaw: Math.atan2(v[0], v[1]), moving: !!this.to, node: this.node };
  }

  /* Welcher Knoten zählt als „hier" für Aufsammeln und Treffer: der nähere der beiden Enden. */
  occupies() {
    return this.to && this.t > 0.5 ? this.to : this.from;
  }
}

/* ---------- Eingabe ---------- */
export function makeKeys(target = window) {
/* KFB-Standardbelegung: WASD, Q/E strafe, Space Sprung, Shift rennen.
   Q/E sind im Freiflug die Höhe — dieselbe Taste, anderer Kontext, aber nur eine Belegung. */
  const keys = {
    up: false, down: false, left: false, right: false,
    strafeL: false, strafeR: false, jump: false, run: false
  };
  const MAP = {
    KeyW: 'up', ArrowUp: 'up', KeyS: 'down', ArrowDown: 'down',
    KeyA: 'left', ArrowLeft: 'left', KeyD: 'right', ArrowRight: 'right',
    KeyQ: 'strafeL', KeyE: 'strafeR',
    Space: 'jump', ShiftLeft: 'run', ShiftRight: 'run'
  };
  const set = (e, v) => {
    const k = MAP[e.code];
    if (!k) return;
    keys[k] = v;
    e.preventDefault();
  };
  target.addEventListener('keydown', (e) => set(e, true));
  target.addEventListener('keyup', (e) => set(e, false));
  target.addEventListener('blur', () => { for (const k in keys) keys[k] = false; });
  return keys;
}
