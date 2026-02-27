import { useEffect } from "react";
import { ViewerProvider, useViewer } from "@/contexts/ViewerContext";
import ViewerHeader from "@/components/viewer/ViewerHeader";
import ViewerToolbar from "@/components/viewer/ViewerToolbar";
import SceneCanvas from "@/components/viewer/SceneCanvas";
import PropertiesPanel from "@/components/viewer/PropertiesPanel";
import AssetLibrary from "@/components/viewer/AssetLibrary";
import LayersPanel from "@/components/viewer/LayersPanel";
import AICopilot from "@/components/viewer/AICopilot";

function ViewerInner() {
  const { state, dispatch } = useViewer();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      // Undo
      if (e.key === "z" && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
        e.preventDefault();
        dispatch({ type: "UNDO" });
      }
      // Redo
      if ((e.key === "z" && (e.ctrlKey || e.metaKey) && e.shiftKey) ||
          (e.key === "y" && (e.ctrlKey || e.metaKey))) {
        e.preventDefault();
        dispatch({ type: "REDO" });
      }
      // Delete selected
      if ((e.key === "Delete" || e.key === "Backspace") && state.selectedObjectId) {
        e.preventDefault();
        dispatch({ type: "DELETE_OBJECT", payload: state.selectedObjectId });
      }
      // Deselect
      if (e.key === "Escape") {
        dispatch({ type: "SELECT_OBJECT", payload: null });
        dispatch({ type: "SET_TOOL", payload: "select" });
      }
      // Duplicate
      if (e.key === "d" && (e.ctrlKey || e.metaKey) && state.selectedObjectId) {
        e.preventDefault();
        dispatch({ type: "DUPLICATE_OBJECT", payload: state.selectedObjectId });
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [dispatch, state.selectedObjectId]);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <ViewerHeader />
      <div className="flex-1 flex min-h-0">
        <ViewerToolbar />
        <SceneCanvas />
        <PropertiesPanel />
        <AssetLibrary />
        <LayersPanel />
        <AICopilot />
      </div>
    </div>
  );
}

export default function Viewer() {
  return (
    <ViewerProvider>
      <ViewerInner />
    </ViewerProvider>
  );
}
