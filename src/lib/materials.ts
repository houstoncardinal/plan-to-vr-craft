export interface PBRMaterial {
  name: string;
  type: 'standard' | 'physical' | 'toon' | 'basic';
  properties: {
    color?: string;
    metalness?: number;
    roughness?: number;
    opacity?: number;
    transparent?: boolean;
    emissive?: string;
    emissiveIntensity?: number;
    normalMap?: string;
    roughnessMap?: string;
    metalnessMap?: string;
    aoMap?: string;
    displacementMap?: string;
    displacementScale?: number;
    envMapIntensity?: number;
    clearcoat?: number;
    clearcoatRoughness?: number;
    transmission?: number;
    thickness?: number;
    ior?: number;
  };
  category: string;
  tags: string[];
}

export const PBR_MATERIALS: Record<string, PBRMaterial> = {
  // Metals
  'brushed-aluminum': {
    name: 'Brushed Aluminum',
    type: 'physical',
    properties: {
      color: '#c8c8c8',
      metalness: 1.0,
      roughness: 0.3,
      normalMap: '/textures/metals/aluminum-normal.jpg',
      roughnessMap: '/textures/metals/aluminum-roughness.jpg',
    },
    category: 'Metals',
    tags: ['modern', 'industrial', 'exterior']
  },
  'copper-patina': {
    name: 'Copper Patina',
    type: 'physical',
    properties: {
      color: '#7f9645',
      metalness: 1.0,
      roughness: 0.6,
      normalMap: '/textures/metals/copper-normal.jpg',
      roughnessMap: '/textures/metals/copper-roughness.jpg',
    },
    category: 'Metals',
    tags: ['vintage', 'roofing', 'decorative']
  },
  'stainless-steel': {
    name: 'Stainless Steel',
    type: 'physical',
    properties: {
      color: '#e0e0e0',
      metalness: 1.0,
      roughness: 0.2,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1,
    },
    category: 'Metals',
    tags: ['kitchen', 'modern', 'appliances']
  },
  'bronze-aged': {
    name: 'Aged Bronze',
    type: 'physical',
    properties: {
      color: '#8b4513',
      metalness: 1.0,
      roughness: 0.7,
      envMapIntensity: 0.8,
    },
    category: 'Metals',
    tags: ['statuary', 'decorative', 'classic']
  },

  // Woods
  'oak-hardwood': {
    name: 'Oak Hardwood',
    type: 'physical',
    properties: {
      color: '#deb887',
      metalness: 0.0,
      roughness: 0.8,
      normalMap: '/textures/woods/oak-normal.jpg',
      roughnessMap: '/textures/woods/oak-roughness.jpg',
      aoMap: '/textures/woods/oak-ao.jpg',
    },
    category: 'Woods',
    tags: ['flooring', 'furniture', 'classic']
  },
  'walnut-finished': {
    name: 'Walnut Finished',
    type: 'physical',
    properties: {
      color: '#8b4513',
      metalness: 0.0,
      roughness: 0.3,
      normalMap: '/textures/woods/walnut-normal.jpg',
      roughnessMap: '/textures/woods/walnut-roughness.jpg',
      clearcoat: 0.4,
    },
    category: 'Woods',
    tags: ['furniture', 'luxury', 'dark']
  },
  'bamboo-natural': {
    name: 'Natural Bamboo',
    type: 'physical',
    properties: {
      color: '#d4a76a',
      metalness: 0.0,
      roughness: 0.6,
      normalMap: '/textures/woods/bamboo-normal.jpg',
    },
    category: 'Woods',
    tags: ['eco-friendly', 'flooring', 'modern']
  },
  'reclaimed-barn': {
    name: 'Reclaimed Barn Wood',
    type: 'physical',
    properties: {
      color: '#8b6f47',
      metalness: 0.0,
      roughness: 0.9,
      normalMap: '/textures/woods/barn-normal.jpg',
      displacementMap: '/textures/woods/barn-displacement.jpg',
      displacementScale: 0.01,
    },
    category: 'Woods',
    tags: ['rustic', 'exterior', 'weathered']
  },

  // Stones & Concrete
  'marble-carrara': {
    name: 'Carrara Marble',
    type: 'physical',
    properties: {
      color: '#f8f8f8',
      metalness: 0.0,
      roughness: 0.1,
      normalMap: '/textures/stones/marble-normal.jpg',
      roughnessMap: '/textures/stones/marble-roughness.jpg',
      transmission: 0.1,
      thickness: 0.5,
      ior: 1.5,
    },
    category: 'Stones',
    tags: ['luxury', 'countertops', 'bath']
  },
  'travertine-tumbled': {
    name: 'Tumbled Travertine',
    type: 'physical',
    properties: {
      color: '#d4c4b0',
      metalness: 0.0,
      roughness: 0.8,
      normalMap: '/textures/stones/travertine-normal.jpg',
      aoMap: '/textures/stones/travertine-ao.jpg',
      displacementMap: '/textures/stones/travertine-displacement.jpg',
      displacementScale: 0.02,
    },
    category: 'Stones',
    tags: ['mediterranean', 'flooring', 'classic']
  },
  'concrete-polished': {
    name: 'Polished Concrete',
    type: 'physical',
    properties: {
      color: '#b8b8b8',
      metalness: 0.0,
      roughness: 0.2,
      normalMap: '/textures/concrete/polished-normal.jpg',
      roughnessMap: '/textures/concrete/polished-roughness.jpg',
      clearcoat: 0.3,
    },
    category: 'Stones',
    tags: ['industrial', 'modern', 'flooring']
  },
  'slate-charcoal': {
    name: 'Charcoal Slate',
    type: 'physical',
    properties: {
      color: '#36454f',
      metalness: 0.0,
      roughness: 0.7,
      normalMap: '/textures/stones/slate-normal.jpg',
    },
    category: 'Stones',
    tags: ['roofing', 'exterior', 'modern']
  },

  // Glass & Transparent
  'glass-clear': {
    name: 'Clear Glass',
    type: 'physical',
    properties: {
      color: '#ffffff',
      metalness: 0.0,
      roughness: 0.0,
      transmission: 1.0,
      thickness: 0.5,
      ior: 1.5,
      transparent: true,
      opacity: 0.1,
    },
    category: 'Glass',
    tags: ['windows', 'modern', 'transparent']
  },
  'glass-frosted': {
    name: 'Frosted Glass',
    type: 'physical',
    properties: {
      color: '#ffffff',
      metalness: 0.0,
      roughness: 0.4,
      transmission: 0.9,
      thickness: 0.5,
      ior: 1.5,
      transparent: true,
      opacity: 0.3,
      normalMap: '/textures/glass/frosted-normal.jpg',
    },
    category: 'Glass',
    tags: ['bathroom', 'privacy', 'modern']
  },
  'glass-bronze-tinted': {
    name: 'Bronze Tinted Glass',
    type: 'physical',
    properties: {
      color: '#8b4513',
      metalness: 0.0,
      roughness: 0.0,
      transmission: 0.8,
      thickness: 0.5,
      ior: 1.5,
      transparent: true,
      opacity: 0.5,
    },
    category: 'Glass',
    tags: ['commercial', 'exterior', 'tinted']
  },

  // Ceramics & Tiles
  'ceramic-white-glossy': {
    name: 'White Glossy Ceramic',
    type: 'physical',
    properties: {
      color: '#ffffff',
      metalness: 0.0,
      roughness: 0.1,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1,
    },
    category: 'Ceramics',
    tags: ['bathroom', 'kitchen', 'clean']
  },
  'subway-tile-beveled': {
    name: 'Beveled Subway Tile',
    type: 'physical',
    properties: {
      color: '#f5f5f5',
      metalness: 0.0,
      roughness: 0.2,
      normalMap: '/tiles/subway-normal.jpg',
      displacementMap: '/tiles/subway-displacement.jpg',
      displacementScale: 0.005,
    },
    category: 'Ceramics',
    tags: ['kitchen', 'bathroom', 'classic']
  },
  'terracotta-tile': {
    name: 'Terracotta Tile',
    type: 'physical',
    properties: {
      color: '#e2725b',
      metalness: 0.0,
      roughness: 0.8,
      normalMap: '/tiles/terracotta-normal.jpg',
    },
    category: 'Ceramics',
    tags: ['mediterranean', 'flooring', 'warm']
  },

  // Fabrics & Textiles
  'velvet-crushed': {
    name: 'Crushed Velvet',
    type: 'physical',
    properties: {
      color: '#4b0082',
      metalness: 0.0,
      roughness: 0.9,
      normalMap: '/fabrics/velvet-normal.jpg',
      sheen: 1.0,
      sheenColor: '#ffffff',
    },
    category: 'Fabrics',
    tags: ['furniture', 'luxury', 'upholstery']
  },
  'linen-natural': {
    name: 'Natural Linen',
    type: 'physical',
    properties: {
      color: '#f5f5dc',
      metalness: 0.0,
      roughness: 0.8,
      normalMap: '/fabrics/linen-normal.jpg',
    },
    category: 'Fabrics',
    tags: ['upholstery', 'curtains', 'natural']
  },

  // Plastics & Composites
  'acrylic-clear': {
    name: 'Clear Acrylic',
    type: 'physical',
    properties: {
      color: '#ffffff',
      metalness: 0.0,
      roughness: 0.0,
      transmission: 0.95,
      thickness: 1.0,
      ior: 1.49,
      transparent: true,
      opacity: 0.1,
    },
    category: 'Plastics',
    tags: ['modern', 'furniture', 'transparent']
  },
  'carbon-fiber': {
    name: 'Carbon Fiber',
    type: 'physical',
    properties: {
      color: '#1a1a1a',
      metalness: 0.8,
      roughness: 0.2,
      normalMap: '/composites/carbon-normal.jpg',
      metalnessMap: '/composites/carbon-metallic.jpg',
    },
    category: 'Composites',
    tags: ['performance', 'modern', 'automotive']
  },

  // Paints & Coatings
  'paint-matte': {
    name: 'Matte Paint',
    type: 'physical',
    properties: {
      color: '#ffffff',
      metalness: 0.0,
      roughness: 0.9,
    },
    category: 'Paints',
    tags: ['walls', 'interior', 'matte']
  },
  'paint-semi-gloss': {
    name: 'Semi-Gloss Paint',
    type: 'physical',
    properties: {
      color: '#ffffff',
      metalness: 0.0,
      roughness: 0.4,
      clearcoat: 0.5,
      clearcoatRoughness: 0.3,
    },
    category: 'Paints',
    tags: ['walls', 'trim', 'washable']
  },
  'paint-high-gloss': {
    name: 'High Gloss Paint',
    type: 'physical',
    properties: {
      color: '#ffffff',
      metalness: 0.0,
      roughness: 0.1,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1,
    },
    category: 'Paints',
    tags: ['trim', 'modern', 'reflective']
  },
};

export const MATERIAL_CATEGORIES = [
  'Metals',
  'Woods',
  'Stones',
  'Glass',
  'Ceramics',
  'Fabrics',
  'Plastics',
  'Composites',
  'Paints'
];

export const getMaterialsByCategory = (category: string): PBRMaterial[] => {
  return Object.values(PBR_MATERIALS).filter(material => material.category === category);
};

export const searchMaterials = (query: string): PBRMaterial[] => {
  const lowercaseQuery = query.toLowerCase();
  return Object.values(PBR_MATERIALS).filter(material =>
    material.name.toLowerCase().includes(lowercaseQuery) ||
    material.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};
