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
  | "section";

export type RoofStyle = "gable" | "hip" | "flat" | "custom";
export type MaterialType = "concrete" | "brick" | "glass" | "wood" | "steel" | "drywall" | "stone" | "asphalt";

export interface SceneObject {
  id: string;
  type: "wall" | "door" | "window" | "floor" | "roof" | "stair" | "terrain" | "road" | "parking" | "vegetation" | "asset";
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
  mode: EditorMode;
  activeTool: BuildTool;
  cameraMode: CameraMode;
  selectedObjectId: string | null;
  objects: SceneObject[];
  layers: { id: string; name: string; visible: boolean; color: string }[];
  gridVisible: boolean;
  gridSnap: boolean;
  gridSize: number;
  showMeasurements: boolean;
  dayNightCycle: number; // 0-1, 0=midnight, 0.5=noon
  rightPanel: "properties" | "assets" | "layers" | "ai" | null;
  undoStack: SceneObject[][];
  redoStack: SceneObject[][];
}

type ViewerAction =
  | { type: "SET_MODE"; payload: EditorMode }
  | { type: "SET_TOOL"; payload: BuildTool }
  | { type: "SET_CAMERA_MODE"; payload: CameraMode }
  | { type: "SELECT_OBJECT"; payload: string | null }
  | { type: "ADD_OBJECT"; payload: SceneObject }
  | { type: "UPDATE_OBJECT"; payload: { id: string; changes: Partial<SceneObject> } }
  | { type: "DELETE_OBJECT"; payload: string }
  | { type: "SET_GRID_VISIBLE"; payload: boolean }
  | { type: "SET_GRID_SNAP"; payload: boolean }
  | { type: "SET_DAY_NIGHT"; payload: number }
  | { type: "SET_RIGHT_PANEL"; payload: ViewerState["rightPanel"] }
  | { type: "TOGGLE_LAYER"; payload: string }
  | { type: "UNDO" }
  | { type: "REDO" };

const defaultLayers = [
  { id: "architectural", name: "Architectural", visible: true, color: "hsl(0, 72%, 51%)" },
  { id: "structural", name: "Structural", visible: true, color: "hsl(220, 70%, 50%)" },
  { id: "mep", name: "MEP", visible: true, color: "hsl(140, 60%, 45%)" },
  { id: "site", name: "Site", visible: true, color: "hsl(35, 70%, 50%)" },
  { id: "landscape", name: "Landscape", visible: true, color: "hsl(120, 50%, 40%)" },
];

const initialState: ViewerState = {
  mode: "view",
  activeTool: "select",
  cameraMode: "orbit",
  selectedObjectId: null,
  objects: [],
  layers: defaultLayers,
  gridVisible: true,
  gridSnap: true,
  gridSize: 1,
  showMeasurements: false,
  dayNightCycle: 0.65,
  rightPanel: null,
  undoStack: [],
  redoStack: [],
};

function reducer(state: ViewerState, action: ViewerAction): ViewerState {
  switch (action.type) {
    case "SET_MODE":
      return { ...state, mode: action.payload, activeTool: action.payload === "build" ? "select" : "select" };
    case "SET_TOOL":
      return { ...state, activeTool: action.payload };
    case "SET_CAMERA_MODE":
      return { ...state, cameraMode: action.payload };
    case "SELECT_OBJECT":
      return { ...state, selectedObjectId: action.payload, rightPanel: action.payload ? "properties" : state.rightPanel };
    case "ADD_OBJECT":
      return {
        ...state,
        objects: [...state.objects, action.payload],
        undoStack: [...state.undoStack, state.objects],
        redoStack: [],
      };
    case "UPDATE_OBJECT":
      return {
        ...state,
        objects: state.objects.map((o) =>
          o.id === action.payload.id ? { ...o, ...action.payload.changes } : o
        ),
        undoStack: [...state.undoStack, state.objects],
        redoStack: [],
      };
    case "DELETE_OBJECT":
      return {
        ...state,
        objects: state.objects.filter((o) => o.id !== action.payload),
        selectedObjectId: state.selectedObjectId === action.payload ? null : state.selectedObjectId,
        undoStack: [...state.undoStack, state.objects],
        redoStack: [],
      };
    case "SET_GRID_VISIBLE":
      return { ...state, gridVisible: action.payload };
    case "SET_GRID_SNAP":
      return { ...state, gridSnap: action.payload };
    case "SET_DAY_NIGHT":
      return { ...state, dayNightCycle: action.payload };
    case "SET_RIGHT_PANEL":
      return { ...state, rightPanel: state.rightPanel === action.payload ? null : action.payload };
    case "TOGGLE_LAYER":
      return {
        ...state,
        layers: state.layers.map((l) =>
          l.id === action.payload ? { ...l, visible: !l.visible } : l
        ),
      };
    case "UNDO":
      if (state.undoStack.length === 0) return state;
      return {
        ...state,
        objects: state.undoStack[state.undoStack.length - 1],
        undoStack: state.undoStack.slice(0, -1),
        redoStack: [...state.redoStack, state.objects],
      };
    case "REDO":
      if (state.redoStack.length === 0) return state;
      return {
        ...state,
        objects: state.redoStack[state.redoStack.length - 1],
        redoStack: state.redoStack.slice(0, -1),
        undoStack: [...state.undoStack, state.objects],
      };
    default:
      return state;
  }
}

interface ViewerContextType {
  state: ViewerState;
  dispatch: React.Dispatch<ViewerAction>;
  addObject: (obj: Omit<SceneObject, "id">) => void;
  selectedObject: SceneObject | null;
}

const ViewerContext = createContext<ViewerContextType | null>(null);

export function ViewerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const addObject = useCallback(
    (obj: Omit<SceneObject, "id">) => {
      const id = `obj_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      dispatch({ type: "ADD_OBJECT", payload: { ...obj, id } });
    },
    [dispatch]
  );

  const selectedObject = state.selectedObjectId
    ? state.objects.find((o) => o.id === state.selectedObjectId) ?? null
    : null;

  return (
    <ViewerContext.Provider value={{ state, dispatch, addObject, selectedObject }}>
      {children}
    </ViewerContext.Provider>
  );
}

export function useViewer() {
  const ctx = useContext(ViewerContext);
  if (!ctx) throw new Error("useViewer must be used within ViewerProvider");
  return ctx;
}
