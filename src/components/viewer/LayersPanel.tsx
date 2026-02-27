import { motion } from "framer-motion";
import { useViewer } from "@/contexts/ViewerContext";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { X, Eye, EyeOff } from "lucide-react";

export default function LayersPanel() {
  const { state, dispatch } = useViewer();

  if (state.rightPanel !== "layers") return null;

  const objectsByLayer = state.layers.map((layer) => ({
    ...layer,
    objects: state.objects.filter((o) => o.layer === layer.id),
  }));

  return (
    <motion.aside
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 340, damping: 32 }}
      className="fixed right-0 top-12 bottom-0 w-72 border-l border-border bg-card flex flex-col z-40 shadow-2xl"
    >
      <div className="h-10 border-b border-border flex items-center justify-between px-3">
        <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Layers</span>
        <Button
          variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground"
          onClick={() => dispatch({ type: "SET_RIGHT_PANEL", payload: null })}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {objectsByLayer.map((layer) => (
            <div key={layer.id} className="rounded-lg border border-border">
              <div className="flex items-center gap-2 p-2">
                <div className="h-3 w-3 rounded-full" style={{ background: layer.color }} />
                <span className="text-xs font-medium text-foreground flex-1">{layer.name}</span>
                <span className="text-[10px] text-muted-foreground">{layer.objects.length}</span>
                <Button
                  variant="ghost" size="icon" className="h-6 w-6"
                  onClick={() => dispatch({ type: "TOGGLE_LAYER", payload: layer.id })}
                >
                  {layer.visible ? (
                    <Eye className="h-3 w-3 text-muted-foreground" />
                  ) : (
                    <EyeOff className="h-3 w-3 text-muted-foreground" />
                  )}
                </Button>
              </div>

              {layer.objects.length > 0 && layer.visible && (
                <div className="border-t border-border px-2 py-1">
                  {layer.objects.map((obj) => (
                    <button
                      key={obj.id}
                      onClick={() => dispatch({ type: "SELECT_OBJECT", payload: obj.id })}
                      className={`w-full text-left px-2 py-1 rounded text-[11px] transition-colors ${
                        state.selectedObjectId === obj.id
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      {obj.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </motion.aside>
  );
}
