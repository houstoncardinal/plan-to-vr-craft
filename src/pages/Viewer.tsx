import { useEffect, useState } from "react";
import { ViewerProvider, useViewer } from "@/contexts/ViewerContext";
import ViewerHeader from "@/components/viewer/ViewerHeader";
import ViewerToolbar from "@/components/viewer/ViewerToolbar";
import SceneCanvas from "@/components/viewer/SceneCanvas";
import PropertiesPanel from "@/components/viewer/PropertiesPanel";
import AssetLibrary from "@/components/viewer/AssetLibrary";
import LayersPanel from "@/components/viewer/LayersPanel";
import AICopilot from "@/components/viewer/AICopilot";
import TemplatePicker from "@/components/viewer/TemplatePicker";

// Inner component so it can access ViewerContext
function ViewerInner() {
  const { state, dispatch } = useViewer();
  // Show template picker whenever the scene is empty (new session or NEW_PROJECT)
  const [showPicker, setShowPicker] = useState(() => state.objects.length === 0);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Ignore when typing in inputs
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      if (e.key === "z" && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
        e.preventDefault();
        dispatch({ type: "UNDO" });
      }
      if ((e.key === "z" && (e.ctrlKey || e.metaKey) && e.shiftKey) ||
          (e.key === "y" && (e.ctrlKey || e.metaKey))) {
        e.preventDefault();
        dispatch({ type: "REDO" });
      }
      // Save (⌘S / Ctrl+S)
      if (e.key === "s" && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
        e.preventDefault();
        const data = { version: "1.0", name: state.projectName, savedAt: new Date().toISOString(), objects: state.objects, dayNightCycle: state.dayNightCycle, season: state.season };
        const id = `proj_${Date.now()}`;
        localStorage.setItem(`vr-craft-project-${id}`, JSON.stringify(data));
        const list = JSON.parse(localStorage.getItem("vr-craft-projects") || "[]").filter((p: any) => p.name !== state.projectName);
        list.unshift({ id, name: state.projectName, savedAt: data.savedAt });
        localStorage.setItem("vr-craft-projects", JSON.stringify(list.slice(0, 20)));
      }
      // New project (⌘N / Ctrl+N)
      if (e.key === "n" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (window.confirm("Start a new project? Current scene will be discarded.")) {
          dispatch({ type: "NEW_PROJECT" });
        }
      }
      // Delete selected object
      if ((e.key === "Delete" || e.key === "Backspace") && state.selectedObjectId) {
        const obj = state.objects.find(o => o.id === state.selectedObjectId);
        if (obj && !obj.locked) {
          dispatch({ type: "DELETE_OBJECT", payload: state.selectedObjectId });
        }
      }
      // Duplicate selected object (Ctrl+D / ⌘D)
      if (e.key === "d" && (e.ctrlKey || e.metaKey) && state.selectedObjectId) {
        e.preventDefault();
        const obj = state.objects.find(o => o.id === state.selectedObjectId);
        if (obj && !obj.locked) {
          dispatch({ type: "DUPLICATE_OBJECT", payload: state.selectedObjectId });
        }
      }
      // Escape: deselect / exit placement
      if (e.key === "Escape") {
        dispatch({ type: "SELECT_OBJECT", payload: null });
        dispatch({ type: "SET_TOOL", payload: "select" });
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [dispatch, state.selectedObjectId, state.objects, state.projectName, state.dayNightCycle, state.season]);

  // Re-show picker when the user starts a NEW_PROJECT and clears the scene
  useEffect(() => {
    if (state.objects.length === 0) setShowPicker(true);
  }, [state.objects.length]);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <ViewerHeader />
      <div className="flex-1 flex min-h-0">
        <ViewerToolbar />
        <SceneCanvas />
        <PropertiesPanel />
        <AssetLibrary />
        <LayersPanel />
      </div>
      {/* AICopilot is a fixed floating overlay — rendered outside the sidebar row */}
      <AICopilot />
      {/* Template picker — shown on first load or after File → New Project */}
      {showPicker && <TemplatePicker onDismiss={() => setShowPicker(false)} />}
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
