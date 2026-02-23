export interface BuildingComponent {
  id: string;
  name: string;
  category: string;
  type: 'structural' | 'architectural' | 'decorative' | 'functional' | 'landscape';
  geometry: {
    type: 'box' | 'cylinder' | 'sphere' | 'cone' | 'torus' | 'extrusion' | 'complex';
    parameters: Record<string, number>;
  };
  defaultMaterial: string;
  parameters: Record<string, any>;
  variants?: string[];
  description: string;
}

export const BUILDING_COMPONENTS: Record<string, BuildingComponent> = {
  // Structural Components
  'steel-column-h': {
    id: 'steel-column-h',
    name: 'H-Section Steel Column',
    category: 'Structural',
    type: 'structural',
    geometry: {
      type: 'complex',
      parameters: { width: 0.3, depth: 0.3, height: 3.0, flangeThickness: 0.02, webThickness: 0.01 }
    },
    defaultMaterial: 'steel-structural',
    parameters: {
      height: { min: 1, max: 12, default: 3, step: 0.1 },
      width: { min: 0.1, max: 1.0, default: 0.3, step: 0.01 },
      depth: { min: 0.1, max: 1.0, default: 0.3, step: 0.01 }
    },
    description: 'Standard H-section steel column for commercial buildings'
  },
  'concrete-beam': {
    id: 'concrete-beam',
    name: 'Reinforced Concrete Beam',
    category: 'Structural',
    type: 'structural',
    geometry: {
      type: 'box',
      parameters: { width: 0.4, height: 0.6, length: 6.0 }
    },
    defaultMaterial: 'concrete-reinforced',
    parameters: {
      length: { min: 1, max: 20, default: 6, step: 0.1 },
      width: { min: 0.2, max: 1.0, default: 0.4, step: 0.01 },
      height: { min: 0.2, max: 1.5, default: 0.6, step: 0.01 }
    },
    description: 'Reinforced concrete beam for structural support'
  },
  'wood-joist': {
    id: 'wood-joist',
    name: 'Wood Floor Joist',
    category: 'Structural',
    type: 'structural',
    geometry: {
      type: 'box',
      parameters: { width: 0.05, height: 0.25, length: 4.0 }
    },
    defaultMaterial: 'pine-dimensional',
    parameters: {
      length: { min: 2, max: 12, default: 4, step: 0.1 },
      width: { min: 0.03, max: 0.1, default: 0.05, step: 0.01 },
      height: { min: 0.15, max: 0.4, default: 0.25, step: 0.01 }
    },
    description: 'Standard wood floor joist for residential construction'
  },

  // Walls & Partitions
  'drywall-partition': {
    id: 'drywall-partition',
    name: 'Drywall Partition',
    category: 'Walls',
    type: 'architectural',
    geometry: {
      type: 'box',
      parameters: { thickness: 0.12, height: 2.4, length: 4.0 }
    },
    defaultMaterial: 'drywall-painted',
    parameters: {
      length: { min: 0.5, max: 20, default: 4, step: 0.1 },
      height: { min: 2.0, max: 4.0, default: 2.4, step: 0.1 },
      thickness: { min: 0.08, max: 0.2, default: 0.12, step: 0.01 }
    },
    description: 'Standard interior drywall partition'
  },
  'brick-wall': {
    id: 'brick-wall',
    name: 'Brick Wall',
    category: 'Walls',
    type: 'architectural',
    geometry: {
      type: 'box',
      parameters: { thickness: 0.2, height: 3.0, length: 5.0 }
    },
    defaultMaterial: 'brick-red',
    parameters: {
      length: { min: 0.5, max: 50, default: 5, step: 0.1 },
      height: { min: 1.0, max: 6.0, default: 3.0, step: 0.1 },
      thickness: { min: 0.1, max: 0.3, default: 0.2, step: 0.01 }
    },
    description: 'Traditional brick wall with mortar joints'
  },
  'glass-curtain-wall': {
    id: 'glass-curtain-wall',
    name: 'Glass Curtain Wall',
    category: 'Walls',
    type: 'architectural',
    geometry: {
      type: 'complex',
      parameters: { panelWidth: 1.5, panelHeight: 2.4, frameDepth: 0.1 }
    },
    defaultMaterial: 'glass-clear',
    parameters: {
      panelsX: { min: 1, max: 20, default: 4, step: 1 },
      panelsY: { min: 1, max: 10, default: 3, step: 1 },
      frameWidth: { min: 0.02, max: 0.2, default: 0.05, step: 0.01 }
    },
    description: 'Modern glass curtain wall system'
  },

  // Doors & Windows
  'door-single-panel': {
    id: 'door-single-panel',
    name: 'Single Panel Door',
    category: 'Doors',
    type: 'functional',
    geometry: {
      type: 'box',
      parameters: { width: 0.9, height: 2.1, thickness: 0.04 }
    },
    defaultMaterial: 'oak-hardwood',
    parameters: {
      width: { min: 0.6, max: 1.2, default: 0.9, step: 0.01 },
      height: { min: 1.8, max: 2.4, default: 2.1, step: 0.01 },
      thickness: { min: 0.03, max: 0.08, default: 0.04, step: 0.01 }
    },
    description: 'Standard single panel interior door'
  },
  'door-double-glass': {
    id: 'door-double-glass',
    name: 'Double Glass Door',
    category: 'Doors',
    type: 'functional',
    geometry: {
      type: 'complex',
      parameters: { leafWidth: 0.9, height: 2.1, frameWidth: 0.08 }
    },
    defaultMaterial: 'aluminum-anodized',
    parameters: {
      width: { min: 1.2, max: 3.0, default: 1.8, step: 0.01 },
      height: { min: 2.0, max: 2.4, default: 2.1, step: 0.01 },
      frameWidth: { min: 0.05, max: 0.15, default: 0.08, step: 0.01 }
    },
    description: 'Double glass door with aluminum frame'
  },
  'window-single-hung': {
    id: 'window-single-hung',
    name: 'Single Hung Window',
    category: 'Windows',
    type: 'functional',
    geometry: {
      type: 'complex',
      parameters: { width: 1.2, height: 1.5, frameDepth: 0.08, sillDepth: 0.02 }
    },
    defaultMaterial: 'vinyl-white',
    parameters: {
      width: { min: 0.6, max: 2.4, default: 1.2, step: 0.01 },
      height: { min: 0.8, max: 2.4, default: 1.5, step: 0.01 },
      frameWidth: { min: 0.04, max: 0.12, default: 0.08, step: 0.01 }
    },
    description: 'Single hung window with vinyl frame'
  },
  'window-picture': {
    id: 'window-picture',
    name: 'Picture Window',
    category: 'Windows',
    type: 'functional',
    geometry: {
      type: 'box',
      parameters: { width: 2.4, height: 1.8, thickness: 0.08 }
    },
    defaultMaterial: 'vinyl-white',
    parameters: {
      width: { min: 0.9, max: 4.8, default: 2.4, step: 0.01 },
      height: { min: 0.6, max: 3.0, default: 1.8, step: 0.01 },
      frameWidth: { min: 0.04, max: 0.12, default: 0.08, step: 0.01 }
    },
    description: 'Fixed picture window for views'
  },

  // Roofing
  'roof-gable': {
    id: 'roof-gable',
    name: 'Gable Roof',
    category: 'Roofing',
    type: 'architectural',
    geometry: {
      type: 'complex',
      parameters: { width: 8.0, length: 12.0, pitch: 0.4, overhang: 0.3 }
    },
    defaultMaterial: 'asphalt-shingle',
    parameters: {
      width: { min: 4, max: 50, default: 8, step: 0.1 },
      length: { min: 4, max: 100, default: 12, step: 0.1 },
      pitch: { min: 0.2, max: 1.0, default: 0.4, step: 0.05 },
      overhang: { min: 0, max: 0.6, default: 0.3, step: 0.05 }
    },
    description: 'Traditional gable roof with asphalt shingles'
  },
  'roof-flat': {
    id: 'roof-flat',
    name: 'Flat Roof',
    category: 'Roofing',
    type: 'architectural',
    geometry: {
      type: 'box',
      parameters: { width: 10.0, length: 15.0, thickness: 0.15 }
    },
    defaultMaterial: 'rubber-membrane',
    parameters: {
      width: { min: 4, max: 100, default: 10, step: 0.1 },
      length: { min: 4, max: 200, default: 15, step: 0.1 },
      thickness: { min: 0.1, max: 0.3, default: 0.15, step: 0.01 }
    },
    description: 'Commercial flat roof with membrane'
  },
  'roof-hip': {
    id: 'roof-hip',
    name: 'Hip Roof',
    category: 'Roofing',
    type: 'architectural',
    geometry: {
      type: 'complex',
      parameters: { width: 10.0, length: 12.0, pitch: 0.4, overhang: 0.3 }
    },
    defaultMaterial: 'metal-standing-seam',
    parameters: {
      width: { min: 4, max: 50, default: 10, step: 0.1 },
      length: { min: 4, max: 100, default: 12, step: 0.1 },
      pitch: { min: 0.2, max: 1.0, default: 0.4, step: 0.05 }
    },
    description: 'Hip roof with standing seam metal'
  },

  // Flooring
  'floor-hardwood': {
    id: 'floor-hardwood',
    name: 'Hardwood Flooring',
    category: 'Flooring',
    type: 'architectural',
    geometry: {
      type: 'box',
      parameters: { width: 4.0, length: 6.0, thickness: 0.02 }
    },
    defaultMaterial: 'oak-hardwood',
    parameters: {
      width: { min: 1, max: 50, default: 4, step: 0.1 },
      length: { min: 1, max: 100, default: 6, step: 0.1 },
      thickness: { min: 0.01, max: 0.04, default: 0.02, step: 0.001 }
    },
    description: 'Solid hardwood flooring planks'
  },
  'floor-tile-ceramic': {
    id: 'floor-tile-ceramic',
    name: 'Ceramic Tile Floor',
    category: 'Flooring',
    type: 'architectural',
    geometry: {
      type: 'box',
      parameters: { width: 3.0, length: 4.0, thickness: 0.01 }
    },
    defaultMaterial: 'ceramic-white-glossy',
    parameters: {
      width: { min: 1, max: 50, default: 3, step: 0.1 },
      length: { min: 1, max: 100, default: 4, step: 0.1 },
      tileSize: { min: 0.1, max: 0.6, default: 0.3, step: 0.05 }
    },
    description: 'Ceramic tile flooring with grout lines'
  },
  'floor-carpet': {
    id: 'floor-carpet',
    name: 'Wall-to-Wall Carpet',
    category: 'Flooring',
    type: 'architectural',
    geometry: {
      type: 'box',
      parameters: { width: 4.0, length: 5.0, thickness: 0.015 }
    },
    defaultMaterial: 'carpet-berber',
    parameters: {
      width: { min: 1, max: 50, default: 4, step: 0.1 },
      length: { min: 1, max: 100, default: 5, step: 0.1 },
      thickness: { min: 0.008, max: 0.025, default: 0.015, step: 0.001 }
    },
    description: 'Residential wall-to-wall carpeting'
  },

  // Stairs
  'stairs-straight': {
    id: 'stairs-straight',
    name: 'Straight Stair',
    category: 'Stairs',
    type: 'functional',
    geometry: {
      type: 'complex',
      parameters: { width: 1.2, rise: 0.18, run: 0.28, numSteps: 12 }
    },
    defaultMaterial: 'oak-hardwood',
    parameters: {
      width: { min: 0.8, max: 2.0, default: 1.2, step: 0.01 },
      numSteps: { min: 8, max: 20, default: 12, step: 1 },
      rise: { min: 0.15, max: 0.22, default: 0.18, step: 0.001 },
      run: { min: 0.22, max: 0.35, default: 0.28, step: 0.001 }
    },
    description: 'Straight staircase with wood treads'
  },
  'stairs-spiral': {
    id: 'stairs-spiral',
    name: 'Spiral Stair',
    category: 'Stairs',
    type: 'functional',
    geometry: {
      type: 'complex',
      parameters: { radius: 0.8, height: 3.0, numSteps: 16 }
    },
    defaultMaterial: 'steel-structural',
    parameters: {
      radius: { min: 0.5, max: 1.5, default: 0.8, step: 0.01 },
      height: { min: 2.0, max: 6.0, default: 3.0, step: 0.1 },
      numSteps: { min: 12, max: 24, default: 16, step: 1 }
    },
    description: 'Spiral staircase with metal treads'
  },

  // Kitchen & Bathroom
  'cabinet-base': {
    id: 'cabinet-base',
    name: 'Base Cabinet',
    category: 'Kitchen',
    type: 'functional',
    geometry: {
      type: 'box',
      parameters: { width: 0.6, height: 0.86, depth: 0.6 }
    },
    defaultMaterial: 'maple-painted',
    parameters: {
      width: { min: 0.3, max: 1.2, default: 0.6, step: 0.01 },
      height: { min: 0.7, max: 0.9, default: 0.86, step: 0.01 },
      depth: { min: 0.4, max: 0.7, default: 0.6, step: 0.01 }
    },
    description: 'Standard kitchen base cabinet'
  },
  'cabinet-wall': {
    id: 'cabinet-wall',
    name: 'Wall Cabinet',
    category: 'Kitchen',
    type: 'functional',
    geometry: {
      type: 'box',
      parameters: { width: 0.6, height: 0.7, depth: 0.35 }
    },
    defaultMaterial: 'maple-painted',
    parameters: {
      width: { min: 0.3, max: 1.2, default: 0.6, step: 0.01 },
      height: { min: 0.3, max: 0.9, default: 0.7, step: 0.01 },
      depth: { min: 0.25, max: 0.4, default: 0.35, step: 0.01 }
    },
    description: 'Standard kitchen wall cabinet'
  },
  'countertop-granite': {
    id: 'countertop-granite',
    name: 'Granite Countertop',
    category: 'Kitchen',
    type: 'architectural',
    geometry: {
      type: 'box',
      parameters: { width: 2.4, depth: 0.6, thickness: 0.03 }
    },
    defaultMaterial: 'granite-black',
    parameters: {
      width: { min: 0.6, max: 4.8, default: 2.4, step: 0.01 },
      depth: { min: 0.4, max: 0.8, default: 0.6, step: 0.01 },
      thickness: { min: 0.02, max: 0.04, default: 0.03, step: 0.001 }
    },
    description: 'Natural granite countertop with polished finish'
  },
  'toilet-standard': {
    id: 'toilet-standard',
    name: 'Standard Toilet',
    category: 'Bathroom',
    type: 'functional',
    geometry: {
      type: 'complex',
      parameters: { width: 0.4, depth: 0.65, height: 0.85 }
    },
    defaultMaterial: 'porcelain-white',
    parameters: {
      width: { min: 0.35, max: 0.45, default: 0.4, step: 0.01 },
      depth: { min: 0.6, max: 0.75, default: 0.65, step: 0.01 },
      height: { min: 0.75, max: 0.95, default: 0.85, step: 0.01 }
    },
    description: 'Standard residential toilet'
  },
  'vanity-single': {
    id: 'vanity-single',
    name: 'Single Vanity',
    category: 'Bathroom',
    type: 'functional',
    geometry: {
      type: 'complex',
      parameters: { width: 0.6, depth: 0.45, height: 0.85 }
    },
    defaultMaterial: 'oak-painted',
    parameters: {
      width: { min: 0.45, max: 0.9, default: 0.6, step: 0.01 },
      depth: { min: 0.35, max: 0.55, default: 0.45, step: 0.01 },
      height: { min: 0.75, max: 0.95, default: 0.85, step: 0.01 }
    },
    description: 'Single bathroom vanity with sink'
  },

  // Lighting
  'light-recessed': {
    id: 'light-recessed',
    name: 'Recessed Light',
    category: 'Lighting',
    type: 'functional',
    geometry: {
      type: 'cylinder',
      parameters: { radius: 0.08, height: 0.15 }
    },
    defaultMaterial: 'aluminum-brushed',
    parameters: {
      radius: { min: 0.05, max: 0.15, default: 0.08, step: 0.01 },
      intensity: { min: 300, max: 1500, default: 800, step: 50 },
      colorTemp: { min: 2700, max: 6500, default: 3000, step: 100 }
    },
    description: 'LED recessed ceiling light'
  },
  'light-pendant': {
    id: 'light-pendant',
    name: 'Pendant Light',
    category: 'Lighting',
    type: 'decorative',
    geometry: {
      type: 'complex',
      parameters: { shadeRadius: 0.15, cordLength: 1.2 }
    },
    defaultMaterial: 'glass-frosted',
    parameters: {
      shadeRadius: { min: 0.08, max: 0.3, default: 0.15, step: 0.01 },
      cordLength: { min: 0.3, max: 2.0, default: 1.2, step: 0.1 },
      intensity: { min: 200, max: 1000, default: 500, step: 50 }
    },
    description: 'Modern pendant light with glass shade'
  },

  // Exterior Elements
  'deck-wood': {
    id: 'deck-wood',
    name: 'Wood Deck',
    category: 'Exterior',
    type: 'architectural',
    geometry: {
      type: 'complex',
      parameters: { width: 4.0, length: 6.0, boardWidth: 0.15, gap: 0.008 }
    },
    defaultMaterial: 'cedar-natural',
    parameters: {
      width: { min: 2, max: 20, default: 4, step: 0.1 },
      length: { min: 2, max: 50, default: 6, step: 0.1 },
      boardWidth: { min: 0.1, max: 0.2, default: 0.15, step: 0.01 }
    },
    description: 'Wood deck with individual deck boards'
  },
  'fence-picket': {
    id: 'fence-picket',
    name: 'Picket Fence',
    category: 'Exterior',
    type: 'architectural',
    geometry: {
      type: 'complex',
      parameters: { height: 1.2, picketWidth: 0.08, spacing: 0.08 }
    },
    defaultMaterial: 'cedar-natural',
    parameters: {
      height: { min: 0.8, max: 1.8, default: 1.2, step: 0.1 },
      picketWidth: { min: 0.05, max: 0.12, default: 0.08, step: 0.01 },
      spacing: { min: 0.04, max: 0.15, default: 0.08, step: 0.01 }
    },
    description: 'Traditional picket fence'
  },

  // Landscape
  'tree-oak': {
    id: 'tree-oak',
    name: 'Oak Tree',
    category: 'Landscape',
    type: 'landscape',
    geometry: {
      type: 'complex',
      parameters: { trunkRadius: 0.15, height: 8.0, crownRadius: 3.5 }
    },
    defaultMaterial: 'bark-oak',
    parameters: {
      height: { min: 4, max: 15, default: 8, step: 0.5 },
      crownRadius: { min: 2, max: 6, default: 3.5, step: 0.5 },
      trunkRadius: { min: 0.1, max: 0.3, default: 0.15, step: 0.01 }
    },
    description: 'Mature oak tree with detailed canopy'
  },
  'shrub-boxwood': {
    id: 'shrub-boxwood',
    name: 'Boxwood Shrub',
    category: 'Landscape',
    type: 'landscape',
    geometry: {
      type: 'sphere',
      parameters: { radius: 0.6 }
    },
    defaultMaterial: 'foliage-boxwood',
    parameters: {
      radius: { min: 0.3, max: 1.2, default: 0.6, step: 0.1 }
    },
    description: 'Manicured boxwood shrub'
  }
};

export const COMPONENT_CATEGORIES = [
  'Structural',
  'Walls',
  'Doors',
  'Windows',
  'Roofing',
  'Flooring',
  'Stairs',
  'Kitchen',
  'Bathroom',
  'Lighting',
  'Exterior',
  'Landscape'
];

export const getComponentsByCategory = (category: string): BuildingComponent[] => {
  return Object.values(BUILDING_COMPONENTS).filter(component => component.category === category);
};

export const searchComponents = (query: string): BuildingComponent[] => {
  const lowercaseQuery = query.toLowerCase();
  return Object.values(BUILDING_COMPONENTS).filter(component =>
    component.name.toLowerCase().includes(lowercaseQuery) ||
    component.description.toLowerCase().includes(lowercaseQuery)
  );
};
