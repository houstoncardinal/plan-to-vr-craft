import { motion } from "framer-motion";
import { useState, useCallback } from "react";
import { useViewer, MaterialType, ToolConfig } from "@/contexts/ViewerContext";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DoorOpen,
  SquareDashedBottom,
  Layers,
  Triangle,
  Footprints,
  Mountain,
  Route,
  ParkingSquare,
  Trees,
  Flower2,
  Fence,
  Waves,
  Grid3X3,
  Home,
  Droplets,
  Sofa,
  Lightbulb,
  Box,
  Circle,
  Triangle as TriangleIcon,
  Hexagon,
  Sparkles,
  Square,
  Armchair,
  Lamp,
  Check,
  X,
  Zap,
} from "lucide-react";

interface ToolOptionsPanelProps {
  selectedTool: string;
  onClose: () => void;
}

// ─── Tool base dimensions ──────────────────────────────────────────────────────
const toolBaseDims: Record<string, [number, number, number]> = {
  wall: [4, 3, 0.15], door: [0.91, 2.1, 0.04], window: [1.2, 1.4, 0.08],
  floor: [6, 0.15, 6], roof: [8, 2, 8], stair: [1.2, 3, 3],
  terrain: [10, 0.5, 10], road: [8, 0.1, 3], parking: [12, 0.05, 8],
  vegetation: [3, 5, 3], fence: [3, 1.8, 0.05], pool: [6, 1.5, 10],
  deck: [6, 0.3, 6], landscape: [4, 0.2, 4], kitchen: [3, 0.9, 2],
  bathroom: [2, 1, 2], furniture: [2, 0.85, 0.9], lighting: [0.3, 0.3, 0.3],
};

const shapeKey: Record<string, string> = {
  wall: "shape", door: "style", window: "style", floor: "pattern",
  roof: "style", stair: "configuration", terrain: "type", road: "type",
  parking: "layout", vegetation: "variant", landscape: "element", fence: "style",
  pool: "shape", deck: "configuration", kitchen: "layout", bathroom: "fixture",
  furniture: "variant", lighting: "mount",
};

// ─── Material color swatches ───────────────────────────────────────────────────
const materialColors: Record<string, string> = {
  "drywall": "#f0ede8", "drywall-white": "#f5f5f5",
  "brick-red": "#b5613c", "brick-brown": "#8b5a3c", "brick": "#b5613c",
  "concrete": "#9a9a9a", "concrete-polished": "#b0b0b0",
  "stone-field": "#8a8678", "stone-limestone": "#c4bfa8", "stone": "#9a958e",
  "wood-cedar": "#c4a574", "wood-walnut": "#5c4033", "wood-oak": "#c4a574",
  "wood-mahogany": "#4a2c2a", "wood-pine": "#e8dcb5", "wood": "#a67c52",
  "steel": "#8a8a8a", "steel-brushed": "#b0b0b0", "stucco": "#e8e4dc",
  "glass-clear": "#a8c8d8", "glass-frosted": "#d8e0e8",
  "glass-tinted-bronze": "#8b7355", "glass-tinted-gray": "#8a8a8a",
  "glass-tinted-blue": "#5a7a8a", "glass": "#88b4d4",
  "asphalt": "#4a4a4a", "grass": "#4a7c4e", "soil": "#5c4033",
  "gravel": "#8a8a8a", "sand": "#d4c4a8", "mulch": "#4a3728",
  "marble": "#f0ede8", "quartz": "#e8e4e0", "granite": "#8a8278",
  "tile": "#d0ccc8", "carpet": "#7a6a8a", "hardwood": "#c4a574",
  "laminate": "#d4c4a4", "vinyl": "#a0a0a0", "oak": "#c4a574",
  "maple": "#e0d4b4", "cherry": "#8a5040", "painted": "#e8e4e0",
  "cedar": "#b48060", "composite": "#9a8a7a", "ipe": "#6a4020",
  "pressure-treated": "#8a9a7a", "plaster": "#e8e4e0",
  "shingle": "#4a3a2a", "metal": "#8a8a8a", "clay": "#c4603c",
  "slate": "#5a5a5a", "fabric": "#e8e4dc", "leather": "#5c4033", "velvet": "#4a3c5a",
};

const swatchColor = (id: string) => materialColors[id] || "#cccccc";

// ─── Tool definitions ──────────────────────────────────────────────────────────
const TOOL_DEFS: Record<string, { title: string; icon: any; sections: any[] }> = {
  wall: {
    title: "Wall", icon: Square,
    sections: [
      { name: "Height", options: [
        { id: "height-8",  label: "8 ft",  type: "size", value: { height: 8 },  description: "Standard" },
        { id: "height-9",  label: "9 ft",  type: "size", value: { height: 9 },  description: "Tall ceiling" },
        { id: "height-10", label: "10 ft", type: "size", value: { height: 10 }, description: "High ceiling" },
        { id: "height-12", label: "12 ft", type: "size", value: { height: 12 }, description: "Commercial" },
      ]},
      { name: "Width", options: [
        { id: "width-4",  label: "4 ft",  type: "size", value: { width: 1.2 } },
        { id: "width-8",  label: "8 ft",  type: "size", value: { width: 2.4 } },
        { id: "width-12", label: "12 ft", type: "size", value: { width: 3.6 } },
        { id: "width-16", label: "16 ft", type: "size", value: { width: 4.8 } },
      ]},
      { name: "Shape", options: [
        { id: "rect",    label: "Rectangle", type: "shape", icon: Box },
        { id: "curved",  label: "Curved",    type: "shape", icon: Circle },
        { id: "angled",  label: "Angled",    type: "shape", icon: TriangleIcon },
        { id: "l-shape", label: "L-Shape",   type: "shape", icon: Grid3X3 },
      ]},
      { name: "Material", options: [
        { id: "drywall",   label: "Drywall",   type: "texture", value: { material: "drywall" } },
        { id: "brick-red", label: "Red Brick", type: "texture", value: { material: "brick" } },
        { id: "concrete",  label: "Concrete",  type: "texture", value: { material: "concrete" } },
        { id: "stone",     label: "Stone",     type: "texture", value: { material: "stone" } },
        { id: "wood",      label: "Wood",      type: "texture", value: { material: "wood" } },
        { id: "steel",     label: "Steel",     type: "texture", value: { material: "steel" } },
        { id: "glass",     label: "Glass",     type: "texture", value: { material: "glass" } },
        { id: "stucco",    label: "Stucco",    type: "texture", value: { material: "concrete" } },
      ]},
      { name: "Finish", options: [
        { id: "smooth",    label: "Smooth",      type: "feature" },
        { id: "textured",  label: "Textured",    type: "feature" },
        { id: "insulated", label: "Insulated",   type: "feature" },
        { id: "soundproof",label: "Soundproof",  type: "feature" },
        { id: "fire-rated",label: "Fire Rated",  type: "feature" },
      ]},
    ],
  },
  door: {
    title: "Door", icon: DoorOpen,
    sections: [
      { name: "Size", options: [
        { id: "single-30", label: "30\"",        type: "size", value: { scale: [0.76, 2.1, 0.04] as [number,number,number] } },
        { id: "single-32", label: "32\"",        type: "size", value: { scale: [0.81, 2.1, 0.04] as [number,number,number] } },
        { id: "single-36", label: "36\"",        type: "size", value: { scale: [0.91, 2.1, 0.04] as [number,number,number] } },
        { id: "double-60", label: "Double 60\"", type: "size", value: { scale: [1.52, 2.1, 0.04] as [number,number,number] } },
        { id: "double-72", label: "Double 72\"", type: "size", value: { scale: [1.83, 2.1, 0.04] as [number,number,number] } },
      ]},
      { name: "Style", options: [
        { id: "flush",   label: "Flush",   type: "shape", icon: Box },
        { id: "panel",   label: "Panel",   type: "shape", icon: Grid3X3 },
        { id: "french",  label: "French",  type: "shape", icon: SquareDashedBottom },
        { id: "sliding", label: "Sliding", type: "shape", icon: Layers },
        { id: "barn",    label: "Barn",    type: "shape", icon: Home },
      ]},
      { name: "Material", options: [
        { id: "wood",       label: "Wood",       type: "texture", value: { material: "wood" } },
        { id: "steel",      label: "Steel",      type: "texture", value: { material: "steel" } },
        { id: "glass",      label: "Glass",      type: "texture", value: { material: "glass" } },
        { id: "fiberglass", label: "Fiberglass", type: "texture", value: { material: "concrete" } },
      ]},
    ],
  },
  window: {
    title: "Window", icon: SquareDashedBottom,
    sections: [
      { name: "Size", options: [
        { id: "small",        label: "24\" × 36\"",    type: "size", value: { scale: [0.6, 0.9, 0.08] as [number,number,number] } },
        { id: "medium",       label: "36\" × 48\"",    type: "size", value: { scale: [0.9, 1.2, 0.08] as [number,number,number] } },
        { id: "large",        label: "48\" × 60\"",    type: "size", value: { scale: [1.2, 1.5, 0.08] as [number,number,number] } },
        { id: "floor-ceiling",label: "Floor-to-Ceiling",type: "size", value: { scale: [1.2, 2.8, 0.08] as [number,number,number] } },
      ]},
      { name: "Style", options: [
        { id: "double-hung", label: "Double Hung", type: "shape", icon: Layers },
        { id: "casement",    label: "Casement",   type: "shape", icon: Box },
        { id: "sliding",     label: "Sliding",    type: "shape", icon: Grid3X3 },
        { id: "fixed",       label: "Fixed",      type: "shape", icon: Square },
        { id: "bay",         label: "Bay",        type: "shape", icon: Hexagon },
        { id: "skylight",    label: "Skylight",   type: "shape", icon: Box },
      ]},
      { name: "Glass", options: [
        { id: "clear",  label: "Clear",   type: "texture", value: { material: "glass" } },
        { id: "tinted", label: "Tinted",  type: "texture", value: { material: "glass" } },
        { id: "frosted",label: "Frosted", type: "texture", value: { material: "glass" } },
        { id: "low-e",  label: "Low-E",   type: "texture", value: { material: "glass" } },
      ]},
    ],
  },
  floor: {
    title: "Floor", icon: Layers,
    sections: [
      { name: "Thickness", options: [
        { id: "thick-4", label: "4 in", type: "size", value: { thickness: 0.1 } },
        { id: "thick-6", label: "6 in", type: "size", value: { thickness: 0.15 } },
        { id: "thick-8", label: "8 in", type: "size", value: { thickness: 0.2 } },
      ]},
      { name: "Material", options: [
        { id: "concrete", label: "Concrete",  type: "texture", value: { material: "concrete" } },
        { id: "hardwood", label: "Hardwood",  type: "texture", value: { material: "wood" } },
        { id: "tile",     label: "Tile",      type: "texture", value: { material: "stone" } },
        { id: "marble",   label: "Marble",    type: "texture", value: { material: "stone" } },
        { id: "carpet",   label: "Carpet",    type: "texture", value: { material: "drywall" } },
        { id: "laminate", label: "Laminate",  type: "texture", value: { material: "wood" } },
      ]},
      { name: "Pattern", options: [
        { id: "straight",    label: "Straight",   type: "shape", icon: Box },
        { id: "diagonal",    label: "Diagonal",   type: "shape", icon: TriangleIcon },
        { id: "herringbone", label: "Herringbone",type: "shape", icon: Grid3X3 },
        { id: "chevron",     label: "Chevron",    type: "shape", icon: TriangleIcon },
      ]},
    ],
  },
  roof: {
    title: "Roof", icon: Triangle,
    sections: [
      { name: "Style", options: [
        { id: "gable",   label: "Gable",    type: "shape", icon: TriangleIcon },
        { id: "hip",     label: "Hip",      type: "shape", icon: Triangle },
        { id: "flat",    label: "Flat",     type: "shape", icon: Box },
        { id: "shed",    label: "Shed",     type: "shape", icon: Layers },
        { id: "gambrel", label: "Gambrel",  type: "shape", icon: Hexagon },
      ]},
      { name: "Pitch", options: [
        { id: "pitch-312",  label: "3:12 Low",    type: "size", value: { pitch: 0.25 } },
        { id: "pitch-612",  label: "6:12 Medium", type: "size", value: { pitch: 0.5 } },
        { id: "pitch-812",  label: "8:12 Steep",  type: "size", value: { pitch: 0.67 } },
        { id: "pitch-1212", label: "12:12 Very",  type: "size", value: { pitch: 1 } },
      ]},
      { name: "Material", options: [
        { id: "shingle", label: "Asphalt Shingle", type: "texture", value: { material: "asphalt" } },
        { id: "metal",   label: "Metal Panel",     type: "texture", value: { material: "steel" } },
        { id: "clay",    label: "Clay Tile",       type: "texture", value: { material: "stone" } },
        { id: "slate",   label: "Slate",           type: "texture", value: { material: "stone" } },
        { id: "wood",    label: "Wood Shake",      type: "texture", value: { material: "wood" } },
      ]},
    ],
  },
  stair: {
    title: "Stairs", icon: Footprints,
    sections: [
      { name: "Configuration", options: [
        { id: "straight",  label: "Straight",  type: "shape", icon: Box },
        { id: "l-shaped",  label: "L-Shaped",  type: "shape", icon: Grid3X3 },
        { id: "u-shaped",  label: "U-Shaped",  type: "shape", icon: SquareDashedBottom },
        { id: "spiral",    label: "Spiral",    type: "shape", icon: Circle },
      ]},
      { name: "Material", options: [
        { id: "wood",     label: "Wood",     type: "texture", value: { material: "wood" } },
        { id: "concrete", label: "Concrete", type: "texture", value: { material: "concrete" } },
        { id: "steel",    label: "Steel",    type: "texture", value: { material: "steel" } },
        { id: "stone",    label: "Stone",    type: "texture", value: { material: "stone" } },
      ]},
      { name: "Railing", options: [
        { id: "wood-rail",  label: "Wood",   type: "feature" },
        { id: "metal-rail", label: "Metal",  type: "feature" },
        { id: "glass-rail", label: "Glass",  type: "feature" },
        { id: "cable-rail", label: "Cable",  type: "feature" },
      ]},
    ],
  },
  terrain: {
    title: "Terrain", icon: Mountain,
    sections: [
      { name: "Type", options: [
        { id: "flat",      label: "Flat",      type: "shape", icon: Box },
        { id: "sloped",    label: "Sloped",    type: "shape", icon: TriangleIcon },
        { id: "berm",      label: "Berm",      type: "shape", icon: Circle },
        { id: "terraced",  label: "Terraced",  type: "shape", icon: Layers },
      ]},
      { name: "Surface", options: [
        { id: "grass",  label: "Grass",  type: "texture", value: { material: "stone" } },
        { id: "soil",   label: "Soil",   type: "texture", value: { material: "stone" } },
        { id: "gravel", label: "Gravel", type: "texture", value: { material: "stone" } },
        { id: "sand",   label: "Sand",   type: "texture", value: { material: "stone" } },
        { id: "mulch",  label: "Mulch",  type: "texture", value: { material: "wood" } },
      ]},
    ],
  },
  road: {
    title: "Road", icon: Route,
    sections: [
      { name: "Type", options: [
        { id: "driveway", label: "Driveway", type: "shape", icon: Box },
        { id: "street",   label: "Street",   type: "shape", icon: Route },
        { id: "alley",    label: "Alley",    type: "shape", icon: Box },
        { id: "path",     label: "Path",     type: "shape", icon: Footprints },
      ]},
      { name: "Surface", options: [
        { id: "asphalt",  label: "Asphalt",  type: "texture", value: { material: "asphalt" } },
        { id: "concrete", label: "Concrete", type: "texture", value: { material: "concrete" } },
        { id: "gravel",   label: "Gravel",   type: "texture", value: { material: "stone" } },
        { id: "paver",    label: "Paver",    type: "texture", value: { material: "stone" } },
      ]},
    ],
  },
  parking: {
    title: "Parking", icon: ParkingSquare,
    sections: [
      { name: "Layout", options: [
        { id: "perpendicular", label: "90°",      type: "shape", icon: Grid3X3 },
        { id: "angled",        label: "60°",      type: "shape", icon: TriangleIcon },
        { id: "parallel",      label: "Parallel", type: "shape", icon: Box },
      ]},
      { name: "Stall Size", options: [
        { id: "compact",  label: "Compact",  type: "size", value: { scale: [2.6, 0.05, 4.9] as [number,number,number] } },
        { id: "standard", label: "Standard", type: "size", value: { scale: [2.7, 0.05, 5.5] as [number,number,number] } },
        { id: "ada",      label: "ADA Wide", type: "size", value: { scale: [3.6, 0.05, 5.5] as [number,number,number] } },
      ]},
      { name: "Surface", options: [
        { id: "asphalt",  label: "Asphalt",  type: "texture", value: { material: "asphalt" } },
        { id: "concrete", label: "Concrete", type: "texture", value: { material: "concrete" } },
        { id: "paver",    label: "Paver",    type: "texture", value: { material: "stone" } },
      ]},
    ],
  },
  vegetation: {
    title: "Vegetation", icon: Trees,
    sections: [
      { name: "Species", options: [
        { id: "oak",   label: "Oak",   type: "shape", icon: Trees },
        { id: "maple", label: "Maple", type: "shape", icon: Trees },
        { id: "pine",  label: "Pine",  type: "shape", icon: TriangleIcon },
        { id: "birch", label: "Birch", type: "shape", icon: Trees },
        { id: "palm",  label: "Palm",  type: "shape", icon: Trees },
      ]},
      { name: "Size", options: [
        { id: "small",  label: "Small",  type: "size", value: { scale: [2, 3, 2] as [number,number,number] } },
        { id: "medium", label: "Medium", type: "size", value: { scale: [3, 5, 3] as [number,number,number] } },
        { id: "large",  label: "Large",  type: "size", value: { scale: [4, 8, 4] as [number,number,number] } },
        { id: "mature", label: "Mature", type: "size", value: { scale: [5, 12, 5] as [number,number,number] } },
      ]},
    ],
  },
  landscape: {
    title: "Landscape", icon: Flower2,
    sections: [
      { name: "Element", options: [
        { id: "flower-bed",  label: "Flower Bed",   type: "shape", icon: Flower2 },
        { id: "garden",      label: "Garden",       type: "shape", icon: Grid3X3 },
        { id: "lawn",        label: "Lawn",         type: "shape", icon: Box },
        { id: "rock-garden", label: "Rock Garden",  type: "shape", icon: Hexagon },
      ]},
      { name: "Hardscape", options: [
        { id: "patio",   label: "Patio",   type: "texture", value: { material: "concrete" } },
        { id: "walkway", label: "Walkway", type: "texture", value: { material: "stone" } },
        { id: "deck",    label: "Deck",    type: "texture", value: { material: "wood" } },
      ]},
    ],
  },
  fence: {
    title: "Fence", icon: Fence,
    sections: [
      { name: "Style", options: [
        { id: "picket",     label: "Picket",       type: "shape", icon: Grid3X3 },
        { id: "privacy",    label: "Privacy",      type: "shape", icon: Box },
        { id: "ranch",      label: "Ranch Rail",   type: "shape", icon: Layers },
        { id: "chain-link", label: "Chain Link",   type: "shape", icon: Grid3X3 },
        { id: "wrought",    label: "Wrought Iron", type: "shape", icon: Fence },
      ]},
      { name: "Height", options: [
        { id: "height-3", label: "3 ft",  type: "size", value: { height: 0.9 } },
        { id: "height-4", label: "4 ft",  type: "size", value: { height: 1.2 } },
        { id: "height-6", label: "6 ft",  type: "size", value: { height: 1.8 } },
        { id: "height-8", label: "8 ft",  type: "size", value: { height: 2.4 } },
      ]},
      { name: "Material", options: [
        { id: "wood",  label: "Wood",  type: "texture", value: { material: "wood" } },
        { id: "vinyl", label: "Vinyl", type: "texture", value: { material: "concrete" } },
        { id: "metal", label: "Metal", type: "texture", value: { material: "steel" } },
        { id: "stone", label: "Stone", type: "texture", value: { material: "stone" } },
      ]},
    ],
  },
  pool: {
    title: "Pool", icon: Waves,
    sections: [
      { name: "Shape", options: [
        { id: "rectangular", label: "Rectangular", type: "shape", icon: Box },
        { id: "freeform",    label: "Freeform",    type: "shape", icon: Circle },
        { id: "kidney",      label: "Kidney",      type: "shape", icon: Hexagon },
        { id: "lap",         label: "Lap Pool",    type: "shape", icon: Box },
        { id: "infinity",    label: "Infinity",    type: "shape", icon: Layers },
      ]},
      { name: "Size", options: [
        { id: "small",  label: "Small",  type: "size", value: { scale: [3.6, 1.5, 7.3] as [number,number,number] } },
        { id: "medium", label: "Medium", type: "size", value: { scale: [4.9, 1.5, 9.8] as [number,number,number] } },
        { id: "large",  label: "Large",  type: "size", value: { scale: [6, 1.5, 12] as [number,number,number] } },
      ]},
      { name: "Finish", options: [
        { id: "plaster", label: "Plaster", type: "texture", value: { material: "concrete" } },
        { id: "quartz",  label: "Quartz",  type: "texture", value: { material: "stone" } },
        { id: "tile",    label: "Tile",    type: "texture", value: { material: "glass" } },
      ]},
    ],
  },
  deck: {
    title: "Deck", icon: Grid3X3,
    sections: [
      { name: "Configuration", options: [
        { id: "attached",    label: "Attached",    type: "shape", icon: Box },
        { id: "detached",    label: "Detached",    type: "shape", icon: Grid3X3 },
        { id: "wraparound",  label: "Wraparound",  type: "shape", icon: Layers },
        { id: "multi-level", label: "Multi-Level", type: "shape", icon: Layers },
      ]},
      { name: "Decking", options: [
        { id: "pressure-treated", label: "Pressure Treated", type: "texture", value: { material: "wood" } },
        { id: "cedar",            label: "Cedar",            type: "texture", value: { material: "wood" } },
        { id: "composite",        label: "Composite",        type: "texture", value: { material: "wood" } },
        { id: "ipe",              label: "Ipe Hardwood",     type: "texture", value: { material: "wood" } },
      ]},
      { name: "Features", options: [
        { id: "stairs",  label: "Stairs",       type: "feature" },
        { id: "railing", label: "Railing",      type: "feature" },
        { id: "pergola", label: "Pergola",      type: "feature" },
        { id: "bench",   label: "Built-in Bench",type: "feature" },
      ]},
    ],
  },
  kitchen: {
    title: "Kitchen", icon: Home,
    sections: [
      { name: "Layout", options: [
        { id: "l-shape",  label: "L-Shape",  type: "shape", icon: Grid3X3 },
        { id: "u-shape",  label: "U-Shape",  type: "shape", icon: SquareDashedBottom },
        { id: "galley",   label: "Galley",   type: "shape", icon: Box },
        { id: "island",   label: "Island",   type: "shape", icon: Box },
        { id: "one-wall", label: "One-Wall", type: "shape", icon: Square },
      ]},
      { name: "Cabinets", options: [
        { id: "oak",     label: "Oak",      type: "texture", value: { material: "wood" } },
        { id: "maple",   label: "Maple",    type: "texture", value: { material: "wood" } },
        { id: "cherry",  label: "Cherry",   type: "texture", value: { material: "wood" } },
        { id: "painted", label: "Painted",  type: "texture", value: { material: "wood" } },
      ]},
      { name: "Countertop", options: [
        { id: "granite",  label: "Granite",       type: "texture", value: { material: "stone" } },
        { id: "quartz",   label: "Quartz",        type: "texture", value: { material: "stone" } },
        { id: "marble",   label: "Marble",        type: "texture", value: { material: "stone" } },
        { id: "butcher",  label: "Butcher Block", type: "texture", value: { material: "wood" } },
      ]},
    ],
  },
  bathroom: {
    title: "Bathroom", icon: Droplets,
    sections: [
      { name: "Fixture", options: [
        { id: "vanity",  label: "Vanity",  type: "shape", icon: Box },
        { id: "shower",  label: "Shower",  type: "shape", icon: SquareDashedBottom },
        { id: "tub",     label: "Tub",     type: "shape", icon: Circle },
        { id: "toilet",  label: "Toilet",  type: "shape", icon: Box },
      ]},
      { name: "Material", options: [
        { id: "tile",   label: "Tile",   type: "texture", value: { material: "stone" } },
        { id: "marble", label: "Marble", type: "texture", value: { material: "stone" } },
        { id: "granite",label: "Granite",type: "texture", value: { material: "stone" } },
      ]},
      { name: "Features", options: [
        { id: "walk-in",      label: "Walk-in Shower", type: "feature" },
        { id: "heated-floor", label: "Heated Floor",   type: "feature" },
        { id: "steam",        label: "Steam Shower",   type: "feature" },
        { id: "soaking",      label: "Soaking Tub",    type: "feature" },
      ]},
    ],
  },
  furniture: {
    title: "Furniture", icon: Sofa,
    sections: [
      { name: "Type", options: [
        { id: "sofa",      label: "Sofa",       type: "shape", icon: Sofa },
        { id: "chair",     label: "Chair",      type: "shape", icon: Armchair },
        { id: "table",     label: "Table",      type: "shape", icon: Box },
        { id: "ottoman",   label: "Ottoman",    type: "shape", icon: Box },
        { id: "bed-queen", label: "Queen Bed",  type: "size", value: { scale: [1.5, 0.5, 2.1] as [number,number,number] } },
        { id: "bed-king",  label: "King Bed",   type: "size", value: { scale: [1.9, 0.5, 2.1] as [number,number,number] } },
      ]},
      { name: "Upholstery", options: [
        { id: "fabric",  label: "Fabric",  type: "texture", value: { material: "drywall" } },
        { id: "leather", label: "Leather", type: "texture", value: { material: "wood" } },
        { id: "velvet",  label: "Velvet",  type: "texture", value: { material: "drywall" } },
        { id: "linen",   label: "Linen",   type: "texture", value: { material: "drywall" } },
      ]},
    ],
  },
  lighting: {
    title: "Lighting", icon: Lightbulb,
    sections: [
      { name: "Mount", options: [
        { id: "pendant",   label: "Pendant",    type: "shape", icon: Lightbulb },
        { id: "recessed",  label: "Recessed",   type: "shape", icon: Circle },
        { id: "chandelier",label: "Chandelier", type: "shape", icon: Sparkles },
        { id: "sconce",    label: "Wall Sconce",type: "shape", icon: TriangleIcon },
        { id: "floor-lamp",label: "Floor Lamp", type: "shape", icon: Lamp },
      ]},
      { name: "Finish", options: [
        { id: "brass",   label: "Brass",   type: "feature" },
        { id: "nickel",  label: "Nickel",  type: "feature" },
        { id: "matte-bl",label: "Matte Black",type: "feature" },
        { id: "chrome",  label: "Chrome",  type: "feature" },
      ]},
    ],
  },
};

// ─── Apply one option's value into a merged config ─────────────────────────────
function applyOption(
  opt: any,
  config: ToolConfig,
  base: [number, number, number],
  sk: string
) {
  if (opt.value?.scale) {
    config.scale = opt.value.scale;
  } else if (opt.value?.height != null) {
    config.scale = [base[0], opt.value.height * 0.3048, base[2]];
  } else if (opt.value?.width != null) {
    config.scale = [opt.value.width, base[1], base[2]];
  } else if (opt.value?.thickness != null) {
    config.scale = [base[0], base[1], opt.value.thickness];
  } else if (opt.value?.pitch != null) {
    config.scale = [base[0], opt.value.pitch * 0.6, base[2]];
  } else if (opt.value?.material) {
    config.material = opt.value.material as MaterialType;
  } else if (opt.type === "shape") {
    config.properties = { ...(config.properties || {}), [sk]: opt.id };
  } else if (opt.type === "feature") {
    config.properties = { ...(config.properties || {}), feature: opt.id };
  }
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function ToolOptionsPanel({ selectedTool, onClose }: ToolOptionsPanelProps) {
  const { state, dispatch } = useViewer();

  // Per-section selection: key = "tool:SectionName", value = optionId | null
  // One active option per section (radio style); click again to deselect.
  const [sectionSelections, setSectionSelections] = useState<Record<string, string | null>>({});

  const cfg = TOOL_DEFS[selectedTool];

  // ── Check helpers ────────────────────────────────────────────────────────────
  const getSelected = (sectionName: string): string | null =>
    sectionSelections[`${selectedTool}:${sectionName}`] ?? null;

  const isActive = (sectionName: string, optionId: string) =>
    getSelected(sectionName) === optionId;

  // ── Toggle + rebuild ─────────────────────────────────────────────────────────
  const toggleOption = useCallback((opt: any, sectionName: string) => {
    const key = `${selectedTool}:${sectionName}`;
    const current = sectionSelections[key] ?? null;
    const next = current === opt.id ? null : opt.id;

    const newSels = { ...sectionSelections, [key]: next };
    setSectionSelections(newSels);

    // Rebuild merged ToolConfig from all active sections
    const base = toolBaseDims[selectedTool] || ([1, 1, 1] as [number, number, number]);
    const sk = shapeKey[selectedTool] || "variant";
    const merged: ToolConfig = {};
    const labels: string[] = [];

    for (const [k, optId] of Object.entries(newSels)) {
      if (!optId || !k.startsWith(`${selectedTool}:`)) continue;
      const sName = k.slice(selectedTool.length + 1);
      const section = cfg?.sections.find((s: any) => s.name === sName);
      const option = section?.options.find((o: any) => o.id === optId);
      if (!option) continue;
      labels.push(option.label);
      applyOption(option, merged, base, sk);
    }

    merged.label = labels.length > 0 ? labels.join(" · ") : undefined;
    dispatch({ type: "UPDATE_TOOL_CONFIG", payload: { tool: selectedTool, config: merged } });
  }, [selectedTool, sectionSelections, cfg, dispatch]);

  // ── Clear all selections ─────────────────────────────────────────────────────
  const clearAll = useCallback(() => {
    const cleared: Record<string, null> = {};
    for (const k of Object.keys(sectionSelections)) {
      if (k.startsWith(`${selectedTool}:`)) cleared[k] = null;
    }
    setSectionSelections(prev => ({ ...prev, ...cleared }));
    dispatch({ type: "UPDATE_TOOL_CONFIG", payload: { tool: selectedTool, config: {} } });
  }, [selectedTool, sectionSelections, dispatch]);

  if (!cfg) return null;

  // ── Active combination tags ──────────────────────────────────────────────────
  const activeTags = cfg.sections
    .map((s: any) => {
      const selId = getSelected(s.name);
      if (!selId) return null;
      const opt = s.options.find((o: any) => o.id === selId);
      return opt ? { section: s.name, label: opt.label, type: opt.type } : null;
    })
    .filter(Boolean) as Array<{ section: string; label: string; type: string }>;

  const hasSelections = activeTags.length > 0;

  return (
    <motion.div
      initial={{ x: -12, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -12, opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="absolute left-full top-0 ml-1 w-72 bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-50 flex flex-col"
      style={{ maxHeight: "calc(100vh - 56px)" }}
    >
      {/* Header */}
      <div className="h-11 border-b border-border flex items-center justify-between px-3 bg-muted/20 flex-shrink-0">
        <div className="flex items-center gap-2">
          <cfg.icon className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold text-foreground">{cfg.title}</span>
        </div>
        <button
          onClick={onClose}
          className="h-6 w-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Combination recipe strip */}
      <div className={`px-3 py-2 border-b border-border/50 flex-shrink-0 ${hasSelections ? "bg-primary/5" : "bg-green-500/5"}`}>
        {hasSelections ? (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Zap className="h-3 w-3 text-primary" />
                <span className="text-[10px] font-semibold text-primary uppercase tracking-wide">Combination Active</span>
              </div>
              <button
                onClick={clearAll}
                className="text-[10px] text-muted-foreground/60 hover:text-muted-foreground transition-colors"
              >
                Clear all
              </button>
            </div>
            <div className="flex flex-wrap gap-1">
              {activeTags.map((tag) => (
                <span
                  key={tag.section}
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-primary/12 border border-primary/20 text-[10px] text-primary font-medium"
                >
                  <span className="opacity-60">{tag.section}:</span> {tag.label}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
            <span className="text-[10px] text-green-400 font-medium">
              {state.mode === "build"
                ? "Pick options below, then click canvas to place"
                : "Switch to Build mode to place objects"}
            </span>
          </div>
        )}
      </div>

      {/* Sections */}
      <ScrollArea className="flex-1">
        <div className="p-3">
          <Accordion
            type="multiple"
            defaultValue={cfg.sections.map((s: any) => s.name)}
            className="w-full space-y-1"
          >
            {cfg.sections.map((section: any) => {
              const selId = getSelected(section.name);
              const hasActive = selId !== null;

              return (
                <AccordionItem
                  key={section.name}
                  value={section.name}
                  className="border border-border/40 rounded-lg overflow-hidden"
                >
                  <AccordionTrigger className="px-3 py-2 text-[11px] font-semibold text-muted-foreground hover:text-foreground hover:no-underline [&[data-state=open]]:text-foreground">
                    <div className="flex items-center gap-2 flex-1 text-left">
                      {section.name}
                      {hasActive && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/15 text-primary font-semibold">
                          {section.options.find((o: any) => o.id === selId)?.label}
                        </span>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-2 pb-2 pt-0">
                    <div className="grid grid-cols-2 gap-1.5">
                      {section.options.map((option: any) => {
                        const selected = isActive(section.name, option.id);
                        return (
                          <button
                            key={option.id}
                            onClick={() => toggleOption(option, section.name)}
                            className={`relative flex flex-col items-center gap-1.5 p-2.5 rounded-lg border-2 transition-all duration-100 text-center group ${
                              selected
                                ? "border-primary bg-primary/12 shadow-sm"
                                : "border-border/50 hover:border-primary/40 hover:bg-primary/5"
                            }`}
                          >
                            {/* Selected checkmark */}
                            {selected && (
                              <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                                <Check className="h-2.5 w-2.5 text-primary-foreground" />
                              </div>
                            )}

                            {/* Visual indicator by type */}
                            {option.icon ? (
                              <option.icon
                                className={`h-5 w-5 transition-colors ${selected ? "text-primary" : "text-muted-foreground/70 group-hover:text-primary/80"}`}
                              />
                            ) : option.type === "texture" ? (
                              <div
                                className={`h-5 w-5 rounded-md border-2 shadow-sm ${selected ? "border-primary/60" : "border-border"}`}
                                style={{ backgroundColor: swatchColor(option.id) }}
                              />
                            ) : option.type === "size" ? (
                              <div
                                className={`h-5 w-10 rounded-md flex items-center justify-center text-[9px] font-bold ${
                                  selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {option.label.split(" ")[0]}
                              </div>
                            ) : (
                              <div
                                className={`h-5 w-5 rounded-md ${selected ? "bg-primary" : "bg-muted/60"}`}
                              />
                            )}

                            <span
                              className={`text-[10px] leading-tight font-medium ${
                                selected ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                              }`}
                            >
                              {option.label}
                            </span>

                            {option.description && (
                              <span className="text-[8px] text-muted-foreground/50 leading-none">
                                {option.description}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </ScrollArea>

      {/* Footer CTA */}
      {hasSelections && (
        <div className="border-t border-border/50 p-3 flex-shrink-0 bg-muted/10">
          <div className="text-[10px] text-muted-foreground/70 text-center">
            Click anywhere on the canvas to place · Keep clicking to stamp copies
          </div>
        </div>
      )}
    </motion.div>
  );
}
