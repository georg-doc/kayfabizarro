// The clockwork, as numbers only. Every gear has a real tooth count and a real place, every shaft's speed follows from
// the gears that drive it, and each gear's starting angle is worked out so that its teeth sit in its neighbour's gaps.
//
// The layout is a classic one. The crank turns a layshaft, and pairs of gears with the same number of teeth between them
// (so the same distance apart) drive a stack of concentric tubes at the centre, one per planet. A tube has to pass up
// through every wheel above its own, so the lowest wheel gets the innermost tube and the highest arm. Jupiter and Saturn
// are too slow for one pair, so they come through two more shafts. The Moon and the Earth's spin run off a wheel fixed to
// the Sun's shaft, with the Earth's arm carrying a little train around it.

export const MODULE = 0.03;
const PAIR_TEETH = 96;
export const MOON_LEVEL = 17.6;
export const PAIR_DISTANCE = (MODULE * PAIR_TEETH) / 2;

                                                                                                                                                                               

                     
              
            
            
                                                                                                      
                
                                         
                
                   
  

                                                                                                
                                               

export const levelY = (level        ) => 0.42 + level * 0.17;

const LAY_ANGLE = -0.3;
const at = (radius        , angle        )                   => [radius * Math.cos(angle), radius * Math.sin(angle)];
const chordAngle = (radius        , chord        ) => 2 * Math.asin(chord / (2 * radius));

const lay = at(PAIR_DISTANCE, LAY_ANGLE);
const counterAngle = LAY_ANGLE + chordAngle(PAIR_DISTANCE, (MODULE * (18 + 54)) / 2);
const slowAngle = counterAngle + chordAngle(PAIR_DISTANCE, (MODULE * (18 + 60)) / 2);
const crankDistance = (MODULE * (72 + 24)) / 2;
const crank                   = [lay[0] + crankDistance * Math.cos(LAY_ANGLE - 0.5), lay[1] + crankDistance * Math.sin(LAY_ANGLE - 0.5)];

// Where each planet is today, from its mean longitude, so that the model opens showing roughly the real sky.
const LONGITUDE                                   = {
  mercury: [252.25, 149472.67],
  venus: [181.98, 58517.82],
  earth: [100.46, 35999.37],
  mars: [355.43, 19140.3],
  jupiter: [34.4, 3034.9],
  saturn: [49.94, 1222.11]
};
const J2000 = Date.UTC(2000, 0, 1, 12);
export const longitudeToday = (name        , now = Date.now()) => {
  const [start, rate] = LONGITUDE[name];
  const centuries = (now - J2000) / (36525 * 86400000);
  return (((start + rate * centuries) % 360) * Math.PI) / 180;
};

// The Earth can be given its starting angle, for the calendar it is read against.
export function buildTrain(now = Date.now(), earthStart         ) {
  const shaft = (id         , [x, y]                  , carried = false)        => ({ id, x, y, speed: 0, start: 0, carried });
  const shafts = new Map                ();
  const addShaft = (id         , place                  , carried = false) => shafts.set(id, shaft(id, place, carried));
  addShaft("crank", crank);
  addShaft("lay", lay);
  addShaft("counter", at(PAIR_DISTANCE, counterAngle));
  addShaft("slow", at(PAIR_DISTANCE, slowAngle));
  for (const id of ["saturn", "jupiter", "mars", "venus", "mercury", "earth", "sun"]             ) addShaft(id, [0, 0]);
  // Along the Earth's arm, which lies on the x axis of its own frame.
  const moonA = (MODULE * (36 + 18)) / 2;
  const moonB = moonA + (MODULE * (36 + 12)) / 2;
  const moonC = moonB + (MODULE * (33 + 16)) / 2;
  addShaft("moonA", [moonA, 0], true);
  addShaft("moonB", [moonB, 0], true);
  addShaft("moonC", [moonC, 0], true);
  addShaft("earthSpin", [moonC, 0], true);

  const gears = new Map              ();
  const gear = (id        , shaftId         , teeth        , level        ) => gears.set(id, { id, shaft: shaftId, teeth, level, offset: 0 });
  const meshes         = [];
  const pair = (a        , shaftA         , teethA        , b        , shaftB         , teethB        , level        ) => {
    gear(a, shaftA, teethA, level);
    gear(b, shaftB, teethB, level);
    meshes.push({ driver: a, driven: b });
  };

  // From the crank in. Two pairs of reductions on the way to the slow shaft.
  pair("crankWheel", "crank", 72, "layIn", "lay", 24, 0);
  pair("layToCounter", "lay", 18, "counterIn", "counter", 54, 1);
  pair("counterToSlow", "counter", 18, "slowIn", "slow", 60, 2);
  pair("layToEarth", "lay", 48, "earthWheel", "earth", 48, 3);
  pair("layToMercury", "lay", 77, "mercuryWheel", "mercury", 19, 4);
  pair("layToVenus", "lay", 59, "venusWheel", "venus", 37, 5);
  pair("layToMars", "lay", 33, "marsWheel", "mars", 63, 6);
  pair("slowToJupiter", "slow", 44, "jupiterWheel", "jupiter", 52, 7);
  pair("slowToSaturn", "slow", 24, "saturnWheel", "saturn", 72, 8);
  // On the Earth's arm: a fixed wheel, then stages out along the arm to the Moon and to the Earth's own spin.
  pair("fixedWheel", "sun", 36, "moonAIn", "moonA", 18, MOON_LEVEL);
  pair("moonAOut", "moonA", 36, "moonBIn", "moonB", 12, MOON_LEVEL + 0.7);
  pair("moonBSpin", "moonB", 39, "spinWheel", "earthSpin", 10, MOON_LEVEL + 1.4);
  pair("moonBOut", "moonB", 33, "moonCIn", "moonC", 16, MOON_LEVEL + 2.1);

  const get = (id         ) => shafts.get(id)         ;
  get("crank").speed = 1;

  const longitudes            = ["mercury", "venus", "earth", "mars", "jupiter", "saturn"];
  for (const id of longitudes) get(id).start = longitudeToday(id, now);
  if (earthStart !== undefined) get("earth").start = earthStart;

  for (const { driver, driven } of meshes) {
    const a = gears.get(driver)        ;
    const b = gears.get(driven)        ;
    const shaftA = get(a.shaft);
    const shaftB = get(b.shaft);
    // In the arm's frame the fixed wheel turns backward, at the speed that the arm turns forward.
    const earth = get("earth");
    const speedA = a.shaft === "sun" ? -earth.speed : shaftA.speed;
    const angleA = (a.shaft === "sun" ? -earth.start : shaftA.start) + a.offset;
    shaftB.speed = (-speedA * a.teeth) / b.teeth;
    const direction = Math.atan2(shaftB.y - shaftA.y, shaftB.x - shaftA.x);
    const meshedAt = (-(a.teeth / b.teeth) * (angleA - direction)) + direction + Math.PI + Math.PI / b.teeth;
    b.offset = meshedAt - shaftB.start;
  }
  return { shafts, gears, meshes, moonC };
}

                                                  

// A shaft's absolute angle. A carried one also turns with the arm that carries it.
export function shaftAngle(train       , id         , drive        ) {
  const shaft = train.shafts.get(id)         ;
  const own = shaft.start + shaft.speed * drive;
  if (id === "sun") return 0;
  if (!shaft.carried) return own;
  const earth = train.shafts.get("earth")         ;
  return own + earth.start + earth.speed * drive;
}

// How far out of mesh a pair of gears is, as a fraction of a tooth. Zero is perfect. Used to prove the train in tests.
export function meshError(train       , driver        , driven        , drive        ) {
  const a = train.gears.get(driver)        ;
  const b = train.gears.get(driven)        ;
  const shaftA = train.shafts.get(a.shaft)         ;
  const shaftB = train.shafts.get(b.shaft)         ;
  const direction = Math.atan2(shaftB.y - shaftA.y, shaftB.x - shaftA.x);
  const earth = train.shafts.get("earth")         ;
  const arm = shaftB.carried ? earth.start + earth.speed * drive : 0;
  const angleA = shaftAngle(train, a.shaft, drive) + a.offset - arm;
  const angleB = shaftAngle(train, b.shaft, drive) + b.offset - arm;
  const sum = a.teeth * (angleA - direction) + b.teeth * (angleB - direction - Math.PI) - Math.PI;
  const turns = sum / (2 * Math.PI);
  return Math.abs(turns - Math.round(turns));
}

const PRESSURE = (20 * Math.PI) / 180;
// A real gear pair has a little play in it, so that the teeth roll rather than bind.
const BACKLASH = 0.05 * MODULE;
const involute = (angle        ) => Math.tan(angle) - angle;

// One gear's outline in its own plane, tooth 0 centred on +x, as a true involute of a base circle. Inside the base circle
// there is no involute, so the flank runs on in towards the root, cut slightly under the way a hob would cut a small pinion.
export function gearOutline(teeth        , steps = 5) {
  const pitch = (MODULE * teeth) / 2;
  const base = pitch * Math.cos(PRESSURE);
  const tip = pitch + MODULE;
  const root = pitch - 1.25 * MODULE;
  const halfTooth = Math.PI / (2 * teeth) - BACKLASH / (2 * pitch) + involute(PRESSURE);
  const flank = (radius        ) => {
    if (radius >= base) return halfTooth - involute(Math.acos(base / radius));
    const under = (base - radius) / (base - root + 1e-6);
    return halfTooth - (under * Math.PI * 0.55) / (teeth * (teeth < 18 ? 1.5 : 4));
  };
  const points                     = [];
  const add = (radius        , angle        ) => points.push([radius * Math.cos(angle), radius * Math.sin(angle)]);
  const start = Math.max(base, root);
  for (let tooth = 0; tooth < teeth; tooth++) {
    const centre = (tooth * 2 * Math.PI) / teeth;
    const radii           = root < base ? [root, (root + base) / 2] : [];
    for (let i = 0; i <= steps; i++) radii.push(start + ((tip - start) * i) / steps);
    for (const radius of radii) add(radius, centre - flank(radius));
    for (let i = radii.length - 1; i >= 0; i--) add(radii[i], centre + flank(radii[i]));
  }
  return points;
}
