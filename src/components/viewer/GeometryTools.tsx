import { useState, useCallback } from "react";
import { useViewer } from "@/contexts/ViewerContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Copy, Trash2, Grid3X3, Circle, Square, Box, Minus, Plus,
} from "lucide-react";

interface GeometryToolsProps {
  onClose: () => void;
}

function TransformControls({ objectId }: { objectId: string }) {
  const { state, updateObject } = useViewer();
  const object = state.objects.find((obj) => obj.id === objectId);
  if (!object) return null;

  const handleChange = (
    prop: "position" | "rotation" | "scale",
    axis: "x" | "y" | "z",
    value: number
  ) => {
    const idx = axis === "x" ? 0 : axis === "y" ? 1 : 2;
    const arr = [...object[prop]] as [number, number, number];
    arr[idx] = value;
    updateObject(objectId, { [prop]: arr });
  };

  const configs = [
    { label: "Position", prop: "position" as const, min: -50, max: 50, step: 0.1 },
    { label: "Rotation", prop: "rotation" as const, min: -Math.PI, max: Math.PI, step: 0.01 },
    { label: "Scale", prop: "scale" as const, min: 0.1, max: 10, step: 0.1 },
  ];

  return (
    <div className="space-y-6">
      <h3 className="font-medium text-sm text-foreground mb-4">Transform</h3>
      {configs.map(({ label, prop, min, max, step }) => (
        <div key={prop} className="space-y-3">
          <Label className="text-xs font-medium text-foreground">{label}</Label>
          {(["x", "y", "z"] as const).map((axis) => {
            const idx = axis === "x" ? 0 : axis === "y" ? 1 : 2;
            return (
              <div key={axis} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-4">{axis.toUpperCase()}</span>
                <Slider
                  value={[object[prop][idx]]}
                  onValueChange={([v]) => handleChange(prop, axis, v)}
                  min={min}
                  max={max}
                  step={step}
                  className="flex-1"
                />
                <Input
                  type="number"
                  value={object[prop][idx].toFixed(prop === "rotation" ? 2 : 1)}
                  onChange={(e) => handleChange(prop, axis, parseFloat(e.target.value))}
                  className="w-16 h-6 text-xs"
                />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function PrimitiveCreator() {
  const { addObject } = useViewer();

  const createPrimitive = useCallback(
    (type: string) => {
      const primitives: Record<string, { scale: [number, number, number]; position: [number, number, number] }> = {
        cube: { scale: [2, 2, 2], position: [0, 1, 0] },
        sphere: { scale: [2, 2, 2], position: [0, 1, 0] },
        cylinder: { scale: [1, 3, 1], position: [0, 1.5, 0] },
        cone: { scale: [2, 3, 2], position: [0, 1.5, 0] },
        torus: { scale: [2, 2, 2], position: [0, 1, 0] },
        plane: { scale: [4, 0.1, 4], position: [0, 0, 0] },
      };
      const p = primitives[type];
      if (!p) return;
      addObject({
        type: "component" as any,
        position: p.position,
        rotation: [0, 0, 0],
        scale: p.scale,
        properties: { primitiveType: type },
        material: "concrete",
        layer: "Default",
        visible: true,
        locked: false,
        name: type.charAt(0).toUpperCase() + type.slice(1),
      });
    },
    [addObject]
  );

  const primitives = [
    { type: "cube", icon: Box, label: "Cube" },
    { type: "sphere", icon: Circle, label: "Sphere" },
    { type: "cylinder", icon: Square, label: "Cylinder" },
    { type: "cone", icon: Square, label: "Cone" },
    { type: "torus", icon: Circle, label: "Torus" },
    { type: "plane", icon: Square, label: "Plane" },
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {primitives.map(({ type, icon: Icon, label }) => (
        <Button key={type} variant="outline" size="sm" onClick={() => createPrimitive(type)} className="h-12 flex flex-col gap-1">
          <Icon className="h-4 w-4" />
          <span className="text-xs">{label}</span>
        </Button>
      ))}
    </div>
  );
}

function ArrayTools() {
  const { state, addObject } = useViewer();
  const [settings, setSettings] = useState({ count: 3, spacing: 2, direction: "x" as "x" | "y" | "z" });

  const createArray = useCallback(() => {
    if (!state.selectedObjectId) return;
    const src = state.objects.find((o) => o.id === state.selectedObjectId);
    if (!src) return;
    for (let i = 1; i < settings.count; i++) {
      const pos = [...src.position] as [number, number, number];
      const idx = settings.direction === "x" ? 0 : settings.direction === "y" ? 1 : 2;
      pos[idx] += i * settings.spacing;
      addObject({ ...src, position: pos, name: `${src.name} ${i + 1}`, rotation: [...src.rotation] as [number, number, number], scale: [...src.scale] as [number, number, number] });
    }
  }, [state.selectedObjectId, state.objects, settings, addObject]);

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-xs font-medium text-foreground">Count</Label>
        <div className="flex items-center gap-2 mt-1">
          <Button size="sm" variant="outline" onClick={() => setSettings((p) => ({ ...p, count: Math.max(2, p.count - 1) }))}>
            <Minus className="h-3 w-3" />
          </Button>
          <Input type="number" value={settings.count} onChange={(e) => setSettings((p) => ({ ...p, count: parseInt(e.target.value) || 2 }))} className="flex-1 h-8 text-center" />
          <Button size="sm" variant="outline" onClick={() => setSettings((p) => ({ ...p, count: Math.min(20, p.count + 1) }))}>
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <div>
        <Label className="text-xs font-medium text-foreground">Spacing</Label>
        <Slider value={[settings.spacing]} onValueChange={([v]) => setSettings((p) => ({ ...p, spacing: v }))} min={0.5} max={10} step={0.1} className="mt-1" />
      </div>
      <div>
        <Label className="text-xs font-medium text-foreground mb-2 block">Direction</Label>
        <div className="grid grid-cols-3 gap-1">
          {(["x", "y", "z"] as const).map((d) => (
            <Button key={d} size="sm" variant={settings.direction === d ? "default" : "outline"} onClick={() => setSettings((p) => ({ ...p, direction: d }))} className="h-8">
              {d.toUpperCase()}
            </Button>
          ))}
        </div>
      </div>
      <Button onClick={createArray} disabled={!state.selectedObjectId} className="w-full bg-gradient-cardinal text-primary-foreground shadow-cardinal hover:opacity-90" size="sm">
        <Grid3X3 className="h-4 w-4 mr-2" />
        Create Array
      </Button>
    </div>
  );
}

export default function GeometryTools({ onClose }: GeometryToolsProps) {
  const { state, deleteObject, duplicateObject } = useViewer();
  const selectedObject = state.objects.find((o) => o.id === state.selectedObjectId);

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="p-4 border-b border-border">
        <h2 className="font-display text-lg font-semibold text-foreground">Geometry Tools</h2>
        {selectedObject && <p className="text-xs text-muted-foreground mt-1">Selected: {selectedObject.name}</p>}
      </div>

      <div className="flex-1 overflow-auto">
        <Tabs defaultValue="transform" className="h-full flex flex-col">
          <div className="p-4 border-b border-border">
            <TabsList className="grid w-full grid-cols-3 h-auto">
              <TabsTrigger value="transform" className="text-xs">Transform</TabsTrigger>
              <TabsTrigger value="create" className="text-xs">Create</TabsTrigger>
              <TabsTrigger value="array" className="text-xs">Array</TabsTrigger>
            </TabsList>
          </div>
          <div className="flex-1 p-4">
            <TabsContent value="transform" className="mt-0">
              {selectedObject ? <TransformControls objectId={selectedObject.id} /> : <div className="text-center text-muted-foreground text-sm">Select an object to transform</div>}
            </TabsContent>
            <TabsContent value="create" className="mt-0"><PrimitiveCreator /></TabsContent>
            <TabsContent value="array" className="mt-0"><ArrayTools /></TabsContent>
          </div>
        </Tabs>
      </div>

      {selectedObject && (
        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => duplicateObject(selectedObject.id)} className="flex-1">
              <Copy className="h-4 w-4 mr-2" />Duplicate
            </Button>
            <Button size="sm" variant="outline" onClick={() => deleteObject(selectedObject.id)} className="flex-1 text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
