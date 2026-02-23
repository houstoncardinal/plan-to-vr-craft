import { SceneObject, MaterialType } from "@/contexts/ViewerContext";

// ─── Helper ────────────────────────────────────────────────────────────────────
function o(
  id: string,
  type: SceneObject["type"],
  position: [number, number, number],
  scale: [number, number, number],
  material: MaterialType,
  layer: string,
  name: string,
  properties: Record<string, any> = {}
): SceneObject {
  return { id, type, position, scale, material, layer, name, properties, rotation: [0, 0, 0], visible: true, locked: false };
}
// ─── Blackwood Manor Estate ────────────────────────────────────────────────────
// A grand English country estate on 1.2 hectares.
// Orientation: front faces south (–z). Rear (+z). East wing (+x). West wing (−x).
// Main block: 28 m wide × 18 m deep × 3 storeys (11 m to ridge).
// East wing: art gallery + orangery (glass house). West wing: carriage house + staff quarters.
// Grounds: fountain forecourt, formal knot gardens, hedge maze, tennis court,
//          heated pool with cabana, walled kitchen garden, orchards.

export const MANSION_PROJECT_NAME = "Blackwood Manor Estate";

export const mansionObjects: SceneObject[] = [

  // ═══════════════════════════════════════════════════════════════════════════
  // SITE & TERRAIN
  // ═══════════════════════════════════════════════════════════════════════════
  o("t01", "terrain", [0,   -0.08, -35],  [100, 0.15, 55], "concrete-polished", "site",      "Front Forecourt"),
  o("t02", "terrain", [0,   -0.08,  42],  [100, 0.15, 80], "concrete-polished", "landscape", "Rear Estate Grounds"),
  o("t03", "terrain", [-50, -0.08,   0],  [10,  0.15, 130],"concrete-polished", "landscape", "West Boundary"),
  o("t04", "terrain", [ 50, -0.08,   0],  [10,  0.15, 130],"concrete-polished", "landscape", "East Boundary"),

  // ═══════════════════════════════════════════════════════════════════════════
  // MAIN HOUSE — GROUND FLOOR
  // ═══════════════════════════════════════════════════════════════════════════
  o("gf01", "floor",  [0, 0.15, 0],       [28, 0.3,  18],   "marble-carrara",     "architectural", "GF Marble Slab"),
  // Exterior stone walls
  o("gf02", "wall",   [0,  1.75, -9],     [28, 3.5, 0.38],  "stone",   "architectural", "GF Front Wall"),
  o("gf03", "wall",   [0,  1.75,  9],     [28, 3.5, 0.38],  "stone",   "architectural", "GF Rear Wall"),
  o("gf04", "wall",   [-14,1.75,  0],     [0.38,3.5,18],    "stone",   "architectural", "GF West Wall"),
  o("gf05", "wall",   [ 14,1.75,  0],     [0.38,3.5,18],    "stone",   "architectural", "GF East Wall"),
  // Interior room dividers — ground floor
  o("gf06", "wall",   [0,  1.75, -2],     [27.2,3.5,0.2],   "drywall", "architectural", "GF Entrance Hall Divider"),
  o("gf07", "wall",   [-5, 1.75,  3.5],   [0.2, 3.5, 11],   "drywall", "architectural", "GF Study/Kitchen Divider"),
  o("gf08", "wall",   [5,  1.75,  3.5],   [0.2, 3.5, 11],   "drywall", "architectural", "GF Dining/Library Divider"),
  o("gf09", "wall",   [0,  1.75,  6],     [9.8, 3.5, 0.2],  "drywall", "architectural", "GF Central Corridor Wall"),
  // 2nd-floor slab
  o("gf10", "floor",  [0,  3.65, 0],      [28, 0.3,  18],   "concrete","architectural", "2F Structural Slab"),

  // ═══════════════════════════════════════════════════════════════════════════
  // MAIN HOUSE — SECOND FLOOR
  // ═══════════════════════════════════════════════════════════════════════════
  o("sf01", "wall",   [0,   5.35, -9],    [28, 3.5, 0.38],  "stone",   "architectural", "2F Front Wall"),
  o("sf02", "wall",   [0,   5.35,  9],    [28, 3.5, 0.38],  "stone",   "architectural", "2F Rear Wall"),
  o("sf03", "wall",   [-14, 5.35,  0],    [0.38,3.5,18],    "stone",   "architectural", "2F West Wall"),
  o("sf04", "wall",   [ 14, 5.35,  0],    [0.38,3.5,18],    "stone",   "architectural", "2F East Wall"),
  o("sf05", "wall",   [-4,  5.35, -1],    [0.2, 3.5, 16],   "drywall", "architectural", "2F Master Suite Divider"),
  o("sf06", "wall",   [4,   5.35, -1],    [0.2, 3.5, 16],   "drywall", "architectural", "2F Bedroom Divider"),
  o("sf07", "floor",  [0,   7.15, 0],     [28, 0.3,  18],   "concrete","architectural", "3F Slab"),

  // ═══════════════════════════════════════════════════════════════════════════
  // MAIN HOUSE — THIRD FLOOR / ATTIC ROOMS
  // ═══════════════════════════════════════════════════════════════════════════
  o("tf01", "wall",   [0,   8.85, -9],    [28, 3.5, 0.38],  "stone",   "architectural", "3F Front Wall"),
  o("tf02", "wall",   [0,   8.85,  9],    [28, 3.5, 0.38],  "stone",   "architectural", "3F Rear Wall"),
  o("tf03", "wall",   [-14, 8.85,  0],    [0.38,3.5,18],    "stone",   "architectural", "3F West Wall"),
  o("tf04", "wall",   [ 14, 8.85,  0],    [0.38,3.5,18],    "stone",   "architectural", "3F East Wall"),
  // Main gable roof
  o("r01",  "roof",   [0,   12.5, 0],     [30, 3.8, 20],    "slate-charcoal","architectural","Main Gable Roof", { style: "gable" }),
  // Chimney stacks
  o("ch01", "wall",   [-6,  14.5, 0],     [1.2, 4, 1.2],    "brick",   "architectural", "Chimney Stack West"),
  o("ch02", "wall",   [ 6,  14.5, 0],     [1.2, 4, 1.2],    "brick",   "architectural", "Chimney Stack East"),

  // ═══════════════════════════════════════════════════════════════════════════
  // GRAND PORTICO & ENTRANCE
  // ═══════════════════════════════════════════════════════════════════════════
  o("pt01", "floor",  [0,   0.5, -12],    [14, 0.4, 7],     "marble-carrara","architectural","Grand Portico Terrace"),
  o("pt02", "floor",  [0,   0.35,-13.6],  [14, 0.2, 1.2],   "marble-carrara","architectural","Portico Step 1"),
  o("pt03", "floor",  [0,   0.2, -14.8],  [14, 0.2, 1.2],   "marble-carrara","architectural","Portico Step 2"),
  o("pt04", "floor",  [0,   0.1, -16],    [14, 0.12,1.2],   "marble-carrara","architectural","Portico Step 3"),
  // 8 ionic columns
  ...[-5.5,-3.5,-1.5,0.5,1.5,3.5,5.5].map((x, i) =>
    o(`col${i}`, "wall", [x, 2.4, -9.2], [0.5, 4.7, 0.5], "marble-carrara", "architectural", `Portico Column ${i + 1}`)
  ),
  o("ptroof","roof",  [0,   5.3, -10.5],  [14, 1.4, 4],     "marble-carrara","architectural","Portico Pediment", { style: "gable" }),
  // Balustrade
  ...[-6,-4.5,-3,-1.5,0,1.5,3,4.5,6].map((x, i) =>
    o(`bal${i}`, "wall", [x, 0.8, -8.3], [0.12, 0.9, 0.12], "marble-carrara", "architectural", `Balustrade Post ${i + 1}`)
  ),
  o("baltop","wall",  [0,   1.3, -8.3],   [13, 0.18, 0.1],  "marble-carrara","architectural","Balustrade Rail"),

  // ═══════════════════════════════════════════════════════════════════════════
  // DOORS
  // ═══════════════════════════════════════════════════════════════════════════
  o("d01", "door",    [0,   1.6, -9],     [2.4, 3.0, 0.08], "oak-hardwood","architectural","Grand Double Door"),
  o("d02", "door",    [-7,  1.5,  9],     [1.1, 2.5, 0.08], "walnut-finished","architectural","Rear Servants Door"),
  o("d03", "door",    [7,   1.5,  9],     [1.1, 2.5, 0.08], "walnut-finished","architectural","Rear Garden Door"),
  o("d04", "door",    [14,  1.5,  0],     [0.08,2.5,1.1],   "oak-hardwood","architectural","East Wing Passage"),
  o("d05", "door",    [-14, 1.5,  0],     [0.08,2.5,1.1],   "oak-hardwood","architectural","West Wing Passage"),
  // Second floor French balcony doors
  o("d06", "door",    [-6,  5.2, -9],     [1.6, 2.4, 0.08], "oak-hardwood","architectural","2F Master Balcony Door L"),
  o("d07", "door",    [6,   5.2, -9],     [1.6, 2.4, 0.08], "oak-hardwood","architectural","2F Balcony Door R"),

  // ═══════════════════════════════════════════════════════════════════════════
  // GROUND FLOOR WINDOWS
  // ═══════════════════════════════════════════════════════════════════════════
  ...[-9, -6, -3, 3, 6, 9].map((x, i) =>
    o(`wgf${i}`, "window", [x, 1.9, -9], [1.6, 1.9, 0.15], "glass-clear", "architectural", `GF Front Window ${i + 1}`)
  ),
  ...[-6, -2, 2, 6].map((x, i) =>
    o(`wgfb${i}`, "window", [x, 1.9, 9], [1.6, 1.9, 0.15], "glass-clear", "architectural", `GF Rear Window ${i + 1}`)
  ),
  ...[-6, -2, 2, 6].map((z, i) =>
    o(`wgfl${i}`, "window", [-14, 1.9, z], [0.15, 1.9, 1.6], "glass-clear", "architectural", `GF West Window ${i + 1}`)
  ),
  ...[-6, -2, 2, 6].map((z, i) =>
    o(`wgfr${i}`, "window", [14, 1.9, z], [0.15, 1.9, 1.6], "glass-clear", "architectural", `GF East Window ${i + 1}`)
  ),

  // ═══════════════════════════════════════════════════════════════════════════
  // SECOND FLOOR WINDOWS
  // ═══════════════════════════════════════════════════════════════════════════
  ...[-9, -6, -3, 0, 3, 6, 9].map((x, i) =>
    o(`w2f${i}`, "window", [x, 5.5, -9], [1.6, 2.0, 0.15], "glass-frosted", "architectural", `2F Front Window ${i + 1}`)
  ),
  ...[-5, 0, 5].map((z, i) =>
    o(`w2fl${i}`, "window", [-14, 5.5, z], [0.15, 2.0, 1.8], "glass-frosted", "architectural", `2F West Window ${i + 1}`)
  ),
  ...[-5, 0, 5].map((z, i) =>
    o(`w2fr${i}`, "window", [14, 5.5, z], [0.15, 2.0, 1.8], "glass-frosted", "architectural", `2F East Window ${i + 1}`)
  ),
  ...[-6, 0, 6].map((x, i) =>
    o(`w2fb${i}`, "window", [x, 5.5, 9], [1.8, 2.0, 0.15], "glass-frosted", "architectural", `2F Rear Window ${i + 1}`)
  ),

  // ═══════════════════════════════════════════════════════════════════════════
  // THIRD FLOOR DORMER WINDOWS
  // ═══════════════════════════════════════════════════════════════════════════
  ...[-8, -4, 0, 4, 8].map((x, i) =>
    o(`w3f${i}`, "window", [x, 9.0, -9], [1.4, 1.8, 0.15], "glass-frosted", "architectural", `3F Dormer Front ${i + 1}`)
  ),
  ...[-4, 0, 4].map((x, i) =>
    o(`w3b${i}`, "window", [x, 9.0, 9], [1.4, 1.8, 0.15], "glass-frosted", "architectural", `3F Dormer Rear ${i + 1}`)
  ),

  // ═══════════════════════════════════════════════════════════════════════════
  // GRAND STAIRCASE
  // ═══════════════════════════════════════════════════════════════════════════
  o("st01", "stair",  [-3, 1.85, 0.5],   [3.2, 3.5, 8],    "marble-carrara","architectural","Grand Staircase Main"),
  o("st02", "stair",  [3,  1.85, 0.5],   [3.2, 3.5, 8],    "marble-carrara","architectural","Grand Staircase Return"),
  // Landing platform
  o("stl1", "floor",  [0,  3.65, -2],    [7,   0.3, 4],    "marble-carrara","architectural","Stair Landing 2F"),
  o("stl2", "floor",  [0,  7.15, -2],    [7,   0.3, 4],    "marble-carrara","architectural","Stair Landing 3F"),

  // ═══════════════════════════════════════════════════════════════════════════
  // EAST WING — Art Gallery & Orangery
  // ═══════════════════════════════════════════════════════════════════════════
  o("ew01", "floor",  [24, 0.15, 0],     [18, 0.3, 14],    "concrete-polished","architectural","East Wing Floor"),
  o("ew02", "wall",   [24, 2.35, -7],    [18, 4.5, 0.3],   "stone","architectural","East Wing Front Wall"),
  o("ew03", "wall",   [24, 2.35,  7],    [18, 4.5, 0.3],   "stone","architectural","East Wing Rear Wall"),
  o("ew04", "wall",   [33, 2.35,  0],    [0.3, 4.5, 14],   "stone","architectural","East Wing Far Wall"),
  o("ew05", "roof",   [24, 6.2,  0],     [20, 2.5, 16],    "slate-charcoal","architectural","East Wing Hip Roof", { style: "hip" }),
  // Floor-to-ceiling gallery windows
  ...[-5, -1.5, 2].map((z, i) =>
    o(`eww${i}`, "window", [33.15, 3.0, z], [0.15, 4.0, 2.6], "glass-bronze-tinted", "architectural", `Gallery Window ${i + 1}`)
  ),
  o("ewskl","window", [24, 3.0, -6.85],  [8,   4.0, 0.15], "glass-clear","architectural","Gallery Skylight Strip"),
  // Orangery (glass house extension)
  o("og01", "wall",   [24, 2.25, 9],     [16, 4.2, 0.18],  "steel","architectural","Orangery Base Wall"),
  o("og02", "wall",   [16.2, 2.25, 14],  [0.18, 4.2, 10],  "steel","architectural","Orangery West Glass Wall"),
  o("og03", "wall",   [31.8, 2.25, 14],  [0.18, 4.2, 10],  "steel","architectural","Orangery East Glass Wall"),
  o("og04", "wall",   [24, 2.25, 19],    [16, 4.2, 0.18],  "steel","architectural","Orangery Far Wall"),
  ...[-6, -2, 2, 6].map((x, i) =>
    o(`ogw${i}`, "window", [24 + x, 2.5, 19], [3.2, 3.8, 0.15], "glass-clear", "architectural", `Orangery Front Panel ${i + 1}`)
  ),
  ...[-3.5, 0.5].map((x, i) =>
    o(`ogws${i}`, "window", [16.35, 2.5, 14 + x * 2], [0.15, 3.8, 3.5], "glass-clear", "architectural", `Orangery Side Panel ${i + 1}`)
  ),
  o("ogroof","roof",  [24, 5.8, 14],     [18, 1.5, 12],    "glass-frosted","architectural","Orangery Glass Roof", { style: "flat" }),
  o("ogflr", "floor", [24, 0.15, 14],    [16, 0.3, 10],    "terracotta-tile","architectural","Orangery Floor"),

  // ═══════════════════════════════════════════════════════════════════════════
  // WEST WING — Carriage House & Guest Suites
  // ═══════════════════════════════════════════════════════════════════════════
  o("ww01", "floor",  [-24, 0.15, 0],    [18, 0.3, 14],    "concrete-polished","architectural","West Wing Floor"),
  o("ww02", "wall",   [-24, 2.35, -7],   [18, 4.5, 0.3],   "stone","architectural","West Wing Front Wall"),
  o("ww03", "wall",   [-24, 2.35,  7],   [18, 4.5, 0.3],   "stone","architectural","West Wing Rear Wall"),
  o("ww04", "wall",   [-33, 2.35,  0],   [0.3, 4.5, 14],   "stone","architectural","West Wing Far Wall"),
  o("ww05", "roof",   [-24, 6.2,  0],    [20, 2.5, 16],    "slate-charcoal","architectural","West Wing Hip Roof", { style: "hip" }),
  ...[-5, -1.5, 2].map((z, i) =>
    o(`www${i}`, "window", [-33.15, 3.0, z], [0.15, 4.0, 2.6], "glass-clear", "architectural", `Guest Wing Window ${i + 1}`)
  ),
  o("wwd1", "door",   [-24, 1.7, -7],    [3.2, 3.2, 0.08], "oak-hardwood","architectural","Carriage Arch Door"),
  o("wwfl2","floor",  [-24, 0.15, 14],   [14, 0.3, 8],     "concrete-polished","architectural","Garage Apron"),
  // Interior: 2 guest suites + shared lounge
  o("ww06", "wall",   [-19, 2.35,  1],   [0.2, 4.5, 12],   "drywall","architectural","Guest Suite Divider"),
  o("ww07", "wall",   [-29, 2.35,  1],   [0.2, 4.5, 12],   "drywall","architectural","Guest Lounge Divider"),

  // ═══════════════════════════════════════════════════════════════════════════
  // POOL COMPLEX
  // ═══════════════════════════════════════════════════════════════════════════
  o("p01", "pool",    [0, -0.85, 26],    [14, 2.0, 28],    "glass-clear","site","Heated Infinity Pool", { shape: "rectangular" }),
  o("p02", "deck",    [0, 0.28, 26],     [24, 0.42, 38],   "travertine-tumbled","site","Pool Terrace"),
  // Pool cabana / pavilion
  o("pcb1","floor",   [0, 0.4, 40],      [10, 0.2, 7],     "concrete-polished","architectural","Cabana Floor"),
  o("pcb2","wall",    [-5, 2.0, 40],     [0.2, 3, 7],      "stone","architectural","Cabana West Wall"),
  o("pcb3","wall",    [5,  2.0, 40],     [0.2, 3, 7],      "stone","architectural","Cabana East Wall"),
  o("pcb4","wall",    [0,  2.0, 43.4],   [10, 3, 0.2],     "stone","architectural","Cabana Rear Wall"),
  o("pcb5","roof",    [0,  3.8, 40],     [11, 1.2, 8],     "travertine-tumbled","architectural","Cabana Roof", { style: "flat" }),
  o("pcb6","door",    [0,  1.5, 43.35],  [2.4, 2.6, 0.08],"oak-hardwood","architectural","Cabana Door"),
  // Hot tub / jacuzzi
  o("p03", "pool",    [9,  -0.2, 36],    [4.5, 0.9, 4.5],  "ceramic-white-glossy","site","Jacuzzi Spa", { shape: "rectangular" }),
  // Reflecting canal
  o("p04", "pool",    [0,  -0.25, 48],   [4, 0.7, 14],     "glass-clear","site","Reflecting Canal", { shape: "rectangular" }),
  // Pool lighting
  ...[-6, 0, 6].flatMap((x, i) => [
    o(`pl${i}a`, "lighting", [x, 0.45, 12.5], [0.35, 0.55, 0.35], "brushed-aluminum", "mep", `Pool Edge Light N${i+1}`, { mount: "floor", intensity: 0.8 }),
    o(`pl${i}b`, "lighting", [x, 0.45, 39.5], [0.35, 0.55, 0.35], "brushed-aluminum", "mep", `Pool Edge Light S${i+1}`, { mount: "floor", intensity: 0.8 }),
  ]),

  // ═══════════════════════════════════════════════════════════════════════════
  // FOUNTAIN FORECOURT
  // ═══════════════════════════════════════════════════════════════════════════
  o("fc01", "deck",   [0,  0.2, -22],    [24, 0.3, 24],    "travertine-tumbled","site","Forecourt Paving"),
  o("fc02", "pool",   [0, -0.15, -22],   [7, 0.8, 7],      "marble-carrara","site","Grand Fountain Basin", { shape: "rectangular" }),
  // Fountain plinth layers
  o("fc03", "floor",  [0,  0.85, -22],   [3, 0.25, 3],     "marble-carrara","site","Fountain Plinth L1"),
  o("fc04", "floor",  [0,  1.15, -22],   [2, 0.3, 2],      "marble-carrara","site","Fountain Plinth L2"),
  o("fc05", "wall",   [0,  2.3, -22],    [0.3, 2.0, 0.3],  "marble-carrara","site","Fountain Column"),
  // Forecourt obelisks
  o("ob01", "wall",   [-8, 2.8, -22],    [0.5, 5.5, 0.5],  "stone","site","Obelisk West"),
  o("ob02", "wall",   [ 8, 2.8, -22],    [0.5, 5.5, 0.5],  "stone","site","Obelisk East"),

  // ═══════════════════════════════════════════════════════════════════════════
  // FRONT DRIVEWAY & ENTRY GATES
  // ═══════════════════════════════════════════════════════════════════════════
  o("dr01", "road",   [0,   0.05, -38],  [10, 0.12, 28],   "asphalt","site","Main Driveway"),
  o("dr02", "road",   [-15, 0.05, -48],  [10, 0.12, 20],   "asphalt","site","West Sweep"),
  o("dr03", "road",   [ 15, 0.05, -48],  [10, 0.12, 20],   "asphalt","site","East Sweep"),
  o("dr04", "road",   [0,   0.05, -58],  [44, 0.12, 10],   "asphalt","site","Estate Road Approach"),
  o("pk01", "parking",[-32, 0.05, -42],  [20, 0.1, 14],    "concrete","site","Motor Court"),
  // Gatehouse
  o("gh01", "floor",  [-20, 0.15, -58],  [6, 0.3, 6],      "stone","site","Gatehouse Floor"),
  o("gh02", "wall",   [-20, 1.5, -58],   [6, 3, 0.3],      "stone","site","Gatehouse Front Wall"),
  o("gh03", "wall",   [-20, 1.5, -61],   [6, 3, 0.3],      "stone","site","Gatehouse Rear Wall"),
  o("gh04", "wall",   [-17, 1.5, -59.5], [0.3,3, 3],       "stone","site","Gatehouse R Wall"),
  o("gh05", "wall",   [-23, 1.5, -59.5], [0.3,3, 3],       "stone","site","Gatehouse L Wall"),
  o("gh06", "roof",   [-20, 3.4, -59.5], [7, 2, 8],        "slate-charcoal","site","Gatehouse Roof", { style: "hip" }),
  // Entry pillars & gates
  o("ga01", "wall",   [-6,  2.8, -62],   [1.2, 5.5, 1.2],  "stone","site","Gate Pillar Left"),
  o("ga02", "wall",   [ 6,  2.8, -62],   [1.2, 5.5, 1.2],  "stone","site","Gate Pillar Right"),
  o("ga03", "fence",  [-2.8,1.5, -62],   [6.2, 3, 0.08],   "steel","site","Entry Gate Left"),
  o("ga04", "fence",  [2.8, 1.5, -62],   [6.2, 3, 0.08],   "steel","site","Entry Gate Right"),
  o("ga05", "fence",  [-28, 1.5, -62],   [38, 2.5, 0.08],  "steel","site","West Perimeter Fence"),
  o("ga06", "fence",  [ 28, 1.5, -62],   [38, 2.5, 0.08],  "steel","site","East Perimeter Fence"),

  // ═══════════════════════════════════════════════════════════════════════════
  // WALLED KITCHEN GARDEN
  // ═══════════════════════════════════════════════════════════════════════════
  o("kg01", "wall",   [-30, 1.5, 50],    [24, 3.0, 0.4],   "brick","landscape","Kitchen Garden N Wall"),
  o("kg02", "wall",   [-30, 1.5, 62],    [24, 3.0, 0.4],   "brick","landscape","Kitchen Garden S Wall"),
  o("kg03", "wall",   [-18, 1.5, 56],    [0.4, 3.0, 12],   "brick","landscape","Kitchen Garden E Wall"),
  o("kg04", "wall",   [-42, 1.5, 56],    [0.4, 3.0, 12],   "brick","landscape","Kitchen Garden W Wall"),
  o("kg05", "floor",  [-30, 0.1, 56],    [23.2,0.2,11.2],  "terracotta-tile","landscape","Kitchen Garden Paths"),
  o("kg06", "door",   [-30, 1.5, 50.1],  [2.0, 2.5, 0.08], "oak-hardwood","landscape","Kitchen Garden Gate"),
  // Raised planting beds
  ...[-35,-29,-23].flatMap((x, i) => [
    o(`bed${i}a`, "landscape", [x, 0.4, 53.5], [4, 0.6, 3], "reclaimed-barn", "landscape", `Raised Bed ${i*2+1}`),
    o(`bed${i}b`, "landscape", [x, 0.4, 58.5], [4, 0.6, 3], "reclaimed-barn", "landscape", `Raised Bed ${i*2+2}`),
  ]),
  // Greenhouse within kitchen garden
  o("kgh1","floor",   [-30, 0.15, 62.5], [10, 0.2, 7],     "concrete-polished","landscape","Kitchen Greenhouse Floor"),
  o("kgh2","wall",    [-30, 2.0, 62.5],  [10, 3.8, 0.15],  "steel","landscape","KG Greenhouse Front"),
  o("kgh3","wall",    [-30, 2.0, 69],    [10, 3.8, 0.15],  "steel","landscape","KG Greenhouse Rear"),
  o("kgh4","roof",    [-30, 4.5, 65.75], [11, 1.2, 8],     "glass-frosted","landscape","KG Greenhouse Roof", { style: "flat" }),

  // ═══════════════════════════════════════════════════════════════════════════
  // TENNIS COURT
  // ═══════════════════════════════════════════════════════════════════════════
  o("tc01", "floor",  [32, 0.08, 30],    [26, 0.15, 12],   "concrete-polished","site","Tennis Court Surface"),
  // Court lines
  o("tcl1", "floor",  [32, 0.1, 30],     [25.8, 0.04, 0.08],"paint-high-gloss","site","Baseline N"),
  o("tcl2", "floor",  [32, 0.1, 24.15],  [25.8, 0.04, 0.08],"paint-high-gloss" as MaterialType,"site","Baseline S"),
  o("tcl3", "floor",  [32, 0.1, 27.1],   [0.08, 0.04, 5.8], "paint-high-gloss" as MaterialType,"site","Centre Service Line"),
  o("tcl4", "floor",  [32, 0.1, 27.1],   [25.8, 0.04, 0.08],"paint-high-gloss" as MaterialType,"site","Net Line"),
  // Net posts
  o("tcp1", "wall",   [19.1, 0.55, 27.1],[0.06, 1.1, 0.06], "steel","site","Net Post W"),
  o("tcp2", "wall",   [44.9, 0.55, 27.1],[0.06, 1.1, 0.06], "steel","site","Net Post E"),
  o("tcnet","wall",   [32, 0.55, 27.1],  [25.8, 0.9, 0.04], "steel","site","Tennis Net"),
  // Perimeter fence
  o("tcf1", "fence",  [32, 1.5, 23.9],   [26, 3, 0.08],    "steel","site","TC South Fence"),
  o("tcf2", "fence",  [32, 1.5, 36.1],   [26, 3, 0.08],    "steel","site","TC North Fence"),
  o("tcf3", "fence",  [19, 1.5, 30],     [0.08, 3, 12.4],  "steel","site","TC West Fence"),
  o("tcf4", "fence",  [45, 1.5, 30],     [0.08, 3, 12.4],  "steel","site","TC East Fence"),

  // ═══════════════════════════════════════════════════════════════════════════
  // HEDGE MAZE
  // ═══════════════════════════════════════════════════════════════════════════
  o("hm01", "landscape",[0, 1.0, 65],    [36, 2.0, 0.8],   "stone","landscape","Maze Outer Wall N"),
  o("hm02", "landscape",[0, 1.0, 83],    [36, 2.0, 0.8],   "stone","landscape","Maze Outer Wall S"),
  o("hm03", "landscape",[-18, 1.0, 74],  [0.8, 2.0, 18],   "stone","landscape","Maze Outer Wall W"),
  o("hm04", "landscape",[ 18, 1.0, 74],  [0.8, 2.0, 18],   "stone","landscape","Maze Outer Wall E"),
  // Interior maze walls
  o("hm05", "landscape",[-9,  1.0, 70],  [9.2, 2.0, 0.8],  "stone","landscape","Maze Wall 1"),
  o("hm06", "landscape",[ 6,  1.0, 70],  [11.2,2.0, 0.8],  "stone","landscape","Maze Wall 2"),
  o("hm07", "landscape",[-14, 1.0, 74],  [0.8, 2.0, 8],    "stone","landscape","Maze Wall 3"),
  o("hm08", "landscape",[ 2,  1.0, 76],  [14.2,2.0, 0.8],  "stone","landscape","Maze Wall 4"),
  o("hm09", "landscape",[ 5,  1.0, 78],  [0.8, 2.0, 4],    "stone","landscape","Maze Wall 5"),
  o("hm10", "landscape",[-7,  1.0, 80],  [10.2,2.0, 0.8],  "stone","landscape","Maze Wall 6"),
  // Maze centre gazebo
  o("gz01", "deck",    [0,  0.3, 74],    [5, 0.3, 5],      "travertine-tumbled","landscape","Maze Gazebo Floor"),
  o("gz02", "roof",    [0,  2.5, 74],    [6, 2.2, 6],      "slate-charcoal","landscape","Maze Gazebo Roof", { style: "hip" }),
  ...[-1.5, 1.5].flatMap((x) =>
    [-1.5, 1.5].map((z, i) =>
      o(`gzp${x}${i}`, "wall", [x, 1.2, 74 + z], [0.18, 2.2, 0.18], "stone", "landscape", `Gazebo Post ${x}${z}`)
    )
  ),

  // ═══════════════════════════════════════════════════════════════════════════
  // FORMAL GARDENS & PARTERRE
  // ═══════════════════════════════════════════════════════════════════════════
  o("lg01","landscape",[-10, 0.3, 15],   [12, 0.5, 9],     "stone","landscape","East Parterre Garden"),
  o("lg02","landscape",[ 10, 0.3, 15],   [12, 0.5, 9],     "stone","landscape","West Parterre Garden"),
  o("lg03","landscape",[-14, 0.3, 50],   [9, 0.5, 9],      "stone","landscape","NW Formal Garden"),
  o("lg04","landscape",[ 14, 0.3, 50],   [9, 0.5, 9],      "stone","landscape","NE Formal Garden"),
  o("lg05","landscape",[0,  0.3, 56],    [12, 0.5, 8],     "stone","landscape","Rear Central Garden"),
  // Rose pergola
  o("rp01","floor",   [-35, 0.25, 30],   [8, 0.15, 18],    "concrete-polished","landscape","Rose Pergola Path"),
  o("rp02","wall",    [-35, 1.8, 21],    [8, 3.5, 0.2],    "stone","landscape","Rose Pergola Arch N"),
  o("rp03","wall",    [-35, 1.8, 39],    [8, 3.5, 0.2],    "stone","landscape","Rose Pergola Arch S"),
  o("rp04","wall",    [-35, 3.0, 30],    [8, 0.2, 18],     "oak-hardwood","landscape","Rose Pergola Top"),

  // ═══════════════════════════════════════════════════════════════════════════
  // TREES & VEGETATION
  // ═══════════════════════════════════════════════════════════════════════════
  // Lime tree avenue (driveway flanking)
  ...[-10, -5, 0, 5, 10].flatMap((x, i) => [
    o(`av${i}a`, "vegetation", [x * 1.8 - 16, 0, -32], [4, 10, 4], "wood","landscape",`Avenue Lime L${i+1}`, { variant: "maple" }),
    o(`av${i}b`, "vegetation", [x * 1.8 + 16, 0, -32], [4, 10, 4], "wood","landscape",`Avenue Lime R${i+1}`, { variant: "maple" }),
  ]),
  // Rear estate oaks
  o("vg01","vegetation",[-20, 0, 22],    [6, 14, 6], "wood","landscape","Estate Oak W1", { variant: "oak" }),
  o("vg02","vegetation",[ 20, 0, 22],    [6, 14, 6], "wood","landscape","Estate Oak E1", { variant: "oak" }),
  o("vg03","vegetation",[-22, 0, 38],    [5, 13, 5], "wood","landscape","Estate Oak W2", { variant: "oak" }),
  o("vg04","vegetation",[ 22, 0, 38],    [5, 13, 5], "wood","landscape","Estate Oak E2", { variant: "oak" }),
  o("vg05","vegetation",[0,   0, 56],    [7, 16, 7], "wood","landscape","Estate Centrepiece Oak", { variant: "oak" }),
  // Birch grove
  ...[-3, 0, 3].map((x, i) =>
    o(`birch${i}`, "vegetation", [-38 + x, 0, 45], [3, 10, 3], "wood","landscape",`Silver Birch ${i+1}`, { variant: "birch" })
  ),
  // Pine windbreak
  ...[-36, -32, -28, 28, 32, 36].map((x, i) =>
    o(`pine${i}`, "vegetation", [x, 0, -20], [3.5, 12, 3.5], "wood","landscape",`Pine Screen ${i+1}`, { variant: "pine" })
  ),
  // Forecourt topiary
  ...[-10, -6, 6, 10].map((x, i) =>
    o(`topi${i}`, "landscape", [x, 0.6, -10], [2, 1.2, 2], "stone","landscape",`Topiary ${i+1}`)
  ),
  // Palms around pool
  ...[-9, 9].map((x, i) =>
    o(`palm${i}`, "vegetation", [x, 0, 26], [3, 9, 3], "wood","landscape",`Pool Palm ${i+1}`, { variant: "palm" })
  ),
  // Roundabout specimen tree
  o("vg12","vegetation",[0, 0, -22],     [7, 11, 7], "wood","landscape","Forecourt Specimen Tree", { variant: "oak" }),

  // ═══════════════════════════════════════════════════════════════════════════
  // INTERIOR — GROUND FLOOR
  // ═══════════════════════════════════════════════════════════════════════════
  // Great Hall / Entrance
  o("li01","lighting",  [0, 3.4, -5.5],  [1.2, 1.2, 1.2],"bronze-aged","mep","Grand Entrance Chandelier", { mount: "ceiling", intensity: 1.8 }),
  o("fu01","furniture", [-9, 0.3, -5.5], [2.8, 0.95, 1.1],"velvet-crushed","interior","Hall Console Sofa",  { variant: "sofa" }),
  o("fu02","furniture", [9,  0.3, -5.5], [2.8, 0.95, 1.1],"velvet-crushed","interior","Hall Mirror Sofa",   { variant: "sofa" }),
  o("fu03","furniture", [0,  0.3, -4.8], [1.6, 0.8, 0.9], "oak-hardwood","interior","Hall Centrepiece Table", { variant: "table" }),
  // Drawing room (left of entrance)
  o("kn01","kitchen",   [-9.5,0.3, 4],   [5.5,0.92,2.4],  "walnut-finished","interior","Grand Kitchen"),
  o("kn02","kitchen",   [-9.5,0.3, 7.2], [2.2,0.92,5.5],  "walnut-finished","interior","Kitchen Island"),
  o("bt01","bathroom",  [9.5, 0.3, 4],   [4, 1, 3],       "marble-carrara","interior","Ground Floor Bath"),
  o("fu04","furniture", [-9, 0.3, 5.5],  [2.6, 0.92, 1],  "velvet-crushed","interior","Drawing Room Sofa", { variant: "sofa" }),
  o("fu05","furniture", [-9, 0.3, 3.5],  [1.8, 0.75, 1],  "walnut-finished","interior","Drawing Room Table", { variant: "table" }),
  o("fu06","furniture", [-10.5,0.3,6.5], [0.88, 0.9, 0.9],"velvet-crushed","interior","Wingback Chair L", { variant: "chair" }),
  o("fu07","furniture", [-7.5,0.3, 6.5], [0.88, 0.9, 0.9],"velvet-crushed","interior","Wingback Chair R", { variant: "chair" }),
  // Dining room (right)
  o("fu08","furniture", [9.5, 0.3, 5.5], [3.5, 0.8, 1.0], "oak-hardwood","interior","Dining Table", { variant: "table" }),
  ...[-1.2, 0, 1.2].flatMap((z, i) => [
    o(`dca${i}`, "furniture", [7.4, 0.3, 5.5 + z], [0.55, 0.95, 0.55], "walnut-finished","interior",`Dining Chair L${i}`, { variant: "chair" }),
    o(`dcb${i}`, "furniture", [11.6, 0.3, 5.5 + z], [0.55, 0.95, 0.55],"walnut-finished","interior",`Dining Chair R${i}`, { variant: "chair" }),
  ]),
  o("li02","lighting",  [-9.5,3.4, 5.5], [0.6, 0.7, 0.6], "bronze-aged","mep","Drawing Room Pendant", { mount: "ceiling" }),
  o("li03","lighting",  [9.5, 3.4, 5.5], [0.7, 0.8, 0.7], "brushed-aluminum","mep","Dining Pendant", { mount: "ceiling", intensity: 1.2 }),
  // Entry lanterns exterior
  o("li04","lighting",  [-7, 2.9, -9.6], [0.4, 0.85, 0.4],"bronze-aged","mep","Entry Lantern W", { mount: "wall" }),
  o("li05","lighting",  [ 7, 2.9, -9.6], [0.4, 0.85, 0.4],"bronze-aged","mep","Entry Lantern E", { mount: "wall" }),
  // Fireplace surrounds (simple box representation)
  o("fp01","wall",      [-13.5, 1.2, 0], [0.4, 2.4, 3],   "marble-carrara","interior","Drawing Room Fireplace"),
  o("fp02","wall",      [13.5, 1.2, 0],  [0.4, 2.4, 3],   "marble-carrara","interior","Dining Room Fireplace"),

  // ═══════════════════════════════════════════════════════════════════════════
  // INTERIOR — SECOND FLOOR
  // ═══════════════════════════════════════════════════════════════════════════
  // Master suite
  o("fu09","furniture", [-9, 3.95, -5],  [2.2, 0.55, 2.2],"velvet-crushed","interior","Master Bed (King)", { variant: "bed-king" }),
  o("fu10","furniture", [-11.5,3.95,-5], [0.7, 0.65, 0.6],"walnut-finished","interior","Bedside Table L",   { variant: "table" }),
  o("fu11","furniture", [-6.5, 3.95,-5], [0.7, 0.65, 0.6],"walnut-finished","interior","Bedside Table R",   { variant: "table" }),
  o("bt02","bathroom",  [-10.5,3.95,4],  [4.5, 1, 4.5],   "marble-carrara","interior","Master En-Suite Bath"),
  o("li06","lighting",  [-9,  7.1, -5],  [0.8, 0.9, 0.8], "brushed-aluminum","mep","Master Suite Chandelier", { mount: "ceiling", intensity: 0.9 }),
  o("fp03","wall",      [-13.5,5.0, 0],  [0.4, 2.2, 2.6], "marble-carrara","interior","Master Suite Fireplace"),
  // Guest suite 1
  o("fu12","furniture", [9,  3.95, -5],  [1.8, 0.5, 2.0], "linen-natural","interior","Guest Bed 1 (Queen)", { variant: "bed-queen" }),
  o("bt03","bathroom",  [11, 3.95,  4],  [3.5, 1, 3.5],   "ceramic-white-glossy","interior","Guest Bath 1"),
  o("li07","lighting",  [9,  7.1, -5],   [0.6, 0.7, 0.6], "brushed-aluminum","mep","Guest Suite 1 Pendant", { mount: "ceiling" }),
  // Guest suite 2
  o("fu13","furniture", [0,  3.95, -5],  [1.8, 0.5, 2.0], "linen-natural","interior","Guest Bed 2 (Queen)", { variant: "bed-queen" }),
  o("li08","lighting",  [0,  7.1, -5],   [0.6, 0.7, 0.6], "brushed-aluminum","mep","Guest Suite 2 Pendant", { mount: "ceiling" }),
  // Hall gallery with artwork ottomans
  o("fu14","furniture", [-6, 3.95, 1.5], [1.0, 0.55, 1.0],"velvet-crushed","interior","2F Hall Ottoman", { variant: "ottoman" }),
  o("li09","lighting",  [0,  7.1,  1],   [1.0, 1.0, 1.0], "brushed-aluminum","mep","2F Hall Chandelier", { mount: "ceiling", intensity: 1.2 }),

  // ═══════════════════════════════════════════════════════════════════════════
  // INTERIOR — THIRD FLOOR
  // ═══════════════════════════════════════════════════════════════════════════
  o("li10","lighting",  [0,  10.5, 0],   [0.7, 0.7, 0.7], "brushed-aluminum","mep","3F Central Pendant", { mount: "ceiling" }),
  o("fu15","furniture", [-9, 7.65, -4],  [1.8, 0.5, 2.0], "linen-natural","interior","3F Bed 1",    { variant: "bed-queen" }),
  o("fu16","furniture", [9,  7.65, -4],  [1.8, 0.5, 2.0], "linen-natural","interior","3F Bed 2",    { variant: "bed-queen" }),
  o("fu17","furniture", [0,  7.65,  4],  [2.4, 0.92, 0.9],"velvet-crushed","interior","3F Library Sofa", { variant: "sofa" }),
  o("fu18","furniture", [0,  7.65,  6],  [1.6, 0.78, 0.9],"oak-hardwood","interior","3F Library Table",  { variant: "table" }),

  // ═══════════════════════════════════════════════════════════════════════════
  // ORANGERY INTERIOR
  // ═══════════════════════════════════════════════════════════════════════════
  o("og10","furniture", [24, 0.3, 14],   [2.0, 0.95, 0.9],"velvet-crushed","interior","Orangery Sofa", { variant: "sofa" }),
  o("og11","furniture", [24, 0.3, 12.5], [1.2, 0.7, 0.7], "oak-hardwood","interior","Orangery Coffee Table", { variant: "table" }),
  o("og12","furniture", [21, 0.3, 15.5], [0.8, 0.9, 0.8], "velvet-crushed","interior","Orangery Chair 1", { variant: "chair" }),
  o("og13","furniture", [27, 0.3, 15.5], [0.8, 0.9, 0.8], "velvet-crushed","interior","Orangery Chair 2", { variant: "chair" }),
  o("og14","lighting",  [24, 4.2, 14],   [0.6, 0.6, 0.6], "brushed-aluminum","mep","Orangery Pendant", { mount: "ceiling", intensity: 1.0 }),
  // Potted palms in orangery
  ...[-5, 0, 5].map((x, i) =>
    o(`ogp${i}`, "vegetation", [24 + x, 0, 17.5], [2, 5, 2], "wood","interior",`Orangery Palm ${i+1}`, { variant: "palm" })
  ),

  // ═══════════════════════════════════════════════════════════════════════════
  // CABANA INTERIOR
  // ═══════════════════════════════════════════════════════════════════════════
  o("cb01","furniture", [0, 0.4, 40],    [2.2, 0.95, 0.9],"velvet-crushed","interior","Cabana Daybed", { variant: "sofa" }),
  o("cb02","furniture", [-3, 0.4, 41.5], [0.8, 0.9, 0.8], "velvet-crushed","interior","Cabana Chair L", { variant: "chair" }),
  o("cb03","furniture", [3,  0.4, 41.5], [0.8, 0.9, 0.8], "velvet-crushed","interior","Cabana Chair R", { variant: "chair" }),
  o("cb04","lighting",  [0,  3.6, 40],   [0.5, 0.5, 0.5], "brushed-aluminum","mep","Cabana Pendant", { mount: "ceiling" }),

  // ═══════════════════════════════════════════════════════════════════════════
  // EXTERIOR LIGHTING
  // ═══════════════════════════════════════════════════════════════════════════
  // Drive bollards
  ...[-8, -4, 0, 4, 8].flatMap((x, i) => [
    o(`dll${i}`, "lighting", [x - 14, 0.5, -28], [0.2, 0.65, 0.2], "brushed-aluminum","mep",`Drive Light L${i+1}`, { mount: "floor", intensity: 0.7 }),
    o(`dlr${i}`, "lighting", [x + 14, 0.5, -28], [0.2, 0.65, 0.2], "brushed-aluminum","mep",`Drive Light R${i+1}`, { mount: "floor", intensity: 0.7 }),
  ]),
  // Garden spotlights
  o("gs01","lighting",  [-10, 0.4, 15],  [0.25,0.55,0.25], "brushed-aluminum","mep","Garden Spot W",  { mount: "floor", intensity: 0.9 }),
  o("gs02","lighting",  [ 10, 0.4, 15],  [0.25,0.55,0.25], "brushed-aluminum","mep","Garden Spot E",  { mount: "floor", intensity: 0.9 }),
  o("gs03","lighting",  [0,   0.4, 55],  [0.25,0.55,0.25], "brushed-aluminum","mep","Rear Garden Spot", { mount: "floor", intensity: 0.9 }),
  // 2F exterior lanterns
  o("li11","lighting",  [-7, 6.4, -9.6], [0.3, 0.6, 0.3],  "bronze-aged","mep","2F Lantern W", { mount: "wall" }),
  o("li12","lighting",  [ 7, 6.4, -9.6], [0.3, 0.6, 0.3],  "bronze-aged","mep","2F Lantern E", { mount: "wall" }),

];

// ─── Blank "New Project" template ─────────────────────────────────────────────
export const BLANK_PROJECT_NAME = "Untitled Project";
export const blankObjects: SceneObject[] = [];
