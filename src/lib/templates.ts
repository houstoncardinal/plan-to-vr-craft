import { SceneObject, MaterialType } from "@/contexts/ViewerContext";
import { mansionObjects, MANSION_PROJECT_NAME } from "./mansionProject";

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

// ─── Simple Home (~22 objects) ────────────────────────────────────────────────
// Wall math: center Y=1.6, height=3.0 → top = 1.6 + 1.5 = 3.1
// Roof (gable prism): position Y=3.1 so eave sits flush on wall tops; ridge at Y=3.1+2.2=5.3
// Gable slope: each 1.1m height (rh/2) → 5.5m horizontal, so step widths narrow accordingly
const simpleHomeObjects: SceneObject[] = [
  // ── Foundation & floor ──────────────────────────────────────────────────────
  o("h_fl",  "floor",      [0,   0.1,   0],   [10, 0.2,  8],   "concrete",      "architectural", "Foundation Slab"),
  // ── Walls ───────────────────────────────────────────────────────────────────
  o("h_w1",  "wall",       [0,   1.6,  -4],   [10, 3.0,  0.3], "brick",         "architectural", "Front Wall"),
  o("h_w2",  "wall",       [0,   1.6,   4],   [10, 3.0,  0.3], "brick",         "architectural", "Rear Wall"),
  o("h_w3",  "wall",       [-5,  1.6,   0],   [0.3,3.0,  8],   "brick",         "architectural", "Left Wall"),
  o("h_w4",  "wall",       [5,   1.6,   0],   [0.3,3.0,  8],   "brick",         "architectural", "Right Wall"),
  // ── Gable end fills (stepped brick approximating triangular gables) ─────────
  // Front gable (z=-4): 3 stacked boxes narrowing as they rise under the roof slope
  o("h_gf1", "wall",       [0,   3.5,  -4],   [9.0,0.8,  0.3], "brick",         "architectural", "Front Gable Low"),
  o("h_gf2", "wall",       [0,   4.35, -4],   [4.8,0.9,  0.3], "brick",         "architectural", "Front Gable Mid"),
  o("h_gf3", "wall",       [0,   5.0,  -4],   [1.6,0.6,  0.3], "brick",         "architectural", "Front Gable Top"),
  // Rear gable (z=4): mirrors front
  o("h_gb1", "wall",       [0,   3.5,   4],   [9.0,0.8,  0.3], "brick",         "architectural", "Rear Gable Low"),
  o("h_gb2", "wall",       [0,   4.35,  4],   [4.8,0.9,  0.3], "brick",         "architectural", "Rear Gable Mid"),
  o("h_gb3", "wall",       [0,   5.0,   4],   [1.6,0.6,  0.3], "brick",         "architectural", "Rear Gable Top"),
  // ── Roof (gable prism sits flush at y=3.1) ──────────────────────────────────
  o("h_r1",  "roof",       [0,   3.1,   0],   [11, 2.2,  9],   "slate-charcoal","architectural", "Gable Roof", { style: "gable" }),
  // ── Chimney (rises from roof center-right, above ridge) ─────────────────────
  o("h_ch",  "wall",       [3.0, 4.2,   0.5], [0.7,2.8,  0.7], "brick",         "architectural", "Chimney"),
  // ── Openings ────────────────────────────────────────────────────────────────
  o("h_d1",  "door",       [0,   1.25, -4],   [1.0,2.2,  0.08],"oak-hardwood",  "architectural", "Front Door"),
  o("h_wn1", "window",     [-3,  1.5,  -4],   [1.4,1.4,  0.12],"glass-clear",   "architectural", "Front Window L"),
  o("h_wn2", "window",     [3,   1.5,  -4],   [1.4,1.4,  0.12],"glass-clear",   "architectural", "Front Window R"),
  o("h_wn3", "window",     [-5,  1.5,  -0.5], [0.12,1.4, 2.2], "glass-clear",   "architectural", "Left Side Window"),
  o("h_wn4", "window",     [5,   1.5,   1.0], [0.12,1.4, 2.2], "glass-clear",   "architectural", "Right Side Window"),
  o("h_wn5", "window",     [0,   1.5,   4],   [1.8,1.2,  0.12],"glass-clear",   "architectural", "Rear Window"),
  // ── Porch ───────────────────────────────────────────────────────────────────
  o("h_dk",  "deck",       [0,   0.22, -5.5], [6,  0.3,  2],   "oak-hardwood",  "site",          "Front Porch"),
  o("h_st",  "deck",       [0,   0.12, -6.6], [4,  0.18, 0.4], "concrete",      "site",          "Porch Step"),
  // ── Landscaping ─────────────────────────────────────────────────────────────
  o("h_t1",  "vegetation", [-7,  0,    -1],   [3,  7,    3],   "wood",          "landscape",     "Oak Tree",   { variant: "oak" }),
  o("h_t2",  "vegetation", [7,   0,     2],   [2,  5,    2],   "wood",          "landscape",     "Maple Tree", { variant: "maple" }),
];

// ─── Modern Villa (~16 objects) ───────────────────────────────────────────────
const modernVillaObjects: SceneObject[] = [
  o("v_fl",  "floor",      [0,   0.1,  0],   [14,  0.25, 10], "concrete-polished","architectural","Main Slab"),
  o("v_w1",  "wall",       [0,   1.75,-5],   [14,  3.25, 0.3],"concrete",      "architectural", "Front Wall"),
  o("v_w2",  "wall",       [0,   1.75, 5],   [14,  3.25, 0.3],"concrete",      "architectural", "Rear Wall"),
  o("v_w3",  "wall",       [-7,  1.75, 0],   [0.3, 3.25, 10], "concrete",      "architectural", "Left Wall"),
  o("v_w4",  "wall",       [7,   1.75, 0],   [0.3, 3.25, 10], "concrete",      "architectural", "Right Wall"),
  o("v_r1",  "roof",       [0,   3.5,  0],   [15,  0.35, 11], "concrete-polished","architectural","Flat Roof", { style: "flat" }),
  o("v_oh",  "floor",      [0,   3.6, -6.5], [14,  0.18,  4], "concrete-polished","architectural","Roof Overhang"),
  o("v_wn1", "window",     [-3,  1.75,-5],   [5,   2.8,  0.12],"glass-clear",  "architectural", "Glass Wall L"),
  o("v_wn2", "window",     [3,   1.75,-5],   [5,   2.8,  0.12],"glass-clear",  "architectural", "Glass Wall R"),
  o("v_wn3", "window",     [-7,  2.0,  1.5], [0.12,2.0,  3.5],"glass-frosted", "architectural", "Side Window"),
  o("v_d1",  "door",       [0,   1.5, -5],   [1.4, 2.8,  0.08],"steel",        "architectural", "Entry Door"),
  o("v_dk",  "deck",       [0,   0.28,-7.5], [14,  0.35,  5], "travertine-tumbled","site",       "Front Terrace"),
  o("v_pl",  "pool",       [0,  -0.6,-11.5], [8,   1.4,   5], "glass-clear",   "site",          "Lap Pool"),
  o("v_t1",  "vegetation", [-9,  0,   -3],   [2,   6,     2], "wood",          "landscape",     "Birch L", { variant: "birch" }),
  o("v_t2",  "vegetation", [9,   0,   -3],   [2,   6,     2], "wood",          "landscape",     "Birch R", { variant: "birch" }),
  o("v_t3",  "vegetation", [-9,  0,    4],   [3,   8,     3], "wood",          "landscape",     "Rear Oak", { variant: "oak" }),
];

// ─── Template registry ─────────────────────────────────────────────────────────
export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  objects: SceneObject[];
  objectCount: number;
  complexity: "empty" | "light" | "medium" | "heavy";
  // Colour used for the visual swatch in the picker card
  accent: string;
  // Short tag shown on card
  tag: string;
}

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: "blank",
    name: "Blank Scene",
    description: "Empty canvas — build from scratch at your own pace.",
    objects: [],
    objectCount: 0,
    complexity: "empty",
    accent: "#1e293b",
    tag: "Empty",
  },
  {
    id: "simple-home",
    name: "Simple Home",
    description: "A cozy family house with a porch and front garden. Great starting point.",
    objects: simpleHomeObjects,
    objectCount: simpleHomeObjects.length,
    complexity: "light",
    accent: "#92400e",
    tag: `${simpleHomeObjects.length} objects`,
  },
  {
    id: "modern-villa",
    name: "Modern Villa",
    description: "Sleek concrete + glass architecture with a terrace and lap pool.",
    objects: modernVillaObjects,
    objectCount: modernVillaObjects.length,
    complexity: "light",
    accent: "#0f4c75",
    tag: "16 objects",
  },
  {
    id: "mansion",
    name: "Blackwood Manor",
    description: "Full English estate — 3 storeys, wings, pool complex, maze & 250+ objects. May load slowly.",
    objects: mansionObjects,
    objectCount: mansionObjects.length,
    complexity: "heavy",
    accent: "#3b1f0a",
    tag: "250+ objects",
  },
];
