import { motion, AnimatePresence } from "framer-motion";
import { useViewer, MaterialType } from "@/contexts/ViewerContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Trash2, Copy, Lock, Unlock } from "lucide-react";

const materials: { value: MaterialType; label: string }[] = [
  { value: "concrete", label: "Concrete" },
  { value: "brick", label: "Brick" },
  { value: "glass", label: "Glass" },
  { value: "wood", label: "Wood" },
  { value: "steel", label: "Steel" },
  { value: "drywall", label: "Drywall" },
  { value: "stone", label: "Stone" },
  { value: "asphalt", label: "Asphalt" },
];

export default function PropertiesPanel() {
  const { state, dispatch, selectedObject } = useViewer();

  if (state.rightPanel !== "properties") return null;

  return (
    <motion.aside
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 20, opacity: 0 }}
      className="w-72 border-l border-border bg-card flex flex-col"
    >
      <div className="h-10 border-b border-border flex items-center justify-between px-3">
        <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Properties</span>
        <Button
          variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground"
          onClick={() => dispatch({ type: "SET_RIGHT_PANEL", payload: null })}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        {selectedObject ? (
          <div className="p-3 space-y-4">
            {/* Name */}
            <div className="space-y-1.5">
              <Label className="text-[11px] text-muted-foreground uppercase tracking-wider">Name</Label>
              <Input
                value={selectedObject.name}
                onChange={(e) =>
                  dispatch({ type: "UPDATE_OBJECT", payload: { id: selectedObject.id, changes: { name: e.target.value } } })
                }
                className="h-8 text-xs"
              />
            </div>

            {/* Type badge */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium capitalize">
                {selectedObject.type}
              </span>
              <span className="text-[10px] text-muted-foreground">ID: {selectedObject.id.slice(-6)}</span>
            </div>

            {/* Position */}
            <div className="space-y-1.5">
              <Label className="text-[11px] text-muted-foreground uppercase tracking-wider">Position</Label>
              <div className="grid grid-cols-3 gap-1.5">
                {["X", "Y", "Z"].map((axis, i) => (
                  <div key={axis} className="space-y-0.5">
                    <span className="text-[10px] text-muted-foreground">{axis}</span>
                    <Input
                      type="number"
                      value={selectedObject.position[i].toFixed(2)}
                      onChange={(e) => {
                        const pos = [...selectedObject.position] as [number, number, number];
                        pos[i] = parseFloat(e.target.value) || 0;
                        dispatch({ type: "UPDATE_OBJECT", payload: { id: selectedObject.id, changes: { position: pos } } });
                      }}
                      className="h-7 text-[11px] px-1.5"
                      step={0.1}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Scale */}
            <div className="space-y-1.5">
              <Label className="text-[11px] text-muted-foreground uppercase tracking-wider">Scale</Label>
              <div className="grid grid-cols-3 gap-1.5">
                {["W", "H", "D"].map((axis, i) => (
                  <div key={axis} className="space-y-0.5">
                    <span className="text-[10px] text-muted-foreground">{axis}</span>
                    <Input
                      type="number"
                      value={selectedObject.scale[i].toFixed(2)}
                      onChange={(e) => {
                        const s = [...selectedObject.scale] as [number, number, number];
                        s[i] = parseFloat(e.target.value) || 0.1;
                        dispatch({ type: "UPDATE_OBJECT", payload: { id: selectedObject.id, changes: { scale: s } } });
                      }}
                      className="h-7 text-[11px] px-1.5"
                      step={0.1}
                      min={0.1}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Material */}
            <div className="space-y-1.5">
              <Label className="text-[11px] text-muted-foreground uppercase tracking-wider">Material</Label>
              <Select
                value={selectedObject.material}
                onValueChange={(v) =>
                  dispatch({ type: "UPDATE_OBJECT", payload: { id: selectedObject.id, changes: { material: v as MaterialType } } })
                }
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {materials.map((m) => (
                    <SelectItem key={m.value} value={m.value} className="text-xs">{m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Visibility & Lock */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-[11px] text-muted-foreground">Visible</Label>
                <Switch
                  checked={selectedObject.visible}
                  onCheckedChange={(v) =>
                    dispatch({ type: "UPDATE_OBJECT", payload: { id: selectedObject.id, changes: { visible: v } } })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-[11px] text-muted-foreground">Locked</Label>
                <Switch
                  checked={selectedObject.locked}
                  onCheckedChange={(v) =>
                    dispatch({ type: "UPDATE_OBJECT", payload: { id: selectedObject.id, changes: { locked: v } } })
                  }
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-1.5 pt-2 border-t border-border">
              <Button variant="outline" size="sm" className="flex-1 h-8 text-xs gap-1">
                <Copy className="h-3 w-3" />
                Duplicate
              </Button>
              <Button
                variant="destructive" size="sm" className="h-8 text-xs gap-1"
                onClick={() => dispatch({ type: "DELETE_OBJECT", payload: selectedObject.id })}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-6 flex flex-col items-center justify-center text-center gap-2 mt-10">
            <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center">
              <MousePointer2 className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">Select an object to<br/>view its properties</p>
          </div>
        )}
      </ScrollArea>
    </motion.aside>
  );
}

function MousePointer2(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z"/>
    </svg>
  );
}
