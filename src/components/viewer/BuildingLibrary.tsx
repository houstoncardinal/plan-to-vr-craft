import { useState } from "react";
import { Search, Grid3X3, List, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  BUILDING_COMPONENTS,
  COMPONENT_CATEGORIES,
  getComponentsByCategory,
  searchComponents,
} from "@/lib/buildingComponents";
import { useViewer } from "@/contexts/ViewerContext";

interface BuildingLibraryProps {
  onClose: () => void;
}

function BuildingCard({ component, onSelect }: { component: any; onSelect: () => void }) {
  return (
    <Card
      className="p-4 cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1 border-border"
      onClick={onSelect}
    >
      <div className="w-full h-20 rounded-lg mb-3 bg-gradient-to-br from-cardinal-light/20 to-cardinal-light/5 flex items-center justify-center">
        <div className="w-12 h-12 bg-cardinal rounded-lg flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-lg">
            {component.name.charAt(0)}
          </span>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="font-semibold text-sm text-foreground">{component.name}</h3>
        <p className="text-xs text-muted-foreground">{component.category}</p>
        <p className="text-xs text-muted-foreground line-clamp-2">{component.description}</p>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="secondary" className="text-xs">{component.type}</Badge>
          {component.variants && (
            <Badge variant="outline" className="text-xs">{component.variants.length} variants</Badge>
          )}
        </div>
      </div>
    </Card>
  );
}

function ComponentProperties({ component }: { component: any }) {
  const { updateObject, state } = useViewer();
  const [values, setValues] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    Object.entries(component.parameters).forEach(([key, config]: [string, any]) => {
      if (typeof config === "object" && config.default !== undefined) {
        initial[key] = config.default;
      }
    });
    return initial;
  });

  const handleValueChange = (key: string, newValue: number) => {
    setValues((prev) => ({ ...prev, [key]: newValue }));
    if (state.selectedObjectId) {
      updateObject(state.selectedObjectId, { properties: { ...values, [key]: newValue } });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-sm text-foreground">Properties</h3>
      {Object.entries(component.parameters).map(([key, config]: [string, any]) => {
        if (typeof config !== "object") return null;
        return (
          <div key={key} className="space-y-2">
            <Label className="text-xs font-medium text-foreground capitalize">
              {key.replace(/([A-Z])/g, " $1").trim()}
            </Label>
            <div className="flex items-center gap-3">
              <Slider
                value={[values[key] || config.default]}
                onValueChange={([value]) => handleValueChange(key, value)}
                min={config.min}
                max={config.max}
                step={config.step}
                className="flex-1"
              />
              <span className="text-xs text-muted-foreground w-12 text-right">
                {values[key] || config.default}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function BuildingLibrary({ onClose }: BuildingLibraryProps) {
  const { state, dispatch, addObject } = useViewer();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedComponent, setSelectedComponent] = useState<any>(null);

  const filteredComponents = searchQuery
    ? searchComponents(searchQuery)
    : selectedCategory === "All"
    ? Object.values(BUILDING_COMPONENTS)
    : getComponentsByCategory(selectedCategory);

  const handleComponentSelect = (component: any) => {
    const newObject = {
      type: component.geometry.type as any,
      position: [0, 0, 0] as [number, number, number],
      rotation: [0, 0, 0] as [number, number, number],
      scale: [
        component.geometry.parameters.width || 1,
        component.geometry.parameters.height || 1,
        component.geometry.parameters.length || 1,
      ] as [number, number, number],
      material: component.defaultMaterial,
      properties: { ...component.geometry.parameters },
      visible: true,
      locked: false,
      layer: "Default",
      name: component.name,
    };
    const id = addObject(newObject);
    dispatch({ type: "SELECT_OBJECT", payload: id });
    setSelectedComponent(component);
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold text-foreground">Building Components</h2>
          <div className="flex items-center gap-2">
            <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search components..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
        </div>
      </div>

      <div className="p-4 border-b border-border">
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-6 h-auto p-1">
            <TabsTrigger value="All" className="text-xs">All</TabsTrigger>
            {COMPONENT_CATEGORIES.slice(0, 5).map((category) => (
              <TabsTrigger key={category} value={category} className="text-xs">{category.slice(0, 3)}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-1 flex">
        <ScrollArea className="flex-1">
          <div className="p-4">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredComponents.map((component) => (
                  <BuildingCard key={component.id} component={component} onSelect={() => handleComponentSelect(component)} />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredComponents.map((component) => (
                  <Card key={component.id} className="p-3 cursor-pointer hover:shadow-md transition-all duration-200 border-border" onClick={() => handleComponentSelect(component)}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-cardinal/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-cardinal font-bold text-sm">{component.name.charAt(0)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm text-foreground truncate">{component.name}</h3>
                        <p className="text-xs text-muted-foreground">{component.category}</p>
                      </div>
                      <Plus className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>

        {selectedComponent && (
          <div className="w-80 border-l border-border bg-card p-4">
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-sm text-foreground mb-2">{selectedComponent.name}</h3>
                <p className="text-xs text-muted-foreground">{selectedComponent.description}</p>
              </div>
              <ComponentProperties component={selectedComponent} />
              <Button size="sm" className="w-full bg-gradient-cardinal text-primary-foreground shadow-cardinal hover:opacity-90" onClick={() => handleComponentSelect(selectedComponent)}>
                <Plus className="h-4 w-4 mr-2" />
                Add to Scene
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{filteredComponents.length} components</span>
          <span>Click to add to scene</span>
        </div>
      </div>
    </div>
  );
}
