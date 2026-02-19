import { useEffect } from "react";
import { ViewerProvider } from "@/contexts/ViewerContext";
import ViewerHeader from "@/components/viewer/ViewerHeader";
import ViewerToolbar from "@/components/viewer/ViewerToolbar";
import SceneCanvas from "@/components/viewer/SceneCanvas";
import PropertiesPanel from "@/components/viewer/PropertiesPanel";
import AssetLibrary from "@/components/viewer/AssetLibrary";
import LayersPanel from "@/components/viewer/LayersPanel";
import AICopilot from "@/components/viewer/AICopilot";

export default function Viewer() {
  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "z" && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
        e.preventDefault();
        document.dispatchEvent(new CustomEvent("viewer-undo"));
      }
      if (e.key === "z" && (e.ctrlKey || e.metaKey) && e.shiftKey) {
        e.preventDefault();
        document.dispatchEvent(new CustomEvent("viewer-redo"));
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <ViewerProvider>
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
    </ViewerProvider>
  );
}
