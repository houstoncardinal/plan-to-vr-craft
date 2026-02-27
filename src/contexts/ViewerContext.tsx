import React, { createContext, useContext, useReducer, useCallback, ReactNode } from "react";

// Types
export type EditorMode = "view" | "build";
export type CameraMode = "orbit" | "walkthrough" | "firstPerson" | "drone" | "cinematic";
export type BuildTool =
  | "select"
  | "wall"
  | "door"
  | "window"
  | "floor"
  | "roof"
  | "stair"
  | "terrain"
  | "road"
  | "parking"
  | "vegetation"
  | "measure"
  | "section"
  | "kitchen"
  | "bathroom"
  | "furniture"
  | "lighting"
  | "landscape"
  | "fence"
  | "pool"
  | "deck"
  | "components"
  | "materials"
  | "weather"
  | "particles";

export type RoofStyle = "gable" | "hip" | "flat" | "custom";
export type MaterialType =
  | "concrete"
  | "brick"
  | "glass"
  | "wood"
  | "steel"
  | "drywall"
  | "stone"
  | "asphalt"
  | "brushed-aluminum"
  | "copper-patina"
  | "stainless-steel"
  | "bronze-aged"
  | "oak-hardwood"
  | "walnut-finished"
  | "bamboo-natural"
  | "reclaimed-barn"
  | "marble-carrara"
  | "travertine-tumbled"
  | "concrete-polished"
  | "slate-charcoal"
  | "glass-clear"
  | "glass-frosted"
  | "glass-bronze-tinted"
  | "ceramic-white-glossy"
  | "subway-tile-beveled"
  | "terracotta-tile"
  | "velvet-crushed"
  | "linen-natural"
  | "acrylic-clear"
  | "carbon-fiber"
  | "paint-matte"
  | "paint-semi-gloss"
  | "paint-high-gloss";

// Tool configuration that ToolOptionsPanel writes and PlacementController reads
export interface ToolConfig {
  material?: MaterialType;
  scale?: [number, number, number];
  properties?: Record<string, any>;
  label?: string; // human-readable name for the selected variant
}

export interface SceneObject {
  id: string;
  type: "wall" | "door" | "window" | "floor" | "roof" | "stair" | "terrain" | "road" | "parking" | "vegetation" | "asset" | "kitchen" | "bathroom" | "furniture" | "lighting" | "landscape" | "fence" | "pool" | "deck" | "component";
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  properties: Record<string, any>;
  material: MaterialType;
  layer: string;
  visible: boolean;
  locked: boolean;
  name: string;
}

interface ViewerState {
  projectName: string;
  mode: EditorMode;
  activeTool: BuildTool;
  cameraMode: CameraMode;
  cameraPreset: string | null;
  selectedObjectId: string | null;
  objects: SceneObject[];
  layers: { id: string; name: string; visible: boolean; color: string }[];
  gridVisible: boolean;
  gridSnap: boolean;
  gridSize: number;
  showMeasurements: boolean;
  dayNightCycle: number; // 0-1, 0=midnight, 0.5=noon
  season: "spring" | "summer" | "autumn" | "winter";
  rightPanel: "properties" | "assets" | "layers" | "ai" | null;
  undoStack: SceneObject[][];
  redoStack: SceneObject[][];
  pendingObject: Partial<SceneObject> | null;
  // Per-tool configurations set by ToolOptionsPanel
  toolConfigs: Record<string, ToolConfig>;
  // Drag-to-move state
  draggingObjectId: string | null;
  // World features
  neighborhoodMode: boolean;
  npcEnabled: boolean;
}

type ViewerAction =
  | { type: "SET_MODE"; payload: EditorMode }
  | { type: "SET_TOOL"; payload: BuildTool }
  | { type: "SET_CAMERA_MODE"; payload: CameraMode }
  | { type: "SET_CAMERA_PRESET"; payload: string | null }
  | { type: "SELECT_OBJECT"; payload: string | null }
  | { type: "ADD_OBJECT"; payload: SceneObject }
  | { type: "UPDATE_OBJECT"; payload: { id: string; changes: Partial<SceneObject> } }
  | { type: "MOVE_OBJECT_NO_HISTORY"; payload: { id: string; position: [number, number, number] } }
  | { type: "DELETE_OBJECT"; payload: string }
  | { type: "DUPLICATE_OBJECT"; payload: string }
  | { type: "CLEAR_ALL" }
  | { type: "SET_GRID_VISIBLE"; payload: boolean }
  | { type: "SET_GRID_SNAP"; payload: boolean }
  | { type: "SET_DAY_NIGHT"; payload: number }
  | { type: "SET_SEASON"; payload: "spring" | "summer" | "autumn" | "winter" }
  | { type: "SET_RIGHT_PANEL"; payload: ViewerState["rightPanel"] }
  | { type: "TOGGLE_LAYER"; payload: string }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "SET_PENDING_OBJECT"; payload: Partial<SceneObject> | null }
  | { type: "UPDATE_TOOL_CONFIG"; payload: { tool: string; config: ToolConfig } }
  | { type: "SET_DRAGGING_OBJECT"; payload: string | null }
  | { type: "DUPLICATE_OBJECT"; payload: string }
  | { type: "TOGGLE_NEIGHBORHOOD_MODE" }
  | { type: "TOGGLE_NPCS" }
  | { type: "NEW_PROJECT" }
  | { type: "LOAD_PROJECT"; payload: { name: string; objects: SceneObject[] } }
  | { type: "RENAME_PROJECT"; payload: string };

const MAX_UNDO = 50;

const defaultLayers = [
  { id: "architectural", name: "Architectural", visible: true, color: "hsl(0, 72%, 51%)" },
  { id: "structural", name: "Structural", visible: true, color: "hsl(220, 70%, 50%)" },
  { id: "mep", name: "MEP", visible: true, color: "hsl(140, 60%, 45%)" },
  { id: "site", name: "Site", visible: true, color: "hsl(35, 70%, 50%)" },
  { id: "landscape", name: "Landscape", visible: true, color: "hsl(120, 50%, 40%)" },
  { id: "interior", name: "Interior", visible: true, color: "hsl(270, 60%, 50%)" },
];

const initialState: ViewerState = {
  projectName: "New Project",
  mode: "view",
  activeTool: "select",
  cameraMode: "orbit",
  cameraPreset: null,
  selectedObjectId: null,
  objects: [],
  layers: defaultLayers,
  gridVisible: true,
  gridSnap: true,
  gridSize: 1,
  showMeasurements: false,
  dayNightCycle: 0.65,
  season: "summer",
  rightPanel: null,
  undoStack: [],
  redoStack: [],
  pendingObject: null,
  toolConfigs: {},
  draggingObjectId: null,
  neighborhoodMode: false,
  npcEnabled: false,
};

function reducer(state: ViewerState, action: ViewerAction): ViewerState {
  switch (action.type) {
    case "SET_MODE":
      return { ...state, mode: action.payload, activeTool: "select" };
    case "SET_TOOL":
      return { ...state, activeTool: action.payload, pendingObject: null };
    case "SET_CAMERA_MODE":
      return { ...state, cameraMode: action.payload };
    case "SET_CAMERA_PRESET":
      return { ...state, cameraPreset: action.payload };
    case "SELECT_OBJECT":
      return { ...state, selectedObjectId: action.payload, rightPanel: action.payload ? "properties" : state.rightPanel };
    case "ADD_OBJECT":
      return {
        ...state,
        objects: [...state.objects, action.payload],
        undoStack: [...state.undoStack.slice(-MAX_UNDO + 1), state.objects],
        redoStack: [],
        pendingObject: null,
      };
    case "UPDATE_OBJECT":
      return {
        ...state,
        objects: state.objects.map((o) =>
          o.id === action.payload.id ? { ...o, ...action.payload.changes } : o
        ),
        undoStack: [...state.undoStack.slice(-MAX_UNDO + 1), state.objects],
        redoStack: [],
      };
    // Position update during drag — no undo entry, for smooth real-time movement
    case "MOVE_OBJECT_NO_HISTORY":
      return {
        ...state,
        objects: state.objects.map((o) =>
          o.id === action.payload.id ? { ...o, position: action.payload.position } : o
        ),
      };
    case "DELETE_OBJECT":
      return {
        ...state,
        objects: state.objects.filter((o) => o.id !== action.payload),
        selectedObjectId: state.selectedObjectId === action.payload ? null : state.selectedObjectId,
        undoStack: [...state.undoStack.slice(-MAX_UNDO + 1), state.objects],
        redoStack: [],
      };
    case "DUPLICATE_OBJECT": {
      const src = state.objects.find((o) => o.id === action.payload);
      if (!src) return state;
      const newObj: SceneObject = {
        ...src,
        id: `obj_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        name: `${src.name} Copy`,
        position: [src.position[0] + 1, src.position[1], src.position[2] + 1],
      };
      return {
        ...state,
        objects: [...state.objects, newObj],
        selectedObjectId: newObj.id,
        undoStack: [...state.undoStack, state.objects],
        redoStack: [],
      };
    }
    case "CLEAR_ALL":
      return {
        ...state,
        objects: [],
        selectedObjectId: null,
        undoStack: [...state.undoStack, state.objects],
        redoStack: [],
      };
    case "SET_GRID_VISIBLE":
      return { ...state, gridVisible: action.payload };
    case "SET_GRID_SNAP":
      return { ...state, gridSnap: action.payload };
    case "SET_DAY_NIGHT":
      return { ...state, dayNightCycle: action.payload };
    case "SET_SEASON":
      return { ...state, season: action.payload };
    case "SET_RIGHT_PANEL":
      return { ...state, rightPanel: state.rightPanel === action.payload ? null : action.payload };
    case "TOGGLE_LAYER":
      return {
        ...state,
        layers: state.layers.map((l) =>
          l.id === action.payload ? { ...l, visible: !l.visible } : l
        ),
      };
    case "SET_PENDING_OBJECT":
      return { ...state, pendingObject: action.payload };
    case "UPDATE_TOOL_CONFIG":
      return {
        ...state,
        toolConfigs: {
          ...state.toolConfigs,
          [action.payload.tool]: {
            ...state.toolConfigs[action.payload.tool],
            ...action.payload.config,
            // Deep-merge properties
            properties: {
              ...(state.toolConfigs[action.payload.tool]?.properties || {}),
              ...(action.payload.config.properties || {}),
            },
          },
        },
      };
    case "SET_DRAGGING_OBJECT":
      return { ...state, draggingObjectId: action.payload };
    case "DUPLICATE_OBJECT": {
      const src = state.objects.find((o) => o.id === action.payload);
      if (!src) return state;
      const newId = `obj_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      const clone: SceneObject = { ...src, id: newId, position: [src.position[0] + 1, src.position[1], src.position[2] + 1], name: `${src.name} copy` };
      return {
        ...state,
        objects: [...state.objects, clone],
        selectedObjectId: newId,
        undoStack: [...state.undoStack.slice(-MAX_UNDO + 1), state.objects],
        redoStack: [],
      };
    }
    case "TOGGLE_NEIGHBORHOOD_MODE":
      return { ...state, neighborhoodMode: !state.neighborhoodMode };
    case "TOGGLE_NPCS":
      return { ...state, npcEnabled: !state.npcEnabled };
    case "NEW_PROJECT":
      return { ...initialState, projectName: "Untitled Project", objects: [], undoStack: [], redoStack: [] };
    case "LOAD_PROJECT":
      return { ...initialState, projectName: action.payload.name, objects: action.payload.objects, undoStack: [], redoStack: [] };
    case "RENAME_PROJECT":
      return { ...state, projectName: action.payload };
    case "UNDO":
      if (state.undoStack.length === 0) return state;
      return {
        ...state,
        objects: state.undoStack[state.undoStack.length - 1],
        undoStack: state.undoStack.slice(0, -1),
        redoStack: [...state.redoStack.slice(-MAX_UNDO + 1), state.objects],
      };
    case "REDO":
      if (state.redoStack.length === 0) return state;
      return {
        ...state,
        objects: state.redoStack[state.redoStack.length - 1],
        redoStack: state.redoStack.slice(0, -1),
        undoStack: [...state.undoStack.slice(-MAX_UNDO + 1), state.objects],
      };
    default:
      return state;
  }
}

interface ViewerContextType {
  state: ViewerState;
  dispatch: React.Dispatch<ViewerAction>;
  addObject: (obj: Omit<SceneObject, "id">) => string;
  updateObject: (id: string, changes: Partial<SceneObject>) => void;
  deleteObject: (id: string) => void;
  duplicateObject: (id: string) => void;
  selectedObject: SceneObject | null;
}

const ViewerContext = createContext<ViewerContextType | null>(null);

export function ViewerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const addObject = useCallback(
    (obj: Omit<SceneObject, "id">) => {
      const id = `obj_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      dispatch({ type: "ADD_OBJECT", payload: { ...obj, id } });
      return id;
    },
    [dispatch]
  );

  const updateObject = useCallback(
    (id: string, changes: Partial<SceneObject>) => {
      dispatch({ type: "UPDATE_OBJECT", payload: { id, changes } });
    },
    [dispatch]
  );

  const deleteObject = useCallback(
    (id: string) => { dispatch({ type: "DELETE_OBJECT", payload: id }); },
    [dispatch]
  );

  const duplicateObject = useCallback(
    (id: string) => { dispatch({ type: "DUPLICATE_OBJECT", payload: id }); },
    [dispatch]
  );

  const selectedObject = state.selectedObjectId
    ? state.objects.find((o) => o.id === state.selectedObjectId) ?? null
    : null;

  return (
    <ViewerContext.Provider value={{ state, dispatch, addObject, updateObject, deleteObject, duplicateObject, selectedObject }}>
      {children}
    </ViewerContext.Provider>
  );
}

export function useViewer() {
  const ctx = useContext(ViewerContext);
  if (!ctx) throw new Error("useViewer must be used within ViewerProvider");
  return ctx;
}
